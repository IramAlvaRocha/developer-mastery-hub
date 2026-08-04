// ──────────────────────────────────────────────────────────────────────────
// Evaluación central de formatos interactivos.
// Devuelve si la respuesta está completa, si es correcta y qué claves fallan
// (para que los renderers marquen en rojo solo lo incorrecto).
// ──────────────────────────────────────────────────────────────────────────

import type { Exercise } from "./types";
import {
  isAnswerCorrect,
  isChoiceCorrect,
  isMatchingCorrect,
  isOrderingCorrect,
  isTrueFalseCorrect,
} from "./answers";

export interface FormatEvaluation {
  complete: boolean;
  correct: boolean;
  incorrectKeys: string[];
}

/** Evalúa la respuesta del usuario para un ejercicio con formato nuevo. */
export function evaluateFormat(
  exercise: Exercise,
  answers: Record<string, string>,
): FormatEvaluation {
  switch (exercise.format) {
    case "prediction": {
      const value = (answers["answer"] ?? "").trim();
      if (!value) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      const correct = isAnswerCorrect(
        exercise.prediction?.answer ?? "",
        value,
      );
      return {
        complete: true,
        correct,
        incorrectKeys: correct ? [] : ["answer"],
      };
    }

    case "ordering": {
      const total = exercise.ordering?.steps.length ?? 0;
      const placed = (answers["order"] ?? "")
        .split(",")
        .filter(Boolean).length;
      if (placed < total) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      const correct = isOrderingCorrect(
        exercise.ordering?.correctOrder ?? [],
        answers["order"] ?? "",
      );
      return {
        complete: true,
        correct,
        incorrectKeys: correct ? [] : ["order"],
      };
    }

    case "snippet-pick": {
      const value = (answers["choice"] ?? "").trim();
      if (!value) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      const correct = isChoiceCorrect(
        exercise.snippetPick?.correct ?? -1,
        value,
      );
      return {
        complete: true,
        correct,
        incorrectKeys: correct ? [] : ["choice"],
      };
    }

    case "bug-hunt": {
      const value = (answers["choice"] ?? "").trim();
      if (!value) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      const correct = isChoiceCorrect(exercise.bugHunt?.correct ?? -1, value);
      return {
        complete: true,
        correct,
        incorrectKeys: correct ? [] : ["choice"],
      };
    }

    case "matching": {
      const pairs = exercise.matching?.pairs ?? [];
      const incomplete = pairs.some(
        (p) => !(answers[`pair-${p.id}`] ?? "").trim(),
      );
      if (incomplete) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      const correct = isMatchingCorrect(pairs, answers);
      const incorrectKeys = correct
        ? []
        : pairs
            .filter((p) => (answers[`pair-${p.id}`] ?? "").trim() !== p.definition)
            .map((p) => `pair-${p.id}`);
      return { complete: true, correct, incorrectKeys };
    }

    case "context-dropdown": {
      const expected = exercise.inputs ?? {};
      const wrong: string[] = [];
      let empty = false;
      for (const key of Object.keys(expected)) {
        const value = (answers[key] ?? "").trim();
        if (!value) {
          empty = true;
          continue;
        }
        if (!isAnswerCorrect(expected[key], value)) wrong.push(key);
      }
      if (empty) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      return {
        complete: true,
        correct: wrong.length === 0,
        incorrectKeys: wrong,
      };
    }

    case "true-false": {
      const statements = exercise.trueFalse?.statements ?? [];
      const wrong: string[] = [];
      let empty = false;
      for (const statement of statements) {
        const key = `tf-${statement.id}`;
        const value = (answers[key] ?? "").trim();
        if (!value) {
          empty = true;
          continue;
        }
        if (!isTrueFalseCorrect(statement.answer, value)) wrong.push(key);
      }
      if (empty) {
        return { complete: false, correct: false, incorrectKeys: [] };
      }
      return {
        complete: true,
        correct: wrong.length === 0,
        incorrectKeys: wrong,
      };
    }

    default:
      return { complete: false, correct: false, incorrectKeys: [] };
  }
}
