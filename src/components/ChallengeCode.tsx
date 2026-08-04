import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ExpectedAnswer } from "@/lib/answers";
import { primaryAnswer } from "@/lib/answers";
import { detectLang, tokenize } from "@/lib/codeHighlight";

interface Props {
  codeSnippet: string;
  inputs: Record<string, ExpectedAnswer>;
  userAnswers: Record<string, string>;
  /** Huecos marcados como incorrectos tras la ultima verificacion. */
  incorrectKeys?: Set<string>;
  fileName?: string;
  onAnswerChange: (key: string, value: string) => void;
  onVerify: () => void;
}

const SPLIT_RE = /\[INPUT_(\d+)\]/g;

/** Clasifica una línea de un árbol de carpetas (folder / file / none). */
function lineKind(reconstructed: string): "folder" | "file" | "none" {
  const noComment = reconstructed.replace(/\/\/.*$/, "").trimEnd();
  if (!noComment.trim()) return "none";
  if (noComment.endsWith("/")) return "folder";
  if (/\.[A-Za-z0-9]+$/.test(noComment)) return "file";
  return "none";
}

/** Input inline que crece según el texto escrito (medido con un span espejo). */
function InlineAnswerInput({
  value,
  expected,
  placeholder,
  filled,
  invalid,
  onChange,
  onVerify,
  ariaLabel,
  ariaDescribedBy,
  hintId,
}: {
  value: string;
  expected: string;
  placeholder: string;
  filled: boolean;
  invalid: boolean;
  onChange: (v: string) => void;
  onVerify: () => void;
  ariaLabel: string;
  ariaDescribedBy?: string;
  hintId: string;
}) {
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);

  const measureText = value.length > 0 ? value : expected || placeholder;

  useLayoutEffect(() => {
    const el = mirrorRef.current;
    if (!el) return;
    setWidthPx(el.offsetWidth + 12);
  }, [measureText]);

  const minPx = Math.max(expected.length, value.length, 4) * 7.5 + 20;

  return (
    <span className="relative inline-block max-w-full align-baseline">
      <span
        ref={mirrorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre px-1.5 font-mono text-[11px] md:text-xs"
      >
        {measureText}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onVerify();
        }}
        style={{
          width: widthPx ? `${Math.max(widthPx, minPx)}px` : `${minPx}px`,
          maxWidth: "100%",
        }}
        className={`box-border inline-block overflow-x-auto rounded-lg border px-1.5 py-0.5 align-baseline font-mono text-[11px] caret-brand transition-[width,border-color,background-color] focus:outline-none focus:ring-2 md:text-xs ${
          invalid
            ? "border-rose-500/70 bg-rose-500/10 text-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
            : filled
              ? "border-brand/40 bg-brand/10 text-brand focus:border-brand focus:ring-brand/30"
              : "border-line bg-surface-2 text-ink focus:border-brand focus:ring-brand/30"
        }`}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={invalid}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <span id={hintId} className="sr-only">
        {invalid
          ? "Este campo es incorrecto, revísalo."
          : "Completa con la respuesta esperada."}
      </span>
    </span>
  );
}

export default function ChallengeCode({
  codeSnippet,
  inputs,
  userAnswers,
  incorrectKeys,
  fileName,
  onAnswerChange,
  onVerify,
}: Props) {
  const lang = detectLang(fileName);
  const tree = lang === "tree";
  const lines = codeSnippet.split("\n");

  function renderInput(num: string, lineIdx: number) {
    const key = `INPUT_${num}`;
    const expected = primaryAnswer(inputs[key] ?? "");
    const value = userAnswers[key] ?? "";
    return (
      <InlineAnswerInput
        key={`l${lineIdx}-in${num}`}
        value={value}
        expected={expected}
        placeholder={`#${num} →`}
        filled={value.trim().length > 0}
        invalid={incorrectKeys?.has(key) ?? false}
        onChange={(v) => onAnswerChange(key, v)}
        onVerify={onVerify}
        ariaLabel={`Espacio ${num} de ${fileName ?? "archivo"}`}
        ariaDescribedBy={
          incorrectKeys?.has(key) ? `hint-${key}-${lineIdx}` : undefined
        }
        hintId={`hint-${key}-${lineIdx}`}
      />
    );
  }

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4] md:text-xs">
      <code>
        {lines.map((line, lineIdx) => {
          const segs = line.split(SPLIT_RE);
          // Reconstrucción (inputs -> 'x') para clasificar la línea del árbol.
          const reconstructed = segs
            .map((s, i) => (i % 2 === 1 ? "x" : s))
            .join("");
          const kind = tree ? lineKind(reconstructed) : "none";
          const icon =
            kind === "folder" ? "📁" : kind === "file" ? "📄" : null;

          let iconPlaced = false;
          const lineNodes: ReactNode[] = [];

          segs.forEach((seg, i) => {
            if (i % 2 === 1) {
              lineNodes.push(renderInput(seg, lineIdx));
              return;
            }
            // Colocar el icono tras la indentación del primer segmento de texto.
            if (icon && !iconPlaced) {
              const mt = seg.match(/^(\s*)([\s\S]*)$/);
              const indent = mt?.[1] ?? "";
              const rest = mt?.[2] ?? seg;
              if (indent)
                lineNodes.push(
                  <Fragment key={`l${lineIdx}-ind`}>{indent}</Fragment>,
                );
              lineNodes.push(
                <span
                  key={`l${lineIdx}-icon`}
                  className="mr-1 select-none"
                  aria-hidden
                >
                  {icon}
                </span>,
              );
              iconPlaced = true;
              lineNodes.push(...tokenize(rest, lang, `l${lineIdx}-s${i}`));
            } else {
              lineNodes.push(...tokenize(seg, lang, `l${lineIdx}-s${i}`));
            }
          });

          return (
            <Fragment key={`line-${lineIdx}`}>
              {lineNodes}
              {lineIdx < lines.length - 1 ? "\n" : null}
            </Fragment>
          );
        })}
      </code>
    </pre>
  );
}
