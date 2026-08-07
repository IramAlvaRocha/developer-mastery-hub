import { useMemo } from "react";
import type { Module } from "@/lib/types";
import type { LastVisited } from "@/lib/useProgress";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth } from "@/lib/useReducedMotion";
import ModuleCard from "./ModuleCard";

interface Props {
  modules: Module[];
  enrolledKeys: string[];
  lastVisited?: LastVisited | null;
  lastOpenedAt?: Record<string, string>;
  getPercent: (key: string, total: number) => number;
  onStart: (key: string) => void;
  onResume: (key: string, index: number) => void;
  onExploreCatalog: () => void;
  onUnenroll?: (key: string) => void;
  loading?: boolean;
}

export default function MyCourses({
  modules,
  enrolledKeys,
  lastVisited,
  lastOpenedAt,
  getPercent,
  onStart,
  onResume,
  onExploreCatalog,
  onUnenroll,
  loading,
}: Props) {
  // Solo los módulos suscritos, ordenados por last_opened_at DESC
  // (los que nunca se abrieron quedan al final, en su posición del catálogo).
  const enrolledModules = useMemo(() => {
    const set = new Set(enrolledKeys);
    const list = modules.filter((m) => set.has(m.key));
    return [...list].sort((a, b) => {
      const ta = lastOpenedAt?.[a.key] ?? "";
      const tb = lastOpenedAt?.[b.key] ?? "";
      if (ta && tb) return tb.localeCompare(ta);
      if (ta) return -1;
      if (tb) return 1;
      return 0;
    });
  }, [modules, enrolledKeys, lastOpenedAt]);

  const resume = useMemo(() => {
    if (!lastVisited) return null;
    const set = new Set(enrolledKeys);
    const mod = modules.find((m) => m.key === lastVisited.key);
    if (!mod || !set.has(mod.key)) return null;
    const percent = getPercent(mod.key, mod.exercises.length);
    if (percent >= 100) return null;
    const index = Math.min(lastVisited.index, mod.exercises.length - 1);
    const ex = mod.exercises[index];
    if (!ex) return null;
    return { mod, index, ex, percent };
  }, [lastVisited, modules, enrolledKeys, getPercent]);

  if (loading && enrolledModules.length === 0) {
    return (
      <div
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Cargando tus cursos"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shimmer-loading h-44 rounded-[28px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <section>
        <p className="section-eyebrow text-cream">{"{ Mis Cursos }"}</p>
        <h1 className="mt-2 text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-[1.05] tracking-tight text-cream">
          Tus cursos
        </h1>
        <p className="mt-3 max-w-2xl text-[clamp(1rem,2vw,1.1rem)] leading-relaxed text-muted">
          Los módulos a los que te suscribiste. Solo estos guardan tu progreso
          en la nube.
        </p>
      </section>

      {resume && (
        <div className="mt-8">
          <MyCoursesResume
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

      {enrolledModules.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-line bg-surface p-8 text-center sm:p-12">
          <span className="text-3xl" aria-hidden>
            🎓
          </span>
          <p className="section-eyebrow mt-4 text-cream">
            {"{ Aún no suscrito }"}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
            No tienes cursos suscritos
          </h2>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            Explora el catálogo y suscríbete a los cursos que quieras practicar.
            Solo los cursos suscritos guardan tu progreso en la nube.
          </p>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="btn-filled-soft mt-6 !min-h-11"
          >
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {enrolledModules.map((mod, i) => (
            <ModuleCard
              key={mod.key}
              module={mod}
              progress={getPercent(mod.key, mod.exercises.length)}
              index={i}
              onStart={onStart}
              showEnroll
              enrolled
              onUnenroll={onUnenroll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MyCoursesResume({
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
          type="button"
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
