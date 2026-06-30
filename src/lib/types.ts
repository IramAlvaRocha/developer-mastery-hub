// ──────────────────────────────────────────────────────────────────────────
// Tipos del catalogo de ejercicios
// ──────────────────────────────────────────────────────────────────────────

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
  /** Mapa INPUT_N -> respuesta esperada. */
  inputs: Record<string, string>;
  /** Resumen/codigo de referencia mostrado en la tab de solucion. */
  completeCode: string;
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
