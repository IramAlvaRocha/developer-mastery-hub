export interface CourseDefinition {
  key: string;
  group: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Los grupos históricos pasan a ser cursos padre. `group` se conserva como
 * clave de migración mientras la UI termina de adoptar `course_key`.
 */
export const COURSE_DEFINITIONS: readonly CourseDefinition[] = [
  {
    key: "aws",
    group: "AWS",
    name: "Amazon Web Services",
    description: "Fundamentos, datos, redes y arquitecturas serverless en AWS.",
    icon: "☁️",
    color: "orange",
  },
  {
    key: "best-practices",
    group: "Buenas Practicas",
    name: "Buenas Prácticas",
    description: "Prácticas profesionales para backend y frontend.",
    icon: "✅",
    color: "cyan",
  },
  {
    key: "solid-clean-code",
    group: "SOLID & Clean Code",
    name: "SOLID & Clean Code",
    description: "Diseño mantenible, deuda técnica y principios SOLID.",
    icon: "🧱",
    color: "violet",
  },
  {
    key: "frontend",
    group: "Frontend",
    name: "Frontend",
    description: "Vue, Nuxt, estado y sistemas de interfaz.",
    icon: "🖥️",
    color: "emerald",
  },
  {
    key: "backend-data",
    group: "Backend & Datos",
    name: "Backend & Datos",
    description: "Node.js, ORM, SQL y persistencia para aplicaciones backend.",
    icon: "🗄️",
    color: "lime",
  },
  {
    key: "cloud-serverless",
    group: "Cloud & Serverless",
    name: "Cloud & Serverless",
    description: "Plataformas cloud, servicios administrados y serverless.",
    icon: "🌐",
    color: "blue",
  },
  {
    key: "devops-git",
    group: "DevOps & Git",
    name: "DevOps & Git",
    description: "Control de versiones, terminal, contenedores y entrega continua.",
    icon: "🔧",
    color: "slate",
  },
  {
    key: "apis-security",
    group: "APIs & Seguridad",
    name: "APIs & Seguridad",
    description: "HTTP, autenticación y desarrollo seguro.",
    icon: "🛡️",
    color: "rose",
  },
  {
    key: "testing-quality",
    group: "Testing & Calidad",
    name: "Testing & Calidad",
    description: "Pruebas automatizadas, análisis y calidad de código.",
    icon: "🧪",
    color: "amber",
  },
  {
    key: "typescript",
    group: "TypeScript",
    name: "TypeScript",
    description: "Fundamentos y patrones avanzados del sistema de tipos.",
    icon: "💙",
    color: "blue",
  },
  {
    key: "typescript-arrays",
    group: "TS Arrays",
    name: "TypeScript Arrays",
    description: "Transformación, búsqueda y agregación de colecciones tipadas.",
    icon: "📚",
    color: "sky",
  },
  {
    key: "python",
    group: "Python",
    name: "Python: camino a Django",
    description: "De la sintaxis y la resolución de problemas a las bases de backend necesarias para comenzar con Django.",
    icon: "🐍",
    color: "emerald",
  },
] as const;

const COURSE_KEY_BY_GROUP = new Map(
  COURSE_DEFINITIONS.map((course) => [course.group, course.key]),
);

export function getCourseKeyForGroup(group: string | undefined): string {
  const courseKey = group ? COURSE_KEY_BY_GROUP.get(group) : undefined;
  if (!courseKey) {
    throw new Error(`No existe un curso padre para el grupo "${group ?? ""}"`);
  }
  return courseKey;
}
