import type { Exercise, Module } from "@/lib/types";
import { COURSE_DEFINITIONS } from "@/data/courseDefinitions";

export interface CourseMeta {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  position: number;
}

export interface Course extends CourseMeta {
  modules: Module[];
  topics: string[];
  exerciseCount: number;
}

export interface CurriculumItem {
  moduleKey: string;
  moduleName: string;
  moduleIcon: string;
  exerciseRef: number;
  title: string;
  category: string;
  step?: number;
  description: string;
  objective: string;
  position: number;
}

const META_BY_GROUP: Record<string, Omit<CourseMeta, "key" | "position">> = {
  AWS: {
    name: "Amazon Web Services",
    description:
      "Ruta completa de AWS: identidad, cómputo, almacenamiento, redes, datos, serverless y mensajería.",
    icon: "☁️",
    color: "orange",
  },
  TypeScript: {
    name: "TypeScript",
    description:
      "Fundamentos y patrones avanzados del sistema de tipos para construir aplicaciones más seguras.",
    icon: "TS",
    color: "blue",
  },
  "TS Arrays": {
    name: "TypeScript: Arrays",
    description:
      "Domina transformación, búsqueda, reducción, ordenamiento y validación de colecciones.",
    icon: "[]",
    color: "sky",
  },
  Python: {
    name: "Python: camino a Django",
    description:
      "Ruta progresiva de Python: fundamentos, diseño con clases, archivos, pruebas y conceptos web para dar el salto a Django.",
    icon: "🐍",
    color: "emerald",
  },
  Frontend: {
    name: "Frontend moderno",
    description:
      "Vue, Nuxt, Pinia y Vuetify para construir experiencias web mantenibles y accesibles.",
    icon: "⚡",
    color: "emerald",
  },
  "Backend & Datos": {
    name: "Backend y datos",
    description:
      "Node.js, Prisma, SQL Server y Entity Framework para servicios robustos y escalables.",
    icon: "</>",
    color: "lime",
  },
  "Cloud & Serverless": {
    name: "Cloud y serverless",
    description:
      "Servicios administrados, funciones, eventos y despliegues sobre plataformas cloud.",
    icon: "☁",
    color: "blue",
  },
  "DevOps & Git": {
    name: "DevOps y Git",
    description:
      "Flujos Git, terminal, contenedores, automatización y entrega continua.",
    icon: "⌘",
    color: "sky",
  },
  "APIs & Seguridad": {
    name: "APIs y seguridad",
    description:
      "HTTP, autenticación, OWASP y prácticas defensivas para aplicaciones modernas.",
    icon: "◈",
    color: "rose",
  },
  "Testing & Calidad": {
    name: "Testing y calidad",
    description:
      "Pruebas unitarias y E2E, análisis estático y hábitos para entregar software confiable.",
    icon: "✓",
    color: "amber",
  },
  "Buenas Practicas": {
    name: "Buenas prácticas",
    description:
      "Patrones senior de arquitectura y desarrollo para frontend y backend.",
    icon: "★",
    color: "purple",
  },
  "SOLID & Clean Code": {
    name: "SOLID y Clean Code",
    description:
      "Principios de diseño, deuda técnica y refactorización orientada a intención.",
    icon: "{}",
    color: "violet",
  },
};

export function courseKeyFromGroup(group: string): string {
  const defined = COURSE_DEFINITIONS.find((course) => course.group === group);
  if (defined) return defined.key;
  return group
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function courseKeyForModule(module: Module): string {
  return module.courseKey || courseKeyFromGroup(module.group || "Otros");
}

export function buildCourses(modules: Module[]): Course[] {
  const grouped = new Map<string, Module[]>();
  const labels = new Map<string, string>();

  for (const module of modules) {
    const group = module.group || "Otros";
    const key = courseKeyForModule(module);
    const list = grouped.get(key) ?? [];
    list.push(module);
    grouped.set(key, list);
    labels.set(key, group);
  }

  return Array.from(grouped.entries()).map(([key, courseModules], position) => {
    const group = labels.get(key) ?? "Otros";
    const meta = META_BY_GROUP[group];
    const topics = Array.from(
      new Set(courseModules.flatMap((module) => module.topics)),
    );
    return {
      key,
      name: meta?.name ?? group,
      description:
        meta?.description ??
        `Aprende ${group} con teoría breve y práctica guiada.`,
      icon: meta?.icon ?? courseModules[0]?.icon ?? "{}",
      color: meta?.color ?? courseModules[0]?.color ?? "blue",
      position,
      modules: courseModules,
      topics: topics.slice(0, 12),
      exerciseCount: courseModules.reduce(
        (total, module) => total + module.exercises.length,
        0,
      ),
    };
  });
}

export function curriculumFromModules(modules: Module[]): CurriculumItem[] {
  return modules.flatMap((module) =>
    module.exercises.map((exercise: Exercise, position) => ({
      moduleKey: module.key,
      moduleName: module.name,
      moduleIcon: module.icon,
      exerciseRef: exercise.id,
      title: exercise.title,
      category: exercise.category,
      step: exercise.step,
      description: exercise.description,
      objective: exercise.objective,
      position,
    })),
  );
}

