// ══════════════════════════════════════════════════════════════════════════════
// DOCKER & KUBERNETES — 65 ejercicios interactivos con teoría estructurada
// ALINEADOS CON LA HOJA DE ATAJOS (DOCKER CHEAT SHEET)
// Divididos exactamente por nivel: Fácil (20), Medio (25) y Difícil (20)
// Con enfoque para desarrolladores (.NET, Node.js, Vue, React, SQL Server, Postgres)
// ══════════════════════════════════════════════════════════════════════════════

const DOCKER_EXERCISES = [

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SECCIÓN 1: NIVEL FÁCIL (20 EJERCICIOS) ──────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "¿Qué es Docker y por qué es importante?",
    stars: 1,
    category: "CONCEPTOS",
    description: "Comienza entendiendo la diferencia clave entre contenedores y máquinas virtuales basándote en el glosario.",
    objective: "Comprender qué es un contenedor e imagen",
    tags: ["introduccion", "virtualizacion", "conceptos"],
    fileName: "Glosario",
    completed: false,
    theory: `📚 TEORÍA: Glosario de Conceptos Básicos

• Docker: Es una herramienta diseñada para facilitar la creación, implementación y ejecución de aplicaciones mediante el uso de contenedores.
• Container (Contenedor): Es una instancia de una imagen ejecutándose en un ambiente aislado.
• Image (Imagen de contenedor): Es un archivo construido por capas, que contiene todas las dependencias para ejecutarse, tales como: dependencias, configuraciones, scripts, archivos binarios, etc.
• Dockerizar una aplicación: Proceso de tomar un código fuente y generar una imagen lista para montar y correrla en un contenedor.`,
    explanationText: "Completa la definición con los términos correctos: 'contenedor' e 'imagen'.",
    codeSnippet: "Un [INPUT_1] es una instancia de una [INPUT_2] ejecutándose en un ambiente aislado que empaqueta todas las dependencias para ejecutarse.",
    inputs: { INPUT_1: "contenedor", INPUT_2: "imagen" },
    completeCode: "Un contenedor es una instancia de una imagen ejecutándose de forma aislada."
  },

  {
    id: 2,
    title: "Arquitectura de Docker: El Daemon",
    stars: 1,
    category: "CONCEPTOS",
    description: "Identifica el componente del clúster de Docker que corre en segundo plano en el host.",
    objective: "Identificar qué es el Docker Daemon",
    tags: ["arquitectura", "daemon", "server"],
    fileName: "Glosario",
    completed: false,
    theory: `📚 TEORÍA: El Docker Daemon y Registro

• Docker Daemon: Es el servicio en segundo plano que se ejecuta en el host y administra la creación, ejecución y distribución de contenedores Docker. Se comunica con el cliente a través de una API REST.
• Registry (Registro): Es una aplicación del lado del servidor altamente escalable y sin estado que almacena y le permite distribuir imágenes de Docker (como Docker Hub o registros privados).`,
    explanationText: "Completa los términos del glosario: 'daemon' y 'registro'.",
    codeSnippet: "El Docker [INPUT_1] es el servicio en segundo plano que administra contenedores en el host, mientras que el [INPUT_2] es el servidor que almacena y distribuye imágenes de Docker.",
    inputs: { INPUT_1: "daemon", INPUT_2: "registro" },
    completeCode: "El Docker daemon administra los contenedores y el registro los almacena."
  },

  {
    id: 3,
    title: "Descargar una imagen (docker pull)",
    stars: 1,
    category: "CLI",
    description: "Descarga una imagen específica o con tag de base de datos desde el registro.",
    objective: "Utilizar docker pull para descargar imágenes",
    tags: ["pull", "images", "postgres"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Descarga de Imágenes

Para descargar una imagen desde un registro como Docker Hub al host sin ejecutarla de inmediato:
  docker pull IMAGE_NAME
  docker pull IMAGE_NAME:TAG
Ejemplos de la guía de atajos:
  - docker pull postgres (Descarga la versión por defecto 'latest')
  - docker pull postgres:15.1 (Descarga una versión/tag específico)`,
    explanationText: "Completa los comandos de descarga: 'pull' y 'postgres:15.1'.",
    codeSnippet: "# Descargar la imagen de postgres por defecto:\ndocker [INPUT_1] postgres\n\n# Descargar postgres versión 15.1:\ndocker pull [INPUT_2]",
    inputs: { INPUT_1: "pull", INPUT_2: "postgres:15.1" },
    completeCode: "docker pull postgres && docker pull postgres:15.1"
  },

  {
    id: 4,
    title: "Correr un contenedor (docker run y banderas combinadas)",
    stars: 1,
    category: "CONTENEDORES",
    description: "Aprende a ejecutar la imagen 'getting-started' combinando banderas.",
    objective: "Combinar flags -d y -p en docker container run",
    tags: ["run", "getting-started", "flags"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: banderas comunes en docker run

• -d : Corre la imagen desenlazada de la consola (detached/background).
• -p 80:80 : Mapea el puerto del Host al puerto del Contenedor (HOST:CONTAINER).
Pro Tip de la hoja de atajos:
  Puedes combinar banderas en una sola. Por ejemplo, en lugar de usar '-d -p 80:80', puedes escribir '-dp 80:80'.`,
    explanationText: "Completa el comando combinando banderas: 'dp' y 'getting-started'.",
    codeSnippet: "# Correr el contenedor en background, mapeando el puerto 80 local al 80 del contenedor:\ndocker container run -[INPUT_1] 80:80 docker/[INPUT_2]",
    inputs: { INPUT_1: "dp", INPUT_2: "getting-started" },
    completeCode: "docker container run -dp 80:80 docker/getting-started"
  },

  {
    id: 5,
    title: "Sintaxis de comandos simplificada",
    stars: 1,
    category: "CLI",
    description: "Compara la sintaxis moderna con el comando simplificado tradicional.",
    objective: "Diferenciar sintaxis docker container run de docker run",
    tags: ["run", "sintaxis", "getting-started"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: docker container run vs docker run

En la hoja de atajos se muestra que puedes iniciar contenedores con:
  - docker container run -d -p 80:80 docker/getting-started (Sintaxis completa)
  - docker run -dp 80:80 docker/getting-started (Sintaxis simplificada tradicional)
Ambos comandos producen el mismo efecto.`,
    explanationText: "Completa los comandos equivalentes: 'container' y 'run'.",
    codeSnippet: "# Sintaxis moderna:\ndocker [INPUT_1] run -dp 80:80 docker/getting-started\n\n# Sintaxis legacy acortada:\ndocker [INPUT_2] -dp 80:80 docker/getting-started",
    inputs: { INPUT_1: "container", INPUT_2: "run" },
    completeCode: "docker container run -dp 80:80 docker/getting-started"
  },

  {
    id: 6,
    title: "Obtener ayuda de la CLI",
    stars: 1,
    category: "CLI",
    description: "Consulta los detalles y opciones de cualquier subcomando de Docker.",
    objective: "Usar la bandera --help",
    tags: ["help", "cli", "documentation"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Ayuda integrada en Docker

Docker incluye manuales de ayuda para cada comando directo en la consola:
  docker <comando> --help
Ejemplos:
  - docker --help
  - docker container --help
  - docker run --help`,
    explanationText: "Completa la sintaxis de ayuda: 'container' y '--help'.",
    codeSnippet: "# Obtener ayuda del comando container:\ndocker [INPUT_1] [INPUT_2]",
    inputs: { INPUT_1: "container", INPUT_2: "--help" },
    completeCode: "docker container --help"
  },

  {
    id: 7,
    title: "Asignar un nombre al contenedor",
    stars: 1,
    category: "CONTENEDORES",
    description: "Especifica un nombre legible por humanos al iniciar tu contenedor.",
    objective: "Utilizar la bandera --name",
    tags: ["name", "run", "getting-started"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Flag --name

Por defecto, Docker asigna nombres aleatorios a los contenedores. Para poder administrarlos fácilmente sin tener que buscar el ID, usa:
  docker container run --name myName IMAGE_NAME`,
    explanationText: "Completa el comando: 'name' y 'getting-started'.",
    codeSnippet: "# Correr contenedor asignando el nombre 'myName':\ndocker container run --[INPUT_1] myName docker/[INPUT_2]",
    inputs: { INPUT_1: "name", INPUT_2: "getting-started" },
    completeCode: "docker container run --name myName docker/getting-started"
  },

  {
    id: 8,
    title: "Listar contenedores (docker container ls / docker ps)",
    stars: 1,
    category: "CLI",
    description: "Lista contenedores corriendo y todos los contenedores usando comandos tradicionales y modernos.",
    objective: "Listar contenedores locales",
    tags: ["ps", "ls", "container"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Comandos de Listado

Para monitorear los contenedores del host:
  • Listar los que están corriendo:
    - docker container ls
    - docker ps
  • Listar TODOS los contenedores (incluyendo detenidos):
    - docker container ls -a
    - docker ps -a`,
    explanationText: "Completa con los comandos correctos: 'ls', 'ps' y 'a'.",
    codeSnippet: "# Listar activos (moderno):\ndocker container [INPUT_1]\n# Listar activos (tradicional):\ndocker [INPUT_2]\n# Listar todos (moderno):\ndocker container ls -[INPUT_3]",
    inputs: { INPUT_1: "ls", INPUT_2: "ps", INPUT_3: "a" },
    completeCode: "docker container ls | docker ps | docker container ls -a"
  },

  {
    id: 9,
    title: "Detener y eliminar contenedores",
    stars: 1,
    category: "CONTENEDORES",
    description: "Detén un contenedor activo y luego elimínalo para liberar recursos.",
    objective: "Aplicar stop y rm a un contenedor",
    tags: ["stop", "rm", "lifecycle"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Detener y eliminar contenedores

El ciclo de parada estándar de contenedores consta de dos comandos:
  1. Detener el contenedor:
     docker container stop <container-id>
  2. Borrar el contenedor (libera el nombre y espacio):
     docker container rm <container-id>`,
    explanationText: "Especifica las instrucciones de parada: 'stop' y 'rm'.",
    codeSnippet: "# Detener el contenedor por su ID:\ndocker container [INPUT_1] a8b23c\n\n# Eliminar el contenedor detenido:\ndocker container [INPUT_2] a8b23c",
    inputs: { INPUT_1: "stop", INPUT_2: "rm" },
    completeCode: "docker container stop a8b23c && docker container rm a8b23c"
  },

  {
    id: 10,
    title: "Iniciar un contenedor previamente creado",
    stars: 1,
    category: "CONTENEDORES",
    description: "Vuelve a encender un contenedor que fue detenido sin recrearlo.",
    objective: "Usar docker container start",
    tags: ["start", "lifecycle"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Iniciar Contenedores Detenidos

Si detienes un contenedor con 'stop', sus cambios no se borran y el contenedor sigue existiendo en el listado de 'docker ps -a'. Puedes volver a encenderlo usando:
  docker container start <container-id>`,
    explanationText: "Completa el comando: 'start'.",
    codeSnippet: "# Iniciar el contenedor detenido con ID 'e2f':\ndocker container [INPUT_1] e2f",
    inputs: { INPUT_1: "start" },
    completeCode: "docker container start e2f"
  },

  {
    id: 11,
    title: "Pro Tip: Detención y remoción forzada",
    stars: 2,
    category: "CONTENEDORES",
    description: "Detén y elimina un contenedor activo de forma forzada en un solo paso, o borra varios contenedores.",
    objective: "Utilizar docker container rm -f",
    tags: ["force", "rm", "clean"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Remoción Forzada

Pro Tip de la hoja de atajos:
Puedes detener y remover contenedores en ejecución de forma forzada usando la bandera '-f':
  docker container rm -f <container-id>
También puedes pasar múltiples IDs separados por espacio para borrar varios a la vez:
  docker container rm -f <ID1 ID2 ID3...>`,
    explanationText: "Completa con: 'rm' y '-f'.",
    codeSnippet: "# Detener y remover de forma forzada el contenedor 'e9d':\ndocker container [INPUT_1] [INPUT_2] e9d",
    inputs: { INPUT_1: "rm", INPUT_2: "-f" },
    completeCode: "docker container rm -f e9d"
  },

  {
    id: 12,
    title: "Autenticación en Docker Hub (docker login)",
    stars: 2,
    category: "SEGURIDAD",
    description: "Aprende el comando para iniciar sesión en tu cuenta de Docker Hub.",
    objective: "Autenticarte en el registro oficial",
    tags: ["login", "registry", "docker hub"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Iniciar sesión en registros

Para subir tus imágenes compiladas a Docker Hub o descargar imágenes de repositorios privados, debes autenticarte:
  docker login -u <TU USUARIO>
Adicionalmente, se recomienda utilizar Tokens de Acceso en lugar de tu contraseña real en texto plano.`,
    explanationText: "Completa el comando: 'login' y '-u'.",
    codeSnippet: "# Iniciar sesión especificando el usuario:\ndocker [INPUT_1] [INPUT_2] iramalva",
    inputs: { INPUT_1: "login", INPUT_2: "-u" },
    completeCode: "docker login -u iramalva"
  },

  {
    id: 13,
    title: "Construir y asignar un tag a la imagen",
    stars: 2,
    category: "DOCKERFILE",
    description: "Construye una imagen a partir de un Dockerfile en el directorio actual asignándole un tag.",
    objective: "Utilizar docker build -t",
    tags: ["build", "tag", "dockerfile"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: docker build

Para empaquetar tu código fuente en una imagen utilizando las instrucciones del Dockerfile:
  docker build -t <nombre_tag> <contexto>
  Ejemplo: docker build -t getting-started .
• -t : Asigna el tag o nombre a la imagen para que sea legible.
• . : Indica dónde buscar el archivo Dockerfile (en este caso, en el directorio actual).`,
    explanationText: "Completa el comando de compilación: 'build', '-t' y '.'.",
    codeSnippet: "# Construir la imagen con tag 'getting-started' en el directorio actual:\ndocker [INPUT_1] [INPUT_2] getting-started [INPUT_3]",
    inputs: { INPUT_1: "build", INPUT_2: "-t", INPUT_3: "." },
    completeCode: "docker build -t getting-started ."
  },

  {
    id: 14,
    title: "Renombrar una imagen local (docker tag)",
    stars: 2,
    category: "CLI",
    description: "Crea una referencia o renombre a una imagen existente antes de publicarla.",
    objective: "Usar docker tag para versionar y preparar push",
    tags: ["tag", "rename", "registry"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Renombrar imágenes locales

Para subir una imagen a un registro diferente o a tu cuenta de Docker Hub, debes crear un tag que apunte a tu usuario o URL de registro:
  docker image tag SOURCE[:TAG] TARGET_IMAGE[:TAG]
O simplificado:
  docker tag IMAGE NEW_IMAGE
Ejemplo de la guía de atajos:
  docker tag getting-started YOUR-USERNAME/getting-started`,
    explanationText: "Completa los tags: 'tag' y 'getting-started'.",
    codeSnippet: "# Renombrar la imagen local 'getting-started' para subirla al usuario 'iramalva':\ndocker [INPUT_1] [INPUT_2] iramalva/getting-started",
    inputs: { INPUT_1: "tag", INPUT_2: "getting-started" },
    completeCode: "docker tag getting-started iramalva/getting-started"
  },

  {
    id: 15,
    title: "Versionamiento de imágenes locales",
    stars: 2,
    category: "CLI",
    description: "Agrega etiquetas de versión específicas a tus imágenes.",
    objective: "Renombrar con tag de versión explícito",
    tags: ["tag", "versioning"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Versionamiento de Imágenes

Si deseas colocar un tag de versión específico en lugar de 'latest', puedes usar:
  docker image tag IMAGEN IMAGEN:2.0.0`,
    explanationText: "Completa con: 'image' y 'tag'.",
    codeSnippet: "# Versionar la imagen local 'mi-app' a 'mi-app:2.0.0':\ndocker [INPUT_1] [INPUT_2] mi-app mi-app:2.0.0",
    inputs: { INPUT_1: "image", INPUT_2: "tag" },
    completeCode: "docker image tag mi-app mi-app:2.0.0"
  },

  {
    id: 16,
    title: "Listar imágenes y eliminar una específica (docker images / rmi)",
    stars: 1,
    category: "CLI",
    description: "Lista las imágenes guardadas en el host y remueve una de ellas.",
    objective: "Listar y remover imágenes por CLI",
    tags: ["images", "rmi", "rm"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Administración de imágenes

• Listar todas las imágenes en el host:
  - docker images
• Eliminar una o más imágenes específicas:
  - docker image rm <image-ID>
  - docker rmi <nombre_o_id> (ej. docker rmi getting-started)`,
    explanationText: "Ingresa los comandos: 'images', 'image' e 'rmi'.",
    codeSnippet: "# Listar todas las imágenes locales:\ndocker [INPUT_1]\n\n# Eliminar usando la sintaxis moderna (rm):\ndocker [INPUT_2] rm c4f23b\n\n# Eliminar usando el comando abreviado (rmi):\ndocker [INPUT_3] getting-started",
    inputs: { INPUT_1: "images", INPUT_2: "image", INPUT_3: "rmi" },
    completeCode: "docker images && docker rmi getting-started"
  },

  {
    id: 17,
    title: "Limpieza de imágenes colgadas (prune)",
    stars: 2,
    category: "CLI",
    description: "Elimina imágenes huérfanas sin tag (dangling) o todas las imágenes no utilizadas.",
    objective: "Usar docker image prune",
    tags: ["prune", "image", "clean"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Image Prune

Para liberar espacio de almacenamiento ocupado por imágenes intermedias sin nombre o sin uso:
  • docker image prune: Elimina únicamente imágenes colgadas (dangling images, las que salen como <none>).
  • docker image prune -a: Borra todas las imágenes locales que no estén siendo usadas por al menos un contenedor.`,
    explanationText: "Completa el comando con: 'prune' y '-a'.",
    codeSnippet: "# Limpiar imágenes colgadas:\ndocker image [INPUT_1]\n\n# Limpiar todas las imágenes no usadas:\ndocker image prune [INPUT_2]",
    inputs: { INPUT_1: "prune", INPUT_2: "-a" },
    completeCode: "docker image prune -a"
  },

  {
    id: 18,
    title: "Logs y monitoreo: docker logs --follow",
    stars: 1,
    category: "CLI",
    description: "Monitorea la salida de consola de tus contenedores de forma activa.",
    objective: "Monitorear logs en tiempo real",
    tags: ["logs", "follow", "monitoring"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Logs de Contenedores

Para ver lo que la app escribe en stdout/stderr:
  • docker container logs <container-id>
  • docker container logs --follow <container-id> (Mantiene abierta la terminal y sigue imprimiendo los nuevos logs en vivo).`,
    explanationText: "Completa con: 'logs' y '--follow'.",
    codeSnippet: "# Ver logs unificados:\ndocker container [INPUT_1] web-server\n\n# Seguir logs en tiempo real:\ndocker container logs [INPUT_2] web-server",
    inputs: { INPUT_1: "logs", INPUT_2: "--follow" },
    completeCode: "docker container logs --follow web-server"
  },

  {
    id: 19,
    title: "Estadísticas de hardware (docker stats)",
    stars: 2,
    category: "CLI",
    description: "Monitorea en tiempo real el consumo de CPU, memoria y red de tus contenedores.",
    objective: "Utilizar docker stats",
    tags: ["stats", "cpu", "memory", "performance"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Monitoreo con docker stats

El comando 'docker stats' muestra un stream interactivo con el consumo en vivo de recursos (CPU %, Memoria utilizada / Límite de RAM, %, I/O red e I/O disco) de todos los contenedores activos en el host.`,
    explanationText: "Completa el comando: 'stats'.",
    codeSnippet: "# Mostrar estadísticas de consumo de los contenedores:\ndocker [INPUT_1]",
    inputs: { INPUT_1: "stats" },
    completeCode: "docker stats"
  },

  {
    id: 20,
    title: "Entrar al contenedor: docker exec sh/bash",
    stars: 2,
    category: "CONTENEDORES",
    description: "Inicia una sesión interactiva sh o bash dentro de tu contenedor.",
    objective: "Usar docker exec -it",
    tags: ["exec", "shell", "bash", "sh"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: docker exec

Para entrar a un contenedor activo a realizar pruebas o depuración:
  docker exec -it CONTAINER EXECUTABLE
  -it: Interactive Terminal
Ejemplos de la guía:
  - docker exec -it web bash
  - docker exec -it web /bin/sh`,
    explanationText: "Completa el comando: 'exec', '-it' y 'bash'.",
    codeSnippet: "# Entrar de forma interactiva a un contenedor llamado 'web' usando bash:\ndocker [INPUT_1] [INPUT_2] web [INPUT_3]",
    inputs: { INPUT_1: "exec", INPUT_2: "-it", INPUT_3: "bash" },
    completeCode: "docker exec -it web bash"
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SECCIÓN 2: NIVEL MEDIO (25 EJERCICIOS) ─────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 21,
    title: "Named Volumes: Crear e Inspeccionar",
    stars: 3,
    category: "VOLUMENES",
    description: "Crea y analiza volúmenes con nombre para almacenar datos persistentes.",
    objective: "Gestionar Named Volumes de la guía de atajos",
    tags: ["volumes", "inspect", "postgres"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Named Volumes (Volúmenes con Nombre)

Es el volumen más usado para hacer persistentes los datos entre reinicios.
Comandos comunes:
  • Crear un nuevo volumen: docker volume create todo-db
  • Listar los volúmenes creados: docker volume ls
  • Inspeccionar volumen específico: docker volume inspect todo-db
  • Remueve todos los volúmenes no usados: docker volume prune
  • Remueve un volumen específico: docker volume rm todo-db`,
    explanationText: "Completa con los comandos de volúmenes: 'create', 'ls' e 'inspect'.",
    codeSnippet: "# Crear volumen:\ndocker volume [INPUT_1] todo-db\n# Listar volúmenes:\ndocker volume [INPUT_2]\n# Inspeccionar volumen:\ndocker volume [INPUT_3] todo-db",
    inputs: { INPUT_1: "create", INPUT_2: "ls", INPUT_3: "inspect" },
    completeCode: "docker volume create todo-db && docker volume inspect todo-db"
  },

  {
    id: 22,
    title: "Usar un volumen al correr un contenedor",
    stars: 3,
    category: "VOLUMENES",
    description: "Monta un volumen con nombre en la ruta interna indicada.",
    objective: "Montar volúmenes en docker run con -v",
    tags: ["run", "volumes", "getting-started"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Montar Named Volumes

Para vincular un volumen nombrado a un contenedor:
  docker run -v <nombre_volumen>:<ruta_interna> <imagen>
Ejemplo de la hoja de atajos:
  docker run -v todo-db:/etc/todos getting-started`,
    explanationText: "Completa con: 'v' y 'getting-started'.",
    codeSnippet: "# Montar el volumen 'todo-db' en la ruta '/etc/todos':\ndocker run -[INPUT_1] todo-db:/etc/todos [INPUT_2]",
    inputs: { INPUT_1: "v", INPUT_2: "getting-started" },
    completeCode: "docker run -v todo-db:/etc/todos getting-started"
  },

  {
    id: 23,
    title: "Bind Volumes: Desarrollo local (Terminal vs PowerShell)",
    stars: 3,
    category: "VOLUMENES",
    description: "Monta tu código local usando rutas absolutas y especificando el working directory.",
    objective: "Utilizar bind mounts en Linux y PowerShell",
    tags: ["bind mount", "powershell", "dev"],
    fileName: "terminal",
    completed: false,
    theory: "📚 TEORÍA: Bind Volumes (Vincular Volúmenes locales)\n\nLos Bind Volumes trabajan con rutas absolutas locales del host.\n  • -w /app: Working directory (establece dónde empezará a correr el comando).\n  • -v \"$(pwd):/app\": Vincula el directorio actual del host con el directorio /app del contenedor.\nEn la guía de atajos se definen los comandos multi-línea equivalentes:\n  - Terminal (Linux/Mac con backslash \\\\):\n    docker run -dp 3000:3000 \\\\\n      -w /app -v \"$(pwd):/app\" \\\\\n      node:18-alpine \\\\\n      sh -c \"yarn install && yarn run dev\"\n  - PowerShell (Windows con acento grave backtick):\n    docker run -dp 3000:3000 (backtick)\n      -w /app -v \"$(pwd):/app\" (backtick)\n      node:18-alpine (backtick)\n      sh -c \"yarn install && yarn run dev\"",
    explanationText: "Completa el comando: 'w', 'pwd:/app' y 'yarn install && yarn run dev'.",
    codeSnippet: "docker run -dp 3000:3000\n    -[INPUT_1] /app -v [INPUT_2]\n    node:18-alpine\n    sh -c [INPUT_3]",
    inputs: { INPUT_1: "w", INPUT_2: "$(pwd):/app", INPUT_3: "yarn install && yarn run dev" },
    completeCode: "docker run -dp 3000:3000 -w /app -v $(pwd):/app node:18-alpine sh -c \"yarn install && yarn run dev\""
  },

  {
    id: 24,
    title: "Anonymous Volumes: Volúmenes Anónimos",
    stars: 3,
    category: "VOLUMENES",
    description: "Monta un volumen donde sólo se especifica la ruta interna del contenedor.",
    objective: "Identificar la sintaxis de Anonymous Volumes",
    tags: ["anonymous", "volumes", "postgres"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Anonymous Volumes (Volúmenes Anónimos)

Son volúmenes donde sólo se especifica la ruta del contenedor y Docker lo asigna automáticamente en una carpeta aleatoria administrada por el host.
Ejemplo de la hoja de atajos:
  docker run -v /var/lib/mysql/data`,
    explanationText: "Completa el comando de volumen anónimo: 'v' y '/var/lib/mysql/data'.",
    codeSnippet: "# Levantar contenedor con un volumen anónimo:\ndocker run -[INPUT_1] [INPUT_2]",
    inputs: { INPUT_1: "v", INPUT_2: "/var/lib/mysql/data" },
    completeCode: "docker run -v /var/lib/mysql/data"
  },

  {
    id: 25,
    title: "Networking: Gestión básica de redes por CLI",
    stars: 3,
    category: "REDES",
    description: "Crea y analiza redes usando la interfaz de comandos.",
    objective: "Gestionar redes con comandos de la guía",
    tags: ["networks", "network create", "dns"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Container Networking

Regla de oro: Si dos o más contenedores están en la misma red, podrán hablar entre sí. Si no lo están, no podrán.
Comandos comunes:
  • Ver comandos de network: docker network
  • Crear una nueva red: docker network create todo-app
  • Listar redes creadas: docker network ls
  • Inspeccionar una red: docker network inspect todo-app
  • Borrar redes no usadas: docker network prune`,
    explanationText: "Ingresa los comandos de red: 'create', 'ls' y 'inspect'.",
    codeSnippet: "# Crear red:\ndocker network [INPUT_1] todo-app\n# Listar redes:\ndocker network [INPUT_2]\n# Inspeccionar red:\ndocker network [INPUT_3] todo-app",
    inputs: { INPUT_1: "create", INPUT_2: "ls", INPUT_3: "inspect" },
    completeCode: "docker network create todo-app && docker network inspect todo-app"
  },

  {
    id: 26,
    title: "Networking: Unir contenedor y configurar Network Alias",
    stars: 3,
    category: "REDES",
    description: "Corre una imagen uniéndola a la red y configurando su alias de DNS interno.",
    objective: "Configurar --network-alias",
    tags: ["alias", "dns", "networking", "mysql"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Redes y Alias en Contenedores

Para permitir que otros contenedores en la misma red se conecten usando un alias sencillo en lugar de IDs:
  --network-alias mysql: Permite que otros contenedores en la red 'todo-app' se conecten usando el host 'mysql'.
Comando completo de la hoja de atajos:
  docker run -d \\
    --network todo-app --network-alias mysql \\
    -v todo-mysql-data:/var/lib/mysql \\
    -e MYSQL_ROOT_PASSWORD=secret \\
    -e MYSQL_DATABASE=todos \\
    mysql:8.0`,
    explanationText: "Completa con: 'network', 'network-alias' y 'MYSQL_ROOT_PASSWORD'.",
    codeSnippet: "docker run -d \\\n    --[INPUT_1] todo-app --[INPUT_2] mysql \\\n    -v todo-mysql-data:/var/lib/mysql \\\n    -e [INPUT_3]=secret \\\n    -e MYSQL_DATABASE=todos \\\n    mysql:8.0",
    inputs: { INPUT_1: "network", INPUT_2: "network-alias", INPUT_3: "MYSQL_ROOT_PASSWORD" },
    completeCode: "docker run -d --network todo-app --network-alias mysql -e MYSQL_ROOT_PASSWORD=secret mysql:8.0"
  },

  {
    id: 27,
    title: "Puertos y Paths: HOST vs CONTAINER",
    stars: 2,
    category: "CONCEPTOS",
    description: "Reconoce el mapeo de puertos y la dirección del enlace.",
    objective: "Identificar HOST : CONTAINER en puertos",
    tags: ["ports", "networking", "basics"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Mapeo de Puertos

Regla de la guía de atajos:
Cuando veas configuraciones de puertos como:
  -p 6000:6379
Recuerda que el primer puerto representa a la máquina física local (**HOST**), y el segundo representa al puerto interno en el contenedor (**CONTAINER**).
  HOST : CONTAINER`,
    explanationText: "Ingresa los términos correctos del mapeo: 'host' y 'contenedor'.",
    codeSnippet: "En el comando -p 6000:6379, el puerto 6000 corresponde al [INPUT_1] y el puerto 6379 corresponde al [INPUT_2].",
    inputs: { INPUT_1: "host", INPUT_2: "contenedor" },
    completeCode: "-p HOST:CONTAINER mapea puertos del host hacia el contenedor."
  },

  {
    id: 28,
    title: "Dockerfile: Declaración de Herencia",
    stars: 2,
    category: "DOCKERFILE",
    description: "Especifica la base de la imagen a crear usando la instrucción FROM.",
    objective: "Escribir FROM en un Dockerfile",
    tags: ["dockerfile", "from", "node"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: La instrucción FROM

Toda construcción en Docker hereda de una imagen base existente.
  - FROM node:18.3.1
  - FROM node:18.3.1 AS builder (Para multi-stage asignando alias)`,
    explanationText: "Completa con: 'FROM' y 'AS'.",
    codeSnippet: "# Definir herencia base asignando alias 'builder':\n[INPUT_1] node:18.3.1 [INPUT_2] builder",
    inputs: { INPUT_1: "FROM", INPUT_2: "AS" },
    completeCode: "FROM node:18.3.1 AS builder"
  },

  {
    id: 29,
    title: "Dockerfile: Especificar la Plataforma",
    stars: 3,
    category: "DOCKERFILE",
    description: "Configura la arquitectura de destino en el Dockerfile para garantizar compatibilidad con chips Apple Silicon o Intel.",
    objective: "Usar la bandera --platform en FROM",
    tags: ["dockerfile", "platform", "mac", "m1"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Bandera --platform en Dockerfile

Para asegurar que una imagen se construya específicamente para una arquitectura de procesador en particular (ej. procesadores Intel x64 al desarrollar en Macs con Apple Silicon M1/M2/M3):
  FROM --platform=linux/amd64 node:18-alpine`,
    explanationText: "Completa la línea base: '--platform=linux/amd64'.",
    codeSnippet: "# Basa la imagen en node en arquitectura amd64:\nFROM [INPUT_1] node:18-alpine",
    inputs: { INPUT_1: "--platform=linux/amd64" },
    completeCode: "FROM --platform=linux/amd64 node:18-alpine"
  },

  {
    id: 30,
    title: "Dockerfile: Variables de entorno internas (ENV)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Crea y utiliza variables de entorno dentro del proceso de construcción.",
    objective: "Usar la instrucción ENV en Dockerfiles",
    tags: ["dockerfile", "env", "variables"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Variables de Entorno en Dockerfile

La instrucción 'ENV' permite definir variables persistentes tanto en la compilación como en el runtime del contenedor:
  ENV APP_HOME /app
  RUN mkdir $APP_HOME`,
    explanationText: "Especifica la declaración y uso: 'ENV' y 'mkdir'.",
    codeSnippet: "# Declarar la variable de entorno:\n[INPUT_1] APP_HOME /app\n\n# Usar la variable declarada:\nRUN [INPUT_2] $APP_HOME",
    inputs: { INPUT_1: "ENV", INPUT_2: "mkdir" },
    completeCode: "ENV APP_HOME /app\nRUN mkdir $APP_HOME"
  },

  {
    id: 31,
    title: "Dockerfile: Inicialización de paquetes (RUN)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Instala los módulos necesarios para tu aplicación en la imagen.",
    objective: "Escribir instrucciones RUN en Dockerfiles",
    tags: ["dockerfile", "run", "npm", "yarn"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: La instrucción RUN

'RUN' ejecuta comandos durante la construcción de la imagen.
Ejemplos comunes para instalar dependencias:
  - RUN npm install
  - RUN yarn install --frozen-lockfile (Bloquea versiones estrictas en Yarn)`,
    explanationText: "Completa con: 'RUN' y 'install'.",
    codeSnippet: "# Instalar dependencias con npm:\n[INPUT_1] npm [INPUT_2]\n\n# Instalar con yarn congelando dependencias:\nRUN yarn install --frozen-lockfile",
    inputs: { INPUT_1: "RUN", INPUT_2: "install" },
    completeCode: "RUN npm install && RUN yarn install --frozen-lockfile"
  },

  {
    id: 32,
    title: "Dockerfile: Establecer directorio de trabajo (WORKDIR)",
    stars: 2,
    category: "DOCKERFILE",
    description: "Cambia el directorio de trabajo activo dentro de la imagen.",
    objective: "Escribir WORKDIR en Dockerfiles",
    tags: ["dockerfile", "workdir", "path"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: La instrucción WORKDIR

Establece que, a partir de ese punto, todos los comandos RUN, CMD, ENTRYPOINT, COPY y ADD se ejecutarán en la ruta especificada. Es equivalente a hacer un 'cd' en Linux.
  WORKDIR /app`,
    explanationText: "Ingresa el comando: 'WORKDIR'.",
    codeSnippet: "# Cambiar el directorio de trabajo a /app:\n[INPUT_1] /app",
    inputs: { INPUT_1: "WORKDIR" },
    completeCode: "WORKDIR /app"
  },

  {
    id: 33,
    title: "Dockerfile: Punto de montaje (VOLUME)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Declara un punto de montaje para crear volúmenes de forma automática en el arranque.",
    objective: "Usar la instrucción VOLUME en Dockerfile",
    tags: ["dockerfile", "volume", "storage"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Instrucción VOLUME

Declara un punto de montaje con la ruta especificada y marca ese directorio como persistente. Si el usuario no monta un volumen manualmente al correr el contenedor, Docker creará un volumen anónimo automáticamente.
  VOLUME ["/data"]`,
    explanationText: "Completa la instrucción: 'VOLUME'.",
    codeSnippet: "# Declarar punto de montaje para /data:\n[INPUT_1] [\"/data\"]",
    inputs: { INPUT_1: "VOLUME" },
    completeCode: "VOLUME [\"/data\"]"
  },

  {
    id: 34,
    title: "Dockerfile: Copiar archivos (ADD vs COPY)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Aprende a inyectar archivos locales y dependencias en tu imagen.",
    objective: "Usar ADD y COPY en Dockerfiles",
    tags: ["dockerfile", "copy", "add"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: ADD y COPY

• ADD: Copia archivos del host al contenedor. Adicionalmente, puede descargar URLs o desempaquetar archivos comprimidos (.tar, .zip) automáticamente.
  - ADD file.xyz /file.xyz
• COPY: Copia archivos locales sin funciones adicionales. Es la recomendada para copias estándar.
  - COPY package.json yarn.lock ./`,
    explanationText: "Completa con: 'ADD' y 'COPY'.",
    codeSnippet: "# Usar ADD para inyectar archivo local:\n[INPUT_1] file.xyz /file.xyz\n\n# Usar COPY para archivos de dependencias:\n[INPUT_2] package.json yarn.lock ./",
    inputs: { INPUT_1: "ADD", INPUT_2: "COPY" },
    completeCode: "ADD file.xyz /file.xyz && COPY package.json yarn.lock ./"
  },

  {
    id: 35,
    title: "Dockerfile: Comando por defecto (CMD)",
    stars: 2,
    category: "DOCKERFILE",
    description: "Establece el comando inicial que arrancará tu aplicación.",
    objective: "Escribir un comando CMD de producción",
    tags: ["dockerfile", "cmd", "exec"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: La instrucción CMD

Determina el comando que ejecutará el contenedor al arrancar. Debe especificarse utilizando formato de array JSON (preferred form):
  CMD [ "node","dist/main" ]`,
    explanationText: "Completa el CMD en formato array JSON: 'CMD', '\"node\"' y '\"dist/main\"'.",
    codeSnippet: "# Ejecutar la app al arrancar el contenedor:\n[INPUT_1] [ [INPUT_2],[INPUT_3] ]",
    inputs: { INPUT_1: "CMD", INPUT_2: "\"node\"", INPUT_3: "\"dist/main\"" },
    completeCode: "CMD [ \"node\",\"dist/main\" ]"
  },

  {
    id: 36,
    title: "Compilar sin caché de capas",
    stars: 3,
    category: "DOCKERFILE",
    description: "Fuerza a Docker a descargar paquetes e instalar dependencias ignorando la caché.",
    objective: "Utilizar la bandera --no-cache en docker build",
    tags: ["build", "cache", "no-cache"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Invalidar Caché de Construcción

Si deseas evitar que Docker use sus capas previamente construidas (por ejemplo, si agregaste cambios en servidores externos que no se ven en el Dockerfile):
  docker build --no-cache -t myImage:myTag .`,
    explanationText: "Especifica la opción de no-cache: '--no-cache' y '.'.",
    codeSnippet: "# Construir imagen limpiando caché:\ndocker build [INPUT_1] -t myImage:myTag [INPUT_2]",
    inputs: { INPUT_1: "--no-cache", INPUT_2: "." },
    completeCode: "docker build --no-cache -t myImage:myTag ."
  },

  {
    id: 37,
    title: "Compose: Especificar contexto y Dockerfile",
    stars: 3,
    category: "COMPOSE",
    description: "Configura la construcción de servicios detallando la ruta y el nombre del Dockerfile.",
    objective: "Configurar la sección build en docker-compose.yml",
    tags: ["compose", "build", "context"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Sección build en Docker Compose

En el docker-compose.yml, si un servicio no utiliza una imagen pre-compilada, puedes compilarlo localmente:
  build:
    context: . (Establece el directorio raíz del proyecto para la copia)
    dockerfile: Dockerfile (Establece el archivo Dockerfile a leer)`,
    explanationText: "Completa con: 'build', 'context' y 'dockerfile'.",
    codeSnippet: "services:\n  anylistapp:\n    [INPUT_1]:\n      [INPUT_2]: .\n      [INPUT_3]: Dockerfile",
    inputs: { INPUT_1: "build", INPUT_2: "context", INPUT_3: "dockerfile" },
    completeCode: "build: context: . dockerfile: Dockerfile"
  },

  {
    id: 38,
    title: "Compose: Establecer el directorio de trabajo y comando",
    stars: 3,
    category: "COMPOSE",
    description: "Configura el working directory y el comando del contenedor en tu docker-compose.yml.",
    objective: "Configurar working_dir y command en Compose",
    tags: ["compose", "working_dir", "command"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Configuración de servicios en Compose

Puedes sobrescribir las configuraciones por defecto de la imagen desde tu YAML:
  • working_dir: /app (Establece el directorio de trabajo dentro del contenedor)
  • command: sh -c "yarn install && yarn run dev" (Ejecuta comandos de instalación y arranque)`,
    explanationText: "Completa los parámetros: 'working_dir' y 'command'.",
    codeSnippet: "services:\n  anylistapp:\n    image: node:18-alpine\n    [INPUT_1]: /app\n    [INPUT_2]: sh -c \"yarn install && yarn run dev\"",
    inputs: { INPUT_1: "working_dir", INPUT_2: "command" },
    completeCode: "working_dir: /app | command: sh -c \"yarn install && yarn run dev\""
  },

  {
    id: 39,
    title: "Compose: Forzar nombres específicos de contenedor",
    stars: 3,
    category: "COMPOSE",
    description: "Asigna un nombre fijo al contenedor de tu servicio en Compose.",
    objective: "Configurar container_name en Compose",
    tags: ["compose", "container_name"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Nombres de Contenedor en Compose

Por defecto, Compose genera nombres basados en la nomenclatura '<proyecto>_<servicio>_<replica>'. Si deseas fijar un nombre exacto y amigable:
  container_name: AnylistApp`,
    explanationText: "Completa la directiva: 'container_name'.",
    codeSnippet: "services:\n  anylistapp:\n    [INPUT_1]: AnylistApp",
    inputs: { INPUT_1: "container_name" },
    completeCode: "container_name: AnylistApp"
  },

  {
    id: 40,
    title: "Compose: Políticas de reinicio (restart)",
    stars: 3,
    category: "COMPOSE",
    description: "Asegura que tu base de datos o API se reinicie si el sistema del host se detiene.",
    objective: "Configurar restart: always en Compose",
    tags: ["compose", "restart", "always"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Política de reinicio

La directiva 'restart' controla los reinicios automáticos ante caídas o reinicios del host físico:
  restart: always`,
    explanationText: "Completa la configuración: 'restart' y 'always'.",
    codeSnippet: "services:\n  anylistapp:\n    [INPUT_1]: [INPUT_2]",
    inputs: { INPUT_1: "restart", INPUT_2: "always" },
    completeCode: "restart: always"
  },

  {
    id: 41,
    title: "Compose: Mapeo de puertos en YAML",
    stars: 2,
    category: "COMPOSE",
    description: "Mapea los puertos del host a tu contenedor en Compose.",
    objective: "Definir puertos en formato YAML",
    tags: ["compose", "ports"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Puertos en Compose

El mapeo de puertos se escribe como una lista en el formato:
  ports:
    - HOST:CONTAINER
Ejemplo de la guía:
  ports:
    - 8080:3000`,
    explanationText: "Completa con: 'ports' y '8080:3000'.",
    codeSnippet: "services:\n  anylistapp:\n    [INPUT_1]:\n      - [INPUT_2]",
    inputs: { INPUT_1: "ports", INPUT_2: "8080:3000" },
    completeCode: "ports: - 8080:3000"
  },

  {
    id: 42,
    title: "Compose: Levantar servicios (docker compose up -d)",
    stars: 3,
    category: "COMPOSE",
    description: "Levanta todos los servicios en background usando la CLI de Compose.",
    objective: "Utilizar docker compose up -d",
    tags: ["compose", "up", "detach"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Levantar Ambientes

Para procesar el docker-compose.yml y arrancar todos los servicios en segundo plano:
  docker compose up -d
-d: Corre desenlazado de la consola de ejecución.`,
    explanationText: "Completa el comando: 'compose', 'up' y '-d'.",
    codeSnippet: "# Levantar servicios en background:\ndocker [INPUT_1] [INPUT_2] [INPUT_3]",
    inputs: { INPUT_1: "compose", INPUT_2: "up", INPUT_3: "-d" },
    completeCode: "docker compose up -d"
  },

  {
    id: 43,
    title: "Compose: Monitorear logs (docker compose logs -f)",
    stars: 3,
    category: "COMPOSE",
    description: "Monitorea los logs en vivo de todos los servicios orquestados.",
    objective: "Seguir logs unificados en Compose",
    tags: ["compose", "logs", "follow"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Logs consolidados

Para revisar las salidas de terminal de tus contenedores de Compose:
  docker compose logs -f
-f: Follows (Seguir los nuevos logs mostrados en vivo).`,
    explanationText: "Completa con: 'logs' y '-f'.",
    codeSnippet: "# Ver y seguir logs de compose:\ndocker compose [INPUT_1] [INPUT_2]",
    inputs: { INPUT_1: "logs", INPUT_2: "-f" },
    completeCode: "docker compose logs -f"
  },

  {
    id: 44,
    title: "Compose: Apagar y limpiar (docker compose down)",
    stars: 3,
    category: "COMPOSE",
    description: "Detén los contenedores de Compose y remueve las redes privadas de un solo golpe.",
    objective: "Utilizar docker compose down",
    tags: ["compose", "down", "cleanup"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Apagado y limpieza

Para apagar la aplicación de forma completa y ordenada:
  docker compose down
Los contenedores se detendrán y la red interna creada se removerá.`,
    explanationText: "Completa el comando: 'down'.",
    codeSnippet: "# Apagar servicios y remover redes de compose:\ndocker compose [INPUT_1]",
    inputs: { INPUT_1: "down" },
    completeCode: "docker compose down"
  },

  {
    id: 45,
    title: "Nomenclatura de contenedores en Compose",
    stars: 2,
    category: "CONCEPTOS",
    description: "Entiende el patrón de nombres automático que genera Docker Compose.",
    objective: "Identificar la estructura de nombres de Compose",
    tags: ["compose", "container_name", "nomenclature"],
    fileName: "Teoría",
    completed: false,
    theory: `📚 TEORÍA: Nomenclatura por defecto

A menos que especifiques un 'container_name' explícito, Docker Compose nombra a tus contenedores usando la estructura:
  <project-name>_<service-name>_<replica-number>
Donde:
  - project-name: Nombre de la carpeta del proyecto.
  - service-name: Nombre del servicio definido en el YAML (ej. 'database').
  - replica-number: Número correlativo de la réplica (ej. '1').`,
    explanationText: "Ingresa el nombre del contenedor: '<project-name>_<service-name>_<replica-number>'.",
    codeSnippet: "La estructura de nombres automática en Compose sigue el patrón: [INPUT_1]",
    inputs: { INPUT_1: "<project-name>_<service-name>_<replica-number>" },
    completeCode: "<project-name>_<service-name>_<replica-number>"
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SECCIÓN 3: NIVEL DIFICIL (20 EJERCICIOS) ────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 46,
    title: "Escaneo de imágenes con docker scan (Best Practices)",
    stars: 4,
    category: "SEGURIDAD",
    description: "Realiza un análisis local de seguridad para buscar vulnerabilidades en tu imagen.",
    objective: "Utilizar docker scan",
    tags: ["scan", "security", "snyk"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Escaneo de Seguridad local

Después de construir una imagen, es una excelente práctica de seguridad realizar un escaneo para detectar huecos de seguridad:
  docker scan getting-started
  docker scan getting-started:1.0.0
Esta herramienta está integrada con Snyk para proteger dependencias y código.`,
    explanationText: "Completa el comando: 'scan' y 'getting-started:1.0.0'.",
    codeSnippet: "# Escanear una imagen con tag específico:\ndocker [INPUT_1] [INPUT_2]",
    inputs: { INPUT_1: "scan", INPUT_2: "getting-started:1.0.0" },
    completeCode: "docker scan getting-started:1.0.0"
  },

  {
    id: 47,
    title: "Historial de capas (docker image history)",
    stars: 4,
    category: "CLI",
    description: "Rastrea las capas de construcción de tu imagen de Docker.",
    objective: "Utilizar docker image history",
    tags: ["history", "layers", "image"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Historial de Capas

Cada imagen se construye basada en capas, y cada paso en un Dockerfile crea una nueva capa.
Para auditar qué instrucciones del Dockerfile crearon cada capa y cuánto peso añadieron:
  docker image history getting-started`,
    explanationText: "Completa el comando: 'history'.",
    codeSnippet: "# Inspeccionar el historial de capas de la imagen 'getting-started':\ndocker image [INPUT_1] getting-started",
    inputs: { INPUT_1: "history" },
    completeCode: "docker image history getting-started"
  },

  {
    id: 48,
    title: "Multi-stage build con Yarn (Best Practices)",
    stars: 4,
    category: "DOCKERFILE",
    description: "Escribe un Dockerfile multi-stage usando Yarn y sirviendo la salida en Nginx.",
    objective: "Escribir un build multi-stage con Nginx y Yarn",
    tags: ["multistage", "yarn", "nginx", "best-practices"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Multi-stage builds con Nginx y Yarn

Ejemplo oficial de la guía de atajos:
  FROM node:18 AS build
  WORKDIR /app
  COPY package* yarn.lock ./
  RUN yarn install
  COPY public ./public
  COPY src ./src
  RUN yarn run build

  FROM nginx:alpine
  COPY --from=build /app/build /usr/share/nginx/html`,
    explanationText: "Completa el Dockerfile: 'AS', 'yarn install', 'nginx:alpine' y 'build'.",
    codeSnippet: "FROM node:18 [INPUT_1] build\nWORKDIR /app\nCOPY package* yarn.lock ./\nRUN [INPUT_2]\nCOPY public ./public\nCOPY src ./src\nRUN yarn run build\n\nFROM [INPUT_3]\nCOPY --from=[INPUT_4] /app/build /usr/share/nginx/html",
    inputs: { INPUT_1: "AS", INPUT_2: "yarn install", INPUT_3: "nginx:alpine", INPUT_4: "build" },
    completeCode: "FROM node:18 AS build ... RUN yarn install ... FROM nginx:alpine COPY --from=build /app/build /usr/share/nginx/html"
  },

  {
    id: 49,
    title: "Variables de entorno desde archivo .env en Compose",
    stars: 4,
    category: "COMPOSE",
    description: "Interpolación de contraseñas y configuraciones dinámicas en el docker-compose.yml.",
    objective: "Configurar variables de entorno leyendo de .env",
    tags: ["compose", "env", "security"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Variables de Entorno en Compose

Para evitar revelar contraseñas y llaves JWT en tu YAML, utiliza archivos '.env' locales:
  environment:
    - STATE=prod
    - DB_PASSWORD=\${DB_PASSWORD}
    - DB_NAME=\${DB_NAME}
    - JWT_SECRET=\${JWT_SECRET}`,
    explanationText: "Completa la sintaxis de interpolación: 'DB_PASSWORD' y 'JWT_SECRET'.",
    codeSnippet: "services:\n  anylistapp:\n    environment:\n      - STATE=prod\n      - DB_PASSWORD=${[INPUT_1]}\n      - JWT_SECRET=${[INPUT_2]}",
    inputs: { INPUT_1: "DB_PASSWORD", INPUT_2: "JWT_SECRET" },
    completeCode: "DB_PASSWORD: ${DB_PASSWORD} | JWT_SECRET: ${JWT_SECRET}"
  },

  {
    id: 50,
    title: "Compose: Mapeo de volumen relativo",
    stars: 3,
    category: "COMPOSE",
    description: "Configura un bind mount de desarrollo usando una ruta relativa en Compose.",
    objective: "Vincular directorios locales de forma relativa",
    tags: ["compose", "volumes", "bind mount"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Rutas Relativas en Compose

A diferencia de Docker CLI donde debes usar rutas absolutas (como \$(pwd)), en Docker Compose puedes usar rutas relativas para referenciar carpetas locales:
  volumes:
    - ./:/app`,
    explanationText: "Completa el mapeo del volumen: './:/app'.",
    codeSnippet: "services:\n  anylistapp:\n    volumes:\n      - [INPUT_1]",
    inputs: { INPUT_1: "./:/app" },
    completeCode: "volumes: - ./:/app"
  },

  {
    id: 51,
    title: "BuildX - Crear un Builder local",
    stars: 4,
    category: "BUILDX",
    description: "Crea y activa un builder BuildX para compilar imágenes multi-arquitectura.",
    objective: "Iniciar el motor de BuildX",
    tags: ["buildx", "multiarch", "cli"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Creación de Builders

Para habilitar la compilación multi-plataforma:
  docker buildx create --name mi-builder --use
  docker buildx inspect --bootstrap`,
    explanationText: "Completa con: 'create' y '--use'.",
    codeSnippet: "# Crear y configurar el builder:\ndocker buildx [INPUT_1] --name mi-builder [INPUT_2]",
    inputs: { INPUT_1: "create", INPUT_2: "--use" },
    completeCode: "docker buildx create --name mi-builder --use"
  },

  {
    id: 52,
    title: "BuildX - Compilar multi-plataforma (--platform)",
    stars: 4,
    category: "BUILDX",
    description: "Compila y empuja una imagen compatible con procesadores Intel y ARM.",
    objective: "Construir imágenes multi-arquitectura",
    tags: ["buildx", "platform", "push"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Compilación Multi-arquitectura

Para construir imágenes y subirlas directamente al registro:
  docker buildx build --platform linux/amd64,linux/arm64 -t miusuario/mi-app:1.0.0 --push .`,
    explanationText: "Completa con: 'platform', 'push' y '.'.",
    codeSnippet: "# Compilar y empujar:\ndocker buildx build --[INPUT_1] linux/amd64,linux/arm64 -t miusuario/mi-app:1.0.0 --[INPUT_2] [INPUT_3]",
    inputs: { INPUT_1: "platform", INPUT_2: "push", INPUT_3: "." },
    completeCode: "docker buildx build --platform linux/amd64,linux/arm64 -t miusuario/mi-app:1.0.0 --push ."
  },

  {
    id: 53,
    title: "GitHub Actions - CI con Docker",
    stars: 4,
    category: "CI/CD",
    description: "Crea un paso de Integración Continua que ejecute pruebas unitarias dentro del contenedor.",
    objective: "Ejecutar validaciones automatizadas en GitHub Actions",
    tags: ["github actions", "ci", "testing"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Pruebas automatizadas en CI

En entornos de Integración Continua (CI), ejecutamos pruebas dentro del contenedor de Docker:
  - docker build -t test-image -f Dockerfile.dev .
  - docker run --rm test-image npm run test`,
    explanationText: "Completa la configuración del Workflow: 'rm' y 'test'.",
    codeSnippet: "jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Run tests inside Docker\n        run: |\n          docker build -t test-image -f Dockerfile.dev .\n          docker run --[INPUT_1] test-image npm run [INPUT_2]",
    inputs: { INPUT_1: "rm", INPUT_2: "test" },
    completeCode: "docker run --rm test-image npm run test"
  },

  {
    id: 54,
    title: "GitHub Actions - Login en Docker Hub",
    stars: 4,
    category: "CI/CD",
    description: "Autentícate de forma segura en Docker Hub usando secretos de GitHub.",
    objective: "Configurar inicio de sesión en registros de contenedores",
    tags: ["github actions", "secrets", "docker hub", "auth"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Autenticación en Pipelines

Para subir imágenes a tu registro de contenedores privado o público desde un pipeline de CI/CD:
  - Usamos la acción oficial 'docker/login-action'.
  - Almacenamos el usuario y el Token de Acceso en los Secrets del repositorio de GitHub.`,
    explanationText: "Especifica la acción de login: 'action', 'USERNAME' y 'TOKEN'.",
    codeSnippet: "      - name: Login to Docker Hub\n        uses: docker/login-[INPUT_1]@v3\n        with:\n          username: \${{ secrets.DOCKERHUB_[INPUT_2] }}\n          password: \${{ secrets.DOCKERHUB_[INPUT_3] }}",
    inputs: { INPUT_1: "action", INPUT_2: "USERNAME", INPUT_3: "TOKEN" },
    completeCode: "uses: docker/login-action@v3"
  },

  {
    id: 55,
    title: "GitHub Actions - Autenticación en Digital Ocean Registry",
    stars: 4,
    category: "CI/CD",
    description: "Configura el inicio de sesión en el registro de contenedores privado de Digital Ocean.",
    objective: "Instalar doctl y autenticarse en Digital Ocean",
    tags: ["digital ocean", "doctl", "registry", "github actions"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Autenticación en DOCR

DOCR (Digital Ocean Container Registry) requiere autenticarse mediante doctl:
  1. Usamos la acción oficial de Digital Ocean para instalar 'doctl'.
  2. Ejecutamos el comando 'doctl registry login' con un tiempo de expiración corto.`,
    explanationText: "Completa la configuración de Digital Ocean: 'doctl', 'expiry-seconds' y '1200'.",
    codeSnippet: "      - name: Install Doctl\n        uses: digitalocean/action-[INPUT_1]@v2\n        with:\n          token: \${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}\n      - name: Login to DO Container Registry\n        run: doctl registry login --[INPUT_2]-credentials [INPUT_3]",
    inputs: { INPUT_1: "doctl", INPUT_2: "expiry-seconds", INPUT_3: "1200" },
    completeCode: "doctl registry login --expiry-seconds 1200"
  },

  {
    id: 56,
    title: "GitHub Actions - Build & Push Automatizado",
    stars: 4,
    category: "CI/CD",
    description: "Construye y empuja imágenes etiquetándolas con el commit Hash de Git.",
    objective: "Configurar compilación y envío en el pipeline de CI/CD",
    tags: ["github actions", "push", "sha", "tag"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Trazabilidad de Versiones

Es una buena práctica etiquetar las imágenes con el tag ':latest' y adicionalmente con el Hash corto del commit Git de la request (\${{ github.sha }}). Esto garantiza la trazabilidad del código.`,
    explanationText: "Ingresa las llaves de la acción: 'action', 'true' y 'sha'.",
    codeSnippet: "      - name: Build and Push Docker image\n        uses: docker/build-push-[INPUT_1]@v5\n        with:\n          context: .\n          push: [INPUT_2]\n          tags: |\n            miregistro.co/mi-app:latest\n            miregistro.co/mi-app:\${{ github.[INPUT_3] }}",
    inputs: { INPUT_1: "action", INPUT_2: "true", INPUT_3: "sha" },
    completeCode: "uses: docker/build-push-action@v5"
  },

  {
    id: 57,
    title: "GitHub Actions - Estrategia de Cache de Capas",
    stars: 5,
    category: "CI/CD",
    description: "Optimiza los tiempos de build en tus pipelines de GitHub Actions configurando caché de capas.",
    objective: "Reducir tiempos de compilación usando caché en la nube",
    tags: ["github actions", "cache", "performance", "optimization"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Cacheo de Capas en CI/CD

El uso de caché evita compilar de nuevo capas que no cambiaron (por ejemplo, la descarga de paquetes npm/nuget):
  - cache-from: type=gha
  - cache-to: type=gha,mode=max`,
    explanationText: "Completa el tipo y modo de caché: 'gha' y 'max'.",
    codeSnippet: "      - name: Build with Cache\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: miregistro.co/mi-app:latest\n          cache-from: type=[INPUT_1]\n          cache-to: type=gha,mode=[INPUT_2]",
    inputs: { INPUT_1: "gha", INPUT_2: "max" },
    completeCode: "cache-from: type=gha | cache-to: type=gha,mode=max"
  },

  {
    id: 58,
    title: "Digital Ocean - Despliegue en App Platform",
    stars: 4,
    category: "CLOUD",
    description: "Configura el archivo descriptor de Digital Ocean para desplegar tu contenedor.",
    objective: "Escribir un app.yaml para Digital Ocean App Platform",
    tags: ["digital ocean", "cloud", "deployment", "yaml"],
    fileName: "app.yaml",
    completed: false,
    theory: `📚 TEORÍA: PaaS de Digital Ocean

App Platform lee la configuración declarada en 'app.yaml' para compilar e iniciar la aplicación basándose en la imagen del registro de contenedores de Digital Ocean:
  - registry_type: digitalocean
  - value: \${db.DATABASE_URL}`,
    explanationText: "Completa la configuración: 'digitalocean', 'DATABASE_URL' y 'pg'.",
    codeSnippet: "name: mi-app-web\nregion: nyc\nservices:\n  - name: backend-api\n    image:\n      registry_type: [INPUT_1]\n      registry: mi-registro-do\n      repository: mi-api\n      tag: latest\n    run_command: dotnet MiApi.dll\n    envs:\n      - key: DATABASE_URL\n        scope: RUN_TIME\n        value: \${db.[INPUT_2]}\ndatabases:\n  - name: db\n    engine: [INPUT_3]",
    inputs: { INPUT_1: "digitalocean", INPUT_2: "DATABASE_URL", INPUT_3: "pg" },
    completeCode: "registry_type: digitalocean | value: ${db.DATABASE_URL} | engine: pg"
  },

  {
    id: 59,
    title: "Límites de recursos en producción",
    stars: 4,
    category: "CONTENEDORES",
    description: "Limita la memoria RAM y CPU máxima de tus bases de datos Postgres.",
    objective: "Establecer límites de hardware a los contenedores",
    tags: ["limits", "memory", "cpu"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Límites de Recursos

Para prevenir que un contenedor monopolice todo el servidor físico, establece límites estrictos al ejecutar:
  - --memory="512m" (RAM máxima)
  - --cpus=1.0 (Límite de procesador)`,
    explanationText: "Completa con: 'memory' y 'cpus'.",
    codeSnippet: "# Limitar el contenedor Postgres a un máximo de 512MB de memoria RAM y 1 core de CPU:\ndocker container run -d --name db-limitada \\\n  --[INPUT_1]=\"512m\" \\\n  --[INPUT_2]=1.0 \\\n  postgres:alpine",
    inputs: { INPUT_1: "memory", INPUT_2: "cpus" },
    completeCode: "docker run --memory=\"512m\" --cpus=1.0 postgres:alpine"
  },

  {
    id: 60,
    title: "Seguridad: Escaneo con Trivy",
    stars: 4,
    category: "SEGURIDAD",
    description: "Utiliza herramientas de análisis estático de seguridad para detectar vulnerabilidades.",
    objective: "Implementar análisis de vulnerabilidades con Trivy",
    tags: ["security", "trivy", "vulnerability"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Trivy Vulnerability Scan

Trivy busca brechas de seguridad y librerías vulnerables (CVEs) en tu imagen:
  trivy image node:20
  trivy image --severity HIGH,CRITICAL node:20`,
    explanationText: "Ingresa el nombre del comando y parámetros de severidad: 'trivy', 'severity' y 'node:20'.",
    codeSnippet: "# Escaneo con Trivy:\n[INPUT_1] image node:20\n# Escaneo filtrado por severidad:\ntrivy image --[INPUT_2] HIGH,CRITICAL [INPUT_3]",
    inputs: { INPUT_1: "trivy", INPUT_2: "severity", INPUT_3: "node:20" },
    completeCode: "trivy image node:20 --severity HIGH,CRITICAL"
  },

  {
    id: 61,
    title: "Seguridad: Filesystem de solo lectura",
    stars: 5,
    category: "SEGURIDAD",
    description: "Protege tu servidor web bloqueando la posibilidad de escribir en el disco del contenedor.",
    objective: "Configurar un contenedor con sistema de archivos de solo lectura",
    tags: ["security", "read-only", "hardening"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: --read-only filesystem

Montar el sistema de archivos raíz de solo lectura evita que procesos maliciosos alteren carpetas estáticas:
  docker run -d --read-only nginx:alpine`,
    explanationText: "Ingresa el argumento: 'read-only' y 'escritura'.",
    codeSnippet: "# Correr Nginx con root fs de solo lectura:\ndocker container run -d --name nginx-seguro \\\n  --[INPUT_1] \\\n  -v cache-vol:/var/cache/nginx \\\n  -p 80:80 nginx:alpine\n\n# Nota: necesitas montar volúmenes para directorios donde Nginx requiere [INPUT_2] temporal.",
    inputs: { INPUT_1: "read-only", INPUT_2: "escritura" },
    completeCode: "docker run --read-only -v cache-vol:/var/cache/nginx nginx:alpine"
  },

  {
    id: 62,
    title: "Kubernetes - Arquitectura del Control Plane",
    stars: 4,
    category: "KUBERNETES",
    description: "Comprende la arquitectura interna de un clúster de Kubernetes.",
    objective: "Identificar componentes del Control Plane y Workers",
    tags: ["k8s", "architecture", "kubelet"],
    fileName: "Teoría",
    completed: false,
    theory: `📚 TEORÍA: Introducción a la Orquestación de Contenedores

La orquestación de contenedores es la automatización de gran parte del esfuerzo operativo requerido para ejecutar cargas de trabajo y servicios en contenedores.
  - Control Plane (Master Node): Administra el clúster.
  - Worker Nodes: Los servidores de ejecución física.
  - Kubelet: Componente residente en cada nodo que recibe las órdenes y gestiona los contenedores locales.`,
    explanationText: "Completa los conceptos de K8s: 'control plane', 'nodos' y 'kubelet'.",
    codeSnippet: "En un clúster de Kubernetes, el [INPUT_1] gestiona el estado global (planificador, API server, base de datos de configuración etcd). Los servidores que corren los contenedores reales se llaman [INPUT_2]. El componente residente en cada nodo que recibe las órdenes y gestiona los contenedores locales se llama [INPUT_3].",
    inputs: { INPUT_1: "control plane", INPUT_2: "nodos", INPUT_3: "kubelet" },
    completeCode: "Control Plane, Worker Nodes, Kubelet"
  },

  {
    id: 63,
    title: "K8s - kubectl y comandos esenciales",
    stars: 4,
    category: "KUBERNETES",
    description: "Aprende los comandos principales de CLI de la utilidad kubectl para auditar tu clúster.",
    objective: "Gestionar K8s con comandos kubectl",
    tags: ["k8s", "kubectl", "cli"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Comandos kubectl

kubectl es la herramienta oficial de línea de comandos para administrar Kubernetes:
  - kubectl get pods
  - kubectl describe pod mi-pod
  - kubectl logs -f mi-pod`,
    explanationText: "Completa los verbos: 'get', 'describe' y 'logs'.",
    codeSnippet: "# Listar Pods:\nkubectl [INPUT_1] pods\n# Ver detalles del pod:\nkubectl [INPUT_2] pod mi-pod\n# Seguir logs:\nkubectl [INPUT_3] -f mi-pod",
    inputs: { INPUT_1: "get", INPUT_2: "describe", INPUT_3: "logs" },
    completeCode: "kubectl get pods | kubectl describe pod mi-pod"
  },

  {
    id: 64,
    title: "K8s - Definición de un Pod",
    stars: 4,
    category: "KUBERNETES",
    description: "Escribe la definición básica en YAML para crear un Pod en Kubernetes.",
    objective: "Comprender la estructura de un archivo YAML de Pod",
    tags: ["k8s", "pod", "yaml"],
    fileName: "pod.yaml",
    completed: false,
    theory: `📚 TEORÍA: Objeto Pod en Kubernetes

Un Pod es la unidad ejecutable más pequeña de K8s. Agrupa uno o más contenedores que comparten almacenamiento e IP:
  apiVersion: v1
  kind: Pod
  metadata:
    name: api-pod
  spec:
    containers:
      - name: node-api
        image: node:20-alpine
        ports:
          - containerPort: 3000`,
    explanationText: "Completa con: 'kind', 'containers' y 'ports'.",
    codeSnippet: "apiVersion: v1\n[INPUT_1]: Pod\nmetadata:\n  name: api-pod\nspec:\n  [INPUT_2]:\n    - name: node-api\n      image: node:20-alpine\n      [INPUT_3]:\n        - containerPort: 3000",
    inputs: { INPUT_1: "kind", INPUT_2: "containers", INPUT_3: "ports" },
    completeCode: "kind: Pod | containers: | ports:"
  },

  {
    id: 65,
    title: "K8s - Exponer la App con un Service (LoadBalancer)",
    stars: 5,
    category: "KUBERNETES",
    description: "Crea un balanceador de carga público para distribuir tráfico entre tus réplicas de contenedores.",
    objective: "Configurar un Service de tipo LoadBalancer en Kubernetes",
    tags: ["k8s", "service", "loadbalancer", "yaml"],
    fileName: "service.yaml",
    completed: false,
    theory: `📚 TEORÍA: Kubernetes Services

Para exponer pods que cambian de IP dinámicamente, se crea un Servicio:
  - type: LoadBalancer (Crea un balanceador de carga en la nube)
  - targetPort: 8080 (Puerto expuesto por la app interna)
Para desplegar un recurso:
  kubectl apply -f service.yaml`,
    explanationText: "Ingresa los atributos de Kubernetes Service: 'LoadBalancer', 'targetPort' y 'apply'.",
    codeSnippet: "apiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  type: [INPUT_1]\n  selector:\n    app: api\n  ports:\n    - protocol: TCP\n      port: 80\n      [INPUT_2]: 8080\n\n# Aplicar el Service:\n# kubectl [INPUT_3] -f service.yaml",
    inputs: { INPUT_1: "LoadBalancer", INPUT_2: "targetPort", INPUT_3: "apply" },
    completeCode: "type: LoadBalancer | targetPort: 8080 | kubectl apply -f service.yaml"
  }
];
