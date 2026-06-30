# Developer Mastery Hub 🎓

Plataforma interactiva de preparación para entrevistas de **Desarrollador Full Stack Senior**, construida con **Astro 5 + React 19 (islas) + Tailwind CSS 4**.

## Buenas Prácticas (NUEVO — en orden de construcción back → front)

Dos módulos secuenciados como "Paso N", basados en un proyecto real (`ProductosCrud`) y su `AGENTS.md`:

| Módulo | Pasos | Temas Clave |
|--------|-------|-------------|
| 🟣 .NET Backend Best Practices | 22 | Clean Architecture, DDD, CQRS (MediatR), Result Pattern, Value Objects, Domain Events, EF Core (Query Filters, RowVersion), FluentValidation, Exception Middleware, JWT, permisos por claims, Rate Limiting |
| ⚛️ React Frontend Best Practices | 22 | Estructura feature-based, env/alias, contrato `ApiResponse<T>`, Axios + interceptores (401/429), `TokenManager` en memoria, `unwrap`/`ApiError`, `ApiService` base, TanStack Query (keys, `useQuery`/`useMutation`), `AuthContext`, rutas protegidas, React Hook Form + Zod, Zustand, React Compiler |

Cada paso del back tiene su contraparte en el front (ej. `ApiResponse` en C# ↔ interface en TS, Rate Limiting ↔ retry de 429).

## Catálogo completo (migrado a Astro)

| Grupo | Módulos |
|-------|---------|
| Buenas Practicas | .NET Backend Best Practices, React Frontend Best Practices |
| Frontend | Vue 3, Pinia, Nuxt 3, Vuetify 3 |
| Backend & Datos | Node.js, SQL Server |
| Cloud & Serverless | Google Cloud Platform, Firebase |
| DevOps & Git | Git & DevOps, Git Flow/Monorepos, Bash & Terminal, Docker & K8s |
| APIs & Seguridad | Axios/Fetch, Security (OAuth2/JWT) |
| Testing & Calidad | Vitest, E2E (Cypress/Playwright), Calidad de Código |
| TypeScript | Primitivos, Interfaces, Types & Unions, Funciones, Generics, Enums, Discriminated Unions, Utility Types |
| TS Arrays | map, filter, reduce, find, some/every, sort, extras |

## Funcionalidades

- **Desafíos de código con inputs inline**: rellena campos `[INPUT_N]` directamente sobre el snippet (reemplaza los antiguos comentarios `/*respuesta*/`).
- **Terminal simulada (Bash)**: practica comandos en un shell con filesystem en memoria antes de completar el desafío.
- **Teoría por ejercicio (Bash)**: referencia de comandos y pistas contextuales para no quedarte bloqueado.
- **Secuencia por pasos**: los módulos de buenas prácticas se recorren como "Paso 1 → Paso 22".
- **Mentoría con Gemini IA**: análisis técnico y pistas contextuales por ejercicio.
- **Chatbot de IA**: preguntas libres sobre el módulo activo.
- **Progreso persistente**: guardado automático en `localStorage`.

## Cómo Usar

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # build estático a /dist
npm run preview  # previsualiza el build
```

(Opcional) Configura tu API Key de Gemini en el menú para habilitar las funciones de IA.

## Stack Tecnológico

- **Astro 5** (output estático, islas de React)
- **React 19** (`@astrojs/react`)
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **TypeScript** (strict, alias `@/*`)
- **Gemini AI API** (opcional, para mentoría)

## Estructura

```
src/
  components/   # islas React (MasteryHub, ExerciseWorkspace, ChallengeCode, ...)
  data/
    index.ts    # ALL_MODULES + MODULE_GROUPS
    modules/    # un archivo .ts por módulo de ejercicios
  layouts/      # Base.astro
  lib/          # types, gemini, useProgress, useToasts
  pages/        # index.astro
  styles/       # global.css (Tailwind + safelist de colores)
```

## Licencia

Uso personal — Preparación de entrevistas de Iram Alvarez R.
