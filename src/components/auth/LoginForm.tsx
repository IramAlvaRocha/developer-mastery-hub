// ──────────────────────────────────────────────────────────────────────────
// LoginForm — Fase 2. Accesible (labels + aria + foco), tokens de DESIGN.md.
// Modos: Iniciar sesión / Crear cuenta. En modo Supabase muestra el botón de
// Google; en modo demo muestra "Entrar en modo demo" y un aviso.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  initialMode?: "login" | "register";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({
  onSuccess,
  redirectTo = "/aprender",
  initialMode = "login",
}: LoginFormProps) {
  return (
    <AuthProvider>
      <LoginFormInner
        onSuccess={onSuccess}
        redirectTo={redirectTo}
        initialMode={initialMode}
      />
    </AuthProvider>
  );
}

function LoginFormInner({
  onSuccess,
  redirectTo = "/aprender",
  initialMode = "login",
}: LoginFormProps) {
  const { user, loading, isDemoMode, signInWithEmail, signInWithGoogle, signUp } =
    useAuth();
  const mode = initialMode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const redirectedRef = useRef(false);
  const nextQuery =
    redirectTo !== "/aprender"
      ? `&next=${encodeURIComponent(redirectTo)}`
      : "";
  const loginHref =
    redirectTo !== "/aprender"
      ? `/login?next=${encodeURIComponent(redirectTo)}`
      : "/login";
  const registerHref = `/login?mode=register${nextQuery}`;

  // Si ya hay sesión (o acaba de iniciarse), el padre decide el redirect.
  useEffect(() => {
    if (redirectedRef.current) return;
    if (loading) return;
    if (user) {
      redirectedRef.current = true;
      if (onSuccess) onSuccess();
      else window.location.assign(redirectTo);
    }
  }, [loading, user, onSuccess, redirectTo]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const emailClean = email.trim();
    if (!EMAIL_RE.test(emailClean)) {
      setError("Introduce un email válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    try {
      const res =
        mode === "register"
          ? await signUp(emailClean, password)
          : await signInWithEmail(emailClean, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.message) {
        setInfo(res.message);
        return;
      }
      // El redirect lo dispara el efecto que observa `user`.
    } finally {
      setSubmitting(false);
    }
  }

  function handleDemoEntry() {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const emailClean = email.trim() || "demo@developer-mastery-hub.local";
    void signInWithEmail(emailClean, "demo").then((res) => {
      setSubmitting(false);
      if (res.error) setError(res.error);
    });
  }

  async function handleGoogle() {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const res = await signInWithGoogle(redirectTo);
    setSubmitting(false);
    if (res.error) setError(res.error);
  }

  return (
    <div className="w-full animate-fade-in rounded-[30px] border border-line bg-surface p-5 shadow-float sm:p-8">
      <div
        className="mb-8 grid grid-cols-2 rounded-full border border-line-soft bg-canvas p-1"
        role="tablist"
        aria-label="Tipo de acceso"
      >
        <a
          href={loginHref}
          role="tab"
          aria-selected={mode === "login"}
          className={`flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition ${
            mode === "login"
              ? "bg-cream text-canvas shadow-sm"
              : "text-muted hover:text-cream"
          }`}
        >
          Iniciar sesión
        </a>
        <a
          href={registerHref}
          role="tab"
          aria-selected={mode === "register"}
          className={`flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition ${
            mode === "register"
              ? "bg-cream text-canvas shadow-sm"
              : "text-muted hover:text-cream"
          }`}
        >
          Crear cuenta
        </a>
      </div>

      <div className="mb-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          {mode === "login" ? "Qué bueno verte de nuevo" : "Empieza tu recorrido"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">
          {mode === "login" ? "Continúa aprendiendo" : "Crea tu espacio"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {mode === "login"
            ? "Tu progreso y tus cursos están esperándote."
            : "Explora gratis, inscríbete en cursos y guarda cada avance."}
        </p>
      </div>

      {isDemoMode && (
        <p
          role="status"
          className="mb-4 rounded-[20px] border border-lilac/30 bg-lilac/10 px-4 py-3 text-[13px] font-medium text-lilac"
        >
          Modo demo — sin credenciales configuradas. El acceso se guarda en este
          navegador.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-[20px] border border-danger/40 bg-danger/10 px-4 py-3 text-[13px] font-medium text-danger"
        >
          {error}
        </p>
      )}
      {info && (
        <p
          role="status"
          className="mb-4 rounded-[20px] border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] font-medium text-brand"
        >
          {info}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="auth-email"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="input-field !min-h-14 !rounded-[18px]"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={error ? true : undefined}
            disabled={submitting}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="auth-password"
              className="block text-sm font-semibold text-ink"
            >
              Contraseña
            </label>
            {mode === "register" && (
              <span className="text-xs text-faint">Mínimo 6 caracteres</span>
            )}
          </div>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              className="input-field !min-h-14 !rounded-[18px] !pr-20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              aria-invalid={error ? true : undefined}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted transition hover:text-cream"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="btn-filled-soft w-full !min-h-14"
          disabled={submitting}
        >
          {submitting
            ? "Un momento…"
            : mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-faint" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          o continúa con
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {isDemoMode ? (
        <button
          type="button"
          onClick={handleDemoEntry}
          className="btn-secondary w-full !min-h-14"
          disabled={submitting}
        >
          Entrar en modo demo
        </button>
      ) : (
        <button
          type="button"
          onClick={handleGoogle}
          className="btn-secondary w-full !min-h-14"
          disabled={submitting}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.39 13.9A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.59Z" />
            <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.82 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z" />
          </svg>
          Continuar con Google
        </button>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            ¿Primera vez aquí?{" "}
            <a
              href={registerHref}
              className="font-semibold text-brand hover:text-brand-strong"
            >
              Crea tu cuenta gratis
            </a>
          </>
        ) : (
          <>
            ¿Ya formas parte?{" "}
            <a
              href={loginHref}
              className="font-semibold text-brand hover:text-brand-strong"
            >
              Iniciar sesión
            </a>
          </>
        )}
      </p>
    </div>
  );
}
