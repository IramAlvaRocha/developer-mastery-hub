import type { Exercise } from "@/lib/types";

export const CODE_QUALITY_EXERCISES: Exercise[] = [
  {
    id: 1, title: "ESLint Flat Config (v9+): Configuración Moderna", stars: 3, category: "ESLINT",
    description: "ESLint v9 usa eslint.config.js (flat config) en lugar de .eslintrc. Es la configuración actual en proyectos nuevos.",
    objective: "configurar ESLint con TypeScript y Vue",
    tags: ["eslint.config.js", "flat config", "typescript-eslint"],
    fileName: "eslint.config.js",
    completed: false,
    theory: `## De .eslintrc a flat config
ESLint v9 unificó la configuración en un solo archivo ESM (eslint.config.js), en lugar de los viejos .eslintrc.* dispersos.

### Por qué importa
- tseslint.config() combina las reglas de JS y TypeScript en un único export.
- recommendedTypeChecked usa el parser de tipos: caza errores que las reglas sintácticas no ven.
- Poner eslint-config-prettier al final desactiva las reglas de estilo que chocan con Prettier.

### Analogía
.eslintrc era una lista de notas sueltas; la flat config es un único manual de estilo por proyecto.`,
    explanationText: "🌍 Ejemplo cotidiano: ESLint es el inspector de obra que no deja pasar un cable suelto: avisa del bug antes de que llegue a producción.\n\nLa flat config (eslint.config.js) reemplaza a .eslintrc y se arma con tseslint.config() combinando reglas de JS, TypeScript y Vue. Fijar 'no-explicit-any' en 'error' corta el 'any' que silencia el compilador y deja pasar errores.",
    codeSnippet:
`import eslint from '@eslint/js';
import tseslint from '[INPUT_1]';
import vuePlugin from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.[INPUT_2],
  ...tseslint.configs.recommendedTypeChecked,
  ...vuePlugin.configs['flat/[INPUT_3]'],
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': '[INPUT_4]',
      '@typescript-eslint/no-unused-vars': 'error',
      'vue/multi-word-component-names': 'error'
    }
  }
);`,
    inputs: { INPUT_1: "typescript-eslint", INPUT_2: "recommended", INPUT_3: "recommended", INPUT_4: "error" },
    completeCode: "tseslint.config | recommendedTypeChecked | vue flat/recommended | no-explicit-any: error"
  },
  {
    id: 2, title: "SonarQube: Métricas de Calidad", stars: 4, category: "SONARQUBE",
    description: "SonarQube analiza el código buscando bugs, vulnerabilidades, code smells y mide cobertura de tests.",
    objective: "Integrar SonarQube en CI",
    tags: ["SonarQube", "Quality Gate", "coverage"],
    fileName: "sonar-project.properties",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: SonarQube es una auditoría de código automatizada: detecta deuda técnica y vulnerabilidades, y te da una calificación de calidad.\n\nEl Quality Gate es el semáforo del CI: si la cobertura baja del 80% o aparece un bug crítico, el build falla. Así la calidad se controla en cada merge, no a fin de mes.",
    codeSnippet:
`# sonar-project.properties
sonar.projectKey=my-vue-app
sonar.projectName=My Vue Application
sonar.sources=[INPUT_1]
sonar.tests=src
sonar.test.inclusions=[INPUT_2]
sonar.javascript.lcov.reportPaths=[INPUT_3]
sonar.coverage.exclusions=**/*.spec.ts,**/node_modules/**

# Quality Gate (falla el CI si no se cumple):
# - Cobertura mínima: 80%
# - 0 bugs críticos
# - 0 [INPUT_4]

# En GitHub Actions:
# - name: SonarQube Scan
#   uses: sonarsource/sonarqube-scan-action@master`,
    inputs: { INPUT_1: "src", INPUT_2: "**/*.spec.ts,**/*.test.ts", INPUT_3: "coverage/lcov.info", INPUT_4: "vulnerabilities" },
    completeCode: "sonar.sources=src | lcov.reportPaths | Quality Gate: coverage>80% + 0 vulns"
  },
  {
    id: 3, title: "Prettier: Configuración por Equipo", stars: 2, category: "PRETTIER",
    description: "Prettier formatea el código automáticamente. Una config compartida elimina debates de estilo en code reviews.",
    objective: "configurar Prettier con EditorConfig y VSCode",
    tags: ["prettier", ".prettierrc", "editorconfig"],
    fileName: ".prettierrc.json",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: Prettier acaba para siempre el debate de 'tabs vs espacios': formatea solo y el equipo vuelve a la lógica.\n\nLa config compartida (.prettierrc.json) es la fuente de verdad del formato; acompañada de eslint-config-prettier, ESLint y Prettier no se pisan. Así los code reviews no gastan tiempo en estilo.",
    codeSnippet:
`// .prettierrc.json
{
  "[INPUT_1]": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "[INPUT_2]": "single",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "[INPUT_3]": "auto",
  "plugins": ["prettier-plugin-[INPUT_4]"]
}`,
    inputs: { INPUT_1: "printWidth", INPUT_2: "singleQuote", INPUT_3: "endOfLine", INPUT_4: "tailwindcss" },
    completeCode: "printWidth: 100 | singleQuote | endOfLine: auto | prettier-plugin-tailwindcss"
  },
  {
    id: 4, title: "ESLint: Reglas de Seguridad", stars: 4, category: "ESLINT",
    description: "eslint-plugin-security detecta vulnerabilidades comunes en Node.js: injection, RegEx DoS, path traversal.",
    objective: "configurar ESLint para seguridad",
    tags: ["eslint-plugin-security", "no-eval", "injection"],
    fileName: "eslint.config.js",
    completed: false,
    theory: `## Seguridad en el linter
Las reglas de seguridad corren en el editor y en el CI: son el análisis estático más barato que existe.

### Qué detecta eslint-plugin-security
- no-eval: bloquea eval() y Function(), vectores de ejecución de código.
- detect-unsafe-regex: marca patrones con backtracking exponencial (ReDoS).
- detect-object-injection: avisa del acceso a objetos por clave dinámica (posible prototype pollution).

### Por qué importa
Un linter no reemplaza una auditoría, pero evita que el patrón peligroso llegue a producción: cuesta una dependencia y cero tiempo de ejecución.`,
    explanationText: "🌍 Ejemplo cotidiano: las reglas de seguridad son el primer escudo: detectan el patrón peligroso antes de que un atacante lo explote.\n\neslint-plugin-security marca eval(), RegEx con riesgo de DoS y el acceso por variable (prototype pollution). Es barato de activar y frena vectores de inyección en el commit, no en producción.",
    codeSnippet:
`import security from '[INPUT_1]';

export default [
  security.configs.recommended,
  {
    rules: {
      // Prohibir eval() — vector de inyección de código
      'no-[INPUT_2]': 'error',
      // Detectar RegEx que pueden causar DoS
      'security/detect-unsafe-regex': '[INPUT_3]',
      // Detectar acceso a objetos por variables (prototype pollution)
      'security/detect-object-[INPUT_4]': 'warn'
    }
  }
];`,
    inputs: { INPUT_1: "eslint-plugin-security", INPUT_2: "eval", INPUT_3: "error", INPUT_4: "injection" },
    completeCode: "eslint-plugin-security | no-eval: error | detect-unsafe-regex | detect-object-injection"
  },
  {
    id: 5, title: "Vitest: Coverage con Istanbul", stars: 3, category: "COVERAGE",
    description: "La cobertura de código mide qué porcentaje del código está cubierto por tests. El umbral mínimo en producción: 80%.",
    objective: "Configurar coverage en Vitest",
    tags: ["coverage", "v8", "thresholds"],
    fileName: "vitest.config.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: la cobertura es la inspección vehicular: no garantiza un auto perfecto, pero confirma que revisaste los puntos críticos.\n\nVitest usa el provider v8 y los thresholds hacen fallar el build si líneas, funciones o ramas bajan del mínimo. Un 80% de líneas con 0 ramas probadas es cobertura falsa: por eso se mide cada métrica por separado.",
    codeSnippet:
`import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    [INPUT_1]: {
      provider: '[INPUT_2]',
      reporter: ['text', 'lcov', 'html'],
      [INPUT_3]: {
        lines: 80,
        functions: 80,
        branches: [INPUT_4],
        statements: 80
      },
      exclude: ['**/node_modules/**', '**/*.spec.ts']
    }
  }
});`,
    inputs: { INPUT_1: "coverage", INPUT_2: "v8", INPUT_3: "thresholds", INPUT_4: "75" },
    completeCode: "coverage: { provider: 'v8', thresholds: { lines: 80, branches: 75 } }"
  },
  {
    id: 6, title: "TypeScript: tsconfig.json Estricto", stars: 3, category: "TYPESCRIPT",
    description: "Un tsconfig estricto activa todas las verificaciones de TypeScript. Es el estándar en proyectos senior.",
    objective: "configurar TypeScript estricto",
    tags: ["strict", "noUncheckedIndexedAccess", "exactOptionalPropertyTypes"],
    fileName: "tsconfig.json",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: strict: true es el modo difícil de un juego: exige más al principio, pero te hace mejor y previene bugs serios.\n\nnoUncheckedIndexedAccess te obliga a tratar el undefined de un array indexado, y exactOptionalPropertyTypes evita confundir 'ausente' con 'undefined'. El coste se paga al escribir; el beneficio es que el compilador caza lo que el runtime callaría.",
    codeSnippet:
`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "[INPUT_1]": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "[INPUT_2]",
    "paths": {
      "@/*": ["./[INPUT_3]/*"]
    }
  },
  "[INPUT_4]": ["src/**/*.ts", "src/**/*.vue"]
}`,
    inputs: { INPUT_1: "strict", INPUT_2: "bundler", INPUT_3: "src", INPUT_4: "include" },
    completeCode: "strict: true | noUncheckedIndexedAccess | moduleResolution: bundler | paths @/*"
  },
  {
    id: 7, title: "Code Review: Patrones a Rechazar", stars: 4, category: "CODE REVIEW",
    description: "En code reviews, ciertos patrones son señales de alerta. Saber identificarlos es clave para ser un reviewer efectivo.",
    objective: "detectar anti-patrones en PRs",
    tags: ["code review", "anti-patterns", "quality"],
    fileName: "review-checklist.md",
    completed: false,
    theory: `## Cómo revisar un PR
El objetivo no es rechazar, es subir el nivel del equipo con alternativas concretas.

### Señales de alerta que debes marcar
- any: silencia el type checker; pide unknown + type guard.
- Mutación directa del estado: rompe la reactividad; pide usar actions/setters.
- Secretos hardcodeados: comprometen la app; pide variables de entorno.

### Cómo comentar
- Señala el problema, muestra la alternativa y explica el porqué.
- Comenta el código, nunca a la persona. Aprobar rápido lo bueno acelera más que un bloqueo.`,
    explanationText: "🌍 Ejemplo cotidiano: un buen reviewer no solo encuentra bugs: enseña mejores alternativas y sube el nivel del equipo.\n\nEl 'any' apaga el type checker, la mutación directa rompe la reactividad de Vue/Pinia y el secreto hardcodeado compromete la app: los tres se rechazan con una alternativa. Revisar es guiar, no bloquear.",
    codeSnippet:
`// ❌ RECHAZAR: any desactiva el type checker
function process(data: [INPUT_1]) { ... }

// ✅ APROBAR: unknown + type guard
function process(data: unknown) {
  if (typeof data === 'string') { ... }
}

// ❌ RECHAZAR: mutación directa del state en Vue/Pinia
store.user.name = 'new'; // bypass de la reactividad

// ✅ APROBAR: a través de la action
store.[INPUT_2]({ name: 'new' });

// ❌ RECHAZAR: secreto hardcodeado
const API_KEY = 'AIzaSy[INPUT_3]...';

// ✅ APROBAR:
const API_KEY = process.env.[INPUT_4];`,
    inputs: { INPUT_1: "any", INPUT_2: "updateUser", INPUT_3: "NEVER_DO_THIS", INPUT_4: "API_KEY" },
    completeCode: "any → unknown | mutación directa → actions | hardcoded secrets → process.env"
  },
  {
    id: 8, title: "ESLint: Reglas de Accesibilidad Vue", stars: 3, category: "A11Y",
    description: "eslint-plugin-vuejs-accessibility detecta problemas de accesibilidad en plantillas Vue en tiempo de desarrollo.",
    objective: "configurar ESLint para a11y en Vue",
    tags: ["vuejs-accessibility", "aria", "alt text"],
    fileName: "eslint.config.js",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: la accesibilidad es el requerimiento más ignorado y uno de los más importantes: arreglarla en lint cuesta casi nada.\n\neslint-plugin-vuejs-accessibility exige alt en imágenes, contenido en botones/anclas y eventos de teclado en los clics. Detectar el fallo al guardar es mucho más barato que una demanda o un cliente perdido.",
    codeSnippet:
`import vueA11y from '[INPUT_1]';

export default [
  ...vueA11y.configs['flat/recommended'],
  {
    rules: {
      // Imágenes siempre con alt
      'vuejs-accessibility/alt-text': '[INPUT_2]',
      // Botones siempre con texto o aria-label
      'vuejs-accessibility/[INPUT_3]-has-content': 'error',
      // No usar onClick en divs (usar button)
      'vuejs-accessibility/click-events-have-[INPUT_4]-events': 'warn'
    }
  }
];`,
    inputs: { INPUT_1: "eslint-plugin-vuejs-accessibility", INPUT_2: "error", INPUT_3: "anchor", INPUT_4: "key" },
    completeCode: "vuejs-accessibility | alt-text: error | anchor-has-content | click-events-have-key-events"
  },
  {
    id: 9, title: "Pre-commit: Conventional Commits con commitlint", stars: 3, category: "COMMITS",
    description: "commitlint valida que todos los commits sigan el formato Conventional Commits antes de aceptarlos.",
    objective: "Forzar conventional commits",
    tags: ["commitlint", "husky", "commit-msg"],
    fileName: "commitlint.config.ts",
    completed: false,
    explanationText: "🌍 Ejemplo cotidiano: commitlint es el policía de los mensajes de commit: sin él, en 6 meses el historial es 'fix', 'cambios'.\n\nExtendiendo @commitlint/config-conventional, cada commit sigue el formato feat/fix/docs y alimenta el versionado automático (semantic-release). Un historial legible es lo que te salva al investigar cuándo se rompió algo.",
    codeSnippet:
`// commitlint.config.ts
export default {
  extends: ['@commitlint/config-[INPUT_1]'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'refactor',
      'test', 'chore', '[INPUT_2]', 'ci'
    ]],
    'scope-case': [2, 'always', '[INPUT_3]'],
    'subject-max-length': [2, 'always', [INPUT_4]]
  }
};

// .husky/commit-msg
# npx --no commitlint --edit "$1"`,
    inputs: { INPUT_1: "conventional", INPUT_2: "perf", INPUT_3: "lower-case", INPUT_4: "100" },
    completeCode: "@commitlint/config-conventional | type-enum | scope-case: lower-case | max-length: 100"
  },
  {
    id: 10, title: "Arquitectura: Principio de Responsabilidad Única", stars: 5, category: "ARCHITECTURE",
    description: "En Vue, cada archivo debe tener una sola responsabilidad. Componentes pequeños, composables para lógica, stores para estado.",
    objective: "aplicar SRP en Vue.js",
    tags: ["SRP", "separation of concerns", "architecture"],
    fileName: "architecture.ts",
    completed: false,
    theory: `## SRP en un componente Vue
El Principio de Responsabilidad Única dice: un archivo, un motivo de cambio.

### Cómo se reparte
- Componente (.vue): template + lo mínimo para renderizar.
- Composable (useXxx): lógica reutilizable y testeable.
- Store (Pinia): estado global compartido entre pantallas.

### Por qué importa
Un script de 500 líneas con fetch, validación y estado es difícil de testear y de heredar. Separar por responsabilidad hace cada pieza reemplazable y testeable de forma aislada.`,
    explanationText: "🌍 Ejemplo cotidiano: en un restaurante, el mesero no cocina ni cobra: cada uno tiene su función. En Vue pasa igual.\n\nEl componente dibuja (template), el composable piensa (lógica reutilizable) y el store recuerda (estado global). Mezclar los tres en un script de 500 líneas es un 'objeto Dios' que nadie quiere heredar ni testear.",
    codeSnippet:
`// ❌ MAL: componente con todo mezclado (Dios objeto)
// script de 500 líneas con fetch, validación, UI, estado global

// ✅ BIEN: separación de responsabilidades

// composables/useUserForm.ts — SOLO lógica del form
export function useUserForm() {
  const form = [INPUT_1]({ name: '', email: '' });
  const validate = () => { /* reglas */ };
  return { form, [INPUT_2] };
}

// stores/userStore.ts — SOLO estado global
export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const [INPUT_3] = async (user: User) => { /* API call */ };
  return { users, [INPUT_4] };
});`,
    inputs: { INPUT_1: "reactive", INPUT_2: "validate", INPUT_3: "addUser", INPUT_4: "addUser" },
    completeCode: "composable: lógica | store: estado | componente: UI | SRP = 1 responsabilidad cada uno"
  }
];
