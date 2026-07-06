import type { Exercise } from "@/lib/types";

export interface ExerciseEnrichment {
  /** Oración inicial en lenguaje cotidiano (se antepone a description). */
  descriptionPrefix?: string;
  /** Analogía breve visible en la pestaña Mentoría. */
  everydayInExplanation?: string;
  /** Contenido markdown para la pestaña Teoría. */
  theory?: string;
}

export type EnrichmentMap = Record<number, ExerciseEnrichment>;

export function enrichExercises(
  exercises: Exercise[],
  enrichments: EnrichmentMap,
): Exercise[] {
  return exercises.map((exercise) => {
    const extra = enrichments[exercise.id];
    if (!extra) return exercise;

    const description = extra.descriptionPrefix
      ? `${extra.descriptionPrefix} ${exercise.description}`
      : exercise.description;

    const explanationText = extra.everydayInExplanation
      ? `🌍 Ejemplo cotidiano: ${extra.everydayInExplanation}\n\n${exercise.explanationText}`
      : exercise.explanationText;

    return {
      ...exercise,
      description,
      explanationText,
      theory: extra.theory ?? exercise.theory,
    };
  });
}
