import { useState } from "react";
import BrandMark from "@/components/brand/BrandMark";

export default function LandingShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="/"
            className="flex items-center"
            aria-label="Mastery Hub — inicio"
          >
            <BrandMark showWordmark className="h-10 w-auto" />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
            <a href="/cursos" className="btn-ghost">
              Cursos
            </a>
            <a href="#rutas" className="btn-ghost">
              Áreas
            </a>
            <a href="#tecnologias" className="btn-ghost">
              Tecnologías
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="btn-ghost hidden sm:inline-flex">
              Login
            </a>
            <a
              href="/cursos"
              className="btn-primary !min-h-10 whitespace-nowrap !px-3 !text-sm sm:!px-4"
              aria-label="Explorar cursos"
            >
              <span className="sm:hidden">Cursos</span>
              <span className="hidden sm:inline">Explorar cursos</span>
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
              <a href="/cursos" className="btn-ghost justify-start">
                Cursos
              </a>
              <a
                href="#rutas"
                className="btn-ghost justify-start"
                onClick={() => setMobileOpen(false)}
              >
                Áreas
              </a>
              <a
                href="#tecnologias"
                className="btn-ghost justify-start"
                onClick={() => setMobileOpen(false)}
              >
                Tecnologías
              </a>
              <a href="/login" className="btn-ghost justify-start">
                Iniciar sesión
              </a>
              <a href="/login?mode=register" className="btn-ghost justify-start">
                Crear cuenta
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
