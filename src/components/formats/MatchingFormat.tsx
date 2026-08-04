import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { FormatBaseProps } from "./FormatTypes";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Paleta de parejas: cada relación término↔definición recibe un color propio
 * para que se distinga visualmente cuando hay varias emparejadas.
 * Las clases son estáticas (Tailwind las detecta al escribirse literal).
 */
const PAIR_STYLES = [
  {
    border: "border-sky/50 bg-sky/10",
    dot: "bg-sky",
    text: "text-sky",
    badge: "bg-sky/15 text-sky border-sky/30",
    stroke: "var(--color-sky)",
  },
  {
    border: "border-peach/50 bg-peach/10",
    dot: "bg-peach",
    text: "text-peach",
    badge: "bg-peach/15 text-peach border-peach/30",
    stroke: "var(--color-peach)",
  },
  {
    border: "border-lilac/50 bg-lilac/10",
    dot: "bg-lilac",
    text: "text-lilac",
    badge: "bg-lilac/15 text-lilac border-lilac/30",
    stroke: "var(--color-lilac)",
  },
  {
    border: "border-butter/50 bg-butter/10",
    dot: "bg-butter",
    text: "text-butter",
    badge: "bg-butter/15 text-butter border-butter/30",
    stroke: "var(--color-butter)",
  },
  {
    border: "border-pink/50 bg-pink/10",
    dot: "bg-pink",
    text: "text-pink",
    badge: "bg-pink/15 text-pink border-pink/30",
    stroke: "var(--color-pink)",
  },
  {
    border: "border-sage/50 bg-sage/10",
    dot: "bg-sage",
    text: "text-sage",
    badge: "bg-sage/15 text-sage border-sage/30",
    stroke: "var(--color-sage)",
  },
  {
    border: "border-orangey/50 bg-orangey/10",
    dot: "bg-orangey",
    text: "text-orangey",
    badge: "bg-orangey/15 text-orangey border-orangey/30",
    stroke: "var(--color-orangey)",
  },
  {
    border: "border-brand/50 bg-brand/10",
    dot: "bg-brand",
    text: "text-brand",
    badge: "bg-brand/15 text-brand border-brand/30",
    stroke: "var(--color-brand)",
  },
] as const;

interface Connector {
  pairId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  len: number;
}

/** Match término ↔ definición: clickea un término y luego su definición. */
export default function MatchingFormat({
  exercise,
  userAnswers,
  solved,
  onAnswerChange,
}: FormatBaseProps) {
  const matching = exercise.matching;
  if (!matching) return null;

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [hoveredPair, setHoveredPair] = useState<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const termBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const defBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});

  // Mapa término id -> definición elegida (desde userAnswers).
  // Memorizado: su referencia debe ser estable entre renders para no
  // disparar el layout effect de medición en cada render.
  const matches = useMemo(() => {
    const m = new Map<string, string>();
    for (const pair of matching.pairs) {
      const def = (userAnswers[`pair-${pair.id}`] ?? "").trim();
      if (def) m.set(pair.id, def);
    }
    return m;
  }, [matching.pairs, userAnswers]);

  const definitions = useMemo(
    () => matching.definitions ?? matching.pairs.map((p) => p.definition),
    [matching.definitions, matching.pairs],
  );

  const definitionOwner = (definition: string): string | undefined => {
    for (const pair of matching.pairs) {
      if (matches.get(pair.id) === definition) return pair.id;
    }
    return undefined;
  };

  const pairIndex = (termId: string) =>
    matching.pairs.findIndex((p) => p.id === termId);

  function pair(termId: string, definition: string) {
    onAnswerChange(`pair-${termId}`, definition);
    setSelectedTerm(null);
  }

  function toggleTerm(termId: string) {
    if (matches.has(termId)) {
      onAnswerChange(`pair-${termId}`, "");
      return;
    }
    setSelectedTerm(termId === selectedTerm ? null : termId);
  }

  function toggleDefinition(definition: string) {
    if (!selectedTerm) return;
    const owner = definitionOwner(definition);
    if (owner && owner !== selectedTerm) {
      onAnswerChange(`pair-${owner}`, "");
    }
    pair(selectedTerm, definition);
  }

  // ── Líneas conectoras: medir posiciones de cada pareja emparejada ────────
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduceMotion) {
      setConnectors([]);
      return;
    }
    const measure = () => {
      const gridRect = grid.getBoundingClientRect();
      const next: Connector[] = [];
      for (const pair of matching.pairs) {
        const def = matches.get(pair.id);
        if (!def) continue;
        const defIdx = definitions.findIndex((d) => d === def);
        const tBtn = termBtnRefs.current[pair.id];
        const dBtn = defBtnRefs.current[defIdx];
        if (!tBtn || !dBtn) continue;
        const tRect = tBtn.getBoundingClientRect();
        const dRect = dBtn.getBoundingClientRect();
        const x1 = tRect.right - gridRect.left;
        const y1 = tRect.top + tRect.height / 2 - gridRect.top;
        const x2 = dRect.left - gridRect.left;
        const y2 = dRect.top + dRect.height / 2 - gridRect.top;
        const dx = x2 - x1;
        const dy = y2 - y1;
        next.push({
          pairId: pair.id,
          x1,
          y1,
          x2,
          y2,
          stroke: PAIR_STYLES[pairIndex(pair.id) % PAIR_STYLES.length].stroke,
          len: Math.hypot(dx, dy),
        });
      }
      setConnectors(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [matching, matches, definitions, reduceMotion]);

  // Animación de dibujo de las líneas (stroke draw) con GSAP.
  useLayoutEffect(() => {
    if (reduceMotion || !svgRef.current) return;
    const ctx = gsap.context(() => {
      for (const conn of connectors) {
        const el = lineRefs.current[conn.pairId];
        if (!el) continue;
        gsap.fromTo(
          el,
          { strokeDashoffset: conn.len, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      }
    }, svgRef);
    return () => ctx.revert();
  }, [connectors, reduceMotion]);

  const incomplete = matching.pairs.some((p) => !matches.has(p.id));
  const matchedCount = matches.size;

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-cream/95">
        {matching.prompt ?? "Empareja cada término con su definición."}
      </p>

      <p className="text-[12px] font-semibold text-muted" aria-live="polite">
        {matchedCount}/{matching.pairs.length} emparejados
        {selectedTerm && " · término seleccionado: toca su definición"}
      </p>

      <div ref={gridRef} className="relative">
        {/* Líneas conectoras (solo desktop, pointer-events none) */}
        <svg
          ref={svgRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full sm:block"
        >
          {connectors.map((conn) => (
            <line
              key={conn.pairId}
              ref={(el) => {
                lineRefs.current[conn.pairId] = el;
              }}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke={conn.stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={conn.len}
              strokeDashoffset={conn.len}
              opacity={0}
            />
          ))}
        </svg>

        <div className="relative z-[1] grid gap-4 sm:grid-cols-2">
          {/* Términos */}
          <section aria-label="Términos">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
              Términos
            </p>
            <ul className="space-y-2">
              {matching.pairs.map((pair) => {
                const matched = matches.get(pair.id);
                const selected = selectedTerm === pair.id;
                const idx = pairIndex(pair.id);
                const style = PAIR_STYLES[idx % PAIR_STYLES.length];
                const hovered = hoveredPair === pair.id;
                const state = solved
                  ? matched === pair.definition
                    ? "correct"
                    : "incorrect"
                  : "idle";
                return (
                  <li key={pair.id}>
                    <button
                      type="button"
                      ref={(el) => {
                        termBtnRefs.current[pair.id] = el;
                      }}
                      onClick={() => toggleTerm(pair.id)}
                      onMouseEnter={() => matched && setHoveredPair(pair.id)}
                      onMouseLeave={() => setHoveredPair(null)}
                      aria-pressed={selected}
                      aria-label={`Término: ${pair.term}`}
                      className={`flex w-full items-center gap-2.5 rounded-[20px] border px-4 py-3 text-left transition-all ${
                        state === "correct"
                          ? "border-brand/50 bg-brand/10 text-cream"
                          : state === "incorrect"
                            ? "border-danger/50 bg-danger/10 text-cream"
                            : matched
                              ? `${style.border} ${hovered ? "brightness-125" : ""}`
                              : selected
                                ? "mod-border-40 mod-bg-15 text-cream ring-2 ring-[rgb(var(--module-rgb)/0.25)]"
                                : "border-line bg-surface-2 text-muted hover:border-line-soft hover:text-cream"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          state === "correct"
                            ? "bg-brand"
                            : state === "incorrect"
                              ? "bg-danger"
                              : matched
                                ? style.dot
                                : "bg-elevated"
                        }`}
                      />
                      <span className="min-w-0 flex-1 font-mono text-[13px] leading-snug">
                        {pair.term}
                      </span>
                      {matched && (
                        <span
                          aria-hidden
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${style.badge}`}
                        >
                          {(idx % PAIR_STYLES.length) + 1}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Definiciones (revueltas en el autor) */}
          <section aria-label="Definiciones">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
              Definiciones
            </p>
            <ul className="space-y-2">
              {definitions.map((definition, i) => {
                const owner = definitionOwner(definition);
                const used = owner != null;
                const active = selectedTerm != null;
                const ownerIdx = owner ? pairIndex(owner) : -1;
                const style =
                  ownerIdx >= 0
                    ? PAIR_STYLES[ownerIdx % PAIR_STYLES.length]
                    : undefined;
                const hovered = hoveredPair === owner;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      ref={(el) => {
                        defBtnRefs.current[i] = el;
                      }}
                      onClick={() => toggleDefinition(definition)}
                      disabled={!active && used}
                      onMouseEnter={() => used && owner && setHoveredPair(owner)}
                      onMouseLeave={() => setHoveredPair(null)}
                      aria-label={`Definición ${i + 1}`}
                      className={`flex w-full items-center gap-2.5 rounded-[20px] border px-4 py-3 text-left text-[13px] leading-relaxed transition-all ${
                        used
                          ? `${style?.border ?? "border-line bg-surface-2"} ${
                              hovered ? "brightness-125" : ""
                            }`
                          : active
                            ? "border-line-soft bg-surface-2 text-cream/90 hover:border-line"
                            : "border-line bg-surface-2 text-muted"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span className="min-w-0 flex-1">{definition}</span>
                      {used && (
                        <span
                          aria-hidden
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${style?.badge ?? "border-line bg-surface-2 text-faint"}`}
                        >
                          {(ownerIdx % PAIR_STYLES.length) + 1}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      {incomplete && !solved && (
        <p className="text-[12px] text-muted">
          Un término puede quedar seleccionado: toca su definición para
          emparejarlo. Toca un emparejado para deshacerlo.
        </p>
      )}
    </div>
  );
}
