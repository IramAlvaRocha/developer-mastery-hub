import type { Exercise } from "@/lib/types";

/** Ruta progresiva: de cero a proyecto Node + TypeScript moderno (2026). */
export const NODEJS_SETUP_EXERCISES: Exercise[] = [
  {
    id: 1,
    step: 1,
    title: "npm init: Nacer un Proyecto Node",
    stars: 1,
    category: "INICIO",
    description:
      "Todo proyecto Node empieza con un package.json: el 'acta de nacimiento' que describe nombre, versión y scripts.",
    objective: "Crear package.json con npm init",
    tags: ["npm init", "package.json", "setup"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: npm init — El Primer Paso

Node.js trae **npm** (Node Package Manager) incluido. Es la herramienta estándar para:
  • Crear proyectos (\`npm init\`)
  • Instalar librerías (\`npm install express\`)
  • Ejecutar scripts (\`npm run dev\`)

Comando más usado en 2026:
  npm init -y
  El flag \`-y\` acepta valores por defecto sin preguntarte 10 cosas.

Versiones Node.js en 2026:
  • Node.js **24.x** → LTS activa (Active LTS) hasta oct. 2026
  • Node.js **22.x** → mantenimiento (Maintenance LTS) hasta abr. 2027
  • Node.js **26.x** → "Current" (será la próxima LTS activa desde oct. 2026)
  • Verifica con: node -v  y  npm -v

Archivos que nace tu proyecto:
  my-api/
  ├── package.json      ← metadatos y scripts
  ├── package-lock.json ← versiones exactas (generado al instalar)
  └── node_modules/     ← dependencias (NO va a git)`,
    explanationText:
      "Ejemplo cotidiano: package.json es como la carátula de un cuaderno — nombre, materia y reglas. Sin él, npm no sabe qué proyecto eres.",
    codeSnippet:
`# Crear carpeta y entrar
mkdir my-api && cd my-api

# Inicializar con valores por defecto
npm [INPUT_1] [INPUT_2]

# Verifica que se creó package.json
cat package.json`,
    inputs: { INPUT_1: "init", INPUT_2: "-y" },
    completeCode: "npm init -y → crea package.json con name, version, scripts vacíos",
  },

  {
    id: 2,
    step: 2,
    title: "Hola Mundo: Tu Primer Archivo Node",
    stars: 1,
    category: "INICIO",
    description:
      "Antes de Express, frameworks o TypeScript: un solo archivo .js que Node ejecuta directamente.",
    objective: "Ejecutar node index.js",
    tags: ["node", "console.log", "entry point"],
    fileName: "index.js",
    completed: false,
    theory: `📚 TEORÍA: El Entry Point

Node ejecuta **un archivo** que tú le indicas. Por convención:
  • index.js  o  index.ts  → punto de entrada
  • src/server.ts           → en proyectos más grandes

Comando:
  node index.js

¿Qué pasa internamente?
  1. Node lee el archivo
  2. Lo compila a bytecode (V8 engine)
  3. Ejecuta línea por línea

No necesitas compilar JavaScript puro — Node lo corre directo.`,
    explanationText:
      "Es como encender la licuadora y apretar ON: le das un archivo y Node lo procesa. Express y TypeScript vienen después.",
    codeSnippet:
`// index.js — tu primer programa
[INPUT_1].log('🚀 API lista en Node.js');

const port = [INPUT_2];
console.log(\`Escuchando concepto en puerto \${port}\`);`,
    inputs: { INPUT_1: "console", INPUT_2: "3000" },
    completeCode: "console.log('...') | node index.js en terminal",
  },

  {
    id: 3,
    step: 3,
    title: "HTTP Nativo: Servidor Sin Dependencias",
    stars: 2,
    category: "INICIO",
    description:
      "Node incluye el módulo http para crear servidores web sin instalar nada. Express lo simplifica, pero conviene ver la base.",
    objective: "http.createServer + listen",
    tags: ["http", "createServer", "nativo"],
    fileName: "server.js",
    completed: false,
    theory: `📚 TEORÍA: http.createServer

Node trae **http** en su biblioteca estándar (no hace falta npm install).

Flujo mínimo:
  1. createServer(callback) → crea el servidor
  2. El callback recibe (req, res) por cada petición
  3. listen(PORT) → empieza a escuchar conexiones

En producción usas Express/Fastify, pero en entrevistas preguntan:
  "¿Cómo funciona un servidor HTTP por debajo?"`,
    explanationText:
      "Analogía: http nativo es cocinar desde cero; Express es usar un kit de meal prep. Ambos sirven comida, uno requiere más pasos.",
    codeSnippet:
`import { [INPUT_1] } from 'node:http';

const server = [INPUT_2]((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, path: req.url }));
});

const PORT = 3000;
server.[INPUT_3](PORT, () => {
  console.log(\`http://localhost:\${PORT}\`);
});`,
    inputs: { INPUT_1: "createServer", INPUT_2: "createServer", INPUT_3: "listen" },
    completeCode: "import http from 'node:http' | createServer | listen(3000)",
  },

  {
    id: 4,
    step: 4,
    title: "ES Modules: type module en package.json",
    stars: 2,
    category: "INICIO",
    description:
      "En 2026 los proyectos nuevos usan import/export (ESM), no require(). Se habilita con una línea en package.json.",
    objective: "Habilitar ESM moderno",
    tags: ["ESM", "type module", "import"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: ESM vs CommonJS (2026)

  ❌ Legacy:  const express = require('express');
  ✅ Moderno: import express from 'express';

Para habilitar ESM en todo el proyecto:
  "type": "module" en package.json

Alternativas:
  • .mjs → siempre ESM
  • .cjs → siempre CommonJS (configs legacy)

TypeScript en 2026 compila a ESM con:
  "module": "NodeNext"
  "moduleResolution": "NodeNext"`,
    explanationText:
      "require es como pedir por teléfono; import es como usar una app de delivery con menú claro. La industria migró a import.",
    codeSnippet:
`// package.json
{
  "name": "my-api",
  "[INPUT_1]": "[INPUT_2]",
  "main": "src/index.js"
}

// src/index.js
[INPUT_3] express from 'express';`,
    inputs: { INPUT_1: "type", INPUT_2: "module", INPUT_3: "import" },
    completeCode: '"type": "module" | import express from "express"',
  },

  {
    id: 5,
    step: 5,
    title: "npm install: Tu Primera Dependencia",
    stars: 1,
    category: "INICIO",
    description:
      "Express es el framework HTTP más usado en Node. Lo instalas con npm y queda registrado en package.json.",
    objective: "Instalar express y usarlo",
    tags: ["npm install", "express", "dependencies"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: npm install

  npm install express        → producción (dependencies)
  npm install -D typescript  → desarrollo (devDependencies)

¿Qué genera?
  • node_modules/     → código de las librerías
  • package-lock.json → versiones exactas (commitea esto)
  • package.json      → actualiza la lista de deps

Versiones en 2026:
  • express ^5.x      → Express 5 estable (async nativo, mejor routing)
  • Si ves ^4.x en legacy, la migración a 5 es gradual

Comandos útiles:
  npm ls express      → versión instalada
  npm outdated        → deps desactualizadas`,
    explanationText:
      "npm install es como agregar ingredientes a tu despensa: quedan registrados en la lista (package.json) para que cualquiera replique tu cocina.",
    codeSnippet:
`# Instalar Express 5 (producción)
npm [INPUT_1] [INPUT_2]

# package.json resultante
{
  "dependencies": {
    "[INPUT_3]": "^5.0.0"
  }
}

// src/index.js
import express from 'express';
const app = [INPUT_4]();
app.get('/', (req, res) => res.json({ hello: 'world' }));`,
    inputs: { INPUT_1: "install", INPUT_2: "express", INPUT_3: "express", INPUT_4: "express" },
    completeCode: "npm install express | dependencies | const app = express()",
  },

  {
    id: 6,
    step: 6,
    title: ".gitignore: Proteger el Repositorio",
    stars: 1,
    category: "INICIO",
    description:
      "Antes de subir a GitHub, excluye node_modules, .env y carpetas de build. Es obligatorio en cualquier proyecto profesional.",
    objective: "Configurar .gitignore básico",
    tags: [".gitignore", "node_modules", ".env"],
    fileName: ".gitignore",
    completed: false,
    theory: `📚 TEORÍA: Qué NO subir a Git

  node_modules/   → se regenera con npm ci (puede pesar GB)
  .env            → secretos (API keys, passwords)
  dist/           → código compilado (se genera con npm run build)
  .DS_Store       → basura de macOS

Sí subir:
  package.json + package-lock.json
  tsconfig.json
  .env.example    → plantilla SIN secretos reales
  src/            → código fuente`,
    explanationText:
      "Es como no compartir la llave de tu casa en redes: .env tiene secretos; node_modules es pesado y se reconstruye solo.",
    codeSnippet:
`# .gitignore — Node.js API 2026
[INPUT_1]/
.env
.env.local
[INPUT_2]/
*.log
.DS_Store`,
    inputs: { INPUT_1: "node_modules", INPUT_2: "dist" },
    completeCode: "node_modules/ | .env | dist/ — nunca commitees secretos ni deps",
  },

  {
    id: 7,
    step: 7,
    title: "Hot Reload con node --watch (Nativo)",
    stars: 2,
    category: "DEV",
    description:
      "Desde Node 20+, --watch reinicia el servidor al guardar cambios. No necesitas instalar nodemon para empezar.",
    objective: "Usar node --watch en desarrollo",
    tags: ["node --watch", "hot reload", "Node 22"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: node --watch (Built-in)

Antes: instalabas nodemon por separado.
Ahora (Node 20+): Node trae watch mode nativo.

  node --watch src/index.js
  node --watch index.ts   (con tsx, ver ejercicio 12)

Ventajas:
  ✅ Cero dependencias extra
  ✅ Mantenido por el equipo de Node
  ✅ Suficiente para proyectos pequeños/medianos

Cuándo usar nodemon aún:
  • Config avanzada (ignorar carpetas específicas)
  • Proyectos legacy con .nodemon.json existente`,
    explanationText:
      "Como un microondas con sensor: detecta que cambiaste algo y reinicia solo, sin instalar un aparato extra.",
    codeSnippet:
`// package.json — script de desarrollo sin nodemon
{
  "scripts": {
    "dev": "node [INPUT_1] src/index.js"
  }
}

# Ejecutar
npm run [INPUT_2]`,
    inputs: { INPUT_1: "--watch", INPUT_2: "dev" },
    completeCode: '"dev": "node --watch src/index.js" | npm run dev',
  },

  {
    id: 8,
    step: 8,
    title: "nodemon: Hot Reload Clásico",
    stars: 2,
    category: "DEV",
    description:
      "nodemon sigue siendo muy popular en empresas y tutoriales. Conviene conocerlo para proyectos existentes y entrevistas.",
    objective: "Configurar nodemon como devDependency",
    tags: ["nodemon", "devDependency", "watch"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: nodemon

Instalación (solo desarrollo):
  npm install -D nodemon

Uso:
  npx nodemon src/index.js
  // o en scripts: "dev": "nodemon src/index.js"

Archivo nodemon.json (opcional):
  {
    "watch": ["src"],
    "ext": "js,json",
    "ignore": ["dist", "node_modules"]
  }

2026 en la práctica:
  • Proyectos nuevos TS → tsx watch (ejercicio 12)
  • Proyectos JS legacy → nodemon
  • Proyectos simples JS → node --watch`,
    explanationText:
      "nodemon es el asistente que vigila tu código y dice 'cambió algo, reinicio el servidor'. Muy común en codebases de empresas.",
    codeSnippet:
`# Instalar como devDependency
npm install -[INPUT_1] [INPUT_2]

// package.json
{
  "scripts": {
    "dev": "[INPUT_3] src/index.js"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`,
    inputs: { INPUT_1: "D", INPUT_2: "nodemon", INPUT_3: "nodemon" },
    completeCode: "npm install -D nodemon | \"dev\": \"nodemon src/index.js\"",
  },

  {
    id: 9,
    step: 9,
    title: "Type Stripping: Node Ejecuta .ts Sin Instalar Nada",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "Desde Node 23.6 (estable en 24.12+), Node ejecuta archivos .ts directamente quitando las anotaciones de tipos. Sin tsx, sin ts-node, sin compilar.",
    objective: "Ejecutar un archivo .ts de forma nativa con node",
    tags: ["type stripping", "node --watch", "Node 24"],
    fileName: "src/index.ts",
    completed: false,
    theory: `📚 TEORÍA: Type Stripping — TypeScript Nativo en Node (2026)

Node lleva desde 2024 integrando soporte nativo de TypeScript:
  • Node 22.6  → flag experimental --experimental-strip-types
  • Node 23.6  → habilitado por defecto (aún con warning)
  • Node 24.12 / 25.2 → **estable**, sin warnings

¿Qué hace? Borra las anotaciones de tipos (interfaces, ": string", etc.)
y ejecuta el JavaScript que queda. NO compila, NO type-checkea.

  node src/index.ts             ✅ funciona sin instalar nada
  node --watch src/index.ts     ✅ hot reload nativo + TypeScript

Limitaciones (sintaxis que SÍ genera código, no solo tipos):
  ❌ enum, namespace con lógica, parameter properties
  ✅ interfaces, type, as, satisfies, import type — soportado

Sigue haciendo falta tsc para chequear tipos:
  npx tsc --noEmit   → Node solo borra tipos, no valida que sean correctos`,
    explanationText:
      "Es como quitarle las etiquetas de precio a un producto antes de la caja: Node borra los tipos (etiquetas) y corre el JavaScript que queda, sin revisar si el precio estaba bien puesto.",
    codeSnippet:
`// src/index.ts — ejecuta con: node --watch src/index.ts (cero dependencias)
interface [INPUT_1] {
  name: string;
}

const user: User = { name: 'Ada Lovelace' };
console.log(\`Hola \${user.[INPUT_2]}\`);

// Node borra "interface User" y ": User" antes de ejecutar (type stripping)`,
    inputs: { INPUT_1: "User", INPUT_2: "name" },
    completeCode: "node --watch src/index.ts ejecuta TS directo (Node 24.12+) | tsc --noEmit sigue validando tipos",
  },

  {
    id: 10,
    step: 10,
    title: "Instalar TypeScript en el Proyecto",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "TypeScript es JavaScript con tipos. En 2026 es el estándar de facto para APIs Node profesionales, incluso con type stripping nativo disponible.",
    objective: "Agregar typescript y @types/node",
    tags: ["typescript", "@types/node", "devDependencies"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: TypeScript en Node (2026)

Paquetes esenciales (devDependencies):
  typescript   → compilador (tsc) + type-checking real
  @types/node  → tipos del runtime de Node (process, fs, http...)
  tsx          → ejecutar .ts con soporte completo de tsconfig (próximo ejercicio)

Versiones típicas 2026:
  typescript ^6.0   → última estable, puente hacia TS 7 (compilador nativo en Go)
  @types/node ^24   → alineado con Node 24 LTS activa
  (Si el equipo aún no migra, ^5.9 sigue siendo soportado)

El type stripping nativo (ejercicio anterior) NO reemplaza a typescript:
  • node ejecuta y borra tipos, pero no avisa si hay errores de tipos
  • typescript + tsc siguen siendo obligatorios para el IDE y el CI

¿Por qué TypeScript en backend?
  ✅ Autocompletado en el IDE
  ✅ Errores en compile-time, no en producción
  ✅ Refactoring seguro
  ✅ Mejor onboarding en equipos`,
    explanationText:
      "TypeScript es como revisar la lista del súper antes de salir: detectas que falta algo ANTES de llegar a caja (producción).",
    codeSnippet:
`# Instalar TypeScript + tipos de Node
npm install -[INPUT_1] [INPUT_2] @types/[INPUT_3]

# Verificar versión
npx tsc --[INPUT_4]`,
    inputs: { INPUT_1: "D", INPUT_2: "typescript", INPUT_3: "node", INPUT_4: "version" },
    completeCode: "npm install -D typescript @types/node | npx tsc --version",
  },

  {
    id: 11,
    step: 11,
    title: "tsconfig.json: Generar y Entender (TypeScript 6.0)",
    stars: 3,
    category: "TYPESCRIPT",
    description:
      "tsconfig.json le dice al compilador cómo chequear y transformar tu TypeScript. TypeScript 6.0 (2026) cambió varios valores por defecto: hay que conocer la trampa de 'types'.",
    objective: "npx tsc --init y opciones clave en TS 6.0",
    tags: ["tsconfig", "tsc", "compilerOptions", "TypeScript 6"],
    fileName: "tsconfig.json",
    completed: false,
    theory: `📚 TEORÍA: tsconfig.json en la Era de TypeScript 6.0

Generar plantilla:
  npx tsc --init

TypeScript 6.0 cambió los valores por defecto (antes eran distintos):
  "strict"    → true por defecto   (antes: false)
  "module"    → "esnext" por defecto (antes: "commonjs")
  "target"    → año ECMAScript actual, hoy "es2025" (flotante)
  "types"     → [] por defecto ⚠️  (antes: cargaba TODO node_modules/@types)

La trampa de "types": []:
  Si no agregas "types": ["node"], TypeScript ya NO reconoce
  process, __dirname ni los módulos nativos (aunque tengas
  @types/node instalado). Verás: "Cannot find name 'process'".

Config recomendada para una API Node en 2026:
  "module": "nodenext"          → resolución específica de Node (mejor que "esnext" genérico)
  "moduleResolution": "nodenext"
  "types": ["node"]             → obligatorio, ya no es automático
  "rootDir": "./src"
  "outDir": "./dist"
  "strict": true                → ya viene por defecto, pero sé explícito

"moduleResolution": "node10" quedó deprecado → usa "nodenext" o "bundler".`,
    explanationText:
      "En TS 6 el compilador viene 'modo estricto' de fábrica, como un auto con el modo Eco activado por defecto: mejor para casi todos, pero si dependías de una función vieja (cargar todos los @types), ahora tienes que activarla tú mismo con 'types'.",
    codeSnippet:
`# Generar tsconfig.json
npx [INPUT_1] --[INPUT_2]

// tsconfig.json — Node API con TypeScript 6.0
{
  "compilerOptions": {
    "[INPUT_3]": "./src",
    "outDir": "./[INPUT_4]",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "types": ["[INPUT_5]"]
  },
  "include": ["src/**/*"]
}`,
    inputs: { INPUT_1: "tsc", INPUT_2: "init", INPUT_3: "rootDir", INPUT_4: "dist", INPUT_5: "node" },
    completeCode: 'npx tsc --init | rootDir ./src | outDir ./dist | "types": ["node"] obligatorio en TS 6 | strict true por defecto',
  },

  {
    id: 12,
    step: 12,
    title: "tsx: Ejecutar TypeScript con Soporte Completo",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "tsx sigue siendo el estándar en la mayoría de proyectos: a diferencia del type stripping nativo, respeta tsconfig.json completo y soporta enums, decorators y paths alias.",
    objective: "tsx watch para dev server",
    tags: ["tsx", "watch", "dev"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: tsx vs Type Stripping Nativo (2026)

Desde que Node soporta TypeScript nativo (ejercicio 9), tsx pasó de
"obligatorio" a "recomendado para casi todo". Cuándo elegir cada uno:

  Type stripping nativo (node --watch archivo.ts):
    ✅ Cero dependencias, ideal para scripts sueltos
    ❌ No soporta enum, namespace con código, decorators, paths alias

  tsx (npm install -D tsx):
    ✅ Soporta TODO: enums, decorators, paths (@/...), JSX
    ✅ Respeta tsconfig.json completo
    ✅ Sigue siendo el default en la mayoría de starters/plantillas 2026

  ts-node → en desuso, migra a tsx o a type stripping nativo.

Scripts típicos:
  "dev":   "tsx watch src/server.ts"      (o "node --watch src/server.ts" si es simple)
  "build": "tsc"
  "start": "node dist/server.js"

Flujo de trabajo:
  Desarrollo  → tsx watch (sin carpeta dist)
  Producción  → npm run build && npm start (JS en dist/)`,
    explanationText:
      "tsx es como probar la comida mientras cocinas; tsc + node es el plato servido al cliente en el restaurante (producción).",
    codeSnippet:
`npm install -D [INPUT_1]

// package.json
{
  "scripts": {
    "dev": "tsx [INPUT_2] src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}`,
    inputs: { INPUT_1: "tsx", INPUT_2: "watch" },
    completeCode: "npm install -D tsx | \"dev\": \"tsx watch src/server.ts\"",
  },

  {
    id: 13,
    step: 13,
    title: "Scripts npm: dev, build y start",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "Los tres scripts que todo proyecto TypeScript + Node debe tener. Es lo primero que revisa un senior en un repo nuevo.",
    objective: "Pipeline dev → build → start",
    tags: ["scripts", "dev", "build", "start"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: Los 3 Scripts Sagrados

  npm run dev    → desarrollo local (hot reload, tsx watch o node --watch nativo)
  npm run build  → compila TS → JS en dist/ (para CI/CD y prod)
  npm start      → corre dist/server.js (producción, Docker, Cloud Run)

Extras comunes 2026:
  "typecheck": "tsc --noEmit"     → verifica tipos sin compilar
  "test":      "vitest run"       → tests
  "lint":      "eslint src/"      → calidad

engines en package.json:
  "engines": { "node": ">=24.0.0" }
  → documenta versión mínima (Heroku, Cloud Run lo respetan)`,
    explanationText:
      "dev = cocinar en la cocina; build = empaquetar para delivery; start = abrir el local al público.",
    codeSnippet:
`{
  "type": "module",
  "scripts": {
    "[INPUT_1]": "tsx watch src/server.ts",
    "[INPUT_2]": "tsc",
    "[INPUT_3]": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  },
  "engines": { "node": ">=[INPUT_4]" }
}`,
    inputs: { INPUT_1: "dev", INPUT_2: "build", INPUT_3: "start", INPUT_4: "24" },
    completeCode: "dev: tsx watch | build: tsc | start: node dist/server.js | engines >=24",
  },

  {
    id: 14,
    step: 14,
    title: "@types: Tipos para Librerías JavaScript",
    stars: 3,
    category: "TYPESCRIPT",
    description:
      "Express está escrito en JS. @types/express le dice a TypeScript la forma de req, res y app.",
    objective: "Instalar @types/express y tipar handlers",
    tags: ["@types", "express", "Request", "Response"],
    fileName: "src/server.ts",
    completed: false,
    theory: `📚 TEORÍA: DefinitelyTyped (@types/*)

Muchas librerías JS no traen tipos. La comunidad los publica en:
  npm install -D @types/express
  npm install -D @types/cors
  npm install -D @types/bcrypt

Regla:
  • Librería en JS puro → busca @types/nombre
  • Librería moderna en TS (zod, hono, drizzle) → tipos incluidos

Tipado de handler Express:
  import type { Request, Response } from 'express';
  app.get('/', (req: Request, res: Response) => { ... });`,
    explanationText:
      "@types es como el manual traducido al español para una herramienta japonesa: Express habla JS, @types/express le enseña TypeScript el vocabulario.",
    codeSnippet:
`npm install -D @types/[INPUT_1]

import express, { type [INPUT_2], type [INPUT_3] } from 'express';

const app = express();

app.get('/health', (req: [INPUT_4], res: Response) => {
  res.json({ status: 'ok' });
});`,
    inputs: { INPUT_1: "express", INPUT_2: "Request", INPUT_3: "Response", INPUT_4: "Request" },
    completeCode: "@types/express | Request, Response | req: Request, res: Response",
  },

  {
    id: 15,
    step: 15,
    title: "Variables de Entorno con dotenv",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "Puerto, URLs de BD y API keys van en .env, nunca hardcodeadas. dotenv las carga en process.env al iniciar (o el soporte nativo de Node desde la 20.6+).",
    objective: "Configurar dotenv en TypeScript",
    tags: ["dotenv", ".env", "process.env"],
    fileName: "src/config/env.ts",
    completed: false,
    theory: `📚 TEORÍA: .env en TypeScript (2026)

Instalar:
  npm install dotenv

Forma moderna (ESM):
  import 'dotenv/config';   // primera línea de server.ts

Archivos:
  .env              → valores reales (gitignore)
  .env.example      → plantilla commiteada

Alternativa NATIVA sin dotenv (Node 20.6+):
  node --env-file=.env src/server.ts     → carga .env desde la CLI
  process.loadEnvFile('.env')            → carga .env desde código (Node 21.7+)

¿dotenv o nativo? En 2026 muchos proyectos simples ya no instalan dotenv:
  dotenv  → multi-entorno (.env.test, .env.production), interpolación avanzada
  nativo  → cero dependencias, alcanza para la mayoría de APIs

Tipado seguro (recomendado con cualquiera de los dos):
  Validar con Zod al arrancar — si falta DATABASE_URL, crash inmediato
  con mensaje claro (fail fast).

Alternativa producción:
  Variables del sistema (Cloud Run, Docker -e, GitHub Secrets)
  → no necesitas .env en prod, solo en local`,
    explanationText:
      ".env es tu libreta de contraseñas personal que nunca prestas; .env.example es la plantilla vacía que sí compartes con el equipo.",
    codeSnippet:
`import '[INPUT_1]/config';

const PORT = process.[INPUT_2].PORT ?? [INPUT_3];
const DB_URL = process.env.[INPUT_4];

app.listen(PORT, () => console.log(\`Puerto \${PORT}\`));`,
    inputs: { INPUT_1: "dotenv", INPUT_2: "env", INPUT_3: "3000", INPUT_4: "DATABASE_URL" },
    completeCode: "import 'dotenv/config' | process.env.PORT | .env + .env.example",
  },

  {
    id: 16,
    step: 16,
    title: "Estructura src/ y Entry Point TypeScript",
    stars: 2,
    category: "TYPESCRIPT",
    description:
      "Organiza el código en src/ desde el día uno. server.ts importa app.ts; las rutas viven en routes/.",
    objective: "Layout mínimo profesional",
    tags: ["src/", "estructura", "server.ts"],
    fileName: "project-layout.md",
    completed: false,
    theory: `📚 TEORÍA: Estructura Mínima 2026

my-api/
├── src/
│   ├── server.ts       → listen(PORT) — arranca el servidor
│   ├── app.ts          → configura Express (middlewares, routes)
│   ├── routes/
│   │   └── health.ts
│   └── config/
│       └── env.ts
├── dist/               → generado por tsc (gitignore)
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json

server.ts vs app.ts:
  • app.ts exporta la app Express (testeable con supertest)
  • server.ts hace app.listen() — solo en runtime real`,
    explanationText:
      "Separar app.ts de server.ts es como tener la receta (app) aparte del horno encendido (server): puedes probar la receta sin quemar nada.",
    codeSnippet:
`// src/app.ts
import express from 'express';
export const app = [INPUT_1]();

// src/server.ts
import { app } from './[INPUT_2].js';
import 'dotenv/config';

const PORT = process.env.PORT ?? 3000;
app.[INPUT_3](PORT, () => console.log(\`🚀 \${PORT}\`));`,
    inputs: { INPUT_1: "express", INPUT_2: "app", INPUT_3: "listen" },
    completeCode: "app.ts exporta express() | server.ts import app | app.listen(PORT)",
  },

  {
    id: 17,
    step: 17,
    title: "Checklist: Proyecto Node + TS Listo para Desarrollar",
    stars: 3,
    category: "TYPESCRIPT",
    description:
      "Repaso final del stack moderno 2026: desde npm init hasta npm run dev con TypeScript 6.0, type stripping nativo, tipos y variables de entorno.",
    objective: "Stack completo de inicio de proyecto",
    tags: ["checklist", "2026", "setup completo"],
    fileName: "README.md",
    completed: false,
    theory: `📚 TEORÍA: Stack de Inicio Node API (2026)

Terminal — crear proyecto:
  mkdir my-api && cd my-api
  npm init -y
  npm install express dotenv
  npm install -D typescript @types/node @types/express tsx

Archivos clave:
  package.json   → "type":"module", scripts dev/build/start
  tsconfig.json  → strict (default), nodenext, rootDir src, outDir dist, types: ["node"]
  .gitignore     → node_modules, .env, dist
  .env.example   → PORT=3000

Comandos diarios:
  npm run dev        → tsx watch src/server.ts (o node --watch server.ts sin deps)
  npm run typecheck  → tsc --noEmit
  npm run build && npm start  → simular producción

Node LTS: 24.x activa (22.x en mantenimiento) | TypeScript: 6.x | Express: 5.x | tsx: latest`,
    explanationText:
      "Con este checklist tienes lo mismo que monta un dev senior el día 1 en un proyecto nuevo. El módulo Node.js Backend continúa con JWT, Prisma y producción.",
    codeSnippet:
`# Checklist rápido — completa los huecos
✅ Node [INPUT_1] LTS instalado
✅ npm init -y + "type": "[INPUT_2]"
✅ npm install -D typescript @types/node [INPUT_3]
✅ tsconfig: strict (default TS6) + nodenext + types: ["node"]
✅ Scripts: dev ([INPUT_4] watch), build (tsc), start (node dist/...)
✅ .gitignore: node_modules, .env, dist
✅ import 'dotenv/config' (o node --env-file=.env) + .env.example`,
    inputs: { INPUT_1: "24", INPUT_2: "module", INPUT_3: "tsx", INPUT_4: "tsx" },
    completeCode: "Node 24 LTS | type module | tsx + typescript + @types | dev/build/start | dotenv o --env-file",
  },
];
