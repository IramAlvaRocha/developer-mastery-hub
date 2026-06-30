import { useEffect, useState } from "react";
import type { Module } from "@/lib/types";

interface Props {
  module: Module;
  progress: number;
  index?: number;
  onStart: (key: string) => void;
}

export default function ModuleCard({ module, progress, index = 0, onStart }: Props) {
  const c = module.color;
  const done = progress >= 100;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(progress));
    return () => cancelAnimationFrame(id);
  }, [progress]);
  return (
    <button
      onClick={() => onStart(module.key)}
      style={{ "--i": index } as React.CSSProperties}
      className={`animate-stagger group flex h-full flex-col justify-between gap-4 rounded-card border bg-surface p-5 text-left transition-all hover:-translate-y-0.5 ${
        done
          ? "border-emerald-500/40 hover:border-emerald-500/60"
          : `border-line hover:border-${c}-500/50`
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-xl bg-${c}-500/10`}
          >
            {module.icon}
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
              ✓ Completado
            </span>
          ) : (
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-${c}-500/10 text-${c}-400 border-${c}-500/20`}
            >
              {module.badge}
            </span>
          )}
        </div>
        <h3
          className={`mt-3 text-[15px] font-bold tracking-tight text-ink transition-colors group-hover:text-${c}-400`}
        >
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
          <span className={progress > 0 ? `text-${c}-400` : "text-faint"}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out bg-${c}-500`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
      </div>
    </button>
  );
}
