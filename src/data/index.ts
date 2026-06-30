import type { Module } from "@/lib/types";

// ─── Buenas Practicas (NUEVOS) ──────────────────────────────────────────────
import { DOTNET_BEST_PRACTICES } from "./modules/dotnet-best-practices";
import { REACT_BEST_PRACTICES } from "./modules/react-best-practices";

// ─── Catalogo migrado ───────────────────────────────────────────────────────
import {
  VUE_EXERCISES,
  PINIA_EXERCISES,
  FIREBASE_EXERCISES,
  SQL_EXERCISES,
  VITEST_EXERCISES,
  SECURITY_EXERCISES,
  API_EXERCISES,
  E2E_EXERCISES,
  GIT_EXERCISES,
} from "./modules/legacy-core";
import { NODEJS_PRO_EXERCISES } from "./modules/nodejs";
import { NUXT_EXERCISES } from "./modules/nuxt";
import { VUETIFY_EXERCISES } from "./modules/vuetify";
import { GCP_EXERCISES } from "./modules/gcp";
import { GIT_ADVANCED_EXERCISES } from "./modules/git-advanced";
import { CODE_QUALITY_EXERCISES } from "./modules/code-quality";
import { DOCKER_EXERCISES } from "./modules/docker";
import { TS_PRIMITIVOS } from "./modules/ts-primitivos";
import { TS_INTERFACES } from "./modules/ts-interfaces";
import { TS_TYPES } from "./modules/ts-types";
import { TS_FUNCIONES } from "./modules/ts-funciones";
import { TS_GENERICS } from "./modules/ts-generics";
import { TS_ENUMS } from "./modules/ts-enums";
import { TS_DISCRIMINATED } from "./modules/ts-discriminated";
import { TS_UTILITY_TYPES } from "./modules/ts-utility-types";
import { TS_ARRAYS_MAP } from "./modules/ts-arrays-map";
import { TS_ARRAYS_FILTER } from "./modules/ts-arrays-filter";
import { TS_ARRAYS_REDUCE } from "./modules/ts-arrays-reduce";
import { TS_ARRAYS_FIND } from "./modules/ts-arrays-find";
import { TS_ARRAYS_SOME_EVERY } from "./modules/ts-arrays-some-every";
import { TS_ARRAYS_SORT } from "./modules/ts-arrays-sort";
import { TS_ARRAYS_EXTRAS } from "./modules/ts-arrays-extras";

export const ALL_MODULES: Module[] = [
  // ─── BUENAS PRACTICAS (orden back -> front) ───────────────────────────────
  {
    key: "dotnet-bp",
    name: ".NET Backend Best Practices",
    icon: "🟣",
    badge: "Backend",
    color: "purple",
    group: "Buenas Practicas",
    desc: "Clean Architecture, DDD, CQRS con MediatR, Result, Value Objects, EF Core y seguridad — en orden de construccion.",
    topics: ["Clean Arch", "CQRS", "Result", "EF Core", "JWT"],
    exercises: DOTNET_BEST_PRACTICES,
  },
  {
    key: "react-bp",
    name: "React Frontend Best Practices",
    icon: "⚛️",
    badge: "Frontend",
    color: "cyan",
    group: "Buenas Practicas",
    desc: "Estructura feature-based, Axios + interceptores, TanStack Query, unwrap del ApiResponse, Zod, Zustand y auth — espejo del back.",
    topics: ["TanStack", "Axios", "unwrap", "Zod", "Zustand"],
    exercises: REACT_BEST_PRACTICES,
  },

  // ─── FRONTEND (ecosistema Vue) ────────────────────────────────────────────
  {
    key: "vue",
    name: "Vue 3 Composition API",
    icon: "⚡",
    badge: "Frontend",
    color: "emerald",
    group: "Frontend",
    desc: "Componentes, router, composables, Axios, RBAC, Vuex legacy y slots.",
    topics: ["ref", "router", "composables", "RBAC"],
    exercises: VUE_EXERCISES,
  },
  {
    key: "pinia",
    name: "Pinia State Management",
    icon: "🍍",
    badge: "State",
    color: "yellow",
    group: "Frontend",
    desc: "Stores, getters, actions, storeToRefs y persistencia.",
    topics: ["defineStore", "actions", "getters", "$subscribe"],
    exercises: PINIA_EXERCISES,
  },
  {
    key: "nuxt",
    name: "Nuxt.js 3",
    icon: "💚",
    badge: "SSR",
    color: "green",
    group: "Frontend",
    desc: "SSR, routing, middleware, server API, Pinia hydration y SEO.",
    topics: ["useFetch", "middleware", "Nitro", "SSR"],
    exercises: NUXT_EXERCISES,
  },
  {
    key: "vuetify",
    name: "Vuetify 3",
    icon: "🎨",
    badge: "UI",
    color: "teal",
    group: "Frontend",
    desc: "Material Design, forms, data-table, drawer, theming y a11y.",
    topics: ["v-data-table", "v-form", "MD3", "theme"],
    exercises: VUETIFY_EXERCISES,
  },

  // ─── BACKEND & DATOS ──────────────────────────────────────────────────────
  {
    key: "nodejs",
    name: "Node.js Backend",
    icon: "🟢",
    badge: "Backend",
    color: "lime",
    group: "Backend & Datos",
    desc: "API REST, JWT, middleware, interceptors, CORS, rate limit, clean architecture, Prisma ORM, .env y seguridad.",
    topics: ["JWT", "middleware", "Prisma", "CORS", "clean architecture"],
    exercises: NODEJS_PRO_EXERCISES,
  },
  {
    key: "sql",
    name: "SQL Server Pro",
    icon: "🗄️",
    badge: "Database",
    color: "cyan",
    group: "Backend & Datos",
    desc: "JOINS, funciones, indices, triggers, vistas y seguridad RLS.",
    topics: ["JOINS", "INDEX", "TRIGGER", "RLS"],
    exercises: SQL_EXERCISES,
  },

  // ─── CLOUD & SERVERLESS ───────────────────────────────────────────────────
  {
    key: "gcp",
    name: "Google Cloud Platform",
    icon: "☁️",
    badge: "Cloud",
    color: "blue",
    group: "Cloud & Serverless",
    desc: "Cloud Functions, Cloud Run, IAM, Logging, Secret Manager y CI/CD.",
    topics: ["Cloud Run", "IAM", "Pub/Sub", "App Check"],
    exercises: GCP_EXERCISES,
  },
  {
    key: "firebase",
    name: "Firebase Platform",
    icon: "🔥",
    badge: "BaaS",
    color: "orange",
    group: "Cloud & Serverless",
    desc: "Auth, Firestore CRUD, transactions, Hosting, App Check, roles e IAM.",
    topics: ["Auth", "Firestore", "Hosting", "Rules"],
    exercises: FIREBASE_EXERCISES,
  },

  // ─── DEVOPS & GIT ─────────────────────────────────────────────────────────
  {
    key: "git",
    name: "Git & DevOps",
    icon: "🔧",
    badge: "DevOps",
    color: "slate",
    group: "DevOps & Git",
    desc: "Branches, rebase, conflicts, conventional commits y CI/CD.",
    topics: ["branch", "rebase", "actions", "ESLint"],
    exercises: GIT_EXERCISES,
  },
  {
    key: "git-advanced",
    name: "Git Flow & Monorepos",
    icon: "🌳",
    badge: "Git Pro",
    color: "stone",
    group: "DevOps & Git",
    desc: "Git Flow, Trunk Based, feature flags, Husky, semantic-release y workspaces.",
    topics: ["git flow", "trunk", "monorepo", "Husky"],
    exercises: GIT_ADVANCED_EXERCISES,
  },
  {
    key: "docker",
    name: "Docker & Kubernetes",
    icon: "🐳",
    badge: "DevOps",
    color: "sky",
    group: "DevOps & Git",
    desc: "Contenedores, imagenes, volumenes, redes, Dockerfile, multi-stage, Compose, BuildX, GitHub Actions y Kubernetes.",
    topics: ["CLI", "Dockerfile", "Compose", "CI/CD", "K8s"],
    exercises: DOCKER_EXERCISES,
  },

  // ─── APIS & SEGURIDAD ─────────────────────────────────────────────────────
  {
    key: "api",
    name: "Axios & Fetch API",
    icon: "🌐",
    badge: "HTTP",
    color: "rose",
    group: "APIs & Seguridad",
    desc: "GET, POST, error handling, interceptors, abort y progress.",
    topics: ["fetch", "axios", "interceptors", "AbortController"],
    exercises: API_EXERCISES,
  },
  {
    key: "security",
    name: "Security: OAuth2 & JWT",
    icon: "🔑",
    badge: "Security",
    color: "purple",
    group: "APIs & Seguridad",
    desc: "JWT, PKCE, CORS, CSP, HTTPS, Firebase Rules y XSS defense.",
    topics: ["JWT", "PKCE", "CORS", "CSP"],
    exercises: SECURITY_EXERCISES,
  },

  // ─── TESTING & CALIDAD ────────────────────────────────────────────────────
  {
    key: "vitest",
    name: "Vitest & Testing",
    icon: "🧪",
    badge: "QA",
    color: "amber",
    group: "Testing & Calidad",
    desc: "Aserciones, mocks, async, VTU, snapshots y store testing.",
    topics: ["toBe", "vi.fn", "mount", "snapshot"],
    exercises: VITEST_EXERCISES,
  },
  {
    key: "e2e",
    name: "E2E: Cypress & Playwright",
    icon: "🎭",
    badge: "E2E",
    color: "pink",
    group: "Testing & Calidad",
    desc: "Navegacion, formularios, intercept, a11y, component testing y CI.",
    topics: ["cy.visit", "getByRole", "intercept", "CI"],
    exercises: E2E_EXERCISES,
  },
  {
    key: "code-quality",
    name: "Calidad de Codigo",
    icon: "✨",
    badge: "Quality",
    color: "violet",
    group: "Testing & Calidad",
    desc: "ESLint flat config, Prettier, SonarQube, coverage y arquitectura SRP.",
    topics: ["ESLint", "SonarQube", "Prettier", "SRP"],
    exercises: CODE_QUALITY_EXERCISES,
  },

  // ─── TYPESCRIPT ───────────────────────────────────────────────────────────
  {
    key: "ts-primitivos",
    name: "TS: Primitivos",
    icon: "💙",
    badge: "TS Core",
    color: "blue",
    group: "TypeScript",
    desc: "string, number, boolean, null, unknown, never, tuplas y as const.",
    topics: ["string", "unknown", "never", "as const", "tuple"],
    exercises: TS_PRIMITIVOS,
  },
  {
    key: "ts-interfaces",
    name: "TS: Interfaces y Props",
    icon: "📐",
    badge: "TS Core",
    color: "blue",
    group: "TypeScript",
    desc: "Contratos, extends, merging, generic interfaces y fluent API.",
    topics: ["interface", "extends", "readonly", "implements"],
    exercises: TS_INTERFACES,
  },
  {
    key: "ts-types",
    name: "TS: Types & Unions",
    icon: "🔀",
    badge: "TS Core",
    color: "blue",
    group: "TypeScript",
    desc: "Unions, intersections, guards, conditional types y satisfies.",
    topics: ["union", "intersection", "guard", "mapped", "infer"],
    exercises: TS_TYPES,
  },
  {
    key: "ts-funciones",
    name: "TS: Funciones Tipadas",
    icon: "⚙️",
    badge: "TS Core",
    color: "blue",
    group: "TypeScript",
    desc: "Retornos, overloads, callbacks, type predicates y asserts.",
    topics: ["return type", "overload", "is", "asserts", "pipe"],
    exercises: TS_FUNCIONES,
  },
  {
    key: "ts-generics",
    name: "TS: Generics",
    icon: "🧬",
    badge: "TS Advanced",
    color: "indigo",
    group: "TypeScript",
    desc: "Constraints, keyof, Repository<T>, mapped types y builders.",
    topics: ["<T>", "extends", "keyof", "conditional", "infer"],
    exercises: TS_GENERICS,
  },
  {
    key: "ts-enums",
    name: "TS: Enums",
    icon: "🏷️",
    badge: "TS Core",
    color: "blue",
    group: "TypeScript",
    desc: "String/numeric enums, const enum, Record map y alternatives.",
    topics: ["enum", "const enum", "Record", "as const"],
    exercises: TS_ENUMS,
  },
  {
    key: "ts-discriminated",
    name: "TS: Discriminated Unions",
    icon: "🎯",
    badge: "TS Patterns",
    color: "violet",
    group: "TypeScript",
    desc: "Result types, state machines, event emitters y visitor pattern.",
    topics: ["kind", "never", "Result", "state machine"],
    exercises: TS_DISCRIMINATED,
  },
  {
    key: "ts-utility",
    name: "TS: Utility Types",
    icon: "🛠️",
    badge: "TS Advanced",
    color: "indigo",
    group: "TypeScript",
    desc: "Pick, Omit, Partial, Record, Extract, ReturnType y custom.",
    topics: ["Pick", "Omit", "Partial", "Record", "Awaited"],
    exercises: TS_UTILITY_TYPES,
  },

  // ─── TS ARRAYS ────────────────────────────────────────────────────────────
  {
    key: "ts-arr-map",
    name: "TS: Arrays — .map()",
    icon: "🔄",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "Transformar, extraer, reshape, spread e index con map.",
    topics: ["map", "transform", "reshape", "spread"],
    exercises: TS_ARRAYS_MAP,
  },
  {
    key: "ts-arr-filter",
    name: "TS: Arrays — .filter()",
    icon: "🔍",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "Filtrar por condicion, nulls, busqueda, dedupe y discriminated.",
    topics: ["filter", "predicate", "null", "type guard"],
    exercises: TS_ARRAYS_FILTER,
  },
  {
    key: "ts-arr-reduce",
    name: "TS: Arrays — .reduce()",
    icon: "📊",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "Sumatorias, groupBy, flatten, keyBy y pipeline de funciones.",
    topics: ["reduce", "accumulator", "groupBy", "keyBy"],
    exercises: TS_ARRAYS_REDUCE,
  },
  {
    key: "ts-arr-find",
    name: "TS: Arrays — .find()",
    icon: "🎯",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "find, findIndex, findLast, optional chaining y findOrThrow.",
    topics: ["find", "findIndex", "?.", "??"],
    exercises: TS_ARRAYS_FIND,
  },
  {
    key: "ts-arr-some-every",
    name: "TS: Arrays — .some()/.every()",
    icon: "✅",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "Validaciones, permisos, duplicados y vacuous truth.",
    topics: ["some", "every", "includes", "validate"],
    exercises: TS_ARRAYS_SOME_EVERY,
  },
  {
    key: "ts-arr-sort",
    name: "TS: Arrays — .sort()",
    icon: "📈",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "Numerico, localeCompare, multi-criterio e Intl.Collator.",
    topics: ["sort", "toSorted", "compare", "Collator"],
    exercises: TS_ARRAYS_SORT,
  },
  {
    key: "ts-arr-extras",
    name: "TS: Arrays — Extras",
    icon: "✨",
    badge: "Arrays",
    color: "sky",
    group: "TS Arrays",
    desc: "flat, flatMap, includes, at, from, entries, splice y slice.",
    topics: ["flat", "flatMap", "at", "splice", "slice"],
    exercises: TS_ARRAYS_EXTRAS,
  },
];

/** Grupos unicos preservando el orden de aparicion. */
export const MODULE_GROUPS: string[] = Array.from(
  new Set(ALL_MODULES.map((m) => m.group || "Otros")),
);
