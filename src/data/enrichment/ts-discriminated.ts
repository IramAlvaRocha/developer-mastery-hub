import type { EnrichmentMap } from "./enrich";

export const TS_DISCRIMINATED_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Cada forma geométrica lleva una etiqueta que dice qué es: círculo o cuadrado, y solo trae los datos que le corresponden.",
    everydayInExplanation:
      "En un juego de memoria, las tarjetas de 'círculo' muestran el radio y las de 'cuadrado' el lado. El campo \`kind\` con valor literal es la etiqueta que TypeScript usa para saber qué propiedades existen en cada variante.",
    theory: `### En palabras simples
Un discriminated union usa una propiedad común (discriminant) con valores literales distintos. \`kind: 'circle'\` vs \`kind: 'square'\` permite a TS diferenciar variantes y estrechar tipos automáticamente.

### Ejemplo de la vida real
Paquetes en correos: 'sobre' trae carta, 'caja' trae dimensiones. El tipo de envío determina qué información está disponible y qué procedimiento sigues.

### En código
\`type Shape = Circle | Square\`. \`if (s.kind === 'circle') return Math.PI * s.radius ** 2\` — TS sabe que \`s\` es Circle dentro del if.

### Tip para la entrevista
El campo \`kind\`/\`type\` con literales es el discriminante. Es la base de Redux actions, API responses y modelado de estados.`,
  },

  2: {
    descriptionPrefix:
      "Un operador de central revisa el tipo de llamada y sigue el guion correspondiente sin mezclar procedimientos.",
    everydayInExplanation:
      "Si la acción es INCREMENT, sumas; si es DECREMENT, restas; si es RESET, vuelves a cero. El switch sobre el discriminante \`action.type\` es la forma más limpia de manejar todas las variantes.",
    theory: `### En palabras simples
\`switch (action.type)\` sobre un discriminated union. Cada \`case\` estrecha el tipo y da acceso a las propiedades específicas de esa variante (\`action.amount\` en INCREMENT).

### Ejemplo de la vida real
Un menú de opciones en un cajero: retirar, depositar o consultar saldo. Cada opción activa un flujo distinto; el menú evita mezclar pasos de operaciones diferentes.

### En código
\`function reducer(state: number, action: Action): number\` con cases para INCREMENT, DECREMENT y RESET.

### Tip para la entrevista
El switch con discriminated unions es el patrón Redux/Pinia para reducers type-safe. Combínalo con \`never\` en default para exhaustividad.`,
  },

  3: {
    descriptionPrefix:
      "Si aparece un tipo de emergencia que no está en el manual, suena la alarma porque no hay procedimiento para eso.",
    everydayInExplanation:
      "Un hospital tiene protocolos para gripe, fractura y quemadura. Si llega un caso nuevo sin protocolo, el sistema debe gritar '¡falta un procedimiento!'. \`never\` en el default del switch hace que TS avise si olvidas una variante.",
    theory: `### En palabras simples
\`default: const _check: never = event\` fuerza exhaustividad. Si agregas una variante al union y no la manejas, \`event\` ya no es \`never\` y el compilador error.

### Ejemplo de la vida real
Un semáforo con rojo, amarillo y verde. Si alguien instala un cuarto color sin actualizar el manual de tránsito, hay un hueco peligroso. El \`never\` es esa alarma de manual incompleto.

### En código
\`const _check: never = event\` en default. Compile error si falta un \`case\`.

### Tip para la entrevista
Patrón exhaustivo indispensable. Cuando amplíes un union type, el compilador te señala el default. Red de seguridad gratis en refactorings.`,
  },

  4: {
    descriptionPrefix:
      "En lugar de lanzar excepciones, devuelves un sobre que dice 'éxito con datos' o 'error con mensaje'.",
    everydayInExplanation:
      "Un mensajero te entrega un sobre verde (todo bien, aquí está el paquete) o rojo (falló, aquí está la razón). El patrón Result fuerza a abrir el sobre correcto antes de usar lo de adentro.",
    theory: `### En palabras simples
\`type Result<T, E> = { ok: true; data: T } | { ok: false; error: E }\`. El discriminante \`ok\` determina qué propiedades existen: \`data\` o \`error\`, nunca ambas a la vez.

### Ejemplo de la vida real
Un examen de laboratorio: resultado normal (valores) o anormal (explicación del problema). El médico sabe qué sección leer según el encabezado del reporte.

### En código
\`if (result.ok) { console.log(result.data); } else { console.error(result.error); }\` — type-safe en cada rama.

### Tip para la entrevista
Más predecible que try/catch: fuerza al llamador a manejar el error explícitamente. Inspirado en Rust/Go; muy valorado en entrevistas senior.`,
  },

  5: {
    descriptionPrefix:
      "Un pedido online pasa por estados claros: esperando, preparando, entregado o fallido — cada uno con información distinta.",
    everydayInExplanation:
      "Mientras 'cargando', no hay datos todavía; cuando 'éxito', sí hay lista de productos; si 'error', hay mensaje. Modelar async con discriminated union elimina bugs de 'data puede ser null mientras loading es true'.",
    theory: `### En palabras simples
\`type AsyncState<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: string }\`. Cada estado tiene solo las propiedades que le corresponden.

### Ejemplo de la vida real
Rastrear un paquete: 'en tránsito' no tiene fecha de entrega aún; 'entregado' sí tiene hora y firma; 'devuelto' tiene motivo. Cada estado trae datos distintos.

### En código
\`switch (state.status)\` con cases idle, loading, success, error. En success, \`state.data\` existe con certeza.

### Tip para la entrevista
Elimina el anti-patrón de \`isLoading\`, \`data\` y \`error\` como booleans/valores sueltos que pueden combinarse de formas imposibles.`,
  },

  6: {
    descriptionPrefix:
      "Un formulario dinámico donde cada tipo de pregunta (texto, número, selector) trae reglas distintas.",
    everydayInExplanation:
      "Campo de nombre: máximo 50 caracteres. Campo de edad: entre 0 y 120. Campo de país: lista de opciones. Cada variante del union \`FormField\` tiene configuración específica según \`type\`.",
    theory: `### En palabras simples
\`type FormField = { type: 'text'; maxLength: number } | { type: 'number'; min: number; max: number } | { type: 'select'; options: string[] }\`. El discriminante \`type\` controla qué props existen.

### Ejemplo de la vida real
Una encuesta con preguntas abiertas, numéricas y de opción múltiple. Cada pregunta se imprime distinto según su categoría en el formulario.

### En código
\`switch (field.type)\` con acceso a \`field.maxLength\`, \`field.min\`/\`field.max\` o \`field.options\` según el case.

### Tip para la entrevista
Patrón usado en form builders dinámicos definidos por JSON/config. Demuestra modelado de UI type-safe.`,
  },

  7: {
    descriptionPrefix:
      "La respuesta de un servicio cambia según el código: éxito trae datos, error de validación trae lista de fallos.",
    everydayInExplanation:
      "Si el servidor responde 200, hay usuario; si 400, hay errores por campo; si 500, hay mensaje genérico. Modelar \`ApiResponse\` como discriminated union evita el clásico \`if (response.data)\` inseguro.",
    theory: `### En palabras simples
\`type ApiResponse<T> = { status: 200; data: T } | { status: 400; errors: ... } | { status: 500; message: string }\`. El status numérico es el discriminante.

### Ejemplo de la vida real
Un buzón de respuestas: carta verde (todo bien, aquí está el contenido), amarilla (faltan datos, aquí la lista), roja (problema grave, aquí el aviso).

### En código
\`if (res.status === 200) { console.log(res.data.name); }\` — TS sabe que \`data\` existe. En 400, \`errors\` existe.

### Tip para la entrevista
Evita acceder a propiedades que no existen según el status. Patrón esencial en clientes HTTP tipados (fetch, axios wrappers).`,
  },

  8: {
    descriptionPrefix:
      "Cada tipo de alerta en tu celular (éxito, error, advertencia) muestra información distinta en pantalla.",
    everydayInExplanation:
      "Un toast de éxito solo dice 'Guardado'. Uno de error muestra código y mensaje. Uno de advertencia puede ser descartable. \`Notification\` discrimina por \`kind\` y cada variante tiene props propias.",
    theory: `### En palabras simples
\`type Notification = { kind: 'success'; message: string } | { kind: 'error'; message: string; code: number } | { kind: 'warning'; message: string; dismissible?: boolean }\`.

### Ejemplo de la vida real
Alertas de clima: sol (mensaje simple), tormenta (código de severidad + recomendaciones), viento (opción de silenciar). Cada alerta trae lo que necesitas para actuar.

### En código
\`switch (n.kind)\` — en 'error' accedes a \`n.code\`; en 'warning' a \`n.dismissible\`.

### Tip para la entrevista
Patrón común en toasts, alerts y sistemas de notificaciones. Demuestra modelado de UI con datos específicos por variante.`,
  },

  9: {
    descriptionPrefix:
      "Tu sesión en una app puede estar en distintos momentos: invitado, cargando, conectado o con error — y en cada uno tienes datos distintos.",
    everydayInExplanation:
      "Como entrar a un banco: sin identificarte (invitado), en fila (autenticando), dentro con tu tarjeta (autenticado) o rechazado (error). Solo en 'autenticado' tienes acceso a \`user\` y \`token\`.",
    theory: `### En palabras simples
\`type AuthState = { status: 'anonymous' } | { status: 'authenticating' } | { status: 'authenticated'; user: ...; token: string } | { status: 'error'; message: string }\`.

### Ejemplo de la vida real
Estados de un vuelo: sin reservar, reservando, confirmado (con boleto y asiento) o cancelado (con motivo). Cada fase tiene información disponible distinta.

### En código
\`if (auth.status === 'authenticated') { return auth.user.name; }\` — acceso type-safe a user.

### Tip para la entrevista
Evita el anti-patrón \`user: User | null\` con \`isLoggedIn: boolean\` que pueden desincronizarse. State machine tipada es más robusta.`,
  },

  10: {
    descriptionPrefix:
      "Un sistema de órdenes donde cada comando ('crear usuario', 'eliminar', 'cambiar rol') trae instrucciones específicas.",
    everydayInExplanation:
      "Como pedir en un restaurante: 'CREATE_USER' trae nombre y email; 'DELETE_USER' trae solo id. El discriminante \`cmd\` y el \`payload\` tipado evitan mezclar datos de comandos distintos.",
    theory: `### En palabras simples
\`type Command = { cmd: 'CREATE_USER'; payload: { name; email } } | { cmd: 'DELETE_USER'; payload: { id: number } } | ...\`. Cada comando tiene payload distinto.

### Ejemplo de la vida real
Instrucciones para un asistente: 'comprar' (lista de productos), 'cancelar' (número de orden), 'cambiar dirección' (nueva dirección). Cada instrucción trae lo que necesita.

### En código
\`switch (command.cmd)\` — en CREATE_USER accedes a \`command.payload.name\`; en DELETE_USER a \`command.payload.id\`.

### Tip para la entrevista
Base de Redux actions, CQRS commands y event sourcing. Patrón fundamental en arquitecturas event-driven tipadas.`,
  },

  11: {
    descriptionPrefix:
      "Una promesa puede estar pendiente, cumplida con valor o rechazada con razón — y cada estado trae información distinta.",
    everydayInExplanation:
      "Como un paquete: 'en camino' (sin contenido aún), 'entregado' (con el producto) o 'devuelto' (con motivo). \`AsyncResult<T>\` combina discriminated unions con generics para resultados polimórficos.",
    theory: `### En palabras simples
\`type AsyncResult<T> = { state: 'pending' } | { state: 'fulfilled'; value: T } | { state: 'rejected'; reason: Error }\`. T parametriza el tipo del valor en fulfilled.

### Ejemplo de la vida real
Estados de una apuesta: pendiente, ganada (con monto) o perdida (con explicación). El tipo de premio cambia según qué apostaste.

### En código
\`if (result.state === 'fulfilled') return result.value\` — T accesible con certeza.

### Tip para la entrevista
Versión type-safe de respuestas Axios (AxiosResponse vs AxiosError). Combina generics + discriminated unions en APIs async.`,
  },

  12: {
    descriptionPrefix:
      "Un guía turístico tiene un capítulo distinto para cada tipo de atracción: texto, imagen o enlace.",
    everydayInExplanation:
      "Para un párrafo lees el contenido; para una foto miras la URL; para un enlace usas href y label. El Visitor pattern con handlers mapeados procesa cada variante con su función específica.",
    theory: `### En palabras simples
\`type Handlers = { [K in Node['type']]: (node: Extract<Node, { type: K }>) => string }\`. Cada clave del discriminante tiene su handler con el nodo estrechado al tipo correcto.

### Ejemplo de la vida real
Un manual de instrucciones con secciones por tipo de electrodoméstico: nevera, lavadora, microondas. Cada sección explica solo lo relevante para ese aparato.

### En código
\`handlers.text\`, \`handlers.image\`, \`handlers.link\` — cada uno recibe el nodo con props correctas.

### Tip para la entrevista
Visitor con discriminated unions es más limpio que OOP clásico y 100% type-safe. Útil en ASTs, renderers y serializers.`,
  },

  13: {
    descriptionPrefix:
      "Un semáforo solo puede pasar de rojo a verde, de verde a amarillo y de amarillo a rojo — no hay atajos imposibles.",
    everydayInExplanation:
      "Las transiciones válidas están escritas en cada estado. Si estás en rojo, solo puedes ir a verde. Una state machine tipada elimina transiciones imposibles en compile time.",
    theory: `### En palabras simples
\`type TrafficLight = { state: 'red'; canTransitionTo: 'green' } | { state: 'green'; canTransitionTo: 'yellow' } | ...\`. \`NextState<T>\` extrae el estado destino válido.

### Ejemplo de la vida real
Flujo de una lavadora: enjuague → centrifugado → secado. No puedes saltar de 'llenando agua' directo a 'secado' sin pasar por los pasos intermedios.

### En código
\`type AfterRed = NextState<{ state: 'red'; canTransitionTo: 'green' }>\` → solo 'green' es válido.

### Tip para la entrevista
Patrón de XState y similares. Las state machines tipadas eliminan estados imposibles — muy valorado en entrevistas de arquitectura frontend.`,
  },

  14: {
    descriptionPrefix:
      "Un sistema de eventos donde cada tipo ('login', 'logout', 'error') trae datos distintos al suscriptor.",
    everydayInExplanation:
      "Cuando alguien inicia sesión, recibes userId y timestamp; cuando cierra sesión, solo userId; cuando hay error, mensaje y código. \`EventMap\` con \`on<K>(event, handler)\` tipa cada payload.",
    theory: `### En palabras simples
\`interface EventMap { 'user:login': { userId; timestamp }; 'user:logout': { userId }; 'error': { message; code } }\`. \`on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void)\`.

### Ejemplo de la vida real
Suscripciones a un canal de noticias: 'deportes' trae marcador, 'clima' trae temperatura, 'tráfico' trae rutas. Cada canal entrega información distinta al suscriptor.

### En código
\`on('user:login', (payload) => console.log(payload.userId))\` — payload tipado automáticamente.

### Tip para la entrevista
Usado en Vue defineEmits, Node EventEmitter tipado y sistemas de mensajería. Patrón esencial para APIs de eventos type-safe.`,
  },

  15: {
    descriptionPrefix:
      "Un trámite paso a paso donde no puedes firmar hasta haber llenado nombre y correo en orden.",
    everydayInExplanation:
      "Como registrarte en un sitio: primero nombre, luego email, y solo entonces puedes finalizar. Un builder con discriminated steps cambia su tipo en cada paso, garantizando el orden en compile time.",
    theory: `### En palabras simples
\`WithName\` → \`WithEmail\` → \`Complete\`. Cada función (\`setName\`, \`setEmail\`, \`build\`) requiere el tipo del paso anterior. No puedes saltar pasos ni construir incompleto.

### Ejemplo de la vida real
Sacar una licencia de conducir: primero CURP, luego examen médico, luego examen teórico. No puedes obtener la licencia sin completar los pasos previos en orden.

### En código
\`build(setEmail(setName('Iram'), 'iram@test.com'))\` — cada paso retorna el tipo acumulado.

### Tip para la entrevista
Patrón avanzado de tipos progresivos. Garantiza en compile time que todos los pasos se ejecutan en orden — usado en builders y formularios multi-paso.`,
  },
};
