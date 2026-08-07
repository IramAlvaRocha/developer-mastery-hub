# 🚀 HANDOFF — Continuar el desarrollo en otra laptop

> **Proyecto:** Developer Mastery Hub
> **Repo:** https://github.com/IramAlvaRocha/developer-mastery-hub.git
> **Rama de trabajo:** `plan-backend`
> **Último commit:** `9fc97f9` (fix UI workspace 9.3/10)
> **Fecha:** 2026-08-07
> **Stack:** Astro 5 + React 19 islands + Tailwind 4 + TypeScript strict + GSAP + Supabase

---

## 1. Cómo arrancar en la laptop nueva

```bash
# 1. Clonar el repo
git clone https://github.com/IramAlvaRocha/developer-mastery-hub.git
cd developer-mastery-hub

# 2. Cambiar a la rama de trabajo
git checkout plan-backend
git pull origin plan-backend

# 3. Instalar dependencias
bun install          # o npm install

# 4. CREAR el .env (las credenciales NO están en git por seguridad)
```

### El `.env` es OBLIGATORIO — no está en el repo

Copia este archivo en la raíz (pídele las credenciales a Iram o cópialas del proyecto en Supabase Dashboard → Settings → API):

```bash
# .env  (NO se commitea)
PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # service_role (SOLO para scripts/seed.ts)
```

> ⚠️ Sin `.env`: la app funciona en **modo demo** (datos locales, auth simulada).
> Con `.env`: funciona en **modo Supabase real** (login, BD, progreso en la nube).
> Cambiar el `.env` requiere `bun run build`/`bun run dev` nuevo (las vars `PUBLIC_*`
> se incrustan en el bundle al compilar).

---

## 2. Estado del proyecto — Qué está hecho

### Backend (Supabase) — fases 1-6 completadas ✅

| Fase | Qué | Commit | Detalle |
|---|---|---|---|
| Docs | PLAN.md v2 + agente security-auditor | `13a4a1f` | Plan con Mis Cursos, formatos, OWASP |
| 1 | Esquema + cliente | `ced8763` | `supabase/schema.sql` (6 tablas + RLS + índices), `src/lib/supabase.ts` |
| 2 | Auth | `57c4e23` | `AuthContext` doble modo (Supabase/demo), LoginForm, AuthGate, UserMenu, login.astro |
| 3 | Seed | `2d415df` | `scripts/seed.ts` (55 módulos / 873 ejercicios / 266 con format) |
| 4 | Capa de datos | `27e64b1` | `useModules.ts` (SWR + caché localStorage) |
| 5 | Progreso remoto | `152536f` | `useProgress.ts` (nube + local optimista + migración) |
| 6 | Mis Cursos | `6ae6574` | `useEnrollments.ts`, `MyCourses.tsx`, botones Suscribirse/Continuar |
| UI | Rediseño workspace | `9fc97f9` | Calificación **9.3/10** por design-director |

### Módulos de contenido ✅
- **55 módulos / ~790 ejercicios** en `src/data/modules/*.ts` (incluye SOLID & Clean Code
  de 22+21 ejercicios, traídos a plan-backend vía cherry-pick `1e88374`).
- Seed verificado en la BD real: `modules=55`, `exercises=873`, `exercises con format=266`.

### Flujo de auth (decisión de negocio IMPORTANTE)
> **"Cualquier autenticado puede practicar, pero solo suscritos guardan progreso en la nube."**
- La RLS de `progress` exige un `enrollment` del usuario+curso (si no, el INSERT falla).
- El cliente detecta el bloqueo (código 42501) y muestra toast "Suscríbete para guardar tu progreso".
- Al suscribirse (`enroll`), `syncModule` migra el progreso local pendiente a la nube.

---

## 3. Qué falta — Próximos pasos

| Fase | Qué | Prioridad | Notas |
|---|---|---|---|
| **7** | **Panel admin `/admin`** | ⏳ Siguiente | CRUD de módulos y ejercicios, publish/unpublish, reordenar. Requiere `role='admin'` (RLS ya lista). Componente `AdminPanel.tsx` + página `admin.astro` con AuthGate `requireAdmin`. |
| **8** | **Auditoría OWASP** | ⏳ Luego | Ejecutar agente `security-auditor` sobre todo lo construido antes de cualquier release. |
| **9** | **Docs README** | ⏳ Al final | Setup completo: env, Google OAuth, seed, promover admin. |
| Post-v1 | Ideas backlog (PLAN.md §12) | 🧠 Futuro | Certificados, rachas, repaso espaciado, búsqueda, leaderboard, PWA. |

### Pendientes menores anotados por los agentes
- `tsc --noEmit` tiene **errores pre-existentes** (no de nuestro trabajo): `scripts/seed.ts`,
  `src/lib/shell/simulator.ts`, `src/data/modules/ef-core-architecture.ts` (falta `@types/node`).
- `LandingShell.tsx` ya migró a enlaces `/login` (sin modales demo).
- Verificar visualmente el workspace en navegador real (auto-nav 650ms + celebración).
- En modo demo, el orden de Mis Cursos por `last_opened_at` no sobrevive recargas.

---

## 4. Arquitectura de la app (mapa rápido)

```
┌─ Astro estático ──────────────────────────────────────────────┐
│  /            → Landing público (Hero, TechMarquee, CTA /login)│
│  /login       → LoginForm (email+pass / Google / modo demo)    │
│  /aprender    → AuthGateApp (AuthProvider+AuthGate+MasteryHub) │
│  /admin       → (pendiente Fase 7) AuthGate requireAdmin       │
└───────────────────────────────────────────────────────────────┘
                 │ HTTPS (auth + datos)
┌─ Supabase ────────────────────────────────────────────────────┐
│  Auth (email/pass + Google)  ── profiles (role student/admin) │
│  Postgres + RLS: modules, exercises, enrollments,             │
│                  progress, user_state                         │
└───────────────────────────────────────────────────────────────┘
```

### Archivos clave
```
supabase/schema.sql               # esquema + RLS + índices + trigger
scripts/seed.ts                   # migración del catálogo (SERVICE_ROLE_KEY)
src/lib/supabase.ts               # cliente público (anon key, safe sin .env)
src/lib/auth/AuthContext.tsx      # useAuth() — doble modo Supabase/demo
src/lib/useModules.ts             # catálogo remoto + caché SWR
src/lib/useProgress.ts            # progreso nube + local + migración
src/lib/useEnrollments.ts         # suscripciones / Mis Cursos
src/lib/answerStorage.ts          # persistencia de respuestas (sessionStorage)
src/components/auth/              # AuthGate, AuthGateApp, LoginForm, UserMenu
src/components/MyCourses.tsx      # vista Mis Cursos
src/components/ExerciseWorkspace.tsx  # el workspace (rediseñado)
src/components/SolutionPanel.tsx  # solución sin cards (callout sage + acento)
src/data/index.ts                 # ALL_MODULES (55 módulos)
```

---

## 5. Comandos útiles

```bash
bun run dev              # servidor de desarrollo
bun run build            # build de producción (verifica que todo compila)
bun run seed             # migrar contenido estático → Supabase (necesita .env + service key)
bun run security-check   # valida que no haya console.log en staged
bun scripts/security-check.js <archivo>   # validar archivos específicos

# Git
git checkout plan-backend && git pull origin plan-backend
```

---

## 6. Agentes opencode disponibles (`.opencode/agent/`)

| Agente | Cuándo usarlo |
|---|---|
| `orchestrator` | El director de operaciones — coordina el pipeline completo |
| `design-director` | Audita/califica la UI de /aprender (rúbrica, objetivo ≥9.0) |
| `dev-executor` | Implementa los rediseños UI según spec del director |
| `security-auditor` | **Revisión OWASP** (fase 8) — esquema, RLS, auth, seed, bundle |
| `solid-clean-code-author` | Crea/enriquece módulos SOLID & Clean Code desde subtítulos |
| `aws-content-author` | Crea módulos AWS DVA-C02 |
| `exercise-variety-designer` | Formatos interactivos de ejercicios |
| `explanation-reviewer` | Calidad pedagógica de las explicaciones |

> ⚠️ Los agentes se cargan al iniciar opencode. Si creas/editas un agente,
> reinicia la sesión para que se registre.

---

## 7. Cómo retomar (checklist para la otra laptop)

1. `git clone` + `git checkout plan-backend`
2. `bun install`
3. **Crear `.env`** (pedir credenciales a Iram o copiarlas del Dashboard de Supabase)
4. `bun run dev` y abrir `http://localhost:4321` (o el puerto que diga Astro)
5. Verificar que al hacer login real aparecen los módulos de la BD (no el modo demo)
6. Continuar con la **Fase 7: Panel admin `/admin`**

### Para probar el login real en la BD:
- Si `Auth Settings → Confirm email` está activo, el registro pide confirmación por correo.
- Promover a admin:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
  ```
  (en Supabase Dashboard → SQL Editor)

---

## 8. Decisiones de diseño tomadas (para no repetirlas)

1. **Login obligatorio** solo para `/aprender` y `/admin`; el landing es público.
2. **Practicar sin suscripción** está permitido; **guardar progreso requiere suscripción**.
3. **Progreso**: localStorage = capa local optimista; Supabase = fuente de verdad con sesión.
   Migración automática local→nube al suscribirse.
4. **Formatos interactivos** en BD: `format` text + `format_payload` jsonb (un solo payload
   discriminado por `format`), NO una columna por formato.
5. **`desc` TS ↔ `description` BD** (mapeado en seed y useModules).
6. **WAF-safe JSON** en el seed: escapa firmas de ataque (`../../etc/passwd`) como `\uXXXX`
   porque Cloudflare del plan gratis bloquea contenido educativo legítimo.
7. **UI workspace**: sin card envolvente, paneles sobre canvas, auto-nav a Solución
   retrasado 650ms tras el check, respuestas persistidas en sessionStorage.
