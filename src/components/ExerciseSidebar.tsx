import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise } from "@/lib/types";
import { moduleColorStyle } from "@/lib/moduleColors";

interface Props {
  moduleName: string;
  color: string;
  exercises: Exercise[];
  activeIndex: number;
  progress: number;
  isCompleted: (id: number) => boolean;
  isOpen: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
}

type SortMode = "default" | "asc" | "desc";

export default function ExerciseSidebar({
  moduleName,
  color,
  exercises,
  activeIndex,
  progress,
  isCompleted,
  isOpen,
  onSelect,
  onClose,
}: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const colorStyle = moduleColorStyle(color);

  const starLevels = useMemo(
    () =>
      Array.from(new Set(exercises.map((e) => e.stars))).sort((a, b) => a - b),
    [exercises],
  );

  const items = useMemo(() => {
    let list = exercises.map((ex, index) => ({ ex, index }));
    if (starFilter != null)
      list = list.filter((it) => it.ex.stars === starFilter);
    if (sortMode === "asc")
      list = [...list].sort((a, b) => a.ex.stars - b.ex.stars);
    if (sortMode === "desc")
      list = [...list].sort((a, b) => b.ex.stars - a.ex.stars);
    return list;
  }, [exercises, starFilter, sortMode]);

  function cycleSort() {
    setSortMode((m) =>
      m === "default" ? "asc" : m === "asc" ? "desc" : "default",
    );
  }

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector<HTMLButtonElement>(
      '[data-active="true"]',
    );
    if (active) {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex, starFilter, sortMode]);

  const sortLabel =
    sortMode === "asc"
      ? "★ ascendente"
      : sortMode === "desc"
        ? "★ descendente"
        : "Orden original";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[min(18.5rem,88vw)] shrink-0 flex-col border-r border-line bg-[#121412] motion-safe-transition transition-transform duration-300 md:static md:w-72 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-faint">
            Módulo
          </p>
          <h4 className="truncate text-[15px] font-semibold text-cream">
            {moduleName}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="icon-btn border border-line md:hidden"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="shrink-0 border-b border-line px-4 py-3" style={colorStyle}>
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
          <span className="text-muted">Completado</span>
          <span className="mod-text">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="mod-progress motion-safe-transition"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-b border-line px-3 py-3">
        <button
          onClick={cycleSort}
          className="flex w-full items-center justify-between rounded-full border border-line bg-canvas/50 px-3 py-2 text-[11px] font-semibold text-muted transition-colors hover:text-cream"
          title="Cambiar orden por dificultad"
        >
          <span>{sortLabel}</span>
          <span className="text-faint">
            {sortMode === "asc" ? "↑" : sortMode === "desc" ? "↓" : "•"}
          </span>
        </button>
        <div className="flex flex-wrap gap-1.5">
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
              onClick={() => setStarFilter((s) => (s === lvl ? null : lvl))}
            >
              {"★".repeat(lvl)}
            </FilterChip>
          ))}
        </div>
      </div>

      <nav ref={navRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <ul className="relative ml-3 border-l border-line/80">
          {items.map(({ ex, index }, i) => {
            const active = activeIndex === index;
            const done = isCompleted(ex.id);
            const label =
              ex.step != null ? `Paso ${ex.step}` : `Nv.${ex.stars}`;
            const isLast = i === items.length - 1;
            return (
              <li key={ex.id} className="relative">
                <button
                  data-active={active ? "true" : undefined}
                  onClick={() => onSelect(index)}
                  className={`relative flex w-full items-start gap-3 py-2.5 pl-5 pr-2 text-left transition-colors ${
                    active
                      ? "text-cream"
                      : "text-muted hover:text-cream"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-[1.15rem] z-[1] flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full text-[9px] font-bold ${
                      done
                        ? "bg-brand text-canvas"
                        : active
                          ? "bg-sky shadow-[0_0_0_3px_rgba(0,186,226,0.28)]"
                          : "border border-line bg-[#121412]"
                    }`}
                    aria-hidden
                  >
                    {done ? "✓" : null}
                  </span>
                  {!isLast && (
                    <span
                      className="absolute left-0 top-[1.55rem] h-[calc(100%-0.35rem)] w-px -translate-x-1/2 bg-line/80"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-medium uppercase tracking-wide text-faint">
                      {ex.category} · {label}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-[13px] leading-snug ${
                        active ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {ex.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {items.length === 0 && (
          <p className="px-3 py-6 text-center text-[12px] text-faint">
            No hay ejercicios con esa dificultad.
          </p>
        )}
      </nav>
    </aside>
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
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide transition-colors ${
        active
          ? "border-brand/40 bg-brand/15 text-brand"
          : "border-line bg-canvas/40 text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}
