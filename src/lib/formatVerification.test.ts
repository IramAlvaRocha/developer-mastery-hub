// ──────────────────────────────────────────────────────────────────────────
// Tests unitarios de la evaluación central de formatos interactivos.
// Cubre los 7 formatos: prediction, ordering, snippet-pick, bug-hunt,
// matching, context-dropdown y true-false, más el caso por defecto.
// ──────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from "vitest";
import { evaluateFormat } from "./formatVerification";
import type { Exercise } from "./types";

/** Fábrica de un `Exercise` mínimo con los campos requeridos rellenados. */
function ex(overrides: Partial<Exercise>): Exercise {
  const base: Exercise = {
    id: 1,
    title: "Test",
    stars: 1,
    category: "TEST",
    description: "desc",
    objective: "obj",
    tags: ["test"],
    fileName: "test.ts",
    explanationText: "expl",
    codeSnippet: "",
    inputs: {},
    completeCode: "",
  };
  return { ...base, ...overrides };
}

describe("evaluateFormat — prediction", () => {
  const exercise = ex({
    format: "prediction",
    prediction: { options: ["Hello World", "Other"], answer: "Hello World" },
  });

  it("marca incomplete cuando no hay respuesta", () => {
    expect(evaluateFormat(exercise, { answer: "" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta una respuesta coincidente (con normalización)", () => {
    expect(evaluateFormat(exercise, { answer: "  hello   world  " })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("marca incorrecta y devuelve la clave 'answer'", () => {
    expect(evaluateFormat(exercise, { answer: "nope" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["answer"],
    });
  });

  it("ignora acceptedFreeText cuando allowFreeText no está activo", () => {
    const withFreeText = ex({
      format: "prediction",
      prediction: {
        options: ["Hello World"],
        answer: "Hello World",
        acceptedFreeText: ["hola mundo"],
      },
    });
    expect(evaluateFormat(withFreeText, { answer: "hola mundo" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["answer"],
    });
  });

  it("acepta una respuesta de texto libre alternativa cuando allowFreeText es true", () => {
    const withFreeText = ex({
      format: "prediction",
      prediction: {
        options: ["Hello World"],
        answer: "Hello World",
        allowFreeText: true,
        acceptedFreeText: ["hola mundo", "hola"],
      },
    });
    expect(evaluateFormat(withFreeText, { answer: "  HOLA   MUNDO  " })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("sigue aceptando la opción exacta con allowFreeText activo", () => {
    const withFreeText = ex({
      format: "prediction",
      prediction: {
        options: ["Hello World"],
        answer: "Hello World",
        allowFreeText: true,
        acceptedFreeText: ["hola mundo"],
      },
    });
    expect(evaluateFormat(withFreeText, { answer: "hello world" })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("rechaza texto libre no listado aunque allowFreeText sea true", () => {
    const withFreeText = ex({
      format: "prediction",
      prediction: {
        options: ["Hello World"],
        answer: "Hello World",
        allowFreeText: true,
        acceptedFreeText: ["hola mundo"],
      },
    });
    expect(evaluateFormat(withFreeText, { answer: "otra cosa" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["answer"],
    });
  });
});

describe("evaluateFormat — ordering", () => {
  const exercise = ex({
    format: "ordering",
    ordering: {
      steps: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      correctOrder: ["a", "b", "c"],
    },
  });

  it("marca incomplete si faltan pasos por colocar", () => {
    expect(evaluateFormat(exercise, { order: "a,b" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta la secuencia exacta", () => {
    expect(evaluateFormat(exercise, { order: "a,b,c" })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("marca incorrecta y devuelve la clave 'order'", () => {
    expect(evaluateFormat(exercise, { order: "c,b,a" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["order"],
    });
  });
});

describe("evaluateFormat — snippet-pick", () => {
  const exercise = ex({
    format: "snippet-pick",
    snippetPick: {
      prompt: "p",
      snippets: [
        { id: "seguro", label: "Seguro", code: "" },
        { id: "inseguro", label: "Inseguro", code: "" },
      ],
      correct: "seguro",
    },
  });

  it("marca incomplete sin elección", () => {
    expect(evaluateFormat(exercise, { choice: "" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta la elección del id correcto", () => {
    expect(evaluateFormat(exercise, { choice: "seguro" })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("tolera espacios alrededor del id elegido", () => {
    expect(evaluateFormat(exercise, { choice: "  seguro  " })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("marca incorrecta y devuelve la clave 'choice'", () => {
    expect(evaluateFormat(exercise, { choice: "inseguro" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["choice"],
    });
  });
});

describe("evaluateFormat — bug-hunt", () => {
  const exercise = ex({
    format: "bug-hunt",
    bugHunt: {
      snippet: "s",
      options: [
        { id: "a", text: "opción a" },
        { id: "b", text: "opción b" },
      ],
      correct: "b",
    },
  });

  it("marca incomplete sin elección", () => {
    expect(evaluateFormat(exercise, { choice: "" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta la elección del id correcto", () => {
    expect(evaluateFormat(exercise, { choice: "b" })).toEqual({
      complete: true,
      correct: true,
      incorrectKeys: [],
    });
  });

  it("marca incorrecta y devuelve la clave 'choice'", () => {
    expect(evaluateFormat(exercise, { choice: "a" })).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["choice"],
    });
  });
});

describe("evaluateFormat — matching", () => {
  const exercise = ex({
    format: "matching",
    matching: {
      pairs: [
        { id: "p1", term: "t1", definition: "def1" },
        { id: "p2", term: "t2", definition: "def2" },
      ],
    },
  });

  it("marca incomplete si algún par no está respondido", () => {
    expect(evaluateFormat(exercise, { "pair-p1": "def1" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta si todos los pares coinciden", () => {
    expect(
      evaluateFormat(exercise, { "pair-p1": "def1", "pair-p2": "def2" }),
    ).toEqual({ complete: true, correct: true, incorrectKeys: [] });
  });

  it("marca incorrecta y lista solo los pares fallidos", () => {
    expect(
      evaluateFormat(exercise, { "pair-p1": "def1", "pair-p2": "wrong" }),
    ).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["pair-p2"],
    });
  });
});

describe("evaluateFormat — context-dropdown", () => {
  const exercise = ex({
    format: "context-dropdown",
    inputs: { INPUT_1: "number", INPUT_2: ["string", "String"] },
    contextDropdown: {
      options: { INPUT_1: ["number", "string"], INPUT_2: ["string", "boolean"] },
    },
  });

  it("marca incomplete si falta algún hueco", () => {
    expect(evaluateFormat(exercise, { INPUT_1: "number" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta si todos los huecos coinciden", () => {
    expect(
      evaluateFormat(exercise, { INPUT_1: "number", INPUT_2: "string" }),
    ).toEqual({ complete: true, correct: true, incorrectKeys: [] });
  });

  it("acepta una alternativa válida (string[]) con normalización", () => {
    expect(
      evaluateFormat(exercise, { INPUT_1: "number", INPUT_2: "  STRING " }),
    ).toEqual({ complete: true, correct: true, incorrectKeys: [] });
  });

  it("marca incorrecta y lista los huecos fallidos en orden", () => {
    expect(
      evaluateFormat(exercise, { INPUT_1: "wrong", INPUT_2: "nope" }),
    ).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["INPUT_1", "INPUT_2"],
    });
  });
});

describe("evaluateFormat — true-false", () => {
  const exercise = ex({
    format: "true-false",
    trueFalse: {
      statements: [
        { id: "s1", text: "t", answer: true },
        { id: "s2", text: "t", answer: false },
      ],
    },
  });

  it("marca incomplete si falta alguna afirmación", () => {
    expect(evaluateFormat(exercise, { "tf-s1": "true" })).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });

  it("marca correcta si todas las afirmaciones coinciden", () => {
    expect(
      evaluateFormat(exercise, { "tf-s1": "true", "tf-s2": "false" }),
    ).toEqual({ complete: true, correct: true, incorrectKeys: [] });
  });

  it("marca incorrecta y lista las afirmaciones fallidas", () => {
    expect(
      evaluateFormat(exercise, { "tf-s1": "false", "tf-s2": "false" }),
    ).toEqual({
      complete: true,
      correct: false,
      incorrectKeys: ["tf-s1"],
    });
  });
});

describe("evaluateFormat — formato desconocido", () => {
  it("devuelve incomplete para un ejercicio sin formato", () => {
    expect(evaluateFormat(ex({}), {})).toEqual({
      complete: false,
      correct: false,
      incorrectKeys: [],
    });
  });
});
