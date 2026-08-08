import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' });
    return output.split('\n').map((f) => f.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isDataStringLine(line) {
  const dataKeys = [
    'codeSnippet:',
    'completeCode:',
    'explanationText:',
    'description:',
    'theory:',
    'objective:',
    'tags:',
  ];
  if (dataKeys.some((key) => line.includes(key))) {
    return true;
  }

  // Check if console call is wrapped inside string quotes on property assignments
  const stringLiteralProperty = /^["'\w\s_-]+:\s*[`"'].*console\.(log|info|debug|dir|trace|table|warn|error).*[`"']/;
  if (stringLiteralProperty.test(line.trim())) {
    return true;
  }

  return false;
}

function checkFileForConsole(filePath, content) {
  const issues = [];
  const lines = content.split(/\r?\n/);
  let inBlockComment = false;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    let trimmed = line.trim();

    if (inBlockComment) {
      if (trimmed.includes('*/')) {
        inBlockComment = false;
        trimmed = trimmed.substring(trimmed.indexOf('*/') + 2).trim();
      } else {
        return;
      }
    }

    if (trimmed.includes('/*') && !trimmed.includes('*/')) {
      inBlockComment = true;
      trimmed = trimmed.substring(0, trimmed.indexOf('/*')).trim();
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

    if (/\bdebugger\b/.test(trimmed) && !isDataStringLine(trimmed)) {
      issues.push({ line: lineNum, method: 'debugger', code: trimmed });
      return;
    }

    const consoleMatch = trimmed.match(/(?<!['"`\w])console\.(log|info|debug|dir|trace|table|warn|error)\s*\(/);
    if (consoleMatch) {
      const methodName = `console.${consoleMatch[1]}`;
      if (!isDataStringLine(trimmed)) {
        issues.push({ line: lineNum, method: methodName, code: trimmed });
      }
    }
  });

  return issues;
}

function main() {
  const stagedFiles = getStagedFiles();

  // If arguments were passed directly, use them, otherwise check staged files or all src files if requested
  const isExplicitRun = process.argv.includes('--all');
  const filesToCheck = isExplicitRun
    ? getAllSourceFiles()
    : stagedFiles.length > 0
      ? stagedFiles
      : process.argv.slice(2);

  const relevantExtensions = ['.js', '.jsx', '.ts', '.tsx', '.astro', '.mjs', '.cjs'];
  const targets = filesToCheck.filter(
    (file) => relevantExtensions.some((ext) => file.endsWith(ext)) && existsSync(file)
  );

  if (targets.length === 0) {
    console.log(`${GREEN} Security Check: No hay archivos JS/TS/Astro modificados para validar.${RESET}`);
    process.exit(0);
  }

  console.log(`${CYAN} Validando seguridad (sin console.log / impresiones en consola) en ${targets.length} archivo(s)...${RESET}`);

  let hasErrors = false;

  for (const filePath of targets) {
    const content = readFileSync(filePath, 'utf-8');
    const issues = checkFileForConsole(filePath, content);

    if (issues.length > 0) {
      hasErrors = true;
      console.log(`\n${RED}${BOLD} ERROR DE SEGURIDAD EN:${RESET} ${YELLOW}${filePath}${RESET}`);
      issues.forEach((issue) => {
        console.log(`   └─ Línea ${issue.line}: Se detectó ${RED}${BOLD}${issue.method}()${RESET}`);
        console.log(`      ${CYAN}Código:${RESET} ${issue.code}`);
      });
    }
  }

  if (hasErrors) {
    console.log(`\n${RED}${BOLD}========================================================================${RESET}`);
    console.log(`${RED}${BOLD} COMMIT RECHAZADO:${RESET} Se detectaron llamadas activas a la consola.`);
    console.log(`${YELLOW} Por seguridad y mejores prácticas, elimina los console.log antes de hacer commit.${RESET}`);
    console.log(`${RED}${BOLD}========================================================================${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}✔ Validaciones nativas superadas con éxito: Código limpio de console.log.${RESET}`);
    process.exit(0);
  }
}

function getAllSourceFiles() {
  try {
    const output = execSync('git ls-files "src/*.js" "src/*.ts" "src/*.jsx" "src/*.tsx" "src/*.astro"', { encoding: 'utf-8' });
    return output
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
      .filter((f) => !f.startsWith('src/data/'));
  } catch {
    return [];
  }
}

main();
