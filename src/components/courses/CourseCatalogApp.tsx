import { useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { useCourseCatalog } from "@/lib/useCourseCatalog";
import UserMenu from "@/components/auth/UserMenu";
import BrandMark from "@/components/brand/BrandMark";
import CourseCard from "./CourseCard";

export default function CourseCatalogApp() {
  return (
    <AuthProvider>
      <CourseCatalog />
    </AuthProvider>
  );
}

function CourseCatalog() {
  const { user, loading: authLoading } = useAuth();
  const { courses, loading, error } = useCourseCatalog();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("es");
    if (!needle) return courses;
    return courses.filter((course) =>
      [
        course.name,
        course.description,
        ...course.topics,
        ...course.modules.map((module) => module.name),
      ]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(needle),
    );
  }, [courses, query]);

  return (
    <div className="min-h-full bg-canvas">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 font-semibold text-ink">
            <BrandMark className="h-9 w-9" />
            <span>Mastery Hub</span>
          </a>
          <nav className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <a href="/aprender" className="btn-ghost hidden sm:inline-flex">
                  Mis cursos
                </a>
                <UserMenu />
              </>
            ) : authLoading ? (
              <span className="shimmer-loading h-10 w-24 rounded-full" />
            ) : (
              <a href="/login" className="btn-secondary !min-h-10 !px-4 !text-sm">
                Iniciar sesión
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-16">
        <section className="relative overflow-hidden rounded-[32px] border border-line bg-surface px-5 py-9 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="section-eyebrow text-brand">Explorar cursos</p>
            <h1 className="mt-3 text-[clamp(2.3rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
              Aprende una ruta completa, no temas aislados.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Una suscripción incluye todos los módulos del curso. Avanza a tu
              ritmo y conserva el progreso en cada ejercicio.
            </p>
            <label className="mt-8 block max-w-2xl">
              <span className="sr-only">Buscar cursos</span>
              <span className="relative block">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca AWS, TypeScript, seguridad…"
                  className="input-field !min-h-14 !rounded-[18px] !pl-11 !text-base"
                />
              </span>
            </label>
          </div>
        </section>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow text-cream">Catálogo</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              {query ? `Resultados para “${query}”` : "Todos los cursos"}
            </h2>
          </div>
          <span className="text-sm text-muted">{filtered.length} cursos</span>
        </div>

        {error && (
          <p className="mt-6 rounded-[18px] border border-orangey/30 bg-orangey/10 px-4 py-3 text-sm text-butter">
            Se mostró el catálogo disponible localmente.
          </p>
        )}

        {loading && courses.length === 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="shimmer-loading h-72 rounded-[26px]"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.key} course={course} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-line bg-surface p-10 text-center">
            <p className="text-lg font-semibold text-ink">
              No encontramos ese curso
            </p>
            <p className="mt-2 text-sm text-muted">
              Prueba con una tecnología, ruta o habilidad diferente.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="btn-secondary mt-5"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

