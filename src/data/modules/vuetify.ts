import type { Exercise } from "@/lib/types";

export const VUETIFY_EXERCISES: Exercise[] = [
  {
    id: 1, title: "Setup: Instalar Vuetify 3 en Vue/Nuxt", stars: 1, category: "SETUP",
    description: "Vuetify es el framework de Material Design para Vue. Entender su configuración es el punto de partida.",
    objective: "Registrar Vuetify como plugin",
    tags: ["createVuetify", "plugin", "Material Design"],
    fileName: "plugins/vuetify.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: Vuetify es una caja de LEGO premium: piezas (componentes) ya diseñadas, solo las ensamblas.\n\ncreateVuetify({ blueprint: md3, theme }) registra Material Design 3 con un tema por defecto. Configurar el blueprint y los colores del tema desde el inicio evita pelear con estilos después.",
    codeSnippet:
`// plugins/vuetify.ts
import { createVuetify } from '[INPUT_1]';
import { md3 } from 'vuetify/blueprints'; // Material Design 3

export default createVuetify({
  blueprint: [INPUT_2],
  theme: {
    defaultTheme: '[INPUT_3]',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          [INPUT_4]: '#424242'
        }
      }
    }
  }
});`,
    inputs: { INPUT_1: "vuetify", INPUT_2: "md3", INPUT_3: "light", INPUT_4: "secondary" },
    completeCode: "import { createVuetify } from 'vuetify'; createVuetify({ blueprint: md3, theme: {...} })"
  },
  {
    id: 2, title: "Grid System: v-row y v-col", stars: 2, category: "LAYOUT",
    description: "Vuetify usa un sistema de 12 columnas basado en CSS Grid. v-row es el contenedor, v-col define las columnas.",
    objective: "Layout responsivo con v-row/v-col",
    tags: ["v-row", "v-col", "cols", "responsive"],
    fileName: "Dashboard.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el grid de 12 columnas es dividir una pizza en 12 rebanadas: 6+6 o 4+4+4.\n\nv-row es el contenedor y v-col con cols/md/lg define cuántas columnas ocupa por breakpoint. La responsividad (móvil 12, tablet 6, desktop 4) se declara con atributos, sin media queries manuales.",
    codeSnippet:
`<template>
  <v-[INPUT_1]>
    <!-- Ocupa 12 cols en móvil, 6 en tablet, 4 en desktop -->
    <v-[INPUT_2]
      v-for="card in cards"
      :key="card.id"
      cols="12"
      [INPUT_3]="6"
      lg="[INPUT_4]"
    >
      <v-card>{{ card.title }}</v-card>
    </v-col>
  </v-row>
</template>`,
    inputs: { INPUT_1: "row", INPUT_2: "col", INPUT_3: "md", INPUT_4: "4" },
    completeCode: "<v-row><v-col cols='12' md='6' lg='4'> — 12 columnas responsivas"
  },
  {
    id: 3, title: "v-btn: Botones y Variantes", stars: 1, category: "COMPONENTS",
    description: "v-btn de Vuetify tiene múltiples variantes y puede mostrar íconos, estados de carga y colores del tema.",
    objective: "Botones con variantes Material Design",
    tags: ["v-btn", "variant", "loading", "color"],
    fileName: "ActionButtons.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: usar el color del tema ('primary') en vez de hardcodear: así el botón sigue al tema oscuro/claro.\n\nv-btn tiene variantes (filled, outlined), estado loading y colores del tema. El loading con prepend-icon es lo que evita dobles clics en formularios reales.",
    codeSnippet:
`<template>
  <!-- Filled (default) -->
  <v-btn color="[INPUT_1]" @click="save">Guardar</v-btn>

  <!-- Outlined -->
  <v-btn [INPUT_2]="'outlined'" color="secondary">Cancelar</v-btn>

  <!-- Con ícono y loading state -->
  <v-btn
    color="success"
    :[INPUT_3]="isSaving"
    prepend-icon="mdi-content-save"
  >
    {{ [INPUT_4] ? 'Guardando...' : 'Guardar' }}
  </v-btn>
</template>`,
    inputs: { INPUT_1: "primary", INPUT_2: "variant", INPUT_3: "loading", INPUT_4: "isSaving" },
    completeCode: "<v-btn color='primary' :loading='bool' variant='outlined'>"
  },
  {
    id: 4, title: "v-text-field: Inputs con Validación", stars: 3, category: "FORMS",
    description: "v-text-field es el componente de input de Vuetify. Tiene validación integrada via :rules.",
    objective: "Formularios validados con Vuetify",
    tags: ["v-text-field", "rules", "v-form"],
    fileName: "LoginForm.vue",
    completed: false,
    theory: `## Validación con rules en Vuetify
Una rule es una función (v) => boolean | string: true si pasa, o el mensaje de error si no.

### El patrón
- Define rules como array de funciones.
- Pásalas al campo con :rules.
- En el submit, form.value.validate() las ejecuta todas y devuelve valid.

### Por qué importa
Centraliza la validación en el formulario y evita el envío de datos inválidos. Recuerda: la validación del front es UX; la del back es la que de verdad protege.`,
    explanationText: "🌍 Ejemplo cotidiano: las rules son el inspector del formulario: cada una dice 'ok' o el mensaje de error.\n\nUna rule es una función que devuelve true o el string de error; v-form.validate() las ejecuta todas. Validar en el submit (y no en cada tecla) es la UX correcta.",
    codeSnippet:
`<script setup lang="ts">
const email = ref('');
const form = ref();

const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (v: string) => /.+@.+/.test(v) || 'Email inválido'
];

const submit = async () => {
  const { valid } = await form.value?.[INPUT_1]();
  if (!valid) return;
};
</script>

<template>
  <v-[INPUT_2] ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="email"
      label="Email"
      :[INPUT_3]="emailRules"
      type="[INPUT_4]"
    />
    <v-btn type="submit" color="primary">Ingresar</v-btn>
  </v-form>
</template>`,
    inputs: { INPUT_1: "validate", INPUT_2: "form", INPUT_3: "rules", INPUT_4: "email" },
    completeCode: "form.validate() | :rules='[fn1, fn2]' | v-form ref para submit"
  },
  {
    id: 5, title: "v-data-table: Tablas con Datos", stars: 3, category: "COMPONENTS",
    description: "v-data-table renderiza datos tabulares con ordenamiento, paginación y búsqueda incorporada.",
    objective: "Tablas avanzadas con v-data-table",
    tags: ["v-data-table", "headers", "items", "pagination"],
    fileName: "UsersTable.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: la tabla de datos es la reina de los dashboards; Vuetify la da hecha con poco código.\n\nheaders define columnas (title, key, sortable) e items los datos; v-data-table ya trae orden, paginación y slots por celda (#item.actions). Implementar eso a mano son cientos de líneas.",
    codeSnippet:
`<script setup lang="ts">
const headers = [
  { title: 'Nombre', [INPUT_1]: 'name', sortable: true },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Acciones', key: 'actions', [INPUT_2]: false }
];
</script>

<template>
  <v-[INPUT_3]
    :[INPUT_4]="headers"
    :items="users"
    :loading="isLoading"
    items-per-page="10"
  >
    <template #item.actions="{ item }">
      <v-btn icon="mdi-pencil" @click="edit(item)" />
    </template>
  </v-data-table>
</template>`,
    inputs: { INPUT_1: "key", INPUT_2: "sortable", INPUT_3: "data-table", INPUT_4: "headers" },
    completeCode: "v-data-table :headers='[{title, key}]' :items='arr' — tabla con paginación y sort"
  },
  {
    id: 6, title: "v-navigation-drawer: Sidebar", stars: 2, category: "LAYOUT",
    description: "v-navigation-drawer crea sidebars responsivos que colapsan en móvil automáticamente.",
    objective: "Sidebar responsivo con drawer",
    tags: ["v-navigation-drawer", "v-app-bar", "drawer"],
    fileName: "AppLayout.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: el patrón Drawer+AppBar es el layout estándar que ves en Gmail y Drive.\n\nv-navigation-drawer es el sidebar (con v-model para abrir/colapsar) y v-app-bar la barra superior con el botón hamburguesa. v-main envuelve el contenido; el patrón se repite en casi todo dashboard.",
    codeSnippet:
`<script setup lang="ts">
const drawer = ref(true);
</script>

<template>
  <v-app>
    <v-[INPUT_1] v-model="drawer" :rail="isMini">
      <v-list nav>
        <v-list-item
          v-for="item in navItems"
          :prepend-icon="item.icon"
          :[INPUT_2]="item.title"
          :[INPUT_3]="item.path"
        />
      </v-list>
    </v-navigation-drawer>

    <v-[INPUT_4] @click:prepend="drawer = !drawer">
      <template #prepend>
        <v-app-bar-nav-icon />
      </template>
    </v-app-bar>

    <v-main><slot /></v-main>
  </v-app>
</template>`,
    inputs: { INPUT_1: "navigation-drawer", INPUT_2: "title", INPUT_3: "to", INPUT_4: "app-bar" },
    completeCode: "v-navigation-drawer v-model | v-app-bar con nav-icon | v-main para contenido"
  },
  {
    id: 7, title: "v-dialog: Modales", stars: 2, category: "COMPONENTS",
    description: "v-dialog crea diálogos modales que bloquean la interacción con el fondo hasta cerrarse.",
    objective: "Diálogos de confirmación reutilizables",
    tags: ["v-dialog", "v-model", "persistent"],
    fileName: "ConfirmDialog.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: un solo useConfirmDialog() reutilizable en vez de duplicar el modal en cada pantalla.\n\nv-dialog se controla con :model-value + @update:modelValue; persistent impide cerrarlo con clic fuera. La lógica de confirmación centralizada evita diez modales ligeramente distintos.",
    codeSnippet:
`<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title: string }>();
const emit = defineEmits<{
  (e: '[INPUT_1]', val: boolean): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <v-[INPUT_2]
    :[INPUT_3]="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    max-width="400"
    [INPUT_4]
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-actions>
        <v-btn @click="emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="error" @click="emit('confirm')">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>`,
    inputs: { INPUT_1: "update:modelValue", INPUT_2: "dialog", INPUT_3: "model-value", INPUT_4: "persistent" },
    completeCode: "v-dialog :model-value | persistent evita cerrar con click fuera"
  },
  {
    id: 8, title: "v-snackbar: Notificaciones Toast", stars: 2, category: "COMPONENTS",
    description: "v-snackbar muestra notificaciones temporales (toasts). Combínalo con un composable para uso global.",
    objective: "Sistema de notificaciones con Vuetify",
    tags: ["v-snackbar", "timeout", "composable"],
    fileName: "composables/useSnackbar.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: un useSnackbar() global en vez de repetir la lógica de toast en cada componente.\n\nv-snackbar muestra el mensaje temporal; registrarlo una vez en el layout y exponer notify() hace que cualquier componente avise al usuario sin duplicar código.",
    codeSnippet:
`// composables/useSnackbar.ts
const snackbar = [INPUT_1]({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
});

export function useSnackbar() {
  const notify = (message: string, color = 'success') => {
    snackbar.[INPUT_2] = { show: true, message, color, timeout: 3000 };
  };
  return { snackbar, [INPUT_3] };
}

<!-- AppSnackbar.vue — registrar una vez en layouts/default.vue -->
<v-[INPUT_4]
  v-model="snackbar.show"
  :color="snackbar.color"
  :timeout="snackbar.timeout"
>{{ snackbar.message }}</v-snackbar>`,
    inputs: { INPUT_1: "reactive", INPUT_2: "value", INPUT_3: "notify", INPUT_4: "snackbar" },
    completeCode: "reactive() global | composable useSnackbar() | v-snackbar en layout"
  },
  {
    id: 9, title: "Theming Dinámico: Dark/Light Mode", stars: 3, category: "THEMING",
    description: "Vuetify permite cambiar el tema en runtime. Combínalo con preferencias del sistema via usePreferredDark.",
    objective: "Toggle de tema oscuro/claro",
    tags: ["useTheme", "dark", "light", "toggle"],
    fileName: "composables/useAppTheme.ts",
    completed: false,
    theory: `## Theming dinámico en Vuetify
El tema se cambia en runtime sin recargar, y debe recordar la preferencia del usuario.

### El patrón
- useTheme() expone theme.global.name (light/dark).
- El toggle alterna el valor y lo guarda en localStorage.
- Al montar, inicializa desde localStorage (o usePreferredDark).

### Por qué importa
Sin persistencia, el usuario elige el tema en cada visita. Respetar la preferencia del sistema como valor inicial es el detalle que separa una app pulida.`,
    explanationText: "🌍 Ejemplo cotidiano: el tema oscuro/claro debe recordarse entre visitas y respetar la preferencia del sistema.\n\nuseTheme().global.name.value alterna 'light'/'dark' en runtime; persistir en localStorage (e inicializar desde ahí) evita que el usuario elija cada vez. Es UX básica en 2026.",
    codeSnippet:
`import { useTheme } from '[INPUT_1]';

export function useAppTheme() {
  const theme = [INPUT_2]();

  const toggleTheme = () => {
    theme.global.name.value =
      theme.global.name.value === 'light' ? '[INPUT_3]' : 'light';
    // Persistir preferencia
    localStorage.setItem('theme', theme.global.[INPUT_4].value);
  };

  // Inicializar desde localStorage
  onMounted(() => {
    const saved = localStorage.getItem('theme');
    if (saved) theme.global.name.value = saved;
  });

  return { toggleTheme, currentTheme: theme.global.name };
}`,
    inputs: { INPUT_1: "vuetify", INPUT_2: "useTheme", INPUT_3: "dark", INPUT_4: "name" },
    completeCode: "useTheme() | theme.global.name.value = 'dark'|'light'"
  },
  {
    id: 10, title: "v-autocomplete: Búsqueda Asíncrona", stars: 3, category: "FORMS",
    description: "v-autocomplete con búsqueda asíncrona es esencial para selección de entidades en formularios reales.",
    objective: "Autocomplete con fetch dinámico",
    tags: ["v-autocomplete", "async", "search"],
    fileName: "UserSelector.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: buscar un cliente mientras escribes, con las opciones llegando de la API.\n\nv-model:search + watch dispara el $fetch cuando hay 2+ caracteres; :loading muestra el spinner. El debounce del watch evita martillar la API con cada tecla.",
    codeSnippet:
`<script setup lang="ts">
const search = ref('');
const items = ref([]);
const loading = ref(false);

watch(search, async (val) => {
  if (!val || val.length < 2) return;
  [INPUT_1].value = true;
  items.value = await $fetch(\`/api/users?q=\${val}\`);
  loading.value = [INPUT_2];
});
</script>

<template>
  <v-[INPUT_3]
    v-model:search="search"
    :items="items"
    :[INPUT_4]="loading"
    item-title="name"
    item-value="id"
    label="Buscar usuario"
    clearable
  />
</template>`,
    inputs: { INPUT_1: "loading", INPUT_2: "false", INPUT_3: "autocomplete", INPUT_4: "loading" },
    completeCode: "v-autocomplete v-model:search | watch(search) → $fetch | :loading"
  },
  {
    id: 11, title: "Vuetify + Accesibilidad (a11y)", stars: 3, category: "A11Y",
    description: "Material Design incluye guías de accesibilidad. Vuetify implementa ARIA roles automáticamente, pero debes complementarlo.",
    objective: "WCAG y accesibilidad con Vuetify",
    tags: ["aria-label", "role", "focus", "a11y"],
    fileName: "AccessibleDialog.vue",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: la accesibilidad no es opcional: clientes corporativos la exigen y en algunos países es ley.\n\nVuetify aporta roles ARIA y focus trap automáticos, pero debes completar: aria-label en íconos sin texto y role/aria-describedby en diálogos. Lo automático no cubre el 100%.",
    codeSnippet:
`<template>
  <!-- v-btn automáticamente tiene role='button' -->
  <!-- Para íconos solos, siempre agrega aria-label -->
  <v-btn
    icon="mdi-delete"
    [INPUT_1]="'Eliminar usuario ' + user.name"
    color="error"
    @click="deleteUser"
  />

  <!-- v-dialog maneja focus trap automáticamente -->
  <v-dialog
    v-model="open"
    [INPUT_2]="'Confirmar eliminación'"
    [INPUT_3]="'dialog'"
  >
    <!-- El h1 dentro del dialog recibe focus automático -->
    <v-card :title="dialogTitle">
      <v-card-text [INPUT_4]="'Descripción del modal'">
        ¿Deseas eliminar este usuario?
      </v-card-text>
    </v-card>
  </v-dialog>
</template>`,
    inputs: { INPUT_1: "aria-label", INPUT_2: "aria-label", INPUT_3: "role", INPUT_4: "aria-describedby" },
    completeCode: "aria-label en íconos | role en dialog | focus trap automático en v-dialog"
  },
  {
    id: 12, title: "Vuetify: Customizar con SCSS", stars: 4, category: "THEMING",
    description: "Para personalizaciones profundas, Vuetify expone variables SCSS que sobreescriben el tema base.",
    objective: "Override de tokens de diseño",
    tags: ["SCSS", "variables", "deep customization"],
    fileName: "assets/vuetify-overrides.scss",
    completed: false,
    theory: `## Customización profunda con SCSS
Las variables SCSS de Vuetify son design tokens: el contrato entre diseño y desarrollo.

### Cómo se sobreescriben
\`@use 'vuetify' with ($body-font-family: ..., $card-border-radius: ...)\` antes de importar Vuetify.

### Por qué importa
- Cambias el token una vez y se propaga a toda la app.
- Mantiene consistencia sin CSS de parche con !important.

### Cuándo
Solo para personalización profunda. Para ajustes puntuales, los props y el tema alcanzan.`,
    explanationText: "🌍 Ejemplo cotidiano: los design tokens son el contrato entre diseño y desarrollo: cambias la variable una vez y aplica en toda la app.\n\n@use 'vuetify' with (...) sobreescribe variables SCSS (fuente, radios, transiciones) antes de importar Vuetify. Así personalizas de raíz sin pelear con la especificidad de CSS.",
    codeSnippet:
`// assets/vuetify-overrides.scss
// Importar ANTES de Vuetify
@use 'vuetify' with (
  $[INPUT_1]-font-family: 'Inter, sans-serif',
  $[INPUT_2]-border-radius: 12px,
  $[INPUT_3]-transition: all 0.15s ease
);

// nuxt.config.ts — registrar
export default defineNuxtConfig({
  vuetify: {
    [INPUT_4]: {
      styles: { configFile: './assets/vuetify-overrides.scss' }
    }
  }
});`,
    inputs: { INPUT_1: "body", INPUT_2: "card", INPUT_3: "btn", INPUT_4: "vuetifyOptions" },
    completeCode: "@use 'vuetify' with ($body-font-family, $card-border-radius) en SCSS"
  }
];
