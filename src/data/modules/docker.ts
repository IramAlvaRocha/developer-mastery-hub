import type { Exercise } from "@/lib/types";

export const DOCKER_EXERCISES: Exercise[] = [

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
    explanationText: "🌍 Ejemplo cotidiano: la imagen es la receta y el contenedor es el plato servido: la misma receta se puede cocinar muchas veces, y cada plato es una instancia aislada con la misma comida.\n\nUn contenedor es la instancia ejecutable de una imagen, corriendo aislado con su propio filesystem. La imagen agrupa código, dependencias y configuraciones en capas; el contenedor la pone a funcionar. Crear un contenedor no modifica la imagen: para aplicar cambios hay que recrearlo.",
    codeSnippet: "Un [INPUT_1] es una instancia de una [INPUT_2] ejecutándose en un ambiente aislado que empaqueta todas las dependencias para ejecutarse.",
    inputs: { INPUT_1: "contenedor", INPUT_2: "imagen" },
    completeCode: "Un contenedor es una instancia de una imagen ejecutándose de forma aislada.",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Elige el concepto correcto para completar la definición.",
      options: {
        INPUT_1: ["contenedor", "imagen", "daemon", "registro"],
        INPUT_2: ["contenedor", "imagen", "daemon", "registro"],
      }
    }
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
    explanationText: "🌍 Ejemplo cotidiano: el daemon es el 'gerente de hotel' que corre en segundo plano atendiendo órdenes, y el registro es el 'almacén central' de donde se traen las maletas (imágenes) y adonde se devuelven.\n\nEl daemon es el servicio persistente que administra contenedores, imágenes, redes y volúmenes en el host; el cliente (docker CLI) le habla por una API REST. El registro es el servidor externo que almacena y distribuye imágenes. Esta separación permite que el CLI funcione como simple 'control remoto' sin saber cómo se gestiona cada contenedor.",
    codeSnippet: "El Docker [INPUT_1] es el servicio en segundo plano que administra contenedores en el host, mientras que el [INPUT_2] es el servidor que almacena y distribuye imágenes de Docker.",
    inputs: { INPUT_1: "daemon", INPUT_2: "registro" },
    completeCode: "El Docker daemon administra los contenedores y el registro los almacena.",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Elige el componente de la arquitectura de Docker que corresponde a cada hueco.",
      options: {
        INPUT_1: ["daemon", "registro", "cliente", "volumen"],
        INPUT_2: ["daemon", "registro", "cliente", "volumen"],
      }
    }
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
    explanationText: "docker pull descarga la imagen al almacén local (host) SIN ejecutarla: es como pedir el paquete antes de abrirlo. Usar un tag explícito como postgres:15.1 fija una versión concreta; si usas 'latest' (o no pones tag), recibes la última disponible y el comportamiento puede cambiar sin avisar cuando alguien publique una nueva versión.",
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
    explanationText: "🌍 Ejemplo cotidiano: -d es 'soltar la orden y seguir con tu vida' (corre en background) y -p es 'instalar un portero que traduce el puerto 80 de tu casa al 80 del contenedor'.\n\n-d (detached) ejecuta el contenedor desligado de la terminal, así no bloquea tu consola. -p mapea puertos HOST:CONTAINER para que el puerto interno del contenedor quede accesible desde tu máquina. Docker permite combinar banderas cortas en una sola: -dp 80:80 es equivalente a -d -p 80:80.",
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
    explanationText: "docker container run y docker run son la misma orden: la primera es la sintaxis moderna y agrupada por recurso (container/image/volume), la segunda es el alias corto tradicional. Saber ambas es clave porque verás las dos en tutoriales, scripts y documentación, y producen exactamente el mismo resultado.",
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
    explanationText: "--help es la documentación integrada de cada comando: te muestra las banderas disponibles y ejemplos sin salir de la terminal. Es el primer reflejo de un senior ante una duda de CLI, mucho más rápido que buscar en internet y siempre está actualizado con la versión instalada.",
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
    explanationText: "Sin --name, Docker asigna nombres aleatorios (como 'ecstatic_shannon'), difíciles de recordar y escribir. Un nombre propio convierte el contenedor en algo referenciable por palabra en lugar de ID, lo que simplifica comandos, scripting y debugging en equipo.",
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
    explanationText: "docker container ls y docker ps muestran solo los contenedores activos; con -a (all) también aparecen los detenidos, que siguen ocupando espacio y nombre hasta que los elimines. Auditar contenedores con -a es el primer paso antes de un cleanup, porque los detenidos no se ven por defecto.",
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
    explanationText: "stop apaga el proceso principal del contenedor (le envía SIGTERM) pero lo deja existiendo; rm lo elimina del disco junto con su capa de escritura. La diferencia importa: un contenedor detenido recuperable con start sigue consumiendo recursos de nombre/almacenamiento, mientras que uno eliminado libera todo. Para casos urgentes, rm -f detiene y borra en un solo paso.",
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
    explanationText: "start enciende un contenedor existente que fue detenido, reutilizando su configuración y su capa de escritura: no se recrea desde la imagen ni se pierden los datos escritos en su filesystem. Es la diferencia entre 'pausar/reanudar' (start/stop) y 'rehacer desde cero' (run/rm).",
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
    explanationText: "rm -f combina detener y eliminar en un solo paso, útil en scripts de cleanup o cuando un contenedor no responde a la parada normal. También acepta varios IDs/names separados por espacio, lo que convierte limpiezas masivas en una sola línea en lugar de un bucle.",
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
    explanationText: "docker login autentica tu CLI contra un registro (Docker Hub por defecto) para poder subir imágenes propias o descargar repositorios privados. La bandera -u indica el usuario; Docker pide la contraseña de forma interactiva. En entornos automatizados usa Tokens de Acceso en lugar de la contraseña, porque son revocables y no exponen tu cuenta.",
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
    explanationText: "docker build empaqueta tu código siguiendo las instrucciones del Dockerfile y produce una imagen. -t asigna un nombre legible (indispensable para identificarla después), y el '.' final indica el contexto de construcción: el directorio que Docker envía al daemon para copiar archivos. Construir sin tag produce imágenes anónimas difíciles de rastrear.",
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
    explanationText: "docker tag no copia la imagen, crea una referencia adicional con el nombre objetivo (tu-usuario/imagen). Es el paso previo obligatorio antes de docker push a un registro: el registro identifica la imagen por su nombre completo, así que necesitas un tag que apunte a tu cuenta o URL de registro.",
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
    explanationText: "Los tags de versión (mi-app:2.0.0) permiten rastrear y desplegar versiones concretas en vez de depender de 'latest', que apunta a la última compilación y puede romper despliegues si cambia. En producción, todo despliegue debería referenciar un tag inmutable: si no puedes reproducir la versión exacta, no puedes hacer rollback.",
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
    explanationText: "docker images lista el inventario local; docker rmi (o docker image rm) elimina una imagen por nombre o ID. Distingue siempre entre contenedores (instancias en ejecución) e imágenes (plantillas): rmi falla si algún contenedor sigue usándola, por eso primero detienes y borras contenedores y después las imágenes.",
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
    explanationText: "Las imágenes intermedias sin tag (dangling, aparecen como <none>) se acumulan con cada rebuild y ocupan espacio. docker image prune limpia solo las colgadas; con -a elimina además todas las no usadas por ningún contenedor. Es el mantenimiento rutinario que evita que el disco del host se llene con cachés de build.",
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
    explanationText: "docker logs muestra lo que la app escribe en stdout/stderr, la única 'ventana' a un proceso que corre aislado. --follow (-f) mantiene la terminal abierta e imprime los logs nuevos en vivo, imprescindible para depurar arranques o peticiones mientras ocurren, como un tail -f pero hacia el contenedor.",
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
    explanationText: "docker stats es el 'administrador de tareas' de tus contenedores: muestra en vivo CPU, memoria, red y disco de todos los activos. Es el primer diagnóstico cuando sospechas que un contenedor se come los recursos del host o que un límite no se está aplicando.",
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
    explanationText: "🌍 Ejemplo cotidiano: exec es 'abrir una puerta' al contenedor en marcha: -it te da una terminal interactiva (como sentarte en el escritorio), y el último argumento es qué ejecutar ahí dentro (bash, sh).\n\ndocker exec ejecuta un proceso nuevo DENTRO de un contenedor activo, sin reiniciarlo. -i mantiene la entrada abierta e -t asigna una pseudo-terminal (juntas forman -it, la combinación estándar para sesiones interactivas). Es la herramienta de diagnóstico: con bash dentro puedes inspeccionar variables, procesos y rutas del contenedor real, no del que imaginas.",
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
    explanationText: "🌍 Ejemplo cotidiano: un volume es una 'caja de almacenamiento' que vive fuera del contenedor: si el contenedor se borra, la caja queda intacta con sus datos. Con --name la identificas por nombre en lugar de por un hash aleatorio.\n\ndocker volume create prepara el almacenamiento persistente antes de usarlo; ls lo lista e inspect muestra dónde vive físicamente (mountpoint) y qué contenedores lo usan. Sin volúmenes, todo lo que escriba el contenedor desaparece al eliminarlo: un postgres sin volumen pierde la base de datos completa.",
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
    explanationText: "-v nombre_volumen:/ruta_interna monta un volumen nombrado en una ruta específica del contenedor. Todo lo que la app escriba en esa ruta queda persistido en el volumen, aunque el contenedor se detenga o elimine: es la forma estándar de conservar bases de datos y datos de usuario entre reinicios.",
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
    explanationText: "🌍 Ejemplo cotidiano: un bind mount es 'prestarle al contenedor tu carpeta de trabajo': como trabajar en un documento compartido en la nube, los cambios que haces en tu editor se reflejan al instante dentro del contenedor.\n\nUn bind mount apunta a una ruta ABSOLUTA del host ($(pwd) en Linux/Mac, C:\\... en PowerShell) y la monta en el contenedor. -w (workdir) define en qué directorio arranca el comando. Es la configuración de desarrollo: permites hot-reload sin reconstruir la imagen, mientras que en producción se usan volúmenes nombrados para que la persistencia no dependa de la ruta de la máquina.",
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
    explanationText: "Un volumen anónimo declara solo la ruta interna (/var/lib/mysql/data): Docker crea una carpeta automática en el host, sin nombre propio. Sirve para persistir datos sin preocuparse de la gestión, pero al no tener nombre es difícil de reutilizar o limpiar selectivamente. Para datos que importan (bases de datos, uploads), un named volume es casi siempre la elección correcta.",
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
    explanationText: "🌍 Ejemplo cotidiano: una red Docker es un 'cableado' privado entre contenedores: los que comparten red se ven por nombre y se hablan; los que están en redes distintas, ni se conocen.\n\nDocker crea una red por contenedor en el arranque, pero los contenedores en redes separadas no pueden comunicarse entre sí. docker network create arma la red explícita, ls la lista e inspect revela qué contenedores están conectados y sus IPs. Poner tu API y tu base de datos en la misma red (y publicar solo la API al host) es el patrón de arquitectura básico y el más seguro por defecto.",
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
    explanationText: "El network alias es el 'número corto' de un contenedor dentro de su red: --network-alias mysql permite que los demás contenedores de la red se conecten usando 'mysql' como hostname en vez de la IP variable. La IP de un contenedor cambia cada vez que se recrea, así que las apps deben apuntar al alias, no a la IP. Las variables -e inyectan configuración (como la contraseña raíz) en el contenedor sin escribirla en la imagen.",
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
    explanationText: "🌍 Ejemplo cotidiano: es la diferencia entre la 'puerta de calle' (host) y la 'puerta del cuarto' (contenedor): el mapeo -p 6000:6379 dice 'el que toque la puerta 6000 de la calle, que entre a la habitación 6379'.\n\nEn -p HOST:CONTAINER, el primer puerto es el de tu máquina física y el segundo el interno del contenedor. Confundir el orden es un error clásico: si publicas 6379:6000, expones el puerto 6379 del host apuntando al 6000 del contenedor, y nada escucha ahí. La regla mental: 'lo que ve el mundo' (host) : 'lo que escucha la app' (container).",
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
    explanationText: "🌍 Ejemplo cotidiano: FROM es la 'base de la construcción': como elegir el tipo de cimientos y materiales iniciales (node, nginx) sobre los que se levantará tu imagen.\n\nToda imagen Docker hereda de otra existente: FROM node:18.3.1 parte de una imagen con Node instalado y sobre ella añades tus capas. AS builder asigna un alias para usarla en multi-stage builds, donde una etapa prepara artefactos y otra copia solo lo necesario. Elegir bien la imagen base (oficial, con tag fijo, lo más reducida posible) define tamaño y superficie de ataque de todo lo que construyas.",
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
    explanationText: "La bandera --platform fija la arquitectura de la imagen base independientemente de donde compiles: es lo que permite compilar para Intel (linux/amd64) en un Mac con Apple Silicon y viceversa. Sin declararla, la imagen hereda la arquitectura del equipo de build y luego falla en producción si el servidor usa otra. En equipos con chips M1/M2/M3 esto es la diferencia entre 'compila' y 'funciona en el server'.",
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
    explanationText: "ENV define variables persistentes dentro de la imagen: disponibles tanto durante la construcción (para RUN) como en runtime (para el proceso del contenedor). Centraliza configuración (rutas, versiones) en un solo lugar del Dockerfile en vez de repetirla; las referencias con $VARNAME se expanden en las instrucciones siguientes.",
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
    explanationText: "RUN ejecuta comandos en TIEMPO DE CONSTRUCCIÓN y su resultado se graba como una capa nueva de la imagen. Sirve para preparar el entorno (instalar dependencias, compilar). --frozen-lockfile hace que yarn respete exactamente las versiones del lockfile, garantizando builds reproducibles en equipo y CI; sin él, versiones que parecen iguales pueden producir imágenes distintas.",
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
    explanationText: "🌍 Ejemplo cotidiano: WORKDIR es el 'cd' del Dockerfile: a partir de esa línea, todos los comandos se ejecutan en esa carpeta, como entrar a la oficina una vez y no repetir la dirección cada vez.\n\nWORKDIR /app cambia el directorio base para todas las instrucciones posteriores (RUN, COPY, CMD, ENTRYPOINT). Sin él, tendrías que escribir rutas absolutas en cada instrucción y los archivos quedarían dispersos; con él, el Dockerfile queda limpio y el comportamiento es idempotente: los paths no dependen de dónde se ejecute el build.",
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
    explanationText: "VOLUME declara en el Dockerfile qué rutas del contenedor son datos persistentes. Si al correr no montas un volumen manual, Docker crea uno anónimo automáticamente en esa ruta. Es una 'señal de tráfico' para quien use la imagen: le dice qué directorios no deben vivir dentro del contenedor, porque desaparecerían al recrearlo.",
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
    explanationText: "COPY y ADD copian archivos del contexto de build a la imagen, pero ADD añade magia: descarga URLs y descomprime tarballs/zip automáticamente. Prefiere COPY para copias normales porque hace exactamente lo que ves (sin sorpresas ni capas más pesadas); reserva ADD para casos puntuales donde necesitas la descarga o extracción en un paso. Copiar package.json y el lockfile ANTES del código es clave para aprovechar la caché de capas: las dependencias solo se reinstalan cuando el lockfile cambia.",
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
    explanationText: "CMD define el comando por defecto al arrancar el contenedor; en formato exec (array JSON) se ejecuta directamente sin shell, evitando capas extra y problemas de escaping. Solo hay UN CMD efectivo por imagen (el último gana). En imágenes de producción, CMD es el arranque de la app: elegirlo mal (por ejemplo, un servidor dev) significa que la imagen 'construye bien' pero falla al desplegarse.",
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
    explanationText: "--no-cache fuerza a reconstruir cada capa desde cero, ignorando la caché local. Es útil cuando la caché esconde problemas: por ejemplo, dependencias que cambiaron en un registro externo y no se reflejan en el Dockerfile, o imágenes base recién actualizadas. En CI, un build con caché es rápido pero puede 'envenenar' artefactos; el no-cache puntual verifica que el build sea realmente reproducible.",
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
    explanationText: "La sección build del docker-compose.yml le dice a Compose 'no uses una imagen precompilada, construye esta': context fija el directorio raíz que se envía al daemon (dónde buscar archivos) y dockerfile indica qué Dockerfile leer. Es la alternativa a image: cuando tu servicio no existe en un registro, lo compilas localmente en el up.",
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
    explanationText: "working_dir y command sobrescriben el comportamiento por defecto de la imagen en Compose: working_dir cambia el directorio de trabajo (equivalente a WORKDIR en build) y command sustituye el CMD de la imagen. Es la forma de ajustar cómo arranca un servicio sin reconstruir la imagen: útil en desarrollo (yarn install && dev) mientras la imagen de producción mantiene su arranque optimizado.",
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
    explanationText: "container_name fija un nombre exacto para el contenedor, anulando el patrón automático <proyecto>_<servicio>_<replica>. Útil para scripts y documentación que referencian el contenedor por nombre; la contrapartida es que el nombre debe ser único en todo el host, por lo que no puedes escalar réplicas del mismo servicio con nombre fijo.",
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
    explanationText: "restart: always define la política de reinicio: el contenedor se levanta automáticamente al arrancar el daemon y se relanza si se cae, aunque haya sido por un crash. Es la diferencia entre 'mi base de datos murió y nadie se enteró' y 'el servidor se reinició y la app volvió sola'. En producción, los servicios de infraestructura (bases de datos, colas) casi siempre usan restart: always o unless-stopped.",
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
    explanationText: "ports en Compose se escribe como lista YAML en el mismo formato HOST:CONTAINER que la CLI: - 8080:3000 publica el puerto 8080 del host hacia el 3000 del contenedor. Al ser una lista, puedes publicar varios puertos o solo el del contenedor (3000) para que Docker elija uno libre en el host.",
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
    explanationText: "docker compose up lee el docker-compose.yml, construye/descarga las imágenes de los servicios, crea la red y arranca todo. -d (detached) lo hace en segundo plano devolviéndote la terminal, ideal para servicios persistentes. Sin -d te quedarías 'pegado' a los logs de todos los servicios a la vez.",
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
    explanationText: "docker compose logs consolida la salida stdout/stderr de TODOS los servicios del stack, etiquetada por servicio. -f (follow) mantiene la sesión abierta e imprime en vivo. Es el comando de diagnóstico por defecto de un stack Compose: te dice qué servicio falló y qué dijo al arrancar, sin necesidad de entrar a cada contenedor.",
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
    explanationText: "docker compose down apaga los servicios y elimina los contenedores Y la red privada que Compose creó (sin -v conserva los volúmenes, por eso tus datos sobreviven). Es la 'parada limpia' del stack: a diferencia de detener contenedores uno a uno, deja el host sin rastro de la red y los nombres, para poder volver a levantar sin conflictos.",
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
    explanationText: "Compose nombra automáticamente los contenedores con la estructura <proyecto>_<servicio>_<replica>: el proyecto es el nombre de la carpeta donde está el YAML, el servicio viene del archivo y la réplica es un correlativo. Saber esto permite predecir el nombre exacto de un contenedor (por ejemplo, para conectarse a él por nombre en la red interna) sin inspeccionarlo.",
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
    explanationText: "docker scan analiza la imagen contra la base de datos de vulnerabilidades de Snyk y reporta CVEs con severidad y pasos de remediación. Escanear antes de subir al registro es la 'revisión médica' de la imagen: una imagen que funciona puede llevar dependencias con fallos de seguridad conocidos. Hacerlo parte del pipeline de CI evita desplegar vulnerabilidades conocidas a producción.",
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
    explanationText: "🌍 Ejemplo cotidiano: docker image history es el 'recibo de compra' de la imagen: muestra cada capa, qué instrucción del Dockerfile la creó y cuánto pesa, como una factura desglosada en vez de un total.\n\nCada instrucción del Dockerfile genera una capa inmutable; history muestra esa secuencia con su tamaño. Es la herramienta para optimizar imágenes: si una capa gigante no debería estar ahí (por ejemplo, node_modules de desarrollo), el historial te dice exactamente dónde está el peso y qué instrucción lo añade.",
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
    explanationText: "🌍 Ejemplo cotidiano: el multi-stage es 'montar el mueble en el taller y llevarte solo la pieza terminada a casa': la primera etapa (node) instala todo y compila, y la segunda (nginx) copia únicamente el resultado, descartando herramientas y dependencias de build.\n\nEn el multi-stage, FROM node:18 AS build prepara la app (instala, compila) y FROM nginx:alpine + COPY --from=build /app/build /usr/share/nginx/html genera la imagen final SOLO con el HTML/CSS/JS servible. El resultado: imágenes mucho más pequeñas y con menos superficie de ataque, porque el runtime final no contiene el toolchain ni los node_modules de desarrollo.",
    codeSnippet: "// Ordena el Dockerfile multi-stage: build con node → servir con nginx",
    inputs: {},
    completeCode: "FROM node:18 AS build ... RUN yarn install ... FROM nginx:alpine COPY --from=build /app/build /usr/share/nginx/html",
    format: "ordering",
    ordering: {
      prompt: "Reconstruye el Dockerfile multi-stage: primero la etapa de build con Node, luego la imagen final con Nginx.",
      steps: [
        { id: "build", label: "RUN yarn run build" },
        { id: "nginx", label: "FROM nginx:alpine" },
        { id: "from-build", label: "FROM node:18 AS build" },
        { id: "install", label: "COPY package* yarn.lock ./" },
        { id: "workdir", label: "WORKDIR /app" },
        { id: "copy", label: "COPY --from=build /app/build /usr/share/nginx/html" },
        { id: "yarn", label: "RUN yarn install" },
      ],
      correctOrder: ["from-build", "workdir", "install", "yarn", "build", "nginx", "copy"],
    }
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
    explanationText: "Con ${VAR} en el YAML, Compose lee el valor desde el archivo .env del directorio (o del entorno), evitando escribir contraseñas y secretos en el docker-compose.yml que se sube a git. Es el mismo principio que process.env: el secreto vive fuera del repositorio, en el archivo local o en el secret manager del entorno de despliegue.",
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
    explanationText: "./:/app es un bind mount en formato Compose: monta la carpeta actual del host dentro del contenedor en /app usando una ruta relativa (Compose la resuelve contra la ubicación del YAML). En la CLI de Docker, en cambio, necesitas rutas absolutas como $(pwd). Es la config de desarrollo de un proyecto Compose: los cambios locales se reflejan al instante y no hace falta reconstruir.",
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
    explanationText: "buildx es el motor de build moderno de Docker. create prepara un 'builder' (un nodo capaz de construir) y --use lo activa como el que usará la CLI. Sin un builder buildx activo, los comandos multi-plataforma no están disponibles. Es el requisito previo para compilar imágenes que sirvan tanto en Intel (amd64) como en ARM (Apple Silicon, Raspberry Pi).",
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
    explanationText: "--platform linux/amd64,linux/arm64 le pide a buildx compilar la imagen para ambas arquitecturas en una sola pasada, y --push la sube directo al registro. El resultado es una imagen multi-arch: cada usuario la descarga para su procesador automáticamente. Es la práctica estándar para imágenes públicas, porque una imagen solo-amd64 deja fuera a todo un ecosistema ARM.",
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
    explanationText: "Correr las pruebas DENTRO del contenedor (docker run --rm test-image npm run test) garantiza que se ejecuten en el mismo entorno que producción: misma imagen, mismas dependencias, mismo Node. --rm elimina el contenedor al terminar para no dejar basura en el runner de CI. Si las pruebas pasan solo en tu máquina y no en el contenedor, algo en el entorno de desarrollo está 'maquillando' el resultado.",
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
    explanationText: "docker/login-action@v3 es la acción oficial para autenticarse en un registro desde GitHub Actions, leyendo usuario y Token desde los Secrets del repositorio (${{ secrets.X }}). Los secrets de GitHub se inyectan como variables de entorno de la acción y jamás aparecen en los logs; usar un Token de Acceso revocable en vez de la contraseña limita el daño si se filtra.",
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
    explanationText: "El registro privado de Digital Ocean (DOCR) no usa el login de Docker directamente: necesita doctl (la CLI de Digital Ocean) instalado en el runner, y luego 'doctl registry login' con credenciales temporales. --expiry-seconds 1200 limita la validez del token a 20 minutos, reduciendo la ventana de exposición si las credenciales quedaran en el runner.",
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
    explanationText: "docker/build-push-action@v5 compila y sube la imagen en un solo paso. Etiquetar además con ${{ github.sha }} (el hash corto del commit) crea un vínculo directo entre imagen y código: puedes saber exactamente qué commit generó esa imagen en producción. En un incidente, ese tag es lo que permite el rollback a la versión anterior que sí funcionaba.",
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
    explanationText: "type=gha activa la caché de capas de GitHub Actions: las capas sin cambios (como la descarga e instalación de dependencias) se reutilizan entre builds, y mode=max almacena también las capas intermedias para maximizar el acierto de caché. Sin esta configuración, cada push a CI recompila desde cero y la instalación de node_modules tarda lo mismo en cada run.",
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
    explanationText: "App.yaml es el descriptor declarativo de Digital Ocean App Platform: dice qué imagen usar (registry_type, registry, repository, tag), cómo arrancar (run_command) y qué variables de entorno conectar. La referencia ${db.DATABASE_URL} interpola la URL generada por la base de datos declarada debajo (engine: pg): la plataforma conecta ambos recursos automáticamente, sin configurar hosts ni puertos a mano.",
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
    explanationText: "--memory y --cpus ponen un tope de recursos al contenedor: sin ellos, un contenedor con una fuga puede agotar toda la RAM del host y tumbar servicios vecinos. Los límites son la red de seguridad del servidor físico: el contenedor usa hasta donde tú decidas, no hasta donde el bug quiera. En producción, bases de datos y workers deberían declarar siempre sus límites.",
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
    explanationText: "trivy es un escáner de vulnerabilidades de código abierto que compara las librerías y binarios de la imagen contra bases de datos de CVEs. --severity HIGH,CRITICAL filtra solo los hallazgos graves, para enfocarse en lo que de verdad hay que arreglar antes de desplegar. A diferencia de un análisis del código fuente, escanea el contenido REAL de la imagen: lo que llevas a producción, no lo que crees que llevas.",
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
    explanationText: "🌍 Ejemplo cotidiano: --read-only es 'mostrar la tarjeta de la biblioteca pero no prestar el libro': el proceso lee el sistema de archivos raíz pero no puede escribir en él, como bloquear que un atacante modifique archivos del sistema aunque consiga ejecutar código.\n\nMontar el root fs como solo lectura impide que el contenedor modifique sus propios binarios o configuraciones (los más fácilmente explotables). Como algunas apps escriben temporalmente (Nginx en /var/cache), montas volúmenes específicos SOLO donde hace falta escritura. Es el principio de 'menor privilegio' aplicado al filesystem: si no necesitas escribir, no escribas.",
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
    explanationText: "En Kubernetes, el control plane es el 'cerebro' que gestiona el estado global del clúster (API server, scheduler, etcd); los nodos son los 'músculos' que ejecutan los contenedores; y el kubelet es el 'delegado' que vive en cada nodo, recibe las órdenes del plano de control y gestiona los contenedores locales. Esta separación es la razón de que K8s sobreviva a la caída de un nodo: el cerebro decide, los músculos obedecen.",
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
    explanationText: "kubectl es el control remoto del clúster: get lista recursos, describe muestra el detalle y estado de uno en concreto (eventos, condiciones), y logs -f sigue la salida de un pod en vivo. El trío get→describe→logs es el orden estándar de diagnóstico: primero ves qué existe, luego por qué está así, y por último qué dice la app.",
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
    explanationText: "Un Pod es la unidad mínima de cómputo en Kubernetes: agrupa uno o más contenedores que comparten IP, almacenamiento y ciclo de vida. En el YAML, kind declara el tipo de recurso (Pod), spec.containers lista los contenedores y ports expone sus puertos internos. Toda la configuración de K8s es declarativa: escribes el estado deseado y el clúster lo hace realidad.",
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
    explanationText: "🌍 Ejemplo cotidiano: un Service es el 'número de centralita' fijo delante de unos empleados que cambian de despacho: los pods se crean y destruyen (y cambian de IP), pero el Service mantiene una dirección estable y reparte las llamadas (LoadBalancer) entre ellos.\n\ntype: LoadBalancer crea un balanceador público en la nube; targetPort: 8080 apunta al puerto real de la app dentro del pod; y kubectl apply -f aplica el YAML de forma declarativa. Sin Service, cada pod tendría una IP efímera e inaccesible desde fuera del clúster.",
    codeSnippet: "apiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  type: [INPUT_1]\n  selector:\n    app: api\n  ports:\n    - protocol: TCP\n      port: 80\n      [INPUT_2]: 8080\n\n# Aplicar el Service:\n# kubectl [INPUT_3] -f service.yaml",
    inputs: { INPUT_1: "LoadBalancer", INPUT_2: "targetPort", INPUT_3: "apply" },
    completeCode: "type: LoadBalancer | targetPort: 8080 | kubectl apply -f service.yaml"
  }
];
