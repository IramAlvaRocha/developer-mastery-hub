import { Fragment } from "react";
import type { FormatBaseProps } from "./FormatTypes";
import { detectLang, tokenize } from "@/lib/codeHighlight";
import { primaryAnswer } from "@/lib/answers";

const SPLIT_RE = /\[INPUT_(\d+)\]/g;

/** Dropdown contextual: huecos [INPUT_N] resueltos con un <select> inline. */
export default function ContextDropdownFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const dropdown = exercise.contextDropdown;
  if (!dropdown) return null;

  const lang = detectLang(exercise.fileName);
  const lines = exercise.codeSnippet.split("\n");

  function renderSelect(num: string, lineIdx: number) {
    const key = `INPUT_${num}`;
    const choices = dropdown.options[key] ?? [];
    const expected = primaryAnswer(exercise.inputs[key] ?? "");
    const value = userAnswers[key] ?? "";
    const invalid = incorrectKeys.has(key);
    const correct = solved && value && value === expected;

    return (
      <select
        key={`l${lineIdx}-in${num}`}
        value={value}
        onChange={(e) => onAnswerChange(key, e.target.value)}
        aria-label={`Hueco ${num} de ${exercise.fileName}`}
        aria-invalid={invalid}
        className={`mx-0.5 inline-block max-w-full cursor-pointer rounded-lg border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-cream transition-colors focus:outline-none focus:ring-2 md:text-xs ${
          invalid
            ? "border-danger/60 text-danger focus:border-danger focus:ring-danger/30"
            : correct
              ? "border-brand/50 text-brand focus:border-brand focus:ring-brand/30"
              : value
                ? "border-brand/40 text-brand focus:border-brand focus:ring-brand/30"
                : "border-line text-muted focus:border-brand focus:ring-brand/30"
        }`}
      >
        <option value="" disabled>
          {`#${num} →`}
        </option>
        {choices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-4">
      {dropdown.prompt && (
        <p className="text-[15px] leading-relaxed text-cream/95">
          {dropdown.prompt}
        </p>
      )}

      <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4] md:text-xs">
        <code>
          {lines.map((line, lineIdx) => {
            const segs = line.split(SPLIT_RE);
            const nodes: React.ReactNode[] = [];
            segs.forEach((seg, i) => {
              if (i % 2 === 1) {
                nodes.push(renderSelect(seg, lineIdx));
                return;
              }
              nodes.push(
                <Fragment key={`l${lineIdx}-s${i}`}>
                  {tokenize(seg, lang, `l${lineIdx}-s${i}`)}
                </Fragment>,
              );
            });
            return (
              <Fragment key={`line-${lineIdx}`}>
                {nodes}
                {lineIdx < lines.length - 1 ? "\n" : null}
              </Fragment>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
