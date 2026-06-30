import type { Exercise, ShellScenario } from "@/lib/types";
import { presetForCategory, welcomeForPreset } from "./presets";

// ──────────────────────────────────────────────────────────────────────────
// Teoría y metadatos para ejercicios Bash (tab Teoría + escenario terminal).
// ──────────────────────────────────────────────────────────────────────────

const CATEGORY_THEORY: Record<string, string> = {
  NAVEGACION: `## Navegación y archivos
La terminal trabaja con **rutas** (carpetas anidadas). Siempre estás "dentro" de una carpeta: es tu **directorio actual**.

| Comando | Qué hace | Ejemplo |
| pwd | Muestra dónde estás | \`pwd\` → /home/dev |
| ls | Lista archivos | \`ls\`, \`ls -la\` |
| cd | Cambia de carpeta | \`cd proyectos\`, \`cd ..\` |
| mkdir | Crea carpeta | \`mkdir src\`, \`mkdir -p a/b/c\` |
| touch | Crea archivo vacío | \`touch index.js\` |
| rm | Borra archivo | \`rm file\`, \`rm -rf dir\` |
| cp / mv | Copia / mueve | \`cp a b\`, \`mv old new\` |
| cat | Muestra contenido | \`cat README.md\` |
| head / tail | Inicio / final | \`head -n 20 f\`, \`tail -f log\` |

### Flags útiles de ls
- \`-l\` → listado largo (permisos, tamaño, fecha)
- \`-a\` → incluye ocultos (empiezan con \`.\`)
- \`-h\` → tamaños legibles (K, M, G). Combina: \`ls -lah\`

### Rutas especiales
- \`..\` → carpeta padre (subir un nivel)
- \`~\` o \`/home/dev\` → tu home
- \`.\` → carpeta actual`,

  BUSQUEDA: `## Búsqueda: find y grep
Dos herramientas distintas: **find** busca **archivos por nombre**; **grep** busca **texto dentro** de archivos.

### find
\`\`\`
find <desde> -name "<patrón>"
find . -type f -name "*.log"
find . -mtime -1          # modificados hace <1 día
find . -size +100m        # archivos >100 MB
find . -name "*.tmp" -delete
\`\`\`
- \`.\` = desde la carpeta actual
- \`*\` = comodín (cualquier texto)
- \`-type f\` = solo archivos (d = directorios)

### grep
\`\`\`
grep "texto" archivo.txt
grep -i "error" app.log       # ignora mayúsculas
grep -n "import" main.ts      # muestra número de línea
grep -r "TODO" .              # recursivo en todo el proyecto
grep -rl "API_KEY" .          # solo nombres de archivo
grep -r --include="*.ts" "x" .
\`\`\``,

  PIPES: `## Pipes y filtros
El carácter **|** (pipe) conecta comandos: la **salida** del izquierdo entra al **derecho**.

\`\`\`
comando1 | comando2 | comando3
\`\`\`

| Comando | Función |
| sort | Ordena líneas alfabéticamente |
| uniq | Elimina duplicados **consecutivos** (¡usa sort antes!) |
| uniq -c | Cuenta repeticiones |
| cut -d: -f1 | Extrae columna 1 con separador \`:\` |
| awk '{print $1}' | Imprime la 1ª columna (espacios) |
| sed 's/viejo/nuevo/g' | Sustituye texto (g = todas) |
| sed -i 's/a/b/g' f | Edita el archivo in-place |
| xargs | Convierte líneas en argumentos del siguiente cmd |
| wc -l | Cuenta líneas |

### Receta clásica (ranking)
\`\`\`
sort archivo | uniq -c | sort -rn | head -5
\`\`\``,

  PERMISOS: `## Permisos: chmod y chown
Cada archivo tiene **permisos** (quién puede leer, escribir, ejecutar).

### chmod (cambiar permisos)
\`\`\`
chmod +x script.sh     # añade ejecución
chmod 755 script.sh    # rwxr-xr-x (dueño todo, resto lee+ejecuta)
chmod 644 config.env   # rw-r--r-- (dueño lee+escribe, resto solo lee)
\`\`\`

### chown (cambiar dueño)
\`\`\`
chown deploy app.conf
chown deploy:www-data app.conf
ls -l app.conf         # ver permisos y dueño
\`\`\``,

  PROCESOS: `## Procesos y sistema
| Comando | Qué hace |
| ps aux | Lista todos los procesos |
| kill PID | Termina proceso (elegante) |
| kill -9 PID | Fuerza cierre (SIGKILL) |
| lsof -i :3000 | ¿Quién usa el puerto 3000? |
| df -h | Espacio libre en disco |
| du -sh . | Tamaño de la carpeta actual |
| cmd & | Ejecuta en segundo plano |
| jobs | Lista trabajos en background |
| fg %1 | Trae trabajo 1 al frente |
| nohup cmd & | Sigue vivo al cerrar terminal |`,

  ENTORNO: `## Variables de entorno y alias
Los programas leen **variables de entorno** para configurarse.

\`\`\`
export NODE_ENV=production    # define variable
echo $NODE_ENV                # lee variable ($ obligatorio)
export PATH=$PATH:/usr/local/bin   # añade al PATH existente
alias gs="git status"           # atajo permanente
\`\`\`

- \`export\` hace que la variable exista para procesos hijos
- \`$VAR\` expande el valor al escribir \`echo\`
- \`alias\` crea atajos; se guardan en \`~/.bashrc\``,

  VIM: `## Vim: supervivencia
Vim **no es un editor normal**: tiene **modos**. Al abrir, estás en **NORMAL** (teclas = comandos).

### Modos
- **NORMAL** → comandos de navegación/edición
- **INSERT** (\`i\`) → escribes texto
- **COMANDO** (\`:\`) → guardar, salir, buscar/reemplazar

### Comandos esenciales
| Tecla | Acción |
| i | Modo inserción |
| Esc | Volver a normal |
| :w | Guardar |
| :wq o :x | Guardar y salir |
| :q! | Salir SIN guardar |
| u | Deshacer |
| dd | Borrar línea |
| yy | Copiar línea |
| p | Pegar |
| gg | Ir al inicio |
| G | Ir al final |
| /texto | Buscar |
| :%s/viejo/nuevo/g | Reemplazar todo |

**Regla de oro:** si algo raro pasa → \`Esc\` → respira.`,

  "GIT RAMAS": `## Git: ramas y flujo diario
Git guarda **snapshots** (commits) en una **rama** (línea de historia).

### Ramas
\`\`\`
git branch                    # listar ramas (* = actual)
git switch -c feature/x       # crear y cambiar (moderno)
git checkout -b feature/x     # equivalente clásico
git switch main               # volver a main
\`\`\`

### Ciclo diario
\`\`\`
git status          # ¿qué cambió?
git add .           # preparar todo (. = cwd)
git commit -m "msg" # confirmar snapshot
git push -u origin feature/x   # subir (1ª vez: -u)
\`\`\`

### Sincronizar
\`\`\`
git fetch           # descarga SIN fusionar
git pull            # fetch + merge
git merge main      # fusionar main en tu rama
git pull --rebase origin main   # historial lineal
\`\`\``,

  "GIT CONFLICTOS": `## Git: conflictos y stash

### Resolver conflictos
Cuando dos ramas editan la **misma línea**, git marca el archivo:
\`\`\`
<<<<<<< HEAD
tu versión
=======
otra versión
>>>>>>> feature/x
\`\`\`
1. Edita el archivo (deja el código final)
2. **Borra** los marcadores \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`
3. \`git add archivo\` → marcas como resuelto
4. \`git commit\` → confirmas la fusión
5. \`git merge --abort\` → cancelar si te agobias

### stash (aparcar cambios)
\`\`\`
git stash                      # guardar cambios sin commit
git stash push -m "wip: form"   # con mensaje
git stash list                 # ver la pila
git stash pop                  # recuperar y eliminar
git stash apply                # recuperar sin eliminar
\`\`\``,

  "GIT PRO": `## Git avanzado

### reset y reflog
\`\`\`
git reset --soft HEAD~1    # deshace commit, cambios en staging
git reset --hard HEAD~1    # deshace commit Y borra cambios
git reflog                 # historial de movimientos de HEAD
git reset --hard <hash>    # recuperar commit "perdido"
\`\`\`

### cherry-pick, bisect, worktree
\`\`\`
git cherry-pick <hash>         # traer 1 commit de otra rama
git cherry-pick -n <hash>      # sin crear commit
git cherry-pick --continue     # tras resolver conflicto

git bisect start / bad / good v1.0.0 / reset

git worktree add ../hotfix main
git worktree list

git restore app.js             # descartar cambios
git restore --staged app.js    # unstage
\`\`\``,

  INTEGRADOR: `## Ejercicios integradores
Aquí combinas **varios comandos en una tubería** o un **flujo git completo**. No hay comando nuevo: es practicar lo aprendido en cadena.

### Patrones que debes reconocer
1. **Análisis de logs:** \`awk → sort → uniq -c → sort -rn → head\`
2. **Puerto ocupado:** \`lsof -i :PORT -t | xargs kill -9\`
3. **Refactor masivo:** \`grep -rl "x" --include="*.ts" . | xargs sed -i 's/a/b/g'\`
4. **Feature completa:** \`switch -c → add → commit → push -u → pull → resolver → add → rebase -i\`

Usa la **terminal simulada** para probar cada parte antes de rellenar los huecos.`,
};

/** Pista concreta por ejercicio (sin dar todas las respuestas literales). */
const EXERCISE_HINTS: Record<number, string> = {
  1: "### Pista\nRellena el **nombre del comando** en cada línea. La 1ª pregunta es \"¿dónde estoy?\" → comando de **print working directory**. La 2ª lista archivos. La 3ª es el nombre de la carpeta (sin `cd`). La 4ª sube un nivel con `..`.",
  2: "### Pista\nSolo flags de **ls**: `-l` (largo), `-a` (all/ocultos), combina las tres en la última (`-l`, `-a`, `-h` en cualquier orden).",
  3: "### Pista\nTres comandos distintos: crear carpeta, crear archivo vacío, borrar archivo.",
  4: "### Pista\n`cp` copia, `mv` mueve/renombra. El último hueco es el **nombre nuevo** del archivo.",
  5: "### Pista\nFlags: `-p` (crea padres), `-r` (recursivo al copiar), `-rf` o `-r -f` (borrar carpeta entera).",
  6: "### Pista\n`cat` muestra todo; `head -n` primeras líneas; `tail` últimas; `tail -f` sigue en vivo.",
  7: "### Pista\n`find` usa `-name` para patrones; `*.log` con comodín; `-type f` = file.",
  8: "### Pista\n`-mtime -1` (menos de 1 día), `+100m` (más de 100 MB), acción `-delete`.",
  9: "### Pista\n`grep` + archivo; flag `-i` (ignore case); `-n` (line number).",
  10: "### Pista\n`-r` recursivo; `.` = directorio actual; `--include=\"*.ts\"` filtra extensión.",
  11: "### Pista\nLos tres huecos son el **pipe** `|` entre comandos.",
  12: "### Pista\nPipeline: `sort | uniq | uniq -c | sort -rn`.",
  13: "### Pista\n`cut -d` (delimiter), awk imprime `$1`, awk `-F','` separador coma.",
  14: "### Pista\nsed `s/foo/bar/` reemplazo; `g` global; `-i` in-place.",
  15: "### Pista\n`xargs` pasa la salida como argumentos; `-0` para nombres con espacios.",
  16: "### Pista\n`chmod +x`, modo numérico `755` y `644`.",
  17: "### Pista\nUsuario `deploy`, formato `usuario:grupo`, `ls -l` para ver permisos.",
  18: "### Pista\n`ps aux`, grep del proceso `node`, `kill PID`, `kill -9` forzado.",
  19: "### Pista\n`lsof -i`, `df -h`, `du -sh` (orden de flags flexible en du).",
  20: "### Pista\n`&` background, `jobs`, `fg %1`, `nohup`.",
  21: "### Pista\n`export`, `$NODE_ENV`, ruta `/usr/local`, comando `alias`.",
  22: "### Pista\nModos vim: `i`, `Esc`, `:w`, `:wq` (o `:x` / `zz`).",
  23: "### Pista\n`:q!` salir forzado, `u` undo, `Ctrl-r` redo.",
  24: "### Pista\n`G` final, `gg` inicio, `dd` borrar línea, `yy` yank.",
  25: "### Pista\n`/` buscar, `:%s/v1/v2/g` reemplazar, `:set number` o `:set nu`.",
  26: "### Pista\n`git branch`, `switch -c`, `checkout -b`, volver a `main`.",
  27: "### Pista\n`status`, `add .`, `commit -m`, `push -u`.",
  28: "### Pista\n`fetch`, `pull`, merge `main`, `pull --rebase`.",
  29: "### Pista\nMarcadores de conflicto: `<<<<<<<`, `=======`, `>>>>>>>`, luego `git add`.",
  30: "### Pista\n`stash push/save`, `list`, `pop`.",
  31: "### Pista\n`reset --soft`, `--hard`, `reflog`, hash del commit.",
  32: "### Pista\nHash del commit, `-n`/`--no-commit`, `--continue`.",
  33: "### Pista\n`bisect start`, `bad`, `good`, `reset`.",
  34: "### Pista\n`worktree add`, `list`, `restore`, `--staged`.",
  35: "### Pista\nPipe `|`, `uniq -c`, `sort -rn`, `head -5`.",
  36: "### Pista\n`lsof -i`, `xargs`, `kill -9`.",
  37: "### Pista\n`grep -rl`, `xargs`, `sed -i`.",
  38: "### Pista\n`switch -c`, `push -u`, `add` tras resolver, `rebase -i`.",
};

export function buildBashTheory(exercise: Exercise): string {
  const base = CATEGORY_THEORY[exercise.category] ?? "";
  const hint = EXERCISE_HINTS[exercise.id] ?? "";
  const existing = exercise.theory?.trim();
  // Conserva teoría inline (vim/conflictos) y añade categoría + pista.
  const parts = [base, existing, hint].filter(Boolean);
  return parts.join("\n\n");
}

export function buildBashSimulation(exercise: Exercise): ShellScenario {
  const preset = presetForCategory(exercise.category, exercise.id);
  return {
    preset,
    cwd: "/home/dev",
    welcome: welcomeForPreset(preset),
  };
}

export function enrichBashExercise(exercise: Exercise): Exercise {
  return {
    ...exercise,
    theory: buildBashTheory(exercise),
    simulation: buildBashSimulation(exercise),
  };
}

export function enrichBashExercises(exercises: Exercise[]): Exercise[] {
  return exercises.map(enrichBashExercise);
}
