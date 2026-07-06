import type { EnrichmentMap } from "./enrich";

export const TS_ARRAYS_SOME_EVERY_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Revisas la canasta de frutas solo para saber si hay al menos una manzana, sin contar todas.",
    everydayInExplanation:
      "No necesitas saber cuántas manzanas hay ni listarlas: con ver una basta para responder 'sí, hay'. some() recorre hasta el primer 'sí' y se detiene. Es la pregunta '¿existe al menos uno?'",
    theory: `### En palabras simples
\`some()\` devuelve \`true\` si **al menos un** elemento cumple la condición. Hace short-circuit: para en el primer \`true\`. Si ninguno cumple, devuelve \`false\`.

### Ejemplo de la vida real
Antes de hacer pay, miras la despensa: '¿hay algún huevo?' Una sola caja visible basta para decir que sí. No abres todos los cajones.

### En código
\`nums.some(n => n % 2 === 0)\` con \`[1, 3, 5, 8, 9]\` → \`true\` porque 8 es par.

### Tip para la entrevista
Equivalente a SQL EXISTS o LINQ .Any(). Para '¿todos?' usa \`every()\`; para '¿cuántos?' usa \`filter().length\`.`,
  },

  2: {
    descriptionPrefix:
      "Para entrar al cine de adultos, todos en el grupo deben tener 18 o más — basta uno menor para negar.",
    everydayInExplanation:
      "Revisas cada edad: si todos pasan, entran. En cuanto encuentras a alguien menor, paras y dices 'no'. every() es '¿todos cumplen?' y se detiene en el primer false.",
    theory: `### En palabras simples
\`every()\` devuelve \`true\` solo si **todos** los elementos cumplen la condición. Se detiene al primer \`false\`. Si el arreglo está vacío, devuelve \`true\` (verdad vacía — cuidado).

### Ejemplo de la vida real
Antes de publicar el álbum de fotos del paseo escolar, verificas que **todas** tengan permiso firmado. Una sola sin permiso bloquea la publicación.

### En código
\`ages.every(age => age >= 18)\` → \`true\` si todos son adultos.

### Tip para la entrevista
Equivalente a SQL ALL. Complemento de \`some()\`: some = OR sobre el array; every = AND sobre el array.`,
  },

  3: {
    descriptionPrefix:
      "Para abrir el archivador del salón, basta con que tengas llave de maestro O llave de archivo — no necesitas las dos.",
    everydayInExplanation:
      "Tienes permisos 'read', 'write', 'comment'. La puerta pide 'admin' O 'write'. Con tener write ya entras. some() sobre la lista de permisos requeridos verifica si al menos uno lo tienes.",
    theory: `### En palabras simples
Patrón de autorización: \`requiredAny.some(perm => userPermissions.includes(perm))\`. OR lógico: basta un match entre los permisos requeridos y los del usuario.

### Ejemplo de la vida real
En Spotify Family, algunos perfiles pueden usar 'explicit' si tienen PIN parental O están en lista blanca. Basta cumplir una regla de acceso.

### En código
\`requiredAny.some(perm => userPermissions.includes(perm))\` → \`true\` si el usuario tiene 'write'.

### Tip para la entrevista
Para 'debe tener TODOS los permisos' invierte a \`every\` sobre required. some/every + includes es patrón RBAC básico en frontend.`,
  },

  4: {
    descriptionPrefix:
      "El formulario de inscripción solo se envía si todos los campos obligatorios tienen texto.",
    everydayInExplanation:
      "Email lleno, nombre lleno, teléfono opcional puede ir vacío. every() revisa cada campo: 'si es obligatorio, ¿tiene contenido?' Un solo hueco bloquea el envío, como una lista de compras incompleta antes de salir de casa.",
    theory: `### En palabras simples
\`every()\` valida formularios: cada campo cumple una regla (\`!required || value.trim() !== ''\`). Todos deben pasar para \`isValid === true\`.

### Ejemplo de la vida real
En la lista de invitados a la fiesta, los campos con asterisco deben estar llenos. Si falta un correo obligatorio, no imprimes las etiquetas aún.

### En código
\`fields.every(f => !f.required || f.value.trim() !== '')\` → \`false\` si 'name' está vacío y es requerido.

### Tip para la entrevista
Validación declarativa con every es legible. Para UX, combina con mensajes por campo (no solo boolean global).`,
  },

  5: {
    descriptionPrefix:
      "Al revisar la lista de invitados, quieres saber si alguien apareció dos veces con el mismo correo.",
    everydayInExplanation:
      "Recorres la lista: si el correo 'a@t.com' ya apareció antes en una posición anterior, hay duplicado. some() detecta '¿existe algún elemento cuya primera aparición no es aquí?'",
    theory: `### En palabras simples
\`some((email, idx, arr) => arr.indexOf(email) !== idx)\` detecta duplicados: el índice actual difiere del primer indexOf → hay copia previa.

### Ejemplo de la vida real
En la playlist importada de varias fuentes, algunas canciones se repiten. Quieres alerta '¿hay duplicados?' antes de compartir la lista con amigos.

### En código
\`emails.some((email, idx, arr) => arr.indexOf(email) !== idx)\` → \`true\` si 'a@t.com' aparece dos veces.

### Tip para la entrevista
Para deduplicar usa filter+indexOf o Set. some es para **detectar existencia** de duplicado, no para limpiar.`,
  },

  6: {
    descriptionPrefix:
      "Antes de imprimir place cards, confirmas que TODAS las líneas de la lista son nombres válidos, no números raros.",
    everydayInExplanation:
      "Si cada línea es texto, puedes tratar toda la lista como 'lista de nombres'. every() con type guard verifica que cada elemento pasa la prueba; si todos pasan, TypeScript confía en el arreglo completo.",
    theory: `### En palabras simples
\`every((item): item is string => typeof item === 'string')\` en una función \`isStringArray\` permite estrechar \`unknown[]\` a \`string[]\` cuando retorna true.

### Ejemplo de la vida real
En un examen de opción múltiple, revisas que todas las respuestas marcadas sean A, B, C o D. Si una es '???', invalidas el formato antes de calificar.

### En código
\`function isStringArray(arr: unknown[]): arr is string[] { return arr.every((item): item is string => typeof item === 'string'); }\`

### Tip para la entrevista
Type guard a nivel array con every es menos común que por elemento, pero útil validando JSON.parse o datos externos.`,
  },

  7: {
    descriptionPrefix:
      "Para hacer checkout premium, necesitas al menos un artículo caro Y que todos tengan stock — dos preguntas distintas.",
    everydayInExplanation:
      "some() responde '¿hay algún producto de lujo?'. every() responde '¿todos tienen cantidad > 0?'. Combinas con && como reglas de negocio: ambas deben cumplirse para proceder.",
    theory: `### En palabras simples
\`some()\` = OR sobre elementos ('¿alguno cumple?'). \`every()\` = AND sobre elementos ('¿todos cumplen?'). Combínalos con \`&&\`/\`||\` para reglas compuestas.

### Ejemplo de la vida real
Para el viaje escolar: algún adulto acompañante (some) Y todos los niños con autorización firmada (every). Faltan las dos condiciones para el autobús.

### En código
\`const hasPremium = cart.some(i => i.price > 1000);\` \`const allInStock = cart.every(i => i.qty > 0);\` \`canCheckout = hasPremium && allInStock\`.

### Tip para la entrevista
Nomina variables booleanas intermedias (\`hasPremium\`, \`allInStock\`) — más legible que some/every anidados inline en un if gigante.`,
  },

  8: {
    descriptionPrefix:
      "Si la canasta de frutas está vacía, decir 'todas son manzanas' suena raro — pero matemáticamente es verdadero.",
    everydayInExplanation:
      "every() en lista vacía devuelve true (verdad vacía). Es como decir 'todos los dragones en mi sala son verdes' cuando no hay dragones. En apps reales, a veces debes comprobar primero que la lista no esté vacía.",
    theory: `### En palabras simples
\`[].every(() => false)\` → \`true\`. No hay contraejemplo. En validaciones, combina \`arr.length > 0 && arr.every(pred)\` si vacío debe ser inválido.

### Ejemplo de la vida real
'¿Todos los alumnos del equipo entregaron la tarea?' Si el equipo no tiene nadie inscrito aún, decir 'sí' es engañoso. Verifica que haya alumnos primero.

### En código
\`function allMatch<T>(arr: T[], pred: (item: T) => boolean) { return arr.length > 0 && arr.every(pred); }\`

### Tip para la entrevista
Pregunta clásica de entrevista. Vacuous truth de every vs some: \`[].some(() => true)\` → \`false\`.`,
  },

  9: {
    descriptionPrefix:
      "Quieres saber si Iram está en algún equipo del torneo, sin importar cuál.",
    everydayInExplanation:
      "Hay varios equipos y cada uno tiene lista de miembros. some() sobre equipos pregunta '¿algún equipo incluye a Iram?' — basta encontrarlo en Frontend o Backend.",
    theory: `### En palabras simples
\`some()\` anidado busca en estructuras con sub-arreglos: \`teams.some(team => team.members.includes('Iram'))\`. OR a nivel de contenedores.

### Ejemplo de la vida real
En álbumes por viaje (París, Roma, Madrid), buscas si alguna foto tagged 'playa' existe en cualquier álbum. No abres cada foto; revisas álbum por álbum con regla interna.

### En código
\`teams.some(team => team.members.includes('Iram'))\` → \`true\` si Iram está en Frontend.

### Tip para la entrevista
Complejidad O(equipos × miembros). Para búsquedas repetidas, construye Set global de miembros o índice invertido.`,
  },

  10: {
    descriptionPrefix:
      "Para calificar un platillo, debe cumplir sabor Y presentación Y temperatura — o basta con uno de varios criterios de descuento.",
    everydayInExplanation:
      "satisfiesAll aplica every sobre reglas: todas deben pasar. satisfiesAny aplica some: basta una. Es como 'debe ser vegano Y sin gluten' vs 'descuento si eres estudiante O adulto mayor'.",
    theory: `### En palabras simples
Utilidades genéricas que reciben un item y varios predicados. \`satisfiesAll\` → \`predicates.every(pred => pred(item))\`. \`satisfiesAny\` → \`predicates.some(pred => pred(item))\`.

### Ejemplo de la vida real
En el salón, un proyecto gana mención si cumple creatividad Y entrega a tiempo Y ortografía. Un cupón aplica si eres hermano de alumno O exalumno O staff.

### En código
\`function satisfiesAll<T>(item: T, ...predicates: Predicate<T>[]) { return predicates.every(pred => pred(item)); }\`

### Tip para la entrevista
Composición de predicados es testeable y evita ifs anidados. Patrón Strategy ligero sin clases.`,
  },
};
