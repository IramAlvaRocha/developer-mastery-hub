import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_FILTER_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "De una caja de calcetines mezclados, solo quieres quedarte con los pares de un color específico.",
    everydayInExplanation:
      "Tienes calcetines rojos, azules y verdes en un cajón. Pasas cada uno por la prueba '¿es azul?' y los que pasan van a una pila nueva. La caja original no se vacía sola: filter crea una lista nueva con solo los que cumplen la condición.",
    theory: `### En palabras simples
\`filter()\` recorre un arreglo y devuelve un arreglo **nuevo** con solo los elementos para los que tu función devuelve \`true\`. El arreglo original no se modifica.

### Ejemplo de la vida real
En tu playlist, quieres una sublista solo de canciones de más de 4 minutos. Revisas cada tema: si dura lo suficiente, entra a la playlist 'Largas'; si no, se queda fuera. No borras la playlist original.

### En código
\`const evens = nums.filter(n => n % 2 === 0)\` toma \`[1, 2, 3, 4, 5, 6]\` y devuelve \`[2, 4, 6]\`. La función que pasas se llama predicado.

### Tip para la entrevista
\`filter()\` puede devolver un arreglo más corto o vacío, nunca más largo que el original. Para '¿existe al menos uno?' usa \`some()\`; para '¿todos?' usa \`every()\`.`,
  },

  2: {
    descriptionPrefix:
      "En tu lista de tareas del salón, separas lo que ya entregaste de lo que aún falta.",
    everydayInExplanation:
      "Cada tarea tiene un checkbox 'hecho' o 'pendiente'. Filtras por esa propiedad como cuando separas la ropa sucia de la limpia: no cambias las fichas, solo formas dos montones distintos según el estado.",
    theory: `### En palabras simples
Con arreglos de objetos, \`filter()\` compara una propiedad de cada elemento contra un valor. Solo pasan los que cumplen la condición exacta.

### Ejemplo de la vida real
En un álbum de fotos clasificadas por 'favorita' sí/no, quieres ver solo las marcadas con corazón. Pasas cada foto por '¿favorita === true?' y obtienes un álbum reducido de recuerdos top.

### En código
\`const pending = tasks.filter(t => t.done === false)\` deja solo pendientes. Usa \`===\` (igualdad estricta) para evitar sorpresas con tipos mezclados.

### Tip para la entrevista
Comparaciones con \`==\` hacen coerción (\`0 == false\`). En TypeScript y code reviews, \`===\` es el estándar para predicados claros.`,
  },

  3: {
    descriptionPrefix:
      "Al revisar una bolsa de regalos, quitas los espacios vacíos y te quedas solo con lo que realmente trae algo.",
    everydayInExplanation:
      "A veces en la lista hay nombres válidos mezclados con huecos vacíos (null) o etiquetas sin escribir (undefined). Filter con type guard es como revisar cada caja del regalo: si está vacía, afuera; si tiene contenido, pasa a la mesa de regalos abiertos.",
    theory: `### En palabras simples
\`filter()\` con type predicate (\`(x): x is string => ...\`) no solo quita null/undefined: le dice a TypeScript que el arreglo resultante es \`string[]\`, no \`(string | null)[]\`.

### Ejemplo de la vida real
En una lista de invitados impresa hay líneas en blanco entre nombres. Antes de imprimir place cards, eliminas las líneas vacías. Después ya no tienes que preguntar '¿y si esta línea está vacía?' en cada paso.

### En código
\`mixed.filter((x): x is string => x !== null && x !== undefined)\` devuelve \`['a', 'b', 'c']\` con tipo \`string[]\`.

### Tip para la entrevista
Sin \`x is T\`, TypeScript no estrecha el tipo después de filter. El type predicate es el patrón senior para arrays con nullish.`,
  },

  4: {
    descriptionPrefix:
      "En el súper, buscas productos baratos Y que sigan en anaquel, no solo uno de los dos criterios.",
    everydayInExplanation:
      "Quieres snacks de menos de 50 pesos que además tengan existencia. Es como elegir ropa para la oficina: debe ser formal Y cómoda. Puedes combinar condiciones con 'y' (&&) o 'o' (||) dentro del filtro.",
    theory: `### En palabras simples
Dentro del predicado de \`filter()\` puedes combinar condiciones con \`&&\` (todas deben cumplirse) y \`||\` (al menos una). Para lógica compleja, extrae una función con nombre.

### Ejemplo de la vida real
En tu closet digital filtras 'pantalones' que sean 'color negro' Y 'talla M'. Si quieres 'negros O azules', cambias la regla a OR. Cada prenda se evalúa contra la regla completa.

### En código
\`products.filter(p => p.price < 100 && p.inStock)\` exige barato y disponible. \`products.filter(p => p.category === 'tech' || p.price < 50)\` acepta electrónicos o baratos.

### Tip para la entrevista
Predicados largos en una línea son difíciles de testear. \`const isAffordableInStock = (p) => ...\` es reutilizable y unit-testeable.`,
  },

  5: {
    descriptionPrefix:
      "En la agenda del teléfono escribes un nombre y solo quieres ver contactos que lo contengan, sin importar mayúsculas.",
    everydayInExplanation:
      "Buscas 'ana' y quieres encontrar 'Ana López' y 'Mariana'. Es como hojear un directorio del salón: no necesitas el nombre exacto, solo que aparezca ese pedazo de texto. Normalizas a minúsculas antes de comparar.",
    theory: `### En palabras simples
\`filter()\` con \`includes()\` busca si un texto contiene otro substring. Para búsqueda case-insensitive, convierte ambos lados a minúsculas con \`toLowerCase()\`.

### Ejemplo de la vida real
En un catálogo de canciones escribes 'love' y aparecen 'Lovely Day' y 'Real Love'. La búsqueda no distingue mayúsculas ni exige coincidencia exacta del título completo.

### En código
\`contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))\` encuentra coincidencias parciales sin importar mayúsculas.

### Tip para la entrevista
\`includes\` es O(n) por elemento. Para listas enormes considera índice invertido o búsqueda en backend. Para UI de contactos/productos, filter + includes es suficiente.`,
  },

  6: {
    descriptionPrefix:
      "Al ordenar la despensa, dejas solo la primera lata de cada tipo y descartas los duplicados de atrás.",
    everydayInExplanation:
      "Tienes tres latas de atún en fila: conservas la primera y las otras dos 'no pasan' porque ya viste ese producto antes. Es como quedarte con la primera aparición de cada canción repetida en una playlist mal armada.",
    theory: `### En palabras simples
\`filter()\` con \`indexOf\` mantiene solo la primera ocurrencia de cada valor: un elemento pasa si su índice es igual al primer índice donde aparece ese valor.

### Ejemplo de la vida real
En una lista de compras escrita a mano alguien puso 'leche' tres veces. Al limpiar la lista, dejas la primera 'leche' y tachas las repeticiones sin perder el resto de productos.

### En código
\`nums.filter((val, index, arr) => arr.indexOf(val) === index)\` elimina duplicados. Alternativa moderna: \`[...new Set(nums)]\` para primitivos.

### Tip para la entrevista
\`Set\` es más limpio para números/strings. filter+indexOf sirve cuando necesitas deduplicar objetos por una clave custom (combinar con map).`,
  },

  7: {
    descriptionPrefix:
      "Al revisar tu historial de pedidos, solo quieres los que llegaron en este año, no los de años pasados.",
    everydayInExplanation:
      "Es como filtrar fotos del álbum 'solo vacaciones 2024': cada foto tiene fecha y comparas si cae entre el 1 de enero y el 31 de diciembre. Los pedidos fuera de ese rango no entran al reporte anual.",
    theory: `### En palabras simples
\`filter()\` funciona con fechas comparando timestamps (\`getTime()\`) o objetos \`Date\`. Defines un inicio y fin y conservas solo los elementos dentro del rango.

### Ejemplo de la vida real
En el calendario escolar filtras eventos entre inicio y fin de semestre: entrega de tareas, exámenes, paseos. Fuera de esas fechas no aparecen en la vista del periodo.

### En código
\`orders.filter(o => o.date.getTime() >= start.getTime() && o.date.getTime() <= end.getTime())\` deja pedidos del año en curso.

### Tip para la entrevista
Compara fechas con \`getTime()\` o \`valueOf()\`, no con \`==\` entre objetos Date. Para zonas horarias, considera librerías (date-fns, Temporal) en producción.`,
  },

  8: {
    descriptionPrefix:
      "En lugar de repetir la misma regla en cada cajón del clóset, escribes la regla una vez en un cartel.",
    everydayInExplanation:
      "'Solo ropa de adulto activa' es una regla que aplicas al closet, al cajón de accesorios y a la lista de préstamos. Extraer el predicado a una función con nombre es como tener ese cartel reutilizable en lugar de reescribir la regla cada vez.",
    theory: `### En palabras simples
Extrae la lógica del filtro a una función con nombre (\`isActiveAdult\`). La reutilizas en varios \`filter()\`, la testeas sola y el código se lee como lenguaje natural.

### Ejemplo de la vida real
En el salón, la regla 'mayor de edad y inscrito' aplica para elegir delegados, para el comité y para el pase de salida. Una sola definición evita que en un lugar digas 18 y en otro 17 por error.

### En código
\`const isActiveAdult = (user: User) => user.active && user.age >= 18;\` y luego \`users.filter(isActiveAdult)\`.

### Tip para la entrevista
Predicados nombrados son test unitario directo: \`expect(isActiveAdult(mock)).toBe(true)\`. Mejor que lambdas anónimas duplicadas.`,
  },

  9: {
    descriptionPrefix:
      "En la tienda en línea aplicas filtro tras filtro: precio, estrellas y marca, como afinar una búsqueda.",
    everydayInExplanation:
      "Primero pones 'menos de 500 pesos', luego '4 estrellas o más', luego 'solo Apple'. Cada filtro reduce el catálogo. Es como ir achicando una lista de regalos: primero por presupuesto, luego por gustos del cumpleañero.",
    theory: `### En palabras simples
Puedes encadenar varios \`filter()\` seguidos. Cada uno recibe el resultado del anterior. Es legible; en producción a veces un solo filter con \`&&\` es más eficiente.

### Ejemplo de la vida real
En fotos del viaje: primero solo 2024, luego solo las que tienen personas, luego solo las marcadas favoritas. Cada paso deja un álbum más pequeño.

### En código
\`catalog.filter(p => p.price <= 500).filter(p => p.rating >= 4).filter(p => p.brand === 'Apple')\` es un pipeline de facets.

### Tip para la entrevista
Múltiples filter = múltiples pasadas O(n). Un predicado compuesto = una pasada. Elige legibilidad vs performance según tamaño de datos.`,
  },

  10: {
    descriptionPrefix:
      "En un buzón con cartas y paquetes mezclados, separas solo las cartas para leerlas en el escritorio.",
    everydayInExplanation:
      "Cada ítem dice si es 'carta' o 'paquete'. Después de filtrar cartas, el sistema sabe que todas tienen remitente y sello — no tienes que volver a preguntar si es paquete. Eso es narrowing con uniones discriminadas y type guard.",
    theory: `### En palabras simples
Con uniones discriminadas (\`type: 'click' | 'keypress'\`), \`filter()\` con \`(e): e is ClickEvent => e.type === 'click'\` estrecha el tipo: el arreglo resultante solo tiene clicks, y TypeScript sabe que \`.x\` existe.

### Ejemplo de la vida real
En un álbum con fotos y videos mezclados, separas solo videos. Después de filtrar, cada ítem tiene duración y no tienes que comprobar otra vez si es foto.

### En código
\`const clicks = events.filter((e): e is ClickEvent => e.type === 'click')\` → \`clicks[0].x\` es válido sin optional chaining extra.

### Tip para la entrevista
Patrón estándar con discriminated unions. Alternativa: \`if (e.type === 'click')\` en un for; filter+is escala mejor para colecciones.`,
  },
};
