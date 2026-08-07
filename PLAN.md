# Plan: Login + Base de Datos — Developer Mastery Hub

> Estado: **Aprobado, pendiente de implementación**
> Fecha: 2026-08-04

## Decisiones tomadas

| Decisión | Elección |
|---|---|
| Backend / BD | **Supabase** (Postgres + Auth + APIs automáticas, tier gratis) |
| Contenido (cursos/ejercicios) | **Todo a la BD** + panel admin con CRUD (seed desde los archivos TS actuales) |
| Login | **Email + contraseña** y **Google OAuth** |
| Acceso | **Login obligatorio** (sin modo anónimo) |
| Registro | **Abierto** (cualquiera puede crear cuenta; admin se promueve manualmente) |
| Despliegue | Indefinido → arquitectura **estática + cliente Supabase**, desplegable en cualquier hosting |

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│  Astro 5 (estático — Vercel, Netlify, VPS,      │
│  GitHub Pages, etc.)                            │
│                                                 │
│  React islands ──► @supabase/supabase-js        │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS (auth + datos)
┌──────────────────────▼──────────────────────────┐
│  Supabase                                       │
│  ├── Auth (email/contraseña + Google OAuth)     │
│  ├── Postgres (tablas + Row Level Security)     │
│  └── Dashboard (gestión manual)                 │
└─────────────────────────────────────────────────┘
```

**Por qué así:** el sitio sigue estático (sin servidor que mantener, hosting libre),
la seguridad vive en Postgres con **RLS** (la anon key es segura de exponer en el
cliente), y el login obligatorio se resuelve con un "gate" del lado del cliente que
redirige a `/login`.

## 1. Esquema de base de datos (`supabase/schema.sql`)

### `profiles` — perfil ligado a `auth.users`
- `id` uuid PK → `auth.users(id)` ON DELETE CASCADE
- `email` text NOT NULL
- `display_name` text
- `avatar_url` text
- `role` text NOT NULL DEFAULT `'student'` CHECK (`admin` | `student`)
- `created_at` timestamptz DEFAULT now()
- **Trigger:** al insertarse un usuario en `auth.users` se crea su fila aquí automáticamente.

### `modules` — catálogo de cursos
- `key` text PK (ej. `dotnet-bp`)
- `name`, `icon`, `badge`, `color`, `"group"`, `description` (text)
- `topics` text[] DEFAULT '{}'
- `position` int DEFAULT 0
- `is_published` boolean DEFAULT true

### `exercises` — ejercicios por módulo
- `id` bigint identity PK
- `module_key` text FK → `modules(key)` ON DELETE CASCADE
- `exercise_ref` int NOT NULL (id original dentro del módulo) — UNIQUE con `module_key`
- `title` text NOT NULL, `stars` int DEFAULT 1, `category` text, `step` int
- `description`, `objective` text
- `tags` text[] DEFAULT '{}'
- `file_name`, `instruction`, `theory`, `explanation_text` text
- `code_snippet` text NOT NULL
- `inputs` jsonb DEFAULT '{}' (mapa INPUT_N → ExpectedAnswer)
- `complete_code` text
- `simulation` jsonb NULL (ShellScenario, solo Bash)
- `position` int DEFAULT 0, `is_published` boolean DEFAULT true

### `progress` — ejercicios completados por usuario
- PK compuesta: `(user_id, module_key, exercise_ref)`
- `user_id` uuid FK → `profiles(id)` ON DELETE CASCADE
- `module_key` text FK → `modules(key)` ON DELETE CASCADE
- `completed_at` timestamptz DEFAULT now()

### `user_state` — "Continuar donde lo dejaste"
- `user_id` uuid PK → `profiles(id)` ON DELETE CASCADE
- `last_module_key` text, `last_exercise_index` int
- `updated_at` timestamptz DEFAULT now()

### Políticas RLS
| Tabla | Lectura | Escritura |
|---|---|---|
| `profiles` | el usuario solo su fila; admin todas | el usuario solo su fila |
| `modules` / `exercises` | autenticados donde `is_published = true`; admin ve todo | solo `admin` (INSERT/UPDATE/DELETE) |
| `progress` / `user_state` | solo el propio usuario | solo el propio usuario |

## 2. Autenticación

- **Página `/login`**: formulario email/contraseña (entrar / crear cuenta) + botón
  "Continuar con Google". Estilo según `DESIGN.md`.
- `src/lib/auth/AuthContext.tsx`: provider con `onAuthStateChange` de Supabase;
  hook `useAuth()` → `{ user, role, loading, signOut }`.
- **AuthGate**: envuelve `index.astro` y `admin.astro`; sin sesión → redirect a
  `/login`. `/admin` además exige `role = 'admin'`.
- **UserMenu** en `MasteryHub`: avatar/nombre + cerrar sesión.
- Las API keys de IA (Gemini/Groq/OpenRouter) siguen en localStorage por usuario —
  sin cambios.

## 3. Migración de contenido (`scripts/seed.ts`)

- `npm run seed` → `tsx scripts/seed.ts`
- Importa `ALL_MODULES` de `src/data` y hace **upsert idempotente** de los ~30
  módulos y cientos de ejercicios (usa `SUPABASE_SERVICE_ROLE_KEY`, solo en el
  script, nunca en el cliente ni en el bundle).
- **Regla post-migración:** la BD se convierte en la fuente de verdad. El seed NO se
  re-ejecuta una vez que el panel admin está en uso (pisaría ediciones manuales).

## 4. Capa de datos y progreso en la nube

- Nuevo hook `src/lib/useModules.ts`: carga módulos+ejercicios desde Supabase con
  **caché en localStorage** (stale-while-revalidate: pinta al instante con caché,
  revalida en segundo plano) + skeleton de carga. `MasteryHub` deja de importar
  `ALL_MODULES` estático.
- Refactor de `src/lib/useProgress.ts`: **misma interfaz pública** (`isCompleted`,
  `markComplete`, `getPercent`, `lastVisited`, `setLastVisited`, export/import) pero
  leyendo/escribiendo `progress` y `user_state` en Supabase. UI optimista + sync en
  segundo plano. Export/import JSON se conserva como backup personal.

## 5. Panel de administración (`/admin`)

- Lista de módulos: crear, editar metadatos, publicar/despublicar, reordenar.
- Editor de ejercicios por módulo: todos los campos (snippet con `[INPUT_N]`,
  respuestas esperadas, teoría, solución, simulación) con vista previa.
- Solo accesible con `role = 'admin'` (RLS + AuthGate).

## 6. Variables de entorno (`.env`, no commitear)

```bash
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...          # segura en cliente (RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # SOLO scripts/seed.ts
```

## 7. Archivos

**Nuevos:**
```
supabase/schema.sql
scripts/seed.ts
.env
src/lib/supabase.ts
src/lib/auth/AuthContext.tsx
src/lib/useModules.ts
src/components/auth/AuthGate.tsx
src/components/auth/LoginForm.tsx
src/components/auth/UserMenu.tsx
src/components/admin/AdminPanel.tsx      (+ formularios de módulo/ejercicio)
src/pages/login.astro
src/pages/admin.astro
```

**Modificados:**
```
package.json                 # +@supabase/supabase-js, +tsx (dev), script "seed"
.gitignore                   # +.env
src/components/MasteryHub.tsx
src/lib/useProgress.ts
src/pages/index.astro        # envolver en AuthGate
README.md                    # setup: env vars, Google OAuth, seed, promover admin
```

## 8. Orden de ejecución (verificación por fase)

1. **Esquema + env + cliente** → conexión OK (`select count(*) from modules`)
2. **Auth** (login page, AuthGate, AuthContext, UserMenu) → login/logout/registro OK
3. **Seed** → catálogo visible en el dashboard de Supabase
4. **Capa de datos** (`useModules`) → la app renderiza desde la BD
5. **Progreso** (`useProgress` remoto) → persiste entre navegadores/dispositivos
6. **Panel admin** (`/admin`) → CRUD de módulos y ejercicios funcionando
7. **Docs** → README actualizado con todo el setup

## 9. Pasos manuales del usuario (fuera del código)

1. Crear proyecto gratis en https://supabase.com y copiar credenciales a `.env`
2. Ejecutar `supabase/schema.sql` en el SQL Editor del dashboard
3. Google OAuth: crear credenciales en Google Cloud Console → pegar en
   Supabase Dashboard → Authentication → Providers → Google
   (redirect URL: `https://<project>.supabase.co/auth/v1/callback`)
4. Tras registrar la primera cuenta, promoverla a admin:
   `UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';`
5. (Opcional) Activar/desactivar confirmación de email en Auth settings
