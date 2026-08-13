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
  /** Oculta la sidebar solo en desktop (md+); el drawer móvil no se ve afectado. */
  collapsed: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
  onCollapse: () => void;
}

type SortMode = "default" | "asc" | "desc";

/** Detecta desktop (>= md) para exponer el drawer solo en móvil. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function ExerciseSidebar({
  moduleName,
  color,
  exercises,
  activeIndex,
  progress,
  isCompleted,
  isOpen,
  collapsed,
  onSelect,
  onClose,
  onCollapse,
}: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const colorStyle = moduleColorStyle(color);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const drawerHidden = !isDesktop && !isOpen;

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

  const groupedItems = useMemo(() => {
    const groups = new Map<string, typeof items>();
    for (const item of items) {
      const category = item.ex.category || "Ejercicios";
      const group = groups.get(category);
      if (group) group.push(item);
      else groups.set(category, [item]);
    }
    return Array.from(groups, ([category, entries]) => ({ category, entries }));
  }, [items]);

  function cycleSort() {
    setSortMode((m) =>
      m === "default" ? "asc" : m === "asc" ? "desc" : "default",
    );
  }

  const navRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector<HTMLButtonElement>(
      '[data-active="true"]',
    );
    if (active) {
      active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex, starFilter, sortMode]);

  // Escape cierra el drawer móvil.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Al abrir, mueve el foco dentro del drawer.
  useEffect(() => {
    if (isOpen) asideRef.current?.focus();
  }, [isOpen]);

  const sortLabel =
    sortMode === "asc"
      ? "★ ascendente"
      : sortMode === "desc"
        ? "★ descendente"
        : "Orden original";

  return (
    <aside
      ref={asideRef}
      tabIndex={-1}
      aria-hidden={drawerHidden ? "true" : undefined}
      inert={drawerHidden ? true : undefined}
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[min(20rem,88vw)] shrink-0 flex-col border-r border-line bg-surface-2 motion-safe-transition transition-transform duration-300 md:static md:w-80 ${
        collapsed ? "md:hidden" : ""
      } ${
        isOpen
          ? "translate-x-0 rounded-r-[28px] shadow-float"
          : "-translate-x-full md:translate-x-0 md:rounded-none md:shadow-none"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-cream/80">
            Módulo
          </p>
          <h2 className="truncate text-base font-semibold text-cream">
            {moduleName}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onCollapse}
            className="icon-btn hidden border border-line md:inline-flex"
            aria-label="Ocultar lista de ejercicios"
            title="Ocultar lista de ejercicios"
          >
            <span aria-hidden="true">☰</span>
          </button>
          <button
            onClick={onClose}
            className="icon-btn border border-line md:hidden"
            aria-label="Cerrar lista de ejercicios"
          >
            ×
          </button>
        </div>
      </div>

      <div className="shrink-0 border-b border-line px-5 py-4" style={colorStyle}>
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
          <span className="text-muted">Completado</span>
          <span className="mod-text">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="mod-progress motion-safe-transition"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="shrink-0 space-y-2.5 border-b border-line px-4 py-2.5">
        <button
          onClick={cycleSort}
          className="pill-chip w-full justify-between border border-line bg-canvas/40 text-muted transition-colors hover:text-cream"
          title="Cambiar orden por dificultad"
        >
          <span>{sortLabel}</span>
          <span className="text-faint">
            {sortMode === "asc" ? "↑" : sortMode === "desc" ? "↓" : "•"}
          </span>
        </button>
        <div className="flex flex-wrap gap-2">
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

      <nav
        ref={navRef}
        aria-label={`Lista de ejercicios de ${moduleName}`}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="relative space-y-3 before:absolute before:bottom-5 before:left-[7px] before:top-5 before:w-px before:bg-line/60">
          {groupedItems.map(({ category, entries }) => (
            <li key={category} className="relative">
              <div className="relative z-[1] flex items-center gap-3 py-1.5">
                <span
                  className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-line bg-surface-2"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-faint" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {category}
                </span>
                <span className="font-mono text-[10px] text-faint">
                  {entries.length}
                </span>
              </div>

              <ul className="relative ml-[7px] border-l border-line/60 pb-1 pl-6 pt-1">
                {entries.map(({ ex, index }) => {
                  const active = activeIndex === index;
                  const done = isCompleted(ex.id);
                  const label =
                    ex.step != null ? `Paso ${ex.step}` : `Nv.${ex.stars}`;
                  return (
                    <li key={ex.id} className="relative">
                      <span
                        className="absolute -left-6 top-6 h-px w-[18px] bg-line/60"
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute -left-[30px] top-6 z-[2] flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-bold ${
                          done
                            ? "bg-brand text-canvas"
                            : active
                              ? "bg-sky ring-4 ring-sky/20"
                              : "border border-line bg-surface-2"
                        }`}
                        aria-hidden="true"
                      >
                        {done ? "✓" : null}
                      </span>
                      <button
                        data-active={active ? "true" : undefined}
                        onClick={() => onSelect(index)}
                        style={colorStyle}
                        className={`group relative flex w-full items-center rounded-[16px] px-3 py-3 text-left transition-colors ${
                          active
                            ? "mod-sidebar-item-active"
                            : "text-muted hover:bg-elevated/60 hover:text-cream"
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-[10px] font-medium uppercase tracking-wide ${
                              active ? "text-cream/70" : "text-faint"
                            }`}
                          >
                            {label}
                          </span>
                          <span
                            className={`mt-0.5 block truncate text-[13px] leading-snug ${
                              active
                                ? "font-semibold text-cream"
                                : "font-medium"
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
            </li>
          ))}
        </ul>

        {items.length === 0 && (
          <p className="rounded-[20px] border border-line bg-canvas/40 px-4 py-6 text-center text-[12px] text-faint">
            No hay ejercicios con ese filtro.
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
