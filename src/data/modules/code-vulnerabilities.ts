import type { Exercise } from '../../lib/types';

export const CODE_VULNERABILITIES_EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "SQL Injection (SQLi): Consultas Parametrizadas",
    stars: 3,
    category: "SQL INJECTION",
    description: "Reemplaza la concatenación de variables en la consulta SQL por parámetros posicionales o nombrados para prevenir SQL Injection.",
    objective: "Uso de consultas parametrizadas",
    tags: ["SQLi", "Parameterized Query", "Security", "DB"],
    fileName: "usersRepository.ts",
    completed: false,
    instruction: "Corrige la consulta vulnerable sustituyendo la concatenación directa de cadenas por parámetros de consulta de forma segura.",
    theory: "SQL Injection ocurre cuando entradas de usuario no sanitizadas se concatenan directamente en comandos SQL. Al usar consultas parametrizadas, el motor de base de datos trata el input como un dato estricto y no como código ejecutable.",
    explanationText: "Las consultas parametrizadas envían el comando SQL y los datos por separado al motor de la base de datos, imposibilitando la ejecución de código malicioso inyectado.",
    codeSnippet: `// ❌ VULNERABLE: const sql = "SELECT * FROM users WHERE email = '" + req.body.email + "'";

// ✅ SEGURO: Consulta parametrizada
const query = 'SELECT * FROM users WHERE email = [INPUT_1]';
const values = [req.body.email];

const result = await db.query(query, [INPUT_2]);`,
    inputs: {
      INPUT_1: ["$1", "?", ":email"],
      INPUT_2: "values",
    },
    completeCode: `const query = 'SELECT * FROM users WHERE email = $1';
const values = [req.body.email];
const result = await db.query(query, values);`,
  },
  {
    id: 2,
    title: "Cross-Site Scripting (XSS): Sanitización y DOM Escape",
    stars: 3,
    category: "XSS",
    description: "Evita la inyección de código JavaScript arbitrario en la interfaz utilizando propiedades seguras del DOM o librerías de sanitización.",
    objective: "Mitigación de Reflected y Stored XSS",
    tags: ["XSS", "DOMPurify", "textContent", "Frontend"],
    fileName: "commentWidget.ts",
    completed: false,
    instruction: "Reemplaza innerHTML por textContent o sanitiza con DOMPurify para prevenir ataques XSS.",
    theory: "XSS permite a un atacante ejecutar scripts en el navegador de la víctima si la aplicación inserta datos de usuario directamente en la estructura HTML sin escapar o sanitizar previamente.",
    explanationText: "Usar textContent fuerza al navegador a tratar el contenido como texto plano de forma nativa. Para HTML enriquecido, DOMPurify elimina etiquetas peligrosas como <script> u atributos onerror.",
    codeSnippet: `// ❌ VULNERABLE: container.innerHTML = userComment;

// ✅ SEGURO 1: Para texto plano sin formato
element.[INPUT_1] = userComment;

// ✅ SEGURO 2: Para HTML permitido pero sanitizado
import DOMPurify from 'dompurify';
container.innerHTML = [INPUT_2].sanitize(userComment);`,
    inputs: {
      INPUT_1: "textContent",
      INPUT_2: "DOMPurify",
    },
    completeCode: `element.textContent = userComment;
container.innerHTML = DOMPurify.sanitize(userComment);`,
  },
  {
    id: 3,
    title: "OS Command Injection: Invocación Sin Shell",
    stars: 4,
    category: "COMMAND INJECTION",
    description: "Reemplaza llamadas vulnerables a exec() por execFile() pasando argumentos en un arreglo sin iniciar una subshell del sistema.",
    objective: "Eliminar el contexto de shell en ejecución de procesos",
    tags: ["Command Injection", "execFile", "Node.js", "Security"],
    fileName: "imageProcessor.ts",
    completed: false,
    instruction: "Usa execFile en lugar de exec para evitar que caracteres especiales como ';' o '|' ejecuten comandos adicionales.",
    theory: "La inyección de comandos ocurre cuando argumentos provistos por el usuario se pasan a funciones que ejecutan shells (`sh`, `bash`, `cmd.exe`), permitiendo encadenar comandos maliciosos.",
    explanationText: "execFile ejecuta directamente el archivo binario ejecutable sin pasar por la shell del sistema operativo, neutralizando metacaracteres inyectados como '; rm -rf /'.",
    codeSnippet: `import { [INPUT_1] } from 'node:child_process';

// ❌ VULNERABLE: exec(\`convert \${userFilename} output.png\`);

// ✅ SEGURO: Pasar ejecutable y argumentos separados
const args = [userFilename, 'output.png'];
[INPUT_1]('/usr/bin/convert', [INPUT_2], (error, stdout) => {
  if (error) throw error;
});`,
    inputs: {
      INPUT_1: "execFile",
      INPUT_2: "args",
    },
    completeCode: `import { execFile } from 'node:child_process';
const args = [userFilename, 'output.png'];
execFile('/usr/bin/convert', args, (error, stdout) => { ... });`,
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
    explanationText: "path.basename extrae solo la parte final del nombre del archivo eliminando cualquier directorio relativo. Además, comparar con startsWith asegura el confinamiento dentro de la ruta base.",
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
    description: "Evita vulnerabilidades BOLA (Broken Object Level Authorization) verificando que el usuario autenticado sea dueño del recurso solicitado.",
    objective: "Validar propiedad de recursos en peticiones API",
    tags: ["BOLA", "IDOR", "Authorization", "OWASP"],
    fileName: "documentController.ts",
    completed: false,
    instruction: "Inserta la verificación de pertenencia comparando el ID del usuario de la sesión con el propietario del documento.",
    theory: "BOLA/IDOR ocurre cuando una API expone identificadores de objetos (`/api/documents/1024`) sin verificar si el usuario que realiza la petición posee permisos sobre dicho objeto específico.",
    explanationText: "Autenticarse en el sistema no implica autorización automática sobre cualquier ID. Siempre se debe filtrar por el ID del usuario en la consulta o verificar explícitamente la propiedad.",
    codeSnippet: `const document = await db.documents.findById(req.params.docId);

if (!document) {
  return res.status(404).send('Documento no encontrado');
}

// ✅ SEGURO: Verificar que el recurso pertenezca al usuario de la sesión
if (document.ownerId !== [INPUT_1]) {
  throw new [INPUT_2]('No tienes permisos para ver este documento');
}`,
    inputs: {
      INPUT_1: ["req.user.id", "req.userId", "currentUser.id"],
      INPUT_2: ["ForbiddenError", "Error", "UnauthorizedError"],
    },
    completeCode: `if (document.ownerId !== req.user.id) {
  throw new ForbiddenError('No tienes permisos para ver este documento');
}`,
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
    explanationText: "Object.create(null) genera un diccionario sin el prototipo global de Object, por lo que claves inyectadas como `__proto__` no tienen efecto sobre la cadena de prototipos.",
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
    explanationText: "Usar un esquema DTO explícito con Zod ignora y descarta cualquier propiedad no definida en el esquema antes de tocar la base de datos.",
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
    explanationText: "JSON.parse solo construye tipos primitivos y objetos planos, previniendo la instanciación de clases o ejecución de código. Al combinarlo con safeParse de Zod se garantiza la validez de la estructura.",
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
    description: "Elimina patrones de expresiones regulares con cuantificadores anidados vulnerables a backtracking exponencial.",
    objective: "Evitar bloqueos del Event Loop por regex catastróficas",
    tags: ["ReDoS", "Regex", "Event Loop", "DoS"],
    fileName: "emailValidator.ts",
    completed: false,
    instruction: "Sustituye la regex vulnerable por un validador nativo o regex lineal sin cuantificadores superpuestos.",
    theory: "ReDoS (Regular Expression Denial of Service) ocurre cuando se evalúa una expresión regular con cuantificadores anidados (ej. `(a+)+$`) con una entrada diseñada para fallar al final, provocando un consumo del 100% de CPU en backtracking.",
    explanationText: "Evitar grupos anidados repetidos `(a+)+` o utilizar validadores especializados previene congelamientos del Event Loop de Node.js.",
    codeSnippet: `// ❌ VULNERABLE a ReDoS: /^([a-zA-Z0-9]+)+@domain\\.com$/

// ✅ SEGURO: Expresión regular lineal o validador estándar
import validator from 'validator';

function validateEmail(email: string): boolean {
  return [INPUT_1].isEmail(email);
}`,
    inputs: {
      INPUT_1: "validator",
    },
    completeCode: `import validator from 'validator';
return validator.isEmail(email);`,
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
    explanationText: "Las variables de entorno leen la configuración directamente del entorno de ejecución o secret manager de la nube, sin exponer secretos en el repositorio git.",
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
