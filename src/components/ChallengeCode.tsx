import { Fragment } from "react";

interface Props {
  codeSnippet: string;
  inputs: Record<string, string>;
  userAnswers: Record<string, string>;
  onAnswerChange: (key: string, value: string) => void;
  onVerify: () => void;
}

// Divide el codigo en segmentos de texto y placeholders [INPUT_N].
// El capture group hace que split() intercale los numeros de cada hueco.
const SPLIT_RE = /\[INPUT_(\d+)\]/g;

export default function ChallengeCode({
  codeSnippet,
  inputs,
  userAnswers,
  onAnswerChange,
  onVerify,
}: Props) {
  const parts = codeSnippet.split(SPLIT_RE);

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4] md:text-xs">
      <code>
        {parts.map((part, index) => {
          // Los indices impares son los numeros capturados del placeholder.
          if (index % 2 === 1) {
            const key = `INPUT_${part}`;
            const expected = inputs[key] ?? "";
            const value = userAnswers[key] ?? "";
            const filled = value.trim().length > 0;
            const width = Math.max(expected.length, value.length, 4) + 1;
            return (
              <input
                key={`gap-${index}`}
                type="text"
                value={value}
                onChange={(e) => onAnswerChange(key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onVerify();
                }}
                style={{ width: `${width}ch` }}
                className={`mx-0.5 inline-block rounded-md border px-1.5 py-0 align-baseline font-mono text-[11px] caret-brand transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                  filled
                    ? "border-brand/40 bg-brand/10 text-brand"
                    : "border-line bg-[#1a1a1c] text-ink"
                }`}
                placeholder={`#${part}`}
                autoComplete="off"
                spellCheck={false}
                aria-label={`Espacio ${part}`}
              />
            );
          }
          return <Fragment key={`txt-${index}`}>{part}</Fragment>;
        })}
      </code>
    </pre>
  );
}
