// ──────────────────────────────────────────────────────────────────────────
// Tests unitarios de la verificación de respuestas (lógica pura, sin DOM).
// ──────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from "vitest";
import {
  acceptedAnswers,
  isAnswerCorrect,
  isMatchingCorrect,
  isOrderingCorrect,
  isTrueFalseCorrect,
  normalizeAnswer,
  primaryAnswer,
} from "./answers";

describe("normalizeAnswer", () => {
  it("pasa a minúsculas", () => {
    expect(normalizeAnswer("Hello WORLD")).toBe("hello world");
  });

  it("recorta espacios al borde", () => {
    expect(normalizeAnswer("  hola  ")).toBe("hola");
  });

  it("colapsa espacios internos múltiples", () => {
    expect(normalizeAnswer("new  List<int>()")).toBe("new list<int>()");
  });

  it("colapsa tabuladores y saltos de línea", () => {
    expect(normalizeAnswer("a\tb\n c")).toBe("a b c");
  });

  it("devuelve vacío para una cadena vacía", () => {
    expect(normalizeAnswer("")).toBe("");
  });

  it("devuelve vacío para una cadena solo de espacios", () => {
    expect(normalizeAnswer("   ")).toBe("");
  });
});

describe("acceptedAnswers", () => {
  it("envuelve un string en un array", () => {
    expect(acceptedAnswers("hola")).toEqual(["hola"]);
  });

  it("devuelve el array tal cual si ya es array", () => {
    expect(acceptedAnswers(["a", "b"])).toEqual(["a", "b"]);
  });

  it("devuelve un array vacío para un array vacío", () => {
    expect(acceptedAnswers([])).toEqual([]);
  });
});

describe("primaryAnswer", () => {
  it("devuelve el string directamente", () => {
    expect(primaryAnswer("hola")).toBe("hola");
  });

  it("devuelve la primera alternativa de un array", () => {
    expect(primaryAnswer(["primero", "segundo"])).toBe("primero");
  });

  it("devuelve vacío si el array no tiene elementos", () => {
    expect(primaryAnswer([])).toBe("");
  });
});

describe("isAnswerCorrect", () => {
  it("acepta mayúsculas/minúsculas indistintamente", () => {
    expect(isAnswerCorrect("Hello", "  HELLO  ")).toBe(true);
  });

  it("tolera espacios internos y externos", () => {
    expect(isAnswerCorrect("new List<int>()", "new  List<int>()  ")).toBe(true);
  });

  it("acepta cualquiera de las alternativas (string[])", () => {
    expect(isAnswerCorrect(["yes", "y", "sí"], "Y")).toBe(true);
  });

  it("rechaza un valor que no coincide con ninguna alternativa", () => {
    expect(isAnswerCorrect(["yes", "y"], "no")).toBe(false);
  });

  it("rechaza un valor vacío", () => {
    expect(isAnswerCorrect("x", "")).toBe(false);
  });

  it("rechaza un valor solo de espacios", () => {
    expect(isAnswerCorrect("x", "   ")).toBe(false);
  });

  it("rechaza cuando el valor es vacío aunque la respuesta esperada sea vacía", () => {
    expect(isAnswerCorrect("", "")).toBe(false);
  });
});

describe("isOrderingCorrect", () => {
  const order = ["a", "b", "c"];

  it("acepta la secuencia correcta de ids", () => {
    expect(isOrderingCorrect(order, "a,b,c")).toBe(true);
  });

  it("tolera espacios alrededor de los ids", () => {
    expect(isOrderingCorrect(order, " a , b , c ")).toBe(true);
  });

  it("rechaza un orden distinto", () => {
    expect(isOrderingCorrect(order, "c,b,a")).toBe(false);
  });

  it("rechaza una secuencia incompleta", () => {
    expect(isOrderingCorrect(order, "a,b")).toBe(false);
  });

  it("rechaza una secuencia con ids de más", () => {
    expect(isOrderingCorrect(order, "a,b,c,d")).toBe(false);
  });

  it("es sensible a mayúsculas en los ids", () => {
    expect(isOrderingCorrect(order, "A,b,c")).toBe(false);
  });

  it("acepta vacío solo si el orden esperado también es vacío", () => {
    expect(isOrderingCorrect([], "")).toBe(true);
  });
});

describe("isTrueFalseCorrect", () => {
  it("acepta 'true' cuando la respuesta esperada es true", () => {
    expect(isTrueFalseCorrect(true, "true")).toBe(true);
  });

  it("acepta 'false' cuando la respuesta esperada es false", () => {
    expect(isTrueFalseCorrect(false, "false")).toBe(true);
  });

  it("rechaza 'true' cuando la respuesta esperada es false", () => {
    expect(isTrueFalseCorrect(false, "true")).toBe(false);
  });

  it("rechaza 'false' cuando la respuesta esperada es true", () => {
    expect(isTrueFalseCorrect(true, "false")).toBe(false);
  });

  it("rechaza valores en mayúscula (solo acepta el literal exacto)", () => {
    expect(isTrueFalseCorrect(true, "TRUE")).toBe(false);
  });

  it("rechaza cualquier otro valor", () => {
    expect(isTrueFalseCorrect(true, "yes")).toBe(false);
  });

  it("rechaza un valor vacío", () => {
    expect(isTrueFalseCorrect(true, "")).toBe(false);
  });
});

describe("isMatchingCorrect", () => {
  const pairs = [
    { id: "p1", definition: "def1" },
    { id: "p2", definition: "def2" },
  ];

  it("acepta cuando todos los pares están correctos", () => {
    expect(
      isMatchingCorrect(pairs, { "pair-p1": "def1", "pair-p2": "def2" }),
    ).toBe(true);
  });

  it("tolera espacios alrededor de la definición", () => {
    expect(
      isMatchingCorrect(pairs, { "pair-p1": " def1 ", "pair-p2": "def2" }),
    ).toBe(true);
  });

  it("rechaza si un par no coincide", () => {
    expect(
      isMatchingCorrect(pairs, { "pair-p1": "def1", "pair-p2": "wrong" }),
    ).toBe(false);
  });

  it("rechaza si falta una respuesta", () => {
    expect(isMatchingCorrect(pairs, { "pair-p1": "def1" })).toBe(false);
  });

  it("rechaza con respuestas vacías", () => {
    expect(isMatchingCorrect(pairs, {})).toBe(false);
  });
});
