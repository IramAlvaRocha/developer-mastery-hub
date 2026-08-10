import type { Exercise } from "@/lib/types";
import { moduleColorStyle } from "@/lib/moduleColors";

interface Props {
  exercise: Exercise;
  color: string;
}

/** Divide completeCode en viñetas (por línea o por separador |). */
function splitCompleteCode(text: string): string[] {
  return text
    .split(/\n/)
    .flatMap((line) => line.split(/\s*\|\s*/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Separa el ejemplo cotidiano del tip técnico en explanationText enriquecido. */
function splitExplanation(text: string): {
  everyday?: string;
  technical: string;
} {
  const match = text.match(
    /^🌍 Ejemplo cotidiano:\s*([\s\S]*?)\n\n([\s\S]*)$/,
  );
  if (match) {
    return { everyday: match[1].trim(), technical: match[2].trim() };
  }
  return { technical: text };
}

export default function SolutionPanel({ exercise, color }: Props) {
  const referenceItems = splitCompleteCode(exercise.completeCode);
  const colorStyle = moduleColorStyle(color);
  const { everyday, technical } = splitExplanation(exercise.explanationText);

  return (
    <div className="space-y-5 sm:space-y-6" style={colorStyle}>
      <header className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full mod-glow blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <span className="mod-icon-bg mod-text flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] text-xl font-bold" aria-hidden="true">
            ✓
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] mod-text">
              Solución explicada
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
              {exercise.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {exercise.objective}
            </p>
          </div>
        </div>
      </header>

      <div className={`grid gap-4 ${everyday ? "lg:grid-cols-2" : ""}`}>
        {everyday && (
          <section className="rounded-[24px] border border-sage/25 bg-sage/10 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-base" aria-hidden="true">
                🌍
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-sage">
                  Llévalo a la vida real
                </p>
                <h3 className="mt-0.5 text-sm font-semibold text-cream">
                  Ejemplo cotidiano
                </h3>
              </div>
            </div>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-cream/85">
              {everyday}
            </p>
        </section>
        )}

        <section className="rounded-[24px] border border-line bg-surface-2/70 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="mod-icon-bg mod-text flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold" aria-hidden="true">
              {"</>"}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mod-text">
                Mental model
              </p>
              <h3 className="mt-0.5 text-sm font-semibold text-cream">
                Explicación técnica
              </h3>
            </div>
          </div>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-muted">
            {technical}
          </p>
        </section>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-line bg-canvas">
        <div className="flex items-center justify-between gap-4 border-b border-line-soft bg-surface-2 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-peach" />
            <span className="h-2.5 w-2.5 rounded-full bg-butter" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            Solución de referencia
          </span>
        </div>
        <div className="overflow-x-auto p-4 sm:p-5">
          <ol className="space-y-1 font-mono text-[12px] text-cream/90 sm:text-[13px]">
            {referenceItems.map((item, i) => (
              <li key={i} className="group flex gap-4 rounded-lg px-2 py-1.5 leading-relaxed hover:bg-cream/[0.03]">
                <span
                  className="w-5 shrink-0 select-none text-right text-faint"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <code className="min-w-0 flex-1 break-words whitespace-pre-wrap">
                  {item}
                </code>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <aside className="flex gap-3 rounded-[20px] border border-butter/20 bg-butter/10 px-4 py-3.5">
        <span className="text-lg" aria-hidden="true">💡</span>
        <p className="text-[13px] leading-relaxed text-cream/80">
          <span className="font-semibold text-butter">Úsala para comparar: </span>
          vuelve al desafío, identifica una diferencia y ajusta un elemento a la vez.
        </p>
      </aside>
    </div>
  );
}
