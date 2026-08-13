import type { Exercise } from "@/lib/types";

export const NUXT_EXERCISES: Exercise[] = [
  {
    id: 1, title: "Estructura de Proyecto Nuxt 3", stars: 1, category: "SETUP",
    description: "Nuxt 3 tiene convenciones de carpetas que definen su comportamiento. Entender la estructura es el primer paso.",
    objective: "Directorios clave de Nuxt 3",
    tags: ["pages", "composables", "server", "auto-import"],
    fileName: "structure.md",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: Nuxt es un taller donde las herramientas ya están a mano: no importas nada, todo lo de /composables y /components está disponible.\n\nLas carpetas definen el comportamiento: pages/ genera rutas, server/api/ crea endpoints y middleware/ protege la navegación. Conocer la convención es leer el proyecto sin documentación.",
    codeSnippet:
`// Directorios principales de Nuxt 3:
// [INPUT_1]/       → genera rutas automáticamente (file-based routing)
// components/     → auto-importados, sin import manual
// [INPUT_2]/      → auto-importados (useMyComposable, useState, etc.)
// server/[INPUT_3]/ → endpoints de API del servidor
// [INPUT_4]/      → middleware de ruta (auth guards, etc.)
// layouts/        → plantillas reutilizables para páginas`,
    inputs: { INPUT_1: "pages", INPUT_2: "composables", INPUT_3: "api", INPUT_4: "middleware" },
    completeCode: "pages/ | composables/ | server/api/ | middleware/ | layouts/"
  },
  {
    id: 2, title: "File-Based Routing: Rutas Dinámicas", stars: 2, category: "ROUTING",
    description: "Nuxt genera rutas a partir del nombre de los archivos en /pages. Los corchetes [] crean segmentos dinámicos.",
    objective: "Rutas dinámicas con [param]",
    tags: ["useRoute", "[id]", "dynamic"],
    fileName: "pages/users/[id].vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el nombre del archivo ES la URL, y [id] es el comodín que captura cualquier valor.\n\npages/users/[id].vue responde en /users/123, y useRoute().params.id te da '123'. Con file-based routing no mantienes una tabla de rutas: la estructura de carpetas es la tabla.",
    codeSnippet:
`<!-- pages/users/[INPUT_1].vue → /users/123 -->
<script setup lang="ts">
const route = [INPUT_2]();
const userId = route.params.[INPUT_3]; // '123'

const { data: user } = await [INPUT_4](\`/api/users/\${userId}\`);
</script>

<template>
  <div>{{ user?.name }}</div>
</template>`,
    inputs: { INPUT_1: "id", INPUT_2: "useRoute", INPUT_3: "id", INPUT_4: "useFetch" },
    completeCode: "pages/[id].vue → useRoute().params.id | useFetch(`/api/...`)"
  },
  {
    id: 3, title: "useFetch vs useAsyncData", stars: 3, category: "DATA FETCHING",
    description: "Nuxt 3 provee composables para fetch isomórfico (funciona en SSR y cliente). useFetch es el wrapper de conveniencia.",
    objective: "Fetch de datos SSR-safe",
    tags: ["useFetch", "useAsyncData", "SSR"],
    fileName: "pages/products.vue",
    completed: false,
    theory: `## Fetch isomórfico en Nuxt
El mismo código corre en SSR (servidor) y en el cliente, y el resultado se transfiere hidratado.

### useFetch
- Atajo: la URL es la clave de caché.
- Devuelve data, pending, error y refresh.

### useAsyncData
- Control manual: clave propia + callback con $fetch.
- Útil cuando necesitas lógica previa al fetch o datos no triviales.

### Por qué importa
Sin hidratación correcta harías el fetch dos veces (servidor y cliente) y el cliente podría renderizar distinto al servidor.`,
    explanationText: "🌍 Ejemplo cotidiano: useFetch pide pizza por app: funciona igual desde casa (cliente) o la oficina (servidor).\n\nuseFetch es el atajo sobre useAsyncData: la URL es la clave de caché y el resultado se hidrata al cliente sin doble fetch. useAsyncData te da control manual (clave propia, $fetch dentro) cuando necesitas lógica previa.",
    codeSnippet:
`<script setup lang="ts">
// useFetch: shorthand, la URL es la clave de caché
const { data: products, [INPUT_1], refresh } = await useFetch('/api/products');

// useAsyncData: más control, clave manual
const { data: user } = await [INPUT_2]('current-user', () =>
  $[INPUT_3]('/api/me')
);

// Con opciones
const { data } = await useFetch('/api/items', {
  [INPUT_4]: 'GET',
  pick: ['id', 'name'] // solo estos campos
});
</script>`,
    inputs: { INPUT_1: "pending", INPUT_2: "useAsyncData", INPUT_3: "fetch", INPUT_4: "method" },
    completeCode: "useFetch('/api/...') | useAsyncData('key', () => $fetch('/api/...'))"
  },
  {
    id: 4, title: "Middleware de Ruta: Auth Guard", stars: 3, category: "MIDDLEWARE",
    description: "El middleware de Nuxt intercepta la navegación antes de cargar la página. Ideal para proteger rutas autenticadas.",
    objective: "Proteger rutas con middleware",
    tags: ["defineNuxtRouteMiddleware", "navigateTo", "auth"],
    fileName: "middleware/auth.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el middleware es el guardia del club: verifica tu acceso antes de dejarte pasar, y si no, te redirige.\n\ndefineNuxtRouteMiddleware corre antes de cargar la página; si devuelve navigateTo('/login'), corta la navegación. Se activa por página con definePageMeta({ middleware: 'auth' }).",
    codeSnippet:
`// middleware/auth.ts — se aplica con definePageMeta
export default [INPUT_1](async (to, from) => {
  const { user } = [INPUT_2]();

  if (!user.value) {
    return [INPUT_3]('/login');
  }
});

// pages/dashboard.vue
definePageMeta({
  [INPUT_4]: 'auth' // activa el middleware
});`,
    inputs: { INPUT_1: "defineNuxtRouteMiddleware", INPUT_2: "useAuthStore", INPUT_3: "navigateTo", INPUT_4: "middleware" },
    completeCode: "defineNuxtRouteMiddleware | navigateTo('/login') | definePageMeta({ middleware: 'auth' })"
  },
  {
    id: 5, title: "Server API Routes: /server/api", stars: 3, category: "SERVER",
    description: "Nuxt 3 incluye un servidor Nitro. Los archivos en /server/api/ crean endpoints REST automáticamente.",
    objective: "Crear endpoints fullstack en Nuxt",
    tags: ["defineEventHandler", "getQuery", "readBody"],
    fileName: "server/api/users/[id].get.ts",
    completed: false,
    theory: `## API fullstack con Nitro
Nuxt incluye un servidor (Nitro) que convierte los archivos de server/api/ en endpoints REST.

### Cómo funciona
- El nombre del archivo define método y ruta: users/[id].get.ts → GET /api/users/:id.
- defineEventHandler recibe el event; getRouterParam y readBody leen los datos.
- createError(status, msg) lanza errores HTTP limpios.

### Por qué importa
Front y back comparten proyecto, tipos y deploy: sin CORS ni servidor aparte. Ideal para MVPs y apps fullstack.`,
    explanationText: "🌍 Ejemplo cotidiano: un Express dentro de tu proyecto: sin servidor separado ni CORS, porque front y back viven juntos.\n\nserver/api/users/[id].get.ts crea GET /api/users/:id con defineEventHandler; createError(404) devuelve el error y el return se serializa a JSON. Nitro monta estos endpoints automáticamente.",
    codeSnippet:
`// server/api/users/[id].get.ts → GET /api/users/123
export default [INPUT_1](async (event) => {
  const id = getRouterParam(event, '[INPUT_2]');

  // Simula BD
  const user = await db.findUser(Number(id));

  if (!user) {
    throw [INPUT_3](404, 'User not found');
  }

  return [INPUT_4]; // auto-serializa a JSON
});`,
    inputs: { INPUT_1: "defineEventHandler", INPUT_2: "id", INPUT_3: "createError", INPUT_4: "user" },
    completeCode: "defineEventHandler | getRouterParam | createError(404, ...) | return data"
  },
  {
    id: 6, title: "useState: Estado Compartido SSR-Safe", stars: 3, category: "STATE",
    description: "useState de Nuxt es el estado global SSR-safe. Se hidrata automáticamente del servidor al cliente.",
    objective: "Estado global sin Pinia para valores simples",
    tags: ["useState", "hydration", "SSR"],
    fileName: "composables/useCounter.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: useState es el tablón de anuncios SSR-safe: se escribe en el servidor y se hidrata al cliente.\n\nuseState('counter', () => 0) comparte el valor entre server y cliente bajo una clave. Para lógica compleja (acciones async, varios slices), Pinia escala mejor; useState es para valores simples.",
    codeSnippet:
`// composables/useCounter.ts
export const useCounter = () => {
  // La clave 'counter' sincroniza entre server y cliente
  const count = [INPUT_1]<number>('[INPUT_2]', () => 0);

  const increment = () => count.[INPUT_3]++;
  const decrement = () => count.value--;

  return { count, increment, [INPUT_4] };
};`,
    inputs: { INPUT_1: "useState", INPUT_2: "counter", INPUT_3: "value", INPUT_4: "decrement" },
    completeCode: "useState<T>('key', () => initialValue) — SSR-safe, auto-hidratado"
  },
  {
    id: 7, title: "Layouts: Plantillas Reutilizables", stars: 2, category: "LAYOUTS",
    description: "Los layouts envuelven páginas con estructura común (navbar, sidebar, footer) sin repetir código.",
    objective: "Layouts con <slot> y definePageMeta",
    tags: ["layouts", "NuxtLayout", "slot"],
    fileName: "layouts/dashboard.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el layout es la plantilla de Word: defines el marco una vez y cada página solo pone el contenido.\n\nEl slot del layout envuelve la página, definePageMeta({ layout: 'dashboard' }) lo elige y NuxtLayout lo monta. Así navbar y sidebar no se repiten en cada página.",
    codeSnippet:
`<!-- layouts/dashboard.vue -->
<template>
  <div class="dashboard-shell">
    <AppSidebar />
    <main>
      <[INPUT_1] /> <!-- el contenido de la página va aquí -->
    </main>
  </div>
</template>

<!-- pages/reports.vue -->
<script setup>
[INPUT_2]({
  layout: '[INPUT_3]' // usa layouts/dashboard.vue
});
</script>

<!-- app.vue -->
<template>
  <[INPUT_4] />
</template>`,
    inputs: { INPUT_1: "slot", INPUT_2: "definePageMeta", INPUT_3: "dashboard", INPUT_4: "NuxtLayout" },
    completeCode: "<slot /> en layout | definePageMeta({ layout: 'dashboard' }) | <NuxtLayout>"
  },
  {
    id: 8, title: "useRuntimeConfig: Variables de Entorno", stars: 3, category: "CONFIG",
    description: "useRuntimeConfig expone variables de entorno seguras al servidor o al cliente, según donde las declares.",
    objective: "Gestión segura de secretos en Nuxt",
    tags: ["useRuntimeConfig", "public", ".env"],
    fileName: "nuxt.config.ts",
    completed: false,
    theory: `## Secretos con useRuntimeConfig
La frontera entre lo que ve el servidor y lo que llega al navegador es una línea de seguridad.

### Las dos zonas
- runtimeConfig (raíz): solo servidor. Aquí van API_SECRET, DB_PASSWORD.
- runtimeConfig.public: servidor + cliente. Aquí va lo no sensible (apiBase).

### Por qué importa
Todo lo que va en public se expone en el bundle del navegador. Un secreto en public es un secreto filtrado, sin excepción.`,
    explanationText: "🌍 Ejemplo cotidiano: los secretos se quedan en la caja fuerte del servidor; al cliente solo le llega lo marcado como público.\n\nruntimeConfig (raíz) vive solo en el servidor; runtimeConfig.public llega a ambos. Meter una API key en public es filtrarla al navegador: por eso la frontera es explícita.",
    codeSnippet:
`// nuxt.config.ts
export default defineNuxtConfig({
  [INPUT_1]: {
    apiSecret: process.env.API_SECRET, // solo servidor
    [INPUT_2]: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE // cliente + servidor
    }
  }
});

// En un composable/componente (cliente):
const config = [INPUT_3]();
const apiBase = config.[INPUT_4].apiBase; // OK en cliente

// En server/api/ (solo servidor):
// config.apiSecret → accesible`,
    inputs: { INPUT_1: "runtimeConfig", INPUT_2: "public", INPUT_3: "useRuntimeConfig", INPUT_4: "public" },
    completeCode: "runtimeConfig.public → cliente+servidor | runtimeConfig (raíz) → solo servidor"
  },
  {
    id: 9, title: "Plugins: Extender la App de Nuxt", stars: 3, category: "PLUGINS",
    description: "Los plugins en /plugins/ se ejecutan al iniciar la app. Úsalos para registrar librerías globales o inicializar servicios.",
    objective: "Registrar servicios globales en Nuxt",
    tags: ["defineNuxtPlugin", "provide", "useNuxtApp"],
    fileName: "plugins/analytics.client.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el sufijo del plugin decide en qué planta corre: .client.ts solo navegador, .server.ts solo servidor, sin sufijo ambos.\n\ndefineNuxtPlugin registra un servicio global y provide lo expone como useNuxtApp().$analytics. Si un plugin solo usa window, márcalo .client.ts para no romper el SSR.",
    codeSnippet:
`// plugins/analytics.client.ts — solo en navegador
export default [INPUT_1](() => {
  const analytics = {
    track: (event: string, data?: object) => {
      console.log('Track:', event, data);
      // gtag, Mixpanel, etc.
    }
  };

  return {
    [INPUT_2]: {
      $analytics: [INPUT_3] // disponible como useNuxtApp().$analytics
    }
  };
});

// Uso en componente:
const { $[INPUT_4] } = useNuxtApp();`,
    inputs: { INPUT_1: "defineNuxtPlugin", INPUT_2: "provide", INPUT_3: "analytics", INPUT_4: "analytics" },
    completeCode: "defineNuxtPlugin(() => ({ provide: { $service: ... } })) | useNuxtApp().$service"
  },
  {
    id: 10, title: "SEO con useSeoMeta", stars: 2, category: "SEO",
    description: "Nuxt 3 incluye useSeoMeta para gestionar meta tags de forma reactiva y type-safe.",
    objective: "SSR SEO con useSeoMeta",
    tags: ["useSeoMeta", "useHead", "OG"],
    fileName: "pages/blog/[slug].vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: en una SPA los bots no ven el contenido; con SSR el HTML llega completo con los meta tags ya puestos.\n\nuseSeoMeta rellena title, description y og: de forma reactiva en el servidor. El SEO deja de depender de JavaScript del cliente: el rastreador lee la página renderizada.",
    codeSnippet:
`<script setup lang="ts">
const { data: post } = await useFetch(\`/api/blog/\${route.params.slug}\`);

[INPUT_1]({
  title: post.value?.[INPUT_2],
  description: post.value?.excerpt,
  ogTitle: post.value?.title,
  ogImage: post.value?.[INPUT_3],
  twitterCard: '[INPUT_4]'
});
</script>`,
    inputs: { INPUT_1: "useSeoMeta", INPUT_2: "title", INPUT_3: "coverImage", INPUT_4: "summary_large_image" },
    completeCode: "useSeoMeta({ title, description, ogTitle, ogImage, twitterCard })"
  },
  {
    id: 11, title: "Nitro Server: Middleware Global", stars: 4, category: "SERVER",
    description: "El middleware de servidor en Nuxt/Nitro intercepta TODAS las requests antes de los handlers. Ideal para logging y auth a nivel servidor.",
    objective: "Interceptar requests en el servidor",
    tags: ["server/middleware", "defineEventHandler", "setHeader"],
    fileName: "server/middleware/logger.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el middleware de servidor es el control de seguridad del edificio: revisa a todos antes de que lleguen a tu piso.\n\nserver/middleware intercepta TODAS las requests en Node antes de los handlers: ideal para logging y headers de seguridad (setHeader). El middleware de ruta (pages) corre en el cliente; este, en el servidor.",
    codeSnippet:
`// server/middleware/logger.ts — intercepta TODAS las requests
export default [INPUT_1](async (event) => {
  const start = Date.now();
  const url = getRequestURL(event);

  // Agregar headers de seguridad
  [INPUT_2](event, 'X-Content-Type-Options', 'nosniff');
  setHeader(event, '[INPUT_3]', 'DENY');

  // Log al terminar
  event.node.res.on('finish', () => {
    console.log(\`\${event.method} \${url} — \${Date.now() - start}ms\`);
  });

  // NO llamar sendRedirect aquí = continuar
  // Llamar sendRedirect = cortocircuitar
  [INPUT_4]; // no retornar nada = continuar al siguiente handler
});`,
    inputs: { INPUT_1: "defineEventHandler", INPUT_2: "setHeader", INPUT_3: "X-Frame-Options", INPUT_4: "// continue" },
    completeCode: "defineEventHandler en server/middleware/ intercepta todo | setHeader para seguridad"
  },
  {
    id: 12, title: "Nuxt + Pinia: Hidratación SSR", stars: 4, category: "STATE",
    description: "Usar Pinia con Nuxt requiere configuración para que el estado del servidor se hidrate correctamente al cliente.",
    objective: "Pinia SSR-safe con Nuxt",
    tags: ["@pinia/nuxt", "storeToRefs", "SSR hydration"],
    fileName: "stores/useProductStore.ts",
    completed: false,
    theory: `## Pinia SSR-safe en Nuxt
El estado creado en el servidor debe transferirse al cliente para que ambos rendericen lo mismo.

### El patrón
1. Registra @pinia/nuxt en modules.
2. En la página, await de la acción del store dentro de setup().
3. Nuxt serializa el estado y lo hidrata en el cliente.

### Por qué importa
Si el cliente refetcha o parte de estado vacío, verás hydration mismatch (parpadeo o warning). El await en setup es lo que garantiza que el servidor llene el store antes de render.`,
    explanationText: "🌍 Ejemplo cotidiano: sin hidratación, el cocinero prepara un plato y al cliente le llega otro: hydration mismatch.\n\nRegistrar @pinia/nuxt y hacer await store.fetchItems() en el setup() de la página hace que SSR llene el store antes de renderizar. Así el estado del servidor se transfiere y el cliente no repinta distinto.",
    codeSnippet:
`// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['[INPUT_1]']
});

// stores/useProductStore.ts
export const useProductStore = defineStore('products', () => {
  const items = ref<Product[]>([]);

  const fetchItems = async () => {
    // useFetch en Pinia funciona en SSR si se llama desde un setup()
    items.value = await $[INPUT_2]('/api/products');
  };

  return { items, fetchItems };
});

// pages/catalog.vue — correcto para SSR
const store = [INPUT_3]();
await store.[INPUT_4](); // await en setup() → SSR ejecuta antes de render`,
    inputs: { INPUT_1: "@pinia/nuxt", INPUT_2: "fetch", INPUT_3: "useProductStore", INPUT_4: "fetchItems" },
    completeCode: "@pinia/nuxt | $fetch en store | await store.action() en setup para SSR"
  }
];
