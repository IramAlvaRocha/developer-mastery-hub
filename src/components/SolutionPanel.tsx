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
    <div className="space-y-6 sm:space-y-7">
      <header>
        <p className="section-eyebrow text-cream">{"{ Solución }"}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
          {exercise.title}
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">{exercise.objective}</p>
      </header>

      {everyday && (
        <section className="max-w-prose rounded-[24px] border-l-[3px] border-sage bg-sage/10 px-5 py-4">
          <p className="mb-2 text-sm font-semibold text-sage">
            🌍 Ejemplo cotidiano
          </p>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-cream/90">
            {everyday}
          </p>
        </section>
      )}

      <section
        style={colorStyle}
        className="mod-task-border max-w-prose border-l-[3px] pl-5"
      >
        <h3 className="text-sm font-semibold text-cream">Explicación técnica</h3>
        <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-muted">
          {technical}
        </p>
      </section>

      <section>
        <p className="mb-2.5 max-w-prose text-sm font-semibold text-cream">
          Solución de referencia
        </p>
        <div className="max-h-72 overflow-y-auto rounded-[24px] border border-line bg-canvas p-4 font-mono text-[12px] text-cream/90 sm:p-5 sm:text-[13px]">
          <ul className="space-y-3" style={colorStyle}>
            {referenceItems.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span
                  className="mod-text mt-0.5 shrink-0 font-bold"
                  aria-hidden
                >
                  •
                </span>
                <code className="min-w-0 flex-1 break-words whitespace-pre-wrap">
                  {item}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="max-w-prose text-[13px] leading-relaxed text-muted">
        <span className="font-semibold text-peach">Tip: </span>
        Usa esta solución para contrastar tu respuesta, no para copiarla de
        entrada. Si algo no cuadra, vuelve al desafío y ajusta un campo a la
        vez.
      </p>
    </div>
  );
}
