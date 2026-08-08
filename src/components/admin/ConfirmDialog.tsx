// ──────────────────────────────────────────────────────────────────────────
// ConfirmDialog — Fase 7 (Panel admin).
// Diálogo de confirmación accesible: role="dialog", aria-modal, Escape cierra
// y el foco inicial va al botón "Cancelar" (nunca al destructivo).
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  onCancel,
  onConfirm,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-canvas/85 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="ui-card animate-fade-in relative z-10 w-full max-w-sm p-6 shadow-float">
        <p className="section-eyebrow text-cream">{"{ Confirmar }"}</p>
        <h2
          id="confirm-dialog-title"
          className="mt-2 text-lg font-semibold tracking-tight text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        <div className="mt-6 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1 !min-h-11"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 flex-1 rounded-full border border-danger/50 bg-danger/15 px-5 font-semibold text-danger transition-colors hover:bg-danger/25"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
