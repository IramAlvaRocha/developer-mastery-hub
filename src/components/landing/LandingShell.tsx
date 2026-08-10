import { useState } from "react";

export default function LandingShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-lg text-brand">
              ◆
            </span>
            <span className="text-lg font-semibold tracking-tight text-cream">
              Mastery Hub
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <a href="#aprender" className="btn-ghost">
              Qué aprender
            </a>
            <a href="#tecnologias" className="btn-ghost">
              Tecnologías
            </a>
            <a href="/aprender" className="btn-ghost">
              Catálogo
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="btn-ghost hidden sm:inline-flex">
              Login
            </a>
            <a
              href="/login?mode=register"
              className="btn-secondary !min-h-10 !px-4 !text-sm"
            >
              Registro
            </a>
            <a href="/aprender" className="btn-primary !min-h-10 !px-4 !text-sm">
              Empezar
            </a>
            <button
              type="button"
              className="icon-btn border border-line md:hidden"
              aria-label="Menú"
              onClick={() => setMobileOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-line px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#aprender"
                className="btn-ghost justify-start"
                onClick={() => setMobileOpen(false)}
              >
                Qué aprender
              </a>
              <a
                href="#tecnologias"
                className="btn-ghost justify-start"
                onClick={() => setMobileOpen(false)}
              >
                Tecnologías
              </a>
              <a href="/aprender" className="btn-ghost justify-start">
                Catálogo
              </a>
              <a href="/login" className="btn-ghost justify-start">
                Login
              </a>
              <a href="/login?mode=register" className="btn-ghost justify-start">
                Registro
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
