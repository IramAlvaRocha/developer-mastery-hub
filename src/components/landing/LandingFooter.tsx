export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-xl font-semibold text-cream">Mastery Hub</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {"{ Preparación full stack senior — práctica, claridad, progreso }"}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          <a href="/aprender" className="hover:text-cream">
            Catálogo
          </a>
          <a href="#tecnologias" className="hover:text-cream">
            Tecnologías
          </a>
          <a href="#aprender" className="hover:text-cream">
            Rutas
          </a>
        </div>
      </div>
    </footer>
  );
}
