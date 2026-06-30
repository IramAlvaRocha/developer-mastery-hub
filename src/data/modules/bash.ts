import type { Exercise } from "@/lib/types";
import { enrichBashExercises } from "@/lib/shell/bashMeta";

// ──────────────────────────────────────────────────────────────────────────
// Bash & Terminal
// Progresion didactica: cada bloque empieza con ejercicios basicos y repite el
// mismo tema con ligeras variaciones para fijar el conocimiento; la dificultad
// (stars) sube de forma gradual y al final hay ejercicios INTEGRADORES que
// combinan comandos aprendidos para ver como funcionan en conjunto.
//   1-6   Navegacion y archivos      (★1-2)
//   7-10  Busqueda: find / grep      (★2-3)
//   11-15 Pipes y filtros            (★2-4)
//   16-21 Permisos, procesos, entorno(★2-3)
//   22-25 Vim survival               (★1-3)
//   26-30 Git: ramas, sync, conflict (★2-3)
//   31-34 Git poco conocidos         (★4-5)
//   35-38 Integradores               (★4-5)
// ──────────────────────────────────────────────────────────────────────────

const BASH_EXERCISES_RAW: Exercise[] = [
  // ─── NAVEGACION Y ARCHIVOS ────────────────────────────────────────────────
  {
    id: 1, title: "Orientarte: pwd, ls y cd", stars: 1, category: "NAVEGACION",
    description: "Los 3 comandos que usas cada minuto: saber dónde estás, ver qué hay y moverte.",
    objective: "moverte por el sistema de archivos",
    tags: ["pwd", "ls", "cd"],
    fileName: "terminal", completed: false,
    explanationText: "La terminal es como explorar una casa a oscuras: pwd te dice en qué cuarto estás, ls enciende la luz para ver qué hay, y cd es caminar a otra habitación.",
    codeSnippet:
`# ¿En qué carpeta estoy?
[INPUT_1]

# Listar el contenido del directorio actual
[INPUT_2]

# Entrar a la carpeta "proyectos"
cd [INPUT_3]

# Subir un nivel (a la carpeta padre)
cd [INPUT_4]`,
    inputs: { INPUT_1: "pwd", INPUT_2: "ls", INPUT_3: "proyectos", INPUT_4: ".." },
    completeCode: "pwd | ls | cd proyectos | cd ..",
  },
  {
    id: 2, title: "ls a fondo: -l, -a, -h", stars: 1, category: "NAVEGACION",
    description: "El mismo ls pero con flags. Repetir ls con distintas banderas es la mejor forma de memorizarlas.",
    objective: "leer detalles de los archivos con ls",
    tags: ["ls", "flags", "hidden"],
    fileName: "terminal", completed: false,
    explanationText: "Las flags son como lentes intercambiables sobre la misma cámara: -l añade detalle, -a revela lo oculto, -h traduce los tamaños a algo humano.",
    codeSnippet:
`# Listado largo: permisos, dueño, tamaño y fecha
ls [INPUT_1]

# Incluir archivos ocultos (los que empiezan con punto)
ls [INPUT_2]

# Combinar: listado largo + ocultos + tamaños legibles
ls [INPUT_3]`,
    inputs: {
      INPUT_1: "-l",
      INPUT_2: ["-a", "--all"],
      INPUT_3: ["-lah", "-alh", "-lha", "-ahl", "-hal", "-hla"],
    },
    completeCode: "ls -l | ls -a | ls -lah",
  },
  {
    id: 3, title: "Crear y borrar: mkdir, touch, rm", stars: 1, category: "NAVEGACION",
    description: "Crear carpetas y archivos vacíos, y eliminarlos. La base de todo trabajo en disco.",
    objective: "crear y eliminar archivos y carpetas",
    tags: ["mkdir", "touch", "rm"],
    fileName: "terminal", completed: false,
    explanationText: "mkdir es construir un cajón, touch es meter una hoja en blanco, rm es la trituradora: en la terminal no hay papelera de reciclaje, lo borrado se va para siempre.",
    codeSnippet:
`# Crear la carpeta "src"
[INPUT_1] src

# Crear un archivo vacío index.js
[INPUT_2] index.js

# Borrar el archivo index.js
[INPUT_3] index.js

# Borrar la carpeta "src" (estando vacía)
rmdir src`,
    inputs: { INPUT_1: "mkdir", INPUT_2: "touch", INPUT_3: "rm" },
    completeCode: "mkdir src | touch index.js | rm index.js | rmdir src",
  },
  {
    id: 4, title: "Copiar y mover: cp, mv", stars: 1, category: "NAVEGACION",
    description: "Copiar, mover y renombrar. Ojo: en bash renombrar y mover son el mismo comando (mv).",
    objective: "copiar, mover y renombrar archivos",
    tags: ["cp", "mv", "rename"],
    fileName: "terminal", completed: false,
    explanationText: "cp es una fotocopia (quedan dos), mv es trasladar el original (queda uno). Renombrar es simplemente mover algo... a sí mismo con otro nombre.",
    codeSnippet:
`# Copiar config.json a config.backup.json
[INPUT_1] config.json config.backup.json

# Mover app.log dentro de la carpeta logs/
[INPUT_2] app.log logs/

# Renombrar viejo.txt a nuevo.txt
mv viejo.txt [INPUT_3]`,
    inputs: { INPUT_1: "cp", INPUT_2: "mv", INPUT_3: "nuevo.txt" },
    completeCode: "cp origen destino | mv origen carpeta/ | mv viejo nuevo",
  },
  {
    id: 5, title: "Recursivo y forzado: -p, -r, -rf", stars: 2, category: "NAVEGACION",
    description: "Las mismas operaciones pero sobre árboles completos de carpetas. Repetimos mkdir/cp/rm con flags potentes.",
    objective: "operar sobre carpetas completas",
    tags: ["mkdir -p", "cp -r", "rm -rf"],
    fileName: "terminal", completed: false,
    explanationText: "Sin -r tratas solo una hoja; con -r mueves el árbol entero con sus ramas. rm -rf es una motosierra sin freno: rapidísima y sin perdón, úsala con respeto.",
    codeSnippet:
`# Crear una ruta anidada de una sola vez (crea los padres que falten)
mkdir [INPUT_1] src/components/ui

# Copiar una carpeta completa con su contenido (recursivo)
cp [INPUT_2] dist/ backup/

# Borrar una carpeta y TODO lo que contiene (¡cuidado!)
rm [INPUT_3] node_modules`,
    inputs: {
      INPUT_1: ["-p", "--parents"],
      INPUT_2: ["-r", "-R", "--recursive"],
      INPUT_3: ["-rf", "-fr", "-rf", "-r -f"],
    },
    completeCode: "mkdir -p a/b/c | cp -r origen/ destino/ | rm -rf carpeta",
  },
  {
    id: 6, title: "Ver contenido: cat, head, tail, less", stars: 2, category: "NAVEGACION",
    description: "Leer archivos sin abrir un editor: todo, el principio, el final o en vivo.",
    objective: "inspeccionar el contenido de un archivo",
    tags: ["cat", "head", "tail", "tail -f"],
    fileName: "terminal", completed: false,
    explanationText: "cat vacía el archivo entero de golpe; head/tail leen solo los extremos (como hojear el inicio o el final de un libro); tail -f es una cámara en directo del log.",
    codeSnippet:
`# Mostrar el archivo completo
[INPUT_1] README.md

# Solo las primeras 20 líneas
head [INPUT_2] 20 README.md

# Solo las últimas 20 líneas
[INPUT_3] -n 20 app.log

# Seguir el log EN VIVO mientras se escribe
tail [INPUT_4] app.log`,
    inputs: { INPUT_1: "cat", INPUT_2: "-n", INPUT_3: "tail", INPUT_4: ["-f", "--follow"] },
    completeCode: "cat | head -n 20 | tail -n 20 | tail -f (streaming)",
  },

  // ─── BUSQUEDA: find / grep ────────────────────────────────────────────────
  {
    id: 7, title: "find: localizar archivos", stars: 2, category: "BUSQUEDA",
    description: "Encontrar archivos por nombre dentro de un árbol de carpetas.",
    objective: "buscar archivos por nombre",
    tags: ["find", "-name", "-type"],
    fileName: "terminal", completed: false,
    explanationText: "find es un perro rastreador: le das un punto de partida (.) y una pista (-name) y olfatea todas las subcarpetas hasta dar con la presa.",
    codeSnippet:
`# Buscar un archivo por nombre desde la carpeta actual
find . [INPUT_1] "package.json"

# Buscar TODOS los archivos .log (comodín)
find . -name [INPUT_2]

# Limitar a archivos (no carpetas)
find . -type [INPUT_3] -name "*.ts"`,
    inputs: { INPUT_1: "-name", INPUT_2: ["\"*.log\"", "*.log"], INPUT_3: "f" },
    completeCode: "find . -name \"x\" | find . -name \"*.log\" | find . -type f",
  },
  {
    id: 8, title: "find avanzado: tamaño, tiempo y acción", stars: 3, category: "BUSQUEDA",
    description: "El mismo find, ahora filtrando por fecha/tamaño y ejecutando una acción sobre lo encontrado.",
    objective: "filtrar por tiempo/tamaño y actuar",
    tags: ["find", "-mtime", "-size", "-delete"],
    fileName: "terminal", completed: false,
    explanationText: "find no solo encuentra: también actúa. Es como un robot que recoge la basura (-name '*.tmp') y la tira (-delete) en una sola pasada.",
    codeSnippet:
`# Archivos modificados en las últimas 24h (menos de 1 día)
find . -type f -mtime [INPUT_1]

# Archivos de más de 100 MB
find . -type f -size [INPUT_2]

# Borrar TODOS los .tmp encontrados (acción directa)
find . -name "*.tmp" -[INPUT_3]`,
    inputs: { INPUT_1: "-1", INPUT_2: "+100m", INPUT_3: "delete" },
    completeCode: "find -mtime -1 | find -size +100M | find -name x -delete",
  },
  {
    id: 9, title: "grep: buscar texto", stars: 2, category: "BUSQUEDA",
    description: "Buscar una cadena dentro de archivos. Repetimos grep con sus flags más usadas.",
    objective: "buscar texto dentro de archivos",
    tags: ["grep", "-i", "-n"],
    fileName: "terminal", completed: false,
    explanationText: "grep es el Ctrl+F de la terminal, pero capaz de mirar dentro de miles de archivos a la vez. -i lo vuelve daltónico a mayúsculas; -n te dice la línea exacta.",
    codeSnippet:
`# Buscar "TODO" dentro de un archivo
grep "TODO" [INPUT_1]

# Ignorar mayúsculas/minúsculas (case-insensitive)
grep [INPUT_2] "error" app.log

# Mostrar el número de línea de cada coincidencia
grep [INPUT_3] "import" main.ts`,
    inputs: {
      INPUT_1: "notas.md",
      INPUT_2: ["-i", "--ignore-case"],
      INPUT_3: ["-n", "--line-number"],
    },
    completeCode: "grep \"x\" file | grep -i | grep -n",
  },
  {
    id: 10, title: "grep recursivo en el proyecto", stars: 3, category: "BUSQUEDA",
    description: "Buscar en TODO el proyecto, listar solo nombres de archivo y filtrar por extensión.",
    objective: "buscar de forma recursiva en carpetas",
    tags: ["grep -r", "-l", "--include"],
    fileName: "terminal", completed: false,
    explanationText: "grep -r es soltar el sabueso por toda la casa en vez de un solo cuarto. -l te da solo la lista de habitaciones donde encontró algo, no cada pelo hallado.",
    codeSnippet:
`# Buscar "useState" en TODO el proyecto (recursivo)
grep [INPUT_1] "useState" .

# Listar SOLO los nombres de archivo que contienen "API_KEY"
grep -rl "API_KEY" [INPUT_2]

# Limitar la búsqueda a archivos .ts
grep -r --[INPUT_3]="*.ts" "TODO" .`,
    inputs: {
      INPUT_1: ["-r", "-R", "--recursive"],
      INPUT_2: ".",
      INPUT_3: "include",
    },
    completeCode: "grep -r \"x\" . | grep -rl \"x\" . | grep -r --include=\"*.ts\"",
  },

  // ─── PIPES Y FILTROS ──────────────────────────────────────────────────────
  {
    id: 11, title: "Pipes: conectar comandos con |", stars: 2, category: "PIPES",
    description: "El pipe (|) envía la salida de un comando como entrada del siguiente. El superpoder de la shell.",
    objective: "encadenar comandos con un pipe",
    tags: ["pipe", "|", "grep"],
    fileName: "terminal", completed: false,
    explanationText: "El pipe es una cinta transportadora: la fábrica A escupe piezas y la fábrica B las recibe sin que toquen el suelo. Así combinas comandos pequeños en herramientas potentes.",
    codeSnippet:
`# Contar cuántos archivos hay en la carpeta
ls [INPUT_1] wc -l

# Filtrar la salida de un log dejando solo las líneas con "ERROR"
cat app.log [INPUT_2] grep "ERROR"

# Encadenar: de todos los procesos, los que contienen "node"
ps aux | [INPUT_3] node`,
    inputs: { INPUT_1: "|", INPUT_2: "|", INPUT_3: "grep" },
    completeCode: "ls | wc -l | cat x | grep | ps aux | grep node",
  },
  {
    id: 12, title: "Contar y ordenar: sort + uniq", stars: 3, category: "PIPES",
    description: "El combo clásico para rankings: ordenar, deduplicar y contar repeticiones.",
    objective: "ordenar y contar líneas repetidas",
    tags: ["sort", "uniq", "pipe"],
    fileName: "terminal", completed: false,
    explanationText: "uniq solo ve duplicados pegados, por eso SIEMPRE va detrás de sort (como agrupar cartas por palo antes de contarlas). sort -rn al final = ranking de mayor a menor.",
    codeSnippet:
`# Ordenar líneas alfabéticamente
sort nombres.txt

# Quitar duplicados (¡requiere estar ordenado antes!)
sort nombres.txt | [INPUT_1]

# Contar cuántas veces se repite cada línea
sort access.log | uniq [INPUT_2]

# Ranking: ordenar por número, de mayor a menor
sort access.log | uniq -c | sort [INPUT_3]`,
    inputs: { INPUT_1: "uniq", INPUT_2: "-c", INPUT_3: ["-rn", "-nr"] },
    completeCode: "sort | uniq | uniq -c | sort -rn (ranking)",
  },
  {
    id: 13, title: "Columnas: cut y awk", stars: 3, category: "PIPES",
    description: "Extraer columnas concretas de texto tabulado (logs, CSV, /etc/passwd).",
    objective: "extraer columnas de texto",
    tags: ["cut", "awk", "-F"],
    fileName: "terminal", completed: false,
    explanationText: "Piensa en cada línea como una fila de Excel: cut y awk son las tijeras que recortan justo la columna que te interesa, ignorando el resto.",
    codeSnippet:
`# Extraer la 1ª columna usando ":" como separador
cut [INPUT_1]: -f1 /etc/passwd

# Con awk: imprimir la 1ª columna (separa por espacios)
awk '{print [INPUT_2]}' access.log

# awk con separador de coma: imprimir la 2ª columna del CSV
awk -F[INPUT_3] '{print $2}' data.csv`,
    inputs: { INPUT_1: "-d", INPUT_2: "$1", INPUT_3: ["','", ","] },
    completeCode: "cut -d: -f1 | awk '{print $1}' | awk -F','",
  },
  {
    id: 14, title: "sed: buscar y reemplazar", stars: 3, category: "PIPES",
    description: "El editor de flujo: sustituye texto en streams o directamente en archivos.",
    objective: "sustituir texto con sed",
    tags: ["sed", "s///", "-i"],
    fileName: "terminal", completed: false,
    explanationText: "sed es buscar-y-reemplazar de Word, pero por línea de comandos y sin abrir nada. La 'g' es 'todas las del renglón'; sin g, solo la primera de cada línea.",
    codeSnippet:
`# Reemplazar la 1ª aparición de "foo" por "bar" en cada línea
sed 's/foo/[INPUT_1]/' archivo.txt

# Reemplazar TODAS las apariciones (global)
sed 's/foo/bar/[INPUT_2]' archivo.txt

# Editar el archivo EN EL SITIO (in-place, modifica el original)
sed [INPUT_3] 's/v1/v2/g' config.yml`,
    inputs: { INPUT_1: "bar", INPUT_2: "g", INPUT_3: "-i" },
    completeCode: "sed 's/a/b/' | sed 's/a/b/g' | sed -i 's/a/b/g'",
  },
  {
    id: 15, title: "xargs: salida → argumentos", stars: 4, category: "PIPES",
    description: "Convierte la salida de un comando en argumentos del siguiente (cuando un pipe normal no basta).",
    objective: "pasar resultados como argumentos",
    tags: ["xargs", "-0", "pipe"],
    fileName: "terminal", completed: false,
    explanationText: "Algunos comandos (rm, mv...) no leen del pipe, esperan argumentos. xargs es el traductor: toma la lista que llega por la cinta y la entrega 'en la mano' al siguiente comando.",
    codeSnippet:
`# Borrar todos los .tmp que encuentre find
find . -name "*.tmp" | [INPUT_1] rm

# Buscar archivos con "deprecated" y volver a grepear su contenido
grep -rl "deprecated" --include="*.js" . | xargs [INPUT_2] "deprecated"

# Manejar de forma segura nombres con espacios (separador nulo)
find . -name "*.log" -print0 | xargs [INPUT_3] rm`,
    inputs: { INPUT_1: "xargs", INPUT_2: "grep", INPUT_3: "-0" },
    completeCode: "find | xargs rm | grep -rl | xargs grep | find -print0 | xargs -0",
  },

  // ─── PERMISOS, PROCESOS Y ENTORNO ─────────────────────────────────────────
  {
    id: 16, title: "Permisos: chmod", stars: 2, category: "PERMISOS",
    description: "Dar/quitar permisos de lectura, escritura y ejecución. Imprescindible para scripts.",
    objective: "cambiar permisos de archivos",
    tags: ["chmod", "+x", "755"],
    fileName: "deploy.sh", completed: false,
    explanationText: "Los permisos son las llaves de una puerta: r (leer), w (escribir), x (ejecutar). 755 en binario = dueño con todas las llaves, los demás solo entran y miran.",
    codeSnippet:
`# Dar permiso de EJECUCIÓN a un script
chmod [INPUT_1] deploy.sh

# Permisos numéricos: dueño rwx, grupo y otros r-x
chmod [INPUT_2] deploy.sh

# Solo lectura/escritura para el dueño, lectura para el resto
chmod [INPUT_3] config.env`,
    inputs: { INPUT_1: "+x", INPUT_2: "755", INPUT_3: "644" },
    completeCode: "chmod +x | chmod 755 (rwxr-xr-x) | chmod 644 (rw-r--r--)",
  },
  {
    id: 17, title: "Dueños: chown y ls -l", stars: 2, category: "PERMISOS",
    description: "Cambiar el propietario/grupo de un archivo y leer esa información con ls -l.",
    objective: "cambiar el dueño de un archivo",
    tags: ["chown", "ls -l", "owner"],
    fileName: "terminal", completed: false,
    explanationText: "chown es cambiar la escritura de propiedad de una casa. La sintaxis usuario:grupo es como decir 'dueño:familia que también tiene llave'.",
    codeSnippet:
`# Cambiar el dueño del archivo a "deploy"
sudo chown [INPUT_1] app.conf

# Cambiar dueño Y grupo a la vez (usuario:grupo)
sudo chown [INPUT_2] app.conf

# Ver permisos y dueño en formato largo
ls [INPUT_3] app.conf`,
    inputs: { INPUT_1: "deploy", INPUT_2: "deploy:www-data", INPUT_3: "-l" },
    completeCode: "chown user | chown user:group | ls -l",
  },
  {
    id: 18, title: "Procesos: ps, grep, kill", stars: 3, category: "PROCESOS",
    description: "Encontrar un proceso por nombre y terminarlo (con elegancia o a la fuerza).",
    objective: "encontrar y terminar procesos",
    tags: ["ps aux", "kill", "kill -9"],
    fileName: "terminal", completed: false,
    explanationText: "kill (SIGTERM) es tocar el hombro: 'oye, ve cerrando'. kill -9 (SIGKILL) es desenchufar de golpe: úsalo solo si el proceso está colgado y no responde.",
    codeSnippet:
`# Listar TODOS los procesos del sistema
ps [INPUT_1]

# Encontrar el proceso de node
ps aux | grep [INPUT_2]

# Terminar un proceso por su PID (forma elegante, deja que cierre)
kill [INPUT_3]

# Forzar el cierre si quedó colgado (señal 9)
kill [INPUT_4] 4521`,
    inputs: { INPUT_1: "aux", INPUT_2: "node", INPUT_3: "4521", INPUT_4: "-9" },
    completeCode: "ps aux | ps aux | grep node | kill PID | kill -9 PID",
  },
  {
    id: 19, title: "Puertos y disco: lsof, df, du", stars: 3, category: "PROCESOS",
    description: "Ver qué proceso ocupa un puerto y cuánto espacio en disco te queda.",
    objective: "inspeccionar puertos y disco",
    tags: ["lsof", "df", "du"],
    fileName: "terminal", completed: false,
    explanationText: "'Port 3000 already in use' es el error más común del dev. lsof -i :3000 es el detective que descubre quién okupó tu puerto para poder echarlo.",
    codeSnippet:
`# ¿Qué proceso está usando el puerto 3000?
lsof [INPUT_1]:3000

# Espacio libre en disco, en unidades legibles
df [INPUT_2]

# Tamaño total de la carpeta actual (resumido)
du [INPUT_3] .`,
    inputs: {
      INPUT_1: "-i",
      INPUT_2: ["-h", "--human-readable"],
      INPUT_3: ["-sh", "-hs"],
    },
    completeCode: "lsof -i :3000 | df -h | du -sh .",
  },
  {
    id: 20, title: "Segundo plano: &, jobs, nohup", stars: 3, category: "PROCESOS",
    description: "Lanzar procesos en background, listarlos y traerlos al frente.",
    objective: "manejar procesos en segundo plano",
    tags: ["&", "jobs", "fg", "nohup"],
    fileName: "terminal", completed: false,
    explanationText: "& manda el proceso a trabajar 'en otra mesa' para que tú sigas escribiendo. nohup es ponerle tapones en los oídos: ignora la señal de 'colgamos la terminal' y sigue vivo.",
    codeSnippet:
`# Lanzar el servidor en segundo plano
npm run dev [INPUT_1]

# Ver los trabajos en background de esta terminal
[INPUT_2]

# Traer el trabajo número 1 de vuelta al primer plano
fg [INPUT_3]

# Que el proceso siga vivo aunque cierres la terminal
[INPUT_4] npm start &`,
    inputs: { INPUT_1: "&", INPUT_2: "jobs", INPUT_3: "%1", INPUT_4: "nohup" },
    completeCode: "cmd & | jobs | fg %1 | nohup cmd &",
  },
  {
    id: 21, title: "Entorno y alias: export, $VAR, alias", stars: 2, category: "ENTORNO",
    description: "Variables de entorno y atajos. La forma en que configuras tu shell y tus apps.",
    objective: "definir variables y atajos",
    tags: ["export", "$PATH", "alias"],
    fileName: "~/.bashrc", completed: false,
    explanationText: "Las variables de entorno son notas adhesivas que dejas para los programas ($NODE_ENV les dice en qué modo correr). PATH es la lista de cajones donde la shell busca comandos.",
    codeSnippet:
`# Definir una variable de entorno para la sesión
[INPUT_1] NODE_ENV=production

# Leer el valor de esa variable
echo [INPUT_2]

# Añadir una ruta al PATH SIN borrar lo que ya tenía
export PATH=$PATH:[INPUT_3]/bin

# Crear un atajo permanente para un comando largo
[INPUT_4] gs="git status"`,
    inputs: {
      INPUT_1: "export",
      INPUT_2: "$NODE_ENV",
      INPUT_3: "/usr/local",
      INPUT_4: "alias",
    },
    completeCode: "export VAR=x | echo $VAR | export PATH=$PATH:nuevo | alias gs=\"...\"",
  },

  // ─── VIM SURVIVAL ─────────────────────────────────────────────────────────
  {
    id: 22, title: "Vim: entrar, escribir y salir", stars: 1, category: "VIM",
    description: "Lo mínimo para sobrevivir: vim te abre en modo NORMAL, no INSERCIÓN. Confunde a todos al inicio.",
    objective: "escribir y guardar en vim",
    tags: ["vim", "insert", ":wq"],
    fileName: "vim", completed: false,
    theory:
`## Vim tiene MODOS (no es como Notepad)
Esta es la causa #1 de pánico: abres vim, escribes... y nada funciona.

### Los modos que importan
- **NORMAL**: donde apareces al abrir. Las teclas son COMANDOS, no texto.
- **INSERCIÓN**: aquí sí escribes texto normal. Entras con \`i\`.
- **COMANDO**: para guardar/salir. Empieza con \`:\` desde modo normal.

### El ciclo de supervivencia
1. Abres: \`vim archivo\` → estás en **NORMAL**.
2. Pulsas \`i\` → entras en **INSERCIÓN** y escribes.
3. Pulsas \`Esc\` → vuelves a **NORMAL**.
4. Escribes \`:wq\` → **w**rite (guardar) + **q**uit (salir).

Regla de oro: si algo raro pasa, pulsa \`Esc\` y respira.`,
    explanationText: "Vim es un coche con marchas: el modo NORMAL es el embrague (controlas el coche), INSERCIÓN es el acelerador (escribes). Mucha gente choca por querer acelerar sin soltar el embrague.",
    codeSnippet:
`# Abrir un archivo en vim (apareces en modo NORMAL)
vim notas.txt

# Entrar en modo INSERCIÓN para poder escribir (una tecla)
[INPUT_1]

# Volver al modo NORMAL (una tecla)
[INPUT_2]

# Guardar los cambios (desde modo normal)
[INPUT_3]

# Guardar Y salir de vim
[INPUT_4]`,
    inputs: {
      INPUT_1: "i",
      INPUT_2: ["esc", "escape", "<esc>"],
      INPUT_3: ":w",
      INPUT_4: [":wq", ":x", "zz"],
    },
    completeCode: "vim file | i (insert) | Esc | :w (save) | :wq (save & quit)",
  },
  {
    id: 23, title: "Vim: salir sin guardar y deshacer", stars: 2, category: "VIM",
    description: "El otro escenario clásico: entraste sin querer, tocaste algo y quieres salir SIN romper nada.",
    objective: "descartar cambios y deshacer en vim",
    tags: ["vim", ":q!", "undo"],
    fileName: "vim", completed: false,
    explanationText: "El ! en :q! es vim diciendo '¿seguro? pues a la fuerza': tira los cambios sin preguntar. 'u' es el Ctrl+Z de toda la vida.",
    codeSnippet:
`# Salir SIN guardar, descartando los cambios (forzado con !)
[INPUT_1]

# Deshacer el último cambio (en modo normal)
[INPUT_2]

# Rehacer lo que acabas de deshacer
[INPUT_3]

# Salir guardando solo si hubo cambios
:wq`,
    inputs: {
      INPUT_1: ":q!",
      INPUT_2: "u",
      INPUT_3: ["ctrl-r", "<c-r>", "ctrl+r"],
    },
    completeCode: ":q! (salir sin guardar) | u (undo) | Ctrl-r (redo)",
  },
  {
    id: 24, title: "Vim: moverte y editar líneas", stars: 2, category: "VIM",
    description: "Comandos de modo normal para volar por el archivo y editar líneas enteras sin el ratón.",
    objective: "navegar y editar líneas en vim",
    tags: ["vim", "dd", "yy", "gg"],
    fileName: "vim", completed: false,
    explanationText: "En vim los comandos se 'leen': dd = delete-delete (borra línea), yy = yank-yank (copia línea), gg sube arriba del todo, G (mayúscula) baja al final. Es un idioma, no atajos sueltos.",
    codeSnippet:
`# Ir al FINAL del archivo (modo normal)
[INPUT_1]

# Ir a la PRIMERA línea del archivo
[INPUT_2]

# Borrar la línea completa donde está el cursor
[INPUT_3]

# Copiar (yank) la línea actual
[INPUT_4]

# Pegar lo copiado debajo del cursor
p`,
    inputs: { INPUT_1: "G", INPUT_2: "gg", INPUT_3: "dd", INPUT_4: "yy" },
    completeCode: "G (final) | gg (inicio) | dd (cortar línea) | yy (copiar) | p (pegar)",
  },
  {
    id: 25, title: "Vim: buscar y reemplazar", stars: 3, category: "VIM",
    description: "Buscar texto y hacer reemplazos globales. Justo lo que necesitas durante un rebase interactivo.",
    objective: "buscar y reemplazar en vim",
    tags: ["vim", "search", ":%s"],
    fileName: "vim", completed: false,
    explanationText: ":%s/v1/v2/g se lee 'en todo el archivo (%), sustituye (s) v1 por v2, todas las del renglón (g)'. Es el mismo idioma de sed: ya sabías más vim de lo que creías.",
    codeSnippet:
`# Buscar la palabra "config" hacia abajo (modo normal)
[INPUT_1]config

# Saltar a la SIGUIENTE coincidencia
n

# Reemplazar TODAS las apariciones de "v1" por "v2" en el archivo
[INPUT_2]

# Mostrar los números de línea
:set [INPUT_3]`,
    inputs: {
      INPUT_1: "/",
      INPUT_2: ":%s/v1/v2/g",
      INPUT_3: ["number", "nu"],
    },
    completeCode: "/buscar | n (siguiente) | :%s/old/new/g | :set number",
  },

  // ─── GIT: RAMAS, SYNC, CONFLICTOS ─────────────────────────────────────────
  {
    id: 26, title: "Git: crear y cambiar de rama", stars: 2, category: "GIT RAMAS",
    description: "Crear ramas para aislar tu trabajo. Mostramos la forma moderna (switch) y la clásica (checkout).",
    objective: "crear y cambiar entre ramas",
    tags: ["git branch", "switch", "checkout"],
    fileName: "terminal", completed: false,
    explanationText: "Una rama es una línea temporal paralela: experimentas en feature/login sin tocar la realidad oficial (main). git switch es la versión moderna y clara de checkout para ramas.",
    codeSnippet:
`# Ver en qué rama estás y listar las ramas locales
git [INPUT_1]

# Crear y cambiar a una rama nueva (forma MODERNA)
git switch [INPUT_2] feature/login

# Equivalente CLÁSICO (hace lo mismo)
git checkout [INPUT_3] feature/login

# Volver a la rama principal
git switch [INPUT_4]`,
    inputs: { INPUT_1: "branch", INPUT_2: "-c", INPUT_3: "-b", INPUT_4: "main" },
    completeCode: "git branch | git switch -c x | git checkout -b x | git switch main",
  },
  {
    id: 27, title: "Git: el flujo básico (add → commit → push)", stars: 2, category: "GIT RAMAS",
    description: "El ciclo diario que repites mil veces: revisar, preparar, confirmar y subir.",
    objective: "guardar y subir tus cambios",
    tags: ["git add", "commit", "push"],
    fileName: "terminal", completed: false,
    explanationText: "add es meter cosas en la caja (staging), commit es cerrarla y etiquetarla (foto del momento), push es enviarla al almacén compartido (remoto). -u conecta tu rama local con la remota.",
    codeSnippet:
`# Ver el estado: qué cambió, qué está en staging
git [INPUT_1]

# Preparar TODOS los cambios para el commit
git add [INPUT_2]

# Crear el commit con un mensaje
git commit [INPUT_3] "feat: login con JWT"

# Subir la rama por PRIMERA vez (crea el upstream)
git push [INPUT_4] origin feature/login`,
    inputs: {
      INPUT_1: "status",
      INPUT_2: [".", "-A", "--all"],
      INPUT_3: "-m",
      INPUT_4: ["-u", "--set-upstream"],
    },
    completeCode: "git status | git add . | git commit -m \"...\" | git push -u origin rama",
  },
  {
    id: 28, title: "Git: sincronizar (fetch, pull, merge)", stars: 2, category: "GIT RAMAS",
    description: "Traer cambios del remoto e integrarlos. Diferencia clave entre fetch y pull.",
    objective: "traer e integrar cambios remotos",
    tags: ["git fetch", "pull", "merge"],
    fileName: "terminal", completed: false,
    explanationText: "fetch es ir al buzón y traer las cartas SIN abrirlas (descarga, no toca tu código). pull = fetch + abrir y fusionar de golpe. --rebase mantiene la historia en línea recta.",
    codeSnippet:
`# Descargar cambios del remoto SIN fusionarlos aún
git [INPUT_1]

# Descargar Y fusionar en la rama actual (de un tirón)
git [INPUT_2]

# Estando en tu rama feature, traer lo nuevo de main
git merge [INPUT_3]

# Hacer pull pero reaplicando tus commits encima (historial lineal)
git pull [INPUT_4] origin main`,
    inputs: { INPUT_1: "fetch", INPUT_2: "pull", INPUT_3: "main", INPUT_4: "--rebase" },
    completeCode: "git fetch | git pull | git merge main | git pull --rebase",
  },
  {
    id: 29, title: "Git: resolver un conflicto de merge", stars: 3, category: "GIT CONFLICTOS",
    description: "El momento temido: dos ramas tocaron la misma línea. Aprende a leer los marcadores y resolver.",
    objective: "resolver conflictos de merge",
    tags: ["merge", "conflict", "markers"],
    fileName: "app.js (conflicto)", completed: false,
    theory:
`## Anatomía de un conflicto
Git no decide por ti cuando dos ramas cambian la MISMA línea. Te marca el choque y espera que elijas.

### Los marcadores
\`\`\`
<<<<<<< HEAD
tu versión (la rama actual)
=======
la otra versión (la rama que fusionas)
>>>>>>> feature/x
\`\`\`

### Pasos para resolver
1. Abre el archivo en conflicto (vim, VS Code...).
2. Decide qué código queda: lo tuyo, lo otro, o una mezcla.
3. **Borra los 3 marcadores** \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`.
4. \`git add archivo\` → le dices a git "ya está resuelto".
5. \`git commit\` → confirma la fusión.

Tip: \`git merge --abort\` cancela todo y te devuelve al estado previo si te agobias.`,
    explanationText: "Un conflicto es git diciendo 'dos personas editaron la misma frase del documento, decide tú cuál vale'. Los <<<< ==== >>>> solo marcan dónde está el desacuerdo.",
    codeSnippet:
`# Intentas fusionar y aparece el conflicto
git merge feature/x
# CONFLICT (content): Merge conflict in app.js

# Abres app.js y ves los marcadores que dejó git:
[INPUT_1] HEAD
const port = 3000;
[INPUT_2]
const port = 8080;
[INPUT_3] feature/x

# Tras editar y dejar la versión final, marca el archivo como resuelto
git [INPUT_4] app.js

# Confirma la fusión
git commit`,
    inputs: {
      INPUT_1: "<<<<<<<",
      INPUT_2: "=======",
      INPUT_3: ">>>>>>>",
      INPUT_4: "add",
    },
    completeCode: "<<<<<<< HEAD ... ======= ... >>>>>>> rama | git add | git commit",
  },
  {
    id: 30, title: "Git: stash (guardar cambios a un lado)", stars: 3, category: "GIT CONFLICTOS",
    description: "Aparcar cambios sin commitear para cambiar de rama rápido y recuperarlos después.",
    objective: "guardar cambios temporalmente",
    tags: ["git stash", "pop", "list"],
    fileName: "terminal", completed: false,
    explanationText: "stash es el cajón mágico del escritorio: barres ahí los papeles a medias para dejar la mesa limpia, atiendes lo urgente en otra rama, y luego con pop los sacas tal cual estaban.",
    codeSnippet:
`# Guardar tus cambios sin commitear (para cambiar de rama limpio)
git stash

# Guardar con un nombre descriptivo
git stash [INPUT_1] "wip: formulario a medias"

# Ver la lista de stashes guardados
git stash [INPUT_2]

# Recuperar el ÚLTIMO stash y eliminarlo de la pila
git stash [INPUT_3]

# Recuperarlo SIN borrarlo de la pila
git stash apply`,
    inputs: {
      INPUT_1: ["push", "save"],
      INPUT_2: "list",
      INPUT_3: "pop",
    },
    completeCode: "git stash | git stash push -m \"...\" | git stash list | git stash pop",
  },

  // ─── GIT POCO CONOCIDOS ───────────────────────────────────────────────────
  {
    id: 31, title: "Git: deshacer con reset y reflog", stars: 4, category: "GIT PRO",
    description: "Deshacer commits manteniendo o tirando los cambios, y recuperar lo 'perdido' con reflog.",
    objective: "deshacer commits y recuperar trabajo",
    tags: ["git reset", "reflog", "--soft"],
    fileName: "terminal", completed: false,
    explanationText: "reflog es la red de seguridad secreta de git: registra CADA movimiento de HEAD. Aunque creas que borraste un commit con reset --hard, casi siempre sigue ahí, recuperable.",
    codeSnippet:
`# Deshacer el último commit pero MANTENER los cambios (en staging)
git reset [INPUT_1] HEAD~1

# Deshacer y DESCARTAR los cambios por completo (¡destructivo!)
git reset [INPUT_2] HEAD~1

# Tu salvavidas: el historial de TODOS los movimientos de HEAD
git [INPUT_3]

# Recuperar un commit "perdido" usando su hash del reflog
git reset --hard [INPUT_4]`,
    inputs: {
      INPUT_1: "--soft",
      INPUT_2: "--hard",
      INPUT_3: "reflog",
      INPUT_4: "a1b2c3d",
    },
    completeCode: "git reset --soft HEAD~1 | git reset --hard | git reflog | git reset --hard <hash>",
  },
  {
    id: 32, title: "Git: cherry-pick", stars: 4, category: "GIT PRO",
    description: "Traer un commit concreto de otra rama sin fusionarla entera. Ideal para hotfixes.",
    objective: "aplicar commits sueltos de otra rama",
    tags: ["cherry-pick", "--no-commit", "--continue"],
    fileName: "terminal", completed: false,
    explanationText: "cherry-pick es ir al árbol de otra rama y arrancar SOLO la cereza que quieres, sin llevarte la rama entera. Perfecto para pasar un fix puntual de develop a main.",
    codeSnippet:
`# Traer UN commit específico (por su hash) a la rama actual
git cherry-pick [INPUT_1]

# Traer un rango de commits (de A hasta B)
git cherry-pick A..B

# Cherry-pick SIN crear commit (deja los cambios en staging)
git cherry-pick [INPUT_2] 9f8e7d6

# Continuar tras resolver un conflicto durante el cherry-pick
git cherry-pick [INPUT_3]`,
    inputs: {
      INPUT_1: "9f8e7d6",
      INPUT_2: ["-n", "--no-commit"],
      INPUT_3: "--continue",
    },
    completeCode: "git cherry-pick <hash> | A..B | -n (no commit) | --continue",
  },
  {
    id: 33, title: "Git: bisect (cazar el commit del bug)", stars: 5, category: "GIT PRO",
    description: "Búsqueda binaria automática para encontrar exactamente qué commit introdujo un bug.",
    objective: "encontrar el commit que rompió algo",
    tags: ["git bisect", "good", "bad"],
    fileName: "terminal", completed: false,
    explanationText: "bisect es el '¿caliente o frío?' del detective: parte el historial por la mitad una y otra vez. De 1000 commits, encuentra el culpable en ~10 pasos en lugar de revisarlos uno a uno.",
    codeSnippet:
`# Iniciar la búsqueda binaria del commit culpable
git bisect [INPUT_1]

# Marcar el commit ACTUAL como roto (tiene el bug)
git bisect [INPUT_2]

# Marcar un commit antiguo que SÍ funcionaba
git bisect [INPUT_3] v1.0.0

# Al terminar, salir del modo bisect y volver al estado normal
git bisect [INPUT_4]`,
    inputs: { INPUT_1: "start", INPUT_2: "bad", INPUT_3: "good", INPUT_4: "reset" },
    completeCode: "git bisect start | bad | good <commit> | reset",
  },
  {
    id: 34, title: "Git: worktree y restore", stars: 4, category: "GIT PRO",
    description: "Trabajar dos ramas a la vez en carpetas distintas, y descartar cambios con los comandos modernos.",
    objective: "usar worktrees y descartar cambios",
    tags: ["worktree", "restore", "--staged"],
    fileName: "terminal", completed: false,
    explanationText: "worktree te da una segunda mesa de trabajo: revisas un hotfix en main en otra carpeta SIN tener que stashear lo que tienes a medias en tu feature. git restore es el reemplazo claro y seguro de checkout para descartar.",
    codeSnippet:
`# Crear un worktree: editar otra rama en una carpeta aparte
git worktree [INPUT_1] ../hotfix main

# Listar los worktrees activos
git worktree [INPUT_2]

# Descartar los cambios de un archivo (forma MODERNA)
git [INPUT_3] app.js

# Sacar un archivo del staging sin perder los cambios (unstage)
git restore [INPUT_4] app.js`,
    inputs: {
      INPUT_1: "add",
      INPUT_2: "list",
      INPUT_3: "restore",
      INPUT_4: "--staged",
    },
    completeCode: "git worktree add ../dir rama | worktree list | git restore file | restore --staged",
  },

  // ─── INTEGRADORES ─────────────────────────────────────────────────────────
  {
    id: 35, title: "Integrador: top 5 IPs del access.log", stars: 4, category: "INTEGRADOR",
    description: "Combina awk + sort + uniq + sort + head en una sola tubería. Todo lo aprendido de pipes, junto.",
    objective: "construir una tubería de análisis de logs",
    tags: ["awk", "sort", "uniq", "pipeline"],
    fileName: "terminal", completed: false,
    explanationText: "Esta es la receta de oro del análisis de logs: cada comando hace UNA cosa y el pipe los une en una cadena de montaje. Memorízala, la usarás toda tu carrera.",
    codeSnippet:
`# Objetivo: las 5 IPs con MÁS peticiones en el access.log
# 1) extrae la 1ª columna (IP) → 2) ordena → 3) cuenta repetidas
# 4) ordena por número desc → 5) toma las 5 primeras
awk '{print $1}' access.log [INPUT_1] sort | uniq [INPUT_2] | sort [INPUT_3] | [INPUT_4] -5`,
    inputs: {
      INPUT_1: "|",
      INPUT_2: "-c",
      INPUT_3: ["-rn", "-nr"],
      INPUT_4: "head",
    },
    completeCode: "awk '{print $1}' f | sort | uniq -c | sort -rn | head -5",
  },
  {
    id: 36, title: "Integrador: liberar un puerto ocupado", stars: 4, category: "INTEGRADOR",
    description: "Encuentra el proceso que bloquea el puerto 3000 y mátalo en una sola línea (lsof + xargs + kill).",
    objective: "matar el proceso que ocupa un puerto",
    tags: ["lsof", "xargs", "kill"],
    fileName: "terminal", completed: false,
    explanationText: "Junta tres cosas que ya sabes: lsof encuentra al okupa, -t da solo su PID limpio, xargs se lo entrega a kill. El error 'port in use' resuelto en un comando.",
    codeSnippet:
`# El puerto 3000 está ocupado. Libéralo en una sola línea:
# 1) encuentra el proceso del puerto  2) toma solo su PID (-t)
# 3) pásalo a kill para terminarlo a la fuerza
lsof [INPUT_1]:3000 -t | [INPUT_2] kill [INPUT_3]`,
    inputs: { INPUT_1: "-i", INPUT_2: "xargs", INPUT_3: "-9" },
    completeCode: "lsof -i :3000 -t | xargs kill -9",
  },
  {
    id: 37, title: "Integrador: refactor masivo en el repo", stars: 5, category: "INTEGRADOR",
    description: "Renombra una función en todos los .ts del proyecto combinando grep + xargs + sed in-place.",
    objective: "reemplazar texto en muchos archivos a la vez",
    tags: ["grep", "xargs", "sed", "refactor"],
    fileName: "terminal", completed: false,
    explanationText: "Cuando el 'Renombrar símbolo' del IDE no alcanza, esta tubería sí: grep -rl lista solo los archivos afectados, xargs se los pasa a sed, y -i reescribe cada uno. Refactor en segundos.",
    codeSnippet:
`# Renombrar getUser → fetchUser en TODOS los .ts del proyecto:
# 1) lista los archivos .ts que contienen "getUser"
# 2) pásalos a sed para reemplazar dentro de cada uno (in-place)
grep [INPUT_1] "getUser" --include="*.ts" . | [INPUT_2] sed [INPUT_3] 's/getUser/fetchUser/g'`,
    inputs: { INPUT_1: "-rl", INPUT_2: "xargs", INPUT_3: "-i" },
    completeCode: "grep -rl \"getUser\" --include=\"*.ts\" . | xargs sed -i 's/getUser/fetchUser/g'",
  },
  {
    id: 38, title: "Integrador: feature completa con conflicto", stars: 5, category: "INTEGRADOR",
    description: "El flujo real de punta a punta: rama → editar en vim → commit → push → conflicto → rebase. Todo junto.",
    objective: "ejecutar un flujo de feature completo",
    tags: ["branch", "conflict", "rebase", "push"],
    fileName: "terminal", completed: false,
    explanationText: "Este es el día a día de un senior condensado: aislar el trabajo en una rama, resolver el inevitable conflicto al sincronizar, y dejar un historial limpio con rebase -i antes de abrir el PR.",
    codeSnippet:
`# 1) Crear y cambiar a una rama nueva desde main
git switch [INPUT_1] feature/perfil

# 2) (editas archivos en vim, guardas con :wq) y los confirmas
git add .
git commit -m "feat: pagina de perfil"

# 3) Subir la rama al remoto por primera vez
git push [INPUT_2] origin feature/perfil

# 4) main avanzó: traes los cambios y hay conflicto
git pull origin main          # CONFLICT en perfil.tsx

# 5) Resuelves en el editor y marcas el archivo como resuelto
git [INPUT_3] perfil.tsx
git commit

# 6) Limpias tu historial (últimos 3 commits) antes del Pull Request
git rebase [INPUT_4] HEAD~3`,
    inputs: {
      INPUT_1: "-c",
      INPUT_2: ["-u", "--set-upstream"],
      INPUT_3: "add",
      INPUT_4: ["-i", "--interactive"],
    },
    completeCode: "git switch -c rama | push -u origin rama | git add (resuelto) | git rebase -i HEAD~3",
  },
];

export const BASH_EXERCISES: Exercise[] = enrichBashExercises(BASH_EXERCISES_RAW);
