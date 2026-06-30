interface Props {
  theory: string;
}

export default function TheoryTab({ theory }: Props) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="ui-card p-5">
        <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink">
          📚 Fundamentos Teóricos
        </h4>
        <div className="max-h-[460px] space-y-3 overflow-y-auto rounded-[10px] border border-line bg-surface-2 p-4 text-[13px] leading-relaxed text-muted">
          <Markdown source={theory} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Mini-renderer Markdown (subconjunto autorado por nosotros, contenido confiable):
   - "## " / "### "  -> encabezados
   - bloques de tabla con "|"
   - listas "- " y "1. "
   - **negrita** e `inline code`
   - lineas en blanco como separadores de parrafo
   ────────────────────────────────────────────────────────────────────────── */
function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const isTableRow = (l: string) => l.trim().startsWith("|");
  const isSeparator = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes("-");

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Encabezados
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h6
          key={key++}
          className="pt-1 text-[11px] font-bold uppercase tracking-wider text-faint"
        >
          {trimmed.slice(4)}
        </h6>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h5
          key={key++}
          className="pt-1 text-[13px] font-bold text-ink"
        >
          {renderInline(trimmed.slice(3))}
        </h5>,
      );
      i++;
      continue;
    }

    // Tablas
    if (isTableRow(line)) {
      const rows: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(lines[i]);
        i++;
      }
      const parsed = rows
        .filter((r) => !isSeparator(r))
        .map((r) =>
          r
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim()),
        );
      if (parsed.length > 0) {
        const [head, ...body] = parsed;
        blocks.push(
          <div
            key={key++}
            className="overflow-x-auto rounded-[8px] border border-line"
          >
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-elevated">
                  {head.map((c, ci) => (
                    <th
                      key={ci}
                      className="border-b border-line px-3 py-1.5 font-semibold text-ink"
                    >
                      {renderInline(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="border-b border-line-soft last:border-0">
                    {row.map((c, ci) => (
                      <td key={ci} className="px-3 py-1.5 align-top text-muted">
                        {renderInline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    // Listas con viñetas
    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="space-y-1 pl-1">
          {items.map((it, ii) => (
            <li key={ii} className="flex gap-2">
              <span className="mt-[2px] shrink-0 text-brand">▸</span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Listas numeradas
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="space-y-1 pl-1">
          {items.map((it, ii) => (
            <li key={ii} className="flex gap-2">
              <span className="mt-[1px] shrink-0 font-mono text-[11px] font-bold text-brand">
                {ii + 1}.
              </span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Párrafo
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {renderInline(trimmed)}
      </p>,
    );
    i++;
  }

  return <>{blocks}</>;
}

/** Procesa **negrita** e `inline code` dentro de una línea. */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[11.5px] text-brand"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
