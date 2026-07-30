import { useEffect, useMemo, useState } from "react";
import type { Module } from "@/lib/types";
import type { LastVisited } from "@/lib/useProgress";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth, useCountUp } from "@/lib/useReducedMotion";
import { runViewTransition } from "@/lib/viewTransition";

interface Props {
  modules: Module[];
  groups: string[];
  getPercent: (key: string, total: number) => number;
  onStart: (key: string) => void;
  onResume: (key: string, index: number) => void;
  lastVisited: LastVisited | null;
  onToast: (type: "success" | "error" | "info", message: string) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
}

const GROUP_META: Record<string, { icon: string; color: string; desc: string }> =
  {
    "Buenas Practicas": {
      icon: "🏆",
      color: "purple",
      desc: "Patrones senior de .NET y React.",
    },
    Frontend: {
      icon: "⚡",
      color: "emerald",
      desc: "Vue, Pinia, Nuxt y Vuetify.",
    },
    "Backend & Datos": {
      icon: "🟢",
      color: "lime",
      desc: "Node.js, APIs y SQL Server.",
    },
    "Cloud & Serverless": {
      icon: "☁️",
      color: "blue",
      desc: "GCP y Firebase.",
    },
    "DevOps & Git": {
      icon: "🐳",
      color: "sky",
      desc: "Git, Docker y CI/CD.",
    },
    "APIs & Seguridad": {
      icon: "🔑",
      color: "rose",
      desc: "Auth, JWT, CORS y XSS.",
    },
    "Testing & Calidad": {
      icon: "🧪",
      color: "amber",
      desc: "Vitest, E2E y calidad.",
    },
    TypeScript: {
      icon: "💙",
      color: "indigo",
      desc: "Tipos, generics y utilities.",
    },
    "TS Arrays": {
      icon: "🔄",
      color: "cyan",
      desc: "map, filter, reduce y más.",
    },
  };

const ROUTE_CATEGORIES: { id: string; label: string; groups: string[] }[] = [
  {
    id: "practices",
    label: "Buenas prácticas",
    groups: ["Buenas Practicas"],
  },
  {
    id: "language",
    label: "Lenguaje",
    groups: ["TypeScript", "TS Arrays"],
  },
  {
    id: "frontend",
    label: "Frontend",
    groups: ["Frontend"],
  },
  {
    id: "backend",
    label: "Backend & datos",
    groups: ["Backend & Datos"],
  },
  {
    id: "platform",
    label: "Plataforma",
    groups: [
      "Cloud & Serverless",
      "DevOps & Git",
      "APIs & Seguridad",
      "Testing & Calidad",
    ],
  },
];

function groupVtName(group: string): string {
  return (
    "vt-cat-" +
    group
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export default function ModuleMenu({
  modules,
  groups,
  getPercent,
  onStart,
  onResume,
  lastVisited,
  sidebarOpen,
  onSidebarOpenChange,
}: Props) {
  const availableGroups = useMemo(
    () =>
      groups.filter((g) =>
        modules.some((m) => (m.group || "Otros") === g),
      ),
    [groups, modules],
  );

  const categories = useMemo(
    () =>
      ROUTE_CATEGORIES.map((cat) => ({
        ...cat,
        groups: cat.groups.filter((g) => availableGroups.includes(g)),
      })).filter((cat) => cat.groups.length > 0),
    [availableGroups],
  );

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedGroup && availableGroups.length > 0) {
      setSelectedGroup(availableGroups[0]);
    }
  }, [availableGroups, selectedGroup]);

  useEffect(() => {
    if (!selectedGroup) return;
    const parent = categories.find((c) => c.groups.includes(selectedGroup));
    if (parent) {
      setOpenCats((prev) => ({ ...prev, [parent.id]: true }));
    }
  }, [selectedGroup, categories]);

  const resume = useMemo(() => {
    if (!lastVisited) return null;
    const mod = modules.find((m) => m.key === lastVisited.key);
    if (!mod) return null;
    const percent = getPercent(mod.key, mod.exercises.length);
    if (percent >= 100) return null;
    const index = Math.min(lastVisited.index, mod.exercises.length - 1);
    const ex = mod.exercises[index];
    if (!ex) return null;
    return { mod, index, ex, percent };
  }, [lastVisited, modules, getPercent]);

  function groupProgress(mods: Module[]) {
    const total = mods.reduce((s, m) => s + m.exercises.length, 0);
    if (!total) return 0;
    const weighted = mods.reduce(
      (s, m) => s + getPercent(m.key, m.exercises.length) * m.exercises.length,
      0,
    );
    return Math.round(weighted / total);
  }

  function selectGroup(group: string) {
    runViewTransition(() => setSelectedGroup(group));
  }

  function toggleCat(id: string) {
    setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const metrics = useMemo(() => {
    const totalExercises = modules.reduce(
      (s, m) => s + m.exercises.length,
      0,
    );
    let doneExercises = 0;
    let modulesDone = 0;
    let modulesInProgress = 0;
    let modulesNew = 0;

    for (const m of modules) {
      const p = getPercent(m.key, m.exercises.length);
      doneExercises += Math.round((p / 100) * m.exercises.length);
      if (p >= 100) modulesDone += 1;
      else if (p > 0) modulesInProgress += 1;
      else modulesNew += 1;
    }

    const overall = totalExercises
      ? Math.round((doneExercises / totalExercises) * 100)
      : 0;

    const routeRows = availableGroups.map((group) => {
      const mods = modules.filter((m) => (m.group || "Otros") === group);
      const exercises = mods.reduce((s, m) => s + m.exercises.length, 0);
      const progress = groupProgress(mods);
      const done = mods.filter(
        (m) => getPercent(m.key, m.exercises.length) >= 100,
      ).length;
      const active = mods.filter((m) => {
        const p = getPercent(m.key, m.exercises.length);
        return p > 0 && p < 100;
      }).length;
      return { group, mods, exercises, progress, done, active };
    });

    return {
      totalModules: modules.length,
      totalExercises,
      doneExercises,
      modulesDone,
      modulesInProgress,
      modulesNew,
      overall,
      totalGroups: availableGroups.length,
      routeRows,
    };
  }, [modules, getPercent, availableGroups]);

  const selectedRoute = useMemo(() => {
    if (!selectedGroup) return null;
    return (
      metrics.routeRows.find((r) => r.group === selectedGroup) ?? null
    );
  }, [metrics.routeRows, selectedGroup]);

  const activeMeta = selectedGroup
    ? (GROUP_META[selectedGroup] ?? { icon: "📦", color: "slate", desc: "" })
    : null;

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 overflow-hidden px-4 py-3 md:gap-4 md:px-6 md:py-4">
        {resume && (
          <ResumeCard
            icon={resume.mod.icon}
            color={resume.mod.color}
            moduleName={resume.mod.name}
            exerciseTitle={resume.ex.title}
            stepLabel={
              resume.ex.step != null
                ? `Paso ${resume.ex.step}`
                : `Ejercicio ${resume.index + 1}`
            }
            total={resume.mod.exercises.length}
            percent={resume.percent}
            onResume={() => onResume(resume.mod.key, resume.index)}
          />
        )}

        <div className="relative flex min-h-0 flex-1">
          {/* Backdrop + drawer hamburguesa (slide desde la izquierda) */}
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              sidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!sidebarOpen}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              aria-label="Cerrar menú de rutas"
              onClick={() => onSidebarOpenChange(false)}
            />

            <aside
              className={`absolute inset-y-0 left-0 flex w-[min(20.5rem,90vw)] flex-col border-r border-line bg-[#121412] shadow-float transition-transform duration-300 ease-out motion-reduce:transition-none ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de rutas"
            >
              <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-3">
                <button
                  type="button"
                  className="icon-btn border border-line"
                  aria-label="Cerrar menú"
                  onClick={() => onSidebarOpenChange(false)}
                >
                  ←
                </button>
                <a
                  href="/"
                  className="icon-btn border border-line"
                  aria-label="Inicio"
                  title="Inicio"
                >
                  ⌂
                </a>
                <div className="min-w-0 flex-1 pl-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-faint">
                    Catálogo
                  </p>
                  <p className="truncate text-sm font-semibold text-cream">
                    Menú de aprendizaje
                  </p>
                </div>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                {categories.map((cat) => {
                  const expanded = openCats[cat.id] ?? false;
                  return (
                    <div key={cat.id} className="mb-5">
                      <button
                        type="button"
                        onClick={() => toggleCat(cat.id)}
                        className="mb-2 flex w-full items-center justify-between px-2 text-left"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-faint">
                          {cat.label}
                        </span>
                        <span className="text-xs text-muted">
                          {expanded ? "▾" : "▸"}
                        </span>
                      </button>

                      {expanded && (
                        <ul className="relative ml-3 border-l border-line/80 pl-0">
                          {cat.groups.map((group, gi) => {
                            const meta = GROUP_META[group] ?? {
                              icon: "📦",
                              color: "slate",
                              desc: "",
                            };
                            const row = metrics.routeRows.find(
                              (r) => r.group === group,
                            );
                            const progress = row?.progress ?? 0;
                            const active = selectedGroup === group;
                            const done = progress >= 100;
                            const inProgress = progress > 0 && progress < 100;
                            const isLast = gi === cat.groups.length - 1;

                            return (
                              <li key={group} className="relative">
                                <button
                                  type="button"
                                  onClick={() => selectGroup(group)}
                                  className={`group relative flex w-full items-start gap-3 py-2.5 pl-5 pr-2 text-left transition-colors ${
                                    active
                                      ? "text-cream"
                                      : "text-muted hover:text-cream"
                                  }`}
                                >
                                  {/* Nodo del árbol */}
                                  <span
                                    className={`absolute left-0 top-[1.15rem] z-[1] flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full ${
                                      done
                                        ? "bg-brand text-[9px] font-bold text-canvas"
                                        : active
                                          ? "bg-sky shadow-[0_0_0_3px_rgba(0,186,226,0.25)]"
                                          : inProgress
                                            ? "border-2 border-orangey bg-[#121412]"
                                            : "border border-line bg-[#121412]"
                                    }`}
                                    aria-hidden
                                  >
                                    {done ? "✓" : null}
                                  </span>
                                  {!isLast && (
                                    <span
                                      className="absolute left-0 top-[1.55rem] h-[calc(100%-0.4rem)] w-px -translate-x-1/2 bg-line/80"
                                      aria-hidden
                                    />
                                  )}

                                  <span className="min-w-0 flex-1">
                                    <span
                                      className={`block truncate text-[14px] leading-snug ${
                                        active
                                          ? "font-semibold text-cream"
                                          : "font-medium"
                                      }`}
                                    >
                                      {group}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-faint">
                                      {row?.mods.length ?? 0} cursos · {progress}%
                                    </span>
                                  </span>
                                </button>

                                {/* Cursos anidados (como en la imagen) */}
                                {active && row && (
                                  <ul className="relative mb-2 ml-5 border-l border-dashed border-line/70 pb-1">
                                    {row.mods.map((mod, mi) => {
                                      const p = getPercent(
                                        mod.key,
                                        mod.exercises.length,
                                      );
                                      const modDone = p >= 100;
                                      const lastMod = mi === row.mods.length - 1;
                                      return (
                                        <li key={mod.key} className="relative">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              onStart(mod.key);
                                              onSidebarOpenChange(false);
                                            }}
                                            className="flex w-full items-center gap-2.5 py-2 pl-5 pr-2 text-left text-muted transition-colors hover:text-cream"
                                          >
                                            <span
                                              className={`absolute left-0 top-1/2 z-[1] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                                                modDone
                                                  ? "bg-brand"
                                                  : p > 0
                                                    ? "bg-sky"
                                                    : "border border-line bg-[#121412]"
                                              }`}
                                              aria-hidden
                                            />
                                            {!lastMod && (
                                              <span
                                                className="absolute left-0 top-1/2 h-1/2 w-px -translate-x-1/2 border-l border-dashed border-line/70"
                                                aria-hidden
                                              />
                                            )}
                                            <span className="truncate text-[13px]">
                                              {mod.icon} {mod.name}
                                            </span>
                                            <span className="ml-auto shrink-0 text-[10px] text-faint">
                                              {p}%
                                            </span>
                                          </button>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="shrink-0 border-t border-line px-4 py-3">
                <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
                  <span className="text-muted">Progreso total</span>
                  <span className="text-brand">{metrics.overall}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-500"
                    style={{ width: `${metrics.overall}%` }}
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* Panel de métricas (full width; el menú es overlay) */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
            <div className="shrink-0 border-b border-line px-4 py-4 sm:px-5">
              <p className="text-[12px] text-muted">{"{ Métricas }"}</p>
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                Avance de tus cursos
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Resumen global y detalle por ruta. Elige una ruta en el menú
                para enfocarla.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <MetricTile
                  label="Progreso"
                  value={metrics.overall}
                  suffix="%"
                  accent
                />
                <MetricTile label="Rutas" value={metrics.totalGroups} />
                <MetricTile label="Cursos" value={metrics.totalModules} />
                <MetricTile
                  label="Ejercicios"
                  value={metrics.doneExercises}
                  hint={`de ${metrics.totalExercises}`}
                />
                <MetricTile
                  label="Completados"
                  value={metrics.modulesDone}
                  hint="cursos"
                />
                <MetricTile
                  label="En curso"
                  value={metrics.modulesInProgress}
                  hint="cursos"
                />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-faint">
                  Por ruta
                </p>
                <div className="space-y-2.5">
                  {metrics.routeRows.map((row) => {
                    const meta = GROUP_META[row.group] ?? {
                      icon: "📦",
                      color: "slate",
                      desc: "",
                    };
                    const selected = selectedGroup === row.group;
                    return (
                      <button
                        key={row.group}
                        type="button"
                        onClick={() => selectGroup(row.group)}
                        style={moduleColorStyle(meta.color)}
                        className={`flex w-full flex-col gap-2 rounded-[22px] border px-4 py-3.5 text-left transition-colors sm:flex-row sm:items-center ${
                          selected
                            ? "mod-border-40 bg-canvas"
                            : "border-line bg-canvas/40 hover:border-line hover:bg-canvas/70"
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className="mod-icon-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
                            {meta.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">
                              {row.group}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {row.mods.length} cursos · {row.exercises}{" "}
                              ejercicios · {row.done} hechos · {row.active} en
                              curso
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-40">
                          <div className="mb-1 flex justify-between text-[11px] font-semibold">
                            <span className="text-muted">Avance</span>
                            <span className="mod-text">{row.progress}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="mod-progress"
                              style={{ width: `${row.progress}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedRoute && activeMeta && (
                <div className="mt-8">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-faint">
                        Cursos en {selectedRoute.group}
                      </p>
                      <p className="text-sm text-muted">{activeMeta.desc}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-brand">
                      {selectedRoute.progress}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedRoute.mods.map((mod) => {
                      const p = getPercent(mod.key, mod.exercises.length);
                      const doneCount = Math.round(
                        (p / 100) * mod.exercises.length,
                      );
                      return (
                        <button
                          key={mod.key}
                          type="button"
                          onClick={() => onStart(mod.key)}
                          style={moduleColorStyle(mod.color)}
                          className="flex w-full items-center gap-3 rounded-[20px] border border-line bg-canvas/50 px-3.5 py-3 text-left transition-colors hover:border-brand/30 hover:bg-canvas"
                        >
                          <span className="mod-icon-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg">
                            {mod.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-ink">
                                {mod.name}
                              </p>
                              {p >= 100 && (
                                <span className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                                  Hecho
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-muted">
                              {doneCount}/{mod.exercises.length} ejercicios ·{" "}
                              {p}%
                            </p>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                              <div
                                className="mod-progress"
                                style={{ width: `${p}%` }}
                              />
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-muted">
                            Abrir →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricTile({
  label,
  value,
  suffix,
  hint,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  accent?: boolean;
}) {
  const animated = useCountUp(value);
  return (
    <div className="rounded-[22px] border border-line bg-canvas/60 px-3 py-3.5 text-center">
      <p
        className={`text-xl font-semibold tracking-tight sm:text-2xl ${accent ? "text-brand" : "text-ink"}`}
      >
        {animated}
        {suffix}
      </p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">
        {label}
      </p>
      {hint && <p className="mt-0.5 text-[10px] text-muted">{hint}</p>}
    </div>
  );
}

function ResumeCard({
  icon,
  color,
  moduleName,
  exerciseTitle,
  stepLabel,
  total,
  percent,
  onResume,
}: {
  icon: string;
  color: string;
  moduleName: string;
  exerciseTitle: string;
  stepLabel: string;
  total: number;
  percent: number;
  onResume: () => void;
}) {
  const width = useAnimatedWidth(percent);
  return (
    <div
      style={moduleColorStyle(color)}
      className="animate-fade-in relative shrink-0 overflow-hidden rounded-[28px] border mod-border-40 bg-surface p-4"
    >
      <div className="mod-glow pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="mod-icon-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="mod-text text-[10px] font-bold uppercase tracking-wider">
              Continuar
            </p>
            <h3 className="truncate text-[15px] font-semibold text-ink">
              {exerciseTitle}
            </h3>
            <p className="truncate text-xs text-muted">
              {moduleName} · {stepLabel} · {total} ej.
            </p>
          </div>
        </div>
        <button
          onClick={onResume}
          className="btn-primary shrink-0 self-start !min-h-10 !px-4 !text-sm sm:self-auto"
        >
          Seguir →
        </button>
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="mod-progress" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
