import type { FormatBaseProps } from "./FormatTypes";
import CodeBlock from "./CodeBlock";
import ChoiceOption from "./ChoiceOption";

/** Bug hunt: snippet con bug + opciones que describen la vulnerabilidad. */
export default function BugHuntFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const bug = exercise.bugHunt;
  if (!bug) return null;

  const selected = (userAnswers["choice"] ?? "").trim();
  const invalid = incorrectKeys.has("choice");

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {bug.prompt ?? "¿Qué bug o vulnerabilidad contiene este código?"}
      </p>

      <div className="rounded-[24px] border border-line bg-canvas p-4 sm:p-5">
        <CodeBlock code={bug.snippet} fileName={exercise.fileName} />
      </div>

      <div
        role="radiogroup"
        aria-label="Posibles bugs"
        className="space-y-2"
      >
        {bug.options.map((option, i) => (
          <ChoiceOption
            key={i}
            index={i}
            label={option}
            selected={selected === String(i)}
            correct={i === bug.correct}
            solved={solved}
            onSelect={() => onAnswerChange("choice", String(i))}
          />
        ))}
      </div>

      {invalid && (
        <p className="rounded-[20px] border border-danger/30 bg-danger/5 px-4 py-2.5 text-[13px] text-danger">
          No es ese el problema. Vuelve a leer el código con lupa: ¿qué pasaría
          si un atacante controlara la entrada?
        </p>
      )}
    </div>
  );
}
