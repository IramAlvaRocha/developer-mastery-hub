import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { saveAuthProfile } from "@/lib/authStub";

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
  onExportProgress: () => string;
  onImportProgress: (raw: string) => boolean;
}

export default function SettingsModal({
  open,
  onClose,
  onToast,
  onExportProgress,
  onImportProgress,
}: Props) {
  const { user, isDemoMode, refreshProfile, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    titleRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function handleExportProgress() {
    try {
      const data = onExportProgress();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mastery-hub-progreso-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onToast("success", "Progreso exportado.");
    } catch {
      onToast("error", "No se pudo exportar el progreso.");
    }
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportProgress(String(reader.result ?? ""));
      onToast(
        ok ? "success" : "error",
        ok
          ? "Progreso importado y fusionado."
          : "Archivo inválido: no se pudo importar.",
      );
    };
    reader.onerror = () => onToast("error", "No se pudo leer el archivo.");
    reader.readAsText(file);
  }

  async function handleAvatar(file: File | null) {
    if (!file || !user || !isDemoMode) return;
    const reader = new FileReader();
    reader.onload = async () => {
      saveAuthProfile({
        email: user.email,
        name: user.displayName ?? (user.email.split("@")[0] || "Dev"),
        avatarDataUrl: String(reader.result),
      });
      await refreshProfile();
      onToast("success", "Imagen de perfil actualizada (local).");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="absolute inset-0 bg-canvas/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="ui-card animate-fade-in relative z-10 w-full max-w-md p-6 shadow-float">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="section-eyebrow text-cream">{"{ Settings }"}</p>
            <h2
              ref={titleRef}
              id="settings-title"
              tabIndex={-1}
              className="mt-0.5 text-lg font-semibold text-ink outline-none"
            >
              Configuración
            </h2>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="space-y-5">
          <section className="rounded-[24px] border border-line bg-surface-2 p-4">
            <p className="mb-3 text-sm font-semibold text-ink">Perfil</p>
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line disabled:opacity-100"
                  onClick={() => {
                    if (isDemoMode) avatarInputRef.current?.click();
                  }}
                  disabled={!isDemoMode}
                  aria-label={
                    isDemoMode
                      ? "Cambiar imagen de perfil"
                      : "Avatar de perfil"
                  }
                  title={
                    isDemoMode ? "Cambiar imagen (solo modo demo)" : undefined
                  }
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-lilac/20 text-lg font-bold text-lilac">
                      {(user.displayName ?? user.email ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {user.displayName ?? user.email}
                  </p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                  {isDemoMode ? (
                    <p className="mt-1 text-[12px] text-lilac">
                      Avatar editable solo en modo demo.
                    </p>
                  ) : (
                    <p className="mt-1 text-[12px] text-faint">
                      Avatar y nombre los gestiona tu cuenta Supabase.
                    </p>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleAvatar(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted">
                Aún no hay sesión.{" "}
                <a href="/login" className="text-brand">
                  Inicia sesión
                </a>{" "}
                para ver tu perfil.
              </p>
            )}
            {user && (
              <button
                type="button"
                className="mt-3 w-full rounded-full border border-line px-3 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
                onClick={() => {
                  void signOut();
                  onToast("info", "Sesión cerrada.");
                }}
              >
                Cerrar sesión
              </button>
            )}
          </section>

          <section className="space-y-2">
            <span className="text-sm font-semibold text-ink">
              Progreso (backup)
            </span>
            <p className="text-[12px] leading-relaxed text-faint">
              Tu avance vive en este navegador. Expórtalo para respaldarlo o
              llevarlo a otro dispositivo.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportProgress}
                className="btn-secondary flex-1 !min-h-11 !text-sm"
              >
                Exportar
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary flex-1 !min-h-11 !text-sm"
              >
                Importar
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
              aria-hidden
            />
          </section>

          <button onClick={onClose} className="btn-primary w-full">
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
