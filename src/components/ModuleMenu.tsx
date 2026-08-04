import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { Module } from "@/lib/types";
import type { LastVisited } from "@/lib/useProgress";
import { moduleColorStyle } from "@/lib/moduleColors";
import {
  prefersReducedMotion,
  useAnimatedWidth,
  useCountUp,
} from "@/lib/useReducedMotion";
import { runViewTransition } from "@/lib/viewTransition";
import ModuleCard from "./ModuleCard";

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
      desc: "Auth, JWT, OWASP, Vulnerabilidades y XSS.",
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
    AWS: {
      icon: "☁️",
      color: "orange",
      desc: "Certificación Developer Associate (DVA-C02): IAM, EC2, S3 y más.",
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
      "AWS",
      "DevOps & Git",
      "APIs & Seguridad",
      "Testing & Calidad",
    ],
  },
];

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
  const rootRef = useRef<HTMLElement>(null);

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

  // Entrada del catálogo: hero, resume y métricas con stagger.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "all",
      });
      gsap.from(".metric-tile", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "all",
      });
    }, root);
    return () => {
      ctx.revert();
      root.querySelectorAll<HTMLElement>("[data-reveal], .metric-tile").forEach(
        (el) => {
          gsap.set(el, { clearProps: "all" });
        },
      );
    };
  }, []);

  // Re-anima la grid al cambiar de ruta.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".course-card",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          overwrite: "auto",
          clearProps: "all",
        },
      );
    }, root);
    return () => {
      ctx.revert();
      // Nunca dejar cards invisibles si el tween se cancela a medias.
      root.querySelectorAll<HTMLElement>(".course-card").forEach((el) => {
        gsap.set(el, { clearProps: "all" });
      });
    };
  }, [selectedGroup]);

  // Escape cierra el drawer de rutas.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSidebarOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, onSidebarOpenChange]);

  const firstModule = modules[0];

  return (
    <main
      ref={rootRef}
      className="relative flex flex-1 flex-col overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero del catálogo */}
        <section data-reveal>
          <p className="section-eyebrow text-cream">{"{ Catálogo }"}</p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-cream">
            Elige tu ruta
          </h1>
          <p className="mt-3 max-w-2xl text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed text-muted">
            Rutas por disciplina. Elige un grupo y entra a sus cursos.
          </p>
        </section>

        {/* Continuar donde lo dejaste */}
        {resume && (
          <div data-reveal className="mt-8 sm:mt-10">
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
          </div>
        )}

        {/* Métricas */}
        <section className="mt-8 sm:mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
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
        </section>

        {/* Empty state: primer uso */}
        {metrics.overall === 0 && !resume && firstModule && (
          <div
            data-reveal
            className="mt-6 rounded-[28px] border border-brand/25 bg-brand/5 p-6 sm:p-8"
          >
            <p className="section-eyebrow text-cream">
              {"{ Empieza por aquí }"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-cream sm:text-2xl">
              Todo listo para tu primer desafío
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Abre el primer módulo de una ruta para empezar con la teoría y tu
              primer desafío guiado.
            </p>
            <button
              type="button"
              className="btn-filled-soft mt-5 !min-h-11"
              onClick={() => onStart(firstModule.key)}
            >
              Empezar {firstModule.name} →
            </button>
          </div>
        )}

        {/* Filtro por ruta */}
        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
          role="group"
          aria-label="Filtrar catálogo por ruta"
        >
          {availableGroups.map((group) => {
            const meta = GROUP_META[group] ?? {
              icon: "📦",
              color: "slate",
              desc: "",
            };
            const row = metrics.routeRows.find((r) => r.group === group);
            const progress = row?.progress ?? 0;
            const active = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => selectGroup(group)}
                aria-pressed={active}
                style={moduleColorStyle(meta.color)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                  active
                    ? "mod-chip-active"
                    : "border-line bg-canvas/40 text-muted hover:text-cream"
                }`}
              >
                <span aria-hidden>{meta.icon}</span>
                <span>{group}</span>
                {active && (
                  <span className="mod-text text-[11px] font-bold">
                    · {progress}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cursos del grupo seleccionado */}
        {selectedRoute && activeMeta && (
          <section className="mt-8">
            <div
              className="flex items-end justify-between gap-3"
              style={moduleColorStyle(activeMeta.color)}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-faint">
                  Cursos en {selectedRoute.group}
                </p>
                <p className="mt-1 text-sm text-muted">{activeMeta.desc}</p>
              </div>
              <span className="mod-text text-sm font-semibold">
                {selectedRoute.progress}%
              </span>
            </div>
            <div
              key={selectedRoute.group}
              className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {selectedRoute.mods.map((mod, i) => (
                <ModuleCard
                  key={mod.key}
                  module={mod}
                  progress={getPercent(mod.key, mod.exercises.length)}
                  index={i}
                  onStart={onStart}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Drawer de rutas (overlay, slide desde la izquierda) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-canvas/85 backdrop-blur-sm"
          aria-label="Cerrar menú de rutas"
          onClick={() => onSidebarOpenChange(false)}
        />

        <aside
          role={sidebarOpen ? "dialog" : undefined}
          aria-modal={sidebarOpen ? "true" : undefined}
          aria-label="Menú de rutas"
          className={`absolute inset-y-0 left-0 flex w-[min(20.5rem,90vw)] flex-col border-r border-line bg-surface-2 shadow-float transition-transform duration-300 ease-out motion-reduce:transition-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3">
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

          <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            {categories.map((cat) => {
              const expanded = openCats[cat.id] ?? false;
              return (
                <div key={cat.id} className="mb-5">
                  <button
                    type="button"
                    onClick={() => toggleCat(cat.id)}
                    className="mb-2 flex w-full items-center justify-between rounded-[16px] px-2 py-1.5 text-left transition-colors hover:bg-elevated/60"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-faint">
                      {cat.label}
                    </span>
                    <span className="text-xs text-muted">
                      {expanded ? "▾" : "▸"}
                    </span>
                  </button>

                  {expanded && (
                    <ul className="relative ml-3 border-l border-line/60 pl-0">
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
                              style={moduleColorStyle(meta.color)}
                              className={`group relative flex w-full items-center gap-3 rounded-[16px] py-2.5 pl-10 pr-2 text-left transition-colors ${
                                active
                                  ? "mod-sidebar-item-active"
                                  : "text-muted hover:bg-elevated/60 hover:text-cream"
                              }`}
                            >
                              {/* Nodo del árbol */}
                              <span
                                className={`absolute left-3.5 top-1/2 z-[1] flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-bold ${
                                  done
                                    ? "bg-brand text-canvas"
                                    : active
                                      ? "bg-sky ring-4 ring-sky/20"
                                      : inProgress
                                        ? "border-2 border-orangey bg-surface-2"
                                        : "border border-line bg-surface-2"
                                }`}
                                aria-hidden
                              >
                                {done ? "✓" : null}
                              </span>
                              {!isLast && (
                                <span
                                  className="absolute left-3.5 top-[calc(50%+0.8rem)] h-[calc(100%-1.6rem)] w-px -translate-x-1/2 bg-line/60"
                                  aria-hidden
                                />
                              )}

                              <span className="min-w-0 flex-1">
                                <span
                                  className={`block truncate text-sm leading-snug ${
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

                            {/* Cursos anidados */}
                            {active && row && (
                              <ul className="relative mb-2 ml-5 border-l border-dashed border-line/70 pb-1">
                                {row.mods.map((mod, mi) => {
                                  const p = getPercent(
                                    mod.key,
                                    mod.exercises.length,
                                  );
                                  const modDone = p >= 100;
                                  const lastMod =
                                    mi === row.mods.length - 1;
                                  return (
                                    <li
                                      key={mod.key}
                                      className="relative"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onStart(mod.key);
                                          onSidebarOpenChange(false);
                                        }}
                                        className="flex w-full items-center gap-2.5 rounded-[16px] py-2 pl-5 pr-2 text-left text-muted transition-colors hover:bg-elevated/60 hover:text-cream"
                                      >
                                        <span
                                          className={`absolute left-1 top-1/2 z-[1] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                                            modDone
                                              ? "bg-brand"
                                              : p > 0
                                                ? "bg-sky"
                                                : "border border-line bg-surface-2"
                                          }`}
                                          aria-hidden
                                        />
                                        {!lastMod && (
                                          <span
                                            className="absolute left-1 top-1/2 h-1/2 w-px -translate-x-1/2 border-l border-dashed border-line/70"
                                            aria-hidden
                                          />
                                        )}
                                        <span className="truncate text-[13px]">
                                          {mod.icon} {mod.name}
                                        </span>
                                        <span className="ml-auto shrink-0 text-[10px] text-muted">
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
    <div className="metric-tile rounded-[24px] border border-line bg-canvas/60 px-4 py-5 text-center">
      <p
        className={`text-2xl font-semibold tracking-tight sm:text-3xl ${
          accent ? "text-brand" : "text-ink"
        }`}
      >
        {animated}
        {suffix}
      </p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-muted">{hint}</p>}
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
      className="relative overflow-hidden rounded-[28px] border mod-border-40 bg-surface p-5 sm:p-6"
    >
      <div className="mod-glow pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="mod-icon-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="mod-text text-[11px] font-bold uppercase tracking-wider">
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
          className="btn-primary shrink-0 self-start !min-h-11 !px-5 !text-sm sm:self-auto"
        >
          Seguir →
        </button>
      </div>
      <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="mod-progress" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
