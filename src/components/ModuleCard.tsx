import type { Module } from "@/lib/types";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth } from "@/lib/useReducedMotion";

interface Props {
  module: Module;
  progress: number;
  index?: number;
  onStart: (key: string) => void;
}

export default function ModuleCard({ module, progress, index = 0, onStart }: Props) {
  const done = progress >= 100;
  const width = useAnimatedWidth(progress);

  return (
    <button
      onClick={() => onStart(module.key)}
      style={{ "--i": index, ...moduleColorStyle(module.color) } as React.CSSProperties}
      className={`animate-stagger group mod-card-hover flex h-full flex-col justify-between gap-4 rounded-card border bg-surface p-5 text-left motion-safe-transition motion-safe-lift transition-all hover:-translate-y-0.5 ${
        done
          ? "border-emerald-500/40 hover:border-emerald-500/60"
          : "border-line"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="mod-icon-bg flex h-10 w-10 items-center justify-center rounded-input text-xl">
            {module.icon}
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              ✓ Completado
            </span>
          ) : (
            <span className="mod-badge rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
              {module.badge}
            </span>
          )}
        </div>
        <h3 className="mod-title-hover mt-3 text-[15px] font-bold tracking-tight text-ink transition-colors">
          {module.name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {module.desc}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {module.topics.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line-soft bg-surface-2 px-2 py-0.5 text-[10px] text-faint"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-line-soft pt-3">
        <div className="mb-1.5 flex justify-between text-[11px] font-semibold">
          <span className="text-muted">
            {module.exercises.length} ejercicios
          </span>
          <span className={progress > 0 ? "mod-text" : "text-faint"}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="mod-progress" style={{ width: `${width}%` }}></div>
        </div>
      </div>
    </button>
  );
}
