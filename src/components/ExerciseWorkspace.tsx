import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/answers";
import { moduleColorStyle } from "@/lib/moduleColors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import ChallengeCode from "./ChallengeCode";
import TheoryTab from "./TheoryTab";
import SolutionPanel from "./SolutionPanel";
import SimulatedTerminal from "./SimulatedTerminal";

type Tab = "theory" | "terminal" | "challenge" | "code";

interface Props {
  exercise: Exercise;
  moduleName: string;
  color: string;
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
    setActiveTab(
      exercise.theory ? "theory" : exercise.simulation ? "terminal" : "challenge",
    );
    setUserAnswers({});
    setIncorrectKeys(new Set());
    setSolved(alreadyCompleted);
  }, [exercise.id, exercise.theory, exercise.simulation, alreadyCompleted]);

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

  // Atajos de teclado: ← / → / n / p para navegar (cuando no se escribe en un input).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "ArrowRight" || e.key === "n") && !isLast) onNext();
      if ((e.key === "ArrowLeft" || e.key === "p") && !isFirst) onPrev();
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

      <div className="h-1 w-full shrink-0 bg-elevated" style={colorStyle}>
        <div
          className="mod-progress motion-safe-transition h-full !rounded-none"
          style={{ width: `${positionPercent}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="animate-fade-in mx-auto w-full max-w-3xl space-y-5 p-4 pb-28 md:p-6 md:pb-8">
          {/* Hero del ejercicio */}
          <section className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-5 sm:p-6">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(10,228,72,0.35), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-brand">
                {label}
                <span className="text-faint">·</span>
                <span className="text-muted">{exercise.category}</span>
              </span>
              <span className="text-xs tracking-tight text-butter">
                {"★".repeat(exercise.stars)}
                <span className="text-line">
                  {"★".repeat(Math.max(0, 5 - exercise.stars))}
                </span>
              </span>
            </div>
            <p className="relative section-eyebrow text-muted">
              {"{ Ejercicio }"}
            </p>
            <h2 className="relative mt-1 text-[clamp(1.35rem,3vw,1.85rem)] font-semibold tracking-tight text-cream">
              {exercise.title}
            </h2>
            <p className="relative mt-2 text-[15px] leading-relaxed text-muted">
              {exercise.description}
            </p>
            <div className="relative mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="pill-chip border border-peach/30 bg-peach/15 text-peach">
                {exercise.objective}
              </span>
              {exercise.tags.map((tag) => (
                <span
                  key={tag}
                  className="pill-chip border border-line bg-canvas/60 text-faint"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur">
            {exercise.theory && (
              <TabButton
                active={activeTab === "theory"}
                onClick={() => setActiveTab("theory")}
              >
                Teoría
              </TabButton>
            )}
            {exercise.simulation && (
              <TabButton
                active={activeTab === "terminal"}
                onClick={() => setActiveTab("terminal")}
              >
                Terminal
              </TabButton>
            )}
            <TabButton
              active={activeTab === "challenge"}
              onClick={() => setActiveTab("challenge")}
            >
              Desafío
              {!solved && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </TabButton>
            <TabButton
              active={activeTab === "code"}
              onClick={() => setActiveTab("code")}
            >
              Solución
            </TabButton>
          </div>

          <div className="min-h-[220px]">
            {activeTab === "challenge" && (
              <div className="space-y-4">
                <div
                  style={colorStyle}
                  className="rounded-[24px] border border-line border-l-[3px] mod-task-border bg-surface px-4 py-4 sm:px-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                    Tu tarea
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-cream/95">
                    {instruction}
                  </p>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
                  <div className="flex flex-col gap-2 border-b border-line bg-[#161816] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex gap-1" aria-hidden>
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                      </span>
                      <span
                        className="min-w-0 truncate font-mono text-[12px] text-muted"
                        title={exercise.fileName}
                      >
                        {exercise.fileName}
                      </span>
                    </div>
                    <span
                      className="shrink-0 self-start truncate rounded-full border border-line bg-canvas/50 px-3 py-1 text-[10px] font-semibold text-muted sm:max-w-[45%] sm:self-auto"
                      title={moduleName}
                    >
                      {moduleName}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto bg-[#0e100f] p-4 sm:p-5">
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
              <SolutionPanel exercise={exercise} color={color} />
            )}
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-line bg-[#121412]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-[13px] font-medium text-muted">
                <span className="text-cream">{index + 1}</span>
                <span className="text-faint"> / {total}</span>
              </span>
              {solved && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                  Completado
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="btn-secondary !min-h-10 !px-3 !text-sm sm:!px-4"
                aria-label="Ejercicio anterior"
              >
                ←<span className="hidden sm:inline"> Anterior</span>
              </button>
              {activeTab === "challenge" && (
                <>
                  <button onClick={resetChallenge} className="btn-ghost !text-sm">
                    Limpiar
                  </button>
                  <button
                    onClick={verify}
                    className="btn-filled-soft !min-h-10 !px-4 !text-sm"
                  >
                    Verificar
                  </button>
                </>
              )}
              <button
                onClick={onNext}
                disabled={isLast}
                className="btn-primary !min-h-10 !px-3 !text-sm sm:!px-4"
                aria-label="Siguiente ejercicio"
              >
                <span className="hidden sm:inline">Siguiente </span>→
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-center border-t border-line/40 pt-2">
            <KeyboardHints />
          </div>
        </div>
      </footer>
    </main>
  );
}

const CONFETTI_COLORS = [
  "#0ae448",
  "#abff84",
  "#ff8709",
  "#fec5fb",
  "#9d95ff",
  "#00bae2",
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
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-cream text-canvas"
          : "text-muted hover:bg-elevated hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

/** Atajos de teclado en fila propia del footer para no competir con botones. */
function KeyboardHints() {
  return (
    <p
      className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[10px] text-faint"
      aria-label="Atajos de teclado para navegar entre ejercicios"
    >
      <span className="sr-only">Atajos:</span>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
      <span className="text-line">o</span>
      <Kbd>p</Kbd>
      <Kbd>n</Kbd>
      <span>navegar</span>
    </p>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-full border border-line bg-canvas px-2 py-0.5 font-sans text-[10px] font-semibold text-muted">
      {children}
    </kbd>
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
