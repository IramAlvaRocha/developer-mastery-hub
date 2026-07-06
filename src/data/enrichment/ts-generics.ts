import type { EnrichmentMap } from "./enrich";

export const TS_GENERICS_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "Imagina una máquina expendedora que devuelve exactamente lo mismo que metes: moneda por moneda, galleta por galleta.",
    everydayInExplanation:
      "Si metes una moneda de $10, recibes $10 de cambio; si metes una galleta, te devuelven una galleta. La función identity funciona igual: acepta un tipo T y retorna ese mismo T, sin convertir nada.",
    theory: `### En palabras simples
Los generics son "variables de tipo". En vez de fijar \`string\` o \`number\`, usas \`T\` que se resuelve al llamar la función. \`function identity<T>(value: T): T\` significa: lo que entra, eso sale.

### Ejemplo de la vida real
Una caja de regalo universal en una tienda: metes lo que sea (libro, reloj, perfume) y la caja devuelve exactamente ese objeto sin cambiarlo. No importa qué sea; la regla es la misma.

### En código
\`const num = identity<number>(42)\` fija T como number; \`const str = identity('hola')\` infiere T como string automáticamente.

### Tip para la entrevista
\`identity<T>\` es el "Hello World" de generics. Si lo explicas bien, demuestras que entiendes que T es un placeholder resuelto en el punto de uso, no en la declaración.`,
  },

  2: {
    descriptionPrefix:
      "Abres una caja de chocolates y solo miras el primero: el sabor que obtienes depende de qué tipo de caja trajiste.",
    everydayInExplanation:
      "Si la caja trae bombones de menta, el primero es menta; si trae de caramelo, el primero es caramelo. La función \`first\` hace lo mismo con arreglos: el tipo del primer elemento coincide con el tipo del arreglo.",
    theory: `### En palabras simples
\`function first<T>(arr: T[]): T | undefined\` recibe un arreglo de cualquier tipo y retorna el primer elemento con ese mismo tipo, o \`undefined\` si está vacío.

### Ejemplo de la vida real
En una fila de personas en el banco, la primera persona puede ser adulto, niño o nadie si la fila está vacía. El tipo de "primero" depende de quién formó la fila.

### En código
\`first([10, 20, 30])\` infiere \`number | undefined\`; \`first(['a', 'b'])\` infiere \`string | undefined\`. \`T[]\` y \`Array<T>\` son equivalentes.

### Tip para la entrevista
Usa \`T[]\` por convención en la comunidad TypeScript. Recuerda que un arreglo vacío retorna \`undefined\`, no un error.`,
  },

  3: {
    descriptionPrefix:
      "A veces necesitas emparejar dos cosas distintas, como un nombre y una edad, en una sola tarjeta de identificación.",
    everydayInExplanation:
      "En un formulario de registro juntas tu nombre (texto) y tu edad (número) en un solo renglón. Con dos parámetros genéricos \`<T, U>\` puedes relacionar tipos diferentes en una misma función.",
    theory: `### En palabras simples
Cuando una función relaciona dos tipos distintos, declaras múltiples parámetros genéricos: \`function crearPar<T, U>(primero: T, segundo: U): [T, U]\`.

### Ejemplo de la vida real
Un ticket de cine empareja la película (texto) con el número de asiento (número). Cada pareja puede ser distinta, pero la estructura "primero + segundo" se mantiene.

### En código
\`const par = crearPar('Iram', 28)\` produce tipo \`[string, number]\`. TypeScript infiere T y U por separado a partir de los argumentos.

### Tip para la entrevista
En código complejo, nombra los genéricos descriptivamente: \`TInput\`, \`TOutput\` en vez de \`T\`, \`U\`. Facilita la lectura en funciones con lógica elaborada.`,
  },

  4: {
    descriptionPrefix:
      "No cualquier documento sirve para cruzar la aduana: debe tener al menos un número de pasaporte visible.",
    everydayInExplanation:
      "Para buscar a alguien en una lista, primero exiges que cada persona tenga ID. \`extends\` restringe T a tipos que cumplan cierta forma mínima, como tener la propiedad \`id\`.",
    theory: `### En palabras simples
\`T extends HasId\` significa: T puede ser User, Product o cualquier cosa, pero debe tener \`id: number\`. Así puedes usar \`item.id\` dentro de la función sin perder genericidad.

### Ejemplo de la vida real
En un estacionamiento solo puedes buscar vehículos que tengan placa visible. Sin placa, no entran al sistema de búsqueda aunque sean distintos modelos.

### En código
\`function getById<T extends HasId>(items: T[], id: number): T | undefined\` garantiza acceso a \`.id\` y retorna el tipo concreto (User, Product, etc.).

### Tip para la entrevista
Usa constraints para asegurar que T tiene las propiedades necesarias sin fijar un tipo concreto. Es el equilibrio entre flexibilidad y seguridad.`,
  },

  5: {
    descriptionPrefix:
      "En un archivador, solo puedes sacar carpetas que existen en ese cajón; pedir 'Carpeta XYZ' que no está falla.",
    everydayInExplanation:
      "Si tu expediente tiene campos 'nombre' y 'edad', solo puedes pedir esos dos. \`keyof T\` combinado con generics crea acceso a propiedades 100% seguro: el compilador rechaza claves inventadas.",
    theory: `### En palabras simples
\`function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]\` asegura que \`key\` sea una propiedad real de \`obj\` y que el retorno coincida con el tipo de esa propiedad.

### Ejemplo de la vida real
Un menú de restaurante con platos fijos: solo puedes ordenar lo que aparece en la carta. Pedir "platillo secreto" no es opción porque no está en la lista.

### En código
\`getProperty(user, 'name')\` retorna \`string\`; \`getProperty(user, 'xyz')\` da error de compilación porque \`'xyz'\` no es \`keyof user\`.

### Tip para la entrevista
Este patrón es la base de lodash.get, Pinia storeToRefs y muchas utilidades type-safe. Domínalo y podrás explicar acceso dinámico seguro.`,
  },

  6: {
    descriptionPrefix:
      "Un almacén genérico tiene el mismo procedimiento para guardar cualquier producto: recibir, etiquetar, buscar y retirar.",
    everydayInExplanation:
      "Ya sea que guardes libros, ropa o electrónicos, el almacén opera igual: estantería, código de barras, registro. \`Repository<T>\` define operaciones CRUD reutilizables para cualquier entidad.",
    theory: `### En palabras simples
\`interface Repository<T>\` parametriza el tipo de entidad. \`findAll()\`, \`findById()\`, \`create()\`, \`update()\` y \`delete()\` funcionan con User, Product o lo que sea, manteniendo tipos correctos.

### Ejemplo de la vida real
Un sistema de biblioteca maneja libros, revistas y DVDs con el mismo flujo: catalogar, prestar, devolver. Solo cambia qué objeto guardas, no el procedimiento.

### En código
\`findById(id): Promise<T | null>\`, \`create(item: Omit<T, 'id'>): Promise<T>\` y \`update(id, data: Partial<T>)\` combinan generics con utility types.

### Tip para la entrevista
El Repository pattern es idéntico a \`IRepository<T>\` en C#/.NET. Mencionarlo muestra que entiendes patrones de arquitectura más allá de TypeScript.`,
  },

  7: {
    descriptionPrefix:
      "Una pila de platos en la cocina: el último que pones es el primero que sacas, y solo acepta platos del mismo juego.",
    everydayInExplanation:
      "Apilas platos uno sobre otro y siempre retiras el de arriba. Una \`Stack<T>\` genérica guarda elementos del mismo tipo y controla push/pop con tipos correctos.",
    theory: `### En palabras simples
\`class Stack<T>\` parametriza el tipo de elementos internos. \`push(item: T)\` agrega; \`pop(): T | undefined\` retira el último o \`undefined\` si está vacía.

### Ejemplo de la vida real
Una torre de cajas en un almacén: apilas cajas de un mismo tipo de mercancía. Sacar la de arriba devuelve exactamente lo que guardaste, no otra cosa.

### En código
\`const stack = new Stack<number>()\`; \`stack.push(1)\` OK; \`stack.push('hola')\` error. \`pop()\` retorna \`number | undefined\`.

### Tip para la entrevista
Las clases genéricas son comunes para contenedores: \`Stack<T>\`, \`Queue<T>\`, \`LinkedList<T>\`. Conócelas como ejemplos de estado parametrizado.`,
  },

  8: {
    descriptionPrefix:
      "Cuando no especificas el sabor de un helado, te dan vainilla por defecto; pero puedes pedir otro si quieres.",
    everydayInExplanation:
      "Si no dices qué bebida quieres en un combo, te sirven agua. Los default type parameters (\`T = unknown\`) funcionan igual: si no especificas T, usa el valor por defecto.",
    theory: `### En palabras simples
\`interface ApiResponse<T = unknown>\` permite omitir T al usar la interfaz. Sin especificar, \`data\` es \`unknown\`; con \`ApiResponse<User[]>\`, \`data\` es \`User[]\`.

### Ejemplo de la vida real
Un formulario con campo "idioma" que por defecto dice "español" pero puedes cambiarlo a inglés. El default reduce fricción cuando la mayoría usa la opción común.

### En código
\`const raw: ApiResponse = { data: {}, ... }\` → data es unknown. \`const typed: ApiResponse<User[]> = { data: [...] }\` → data tipado.

### Tip para la entrevista
Los default types reducen verbosidad cuando hay un tipo "común". Úsalos en interfaces reutilizables como respuestas de API o configuraciones.`,
  },

  9: {
    descriptionPrefix:
      "En un filtro de aduana, si el paquete es líquido va por un carril; si es sólido, por otro. La ruta depende del contenido.",
    everydayInExplanation:
      "Una máquina que pregunta '¿es texto?' y responde sí o no según lo que reciba. Los conditional types con generics adaptan su resultado al tipo de entrada: \`T extends string ? 'sí' : 'no'\`.",
    theory: `### En palabras simples
Los conditional types evalúan una condición sobre tipos: \`T extends U ? X : Y\`. Combinados con generics, crean utilidades que cambian según el tipo recibido.

### Ejemplo de la vida real
Un buzón inteligente: cartas van al casillero de papel, paquetes al de cajas. La decisión depende de qué tipo de envío detecta, no de una regla fija para todos.

### En código
\`type IsString<T> = T extends string ? 'sí' : 'no'\`. \`DeepAwaited<T>\` desenvuelve Promises anidadas recursivamente con \`infer\`.

### Tip para la entrevista
Este patrón es la base de Extract, Exclude, NonNullable y muchos utility types. Entenderlo te permite leer tipos avanzados de librerías.`,
  },

  10: {
    descriptionPrefix:
      "Recorres cada cajón del clóset y decides si lo marcas como 'puede estar vacío' o no, uno por uno.",
    everydayInExplanation:
      "Revisas cada compartimento de una mochila y anotas que todos pueden quedar sin contenido. Los mapped types genéricos transforman cada propiedad de un tipo, como hacer todo nullable.",
    theory: `### En palabras simples
\`type Nullable<T> = { [K in keyof T]: T[K] | null }\` recorre cada clave de T y añade \`| null\` a su tipo. Es un mapped type parametrizado con generics.

### Ejemplo de la vida real
Un inventario donde cada producto puede tener stock o estar agotado (null). Aplicas la misma regla "puede faltar" a todos los artículos de la lista.

### En código
\`type NullableUser = Nullable<User>\` produce \`{ name: string | null; age: number | null }\`.

### Tip para la entrevista
Entender mapped types genéricos te permite crear utilidades de dominio como \`Validatable<T>\`, \`Editable<T>\`, etc., sin depender solo de los built-in.`,
  },

  11: {
    descriptionPrefix:
      "Un regalo envuelto en papel de regalo: puedes envolver cualquier cosa y luego desenvolverla para ver qué había dentro.",
    everydayInExplanation:
      "Metes un juguete en una caja con moño (Promise) y luego abres la caja para sacar el juguete. \`Promisify<T>\` envuelve; \`Unpromise<T>\` desenvuelve usando \`infer\`.",
    theory: `### En palabras simples
\`type Promisify<T> = Promise<T>\` envuelve un tipo en Promise. \`type Unpromise<T> = T extends Promise<infer U> ? U : T\` extrae el tipo interno si es Promise, o retorna T tal cual.

### Ejemplo de la vida real
Un paquete dentro de otro paquete de mensajería: abres la caja externa y encuentras otra caja, o directamente el producto. Desenvolver recursivamente llega al contenido real.

### En código
\`Unpromise<Promise<string>>\` → \`string\`. \`Unpromise<number>\` → \`number\` (no es Promise, no cambia).

### Tip para la entrevista
Este patrón lo usan Vue (\`UnwrapRef<T>\`), React (\`setState<T>\`) y librerías de estado. \`infer\` en conditionals es clave para extraer tipos.`,
  },

  12: {
    descriptionPrefix:
      "Para entrar a una zona restringida necesitas credencial Y uniforme: debes cumplir ambos requisitos a la vez.",
    everydayInExplanation:
      "Un empleado que guarda datos debe saber convertirse a texto para el log Y a JSON para guardar. \`T extends Serializable & Loggable\` exige que T cumpla múltiples contratos simultáneamente.",
    theory: `### En palabras simples
Múltiples constraints con intersección: \`T extends A & B\` significa que T debe implementar ambas interfaces. Puedes llamar métodos de A y de B con seguridad.

### Ejemplo de la vida real
Para manejar un vehículo de reparto necesitas licencia de conducir Y certificado de manejo de carga. Sin ambos, no puedes hacer el trabajo completo.

### En código
\`function guardarYLog<T extends Serializable & Loggable>(item: T)\` puede usar \`item.toString()\` y \`item.toJSON()\` sin error.

### Tip para la entrevista
Múltiples constraints con \`&\` aseguran que T cumple todos los contratos necesarios. Útil cuando una función necesita capacidades de varias interfaces.`,
  },

  13: {
    descriptionPrefix:
      "Una fábrica que puede crear cualquier producto siempre que le des el molde correcto para fabricarlo.",
    everydayInExplanation:
      "Das instrucciones de cómo construir algo ('algo que se pueda instanciar con new') y la fábrica te entrega la pieza. \`{ new(): T }\` es la firma de constructor que permite crear instancias sin conocer el tipo concreto.",
    theory: `### En palabras simples
\`function crearInstancia<T>(Clase: { new(): T }): T\` recibe un constructor y retorna una instancia de T. El constraint \`{ new(): T }\` significa "algo invocable con \`new\` que devuelve T".

### Ejemplo de la vida real
Una panadería con moldes intercambiables: cambias el molde (clase) y obtienes galletas, pan o pasteles, pero siempre usando el mismo procedimiento de horneado.

### En código
\`const logger = crearInstancia(Logger)\` → tipo \`Logger\`. \`logger.log('Hola')\` funciona con autocompletado.

### Tip para la entrevista
El constraint \`{ new(): T }\` es el constructor signature. Es la base de factory patterns y dependency injection tipados.`,
  },

  14: {
    descriptionPrefix:
      "Un servicio de mensajería que reintenta la entrega si falla la primera vez, sin importar qué paquete transporta.",
    everydayInExplanation:
      "Si el cartero no encuentra a nadie en casa, vuelve al día siguiente hasta agotar intentos. \`withRetry\` envuelve cualquier función async y reintenta si falla, preservando el tipo de retorno.",
    theory: `### En palabras simples
\`function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T>\` ejecuta una función async y, si falla, reintenta hasta agotar intentos. T se mantiene en todo el flujo.

### Ejemplo de la vida real
Llamar por teléfono cuando la línea está ocupada: cuelgas, esperas y vuelves a marcar. El objetivo (hablar con alguien) no cambia aunque reintentes.

### En código
\`const data = await withRetry(() => fetchUsers(), 3)\` → \`data\` tiene el tipo que retorna \`fetchUsers()\`, no \`unknown\`.

### Tip para la entrevista
Los HOF genéricos son el patrón más poderoso de TS: base de middleware, decorators y wrappers. Demuestran dominio de composición type-safe.`,
  },

  15: {
    descriptionPrefix:
      "Construyes un formulario paso a paso: cada campo que añades va quedando registrado y el formulario 'crece' contigo.",
    everydayInExplanation:
      "Como armar un perfil en una app: primero nombre, luego edad, y el sistema sabe qué campos ya llenaste. Un type builder acumula propiedades con method chaining tipado.",
    theory: `### En palabras simples
\`SchemaBuilder<T>\` empieza con un tipo vacío \`{}\` y cada \`.field(name, defaultVal)\` expande T con \`T & Record<K, V>\`. Al final, \`.build()\` retorna el tipo acumulado.

### Ejemplo de la vida real
Un cuestionario que va agregando preguntas: cada respuesta nueva define un campo más. Al terminar, tienes el formulario completo con todos los campos que fuiste añadiendo.

### En código
\`new SchemaBuilder().field('name', '').field('age', 0).build()\` → \`{ name: string; age: number }\`.

### Tip para la entrevista
Este patrón avanzado se usa en query builders (Prisma), Zod schemas y configuradores type-safe. Muestra generics acumulativos y method chaining tipado.`,
  },
};
