import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";

// ──────────────────────────────────────────────────────────────────────────
// Progreso persistente (Fase 5 — nube).
// localStorage sigue siendo la capa local optimista (`mastery_hub_<uid>_<key>`
// y `mastery_hub_last_<uid>`, scoped por usuario — Fase 8 M3): la UI funciona
// al instante, en modo demo y sin red. Las claves sin scope (legacy) se
// migran UNA vez al primer uso con un uid y se borran, para que un navegador
// compartido no contamine el progreso de otros usuarios.
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

/** Clave de un módulo: scoped por uid; sin uid, fallback a la clave legacy. */
function moduleKey(moduleKey: string, uid: string | null): string {
  return uid ? `${PREFIX}${uid}_${moduleKey}` : PREFIX + moduleKey;
}

/** Clave de "último visitado": scoped por uid; sin uid, fallback legacy. */
function lastKey(uid: string | null): string {
  return uid ? `${LAST_KEY}_${uid}` : LAST_KEY;
}

function readAll(keys: string[], uid: string | null): ProgressMap {
  const map: ProgressMap = {};
  if (typeof localStorage === "undefined") return map;
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(moduleKey(key, uid));
      map[key] = raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      map[key] = [];
    }
  }
  return map;
}

function readLast(uid: string | null): LastVisited | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(lastKey(uid));
    return raw ? (JSON.parse(raw) as LastVisited) : null;
  } catch {
    return null;
  }
}

function writeModule(uid: string | null, key: string, ids: number[]) {
  try {
    localStorage.setItem(moduleKey(key, uid), JSON.stringify(ids));
  } catch {
    /* almacenamiento no disponible */
  }
}

function writeLast(uid: string | null, value: LastVisited) {
  try {
    localStorage.setItem(lastKey(uid), JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

function removeLocal(key: string) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* almacenamiento no disponible */
  }
}

/**
 * Fase 8 (M3): migración única legacy → scoped.
 * Si existe progreso bajo las claves sin scope (`mastery_hub_<key>`) y aún no
 * hay datos scoped para `uid`, copia el progreso a las claves scoped y BORRA
 * las legacy para que no contaminen a otros usuarios del navegador compartido.
 * Devuelve el progreso legacy migrado (o vacío si no había nada que migrar).
 */
function migrateLegacyToScoped(
  uid: string,
  moduleKeys: string[],
): { local: ProgressMap; localLast: LastVisited | null } {
  const legacyAll = readAll(moduleKeys, null);
  const legacyLast = readLast(null);
  const hasLegacy =
    legacyLast !== null ||
    Object.values(legacyAll).some((ids) => ids.length > 0);
  if (!hasLegacy) return { local: {}, localLast: null };

  for (const [key, ids] of Object.entries(legacyAll)) {
    if (ids.length > 0) writeModule(uid, key, ids);
  }
  if (legacyLast) writeLast(uid, legacyLast);
  for (const key of moduleKeys) removeLocal(PREFIX + key);
  removeLocal(LAST_KEY);
  return { local: legacyAll, localLast: legacyLast };
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
  // Fase 8 (M3): el progreso local se lee con scope por uid; si no existe
  // todavía y hay claves legacy (pre-scope), se migran una sola vez.
  useEffect(() => {
    const uid = user?.id ?? null;

    let local: ProgressMap;
    let localLast: LastVisited | null;
    if (uid) {
      const scoped = readAll(moduleKeys, uid);
      const scopedLast = readLast(uid);
      const hasScoped =
        scopedLast !== null ||
        Object.values(scoped).some((ids) => ids.length > 0);
      if (hasScoped) {
        local = scoped;
        localLast = scopedLast;
      } else {
        const migrated = migrateLegacyToScoped(uid, moduleKeys);
        local = migrated.local;
        localLast = migrated.localLast;
      }
    } else {
      // Sin sesión: fallback a las claves sin scope (por seguridad).
      local = readAll(moduleKeys, null);
      localLast = readLast(null);
    }

    progressRef.current = local;
    setProgress(local);
    setLastVisitedState(localLast);

    const supabase = getSupabase();
    userIdRef.current = uid;
    if (!supabase || !uid || uid.startsWith("demo:")) {
      unsyncedRef.current = [];
      setUnsyncedModules([]);
      setLastPersistError(null);
      return;
    }
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
          if (ids.length > 0) writeModule(uid, key, ids);
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
            writeLast(uid, cloudVisited);
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
        writeLast(userIdRef.current, next);
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
      writeModule(userIdRef.current, moduleKey, next);
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
        writeModule(userIdRef.current, key, union);
        if (union.length > (progressRef.current[key]?.length ?? 0)) {
          void syncModule(key);
        }
      }
      progressRef.current = merged;
      setProgress(merged);

      const last = (parsed as { lastVisited?: LastVisited }).lastVisited;
      if (last && typeof last.key === "string" && typeof last.index === "number") {
        setLastVisitedState(last);
        writeLast(userIdRef.current, last);
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
