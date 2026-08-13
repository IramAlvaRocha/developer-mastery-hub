import { useEffect, useRef } from "react";
import gsap from "gsap";
import { moduleColorStyle } from "@/lib/moduleColors";

interface Props {
  color: string;
  reduceMotion: boolean;
  onGoToChallenge: () => void;
}

const TEASERS = [
  { icon: "</>", label: "Explicación técnica" },
  { icon: "🌍", label: "Ejemplo cotidiano" },
  { icon: "✓", label: "Solución de referencia" },
];

/** Estado bloqueado de la pestaña Solución: header + CTA + 3 teasers sin spoiler. */
export default function SolutionLocked({
  color,
  reduceMotion,
  onGoToChallenge,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const colorStyle = moduleColorStyle(color);

  useEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-lock-icon]",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" },
      );
      gsap.from("[data-lock-title]", {
        y: 10,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.05,
      });
      gsap.from("[data-lock-teaser]", {
        y: 8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.03,
        delay: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div className="space-y-5 sm:space-y-6" style={colorStyle}>
      <header className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-5 py-6 sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full mod-glow blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-4">
          <span
            data-lock-icon
            className="mod-icon-bg mod-text flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] text-xl"
            aria-hidden="true"
          >
            🔒
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] mod-text">
              Solución bloqueada
            </p>
            <h2
              data-lock-title
              className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl"
            >
              Resuelve el desafío para ver la solución
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Al verificar la respuesta correcta, aquí tendrás el desglose
              completo: explicación técnica, ejemplo cotidiano y la solución de
              referencia. Si te atascas, vuelve al desafío y usa las pistas.
            </p>
            <button
              type="button"
              data-solution-cta
              onClick={onGoToChallenge}
              className="btn-filled-soft mt-5 !min-h-11 !px-6 !text-sm"
            >
              Ir al desafío →
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {TEASERS.map((teaser) => (
          <div
            key={teaser.label}
            data-lock-teaser
            className="rounded-[20px] border border-line bg-surface-2/60 p-4"
          >
            <span
              className="mod-icon-bg mod-text flex h-9 w-9 items-center justify-center rounded-[12px] font-mono text-sm font-bold"
              aria-hidden="true"
            >
              {teaser.icon}
            </span>
            <p className="mt-3 text-sm font-semibold text-cream">
              {teaser.label}
            </p>
            <p className="mt-1 text-[12px] text-faint">
              Se desbloquea al completar
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
