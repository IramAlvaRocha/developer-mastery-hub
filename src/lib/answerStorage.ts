// ──────────────────────────────────────────────────────────────────────────
// answerStorage — respuestas de los huecos inline por ejercicio.
// Persistencia ligera en sessionStorage (sobreviven a recargas, no a pestañas
// nuevas): clave `dmh-answers-<moduleKey>-<exerciseId>`. SSR-safe: nada de
// window durante el render.
// ──────────────────────────────────────────────────────────────────────────

const PREFIX = "dmh-answers-";

export function readAnswers(
  moduleKey: string,
  exerciseId: number,
): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(storageKey(moduleKey, exerciseId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeAnswers(
  moduleKey: string,
  exerciseId: number,
  answers: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      storageKey(moduleKey, exerciseId),
      JSON.stringify(answers),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearAnswers(
  moduleKey: string,
  exerciseId: number,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(storageKey(moduleKey, exerciseId));
  } catch {
    /* almacenamiento no disponible */
  }
}

function storageKey(moduleKey: string, exerciseId: number): string {
  return `${PREFIX}${moduleKey}-${exerciseId}`;
}
