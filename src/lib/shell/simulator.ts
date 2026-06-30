import type { FsNode, ShellResult, ShellState, VimState } from "./types";

// ──────────────────────────────────────────────────────────────────────────
// Simulador de shell: filesystem en memoria + subset de comandos unix/git/vim.
// ──────────────────────────────────────────────────────────────────────────

function splitArgs(input: string): string[] {
  const args: string[] = [];
  let cur = "";
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) {
        args.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) args.push(cur);
  return args;
}

function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const p of parts) {
    if (p === "..") stack.pop();
    else if (p !== ".") stack.push(p);
  }
  return "/" + stack.join("/");
}

function resolvePath(cwd: string, target: string): string {
  if (!target || target === "~") return "/home/dev";
  if (target.startsWith("~/")) return normalizePath("/home/dev/" + target.slice(2));
  if (target.startsWith("/")) return normalizePath(target);
  if (target === "..") return normalizePath(cwd + "/..");
  if (target === ".") return normalizePath(cwd);
  return normalizePath(cwd + "/" + target);
}

function getNode(fs: FsNode, absPath: string): FsNode | null {
  if (absPath === "/") return fs;
  const parts = absPath.split("/").filter(Boolean);
  let node: FsNode = fs;
  for (const part of parts) {
    if (node.type !== "dir") return null;
    const next = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

function getParent(fs: FsNode, absPath: string): { parent: FsNode; name: string } | null {
  const norm = normalizePath(absPath);
  const parts = norm.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const name = parts.pop()!;
  const parentPath = "/" + parts.join("/");
  const parent = getNode(fs, parentPath === "/" ? "/" : parentPath);
  if (!parent || parent.type !== "dir") return null;
  return { parent, name };
}

function ensureDir(fs: FsNode, absPath: string): boolean {
  const parts = normalizePath(absPath).split("/").filter(Boolean);
  let node: FsNode = fs;
  for (const part of parts) {
    if (node.type !== "dir") return false;
    if (!node.children[part]) node.children[part] = { type: "dir", children: {} };
    node = node.children[part];
  }
  return node.type === "dir";
}

function formatLsEntry(name: string, node: FsNode, long: boolean): string {
  if (!long) return name;
  const isDir = node.type === "dir";
  const mode = node.type === "file" ? node.mode ?? "644" : "755";
  const perm =
    isDir
      ? `drwxr-xr-x`
      : mode === "755"
        ? `-rwxr-xr-x`
        : `-rw-r--r--`;
  const size = isDir ? 4096 : node.content.length;
  return `${perm}  1 dev dev ${String(size).padStart(5)} Jun 29 10:00 ${name}`;
}

function listDir(node: FsNode, flags: string): string[] {
  if (node.type !== "dir") return ["ls: not a directory"];
  const showAll = flags.includes("a");
  const long = flags.includes("l");
  const names = Object.keys(node.children).sort();
  const visible = showAll ? [".", "..", ...names] : names.filter((n) => !n.startsWith("."));
  if (long) return visible.map((n) => {
    if (n === "." || n === "..") return formatLsEntry(n, { type: "dir", children: {} }, true);
    return formatLsEntry(n, node.children[n] ?? { type: "file", content: "" }, true);
  });
  return [visible.join("  ")];
}

function expandAliases(input: string, state: ShellState): string {
  const trimmed = input.trim();
  const sp = trimmed.indexOf(" ");
  const cmd = sp === -1 ? trimmed : trimmed.slice(0, sp);
  const rest = sp === -1 ? "" : trimmed.slice(sp + 1);
  const alias = state.aliases[cmd];
  if (!alias) return input;
  return rest ? `${alias} ${rest}` : alias;
}

function readFileContent(state: ShellState, path: string): string | null {
  const node = getNode(state.fs, resolvePath(state.cwd, path));
  if (!node || node.type !== "file") return null;
  return node.content;
}

function runPipeline(state: ShellState, pipeline: string): ShellResult {
  const stages = pipeline.split("|").map((s) => s.trim());
  let stdin = "";
  let cur = state;
  const outputs: string[] = [];

  for (let i = 0; i < stages.length; i++) {
    const isLast = i === stages.length - 1;
    const args = splitArgs(stages[i]);
    const cmd = args[0]?.toLowerCase() ?? "";
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const rest = args.filter((a) => !a.startsWith("-"));

    if (cmd === "cat") {
      const file = rest[0];
      stdin = file ? readFileContent(cur, file) ?? "" : stdin;
    } else if (cmd === "grep") {
      const pattern = rest.find((a) => !a.startsWith("-")) ?? "";
      const ci = flags.includes("i");
      const lines = stdin.split("\n");
      stdin = lines
        .filter((l) => (ci ? l.toLowerCase().includes(pattern.toLowerCase()) : l.includes(pattern)))
        .join("\n");
    } else if (cmd === "sort") {
      const lines = stdin.split("\n").filter((l) => l.length > 0);
      lines.sort();
      stdin = lines.join("\n");
    } else if (cmd === "uniq") {
      const lines = stdin.split("\n");
      const counts = new Map<string, number>();
      for (const l of lines) counts.set(l, (counts.get(l) ?? 0) + 1);
      if (flags.includes("c")) {
        stdin = [...counts.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([k, v]) => `${String(v).padStart(7)} ${k}`)
          .join("\n");
      } else {
        stdin = [...counts.keys()].join("\n");
      }
    } else if (cmd === "awk") {
      const expr = rest[0] ?? "";
      if (expr.includes("$1")) {
        stdin = stdin
          .split("\n")
          .filter(Boolean)
          .map((l) => l.split(/\s+/)[0] ?? "")
          .join("\n");
      }
    } else if (cmd === "head") {
      const n = parseInt(rest.find((a) => /^\d+$/.test(a)) ?? "10", 10);
      stdin = stdin.split("\n").slice(0, n).join("\n");
    } else if (cmd === "tail") {
      const n = parseInt(rest.find((a) => /^\d+$/.test(a)) ?? "10", 10);
      stdin = stdin.split("\n").slice(-n).join("\n");
    } else if (cmd === "wc") {
      const n = stdin.split("\n").filter((l) => l.length > 0).length;
      stdin = flags.includes("l") ? String(n) : `${n} ${n * 10} ${stdin.length}`;
    } else if (cmd === "xargs") {
      const inner = rest.join(" ");
      const pids = stdin.split(/\s+/).filter(Boolean);
      if (inner.startsWith("kill")) {
        outputs.push(`Terminated processes: ${pids.join(", ")}`);
      } else if (inner.startsWith("grep")) {
        // noop passthrough for demo
        outputs.push(stdin);
      } else {
        outputs.push(`xargs: ${inner} ${pids.join(" ")}`);
      }
      stdin = "";
    } else if (cmd === "sed") {
      const m = stages[i].match(/s\/([^/]+)\/([^/]+)\/g/);
      if (m) {
        const from = stages[i].match(/s\/([^/]+)\//)?.[1] ?? "";
        const to = stages[i].match(/s\/[^/]+\/([^/]+)\//)?.[1] ?? "";
        stdin = stdin.split("\n").map((l) => l.split(from).join(to)).join("\n");
      }
    } else {
      outputs.push(`${cmd}: pipe stage not supported in simulation`);
    }

    if (isLast && stdin) outputs.push(stdin);
  }

  return { output: outputs.length ? outputs : [""], state: cur };
}

function runGit(state: ShellState, args: string[]): ShellResult {
  const sub = args[1]?.toLowerCase() ?? "";
  const g = { ...state.git };
  const out: string[] = [];

  switch (sub) {
    case "status":
      out.push(`On branch ${g.branch}`);
      if (g.staged.length) out.push("Changes to be committed:", ...g.staged.map((f) => `  staged:   ${f}`));
      if (g.modified.length) out.push("Changes not staged:", ...g.modified.map((f) => `  modified: ${f}`));
      if (g.untracked.length) out.push("Untracked files:", ...g.untracked.map((f) => `  ${f}`));
      if (!g.staged.length && !g.modified.length && !g.untracked.length) out.push("nothing to commit, working tree clean");
      break;
    case "branch":
      out.push(...g.branches.map((b) => (b === g.branch ? `* ${b}` : `  ${b}`)));
      break;
    case "switch":
    case "checkout": {
      const create = args.includes("-c") || args.includes("-b");
      const name = args[args.length - 1];
      if (create && name) {
        if (!g.branches.includes(name)) g.branches.push(name);
        g.branch = name;
        out.push(`Switched to a new branch '${name}'`);
      } else if (name) {
        g.branch = name;
        out.push(`Switched to branch '${name}'`);
      }
      break;
    }
    case "add": {
      const target = args[2] ?? ".";
      if (target === ".") {
        g.staged.push(...g.modified, ...g.untracked);
        g.modified = [];
        g.untracked = [];
      } else {
        g.staged.push(target);
        g.modified = g.modified.filter((f) => f !== target);
        g.untracked = g.untracked.filter((f) => f !== target);
      }
      out.push("");
      break;
    }
    case "commit":
      g.staged = [];
      g.lastCommits.unshift(`${Math.random().toString(16).slice(2, 9)} ${args.slice(3).join(" ") || "commit"}`);
      out.push(`[${g.branch}] commit created`);
      break;
    case "push":
      out.push(`Enumerating objects... done.\nTo origin/${g.branch}\n   abc..def  ${g.branch} -> ${g.branch}`);
      if (args.includes("-u")) out.unshift(`branch '${g.branch}' set up to track 'origin/${g.branch}'.`);
      break;
    case "fetch":
      out.push("From origin\n * [new branch]      main       -> origin/main");
      break;
    case "pull":
      if (args.includes("--rebase")) out.push("Successfully rebased and updated.");
      else out.push("Already up to date.");
      break;
    case "merge": {
      const branch = args[2];
      if (branch === "feature/x" || branch?.startsWith("feature/")) {
        g.conflictFiles = ["app.js"];
        out.push(`Auto-merging app.js\nCONFLICT (content): Merge conflict in app.js\nAutomatic merge failed; fix conflicts and then commit.`);
      } else {
        out.push(`Merge made by the 'ort' strategy.`);
      }
      break;
    }
    case "stash": {
      const op = args[2]?.toLowerCase();
      if (!op || op === "push" || op === "save") {
        g.stashes.push({ msg: args.slice(3).join(" ") || "WIP" });
        out.push("Saved working directory and index state");
      } else if (op === "list") {
        out.push(...g.stashes.map((s, i) => `stash@{${i}}: ${s.msg}`));
        if (!g.stashes.length) out.push("(empty)");
      } else if (op === "pop") {
        const s = g.stashes.pop();
        out.push(s ? `Dropped stash: ${s.msg}` : "No stash entries found.");
      } else if (op === "apply") {
        out.push(g.stashes.length ? `Applied: ${g.stashes[g.stashes.length - 1].msg}` : "No stash entries found.");
      }
      break;
    }
    case "reset": {
      const hard = args.includes("--hard");
      const soft = args.includes("--soft");
      if (soft) out.push("HEAD~1: commit undone, changes kept staged");
      else if (hard) out.push("HEAD~1: commit undone, changes discarded");
      else out.push("Unstaged changes after reset");
      break;
    }
    case "reflog":
      out.push(...g.lastCommits.map((c, i) => `${c.split(" ")[0]} HEAD@{${i}}: ${c.slice(c.indexOf(" ") + 1)}`));
      break;
    case "cherry-pick":
      out.push(args.includes("--continue") ? "Cherry-pick finished." : `Cherry-pick: applied ${args[2] ?? "commit"}`);
      break;
    case "bisect": {
      const op = args[2]?.toLowerCase();
      if (op === "start") { g.bisectActive = true; out.push("Bisect started"); }
      else if (op === "bad") out.push("Bisect: marked current as bad");
      else if (op === "good") out.push("Bisect: marked as good, ~4 revisions left");
      else if (op === "reset") { g.bisectActive = false; out.push("Bisect reset"); }
      break;
    }
    case "worktree": {
      const op = args[2]?.toLowerCase();
      if (op === "add") { g.worktrees.push(args[3] ?? "../wt"); out.push(`Preparing worktree at ${args[3]}`); }
      else if (op === "list") out.push(...g.worktrees.map((w) => `${w}  ${g.branch}`));
      break;
    }
    case "restore":
      out.push(args.includes("--staged") ? "Unstaged changes" : "Restored working tree");
      break;
    case "rebase":
      out.push(args.includes("-i") ? "Successfully rebased and updated (interactive)." : "Current branch up to date.");
      break;
    default:
      out.push(`git: '${sub}' — subcomando simulado (prueba status, branch, add, merge, stash, reflog)`);
  }

  return { output: out, state: { ...state, git: g } };
}

function runVimCommand(state: ShellState, input: string): ShellResult {
  const vim = state.vim!;
  const out: string[] = [];
  let next: VimState = { ...vim, lines: [...vim.lines] };

  if (vim.mode === "insert") {
    if (input === "\x1b" || input.toLowerCase() === "esc" || input === "<esc>") {
      next.mode = "normal";
      out.push("-- NORMAL --");
    } else {
      next.lines[next.cursorLine] = (next.lines[next.cursorLine] ?? "") + input;
    }
    return { output: out, state: { ...state, vim: next } };
  }

  // normal mode
  const cmd = input.trim();
  if (cmd === "i") {
    next.mode = "insert";
    out.push("-- INSERT --");
  } else if (cmd === "dd") {
    next.lines.splice(next.cursorLine, 1);
    if (!next.lines.length) next.lines = [""];
  } else if (cmd === "yy") {
    out.push(`"${next.lines[next.cursorLine] ?? ""}"`);
  } else if (cmd === "G") {
    next.cursorLine = Math.max(0, next.lines.length - 1);
  } else if (cmd === "gg") {
    next.cursorLine = 0;
  } else if (cmd === "u") {
    out.push("Undone");
  } else if (cmd.startsWith(":")) {
    if (cmd === ":w") out.push(`"${vim.file}" written`);
    else if (cmd === ":wq" || cmd === ":x" || cmd === "zz") {
      return { output: [`"${vim.file}" written`, "Vim exited"], state: { ...state, vim: null } };
    } else if (cmd === ":q!") {
      return { output: ["Changes discarded", "Vim exited"], state: { ...state, vim: null } };
    } else if (cmd.startsWith(":%s/")) {
      const m = cmd.match(/:%s\/([^/]+)\/([^/]+)\/g/);
      if (m) {
        const from = cmd.match(/:%s\/([^/]+)\//)?.[1] ?? "";
        const to = cmd.match(/:%s\/[^/]+\/([^/]+)\//)?.[1] ?? "";
        next.lines = next.lines.map((l) => l.split(from).join(to));
        out.push(`${next.lines.length} substitutions`);
      }
    } else if (cmd.startsWith(":set ")) {
      out.push("number" in cmd ? "line numbers on" : "option set");
    } else out.push(`:${cmd.slice(1)} executed`);
  } else if (cmd.startsWith("/")) {
    out.push(`/${cmd.slice(1)}  found at line ${next.cursorLine + 1}`);
  } else if (cmd === "p") {
    out.push("Pasted line below");
  } else {
    out.push(`Normal mode: '${cmd}'`);
  }

  return { output: out.length ? out : [`-- ${next.lines[next.cursorLine] ?? ""}`], state: { ...state, vim: next } };
}

export function executeCommand(state: ShellState, rawInput: string): ShellResult {
  const input = expandAliases(rawInput.trim(), state);
  if (!input) return { output: [], state };

  if (state.vim) return runVimCommand(state, rawInput.trim());

  if (input.includes("|")) return runPipeline(state, input);

  const args = splitArgs(input);
  const cmd = args[0]?.toLowerCase() ?? "";
  const flags = args.filter((a) => a.startsWith("-")).join("");
  const rest = args.filter((a) => !a.startsWith("-"));

  switch (cmd) {
    case "help":
      return {
        output: [
          "Comandos disponibles (simulados):",
          "  Navegación: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, head, tail",
          "  Búsqueda:   find, grep",
          "  Pipes:      cmd1 | cmd2  (grep, sort, uniq, awk, wc, head, xargs, sed)",
          "  Sistema:    echo, export, alias, chmod, ps, kill, lsof, df, du, jobs",
          "  Git:        git status, branch, switch, add, commit, push, merge, stash...",
          "  Vim:        vim <archivo>  → i, Esc, :wq, :q!, dd, gg, G",
          "  Otros:      clear, history",
        ],
        state,
      };

    case "clear":
      return { output: [], state, clear: true };

    case "history":
      return { output: ["  1  pwd", "  2  ls -la", "  3  cd proyectos"], state };

    case "pwd":
      return { output: [state.cwd], state };

    case "ls": {
      const target = rest[0];
      const path = target ? resolvePath(state.cwd, target) : state.cwd;
      const node = getNode(state.fs, path);
      if (!node) return { output: [`ls: cannot access '${target}': No such file or directory`], state };
      if (node.type === "file") return { output: [target ?? path.split("/").pop() ?? ""], state };
      return { output: listDir(node, flags), state };
    }

    case "cd": {
      const target = rest[0] ?? "/home/dev";
      const path = resolvePath(state.cwd, target);
      const node = getNode(state.fs, path);
      if (!node || node.type !== "dir") return { output: [`cd: ${target}: No such file or directory`], state };
      return { output: [], state: { ...state, cwd: path } };
    }

    case "mkdir": {
      const pFlag = flags.includes("p");
      const name = rest[rest.length - 1];
      if (!name) return { output: ["mkdir: missing operand"], state };
      const path = resolvePath(state.cwd, name);
      if (pFlag) {
        ensureDir(state.fs, path);
        return { output: [], state };
      }
      const parent = getParent(state.fs, path);
      if (!parent) return { output: [`mkdir: cannot create '${name}'`], state };
      if (parent.parent.children[parent.name]) return { output: [`mkdir: '${name}' already exists`], state };
      parent.parent.children[parent.name] = { type: "dir", children: {} };
      return { output: [], state: { ...state, fs: state.fs } };
    }

    case "touch": {
      const name = rest[0];
      if (!name) return { output: ["touch: missing file"], state };
      const path = resolvePath(state.cwd, name);
      const parent = getParent(state.fs, path);
      if (!parent) return { output: [`touch: cannot touch '${name}'`], state };
      if (!parent.parent.children[parent.name]) parent.parent.children[parent.name] = { type: "file", content: "" };
      return { output: [], state: { ...state, fs: state.fs } };
    }

    case "rm": {
      const name = rest[0];
      if (!name) return { output: ["rm: missing operand"], state };
      const path = resolvePath(state.cwd, name);
      const parent = getParent(state.fs, path);
      if (!parent) return { output: [`rm: cannot remove '${name}'`], state };
      delete parent.parent.children[parent.name];
      return { output: [], state: { ...state, fs: state.fs } };
    }

    case "cp":
    case "mv": {
      const [src, dst] = rest;
      if (!src || !dst) return { output: [`${cmd}: missing operand`], state };
      const srcNode = getNode(state.fs, resolvePath(state.cwd, src));
      if (!srcNode) return { output: [`${cmd}: cannot stat '${src}'`], state };
      const dstPath = resolvePath(state.cwd, dst);
      const dstParent = getParent(state.fs, dstPath.endsWith("/") ? dstPath + src : dstPath);
      if (!dstParent) return { output: [`${cmd}: cannot create '${dst}'`], state };
      const dstName = dst.endsWith("/") ? src : dstParent.name;
      const targetParent = dst.endsWith("/") ? getNode(state.fs, resolvePath(state.cwd, dst)) : dstParent.parent;
      if (!targetParent || targetParent.type !== "dir") return { output: [`${cmd}: invalid destination`], state };
      targetParent.children[dstName] = structuredClone(srcNode);
      if (cmd === "mv") {
        const sp = getParent(state.fs, resolvePath(state.cwd, src));
        if (sp) delete sp.parent.children[sp.name];
      }
      return { output: [], state: { ...state, fs: state.fs } };
    }

    case "cat": {
      const content = rest.map((f) => readFileContent(state, f)).filter((c) => c !== null) as string[];
      if (!content.length) return { output: [`cat: ${rest[0]}: No such file`], state };
      return { output: content, state };
    }

    case "head": {
      const nArg = rest.find((a) => /^\d+$/.test(a));
      const n = parseInt(nArg ?? (flags.replace(/\D/g, "") || "10"), 10);
      const file = rest.find((a) => !/^-/.test(a) && !/^\d+$/.test(a)) ?? rest[rest.length - 1];
      const c = readFileContent(state, file);
      if (!c) return { output: [`head: ${file}: No such file`], state };
      return { output: [c.split("\n").slice(0, n).join("\n")], state };
    }

    case "tail": {
      const n = parseInt(rest.find((a) => /^\d+$/.test(a)) ?? "10", 10);
      const file = rest.find((a) => !/^-/.test(a) && !/^\d+$/.test(a)) ?? rest[0];
      const c = readFileContent(state, file);
      if (!c) return { output: [`tail: ${file}: No such file`], state };
      if (flags.includes("f")) return { output: [c.split("\n").slice(-n).join("\n"), "[streaming... Ctrl+C to stop]"], state };
      return { output: [c.split("\n").slice(-n).join("\n")], state };
    }

    case "echo": {
      let text = rawInput.slice(5);
      for (const [k, v] of Object.entries(state.env)) {
        text = text.replaceAll(`$${k}`, v);
      }
      return { output: [text], state };
    }

    case "export": {
      const eq = rawInput.indexOf("=");
      if (eq > 7) {
        const key = rawInput.slice(7, eq);
        const val = rawInput.slice(eq + 1);
        return { output: [], state: { ...state, env: { ...state.env, [key]: val } } };
      }
      return { output: ["export: invalid syntax"], state };
    }

    case "alias": {
      const m = rawInput.match(/^alias\s+(\w+)="([^"]+)"/);
      if (m) return { output: [], state: { ...state, aliases: { ...state.aliases, [m[1]]: m[2] } } };
      return { output: Object.entries(state.aliases).map(([k, v]) => `alias ${k}='${v}'`), state };
    }

    case "find": {
      const out: string[] = [];
      const nameFlag = args.indexOf("-name");
      const pattern = nameFlag >= 0 ? args[nameFlag + 1]?.replace(/^"|"$/g, "") : "*";
      function walk(path: string, node: FsNode) {
        const base = path.split("/").pop() ?? "";
        const glob = pattern.replace(/\*/g, ".*");
        if (node.type === "file" && new RegExp(`^${glob}$`).test(base)) out.push(path);
        if (node.type === "dir") {
          if (args.includes("-type") && args[args.indexOf("-type") + 1] === "d" && path !== "/") {
            if (new RegExp(`^${glob}$`).test(base)) out.push(path);
          }
          for (const [k, v] of Object.entries(node.children)) walk(`${path}/${k}`.replace("//", "/"), v);
        }
      }
      walk(state.cwd, getNode(state.fs, state.cwd) ?? state.fs);
      return { output: out.length ? out : ["find: no matches"], state };
    }

    case "grep": {
      const pattern = rest.find((a) => !a.startsWith("-") && a !== ".") ?? "";
      const file = rest.filter((a) => !a.startsWith("-") && a !== pattern).pop();
      const ci = flags.includes("i");
      const lines: string[] = [];
      if (file && file !== ".") {
        const c = readFileContent(state, file);
        if (c) c.split("\n").forEach((l, i) => {
          if (ci ? l.toLowerCase().includes(pattern.toLowerCase()) : l.includes(pattern))
            lines.push(flags.includes("n") ? `${i + 1}:${l}` : l);
        });
      }
      return { output: lines.length ? lines : [`grep: no matches for '${pattern}'`], state };
    }

    case "chmod":
      return { output: [`mode changed on ${rest[0] ?? "file"}`], state };

    case "chown":
      return { output: [`ownership changed on ${rest[rest.length - 1] ?? "file"}`], state };

    case "ps":
      return {
        output: flags.includes("aux") || flags === "aux"
          ? ["USER  PID  CMD", "dev  4521 node server.js", "dev  8890 bash", "dev  9012 npm run dev"]
          : ["  PID TTY      CMD", " 4521 pts/0    node"],
        state,
      };

    case "kill":
      return { output: [`Process ${rest[0] ?? ""} terminated${flags.includes("9") ? " (SIGKILL)" : ""}`], state };

    case "lsof":
      return {
        output: rest.some((r) => r.includes(":3000"))
          ? ["COMMAND  PID USER  NAME", "node    4521 dev  TCP *:3000 (LISTEN)"]
          : ["lsof: no matching processes"],
        state,
      };

    case "df":
      return { output: ["Filesystem  Size  Used Avail Use% Mounted on", "/dev/sda1   50G   12G   35G  26% /"], state };

    case "du":
      return { output: [`${flags.includes("h") ? "1.2M" : "1200"}  .`], state };

    case "jobs":
      return { output: state.jobs.map((j) => `[${j.id}] Running  ${j.cmd}`), state };

    case "nohup":
      return { output: [`nohup: ${rest.join(" ")} &  [1] ${state.nextJobId}`, "appending output to nohup.out"], state };

    case "git":
      return runGit(state, args);

    case "vim":
    case "vi": {
      const file = rest[0] ?? "untitled";
      const content = readFileContent(state, file)?.split("\n") ?? [""];
      return {
        output: [`Vim — ${file}  (${content.length} lines)`, "-- NORMAL --", "Pista: i (insertar), Esc, :wq (guardar y salir), :q! (salir sin guardar)"],
        state: { ...state, vim: { file, lines: content, mode: "normal", cursorLine: 0 } },
      };
    }

    default:
      if (rawInput.endsWith("&")) {
        const job = { id: state.nextJobId, cmd: rawInput.slice(0, -1).trim() };
        return {
          output: [`[${job.id}] ${job.id}`, job.cmd],
          state: { ...state, jobs: [...state.jobs, job], nextJobId: state.nextJobId + 1 },
        };
      }
      return { output: [`${cmd}: command not found (escribe 'help')`], state };
  }
}

export function promptFor(state: ShellState): string {
  if (state.vim) {
    const mode = state.vim.mode === "insert" ? "INSERT" : "NORMAL";
    return `[${mode}] ${state.vim.file}> `;
  }
  const short = state.cwd.replace(/^\/home\/dev/, "~");
  return `dev@${short}$ `;
}
