// ──────────────────────────────────────────────────────────────────────────
// Tests unitarios del núcleo puro del progreso persistente.
// Claves scoped por uid, merge aditivo y detección de bloqueo por RLS.
// ──────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from "vitest";
import {
  LAST_KEY,
  MAX_ATTEMPTS,
  PREFIX,
  attemptsKey,
  isDueForReview,
  isRlsBlocked,
  lastKey,
  mergeAttemptMaps,
  mergeRows,
  moduleKey,
  recordAttemptValue,
  sanitizeAttempts,
  type AttemptRecord,
  type AttemptsMap,
  type ProgressMap,
  type ProgressRow,
} from "./progressCore";

describe("moduleKey", () => {
  it("scopa la clave con el uid", () => {
    expect(moduleKey("bash", "user-123")).toBe("mastery_hub_user-123_bash");
  });

  it("usa la clave legacy sin uid (null)", () => {
    expect(moduleKey("bash", null)).toBe("mastery_hub_bash");
  });

  it("trata un uid vacío como sin uid (fallback legacy)", () => {
    expect(moduleKey("bash", "")).toBe("mastery_hub_bash");
  });

  it("respeta el prefijo global", () => {
    expect(PREFIX).toBe("mastery_hub_");
    expect(moduleKey("bash", "u").startsWith(PREFIX)).toBe(true);
  });
});

describe("lastKey", () => {
  it("scopa la clave de último visitado con el uid", () => {
    expect(lastKey("user-123")).toBe("mastery_hub_last_user-123");
  });

  it("usa la clave legacy sin uid", () => {
    expect(lastKey(null)).toBe("mastery_hub_last");
  });

  it("respeta la constante LAST_KEY", () => {
    expect(LAST_KEY).toBe("mastery_hub_last");
  });
});

describe("mergeRows", () => {
  it("construye el mapa desde filas si no hay nada local", () => {
    const rows: ProgressRow[] = [
      { module_key: "bash", exercise_ref: 1 },
      { module_key: "bash", exercise_ref: 2 },
    ];
    expect(mergeRows({}, rows)).toEqual({ bash: [1, 2] });
  });

  it("suma filas de la nube sin perder lo local", () => {
    const local: ProgressMap = { bash: [1] };
    const rows: ProgressRow[] = [{ module_key: "bash", exercise_ref: 2 }];
    expect(mergeRows(local, rows)).toEqual({ bash: [1, 2] });
  });

  it("no duplica un exercise_ref que ya existe", () => {
    const local: ProgressMap = { bash: [1] };
    const rows: ProgressRow[] = [{ module_key: "bash", exercise_ref: 1 }];
    expect(mergeRows(local, rows)).toEqual({ bash: [1] });
  });

  it("crea claves nuevas para módulos que solo existen en la nube", () => {
    const local: ProgressMap = { bash: [1] };
    const rows: ProgressRow[] = [{ module_key: "git", exercise_ref: 7 }];
    expect(mergeRows(local, rows)).toEqual({ bash: [1], git: [7] });
  });

  it("conserva las claves locales sin filas en la nube", () => {
    const local: ProgressMap = { bash: [1], git: [2] };
    expect(mergeRows(local, [])).toEqual({ bash: [1], git: [2] });
  });

  it("no muta el mapa local de entrada", () => {
    const local: ProgressMap = { bash: [1] };
    mergeRows(local, [{ module_key: "bash", exercise_ref: 2 }]);
    expect(local).toEqual({ bash: [1] });
  });
});

describe("isRlsBlocked", () => {
  it("detecta el código 42501 de PostgREST", () => {
    expect(isRlsBlocked({ code: "42501" })).toBe(true);
  });

  it("detecta el mensaje row-level security (mayúsculas mezcladas)", () => {
    expect(
      isRlsBlocked({ message: "new row violates Row-Level Security policy" }),
    ).toBe(true);
  });

  it("detecta el mensaje row-level security en minúsculas", () => {
    expect(
      isRlsBlocked({ message: "row-level security violation" }),
    ).toBe(true);
  });

  it("no detecta un error ajeno (código y mensaje distintos)", () => {
    expect(isRlsBlocked({ code: "23505", message: "duplicate key" })).toBe(
      false,
    );
  });

  it("no detecta un objeto vacío", () => {
    expect(isRlsBlocked({})).toBe(false);
  });

  it("no detecta null ni undefined", () => {
    expect(isRlsBlocked(null)).toBe(false);
    expect(isRlsBlocked(undefined)).toBe(false);
  });

  it("no detecta un string suelto con el código dentro", () => {
    expect(isRlsBlocked("42501")).toBe(false);
  });
});

describe("attemptsKey", () => {
  it("scopa la clave de intentos con el uid", () => {
    expect(attemptsKey("user-123")).toBe("mastery_hub_attempts_user-123");
  });

  it("usa la clave legacy sin uid (null)", () => {
    expect(attemptsKey(null)).toBe("mastery_hub_attempts");
  });

  it("trata un uid vacío como sin uid", () => {
    expect(attemptsKey("")).toBe("mastery_hub_attempts");
  });
});

describe("recordAttemptValue", () => {
  it("crea el primer intento con attempts=1", () => {
    expect(recordAttemptValue(undefined, true, [], 1000)).toEqual({
      attempts: 1,
      lastCorrect: true,
      lastErrorKeys: [],
      lastAttemptAt: 1000,
    });
  });

  it("incrementa attempts sobre un registro previo", () => {
    const prev: AttemptRecord = {
      attempts: 3,
      lastCorrect: true,
      lastErrorKeys: ["INPUT_1"],
      lastAttemptAt: 1000,
    };
    const next = recordAttemptValue(prev, false, ["INPUT_2"], 2000);
    expect(next.attempts).toBe(4);
    expect(next.lastAttemptAt).toBe(2000);
  });

  it("sobrescribe lastCorrect y lastErrorKeys en cada intento", () => {
    const prev: AttemptRecord = {
      attempts: 2,
      lastCorrect: true,
      lastErrorKeys: ["INPUT_1"],
      lastAttemptAt: 1000,
    };
    const next = recordAttemptValue(prev, false, ["INPUT_1", "INPUT_2"], 2000);
    expect(next.lastCorrect).toBe(false);
    expect(next.lastErrorKeys).toEqual(["INPUT_1", "INPUT_2"]);
  });

  it("fija lastAttemptAt al timestamp recibido", () => {
    const next = recordAttemptValue(undefined, false, ["a"], 424242);
    expect(next.lastAttemptAt).toBe(424242);
  });

  it("no comparte la referencia de errorKeys (copia defensiva)", () => {
    const keys = ["INPUT_1"];
    const next = recordAttemptValue(undefined, false, keys, 1);
    keys.push("INPUT_2");
    expect(next.lastErrorKeys).toEqual(["INPUT_1"]);
  });

  it("clampea attempts a MAX_ATTEMPTS cuando el registro previo es gigante", () => {
    const prev: AttemptRecord = {
      attempts: 5_000_000_000,
      lastCorrect: true,
      lastErrorKeys: [],
      lastAttemptAt: 1,
    };
    const next = recordAttemptValue(prev, true, [], 2);
    expect(next.attempts).toBe(MAX_ATTEMPTS);
  });

  it("colapsa a 1 un previo con attempts no finito y suma 1", () => {
    const next = recordAttemptValue(
      {
        attempts: Number.NaN,
        lastCorrect: false,
        lastErrorKeys: [],
        lastAttemptAt: 1,
      },
      false,
      [],
      2,
    );
    expect(next.attempts).toBe(2);
  });
});

describe("isDueForReview", () => {
  const INTERVAL = 3 * 24 * 60 * 60 * 1000;

  it("completado sin intento registrado → vencido", () => {
    expect(isDueForReview(undefined, true, 10000, INTERVAL)).toBe(true);
  });

  it("completado con intento reciente → no vencido", () => {
    const rec: AttemptRecord = {
      attempts: 1,
      lastCorrect: true,
      lastErrorKeys: [],
      lastAttemptAt: 10000,
    };
    expect(isDueForReview(rec, true, 10000 + INTERVAL - 1, INTERVAL)).toBe(
      false,
    );
  });

  it("completado con intento viejo → vencido", () => {
    const rec: AttemptRecord = {
      attempts: 1,
      lastCorrect: true,
      lastErrorKeys: [],
      lastAttemptAt: 10000,
    };
    expect(isDueForReview(rec, true, 10000 + INTERVAL, INTERVAL)).toBe(true);
  });

  it("no completado → nunca vencido (aunque haya intento)", () => {
    const rec: AttemptRecord = {
      attempts: 2,
      lastCorrect: false,
      lastErrorKeys: ["INPUT_1"],
      lastAttemptAt: 10000,
    };
    expect(isDueForReview(rec, false, 10000 + INTERVAL * 2, INTERVAL)).toBe(
      false,
    );
  });

  it("no completado y sin intento → no vencido", () => {
    expect(isDueForReview(undefined, false, 999999, INTERVAL)).toBe(false);
  });
});

describe("mergeAttemptMaps", () => {
  const rec = (at: number): AttemptRecord => ({
    attempts: 1,
    lastCorrect: true,
    lastErrorKeys: [],
    lastAttemptAt: at,
  });

  it("suma ejercicios de `incoming` sin perder los de `base`", () => {
    const base: AttemptsMap = { bash: { 1: rec(1000) } };
    const incoming: AttemptsMap = { bash: { 2: rec(2000) } };
    expect(mergeAttemptMaps(base, incoming)).toEqual({
      bash: { 1: rec(1000), 2: rec(2000) },
    });
  });

  it("el más reciente gana cuando hay conflicto", () => {
    const base: AttemptsMap = { bash: { 1: rec(1000) } };
    const incoming: AttemptsMap = { bash: { 1: rec(2000) } };
    expect(mergeAttemptMaps(base, incoming).bash[1]?.lastAttemptAt).toBe(2000);
  });

  it("conserva lo local (más reciente) frente a la nube (más vieja)", () => {
    const base: AttemptsMap = { bash: { 1: rec(3000) } };
    const incoming: AttemptsMap = { bash: { 1: rec(2000) } };
    expect(mergeAttemptMaps(base, incoming).bash[1]?.lastAttemptAt).toBe(3000);
  });

  it("no muta el mapa base de entrada", () => {
    const base: AttemptsMap = { bash: { 1: rec(1000) } };
    mergeAttemptMaps(base, { bash: { 2: rec(2000) } });
    expect(base).toEqual({ bash: { 1: rec(1000) } });
  });

  it("devuelve un mapa sin prototipo y descarta claves peligrosas", () => {
    const incoming = JSON.parse(
      '{"__proto__":{"1":{"attempts":1,"lastCorrect":true,"lastErrorKeys":[],"lastAttemptAt":9000}}}',
    ) as AttemptsMap;
    const merged = mergeAttemptMaps({ bash: { 1: rec(1000) } }, incoming);
    expect(Object.getPrototypeOf(merged)).toBeNull();
    expect(Object.keys(merged)).toEqual(["bash"]);
  });
});

describe("sanitizeAttempts", () => {
  it("devuelve vacío para null/undefined/no-objeto", () => {
    expect(sanitizeAttempts(null)).toEqual({});
    expect(sanitizeAttempts(undefined)).toEqual({});
    expect(sanitizeAttempts("nope")).toEqual({});
    expect(sanitizeAttempts(42)).toEqual({});
  });

  it("normaliza un AttemptsMap válido", () => {
    const input = {
      bash: {
        "1": {
          attempts: 3,
          lastCorrect: true,
          lastErrorKeys: ["INPUT_1"],
          lastAttemptAt: 1234,
        },
      },
    };
    expect(sanitizeAttempts(input)).toEqual({
      bash: {
        1: {
          attempts: 3,
          lastCorrect: true,
          lastErrorKeys: ["INPUT_1"],
          lastAttemptAt: 1234,
        },
      },
    });
  });

  it("descarta registros malformados (sin attempts)", () => {
    expect(
      sanitizeAttempts({ bash: { "1": { lastCorrect: true } } }),
    ).toEqual({});
  });

  it("coacciona lastCorrect ausente a false y lastErrorKeys ausente a []", () => {
    const out = sanitizeAttempts({ bash: { "1": { attempts: 1 } } });
    expect(out.bash[1]).toEqual({
      attempts: 1,
      lastCorrect: false,
      lastErrorKeys: [],
      lastAttemptAt: 0,
    });
  });

  it("clampea attempts gigantes a MAX_ATTEMPTS", () => {
    const out = sanitizeAttempts({ bash: { "1": { attempts: 5e9 } } });
    expect(out.bash[1].attempts).toBe(MAX_ATTEMPTS);
  });

  it("rechaza attempts no finitos colapsándolos a 1", () => {
    expect(
      sanitizeAttempts({ bash: { "1": { attempts: Number.NaN } } }).bash[1]
        .attempts,
    ).toBe(1);
    expect(
      sanitizeAttempts({ bash: { "1": { attempts: Number.POSITIVE_INFINITY } } })
        .bash[1].attempts,
    ).toBe(1);
  });

  it("descarta claves __proto__/constructor/prototype sin contaminar", () => {
    // JSON.parse crea una clave propia `__proto__` (a diferencia del literal).
    const malicious = JSON.parse(
      '{"__proto__":{"1":{"attempts":1}},"constructor":{"1":{"attempts":1}},"prototype":{"1":{"attempts":1}},"bash":{"1":{"attempts":2}}}',
    ) as unknown;
    const out = sanitizeAttempts(malicious);
    expect(Object.getPrototypeOf(out)).toBeNull();
    expect(Object.keys(out)).toEqual(["bash"]);
    expect(out.bash[1].attempts).toBe(2);
  });

  it("filtra elementos no-string de lastErrorKeys", () => {
    const out = sanitizeAttempts({
      bash: {
        "1": {
          attempts: 1,
          lastErrorKeys: ["INPUT_1", 42, null, {}, "INPUT_2"],
        },
      },
    });
    expect(out.bash[1].lastErrorKeys).toEqual(["INPUT_1", "INPUT_2"]);
  });
});
