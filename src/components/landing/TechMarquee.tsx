type Tech = {
  name: string;
  slug?: string;
  color?: string;
  src?: string;
};

const STACKS: {
  label: string;
  description: string;
  accent: string;
  className: string;
  techs: Tech[];
}[] = [
  {
    label: "Frontend",
    description: "Interfaces modernas y experiencias rápidas.",
    accent: "#61dafb",
    className: "lg:col-span-2",
    techs: [
      { name: "React", slug: "react", color: "61DAFB" },
      { name: "Vue", slug: "vuedotjs", color: "4FC08D" },
      { name: "Astro", slug: "astro", color: "FF5D01" },
      { name: "Vite", slug: "vite", color: "646CFF" },
    ],
  },
  {
    label: "Lenguajes",
    description: "Tipos, patrones y código mantenible.",
    accent: "#9d95ff",
    className: "",
    techs: [
      { name: "TypeScript", slug: "typescript", color: "3178C6" },
      { name: "C#", src: "/logos/csharp.svg" },
    ],
  },
  {
    label: "Backend",
    description: "APIs y servicios listos para producción.",
    accent: "#a8e6a1",
    className: "",
    techs: [
      { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
      { name: ".NET", slug: "dotnet", color: "512BD4" },
    ],
  },
  {
    label: "Datos",
    description: "Modelado, consultas y persistencia.",
    accent: "#fec5fb",
    className: "lg:col-span-2",
    techs: [
      { name: "Prisma", slug: "prisma", color: "FFFFFF" },
      { name: "EF Core", src: "/logos/csharp.svg" },
      { name: "SQL Server", src: "/logos/sql-server.svg" },
    ],
  },
  {
    label: "Entrega",
    description: "Del commit a producción.",
    accent: "#ff8709",
    className: "sm:col-span-2 lg:col-span-3",
    techs: [
      { name: "Git", slug: "git", color: "F05032" },
      { name: "Docker", slug: "docker", color: "2496ED" },
      { name: "AWS", src: "/logos/aws.svg" },
      { name: "Netlify", slug: "netlify", color: "00C7B7" },
    ],
  },
];

function techLogoSrc(tech: Tech) {
  if ("src" in tech) return tech.src;
  return `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;
}

export default function TechMarquee() {
  return (
    <section id="tecnologias" className="border-y border-line bg-surface-2/60 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-eyebrow text-brand">{"{ Tu toolkit }"}</p>
            <h2 className="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-cream">
              Aprende cómo encajan, no solo sus nombres.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted lg:justify-self-end sm:text-lg">
            Del navegador a la nube: practica cada tecnología dentro de un
            contexto real y entiende qué problema resuelve en el stack.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACKS.map((stack, stackIndex) => (
            <article
              key={stack.label}
              className={`group relative overflow-hidden rounded-[28px] border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-float ${stack.className}`}
              style={{ "--stack-accent": stack.accent } as React.CSSProperties}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full opacity-15 blur-3xl transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: stack.accent }}
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-faint">
                    0{stackIndex + 1}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold text-cream">
                    {stack.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{stack.description}</p>
                </div>
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]"
                  style={{ color: stack.accent, backgroundColor: stack.accent }}
                  aria-hidden="true"
                />
              </div>

              <div className="relative mt-8 flex flex-wrap gap-2.5">
                {stack.techs.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2.5 rounded-full border border-line-soft bg-canvas/70 py-2 pl-2 pr-3.5 transition group-hover:border-line"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated">
                      <img
                        src={techLogoSrc(tech)}
                        alt=""
                        width={22}
                        height={22}
                        className="h-5 w-5 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold text-cream">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
