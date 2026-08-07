import type { Exercise } from "@/lib/types";

export const SOLID_EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "Acrónimo STUPID: Los 6 Code Smells",
    stars: 1,
    category: "STUPID",
    description: "STUPID agrupa los 6 code smells más comunes en el software: Singleton, Tight Coupling, Untestability, Premature Optimization, Indescriptive Naming y Duplication.",
    objective: "Completar el acrónimo STUPID con sus 6 smells",
    tags: ["STUPID", "code smells", "acrónimo"],
    fileName: "stupid.ts",
    completed: false,
    instruction: "Completa cada letra del acrónimo con el code smell que le corresponde.",
    theory:
      "**STUPID** es un acrónimo, no una ofensa: agrupa 6 code smells (antipatrones) que debemos evitar. Un *code smell* es un **posible indicio de que algo no está del todo bien** en nuestro código y que probablemente necesita una refactorización.\n\n- **S**ingleton: única instancia global, difícil de probar y de rastrear.\n- **T**ight Coupling: alto acoplamiento, clases que dependen de demasiadas cosas concretas.\n- **U**ntestability: código difícil de probar con **unit tests** (no es que no funcione: es que es difícil probarlo).\n- **P**remature Optimization: optimizar antes de medir, sacrificando claridad.\n- **I**ndescriptive Naming: nombres que no describen qué representan.\n- **D**uplication: copiar y pegar en vez de centralizar (no aplicar DRY).\n\nEl curso lo deja claro: *\"como que huele feo, como que algo no huele bien en nuestro código\"* — y cuando lo detectes, la clave es **refactorizar**. Conocer lo que NO hay que hacer es el paso previo; resolver estos olores es lo que logran los principios SOLID de la siguiente sección.",
    explanationText:
      "🌍 Ejemplo cotidiano: cuando abres una caja que lleva tiempo guardada y notas que 'huele mal', sabes que algo no está bien aunque no sepas qué es. Un code smell es exactamente eso: el código 'huele feo', y huele así porque probablemente hay que refactorizarlo.\n\nCada letra de STUPID es una lente distinta para inspeccionar el mismo código. El valor es que los olores son *predecibles*: aparecen en casi todos los proyectos reales. Detectarlos a tiempo es más barato que refactorizarlos cuando ya son deuda técnica, y por eso el curso primero los enseña y luego muestra cómo los resuelven los principios SOLID.",
    codeSnippet: "// Completa el acrónimo con cada code smell\nS = [INPUT_1]\nT = [INPUT_2]\nU = [INPUT_3]\nP = [INPUT_4]\nI = [INPUT_5]\nD = [INPUT_6]",
    inputs: {
      INPUT_1: "Singleton",
      INPUT_2: "Tight Coupling",
      INPUT_3: "Untestability",
      INPUT_4: "Premature Optimization",
      INPUT_5: "Indescriptive Naming",
      INPUT_6: "Duplication",
    },
    completeCode: "S = Singleton | T = Tight Coupling | U = Untestability | P = Premature Optimization | I = Indescriptive Naming | D = Duplication",
  },
  {
    id: 2,
    title: "Singleton: Instancia Única y Problemas de Pruebas",
    stars: 2,
    category: "STUPID",
    description: "El Singleton garantiza una única instancia, pero es un code smell: introduce estado global, esconde dependencias y complica las pruebas.",
    objective: "Predecir qué devuelve un Singleton y por qué es un smell",
    tags: ["Singleton", "estado global", "untestability"],
    fileName: "singleton.ts",
    completed: false,
    instruction: "Analiza el patrón y predice el resultado de la comparación.",
    theory:
      "El **Singleton** garantiza que una clase tenga una única instancia mediante un constructor privado y un punto de acceso estático. Su único punto a favor: una única instancia en toda la aplicación.\n\n¿Por qué es un code smell? El curso lo reduce a **dos problemas principales**:\n\n1. **Difícil de testear**: vive en el contexto global y no hay una manera limpia de resetear su estado entre pruebas; dos unit tests pueden contaminarse.\n2. **No es rastreable**: puede ser modificado por cualquiera y en cualquier punto de la aplicación, así que no tienes una manera controlada de saber de dónde provienen los cambios.\n\nEl propio instructor reconoce haberlo usado en proyectos reales: *\"es la solución más rápida que se le viene a uno a la cabeza\"*, pero hay que tratar de evitarlo. Para tener una sola instancia sin los problemas de prueba, se prefiere **inyectar la instancia** (por ejemplo un objeto de configuración creado una vez en el arranque de la app) en lugar de usar el patrón Singleton.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como un único enchufe en una oficina donde todos los equipos están conectados. Es práctico, pero cuando alguien lo desconecta para probar su laptop, toda la oficina se queda sin luz.\n\nCon un Singleton compartes el mismo 'enchufe' entre toda la app: probar una parte puede tumbar el estado de las demás, y como cualquiera puede manipularlo, no sabes quién encendió o apagó la luz.",
    codeSnippet: `class Configuracion {
  private static instancia: Configuracion;
  private constructor() {}

  static getInstancia(): Configuracion {
    if (!Configuracion.instancia) {
      Configuracion.instancia = new Configuracion();
    }
    return Configuracion.instancia;
  }
}

const a = Configuracion.getInstancia();
const b = Configuracion.getInstancia();
// ¿Qué retorna la comparación a === b?`,
    inputs: {},
    completeCode: "a === b → true: el Singleton devuelve siempre la misma instancia. Ese estado compartido es lo que complica las pruebas.",
    format: "prediction",
    prediction: {
      prompt: "El constructor es privado y el método estático solo crea la instancia la primera vez.",
      snippet: `class Configuracion {
  private static instancia: Configuracion;
  private constructor() {}

  static getInstancia(): Configuracion {
    if (!Configuracion.instancia) {
      Configuracion.instancia = new Configuracion();
    }
    return Configuracion.instancia;
  }
}

const a = Configuracion.getInstancia();
const b = Configuracion.getInstancia();
// ¿Qué retorna a === b?`,
      options: [
        "true: ambas referencias apuntan a la misma instancia",
        "false: cada llamada crea una instancia nueva",
        "Un error de compilación: el constructor privado impide llamar a getInstancia",
        "undefined: no hay instancia creada todavía",
      ],
      answer: "true: ambas referencias apuntan a la misma instancia",
    },
  },
  {
    id: 3,
    title: "Alta Cohesión y Bajo Acoplamiento",
    stars: 3,
    category: "COHESION",
    description: "El objetivo de un buen diseño es bajo acoplamiento (depender de pocas cosas) y alta cohesión (una clase hace una sola cosa bien). El objeto Dios viola ambos.",
    objective: "Distinguir un diseño con alta cohesión y bajo acoplamiento",
    tags: ["cohesión", "acoplamiento", "objeto dios"],
    fileName: "cohesion.ts",
    completed: false,
    instruction: "Elige el diseño que mantiene alta cohesión y bajo acoplamiento.",
    theory:
      "**Acoplamiento** mide cuán relacionadas o dependientes son dos Clases o módulos entre sí. **Cohesión** mide cuán relacionadas están las responsabilidades dentro de una misma Clase: qué tan enfocada está en lo que debe hacer.\n\n- **Alto acoplamiento** → un cambio en un módulo genera un **efecto dominó u ondas de agua** que afecta a muchos otros; ensamblar los módulos requiere más esfuerzo y un módulo es difícil de reutilizar o probar solo.\n- **Baja cohesión** → la Clase hace una gran cantidad de acciones y no se enfoca en lo que debe hacer (una clase `Usuario` que envía correos y calcula impuestos).\n- **Alta cohesión** → la Clase se enfoca solo en lo relacionado con su intención: con la clase `Auth`, solo autenticación, y se sabe por el nombre.\n\nEl objetivo de todo buen diseño: **bajo acoplamiento y alta cohesión**, con componentes *autocontenidos, autosuficientes e independientes con un objetivo y propósito bien definido*. El ejemplo del curso lo demuestra con `Person` → `User` → `UserSettings`: al separar `name` en `firstName`/`lastName`, la herencia provoca una avalancha de cambios; con bajo acoplamiento y composición solo se toca un lugar.",
    explanationText:
      "🌍 Ejemplo cotidiano: es una fila de fichas de dominó. Si las fichas están pegadas (alto acoplamiento), al mover la primera caen todas; si están separadas con un canal bien definido entre ellas (bajo acoplamiento), mueves una y las demás siguen en pie.\n\nEn el ejercicio del curso, cambiar `name` por `firstName` + `lastName` en la clase `Person` arrastraba a `User` (por el `super`) y a `UserSettings`. Además, los argumentos posicionales del constructor obligaban a recordar el orden exacto; desestructurando un objeto de props, el orden da igual. Una clase `EmailService` que solo envía correos (alta cohesión) y recibe un `Mailer` inyectado (bajo acoplamiento) es mucho más fácil de probar y mantener que un 'objeto Dios' que valida pedidos, lee de la BD y además envía correos.",
    codeSnippet: "// ¿Cuál clase hace una sola cosa bien y depende de pocas cosas?",
    inputs: {},
    completeCode: "EmailService: solo envía correos (alta cohesión) y recibe el Mailer inyectado (bajo acoplamiento).",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué clase respeta alta cohesión y bajo acoplamiento?",
      snippets: [
        {
          id: "dios",
          label: "Opción A",
          description: "Objeto Dios: valida, consulta la base de datos y envía correos desde la misma clase.",
          code: `class OrderService {
  validateOrder(order: Order) { /* reglas de negocio */ }
  async loadOrder(id: number): Promise<Order> {
    return db.query('SELECT * FROM orders WHERE id = $1', [id]);
  }
  sendConfirmation(order: Order) {
    smtp.send({ to: order.email, subject: 'Confirmación' });
  }
}`,
        },
        {
          id: "limpio",
          label: "Opción B",
          description: "Una sola responsabilidad y la dependencia se inyecta en lugar de crearse dentro.",
          code: `class EmailService {
  constructor(private mailer: Mailer) {}

  sendOrderConfirmation(order: Order) {
    return this.mailer.send({
      to: order.email,
      subject: 'Confirmación de pedido',
    });
  }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 4,
    title: "Detecta Smells: Optimización Prematura y Nombres Pobres",
    stars: 3,
    category: "STUPID",
    description: "Optimizar antes de medir y nombrar mal son dos smells del acrónimo STUPID. Código que parece 'ingenioso' pero que nadie puede mantener.",
    objective: "Detectar optimización prematura y nombres indescriptivos",
    tags: ["premature", "nombres", "optimización"],
    fileName: "premature.ts",
    completed: false,
    instruction: "Lee el snippet y elige qué smells contiene.",
    theory:
      "La **optimización prematura** es escribir código 'más eficiente' sin haber medido que existe un cuello de botella. El curso recomienda **retrasar la toma de decisiones**: mantener abiertas las opciones y darle prioridad a lo que realmente importa, que son las reglas de negocio. No se trata de escribir código mal optimizado, sino de **no anticiparse a los requisitos** creando abstracciones innecesarias.\n\nAquí entra una distinción clave:\n\n- **Complejidad esencial**: inherente al problema, siempre estará ahí.\n- **Complejidad accidental**: la que añadimos al implementar una solución compleja a la mínima necesaria ('no voy a implementar el patrón Redux solo para sumar dos números'). Hay que encontrar el balance.\n\nEl **naming indescriptivo** es nombrar sin comunicar: `t`, `s`, `m`, `p`. También hay que buscar el balance: nombres demasiado específicos se vuelven larguísimos y difíciles de leer, y nombres demasiado genéricos hacen que la Clase asuma demasiadas tareas.\n\nMétrica informal del curso: el **'WTF por minuto'** — cuántas veces quien lee tu código dice '¿qué diablos es esto?'. Primero código claro y correcto; luego mide, y solo entonces optimiza lo que de verdad importa.",
    explanationText:
      "🌍 Ejemplo cotidiano: es comprar una impresora industrial porque 'una vez vi 1000 hojas que imprimir', cuando con la impresora doméstica alcanzaba. Optimizaste para un problema que todavía no tenías: eso es complejidad accidental.\n\nEn el snippet, `(n << 2) | 3` es 'ingenioso' pero críptico: `n * 4 + 3` hace lo mismo y se lee solo. Y `t`, `s`, `m`, `p` no dicen nada: el lector va a soltar más de un '¿qué diablos es esto?' por minuto. La aritmética de bits no aporta nada salvo que hayas medido que ese cálculo es tu cuello de botella.",
    codeSnippet: `const t = [1, 2, 3, 4, 5];
const s = t
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .reduce((acc, v) => acc + v, 0);
const m = Date.now();
const p = (n: number) => (n << 2) | 3;`,
    inputs: {},
    completeCode: "Optimización prematura ((n << 2) | 3 en vez de n * 4 + 3) y nombres indescriptivos (t, s, m, p).",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué smells del acrónimo STUPID contiene este snippet?",
      snippet: `const t = [1, 2, 3, 4, 5];
const s = t
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .reduce((acc, v) => acc + v, 0);
const m = Date.now();
const p = (n: number) => (n << 2) | 3;`,
      options: [
        "Optimización prematura (aritmética de bits ilegible) y nombres indescriptivos (t, s, m, p).",
        "Untestability: esta función es imposible de probar sin una conexión real.",
        "Duplication: el mismo cálculo se repite en tres métodos distintos.",
        "Tight Coupling: la función depende de varias librerías externas.",
      ],
      correct: 0,
    },
  },
  {
    id: 5,
    title: "SRP: ¿Cuántas Razones Tiene esta Clase para Cambiar?",
    stars: 2,
    category: "SRP",
    description: "Una clase debe tener una sola razón para cambiar. Si mezcla persistencia, negocio y presentación, cada cambio en cualquiera de esas capas la obliga a modificarse.",
    objective: "Contar las razones de cambio de una clase",
    tags: ["SRP", "razón de cambio", "responsabilidad"],
    fileName: "srp.ts",
    completed: false,
    instruction: "Analiza el snippet y elige la respuesta correcta.",
    theory:
      "**SRP (Single Responsibility Principle)**: *\"Nunca debería haber más de un motivo por el cual cambiar una Clase.\"* Una Clase (o módulo) debe tener una única responsabilidad.\n\nDetalle clave del instructor: **tener una única responsabilidad NO es sinónimo de hacer una única cosa**. No se trata de crear Clases con un solo método, sino de diseñar componentes que se enfoquen en una **serie de procesos estrechamente relacionados** entre sí y que sólo estén **expuestos a una fuente de cambio**.\n\nRazones de cambio típicas (una por capa): el esquema de la BD cambia (persistencia), las reglas de negocio cambian (lógica), el formato de salida cambia (presentación). Si una Clase toca dos o más ejes, tiene más de un motivo para cambiar: dos equipos (o motivos) la estarían editando.\n\nOjo: los principios SOLID son **PRINCIPIOS, no reglas**. Una regla es de obligatorio cumplimiento; un principio es una recomendación que te ayuda a hacer mejor las cosas. Además, muchos ya los aplicas sin saber que tienen nombre.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un empleado que a la vez maneja la caja registradora, repara el aire acondicionado y atiende reclamaciones. Si cambian las leyes fiscales, cambia la facturación; si cambia el proveedor de la BD, cambia el SQL: son motivos de cambio distintos dentro de la misma clase.\n\nEn el ejemplo real del curso, el `ProductBloc` mezclaba `loadProduct`, `saveProduct`, `notifyClients` y hasta `onAddToCart` (que ni siquiera tiene relación directa con el producto). La solución fue separar en `CartBloc` (carrito), `ProductService` (cargar/guardar productos) y `Mailer` (notificar clientes), con el `ProductBloc` recibiéndolos inyectados por constructor. Ahora sí son procesos estrechamente relacionados con un solo propósito, no una clase que hace 'una única cosa' de forma artificial.",
    codeSnippet: `class UsuarioRepository {
  async getUser(id: number): Promise<User> {
    return db.query('SELECT * FROM users WHERE id = $1', [id]);
  }
  saveUser(user: User) { db.insert('users', user); }

  async login(username: string, password: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user.password === password;
  }

  getFullName(user: User): string { return user.firstName + ' ' + user.lastName; }
}`,
    inputs: {},
    completeCode: "Al menos 3 razones: la persistencia (SQL), la autenticación (login) y el formateo (getFullName).",
    format: "prediction",
    prediction: {
      prompt: "Cuenta cuántos 'motivos de cambio' distintos toca esta clase.",
      snippet: `class UsuarioRepository {
  async getUser(id: number): Promise<User> {
    return db.query('SELECT * FROM users WHERE id = $1', [id]);
  }
  saveUser(user: User) { db.insert('users', user); }

  async login(username: string, password: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user.password === password;
  }

  getFullName(user: User): string { return user.firstName + ' ' + user.lastName; }
}`,
      options: [
        "Una sola: es una clase de usuarios, y eso es una sola responsabilidad.",
        "Dos: leer y escribir registros.",
        "Tres o más: persistencia (SQL), autenticación (login) y formateo (getFullName).",
        "Ninguna: una clase siempre puede cambiar por cualquier motivo.",
      ],
      answer: "Tres o más: persistencia (SQL), autenticación (login) y formateo (getFullName).",
    },
  },
  {
    id: 6,
    title: "Detecta el Objeto Dios: Persistencia + Negocio + UI",
    stars: 3,
    category: "SRP",
    description: "Un objeto Dios concentra demasiadas responsabilidades. Detecta cuándo una clase mezcla persistencia, lógica de negocio y presentación en un mismo lugar.",
    objective: "Detectar una violación de SRP en una clase real",
    tags: ["SRP", "objeto dios", "detección"],
    fileName: "god-object.ts",
    completed: false,
    instruction: "Lee la clase y elige la violación de SRP.",
    theory:
      "Tips del curso para detectar que estamos violando SRP:\n\n1. **Nombres demasiado genéricos**: si la Clase se llama `Repositorio`, `Servicio` o `Casa`, termina asumiendo demasiadas responsabilidades.\n2. **Constantes modificaciones**: si cada cambio en el código obliga a tocar esta Clase una y otra vez, la implementación no es la correcta.\n3. **Involucra varias capas**: mezcla la capa de almacenamiento, la de reglas de negocio y la de interfaz de usuario.\n4. **Elevado número de importaciones**: hasta 15 importaciones al inicio del archivo suelen significar que hace demasiadas cosas.\n5. **Muchos métodos expuestos al mundo exterior** y muchísimas líneas de código (lo notas cuando la Clase 'se siente' muy difícil de mantener).\n\nRecuerda: el principio de responsabilidad única es *el corazón de casi todo* el Clean Code.",
    explanationText:
      "🌍 Ejemplo cotidiano: es una navaja suiza usada como martillo, destornillador y tijeras a la vez. Sirve para todo en apariencia, pero cada tarea la hace peor que una herramienta especializada y cualquier mejora en una 'hoja' afecta a las demás.\n\nEn la clase `Factura`, calcular totales (negocio), guardar en la BD (persistencia), enviar correos y renderizar PDF (presentación) son responsabilidades distintas. Si mañana cambia el motor de PDF, tendrías que tocar la misma clase que valida el total de un pedido. Señal típica: la Clase mezcla capas, arrastra demasiadas importaciones y 'huele a que algo no debería estar ahí'.",
    codeSnippet: `class Factura {
  private items: Item[] = [];

  addItem(item: Item) { this.items.push(item); }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  saveToDb() { db.insert('invoices', this); }
  sendEmail() { smtp.send(this); }
  renderPdf() { pdfEngine.render(this); }
  print() { window.print(); }
}`,
    inputs: {},
    completeCode: "Mezcla negocio (total), persistencia (DB), notificaciones (email) y presentación (PDF/print) en una sola clase.",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Cuál es el problema principal de esta clase?",
      snippet: `class Factura {
  private items: Item[] = [];

  addItem(item: Item) { this.items.push(item); }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  saveToDb() { db.insert('invoices', this); }
  sendEmail() { smtp.send(this); }
  renderPdf() { pdfEngine.render(this); }
  print() { window.print(); }
}`,
      options: [
        "Violación de SRP: mezcla cálculo de negocio, persistencia, notificaciones y presentación en una sola clase.",
        "El total se calcula mal porque no aplica los descuentos por volumen.",
        "Falta un constructor que inicialice el arreglo de items.",
        "Violación de OCP: no se puede agregar un método sin modificar la clase.",
      ],
      correct: 0,
    },
  },
  {
    id: 7,
    title: "Refactoriza SRP: Divide el Objeto Dios",
    stars: 4,
    category: "SRP",
    description: "Para cumplir SRP separamos la clase en piezas con una sola razón de cambio: negocio, persistencia y presentación por un lado.",
    objective: "Ordenar los pasos para dividir una clase gigante",
    tags: ["SRP", "refactorización", "separación"],
    fileName: "srp-refactor.ts",
    completed: false,
    instruction: "Ordena los pasos para aplicar SRP a la clase Factura.",
    theory:
      "La receta del curso para refactorizar una clase con varias responsabilidades:\n\n1. Identificar los **ejes de cambio**: negocio, persistencia, notificaciones, presentación.\n2. **Extraer** cada eje a una Clase/servicio con un nombre que describa su rol (`CartBloc`, `ProductService`, `Mailer`).\n3. Dejar la clase original como **orquestador**: sus métodos delegan en los servicios.\n4. **Inyectar las dependencias por constructor**: el Bloc recibe los servicios en vez de crearlos con `new`.\n\n¿Por qué vale la pena aunque 'parezca más código'? Porque toda la lógica queda **centralizada** y la Clase se puede **probar en aislamiento**: en los tests se inyectan mocks del servicio y del mailer para verificar que se llaman con los argumentos correctos, sin tocar una base de datos real.\n\nDe paso, extraer también permite **priorizar la composición frente a la herencia**: en lugar de cadenas de `extends`, una clase compone otras clases por propiedades, con cada pieza expuesta a una sola fuente de cambio.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como reorganizar una oficina. En lugar de que cada empleado imprima, llame al banco y archive (objeto Dios), creas una imprenta, una gestoría y un archivo. Cuando cambia el proveedor de la gestoría, nadie más se entera.\n\nDespués del refactor, `Factura` solo guarda datos y los servicios (`InvoiceCalculator`, `InvoiceRepository`, `InvoicePrinter`) se encargan de cada eje de cambio por separado. Como en el curso: `ProductBloc` recibe `productService` y `mailer` por constructor, y probarlo con mocks es mucho más sencillo que antes.",
    codeSnippet: "// Ordena los pasos de la refactorización SRP",
    inputs: {},
    completeCode: "1) Extraer el cálculo a InvoiceCalculator 2) Extraer la persistencia a InvoiceRepository 3) Extraer la presentación a InvoicePrinter/InvoiceNotifier 4) Dejar Factura como modelo de datos y componer los servicios",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para separar las responsabilidades de la clase Factura gigante.",
      steps: [
        { id: "a", label: "Extraer el cálculo de totales e impuestos a una clase InvoiceCalculator (negocio)." },
        { id: "b", label: "Extraer la lectura y escritura a InvoiceRepository (persistencia)." },
        { id: "c", label: "Extraer el renderizado y el envío de correos a InvoicePrinter / InvoiceNotifier (presentación)." },
        { id: "d", label: "Dejar Factura como modelo de datos y componer los servicios desde la aplicación." },
      ],
      correctOrder: ["a", "b", "c", "d"],
    },
  },
  {
    id: 8,
    title: "OCP: Abierto a Extensión, Cerrado a Modificación",
    stars: 1,
    category: "OCP",
    description: "El Open/Closed Principle dice que una clase debe estar abierta a extensión pero cerrada a modificación: agregar funcionalidad sin tocar lo que ya funciona.",
    objective: "Completar el enunciado del OCP",
    tags: ["OCP", "extensión", "modificación"],
    fileName: "ocp.ts",
    completed: false,
    instruction: "Completa el principio OCP.",
    theory:
      "**OCP (Open/Closed Principle)**: las entidades de software (Clases, módulos, métodos) deben estar **abiertas para la extensión, pero cerradas para la modificación**.\n\n- **Abierta a extensión**: puedes agregar comportamiento nuevo (nueva clase, nueva implementación) sin tocar lo existente.\n- **Cerrada a modificación**: el código que ya funciona no debe cambiar cada vez que aparece un caso nuevo.\n\nEl ejemplo más sencillo del curso es `writeFile` con 'hola.txt':\n\n```ts\nwriteFile('hola.txt'); // el método siempre escribe 'hola.txt'\n```\n\nLlega un nuevo requisito: *\"ya no va a ser hola.txt, va a ser adiós.txt\"*. Si para cumplirlo tienes que **abrir el método** y cambiar físicamente el nombre del archivo, estás **violando OCP**. La solución es pasar el nombre como parámetro:\n\n```ts\nwriteFile('adiós.txt'); // la función no se tocó: es tolerante al cambio\n```\n\nLa función sigue estando exactamente igual: eso es estar 'cerrado al cambio'. Se puede lograr de muchas maneras (herencia, patrones de diseño), pero basado en Clean Code se **procura la composición frente a la herencia**. Y recuerda: los principios son sugerencias, no reglas.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como un enchufe universal. El tomacorriente (abstracción) está 'cerrado a modificación': no lo modificas para cada aparato. Está 'abierto a extensión': cada aparato nuevo simplemente implementa la clavija correcta.\n\nEn el curso, el ejemplo estrella es remover la dependencia de Axios creando una abstracción `HttpProvider`: el código de negocio no cambia aunque cambies la librería HTTP, solo agregas un cliente nuevo. Igual que `writeFile`: si el nombre del archivo es un parámetro, el cambio de requisito no toca el método.",
    codeSnippet: `// OCP: las entidades deben estar
// abiertas a la [INPUT_1] pero
// cerradas a la [INPUT_2].`,
    inputs: { INPUT_1: "extensión", INPUT_2: "modificación" },
    completeCode: "Abierto a extensión, cerrado a modificación.",
  },
  {
    id: 9,
    title: "OCP: Switch Gigante vs Extensiones",
    stars: 4,
    category: "OCP",
    description: "Cada vez que aparece una nueva forma hay que modificar el switch: viola OCP. La alternativa es abstraer y dejar que cada tipo implemente su propia lógica.",
    objective: "Elegir la implementación que respeta OCP",
    tags: ["OCP", "switch", "extensión"],
    fileName: "ocp-shapes.ts",
    completed: false,
    instruction: "Elige la implementación abierta a extensión y cerrada a modificación.",
    theory:
      "El `switch` sobre el tipo de una entidad es el ejemplo clásico de violación de OCP: cada forma nueva (hexágono, elipse) obliga a **modificar** la función existente.\n\nCómo detectarlo (del curso): cuando un **nuevo requerimiento implica abrir la Clase o el método y hacer modificaciones constantemente**, ahí 'algo no está bien'. Una Clase que además **afecta muchas capas** (presentación, almacenamiento...) suele violar OCP y SRP a la vez.\n\nLa solución es invertir la decisión:\n\n- Definir una abstracción (`Shape`) con el método de cálculo.\n- Cada forma es una clase que implementa su propio `area()`.\n- El consumidor itera sobre `Shape` sin saber de qué tipo concreto se trata.\n\nRegla del curso: si dudas entre optimizar unas milésimas de segundo o escribir código fácil de leer, **opta por el código fácil de leer**.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un menú de restaurante que reescribe todo el libro cada vez que agregan un platillo nuevo, en vez de tener una carta ampliable. Funciona hoy, pero cada tipo nuevo te obliga a modificar la misma función y a volver a probar lo existente.\n\nEn el snippet, la Opción A obliga a editar `area()` por cada forma nueva; la Opción B agrega una clase `Square` o `Circle` sin tocar el resto del sistema.",
    codeSnippet: "// ¿Cuál versión permite agregar formas nuevas sin modificar las existentes?",
    inputs: {},
    completeCode: "La versión con la interfaz Shape y una clase por tipo: agregar un triángulo no toca nada existente.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué implementación está abierta a extensión y cerrada a modificación?",
      snippets: [
        {
          id: "switch",
          label: "Opción A",
          description: "Cada forma nueva obliga a editar el switch y añadir un case nuevo.",
          code: `function area(shape: Shape): number {
  switch (shape.type) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    case 'triangle': return (shape.base * shape.height) / 2; // MODIFICADO cada vez
  }
}`,
        },
        {
          id: "extension",
          label: "Opción B",
          description: "Cada forma implementa su propio cálculo: agregar una forma no toca las demás.",
          code: `interface Shape { area(): number; }

class Circle implements Shape {
  constructor(private radius: number) {}
  area(): number { return Math.PI * this.radius ** 2; }
}

class Square implements Shape {
  constructor(private side: number) {}
  area(): number { return this.side ** 2; }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 10,
    title: "OCP: Remover la Dependencia de Axios con HttpProvider",
    stars: 5,
    category: "OCP",
    description: "En el curso se crea una abstracción HttpProvider para no depender de Axios directamente. Cambiar de librería HTTP ya no exige tocar el código de negocio.",
    objective: "Identificar el patrón HttpProvider del curso",
    tags: ["OCP", "axios", "http provider"],
    fileName: "http-provider.ts",
    completed: false,
    instruction: "Elige la implementación que permite migrar de librería HTTP sin tocar el negocio.",
    theory:
      "El ejemplo del curso: los servicios (`TodoService`, `PostService`, `PhotosService`) usaban Axios directamente. Problemas: una **fuerte dependencia con código de terceros** (que no controlamos) y, si el `get` de Axios cambiara de nombre o hubiera que remover la dependencia (porque pesaba la app), tendrías que tocar cada servicio: *'esto es un trabajo de nunca acabar'*.\n\nLa solución es un **patrón adaptador**: una clase propia que envuelve la librería.\n\n```ts\nclass HttpClient {\n  async get(url: string) {\n    const { data, status } = await axios.get(url);\n    return { data, status };\n  }\n}\n```\n\nLos servicios reciben el `HttpClient` por constructor y solo conocen su método `get`. Al remover Axios e implementar `get` con `fetch`, **solo cambia esta clase**: los servicios siguen igual (abiertos a extensión, cerrados a modificación).\n\nLa recomendación del curso: *\"cuando dependan altamente de una dependencia de terceros, se recomienda hacer una Clase adaptadora para que, si la librería cambia, solo tengan que atacar un lado\"*. La pérdida de performance por 'las tres líneas de más' es mínima e imperceptible; ganas tolerancia al cambio y código más fácil de leer.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como los enchufes europeos y americanos. Si tu empresa depende del 'conector americano' (Axios) y vas a Europa, tendrías que rehacer cada aparato. Con un adaptador (HttpProvider) solo fabricas un adaptador nuevo y todos los aparatos siguen igual.\n\nEl resultado del curso: al remover Axios e implementar `get` con `fetch`, `TodoService`, `PostService` y `PhotosService` no se tocan. Ese es el patrón adaptador: cuando la librería cambie, solo atacas un lado de la aplicación.",
    codeSnippet: "// ¿Cuál versión permite cambiar de librería HTTP sin tocar los servicios?",
    inputs: {},
    completeCode: "interface HttpProvider (get/getAll/post/put/delete) + class HttpClient implements HttpProvider (con Axios) + TodoService depende de HttpProvider.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué versión está desacoplada de Axios y respeta OCP?",
      snippets: [
        {
          id: "acoplado",
          label: "Opción A",
          description: "Axios importado directamente en la clase de negocio: migrar de librería es editar cada servicio.",
          code: `import axios from 'axios';

export class TodoService {
  async getAll(): Promise<Todo[]> {
    const { data } = await axios.get<Todo[]>('https://api.com/todos');
    return data;
  }
}`,
        },
        {
          id: "abstract",
          label: "Opción B",
          description: "El negocio depende de la abstracción HttpProvider; un cliente concreto implementa Axios.",
          code: `export interface HttpProvider {
  get<T>(url: string): Promise<T>;
  getAll<T>(url: string): Promise<T[]>;
  post<T>(url: string, body: unknown): Promise<T>;
  put<T>(url: string, body: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

export class HttpClient implements HttpProvider {
  constructor(private fetcher: AxiosInstance) {}
  async get<T>(url: string): Promise<T> { return (await this.fetcher.get<T>(url)).data; }
  async getAll<T>(url: string): Promise<T[]> { return (await this.fetcher.get<T[]>(url)).data; }
}

export class TodoService {
  constructor(private http: HttpProvider) {}
  async getAll(): Promise<Todo[]> { return this.http.getAll<Todo>('/todos'); }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 11,
    title: "Detecta Violación de OCP en un Calculador de Descuentos",
    stars: 3,
    category: "OCP",
    description: "El código que cambia cada vez que aparece un nuevo tipo de cliente es el síntoma clásico de violar OCP.",
    objective: "Detectar por qué un if encadenado viola OCP",
    tags: ["OCP", "detección", "if gigante"],
    fileName: "ocp-discount.ts",
    completed: false,
    instruction: "Lee el snippet y elige el problema de OCP.",
    theory:
      "Cómo detectar que violamos OCP (del curso):\n\n- **Un nuevo requerimiento implica abrir la Clase o el método y modificarlo**, una y otra vez.\n- La Clase **afecta muchas capas** o tiene demasiadas interacciones con otros componentes (ahí también se cruza con SRP).\n\nEn el snippet, cada tipo de cliente nuevo ('gold', 'bronce'...) obliga a modificar `calculateDiscount` y a volver a probar todos los casos. Es el patrón opuesto a 'abierta a extensión, cerrada a modificación'.\n\nAnte la duda entre optimizar el código para ganar milésimas de segundo o escribir código fácil de leer para las demás personas, el curso recomienda elegir lo segundo.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un menú de restaurante que reescribe todo el libro cada vez que agregan un platillo nuevo, en vez de tener una carta de platillos ampliable. El 'if gigante' funciona hoy, pero cada tipo de cliente nuevo te obliga a modificar la misma función y a volver a probarla.\n\nSolución sugerida: convertir el tipo de cliente en una estrategia (una clase por tipo de cliente que calcule su descuento) para que agregar `gold` sea solo una clase nueva, sin tocar `calculateDiscount`.",
    codeSnippet: `function calculateDiscount(customer: Customer): number {
  if (customer.type === 'regular') return customer.amount * 0.05;
  if (customer.type === 'premium') return customer.amount * 0.1;
  if (customer.type === 'vip') return customer.amount * 0.15;
  return 0;
}`,
    inputs: {},
    completeCode: "Agregar un tipo nuevo (ej. 'gold') obliga a modificar calculateDiscount: cerrada a extensión.",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Por qué esta función viola el principio OCP?",
      snippet: `function calculateDiscount(customer: Customer): number {
  if (customer.type === 'regular') return customer.amount * 0.05;
  if (customer.type === 'premium') return customer.amount * 0.1;
  if (customer.type === 'vip') return customer.amount * 0.15;
  return 0;
}`,
      options: [
        "No está abierta a extensión: añadir un tipo de cliente nuevo obliga a modificar la función existente.",
        "Está abierta a modificación: cualquier persona puede editar el archivo.",
        "El porcentaje del descuento debería ser 0.5 en lugar de 0.05.",
        "Falta un else al final del encadenamiento de ifs.",
      ],
      correct: 0,
    },
  },
  {
    id: 12,
    title: "LSP: El Problema del Rectángulo y el Cuadrado",
    stars: 4,
    category: "LSP",
    description: "Un Cuadrado que hereda de Rectángulo rompe la sustitución: al asignar alto y ancho distintos, el comportamiento del área deja de ser coherente.",
    objective: "Predecir el comportamiento al sustituir la subclase",
    tags: ["LSP", "herencia", "rectángulo"],
    fileName: "lsp-rectangle.ts",
    completed: false,
    instruction: "Analiza la herencia y predice el resultado.",
    theory:
      "**LSP (Liskov Substitution Principle)**: *\"Siendo U un subtipo de T, cualquier instancia de T debería poder ser sustituida por cualquier instancia de U sin alterar las propiedades del sistema.\"* En otras palabras: si una Clase `A` es extendida por una Clase `B`, deberías poder sustituir cualquier instancia de `A` por un objeto de `B` **sin que el sistema deje de funcionar** o aparezcan comportamientos inesperados.\n\nEl nombre viene de la doctora **Bárbara Liskov** (Bárbara Jane Huberman), quien recibió el **premio Turing** —el 'premio Nobel de la informática'— por sus contribuciones a los fundamentos prácticos y teóricos del lenguaje de programación y el diseño de sistemas.\n\nEl ejemplo clásico es el **rectángulo/cuadrado**: un `Cuadrado` hereda de `Rectángulo`, pero al sobrescribir `setAncho` y `setAlto` para mantener lados iguales, viola la invariante del rectángulo (ancho y alto independientes).\n\n```ts\nconst figura: Rectangulo = new Cuadrado();\nfigura.setAncho(4);\nfigura.setAlto(5);\n// Un rectángulo daría 20; el cuadrado da 25.\n```\n\nEl cliente que programaba contra `Rectangulo` recibe un comportamiento distinto: la sustitución **rompe** el programa. La solución suele ser una abstracción común (interfaz `Shape` con `getArea()`) en vez de herencia forzada. Como dice el curso: *\"posiblemente más de uno de ustedes ya lo aplica sin darse cuenta\"*.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como contratar a un 'todólogo' para que sustituya al electricista. Si prometió dejar la instalación igual que el electricista y termina reconfigurando todo, quien lo contrató recibe un resultado inesperado. La sustitución falló.\n\nEn el snippet, al final `figura.getArea()` devuelve 25, no los 20 que promete el contrato de un rectángulo. El código que usaba `Rectangulo` se rompe con un `Cuadrado` sin que haya ningún error de compilación.",
    codeSnippet: `class Rectangulo {
  constructor(protected ancho = 0, protected alto = 0) {}
  setAncho(v: number) { this.ancho = v; }
  setAlto(v: number) { this.alto = v; }
  getArea(): number { return this.ancho * this.alto; }
}

class Cuadrado extends Rectangulo {
  setAncho(v: number) { this.ancho = v; this.alto = v; }
  setAlto(v: number) { this.alto = v; this.ancho = v; }
}

const figura: Rectangulo = new Cuadrado();
figura.setAncho(4);
figura.setAlto(5);
// ¿Qué devuelve figura.getArea()?`,
    inputs: {},
    completeCode: "Cuadrado.setAncho(4) => alto=4; setAlto(5) => ancho=5; getArea() = 5 * 5 = 25. Violenta la invariante del rectángulo (esperado: 20).",
    format: "prediction",
    prediction: {
      prompt: "El cuadrado sobrescribe para mantener lados iguales, y eso rompe la sustitución.",
      snippet: `class Rectangulo {
  constructor(protected ancho = 0, protected alto = 0) {}
  setAncho(v: number) { this.ancho = v; }
  setAlto(v: number) { this.alto = v; }
  getArea(): number { return this.ancho * this.alto; }
}

class Cuadrado extends Rectangulo {
  setAncho(v: number) { this.ancho = v; this.alto = v; }
  setAlto(v: number) { this.alto = v; this.ancho = v; }
}

const figura: Rectangulo = new Cuadrado();
figura.setAncho(4);
figura.setAlto(5);
// ¿Qué devuelve figura.getArea()?`,
      options: [
        "20 (4 x 5): el comportamiento de un rectángulo normal",
        "25 (5 x 5): el cuadrado forzó lados iguales y rompió la invariante",
        "16 (4 x 4): el último setter fue setAncho(4)",
        "Un error de compilación por sobrescritura inválida",
      ],
      answer: "25 (5 x 5): el cuadrado forzó lados iguales y rompió la invariante",
    },
  },
  {
    id: 13,
    title: "LSP: Subclases Sustituibles por su Base",
    stars: 3,
    category: "LSP",
    description: "Una subclase debe poder sustituir a su clase base sin alterar el comportamiento esperado. Si el cliente debe saber con qué tipo concreto trabaja, se viola LSP.",
    objective: "Elegir el diseño que respeta la sustitución",
    tags: ["LSP", "sustitución", "duck typing"],
    fileName: "lsp-birds.ts",
    completed: false,
    instruction: "Elige el diseño donde la subclase sustituye sin sorpresas.",
    theory:
      "Una subclase que hereda un método que **no puede cumplir** (lanza una excepción, retorna un valor distinto al prometido o deja invariantes a medias) viola LSP.\n\nEl ejemplo del curso (vehículos): `printCarSeats` recibía `(Tesla | Audi | Toyota | Honda)[]`, y cada clase exponía un método propio (`getNumberOfTeslaSeats`, `getNumberOfAudiSeats`...). Agregar un `Volvo` obligaba a modificar la función y a crear `getNumberOfVolvoSeats`: una cascada de cambios que viola LSP y OCP a la vez.\n\nLa solución fue una **clase abstracta `Vehículo`** con un método abstracto `getNumberOfSeats()`. Todas las marcas lo implementan y `printCarSeats` recibe un arreglo de `Vehículo` sin saber qué marca es. Las clases abstractas existen desde su concepción para ser heredadas, y los métodos abstractos **obligan** a las subclases a implementarlos.\n\nEn TypeScript, el **duck typing** (tipado estructural) refuerza LSP: lo que importa es la **forma** (los miembros que expone), no la jerarquía de herencia.",
    explanationText:
      "🌍 Ejemplo cotidiano: es la diferencia entre una promesa cumplida y una rota. 'Todas las aves vuelan' es una promesa que el pingüino no puede cumplir. Si tu código cree que el pingüino va a volar, explota. La solución es no prometer el vuelo: separarlo en un rol que solo implementan las que sí vuelan.\n\nIgual que en el ejercicio de los carros: con `Vehículo` como clase abstracta, `printCarSeats(cars: Vehículo[])` acepta Tesla, Audi, Toyota, Honda, Volvo o Ford sin modificarse: cualquier subclase sustituye a la base sin romper nada. Con duck typing no hace falta que `Pinguino` y `Aguila` sean parientes: basta con que expongan la misma forma para tratarlas igual.",
    codeSnippet: "// ¿Cuál diseño permite tratar cualquier subclase como su base sin romper el comportamiento?",
    inputs: {},
    completeCode: "Ave/Perro con una interfaz Volador aparte: el pingüino no hereda un volar() que no puede cumplir.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué diseño respeta el principio de sustitución de Liskov?",
      snippets: [
        {
          id: "rompe",
          label: "Opción A",
          description: "La subclase rompe el contrato: volar() lanza una excepción que la base no prometía.",
          code: `class Ave {
  volar(): string { return 'Vuela'; }
}

class Pinguino extends Ave {
  volar(): string { throw new Error('Los pingüinos no vuelan'); }
}`,
        },
        {
          id: "cumple",
          label: "Opción B",
          description: "Solo las aves que vuelan implementan Volador; Pinguino sustituye a Ave sin romper nada.",
          code: `class Ave {
  mover(): string { return 'Se desplaza'; }
}

interface Volador { volar(): string; }

class Pinguino extends Ave {}

class Aguila extends Ave implements Volador {
  volar(): string { return 'Vuela alto'; }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 14,
    title: "LSP: Sustitución y Duck Typing",
    stars: 2,
    category: "LSP",
    description: "En TypeScript el tipado estructural (duck typing) facilita la sustitución: una clase se puede usar donde se espera otra si cumple su forma.",
    objective: "Completar el enunciado del principio LSP",
    tags: ["LSP", "duck typing", "sustitución"],
    fileName: "lsp.ts",
    completed: false,
    instruction: "Completa el enunciado del principio de Liskov.",
    theory:
      "La definición formal del principio de Liskov: *\"Las funciones que utilicen punteros o referencias a Clases base deben ser capaces de usar objetos de Clases derivadas sin saberlo.\"* O, como dice el curso: cualquier instancia de `T` debería poder ser sustituida por cualquier instancia de un subtipo `U` **sin alterar las propiedades del sistema**.\n\nEl instructor insiste en que esto no es abstracto: *\"posiblemente más de uno de ustedes ya lo está aplicando sin darse cuenta\"*, igual que pasa con casi todos los principios SOLID.\n\nEn TypeScript, el **duck typing** (tipado estructural) facilita esa sustitución: una clase se puede usar donde se espera otra si cumple su forma (los mismos métodos con los mismos tipos), aunque no compartan herencia. La herencia sigue siendo útil, pero la sustitución se valida por estructura.",
    explanationText:
      "🌍 Ejemplo cotidiano: si suena como pato y camina como pato, es un pato. TypeScript no exige que las clases sean parientes para sustituirse: basta con que cumplan la misma forma (los mismos métodos con los mismos tipos).\n\nEso es el duck typing: en lugar de heredar de una base para 'tener derecho' a usarse, una clase es válida si expone lo que el consumidor necesita. Es el mismo sentimiento del curso: 'ya lo aplicabas sin saber que se llama así'.",
    codeSnippet: `// Las clases derivadas deben poder
// [INPUT_1] a sus clases base sin
// [INPUT_2] el comportamiento del programa.
// En TypeScript, el [INPUT_3] typing permite
// esta sustitución por la forma, no por la herencia.`,
    inputs: { INPUT_1: "sustituir", INPUT_2: "romper", INPUT_3: "duck" },
    completeCode: "Las clases derivadas deben poder sustituir a sus clases base sin romper el comportamiento del programa. En TypeScript, el duck typing facilita la sustitución estructural.",
  },
  {
    id: 15,
    title: "ISP: La Interfaz Gorda (Fat Interface)",
    stars: 3,
    category: "ISP",
    description: "Una interfaz con demasiados métodos obliga a implementar todo aunque no se use. Eso es una interfaz gorda y viola la segregación.",
    objective: "Detectar una interfaz gorda",
    tags: ["ISP", "fat interface", "segregación"],
    fileName: "isp-fat.ts",
    completed: false,
    instruction: "Lee la interfaz y elige la violación de ISP.",
    theory:
      "**ISP (Interface Segregation Principle)**: *\"Los clientes no deberían estar obligados a depender de interfaces que no utilicen.\"*\n\nEl ejemplo del curso: '¿para qué me sirve si me dijeran *tienes que implementar el método volar, tú como persona*, y yo no puedo volar?'. Si mañana cambia el método `volar`, la clase que no lo usa se ve afectada de todas formas, aunque jamás lo llame.\n\nEn el ejercicio de las aves: `interface Bird { fly; eat; run; swim }`. El `Ostrich` (avestruz) no vuela y el `Penguin` (pingüino) nada, pero al implementar `Bird` se ven **obligados** a implementar métodos que no usan (`throw new Error('Esta ave no vuela')`). Si `fly` deja de regresar `void`, el avestruz tendría que modificarse aunque no vuela.\n\nLa solución es **segregar**: dividir la interfaz en interfaces pequeñas y específicas por rol, para que cada clase implemente solo lo que necesita.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un contrato laboral único para 'empleado' que obliga a todos a firmar cláusulas de repartidor, contador y vigilante. El programador termina 'firmando' métodos que nunca usará.\n\nEn el snippet, `Programador` se ve forzado a implementar `disenar()`, `gestionarEquipo()` y `cocinar()` lanzando errores: cada error de runtime es un cliente que llamó un método que no debía existir ahí. Si mañana cambia la firma de `cocinar()`, el programador tendría que tocarse aunque nunca cocine.",
    codeSnippet: `interface Trabajador {
  programar(): void;
  disenar(): void;
  tomarCafe(): void;
  gestionarEquipo(): void;
  cocinar(): void;
}

class Programador implements Trabajador {
  programar() { /* ok */ }
  disenar() { throw new Error('No diseño'); }
  tomarCafe() { /* ok */ }
  gestionarEquipo() { throw new Error('No gestiono'); }
  cocinar() { throw new Error('No cocino'); }
}`,
    inputs: {},
    completeCode: "Programador implementa métodos que no usa (disenar, gestionarEquipo, cocinar) y debe lanzar errores: interfaz gorda.",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué problema de ISP tiene esta interfaz?",
      snippet: `interface Trabajador {
  programar(): void;
  disenar(): void;
  tomarCafe(): void;
  gestionarEquipo(): void;
  cocinar(): void;
}

class Programador implements Trabajador {
  programar() { /* ok */ }
  disenar() { throw new Error('No diseño'); }
  tomarCafe() { /* ok */ }
  gestionarEquipo() { throw new Error('No gestiono'); }
  cocinar() { throw new Error('No cocino'); }
}`,
      options: [
        "Interfaz gorda: Programador se ve forzado a implementar métodos que no le corresponden y debe lanzar errores.",
        "Los métodos no tienen parámetros y eso rompe el tipado de la interfaz.",
        "La clase Programador debería ser una interfaz en lugar de una clase.",
        "No hay violación de ISP: implementar métodos extra es una práctica normal.",
      ],
      correct: 0,
    },
  },
  {
    id: 16,
    title: "ISP: Segrega en Interfaces Pequeñas y Específicas",
    stars: 3,
    category: "ISP",
    description: "En vez de una interfaz que obliga a todo, separa en roles pequeños: cada clase implementa solo la interfaz que realmente necesita.",
    objective: "Elegir la versión segregada",
    tags: ["ISP", "interfaces", "segregación"],
    fileName: "isp-segregate.ts",
    completed: false,
    instruction: "Elige la versión que respeta ISP.",
    theory:
      "Cómo segrega el curso la interfaz de aves:\n\n- `Bird` → solo `eat()` (todas las aves comen).\n- `FlyingBird` → `fly()` (solo Tucan y Humminbird).\n- `RunningBird` → `run()` (solo Ostrich).\n- `SwimmerBird` → `swim()` (solo Penguin).\n\nCada clase implementa solo las interfaces que le corresponden. Si mañana `fly()` pasa a regresar 'los minutos que puede volar', solo se tocan las aves voladoras: el avestruz y el pingüino quedan intactos. Ese es el beneficio: **el código es más tolerante al cambio**.\n\nEl curso lo advierte: segregar es tedioso y obliga a más código y a refactorizaciones, pero esa refactorización 'se paga' muy bien en proyectos con mucha vida útil. Mantén las interfaces **simples y específicas** y ten presente la clase cliente que las va a implementar.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como los permisos de una app. En lugar de un único permiso 'administrador total', se otorgan roles: 'editor', 'lector', 'revisor'. Cada rol recibe solo lo que necesita y nadie arrastra capacidades que no usa.\n\nAl segregar, un `DiseniadorUX` implementa solo `Diseniador`; un programador solo `Programador`. Si mañana cambia la firma de `disenar()`, solo se toca la interfaz pequeña y sus implementaciones, no a todos los empleados. Igual que con `FlyingBird`: solo se ven afectadas las aves que vuelan.",
    codeSnippet: "// ¿Cuál diseño segrega las interfaces por rol?",
    inputs: {},
    completeCode: "Interfaces pequeñas por rol: Programador, Diseniador, Gestor; cada clase implementa solo la que necesita.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué versión segrega las interfaces según el rol de cada clase?",
      snippets: [
        {
          id: "gorda",
          label: "Opción A",
          description: "Todos implementan una única interfaz con roles mezclados y lanzan errores por lo que no usan.",
          code: `interface Empleado {
  programar(): void;
  disenar(): void;
  gestionar(): void;
}

class DiseniadorEmpleado implements Empleado {
  programar() { throw new Error('no'); }
  disenar() { /* ok */ }
  gestionar() { throw new Error('no'); }
}`,
        },
        {
          id: "segregada",
          label: "Opción B",
          description: "Cada rol es una interfaz pequeña; DiseniadorUX solo implementa lo suyo.",
          code: `interface Programador { programar(): void; }
interface Diseniador { disenar(): void; }
interface Gestor { gestionarEquipo(): void; }

class DiseniadorUX implements Diseniador {
  disenar() { /* ok */ }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 17,
    title: "DIP: Depender de Abstracciones, No de Concretos",
    stars: 2,
    category: "DIP",
    description: "La inversión de dependencias dice que los módulos de alto nivel no deben depender de los de bajo nivel: ambos deben depender de abstracciones.",
    objective: "Completar el enunciado del DIP",
    tags: ["DIP", "abstracciones", "concretos"],
    fileName: "dip.ts",
    completed: false,
    instruction: "Completa el principio de inversión de dependencias.",
    theory:
      "**DIP (Dependency Inversion Principle)**, en su definición completa del curso:\n\n1. Los **módulos de alto nivel** no deben depender de los **módulos de bajo nivel**. **Ambos deben depender de abstracciones**.\n2. Las **abstracciones** no deben depender de las **concreciones**. Los **detalles** deben depender de las **abstracciones**.\n\n- **Alto nivel** = los componentes importantes: la capa de dominio, las reglas de negocio ('qué hace la app').\n- **Bajo nivel** = lo cercano a la infraestructura: UI, persistencia, comunicación con APIs externas ('cómo lo hace').\n\nUn ejemplo: si tu persistencia pasa de archivos JSON a MongoDB, o un web service pasa de XML a JSON, el cambio debería ser trivial (una o dos clases), no tocar toda la app. Si te afecta mucho, tu aplicación está **altamente acoplada** a dependencias que debiste controlar.\n\nLa abstracción en el curso es la **clase abstracta** que dicta cómo lucen las implementaciones. Depender de abstracciones **aumenta la tolerancia al cambio**: los cambios en implementaciones concretas casi nunca requieren tocar las abstracciones. Para lograr esto se usa la **inyección de dependencias**.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como contratar a un 'repartidor' (abstracción) en vez de a 'Carlos con su moto' (detalle concreto). Si Carlos se enferma, cambias de repartidor sin cambiar tus pedidos. La dependencia se invierte: la empresa de alto nivel no depende de un repartidor específico.\n\nEn el curso, el patrón `HttpProvider` del OCP es también un ejemplo de DIP: `TodoService` (alto nivel) no depende de Axios (detalle), sino de la abstracción `HttpProvider`. Y un `UseCase` con `new ExternalService()` dentro escondía su dependencia; al inyectarla por constructor, la dependencia queda visible al solo leer el código.",
    codeSnippet: `// DIP: los módulos de [INPUT_1] nivel no deben
// depender de los módulos de bajo nivel.
// Ambos deben depender de [INPUT_2].
// Las [INPUT_3] no deben depender de los detalles;
// los [INPUT_4] deben depender de las abstracciones.`,
    inputs: {
      INPUT_1: "alto",
      INPUT_2: "abstracciones",
      INPUT_3: "abstracciones",
      INPUT_4: "detalles",
    },
    completeCode: "Módulos de alto nivel no dependen de los de bajo nivel; ambos dependen de abstracciones. Las abstracciones no dependen de los detalles; los detalles dependen de las abstracciones.",
  },
  {
    id: 18,
    title: "DIP: Inyección de Dependencias",
    stars: 4,
    category: "DIP",
    description: "El alto nivel (UseCase) no debe crear su bajo nivel (repositorio concreto) dentro: se lo inyectamos por constructor. Así es fácil probarlo con un fake.",
    objective: "Elegir la versión que invierte las dependencias",
    tags: ["DIP", "inyección", "constructor"],
    fileName: "dip-injection.ts",
    completed: false,
    instruction: "Elige la versión que aplica inyección de dependencias.",
    theory:
      "El anti-patrón a evitar: el caso de uso crea su dependencia concreta con `new` dentro del método.\n\n```ts\nclass GetUsersUseCase {\n  private repository = new MySqlUserRepository();\n}\n```\n\nProblemas: dependencia **oculta** (no sabes que existe hasta que abres el método), alto acoplamiento, y testing muy complicado (hay que crear mocks internos).\n\nEn el ejercicio del curso: `PostService` creaba `new LocalDataBaseService()` dentro de `getPosts`. Si el método `getFakePosts` cambiaba de nombre, había que abrir `PostService` a buscar el error: *'¿ven qué dolor de cabeza?'*. La solución fue una **clase abstracta `PostProvider`** con `abstract getPosts(): Promise<Post[]>`, e implementarla en `LocalDataBaseService`, `JsonDataBaseService` y luego en un `WebApiPostService` con `fetch` (la tarea: 100 posts sin tocar `PostService`).\n\nCon la inyección por constructor, el alto nivel depende de la abstracción, las dependencias quedan **visibles al leer el código**, y en los tests se inyecta un proveedor falso: *\"no tengo que probar que llegué al endpoint: pruebo el PostService de manera aislada\"*.",
    explanationText:
      "🌍 Ejemplo cotidiano: es como ir al médico con tus estudios en la mano (los inyectas) en vez de que el médico los imprima él mismo. El médico (caso de uso) no necesita saber cómo se imprimen los estudios: solo los recibe y los usa.\n\nLa inyección por constructor es la señal más clara de DIP aplicado. En el curso, cambiar de `LocalDataBaseService` a `JsonDataBaseService` (o a un `WebApiPostService` con fetch) era solo cambiar el proveedor inyectado, sin tocar `PostService`: ahí, sin darse cuenta, también estaban aplicando LSP y OCP.",
    codeSnippet: "// ¿Cuál versión permite probar el caso de uso con un fake?",
    inputs: {},
    completeCode: "class GetUsersUseCase { constructor(private userRepository: UserRepository) {} } — el alto nivel depende de la abstracción, no del concreto.",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Qué implementación invierte la dependencia (el alto nivel no crea su bajo nivel)?",
      snippets: [
        {
          id: "new",
          label: "Opción A",
          description: "El alto nivel crea su dependencia concreta: acoplado e imposible de probar aislado.",
          code: `class GetUsersUseCase {
  private repository = new MySqlUserRepository();

  run(): User[] {
    return this.repository.findAll();
  }
}`,
        },
        {
          id: "inyectado",
          label: "Opción B",
          description: "La abstracción UserRepository se inyecta por constructor: fácil de sustituir por un fake.",
          code: `interface UserRepository { findAll(): User[]; }

class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}
  run(): User[] {
    return this.userRepository.findAll();
  }
}

class FakeUserRepository implements UserRepository {
  findAll(): User[] { return [{ id: 1, name: 'Test' }]; }
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 19,
    title: "Code Smells: Duplicidad Real vs Accidental y Complejidad",
    stars: 2,
    category: "SMELLS",
    description: "Más allá del acrónimo: untestability, complejidad accidental vs esencial, la métrica del WTF por minuto y los dos tipos de duplicidad.",
    objective: "Distinguir duplicidad real/accidental y complejidad esencial/accidental",
    tags: ["duplicidad", "complejidad", "untestability"],
    fileName: "smells-extra.ts",
    completed: false,
    instruction: "Valida tu comprensión de los code smells adicionales.",
    theory:
      "El curso amplía los smells con matices importantes:\n\n- **Untestability**: el código difícil de probar suele ser producto del **alto acoplamiento** y de dependencias que no se inyectan (o que viven en el contexto global, como el Singleton). Hay que tener **las pruebas en mente desde la creación del código**.\n- **Optimización prematura**: retrasar la toma de decisiones mantiene abiertas las opciones. Distingue entre **complejidad esencial** (inherente al problema) y **complejidad accidental** (la que añadimos al implementar una solución más compleja de la necesaria: 'no voy a implementar Redux solo para sumar dos números').\n- **Nombres poco descriptivos**: el balance entre demasiado específico (nombres larguísimos) y demasiado genérico (Clases que asumen demasiadas tareas).\n- **Duplicidad**: la **real** (código idéntico que cumple la misma función; un cambio obliga a actualizar todas las copias, con riesgo de error humano y pruebas duplicadas) vs la **accidental** (luce similar pero cumple tareas distintas; un cambio solo afecta a un lugar).\n\nY la métrica informal de calidad: el **'WTF por minuto'** — cuántas veces quien lee el código dice '¿qué diablos es esto?'.",
    explanationText:
      "🌍 Ejemplo cotidiano: la duplicidad real es tener dos recibos de luz idénticos en dos cajones: pagas uno, corriges el monto en uno y el otro queda desactualizado. La accidental es que dos recibos parezcan iguales pero uno sea de luz y otro de agua: no los juntes a la fuerza.\n\nY la complejidad accidental es instalar una alarma de aeropuerto para proteger una bicicleta: la solución es más compleja que el problema. El curso pide encontrar el balance entre la complejidad esencial y la accidental.",
    codeSnippet: "// Afirmaciones sobre code smells adicionales",
    inputs: {},
    completeCode: "Duplicidad real = copias idénticas a actualizar todas | accidental = similar pero tareas distintas | esencial = inherente al problema | accidental = añadida por la solución",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de la duplicidad y la complejidad según el curso.",
      statements: [
        { id: "a", text: "La duplicidad real es código idéntico que cumple la misma función: un cambio obliga a actualizar todas las copias en los mismos puntos.", answer: true, explanation: "Es la duplicidad que hay que evitar a toda costa: incrementa el error humano y las pruebas duplicadas innecesarias." },
        { id: "b", text: "En la duplicidad accidental el código luce similar pero cumple tareas distintas: un cambio en uno de los módulos solo afecta a ese lugar.", answer: true, explanation: "Si cambias uno y los demás quedan intactos, quizá se pueda centralizar con parámetros, pero no siempre conviene." },
        { id: "c", text: "La complejidad esencial es la que añadimos nosotros; la accidental es la inherente al problema.", answer: false, explanation: "Al revés: la esencial es inherente al problema (siempre estará ahí); la accidental es la que añadimos con soluciones más complejas de lo necesario." },
        { id: "d", text: "El 'WTF por minuto' es una métrica informal: cuántas veces quien lee el código dice '¿qué diablos es esto?'.", answer: true, explanation: "Un buen código tiene pocos '¿qué diablos es esto?' por minuto; uno malo, muchos. Es un chiste del oficio para hablar de nombres y legibilidad." },
        { id: "e", text: "El código difícil de probar (untestability) suele venir de dependencias no inyectadas o que viven en el contexto global.", answer: true, explanation: "Si la dependencia está escondida (new dentro del método o un Singleton global), probarlo aislado es muy difícil." },
      ],
    },
  },
  {
    id: 20,
    title: "Olores Honoríficos: Inflación, Obsesión Primitiva y Lista Larga",
    stars: 3,
    category: "SMELLS",
    description: "Otros olores famosos de la literatura (refactoring.guru / Refactoring de Fowler): métodos largos, clases supergrandes, obsesión primitiva y listas largas de parámetros.",
    objective: "Emparejar cada olor honorífico con su síntoma",
    tags: ["inflación", "obsesión primitiva", "parámetros"],
    fileName: "olores-honorificos.ts",
    completed: false,
    instruction: "Empareja cada olor honorífico con su síntoma.",
    theory:
      "La información de este video del curso proviene sobre todo de **refactoring.guru** (el catálogo de refactorización basado en el *Refactoring* de Fowler). Merecen una mención honorífica porque no están en STUPID pero son igual de comunes:\n\n- **Inflación (métodos largos)**: cualquier método de **más de 10 líneas** debería hacerte pensar en dividirlo en submétodos. A un método siempre se le agrega código y casi nunca se le quita.\n- **Clases supergrandes**: comienzan pequeñas y se van hinchando; la Clase tiene 'demasiados sombreros' (limpia las plantas, cocina huevos, teclea en la computadora). Se tratan separando cada sombrero en una subclase o módulo.\n- **Obsesión primitiva**: usar primitivos en lugar de objetos pequeños para tareas simples (moneda, rangos, teléfonos) o constantes para codificar información (`userAdminRole = 1`). Nace en momentos de debilidad: 'solo un campo para guardar unos datos'. Se trata agrupando los campos en su propia Clase.\n- **Lista larga de parámetros**: más de tres o cuatro argumentos. Se trata pasando un objeto (o varios) que agrupe los datos.\n\nSobre el rendimiento: llamar cinco funciones pequeñas en vez de una gigante tiene un impacto casi insignificante comparado con la legibilidad que ganas.",
    explanationText:
      "🌍 Ejemplo cotidiano: es un cajón de 'cosas sueltas' que se llena con monedas, tornillos y baterías sueltas: obsesión primitiva. Y una instrucción de 40 pasos para hacer un sándwich: método largo. En ambos casos, agrupar (una caja para monedas, un protocolo de 3 pasos) hace todo más fácil de entender y mantener.\n\nNo te preocupes por el rendimiento: el coste de llamar varias funciones pequeñas es insignificante frente al beneficio de que mañana tú u otra persona lean ese código sin dolor.",
    codeSnippet: "// Empareja cada olor honorífico con su síntoma",
    inputs: {},
    completeCode: "Inflación → métodos >10 líneas o clases supergrandes | Obsesión primitiva → primitivos en lugar de objetos pequeños | Lista larga de parámetros → más de 3-4 argumentos",
    format: "matching",
    matching: {
      prompt: "Conecta cada olor honorífico con la situación que lo describe.",
      pairs: [
        { id: "metodo", term: "Inflación (método largo)", definition: "Un método supera las 10 líneas y sigue creciendo: señal de dividirlo en submétodos que hagan una tarea y la hagan bien." },
        { id: "clase", term: "Clase supergrande", definition: "La Clase empieza pequeña y se hincha con el tiempo hasta tener 'demasiados sombreros': hace muchas cosas." },
        { id: "primitiva", term: "Obsesión primitiva", definition: "Usar primitivos en lugar de objetos pequeños (moneda, rangos, teléfonos) o constantes para codificar información." },
        { id: "parametros", term: "Lista larga de parámetros", definition: "Más de tres o cuatro argumentos en un método; se trata pasando un objeto que agrupe los datos." },
      ],
      definitions: [
        "Un método supera las 10 líneas y sigue creciendo: señal de dividirlo en submétodos que hagan una tarea y la hagan bien.",
        "La Clase empieza pequeña y se hincha con el tiempo hasta tener 'demasiados sombreros': hace muchas cosas.",
        "Usar primitivos en lugar de objetos pequeños (moneda, rangos, teléfonos) o constantes para codificar información.",
        "Más de tres o cuatro argumentos en un método; se trata pasando un objeto que agrupe los datos.",
      ],
    },
  },
  {
    id: 21,
    title: "Acopladores: Feature Envy, Intimidad, Cadenas y Hombre de En Medio",
    stars: 3,
    category: "ACOPLADORES",
    description: "Cuatro olores que contribuyen al acoplamiento excesivo: feature envy, intimidad inapropiada, cadenas de mensajes y middle man.",
    objective: "Emparejar cada acoplador con su definición",
    tags: ["feature envy", "message chain", "middle man"],
    fileName: "acopladores.ts",
    completed: false,
    instruction: "Empareja cada acoplador con su definición.",
    theory:
      "Todos los olores de este grupo **contribuyen al acoplamiento excesivo entre Clases** (o muestran qué pasa cuando el acoplamiento se reemplaza por una delegación excesiva). Información extraída de refactoring.guru:\n\n- **Feature envy** (envidia de característica): un método accede **más a los datos de otro objeto** que a los suyos propios. Suele ocurrir tras una refactorización a medias: ese método quizá no pertenezca a ese lugar. Regla base: *si las cosas cambian al mismo tiempo, manténlas en el mismo lugar*.\n- **Intimidad inapropiada**: una Clase usa campos y métodos **internos** de otra. Las buenas Clases deben saber **lo menos posible** de otras Clases: así son más fáciles de mantener y reutilizar.\n- **Cadena de mensajes**: una función `A` llama a `B`, `B` llama a `C` y `C` a `D`. El cliente depende de la navegación por toda la estructura; cualquier cambio en esas relaciones obliga a modificar el puente. Se trata de comunicar `A` directamente con `D`.\n- **Middle man** (hombre de en medio): una Clase solo existe para **delegar** el trabajo a otra. *'¿Por qué existe esa Clase?'* Suele ser el residuo de eliminar cadenas de mensajes: si solo delega, se elimina.",
    explanationText:
      "🌍 Ejemplo cotidiano: la cadena de mensajes es preguntarle al recepcionista, que le pregunta al jefe, que le pregunta a la secretaria, para saber si hay café: tres intermediarios para una respuesta que podrías obtener directo. El middle man es el recepcionista que solo repite 'eso está allá' sin hacer nada más.\n\nY el feature envy es el empleado de finanzas que pasa todo el día leyendo los archivos del departamento de recursos humanos: hace mucha referencia a datos que no son suyos, señal de que su método debería vivir en el otro lado.",
    codeSnippet: "// Empareja cada acoplador con su definición",
    inputs: {},
    completeCode: "Feature envy → accede a datos de otro objeto | Intimidad inapropiada → usa internos de otra | Cadena de mensajes → A→B→C→D | Middle man → solo delega",
    format: "matching",
    matching: {
      prompt: "Conecta cada olor acoplador con la situación que lo describe.",
      pairs: [
        { id: "envy", term: "Feature envy", definition: "Un método accede a más datos de otro objeto que a los suyos propios: quizá debería vivir en el otro lugar." },
        { id: "intimidad", term: "Intimidad inapropiada", definition: "Una Clase usa campos y métodos internos de otra: las buenas Clases deben saber lo menos posible de las demás." },
        { id: "cadena", term: "Cadena de mensajes", definition: "Una función A llama a B, B a C y C a D: el cliente depende de toda la navegación por la estructura." },
        { id: "middle", term: "Middle man (hombre de en medio)", definition: "Una Clase solo existe para delegar el trabajo a otra; si solo delega, se puede eliminar." },
      ],
      definitions: [
        "Un método accede a más datos de otro objeto que a los suyos propios: quizá debería vivir en el otro lugar.",
        "Una Clase usa campos y métodos internos de otra: las buenas Clases deben saber lo menos posible de las demás.",
        "Una función A llama a B, B a C y C a D: el cliente depende de toda la navegación por la estructura.",
        "Una Clase solo existe para delegar el trabajo a otra; si solo delega, se puede eliminar.",
      ],
    },
  },
];
