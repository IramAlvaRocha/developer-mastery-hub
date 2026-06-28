import type { Module } from "@/lib/types";

interface Props {
  module: Module;
  progress: number;
  onStart: (key: string) => void;
}

export default function ModuleCard({ module, progress, onStart }: Props) {
  const c = module.color;
  return (
    <button
      onClick={() => onStart(module.key)}
      className={`group flex h-full flex-col justify-between gap-4 rounded-card border border-line bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-${c}-500/50`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-xl bg-${c}-500/10`}
          >
            {module.icon}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-${c}-500/10 text-${c}-400 border-${c}-500/20`}
          >
            {module.badge}
          </span>
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
            className={`h-full rounded-full transition-all bg-${c}-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </button>
  );
}
