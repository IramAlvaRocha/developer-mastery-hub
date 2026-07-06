import type { ExerciseEnrichment, EnrichmentMap } from "./enrich";

export const TS_INTERFACES_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix: "Imagina que llenas un formulario de registro en una app y el sistema exige ciertos campos.",
    everydayInExplanation:
      "Es como la plantilla de una credencial de empleado: debe traer nombre, número y departamento. Si falta algo, no pasa la revisión.",
    theory: `### En palabras simples
Una **interface** es una lista de requisitos para un objeto. No crea el objeto; solo dice qué piezas debe tener.

### Ejemplo de la vida real
Al registrar un usuario en un banco, el sistema espera id, nombre y correo. La interface \`Usuario\` funciona igual: define la forma mínima que debe cumplir cualquier objeto de usuario.

### En código
\`\`\`typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

const iram: Usuario = { id: 1, nombre: "Iram", email: "i@test.com" };
\`\`\`

### Tip para la entrevista
Di que una interface es un **contrato de forma**: describe qué propiedades existen y de qué tipo son, sin decir cómo se construye el objeto.`,
  },
  2: {
    descriptionPrefix: "En tu perfil de red social puedes dejar la bio vacía, pero el nombre casi siempre es obligatorio.",
    everydayInExplanation:
      "Es como un formulario donde el teléfono es opcional: puedes enviarlo sin ese dato y aun así es válido.",
    theory: `### En palabras simples
El signo **?** marca una propiedad como **opcional**. El objeto puede existir sin ella.

### Ejemplo de la vida real
Un perfil puede tener solo nombre, o nombre más foto y biografía. Lo opcional no rompe nada si no está.

### En código
\`\`\`typescript
interface Perfil {
  nombre: string;
  bio?: string;
  avatar?: string;
}

const p: Perfil = { nombre: "Iram" }; // válido
\`\`\`

### Tip para la entrevista
Aclara la diferencia: **opcional (?)** significa que la propiedad puede no existir; **null** significa que existe pero está vacía.`,
  },
  3: {
    descriptionPrefix: "Tu número de INE no debería cambiar cada vez que actualizas tu dirección en un trámite.",
    everydayInExplanation:
      "Es como la fecha de nacimiento en un acta: puedes corregir tu teléfono, pero ciertos datos quedan fijos para evitar errores.",
    theory: `### En palabras simples
**readonly** bloquea cambios después de crear el objeto. Puedes leer la propiedad, pero no reasignarla.

### Ejemplo de la vida real
En un ticket de compra, el folio y la fecha de emisión no deberían modificarse después; solo otros campos pueden actualizarse.

### En código
\`\`\`typescript
interface Entidad {
  readonly id: number;
  readonly createdAt: Date;
  nombre: string;
}

e.nombre = "Nuevo"; // OK
// e.id = 2;        // Error
\`\`\`

### Tip para la entrevista
Menciona que **readonly** protege identidad e historial: ids, timestamps y claves que no deben mutar.`,
  },
  4: {
    descriptionPrefix: "Un empleado de una empresa ya es una persona, pero además tiene puesto y salario.",
    everydayInExplanation:
      "Es como decir: todo empleado trae lo de persona (nombre, edad) más datos propios del trabajo.",
    theory: `### En palabras simples
**extends** hace que una interface herede propiedades de otra. Es composición de contratos.

### Ejemplo de la vida real
Un carnet de empleado incluye datos personales y laborales. \`Empleado extends Persona\` modela eso en código.

### En código
\`\`\`typescript
interface Persona {
  nombre: string;
  edad: number;
}

interface Empleado extends Persona {
  puesto: string;
  salario: number;
}
\`\`\`

### Tip para la entrevista
Di que prefieres **extends** para reutilizar contratos estables, en lugar de repetir las mismas propiedades.`,
  },
  5: {
    descriptionPrefix: "Un producto en una tienda en línea tiene id, fechas de registro y también nombre y precio.",
    everydayInExplanation:
      "Es como juntar varias fichas técnicas en una sola: identificador, historial de fechas y datos del producto.",
    theory: `### En palabras simples
Una interface puede **extender varias** a la vez, combinando todos sus requisitos en uno solo.

### Ejemplo de la vida real
Un artículo en inventario necesita código único, fechas de creación/actualización y datos comerciales. Tres contratos, un solo objeto.

### En código
\`\`\`typescript
interface Identifiable { id: number; }
interface Timestamped { createdAt: Date; updatedAt: Date; }

interface Producto extends Identifiable, Timestamped {
  nombre: string;
  precio: number;
}
\`\`\`

### Tip para la entrevista
Compara con unir legos: cada interface aporta piezas; el resultado debe cumplir **todas** las piezas juntas.`,
  },
  6: {
    descriptionPrefix: "Un diccionario de traducciones puede tener tantas palabras como necesites, sin listarlas una por una.",
    everydayInExplanation:
      "Es como una libreta donde cualquier palabra en la columna izquierda puede tener su traducción a la derecha.",
    theory: `### En palabras simples
Un **index signature** permite claves dinámicas: \`[key: string]: tipo\` acepta nombres de propiedad variables.

### Ejemplo de la vida real
Las traducciones de una app (\`greeting\`, \`farewell\`, etc.) no se conocen todas de antemano; el diccionario crece con el tiempo.

### En código
\`\`\`typescript
interface Traducciones {
  [key: string]: string;
}

const es: Traducciones = {
  greeting: "Hola",
  farewell: "Adiós",
};
\`\`\`

### Tip para la entrevista
Para diccionarios simples menciona **Record<K, V>**; usa index signatures cuando mezclas propiedades fijas con dinámicas.`,
  },
  7: {
    descriptionPrefix: "Un servicio de mensajería promete enviar un mensaje y avisarte si algo sale mal.",
    everydayInExplanation:
      "Es como un contrato de servicio al cliente: define qué acciones ofrece (consultar, validar, reportar error), no cómo las hace por dentro.",
    theory: `### En palabras simples
Las interfaces pueden describir **funciones como propiedades**: qué parámetros reciben y qué devuelven.

### Ejemplo de la vida real
Un API de usuarios puede prometer \`getUser(id)\`, \`onError(error)\` y \`validate(data)\`. La interface documenta esas promesas.

### En código
\`\`\`typescript
interface ApiService {
  getUser: (id: number) => Promise<User>;
  onError: (error: Error) => void;
  validate: (data: unknown) => data is User;
}
\`\`\`

### Tip para la entrevista
Tipar callbacks en interfaces evita errores en handlers de eventos y servicios; es un patrón muy común en React y Vue.`,
  },
  8: {
    descriptionPrefix: "A veces amplías las funciones de una ventana de navegador con plugins que agregan herramientas nuevas.",
    everydayInExplanation:
      "Es como pegar dos listas de características del mismo aparato: al final tienes un solo manual con todo combinado.",
    theory: `### En palabras simples
Si declaras la **misma interface dos veces**, TypeScript las **fusiona** automáticamente (declaration merging).

### Ejemplo de la vida real
Librerías extienden \`Window\` para añadir \`analytics\` o \`featureFlags\` sin tocar la definición original del navegador.

### En código
\`\`\`typescript
interface Window {
  analytics: AnalyticsLib;
}

interface Window {
  featureFlags: Record<string, boolean>;
}

// window.analytics y window.featureFlags existen
\`\`\`

### Tip para la entrevista
Solo las **interfaces** se fusionan así; los **type** no. Es clave para extender tipos globales en librerías.`,
  },
  9: {
    descriptionPrefix: "A veces necesitas una ficha fija para objetos y otras veces un rótulo que admita varias formas.",
    everydayInExplanation:
      "Interface es la plantilla ampliable para objetos; type es la etiqueta flexible para uniones y combinaciones más raras.",
    theory: `### En palabras simples
**interface** y **type** describen formas, pero sirven mejor en contextos distintos.

### Ejemplo de la vida real
Un vehículo tiene marca y modelo (objeto estable). Un resultado puede ser \`'exito' | 'error'\` (una cosa u otra). Cada caso pide herramienta distinta.

### En código
\`\`\`typescript
interface Vehiculo {
  marca: string;
  modelo: string;
}

type Resultado = "exito" | "error";
type Combined = Vehiculo & { año: number };
\`\`\`

### Tip para la entrevista
Regla práctica: **interface** para objetos y APIs públicas extensibles; **type** para unions, intersections y tipos complejos.`,
  },
  10: {
    descriptionPrefix: "Un almacén puede guardar zapatos, libros o electrónicos con las mismas operaciones: listar, buscar, crear.",
    everydayInExplanation:
      "Es como un estante genérico: las reglas del estante son iguales, pero lo que guardas cambia según la sección.",
    theory: `### En palabras simples
Una **interface genérica** usa un parámetro de tipo (\`T\`) para adaptarse al dato concreto que maneja.

### Ejemplo de la vida real
Un repositorio de usuarios y uno de productos comparten métodos (\`getAll\`, \`getById\`), pero devuelven tipos distintos.

### En código
\`\`\`typescript
interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(item: Omit<T, "id">): Promise<T>;
}

const userRepo: Repository<User> = { /* ... */ };
\`\`\`

### Tip para la entrevista
El patrón **Repository<T>** es clásico en arquitecturas limpias; demuestra reutilización sin perder tipo concreto.`,
  },
  11: {
    descriptionPrefix: "Los datos de una empresa incluyen su dirección, y esa dirección tiene calle, ciudad y código postal.",
    everydayInExplanation:
      "Es como un paquete dentro de otro: la respuesta de la API trae empresas, y cada empresa trae su dirección anidada.",
    theory: `### En palabras simples
Las interfaces pueden **anidarse** para modelar estructuras con niveles: empresa → dirección → campos.

### Ejemplo de la vida real
Un listado de tiendas en un mapa trae nombre de la tienda y su ubicación completa. Separar \`Direccion\` hace el modelo más claro.

### En código
\`\`\`typescript
interface Direccion {
  calle: string;
  ciudad: string;
  cp: string;
}

interface Empresa {
  nombre: string;
  direccion: Direccion;
}

interface ApiResponse {
  data: Empresa;
  meta: { total: number; page: number };
}
\`\`\`

### Tip para la entrevista
Extrae interfaces anidadas a nombres propios (\`Direccion\`) para reutilizarlas y evitar objetos inline gigantes.`,
  },
  12: {
    descriptionPrefix: "Un técnico debe cumplir un checklist de tareas antes de poder decir que terminó el servicio.",
    everydayInExplanation:
      "Es como firmar que cumples un manual: la clase promete tener los métodos \`info\` y \`error\` que pide la interface \`Logger\`.",
    theory: `### En palabras simples
**implements** obliga a una clase a cumplir el contrato de una interface: mismas propiedades y métodos.

### Ejemplo de la vida real
Varios registradores (consola, archivo, servicio en la nube) pueden cumplir el mismo contrato \`Logger\` con implementaciones distintas.

### En código
\`\`\`typescript
interface Logger {
  info(msg: string): void;
  error(msg: string): void;
}

class ConsoleLogger implements Logger {
  info(msg: string) { console.log(\`[INFO] \${msg}\`); }
  error(msg: string) { console.error(\`[ERROR] \${msg}\`); }
}
\`\`\`

### Tip para la entrevista
**implements** es solo verificación en compilación; no genera código automático (similar a interfaces en C#).`,
  },
  13: {
    descriptionPrefix: "Al crear un usuario pides todos los datos, pero al actualizar solo cambias lo que el cliente envió.",
    everydayInExplanation:
      "Es como editar tu perfil: puedes cambiar solo el nombre sin volver a llenar correo y teléfono si no los tocas.",
    theory: `### En palabras simples
**Partial<T>** hace todas las propiedades opcionales; **Required<T>** las vuelve obligatorias.

### Ejemplo de la vida real
Registro completo vs. actualización parcial: el formulario de edición no exige reescribir campos que no cambian.

### En código
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = Partial<User>;

function updateUser(id: number, changes: UserUpdate) {}
updateUser(1, { name: "Nuevo" }); // OK
\`\`\`

### Tip para la entrevista
Patrón típico: **create** con tipo completo, **update** con \`Partial\`. Menciona \`Required\` para borradores que deben quedar completos.`,
  },
  14: {
    descriptionPrefix: "Toda respuesta de un servicio en línea suele traer éxito o error, datos y un mensaje para el usuario.",
    everydayInExplanation:
      "Es como el sobre estándar de un paquetería: siempre incluye estado del envío, contenido y fecha, sin importar qué producto vaya dentro.",
    theory: `### En palabras simples
Una **interface genérica de respuesta** envuelve cualquier dato (\`T\`) con metadata común: éxito, mensaje, timestamp.

### Ejemplo de la vida real
La API de productos y la de usuarios devuelven la misma estructura externa; solo cambia el tipo de \`data\`.

### En código
\`\`\`typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
}

async function getProducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch("/api/products");
  return res.json();
}
\`\`\`

### Tip para la entrevista
Equivale a \`ApiResponse<T>\` o \`ActionResult<T>\` en otros ecosistemas: estandariza todas las respuestas del backend.`,
  },
  15: {
    descriptionPrefix: "Armar una consulta en un buscador es encadenar pasos: filtrar, ordenar y limitar resultados.",
    everydayInExplanation:
      "Es como pedir en cadena en un café: eliges tamaño, leche y extras; cada paso devuelve el mismo pedido para seguir modificándolo.",
    theory: `### En palabras simples
Una **interface fluida (fluent)** hace que cada método devuelva \`this\` para encadenar llamadas.

### Ejemplo de la vida real
Los query builders de bases de datos permiten \`.select().where().orderBy().limit()\` en una sola línea legible.

### En código
\`\`\`typescript
interface QueryBuilder<T> {
  select(...fields: (keyof T)[]): this;
  where(condition: Partial<T>): this;
  orderBy(field: keyof T, dir: "asc" | "desc"): this;
  limit(n: number): this;
  execute(): Promise<T[]>;
}

const users = await queryBuilder
  .select("name", "email")
  .where({ active: true })
  .orderBy("name", "asc")
  .limit(10)
  .execute();
\`\`\`

### Tip para la entrevista
Patrón común en ORMs (Prisma, TypeORM). La clave es que cada método retorna **this** para encadenar sin perder el tipo.`,
  },
};
