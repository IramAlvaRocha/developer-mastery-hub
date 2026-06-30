import type { Exercise } from "@/lib/types";

// React Frontend Best Practices — orden de construccion (espejo del backend .NET)
// Basado en el Frontend real (React 19 + TanStack Query) y el AGENTS.md.
export const REACT_BEST_PRACTICES: Exercise[] = [
  {
    id: 1, step: 1, stars: 2, category: "ESTRUCTURA",
    title: "Estructura feature-based",
    description: "React se organiza por feature dentro de modules/, con una carpeta common/ para lo compartido (api, stores, interfaces).",
    objective: "Ubicar cada pieza en su carpeta",
    tags: ["feature-based", "modules", "common"],
    fileName: "src/estructura.txt",
    explanationText: "Cada feature agrupa sus components, hooks, interfaces y api. Lo transversal (instancia de Axios, stores globales, tipos compartidos) vive en common/. Organizar por feature escala mucho mejor que organizar por tipo técnico.",
    theory: "## ¿Qué es?\nUna estructura **feature-based**: el código se agrupa por funcionalidad de negocio (`productos/`, `pedidos/`), no por tipo técnico (carpetas sueltas de `components/`, `services/` en la raíz).\n\n## ¿Por qué se hace así?\nCuando organizas por tipo técnico, tocar una sola feature te obliga a saltar entre 5 carpetas distintas. Agrupando por feature, todo lo de productos vive junto, y `common/` guarda solo lo verdaderamente compartido.\n\n## Beneficios\n- **Cohesión**: lo que cambia junto, vive junto.\n- **Escalable**: agregar una feature es agregar una carpeta, no tocar cinco.\n- **Borrable**: eliminar una feature es borrar su carpeta, sin cabos sueltos.\n\n## ¿Cuándo usarlo?\nEn cualquier app que crezca más allá de unas pocas pantallas. Para un prototipo de 3 componentes da igual.\n\n## En la vida real\nEn un proyecto con 40 pantallas, un dev nuevo encuentra todo lo de facturación en una sola carpeta, en vez de rastrear componentes, hooks y tipos repartidos por todo src/. El onboarding pasa de días a horas.",
    codeSnippet: `src/
  modules/
    productos/
      [INPUT_1]/     // componentes del feature
      hooks/         // custom hooks del feature
      [INPUT_2]/     // tipos/interfaces del feature
      api/           // servicio del feature
  [INPUT_3]/
    api/             // axios.instance + ApiService base + unwrap
    interfaces/      // tipos compartidos (ApiResponse)
    [INPUT_4]/         // Zustand stores globales
    contexts/        // AuthContext`,
    inputs: { INPUT_1: "components", INPUT_2: "interfaces", INPUT_3: "common", INPUT_4: "stores" },
    completeCode: "modules/[feature]/{components,hooks,interfaces,api} + common/{api,interfaces,stores,contexts}",
  },
  {
    id: 2, step: 2, stars: 2, category: "CONFIGURACION",
    title: "Variables de entorno y alias @",
    description: "Vite expone variables con prefijo VITE_ y permite un alias @ -> src. TypeScript necesita el mismo mapeo en tsconfig.",
    objective: "Configurar env y alias de imports",
    tags: ["Vite", "import.meta.env", "alias"],
    fileName: "vite.config.ts / tsconfig.json",
    explanationText: "Solo las variables con prefijo VITE_ se exponen al cliente (es una medida de seguridad). El alias del bundler (vite.config) y el de TypeScript (tsconfig) deben coincidir; si no, el editor marca errores aunque el build funcione.",
    theory: "## ¿Qué es?\nLa configuración de **variables de entorno** (`import.meta.env.VITE_*`) y del **alias `@`** que apunta a `src/` para imports limpios.\n\n## ¿Por qué se hace así?\n- El prefijo `VITE_` es un **candado de seguridad**: evita filtrar secretos del servidor al bundle del navegador por accidente.\n- El alias `@` elimina los imports frágiles tipo `../../../common/api`.\n- TS y Vite necesitan el alias por separado: Vite lo resuelve al construir, TS al chequear tipos.\n\n## Beneficios\n- **Sin rutas relativas frágiles** que se rompen al mover archivos.\n- **Seguridad**: al cliente solo llega lo que marcas con `VITE_`.\n- Configuración por entorno (dev, prod) sin tocar código.\n\n## ¿Cuándo usarlo?\nSiempre en proyectos Vite. El alias se vuelve indispensable apenas tienes más de dos niveles de carpetas.\n\n## En la vida real\nPones una API key de un tercero sin el prefijo `VITE_` pensando que es privada; Vite no la incluye en el bundle, evitando que cualquiera la lea desde las DevTools del navegador.",
    codeSnippet: `// .env.development
VITE_API_BASE_URL=http://localhost:5000/api

// vite.config.ts
resolve: {
  alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
}

// uso en codigo
const base = [INPUT_1].env.[INPUT_2];

// tsconfig.json (para que TS entienda el alias)
"paths": { "@/*": ["[INPUT_3]/*"] }`,
    inputs: { INPUT_1: "import.meta", INPUT_2: "VITE_API_BASE_URL", INPUT_3: "src" },
    completeCode: "import.meta.env.VITE_API_BASE_URL | paths: { '@/*': ['src/*'] }",
  },
  {
    id: 3, step: 3, stars: 2, category: "CONTRATO",
    title: "Interface ApiResponse (espejo del backend)",
    description: "El frontend tipa el mismo envelope que devuelve el backend. Cambiar uno sin el otro genera bugs silenciosos.",
    objective: "Reflejar el contrato del backend",
    tags: ["ApiResponse", "envelope", "contrato"],
    fileName: "common/interfaces/api-response.interface.ts",
    explanationText: "Esta interface debe coincidir EXACTAMENTE con ApiResponse.cs del backend: es el puente tipado entre back y front. data es T | null porque cuando hay error no llegan datos.",
    theory: "## ¿Qué es?\nLa interface `ApiResponse<T>` del front que **refleja** el envelope que devuelve el backend: `{ success, data, message, errors }`.\n\n## ¿Por qué se hace así?\nSi el front y el back describen la respuesta de forma distinta, aparecen **bugs silenciosos**: compila, pero en runtime `data` no es lo que esperabas. Un contrato espejo hace que TypeScript te avise antes.\n\n## Beneficios\n- **Type-safety de punta a punta**: el compilador valida la forma de la respuesta.\n- **Autocompletado** sobre los datos del backend.\n- Un único lugar para entender el contrato.\n\n## ¿Cuándo usarlo?\nSiempre que consumas tu propia API con un envelope uniforme. Lo ideal: generarla desde el backend (OpenAPI) para que nunca se desincronicen.\n\n## En la vida real\nEl backend renombra el campo `data` a `payload`. Como el front tipa el contrato, TypeScript marca error en compilación, en vez de que la app muestre undefined en producción.",
    codeSnippet: `export interface ApiResponse<T = unknown> {
  success: [INPUT_1];
  data:    T | [INPUT_2];
  message: string | null;
  errors:  string[] | null;
}

// Helper type guard para estrechar el tipo cuando hay exito
export const isApiSuccess = <T>(res: ApiResponse<T>): res is ApiResponse<T> & { data: T } =>
  res.success && res.data !== [INPUT_3];`,
    inputs: { INPUT_1: "boolean", INPUT_2: "null", INPUT_3: "null" },
    completeCode: "success: boolean | data: T | null | res.success && res.data !== null",
  },
  {
    id: 4, step: 4, stars: 2, category: "TIPADO",
    title: "Traducir un DTO de C# a TypeScript",
    description: "En vez de pegar JSON, se toma el record de C# como contrato y se traduce a una interface. Guid y DateTime viajan como string.",
    objective: "Tipar el dato de dominio",
    tags: ["DTO", "interface", "Guid", "DateTime"],
    fileName: "modules/productos/interfaces/producto.interface.ts",
    explanationText: "El envelope lo cubre ApiResponse<T> genérico; el tipo concreto T se traduce a mano desde el record de C#. Reglas: Guid -> string, DateTime -> string ISO 8601, decimal -> number.",
    theory: "## ¿Qué es?\nTraducir un **DTO de C#** a una **interface de TypeScript**, respetando cómo viajan los tipos por JSON.\n\n## ¿Por qué se hace así?\nJSON no tiene `Guid`, `DateTime` ni `decimal`; al serializar viajan como `string` o `number`. Tipar la interface según lo que **realmente llega** evita errores como tratar una fecha como `Date` cuando en verdad es un `string`.\n\n## Tabla de conversión\n| C# | TypeScript |\n| `Guid` | `string` |\n| `DateTime` | `string` (ISO 8601) |\n| `decimal` / `int` | `number` |\n| `bool` | `boolean` |\n\n## Beneficios\n- El tipo refleja la **realidad del JSON**, no una ilusión.\n- Menos bugs de parseo (fechas, números).\n- Contrato claro de cada entidad.\n\n## ¿Cuándo usarlo?\nCada vez que consumes un endpoint que devuelve un objeto de dominio. Tip: convierte el string a `Date` solo en el borde donde lo necesites mostrar.\n\n## En la vida real\nTratas `creadoEn` como `Date` y llamas `.getFullYear()` directo; explota porque en realidad es un `string`. Tiparlo como `string` te obliga a convertirlo bien y evita el crash en producción.",
    codeSnippet: `// Backend: public record ProductoDto(Guid Id, string Nombre, decimal Precio, DateTime CreadoEn);

export interface Producto {
  id:       [INPUT_1];   // Guid se transfiere como string
  nombre:   string;
  precio:   [INPUT_2];   // decimal -> number
  creadoEn: [INPUT_3];   // DateTime -> string ISO 8601
}`,
    inputs: { INPUT_1: "string", INPUT_2: "number", INPUT_3: "string" },
    completeCode: "Guid -> string | decimal -> number | DateTime -> string (ISO 8601)",
  },
  {
    id: 5, step: 5, stars: 3, category: "HTTP",
    title: "Instancia de Axios configurada",
    description: "Nunca se usa axios directamente: se crea una instancia con baseURL, timeout y withCredentials para enviar cookies httpOnly.",
    objective: "Crear la instancia base de Axios",
    tags: ["axios", "instance", "withCredentials"],
    fileName: "common/api/axios.instance.ts",
    explanationText: "Nunca uses axios directamente: crea una instancia con baseURL, timeout y withCredentials. withCredentials: true es necesario para que el navegador envíe la cookie httpOnly del refresh token; la baseURL viene de la variable de entorno, nunca hardcodeada.",
    theory: "## ¿Qué es?\nUna **instancia configurada de Axios** (`axios.create`) que centraliza `baseURL`, `timeout`, headers y `withCredentials`.\n\n## ¿Por qué se hace así?\nUsar el `axios` global y repetir la configuración en cada llamada es frágil y repetitivo. Una instancia única es además **el punto donde enganchas los interceptores** (token, refresh, errores) para toda la app.\n\n## Beneficios\n- **DRY**: una sola configuración para todas las peticiones.\n- Punto central para interceptores y manejo de errores.\n- Cambiar la `baseURL` (dev/prod) es una variable, no un find-and-replace.\n\n## ¿Cuándo usarlo?\nSiempre que tu app haga más de un par de llamadas HTTP. Es la base sobre la que se construyen los pasos siguientes.\n\n## En la vida real\nMigras la API de /api/v1 a /api/v2: cambias una línea en la instancia y los 80 endpoints siguen funcionando, en vez de editar cada llamada del proyecto.",
    codeSnippet: `import axios, { type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.[INPUT_1]({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  [INPUT_2]: true, // envia cookies httpOnly al backend
});`,
    inputs: { INPUT_1: "create", INPUT_2: "withCredentials" },
    completeCode: "axios.create({ baseURL, timeout, withCredentials: true })",
  },
  {
    id: 6, step: 6, stars: 3, category: "HTTP",
    title: "Interceptor de request (adjuntar token)",
    description: "Un interceptor de request agrega el header Authorization con el access token en cada peticion.",
    objective: "Inyectar el JWT en cada request",
    tags: ["interceptor", "Authorization", "Bearer"],
    fileName: "common/api/axios.instance.ts",
    explanationText: "El interceptor lee el token del TokenManager (en memoria) y lo agrega como 'Bearer <token>'. Así ningún servicio tiene que acordarse de adjuntar el header manualmente en cada llamada.",
    theory: "## ¿Qué es?\nUn **interceptor de request**: una función que Axios ejecuta **antes de enviar** cada petición; aquí, para inyectar el header `Authorization: Bearer <token>`.\n\n## ¿Por qué se hace así?\nSi cada servicio adjuntara el token a mano, tarde o temprano alguien lo olvidaría y ese endpoint fallaría con 401. El interceptor lo hace **automático e imposible de olvidar**.\n\n## Beneficios\n- **Centralizado**: el token se adjunta en un solo lugar.\n- Los servicios quedan limpios, sin lógica de auth.\n- Cambiar el esquema (Bearer, API key) es un único punto.\n\n## ¿Cuándo usarlo?\nEn cualquier API autenticada por token. También sirve para añadir headers comunes (idioma, trace-id) a todas las peticiones.\n\n## En la vida real\nAgregas un header X-Trace-Id para rastrear peticiones en los logs del backend: lo pones una vez en el interceptor y aparece en las 80 llamadas sin tocar ningún servicio.",
    codeSnippet: `api.interceptors.[INPUT_1].use((config) => {
  const token = TokenManager.get();
  if (token) config.headers.Authorization = \`[INPUT_2] \${token}\`;
  return config;
});`,
    inputs: { INPUT_1: "request", INPUT_2: "Bearer" },
    completeCode: "api.interceptors.request.use((config) => { ...Authorization = `Bearer ${token}` })",
  },
  {
    id: 7, step: 7, stars: 5, category: "HTTP",
    title: "Interceptor de response (401 refresh / 429 retry)",
    description: "El interceptor de response refresca el token ante un 401 y reintenta; ante un 429 espera el Retry-After.",
    objective: "Manejar expiracion y rate limit",
    tags: ["interceptor", "401", "refresh token", "429"],
    fileName: "common/api/axios.instance.ts",
    explanationText: "El flag _retry evita bucles infinitos de refresh. El 429 corresponde al rate limiter del backend: se respeta el header Retry-After antes de reintentar, en vez de martillar el servidor.",
    theory: "## ¿Qué es?\nUn **interceptor de response** que reacciona a errores: ante un **401** (token expirado) refresca y reintenta; ante un **429** (demasiadas peticiones) espera el `Retry-After`.\n\n## ¿Por qué se hace así?\nLa expiración del token es algo normal cada pocos minutos. Sin este interceptor, el usuario vería errores constantes. El flag `_retry` evita que un refresh fallido entre en **bucle infinito**.\n\n## Beneficios\n- **Sesión fluida**: el usuario no nota cuando el token se renueva.\n- **Resiliencia**: respeta el rate limit en vez de saturar el backend.\n- Manejo de errores transversal, fuera de los componentes.\n\n## ¿Cuándo usarlo?\nEn apps con tokens de vida corta + refresh token, y APIs con rate limiting. Es de los pasos más delicados: cuida los bucles de reintento.\n\n## En la vida real\nUn usuario lleva 20 minutos llenando un formulario largo; al enviar, su token ya expiró. El interceptor lo refresca y reintenta solo: el formulario se guarda sin que pierda nada ni vea un error.",
    codeSnippet: `api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === [INPUT_1] && !original._retry) {
      original._retry = true;
      await refreshAccessToken();
      return api(original); // reintenta con el nuevo token
    }
    if (error.response?.status === [INPUT_2]) {
      const wait = Number(error.response.headers['retry-after'] ?? 1) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      return api(original);
    }
    return Promise.[INPUT_3](error);
  }
);`,
    inputs: { INPUT_1: "401", INPUT_2: "429", INPUT_3: "reject" },
    completeCode: "status === 401 -> refresh + retry | status === 429 -> wait Retry-After | Promise.reject(error)",
  },
  {
    id: 8, step: 8, stars: 3, category: "SEGURIDAD",
    title: "TokenManager en memoria",
    description: "El access token se guarda en memoria (no en localStorage) para mitigar XSS. El refresh token vive en una cookie httpOnly.",
    objective: "Almacenar el token de forma segura",
    tags: ["XSS", "in-memory", "token"],
    fileName: "common/api/token-manager.ts",
    explanationText: "Guardar el JWT en localStorage lo expone a robo por XSS (cualquier script puede leerlo). Mantenerlo en una variable de módulo (memoria) reduce el riesgo: se pierde al recargar y se recupera vía refresh token.",
    theory: "## ¿Qué es?\nUn `TokenManager` que guarda el **access token en memoria** (una variable de módulo), no en `localStorage` ni `sessionStorage`.\n\n## ¿Por qué se hace así?\n`localStorage` es accesible por **cualquier JavaScript** de la página. Si hay un XSS, el atacante roba el token. En memoria, el token no es accesible por scripts inyectados ni persiste tras cerrar la pestaña.\n\n## El esquema completo\n- **Access token** (vida corta): en memoria.\n- **Refresh token** (vida larga): en una cookie `httpOnly`, inaccesible desde JS.\n\n## Beneficios\n- **Mitiga XSS**: el token no queda expuesto al DOM ni al JS.\n- Al recargar se recupera vía refresh, sin re-login.\n- Menos superficie de robo.\n\n## ¿Cuándo usarlo?\nEn apps con requisitos de seguridad reales. Es el estándar moderno frente al viejo hábito de guardar el JWT en localStorage.\n\n## En la vida real\nUna librería de terceros comprometida inyecta un script que recorre localStorage buscando tokens. Como el tuyo vive solo en memoria, no encuentra nada que robar.",
    codeSnippet: `let accessToken: string | [INPUT_1] = null;

export const TokenManager = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = [INPUT_2]; },
};`,
    inputs: { INPUT_1: "null", INPUT_2: "null" },
    completeCode: "let accessToken: string | null = null (variable de modulo, no localStorage)",
  },
  {
    id: 9, step: 9, stars: 4, category: "HTTP",
    title: "unwrap y ApiError",
    description: "unwrap desempaqueta el ApiResponse: si success es false lanza un ApiError tipado; si es true devuelve solo data.",
    objective: "Desempaquetar la respuesta",
    tags: ["unwrap", "ApiError", "desempaquetado"],
    fileName: "common/api/unwrap.ts",
    explanationText: "unwrap centraliza el desempaquetado: los servicios y hooks trabajan directamente con T, sin ver el envelope. El ApiError lleva el message y los errors del backend para mostrarlos tal cual en la UI.",
    theory: "## ¿Qué es?\nLa función `unwrap` que abre el `ApiResponse<T>`: si `success` es `false` lanza un `ApiError` tipado; si es `true`, devuelve solo `data`.\n\n## ¿Por qué se hace así?\nSin `unwrap`, cada componente tendría que comprobar `success` y bucear en `data`. Centralizarlo deja que el resto del código trabaje con `T` limpio y que los errores se manejen con `try/catch` (o el `onError` de TanStack).\n\n## Beneficios\n- **Componentes limpios**: ven `Producto`, no `ApiResponse<Producto>`.\n- **Errores tipados**: `ApiError` lleva `message` y `errors` para la UI.\n- Un único punto de desempaquetado.\n\n## ¿Cuándo usarlo?\nSiempre que uses un envelope uniforme. Encaja perfecto con TanStack Query: un throw aquí activa el estado `error` del hook.\n\n## En la vida real\nEl backend responde 200 pero con success: false y message: 'Stock insuficiente'. unwrap lo convierte en un ApiError que tu toast muestra directamente, sin lógica extra por pantalla.",
    codeSnippet: `export class ApiError extends Error {
  constructor(message: string, public readonly errors: string[] = []) {
    super(message);
  }
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.[INPUT_1]) {
    throw new [INPUT_2](response.message ?? 'Error desconocido', response.errors ?? []);
  }
  return response.[INPUT_3] as T;
}`,
    inputs: { INPUT_1: "success", INPUT_2: "ApiError", INPUT_3: "data" },
    completeCode: "if (!response.success) throw new ApiError(...) | return response.data as T",
  },
  {
    id: 10, step: 10, stars: 4, category: "ABSTRACCIONES",
    title: "Clase base ApiService",
    description: "ApiService encapsula la instancia de Axios y aplica unwrap en cada verbo (get/post/put/delete). Los servicios concretos heredan de ella.",
    objective: "Crear la abstraccion de servicio",
    tags: ["ApiService", "clase base", "protected"],
    fileName: "common/api/api.service.ts",
    explanationText: "Los métodos son 'protected' para que solo las subclases los usen, no cualquiera desde fuera. Cada verbo llama a unwrap, así las subclases devuelven T directamente sin tocar el envelope.",
    theory: "## ¿Qué es?\nUna **clase base abstracta** `ApiService` que envuelve la instancia de Axios y aplica `unwrap` en cada verbo (`get`, `post`, `put`, `delete`).\n\n## ¿Por qué se hace así?\nPara no repetir `api.get` + `unwrap` en cada servicio. La clase base lo hace una vez; cada servicio concreto solo declara su `endpoint` y sus métodos de negocio. Los verbos son `protected` para que solo las subclases los usen.\n\n## Beneficios\n- **DRY**: el patrón get/unwrap se escribe una sola vez.\n- Servicios concretos diminutos y enfocados.\n- Comportamiento HTTP uniforme en toda la app.\n\n## ¿Cuándo usarlo?\nCuando tienes varios servicios que hablan con la misma API con el mismo patrón. Para una sola llamada aislada puede ser exagerado.\n\n## En la vida real\nDecides loguear el tiempo de cada request: lo agregas en la clase base y los 15 servicios del proyecto quedan instrumentados sin tocarlos uno por uno.",
    codeSnippet: `export abstract class ApiService {
  protected constructor(protected readonly endpoint: string) {}

  protected async get<T>(path = ''): Promise<T> {
    const { data } = await api.get<ApiResponse<T>>(\`\${this.endpoint}\${path}\`);
    return [INPUT_1]<T>(data);
  }

  protected async post<T>(body: unknown, path = ''): Promise<T> {
    const { data } = await api.[INPUT_2]<ApiResponse<T>>(\`\${this.endpoint}\${path}\`, body);
    return unwrap<T>(data);
  }
}`,
    inputs: { INPUT_1: "unwrap", INPUT_2: "post" },
    completeCode: "abstract class ApiService { protected get<T> => unwrap(data); protected post<T> => api.post }",
  },
  {
    id: 11, step: 11, stars: 3, category: "HTTP",
    title: "Servicio concreto (ProductosApi)",
    description: "El servicio del feature extiende ApiService, fija su endpoint y expone metodos de negocio tipados.",
    objective: "Implementar el servicio del feature",
    tags: ["servicio", "extends", "endpoint"],
    fileName: "modules/productos/api/productos.api.ts",
    explanationText: "Se exporta una única instancia (singleton) del servicio. Cada método retorna el tipo de dominio (Producto) gracias al unwrap aplicado en la clase base; el componente nunca ve el envelope.",
    theory: "## ¿Qué es?\nEl **servicio concreto** del feature (`ProductosApi`) que extiende `ApiService`, fija su `endpoint` y expone métodos de negocio tipados (`getAll`, `getById`, `create`).\n\n## ¿Por qué se hace así?\nCentraliza **todas las llamadas HTTP de una feature** en un solo objeto. Los componentes y hooks llaman a `productosApi.getAll()` sin saber de URLs, headers ni desempaquetado.\n\n## Beneficios\n- **Una sola fuente** de endpoints por feature.\n- Métodos con nombres de negocio, no URLs sueltas.\n- Fácil de mockear en tests.\n\n## ¿Cuándo usarlo?\nEn cada feature que consuma su propio conjunto de endpoints. Se combina con los hooks de TanStack Query del siguiente paso.\n\n## En la vida real\nLa ruta de productos cambia de /productos a /catalogo/productos. Editas el super(...) del servicio y listo: ningún componente se entera del cambio.",
    codeSnippet: `class ProductosApi extends [INPUT_1] {
  constructor() { super('/productos'); }

  getAll = () => this.get<Producto[]>();
  getById = (id: string) => this.get<Producto>(\`/\${id}\`);
  create = (dto: CrearProductoDto) => this.post<string>(dto);
}

export const productosApi = new [INPUT_2]();`,
    inputs: { INPUT_1: "ApiService", INPUT_2: "ProductosApi" },
    completeCode: "class ProductosApi extends ApiService { super('/productos') } | export const productosApi = new ProductosApi()",
  },
  {
    id: 12, step: 12, stars: 3, category: "TANSTACK QUERY",
    title: "Query keys factory",
    description: "Las query keys se centralizan en un objeto factory para evitar strings duplicados y poder invalidar de forma jerarquica.",
    objective: "Definir keys consistentes",
    tags: ["query key", "factory", "cache"],
    fileName: "modules/productos/hooks/productos.keys.ts",
    explanationText: "Una factory de keys evita errores de tipeo y permite invalidar por jerarquía: invalidar 'all' alcanza listas y detalles. 'as const' fija los tipos literales de la tupla para que TanStack las compare bien.",
    theory: "## ¿Qué es?\nUn objeto **factory de query keys**: centraliza las claves de cache de TanStack Query (`all`, `lists()`, `detail(id)`) en un solo lugar.\n\n## ¿Por qué se hace así?\nLas query keys son la **identidad** de cada entrada de cache. Si las escribes a mano como strings sueltos, un typo crea cachés fantasma y la invalidación deja de funcionar. La factory las hace consistentes y **jerárquicas**.\n\n## Beneficios\n- **Sin typos**: las keys se construyen, no se copian.\n- **Invalidación jerárquica**: invalidar `all` afecta listas y detalles.\n- `as const` da tipos literales para comparación exacta.\n\n## ¿Cuándo usarlo?\nEn cualquier proyecto con TanStack Query más allá de un par de queries. Es la base para invalidar la cache de forma fiable.\n\n## En la vida real\nTras crear un producto quieres refrescar la lista y cualquier detalle en cache. Con invalidateQueries(productoKeys.all) lo logras de un golpe, en vez de recordar cada string a mano.",
    codeSnippet: `export const productoKeys = {
  all: ['productos'] as [INPUT_1],
  lists: () => [...productoKeys.all, 'list'] as const,
  detail: (id: string) => [...productoKeys.all, 'detail', [INPUT_2]] as const,
};`,
    inputs: { INPUT_1: "const", INPUT_2: "id" },
    completeCode: "all: ['productos'] as const | detail: (id) => [...all, 'detail', id] as const",
  },
  {
    id: 13, step: 13, stars: 3, category: "TANSTACK QUERY",
    title: "useQuery: lectura con cache",
    description: "useQuery gestiona la lectura: cache, estados de carga/error y revalidacion. La queryFn llama al servicio.",
    objective: "Leer datos con cache automatico",
    tags: ["useQuery", "queryKey", "staleTime"],
    fileName: "modules/productos/hooks/use-productos.ts",
    explanationText: "queryKey identifica la entrada en cache; queryFn obtiene los datos. staleTime define cuánto tiempo se consideran frescos antes de revalidar en segundo plano (aquí 5 min), evitando peticiones innecesarias.",
    theory: "## ¿Qué es?\nEl hook `useQuery` de TanStack Query: gestiona la **lectura** de datos con cache, estados de `loading`/`error` y revalidación automática.\n\n## ¿Por qué se hace así?\nHacer fetch a mano con `useEffect` + `useState` implica manejar carga, error, cache, race conditions y refetch tú mismo. `useQuery` resuelve todo eso de forma declarativa.\n\n## ¿Qué hace staleTime?\nMarca cuánto tiempo los datos se consideran frescos. Mientras lo sean, TanStack los sirve de cache sin volver a pedirlos, ahorrando red.\n\n## Beneficios\n- **Menos código** y sin los bugs típicos del fetch manual.\n- Cache compartida entre componentes.\n- Refetch automático (al enfocar la ventana, al reconectar...).\n\n## ¿Cuándo usarlo?\nPara **estado del servidor** (datos que vienen de una API). Para estado puramente de UI (un modal abierto), usa `useState` o Zustand.\n\n## En la vida real\nDos pantallas distintas muestran el mismo listado de productos. Con useQuery y la misma key, los datos se cargan una vez y se comparten: navegar entre ellas es instantáneo.",
    codeSnippet: `export function useProductos() {
  return useQuery({
    [INPUT_1]: productoKeys.lists(),
    [INPUT_2]: () => productosApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 min frescos
  });
}`,
    inputs: { INPUT_1: "queryKey", INPUT_2: "queryFn" },
    completeCode: "useQuery({ queryKey: productoKeys.lists(), queryFn: () => productosApi.getAll() })",
  },
  {
    id: 14, step: 14, stars: 4, category: "TANSTACK QUERY",
    title: "useMutation + invalidacion de cache",
    description: "useMutation maneja la escritura. En onSuccess se invalida la query afectada para que se refresque automaticamente.",
    objective: "Mutar e invalidar la cache",
    tags: ["useMutation", "invalidateQueries", "onSuccess"],
    fileName: "modules/productos/hooks/use-crear-producto.ts",
    explanationText: "Tras una mutación exitosa, invalidateQueries marca la cache como obsoleta y TanStack la vuelve a pedir. Así la UI refleja el cambio sin refrescar a mano ni recargar la página.",
    theory: "## ¿Qué es?\nEl hook `useMutation` para **escrituras** (crear, editar, borrar), con invalidación de cache en `onSuccess` para que las lecturas se refresquen solas.\n\n## ¿Por qué se hace así?\nTras crear un producto, la lista en cache queda **desactualizada**. En vez de actualizarla a mano (frágil y propenso a errores), invalidas la query y TanStack la vuelve a pedir: la UI siempre refleja el servidor.\n\n## Beneficios\n- **UI siempre consistente** con el backend.\n- Estados de envío (`isPending`) listos para deshabilitar botones.\n- Patrón claro: mutación → invalidación → refetch.\n\n## ¿Cuándo usarlo?\nPara toda operación que cambie datos del servidor. Para una UX más avanzada existe el optimistic update (actualizar la UI antes de confirmar).\n\n## En la vida real\nUn usuario crea un producto y al instante aparece en la tabla sin recargar. Si la creación falla, isError te deja mostrar el mensaje y la tabla no cambia.",
    codeSnippet: `export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearProductoDto) => productosApi.create(dto),
    [INPUT_1]: () => {
      queryClient.[INPUT_2]({ queryKey: productoKeys.[INPUT_3] });
    },
  });
}`,
    inputs: { INPUT_1: "onSuccess", INPUT_2: "invalidateQueries", INPUT_3: "all" },
    completeCode: "onSuccess: () => queryClient.invalidateQueries({ queryKey: productoKeys.all })",
  },
  {
    id: 15, step: 15, stars: 3, category: "TANSTACK QUERY",
    title: "QueryClientProvider en la raiz",
    description: "El QueryClient se crea una vez y se provee en la raiz de la app. Define defaults globales como reintentos y refetch.",
    objective: "Proveer el cliente de queries",
    tags: ["QueryClient", "Provider", "defaultOptions"],
    fileName: "main.tsx",
    explanationText: "El QueryClient se crea FUERA del componente para que no se recree en cada render. defaultOptions centraliza el comportamiento (retry, refetchOnWindowFocus) de todas las queries de la app.",
    theory: "## ¿Qué es?\nEl `QueryClient` (el cerebro y la cache de TanStack) creado una sola vez y provisto en la **raíz** de la app con `QueryClientProvider`.\n\n## ¿Por qué se hace así?\n- **Fuera del componente**: si lo crearas dentro, cada render haría un cliente nuevo y perderías toda la cache.\n- En la **raíz**: para que cualquier componente del árbol pueda usar queries.\n- `defaultOptions`: define el comportamiento global en un solo lugar.\n\n## Beneficios\n- Una cache única y compartida por toda la app.\n- Política global (reintentos, refetch) centralizada.\n- Devtools para inspeccionar el estado del servidor.\n\n## ¿Cuándo usarlo?\nUna vez por aplicación, al inicializarla. Es el paso que enciende TanStack Query para todos los hooks.\n\n## En la vida real\nDecides que ninguna query reintente más de una vez y que no refresque al cambiar de pestaña: lo configuras en defaultOptions y aplica a las 50 queries de la app de inmediato.",
    codeSnippet: `const queryClient = new [INPUT_1]({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

root.render(
  <[INPUT_2] client={queryClient}>
    <App />
  </[INPUT_2]>
);`,
    inputs: { INPUT_1: "QueryClient", INPUT_2: "QueryClientProvider" },
    completeCode: "new QueryClient({ defaultOptions }) | <QueryClientProvider client={queryClient}>",
  },
  {
    id: 16, step: 16, stars: 3, category: "SEGURIDAD",
    title: "Permisos: constantes espejo del backend",
    description: "Los permisos del frontend se definen como const con 'as const' y deben coincidir letra por letra con los del backend.",
    objective: "Tipar permisos del cliente",
    tags: ["permisos", "as const", "union type"],
    fileName: "common/auth/permisos.ts",
    explanationText: "El valor debe ser idéntico al del backend (Permisos.Productos.Vista). 'as const' permite derivar un union type seguro con todos los permisos para tiparlos en toda la app y evitar strings inventados.",
    theory: "## ¿Qué es?\nLas constantes de **permisos** del front definidas con `as const`, espejo exacto de las del backend, de las que se deriva un **union type** `Permiso`.\n\n## ¿Por qué se hace así?\nSi usaras strings sueltos (`'Productos.Vista'`), un typo no falla en compilación pero rompe la autorización en silencio. Con `as const` + union type, solo los permisos válidos compilan.\n\n## Beneficios\n- **Autocompletado** de los permisos válidos.\n- **Sin typos**: un permiso inexistente es error de compilación.\n- Contrato único, espejo del backend.\n\n## ¿Cuándo usarlo?\nEn toda app con control de acceso por permisos. Lo ideal es generarlos desde una fuente compartida con el backend.\n\n## En la vida real\nEscribes hasPermission(perms, 'Producto.Vista') en singular, mal. TypeScript lo rechaza porque no está en el union, evitando un botón que nunca se mostraría y que nadie notaría hasta producción.",
    codeSnippet: `export const PERMISOS = {
  ProductosVista: 'Productos.Vista',
  ProductosEdicion: 'Productos.Edicion',
} as [INPUT_1];

// Union type derivado: 'Productos.Vista' | 'Productos.Edicion'
export type Permiso = [INPUT_2][keyof typeof PERMISOS];`,
    inputs: { INPUT_1: "const", INPUT_2: "typeof PERMISOS" },
    completeCode: "export const PERMISOS = {...} as const | type Permiso = (typeof PERMISOS)[keyof typeof PERMISOS]",
  },
  {
    id: 17, step: 17, stars: 3, category: "SEGURIDAD",
    title: "Helpers hasPermission / hasAnyPermission",
    description: "Funciones puras que comprueban si el usuario posee un permiso. La UI las usa para mostrar/ocultar acciones.",
    objective: "Comprobar permisos del usuario",
    tags: ["hasPermission", "claims", "guard"],
    fileName: "common/auth/permisos.ts",
    explanationText: "Estas comprobaciones del front son SOLO para UX (ocultar o mostrar botones). La autorización REAL siempre la hace el backend; nunca confíes solo en el cliente para proteger una acción.",
    theory: "## ¿Qué es?\nFunciones puras `hasPermission` / `hasAnyPermission` que comprueban si el usuario posee cierto permiso, para decidir qué muestra la UI.\n\n## ¿Por qué se hace así?\nMostrar un botón de editar a quien no puede editar es mala UX. Estas funciones permiten ocultarlo. Pero son **solo cosméticas**: la seguridad de verdad la impone el backend.\n\n## Beneficios\n- **UX clara**: cada usuario ve solo lo que puede hacer.\n- Funciones puras: fáciles de testear y reutilizar.\n- Lógica de permisos centralizada en el front.\n\n## ¿Cuándo usarlo?\nPara adaptar la interfaz a los permisos del usuario. **Nunca** como única barrera: un usuario puede llamar la API directamente.\n\n## En la vida real\nOcultas el botón Eliminar a un usuario sin permiso. Aun si él fuerza la petición por Postman, el backend la rechaza con 403: el front mejora la experiencia, el back garantiza la seguridad.",
    codeSnippet: `export const hasPermission = (userPerms: string[], required: Permiso): boolean =>
  userPerms.[INPUT_1](required);

export const hasAnyPermission = (userPerms: string[], required: Permiso[]): boolean =>
  required.[INPUT_2]((p) => userPerms.includes(p));`,
    inputs: { INPUT_1: "includes", INPUT_2: "some" },
    completeCode: "userPerms.includes(required) | required.some((p) => userPerms.includes(p))",
  },
  {
    id: 18, step: 18, stars: 4, category: "ESTADO",
    title: "AuthContext + hook useAuth",
    description: "El estado de autenticacion (usuario, permisos) se expone via Context. Un hook useAuth valida que se use dentro del Provider.",
    objective: "Compartir el estado de auth",
    tags: ["Context", "useAuth", "Provider"],
    fileName: "common/contexts/auth.context.tsx",
    explanationText: "El hook useAuth lanza un error si se usa fuera del Provider: esto detecta el bug en desarrollo, en vez de fallar silenciosamente con undefined más adelante y dejarte adivinando.",
    theory: "## ¿Qué es?\nEl **AuthContext** que expone el estado de autenticación (usuario, permisos) y un hook `useAuth` que lo consume con una validación de seguridad.\n\n## ¿Por qué se hace así?\nEl estado de auth lo necesitan muchos componentes a distintos niveles; pasarlo por props (prop drilling) es insostenible. Context lo comparte. El `throw` en `useAuth` convierte un bug sutil (`undefined`) en un error inmediato y claro.\n\n## Beneficios\n- **Sin prop drilling**: el auth está disponible donde se necesite.\n- **Fail-fast**: usar el hook fuera del Provider falla al instante.\n- Un solo lugar define la forma del estado de auth.\n\n## ¿Cuándo usarlo?\nPara estado global de baja frecuencia de cambio (auth, tema, idioma). Para estado del servidor usa TanStack Query; para UI ligera, Zustand.\n\n## En la vida real\nUn dev usa useAuth() en un componente que quedó fuera del AuthProvider. En vez de un críptico error de undefined tres pantallas después, ve al instante el mensaje: useAuth debe usarse dentro de AuthProvider.",
    codeSnippet: `const AuthContext = createContext<AuthState | [INPUT_1]>(undefined);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx === [INPUT_2]) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}`,
    inputs: { INPUT_1: "undefined", INPUT_2: "undefined" },
    completeCode: "createContext<AuthState | undefined>(undefined) | if (ctx === undefined) throw ...",
  },
  {
    id: 19, step: 19, stars: 4, category: "SEGURIDAD",
    title: "ProtectedRoute por permiso",
    description: "Un componente envoltorio que redirige si el usuario no esta autenticado o no tiene el permiso requerido.",
    objective: "Proteger rutas en el cliente",
    tags: ["ProtectedRoute", "Navigate", "guard"],
    fileName: "common/components/ProtectedRoute.tsx",
    explanationText: "Combina useAuth con hasPermission. Si falta el permiso, redirige con 'replace' para no romper el botón de atrás. Recuerda: es protección de UX; el backend valida de verdad cada petición.",
    theory: "## ¿Qué es?\nUn componente envoltorio `ProtectedRoute` que **redirige** si el usuario no está autenticado o no tiene el permiso requerido para esa ruta.\n\n## ¿Por qué se hace así?\nRepetir el chequeo de auth en cada página es propenso a olvidos. Envolver las rutas protegidas centraliza la regla. El `replace` en `Navigate` evita que el botón atrás devuelva a la página bloqueada.\n\n## Beneficios\n- **Protección declarativa**: envuelves la ruta y listo.\n- Comportamiento de redirección consistente.\n- Separa el control de acceso de la lógica de la página.\n\n## ¿Cuándo usarlo?\nPara rutas que requieren login o un permiso concreto. Igual que los helpers: es UX y navegación, no seguridad real.\n\n## En la vida real\nUn usuario pega en el navegador la URL del panel de admin sin permiso. ProtectedRoute lo manda a /403 antes de renderizar nada, y si intentara llamar la API igual, el backend lo bloquea.",
    codeSnippet: `export function ProtectedRoute({ permiso, children }: Props) {
  const { isAuthenticated, permisos } = useAuth();

  if (![INPUT_1]) return <Navigate to="/login" replace />;
  if (permiso && !hasPermission(permisos, permiso))
    return <Navigate to="/403" [INPUT_2] />;

  return <>{children}</>;
}`,
    inputs: { INPUT_1: "isAuthenticated", INPUT_2: "replace" },
    completeCode: "if (!isAuthenticated) <Navigate to='/login' replace /> | <Navigate to='/403' replace />",
  },
  {
    id: 20, step: 20, stars: 4, category: "VALIDACIONES",
    title: "React Hook Form + Zod",
    description: "El formulario valida con un schema de Zod a traves de zodResolver. El tipo del form se infiere del schema.",
    objective: "Validar formularios con Zod",
    tags: ["react-hook-form", "zod", "zodResolver"],
    fileName: "modules/productos/components/ProductoForm.tsx",
    explanationText: "z.infer evita duplicar tipos: el tipo del formulario sale del propio schema. Estas reglas deben reflejar las del backend (FluentValidation), que es la fuente de verdad final de la validación.",
    theory: "## ¿Qué es?\nValidación de formularios con **React Hook Form** + **Zod**: un schema de Zod define las reglas y `zodResolver` las conecta al formulario.\n\n## ¿Por qué se hace así?\n- **Una sola fuente**: el schema valida en runtime *y* genera el tipo con `z.infer` (no duplicas tipos).\n- React Hook Form maneja el estado del formulario de forma performante (sin re-render por cada tecla).\n\n## Beneficios\n- **Tipos y validación sincronizados** desde un solo schema.\n- Mensajes de error declarativos por campo.\n- Excelente rendimiento en formularios grandes.\n\n## ¿Cuándo usarlo?\nPara cualquier formulario con reglas. Recuerda reflejar las del backend: la validación del front es UX, el back es la fuente de verdad.\n\n## En la vida real\nAgregas la regla de que el precio debe ser positivo en el schema. El input muestra el error al instante y, además, el tipo FormData se actualiza solo: nunca quedan desincronizados.",
    codeSnippet: `const schema = z.object({
  nombre: z.string().min(1, 'Requerido').max(200),
  precio: z.number().[INPUT_1](0, 'Debe ser mayor a 0'),
});

type FormData = z.[INPUT_2]<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: [INPUT_3](schema),
});`,
    inputs: { INPUT_1: "positive", INPUT_2: "infer", INPUT_3: "zodResolver" },
    completeCode: "z.number().positive(...) | type FormData = z.infer<typeof schema> | resolver: zodResolver(schema)",
  },
  {
    id: 21, step: 21, stars: 3, category: "ESTADO",
    title: "Estado global con Zustand",
    description: "Para estado global ligero (UI, modales) se usa Zustand: un store con estado y acciones, sin boilerplate ni Provider.",
    objective: "Crear un store global simple",
    tags: ["zustand", "create", "store"],
    fileName: "common/stores/modal.store.ts",
    explanationText: "set actualiza el estado de forma inmutable. Zustand no necesita Provider: los componentes se suscriben con el hook y solo se re-renderizan si cambia el slice que realmente consumen.",
    theory: "## ¿Qué es?\n**Zustand**: una librería de estado global mínima. Un `create` define estado + acciones en un hook, sin Provider ni boilerplate.\n\n## ¿Por qué se hace así?\nRedux es potente pero verboso para estado de UI simple (modales, sidebar, tema). Zustand da estado global en **tres líneas** con suscripciones selectivas que evitan renders innecesarios.\n\n## ¿Zustand, Context o TanStack?\n| Para | Usa |\n| Estado del servidor (API) | TanStack Query |\n| Estado global de UI (modal, tema) | Zustand |\n| Auth/idioma de baja frecuencia | Context |\n\n## Beneficios\n- **Cero boilerplate** y sin Provider.\n- Renders selectivos por slice consumido.\n- API simple y testeable.\n\n## ¿Cuándo usarlo?\nPara estado **de cliente** compartido entre componentes lejanos. No lo uses para cachear datos del servidor: eso es trabajo de TanStack Query.\n\n## En la vida real\nUn botón en el header abre un modal que vive en otra parte del árbol. Con un store de Zustand ambos comparten isOpen sin pasar props por diez componentes intermedios.",
    codeSnippet: `interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useModalStore = [INPUT_1]<ModalState>((set) => ({
  isOpen: false,
  open: () => [INPUT_2]({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));`,
    inputs: { INPUT_1: "create", INPUT_2: "set" },
    completeCode: "export const useModalStore = create<ModalState>((set) => ({ ...set({ isOpen: true }) }))",
  },
  {
    id: 22, step: 22, stars: 4, category: "RENDIMIENTO",
    title: "React Compiler: reglas para que memoice",
    description: "El React Compiler memoiza automaticamente si el codigo respeta las Rules of React: componentes puros y sin mutaciones en render.",
    objective: "Escribir codigo compiler-friendly",
    tags: ["React Compiler", "puro", "rules of react"],
    fileName: "modules/productos/components/Lista.tsx",
    explanationText: "Con el compiler activo, los useMemo/useCallback manuales casi desaparecen: pero el render debe ser PURO (sin efectos secundarios ni mutar props/estado). No llamar setState durante el render evita bucles.",
    theory: "## ¿Qué es?\nEl **React Compiler**: memoiza tus componentes **automáticamente** en tiempo de compilación, siempre que respetes las Rules of React.\n\n## ¿Por qué se hace así?\nAntes optimizabas a mano con `useMemo`/`useCallback`, fácil de olvidar o de hacer mal. El compiler lo hace por ti, **pero solo si tu render es puro**: nada de mutar props/estado ni llamar `setState` durante el render.\n\n## Beneficios\n- **Menos código**: adiós a la mayoría de `useMemo`/`useCallback`.\n- Rendimiento óptimo sin esfuerzo manual.\n- Te empuja a escribir componentes puros (mejor código).\n\n## ¿Cuándo usarlo?\nEn proyectos con React 19+. La clave no es activarlo y ya, sino **escribir código puro** para que el compiler pueda optimizar.\n\n## En la vida real\nTenías decenas de useCallback regados por si acaso. Con el compiler los quitas: el código queda más limpio y, al ser puro, memoiza mejor de lo que lo hacías a mano.",
    codeSnippet: `// MAL: muta una prop y llama setState en render
function Lista({ items }: Props) {
  items.[INPUT_1](); // muta la prop -> impuro
  setOrdenados(items); // setState en render -> bucle
  return <ul>{/* ... */}</ul>;
}

// BIEN: render puro, derivacion sin mutar
function Lista({ items }: Props) {
  const ordenados = [...items].[INPUT_1]();
  return <ul>{ordenados.map((i) => <li key={i.id}>{i.nombre}</li>)}</ul>;
}`,
    inputs: { INPUT_1: "sort" },
    completeCode: "No mutar props (usar [...items].sort()) ni llamar setState durante el render",
  },
];
