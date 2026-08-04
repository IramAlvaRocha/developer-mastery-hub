import type { Exercise } from "@/lib/types";

/** ELB + ASG: de la escalabilidad al autoescalado de instancias (Fase 1, AWS). */
export const AWS_ELB_ASG_EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "Escalabilidad y Alta Disponibilidad",
    stars: 1,
    category: "ESCALABILIDAD",
    description:
      "Escalar no es lo mismo que ser tolerante a fallos: distingue vertical, horizontal (= elasticidad) y alta disponibilidad.",
    objective: "Distinguir escalado vertical, horizontal y alta disponibilidad",
    tags: ["vertical", "horizontal", "elasticidad", "multi-AZ"],
    fileName: "ec2",
    completed: false,
    theory: `📚 TEORÍA: Escalabilidad y Alta Disponibilidad

Escalar significa que un sistema puede manejar mayores cargas adaptándose.

Dos tipos de escalabilidad:
  • Vertical  → aumentar el TAMAÑO de la instancia (t2.micro → t2.large).
    Tiene un límite: el hardware (no puedes crecer infinito).
    Común en sistemas no distribuidos, como una base de datos.
  • Horizontal (= elasticidad) → aumentar el NÚMERO de instancias.
    Implica sistemas distribuidos; típico de aplicaciones web modernas.

Vocabulario del examen:
  • Escalar hacia arriba / hacia abajo → vertical.
  • Escalar hacia fuera / hacia dentro → horizontal.

La alta disponibilidad es distinta: ejecutar la aplicación en al menos
DOS zonas de disponibilidad (AZ) para sobrevivir a la pérdida de un
centro de datos (el objetivo es aguantar un desastre).`,
    explanationText:
      "🌍 Ejemplo cotidiano: escalar vertical es convertir a un operador junior en senior (mejoras sus capacidades); escalar horizontal es contratar a 7 operadores más para repartir la carga. La alta disponibilidad es tener la oficina en dos edificios: si uno se quema, el otro sigue en pie.\n\nEl instructor insiste en que son conceptos vinculados pero distintos: el examen premia saber que 'escalar hacia arriba' = cambiar de tipo de instancia, 'escalar hacia fuera' = añadir instancias y 'alta disponibilidad' = ejecutar en ≥ 2 AZ.",
    codeSnippet: "# Afirmaciones sobre escalabilidad y alta disponibilidad",
    inputs: {},
    completeCode:
      "Vertical: tamaño de instancia | Horizontal: nº de instancias (= elasticidad) | HA: ≥ 2 AZ",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de los términos de la lección 60 del curso.",
      statements: [
        {
          id: "a",
          text: "Escalar verticalmente significa aumentar el número de instancias de tu aplicación.",
          answer: false,
          explanation:
            "No: vertical = aumentar el TAMAÑO de una instancia. Aumentar el número de instancias es escalado horizontal.",
        },
        {
          id: "b",
          text: "El escalado horizontal también se conoce como elasticidad.",
          answer: true,
          explanation:
            "Correcto: añadir/quitar instancias según la carga es elasticidad, y el ASG es la herramienta que la gestiona.",
        },
        {
          id: "c",
          text: "La alta disponibilidad consiste en ejecutar tu aplicación en al menos dos zonas de disponibilidad (AZ).",
          answer: true,
          explanation:
            "Así sobrevives a la pérdida de un centro de datos: si una AZ cae, la otra sigue sirviendo tu aplicación.",
        },
        {
          id: "d",
          text: "El escalado vertical tiene un límite: el límite de hardware de la instancia.",
          answer: true,
          explanation:
            "No puedes escalar verticalmente de forma infinita; el hardware de la instancia marca el techo. Por eso se usa el horizontal.",
        },
        {
          id: "e",
          text: "El escalado vertical es el más habitual para aplicaciones web distribuidas.",
          answer: false,
          explanation:
            "Es al revés: el horizontal (más instancias) es típico en apps web. El vertical es común en sistemas no distribuidos como una base de datos.",
        },
      ],
    },
  },

  {
    id: 2,
    title: "Decide: ¿Vertical u Horizontal?",
    stars: 2,
    category: "ESCALABILIDAD",
    description:
      "Ante un pico de carga, el equipo puede mejorar la máquina o añadir más máquinas. Elegir bien es la decisión.",
    objective: "Identificar el tipo de escalado de un escenario",
    tags: ["t2.micro", "t2.large", "escalado"],
    fileName: "ec2-user-data.sh",
    completed: false,
    theory: `📚 TEORÍA: Aplicar la Estrategia Correcta

Tu API corre en una t2.micro. Llega el Black Friday y la carga sube.
Dos caminos:

  Vertical: cambiar a t2.large (más CPU y RAM).
    • Rápido de ejecutar, pero con techo de hardware y subida de precio.
    • Ideal para BBDD o sistemas que no se distribuyen bien.

  Horizontal: lanzar 5 instancias más detrás de un balanceador.
    • Sin límite práctico, gracias a lanzar/quitar instancias al instante.
    • Requiere sistemas distribuidos y un ELB repartiendo el tráfico.

En AWS, el ASG (lo verás en esta sección) automatiza el horizontal.`,
    explanationText:
      "🌍 Ejemplo cotidiano: escalar vertical es darle a un único cajero una caja registradora más rápida; horizontal es abrir 5 cajas nuevas en paralelo. Con mucha cola, la segunda opción crece mejor.\n\nMejorar el tipo de instancia (t2.micro → t2.large) es escalado vertical 'hacia arriba'. Añadir instancias sería horizontal o elasticidad; no confundir tampoco con alta disponibilidad (multi-AZ).",
    codeSnippet:
      "# Escenario: tu API corre en una t2.micro. Ante el pico de Navidad, el equipo cambia la instancia a t2.large (más CPU y RAM) en lugar de añadir más instancias.",
    inputs: {},
    completeCode: "t2.micro → t2.large = escalado vertical (hacia arriba)",
    format: "prediction",
    prediction: {
      prompt:
        "El equipo mejora las características de la instancia en vez de aumentar su número. ¿Qué tipo de escalado aplica?",
      snippet:
        "# Escenario: tu API corre en una t2.micro. Ante el pico de Navidad, el equipo cambia la instancia a t2.large (más CPU y RAM) en lugar de añadir más instancias.",
      options: [
        "Escalado vertical (hacia arriba)",
        "Escalado horizontal (hacia fuera)",
        "Alta disponibilidad",
        "Elasticidad",
      ],
      answer: "Escalado vertical (hacia arriba)",
    },
  },

  {
    id: 3,
    title: "ALB, NLB y GWLB: El Balance Adecuado",
    stars: 2,
    category: "ELB",
    description:
      "Cada balanceador de carga de AWS vive en una capa distinta y resuelve un problema distinto. Empareja bien.",
    objective: "Emparejar cada balanceador con su caso de uso",
    tags: ["ALB", "NLB", "GWLB", "capas"],
    fileName: "elb",
    completed: false,
    theory: `📚 TEORÍA: Tres Balanceadores de Nueva Generación

El Elastic Load Balancing ofrece balances totalmente gestionados:
  • ALB (2016) → capa 7 (HTTP/HTTPS/WebSocket). Enruta por ruta, host o
    cabecera a múltiples target groups. Ideal para microservicios.
  • NLB (2017) → capa 4 (TCP/UDP/TLS). Alto rendimiento, millones de
    peticiones/seg e IP estática por AZ. Para tráfico UDP y TCP puro.
  • GWLB (2020) → capa 3 (red). Gestiona una flota de appliances de red
    (firewalls, IDS/IPS) para inspeccionar el tráfico que pasa.

AWS recomienda los de nueva generación; el Classic (2009) está obsoleto.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ALB es un conserje inteligente que lee la dirección exacta (ruta y host) y te lleva al piso correcto; el NLB es un ascensor exprés que solo mira el número de portal (TCP/UDP); el GWLB es el arco de seguridad donde todos pasan el control antes de entrar.\n\nSi el examen menciona HTTP/HTTPS piensa en ALB; si menciona UDP o rendimiento extremo, en NLB; si habla de inspeccionar/filtrar tráfico con firewalls, en GWLB.",
    codeSnippet: "# Empareja cada balanceador con su definición",
    inputs: {},
    completeCode:
      "ALB = capa 7 HTTP | NLB = capa 4 TCP/UDP | GWLB = capa 3 appliances",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada balanceador de AWS con su definición correcta.",
      definitions: [
        "Capa 4 (TCP/UDP/TLS): alto rendimiento, millones de peticiones/seg e IP estática por AZ.",
        "Balanceador totalmente gestionado que reparte la carga entre instancias y expone un único punto de acceso.",
        "Capa 3 (red): gestiona una flota de dispositivos virtuales (firewall, IDS/IPS) para inspeccionar el tráfico.",
        "Capa 7 (HTTP/HTTPS/WebSocket): enruta a varios target groups por ruta, host o cabecera.",
      ],
      pairs: [
        {
          id: "alb",
          term: "Application Load Balancer",
          definition:
            "Capa 7 (HTTP/HTTPS/WebSocket): enruta a varios target groups por ruta, host o cabecera.",
        },
        {
          id: "nlb",
          term: "Network Load Balancer",
          definition:
            "Capa 4 (TCP/UDP/TLS): alto rendimiento, millones de peticiones/seg e IP estática por AZ.",
        },
        {
          id: "gwlb",
          term: "Gateway Load Balancer",
          definition:
            "Capa 3 (red): gestiona una flota de dispositivos virtuales (firewall, IDS/IPS) para inspeccionar el tráfico.",
        },
        {
          id: "elb",
          term: "Elastic Load Balancing (ELB)",
          definition:
            "Balanceador totalmente gestionado que reparte la carga entre instancias y expone un único punto de acceso.",
        },
      ],
    },
  },

  {
    id: 4,
    title: "ELB: Visión General y Health Checks",
    stars: 2,
    category: "ELB",
    description:
      "El balanceador reparte la carga, detecta instancias caídas y es tu único punto de entrada. Cómo lo vigila todo.",
    objective: "Entender el rol del ELB y sus comprobaciones de salud",
    tags: ["health check", "DNS", "gestionado"],
    fileName: "elb",
    completed: false,
    theory: `📚 TEORÍA: Qué Hace un Balanceador por Ti

  • Reparte la carga entre instancias EC2 sin saturar ninguna.
  • Expone un único punto de acceso: un DNS para toda tu aplicación.
  • Gestiona los fallos: detecta instancias caídas y deja de enviarles.
  • Health check: petición a un PUERTO y una RUTA (/health, puerto 4567).
    Si la respuesta no es un 200, la instancia se considera no sana.
  • Separa el tráfico público del privado mediante grupos de seguridad:
    el usuario → balance (HTTP/HTTPS), y el balance → instancias por IP
    privada; las instancias solo aceptan tráfico del balanceador.

Es un servicio totalmente gestionado: AWS hace actualizaciones,
mantenimiento y alta disponibilidad del propio balanceador.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ELB es el recepcionista que reparte clientes entre mesas y, de vez en cuando, llama a cada camarero para confirmar que sigue atendiendo (health check en puerto + ruta).\n\nEl health check es la clave: se ejecuta sobre un puerto y una ruta concretos, y solo una respuesta 200 marca la instancia como sana. Las instancias además se blindan para recibir tráfico únicamente del balanceador, no del usuario directo.",
    codeSnippet: "# Afirmaciones sobre el Elastic Load Balancer",
    inputs: {},
    completeCode:
      "Un único DNS | health check puerto+ruta (200 = sano) | solo tráfico del balance",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida lo que aprende el instructor sobre el ELB y los health checks.",
      statements: [
        {
          id: "a",
          text: "AWS se encarga de las actualizaciones, el mantenimiento y la alta disponibilidad del balanceador.",
          answer: true,
          explanation:
            "El ELB es un servicio totalmente gestionado: la complejidad de operarlo recae en AWS.",
        },
        {
          id: "b",
          text: "La comprobación de salud se hace sobre un puerto y una ruta; si la respuesta no es un 200, la instancia se considera no sana.",
          answer: true,
          explanation:
            "Es el mecanismo clásico: petición a /health en un puerto concreto y solo el 200 confirma salud.",
        },
        {
          id: "c",
          text: "El ELB solo trabaja en la capa 7, es decir, exclusivamente con HTTP/HTTPS.",
          answer: false,
          explanation:
            "Hay balances en distintas capas: el ALB es capa 7, el NLB capa 4 (TCP/UDP) y el GWLB capa 3.",
        },
        {
          id: "d",
          text: "Con los grupos de seguridad bien configurados, las instancias solo reciben tráfico procedente del balanceador.",
          answer: true,
          explanation:
            "El SG de la instancia permite HTTP desde el SG del balanceador: los usuarios no pueden saltárselo y llegar directos.",
        },
      ],
    },
  },

  {
    id: 5,
    title: "ALB: Enrutamiento por Ruta",
    stars: 3,
    category: "ALB",
    description:
      "El ALB mira la URL, no solo la IP: /users a un grupo, /search a otro. Así se sirven microservicios.",
    objective: "Predecir qué target group recibe una petición por su ruta",
    tags: ["ALB", "target group", "routing", "path"],
    fileName: "alb-target-groups",
    completed: false,
    theory: `📚 TEORÍA: Routing por Ruta, Host y Cabecera

El Application Load Balancer (capa 7, HTTP/HTTPS/WebSocket) permite
enrutar el tráfico de forma inteligente hacia TARGET GROUPS distintos:

  • Por RUTA (path):  example.com/users  → target group "usuarios"
                      example.com/search → target group "búsqueda"
  • Por HOST:         api.example.com vs www.example.com
  • Por cabeceras:    según X-..., version, etc.

Un target group es un grupo de destino: instancias EC2, IPs privadas,
funciones Lambda o incluso servidores on-premise. Los health checks se
hacen a nivel de target group. Es la pieza clave para microservicios y
contenedores (Docker/ECS) con puertos dinámicos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ALB es el conserje que lee la dirección del paquete (la URL) y decide qué departamento lo recibe: si pone 'usuarios' va a usuarios, si pone 'búsqueda' va a búsqueda.\n\nPor eso el ALB es ideal para microservicios: una sola URL pública y varias aplicaciones detrás, cada una con su target group. Los health checks se evalúan por grupo, no por instancia suelta.",
    codeSnippet:
      "# Tu ALB tiene dos target groups: 'usuarios' (instancias EC2) y 'búsqueda' (instancias EC2).\n# Llega una petición a https://example.com/search",
    inputs: {},
    completeCode:
      "GET /search → target group 'búsqueda' | GET /users → target group 'usuarios'",
    format: "prediction",
    prediction: {
      prompt:
        "El ALB enruta por la ruta de la URL. ¿A qué target group envía esta petición?",
      snippet:
        "# Tu ALB tiene dos target groups: 'usuarios' (instancias EC2) y 'búsqueda' (instancias EC2).\n# Llega una petición a https://example.com/search",
      options: [
        "Al target group 'búsqueda'",
        "Al target group 'usuarios'",
        "A ambos target groups por igual",
        "A ninguno: el ALB no enruta por ruta",
      ],
      answer: "Al target group 'búsqueda'",
    },
  },

  {
    id: 6,
    title: "ALB vs NLB: Capas y Características",
    stars: 3,
    category: "ALB",
    description:
      "HTTP/HTTPS o TCP/UDP, nombre de host fijo o IP estática: el examen te pide saber qué pertenece a cada uno.",
    objective: "Emparejar características con su balanceador",
    tags: ["ALB", "NLB", "capa 4", "capa 7"],
    fileName: "nlb",
    completed: false,
    theory: `📚 TEORÍA: ALB vs NLB, Cuestión de Capa

  • ALB (capa 7): solo HTTP/HTTPS y WebSocket. Expone un NOMBRE DE HOST
    FIJO (xxxx.elb.region.amazonaws.com) y enruta por contenido. La IP
    puede cambiar, por eso se usa un DNS.
  • NLB (capa 4): TCP, UDP y TLS. Alto rendimiento (millones de
    peticiones/seg) y menor latencia (~100 ms vs ~400 ms del ALB).
    Tiene IP ESTÁTICA por zona de disponibilidad y soporta IP elástica:
    una IP fija que puedes poner en listas blancas.

Si en el examen ves UDP → NLB. Si ves enrutamiento por ruta/host → ALB.
El NLB además no está incluido en la capa gratuita de AWS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ALB es como un director de tráfico que lee los rótulos de cada camión (capa 7); el NLB es el peaje de autopista que solo cuenta vehículos y pasa de rótulos (capa 4): por eso es más rápido.\n\nLa IP elástica en el NLB es oro para integraciones: fijas esa IP en el firewall de tu cliente (allowlist) y sabes que nunca cambiará.",
    codeSnippet: "# Empareja cada elemento con su definición",
    inputs: {},
    completeCode:
      "ALB: HTTP/WebSocket + nombre de host fijo | NLB: TCP/UDP + IP estática/EIP",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada elemento con el balanceador o concepto que le corresponde.",
      definitions: [
        "IP fija por AZ asociada al NLB, útil para listas blancas (allowlist).",
        "Capa 4 (TCP/UDP/TLS): alto rendimiento, millones de peticiones/seg y baja latencia.",
        "Cabecera que preserva la IP real del cliente tras la terminación de la conexión en el balance.",
        "Capa 7 (HTTP/HTTPS/WebSocket): enruta por ruta, host o cabecera y expone un nombre de host fijo.",
      ],
      pairs: [
        {
          id: "alb",
          term: "Application Load Balancer",
          definition:
            "Capa 7 (HTTP/HTTPS/WebSocket): enruta por ruta, host o cabecera y expone un nombre de host fijo.",
        },
        {
          id: "nlb",
          term: "Network Load Balancer",
          definition:
            "Capa 4 (TCP/UDP/TLS): alto rendimiento, millones de peticiones/seg y baja latencia.",
        },
        {
          id: "eip",
          term: "IP elástica (EIP)",
          definition:
            "IP fija por AZ asociada al NLB, útil para listas blancas (allowlist).",
        },
        {
          id: "xff",
          term: "X-Forwarded-For",
          definition:
            "Cabecera que preserva la IP real del cliente tras la terminación de la conexión en el balance.",
        },
      ],
    },
  },

  {
    id: 7,
    title: "X-Forwarded-For: La IP Real del Cliente",
    stars: 3,
    category: "ALB",
    description:
      "El balanceador corta la conexión con el cliente; las instancias ya no ven su IP. La cabecera X-Forwarded-For lo resuelve.",
    objective: "Saber cómo recuperar la IP del cliente tras el balance",
    tags: ["X-Forwarded-For", "ALB", "terminación"],
    fileName: "x-forwarded-for",
    completed: false,
    theory: `📚 TEORÍA: Terminación de Conexión y Cabeceras

El balanceador TERMINA la conexión: el cliente habla con el balance y
el balance se conecta a la instancia por su IP PRIVADA. La instancia no
ve directamente la IP del cliente.

Para recuperarla, el balance inserta cabeceras:
  • X-Forwarded-For   → IP real del cliente (12.34.56.78)
  • X-Forwarded-Port  → puerto original
  • X-Forwarded-Proto → protocolo original (http/https)

Sin estas cabeceras, logs y seguridad verían solo la IP del balance.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el cliente habla con la recepción del hotel (el balance) y la recepción llama a la habitación por el teléfono interno. La IP del cliente es como el nombre que la recepción anota y te pasa por escrito (la cabecera X-Forwarded-For).\n\nEn el examen: si una instancia necesita conocer o loguear la IP del cliente real detrás de un ELB, la respuesta es X-Forwarded-For.",
    codeSnippet:
      "# Un usuario con IP 12.34.56.78 se conecta por HTTPS al ALB.\n# El ALB termina la conexión y se conecta a la instancia EC2 por su IP privada.\n# La instancia quiere saber la IP real del cliente.",
    inputs: {},
    completeCode:
      "Instancia lee la cabecera 'X-Forwarded-For' para ver la IP 12.34.56.78",
    format: "prediction",
    prediction: {
      prompt:
        "¿Cómo obtiene la instancia EC2 la IP real del cliente después de la terminación de la conexión?",
      snippet:
        "# Un usuario con IP 12.34.56.78 se conecta por HTTPS al ALB.\n# El ALB termina la conexión y se conecta a la instancia EC2 por su IP privada.\n# La instancia quiere saber la IP real del cliente.",
      options: [
        "Leyendo la cabecera X-Forwarded-For",
        "Consultando la IP pública de su propio balanceador",
        "No puede conocerla en ningún caso",
        "Leyendo la cabecera X-Forwarded-Proto",
      ],
      answer: "Leyendo la cabecera X-Forwarded-For",
    },
  },

  {
    id: 8,
    title: "GWLB: Inspección de Tráfico con Appliances",
    stars: 3,
    category: "NLB + GWLB",
    description:
      "Quieres un firewall de terceros revisando todo el tráfico antes de llegar a tu ALB. Eso es el Gateway Load Balancer.",
    objective: "Identificar el GWLB para inspeccionar y filtrar tráfico",
    tags: ["GWLB", "firewall", "IDS/IPS", "capa 3"],
    fileName: "gwlb",
    completed: false,
    theory: `📚 TEORÍA: Gateway Load Balancer (Capa 3)

El GWLB implementa, escala y administra una flota de DISPOSITIVOS
VIRTUALES de red de terceros para inspeccionar el tráfico:

  • Firewalls, sistemas de detección/prevención de intrusiones
    (IDS/IPS) e inspección profunda de paquetes.

Cómo fluye: usuarios → GWLB → appliances (target group) → GWLB → tu ALB.
Combina un GATEWAY transparente (entrada/salida única de todo el
tráfico) con funciones de LOAD BALANCING hacia los appliances.

Opera en la capa 3 (red) y usa el protocolo GENEVE en el puerto 6081:
si el examen menciona Geneve/6081 → GWLB. Sus target groups aceptan
instancias EC2 o IPs privadas.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el GWLB es el arco de seguridad del aeropuerto: todo pasajero (paquete) pasa el control de los guardias (appliances) antes de entrar al avión (tu aplicación).\n\nSi el examen habla de inspeccionar, filtrar o aplicar seguridad con dispositivos de terceros (firewall, IDS/IPS) o menciona el protocolo Geneve (puerto 6081), la respuesta es el Gateway Load Balancer.",
    codeSnippet:
      "# Necesitas que un firewall virtual de un proveedor tercero revise todo el tráfico entrante\n# antes de que llegue a tu Application Load Balancer.",
    inputs: {},
    completeCode:
      "GWLB (capa 3) + target group de appliances | Geneve: puerto 6081",
    format: "prediction",
    prediction: {
      prompt:
        "¿Qué servicio AWS integra esa flota de appliances en la ruta de red para inspeccionar el tráfico?",
      snippet:
        "# Necesitas que un firewall virtual de un proveedor tercero revise todo el tráfico entrante\n# antes de que llegue a tu Application Load Balancer.",
      options: [
        "Gateway Load Balancer (GWLB)",
        "Network Load Balancer (NLB)",
        "Application Load Balancer (ALB)",
        "Classic Load Balancer",
      ],
      answer: "Gateway Load Balancer (GWLB)",
    },
  },

  {
    id: 9,
    title: "Sticky Sessions: El Cliente Siempre a la Misma Instancia",
    stars: 3,
    category: "ELB",
    description:
      "Si el usuario guarda el carrito en memoria de una instancia, debe volver a la misma. Para eso está la adherencia.",
    objective: "Entender las sesiones persistentes y su coste",
    tags: ["sticky sessions", "cookie", "adherencia"],
    fileName: "sticky-session",
    completed: false,
    theory: `📚 TEORÍA: Sticky Sessions (Sesiones Persistentes)

Activas la adherencia para que el MISMO cliente sea siempre redirigido
a la MISMA instancia detrás del balanceador. Motivo: que el usuario no
pierda sus datos de sesión guardados en esa instancia.

Cómo funciona:
  • El balance genera una cookie de persistencia con FECHA DE CADUCIDAD
    (la controlas tú; hasta 7 días).
  • Tipos: cookie generada por el balanceador, o cookie de la aplicación
    (personalizada; los nombres AWSALB/AWSALBAPP/AWSALBTG están
    reservados para AWS).

Coste: al fijar rutas, el balance ya no reparte la carga libremente →
puede provocar un DESEQUILIBRIO de carga en las instancias del backend.`,
    explanationText:
      "🌍 Ejemplo cotidiano: en una peluquería, el cliente prefiere siempre al mismo peluquero (instancia) porque ya sabe cómo le gusta el corte (sesión). Eso está genial para el cliente, pero deja al otro peluquero sin trabajo.\n\nLa adherencia resuelve perder la sesión, pero rompe el reparto óptimo de la carga: el instructor avisa de que puede desequilibrar las instancias del backend.",
    codeSnippet:
      "# Un usuario se autentica y el ELB lo envía a la instancia A. Al volver,\n# si el balance lo manda a la instancia B, pierde los datos de su sesión.",
    inputs: {},
    completeCode:
      "Cookie de adherencia (hasta 7 días) | Mismo cliente → misma instancia | Riesgo: desequilibrio",
    format: "prediction",
    prediction: {
      prompt:
        "¿Qué característica activas para que el mismo cliente siempre llegue a la misma instancia?",
      snippet:
        "# Un usuario se autentica y el ELB lo envía a la instancia A. Al volver,\n# si el balance lo manda a la instancia B, pierde los datos de su sesión.",
      options: [
        "Sticky sessions (sesiones persistentes) con cookie de adherencia",
        "Cross-zone load balancing",
        "Connection draining (drenaje de conexión)",
        "Health checks del target group",
      ],
      answer:
        "Sticky sessions (sesiones persistentes) con cookie de adherencia",
    },
  },

  {
    id: 10,
    title: "Cross-Zone: Repartir Entre Todas las AZ",
    stars: 2,
    category: "ELB",
    description:
      "¿El balance reparte solo en su zona o en todas? Depende del balanceador y de lo que pagues por los datos entre AZ.",
    objective: "Distinguir cross-zone activado vs desactivado",
    tags: ["cross-zone", "AZ", "coste"],
    fileName: "cross-zone",
    completed: false,
    theory: `📚 TEORÍA: Balanceo Entre Zonas (Cross-Zone)

Con cross-zone ACTIVADO, cada balance reparte el tráfico de forma
UNIFORME entre todas las instancias de TODAS las AZ: aunque un balance
reciba el 50%, todas las instancias acaban con la misma carga.

Por defecto:
  • ALB: SIEMPRE activado y NO se cobra por los datos entre AZ.
  • NLB y GWLB: DESACTIVADO. Si lo activas, pagas una tarifa por los
    datos entre zonas de disponibilidad.
  • CLB: estaba desactivado por defecto y sin coste inter-AZ.

Sin cross-zone, cada balance solo distribuye dentro de su propia AZ.`,
    explanationText:
      "🌍 Ejemplo cotidiano: cross-zone es que los cajeros de la planta 1 ayuden también a las colas de la planta 2 cuando hace falta, en vez de atender solo a los suyos.\n\nDato de examen: en el ALB el cross-zone viene activado por defecto y gratis; en el NLB y GWLB viene desactivado y activarlo cuesta (datos inter-AZ).",
    codeSnippet: "# Afirmaciones sobre el balanceo entre zonas (cross-zone)",
    inputs: {},
    completeCode:
      "ALB: cross-zone activado y gratis | NLB/GWLB: desactivado (coste al activarlo)",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu conocimiento del cross-zone load balancing según el instructor.",
      statements: [
        {
          id: "a",
          text: "Con el cross-zone activado, el tráfico se distribuye uniformemente entre todas las instancias de todas las zonas de disponibilidad.",
          answer: true,
          explanation:
            "Exacto: aunque un balance reciba el 50% del tráfico, se reparte en partes iguales entre todas las instancias registradas.",
        },
        {
          id: "b",
          text: "En el Application Load Balancer, el cross-zone viene activado por defecto y no se cobra por los datos entre AZ.",
          answer: true,
          explanation:
            "Correcto: en el ALB es la opción por defecto, siempre activada y sin coste por los datos inter-zona.",
        },
        {
          id: "c",
          text: "En el NLB y el GWLB, el cross-zone viene activado por defecto.",
          answer: false,
          explanation:
            "Al revés: en NLB y GWLB viene DESACTIVADO por defecto; si lo activas, pagas una tarifa por los datos entre zonas.",
        },
        {
          id: "d",
          text: "Sin cross-zone, cada balanceador solo reparte el tráfico entre las instancias de su propia zona de disponibilidad.",
          answer: true,
          explanation:
            "Sí: sin cross-zone el tráfico no sale de su AZ, lo que puede dejar instancias infrautilizadas en otras zonas.",
        },
      ],
    },
  },

  {
    id: 11,
    title: "SSL/TLS: Cifrado en Tránsito y SNI",
    stars: 3,
    category: "SSL/TLS",
    description:
      "El balance termina el HTTPS y usa certificados X.509. Con varios dominios, SNI elige el certificado correcto.",
    objective: "Entender certificados SSL/TLS, ACM y SNI en el ELB",
    tags: ["SSL", "TLS", "SNI", "ACM"],
    fileName: "ssl-tls",
    completed: false,
    theory: `📚 TEORÍA: Certificados SSL/TLS en el ELB

Un certificado SSL/TLS cifra el tráfico del cliente al balanceador
(HTTPS en tránsito). Hoy se usan certificados TLS (evolución de SSL),
aunque todo el mundo sigue diciendo SSL. Son certificados de servidor
X.509 emitidos por autoridades de certificación y con caducidad.

  • El listener HTTPS necesita un CERTIFICADO POR DEFECTO, más una lista
    opcional para otros dominios.
  • Gestión: con AWS Certificate Manager (ACM) o subiendo los tuyos.

SNI (Server Name Indication): en el handshake TLS, el cliente indica el
nombre del servidor de destino y el balance devuelve el certificado
correcto. Permite varios certificados en un ALB/NLB. Importante:
SNI solo funciona en ALB y NLB (no en el Classic Load Balancer).`,
    explanationText:
      "🌍 Ejemplo cotidiano: SNI es como el guardia que te pregunta '¿a qué piso vas?' antes de darte la llave correcta: si dices tienda.com te da el certificado de tienda.com, y si dices empresa.com, el suyo.\n\nSi el examen habla de varios certificados SSL en un solo balanceador y 'el cliente indica el host en el handshake', la respuesta es SNI; y recuerda: solo ALB/NLB, nunca Classic.",
    codeSnippet:
      "# Tienes dos dominios (miempresa.com y tienda.com) detrás del mismo ALB.\n# Cada dominio debe recibir su propio certificado SSL/TLS.",
    inputs: {},
    completeCode:
      "ACM para gestionar certificados | Listener HTTPS + certificado por defecto | SNI para multi-dominio (solo ALB/NLB)",
    format: "prediction",
    prediction: {
      prompt:
        "¿Qué mecanismo permite que el balanceador devuelva el certificado SSL correcto según el dominio que pide el cliente?",
      snippet:
        "# Tienes dos dominios (miempresa.com y tienda.com) detrás del mismo ALB.\n# Cada dominio debe recibir su propio certificado SSL/TLS.",
      options: [
        "SNI (Server Name Indication): el cliente indica el host en el handshake TLS",
        "Un solo certificado compartido para todos los dominios",
        "Un Classic Load Balancer por cada dominio",
        "El certificado por defecto vale para cualquier dominio",
      ],
      answer:
        "SNI (Server Name Indication): el cliente indica el host en el handshake TLS",
    },
  },

  {
    id: 12,
    title: "Drenaje de la Conexión: Despedirse con Tiempo",
    stars: 3,
    category: "ELB",
    description:
      "Cuando una instancia se va, no se corta de golpe: se completa lo en vuelo. Eso es el connection draining.",
    objective: "Entender el drenaje de conexión y sus valores",
    tags: ["connection draining", "deregistration delay", "300"],
    fileName: "drain",
    completed: false,
    theory: `📚 TEORÍA: Drenaje de Conexión (Deregistration Delay)

Cuando una instancia se está desregistrando o no está sana, el
balanceador deja de enviarle NUEVAS peticiones y le da TIEMPO para
completar las peticiones EN VUELO.

  • Nombre: 'connection draining' en el CLB; 'deregistration delay' en
    ALB y NLB. Mismo concepto.
  • Rango: entre 1 y 3600 segundos.
  • Por defecto: 300 segundos.
  • Valor 0 → desactivado.
  • Valor bajo → si tus peticiones son cortas.

Mientras una instancia drena, las nuevas conexiones van a las demás
instancias, y las que acaben el drenaje dejan de recibir tráfico.`,
    explanationText:
      "🌍 Ejemplo cotidiano: si un camarero se va del restaurante, no le quitas el plato de las manos a mitad de servir: dejas que termine (peticiones en vuelo) y dejas de asignarle mesas nuevas.\n\nDato de examen recurrente: el valor por defecto es 300 segundos y el rango va de 1 a 3600; fijar 0 lo desactiva por completo.",
    codeSnippet: "# Afirmaciones sobre el drenaje de la conexión",
    inputs: {},
    completeCode:
      "1–3600 s | default 300 s | 0 = desactivado | completa peticiones en vuelo",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión del connection draining / deregistration delay.",
      statements: [
        {
          id: "a",
          text: "El drenaje de conexión da tiempo a completar las peticiones en vuelo antes de que la instancia deje de recibir tráfico.",
          answer: true,
          explanation:
            "Es la definición del instructor: un tiempo para cerrar las peticiones que ya estaban en curso.",
        },
        {
          id: "b",
          text: "Durante el drenaje, el balanceador sigue enviando nuevas peticiones a la instancia que se está desregistrando.",
          answer: false,
          explanation:
            "Al contrario: deja de enviar nuevas peticiones; solo permite completar las que ya estaban en vuelo.",
        },
        {
          id: "c",
          text: "El rango permitido va de 1 a 3600 segundos y el valor por defecto es 300.",
          answer: true,
          explanation:
            "Exacto: por defecto 300 s, y puedes ajustarlo entre 1 y 3600 según la duración de tus peticiones.",
        },
        {
          id: "d",
          text: "Fijar el valor del drenaje en 0 desactiva por completo la característica.",
          answer: true,
          explanation:
            "Sí: 0 significa sin drenaje; se corta el tráfico de inmediato.",
        },
      ],
    },
  },

  {
    id: 13,
    title: "ASG: Mínimo, Deseado, Máximo y Launch Template",
    stars: 2,
    category: "ASG",
    description:
      "El ASG mantiene el número de instancias que quieres, desde una plantilla de lanzamiento. Y encima es gratuito.",
    objective: "Entender atributos y plantilla de lanzamiento del ASG",
    tags: ["ASG", "launch template", "min/max/desired"],
    fileName: "asg",
    completed: false,
    theory: `📚 TEORÍA: Auto Scaling Groups

La carga de una web cambia según el día (Netflix sube el fin de semana).
El ASG crea y elimina instancias EC2 de forma rápida para adaptarse:

  • CAPACIDAD MÍNIMA: instancias que siempre deben existir (p. ej. 2).
  • CAPACIDAD DESEADA: las que quieres en marcha normalmente (p. ej. 4).
  • CAPACIDAD MÁXIMA: el techo al escalar (p. ej. 10).

También: registra automáticamente nuevas instancias en un ELB, y si una
instancia no está sana, la termina y crea otra en su lugar.

La PLANTILLA DE LANZAMIENTO (antes 'configuración de lanzamiento',
obsoleta) define la AMI, el tipo de instancia, los datos de usuario
(user data), el volumen EBS, los grupos de seguridad, el par de claves
SSH y el rol IAM.

El ASG es GRATUITO: solo pagas por las instancias EC2 subyacentes.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ASG es el encargado de que en tu tienda siempre haya entre 2 y 10 cajeros: 2 como mínimo aunque no venga nadie, 4 de normal, y hasta 10 si hay cola. La plantilla de lanzamiento es el manual que define cómo es cada cajero (AMI, tipo, scripts, seguridad).\n\nDetalle que suele caer: el ASG no cuesta nada, solo facturas las instancias que controla.",
    codeSnippet: "# Afirmaciones sobre los Auto Scaling Groups",
    inputs: {},
    completeCode:
      "min/desired/max | launch template (AMI, tipo, user-data, SG) | ASG gratis, pagas las EC2",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu conocimiento de los atributos y la plantilla de lanzamiento del ASG.",
      statements: [
        {
          id: "a",
          text: "El ASG se asegura de mantener entre una capacidad mínima y una máxima, en torno a una capacidad deseada.",
          answer: true,
          explanation:
            "Correcto: mínima (siempre), deseada (normal) y máxima (techo al escalar).",
        },
        {
          id: "b",
          text: "La plantilla de lanzamiento define la AMI, el tipo de instancia, los datos de usuario, el volumen EBS y los grupos de seguridad.",
          answer: true,
          explanation:
            "Es el 'manual' de la instancia: todo lo necesario para lanzar copias idénticas.",
        },
        {
          id: "c",
          text: "Auto Scaling Groups es un servicio de pago: se factura el ASG además de las instancias EC2.",
          answer: false,
          explanation:
            "El ASG es totalmente gratuito; solo pagas por las instancias EC2 que él controla.",
        },
        {
          id: "d",
          text: "Si una instancia del ASG no está sana, el grupo la termina y lanza una nueva para reemplazarla.",
          answer: true,
          explanation:
            "El ASG vela por el número y salud de instancias: elimina y recrea para mantener la capacidad.",
        },
      ],
    },
  },

  {
    id: 14,
    title: "ASG + ELB: El Flujo del Escalado",
    stars: 3,
    category: "ASG",
    description:
      "Alarma de CloudWatch, política de escalado, nuevas instancias y el ELB repartiendo. El ciclo completo del autoescalado.",
    objective: "Ordenar el flujo de escalado con alarma de CloudWatch",
    tags: ["CloudWatch", "alarmas", "escalado", "ELB"],
    fileName: "asg-scaling",
    completed: false,
    theory: `📚 TEORÍA: Cómo Escala el ASG con CloudWatch

El ASG puede escalar de forma automática mediante ALARMAS de CloudWatch:

  1. La alarma monitoriza una métrica del grupo (p. ej. la CPU MEDIA de
     todas sus instancias, o una métrica personalizada).
  2. La alarma se dispara (p. ej. CPU > 70%).
  3. Se ejecuta una política de escalado: añadir (scale out) o quitar
     (scale in) instancias.
  4. El ASG lanza/termina instancias desde la plantilla de lanzamiento.
  5. El ELB registra las nuevas instancias y reparte el tráfico entre
     ellas.

El ELB y el ASG trabajan juntos: el ASG crea las instancias y el ELB
distribuye la carga y comprueba su salud.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el termostato (alarma de CloudWatch) mide la temperatura (CPU media); si sube, enciende el aire acondicionado (política de escalado); y el repartidor (ELB) pasa a repartir entre todas las habitaciones (instancias).\n\nLa métrica se calcula como promedio de TODAS las instancias del ASG: ese detalle aparece en el examen.",
    codeSnippet:
      "# Ordena el flujo cuando la carga sube y el ASG debe añadir instancias",
    inputs: {},
    completeCode:
      "Alarma CloudWatch → política de escalado → ASG lanza instancias → ELB las registra y reparte",
    format: "ordering",
    ordering: {
      prompt:
        "Reconstruye el ciclo de escalado del ASG cuando aumenta la carga de tu aplicación.",
      steps: [
        {
          id: "alarma-dispara",
          label:
            "La alarma de CloudWatch se dispara (p. ej. CPU media > 70%).",
        },
        {
          id: "elb-registra",
          label: "El ELB registra las nuevas instancias y reparte el tráfico.",
        },
        {
          id: "alarma-monitoriza",
          label:
            "Una alarma de CloudWatch monitoriza la CPU media de las instancias del ASG.",
        },
        {
          id: "politica",
          label:
            "Se ejecuta la política de escalado (añadir instancias).",
        },
        {
          id: "lanzar",
          label:
            "El ASG lanza nuevas instancias desde la plantilla de lanzamiento.",
        },
      ],
      correctOrder: [
        "alarma-monitoriza",
        "alarma-dispara",
        "politica",
        "lanzar",
        "elb-registra",
      ],
    },
  },

  {
    id: 15,
    title: "Políticas de Escalado: Cada Estrategia a su Caso",
    stars: 3,
    category: "ASG",
    description:
      "Target tracking, simple, programada o predictiva: cada política responde a una pregunta distinta del negocio.",
    objective: "Emparejar cada política de escalado con su estrategia",
    tags: ["target tracking", "scheduled", "predictive", "step"],
    fileName: "asg-policies",
    completed: false,
    theory: `📚 TEORÍA: Políticas de Escalado Dinámico

  • TARGET TRACKING: la más sencilla. 'Mantén la CPU media en torno al
    40%' y el ASG se ajusta solo para cumplirla.
  • ESCALADO SIMPLE / POR PASOS: si una alarma se dispara (CPU > 70%),
    añade 2 unidades; si baja (CPU < 30%), elimina 1.
  • PROGRAMADO (scheduled): anticipar patrones conocidos. Ej.: el Black
    Friday lanza 5 instancias extra, o subir la capacidad mínima los
    viernes a las 17:00.
  • PREDICTIVO: usa machine learning para predecir la carga futura y
    programar el escalado por adelantado.

Buenas métricas: CPU media, nº de peticiones por instancia (requests
per target), E/S de red y métricas personalizadas de CloudWatch.
Después de escalar, el ASG entra en un periodo de ENFRIAMIENTO (300 s
por defecto) para que las métricas se estabilicen antes de volver a
actuar.`,
    explanationText:
      "🌍 Ejemplo cotidiano: target tracking es el piloto automático del coche (mantuén 120 km/h); el escalado simple es el plan B si se enciende la luz de aceite; el programado es saber que los viernes hay atasco y salir antes; el predictivo es el GPS que ya sabe que habrá cola y te propone otra ruta.\n\nEl periodo de enfriamiento (300 s) evita que el ASG lance y termine instancias sin parar mientras las métricas aún se estabilizan.",
    codeSnippet: "# Empareja cada política de escalado con su estrategia",
    inputs: {},
    completeCode:
      "Target tracking: 'CPU ~40%' | Simple: alarma → +2 | Programada: Black Friday | Predictiva: ML",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada política de escalado con la estrategia que describe.",
      definitions: [
        "Anticipar patrones conocidos: cada viernes a las 17:00 subir la capacidad mínima.",
        "La más sencilla de configurar: 'mantén la CPU media en torno al 40%' y el ASG se ajusta solo.",
        "Usa machine learning para predecir la carga futura y programar el escalado por adelantado.",
        "Cuando una alarma se activa (CPU > 70%) añade 2 unidades; cuando cae (CPU < 30%) elimina 1.",
      ],
      pairs: [
        {
          id: "target-tracking",
          term: "Target tracking",
          definition:
            "La más sencilla de configurar: 'mantén la CPU media en torno al 40%' y el ASG se ajusta solo.",
        },
        {
          id: "simple",
          term: "Escalado simple / por pasos",
          definition:
            "Cuando una alarma se activa (CPU > 70%) añade 2 unidades; cuando cae (CPU < 30%) elimina 1.",
        },
        {
          id: "scheduled",
          term: "Acciones programadas",
          definition:
            "Anticipar patrones conocidos: cada viernes a las 17:00 subir la capacidad mínima.",
        },
        {
          id: "predictive",
          term: "Escalado predictivo",
          definition:
            "Usa machine learning para predecir la carga futura y programar el escalado por adelantado.",
        },
      ],
    },
  },

  {
    id: 16,
    title: "Instance Refresh: Actualizar el ASG sin Parón",
    stars: 4,
    category: "ASG",
    description:
      "Nueva plantilla, mismas instancias: el instance refresh sustituye las instancias viejas de una en una, sin tumbar todo.",
    objective: "Ordenar el flujo de actualización de instancias del ASG",
    tags: ["instance refresh", "launch template", "StartInstanceRefresh"],
    fileName: "asg-refresh",
    completed: false,
    theory: `📚 TEORÍA: Actualización de Instancias (Instance Refresh)

Tienes un ASG con 20 instancias y una NUEVA plantilla de lanzamiento
(p. ej. con una AMI actualizada). No tumbar todas las instancias y
lanzarlas de nuevo: eso no es buena práctica.

El instance refresh lo hace de forma controlada:
  1. Creas la nueva plantilla de lanzamiento.
  2. Llamas a la API StartInstanceRefresh.
  3. Defines un PORCENTAJE MÍNIMO DE SALUD (p. ej. 60%): cuántas
     instancias pueden estar fuera de servicio a la vez.
  4. El ASG va terminando instancias viejas y lanzando otras nuevas.
  5. Se aplica un TIEMPO DE CALENTAMIENTO (warmup) hasta que cada nueva
     instancia está lista para servir tráfico.

Resultado: todo el grupo queda con la nueva configuración sin perder
capacidad de golpe.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es cambiar de modelo todos los taxis de la flota, pero de uno en uno y manteniendo al menos el 60% en circulación: la ciudad sigue teniendo taxis mientras se renuevan.\n\nEl instructor avisa: 'tumbar todas las instancias y lanzarlas de nuevo' es el anti-patrón. La API StartInstanceRefresh + porcentaje mínimo de salud es la respuesta del examen.",
    codeSnippet:
      "# Ordena cómo actualizar todo un ASG a una nueva plantilla de lanzamiento sin parar el servicio",
    inputs: {},
    completeCode:
      "Nueva plantilla → StartInstanceRefresh → % mínimo de salud → sustituir gradualmente → warmup",
    format: "ordering",
    ordering: {
      prompt:
        "Reconstruye el flujo del instance refresh con una nueva plantilla de lanzamiento.",
      steps: [
        {
          id: "start-refresh",
          label:
            "Llamar a la API StartInstanceRefresh para empezar la actualización.",
        },
        {
          id: "nueva-plantilla",
          label:
            "Crear una nueva plantilla de lanzamiento (p. ej. con una AMI actualizada).",
        },
        {
          id: "min-salud",
          label:
            "Definir el porcentaje mínimo de salud (p. ej. 60% de instancias operativas).",
        },
        {
          id: "calentamiento",
          label:
            "Esperar el tiempo de calentamiento hasta que cada instancia nueva esté lista.",
        },
        {
          id: "terminar-lanzar",
          label:
            "Terminar instancias viejas de una en una y lanzar otras nuevas.",
        },
      ],
      correctOrder: [
        "nueva-plantilla",
        "start-refresh",
        "min-salud",
        "terminar-lanzar",
        "calentamiento",
      ],
    },
  },
];
