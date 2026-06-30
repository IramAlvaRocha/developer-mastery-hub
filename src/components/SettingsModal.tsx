import { useEffect, useState } from "react";
import {
  getApiKey,
  saveApiKey,
  getProvider,
  saveProvider,
  getModel,
  saveModel,
  PROVIDERS,
  type AiProvider,
} from "@/lib/gemini";

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function SettingsModal({ open, onClose, onToast }: Props) {
  const [provider, setProvider] = useState<AiProvider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Sincroniza los valores guardados cada vez que se abre.
  useEffect(() => {
    if (!open) return;
    const p = getProvider();
    setProvider(p);
    setApiKey(getApiKey(p));
    setModel(getModel());
  }, [open]);

  // Al cambiar de proveedor, carga la key guardada de ese proveedor.
  function handleProviderChange(next: AiProvider) {
    setProvider(next);
    setApiKey(getApiKey(next));
  }

  // Cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSave() {
    saveProvider(provider);
    saveApiKey(apiKey.trim(), provider);
    saveModel(model.trim());
    onToast("success", "Configuración guardada.");
    onClose();
  }

  function handleClear() {
    saveApiKey("", provider);
    setApiKey("");
    onToast("info", "Clave de API eliminada.");
  }

  const config = PROVIDERS[provider];
  const hasKey = apiKey.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Configuración"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="ui-card animate-fade-in relative z-10 w-full max-w-md p-6 shadow-float">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-input bg-brand/15 text-base">
              ⚙️
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">Configuración</h3>
              <p className="text-[11px] text-muted">Proveedor de IA</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Selector de proveedor */}
          <div className="space-y-1.5">
            <label
              htmlFor="ai-provider"
              className="text-[13px] font-semibold text-ink"
            >
              Proveedor de IA
            </label>
            <select
              id="ai-provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as AiProvider)}
              className="input-field"
            >
              {(Object.keys(PROVIDERS) as AiProvider[]).map((p) => (
                <option key={p} value={p}>
                  {PROVIDERS[p].label}
                </option>
              ))}
            </select>
            <p className="text-[11px] leading-relaxed text-faint">
              Groq y OpenRouter ofrecen API keys gratuitas sin tarjeta, ideales
              si no puedes conseguir la de Google.
            </p>
          </div>

          {/* API key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ai-key"
                className="text-[13px] font-semibold text-ink"
              >
                Clave de API
              </label>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  hasKey
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-elevated text-faint"
                }`}
              >
                {hasKey ? "Configurada" : "Sin configurar"}
              </span>
            </div>

            <div className="relative">
              <input
                id="ai-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={showKey ? "text" : "password"}
                placeholder={config.keyPlaceholder}
                className="input-field pr-10 font-mono text-xs"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted hover:text-ink"
                aria-label={showKey ? "Ocultar clave" : "Mostrar clave"}
              >
                {showKey ? "🙈" : "👁️"}
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-faint">
              Se guarda solo en este navegador (localStorage). Consíguela gratis
              en{" "}
              <a
                href={config.keyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:text-brand-strong"
              >
                {config.label}
              </a>
              .
            </p>
          </div>

          {/* Modelo opcional */}
          <div className="space-y-1.5">
            <label
              htmlFor="ai-model"
              className="text-[13px] font-semibold text-ink"
            >
              Modelo{" "}
              <span className="font-normal text-faint">(opcional)</span>
            </label>
            <input
              id="ai-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              type="text"
              placeholder={config.defaultModel}
              className="input-field font-mono text-xs"
              autoComplete="off"
            />
            <p className="text-[11px] leading-relaxed text-faint">
              Déjalo vacío para usar{" "}
              <span className="font-mono">{config.defaultModel}</span>.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleClear}
              disabled={!hasKey}
              className="btn-ghost"
            >
              Eliminar clave
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} className="btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
