import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_EXTRAS_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Tienes cajas dentro de cajas con juguetes y quieres vaciarlas a un solo nivel o hasta el fondo.",
    everydayInExplanation:
      "Una bolsa tiene bolsitas adentro: flat(1) saca un nivel (los juguetes de cada bolsa a la caja grande pero sin abrir sub-bolsas). flat(Infinity) abre todo hasta que no quede nada anidado — como volcar todas las mochilas del salón en el piso.",
    theory: `### En palabras simples
\`flat()\` aplana arrays anidados. \`flat()\` o \`flat(1)\` un nivel; \`flat(Infinity)\` todos los niveles. Retorna array nuevo, no muta.

### Ejemplo de la vida real
Playlists dentro de carpetas: quieres una sola lista de canciones para shuffle, sin importar en qué carpeta estaba cada tema.

### En código
\`nested.flat()\` → un nivel. \`nested.flat(Infinity)\` → completamente plano \`[1, 2, 3, 4, 5, 6]\`.

### Tip para la entrevista
Antes de flat existía reduce+concat. flat es más legible. Cuidado con arrays muy profundos e Infinity en memoria.`,
  },

  2: {
    descriptionPrefix:
      "Cada oración de tu lista se parte en palabras y quieres una sola fila de palabras, no filas de filas.",
    everydayInExplanation:
      "flatMap hace 'partir en palabras y aplanar' en un paso: cada frase produce varias palabras y todas caen en una lista única. Más eficiente que map y luego flat por separado — como cortar y servir en un solo movimiento.",
    theory: `### En palabras simples
\`flatMap()\` = \`map()\` + aplanar un nivel. Ideal cuando cada elemento produce **varios** resultados (relación 1 a N).

### Ejemplo de la vida real
Lista de ingredientes por receta: cada receta devuelve varios ítems; quieres un solo checklist de compras del súper.

### En código
\`sentences.flatMap(s => s.split(' '))\` → \`['hello', 'world', 'foo', 'bar', 'baz']\`. Equivalente: \`sentences.map(s => s.split(' ')).flat()\`.

### Tip para la entrevista
flatMap solo aplana un nivel. Para profundidad mayor, encadena flat o usa flatMap anidado con cuidado.`,
  },

  3: {
    descriptionPrefix:
      "Antes de colgar un letrero 'Solo administradores', compruebas si tu credencial está en la lista permitida.",
    everydayInExplanation:
      "Roles ['admin', 'editor', 'viewer']: includes('admin') → true. Es búsqueda simple '¿está este valor exacto?' como revisar si 'leche' está tachada en la lista de compras.",
    theory: `### En palabras simples
\`includes(valor)\` retorna boolean. Usa igualdad estricta (===). Para objetos compara referencia, no contenido.

### Ejemplo de la vida real
Verificar si la canción actual está en tu playlist de favoritos antes de mostrar el corazón lleno.

### En código
\`roles.includes('admin')\` → true. \`roles.includes('moderator')\` → false.

### Tip para la entrevista
Para objetos usa \`some(x => x.id === id)\`. includes con objetos casi nunca funciona como esperas (referencias distintas).`,
  },

  4: {
    descriptionPrefix:
      "Para saber cuál fue la última foto que subiste, no cuentas desde el inicio: vas directo al final del álbum.",
    everydayInExplanation:
      "at(-1) es la última canción de la playlist; at(-2) la penúltima. Más claro que escribir stack[stack.length - 1] — como decir 'el de hasta abajo' en una pila de ropa limpia.",
    theory: `### En palabras simples
\`at(n)\` accede por índice; índices negativos cuentan desde el final. \`at(-1)\` = último elemento. ES2022+.

### Ejemplo de la vida real
En el historial de búsqueda del navegador, el término más reciente está 'al final'; at(-1) lo obtiene sin calcular length.

### En código
\`stack.at(-1)\` → 'last'. \`stack.at(-2)\` → 'middle'.

### Tip para la entrevista
at(undefined) retorna undefined. Para TS strict, sigue siendo útil vs [length-1] cuando length puede ser 0 (at(-1) → undefined, no error).`,
  },

  5: {
    descriptionPrefix:
      "A veces necesitas armar una lista desde cero: numerar asientos, quitar duplicados o partir un texto en letras.",
    everydayInExplanation:
      "Array.from({ length: 5 }, (_, i) => i) crea [0,1,2,3,4] como numerar filas del cine. Desde un Set quitas repetidos en playlist; desde 'hola' obtienes ['h','o','l','a'].",
    theory: `### En palabras simples
\`Array.from()\` crea arrays desde iterables, array-likes o con función de mapeo. Útil para NodeList, Set, Map, secuencias.

### Ejemplo de la vida real
Generar 30 números de asiento para el salón o convertir lista de invitados únicos (sin nombres repetidos) desde un borrador desordenado.

### En código
\`Array.from({ length: 5 }, (_, i) => i)\` → [0..4]. \`Array.from(new Set([1,2,2,3]))\` → [1,2,3]. \`Array.from('hola')\` → caracteres.

### Tip para la entrevista
\`[...iterable]\` también convierte iterables. Array.from acepta map function en segundo argumento — spread no.`,
  },

  6: {
    descriptionPrefix:
      "Al repasar la lista de compras, a veces necesitas tanto el número de renglón como el producto.",
    everydayInExplanation:
      "entries() te da pares [0, 'manzanas'], [1, 'leche']… como enumerar tareas en pizarra: posición + contenido. Útil en for...of cuando el índice importa tanto como el valor.",
    theory: `### En palabras simples
\`arr.entries()\` retorna iterador de tuplas [índice, valor]. Spread a array: \`[...fruits.entries()]\`.

### Ejemplo de la vida real
En álbum numerado imprimes 'Foto 3: atardecer en la playa' — necesitas índice y título juntos.

### En código
\`for (const [index, fruit] of fruits.entries()) { ... }\`. \`const pairs = [...fruits.entries()]\`.

### Tip para la entrevista
Para solo índice a veces basta forEach o map con index. entries() brilla en for...of sin off-by-one manual.`,
  },

  7: {
    descriptionPrefix:
      "En la lista de tareas insertas una urgente en medio o quitas la que ya hiciste — la lista original se reescribe.",
    everydayInExplanation:
      "splice modifica la lista in-place: quitar 'b', insertar 'x', reemplazar por 'z'. En apps modernas preferir toSpliced o copiar antes, como no tachar permanentemente la lista maestra del súper si solo quieres una vista de 'pendientes'.",
    theory: `### En palabras simples
\`splice(start, deleteCount, ...items)\` muta: elimina, inserta o reemplaza en posición. Retorna elementos removidos.

### Ejemplo de la vida real
Reordenar playlist en vivo quitando una canción en posición 2 e insertando otra — la lista en el reproductor cambia al instante.

### En código
\`items.splice(1, 1)\` quita uno en índice 1. \`items.splice(1, 0, 'x')\` inserta sin borrar.

### Tip para la entrevista
splice muta — evítalo en estado React/Vue. ES2023: toSpliced para versión inmutable.`,
  },

  8: {
    descriptionPrefix:
      "Quieres fotocopiar solo el medio del álbum o los dos últimos recuerdos sin recortar el álbum original.",
    everydayInExplanation:
      "slice extrae porción y deja intacto el original: del índice 1 al 3 (sin incluir 3), últimos dos con slice(-2), copia completa con slice(). Es sacar post-its de una lista sin borrar la lista pegada en la nevera.",
    theory: `### En palabras simples
\`slice(start, end)\` — end excluido. \`slice(-2)\` últimos dos. \`slice()\` copia superficial completa. **No muta**.

### Ejemplo de la vida real
Compartir con un amigo solo las fotos 5 a 10 del viaje; tu álbum completo sigue en el teléfono.

### En código
\`nums.slice(1, 3)\` → [20, 30]. \`nums.slice(-2)\` → [40, 50]. \`nums.slice()\` → copia.

### Tip para la entrevista
slice vs splice: slice no muta (s de silent/copy mental). splice muta. Pregunta clásica de entrevista junior.`,
  },

  9: {
    descriptionPrefix:
      "Al revisar la configuración del router, quieres listar cada opción con su valor sin perder el nombre correcto de cada campo.",
    everydayInExplanation:
      "Object.keys, values y entries recorren objetos como fichas de ajustes: host, port, debug. TypeScript retorna string[] en keys — a veces necesitas cast a keyof para autocompletado seguro.",
    theory: `### En palabras simples
\`Object.keys(obj)\` → string[]. \`Object.values(obj)\`. \`Object.entries(obj)\` → [key, value][]. Para tipado: \`as (keyof Config)[]\`.

### Ejemplo de la vida real
Checklist de preparación del salón: cada ítem (sillas, proyector, WiFi) con estado listo/no listo — entries para pintar tabla clave-valor.

### En código
\`Object.entries(config)\` → \`[['host', 'localhost'], ['port', 3000], ...]\`.

### Tip para la entrevista
Object.keys no estrecha a keyof T en TS estricto — cast consciente o helper typedKeys. Evita as any.`,
  },

  10: {
    descriptionPrefix:
      "Si duplicas un álbum de fotos con etiquetas y fechas, quieres copia profunda: editar la copia no debe borrar tags del original.",
    everydayInExplanation:
      "JSON.parse(JSON.stringify()) pierde fechas y funciones. structuredClone copia profundo como fotocopiar el álbum entero con metadatos — push en clone.tags no afecta original.tags.",
    theory: `### En palabras simples
\`structuredClone(obj)\` deep copy nativo. Soporta Date, Map, Set, ArrayBuffer. Reemplazo moderno del truco JSON para clones reales.

### Ejemplo de la vida real
Duplicas configuración de playlist para experimentar orden y filtros; la playlist original del roomie no cambia.

### En código
\`const clone = structuredClone(original);\` \`clone.tags.push('node');\` — \`original.tags.length\` sin cambio.

### Tip para la entrevista
structuredClone no clona funciones, DOM nodes, prototypes. Para state inmutable en UI, a menudo basta spread shallow; deep cuando hay anidación.`,
  },
};
