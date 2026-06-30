import type { FsNode, GitState, ShellPreset, ShellState } from "./types";

function file(content: string, mode = "644"): FsNode {
  return { type: "file", content, mode };
}

function dir(children: Record<string, FsNode>): FsNode {
  return { type: "dir", children };
}

const ACCESS_LOG = `192.168.1.10 GET /api/users 200
10.0.0.5 GET /api/users 200
192.168.1.10 POST /login 401
10.0.0.5 GET /health 200
172.16.0.2 GET /api/users 500
192.168.1.10 GET /dashboard 200
10.0.0.5 GET /api/users 200
172.16.0.2 GET /health 200
192.168.1.10 GET /api/users 200`;

const APP_LOG = `[INFO] Server started on port 3000
[ERROR] Connection refused to database
[WARN] Retrying connection...
[ERROR] Timeout after 30s
[INFO] Fallback mode enabled`;

const PRESETS: Record<ShellPreset, { fs: FsNode; git?: Partial<GitState> }> = {
  home: {
    fs: dir({
      home: dir({
        dev: dir({
          proyectos: dir({
            "mi-app": dir({
              src: dir({
                "index.js": file("console.log('hello');"),
                "app.js": file("export const port = 3000;"),
              }),
              "package.json": file('{"name":"mi-app"}'),
              README: file("# Mi App\nProyecto de ejemplo."),
            }),
          }),
          documents: dir({
            "notas.txt": file("Apuntes de bash\npwd, ls, cd"),
          }),
          ".bashrc": file('export PATH=$PATH:/usr/local/bin\nalias gs="git status"'),
          README: file("Bienvenido al simulador de terminal."),
        }),
      }),
    }),
  },
  logs: {
    fs: dir({
      home: dir({
        dev: dir({
          "access.log": file(ACCESS_LOG),
          "app.log": file(APP_LOG),
          logs: dir({
            "error.log": file("[ERROR] disk full\n[ERROR] OOM"),
          }),
          scripts: dir({
            "cleanup.sh": file("#!/bin/bash\nfind . -name '*.tmp' -delete"),
          }),
        }),
      }),
    }),
  },
  project: {
    fs: dir({
      home: dir({
        dev: dir({
          src: dir({
            "main.ts": file("import { getUser } from './api';\n// TODO: refactor\nexport function main() { return getUser(); }"),
            "api.ts": file("export function getUser() { return { id: 1 }; }\nexport function getUserList() { return []; }"),
            "utils.ts": file("// helper\nexport const VERSION = '1.0';"),
          }),
          "package.json": file('{"name":"demo"}'),
          "app.log": file(APP_LOG),
          data: dir({
            "users.csv": file("id,name\n1,Ana\n2,Bob"),
          }),
        }),
      }),
    }),
  },
  "git-repo": {
    fs: dir({
      home: dir({
        dev: dir({
          "app.js": file("const port = 3000;\nmodule.exports = { port };"),
          "perfil.tsx": file("export function Perfil() { return null; }"),
          "package.json": file('{"name":"repo"}'),
          ".gitignore": file("node_modules/\n.env"),
        }),
      }),
    }),
    git: {
      branch: "main",
      branches: ["main", "develop", "feature/login"],
      remotes: ["origin"],
      modified: ["app.js"],
      untracked: ["perfil.tsx"],
      lastCommits: [
        "a1b2c3d feat: initial commit",
        "9f8e7d6 fix: port config",
        "c0ffee0 docs: readme",
      ],
    },
  },
};

const DEFAULT_GIT: GitState = {
  branch: "main",
  branches: ["main"],
  remotes: ["origin"],
  staged: [],
  modified: [],
  untracked: [],
  stashes: [],
  lastCommits: ["abc1234 init"],
  conflictFiles: [],
  bisectActive: false,
  worktrees: [],
};

export function createInitialState(
  preset: ShellPreset,
  cwd = "/home/dev",
): ShellState {
  const p = PRESETS[preset];
  return {
    cwd,
    env: { HOME: "/home/dev", USER: "dev", PATH: "/usr/bin:/bin", NODE_ENV: "development" },
    aliases: { gs: "git status" },
    fs: structuredClone(p.fs),
    git: { ...DEFAULT_GIT, ...structuredClone(p.git ?? {}) },
    vim: null,
    jobs: [],
    nextJobId: 1,
  };
}

export function presetForCategory(category: string, exerciseId: number): ShellPreset {
  if (exerciseId >= 35) {
    if (exerciseId === 35 || exerciseId === 36) return "logs";
    if (exerciseId === 37) return "project";
    return "git-repo";
  }
  switch (category) {
    case "NAVEGACION":
    case "PERMISOS":
    case "ENTORNO":
    case "VIM":
      return "home";
    case "BUSQUEDA":
      return "project";
    case "PIPES":
    case "PROCESOS":
      return "logs";
    case "GIT RAMAS":
    case "GIT CONFLICTOS":
    case "GIT PRO":
    case "INTEGRADOR":
      return "git-repo";
    default:
      return "home";
  }
}

export function welcomeForPreset(preset: ShellPreset): string {
  const hints: Record<ShellPreset, string> = {
    home: "Prueba: pwd, ls, cd proyectos, cat README",
    logs: "Prueba: cat access.log, tail -f app.log, grep ERROR app.log",
    project: "Prueba: find . -name '*.ts', grep -r getUser src/",
    "git-repo": "Prueba: git status, git branch, git switch -c feature/test",
  };
  return `Terminal simulada — escribe \`help\` para ver comandos. ${hints[preset]}`;
}
