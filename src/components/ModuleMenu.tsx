import { useMemo, useState } from "react";
import type { Module } from "@/lib/types";
import type { LastVisited } from "@/lib/useProgress";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth, useCountUp } from "@/lib/useReducedMotion";
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
}

type StatusFilter = "all" | "progress" | "new" | "done";

/** Metadatos visuales por categoria principal (con fallback al primer modulo). */
const GROUP_META: Record<string, { icon: string; color: string; desc: string }> =
  {
    "Buenas Practicas": {
      icon: "🏆",
      color: "purple",
      desc: "Patrones senior de .NET (backend) y React (frontend), en orden de construcción.",
    },
    Frontend: {
      icon: "⚡",
      color: "emerald",
      desc: "Ecosistema Vue: Composition API, Pinia, Nuxt y Vuetify.",
    },
    "Backend & Datos": {
      icon: "🟢",
      color: "lime",
      desc: "APIs REST con Node.js y bases de datos con SQL Server.",
    },
    "Cloud & Serverless": {
      icon: "☁️",
      color: "blue",
      desc: "Google Cloud Platform y Firebase: funciones, IAM y servicios gestionados.",
    },
    "DevOps & Git": {
      icon: "🐳",
      color: "sky",
      desc: "Git, Git Flow, monorepos, Docker, Kubernetes y CI/CD.",
    },
    "APIs & Seguridad": {
      icon: "🔑",
      color: "rose",
      desc: "Axios/Fetch, OAuth2, JWT, CORS, CSP y defensa XSS.",
    },
    "Testing & Calidad": {
      icon: "🧪",
      color: "amber",
      desc: "Vitest, E2E (Cypress/Playwright), ESLint, SonarQube y coverage.",
    },
    TypeScript: {
      icon: "💙",
      color: "indigo",
      desc: "Primitivos, interfaces, types, funciones, generics, enums y utility types.",
    },
    "TS Arrays": {
      icon: "🔄",
      color: "cyan",
      desc: "Dominio de map, filter, reduce, find, some/every, sort y extras.",
    },
  };

/** Nombre estable para la View Transition compartida (tarjeta -> encabezado). */
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
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  /** Estado de avance de un módulo: sin empezar / en curso / completado. */
  function moduleStatus(m: Module): Exclude<StatusFilter, "all"> {
    const p = getPercent(m.key, m.exercises.length);
    if (p >= 100) return "done";
    if (p > 0) return "progress";
    return "new";
  }

  // Módulo a reanudar: el último visitado que aún no esté al 100%.
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

  const filtered = useMemo(() => {
    if (!q) return modules;
    return modules.filter((m) =>
      [m.name, m.desc, m.group, ...m.topics, ...m.exercises.map((e) => e.title)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [modules, q]);

  const stats = useMemo(() => {
    const totalExercises = modules.reduce(
      (s, m) => s + m.exercises.length,
      0,
    );
    const weighted = modules.reduce(
      (s, m) => s + getPercent(m.key, m.exercises.length) * m.exercises.length,
      0,
    );
    const overall = totalExercises
      ? Math.round(weighted / totalExercises)
      : 0;
    return {
      totalModules: modules.length,
      totalExercises,
      overall,
      totalGroups: groups.length,
    };
  }, [modules, getPercent, groups.length]);

  function groupProgress(mods: Module[]) {
    const total = mods.reduce((s, m) => s + m.exercises.length, 0);
    if (!total) return 0;
    const weighted = mods.reduce(
      (s, m) => s + getPercent(m.key, m.exercises.length) * m.exercises.length,
      0,
    );
    return Math.round(weighted / total);
  }

  function openGroup(group: string) {
    runViewTransition(() => setSelectedGroup(group));
  }

  function backToGroups() {
    runViewTransition(() => setSelectedGroup(null));
  }

  // Modulos a mostrar segun el estado de navegacion.
  const baseModules = searching
    ? filtered
    : selectedGroup
      ? modules.filter((m) => (m.group || "Otros") === selectedGroup)
      : [];
  const visibleModules =
    status === "all"
      ? baseModules
      : baseModules.filter((m) => moduleStatus(m) === status);

  const showGroupGrid = !searching && !selectedGroup;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-y-auto px-4 py-8 md:px-8">
      {/* Hero */}
      <div className="animate-fade-in space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
          Full Stack Senior · .NET + React
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Ruta de Especialización
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted">
          Elige una categoría para ver sus módulos. Buenas prácticas de .NET
          (backend) y React (frontend), más TypeScript, testing, seguridad,
          calidad y DevOps.
        </p>
      </div>

      {/* Continuar donde lo dejaste */}
      {resume && showGroupGrid && (
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

      {/* Stats */}
      <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-4 gap-3">
        <Stat value={stats.totalGroups} label="Categorías" />
        <Stat value={stats.totalModules} label="Módulos" />
        <Stat value={stats.totalExercises} label="Ejercicios" />
        <Stat value={stats.overall} suffix="%" label="Progreso" accent />
      </div>

      {/* Buscador */}
      <div className="mx-auto mt-6 w-full max-w-3xl">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar módulo, tema o ejercicio…"
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* ── Nivel 1: Categorías principales ── */}
      {showGroupGrid && (
        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => {
            const groupModules = modules.filter(
              (m) => (m.group || "Otros") === group,
            );
            if (groupModules.length === 0) return null;
            const exercises = groupModules.reduce(
              (sum, m) => sum + m.exercises.length,
              0,
            );
            return (
              <GroupCard
                key={group}
                index={i}
                group={group}
                moduleCount={groupModules.length}
                exerciseCount={exercises}
                progress={groupProgress(groupModules)}
                onSelect={() => openGroup(group)}
              />
            );
          })}
        </div>
      )}

      {/* ── Nivel 2: Subcategorías (módulos del grupo) o resultados de búsqueda ── */}
      {!showGroupGrid && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            {!searching && (
              <button
                onClick={backToGroups}
                className="btn-secondary shrink-0"
              >
                ← Categorías
              </button>
            )}
            <h3
              className="text-sm font-bold tracking-tight text-ink"
              style={
                !searching && selectedGroup
                  ? { viewTransitionName: groupVtName(selectedGroup) }
                  : undefined
              }
            >
              {searching ? `Resultados para “${query}”` : selectedGroup}
            </h3>
            <div className="h-px flex-1 bg-line"></div>
            <span className="shrink-0 text-[11px] font-semibold text-faint">
              {visibleModules.length} módulos
            </span>
          </div>

          {/* Filtros por estado de avance */}
          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            <StatusChip active={status === "all"} onClick={() => setStatus("all")}>
              Todos
            </StatusChip>
            <StatusChip
              active={status === "progress"}
              onClick={() => setStatus("progress")}
            >
              ▸ En curso
            </StatusChip>
            <StatusChip active={status === "new"} onClick={() => setStatus("new")}>
              ○ Sin empezar
            </StatusChip>
            <StatusChip
              active={status === "done"}
              onClick={() => setStatus("done")}
            >
              ✓ Completados
            </StatusChip>
          </div>

          {visibleModules.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleModules.map((mod, i) => (
                <ModuleCard
                  key={mod.key}
                  index={i}
                  module={mod}
                  progress={getPercent(mod.key, mod.exercises.length)}
                  onStart={onStart}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted">
              {searching ? (
                <>
                  No hay módulos que coincidan con{" "}
                  <span className="font-semibold text-ink">“{query}”</span>.
                </>
              ) : status !== "all" ? (
                <>
                  No hay módulos en este estado.{" "}
                  <button
                    onClick={() => setStatus("all")}
                    className="font-semibold text-brand hover:text-brand-strong"
                  >
                    Ver todos
                  </button>
                </>
              ) : (
                "No hay módulos disponibles."
              )}
            </div>
          )}
        </div>
      )}

      <div className="pb-10"></div>
    </main>
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
    <div className="animate-fade-in mx-auto mt-6 w-full max-w-3xl">
      <div
        style={moduleColorStyle(color)}
        className="group relative overflow-hidden rounded-card border mod-border-40 bg-surface p-4 sm:p-5"
      >
        <div className="mod-glow pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="mod-icon-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-2xl">
              {icon}
            </span>
            <div className="min-w-0">
              <p className="mod-text text-[10px] font-bold uppercase tracking-wider">
                ▸ Continúa donde lo dejaste
              </p>
              <h3 className="mt-0.5 truncate text-[15px] font-bold tracking-tight text-ink">
                {exerciseTitle}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted">
                {moduleName} · {stepLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onResume}
            className="btn-primary shrink-0 self-start sm:self-auto"
          >
            Continuar →
          </button>
        </div>
        <div className="relative mt-4">
          <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
            <span className="text-muted">{total} ejercicios</span>
            <span className="mod-text">{percent}% completado</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="mod-progress" style={{ width: `${width}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({
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
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
        active
          ? "border-brand/40 bg-brand/10 text-brand"
          : "border-line bg-surface text-muted hover:border-brand/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function GroupCard({
  index,
  group,
  moduleCount,
  exerciseCount,
  progress,
  onSelect,
}: {
  index: number;
  group: string;
  moduleCount: number;
  exerciseCount: number;
  progress: number;
  onSelect: () => void;
}) {
  const meta = GROUP_META[group] ?? { icon: "📦", color: "slate", desc: "" };
  const c = meta.color;
  const done = progress >= 100;
  const width = useAnimatedWidth(progress);
  return (
    <button
      onClick={onSelect}
      style={
        {
          "--i": index,
          viewTransitionName: groupVtName(group),
          ...moduleColorStyle(c),
        } as React.CSSProperties
      }
      className={`animate-stagger group mod-card-hover flex h-full flex-col justify-between gap-4 rounded-card border bg-surface p-5 text-left motion-safe-transition motion-safe-lift transition-all hover:-translate-y-0.5 ${
        done
          ? "border-emerald-500/40 hover:border-emerald-500/60"
          : "border-line"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="mod-icon-bg flex h-11 w-11 items-center justify-center rounded-[12px] text-2xl">
            {meta.icon}
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              ✓ Completado
            </span>
          ) : (
            <span className="mod-badge rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
              {moduleCount} módulos
            </span>
          )}
        </div>
        <h3 className="mod-title-hover mt-3 text-base font-bold tracking-tight text-ink transition-colors">
          {group}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{meta.desc}</p>
      </div>
      <div className="border-t border-line-soft pt-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
          <span className="text-muted">{exerciseCount} ejercicios</span>
          <span className={progress > 0 ? "mod-text" : "text-faint"}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="mod-progress" style={{ width: `${width}%` }}></div>
        </div>
      </div>
    </button>
  );
}

function Stat({
  value,
  suffix,
  label,
  accent,
}: {
  value: number;
  suffix?: string;
  label: string;
  accent?: boolean;
}) {
  const animated = useCountUp(value);
  return (
    <div className="ui-card flex flex-col items-center justify-center py-3">
      <span
        className={`text-xl font-bold ${accent ? "text-brand" : "text-ink"}`}
      >
        {animated}
        {suffix}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-faint">
        {label}
      </span>
    </div>
  );
}
