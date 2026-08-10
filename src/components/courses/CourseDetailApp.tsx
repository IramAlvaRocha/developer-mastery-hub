import { useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { useCourseCatalog, useCourseCurriculum } from "@/lib/useCourseCatalog";
import { useEnrollments } from "@/lib/useEnrollments";
import { moduleColorStyle } from "@/lib/moduleColors";
import UserMenu from "@/components/auth/UserMenu";
import BrandMark from "@/components/brand/BrandMark";

export default function CourseDetailApp({ courseKey }: { courseKey: string }) {
  return (
    <AuthProvider>
      <CourseDetail courseKey={courseKey} />
    </AuthProvider>
  );
}

function CourseDetail({ courseKey }: { courseKey: string }) {
  const { user, loading: authLoading } = useAuth();
  const { courses, loading: catalogLoading } = useCourseCatalog();
  const { items, loading: curriculumLoading } =
    useCourseCurriculum(courseKey);
  const {
    enrolledKeys,
    loading: enrollmentLoading,
    enroll,
    unenroll,
  } = useEnrollments();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const course = courses.find((item) => item.key === courseKey);
  const enrolled = enrolledKeys.includes(courseKey);

  const modules = useMemo(() => {
    if (!course) return [];
    return course.modules.map((module) => ({
      ...module,
      items: items.filter((item) => item.moduleKey === module.key),
    }));
  }, [course, items]);

  const firstItem = items[0];
  const learningUrl = firstItem
    ? `/aprender?m=${encodeURIComponent(firstItem.moduleKey)}&e=${firstItem.exerciseRef}`
    : "/aprender";

  async function handlePrimaryAction() {
    if (!user) {
      const next = `/cursos/${courseKey}`;
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (enrolled) {
      window.location.assign(learningUrl);
      return;
    }
    setSubmitting(true);
    setError(null);
    const ok = await enroll(courseKey);
    setSubmitting(false);
    if (!ok) {
      setError("No se pudo completar la inscripción. Inténtalo de nuevo.");
      return;
    }
    window.location.assign(learningUrl);
  }

  async function handleUnenroll() {
    if (
      !window.confirm(
        "¿Quitar este curso de Mis cursos? Tu progreso se conservará.",
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    const ok = await unenroll(courseKey);
    setSubmitting(false);
    if (!ok) {
      setError("No se pudo quitar el curso. Inténtalo de nuevo.");
    }
  }

  if ((catalogLoading && !course) || authLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="ui-card max-w-lg p-8 text-center">
          <p className="section-eyebrow text-cream">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            Curso no encontrado
          </h1>
          <a href="/cursos" className="btn-filled-soft mt-6">
            Explorar cursos
          </a>
        </div>
      </main>
    );
  }

  const busy = submitting || enrollmentLoading;

  return (
    <div className="min-h-full bg-canvas">
      <header className="border-b border-line/80 bg-canvas/90">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 font-semibold text-ink">
            <BrandMark className="h-9 w-9" />
            <span>Mastery Hub</span>
          </a>
          <a href="/cursos" className="btn-ghost ml-auto hidden sm:inline-flex">
            Explorar
          </a>
          {user ? (
            <UserMenu />
          ) : (
            <a href="/login" className="btn-secondary !min-h-10 !px-4 !text-sm">
              Iniciar sesión
            </a>
          )}
        </div>
      </header>

      <main style={moduleColorStyle(course.color)}>
        <section className="relative overflow-hidden border-b border-line bg-surface-2">
          <div className="mod-glow pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full blur-3xl" />
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="relative">
              <a href="/cursos" className="text-sm font-semibold mod-text">
                ← Todos los cursos
              </a>
              <div className="mt-7 flex items-center gap-3">
                <span className="mod-icon-bg flex h-16 w-16 items-center justify-center rounded-[22px] font-mono text-xl font-bold mod-text">
                  {course.icon}
                </span>
                <span className="mod-badge rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  Curso completo
                </span>
              </div>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5.3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-ink">
                {course.name}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-xl">
                {course.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                <span>{course.modules.length} módulos</span>
                <span>{items.length || course.exerciseCount} ejercicios</span>
                <span>Progreso sincronizado</span>
              </div>
            </div>

            <aside className="relative rounded-[28px] border mod-border-40 bg-canvas/90 p-5 shadow-float sm:p-6">
              <p className="text-sm font-bold uppercase tracking-wider mod-text">
                Incluido en tu inscripción
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <li>✓ Acceso a todos los módulos del curso</li>
                <li>✓ Ejercicios interactivos y soluciones</li>
                <li>✓ Progreso guardado entre sesiones</li>
                <li>✓ Nuevos temas añadidos al curso</li>
              </ul>
              {error && (
                <p className="mt-4 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => void handlePrimaryAction()}
                disabled={busy}
                className="btn-filled-soft mt-6 w-full"
              >
                {busy
                  ? "Un momento…"
                  : enrolled
                    ? "Continuar curso →"
                    : user
                      ? "Inscribirme al curso"
                      : "Iniciar sesión para inscribirme"}
              </button>
              {enrolled && (
                <button
                  type="button"
                  onClick={() => void handleUnenroll()}
                  disabled={busy}
                  className="btn-ghost mt-2 w-full text-xs"
                >
                  Quitar de Mis cursos
                </button>
              )}
              <p className="mt-3 text-center text-xs text-faint">
                Una inscripción incluye todo el temario.
              </p>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="section-eyebrow text-cream">Temario</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Lo que vas a recorrer
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              El curso está organizado en módulos. Completa los ejercicios en
              orden o retoma exactamente donde te quedaste.
            </p>

            <div className="mt-8 space-y-3">
              {curriculumLoading && modules.every((module) => !module.items.length)
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="shimmer-loading h-20 rounded-[22px]"
                    />
                  ))
                : modules.map((module, index) => (
                    <details
                      key={module.key}
                      className="group rounded-[22px] border border-line bg-surface"
                      open={index === 0}
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                        <span className="mod-icon-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-base">
                          {module.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-ink">
                            {index + 1}. {module.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {module.items.length} ejercicios
                          </span>
                        </span>
                        <span className="text-muted transition-transform group-open:rotate-180">
                          ↓
                        </span>
                      </summary>
                      <ol className="border-t border-line-soft px-5 py-3">
                        {module.items.map((item, itemIndex) => (
                          <li
                            key={`${item.moduleKey}-${item.exerciseRef}`}
                            className="flex items-start gap-3 border-b border-line-soft py-3 last:border-0"
                          >
                            <span className="mt-0.5 font-mono text-xs text-faint">
                              {String(itemIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm leading-relaxed text-muted">
                              {item.title}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </details>
                  ))}
            </div>
          </div>

          <aside>
            <p className="section-eyebrow text-cream">Aprenderás</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted"
                >
                  {topic}
                </span>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <main className="mx-auto min-h-screen max-w-[1280px] px-4 py-16 sm:px-6">
      <div className="shimmer-loading h-5 w-32 rounded-full" />
      <div className="shimmer-loading mt-8 h-16 w-3/4 rounded-[24px]" />
      <div className="shimmer-loading mt-5 h-6 w-1/2 rounded-full" />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        <div className="shimmer-loading h-72 rounded-[28px] lg:col-span-2" />
        <div className="shimmer-loading h-72 rounded-[28px]" />
      </div>
    </main>
  );
}

