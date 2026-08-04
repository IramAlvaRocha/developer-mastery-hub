# LEARN-REDESIGN — Spec de rediseño de `/aprender`

> Director de diseño: revisión de identidad, composición, motion, a11y y craft.
> Ley aplicable: `DESIGN.md` + tokens de `src/styles/global.css` (`@theme`).
> Referencia de calidad: landing (`index.astro` + `src/components/landing/*`).
> Autoridad anti-referencia: la UI actual de `/aprender` (se reemplaza su look, no se pule).

---

## 1. Nota de línea base (1–10)

| Criterio | Peso | Nota | Evidencia clave |
|---|---|---|---|
| 1. Coherencia con el landing | 25% | **3.5** | Cero GSAP en aprender (GSAP solo vive en landing). Tipografía de cabecera en tamaño app (`text-lg/sm` vs `clamp(2.5rem…6.5rem)`). Colores hardcodeados (`bg-[#121412]`, `bg-[#161816]`) en vez de tokens. Eyebrows `text-muted` cuando en landing son `text-cream`. |
| 2. Composición y respiración | 25% | **3.5** | Métricas en tiles de 10px; filas "ruta" apilando 4 datos truncados; footer del workspace con 4 botones + atajos en 2 filas; drawer tipo explorador de archivos con líneas punteadas. |
| 3. Motion e interacción | 20% | **2.5** | Sin GSAP, sin transición entre tabs (swap seco), celebración solo CSS, entradas solo `animate-fade-in/stagger`. Sí respeta `prefers-reduced-motion` parcialmente. |
| 4. A11y y robustez | 15% | **6.0** | Labels en inputs inline, Escape en modales, focus en inputs. Faltan: toasts sin `role/live`, tabs no semánticos, drawers sin gestión de foco ni `aria-hidden` consistente, sin `:focus-visible` global, backdrops con `bg-black`. |
| 5. Craft del detalle | 15% | **4.5** | Radios mezclados (20/22/24/28), colores sueltos, `ModuleCard` y `SettingsModal` **huérfanos** (sin uso), dos hamburguesas en el header, `!rounded-none` en la barra de progreso. |
| **Final (ponderada)** | — | **3.8** | Objetivo: **≥ 9.0** |

---

## 2. Diagnóstico de la brecha

### 2.1 La identidad del landing (fuente de verdad)
1. **Tipo escala hero**: `clamp(2.5rem,8.5vw,6.5rem)` semibold, tracking `-0.02em`; secciones `clamp(2rem,5vw,3.6rem)`; eyebrow `{ Sección }` **en cream** (`section-eyebrow`).
2. **Ritmo vertical**: `max-w-[1280px] px-4 sm:px-6`, bloques `py-20 sm:py-28`, grids `mt-12 gap-5`, cards `p-6`.
3. **Cards**: `rounded-[28px] border-line bg-surface`, con panel de iconos con `radial-gradient` por disciplina.
4. **Motion GSAP**: letter-stagger en hero, blobs flotantes, `ScrollTrigger` reveals, marquee con `gsap.to` random float; todo con guard `prefersReducedMotion()`.
5. **Color por disciplina**: sky / orangey / lilac / pink / brand / butter (accent por track).

### 2.2 Lo que desentona en `/aprender` (evidencia)
- **`MasteryHub.tsx`**: header `bg-[#121412]/95` (hardcode) y `py-3.5` (apretado); `<h1>` de marca en el header (impide h1 real en la vista); dos `☰` (rutas + lista móvil) sin diferenciación; `SettingsModal` nunca se monta (funcionalidad perdida).
- **`ModuleMenu.tsx`**: vista "dashboard admin": drawer overlay con árbol de categorías denso (labels 11px, nodos de 3.5px, líneas punteadas), tiles de métricas `px-3 py-3.5` con texto de **10px**, filas de ruta con 4 metadatos truncados, lista anidada "Cursos en {grupo}" de botones pequeños. `max-w-7xl px-4 py-3` vs el respiro del landing. Sin hero, sin empty state (primer uso = 6 ceros).
- **`ExerciseSidebar.tsx`**: misma estética de árbol (línea vertical + nodos), `bg-[#121412]`, header comprimido, chips de filtro apretados (`gap-1.5`).
- **`ExerciseWorkspace.tsx`**: barra de progreso `h-1` con `!rounded-none`; glow del hero hardcodeado a verde (`rgba(10,228,72,…)`); tabs sin animación de indicador; paneles sin transición; footer 2 filas con atajos + 4 botones; celebración solo CSS.
- **`SolutionPanel.tsx` / `TheoryTab.tsx` / `SimulatedTerminal.tsx`**: fondos `bg-[#0e100f]`/`bg-[#161816]` (tokenizar), radios 24px sueltos, eyebrows `text-muted` (deben ser `text-cream`).
- **`Toasts.tsx`**: sin `role="status"/"alert"` ni `aria-live`.
- **`ChallengeCode.tsx`**: ok funcional; inputs inline sin `aria-describedby`/placeholder descriptivo; colores VS Code aceptables pero a revisar contraste.

### 2.3 Problemas de densidad/apilamiento (orden de impacto)
1. Métricas del catálogo con tipografía 10px y padding 12px → ilegibles y "de administración".
2. Drawer de rutas en árbol → el patrón correcto es **chip de filtro + grid de cards** (idioma del landing).
3. Footer del workspace en 2 filas con 4 acciones + atajos → simplificar a 1 fila + hint discreto.
4. Sidebar de ejercicios con conector visual denso → reemplazar por "track" limpio con fila activa tipo píldora.
5. Radios inconsistentes (20/22/24/28) → sistema de 3 niveles.

### 2.4 Oportunidades de motion (a explotar)
- Entrada hero del catálogo (stagger de eyebrow → título → subtítulo → stats → cards).
- **Indicador deslizante** en las tabs (píldora cream que se mueve con GSAP `x`).
- Transición GSAP entre paneles de tabs (`fade + y`, `key={activeTab}`).
- Count-up de métricas (ya existe `useCountUp`) + stagger GSAP en tiles.
- Barra de progreso del workspace con `gsap.to(width)`.
- Celebración con timeline GSAP (anillo + check pop + confeti) y fallback estático con `prefers-reduced-motion`.
- Conservar `runViewTransition` (morph catálogo ↔ módulo) — es el puente con el landing.

### 2.5 Reorganización de componentes propuesta
```
/aprender
├─ MasteryHub (shell + header + enrutado)          → restyling + SettingsModal cableado
├─ Catálogo:
│   ├─ ModuleMenu (nueva estructura)               → hero + resume + stats + chips + grid
│   ├─ MetricTile                                  → restyle (subcomponente de ModuleMenu)
│   ├─ ResumeCard                                  → restyle (subcomponente)
│   └─ ModuleCard  (YA EXISTE, huérfano)           → REUTILIZAR en la grid de cursos
├─ Workspace:
│   ├─ ExerciseSidebar                             → restyle track + fila activa píldora
│   ├─ ExerciseWorkspace                           → restyle hero/tabs/footer + motion
│   │   ├─ TabSlider (nuevo)                       → indicador deslizante GSAP
│   │   ├─ ChallengeCode (sin cambios de lógica)   → solo estética de inputs
│   │   ├─ TheoryTab / SolutionPanel / SimulatedTerminal → tokenizar + ritmo
│   │   └─ Celebration                             → GSAP timeline
├─ Overlays:
│   ├─ Toasts                                      → role/live + restyle
│   └─ SettingsModal (YA EXISTE, huérfano)         → cablear a header + restyle
```

---

## 3. Sistema de diseño aplicado (sin romper tokens)

### 3.1 Espaciado (system de ritmo)
- **Contenedor**: `mx-auto w-full max-w-[1280px] px-4 sm:px-6` (reemplazar `max-w-7xl px-4 py-3`).
- **Ritmo vertical de secciones** (catálogo): `py-10 sm:py-14` para la página; `mt-8 sm:mt-10` entre hero→stats→contenido; `gap-4 sm:gap-5` en grids; `space-y-4` dentro de cards.
- **Card padding estándar**: `p-5 sm:p-6`.
- **Ritmo del workspace**: contenedor `max-w-3xl mx-auto p-4 md:p-6` con `space-y-5 md:space-y-6`.
- **Rows/botones**: `py-3` mínimos; chips `px-3.5 py-2`.

### 3.2 Radios (3 niveles, fin a la mezcla)
| Nivel | Valor | Uso |
|---|---|---|
| Card mayor | `--radius-card` (28px) | Módulos, hero, paneles, cajas de código/teoría |
| Nivel intermedio | `24px` | Bloques anidados (tarea, explicación, ejemplo cotidiano) |
| Controles | `20px` (`--radius-input`) / `9999px` | Inputs, filas activas, chips, píldoras |
- **Prohibido** `rounded-none`/`!rounded-none` (a excepción de bordes de layout de 1px que son estructurales y no "cards": separador de pestañas ok, barra de progreso debe quedar `rounded-full`).
- Sustituir apariciones sueltas `rounded-[20px]`, `rounded-[22px]` por el nivel correspondiente.

### 3.3 Colores (tokenizar, nunca hardcodear)
- `bg-[#121412]` → `bg-surface-2` (ya existe `--color-surface-2: #141514`).
- `bg-[#161816]` → `bg-elevated` (o `bg-surface-2` + borde si se necesita menos contraste).
- `bg-[#0e100f]` → `bg-canvas`.
- Backdrops: `bg-black/60` → `bg-canvas/85` (mantener blur); no introducir negro puro nuevo.
- Colores de sintaxis en `ChallengeCode`/`SimulatedTerminal` se **conservan** (affordance funcional de resaltado sobre canvas) salvo `text-slate-500`, `text-amber-300`, etc. que ya cumplen contraste; no usar `#fff`.
- Eyebrows `{ Sección }` SIEMPRE `text-cream` (salvo si se usa `text-muted` a propósito dentro de una card, p. ej. sobre superficie cream — en canvas usar cream).

### 3.4 Tipografía
| Rol | Spec |
|---|---|
| Hero catálogo (h1) | `clamp(2.2rem,5vw,3.6rem)` semibold, `tracking-tight`, `text-cream` |
| Hero ejercicio (h1) | `clamp(1.6rem,4vw,2.4rem)` semibold, `tracking-tight` |
| Secciones en card (h2/h3) | `text-lg sm:text-xl` semibold |
| Eyebrow | `section-eyebrow` (cream) |
| Cuerpo | `text-[15px] leading-relaxed text-muted` (nunca por debajo de 14px en copy importante) |
| Meta/chips | `text-[11px] font-semibold` (solo datos secundarios), `text-faint` solo decorativo |
| Mono (código) | `font-mono` JetBrains 12–13px |

### 3.5 Tokens que se reutilizan (sin añadir nuevos colores)
`canvas, surface, surface-2, elevated, line, line-soft, ink, muted, faint, brand, brand-strong, brand-deep, cream, orangey, pink, lilac, sky, core-green, sage, peach, butter, danger` + `--radius-*` + `--shadow-glow(-soft)/float` + utilitarios `.mod-*` y `moduleColorStyle()`.

---

## 4. Spec por vista

### 4.1 Shell y header — `src/components/MasteryHub.tsx`
1. Header: `bg-canvas/90 backdrop-blur-md border-b border-line/80`, `px-4 sm:px-6 py-3` (respiro, sin hardcode).
2. Reemplazar el `<h1>` de marca por `<span>` (para permitir **un único h1 por vista**: catálogo y ejercicio).
3. Iconografía del header: botón de rutas (catálogo) y de lista móvil (módulo) con `aria-label` claros; estilos `icon-btn border border-line`.
4. **Cablear `SettingsModal`**: añadir botón engranaje (⚙ / `aria-label="Configuración"`) con `open/onClose/onToast/onExportProgress/onImportProgress` (props ya definidas en `SettingsModal.tsx`).
5. Conservar: breadcrumb, share (`buildShareUrl`), avatar, navegación ← Menú, `runViewTransition`, `useProgress`, `useToasts`, atajos.
6. Móvil: backdrop del drawer de ejercicios → `bg-canvas/85 backdrop-blur-sm` (no `bg-black/60`).

### 4.2 Catálogo — `src/components/ModuleMenu.tsx` (reestructura de render)
Estructura nueva de `<main>` (mantener props y toda la lógica de `metrics`, `selectedGroup`, `onStart/onResume`):

1. **Hero del catálogo** (con `data-reveal` para GSAP):
   ```
   <p className="section-eyebrow text-cream">{ "{ Catálogo }" }</p>
   <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-cream">Elige tu ruta</h1>
   <p className="mt-3 max-w-2xl text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed text-muted">
     Rutas por disciplina. Elige un grupo y entra a sus cursos.
   </p>
   ```
2. **ResumeCard** (si `resume`): restyle a `p-5 sm:p-6`, glow del color del módulo, botón `btn-primary`, barra `h-2 rounded-full`; entrada GSAP `data-reveal`.
3. **Métricas** (mantener `MetricTile` + `useCountUp`): grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4`; tile → `rounded-[24px] border border-line bg-canvas/60 px-4 py-5 text-center`; valor `text-2xl sm:text-3xl font-semibold tracking-tight` (accent → `text-brand`), label `text-[11px] font-bold uppercase tracking-wide text-faint`. Stagger GSAP por tile.
4. **Filtro de grupos (reemplaza las filas "Por ruta" densas)**: fila `flex flex-wrap gap-2` de chips:
   - Chip inactivo: `pill-chip border border-line bg-canvas/40 text-muted hover:text-cream`.
   - Chip activo: clase `.mod-chip-active` (existe) con `style={moduleColorStyle(color del grupo)}`.
   - Contenido del chip: `{icon} {group} · {progress}%` + barrita fina opcional.
   - `aria-pressed` para estado.
5. **Panel de cursos del grupo seleccionado**:
   ```
   <div className="mt-8">
     <div className="flex items-end justify-between gap-3">
       <div>
         <p className="text-[11px] font-bold uppercase tracking-wider text-faint">Cursos en {group}</p>
         <p className="mt-1 text-sm text-muted">{activeMeta.desc}</p>
       </div>
       <span className="mod-text text-sm font-semibold">{progress}%</span>
     </div>
     <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
       {mods.map((mod, i) => <ModuleCard key={mod.key} module={mod} progress={getPercent(...)} index={i} onStart={onStart} />)}
     </div>
   </div>
   ```
   **Reutilizar `ModuleCard.tsx`** (ya es el idioma visual correcto: `rounded-card`, icono, topics, progreso, hover lift). Ajustes menores: `p-5`, `h3 text-[15px]`, badge `mod-badge`, ya cumple.
6. **Empty state (primer uso)**: si `metrics.overall === 0 && !resume`, mostrar card de bienvenida tras las métricas:
   ```
   <div className="mt-6 rounded-[28px] border border-brand/25 bg-brand/5 p-6 sm:p-8">
     <p className="section-eyebrow text-cream">{ "{ Empieza por aquí }" }</p>
     <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-cream">Todo listo para tu primer desafío</h2>
     <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">Abre el primer módulo de una ruta…</p>
     <button className="btn-filled-soft mt-5 !min-h-11" onClick={() => onStart(primerModulo.key)}>Empezar {primerModulo.name} →</button>
   </div>
   ```
7. **Drawer de rutas (opcional, conservar funcionalidad)**: mantener el árbol de categorías **pero** aligerado: `px-4 py-5`, labels `text-sm`, nodos `h-4 w-4`, activo con píldora `mod-sidebar-item-active rounded-[16px]`; `role="dialog" aria-modal` SOLO cuando abierto; añadir tecla Escape; fondo `bg-canvas/85`.
8. El área de contenido NO es ya una card gigante con bordes dobles: fondo `bg-canvas` directo, secciones separadas por ritmo vertical (no por cajas).

### 4.3 Sidebar de ejercicios — `src/components/ExerciseSidebar.tsx`
1. Contenedor: `w-80` en desktop; en móvil drawer con `rounded-r-[28px] shadow-float`; `bg-surface-2`.
2. Header: eyebrow "Módulo" en `text-cream/80` y nombre `text-base font-semibold`.
3. Progreso: bloque `px-5 py-4`, barra `h-2 rounded-full bg-elevated` + `.mod-progress`.
4. Controles: sort + chips con `gap-2 py-2.5`, `px-4`; chips `pill-chip` con `aria-pressed`.
5. **Track de ejercicios**: conservar la línea de progresión **simple** (una `border-l border-line/60`), nodos `h-4 w-4` con anillo activo (`bg-sky ring-4 ring-sky/20`), completado `bg-brand`, pendiente `border-line bg-surface-2`. Fila activa: `bg mod-sidebar-item-active rounded-[16px]` + `text` cream; filas `py-3`.
6. A11y: `aria-hidden` al cerrar (móvil), Escape cierra, `aria-label="Lista de ejercicios de {moduleName}"` en el `<nav>`, devolver foco al botón ☰ al cerrar.

### 4.4 Workspace — `src/components/ExerciseWorkspace.tsx`
1. **Barra de progreso**: `h-1.5 rounded-full bg-elevated` (track) + `.mod-progress` (sin `!rounded-none`), animada con `gsap.to(width)` en cada cambio de `exercise.id` (fallback: transición CSS ya existente).
2. **Hero** (`data-reveal`):
   - Glow: usar `style={{ background: radial-gradient(circle, rgb(var(--module-rgb) / 0.35), transparent 70%) }}` (color del módulo, no verde fijo).
   - Chips: label nivel con `mod-badge` (color módulo), estrellas en pill `text-butter`, categoría `pill-chip border-line`.
   - Eyebrow `{ Ejercicio }` en `text-cream`.
   - Título: `h1` `clamp(1.6rem,4vw,2.4rem)` semibold tracking-tight.
   - Descripción `text-[15px] text-muted max-w-2xl`.
   - Tags `pill-chip`.
3. **Tabs (TabSlider)**: contenedor `relative inline-flex rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur`.
   - Botones `relative z-10 px-4 py-2.5 text-[13px] font-semibold` (inactivo `text-muted hover:text-cream`).
   - Indicador absoluto: `absolute rounded-full bg-cream text-canvas shadow-float` movido con `gsap.to(x, duration: 0.4, ease: power3.out)` según el botón activo (medir con `offsetLeft/offsetWidth`).
   - Semántica: `role="tablist"`, botones `role="tab"` con `aria-selected`, paneles `role="tabpanel"` con `id`/`aria-labelledby`, flechas izquierda/derecha para cambiar tab, `tabIndex={-1}` en paneles no activos.
4. **Transición de paneles**: envolver panel en contenedor con `key={activeTab}` y en `useLayoutEffect` correr `gsap.from("[data-panel]", { opacity: 0, y: 14, duration: 0.35, ease: "power2.out" })` (guard de reduced motion).
5. **"Tu tarea"**: card `rounded-[24px] border border-line border-l-[3px] mod-task-border bg-surface px-5 py-5`; label "Tu tarea" `text-[11px] font-bold uppercase text-faint`; texto `text-[15px] leading-relaxed text-cream/95`.
6. **Ventana de código**: header `bg-surface-2` (no `#161816`), dots más pequeños (`h-2 w-2`) + `fileName` mono + pill del módulo; cuerpo `bg-canvas p-4 sm:p-5 max-h-80 overflow-y-auto`.
7. **Footer**: una sola fila `gap-2`:
   - Prev/Next: `btn-secondary`/`btn-primary` con `!min-h-11`, icono + label (en móvil solo icono).
   - Centro: `{index+1} / {total}` + pill "Completado".
   - `Verificar`: `btn-filled-soft !min-h-11 !px-6 !text-sm` (primario); `Limpiar`: `btn-ghost`.
   - Atajos: **una línea** discreta bajo la fila (`text-[10px] text-faint`) con `<Kbd>` inline (mantener `KeyboardHints` pero single-line).
8. **Celebración (Celebration)**: timeline GSAP: anillo expandiéndose + check con `back.out(2)` + confeti con física simple (o conservar CSS de confeti pero lanzado desde el centro). Con `prefers-reduced-motion` → check estático (comportamiento actual).

### 4.5 Teoría y Solución — `TheoryTab.tsx` / `SolutionPanel.tsx`
1. `bg-[#0e100f]` → `bg-canvas`; `bg-[#161816]` → `bg-surface-2`.
2. Eyebrows → `text-cream`.
3. Radios: contenedor 28px, bloques internos 24px.
4. `SolutionPanel`: header con `h2 text-xl sm:text-2xl`; bloque "Ejemplo cotidiano" `border-sage/25 bg-sage/10`; "Explicación técnica" `mod-task-border`; "Solución de referencia" con `max-h-72 overflow-y-auto` y bullets con `mod-text`; tip `border-peach/20 bg-peach/10`.
5. GSAP `data-reveal` en los bloques (guard reduced motion).

### 4.6 Terminal simulada — `SimulatedTerminal.tsx`
1. Tokenizar fondos: `bg-[#161816]` → `bg-surface-2`, `bg-[#0e100f]` → `bg-canvas`.
2. Mantener colores de prompt/output (funcionales); barra de hint `px-4 py-2.5 text-[11px]`.
3. Añadir `aria-label` ya existente en input + `role="log"` `aria-live="polite"` en el área de líneas (mejora a11y sin tocar lógica de `executeCommand`).

### 4.7 Toasts — `Toasts.tsx`
1. Contenedor: `role="status" aria-live="polite"` (o `role="alert"` cuando el toast es error, vía prop).
2. Card: `rounded-[24px] border bg-surface p-3.5 shadow-float`, borde por tipo (`border-brand/40`, `border-danger/40`, `border-line`), icono en pill circular (`bg-brand/15 text-brand` etc.).
3. Entrada GSAP (`x: 24 → 0`) con fallback `animate-fade-in`; reduced motion respetado.

### 4.8 Settings — `SettingsModal.tsx`
1. **Cablear** desde `MasteryHub` (ver 4.1). Mantener toda la lógica export/import/avatar.
2. Restyle: `ui-card p-6`, eyebrow `{ Settings }` en cream, secciones `rounded-[24px] border border-line bg-surface-2 p-4`, botones `btn-secondary`/`btn-primary`.
3. A11y: mantener Escape; añadir `aria-labelledby` del título; `tabIndex` inicial al título.

---

## 5. Plan de motion (GSAP)

Regla global: **todo tween se guarda con `prefersReducedMotion()`** (helper `prefersReducedMotion`/`usePrefersReducedMotion` de `src/lib/useReducedMotion.ts`) y `gsap.context(...)` con revert en cleanup (patrón exacto del landing).

| Momento | Técnica | Duración/easing |
|---|---|---|
| Entrada catálogo | `gsap.from("[data-reveal]", { y: 28, opacity: 0, stagger: 0.08, ease: "power3.out" })` | 0.6s |
| Stats tiles | stagger `.metric-tile` con `y: 16, opacity: 0` | 0.5s, stagger 0.05 |
| Cards de cursos | `gsap.from(".course-card", { y: 24, opacity: 0, stagger: 0.06 })` al cambiar de grupo | 0.5s |
| ResumeCard | `gsap.from` individual | 0.5s |
| Entrada ejercicio | hero `data-reveal` stagger (label→título→descripción→tabs→panel) | 0.5s |
| Tabs | indicador `gsap.to(x)` (o CSS transition con medida) | 0.4s `power3.out` |
| Cambio de panel | `gsap.from("[data-panel]", { y: 14, opacity: 0 })` | 0.35s `power2.out` |
| Progreso workspace | `gsap.to(width)` al cambiar `exercise.id` | 0.7s `power2.out` |
| Celebración | timeline: ring scale + check `back.out(2)` + confeti | 1.2s |
| Toasts | slide-in `x: 24 → 0` | 0.3s `power3.out` |
| Hover | CSS: `hover:-translate-y-0.5` + `motion-safe-transition` (patrón landing, ya en `ModuleCard`) | 0.15s |

Conservar `runViewTransition` para catálogo↔módulo (ya respeta reduced motion). No añadir ScrollTrigger en el workspace (es app de altura fija); en catálogo se puede si el contenido hace scroll.

---

## 6. Estados

| Estado | Spec |
|---|---|
| **Loading** (no aplica: datos sincrónos; si se añade SSR-async futuro) | shimmer `shimmer-loading` ya existente en skeleton |
| **Empty (catálogo)** | Empty state de 4.2.6 con CTA al primer módulo |
| **Empty (sidebar filtros)** | Mensaje existente "No hay ejercicios con esa dificultad." en card `rounded-[20px]` `text-faint` |
| **Success** | Toast success + `Completado` pill + celebración GSAP (primera vez) + barra progreso animada |
| **Error (verificación)** | Inputs marcados `aria-invalid` + `border-rose` + toast error `role="alert"` + `aria-live` |
| **En progreso** | Sidebar nodo activo `bg-sky ring`, dot en fila activa, progress bars con `mod-progress` |
| **Completado módulo** | Badge "Hecho"/"Completado" (ya en ModuleCard/ModuleMenu) con `border-brand/30 bg-brand/10` |

---

## 7. Accesibilidad (lista concreta)

1. **`:focus-visible` global** en `global.css`: `outline: 2px solid var(--color-brand); outline-offset: 2px; border-radius: inherit;` (o utility Tailwind) — sin quitar focus de inputs.
2. **Un único `h1` por vista**: catálogo → hero; ejercicio → título. Header usa `<span>`.
3. **Tabs**: `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls`/`aria-labelledby`, navegación con flechas, `tabIndex` roving.
4. **Toasts**: `aria-live="polite"` + `role="status"`; error → `role="alert"`.
5. **Drawers** (rutas y sidebar móvil): `aria-hidden` cuando cerrado, Escape cierra, devolver foco, `aria-modal` solo abierto.
6. **Contraste**: copy secundario SIEMPRE `text-muted` (nunca `text-faint`) para info funcional; `text-faint` solo decorativo; tamaño mínimo de copy 14px en párrafos.
7. **Inputs inline** (`ChallengeCode`): `aria-label` descriptivo ("Espacio N de {fileName}") y `aria-describedby` con pista de formato cuando aplique.
8. **Terminal**: `role="log"` + `aria-live="polite"` en líneas.
9. **Chips filtro/sort**: `aria-pressed`.
10. **Reduced motion**: todas las animaciones GSAP y CSS con guard (helper ya existente + media query existente en `global.css`).

---

## 8. Responsive

| Breakpoint | Catálogo | Workspace |
|---|---|---|
| **Móvil (<640)** | Hero clamp ~2.2rem; stats `grid-cols-2`; chips de grupos scroll horizontal (`overflow-x-auto`); cursos `grid-cols-1` | Sidebar → drawer `rounded-r-[28px]`; footer: prev/next icon-only + verify full-width (`flex-1`); panel `p-4` |
| **Tablet (640–1024)** | Stats `grid-cols-3`; cursos `sm:grid-cols-2`; chips wrap | Sidebar estático `w-80` (oculto aún en <md si se mantiene drawer) |
| **Desktop (≥1024)** | Stats `grid-cols-6`; cursos `xl:grid-cols-3`; hero completo | Sidebar `w-80` visible; footer 1 fila completa; `max-w-3xl` centrado |

Regla: nada se amontona; el viewport se ensancha con el contenido (clamp), no con overflow oculto excepto en chips/track.

---

## 9. Alcance — QUÉ se cambia y QUÉ NO se toca

### Se cambia (solo UI/motion/a11y/layout)
- `src/components/MasteryHub.tsx` — header, tokens, h1→span, cablear SettingsModal, backdrop.
- `src/components/ModuleMenu.tsx` — reestructura de render (hero, stats, chips, grid de ModuleCard, empty state, drawer restyled). **No cambia lógica de metrics/selection.**
- `src/components/ModuleCard.tsx` — ajustes cosméticos si hace falta (p-5); pasa a usarse.
- `src/components/ExerciseSidebar.tsx` — restyle track, fila activa, a11y.
- `src/components/ExerciseWorkspace.tsx` — hero, TabSlider, transiciones GSAP, footer, celebración, tokens.
- `src/components/ChallengeCode.tsx` — solo estética de inputs (radius, placeholder, aria).
- `src/components/TheoryTab.tsx`, `SolutionPanel.tsx`, `SimulatedTerminal.tsx` — tokens, radii, eyebrows, ritmo, aria (terminal).
- `src/components/Toasts.tsx` — role/live + restyle + entrada.
- `src/components/SettingsModal.tsx` — restyle (mantener lógica) y cableado.
- `src/styles/global.css` — añadir `:focus-visible`, (opcional) tokens de layout; NO tocar el bloque `@theme`.

### NO se toca (funcionalidad intacta)
- Modelo de datos: `src/lib/types.ts`, `src/data/*` (nada de datos).
- Progreso: `useProgress` (claves localStorage intactas), `lastVisited`.
- Verificación: `src/lib/answers.ts` (`isAnswerCorrect`), estado de `incorrectKeys`, flujo `verify()`.
- Terminal simulada: `src/lib/shell/*` (simulator, presets) — solo visual del componente.
- Atajos de teclado (←/→/n/p), share URL (`urlLocation.ts`), view transitions (`runViewTransition`).
- Toasts logic (`useToasts`) y export/import progreso.

---

## 10. Checklist de implementación (para dev-executor)

**Fase A — Tokens y base**
- [ ] A1. Reemplazar `bg-[#121412]` → `bg-surface-2`, `bg-[#161816]` → `bg-elevated`/`bg-surface-2`, `bg-[#0e100f]` → `bg-canvas` en todos los componentes de aprender.
- [ ] A2. Unificar radios: cards 28px, bloques 24px, controles 20px/pill; eliminar `!rounded-none`.
- [ ] A3. `global.css`: añadir regla `:focus-visible` (brand, offset 2px) y verificar que `prefers-reduced-motion` sigue cubriendo todas las animaciones nuevas.
- [ ] A4. Eyebrows `{ ... }` en `text-cream`.

**Fase B — Shell**
- [ ] B1. `MasteryHub.tsx`: header con tokens, `h1`→`span`.
- [ ] B2. Cablear `SettingsModal` (gear) con sus 5 props.
- [ ] B3. Backdrops con `bg-canvas/85`.

**Fase C — Catálogo**
- [ ] C1. `ModuleMenu.tsx`: hero (eyebrow + h1 + sub) con `data-reveal`.
- [ ] C2. Métricas → 6 tiles grandes con `useCountUp` + stagger GSAP.
- [ ] C3. Filtro de grupos en chips con `aria-pressed` (reemplaza filas densas).
- [ ] C4. Grid de cursos reutilizando `ModuleCard` (1/2/3 cols).
- [ ] C5. Empty state primer uso.
- [ ] C6. Drawer de rutas restyled (labels, nodos, activo píldora, Escape, `aria-modal` condicional).

**Fase D — Workspace**
- [ ] D1. `ExerciseSidebar.tsx`: track limpio, fila activa píldora, `w-80`, drawer `rounded-r-[28px]`, a11y (Escape, aria-hidden, foco).
- [ ] D2. `ExerciseWorkspace.tsx`: barra progreso h-1.5 + GSAP width; hero con glow de módulo y h1.
- [ ] D3. TabSlider con indicador GSAP + semántica tablist/tab/tabpanel + flechas.
- [ ] D4. Transición GSAP en paneles (`key={activeTab}` + `data-panel`).
- [ ] D5. Footer 1 fila + atajos en línea simple; `Verificar` como CTA principal.
- [ ] D6. Celebración GSAP (timeline) + fallback reduced motion.
- [ ] D7. `ChallengeCode.tsx`: inputs con mejor `aria-label`/placeholder, radius 8px, caret visible.
- [ ] D8. `TheoryTab/SolutionPanel`: tokens + radii + ritmo + reveals.

**Fase E — Overlays**
- [ ] E1. `Toasts.tsx`: `aria-live` + `role` por tipo + restyle + entrada GSAP.
- [ ] E2. `SettingsModal.tsx`: restyle + `aria-labelledby`.
- [ ] E3. `SimulatedTerminal.tsx`: tokens + `role="log"` + hint respirado.

**Fase F — Verificación**
- [ ] F1. `bun run build` sin errores TypeScript.
- [ ] F2. Revisar `/aprender` en desktop y móvil (dev server + screenshots).
- [ ] F3. Ejecutar detector impeccable: `node .opencode/skills/impeccable/scripts/detect.mjs --json src/components/*.tsx` y corregir hallazgos de identidad.

---

## 11. Rúbrica de entrega (para la calificación ≥ 9)

| Criterio | Qué mirar |
|---|---|
| Coherencia (25%) | Mismos tokens, GSAP presente, eyebrows cream, type scale, radios; un solo "producto" |
| Composición (25%) | Ritmo vertical, sin cajas apiladas, sin texto 10px en datos, footer 1 fila |
| Motion (20%) | Entradas stagger, tab slider, transición de paneles, celebración; reduced-motion en todo |
| A11y (15%) | focus-visible, tabs semánticos, toasts live, drawers accesibles, un h1, contraste |
| Craft (15%) | Radios unificados, tokens, `ModuleCard` y `SettingsModal` en uso, hover/active/focus, copy coherente |
