import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ExpectedAnswer } from "@/lib/answers";
import { primaryAnswer } from "@/lib/answers";

interface Props {
  codeSnippet: string;
  inputs: Record<string, ExpectedAnswer>;
  userAnswers: Record<string, string>;
  /** Huecos marcados como incorrectos tras la ultima verificacion. */
  incorrectKeys?: Set<string>;
  fileName?: string;
  onAnswerChange: (key: string, value: string) => void;
  onVerify: () => void;
}

const SPLIT_RE = /\[INPUT_(\d+)\]/g;

// ──────────────────────────────────────────────────────────────────────────
// Resaltado de sintaxis ligero (respeta los inputs inline del ejercicio).
// ──────────────────────────────────────────────────────────────────────────
type Lang = "csharp" | "typescript" | "css" | "tree" | "bash";

function detectLang(fileName?: string): Lang {
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

function tokenize(text: string, lang: Lang, keyBase: string): ReactNode[] {
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

/** Clasifica una línea de un árbol de carpetas (folder / file / none). */
function lineKind(reconstructed: string): "folder" | "file" | "none" {
  const noComment = reconstructed.replace(/\/\/.*$/, "").trimEnd();
  if (!noComment.trim()) return "none";
  if (noComment.endsWith("/")) return "folder";
  if (/\.[A-Za-z0-9]+$/.test(noComment)) return "file";
  return "none";
}

/** Input inline que crece según el texto escrito (medido con un span espejo). */
function InlineAnswerInput({
  value,
  expected,
  placeholder,
  filled,
  invalid,
  onChange,
  onVerify,
  ariaLabel,
}: {
  value: string;
  expected: string;
  placeholder: string;
  filled: boolean;
  invalid: boolean;
  onChange: (v: string) => void;
  onVerify: () => void;
  ariaLabel: string;
}) {
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);

  const measureText = value.length > 0 ? value : expected || placeholder;

  useLayoutEffect(() => {
    const el = mirrorRef.current;
    if (!el) return;
    setWidthPx(el.offsetWidth + 12);
  }, [measureText]);

  const minPx = Math.max(expected.length, value.length, 4) * 7.5 + 20;

  return (
    <span className="relative inline-block max-w-full align-baseline">
      <span
        ref={mirrorRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre px-1.5 font-mono text-[11px] md:text-xs"
      >
        {measureText}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onVerify();
        }}
        style={{
          width: widthPx ? `${Math.max(widthPx, minPx)}px` : `${minPx}px`,
          maxWidth: "100%",
        }}
        className={`box-border inline-block overflow-x-auto rounded-md border px-1.5 py-0.5 align-baseline font-mono text-[11px] caret-brand transition-[width,border-color,background-color] focus:outline-none focus:ring-2 md:text-xs ${
          invalid
            ? "border-rose-500/70 bg-rose-500/10 text-rose-300 focus:border-rose-500 focus:ring-rose-500/30"
            : filled
              ? "border-brand/40 bg-brand/10 text-brand focus:border-brand focus:ring-brand/30"
              : "border-line bg-[#1a1a1c] text-ink focus:border-brand focus:ring-brand/30"
        }`}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={invalid}
        aria-label={ariaLabel}
      />
    </span>
  );
}

export default function ChallengeCode({
  codeSnippet,
  inputs,
  userAnswers,
  incorrectKeys,
  fileName,
  onAnswerChange,
  onVerify,
}: Props) {
  const lang = detectLang(fileName);
  const tree = lang === "tree";
  const lines = codeSnippet.split("\n");

  function renderInput(num: string, lineIdx: number) {
    const key = `INPUT_${num}`;
    const expected = primaryAnswer(inputs[key] ?? "");
    const value = userAnswers[key] ?? "";
    return (
      <InlineAnswerInput
        key={`l${lineIdx}-in${num}`}
        value={value}
        expected={expected}
        placeholder={`#${num}`}
        filled={value.trim().length > 0}
        invalid={incorrectKeys?.has(key) ?? false}
        onChange={(v) => onAnswerChange(key, v)}
        onVerify={onVerify}
        ariaLabel={`Espacio ${num}`}
      />
    );
  }

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4] md:text-xs">
      <code>
        {lines.map((line, lineIdx) => {
          const segs = line.split(SPLIT_RE);
          // Reconstrucción (inputs -> 'x') para clasificar la línea del árbol.
          const reconstructed = segs
            .map((s, i) => (i % 2 === 1 ? "x" : s))
            .join("");
          const kind = tree ? lineKind(reconstructed) : "none";
          const icon =
            kind === "folder" ? "📁" : kind === "file" ? "📄" : null;

          let iconPlaced = false;
          const lineNodes: ReactNode[] = [];

          segs.forEach((seg, i) => {
            if (i % 2 === 1) {
              lineNodes.push(renderInput(seg, lineIdx));
              return;
            }
            // Colocar el icono tras la indentación del primer segmento de texto.
            if (icon && !iconPlaced) {
              const mt = seg.match(/^(\s*)([\s\S]*)$/);
              const indent = mt?.[1] ?? "";
              const rest = mt?.[2] ?? seg;
              if (indent)
                lineNodes.push(
                  <Fragment key={`l${lineIdx}-ind`}>{indent}</Fragment>,
                );
              lineNodes.push(
                <span
                  key={`l${lineIdx}-icon`}
                  className="mr-1 select-none"
                  aria-hidden
                >
                  {icon}
                </span>,
              );
              iconPlaced = true;
              lineNodes.push(...tokenize(rest, lang, `l${lineIdx}-s${i}`));
            } else {
              lineNodes.push(...tokenize(seg, lang, `l${lineIdx}-s${i}`));
            }
          });

          return (
            <Fragment key={`line-${lineIdx}`}>
              {lineNodes}
              {lineIdx < lines.length - 1 ? "\n" : null}
            </Fragment>
          );
        })}
      </code>
    </pre>
  );
}
