import type { Exercise } from "@/lib/types";

/** Props compartidas por todos los renderers de formatos nuevos. */
export interface FormatBaseProps {
  exercise: Exercise;
  color: string;
  userAnswers: Record<string, string>;
  incorrectKeys: Set<string>;
  solved: boolean;
  onAnswerChange: (key: string, value: string) => void;
  onVerify: () => void;
}

/** Píldora de estado para una opción de elección (radio). */
export type ChoiceState = "idle" | "selected" | "correct" | "incorrect";

/** Clases de estilo por estado, reutilizadas por todos los formatos MCQ. */
export const CHOICE_STYLES: Record<ChoiceState, string> = {
  idle:
    "border-line bg-surface-2 text-muted hover:border-line-soft hover:text-cream",
  selected: "mod-border-40 mod-bg-15 text-cream",
  correct: "border-brand/50 bg-brand/10 text-cream",
  incorrect: "border-danger/50 bg-danger/10 text-cream",
};

export const LETTERS = ["A", "B", "C", "D", "E", "F"];
