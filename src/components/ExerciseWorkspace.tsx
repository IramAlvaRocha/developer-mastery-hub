import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { Exercise } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/answers";
import { evaluateFormat } from "@/lib/formatVerification";
import { clearAnswers, readAnswers, writeAnswers } from "@/lib/answerStorage";
import { moduleColorStyle } from "@/lib/moduleColors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import ChallengeCode from "./ChallengeCode";
import ExerciseFormatView from "./formats/ExerciseFormat";
import TheoryTab from "./TheoryTab";
import SolutionPanel from "./SolutionPanel";
import SimulatedTerminal from "./SimulatedTerminal";

type Tab = "theory" | "terminal" | "challenge" | "code";

interface TabDef {
  id: Tab;
  label: string;
  shortLabel: string;
}

interface Props {
  exercise: Exercise;
  moduleKey: string;
  moduleName: string;
  color: string;
  alreadyCompleted: boolean;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: (id: number) => void;
  onShare: () => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function ExerciseWorkspace({
  exercise,
  moduleKey,
  moduleName,
  color,
  alreadyCompleted,
  index,
  total,
  onPrev,
  onNext,
  onComplete,
  onShare,
  onToast,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(
    exercise.theory ? "theory" : exercise.simulation ? "terminal" : "challenge",
  );
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(() =>
    readAnswers(moduleKey, exercise.id),
  );
  const [incorrectKeys, setIncorrectKeys] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(alreadyCompleted);
  const [celebrate, setCelebrate] = useState(false);
  const codeNavTimerRef = useRef<number | null>(null);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Al cambiar de ejercicio, recarga las respuestas guardadas (nunca `{}`).
  useEffect(() => {
    setActiveTab(
      exercise.theory ? "theory" : exercise.simulation ? "terminal" : "challenge",
    );
    setIncorrectKeys(new Set());
    setUserAnswers(readAnswers(moduleKey, exercise.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, exercise.theory, exercise.simulation, moduleKey]);

  // `alreadyCompleted` solo refleja el progreso en el padre: no toca respuestas.
  useEffect(() => {
    setSolved(alreadyCompleted);
  }, [alreadyCompleted]);

  // Guarda las respuestas de los huecos en sessionStorage.
  useEffect(() => {
    writeAnswers(moduleKey, exercise.id, userAnswers);
  }, [moduleKey, exercise.id, userAnswers]);

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 1600);
    return () => clearTimeout(t);
  }, [celebrate]);

  useEffect(() => {
    return () => {
      if (codeNavTimerRef.current != null) {
        window.clearTimeout(codeNavTimerRef.current);
      }
    };
  }, []);

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

  const reduceMotion = usePrefersReducedMotion();

  function resetChallenge() {
    clearAnswers(moduleKey, exercise.id);
    setUserAnswers({});
    setIncorrectKeys(new Set());
  }

  // Tras verificar correcto, deja que la celebración (1600ms) tome protagonismo
  // y navega a Solución; con prefers-reduced-motion cambia al instante.
  function goToSolution() {
    if (codeNavTimerRef.current != null) {
      window.clearTimeout(codeNavTimerRef.current);
    }
    if (reduceMotion) {
      setActiveTab("code");
      return;
    }
    codeNavTimerRef.current = window.setTimeout(() => {
      setActiveTab("code");
      codeNavTimerRef.current = null;
    }, 650);
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
        goToSolution();
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
      goToSolution();
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
  const answerCount = Object.keys(exercise.inputs).length;
  const challengeMeta = exercise.format
    ? "Ejercicio interactivo"
    : answerCount > 0
      ? `${answerCount} ${answerCount === 1 ? "respuesta" : "respuestas"}`
      : "Práctica guiada";

  const positionPercent = total > 0 ? ((index + 1) / total) * 100 : 0;
  const colorStyle = moduleColorStyle(color);

  // ── Tabs visibles ─────────────────────────────────────────────────────────
  const tabs = useMemo<TabDef[]>(() => {
    const list: TabDef[] = [];
    if (exercise.theory)
      list.push({ id: "theory", label: "Teoría", shortLabel: "01" });
    if (exercise.simulation)
      list.push({ id: "terminal", label: "Terminal", shortLabel: "02" });
    list.push({
      id: "challenge",
      label: "Desafío",
      shortLabel: exercise.simulation ? "03" : "02",
    });
    list.push({
      id: "code",
      label: "Solución",
      shortLabel: exercise.simulation ? "04" : "03",
    });
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

      <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {/* Anuncio de navegación para lectores de pantalla */}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          key={`${index}-${exercise.id}`}
        >
          Ejercicio {index + 1} de {total}: {exercise.title}
        </p>
        {/* Workspace sobre canvas: hero + tabs + paneles con scroll único */}
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
          {/* Hero como sección propia, al estilo landing */}
          <section
            ref={heroRef}
            style={colorStyle}
            className="relative shrink-0 overflow-hidden border-b border-line px-4 py-6 sm:px-6 sm:py-8"
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
              <div className="flex items-center gap-2">
                <span className="pill-chip border border-butter/25 bg-butter/10 text-butter">
                  {"★".repeat(exercise.stars)}
                  <span className="text-line">
                    {"★".repeat(Math.max(0, 5 - exercise.stars))}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onShare}
                  className="icon-btn border border-line bg-canvas/40"
                  aria-label="Compartir ejercicio"
                  title="Compartir ejercicio"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 4h6v6" />
                    <path d="m20 4-9 9" />
                    <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
                  </svg>
                </button>
              </div>
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

            {/* Las vistas forman parte de la ficha; no flotan fuera del contexto. */}
            <div className="relative mt-7 border-t border-line/70 pt-3">
              <div
                ref={tabListRef}
                role="tablist"
                aria-label="Contenido del ejercicio"
                onKeyDown={onTabListKeyDown}
                className="relative flex w-full overflow-x-auto"
              >
                <span
                  ref={tabIndicatorRef}
                  aria-hidden
                  className="mod-bg pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-full"
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
                      className={`relative z-10 flex min-w-[7rem] flex-1 shrink-0 items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-semibold transition-colors ${
                        active
                          ? "mod-text"
                          : "text-muted hover:text-cream"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] ${
                          active ? "opacity-100" : "text-faint"
                        }`}
                        aria-hidden="true"
                      >
                        {tab.shortLabel}
                      </span>
                      {tab.label}
                      {tab.id === "challenge" && !solved && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Paneles sobre canvas; solo código y terminal conservan caja dev-tool */}
          <div
            data-panel
            role="tabpanel"
            id="panel-challenge"
            aria-labelledby="tab-challenge"
            tabIndex={activeTab === "challenge" ? 0 : -1}
            className={activeTab === "challenge" ? "flex min-h-full min-w-0 flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8" : "hidden"}
          >
            <div className="grid min-w-0 gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
              <aside
                style={colorStyle}
                className="overflow-hidden rounded-[24px] border border-line bg-surface lg:sticky lg:top-5"
              >
                <div className="border-b border-line-soft p-5">
                  <div className="flex items-center gap-3">
                    <span className="mod-icon-bg mod-text flex h-10 w-10 items-center justify-center rounded-[15px] font-mono text-lg font-bold" aria-hidden="true">
                      ?
                    </span>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] mod-text">
                      Tu misión
                    </p>
                    <span
                      className={`ml-auto rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        solved
                          ? "border-brand/30 bg-brand/10 text-brand"
                          : "border-line bg-canvas/50 text-faint"
                      }`}
                    >
                      {solved ? "Completado" : "Pendiente"}
                    </span>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold tracking-tight text-cream">
                    Resuelve el desafío
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">
                    {instruction}
                  </p>
                </div>
                <div className="space-y-3 bg-surface-2/60 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
                    Cómo avanzar
                  </p>
                  <ol className="space-y-3 text-[12px] text-muted">
                    <li className="flex gap-2.5">
                      <span className="mod-text font-mono font-bold">01</span>
                      <span>Lee el contexto y localiza qué debes completar.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mod-text font-mono font-bold">02</span>
                      <span>Responde directamente en el ejercicio.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mod-text font-mono font-bold">03</span>
                      <span>Verifica y revisa la explicación final.</span>
                    </li>
                  </ol>
                  <div className="flex items-center justify-between border-t border-line-soft pt-3 text-[11px]">
                    <span className="text-faint">Formato</span>
                    <span className="font-semibold text-cream">{challengeMeta}</span>
                  </div>
                </div>
              </aside>

              {/* Área de trabajo: el ejercicio conserva el marco de una herramienta real. */}
              <div
                style={colorStyle}
                className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[24px] border border-line bg-canvas"
              >
                <div className="flex flex-col gap-2 border-b border-line bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
                <div style={colorStyle} className="min-w-0 flex-1 p-4 sm:p-5">
                  {exercise.format ? (
                    <ExerciseFormatView
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
                <div className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8">
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
                <div className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8">
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
              <div className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8">
                <SolutionPanel exercise={exercise} color={color} />
              </div>
            </div>
          </div>
        </div>

      <footer className="shrink-0 border-t border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-5xl overflow-x-hidden px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={onPrev}
                disabled={isFirst}
                className="btn-secondary !min-h-11 !px-0 !text-sm max-sm:h-11 max-sm:w-11 sm:!px-5"
                aria-label="Ejercicio anterior"
              >
                ←<span className="hidden sm:inline"> Anterior</span>
              </button>
              <span className="shrink-0 text-[12px] font-medium text-muted">
                <span className="text-cream">{index + 1}</span>
                <span className="text-muted"> / {total}</span>
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
                className="btn-primary !min-h-11 !px-0 !text-sm max-sm:h-11 max-sm:w-11 sm:!px-5"
                aria-label="Siguiente ejercicio"
              >
                <span className="hidden sm:inline">Siguiente </span>→
              </button>
            </div>
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
