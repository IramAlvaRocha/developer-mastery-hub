import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_REDUCE_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Al pagar en el súper, vas sumando el precio de cada producto en la mente hasta obtener un solo total.",
    everydayInExplanation:
      "Empiezas en cero pesos. Cada artículo del carrito se suma al acumulado: leche + pan + huevos = total. No guardas una lista nueva de precios; colapsas todo en un solo número. Eso es reduce con sumatoria.",
    theory: `### En palabras simples
\`reduce()\` recorre un arreglo y va acumulando un único valor. Recibe una función (acumulador, elemento actual) y un valor inicial. Cada paso actualiza el acumulador.

### Ejemplo de la vida real
En una colecta del salón, cada alumno aporta monedas. El tesorero va sumando en una hoja hasta un total único para comprar materiales. No necesitas seguir llevando la lista de quién dio cuánto en la cabeza del total final.

### En código
\`nums.reduce((acc, n) => acc + n, 0)\` con \`[10, 20, 30, 40]\` devuelve \`100\`. Siempre pasa valor inicial (\`0\`) para type safety con TypeScript.

### Tip para la entrevista
Sin valor inicial, el primer elemento es el acumulador inicial y reduce empieza en el segundo. Con TS, el initialValue tipifica el retorno — úsalo siempre que el tipo importe.`,
  },

  2: {
    descriptionPrefix:
      "En la lista del mercado, cada ítem tiene precio y cantidad; quieres saber cuánto gastarás en total.",
    everydayInExplanation:
      "3 manzanas a 5 pesos y 2 leches a 20 no se suman como '3 + 2'. Multiplicas precio × cantidad por línea y luego sumas todo. Reduce recorre cada renglón del carrito y va acumulando el costo real.",
    theory: `### En palabras simples
Con objetos, \`reduce()\` puede sumar una propiedad numérica o combinar varias (precio × cantidad). El acumulador suele empezar en \`0\` para totales.

### Ejemplo de la vida real
Al armar paquetes de regalo, cada caja tiene costo unitario y cuántas cajas pides. El total del pedido es la suma de (precio × cantidad) de cada línea, como en un ticket de caja.

### En código
\`cart.reduce((sum, item) => sum + item.price * item.qty, 0)\` devuelve \`1100\` para laptop + mouses del ejemplo.

### Tip para la entrevista
Equivalente SQL: \`SELECT SUM(price * qty)\`. Para muchos items, reduce es O(n); en bases de datos el motor hace lo mismo agregado.`,
  },

  3: {
    descriptionPrefix:
      "Al contar cuántas veces salió cada fruta en la canasta, llevas una libreta con tally marks.",
    everydayInExplanation:
      "Manzana, plátano, manzana otra vez… en la libreta anotas: manzana 1, 2, 3; plátano 1, 2. Al final tienes un mapa de 'fruta → cuántas veces'. Reduce puede construir ese objeto contador paso a paso.",
    theory: `### En palabras simples
\`reduce()\` puede construir un objeto que cuenta ocurrencias. Por cada elemento incrementas \`acc[clave]\` y devuelves el acumulador actualizado.

### Ejemplo de la vida real
En un salón votas color favorito para el mural. Cada voto incrementa el conteo de 'azul', 'rojo', etc. Al cerrar la votación tienes un resumen de frecuencias, no la lista cruda de 30 papeles.

### En código
\`fruits.reduce((acc, fruit) => { acc[fruit] = (acc[fruit] || 0) + 1; return acc; }, {} as Record<string, number>)\` → \`{ apple: 3, banana: 2, cherry: 1 }\`.

### Tip para la entrevista
Frequency counter es top en entrevistas (anagramas, duplicados). Domina el patrón \`acc[key] = (acc[key] || 0) + 1\`.`,
  },

  4: {
    descriptionPrefix:
      "En el salón separas a los alumnos en grupos según su calificación, como cajones etiquetados A, B y C.",
    everydayInExplanation:
      "Cada estudiante va a la carpeta de su letra. Iram y Luis al cajón A, Ana al B. No es un solo número final: es organizar la lista en compartimentos. Reduce puede ir armando ese archivador grupo por grupo.",
    theory: `### En palabras simples
\`reduce()\` puede agrupar (groupBy): la clave viene de una propiedad del elemento y el valor es un arreglo de items que comparten esa clave.

### Ejemplo de la vida real
En fotos del viaje agrupas por ciudad: 'CDMX' → fotos de la capital, 'Oaxaca' → fotos de Oaxaca. Cada foto se mete en el álbum correcto según su etiqueta.

### En código
\`students.reduce((acc, s) => { const key = s.grade; if (!acc[key]) acc[key] = []; acc[key].push(s); return acc; }, {})\` produce \`{ A: [...], B: [...] }\`.

### Tip para la entrevista
ES2024 tiene \`Object.groupBy()\`, pero reduce funciona en todos lados. En entrevistas, escribe groupBy con reduce sin dudar.`,
  },

  5: {
    descriptionPrefix:
      "Tienes varias bolsas con juguetes y quieres vaciarlas todas en una sola caja grande.",
    everydayInExplanation:
      "Bolsa 1 tiene piezas A y B, bolsa 2 tiene C y D. Vas volcando cada bolsa en la caja común hasta tener una sola lista plana. Aplanar arrays anidados con reduce es como unir todas las bolsas en un solo montón.",
    theory: `### En palabras simples
\`reduce()\` puede aplanar un arreglo de arreglos concatenando o con spread en cada paso. Alternativa moderna: \`.flat()\`.

### Ejemplo de la vida real
En playlists anidadas (Rock clásico, Rock moderno, Pop), quieres una sola lista para reproducir en shuffle. Juntas todos los temas en una fila sin importar de qué sublista venían.

### En código
\`nested.reduce((acc, arr) => [...acc, ...arr], [] as number[])\` → \`[1, 2, 3, 4, 5, 6]\`. Más simple: \`nested.flat()\`.

### Tip para la entrevista
Usa \`.flat()\` para aplanar simple. Reduce+concat cuando transformas mientras aplanas. Conoce ambos.`,
  },

  6: {
    descriptionPrefix:
      "De una lista de pares 'clave-valor' escrita en post-its, armar un diccionario ordenado en una sola hoja.",
    everydayInExplanation:
      "Tienes notas: 'a → 1', 'b → 2', 'c → 3'. Vas pegando cada par en un cuaderno índice hasta tener un mapa completo clave → valor. Reduce convierte arreglo de entradas en objeto.",
    theory: `### En palabras simples
\`reduce()\` puede transformar un arreglo de pares \`[key, value]\` en un objeto \`Record\`. Cada iteración asigna \`acc[key] = value\`.

### Ejemplo de la vida real
En configuración del router anotas varios post-its: host, puerto, contraseña. Al final quieres una sola ficha con todos los campos, no una pila de papeles sueltos.

### En código
\`entries.reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {} as Record<string, number>)\`. Alternativa: \`Object.fromEntries(entries)\`.

### Tip para la entrevista
\`Object.fromEntries\` es la forma moderna. Reduce demuestra que entiendes construcción manual de objetos — útil cuando transformas valores al insertar.`,
  },

  7: {
    descriptionPrefix:
      "Entre varios productos del súper, quieres identificar cuál es el más caro de un vistazo.",
    everydayInExplanation:
      "Recorres el carrito comparando precios: '¿este es más caro que el que llevo en mente?' Al final te quedas con el producto ganador. Reduce puede devolver el objeto completo del más caro, no solo el número.",
    theory: `### En palabras simples
\`reduce()\` sin valor inicial usa el primer elemento como acumulador. Comparas cada producto con el 'campeón' actual y conservas el mayor (o menor).

### Ejemplo de la vida real
En un concurso de pasteles del salón, vas eliminando mentalmente hasta quedarte con el de mayor puntaje. No sumas puntos: eliges un ganador entre objetos.

### En código
\`products.reduce((max, p) => p.price > max.price ? p : max)\` devuelve \`{ name: 'B', price: 200 }\`.

### Tip para la entrevista
\`Math.max(...arr)\` solo para números. Reduce funciona para max por propiedad en objetos. Cuidado con arrays vacíos: reduce sin initial lanza error.`,
  },

  8: {
    descriptionPrefix:
      "Para publicar un anuncio, pasas el texto por varios filtros seguidos: recortar, minúsculas, quitar espacios extra.",
    everydayInExplanation:
      "Empiezas con '  Hola Mundo  ', lo recortas, lo pones en minúsculas, cambias espacios por guiones. Cada paso toma el resultado del anterior. Reduce con una lista de funciones es una cadena de producción en una sola expresión.",
    theory: `### En palabras simples
\`reduce()\` sobre un arreglo de funciones aplica cada una en secuencia al valor acumulado. Es el patrón pipe/compose manual.

### Ejemplo de la vida real
Al preparar fotos para Instagram: recortar → ajustar brillo → poner filtro. Cada herramienta recibe la salida de la anterior hasta la imagen final.

### En código
\`transforms.reduce((result, fn) => fn(result), '  Hello World  ')\` → \`'hello-world'\` tras trim, lowercase y replace.

### Tip para la entrevista
Lodash \`flow\`, Ramda \`pipe\` hacen lo mismo. Implementar pipe con reduce muestra comprensión funcional básica.`,
  },

  9: {
    descriptionPrefix:
      "De un montón de notas del día ('info', 'error', 'error'), quieres un resumen: cuántas de cada tipo.",
    everydayInExplanation:
      "No te importa leer cada mensaje entero; quieres contadores por categoría. El arreglo de logs entra y sale un objeto resumen distinto. Reduce puede cambiar el tipo del resultado respecto al tipo de cada elemento.",
    theory: `### En palabras simples
El acumulador en \`reduce()\` puede ser de un tipo distinto al de los elementos del arreglo. \`Log[]\` puede reducirse a \`Record<string, number>\` gracias al valor inicial tipado.

### Ejemplo de la vida real
Tras una fiesta revisas el chat del grupo: cuántos 'jaja', cuántos 'foto', cuántos 'ubicación'. Resumes conversación en estadísticas sin guardar cada mensaje.

### En código
\`logs.reduce((acc, log) => { acc[log.level]++; return acc; }, { info: 0, error: 0 })\` → \`{ info: 1, error: 2 }\`.

### Tip para la entrevista
Cuando input y output difieren, el initialValue define el tipo del acumulador. TS infiere mejor con anotación explícita del seed object.`,
  },

  10: {
    descriptionPrefix:
      "Conviertes una lista de contactos en una agenda donde buscas por número de teléfono al instante.",
    everydayInExplanation:
      "En lugar de hojear la lista entera para encontrar '¿quién tiene el 555-1234?', indexas por ID: cada contacto queda en un cajón etiquetado con su clave. \`keyBy\` con reduce construye ese índice diccionario.",
    theory: `### En palabras simples
\`keyBy\` es una función genérica que usa \`reduce\` para indexar un arreglo por una propiedad. Resultado: \`Record<string, T>\` donde la clave es el valor de esa propiedad.

### Ejemplo de la vida real
En el salón, cada alumno tiene número de lista. Creas un mapa 'número → ficha del alumno' para marcar asistencia en O(1) en lugar de buscar en la lista cada mañana.

### En código
\`function keyBy<T>(arr: T[], key: keyof T): Record<string, T>\` usa \`arr.reduce\` y \`String(item[key])\` como clave.

### Tip para la entrevista
\`keyBy\` vs \`groupBy\`: keyBy guarda un elemento por clave (último gana); groupBy guarda arrays. Pregunta frecuente en diseño de datos.`,
  },
};
