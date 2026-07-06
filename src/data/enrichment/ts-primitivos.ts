import type { ExerciseEnrichment, EnrichmentMap } from "./enrich";

export const TS_PRIMITIVOS_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Imagina que cada caja en tu despensa lleva una etiqueta que dice qué guarda: texto, número o sí/no.",
    everydayInExplanation:
      "Cuando escribes en un formulario tu nombre (texto), tu edad (número) y si aceptas términos (sí/no), cada campo tiene un tipo distinto. Anotar el tipo en TypeScript es como poner esa etiqueta desde el principio.",
    theory: `### En palabras simples
Cuando declaras una variable, puedes escribirle al lado qué clase de dato guardará: texto (\`string\`), número (\`number\`) o verdadero/falso (\`boolean\`). Es como etiquetar una caja antes de guardar cosas dentro.

### Ejemplo de la vida real
En una receta familiar, anotas "2 tazas de harina" (número), "sal al gusto" (texto) y "¿lleva huevo? sí" (boolean). Si alguien más cocina, las etiquetas evitan confusiones: nadie meterá "dos" como palabra cuando necesitas la cantidad numérica.

### En código
\`let edad: number = 28\` le dice a TypeScript que \`edad\` solo puede ser un número, igual que la etiqueta "cantidad" en tu formulario.

### Tip para la entrevista
Usa anotación explícita en funciones públicas (parámetros y retornos); en variables locales deja que TypeScript infiera cuando el valor es obvio.`,
  },

  2: {
    descriptionPrefix:
      "A veces no hace falta escribir la etiqueta: el contenido de la caja ya dice de qué es.",
    everydayInExplanation:
      "Si pones una manzana en la bolsa, todos saben que es fruta sin que escribas 'FRUTA' en un cartel. TypeScript hace lo mismo cuando el valor inicial es claro. Pero si la bolsa empieza vacía, sí necesitas decir qué irá ahí.",
    theory: `### En palabras simples
TypeScript puede adivinar el tipo mirando el valor que le das. Si escribes \`let ciudad = 'Monterrey'\`, ya sabe que es texto. Solo necesitas anotar cuando el tipo no se puede deducir, como un arreglo que empieza vacío.

### Ejemplo de la vida real
Cuando llenas un vaso con agua, no necesitas un letrero que diga "líquido": se nota solo. Pero un recipiente vacío en la cocina sí lleva etiqueta ("arroz", "frijoles") para que nadie lo use mal.

### En código
\`const STATUS_OK = 200\` guarda el número exacto 200 (tipo literal), mientras \`let items: string[] = []\` necesita anotación porque el arreglo vacío no revela qué guardará.

### Tip para la entrevista
Recuerda: \`const x = 5\` infiere el literal \`5\`, no \`number\`; \`let x = 5\` sí infiere \`number\`. Esa diferencia importa en uniones discriminadas.`,
  },

  3: {
    descriptionPrefix:
      "A veces un campo del formulario puede quedar vacío, y eso también es un valor válido que debes contemplar.",
    everydayInExplanation:
      "Tu correo en un registro puede estar en blanco (vacío) o simplemente no aplicar si aún no lo tienes. \`null\` y \`undefined\` son las dos formas de decir 'aquí no hay valor', y conviene tratarlas con cuidado.",
    theory: `### En palabras simples
Con \`strictNullChecks\` activado, \`null\` (valor vacío intencional) y \`undefined\` (valor no definido) no se mezclan solos con texto o números. Debes declarar explícitamente que algo puede faltar, por ejemplo \`string | null\`.

### Ejemplo de la vida real
En un estacionamiento, una plaza puede tener un auto (valor), estar reservada pero vacía (\`null\`), o ni siquiera existir en el mapa (\`undefined\`). El vigilante debe saber cuál caso es cuál antes de dejar entrar a alguien.

### En código
\`let email: string | null = null\` admite texto o vacío; una función que busca por ID puede retornar \`string | undefined\` cuando no encuentra nada.

### Tip para la entrevista
Siempre activa \`strictNullChecks\`: te obliga a manejar los casos vacíos y evita errores en producción que en otros lenguajes aparecen como "referencia nula".`,
  },

  4: {
    descriptionPrefix:
      "No siempre basta con 'texto' o 'número': a veces solo aceptas opciones exactas, como los botones de un elevador.",
    everydayInExplanation:
      "Un semáforo solo tiene rojo, amarillo o verde; no puedes poner 'morado'. Los tipos literales en TypeScript funcionan igual: restringen un valor a opciones fijas que tú defines.",
    theory: `### En palabras simples
Un tipo literal fija un valor exacto, no una categoría amplia. \`'norte' | 'sur' | 'este' | 'oeste'\` solo permite esas cuatro palabras, y \`200 | 404 | 500\` solo esos números de respuesta HTTP.

### Ejemplo de la vida real
En un cajero automático solo puedes elegir retirar 100, 200 o 500 pesos; escribir "150" no es opción. El menú limita las respuestas válidas antes de que tú actúes.

### En código
\`type Direccion = 'norte' | 'sur' | 'este' | 'oeste'\` crea un "menú" de textos permitidos, más flexible y liviano que un \`enum\` tradicional.

### Tip para la entrevista
Para conjuntos pequeños de constantes, prefiere uniones de literales sobre \`enum\`: no generan código extra en JavaScript y el autocompletado funciona igual de bien.`,
  },

  5: {
    descriptionPrefix:
      "Hay configuraciones que no deben cambiar nunca, como las reglas de un juego de mesa impresas en la caja.",
    everydayInExplanation:
      "Cuando congelas una lista de ingredientes o los pasos de una receta oficial, nadie puede sustituir 'azúcar' por 'sal' sin romper el plato. \`as const\` hace eso con objetos y arreglos en TypeScript.",
    theory: `### En palabras simples
\`as const\` convierte un valor en inmutable y fija sus tipos al detalle más preciso posible. Un arreglo pasa de \`string[]\` a una lista exacta y de solo lectura; un objeto guarda cada propiedad como valor literal, no como tipo genérico.

### Ejemplo de la vida real
El manual de un electrodoméstico trae la URL de soporte y la versión del firmware impresas; no son "cualquier texto" ni "cualquier número", son esos valores exactos y no se reescriben a mano.

### En código
\`const CONFIG = { api: 'https://api.com', version: 2 } as const\` hace que \`CONFIG.api\` sea el literal \`'https://api.com'\`, no un \`string\` cualquiera.

### Tip para la entrevista
Usa \`as const\` para configs, rutas y tipos de acciones: obtienes los tipos más estrechos sin costo en tiempo de ejecución.`,
  },

  6: {
    descriptionPrefix:
      "Cuando recibes un paquete sin etiqueta, lo abres con cuidado antes de usar lo que trae adentro.",
    everydayInExplanation:
      "\`any\` es como aceptar cualquier paquete y usarlo sin revisar: puedes romper algo. \`unknown\` también acepta cualquier cosa, pero te obliga a mirar qué es antes de tocarlo, como revisar el contenido antes de enchufar un aparato.",
    theory: `### En palabras simples
\`any\` apaga las alarmas del compilador: puedes llamar métodos que no existen y el error aparece hasta en producción. \`unknown\` acepta cualquier valor, pero obliga a comprobar el tipo (con \`typeof\`, \`instanceof\`, etc.) antes de usarlo.

### Ejemplo de la vida real
Una caja misteriosa en la puerta: con \`any\` la abres y bebes lo primero que ves; con \`unknown\` primero lees la etiqueta, la abres y confirmas que es jugo antes de servirlo.

### En código
\`let input: unknown = getInput()\` seguido de \`if (typeof input === 'string')\` deja usar \`input.toUpperCase()\` con seguridad.

### Tip para la entrevista
En code reviews, rechaza \`any\` en código de producción; \`unknown\` más una verificación explícita es la alternativa profesional.`,
  },

  7: {
    descriptionPrefix:
      "Cuando revisas todas las salidas de un edificio, quieres una alarma si alguien abre una puerta que no existía en el plano.",
    everydayInExplanation:
      "Si tu menú solo tiene tres platillos y llega un pedido de un cuarto que no existe, el cocinero debe gritar '¡eso no está en la carta!'. El tipo \`never\` es esa alarma: marca caminos que no deberían ocurrir nunca.",
    theory: `### En palabras simples
\`never\` representa situaciones imposibles. En un \`switch\` que cubre todos los casos de un tipo unión, el \`default\` con \`never\` avisa si olvidaste alguno cuando agregas una opción nueva.

### Ejemplo de la vida real
Un guardia en un estacionamiento con plazas A, B y C: si aparece un coche en la plaza D, suena la alarma porque esa plaza no existe en el plano. No es un valor normal; es un error de sistema.

### En código
\`const _exhaustive: never = forma\` en el \`default\` del \`switch\` fuerza a TypeScript a comprobar que cubriste \`'circulo'\`, \`'cuadrado'\` y \`'triangulo'\`.

### Tip para la entrevista
Patrón exhaustivo: cuando amplíes un union type, el compilador te señalará el \`default\` si falta un \`case\` — es tu red de seguridad gratis.`,
  },

  8: {
    descriptionPrefix:
      "Antes de usar algo que puede ser cuchara o tenedor, miras qué es para no comer sopa con el incorrecto.",
    everydayInExplanation:
      "Si un cajón mezcla calcetines y corbatas, primero miras y separas. \`typeof\` hace esa revisión en código: si es número, lo formateas; si es texto, lo pones en mayúsculas.",
    theory: `### En palabras simples
Type narrowing es cuando TypeScript "estrecha" un tipo amplio dentro de un \`if\`. Si una variable puede ser \`string | number\`, al comprobar \`typeof valor === 'number'\` sabe que dentro del bloque es número.

### Ejemplo de la vida real
En la aduana te preguntan si llevas líquidos o sólidos. Según tu respuesta, te mandan a un carril distinto. El trato cambia según la categoría que confirmaste.

### En código
\`if (typeof valor === 'number') { return valor.toFixed(2); }\` permite usar métodos de número solo cuando la comprobación lo garantiza.

### Tip para la entrevista
TypeScript analiza el flujo de control: los \`if\`, \`switch\` y early returns estrechan tipos automáticamente sin casts manuales.`,
  },

  9: {
    descriptionPrefix:
      "A veces una fila tiene lugares fijos: el primero es nombre, el segundo edad, el tercero si está activo.",
    everydayInExplanation:
      "Como una fila en el cine donde el asiento 1 es ventanilla, el 2 es pasillo y el 3 es medio: cada posición tiene un rol distinto. Las tuplas son arreglos con orden y tipo definidos por lugar.",
    theory: `### En palabras simples
Una tupla es un arreglo de longitud fija donde cada índice tiene su propio tipo. \`[string, number, boolean]\` significa: posición 0 texto, 1 número, 2 verdadero/falso.

### Ejemplo de la vida real
Un ticket de turno en el banco: [nombre del cliente, número de turno, ¿es prioritario?]. No puedes intercambiar el número por un sí/no sin arruinar el sistema.

### En código
\`type Empleado = [string, number, boolean]\` y \`function useToggle(): [boolean, () => void]\` modelan el patrón estado + función que cambia el estado, como en React.

### Tip para la entrevista
\`useState\` retorna una tupla \`[T, (v: T) => void]\`; reconocer tuplas te ayuda a leer hooks y APIs que devuelven pares valor-acción.`,
  },

  10: {
    descriptionPrefix:
      "A veces le dices al mesero 'confía en mí, esto es café' aunque el vaso parezca otro líquido.",
    everydayInExplanation:
      "Una aserción de tipo es decirle al compilador que tú sabes mejor qué hay ahí, sin comprobarlo en el momento. Como mostrar tu credencial de empleado para entrar a una zona restringida: no vuelven a escanear, confían en tu palabra.",
    theory: `### En palabras simples
\`as\` le dice a TypeScript "trata esto como este tipo". No convierte nada en ejecución: solo cambia lo que el compilador cree. Si te equivocas, el error aparece al correr el programa, no al compilar.

### Ejemplo de la vida real
Firmas un documento diciendo que el paquete contiene "documentos" para aduana; si en realidad traía otra cosa, el problema surge después, no al firmar.

### En código
\`document.getElementById('email') as HTMLInputElement\` asume que el elemento es un input; \`await response.json() as User\` asume la forma de la respuesta.

### Tip para la entrevista
Prefiere type guards (\`typeof\`, \`instanceof\`, validación) sobre \`as\`; usa aserciones solo cuando tengas certeza (DOM conocido, API con contrato fijo).`,
  },

  11: {
    descriptionPrefix:
      "El signo de exclamación es como decir 'yo sé que esta llave abre esa puerta' sin volver a probarla.",
    everydayInExplanation:
      "Cuando apuestas a que el botón de enviar existe en la página y pones \`!\`, le dices a TypeScript que no será \`null\`. Es un atajo arriesgado: si el botón no está, la app falla en silencio al ejecutarse.",
    theory: `### En palabras simples
El operador \`!\` después de una expresión le dice al compilador: "esto no es \`null\` ni \`undefined\`". No comprueba nada en ejecución; solo silencia la advertencia de tipos.

### Ejemplo de la vida real
Entras a tu casa seguro de que dejaste las llaves en el bolsillo y no revisas. Si no están, te quedas afuera. El \`!\` es esa confianza sin verificación.

### En código
\`document.querySelector('#submit')!\` evita el error de tipo, pero \`if (btn) { ... }\` o \`btn?.addEventListener(...)\` son más seguros.

### Tip para la entrevista
Cada \`!\` es deuda técnica potencial; en entrevistas y reviews, justifica por qué estás 100% seguro o usa optional chaining (\`?.\`).`,
  },

  12: {
    descriptionPrefix:
      "Puedes armar nombres combinando piezas, como juntar color y talla para etiquetar la ropa en el clóset.",
    everydayInExplanation:
      "Si tienes colores (rojo, azul) y tallas (ch, med, g), cada prenda se llama 'rojo-ch', 'azul-med', etc. Los template literal types generan automáticamente todas esas combinaciones válidas.",
    theory: `### En palabras simples
Los template literal types usan la sintaxis de plantillas (\`\${...}\`) para construir tipos de texto a partir de otros tipos. TypeScript une las piezas y te da autocompletado de todas las variantes posibles.

### Ejemplo de la vida real
En un menú digital combinas tamaño y bebida: 'chico-café', 'grande-té'. La pantalla solo muestra combinaciones que existen; no inventa 'grande-xyz'.

### En código
\`type CssClass = \`\${Color}-\${Size}\`\` produce \`'red-sm' | 'red-md' | ...\`; \`type Handler = \`on\${Capitalize<EventName>}\`\` genera \`'onClick' | 'onHover'\`.

### Tip para la entrevista
Son ideales para rutas, nombres de eventos CSS y query builders type-safe: el compilador valida strings que antes solo existían en tu cabeza.`,
  },

  13: {
    descriptionPrefix:
      "Tres palabras parecidas que significan cosas distintas: no hacer nada útil, no tener valor, o no terminar nunca.",
    everydayInExplanation:
      "\`void\` es como un mensajero que solo avisa y no trae paquete. \`undefined\` es la bandeja vacía que sí recibes. \`never\` es el camino que no tiene salida: la función lanza error o no para.",
    theory: `### En palabras simples
\`void\`: la función hace algo (como imprimir) pero no devuelve un valor útil. \`undefined\`: el valor "no definido" puede ser el retorno explícito. \`never\`: la función no termina bien (lanza error o bucle infinito).

### Ejemplo de la vida real
Un timbre que solo suena (\`void\`), una caja que te entregan vacía (\`undefined\`), y un túnel sin salida donde no puedes completar el viaje (\`never\`).

### En código
\`function log(msg: string): void\` solo imprime; \`buscar(id): string | undefined\` puede no encontrar nada; \`function crash(): never { throw ... }\` nunca retorna con normalidad.

### Tip para la entrevista
\`void\` permite \`return\` implícito; \`never\` se usa en ramas imposibles y funciones que siempre fallan — confundirlos es señal de junior.`,
  },

  14: {
    descriptionPrefix:
      "Hay números tan grandes que la calculadora normal se queda corta, y hay nombres secretos que solo tú conoces en tu agenda.",
    everydayInExplanation:
      "BigInt es la calculadora de contador para cifras enormes (como IDs de banco). Symbol es un apodo único en tu libreta: nadie más puede tener esa misma clave aunque el texto se parezca.",
    theory: `### En palabras simples
\`bigint\` guarda enteros más grandes que el límite seguro de \`number\` (se escribe con \`n\` al final). \`symbol\` crea identificadores únicos, útiles como llaves de propiedades que no chocan con nombres normales.

### Ejemplo de la vida real
El número de serie de un billete de colección puede ser gigantesco (BigInt). Un código interno grabado en tu llave física que no aparece en ningún directorio público (Symbol).

### En código
\`const idGrande: bigint = 9007199254740993n\` y \`const ID = Symbol('userId')\` con \`user[ID] = 123\` evitan colisiones con propiedades llamadas \`'userId'\` en texto.

### Tip para la entrevista
BigInt para finanzas e IDs grandes; Symbol para metadatos privados o claves que no deben mezclarse con strings del usuario.`,
  },

  15: {
    descriptionPrefix:
      "Algunas cosas están bajo vidrio en un museo: puedes mirarlas, pero no cambiarlas.",
    everydayInExplanation:
      "Un menú impreso en la pared del restaurante no lo borras con plumón cada día. \`readonly\` y \`Readonly<T>\` marcan en el tipo qué datos son solo lectura, para que nadie los modifique por accidente.",
    theory: `### En palabras simples
\`readonly\` en una propiedad impide reasignarla. \`Readonly<T>\` convierte todas las propiedades de un tipo en solo lectura. \`ReadonlyArray\` evita \`push\`, \`pop\` y otras mutaciones en arreglos.

### Ejemplo de la vida real
Las reglas del reglamento de un condominio están enmarcadas: puedes leerlas, pero no tachar ni reescribir artículos. Si intentas, el administrador (el compilador) te lo impide.

### En código
\`interface Config { readonly apiUrl: string }\`, \`type FrozenConfig = Readonly<Config>\` y \`const roles: Readonly<string[]>\` protegen config y listas de cambios accidentales.

### Tip para la entrevista
\`Readonly\` es superficial (shallow): objetos anidados pueden seguir siendo mutables; para inmutabilidad profunda combina con \`as const\` o utilidades como \`DeepReadonly\`.`,
  },
};
