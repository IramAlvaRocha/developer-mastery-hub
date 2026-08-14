// ──────────────────────────────────────────────────────────────────────────
// Núcleo puro del progreso persistente (Fase 5 — nube).
// Funciones sin efectos (sin localStorage, sin React, sin Supabase): solo
// claves, merge aditivo y detección de bloqueo por RLS. Aisladas aquí para
// que la lógica sea testeable de forma unitaria sin DOM ni red.
// `useProgress.ts` importa de aquí sin cambiar comportamiento.
// ──────────────────────────────────────────────────────────────────────────

export const PREFIX = "mastery_hub_";
export const LAST_KEY = "mastery_hub_last";
export const ATTEMPTS_KEY = "mastery_hub_attempts";

export type ProgressMap = Record<string, number[]>;

export interface ProgressRow {
  module_key: string;
  exercise_ref: number;
}

// ──────────────────────────────────────────────────────────────────────────
// Señal rica de intentos (SRS-ready). Cada `AttemptRecord` resume el historial
// de intentos de un ejercicio: nº de intentos, si el último fue correcto, las
// claves que fallaron en el último intento y el timestamp de ese intento.
// Se persiste por módulo/ejercicio (clave del módulo → ref del ejercicio).
// ──────────────────────────────────────────────────────────────────────────

export interface AttemptRecord {
  attempts: number;
  lastCorrect: boolean;
  lastErrorKeys: string[];
  /** Epoch en milisegundos del último intento. */
  lastAttemptAt: number;
}

export type AttemptsMap = Record<string, Record<number, AttemptRecord>>;

/**
 * Tope superior de `attempts`. Postgres usa `int` (máx. 2_147_483_647); este
 * tope es mucho más bajo y, además de evitar cualquier desbordamiento, acota
 * el daño de un backup editado a mano con valores absurdos.
 */
export const MAX_ATTEMPTS = 1_000_000;

/** Claves de módulo que, usadas como propiedades, contaminarían el prototipo. */
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** True si la clave de módulo es segura para usarse como clave de un mapa. */
export function isSafeModuleKey(key: string): boolean {
  return !FORBIDDEN_KEYS.has(key);
}

/**
 * Normaliza un número de intentos a un entero seguro acotado a
 * [0, MAX_ATTEMPTS]. Los valores no finitos (NaN/Infinity) colapsan a 1.
 */
export function clampAttempts(n: number): number {
  if (!Number.isFinite(n)) return 1;
  const t = Math.trunc(n);
  if (t < 0) return 0;
  return Math.min(t, MAX_ATTEMPTS);
}

/** Reduce `value` a un `string[]` con solo strings (descarta lo que no lo sea). */
export function sanitizeErrorKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((k): k is string => typeof k === "string");
}

/** Clave de intentos: scoped por uid; sin uid, fallback a la clave legacy. */
export function attemptsKey(uid: string | null): string {
  return uid ? `${ATTEMPTS_KEY}_${uid}` : ATTEMPTS_KEY;
}

/**
 * Registra un intento más sobre `prev` (o crea el registro). Incrementa
 * `attempts`, sobrescribe `lastCorrect`/`lastErrorKeys` y fija `lastAttemptAt`.
 */
export function recordAttemptValue(
  prev: AttemptRecord | undefined,
  correct: boolean,
  errorKeys: string[],
  nowMs: number,
): AttemptRecord {
  const base = prev ? clampAttempts(prev.attempts) : 0;
  return {
    attempts: clampAttempts(base + 1),
    lastCorrect: correct,
    lastErrorKeys: sanitizeErrorKeys(errorKeys),
    lastAttemptAt: nowMs,
  };
}

/**
 * True si un ejercicio completado toca repaso: sin registro de intentos
 * (p. ej. completado antes de la señal rica) o si el último intento ya superó
 * `intervalMs`. Un ejercicio no completado nunca está vencido.
 */
export function isDueForReview(
  rec: AttemptRecord | undefined,
  completed: boolean,
  nowMs: number,
  intervalMs: number,
): boolean {
  if (!completed) return false;
  if (!rec) return true;
  return nowMs - rec.lastAttemptAt >= intervalMs;
}

/**
 * Unión (aditiva) de dos mapas de intentos: el más reciente (`lastAttemptAt`)
 * gana cuando el mismo ejercicio aparece en ambos.
 */
export function mergeAttemptMaps(
  base: AttemptsMap,
  incoming: AttemptsMap,
): AttemptsMap {
  const merged: AttemptsMap = Object.create(null);
  for (const [moduleKey, recs] of Object.entries(base)) {
    merged[moduleKey] = Object.assign(Object.create(null), recs);
  }
  for (const [moduleKey, recs] of Object.entries(incoming)) {
    if (!isSafeModuleKey(moduleKey)) continue;
    const baseRecs = merged[moduleKey] ?? Object.create(null);
    const next: Record<number, AttemptRecord> = Object.assign(
      Object.create(null),
      baseRecs,
    );
    for (const [refStr, rec] of Object.entries(recs)) {
      const ref = Number(refStr);
      if (!Number.isInteger(ref) || ref < 0) continue;
      const existing = next[ref];
      if (!existing || rec.lastAttemptAt >= existing.lastAttemptAt) {
        next[ref] = rec;
      }
    }
    merged[moduleKey] = next;
  }
  return merged;
}

/**
 * Convierte un valor desconocido (JSON de import) en un `AttemptsMap` válido.
 * Descarta silenciosamente entradas malformadas para ser tolerante a backups
 * editados o de versiones anteriores.
 */
export function sanitizeAttempts(value: unknown): AttemptsMap {
  const out: AttemptsMap = Object.create(null);
  if (!value || typeof value !== "object") return out;
  for (const [moduleKey, recs] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (!isSafeModuleKey(moduleKey)) continue;
    if (!recs || typeof recs !== "object") continue;
    const moduleRecs: Record<number, AttemptRecord> = Object.create(null);
    for (const [refStr, rec] of Object.entries(
      recs as Record<string, unknown>,
    )) {
      const ref = Number(refStr);
      if (!Number.isInteger(ref) || ref < 0) continue;
      if (!rec || typeof rec !== "object") continue;
      const r = rec as Partial<AttemptRecord>;
      if (typeof r.attempts !== "number") continue;
      moduleRecs[ref] = {
        attempts: clampAttempts(r.attempts),
        lastCorrect: r.lastCorrect === true,
        lastErrorKeys: sanitizeErrorKeys(r.lastErrorKeys),
        lastAttemptAt:
          typeof r.lastAttemptAt === "number" && Number.isFinite(r.lastAttemptAt)
            ? r.lastAttemptAt
            : 0,
      };
    }
    if (Object.keys(moduleRecs).length > 0) out[moduleKey] = moduleRecs;
  }
  return out;
}

/** Clave de un módulo: scoped por uid; sin uid, fallback a la clave legacy. */
export function moduleKey(moduleKey: string, uid: string | null): string {
  return uid ? `${PREFIX}${uid}_${moduleKey}` : PREFIX + moduleKey;
}

/** Clave de "último visitado": scoped por uid; sin uid, fallback legacy. */
export function lastKey(uid: string | null): string {
  return uid ? `${LAST_KEY}_${uid}` : LAST_KEY;
}

/** Unión (aditiva) de lo local con las filas de `progress` de la nube. */
export function mergeRows(local: ProgressMap, rows: ProgressRow[]): ProgressMap {
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
export function isRlsBlocked(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  if (!e) return false;
  if (typeof e.code === "string" && e.code === "42501") return true;
  return typeof e.message === "string" && /row-level security/i.test(e.message);
}
