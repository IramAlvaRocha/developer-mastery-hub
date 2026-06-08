// ══════════════════════════════════════════════════════════════════════════════
// NODE.JS BACKEND — 44 ejercicios con teoría (entrevista + producción)
// Cubre: API REST, JWT, Middleware, Interceptors, CORS, Rate Limiting,
// Clean Architecture, ORMs (Prisma), .env, Seguridad, Validación y más.
// ══════════════════════════════════════════════════════════════════════════════

const NODEJS_PRO_EXERCISES = [

  // ─── SECCIÓN 1: FUNDAMENTOS DE EXPRESS ──────────────────────────────────────

  {
    id: 1,
    title: "Express: Estructura Profesional de Proyecto",
    stars: 2,
    category: "SETUP",
    description: "Un proyecto Express profesional separa capas: routes, controllers, services, repositories. Esto se llama Clean Architecture o Layered Architecture.",
    objective: "Entender la arquitectura en capas de una API REST",
    tags: ["estructura", "clean architecture", "capas"],
    fileName: "project-structure.md",
    completed: false,
    theory: `📚 TEORÍA: Arquitectura en Capas (Layered Architecture)

Imagina un restaurante:
  • Routes      = El mesero (recibe el pedido y lo pasa a cocina)
  • Controller  = El jefe de cocina (coordina quién hace qué)  
  • Service     = El cocinero especialista (la lógica de negocio)
  • Repository  = El almacenista (accede a los datos/BD)
  • Model       = La receta/ingrediente (estructura de los datos)

¿Por qué separar capas?
  ✅ Testeable: puedes probar cada capa independiente
  ✅ Mantenible: cambias la BD sin tocar la lógica de negocio
  ✅ Escalable: múltiples desarrolladores trabajan en paralelo
  ✅ Principio SRP (Single Responsibility): cada archivo hace UNA cosa

Estructura recomendada:
  src/
  ├── routes/      → solo definen URLs y verbos HTTP
  ├── controllers/ → reciben req/res, delegan al service
  ├── services/    → lógica de negocio pura (sin req/res)
  ├── repositories/→ acceso a datos (Prisma, Firestore, etc.)
  ├── models/      → tipos/interfaces de TypeScript
  ├── middleware/  → funciones que interceptan requests
  ├── utils/       → funciones de utilidad reutilizables
  └── config/      → configuración centralizada`,
    explanationText: "Consejo senior: Nunca pongas lógica de negocio en los controllers ni queries SQL en los controllers. Cada capa solo conoce a la siguiente.",
    codeSnippet:
`// src/routes/userRoutes.ts — SOLO URLs y verbos
import { Router } from 'express';
import { [INPUT_1] } from '../controllers/userController';

const router = [INPUT_2]();
router.get('/', [INPUT_3].getAll);
router.get('/:id', userController.getById);
router.post('/', userController.[INPUT_4]);
export default router;`,
    inputs: { INPUT_1: "userController", INPUT_2: "Router", INPUT_3: "userController", INPUT_4: "create" },
    completeCode: "Router() | userController.getAll | userController.create — routes solo definen URLs"
  },

  {
    id: 2,
    title: "Controller: Separar Request/Response de la Lógica",
    stars: 3,
    category: "CONTROLLERS",
    description: "El controller recibe req/res de Express y delega TODO la lógica al service. Nunca hace queries directamente.",
    objective: "Controller limpio que solo coordina",
    tags: ["controller", "service", "async/await"],
    fileName: "controllers/userController.ts",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué hace un Controller?

Un controller es el intermediario entre HTTP y tu lógica de negocio:
  1. Extrae datos del request (params, body, query, headers)
  2. Llama al service con esos datos
  3. Devuelve la respuesta HTTP correcta

Lo que un controller NO debe hacer:
  ❌ Queries a la base de datos
  ❌ Lógica de negocio compleja
  ❌ Llamadas directas a APIs externas
  ❌ Validaciones complejas (van en middleware o service)

Códigos HTTP más usados en APIs REST:
  200 OK          → GET exitoso
  201 Created     → POST exitoso (nuevo recurso creado)
  204 No Content  → DELETE exitoso
  400 Bad Request → datos inválidos del cliente
  401 Unauthorized→ no autenticado
  403 Forbidden   → autenticado pero sin permiso
  404 Not Found   → recurso no existe
  409 Conflict    → duplicado (ej: email ya registrado)
  500 Server Error→ error interno (nunca exponer detalles al cliente)`,
    explanationText: "Truco: si tu controller tiene más de 20 líneas, algo debería estar en el service. Si tiene queries SQL, está mal.",
    codeSnippet:
`// controllers/userController.ts
export const userController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await [INPUT_1].getAll(); // delega al service
      res.[INPUT_2](200).json({ data: users });
    } catch (error) {
      [INPUT_3](error); // pasa al error handler global
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.create(req.[INPUT_4]);
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
};`,
    inputs: { INPUT_1: "userService", INPUT_2: "status", INPUT_3: "next", INPUT_4: "body" },
    completeCode: "userService.getAll() | res.status(200).json() | next(error) | req.body"
  },

  {
    id: 3,
    title: "Service Layer: Lógica de Negocio Pura",
    stars: 3,
    category: "SERVICES",
    description: "El service contiene la lógica de negocio. Es independiente de HTTP (sin req/res). Esto lo hace 100% testeable con unit tests.",
    objective: "Service sin dependencias de Express",
    tags: ["service", "business logic", "testeable"],
    fileName: "services/userService.ts",
    completed: false,
    theory: `📚 TEORÍA: ¿Por qué separar el Service?

El service es el corazón de tu aplicación. Su principal característica:
NO sabe que existe Express, HTTP ni ningún framework.

Ventajas de un service puro:
  ✅ Puedes testearlo con Vitest sin levantar un servidor
  ✅ Puedes reutilizarlo en diferentes entornos (API REST, GraphQL, CLI)
  ✅ Es fácil de leer y entender porque solo tiene lógica de negocio

Ejemplo de lógica de negocio en un service de usuarios:
  • Verificar que el email no esté ya registrado
  • Hashear la contraseña antes de guardar
  • Enviar email de bienvenida
  • Calcular permisos según el rol

Todas estas reglas van en el service, NO en el controller ni en el repository.`,
    explanationText: "Si puedes copiar y pegar tu service a una app de consola (CLI) sin cambiar nada, está bien diseñado.",
    codeSnippet:
`// services/userService.ts — sin Request ni Response
import { userRepository } from '../repositories/userRepository';
import { [INPUT_1] } from 'bcryptjs';
import { AppError } from '../utils/AppError';

export const userService = {
  create: async (data: CreateUserDTO) => {
    // Regla de negocio: email único
    const exists = await userRepository.findByEmail(data.[INPUT_2]);
    if (exists) throw new AppError('Email already in use', [INPUT_3]);

    // Regla de negocio: hashear contraseña
    const hashedPassword = await [INPUT_4](data.password, 12);
    return userRepository.create({ ...data, password: hashedPassword });
  }
};`,
    inputs: { INPUT_1: "hash", INPUT_2: "email", INPUT_3: "409", INPUT_4: "hash" },
    completeCode: "service sin req/res | AppError(msg, statusCode) | hash password | repository.create"
  },

  // ─── SECCIÓN 2: VARIABLES DE ENTORNO ────────────────────────────────────────

  {
    id: 4,
    title: ".env y Variables de Entorno: La Forma Correcta",
    stars: 2,
    category: "CONFIG",
    description: "Las variables de entorno separan la configuración del código. Nunca hardcodees URLs, contraseñas o API keys.",
    objective: "Config centralizada con validación",
    tags: [".env", "process.env", "dotenv", "validación"],
    fileName: "config/env.ts",
    completed: false,
    theory: `📚 TEORÍA: Variables de Entorno — El Principio 12-Factor App

La 12-Factor App (metodología de Heroku, adoptada por toda la industria) dice:
"Almacena la configuración en el entorno, no en el código."

¿Qué va en variables de entorno?
  ✅ DATABASE_URL, DB_PASSWORD
  ✅ JWT_SECRET, API_KEYS
  ✅ URLs de servicios externos (Firebase, Stripe, etc.)
  ✅ Configuración por ambiente (dev/staging/prod)

¿Qué NO va en variables de entorno?
  ❌ Lógica de negocio
  ❌ Configuración estática que nunca cambia

Archivos importantes:
  .env           → valores reales (NUNCA al git)
  .env.example   → plantilla con keys vacías (SÍ al git)
  .gitignore     → debe incluir .env

Validar al inicio:
  Si falta JWT_SECRET y tu app arranca igual, tienes un bug de seguridad.
  La app debe FALLAR al iniciar si faltan variables críticas.`,
    explanationText: "Regla de oro: si comiteaste un .env con contraseñas reales, considera esas contraseñas comprometidas. Cámbialas inmediatamente.",
    codeSnippet:
`// config/env.ts — validación al iniciar la app
import dotenv from '[INPUT_1]';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.[INPUT_2][key];
  if (!value) {
    throw new Error(\`Missing required env variable: \${key}\`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    url: [INPUT_3]('DATABASE_URL')
  },
  jwt: {
    secret: requireEnv('[INPUT_4]'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  }
} as const;`,
    inputs: { INPUT_1: "dotenv", INPUT_2: "env", INPUT_3: "requireEnv", INPUT_4: "JWT_SECRET" },
    completeCode: "dotenv.config() | requireEnv() que falla si falta | config as const exportado"
  },

  // ─── SECCIÓN 3: MIDDLEWARE ───────────────────────────────────────────────────

  {
    id: 5,
    title: "Middleware: ¿Qué es y Cómo Funciona?",
    stars: 2,
    category: "MIDDLEWARE",
    description: "El middleware es una función que se ejecuta ENTRE que llega el request y antes de que llegue al handler final. Es el corazón de Express.",
    objective: "Entender el pipeline de middleware",
    tags: ["middleware", "next()", "pipeline"],
    fileName: "middleware/example.ts",
    completed: false,
    theory: `📚 TEORÍA: El Pipeline de Middleware en Express

Express procesa cada request como una cadena de funciones middleware:
  Request → MW1 → MW2 → MW3 → Handler → Response

Cada middleware recibe (req, res, next) y puede:
  1. Ejecutar cualquier código
  2. Modificar req o res
  3. Llamar next() para pasar al siguiente middleware
  4. Terminar el ciclo llamando a res.json(), res.send(), etc.
  5. Llamar a next(error) para ir al error handler

Si un middleware NO llama next() ni responde, el request queda colgado (timeout).

Tipos de middleware:
  • Global:    app.use(middleware)     → se aplica a TODAS las rutas
  • Por ruta:  router.get('/', MW, handler) → solo esa ruta
  • De error:  (err, req, res, next)   → 4 parámetros, maneja errores

Middleware comunes:
  express.json()       → parsea body JSON
  cors()               → configura CORS
  morgan               → logging de requests
  helmet               → headers de seguridad
  express-rate-limit   → limita requests por IP`,
    explanationText: "Tip: el orden de app.use() importa. Si pones el auth middleware después del handler, el handler corre sin autenticación.",
    codeSnippet:
`// Anatomía de un middleware
function myMiddleware(req: Request, res: Response, [INPUT_1]: NextFunction) {
  console.log(\`\${req.[INPUT_2]} \${req.url} — \${new Date().toISOString()}\`);

  // Modificar el request (agregar datos para el siguiente middleware)
  (req as any).startTime = Date.now();

  [INPUT_3](); // OBLIGATORIO: pasar al siguiente middleware
}

// Middleware de error (4 parámetros — Express lo detecta automáticamente)
function errorHandler([INPUT_4]: Error, req: Request, res: Response, next: NextFunction) {
  const status = (error as any).statusCode || 500;
  res.status(status).json({ error: error.message });
}

app.use(myMiddleware); // global
app.use(errorHandler); // SIEMPRE al final`,
    inputs: { INPUT_1: "next", INPUT_2: "method", INPUT_3: "next", INPUT_4: "error" },
    completeCode: "(req, res, next) | next() para continuar | error handler: (err, req, res, next)"
  },

  {
    id: 6,
    title: "Middleware: Logging con Morgan",
    stars: 2,
    category: "MIDDLEWARE",
    description: "Morgan es el logger HTTP más usado en Express. Registra cada request con su método, URL, status y tiempo de respuesta.",
    objective: "Implementar logging HTTP profesional",
    tags: ["morgan", "logging", "combinado"],
    fileName: "middleware/logger.ts",
    completed: false,
    theory: `📚 TEORÍA: Logging en APIs — Por qué es Crítico

En producción, sin logs no puedes saber:
  ❓ ¿Por qué falló esa request a las 3am?
  ❓ ¿Cuántos usuarios están usando el endpoint /api/reports?
  ❓ ¿Hay alguien intentando hacer fuerza bruta en /api/login?

Niveles de log (de menor a mayor severidad):
  DEBUG   → información de desarrollo (solo en dev)
  INFO    → operaciones normales (request, response, inicio)
  WARN    → algo inusual pero no crítico (rate limit alcanzado)
  ERROR   → errores que necesitan atención
  FATAL   → errores que crashean la app

Formatos de Morgan:
  'dev'      → colorido, para desarrollo
  'combined' → formato Apache, para producción con más info
  'json'     → para sistemas que parsean logs estructurados

Herramienta avanzada: winston + winston-transport-gcp para
enviar logs directamente a Cloud Logging desde Node.js`,
    explanationText: "En producción usa 'combined' o JSON estructurado. En Cloud Run los logs van automáticamente a Cloud Logging si escribes a stdout.",
    codeSnippet:
`import [INPUT_1] from 'morgan';
import { config } from '../config/env';

// Formato diferente según el ambiente
export const httpLogger = morgan(
  config.nodeEnv === 'production' ? '[INPUT_2]' : 'dev'
);

// Morgan personalizado con tokens custom
morgan.token('user-id', (req: any) => req.user?.id || 'anonymous');
morgan.token('[INPUT_3]', (req) => req.headers['x-forwarded-for'] as string || req.ip);

export const detailedLogger = morgan(
  ':method :url :status :response-time ms — user=:[INPUT_4] ip=:real-ip'
);`,
    inputs: { INPUT_1: "morgan", INPUT_2: "combined", INPUT_3: "real-ip", INPUT_4: "user-id" },
    completeCode: "morgan('combined') prod | morgan('dev') local | token custom para user-id"
  },

  {
    id: 7,
    title: "Middleware: Helmet — Headers de Seguridad",
    stars: 3,
    category: "SEGURIDAD",
    description: "Helmet configura automáticamente headers HTTP de seguridad que protegen contra XSS, clickjacking y otros ataques comunes.",
    objective: "Hardening de headers HTTP",
    tags: ["helmet", "CSP", "XSS", "headers"],
    fileName: "middleware/security.ts",
    completed: false,
    theory: `📚 TEORÍA: Headers de Seguridad HTTP

Los headers de seguridad son instrucciones que el servidor le da al navegador:
"No ejecutes scripts de otros dominios", "No permitas que te pongan en un iframe", etc.

Headers que configura Helmet:
  Content-Security-Policy (CSP)
    → Define de dónde puede cargar scripts, estilos, imágenes
    → Previene XSS (Cross-Site Scripting)

  X-Frame-Options: DENY
    → El navegador no puede poner tu página en un <iframe>
    → Previene Clickjacking

  X-Content-Type-Options: nosniff
    → El navegador no "adivina" el tipo de archivo
    → Previene MIME type sniffing attacks

  Strict-Transport-Security (HSTS)
    → Fuerza HTTPS por N segundos
    → Previene downgrade a HTTP

  X-XSS-Protection
    → Activa el filtro XSS del navegador (legacy, CSP es mejor)

Sin Helmet, tu API devuelve headers como:
  X-Powered-By: Express  ← anuncia tu stack al atacante`,
    explanationText: "helmet() en una línea configura 14 headers de seguridad. No hay excusa para no usarlo.",
    codeSnippet:
`import [INPUT_1] from 'helmet';

// Configuración básica (aplica todos los defaults seguros)
app.use([INPUT_2]());

// Configuración personalizada para APIs con frontend separado
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "[INPUT_3]"], // si usas CDNs
    }
  },
  crossOriginResourcePolicy: { policy: '[INPUT_4]' }
}));

// Siempre deshabilitar X-Powered-By
app.disable('x-powered-by');`,
    inputs: { INPUT_1: "helmet", INPUT_2: "helmet", INPUT_3: "'cdn.jsdelivr.net'", INPUT_4: "cross-origin" },
    completeCode: "helmet() | contentSecurityPolicy | crossOriginResourcePolicy | disable x-powered-by"
  },

  // ─── SECCIÓN 4: CORS ────────────────────────────────────────────────────────

  {
    id: 8,
    title: "CORS: Entender y Configurar Correctamente",
    stars: 3,
    category: "CORS",
    description: "CORS (Cross-Origin Resource Sharing) es el mecanismo que permite o deniega requests de diferentes dominios. Mal configurado es una vulnerabilidad.",
    objective: "CORS seguro para producción",
    tags: ["cors", "origin", "credentials", "preflight"],
    fileName: "middleware/cors.ts",
    completed: false,
    theory: `📚 TEORÍA: CORS — El Error que Todos Encuentran

CORS es una política de seguridad del NAVEGADOR (no del servidor).
Cuando tu Vue app en localhost:3000 llama a tu API en localhost:8080,
el navegador bloquea la request si el servidor no dice "está bien, confío en ese origen".

¿Cuándo hay un error de CORS?
  → Dominios diferentes:      app.com    ← API llama a → api.com
  → Puertos diferentes:       :3000      ← →             :8080
  → Protocolos diferentes:    https://   ← →             http://

El flujo CORS:
  1. Navegador envía preflight (OPTIONS) preguntando permisos
  2. Servidor responde con los headers de permiso
  3. Si el navegador está satisfecho, envía la request real
  4. El servidor procesa y responde

Headers CORS importantes:
  Access-Control-Allow-Origin     → qué dominios pueden acceder
  Access-Control-Allow-Methods    → GET, POST, PUT, DELETE, etc.
  Access-Control-Allow-Headers    → Content-Type, Authorization, etc.
  Access-Control-Allow-Credentials→ permite cookies/tokens

⚠️ NUNCA en producción:
  origin: '*' con credentials: true → ES IMPOSIBLE (el navegador lo rechaza)
  origin: '*'                       → permite CUALQUIER dominio (peligroso para APIs privadas)`,
    explanationText: "CORS de '*' en producción es como dejar la puerta de tu casa abierta con un letrero de 'pasen'. Siempre especifica los orígenes permitidos.",
    codeSnippet:
`import cors from 'cors';
import { config } from '../config/env';

const allowedOrigins = config.nodeEnv === 'production'
  ? ['https://app.midominio.com', 'https://admin.midominio.com']
  : ['http://localhost:3000', 'http://localhost:5173'];

export const corsMiddleware = [INPUT_1]({
  [INPUT_2]: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, [INPUT_3]);
    } else {
      callback(new Error(\`CORS blocked: \${origin} not allowed\`));
    }
  },
  [INPUT_4]: true, // permite enviar cookies/tokens JWT
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Firebase-AppCheck']
});`,
    inputs: { INPUT_1: "cors", INPUT_2: "origin", INPUT_3: "true", INPUT_4: "credentials" },
    completeCode: "cors({ origin: fn, credentials: true }) | whitelist | callback(null, true)"
  },

  // ─── SECCIÓN 5: RATE LIMITING ────────────────────────────────────────────────

  {
    id: 9,
    title: "Rate Limiting: Proteger la API de Abuso",
    stars: 3,
    category: "SEGURIDAD",
    description: "Rate limiting limita cuántas requests puede hacer una IP en un período. Protege contra fuerza bruta, scraping y DDoS.",
    objective: "Rate limiting por ruta con express-rate-limit",
    tags: ["rate-limit", "DDoS", "brute force", "429"],
    fileName: "middleware/rateLimiter.ts",
    completed: false,
    theory: `📚 TEORÍA: Rate Limiting — Defensa en Capas

¿Por qué Rate Limiting?
  Fuerza bruta en /api/login: sin límite, un bot puede probar
  millones de contraseñas por hora. Con límite: 5 intentos por IP/hora.

  DDoS básico: sin límite, un atacante puede hacer millones de
  requests y colapsar tu servidor. Con límite: se corta antes.

  Web scraping: competidores raspando tu catálogo de productos.
  Con límite: lo haces económicamente inviable.

Estrategias de rate limiting:
  Por IP         → más básico pero fácil de bypassear con proxies
  Por usuario    → más preciso (requiere autenticación)
  Por API key    → para APIs públicas con planes de uso
  Sliding window → ventana deslizante (más justo que ventana fija)

Códigos HTTP relacionados:
  429 Too Many Requests → el cliente debe esperar
  Header Retry-After    → cuántos segundos debe esperar

Niveles recomendados:
  Global:        1000 req / 15 min por IP
  Login/Register: 5   req / 1 hora por IP (más estricto)
  API con token:  10000 req / hora por usuario`,
    explanationText: "Sin rate limit en /login es como tener una puerta blindada pero dejar que alguien intente claves indefinidamente. El rate limit es el guardia.",
    codeSnippet:
`import rateLimit from '[INPUT_1]';

// Limitador global — todas las rutas
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: [INPUT_2],            // máximo 100 requests por ventana
  standardHeaders: true,     // devuelve headers RateLimit-*
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Limitador estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: [INPUT_3],            // solo 5 intentos
  [INPUT_4]: (req) => req.ip + ':' + req.path // clave por IP+ruta
});

// Aplicar en routes
app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);`,
    inputs: { INPUT_1: "express-rate-limit", INPUT_2: "100", INPUT_3: "5", INPUT_4: "keyGenerator" },
    completeCode: "rateLimit({ windowMs, max, keyGenerator }) | globalLimiter y authLimiter separados"
  },

  // ─── SECCIÓN 6: JWT Y AUTENTICACIÓN ─────────────────────────────────────────

  {
    id: 10,
    title: "JWT: Anatomía y Funcionamiento",
    stars: 3,
    category: "JWT",
    description: "JWT (JSON Web Token) es el estándar para autenticación sin estado en APIs REST. Entender su estructura es fundamental.",
    objective: "Entender Header.Payload.Signature",
    tags: ["JWT", "HS256", "RS256", "payload"],
    fileName: "utils/jwt.ts",
    completed: false,
    theory: `📚 TEORÍA: JWT — Cómo Funciona Realmente

Un JWT tiene 3 partes separadas por puntos (.):
  eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOjF9  .  SflKxwRJSMeKKF2QT4

  HEADER               PAYLOAD              SIGNATURE
  (Base64)             (Base64)             (firmado con secreto)

Header: algoritmo de firma
  { "alg": "HS256", "typ": "JWT" }

Payload: los datos (claims)
  { "userId": 1, "role": "admin", "iat": 1234, "exp": 1234 }
  iat = issued at (cuándo se creó)
  exp = expiration (cuándo expira)

Signature: HMAC(header + "." + payload, secret)

¿Por qué es seguro?
  Si alguien modifica el payload, la firma no coincide → rechazado.
  PERO: el payload es solo Base64, no cifrado. ¡Cualquiera puede leerlo!
  NUNCA pongas contraseñas ni datos sensibles en el payload.

HS256 vs RS256:
  HS256 (simétrico): un secreto para firmar Y verificar
    → Simple pero si el secreto se filtra, todo compromiso
  RS256 (asimétrico): clave privada firma, clave pública verifica
    → Mejor para microservicios: cada servicio solo tiene la clave pública

Access Token vs Refresh Token:
  Access Token:  corta duración (15min - 1hr), va en Authorization header
  Refresh Token: larga duración (7-30 días), va en HttpOnly Cookie`,
    explanationText: "Regla: el JWT_SECRET debe ser de al menos 256 bits (32 chars aleatorios). Genera con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    codeSnippet:
`import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
  userId: number;
  role: string;
}

export const jwtUtils = {
  sign: (payload: JWTPayload): string => {
    return jwt.[INPUT_1](payload, config.jwt.secret, {
      expiresIn: config.jwt.[INPUT_2],
      issuer: 'mi-app'  // quien emite el token
    });
  },

  verify: (token: string): JWTPayload => {
    try {
      return jwt.[INPUT_3](token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      if ((error as Error).name === '[INPUT_4]') {
        throw new AppError('Token expired, please login again', 401);
      }
      throw new AppError('Invalid token', 401);
    }
  }
};`,
    inputs: { INPUT_1: "sign", INPUT_2: "expiresIn", INPUT_3: "verify", INPUT_4: "TokenExpiredError" },
    completeCode: "jwt.sign(payload, secret, { expiresIn }) | jwt.verify | TokenExpiredError handling"
  },

  {
    id: 11,
    title: "Middleware de Autenticación JWT",
    stars: 3,
    category: "JWT",
    description: "El middleware de autenticación extrae y verifica el JWT de cada request, protegiendo las rutas privadas.",
    objective: "Proteger rutas con JWT middleware",
    tags: ["Bearer token", "Authorization header", "middleware"],
    fileName: "middleware/authenticate.ts",
    completed: false,
    theory: `📚 TEORÍA: El Flujo de Autenticación JWT

1. Login:
   Cliente → POST /api/auth/login { email, password }
   Servidor verifica credenciales
   Servidor genera JWT → responde con el token
   Cliente guarda el token (localStorage o memoria)

2. Request autenticado:
   Cliente → GET /api/protected
   Header: Authorization: Bearer eyJhbGci...
   Middleware extrae "Bearer eyJhbGci..."
   Middleware verifica el JWT
   Si válido: agrega req.user = { userId, role } y llama next()
   Si inválido: responde 401 Unauthorized

3. Logout:
   Con JWT puro no hay logout del servidor (sin estado = sin sesión)
   Soluciones:
   a) Token de corta duración + refresh token
   b) Blacklist de tokens revocados en Redis
   c) Cambiar el secreto (invalida TODOS los tokens)

¿Dónde guardar el token en el cliente?
  localStorage:  fácil pero vulnerable a XSS
  HttpOnly Cookie: más seguro (JS no puede leerla)
  Memoria (variable): más seguro, pero se pierde al recargar`,
    explanationText: "Nunca confíes en datos del JWT sin verificar la firma. Si el token es válido, confías. Si no, rechazas. Sin excepciones.",
    codeSnippet:
`export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.[INPUT_1];

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.[INPUT_2]('Bearer ')[1];

  try {
    const payload = jwtUtils.[INPUT_3](token);
    (req as AuthRequest).[INPUT_4] = payload; // disponible en el siguiente middleware
    next();
  } catch (error) {
    next(error); // AppError(401) ya creado en jwtUtils.verify
  }
};

// Middleware de autorización (después de authenticate)
export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };`,
    inputs: { INPUT_1: "authorization", INPUT_2: "split", INPUT_3: "verify", INPUT_4: "user" },
    completeCode: "header.split('Bearer ')[1] | jwtUtils.verify | req.user = payload | authorize(...roles)"
  },

  {
    id: 12,
    title: "Login y Generación de Tokens",
    stars: 3,
    category: "JWT",
    description: "El endpoint de login verifica credenciales, genera Access Token y Refresh Token con estrategias diferentes.",
    objective: "Endpoint de autenticación completo",
    tags: ["login", "bcrypt", "access token", "refresh token"],
    fileName: "controllers/authController.ts",
    completed: false,
    theory: `📚 TEORÍA: Access Token + Refresh Token

¿Por qué dos tokens?
  Access Token:  vida corta (15 min), viaja en cada request
    Si se roba: el atacante tiene acceso por 15 minutos máximo
  Refresh Token: vida larga (30 días), solo se usa para obtener nuevos access tokens
    Si se roba: el atacante puede renovar tokens (más riesgo)
    Por eso va en una HttpOnly Cookie (JS no puede leerla)

Flujo completo:
  1. Login → servidor da access_token (15min) + refresh_token (30d en cookie)
  2. Cada request → client envía access_token en Authorization header
  3. Access_token expirado → client llama POST /api/auth/refresh
  4. Servidor verifica refresh_token en cookie → genera nuevo access_token
  5. Logout → servidor borra la cookie del refresh_token

Riesgo de timing attack en comparación de contraseñas:
  ❌ password === hashedPassword  (timing diferente según chars iguales)
  ✅ bcrypt.compare(password, hash) (tiempo constante, resistente a timing)`,
    explanationText: "El timing attack es un ataque real: midiendo el tiempo de respuesta, un atacante puede saber cuántos caracteres de la contraseña acertó. bcrypt.compare lo evita.",
    codeSnippet:
`export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findByEmail(email);

      // Comparación de tiempo constante (previene timing attack)
      if (!user || !await bcrypt.[INPUT_1](password, user.password)) {
        // Mismo mensaje para email incorrecto y contraseña incorrecta
        throw new AppError('Invalid credentials', [INPUT_2]);
      }

      const accessToken = jwtUtils.sign({ userId: user.id, role: user.role });
      const refreshToken = jwtUtils.signRefresh({ userId: user.[INPUT_3] });

      // Refresh token en HttpOnly Cookie (JS no puede leerla)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: [INPUT_4],
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
      });

      res.json({ accessToken, user: { id: user.id, email: user.email } });
    } catch (error) { next(error); }
  }
};`,
    inputs: { INPUT_1: "compare", INPUT_2: "401", INPUT_3: "id", INPUT_4: "true" },
    completeCode: "bcrypt.compare | mismo error para email/pass inválidos | refreshToken en HttpOnly cookie"
  },

  // ─── SECCIÓN 7: VALIDACIÓN DE DATOS ─────────────────────────────────────────

  {
    id: 13,
    title: "Validación con Zod: Nunca Confíes en el Cliente",
    stars: 3,
    category: "VALIDACIÓN",
    description: "Zod valida y transforma datos del request con tipado TypeScript automático. Es el estándar moderno para validación en Node.js.",
    objective: "Validar body, params y query con Zod",
    tags: ["zod", "schema", "validate", "middleware"],
    fileName: "middleware/validate.ts",
    completed: false,
    theory: `📚 TEORÍA: Por qué Validar en el Servidor (Siempre)

Regla fundamental de seguridad:
  "Nunca confíes en datos que vienen del cliente."

Un usuario malicioso puede:
  • Enviar { age: "DROP TABLE users;" } en lugar de un número
  • Enviar campos extras que no esperabas (mass assignment attack)
  • Omitir campos requeridos y crashear tu app
  • Enviar un array de 1 millón de elementos (DoS por procesamiento)

Validación con Zod vs. express-validator vs. Joi:
  Zod          → TypeScript-first, inferencia de tipos automática ✅ Recomendado
  express-validator → más verboso, basado en cadenas
  Joi          → popular pero sin inferencia TS nativa

Zod te da:
  1. Validación del runtime (¿los datos son del tipo correcto?)
  2. Transformación (convierte "123" a número automáticamente)
  3. Tipos TypeScript inferidos (no necesitas interface separada)
  4. Mensajes de error claros y personalizables

Mass assignment attack:
  Si haces: user.update(req.body) sin validar,
  un atacante puede enviar { role: "admin" } y escalar privilegios.
  Zod con .pick() o .omit() previene esto.`,
    explanationText: "Zod.safeParse() devuelve { success, data, error } sin lanzar excepción. Úsalo cuando quieras manejar el error tú mismo.",
    codeSnippet:
`import { z } from '[INPUT_1]';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().[INPUT_2](),
    password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase and number'),
    role: z.enum(['user', 'editor']).default('[INPUT_3]') // nunca permite 'admin' desde afuera
  })
});

// Middleware genérico para validar con cualquier schema de Zod
export const validate = (schema: z.AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.[INPUT_4]({
      body: req.body, params: req.params, query: req.query
    });

    if (!result.success) {
      return next(new AppError(result.error.message, 400));
    }

    Object.assign(req, result.data); // reemplaza con datos validados/transformados
    next();
  };

// Uso: router.post('/', validate(createUserSchema), userController.create)`,
    inputs: { INPUT_1: "zod", INPUT_2: "email", INPUT_3: "user", INPUT_4: "safeParseAsync" },
    completeCode: "z.object({ body, params, query }) | schema.safeParseAsync | Object.assign(req, result.data)"
  },

  // ─── SECCIÓN 8: ERROR HANDLING ───────────────────────────────────────────────

  {
    id: 14,
    title: "Error Handling Global: AppError y Error Handler",
    stars: 4,
    category: "ERRORES",
    description: "Un sistema robusto de manejo de errores centraliza el formato de las respuestas de error y evita exponer detalles internos en producción.",
    objective: "Error handler centralizado y AppError custom",
    tags: ["AppError", "error handler", "stack trace"],
    fileName: "utils/AppError.ts",
    completed: false,
    theory: `📚 TEORÍA: Manejo Centralizado de Errores

Sin manejo centralizado:
  try { ... } catch (e) { res.status(500).json({ error: e.message }); }
  Repetido en CADA controller → inconsistente, difícil de mantener

Con manejo centralizado:
  1. Clase AppError: extiende Error con statusCode
  2. Error handler middleware: el ÚNICO lugar que formatea errores
  3. Controllers solo hacen: throw new AppError('msg', 404) o next(error)

Tipos de errores a manejar:
  AppError           → errores de negocio predecibles (404, 401, 409)
  ZodError           → errores de validación (400)
  JsonWebTokenError  → token inválido (401)
  PrismaClientError  → errores de BD (404, 409)
  Error              → errores inesperados (500) — NO exponer stack en prod

Información a devolver en error response:
  ✅ statusCode, message, status ('fail' o 'error')
  ✅ En desarrollo: stack trace para debugging
  ❌ En producción: nunca el stack trace (revela la arquitectura)
  ❌ Nunca exponer el mensaje de error de la BD (puede revelar el schema)`,
    explanationText: "Si ves el stack trace de tu app en producción en el navegador, tienes un bug de seguridad. El error handler debe filtrarlo.",
    codeSnippet:
`// utils/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly [INPUT_1]: number,
    public readonly isOperational = true // false = bug inesperado
  ) {
    super(message);
    this.name = 'AppError';
    Error.[INPUT_2](this); // limpia el stack trace
  }
}

// middleware/errorHandler.ts — SIEMPRE el último middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : '[INPUT_3]',
    message: err.message,
    // Solo en desarrollo:
    ...(![INPUT_4] && { stack: err.stack })
  });
};`,
    inputs: { INPUT_1: "statusCode", INPUT_2: "captureStackTrace", INPUT_3: "error", INPUT_4: "isProduction" },
    completeCode: "AppError extends Error | statusCode | captureStackTrace | no stack en prod"
  },

  // ─── SECCIÓN 9: PRISMA ORM ───────────────────────────────────────────────────

  {
    id: 15,
    title: "Prisma ORM: Introducción y Setup",
    stars: 3,
    category: "ORM",
    description: "Prisma es el ORM moderno para Node.js/TypeScript. Define el schema una vez y genera tipos TypeScript automáticamente.",
    objective: "Entender Prisma schema y Prisma Client",
    tags: ["Prisma", "schema.prisma", "PrismaClient", "migrate"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: ORMs — ¿Qué son y Por qué Usarlos?

ORM = Object-Relational Mapping
Traduce entre objetos de TypeScript y filas de una base de datos SQL.

Sin ORM (SQL crudo):
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
  → Funciona, pero sin tipos, propenso a SQL injection si no se usa bien

Con Prisma:
  const user = await prisma.user.findUnique({ where: { id } })
  → Type-safe, autocomplete, previene SQL injection

Prisma tiene 3 partes:
  1. Prisma Schema: define modelos (como un CREATE TABLE)
  2. Prisma Migrate: genera y aplica migraciones SQL
  3. Prisma Client: el cliente type-safe generado automáticamente

Prisma vs TypeORM vs Sequelize:
  Prisma     → mejor DX, tipos perfectos, más moderno ✅ Recomendado
  TypeORM    → más cercano a Java/C#, decorators
  Sequelize  → el más antiguo, menos type-safe

Comandos esenciales:
  npx prisma init          → inicializar
  npx prisma db push       → aplicar schema sin migración (dev rápido)
  npx prisma migrate dev   → crear migración y aplicarla
  npx prisma studio        → GUI para ver datos
  npx prisma generate      → regenerar el cliente`,
    explanationText: "Prisma genera un singleton del PrismaClient. Para evitar conexiones excesivas en desarrollo (hot reload), usa el patrón singleton que verás en el ejercicio siguiente.",
    codeSnippet:
`// prisma/schema.prisma
generator client {
  provider = "[INPUT_1]"
}

datasource db {
  provider = "postgresql"
  url      = [INPUT_2](DATABASE_URL)
}

model User {
  id        Int      @id @[INPUT_3]
  email     String   @unique
  name      String
  role      Role     @default(USER)
  password  String
  createdAt DateTime @[INPUT_4](now())
  posts     Post[]   // relación 1:N
}

enum Role {
  USER
  EDITOR
  ADMIN
}`,
    inputs: { INPUT_1: "prisma-client-js", INPUT_2: "env", INPUT_3: "default(autoincrement())", INPUT_4: "default" },
    completeCode: "generator client | datasource db | model User | @id @default | @default(now())"
  },

  {
    id: 16,
    title: "Prisma Client: Singleton y Queries CRUD",
    stars: 3,
    category: "ORM",
    description: "PrismaClient debe ser un singleton para no agotar las conexiones a la BD. Las queries son type-safe y expresivas.",
    objective: "CRUD completo con Prisma type-safe",
    tags: ["PrismaClient", "singleton", "findUnique", "create"],
    fileName: "lib/prisma.ts",
    completed: false,
    theory: `📚 TEORÍA: Singleton de PrismaClient

¿Por qué singleton?
  PrismaClient abre un pool de conexiones a la BD.
  Si creas una instancia nueva en cada request, agotas las conexiones
  (PostgreSQL por defecto tiene máx 100 conexiones simultáneas).

En desarrollo con hot reload:
  Cada vez que guardas un archivo, el módulo se recarga.
  Sin singleton: nuevas instancias acumuladas → memory leak + errores.

Solución: guardarlo en global en desarrollo.

Queries Prisma más usadas:
  findUnique({ where: { id } })        → buscar por campo único
  findFirst({ where: { role: 'ADMIN' }}) → primer match
  findMany({ where, orderBy, skip, take }) → lista con filtros
  create({ data: { name, email } })    → insertar
  update({ where: { id }, data })      → actualizar
  delete({ where: { id } })            → eliminar
  upsert({ where, create, update })    → insertar o actualizar
  count({ where })                     → contar registros`,
    explanationText: "Prisma tiene transacciones: prisma.$transaction([query1, query2]) para operaciones atómicas. Si una falla, todas se revierten.",
    codeSnippet:
`// lib/prisma.ts — patrón singleton
import { PrismaClient } from '@prisma/[INPUT_1]';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new [INPUT_2]({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.[INPUT_3] = prisma;
}

// repositories/userRepository.ts
export const userRepository = {
  findAll: () => prisma.user.findMany({ select: { id: true, name: true, email: true } }),
  findByEmail: (email: string) => prisma.user.findUnique({ [INPUT_4]: { email } }),
  create: (data: CreateUserData) => prisma.user.create({ data })
};`,
    inputs: { INPUT_1: "client", INPUT_2: "PrismaClient", INPUT_3: "prisma", INPUT_4: "where" },
    completeCode: "globalThis singleton | new PrismaClient({ log: ['query'] }) | findMany | findUnique({ where })"
  },

  {
    id: 17,
    title: "Prisma: Relaciones y Queries Avanzadas",
    stars: 4,
    category: "ORM",
    description: "Prisma maneja relaciones 1:N y N:M con include/select. Permite queries complejas con filtros y paginación.",
    objective: "Joins, include y paginación con Prisma",
    tags: ["include", "select", "pagination", "where"],
    fileName: "repositories/postRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Relaciones en Prisma

Tipos de relaciones:
  1:1  User ↔ Profile     → @relation en ambos modelos
  1:N  User → Post[]      → author en Post, posts[] en User
  N:M  Post ↔ Tag[]       → tabla intermedia automática

include vs select:
  include: { author: true }       → trae TODOS los campos del author
  select: { author: { name, email }} → solo los campos que necesitas
  ⚠️ NUNCA hagas include sin select en datos sensibles
  (podrías exponer el password del author inadvertidamente)

Paginación:
  Offset-based: skip/take → simple pero lento en tablas grandes
    prisma.post.findMany({ skip: page * size, take: size })
  Cursor-based: más eficiente → basado en el último ID
    prisma.post.findMany({ cursor: { id: lastId }, take: size })

Filtros:
  where: { title: { contains: 'vue', mode: 'insensitive' } }
  where: { AND: [{ published: true }, { authorId: userId }] }
  where: { OR: [{ role: 'ADMIN' }, { role: 'EDITOR' }] }`,
    explanationText: "Siempre usa select para excluir campos sensibles como password. Un include sin select en una query que devuelves al cliente es una fuga de datos.",
    codeSnippet:
`export const postRepository = {
  findAllPublished: async (page: number, limit: number) => {
    const [posts, total] = await prisma.$[INPUT_1]([
      prisma.post.findMany({
        where: { published: true },
        [INPUT_2]: { // cargar relaciones
          author: { select: { name: true, email: true } }, // SIN password
          tags: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        [INPUT_3]: limit
      }),
      prisma.post.count({ where: { published: true } })
    ]);

    return {
      data: posts,
      meta: { total, page, limit, totalPages: Math.[INPUT_4](total / limit) }
    };
  }
};`,
    inputs: { INPUT_1: "transaction", INPUT_2: "include", INPUT_3: "take", INPUT_4: "ceil" },
    completeCode: "prisma.$transaction([query1, count]) | include con select | skip/take | Math.ceil"
  },

  // ─── SECCIÓN 10: RUTAS Y ORGANIZACIÓN ───────────────────────────────────────

  {
    id: 18,
    title: "Express Router: Organización de Rutas",
    stars: 2,
    category: "ROUTES",
    description: "express.Router() crea mini-aplicaciones de rutas que se montan en la app principal. Mantiene el código organizado por dominio.",
    objective: "Rutas modulares con versioning de API",
    tags: ["Router", "versioning", "modular"],
    fileName: "routes/index.ts",
    completed: false,
    theory: `📚 TEORÍA: Versionado de APIs — /api/v1 vs /api/v2

¿Por qué versionar?
  Tu API tiene clientes (apps móviles, frontends, terceros).
  Si cambias un endpoint, los clientes existentes se rompen.
  El versionado permite:
    • /api/v1/users → comportamiento antiguo (no lo rompes)
    • /api/v2/users → nuevo comportamiento
    • Los clientes migran a su ritmo

Estrategias de versionado:
  URL path:      /api/v1/users ← más visible y fácil de entender ✅
  Header:        Api-Version: 1 ← más limpio en URL
  Query param:   /api/users?version=1 ← menos recomendado

Convenciones REST:
  GET    /users           → lista todos
  POST   /users           → crear nuevo
  GET    /users/:id       → obtener uno
  PUT    /users/:id       → reemplazar completo
  PATCH  /users/:id       → actualizar parcialmente
  DELETE /users/:id       → eliminar

PUT vs PATCH:
  PUT:   envías TODOS los campos (aunque no cambien)
  PATCH: envías SOLO los campos que cambian`,
    explanationText: "Siempre versiona tu API desde el principio aunque solo tengas v1. Agregar versionado después es mucho más doloroso.",
    codeSnippet:
`// routes/index.ts — punto central de rutas
import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';

const router = [INPUT_1]();

// Montar rutas por dominio
router.use('/users', [INPUT_2]);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

// app.ts — montar con versionado
app.use('/api/[INPUT_3]', router);

// Health check (sin versionar, para load balancers y monitoreo)
app.get('/[INPUT_4]', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});`,
    inputs: { INPUT_1: "Router", INPUT_2: "userRoutes", INPUT_3: "v1", INPUT_4: "health" },
    completeCode: "Router() | use('/users', routes) | /api/v1 versioning | /health endpoint"
  },

  {
    id: 19,
    title: "Params, Query y Body: Acceso Correcto",
    stars: 2,
    category: "ROUTES",
    description: "Express tiene 3 formas de recibir datos: params (URL), query string y body. Cada uno tiene su caso de uso.",
    objective: "Distinguir params, query y body",
    tags: ["req.params", "req.query", "req.body"],
    fileName: "routes/examples.ts",
    completed: false,
    theory: `📚 TEORÍA: Tipos de Parámetros en HTTP

req.params → segmentos dinámicos de la URL
  GET /users/123/posts/456
  router.get('/users/:userId/posts/:postId', ...)
  req.params = { userId: '123', postId: '456' }
  ⚠️ Siempre son strings, convierte a número con Number()

req.query → query string después del ?
  GET /users?page=2&limit=10&role=admin
  req.query = { page: '2', limit: '10', role: 'admin' }
  ⚠️ También son strings, valida con Zod

req.body → cuerpo de la request (POST, PUT, PATCH)
  Requiere middleware: app.use(express.json())
  POST /users  → body: { name: 'Iram', email: '...' }

req.headers → headers HTTP
  req.headers.authorization → 'Bearer eyJhbGci...'
  req.headers['content-type'] → 'application/json'

Cuándo usar cada uno:
  params → identificar un recurso específico (/users/123)
  query  → filtrar, paginar, ordenar (?page=2&sort=name)
  body   → datos complejos de creación/actualización`,
    explanationText: "req.params.id siempre es string. Si tu BD espera un número, usa Number(req.params.id) o z.coerce.number() con Zod.",
    codeSnippet:
`// GET /api/v1/users/123/posts?page=2&limit=10&published=true
router.get('/:userId/posts', async (req, res, next) => {
  // params: identifican el recurso
  const userId = Number(req.[INPUT_1].userId);

  // query: filtros opcionales
  const page = Number(req.[INPUT_2].page) || 1;
  const limit = Number(req.query.limit) || 10;
  const published = req.query.[INPUT_3] === 'true';

  const posts = await postRepository.findByUser(userId, { page, limit, [INPUT_4] });
  res.json({ data: posts });
});

// POST /api/v1/users
router.post('/', validate(createUserSchema), async (req, res, next) => {
  const user = await userService.create(req.body); // req.body tiene los datos validados
  res.status(201).json({ data: user });
});`,
    inputs: { INPUT_1: "params", INPUT_2: "query", INPUT_3: "published", INPUT_4: "published" },
    completeCode: "req.params.id | req.query.page | req.body | Number() para convertir strings"
  },

  // ─── SECCIÓN 11: SEGURIDAD ADICIONAL ────────────────────────────────────────

  {
    id: 20,
    title: "SQL Injection Prevention con Prisma",
    stars: 3,
    category: "SEGURIDAD",
    description: "Prisma previene SQL Injection por defecto usando prepared statements. Pero hay casos donde puedes romper esa protección.",
    objective: "Entender por qué Prisma es seguro y cuándo no",
    tags: ["SQL Injection", "prepared statements", "prisma.queryRaw"],
    fileName: "security/sqlInjection.ts",
    completed: false,
    theory: `📚 TEORÍA: SQL Injection — El Ataque #1 en OWASP

SQL Injection ocurre cuando datos del usuario se insertan directamente en una query SQL.

Ejemplo vulnerable (SQL crudo sin sanitizar):
  const users = await db.query(
    "SELECT * FROM users WHERE email = '" + req.body.email + "'"
  );
  Si email = "' OR '1'='1" → devuelve TODOS los usuarios
  Si email = "'; DROP TABLE users; --" → borra la tabla

¿Por qué Prisma es seguro?
  Prisma usa prepared statements internamente:
  prisma.user.findUnique({ where: { email } })
  → Internamente: SELECT * FROM users WHERE email = $1 (con parámetro)
  Los datos NUNCA se concatenan en la query → imposible SQL Injection

Cuándo SÍ puedes tener SQL Injection con Prisma:
  prisma.$queryRawUnsafe(
    "SELECT * FROM users WHERE email = '" + email + "'"  ← VULNERABLE
  )

La forma segura con raw queries:
  prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`
  (Tagged template literal → Prisma lo parametriza automáticamente)`,
    explanationText: "Regla: nunca concatenes strings en SQL queries. Siempre usa parámetros o el ORM. Si ves + en una query, es una red flag.",
    codeSnippet:
`// ✅ SEGURO: Prisma API standard
const user = await prisma.user.findUnique({
  where: { [INPUT_1]: req.body.email } // parametrizado automáticamente
});

// ✅ SEGURO: raw query con tagged template literal
const users = await prisma.$[INPUT_2]\`
  SELECT id, name FROM users
  WHERE role = \${req.query.role} AND active = true
\`;

// ❌ VULNERABLE: queryRawUnsafe con concatenación
const bad = await prisma.$[INPUT_3](
  "SELECT * FROM users WHERE role = '" + [INPUT_4] + "'"
);

// ✅ SEGURO: queryRawUnsafe con parámetros posicionales
const safe = await prisma.$queryRawUnsafe(
  "SELECT * FROM users WHERE role = $1", req.query.role
);`,
    inputs: { INPUT_1: "email", INPUT_2: "queryRaw", INPUT_3: "queryRawUnsafe", INPUT_4: "req.query.role" },
    completeCode: "prisma.model.find → seguro | $queryRaw\`...\` → seguro | $queryRawUnsafe con concat → VULNERABLE"
  },

  {
    id: 21,
    title: "XSS Prevention en APIs Node.js",
    stars: 3,
    category: "SEGURIDAD",
    description: "Las APIs JSON son menos vulnerables a XSS que páginas HTML, pero aún deben sanitizar datos antes de almacenarlos.",
    objective: "Sanitización de inputs con DOMPurify / validator.js",
    tags: ["XSS", "sanitize", "validator.js", "input"],
    fileName: "utils/sanitize.ts",
    completed: false,
    theory: `📚 TEORÍA: XSS en APIs REST — ¿Cuándo es un Problema?

XSS (Cross-Site Scripting): inyección de código JS malicioso.

API REST que devuelve JSON no renderiza HTML → menor riesgo directo.
PERO el riesgo existe si:
  1. Tu API guarda datos que OTRO lugar renderiza como HTML
     (ej: guardar "<script>..." en el nombre de un usuario
     y luego el frontend lo pone en innerHTML sin escapar)
  2. Tu API sirve páginas HTML directamente (server-side render)

Estrategia de defensa:
  1. Sanitizar al entrar:  limpiar HTML antes de guardar en BD
  2. Escapar al salir:     el frontend usa innerText/textContent no innerHTML
  3. CSP Header:           helmet() configura Content-Security-Policy

Librería validator.js:
  escape('<script>') → '&lt;script&gt;'
  stripLow(str)      → elimina chars de control
  trim(str)          → elimina espacios

DOMPurify (en servidor con jsdom):
  DOMPurify.sanitize('<img onerror="evil()">')
  → '<img>' (elimina atributos peligrosos)`,
    explanationText: "La defensa en profundidad dice: sanitiza en el servidor Y escapa en el cliente. Un sola capa puede fallar; dos capas son mucho más difíciles de bypassear.",
    codeSnippet:
`import validator from 'validator';

export const sanitize = {
  // Escapar HTML: < > & " '
  html: (str: string) => validator.[INPUT_1](str.trim()),

  // Limpiar para almacenar texto plano
  text: (str: string) => validator
    .stripLow(str.trim()) // elimina chars de control
    .[INPUT_2]('\\n', ' '), // reemplaza saltos de línea

  // Sanitizar URL (previene javascript: URLs)
  url: (url: string) => {
    if (![INPUT_3](url, { protocols: ['http', 'https'] })) {
      throw new AppError('Invalid URL', 400);
    }
    return url;
  }
};

// Middleware de sanitización global
app.use((req, res, [INPUT_4]) => {
  if (req.body?.name) req.body.name = sanitize.html(req.body.name);
  if (req.body?.bio) req.body.bio = sanitize.text(req.body.bio);
  next();
});`,
    inputs: { INPUT_1: "escape", INPUT_2: "replace", INPUT_3: "validator.isURL", INPUT_4: "next" },
    completeCode: "validator.escape | stripLow | isURL({ protocols: ['http','https'] }) | middleware sanitización"
  },

  {
    id: 22,
    title: "HTTPS y Seguridad en Producción",
    stars: 3,
    category: "SEGURIDAD",
    description: "En producción, la app Node.js no debe manejar TLS directamente. El reverse proxy (Nginx, Cloud Run) se encarga del SSL/TLS.",
    objective: "Configuración segura para producción",
    tags: ["HTTPS", "reverse proxy", "HSTS", "trust proxy"],
    fileName: "app.ts",
    completed: false,
    theory: `📚 TEORÍA: HTTPS en la Arquitectura Real

Arquitectura típica en producción:
  Internet → CDN (Cloudflare) → Load Balancer → Cloud Run/Nginx → Node.js app

  El TLS/SSL termina en el Load Balancer o Cloud Run.
  Node.js recibe tráfico HTTP interno (dentro de la VPC).
  Por eso NO necesitas configurar HTTPS en Node directamente.

¿Por qué app.set('trust proxy', 1)?
  Sin esto, req.ip devuelve la IP del load balancer, no del cliente real.
  Con trust proxy: 1, Express confía en el header X-Forwarded-For
  que pone el load balancer con la IP real del cliente.

¿Por qué es peligroso trust proxy sin configurar bien?
  Si pones trust proxy: true sin límites, cualquier request puede
  falsificar X-Forwarded-For y bypassear el rate limiting por IP.
  trust proxy: 1 → confía solo en el primer proxy (el load balancer).

Headers de seguridad para producción:
  Strict-Transport-Security → fuerza HTTPS por 1 año
  X-Content-Type-Options    → no adivinar MIME type
  X-Frame-Options           → no en iframes (clickjacking)`,
    explanationText: "En Cloud Run, GCP maneja TLS automáticamente. Solo asegúrate de que tu app escuche en el PORT que inyecta Cloud Run (process.env.PORT).",
    codeSnippet:
`// app.ts — configuración de producción
const app = express();

// Confiar en 1 nivel de proxy (Cloud Run, Nginx, etc.)
app.set('trust [INPUT_1]', 1);

// Parsear JSON con límite de tamaño (previene payloads gigantes)
app.use(express.json({ [INPUT_2]: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Headers de seguridad con Helmet
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 año en segundos
    includeSubDomains: true,
    [INPUT_3]: true // lista preload HSTS del navegador
  }
}));

// server.ts — escuchar en el PORT de Cloud Run
const PORT = Number(process.env.[INPUT_4]) || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    inputs: { INPUT_1: "proxy", INPUT_2: "limit", INPUT_3: "preload", INPUT_4: "PORT" },
    completeCode: "trust proxy: 1 | json limit: '10kb' | HSTS maxAge 31536000 | PORT from env"
  },

  // ─── SECCIÓN 12: OPTIMIZACIÓN Y PATRONES AVANZADOS ──────────────────────────

  {
    id: 23,
    title: "Repository Pattern con Prisma",
    stars: 4,
    category: "CLEAN ARCHITECTURE",
    description: "El Repository Pattern encapsula el acceso a datos. Si cambias de Prisma a otro ORM, solo cambias el repository, no el service.",
    objective: "Abstraer la capa de datos",
    tags: ["Repository", "interface", "abstracción"],
    fileName: "repositories/userRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Repository Pattern — La Abstracción de Datos

¿Por qué usar Repository Pattern?
  Escenario real: empiezas con Prisma + PostgreSQL.
  En 6 meses migras parte de los datos a Firebase.
  Sin Repository Pattern: cambias el código en TODOS tus services.
  Con Repository Pattern: solo cambias el repository.

El service solo conoce la interfaz del repository, no la implementación:
  interface IUserRepository {
    findAll(): Promise<User[]>
    findById(id: number): Promise<User | null>
    create(data: CreateUserDTO): Promise<User>
  }

Puedes tener múltiples implementaciones:
  PrismaUserRepository    → usa PostgreSQL
  FirestoreUserRepository → usa Firebase
  InMemoryUserRepository  → solo para tests

Para tests unitarios:
  const mockRepo: IUserRepository = {
    findAll: vi.fn().mockResolvedValue([...]),
    findById: vi.fn(),
    create: vi.fn()
  };
  const service = new UserService(mockRepo); // inyección de dependencias`,
    explanationText: "El Repository Pattern es la razón por la que puedes testear el service sin una BD real. Inyectas un mock repository en los tests.",
    codeSnippet:
`// types/repositories.ts — el contrato (interfaz)
export interface [INPUT_1] {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}

// repositories/prismaUserRepository.ts — implementación real
export class PrismaUserRepository implements [INPUT_2] {
  findAll() {
    return prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  }
  findById(id: number) {
    return prisma.user.findUnique({ [INPUT_3]: { id } });
  }
  create(data: CreateUserDTO) {
    return prisma.user.[INPUT_4]({ data });
  }
}`,
    inputs: { INPUT_1: "IUserRepository", INPUT_2: "IUserRepository", INPUT_3: "where", INPUT_4: "create" },
    completeCode: "interface IUserRepository | implements IUserRepository | where: { id } | prisma.user.create"
  },

  {
    id: 24,
    title: "Dependency Injection Manual en Node.js",
    stars: 4,
    category: "CLEAN ARCHITECTURE",
    description: "Dependency Injection permite intercambiar implementaciones (real vs mock). Sin DI Container, se hace manualmente en la capa de composición.",
    objective: "Inyección de dependencias sin framework",
    tags: ["DI", "composición", "testeable"],
    fileName: "container.ts",
    completed: false,
    theory: `📚 TEORÍA: Dependency Injection — Inversión de Control

¿Qué problema resuelve?
  Sin DI: el service crea sus propias dependencias (acoplado):
    class UserService {
      private repo = new PrismaUserRepository(); // acoplado a Prisma
    }
  Con DI: las dependencias se inyectan desde fuera:
    class UserService {
      constructor(private repo: IUserRepository) {} // desacoplado
    }

Beneficios:
  ✅ Testeable: puedes inyectar un mock en tests
  ✅ Flexible: cambiar implementación sin tocar la clase
  ✅ Principio de Inversión de Dependencias (SOLID - la D)

En Node.js sin framework DI (NestJS, InversifyJS):
  Se usa un archivo "container" o "compose" que crea todas
  las instancias y las conecta manualmente.

Con NestJS: el framework maneja todo con decorators:
  @Injectable() class UserService { constructor(private repo) {} }
  @Module({ providers: [UserService, UserRepository] }) class AppModule {}`,
    explanationText: "NestJS es Express con DI, módulos y todo configurado. Si la empresa usa NestJS, el patrón de DI aquí es exactamente lo que NestJS hace internamente.",
    codeSnippet:
`// container.ts — composición de dependencias
import { PrismaUserRepository } from './repositories/prismaUserRepository';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';

// Crear instancias y conectarlas
const userRepository = new [INPUT_1]();
const userService = new UserService([INPUT_2]); // inyectar el repository
const userController = new [INPUT_3](userService); // inyectar el service

export { [INPUT_4] }; // exportar solo el controller

// routes/userRoutes.ts — usa el controller inyectado
router.get('/', (req, res, next) => userController.getAll(req, res, next));
router.post('/', validate(schema), (req, res, next) => userController.create(req, res, next));`,
    inputs: { INPUT_1: "PrismaUserRepository", INPUT_2: "userRepository", INPUT_3: "UserController", INPUT_4: "userController" },
    completeCode: "new Repository() → new Service(repo) → new Controller(service) | container.ts"
  },

  {
    id: 25,
    title: "Paginación y Filtros: API REST Estándar",
    stars: 3,
    category: "API DESIGN",
    description: "La paginación y los filtros son esenciales en cualquier API real. Seguir estándares facilita la integración con el frontend.",
    objective: "Paginación offset y cursor-based",
    tags: ["pagination", "filtering", "sorting", "meta"],
    fileName: "utils/pagination.ts",
    completed: false,
    theory: `📚 TEORÍA: Diseño de Paginación en APIs REST

Paginación Offset (page + limit):
  GET /users?page=3&limit=10
  → skip = (page-1) * limit = 20
  → Sencillo de implementar y entender
  → Problema: lento en páginas grandes (skip=10000 escanea 10000 rows)
  → Problema: si alguien inserta/elimina mientras paginas, puedes
    ver duplicados o saltar registros

Paginación Cursor-based:
  GET /users?cursor=abc123&limit=10
  → El cursor es el ID/timestamp del último item visto
  → Más eficiente: usa índice directamente, no hace scan
  → Mejor para feeds en tiempo real (Twitter, Instagram)

Formato de respuesta estándar:
  {
    "data": [...],
    "meta": {
      "total": 150,
      "page": 3,
      "limit": 10,
      "totalPages": 15,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }

Sorting:
  GET /users?sort=createdAt&order=desc
  Validar que 'sort' sea un campo permitido (evita ordenar por 'password')`,
    explanationText: "Siempre valida el campo 'sort' contra una whitelist. sort='password' podría filtrar usuarios por contraseña y facilitar ataques de timing.",
    codeSnippet:
`export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'email'] as const;

export function buildPaginationMeta(total: number, [INPUT_1]: PaginationOptions) {
  const { page, limit } = opts;
  const totalPages = Math.ceil(total / limit);
  return {
    total, page, limit, totalPages,
    [INPUT_2]: page < totalPages,
    hasPrevPage: page > 1
  };
}

export function buildOrderBy(opts: PaginationOptions) {
  const field = opts.sort;
  // Validar campo permitido (whitelist)
  if (field && !ALLOWED_SORT_FIELDS.includes(field as any)) {
    throw new AppError('Invalid sort field', 400);
  }
  return field ? { [field]: opts.[INPUT_3] || '[INPUT_4]' } : { createdAt: 'desc' };
}`,
    inputs: { INPUT_1: "opts", INPUT_2: "hasNextPage", INPUT_3: "order", INPUT_4: "asc" },
    completeCode: "buildPaginationMeta | hasNextPage | whitelist de sort fields | buildOrderBy"
  },

  {
    id: 26,
    title: "Upload de Archivos con Multer",
    stars: 3,
    category: "ARCHIVOS",
    description: "Multer maneja multipart/form-data para subida de archivos. En producción, los archivos van a Cloud Storage, no al disco local.",
    objective: "Upload seguro de imágenes con validación",
    tags: ["multer", "file upload", "Cloud Storage"],
    fileName: "middleware/upload.ts",
    completed: false,
    theory: `📚 TEORÍA: Upload de Archivos en APIs — Seguridad Crítica

Ataques relacionados con upload de archivos:
  1. Upload de ejecutables: subir shell.php y ejecutarlo en el servidor
  2. Path traversal: filename = "../../etc/passwd"
  3. Zip bomb: un .zip que descomprimido ocupa terabytes
  4. DoS por tamaño: subir archivos de 10GB sin límite

Validaciones obligatorias:
  ✅ Validar MIME type (Content-Type del header)
  ✅ Validar extensión del archivo
  ✅ Limitar tamaño (ej: máximo 5MB para imágenes)
  ✅ Renombrar archivo (no usar el nombre del cliente)
  ✅ Escanear con antivirus en producción crítica

Storage en producción:
  ❌ Guardar en disco del servidor (se pierde al reiniciar, no escala)
  ✅ Subir a Cloud Storage (GCS, S3, Firebase Storage)
  ✅ Devolver al cliente la URL pública del objeto subido

MIME type spoofing:
  El Content-Type del header puede ser falsificado por el cliente.
  Para mayor seguridad, usa 'file-type' para detectar el tipo real
  leyendo los magic bytes del archivo.`,
    explanationText: "Nunca uses el nombre de archivo que envía el cliente. Un atacante puede enviar filename='../../../app.js' y sobrescribir tu código.",
    codeSnippet:
`import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage(); // en RAM, luego subimos a GCS

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if ([INPUT_1].includes(file.mimetype)) {
    cb(null, true); // aceptar
  } else {
    cb(new AppError('Only JPEG, PNG and WebP allowed', 400), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * [INPUT_2] } // 5 MB máximo
}).single('[INPUT_3]');

// Controller: subir a Cloud Storage
const safeFilename = crypto.[INPUT_4]('hex') + path.extname(file.originalname);`,
    inputs: { INPUT_1: "ALLOWED_TYPES", INPUT_2: "1024", INPUT_3: "image", INPUT_4: "randomBytes(16).toString" },
    completeCode: "memoryStorage | fileFilter MIME | limits 5MB | randomBytes para nombre seguro"
  },

  {
    id: 27,
    title: "Caché con Redis: Acelerar Respuestas",
    stars: 4,
    category: "PERFORMANCE",
    description: "Redis guarda respuestas en memoria para evitar queries repetidas a la BD. Reduce latencia de 200ms a 2ms.",
    objective: "Middleware de caché con Redis",
    tags: ["Redis", "ioredis", "cache", "TTL"],
    fileName: "middleware/cache.ts",
    completed: false,
    theory: `📚 TEORÍA: Caché con Redis — Cuándo y Cómo

¿Qué es Redis?
  Base de datos en memoria (RAM), extremadamente rápida.
  Latencia típica: < 1ms (vs 10-200ms de PostgreSQL)

¿Qué cachear?
  ✅ Listados que no cambian seguido (catálogos, configuraciones)
  ✅ Resultados de queries costosas (reportes, aggregaciones)
  ✅ Respuestas de APIs externas con rate limit
  ❌ Datos que cambian frecuentemente (nunca el stock en tiempo real)
  ❌ Datos privados de usuarios (riesgo de data leak entre usuarios)

Estrategias de caché:
  Cache-Aside: app revisa caché → si miss, query BD → guarda en caché
  Write-Through: al escribir BD, actualiza caché automáticamente

TTL (Time To Live):
  Define cuántos segundos vive el caché antes de expirar.
  Sin TTL: datos obsoletos para siempre.

Cache Invalidation — el problema difícil:
  "There are only two hard problems in CS: cache invalidation and naming things"
  Estrategias:
  1. TTL corto (datos expiran solos)
  2. Invalidación activa: al actualizar usuario, borrar cache de ese usuario
  3. Versionado: incluir versión en la clave del caché`,
    explanationText: "Redis también se usa para rate limiting distribuido, sesiones, pub/sub y colas de tareas. Es una herramienta fundamental en backends modernos.",
    codeSnippet:
`import { createClient } from '[INPUT_1]';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export function cacheMiddleware(ttlSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = 'cache:' + req.originalUrl;
    const cached = await redis.[INPUT_2](key);

    if (cached) {
      return res.json(JSON.[INPUT_3](cached)); // respuesta desde caché
    }

    // Interceptar res.json para guardar en caché
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis.[INPUT_4](key, JSON.stringify(data), { EX: ttlSeconds });
      return originalJson(data);
    };

    next();
  };
}

// Uso: router.get('/products', cacheMiddleware(300), productController.getAll)`,
    inputs: { INPUT_1: "redis", INPUT_2: "get", INPUT_3: "parse", INPUT_4: "set" },
    completeCode: "createClient | redis.get(key) | intercept res.json | redis.set(key, data, { EX: ttl })"
  },

  {
    id: 28,
    title: "Async/Await y manejo de errores con asyncHandler",
    stars: 3,
    category: "PATRONES",
    description: "Envolver cada handler en try/catch es repetitivo. El patrón asyncHandler centraliza el manejo de errores async.",
    objective: "asyncHandler wrapper para controllers",
    tags: ["asyncHandler", "try/catch", "DRY"],
    fileName: "utils/asyncHandler.ts",
    completed: false,
    theory: `📚 TEORÍA: El Patrón asyncHandler — DRY para Errores Async

Sin asyncHandler:
  router.get('/', async (req, res, next) => {
    try {
      const data = await service.getAll();
      res.json(data);
    } catch(e) { next(e); }  ← repetido en CADA handler
  });

Con asyncHandler:
  router.get('/', asyncHandler(async (req, res) => {
    const data = await service.getAll();
    res.json(data);  ← si lanza error, asyncHandler llama next(e)
  }));

El principio DRY (Don't Repeat Yourself):
  Cada vez que copias y pegas código, creas una oportunidad de bug.
  Si el try/catch genérico tiene un bug, lo tienes en 50 lugares.
  Con asyncHandler, lo corriges en un lugar.

Alternativa moderna: express-async-errors
  import 'express-async-errors'; // parchea Express automáticamente
  Ya no necesitas next(e) ni asyncHandler, Express captura errores async solo.

Cuándo usar cada uno:
  asyncHandler: transparente, sin dependencias, fácil de entender
  express-async-errors: más limpio, requiere importar al inicio de app.ts`,
    explanationText: "express-async-errors es mi recomendación para proyectos nuevos: una importación al inicio y nunca más olvidas el try/catch.",
    codeSnippet:
`// utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request, res: Response, next: NextFunction
) => [INPUT_1]<void>;

export const asyncHandler = (fn: [INPUT_2]) =>
  (req: Request, res: Response, next: NextFunction) => {
    [INPUT_3](fn(req, res, next)).[INPUT_4](next); // si rechaza → next(error)
  };

// Uso limpio en controllers:
router.get('/', asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json({ data: users });
  // si userService.getAll() lanza → asyncHandler captura y llama next(error)
}));

// Alternativa: express-async-errors (más simple aún)
// import 'express-async-errors'; // en app.ts, arriba de todo`,
    inputs: { INPUT_1: "Promise", INPUT_2: "AsyncRequestHandler", INPUT_3: "Promise.resolve", INPUT_4: "catch" },
    completeCode: "Promise.resolve(fn(req,res,next)).catch(next) | asyncHandler elimina try/catch repetido"
  },

  {
    id: 29,
    title: "Variables de Entorno por Ambiente: .env.development vs .env.production",
    stars: 3,
    category: "CONFIG",
    description: "Cada ambiente (dev, staging, prod) tiene su propia configuración. dotenv-flow gestiona múltiples archivos .env.",
    objective: "Configuración multi-ambiente con dotenv-flow",
    tags: ["dotenv-flow", "NODE_ENV", "multi-environment"],
    fileName: "config/environments.ts",
    completed: false,
    theory: `📚 TEORÍA: Ambientes en Desarrollo de Software

Ambientes típicos en equipos profesionales:
  development  → tu máquina local, BD local, logs detallados
  testing      → usado por CI/CD, BD en memoria o de prueba
  staging      → copia de producción, datos ficticios, acceso interno
  production   → usuarios reales, configuración estricta, pocos logs

Archivos .env por prioridad (dotenv-flow):
  .env                → defaults base (todos los ambientes)
  .env.local          → override local (NO al git)
  .env.{NODE_ENV}     → por ambiente (.env.development, .env.production)
  .env.{NODE_ENV}.local → override local por ambiente (NO al git)

Gitignore apropiado:
  .env.local
  .env.*.local
  .env.production     ← NUNCA al git (tiene secretos reales)

Diferencias comunes entre ambientes:
  LOG_LEVEL: debug (dev) vs error (prod)
  DATABASE_URL: localhost (dev) vs Cloud SQL (prod)
  JWT_EXPIRES_IN: 7d (dev, para no loguearse tanto) vs 15m (prod)
  CORS_ORIGINS: http://localhost:3000 (dev) vs https://app.com (prod)`,
    explanationText: "Regla: .env.production nunca va al git. Los secretos de producción van en Secret Manager (GCP) o en las variables de entorno de Cloud Run/GitHub Actions.",
    codeSnippet:
`// .env (base - SÍ al git, sin secretos)
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug
JWT_EXPIRES_IN=7d

// .env.production (NO al git — va en Cloud Run env vars)
NODE_ENV=production
LOG_LEVEL=error
JWT_EXPIRES_IN=[INPUT_1]
# DATABASE_URL → viene de Secret Manager

// config/env.ts
import '[INPUT_2]/config';  // carga .env, .env.local, .env.{NODE_ENV}

const isProduction = process.env.NODE_ENV === '[INPUT_3]';

export const config = {
  isProduction,
  logLevel: process.env.LOG_LEVEL || (isProduction ? 'error' : '[INPUT_4]'),
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  }
};`,
    inputs: { INPUT_1: "15m", INPUT_2: "dotenv-flow", INPUT_3: "production", INPUT_4: "debug" },
    completeCode: "dotenv-flow/config | isProduction | 15m en prod | debug en dev"
  },

  {
    id: 30,
    title: "Health Check y Graceful Shutdown",
    stars: 3,
    category: "PRODUCCIÓN",
    description: "El health check le dice al load balancer si la instancia está lista. Graceful shutdown termina las requests en curso antes de apagar.",
    objective: "Endpoints de salud y shutdown limpio",
    tags: ["health check", "graceful shutdown", "SIGTERM"],
    fileName: "server.ts",
    completed: false,
    theory: `📚 TEORÍA: Health Checks y Graceful Shutdown en Producción

Health Checks — ¿Para qué sirven?
  Los load balancers (Cloud Run, Kubernetes) llaman a /health cada N segundos.
  Si la respuesta no es 200, sacan la instancia del pool de tráfico.

Tipos de health check:
  Liveness:  ¿está vivo el proceso? (si falla → reiniciar)
  Readiness: ¿está listo para recibir tráfico? (si falla → no enviar tráfico)

Un health check completo verifica:
  ✅ La app responde (proceso vivo)
  ✅ La conexión a BD funciona (readiness)
  ✅ Memoria disponible (evitar memory leak silencioso)

Graceful Shutdown — ¿Por qué importa?
  Cloud Run, Kubernetes → envían SIGTERM antes de detener la instancia.
  Sin graceful shutdown:
    → Requests en curso se cortan abruptamente
    → Transacciones de BD pueden quedar incompletas
    → El cliente recibe un error 502

  Con graceful shutdown:
    1. Recibir SIGTERM
    2. Dejar de aceptar nuevas conexiones
    3. Esperar a que terminen las requests en curso (timeout: 30s)
    4. Cerrar conexión a BD (prisma.$disconnect())
    5. Salir limpiamente`,
    explanationText: "Cloud Run envía SIGTERM 10 segundos antes de forzar SIGKILL. Tu graceful shutdown debe completarse en esos 10 segundos.",
    codeSnippet:
`// server.ts
const server = app.listen(PORT, () => console.log(\`Port \${PORT}\`));

// Health check — simple y rápido
app.get('/health', async (req, res) => {
  const dbOk = await prisma.$[INPUT_1]('SELECT 1').then(() => true).catch(() => false);
  const status = dbOk ? 200 : 503;
  res.[INPUT_2](status).json({
    status: dbOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    db: dbOk ? 'connected' : 'disconnected'
  });
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  console.log(\`\${signal} received, shutting down gracefully\`);
  server.[INPUT_3](() => { // dejar de aceptar nuevas connections
    prisma.[INPUT_4](); // cerrar pool de BD
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 9000); // forzar salida en 9s
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C en local`,
    inputs: { INPUT_1: "queryRaw", INPUT_2: "status", INPUT_3: "close", INPUT_4: "$disconnect" },
    completeCode: "prisma.$queryRaw('SELECT 1') | /health → 200/503 | server.close | prisma.$disconnect"
  },

  // ─── SECCIÓN 13: TESTING DE APIs ────────────────────────────────────────────

  {
    id: 31,
    title: "Testing de APIs con Supertest + Vitest",
    stars: 4,
    category: "TESTING",
    description: "Supertest hace requests HTTP reales a tu app Express sin levantar un servidor. Ideal para integration tests de endpoints.",
    objective: "Tests de integración de endpoints REST",
    tags: ["supertest", "vitest", "integration test"],
    fileName: "tests/users.test.ts",
    completed: false,
    theory: `📚 TEORÍA: Pirámide de Tests en APIs

Pirámide de tests (de mayor a menor cantidad):
  Unit Tests       → testean service/utils en aislamiento (mockeando deps)
  Integration Tests→ testean que service + repository + BD funcionan juntos
  E2E Tests        → testean la API completa con HTTP real (supertest)

Para APIs REST, el nivel más valioso es Integration Test con Supertest:
  ✅ Prueba todo el pipeline: middleware → controller → service → BD
  ✅ Detecta problemas de configuración de rutas, validación, etc.
  ✅ Relativamente rápido si usas BD en memoria o SQLite para tests

Setup con Vitest + Supertest:
  1. Exportar la app Express sin llamar a .listen()
  2. Supertest crea un servidor temporal para cada test
  3. Usar BD de prueba (SQLite o PostgreSQL en Docker)

Best practices:
  beforeEach → limpiar la BD antes de cada test
  afterAll   → cerrar conexiones (prisma.$disconnect())
  Datos de prueba → no usar datos de producción en tests`,
    explanationText: "Exporta 'app' sin .listen() y el server.ts llama app.listen(). Así Supertest puede importar app y hacer requests sin puerto en conflicto.",
    codeSnippet:
`import request from '[INPUT_1]';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

beforeEach(async () => {
  await prisma.user.[INPUT_2](); // limpiar tabla antes de cada test
});

afterAll(async () => {
  await prisma.$[INPUT_3](); // cerrar conexión al terminar
});

describe('POST /api/v1/users', () => {
  it('creates a user and returns 201', async () => {
    const res = await [INPUT_4](app)
      .post('/api/v1/users')
      .send({ name: 'Iram', email: 'iram@test.com', password: 'Password1!' });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ name: 'Iram', email: 'iram@test.com' });
    expect(res.body.data.password).toBeUndefined(); // no exponer password
  });
});`,
    inputs: { INPUT_1: "supertest", INPUT_2: "deleteMany", INPUT_3: "disconnect", INPUT_4: "request" },
    completeCode: "supertest | app sin .listen() | deleteMany en beforeEach | request(app).post().send()"
  },

  {
    id: 32,
    title: "Mocking de Servicios Externos en Tests",
    stars: 4,
    category: "TESTING",
    description: "Los tests no deben llamar a servicios externos reales (Firebase, Stripe, email). Se mockean con vi.mock() o MSW.",
    objective: "Aislar dependencias externas en tests",
    tags: ["vi.mock", "mocking", "external services"],
    fileName: "tests/auth.test.ts",
    completed: false,
    theory: `📚 TEORÍA: Mocking en Tests — Cuándo y Por qué

Sin mocking de externos:
  ❌ Test de login → envía email real (cuenta de Mailtrap llena)
  ❌ Test de pago  → cobra tarjeta real de prueba
  ❌ Test en CI    → requiere credenciales de Firebase en el CI
  ❌ Tests lentos  → esperar respuesta de red en cada test

Con mocking:
  ✅ Tests rápidos (sin red)
  ✅ Tests deterministas (siempre mismo resultado)
  ✅ Tests independientes (no requieren servicios levantados)
  ✅ Puedes simular errores (Firebase down, Stripe timeout)

¿Qué mockear?
  ✅ Llamadas a APIs externas (Firebase, Stripe, SendGrid)
  ✅ Envío de emails
  ✅ Generación de UUID/timestamps (para tests deterministas)
  ❌ No mockear la BD en tests de integración (usa BD de test real)
  ❌ No mockear la lógica de negocio que estás testeando

vi.mock() vs MSW:
  vi.mock('./firebase') → mockea el módulo completo
  MSW (Mock Service Worker) → intercepta a nivel de red (más realista)`,
    explanationText: "En test unitarios, mockea todo excepto lo que estás probando. En tests de integración, mockea solo los externos reales (email, pagos, push notifications).",
    codeSnippet:
`import { vi } from 'vitest';

// Mockear módulo de email completo
vi.[INPUT_1]('../src/services/emailService', () => ({
  emailService: {
    sendWelcome: vi.fn().[INPUT_2]({ success: true }),
    sendPasswordReset: vi.fn().mockResolvedValue({ success: true })
  }
}));

// En el test
it('sends welcome email after registration', async () => {
  const { emailService } = await import('../src/services/emailService');

  await request(app).post('/api/v1/auth/register').send({ ... });

  // Verificar que se llamó el mock (no un email real)
  expect(emailService.[INPUT_3]).toHaveBeenCalledOnce();
  expect(emailService.sendWelcome).toHaveBeenCalledWith(
    expect.[INPUT_4]({ email: 'iram@test.com' })
  );
});`,
    inputs: { INPUT_1: "mock", INPUT_2: "mockResolvedValue", INPUT_3: "sendWelcome", INPUT_4: "objectContaining" },
    completeCode: "vi.mock('./service') | mockResolvedValue | toHaveBeenCalledOnce | objectContaining"
  },

  // ─── SECCIÓN 14: WEBSOCKETS Y TIEMPO REAL ───────────────────────────────────

  {
    id: 33,
    title: "WebSockets con Socket.io: Comunicación Bidireccional",
    stars: 4,
    category: "REALTIME",
    description: "Socket.io implementa WebSockets con fallback a polling. Permite comunicación en tiempo real: chats, notificaciones, dashboards.",
    objective: "Setup de Socket.io con autenticación JWT",
    tags: ["socket.io", "WebSocket", "emit", "on"],
    fileName: "socket/index.ts",
    completed: false,
    theory: `📚 TEORÍA: HTTP vs WebSocket — La Diferencia Fundamental

HTTP (Request-Response):
  Cliente → "Dame los mensajes" → Servidor responde
  El servidor NUNCA puede enviar datos sin que el cliente pregunte.
  Para "tiempo real": polling cada N segundos (ineficiente)

WebSocket (Bidireccional):
  Se establece UNA conexión persistente.
  El servidor puede enviar datos AL CLIENTE en cualquier momento.
  Ideal para: chats, notificaciones push, dashboards en vivo, juegos.

Socket.io adiciona sobre WebSocket:
  ✅ Rooms: grupos de conexiones (ej: sala de chat)
  ✅ Fallback automático a HTTP polling si WebSocket falla
  ✅ Reconexión automática
  ✅ Eventos nombrados (en lugar de mensajes crudos)
  ✅ Namespace para separar dominios (chat, notifications)

Autenticación en WebSocket:
  HTTP: cada request tiene Authorization header.
  WebSocket: la conexión se establece una vez → verificar el JWT
  en el handshake inicial (evento 'connection').`,
    explanationText: "Para notificaciones simples (no chat), considera Server-Sent Events (SSE) que es más simple y funciona sobre HTTP normal. Para bidireccional, WebSocket.",
    codeSnippet:
`import { Server } from '[INPUT_1]';
import { jwtUtils } from '../utils/jwt';

export function setupSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: config.cors.origins, credentials: true }
  });

  // Middleware de autenticación en WebSocket
  io.[INPUT_2]((socket, next) => {
    const token = socket.handshake.auth.[INPUT_3];
    try {
      socket.data.user = jwtUtils.verify(token);
      next();
    } catch {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    socket.[INPUT_4](\`user:\${userId}\`); // unirse a room personal

    socket.on('chat:message', ({ roomId, message }) => {
      io.to(roomId).emit('chat:message', { userId, message, timestamp: Date.now() });
    });

    socket.on('disconnect', () => console.log(\`User \${userId} disconnected\`));
  });
}`,
    inputs: { INPUT_1: "socket.io", INPUT_2: "use", INPUT_3: "token", INPUT_4: "join" },
    completeCode: "new Server(httpServer) | io.use(middleware) | socket.join(room) | io.to(room).emit"
  },

  // ─── SECCIÓN 15: PATRONES ADICIONALES ───────────────────────────────────────

  {
    id: 34,
    title: "Event-Driven: Node.js EventEmitter",
    stars: 4,
    category: "PATRONES",
    description: "EventEmitter permite desacoplar operaciones: cuando se crea un usuario, varios módulos reaccionan sin conocerse entre sí.",
    objective: "Desacoplamiento con eventos internos",
    tags: ["EventEmitter", "event-driven", "desacoplamiento"],
    fileName: "events/userEvents.ts",
    completed: false,
    theory: `📚 TEORÍA: Event-Driven Architecture — Desacoplamiento

Problema sin eventos:
  userService.create → email → log → puntos → notificaciones
  Todo acoplado en un service que crece infinitamente.

Con eventos:
  userService.create → emite 'user:created'
  emailService     → escucha 'user:created' → envía email
  loyaltyService   → escucha 'user:created' → da puntos de bienvenida
  analyticsService → escucha 'user:created' → registra en analytics

Ventajas:
  ✅ Cada módulo es independiente (añadir/quitar sin tocar el servicio)
  ✅ El service no sabe quién reacciona a sus eventos
  ✅ Fácil de testear cada listener por separado

Limitación de EventEmitter interno:
  ❌ Solo funciona dentro del mismo proceso Node.js
  ❌ Si el proceso se cae, se pierden los eventos no procesados

Para sistemas distribuidos → Pub/Sub real:
  Redis Pub/Sub, Google Cloud Pub/Sub, RabbitMQ, Kafka`,
    explanationText: "EventEmitter interno es el patrón Observer de Node.js. Para microservicios, necesitas un broker de mensajes externo (Pub/Sub, RabbitMQ).",
    codeSnippet:
`import { EventEmitter } from 'events';

// Singleton del event bus
export const eventBus = new [INPUT_1]();
eventBus.setMaxListeners(20); // evitar warning de memory leak

// Tipos de eventos (type-safe)
interface UserEvents {
  'user:created': { userId: number; email: string; name: string };
  'user:deleted': { userId: number };
}

// userService.ts — emite el evento
const user = await userRepository.create(data);
eventBus.[INPUT_2]('user:created', { userId: user.id, email: user.email, name: user.name });

// emailService.ts — escucha el evento (desacoplado)
eventBus.[INPUT_3]('user:created', async ({ email, name }) => {
  await mailer.sendWelcome(email, name); // si falla, no afecta el create
});

// analyticsService.ts — también escucha (no sabe que emailService existe)
eventBus.on('user:[INPUT_4]', ({ userId }) => analytics.track('user_created', userId));`,
    inputs: { INPUT_1: "EventEmitter", INPUT_2: "emit", INPUT_3: "on", INPUT_4: "created" },
    completeCode: "new EventEmitter() singleton | eventBus.emit('user:created', data) | eventBus.on('user:created', handler)"
  },

  {
    id: 35,
    title: "Logging Estructurado con Winston",
    stars: 3,
    category: "LOGGING",
    description: "Winston es el logger más usado en Node.js. Soporta múltiples transportes (consola, archivo, Cloud Logging) y niveles de severidad.",
    objective: "Logger profesional multi-transporte",
    tags: ["winston", "transports", "structured logging"],
    fileName: "utils/logger.ts",
    completed: false,
    theory: `📚 TEORÍA: Por qué Winston sobre console.log

console.log en producción:
  ❌ No tiene niveles (todo igual de importante)
  ❌ No sabe apagar logs de debug en producción
  ❌ No formatea para Cloud Logging
  ❌ No maneja errores y sus stack traces bien

Winston resuelve todo:
  ✅ Niveles: error > warn > info > http > debug
  ✅ Silencia niveles bajos en producción (config LOG_LEVEL)
  ✅ Formato JSON para Cloud Logging
  ✅ Múltiples destinos: consola + archivo + Cloud Logging simultáneos
  ✅ Metadata de contexto: requestId, userId, service

Correlation ID (Request ID):
  Cada request recibe un UUID único.
  Todos los logs de esa request incluyen ese ID.
  En Cloud Logging puedes filtrar por requestId y ver
  exactamente qué pasó en toda la cadena de esa request.

Estructura de log en producción:
  {
    "severity": "ERROR",
    "message": "User creation failed",
    "requestId": "abc-123",
    "userId": null,
    "service": "user-service",
    "stack_trace": "..."
  }`,
    explanationText: "Agrega el requestId a cada log. Cuando un usuario reporta un error, tomar su requestId y filtrar en Cloud Logging te muestra todo lo que pasó en esa request específica.",
    codeSnippet:
`import winston from '[INPUT_1]';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ [INPUT_2]: true }), // incluir stack trace
    process.env.NODE_ENV === 'production'
      ? winston.format.json() // Cloud Logging parsea JSON
      : winston.format.[INPUT_3]() // legible en desarrollo
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.[INPUT_4](), // siempre consola
    ...(process.env.NODE_ENV === 'production'
      ? [] // Cloud Run captura stdout automáticamente
      : [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
    )
  ]
});`,
    inputs: { INPUT_1: "winston", INPUT_2: "stack", INPUT_3: "colorize", INPUT_4: "Console" },
    completeCode: "winston.createLogger | format.errors({ stack: true }) | json() prod | colorize() dev"
  },

  {
    id: 36,
    title: "Scheduled Jobs: Tareas Programadas con Node-cron",
    stars: 3,
    category: "JOBS",
    description: "Node-cron ejecuta tareas en intervalos programados: limpiar tokens expirados, generar reportes diarios, sincronizar datos.",
    objective: "Cron jobs en Node.js",
    tags: ["node-cron", "scheduled tasks", "cron"],
    fileName: "jobs/scheduler.ts",
    completed: false,
    theory: `📚 TEORÍA: Cron Jobs — Automatización de Tareas

Sintaxis cron: "segundo minuto hora día-mes mes día-semana"
  '* * * * *'     → cada minuto
  '0 * * * *'     → cada hora (en el minuto 0)
  '0 0 * * *'     → cada día a medianoche
  '0 9 * * 1-5'   → a las 9am de lunes a viernes
  '*/5 * * * *'   → cada 5 minutos

Casos de uso comunes:
  Cada minuto:     Health checks, retry de requests fallidas
  Cada hora:       Limpieza de tokens expirados, caché warm-up
  Cada día:        Reportes diarios, backup de BD, emails de resumen
  Cada semana:     Limpieza de archivos temporales, reports semanales

⚠️ Problema en múltiples instancias:
  Cloud Run puede tener 5 instancias corriendo simultáneamente.
  Cada una ejecutaría el cron job → duplicación de tareas.
  Soluciones:
  1. Usar Cloud Scheduler (GCP) → envía HTTP request a una instancia
  2. Redis distributed lock → solo una instancia corre el job
  3. Cloud Tasks → encolar la tarea, Cloud Run la procesa una vez`,
    explanationText: "Para producción con múltiples instancias, usa Cloud Scheduler + un endpoint en tu API. El scheduler llama HTTP a tu API y Cloud Run enruta a UNA instancia.",
    codeSnippet:
`import [INPUT_1] from 'node-cron';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

export function startScheduler() {
  // Limpiar refresh tokens expirados → cada hora
  cron.[INPUT_2]('0 * * * *', async () => {
    logger.info('Running: cleanup expired tokens');
    const deleted = await prisma.refreshToken.[INPUT_3]({
      where: { expiresAt: { [INPUT_4]: new Date() } }
    });
    logger.info(\`Cleaned \${deleted.count} expired tokens\`);
  });

  // Reporte diario → 9am de lunes a viernes
  cron.schedule('0 9 * * 1-5', async () => {
    logger.info('Running: daily report');
    const report = await generateDailyReport();
    await emailService.sendReport(report);
  });
}

// En server.ts:
// startScheduler(); // iniciar jobs`,
    inputs: { INPUT_1: "cron", INPUT_2: "schedule", INPUT_3: "deleteMany", INPUT_4: "lt" },
    completeCode: "cron.schedule('0 * * * *', fn) | deleteMany({ where: { expiresAt: { lt: new Date() } } })"
  },

  {
    id: 37,
    title: "Documentación de API con Swagger/OpenAPI",
    stars: 3,
    category: "DOCUMENTACIÓN",
    description: "Swagger genera documentación interactiva de tu API automáticamente desde comentarios JSDoc o con swagger-jsdoc.",
    objective: "API docs con /api-docs endpoint",
    tags: ["swagger", "openapi", "swagger-ui-express"],
    fileName: "config/swagger.ts",
    completed: false,
    theory: `📚 TEORÍA: OpenAPI/Swagger — La Documentación que se Usa

¿Por qué documentar la API?
  → El frontend puede ver los endpoints sin preguntar al backend
  → QA puede probar los endpoints directamente desde el navegador
  → Genera clientes automáticos en otros lenguajes
  → Es el estándar de la industria para APIs REST

OpenAPI Specification (OAS):
  Antes llamado Swagger, es el estándar para describir APIs REST en YAML/JSON.
  Define: endpoints, parámetros, tipos de datos, autenticación, respuestas.

Herramientas:
  swagger-jsdoc       → genera spec OpenAPI desde comentarios JSDoc
  swagger-ui-express  → sirve la UI de Swagger en un endpoint
  @apidog, Stoplight  → alternativas GUI para diseñar la spec

Buenas prácticas:
  ✅ Documentar todos los endpoints públicos
  ✅ Incluir ejemplos de request y response
  ✅ Documentar códigos de error (400, 401, 404, 500)
  ✅ Versionar la spec junto con el código
  ❌ No exponer /api-docs en producción sin autenticación básica`,
    explanationText: "Tip: tools como Postman pueden importar tu spec OpenAPI y generar una colección completa para el equipo automáticamente.",
    codeSnippet:
`import swaggerJsdoc from '[INPUT_1]';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
    components: {
      [INPUT_2]: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // leer JSDoc de los archivos de rutas
};

const spec = swaggerJsdoc([INPUT_3]);

// Solo en no-producción (o con auth básica en prod)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.[INPUT_4], swaggerUi.setup(spec));
}

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: List all users
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of users
 */`,
    inputs: { INPUT_1: "swagger-jsdoc", INPUT_2: "securitySchemes", INPUT_3: "options", INPUT_4: "serve" },
    completeCode: "swaggerJsdoc(options) | swaggerUi.serve, setup(spec) | JSDoc @openapi en routes"
  },

  {
    id: 38,
    title: "Compression y Performance: Express Optimization",
    stars: 3,
    category: "PERFORMANCE",
    description: "Compression reduce el tamaño de las respuestas HTTP. Junto con otras optimizaciones, reduce la latencia y el ancho de banda.",
    objective: "Optimizaciones de performance en Express",
    tags: ["compression", "gzip", "performance", "cluster"],
    fileName: "app.ts",
    completed: false,
    theory: `📚 TEORÍA: Performance en Node.js — Los Fundamentos

1. Compression (gzip/brotli):
   Comprime el body de la respuesta → menos bytes → más rápido
   Una respuesta JSON de 100KB comprimida puede ser 10KB
   Activar para: JSON, HTML, text. Desactivar para: imágenes, archivos ya comprimidos.

2. Node.js es Single-Threaded:
   Un proceso Node.js usa 1 CPU core.
   En un servidor de 4 cores, 3 están desperdiciados.
   
3. Cluster Mode:
   Crea N procesos Node.js (workers) igual al número de CPUs.
   El master distribuye requests entre workers (round-robin).
   Si un worker crashea, el master crea uno nuevo.

4. PM2 en servidores propios:
   pm2 start server.js -i max → inicia N instancias (1 por CPU)
   pm2 monit → monitor de CPU/RAM en tiempo real

5. En Cloud Run/Kubernetes:
   No necesitas cluster: el escalado es horizontal (múltiples instancias).
   Mejor 1 proceso por contenedor, múltiples contenedores.`,
    explanationText: "En Cloud Run no necesitas cluster mode. GCP escala horizontalmente creando más instancias. Enfócate en que tu app sea stateless (sin estado local).",
    codeSnippet:
`import compression from '[INPUT_1]';

// Compresión gzip/brotli automática
app.use(compression({
  [INPUT_2]: (req, res) => {
    // No comprimir streams de Server-Sent Events
    if (req.headers['accept'] === 'text/event-stream') return false;
    return compression.filter(req, res); // default filter
  },
  level: 6 // 1=rápido/menos compresión, 9=lento/más compresión (6 es el balance)
}));

// Deshabilitar ETag para APIs (solo útil para HTML estático)
app.set('etag', [INPUT_3]);

// Respuestas más rápidas: no esperar a que el buffer esté lleno
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store'); // APIs no se cachean en browser
  }
  [INPUT_4]();
});`,
    inputs: { INPUT_1: "compression", INPUT_2: "filter", INPUT_3: "false", INPUT_4: "next" },
    completeCode: "compression({ filter, level: 6 }) | etag: false | Cache-Control: no-store"
  },

  {
    id: 39,
    title: "Multitenancy: APIs para Múltiples Clientes",
    stars: 5,
    category: "ARQUITECTURA",
    description: "Multitenancy permite que una sola API sirva a múltiples organizaciones/clientes con datos completamente separados.",
    objective: "Aislamiento de datos por tenant",
    tags: ["multitenancy", "tenant", "row-level isolation"],
    fileName: "middleware/tenantMiddleware.ts",
    completed: false,
    theory: `📚 TEORÍA: Multitenancy — SaaS para Múltiples Clientes

¿Qué es un tenant?
  En SaaS (Software as a Service), cada cliente (empresa) es un tenant.
  Todos comparten la misma aplicación pero sus datos están aislados.
  NLINEA probablemente sirve a múltiples organizaciones → multitenancy.

Estrategias de multitenancy:

1. Database per tenant (máximo aislamiento):
   Cada cliente tiene su propia BD.
   + Máximo aislamiento, fácil backup por cliente
   - Costoso, difícil de mantener con muchos clientes

2. Schema per tenant (PostgreSQL schemas):
   Una BD, schemas separados: tenant_abc.users, tenant_xyz.users
   + Buen aislamiento, una sola BD
   - Más complejo, algunas queries se complican

3. Row-Level isolation (más común):
   Una tabla, todos los registros tienen tenantId.
   + Simple, un solo schema
   - Riesgo de data leak si olvidas filtrar por tenantId
   - Se complementa con Row-Level Security (RLS) en PostgreSQL

Identificar el tenant en cada request:
  Subdominio:    cliente1.miapp.com → tenant='cliente1'
  Header:        X-Tenant-ID: cliente1
  JWT claim:     token payload incluye tenantId`,
    explanationText: "El mayor riesgo en multitenancy: olvidar el filtro de tenantId en UNA query y exponer datos de otro cliente. RLS de PostgreSQL es tu red de seguridad.",
    codeSnippet:
`// middleware/tenantMiddleware.ts
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Extraer tenant del subdominio o del JWT
  const tenantId = (req as AuthRequest).user?.[INPUT_1]
    || req.headers['x-tenant-id'] as string;

  if (!tenantId) return next(new AppError('Tenant not identified', 400));

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant || !tenant.[INPUT_2]) return next(new AppError('Tenant not found or inactive', 404));

  (req as TenantRequest).[INPUT_3] = tenant;
  next();
};

// SIEMPRE filtrar por tenantId en todas las queries
export const userRepository = {
  findAll: (tenantId: string) =>
    prisma.user.findMany({ where: { [INPUT_4]: tenantId } }),
  create: (tenantId: string, data: CreateUserDTO) =>
    prisma.user.create({ data: { ...data, tenantId } })
};`,
    inputs: { INPUT_1: "tenantId", INPUT_2: "active", INPUT_3: "tenant", INPUT_4: "tenantId" },
    completeCode: "user.tenantId del JWT | tenant.active check | req.tenant = tenant | where: { tenantId }"
  },

  {
    id: 40,
    title: "Proyecto Completo: Checklist de API en Producción",
    stars: 5,
    category: "PRODUCCIÓN",
    description: "Checklist final de todos los puntos que debe tener una API Node.js lista para producción en una empresa como NLINEA.",
    objective: "API production-ready checklist",
    tags: ["checklist", "producción", "security", "performance"],
    fileName: "production-checklist.md",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué hace una API "Production-Ready"?

Esta es la diferencia entre un junior y un senior developer.
Un junior hace que funcione. Un senior hace que funcione, sea seguro,
sea monitoreable, sea mantenible y sea escalable.`,
    explanationText: "En la entrevista, si preguntan '¿Qué consideraciones de producción tomarías?', esta lista es tu respuesta. Demuestra madurez técnica.",
    codeSnippet:
`// SEGURIDAD ─────────────────────────────────────────────
// ✅ [INPUT_1]() para headers de seguridad
// ✅ Rate limiting en /login (5 req/hr) y global (100 req/15min)
// ✅ CORS configurado con whitelist de orígenes
// ✅ JWT con expiración corta (15min) + refresh token en HttpOnly cookie
// ✅ Contraseñas hasheadas con [INPUT_2] (factor 12)
// ✅ Variables de entorno en Secret Manager (no en código)
// ✅ SQL queries parametrizadas (Prisma lo hace automáticamente)
// ✅ Inputs validados con Zod antes de procesar
// ✅ app.disable('x-powered-by')

// OBSERVABILIDAD ─────────────────────────────────────────
// ✅ Logging estructurado con Winston (JSON en producción)
// ✅ Correlation ID (requestId) en todos los logs
// ✅ /[INPUT_3] endpoint para load balancer
// ✅ Graceful shutdown con manejo de SIGTERM
// ✅ Métricas con OpenTelemetry

// PERFORMANCE ────────────────────────────────────────────
// ✅ [INPUT_4] middleware para gzip
// ✅ Conexiones a BD con pool (Prisma lo maneja)
// ✅ Caché con Redis para queries costosas
// ✅ Paginación en todos los listados (nunca SELECT * sin LIMIT)

// MANTENIBILIDAD ─────────────────────────────────────────
// ✅ Clean Architecture: routes → controllers → services → repositories
// ✅ Tests con Supertest + Vitest (cobertura > 80%)
// ✅ Documentación Swagger en /api-docs
// ✅ Conventional Commits + commitlint
// ✅ CI/CD con GitHub Actions → Cloud Run`,
    inputs: { INPUT_1: "helmet", INPUT_2: "bcrypt", INPUT_3: "health", INPUT_4: "compression" },
    completeCode: "Checklist completo: helmet | bcrypt | /health | compression | JWT 15min | Zod | Winston | Prisma | Redis | CI/CD"
  },

  // ─── SECCIÓN EXTRA: FUNDAMENTOS NODE + INTERCEPTORS ─────────────────────────

  {
    id: 41,
    title: "ES Modules: import/export en Node.js",
    stars: 1,
    category: "MODULES",
    description: "Node.js soporta ES Modules nativamente. Es el estándar moderno para APIs TypeScript y proyectos nuevos.",
    objective: "Habilitar y usar import/export",
    tags: ["import", "export", "ESM", "type: module"],
    fileName: "math.mjs",
    completed: false,
    theory: `📚 TEORÍA: CommonJS vs ES Modules en Node.js

  CommonJS (legacy):     require() / module.exports
  ES Modules (moderno):  import / export

¿Cómo habilitar ESM?
  1. "type": "module" en package.json → todos los .js son ESM
  2. Extensión .mjs → siempre ESM aunque package.json diga commonjs
  3. Extensión .cjs → siempre CommonJS

En entrevistas te preguntan:
  • ¿Cuál usas en proyectos nuevos? → ESM (estándar JS/TS)
  • ¿Puedes mezclar? → Sí, pero evítalo; usa .cjs para configs legacy
  • ¿__dirname en ESM? → import.meta.url + fileURLToPath`,
    explanationText: "Con \"type\": \"module\" en package.json no necesitas .mjs. TypeScript compila a ESM con \"module\": \"NodeNext\".",
    codeSnippet:
`// math.mjs
[INPUT_1] function add(a, b) { return a + b; }
[INPUT_2] { multiply };

// app.mjs
[INPUT_3] { add, multiply } from './math.mjs';`,
    inputs: { INPUT_1: "export", INPUT_2: "export", INPUT_3: "import" },
    completeCode: "export function add | export { multiply } | import { add, multiply } from './math.mjs'"
  },

  {
    id: 42,
    title: "Interceptors con Axios en el Backend",
    stars: 3,
    category: "INTERCEPTORS",
    description: "Cuando tu API Node llama a servicios externos (Stripe, Firebase, otro microservicio), Axios interceptors centralizan auth, logging y retry.",
    objective: "Request/response interceptors en cliente HTTP",
    tags: ["axios", "interceptors", "HTTP client"],
    fileName: "services/httpClient.ts",
    completed: false,
    theory: `📚 TEORÍA: Interceptors — Middleware para HTTP Client

En Express, el middleware intercepta requests ENTRANTES.
En Axios, los interceptors interceptan requests SALIENTES y responses ENTRANTES.

Request interceptor (antes de enviar):
  • Inyectar Authorization: Bearer token
  • Agregar correlation-id para tracing
  • Log de la petición saliente

Response interceptor (al recibir respuesta):
  • Renovar token si 401
  • Transformar datos (snake_case → camelCase)
  • Retry automático en 503

Patrón en Clean Architecture:
  src/infrastructure/http/axiosClient.ts → un solo cliente configurado
  Los services lo importan, nunca axios directo`,
    explanationText: "En entrevista: 'Los interceptors de Axios son el equivalente al middleware de Express, pero para llamadas HTTP salientes desde el servidor.'",
    codeSnippet:
`import axios from 'axios';

const api = axios.create({ baseURL: process.env.EXTERNAL_API_URL });

// Request interceptor — inyecta token
api.[INPUT_1].use((config) => {
  config.headers.Authorization = \`Bearer \${process.env.API_TOKEN}\`;
  return [INPUT_2];
});

// Response interceptor — maneja errores globales
api.interceptors.[INPUT_3].use(
  (response) => response,
  (error) => {
    if (error.response?.status === [INPUT_4]) {
      // token expirado → refresh o alerta
    }
    return Promise.reject(error);
  }
);`,
    inputs: { INPUT_1: "interceptors", INPUT_2: "config", INPUT_3: "response", INPUT_4: "401" },
    completeCode: "axios.interceptors.request.use | return config | interceptors.response | status 401"
  },

  {
    id: 43,
    title: "fs/promises: Lectura Asíncrona de Archivos",
    stars: 2,
    category: "FS",
    description: "Node.js accede al filesystem nativamente. fs/promises expone operaciones como async/await sin bloquear el event loop.",
    objective: "readFile con fs/promises",
    tags: ["fs", "readFile", "promises", "async"],
    fileName: "utils/readConfig.mjs",
    completed: false,
    theory: `📚 TEORÍA: Filesystem en Node.js — Sync vs Async

  fs.readFileSync()  → BLOQUEA el event loop (solo scripts CLI)
  fs.readFile(cb)    → Callback style (legacy)
  fs/promises        → async/await (recomendado en APIs)

¿Por qué no usar sync en APIs?
  Node es single-threaded. readFileSync congela TODAS las peticiones
  mientras lee el disco. En producción siempre usa async.

Casos reales en backend:
  • Leer plantillas de email (.html)
  • Cargar config JSON en startup
  • Procesar CSVs subidos (con streams para archivos grandes)`,
    explanationText: "Para archivos grandes usa createReadStream + pipeline, no readFile completo en memoria.",
    codeSnippet:
`import { [INPUT_1] } from 'node:fs/promises';

export async function loadConfig(path) {
  const content = [INPUT_2] readFile(path, '[INPUT_3]');
  return JSON.[INPUT_4](content);
}`,
    inputs: { INPUT_1: "readFile", INPUT_2: "await", INPUT_3: "utf-8", INPUT_4: "parse" },
    completeCode: "import { readFile } from 'node:fs/promises' | await readFile(path, 'utf-8') | JSON.parse"
  },

  {
    id: 44,
    title: "package.json: Scripts npm y type module",
    stars: 1,
    category: "CONFIG",
    description: "package.json define metadatos, dependencias y scripts de automatización. Es la primera pregunta en setup de cualquier proyecto Node.",
    objective: "Scripts dev/start y habilitar ESM",
    tags: ["scripts", "type: module", "npm"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: package.json — El Corazón del Proyecto Node

Scripts comunes en APIs de producción:
  "dev":   "tsx watch src/server.ts"     → desarrollo con hot reload
  "build": "tsc"                          → compilar TypeScript
  "start": "node dist/server.js"          → producción
  "test":  "vitest run"                   → CI/CD
  "lint":  "eslint src/"                  → calidad

"type": "module" → habilita import/export en .js
"engines": { "node": ">=20" } → documenta versión mínima

En entrevista:
  • npm ci vs npm install → ci usa package-lock exacto (CI/CD)
  • devDependencies vs dependencies → dev no van a producción`,
    explanationText: "En Cloud Run/Docker el CMD ejecuta npm start. El script start debe apuntar al build compilado, no a tsx.",
    codeSnippet:
`{
  "name": "my-api",
  "[INPUT_1]": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "[INPUT_2]": "node dist/server.js",
    "test": "vitest run"
  },
  "engines": { "node": ">=[INPUT_3]" }
}`,
    inputs: { INPUT_1: "type", INPUT_2: "start", INPUT_3: "20" },
    completeCode: "\"type\": \"module\" | \"start\": \"node dist/server.js\" | engines node >=20"
  }

];

const NODEJS_EXERCISES = NODEJS_PRO_EXERCISES;
