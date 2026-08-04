import type { FormatBaseProps } from "./FormatTypes";
import CodeBlock from "./CodeBlock";
import ChoiceOption from "./ChoiceOption";

/** Predicción de salida: snippet + opciones (MCQ con fallback a texto libre). */
export default function PredictionFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
  onVerify,
}: FormatBaseProps) {
  const prediction = exercise.prediction;
  if (!prediction) return null;

  const snippet = prediction.snippet ?? exercise.codeSnippet;
  const selected = (userAnswers["answer"] ?? "").trim();
  const invalid = incorrectKeys.has("answer");
  const correctIndex = prediction.options.findIndex(
    (o) => o.trim() === prediction.answer.trim(),
  );

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {prediction.prompt ??
          "¿Qué retorna o imprime el siguiente código?"}
      </p>

      <div className="rounded-[24px] border border-line bg-canvas p-4 sm:p-5">
        <CodeBlock code={snippet} fileName={exercise.fileName} />
      </div>

      <div
        role="radiogroup"
        aria-label="Opciones de salida"
        className="space-y-2"
      >
        {prediction.options.map((option, i) => (
          <ChoiceOption
            key={i}
            index={i}
            label={option}
            selected={selected === option}
            correct={i === correctIndex}
            solved={solved}
            onSelect={() => onAnswerChange("answer", option)}
          />
        ))}
      </div>

      {prediction.allowFreeText && (
        <div>
          <label
            htmlFor="prediction-free-text"
            className="mb-1.5 block text-[12px] font-semibold text-faint"
          >
            O escribe tu respuesta
          </label>
          <input
            id="prediction-free-text"
            type="text"
            value={selected}
            onChange={(e) => onAnswerChange("answer", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onVerify();
            }}
            placeholder="Escribe la salida exacta…"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid}
            className={`w-full rounded-[20px] border bg-surface-2 px-4 py-3 font-mono text-[14px] text-cream caret-brand transition-colors focus:outline-none focus:ring-2 ${
              invalid
                ? "border-danger/60 focus:border-danger focus:ring-danger/30"
                : "border-line focus:border-brand focus:ring-brand/30"
            }`}
          />
        </div>
      )}
    </div>
  );
}
