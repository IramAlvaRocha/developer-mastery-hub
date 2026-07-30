import { useEffect, useState } from "react";
import {
  clearAuthProfile,
  readAuthProfile,
  saveAuthProfile,
  type AuthProfile,
} from "@/lib/authStub";

type Modal = "none" | "login" | "register" | "profile" | "settings";

export default function LandingShell() {
  const [modal, setModal] = useState<Modal>("none");
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setProfile(readAuthProfile());
  }, []);

  function handleLogin(email: string, name?: string) {
    const next: AuthProfile = {
      email,
      name: name?.trim() || email.split("@")[0] || "Dev",
      avatarDataUrl: profile?.avatarDataUrl,
    };
    saveAuthProfile(next);
    setProfile(next);
    setModal("none");
  }

  function handleLogout() {
    clearAuthProfile();
    setProfile(null);
    setModal("none");
  }

  function handleAvatar(file: File | null) {
    if (!file || !profile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...profile, avatarDataUrl: String(reader.result) };
      saveAuthProfile(next);
      setProfile(next);
    };
    reader.readAsDataURL(file);
  }

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
            {profile ? (
              <>
                <button
                  type="button"
                  onClick={() => setModal("profile")}
                  className="hidden items-center gap-2 rounded-full border border-line py-1 pr-3 pl-1 sm:inline-flex"
                >
                  <Avatar profile={profile} />
                  <span className="max-w-[100px] truncate text-sm text-cream">
                    {profile.name}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModal("settings")}
                  className="icon-btn border border-line"
                  aria-label="Settings"
                >
                  ⚙️
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setModal("login")}
                  className="hidden btn-ghost sm:inline-flex"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setModal("register")}
                  className="btn-secondary !min-h-10 !px-4 !text-sm"
                >
                  Registro
                </button>
              </>
            )}
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
              <a href="#aprender" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>
                Qué aprender
              </a>
              <a href="#tecnologias" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>
                Tecnologías
              </a>
              <a href="/aprender" className="btn-ghost justify-start">
                Catálogo
              </a>
              {!profile && (
                <button type="button" className="btn-ghost justify-start" onClick={() => { setModal("login"); setMobileOpen(false); }}>
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {modal === "login" && (
        <AuthModal title="Login" onClose={() => setModal("none")}>
          <AuthForm
            submitLabel="Entrar"
            onSubmit={(email, name) => handleLogin(email, name)}
            showName={false}
          />
          <p className="mt-3 text-center text-xs text-muted">
            UI lista — auth real llega después.{" "}
            <button type="button" className="text-brand" onClick={() => setModal("register")}>
              Crear cuenta
            </button>
          </p>
        </AuthModal>
      )}

      {modal === "register" && (
        <AuthModal title="Registro" onClose={() => setModal("none")}>
          <AuthForm
            submitLabel="Crear cuenta"
            onSubmit={(email, name) => handleLogin(email, name)}
            showName
          />
          <p className="mt-3 text-center text-xs text-muted">
            Demo local en este navegador.{" "}
            <button type="button" className="text-brand" onClick={() => setModal("login")}>
              Ya tengo cuenta
            </button>
          </p>
        </AuthModal>
      )}

      {modal === "profile" && profile && (
        <AuthModal title="Perfil" onClose={() => setModal("none")}>
          <div className="flex flex-col items-center gap-4">
            <label className="group relative cursor-pointer">
              <Avatar profile={profile} size="lg" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs opacity-0 transition group-hover:opacity-100">
                Cambiar
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="w-full space-y-3">
              <input
                className="input-field"
                value={profile.name}
                onChange={(e) => {
                  const next = { ...profile, name: e.target.value };
                  setProfile(next);
                  saveAuthProfile(next);
                }}
                aria-label="Nombre"
              />
              <input
                className="input-field"
                value={profile.email}
                onChange={(e) => {
                  const next = { ...profile, email: e.target.value };
                  setProfile(next);
                  saveAuthProfile(next);
                }}
                aria-label="Email"
              />
            </div>
            <div className="flex w-full gap-2">
              <button type="button" className="btn-secondary flex-1" onClick={() => setModal("settings")}>
                Settings
              </button>
              <button type="button" className="btn-ghost flex-1" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </AuthModal>
      )}

      {modal === "settings" && (
        <AuthModal title="Settings" onClose={() => setModal("none")}>
          <p className="text-sm leading-relaxed text-muted">
            Aquí irán preferencias de cuenta, notificaciones y sincronización
            cuando conectemos auth real. Por ahora tu progreso vive en este
            navegador dentro del catálogo.
          </p>
          <a href="/aprender" className="btn-primary mt-4 w-full">
            Ir al catálogo
          </a>
        </AuthModal>
      )}
    </>
  );
}

function Avatar({
  profile,
  size = "sm",
}: {
  profile: AuthProfile;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "h-20 w-20 text-2xl" : "h-8 w-8 text-xs";
  if (profile.avatarDataUrl) {
    return (
      <img
        src={profile.avatarDataUrl}
        alt=""
        className={`${dim} rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${dim} flex items-center justify-center rounded-full bg-lilac/25 font-bold text-lilac`}
    >
      {profile.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function AuthModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="ui-card relative z-10 w-full max-w-md p-6 shadow-float">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AuthForm({
  submitLabel,
  onSubmit,
  showName,
}: {
  submitLabel: string;
  onSubmit: (email: string, name?: string) => void;
  showName: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onSubmit(email.trim(), name);
      }}
    >
      {showName && (
        <input
          className="input-field"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      )}
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <input
        className="input-field"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={showName ? "new-password" : "current-password"}
      />
      <button type="submit" className="btn-filled-soft w-full">
        {submitLabel}
      </button>
    </form>
  );
}
