# Developer Mastery Hub 🎓

Plataforma interactiva de preparación para entrevistas de **Desarrollador Full Stack Senior**: ejercicios de código con inputs inline, formatos interactivos y terminal simulada, con progreso en la nube y panel de administración.

**Stack:** Astro 6 (estático) · React 19 (islas) · Tailwind CSS 4 · TypeScript strict · GSAP · Supabase (Postgres + Auth + RLS).

## Características

- **Desafíos de código con inputs inline**: rellena campos `[INPUT_N]` directamente sobre el snippet.
- **Formatos interactivos**: predicción de salida, ordenar pasos, elegir snippet, bug hunt, emparejar, completar huecos y Verdadero/Falso.
- **Terminal simulada (Bash)**: practica comandos en un shell con filesystem en memoria.
- **Teoría por ejercicio**: referencia y pistas contextuales para no quedarte bloqueado.
- **Módulos por pasos**: los módulos de buenas prácticas se recorren como "Paso 1 → Paso N" (back → front).
- **Mis Cursos**: suscríbete a módulos, consulta tu progreso y continúa donde lo dejaste.
- **Progreso en la nube**: localStorage como capa local optimista (scoped por usuario) + Supabase como fuente de verdad con sesión. *Cualquier autenticado practica, pero solo los suscritos guardan progreso en la nube*.
- **Panel admin `/admin`**: CRUD de módulos y ejercicios, publicar/despublicar, reordenar y editar payloads de formatos como JSON. Solo accesible con rol `admin`.
- **Seguridad**: Row Level Security en las 6 tablas, roles verificados en servidor y validación de `console.*` en hooks de git.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Astro 6 (output estático) |
| UI | React 19 con islas `client:load` (`@astrojs/react`) |
| Estilos | Tailwind CSS 4 vía PostCSS (`@tailwindcss/postcss` + `postcss.config.mjs`) + tokens de `src/styles/global.css` |
| Tipado | TypeScript strict (alias `@/*`) |
| Animación | GSAP |
| Backend | Supabase: Postgres, Auth (email/pass + Google), PostgREST, Row Level Security |
| Package manager | Bun |

## Arquitectura

```
┌─ Cliente (Astro estático) ────────────────────────────────┐
│  /           Landing público                              │
│  /login      LoginForm (email/contraseña + Google)        │
│  /aprender   AuthGate + MasteryHub (islas React)          │
│  /admin      AdminGateApp (requiere rol admin)            │
└───────────────────────────────┬───────────────────────────┘
                    HTTPS (anon key + sesión JWT)
┌─ Supabase ────────────────────▼───────────────────────────┐
│  Postgres + RLS + Auth + PostgREST                        │
│  profiles · modules · exercises · enrollments             │
│  progress · user_state                                    │
└────────────────────────────────────────────────────────────┘
```

El sitio es 100 % estático: Astro genera `dist/` y cada página monta sus islas React, que hablan con Supabase a través de la anon key. La RLS garantiza que cada usuario solo lee/escribe sus propios datos y que solo los admins modifican el catálogo.

## Requisitos

- **Bun** (>= 1.x) como package manager (también es compatible con Node 18+).
- **Cuenta de Supabase gratuita** (https://supabase.com) para el backend (auth, datos y RLS).

## Configuración (Setup)

### 1. Instalar dependencias

```bash
bun install
```

### 2. Crear el proyecto en Supabase

Crea un proyecto nuevo en el dashboard de Supabase y copia sus credenciales a un archivo `.env` en la raíz del repo:

```bash
PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon key (pública; es segura gracias a la RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # SOLO para scripts/seed.ts — nunca la expongas en el frontend
```

- `<proyecto>` es el subdominio de tu proyecto de Supabase (reemplázalo por el tuyo).
- El archivo `.env` **no se commitea** (está en `.gitignore`).
- Sin `.env`: la app corre en **modo demo** en desarrollo (permite probar la UI sin credenciales) y en producción muestra *"Servicio no configurado"* (fail-closed, no permite el acceso).

### 3. Aplicar el esquema de la base de datos

Abre el **SQL Editor** del dashboard de Supabase y ejecuta el contenido de `supabase/schema.sql`. Es idempotente y crea:

- Las 6 tablas: `profiles`, `modules`, `exercises`, `enrollments`, `progress`, `user_state`.
- Las políticas de **Row Level Security** (lectura de catálogo publicado, datos propios, escrituras solo con suscripción, admin total).
- El trigger que crea el perfil automáticamente al registrarse un usuario.

### 4. Configurar Google OAuth (opcional pero recomendado)

1. Crea unas credenciales OAuth en Google Cloud Console (tipo "Web application").
2. En Supabase: **Dashboard → Authentication → Providers → Google**, pega el Client ID y Client Secret.
3. La redirect URL es `https://<proyecto>.supabase.co/auth/v1/callback`.

### 5. Sembrar el catálogo

```bash
bun run seed
```

Migra los **55 módulos / ~790 ejercicios** de `src/data/` a las tablas `modules` y `exercises` (upsert idempotente, seguro para re-ejecutar; usa la `SUPABASE_SERVICE_ROLE_KEY` para saltarse la RLS).

### 6. Promover la primera cuenta a admin

Regístrate desde `/login` y, una vez creado el perfil, promueve tu cuenta en el SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
```

El panel `/admin` (CRUD de módulos y ejercicios) solo es visible para usuarios con `role = 'admin'`.

### 7. Arrancar

```bash
bun run dev      # http://localhost:4321
```

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo (`http://localhost:4321`) |
| `bun run build` | Build estático a `dist/` |
| `bun run preview` | Previsualiza el build estático |
| `bun run seed` | Migra el catálogo a Supabase (upsert idempotente) |
| `bun run security-check` | Valida que los archivos staged no contengan `console.*` |
| `bun run setup:hooks` | Activa los git hooks (`git config core.hooksPath .githooks`) |
| `bun scripts/security-check.js --all` | Valida todos los archivos fuente (excluye `src/data/`, contenido educativo) |

## Seguridad

- **Row Level Security** en las 6 tablas: el rol `anon` no tiene acceso a los datos y cada usuario autenticado solo ve/edita sus propias filas (o el catálogo publicado).
- **Regla de suscripción**: la RLS de `progress` exige un `enrollments` activo para INSERT/UPDATE — el cliente lo refleja con el aviso *"Suscríbete para guardar tu progreso"*.
- **Admin real en servidor**: `public.is_admin()` es una función `SECURITY DEFINER` que lee el rol desde `profiles`; el role del cliente nunca se toma de `localStorage` (se resuelve siempre vía el perfil).
- **Service role key** solo se usa en `scripts/seed.ts` (nunca en el frontend).
- **Headers y CSP** en producción (`public/_headers` + meta CSP en `Base.astro`).
- **Sin `console.log`**: hook de git + `bun run security-check` rechazan commits con llamadas a consola.
- Recomendado: `bun audit` periódico para revisar vulnerabilidades de dependencias.

## Estructura del proyecto

```
postcss.config.mjs      # Tailwind 4 vía PostCSS (compatible Astro 6 / Vite 8)
supabase/
  schema.sql            # tablas + RLS + trigger de perfil (idempotente)
scripts/
  seed.ts               # migra el catálogo a Supabase
  security-check.js     # valida ausencia de console.*
src/
  data/
    index.ts            # ALL_MODULES + MODULE_GROUPS (55 módulos)
    modules/            # un archivo .ts por módulo (ejercicios legacy y con formato)
    enrichment/         # módulos de buenas prácticas (back/front, por pasos)
  lib/
    supabase.ts         # cliente singleton + isSupabaseConfigured
    auth/               # AuthContext, authStub
    useModules.ts       # catálogo (estático/demo o Supabase)
    useProgress.ts      # progreso local (scoped) + nube + migración al suscribirse
    useEnrollments.ts   # Mis Cursos
    useAdmin.ts         # CRUD admin de módulos/ejercicios
    formatMeta.ts       # metadatos de formatos interactivos
    formatValidation.ts # validación de payloads de formato (panel admin)
    shell/simulator.ts  # terminal simulada (Bash)
    types.ts            # Exercise, Module, formatos
    answers.ts          # ExpectedAnswer e isAnswerCorrect
    moduleColors.ts     # paleta por módulo (.mod-*)
    useToasts.ts        # sistema de toasts
    useReducedMotion.ts # fallback prefers-reduced-motion
  components/
    auth/               # AuthGate, AuthGateApp, LoginForm, UserMenu
    admin/              # AdminPanel, ModuleEditor, ExerciseEditor, ConfirmDialog…
    formats/            # renderers de formatos interactivos
    landing/            # Hero, TechMarquee, LearnSections…
    MasteryHub.tsx      # shell de /aprender
    ExerciseWorkspace.tsx  # workspace del ejercicio
    ChallengeCode.tsx   # código con inputs inline [INPUT_N]
    SimulatedTerminal.tsx  # terminal simulada
    TheoryTab.tsx       # teoría del ejercicio
    SolutionPanel.tsx   # solución / código de referencia
    ExerciseSidebar.tsx # lista de ejercicios del módulo
    ModuleMenu.tsx      # catálogo de módulos
    ModuleCard.tsx      # tarjeta de módulo
    MyCourses.tsx       # Mis Cursos
    SettingsModal.tsx   # ajustes (perfil, exportar/importar progreso)
    Toasts.tsx          # notificaciones
  pages/
    index.astro         # landing público
    login.astro         # LoginForm
    aprender.astro      # AuthGateApp (MasteryHub)
    admin.astro         # AdminGateApp (requireAdmin)
  layouts/
    Base.astro          # shell HTML + tokens + CSP (prod)
  styles/
    global.css          # design tokens (@theme) + clases .ui-card, .btn-*, .mod-*
public/
  _headers              # headers de seguridad (Netlify)
```

## Licencia

Uso personal — Preparación de entrevistas de Iram Alvarez R.
