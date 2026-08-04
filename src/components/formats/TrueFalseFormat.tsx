import type { FormatBaseProps } from "./FormatTypes";

/**
 * True/False rápido: cada afirmación se responde con Verdadero/Falso.
 * Verdadero tiene identidad verde (sage), Falso coral (peach) para que
 * el estado elegido se distinga de un vistazo.
 */
export default function TrueFalseFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const tf = exercise.trueFalse;
  if (!tf) return null;

  const answered = tf.statements.filter((s) =>
    (userAnswers[`tf-${s.id}`] ?? "").trim(),
  ).length;

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {tf.prompt ?? "Indica si cada afirmación es verdadera o falsa."}
      </p>

      <p className="text-[12px] font-semibold text-muted" aria-live="polite">
        {answered}/{tf.statements.length} respondidas
      </p>

      <ul className="space-y-3">
        {tf.statements.map((statement, i) => {
          const key = `tf-${statement.id}`;
          const value = (userAnswers[key] ?? "").trim();
          const invalid = incorrectKeys.has(key);
          const answeredBool = value === "true" || value === "false";
          const isCorrect = solved && value === String(statement.answer);
          const isWrong = solved && answeredBool && !isCorrect;

          return (
            <li
              key={statement.id}
              className={`rounded-[24px] border p-4 transition-colors ${
                solved && isCorrect
                  ? "border-brand/40 bg-brand/5"
                  : solved && isWrong
                    ? "border-danger/40 bg-danger/5"
                    : answeredBool
                      ? "border-line-soft bg-surface-2"
                      : "border-line bg-surface-2"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-cream/95">
                  <span className="mr-2 font-mono text-[11px] font-bold text-muted">
                    {i + 1}.
                  </span>
                  {statement.text}
                </p>
                <span
                  aria-hidden
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    solved && isCorrect
                      ? "bg-brand/15 text-brand"
                      : solved && isWrong
                        ? "bg-danger/15 text-danger"
                        : answeredBool
                          ? value === "true"
                            ? "bg-sage/15 text-sage"
                            : "bg-peach/15 text-peach"
                          : "bg-elevated/60 text-faint"
                  }`}
                >
                  {solved && isCorrect
                    ? "✓ Correcto"
                    : solved && isWrong
                      ? "✗ Incorrecto"
                      : answeredBool
                        ? value === "true"
                          ? "V"
                          : "F"
                        : "•"}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label={`Afirmación ${i + 1}`}
                className="mt-3 flex gap-2"
              >
                <TrueFalseButton
                  tone="true"
                  selected={value === "true"}
                  state={
                    solved && statement.answer === true
                      ? "correct"
                      : solved && value === "true"
                        ? "incorrect"
                        : "idle"
                  }
                  onClick={() => onAnswerChange(key, "true")}
                >
                  Verdadero
                </TrueFalseButton>
                <TrueFalseButton
                  tone="false"
                  selected={value === "false"}
                  state={
                    solved && statement.answer === false
                      ? "correct"
                      : solved && value === "false"
                        ? "incorrect"
                        : "idle"
                  }
                  onClick={() => onAnswerChange(key, "false")}
                >
                  Falso
                </TrueFalseButton>
              </div>

              {solved && statement.explanation && (
                <p className="mt-3 border-t border-line-soft pt-2.5 text-[12.5px] leading-relaxed text-muted">
                  {statement.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TrueFalseButton({
  tone,
  selected,
  state,
  onClick,
  children,
}: {
  tone: "true" | "false";
  selected: boolean;
  state: "idle" | "correct" | "incorrect";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const base =
    "flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2";
  // Identidad de color por respuesta: Verdadero verde menta, Falso coral.
  const toneSelected =
    tone === "true"
      ? "border-sage/60 bg-sage/10 text-sage"
      : "border-peach/60 bg-peach/10 text-peach";
  const cls =
    state === "correct"
      ? `${base} border-brand/50 bg-brand/10 text-brand`
      : state === "incorrect"
        ? `${base} border-danger/50 bg-danger/10 text-danger`
        : selected
          ? `${base} ${toneSelected}`
          : `${base} border-line bg-canvas/60 text-muted hover:text-cream`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cls}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          selected
            ? tone === "true"
              ? "bg-sage"
              : "bg-peach"
            : "bg-elevated"
        }`}
      />
      {children}
    </button>
  );
}
