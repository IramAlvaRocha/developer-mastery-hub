import BrandMark from "@/components/brand/BrandMark";

export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:grid-cols-[1fr_auto] sm:px-6">
        <div>
          <a href="/" aria-label="Mastery Hub — inicio">
            <BrandMark showWordmark className="h-10 w-auto" />
          </a>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Cursos y ejercicios para convertir conceptos de desarrollo en
            habilidades que puedes aplicar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted">
          <a href="/cursos" className="hover:text-cream">Cursos</a>
          <a href="/login" className="hover:text-cream">Iniciar sesión</a>
          <a href="#rutas" className="hover:text-cream">Áreas</a>
          <a href="/login?mode=register" className="hover:text-cream">Crear cuenta</a>
          <a href="#tecnologias" className="hover:text-cream">Tecnologías</a>
          <a href="/aprender" className="hover:text-cream">Mis cursos</a>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 border-t border-line-soft px-4 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} Developer Mastery Hub</span>
        <span>Aprende con intención. Practica con contexto.</span>
      </div>
    </footer>
  );
}
