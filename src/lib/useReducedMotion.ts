import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Evalua la preferencia del sistema (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(QUERY).matches ?? false;
}

/** Reacciona a cambios en prefers-reduced-motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduce;
}

/** Anima el ancho 0 -> target; con reduced-motion salta directo al valor. */
export function useAnimatedWidth(target: number): number {
  const reduce = usePrefersReducedMotion();
  const [width, setWidth] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setWidth(target);
      return;
    }
    const id = requestAnimationFrame(() => setWidth(target));
    return () => cancelAnimationFrame(id);
  }, [target, reduce]);

  return width;
}

/** Conteo animado; con reduced-motion muestra el valor final de inmediato. */
export function useCountUp(target: number, duration = 800): number {
  const reduce = usePrefersReducedMotion();
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);

  return val;
}
