import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { moduleColorStyle } from "@/lib/moduleColors";

interface Props {
  /** Pistas del ejercicio; si llega `undefined` se usa un arreglo vacío estable. */
  hints?: string[];
  solved: boolean;
  /** Desactiva el atajo `h` (p. ej. fuera del tab Desafío). */
  disabled: boolean;
  reduceMotion: boolean;
  color: string;
}

/** Referencia estable para ejercicios sin pistas (evita re-render del efecto `h`). */
const EMPTY_HINTS: string[] = [];

/**
 * Zona "¿Atascado?" del aside del Desafío: pistas progresivas bajo demanda.
 * Se monta con `key={exercise.id}` para resetear `revealed` entre ejercicios.
 * El aria-live (sr-only) anuncia cada pista y el agotamiento.
 */
export default function HintReveal({
  hints = EMPTY_HINTS,
  solved,
  disabled,
  reduceMotion,
  color,
}: Props) {
  const total = hints.length;
  const [revealed, setRevealed] = useState(0);
  // `gone` arranca en `solved`: si el ejercicio ya estaba completado la zona
  // nunca monta; si `solved` llega después, la zona se desvanece y se desmonta.
  const [gone, setGone] = useState(solved);
  const [btnHidden, setBtnHidden] = useState(false);
  const [liveText, setLiveText] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const revealCtxRef = useRef<gsap.Context | null>(null);
  const colorStyle = moduleColorStyle(color);
  const liveId = useId();
  const hintListId = useId();
  const zoneTitleId = useId();

  const allRevealed = revealed >= total;

  const label =
    revealed === 0
      ? "Mostrar pista"
      : revealed >= total - 1
        ? "Última pista"
        : "Siguiente pista";

  function doReveal() {
    if (gone || solved || allRevealed) return;
    const next = revealed + 1;
    const text = hints[next - 1] ?? "";
    setRevealed(next);
    setLiveText(
      next >= total
        ? `Pista ${next} de ${total}: ${text}. Todas las pistas reveladas.`
        : `Pista ${next} de ${total}: ${text}`,
    );
  }

  // Fade-out de la zona al resolver (caso E): 0.3s y desmonta.
  useEffect(() => {
    if (!solved || gone) return;
    if (reduceMotion) {
      setGone(true);
      return;
    }
    const root = rootRef.current;
    if (!root) {
      setGone(true);
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to("[data-hint-zone]", {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => setGone(true),
      });
    }, root);
    return () => ctx.revert();
  }, [solved, gone, reduceMotion]);

  // Revelado de una card: fade+y + pop del icono + scrollIntoView (móvil).
  // Se usan `kill()` (no `revert()`) para no resetear cards ya reveladas.
  useEffect(() => {
    if (revealed === 0) return;
    const root = rootRef.current;
    const last = root?.querySelector<HTMLElement>("[data-hint-card]:last-child");
    if (!last) return;
    revealCtxRef.current?.getTweens().forEach((t) => t.kill());
    revealCtxRef.current = null;
    last.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hint-card]:last-child",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        "[data-hint-card]:last-child [data-hint-icon]",
        { scale: 0.6, rotation: -8 },
        { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.8)" },
      );
    }, root);
    revealCtxRef.current = ctx;
    return () => {
      revealCtxRef.current?.getTweens().forEach((t) => t.kill());
      revealCtxRef.current = null;
    };
  }, [revealed, reduceMotion]);

  // Crossfade al agotar: el botón se desvanece y aparece la nota final.
  useEffect(() => {
    if (!allRevealed) return;
    if (reduceMotion) {
      setBtnHidden(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hint-btn]", {
        opacity: 0,
        y: -6,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => setBtnHidden(true),
      });
      gsap.from("[data-hint-done]", {
        opacity: 0,
        y: 6,
        duration: 0.25,
        ease: "power2.out",
        delay: 0.05,
      });
    }, root);
    return () => ctx.revert();
  }, [allRevealed, reduceMotion]);

  // Atajo `h` (opcional-recomendado): mismo guard que el workspace.
  // No se suscribe fuera del tab Desafío (`disabled`).
  useEffect(() => {
    if (disabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "h" && e.key !== "H") return;
      if (gone || solved || allRevealed) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (target?.closest?.("[role='tablist']")) return;
      doReveal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, revealed, gone, solved, allRevealed, hints, total]);

  if (gone || total === 0) return null;

  return (
    <section
      ref={rootRef}
      data-hint-zone
      style={colorStyle}
      aria-labelledby={zoneTitleId}
      className="mt-4 rounded-[20px] border border-line bg-canvas/50 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <p
          id={zoneTitleId}
          className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint"
        >
          ¿Atascado?
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {hints.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-[250ms] ${
                  i < revealed ? "mod-bg" : "bg-line"
                }`}
              />
            ))}
          </div>
          <kbd
            aria-hidden="true"
            className="rounded border border-line-soft bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint"
          >
            h
          </kbd>
        </div>
      </div>

      {revealed > 0 && (
        <div id={hintListId} className="mt-3 space-y-2.5">
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              data-hint-card
              className="rounded-[16px] border border-line-soft bg-surface-2/80 p-3.5"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] mod-text">
                Pista {i + 1} de {total}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-cream/90">
                <span
                  data-hint-icon
                  className="mr-1.5 inline-block"
                  aria-hidden="true"
                >
                  💡
                </span>
                {hint}
              </p>
            </div>
          ))}
        </div>
      )}

      {(!allRevealed || !btnHidden) && (
        <button
          data-hint-btn
          type="button"
          onClick={doReveal}
          aria-expanded={revealed > 0}
          aria-controls={revealed > 0 ? hintListId : undefined}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-mod-border-40 bg-mod-bg-15 px-4 py-2.5 text-[13px] font-semibold mod-text transition hover:border-mod-border hover:bg-mod-bg-20 active:translate-y-px"
        >
          <span aria-hidden="true">💡</span>
          {label}
        </button>
      )}

      {allRevealed && (
        <p data-hint-done className="mt-3 text-[11px] text-faint">
          Todas las pistas reveladas ·{" "}
          <kbd
            aria-hidden="true"
            className="rounded border border-line-soft bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint"
          >
            h
          </kbd>
        </p>
      )}

      <p aria-live="polite" aria-atomic="true" id={liveId} className="sr-only">
        {liveText}
      </p>
    </section>
  );
}
