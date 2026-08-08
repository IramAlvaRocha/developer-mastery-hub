// ──────────────────────────────────────────────────────────────────────────
// formatValidation — Fase 8 (M5).
// Validación del payload de los formatos interactivos ANTES de persistir desde
// el panel admin (integridad del catálogo). Devuelve null si es válido o un
// string con el motivo del error, listo para mostrar en un toast.
// ──────────────────────────────────────────────────────────────────────────

import type { ExerciseFormat } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIntegerIndex(value: unknown, length: number): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < length
  );
}

export function validateFormatPayload(
  format: ExerciseFormat,
  payload: unknown,
): string | null {
  if (!isRecord(payload)) return "El payload debe ser un objeto JSON.";

  switch (format) {
    case "prediction": {
      const { options, answer } = payload;
      if (!Array.isArray(options) || options.length === 0) {
        return "prediction: «options» debe ser un array no vacío de strings.";
      }
      if (!options.every(isNonEmptyString)) {
        return "prediction: cada opción debe ser un string no vacío.";
      }
      if (!isNonEmptyString(answer)) {
        return "prediction: «answer» debe ser un string no vacío.";
      }
      return null;
    }

    case "ordering": {
      const { steps, correctOrder } = payload;
      if (!Array.isArray(steps) || steps.length === 0) {
        return "ordering: «steps» debe ser un array no vacío.";
      }
      const stepIds = new Set<string>();
      for (const step of steps) {
        if (!isRecord(step) || !isNonEmptyString(step.id)) {
          return "ordering: cada paso debe tener un «id» string no vacío.";
        }
        if (!isNonEmptyString(step.label)) {
          return "ordering: cada paso debe tener un «label» string no vacío.";
        }
        stepIds.add(step.id);
      }
      if (
        !Array.isArray(correctOrder) ||
        correctOrder.length === 0 ||
        !correctOrder.every(isNonEmptyString)
      ) {
        return "ordering: «correctOrder» debe ser un array de strings.";
      }
      for (const id of correctOrder) {
        if (!stepIds.has(id)) {
          return `ordering: «correctOrder» referencia un id inexistente («${id}»).`;
        }
      }
      return null;
    }

    case "snippet-pick": {
      const { snippets, correct } = payload;
      if (!Array.isArray(snippets) || snippets.length < 2 || snippets.length > 4) {
        return "snippet-pick: «snippets» debe tener entre 2 y 4 elementos.";
      }
      for (const snippet of snippets) {
        if (!isRecord(snippet) || !isNonEmptyString(snippet.id)) {
          return "snippet-pick: cada snippet debe tener un «id» string no vacío.";
        }
        if (!isNonEmptyString(snippet.code)) {
          return "snippet-pick: cada snippet debe tener un «code» string no vacío.";
        }
      }
      if (!isIntegerIndex(correct, snippets.length)) {
        return "snippet-pick: «correct» debe ser un índice entero válido.";
      }
      return null;
    }

    case "bug-hunt": {
      const { snippet, options, correct } = payload;
      if (!isNonEmptyString(snippet)) {
        return "bug-hunt: «snippet» debe ser un string no vacío.";
      }
      if (!Array.isArray(options) || options.length === 0) {
        return "bug-hunt: «options» debe ser un array no vacío de strings.";
      }
      if (!options.every(isNonEmptyString)) {
        return "bug-hunt: cada opción debe ser un string no vacío.";
      }
      if (!isIntegerIndex(correct, options.length)) {
        return "bug-hunt: «correct» debe ser un índice entero válido.";
      }
      return null;
    }

    case "matching": {
      const { pairs } = payload;
      if (!Array.isArray(pairs) || pairs.length === 0) {
        return "matching: «pairs» debe ser un array no vacío.";
      }
      for (const pair of pairs) {
        if (!isRecord(pair) || !isNonEmptyString(pair.id)) {
          return "matching: cada par debe tener un «id» string no vacío.";
        }
        if (!isNonEmptyString(pair.term)) {
          return "matching: cada par debe tener un «term» string no vacío.";
        }
        if (!isNonEmptyString(pair.definition)) {
          return "matching: cada par debe tener un «definition» string no vacío.";
        }
      }
      return null;
    }

    case "context-dropdown": {
      const { options } = payload;
      if (!isRecord(options)) {
        return "context-dropdown: «options» debe ser un objeto (no array).";
      }
      const values = Object.values(options);
      if (values.length === 0) {
        return "context-dropdown: «options» no puede estar vacío.";
      }
      for (const value of values) {
        if (!Array.isArray(value) || value.length === 0) {
          return "context-dropdown: cada opción debe ser un array no vacío.";
        }
        if (!value.every(isNonEmptyString)) {
          return "context-dropdown: cada opción debe contener strings no vacíos.";
        }
      }
      return null;
    }

    case "true-false": {
      const { statements } = payload;
      if (!Array.isArray(statements) || statements.length === 0) {
        return "true-false: «statements» debe ser un array no vacío.";
      }
      for (const statement of statements) {
        if (!isRecord(statement) || !isNonEmptyString(statement.text)) {
          return "true-false: cada afirmación debe tener un «text» string no vacío.";
        }
        if (typeof statement.answer !== "boolean") {
          return "true-false: cada afirmación debe tener «answer» boolean.";
        }
      }
      return null;
    }

    default:
      return "Formato de ejercicio no soportado.";
  }
}
