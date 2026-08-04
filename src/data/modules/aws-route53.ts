import type { Exercise } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// AWS Route 53 — Fase 2: Datos y red (DVA-C02, sección 09 del temario)
// Fiel a los subtítulos de: 092 a 109 (Route 53)
// ──────────────────────────────────────────────────────────────────────────

export const AWS_ROUTE53_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ─── DNS (092) ──────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "DNS: la guía de contactos de Internet",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "DNS traduce los nombres de host amigables (www.google.com) a direcciones IP de servidores (172.217.18.36). Es la columna vertebral de Internet.",
    objective: "Entender la terminología y la jerarquía de nombres de dominio",
    tags: ["DNS", "jerarquía", "TLD", "subdominio"],
    fileName: "dns",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué es un DNS? (092)

DNS (Domain Name System) se puede describir como un sistema de nombres de
dominio: **traduce los nombres de host amigables para los humanos en las
direcciones IP del servidor de destino**. Por eso se le llama la columna
vertebral de Internet.

Terminología que debes dominar:
  • **Registrador de dominios**: donde compras el dominio (Amazon Route 53,
    GoDaddy, etc.)
  • **Registro DNS**: tipos como A, AAAA, CNAME, NS...
  • **Archivo de zona**: contiene todos los registros DNS y es como se
    hacen coincidir los nombres de host con las IPs.
  • **Servidores de nombres (NS)**: los servidores que resuelven las
    consultas DNS.
  • **TLD** (dominio de primer nivel): .com, .us, .org...
  • **Dominio de segundo nivel**: amazon.com, google.com.

En la URL https://www.example.com:
  • el **punto final** es la raíz de todos los nombres de dominio
  • **.com** es el dominio de primer nivel (TLD)
  • **example.com** es el dominio de segundo nivel
  • **www.example.com** es un subdominio
  • **https** es el protocolo de acceso`,
    explanationText:
      "🌍 Ejemplo cotidiano: DNS es la agenda de contactos de tu móvil: no memorizas números de teléfono (IPs), buscas por nombre y la agenda te da el número exacto.\n\nCuando escribes una URL, tu navegador no sabe llegar: necesita la IP. DNS hace esa conversión con una estructura jerárquica de nombres (raíz → TLD → dominio → subdominio). En el examen te preguntan si sabes leer una URL y distinguir registrador, TLD y subdominio: son las piezas básicas de toda la sección.",
    codeSnippet: `// El DNS traduce nombres de [INPUT_1] amigables
// (ej. www.google.com) a direcciones [INPUT_2]
// de los servidores de destino (ej. 172.217.18.36).

// En la URL https://www.example.com:
//   • https  → protocolo de acceso
//   • (.)    → la raíz de todos los nombres de dominio
//   • .com   → dominio de primer nivel ([INPUT_3])
//   • example.com → dominio de [INPUT_4] (ej. google.com)
//   • www.example.com → [INPUT_5] de example.com`,
    inputs: {
      INPUT_1: "host",
      INPUT_2: "IP",
      INPUT_3: "TLD",
      INPUT_4: "segundo nivel",
      INPUT_5: "subdominio",
    },
    completeCode:
      "host → IP | raíz | .com = TLD | example.com = 2º nivel | www.example.com = subdominio",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa la terminología de DNS y la jerarquía de una URL.",
      options: {
        INPUT_1: ["host", "archivo", "puerto", "protocolo"],
        INPUT_2: ["IP", "dominios", "URLs", "cookies"],
        INPUT_3: ["TLD", "subdominio", "zona", "caché"],
        INPUT_4: ["segundo nivel", "primer nivel", "tercer nivel", "nivel raíz"],
        INPUT_5: ["subdominio", "TLD", "registro NS", "archivo de zona"],
      },
    },
  },

  {
    id: 2,
    title: "Tipos de registro: A, AAAA, CNAME, MX, TXT, NS",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "Cada registro DNS tiene un tipo que define cómo se enruta el tráfico: A va a una IP v4, AAAA a una IP v6, CNAME a otro host...",
    objective: "Asociar cada tipo de registro a su función",
    tags: ["registros DNS", "A", "CNAME", "NS"],
    fileName: "record-types",
    completed: false,
    theory: `📚 TEORÍA: Tipos de registro (093)

Un registro define cómo enrutar el tráfico a un dominio o subdominio, y
cada uno contiene: nombre, tipo, valor, política de enrutamiento y TTL.

Los tipos obligatorios que soporta Route 53:
  • **A** → asigna un nombre de host a una **IP versión 4**
  • **AAAA** → asigna un nombre de host a una **IP versión 6**
  • **CNAME** → asigna un nombre de host a **otro nombre de host**
    (no se puede crear un CNAME para el nodo superior de un espacio de
    nombres DNS: sí para www.example.com, no para example.com)
  • **NS** → servidores de nombres de la zona alojada: controla cómo se
    enruta el tráfico del dominio

Junto a estos, en DNS también aparecen:
  • **MX** → servidores de correo del dominio
  • **TXT** → texto arbitrario (verificaciones, SPF...)`,
    explanationText:
      "🌍 Ejemplo cotidiano: los tipos de registro son como tipos de ficha en la agenda: la A guarda la dirección del piso (IP v4), la AAAA la del ático con otra numeración (IP v6), la CNAME es la tarjeta que dice 'este buzón se redirige a esta otra oficina' y la NS es la lista de porteros autorizados.\n\nAprender qué devuelve cada tipo te evita fallos clásicos del examen: intentar un CNAME sobre el dominio raíz (no se permite) o poner una IP v6 donde toca un AAAA. El NS es especial: es el registro que delega la autoridad de tu zona.",
    codeSnippet: `// Elige el tipo de registro correcto para cada caso:
//   • [INPUT_1] → nombre de host → IP versión 4
//   • [INPUT_2] → nombre de host → IP versión 6
//   • [INPUT_3] → nombre de host → OTRO nombre de host
//   • [INPUT_4] → servidores de nombres de la zona (obligatorio)
//   • [INPUT_5] → servidores de correo del dominio
//   • [INPUT_6] → texto arbitrario (verificaciones, SPF)`,
    inputs: {
      INPUT_1: "A",
      INPUT_2: "AAAA",
      INPUT_3: "CNAME",
      INPUT_4: "NS",
      INPUT_5: "MX",
      INPUT_6: "TXT",
    },
    completeCode: "A → IP v4 | AAAA → IP v6 | CNAME → otro host | NS → nameservers | MX → correo | TXT → texto",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Asocia cada tipo de registro DNS a su función.",
      options: {
        INPUT_1: ["A", "CNAME", "MX", "NS"],
        INPUT_2: ["AAAA", "A", "CNAME", "TXT"],
        INPUT_3: ["CNAME", "A", "NS", "MX"],
        INPUT_4: ["NS", "A", "SOA", "TXT"],
        INPUT_5: ["MX", "NS", "AAAA", "SOA"],
        INPUT_6: ["TXT", "MX", "A", "CNAME"],
      },
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── VISIÓN GENERAL DE ROUTE 53 (093) ────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 3,
    title: "Route 53: el DNS gestionado y global de AWS",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "El DNS gestionado de AWS: global, autoritativo y con un SLA del 100%. Además, también es registrador de dominios.",
    objective: "Reconocer las características clave de Route 53",
    tags: ["Route 53", "DNS gestionado", "registrador", "SLA 100%"],
    fileName: "route53",
    completed: false,
    theory: `📚 TEORÍA: Visión general de Route 53 (093)

Route 53 es un **servicio DNS altamente disponible, escalable y
completamente gestionado** por AWS. Es **autoritativo**: tú puedes
actualizar los registros DNS siempre que quieras, tienes toda la autoridad
para cambiarlos como desees.

También es un **registrador de dominios**: puedes registrar tu dominio
directamente en AWS, sin necesidad de GoDaddy, WordPress u otros.

Además:
  • Puede **comprobar la salud** de los recursos a los que apunta.
  • Cada registro contiene: nombre de dominio/subdominio, tipo, valor,
    política de enrutamiento y TTL.
  • **TTL** (Time To Live) es la cantidad de tiempo que el registro se
    almacena en caché en los resolvers de DNS.
  • Es el **único servicio de AWS con un SLA del 100%**.
  • El nombre viene del **puerto 53**, el puerto tradicional de DNS.
  • No tiene regiones: es un servicio **global**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Route 53 es como una centralita telefónica global gestionada por AWS: una sola agenda de contactos (DNS) accesible desde todo el mundo, sin fronteras de región, y con el 100% de disponibilidad.\n\n'Autoritativo' significa que tú decides qué registros devuelve: si cambias la IP, el mundo entero acabará viendo la nueva respuesta. Que sea gestionado te quita la infraestructura de encima, y que sea global (sin elegir región) es clave: el DNS debe responder en todo el planeta, no en una zona concreta.",
    codeSnippet: "// Afirmaciones sobre el servicio Route 53",
    inputs: {},
    completeCode: "DNS gestionado + autoritativo + registrador + health checks + SLA 100% + global (puerto 53)",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de Route 53.",
      statements: [
        {
          id: "a",
          text: "Route 53 es un servicio DNS altamente disponible, escalable y completamente gestionado por AWS.",
          answer: true,
          explanation: "Es la definición del servicio: AWS gestiona toda la infraestructura DNS.",
        },
        {
          id: "b",
          text: "Se dice que Route 53 es 'autoritativo' porque puedes actualizar tus registros DNS siempre que quieras.",
          answer: true,
          explanation: "Tienes toda la autoridad para cambiar los registros como desees.",
        },
        {
          id: "c",
          text: "Route 53 solo es un servicio de DNS: no puedes registrar dominios en AWS.",
          answer: false,
          explanation: "Route 53 también es un registrador de dominios: puedes comprar el dominio directamente en AWS.",
        },
        {
          id: "d",
          text: "El nombre 'Route 53' hace referencia al puerto 53, el puerto tradicional del protocolo DNS.",
          answer: true,
          explanation: "El 53 es la referencia al puerto DNS, de ahí el nombre del servicio.",
        },
        {
          id: "e",
          text: "Route 53 es un servicio regional: hay que elegir una región concreta para usarlo.",
          answer: false,
          explanation: "Route 53 es global, como debe ser el DNS: no se define en una región.",
        },
        {
          id: "f",
          text: "Route 53 es el único servicio de AWS que ofrece un SLA de disponibilidad del 100%.",
          answer: true,
          explanation: "Lo destaca el instructor: SLA del 100%, único entre los servicios de AWS.",
        },
      ],
    },
  },

  {
    id: 4,
    title: "El viaje de una consulta DNS",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "Sin IP no hay conexión: el navegador pide ayuda a su DNS local, que escala del servidor raíz (ICANN) al TLD (IANA) y por fin llega al autoritativo de tu registrador.",
    objective: "Reconstruir el flujo de resolución de una consulta DNS",
    tags: ["resolución DNS", "servidor raíz", "TLD", "autoritativo"],
    fileName: "dns-resolution",
    completed: false,
    theory: `📚 TEORÍA: Cómo funciona DNS (092)

Cuando el navegador quiere acceder a example.com:
  1. El navegador pide la IP a su **servidor DNS local** (lo gestiona tu
     empresa o tu proveedor de Internet).
  2. Si el DNS local nunca ha visto esa consulta, pregunta al **servidor
     raíz**, gestionado por la **ICANN**. El servidor raíz responde
     'no lo sé, pero conozco el .com: pregúntale a esta dirección' (NS).
  3. El DNS local pregunta al **servidor TLD** (.com), controlado por la
     **IANA**, que responde 'no lo sé, pero el servidor de example.com
     está en esta dirección'.
  4. El DNS local pregunta al **servidor autoritativo del dominio**
     (administrado por el registrador: Amazon Route 53, GoDaddy...), que
     devuelve la IP real: 9.10.11.12.
  5. El DNS local guarda la respuesta en **caché** y la devuelve al
     navegador, que ya se comunica directamente con el servidor.`,
    explanationText:
      "🌍 Ejemplo cotidiano: pedir indicaciones en un aeropuerto gigante: primero preguntas en información central (raíz), te envían a la sala de salidas (TLD) y allí al mostrador de tu aerolínea (autoritativo), que te da la puerta exacta (IP). La primera vez es un viaje; luego guardas la ruta en la memoria (caché).\n\nEl DNS local va de 'menos específico' a 'más específico': raíz → TLD → autoritativo. La caché evita repetir el viaje en cada visita, y por eso los cambios en tus registros no son instantáneos para todo el mundo: dependen del TTL.",
    codeSnippet: "// Ordena el viaje de una consulta DNS",
    inputs: {},
    completeCode: "DNS local → raíz (ICANN) → TLD (IANA) → autoritativo (registrador) → IP → caché",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para resolver la IP de example.com.",
      steps: [
        { id: "local", label: "El navegador pide a su servidor DNS local la IP de example.com" },
        { id: "root", label: "El DNS local pregunta al servidor raíz (gestionado por ICANN), que le da una pista: pregunta al TLD .com" },
        { id: "tld", label: "El DNS local pregunta al servidor TLD (.com, gestionado por IANA), que le indica el servidor de example.com" },
        { id: "auth", label: "El DNS local pregunta al servidor autoritativo (ej. Route 53 o GoDaddy), que devuelve la IP 9.10.11.12" },
        { id: "cache", label: "El DNS local devuelve la IP al navegador y guarda la respuesta en caché para no repetir el viaje" },
      ],
      correctOrder: ["local", "root", "tld", "auth", "cache"],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── REGISTRO DE DOMINIO Y ZONAS ALOJADAS (094, 095, 093) ───────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 5,
    title: "De la compra del dominio a tus primeros registros",
    stars: 2,
    category: "PRÁCTICA",
    description:
      "Comprar un dominio en Route 53 (unos 13 $/año para .com), verificar el email del titular y esperar a que la zona alojada cree sus registros NS y SOA.",
    objective: "Reconstruir el flujo de registro de un dominio",
    tags: ["registro de dominio", "hosted zone", "NS", "verificación"],
    fileName: "domain",
    completed: false,
    theory: `📚 TEORÍA: Registrar un dominio (094)

En Route 53 puedes comprar tu dominio (el instructor compra
**jamengual.com**). El precio del .com es de unos **13 $ al año** y varía
según el TLD (ej. .academy vale 12 $).

El flujo:
  1. Comprobar que el nombre está **disponible** (si ya existe, error).
  2. Añadirlo al carrito y elegir los **años** de registro.
  3. Introducir los **datos del titular**.
  4. Finalizar el pedido y **verificar el email** del titular (puede
     tardar de **minutos a 3 días**).
  5. En 'zonas alojadas' aparece tu dominio con los registros **NS y SOA**:
     los name servers que redireccionan todo el tráfico hacia tu dominio.
  6. Ya puedes **crear tus propios registros** (ej. A → IP de una
     instancia) dentro de esa zona.

Nota (109): si compras el dominio en un tercero (GoDaddy, WordPress),
puedes seguir gestionándolo con Route 53: creas una zona alojada en AWS y
actualizas los **name servers (NS)** en el sitio del tercero con los de
Route 53. No confundas registrador de dominios con servicio de DNS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: comprar un dominio es como conseguir una dirección de local: primero compruebas que nadie la tiene registrada, pagas el alquiler anual (registrador) y luego pones tu letrero (registros DNS) para que la gente te encuentre.\n\nLa zona alojada nace sola con NS y SOA: son los 'porteros' que dirigen el tráfico hacia tu dominio. Y recuerda la trampa de examen: registrador (quién te vende la dirección) ≠ servicio de DNS (quién gestiona los letreros). Puedes comprar en GoDaddy y gestionar en Route 53 cambiando solo los NS.",
    codeSnippet: "// Ordena el flujo para registrar un dominio en Route 53",
    inputs: {},
    completeCode: "disponibilidad → carrito (13$/año) → titular → verificar email (minutos a 3 días) → zona alojada con NS/SOA → crear registros",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para registrar un dominio y tener tu primera zona alojada.",
      steps: [
        { id: "search", label: "Comprobar que el nombre está disponible (si no, Route 53 muestra un error)" },
        { id: "cart", label: "Añadirlo al carrito y elegir los años de registro (ej. 1 año, ~13 $ para .com)" },
        { id: "owner", label: "Introducir los datos del titular y finalizar el pedido" },
        { id: "email", label: "Verificar el email del titular (puede tardar de minutos a 3 días)" },
        { id: "zone", label: "Ver en 'zonas alojadas' el dominio con sus registros NS y SOA" },
        { id: "records", label: "Crear tus propios registros (ej. A → IP de tu instancia) dentro de la zona" },
      ],
      correctOrder: ["search", "cart", "owner", "email", "zone", "records"],
    },
  },

  {
    id: 6,
    title: "Zonas alojadas: públicas y privadas",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "La zona alojada es el contenedor de tus registros. Las públicas resuelven desde Internet; las privadas resuelven nombres internos dentro de tu VPC.",
    objective: "Distinguir zona alojada pública de privada",
    tags: ["hosted zone", "pública", "privada", "VPC"],
    fileName: "hosted-zone",
    completed: false,
    theory: `📚 TEORÍA: Zonas alojadas (093)

Una **zona alojada** es un contenedor para los registros que definen cómo
dirigir el tráfico a un dominio o sus subdominios.

  • **Zonas públicas**: contienen registros que especifican cómo enrutar
    el tráfico en **Internet** (ej. application1.mypublicdomain.com).
  • **Zonas privadas**: contienen registros para enrutar el tráfico
    **dentro de una o más VPCs** (ej. application1.company.internal), de
    forma que las instancias se encuentren entre sí con nombres internos.

Costes que destaca el instructor:
  • **0,50 $ al mes** por zona alojada.
  • **~12 $ al año** por registrar un nombre de dominio.
  La sección no es gratuita.

Además, los health checkers de Route 53 están **fuera de la VPC**: no
pueden acceder directamente a endpoints privados. Para monitorizar un
recurso privado se crea una **alarma de CloudWatch** y el health check
comprueba la alarma.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la zona pública es el letrero de la tienda visible desde la calle (Internet); la privada es el cartel del pasillo interior del centro comercial (VPC) que solo leen los locales del edificio.\n\nEl criterio de examen: público = se resuelve desde Internet; privado = solo dentro de la VPC (sufijo .internal). Y un matiz importante: los health checkers no entran en la VPC, así que para recursos privados monitorizas una alarma de CloudWatch, no el endpoint directamente.",
    codeSnippet: "// Afirmaciones sobre las zonas alojadas",
    inputs: {},
    completeCode: "pública = Internet (example.com) | privada = dentro de VPC (example.internal) | 0,50$/mes zona + ~12$/año dominio",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de las zonas alojadas.",
      statements: [
        {
          id: "a",
          text: "Una zona alojada es un contenedor de registros que define cómo dirigir el tráfico a un dominio y sus subdominios.",
          answer: true,
          explanation: "Es la definición: los registros viven dentro de la zona.",
        },
        {
          id: "b",
          text: "Las zonas alojadas públicas enrutan el tráfico dentro de una VPC con nombres como application1.company.internal.",
          answer: false,
          explanation: "Eso son las zonas privadas. Las públicas enrutan el tráfico desde Internet.",
        },
        {
          id: "c",
          text: "Una zona privada permite que las instancias de tu VPC se encuentren entre sí con nombres internos como api.company.internal.",
          answer: true,
          explanation: "Es su función: direccionamiento interno dentro de la VPC.",
        },
        {
          id: "d",
          text: "Una zona alojada cuesta 0,50 $ al mes y registrar un dominio unos 12 $ al año.",
          answer: true,
          explanation: "El instructor lo dice claro: la sección no es gratuita.",
        },
        {
          id: "e",
          text: "Los health checkers de Route 53 pueden acceder directamente a endpoints privados dentro de una VPC.",
          answer: false,
          explanation: "Están fuera de la VPC: para recursos privados se usa una alarma de CloudWatch.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── PRIMEROS REGISTROS (095) ────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 7,
    title: "Crear registros y comprobarlos con dig",
    stars: 2,
    category: "PRÁCTICA",
    description:
      "Creas un registro A (test.jamengual.com → 11.22.33.44) y lo verificas con nslookup o dig, que además muestra TTL y tipo de registro.",
    objective: "Predecir qué devuelve dig al consultar un registro recién creado",
    tags: ["dig", "nslookup", "registro A"],
    fileName: "dig",
    completed: false,
    theory: `📚 TEORÍA: Crear un registro (095)

Para crear un registro en tu zona alojada:
  • **Nombre**: es el subdominio (ej. test → test.jamengual.com).
  • **Tipo**: A (dirige a una IP versión 4), AAAA, CNAME...
  • **Valor**: la IP a la que apunta (ej. 11.22.33.44).
  • **TTL**: se deja por defecto en 300 segundos.
  • **Política de enrutamiento**: por defecto 'simple'.

Para comprobar el registro desde la terminal:
  • **nslookup** (Windows) o **dig** (Mac/Linux): en CloudShell hay que
    instalarlos con \`sudo yum install bind-utils\`.
  • \`dig\` da más información que nslookup: el **TTL**, el **tipo de
    registro** (A) y la **IP** del servidor.

En la práctica, \`dig test.jamengual.com\` devuelve: el nombre del
registro, su tipo A y la dirección 11.22.33.44 que se había asignado.`,
    explanationText:
      "🌍 Ejemplo cotidiano: dig es el detective que pregunta por ti: no solo te dice a qué IP apunta el registro, sino la ficha completa (tipo y cuánto tiempo vivirá en caché).\n\ndig te da el TTL (tiempo de vida en caché), el tipo de registro y la IP: exactamente lo que necesitas para diagnosticar por qué una web 'aún no se ve'. Si la IP que devuelve no es la que cambiaste, el problema suele estar en la caché (TTL), no en el registro.",
    codeSnippet: `// Creas el registro: test.jamengual.com, tipo A, valor 11.22.33.44
// y luego consultas desde la terminal:

$ dig test.jamengual.com

// ¿Qué información devuelve la respuesta?`,
    inputs: {},
    completeCode: "dig → nombre del registro + tipo A + IP (11.22.33.44) + TTL | nslookup → solo nombre + IP",
    format: "prediction",
    prediction: {
      prompt: "¿Qué devuelve el comando dig para el registro que acabas de crear?",
      snippet: `$ dig test.jamengual.com

;; ANSWER SECTION:
test.jamengual.com. 300 IN A 11.22.33.44`,
      options: [
        "El nombre del registro, su tipo (A) y la IP 11.22.33.44 que asignaste, además del TTL",
        "Solo la IP pública de la instancia EC2, sin tipo ni TTL",
        "Un error porque el dominio no existe todavía",
        "El contenido HTML de la página web alojada en esa IP",
      ],
      answer: "El nombre del registro, su tipo (A) y la IP 11.22.33.44 que asignaste, además del TTL",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── TTL (097) ──────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 8,
    title: "TTL: cuánto vive un registro en la caché",
    stars: 3,
    category: "CONCEPTOS",
    description:
      "El TTL (Time To Live) es el tiempo que una respuesta queda en la caché del cliente. Cambias un registro y el mundo no lo ve hasta que expira.",
    objective: "Predecir cuándo se propaga un cambio de registro según el TTL",
    tags: ["TTL", "caché", "resolver"],
    fileName: "ttl",
    completed: false,
    theory: `📚 TEORÍA: TTL (097)

El **TTL (Time To Live)** es un valor numérico que acompaña a cada
respuesta DNS y que **se guarda en la caché del cliente**: es el tiempo
que esa dirección permanecerá en la caché antes de volver a consultarse.
Si el TTL es 120, representa 120 segundos: cada segundo se descuenta y al
llegar a cero la caché debe actualizarse.

La elección del TTL es un equilibrio:
  • **TTL alto** (ej. 24 horas): **menos tráfico y coste** en Route 53
    (los clientes no vuelven a preguntar), pero los registros pueden
    quedar **obsoletos** durante más tiempo.
  • **TTL bajo** (ej. 60 segundos): **más tráfico y coste** en Route 53,
    pero los cambios se propagan **más rápido** y los registros están
    desfasados menos tiempo.

En la práctica: el instructor cambia el valor del registro de la instancia
de Europa a Asia y, aunque guarda el cambio, el navegador sigue mostrando
Europa hasta que el TTL de 120 segundos llega a cero y la caché se
actualiza. El TTL es **obligatorio para cada registro DNS**, excepto en
los registros alias.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el TTL es la nota pegada en la puerta de la oficina: 'esta dirección es válida hasta las 10:00'. Hasta esa hora, ni los clientes ni tú la revisáis; a las 10:00 alguien se asoma y comprueba si cambió.\n\nCambias un registro y los clientes no lo ven al instante: siguen con la copia en caché hasta que expira el TTL. Por eso, para cambiar de servidor rápido se usa un TTL corto (más queries y coste), y para ahorrar se usa un TTL largo (a costa de propagar tarde los cambios). Es una de las preguntas favoritas del examen.",
    codeSnippet: `// Editas el registro demo.jamengual.com y cambias su valor:
//   Europa  →  Asia
// El TTL del registro es de 120 segundos.

// ¿Cuándo verán los clientes la nueva dirección?`,
    inputs: {},
    completeCode: "TTL alto (24h) = menos coste pero registros obsoletos | TTL bajo (60s) = más coste pero cambios rápidos",
    format: "prediction",
    prediction: {
      prompt: "Acabas de cambiar el valor del registro a Asia. ¿Cuándo lo verán los clientes?",
      snippet: `// demo.jamengual.com  A  →  valor: IP de Europa
// Cambias el valor a: IP de Asia
// TTL del registro: 120 segundos`,
      options: [
        "Al instante, porque el cambio ya está guardado en Route 53",
        "Cuando expire el TTL (~120 segundos): hasta entonces usan la copia en caché con la IP de Europa",
        "Nunca: cambiar un registro no tiene efecto con Route 53",
        "Solo después de reiniciar la instancia de destino",
      ],
      answer: "Cuando expire el TTL (~120 segundos): hasta entonces usan la copia en caché con la IP de Europa",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── CNAME vs ALIAS (098) ────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 9,
    title: "CNAME vs Alias: apuntar a recursos AWS",
    stars: 3,
    category: "CONCEPTOS",
    description:
      "El Alias es nativo de AWS, gratis, detecta cambios de IP automáticamente y funciona para el dominio raíz. El CNAME no: es para cualquier host salvo el raíz.",
    objective: "Elegir Alias para recursos AWS y entender por qué CNAME falla en la zona apex",
    tags: ["CNAME", "Alias", "zona apex", "ALB"],
    fileName: "cname-alias",
    completed: false,
    theory: `📚 TEORÍA: CNAME vs Alias (098)

Recursos como un **Application Load Balancer** o **CloudFront** exponen un
nombre de host de AWS (ej. mylb-1234567890.elb.amazonaws.com). Para tener
algo amigable (ej. app.midominio.com) usamos CNAME o Alias.

**CNAME**:
  • Apunta un nombre de host a **cualquier otro nombre de host**.
  • Solo para dominios **no raíz**: necesita estructura tipo
    algo.midominio.com; no puede ser el nodo superior (la **zona apex**,
    ej. midominio.com). Crearlo para el raíz da **error**.

**Alias**:
  • Apunta un nombre de host a un **recurso interno de AWS** (S3,
    CloudFront, ALB, API Gateway, Elastic Beanstalk, VPC Endpoint,
    Global Accelerator, o un registro de la misma zona...).
  • Funciona para **dominio raíz y no raíz**.
  • Es **gratis** (por muchas llamadas que se hagan) y tiene la
    **comprobación de salud nativa** de los servicios.
  • **Reconoce automáticamente los cambios en las direcciones IP** del
    recurso.
  • Siempre es de tipo **A o AAAA** y **no se puede establecer un TTL**.
  • No se puede apuntar un Alias a un nombre DNS de EC2.`,
    explanationText:
      "🌍 Ejemplo cotidiano: CNAME es la nota 'cambiar de casa: me encontraréis en esta otra dirección' (solo en buzones que no son el principal); Alias es el empleado de la empresa que siempre conoce la última oficina del departamento, sin que tú actualices nada.\n\nEl Alias es el 'DNS inteligente de AWS': gratis, sigue los cambios de IP del recurso solo y sirve para la zona apex (raíz), donde el CNAME está prohibido. Es una frase de examen: si apuntas a un recurso AWS, usa Alias; si apuntas a un dominio externo, CNAME.",
    codeSnippet: `// Intentas crear un registro para el dominio raíz (sin subdominio):
//   Nombre:  (en blanco)  →  jamengual.com
//   Tipo:    CNAME
//   Valor:   mylb-1234567890.elb.amazonaws.com
// Al pulsar crear, Route 53 muestra: "error, no se permite".`,
    inputs: {},
    completeCode: "CNAME: no raíz, cualquier host | Alias: raíz y no raíz, recursos AWS, gratis, detecta IP, sin TTL",
    format: "prediction",
    prediction: {
      prompt: "¿Por qué Route 53 rechaza este registro CNAME para el dominio raíz?",
      snippet: `// Nombre: (en blanco) → jamengual.com
// Tipo: CNAME
// Valor: mylb-1234567890.elb.amazonaws.com`,
      options: [
        "Un CNAME no se puede crear para el nodo superior de un espacio de nombres (la zona apex): solo para subdominios",
        "El valor es incorrecto porque los CNAME solo aceptan IPs, no nombres de host",
        "El registro falla porque jamengual.com ya tiene un registro NS en esa zona",
        "El CNAME sí es válido; el error es un fallo temporal de la consola",
      ],
      answer: "Un CNAME no se puede crear para el nodo superior de un espacio de nombres (la zona apex): solo para subdominios",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── POLÍTICAS DE ENRUTAMIENTO (099 a 108) ──────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 10,
    title: "Política Simple: uno o varios valores al azar",
    stars: 2,
    category: "POLÍTICAS",
    description:
      "La política Simple dirige el tráfico a un solo recurso. Con varios valores en el mismo registro, el cliente elige uno al azar. Sin health checks.",
    objective: "Predecir el comportamiento de la política Simple con varios valores",
    tags: ["Simple", "routing policy", "valor múltiple"],
    fileName: "routing-simple",
    completed: false,
    theory: `📚 TEORÍA: Política Simple (099)

Las políticas de enrutamiento definen **cómo responde Route 53 a las
consultas de DNS**. Ojo: no enrutan tráfico real, solo responden consultas
DNS.

La política **simple** normalmente dirige el tráfico a **un solo recurso**
(valor único). Pero también puede especificar **varios valores en el mismo
registro**: en ese caso, Route 53 devuelve varias direcciones y **el
cliente elige una al azar**.

Limitaciones clave:
  • **No se puede asociar a health checks** (controles de salud).
  • Si se habilita un **alias**, solo se puede especificar **un recurso**.

En la práctica: el instructor crea un registro simple con dos valores (la
IP de Asia y la de EE.UU.) y \`dig\` devuelve los dos registros; el cliente
elige al azar.`,
    explanationText:
      "🌍 Ejemplo cotidiano: simple es el mostrador único de información: normalmente solo tiene una respuesta, pero si en el mismo folleto hay varias direcciones, te da el folleto entero y tú eliges una.\n\nRoute 53 no elige por ti: devuelve todos los valores y el cliente decide al azar. Y el matiz que cae en examen: al no tener health checks, si una de las direcciones está caída, sigue apareciendo en la lista. Para elegir solo direcciones sanas necesitas la política multivalor.",
    codeSnippet: `// Registro A simple con DOS valores en el mismo registro:
//   simple.jamengual.com → 54.145.171.253 (EE.UU.)
//   simple.jamengual.com → 18.140.15.27    (Singapur)

// Consultas con dig... ¿qué devuelve Route 53?`,
    inputs: {},
    completeCode: "Simple = un recurso (o varios valores al azar) | sin health checks | con alias solo 1 recurso",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hace Route 53 con esta política Simple de dos valores?",
      snippet: `// simple.jamengual.com  A  →  54.145.171.253
// simple.jamengual.com  A  →  18.140.15.27`,
      options: [
        "Devuelve los dos valores y el cliente elige uno al azar",
        "Devuelve siempre el primer valor y descarta el segundo",
        "Devuelve un error porque una política simple solo admite un valor",
        "Alterna los valores uno a uno según el orden de llegada",
      ],
      answer: "Devuelve los dos valores y el cliente elige uno al azar",
    },
  },

  {
    id: 11,
    title: "Política Ponderada: pesos para A/B testing",
    stars: 3,
    category: "POLÍTICAS",
    description:
      "La política Ponderada controla el porcentaje de solicitudes que va a cada recurso: ideal para A/B testing y para frenar una versión con peso 0.",
    objective: "Calcular el reparto de tráfico con pesos y entender el peso 0",
    tags: ["Ponderada", "pesos", "A/B testing"],
    fileName: "routing-weighted",
    completed: false,
    theory: `📚 TEORÍA: Política Ponderada (100)

La política **ponderada** controla el **porcentaje de solicitudes** que van
a cada recurso específico. A cada registro se le asigna un **peso** y el
porcentaje se calcula con la fórmula:

  % de tráfico = peso del registro / suma de todos los pesos

Reglas:
  • Los registros deben tener el **mismo nombre y tipo**.
  • Se pueden asociar a health checks.
  • **No es necesario que los pesos sumen 100**: lo que importa es la
    proporción relativa.
  • Si un registro tiene **peso 0**, deja de recibir tráfico (ideal para
    'apagar' una versión sin borrarla).
  • Si **todos** tienen peso 0, se devuelven todos los registros por igual.

Caso de uso estrella: **A/B testing** (probar una nueva versión con un %
pequeño) y **equilibrar la carga entre regiones**. El TTL recomendado en
producción es de 60 segundos a 2 días (el instructor usa 3 segundos solo
para la demo).`,
    explanationText:
      "🌍 Ejemplo cotidiano: la ruleta de premios con sectores de distinto tamaño: el 70% de los lanzamientos cae en el sector grande, el 20% en el mediano y el 10% en el pequeño.\n\nSi tienes pesos 70/20/10, el reparto es 70/20/10 aunque la suma no sea 100. Poner un peso 0 es como cerrar un sector de la ruleta: nadie cae ahí, sin borrar la ficha. Por eso es la política de referencia para lanzar versiones nuevas poco a poco.",
    codeSnippet: `// Tres registros A con el MISMO nombre y tipo:
//   weighted.jamengual.com  A  →  Asia (peso 10)
//   weighted.jamengual.com  A  →  EE.UU. (peso 70)
//   weighted.jamengual.com  A  →  Europa (peso 20)

// ¿Qué porcentaje de las solicitudes recibe EE.UU.?`,
    inputs: {},
    completeCode: "% = peso / suma de pesos | mismo nombre y tipo | peso 0 = sin tráfico | todos 0 = reparto igual | A/B testing",
    format: "prediction",
    prediction: {
      prompt: "Con los pesos 10/70/20, ¿qué porcentaje de solicitudes recibe la instancia de EE.UU.?",
      snippet: `// weighted.jamengual.com  A  Asia   (peso 10)
// weighted.jamengual.com  A  EE.UU. (peso 70)
// weighted.jamengual.com  A  Europa (peso 20)`,
      options: [
        "70% de las solicitudes",
        "El 33% por igual, porque hay tres registros",
        "El 50%, porque es el peso máximo posible",
        "El 10%, porque Asia tiene el peso menor",
      ],
      answer: "70% de las solicitudes",
    },
  },

  {
    id: 12,
    title: "Política de Latencia: el recurso más cercano",
    stars: 3,
    category: "POLÍTICAS",
    description:
      "La política de Latencia redirige al recurso con menor latencia para el usuario, medido por el tráfico entre el usuario y las regiones de AWS.",
    objective: "Elegir a qué recurso responde Route 53 según la latencia",
    tags: ["Latencia", "regiones", "baja latencia"],
    fileName: "routing-latency",
    completed: false,
    theory: `📚 TEORÍA: Política de Latencia (101)

La política basada en **latencia** redirige al recurso que tenga la
**menor latencia cerca del usuario** (el tiempo de acceso a ese recurso).
Es muy útil cuando la latencia es una prioridad: el ejemplo del instructor
es una plataforma de streaming tipo Netflix, donde una latencia alta
rompe la experiencia.

Cómo funciona:
  • Se basa en el **tráfico entre los usuarios y las regiones de AWS**.
  • Un usuario de Alemania puede ser dirigido a EE.UU. **si esa es la
    latencia más baja** (aunque lo normal es que sea Europa).
  • Se puede **asociar a health checks** y tiene capacidad de
    **conmutación por error**: si falla un recurso, se cambia a otro.

En la práctica: el instructor accede desde Europa y Route 53 le devuelve
Frankfurt; al conectarse con una VPN en Singapur, le devuelve el recurso
de Asia.`,
    explanationText:
      "🌍 Ejemplo cotidiano: latencia es pedir un taxi: te asignan el que está más cerca (menor tiempo de llegada), no el de tu barrio favorito ni el que más pesa.\n\nRoute 53 mide el tiempo de ida y vuelta entre el usuario y cada región AWS y devuelve la IP del recurso más rápido en ese momento. No miras dónde está el usuario geográficamente, sino la latencia real: por eso es distinta de la geolocalización.",
    codeSnippet: `// Registro de tipo A con política de LATENCIA:
//   latency.jamengual.com → Singapur (Asia)
//   latency.jamengual.com → N. Virginia (EE.UU.)
//   latency.jamengual.com → Frankfurt (Europa)

// Un usuario conectado desde Alemania hace la consulta...`,
    inputs: {},
    completeCode: "Latencia = menor latencia al usuario (tráfico usuario↔región) | se puede asociar a health checks | no es geolocalización",
    format: "prediction",
    prediction: {
      prompt: "¿A qué recurso responderá Route 53 para un usuario en Alemania?",
      snippet: `// latency.jamengual.com → Singapur | N. Virginia | Frankfurt
// Usuario conectado desde Alemania (Europa).`,
      options: [
        "Al recurso con menor latencia para ese usuario: normalmente Frankfurt (Europa)",
        "Siempre a Singapur, porque aparece primero en la lista",
        "Al recurso de EE.UU., porque está más cerca de Internet",
        "A los tres recursos, y el cliente elige al azar",
      ],
      answer: "Al recurso con menor latencia para ese usuario: normalmente Frankfurt (Europa)",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── HEALTH CHECKS Y FAILOVER (102, 104) ────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 13,
    title: "Health checks y Failover: activo/pasivo",
    stars: 3,
    category: "DISPONIBILIDAD",
    description:
      "El failover usa una instancia primaria (activa) y una secundaria (pasiva) con un health check obligatorio sobre la primaria. Si cae, Route 53 cambia de punto de mira.",
    objective: "Validar cómo funcionan los health checks y la conmutación por error",
    tags: ["health check", "failover", "DR", "CloudWatch"],
    fileName: "health-check",
    completed: false,
    theory: `📚 TEORÍA: Health checks y Failover (102 y 104)

Los **controles de salud (health checks)** son peticiones HTTP que
comprueban si un endpoint responde. Solo son para recursos **públicos**.

Características clave:
  • Hay **15 verificadores de salud globales** que hacen las peticiones.
  • Si **más del 18%** de los health checkers reportan que el endpoint
    está sano, Route 53 lo considera sano.
  • El endpoint debe responder con códigos de estado **2xx o 3xx**.
  • Umbral por defecto de 3, intervalo de 30 segundos (10 segundos
    conlleva mayor coste). Protocolos: HTTP, HTTPS y TCP.
  • Tipos: monitorizar un endpoint, **controlar otros health checks**
    (health check padre con hasta 256 hijos) o supervisar **alarmas de
    CloudWatch** (útil para recursos privados).
  • Si tienes firewall, debes **permitir las IPs de los health checkers**.

La política de **conmutación por error (failover)**:
  • Usa un estado **activo** (primaria) y otro **pasivo** (secundaria a la
    espera para la recuperación de desastres).
  • El **health check es obligatorio** para el registro primario.
  • Si la primaria falla, Route 53 conmuta automáticamente al secundario
    (el cambio se ve cuando expira el TTL).

En la práctica: el instructor quita HTTP del security group de la instancia
primaria; el health check falla, el tráfico deja de llegar y, tras el TTL
de 60 s, los clientes acceden a la secundaria (Europa).`,
    explanationText:
      "🌍 Ejemplo cotidiano: failover es el sistema de respaldo de un quirófano: el generador principal funciona siempre y hay un generador de repuesto apagado, listo para arrancar si el principal se cae. El health check es el técnico que vigila la luz.\n\nEl health check solo mira recursos públicos, responde con 2xx/3xx y decide con el 18% de los verificadores. El failover exige health check en la primaria: si cae, Route 53 responde con la secundaria. Ese 'activo/pasivo' con recuperación de desastres es lo que busca el examen.",
    codeSnippet: "// Afirmaciones sobre health checks y failover",
    inputs: {},
    completeCode: "18% health checkers sanos | 2xx/3xx | failover: primaria activa + secundaria pasiva + health check obligatorio",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los health checks y el failover.",
      statements: [
        {
          id: "a",
          text: "Los health checks de Route 53 solo sirven para recursos públicos: no pueden comprobar endpoints privados de una VPC directamente.",
          answer: true,
          explanation: "Para recursos privados se monitoriza una alarma de CloudWatch.",
        },
        {
          id: "b",
          text: "Route 53 considera sano un endpoint cuando más del 18% de los health checkers globales informan que está sano.",
          answer: true,
          explanation: "15 verificadores globales y el umbral del 18% determinan la salud.",
        },
        {
          id: "c",
          text: "En una política de failover, el health check es obligatorio para el registro secundario y opcional para el primario.",
          answer: false,
          explanation: "Al revés: el health check es obligatorio para el registro primario.",
        },
        {
          id: "d",
          text: "La política de failover usa un estado activo (primaria) y otro pasivo (secundaria): si la primaria cae, Route 53 responde con la secundaria.",
          answer: true,
          explanation: "Es el patrón de recuperación de desastres activo/pasivo.",
        },
        {
          id: "e",
          text: "Un health check puede supervisar otros health checks (padre con hijos) y también alarmas de CloudWatch.",
          answer: true,
          explanation: "Son dos de los tres tipos de health check que describe el instructor.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── GEOLOCALIZACIÓN, GEOPROXIMIDAD Y MULTIVALOR (105, 106, 108) ────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 14,
    title: "Elegir la política de enrutamiento correcta",
    stars: 3,
    category: "POLÍTICAS",
    description:
      "Simple, ponderada, latencia, failover, geolocalización, geoproximidad y multivalor: cada política resuelve un caso de uso distinto.",
    objective: "Emparejar cada política de enrutamiento con su caso de uso",
    tags: ["routing policies", "geolocalización", "geoproximidad", "multivalor"],
    fileName: "routing-policies",
    completed: false,
    theory: `📚 TEORÍA: El resto de políticas (105, 106, 108)

  • **Geolocalización**: se basa en la **ubicación del usuario**
    (continente, país o estado de EE.UU.). Casos: web en varios idiomas
    (ES/EN), restringir distribución de contenidos. Requiere un registro
    **por defecto** para usuarios que no caigan en la ubicación definida.

  • **Geoproximidad**: se basa en la ubicación **del usuario Y del
    recurso**, con un **sesgo** para desplazar más tráfico: de +1 a +99
    amplía la región (más tráfico) y de -1 a -99 la reduce. Los recursos
    pueden ser AWS (región) o externos (latitud/longitud). Requiere
    **Route 53 Traffic Flow**.

  • **Multivalor**: cuando hay **múltiples recursos**, Route 53 devuelve
    varios valores **asociados a health checks**: solo devuelve los
    **sanos** (hasta 8 por consulta). Si un health check falla, ese valor
    desaparece automáticamente de la respuesta. **No sustituye a un
    Elastic Load Balancer**.

Recuerda (099): estas políticas responden consultas de DNS, no enrutan
tráfico como un load balancer.`,
    explanationText:
      "🌍 Ejemplo cotidiano: cada política es un criterio de despacho: por cercanía física (geolocalización), por rapidez (latencia), por porcentajes (ponderada), por plan B (failover), por idioma del usuario (geolocalización por país) y por 'que vengan más clientes a esta tienda' (geoproximidad con sesgo).\n\nEn el examen, el enunciado te da el caso de uso: 'repartir el 10% a una versión nueva' → ponderada; 'menor tiempo de respuesta' → latencia; 'DR activo/pasivo' → failover; 'por país de origen' → geolocalización; 'hasta 8 sanos con health checks' → multivalor. Y recuerda: multivalor NO reemplaza a un ELB.",
    codeSnippet: "// Empareja cada política de enrutamiento con su caso de uso",
    inputs: {},
    completeCode: "Geo = por ubicación | Geoproximidad = por usuario+recurso con sesgo | Multivalor = solo sanos (≤8), no es ELB",
    format: "matching",
    matching: {
      prompt: "Conecta cada política de enrutamiento con su caso de uso más representativo.",
      definitions: [
        "Un solo recurso; con varios valores en el registro, Route 53 devuelve todos y el cliente elige al azar. Sin health checks.",
        "Porcentaje de solicitudes por recurso según su peso: ideal para A/B testing o dejar una versión sin tráfico con peso 0.",
        "El recurso con menor latencia para el usuario, medido por el tráfico entre el usuario y las regiones de AWS (ej. streaming).",
        "Estado activo/pasivo para recuperación de desastres: health check obligatorio sobre la primaria y conmutación automática.",
        "Según la ubicación del usuario (continente, país, estado): webs localizadas por idioma o restricción de contenidos. Requiere un registro 'por defecto'.",
        "Según la ubicación del usuario Y del recurso, con sesgo (+1 a +99 amplía, -1 a -99 reduce). Requiere Route 53 Traffic Flow.",
        "Múltiples recursos con health checks: solo devuelve los sanos (hasta 8 por consulta). No sustituye a un Elastic Load Balancer.",
      ],
      pairs: [
        {
          id: "simple",
          term: "Simple",
          definition:
            "Un solo recurso; con varios valores en el registro, Route 53 devuelve todos y el cliente elige al azar. Sin health checks.",
        },
        {
          id: "weighted",
          term: "Ponderada",
          definition:
            "Porcentaje de solicitudes por recurso según su peso: ideal para A/B testing o dejar una versión sin tráfico con peso 0.",
        },
        {
          id: "latency",
          term: "Latencia",
          definition:
            "El recurso con menor latencia para el usuario, medido por el tráfico entre el usuario y las regiones de AWS (ej. streaming).",
        },
        {
          id: "failover",
          term: "Failover (conmutación por error)",
          definition:
            "Estado activo/pasivo para recuperación de desastres: health check obligatorio sobre la primaria y conmutación automática.",
        },
        {
          id: "geo",
          term: "Geolocalización",
          definition:
            "Según la ubicación del usuario (continente, país, estado): webs localizadas por idioma o restricción de contenidos. Requiere un registro 'por defecto'.",
        },
        {
          id: "geoproximity",
          term: "Geoproximidad",
          definition:
            "Según la ubicación del usuario Y del recurso, con sesgo (+1 a +99 amplía, -1 a -99 reduce). Requiere Route 53 Traffic Flow.",
        },
        {
          id: "multivalue",
          term: "Multivalor",
          definition:
            "Múltiples recursos con health checks: solo devuelve los sanos (hasta 8 por consulta). No sustituye a un Elastic Load Balancer.",
        },
      ],
    },
  },
];
