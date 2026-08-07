import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";

// ──────────────────────────────────────────────────────────────────────────
// Progreso persistente (Fase 5 — nube).
// localStorage sigue siendo la capa local optimista (`mastery_hub_<key>` y
// `mastery_hub_last`): la UI funciona al instante, en modo demo y sin red.
// Cuando hay Supabase + sesión, además se sincroniza con `progress` y
// `user_state` mediante merge ADITIVO (nunca borra). Regla de negocio:
// "cualquier autenticado practica, pero solo suscritos guardan progreso" —
// la RLS de `progress` bloquea el INSERT/UPDATE sin enrollment; el error se
// captura y se expone (`lastPersistError` / `hasUnsynced`) sin romper la UX.
// SSR-safe: nada de window/localStorage durante el render.
// ──────────────────────────────────────────────────────────────────────────

const PREFIX = "mastery_hub_";
const LAST_KEY = "mastery_hub_last";

type ProgressMap = Record<string, number[]>;

/** Último ejercicio abierto (para "Continuar donde lo dejaste"). */
export interface LastVisited {
  key: string;
  index: number;
  at: number;
}

interface ProgressRow {
  module_key: string;
  exercise_ref: number;
}

interface UserStateRow {
  last_module_key: string | null;
  last_exercise_index: number | null;
  updated_at: string | null;
}

function readAll(keys: string[]): ProgressMap {
  const map: ProgressMap = {};
  if (typeof localStorage === "undefined") return map;
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      map[key] = raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      map[key] = [];
    }
  }
  return map;
}

function readLast(): LastVisited | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as LastVisited) : null;
  } catch {
    return null;
  }
}

function writeModule(key: string, ids: number[]) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(ids));
  } catch {
    /* almacenamiento no disponible */
  }
}

function writeLast(value: LastVisited) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Unión (aditiva) de lo local con las filas de `progress` de la nube. */
function mergeRows(local: ProgressMap, rows: ProgressRow[]): ProgressMap {
  const merged: ProgressMap = { ...local };
  for (const row of rows) {
    const list = merged[row.module_key] ?? [];
    if (!list.includes(row.exercise_ref)) {
      merged[row.module_key] = [...list, row.exercise_ref];
    }
  }
  return merged;
}

/**
 * Distingue el bloqueo por RLS (sin suscripción) del resto de errores.
 * PostgREST devuelve código 42501 para violaciones de row-level security.
 */
function isRlsBlocked(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  if (!e) return false;
  if (typeof e.code === "string" && e.code === "42501") return true;
  return typeof e.message === "string" && /row-level security/i.test(e.message);
}

export function useProgress(moduleKeys: string[]) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [lastVisited, setLastVisitedState] = useState<LastVisited | null>(null);
  const [unsyncedModules, setUnsyncedModules] = useState<string[]>([]);
  const [lastPersistError, setLastPersistError] = useState<string | null>(null);

  const progressRef = useRef<ProgressMap>({});
  const userIdRef = useRef<string | null>(null);
  const unsyncedRef = useRef<string[]>([]);

  const addUnsynced = useCallback((key: string) => {
    setUnsyncedModules((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      unsyncedRef.current = next;
      return next;
    });
  }, []);

  const removeUnsynced = useCallback((key: string) => {
    setUnsyncedModules((prev) => {
      if (!prev.includes(key)) return prev;
      const next = prev.filter((k) => k !== key);
      unsyncedRef.current = next;
      return next;
    });
  }, []);

  // "Continuar" en la nube (user_state). Errores ignorados: lo local ya se guardó.
  const persistLastVisited = useCallback(async (key: string, index: number) => {
    const supabase = getSupabase();
    const uid = userIdRef.current;
    if (!supabase || !uid) return;
    await supabase
      .from("user_state")
      .upsert(
        {
          user_id: uid,
          last_module_key: key,
          last_exercise_index: index,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
  }, []);

  // Migra (aditivo) todo el progreso local de un módulo a la nube.
  const migrateModule = useCallback(
    async (moduleKey: string) => {
      const supabase = getSupabase();
      const uid = userIdRef.current;
      if (!supabase || !uid) return;
      const ids = progressRef.current[moduleKey] ?? [];
      if (ids.length === 0) return;
      const rows = ids.map((exercise_ref) => ({
        user_id: uid,
        module_key: moduleKey,
        exercise_ref,
      }));
      const { error } = await supabase
        .from("progress")
        .upsert(rows, { onConflict: "user_id,module_key,exercise_ref" });
      if (!error) {
        removeUnsynced(moduleKey);
      } else if (isRlsBlocked(error)) {
        // Sin suscripción: se ignora en silencio; el progreso local se
        // conserva y se migrará al suscribirse (Fase 6 → `syncModule`).
        addUnsynced(moduleKey);
      }
      // Otros errores (red) se ignoran: el local sigue siendo la capa de respaldo.
    },
    [addUnsynced, removeUnsynced],
  );

  // Reintento público para Fase 6: tras suscribirse, migrar un módulo entero.
  const syncModule = useCallback(
    async (moduleKey: string) => {
      const wasUnsynced = unsyncedRef.current.includes(moduleKey);
      await migrateModule(moduleKey);
      if (wasUnsynced && !unsyncedRef.current.includes(moduleKey)) {
        setLastPersistError(null);
      }
    },
    [migrateModule],
  );

  // Escritura de `markComplete` en la nube (upsert). Sin reintentos en bucle.
  const persistToCloud = useCallback(
    async (moduleKey: string, exerciseId: number) => {
      const supabase = getSupabase();
      const uid = userIdRef.current;
      if (!supabase || !uid) return;
      const { error } = await supabase
        .from("progress")
        .upsert(
          { user_id: uid, module_key: moduleKey, exercise_ref: exerciseId },
          { onConflict: "user_id,module_key,exercise_ref" },
        );
      if (!error) {
        // Si el módulo estaba pendiente (p. ej. justo tras suscribirse),
        // migra de una vez todo el progreso local que quedó atrás.
        if (unsyncedRef.current.includes(moduleKey)) {
          void syncModule(moduleKey);
        }
        return;
      }
      if (isRlsBlocked(error)) {
        addUnsynced(moduleKey);
        setLastPersistError("Suscríbete para guardar tu progreso");
      }
      // Otros errores (red) se ignoran: el estado local ya está guardado.
    },
    [addUnsynced, syncModule],
  );

  // Carga inicial: lo local al instante (UI) y, con sesión, merge + migración.
  useEffect(() => {
    const local = readAll(moduleKeys);
    const localLast = readLast();
    progressRef.current = local;
    setProgress(local);
    setLastVisitedState(localLast);

    const supabase = getSupabase();
    const uid = user?.id;
    if (!supabase || !uid || uid.startsWith("demo:")) {
      userIdRef.current = null;
      unsyncedRef.current = [];
      setUnsyncedModules([]);
      setLastPersistError(null);
      return;
    }
    userIdRef.current = uid;
    let active = true;

    void (async () => {
      // 1) Merge aditivo con `progress`: lo local se conserva, la nube suma.
      try {
        const { data: rows } = await supabase
          .from("progress")
          .select("module_key, exercise_ref")
          .eq("user_id", uid);
        if (!active) return;
        const merged = mergeRows(local, (rows ?? []) as ProgressRow[]);
        progressRef.current = merged;
        setProgress(merged);
        for (const [key, ids] of Object.entries(merged)) {
          if (ids.length > 0) writeModule(key, ids);
        }
      } catch {
        /* sin red: se queda con lo local */
      }

      // 2) "Continuar" desde `user_state` (el más reciente gana).
      try {
        const { data: stateRow } = await supabase
          .from("user_state")
          .select("last_module_key, last_exercise_index, updated_at")
          .eq("user_id", uid)
          .maybeSingle();
        if (!active || !stateRow) return;
        const cloud = stateRow as UserStateRow;
        if (cloud.last_module_key != null && cloud.last_exercise_index != null) {
          const parsed = Date.parse(cloud.updated_at ?? "");
          const cloudVisited: LastVisited = {
            key: cloud.last_module_key,
            index: cloud.last_exercise_index,
            at: Number.isFinite(parsed) ? parsed : 0,
          };
          setLastVisitedState((prev) => {
            if (prev && prev.at >= cloudVisited.at) return prev;
            writeLast(cloudVisited);
            return cloudVisited;
          });
        }
      } catch {
        /* sin red: se queda con lo local */
      }

      // 3) Migración automática local → nube (aditiva). Los módulos sin
      //    suscripción fallan por RLS y quedan marcados como `unsynced`.
      for (const key of moduleKeys) {
        const ids = local[key];
        if (ids && ids.length > 0) await migrateModule(key);
      }
    })();

    return () => {
      active = false;
    };
  }, [moduleKeys, user?.id, migrateModule]);

  const setLastVisited = useCallback(
    (key: string, index: number) => {
      setLastVisitedState((prev) => {
        if (prev && prev.key === key && prev.index === index) return prev;
        const next: LastVisited = { key, index, at: Date.now() };
        writeLast(next);
        void persistLastVisited(key, index);
        return next;
      });
    },
    [persistLastVisited],
  );

  const isCompleted = useCallback(
    (moduleKey: string, exerciseId: number) =>
      progress[moduleKey]?.includes(exerciseId) ?? false,
    [progress],
  );

  const markComplete = useCallback(
    (moduleKey: string, exerciseId: number) => {
      const current = progressRef.current[moduleKey] ?? [];
      if (current.includes(exerciseId)) return;
      const next = [...current, exerciseId];
      const nextMap = { ...progressRef.current, [moduleKey]: next };
      progressRef.current = nextMap;
      writeModule(moduleKey, next);
      setProgress(nextMap);
      void persistToCloud(moduleKey, exerciseId);
    },
    [persistToCloud],
  );

  const getPercent = useCallback(
    (moduleKey: string, total: number) => {
      if (!total) return 0;
      const done = progress[moduleKey]?.length ?? 0;
      return Math.round((done / total) * 100);
    },
    [progress],
  );

  // ── Backup: exportar / importar progreso (JSON) ─────────────────────────
  const exportProgress = useCallback((): string => {
    return JSON.stringify(
      {
        app: "developer-mastery-hub",
        version: 1,
        exportedAt: new Date().toISOString(),
        progress,
        lastVisited,
      },
      null,
      2,
    );
  }, [progress, lastVisited]);

  /**
   * Importa un backup. Fusiona (union) los ids completados por modulo para no
   * perder el progreso existente. Devuelve true si el archivo era valido.
   */
  const importProgress = useCallback(
    (raw: string): boolean => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return false;
      }
      const incoming = (parsed as { progress?: unknown })?.progress;
      if (!incoming || typeof incoming !== "object") return false;

      const merged: ProgressMap = { ...progressRef.current };
      for (const [key, value] of Object.entries(incoming as ProgressMap)) {
        if (!Array.isArray(value)) continue;
        const ids = value.filter(
          (n): n is number => typeof n === "number" && Number.isFinite(n),
        );
        const union = Array.from(new Set([...(merged[key] ?? []), ...ids]));
        merged[key] = union;
        writeModule(key, union);
        if (union.length > (progressRef.current[key]?.length ?? 0)) {
          void syncModule(key);
        }
      }
      progressRef.current = merged;
      setProgress(merged);

      const last = (parsed as { lastVisited?: LastVisited }).lastVisited;
      if (last && typeof last.key === "string" && typeof last.index === "number") {
        setLastVisitedState(last);
        writeLast(last);
      }
      return true;
    },
    [syncModule],
  );

  return {
    progress,
    isCompleted,
    markComplete,
    getPercent,
    lastVisited,
    setLastVisited,
    exportProgress,
    importProgress,
    // ── Nuevos (aditivos) — señal de sincronización para la UI ────────────
    hasUnsynced: unsyncedModules.length > 0,
    unsyncedModules,
    lastPersistError,
    syncModule,
  };
}
