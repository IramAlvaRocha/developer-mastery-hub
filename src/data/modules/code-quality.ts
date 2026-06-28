import type { Exercise } from "@/lib/types";

export const CODE_QUALITY_EXERCISES: Exercise[] = [
  {
    id: 1, title: "ESLint Flat Config (v9+): Configuración Moderna", stars: 3, category: "ESLINT",
    description: "ESLint v9 usa eslint.config.js (flat config) en lugar de .eslintrc. Es la configuración actual en proyectos nuevos.",
    objective: "eslint.config.js con TypeScript y Vue",
    tags: ["eslint.config.js", "flat config", "typescript-eslint"],
    fileName: "eslint.config.js",
    completed: false,
    explanationText: "ESLint es el guardián de la calidad del código: te avisa antes de que un bug llegue a producción. En equipos grandes, alinea el estilo de todos los desarrolladores.",
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
    explanationText: "SonarQube es como una auditoría de código automatizada: detecta deuda técnica, vulnerabilidades de seguridad y te da una 'calificación' de calidad.",
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
    objective: "Prettier con EditorConfig y VSCode",
    tags: ["prettier", ".prettierrc", "editorconfig"],
    fileName: ".prettierrc.json",
    completed: false,
    explanationText: "Prettier termina los debates de 'tabs vs espacios', 'single vs double quotes' para siempre. El equipo se enfoca en lógica, no en formato.",
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
    objective: "ESLint para seguridad",
    tags: ["eslint-plugin-security", "no-eval", "injection"],
    fileName: "eslint.config.js",
    completed: false,
    explanationText: "Las reglas de seguridad en ESLint son el primer escudo contra vulnerabilidades. Detectan patrones peligrosos como eval(), RegEx inseguras y acceso a paths sin sanitizar.",
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
    explanationText: "La cobertura de tests es como la inspección vehicular: no garantiza que el auto sea perfecto, pero sí que revisaste los puntos críticos.",
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
    objective: "Configuración de TypeScript estricta",
    tags: ["strict", "noUncheckedIndexedAccess", "exactOptionalPropertyTypes"],
    fileName: "tsconfig.json",
    completed: false,
    explanationText: "strict: true en TypeScript es como el modo difícil de un juego: más exigente al principio, pero te hace mejor y previene bugs serios en producción.",
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
    objective: "Anti-patrones a detectar en PRs",
    tags: ["code review", "anti-patterns", "quality"],
    fileName: "review-checklist.md",
    completed: false,
    explanationText: "Un buen code reviewer no solo encuentra bugs: enseña mejores alternativas. El objetivo es subir el nivel del equipo, no solo rechazar código.",
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
    objective: "ESLint para a11y en Vue",
    tags: ["vuejs-accessibility", "aria", "alt text"],
    fileName: "eslint.config.js",
    completed: false,
    explanationText: "La accesibilidad es el requerimiento más ignorado y uno de los más importantes. Detectar problemas en lint time es mucho más barato que arreglarlos en producción.",
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
    explanationText: "commitlint es el policía de los mensajes de commit. Sin él, en 6 meses el historial de git tiene mensajes como 'fix', 'arreglo bug', 'cambios'. Con él: historial profesional.",
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
    objective: "SRP aplicado a Vue.js",
    tags: ["SRP", "separation of concerns", "architecture"],
    fileName: "architecture.ts",
    completed: false,
    explanationText: "SRP en Vue: el componente dibuja (template), el composable piensa (lógica), el store recuerda (estado). Como en un restaurante: mesero, cocinero y caja tienen funciones distintas.",
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
