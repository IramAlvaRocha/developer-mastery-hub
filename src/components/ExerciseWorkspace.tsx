import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { Exercise, ExerciseFormat } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/answers";
import { evaluateFormat } from "@/lib/formatVerification";
import { moduleColorStyle } from "@/lib/moduleColors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { FORMAT_LABELS, type FormatOption } from "@/lib/formatMeta";
import ChallengeCode from "./ChallengeCode";
import ExerciseFormat from "./formats/ExerciseFormat";
import TheoryTab from "./TheoryTab";
import SolutionPanel from "./SolutionPanel";
import SimulatedTerminal from "./SimulatedTerminal";

type Tab = "theory" | "terminal" | "challenge" | "code";

interface TabDef {
  id: Tab;
  label: string;
}

interface Props {
  exercise: Exercise;
  moduleName: string;
  color: string;
  alreadyCompleted: boolean;
  index: number;
  total: number;
  formats: FormatOption[];
  formatFilter: ExerciseFormat | null;
  onFormatFilterChange: (f: ExerciseFormat | null) => void;
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
  formats,
  formatFilter,
  onFormatFilterChange,
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
    const t = setTimeout(() => setCelebrate(false), 1600);
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
    // Formatos interactivos: la evaluación es específica de cada formato.
    if (exercise.format) {
      const result = evaluateFormat(exercise, userAnswers);
      if (!result.complete) {
        onToast("info", "Completa todas las partes antes de verificar.");
        return;
      }
      if (result.correct) {
        const isNew = !solved;
        setIncorrectKeys(new Set());
        setSolved(true);
        onComplete(exercise.id);
        onToast("success", `¡Correcto! "${exercise.title}" completado.`);
        if (isNew) setCelebrate(true);
        setActiveTab("code");
      } else {
        setIncorrectKeys(new Set(result.incorrectKeys));
        const n = result.incorrectKeys.length;
        onToast(
          "error",
          `Revisa ${n} ${n === 1 ? "elemento marcado" : "elementos marcados"} en rojo.`,
        );
      }
      return;
    }

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

  // Atajos de teclado: ← / → / n / p para navegar (salvo al escribir o en las tabs).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (target?.closest?.("[role='tablist']")) return;
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

  // ── Tabs visibles ─────────────────────────────────────────────────────────
  const tabs = useMemo<TabDef[]>(() => {
    const list: TabDef[] = [];
    if (exercise.theory) list.push({ id: "theory", label: "Teoría" });
    if (exercise.simulation)
      list.push({ id: "terminal", label: "Terminal" });
    list.push({ id: "challenge", label: "Desafío" });
    list.push({ id: "code", label: "Solución" });
    return list;
  }, [exercise.theory, exercise.simulation]);

  // ── Refs para indicador y animaciones ─────────────────────────────────────
  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLSpanElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastTabRef = useRef<Tab>(activeTab);

  // Barra de progreso: GSAP al ancho según posición.
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const width = `${positionPercent}%`;
    if (reduceMotion) {
      el.style.transition = "none";
      el.style.width = width;
      return;
    }
    el.style.transition = "none";
    gsap.to(el, {
      width,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        el.style.transition = "";
      },
    });
  }, [exercise.id, positionPercent, reduceMotion]);

  // Entrada del hero (label → título → descripción → meta → tabs).
  useEffect(() => {
    if (reduceMotion) return;
    const root = heroRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-chip]", {
        opacity: 0,
        y: 12,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.from("[data-hero-label]", {
        opacity: 0,
        y: 14,
        duration: 0.4,
        delay: 0.05,
        ease: "power2.out",
      });
      gsap.from("[data-hero-title]", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        delay: 0.12,
        ease: "power2.out",
      });
      gsap.from("[data-hero-desc]", {
        opacity: 0,
        y: 14,
        duration: 0.45,
        delay: 0.18,
        ease: "power2.out",
      });
      gsap.from("[data-hero-meta]", {
        opacity: 0,
        y: 12,
        duration: 0.4,
        delay: 0.24,
        ease: "power2.out",
      });
    }, root);
    return () => ctx.revert();
  }, [reduceMotion, exercise.id]);

  // Indicador del TabSlider: set al montar, tween al cambiar.
  useLayoutEffect(() => {
    const list = tabListRef.current;
    const indicator = tabIndicatorRef.current;
    const idx = tabs.findIndex((t) => t.id === activeTab);
    const btn = tabButtonRefs.current[idx];
    if (!list || !indicator || !btn) return;
    const target = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (reduceMotion || lastTabRef.current === activeTab) {
      gsap.set(indicator, target);
    } else {
      gsap.to(indicator, {
        ...target,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    lastTabRef.current = activeTab;
  }, [activeTab, exercise.id, reduceMotion, tabs]);

  // Transición de panel al cambiar de tab.
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el || reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-panel]:not(.hidden)", {
        opacity: 0,
        y: 14,
        duration: 0.35,
        ease: "power2.out",
      });
    }, el);
    return () => ctx.revert();
  }, [activeTab, reduceMotion]);

  // El panel es un único scroll compartido entre tabs: al cambiar, vuelve arriba.
  useLayoutEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  function onTabListKeyDown(e: React.KeyboardEvent) {
    const last = tabs.length - 1;
    const idx = tabs.findIndex((t) => t.id === activeTab);
    let nextIdx: number | null = null;

    if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = last;
    else return;

    e.preventDefault();
    if (nextIdx == null || nextIdx < 0 || nextIdx > last) return;
    const nextTab = tabs[nextIdx];
    if (!nextTab) return;
    setActiveTab(nextTab.id);
    tabButtonRefs.current[nextIdx]?.focus();
  }

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-canvas">
      {celebrate && <Celebration color={color} reduceMotion={reduceMotion} />}

      <div className="h-1.5 w-full shrink-0 overflow-hidden rounded-full bg-elevated" style={colorStyle}>
        <div
          ref={progressRef}
          className="mod-progress h-full rounded-full"
          style={{ width: `${positionPercent}%` }}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6">
        {/* Anuncio de navegación para lectores de pantalla */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          key={`${index}-${exercise.id}`}
        >
          Ejercicio {index + 1} de {total}: {exercise.title}
        </p>
        {/* Card unificada: hero + tabs + panel con scroll único */}
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
          {/* Hero integrado como cabecera de la card */}
          <section
            ref={heroRef}
            style={colorStyle}
            className="relative shrink-0 overflow-hidden p-5 sm:p-6"
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--module-rgb) / 0.35), transparent 70%)",
              }}
              aria-hidden
            />
            <div
              data-hero-chip
              className="relative mb-3 flex flex-wrap items-center justify-between gap-2"
            >
              <span className="mod-badge inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-wide">
                {label}
                <span className="text-faint">·</span>
                <span className="text-muted">{exercise.category}</span>
              </span>
              <span className="pill-chip border border-butter/25 bg-butter/10 text-butter">
                {"★".repeat(exercise.stars)}
                <span className="text-line">
                  {"★".repeat(Math.max(0, 5 - exercise.stars))}
                </span>
              </span>
            </div>
            <p data-hero-label className="relative section-eyebrow text-cream">
              {"{ Ejercicio }"}
            </p>
            <h1
              data-hero-title
              className="relative mt-1 text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-[1.1] tracking-tight text-cream"
            >
              {exercise.title}
            </h1>
            <p
              data-hero-desc
              className="relative mt-2 max-w-2xl text-[15px] leading-relaxed text-muted"
            >
              {exercise.description}
            </p>
            <div data-hero-meta className="relative mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="pill-chip border border-peach/30 bg-peach/15 text-peach">
                {exercise.objective}
              </span>
              {exercise.tags.map((tag) => (
                <span
                  key={tag}
                  className="pill-chip border border-line bg-canvas/60 text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          {/* TabSlider + filtro de formato */}
          <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3 sm:px-5">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Contenido del ejercicio"
              onKeyDown={onTabListKeyDown}
              className="relative inline-flex w-full rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur sm:w-auto"
            >
              <span
                ref={tabIndicatorRef}
                aria-hidden
                className="pointer-events-none absolute inset-y-1.5 left-0 rounded-full bg-cream shadow-float"
              />
              {tabs.map((tab, i) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={active}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-10 flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors sm:flex-initial ${
                      active
                        ? "text-canvas"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "challenge" && !solved && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
              <FormatFilterSelect
                formats={formats}
                value={formatFilter}
                onChange={onFormatFilterChange}
              />
              {formatFilter && (
                <button
                  type="button"
                  onClick={() => onFormatFilterChange(null)}
                  className="pill-chip border border-brand/40 bg-brand/15 text-brand transition-colors hover:border-brand/60"
                  aria-label="Quitar filtro de tipo de ejercicio"
                >
                  <span>{formatChipLabel(formatFilter)}</span>
                  <span aria-hidden>×</span>
                </button>
              )}
            </div>
          </div>

          {/* Panel con el scroll único del workspace */}
          <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto border-t border-line">
            <div
              data-panel
              role="tabpanel"
              id="panel-challenge"
              aria-labelledby="tab-challenge"
              tabIndex={activeTab === "challenge" ? 0 : -1}
              className={activeTab === "challenge" ? "flex min-h-full flex-col" : "hidden"}
            >
              <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                <div
                  style={colorStyle}
                  className="rounded-[24px] border border-line border-l-[3px] mod-task-border bg-surface-2/50 px-4 py-3.5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    Tu tarea
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-cream/95">
                    {instruction}
                  </p>
                </div>
              </div>

              <div
                style={colorStyle}
                className="mt-4 flex flex-1 flex-col bg-canvas sm:mt-5"
              >
                <div className="flex flex-col gap-2 border-t border-line bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex gap-1" aria-hidden>
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                    </span>
                    <span
                      className="min-w-0 truncate font-mono text-[12px] text-muted"
                      title={exercise.fileName}
                    >
                      {exercise.fileName}
                    </span>
                  </div>
                  <span
                    className="mod-badge shrink-0 self-start truncate rounded-full border px-3 py-1 text-[10px] font-semibold sm:max-w-[45%] sm:self-auto"
                    title={moduleName}
                  >
                    {moduleName}
                  </span>
                </div>
                <div style={colorStyle} className="flex-1 p-4 sm:p-5">
                  {exercise.format ? (
                    <ExerciseFormat
                      exercise={exercise}
                      color={color}
                      userAnswers={userAnswers}
                      incorrectKeys={incorrectKeys}
                      solved={solved}
                      onAnswerChange={handleAnswerChange}
                      onVerify={verify}
                    />
                  ) : (
                    <ChallengeCode
                      codeSnippet={exercise.codeSnippet}
                      inputs={exercise.inputs}
                      userAnswers={userAnswers}
                      incorrectKeys={incorrectKeys}
                      fileName={exercise.fileName}
                      onAnswerChange={handleAnswerChange}
                      onVerify={verify}
                    />
                  )}
                </div>
              </div>
            </div>

            {exercise.theory && (
              <div
                data-panel
                role="tabpanel"
                id="panel-theory"
                aria-labelledby="tab-theory"
                tabIndex={activeTab === "theory" ? 0 : -1}
                className={activeTab === "theory" ? "outline-none" : "hidden"}
              >
                <div className="p-4 sm:p-5">
                  <TheoryTab theory={exercise.theory} />
                </div>
              </div>
            )}

            {exercise.simulation && (
              <div
                data-panel
                role="tabpanel"
                id="panel-terminal"
                aria-labelledby="tab-terminal"
                tabIndex={activeTab === "terminal" ? 0 : -1}
                className={activeTab === "terminal" ? "outline-none" : "hidden"}
              >
                <div className="p-4 sm:p-5">
                  <SimulatedTerminal
                    scenario={exercise.simulation}
                    resetKey={`${exercise.id}-${exercise.category}`}
                  />
                </div>
              </div>
            )}

            <div
              data-panel
              role="tabpanel"
              id="panel-code"
              aria-labelledby="tab-code"
              tabIndex={activeTab === "code" ? 0 : -1}
              className={activeTab === "code" ? "outline-none" : "hidden"}
            >
              <div className="p-4 sm:p-5">
                <SolutionPanel exercise={exercise} color={color} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-5xl px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="btn-secondary !min-h-11 !px-3 !text-sm sm:!px-5"
                aria-label="Ejercicio anterior"
              >
                ←<span className="hidden sm:inline"> Anterior</span>
              </button>
              <span className="shrink-0 text-[13px] font-medium text-muted">
                <span className="text-cream">{index + 1}</span>
                <span className="text-faint"> / {total}</span>
              </span>
              {solved && (
                <span className="hidden shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand sm:inline-flex">
                  Completado
                </span>
              )}
            </div>

            <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-none">
              {activeTab === "challenge" && (
                <>
                  <button
                    onClick={resetChallenge}
                    className="btn-ghost hidden !text-sm sm:inline-flex"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={verify}
                    className="btn-filled-soft !min-h-11 !px-5 !text-sm max-sm:flex-1 sm:!px-6"
                  >
                    Verificar
                  </button>
                </>
              )}
              <button
                onClick={onNext}
                disabled={isLast}
                className="btn-primary !min-h-11 !px-3 !text-sm sm:!px-5"
                aria-label="Siguiente ejercicio"
              >
                <span className="hidden sm:inline">Siguiente </span>→
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <KeyboardHints />
          </div>
        </div>
      </footer>
    </main>
  );
}

/** Píldora de selección de formato (select nativo estilizado, accesible). */
function FormatFilterSelect({
  formats,
  value,
  onChange,
}: {
  formats: FormatOption[];
  value: ExerciseFormat | null;
  onChange: (f: ExerciseFormat | null) => void;
}) {
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : (v as ExerciseFormat));
        }}
        aria-label="Filtrar por tipo de ejercicio"
        className="appearance-none rounded-full border border-line bg-surface-2 py-2 pl-3.5 pr-8 text-[12px] font-semibold text-muted transition-colors hover:text-cream focus:text-cream"
      >
        {formats.map((opt) => (
          <option key={opt.format ?? "all"} value={opt.format ?? ""}>
            {opt.icon ? `${opt.icon} ` : ""}
            {opt.label} · {opt.count}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-3 text-[10px] text-faint"
        aria-hidden
      >
        ▾
      </span>
    </span>
  );
}

function formatChipLabel(format: ExerciseFormat): string {
  const meta = FORMAT_LABELS[format];
  return `${meta.icon} ${meta.label}`;
}

const CONFETTI_COLORS = [
  "#0ae448",
  "#abff84",
  "#ff8709",
  "#fec5fb",
  "#9d95ff",
  "#00bae2",
];

/** Overlay efímero de celebración: anillo + check + confeti con timeline GSAP. */
function Celebration({
  color,
  reduceMotion,
}: {
  color: string;
  reduceMotion: boolean;
}) {
  const colorStyle = moduleColorStyle(color);
  const rootRef = useRef<HTMLDivElement>(null);
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = 80 + Math.random() * 140;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist + 60,
          rot: (Math.random() - 0.5) * 720,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
      }),
    [],
  );

  useEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-celebrate-ring]",
        { scale: 0.4, opacity: 0 },
        { scale: 1.35, opacity: 1, duration: 0.4, ease: "power2.out" },
      )
        .fromTo(
          "[data-celebrate-check]",
          { scale: 0.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "-=0.2",
        )
        .fromTo(
          ".celebration-piece",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, stagger: 0.02 },
          "-=0.25",
        )
        .to(
          ".celebration-piece",
          {
            x: (i: number) => pieces[i]?.dx ?? 0,
            y: (i: number) => pieces[i]?.dy ?? 0,
            rotation: (i: number) => pieces[i]?.rot ?? 0,
            opacity: 0,
            duration: 0.95,
            ease: "power2.out",
            stagger: 0.02,
          },
          "-=0.15",
        );
    }, root);
    return () => ctx.revert();
  }, [reduceMotion, pieces]);

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
      ref={rootRef}
      style={colorStyle}
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div
        data-celebrate-ring
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream/40"
        aria-hidden
      />
      <div className="absolute inset-0" aria-hidden>
        {pieces.map((p) => (
          <span
            key={p.id}
            className="celebration-piece absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{
              backgroundColor: p.color,
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}
      </div>
      <div
        data-celebrate-check
        className="mod-celebrate flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-glow"
      >
        ✓
      </div>
    </div>
  );
}

/** Atajos de teclado en una línea discreta bajo los controles. */
function KeyboardHints() {
  return (
    <p
      className="flex items-center justify-center gap-x-1.5 gap-y-1 text-[10px] text-muted"
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

  // Formatos interactivos: instrucción por defecto según el formato.
  if (exercise.format) {
    switch (exercise.format) {
      case "prediction":
        return "Predice la salida del código y pulsa Verificar.";
      case "ordering":
        return "Ordena los pasos en la secuencia correcta y pulsa Verificar.";
      case "snippet-pick":
        return "Elige el snippet correcto y pulsa Verificar.";
      case "bug-hunt":
        return "Identifica el bug o vulnerabilidad y pulsa Verificar.";
      case "matching":
        return "Empareja cada término con su definición y pulsa Verificar.";
      case "context-dropdown":
        return "Completa cada hueco eligiendo la opción correcta y pulsa Verificar.";
      case "true-false":
        return "Responde cada afirmación con Verdadero o Falso y pulsa Verificar.";
    }
  }

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
