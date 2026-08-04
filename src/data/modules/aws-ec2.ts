import type { Exercise } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// AWS EC2 — Fase 1: Fundamentos (DVA-C02, sección 05 del temario)
// Fiel a los subtítulos de: 033 a 045 (Fundamentos de EC2)
// ──────────────────────────────────────────────────────────────────────────

export const AWS_EC2_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ─── CONCEPTOS (033: Fundamentos de EC2, 034: user data práctica) ────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "¿Qué es EC2? El servicio más popular de AWS",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "EC2 es una de las ofertas más populares de AWS: alquilar máquinas virtuales bajo demanda.",
    objective: "Entender qué engloba EC2 (instancias, EBS, ELB, ASG)",
    tags: ["EC2", "IaaS", "máquinas virtuales"],
    fileName: "ec2-basics",
    completed: false,
    theory: `📚 TEORÍA: EC2 = Elastic Compute Cloud

EC2 viene de **Elastic Compute Cloud** y es infraestructura como servicio (IaaS):
alquilas máquinas virtuales bajo demanda y las pagas por lo que usas.

El servicio se enfoca en cuatro capacidades:
  • Alquilar máquinas virtuales → las llamamos **instancias**
  • Almacenar datos en unidades virtuales → **EBS** (sección específica en el curso)
  • Distribuir la carga entre máquinas → **Elastic Load Balancer (ELB)**
  • Escalar servicios → **Auto Scaling Groups (ASG)**

Al lanzar una instancia eliges:
  • Sistema operativo: Linux, Windows, Mac...
  • Potencia: CPU (núcleos) y RAM (2, 8, 16, 32 GiB...)
  • Almacenamiento: EBS (conectado a la red) o Instance Store (hardware)
  • Red: tarjeta, IP pública y firewall (security group)
  • Script de arranque: los **user data** (bootstrap)

Conocer EC2 es fundamental para entender el cloud: es el bloque sobre el que
se construye casi todo lo demás en los exámenes.`,
    explanationText:
      "🌍 Ejemplo cotidiano: alquilar un apartamento amueblado por horas: eliges el barrio (AZ), el tamaño (CPU/RAM), quién tiene llave (key pair) y las reglas de la portería (security group).\n\nEC2 es IaaS: en lugar de comprar servidores, alquilas capacidad de cómputo que escala con un botón. Por eso entender EC2 es clave: casi todos los servicios de AWS se apoyan en instancias bajo el capó.",
    codeSnippet: `EC2 significa Elastic [INPUT_1] Cloud.

Es un servicio de infraestructura como [INPUT_2] (IaaS):
alquilas máquinas virtuales llamadas [INPUT_3].

EC2 también permite almacenar en discos virtuales ([INPUT_4]),
balancear carga (ELB) y escalar con Auto Scaling Groups.`,
    inputs: {
      INPUT_1: "Compute",
      INPUT_2: "servicio",
      INPUT_3: "instancias",
      INPUT_4: "EBS",
    },
    completeCode: "EC2 = Elastic Compute Cloud | IaaS | instancias | EBS | ELB | ASG",
  },

  {
    id: 2,
    title: "User Data: el ADN de tu instancia",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "El script de user data (bootstrap) configura la instancia automáticamente en su primer arranque.",
    objective: "Predecir cuándo y cómo se ejecuta el user data",
    tags: ["user data", "bootstrap", "script de arranque"],
    fileName: "ec2-user-data.sh",
    completed: false,
    theory: `📚 TEORÍA: User Data (Bootstrap)

Al lanzar una instancia puedes pasar un **script de datos de usuario** que es
como el **ADN** que tendrá la máquina: cuando se levanta, ya viene configurada.

Características clave:
  • Se ejecuta **una sola vez**, en el primer arranque de la instancia
  • Se ejecuta con el usuario **root**
  • Automatiza tareas de arranque: instalar actualizaciones, instalar
    software, descargar archivos de Internet...

Olvídate de lanzar una instancia y configurarla a mano cada vez: el script
lo hace solo en cada instancia que levantes con esos user data.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el user data es el ADN de la instancia: cuando 'nace', ya viene programada con todo lo que metiste en el script, sin que tú tengas que configurar nada a mano.\n\nSe ejecuta solo en el primer arranque (no en cada reinicio) y como root, por lo que sirve para tareas de bootstrap: instalar paquetes, aplicar actualizaciones o descargar ficheros. Por eso es la base del enfoque 'immutable infrastructure': la instancia nace lista.",
    codeSnippet: `#!/bin/bash
apt update -y
apt install -y nginx
echo "Hola mundo desde la instancia" > /var/www/html/index.html`,
    inputs: {},
    completeCode: "#!/bin/bash | apt install -y nginx | echo 'Hola mundo' > /var/www/html/index.html",
    format: "prediction",
    prediction: {
      prompt: "¿Cuándo se ejecuta este script de user data en la instancia?",
      snippet: `#!/bin/bash
apt update -y
apt install -y nginx
echo "Hola mundo desde la instancia" > /var/www/html/index.html`,
      options: [
        "Solo en el primer arranque de la instancia",
        "En cada reinicio de la instancia",
        "Cada vez que alguien visita el sitio web",
        "Nunca; hay que ejecutarlo manualmente por SSH",
      ],
      answer: "Solo en el primer arranque de la instancia",
    },
  },

  {
    id: 3,
    title: "De cero a sitio web: lanzar instancia con user data",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "El flujo real de la práctica: elegir AMI y tipo, abrir HTTP, pegar el user data y acceder al 'Hola mundo'.",
    objective: "Reconstruir el flujo de lanzamiento con user data",
    tags: ["launch", "user data", "sitio web"],
    fileName: "ec2-user-data.sh",
    completed: false,
    theory: `📚 TEORÍA: Lanzar una instancia (práctica 034)

Pasos que sigue el instructor en consola:
  1. Nombre de la instancia + tags opcionales
  2. AMI: imagen base (Amazon Linux viene por defecto, es gratis)
  3. Tipo de instancia: **t2.micro** (capa gratuita)
  4. Key pair: crea uno (RSA, formato .pem) para poder conectar por SSH
  5. Security group: permite **HTTP (puerto 80)** desde Internet
  6. Detalles avanzados → **user data**: pegar el script bootstrap
  7. Lanzar la instancia (~30 segundos en estar 'running')

Luego accedes por **http://IP-pública** (sin la 's' de https) y ves el
mensaje que generó el script. Cuidado: la IP pública **cambia** si paras
y reinicias la instancia.`,
    explanationText:
      "🌍 Ejemplo cotidiano: montar un puesto de limonada: eliges el local (AMI), el tamaño (t2.micro), las normas de entrada (security group HTTP) y la receta (user data); en 30 segundos el puesto está abierto.\n\nEl user data se pega en 'Detalles avanzados' y solo se ejecuta en el primer arranque. Como la IP pública cambia al detener/reiniciar, la dirección que usas hoy puede no servir mañana.",
    codeSnippet: "// Ordena el flujo: elegir AMI → abrir HTTP → user data → lanzar → acceder",
    inputs: {},
    completeCode: "AMI (Amazon Linux) → SG HTTP 80 → user data → lanzar → http://IP-pública ('Hola mundo')",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para lanzar la instancia con user data y ver el sitio web.",
      steps: [
        { id: "ami", label: "Elegir AMI (Amazon Linux) y tipo de instancia t2.micro" },
        { id: "sg", label: "Crear un security group que permita HTTP (puerto 80) desde Internet" },
        { id: "udata", label: "En 'Detalles avanzados', pegar el script de user data" },
        { id: "launch", label: "Lanzar la instancia y esperar a que esté en ejecución (~30 s)" },
        { id: "access", label: "Abrir http://IP-pública y ver el mensaje 'Hola mundo'" },
      ],
      correctOrder: ["ami", "sg", "udata", "launch", "access"],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── TIPOS DE INSTANCIA (035) ─────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 4,
    title: "Descifrar el nombre M5.2xlarge",
    stars: 1,
    category: "TIPOS DE INSTANCIA",
    description:
      "Los nombres de instancia esconden tres datos: clase, generación y tamaño.",
    objective: "Leer e interpretar el nombre de una instancia EC2",
    tags: ["tipo de instancia", "naming", "M5.2xlarge"],
    fileName: "instance-type",
    completed: false,
    theory: `📚 TEORÍA: Nomenclatura de instancias

Un nombre como **M5.2xlarge** se descompone así:
  • **M**  → clase de instancia (aquí: propósito general)
  • **5**  → generación (AWS mejora las instancias con el tiempo)
  • **2xlarge** → tamaño (más tamaño = más CPU y memoria)

La clase define para qué sirve la instancia; la generación, la mejora
técnica; y el tamaño, la potencia. En el curso se usa **t2.micro**:
t (propósito general) + 2 (generación) + micro (tamaño básico).

t2.micro forma parte de la **capa gratuita**: hasta 750 horas al mes.`,
    explanationText:
      "🌍 Ejemplo cotidiano: como la ficha técnica de un coche: la letra dice el segmento (utilitario, berlina, deportivo), el número la generación del modelo y el sufijo la cilindrada.\n\nDominar la nomenclatura te deja elegir la instancia correcta sin memorizar catálogos: clase para el caso de uso, generación para lo moderno y tamaño para la potencia que necesitas.",
    codeSnippet: `# Nomenclatura de una instancia EC2
#  M5.2xlarge
#   └─ M        → [INPUT_1] de instancia (aquí: propósito general)
#   └─ 5        → [INPUT_2] (AWS la mejora con el tiempo)
#   └─ 2xlarge  → [INPUT_3] (más CPU y memoria)

# El curso usa t2.micro: entra en la [INPUT_4] gratuita
# (hasta 750 horas al mes)`,
    inputs: {
      INPUT_1: "clase",
      INPUT_2: "generación",
      INPUT_3: "tamaño",
      INPUT_4: "capa",
    },
    completeCode: "clase (M) | generación (5) | tamaño (2xlarge) | t2.micro = capa gratuita (750 h/mes)",
  },

  {
    id: 5,
    title: "¿Qué familia para cada carga de trabajo?",
    stars: 3,
    category: "TIPOS DE INSTANCIA",
    description:
      "Propósito general, computación, memoria y almacenamiento optimizados tienen casos de uso distintos.",
    objective: "Elegir la familia de instancia correcta",
    tags: ["familias", "compute", "memory", "storage"],
    fileName: "instance-family",
    completed: false,
    theory: `📚 TEORÍA: Familias de instancias

  • Propósito general: equilibrio entre computación, memoria y red.
    Ideal para servidores web y repositorios de código. (ej. t2.micro)
  • Computación optimizada: cálculo intensivo con procesadores de alto
    rendimiento: batch, media encoding, HPC, machine learning,
    servidores de videojuegos.
  • Memoria optimizada: rápido para grandes conjuntos de datos en memoria:
    bases de datos relacionales/no relacionales, caché distribuida,
    BI, procesamiento en tiempo real.
  • Almacenamiento optimizado: acceso intensivo de lectura/escritura a
    datos locales: OLTP bancario, bases de datos, sistemas de archivos
    distribuidos.

Elegir la familia correcta evita pagar por recursos que no usas.`,
    explanationText:
      "🌍 Ejemplo cotidiano: elegir el vehículo según el encargo: furgoneta para mudanzas, deportivo para velocidad, camión cisterna para líquidos. Cada familia afina el hardware hacia lo que tu carga necesita.\n\nSi tu workload requiere mucha RAM, una instancia de memoria optimizada rinde mejor y cuesta menos que una de propósito general sobredimensionada: no pagas CPU de más.",
    codeSnippet: `// Necesitas procesar lotes de imágenes con machine learning
// intensivo: picos altos de CPU, sin grandes requisitos de RAM.
// Los datos viven en disco y caben sin problema.`,
    inputs: {},
    completeCode: "Cálculo intensivo (batch, ML, encoding) → computación optimizada",
    format: "prediction",
    prediction: {
      prompt: "¿Qué familia de instancia elegirías para este caso de uso?",
      snippet: `// Cargas por lotes (batch jobs) de machine learning y
// codificación de media: necesidad constante de CPU.`,
      options: [
        "Computación optimizada",
        "Propósito general",
        "Memoria optimizada",
        "Almacenamiento optimizado",
      ],
      answer: "Computación optimizada",
    },
  },

  {
    id: 6,
    title: "t2.micro y la capa gratuita",
    stars: 1,
    category: "TIPOS DE INSTANCIA",
    description:
      "t2.micro es la instancia de propósito general incluida en la capa gratuita: 750 horas al mes.",
    objective: "Entender las condiciones de la capa gratuita",
    tags: ["t2.micro", "free tier", "capa gratuita"],
    fileName: "instance-type",
    completed: false,
    theory: `📚 TEORÍA: t2.micro

t2.micro es una instancia de **propósito general** muy básica:
  • 1 vCPU y 1 GiB de memoria
  • Rendimiento de red bajo a moderado
  • Almacenamiento con EBS (no Instance Store)
  • Incluida en la **capa gratuita**: hasta 750 horas al mes

No sirve para cálculo intensivo. A medida que subes de tamaño
(t2.xlarge, r5.16xlarge con 64 vCPU y 512 GiB) suben CPU, memoria,
rendimiento y precio. El precio por hora de las instancias grandes
(por ejemplo $4/hora) se dispara: 4$ x 24 h = 96$ al día.`,
    explanationText:
      "🌍 Ejemplo cotidiano: t2.micro es el coche de alquiler básico que viene gratis en el paquete promocional: perfecto para aprender, no para carreras.\n\nLa capa gratuita limita a 750 horas/mes: pasarse cuesta dinero. Y un precio por hora aparentemente pequeño (ej. $4/h) se convierte en ~$2.880 al mes: por eso elegir el tamaño correcto importa.",
    codeSnippet: "// Afirmaciones sobre t2.micro y la capa gratuita",
    inputs: {},
    completeCode: "t2.micro = 1 vCPU + 1 GiB | capa gratuita 750 h/mes | no apta para cálculo intensivo",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de t2.micro y la capa gratuita.",
      statements: [
        {
          id: "a",
          text: "t2.micro es una instancia de propósito general incluida en la capa gratuita (hasta 750 horas al mes).",
          answer: true,
          explanation: "Es de propósito general, básica y contemplada en la capa gratuita.",
        },
        {
          id: "b",
          text: "t2.micro ofrece 64 vCPU y 512 GiB de memoria.",
          answer: false,
          explanation: "Eso es una r5.16xlarge. t2.micro tiene 1 vCPU y 1 GiB.",
        },
        {
          id: "c",
          text: "Un workload de machine learning intensivo debería usar una instancia de propósito general como t2.micro.",
          answer: false,
          explanation: "Para cálculo intensivo se elige una instancia de computación optimizada.",
        },
        {
          id: "d",
          text: "El tamaño de la instancia influye en el precio por hora: a más CPU y memoria, más coste.",
          answer: true,
          explanation: "El precio escala con las características de la instancia.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── SEGURIDAD DE RED (036: security groups y puertos) ───────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 7,
    title: "Security Groups: el firewall de tu instancia",
    stars: 2,
    category: "SEGURIDAD",
    description:
      "Los security groups controlan todo el tráfico de entrada y salida; solo contienen reglas de permiso.",
    objective: "Dominar el comportamiento por defecto de los security groups",
    tags: ["security group", "firewall", "inbound", "outbound"],
    fileName: "security-group",
    completed: false,
    theory: `📚 TEORÍA: Security Groups

Los security groups son **la base de la seguridad de red** en AWS:
controlan el tráfico de entrada (inbound) y de salida (outbound)
hacia y desde tus instancias.

Reglas clave:
  • Solo contienen reglas de **permiso** (no de denegación)
  • Pueden referenciar una IP (ej. 0.0.0.0/0 = cualquier fuente)
    o **otro security group**
  • Todo el tráfico de **entrada está bloqueado por defecto**
  • Todo el tráfico de **salida está autorizado por defecto**
  • Un SG se adjunta a varias instancias; vive ligado a región/VPC
  • Vive 'fuera' de la instancia: si bloquea, la instancia no ve el tráfico`,
    explanationText:
      "🌍 Ejemplo cotidiano: el portero de un club: por defecto nadie entra (inbound bloqueado) y todos pueden salir (outbound permitido). Solo escribes en la lista quién entra: no existe 'lista negra' porque solo hay permisos.\n\nPor eso, si tu app no responde con timeout, sospecha del SG; y los cambios de reglas se aplican al instante sin reiniciar la instancia.",
    codeSnippet: "// Afirmaciones sobre los security groups",
    inputs: {},
    completeCode: "Inbound bloqueado por defecto | Outbound permitido por defecto | solo reglas de permiso",
    format: "true-false",
    trueFalse: {
      prompt: "Valida cómo funcionan los security groups por defecto.",
      statements: [
        {
          id: "a",
          text: "Por defecto, un security group bloquea todo el tráfico de entrada y permite todo el de salida.",
          answer: true,
          explanation: "Inbound bloqueado y outbound autorizado: así nace cada SG.",
        },
        {
          id: "b",
          text: "Los security groups solo pueden contener reglas de permiso, no reglas de denegación.",
          answer: true,
          explanation: "Solo hay 'allow': lo que no está permitido, se deniega implícitamente.",
        },
        {
          id: "c",
          text: "Para cambiar un security group es necesario detener la instancia.",
          answer: false,
          explanation: "Los cambios se aplican al instante, sin reiniciar la instancia.",
        },
        {
          id: "d",
          text: "Un security group solo se puede aplicar a una única instancia.",
          answer: false,
          explanation: "Un SG se puede adjuntar a varias instancias de la misma región.",
        },
        {
          id: "e",
          text: "Un security group puede referenciar a otro security group en lugar de una IP concreta.",
          answer: true,
          explanation: "Así autorizas tráfico desde todas las instancias que tengan ese otro SG.",
        },
      ],
    },
  },

  {
    id: 8,
    title: "Puertos clásicos: 22, 21, 80, 443, 3389",
    stars: 2,
    category: "SEGURIDAD",
    description:
      "Los puertos que siempre aparecen: SSH, FTP, SFTP, HTTP, HTTPS y RDP.",
    objective: "Memorizar los puertos y protocolos clásicos",
    tags: ["puertos", "SSH", "HTTP", "RDP"],
    fileName: "ports",
    completed: false,
    theory: `📚 TEORÍA: Puertos clásicos

  • **22**  → SSH (Secure Shell): iniciar sesión en una instancia Linux
  • **21**  → FTP (File Transfer Protocol): subir archivos a un servidor
  • **22**  → SFTP (Secure FTP): subir archivos de forma segura usando SSH
  • **80**  → HTTP: acceso a sitios web NO seguros
  • **443** → HTTPS: acceso a sitios web seguros (con cifrado)
  • **3389** → RDP (Remote Desktop Protocol): iniciar sesión en una
    instancia Windows

Son los seis puertos más clásicos y aparecen con frecuencia en los
exámenes y en las reglas de los security groups.`,
    explanationText:
      "🌍 Ejemplo cotidiano: las puertas numeradas de un edificio: cada puerta (puerto) da acceso a un servicio distinto. 22 es la puerta del administrador de Linux (SSH), 3389 la del escritorio de Windows (RDP) y 80/443 las del mostrador web.\n\nMemorizarlos te permite leer un security group de un vistazo y abrir solo lo imprescindible: el principio de mínima exposición.",
    codeSnippet: `# Completa los puertos clásicos
# Puerto [INPUT_1]  → SSH (iniciar sesión en Linux)
# Puerto 21  → [INPUT_2] (subir archivos, sin cifrar)
# Puerto 22  → [INPUT_3] (subir archivos seguro sobre SSH)
# Puerto 80  → [INPUT_4] (sitios web NO seguros)
# Puerto [INPUT_5] → HTTPS (sitios web seguros)
# Puerto [INPUT_6] → RDP (escritorio remoto en Windows)`,
    inputs: {
      INPUT_1: "22",
      INPUT_2: "FTP",
      INPUT_3: "SFTP",
      INPUT_4: "HTTP",
      INPUT_5: "443",
      INPUT_6: "3389",
    },
    completeCode: "22=SSH | 21=FTP | 22=SFTP | 80=HTTP | 443=HTTPS | 3389=RDP",
  },

  {
    id: 9,
    title: "Timeout vs conexión rechazada: diagnóstico",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "El tipo de error te dice dónde está el problema: el security group o la propia aplicación.",
    objective: "Interpretar errores de conexión",
    tags: ["troubleshooting", "security group", "timeout"],
    fileName: "security-group",
    completed: false,
    theory: `📚 TEORÍA: Diagnóstico de errores

El instructor lo resume así:
  • Si tu aplicación **no es accesible y da time out** (se queda
    'pensando' hasta agotar el tiempo) → es un problema de
    **security group**: el firewall está cortando el tráfico.
  • Si da **conexión rechazada** (connection refused) → es un error de
    la **propia aplicación**: no está escuchando en ese puerto.

El SG vive fuera de la instancia: si bloquea, la instancia nunca recibe
la petición y el cliente espera hasta el timeout.`,
    explanationText:
      "🌍 Ejemplo cotidiano: llamar a una puerta blindada (timeout: no contestan, el portero te bloquea) vs a una puerta abierta con el local cerrado (conexión rechazada: llegas pero no hay nadie).\n\nTimeout = capa de red/firewall (SG). Conexión rechazada = la app no corre o no escucha. Con esto ahorras horas de debug: sabes a qué capa mirar.",
    codeSnippet: `// Abres http://IP-pública en el navegador.
// La pestaña se queda cargando... y al final aparece:
// "Tiempo de espera agotado" (timeout).`,
    inputs: {},
    completeCode: "Timeout → security group bloqueando | Conexión rechazada → error de la aplicación",
    format: "prediction",
    prediction: {
      prompt: "¿Qué te indica este error de timeout?",
      snippet: `// Abres http://IP-pública en el navegador.
// La pestaña se queda cargando... hasta dar timeout.`,
      options: [
        "El security group está bloqueando el puerto 80",
        "La aplicación devuelve un error HTTP 500",
        "El DNS no está resuelto",
        "Es normal; hay que esperar más tiempo",
      ],
      answer: "El security group está bloqueando el puerto 80",
    },
  },

  {
    id: 10,
    title: "Bug: SSH abierto a todo el mundo (0.0.0.0/0)",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "Abrir el puerto 22 a 0.0.0.0/0 expone tu instancia a ataques de fuerza bruta de todo Internet.",
    objective: "Detectar un security group inseguro",
    tags: ["security group", "0.0.0.0/0", "SSH", "seguridad"],
    fileName: "security-group",
    completed: false,
    instruction: "Lee la regla de entrada y detecta el problema de seguridad.",
    theory: `📚 TEORÍA: 0.0.0.0/0 y el principio de mínima exposición

**0.0.0.0/0** significa 'cualquier IP de Internet': autorizas a todo el
mundo. Eso es correcto para HTTP (80) y HTTPS (443), porque son públicos
por diseño, pero **peligroso para SSH (22)**: cualquiera del planeta
puede intentar autenticarse en tu instancia (fuerza bruta).

Lo correcto es restringir SSH a tu IP o al rango de tu oficina:
  • SSH 22 → 203.0.113.10/32 (una sola IP)
  • SSH 22 → 203.0.113.0/24 (un rango)

Los SGs solo contienen permisos: lo que abres de más, lo pagas en riesgo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: publicar la llave de tu casa bajo el felpudo en redes sociales: cualquiera puede intentar entrar. 0.0.0.0/0 es 'todo el mundo'; /32 es una única IP.\n\nEl puerto 22 es la puerta del administrador: abrirla a todo Internet invita a ataques de fuerza bruta. La web (80/443) sí es pública por diseño, pero el acceso de administración debe restringirse a las IPs de confianza.",
    codeSnippet: `// Regla de entrada del security group de tu instancia web
SSH    TCP 22   0.0.0.0/0   // permiso a TODO Internet
HTTP   TCP 80   0.0.0.0/0   // web pública (correcto)`,
    inputs: {},
    completeCode: "SSH restringido a tu IP (/32) o rango (/24) | 0.0.0.0/0 solo para HTTP/HTTPS públicos",
    format: "bug-hunt",
    bugHunt: {
      prompt: "¿Qué vulnerabilidad contiene este security group?",
      snippet: `// Regla de entrada del security group de tu instancia web
SSH    TCP 22   0.0.0.0/0
HTTP   TCP 80   0.0.0.0/0`,
      options: [
        "El puerto SSH (22) está abierto a 0.0.0.0/0: cualquiera puede intentar entrar por fuerza bruta.",
        "Abrir HTTP (80) a 0.0.0.0/0 es un error grave porque expone la web.",
        "El puerto 22 no debería usar la sintaxis 0.0.0.0/0 nunca, ni siquiera para la web.",
        "No hay bug: la configuración es completamente segura.",
      ],
      correct: 0,
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── SSH (038: visión general, 039/040/041: práctica, 043: troubleshooting)
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 11,
    title: "Tres formas de entrar: SSH, Putty y EC2 Instance Connect",
    stars: 2,
    category: "SSH",
    description:
      "Linux/Mac y Windows 10+ usan SSH; Windows antiguos usan Putty; el navegador siempre con EC2 Instance Connect.",
    objective: "Elegir la herramienta según tu sistema operativo",
    tags: ["SSH", "Putty", "EC2 Instance Connect"],
    fileName: "ssh",
    completed: false,
    theory: `📚 TEORÍA: ¿Cómo me conecto a la instancia?

SSH es el protocolo para controlar una máquina remota por línea de
comandos. La herramienta depende de tu sistema:

  • **Linux o Mac** → cliente SSH nativo (comando ssh)
  • **Windows 10 o superior** → cliente SSH nativo (PowerShell/CMD)
  • **Windows anterior a 10** → **Putty** (programa gratuito)
  • **Cualquier sistema** → **EC2 Instance Connect**: conexión SSH
    desde el navegador, sin importar tu SO

EC2 Instance Connect es el plan B recomendado por el instructor: SSH y
Putty son los que más problemas dan a los estudiantes; basta con que te
funcione UNA de las opciones.`,
    explanationText:
      "🌍 Ejemplo cotidiano: varias puertas para entrar a tu casa: la principal (SSH), la ventana de emergencia (Putty para Windows viejos) y la puerta trasera que funciona siempre (EC2 Instance Connect).\n\nNo necesitas que te funcione todo: con que una vía te permita entrar, puedes hacer todas las acciones del curso. La certificación es teórica, así que no te bloquees con SSH.",
    codeSnippet: `# Elige la herramienta según tu sistema
# Linux o Mac     → cliente [INPUT_1] nativo
# Windows 10 o +  → cliente SSH nativo (sin Putty)
# Windows < 10    → [INPUT_2] (programa gratuito)
# Cualquier SO    → [INPUT_3] Instance Connect (desde el navegador)`,
    inputs: {
      INPUT_1: "SSH",
      INPUT_2: "Putty",
      INPUT_3: "EC2",
    },
    completeCode: "SSH (Linux/Mac/Win10+) | Putty (Win<10) | EC2 Instance Connect (navegador)",
  },

  {
    id: 12,
    title: "De la clave al prompt: conectar por SSH",
    stars: 2,
    category: "SSH",
    description:
      "El orden importa: crear la clave, proteger los permisos (chmod 400) y conectar con ssh -i.",
    objective: "Secuencia correcta de conexión SSH",
    tags: ["key pair", "chmod", "ssh -i"],
    fileName: "ec2-tutorial.pem",
    completed: false,
    theory: `📚 TEORÍA: Key pairs y permisos (039)

El key pair es criptografía de clave pública (RSA): hay una clave
pública (en AWS) y una **privada** (solo tuya, no se comparte).

Secuencia de conexión:
  1. Crear un key pair (RSA, formato .pem) al lanzar la instancia
  2. Descargar la clave privada y guardarla en un lugar seguro
  3. Protegerla: **chmod 400 ec2-tutorial.pem**
  4. Conectar: **ssh -i ec2-tutorial.pem ec2-user@IP**

Si no usas la clave (-i) → Permission denied.
Si los permisos están muy abiertos → 'UNPROTECTED PRIVATE KEY FILE'.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la clave es tu llave física y chmod 400 es el guarda que solo deja usarla a su dueño: si la llave queda 'abierta' (permisos 644), SSH se niega por seguridad.\n\nCualquiera que tenga la clave puede entrar a la instancia: por eso se protege con permisos 400 (solo lectura para el propietario) y nunca se comparte ni se sube a git.",
    codeSnippet: "// Ordena la secuencia de conexión SSH",
    inputs: {},
    completeCode: "Crear key pair (RSA .pem) → descargar → chmod 400 → ssh -i key.pem ec2-user@IP",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para conectar por SSH por primera vez.",
      steps: [
        { id: "keypair", label: "Crear un key pair (RSA, formato .pem) al lanzar la instancia" },
        { id: "download", label: "Descargar la clave privada y guardarla en un lugar seguro" },
        { id: "chmod", label: "Proteger la clave: chmod 400 ec2-tutorial.pem" },
        { id: "ssh", label: "Conectar: ssh -i ec2-tutorial.pem ec2-user@IP-pública" },
      ],
      correctOrder: ["keypair", "download", "chmod", "ssh"],
    },
  },

  {
    id: 13,
    title: "ssh -i: el comando de conexión en Linux y Mac",
    stars: 2,
    category: "SSH",
    description:
      "Completa el comando que conecta indicando la clave, el usuario ec2-user y la IP.",
    objective: "Escribir el comando ssh completo",
    tags: ["ssh -i", "ec2-user", "pem"],
    fileName: "ec2-tutorial.pem",
    completed: false,
    theory: `📚 TEORÍA: El comando ssh (039)

Sintaxis:
  ssh -i <clave.pem> <usuario>@<IP-pública>

  • **-i** indica qué clave privada usar
  • El usuario por defecto de Amazon Linux es **ec2-user**
    (en Ubuntu sería 'ubuntu')
  • La clave debe estar en el directorio actual o dar la ruta completa

Errores típicos del instructor:
  • Olvidar **-i** → Permission denied (publickey)
  • Permisos de la clave muy abiertos → 'UNPROTECTED PRIVATE KEY FILE'
  • Instancia terminada o sin el par de claves → timeout

Para salir de la sesión: **exit** o Ctrl + D.`,
    explanationText:
      "🌍 Ejemplo cotidiano: presentar tu carnet en la entrada: -i le dice a SSH qué llave usar, ec2-user es tu usuario y la IP la dirección del edificio. Sin el carnet (clave), el portero te niega la entrada.\n\nSin -i SSH intenta con las claves por defecto de tu máquina y falla con 'Permission denied'. El chmod 400 evita el error de clave desprotegida.",
    codeSnippet: `# Conectarte a una instancia Amazon Linux
# 1) Sitúate donde guardaste la clave
cd ~/tutorial

# 2) Protege los permisos de la clave
[INPUT_1] 400 ec2-tutorial.pem

# 3) Conecta indicando la clave, el usuario y la IP
ssh [INPUT_2] ec2-tutorial.pem [INPUT_3]@54.145.171.253`,
    inputs: {
      INPUT_1: "chmod",
      INPUT_2: "-i",
      INPUT_3: "ec2-user",
    },
    completeCode: "chmod 400 ec2-tutorial.pem | ssh -i ec2-tutorial.pem ec2-user@IP",
  },

  {
    id: 14,
    title: "SSH en Windows: .pem vs .ppk",
    stars: 2,
    category: "SSH",
    description:
      "Windows 10+ usa el cliente SSH nativo con .pem; Windows antiguos convierten a .ppk para Putty.",
    objective: "Saber cuándo usar .pem o .ppk",
    tags: ["Windows", "pem", "ppk", "Putty"],
    fileName: "ec2-tutorial.pem",
    completed: false,
    theory: `📚 TEORÍA: SSH en Windows (040 y 041)

  • **Windows 10 o superior** → SSH nativo en PowerShell/CMD con la
    clave en formato **.pem**, como en Mac/Linux.
  • **Windows anterior a 10** → **Putty** necesita la clave en formato
    **.ppk**: se convierte con **PuTTYgen** (Load private key → Save
    as .ppk). En Putty: host = ec2-user@IP y la clave en SSH → Auth.

En Windows 10+ no existe chmod: para proteger la clave se ajustan los
permisos en Propiedades → Seguridad (dejar solo tu usuario con control
total). Sin ese paso, SSH avisa que la clave está desprotegida.`,
    explanationText:
      "🌍 Ejemplo cotidiano: .pem es la llave universal y .ppk la adaptación que pide el portero (Putty) de los edificios antiguos de Windows. En Windows 10+ el SSH nativo ya entiende .pem directo.\n\nElegir el formato correcto evita el error más común: intentar cargar un .pem en Putty sin convertirlo, o buscar .ppk cuando tu Windows ya soporta SSH nativo con .pem.",
    codeSnippet: `# Windows 10 o superior → PowerShell/CMD, cliente SSH nativo
# Usa la clave en formato [INPUT_1]
ssh -i .\\ec2-tutorial.pem ec2-user@IP

# Windows anterior a 10 → usa [INPUT_2]
# 1) Convierte .pem a .ppk con [INPUT_3] (Load → Save as .ppk)
# 2) En Putty: host = [INPUT_4]@IP, carga la clave .ppk en SSH → Auth`,
    inputs: {
      INPUT_1: "pem",
      INPUT_2: "Putty",
      INPUT_3: "PuTTYgen",
      INPUT_4: "ec2-user",
    },
    completeCode: "Windows 10+ = .pem nativo | Windows <10 = Putty + .ppk (PuTTYgen)",
  },

  {
    id: 15,
    title: "Troubleshooting SSH: por qué no conectas",
    stars: 3,
    category: "SSH",
    description:
      "Timeout, Permission denied y 'clave desprotegida': cada error apunta a un culpable distinto.",
    objective: "Diagnosticar los errores clásicos de SSH",
    tags: ["troubleshooting", "SSH", "timeout", "chmod"],
    fileName: "ssh",
    completed: false,
    theory: `📚 TEORÍA: Diagnóstico de errores SSH (038 y 043)

  • **Timeout** al conectar → el security group no tiene el **puerto 22**
    abierto (o bloquea tu IP). En la práctica 043, sin la regla SSH el
    navegador se queda 'pensando' hasta agotar el tiempo.
  • **Permission denied (publickey)** → falta usar la clave con **-i**,
    o el usuario es incorrecto.
  • **UNPROTECTED PRIVATE KEY FILE** → los permisos de la clave están
    muy abiertos: ejecuta **chmod 400** (o ajusta en Windows).
  • **EC2 Instance Connect** → el plan B: conexión SSH desde el navegador
    sin depender de SSH/Putty ni de tu sistema operativo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el triaje de un hospital: el timeout es que no te dejan entrar al edificio (security group), el 'Permission denied' es que das un carnet equivocado (clave/usuario) y el 'UNPROTECTED' es que tu carnet está mal protegido (permisos).\n\nEl instructor lo dice claro: SSH y Putty son lo que más problemas da a los estudiantes. Si algo falla, revisa SG → clave → permisos y, si nada funciona, usa EC2 Instance Connect: basta con que una vía funcione.",
    codeSnippet: `$ ssh -i ec2-tutorial.pem ec2-user@54.145.171.253
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!    @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions for 'ec2-tutorial.pem' are too open.`,
    inputs: {},
    completeCode: "chmod 400 ec2-tutorial.pem | timeout = SG sin puerto 22 | fallback = EC2 Instance Connect",
    format: "prediction",
    prediction: {
      prompt: "¿Cuál es la causa de este error de SSH?",
      snippet: `$ ssh -i ec2-tutorial.pem ec2-user@54.145.171.253
@ WARNING: UNPROTECTED PRIVATE KEY FILE! @
Permissions for 'ec2-tutorial.pem' are too open.`,
      options: [
        "La clave tiene permisos demasiado abiertos: ejecuta chmod 400 ec2-tutorial.pem",
        "El security group no permite SSH en el puerto 22",
        "El usuario correcto es root, no ec2-user",
        "La instancia está terminada",
      ],
      answer: "La clave tiene permisos demasiado abiertos: ejecuta chmod 400 ec2-tutorial.pem",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── ROLES DE INSTANCIA (044) ────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 16,
    title: "Roles de instancia: credenciales sin escribirlas",
    stars: 3,
    category: "IAM",
    description:
      "Nunca ejecutes aws configure dentro de una instancia: asigna un rol IAM (Instance Profile).",
    objective: "Usar roles IAM en vez de credenciales estáticas",
    tags: ["IAM role", "instance profile", "credenciales"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: Roles de instancia (044)

Para que una instancia acceda a otros servicios (ej. IAM, S3) se asigna
un **rol IAM** a la instancia (el Instance Profile). AWS inyecta las
credenciales de forma automática y segura.

  • Con rol:  aws iam list-users  → devuelve los usuarios ✅
  • Sin rol:  aws iam list-users  → AccessDenied ❌

Reglas de oro del instructor:
  • **Nunca ejecutes aws configure dentro de la instancia** (menos aún
    desde EC2 Instance Connect): meterías tus claves de acceso en el
    navegador, al que otra gente puede tener acceso. Es muy peligroso.
  • El rol se asigna desde la consola: Actions → Security →
    Modify IAM role.
  • Los cambios de rol tardan unos segundos en aplicarse.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la tarjeta de empleado de la empresa en lugar de escribir tu contraseña en la pared de la oficina: el rol da credenciales temporales y revocables, mientras que aws configure deja secretos estáticos dentro de la máquina.\n\nCon un rol, AWS entrega credenciales temporales automáticamente y las rota por ti. Escribir claves a mano en la instancia es una mala práctica y un riesgo: cualquiera con acceso a la máquina (o al navegador) puede leerlas.",
    codeSnippet: `# Desde una instancia con rol asignado (sin aws configure):
aws [INPUT_1] list-users    # ✅ devuelve los usuarios

# Sin rol → AccessDenied.
# NUNCA uses aws [INPUT_2] dentro de la instancia:
# meterías tus claves de acceso en texto plano.

# Para asignar el rol: Actions → Security → Modify [INPUT_3]
# El rol de instancia se llama "Instance [INPUT_4]"`,
    inputs: {
      INPUT_1: "iam",
      INPUT_2: "configure",
      INPUT_3: "role",
      INPUT_4: "Profile",
    },
    completeCode: "aws iam list-users | rol = Instance Profile | nunca aws configure en la instancia",
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── OPCIONES DE COMPRA (045) ────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 17,
    title: "Opciones de compra: On-Demand, Reserved, Spot y más",
    stars: 3,
    category: "OPCIONES DE COMPRA",
    description:
      "Elegir el modelo de pago correcto según la carga de trabajo puede ahorrar hasta un 90%.",
    objective: "Diferenciar las opciones de compra de EC2",
    tags: ["on-demand", "reserved", "spot", "savings plans", "dedicated"],
    fileName: "purchase-options",
    completed: false,
    theory: `📚 TEORÍA: Opciones de compra de EC2 (045)

  • **On-Demand (bajo demanda)**: pago por segundo (Linux/Windows) sin
    pago por adelantado. Coste más alto. Ideal para cargas cortas e
    impredecibles.
  • **Reserved (instancias reservadas)**: compromiso de **1 o 3 años**,
    hasta un **72%** de descuento. Cargas constantes (ej. una BD).
    Las *convertibles* (~66%) permiten cambiar tipo, familia u OS.
  • **Savings Plans**: compromiso de uso (ej. 10$/h) por 1-3 años, hasta
    un 72%. Flexibles en tamaño y OS; ligados a familia y región.
  • **Spot**: hasta **90%** de descuento, pero **interrumpibles**: si el
    precio spot sube y supera tu máximo, pierdes la instancia. Para
    batch, análisis de datos, cargas tolerantes a fallos. NO para
    trabajos críticos ni bases de datos.
  • **Dedicated Host**: servidor físico completo, BYOL y cumplimiento
    normativo. La opción más cara.
  • **Capacity Reservations**: reservas de capacidad en una AZ concreta
    sin compromiso de tiempo; pagas la tarifa On-Demand aunque no uses
    la capacidad.`,
    explanationText:
      "🌍 Ejemplo cotidiano: AWS es un resort. On-Demand es pagar cada noche a precio completo; Reserved es reservar 3 meses con descuento; Savings Plans es pagar X por hora y elegir cualquier habitación; Spot es la subasta de habitaciones vacías (te pueden echar si llega un mejor postor); Dedicated Host es alquilar el edificio entero.\n\nRegla práctica: carga corta e impredecible → On-Demand; carga constante → Reserved/Savings Plans; trabajo interrumpible y barato → Spot; normativa/BYOL → Dedicated Host.",
    codeSnippet: "// Afirmaciones sobre las opciones de compra de EC2",
    inputs: {},
    completeCode: "On-Demand (corto) | Reserved 1-3a (constante) | Spot ~90% (interrumpible) | Dedicated Host (BYOL)",
    format: "true-false",
    trueFalse: {
      prompt: "Valida las opciones de compra de instancias EC2.",
      statements: [
        {
          id: "a",
          text: "Las instancias Reserved se comprometen a 1 o 3 años y pueden dar hasta un 72% de descuento frente a On-Demand.",
          answer: true,
          explanation: "Compromiso de 1 o 3 años a cambio de descuento; 3 años da el máximo.",
        },
        {
          id: "b",
          text: "Las instancias Spot son ideales para bases de datos críticas porque nunca se pierden.",
          answer: false,
          explanation: "Spot es interrumpible: si sube el precio, pierdes la instancia. No apta para datos críticos.",
        },
        {
          id: "c",
          text: "On-Demand se factura por segundo (Linux/Windows) sin pago por adelantado.",
          answer: true,
          explanation: "Es el modelo más caro, pero no requiere compromiso ni pago inicial.",
        },
        {
          id: "d",
          text: "Un Dedicated Host permite traer licencias propias (BYOL) y controlar la ubicación del servidor físico.",
          answer: true,
          explanation: "Reservas un servidor físico completo: cumple requisitos normativos y de licencias.",
        },
        {
          id: "e",
          text: "Una Capacity Reservation te descuenta en la factura aunque no ejecutes instancias.",
          answer: false,
          explanation: "Al revés: pagas la tarifa On-Demand aunque no uses la capacidad reservada.",
        },
        {
          id: "f",
          text: "Los Savings Plans son flexibles en tamaño de instancia y sistema operativo, pero están ligados a una familia y región.",
          answer: true,
          explanation: "Comprometes $/hora y ganas flexibilidad de tamaño y OS dentro de familia/región.",
        },
      ],
    },
  },
];
