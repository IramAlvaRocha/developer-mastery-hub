import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/answers";
import { moduleColorStyle } from "@/lib/moduleColors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import ChallengeCode from "./ChallengeCode";
import TheoryTab from "./TheoryTab";
import MentorTab from "./MentorTab";
import SimulatedTerminal from "./SimulatedTerminal";

type Tab = "theory" | "terminal" | "challenge" | "code";

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
  const [activeTab, setActiveTab] = useState<Tab>(
    exercise.theory ? "theory" : exercise.simulation ? "terminal" : "challenge",
  );
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [incorrectKeys, setIncorrectKeys] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(alreadyCompleted);
  const [celebrate, setCelebrate] = useState(false);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 1500);
    return () => clearTimeout(t);
  }, [celebrate]);

  function handleAnswerChange(key: string, value: string) {
    setUserAnswers((prev) => ({ ...prev, [key]: value }));
    // Al editar, limpia la marca de error de ese hueco.
    setIncorrectKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  function resetChallenge() {
    setUserAnswers({});
    setIncorrectKeys(new Set());
  }

  function verify() {
    const answers = exercise.inputs || {};
    const wrong = new Set<string>();
    let missing = false;

    for (const key of Object.keys(answers)) {
      const userVal = (userAnswers[key] ?? "").trim();
      if (!userVal) {
        missing = true;
        continue;
      }
      if (!isAnswerCorrect(answers[key], userVal)) wrong.add(key);
    }

    if (missing) {
      onToast("info", "Completa todos los campos antes de verificar.");
      return;
    }
    if (wrong.size === 0) {
      const isNew = !solved;
      setIncorrectKeys(new Set());
      setSolved(true);
      onComplete(exercise.id);
      onToast("success", `¡Correcto! "${exercise.title}" completado.`);
      if (isNew) setCelebrate(true);
      setActiveTab("code");
    } else {
      setIncorrectKeys(wrong);
      const n = wrong.size;
      onToast(
        "error",
        `Revisa ${n} ${n === 1 ? "campo marcado" : "campos marcados"} en rojo.`,
      );
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

  const instruction = buildInstruction(exercise);

  const positionPercent = total > 0 ? ((index + 1) / total) * 100 : 0;
  const colorStyle = moduleColorStyle(color);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-canvas">
      {celebrate && <Celebration color={color} reduceMotion={reduceMotion} />}
      {/* Progreso de posición dentro del módulo */}
      <div className="h-0.5 w-full shrink-0 bg-surface-2" style={colorStyle}>
        <div
          className="mod-progress motion-safe-transition h-full"
          style={{ width: `${positionPercent}%`, borderRadius: 0 }}
        ></div>
      </div>
      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        <div className="animate-fade-in mx-auto w-full max-w-3xl space-y-5 p-4 pb-28 md:p-6 md:pb-6">
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

          {/* Tabs: teoría primero, luego desafío */}
          <div className="flex gap-1 overflow-x-auto border-b border-line">
            {exercise.theory && (
              <TabButton
                active={activeTab === "theory"}
                onClick={() => setActiveTab("theory")}
              >
                📚 Teoría
              </TabButton>
            )}
            {exercise.simulation && (
              <TabButton
                active={activeTab === "terminal"}
                onClick={() => setActiveTab("terminal")}
              >
                🖥️ Terminal
              </TabButton>
            )}
            <TabButton
              active={activeTab === "challenge"}
              onClick={() => setActiveTab("challenge")}
            >
              📝 Desafío
              {!solved && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand"></span>
              )}
            </TabButton>
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
                <div
                  style={colorStyle}
                  className="ui-card mod-task-border flex items-start gap-3 border-l-2 p-4"
                >
                  <span className="mt-0.5 shrink-0 text-base">🎯</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-faint">
                      Tu tarea
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink">
                      {instruction}
                    </p>
                  </div>
                </div>
                <div className="ui-card overflow-hidden">
                  <div className="flex flex-col gap-1.5 border-b border-line bg-surface-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span
                      className="min-w-0 truncate font-mono text-[11px] text-muted"
                      title={exercise.fileName}
                    >
                      📄 {exercise.fileName}
                    </span>
                    <span
                      className="shrink-0 self-start truncate rounded-full bg-elevated px-2.5 py-0.5 text-[10px] font-semibold text-muted sm:max-w-[45%] sm:self-auto"
                      title={moduleName}
                    >
                      {moduleName}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto bg-[#0f0f10] p-4">
                    <ChallengeCode
                      codeSnippet={exercise.codeSnippet}
                      inputs={exercise.inputs}
                      userAnswers={userAnswers}
                      incorrectKeys={incorrectKeys}
                      fileName={exercise.fileName}
                      onAnswerChange={handleAnswerChange}
                      onVerify={verify}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "theory" && exercise.theory && (
              <TheoryTab theory={exercise.theory} />
            )}

            {activeTab === "terminal" && exercise.simulation && (
              <SimulatedTerminal
                scenario={exercise.simulation}
                resetKey={`${exercise.id}-${exercise.category}`}
              />
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
            <span className="hidden items-center gap-1 text-[11px] text-faint lg:flex">
              <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted">
                ←
              </kbd>
              <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted">
                →
              </kbd>
              navegar
            </span>
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

const CONFETTI_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#22d3ee",
];

/** Overlay efímero de celebración: check con rebote + lluvia de confeti. */
function Celebration({
  color,
  reduceMotion,
}: {
  color: string;
  reduceMotion: boolean;
}) {
  const colorStyle = moduleColorStyle(color);
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        dx: `${Math.round((Math.random() - 0.5) * 320)}px`,
        dy: `${Math.round(80 + Math.random() * 160)}px`,
        rot: `${Math.round((Math.random() - 0.5) * 720)}deg`,
        delay: `${Math.round(Math.random() * 120)}ms`,
        left: `${Math.round(Math.random() * 100)}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );

  if (reduceMotion) {
    return (
      <div
        style={colorStyle}
        className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
      >
        <div className="mod-celebrate flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-glow">
          ✓
        </div>
      </div>
    );
  }

  return (
    <div
      style={colorStyle}
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Confeti */}
      <div className="absolute inset-x-0 top-1/3 mx-auto h-0 w-full max-w-md">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={
              {
                left: p.left,
                backgroundColor: p.color,
                "--dx": p.dx,
                "--dy": p.dy,
                "--rot": p.rot,
                "--delay": p.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {/* Check con rebote */}
      <div className="mod-celebrate animate-pop flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-glow">
        ✓
      </div>
    </div>
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

/** Indicación concreta de la tarea, específica por ejercicio. */
function buildInstruction(exercise: Exercise): string {
  if (exercise.instruction) return exercise.instruction;

  const count = Object.keys(exercise.inputs).length;
  const file = exercise.fileName.toLowerCase();
  const isTree =
    /\.(sln|txt)$/.test(file) ||
    file.includes("estructura") ||
    /ARQUITECTURA|ESTRUCTURA/i.test(exercise.category);

  if (isTree) {
    return `Completa el nombre de cada carpeta según las responsabilidades y archivos que le corresponden (${count} por resolver).`;
  }

  // Pasa el objetivo a minúscula inicial para encadenarlo de forma natural.
  const obj = exercise.objective.trim();
  const goal = obj ? obj.charAt(0).toLowerCase() + obj.slice(1) : "";
  const espacios = count === 1 ? "el espacio resaltado" : `los ${count} espacios resaltados`;

  return goal
    ? `Completa ${espacios} para ${goal}.`
    : `Completa ${espacios} y pulsa Verificar.`;
}
