// ──────────────────────────────────────────────────────────────────────────
// AuthGate — Fase 2.
// Envuelve contenido protegido. Sin sesión (Supabase) redirige a /login;
// con requireAdmin y role != admin muestra 403. En modo demo deja pasar.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

interface AuthGateProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGate({
  children,
  requireAdmin = false,
}: AuthGateProps) {
  const { user, role, loading, isDemoMode } = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || isDemoMode || redirected.current) return;
    if (!user || (requireAdmin && role !== "admin")) {
      redirected.current = true;
      window.location.assign("/login");
    }
  }, [loading, isDemoMode, user, role, requireAdmin]);

  if (loading || (!isDemoMode && user && requireAdmin && role === null)) {
    return <GateSkeleton />;
  }

  if (isDemoMode) return <>{children}</>;

  if (!user) return <GateSkeleton />;

  if (requireAdmin && role !== "admin") return <AccessDenied />;

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

function AccessDenied() {
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
        <a href="/aprender" className="btn-filled-soft mt-6 w-full !min-h-11">
          Ir al catálogo
        </a>
      </div>
    </main>
  );
}
