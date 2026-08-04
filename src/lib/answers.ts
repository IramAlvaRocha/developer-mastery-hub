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

// ──────────────────────────────────────────────────────────────────────────
// Verificacion de formatos interactivos (prediction, ordering, matching...).
// Todas reutilizan normalizeAnswer como base de comparacion.
// ──────────────────────────────────────────────────────────────────────────

/** True si `value` (ids separados por comas) reconstruye la secuencia correcta. */
export function isOrderingCorrect(
  correctOrder: string[],
  value: string,
): boolean {
  const order = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (order.length !== correctOrder.length) return false;
  return order.every((id, i) => id === correctOrder[i]);
}

/** True si `value` (índice como string) coincide con el índice correcto. */
export function isChoiceCorrect(correct: number, value: string): boolean {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return false;
  return n === correct;
}

/** True si `value` ("true" | "false") coincide con la respuesta esperada. */
export function isTrueFalseCorrect(expected: boolean, value: string): boolean {
  if (value !== "true" && value !== "false") return false;
  return (value === "true") === expected;
}

/** True si todos los pares del matching están emparejados correctamente. */
export function isMatchingCorrect(
  pairs: { id: string; definition: string }[],
  answers: Record<string, string>,
): boolean {
  return pairs.every((p) => {
    const def = (answers[`pair-${p.id}`] ?? "").trim();
    return def === p.definition;
  });
}
