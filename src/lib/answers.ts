// ──────────────────────────────────────────────────────────────────────────
// Verificacion de respuestas de los ejercicios.
// - Acepta una o varias respuestas validas por hueco (string | string[]).
// - Normaliza para tolerar mayusculas, espacios extra y espacios internos
//   (p. ej. "new  List<int>()" == "new List<int>()").
// ──────────────────────────────────────────────────────────────────────────

/** Respuesta esperada de un hueco: una opcion o varias alternativas validas. */
export type ExpectedAnswer = string | string[];

/** Minusculas, sin espacios al borde y con espacios internos colapsados. */
export function normalizeAnswer(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Lista de alternativas aceptadas para un hueco. */
export function acceptedAnswers(expected: ExpectedAnswer): string[] {
  return Array.isArray(expected) ? expected : [expected];
}

/** Primera alternativa (se usa solo para medir el ancho del input inline). */
export function primaryAnswer(expected: ExpectedAnswer): string {
  return Array.isArray(expected) ? (expected[0] ?? "") : expected;
}

/** True si `value` coincide (normalizado) con alguna alternativa valida. */
export function isAnswerCorrect(
  expected: ExpectedAnswer,
  value: string,
): boolean {
  const norm = normalizeAnswer(value);
  if (!norm) return false;
  return acceptedAnswers(expected).some((a) => normalizeAnswer(a) === norm);
}
