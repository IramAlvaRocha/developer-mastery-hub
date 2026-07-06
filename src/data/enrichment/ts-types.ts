import type { EnrichmentMap } from "./enrich";

export const TS_TYPES_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "En tu agenda guardas apodos cortos para cosas que repites: 'casa' en vez de la dirección completa.",
    everydayInExplanation:
      "Un type alias es como ponerle un rótulo fácil a algo más largo: en lugar de decir 'número de identificación del usuario' cada vez, escribes \`ID\` y todos saben a qué te refieres.",
    theory: `### En palabras simples
Un **type alias** crea un nombre alternativo para un tipo. No inventa un tipo nuevo; solo le pone un apodo reutilizable a algo que ya existe: un número, un texto, un objeto o una combinación más compleja.

### Ejemplo de la vida real
En una receta familiar, en lugar de escribir cada vez "dos tazas de harina de trigo integral", pones al inicio "HTI = harina de trigo integral" y luego solo usas "2 tazas de HTI". El alias ahorra repetición y evita errores de tipeo.

### En código
\`\`\`typescript
type ID = number;
type Nombre = string;
type Coordenada = { x: number; y: number };

const userId: ID = 42;
\`\`\`

### Tip para la entrevista
Di que un alias es un **sinónimo de tipo**: útil para documentar intención (\`UserId\` vs \`number\`) y centralizar cambios si la definición evoluciona.`,
  },

  2: {
    descriptionPrefix:
      "Un semáforo solo puede estar en rojo, amarillo o verde: nunca en dos colores a la vez.",
    everydayInExplanation:
      "Un union type dice 'esto o aquello'. Como un formulario donde el método de pago puede ser tarjeta o efectivo, pero no ambos al mismo tiempo en un solo campo.",
    theory: `### En palabras simples
Los **union types** (\`|\`) permiten que un valor sea de **uno entre varios** tipos posibles. Es la forma idiomática de modelar alternativas en TypeScript.

### Ejemplo de la vida real
En un cajero automático eliges retirar en efectivo o transferir a cuenta: son opciones distintas para la misma pantalla. El sistema sabe que solo una aplica según lo que presionas.

### En código
\`\`\`typescript
type Resultado = "exito" | "error" | "pendiente";
type InputValue = string | number;

function procesar(val: InputValue): string {
  if (typeof val === "string") return val.toUpperCase();
  return val.toFixed(2);
}
\`\`\`

### Tip para la entrevista
Contrasta: **union (\`|\`)** = uno u otro; **intersection (\`&\`)** = uno y otro. Los unions son más flexibles que herencia para modelar variantes.`,
  },

  3: {
    descriptionPrefix:
      "Tu credencial de empleado trae datos personales y también datos del puesto: todo en una sola tarjeta.",
    everydayInExplanation:
      "Un intersection type junta requisitos de varias fichas en una sola. Es como armar un paquete que debe cumplir el checklist de identidad Y el checklist de trabajo al mismo tiempo.",
    theory: `### En palabras simples
Los **intersection types** (\`&\`) combinan varios tipos en uno que tiene **todas** las propiedades de todos. Es composición de formas, no alternativas.

### Ejemplo de la vida real
Para entrar a un edificio corporativo necesitas gafete de visitante (nombre, foto) y autorización del área (departamento, horario). Sin las dos piezas juntas, no pasas.

### En código
\`\`\`typescript
type ConId = { id: number };
type ConNombre = { nombre: string };
type ConEmail = { email: string };

type Empleado = ConId & ConNombre & ConEmail;

const emp: Empleado = {
  id: 1,
  nombre: "Iram",
  email: "iram@test.com",
};
\`\`\`

### Tip para la entrevista
\`&\` es como herencia múltiple de propiedades en tipos. Úsalo para mezclar contratos pequeños (\`Identifiable\`, \`Timestamped\`) en uno grande.`,
  },

  4: {
    descriptionPrefix:
      "Antes de usar la llave correcta, miras si es de casa, de auto o de oficina.",
    everydayInExplanation:
      "Los type guards son preguntas de verificación: '¿esto es un perro o un gato?' Según la respuesta, sabes qué acción tomar sin equivocarte.",
    theory: `### En palabras simples
Un **type guard** es una condición que le dice a TypeScript qué tipo tiene una variable **dentro de un bloque**. Puede ser \`typeof\`, \`instanceof\`, \`in\` o una función personalizada con \`is\`.

### Ejemplo de la vida real
En un estacionamiento, el vigilante revisa si el vehículo es moto o auto antes de dirigirlo al carril correcto. La revisión cambia el trato que recibes.

### En código
\`\`\`typescript
interface Perro { ladrar(): void; raza: string; }
interface Gato { maullar(): void; color: string; }

function esPerro(animal: Perro | Gato): animal is Perro {
  return "ladrar" in animal;
}

function hacerSonido(animal: Perro | Gato) {
  if (esPerro(animal)) {
    animal.ladrar(); // TS sabe que es Perro
  } else {
    animal.maullar(); // TS sabe que es Gato
  }
}
\`\`\`

### Tip para la entrevista
Los custom guards (\`x is Type\`) son esenciales para validar respuestas de API externas sin perder seguridad de tipos.`,
  },

  5: {
    descriptionPrefix:
      "En una receta, si el ingrediente es líquido usas vaso medidor; si es sólido, usas báscula.",
    everydayInExplanation:
      "Los conditional types eligen un tipo u otro según una condición, como un menú que cambia el plato según si pediste vegetariano o no. Es el 'si/no' del sistema de tipos.",
    theory: `### En palabras simples
Un **conditional type** tiene la forma \`T extends U ? X : Y\`: si \`T\` cumple con \`U\`, el resultado es \`X\`; si no, es \`Y\`. Es el if/else a nivel de tipos.

### Ejemplo de la vida real
En un formulario de envío, si eliges 'nacional' te pide código postal mexicano; si eliges 'internacional', te pide país y pasaporte. La forma del formulario depende de tu elección.

### En código
\`\`\`typescript
type TextOrNumber<T> = T extends string ? string : number;

type Unwrap<T> = T extends Promise<infer R> ? R : T;

type A = TextOrNumber<string>;       // string
type B = TextOrNumber<boolean>;      // number
type X = Unwrap<Promise<string>>;     // string
\`\`\`

### Tip para la entrevista
Son la base de utility types como \`Extract\`, \`Exclude\` y \`NonNullable\`. Demuestra que entiendes cómo TypeScript construye sus herramientas internas.`,
  },

  6: {
    descriptionPrefix:
      "Tienes una plantilla de formulario y decides marcar todos los campos como opcionales o todos como obligatorios de una vez.",
    everydayInExplanation:
      "Los mapped types recorren cada propiedad de un tipo y la transforman, como pasar por cada casilla de un checklist y tacharla o ponerle asterisco de 'requerido'.",
    theory: `### En palabras simples
Un **mapped type** itera sobre las claves de un tipo (\`keyof T\`) y crea un nuevo tipo transformando cada propiedad. Es el mecanismo detrás de \`Partial\`, \`Required\` y \`Readonly\`.

### Ejemplo de la vida real
En una playlist, puedes aplicar la misma regla a todas las canciones: marcarlas como favoritas, ocultarlas o ponerles volumen bajo. Una acción en lote sobre cada elemento.

### En código
\`\`\`typescript
type MiPartial<T> = {
  [K in keyof T]?: T[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User { name: string; age: number; }
type NullableUser = Nullable<User>;
// { name: string | null; age: number | null }
\`\`\`

### Tip para la entrevista
Entender mapped types te permite crear utility types personalizados para tu dominio, no solo usar los que trae TypeScript.`,
  },

  7: {
    descriptionPrefix:
      "En tu llavero tienes etiquetas con los nombres de cada llave: casa, auto, oficina.",
    everydayInExplanation:
      "El operador \`keyof\` extrae la lista de nombres de propiedades de un tipo, como leer las etiquetas de un llavero sin abrir cada puerta.",
    theory: `### En palabras simples
\`keyof\` devuelve un **union de strings literales** con los nombres de las propiedades de un tipo. Es la versión a nivel de tipos de \`Object.keys()\`.

### Ejemplo de la vida real
En un menú de restaurante impreso, las secciones son fijas: Entradas, Platos fuertes, Postres. Solo puedes pedir de esas categorías; no inventas una sección nueva al ordenar.

### En código
\`\`\`typescript
interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

type ClavesProducto = keyof Producto;
// "id" | "nombre" | "precio"

function obtener<T>(obj: T, key: keyof T): T[typeof key] {
  return obj[key];
}
\`\`\`

### Tip para la entrevista
Combina \`keyof\` con genéricos para APIs type-safe: funciones que solo aceptan claves válidas del objeto que reciben.`,
  },

  8: {
    descriptionPrefix:
      "Copias la ficha de un electrodoméstico que ya tienes en casa para saber qué tipo de enchufe y voltaje necesita.",
    everydayInExplanation:
      "\`typeof\` a nivel de tipo mira un valor que ya existe (como tu config guardada) y extrae su forma exacta, sin volver a escribirla a mano.",
    theory: `### En palabras simples
\`typeof\` en el **sistema de tipos** extrae el tipo de una variable o constante JavaScript. No confundir con \`typeof\` de ejecución (que devuelve strings como \`'string'\`).

### Ejemplo de la vida real
Tienes la receta original de tu abuela escrita a mano. En lugar de reescribir todos los ingredientes, haces una copia fiel y trabajas sobre esa copia tipada.

### En código
\`\`\`typescript
const config = {
  api: "https://api.com",
  port: 3000,
  debug: false,
} as const;

type Config = typeof config;
type ApiUrl = typeof config.api; // "https://api.com"

function createUser() { return { id: 1, name: "Iram" }; }
type User = ReturnType<typeof createUser>;
\`\`\`

### Tip para la entrevista
Muy útil con \`as const\` para extraer tipos de configuración. Evita duplicar definiciones entre valores runtime y tipos.`,
  },

  9: {
    descriptionPrefix:
      "En un paquete de delivery abres un compartimento específico para sacar solo lo que necesitas.",
    everydayInExplanation:
      "Los indexed access types son como abrir un cajón concreto de un archivero: pides 'estado del pedido' o 'primer artículo de la lista' y obtienes solo ese tipo, no todo el mueble.",
    theory: `### En palabras simples
\`T[K]\` accede al tipo de una propiedad específica de otro tipo, como \`obj.key\` pero en el mundo de los tipos. También funciona con arreglos: \`T['items'][number]\` obtiene el tipo de un elemento.

### Ejemplo de la vida real
En un ticket de compra en línea, el 'estado' puede ser pendiente, enviado o entregado; los 'artículos' son una lista con nombre y precio. Cada sección del ticket tiene su propio formato.

### En código
\`\`\`typescript
interface Orden {
  id: number;
  items: { nombre: string; precio: number }[];
  status: "pending" | "shipped" | "delivered";
}

type OrderStatus = Orden["status"];
// "pending" | "shipped" | "delivered"

type OrderItem = Orden["items"][number];
// { nombre: string; precio: number }
\`\`\`

### Tip para la entrevista
\`T['key']\` es lectura de propiedad a nivel de tipos. Combínalo con \`keyof\` para obtener uniones de todos los valores posibles de un objeto.`,
  },

  10: {
    descriptionPrefix:
      "Cuando abres una caja sorpresa, sacas lo que hay adentro y le pones nombre según lo que encontraste.",
    everydayInExplanation:
      "\`infer\` dentro de un conditional type es como decir: 'si esto parece una promesa, dime qué trae dentro'. Extrae el tipo escondido en un patrón.",
    theory: `### En palabras simples
\`infer\` declara una **variable de tipo temporal** dentro de un conditional type. TypeScript la deduce del patrón que coincide, como adivinar el contenido de una caja mirando su forma.

### Ejemplo de la vida real
Recibes sobres cerrados: si el sobre es de 'factura', sacas el monto; si es de 'invitación', sacas la fecha. \`infer\` hace esa extracción automática según la forma externa.

### En código
\`\`\`typescript
type MiReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type ElementOf<T> = T extends (infer E)[] ? E : never;

type A = MiReturnType<() => string>; // string
type B = ElementOf<number[]>;        // number
\`\`\`

### Tip para la entrevista
\`infer\` está detrás de \`ReturnType\`, \`Parameters\` y \`Awaited\`. Saber leerlo demuestra dominio de tipos avanzados.`,
  },

  11: {
    descriptionPrefix:
      "Una carpeta dentro de otra carpeta, y dentro otra más: la estructura se repite como un árbol genealógico.",
    everydayInExplanation:
      "Los tipos recursivos se referencian a sí mismos, como un menú con submenús que a su vez tienen más submenús. Modelan cosas que se anidan sin límite fijo.",
    theory: `### En palabras simples
Un **tipo recursivo** incluye una referencia a sí mismo en su definición. Sirve para árboles, carpetas, menús de navegación y JSON arbitrario.

### Ejemplo de la vida real
En Spotify, una playlist puede contener canciones y también otras playlists anidadas. La misma idea de 'lista' se repite dentro de sí misma.

### En código
\`\`\`typescript
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};

type JsonValue =
  | string | number | boolean | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type MenuItem = {
  label: string;
  url?: string;
  submenu?: MenuItem[];
};
\`\`\`

### Tip para la entrevista
Modelan datos jerárquicos naturales: DOM, carpetas, comentarios anidados. Menciona el límite de profundidad en validación runtime si aplica.`,
  },

  12: {
    descriptionPrefix:
      "Dos llaves parecen iguales, pero una abre tu casa y la otra tu auto: no debes intercambiarlas aunque se vean similares.",
    everydayInExplanation:
      "TypeScript trata dos números como iguales si tienen la misma forma. Los branded types ponen una 'marca invisible' para que un ID de usuario no se confunda con un ID de pedido.",
    theory: `### En palabras simples
TypeScript es **estructural**: si dos tipos tienen la misma forma, son compatibles. Los **branded types** agregan una marca (\`__brand\`) para crear tipos **nominales** que no se mezclan por accidente.

### Ejemplo de la vida real
En tu billetera guardas billetes y tickets de metro: ambos son papel rectangular, pero no pagas el bus con un ticket de concierto. La marca distingue el uso aunque la forma sea parecida.

### En código
\`\`\`typescript
type UserId = number & { readonly __brand: "UserId" };
type OrderId = number & { readonly __brand: "OrderId" };

function createUserId(id: number): UserId {
  return id as UserId;
}

function getUser(id: UserId): void {}

const uid = createUserId(42);
getUser(uid);       // OK
// getUser(42);     // Error: number no es UserId
\`\`\`

### Tip para la entrevista
Previenen bugs como pasar \`OrderId\` donde se espera \`UserId\`. La marca no existe en runtime; es solo verificación en compilación.`,
  },

  13: {
    descriptionPrefix:
      "Llenas un formulario y el supervisor revisa que todo esté bien, pero tú conservas tu letra original en cada campo.",
    everydayInExplanation:
      "\`satisfies\` verifica que tu objeto cumple las reglas sin borrar los detalles específicos. A diferencia de \`as\`, no te quita el autocompletado preciso de cada valor.",
    theory: `### En palabras simples
El operador \`satisfies\` comprueba que un valor cumple un tipo **sin ampliar** el tipo inferido. Validas la forma y conservas los literales exactos de cada propiedad.

### Ejemplo de la vida real
Entregas una lista de compras al supermercado: el empleado confirma que todo está en el catálogo (validación), pero tú sigues sabiendo que pediste 'leche deslactosada 1L' y no solo 'lácteo genérico'.

### En código
\`\`\`typescript
type Colors = Record<string, [number, number, number] | string>;

const colors1 = { red: [255, 0, 0] } as Colors;
// colors1.red es string | [number, number, number]

const colors2 = {
  red: [255, 0, 0],
  blue: "#0000ff",
} satisfies Colors;

colors2.red;  // [number, number, number]
colors2.blue; // string
\`\`\`

### Tip para la entrevista
\`satisfies\` (TS 4.9+) es mejor que \`as\` para configs: valida sin perder inferencia. Ideal para temas, rutas y paletas de colores.`,
  },

  14: {
    descriptionPrefix:
      "De una caja de chocolates sacas solo los de nuez, o quitas los que traen coco si no te gustan.",
    everydayInExplanation:
      "\`Extract\` filtra un union y se queda con lo que coincide; \`Exclude\` hace lo contrario y quita lo que no quieres. Son el colador y el imán del sistema de tipos.",
    theory: `### En palabras simples
\`Extract<Union, Filter>\` mantiene solo los miembros del union que son asignables a \`Filter\`. \`Exclude<Union, Filter>\` los remueve. Operan sobre union types como filtro y rechazo.

### Ejemplo de la vida real
En una playlist con rock, pop y jazz, 'Extract' te deja solo rock y pop; 'Exclude' te quita jazz y conserva el resto. Misma lista, distinta selección.

### En código
\`\`\`typescript
type Eventos = "click" | "hover" | "scroll" | "resize";

type MouseEvents = Extract<Eventos, "click" | "hover">;
// "click" | "hover"

type SinScroll = Exclude<Eventos, "scroll">;
// "click" | "hover" | "resize"

type Mixed = string | number | boolean;
type OnlyStrings = Extract<Mixed, string>; // string
\`\`\`

### Tip para la entrevista
Son los filter/reject del sistema de tipos. Útiles para separar eventos de mouse vs teclado, o strings vs números en unions mixtos.`,
  },

  15: {
    descriptionPrefix:
      "Con pocas piezas de lego (usuario, post, comentario) armas automáticamente todos los nombres de botones: crear, leer, borrar.",
    everydayInExplanation:
      "Los template literal types avanzados combinan texto con mapped types para generar nombres como \`getUser\` o \`deletePost\` sin escribirlos uno por uno, como un sello que imprime todas las variantes.",
    theory: `### En palabras simples
Puedes **generar strings de tipos** combinando plantillas (\`\${...}\`) con mapped types y utilidades como \`Capitalize\`. El resultado es un API con autocompletado completo.

### Ejemplo de la vida real
En un menú de restaurante, a partir de tres tamaños y tres bebidas generas todas las combinaciones válidas en la pantalla táctil: chico-café, grande-té, etc. Ninguna opción inventada.

### En código
\`\`\`typescript
type Model = "user" | "post" | "comment";

type CrudMethods = {
  [M in Model as \`get\${Capitalize<M>}\`]: (id: number) => Promise<any>;
  [M in Model as \`create\${Capitalize<M>}\`]: (data: any) => Promise<any>;
  [M in Model as \`delete\${Capitalize<M>}\`]: (id: number) => Promise<void>;
};

// getUser, getPost, getComment,
// createUser, createPost, createComment,
// deleteUser, deletePost, deleteComment
\`\`\`

### Tip para la entrevista
Patrón usado por ORMs (Prisma) y tRPC para APIs 100% type-safe. Demuestra que puedes generar contratos grandes sin perder precisión.`,
  },
};
