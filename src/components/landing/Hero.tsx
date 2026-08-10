import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
      });
      gsap.from("[data-hero-sub]", {
        opacity: 0,
        y: 18,
        duration: 0.65,
        delay: 0.35,
        ease: "power2.out",
      });
      gsap.from("[data-hero-cta]", {
        opacity: 0,
        y: 14,
        duration: 0.55,
        delay: 0.55,
        ease: "power2.out",
      });
      gsap.to("[data-blob]", {
        y: "+=16",
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.4,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          data-blob
          className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl sm:h-96 sm:w-96"
        />
        <div
          data-blob
          className="absolute right-[5%] top-12 h-40 w-40 rounded-full bg-lilac/20 blur-3xl sm:h-64 sm:w-64"
        />
        <div
          data-blob
          className="absolute bottom-0 right-[30%] h-32 w-32 rounded-full bg-orangey/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <div
            data-hero-sub
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand-strong"
          >
            <span className="h-2 w-2 rounded-full bg-brand shadow-glow" />
            Catálogo abierto · explora sin registrarte
          </div>

          <h1 className="max-w-none font-semibold tracking-[-0.055em] text-cream">
            <span
              data-hero-line
              className="block text-[clamp(3rem,7vw,6rem)] leading-[0.96]"
            >
              Domina cualquier stack.
            </span>
            <span
              data-hero-line
              className="mt-2 block text-[clamp(3rem,7vw,6rem)] leading-[0.96] text-brand"
            >
              <span className="block">Crece con</span>
              <span className="block">una ruta.</span>
            </span>
          </h1>

          <p
            data-hero-sub
            className="mt-8 max-w-2xl text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed text-muted"
          >
            Cursos de desarrollo organizados por objetivos, con teoría concreta,
            ejercicios progresivos y soluciones explicadas. Revisa cada temario
            gratis y elige dónde empezar.
          </p>

          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3">
            <a href="/cursos" className="btn-filled-soft">
              Explorar cursos
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas/15 text-sm"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
            <a href="#rutas" className="btn-secondary">
              Ver áreas
            </a>
          </div>

          <ul
            data-hero-sub
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted"
            aria-label="Beneficios"
          >
            <li className="flex items-center gap-2">
              <span className="text-brand" aria-hidden="true">✓</span>
              Temarios públicos
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand" aria-hidden="true">✓</span>
              Progreso sincronizado
            </li>
            <li className="flex items-center gap-2">
              <span className="text-brand" aria-hidden="true">✓</span>
              Práctica a tu ritmo
            </li>
          </ul>
        </div>

        <div data-hero-sub className="relative mx-auto w-full max-w-xl xl:mx-0">
          <div
            className="playful-sticker absolute -right-2 -top-8 z-10 rotate-6 rounded-[16px] bg-pink px-4 py-2 font-mono text-xs font-bold text-canvas shadow-float sm:-right-7"
            aria-hidden="true"
          >
            aprende jugando ✦
          </div>
          <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-brand/20 via-transparent to-lilac/20 blur-2xl" />
          <div className="playful-window relative overflow-hidden rounded-[30px] border border-line bg-surface shadow-float">
            <div className="flex items-center gap-2 border-b border-line-soft px-5 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-peach" />
              <span className="h-2.5 w-2.5 rounded-full bg-butter" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <span className="ml-3 font-mono text-xs text-faint">
                typescript/cart.ts
              </span>
            </div>
            <div className="grid gap-5 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-sky">EJERCICIO 08</p>
                  <h2 className="mt-2 text-xl font-semibold text-cream sm:text-2xl">
                    Calcula el total de una compra
                  </h2>
                </div>
                <span className="inline-flex min-h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-butter/20 bg-butter/10 px-3 py-1 text-xs font-bold leading-none text-butter">
                  4 ★
                </span>
              </div>
              <div className="grid overflow-hidden rounded-[20px] border border-line-soft bg-canvas sm:grid-cols-[1.12fr_.88fr]">
                <div className="border-b border-line-soft p-4 font-mono text-[12px] leading-7 sm:border-b-0 sm:border-r sm:p-5 sm:text-[13px]">
                  <p className="mb-2 text-faint">// cart.ts</p>
                  <p><span className="text-lilac">const</span> prices = [<span className="text-orangey">120</span>, <span className="text-orangey">80</span>, <span className="text-orangey">50</span>];</p>
                  <p className="mt-2"><span className="text-lilac">const</span> total = prices.<span className="text-sky">reduce</span>(</p>
                  <p className="pl-4 text-muted">(sum, price) <span className="text-lilac">=&gt;</span> sum + price,</p>
                  <p className="pl-4 text-orangey">0</p>
                  <p>);</p>
                </div>
                <div className="relative flex min-h-32 flex-col bg-cream p-4 text-canvas sm:p-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-canvas/45">
                    Resultado
                  </p>
                  <div className="my-auto">
                    <span className="inline-flex rounded-full bg-lilac/25 px-3 py-1 font-mono text-xs font-bold">
                      250
                    </span>
                    <p className="mt-3 text-xs leading-relaxed text-canvas/65">
                      120 + 80 + 50 = 250
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 text-lg" aria-hidden="true">✦</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">✓</span>
                  Acumulación paso a paso
                </div>
                <span className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-canvas">
                  Comprobar
                </span>
              </div>
            </div>
          </div>
          <svg
            className="absolute -bottom-16 right-2 hidden h-16 w-28 text-butter sm:block"
            viewBox="0 0 112 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 8c19 2 31 10 37 23 7 15 19 19 37 13 11-4 20-3 29 4"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="7 8"
            />
            <path d="m97 39 11 9-13 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
