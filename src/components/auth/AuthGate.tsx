// ──────────────────────────────────────────────────────────────────────────
// AuthGate — Fase 2.
// Envuelve contenido protegido. Sin sesión (Supabase) redirige a /login;
// con requireAdmin y role != admin muestra 403. En modo demo deja pasar.
// Fase 8 (M2): no redirige mientras role === null (aún cargando); el 403
// permite "Reintentar" vía refreshProfile ante fallos transitorios de red.
// Fase 8 (M4): en producción sin credenciales muestra "Servicio no
// configurado" en lugar de children (fail-closed, no redirige a /login).
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

interface AuthGateProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGate({
  children,
  requireAdmin = false,
}: AuthGateProps) {
  const { user, role, loading, isDemoMode, refreshProfile } = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || isDemoMode || redirected.current) return;
    // Producción sin credenciales: no hay a dónde redirigir (NotConfigured).
    if (!isDemoMode && !isSupabaseConfigured) return;
    // M2: role aún no resuelto (tras getSession/loadProfile) — no redirigir.
    if (requireAdmin && role === null) return;
    if (!user || (requireAdmin && role !== "admin")) {
      redirected.current = true;
      window.location.assign("/login");
    }
  }, [loading, isDemoMode, user, role, requireAdmin]);

  // M4: producción sin Supabase — fail-closed, nunca mostrar children.
  if (!isDemoMode && !isSupabaseConfigured) return <NotConfigured />;

  if (loading || (!isDemoMode && user && requireAdmin && role === null)) {
    return <GateSkeleton />;
  }

  if (isDemoMode) return <>{children}</>;

  if (!user) return <GateSkeleton />;

  if (requireAdmin && role !== "admin") {
    return <AccessDenied onRetry={() => void refreshProfile()} />;
  }

  return <>{children}</>;
}

function GateSkeleton() {
  return (
    <div
      className="flex h-full min-h-[60vh] w-full items-center justify-center p-6"
      aria-busy="true"
      aria-label="Cargando sesión"
    >
      <div className="w-full max-w-md space-y-4">
        <div className="shimmer-loading h-5 w-40 rounded-full" />
        <div className="shimmer-loading h-4 w-full rounded-full" />
        <div className="shimmer-loading h-4 w-3/4 rounded-full" />
        <div className="shimmer-loading h-11 w-full rounded-[20px]" />
      </div>
    </div>
  );
}

function AccessDenied({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="ui-card w-full max-w-md p-6 text-center shadow-float animate-fade-in sm:p-8">
        <p className="section-eyebrow text-cream">{"{ 403 }"}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Acceso restringido
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Esta sección solo está disponible para administradores. Vuelve al
          catálogo para seguir practicando.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <a href="/aprender" className="btn-filled-soft w-full !min-h-11">
            Ir al catálogo
          </a>
          <button
            type="button"
            onClick={onRetry}
            className="btn-secondary w-full !min-h-11"
          >
            Reintentar
          </button>
        </div>
      </div>
    </main>
  );
}

/** Producción sin credenciales de Supabase (fail-closed, sin redirect). */
function NotConfigured() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="ui-card w-full max-w-md p-6 text-center shadow-float animate-fade-in sm:p-8">
        <p className="section-eyebrow text-cream">{"{ Setup }"}</p>
        <span
          aria-hidden
          className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-butter/15 text-2xl text-butter"
        >
          ⚠
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Servicio no configurado
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Faltan las credenciales de Supabase. Ponte en contacto con el
          administrador de la plataforma.
        </p>
        <a href="/" className="btn-filled-soft mt-6 w-full !min-h-11">
          Ir al inicio
        </a>
      </div>
    </main>
  );
}
