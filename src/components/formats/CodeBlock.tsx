import { Fragment, type ReactNode } from "react";
import { detectLang, tokenize } from "@/lib/codeHighlight";

interface Props {
  code: string;
  fileName?: string;
  className?: string;
}

/** Bloque de código con el resaltado ligero del resto de la app. */
export default function CodeBlock({ code, fileName, className }: Props) {
  const lang = detectLang(fileName);
  const lines = code.split("\n");
  const nodes: ReactNode[] = [];

  lines.forEach((line, i) => {
    nodes.push(
      <Fragment key={`l${i}`}>
        {tokenize(line, lang, `cb-${i}`)}
        {i < lines.length - 1 ? "\n" : null}
      </Fragment>,
    );
  });

  return (
    <pre
      className={`whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4] md:text-xs ${
        className ?? ""
      }`}
    >
      <code>{nodes}</code>
    </pre>
  );
}
