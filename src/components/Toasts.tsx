import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Toast } from "@/lib/useToasts";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

interface Props {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const STYLES: Record<Toast["type"], string> = {
  success: "border-brand/40",
  error: "border-danger/40",
  info: "border-line",
};

const ICON_STYLES: Record<Toast["type"], string> = {
  success: "bg-brand/15 text-brand",
  error: "bg-danger/15 text-danger",
  info: "bg-elevated text-ink",
};

const ICONS: Record<Toast["type"], string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { x: 24, opacity: 0, duration: 0.3, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      role={toast.type === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-2.5 rounded-[24px] border bg-surface p-3.5 text-[12px] shadow-float ${
        STYLES[toast.type]
      } ${reduceMotion ? "animate-fade-in" : ""}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ICON_STYLES[toast.type]}`}
        aria-hidden
      >
        {ICONS[toast.type]}
      </span>
      <p className="min-w-0 flex-1 py-1 font-medium leading-normal">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="px-1 py-1 font-bold text-muted opacity-70 hover:opacity-100"
        aria-label="Descartar notificación"
      >
        ×
      </button>
    </div>
  );
}

export default function Toasts({ toasts, onDismiss }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-xs flex-col items-end gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
