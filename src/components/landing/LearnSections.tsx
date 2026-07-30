import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TechIcon = { slug: string; color: string; label: string; src?: string };

const TRACKS: {
  label: string;
  color: string;
  accent: string;
  title: string;
  body: string;
  icons: TechIcon[];
}[] = [
  {
    label: "Frontend",
    color: "text-sky",
    accent: "#00bae2",
    title: "React, Vue y UI moderna",
    body: "Composition, estado, data fetching y patrones de componentes listos para producción.",
    icons: [
      { slug: "react", color: "61DAFB", label: "React" },
      { slug: "vuedotjs", color: "4FC08D", label: "Vue" },
      { slug: "vite", color: "646CFF", label: "Vite" },
    ],
  },
  {
    label: "Backend",
    color: "text-orangey",
    accent: "#ff8709",
    title: ".NET y Node con criterio",
    body: "APIs, auth, rate limiting, Clean Architecture y buenas prácticas senior.",
    icons: [
      { slug: "dotnet", color: "512BD4", label: ".NET" },
      { slug: "nodedotjs", color: "5FA04E", label: "Node.js" },
      { slug: "csharp", color: "512BD4", label: "C#", src: "/logos/csharp.svg" },
    ],
  },
  {
    label: "Datos",
    color: "text-lilac",
    accent: "#9d95ff",
    title: "Prisma, EF Core y SQL",
    body: "Modelado, queries, rendimiento y resiliencia sin magia negra.",
    icons: [
      { slug: "prisma", color: "FFFFFF", label: "Prisma" },
      { slug: "efcore", color: "512BD4", label: "EF Core", src: "/logos/csharp.svg" },
      { slug: "postgresql", color: "4169E1", label: "Postgres" },
    ],
  },
  {
    label: "TypeScript",
    color: "text-pink",
    accent: "#fec5fb",
    title: "Tipos que trabajan por ti",
    body: "Primitivos, generics, utility types y arrays — 190+ ejercicios guiados.",
    icons: [
      { slug: "typescript", color: "3178C6", label: "TypeScript" },
      { slug: "javascript", color: "F7DF1E", label: "JavaScript" },
    ],
  },
  {
    label: "DevOps",
    color: "text-brand",
    accent: "#0ae448",
    title: "Git, Docker y calidad",
    body: "Flujos reales, contenedores, testing y checks de código.",
    icons: [
      { slug: "git", color: "F05032", label: "Git" },
      { slug: "docker", color: "2496ED", label: "Docker" },
      { slug: "githubactions", color: "2088FF", label: "CI" },
    ],
  },
  {
    label: "Cloud",
    color: "text-butter",
    accent: "#f5e6a3",
    title: "GCP y serverless",
    body: "Servicios gestionados, IAM y patrones cloud para ir más allá del localhost.",
    icons: [
      { slug: "googlecloud", color: "4285F4", label: "GCP" },
      { slug: "firebase", color: "FFCA28", label: "Firebase" },
      { slug: "netlify", color: "00C7B7", label: "Netlify" },
    ],
  },
];

function logoUrl(icon: TechIcon) {
  if (icon.src) return icon.src;
  return `https://cdn.simpleicons.org/${icon.slug}/${icon.color}`;
}

export default function LearnSections() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-learn-card]", {
        opacity: 0,
        y: 48,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="aprender"
      ref={rootRef}
      className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-28"
    >
      <p className="section-eyebrow">{"{ Qué puedes aprender }"}</p>
      <h2 className="mt-2 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.08] tracking-tight text-cream">
        Rutas claras. Color por disciplina. Práctica de verdad.
      </h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track) => (
          <article
            key={track.label}
            data-learn-card
            className="flex flex-col rounded-[28px] border border-line bg-surface p-6"
          >
            <div
              className="relative mb-5 flex h-28 items-center justify-center gap-5 overflow-hidden rounded-[24px]"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${track.accent}40, transparent 55%), linear-gradient(145deg, ${track.accent}28, #141514 70%)`,
              }}
              aria-hidden
            >
              <div
                className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl"
                style={{ backgroundColor: track.accent }}
              />
              {track.icons.map((icon, i) => (
                <img
                  key={icon.slug}
                  src={logoUrl(icon)}
                  alt=""
                  width={48}
                  height={48}
                  title={icon.label}
                  className={`relative z-[1] h-11 w-11 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] sm:h-12 sm:w-12 ${
                    i === 1 ? "translate-y-[-6px] scale-110" : i === 2 ? "translate-y-[4px]" : ""
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <p className={`text-lg font-medium ${track.color}`}>{track.label}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-cream">
              {track.title}
            </h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
              {track.body}
            </p>
            <a
              href="/aprender"
              className="btn-secondary mt-5 self-start !min-h-10 !px-5 !text-sm"
            >
              Explorar
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
