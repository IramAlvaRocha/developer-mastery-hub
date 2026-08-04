import type { Exercise } from '../../lib/types';

export const CODE_VULNERABILITIES_EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "SQL Injection (SQLi): Consultas Parametrizadas",
    stars: 3,
    category: "SQL INJECTION",
    description: "Detecta por qué una consulta construida concatenando la entrada del usuario es vulnerable y cómo corregirla con parámetros.",
    objective: "Reconocer y prevenir SQL Injection",
    tags: ["SQLi", "Parameterized Query", "Security", "DB"],
    fileName: "usersRepository.ts",
    completed: false,
    instruction: "Lee el snippet y elige la vulnerabilidad que contiene.",
    theory: "SQL Injection ocurre cuando entradas de usuario no sanitizadas se concatenan directamente en comandos SQL. Al usar consultas parametrizadas, el motor de base de datos trata el input como un dato estricto y no como código ejecutable.",
    explanationText: "🌍 Ejemplo cotidiano: Es como entregarle al cajero un formulario con el dato en el hueco marcado, en vez de dictarle toda la frase: el usuario no puede 'agregar' instrucciones (como OR '1'='1') porque su texto deja de ser código.\n\nLas consultas parametrizadas envían el comando SQL y los datos por separado al motor: el input se trata como un valor literal, no como parte ejecutable de la consulta. La concatenación con comillas es el error clásico porque convierte al atacante en autor de la sentencia.",
    codeSnippet: `// Busca el usuario por email
const sql = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
const result = await db.query(sql);`,
    inputs: {},
    completeCode: `const query = 'SELECT * FROM users WHERE email = $1';
const values = [req.body.email];
const result = await db.query(query, values);`,
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué vulnerabilidad contiene este snippet?",
      snippet: `const sql = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
const result = await db.query(sql);`,
      options: [
        "Inyección SQL (SQLi): el email del usuario se concatena en la sentencia y puede convertirse en código SQL.",
        "Cross-Site Scripting (XSS): el email se inyecta en el DOM sin sanitizar.",
        "Denegación de servicio (ReDoS): la consulta usa una regex catastrófica.",
        "Path Traversal: la ruta del archivo se construye con ../",
      ],
      correct: 0,
    },
  },
  {
    id: 2,
    title: "Cross-Site Scripting (XSS): Sanitización y DOM Escape",
    stars: 3,
    category: "XSS",
    description: "Detecta la vía por la que un comentario de usuario puede ejecutar scripts en el navegador de la víctima.",
    objective: "Reconocer y mitigar XSS",
    tags: ["XSS", "DOMPurify", "textContent", "Frontend"],
    fileName: "commentWidget.ts",
    completed: false,
    instruction: "Lee el snippet y elige la vulnerabilidad que contiene.",
    theory: "XSS permite a un atacante ejecutar scripts en el navegador de la víctima si la aplicación inserta datos de usuario directamente en la estructura HTML sin escapar o sanitizar previamente.",
    explanationText: "🌍 Ejemplo cotidiano: Es la diferencia entre escribir en la pared con rotulador (textContent: texto inerte) y pegar un cartel con órdenes para el vendedor (innerHTML: el navegador las ejecuta). Un comentario con <img onerror=\"...\"> se convierte en código real.\n\nUsar textContent fuerza al navegador a tratar el contenido como texto plano de forma nativa: no hay etiquetas que interpretar. Para HTML enriquecido, DOMPurify elimina etiquetas y atributos peligrosos como <script> u onerror antes de insertarlos.",
    codeSnippet: `// Render del comentario del usuario
const comment = req.body.comment;
container.innerHTML = comment;`,
    inputs: {},
    completeCode: `element.textContent = userComment;
container.innerHTML = DOMPurify.sanitize(userComment);`,
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué vulnerabilidad contiene este snippet?",
      snippet: `const comment = req.body.comment;
container.innerHTML = comment;`,
      options: [
        "Cross-Site Scripting (XSS): innerHTML interpreta etiquetas y atributos del comentario, permitiendo ejecutar scripts.",
        "SQL Injection: el comentario se guarda concatenado en una consulta.",
        "Prototype Pollution: la clave __proto__ contamina Object.prototype.",
        "Path Traversal: el comentario se usa como ruta de archivo.",
      ],
      correct: 0,
    },
  },
  {
    id: 3,
    title: "OS Command Injection: Invocación Sin Shell",
    stars: 4,
    category: "COMMAND INJECTION",
    description: "Detecta por qué pasar la entrada del usuario a exec() permite ejecutar comandos adicionales en la shell.",
    objective: "Reconocer y eliminar el contexto de shell",
    tags: ["Command Injection", "execFile", "Node.js", "Security"],
    fileName: "imageProcessor.ts",
    completed: false,
    instruction: "Lee el snippet y elige la vulnerabilidad que contiene.",
    theory: "La inyección de comandos ocurre cuando argumentos provistos por el usuario se pasan a funciones que ejecutan shells (`sh`, `bash`, `cmd.exe`), permitiendo encadenar comandos maliciosos.",
    explanationText: "🌍 Ejemplo cotidiano: exec es como darle al operador la frase completa por el interfono con el altavoz abierto: cualquier ';' o '|' se convierte en una orden nueva. execFile es entregarle una orden escrita: 'imprime este archivo', y el archivo va en una lista aparte, no se lee como texto interpretable.\n\nexecFile ejecuta directamente el binario con un arreglo de argumentos, sin pasar por la shell del sistema operativo. Así, metacaracteres como '; rm -rf /' quedan como texto literal del argumento en vez de comandos encadenados.",
    codeSnippet: `import { exec } from 'node:child_process';

// Procesa la imagen que el usuario subió
exec(\`convert \${userFilename} output.png\`);`,
    inputs: {},
    completeCode: `import { execFile } from 'node:child_process';
const args = [userFilename, 'output.png'];
execFile('/usr/bin/convert', args, (error, stdout) => { ... });`,
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué vulnerabilidad contiene este snippet?",
      snippet: `import { exec } from 'node:child_process';

exec(\`convert \${userFilename} output.png\`);`,
      options: [
        "OS Command Injection: exec() abre una shell y userFilename puede encadenar comandos con ';' o '|'.",
        "Mass Assignment: userFilename inyecta propiedades no permitidas.",
        "Deserialización insegura: el payload instancia objetos arbitrarios.",
        "ReDoS: la ruta del archivo dispara backtracking exponencial.",
      ],
      correct: 0,
    },
  },
  {
    id: 4,
    title: "Path Traversal: Sanitización de Rutas de Archivos",
    stars: 3,
    category: "PATH TRAVERSAL",
    description: "Evita que atacantes accedan a archivos del sistema mediante secuencias '../' validando la ruta resuelta contra el directorio base.",
    objective: "Sanitizar y validar paths de archivos",
    tags: ["Path Traversal", "path.basename", "normalize", "Node.js"],
    fileName: "fileServer.ts",
    completed: false,
    instruction: "Usa path.basename o verifica que la ruta resuelta permanezca dentro del directorio permitido.",
    theory: "Path Traversal permite acceder a archivos fuera del directorio web o permitido (ej. `/etc/passwd` o `.env`) mediante secuencias de navegación como `../../`.",
    explanationText: "🌍 Ejemplo cotidiano: Es un conserje que solo escucha el nombre del paquete, no la dirección completa: aunque el remitente escriba '../../etc/passwd', el conserje solo entiende 'passwd' y no puede salir de la recepción.\n\npath.basename extrae solo la parte final del nombre del archivo, eliminando cualquier directorio relativo (../). La segunda barrera, comparar con startsWith(PUBLIC_DIR), confina la ruta resuelta dentro del directorio permitido: así los ataques a /etc/passwd o .env quedan bloqueados aunque algo se cuele.",
    codeSnippet: `import path from 'node:path';

const PUBLIC_DIR = path.resolve('/var/www/uploads');

// Extrae solo el nombre del archivo de la entrada del usuario
const safeFilename = path.[INPUT_1](req.query.file);
const filePath = path.join(PUBLIC_DIR, safeFilename);

// Verifica que el path resultante pertenezca a PUBLIC_DIR
if (!filePath.[INPUT_2](PUBLIC_DIR)) {
  throw new Error('Acceso no autorizado a archivo');
}`,
    inputs: {
      INPUT_1: "basename",
      INPUT_2: "startsWith",
    },
    completeCode: `const safeFilename = path.basename(req.query.file);
const filePath = path.join(PUBLIC_DIR, safeFilename);
if (!filePath.startsWith(PUBLIC_DIR)) { throw new Error('Acceso no autorizado'); }`,
  },
  {
    id: 5,
    title: "BOLA / IDOR: Autorización a Nivel de Objeto",
    stars: 4,
    category: "IDOR / BOLA",
    description: "Identifica el controlador que sí verifica que el usuario autenticado sea dueño del recurso solicitado.",
    objective: "Reconocer la autorización BOLA correcta",
    tags: ["BOLA", "IDOR", "Authorization", "OWASP"],
    fileName: "documentController.ts",
    completed: false,
    instruction: "Elige el snippet que implementa correctamente la autorización BOLA.",
    theory: "BOLA/IDOR ocurre cuando una API expone identificadores de objetos (`/api/documents/1024`) sin verificar si el usuario que realiza la petición posee permisos sobre dicho objeto específico.",
    explanationText: "🌍 Ejemplo cotidiano: Que muestres tu carné en la puerta no te da derecho a la taquilla de otro: la autenticación (quién eres) y la autorización (qué te pertenece) son verificaciones distintas, y la API no puede mezclarlas.\n\nAutenticarse no implica autorización automática sobre cualquier ID: hay que filtrar por el ID de la sesión (WHERE ownerId = req.user.id) o verificar explícitamente que document.ownerId coincida. Sin esa comprobación, cualquiera puede recorrer IDs y leer recursos ajenos: es la vulnerabilidad nº 1 de OWASP API Security.",
    codeSnippet: `// Dos controladores para GET /api/documents/:docId`,
    inputs: {},
    completeCode: `if (document.ownerId !== req.user.id) {
  throw new ForbiddenError('No tienes permisos para ver este documento');
}`,
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál de los dos controladores implementa correctamente la autorización BOLA?",
      snippets: [
        {
          id: "inseguro",
          label: "Opción A",
          description: "Devuelve cualquier documento por su ID sin comprobar al dueño.",
          code: `app.get('/api/documents/:docId', async (req, res) => {
  const doc = await db.documents.findById(req.params.docId);
  res.json(doc);
});`,
        },
        {
          id: "seguro",
          label: "Opción B",
          description: "Verifica que el documento pertenezca al usuario de la sesión.",
          code: `app.get('/api/documents/:docId', async (req, res) => {
  const doc = await db.documents.findById(req.params.docId);
  if (!doc || doc.ownerId !== req.user.id) {
    return res.status(403).send('No autorizado');
  }
  res.json(doc);
});`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 6,
    title: "Prototype Pollution: Mapas Limpios y Congelado",
    stars: 4,
    category: "PROTOTYPE POLLUTION",
    description: "Previene la contaminación del prototipo de JavaScript utilizando objetos sin prototipo heredado u Object.freeze.",
    objective: "Proteger Object.prototype contra inyecciones",
    tags: ["Prototype Pollution", "Object.create", "freeze", "JavaScript"],
    fileName: "mergeUtils.ts",
    completed: false,
    instruction: "Crea objetos sin prototipo heredado usando Object.create(null) o deshabilita modificaciones a prototipos.",
    theory: "Prototype Pollution permite a un atacante inyectar propiedades en `Object.prototype` modificando claves como `__proto__` o `constructor.prototype`, alterando el comportamiento de todos los objetos en la aplicación.",
    explanationText: "🌍 Ejemplo cotidiano: Es como si alguien modificara el manual de la empresa en vez de su propia ficha: al tocar la plantilla maestra (Object.prototype), todos los objetos heredan lo inyectado y la app entera cambia de comportamiento.\n\nObject.create(null) genera un diccionario sin el prototipo global de Object, así que claves como __proto__ o constructor.prototype no encuentran dónde alterar la cadena de herencia. Object.freeze(Object.prototype) complementa: congela la plantilla maestra para que ninguna fusión de datos la modifique.",
    codeSnippet: `// ❌ VULNERABLE: const map = {}; map[key] = value; (permite key = "__proto__")

// ✅ SEGURO 1: Crear diccionario sin prototipo base
const safeMap = Object.create([INPUT_1]);

// ✅ SEGURO 2: Congelar el prototipo global al iniciar la app
Object.[INPUT_2](Object.prototype);`,
    inputs: {
      INPUT_1: "null",
      INPUT_2: "freeze",
    },
    completeCode: `const safeMap = Object.create(null);
Object.freeze(Object.prototype);`,
  },
  {
    id: 7,
    title: "Mass Assignment: Filtrado Estricto de DTOs con Zod",
    stars: 3,
    category: "MASS ASSIGNMENT",
    description: "Evita la inyección masiva de propiedades en modelos de base de datos validando la entrada con un esquema DTO estricto.",
    objective: "Proteger propiedades sensibles contra auto-asignación",
    tags: ["Mass Assignment", "Zod", "DTO", "Security"],
    fileName: "userService.ts",
    completed: false,
    instruction: "Define un esquema DTO explícito con Zod para permitir únicamente las propiedades que el usuario debe poder actualizar.",
    theory: "Mass Assignment ocurre cuando se pasan payloads JSON completos directamente a ORMs o bases de datos (`User.create(req.body)`), permitiendo a usuarios maliciosos inyectar propiedades como `isAdmin: true` o `role: 'admin'`.",
    explanationText: "🌍 Ejemplo cotidiano: Es un formulario en papel con campos ocultos: si el servidor lee TODO el formulario sin filtrar, el atacante puede rellenar una línea que tú nunca mostraste ('rol: admin') y la guardas igual.\n\nUsar un esquema DTO explícito con Zod ignora y descarta cualquier propiedad no definida antes de llegar a la base de datos. Pasar req.body directamente al ORM (User.create(req.body)) acepta cualquier campo inyectado; un z.object estricto define exactamente qué puede actualizar el usuario.",
    codeSnippet: `import { z } from 'zod';

// ✅ Esquema estricto: solo permite actualizar name y bio
const UpdateProfileSchema = [INPUT_1]({
  name: z.string().min(2),
  bio: z.string().optional()
});

// Parsea y filtra el payload de la petición
const cleanData = UpdateProfileSchema.parse(req.body);

// Usa pick u omite propiedades sensibles
await db.user.update({
  where: { id: req.user.id },
  data: [INPUT_2]
});`,
    inputs: {
      INPUT_1: "z.object",
      INPUT_2: ["cleanData", "validatedData"],
    },
    completeCode: `const UpdateProfileSchema = z.object({ name: z.string(), bio: z.string().optional() });
const cleanData = UpdateProfileSchema.parse(req.body);
await db.user.update({ where: { id: req.user.id }, data: cleanData });`,
  },
  {
    id: 8,
    title: "Deserialización Insegura: Parsing Validado",
    stars: 4,
    category: "DESERIALIZATION",
    description: "Sustituye evaluadores u operaciones de deserialización arbitraria por JSON.parse() validado mediante esquemas.",
    objective: "Prevenir ejecución de código en deserialización",
    tags: ["Deserialization", "JSON.parse", "Zod", "Security"],
    fileName: "configLoader.ts",
    completed: false,
    instruction: "Evita eval() o parsers de objetos complejos, usando JSON.parse y validación con safeParse.",
    theory: "La deserialización insegura ocurre cuando se deserializan estructuras de datos que pueden instanciar objetos o ejecutar código arbitrario durante el proceso de des-serialización.",
    explanationText: "🌍 Ejemplo cotidiano: Es la diferencia entre leer el papel que acompaña al paquete (JSON.parse: solo datos) y permitir que el paquete se abra solo y ejecute sus instrucciones (eval/parsers con constructores): el payload del atacante se convierte en código que corre en tu servidor.\n\nJSON.parse solo construye tipos primitivos y objetos planos: no instancia clases ni ejecuta nada. Al combinarlo con safeParse de Zod se valida la estructura antes de usarla. La deserialización insegura (eval, pickle, yaml con constructores) es justo la que convierte datos en código ejecutable.",
    codeSnippet: `// ❌ VULNERABLE: const config = eval('(' + payload + ')');

// ✅ SEGURO: JSON.parse nativo + validación de esquema
const parsed = [INPUT_1](payload);
const result = ConfigSchema.[INPUT_2](parsed);

if (!result.success) {
  throw new Error('Configuración inválida');
}`,
    inputs: {
      INPUT_1: "JSON.parse",
      INPUT_2: "safeParse",
    },
    completeCode: `const parsed = JSON.parse(payload);
const result = ConfigSchema.safeParse(parsed);`,
  },
  {
    id: 9,
    title: "ReDoS: Prevención de ReDoS (Regex DoS)",
    stars: 4,
    category: "ReDoS",
    description: "Elige el validador de email que no es vulnerable a backtracking exponencial.",
    objective: "Evitar bloqueos del Event Loop por regex catastróficas",
    tags: ["ReDoS", "Regex", "Event Loop", "DoS"],
    fileName: "emailValidator.ts",
    completed: false,
    instruction: "Elige el validador de email seguro frente a ReDoS.",
    theory: "ReDoS (Regular Expression Denial of Service) ocurre cuando se evalúa una expresión regular con cuantificadores anidados (ej. `(a+)+$`) con una entrada diseñada para fallar al final, provocando un consumo del 100% de CPU en backtracking.",
    explanationText: "🌍 Ejemplo cotidiano: Es un guardia que, al ver una pulsera falsa, vuelve a revisar la misma fila una y otra vez en un bucle sin fin: con (a+)+ y una entrada diseñada para fallar al final, el backtracking prueba millones de combinaciones y la CPU queda atascada.\n\nEvitar grupos anidados repetidos como (a+)+ o (\\w+)+$ previene el backtracking exponencial que congela el Event Loop de Node.js. Mejor aún: usa validadores especializados como validator.isEmail, que son lineales por diseño y nunca se atascan.",
    codeSnippet: `// Dos validadores de email`,
    inputs: {},
    completeCode: `import validator from 'validator';
return validator.isEmail(email);`,
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál de los dos validadores es seguro frente a ReDoS?",
      snippets: [
        {
          id: "regex",
          label: "Opción A",
          description: "Regex con cuantificadores anidados (a+)+ — vulnerable a backtracking exponencial.",
          code: `function validateEmail(email: string): boolean {
  return /^([a-zA-Z0-9]+)+@domain\\.com$/.test(email);
}`,
        },
        {
          id: "validator",
          label: "Opción B",
          description: "Validador especializado, lineal por diseño y nunca se atasca.",
          code: `import validator from 'validator';

function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}`,
        },
      ],
      correct: 1,
    },
  },
  {
    id: 10,
    title: "Secrets Management: Manejo Seguro de Claves de API",
    stars: 2,
    category: "SECRETS MANAGEMENT",
    description: "Remueve credenciales y llaves API del código fuente cargándolas dinámicamente desde variables de entorno.",
    objective: "Prevenir fuga de credenciales en el repositorio",
    tags: ["Secrets", "Environment Variables", "dotenv", "Security"],
    fileName: "paymentClient.ts",
    completed: false,
    instruction: "Lee la clave secreta desde process.env y lanza un error si la variable no está definida.",
    theory: "Grabar secretos, contraseñas o tokens en el código fuente provoca fugas de seguridad inmediatas al subir cambios a repositorios de control de versiones como GitHub.",
    explanationText: "🌍 Ejemplo cotidiano: Es dejar la llave de la oficina bajo el felpudo y publicar una foto del felpudo: una vez que el secreto entra a git, queda en el historial para siempre, aunque lo borres después.\n\nLas variables de entorno leen la configuración del entorno de ejecución o del secret manager de la nube, sin exponer secretos en el repositorio. El throw al faltar la variable (fail-fast) evita arrancar el servicio con una configuración rota que después falla de forma críptica en producción.",
    codeSnippet: `// ❌ VULNERABLE: const API_KEY = "sk_live_secret123456789";

// ✅ SEGURO: Cargar desde process.env con aserción de existencia
const apiKey = [INPUT_1].PAYMENT_API_KEY;

if (!apiKey) {
  [INPUT_2] new Error('PAYMENT_API_KEY no está configurada en las variables de entorno');
}`,
    inputs: {
      INPUT_1: "process.env",
      INPUT_2: "throw",
    },
    completeCode: `const apiKey = process.env.PAYMENT_API_KEY;
if (!apiKey) { throw new Error('PAYMENT_API_KEY no está configurada'); }`,
  },
];
