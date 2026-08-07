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
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({
  onSuccess,
  redirectTo = "/aprender",
}: LoginFormProps) {
  return (
    <AuthProvider>
      <LoginFormInner onSuccess={onSuccess} redirectTo={redirectTo} />
    </AuthProvider>
  );
}

function LoginFormInner({
  onSuccess,
  redirectTo = "/aprender",
}: LoginFormProps) {
  const { user, loading, isDemoMode, signInWithEmail, signInWithGoogle, signUp } =
    useAuth();
  const [mode, setMode] = useState<"login" | "register">(() => {
    // Soporta /login?mode=register para que el landing enlace directo al registro.
    if (typeof window === "undefined") return "login";
    return new URLSearchParams(window.location.search).get("mode") === "register"
      ? "register"
      : "login";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const redirectedRef = useRef(false);

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
    const res = await signInWithGoogle();
    setSubmitting(false);
    if (res.error) setError(res.error);
  }

  return (
    <div className="ui-card w-full p-6 shadow-float animate-fade-in sm:p-8">
      <div className="mb-6">
        <p className="section-eyebrow text-cream">{"{ Auth }"}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {mode === "login"
            ? "Entra para continuar tu práctica."
            : "Crea tu cuenta para empezar a practicar."}
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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="input-field"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={error ? true : undefined}
            disabled={submitting}
          />
        </div>
        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Contraseña
          </label>
          <input
            id="auth-password"
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            aria-invalid={error ? true : undefined}
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className="btn-filled-soft w-full !min-h-11"
          disabled={submitting}
        >
          {submitting
            ? "Un momento…"
            : mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-faint" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          o
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {isDemoMode ? (
        <button
          type="button"
          onClick={handleDemoEntry}
          className="btn-secondary w-full !min-h-11"
          disabled={submitting}
        >
          Entrar en modo demo
        </button>
      ) : (
        <button
          type="button"
          onClick={handleGoogle}
          className="btn-secondary w-full !min-h-11"
          disabled={submitting}
        >
          Continuar con Google
        </button>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setInfo(null);
              }}
              className="font-semibold text-brand hover:text-brand-strong"
            >
              Crear cuenta
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setInfo(null);
              }}
              className="font-semibold text-brand hover:text-brand-strong"
            >
              Iniciar sesión
            </button>
          </>
        )}
      </p>
    </div>
  );
}
