import { useMemo } from "react";
import { buildCourses, courseKeyForModule } from "@/lib/courseCatalog";
import type { Module } from "@/lib/types";
import type { LastVisited } from "@/lib/useProgress";
import { moduleColorStyle } from "@/lib/moduleColors";
import CourseCard from "@/components/courses/CourseCard";
import BrandMark from "@/components/brand/BrandMark";

interface Props {
  modules: Module[];
  enrolledKeys: string[];
  lastVisited: LastVisited | null;
  lastOpenedAt: Record<string, string>;
  getPercent: (moduleKey: string, total: number) => number;
  onResume: (moduleKey: string, index: number) => void;
  loading: boolean;
}

export default function LearningDashboard({
  modules,
  enrolledKeys,
  lastVisited,
  lastOpenedAt,
  getPercent,
  onResume,
  loading,
}: Props) {
  const enrolledSet = useMemo(() => new Set(enrolledKeys), [enrolledKeys]);
  const courses = useMemo(
    () =>
      buildCourses(modules)
        .filter((course) => enrolledSet.has(course.key))
        .sort((a, b) =>
          (lastOpenedAt[b.key] ?? "").localeCompare(lastOpenedAt[a.key] ?? ""),
        ),
    [modules, enrolledSet, lastOpenedAt],
  );

  const courseProgress = useMemo(() => {
    const result: Record<string, number> = {};
    for (const course of courses) {
      const total = course.modules.reduce(
        (sum, module) => sum + module.exercises.length,
        0,
      );
      const completed = course.modules.reduce((sum, module) => {
        const percent = getPercent(module.key, module.exercises.length);
        return sum + Math.round((percent / 100) * module.exercises.length);
      }, 0);
      result[course.key] = total ? Math.round((completed / total) * 100) : 0;
    }
    return result;
  }, [courses, getPercent]);

  const overall = useMemo(() => {
    const total = courses.reduce(
      (sum, course) => sum + course.exerciseCount,
      0,
    );
    if (!total) return 0;
    const completed = courses.reduce(
      (sum, course) =>
        sum + Math.round(((courseProgress[course.key] ?? 0) / 100) * course.exerciseCount),
      0,
    );
    return Math.round((completed / total) * 100);
  }, [courses, courseProgress]);

  const resume = useMemo(() => {
    if (!lastVisited) return null;
    const module = modules.find((item) => item.key === lastVisited.key);
    if (!module || !enrolledSet.has(courseKeyForModule(module))) return null;
    const index = Math.min(lastVisited.index, module.exercises.length - 1);
    const exercise = module.exercises[index];
    const course = courses.find(
      (item) => item.key === courseKeyForModule(module),
    );
    if (!exercise || !course) return null;
    return { module, exercise, index, course };
  }, [lastVisited, modules, enrolledSet, courses]);

  if (loading && courses.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow text-brand">Mi aprendizaje</p>
            <h1 className="mt-2 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
              Mis cursos
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Retoma tu última práctica o elige uno de los cursos en los que
              estás inscrito.
            </p>
          </div>
          <a href="/cursos" className="btn-secondary shrink-0">
            Explorar cursos
          </a>
        </section>

        {courses.length === 0 ? (
          <section className="mt-10 overflow-hidden rounded-[30px] border border-line bg-surface p-8 text-center sm:p-14">
            <BrandMark className="mx-auto h-16 w-16" />
            <h2 className="mt-6 text-2xl font-semibold text-ink">
              Aún no tienes cursos
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted">
              Explora el catálogo e inscríbete una sola vez para acceder a todos
              los módulos de una ruta.
            </p>
            <a href="/cursos" className="btn-filled-soft mt-7">
              Explorar catálogo
            </a>
          </section>
        ) : (
          <>
            <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.7fr)]">
              {resume ? (
                <div
                  style={moduleColorStyle(resume.course.color)}
                  className="relative overflow-hidden rounded-[30px] border mod-border-40 bg-surface p-6 sm:p-8"
                >
                  <div className="mod-glow pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full blur-3xl" />
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] mod-text">
                      Continúa donde te quedaste
                    </p>
                    <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {resume.exercise.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      {resume.course.name} · {resume.module.name}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        onResume(resume.module.key, resume.index)
                      }
                      className="btn-filled-soft mt-7"
                    >
                      Continuar práctica →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[30px] border border-line bg-surface p-6 sm:p-8">
                  <p className="section-eyebrow text-cream">Siguiente paso</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink">
                    Elige un curso para comenzar
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Tu actividad reciente aparecerá aquí.
                  </p>
                </div>
              )}

              <div className="rounded-[30px] border border-line bg-surface p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  Progreso total
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-brand">
                  {overall}%
                </p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-700"
                    style={{ width: `${overall}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-muted">
                  {courses.length} {courses.length === 1 ? "curso" : "cursos"}{" "}
                  inscritos
                </p>
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="section-eyebrow text-cream">Biblioteca</p>
                  <h2 className="mt-1 text-2xl font-semibold text-ink">
                    Tus cursos
                  </h2>
                </div>
                <span className="text-sm text-muted">{courses.length}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.key}
                    course={course}
                    progress={courseProgress[course.key] ?? 0}
                    recentLabel={
                      lastOpenedAt[course.key] ? "Actividad reciente" : undefined
                    }
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto" aria-busy="true">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="shimmer-loading h-5 w-32 rounded-full" />
        <div className="shimmer-loading mt-4 h-14 w-72 rounded-[20px]" />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="shimmer-loading h-64 rounded-[30px] lg:col-span-2" />
          <div className="shimmer-loading h-64 rounded-[30px]" />
        </div>
      </div>
    </main>
  );
}

