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

export function validateFormatPayload(
  format: ExerciseFormat,
  payload: unknown,
): string | null {
  if (!isRecord(payload)) return "El payload debe ser un objeto JSON.";

  switch (format) {
    case "prediction": {
      const { options, answer, allowFreeText, acceptedFreeText } = payload;
      if (!Array.isArray(options) || options.length === 0) {
        return "prediction: «options» debe ser un array no vacío de strings.";
      }
      if (!options.every(isNonEmptyString)) {
        return "prediction: cada opción debe ser un string no vacío.";
      }
      if (!isNonEmptyString(answer)) {
        return "prediction: «answer» debe ser un string no vacío.";
      }
      if (allowFreeText === true) {
        if (!Array.isArray(acceptedFreeText) || acceptedFreeText.length === 0) {
          return "prediction: si «allowFreeText» es true, «acceptedFreeText» debe ser un array no vacío.";
        }
        if (!acceptedFreeText.every(isNonEmptyString)) {
          return "prediction: cada respuesta de «acceptedFreeText» debe ser un string no vacío.";
        }
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
      const snippetIds = new Set<string>();
      for (const snippet of snippets) {
        if (!isRecord(snippet) || !isNonEmptyString(snippet.id)) {
          return "snippet-pick: cada snippet debe tener un «id» string no vacío.";
        }
        if (!isNonEmptyString(snippet.code)) {
          return "snippet-pick: cada snippet debe tener un «code» string no vacío.";
        }
        if (snippetIds.has(snippet.id)) {
          return `snippet-pick: el id de snippet «${snippet.id}» está duplicado.`;
        }
        snippetIds.add(snippet.id);
      }
      if (!isNonEmptyString(correct)) {
        return "snippet-pick: «correct» debe ser el id (string) de un snippet.";
      }
      if (!snippetIds.has(correct)) {
        return `snippet-pick: «correct» referencia un id de snippet inexistente («${correct}»).`;
      }
      return null;
    }

    case "bug-hunt": {
      const { snippet, options, correct } = payload;
      if (!isNonEmptyString(snippet)) {
        return "bug-hunt: «snippet» debe ser un string no vacío.";
      }
      if (!Array.isArray(options) || options.length === 0) {
        return "bug-hunt: «options» debe ser un array no vacío de {id, text}.";
      }
      const optionIds = new Set<string>();
      for (const option of options) {
        if (!isRecord(option) || !isNonEmptyString(option.id)) {
          return "bug-hunt: cada opción debe tener un «id» string no vacío.";
        }
        if (!isNonEmptyString(option.text)) {
          return "bug-hunt: cada opción debe tener un «text» string no vacío.";
        }
        if (optionIds.has(option.id)) {
          return `bug-hunt: el id de opción «${option.id}» está duplicado.`;
        }
        optionIds.add(option.id);
      }
      if (!isNonEmptyString(correct)) {
        return "bug-hunt: «correct» debe ser el id (string) de una opción.";
      }
      if (!optionIds.has(correct)) {
        return `bug-hunt: «correct» referencia un id de opción inexistente («${correct}»).`;
      }
      return null;
    }

    case "matching": {
      const { pairs, definitions } = payload;
      if (!Array.isArray(pairs) || pairs.length === 0) {
        return "matching: «pairs» debe ser un array no vacío.";
      }
      const pairDefinitions = new Set<string>();
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
        pairDefinitions.add(pair.definition);
      }
      if (definitions !== undefined) {
        if (!Array.isArray(definitions)) {
          return "matching: «definitions» debe ser un array de strings.";
        }
        if (!definitions.every(isNonEmptyString)) {
          return "matching: cada «definitions» debe ser un string no vacío.";
        }
        const definitionsSet = new Set(definitions);
        if (definitionsSet.size !== definitions.length) {
          return "matching: «definitions» no puede contener duplicados.";
        }
        if (
          definitionsSet.size !== pairDefinitions.size ||
          !definitions.every((d) => pairDefinitions.has(d))
        ) {
          return "matching: «definitions» debe coincidir exactamente con las definiciones de «pairs».";
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
