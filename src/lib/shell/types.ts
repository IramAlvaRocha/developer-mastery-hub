// ──────────────────────────────────────────────────────────────────────────
// Tipos del simulador de terminal (filesystem en memoria + estado git/vim).
// ──────────────────────────────────────────────────────────────────────────

export type FsNode =
  | { type: "file"; content: string; mode?: string }
  | { type: "dir"; children: Record<string, FsNode> };

export interface GitState {
  branch: string;
  branches: string[];
  remotes: string[];
  staged: string[];
  modified: string[];
  untracked: string[];
  stashes: { msg: string }[];
  lastCommits: string[];
  conflictFiles: string[];
  bisectActive: boolean;
  worktrees: string[];
}

export interface VimState {
  file: string;
  lines: string[];
  mode: "normal" | "insert";
  cursorLine: number;
}

export interface ShellState {
  cwd: string;
  env: Record<string, string>;
  aliases: Record<string, string>;
  fs: FsNode;
  git: GitState;
  vim: VimState | null;
  jobs: { id: number; cmd: string }[];
  nextJobId: number;
}

export type ShellPreset = "home" | "logs" | "project" | "git-repo";

export interface ShellScenario {
  preset: ShellPreset;
  /** Directorio inicial (por defecto /home/dev). */
  cwd?: string;
  /** Mensaje mostrado al abrir la terminal. */
  welcome?: string;
}

export interface ShellResult {
  output: string[];
  state: ShellState;
  /** Si true, limpia la pantalla antes de mostrar output. */
  clear?: boolean;
}
