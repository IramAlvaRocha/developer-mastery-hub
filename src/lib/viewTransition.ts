import { flushSync } from "react-dom";

/**
 * Ejecuta una actualizacion de estado dentro de una View Transition del
 * navegador para animar el cambio de vista (morph/cross-fade).
 *
 * - Usa `flushSync` para que React aplique el cambio de DOM de forma sincrona
 *   y el navegador capture el estado "despues" correcto.
 * - Degrada con gracia: si la API no existe (Firefox/Safari antiguos) o el
 *   usuario prefiere menos movimiento, simplemente ejecuta la actualizacion.
 */
export function runViewTransition(update: () => void): void {
  const doc = typeof document !== "undefined" ? document : undefined;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!doc || reduceMotion || typeof doc.startViewTransition !== "function") {
    update();
    return;
  }

  doc.startViewTransition(() => {
    flushSync(update);
  });
}
