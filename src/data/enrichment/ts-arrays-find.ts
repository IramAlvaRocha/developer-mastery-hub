import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_FIND_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "En una fila de números de turno, buscas el primero que sea mayor que 25 y te detienes ahí.",
    everydayInExplanation:
      "No necesitas revisar todos los turnos hasta el final: en cuanto encuentras el 30, ya tienes lo que buscabas. Si ninguno cumple, te quedas con 'no encontrado'. find() devuelve el primer match o undefined.",
    theory: `### En palabras simples
\`find()\` recorre un arreglo y devuelve el **primer** elemento que cumple la condición. Si ninguno cumple, devuelve \`undefined\`. El tipo de retorno es \`T | undefined\`.

### Ejemplo de la vida real
En la playlist buscas la primera canción de más de 5 minutos para ponerla de fondo mientras cocinas. Apenas la encuentras, dejas de buscar; no escuchas todo el álbum entero.

### En código
\`nums.find(n => n > 25)\` con \`[10, 20, 30, 40]\` devuelve \`30\`. Siempre verifica el resultado antes de usarlo.

### Tip para la entrevista
\`find\` hace short-circuit: para en el primer match. Más eficiente que \`filter()[0]\` en arreglos grandes.`,
  },

  2: {
    descriptionPrefix:
      "En el directorio del salón buscas al alumno con número de lista 1 para leer su nombre en voz alta.",
    everydayInExplanation:
      "Cada ficha tiene id y nombre. Buscas 'id === 1' como quien busca el contacto 'María' en la agenda por su clave. Es el caso de uso más común: lookup por identificador único.",
    theory: `### En palabras simples
\`find()\` sobre objetos casi siempre busca por \`id\` u otra clave única. Devuelve el objeto completo o \`undefined\` si no existe.

### Ejemplo de la vida real
En un álbum de fotos digital buscas la foto con id 42 para ponerla de portada. No necesitas todas las fotos; solo la primera (y única) que coincida con ese id.

### En código
\`const user = users.find(u => u.id === 1)\`. Dentro de \`if (user)\`, TypeScript sabe que no es undefined y puedes usar \`user.name\`.

### Tip para la entrevista
Para búsquedas frecuentes por ID en listas grandes, considera \`Map<id, T>\` — O(1) vs O(n) de find en array.`,
  },

  3: {
    descriptionPrefix:
      "No solo quieres saber qué canción es, sino en qué posición exacta está en la playlist para quitarla.",
    everydayInExplanation:
      "Encuentras que 'Angular' está en la posición 2 (tercera canción, contando desde 0). Con ese número puedes sacarla o reemplazarla. findIndex() te da la posición; find() te da el elemento.",
    theory: `### En palabras simples
\`findIndex()\` devuelve el **índice** del primer match o \`-1\` si no hay coincidencia. Útil antes de \`splice\`, actualizar o eliminar en posición.

### Ejemplo de la vida real
En la lista de compras escrita en orden, buscas dónde dice 'leche' para tacharla o moverla arriba. Necesitas el número de línea, no solo la palabra 'leche'.

### En código
\`const idx = items.findIndex(i => i === 'angular')\` → \`2\`. Si \`idx !== -1\`, puedes \`items.splice(idx, 1)\` con seguridad.

### Tip para la entrevista
Siempre comprueba \`!== -1\` antes de usar el índice. \`-1\` con splice tiene comportamiento peligroso (modifica desde el final).`,
  },

  4: {
    descriptionPrefix:
      "Buscas el tema 'oscuro' en ajustes y, si no existe, no quieres que la app truene — solo que no cambie nada.",
    everydayInExplanation:
      "Preguntas '¿hay configuración de theme?' y, solo si existe, lees el valor. Optional chaining (?.) es como tocar la puerta suavemente: si nadie contesta, te vas sin empujar.",
    theory: `### En palabras simples
\`find()\` puede devolver \`undefined\`. Optional chaining (\`?.\`) accede a propiedades solo si el resultado existe; si no, devuelve \`undefined\` sin error.

### Ejemplo de la vida real
En el clóset buscas la chaqueta 'invierno'. Si no está, no revuelves todo el clóset enojado; simplemente no sacas nada. \`find(...)?.color\` hace lo mismo con propiedades.

### En código
\`configs.find(c => c.key === 'theme')?.value\` → \`'dark'\` o \`undefined\` si no hay theme. Sin \`?.\`, acceder a \`.value\` de undefined lanza error.

### Tip para la entrevista
\`?.\` es más limpio que \`if (x) x.prop\` para una sola propiedad. Para varias operaciones, un \`if\` explícito puede ser más legible.`,
  },

  5: {
    descriptionPrefix:
      "Si no encuentras tu talla favorita en el clóset, usas una talla media por defecto sin quedarte en ropa.",
    everydayInExplanation:
      "Buscas configuración 'size'; si no está, pones 'medium' automáticamente. El operador ?? (nullish coalescing) solo usa el default cuando el valor es null o undefined, no cuando es '' o 0.",
    theory: `### En palabras simples
Combina \`find()?.prop\` con \`?? valorDefault\`. \`??\` activa el fallback solo para \`null\`/\`undefined\`, a diferencia de \`||\` que también trata \`''\` y \`0\` como falsy.

### Ejemplo de la vida real
En la lista de invitados buscas el correo de Juan. Si no está anotado (undefined), usas el correo genérico del evento. Si está anotado como cadena vacía, ?? no lo sustituye — eso puede ser intencional.

### En código
\`settings.find(s => s.key === 'size')?.value ?? 'medium'\` devuelve el valor encontrado o \`'medium'\`.

### Tip para la entrevista
\`??\` vs \`||\`: pregunta clásica. Usa ?? para defaults cuando 0 o '' son valores válidos.`,
  },

  6: {
    descriptionPrefix:
      "Entre formas de papel recortadas, buscas la primera círculo para medir su radio sin confundirla con un cuadrado.",
    everydayInExplanation:
      "Hay círculos y cuadrados mezclados. Con type guard, cuando encuentras un círculo, el sistema 'sabe' que tiene radio y no lado. find con predicado de tipo estrecha el resultado para TypeScript.",
    theory: `### En palabras simples
\`find()\` con \`(s): s is Circle => s.type === 'circle'\` devuelve \`Circle | undefined\`. Dentro del \`if (circle)\`, TS sabe que es círculo y permite \`.radius\`.

### Ejemplo de la vida real
En un álbum con fotos y videos, buscas el primer video. Una vez encontrado, puedes leer duración sin comprobar otra vez si es foto.

### En código
\`const circle = shapes.find((s): s is Circle => s.type === 'circle')\`. \`if (circle) console.log(circle.radius)\` — sin error de tipos.

### Tip para la entrevista
Discriminated unions + find + type predicate = patrón estándar en TS moderno. Alternativa: switch en loop; find es más declarativo.`,
  },

  7: {
    descriptionPrefix:
      "En el historial del chat del grupo, quieres el último mensaje de error, no el primero.",
    everydayInExplanation:
      "Los errores aparecen varias veces. Para arreglar el bug actual te importa el más reciente, al final del historial. findLast() busca desde atrás; find() desde adelante.",
    theory: `### En palabras simples
\`findLast()\` y \`findLastIndex()\` (ES2023) buscan desde el final del arreglo. Útil en logs, historial y estados donde 'el último' es el relevante.

### Ejemplo de la vida real
En fotos ordenadas por fecha, quieres la última donde saliste sonriendo, no la primera de hace años. Recorres mentalmente desde la más reciente hacia atrás.

### En código
\`logs.findLast(l => l.level === 'error')\` → último error. \`findLastIndex\` da la posición para editar o borrar ese registro.

### Tip para la entrevista
Sin ES2023: \`[...arr].reverse().find()\` (cuidado con performance) o bucle manual desde length-1.`,
  },

  8: {
    descriptionPrefix:
      "En un diccionario enorme buscas una palabra: paras en cuanto la encuentras, no lees todo el libro.",
    everydayInExplanation:
      "Con un millón de números, buscar el 42 con find revisa ~43 celdas y para. Con filter()[0] revisarías todo el millón aunque ya lo encontraste. find es la búsqueda inteligente que se detiene.",
    theory: `### En palabras simples
\`find()\` hace short-circuit al primer match. \`filter()[0]\` recorre **todo** el arreglo aunque el match esté al inicio. Para 'primer elemento que cumple', siempre find.

### Ejemplo de la vida real
En la fila del banco buscas la primera ventanilla abierta. En cuanto ves una con luz verde, caminas hacia ella; no recorres las 50 ventanillas restantes por protocolo.

### En código
\`bigArray.find(n => n === 42)\` — best case O(1) relativo al match. \`bigArray.filter(n => n === 42)[0]\` — siempre O(n).

### Tip para la entrevista
Pregunta trampa en entrevistas. Menciona short-circuit y complejidad. filter()[0] solo si necesitas el array filtrado completo después.`,
  },

  9: {
    descriptionPrefix:
      "En un catálogo con categorías y subproductos, buscas en qué categoría está el producto 101.",
    everydayInExplanation:
      "No tienes lista plana: hay estantes (categorías) y en cada estante productos. Buscas la categoría donde algún producto tenga id 101, como encontrar en qué álbum de fotos está una imagen sin abrir todos uno por uno a ciegas.",
    theory: `### En palabras simples
\`find()\` en estructuras anidadas combina búsqueda en el nivel superior con \`some()\` o \`find()\` en sub-arreglos. Acceso opcional si hay niveles intermedios.

### Ejemplo de la vida real
En el salón hay equipos y cada equipo tiene alumnos. Quieres el equipo donde está 'Iram': recorres equipos hasta uno cuya lista de miembros lo incluya.

### En código
\`categories.find(cat => cat.products.some(p => p.id === 101))\` luego \`category?.products.find(p => p.id === 101)\` para el producto exacto.

### Tip para la entrevista
Búsquedas profundas frecuentes → aplanar o indexar con Map. find anidado es O(categorías × productos) — aceptable en UI, no en backend masivo.`,
  },

  10: {
    descriptionPrefix:
      "Cuando el alumno con id 1 DEBE existir en la lista oficial, prefieres que el sistema grite si falta, no que siga en silencio.",
    everydayInExplanation:
      "En un examen, si no está la hoja de respuestas del candidato 1, no inventas una: detienes el proceso. findOrThrow encuentra o lanza error, y el tipo de retorno ya no incluye undefined.",
    theory: `### En palabras simples
Wrapper \`findOrThrow<T>\` usa \`find()\` y si el resultado es \`undefined\`, lanza \`Error\`. El tipo de retorno es \`T\`, no \`T | undefined\`.

### Ejemplo de la vida real
Al armar el paquete de regalo del sorteo, el ganador con folio 100 debe estar en la lista. Si no está, es error de datos — no continúas con 'invitado genérico'.

### En código
\`function findOrThrow<T>(arr: T[], predicate, errorMsg): T\` — \`const user = findOrThrow(users, u => u.id === 1)\` tipado como \`User\`.

### Tip para la entrevista
Útil en capa de dominio cuando la ausencia es bug, no caso normal. En APIs públicas, prefiere Result/Either o undefined documentado.`,
  },
};
