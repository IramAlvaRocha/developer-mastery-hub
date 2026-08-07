// ──────────────────────────────────────────────────────────────────────────
// UserMenu — Fase 2. Avatar + nombre/email + cerrar sesión. Badge "demo" en
// modo demo. Cierra con Escape o clic fuera; devuelve el foco al botón.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function UserMenu() {
  const { user, role, isDemoMode, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = user ? (user.displayName ?? user.email ?? "?") : "Sin sesión";
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2.5 transition-colors hover:border-brand/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de usuario"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-elevated text-xs font-bold text-lilac">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
        {user && (
          <span className="hidden max-w-[110px] truncate text-sm text-cream sm:block">
            {name}
          </span>
        )}
        {isDemoMode && (
          <span className="pill-chip bg-lilac/15 text-lilac">demo</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-[24px] border border-line bg-surface p-2 shadow-float animate-fade-in"
        >
          {user ? (
            <>
              <div className="px-3 pb-2 pt-2">
                <p className="truncate text-sm font-semibold text-cream">{name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {isDemoMode && (
                    <span className="pill-chip bg-lilac/15 text-lilac">
                      modo demo
                    </span>
                  )}
                  <span className="pill-chip bg-brand/10 text-brand">
                    {role === "admin" ? "admin" : "estudiante"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="w-full rounded-full px-3 py-2 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="px-3 py-2">
              <p className="text-sm text-muted">Sin sesión.</p>
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-secondary mt-2 w-full !min-h-10 !px-3 !text-sm"
              >
                Iniciar sesión
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
