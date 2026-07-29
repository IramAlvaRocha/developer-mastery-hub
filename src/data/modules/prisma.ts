import type { Exercise } from "@/lib/types";

/**
 * Prisma ORM — ruta progresiva desde cero.
 * Contenido alineado con docs actuales de Prisma (Context7: /websites/prisma_io),
 * incluyendo patrones de Prisma ORM 7 (prisma.config.ts, generator prisma-client, adapters).
 */
export const PRISMA_EXERCISES: Exercise[] = [

  // ─── SECCIÓN 1: FUNDAMENTOS ─────────────────────────────────────────────────

  {
    id: 1,
    step: 1,
    title: "Qué es Prisma ORM",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "Prisma es un ORM TypeScript de nueva generación: schema declarativo, migraciones y un cliente type-safe generado.",
    objective: "Identificar las 3 piezas principales de Prisma",
    tags: ["ORM", "Prisma Client", "schema", "migrate"],
    fileName: "conceptos.md",
    completed: false,
    theory: `📚 TEORÍA: Las 3 piezas de Prisma

Prisma no es solo un query builder. Tiene tres componentes:

  1. Prisma Schema (schema.prisma)
     → Define modelos, campos, relaciones y el datasource.
     → Es la fuente de verdad del data model.

  2. Prisma Migrate
     → Genera y aplica migraciones SQL a partir del schema.
     → Comandos: migrate dev, migrate deploy, db push.

  3. Prisma Client
     → Cliente TypeScript generado automáticamente.
     → Autocomplete, tipos estrictos y prepared statements.

Analogía cotidiana:
  • Schema  = el plano de la casa
  • Migrate = el equipo de obra que construye según el plano
  • Client  = el mando a distancia type-safe para usar la casa

¿Por qué Prisma frente a SQL crudo?
  ✅ Tipos generados → menos bugs en runtime
  ✅ Menos SQL injection (API parametrizada)
  ✅ Relaciones con include/select sin JOINs manuales`,
    explanationText:
      "Completa los nombres de las tres piezas: Schema, Migrate y Client.",
    codeSnippet:
`// Prisma = 3 piezas
// 1) Prisma [INPUT_1]  → modelos en schema.prisma
// 2) Prisma [INPUT_2]  → migraciones SQL
// 3) Prisma [INPUT_3]  → API TypeScript generada

const user = await prisma.user.findUnique({ where: { id: 1 } });`,
    inputs: { INPUT_1: "Schema", INPUT_2: "Migrate", INPUT_3: "Client" },
    completeCode: "Schema | Migrate | Client — las tres piezas del ORM",
  },

  {
    id: 2,
    step: 2,
    title: "Instalación e inicialización",
    stars: 1,
    category: "SETUP",
    description:
      "Instala Prisma CLI y el cliente, luego inicializa el proyecto para crear schema y configuración.",
    objective: "Usar npm install y npx prisma init",
    tags: ["npm", "prisma init", "setup", "@prisma/client"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Arrancar un proyecto Prisma

Dependencias típicas:
  npm install @prisma/client
  npm install -D prisma

Inicialización:
  npx prisma init

Eso crea (según versión):
  • prisma/schema.prisma  → data model
  • .env                  → DATABASE_URL (no lo subas a git)
  • En Prisma 7: prisma.config.ts para la URL del datasource

Después del schema:
  npx prisma generate   → regenera el Client
  npx prisma migrate dev → crea/aplica migraciones
  npx prisma studio     → GUI para ver/editar datos

Requisitos recientes (Prisma ORM 7):
  • Node.js 20.19+
  • TypeScript 5.4+`,
    explanationText:
      "Instala el paquete del cliente y ejecuta el comando de inicialización.",
    codeSnippet:
`# Dependencia de runtime
npm install @prisma/[INPUT_1]

# CLI como devDependency
npm install -D prisma

# Crear schema y config base
npx prisma [INPUT_2]`,
    inputs: { INPUT_1: "client", INPUT_2: "init" },
    completeCode: "npm install @prisma/client && npx prisma init",
  },

  {
    id: 3,
    step: 3,
    title: "schema.prisma: generator y datasource",
    stars: 2,
    category: "SCHEMA",
    description:
      "El schema empieza con generator (cómo se genera el Client) y datasource (qué base de datos usas).",
    objective: "Configurar generator client y datasource postgresql",
    tags: ["generator", "datasource", "schema.prisma", "postgresql"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: generator + datasource

En Prisma ORM 7 el generator recomendado es:
  generator client {
    provider = "prisma-client"
    output   = "./generated"   // ¡requerido en v7!
  }

El datasource declara el proveedor:
  datasource db {
    provider = "postgresql"
  }

Nota importante (v7):
  • La url ya NO va en schema.prisma
  • Se define en prisma.config.ts con env("DATABASE_URL")
  • Proveedores comunes: postgresql, mysql, sqlite, sqlserver, mongodb

En versiones anteriores (v6) era frecuente:
  provider = "prisma-client-js"
  url = env("DATABASE_URL") dentro del datasource`,
    explanationText:
      "Completa el provider del generator, el output y el provider de la base de datos.",
    codeSnippet:
`// prisma/schema.prisma
generator client {
  provider = "[INPUT_1]"
  output   = "./[INPUT_2]"
}

datasource db {
  provider = "[INPUT_3]"
}`,
    inputs: {
      INPUT_1: "prisma-client",
      INPUT_2: "generated",
      INPUT_3: "postgresql",
    },
    completeCode:
      'generator provider = "prisma-client" + output + datasource postgresql',
  },

  {
    id: 4,
    step: 4,
    title: "prisma.config.ts: URL de conexión",
    stars: 2,
    category: "CONFIG",
    description:
      "En Prisma 7 la URL de la base de datos vive en prisma.config.ts, no en el schema.",
    objective: "Definir datasource.url con defineConfig y env()",
    tags: ["prisma.config.ts", "defineConfig", "DATABASE_URL", "v7"],
    fileName: "prisma.config.ts",
    completed: false,
    theory: `📚 TEORÍA: prisma.config.ts (Prisma 7)

Este archivo configura el CLI (migrate, db push, etc.):

  import "dotenv/config";
  import { defineConfig, env } from "prisma/config";

  export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: { path: "prisma/migrations" },
    datasource: {
      url: env("DATABASE_URL"),
    },
  });

¿Por qué separar la URL?
  • El schema describe el modelo (portable, sin secretos)
  • La config CLI maneja conexión y rutas
  • Evita mezclar secretos con el data model

Nunca hardcodees la contraseña: usa .env + env("DATABASE_URL").`,
    explanationText:
      "Usa defineConfig y env para leer DATABASE_URL de forma segura.",
    codeSnippet:
`import "dotenv/config";
import { defineConfig, [INPUT_1] } from "prisma/config";

export default [INPUT_2]({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: [INPUT_1]("[INPUT_3]"),
  },
});`,
    inputs: {
      INPUT_1: "env",
      INPUT_2: "defineConfig",
      INPUT_3: "DATABASE_URL",
    },
    completeCode:
      'defineConfig({ datasource: { url: env("DATABASE_URL") } })',
  },

  // ─── SECCIÓN 2: MODELOS Y ATRIBUTOS ─────────────────────────────────────────

  {
    id: 5,
    step: 5,
    title: "Modelos, @id y @default",
    stars: 2,
    category: "SCHEMA",
    description:
      "Un model mapea a una tabla. @id marca la clave primaria; @default define valores automáticos.",
    objective: "Definir un model User con id autoincremental y timestamps",
    tags: ["model", "@id", "@default", "autoincrement", "now()"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: Models y field attributes

model User { ... }  → tabla "User" (o "users" según @@map)

Atributos de campo frecuentes:
  @id                         → primary key
  @default(autoincrement())   → Int que se incrementa solo
  @default(cuid()) / uuid()   → IDs string generados
  @default(now())             → timestamp al crear
  @updatedAt                  → se actualiza en cada update
  @unique                     → constraint UNIQUE
  @map("column_name")         → nombre de columna en SQL

Tipos escalares: String, Int, Float, Boolean, DateTime, Json, Bytes, Decimal

Analogía: @id es el DNI; @default(now()) es el sello automático de "fecha de ingreso".`,
    explanationText:
      "Marca la PK, el autoincrement y el default de createdAt.",
    codeSnippet:
`model User {
  id        Int      @[INPUT_1] @[INPUT_2](autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default([INPUT_3]())
  updatedAt DateTime @updatedAt
}`,
    inputs: {
      INPUT_1: "id",
      INPUT_2: "default",
      INPUT_3: "now",
    },
    completeCode: "@id @default(autoincrement()) | @default(now()) | @updatedAt",
  },

  {
    id: 6,
    step: 6,
    title: "Enums e índices",
    stars: 2,
    category: "SCHEMA",
    description:
      "Los enums modelan conjuntos fijos de valores. @@index y @@unique optimizan y restringen a nivel de tabla.",
    objective: "Usar enum Role, @@index y @@unique compuestos",
    tags: ["enum", "@@index", "@@unique", "block attributes"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: Enums y block attributes

enum Role {
  USER
  EDITOR
  ADMIN
}

En el model:
  role Role @default(USER)

Block attributes (van al final del model):
  @@unique([firstName, lastName])  → unicidad compuesta
  @@index([email, role])           → índice para consultas
  @@map("users")                   → nombre real de la tabla
  @@id([a, b])                     → PK compuesta

¿Cuándo @@index?
  Campos que filtras u ordenas mucho (email, tenantId, createdAt).
  Sin índice, la BD hace full scan → lento a escala.`,
    explanationText:
      "Declara el enum, el default del role y un índice compuesto.",
    codeSnippet:
`[INPUT_1] Role {
  USER
  EDITOR
  ADMIN
}

model User {
  id        Int    @id @default(autoincrement())
  email     String @unique
  firstName String
  lastName  String
  role      Role   @default([INPUT_2])

  @@[INPUT_3]([firstName, lastName])
  @@index([role])
}`,
    inputs: { INPUT_1: "enum", INPUT_2: "USER", INPUT_3: "unique" },
    completeCode: "enum Role | role @default(USER) | @@unique([firstName, lastName])",
  },

  // ─── SECCIÓN 3: RELACIONES ──────────────────────────────────────────────────

  {
    id: 7,
    step: 7,
    title: "Relación uno a muchos (1:N)",
    stars: 3,
    category: "RELACIONES",
    description:
      "User tiene muchos Post. El lado N guarda la foreign key y declara @relation(fields, references).",
    objective: "Modelar User → Post[] con authorId",
    tags: ["1:N", "@relation", "foreign key", "posts"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: One-to-many

User (1) ──< Post (N)

En el padre (User):
  posts Post[]

En el hijo (Post):
  author   User @relation(fields: [authorId], references: [id])
  authorId Int

Reglas:
  • fields   → columna FK en ESTE model
  • references → campo @id (o @unique) del model relacionado
  • El array Post[] NO crea columna; solo navega la relación

Analogía: un autor tiene muchos artículos; cada artículo guarda el id del autor.`,
    explanationText:
      "Completa el array en User, @relation y el nombre de la FK.",
    codeSnippet:
`model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts [INPUT_1][]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @[INPUT_2](fields: [[INPUT_3]], references: [id])
  authorId Int
}`,
    inputs: { INPUT_1: "Post", INPUT_2: "relation", INPUT_3: "authorId" },
    completeCode:
      "posts Post[] | @relation(fields: [authorId], references: [id])",
  },

  {
    id: 8,
    step: 8,
    title: "Relación uno a uno (1:1)",
    stars: 3,
    category: "RELACIONES",
    description:
      "User ↔ Profile. En 1:1 la foreign key debe ser @unique para garantizar como máximo un perfil por usuario.",
    objective: "Modelar User–Profile con FK única",
    tags: ["1:1", "@unique", "@relation", "Profile"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: One-to-one

La diferencia clave con 1:N es @unique en la FK:

  model User {
    id        Int      @id @default(autoincrement())
    profile   Profile? @relation(fields: [profileId], references: [id])
    profileId Int?     @unique   // ← obliga a 1:1
  }

  model Profile {
    id   Int   @id @default(autoincrement())
    bio  String?
    user User?
  }

Sin @unique en profileId, Prisma lo trataría como 1:N.
El lado opcional (?) depende de en qué model pongas la FK.`,
    explanationText:
      "Marca la relación, la FK y el atributo que la hace 1:1.",
    codeSnippet:
`model User {
  id        Int      @id @default(autoincrement())
  profile   Profile? @[INPUT_1](fields: [profileId], references: [id])
  profileId Int?     @[INPUT_2]
}

model Profile {
  id   Int    @id @default(autoincrement())
  bio  String?
  user [INPUT_3]?
}`,
    inputs: { INPUT_1: "relation", INPUT_2: "unique", INPUT_3: "User" },
    completeCode: "@relation + profileId @unique + user User?",
  },

  {
    id: 9,
    step: 9,
    title: "Relación muchos a muchos implícita (N:M)",
    stars: 3,
    category: "RELACIONES",
    description:
      "Post ↔ Tag sin model intermedio en el schema: Prisma crea y gestiona la tabla de unión por ti.",
    objective: "Declarar arrays cruzados Post[] / Tag[]",
    tags: ["N:M", "implicit", "many-to-many", "tags"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: Implicit many-to-many

Si ambos lados son arrays y ambos tienen un solo @id:

  model Post {
    id   Int  @id @default(autoincrement())
    tags Tag[]
  }

  model Tag {
    id    Int   @id @default(autoincrement())
    posts Post[]
  }

Prisma crea una tabla _PostToTag (o similar) sin que aparezca en el schema.

Limitaciones de la N:M implícita:
  ❌ No puedes poner campos extra en la unión (ej. assignedBy)
  ❌ No soporta @@id compuesto en los models
  → En esos casos usa N:M explícita (ejercicio siguiente)

La API del Client queda más simple: menos anidamiento en nested writes.`,
    explanationText:
      "Completa los tipos de los arrays en ambos models.",
    codeSnippet:
`model Post {
  id    Int    @id @default(autoincrement())
  title String
  tags  [INPUT_1][]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts [INPUT_2][]
}`,
    inputs: { INPUT_1: "Tag", INPUT_2: "Post" },
    completeCode: "tags Tag[] | posts Post[] — N:M implícita",
  },

  {
    id: 10,
    step: 10,
    title: "Relación N:M explícita con join model",
    stars: 4,
    category: "RELACIONES",
    description:
      "Cuando la tabla intermedia necesita datos propios (assignedBy, assignedAt), modelas el join explícitamente.",
    objective: "Crear CategoriesOnPosts con @@id compuesto",
    tags: ["N:M", "explicit", "join table", "@@id"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: Explicit many-to-many

  Post ← CategoriesOnPosts → Category

El join model tiene:
  • FK a Post
  • FK a Category
  • Campos extra (assignedBy, assignedAt)
  • @@id([postId, categoryId]) o un id propio

En queries, filtras con some/every/none anidados:
  where: { categories: { some: { category: { name: "ORM" } } } }

Usa explícita cuando la unión es un hecho de negocio
(quién asignó el tag, cuándo, con qué score).`,
    explanationText:
      "Completa las relaciones del join model y la PK compuesta.",
    codeSnippet:
`model Post {
  id         Int                 @id @default(autoincrement())
  title      String
  categories CategoriesOnPosts[]
}

model Category {
  id    Int                 @id @default(autoincrement())
  name  String
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  assignedBy String
  assignedAt DateTime @default(now())

  @@[INPUT_1]([INPUT_2], [INPUT_3])
}`,
    inputs: { INPUT_1: "id", INPUT_2: "postId", INPUT_3: "categoryId" },
    completeCode: "@@id([postId, categoryId]) en el join model",
  },

  {
    id: 11,
    step: 11,
    title: "onDelete: Cascade y SetNull",
    stars: 3,
    category: "RELACIONES",
    description:
      "Referential actions definen qué pasa con los hijos cuando borras o actualizas el padre.",
    objective: "Configurar onDelete: Cascade en @relation",
    tags: ["onDelete", "Cascade", "SetNull", "referential actions"],
    fileName: "prisma/schema.prisma",
    completed: false,
    theory: `📚 TEORÍA: Referential actions

En @relation puedes pasar:
  onDelete: Cascade | Restrict | NoAction | SetNull | SetDefault
  onUpdate: igual

Cascade:
  Borras el User → se borran sus Posts automáticamente.
  Útil para datos que no tienen sentido sin el padre.

SetNull:
  Borras el User → Post.authorId queda null (FK debe ser opcional).
  Útil cuando quieres conservar el historial.

Restrict / NoAction:
  Impiden borrar el padre si hay hijos → seguridad contra borrados accidentales.

⚠️ Elige con cuidado: Cascade en producción puede borrar más de lo que esperas.`,
    explanationText:
      "Añade onDelete Cascade en la relación author.",
    codeSnippet:
`model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(
    fields: [authorId],
    references: [id],
    [INPUT_1]: [INPUT_2]
  )
  authorId Int
}`,
    inputs: { INPUT_1: "onDelete", INPUT_2: "Cascade" },
    completeCode: "@relation(..., onDelete: Cascade)",
  },

  // ─── SECCIÓN 4: PRISMA CLIENT ───────────────────────────────────────────────

  {
    id: 12,
    step: 12,
    title: "Prisma Client: singleton + adapter",
    stars: 3,
    category: "CLIENT",
    description:
      "Una sola instancia de PrismaClient evita agotar el pool. En Prisma 7 usas un driver adapter (ej. PrismaPg).",
    objective: "Crear singleton con PrismaClient y PrismaPg",
    tags: ["PrismaClient", "singleton", "adapter", "PrismaPg"],
    fileName: "src/lib/prisma.ts",
    completed: false,
    theory: `📚 TEORÍA: Singleton + Driver Adapter (v7)

¿Por qué singleton?
  Cada PrismaClient abre un pool de conexiones.
  En hot-reload (dev) sin singleton → fugas de conexiones.

Patrón:
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
  export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

Prisma 7 + PostgreSQL:
  import { PrismaPg } from "@prisma/adapter-pg";
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  new PrismaClient({ adapter });

Importa el Client desde el output generado (ej. ../generated/prisma/client).`,
    explanationText:
      "Completa el adapter, PrismaClient y el guardado en globalThis.",
    codeSnippet:
`import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new [INPUT_1]({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new [INPUT_2]({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.[INPUT_3] = prisma;
}`,
    inputs: {
      INPUT_1: "PrismaPg",
      INPUT_2: "PrismaClient",
      INPUT_3: "prisma",
    },
    completeCode:
      "new PrismaPg(...) | new PrismaClient({ adapter }) | globalThis.prisma",
  },

  {
    id: 13,
    step: 13,
    title: "Lecturas: findUnique y findMany",
    stars: 2,
    category: "CRUD",
    description:
      "findUnique busca por campo único; findMany lista con filtros, orden y paginación.",
    objective: "Usar findUnique y findMany con where y orderBy",
    tags: ["findUnique", "findMany", "where", "orderBy"],
    fileName: "repositories/userRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Lecturas básicas

findUnique({ where: { id } })
  → Un registro por @id o @unique. Si no existe → null.

findFirst({ where })
  → Primer match (aunque el filtro no sea único).

findMany({ where, orderBy, skip, take })
  → Lista. Sin matches → [] (nunca null).

orderBy:
  { email: "asc" } o [{ role: "asc" }, { createdAt: "desc" }]

Regla de oro:
  Usa findUnique cuando buscas por PK/unique.
  Usa findFirst cuando el criterio puede repetirse.`,
    explanationText:
      "Completa findUnique, where y findMany con orderBy.",
    codeSnippet:
`export const userRepository = {
  byId: (id: number) =>
    prisma.user.[INPUT_1]({ [INPUT_2]: { id } }),

  list: () =>
    prisma.user.[INPUT_3]({
      orderBy: { createdAt: "desc" },
    }),
};`,
    inputs: {
      INPUT_1: "findUnique",
      INPUT_2: "where",
      INPUT_3: "findMany",
    },
    completeCode: "findUnique({ where }) | findMany({ orderBy })",
  },

  {
    id: 14,
    step: 14,
    title: "Escrituras: create, update y delete",
    stars: 2,
    category: "CRUD",
    description:
      "Las mutaciones usan data para los campos y where para identificar el registro.",
    objective: "Completar create / update / delete type-safe",
    tags: ["create", "update", "delete", "data"],
    fileName: "repositories/userRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Mutaciones

create({ data: { email, name } })
  → Inserta y devuelve el registro creado.

update({ where: { id }, data: { name } })
  → Actualiza UN registro (where debe ser único).

delete({ where: { id } })
  → Borra UN registro.

Variantes en lote:
  createMany / updateMany / deleteMany
  → No siempre devuelven los registros (depende del provider).
  → updateMany/deleteMany usan where no-único.

Errores comunes (códigos Prisma):
  P2002 → unique constraint (email duplicado)
  P2025 → registro no encontrado en update/delete`,
    explanationText:
      "Rellena create, update y delete con data/where correctos.",
    codeSnippet:
`export const userRepository = {
  create: (email: string, name: string) =>
    prisma.user.[INPUT_1]({ data: { email, name } }),

  rename: (id: number, name: string) =>
    prisma.user.[INPUT_2]({
      where: { id },
      [INPUT_3]: { name },
    }),

  remove: (id: number) =>
    prisma.user.[INPUT_4]({ where: { id } }),
};`,
    inputs: {
      INPUT_1: "create",
      INPUT_2: "update",
      INPUT_3: "data",
      INPUT_4: "delete",
    },
    completeCode: "create({ data }) | update({ where, data }) | delete({ where })",
  },

  {
    id: 15,
    step: 15,
    title: "upsert: crear o actualizar",
    stars: 3,
    category: "CRUD",
    description:
      "upsert evita la carrera 'busco → si no existe creo'. Una sola operación atómica create-or-update.",
    objective: "Usar upsert con where, create y update",
    tags: ["upsert", "create", "update", "idempotente"],
    fileName: "repositories/userRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: upsert

prisma.user.upsert({
  where: { email },
  create: { email, name },
  update: { name },
})

Flujo:
  1. Busca por where (campo único)
  2. Si existe → aplica update
  3. Si no → aplica create

Ideal para:
  • Sync de usuarios desde un IdP
  • Idempotencia en webhooks
  • "Guarda este perfil sí o sí"

where debe identificar de forma única (id, email @unique, etc.).`,
    explanationText:
      "Completa upsert y las tres claves: where, create, update.",
    codeSnippet:
`export async function saveUser(email: string, name: string) {
  return prisma.user.[INPUT_1]({
    [INPUT_2]: { email },
    [INPUT_3]: { email, name },
    [INPUT_4]: { name },
  });
}`,
    inputs: {
      INPUT_1: "upsert",
      INPUT_2: "where",
      INPUT_3: "create",
      INPUT_4: "update",
    },
    completeCode: "upsert({ where, create, update })",
  },

  // ─── SECCIÓN 5: QUERIES AVANZADAS ───────────────────────────────────────────

  {
    id: 16,
    step: 16,
    title: "include vs select",
    stars: 3,
    category: "QUERIES",
    description:
      "include trae relaciones; select elige campos. Nunca expongas password u otros secretos al cliente.",
    objective: "Cargar author con select seguro e include de tags",
    tags: ["include", "select", "seguridad", "relaciones"],
    fileName: "repositories/postRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: include vs select

include: { author: true }
  → Trae la relación completa (todos los campos escalares).

select: { id: true, title: true, author: { select: { name: true } } }
  → Solo los campos que pides. Más seguro y más ligero.

Reglas:
  • No combines include y select en el mismo nivel del mismo objeto
  • En APIs públicas: siempre select (o omitir password en el schema de respuesta)
  • include: { author: true } puede filtrar password al cliente si no tienes cuidado

Analogía:
  include = "trae la caja entera"
  select  = "solo saca lo que pedí de la caja"`,
    explanationText:
      "Usa include para relaciones y select para campos del author.",
    codeSnippet:
`const posts = await prisma.post.findMany({
  where: { published: true },
  [INPUT_1]: {
    author: {
      [INPUT_2]: { id: true, name: true, email: true }, // sin password
    },
    tags: true,
  },
  orderBy: { createdAt: "[INPUT_3]" },
});`,
    inputs: { INPUT_1: "include", INPUT_2: "select", INPUT_3: "desc" },
    completeCode:
      "include: { author: { select: {...} }, tags: true } | orderBy desc",
  },

  {
    id: 17,
    step: 17,
    title: "Filtros: contains, AND y OR",
    stars: 3,
    category: "QUERIES",
    description:
      "where acepta operadores (contains, startsWith, in...) y combinadores lógicos AND/OR/NOT.",
    objective: "Filtrar posts publicados cuyo título contenga un texto",
    tags: ["where", "contains", "AND", "OR", "mode"],
    fileName: "repositories/postRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Filtering

Operadores de string (PostgreSQL):
  contains / startsWith / endsWith
  mode: "insensitive" → ignora mayúsculas

Listas y rangos:
  in / notIn / gt / gte / lt / lte

Combinadores:
  AND: [{ published: true }, { title: { contains: "prisma" } }]
  OR:  [{ role: "ADMIN" }, { role: "EDITOR" }]
  NOT: { email: { endsWith: "@temp.com" } }

Relaciones:
  some / every / none sobre colecciones
  is / isNot sobre relaciones 1:1 opcionales`,
    explanationText:
      "Completa where, contains y el combinador AND.",
    codeSnippet:
`const posts = await prisma.post.findMany({
  [INPUT_1]: {
    [INPUT_2]: [
      { published: true },
      { title: { [INPUT_3]: "prisma", mode: "insensitive" } },
    ],
  },
});`,
    inputs: { INPUT_1: "where", INPUT_2: "AND", INPUT_3: "contains" },
    completeCode: 'where: { AND: [{ published: true }, { title: { contains } }] }',
  },

  {
    id: 18,
    step: 18,
    title: "Paginación con skip y take",
    stars: 3,
    category: "QUERIES",
    description:
      "Offset pagination usa skip/take. Combínala con count en una transacción para devolver meta.",
    objective: "Paginación offset + totalPages",
    tags: ["skip", "take", "pagination", "$transaction", "count"],
    fileName: "repositories/postRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Paginación

Offset (simple):
  skip: (page - 1) * limit
  take: limit

Cursor (mejor a escala):
  cursor: { id: lastId }, take: limit, skip: 1

Patrón API:
  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({ skip, take, where }),
    prisma.post.count({ where }),
  ]);
  totalPages = Math.ceil(total / limit)

Offset es fácil de implementar; en tablas enormes preferir cursor.`,
    explanationText:
      "Completa $transaction, skip, take y Math.ceil.",
    codeSnippet:
`export async function listPosts(page: number, limit: number) {
  const where = { published: true };
  const [data, total] = await prisma.$[INPUT_1]([
    prisma.post.findMany({
      where,
      [INPUT_2]: (page - 1) * limit,
      [INPUT_3]: limit,
      orderBy: { id: "asc" },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.[INPUT_4](total / limit) },
  };
}`,
    inputs: {
      INPUT_1: "transaction",
      INPUT_2: "skip",
      INPUT_3: "take",
      INPUT_4: "ceil",
    },
    completeCode: "$transaction + skip/take + Math.ceil(total / limit)",
  },

  {
    id: 19,
    step: 19,
    title: "Nested writes: create y connect",
    stars: 4,
    category: "QUERIES",
    description:
      "Puedes crear un Post y al mismo tiempo crear o conectar su author y tags en una sola llamada.",
    objective: "Usar create anidado y connect a tags existentes",
    tags: ["nested writes", "create", "connect", "relations"],
    fileName: "repositories/postRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Nested writes

Al crear/actualizar puedes operar relaciones:

  create:  { author: { create: { email, name } } }
  connect: { author: { connect: { id: 1 } } }
  connectOrCreate: busca o crea
  disconnect / set / delete / update / upsert

Ejemplo Post + tags existentes (N:M implícita):
  prisma.post.create({
    data: {
      title: "Hola Prisma",
      author: { connect: { id: authorId } },
      tags: { connect: [{ id: 1 }, { id: 2 }] },
    },
  })

Todo ocurre en una transacción interna: si falla una parte, no queda a medias.`,
    explanationText:
      "Conecta el author y los tags con connect dentro de create.",
    codeSnippet:
`const post = await prisma.post.create({
  data: {
    title: "Hola Prisma",
    author: {
      [INPUT_1]: { id: authorId },
    },
    tags: {
      [INPUT_2]: [{ id: 1 }, { id: 2 }],
    },
  },
  include: { author: true, tags: true },
});

// Crear author nuevo en la misma operación:
await prisma.post.create({
  data: {
    title: "Otro post",
    author: { [INPUT_3]: { email: "a@b.com", name: "Ana" } },
  },
});`,
    inputs: { INPUT_1: "connect", INPUT_2: "connect", INPUT_3: "create" },
    completeCode: "author: { connect } | tags: { connect } | author: { create }",
  },

  {
    id: 20,
    step: 20,
    title: "Transacciones interactivas",
    stars: 4,
    category: "CLIENT",
    description:
      "Cuando el segundo query depende del resultado del primero, usa $transaction(async (tx) => ...).",
    objective: "Transferir créditos entre cuentas de forma atómica",
    tags: ["$transaction", "interactive", "tx", "atomicidad"],
    fileName: "services/walletService.ts",
    completed: false,
    theory: `📚 TEORÍA: Interactive transactions

Array form (paralelo / independiente):
  prisma.$transaction([q1, q2])

Interactive (secuencial, con lógica):
  await prisma.$transaction(async (tx) => {
    const from = await tx.account.update(...);
    await tx.account.update(...);
    return from;
  })

Reglas:
  • Dentro del callback usa tx, NO prisma
  • Si lanzas un error → rollback total
  • Ideal para transferencias, reservas de stock, etc.

Analogía: es una caja fuerte — o salen todos los movimientos juntos, o ninguno.`,
    explanationText:
      "Abre $transaction, usa tx.update y resta/suma el amount.",
    codeSnippet:
`export async function transfer(fromId: number, toId: number, amount: number) {
  return prisma.$[INPUT_1](async ([INPUT_2]) => {
    await [INPUT_2].account.update({
      where: { id: fromId },
      data: { balance: { [INPUT_3]: amount } },
    });
    await [INPUT_2].account.update({
      where: { id: toId },
      data: { balance: { [INPUT_4]: amount } },
    });
  });
}`,
    inputs: {
      INPUT_1: "transaction",
      INPUT_2: "tx",
      INPUT_3: "decrement",
      INPUT_4: "increment",
    },
    completeCode:
      "$transaction(async (tx) => ...) | decrement / increment",
  },

  // ─── SECCIÓN 6: MIGRATE, SEED Y RAW ─────────────────────────────────────────

  {
    id: 21,
    step: 21,
    title: "Migraciones: migrate, db push y generate",
    stars: 2,
    category: "MIGRATE",
    description:
      "Elige el comando correcto según el entorno: prototipar, desarrollar con historial o desplegar.",
    objective: "Distinguir migrate dev, db push, generate y studio",
    tags: ["migrate dev", "db push", "generate", "studio"],
    fileName: "package.json",
    completed: false,
    theory: `📚 TEORÍA: Flujo de migraciones

npx prisma generate
  → Regenera Prisma Client desde el schema (obligatorio tras cambios).
  → En Prisma 7, migrate/db push ya no generan el client solos.

npx prisma db push
  → Empuja el schema a la BD sin crear archivos de migración.
  → Ideal para prototipos / spikes. No uses en producción.

npx prisma migrate dev
  → Crea una migración SQL + la aplica (desarrollo).
  → Genera historial en prisma/migrations/.

npx prisma migrate deploy
  → Aplica migraciones pendientes (CI/producción). Sin prompts.

npx prisma studio
  → GUI local para inspeccionar datos.

Scripts típicos en package.json:
  "db:generate": "prisma generate"
  "db:migrate": "prisma migrate dev"
  "db:deploy": "prisma migrate deploy"
  "db:studio": "prisma studio"`,
    explanationText:
      "Completa generate, migrate dev y db push en los scripts.",
    codeSnippet:
`{
  "scripts": {
    "db:generate": "prisma [INPUT_1]",
    "db:migrate": "prisma migrate [INPUT_2]",
    "db:push": "prisma db [INPUT_3]",
    "db:studio": "prisma studio",
    "db:deploy": "prisma migrate deploy"
  }
}`,
    inputs: { INPUT_1: "generate", INPUT_2: "dev", INPUT_3: "push" },
    completeCode: "generate | migrate dev | db push | migrate deploy | studio",
  },

  {
    id: 22,
    step: 22,
    title: "Seeding: datos iniciales",
    stars: 3,
    category: "MIGRATE",
    description:
      "Un seed puebla la BD con datos base (roles, admin, catálogos) de forma repetible.",
    objective: "Escribir un seed con create y $disconnect",
    tags: ["seed", "prisma db seed", "$disconnect", "create"],
    fileName: "prisma/seed.ts",
    completed: false,
    theory: `📚 TEORÍA: Database seeding

Flujo típico:
  1. Script TypeScript (prisma/seed.ts)
  2. Usa Prisma Client para insertar datos
  3. main().finally(() => prisma.$disconnect())
  4. Ejecutar: npx prisma db seed

Buenas prácticas:
  • Idempotente cuando puedas (upsert por email/slug)
  • Ordena deletes al limpiar (hijos antes que padres)
  • No pongas secretos reales de producción en el seed

En package.json (según setup):
  "prisma": { "seed": "tsx prisma/seed.ts" }`,
    explanationText:
      "Crea el usuario admin y cierra la conexión con $disconnect.",
    codeSnippet:
`import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.[INPUT_1]({
    data: {
      email: "admin@example.com",
      name: "Admin",
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$[INPUT_2]();
  });

// Ejecutar: npx prisma db [INPUT_3]`,
    inputs: { INPUT_1: "create", INPUT_2: "disconnect", INPUT_3: "seed" },
    completeCode: "create + $disconnect + prisma db seed",
  },

  {
    id: 23,
    step: 23,
    title: "Raw SQL seguro: $queryRaw",
    stars: 4,
    category: "CLIENT",
    description:
      "Cuando necesitas SQL que la API no cubre, usa tagged templates. Evita $queryRawUnsafe con concatenación.",
    objective: "Distinguir $queryRaw seguro de Unsafe vulnerable",
    tags: ["$queryRaw", "$queryRawUnsafe", "SQL injection", "seguridad"],
    fileName: "repositories/reportRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Raw queries

Seguro — tagged template (parametrizado):
  prisma.$queryRaw\`SELECT * FROM users WHERE email = \${email}\`

Peligroso — concatenar strings:
  prisma.$queryRawUnsafe(\`SELECT * FROM users WHERE email = '\${email}'\`)
  → SQL injection si email viene del usuario

$executeRaw / $executeRawUnsafe → para INSERT/UPDATE/DELETE

Regla de oro:
  Prefiere siempre la API de Prisma (findMany, etc.).
  Si usas raw, tagged templates.
  Unsafe solo con parámetros posicionales ($1, $2) y nunca concatenando input.`,
    explanationText:
      "Elige $queryRaw (seguro) y evita Unsafe con concat.",
    codeSnippet:
`// ✅ Seguro: tagged template
const rows = await prisma.$[INPUT_1]\`
  SELECT id, email FROM users WHERE email = \${email}
\`;

// ❌ Vulnerable: nunca concatenes input del usuario
const bad = await prisma.$[INPUT_2](
  \`SELECT * FROM users WHERE email = '\${email}'\`
);

// ✅ Unsafe solo con placeholders
const ok = await prisma.$queryRawUnsafe(
  "SELECT * FROM users WHERE email = $1",
  email
);`,
    inputs: { INPUT_1: "queryRaw", INPUT_2: "queryRawUnsafe" },
    completeCode:
      "$queryRaw`...${email}` seguro | $queryRawUnsafe + concat = vulnerable",
  },

  {
    id: 24,
    step: 24,
    title: "Agregaciones: count, aggregate y groupBy",
    stars: 4,
    category: "QUERIES",
    description:
      "Para dashboards y reportes usas count, aggregate (_avg, _sum) y groupBy.",
    objective: "Contar posts y agrupar usuarios por país",
    tags: ["count", "aggregate", "groupBy", "_avg", "_sum"],
    fileName: "repositories/statsRepository.ts",
    completed: false,
    theory: `📚 TEORÍA: Aggregation & grouping

count({ where })
  → número de registros

aggregate({
  _avg: { price: true },
  _sum: { price: true },
  _min / _max / _count
})

groupBy({
  by: ["country"],
  where: { email: { contains: "prisma.io" } },
  _sum: { profileViews: true },
  orderBy: { _sum: { profileViews: "desc" } },
})

El where de groupBy filtra ANTES de agrupar.
having (cuando aplica) filtra DESPUÉS del agrupado.

Úsalos en servicios de analytics, no en cada request de listado simple.`,
    explanationText:
      "Completa count, aggregate con _avg y groupBy.",
    codeSnippet:
`export const statsRepository = {
  publishedPosts: () =>
    prisma.post.[INPUT_1]({ where: { published: true } }),

  priceStats: () =>
    prisma.product.[INPUT_2]({
      _avg: { price: true },
      _sum: { price: true },
    }),

  viewsByCountry: () =>
    prisma.user.[INPUT_3]({
      by: ["country"],
      _sum: { profileViews: true },
    }),
};`,
    inputs: { INPUT_1: "count", INPUT_2: "aggregate", INPUT_3: "groupBy" },
    completeCode: "count | aggregate({ _avg, _sum }) | groupBy({ by })",
  },
];
