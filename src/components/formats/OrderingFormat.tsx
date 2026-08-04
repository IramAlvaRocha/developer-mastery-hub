import { useMemo } from "react";
import type { FormatBaseProps } from "./FormatTypes";

/** Ordenar pasos: se construye la secuencia clickeando pasos revueltos. */
export default function OrderingFormat({
  exercise,
  userAnswers,
  incorrectKeys,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const ordering = exercise.ordering;
  if (!ordering) return null;

  const order = useMemo(() => {
    const raw = (userAnswers["order"] ?? "").trim();
    return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [userAnswers["order"]]);

  const placedIds = new Set(order);
  const available = ordering.steps.filter((s) => !placedIds.has(s.id));
  const invalid = incorrectKeys.has("order");
  const complete = order.length === ordering.steps.length;

  function place(id: string) {
    if (placedIds.has(id)) return;
    onAnswerChange("order", [...order, id].join(","));
  }
  function unplace(id: string) {
    onAnswerChange(
      "order",
      order.filter((x) => x !== id).join(","),
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {ordering.prompt ?? "Ordena los pasos en la secuencia correcta."}
      </p>

      <p className="text-[12px] font-semibold text-faint" aria-live="polite">
        {order.length}/{ordering.steps.length} pasos en tu secuencia
      </p>

      {/* Pasos disponibles (revueltos) */}
      <section aria-label="Pasos disponibles">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-faint">
          Pasos disponibles
        </p>
        <ul className="space-y-2">
          {available.map((step) => (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => place(step.id)}
                aria-label={`Añadir paso: ${step.label}`}
                className={`flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition-colors hover:border-line-soft hover:bg-elevated hover:text-cream ${
                  invalid ? "border-line-soft" : "border-line"
                }`}
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-[11px] font-bold text-faint"
                >
                  +
                </span>
                <span className="min-w-0 flex-1 font-mono text-[12px] leading-relaxed text-muted">
                  {step.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Secuencia del alumno */}
      <section
        aria-label="Tu secuencia"
        aria-live="polite"
        className={`rounded-[24px] border p-3 transition-colors ${
          solved && complete
            ? "border-brand/40 bg-brand/5"
            : invalid
              ? "border-danger/40 bg-danger/5"
              : "border-line bg-surface-2"
        }`}
      >
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-faint">
          Tu secuencia
        </p>
        {order.length === 0 ? (
          <p className="px-1 pb-1 text-[13px] text-faint">
            Toca los pasos de arriba para ir armando el orden.
          </p>
        ) : (
          <ol className="space-y-2">
            {order.map((id, i) => {
              const step = ordering.steps.find((s) => s.id === id);
              if (!step) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => unplace(id)}
                    aria-label={`Quitar paso ${i + 1}: ${step.label}`}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-danger/40"
                  >
                    <span
                      aria-hidden
                      className="mod-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-canvas"
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 font-mono text-[12px] leading-relaxed text-cream/90">
                      {step.label}
                    </span>
                    <span aria-hidden className="shrink-0 text-[12px] text-faint">
                      quitar ✕
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
