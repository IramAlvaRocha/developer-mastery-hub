import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";

// ──────────────────────────────────────────────────────────────────────────
// useEnrollments — Fase 6 (Mis Cursos).
// Suscripciones del usuario (`enrollments`). Regla de negocio: "cualquier
// autenticado practica, pero solo suscritos guardan progreso" — el enrollment
// es lo que habilita persistir en `progress` (la RLS lo exige).
//
// • Modo Supabase: SELECT/INSERT/DELETE sobre `enrollments` con RLS del
//   propio usuario y caché en localStorage (SWR ligero, por usuario).
// • Modo demo (sin credenciales o usuario `demo:`): simula la misma API en
//   localStorage bajo la clave `dmh-enrollments`.
//
// `enroll` acepta (opcional) un callback `syncModule` de useProgress para
// migrar el progreso local pendiente del módulo a la nube justo después de
// suscribirse. SSR-safe: nada de window/localStorage durante el render.
// ──────────────────────────────────────────────────────────────────────────

const DEMO_KEY = "dmh-enrollments";
const CACHE_PREFIX = "dmh-enrollments-";

interface EnrollmentRow {
  module_key: string;
  last_opened_at: string | null;
}

interface EnrollCache {
  savedAt: number;
  keys: string[];
}

function readDemoKeys(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((k): k is string => typeof k === "string");
  } catch {
    return [];
  }
}

function writeDemoKeys(keys: string[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(keys));
  } catch {
    /* almacenamiento no disponible */
  }
}

function readCacheKeys(uid: string): string[] | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + uid);
    const parsed = raw ? (JSON.parse(raw) as EnrollCache) : null;
    if (!parsed || !Array.isArray(parsed.keys)) return null;
    return parsed.keys.filter((k): k is string => typeof k === "string");
  } catch {
    return null;
  }
}

function writeCacheKeys(uid: string, keys: string[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_PREFIX + uid,
      JSON.stringify({ savedAt: Date.now(), keys }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

function isDemoUser(uid: string | null): boolean {
  return !isSupabaseConfigured || (uid ?? "").startsWith("demo:");
}

export function useEnrollments(
  syncModule?: (moduleKey: string) => void | Promise<void>,
) {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const demoMode = isDemoUser(uid);

  const [enrolledKeys, setEnrolledKeys] = useState<string[]>(() =>
    !isSupabaseConfigured ? readDemoKeys() : [],
  );
  const [lastOpenedAt, setLastOpenedAt] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(() => !demoMode);

  const enrolledRef = useRef<string[]>(enrolledKeys);
  useEffect(() => {
    enrolledRef.current = enrolledKeys;
  }, [enrolledKeys]);

  // Carga inicial: demo desde localStorage; Supabase con caché + revalidate.
  useEffect(() => {
    if (demoMode) {
      const keys = readDemoKeys();
      enrolledRef.current = keys;
      setEnrolledKeys(keys);
      setLoading(false);
      return;
    }
    if (!uid) {
      setLoading(true);
      return;
    }
    setLoading(true);
    const cached = readCacheKeys(uid);
    if (cached) {
      enrolledRef.current = cached;
      setEnrolledKeys(cached);
    }
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select("module_key, last_opened_at")
          .eq("user_id", uid);
        if (!active) return;
        if (error) {
          setLoading(false);
          return;
        }
        const rows = (data ?? []) as EnrollmentRow[];
        const keys = rows.map((r) => r.module_key);
        const opened: Record<string, string> = {};
        for (const r of rows) {
          if (r.last_opened_at) opened[r.module_key] = r.last_opened_at;
        }
        enrolledRef.current = keys;
        setEnrolledKeys(keys);
        setLastOpenedAt(opened);
        writeCacheKeys(uid, keys);
        setLoading(false);
      } catch {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [demoMode, uid]);

  const isEnrolled = useCallback(
    (moduleKey: string) => enrolledRef.current.includes(moduleKey),
    [],
  );

  const enroll = useCallback(
    async (moduleKey: string): Promise<boolean> => {
      if (enrolledRef.current.includes(moduleKey)) return true;
      const uidNow = user?.id ?? null;
      const demoNow = isDemoUser(uidNow);
      if (demoNow) {
        const next = [...enrolledRef.current, moduleKey];
        enrolledRef.current = next;
        setEnrolledKeys(next);
        writeDemoKeys(next);
        await syncModule?.(moduleKey);
        return true;
      }
      if (!uidNow) return false;
      const supabase = getSupabase();
      if (!supabase) return false;
      const { error } = await supabase.from("enrollments").insert({
        user_id: uidNow,
        module_key: moduleKey,
      });
      if (error) return false;
      const next = [...enrolledRef.current, moduleKey];
      enrolledRef.current = next;
      setEnrolledKeys(next);
      writeCacheKeys(uidNow, next);
      // Migra el progreso local pendiente del módulo a la nube (Fase 6).
      await syncModule?.(moduleKey);
      return true;
    },
    [user?.id, syncModule],
  );

  const unenroll = useCallback(
    async (moduleKey: string): Promise<boolean> => {
      if (!enrolledRef.current.includes(moduleKey)) return true;
      const uidNow = user?.id ?? null;
      const demoNow = isDemoUser(uidNow);
      if (demoNow) {
        const next = enrolledRef.current.filter((k) => k !== moduleKey);
        enrolledRef.current = next;
        setEnrolledKeys(next);
        writeDemoKeys(next);
        return true;
      }
      if (!uidNow) return false;
      const supabase = getSupabase();
      if (!supabase) return false;
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("user_id", uidNow)
        .eq("module_key", moduleKey);
      if (error) return false;
      const next = enrolledRef.current.filter((k) => k !== moduleKey);
      enrolledRef.current = next;
      setEnrolledKeys(next);
      writeCacheKeys(uidNow, next);
      return true;
    },
    [user?.id],
  );

  const touchLastOpened = useCallback(
    async (moduleKey: string): Promise<void> => {
      // Solo marca como reciente los cursos suscritos (nunca crea enrollment).
      if (!enrolledRef.current.includes(moduleKey)) return;
      const nowIso = new Date().toISOString();
      setLastOpenedAt((prev) => ({ ...prev, [moduleKey]: nowIso }));
      const uidNow = user?.id ?? null;
      if (isDemoUser(uidNow) || !uidNow) return;
      const supabase = getSupabase();
      if (!supabase) return;
      await supabase
        .from("enrollments")
        .upsert(
          {
            user_id: uidNow,
            module_key: moduleKey,
            last_opened_at: nowIso,
          },
          { onConflict: "user_id,module_key" },
        );
    },
    [user?.id],
  );

  return {
    enrolledKeys,
    lastOpenedAt,
    loading,
    isEnrolled,
    enroll,
    unenroll,
    touchLastOpened,
  };
}
