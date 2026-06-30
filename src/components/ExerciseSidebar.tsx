import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";

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

  // Niveles de dificultad presentes en el modulo (para los chips de filtro).
  const starLevels = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.stars))).sort((a, b) => a - b),
    [exercises],
  );

  // Conserva el indice original para que la navegacion (prev/next) siga intacta.
  const items = useMemo(() => {
    let list = exercises.map((ex, index) => ({ ex, index }));
    if (starFilter != null) list = list.filter((it) => it.ex.stars === starFilter);
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

  const sortLabel =
    sortMode === "asc"
      ? "★ ascendente"
      : sortMode === "desc"
        ? "★ descendente"
        : "Orden original";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 shrink-0 flex-col border-r border-line bg-surface transition-transform duration-300 md:static ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line bg-surface-2 p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-faint">
            Módulo activo
          </p>
          <h4 className="max-w-[200px] truncate text-sm font-bold text-ink">
            {moduleName}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="icon-btn md:hidden"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="shrink-0 border-b border-line p-4">
        <div className="mb-2 flex justify-between text-[11px] font-semibold text-muted">
          <span>Completadas</span>
          <span className={`text-${color}-400`}>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out bg-${color}-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Filtro y orden por dificultad */}
      <div className="shrink-0 space-y-2 border-b border-line px-3 py-3">
        <button
          onClick={cycleSort}
          className="flex w-full items-center justify-between rounded-[10px] border border-line bg-surface-2 px-3 py-2 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
          title="Cambiar orden por dificultad"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-faint">⇅</span> {sortLabel}
          </span>
          <span className="text-faint">
            {sortMode === "asc" ? "↑" : sortMode === "desc" ? "↓" : "•"}
          </span>
        </button>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={starFilter == null}
            color={color}
            onClick={() => setStarFilter(null)}
          >
            Todos
          </FilterChip>
          {starLevels.map((lvl) => (
            <FilterChip
              key={lvl}
              active={starFilter === lvl}
              color={color}
              onClick={() => setStarFilter((s) => (s === lvl ? null : lvl))}
            >
              {"★".repeat(lvl)}
            </FilterChip>
          ))}
        </div>
      </div>

      <nav className="flex-grow space-y-1 overflow-y-auto p-2.5">
        {items.map(({ ex, index }) => {
          const active = activeIndex === index;
          const done = isCompleted(ex.id);
          const label = ex.step != null ? `Paso ${ex.step}` : `Nv.${ex.stars}`;
          return (
            <button
              key={ex.id}
              onClick={() => onSelect(index)}
              className={`group flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition-all ${
                active
                  ? `border-l-2 bg-elevated text-ink border-${color}-500`
                  : "border-l-2 border-transparent text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                  done
                    ? "bg-emerald-500/15 text-emerald-400"
                    : active
                      ? `bg-${color}-500/15 text-${color}-400`
                      : "bg-surface-2 text-faint"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-faint">
                  {ex.category} • {label}
                </span>
                <span className="truncate text-[13px] font-semibold">
                  {ex.title}
                </span>
              </div>
            </button>
          );
        })}

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
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide transition-colors ${
        active
          ? `bg-${color}-500/15 text-${color}-400 border-${color}-500/40`
          : "border-line bg-surface-2 text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}
