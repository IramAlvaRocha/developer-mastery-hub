import type { Toast } from "@/lib/useToasts";

interface Props {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const STYLES: Record<Toast["type"], string> = {
  success: "border-emerald-500/40 text-emerald-200",
  error: "border-red-500/40 text-red-200",
  info: "border-line text-ink",
};

const ICONS: Record<Toast["type"], string> = {
  success: "🎉",
  error: "🚨",
  info: "💡",
};

export default function Toasts({ toasts, onDismiss }: Props) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] w-full max-w-xs space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-in pointer-events-auto flex items-start gap-2.5 rounded-[12px] border bg-surface p-3 text-[12px] shadow-float ${STYLES[toast.type]}`}
        >
          <span className="shrink-0 text-sm">{ICONS[toast.type]}</span>
          <p className="min-w-0 flex-1 font-medium leading-normal">
            {toast.message}
          </p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="px-1 font-bold text-muted opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
