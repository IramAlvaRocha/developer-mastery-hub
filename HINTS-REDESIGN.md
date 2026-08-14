# HINTS-REDESIGN — Spec: hints progresivos + candado en la pestaña Solución

> Director de diseño: spec de interacción para la feature de pistas progresivas y
> bloqueo de la solución en `/aprender`.
> Ley aplicable: `DESIGN.md` + tokens de `src/styles/global.css` (`@theme`) + `LEARN-REDESIGN.md`.
> Modo: **Operate** — el usuario completa una tarea; la pista es una herramienta de
> desbloqueo, la solución es una recompensa. Brand vive en detalles precisos.
> Regla de oro: la interacción debe sentirse **premium pero silenciosa** — no compite
> con la celebración, no pide atención, aparece cuando el usuario la busca.

---

## 0. Decisión ejecutiva

| Tema | Decisión |
|---|---|
| Dónde viven las pistas | En el **aside del tab Desafío** (zona "Cómo avanzar"), no en el toolbar del código ni en el footer. Es el único lugar contextual de "ayuda para avanzar" que ya existe en la pantalla. |
| Qué bloquea el candado | El candado depende SOLO de `solved === false`, **independiente de las pistas**. Agotar pistas NO desbloquea la solución (ver §7, caso C). |
| Qué pasa al pulsar Solución bloqueada | Se navega al tab y se muestra el **estado bloqueado** con CTA "Ir al desafío" (no un toast, no un dead-end). |
| Botón de pista al agotarse | **Desaparece** y deja una nota "Todas las pistas reveladas" (no se queda como botón muerto `disabled`). |
| Atajo de teclado | `h` revela la siguiente pista (opcional-recomendado; guardado contra inputs/tabs). |

---

## 1. Auditoría del estado actual

### 1.1 Cómo funciona hoy (evidencia)

- `ExerciseWorkspace.tsx` define `Tab = "theory" | "terminal" | "challenge" | "code"`.
  La pestaña "Solución" (`id: "code"`) es un botón de roving tablist con indicador GSAP
  (línea `h-[3px]` mod-bg) y **siempre navegable** (líneas 500–535).
- El panel `panel-code` (líneas 690–701) renderiza `<SolutionPanel exercise color />`
  **incondicionalmente** — `solved` nunca condiciona el render.
- `solved` ya existe como estado (línea 59), se inicializa con `alreadyCompleted`
  (línea 59) y se sincroniza al cambiar de ejercicio (líneas 76–79).
- `goToSolution()` (líneas 121–133) ya navega a `"code"` tras 650ms al acertar
  (instantáneo con `reduceMotion`), justo cuando la celebración (1.6s) está activa.
- El aside del Desafío (líneas 550–602) tiene dos bloques: "Tu misión" y
  "Cómo avanzar" (`bg-surface-2/60 p-5`) con 3 pasos numerados + fila Formato.
- `types.ts` ya tipa `hints?: string[]` (línea 121) con el comentario
  *"La pestaña Solución queda bloqueada hasta resolver (o hasta agotar las pistas si
  la UI lo permite)"* — **pero ningún dato la usa aún** y la UI no implementa el candado.

### 1.2 Qué se rompe conceptualmente al añadir esta feature

1. **La solución deja de ser información y pasa a ser recompensa.** Hoy el usuario puede
   abrir "Solución" en 1 clic y leer `completeCode` sin intentarlo. Con el candado, ese
   tab gana una semántica nueva: *estado bloqueado*. Si se implementa como un dead-end
   (toast + no navegación) el usuario se siente castigado; si se muestra un panel vacío
   y frío, parece un bug. El estado bloqueado debe ser **informativo + invitador**.
2. **El tab por sí solo ya no comunica todo.** Antes "Solución" era un label neutro.
   Ahora necesita un indicador de candado visible en el tab (no solo en el panel) para
   que el clic sea una elección informada. Sin ello, el clic se siente como una trampa.
3. **El aside del Desafío tiene un hueco de carga cognitiva.** La secuencia natural es
   "Tu misión → (me atasco) → ayuda → Cómo avanzar". Las pistas deben ocupar ese hueco
   sin añadir densidad: un bloque pequeño que **crece bajo demanda**, no una lista fija.
4. **Riesgo de fricción con la celebración.** El auto-nav a Solución ya está sincronizado
   con la celebración. Las pistas no deben añadir toasts ni sonidos; el aria-live y el
   motion de revelado deben ser contenidos (0.35s máx, sin partículas, sin glow fuerte).

### 1.3 Oportunidades de motion (a explotar)

- Revelado de pista: card que entra con fade+y (patrón `data-panel` ya existente).
- Pop del icono 💡 con `back.out` (eco de la celebración pero a escala mínima).
- Dots de progreso de pistas (filled vs empty) como indicador silencioso de "cuántas quedan".
- Pop del candado al entrar al panel bloqueado + stagger de los 3 teasers.
- Crossfade al agotarse las pistas (botón → nota) y al resolverse (la zona de pistas se desvanece).

---

## 2. Spec de la interacción

### 2.1 Flujo completo (walkthroughs)

**A. Ejercicio con hints, no resuelto (caso feliz)**
1. El usuario entra al Desafío. El aside muestra, tras "Cómo avanzar", la zona
   **"¿Atascado?"** con un botón pill "Mostrar pista" y 3 dots apagados.
2. Pulsa → aparece la tarjeta **"Pista 1 de 3"** (texto vago/conceptual). El dot 1 se enciende
   (mod-bg). El botón pasa a "Siguiente pista". El aria-live anuncia el contenido.
3. Pulsa de nuevo → "Pista 2 de 3" (más técnica). Dot 2 encendido.
4. Pulsa por última vez → "Pista 3 de 3" (casi-respuesta). Dot 3 encendido. El botón
   desaparece con crossfade y queda la nota **"Todas las pistas reveladas"**.
5. El usuario acaba resolviendo: `solved=true`, la zona de pistas se desvanece
   (opacity 0 + y -8, 0.3s) y el auto-nav a Solución muestra la solución real.
   La celebración no compite con nada: la zona ya está fuera.

**B. Solución bloqueada (candado)**
1. El tab "Solución" muestra un 🔒 de 14px `text-faint` y su `aria-label` es
   "Solución (bloqueada)".
2. El usuario la pulsa → el indicador se desliza, el panel monta `SolutionLocked`:
   glow de módulo, icono de candado con pop, eyebrow "Solución bloqueada", h2
   "Resuelve el desafío para ver la solución", copy + CTA `btn-filled-soft`
   "Ir al desafío →". Bajo el header, 3 teasers ("Explicación técnica",
   "Ejemplo cotidiano", "Solución de referencia") insinúan el contenido sin spoilear.
3. El foco se mueve al CTA (gestión en §6). Al pulsarlo → vuelve a `challenge`
   y el foco se coloca en el botón del tab Desafío.
4. Cuando resuelve, el auto-nav lleva al mismo tab pero `solved=true` → renderiza
   `SolutionPanel` real. Sin candado en el tab, sin estado intermedio.

**C. Ya completado (`alreadyCompleted` true)**
- `solved` arranca en `true`: el tab no tiene candado, `SolutionPanel` se ve desde el
  inicio y la zona de pistas NO se renderiza (no tiene sentido).

**D. Sin hints (`exercise.hints` vacío o ausente)**
- No hay zona "¿Atascado?" ni botón. El candado de Solución sigue funcionando.

### 2.2 Tab Solución — estados

| Estado | Visual del tab | aria-label | Panel |
|---|---|---|---|
| Bloqueado (`!solved`) | Label "Solución" + 🔒 `h-3.5 w-3.5 text-faint` (svg, `aria-hidden`) | `Solución (bloqueada)` | `SolutionLocked` |
| Desbloqueado (`solved`) | Label "Solución" (sin icono) | `Solución` | `SolutionPanel` |

- El 🔒 **no** sustituye al texto, es adyacente a la derecha (mismo patrón que el dot
  verde de Desafío en la línea 530). Se coloca tras `{tab.label}`.
- No usar `title` como única señal; `aria-label` es la señal autoritativa.

### 2.3 Estado bloqueado — `SolutionLocked` (copy exacto)

```
eyebrow:  Solución bloqueada                     (font-mono 11px semibold uppercase tracking-[0.14em] mod-text)
h2:       Resuelve el desafío para ver la solución   (text-xl sm:text-2xl semibold tracking-tight text-cream)
copy:     Al verificar la respuesta correcta, aquí tendrás el desglose completo:
          explicación técnica, ejemplo cotidiano y la solución de referencia.
          Si te atascas, vuelve al desafío y usa las pistas.
CTA:      Ir al desafío →                          (btn-filled-soft !min-h-11 !px-6 !text-sm)
teasers:  Explicación técnica · Ejemplo cotidiano · Solución de referencia
          (cada uno: icono mono, label semibold, nota text-faint "Se desbloquea al completar")
```

Jerarquía: header `rounded-[28px]` (radio mayor) con glow `mod-glow`; teasers
`rounded-[20px] border border-line bg-surface-2/60 p-4` en `grid gap-4 sm:grid-cols-3`.

### 2.4 Zona de pistas — copy exacto y jerarquía

Bloque dentro del aside, tras "Cómo avanzar", separado por `mt-4`:

```
header:   "¿Atascado?"  (text-[10px] font-bold uppercase tracking-[0.12em] text-faint)
          + dots de progreso a la derecha (h-1.5 w-1.5 rounded-full, mod-bg si revelado, bg-line si no)
          + kbd "h" opcional (text-[10px] text-faint, inline en la fila del header)
botón:    💡 Mostrar pista        (estado 0 reveladas)
          💡 Siguiente pista      (0 < reveladas < total)
          💡 Última pista         (reveladas === total - 1)  [transición corta]
card i:   header "PISTA {i+1} DE {total}"   (font-mono 10px bold uppercase tracking-[0.14em] mod-text)
          body {hints[i]}                   (text-[13px] leading-relaxed text-cream/90)
fin:      "Todas las pistas reveladas · <kbd>h</kbd>"  (text-[11px] text-faint, tras crossfade)
```

- Los dots cumplen "jerarquía clara de cuántas quedan" sin añadir números al botón
  (los números viven en el header de cada card, que es el patrón "Pista 1 de 3" pedido).
- El botón es de color módulo: `inline-flex w-full items-center justify-center gap-2
  rounded-[20px] border border-mod-border-40 bg-mod-bg-15 px-4 py-2.5 text-[13px]
  font-semibold mod-text transition hover:bg-mod-bg-20 hover:border-mod-border active:translate-y-px`.
- Cards: `rounded-[16px] border border-line-soft bg-surface-2/80 p-3.5`, `space-y-2.5`.
- Zona: `rounded-[20px] border border-line bg-canvas/50 p-4` con `style={colorStyle}`.

### 2.5 Respiración y composición

- La zona de pistas es el **último** bloque del aside; nunca interrumpe la misión.
- El aside crece bajo demanda (desktop sticky ok; móvil empuja el código hacia abajo —
  correcto: el usuario lee la ayuda antes del ejercicio).
- `SolutionLocked` mantiene el ritmo del workspace (`space-y-5 sm:space-y-6`, padding
  `px-5 py-6 sm:px-7 sm:py-7`), idéntico al header de `SolutionPanel` (líneas 39–57).
- Nada nuevo en el footer: Verificar/Limpiar/Siguiente quedan intactos.

---

## 3. Estructura de componentes

| Componente | Archivo | Props | Responsabilidad |
|---|---|---|---|
| `HintReveal` | `src/components/HintReveal.tsx` (nuevo) | `hints: string[]`, `solved: boolean`, `reduceMotion: boolean`, `color: string` | Botón + dots + cards + nota final + aria-live + animaciones. Estado interno `revealed`. Renderiza `null` si `solved || hints.length === 0`. Se monta con `key={exercise.id}` en el padre para resetear estado. IDs vía `useId()`. |
| `SolutionLocked` | `src/components/SolutionLocked.tsx` (nuevo) | `color: string`, `reduceMotion: boolean`, `onGoToChallenge: () => void` | Estado bloqueado del panel Solución: header + CTA + 3 teasers. Puro presentacional. |
| `ExerciseWorkspace` | existente | (sin cambios) | 3 ediciones: (1) render `<HintReveal key={exercise.id} … />` en el aside; (2) panel `code` condicional `solved ? <SolutionPanel/> : <SolutionLocked …/>`; (3) 🔒 + `aria-label` en el tab; (4) efecto de foco al CTA cuando `activeTab === "code" && !solved`; (5) `onGoToChallenge` que hace `setActiveTab("challenge")` + foco al botón del tab Desafío. |
| `SolutionPanel` | existente | (sin cambios) | Solo se renderiza cuando `solved`. |

Nota: no hace falta levantar el estado de `revealed` al padre. `key={exercise.id}`
remonta `HintReveal` al cambiar de ejercicio; `solved` entra por prop. El atajo `h`
(véase §6.7) se implementa con un `keydown` propio dentro de `HintReveal`, guardado
contra `INPUT`/`TEXTAREA`/`SELECT` y `role="tablist"`.

---

## 4. Motion GSAP

Patrón global (idéntico al landing y al workspace): `gsap.context(() => {…}, ref)` +
`ctx.revert()` en cleanup + guard `if (reduceMotion) return;`. Nada de ScrollTrigger.

| Momento | Técnica | Duración / easing |
|---|---|---|
| Card de pista nueva | `gsap.fromTo("[data-hint-card:last-child]", { opacity: 0, y: 12 }, { opacity: 1, y: 0 })` | 0.35s `power2.out` |
| Icono 💡 de la card | `fromTo("[data-hint-card:last-child] [data-hint-icon]", { scale: 0.6, rotation: -8 }, { scale: 1, rotation: 0 })` | 0.4s `back.out(1.8)` |
| Dots de progreso | CSS `transition-colors` (mod-bg vs bg-line) | 0.25s |
| Botón al agotarse | `gsap.to("[data-hint-btn]", { opacity: 0, y: -6, duration: 0.25, onComplete: ocultar })` + `gsap.from("[data-hint-done]", { opacity: 0, y: 6 })` | 0.25s `power2.out` |
| Zona al resolver | `gsap.to("[data-hint-zone]", { opacity: 0, y: -8, duration: 0.3, onComplete: setGone(true) })` (solo si la zona estaba visible) | 0.3s `power2.out` |
| Candado del panel | `gsap.fromTo("[data-lock-icon]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1 })` | 0.45s `back.out(2)` |
| Copy del panel bloqueado | `gsap.from("[data-lock-title]", { y: 10, opacity: 0, delay: 0.05 })` | 0.35s `power2.out` |
| Teasers | `gsap.from("[data-lock-teaser]", { y: 8, opacity: 0, stagger: 0.03, delay: 0.1 })` | 0.3s `power2.out` |
| Cambio de panel | Reutiliza el existente `data-panel` (y:14, 0.35s) | existente |
| Scroll al revelar (móvil) | `card.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" })` | — |

### 4.1 `prefers-reduced-motion`

- Con `reduceMotion === true`: nada de GSAP. Las cards, la nota y el estado bloqueado
  aparecen renderizadas al instante (el cambio de panel ya es instantáneo por el guard
  existente). `scrollIntoView` con `behavior: "auto"`.
- Los hover/active con `translate` siguen el patrón existente `motion-safe-*`/media query
  de `global.css` (líneas 458–495). No añadir animaciones infinitas.
- La celebración NO se toca; con reduced motion sigue siendo el check estático actual.

### 4.2 Por qué no compite con la celebración

- Las pistas no emiten toasts, no tienen partículas, no usan `shadow-glow`.
- La zona de pistas se desvanece antes del auto-nav (ver §2.1-A.5): al llegar a Solución
  ya no hay movimiento residual en el aside.
- `SolutionLocked` jamás monta en la ruta de victoria (`solved=true` antes de navegar),
  así que su pop de candado nunca se solapa con el confeti.

---

## 5. Accesibilidad

1. **Botón de pista**: `type="button"`, `aria-expanded={revealed > 0}`,
   `aria-controls={hintListId}` (el `<div>` contenedor de cards), label visible dinámico
   ("Mostrar pista" / "Siguiente pista" / "Última pista").
2. **aria-live**: región `sr-only` dedicada, `aria-live="polite" aria-atomic="true"`,
   con id estable vía `useId()`. Al revelar se escribe
   `Pista {i+1} de {total}: {hints[i]}`. Al agotar: `Todas las pistas reveladas.`.
   Las cards visibles quedan FUERA del aria-live (evita re-anuncios en cadena).
3. **Tab Solución**: el candado es `aria-hidden`; el estado se comunica vía
   `aria-label` dinámico ("Solución (bloqueada)" / "Solución"). La navegación por
   flechas del tablist (ya existente) sigue funcionando igual.
4. **Foco en el panel bloqueado**: cuando `activeTab` pasa a `"code"` y `!solved`
   (navegación manual), el foco se mueve al CTA (`data-solution-cta`) con
   `preventScroll: true`. Esto es idempotente: cada visita al tab bloqueado devuelve
   foco al CTA (correcto para teclado).
5. **CTA "Ir al desafío"**: al pulsarlo, el foco regresa al botón del tab Desafío
   (índice calculado en el tablist existente). No se enfoca el primer input del código:
   el tab activo ya es el contenedor enfocable.
6. **Contraste**: copy de pistas `text-cream/90` sobre `bg-surface-2/80` (cumple);
   la nota final `text-faint` es decorativa (no es info funcional crítica); los
   headers "PISTA N DE M" usan `mod-text` (mismo contraste que el resto del sistema).
   El botón de pista usa `mod-text` sobre `mod-bg-15` (mismo par que `mod-badge`, ya
   verificado en el sistema).
7. **Atajo `h` (opcional-recomendado)**: listener en `HintReveal`; ignora si el foco
   está en `INPUT`/`TEXTAREA`/`SELECT` o dentro de `[role='tablist']` (mismo guard del
   workspace). Al revelar, el aria-live lo anuncia; no hay anuncio de tecla.
8. **Dots y candados**: `aria-hidden`; ninguna información dependiente solo de color.

---

## 6. Casos borde y decisiones

| # | Caso | Comportamiento | Decisión |
|---|---|---|---|
| A | `exercise.hints` ausente o `[]` | No hay zona de pistas; candado aplica normal | Condición `hints.length > 0 && !solved` |
| B | `alreadyCompleted` true | `solved=true` al montar → sin candado, sin pistas, solución abierta | `HintReveal` devuelve `null` si `solved`; sin fade de salida (nunca montó) |
| C | Hints agotadas y solución sigue bloqueada | Se muestra "Todas las pistas reveladas"; el candado NO se desbloquea | **Decisión explícita**: el comentario de `types.ts` sugiere "o hasta agotar las pistas"; se rechaza para no filtrar la solución a quien spamea 3 clics. La recompensa es resolver, no gastar pistas. (dev: actualizar ese comentario a "hasta resolver" al implementar.) |
| D | Cambio de ejercicio con pistas abiertas | `key={exercise.id}` remonta `HintReveal` → `revealed` se resetea | Sin listeners huérfanos (gsap.context + revert) |
| E | Resolver con pistas a medias | `solved=true` → zona de pistas se desvanece (0.3s) y desaparece; `onComplete` marca `gone` para unmount | No se conservan las pistas tras resolver (ya no son útiles) |
| F | Pulsar Solución bloqueada durante la celebración | No es posible: el auto-nav solo ocurre con `solved=true`; `SolutionLocked` no monta en esa ruta | Sin sincronización extra |
| G | Un solo hint (`hints.length === 1`) | Botón "Mostrar pista" → "Última pista" → nota final | El flujo es agnóstico al total |
| H | Móvil | El aside apila sobre el código; al revelar una pista, `scrollIntoView nearest` evita que la card quede cortada | — |
| I | `h` dentro de un input del código | El guard de tag lo ignora; no interfiere con tipeo | — |
| J | Solución bloqueada visitada varias veces | Cada visita re-enfoca el CTA; no hay estado "ya la vi" | Predecible para teclado |
| K | Foco del tablist con candado | El tab bloqueado sigue en el roving order normal (tabIndex 0/-1); NO se elimina del tablist | Accesible, no oculto |

---

## 7. Alcance de implementación

**Se toca (solo UI/motion/a11y):**
- `src/components/HintReveal.tsx` (nuevo).
- `src/components/SolutionLocked.tsx` (nuevo).
- `src/components/ExerciseWorkspace.tsx` — 4 ediciones puntuales (§3).
- `src/lib/types.ts` — solo el comentario de la línea 121 (de "o hasta agotar las
  pistas si la UI lo permite" a "hasta resolver").

**NO se toca:**
- Modelo de datos (`Exercise`, formatos, `hints` tal como está), `src/data/*`.
- `SolutionPanel`, `ChallengeCode`, `ExerciseFormat`, formatos interactivos.
- Verificación (`verify`, `isAnswerCorrect`, `evaluateFormat`, `incorrectKeys`).
- Progreso (`useProgress`, `alreadyCompleted`, `onComplete`), share, toasts,
  SettingsModal, sidebar, footer del workspace.
- `global.css` (los tokens y `.mod-*` ya cubren todo; no añadir colores nuevos).

---

## 8. Checklist para dev-executor

- [ ] H1. Crear `HintReveal.tsx` con props `hints/solved/reduceMotion/color`; render `null` si `solved || !hints?.length`; estado `revealed`; `useId()` para ids.
- [ ] H2. Botón pill de color módulo con labels dinámicos, `aria-expanded/aria-controls`; dots de progreso `aria-hidden`.
- [ ] H3. Cards "Pista N de M" + región `sr-only aria-live="polite" aria-atomic="true"` que anuncia `Pista {n} de {m}: {texto}` y `Todas las pistas reveladas.`
- [ ] H4. Motion: card reveal + icon pop + crossfade de botón→nota + fade-out de zona al resolver; todo con `gsap.context` + guard `reduceMotion` + `scrollIntoView nearest`.
- [ ] H5. Atajo `h` (guard de inputs/tabs) — opcional recomendado.
- [ ] H6. Crear `SolutionLocked.tsx`: header 28px + glow + candado `data-lock-icon` + copy exacto + CTA `data-solution-cta` + 3 teasers `data-lock-teaser`; entradas GSAP guardadas.
- [ ] H7. En `ExerciseWorkspace`: render `HintReveal key={exercise.id}` en el aside; panel `code` condicional; 🔒 + `aria-label` en el tab; efecto de foco CTA en `activeTab==="code" && !solved`; `onGoToChallenge` con foco al tab Desafío.
- [ ] H8. `bun run build` sin errores TS; probar en desktop y móvil; verificar reduced-motion en DevTools.
- [ ] H9. Actualizar el comentario de `types.ts` (línea 121) a "hasta resolver".

---

## 9. Rúbrica de calificación (objetivo ≥ 9.0)

Puntúa 1–10 cada eje, nota final = promedio ponderado, redondeada a 1 decimal.
Iteración: máximo 3 rondas con `dev-executor`; cada feedback incluye nota por eje,
nota final y los 3–5 problemas de mayor impacto con corrección accionable.

| Eje (peso) | Qué mirar |
|---|---|
| **Coherencia (25%)** | Solo tokens y `.mod-*`; cero colores hardcodeados; radios según sistema (16 card menor / 20 zona y botón / 28 header); eyebrows mono uppercase; copy en el tono del proyecto; sin negro/blanco puro, sin CTA azul. No debe notarse que la feature es "pegada". |
| **Composición (25%)** | La zona de pistas no amontona el aside (espacio `mt-4`, padding `p-4`, crece bajo demanda); `SolutionLocked` respira (`space-y-5`, `py-7`, teasers en grid); nada se superpone con el footer ni con el toolbar del código; móvil correcto (scrollIntoView). |
| **Motion (20%)** | Card reveal + pop de icono + dots + crossfade al agotar + fade-out al resolver + pop de candado + stagger de teasers; todo GSAP con `context`/`revert`; `prefers-reduced-motion` deja todo instantáneo; la interacción nunca compite con la celebración. |
| **A11y (15%)** | `aria-expanded/aria-controls`, aria-live por pista (`aria-atomic`), `aria-label` dinámico en el tab bloqueado, foco al CTA en el panel bloqueado y retorno al tab Desafío, atajo `h` con guards, contraste de copy de pistas, dots/candados `aria-hidden`. |
| **Craft (15%)** | Copy exacto del spec; estados hover/active/focus del botón de pista; estado "Última pista" y nota final legibles; dots con transición; `key={exercise.id}` sin fugas de estado; sin dead controls; ids estables (`useId`); build limpio. |

**Umbral de entrega:** nota final ≥ **9.0** en la primera ronda o después de las
correcciones (máx. 3 rondas). Un 8 significa "bueno pero no Awwwards": se itera.
