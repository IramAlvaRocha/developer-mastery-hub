// ──────────────────────────────────────────────────────────────────────────
// ModuleEditor — Fase 7 (Panel admin).
// Formulario modal para crear/editar un módulo. `key` es PK, por lo que se
// deshabilita en edición. Se monta solo cuando está abierto (estado fresco).
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from "react";
import { getModulePalette } from "@/lib/moduleColors";
import type { AdminModule, ModuleInput } from "@/lib/useAdmin";
import PublishSwitch from "./PublishSwitch";
import { useFocusTrap } from "./useFocusTrap";

interface Props {
  module: AdminModule | null;
  onClose: () => void;
  onSave: (input: ModuleInput) => Promise<string | null>;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

/** Paleta fija coherente con `src/data/index.ts` y `moduleColors.ts`. */
const COLOR_OPTIONS: { value: string; label: string; rgb: string }[] = [
  { value: "orange", label: "Naranja", rgb: "249 115 22" },
  { value: "amber", label: "Ámbar", rgb: "245 158 11" },
  { value: "yellow", label: "Amarillo", rgb: "234 179 8" },
  { value: "lime", label: "Lima", rgb: "132 204 22" },
  { value: "green", label: "Verde", rgb: "34 197 94" },
  { value: "emerald", label: "Esmeralda", rgb: "16 185 129" },
  { value: "teal", label: "Teal", rgb: "20 184 166" },
  { value: "cyan", label: "Cian", rgb: "6 182 212" },
  { value: "sky", label: "Cielo", rgb: "14 165 233" },
  { value: "blue", label: "Azul", rgb: "59 130 246" },
  { value: "indigo", label: "Índigo", rgb: "99 102 241" },
  { value: "violet", label: "Violeta", rgb: "139 92 246" },
  { value: "purple", label: "Púrpura", rgb: "168 85 247" },
  { value: "pink", label: "Rosa", rgb: "236 72 153" },
  { value: "rose", label: "Rosa viejo", rgb: "244 63 94" },
  { value: "red", label: "Rojo", rgb: "239 68 68" },
  { value: "slate", label: "Pizarra", rgb: "100 116 139" },
  { value: "stone", label: "Piedra", rgb: "120 113 108" },
];

export default function ModuleEditor({
  module,
  onClose,
  onSave,
  onToast,
}: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  const [form, setForm] = useState(() => ({
    key: module?.key ?? "",
    name: module?.name ?? "",
    icon: module?.icon ?? "",
    badge: module?.badge ?? "",
    color: module?.color ?? "emerald",
    group: module?.group ?? "",
    description: module?.desc ?? "",
    topics: module?.topics.join(", ") ?? "",
    isPublished: module?.isPublished ?? true,
  }));

  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const colorOptions = useMemo(() => {
    const known = COLOR_OPTIONS.map((c) => c.value);
    if (known.includes(form.color)) return COLOR_OPTIONS;
    // Color existente fuera de la paleta (p. ej. legado "red"): lo mantenemos.
    const palette = getModulePalette(form.color);
    return [
      ...COLOR_OPTIONS,
      { value: form.color, label: form.color, rgb: palette.rgb },
    ];
  }, [form.color]);

  const selectedPalette = getModulePalette(form.color);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.key.trim()) {
      onToast("error", "La clave del módulo es obligatoria.");
      return;
    }
    if (!form.name.trim()) {
      onToast("error", "El nombre del módulo es obligatorio.");
      return;
    }
    const input: ModuleInput = {
      key: form.key.trim(),
      name: form.name.trim(),
      icon: form.icon.trim(),
      badge: form.badge.trim(),
      color: form.color,
      group: form.group.trim(),
      description: form.description.trim(),
      topics: form.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isPublished: form.isPublished,
    };
    const err = await onSave(input);
    if (err) {
      onToast("error", err);
      return;
    }
    onToast("success", module ? "Módulo actualizado." : "Módulo creado.");
    onClose();
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-editor-title"
    >
      <div
        className="absolute inset-0 bg-canvas/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="ui-card animate-fade-in relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden shadow-float">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <p className="section-eyebrow text-cream">
              {"{ " + (module ? "Editar módulo" : "Nuevo módulo") + " }"}
            </p>
            <h2
              ref={titleRef}
              id="module-editor-title"
              tabIndex={-1}
              className="mt-0.5 text-lg font-semibold text-ink outline-none"
            >
              {module ? `Editar «${module.name}»` : "Crear módulo"}
            </h2>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Cerrar">
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Clave (key)
                </span>
                <input
                  className="input-field"
                  value={form.key}
                  onChange={(e) => set("key", e.target.value)}
                  placeholder="ej. aws-iam"
                  disabled={!!module}
                  aria-describedby="mod-key-hint"
                />
                <span id="mod-key-hint" className="mt-1 block text-xs text-faint">
                  {module
                    ? "Identificador único, no editable en edición."
                    : "Identificador único del módulo."}
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Nombre
                </span>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="ej. AWS: IAM & CLI"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Icono
                </span>
                <input
                  className="input-field"
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="ej. 🔑"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Badge
                </span>
                <input
                  className="input-field"
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                  placeholder="ej. Cloud"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Color
                </span>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-9 w-9 shrink-0 rounded-full border border-line"
                    style={{ backgroundColor: `rgb(${selectedPalette.rgb})` }}
                  />
                  <select
                    className="input-field !min-h-[52px]"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                  >
                    {colorOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Grupo
                </span>
                <input
                  className="input-field"
                  value={form.group}
                  onChange={(e) => set("group", e.target.value)}
                  placeholder="ej. AWS"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Descripción
              </span>
              <textarea
                className="input-field min-h-[88px] resize-y py-3"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Qué aprenderá el estudiante en este módulo…"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Topics
              </span>
              <input
                className="input-field"
                value={form.topics}
                onChange={(e) => set("topics", e.target.value)}
                placeholder="IAM, Políticas, MFA"
              />
              <span className="mt-1 block text-xs text-faint">
                Separa con comas: IAM, CLI, Roles
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 rounded-[20px] border border-line bg-surface-2 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-ink">Publicado</p>
                <p className="text-xs text-muted">
                  Visible en el catálogo de /aprender.
                </p>
              </div>
              <PublishSwitch
                checked={form.isPublished}
                label="Alternar publicación del módulo"
                onChange={() => set("isPublished", !form.isPublished)}
              />
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-line px-6 py-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
