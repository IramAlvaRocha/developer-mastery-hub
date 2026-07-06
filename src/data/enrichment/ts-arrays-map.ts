import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_MAP_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Imagina que tienes una lista de compras con cantidades y quieres duplicar cada cantidad para una fiesta doble.",
    everydayInExplanation:
      "Si tu lista dice 1 manzana, 2 leches y 3 panes, pasar cada número por 'multiplicar por 2' te da una lista nueva con 2, 4 y 6 — sin tachar la lista original. Eso es map(): transformar cada elemento y obtener una lista nueva del mismo tamaño.",
    theory: `### En palabras simples
\`map()\` recorre un arreglo y aplica una función a cada elemento. Devuelve un arreglo **nuevo** con los resultados transformados, uno por uno. El arreglo original no se modifica.

### Ejemplo de la vida real
En una playlist, cada canción tiene una duración en minutos. Quieres saber cuánto duraría el doble de cada tema (versión extendida). Pasas cada duración por la misma regla y obtienes una lista paralela de tiempos nuevos, sin borrar la playlist original.

### En código
\`const doubled = nums.map(n => n * 2)\` toma \`[1, 2, 3, 4]\` y devuelve \`[2, 4, 6, 8]\`. Siempre hay la misma cantidad de elementos antes y después.

### Tip para la entrevista
\`map()\` siempre retorna un array del mismo tamaño que el original. Si necesitas menos elementos, usa \`filter()\`; si necesitas un solo valor final, usa \`reduce()\`.`,
  },

  2: {
    descriptionPrefix:
      "En un álbum de fotos digital, a veces solo quieres los nombres de las personas, no toda la ficha de cada foto.",
    everydayInExplanation:
      "Cada foto guarda título, fecha y autor. Si solo necesitas una lista de autores para imprimir en un collage, extraes ese dato de cada foto. Es como copiar una columna de una hoja de cálculo: una fila entera entra, un solo valor sale.",
    theory: `### En palabras simples
Cuando tienes un arreglo de objetos, \`map()\` puede extraer una propiedad específica de cada uno. El resultado es un arreglo de valores primitivos (texto, números, etc.).

### Ejemplo de la vida real
En la lista de asistencia del salón, cada alumno tiene nombre, número y grupo. Para hacer etiquetas de escritorio, solo copias los nombres. No necesitas llevar toda la ficha de cada estudiante al rotulador.

### En código
\`const names = users.map(u => u.name)\` convierte un arreglo de usuarios en \`['Iram', 'Ana']\`. También puedes anotar el tipo de salida: \`const emails: string[] = users.map(u => u.email)\`.

### Tip para la entrevista
Este patrón se llama "pluck" o proyección. Es el equivalente de \`SELECT name FROM users\` en SQL: extraes una columna de una tabla de objetos.`,
  },

  3: {
    descriptionPrefix:
      "A veces recibes recetas en un formato y las reescribes en otro para compartirlas con amigos.",
    everydayInExplanation:
      "Una app te manda 'nombre' y 'apellido' por separado, pero tu agenda solo tiene espacio para 'nombre completo'. Pasas cada contacto por una regla que junta las piezas en el formato que tú necesitas, como reescribir fichas de biblioteca a tarjetas de visita.",
    theory: `### En palabras simples
\`map()\` no solo extrae campos: puede transformar cada objeto de una forma a otra. Entra un modelo (por ejemplo, datos de API) y sale otro (modelo de pantalla o DTO).

### Ejemplo de la vida real
En un álbum de bodas recibes fotos con metadatos técnicos (ISO, obturador). Para el photobook imprimes solo título, fecha y pie de foto. Cada foto original se convierte en una tarjeta nueva con la forma que el diseñador pidió.

### En código
\`apiUsers.map(u => ({ id: u.id, fullName: \`\${u.first_name} \${u.last_name}\` }))\` crea objetos \`DisplayUser\` a partir de \`ApiUser\` sin tocar los originales.

### Tip para la entrevista
Usa \`map()\` para adaptar datos de backend a la UI. Es el equivalente de AutoMapper en C#: transformación declarativa, un objeto por elemento.`,
  },

  4: {
    descriptionPrefix:
      "Al numerar las fotos de un álbum, la posición en la fila importa tanto como la imagen misma.",
    everydayInExplanation:
      "Cuando ordenas las mejores fotos del viaje, la primera es la portada, la segunda va al centro del collage, etc. El índice (1.º, 2.º, 3.º) te sirve para poner número de ranking junto a cada título de canción o nombre en una lista.",
    theory: `### En palabras simples
El callback de \`map()\` recibe tres argumentos: el elemento, su índice (empieza en 0) y el arreglo original. El índice es útil para rankings, numeración o alternar colores.

### Ejemplo de la vida real
En un concurso de disfraces del salón, anotas posición y nombre: 1.º Ana, 2.º Luis, 3.º Pedro. La posición no viene en la ficha del alumno; la calculas según el orden en la fila.

### En código
\`names.map((name, index) => ({ rank: index + 1, name }))\` convierte \`['Vue', 'React', 'Angular']\` en objetos con \`rank\` 1, 2 y 3.

### Tip para la entrevista
Recuerda que el índice en \`map()\` es base 0. Para mostrar al usuario "puesto 1", suma 1. No abuses del índice como ID estable si la lista puede reordenarse.`,
  },

  5: {
    descriptionPrefix:
      "Al preparar la despensa, anotas el precio original y agregas una etiqueta nueva con el total con impuesto, sin borrar la etiqueta vieja.",
    everydayInExplanation:
      "Cada producto del súper ya tiene nombre y precio. Quieres una lista para el roomie que incluya todo lo anterior más 'precio con IVA' y moneda. Copias la ficha completa y le pegas campos nuevos, como duplicar una tarjeta de receta y añadir las calorías calculadas.",
    theory: `### En palabras simples
Combina \`map()\` con spread (\`...obj\`) para crear copias de objetos enriquecidas con propiedades extra. El objeto original queda intacto.

### Ejemplo de la vida real
En tu closet digital cada prenda tiene color y talla. Para vender en línea agregas precio y condición ('nuevo', 'usado') sin tachar la ficha original del clóset. Cada prenda genera una tarjeta de venta nueva con todo lo anterior más lo nuevo.

### En código
\`products.map(p => ({ ...p, priceWithTax: p.price * 1.16, currency: 'MXN' }))\` copia cada producto y agrega campos calculados.

### Tip para la entrevista
Nunca mutar objetos en \`map()\` es regla de oro en React/Vue. Spread + map = patrón inmutable estándar para enriquecer datos.`,
  },

  6: {
    descriptionPrefix:
      "Primero sacas de la bolsa solo lo que ya pagaste, y después anotas cuánto costó cada artículo.",
    everydayInExplanation:
      "En tu historial de pedidos del súper, primero dejas solo los entregados y luego extraes el total de cada uno. Hacer filtro y transformación en secuencia es como revisar la playlist: quitar canciones que no te gustan y luego ponerles estrella a las que quedaron.",
    theory: `### En palabras simples
Puedes encadenar métodos de arreglo: \`filter()\` reduce la lista y \`map()\` transforma lo que quedó. El orden importa: filtrar primero suele ser más eficiente.

### Ejemplo de la vida real
En fotos del celular, primero muestras solo las del 2024 y luego generas miniaturas en blanco y negro. No conviertes en blanco y negro las que vas a descartar: ahorras trabajo.

### En código
\`orders.filter(o => o.status === 'completed').map(o => o.total)\` devuelve \`[500]\` con los totales de pedidos completados.

### Tip para la entrevista
En pipelines legibles, filter → map es el orden habitual. Para performance en listas grandes, un solo \`reduce\` o un bucle puede ser mejor, pero la cadena es más clara para leer.`,
  },

  7: {
    descriptionPrefix:
      "Antes de guardar correos en tu agenda, les quitas espacios y los pones en minúsculas para que no haya duplicados raros.",
    everydayInExplanation:
      "A veces escribes '  Juan@Mail.COM  ' con espacios y mayúsculas mezcladas. Normalizar es como lavar frutas antes de guardarlas en la canasta: todas quedan en el mismo formato limpio para compararlas después.",
    theory: `### En palabras simples
\`map()\` es ideal para limpiar datos inconsistentes: quitar espacios (\`trim\`), unificar mayúsculas (\`toLowerCase\`), quitar acentos, etc. Cada elemento pasa por la misma rutina de limpieza.

### Ejemplo de la vida real
En una lista de invitados a una fiesta, algunos nombres vienen '  MARÍA  ', otros 'maría'. Antes de imprimir place cards, pasas cada nombre por 'quitar espacios y primera letra mayúscula' para que todos se vean uniformes.

### En código
\`rawEmails.map(email => email.trim().toLowerCase())\` convierte entradas sucias en \`['iram@test.com', 'ana@mail.com', 'user@dev.com']\`.

### Tip para la entrevista
Normaliza datos al entrar (API, formulario, CSV), no al comparar en 20 lugares distintos. Un solo \`map\` al inicio evita bugs de formato.`,
  },

  8: {
    descriptionPrefix:
      "Cuando pasas cada foto por el mismo filtro, puedes llevar un cuaderno anotando qué entró y qué salió.",
    everydayInExplanation:
      "Imagina que cada canción de la playlist pasa por un ecualizador y tú apuntas en un diario: 'Rock clásico → Rock clásico con más bajos'. Una función genérica de map con registro hace eso: aplica la regla a cualquier tipo y opcionalmente deja rastro.",
    theory: `### En palabras simples
Puedes envolver \`map()\` en una función genérica \`<T, U>\` que acepte cualquier arreglo y cualquier función de transformación, preservando los tipos de entrada y salida en TypeScript.

### Ejemplo de la vida real
En un salón, el mismo procedimiento sirve para calificar ensayos (texto → número) o para convertir puntajes (número → letra). El 'formato del cuaderno de registro' es igual; solo cambia la regla que aplicas a cada elemento.

### En código
\`function mapWithLog<T, U>(arr: T[], fn: (item: T) => U): U[]\` usa \`arr.map\` internamente y puede agregar logging, caché o validación sin perder tipos.

### Tip para la entrevista
Wrappers genéricos alrededor de \`map\` son útiles para cross-cutting concerns: telemetría, validación, memoización. Demuestran dominio de genéricos sin over-engineering.`,
  },

  9: {
    descriptionPrefix:
      "Cada ítem de tu menú del día se convierte en una tarjeta visible en la pizarra del restaurante.",
    everydayInExplanation:
      "Tienes una lista de platillos con nombre y enlace. Para colgarlos en la web, conviertes cada platillo en un botón o enlace HTML. Es como pasar la lista del menú escrita a tarjetas físicas pegadas en la vitrina: misma información, formato distinto para mostrar.",
    theory: `### En palabras simples
En interfaces web, \`map()\` convierte datos en elementos visuales. Cada objeto del arreglo se transforma en JSX, HTML o un componente. Es el patrón estándar para renderizar listas.

### Ejemplo de la vida real
En un álbum de fotos en línea, cada foto (id, url, título) se convierte en una miniatura con caption debajo. La lista de datos no cambia; generas una lista paralela de 'tarjetas' para la pantalla.

### En código
\`menu.map(item => \`<a href="\${item.url}">\${item.label}</a>\`).join('\\n')\` produce strings HTML a partir de objetos \`MenuItem\`.

### Tip para la entrevista
En React es \`items.map(item => <Card key={item.id} ... />)\`. En Vue, \`v-for\` hace lo mismo internamente. Siempre usa \`key\` estable basada en id, no en índice.`,
  },

  10: {
    descriptionPrefix:
      "Hay tareas donde necesitas una lista nueva al final, y otras donde solo quieres hacer algo con cada ítem sin guardar resultado.",
    everydayInExplanation:
      "Si duplicas cada ingrediente para doble receta, necesitas la lista nueva (map). Si solo vas tachando cada ítem al ir comprando en el súper, no necesitas otra lista: solo marcas (forEach). Usar map para 'solo imprimir' es como fotocopiar toda la lista solo para tacharla — desperdicias el resultado.",
    theory: `### En palabras simples
\`map()\` **transforma** y **retorna** un arreglo nuevo. \`forEach()\` **ejecuta** una acción por elemento y retorna \`void\` (nada útil). Usa map cuando necesites el resultado; forEach para efectos secundarios (log, guardar, enviar).

### Ejemplo de la vida real
Al ordenar ropa en el clóset: si clasificas por color y guardas pilas nuevas, es map (entrada → pila nueva). Si solo dices en voz alta el color de cada prenda sin crear pilas, es forEach.

### En código
\`const doubled = nums.map(n => n * 2)\` → \`[2, 4, 6]\`. \`nums.forEach(n => console.log(n))\` → solo imprime, retorno \`undefined\`. Anti-patrón: \`nums.map(n => console.log(n))\` desperdicia un arreglo de \`undefined\`.

### Tip para la entrevista
Regla rápida: ¿necesitas el array resultante? → \`map\`. ¿Solo side effects? → \`forEach\`. En entrevistas, mencionar que \`map\` + \`void\` es code smell.`,
  },
};
