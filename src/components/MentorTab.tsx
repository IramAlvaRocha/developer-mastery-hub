import { useState } from "react";
import type { Exercise } from "@/lib/types";
import { callGemini } from "@/lib/gemini";

interface Props {
  exercise: Exercise;
  moduleName: string;
  color: string;
  systemPrompt: string;
  onToast: (type: "success" | "error" | "info", message: string) => void;
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

  async function getExplanation() {
    if (isLoading) return;
    setIsLoading(true);
    setExplanation("");
    try {
      const prompt = `Explica con nivel de arquitecto senior este codigo/concepto:\nModulo: ${moduleName}\nEjercicio: ${exercise.title}\n\n${exercise.completeCode || exercise.codeSnippet}\n\nIncluye buenas practicas y conexion con .NET/C# o React si aplica.`;
      const text = await callGemini(prompt, systemPrompt);
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
          className={`rounded-r-[10px] border-l-2 bg-surface-2 py-2.5 pl-4 pr-3 text-xs leading-relaxed text-muted border-${color}-500`}
        >
          <p className="mb-1 font-semibold text-ink">💡 Mentoría</p>
          <p>{exercise.explanationText}</p>
        </div>

        <div className="space-y-3 rounded-[10px] border border-line bg-surface-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-brand">
              ✨ Mentoría Gemini IA
            </span>
            <button
              onClick={getExplanation}
              disabled={isLoading}
              className="btn-secondary"
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
          <div className="max-h-60 overflow-y-auto rounded-[10px] border border-line bg-[#0f0f10] p-3.5 font-mono text-[11px] text-[#d4d4d4]">
            <pre className="whitespace-pre-wrap">
              <code>{exercise.completeCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
