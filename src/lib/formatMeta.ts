import type { Exercise, ExerciseFormat } from "./types";

// ──────────────────────────────────────────────────────────────────────────
// Metadatos de los formatos de ejercicio: labels cortos en español + icono,
// y utilidad para derivar la lista de formatos presentes en un módulo.
// ──────────────────────────────────────────────────────────────────────────

export const FORMAT_LABELS: Record<
  ExerciseFormat,
  { label: string; icon: string }
> = {
  prediction: { label: "Predecir salida", icon: "🎯" },
  ordering: { label: "Ordenar pasos", icon: "🔀" },
  "snippet-pick": { label: "Elegir snippet", icon: "⚖️" },
  "bug-hunt": { label: "Bug hunt", icon: "🐛" },
  matching: { label: "Emparejar", icon: "🔗" },
  "context-dropdown": { label: "Completar huecos", icon: "🔽" },
  "true-false": { label: "V/F", icon: "✅" },
};

/** Opción del filtro de formato: `format: null` representa "Todos". */
export interface FormatOption {
  format: ExerciseFormat | null;
  label: string;
  icon?: string;
  count: number;
}

/** Formatos presentes en un módulo (con "Todos" primero), en orden de FORMAT_LABELS. */
export function getModuleFormats(exercises: Exercise[]): FormatOption[] {
  const counts = new Map<ExerciseFormat, number>();
  for (const ex of exercises) {
    if (ex.format) {
      counts.set(ex.format, (counts.get(ex.format) ?? 0) + 1);
    }
  }
  const present = (Object.keys(FORMAT_LABELS) as ExerciseFormat[]).filter(
    (f) => counts.has(f),
  );
  return [
    { format: null, label: "Todos", icon: "✦", count: exercises.length },
    ...present.map((f) => ({
      format: f,
      label: FORMAT_LABELS[f].label,
      icon: FORMAT_LABELS[f].icon,
      count: counts.get(f) ?? 0,
    })),
  ];
}
