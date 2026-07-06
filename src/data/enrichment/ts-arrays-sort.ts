import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_SORT_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Ordenar números de turno como si fueran texto ('10' antes que '2') da un orden raro — necesitas reglas de números reales.",
    everydayInExplanation:
      "Si ordenas [30, 10, 50, 20] 'como texto', sale desorden lógico. Para precios o edades usas comparador numérico: restar a - b para ascendente. Es como ordenar libros por grosor en milímetros, no por cómo se ve el número impreso.",
    theory: `### En palabras simples
\`sort()\` sin argumento ordena como strings ('10' antes que '2'). Para números, pasa \`(a, b) => a - b\` (ascendente) o \`(a, b) => b - a\` (descendente).

### Ejemplo de la vida real
En la lista de precios del súper quieres de menor a mayor: $10, $20, $30. No orden alfabético donde $100 aparecería antes que $20.

### En código
\`nums.sort((a, b) => a - b)\` → \`[10, 20, 30, 40, 50]\`. Negativo → a antes; positivo → b antes; 0 → empate.

### Tip para la entrevista
Trampa clásica: \`[1, 10, 2].sort()\` → \`[1, 10, 2]\`. Siempre menciona comparador numérico en entrevistas.`,
  },

  2: {
    descriptionPrefix:
      "Para ver qué producto costó más, ordenas la lista de precios de mayor a menor como un ranking de ventas.",
    everydayInExplanation:
      "Invertir el comparador (b - a) es como poner las canciones más largas primero en la playlist o los platillos más caros arriba en el menú. Misma mecánica, dirección opuesta.",
    theory: `### En palabras simples
Descendente: \`(a, b) => b - a\`. El comparador define quién va 'antes' en el arreglo ordenado.

### Ejemplo de la vida real
En fotos del viaje ordenas por fecha de más reciente a más antigua para ver primero lo que acabas de subir.

### En código
\`prices.sort((a, b) => b - a)\` → \`[200, 150, 50, 30]\`.

### Tip para la entrevista
\`sort()\` muta el array in-place. Si necesitas el original, copia antes: \`[...arr].sort()\` o \`toSorted()\`.`,
  },

  3: {
    descriptionPrefix:
      "Ordenar nombres en español con acentos y ñ requiere reglas del idioma, no solo el orden del teclado inglés.",
    everydayInExplanation:
      "Álvarez, Ángel, Benito, Zamora — localeCompare respeta alfabeto español. Es como ordenar fichas en biblioteca con reglas locales, no como ordenar archivos en Windows sin configuración regional.",
    theory: `### En palabras simples
Para strings usa \`a.localeCompare(b)\` o \`localeCompare(b, 'es')\`. Maneja acentos, ñ y mayúsculas según reglas culturales.

### Ejemplo de la vida real
Lista de invitados en una boda: orden alfabético correcto para place cards, respetando 'Ángel' y 'Ana' según español de México o España.

### En código
\`names.sort((a, b) => a.localeCompare(b, 'es'))\` ordena correctamente nombres con acentos.

### Tip para la entrevista
\`localeCompare\` en cada comparación de sort puede ser lento en listas grandes. Para muchos strings, \`Intl.Collator\` (ejercicio 10).`,
  },

  4: {
    descriptionPrefix:
      "En el catálogo del súper puedes ordenar por precio o por nombre del producto, según lo que estés buscando.",
    everydayInExplanation:
      "Objetos con name y price: comparas \`a.price - b.price\` o \`a.name.localeCompare(b.name)\`. Es como ordenar ropa en el clóset por color o por tipo — misma percha, criterio distinto.",
    theory: `### En palabras simples
\`sort()\` en objetos compara una propiedad en el callback: \`(a, b) => a.price - b.price\` o por string con localeCompare.

### Ejemplo de la vida real
En álbum de fotos ordenas por 'fecha' para cronología o por 'favorita' para ver primero las estrelladas (con comparador custom).

### En código
\`products.sort((a, b) => a.price - b.price)\` — ascendente por precio.

### Tip para la entrevista
Extrae comparadores reutilizables: \`const byPrice = (a, b) => a.price - b.price\`. Evita duplicar lógica en múltiples sorts.`,
  },

  5: {
    descriptionPrefix:
      "Si ordenas las fotos en el álbum original, pierdes el orden en que las tomaste — a veces quieres una copia ordenada sin tocar el original.",
    everydayInExplanation:
      "sort() baraja el arreglo original como reorganizar físicamente las polaroids en la mesa. toSorted() o [...arr].sort() te dan una fila ordenada en otra pila, intacta la original — importante en apps que reaccionan a cambios.",
    theory: `### En palabras simples
\`sort()\` **muta** el array. \`toSorted()\` (ES2023) retorna copia ordenada. Alternativa: \`[...nums].sort(...)\`.

### Ejemplo de la vida real
Playlist 'original' intacta mientras generas vista 'por duración' ordenada para un road trip. No destruyes el orden que armaste con cariño.

### En código
\`const sorted = nums.toSorted((a, b) => a - b)\` — sorted ordenado, nums sin cambio.

### Tip para la entrevista
En React/Vue, mutar estado con sort() causa bugs sutiles. toSorted/spread es obligatorio en código reactivo moderno.`,
  },

  6: {
    descriptionPrefix:
      "Primero ordenas tareas por urgencia; si dos empatan, la más reciente va arriba.",
    everydayInExplanation:
      "Como ordenar ropa: primero por tipo (camisas, pantalones), y dentro de camisas por color. Multi-criterio en sort: si priority empata (comparación da 0), pasas al criterio de desempate (fecha).",
    theory: `### En palabras simples
En el comparador, si la primera comparación retorna 0 (empate), evalúas el segundo criterio. Patrón común: priority, luego date.

### Ejemplo de la vida real
Lista de reproducción: primero por género, luego por año. Rock 2020 antes que Rock 2019; Pop queda en su bloque aparte.

### En código
\`tasks.sort((a, b) => { const byP = a.priority - b.priority; if (byP !== 0) return byP; return b.date.getTime() - a.date.getTime(); })\`

### Tip para la entrevista
Orden estable (ES2019+): en empates, orden relativo original se mantiene. Útil cuando el segundo criterio es desempate fino.`,
  },

  7: {
    descriptionPrefix:
      "Los reportes de urgencia no van en orden alfabético: critical, high, medium, low tienen su propio ranking.",
    everydayInExplanation:
      "Defines un mapa de prioridades (critical=0, high=1…) y comparas por ese número, no por las letras de la palabra. Es el orden del semáforo, no del diccionario.",
    theory: `### En palabras simples
\`Record<Priority, number>\` asigna peso a cada etiqueta. El comparador usa \`ORDER[a.priority] - ORDER[b.priority]\`.

### Ejemplo de la vida real
En fila de emergencias del hospital, 'rojo' va antes que 'amarillo' aunque alfabéticamente 'amarillo' va antes que 'rojo'.

### En código
\`bugs.sort((a, b) => ORDER[a.priority] - ORDER[b.priority])\` con ORDER definido explícitamente.

### Tip para la entrevista
Custom order con mapa es más mantenible que cadenas de if/else en el comparador. Fácil agregar 'blocker' sin reordenar lógica.`,
  },

  8: {
    descriptionPrefix:
      "Al ordenar alumnos por calificación, los que empatan mantienen el orden en que estaban en la lista original.",
    everydayInExplanation:
      "Iram y Luis ambos tienen A; si Iram estaba antes en la lista de roll, sigue antes después de ordenar. Sort estable preserva ese orden relativo en empates — como fila del salón que no se revuelve entre quienes empataron en el examen.",
    theory: `### En palabras simples
Desde ES2019, \`sort()\` en JavaScript es **estable**: elementos 'iguales' según el comparador conservan orden relativo previo.

### Ejemplo de la vida real
Ordenas fotos por mes; dentro del mismo mes, el orden de subida se respeta. No mezclas aleatoriamente las del mismo día.

### En código
\`students.sort((a, b) => a.grade.localeCompare(b.grade))\` — Iram(A) antes que Luis(A) si Iram estaba primero.

### Tip para la entrevista
Estabilidad importa en multi-sort manual (un criterio, luego otro con sort estable) y en UI predecible.`,
  },

  9: {
    descriptionPrefix:
      "En lugar de escribir 'ordenar por precio' en diez lugares distintos, tienes una regla reutilizable sortBy.",
    everydayInExplanation:
      "Como tener una plantilla 'ordenar closet por color' que aplicas a camisas, pantalones y calcetines. sortBy genérico recibe arreglo, nombre de propiedad y dirección asc/desc.",
    theory: `### En palabras simples
\`function sortBy<T>(arr: T[], key: keyof T, dir = 'asc'): T[]\` copia el arreglo, compara \`a[key]\` vs \`b[key]\` y respeta dirección.

### Ejemplo de la vida real
Misma regla para ordenar contactos por apellido, productos por precio o tareas por fecha — una utilidad, muchos usos.

### En código
\`return [...arr].sort((a, b) => { ... cmp ... return dir === 'asc' ? cmp : -cmp; })\`

### Tip para la entrevista
sortBy simple funciona para primitivos. Para fechas/objetos anidados, pasa key selector function en lugar de keyof.`,
  },

  10: {
    descriptionPrefix:
      "Si ordenas diez mil nombres para el directorio escolar, conviene preparar las reglas del idioma una sola vez.",
    everydayInExplanation:
      "localeCompare en cada comparación es como explicar las reglas del español en cada pregunta. Intl.Collator es el profesor que ya conoce las reglas y solo las aplica — mucho más rápido en listas grandes.",
    theory: `### En palabras simples
\`new Intl.Collator('es').compare\` se reutiliza en \`sort\`. Más rápido que \`localeCompare\` en cada par porque la configuración de locale se crea una vez.

### Ejemplo de la vida real
Imprimir directorio telefónico de 10,000 entradas: preparas collator con sensibilidad 'base' (ignorar mayúsculas) y ordenas una vez de forma eficiente.

### En código
\`const collator = new Intl.Collator('es', { sensitivity: 'base' });\` \`names.sort(collator.compare)\`

### Tip para la entrevista
Menciona performance en listas grandes. Collator también soporta numeric: true para strings con números ('item2' vs 'item10').`,
  },
};
