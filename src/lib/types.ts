// ──────────────────────────────────────────────────────────────────────────
// Tipos del catalogo de ejercicios
// ──────────────────────────────────────────────────────────────────────────

import type { ExpectedAnswer } from "./answers";

/** Escenario de la terminal simulada (solo módulo Bash). */
export interface ShellScenario {
  preset: "home" | "logs" | "project" | "git-repo";
  cwd?: string;
  welcome?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// Formatos interactivos de ejercicio.
// El formato heredado es "legacy": codeSnippet con [INPUT_N] + inputs.
// Cada formato nuevo es aditivo: nunca sustituye al legacy, lo complementa.
// ──────────────────────────────────────────────────────────────────────────

export type ExerciseFormat =
  | "prediction"
  | "ordering"
  | "snippet-pick"
  | "bug-hunt"
  | "matching"
  | "context-dropdown"
  | "true-false";

/** Predicción de salida: snippet + opciones (MCQ con fallback a texto libre). */
export interface PredictionExercise {
  prompt?: string;
  /** Código a analizar. Si falta, se usa exercise.codeSnippet. */
  snippet?: string;
  options: string[];
  /** Valor correcto (debe normalizar igual que la opción correcta). */
  answer: string;
  allowFreeText?: boolean;
}

/** Paso de un ejercicio de ordenar pasos. */
export interface OrderingStep {
  id: string;
  label: string;
}

/** Ordenar pasos: lista revuelta + secuencia correcta (ids). */
export interface OrderingExercise {
  prompt?: string;
  steps: OrderingStep[];
  correctOrder: string[];
}

/** Elegir snippet correcto (o anti-patrón) entre 2-4 opciones. */
export interface SnippetPickExercise {
  prompt: string;
  snippets: { id: string; label: string; code: string; description?: string }[];
  /** Índice del snippet correcto (o el anti-patrón si prompt lo pide). */
  correct: number;
}

/** Bug hunt: snippet con bug + opciones que describen la vulnerabilidad. */
export interface BugHuntExercise {
  prompt?: string;
  snippet: string;
  options: string[];
  correct: number;
}

/** Par de un ejercicio de emparejar término ↔ definición. */
export interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

/** Match término ↔ definición. */
export interface MatchingExercise {
  prompt?: string;
  pairs: MatchingPair[];
  /** Definiciones en orden de pantalla (revueltas). Si falta, usa el orden de pairs. */
  definitions?: string[];
}

/** Dropdown contextual: snippet con [INPUT_N] y opciones por hueco. */
export interface ContextDropdownExercise {
  prompt?: string;
  /** Mapa INPUT_N -> opciones mostradas en el <select>. */
  options: Record<string, string[]>;
}

/** Afirmación de un ejercicio True/False. */
export interface TrueFalseStatement {
  id: string;
  text: string;
  answer: boolean;
  explanation?: string;
}

/** True/False rápido: afirmaciones para validar de forma instantánea. */
export interface TrueFalseExercise {
  prompt?: string;
  statements: TrueFalseStatement[];
}

export interface Exercise {
  id: number;
  title: string;
  stars: number;
  category: string;
  /** Secuencia de construccion (back -> front). Si existe, la UI muestra "Paso N". */
  step?: number;
  description: string;
  objective: string;
  tags: string[];
  fileName: string;
  completed?: boolean;
  /** Indicacion concreta de la tarea (se muestra encima del codigo). Si falta, se genera una. */
  instruction?: string;
  /** Texto teorico opcional (tab "Teoria"). */
  theory?: string;
  explanationText: string;
  /** Codigo con placeholders [INPUT_1], [INPUT_2]... que se renderizan como inputs inline. */
  codeSnippet: string;
  /** Mapa INPUT_N -> respuesta(s) esperada(s). Un string o varias alternativas validas. */
  inputs: Record<string, ExpectedAnswer>;
  /** Resumen/codigo de referencia mostrado en la tab de solucion. */
  completeCode: string;
  /** Terminal simulada opcional (ejercicios Bash). */
  simulation?: ShellScenario;
  /** Formato de interacción. Si falta, es el formato heredado [INPUT_N]. */
  format?: ExerciseFormat;
  prediction?: PredictionExercise;
  ordering?: OrderingExercise;
  snippetPick?: SnippetPickExercise;
  bugHunt?: BugHuntExercise;
  matching?: MatchingExercise;
  contextDropdown?: ContextDropdownExercise;
  trueFalse?: TrueFalseExercise;
}

export interface Module {
  key: string;
  name: string;
  icon: string;
  badge: string;
  /** Color base de Tailwind (emerald, blue, ...). */
  color: string;
  group: string;
  desc: string;
  topics: string[];
  exercises: Exercise[];
}
