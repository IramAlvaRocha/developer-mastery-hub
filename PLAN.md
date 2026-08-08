# Plan: Login + Base de Datos + Cursos Suscritos — Developer Mastery Hub

> Estado: **Revisado y aprobado, pendiente de implementación**
> Fecha: 2026-08-07 (revisión v2 — corrige gaps de esquema/auth, añade "Mis Cursos")
> Versión anterior: 2026-08-04

## Decisiones tomadas

| Decisión | Elección |
|---|---|
| Backend / BD | **Supabase** (Postgres + Auth + APIs automáticas, tier gratis) |
| Contenido (cursos/ejercicios) | **Todo a la BD** + panel admin con CRUD (seed desde los archivos TS actuales) |
| Login | **Email + contraseña** y **Google OAuth** |
| Acceso | **Login obligatorio** para la app de aprendizaje (`/aprender`); landing público |
| Registro | **Abierto** (cualquiera puede crear cuenta; admin se promueve manualmente) |
| Catálogo | Dos vistas: **"Catálogo"** (todos los módulos publicados) y **"Mis Cursos"** (solo los suscritos) |
| Suscripción | El usuario **se inscribe** a un curso desde el catálogo; solo los suscritos aparecen en "Mis Cursos" |
| Acceso a ejercicios | **Cualquier autenticado puede hacer ejercicios** de módulos publicados, sin suscripción |
| Guardar progreso | **Solo los suscritos guardan progreso en la nube.** Sin suscripción, se practica en sesión/local pero nada se persiste en Supabase (RLS bloquea el INSERT en `progress`) |
| Migración local→nube | Al **suscribirse** a un módulo, el progreso local de ese módulo (`mastery_hub_<key>`) se migra/mergea a Supabase |
| Despliegue | Indefinido → arquitectura **estática + cliente Supabase**, desplegable en cualquier hosting |

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│  Astro 5 (estático — Vercel, Netlify, VPS,      │
│  GitHub Pages, etc.)                            │
│                                                 │
│  React islands ──► @supabase/supabase-js        │
│  ├─ / (landing público)                         │
│  ├─ /login                                      │
│  ├─ /aprender (AuthGate)                        │
│  └─ /admin (AuthGate + role admin)              │
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
redirige a `/login`. El landing (`/`) se mantiene **público** (marketing y catálogo
de muestra), y la app de aprendizaje (`/aprender`) exige sesión.

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
- `key` text PK (ej. `dotnet-bp`, `solid`, `clean-code`)
- `name`, `icon`, `badge`, `color`, `"group"`, `description` (text)
- `topics` text[] DEFAULT '{}'
- `position` int DEFAULT 0
- `is_published` boolean DEFAULT true
- `updated_at` timestamptz DEFAULT now()

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
- **`format` text NULL** (ExerciseFormat: `prediction`, `ordering`, `snippet-pick`,
  `bug-hunt`, `matching`, `context-dropdown`, `true-false`; NULL = legacy `[INPUT_N]`)
- **`format_payload` jsonb NULL** — UN solo jsonb con el payload del formato
  (`{ prompt, options, correct, pairs, steps, ... }` según el tipo). Alternativa más
  simple y aditiva que una columna por formato; el cliente lo deserializa al tipo
  concreto (`PredictionExercise`, `OrderingExercise`, etc.) usando `format` como
  discriminador. **No usar una columna por formato** para no inflar el esquema.
- `position` int DEFAULT 0, `is_published` boolean DEFAULT true

> **Gap corregido (v2):** la versión v1 solo tenía `inputs` y `simulation`, con lo que
> los ~116+ ejercicios con formatos interactivos (prediction/ordering/matching/snippet-
> pick/bug-hunt/context-dropdown/true-false) se habrían degradado a legacy. Con
> `format` + `format_payload` el seed los migra íntegros y `evaluateFormat` sigue
> funcionando sin cambios.

### `enrollments` — suscripciones del usuario a cursos (NUEVO en v2)
- PK compuesta: `(user_id, module_key)`
- `user_id` uuid FK → `profiles(id)` ON DELETE CASCADE
- `module_key` text FK → `modules(key)` ON DELETE CASCADE
- `enrolled_at` timestamptz DEFAULT now()
- `last_opened_at` timestamptz NULL (para ordenar "Continuar")
- **Propósito:** alimenta la vista **"Mis Cursos"** (solo módulos suscritos) y permite
  un botón "Suscribirse" en el catálogo. **El progreso solo se guarda si hay
  enrollment**: la RLS de `progress` exige `EXISTS (enrollment del usuario+curso)` en
  su policy de INSERT/UPDATE. Quien practica sin suscribirse NO guarda progreso.

### `progress` — ejercicios completados por usuario
- PK compuesta: `(user_id, module_key, exercise_ref)`
- `user_id` uuid FK → `profiles(id)` ON DELETE CASCADE
- `module_key` text FK → `modules(key)` ON DELETE CASCADE
- `exercise_ref` int NOT NULL (se valida que exista en `exercises` con ese `module_key`)
- `completed_at` timestamptz DEFAULT now()
- **RLS escritura:** solo si `auth.uid() = user_id` **Y** existe
  `(auth.uid(), module_key)` en `enrollments`. Sin enrollment → el INSERT falla con
  RLS (el cliente lo maneja mostrando "Suscríbete para guardar tu progreso").

### `user_state` — "Continuar donde lo dejaste"
- `user_id` uuid PK → `profiles(id)` ON DELETE CASCADE
- `last_module_key` text, `last_exercise_index` int
- `updated_at` timestamptz DEFAULT now()

### Políticas RLS
| Tabla | Lectura | Escritura |
|---|---|---|
| `profiles` | el usuario solo su fila; admin todas | el usuario solo su fila |
| `modules` / `exercises` | autenticados donde `is_published = true`; admin ve todo | solo `admin` (INSERT/UPDATE/DELETE) |
| `enrollments` | solo el propio usuario | solo el propio usuario (insert/delete de su fila) |
| `progress` | solo el propio usuario | solo el propio usuario **Y solo si existe enrollment** de `(auth.uid(), module_key)`; sin suscripción el INSERT/UPDATE/DELETE falla |
| `user_state` | solo el propio usuario | solo el propio usuario |

## 2. Autenticación

- **Página `/login`**: formulario email/contraseña (entrar / crear cuenta) + botón
  "Continuar con Google". Estilo según `DESIGN.md`.
- `src/lib/auth/AuthContext.tsx`: provider con `onAuthStateChange` de Supabase;
  hook `useAuth()` → `{ user, role, loading, signOut }`.
- **AuthGate** (CORREGIDO en v2): envuelve **`aprender.astro`** y **`admin.astro`**;
  sin sesión → redirect a `/login`. `/admin` además exige `role = 'admin'`.
  El landing (`index.astro`) se mantiene **público** — solo el CTA "Ir a aprender"
  redirige a `/login` si no hay sesión.
- **Migración del stub (v2):** eliminar `src/lib/authStub.ts` y su uso en
  `MasteryHub.tsx`; reemplazado por `AuthContext`. Los datos del perfil del stub
  (`dmh-auth-stub`) se ignoran (no migran).
- **UserMenu** en `MasteryHub`: avatar/nombre + cerrar sesión.
- Las API keys de IA (Gemini/Groq/OpenRouter) siguen en localStorage por usuario —
  sin cambios.

## 3. Mis Cursos (NUEVO en v2)

**Objetivo:** el usuario ve solo los cursos a los que se suscribió, con su progreso y
botón "Continuar".

- **Catálogo (`/aprender`, vista "Catálogo")**: lista todos los módulos publicados.
  Cada tarjeta muestra botón **"Suscribirse"** (si no está suscrito) o
  **"Continuar"** (si ya lo está, con % de progreso). Al suscribirse → se inserta en
  `enrollments` y la tarjeta cambia a "Continuar".
- **Mis Cursos**: filtro/pestaña en `ModuleMenu` (nuevo `ROUTE_CATEGORIES` id
  `"mis-cursos"`) que solo renderiza los módulos en `enrollments` del usuario.
  Si no hay suscripciones, muestra un empty state con CTA al catálogo.
- **Práctica sin suscripción (DECISIÓN validada):** cualquier autenticado puede abrir
  un módulo publicado y hacer ejercicios **sin suscribirse**. En ese caso:
  - La corrección (correcto/incorrecto) funciona igual.
  - El progreso **NO** se guarda en la nube (la RLS de `progress` lo bloquea).
  - La UI muestra un aviso persistente: **"Suscríbete para guardar tu progreso"**,
    con botón que inserta el `enrollment` y, a partir de ahí, el progreso se guarda.
  - Si el usuario no suscrito ya tenía progreso local (`mastery_hub_<key>`), al
    suscribirse ese progreso se migra/mergea a Supabase.
- **Datos**: `useEnrollments()` (hook nuevo) — carga los `module_key` suscritos,
  con caché en localStorage y SWR (mismo patrón que `useModules`). `markComplete`
  solo escribe en `progress` si existe enrollment; si no, no persiste y la UI avisa.
- **Orden**: "Mis Cursos" ordena por `last_opened_at` DESC (lo más reciente primero).

## 4. Migración de contenido (`scripts/seed.ts`)

- `npm run seed` → `tsx scripts/seed.ts`
- Importa `ALL_MODULES` de `src/data` y hace **upsert idempotente** de los **55
  módulos** (53 actuales + solid + clean-code) y **~790 ejercicios** (747 + 43 de
  SOLID/Clean Code). Usa `SUPABASE_SERVICE_ROLE_KEY`, solo en el script, nunca en el
  cliente ni en el bundle.
- El seed serializa cada ejercicio completo: `format` + `format_payload` (si aplica),
  `inputs`, `simulation`, `theory`, `explanation_text`, `tags`, `step`, etc.
- **Regla post-migración:** la BD se convierte en la fuente de verdad. El seed NO se
  re-ejecuta una vez que el panel admin está en uso (pisaría ediciones manuales).

## 5. Capa de datos y progreso en la nube

- Nuevo hook `src/lib/useModules.ts`: carga módulos+ejercicios desde Supabase con
  **caché en localStorage** (stale-while-revalidate: pinta al instante con caché,
  revalida en segundo plano) + skeleton de carga. `MasteryHub` deja de importar
  `ALL_MODULES` estático. `MODULE_GROUPS` se deriva de los datos remotos.
- Refactor de `src/lib/useProgress.ts`: **misma interfaz pública** (`isCompleted`,
  `markComplete`, `getPercent`, `lastVisited`, `setLastVisited`, export/import) pero
  leyendo/escribiendo `progress` y `user_state` en Supabase. UI optimista + sync en
  segundo plano.
- **Regla de suscripción (DECISIÓN validada):** `markComplete` solo persiste en
  Supabase si existe el enrollment. Si el usuario no está suscrito, `markComplete`
  actualiza el estado en memoria (y opcionalmente en localStorage efímero) pero **no**
  inserta en `progress`; la UI muestra "Suscríbete para guardar tu progreso".
- **Migración local→nube por módulo (v2):** cuando el usuario se **suscribe** a un
  módulo, si existe progreso local de ese módulo (`mastery_hub_<key>`), se hace
  **upsert merge** en `progress` (unión de IDs completados). Así el usuario conserva
  lo que practicó antes de suscribirse. Export/import JSON se conserva como backup.
- **Formato de respuestas (v2):** el cliente serializa/deserializa `format_payload`
  a los tipos de `src/lib/types.ts` (`PredictionExercise`, `OrderingExercise`, etc.).
  `evaluateFormat` no cambia.

## 6. Panel de administración (`/admin`)

- Lista de módulos: crear, editar metadatos, publicar/despublicar, reordenar.
- Editor de ejercicios por módulo: todos los campos (snippet con `[INPUT_N]`,
  respuestas esperadas, **formato interactivo y su payload**, teoría, solución,
  simulación) con vista previa en vivo.
- Métricas (opcional v1): nº de suscriptores por módulo (`enrollments`), % de
  completación promedio.
- Solo accesible con `role = 'admin'` (RLS + AuthGate).

## 7. Variables de entorno (`.env`, no commitear)

```bash
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...          # segura en cliente (RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # SOLO scripts/seed.ts
```

## 8. Archivos

**Nuevos:**
```
supabase/schema.sql
scripts/seed.ts
.env
src/lib/supabase.ts
src/lib/auth/AuthContext.tsx
src/lib/useModules.ts
src/lib/useEnrollments.ts                # NUEVO v2
src/components/auth/AuthGate.tsx
src/components/auth/LoginForm.tsx
src/components/auth/UserMenu.tsx
src/components/MyCourses.tsx             # NUEVO v2 (vista "Mis Cursos")
src/components/admin/AdminPanel.tsx      (+ formularios de módulo/ejercicio)
src/pages/login.astro
src/pages/admin.astro
```

**Modificados:**
```
package.json                 # +@supabase/supabase-js, +tsx (dev), script "seed"
.gitignore                   # +.env
src/components/MasteryHub.tsx
src/components/ModuleMenu.tsx            # + categoría "Mis Cursos"
src/lib/useProgress.ts
src/lib/authStub.ts          # ELIMINAR (v2), reemplazado por AuthContext
src/pages/aprender.astro     # envolver en AuthGate (v2: era index.astro)
src/pages/index.astro        # CTA "Ir a aprender" → /login si no hay sesión
README.md                    # setup: env vars, Google OAuth, seed, promover admin
```

## 9. Orden de ejecución (verificación por fase)

1. **Esquema + env + cliente** → conexión OK (`select count(*) from modules`)
2. **Auth** (login page, AuthGate, AuthContext, UserMenu) → login/logout/registro OK
3. **Seed** → catálogo visible en el dashboard de Supabase (con formatos interactivos)
4. **Capa de datos** (`useModules`) → la app renderiza desde la BD
5. **Progreso** (`useProgress` remoto + migración localStorage) → persiste entre
   navegadores/dispositivos
6. **Mis Cursos** (`enrollments` + `useEnrollments` + vista) → suscribirse/ver
   solo sus cursos
7. **Panel admin** (`/admin`) → CRUD de módulos y ejercicios (con formatos)
8. **Auditoría de seguridad** → revisión OWASP del esquema, RLS y cliente
9. **Docs** → README actualizado con todo el setup

## 10. Pasos manuales del usuario (fuera del código)

1. Crear proyecto gratis en https://supabase.com y copiar credenciales a `.env`
2. Ejecutar `supabase/schema.sql` en el SQL Editor del dashboard
3. Google OAuth: crear credenciales en Google Cloud Console → pegar en
   Supabase Dashboard → Authentication → Providers → Google
   (redirect URL: `https://<project>.supabase.co/auth/v1/callback`)
4. Tras registrar la primera cuenta, promoverla a admin:
   `UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';`
5. (Opcional) Activar/desactivar confirmación de email en Auth settings

## 11. Seguridad (OWASP + Supabase) — revisión obligatoria

> Ejecutar el agente `security-auditor` (`.opencode/agent/security-auditor.md`) antes
> de cada release y en las fases 1, 2, 5 y 7 del plan.

Checklist mínimo:
- **RLS correcta en todas las tablas** (nunca dejar una tabla sin policy).
- **Auth:** sin modo anónimo; `anon` solo `SELECT` de `is_published`; no exponer
  `SUPABASE_SERVICE_ROLE_KEY` en cliente/bundle.
- **SQLi:** usar siempre el cliente de Supabase (sentencias parametrizadas); prohibir
  SQL crudo en el cliente.
- **AuthN/AuthZ:** `/admin` validado por `role` en RLS Y en el gate del cliente.
- **IDOR/BOLA:** `profiles`/`progress`/`enrollments` accedidos siempre por
  `auth.uid()` — nunca por un id pasado del cliente sin verificar.
- **XSS:** los snippets y la teoría se renderizan escapados (sin `dangerouslySetInnerHTML`).
- **Secretos:** `.env` en `.gitignore`; revisar el bundle en cada build.
- **Dependencias:** revisar `npm audit` / `bun audit` antes de merge.
- **Seguridad de la migración:** la key de servicio nunca llega al bundle; verificar
  con el agente tras la fase 3.

## 12. Ideas futuras (backlog)

**Alta prioridad (post-v1 sugerido):**
- **Certificados de módulo**: al completar el 100% de un curso, mostrar un badge de
  "Completado" en Mis Cursos y un certificado descargable (HTML→PDF).
- **Rachas (streaks)**: días consecutivos con al menos un ejercicio completado
  (tabla `streaks` o derivada de `progress`), con indicador visual.
- **Repaso espaciado**: recopilar ejercicios fallados y volver a mostrarlos después
  de 1/3/7 días (tabla `review_queue`).
- **Búsqueda global**: barra de búsqueda sobre ejercicios (título, tags, category).
- **Metadatos de "Mis Cursos"**: progreso agregado, días desde la última visita.

**Media prioridad:**
- **Leaderboard** de progreso por curso (solo entre amigos o del mismo curso).
- **Notificaciones** de recordatorio (email o in-app) si la racha se va a romper.
- **Exportar/importar suscripciones** junto con el backup de progreso.
- **Tema por curso**: colores/iconos editables desde admin y reflejados en la app.

**Baja prioridad / exploración:**
- **PWA offline**: caché de módulos para estudiar sin conexión.
- **Módulos colaborativos**: comentarios/notas por ejercicio (solo autores y admin).
- **Gamificación global**: puntos y niveles por completar ejercicios.
- **Generación de ejercicios con IA**: usar las API keys de IA del usuario para
  generar variantes de práctica (cuidando que no se suban a la BD pública).

## Notas de revisión (v2)

- **Gap 1 corregido:** esquema de `exercises` ahora incluye `format` + `format_payload`.
- **Gap 2 corregido:** AuthGate protege `aprender.astro` y `admin.astro`; landing público.
- **Gap 3 corregido:** migración automática de progreso `localStorage → Supabase` en el
  primer login; `authStub` se elimina.
- **Nuevo:** tabla `enrollments` + vista "Mis Cursos" + hook `useEnrollments`.
- **Nuevo:** fase 8 de auditoría OWASP con agente `security-auditor`.
- **Datos actualizados:** 55 módulos, ~790 ejercicios, 116+ con formatos interactivos.
