import { useState } from "react";
import type { Exercise } from "@/lib/types";
import { callAi } from "@/lib/gemini";
import { moduleColorStyle } from "@/lib/moduleColors";

interface Props {
  exercise: Exercise;
  moduleName: string;
  color: string;
  systemPrompt: string;
  onToast: (type: "success" | "error" | "info", message: string) => void;
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

export default function MentorTab({
  exercise,
  moduleName,
  color,
  systemPrompt,
  onToast,
}: Props) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const referenceItems = splitCompleteCode(exercise.completeCode);
  const colorStyle = moduleColorStyle(color);
  const { everyday, technical } = splitExplanation(exercise.explanationText);

  async function getExplanation() {
    if (isLoading) return;
    setIsLoading(true);
    setExplanation("");
    try {
      const prompt = `Explica con nivel de arquitecto senior este codigo/concepto:\nModulo: ${moduleName}\nEjercicio: ${exercise.title}\n\n${exercise.completeCode || exercise.codeSnippet}\n\nIncluye buenas practicas y conexion con .NET/C# o React si aplica.`;
      const text = await callAi(prompt, systemPrompt);
      setExplanation(text);
      onToast("success", "✨ Analisis generado.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reintenta.";
      onToast("error", message);
      setExplanation(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="ui-card space-y-4 p-5">
        <h4 className="text-[13px] font-bold text-ink">Análisis Técnico</h4>
        <div
          style={colorStyle}
          className="mod-task-border space-y-3 rounded-r-input border-l-2 bg-surface-2 py-2.5 pl-4 pr-3 text-xs leading-relaxed text-muted"
        >
          {everyday && (
            <div className="rounded-[10px] border border-lime-500/20 bg-lime-500/5 p-3">
              <p className="mb-1 font-semibold text-lime-300">
                🌍 Ejemplo cotidiano
              </p>
              <p className="whitespace-pre-line text-muted">{everyday}</p>
            </div>
          )}
          <div>
            <p className="mb-1 font-semibold text-ink">💡 Mentoría técnica</p>
            <p className="whitespace-pre-line">{technical}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-[10px] border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold text-brand">
              ✨ Mentoría IA
            </span>
            <button
              onClick={getExplanation}
              disabled={isLoading}
              className="btn-secondary shrink-0"
            >
              {isLoading ? "Procesando…" : "✨ Analizar"}
            </button>
          </div>
          {explanation ? (
            <div className="whitespace-pre-line rounded-[10px] border border-line bg-surface p-3.5 text-xs leading-relaxed text-muted">
              {explanation}
            </div>
          ) : isLoading ? (
            <div className="space-y-2 py-2">
              <div className="shimmer-loading h-2.5 w-3/4 rounded"></div>
              <div className="shimmer-loading h-2.5 w-full rounded"></div>
            </div>
          ) : (
            <div className="text-[11px] italic text-faint">
              Presiona para recibir un análisis técnico detallado.
            </div>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-semibold text-muted">
            Código de referencia
          </p>
          <div className="max-h-60 overflow-y-auto rounded-input border border-line bg-[#0f0f10] p-3.5 font-mono text-[11px] text-[#d4d4d4]">
            <ul className="space-y-2.5" style={colorStyle}>
              {referenceItems.map((item, i) => (
                <li key={i} className="flex gap-2.5 leading-relaxed">
                  <span className="mod-text mt-0.5 shrink-0 font-bold" aria-hidden>
                    •
                  </span>
                  <code className="min-w-0 flex-1 break-words whitespace-pre-wrap">
                    {item}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
