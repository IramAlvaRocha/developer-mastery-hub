import { useEffect, useState } from "react";
import type { Exercise } from "@/lib/types";
import ChallengeCode from "./ChallengeCode";
import TheoryTab from "./TheoryTab";
import MentorTab from "./MentorTab";

type Tab = "challenge" | "theory" | "code";

interface Props {
  exercise: Exercise;
  moduleName: string;
  color: string;
  systemPrompt: string;
  alreadyCompleted: boolean;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: (id: number) => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function ExerciseWorkspace({
  exercise,
  moduleName,
  color,
  systemPrompt,
  alreadyCompleted,
  index,
  total,
  onPrev,
  onNext,
  onComplete,
  onToast,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("challenge");
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState(alreadyCompleted);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  function handleAnswerChange(key: string, value: string) {
    setUserAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function resetChallenge() {
    setUserAnswers({});
  }

  function verify() {
    const answers = exercise.inputs || {};
    let correct = true;
    let missing = false;

    for (const key of Object.keys(answers)) {
      const expected = String(answers[key]).toLowerCase().trim();
      const userVal = String(userAnswers[key] ?? "")
        .toLowerCase()
        .trim();
      if (!userVal) missing = true;
      if (userVal !== expected) correct = false;
    }

    if (missing) {
      onToast("info", "Completa todos los campos antes de verificar.");
      return;
    }
    if (correct) {
      setSolved(true);
      onComplete(exercise.id);
      onToast("success", `¡Correcto! "${exercise.title}" completado.`);
      setActiveTab("code");
    } else {
      onToast("error", "Incorrecto. Revisa la sintaxis y los metodos.");
    }
  }

  // Atajos de teclado: ← / → para navegar (cuando no se escribe en un input).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" && !isLast) onNext();
      if (e.key === "ArrowLeft" && !isFirst) onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFirst, isLast, onNext, onPrev]);

  const label =
    exercise.step != null ? `Paso ${exercise.step}` : `Nivel ${exercise.stars}`;

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-base">
      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        <div className="animate-fade-in mx-auto w-full max-w-3xl space-y-5 p-4 md:p-6">
          {/* Tarjeta del ejercicio */}
          <section className="ui-card p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
                {label}
                <span className="text-faint">•</span>
                <span className="text-muted">{exercise.category}</span>
              </span>
              <span className="text-xs tracking-tight text-amber-400">
                {"★".repeat(exercise.stars)}
                <span className="text-line">
                  {"★".repeat(Math.max(0, 5 - exercise.stars))}
                </span>
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink">
              {exercise.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {exercise.description}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-line bg-surface-2 px-3 py-1 font-medium text-muted">
                🎯 {exercise.objective}
              </span>
              {exercise.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1 text-faint"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-line">
            <TabButton
              active={activeTab === "challenge"}
              onClick={() => setActiveTab("challenge")}
            >
              📝 Desafío
              {!solved && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand"></span>
              )}
            </TabButton>
            {exercise.theory && (
              <TabButton
                active={activeTab === "theory"}
                onClick={() => setActiveTab("theory")}
              >
                📚 Teoría
              </TabButton>
            )}
            <TabButton
              active={activeTab === "code"}
              onClick={() => setActiveTab("code")}
            >
              📖 Mentoría & Solución
            </TabButton>
          </div>

          {/* Contenido */}
          <div className="min-h-[220px]">
            {activeTab === "challenge" && (
              <div className="space-y-4">
                <div className="ui-card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2">
                    <span className="font-mono text-[11px] text-muted">
                      📄 {exercise.fileName}
                    </span>
                    <span className="rounded-full bg-elevated px-2.5 py-0.5 text-[10px] font-semibold text-muted">
                      {moduleName}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto bg-[#0f0f10] p-4">
                    <ChallengeCode
                      codeSnippet={exercise.codeSnippet}
                      inputs={exercise.inputs}
                      userAnswers={userAnswers}
                      onAnswerChange={handleAnswerChange}
                      onVerify={verify}
                    />
                  </div>
                </div>
                <div className="ui-card flex items-center gap-3 p-4">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full bg-${color}-500`}
                  ></span>
                  <p className="text-[13px] text-muted">
                    Rellena los espacios resaltados y pulsa{" "}
                    <span className="font-semibold text-ink">Verificar</span>{" "}
                    para registrar tu avance.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "theory" && exercise.theory && (
              <TheoryTab theory={exercise.theory} />
            )}

            {activeTab === "code" && (
              <MentorTab
                exercise={exercise}
                moduleName={moduleName}
                color={color}
                systemPrompt={systemPrompt}
                onToast={onToast}
              />
            )}
          </div>
        </div>
      </div>

      {/* Barra de navegación inferior */}
      <footer className="shrink-0 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="text-[13px] font-medium text-muted">
              Ejercicio{" "}
              <span className="font-bold text-ink">{index + 1}</span> / {total}
            </span>
            {solved && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                ✓ Completado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className="btn-secondary"
              aria-label="Ejercicio anterior"
            >
              ←<span className="hidden sm:inline">Anterior</span>
            </button>
            {activeTab === "challenge" && (
              <>
                <button onClick={resetChallenge} className="btn-ghost">
                  Limpiar
                </button>
                <button onClick={verify} className="btn-primary">
                  Verificar
                </button>
              </>
            )}
            <button
              onClick={onNext}
              disabled={isLast}
              className="btn-primary"
              aria-label="Siguiente ejercicio"
            >
              <span className="hidden sm:inline">Siguiente</span> →
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
        active
          ? "border-brand text-ink"
          : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
