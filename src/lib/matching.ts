// ──────────────────────────────────────────────────────────────────────────
// Helpers del formato matching.
// Centraliza la resolución del orden de pantalla de las definiciones para que
// el renderer y la verificación no dupliquen lógica (y para que un autor pueda
// OMITIR `definitions` y el orden se derive solo).
// ──────────────────────────────────────────────────────────────────────────

import type { MatchingExercise } from "./types";

/**
 * Devuelve las definiciones en orden de pantalla.
 * - Si `matching.definitions` existe, se usa tal cual (el autor define el
 *   orden revuelto).
 * - Si no, se deriva un orden revuelto determinista a partir de los `pairs`
 *   (ordenando por `id`), de modo que no queden alineadas con los términos.
 */
export function resolveDefinitions(matching: MatchingExercise): string[] {
  if (matching.definitions) return matching.definitions;
  return [...matching.pairs]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((p) => p.definition);
}
