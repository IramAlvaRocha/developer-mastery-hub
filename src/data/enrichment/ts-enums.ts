import type { EnrichmentMap } from "./enrich";

export const TS_ENUMS_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "En un edificio, los pisos pueden numerarse automáticamente: planta baja es 0, primero es 1, y así sucesivamente.",
    everydayInExplanation:
      "Si no les pones nombre especial a las direcciones, el sistema les asigna números en orden: 0, 1, 2, 3. Los enums numéricos hacen lo mismo: Up=0, Down=1, Left=2, Right=3.",
    theory: `### En palabras simples
Los enums numéricos asignan valores incrementales empezando desde 0 si no especificas otro valor. \`enum Direction { Up, Down, Left, Right }\` genera 0, 1, 2, 3.

### Ejemplo de la vida real
Los botones de un elevador sin etiquetas de texto: el primero es 0, el segundo 1. El sistema los numera en orden de aparición.

### En código
\`Direction.Up\` vale \`0\`. Los enums generan código JavaScript real (objeto con lookup bidireccional), con costo en bundle size.

### Tip para la entrevista
Los enums numéricos tienen reverse mapping (valor → nombre). Menciona el trade-off: generan JS en runtime vs union types que no.`,
  },

  2: {
    descriptionPrefix:
      "En lugar de números crípticos, pones etiquetas legibles: 'pendiente', 'enviado', 'entregado'.",
    everydayInExplanation:
      "Un rastreador de paquetes muestra 'pending' o 'shipped' en vez de 0 o 1. Los string enums usan texto explícito, más legible en logs y JSON que los numéricos.",
    theory: `### En palabras simples
Los string enums requieren asignación explícita: \`Pending = 'pending'\`. Cada miembro tiene un valor de texto que aparece tal cual en runtime y en serialización.

### Ejemplo de la vida real
El estado de tu pedido en una app de comida: 'preparando', 'en camino', 'entregado'. Leer 'en camino' es más claro que ver el número 2.

### En código
\`enum OrderStatus { Pending = 'pending', Shipped = 'shipped', ... }\`. \`OrderStatus.Pending\` retorna \`'pending'\`.

### Tip para la entrevista
Prefiere string enums sobre numéricos para legibilidad en JSON, logs y debugging. Son la opción más común en APIs modernas.`,
  },

  3: {
    descriptionPrefix:
      "Un club con pulseras de colores: solo entras si muestras una pulsera válida del menú de acceso.",
    everydayInExplanation:
      "En un evento, el seguridad solo acepta pulseras VIP, General o Staff — no acepta una pulsera escrita a mano. Usar enum como parámetro restringe valores y el IDE autocompleta opciones válidas.",
    theory: `### En palabras simples
\`function hasAccess(role: Role): boolean\` solo acepta miembros del enum Role. Pasar \`'admin'\` como string suelto da error; debes usar \`Role.Admin\`.

### Ejemplo de la vida real
Un cajero automático solo acepta montos predefinidos: 100, 200 o 500. Escribir otro número no es opción; el menú limita las respuestas válidas.

### En código
\`hasAccess(Role.Admin)\` OK. \`hasAccess('admin')\` error de compilación (a menos que el string coincida literalmente con el valor del enum).

### Tip para la entrevista
Los enums como parámetros previenen typos. El IDE autocompleta los valores válidos, reduciendo bugs de strings mágicos.`,
  },

  4: {
    descriptionPrefix:
      "En lugar de consultar un catálogo en la estantería, el cajero memoriza los códigos y los usa directamente.",
    everydayInExplanation:
      "Si ya sabes de memoria que 'OK' significa 200, no necesitas abrir el manual cada vez. \`const enum\` se elimina en compilación: los valores se sustituyen literalmente, sin objeto en runtime.",
    theory: `### En palabras simples
\`const enum HttpStatus { OK = 200, ... }\` no genera objeto JavaScript. En el código compilado, \`HttpStatus.OK\` se reemplaza por \`200\` directamente.

### Ejemplo de la vida real
Un mesero que conoce de memoria los precios del menú del día: no consulta la carta impresa en cada pedido, dice el número directamente.

### En código
\`if (status === HttpStatus.OK)\` compila a \`if (status === 200)\`. Zero runtime cost.

### Tip para la entrevista
\`const enum\` es ideal para performance y bundle size. Cuidado: no funciona bien con \`isolatedModules\` en algunos setups; muchos equipos prefieren \`as const\` objects.`,
  },

  5: {
    descriptionPrefix:
      "Puedes anotar los colores permitidos en una lista suelta o en un catálogo oficial con número de página.",
    everydayInExplanation:
      "Una lista en un post-it ('rojo, azul, verde') vs un catálogo impreso con índice. Los union types son livianos pero no puedes recorrerlos; los enums generan código pero permiten iterar y reverse mapping.",
    theory: `### En palabras simples
Union: \`type Theme = 'light' | 'dark' | 'system'\` — zero cost, no iterable en runtime. Enum: genera objeto JS, iterable con \`Object.values()\`, con reverse mapping en numéricos.

### Ejemplo de la vida real
Opciones de un menú escrito a mano (union) vs menú impreso con código de plato (enum). El impreso puedes fotocopiar y repartir; el de post-it es más liviano pero no tiene catálogo oficial.

### En código
\`Object.values(Theme2)\` funciona con enum. Con union type no puedes iterar los valores en runtime sin un arreglo auxiliar.

### Tip para la entrevista
Regla práctica: union types para 2-5 valores. Enums cuando necesites iterar, reverse mapping o un namespace agrupado.`,
  },

  6: {
    descriptionPrefix:
      "Combinas permisos como switches de luz: encendido + ventilador = ambos activos con un solo número.",
    everydayInExplanation:
      "En un panel de control, Read=1, Write=2, y ReadWrite=3 (1+2). Los miembros computados en enums numéricos permiten expresiones como operaciones bitwise.",
    theory: `### En palabras simples
En numeric enums, los miembros pueden ser expresiones: \`Read = 1 << 0\`, \`Write = 1 << 1\`, \`ReadWrite = Read | Write\`. Útil para flags y permisos combinables.

### Ejemplo de la vida real
Permisos de un archivo: leer (1), escribir (2), ejecutar (4). Combinar leer+escribir da 3. Cada permiso es un bit independiente que puedes encender o apagar.

### En código
\`FilePermission.ReadWrite\` vale \`3\` (1 | 2). Solo funciona en numeric enums, no en string enums.

### Tip para la entrevista
Los computed members son útiles para bitwise flags y configuraciones con operaciones matemáticas. Patrón clásico en permisos de sistemas.`,
  },

  7: {
    descriptionPrefix:
      "Un diccionario bilingüe: puedes buscar la palabra en español y obtener el inglés, o al revés.",
    everydayInExplanation:
      "Si sabes que el código 200 significa 'OK', también puedes preguntar '¿qué nombre tiene el 200?' y obtener 'OK'. Los enums numéricos tienen reverse mapping; los string enums no.",
    theory: `### En palabras simples
Forward: \`StatusCode.OK\` → \`200\`. Reverse: \`StatusCode[200]\` → \`'OK'\`. TypeScript genera automáticamente el lookup inverso en numeric enums.

### Ejemplo de la vida real
Un catálogo de productos con código de barras: escaneas el código y obtienes el nombre, o buscas el nombre y obtienes el código. Bidireccional.

### En código
\`StatusCode[404]\` retorna \`'NotFound'\`. Solo numeric enums; string enums no tienen reverse mapping.

### Tip para la entrevista
Advertencia explícita: solo numeric enums tienen reverse mapping. Si necesitas lookup inverso con strings, usa un Record auxiliar.`,
  },

  8: {
    descriptionPrefix:
      "Un operador de central telefónica que tiene un procedimiento distinto para cada tipo de llamada.",
    everydayInExplanation:
      "Según si la llamada es ventas, soporte o emergencia, el operador sigue un guion diferente. Un switch sobre enum verifica que manejes todos los casos; si agregas uno nuevo, el compilador avisa.",
    theory: `### En palabras simples
\`switch (action)\` sobre un enum con \`case Action.Create\`, etc. Combina con \`default: const _: never = action\` para exhaustividad: si falta un caso, error de compilación.

### Ejemplo de la vida real
Un restaurante con menú del día: cocina, postres o bebidas. Cada categoría tiene preparación distinta. Si añades "ensaladas" al menú, debes crear la receta o el sistema falla.

### En código
\`function handle(action: Action): string\` con switch exhaustivo y \`never\` en default.

### Tip para la entrevista
Combina enum + switch + never para exhaustividad. Si agregas un valor al enum, el compilador te señala el default. Red de seguridad gratis.`,
  },

  9: {
    descriptionPrefix:
      "Un tablero donde cada casilla del juego tiene su propia tarjeta de instrucciones pegada.",
    everydayInExplanation:
      "En un juego de mesa, cada casilla (baja, media, alta prioridad) tiene una tarjeta con el texto que debes leer. \`Record<Enum, T>\` garantiza una entrada para cada valor del enum.",
    theory: `### En palabras simples
\`const LABELS: Record<Severity, string>\` exige una clave por cada miembro del enum. Si olvidas uno, TypeScript error. Cada valor del enum mapea a datos asociados.

### Ejemplo de la vida real
Un semáforo de prioridades en hospital: verde, amarillo, rojo. Cada color tiene un cartel con instrucciones distintas. No puede faltar ninguno.

### En código
\`LABELS[Severity.High]\` → \`'Alta prioridad'\`. \`Record<Severity, string>\` fuerza completitud.

### Tip para la entrevista
\`Record<EnumType, Value>\` garantiza cobertura total. Patrón ideal para labels, configs y traducciones por valor de enum.`,
  },

  10: {
    descriptionPrefix:
      "Describes un catálogo que ya existe en otra tienda, sin imprimir uno nuevo en la tuya.",
    everydayInExplanation:
      "La librería de tu vecino ya tiene un sistema de niveles de log; tú solo anotas en tu cuaderno cómo se llama cada nivel para hablar el mismo idioma. \`declare enum\` describe enums externos sin generar código.",
    theory: `### En palabras simples
\`declare enum ExternalLogLevel { Debug = 0, Info = 1, ... }\` le dice a TypeScript que el enum existe en runtime (de una librería JS) pero no genera código al compilar.

### Ejemplo de la vida real
Tienes un manual de un electrodoméstico importado: describes los botones y modos que ya trae la máquina, sin fabricar botones nuevos.

### En código
\`function setLogLevel(level: ExternalLogLevel)\` con type safety. La implementación real está en la librería JS.

### Tip para la entrevista
\`declare enum\` es para tipar enums de librerías JS sin TypeScript. No genera código; solo informa al compilador.`,
  },

  11: {
    descriptionPrefix:
      "Dos personas agregan colores a la misma paleta en hojas distintas, y al juntarlas tienes la paleta completa.",
    everydayInExplanation:
      "Un módulo define Rojo y Azul; otro agrega Verde y Amarillo. Al fusionarse, Color tiene los cuatro. Los enums soportan declaration merging como las interfaces.",
    theory: `### En palabras simples
Múltiples declaraciones \`enum Color { ... }\` en distintos archivos se fusionan en un solo enum con todos los miembros. Útil cuando módulos extienden un enum compartido.

### Ejemplo de la vida real
Un menú de restaurante: la sección de entradas se imprime aparte y la de postres aparte, pero al armar el menú completo tienes ambas secciones juntas.

### En código
\`// base.ts: enum Color { Red, Blue }\` + \`// extended.ts: enum Color { Green, Yellow }\` → Color tiene los cuatro.

### Tip para la entrevista
El enum merging es útil cuando diferentes módulos necesitan agregar valores a un enum compartido. Patrón menos común pero válido en codebases modulares.`,
  },

  12: {
    descriptionPrefix:
      "Cada tipo de campo en un formulario (texto, número, selector) trae reglas de validación distintas.",
    everydayInExplanation:
      "Un campo de texto pide longitud máxima; uno numérico pide mínimo y máximo; un selector pide lista de opciones. Asociar cada valor de enum con una interface diferente modela configs por tipo.",
    theory: `### En palabras simples
\`interface FieldConfig\` mapea cada \`FieldType\` a su config específica. \`createField<T>(type: T, config: FieldConfig[T])\` garantiza que la config coincida con el tipo de campo.

### Ejemplo de la vida real
Una tienda con distintos tipos de producto: ropa pide talla, electrónicos piden voltaje, alimentos piden fecha de caducidad. Cada categoría tiene ficha distinta.

### En código
\`FieldConfig[FieldType.Text]\` → \`{ maxLength: number }\`. \`FieldConfig[FieldType.Number]\` → \`{ min: number; max: number }\`.

### Tip para la entrevista
Patrón usado en formularios dinámicos, configs por entorno y sistemas de plugins. Combina enum + mapped types.`,
  },

  13: {
    descriptionPrefix:
      "Sacas la lista completa de opciones de un menú para llenar un dropdown o un filtro.",
    everydayInExplanation:
      "Para un selector de frutas en una app, necesitas todas las opciones: manzana, plátano, cereza. \`Object.values(Fruit)\` obtiene todos los valores de un enum para dropdowns e iteraciones.",
    theory: `### En palabras simples
\`Object.values(Fruit)\` retorna \`['apple', 'banana', 'cherry']\` en string enums. \`Object.keys()\` da los nombres de miembros. Para numeric enums, \`Object.values()\` incluye reverse mappings — filtra con \`typeof\`.

### Ejemplo de la vida real
Imprimir todas las opciones de un menú de restaurante para pegarlas en la pared. Necesitas la lista completa, no solo una opción.

### En código
\`const options = Object.keys(Fruit).map(key => ({ label: key, value: Fruit[key] }))\` para dropdowns.

### Tip para la entrevista
Advertencia: numeric enums incluyen reverse mappings en \`Object.values()\`. Filtra con \`typeof v === 'string'\` o \`typeof v === 'number'\` según lo que necesites.`,
  },

  14: {
    descriptionPrefix:
      "Un guardia en la entrada verifica que tu credencial esté en la lista oficial antes de dejarte pasar.",
    everydayInExplanation:
      "Alguien dice 'soy admin' pero el guardia revisa la lista de roles válidos. Una función type guard \`isStatus(value)\` valida en runtime si un string es miembro del enum.",
    theory: `### En palabras simples
\`function isStatus(value: string): value is Status\` retorna true si \`value\` está en \`Object.values(Status)\`. Dentro del \`if\`, TypeScript estrecha el tipo a Status.

### Ejemplo de la vida real
Validar un cupón de descuento: el cajero escanea el código y el sistema confirma si existe en la base de promociones activas antes de aplicarlo.

### En código
\`if (isStatus(input)) { console.log(input); }\` — dentro del if, \`input\` es \`Status\`, no \`string\`.

### Tip para la entrevista
Esencial para validar datos de APIs externas contra tus enums. Sin esto, confías ciegamente en strings del usuario o del backend.`,
  },

  15: {
    descriptionPrefix:
      "En lugar de un catálogo impreso, usas una hoja con valores fijos que no genera libro extra.",
    everydayInExplanation:
      "Un post-it con STATUS = { Active: 'active', Inactive: 'inactive' } congelado (\`as const\`) es liviano y flexible. Muchos equipos modernos prefieren objetos \`as const\` sobre enums por tree-shaking y zero runtime cost.",
    theory: `### En palabras simples
\`const STATUS = { Active: 'active', Inactive: 'inactive', Pending: 'pending' } as const\`. \`type Status = typeof STATUS[keyof typeof STATUS]\` extrae el union \`'active' | 'inactive' | 'pending'\`.

### Ejemplo de la vida real
Una lista de códigos de descuento en una nota adhesiva: liviana, fácil de cambiar, sin imprimir un catálogo formal. Funciona igual pero con menos peso.

### En código
\`setStatus(STATUS.Active)\` OK. \`type Status = typeof STATUS[keyof typeof STATUS]\` da el union type.

### Tip para la entrevista
Alternativa moderna a enums. Mejor tree-shaking, zero runtime cost, más flexible. Muchos equipos la prefieren sobre \`enum\` tradicional.`,
  },
};
