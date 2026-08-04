import type { FormatBaseProps } from "./FormatTypes";
import CodeBlock from "./CodeBlock";
import ChoiceOption from "./ChoiceOption";

/** Elegir snippet correcto (o anti-patrón) entre varias opciones. */
export default function SnippetPickFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const pick = exercise.snippetPick;
  if (!pick) return null;

  const selected = (userAnswers["choice"] ?? "").trim();
  const invalid = incorrectKeys.has("choice");

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {pick.prompt}
      </p>

      {invalid && (
        <p className="rounded-[20px] border border-danger/30 bg-danger/5 px-4 py-2.5 text-[13px] text-danger">
          La opción elegida no es la correcta. Revisa los snippets y vuelve a
          intentarlo.
        </p>
      )}

      <div
        role="radiogroup"
        aria-label="Snippets a elegir"
        className="grid gap-3 sm:grid-cols-2"
      >
        {pick.snippets.map((snippet, i) => (
          <div
            key={snippet.id}
            className={`overflow-hidden rounded-[24px] border bg-surface transition-colors ${
              solved && i === pick.correct
                ? "border-brand/40"
                : solved && selected === String(i)
                  ? "border-danger/50"
                  : "border-line"
            }`}
          >
            <div className="border-b border-line bg-surface-2 px-3 py-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-faint">
                {snippet.label}
              </p>
            </div>
            <div className="max-h-56 overflow-y-auto bg-canvas p-3">
              <CodeBlock code={snippet.code} fileName={exercise.fileName} />
            </div>
            {snippet.description && (
              <p className="border-t border-line-soft px-3 py-2 text-[12px] leading-relaxed text-muted">
                {snippet.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        role="radiogroup"
        aria-label="Elige el snippet"
        className="space-y-2"
      >
        {pick.snippets.map((snippet, i) => (
          <ChoiceOption
            key={snippet.id}
            index={i}
            label={`${snippet.label} — ${snippet.description ?? "elige este snippet"}`}
            selected={selected === String(i)}
            correct={i === pick.correct}
            solved={solved}
            onSelect={() => onAnswerChange("choice", String(i))}
          />
        ))}
      </div>
    </div>
  );
}
