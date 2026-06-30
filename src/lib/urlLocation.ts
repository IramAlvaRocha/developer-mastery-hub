// ──────────────────────────────────────────────────────────────────────────
// Sincronizacion de la ubicacion (modulo + ejercicio) con la URL.
// Esquema:  /?m=<moduleKey>&e=<exerciseId>
//   - m: key del modulo (estable y legible)
//   - e: id del ejercicio (estable ante reordenamientos del array)
// Si no hay modulo, la URL queda limpia (sin query) = menu.
// ──────────────────────────────────────────────────────────────────────────

export interface UrlLocation {
  /** key del modulo activo, o null cuando estamos en el menu. */
  module: string | null;
  /** id del ejercicio activo, o null. */
  exerciseId: number | null;
}

const PARAM_MODULE = "m";
const PARAM_EXERCISE = "e";

/** Lee la ubicacion actual desde la query string del navegador. */
export function readUrlLocation(): UrlLocation {
  if (typeof window === "undefined") {
    return { module: null, exerciseId: null };
  }
  const params = new URLSearchParams(window.location.search);
  const module = params.get(PARAM_MODULE);
  const rawExercise = params.get(PARAM_EXERCISE);
  const parsed = rawExercise !== null ? Number(rawExercise) : NaN;
  return {
    module: module && module.length > 0 ? module : null,
    exerciseId: Number.isFinite(parsed) ? parsed : null,
  };
}

/** Construye la query string canonica (incluye el "?" o "" si esta vacia). */
export function buildSearch(loc: UrlLocation): string {
  const params = new URLSearchParams();
  if (loc.module) {
    params.set(PARAM_MODULE, loc.module);
    if (loc.exerciseId != null) {
      params.set(PARAM_EXERCISE, String(loc.exerciseId));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** URL absoluta compartible para la ubicacion dada (basada en la actual). */
export function buildShareUrl(loc: UrlLocation): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}${buildSearch(loc)}`;
}
