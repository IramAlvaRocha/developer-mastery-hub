// ──────────────────────────────────────────────────────────────────────────
// ExerciseEditor — Fase 7 (Panel admin).
// Formulario modal para crear/editar un ejercicio. El payload de los formatos
// interactivos (prediction, ordering, …) se edita como JSON en `format_payload`;
// para ejercicios legacy, `inputs` (JSON) es la fuente de las respuestas.
// Se monta solo cuando está abierto (estado fresco).
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import type { ExpectedAnswer } from "@/lib/answers";
import { FORMAT_LABELS } from "@/lib/formatMeta";
import { validateFormatPayload } from "@/lib/formatValidation";
import type { ExerciseFormat } from "@/lib/types";
import type { AdminExercise, ExerciseInput } from "@/lib/useAdmin";
import PublishSwitch from "./PublishSwitch";
import { useFocusTrap } from "./useFocusTrap";

interface Props {
  exercise: AdminExercise | null;
  onClose: () => void;
  onSave: (input: ExerciseInput) => Promise<string | null>;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

interface FormState {
  title: string;
  stars: string;
  category: string;
  step: string;
  tags: string;
  fileName: string;
  description: string;
  objective: string;
  instruction: string;
  theory: string;
  explanationText: string;
  codeSnippet: string;
  inputs: string;
  completeCode: string;
  format: ExerciseFormat | "";
  formatPayload: string;
  isPublished: boolean;
}

function payloadFromExercise(ex: AdminExercise): string {
  const payload: unknown =
    ex.format === "prediction"
      ? ex.prediction
      : ex.format === "ordering"
        ? ex.ordering
        : ex.format === "snippet-pick"
          ? ex.snippetPick
          : ex.format === "bug-hunt"
            ? ex.bugHunt
            : ex.format === "matching"
              ? ex.matching
              : ex.format === "context-dropdown"
                ? ex.contextDropdown
                : ex.format === "true-false"
                  ? ex.trueFalse
                  : undefined;
  return payload ? JSON.stringify(payload, null, 2) : "";
}

export default function ExerciseEditor({
  exercise,
  onClose,
  onSave,
  onToast,
}: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  const [form, setForm] = useState<FormState>(() => {
    const format = exercise?.format ?? "";
    return {
      title: exercise?.title ?? "",
      stars: String(exercise?.stars ?? 3),
      category: exercise?.category ?? "",
      step: exercise?.step != null ? String(exercise.step) : "",
      tags: exercise?.tags.join(", ") ?? "",
      fileName: exercise?.fileName ?? "",
      description: exercise?.description ?? "",
      objective: exercise?.objective ?? "",
      instruction: exercise?.instruction ?? "",
      theory: exercise?.theory ?? "",
      explanationText: exercise?.explanationText ?? "",
      codeSnippet: exercise?.codeSnippet ?? "",
      inputs: exercise?.inputs ? JSON.stringify(exercise.inputs, null, 2) : "{}",
      completeCode: exercise?.completeCode ?? "",
      format,
      formatPayload: format && exercise ? payloadFromExercise(exercise) : "",
      isPublished: exercise?.isPublished ?? true,
    };
  });

  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      onToast("error", "El título es obligatorio.");
      return;
    }
    if (!form.codeSnippet.trim()) {
      onToast("error", "El código con placeholders es obligatorio.");
      return;
    }
    const stars = Number(form.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      onToast("error", "Las estrellas deben ser un número entero entre 1 y 5.");
      return;
    }
    const step = form.step.trim() === "" ? null : Number(form.step);
    if (step !== null && !Number.isInteger(step)) {
      onToast("error", "El paso debe ser un número entero.");
      return;
    }

    let parsedInputs: unknown;
    try {
      parsedInputs = form.inputs.trim() ? JSON.parse(form.inputs) : {};
    } catch {
      onToast("error", "El JSON de inputs no es válido.");
      return;
    }
    if (
      parsedInputs === null ||
      typeof parsedInputs !== "object" ||
      Array.isArray(parsedInputs)
    ) {
      onToast("error", "Los inputs deben ser un objeto JSON.");
      return;
    }

    let parsedPayload: unknown = null;
    if (form.format) {
      try {
        parsedPayload = form.formatPayload.trim()
          ? JSON.parse(form.formatPayload)
          : null;
      } catch {
        onToast("error", "El JSON del payload de formato no es válido.");
        return;
      }
      if (
        parsedPayload === null ||
        typeof parsedPayload !== "object" ||
        Array.isArray(parsedPayload)
      ) {
        onToast("error", "El payload de formato debe ser un objeto JSON.");
        return;
      }
      const formatError = validateFormatPayload(form.format, parsedPayload);
      if (formatError) {
        onToast("error", `Payload inválido: ${formatError}`);
        return;
      }
    }

    const input: ExerciseInput = {
      title: form.title.trim(),
      stars,
      category: form.category.trim(),
      step,
      description: form.description.trim(),
      objective: form.objective.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      fileName: form.fileName.trim(),
      instruction: form.instruction.trim() || null,
      theory: form.theory.trim() || null,
      explanationText: form.explanationText.trim(),
      codeSnippet: form.codeSnippet,
      inputs: parsedInputs as Record<string, ExpectedAnswer>,
      completeCode: form.completeCode.trim(),
      format: (form.format as ExerciseFormat) || null,
      formatPayload: form.format
        ? (parsedPayload as Record<string, unknown>)
        : null,
      isPublished: form.isPublished,
    };

    const err = await onSave(input);
    if (err) {
      onToast("error", err);
      return;
    }
    onToast("success", exercise ? "Ejercicio actualizado." : "Ejercicio creado.");
    onClose();
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-editor-title"
    >
      <div
        className="absolute inset-0 bg-canvas/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="ui-card animate-fade-in relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden shadow-float">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="section-eyebrow text-cream">
              {"{ " + (exercise ? "Editar ejercicio" : "Nuevo ejercicio") + " }"}
            </p>
            <h2
              ref={titleRef}
              id="exercise-editor-title"
              tabIndex={-1}
              className="mt-0.5 truncate text-lg font-semibold text-ink outline-none"
            >
              {exercise ? `Editar #${exercise.id} · ${exercise.title}` : "Crear ejercicio"}
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
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Título
              </span>
              <input
                className="input-field"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="ej. Crear un usuario IAM con MFA"
                required
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Estrellas (1-5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="input-field"
                  value={form.stars}
                  onChange={(e) => set("stars", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Categoría
                </span>
                <input
                  className="input-field"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="ej. AWS"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Paso (opcional)
                </span>
                <input
                  type="number"
                  className="input-field"
                  value={form.step}
                  onChange={(e) => set("step", e.target.value)}
                  placeholder="Secuencia de construcción"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Archivo
                </span>
                <input
                  className="input-field"
                  value={form.fileName}
                  onChange={(e) => set("fileName", e.target.value)}
                  placeholder="ej. iam-user.ts"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Tags
              </span>
              <input
                className="input-field"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="IAM, MFA, CLI"
              />
              <span className="mt-1 block text-xs text-faint">
                Separa con comas: IAM, MFA, CLI
              </span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Descripción
                </span>
                <textarea
                  className="input-field min-h-[88px] resize-y py-3"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Resumen breve del ejercicio…"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Objetivo
                </span>
                <textarea
                  className="input-field min-h-[88px] resize-y py-3"
                  value={form.objective}
                  onChange={(e) => set("objective", e.target.value)}
                  placeholder="Qué se consigue al completarlo…"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Instrucción (opcional)
                </span>
                <textarea
                  className="input-field min-h-[88px] resize-y py-3"
                  value={form.instruction}
                  onChange={(e) => set("instruction", e.target.value)}
                  placeholder="Tarea concreta encima del código…"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Teoría (opcional)
                </span>
                <textarea
                  className="input-field min-h-[88px] resize-y py-3"
                  value={form.theory}
                  onChange={(e) => set("theory", e.target.value)}
                  placeholder="Texto de la tab Teoría…"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Código con placeholders
              </span>
              <textarea
                className="input-field min-h-[140px] resize-y font-mono py-3 text-[13px]"
                value={form.codeSnippet}
                onChange={(e) => set("codeSnippet", e.target.value)}
                placeholder={'Código con [INPUT_1], [INPUT_2]…'}
                required
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Inputs (JSON)
                </span>
                <textarea
                  className="input-field min-h-[120px] resize-y font-mono py-3 text-[13px]"
                  value={form.inputs}
                  onChange={(e) => set("inputs", e.target.value)}
                  placeholder='{"INPUT_1": ["respuesta"], "INPUT_2": "altura"}'
                />
                <span className="mt-1 block text-xs text-faint">
                  Mapa INPUT_N → respuesta o alternativas.
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Código de referencia (solución)
                </span>
                <textarea
                  className="input-field min-h-[120px] resize-y font-mono py-3 text-[13px]"
                  value={form.completeCode}
                  onChange={(e) => set("completeCode", e.target.value)}
                  placeholder="Código completo de la tab Solución…"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Formato interactivo
              </span>
              <select
                className="input-field !min-h-[52px]"
                value={form.format}
                onChange={(e) =>
                  set("format", e.target.value as ExerciseFormat | "")
                }
              >
                <option value="">
                  — Formato heredado (inputs [INPUT_N]) —
                </option>
                {(Object.keys(FORMAT_LABELS) as ExerciseFormat[]).map((f) => (
                  <option key={f} value={f}>
                    {FORMAT_LABELS[f].icon} {FORMAT_LABELS[f].label}
                  </option>
                ))}
              </select>
            </label>

            {form.format && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Payload del formato (JSON)
                </span>
                <textarea
                  className="input-field min-h-[140px] resize-y font-mono py-3 text-[13px]"
                  value={form.formatPayload}
                  onChange={(e) => set("formatPayload", e.target.value)}
                  placeholder={`{ "prompt": "...", ... }`}
                />
                <span className="mt-1 block text-xs text-faint">
                  La estructura depende del formato seleccionado. Es la fuente
                  de verdad del ejercicio interactivo.
                </span>
              </label>
            )}

            <div className="flex items-center justify-between gap-3 rounded-[20px] border border-line bg-surface-2 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-ink">Publicado</p>
                <p className="text-xs text-muted">
                  Visible en el módulo de /aprender.
                </p>
              </div>
              <PublishSwitch
                checked={form.isPublished}
                label="Alternar publicación del ejercicio"
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
