import type { Exercise } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// AWS VPC — Fase 2: Datos y red (DVA-C02, sección 10 del temario)
// Fiel a los subtítulos de: 111 a 116 (Fundamentos de la VPC)
// ──────────────────────────────────────────────────────────────────────────

export const AWS_VPC_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ─── CONCEPTOS (112: VPC, subredes, IGW y NAT) ──────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "¿Qué es una VPC? La red privada dentro de AWS",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "Una VPC (Virtual Private Cloud) es una red privada dentro de la nube de AWS: un recurso regional con su propio rango de IPs.",
    objective: "Entender qué es una VPC y sus características base",
    tags: ["VPC", "Virtual Private Cloud", "CIDR", "regional"],
    fileName: "vpc-basics",
    completed: false,
    theory: `📚 TEORÍA: VPC = Virtual Private Cloud (112)

Una **VPC** se puede definir como una **nube privada virtual**: una red
privada dentro de la nube de AWS que nos permite implementar nuestros
recursos dentro de esta red.

Características clave:
  • Es un recurso **regional**: si tenemos dos regiones de AWS,
    tendremos dos VPCs diferentes.
  • Tiene un conjunto de rangos de IP definido por un **CIDR**
    (Classless Inter-Domain Routing), por ejemplo **10.0.0.0/16**.
  • Dentro de la VPC encontramos **subredes**, que permiten
    particionar la red en la propia división.

En el examen de developer no necesitas entrar en tanta profundidad como
en Solutions Architect: basta con conocer estas bases.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una urbanización con valla propia dentro de una gran ciudad: la ciudad es la nube de AWS y tu parcela vallada (VPC) tiene su propio callejero (CIDR) y sus propias calles (subredes).\n\nAl ser regional, cada VPC vive en una sola región: si despliegas en dos regiones tienes dos redes totalmente aisladas. El rango CIDR define cuántas direcciones IP puedes usar dentro, como el número de parcelas del callejero.",
    codeSnippet: `# VPC = Virtual Private Cloud
# Una red [INPUT_1] dentro de la nube de AWS
# donde implementamos nuestros recursos.

# Es un recurso [INPUT_2]: si usamos dos regiones,
# tendremos dos VPCs diferentes.

# Dentro definimos un rango de direcciones IP
# llamado bloque [INPUT_3] (ej. [INPUT_4]).`,
    inputs: {
      INPUT_1: "privada",
      INPUT_2: "regional",
      INPUT_3: "CIDR",
      INPUT_4: "10.0.0.0/16",
    },
    completeCode:
      "VPC = red privada virtual | recurso regional | rango CIDR (ej. 10.0.0.0/16) | dentro hay subredes",
  },

  {
    id: 2,
    title: "Subredes: públicas y privadas por AZ",
    stars: 2,
    category: "SUBREDES",
    description:
      "Las subredes particionan la VPC a nivel de zona de disponibilidad: las públicas son accesibles desde Internet y las privadas no.",
    objective: "Distinguir subredes públicas y privadas y su ubicación",
    tags: ["subred", "AZ", "pública", "privada"],
    fileName: "subnet",
    completed: false,
    theory: `📚 TEORÍA: Subredes (112)

Las **subredes** permiten particionar la red dentro de la propia VPC y
se definen a nivel de **zona de disponibilidad** (AZ).

  • **Subred pública**: accesible desde Internet. Cualquier persona
    puede acceder a los recursos que están dentro.
  • **Subred privada**: NO accesible desde Internet. Sus recursos
    quedan aislados y más seguros.

Puedes tener múltiples subredes, públicas y privadas, repartidas entre
las AZs: por ejemplo, una pública y una privada en la AZ-A y otra
pública y otra privada en la AZ-B.

Cuando usas la **VPC por defecto** que ya existe en tu cuenta, solo
tienes subredes públicas: una subred pública por zona de disponibilidad,
sin subredes privadas.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un edificio con tienda en la planta baja (subred pública: cualquiera entra) y despachos en plantas altas con llave (subred privada: solo los empleados).\n\nLas subredes viven dentro de una única AZ: esa es la clave. Al aislar las instancias en subredes privadas ganas seguridad, porque Internet no puede llegar a ellas directamente. La VPC por defecto solo trae subredes públicas: las privadas hay que crearlas a mano.",
    codeSnippet: "// Afirmaciones sobre subredes públicas y privadas",
    inputs: {},
    completeCode:
      "Subred pública: accesible desde Internet | Subred privada: aislada | se definen por AZ | VPC default = solo públicas",
    format: "true-false",
    trueFalse: {
      prompt: "Valida cómo funcionan las subredes dentro de una VPC.",
      statements: [
        {
          id: "a",
          text: "Las subredes se definen a nivel de zona de disponibilidad (AZ): puedes tener varias subredes públicas y privadas repartidas entre AZs.",
          answer: true,
          explanation: "Cada subred vive dentro de una AZ concreta y puedes repetir públicas/privadas en cada una.",
        },
        {
          id: "b",
          text: "Una subred pública es accesible desde Internet: cualquier persona puede llegar a los recursos que están dentro.",
          answer: true,
          explanation: "Por eso las instancias web y los balanceadores viven en subredes públicas.",
        },
        {
          id: "c",
          text: "Una subred privada no es accesible desde Internet: sus instancias quedan aisladas del exterior.",
          answer: true,
          explanation: "Es el objetivo: más privado y más seguro.",
        },
        {
          id: "d",
          text: "La VPC por defecto incluye subredes públicas y privadas listas para usar.",
          answer: false,
          explanation: "La VPC por defecto solo tiene subredes públicas (una por AZ). Las privadas hay que crearlas.",
        },
        {
          id: "e",
          text: "El nombre 'pública' o 'privada' es lo único que determina si una subred tiene acceso a Internet.",
          answer: false,
          explanation: "Lo que la hace realmente pública es su tabla de rutas hacia el Internet Gateway, no el nombre.",
        },
      ],
    },
  },

  {
    id: 3,
    title: "IGW: la puerta que hace pública la subred",
    stars: 2,
    category: "GATEWAYS",
    description:
      "El Internet Gateway (IGW) es una puerta de enlace a nivel de VPC: las subredes públicas tienen una ruta 0.0.0.0/0 que apunta hacia él.",
    objective: "Entender el papel del Internet Gateway en el ruteo",
    tags: ["IGW", "Internet Gateway", "puerta de enlace", "0.0.0.0/0"],
    fileName: "route-table",
    completed: false,
    theory: `📚 TEORÍA: Internet Gateway (112)

El **Internet Gateway (IGW)** es una **puerta de enlace** (gateway) que
permite a las instancias de la VPC conectarse con Internet: permite
acceder a Internet y que desde Internet se acceda a nuestras instancias.

  • Es un recurso a nivel de **VPC**.
  • En el examen puedes verlo como 'IGW' o como 'puerta de enlace'.
  • Las **subredes públicas** tienen una ruta que lleva hacia el
    Internet Gateway.

En la tabla de rutas, esa entrada se ve así:
  • 10.0.0.0/16 → **local** (tráfico interno de la VPC)
  • 0.0.0.0/0   → **IGW** (todo lo demás sale a Internet)

Esta ruta hacia el IGW es lo que hace que una subred sea realmente
pública.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la puerta principal del edificio con portero que te deja entrar y salir a la calle: el IGW es esa puerta a nivel de VPC. Sin ella, los vecinos (instancias) no pueden ir a la calle (Internet) ni la calle puede visitarlos.\n\nLa ruta 0.0.0.0/0 es la 'ruta por defecto': todo tráfico que no cuadre con otra regla sale por ahí. En una subred pública, ese destino es el IGW; eso es exactamente lo que la distingue de una privada.",
    codeSnippet: `# Tabla de rutas de la SUBRED PÚBLICA
#   Destino       Target
#   10.0.0.0/16   local
#   0.0.0.0/0     [INPUT_1]   ← Internet Gateway

# El IGW es la [INPUT_2] de enlace a nivel de VPC
# que da acceso a [INPUT_3] a las subredes públicas.`,
    inputs: {
      INPUT_1: "IGW",
      INPUT_2: "puerta",
      INPUT_3: "Internet",
    },
    completeCode:
      "Ruta 0.0.0.0/0 → IGW en subredes públicas | IGW = puerta de enlace a nivel de VPC",
  },

  {
    id: 4,
    title: "NAT Gateway: salir a Internet sin dejar de ser privada",
    stars: 3,
    category: "GATEWAYS",
    description:
      "El NAT Gateway (o instancias NAT) hace la conversión de IP privada a pública: las subredes privadas salen a Internet, pero nadie entra.",
    objective: "Comprender por qué y cómo las subredes privadas acceden a Internet",
    tags: ["NAT Gateway", "NAT Instance", "IP privada", "subred privada"],
    fileName: "nat-gateway",
    completed: false,
    theory: `📚 TEORÍA: NAT Gateway y NAT Instance (112)

Los **NAT Gateways** (o **instancias NAT**) permiten a las instancias
EC2 de las **subredes privadas** acceder a Internet **sin dejar de ser
privadas**.

¿Por qué hace falta? Porque la instancia de una subred privada tiene una
**IP privada** y funciona internamente con esa IP. Para acceder a
Internet necesita una **IP pública**, y el NAT se encarga de hacer esa
**conversión**.

Puntos clave:
  • Solo habilita el tráfico de **salida**: Internet NO puede iniciar
    conexiones hacia las instancias privadas.
  • Es la pieza clave para dar acceso a Internet a las subredes
    privadas, como resume el instructor en los comentarios finales.
  • En la tabla de rutas de la subred privada, el destino por defecto
    0.0.0.0/0 apunta al NAT (no al IGW).`,
    explanationText:
      "🌍 Ejemplo cotidiano: llamar con número oculto: puedes llamar tú (salida), pero quien recibe no tiene tu número (IP) para devolverte la llamada ni encontrarte. El NAT hace de centralita que oculta tu IP privada.\n\nSin NAT, una instancia privada con IP 10.0.0.50 no puede hablar con Internet, porque los paquetes de respuesta no sabrían volver a una IP que no es ruteable en la red pública. El NAT traduce esa IP a una pública de salida: las aplicaciones de dentro sí se actualizan y descargan, pero nadie puede entrar desde fuera.",
    codeSnippet: "// Afirmaciones sobre el NAT Gateway y las subredes privadas",
    inputs: {},
    completeCode:
      "NAT Gateway: salida a Internet para subredes privadas | hace IP privada → IP pública | solo salida, sin entrada",
    format: "true-false",
    trueFalse: {
      prompt: "Valida cómo funciona el NAT Gateway en una subred privada.",
      statements: [
        {
          id: "a",
          text: "El NAT Gateway permite a las instancias de una subred privada acceder a Internet sin dejar de ser privadas.",
          answer: true,
          explanation: "Esa es su función: dar salida sin exponer las instancias.",
        },
        {
          id: "b",
          text: "El NAT hace la conversión de IP privada a IP pública para que la instancia pueda salir a Internet.",
          answer: true,
          explanation: "La instancia privada no es ruteable en Internet: el NAT traduce la IP para la salida.",
        },
        {
          id: "c",
          text: "Con un NAT Gateway, cualquier máquina de Internet puede iniciar conexiones hacia las instancias de la subred privada.",
          answer: false,
          explanation: "El NAT solo habilita la salida: desde Internet no se puede iniciar tráfico hacia la instancia privada.",
        },
        {
          id: "d",
          text: "El Internet Gateway de la VPC da salida a Internet a las subredes privadas sin necesidad de NAT.",
          answer: false,
          explanation: "La ruta por defecto de una subred privada apunta al NAT Gateway; el IGW es para las subredes públicas.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── RUTEO (112) ─────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 5,
    title: "Tabla de rutas: el mapa de caminos de la VPC",
    stars: 3,
    category: "RUTEO",
    description:
      "Las tablas de enrutamiento indican los caminos a seguir: 0.0.0.0/0 va al IGW en subredes públicas o al NAT en privadas; el tráfico interno va a 'local'.",
    objective: "Emparejar cada destino de tráfico con su ruta correcta",
    tags: ["route table", "0.0.0.0/0", "local", "peering"],
    fileName: "route-table",
    completed: false,
    theory: `📚 TEORÍA: Tablas de enrutamiento (112)

Para definir todo el acceso a Internet y entre las propias subredes
existen las **tablas de enrutamiento** (tablas de ruta), que indican los
**caminos a seguir** para llevar a cabo las comunicaciones.

Reglas típicas de una tabla de rutas:
  • **10.0.0.0/16 → local**: tráfico interno de la propia VPC.
  • **0.0.0.0/0 → IGW**: ruta por defecto de una subred pública:
    todo lo que no coincide con otra regla sale a Internet.
  • **0.0.0.0/0 → NAT Gateway**: ruta por defecto de una subred
    privada para salir a Internet sin exponerse.
  • **CIDR de otra VPC → VPC Peering**: tráfico hacia una VPC
    conectada por peering.

Cada subred está asociada a una tabla de rutas: cambiando esa asociación
cambias quién puede salir y hacia dónde.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el mapa de carreteras de una ciudad: la 'local' es caminar por tu propio barrio, la 0.0.0.0/0 es la salida hacia la autopista y el peering es el túnel que conecta dos ciudades vecinas.\n\nLa ruta 0.0.0.0/0 es la 'catch-all': captura todo el tráfico que no coincide con una regla más específica. Por eso basta con cambiar el destino de esa única ruta para que una subred pase de pública (IGW) a privada con salida (NAT).",
    codeSnippet: "// Empareja cada tipo de tráfico con la ruta que lo lleva a su destino",
    inputs: {},
    completeCode:
      "0.0.0.0/0 → IGW (pública) | 0.0.0.0/0 → NAT (privada) | 10.0.0.0/16 → local | peering → CIDR de la otra VPC",
    format: "matching",
    matching: {
      prompt: "Conecta cada tipo de tráfico con la ruta correcta de la tabla de rutas.",
      definitions: [
        "Ruta por defecto de una subred privada: todo el tráfico que no coincide con otra regla sale a Internet a través del NAT Gateway.",
        "Ruta local de la VPC: el tráfico entre recursos que comparten el mismo rango CIDR (10.0.0.0/16) se queda dentro.",
        "Ruta por defecto de una subred pública: todo el tráfico que no coincide con otra regla sale a Internet a través del Internet Gateway.",
        "Ruta hacia la CIDR de otra VPC conectada: el tráfico entre las dos VPCs viaja por el VPC Peering.",
      ],
      pairs: [
        {
          id: "publica",
          term: "Tráfico a Internet desde una subred pública",
          definition:
            "Ruta por defecto de una subred pública: todo el tráfico que no coincide con otra regla sale a Internet a través del Internet Gateway.",
        },
        {
          id: "privada",
          term: "Tráfico a Internet desde una subred privada",
          definition:
            "Ruta por defecto de una subred privada: todo el tráfico que no coincide con otra regla sale a Internet a través del NAT Gateway.",
        },
        {
          id: "local",
          term: "Tráfico interno entre recursos de la misma VPC",
          definition:
            "Ruta local de la VPC: el tráfico entre recursos que comparten el mismo rango CIDR (10.0.0.0/16) se queda dentro.",
        },
        {
          id: "peering",
          term: "Tráfico hacia otra VPC conectada",
          definition:
            "Ruta hacia la CIDR de otra VPC conectada: el tráfico entre las dos VPCs viaja por el VPC Peering.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── MONITOREO (113: flow logs) ──────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 6,
    title: "Flow Logs: el radar del tráfico IP",
    stars: 3,
    category: "MONITOREO",
    description:
      "Los logs de flujo de la VPC capturan información sobre el tráfico IP que entra y sale de nuestras interfaces, incluso aceptado o rechazado.",
    objective: "Saber qué capturan los flow logs y dónde se almacenan",
    tags: ["flow logs", "VPC", "S3", "CloudWatch Logs"],
    fileName: "vpc-flow-logs",
    completed: false,
    theory: `📚 TEORÍA: Flow Logs de la VPC (113)

Los **logs de flujo** (flow logs) de la VPC capturan información sobre
el **tráfico IP** que entra y sale de las **interfaces de red**.

¿Para qué sirven?
  • Supervisar y solucionar **problemas de conectividad** (de subredes
    a Internet, de subred a subred, de Internet a subredes...).
  • Detectar ataques de seguridad viendo las peticiones o el tráfico IP.
  • Conocer si un paquete fue **aceptado o rechazado**.

Se pueden capturar a tres niveles:
  • **VPC** · **Subred** · **ENI** (interfaz de red elástica).

También capturan información de red de **interfaces gestionadas por
AWS**: ELB, ElastiCache, RDS, Aurora y muchos más servicios.

Los flow logs se pueden almacenar en **S3** o en **CloudWatch Logs**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: las cámaras de seguridad del edificio: registran quién entra y quién sale (tráfico IP), quién es aceptado y quién rechazado, y en qué puerta (ENI) ocurrió.\n\nSin flow logs, un problema de conectividad es una caja negra: no sabes si el paquete llegó, se rechazó o se perdió. Con ellos puedes ver exactamente qué tráfico se aceptó y cuál se denegó, lo que convierte el debugging de red y la detección de ataques en algo concreto.",
    codeSnippet: `# Logs de flujo (Flow Logs) de la VPC
# Capturan información sobre el tráfico [INPUT_1]
# que entra y sale de nuestras interfaces de red.

# Niveles de captura: VPC, [INPUT_2] o ENI.
# Incluyen interfaces gestionadas por AWS:
# ELB, ElastiCache, [INPUT_3], Aurora...

# ¿Dónde se almacenan? En [INPUT_4]
# o en CloudWatch Logs.`,
    inputs: {
      INPUT_1: "IP",
      INPUT_2: "subred",
      INPUT_3: "RDS",
      INPUT_4: "S3",
    },
    completeCode:
      "Flow logs: tráfico IP en VPC/subred/ENI | aceptado o rechazado | destino: S3 o CloudWatch Logs",
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── SEGURIDAD (113: NACL, security groups, comparativa) ─────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 7,
    title: "SG vs NACL: stateful contra stateless",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "El security group es stateful y a nivel de instancia; el NACL es stateless, con allow y deny, y a nivel de subred.",
    objective: "Dominar la tabla comparativa entre security groups y NACL",
    tags: ["security group", "NACL", "stateful", "stateless"],
    fileName: "nacl-vs-sg",
    completed: false,
    theory: `📚 TEORÍA: NACL y Security Groups (113)

El instructor recalca que esta diferencia cae mucho en los exámenes.

**NACL (Network Access Control List)**:
  • Cortafuegos que controla el tráfico **desde y hacia las subredes**.
  • Puede tener reglas de **permitir (allow)** y de **denegar (deny)**.
  • Las reglas **solo incluyen direcciones IP**.
  • Se adjunta a nivel de **subred**: afecta a todas las instancias
    de esa subred (si hay 20, afecta a las 20).
  • Es **stateless (sin estado)**: la entrada y la salida se controlan
    por separado; hay que permitir explícitamente el tráfico de retorno.
  • Las reglas tienen **prioridad**: se evalúan en orden.

**Security Group (SG)**:
  • Cortafuegos que controla el tráfico hacia y desde una **ENI** o
    una **instancia EC2**.
  • **Solo reglas de permiso**: lo que no está permitido se deniega
    por defecto. No existe regla de denegación.
  • Las reglas pueden usar IPs u **otros security groups**.
  • Se adjunta a nivel de **instancia**: solo aplica si está asociado
    a esa instancia.
  • Es **stateful (con estado)**: el tráfico de retorno se permite
    automáticamente, porque ya se validó en la salida.
  • Evalúa **todas las reglas** antes de decidir (sin prioridad).`,
    explanationText:
      "🌍 Ejemplo cotidiano: el NACL es el control de accesos del parking de la manzana (subred): decide quién entra y sale por lista explícita. El SG es el portero de cada piso (instancia): solo tiene una lista de invitados (permisos) y recuerda quién ya entró para dejarlo salir sin volver a pedirle el carnet.\n\nEl SG 'recuerda' las conexiones que él mismo autorizó (stateful), por eso el retorno fluye solo. El NACL no recuerda nada (stateless): si permites la entrada por el puerto 80 pero no permites la salida del tráfico de respuesta, la petición llega pero la respuesta nunca sale.",
    codeSnippet: "// Afirmaciones sobre security groups y NACLs",
    inputs: {},
    completeCode:
      "SG: stateful, instancia, solo allow, evalúa todas | NACL: stateless, subred, allow+deny, orden/prioridad",
    format: "true-false",
    trueFalse: {
      prompt: "Valida la tabla comparativa entre security groups y NACLs.",
      statements: [
        {
          id: "a",
          text: "Un security group es stateful: el tráfico de retorno se permite de forma automática porque ya se validó en la salida.",
          answer: true,
          explanation: "El SG recuerda la conexión y deja volver la respuesta sin revalidarla.",
        },
        {
          id: "b",
          text: "Un NACL es stateless: se controlan por separado la entrada y la salida, incluido el tráfico de retorno.",
          answer: true,
          explanation: "El NACL no recuerda nada: cada dirección se evalúa con sus propias reglas.",
        },
        {
          id: "c",
          text: "Los security groups se adjuntan a nivel de subred y afectan a todas las instancias de esa subred.",
          answer: false,
          explanation: "Los SG se adjuntan a nivel de instancia/ENI. El que actúa a nivel de subred es el NACL.",
        },
        {
          id: "d",
          text: "Un NACL puede tener reglas de permiso y de denegación, mientras que un security group solo reglas de permiso.",
          answer: true,
          explanation: "En un SG no puedes denegar explícitamente: lo que no permites, queda denegado por defecto.",
        },
        {
          id: "e",
          text: "En un NACL las reglas se evalúan todas antes de decidir; en un security group importa el orden y la prioridad.",
          answer: false,
          explanation: "Es al revés: el SG evalúa todas sus reglas y el NACL sigue un orden de prioridad.",
        },
        {
          id: "f",
          text: "Las reglas de un NACL solo incluyen direcciones IP; un security group también puede referenciar otros security groups.",
          answer: true,
          explanation: "El SG permite reglas con IPs o con otros SG; el NACL solo trabaja con direcciones IP.",
        },
      ],
    },
  },

  {
    id: 8,
    title: "Bug: NACL stateless sin regla de retorno",
    stars: 4,
    category: "SEGURIDAD",
    description:
      "Un NACL permite la entrada HTTP pero deniega todo el tráfico de salida: la respuesta nunca llega al cliente porque el NACL es stateless.",
    objective: "Detectar el error clásico de un NACL stateless",
    tags: ["NACL", "stateless", "tráfico de retorno", "troubleshooting"],
    fileName: "nacl",
    completed: false,
    instruction: "Lee el NACL de la subred pública y encuentra por qué la web no responde.",
    theory: `📚 TEORÍA: El NACL es stateless (113)

Un NACL controla la entrada **y** la salida por separado. Como es
**stateless**, no recuerda las conexiones: si permites que el tráfico
HTTP **entre** a la subred, también tienes que permitir que la
**respuesta salga** de vuelta al cliente.

En el ejemplo típico:
  • INBOUND: Allow HTTP (80) desde 0.0.0.0/0 ✅
  • OUTBOUND: solo la regla por defecto **Deny ALL** ❌

Resultado: la petición del cliente entra, pero la respuesta de la
instancia es bloqueada a la salida. El cliente ve un timeout, aunque el
security group esté perfectamente configurado.

Los security groups, al ser stateful, no tienen este problema: el
retorno se permite solo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un portal que deja entrar a los visitantes pero prohíbe la salida: la gente entra, pero nadie puede irse con la respuesta. El resultado es un atasco idéntico a un bloqueo total.\n\nEste es el error clásico del stateless: permitir una dirección del flujo y olvidar la contraria. Recuerda: en un NACL hay que controlar entrada y salida por separado, incluso para el tráfico de retorno. En un SG esto no pasa porque es stateful.",
    codeSnippet: `// NACL de la subred pública (reglas del cortafuegos)
// INBOUND:
//   100   Allow   HTTP (80)   0.0.0.0/0
//   *     Deny    ALL          ALL
// OUTBOUND:
//   *     Deny    ALL          ALL   ← ¿y el retorno?`,
    inputs: {},
    completeCode:
      "Falta la regla de salida para el retorno: NACL stateless exige permitir ambas direcciones",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué vulnerabilidad o error contiene este NACL?",
      snippet: `// NACL de la subred pública (reglas del cortafuegos)
// INBOUND:
//   100   Allow   HTTP (80)   0.0.0.0/0
//   *     Deny    ALL          ALL
// OUTBOUND:
//   *     Deny    ALL          ALL`,
      options: [
        "El NACL es stateless: falta una regla de salida que permita el tráfico de retorno, por eso la respuesta nunca llega al cliente.",
        "El NACL debería estar aplicado a la subred privada, no a la pública.",
        "El error es del security group: no permite el puerto 80 de entrada.",
        "No hay bug: permitir solo la entrada y denegar toda la salida es la configuración correcta.",
      ],
      correct: 0,
    },
  },

  {
    id: 9,
    title: "Bug: un security group que intenta denegar",
    stars: 4,
    category: "SEGURIDAD",
    description:
      "Escribir una regla 'Deny' en un security group no funciona: los SG solo soportan permisos y lo que no permites queda denegado por defecto.",
    objective: "Detectar el malentendido de la regla Deny en un security group",
    tags: ["security group", "deny", "allow-only", "seguridad"],
    fileName: "security-group",
    completed: false,
    instruction: "Inspecciona las reglas de entrada del security group y encuentra el fallo.",
    theory: `📚 TEORÍA: Los SG solo tienen reglas de permiso (113)

Los security groups **solo pueden contener reglas de permiso** (allow).
No existe una regla de denegación explícita.

Si quieres **denegar** algo en un SG:
  • No lo **permitas**. Lo que no está permitido explícitamente,
    queda denegado por defecto.

Por ejemplo, para bloquear SSH no escribes 'Deny SSH desde 0.0.0.0/0'
(esa regla no existe): simplemente **no añades** ninguna regla de
entrada para el puerto 22.

Los NACL sí pueden denegar explícitamente, pero los security groups no:
esa es una de las diferencias que más repite el instructor.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el portero de una discoteca solo tiene lista de invitados (allow); no existe lista de expulsados. Si alguien no está en la lista, no entra. Intentar añadir una 'lista negra' no funciona porque el portero no la consulta.\n\nUn SG con una regla 'Deny' simplemente la ignora o no te deja crearla: para bloquear, retira el permiso. Este malentendido es muy típico de quien viene de firewalls clásicos, donde sí existen reglas de denegación.",
    codeSnippet: `// Reglas de entrada del security group de la instancia
SSH    TCP 22    Deny   0.0.0.0/0   // ⛔ esta regla NO existe en un SG
HTTP   TCP 80    Allow  0.0.0.0/0   // ✅ correcta`,
    inputs: {},
    completeCode:
      "SG = solo allow | para denegar SSH, no lo permitas | los deny explícitos no existen en un SG",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué contiene este security group de incorrecto?",
      snippet: `// Reglas de entrada del security group de la instancia
SSH    TCP 22    Deny   0.0.0.0/0
HTTP   TCP 80    Allow  0.0.0.0/0`,
      options: [
        "Los security groups solo contienen reglas de permiso: no puedes denegar explícitamente; lo que no permites queda denegado por defecto.",
        "El puerto 22 debería permitirse con Allow para bloquear el acceso.",
        "Los security groups sí soportan reglas de denegación como los NACL.",
        "No hay bug: una regla Deny es la forma correcta de bloquear SSH en un SG.",
      ],
      correct: 0,
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── CONEXIONES (114: peering, endpoints, VPN, Direct Connect) ───────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 10,
    title: "Conectar VPCs y entornos: Peering, Endpoints, VPN y Direct Connect",
    stars: 3,
    category: "CONEXIONES",
    description:
      "Peering une VPCs por la red privada; los Endpoints dan acceso privado a servicios AWS; la VPN va cifrada por Internet y Direct Connect es un enlace físico.",
    objective: "Elegir el mecanismo de conexión según el caso de uso",
    tags: ["VPC Peering", "VPC Endpoint", "Site-to-Site VPN", "Direct Connect"],
    fileName: "vpc-connections",
    completed: false,
    theory: `📚 TEORÍA: Conectar VPCs y entornos (114)

**VPC Peering**: conecta dos VPCs de forma privada usando la red de AWS,
como si estuvieran en la misma red.
  • Los rangos CIDR **no deben solaparse**.
  • **No es transitiva**: si la VPC A está conectada con B y con C,
    B no se comunica con C. Hay que establecer el link para cada par.

**VPC Endpoints**: permiten conectarse a servicios de AWS (S3,
DynamoDB, CloudWatch...) usando una **red privada** en lugar de la red
pública: más seguridad y menor latencia.
  • **Gateway Endpoint**: solo para **S3 y DynamoDB**.
  • **Interface Endpoint**: para el resto de servicios (ej. CloudWatch).

**Site-to-Site VPN**: conecta tu centro de datos local (on-premise) con
AWS. La conexión se **cifra automáticamente**, pero viaja por el
**Internet público**. Es más barata que Direct Connect.

**AWS Direct Connect**: establece una **conexión física y privada** entre
tus instalaciones y AWS, sin pasar por Internet público: segura y muy
rápida. Tarda **al menos un mes** en establecerse porque hay que
instalarla físicamente.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el peering es un túnel privado entre dos edificios de AWS; el endpoint es un acceso VIP directo al almacén de la empresa (S3) sin salir a la calle; la VPN es llamar por teléfono cifrado desde casa (Internet); Direct Connect es construir una tubería física dedicada entre tu casa y el almacén.\n\nEl peering no es transitivo: como los ascensores de dos torres conectadas por pasarela, la torre B no llega a la C sin su propia pasarela. Y recuerda el detalle del examen: Gateway Endpoint solo para S3 y DynamoDB; el resto usa Interface Endpoint.",
    codeSnippet: "// Empareja cada mecanismo de conexión con su descripción",
    inputs: {},
    completeCode:
      "Peering: VPC↔VPC no transitiva | Endpoint: acceso privado a S3/DynamoDB | VPN: cifrada por Internet | Direct Connect: física y privada",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada mecanismo de conexión con su característica principal.",
      definitions: [
        "Conexión física y privada entre tus instalaciones y AWS que no pasa por el Internet público: muy rápida y segura, pero tarda al menos un mes en establecerse.",
        "Acceso privado a servicios de AWS (S3, DynamoDB, CloudWatch...) usando la red privada en lugar de la pública: más seguridad y menor latencia.",
        "Conexión cifrada entre tu centro de datos local y AWS que viaja por el Internet público: es más barata que Direct Connect.",
        "Conexión privada entre dos VPCs usando la red de AWS, como si estuvieran en la misma red: requiere CIDRs no solapados y no es transitiva.",
      ],
      pairs: [
        {
          id: "peering",
          term: "VPC Peering",
          definition:
            "Conexión privada entre dos VPCs usando la red de AWS, como si estuvieran en la misma red: requiere CIDRs no solapados y no es transitiva.",
        },
        {
          id: "endpoint",
          term: "VPC Endpoint",
          definition:
            "Acceso privado a servicios de AWS (S3, DynamoDB, CloudWatch...) usando la red privada en lugar de la pública: más seguridad y menor latencia.",
        },
        {
          id: "vpn",
          term: "Site-to-Site VPN",
          definition:
            "Conexión cifrada entre tu centro de datos local y AWS que viaja por el Internet público: es más barata que Direct Connect.",
        },
        {
          id: "dc",
          term: "AWS Direct Connect",
          definition:
            "Conexión física y privada entre tus instalaciones y AWS que no pasa por el Internet público: muy rápida y segura, pero tarda al menos un mes en establecerse.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── ARQUITECTURA (116: tres niveles, LAMP, WordPress) ───────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 11,
    title: "Arquitectura de tres niveles: web, aplicación y datos",
    stars: 3,
    category: "ARQUITECTURA",
    description:
      "El ALB en subred pública, las EC2 del Auto Scaling Group en subred privada y RDS/ElastiCache en la subred de datos: la arquitectura típica.",
    objective: "Comprender dónde vive cada capa de una arquitectura de tres niveles",
    tags: ["tres niveles", "ALB", "ASG", "RDS", "LAMP"],
    fileName: "three-tier",
    completed: false,
    theory: `📚 TEORÍA: Arquitectura de tres niveles (116)

Una arquitectura típica que usa la VPC:

**Nivel 1 — Presentación**: el usuario hace peticiones a un **Elastic
Load Balancer**. Como recibe peticiones de Internet, se coloca en la
**subred pública**. Los usuarios llegan al balanceador mediante **Route
53** como servicio DNS.

**Nivel 2 — Aplicación**: las instancias **EC2** viven en un **Auto
Scaling Group** en **subred privada** (repartidas entre AZs). Solo el
ALB puede acceder a ellas: los usuarios no deben llegar directamente a
las instancias.

**Nivel 3 — Datos**: la **subred de datos** con **Amazon RDS** (leer y
escribir datos) y **ElastiCache** (caché y datos de sesión).

Relacionado con el examen, el **LAMP stack**:
  • **L** = Linux (SO de las instancias EC2)
  • **A** = Apache (servidor web)
  • **M** = MySQL (base de datos en RDS)
  • **P** = PHP (lógica de la aplicación en EC2)

En WordPress, además, **EFS** comparte imágenes entre varias instancias
a la vez.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un restaurante: el ALB es el maître en la entrada (público) que reparte mesas; los cocineros (EC2) están en la cocina privada a la que nadie entra; la despensa y la nevera (RDS/ElastiCache) están al fondo.\n\nEl aislamiento es la clave: si los usuarios solo hablan con el ALB, las instancias pueden escalar sin exponerse y los datos quedan doblemente protegidos. Este patrón web→app→DB es el más preguntado de arquitectura: aprende qué capa vive en qué subred.",
    codeSnippet: "// Afirmaciones sobre la arquitectura de tres niveles",
    inputs: {},
    completeCode:
      "ALB: subred pública | EC2 (ASG): subred privada | RDS/ElastiCache: subred de datos | Route 53 = DNS",
    format: "true-false",
    trueFalse: {
      prompt: "Valida cómo se organiza una arquitectura de tres niveles en la VPC.",
      statements: [
        {
          id: "a",
          text: "El Elastic Load Balancer recibe peticiones de Internet y por eso se coloca en una subred pública.",
          answer: true,
          explanation: "El balanceador es el punto de entrada público de la arquitectura.",
        },
        {
          id: "b",
          text: "Las instancias EC2 de la capa de aplicación son accesibles directamente desde Internet.",
          answer: false,
          explanation: "Viven en subred privada: solo el ALB puede acceder a ellas.",
        },
        {
          id: "c",
          text: "La capa de datos (RDS y ElastiCache) vive en su propia subred, separada de las instancias EC2.",
          answer: true,
          explanation: "Es la subred de datos: un nivel más de aislamiento para la información.",
        },
        {
          id: "d",
          text: "Route 53 se puede usar como servicio DNS para que los usuarios lleguen al Elastic Load Balancer.",
          answer: true,
          explanation: "Route 53 resuelve el dominio hacia el balanceador de carga.",
        },
        {
          id: "e",
          text: "En el stack LAMP, la 'M' (MySQL) se ejecuta como base de datos dentro de las instancias EC2 de aplicación.",
          answer: false,
          explanation: "En la arquitectura del curso la 'M' de MySQL vive en RDS, dentro de la subred de datos.",
        },
        {
          id: "f",
          text: "La VPC por defecto ya incluye montada una arquitectura de tres niveles.",
          answer: false,
          explanation: "La VPC por defecto solo tiene subredes públicas: la arquitectura de tres niveles hay que construirla.",
        },
      ],
    },
  },

  {
    id: 12,
    title: "Construir la VPC: el orden de montaje",
    stars: 4,
    category: "ARQUITECTURA",
    description:
      "Del CIDR a las instancias: crear la VPC, las subredes, el Internet Gateway, las tablas de rutas y el NAT Gateway en el orden correcto.",
    objective: "Reconstruir la secuencia para montar una VPC funcional",
    tags: ["VPC", "subredes", "IGW", "NAT Gateway", "ruteo"],
    fileName: "vpc-build",
    completed: false,
    theory: `📚 TEORÍA: El montaje de una VPC (112-116)

El orden lógico para construir la red:

  1. **Crear la VPC** definiendo su rango CIDR (ej. 10.0.0.0/16).
  2. **Crear las subredes** públicas y privadas en las AZs.
  3. **Crear y adjuntar el Internet Gateway (IGW)** a la VPC.
  4. **Asociar una tabla de rutas** a la subred pública con
     **0.0.0.0/0 → IGW**: sin esa ruta, la subred no es pública.
  5. **Crear un NAT Gateway** (en una subred pública) y añadir a la
     subred privada la ruta **0.0.0.0/0 → NAT**: salida sin exposición.
  6. **Lanzar las instancias**: públicas con IGW, privadas con NAT.

El ruteo es lo que materializa la red: sin las rutas correctas, la
infraestructura está aislada aunque todos los componentes existan.`,
    explanationText:
      "🌍 Ejemplo cotidiano: montar una urbanización: primero compras el terreno (VPC/CIDR), trazas las calles (subredes), construyes la puerta de entrada (IGW), pones las señales de tráfico (rutas) y por último los vecinos se mudan (instancias).\n\nEl IGW debe crearse antes que las rutas, porque la ruta 0.0.0.0/0 apunta a un ID de IGW. Y el NAT se coloca en una subred pública para poder salir a Internet y servir de puente a las privadas: primero la puerta, luego las señales, luego los inquilinos.",
    codeSnippet: "// Ordena los pasos para construir una VPC funcional",
    inputs: {},
    completeCode:
      "VPC (CIDR) → subredes → IGW → ruta pública (0.0.0.0/0 → IGW) → NAT + ruta privada → instancias",
    format: "ordering",
    ordering: {
      prompt:
        "Ordena los pasos para montar una VPC desde cero hasta lanzar instancias.",
      steps: [
        { id: "vpc", label: "Crear la VPC definiendo su rango CIDR (ej. 10.0.0.0/16)" },
        { id: "subredes", label: "Crear las subredes públicas y privadas en las zonas de disponibilidad" },
        { id: "igw", label: "Crear el Internet Gateway (IGW) y adjuntarlo a la VPC" },
        { id: "ruta-pub", label: "Asociar la tabla de rutas de la subred pública con 0.0.0.0/0 → IGW" },
        { id: "nat", label: "Crear un NAT Gateway y añadir a la subred privada la ruta 0.0.0.0/0 → NAT" },
        { id: "instancias", label: "Lanzar las instancias: las públicas salen por IGW y las privadas por NAT" },
      ],
      correctOrder: ["vpc", "subredes", "igw", "ruta-pub", "nat", "instancias"],
    },
  },
];
