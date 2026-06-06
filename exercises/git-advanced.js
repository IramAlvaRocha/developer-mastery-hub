// Git Flow Avanzado & Trunk Based Development — 10 ejercicios
const GIT_ADVANCED_EXERCISES = [
  {
    id: 1, title: "Git Flow: Estrategia de Ramas", stars: 2, category: "GIT FLOW",
    description: "Git Flow define ramas con propósitos específicos: main, develop, feature/*, release/*, hotfix/*",
    objective: "Estructura de Git Flow",
    tags: ["git flow", "branches", "strategy"],
    fileName: "terminal",
    completed: false,
    explanationText: "Git Flow es como el sistema de control de tráfico aéreo: cada avión (rama) tiene una ruta definida. Sin eso, chocarían (conflictos en producción).",
    codeSnippet:
`# Inicializar Git Flow
git flow [INPUT_1]

# Iniciar feature
git flow feature [INPUT_2] feature/user-auth

# Terminar feature (merge a develop y elimina la rama)
git flow feature [INPUT_3] feature/user-auth

# Iniciar release
git flow release start [INPUT_4]
git flow release finish 1.2.0`,
    inputs: { INPUT_1: "init", INPUT_2: "start", INPUT_3: "finish", INPUT_4: "1.2.0" },
    completeCode: "git flow init | feature start/finish | release start/finish"
  },
  {
    id: 2, title: "Trunk Based Development: Feature Flags", stars: 4, category: "TRUNK BASED",
    description: "En Trunk Based, todos commitean directo a main con feature flags para ocultar código incompleto en producción.",
    objective: "Feature flags para desarrollo continuo",
    tags: ["trunk based", "feature flag", "main"],
    fileName: "featureFlags.ts",
    completed: false,
    explanationText: "Feature flags son como los interruptores de luz en una casa en construcción: la instalación está hecha pero el interruptor está apagado hasta que todo esté listo.",
    codeSnippet:
`// featureFlags.ts
export const FLAGS = {
  NEW_DASHBOARD: process.env.FEATURE_NEW_DASHBOARD === '[INPUT_1]',
  BETA_PAYMENTS: process.env.FEATURE_BETA_PAYMENTS === 'true',
} as const;

// Uso en componente Vue
<template>
  <NewDashboard v-if="FLAGS.[INPUT_2]" />
  <OldDashboard v-[INPUT_3] />
</template>

// En Firebase Remote Config (mejor práctica):
const remoteConfig = getRemoteConfig();
const flag = remoteConfig.[INPUT_4]('new_dashboard').asBoolean();`,
    inputs: { INPUT_1: "true", INPUT_2: "NEW_DASHBOARD", INPUT_3: "else", INPUT_4: "getValue" },
    completeCode: "process.env.FEATURE_X === 'true' | Firebase Remote Config | v-if flag"
  },
  {
    id: 3, title: "Pull Requests & Code Review Best Practices", stars: 3, category: "COLLABORATION",
    description: "Un buen PR es pequeño, enfocado y tiene descripción clara. Los code reviews son oportunidades de aprendizaje, no juicios.",
    objective: "PRs efectivos y revisiones de calidad",
    tags: ["pull request", "review", "CODEOWNERS"],
    fileName: ".github/PULL_REQUEST_TEMPLATE.md",
    completed: false,
    explanationText: "Un PR grande es como un examen de 200 preguntas vs uno de 20: el reviewer se cansa, baja la calidad de revisión y se aprueban bugs.",
    codeSnippet:
`## ¿Qué hace este PR?
<!-- Descripción breve del cambio -->

## Tipo de cambio
- [ ] [INPUT_1]: nueva funcionalidad
- [ ] fix: corrección de bug
- [ ] refactor: sin cambio funcional
- [ ] [INPUT_2]: documentación

## Checklist
- [ ] Tests agregados/actualizados
- [ ] Sin console.log de debug
- [ ] Variables de entorno documentadas en [INPUT_3]

# .github/CODEOWNERS
# Requiere aprobación de estos owners para fusionar
[INPUT_4]  @team-lead @senior-dev
src/security/ @security-team`,
    inputs: { INPUT_1: "feat", INPUT_2: "docs", INPUT_3: ".env.example", INPUT_4: "*" },
    completeCode: "PR template | CODEOWNERS para review automático | checklist de calidad"
  },
  {
    id: 4, title: "Squash & Merge: Historial Limpio", stars: 3, category: "HISTORY",
    description: "Squash combina todos los commits de un PR en uno solo antes de mergear. Mantiene el historial de main limpio.",
    objective: "Estrategias de merge en PRs",
    tags: ["squash", "merge", "history"],
    fileName: "terminal",
    completed: false,
    explanationText: "Squash merge es como preparar un resumen ejecutivo: en vez de 47 minutas de reuniones, tienes UN documento con las decisiones finales.",
    codeSnippet:
`# Squash: combina todos los commits en uno
git merge --[INPUT_1] feature/user-auth
git commit -m "feat(auth): add JWT authentication"

# Rebase merge: historial lineal sin merge commit
git checkout feature/my-feature
git [INPUT_2] main
git checkout main
git merge [INPUT_3] feature/my-feature # fast-forward

# Ver el log limpio resultante
git log --[INPUT_4] --graph --all`,
    inputs: { INPUT_1: "squash", INPUT_2: "rebase", INPUT_3: "--ff-only", INPUT_4: "oneline" },
    completeCode: "--squash | rebase main | --ff-only | git log --oneline --graph"
  },
  {
    id: 5, title: "Git Hooks con Husky: Pre-commit", stars: 4, category: "QUALITY",
    description: "Husky ejecuta scripts antes de cada commit. Úsalo para lint, format y tests automáticos.",
    objective: "Automatizar calidad con Git hooks",
    tags: ["husky", "lint-staged", "pre-commit"],
    fileName: "package.json",
    completed: false,
    explanationText: "Husky es como el corrector ortográfico de Word, pero para código: te avisa ANTES de enviar si hay errores, no después de que el cliente los vea.",
    codeSnippet:
`// package.json
{
  "scripts": {
    "prepare": "[INPUT_1] install"
  },
  "[INPUT_2]": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{ts,vue,json}": "prettier --write"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-[INPUT_3]",
      "[INPUT_4]": "npm test -- --watchAll=false"
    }
  }
}`,
    inputs: { INPUT_1: "husky", INPUT_2: "lint-staged", INPUT_3: "staged", INPUT_4: "pre-push" },
    completeCode: "husky install | lint-staged en *.ts | pre-commit: lint-staged | pre-push: test"
  },
  {
    id: 6, title: "Semantic Versioning con semantic-release", stars: 4, category: "VERSIONING",
    description: "semantic-release genera versiones y changelogs automáticamente basándose en los conventional commits.",
    objective: "Versionado automático con CI",
    tags: ["semantic-release", "semver", "changelog"],
    fileName: ".releaserc.json",
    completed: false,
    explanationText: "Semantic versioning es el contrato con tus usuarios: MAJOR.MINOR.PATCH. 1.0.0 → 1.1.0 (feat) → 1.1.1 (fix) → 2.0.0 (breaking change).",
    codeSnippet:
`// .releaserc.json
{
  "branches": ["[INPUT_1]"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/[INPUT_2]",
    ["@semantic-release/github", {
      "assets": ["dist/*.js"]
    }],
    ["@semantic-release/npm", {
      "[INPUT_3]": false
    }]
  ]
}

// Commits que generan versiones:
// feat: → MINOR bump (1.1.0)
// fix: → [INPUT_4] bump (1.0.1)
// feat!: BREAKING → MAJOR bump (2.0.0)`,
    inputs: { INPUT_1: "main", INPUT_2: "release-notes-generator", INPUT_3: "npmPublish", INPUT_4: "PATCH" },
    completeCode: "semantic-release | feat→MINOR | fix→PATCH | BREAKING!→MAJOR"
  },
  {
    id: 7, title: "Git Stash: Cambios Temporales", stars: 2, category: "WORKFLOW",
    description: "git stash guarda cambios no commiteados temporalmente para poder cambiar de rama sin perderlos.",
    objective: "Gestión de trabajo en progreso",
    tags: ["stash", "WIP", "context switching"],
    fileName: "terminal",
    completed: false,
    explanationText: "git stash es como el cajón de 'pendientes' de tu escritorio: apartas lo que estás haciendo, atiendes lo urgente y luego retomas.",
    codeSnippet:
`# Guardar cambios actuales con descripción
git stash [INPUT_1] "WIP: user form validation"

# Ver todos los stashes
git stash [INPUT_2]

# Aplicar el más reciente Y eliminarlo del stash
git stash [INPUT_3]

# Aplicar uno específico sin eliminarlo
git stash [INPUT_4] stash@{2}

# Eliminar un stash específico
git stash drop stash@{0}`,
    inputs: { INPUT_1: "push -m", INPUT_2: "list", INPUT_3: "pop", INPUT_4: "apply" },
    completeCode: "stash push -m | stash list | stash pop | stash apply stash@{n}"
  },
  {
    id: 8, title: "Cherry-pick: Portar Commits Específicos", stars: 3, category: "WORKFLOW",
    description: "cherry-pick aplica commits específicos de una rama a otra sin mergear toda la rama.",
    objective: "Portar fixes a múltiples ramas",
    tags: ["cherry-pick", "hotfix", "backport"],
    fileName: "terminal",
    completed: false,
    explanationText: "Cherry-pick es como copiar una receta específica de un libro de cocina sin llevarte el libro completo. Útil para portar hotfixes a main y a versiones anteriores.",
    codeSnippet:
`# Obtener el hash del commit a portar
git log --oneline feature/payment-fix

# Portar UN commit específico
git checkout main
git cherry-[INPUT_1] abc1234

# Portar un rango de commits
git cherry-pick [INPUT_2]..def5678

# Si hay conflicto: resolver, luego continuar
git add .
git cherry-pick --[INPUT_3]

# Portar sin commitear (para revisar antes)
git cherry-pick abc1234 --[INPUT_4]`,
    inputs: { INPUT_1: "pick", INPUT_2: "abc1234", INPUT_3: "continue", INPUT_4: "no-commit" },
    completeCode: "cherry-pick <hash> | range abc..def | --continue | --no-commit"
  },
  {
    id: 9, title: "GitHub Actions: Deploy a Cloud Run en PR Merge", stars: 5, category: "CI/CD",
    description: "Workflow completo: lint + test + build + deploy a staging en PR, a producción en merge a main.",
    objective: "CI/CD completo para Vue + Cloud Run",
    tags: ["GitHub Actions", "Cloud Run", "staging", "production"],
    fileName: ".github/workflows/deploy.yml",
    completed: false,
    explanationText: "CI/CD bien configurado es la diferencia entre desplegar con miedo (manual, lento, propenso a errores) y desplegar con confianza (automático, testeado, reproducible).",
    codeSnippet:
`name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  [INPUT_1]:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm [INPUT_2] && npm test

  deploy-staging:
    needs: [INPUT_3]
    if: github.event_name == 'pull_request'
    steps:
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: \${{ secrets.[INPUT_4] }}
      - run: |
          gcloud run deploy my-api-staging \\
            --image gcr.io/\${{ env.PROJECT_ID }}/my-api:\${{ github.sha }}`,
    inputs: { INPUT_1: "test", INPUT_2: "run build", INPUT_3: "test", INPUT_4: "GCP_SA_KEY" },
    completeCode: "job test → deploy-staging(PR) / deploy-prod(main push) | google-github-actions/auth"
  },
  {
    id: 10, title: "Monorepo con npm Workspaces", stars: 4, category: "MONOREPO",
    description: "Monorepos contienen múltiples paquetes en un solo repositorio. npm workspaces los gestiona sin duplicar node_modules.",
    objective: "Estructura de monorepo básica",
    tags: ["monorepo", "workspaces", "shared packages"],
    fileName: "package.json",
    completed: false,
    explanationText: "Un monorepo es como un edificio de departamentos: un solo terreno (repo), múltiples apartamentos (paquetes) que comparten infraestructura (node_modules, CI/CD).",
    codeSnippet:
`// package.json (raíz del monorepo)
{
  "name": "my-platform",
  "private": true,
  "[INPUT_1]": [
    "packages/*",
    "apps/*"
  ]
}

// Estructura:
// apps/web/          → Vue/Nuxt app
// apps/admin/        → panel de admin
// packages/[INPUT_2]/ → componentes compartidos
// packages/types/    → tipos TypeScript compartidos

// Instalar dependencia en un workspace específico
npm install axios --workspace=[INPUT_3]/web

// Ejecutar script en todos los workspaces
npm run [INPUT_4] --workspaces`,
    inputs: { INPUT_1: "workspaces", INPUT_2: "ui", INPUT_3: "apps", INPUT_4: "build" },
    completeCode: "workspaces: ['packages/*', 'apps/*'] | --workspace=apps/web | --workspaces"
  }
];
