import type { EnrichmentMap } from "./enrich";

export const TS_FUNCIONES_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Antes de cobrar en la caja, el letrero indica qué datos pide y qué te entrega: precio, cambio, ticket.",
    everydayInExplanation:
      "Tipar parámetros y retorno es como el rótulo de una máquina expendedora: si metes monedas (números), sale un producto (número o texto); si metes algo que no cabe, la máquina ni siquiera arranca.",
    theory: `### En palabras simples
Anotas en la **firma** de la función qué tipos recibe cada parámetro y qué tipo devuelve. TypeScript rechaza llamadas incorrectas **antes** de ejecutar el programa.

### Ejemplo de la vida real
En un formulario de envío, el campo 'peso' solo acepta números y el sistema responde con un costo en pesos. Si escribes tu nombre en 'peso', el formulario te avisa al instante.

### En código
\`\`\`typescript
function sumar(a: number, b: number): number {
  return a + b;
}

sumar(2, 3);      // OK → 5
// sumar("2", 3); // Error en compilación
\`\`\`

### Tip para la entrevista
Siempre tipa parámetros. El retorno puede inferirse en funciones locales, pero en APIs públicas anótalo explícitamente para documentar el contrato.`,
  },

  2: {
    descriptionPrefix:
      "La receta rápida en la nevera usa flechas y pasos cortos en lugar de párrafos largos.",
    everydayInExplanation:
      "Las arrow functions son la versión compacta de una función normal. Se leen como 'toma esto y devuelve aquello', ideal para tareas pequeñas y callbacks en listas o temporizadores.",
    theory: `### En palabras simples
Las **arrow functions** (\`=>) se tipan igual que las funciones clásicas: parámetros con tipos y retorno explícito o inferido. No tienen su propio \`this\`, lo que las hace ideales para callbacks.

### Ejemplo de la vida real
En una fila del banco, el turnero tiene instrucciones breves: 'dé su número, espere'. No es un manual largo; es directo y repetible, como una arrow function en un botón.

### En código
\`\`\`typescript
const multiplicar = (a: number, b: number): number => a * b;

const saludar = (nombre: string): string => {
  return \`Hola, \${nombre}\`;
};

const getNow = (): Date => new Date();
\`\`\`

### Tip para la entrevista
Prefiere arrows en callbacks y módulos modernos. Recuerda: no tienen \`this\` propio, a diferencia de \`function\` — eso importa en métodos de objetos y clases.`,
  },

  3: {
    descriptionPrefix:
      "En un pedido por teléfono, el nombre es obligatorio pero el 'sin cebolla' es opcional si no lo mencionas.",
    everydayInExplanation:
      "Los parámetros opcionales (\`?\`) y los valores por defecto son como extras en un café: si no pides leche de almendra, te ponen la regular. La función funciona igual sin que lo repitas cada vez.",
    theory: `### En palabras simples
Un parámetro **opcional** (\`edad?\`) puede omitirse al llamar la función. Un **default** (\`rol = 'user'\`) asigna un valor automático si no lo pasas. Los opcionales deben ir al final de la lista.

### Ejemplo de la vida real
Al reservar mesa en un restaurante, das tu nombre (obligatorio) y tal vez pides mesa cerca de la ventana. Si no lo pides, te asignan cualquier mesa disponible (valor por defecto).

### En código
\`\`\`typescript
function crearUsuario(
  nombre: string,
  rol: string = "user",
  edad?: number
): { nombre: string; rol: string; edad?: number } {
  return { nombre, rol, edad };
}

crearUsuario("Iram"); // rol="user", edad=undefined
\`\`\`

### Tip para la entrevista
Prefiere **default values** sobre \`?\` cuando tengas un valor sensato: reduce comprobaciones de \`undefined\` y hace el código más legible.`,
  },

  4: {
    descriptionPrefix:
      "En la caja del super recibes varios productos a la vez y el cajero los suma en una sola cuenta.",
    everydayInExplanation:
      "Los rest parameters (\`...nums\`) juntan todos los argumentos extra en un arreglo, como echar varias frutas en la misma bolsa para pesarlas juntas.",
    theory: `### En palabras simples
\`...args\` recopila argumentos variables en un **arreglo tipado**. Útil cuando no sabes cuántos valores recibirás, pero sí de qué tipo serán.

### Ejemplo de la vida real
En una fondue, cada quien mete lo que quiera al caldo: pan, carne, verdura. El rest parameter es la olla que recibe 'todo lo que traigas' del mismo tipo de ingrediente.

### En código
\`\`\`typescript
function sumarTodos(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

sumarTodos(1, 2, 3, 4); // 10

function log(nivel: string, ...mensajes: string[]): void {
  console.log(\`[\${nivel}]\`, ...mensajes);
}
\`\`\`

### Tip para la entrevista
Útiles en wrappers, loggers y builders. El rest siempre va al final de la lista de parámetros.`,
  },

  5: {
    descriptionPrefix:
      "La misma palabra 'abrir' significa cosas distintas si hablas de una puerta, un archivo o una botella.",
    everydayInExplanation:
      "Los overloads declaran varias 'firmas' para una misma función. Según lo que le pases (texto o número), TypeScript sabe qué tipo de resultado esperar, como un menú con opciones distintas según tu elección.",
    theory: `### En palabras simples
Las **sobrecargas** listan varias firmas al inicio y una implementación al final. TypeScript elige la firma correcta según los argumentos que uses en cada llamada.

### Ejemplo de la vida real
En un elevador, el botón 'B' puede significar sótano en un edificio o baño en un centro comercial. El contexto (edificio vs plaza) determina la interpretación, como el tipo del argumento determina el retorno.

### En código
\`\`\`typescript
function procesar(input: string): string;
function procesar(input: number): number;
function procesar(input: string | number): string | number {
  if (typeof input === "string") return input.toUpperCase();
  return input * 2;
}

const a = procesar("hola"); // tipo: string
const b = procesar(5);      // tipo: number
\`\`\`

### Tip para la entrevista
Úsalos cuando el **retorno depende del input**. Similar a method overloading en C#. La implementación debe cubrir todos los casos de las firmas.`,
  },

  6: {
    descriptionPrefix:
      "Pides comida a domicilio y das tu número para que te avisen cuando el repartidor esté cerca.",
    everydayInExplanation:
      "Un callback es una función que le pasas a otra para que la ejecute después, como dejar tu teléfono en recepción para que te llamen cuando llegue tu paquete.",
    theory: `### En palabras simples
Las **higher-order functions** reciben o devuelven otras funciones. Tipar el callback documenta qué parámetros recibe y qué debe devolver.

### Ejemplo de la vida real
En un semáforo inteligente, registras tu auto y el sistema te avisa (callback) cuando cambia a verde. Tú no vigilas el semáforo; le das la instrucción 'avísame cuando pueda pasar'.

### En código
\`\`\`typescript
function ejecutarConDelay(callback: () => void, ms: number): void {
  setTimeout(callback, ms);
}

function procesarLista<T>(
  items: T[],
  transformar: (item: T) => string
): string[] {
  return items.map(transformar);
}
\`\`\`

### Tip para la entrevista
Siempre tipa callbacks en handlers de eventos y APIs. Un callback sin tipo es una bomba de errores que explota en runtime, no en compilación.`,
  },

  7: {
    descriptionPrefix:
      "El guardia revisa tu gafete y confirma si eres visitante o empleado antes de dejarte pasar.",
    everydayInExplanation:
      "Un type predicate (\`user is Admin\`) es una función que responde sí o no y le dice a TypeScript qué tipo quedó confirmado. Como el guardia que, tras revisar, anuncia 'es empleado' y entonces puedes usar el elevador de personal.",
    theory: `### En palabras simples
Una función con retorno \`x is Type\` es un **type guard personalizado**. Si devuelve \`true\`, TypeScript estrecha el tipo dentro del bloque \`if\`.

### Ejemplo de la vida real
En un concierto, el staff revisa tu pulsera: si es VIP, te dejan al frente; si es general, otra zona. La pulsera (la comprobación) determina qué puertas puedes usar después.

### En código
\`\`\`typescript
interface Admin { role: "admin"; permissions: string[]; }
interface Guest { role: "guest"; }

function isAdmin(user: Admin | Guest): user is Admin {
  return user.role === "admin";
}

function dashboard(user: Admin | Guest) {
  if (isAdmin(user)) {
    console.log(user.permissions); // TS sabe que es Admin
  }
}
\`\`\`

### Tip para la entrevista
Forma más type-safe de validar datos de APIs externas. Combina con \`in\`, \`typeof\` o validación de esquema según el caso.`,
  },

  8: {
    descriptionPrefix:
      "En la entrada del edificio, si no traes identificación válida, no pasas y suena la alarma.",
    everydayInExplanation:
      "Las assertion functions lanzan error si algo no cumple. Si pasan sin problema, TypeScript asume que el dato ya es del tipo correcto, como el guardia que te deja entrar solo si tu INE es válida.",
    theory: `### En palabras simples
Una función con \`asserts val is string\` **lanza error** si la condición falla. Si no lanza, TypeScript asume que el valor es del tipo afirmado en el resto del código.

### Ejemplo de la vida real
En la aduana, si tu pasaporte no es legible, te detienen ahí mismo. Si lo aprueban, sigues el trámite como viajero verificado, sin volver a preguntar en cada paso.

### En código
\`\`\`typescript
function assertString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Expected string");
  }
}

function process(input: unknown) {
  assertString(input);
  // Después del assert, TS sabe que input es string
  console.log(input.toUpperCase()); // OK
}
\`\`\`

### Tip para la entrevista
Similar a \`Debug.Assert()\` en C#. Útil al inicio de funciones que procesan \`unknown\`: falla rápido y estrecha el tipo sin casts manuales.`,
  },

  9: {
    descriptionPrefix:
      "Un molde de gelatina sirve para limón, fresa o uva: la forma es la misma, el contenido cambia.",
    everydayInExplanation:
      "Una función genérica captura el tipo real de lo que le pasas y lo propaga al resultado. Como una caja etiquetada 'frágil' que se adapta a lo que metas, pero siempre sabe qué hay dentro.",
    theory: `### En palabras simples
\`function primero<T>(arr: T[])\` declara un **parámetro de tipo** \`T\`. La función funciona con cualquier tipo, pero conserva el tipo concreto en el retorno sin caer en \`any\`.

### Ejemplo de la vida real
En una playlist, el botón 'primera canción' devuelve lo que sea que esté arriba: rock, jazz o podcast. El botón es el mismo; el contenido depende de tu lista.

### En código
\`\`\`typescript
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primero([1, 2, 3]);     // number
const str = primero(["a", "b"]);    // string
const nada = primero([]);           // undefined
\`\`\`

### Tip para la entrevista
Alternativa type-safe a \`any\`. El tipo \`T\` se infiere del argumento; no hace falta pasarlo explícitamente en la mayoría de casos.`,
  },

  10: {
    descriptionPrefix:
      "Pides comida por app y te prometen que llegará en un rato: primero esperas, luego recibes el pedido.",
    everydayInExplanation:
      "Las funciones \`async\` siempre devuelven una promesa: un 'sobre' que más tarde contendrá el resultado. Tipas lo que va **dentro** del sobre (\`User\`), no el sobre en sí.",
    theory: `### En palabras simples
\`async function\` siempre retorna \`Promise<T>\`. Anotas \`T\` (el valor resuelto), y TypeScript infiere la promesa automáticamente. \`await\` desenvuelve el contenido.

### Ejemplo de la vida real
Mandas a lavar tu ropa y te dan un ticket (promesa). Cuando regresas al día siguiente, recibes la ropa limpia (valor resuelto). El ticket no es la ropa; es la garantía de que llegará.

### En código
\`\`\`typescript
interface User { id: number; name: string; }

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}
\`\`\`

### Tip para la entrevista
El retorno declarado es \`Promise<T>\`, no \`T\`. Para errores, combina con \`try/catch\` o tipos de resultado (\`Result<T, E>\`).`,
  },

  11: {
    descriptionPrefix:
      "Algunas tareas solo piden que avises cuando termines; otras piden que entregues un producto concreto.",
    everydayInExplanation:
      "Un callback \`void\` es 'haz algo y no me importa qué devuelvas' (como registrar en bitácora). Un callback con retorno es 'transfórmame esto y entrégame el resultado' (como duplicar cada número de una lista).",
    theory: `### En palabras simples
\`void\` en callbacks significa que el retorno **se ignora** — solo importan los efectos secundarios (imprimir, guardar). Los transformers sí deben devolver un valor que se usará (\`map\`, \`filter\`).

### Ejemplo de la vida real
En un concierto, el público aplaude (efecto, sin entregable) mientras el cantante devuelve una canción (producto). \`forEach\` es aplaudir; \`map\` es cantar y grabar cada tema.

### En código
\`\`\`typescript
type EventHandler = (event: Event) => void;
type Transformer<T, R> = (input: T) => R;

const nums = [1, 2, 3];
nums.forEach(n => console.log(n));  // retorno ignorado
const doubled = nums.map(n => n * 2); // retorno usado
\`\`\`

### Tip para la entrevista
\`void\` en callbacks es especial: permite retornar cualquier valor que será ignorado por diseño. No confundir con 'no puede retornar nada' en implementación.`,
  },

  12: {
    descriptionPrefix:
      "Compras un molde para galletas y cada vez que lo usas recuerda la forma y el tamaño que elegiste.",
    everydayInExplanation:
      "Una closure es una función que 'recuerda' variables de donde nació. Como un descuento fijo del 20% que guardas en tu wallet y aplicas cada vez que pagas, sin volver a negociarlo.",
    theory: `### En palabras simples
Una **closure** es una función interna que captura variables del scope exterior. Tipar la función retornada documenta el contrato de lo que devuelve la factory.

### Ejemplo de la vida real
En una cafetería, pides 'el de siempre': el barista ya sabe tu tamaño y leche porque lo guardó la primera vez. La función que aplica tu pedido 'recuerda' tus preferencias.

### En código
\`\`\`typescript
function crearMultiplicador(factor: number): (n: number) => number {
  return (n) => n * factor;
}

const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);

console.log(doble(5));  // 10
console.log(triple(5)); // 15
\`\`\`

### Tip para la entrevista
Base de factory patterns, currying y composables (Vue 3, React hooks). Tipar el retorno evita closures que devuelven \`any\` implícito.`,
  },

  13: {
    descriptionPrefix:
      "En tu control remoto, cada botón tiene su acción escrita en corto: subir, bajar, mute.",
    everydayInExplanation:
      "El method shorthand en objetos es escribir \`add(a, b) { ... }\` en lugar de \`add: function(a, b) { ... }\`. Más limpio, como botones con iconos claros en lugar de instrucciones largas.",
    theory: `### En palabras simples
Puedes definir **métodos tipados** directamente en objetos con sintaxis abreviada. La interface describe el contrato; el objeto implementa cada método con su firma.

### Ejemplo de la vida real
Una calculadora de bolsillo tiene teclas +, −, = y C. Cada tecla es un método: misma carcasa, acciones distintas bien definidas en el manual.

### En código
\`\`\`typescript
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  reset(): void;
}

const calc: Calculator = {
  add(a, b) { return a + b; },
  subtract(a, b) { return a - b; },
  reset() { console.log("Reset"); },
};
\`\`\`

### Tip para la entrevista
Más limpio que asignar arrow functions como propiedades. En objetos literales, el shorthand mantiene \`this\` dinámico si lo necesitas.`,
  },

  14: {
    descriptionPrefix:
      "En una fábrica de galletas, una máquina estandarizada produce cada paquete con el mismo formato y fecha.",
    everydayInExplanation:
      "Una factory function arma objetos complejos por ti, validando que traigan todo lo necesario. Como el mostrador que prepara tu credencial con foto, nombre y folio sin que tú ensambles cada pieza.",
    theory: `### En palabras simples
Una **factory function** construye y retorna objetos con una forma tipada. Centraliza la creación, asigna valores por defecto (id, fecha) y evita repetir lógica en cada \`new\`.

### Ejemplo de la vida real
Al abrir cuenta en el banco, el ejecutivo llena tu ficha con datos mínimos y el sistema genera número de cliente y fecha de alta automáticamente. Tú no escribes el folio a mano.

### En código
\`\`\`typescript
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date(),
  };
}
\`\`\`

### Tip para la entrevista
En TypeScript moderno, factories suelen preferirse sobre clases para objetos de datos: más fáciles de testear, tree-shake y componer.`,
  },

  15: {
    descriptionPrefix:
      "Preparar un smoothie es encadenar pasos: lavar fruta, picar, licuar y servir en el mismo vaso.",
    everydayInExplanation:
      "La composición (\`pipe\`) pasa el resultado de un paso al siguiente, de izquierda a derecha. Como seguir una receta en orden: cada instrucción recibe lo que dejó el paso anterior.",
    theory: `### En palabras simples
\`pipe\` combina funciones en una sola: la salida de la primera es la entrada de la segunda. TypeScript infiere los tipos intermedios (\`A → B → C\`) sin perder seguridad.

### Ejemplo de la vida real
En un filtro de Instagram: primero ajustas brillo, luego contraste, luego saturación. Cada filtro recibe la foto ya procesada por el anterior. \`pipe\` modela esa cadena.

### En código
\`\`\`typescript
function pipe<A, B, C>(
  fn1: (a: A) => B,
  fn2: (b: B) => C
): (input: A) => C {
  return (input) => fn2(fn1(input));
}

const parseAndDouble = pipe(
  (s: string) => parseInt(s),
  (n: number) => n * 2
);

console.log(parseAndDouble("5")); // 10
\`\`\`

### Tip para la entrevista
\`pipe\` va izquierda a derecha; \`compose\` al revés. \`pipe\` suele ser más legible. Patrón común en programación funcional y librerías de utilidades.`,
  },
};
