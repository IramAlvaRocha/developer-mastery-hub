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
      className="relative px-4 pb-20 pt-16 sm:px-6 sm:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          data-blob
          className="absolute -left-10 top-16 h-40 w-40 rounded-[40%] bg-gradient-to-br from-pink to-orangey opacity-70 blur-[1px] sm:h-52 sm:w-52"
        />
        <div
          data-blob
          className="absolute right-[8%] top-28 h-28 w-28 rounded-[45%] bg-gradient-to-br from-lilac to-sky opacity-80 sm:h-36 sm:w-36"
        />
        <div
          data-blob
          className="absolute bottom-10 right-[20%] h-24 w-24 rounded-full bg-gradient-to-br from-brand to-brand-strong opacity-50 blur-sm"
        />
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        <p
          data-hero-sub
          className="mb-6 text-[clamp(1.15rem,2.5vw,1.5rem)] font-medium tracking-[-0.01em] text-cream"
        >
          {"{ Developer Mastery Hub }"}
        </p>

        <h1 className="max-w-[14ch] font-semibold tracking-[-0.02em] text-cream sm:max-w-none">
          <span
            data-hero-line
            className="block text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[1.02]"
          >
            Domina
          </span>
          <span
            data-hero-line
            className="block text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[1.02]"
          >
            cualquier stack
          </span>
        </h1>

        <p
          data-hero-sub
          className="mt-8 max-w-xl text-[clamp(1.05rem,2.2vw,1.35rem)] leading-relaxed text-muted"
        >
          Ejercicios progresivos de TypeScript, React, .NET, Node, Prisma y más.
          Teoría clara, desafíos reales y soluciones bien explicadas.
        </p>

        <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-3">
          <a href="/aprender" className="btn-filled-soft">
            Empezar a aprender
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas/15 text-sm">
              ↓
            </span>
          </a>
          <a href="#aprender" className="btn-secondary">
            Ver rutas
          </a>
        </div>
      </div>
    </section>
  );
}
