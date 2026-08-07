import type { Exercise } from "@/lib/types";

export const CLEAN_CODE_EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "¿Qué es la Deuda Técnica y el Tiempo es Dinero?",
    stars: 1,
    category: "DEUDA",
    description: "La deuda técnica es la falta de calidad en el código que repercute en costos futuros. Entenderla a tiempo separa a un programador normal de uno que sabe lo que hace.",
    objective: "Definir deuda técnica y sus costos",
    tags: ["deuda técnica", "tiempo", "costo"],
    fileName: "deuda-tecnica.ts",
    completed: false,
    theory:
      "La **deuda técnica** es la falta de calidad en el código que escribimos, y suele repercutir en **costos futuros**. Esos costos son tiempo que invertimos en:\n\n- Mantenimientos.\n- Refactorizar el código.\n- Comprender código propio o ajeno.\n- Transferir el conocimiento a otras personas.\n\nDe ahí el dicho *\"el tiempo es dinero\"*: cada hora perdida por mal código es dinero. Caer en deuda técnica es normal e inevitable; lo que diferencia al buen programador es **estar consciente de ella y preocuparse por pagarla**.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como una tarjeta de crédito. Al principio pagas poco (código rápido), pero si no la pagas, los intereses crecen y terminas debiendo más tiempo del que ahorraste.\n\nEl Clean Code se escribe **para que otra persona, o tú mismo en el futuro, lo entienda**. La computadora es el tercero que menos importa: el objetivo es que el código se lea como un libro bien escrito.",
    codeSnippet: "// Afirmaciones sobre la deuda técnica y sus costos",
    inputs: {},
    completeCode: "La deuda técnica es falta de calidad que genera costos futuros: mantenimiento, refactorización, comprensión y transferencia.",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de qué es la deuda técnica y por qué cuesta dinero.",
      statements: [
        { id: "a", text: "La deuda técnica es la falta de calidad en el código que suele repercutir en costos futuros.", answer: true, explanation: "Es la definición del instructor: falta de calidad que se traduce en tiempo (y por tanto dinero) para mantener, refactorizar, comprender y transferir." },
        { id: "b", text: "La deuda técnica solo cuesta dinero si el cliente la nota; el tiempo de los desarrolladores no importa.", answer: false, explanation: "'El tiempo es dinero': el mantenimiento, la refactorización y la comprensión del código consumen horas pagadas, las note o no el cliente." },
        { id: "c", text: "El dicho 'el tiempo es dinero' aplica porque la refactorización y el mantenimiento consumen horas de trabajo.", answer: true, explanation: "Los 4 costos (mantenimiento, refactorización, comprensión y transferencia) son tiempo invertido, y el tiempo del equipo cuesta dinero." },
        { id: "d", text: "La deuda técnica se paga refactorizando el código sin alterar su comportamiento.", answer: true, explanation: "La palabra clave es refactorización: mejorar el código para que sea más entendible y tolerante a cambios, sin cambiar qué hace." },
      ],
    },
  },
  {
    id: 2,
    title: "Los 4 Cuadrantes de la Deuda Técnica",
    stars: 3,
    category: "DEUDA",
    description: "La deuda técnica se clasifica en 4 cuadrantes según si es imprudente o prudente y si es deliberada o inadvertida. Conocerlos te ayuda a detectar en cuál estás cayendo.",
    objective: "Clasificar los 4 cuadrantes de la deuda",
    tags: ["cuadrantes", "imprudente", "prudente"],
    fileName: "cuadrantes-deuda.ts",
    completed: false,
    theory:
      "Los 4 cuadrantes de la deuda técnica combinan dos ejes:\n\n| | Deliberada | Inadvertida |\n|---|---|---|\n| **Imprudente** | Copiar y pegar por falta de tiempo | Desconocimiento o falso senior |\n| **Prudente** | Asumirla con un TODO para luego | Descubrir mala arquitectura al avanzar |\n\nLa más peligrosa es la **imprudente e inadvertida**: ni siquiera sabes que la estás generando. La **prudente y deliberada** es asumirla conscientemente, pero si no se paga a tiempo, llegan los intereses.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como pedir un préstamo. Imprudente es gastarlo sin saber si puedes pagarlo (copia y pega). Prudente es pedirlo con un plan de pago claro (un TODO en el código). Inadvertido es no darte cuenta de que ya lo pediste.\n\nLa clave del instructor: *\"lo que diferencia a un programador normal de uno que sabe lo que hace, es estar consciente de su deuda técnica y preocuparse por pagarla\"*.",
    codeSnippet: "// Empareja cada cuadrante de la deuda técnica con su descripción",
    inputs: {},
    completeCode: "Imprudente+deliberada = copia y pega | Imprudente+inadvertida = desconocimiento | Prudente+deliberada = TODO asumido | Prudente+inadvertida = arquitectura que maduró tarde",
    format: "matching",
    matching: {
      prompt: "Conecta cada cuadrante con la frase o situación que lo representa.",
      definitions: [
        "Actúa consciente e imprudente: 'No hay tiempo, solo copia y pega eso, terminemos como sea'.",
        "Se genera por desconocimiento o falta de experiencia; típica de un junior o un falso senior.",
        "Sabemos que la deuda existe y la asumimos: 'Ponle un TODO y lo arreglamos en la próxima versión'.",
        "No tenías el conocimiento total al iniciar y descubres que la arquitectura no era la ideal cuando el proyecto maduró.",
      ],
      pairs: [
        { id: "imp-del", term: "Imprudente y deliberada", definition: "Actúa consciente e imprudente: 'No hay tiempo, solo copia y pega eso, terminemos como sea'." },
        { id: "imp-inv", term: "Imprudente e inadvertida", definition: "Se genera por desconocimiento o falta de experiencia; típica de un junior o un falso senior." },
        { id: "pru-del", term: "Prudente y deliberada", definition: "Sabemos que la deuda existe y la asumimos: 'Ponle un TODO y lo arreglamos en la próxima versión'." },
        { id: "pru-inv", term: "Prudente e inadvertida", definition: "No tenías el conocimiento total al iniciar y descubres que la arquitectura no era la ideal cuando el proyecto maduró." },
      ],
    },
  },
  {
    id: 3,
    title: "Costos de la Deuda: Tiempo y Dinero",
    stars: 2,
    category: "DEUDA",
    description: "La deuda técnica se paga con tiempo en 4 frentes: mantenimiento, refactorización, comprensión y transferencia del conocimiento.",
    objective: "Identificar los 4 costos de la deuda",
    tags: ["mantenimiento", "refactorización", "transferencia"],
    fileName: "costos-deuda.ts",
    completed: false,
    instruction: "Completa los 4 costos de la deuda técnica eligiendo la palabra correcta.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como heredar una casa con tuberías mal instaladas. Pagas con tiempo al arreglarla (mantenimiento), al rehacer un tramo (refactorización), al entender cómo está conectada (comprensión) y al explicársela a un nuevo inquilino (transferencia).\n\nLa mala calidad del software siempre la acaba pagando alguien: el cliente, el proveedor o el propio desarrollador, programando sobre un sistema frágil.",
    codeSnippet:
`// Completa los 4 costos de la deuda técnica
// Tiempo en el [INPUT_1] del software
// Tiempo en la [INPUT_2] de código existente
// Tiempo en la [INPUT_3] de código ajeno o propio
// Tiempo en la [INPUT_4] del conocimiento a otras personas`,
    inputs: { INPUT_1: "mantenimiento", INPUT_2: "refactorización", INPUT_3: "comprensión", INPUT_4: "transferencia" },
    completeCode: "Los 4 costos: mantenimiento, refactorización, comprensión y transferencia del conocimiento.",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Elige la palabra que corresponde a cada costo de la deuda técnica.",
      options: {
        INPUT_1: ["mantenimiento", "comprensión", "transferencia"],
        INPUT_2: ["refactorización", "mantenimiento", "comprensión"],
        INPUT_3: ["comprensión", "transferencia", "refactorización"],
        INPUT_4: ["transferencia", "mantenimiento", "comprensión"],
      },
    },
  },
  {
    id: 4,
    title: "Refactorización: Mejorar sin Cambiar Comportamiento",
    stars: 2,
    category: "DEUDA",
    description: "La refactorización es el proceso de mejorar el código sin alterar su comportamiento, para que sea más entendible y tolerante a cambios.",
    objective: "Reconocer qué es refactorizar",
    tags: ["refactorización", "comportamiento", "pruebas"],
    fileName: "refactorizacion.ts",
    completed: false,
    instruction: "Elige el cambio que califica como una refactorización.",
    theory:
      "**Refactorizar** es mejorar el código **sin alterar su comportamiento** para que sea más entendible y tolerante a cambios.\n\nPara refactorizar fuerte es **imprescindible tener pruebas automáticas**: sin ellas no hay manera de saber que la refactorización funcionó. El miedo a *\"si funciona, mejor no lo toques\"* nace precisamente de no tener una red de seguridad.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como reorganizar la cocina sin cambiar la receta. El platillo sale igual, pero cocinar ahora es más rápido y ordenado. Si cambias el platillo, ya no es refactorizar: es agregar una funcionalidad.\n\nRefactorizar sin pruebas automáticas es como mover los muebles en la oscuridad: tal vez quedó mejor, pero no puedes asegurarlo.",
    codeSnippet: "// ¿Cuál de los siguientes cambios es una refactorización?",
    inputs: {},
    completeCode: "Renombrar a calculateTotal y extraer el cálculo del impuesto, sin cambiar el resultado.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál de estos cambios es una refactorización (no agrega comportamiento nuevo)?",
      snippets: [
        {
          id: "feature",
          label: "Opción A",
          description: "Agrega el cálculo del impuesto que antes no existía: cambia el resultado.",
          code: `function total(price: number, qty: number): number {
  return price * qty + price * qty * 0.16; // impuesto nuevo
}`,
        },
        {
          id: "refactor",
          label: "Opción B",
          description: "Extrae el cálculo del impuesto a una función privada y renombra: el resultado no cambia.",
          code: `function calculateTotal(price: number, qty: number): number {
  return price * qty + calculateTax(price * qty);
}

function calculateTax(amount: number): number {
  return amount * 0.16;
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 5,
    title: "Nombres Pronunciables y Expresivos",
    stars: 1,
    category: "NOMBRES",
    description: "Los nombres deben estar en inglés, ser pronunciables y expresivos. Nunca ahorres caracteres: numberOfUnits, tax y birthDate dicen más que n, tx y ddmmyyyy.",
    objective: "Renombrar variables con nombres expresivos",
    tags: ["nombres", "pronunciable", "expresivo"],
    fileName: "01-names.ts",
    completed: false,
    instruction: "Elige el nombre expresivo correcto para cada variable.",
    theory:
      "Reglas de los nombres:\n\n- Siempre en **inglés**.\n- **Pronunciables**: si no puedes decirlo en una conversación, mal nombre.\n- **Expresivos**: no ahorres caracteres. `n` no dice nada; `numberOfUnits` dice cuántas unidades hay.\n- Variables en **lowerCamelCase**, clases e interfaces en **UpperCamelCase**.\n\nLos bundlers y minificadores se encargan de acortar los nombres en producción: tú escríbelos claros.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como etiquetar cajas en la mudanza. Una caja con `n` no te dice nada; una con `numberOfUnits` te dice exactamente qué hay dentro. `tx` podría ser impuesto o transferencia; `tax` es inequívoco.\n\nSi tienes que leer un comentario para entender qué guarda una variable, esa variable necesita un mejor nombre. Los nombres expresivos hacen que el código se explique solo.",
    codeSnippet:
`// ❌ MAL -> ✅ BIEN (elige el nombre correcto)
const [INPUT_1] = 53;                 // antes: n
const [INPUT_2] = 0.15;               // antes: tx
const [INPUT_3] = new Date(1996, 0);  // antes: ddmmyyyy`,
    inputs: { INPUT_1: "numberOfUnits", INPUT_2: "tax", INPUT_3: "birthDate" },
    completeCode: "const numberOfUnits = 53;\nconst tax = 0.15;\nconst birthDate = new Date(1996, 0);",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "El mejor nombre es expresivo y pronuncia sin ambigüedad.",
      options: {
        INPUT_1: ["numberOfUnits", "n", "units"],
        INPUT_2: ["tax", "tx", "t"],
        INPUT_3: ["birthDate", "ddmmyyyy", "fecha"],
      },
    },
  },
  {
    id: 6,
    title: "Evita Sufijos Técnicos: User, no UserInterface",
    stars: 2,
    category: "NOMBRES",
    description: "No incluyas información técnica de la implementación en los nombres: Interface, Abstract, Mixin o Impl sobran porque ya están en la declaración.",
    objective: "Nombrar sin repetir el tipo técnico",
    tags: ["sufijos", "interface", "abstract"],
    fileName: "sufijos-tecnicos.ts",
    completed: false,
    instruction: "Elige el mejor nombre para esta interfaz.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como escribir 'cocina de cocinar' o 'silla para sentarse'. La palabra 'cocina' ya implica que se cocina: repetirlo no aporta nada y ensucia la lectura.\n\n`interface UserInterface` dice 'User' dos veces: la declaración `interface` ya lo convierte en interfaz. Lo mismo con `AbstractUser` en una clase abstracta o `UserImpl`: la implementación se sabe al leer la declaración.",
    codeSnippet: "// ¿Cuál es el mejor nombre para esta interfaz de un usuario?",
    inputs: {},
    completeCode: "interface User { id: number; name: string; }",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué nombre evita repetir la información técnica de la implementación?",
      snippets: [
        {
          id: "con-sufijo",
          label: "Opción A",
          description: "Repite el tipo técnico: ya se sabe que es una interfaz por la declaración.",
          code: `interface UserInterface {
  id: number;
  name: string;
}`,
        },
        {
          id: "limpio",
          label: "Opción B",
          description: "El nombre dice qué representa el tipo, sin repetir la palabra Interface.",
          code: `interface User {
  id: number;
  name: string;
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 7,
    title: "Código Críptico: fs, f, d y dir",
    stars: 2,
    category: "NOMBRES",
    description: "Los nombres de una sola letra como fs, f, d o dir obligan a leer comentarios para entender qué significan. Es señal de malas prácticas del Clean Code.",
    objective: "Detectar nombres crípticos",
    tags: ["nombres", "críptico", "refactor"],
    fileName: "refactor-names.ts",
    completed: false,
    instruction: "Lee el snippet y elige el problema de Clean Code que contiene.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un letrero de 'zona de estacionamiento' escrito solo con una 'Z'. La computadora lo entiende, pero cualquier humano necesita adivinar qué significa.\n\nSiguiendo al instructor: `f` en un arreglo de archivos debería llamarse `file` o `fileToEvaluate`, la bandera `f.f` debería ser `flagged`, `fs` debería ser `filesToEvaluate` y `d` algo como `elapsedDays`. Si necesitas un comentario para explicar la siguiente línea, la línea necesita un mejor nombre.",
    codeSnippet:
`const fs = ['a.txt', 'b.txt', 'c.txt'];
const f = fs.filter(f => f.f);
const d = 23;
const dir = '/src';`,
    inputs: {},
    completeCode: "const filesToEvaluate = [...];\nconst toDelete = filesToEvaluate.filter(file => file.flagged);\nconst elapsedDays = 23;\nconst sourceDirectory = '/src';",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué problema de Clean Code contiene este snippet?",
      snippet:
`const fs = ['a.txt', 'b.txt', 'c.txt'];
const f = fs.filter(f => f.f);
const d = 23;
const dir = '/src';`,
      options: [
        "Nombres crípticos e ilegibles: fs, f, d y dir no dicen qué contienen ni qué representan sin leer comentarios.",
        "Hay una inyección SQL en el filtrado del arreglo.",
        "La variable f tiene un error de tipado: TypeScript no permite filtrar booleans así.",
        "El arreglo fs debería ser un objeto inmutable para evitar mutaciones.",
      ],
      correct: 0,
    },
  },
  {
    id: 8,
    title: "Arrays en Plural: fruitNames, no fruit",
    stars: 1,
    category: "TIPOS",
    description: "Los arreglos se nombran en plural. Pero si contienen nombres (strings), lo mejor es frutas no fruit: fruitNames dice exactamente qué guarda el arreglo.",
    objective: "Pluralizar nombres de arreglos",
    tags: ["arrays", "plural", "expresivo"],
    fileName: "arrays-plural.ts",
    completed: false,
    instruction: "Elige el mejor nombre para este arreglo de nombres de frutas.",
    theory:
      "Para arreglos, la mejor práctica es **pluralizar**: `fruits`, `users`, `orders`.\n\nSin embargo, lo más expresivo describe **qué contiene cada elemento**:\n\n- `fruitNames` para `['manzana', 'plátano', 'fresa']`.\n- `fruits` o `fruitList` si guardas instancias de una clase `Fruit`.\n- `fruit` (singular) hace pensar que hay una sola fruta.",
    explanationText:
      "🌍 Ejemplo cotidiano: es la diferencia entre decir 'tengo fruta' (una pieza) y 'tengo frutas' (varias). Ahora, si son nombres escritos en etiquetas, lo más preciso es 'etiquetas de frutas': fruitNames.\n\n`fruit = true` tampoco tiene sentido: un arreglo (o un booleano) llamado como un sustantivo singular confunde al lector.",
    codeSnippet: `// Elige el nombre correcto para este arreglo
const [INPUT_1] = ['manzana', 'plátano', 'fresa'];`,
    inputs: { INPUT_1: "fruitNames" },
    completeCode: "const fruitNames: string[] = ['manzana', 'plátano', 'fresa'];",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "El mejor nombre pluraliza Y describe qué contiene cada elemento.",
      options: {
        INPUT_1: ["fruitNames", "fruit", "fruitList"],
      },
    },
  },
  {
    id: 9,
    title: "Booleanos con is, has, can y en Positivo",
    stars: 1,
    category: "TIPOS",
    description: "Los booleanos ganan sentido con prefijos is, has o can. Además, su significado debe ser positivo: isEmpty en vez de notEmpty, hasValues en vez de noValues.",
    objective: "Nombrar booleanos con prefijos y positivo",
    tags: ["booleanos", "is", "has", "positivo"],
    fileName: "booleans.ts",
    completed: false,
    instruction: "Elige el mejor nombre para cada variable booleana (el valor también se ajusta).",
    explanationText:
      "🌍 Ejemplo cotidiano: es como preguntar en recepción '¿la puerta está abierta?' (isOpen) en vez de '¿no-cerrada?' (una negación que obliga a pensar dos veces).\n\n`open` no dice qué está abierto; `isOpen` lo dice. `notEmpty = true` obliga a pensar: '¿significa que está lleno?'. La versión positiva es `isEmpty = false`. Si tienes que dedicarle neuronas a leer una variable, es un mal nombre.",
    codeSnippet:
`// ❌ MAL -> ✅ BIEN (elige el nombre correcto)
const [INPUT_1] = true;   // antes: open
const [INPUT_2] = true;   // antes: write
const [INPUT_3] = false;  // antes: notEmpty
const [INPUT_4] = true;   // antes: active`,
    inputs: { INPUT_1: "isOpen", INPUT_2: "canWrite", INPUT_3: "isEmpty", INPUT_4: "isActive" },
    completeCode: "const isOpen = true;\nconst canWrite = true;\nconst isEmpty = false; // inversión de notEmpty = true\nconst isActive = true;",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Usa is/has/can y mantén el significado en positivo.",
      options: {
        INPUT_1: ["isOpen", "open", "opened"],
        INPUT_2: ["canWrite", "write", "writable"],
        INPUT_3: ["isEmpty", "notEmpty", "hasEmpty"],
        INPUT_4: ["isActive", "active", "act"],
      },
    },
  },
  {
    id: 10,
    title: "Contadores: maxFruits y totalOfCars",
    stars: 2,
    category: "TIPOS",
    description: "Para variables numéricas usa palabras como min, max, total o la partícula 'of' para especificar qué mide el número.",
    objective: "Nombrar contadores con min, max, total",
    tags: ["números", "max", "total", "contador"],
    fileName: "contadores.ts",
    completed: false,
    instruction: "Renombra cada número para que diga exactamente qué representa.",
    theory:
      "Los números admiten términos que los hacen específicos:\n\n- `maxFruits`: cantidad máxima de frutas permitidas.\n- `minAge`: edad mínima.\n- `totalOfCars`: total de carros.\n- `elapsedDays`, `numberOfFiles`: contadores con contexto.\n\n`fruits = 3` es ambiguo: ¿hay 3 frutas? ¿3 es el máximo? Con `maxFruits = 3` ya no hay que adivinar.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como un rótulo en un estacionamiento. '10' no dice nada; 'Capacidad máxima: 10 carros' lo dice todo. La partícula 'of' es el 'de': total de carros, máximo de frutas.\n\nUn contador mal nombrado obliga a leer el contexto completo del código para saber qué representa el número.",
    codeSnippet:
`// Renombra cada número para que diga qué representa
const [INPUT_1] = 3;  // cantidad máxima de frutas permitidas
const [INPUT_2] = 10; // total de carros en el inventario`,
    inputs: {
      INPUT_1: ["maxFruits", "maxNumberOfFruits", "maxQuantityOfFruits"],
      INPUT_2: ["totalOfCars", "totalCars", "carTotal"],
    },
    completeCode: "const maxFruits = 3;\nconst totalOfCars = 10;",
  },
  {
    id: 11,
    title: "Nombres de Clases: Evita Manager, Data e Info",
    stars: 3,
    category: "CLASES",
    description: "El nombre de la clase es lo más importante de la misma. Un nombre genérico como Manager o Data invita a asignarle demasiadas responsabilidades.",
    objective: "Nombrar clases específicas y cortas",
    tags: ["clases", "genérico", "UpperCamelCase"],
    fileName: "clases.ts",
    completed: false,
    instruction: "Elige el mejor nombre para esta clase.",
    theory:
      "Reglas para nombrar clases:\n\n- Formadas por un **sustantivo o frase de sustantivo**: `InvoiceService`, `ShippingCalculator`.\n- **UpperCamelCase**: cada palabra inicia con mayúscula.\n- Evita nombres **genéricos**: `Manager`, `Data`, `Info`, `Individual`, `Processor`. Atraen demasiadas responsabilidades y son difíciles de mantener.\n- Más palabras **no** significa mejor nombre: `SpecialViewingCaseMonsterManagerEventsHandleActivitySingleton` es ilegible.\n\nEl curso lo conecta con el principio de responsabilidad única: si la Clase se llama `Casa`, *'vamos a meter ahí el cuarto, la lavandería, el patio, la cochera... y tres carros'*. Un nombre genérico hace que la Clase **termine heredando demasiado trabajo de manera involuntaria**, y cada adición genera deuda técnica: es difícil de mantener, probar y expandir.\n\nPregúntate: ¿qué hace exactamente la clase? ¿cómo realiza la tarea? ¿hay algo específico de su uso?",
    explanationText:
      "🌍 Ejemplo cotidiano: es como el título de un cargo. 'Manager' no dice qué maneja; 'GestorDeFacturas' (InvoiceService) lo dice todo. Un cargo demasiado amplio termina con todos haciendo todo.\n\nUn nombre genérico es un imán de responsabilidades: la clase crece, se vuelve difícil de mantener y de actualizar. Eso es exactamente lo que el Clean Code intenta evitar, y por eso una clase bien nombrada tiene una responsabilidad específica y bien clara.",
    codeSnippet: "// ¿Cuál es el mejor nombre para esta clase?",
    inputs: {},
    completeCode: "class InvoiceService { ... }",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué nombre de clase es específico, corto y en UpperCamelCase?",
      snippets: [
        {
          id: "generico",
          label: "Opción A",
          description: "Demasiado genérico: no dice qué gestiona y acumulará responsabilidades.",
          code: `class Manager { ... }`,
        },
        {
          id: "gigante",
          label: "Opción B",
          description: "Nombre gigante que mezcla demasiadas responsabilidades en un mismo saco.",
          code: `class SpecialViewingCaseMonsterManagerEventsHandleActivitySingleton { ... }`,
        },
        {
          id: "especifica",
          label: "Opción C",
          description: "Sustantivo específico en UpperCamelCase: maneja una sola responsabilidad.",
          code: `class InvoiceService { ... }`,
        },
      ],
      correct: 2,
    },
  },
  {
    id: 12,
    title: "Clases: Sustantivo, UpperCamelCase y Cortas",
    stars: 2,
    category: "CLASES",
    description: "Valida las reglas para nombrar clases: sustantivos, nombres específicos, UpperCamelCase y evitar nombres kilométricos.",
    objective: "Reforzar las reglas de nombres de clases",
    tags: ["clases", "sustantivo", "reglas"],
    fileName: "reglas-clases.ts",
    completed: false,
    theory:
      "Detrás del nombre de las clases está el principio de responsabilidad única: **una Clase debe tener una responsabilidad específica y bien clara**. Si pones nombres genéricos, la Clase 'termina heredando demasiado trabajo de manera involuntaria'.\n\nLo mismo que con las funciones: cada elemento debe hacer una tarea y hacerla bien, y los métodos de una Clase deben estar **estrechamente relacionados con el nombre** de la misma. Un buen nombre es la primera barrera contra el objeto Dios.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como nombrar una carpeta en tu computadora. 'Cosas' no sirve; 'Facturas-2026' dice exactamente qué contiene. Un nombre claro evita abrir la carpeta para adivinar.\n\nSi algo no tiene sentido, se puede remover o refactorizar en el peor de los casos: esa regla se aplica a los nombres de las clases también.",
    codeSnippet: "// Afirmaciones sobre el nombre de las clases",
    inputs: {},
    completeCode: "Sustantivo + UpperCamelCase + específico + corto = buen nombre de clase.",
    format: "true-false",
    trueFalse: {
      prompt: "Valida las reglas para nombrar clases según el instructor.",
      statements: [
        { id: "a", text: "Los nombres de las clases deben ser sustantivos o frases de sustantivo.", answer: true, explanation: "InvoiceService, ShippingCalculator: el nombre dice qué es la clase, no cómo se implementa." },
        { id: "b", text: "Un nombre genérico como Data hace que la clase reciba demasiadas responsabilidades.", answer: true, explanation: "Los nombres genéricos invitan a asignar más trabajo del debido: difíciles de mantener y actualizar." },
        { id: "c", text: "Cuanto más largo y detallado sea el nombre de una clase, mejor y más específica es.", answer: false, explanation: "Más palabras no significa mejor: SpecialViewingCaseMonsterManagerEvents... es ilegible y mezcla responsabilidades." },
        { id: "d", text: "Las clases deben nombrarse con UpperCamelCase: cada palabra con la primera letra en mayúscula.", answer: true, explanation: "Es la convención para clases e interfaces, mientras que las variables usan lowerCamelCase." },
      ],
    },
  },
  {
    id: 13,
    title: "El Nombre Debe Decir lo que la Función Hace",
    stars: 3,
    category: "FUNCIONES",
    description: "Escribimos código limpio cuando cada función hace exactamente lo que su nombre indica. Una sendEmail que crea usuarios es un anti-patrón.",
    objective: "Detectar funciones que no cumplen su nombre",
    tags: ["funciones", "nombres", "SRP"],
    fileName: "send-email.ts",
    completed: false,
    instruction: "Lee el snippet y elige el problema de Clean Code.",
    theory:
      "Las funciones deben representar **acciones**: un **verbo** que representa la acción seguido de un **sustantivo**.\n\n- `sendEmail(toWhom)` envía un correo.\n- `createUser(...)` crea un usuario.\n- `updateUser(...)` actualiza un usuario.\n\nEvita nombres que anticipan lógica interna como `sendEmailIfFieldsValid`: la función puede decidir sola si las validaciones pasan. El nombre debe decir qué hace, no cómo lo decide.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como un empleado cuyo puesto dice 'Cajero' pero que además firma contratos y audita finanzas. Su nombre de puesto promete una cosa y su trabajo real es otro.\n\nEn el ejemplo del instructor, `sendEmail` verificaba si el usuario existe, revisaba contraseñas y creaba usuarios en la base de datos: no enviaba ningún correo. La función trabajaba como un login. Si el nombre no coincide con lo que hace, es deuda técnica.",
    codeSnippet:
`function sendEmail(): boolean {
  verificarSiUsuarioExiste();
  revisarContrasena();
  crearUsuarioEnBD();
  return true;
}`,
    inputs: {},
    completeCode: "function createUser(...) { ... } // el nombre debe coincidir con lo que hace",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué problema de Clean Code tiene esta función?",
      snippet:
`function sendEmail(): boolean {
  verificarSiUsuarioExiste();
  revisarContrasena();
  crearUsuarioEnBD();
  return true;
}`,
      options: [
        "La función no hace lo que su nombre indica: sendEmail verifica usuarios, contraseñas y crea registros, pero nunca envía un correo.",
        "La función envía el correo pero olvida adjuntar el asunto del mensaje.",
        "sendEmail debería retornar el correo como string en lugar de un booleano.",
        "El problema es que usa nombres en otro idioma en las funciones internas.",
      ],
      correct: 0,
    },
  },
  {
    id: 14,
    title: "Máximo 3 Argumentos: Options Object",
    stars: 3,
    category: "FUNCIONES",
    description: "No hay límite de parámetros, pero se recomienda máximo 3. Cuando necesitas más, agrupa los argumentos en un objeto de opciones y desestructúralo.",
    objective: "Refactorizar a un options object",
    tags: ["funciones", "argumentos", "desestructuración"],
    fileName: "03-functions.ts",
    completed: false,
    instruction: "Ordena los pasos para refactorizar sendEmail a un objeto de opciones.",
    theory:
      "Al definir la función hablamos de **parámetros**; al llamarla, de **argumentos**.\n\nCon más de 3 argumentos posicionales, la firma se agolpa y es incómoda: `sendEmail(toWhom, from, body, subject, apiKey)`. Además, para enviar solo `apiKey` te obliga a pasar todos los anteriores.\n\nLa solución es un **options object** con desestructuración:\n\n```ts\ninterface SendEmailOptions { to: string; from: string; body: string; subject: string; apiKey: string; }\n\nfunction sendEmail(options: SendEmailOptions): boolean {\n  const { to, from, body, subject, apiKey } = options;\n  // ...\n}\n```\n\nTambién se recomienda ordenar las propiedades alfabéticamente.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como pedir una pizza. Llamar con 5 datos sueltos ('extra grande, pepperoni, sin queso, para Juan, urgente') es confuso; llenar una ficha de pedido (un objeto) es claro y permite omitir campos.\n\nUn objeto de opciones hace la firma más corta, más fácil de leer y de mantener, y evita el desorden de argumentos posicionales.",
    codeSnippet: "// Ordena los pasos de la refactorización a options object",
    inputs: {},
    completeCode: "1) interface SendEmailOptions 2) firma con options 3) desestructurar 4) llamar con objeto",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para convertir 5 parámetros posicionales en un objeto de opciones.",
      steps: [
        { id: "a", label: "Crear la interface SendEmailOptions con las propiedades del envío." },
        { id: "b", label: "Cambiar la firma de sendEmail para recibir un único parámetro de tipo SendEmailOptions." },
        { id: "c", label: "Desestructurar el objeto de opciones al inicio de la función." },
        { id: "d", label: "Actualizar la llamada para pasar un objeto con to, from, body, subject y apiKey." },
      ],
      correctOrder: ["a", "b", "c", "d"],
    },
  },
  {
    id: 15,
    title: "Refactor sin Cambiar Comportamiento: getPayAmount",
    stars: 3,
    category: "FUNCIONES",
    description: "Una función con muchos if-else se puede resumir con returns tempranos y un ternario, sin cambiar su resultado. Es refactorización pura.",
    objective: "Predecir el resultado de una función refactorizada",
    tags: ["funciones", "ternario", "early return"],
    fileName: "pay-amount.ts",
    completed: false,
    explanationText:
      "🌍 Ejemplo cotidiano: es como un instructivo con 4 cajas de decisión encadenadas que se reduce a 'si muerto: esto; si separado: esto; si retirado: esto; si no: esto'. La respuesta final es idéntica, pero leerla ahora toma un segundo.\n\nEl refactor reemplaza el `else` por returns tempranos (si la persona está muerta, ya no hay nada más que hacer) y convierte el último if/else en un ternario: un 'if corto'.",
    codeSnippet:
`function getPayAmount(isDead: boolean, isSeparated: boolean, isRetired: boolean): number {
  if (isDead) return 1500;
  if (isSeparated) return 2500;
  return isRetired ? 3000 : 4000;
}

getPayAmount(false, false, true);`,
    inputs: {},
    completeCode: "getPayAmount(false, false, true) -> 3000",
    format: "prediction",
    prediction: {
      prompt: "La refactorización no cambia el comportamiento. ¿Qué retorna la llamada?",
      snippet:
`function getPayAmount(isDead: boolean, isSeparated: boolean, isRetired: boolean): number {
  if (isDead) return 1500;
  if (isSeparated) return 2500;
  return isRetired ? 3000 : 4000;
}

getPayAmount(false, false, true);`,
      options: ["3000", "4000", "1500", "2500"],
      answer: "3000",
    },
  },
  {
    id: 16,
    title: "DRY: Don't Repeat Yourself",
    stars: 1,
    category: "DRY",
    description: "DRY (Don't Repeat Yourself) es el principio de evitar la duplicidad de código. Copiar y pegar es la señal más clara de que conviene refactorizar.",
    objective: "Entender el principio DRY",
    tags: ["DRY", "duplicidad", "centralizar"],
    fileName: "05-dry.ts",
    completed: false,
    instruction: "Completa las frases sobre el principio DRY.",
    theory:
      "**DRY = Don't Repeat Yourself** (no te repitas). Es el principio de **evitar duplicidad** en el código.\n\nLa duplicidad lleva a: tener **dos o más lugares que mantener** para el mismo código, y complica las pruebas (es más fácil probar una única función que copias iguales repartidas).\n\nDRY **simplifica las pruebas** y **centraliza los procesos**, haciéndolos más fáciles de mantener. En el momento en que copias y pegas código de otro lugar, significa que deberías refactorizarlo para no repetirlo.\n\nEl curso distingue dos tipos de duplicidad:\n\n- **Duplicidad real**: el código es idéntico y cumple la misma función. Un cambio obliga a actualizar **todas** las copias en los mismos puntos: riesgo de error humano ('hice el cambio pero no funciona, será otra copia') y pruebas duplicadas innecesarias.\n- **Duplicidad accidental**: el código luce similar pero cumple tareas distintas. Si un cambio solo afecta a un lugar y los demás quedan intactos, quizá merezca la pena centralizarlo con parámetros, pero no siempre.\n\nRegla del curso: cuando notes que estás **copiando y pegando**, es señal de que puedes refactorizar.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como tener dos hojas de cálculo con los mismos datos. Corriges una y la otra queda desactualizada: los números ya no cuadran. Con una sola hoja (centralizada), un cambio se propaga solo.\n\nDRY no es ciencia: en cuanto detectas copy-paste, refactoriza. Aplicar DRY usualmente lleva a una refactorización del código.",
    codeSnippet:
`// DRY significa Don't [INPUT_1] Yourself
// La [INPUT_2] de código obliga a mantener varias copias iguales
// DRY [INPUT_3] las pruebas: es más fácil probar una única función
// Copiar y pegar es señal de que conviene [INPUT_4] el código`,
    inputs: { INPUT_1: "Repeat", INPUT_2: "duplicidad", INPUT_3: "simplifica", INPUT_4: "refactorizar" },
    completeCode: "DRY = Don't Repeat Yourself | la duplicidad complica | simplifica pruebas | copy-paste = refactorizar",
  },
  {
    id: 17,
    title: "DRY Aplicado: Centraliza la Validación",
    stars: 3,
    category: "DRY",
    description: "Cuando cada método repite las mismas validaciones de campos, es momento de centralizarlas en un método único y reutilizable.",
    objective: "Refactorizar validaciones duplicadas",
    tags: ["DRY", "validación", "centralizar"],
    fileName: "product-dry.ts",
    completed: false,
    instruction: "Elige la implementación que evita la duplicidad.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como un médico que repite el mismo chequeo en cada consulta en vez de tener un protocolo único. Al centralizar, solo se actualiza el protocolo una vez y todas las consultas se benefician.\n\nEn el ejemplo del instructor, el `toString()` repetía la validación de cada propiedad. La solución fue extraer un método `isProductReady()` que recorre las propiedades con `typeof` y centraliza la lógica: así el `toString` solo imprime y la validación se reutiliza en cualquier otro método.",
    codeSnippet: "// ¿Cuál implementación evita duplicar las validaciones?",
    inputs: {},
    completeCode: "isProductReady(): boolean { for (const key in this) { switch (typeof this[key]) { ... } } return true; }",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué implementación aplica DRY al validar los campos del producto?",
      snippets: [
        {
          id: "duplicada",
          label: "Opción A",
          description: "Repite la validación campo a campo dentro de toString.",
          code: `toString(): string {
  if (this.name.length <= 0) throw new Error('name is empty');
  if (this.price <= 0) throw new Error('price is zero');
  if (this.size.length <= 0) throw new Error('size is empty');
  return \`\${this.name} (\${this.price}) \${this.size}\`;
}`,
        },
        {
          id: "centralizada",
          label: "Opción B",
          description: "Centraliza la validación en un método único reutilizable por toString y cualquier otro método.",
          code: `isProductReady(): boolean {
  for (const key in this) {
    const value = this[key] as unknown;
    if (typeof value === 'string' && value.length <= 0) throw new Error(key + ' is empty');
    if (typeof value === 'number' && value <= 0) throw new Error(key + ' is zero');
  }
  return true;
}

toString(): string {
  if (!this.isProductReady()) return '';
  return \`\${this.name} (\${this.price}) \${this.size}\`;
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 18,
    title: "Herencia: La Cadena de Extends y el Martirio del Super",
    stars: 4,
    category: "HERENCIA",
    description: "Las cadenas de extends (UserSettings extends User extends Person) arrastran todos los parámetros por cada super y mezclan responsabilidades. El curso prioriza la composición frente a la herencia.",
    objective: "Elegir el diseño que evita la herencia excesiva",
    tags: ["herencia", "super", "composición"],
    fileName: "herencia-problema.ts",
    completed: false,
    instruction: "Elige la versión que evita la cadena de super y mantiene clases con una sola responsabilidad.",
    theory:
      "**¿Por qué la herencia excesiva es un problema?** Los `extends` añaden una capa extra de complejidad: cada clase hija debe cumplir todo lo que pide el constructor del padre. En el curso, `UserSettings extends User extends Person` obligaba a pasar `workingDirectory`, `lastOpenFolder`, `email`, `role`, `name`, `gender` y `birthdate` por una cadena de `super` — *'se está haciendo un martirio'*.\n\nProblemas concretos:\n\n- Es **difícil de mantener en memoria**: vienes de UserSettings, que extiende de User, que extiende de Person. Como un árbol genealógico de 'tatarabuelo de mi bisabuelo'.\n- Es **difícil de leer**: alguien nuevo debe navegar clase por clase para entender qué datos existen.\n- **Aplicar SRP en herencia es casi imposible**: cada clase debería hacer una tarea independiente, y las cadenas mezclan responsabilidades.\n\nLa solución del curso: **priorizar la composición frente a la herencia**. A menos de que sea estrictamente necesario, hay que evitar los `extends` y componer clases por propiedades.",
    explanationText:
      "🌍 Ejemplo cotidiano: es intentar armar tu árbol genealógico 'del tatarabuelo de tu bisabuelo'. Funciona, pero cualquiera que te escuche se pierde. Igual con las clases: leer `UserSettings` te obliga a navegar a `User` y de ahí a `Person` para saber qué datos tiene.\n\nEn la versión con composición, `UserSettings` ya no extiende a nadie: tiene propiedades `person`, `user` y `settings`. Cada pieza hace una cosa (responsabilidad única) y no hay ninguna cadena de `super` que arrastrar.",
    codeSnippet: "// ¿Cuál diseño evita la cadena de super y prioriza la composición?",
    inputs: {},
    completeCode: "La composición: UserSettings contiene instancias de Person, User y Settings como propiedades, sin extends ni super.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué diseño prioriza la composición frente a la herencia?",
      snippets: [
        {
          id: "herencia",
          label: "Opción A",
          description: "Cada nueva clase hereda de la anterior y arrastra todos los parámetros por la cadena de super.",
          code: `class Person {
  constructor(public name: string, public gender: Gender, public birthdate: Date) {}
}

class User extends Person {
  constructor(name: string, gender: Gender, birthdate: Date, public email: string, public role: string) {
    super(name, gender, birthdate);
  }
}

class UserSettings extends User {
  constructor(name: string, gender: Gender, birthdate: Date, email: string, role: string, public workingDirectory: string) {
    super(name, gender, birthdate, email, role);
  }
}`,
        },
        {
          id: "composicion",
          label: "Opción B",
          description: "Cada clase hace una sola cosa y UserSettings compone las demás por propiedades.",
          code: `class Person {
  constructor(public name: string, public gender: Gender, public birthdate: Date) {}
}

class User {
  constructor(public email: string, public role: string, public lastAccess: Date = new Date()) {}
}

class Settings {
  constructor(public workingDirectory: string, public lastOpenFolder: string) {}
}

class UserSettings {
  constructor(public person: Person, public user: User, public settings: Settings) {}
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 19,
    title: "Objetos como Propiedades: La Composición de UserSettings",
    stars: 3,
    category: "PROPS",
    description: "Refactorizar para mandar objetos (PersonProps, UserProps) al constructor y componer clases que tienen otras clases como propiedades anidadas.",
    objective: "Conectar cada propiedad-objeto con los datos que guarda",
    tags: ["props", "composición", "objetos anidados"],
    fileName: "objetos-propiedades.ts",
    completed: false,
    instruction: "Empareja cada propiedad-objeto de UserSettings con lo que guarda.",
    theory:
      "En el curso, la clase `Person` se refactorizó para recibir un **objeto** en el constructor y desestructurarlo:\n\n```ts\ninterface PersonProps { name: string; gender: Gender; birthdate: Date; }\n\nclass Person {\n  public name: string;\n  public gender: Gender;\n  public birthdate: Date;\n\n  constructor({ name, gender, birthdate }: PersonProps) {\n    this.name = name;\n    this.gender = gender;\n    this.birthdate = birthdate;\n  }\n}\n```\n\nVentajas: no importa el **orden** de las propiedades (al desestructurar un objeto, da igual en qué posición vengan) y si mañana hay más campos, la interfaz los absorbe. Luego, al priorizar la composición, `UserSettings` pasó a tener **objetos como propiedades**: `person`, `user` y `settings`, cada uno con su propia responsabilidad.\n\nSi quiero saber quién es el usuario: `userSettings.user`. La persona: `userSettings.person`. La configuración: `userSettings.settings`.",
    explanationText:
      "🌍 Ejemplo cotidiano: es llenar una ficha con campos en vez de gritar datos en un orden fijo. Si la ficha pide nombre, género y fecha, da igual en qué orden los escribas: al procesarla se leen por etiqueta.\n\nY una vez que `UserSettings` compone objetos, es como una mochila con compartimentos: `person` guarda los datos de la persona, `user` los del usuario y `settings` los de configuración. Cada compartimento se abre solo y no están todos los datos revueltos en la raíz del objeto.",
    codeSnippet: `// Empareja cada propiedad-objeto de UserSettings con los datos que guarda`,
    inputs: {},
    completeCode: "person → name/gender/birthdate | user → email/role/lastAccess | settings → workingDirectory/lastOpenFolder",
    format: "matching",
    matching: {
      prompt: "En la composición del curso, conecta cada propiedad-objeto con los datos que contiene.",
      pairs: [
        { id: "person", term: "userSettings.person", definition: "Los datos de la persona: name, gender y birthdate (tipo Person)." },
        { id: "user", term: "userSettings.user", definition: "Los datos del usuario: email, role y lastAccess (tipo User)." },
        { id: "settings", term: "userSettings.settings", definition: "La configuración: workingDirectory y lastOpenFolder (tipo Settings)." },
      ],
      definitions: [
        "Los datos de la persona: name, gender y birthdate (tipo Person).",
        "Los datos del usuario: email, role y lastAccess (tipo User).",
        "La configuración: workingDirectory y lastOpenFolder (tipo Settings).",
      ],
    },
  },
  {
    id: 20,
    title: "Estructura Recomendada de una Clase",
    stars: 2,
    category: "CLASE",
    description: "Todo el equipo debería crear las Clases de la misma manera: propiedades, constructores, métodos y getters/setters en un orden estándar.",
    objective: "Ordenar los miembros de una clase según la estructura recomendada",
    tags: ["clases", "estructura", "estándar"],
    fileName: "estructura-clase.ts",
    completed: false,
    instruction: "Ordena los miembros de la clase según la estructura recomendada del curso.",
    theory:
      "Frase del curso: *'El buen código parece estar escrito por alguien a quien le importa'*. Para que todo el equipo cree Clases igual, se recomienda un orden estándar de sus miembros:\n\n1. **Propiedades**: primero las estáticas, luego las públicas y por último las privadas.\n2. **Constructores**: los estáticos (los que regresan una nueva instancia), después el constructor normal y, por último, el privado.\n3. **Métodos estáticos**.\n4. **Métodos privados**.\n5. **Métodos de instancia**, ordenados de mayor a menor importancia.\n6. **Getters y setters** al final.\n\nLa idea: si todos los desarrolladores crean Clases con la misma estructura, cualquiera sabe **dónde encontrar cada elemento** sin buscar. (El punto de los métodos de instancia queda abierto a las costumbres del equipo, pero el esqueleto se mantiene.)",
    explanationText:
      "🌍 Ejemplo cotidiano: es una biblioteca donde cada sección tiene su lugar fijo. Si los libros de historia siempre están a la izquierda y los de ciencia a la derecha, cualquier lector nuevo encuentra lo que busca sin preguntar.\n\nEn el código pasa igual: si todas las Clases declaran primero propiedades, luego constructores y al final métodos, un miembro nuevo del equipo sabe exactamente dónde mirar, y las revisiones de código y el autoformateo se vuelven más rápidos.",
    codeSnippet: "// Ordena los miembros de una clase según la estructura recomendada",
    inputs: {},
    completeCode: "1) Propiedades estáticas/públicas/privadas 2) Constructores estáticos/normal/privado 3) Métodos estáticos 4) Métodos privados 5) Métodos de instancia por importancia 6) Getters y setters",
    format: "ordering",
    ordering: {
      prompt: "¿En qué orden se recomienda declarar los miembros de una clase?",
      steps: [
        { id: "a", label: "Propiedades: primero estáticas, luego públicas y por último privadas." },
        { id: "b", label: "Constructores: los estáticos, después el normal y por último el privado." },
        { id: "c", label: "Métodos estáticos." },
        { id: "d", label: "Métodos privados." },
        { id: "e", label: "Métodos de instancia, ordenados de mayor a menor importancia." },
        { id: "f", label: "Getters y setters al final." },
      ],
      correctOrder: ["a", "b", "c", "d", "e", "f"],
    },
  },
  {
    id: 21,
    title: "Comentarios: El Código Debe Explicarse Solo",
    stars: 3,
    category: "COMENTARIOS",
    description: "Si necesitas un comentario para explicar la siguiente línea, la línea necesita un mejor nombre. Los comentarios son la excepción, no la regla.",
    objective: "Detectar un comentario inútil",
    tags: ["comentarios", "autoexplicativo", "por qué"],
    fileName: "comentarios.ts",
    completed: false,
    instruction: "Lee el snippet y elige el problema de Clean Code.",
    theory:
      "El curso es tajante: **cuando necesites añadir comentarios a tu código, es porque no es lo suficientemente autoexplicativo**, y eso significa que no estamos escogiendo buenos nombres. El ejemplo tonto del propio curso:\n\n```ts\nconst name = 'John Doe';\n// Si el nombre es John Doe, ejecutar la condición\nif (name === 'John Doe') { /* ... */ }\n```\n\n- **No comentes el código mal escrito: hay que reescribirlo**.\n- Comenta el **'por qué'** decidiste resolver algo de cierta manera (a sabiendas de que existen otras opciones), no el **'qué'** ni el **'cómo'**: el 'cómo' es el propio código y el 'qué' debería ser obvio con buenos nombres.\n- **Excepciones**: librerías de terceros, APIs y frameworks donde a veces es imposible evitar un comentario explicativo — pero es la excepción, no la regla.",
    explanationText:
      "🌍 Ejemplo cotidiano: es pegarle una etiqueta a una puerta que ya dice 'Entrada'. La etiqueta sobra: la puerta ya se explica sola. Si de verdad necesitas la etiqueta, es porque la puerta no está bien diseñada.\n\nEn el snippet, el comentario repite exactamente lo que dice el `if`: aporta cero. Si la condición fuera difícil de leer, el arreglo es un mejor nombre (por ejemplo `isAdminSession`), no un comentario que la traduzca.",
    codeSnippet: `const name = 'John Doe';
// Si el nombre es John Doe, se inicia la sesión
if (name === 'John Doe') {
  startSession();
}`,
    inputs: {},
    completeCode: "El comentario es inútil: el if ya es autoexplicativo. Hace falta un mejor nombre, no un comentario. Comenta el 'por qué', no el 'qué'.",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué problema de Clean Code tiene este snippet?",
      snippet: `const name = 'John Doe';
// Si el nombre es John Doe, se inicia la sesión
if (name === 'John Doe') {
  startSession();
}`,
      options: [
        "El comentario es inútil: repite la condición. El if ya es autoexplicativo; hace falta un mejor nombre, no un comentario.",
        "startSession() no existe y rompe el programa.",
        "El comentario debería estar escrito en inglés.",
        "La variable name debería ser const o let según el linter.",
      ],
      correct: 0,
    },
  },
  {
    id: 22,
    title: "Uniformidad: Problemas Similares, Soluciones Similares",
    stars: 2,
    category: "UNIFORMIDAD",
    description: "Si para productos usas createProduct/updateProduct, para usuarios debes usar createUser/updateUser. La uniformidad también aplica a directorios e indentación.",
    objective: "Elegir los nombres uniformes con el resto del proyecto",
    tags: ["uniformidad", "nombres", "consistencia"],
    fileName: "uniformidad.ts",
    completed: false,
    instruction: "Elige el conjunto de funciones uniforme con las operaciones de producto.",
    theory:
      "El lema del curso: **'Problemas similares, soluciones similares'**. No tiene nada de secreto: si ya tienes `createProduct`, `updateProduct` y `deleteProduct` para la entidad Producto, para la nueva entidad Usuario deberías usar `createUser`, `updateUser` y `deleteUser` — no `createNewUser`, `modifyUser`, `removeUser`.\n\nNo es que vaya a dejar de funcionar: es que rompe la uniformidad y obliga a aprender varios dialectos para lo mismo. La uniformidad también aplica a:\n\n- **Estructura de directorios**: si `product-list` vive en su carpeta, `product-item` también debería tener la suya, para mantener el mismo estándar.\n- **Indentación**: respetar el estándar de la organización y del lenguaje, de modo que con solo ver el código se distinga a qué bloque pertenece.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un equipo donde unos dicen 'iniciar sesión', otros 'logearse' y otros 'entrar'. Todos se entienden, pero cada persona aprende tres formas de decir lo mismo. Un solo término estandarizado evita fricción.\n\nEn el código pasa igual: si `updateProduct` ya existe, escribir `modifyUser` para la misma operación hace que quien lea el proyecto tenga que recordar dos verbos distintos para el mismo concepto. Mantén un solo dialecto en todo el proyecto.",
    codeSnippet: "// ¿Qué conjunto de funciones es uniforme con createProduct/updateProduct/deleteProduct?",
    inputs: {},
    completeCode: "createUser / updateUser / deleteUser: mismas operaciones, mismos verbos que las de producto.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "El proyecto ya usa createProduct, updateProduct y deleteProduct. ¿Qué nombres son uniformes para la entidad Usuario?",
      snippets: [
        {
          id: "no-uniforme",
          label: "Opción A",
          description: "Cambia los verbos para la misma operación: createNewUser, modifyUser, removeUser.",
          code: `function createNewUser(data: UserData) { /* ... */ }
function modifyUser(id: number, data: UserData) { /* ... */ }
function removeUser(id: number) { /* ... */ }`,
        },
        {
          id: "uniforme",
          label: "Opción B",
          description: "Reutiliza los mismos verbos del resto del proyecto: create, update, delete.",
          code: `function createUser(data: UserData) { /* ... */ }
function updateUser(id: number, data: UserData) { /* ... */ }
function deleteUser(id: number) { /* ... */ }`,
        },
      ],
      correct: 1,
    },
  },
];
