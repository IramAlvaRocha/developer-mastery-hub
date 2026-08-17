import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import type { Exercise, Module } from "@/lib/types";
import { moduleColorStyle } from "@/lib/moduleColors";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { buildCourses } from "@/lib/courseCatalog";
import ModuleCard from "./ModuleCard";

type SortMode = "default" | "asc" | "desc";

interface Props {
  module: Module;
  progress: number;
  completedCount: number;
  isCompleted: (id: number) => boolean;
  /** Id del ejercicio a resaltar como "activo" al volver del workspace. */
  activeExerciseId: number | null;
  lastVisitedIndex: number | null;
  recommended: Module[];
  onSelectExercise: (index: number) => void;
  onOpenModule: (key: string) => void;
  onBack: () => void;
  getPercent: (key: string, total: number) => number;
}

/** Tamaño del rango de salto ("capítulos" 1–10, 11–20…). */
const RANGE_SIZE = 10;

export default function ModuleReader({
  module,
  progress,
  completedCount,
  isCompleted,
  activeExerciseId,
  lastVisitedIndex,
  recommended,
  onSelectExercise,
  onOpenModule,
  onBack,
  getPercent,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const colorStyle = moduleColorStyle(module.color);
  const exercises = module.exercises;
  const total = exercises.length;

  const starLevels = useMemo(
    () =>
      Array.from(new Set(exercises.map((e) => e.stars))).sort((a, b) => a - b),
    [exercises],
  );

  const { minStars, maxStars } = useMemo(
    () =>
      total > 0
        ? {
            minStars: Math.min(...exercises.map((e) => e.stars)),
            maxStars: Math.max(...exercises.map((e) => e.stars)),
          }
        : { minStars: 0, maxStars: 0 },
    [exercises, total],
  );

  const interactiveCount = useMemo(
    () => exercises.filter((e) => e.format != null).length,
    [exercises],
  );

  const courseName = useMemo(
    () => buildCourses([module])[0]?.name ?? module.group,
    [module],
  );

  // Rangos fijos sobre el orden original del módulo (1–10, 11–20…). El filtro
  // oculta cards y el orden solo reordena dentro de cada rango para que las
  // etiquetas "{from}–{to}" sigan correspondiendo al número de ejercicio.
  const ranges = useMemo(() => {
    const list: {
      from: number;
      to: number;
      items: { ex: Exercise; index: number }[];
    }[] = [];
    for (let start = 0; start < total; start += RANGE_SIZE) {
      const slice = exercises.slice(start, start + RANGE_SIZE);
      let items = slice.map((ex, i) => ({ ex, index: start + i }));
      if (starFilter != null) {
        items = items.filter((it) => it.ex.stars === starFilter);
      }
      if (sortMode === "asc") {
        items = [...items].sort((a, b) => a.ex.stars - b.ex.stars);
      }
      if (sortMode === "desc") {
        items = [...items].sort((a, b) => b.ex.stars - a.ex.stars);
      }
      if (items.length > 0) {
        list.push({ from: start + 1, to: start + slice.length, items });
      }
    }
    return list;
  }, [exercises, total, starFilter, sortMode]);

  const visibleCount = useMemo(
    () => ranges.reduce((sum, range) => sum + range.items.length, 0),
    [ranges],
  );

  // CTAs "Continuar" (solo si hay avance sin terminar y una posición guardada).
  const clampedLastVisited =
    lastVisitedIndex != null
      ? Math.min(Math.max(lastVisitedIndex, 0), total - 1)
      : null;
  const canContinue =
    total > 0 && progress > 0 && progress < 100 && clampedLastVisited != null;
  const continueExercise =
    clampedLastVisited != null ? exercises[clampedLastVisited] : undefined;
  const continueLabel =
    continueExercise?.step != null
      ? `Paso ${continueExercise.step}`
      : `Ejercicio ${(clampedLastVisited ?? 0) + 1}`;

  // ── Motion §12.5 ────────────────────────────────────────────────────────
  // Entrada del hero (stagger) + pop del cover. Guard reduced-motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // clearProps limitado a transform/opacity: "all" borraría también los
      // CSS vars inline (--module-rgb) que alimentan las clases .mod-*.
      gsap.from("[data-reveal]", {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
      gsap.from("[data-cover]", {
        scale: 0.94,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        clearProps: "transform,opacity",
      });
    }, root);
    return () => ctx.revert();
  }, [module.key]);

  // Stagger de cards: una vez al montar y de nuevo al cambiar filtro/orden.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ex-card", {
        y: 20,
        opacity: 0,
        stagger: 0.045,
        duration: 0.45,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    }, root);
    return () => ctx.revert();
  }, [module.key, starFilter, sortMode]);

  // Al volver del workspace: foco + scroll al card del ejercicio activo.
  const focusRestoredRef = useRef(false);
  useEffect(() => {
    if (focusRestoredRef.current) return;
    focusRestoredRef.current = true;
    if (activeExerciseId == null) return;
    const card = rootRef.current?.querySelector<HTMLButtonElement>(
      '[data-active-exercise="true"]',
    );
    if (!card) return;
    card.focus({ preventScroll: true });
    card.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeExerciseId]);

  function cycleSort() {
    setSortMode((m) =>
      m === "default" ? "asc" : m === "asc" ? "desc" : "default",
    );
  }

  function jumpToRange(from: number) {
    document
      .getElementById(`ex-range-${from}`)
      ?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
  }

  const sortLabel =
    sortMode === "asc"
      ? "★ ascendente"
      : sortMode === "desc"
        ? "★ descendente"
        : "Orden original";

  const topicChips = module.topics.slice(0, 5);
  const extraTopics = module.topics.length - topicChips.length;

  if (total === 0) {
    return <ModuleReaderEmpty onBack={onBack} />;
  }

  return (
    <main
      ref={rootRef}
      className="relative flex min-h-0 flex-1 flex-col overflow-y-auto"
      aria-label={`Ficha del módulo ${module.name}`}
    >
      <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Hero ficha ─────────────────────────────────────────────── */}
        <section
          data-reveal
          style={colorStyle}
          className="relative overflow-hidden rounded-card border mod-border-40 bg-surface p-6 sm:p-8"
        >
          <div
            className="mod-glow pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:gap-8">
            {/* Cover tipo manga */}
            <div data-cover className="mx-auto w-36 shrink-0 sm:mx-0 sm:w-44">
              <div
                className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-line-soft bg-surface-2"
                style={{
                  background: `radial-gradient(circle at 30% 24%, rgb(var(--module-rgb) / 0.5), rgb(var(--module-rgb) / 0.14) 55%, transparent 78%)`,
                }}
              >
                <span className="text-6xl leading-none" aria-hidden="true">
                  {module.icon}
                </span>
                <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-1.5 rounded-[20px] border border-line-soft bg-canvas/80 px-3 py-2.5 backdrop-blur">
                  <span className="mod-badge rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                    {module.badge}
                  </span>
                  <span className="rounded-full border border-butter/25 bg-butter/10 px-2.5 py-0.5 text-[10px] font-bold text-butter">
                    ★{minStars}–{maxStars}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-faint">
                <span>{module.group}</span>
                <span aria-hidden="true">·</span>
                <span>{courseName}</span>
              </div>
              <p className="section-eyebrow mt-3 text-cream">{"{ Módulo }"}</p>
              <h1 className="mt-1 text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-tight text-cream">
                {module.name}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                {module.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="pill-chip border border-line bg-canvas/60 text-muted">
                  {total} ejercicios
                </span>
                <span className="pill-chip border border-line bg-canvas/60 text-muted">
                  {completedCount} completados
                </span>
                <span className="pill-chip border border-line bg-canvas/60 text-muted">
                  ★{minStars}–{maxStars}
                </span>
                {topicChips.map((topic) => (
                  <span
                    key={topic}
                    className="pill-chip border border-line bg-canvas/60 text-muted"
                  >
                    #{topic}
                  </span>
                ))}
                {extraTopics > 0 && (
                  <span className="pill-chip border border-line bg-canvas/60 text-muted">
                    +{extraTopics}
                  </span>
                )}
                {interactiveCount > 0 && (
                  <span className="pill-chip border border-peach/25 bg-peach/10 text-peach">
                    {interactiveCount === 1
                      ? "1 interactivo"
                      : `${interactiveCount} interactivos`}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => onSelectExercise(0)}
                  className="btn-filled-soft w-full !min-h-11 sm:w-auto"
                >
                  Empezar desde el inicio →
                </button>
                {canContinue && (
                  <button
                    type="button"
                    onClick={() => onSelectExercise(clampedLastVisited ?? 0)}
                    className="btn-primary w-full !min-h-11 sm:w-auto"
                  >
                    Continuar: {continueLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectExercise(total - 1)}
                  className="btn-secondary w-full !min-h-11 sm:w-auto"
                >
                  Último ejercicio
                </button>
              </div>

              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted">
                    {completedCount} de {total} completados
                  </span>
                  <span className="mod-text">{progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="mod-progress"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Lista de ejercicios ────────────────────────────────────── */}
        <section aria-labelledby="reader-list-title" className="mt-10 sm:mt-14">
          <div data-reveal>
            <h2
              id="reader-list-title"
              className="text-xl font-semibold tracking-tight text-cream sm:text-2xl"
            >
              {total} ejercicios
            </h2>
            <p className="mt-1 text-sm text-muted">
              Salta a cualquier ejercicio o retoma donde lo dejaste.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {starLevels.length > 1 && (
              <>
                <FilterChip
                  active={starFilter == null}
                  onClick={() => setStarFilter(null)}
                >
                  Todos
                </FilterChip>
                {starLevels.map((lvl) => (
                  <FilterChip
                    key={lvl}
                    active={starFilter === lvl}
                    onClick={() =>
                      setStarFilter((s) => (s === lvl ? null : lvl))
                    }
                  >
                    {"★".repeat(lvl)}
                  </FilterChip>
                ))}
              </>
            )}
            <button
              type="button"
              onClick={cycleSort}
              title="Cambiar orden por dificultad"
              className="pill-chip border border-line bg-canvas/40 text-muted transition-colors hover:text-cream"
            >
              <span>{sortLabel}</span>
              <span className="text-faint">
                {sortMode === "asc" ? "↑" : sortMode === "desc" ? "↓" : "•"}
              </span>
            </button>
          </div>

          {total > 10 && ranges.length > 1 && (
            <nav
              aria-label="Saltar a rango de ejercicios"
              className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
            >
              {ranges.map(({ from, to }) => (
                <button
                  key={from}
                  type="button"
                  onClick={() => jumpToRange(from)}
                  aria-label={`Ir a ejercicios ${from}–${to}`}
                  className="pill-chip shrink-0 border border-line bg-canvas/40 text-muted transition-colors hover:text-cream"
                >
                  {from}–{to}
                </button>
              ))}
            </nav>
          )}

          {ranges.map(({ from, to, items }) => (
            <section
              key={from}
              id={`ex-range-${from}`}
              className="mt-6 scroll-mt-24"
              aria-label={`Ejercicios ${from}–${to}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-faint">
                {from}–{to}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map(({ ex, index }) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    index={index}
                    colorStyle={colorStyle}
                    done={isCompleted(ex.id)}
                    active={activeExerciseId === ex.id}
                    onSelect={() => onSelectExercise(index)}
                  />
                ))}
              </div>
            </section>
          ))}

          {visibleCount === 0 && (
            <p className="mt-8 rounded-[20px] border border-line bg-canvas/40 px-4 py-6 text-center text-[12px] text-faint">
              No hay ejercicios con ese filtro.
            </p>
          )}
        </section>

        {/* ── Recomendaciones ────────────────────────────────────────── */}
        {recommended.length > 0 && (
          <section
            data-reveal
            aria-labelledby="reader-recs-title"
            className="mt-12 sm:mt-16"
          >
            <h2 id="reader-recs-title" className="section-eyebrow text-cream">
              {"{ Sigue aprendiendo }"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Otros módulos de la misma ruta para continuar tu práctica.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommended.map((mod) => (
                <ModuleCard
                  key={mod.key}
                  module={mod}
                  progress={getPercent(mod.key, mod.exercises.length)}
                  onStart={onOpenModule}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ExerciseCard({
  exercise,
  index,
  colorStyle,
  done,
  active,
  onSelect,
}: {
  exercise: Exercise;
  index: number;
  colorStyle: CSSProperties;
  done: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const n = index + 1;
  const label =
    exercise.step != null ? `Paso ${exercise.step}` : `Ejercicio ${n}`;

  return (
    <button
      type="button"
      data-active-exercise={active ? "true" : undefined}
      onClick={onSelect}
      style={colorStyle}
      aria-label={`Ejercicio ${n}: ${exercise.title}${done ? " (completado)" : ""}`}
      aria-current={active ? "true" : undefined}
      className={`ex-card group relative flex flex-col gap-2 rounded-[20px] border bg-canvas/60 p-4 text-left motion-safe-transition motion-safe-lift transition-all duration-150 hover:-translate-y-0.5 ${
        done
          ? "border-brand/40"
          : active
            ? "mod-sidebar-item-active ring-2 ring-sky/30"
            : "border-line ex-card-hover"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold mod-text">{label}</span>
        <span className="flex items-center gap-2">
          <StarsGlyphs stars={exercise.stars} />
          {done ? (
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] font-bold text-brand"
              aria-hidden="true"
            >
              ✓
            </span>
          ) : active ? (
            <span className="h-2 w-2 rounded-full bg-sky" aria-hidden="true" />
          ) : null}
        </span>
      </div>
      <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug text-cream transition-colors group-hover:text-brand-strong">
        {exercise.title}
      </h3>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
        {exercise.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="rounded-full border border-line-soft px-2 py-0.5 text-[10px] font-semibold text-faint">
          {exercise.category}
        </span>
        {exercise.format != null && (
          <span className="rounded-full border border-peach/25 bg-peach/10 px-2 py-0.5 text-[10px] font-semibold text-peach">
            Interactivo
          </span>
        )}
        <span
          className="ml-auto text-faint opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </button>
  );
}

function StarsGlyphs({ stars }: { stars: number }) {
  return (
    <span
      className="flex shrink-0 items-center gap-0.5 font-mono text-[11px] leading-none"
      aria-hidden="true"
    >
      <span className="text-butter">{"★".repeat(stars)}</span>
      <span className="text-faint">{"☆".repeat(Math.max(0, 5 - stars))}</span>
    </span>
  );
}

function FilterChip({
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
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pill-chip border transition-colors ${
        active
          ? "border-brand/40 bg-brand/15 text-brand"
          : "border-line bg-canvas/40 text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}

/** Módulo publicado sin ejercicios (patrón de ExerciseFilterEmpty). */
function ModuleReaderEmpty({ onBack }: { onBack: () => void }) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center rounded-[28px] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="text-3xl" aria-hidden="true">
          🔍
        </span>
        <p className="section-eyebrow mt-4 text-cream">{"{ Sin ejercicios }"}</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
          Este módulo todavía no tiene ejercicios
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
          Vuelve a tus cursos y elige otro módulo mientras se publica el contenido.
        </p>
        <button type="button" onClick={onBack} className="btn-filled-soft mt-6 !min-h-11">
          Volver a mis cursos
        </button>
      </div>
    </main>
  );
}
