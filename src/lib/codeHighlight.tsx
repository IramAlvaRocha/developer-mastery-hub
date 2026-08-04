import { Fragment, type ReactNode } from "react";

// ──────────────────────────────────────────────────────────────────────────
// Resaltado de sintaxis ligero compartido.
// Lo usan ChallengeCode (inputs inline) y los renderers de formatos nuevos
// (CodeBlock). Se mantiene idéntico al tokenizador original de ChallengeCode.
// ──────────────────────────────────────────────────────────────────────────

export type CodeLang = "csharp" | "typescript" | "css" | "tree" | "bash";

export function detectLang(fileName?: string): CodeLang {
  const f = (fileName ?? "").toLowerCase();
  // Shell/terminal primero: cubre fileName "terminal", scripts y editores de consola.
  if (
    f === "terminal" ||
    f.endsWith(".sh") ||
    f.includes("bash") ||
    f.includes("zsh") ||
    f.includes("shell") ||
    f.includes("vim") ||
    f.includes("conflicto")
  )
    return "bash";
  if (f.endsWith(".sln") || f.endsWith(".txt") || f.includes("estructura"))
    return "tree";
  if (f.endsWith(".cs")) return "csharp";
  if (f.endsWith(".css")) return "css";
  return "typescript";
}

const KEYWORDS = new Set([
  // modificadores / declaraciones
  "public", "private", "protected", "internal", "sealed", "abstract",
  "partial", "static", "readonly", "const", "var", "let", "new", "override",
  "virtual", "async", "await", "get", "set", "init", "class", "interface",
  "record", "struct", "enum", "type", "function", "namespace", "using",
  "import", "export", "from", "extends", "implements", "this", "base",
  // control de flujo
  "return", "throw", "if", "else", "switch", "case", "default", "for",
  "foreach", "while", "do", "break", "continue", "yield", "as", "is",
  "typeof", "keyof", "in", "of", "void",
  // literales
  "true", "false", "null", "undefined",
]);

const BUILTIN_TYPES = new Set([
  "string", "int", "long", "short", "decimal", "double", "float", "bool",
  "boolean", "number", "object", "char", "byte", "any", "unknown", "never",
]);

const TOKEN_RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(`(?:\\.|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s])/g;

// Comandos y palabras clave de shell resaltados en los ejercicios de bash.
const BASH_BUILTINS = new Set([
  // navegacion / archivos
  "ls", "cd", "pwd", "mkdir", "rmdir", "touch", "cp", "mv", "rm", "ln", "cat",
  "less", "more", "head", "tail", "tree", "stat", "file", "basename", "dirname",
  // busqueda / filtros
  "find", "grep", "egrep", "fgrep", "awk", "sed", "cut", "sort", "uniq", "wc",
  "tr", "tee", "xargs", "diff", "comm",
  // permisos / procesos / sistema
  "chmod", "chown", "chgrp", "ps", "kill", "killall", "top", "htop", "lsof",
  "netstat", "ss", "df", "du", "free", "uptime", "nohup", "jobs", "fg", "bg",
  // entorno / red / paquetes
  "export", "alias", "unalias", "echo", "printf", "env", "source", "history",
  "clear", "which", "whereis", "man", "sudo", "curl", "wget", "ssh", "scp",
  "rsync", "tar", "gzip", "zip", "unzip", "apt", "yum", "brew", "systemctl",
  // herramientas dev habituales
  "git", "vim", "vi", "nano", "npm", "npx", "yarn", "pnpm", "node", "python",
  "pip", "make", "docker", "kubectl",
  // palabras clave de shell
  "if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case",
  "esac", "function", "return", "in", "select", "until", "local", "read",
]);

const BASH_TOKEN_RE =
  /(#[^\n]*)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(\$\{[^}]*\}|\$[A-Za-z_]\w*|\$[?#@*!0-9-])|(\b\d[\d_]*\b)|(--?[A-Za-z0-9][\w-]*)|([A-Za-z_][\w-]*)|(\s+)|([^\s])/g;

/** Resaltado especifico para shell: comentarios #, strings, $VARs, flags y comandos. */
function tokenizeBash(text: string, keyBase: string): ReactNode[] {
  if (!text) return [];
  const nodes: ReactNode[] = [];
  let i = 0;
  let m: RegExpExecArray | null;
  BASH_TOKEN_RE.lastIndex = 0;
  while ((m = BASH_TOKEN_RE.exec(text)) !== null) {
    const full = m[0];
    const [, comment, dq, sq, variable, num, flag, ident] = m;
    let cls = "";
    if (comment) cls = "italic text-slate-500";
    else if (dq || sq) cls = "text-amber-300";
    else if (variable) cls = "text-teal-300";
    else if (num || flag) cls = "text-orange-300";
    else if (ident && BASH_BUILTINS.has(ident)) cls = "text-sky-400";
    const key = `${keyBase}-${i++}`;
    nodes.push(
      cls ? (
        <span key={key} className={cls}>
          {full}
        </span>
      ) : (
        <Fragment key={key}>{full}</Fragment>
      ),
    );
  }
  return nodes;
}

export function tokenize(text: string, lang: CodeLang, keyBase: string): ReactNode[] {
  if (lang === "bash") return tokenizeBash(text, keyBase);
  if (!text) return [];
  const nodes: ReactNode[] = [];
  let i = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    const full = m[0];
    const [, lineComment, blockComment, dq, sq, tpl, num, ident] = m;
    let cls = "";
    if (lineComment || blockComment) cls = "italic text-slate-500";
    else if (dq || sq || tpl) cls = "text-amber-300";
    else if (num) cls = "text-orange-300";
    else if (ident && lang !== "tree") {
      if (KEYWORDS.has(ident)) cls = "text-sky-400";
      else if (BUILTIN_TYPES.has(ident) || /^[A-Z]/.test(ident))
        cls = "text-teal-300";
    }
    const key = `${keyBase}-${i++}`;
    nodes.push(
      cls ? (
        <span key={key} className={cls}>
          {full}
        </span>
      ) : (
        <Fragment key={key}>{full}</Fragment>
      ),
    );
  }
  return nodes;
}
