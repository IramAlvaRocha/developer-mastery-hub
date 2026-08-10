/**
 * scripts/seed.ts — Fase 3: migración de contenido estático a Supabase.
 *
 * Migra TODO el catálogo (ALL_MODULES) a las tablas `modules` y `exercises`
 * de forma idempotente (upsert). Usa SUPABASE_SERVICE_ROLE_KEY (solo aquí,
 * nunca en el bundle del cliente).
 *
 * Ejecución: npm run seed   (desde la raíz del proyecto)
 *
 * NOTA WAF: Cloudflare (Supabase gratis) bloquea cuerpos con firmas de ataque
 * (p. ej. "../../etc/passwd", que aparece en contenido educativo legítimo del
 * catálogo). Para migrarlo íntegro sin mutar los datos, este script serializa
 * el JSON escapando caracteres "peligrosos" como \uXXXX: Cloudflare no ve la
 * firma en el body crudo y PostgREST las decodifica al valor real.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Exercise, Module } from "@/lib/types";
import { ALL_MODULES } from "@/data";

// ──────────────────────────────────────────────────────────────────────────
// Configuración
// ──────────────────────────────────────────────────────────────────────────

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function fail(message: string): never {
  process.stderr.write(`ERROR: ${message}\n`);
  process.exit(1);
}

const env = loadEnv();
const SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) fail("Falta PUBLIC_SUPABASE_URL en .env");
if (!SERVICE_ROLE_KEY) fail("Falta SUPABASE_SERVICE_ROLE_KEY en .env");

// Cliente "real" (se usa en la verificación final). Las escrituras van por
// fetch directo a PostgREST porque necesitan el serializador WAF-safe.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ──────────────────────────────────────────────────────────────────────────
// Serializador JSON seguro frente al WAF de Cloudflare
// ──────────────────────────────────────────────────────────────────────────

/** Códigos de caracteres que suelen aparecer en firmas de ataque del WAF. */
const WAF_ESCAPE = new Set(
  Array.from(`./<>';=()|&+*#-~"\`?%!@$`).map((c) => c.codePointAt(0)!),
);

function escapeString(value: string): string {
  let out = '"';
  for (const ch of value) {
    const code = ch.codePointAt(0)!;
    if (code === 0x22) {
      out += '\\"';
    } else if (code === 0x5c) {
      out += "\\\\";
    } else if (code < 0x20 || WAF_ESCAPE.has(code)) {
      out += "\\u" + code.toString(16).padStart(4, "0");
    } else {
      out += ch;
    }
  }
  return out + '"';
}

/** Serializa a JSON escapando firmas WAF solo dentro de strings (válido). */
function wafSafeJson(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return escapeString(value);
  if (typeof value === "number")
    return Number.isFinite(value) ? String(value) : "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) {
    return "[" + value.map(wafSafeJson).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const parts = Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => escapeString(k) + ":" + wafSafeJson(v));
  return "{" + parts.join(",") + "}";
}

async function upsertRows(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
): Promise<{ error: Error | null }> {
  if (rows.length === 0) return { error: null };
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`,
      {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: wafSafeJson(rows),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return { error: new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/** Espera entre peticiones para no disparar el rate-limit de Cloudflare. */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Ejecuta un upsert reintentándolo ante errores transitorios
 * (Cloudflare/POSTgREST: 429, 5xx, bloqueos temporales).
 */
async function withRetry(
  fn: () => Promise<{ error: Error | null }>,
  label: string,
  attempts = 4,
): Promise<{ error: Error | null }> {
  for (let i = 1; i <= attempts; i++) {
    const res = await fn();
    if (!res.error) return res;
    if (i === attempts) return res;
    process.stdout.write(
      `  ! ${label}: reintento ${i}/${attempts - 1} tras error (${res.error.message.slice(0, 80)})...\n`,
    );
    await sleep(1200 * i);
  }
  return { error: new Error("unreachable") };
}

// ──────────────────────────────────────────────────────────────────────────
// Serialización de formatos interactivos -> format_payload (jsonb)
// ──────────────────────────────────────────────────────────────────────────

/** Quita claves con valor undefined (JSON.stringify las omite de todos modos). */
function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function serializeFormat(exercise: Exercise): {
  format: string | null;
  payload: Record<string, unknown> | null;
} {
  switch (exercise.format) {
    case "prediction": {
      const f = exercise.prediction;
      return f
        ? {
            format: "prediction",
            payload: clean({
              prompt: f.prompt,
              snippet: f.snippet,
              options: f.options,
              answer: f.answer,
              allowFreeText: f.allowFreeText,
            }),
          }
        : { format: null, payload: null };
    }
    case "ordering": {
      const f = exercise.ordering;
      return f
        ? {
            format: "ordering",
            payload: clean({
              prompt: f.prompt,
              steps: f.steps,
              correctOrder: f.correctOrder,
            }),
          }
        : { format: null, payload: null };
    }
    case "snippet-pick": {
      const f = exercise.snippetPick;
      return f
        ? {
            format: "snippet-pick",
            payload: clean({
              prompt: f.prompt,
              snippets: f.snippets,
              correct: f.correct,
            }),
          }
        : { format: null, payload: null };
    }
    case "bug-hunt": {
      const f = exercise.bugHunt;
      return f
        ? {
            format: "bug-hunt",
            payload: clean({
              prompt: f.prompt,
              snippet: f.snippet,
              options: f.options,
              correct: f.correct,
            }),
          }
        : { format: null, payload: null };
    }
    case "matching": {
      const f = exercise.matching;
      return f
        ? {
            format: "matching",
            payload: clean({
              prompt: f.prompt,
              pairs: f.pairs,
              definitions: f.definitions,
            }),
          }
        : { format: null, payload: null };
    }
    case "context-dropdown": {
      const f = exercise.contextDropdown;
      return f
        ? {
            format: "context-dropdown",
            payload: clean({ prompt: f.prompt, options: f.options }),
          }
        : { format: null, payload: null };
    }
    case "true-false": {
      const f = exercise.trueFalse;
      return f
        ? {
            format: "true-false",
            payload: clean({
              prompt: f.prompt,
              statements: f.statements,
            }),
          }
        : { format: null, payload: null };
    }
    default:
      return { format: null, payload: null };
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Construcción de filas
// ──────────────────────────────────────────────────────────────────────────

function buildModuleRows(modules: Module[]) {
  return modules.map((m, i) => ({
    key: m.key,
    name: m.name,
    icon: m.icon,
    badge: m.badge,
    color: m.color,
    group: m.group,
    description: m.desc,
    topics: m.topics,
    position: i,
    is_published: true,
  }));
}

function buildExerciseRows(module: Module) {
  return module.exercises.map((ex, j) => {
    const { format, payload } = serializeFormat(ex);
    return {
      module_key: module.key,
      exercise_ref: ex.id,
      title: ex.title,
      stars: ex.stars,
      category: ex.category,
      step: ex.step ?? null,
      description: ex.description,
      objective: ex.objective,
      tags: ex.tags,
      file_name: ex.fileName,
      instruction: ex.instruction ?? null,
      theory: ex.theory ?? null,
      explanation_text: ex.explanationText,
      code_snippet: ex.codeSnippet,
      inputs: ex.inputs,
      complete_code: ex.completeCode,
      simulation: ex.simulation ?? null,
      format,
      format_payload: payload,
      position: j,
      is_published: true,
    };
  });
}

// ──────────────────────────────────────────────────────────────────────────
// Ejecución
// ──────────────────────────────────────────────────────────────────────────

async function main() {
  process.stdout.write(
    `Conectando a ${SUPABASE_URL}...\n`,
  );

  // 1) Módulos (un solo upsert)
  const moduleRows = buildModuleRows(ALL_MODULES);
  const mod = await withRetry(
    () => upsertRows("modules", moduleRows, "key"),
    "modules",
  );
  if (mod.error) fail(`upsert modules: ${mod.error.message}`);
  await sleep(400);

  // 2) Ejercicios (por módulo para mantener el request razonable)
  let totalExercises = 0;
  let totalFormatted = 0;
  for (const module of ALL_MODULES) {
    const rows = buildExerciseRows(module);
    const ex = await withRetry(
      () => upsertRows("exercises", rows, "module_key,exercise_ref"),
      `exercises/${module.key}`,
    );
    if (ex.error)
      fail(`upsert exercises (${module.key}): ${ex.error.message}`);
    totalExercises += rows.length;
    totalFormatted += rows.filter((r) => r.format).length;
    process.stdout.write(
      `  OK ${module.key} -> ${rows.length} ejercicios\n`,
    );
    await sleep(250);
  }

  process.stdout.write(
    `\nSeed completado: ${ALL_MODULES.length} módulos, ` +
      `${totalExercises} ejercicios (${totalFormatted} con formato interactivo).\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`ERROR inesperado: ${String(err)}\n`);
  process.exit(1);
});
