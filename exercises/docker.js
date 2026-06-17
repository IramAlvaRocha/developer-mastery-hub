// ══════════════════════════════════════════════════════════════════════════════
// DOCKER & KUBERNETES — 65 ejercicios interactivos con teoría estructurada
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
    description: "Comienza entendiendo la diferencia clave entre contenedores y máquinas virtuales.",
    objective: "Comprender qué es un contenedor",
    tags: ["introduccion", "virtualizacion", "conceptos"],
    fileName: "Teoría",
    completed: false,
    theory: `📚 TEORÍA: Contenedores vs Máquinas Virtuales (VMs)

Una Máquina Virtual (VM) incluye la aplicación, las bibliotecas necesarias y un sistema operativo invitado (Guest OS) completo, lo que la hace pesada (gigabytes) y lenta para iniciar.

Un Contenedor de Docker es una unidad ligera que empaqueta únicamente la aplicación y sus dependencias necesarias. A diferencia de las VMs, no incluye un sistema operativo completo; en su lugar, comparte el kernel del sistema operativo del host. Esto los hace extremadamente eficientes, rápidos de iniciar (milisegundos) y ligeros (megabytes).

Docker es la plataforma que automatiza la creación, ejecución y despliegue de estos contenedores de forma estándar.`,
    explanationText: "Completa el texto con los conceptos correctos: 'codigo', 'dependencias' y 'kernel'.",
    codeSnippet: "Un contenedor empaqueta el [INPUT_1] y sus [INPUT_2] para ejecutarse de forma aislada. A diferencia de una máquina virtual, los contenedores comparten el [INPUT_3] del sistema operativo del host, lo que los hace extremadamente ligeros y rápidos de iniciar.",
    inputs: { INPUT_1: "codigo", INPUT_2: "dependencias", INPUT_3: "kernel" },
    completeCode: "Contenedores empaquetan código + dependencias compartiendo el kernel del host."
  },

  {
    id: 2,
    title: "Arquitectura de Docker Engine",
    stars: 1,
    category: "CONCEPTOS",
    description: "Identifica las piezas principales que hacen funcionar a Docker.",
    objective: "Comprender la arquitectura de Docker (Cliente-Servidor)",
    tags: ["arquitectura", "daemon", "registro"],
    fileName: "Teoría",
    completed: false,
    theory: `📚 TEORÍA: Componentes de Docker Engine

Docker utiliza una arquitectura cliente-servidor:
  1. Docker Daemon (dockerd): El servidor. Es el proceso en segundo plano de larga ejecución que gestiona objetos de Docker como imágenes, contenedores, redes y volúmenes.
  2. Docker CLI: El cliente. La interfaz de comandos que los desarrolladores usan para escribir comandos (ej. 'docker run'). Se comunica con el daemon usando una API REST local.
  3. Docker Registry: Un registro o almacén de imágenes. El más popular y por defecto es Docker Hub, de donde se descargan las imágenes oficiales (Postgres, Node, Nginx, etc.).`,
    explanationText: "Completa la explicación con: 'daemon', 'api' y 'registro'.",
    codeSnippet: "Docker utiliza una arquitectura cliente-servidor. El [INPUT_1] de Docker es el proceso en segundo plano (daemon) que administra imágenes y contenedores. El cliente se comunica con el daemon usando una [INPUT_2] REST. Las imágenes se descargan desde un [INPUT_3] de contenedores como Docker Hub.",
    inputs: { INPUT_1: "daemon", INPUT_2: "api", INPUT_3: "registro" },
    completeCode: "Docker CLI habla mediante API REST al dockerd (daemon) para bajar imágenes de un registro."
  },

  {
    id: 3,
    title: "Docker CLI: Sintaxis moderna vs tradicional",
    stars: 1,
    category: "CLI",
    description: "Docker renovó su sintaxis para estructurar comandos de forma orientada a objetos (docker <objeto> <comando>).",
    objective: "Aprender la nueva sintaxis estructurada de comandos",
    tags: ["cli", "sintaxis", "comandos"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Comandos de Docker CLI Modernos

Anteriormente, los comandos de Docker eran planos. Por ejemplo, para correr un contenedor se usaba simplemente 'docker run'.
En las versiones modernas, Docker organizó su CLI según el objeto que se administra:
  • docker container <action> -> Administrar contenedores (run, stop, rm, ls)
  • docker image <action>     -> Administrar imágenes (build, pull, push, ls)
  • docker network <action>   -> Administrar redes (create, connect, ls)
  • docker volume <action>    -> Administrar volúmenes (create, ls, rm)

Nota: Aunque la sintaxis legacy sigue funcionando, la industria y la documentación oficial promueven la sintaxis moderna.`,
    explanationText: "Completa los comandos tradicionales y modernos para ejecutar un contenedor: 'run', 'container' y 'run'.",
    codeSnippet: "# Sintaxis tradicional (legacy) para correr un contenedor:\ndocker [INPUT_1] -d -p 80:80 nginx\n\n# Sintaxis moderna (recomendada) enfocada en objetos:\ndocker [INPUT_2] [INPUT_3] -d -p 80:80 nginx",
    inputs: { INPUT_1: "run", INPUT_2: "container", INPUT_3: "run" },
    completeCode: "Sintaxis moderna: docker container run -d -p 80:80 nginx"
  },

  {
    id: 4,
    title: "Corriendo un servidor web (Nginx)",
    stars: 1,
    category: "CONTENEDORES",
    description: "Inicia un servidor web Nginx usando una imagen ligera de Alpine Linux.",
    objective: "Levantar un contenedor exponiendo puertos",
    tags: ["nginx", "puertos", "alpine"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Flags de ejecución comunes en Docker

Cuando ejecutas 'docker container run', puedes pasar varias banderas importantes:
  • -d (--detach): Ejecuta el contenedor en segundo plano (detached mode) liberando tu terminal.
  • -p host:container: Mapea un puerto de tu máquina (host) a un puerto interno del contenedor. Por ejemplo, -p 8080:80 mapea el puerto 8080 de tu PC al puerto 80 dentro del contenedor.
  • --name: Asigna un nombre amigable al contenedor. Si no lo especificas, Docker le asignará un nombre aleatorio (ej. 'nervous_heisenberg').
  • nginx:alpine: Especifica la imagen y la etiqueta (tag). Alpine indica una distribución Linux súper reducida y segura.`,
    explanationText: "Completa el comando con: 'p' (puertos), 'name' (nombre) y 'alpine' (tag ligero).",
    codeSnippet: "# Levantar un contenedor Nginx en segundo plano (detached mode) en el puerto 8080 local y llamarlo 'mi-web':\ndocker container run -d -[INPUT_1] 8080:80 --[INPUT_2] mi-web nginx:[INPUT_3]",
    inputs: { INPUT_1: "p", INPUT_2: "name", INPUT_3: "alpine" },
    completeCode: "docker container run -d -p 8080:80 --name mi-web nginx:alpine"
  },

  {
    id: 5,
    title: "Comprobar contenedores corriendo",
    stars: 1,
    category: "CLI",
    description: "Aprende a verificar qué contenedores se están ejecutando en tu sistema.",
    objective: "Listar contenedores activos e inactivos",
    tags: ["ps", "ls", "monitoreo"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Listado de contenedores

Para revisar la salud de tus contenedores, utilizas comandos de listado:
  • docker container ls: Muestra una tabla con los contenedores ejecutándose en este momento. Muestra ID, Imagen, Comando de inicio, fecha de creación, status, puertos mapeados y nombre.
  • docker container ls -a (o --all): Muestra todos los contenedores en el host, incluso aquellos que fallaron o se detuvieron.
  • docker ps: Es la abreviatura tradicional (legacy) idéntica a 'docker container ls'.`,
    explanationText: "Completa los comandos correspondientes: 'ls', 'a' y '-a'.",
    codeSnippet: "# Listar contenedores que están activos actualmente:\ndocker container [INPUT_1]\n\n# Listar TODOS los contenedores (activos e inactivos):\ndocker container ls -[INPUT_2]\n\n# Sintaxis tradicional para listar todos:\ndocker ps [INPUT_3]",
    inputs: { INPUT_1: "ls", INPUT_2: "a", INPUT_3: "-a" },
    completeCode: "docker container ls -a | docker ps -a"
  },

  {
    id: 6,
    title: "Obtener logs de un contenedor",
    stars: 1,
    category: "CLI",
    description: "Inspecciona la salida de consola (stdout/stderr) de tu contenedor para depurar.",
    objective: "Visualizar logs y seguir salida en vivo",
    tags: ["logs", "debug", "terminal"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Logs en Docker

Dado que los contenedores corren aislados y a menudo en segundo plano (-d), no imprimen logs directamente en tu pantalla de consola.
Para leer lo que está reportando la aplicación dentro del contenedor:
  • docker container logs <name_or_id>: Imprime todo el historial de consola.
  • -f (--follow): Activa la visualización interactiva para recibir nuevos logs a medida que ocurren (similar a un 'tail -f' en Linux).
  • --tail N: Muestra únicamente las últimas N líneas de la bitácora para evitar inundar la pantalla.`,
    explanationText: "Completa las opciones de logs: 'logs', 'f' y 'tail'.",
    codeSnippet: "# Ver logs de un contenedor con nombre 'mi-web':\ndocker container [INPUT_1] mi-web\n\n# Seguir los logs en tiempo real (modo interactivo/stream):\ndocker container logs -[INPUT_2] mi-web\n\n# Ver las últimas 20 líneas de logs:\ndocker container logs --[INPUT_3] 20 mi-web",
    inputs: { INPUT_1: "logs", INPUT_2: "f", INPUT_3: "tail" },
    completeCode: "docker container logs -f mi-web --tail 20"
  },

  {
    id: 7,
    title: "Detener y eliminar contenedores",
    stars: 1,
    category: "CONTENEDORES",
    description: "Aprende el ciclo de vida básico de parada y limpieza de recursos.",
    objective: "Detener y borrar contenedores",
    tags: ["stop", "rm", "lifecycle"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Ciclo de vida y destrucción

Cuando ya no requieres un contenedor, debes detenerlo y borrarlo para liberar recursos del host:
  1. docker container stop: Envía la señal SIGTERM al proceso principal del contenedor, dándole unos segundos para guardar estado y cerrarse ordenadamente. Si no responde, envía SIGKILL.
  2. docker container rm: Elimina la definición física del contenedor del almacenamiento de Docker. No puedes borrar un contenedor que está corriendo a menos que uses la bandera de fuerza '-f'.`,
    explanationText: "Completa el flujo del ciclo de vida: 'stop', 'rm' y 'f'.",
    codeSnippet: "# Detener el contenedor 'mi-web' enviando una señal SIGTERM:\ndocker container [INPUT_1] mi-web\n\n# Eliminar físicamente el contenedor 'mi-web' (debe estar detenido):\ndocker container [INPUT_2] mi-web\n\n# Forzar la detención y eliminación en un solo paso:\ndocker container rm -[INPUT_3] mi-web",
    inputs: { INPUT_1: "stop", INPUT_2: "rm", INPUT_3: "f" },
    completeCode: "docker container stop mi-web && docker container rm mi-web"
  },

  {
    id: 8,
    title: "Detener y eliminar todos los contenedores",
    stars: 2,
    category: "CLI",
    description: "Usa sub-consultas en la terminal para limpiar múltiples contenedores a la vez.",
    objective: "Limpieza masiva usando IDs de contenedores",
    tags: ["ls", "clean", "bash"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Queries en la consola de Docker

Si estás probando varias cosas, puedes terminar con decenas de contenedores detenidos que consumen espacio.
En lugar de detenerlos y borrarlos uno por uno, puedes combinar comandos:
  • docker container ls -a -q: La bandera '-q' (--quiet) indica que Docker solo debe devolver los IDs de los contenedores, sin formato de tabla.
  • Al envolver este comando en $(...) en Linux/Mac/PowerShell, pasamos todos los IDs resultantes como argumento al comando 'stop' o 'rm'.`,
    explanationText: "Escribe los flags de filtrado de listado: 'a' (todos), 'q' (quiet/ids) y 'q' para el comando rm.",
    codeSnippet: "# Detener todos los contenedores en ejecución obteniendo solo sus IDs (-q):\ndocker container stop $(docker container ls -[INPUT_1] -[INPUT_2])\n\n# Eliminar todos los contenedores registrados:\ndocker container rm $(docker container ls -a -[INPUT_3])",
    inputs: { INPUT_1: "a", INPUT_2: "q", INPUT_3: "q" },
    completeCode: "docker container rm $(docker container ls -aq)"
  },

  {
    id: 9,
    title: "Eliminar recursos huérfanos (Prune)",
    stars: 2,
    category: "CLI",
    description: "Libera espacio en disco eliminando de forma segura contenedores y redes en desuso.",
    objective: "Usar docker system prune para limpieza general",
    tags: ["prune", "disk", "limpieza"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: El recolector de basura de Docker

Con el tiempo, las imágenes antiguas, contenedores de prueba detenidos y redes temporales se acumulan y llenan el disco duro.
  • docker system prune: Es un comando integrado súper útil que elimina de un solo golpe:
     - Todos los contenedores detenidos.
     - Todas las redes que no sean usadas por al menos un contenedor.
     - Todas las imágenes sin etiqueta (dangling images).
  • --volumes: Por seguridad, prune no toca los volúmenes de datos por defecto (para evitar borrar bases de datos valiosas). Debes pasar esta bandera explícitamente si quieres borrarlos también.`,
    explanationText: "Completa los argumentos del comando de limpieza: 'prune' y 'volumes'.",
    codeSnippet: "# Eliminar contenedores detenidos, redes no utilizadas e imágenes sin etiqueta:\ndocker system [INPUT_1]\n\n# Eliminar todo lo anterior, incluyendo volúmenes huérfanos de base de datos:\ndocker system prune --[INPUT_2]",
    inputs: { INPUT_1: "prune", INPUT_2: "volumes" },
    completeCode: "docker system prune --volumes"
  },

  {
    id: 10,
    title: "Ejecutar comandos dentro de un contenedor (exec)",
    stars: 2,
    category: "CONTENEDORES",
    description: "Entra a un contenedor en ejecución para inspeccionar archivos locales o probar conexiones.",
    objective: "Ejecutar sh o bash de forma interactiva en un contenedor",
    tags: ["exec", "shell", "interactive"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: interactuar con procesos internos

Si necesitas revisar la estructura de carpetas de tu servidor web o correr un comando temporal dentro de tu API:
  • docker container exec: Ejecuta un comando secundario dentro de un contenedor que YA está corriendo.
  • -i (--interactive): Mantiene el STDIN abierto para que puedas escribir comandos.
  • -t (--tty): Asigna una pseudo-terminal para que se formatee correctamente la consola interactiva.
  • sh o bash: El shell de comandos del contenedor. En imágenes Alpine se suele usar 'sh' porque es más ligera.`,
    explanationText: "Especifica la acción de ejecución interactiva: 'exec', 'it' y 'sh'.",
    codeSnippet: "# Abrir una terminal interactiva (tty) dentro de un contenedor en ejecución llamado 'mi-web' usando la shell sh:\ndocker container [INPUT_1] -[INPUT_2] mi-web [INPUT_3]",
    inputs: { INPUT_1: "exec", INPUT_2: "it", INPUT_3: "sh" },
    completeCode: "docker container exec -it mi-web sh"
  },

  {
    id: 11,
    title: "Copiar archivos entre host y contenedor",
    stars: 2,
    category: "CLI",
    description: "Transfiere archivos de tu PC local a un contenedor o viceversa sin usar SSH.",
    objective: "Utilizar docker cp para transferencias de archivos",
    tags: ["cp", "copy", "files"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Copia bidireccional

A veces necesitas inyectar un archivo de configuración temporal o descargar un reporte generado por la aplicación en el contenedor.
El comando 'docker cp' te permite mover archivos de manera similar a 'scp' o 'cp' tradicional en Unix:
  • Copiar de host a contenedor: docker cp <archivo_local> <nombre_contenedor>:<ruta_interna>
  • Copiar de contenedor a host: docker cp <nombre_contenedor>:<ruta_interna> <archivo_destino_local>`,
    explanationText: "Completa el comando de copia: 'cp' y '.' (representando el directorio actual).",
    codeSnippet: "# Copiar un archivo local 'index.html' al contenedor 'mi-web' en el directorio de Nginx:\ndocker [INPUT_1] index.html mi-web:/usr/share/nginx/html/\n\n# Copiar logs del contenedor al directorio actual del host:\ndocker cp mi-web:/var/log/nginx/access.log [INPUT_2]",
    inputs: { INPUT_1: "cp", INPUT_2: "." },
    completeCode: "docker cp index.html mi-web:/usr/share/nginx/html/"
  },

  {
    id: 12,
    title: "Inspeccionar configuraciones (Inspect)",
    stars: 2,
    category: "CLI",
    description: "Obtén los detalles técnicos y de configuración interna de un contenedor en formato JSON.",
    objective: "Inspeccionar metadatos y filtrar resultados",
    tags: ["inspect", "metadata", "json"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: docker inspect

El comando 'docker container inspect' devuelve una estructura JSON detallada que describe toda la configuración de bajo nivel de un contenedor.
Contiene información crucial como:
  - Dirección IP interna asignada por el router de Docker.
  - Montaje de volúmenes de datos.
  - Variables de entorno cargadas.
  - Estado del healthcheck.
  • --format o -f: Permite aplicar sintaxis de plantillas de Go para extraer propiedades específicas sin tener que buscar en todo el JSON.`,
    explanationText: "Completa las opciones del comando de inspección: 'inspect' y 'format'.",
    codeSnippet: "# Inspeccionar los metadatos JSON completos del contenedor 'mi-web':\ndocker container [INPUT_1] mi-web\n\n# Filtrar el JSON usando la opción format para obtener la dirección IP:\ndocker container inspect --[INPUT_2] '{{ .NetworkSettings.IPAddress }}' mi-web",
    inputs: { INPUT_1: "inspect", INPUT_2: "format" },
    completeCode: "docker container inspect mi-web --format '{{ .NetworkSettings.IPAddress }}'"
  },

  {
    id: 13,
    title: "Variables de entorno básicas en CLI",
    stars: 1,
    category: "CLI",
    description: "Pasa valores de configuración dinámicos a un contenedor desde la línea de comandos.",
    objective: "Usar la bandera -e para variables de entorno",
    tags: ["env", "configuration", "runtime"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Inyección de Variables de Entorno

Las variables de entorno son el estándar de la industria para configurar aplicaciones sin modificar el código.
En Docker CLI, puedes declarar variables de entorno en el momento de la ejecución usando la bandera:
  • -e o --env: Declara una variable en el formato LLAVE=VALOR.
Puedes usar múltiples banderas '-e' en un solo comando para inyectar varias variables a la vez.`,
    explanationText: "Completa la bandera y el valor de puerto: 'e' y '5000'.",
    codeSnippet: "# Ejecutar un contenedor de Node con una variable de entorno llamada PORT configurada en 5000:\ndocker container run -d --name mi-node -[INPUT_1] PORT=[INPUT_2] node:20-alpine",
    inputs: { INPUT_1: "e", INPUT_2: "5000" },
    completeCode: "docker container run -d -e PORT=5000 node:20-alpine"
  },

  {
    id: 14,
    title: "Levantar PostgreSQL con credenciales",
    stars: 2,
    category: "CONTENEDORES",
    description: "Levanta una base de datos PostgreSQL parametrizando credenciales seguras.",
    objective: "Configurar contenedores Postgres oficiales",
    tags: ["postgres", "database", "env"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: PostgreSQL en Docker

Las imágenes oficiales de bases de datos leen variables de entorno específicas durante su arranque inicial para crear el usuario administrador, la contraseña y la base de datos por defecto.
En PostgreSQL, las variables oficiales requeridas son:
  - POSTGRES_USER: El nombre del usuario administrador (por defecto es 'postgres').
  - POSTGRES_PASSWORD: La contraseña del administrador (obligatoria en versiones modernas).
  - POSTGRES_DB: El nombre de la base de datos inicial a crear.`,
    explanationText: "Completa las variables y el nombre de la imagen: 'postgres', 'mi_clave_secreta' y 'postgres'.",
    codeSnippet: "# Levantar Postgres especificando usuario y contraseña como variables de entorno:\ndocker container run -d --name mi-db \\\n  -e POSTGRES_USER=[INPUT_1] \\\n  -e POSTGRES_PASSWORD=[INPUT_2] \\\n  -p 5432:5432 \\\n  [INPUT_3]:alpine",
    inputs: { INPUT_1: "postgres", INPUT_2: "mi_clave_secreta", INPUT_3: "postgres" },
    completeCode: "docker container run -d -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mi_clave_secreta -p 5432:5432 postgres:alpine"
  },

  {
    id: 15,
    title: "Levantar SQL Server con EULA y SA Password",
    stars: 2,
    category: "CONTENEDORES",
    description: "Configura SQL Server de Microsoft aceptando los términos de licencia obligatorios.",
    objective: "Ejecutar MSSQL en contenedores Docker",
    tags: ["sql server", "mssql", "database"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: SQL Server en Linux y Docker

Microsoft distribuye imágenes oficiales de SQL Server que corren sobre Linux. Tienen dos requisitos obligatorios de variables de entorno para inicializarse:
  1. ACCEPT_EULA=Y: Indica que aceptas el Acuerdo de Licencia de Usuario Final (End User License Agreement).
  2. MSSQL_SA_PASSWORD: La contraseña para el usuario administrador del sistema ('sa'). Debe cumplir con requisitos de complejidad de contraseña de Microsoft (letras mayúsculas, minúsculas, números y símbolos).`,
    explanationText: "Completa las variables y la imagen para SQL Server: 'ACCEPT_EULA', 'ClaveSuperSegura123' y 'server'.",
    codeSnippet: "# Levantar un contenedor de SQL Server de Microsoft:\ndocker container run -d --name mi-sqlserver \\\n  -e [INPUT_1]=Y \\\n  -e MSSQL_SA_PASSWORD=[INPUT_2] \\\n  -p 1433:1433 \\\n  mcr.microsoft.com/mssql/[INPUT_3]:2022-latest",
    inputs: { INPUT_1: "ACCEPT_EULA", INPUT_2: "ClaveSuperSegura123", INPUT_3: "server" },
    completeCode: "docker run -d -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=ClaveSuperSegura123 -p 1433:1433 mcr.microsoft.com/mssql/server"
  },

  {
    id: 16,
    title: "Mapeo de puertos en hosts ocupados",
    stars: 2,
    category: "CLI",
    description: "Aprende a solucionar conflictos de puertos cuando el puerto por defecto ya está en uso.",
    objective: "Cambiar el puerto del host mapeado al contenedor",
    tags: ["puertos", "conflictos", "networking"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Conflictos de Puertos

Un puerto TCP solo puede ser utilizado por un proceso a la vez en tu computadora (host).
Si tienes PostgreSQL instalado de manera tradicional en tu PC, ocupará el puerto 5432 local. Si intentas correr Docker con -p 5432:5432, fallará con un error 'port is already allocated'.
La solución es re-direccionar el puerto local del host:
  -p <puerto_host_disponible>:<puerto_contenedor_interno>
  Ejemplo: -p 5433:5432 te permite conectar tu cliente de base de datos local al puerto 5433 del host, mientras Postgres sigue escuchando en su puerto 5432 interno.`,
    explanationText: "Especifica la re-dirección de puertos: '5433' para el host y '5432' para el contenedor.",
    codeSnippet: "# Si ya tienes PostgreSQL corriendo localmente en el puerto 5432,\n# debes mapear el contenedor al puerto 5433 del host:\ndocker container run -d --name postgres-alt -p [INPUT_1]:[INPUT_2] postgres:alpine",
    inputs: { INPUT_1: "5433", INPUT_2: "5432" },
    completeCode: "docker container run -d -p 5433:5432 postgres:alpine"
  },

  {
    id: 17,
    title: "Volúmenes locales con -v",
    stars: 2,
    category: "CONTENEDORES",
    description: "Crea y adjunta un volumen con nombre para persistir datos de base de datos.",
    objective: "Configurar persistencia de datos en contenedores",
    tags: ["volumen", "persistencia", "postgres"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Persistencia y Volúmenes de Docker

Por defecto, los contenedores son efímeros y no guardan estado. Cualquier cambio o archivo nuevo escrito en el contenedor se destruye cuando este se elimina (stateless).
Para persistir información (como las tablas de una base de datos) se utilizan los **Volúmenes Nombrados**:
  - Son carpetas gestionadas por Docker en el almacenamiento del host.
  - Sobreviven a la destrucción de los contenedores.
  - Sintaxis: -v <nombre_volumen>:<ruta_directorio_interno_del_contenedor>`,
    explanationText: "Completa los comandos de volúmenes: 'create', 'v' y 'data'.",
    codeSnippet: "# Crear un volumen nombrado independiente:\ndocker volume [INPUT_1] pg-datos\n\n# Mapear el volumen a la ruta interna de PostgreSQL para no perder la BD si el contenedor se destruye:\ndocker container run -d --name mi-db-persistente -[INPUT_2] pg-datos:/var/lib/postgresql/[INPUT_3] postgres:alpine",
    inputs: { INPUT_1: "create", INPUT_2: "v", INPUT_3: "data" },
    completeCode: "docker volume create pg-datos && docker run -v pg-datos:/var/lib/postgresql/data postgres:alpine"
  },

  {
    id: 18,
    title: "Montaje de carpetas locales (Bind Mount)",
    stars: 2,
    category: "CONTENEDORES",
    description: "Monta una carpeta local de tu PC directamente dentro del contenedor para desarrollo rápido.",
    objective: "Vincular directorios del host con bind mounts",
    tags: ["bind mount", "nginx", "volumen"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Bind Mounts vs Volumes

A diferencia de los volúmenes nombrados (donde Docker gestiona la carpeta en un directorio interno del sistema), los **Bind Mounts** apuntan a un directorio físico exacto en tu máquina (ej. './public' o 'C:\\proyectos\\app').
  - Ideal para desarrollo: cualquier cambio en tu código local se refleja instantáneamente en el contenedor sin reconstruir la imagen.
  - En Windows PowerShell, la variable '\${PWD}' (Print Working Directory) o '\${pwd}' devuelve la ruta absoluta del directorio actual.`,
    explanationText: "Ingresa las variables de rutas locales y nombres: '${PWD}', 'nginx' y '${PWD}'.",
    codeSnippet: "# Montar la carpeta local 'public' en la ruta de archivos estáticos de Nginx:\ndocker container run -d -p 8080:80 \\\n  -v [INPUT_1]/public:/usr/share/[INPUT_2]/html \\\n  nginx:alpine\n\n# Nota: en Windows PowerShell, puedes usar [INPUT_3] para la ruta absoluta actual.",
    inputs: { INPUT_1: "${PWD}", INPUT_2: "nginx", INPUT_3: "${PWD}" },
    completeCode: "docker container run -d -p 8080:80 -v ${PWD}/public:/usr/share/nginx/html nginx:alpine"
  },

  {
    id: 19,
    title: "Imágenes de Docker: pull y listar",
    stars: 1,
    category: "CLI",
    description: "Descarga imágenes directamente desde un registro sin necesidad de ejecutarlas.",
    objective: "Gestionar imágenes locales",
    tags: ["images", "pull", "registry"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Gestión de Imágenes de Docker

Las imágenes son plantillas de sólo lectura que contienen el sistema operativo, las configuraciones y el código necesario para crear contenedores.
  • docker image pull: Descarga la imagen desde Docker Hub al almacenamiento local de tu host.
  • docker image ls: Lista todas las imágenes almacenadas localmente, detallando su tamaño y versión (Tag).`,
    explanationText: "Ingresa el objeto correspondiente a imágenes de docker: 'image' e 'image'.",
    codeSnippet: "# Descargar una imagen desde Docker Hub sin correrla inmediatamente:\ndocker [INPUT_1] pull node:20-alpine\n\n# Listar todas las imágenes guardadas en el host:\ndocker [INPUT_2] ls",
    inputs: { INPUT_1: "image", INPUT_2: "image" },
    completeCode: "docker image pull node:20-alpine && docker image ls"
  },

  {
    id: 20,
    title: "Etiquetas (Tags) y versiones de imágenes",
    stars: 2,
    category: "CLI",
    description: "Entiende el versionado de imágenes con tags y cómo renombrarlas localmente.",
    objective: "Manipular tags de imágenes de Docker",
    tags: ["tags", "image", "versioning"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: El sistema de etiquetas (Tags)

El tag es el identificador de la versión de una imagen (ej. node:20, node:20-alpine, node:latest).
  • Si no especificas un tag, Docker asume por defecto ':latest' (la última versión). Esto es peligroso en producción porque tu app podría romperse si la imagen se actualiza con cambios incompatibles.
  • docker image tag: Crea un alias (puntero) de una imagen existente, útil para versionar o preparar una imagen antes de subirla a un registro privado.`,
    explanationText: "Completa los tags e instrucciones del comando: '20', 'image' y '1.0.0'.",
    codeSnippet: "# Descargar la imagen estable LTS de Node en Alpine Linux:\ndocker image pull node:[INPUT_1]-alpine\n\n# Ponerle una etiqueta personalizada a nuestra imagen local 'mi-app:1.0.0':\ndocker [INPUT_2] tag mi-app:latest mi-app:[INPUT_3]",
    inputs: { INPUT_1: "20", INPUT_2: "image", INPUT_3: "1.0.0" },
    completeCode: "docker image pull node:20-alpine && docker image tag mi-app:latest mi-app:1.0.0"
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SECCIÓN 2: NIVEL MEDIO (25 EJERCICIOS) ─────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 21,
    title: "Dockerfile básico: Node.js Express",
    stars: 3,
    category: "DOCKERFILE",
    description: "Crea tu primer Dockerfile para empaquetar una API REST sencilla en Node.js.",
    objective: "Aprender comandos básicos de un Dockerfile",
    tags: ["dockerfile", "node", "express"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Instrucciones básicas del Dockerfile

Un Dockerfile es un script de texto que contiene las instrucciones paso a paso para ensamblar una imagen:
  • FROM: Define la imagen base sobre la cual construirás (ej. node:20).
  • WORKDIR: Establece el directorio de trabajo activo dentro de la imagen. Los comandos siguientes se ejecutarán ahí.
  • COPY: Copia archivos de tu máquina local al sistema de archivos de la imagen.
  • RUN: Ejecuta comandos durante la fase de construcción de la imagen (ej. 'npm install').
  • EXPOSE: Documenta el puerto en el que la app escucha internamente.
  • CMD: Especifica el comando por defecto que se ejecutará cuando el contenedor se inicie.`,
    explanationText: "Ingresa los comandos de Dockerfile correctos: 'WORKDIR', 'install', 'EXPOSE' y '\"npm\"'.",
    codeSnippet: "FROM node:20\n[INPUT_1] /app\nCOPY package*.json ./\nRUN npm [INPUT_2]\nCOPY . .\n[INPUT_3] 3000\nCMD [[INPUT_4], \"start\"]",
    inputs: { INPUT_1: "WORKDIR", INPUT_2: "install", INPUT_3: "EXPOSE", INPUT_4: "\"npm\"" },
    completeCode: "FROM node:20\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]"
  },

  {
    id: 22,
    title: "El archivo .dockerignore",
    stars: 3,
    category: "DOCKERFILE",
    description: "Evita que archivos pesados o sensibles locales entren al contexto de compilación de Docker.",
    objective: "Configurar exclusiones en la compilación",
    tags: ["ignore", "context", "security"],
    fileName: ".dockerignore",
    completed: false,
    theory: `📚 TEORÍA: El contexto de construcción

Cuando ejecutas 'docker build', el cliente empaqueta y envía todos los archivos de la carpeta actual al daemon de Docker.
Si tienes carpetas pesadas como 'node_modules', archivos de configuración locales como '.env' o repositorios '.git', ralentizarás la construcción y podrías filtrar credenciales sensibles.
El archivo **.dockerignore** funciona de manera idéntica a un '.gitignore', diciéndole a Docker qué omitir durante la fase de copia inicial.`,
    explanationText: "Ingresa los archivos que deben ignorarse: 'node_modules', '.git' y 'dist'.",
    codeSnippet: "# Evitar copiar dependencias locales y logs\n[INPUT_1]\nnpm-debug.log\n\n# Evitar copiar repositorios Git\n[INPUT_2]\n\n# Evitar copiar archivos de compilación locales\n[INPUT_3]/",
    inputs: { INPUT_1: "node_modules", INPUT_2: ".git", INPUT_3: "dist" },
    completeCode: "node_modules/\n.git/\ndist/"
  },

  {
    id: 23,
    title: "Dockerfile optimizado con Alpine",
    stars: 3,
    category: "DOCKERFILE",
    description: "Crea una imagen optimizada para producción utilizando una distribución ultraligera.",
    objective: "Reducir tamaño e instalar solo dependencias necesarias",
    tags: ["optimization", "alpine", "production"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Optimización de imágenes

En producción, las imágenes pesadas tardan más en descargarse y ocupan más espacio en tu servidor. Además, tienen más vulnerabilidades de seguridad porque incluyen utilidades innecesarias.
Para optimizar:
  1. Usar variantes **Alpine**: Imágenes de sistema operativo de apenas 5MB basadas en musl libc y busybox.
  2. Filtrar dependencias: En Node.js, usa 'npm install --only=production' (o '--omit=dev') para omitir dependencias de desarrollo (como tests, linters, compiladores de TS) que no se usan en producción.`,
    explanationText: "Completa la configuración optimizada: 'alpine', 'only=production' y 'server.js'.",
    codeSnippet: "# Usar imagen ultra ligera de Alpine para reducir espacio y aumentar seguridad\nFROM node:20-[INPUT_1]\nWORKDIR /app\nCOPY package*.json ./\n# Instalar solo dependencias de producción para optimizar\nRUN npm install --[INPUT_2]\nCOPY . .\nCMD [\"node\", \"[INPUT_3]\"]",
    inputs: { INPUT_1: "alpine", INPUT_2: "only=production", INPUT_3: "server.js" },
    completeCode: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install --only=production\nCOPY . .\nCMD [\"node\", \"server.js\"]"
  },

  {
    id: 24,
    title: "Dockerfile: Ejecutar como usuario no-root",
    stars: 3,
    category: "DOCKERFILE",
    description: "Implementa mejores prácticas de seguridad ejecutando tu contenedor sin privilegios de root.",
    objective: "Aplicar principio de menores privilegios",
    tags: ["security", "user", "rootless"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Seguridad de usuarios en Docker

Por defecto, los procesos dentro de un contenedor se ejecutan como el usuario administrador del sistema (root).
Si un atacante logra explotar una vulnerabilidad en tu aplicación, podría obtener acceso root al sistema de archivos del host.
  • Las imágenes oficiales de Node.js ya incluyen un usuario con privilegios reducidos llamado 'node'.
  • Usamos 'chown -R node:node /app' para asegurar que el usuario tenga acceso de lectura/escritura a la carpeta de la app.
  • La instrucción 'USER <username>' cambia el usuario activo para ejecutar los siguientes comandos y arrancar la app.`,
    explanationText: "Ingresa los comandos para cambiar de usuario: 'USER', 'node' y 'server.js'.",
    codeSnippet: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install --only=production\nCOPY . .\n# Cambiar permisos de la carpeta app al usuario node incluido en la imagen\nRUN chown -R node:node /app\n[INPUT_1] [INPUT_2]\nCMD [\"node\", \"[INPUT_3]\"]",
    inputs: { INPUT_1: "USER", INPUT_2: "node", INPUT_3: "server.js" },
    completeCode: "FROM node:20-alpine\nRUN chown -R node:node /app\nUSER node\nCMD [\"node\", \"server.js\"]"
  },

  {
    id: 25,
    title: "Dockerfile para Frontend Vue.js",
    stars: 3,
    category: "DOCKERFILE",
    description: "Construye un contenedor standalone temporal para empaquetar una aplicación Vue.",
    objective: "Compilar código de frontend en Docker",
    tags: ["vue", "frontend", "build"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Dockerizar Frontends de SPA

Las aplicaciones modernas en Vue, React o Angular no se ejecutan directamente en un servidor Node en producción; se compilan a archivos HTML/JS/CSS planos.
Durante la fase de construcción de la imagen:
  - Necesitas descargar dependencias de desarrollo ('devDependencies') porque el compilador de Vue las requiere.
  - Ejecutas 'npm run build' para generar la carpeta de salida (usualmente llamada 'dist' o 'build').
  - En este ejercicio inicial, utilizaremos una utilidad global de NPM llamada 'serve' para levantar un servidor básico para pruebas rápidas.`,
    explanationText: "Ingresa los comandos de build para Vue: 'run', 'build' y 'dist'.",
    codeSnippet: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\n# Compilar el bundle estático de Vue\nRUN npm [INPUT_1] [INPUT_2]\n# Levantar un servidor local temporal (para servir archivos en modo standalone)\nRUN npm install -g serve\nCMD [\"serve\", \"-s\", \"[INPUT_3]\"]",
    inputs: { INPUT_1: "run", INPUT_2: "build", INPUT_3: "dist" },
    completeCode: "FROM node:20-alpine\nRUN npm run build\nCMD [\"serve\", \"-s\", \"dist\"]"
  },

  {
    id: 26,
    title: "Multi-stage Build para Frontend Vue (Node + Nginx)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Utiliza construcción multi-etapa para generar una imagen final ultra-pequeña con Nginx.",
    objective: "Aprender el patrón Multi-stage build",
    tags: ["multistage", "nginx", "optimization", "vue"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Construcciones Multi-Etapa (Multi-Stage Builds)

Si usas el Dockerfile tradicional para Vue, la imagen final incluirá Node.js, npm, dependencias de desarrollo y el código fuente. ¡Esto resulta en imágenes de más de 800MB!
**Multi-stage builds** te permite declarar múltiples bloques 'FROM' en un solo Dockerfile:
  - Etapa 1 (Build): Usa Node para instalar dependencias y compilar el código. Le asignamos un alias con 'AS build-stage'.
  - Etapa 2 (Runtime): Usa Nginx (servidor web ultraligero). Descarta la imagen de Node completa y copia UNICAMENTE los archivos compilados de la carpeta '/dist' de la Etapa 1.
El resultado es una imagen final de apenas 20MB súper segura y rápida.`,
    explanationText: "Completa el Dockerfile multi-stage: 'as', 'from', 'html' y 'off'.",
    codeSnippet: "# Etapa 1: Build\nFROM node:20-alpine [INPUT_1] build-stage\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\n# Etapa 2: Runtime\nFROM nginx:alpine\n# Copiar el build compilado de la etapa anterior\nCOPY --[INPUT_2]=build-stage /app/dist /usr/share/nginx/[INPUT_3]\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon [INPUT_4];\"]",
    inputs: { INPUT_1: "as", INPUT_2: "from", INPUT_3: "html", INPUT_4: "off" },
    completeCode: "FROM node:20-alpine AS build-stage\n...\nFROM nginx:alpine\nCOPY --from=build-stage /app/dist /usr/share/nginx/html"
  },

  {
    id: 27,
    title: "Dockerfile para React SPA (Multi-stage)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Configura Nginx para dar soporte al sistema de rutas de React Router en un Dockerfile.",
    objective: "Implementar redirecciones SPA en Nginx",
    tags: ["react", "spa", "nginx", "router"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: El problema de las rutas en SPAs

En aplicaciones React con enrutamiento del lado del cliente (React Router), si un usuario navega a 'misitio.com/dashboard' y refresca la página, Nginx buscará el archivo físico '/dashboard/index.html' y devolverá un error 404.
Para solucionarlo, debemos copiar una configuración personalizada de Nginx ('nginx.conf') que redirija todas las solicitudes no encontradas al 'index.html' raíz (fallback).`,
    explanationText: "Completa la copia de compilación: 'compile', 'build' y 'conf.d'.",
    codeSnippet: "# Build\nFROM node:20-alpine as compile\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Runtime\nFROM nginx:alpine\nCOPY --from=[INPUT_1] /usr/src/app/[INPUT_2] /usr/share/nginx/html\n# Copiar configuración personalizada de Nginx para soportar React Router (SPA redirects)\nCOPY nginx.conf /etc/nginx/[INPUT_3]/default.conf",
    inputs: { INPUT_1: "compile", INPUT_2: "build", INPUT_3: "conf.d" },
    completeCode: "COPY --from=compile /usr/src/app/build /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf"
  },

  {
    id: 28,
    title: "Dockerfile para .NET Core API (C#) - Multi-stage",
    stars: 3,
    category: "DOCKERFILE",
    description: "Diseña un Dockerfile profesional para compilar y ejecutar una API de ASP.NET Core.",
    objective: "Compilar y desplegar aplicaciones .NET Core C#",
    tags: ["dotnet", "csharp", "api", "backend"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Dockerización de .NET Core

Las aplicaciones de .NET son ideales para multi-stage builds:
  - El SDK de .NET ('dotnet/sdk') contiene compiladores, linters y dependencias pesadas. Es necesario para la etapa de build.
  - El runtime de ASP.NET ('dotnet/aspnet') contiene únicamente el motor de ejecución ligero para levantar el servidor Kestrel en producción.
Pasos típicos:
  1. 'dotnet restore': Descarga paquetes NuGet basados en el archivo '.csproj'.
  2. 'dotnet publish': Compila la app en modo Release y genera los archivos binarios (.dll) de salida.`,
    explanationText: "Completa los comandos de .NET: 'MiApi', 'restore', 'publish' y 'MiApi'.",
    codeSnippet: "# Etapa de compilación utilizando el SDK\nFROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nWORKDIR /src\n# Copiar y restaurar dependencias (.csproj)\nCOPY [INPUT_1].csproj ./\nRUN dotnet [INPUT_2]\nCOPY . .\nRUN dotnet [INPUT_3] -c Release -o /app/out\n\n# Etapa de ejecución utilizando la imagen ligera de ASP.NET Core\nFROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY --from=build /app/out .\nENTRYPOINT [\"dotnet\", \"[INPUT_4].dll\"]",
    inputs: { INPUT_1: "MiApi", INPUT_2: "restore", INPUT_3: "publish", INPUT_4: "MiApi" },
    completeCode: "FROM sdk AS build ... RUN dotnet restore && dotnet publish ... FROM aspnet COPY --from=build ... ENTRYPOINT"
  },

  {
    id: 29,
    title: "Docker Compose: Introducción y sintaxis YAML",
    stars: 3,
    category: "COMPOSE",
    description: "Crea tu primer archivo docker-compose.yml para levantar una API de forma declarativa.",
    objective: "Comprender la sintaxis básica de Docker Compose",
    tags: ["compose", "yaml", "config"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué es Docker Compose?

Docker Compose es una herramienta para definir y ejecutar aplicaciones multi-contenedor. Utiliza archivos YAML para configurar los servicios, redes y volúmenes de tu aplicación.
En lugar de recordar comandos CLI gigantescos como:
'docker run -d -p 3000:3000 -e NODE_ENV=production mi-api'
Con Compose sólo escribes 'docker compose up' y el motor levanta todo automáticamente según tu archivo de configuración.
  • services: Define cada uno de los contenedores individuales que se ejecutarán.
  • build: Indica la ruta al Dockerfile local para compilar la imagen.`,
    explanationText: "Especifica las palabras clave de Compose: 'services', 'build' y 'ports'.",
    codeSnippet: "version: \"3.8\"\n[INPUT_1]:\n  mi-api-node:\n    [INPUT_2]: ./backend\n    [INPUT_3]:\n      - \"3000:3000\"\n    environment:\n      - NODE_ENV=production",
    inputs: { INPUT_1: "services", INPUT_2: "build", INPUT_3: "ports" },
    completeCode: "version: \"3.8\"\nservices:\n  mi-api-node:\n    build: ./backend\n    ports:\n      - \"3000:3000\""
  },

  {
    id: 30,
    title: "Compose: Multi-contenedor con PostgreSQL y Node.js",
    stars: 3,
    category: "COMPOSE",
    description: "Configura la comunicación automática de red entre un servicio backend y una base de datos.",
    objective: "Orquestar múltiples contenedores comunicados por DNS interno",
    tags: ["compose", "networking", "postgres", "node"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Redes automáticas en Docker Compose

Cuando levantas un archivo docker-compose, Compose crea automáticamente una red virtual privada y conecta todos sus servicios a ella.
  - Resolución DNS interna: Los contenedores pueden comunicarse entre sí usando el nombre del servicio como Host de red. Por ejemplo, la API puede conectarse a Postgres usando 'host: db' en lugar de usar IPs dinámicas.
  - depends_on: Especifica que el servicio 'api' depende de 'db', por lo que Compose levantará el contenedor de Postgres antes de arrancar la API.`,
    explanationText: "Ingresa los valores de dependencias y DNS: 'depends_on', 'db' y 'db'.",
    codeSnippet: "version: \"3.8\"\nservices:\n  db:\n    image: postgres:alpine\n    environment:\n      - POSTGRES_PASSWORD=secret\n\n  api:\n    build: ./api\n    ports:\n      - \"3000:3000\"\n    # Asegurar el orden de inicio (la API espera a db)\n    [INPUT_1]:\n      - [INPUT_2]\n    environment:\n      - DATABASE_URL=postgres://postgres:secret@[INPUT_3]:5432/postgres",
    inputs: { INPUT_1: "depends_on", INPUT_2: "db", INPUT_3: "db" },
    completeCode: "depends_on: ['db'] | environment: DATABASE_URL=postgres://...:...@db:5432/..."
  },

  {
    id: 31,
    title: "Compose: Levantar .NET Core + SQL Server (MSSQL)",
    stars: 3,
    category: "COMPOSE",
    description: "Orquesta una API en .NET Core conectada a una base de datos SQL Server.",
    objective: "Orquestar .NET y SQL Server en una sola red",
    tags: ["compose", "dotnet", "sql server", "database"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Configuración de .NET con SQL Server en Docker

Para conectar una API de C# / ASP.NET Core a un contenedor de SQL Server:
  - El host de la cadena de conexión ya no será 'localhost' o '(localdb)', sino el nombre de servicio de SQL Server definido en el YAML (ej. 'sqlserver').
  - Usamos variables de entorno con doble guión bajo ('__') para sobrescribir las secciones de configuración de 'appsettings.json' en .NET Core.`,
    explanationText: "Ingresa las relaciones del servicio SQL Server: 'sqlserver', 'sqlserver' y 'SuperSecurePass123'.",
    codeSnippet: "services:\n  sqlserver:\n    image: mcr.microsoft.com/mssql/server:2022-latest\n    environment:\n      - ACCEPT_EULA=Y\n      - MSSQL_SA_PASSWORD=SuperSecurePass123\n\n  dotnet-api:\n    build: .\n    ports:\n      - \"8080:8080\"\n    depends_on:\n      - [INPUT_1]\n    environment:\n      - ConnectionStrings__DefaultConnection=Server=[INPUT_2];Database=MiDb;User Id=sa;Password=[INPUT_3];TrustServerCertificate=true",
    inputs: { INPUT_1: "sqlserver", INPUT_2: "sqlserver", INPUT_3: "SuperSecurePass123" },
    completeCode: "depends_on: - sqlserver | ConnectionStrings__DefaultConnection=Server=sqlserver;...Password=SuperSecurePass123"
  },

  {
    id: 32,
    title: "Compose: Volúmenes con nombres (Named Volumes)",
    stars: 3,
    category: "COMPOSE",
    description: "Configura la persistencia de datos de tu base de datos en Docker Compose.",
    objective: "Declarar y mapear volúmenes en archivos Compose",
    tags: ["compose", "volumes", "persistence"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Declaración de Volúmenes en Compose

Para evitar la pérdida de datos cuando destruyes tu ambiente de contenedores con 'docker compose down', debes declarar volúmenes en el archivo Compose.
El proceso requiere dos pasos:
  1. Mapear el volumen en el servicio de la base de datos (Postgres, SQL Server, etc.).
  2. Declarar el volumen globalmente en la sección 'volumes:' al final del archivo YAML.`,
    explanationText: "Completa la configuración de volúmenes: 'pg-data', 'volumes' y 'pg-data'.",
    codeSnippet: "services:\n  postgres-db:\n    image: postgres:15-alpine\n    volumes:\n      # Usar volumen con nombre definido abajo\n      - [INPUT_1]:/var/lib/postgresql/data\n    environment:\n      - POSTGRES_PASSWORD=secret\n\n# Sección global para declarar volúmenes\n[INPUT_2]:\n  [INPUT_3]:",
    inputs: { INPUT_1: "pg-data", INPUT_2: "volumes", INPUT_3: "pg-data" },
    completeCode: "services:\n  db:\n    volumes: - pg-data:/var/lib/postgresql/data\nvolumes:\n  pg-data:"
  },

  {
    id: 33,
    title: "Compose: Hot-reloading en desarrollo (Bind Mounts)",
    stars: 3,
    category: "COMPOSE",
    description: "Vincula tu carpeta de código local en el contenedor para ver cambios de código en tiempo real.",
    objective: "Configurar volumen local para hot-reload de Node",
    tags: ["compose", "development", "bind mount", "nodemon"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Bind Mounts en Docker Compose

En desarrollo, reconstruir la imagen cada vez que modificas una línea de código es ineficiente.
Podemos montar el código local en la carpeta del contenedor:
  - volumes: './:/usr/src/app' vincula el directorio actual local al del contenedor.
  - Para evitar que el node_modules del host sobrescriba al del contenedor (que podría tener binarios compilados para Linux), agregamos un volumen anónimo '/usr/src/app/node_modules'. Esto le dice a Docker: 'no sobrescribas este directorio'.`,
    explanationText: "Completa el mapeo de desarrollo: '.:/usr/src/app', 'node_modules' y 'dev'.",
    codeSnippet: "services:\n  node-app:\n    build:\n      context: .\n      dockerfile: Dockerfile.dev\n    volumes:\n      # Montar código local al contenedor\n      - [INPUT_1]:/usr/src/app\n      # Excluir node_modules del montaje\n      - /usr/src/app/[INPUT_2]\n    ports:\n      - \"3000:3000\"\n    command: npm run [INPUT_3]",
    inputs: { INPUT_1: ".:/usr/src/app", INPUT_2: "node_modules", INPUT_3: "dev" },
    completeCode: "volumes:\n  - .:/usr/src/app\n  - /usr/src/app/node_modules\ncommand: npm run dev"
  },

  {
    id: 34,
    title: "Compose: Redes personalizadas (Isolation)",
    stars: 4,
    category: "COMPOSE",
    description: "Aísla la base de datos en una red interna privada para que el exterior no pueda verla.",
    objective: "Implementar aislamiento y segmentación de redes",
    tags: ["compose", "networks", "security", "isolation"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Segmentación de redes en producción

Por defecto, todos los contenedores en un archivo Compose se conectan a la misma red y pueden comunicarse libremente.
Sin embargo, por seguridad, tu base de datos Postgres o SQL Server nunca debe estar expuesta a Internet o a la red del cliente (Frontend).
Creamos redes independientes:
  - 'internal-net': Red interna para conectar base de datos y backend API.
  - 'public-net': Red externa que expone la API o el frontend al exterior.`,
    explanationText: "Completa los nombres de red: 'internal-net', 'internal-net' y 'internal-net'.",
    codeSnippet: "services:\n  postgres-db:\n    image: postgres:alpine\n    networks:\n      - [INPUT_1] # Solo red interna\n\n  api:\n    build: .\n    networks:\n      - [INPUT_2] # Conectado a base de datos\n      - public-net # Conectado al exterior\n\nnetworks:\n  [INPUT_3]:\n  public-net:",
    inputs: { INPUT_1: "internal-net", INPUT_2: "internal-net", INPUT_3: "internal-net" },
    completeCode: "postgres-db conecta a internal-net | api conecta a internal-net y public-net | networks: internal-net: {}"
  },

  {
    id: 35,
    title: "Compose: Variables de entorno usando archivo .env",
    stars: 3,
    category: "COMPOSE",
    description: "Extrae las credenciales hardcodeadas del YAML y centralízalas en un archivo .env externo.",
    objective: "Usar interpolación de variables de entorno",
    tags: ["compose", "env", "dot-env", "security"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Interpolación en Docker Compose

Subir archivos de Compose con contraseñas en texto plano (hardcoded) a GitHub es un error crítico de seguridad.
Docker Compose soporta de forma nativa la lectura de archivos **.env** en el mismo directorio.
  - En tu archivo '.env' declaras: DB_USER=myadmin
  - En tu 'docker-compose.yml' referencias esas variables usando la sintaxis \${VARIABLE_NAME}.`,
    explanationText: "Ingresa los nombres de las variables declaradas: 'DB_USER' y 'DB_PASSWORD'.",
    codeSnippet: "services:\n  db:\n    image: postgres:alpine\n    environment:\n      # Leer de variables cargadas automáticamente desde un archivo .env\n      - POSTGRES_USER=${[INPUT_1]}\n      - POSTGRES_PASSWORD=${[INPUT_2]}",
    inputs: { INPUT_1: "DB_USER", INPUT_2: "DB_PASSWORD" },
    completeCode: "POSTGRES_USER=${DB_USER} | POSTGRES_PASSWORD=${DB_PASSWORD}"
  },

  {
    id: 36,
    title: "Docker CLI: Crear redes manuales",
    stars: 3,
    category: "CLI",
    description: "Crea redes bridge manualmente desde la consola para interconectar contenedores aislados.",
    objective: "Administrar redes locales desde terminal",
    tags: ["networks", "bridge", "cli"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Drivers de Redes en Docker

Docker ofrece varios controladores (drivers) de redes:
  - bridge: El driver por defecto. Crea una red virtual dentro del host para que los contenedores puedan comunicarse entre sí.
  - host: Elimina el aislamiento de red entre el contenedor y el host (usa los puertos de tu PC directamente).
  - none: Aísla completamente el contenedor sin interfaces de red.
Comandos útiles:
  - docker network create <nombre>
  - docker network ls
  - docker network connect <red> <contenedor>`,
    explanationText: "Completa los comandos de red: 'create', 'network' y 'mi-red-aislada'.",
    codeSnippet: "# Crear una red tipo bridge personalizada:\ndocker network [INPUT_1] mi-red-aislada\n\n# Correr la base de datos Postgres conectada a esa red:\ndocker container run -d --name mi-db --[INPUT_2] mi-red-aislada postgres:alpine\n\n# Correr la API de Node en la misma red para permitir resolución DNS por nombre:\ndocker container run -d --name mi-api --network [INPUT_3] my-node-app",
    inputs: { INPUT_1: "create", INPUT_2: "network", INPUT_3: "mi-red-aislada" },
    completeCode: "docker network create mi-red-aislada && docker run --network mi-red-aislada ..."
  },

  {
    id: 37,
    title: "Docker CLI: Crear volúmenes manuales",
    stars: 3,
    category: "CLI",
    description: "Gestiona volúmenes nombrados directamente desde la línea de comandos.",
    objective: "Administrar volúmenes de datos",
    tags: ["volumes", "cli", "storage"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Gestión de almacenamiento por CLI

Al igual que las redes, los volúmenes son objetos de primer nivel en Docker y tienen su propio subcomando de administración:
  • docker volume create: Crea un nuevo volumen.
  • docker volume ls: Lista todos los volúmenes huérfanos y en uso.
  • docker volume inspect: Muestra los metadatos y la ruta exacta del host donde Docker guarda los datos.`,
    explanationText: "Ingresa los comandos de volúmenes: 'create', 'ls' y 'inspect'.",
    codeSnippet: "# Crear volumen nombrado para Postgres:\ndocker volume [INPUT_1] pg-datos-vol\n\n# Listar todos los volúmenes existentes:\ndocker volume [INPUT_2]\n\n# Ver la ubicación física del volumen en el host:\ndocker volume [INPUT_3] pg-datos-vol",
    inputs: { INPUT_1: "create", INPUT_2: "ls", INPUT_3: "inspect" },
    completeCode: "docker volume create pg-datos-vol && docker volume ls && docker volume inspect pg-datos-vol"
  },

  {
    id: 38,
    title: "Diferencia entre CMD y ENTRYPOINT",
    stars: 3,
    category: "DOCKERFILE",
    description: "Aprende a estructurar imágenes que funcionen como ejecutables flexibles.",
    objective: "Diferenciar entre CMD y ENTRYPOINT en Dockerfiles",
    tags: ["dockerfile", "cmd", "entrypoint"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: CMD vs ENTRYPOINT

Ambas instrucciones definen qué comando se ejecutará al iniciar el contenedor, pero su comportamiento es diferente ante argumentos en tiempo de ejecución:
  - ENTRYPOINT: Define el ejecutable permanente. No se sobrescribe fácilmente (a menos que uses la bandera '--entrypoint' en CLI).
  - CMD: Define los parámetros por defecto para el ENTRYPOINT. Se sobrescriben de forma automática si agregas argumentos adicionales al final del comando de ejecución en la terminal.
Ejemplo:
  ENTRYPOINT ["ping"] + CMD ["8.8.8.8"]
  - docker run mi-ping -> ejecuta 'ping 8.8.8.8'
  - docker run mi-ping 1.1.1.1 -> ejecuta 'ping 1.1.1.1' (CMD se sobrescribe).`,
    explanationText: "Ingresa las instrucciones del Dockerfile: 'ENTRYPOINT', 'CMD' y 'google.com'.",
    codeSnippet: "FROM alpine\n# ENTRYPOINT define el binario base ejecutable que no se puede sobrescribir fácilmente\n[INPUT_1] [\"ping\"]\n# CMD define los parámetros por defecto, los cuales sí se pueden cambiar al correr el contenedor\n[INPUT_2] [\"127.0.0.1\"]\n\n# Si corremos: docker run mi-ping google.com, se ejecutará: ping [INPUT_3]",
    inputs: { INPUT_1: "ENTRYPOINT", INPUT_2: "CMD", INPUT_3: "google.com" },
    completeCode: "ENTRYPOINT [\"ping\"]\nCMD [\"127.0.0.1\"]"
  },

  {
    id: 39,
    title: "Logs y debugging en Docker Compose",
    stars: 3,
    category: "COMPOSE",
    description: "Inspecciona los logs de una aplicación multi-contenedor de forma unificada.",
    objective: "Depurar logs de servicios en Compose",
    tags: ["compose", "logs", "debug"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Logs en Compose

Cuando levantas tu proyecto con 'docker compose up', la terminal consolida todos los logs de los contenedores con colores descriptivos.
Si cierras la terminal o usas el modo detached (-d), puedes volver a ver los logs usando:
  • docker compose logs: Muestra los logs de todos los servicios.
  • docker compose logs -f <servicio>: Sigue en tiempo real (follow) un contenedor específico.
Nota: En versiones modernas de Docker Desktop, se prefiere usar 'docker compose' (espacio) sobre el comando antiguo con guión 'docker-compose'.`,
    explanationText: "Escribe las opciones para depurar logs: 'logs', 'f', 'api' y 'compose'.",
    codeSnippet: "# Ver los logs consolidados de todos los servicios definidos en el docker-compose.yml:\ndocker compose [INPUT_1]\n\n# Ver logs en tiempo real (follow) de un servicio específico 'api':\ndocker compose logs -[INPUT_2] [INPUT_3]\n\n# Sintaxis antigua en docker compose v1:\ndocker-[INPUT_4] logs -f api",
    inputs: { INPUT_1: "logs", INPUT_2: "f", INPUT_3: "api", INPUT_4: "compose" },
    completeCode: "docker compose logs -f api"
  },

  {
    id: 40,
    title: "Detener y limpiar servicios en Compose",
    stars: 3,
    category: "COMPOSE",
    description: "Detén tus aplicaciones multi-contenedor limpiando todos los recursos generados.",
    objective: "Utilizar docker compose down con limpieza",
    tags: ["compose", "down", "cleanup"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Desarmar ambientes con docker compose down

Para apagar la aplicación completa y liberar memoria RAM en tu host:
  • docker compose down: Detiene y elimina los contenedores y las redes privadas generadas por el archivo YAML.
  • Banderas de limpieza:
     - -v o --volumes: Elimina adicionalmente los volúmenes con nombre creados en la sección global del YAML (cuidado, esto borra los datos persistidos permanentemente).
     - --remove-orphans: Borra contenedores huérfanos que estuvieran en el YAML pero fueron borrados posteriormente del archivo.`,
    explanationText: "Completa los parámetros de borrado: 'down', 'v' y 'remove'.",
    codeSnippet: "# Detener y eliminar contenedores y redes creadas por docker compose:\ndocker compose [INPUT_1]\n\n# Detener, eliminar contenedores, redes Y además remover los volúmenes de datos asociados:\ndocker compose down -[INPUT_2]\n\n# Detener y eliminar contenedores pero también limpiar imágenes huérfanas:\ndocker compose down --[INPUT_3]-orphans",
    inputs: { INPUT_1: "down", INPUT_2: "v", INPUT_3: "remove" },
    completeCode: "docker compose down -v --remove-orphans"
  },

  {
    id: 41,
    title: "Reconstruir imágenes en Compose",
    stars: 3,
    category: "COMPOSE",
    description: "Forzar la recompilación de imágenes modificadas en proyectos de Docker Compose.",
    objective: "Forzar docker compose build",
    tags: ["compose", "build", "rebuild"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: El sistema de caché de Compose

Cuando corres 'docker compose up', si Docker detecta que ya existe una imagen compilada localmente para tu servicio, no volverá a leer tu Dockerfile ni a compilar el código.
Si realizaste modificaciones en dependencias o en el Dockerfile, debes forzar explícitamente la recompilación pasando la bandera '--build'.`,
    explanationText: "Completa los comandos de recompilación: 'up', 'build' y 'api'.",
    codeSnippet: "# Levantar los servicios y forzar la compilación (build) de las imágenes de Dockerfile:\ndocker compose [INPUT_1] --[INPUT_2]\n\n# Levantar solo un servicio y forzar su build:\ndocker compose up --build [INPUT_3]",
    inputs: { INPUT_1: "up", INPUT_2: "build", INPUT_3: "api" },
    completeCode: "docker compose up --build api"
  },

  {
    id: 42,
    title: "Compose: Healthchecks para servicios",
    stars: 4,
    category: "COMPOSE",
    description: "Asegura que tu base de datos esté lista para aceptar conexiones antes de levantar la API.",
    objective: "Implementar healthchecks y condiciones avanzadas en Compose",
    tags: ["compose", "healthcheck", "depends", "postgres"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Healthchecks y sincronización en Compose

El comando 'depends_on' básico sólo garantiza que el contenedor de la base de datos se *inicie*. Sin embargo, levantar el motor de base de datos puede tomar 5 a 10 segundos adicionales durante los cuales la API podría intentar conectarse y fallar con un crash.
Para resolver esto de forma profesional:
  1. Declaramos un **healthcheck** en Postgres usando su utilidad nativa 'pg_isready'.
  2. Modificamos 'depends_on' para requerir que el servicio dependiente esté saludable ('service_healthy').`,
    explanationText: "Ingresa las llaves del healthcheck: 'healthcheck' y 'healthy'.",
    codeSnippet: "services:\n  postgres:\n    image: postgres:alpine\n    environment:\n      - POSTGRES_PASSWORD=secret\n    # Validar que el servidor Postgres realmente esté respondiendo antes de considerarlo saludable\n    [INPUT_1]:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  api:\n    build: .\n    depends_on:\n      postgres:\n        # Condición para esperar a que sea saludable, no solo iniciado\n        condition: service_[INPUT_2]",
    inputs: { INPUT_1: "healthcheck", INPUT_2: "healthy" },
    completeCode: "healthcheck: test: pg_isready | condition: service_healthy"
  },

  {
    id: 43,
    title: "Configuración de variables de entorno en .NET (appsettings.json)",
    stars: 3,
    category: "DOCKERFILE",
    description: "Sobrescribe la configuración de tu aplicación .NET en Docker usando variables de entorno.",
    objective: "Mapear variables de entorno de .NET Core en Docker",
    tags: ["dotnet", "appsettings", "environment"],
    fileName: "appsettings.json",
    completed: false,
    theory: `📚 TEORÍA: Variables en .NET Core

El proveedor de configuración de .NET lee variables de entorno del sistema al iniciar.
Para sobrescribir propiedades jerárquicas como las de 'appsettings.json', se utiliza un delimitador de doble guión bajo ('__').
Por ejemplo, si en tu appsettings tienes:
"ConnectionStrings": { "DefaultConnection": "..." }
La variable de entorno en tu contenedor de Docker debe llamarse:
'ConnectionStrings__DefaultConnection'.`,
    explanationText: "Ingresa las llaves de la conexión de SQL Server: 'DefaultConnection', 'sqlserver' y 'Pass123'.",
    codeSnippet: "{\n  \"ConnectionStrings\": {\n    \"DefaultConnection\": \"Server=localhost;Database=MiDb;User Id=sa;Password=LocalPass;\"\n  }\n}\n\n// Para sobrescribir esto en Docker con SQL Server de nombre de servicio 'sqlserver' y clave 'Pass123':\n// En el docker-compose.yml declaramos la variable:\n// ConnectionStrings__[INPUT_1]=Server=[INPUT_2];Database=MiDb;User Id=sa;Password=[INPUT_3]",
    inputs: { INPUT_1: "DefaultConnection", INPUT_2: "sqlserver", INPUT_3: "Pass123" },
    completeCode: "ConnectionStrings__DefaultConnection=Server=sqlserver;Database=MiDb;User Id=sa;Password=Pass123"
  },

  {
    id: 44,
    title: "Gestión de Postgres con PgAdmin en Compose",
    stars: 3,
    category: "COMPOSE",
    description: "Agrega una herramienta web visual para administrar tus bases de datos Postgres.",
    objective: "Orquestar PgAdmin en Compose",
    tags: ["pgadmin", "postgres", "gui", "compose"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Paneles de administración en contenedores

En lugar de instalar software de escritorio como DBeaver o PgAdmin local, puedes levantar pgAdmin 4 directamente en un contenedor dentro del mismo docker-compose.yml.
  - Se comunicará con la base de datos usando DNS interno ('db').
  - Ofrece una interfaz web accesible en el puerto que expongas (ej. 8080).
  - Requiere variables de correo y clave iniciales para iniciar sesión.`,
    explanationText: "Ingresa el email, contraseña de pgAdmin y el nombre del servicio de base de datos: 'admin@admin.com', 'admin123' y 'db'.",
    codeSnippet: "services:\n  db:\n    image: postgres:alpine\n    environment:\n      - POSTGRES_PASSWORD=secret\n  \n  pgadmin:\n    image: dpage/pgadmin4\n    ports:\n      - \"8080:80\"\n    environment:\n      - PGADMIN_DEFAULT_EMAIL=[INPUT_1]\n      - PGADMIN_DEFAULT_PASSWORD=[INPUT_2]\n    depends_on:\n      - [INPUT_3]",
    inputs: { INPUT_1: "admin@admin.com", INPUT_2: "admin123", INPUT_3: "db" },
    completeCode: "services: db: ... pgadmin: image: dpage/pgadmin4 ... environment: - PGADMIN_DEFAULT_EMAIL=admin@admin.com"
  },

  {
    id: 45,
    title: "Conexión de herramientas locales a Base de Datos en Docker",
    stars: 3,
    category: "CONTENEDORES",
    description: "Aprende a exponer puertos de bases de datos de Docker a tu PC local.",
    objective: "Conectar Azure Data Studio o DBeaver locales",
    tags: ["dbeaver", "azure data studio", "networking"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Exposición local de puertos de BD

Si quieres usar Azure Data Studio, SSMS, o DBeaver instalados localmente en tu sistema operativo host, debes mapear obligatoriamente el puerto de la base de datos del contenedor hacia el exterior.
  - SQL Server escucha internamente en el puerto '1433'. Mapearlo con '-p 1433:1433' lo expone al host.
  - La conexión local se realizará hacia 'localhost' o '127.0.0.1' en el puerto correspondiente.`,
    explanationText: "Escribe los puertos y contraseña del comando: '1433', '1433' y 'MiClaveSegura123'.",
    codeSnippet: "# Para poder conectar Azure Data Studio o DBeaver local a SQL Server en Docker, debes mapear el puerto 1433:\ndocker container run -d -p [INPUT_1]:1433 \\\n  -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=MiClaveSegura123 \\\n  mcr.microsoft.com/mssql/server:2022-latest\n\n# Luego, en tu herramienta local te conectas a 'localhost' en el puerto [INPUT_2] con usuario 'sa' y contraseña '[INPUT_3]'",
    inputs: { INPUT_1: "1433", INPUT_2: "1433", INPUT_3: "MiClaveSegura123" },
    completeCode: "docker run -d -p 1433:1433 ... ADS conecta a localhost,1433 con pass"
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SECCIÓN 3: NIVEL DIFICIL (20 EJERCICIOS) ────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 46,
    title: "BuildX - Introducción y Builders personalizados",
    stars: 4,
    category: "BUILDX",
    description: "Crea y configura builders BuildX en Docker para compilar en múltiples plataformas.",
    objective: "Iniciar el motor de BuildX",
    tags: ["buildx", "multiarch", "cli"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Docker BuildX

BuildX es un plugin de Docker que extiende el comando 'build' con soporte para compilaciones multi-plataforma e integraciones avanzadas de caché.
Por defecto, Docker compila la imagen para la misma arquitectura del host (ej. si tienes una PC Intel, compila para 'amd64'; si usas Mac M1/M2/M3, para 'arm64').
Para compilar imágenes que funcionen en cualquier procesador:
  1. Creamos un builder personalizado que use el driver 'docker-container'.
  2. Configuramos el builder activo y lo inicializamos con '--bootstrap'.`,
    explanationText: "Ingresa los comandos de BuildX: 'version', 'use' y 'inspect'.",
    codeSnippet: "# Activar la CLI de docker buildx para multi-arquitectura:\ndocker buildx [INPUT_1]\n\n# Crear un nuevo builder personalizado usando el driver docker-container:\ndocker buildx create --name mi-builder --[INPUT_2] --use\n\n# Inicializar y arrancar el builder creado:\ndocker buildx [INPUT_3] --bootstrap",
    inputs: { INPUT_1: "version", INPUT_2: "use", INPUT_3: "inspect" },
    completeCode: "docker buildx create --name mi-builder --use && docker buildx inspect --bootstrap"
  },

  {
    id: 47,
    title: "BuildX - Compilar multi-plataforma (amd64/arm64)",
    stars: 4,
    category: "BUILDX",
    description: "Compila y publica una imagen que sea compatible con Intel (x64) y ARM a la vez.",
    objective: "Utilizar docker buildx build --platform",
    tags: ["buildx", "multiarch", "platform"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Compilación multi-plataforma en un paso

Una vez configurado tu builder Buildx, puedes generar imágenes compiladas simultáneamente para dos arquitecturas diferentes:
  - --platform linux/amd64,linux/arm64: Genera los binarios y empaquetados específicos para ambas arquitecturas.
  - --push: Envía directamente el 'manifest' multi-arquitectura al registro de contenedores (Docker Hub, etc.), ya que las imágenes locales no pueden almacenar dos arquitecturas en una sola etiqueta local simultáneamente.`,
    explanationText: "Ingresa los parámetros del buildx build: 'platform', 'push' y '.' (contexto local).",
    codeSnippet: "# Compilar y empujar imágenes de producción compatibles con arquitecturas Intel (amd64) y ARM (Apple Silicon/Raspberry Pi):\ndocker buildx build --[INPUT_1] linux/amd64,linux/arm64 \\\n  -t miusuario/mi-app:1.0.0 \\\n  --[INPUT_2] \\\n  [INPUT_3]",
    inputs: { INPUT_1: "platform", INPUT_2: "push", INPUT_3: "." },
    completeCode: "docker buildx build --platform linux/amd64,linux/arm64 -t miusuario/mi-app:1.0.0 --push ."
  },

  {
    id: 48,
    title: "GitHub Actions - CI con Docker (Pruebas unitarias)",
    stars: 4,
    category: "CI/CD",
    description: "Crea un paso de Integración Continua que ejecute pruebas unitarias dentro del contenedor.",
    objective: "Ejecutar validaciones automatizadas en GitHub Actions",
    tags: ["github actions", "ci", "testing"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Automatización de pruebas unitarias

En entornos de Integración Continua (CI), en lugar de tener que instalar dependencias o configurar SDKs específicos (.NET, Node, Java) en el host del Runner de GitHub Actions, corremos todo dentro del contenedor de Docker.
  - Usamos el Dockerfile de desarrollo ('Dockerfile.dev') para compilar la imagen incluyendo dependencias de desarrollo y herramientas de prueba.
  - Corremos el contenedor y ejecutamos el comando de testing (ej. 'npm run test' o 'dotnet test').`,
    explanationText: "Completa la configuración del Workflow: 'rm' (eliminar contenedor) y 'test'.",
    codeSnippet: "jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Run tests inside Docker\n        run: |\n          docker build -t test-image -f Dockerfile.dev .\n          docker run --[INPUT_1] test-image npm run [INPUT_2]",
    inputs: { INPUT_1: "rm", INPUT_2: "test" },
    completeCode: "docker run --rm test-image npm run test"
  },

  {
    id: 49,
    title: "GitHub Actions - Login en Docker Hub",
    stars: 4,
    category: "CI/CD",
    description: "Autentícate de forma segura en Docker Hub usando secretos de GitHub.",
    objective: "Configurar inicio de sesión en registros de contenedores",
    tags: ["github actions", "secrets", "docker hub", "auth"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Secretos de GitHub y autenticación

Para subir imágenes a tu registro de contenedores privado o público desde un pipeline de CI/CD, debes iniciar sesión de forma no interactiva (sin escribir contraseñas en consola).
  - Usamos la acción oficial 'docker/login-action'.
  - Almacenamos el usuario y el Token de Acceso Personal (no tu contraseña real) en los **Secrets** del repositorio de GitHub (\${{ secrets.DOCKERHUB_USERNAME }} y \${{ secrets.DOCKERHUB_TOKEN }}) para evitar filtraciones en los logs públicos.`,
    explanationText: "Especifica la acción de login: 'action', 'USERNAME' y 'TOKEN'.",
    codeSnippet: "      - name: Login to Docker Hub\n        uses: docker/login-[INPUT_1]@v3\n        with:\n          username: \${{ secrets.DOCKERHUB_[INPUT_2] }}\n          password: \${{ secrets.DOCKERHUB_[INPUT_3] }}",
    inputs: { INPUT_1: "action", INPUT_2: "USERNAME", INPUT_3: "TOKEN" },
    completeCode: "uses: docker/login-action@v3 | username: ${{ secrets.DOCKERHUB_USERNAME }} | password: ${{ secrets.DOCKERHUB_TOKEN }}"
  },

  {
    id: 50,
    title: "GitHub Actions - Autenticación en Digital Ocean Registry",
    stars: 4,
    category: "CI/CD",
    description: "Configura el inicio de sesión en el registro de contenedores privado de Digital Ocean.",
    objective: "Instalar doctl y autenticarse en Digital Ocean",
    tags: ["digital ocean", "doctl", "registry", "github actions"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Despliegue en Digital Ocean (DOCR)

Digital Ocean ofrece su propio servicio de registro de contenedores privado (Digital Ocean Container Registry - DOCR).
Para autenticarte desde GitHub Actions:
  1. Usamos la acción oficial de Digital Ocean para instalar su herramienta de CLI ('doctl').
  2. Ejecutamos el comando 'doctl registry login' pasando un tiempo de expiración corto para las credenciales por seguridad.`,
    explanationText: "Completa la configuración de Digital Ocean: 'doctl', 'expiry-seconds' y '1200'.",
    codeSnippet: "      - name: Install Doctl\n        uses: digitalocean/action-[INPUT_1]@v2\n        with:\n          token: \${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}\n      - name: Login to DO Container Registry\n        run: doctl registry login --[INPUT_2]-credentials [INPUT_3]",
    inputs: { INPUT_1: "doctl", INPUT_2: "expiry-seconds", INPUT_3: "1200" },
    completeCode: "uses: digitalocean/action-doctl@v2 && doctl registry login --expiry-seconds 1200"
  },

  {
    id: 51,
    title: "GitHub Actions - Build & Push Automatizado",
    stars: 4,
    category: "CI/CD",
    description: "Construye y empuja imágenes etiquetándolas con el commit Hash de Git.",
    objective: "Configurar compilación y envío en el pipeline de CI/CD",
    tags: ["github actions", "push", "sha", "tag"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Trazabilidad de versiones en producción

Es una mala práctica desplegar imágenes en producción usando el tag ':latest', ya que dificulta revertir cambios en caso de fallos (rollbacks) y no da información sobre qué commit Git contiene la imagen.
  - Usamos la acción 'docker/build-push-action'.
  - Etiquetamos las imágenes con el tag ':latest' (para identificar la última compilación) y adicionalmente con el Hash corto del commit Git de la request (\${{ github.sha }}). Esto garantiza la trazabilidad del código.`,
    explanationText: "Ingresa las llaves de la acción: 'action', 'true' y 'sha'.",
    codeSnippet: "      - name: Build and Push Docker image\n        uses: docker/build-push-[INPUT_1]@v5\n        with:\n          context: .\n          push: [INPUT_2]\n          tags: |\n            miregistro.co/mi-app:latest\n            miregistro.co/mi-app:\${{ github.[INPUT_3] }}",
    inputs: { INPUT_1: "action", INPUT_2: "true", INPUT_3: "sha" },
    completeCode: "uses: docker/build-push-action@v5 | push: true | tag: ${{ github.sha }}"
  },

  {
    id: 52,
    title: "GitHub Actions - Estrategia de Cache de Capas de Docker",
    stars: 5,
    category: "CI/CD",
    description: "Optimiza los tiempos de build en tus pipelines de GitHub Actions configurando caché de capas.",
    objective: "Reducir tiempos de compilación usando caché en la nube",
    tags: ["github actions", "cache", "performance", "optimization"],
    fileName: ".github/workflows/ci.yml",
    completed: false,
    theory: `📚 TEORÍA: Cacheo de compilación en CI/CD

Por defecto, los runners de GitHub Actions son máquinas virtuales limpias que no guardan nada. Esto significa que cada ejecución descargará todas las imágenes base y compilará dependencias desde cero, lo que puede tomar 10 a 20 minutos.
BuildX permite usar el backend de almacenamiento de caché de GitHub Actions (gha):
  - cache-from: type=gha -> Revisa la caché de GitHub para ver si las capas de Dockerfile no han cambiado.
  - cache-to: type=gha,mode=max -> Guarda todas las capas compiladas (incluso las intermedias) de vuelta a la caché del repositorio.
Esto reduce los tiempos de build subsiguientes de minutos a pocos segundos.`,
    explanationText: "Completa el tipo y modo de caché: 'gha' y 'max'.",
    codeSnippet: "      - name: Build with Cache\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: miregistro.co/mi-app:latest\n          # Usar cache del GitHub Actions Cache service\n          cache-from: type=[INPUT_1]\n          cache-to: type=gha,mode=[INPUT_2]",
    inputs: { INPUT_1: "gha", INPUT_2: "max" },
    completeCode: "cache-from: type=gha | cache-to: type=gha,mode=max"
  },

  {
    id: 53,
    title: "Digital Ocean - Despliegue en App Platform",
    stars: 4,
    category: "CLOUD",
    description: "Configura el archivo descriptor de Digital Ocean para desplegar tu contenedor y conectarlo a una base de datos Postgres administrada.",
    objective: "Escribir un app.yaml para Digital Ocean App Platform",
    tags: ["digital ocean", "cloud", "deployment", "yaml"],
    fileName: "app.yaml",
    completed: false,
    theory: `📚 TEORÍA: Infraestructura Declarativa en Digital Ocean

Digital Ocean App Platform es una plataforma de servicios gestionados (PaaS) que permite desplegar contenedores simplemente apuntando a una imagen de Docker Registry.
El archivo 'app.yaml' describe la arquitectura completa:
  - name: El nombre del servicio.
  - image: Mapea a la ubicación en el registro de contenedores de Digital Ocean.
  - databases: Define bases de datos PostgreSQL gestionadas automáticamente en la nube.
  - envs: Permite interpolar variables de configuración dinámicas y credenciales de bases de datos.`,
    explanationText: "Completa la configuración del YAML de Digital Ocean: 'digitalocean', 'DATABASE_URL' y 'pg'.",
    codeSnippet: "name: mi-app-web\nregion: nyc\nservices:\n  - name: backend-api\n    image:\n      registry_type: [INPUT_1] # Registro de DO\n      registry: mi-registro-do\n      repository: mi-api\n      tag: latest\n    run_command: dotnet MiApi.dll\n    envs:\n      - key: DATABASE_URL\n        scope: RUN_TIME\n        value: \${db.[INPUT_2]}\n# Base de datos manejada en Digital Ocean\ndatabases:\n  - name: db\n    engine: [INPUT_3]",
    inputs: { INPUT_1: "digitalocean", INPUT_2: "DATABASE_URL", INPUT_3: "pg" },
    completeCode: "registry_type: digitalocean | value: ${db.DATABASE_URL} | engine: pg"
  },

  {
    id: 54,
    title: "Monitoreo de contenedores - Límites de recursos",
    stars: 4,
    category: "CONTENEDORES",
    description: "Limita la memoria RAM y CPU máxima de tus bases de datos Postgres para evitar que crasheen el servidor host.",
    objective: "Establecer límites de hardware a los contenedores",
    tags: ["limits", "memory", "cpu", "monitoring"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Contención de recursos en Docker

Por defecto, un contenedor de Docker tiene acceso ilimitado a toda la CPU y memoria RAM de tu servidor físico. Si tu base de datos entra en un ciclo de consulta pesada infinito o tiene fugas de memoria, consumirá todo el hardware y congelará tu servidor host.
  • docker container stats: Muestra en vivo el porcentaje de CPU, memoria en uso, límite de RAM, I/O de disco e interfaces de red de todos los contenedores.
  • --memory: Límite duro de memoria RAM (ej. '512m').
  • --cpus: Límite de núcleos de procesamiento (ej. '1.0' representa exactamente un núcleo).`,
    explanationText: "Completa los comandos de monitoreo y límite de recursos: 'stats', 'memory' y 'cpus'.",
    codeSnippet: "# Ver estadísticas de uso de CPU y memoria en tiempo real de los contenedores:\ndocker container [INPUT_1]\n\n# Limitar el contenedor Postgres a un máximo de 512MB de memoria RAM y 1 core de CPU:\ndocker container run -d --name db-limitada \\\n  --[INPUT_2]=\"512m\" \\\n  --[INPUT_3]=1.0 \\\n  postgres:alpine",
    inputs: { INPUT_1: "stats", INPUT_2: "memory", INPUT_3: "cpus" },
    completeCode: "docker stats && docker run --memory=\"512m\" --cpus=1.0 postgres:alpine"
  },

  {
    id: 55,
    title: "Seguridad Avanzada - Escaneo de vulnerabilidades (Trivy)",
    stars: 4,
    category: "SEGURIDAD",
    description: "Utiliza herramientas de análisis estático de seguridad para detectar vulnerabilidades críticas en tus imágenes base.",
    objective: "Implementar análisis de vulnerabilidades con Trivy",
    tags: ["security", "trivy", "vulnerability", "scan"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Escaneo de imágenes de contenedores

Las imágenes de Node, Python o .NET que descargas de Internet contienen paquetes de sistema operativo (como OpenSSL, libc, tar) que pueden tener fallos de seguridad conocidos.
  • Trivy (desarrollado por Aqua Security) es el escáner de seguridad de código abierto más popular.
  • Analiza las dependencias del sistema operativo y los paquetes de desarrollo (npm, nuget) contra bases de datos de vulnerabilidades CVE (Common Vulnerabilities and Exposures).
  • Es ideal para integrarse en pipelines de CI/CD para detener el despliegue si se detectan vulnerabilidades de severidad CRITICAL o HIGH.`,
    explanationText: "Ingresa el nombre del comando y parámetros de severidad: 'trivy', 'severity' y 'node:20'.",
    codeSnippet: "# Instalar y escanear una imagen de Node para detectar huecos de seguridad conocidos (CVEs):\n[INPUT_1] image node:20\n\n# Filtrar el escaneo para reportar solo vulnerabilidades de severidad CRITICAL y HIGH:\ntrivy image --[INPUT_2] HIGH,CRITICAL [INPUT_3]",
    inputs: { INPUT_1: "trivy", INPUT_2: "severity", INPUT_3: "node:20" },
    completeCode: "trivy image node:20 --severity HIGH,CRITICAL"
  },

  {
    id: 56,
    title: "Seguridad Avanzada - Reducir privilegios (Read-only Root FS)",
    stars: 5,
    category: "SEGURIDAD",
    description: "Protege tu servidor web bloqueando la posibilidad de escribir en el disco del contenedor.",
    objective: "Configurar un contenedor con sistema de archivos de solo lectura",
    tags: ["security", "read-only", "hardening"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Hardening de contenedores (Aseguramiento)

Si un atacante hackea tu servidor Nginx o Node, usualmente intentará escribir código malicioso o scripts de minado en directorios temporales como '/tmp' o '/var/www'.
Para evitar esto:
  • --read-only: Monta el sistema de archivos raíz del contenedor de forma estrictamente de solo lectura. El contenedor fallará al intentar escribir cualquier archivo en disco.
  - Dado que aplicaciones como Nginx requieren obligatoriamente escribir datos de caché o IDs de proceso temporales en carpetas específicas, debemos mapear volúmenes locales o 'tmpfs' en memoria para esas rutas de escritura indispensables.`,
    explanationText: "Ingresa los argumentos de seguridad: 'read-only' y 'escritura'.",
    codeSnippet: "# Correr Nginx con el filesystem de solo lectura para evitar inyección de scripts maliciosos:\ndocker container run -d --name nginx-seguro \\\n  --[INPUT_1] \\\n  -v cache-vol:/var/cache/nginx \\\n  -p 80:80 nginx:alpine\n\n# Nota: necesitas montar volúmenes para directorios donde Nginx obligatoriamente requiere [INPUT_2] de archivos temporales.",
    inputs: { INPUT_1: "read-only", INPUT_2: "escritura" },
    completeCode: "docker run --read-only -v cache-vol:/var/cache/nginx nginx:alpine"
  },

  {
    id: 57,
    title: "Dockerfile multi-stage avanzado para NestJS / TS",
    stars: 4,
    category: "DOCKERFILE",
    description: "Crea un Dockerfile avanzado para compilar TypeScript y eliminar dependencias redundantes.",
    objective: "Podar dependencias y optimizar código TypeScript compilado",
    tags: ["typescript", "nestjs", "multistage", "optimization"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Poda de dependencias en Node/TypeScript

En proyectos TypeScript (como NestJS o Angular/Vue en Node):
  1. La etapa de compilación ('build') requiere todo el compilador de TS ('tsc') y librerías externas declaradas en 'devDependencies'.
  2. Una vez compilado a código de Node puro en la carpeta '/dist', no necesitas el código fuente de TS ni las librerías de desarrollo en producción.
  • npm prune --only=production: Elimina de la carpeta 'node_modules' todas las dependencias de desarrollo instaladas anteriormente.
En la segunda etapa, copiamos únicamente el 'dist' compilado y el 'node_modules' ya depurado.`,
    explanationText: "Ingresa las palabras clave para producción: 'prune', 'dist', 'EXPOSE' y 'main'.",
    codeSnippet: "# Etapa 1: Dependencias de desarrollo y compilación\nFROM node:20-alpine AS build\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n# Eliminar dependencias de desarrollo\nRUN npm [INPUT_1] --only=production\n\n# Etapa 2: Imagen mínima de runtime\nFROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY --from=build /usr/src/app/package*.json ./\nCOPY --from=build /usr/src/app/node_modules ./node_modules\nCOPY --from=build /usr/src/app/[INPUT_2] ./dist\n[INPUT_3] 3000\nCMD [\"node\", \"dist/[INPUT_4].js\"]",
    inputs: { INPUT_1: "prune", INPUT_2: "dist", INPUT_3: "EXPOSE", INPUT_4: "main" },
    completeCode: "RUN npm prune --only=production | COPY --from=build /app/dist | CMD [\"node\", \"dist/main.js\"]"
  },

  {
    id: 58,
    title: "Multi-stage build avanzado para .NET con migraciones",
    stars: 4,
    category: "DOCKERFILE",
    description: "Integra pruebas unitarias obligatorias durante la compilación de tu API de C#.",
    objective: "Compilar y probar proyectos .NET Core automáticamente",
    tags: ["dotnet", "csharp", "testing", "multistage"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Integrar testing en pipelines de Dockerfile

Una práctica recomendada en DevOps es asegurar que ninguna imagen de producción se cree si las pruebas unitarias fallan.
  - Creamos una etapa intermedia llamada 'testrunner' basada en el código compilado.
  - Ejecutamos 'dotnet test'. Si las pruebas fallan, el motor de construcción de Docker interrumpirá el build inmediatamente devolviendo un código de error y previniendo la creación de la imagen final.
  - Para producción, deshabilitamos la restauración implícita de NuGet ('--no-restore') en 'dotnet publish' para ahorrar tiempo ya que los paquetes se restauraron previamente.`,
    explanationText: "Completa los comandos de .NET: 'test', 'restore' y 'ENTRYPOINT'.",
    codeSnippet: "FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nWORKDIR /app\nCOPY *.sln ./\nCOPY Api/*.csproj ./Api/\nRUN dotnet restore\nCOPY . .\nRUN dotnet build -c Release\n\n# Ejecución de Pruebas Unitarias integradas en el Build\nFROM build AS testrunner\nWORKDIR /app/Tests\nENTRYPOINT [\"dotnet\", \"[INPUT_1]\", \"--logger:trx\"]\n\n# Publicación final\nFROM build AS publish\nWORKDIR /app/Api\nRUN dotnet publish -c Release -o /app/out --no-[INPUT_2]\n\n# Runtime\nFROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY --from=publish /app/out .\n[INPUT_3] [\"dotnet\", \"Api.dll\"]",
    inputs: { INPUT_1: "test", INPUT_2: "restore", INPUT_3: "ENTRYPOINT" },
    completeCode: "FROM build AS testrunner RUN dotnet test | RUN dotnet publish --no-restore | ENTRYPOINT"
  },

  {
    id: 59,
    title: "Compose en Producción - Políticas de reinicio",
    stars: 4,
    category: "COMPOSE",
    description: "Configura políticas de tolerancia a fallos en Docker Compose.",
    objective: "Implementar reinicios automáticos ante crashes",
    tags: ["compose", "production", "restart", "always"],
    fileName: "docker-compose.yml",
    completed: false,
    theory: `📚 TEORÍA: Políticas de Reinicio en Docker

En producción, las aplicaciones pueden cerrarse inesperadamente debido a errores de desbordamiento de memoria, desconexiones de base de datos o fallos del hardware del host.
Docker puede gestionar el reinicio automático de estos servicios:
  - 'restart: always': Reinicia el contenedor si se detiene. Si el servidor host se apaga o reinicia, Docker encenderá el contenedor automáticamente al arrancar.
  - 'restart: unless-stopped': Similar a 'always', pero si detienes el contenedor manualmente usando 'docker stop', Docker no intentará levantarlo al reiniciar el host.
  - 'restart: on-failure': Solo reinicia si el contenedor finaliza con un código de error distinto de cero (ideal para scripts de inicialización).`,
    explanationText: "Ingresa los parámetros de reinicio de Compose: 'restart', 'always' y 'on-failure'.",
    codeSnippet: "services:\n  api:\n    image: mi-app:latest\n    # Política de reinicio para que el contenedor vuelva a levantarse si se cae por un error interno (crash)\n    [INPUT_1]: [INPUT_2]\n    # Para evitar reinicios infinitos si falla inmediatamente al inicio, usar:\n    # restart: [INPUT_3]",
    inputs: { INPUT_1: "restart", INPUT_2: "always", INPUT_3: "on-failure" },
    completeCode: "restart: always | restart: on-failure"
  },

  {
    id: 60,
    title: "Kubernetes - Arquitectura",
    stars: 4,
    category: "KUBERNETES",
    description: "Comprende la arquitectura interna de un clúster de Kubernetes.",
    objective: "Identificar componentes del Control Plane y Workers",
    tags: ["k8s", "architecture", "kubelet", "control plane"],
    fileName: "Teoría",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué es Kubernetes (K8s)?

Docker sirve para empaquetar y correr contenedores en un solo servidor. Pero, ¿qué pasa si tienes 100 servidores y necesitas balancear carga, actualizar sin caídas y escalar contenedores dinámicamente?
Aquí es donde entra **Kubernetes (K8s)**, un orquestador de contenedores a gran escala.
Componentes de K8s:
  1. Control Plane (Master Node): El cerebro. Administra el estado global, agenda contenedores y expone la API de Kubernetes.
  2. Worker Nodes: Los servidores que ejecutan los contenedores reales.
  3. Kubelet: Un agente pequeño e inteligente que se ejecuta en cada Worker Node para asegurar que los contenedores declarados en el YAML estén realmente saludables.`,
    explanationText: "Completa los conceptos de K8s: 'control plane', 'nodos' y 'kubelet'.",
    codeSnippet: "En un clúster de Kubernetes, el [INPUT_1] gestiona el estado global (planificador, API server, base de datos de configuración etcd). Los servidores que corren los contenedores reales se llaman [INPUT_2]. El componente residente en cada nodo que recibe las órdenes y gestiona los contenedores locales se llama [INPUT_3].",
    inputs: { INPUT_1: "control plane", INPUT_2: "nodos", INPUT_3: "kubelet" },
    completeCode: "K8s arquitectura: Control Plane (cerebro), Worker Nodes (servidores), Kubelet (agente local)"
  },

  {
    id: 61,
    title: "K8s - kubectl y comandos esenciales",
    stars: 4,
    category: "KUBERNETES",
    description: "Aprende los comandos principales de CLI de la utilidad kubectl para auditar tu clúster.",
    objective: "Gestionar K8s con comandos kubectl",
    tags: ["k8s", "kubectl", "cli", "pods"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: La CLI de Kubernetes (kubectl)

'kubectl' es la utilidad de línea de comandos para comunicarte con la API de tu clúster de Kubernetes.
Comandos fundamentales de auditoría:
  • kubectl get <recurso>: Lista los recursos activos (pods, deployments, services).
  • kubectl describe <recurso> <nombre>: Muestra detalles minuciosos del estado interno, variables cargadas y eventos recientes del recurso.
  • kubectl logs <pod_name>: Imprime la salida de consola de los contenedores en el pod.`,
    explanationText: "Completa los verbos del comando kubectl: 'get', 'describe' y 'logs'.",
    codeSnippet: "# Obtener la lista de todos los Pods corriendo en el namespace por defecto:\nkubectl [INPUT_1] pods\n\n# Ver detalles extendidos del pod llamado 'mi-pod' para depurar errores:\nkubectl [INPUT_2] pod mi-pod\n\n# Ver logs en tiempo real del contenedor dentro del pod:\nkubectl [INPUT_3] -f mi-pod",
    inputs: { INPUT_1: "get", INPUT_2: "describe", INPUT_3: "logs" },
    completeCode: "kubectl get pods | kubectl describe pod mi-pod | kubectl logs -f mi-pod"
  },

  {
    id: 62,
    title: "K8s - Definición de un Pod",
    stars: 4,
    category: "KUBERNETES",
    description: "Escribe la definición básica en YAML para crear un Pod en Kubernetes.",
    objective: "Comprender la estructura de un archivo YAML de Pod",
    tags: ["k8s", "pod", "yaml"],
    fileName: "pod.yaml",
    completed: false,
    theory: `📚 TEORÍA: El objeto Pod en K8s

Un **Pod** es la unidad de ejecución más pequeña y básica en Kubernetes.
  - Representa un proceso ejecutándose en tu clúster.
  - Un Pod puede contener uno o más contenedores estrechamente acoplados que comparten almacenamiento y dirección IP de red.
  - Rara vez se crean Pods de forma directa en producción (se prefieren Deployments), pero entender su YAML es crucial.
Componentes del YAML:
  - kind: El tipo de recurso de Kubernetes a crear (Pod).
  - spec.containers: Lista de imágenes de Docker que correrán dentro.`,
    explanationText: "Completa la sintaxis básica del Pod: 'kind', 'containers' y 'ports'.",
    codeSnippet: "apiVersion: v1\n[INPUT_1]: Pod\nmetadata:\n  name: api-pod\n  labels:\n    app: backend\nspec:\n  [INPUT_2]:\n    - name: node-api\n      image: node:20-alpine\n      [INPUT_3]:\n        - containerPort: 3000",
    inputs: { INPUT_1: "kind", INPUT_2: "containers", INPUT_3: "ports" },
    completeCode: "kind: Pod | spec: containers: - name: ... ports: - containerPort: 3000"
  },

  {
    id: 63,
    title: "K8s - Creación de un Deployment",
    stars: 4,
    category: "KUBERNETES",
    description: "Crea una plantilla declarativa (Deployment) para desplegar múltiples réplicas de tu API.",
    objective: "Escribir un YAML de Deployment para escalar contenedores",
    tags: ["k8s", "deployment", "replicas", "yaml"],
    fileName: "deployment.yaml",
    completed: false,
    theory: `📚 TEORÍA: Deployments y Alta Disponibilidad

Un **Deployment** es el recurso recomendado para desplegar aplicaciones de producción sin estado (stateless):
  - Gestiona el ciclo de vida de los Pods de forma automática.
  - Si un Pod se cae o falla el nodo físico, el Deployment creará un nuevo Pod en otro nodo inmediatamente.
  - replicas: Define cuántos Pods idénticos deben estar ejecutándose en paralelo.
  - template: Describe la plantilla del Pod que el orquestador replicará.`,
    explanationText: "Ingresa las propiedades del Deployment: 'replicas' y 'template'.",
    codeSnippet: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-deployment\nspec:\n  [INPUT_1]: 3 # Número de réplicas corriendo en paralelo\n  selector:\n    matchLabels:\n      app: api\n  [INPUT_2]: # Definición del Pod a replicar\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n        - name: net-api\n          image: mi-registro/net-api:latest",
    inputs: { INPUT_1: "replicas", INPUT_2: "template" },
    completeCode: "spec: replicas: 3 | selector: matchLabels: ... | template: metadata: labels: ..."
  },

  {
    id: 64,
    title: "K8s - Escalabilidad en Deployment",
    stars: 4,
    category: "KUBERNETES",
    description: "Modifica el número de réplicas activas en caliente utilizando comandos de escala.",
    objective: "Escalar pods dinámicamente desde terminal",
    tags: ["k8s", "scale", "replicas", "kubectl"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Escalabilidad Elástica en Kubernetes

Una de las grandes ventajas de Kubernetes es poder responder instantáneamente a picos de tráfico.
Si tu backend API de .NET o Node comienza a saturarse con peticiones:
  • kubectl scale: Cambia el número de réplicas en ejecución de forma inmediata sin interrumpir el servicio.
  • kubectl rollout status: Te permite ver y monitorizar el estado de la actualización a medida que se descargan imágenes y se levantan las réplicas adicionales.`,
    explanationText: "Ingresa las opciones para escalar réplicas: 'scale', 'replicas' y 'status'.",
    codeSnippet: "# Escalar dinámicamente un Deployment existente a 5 réplicas en caliente:\nkubectl [INPUT_1] deployment api-deployment --[INPUT_2]=5\n\n# Comprobar el progreso del escalado en tiempo real:\nkubectl rollout [INPUT_3] deployment api-deployment",
    inputs: { INPUT_1: "scale", INPUT_2: "replicas", INPUT_3: "status" },
    completeCode: "kubectl scale deployment api-deployment --replicas=5 && kubectl rollout status deployment api-deployment"
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
    theory: `📚 TEORÍA: Servicios en Kubernetes

Los Pods en Kubernetes tienen IPs dinámicas que cambian cada vez que se recrean o reinician. Para evitar que tus clientes pierdan la conexión, se utiliza un **Service**.
Un Service es una abstracción que define una política de red estable para acceder a los Pods:
  - selector: Mapea a las etiquetas del deployment ('app: api') para saber a qué Pods redirigir tráfico.
  - type: LoadBalancer: Integra un balanceador de carga del proveedor de nube (AWS, GCP, Azure, Digital Ocean) que provee una dirección IP pública para recibir las peticiones externas.
  - targetPort: El puerto interno del contenedor de tu aplicación (ej. 8080 en ASP.NET Core).`,
    explanationText: "Ingresa los atributos de Kubernetes Service: 'LoadBalancer', 'targetPort' y 'apply'.",
    codeSnippet: "apiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  # Exponer una IP pública del proveedor de la nube para distribuir carga\n  type: [INPUT_1]\n  selector:\n    app: api\n  ports:\n    - protocol: TCP\n      port: 80 # Puerto expuesto por el servicio\n      [INPUT_2]: 8080 # Puerto en el contenedor\n\n# Aplicar el Service a Kubernetes:\n# kubectl [INPUT_3] -f service.yaml",
    inputs: { INPUT_1: "LoadBalancer", INPUT_2: "targetPort", INPUT_3: "apply" },
    completeCode: "type: LoadBalancer | targetPort: 8080 | kubectl apply -f service.yaml"
  }
];
