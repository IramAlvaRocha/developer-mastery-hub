import { useEffect, useRef } from "react";
import gsap from "gsap";

const TECHS = [
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "React", slug: "react", color: "61DAFB" },
  { name: ".NET", slug: "dotnet", color: "512BD4" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Prisma", slug: "prisma", color: "FFFFFF" },
  { name: "EF Core", src: "/logos/csharp.svg" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "Vue", slug: "vuedotjs", color: "4FC08D" },
  { name: "SQL Server", src: "/logos/sql-server.svg" },
  { name: "Vite", slug: "vite", color: "646CFF" },
  { name: "Astro", slug: "astro", color: "FF5D01" },
] as const;

function techLogoSrc(tech: (typeof TECHS)[number]) {
  if ("src" in tech) return tech.src;
  return `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;
}

export default function TechMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const items = track.querySelectorAll("[data-tech-logo]");
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 28,
        scale: 0.88,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
      });

      gsap.to(items, {
        y: -14,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: { each: 0.18, from: "random" },
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const loop = [...TECHS, ...TECHS];

  return (
    <section id="tecnologias" className="border-y border-line py-16 sm:py-20">
      <div className="mx-auto mb-10 max-w-[1280px] px-4 sm:px-6">
        <p className="section-eyebrow">{"{ Tecnologías }"}</p>
        <h2 className="mt-2 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.1] tracking-tight text-cream">
          Stacks que vas a tocar con las manos
        </h2>
      </div>

      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas to-transparent sm:w-28" />
        <div
          className="animate-marquee flex w-max items-end gap-10 px-6 sm:gap-14"
          ref={trackRef}
        >
          {loop.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              data-tech-logo
              className="flex w-[88px] shrink-0 flex-col items-center gap-3 sm:w-[100px]"
            >
                  <img
                src={techLogoSrc(tech)}
                alt=""
                width={56}
                height={56}
                className="h-12 w-12 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-14 sm:w-14"
                loading="lazy"
                decoding="async"
              />
              <span className="text-center text-xs font-medium text-muted sm:text-sm">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
