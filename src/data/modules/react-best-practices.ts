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
    explanationText: "Cada feature agrupa sus components, hooks, interfaces y api. Lo transversal (instancia Axios, stores globales, tipos compartidos) vive en common/. Esto escala mejor que organizar por tipo tecnico.",
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
    explanationText: "Solo las variables con prefijo VITE_ se exponen al cliente (seguridad). El alias del bundler (vite.config) y el de TypeScript (tsconfig) deben coincidir, si no el editor marca errores aunque el build funcione.",
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
    explanationText: "Esta interface debe coincidir EXACTAMENTE con ApiResponse.cs del backend. Es el puente tipado entre back y front. data es T | null porque en error no hay datos.",
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
    explanationText: "El envelope lo cubre ApiResponse<T> generico; el tipo concreto T se traduce a mano desde el record de C#. Guid -> string, DateTime -> string ISO 8601, decimal -> number.",
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
    explanationText: "withCredentials: true es necesario para que el navegador envie la cookie httpOnly del refresh token. La baseURL viene de la variable de entorno, nunca hardcodeada.",
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
    explanationText: "El interceptor lee el token del TokenManager (en memoria) y lo agrega como 'Bearer <token>'. Asi ningun servicio tiene que recordar adjuntar el header manualmente.",
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
    explanationText: "El flag _retry evita bucles infinitos de refresh. El 429 corresponde al rate limiter del backend: se respeta el header Retry-After antes de reintentar.",
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
    explanationText: "Guardar el JWT en localStorage lo expone a robo por XSS. Mantenerlo en una variable de modulo (memoria) reduce el riesgo; se pierde al recargar y se recupera via refresh.",
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
    explanationText: "Centraliza el desempaquetado: los servicios y hooks trabajan directamente con T, sin ver el envelope. El ApiError lleva el message y los errors del backend para mostrarlos en la UI.",
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
    explanationText: "Los metodos son 'protected' para que solo las subclases los usen. Cada verbo llama a unwrap, asi las subclases devuelven T directamente sin tocar el envelope.",
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
    explanationText: "Se exporta una unica instancia (singleton) del servicio. Cada metodo retorna el tipo de dominio (Producto) gracias a unwrap aplicado en la clase base.",
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
    explanationText: "Una factory de keys evita errores de tipeo y permite invalidar por jerarquia: invalidar 'all' alcanza listas y detalles. 'as const' fija los tipos literales de la tupla.",
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
    explanationText: "queryKey identifica la entrada en cache; queryFn obtiene los datos. staleTime define cuanto tiempo se consideran frescos antes de revalidar en segundo plano.",
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
    explanationText: "Tras una mutacion exitosa, invalidateQueries marca la cache como obsoleta y TanStack la vuelve a pedir. Asi la UI refleja el cambio sin refrescar manualmente ni recargar la pagina.",
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
    explanationText: "El QueryClient se crea FUERA del componente para que no se recree en cada render. defaultOptions centraliza el comportamiento (retry, refetchOnWindowFocus) de todas las queries.",
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
    explanationText: "El valor debe ser identico al del backend (Permisos.Productos.Vista). 'as const' permite derivar un union type seguro de todos los permisos para tiparlos en toda la app.",
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
    explanationText: "Estas comprobaciones del front son solo para UX (ocultar botones). La autorizacion REAL siempre la hace el backend; nunca confiar solo en el cliente.",
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
    explanationText: "El hook useAuth lanza un error si se usa fuera del Provider: esto detecta el bug en desarrollo en lugar de fallar silenciosamente con undefined.",
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
    explanationText: "Combina useAuth con hasPermission. Si falta el permiso, redirige (replace para no romper el boton atras). Recuerda: es proteccion de UX, el backend valida de verdad.",
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
    explanationText: "z.infer evita duplicar tipos: el tipo del formulario sale del schema. Estas reglas deben reflejar las del backend (FluentValidation), que es la fuente de verdad final.",
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
    explanationText: "set actualiza el estado de forma inmutable. Zustand no necesita Provider: los componentes se suscriben con el hook y solo re-renderizan si cambia el slice que consumen.",
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
    explanationText: "Con el compiler activo, useMemo/useCallback manuales casi desaparecen: el render debe ser PURO (sin efectos secundarios ni mutar props/estado). No llamar setState durante el render evita bucles.",
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
