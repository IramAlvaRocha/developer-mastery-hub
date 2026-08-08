import type { Module } from "@/lib/types";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth } from "@/lib/useReducedMotion";

interface Props {
  module: Module;
  progress: number;
  index?: number;
  onStart: (key: string) => void;
  /** Vista con suscripción: añade el control Suscribirse/Continuar en la tarjeta. */
  showEnroll?: boolean;
  /** Estado de suscripción del usuario actual. */
  enrolled?: boolean;
  onEnroll?: (key: string) => void;
  onUnenroll?: (key: string) => void;
}

export default function ModuleCard({
  module,
  progress,
  onStart,
  showEnroll = false,
  enrolled = false,
  onEnroll,
  onUnenroll,
}: Props) {
  const done = progress >= 100;
  const width = useAnimatedWidth(progress);

  const badge = done ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
      Completado
    </span>
  ) : showEnroll && enrolled ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky/30 bg-sky/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky">
      Suscrito
    </span>
  ) : (
    <span className="mod-badge rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
      {module.badge}
    </span>
  );

  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="mod-icon-bg flex h-10 w-10 items-center justify-center rounded-[20px] text-xl">
          {module.icon}
        </span>
        {badge}
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
    </>
  );

  const colorStyle = moduleColorStyle(module.color) as React.CSSProperties;

  if (!showEnroll) {
    return (
      <button
        onClick={() => onStart(module.key)}
        style={colorStyle}
        className={`course-card group mod-card-hover flex h-full flex-col justify-between gap-4 rounded-card border bg-surface p-5 text-left motion-safe-transition motion-safe-lift transition-all hover:-translate-y-0.5 ${
          done ? "border-brand/40 hover:border-brand/60" : "border-line"
        }`}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      style={colorStyle}
      className={`course-card group mod-card-hover flex h-full flex-col rounded-card border bg-surface p-5 motion-safe-transition ${
        done ? "border-brand/40" : "border-line"
      }`}
    >
      <button
        type="button"
        onClick={() => onStart(module.key)}
        className="flex h-full flex-col justify-between gap-4 rounded-card text-left motion-safe-transition motion-safe-lift transition-all hover:-translate-y-0.5"
      >
        {body}
      </button>
      <div className="mt-2 border-t border-line-soft pt-3">
        {enrolled ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStart(module.key)}
              className="btn-primary min-w-0 flex-1 !min-h-9 !px-3 !text-xs"
            >
              Continuar →
            </button>
            {onUnenroll && (
              <button
                type="button"
                onClick={() => onUnenroll(module.key)}
                className="icon-btn shrink-0 border border-line"
                aria-label="Quitar suscripción"
                title="Quitar suscripción"
              >
                ✕
              </button>
            )}
          </div>
        ) : onEnroll ? (
          <button
            type="button"
            onClick={() => onEnroll(module.key)}
            className="btn-filled-soft w-full !min-h-9 !px-3 !text-xs"
          >
            Suscribirse
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStart(module.key)}
            className="btn-secondary w-full !min-h-9 !px-3 !text-xs"
          >
            Practicar
          </button>
        )}
      </div>
    </div>
  );
}
