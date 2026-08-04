import type { Exercise } from "@/lib/types";

/** Ruta progresiva: CloudFront (DVA-C02), de la CDN global a logs en tiempo real. */
export const AWS_CLOUDFRONT_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // FUNDAMENTOS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "CloudFront: la CDN Global",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "CloudFront es una red de entrega de contenidos (CDN): 216 edge locations por todo el mundo acercan el contenido al usuario para mejorar la latencia.",
    objective: "Entender qué hace una CDN y por qué mejora la lectura",
    tags: ["CDN", "edge locations", "caché", "latencia"],
    fileName: "edge-locations",
    completed: false,
    theory: `📚 TEORÍA: CloudFront como CDN global

CloudFront es una **red de entrega de contenidos (CDN)** que mejora el
rendimiento de lectura acercando el contenido al usuario.

El instructor lo explica con Netflix: las películas viven en servidores
de una o varias regiones, pero los usuarios están repartidos por todo el
mundo. Por eso CloudFront usa **216 puntos de presencia (edge locations)**:
el origen (bucket S3, ALB, EC2...) envía el contenido a las edges mediante
**enlaces privados de AWS**, y el usuario accede a la edge más cercana.

  • Caché por edge: cada ubicación guarda una copia con un TTL.
  • Ideal para contenido **estático** disponible en todas partes
    (p. ej. una página web estática).
  • No confundir con **S3 Cross Region Replication**: CloudFront es una
    red global con caché; la replicación se configura por región y es
    casi en tiempo real.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es como una franquicia de pizzerías: la pizza (contenido) se hornea en la cocina central (el bucket en Sydney) y se reparte por enlaces privados a las tiendas de todo el mundo (edge locations); el cliente entra en la tienda de su barrio y la recibe al instante, sin que nadie vaya a por ella a Australia.\n\nCloudFront guarda copias en caché en 216 edge locations: la petición del usuario se resuelve en la edge más cercana, no en el origen. Es la respuesta del examen cuando se habla de contenido estático distribuido globalmente con baja latencia.",
    codeSnippet: `# Bucket S3 con el sitio web estático en Sydney (Australia).
# Distribución de CloudFront desplegada; un usuario navega desde Estados Unidos.
GET https://d123.cloudfront.net/index.html`,
    inputs: {},
    completeCode:
      "216 edge locations | origen → edges por enlaces privados de AWS | contenido estático servido desde la edge más cercana",
    format: "prediction",
    prediction: {
      prompt:
        "Un usuario en Estados Unidos accede a una web estática cuyo bucket S3 está en Australia a través de CloudFront. ¿Qué ocurre exactamente?",
      snippet: `# Bucket S3 con el sitio web estático en Sydney (Australia).
# Distribución de CloudFront desplegada; un usuario navega desde Estados Unidos.
GET https://d123.cloudfront.net/index.html`,
      options: [
        "La petición llega a la edge location más cercana al usuario: si el contenido está en caché, se sirve al instante desde allí, sin llegar al bucket de Sydney.",
        "La petición viaja directamente hasta el bucket S3 en Sydney, que responde con alta latencia para el usuario americano.",
        "El bucket replica el contenido a una región cercana a Estados Unidos en tiempo real y el usuario accede desde ahí.",
        "CloudFront ejecuta el código del sitio en la edge location y genera el HTML bajo demanda.",
      ],
      answer:
        "La petición llega a la edge location más cercana al usuario: si el contenido está en caché, se sirve al instante desde allí, sin llegar al bucket de Sydney.",
    },
  },

  {
    id: 2,
    title: "CloudFront vs S3 Cross Region Replication",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "Dos formas de distribuir contenido que suenan parecido pero son muy distintas: una CDN global con caché frente a la réplica por región casi en tiempo real.",
    objective: "Distinguir CloudFront de S3 Cross Region Replication",
    tags: ["CDN", "S3 CRR", "contenido estático", "contenido dinámico"],
    fileName: "cloudfront-vs-crr",
    completed: false,
    theory: `📚 TEORÍA: CDN vs Replicación

  • **CloudFront**: red global. Los archivos se almacenan en caché en
    las edge locations durante un tiempo (TTL). Ideal para contenido
    **estático** disponible en todas partes (p. ej. una web estática).
  • **S3 Cross Region Replication**: se configura para **cada región**
    en la que quieras la réplica; los archivos se actualizan casi en
    **tiempo real** y son de solo lectura. Ideal para contenido
    **dinámico** con baja latencia en pocas regiones.

El instructor insiste: cuando el examen hable de contenido estático,
piensa en CloudFront; cuando hable de contenido dinámico actualizado
casi en tiempo real en pocas regiones, piensa en S3 CRR.`,
    explanationText:
      "🌍 Ejemplo cotidiano: CloudFront es la cadena de videoclubs que tiene una copia de la película en cada barrio; S3 CRR es la sede central que copia los nuevos lanzamientos a unas pocas oficinas concretas casi en tiempo real.\n\nLa diferencia clave está en el TTL: CloudFront sirve copias cacheadas durante un tiempo (estático), mientras que la replicación actualiza los archivos casi al instante pero solo en las regiones que configures (dinámico). Mezclarlos es una trampa típica de examen.",
    codeSnippet: "// Empareja cada servicio con su característica y caso de uso",
    inputs: {},
    completeCode:
      "CloudFront: red global con caché (TTL), contenido estático | S3 CRR: por región, casi en tiempo real, contenido dinámico",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada servicio o concepto con su característica más representativa.",
      definitions: [
        "De donde sale el contenido real: un bucket S3, un ALB, instancias EC2 o cualquier backend HTTP.",
        "Punto de presencia cercano al usuario donde se almacena en caché el contenido enviado desde el origen mediante enlaces privados de AWS.",
        "Se configura para cada región donde quieras replicar; los archivos se actualizan casi en tiempo real; ideal para contenido dinámico con baja latencia en pocas regiones.",
        "Red global de entrega de contenidos: guarda copias en caché en edge locations con un TTL; ideal para contenido estático disponible en todas partes.",
      ],
      pairs: [
        {
          id: "cloudfront",
          term: "CloudFront",
          definition:
            "Red global de entrega de contenidos: guarda copias en caché en edge locations con un TTL; ideal para contenido estático disponible en todas partes.",
        },
        {
          id: "crr",
          term: "S3 Cross Region Replication",
          definition:
            "Se configura para cada región donde quieras replicar; los archivos se actualizan casi en tiempo real; ideal para contenido dinámico con baja latencia en pocas regiones.",
        },
        {
          id: "edge",
          term: "Edge Location",
          definition:
            "Punto de presencia cercano al usuario donde se almacena en caché el contenido enviado desde el origen mediante enlaces privados de AWS.",
        },
        {
          id: "origin",
          term: "Origen",
          definition:
            "De donde sale el contenido real: un bucket S3, un ALB, instancias EC2 o cualquier backend HTTP.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ORÍGENES
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Origen S3 con OAI/OAC: Bucket Privado",
    stars: 2,
    category: "ORÍGENES",
    description:
      "Con Origin Access Identity (OAI) o Origin Access Control (OAC), CloudFront accede a un bucket privado y nadie más puede leer los objetos directamente desde S3.",
    objective: "Explicar cómo CloudFront protege un bucket privado",
    tags: ["OAI", "OAC", "bucket policy", "origen S3"],
    fileName: "origin-access-control",
    completed: false,
    theory: `📚 TEORÍA: Origen S3 con acceso restringido

Un bucket S3 puede ser el origen de una distribución de CloudFront. Para
servir contenido **privado** solo a través de CloudFront se usa una
**identidad de acceso al origen**:

  • **OAI** (Origin Access Identity, el nombre clásico) o **OAC**
    (Origin Access Control, el actual en la consola).
  • Al crearlo, CloudFront genera una **política de bucket** que debes
    copiar y pegar en los permisos de S3 (en la práctica ya no se
    aplica de forma automática).
  • Con esto, los objetos del bucket **no pueden ser accedidos por
    nada más que CloudFront**: el acceso directo por URL de S3 da
    error y el contenido solo se sirve a través de la distribución.

La comunicación entre el origen y las edge locations se hace por
**enlaces privados** de la red de AWS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el OAI es el empleado de seguridad con llave maestra: el almacén (bucket) está cerrado al público, pero el repartidor oficial (CloudFront) puede entrar porque tiene la llave; nadie más puede abrir la puerta.\n\nAl crear la distribución con Origin Access Control, CloudFront te da una política de bucket que solo permite el acceso a esa identidad de origen. La pegas en los permisos de S3 y los objetos dejan de ser accesibles directamente: solo se sirven a través de CloudFront. Es la configuración segura por defecto para servir contenido privado desde S3.",
    codeSnippet: `# Bucket "media-privada" con bloqueo de acceso público.
# Distribución de CloudFront con Origin Access Control (OAC) sobre ese bucket,
# y la política de bucket generada por CloudFront pegada en los permisos de S3.`,
    inputs: {},
    completeCode:
      "OAI/OAC: solo CloudFront accede al bucket | pegar la política de bucket generada | los objetos no son públicos",
    format: "prediction",
    prediction: {
      prompt:
        "Has creado un bucket S3 privado y una distribución de CloudFront con Origin Access Control (OAI/OAC). ¿Qué garantiza esta configuración?",
      snippet: `# Bucket "media-privada" con bloqueo de acceso público.
# Distribución de CloudFront con Origin Access Control (OAC) sobre ese bucket,
# y la política de bucket generada por CloudFront pegada en los permisos de S3.`,
      options: [
        "Solo CloudFront (a través de la identidad de origen) puede acceder a los objetos del bucket; un usuario no puede leerlos directamente desde S3.",
        "El bucket pasa a ser público: cualquier persona con la URL de S3 puede descargar los objetos.",
        "El bucket replica sus objetos a las edge locations y deja de necesitar CloudFront.",
        "El OAC genera claves de acceso IAM para que los usuarios descarguen los objetos desde S3.",
      ],
      answer:
        "Solo CloudFront (a través de la identidad de origen) puede acceder a los objetos del bucket; un usuario no puede leerlos directamente desde S3.",
    },
  },

  {
    id: 4,
    title: "TTL: Cache-Control y Expires",
    stars: 2,
    category: "CACHÉ",
    description:
      "La caché vive en cada edge location y caduca según un TTL que el origen define con las cabeceras Cache-Control o Expires.",
    objective: "Dominar el TTL y el cache hit ratio",
    tags: ["TTL", "Cache-Control", "Expires", "cache hit"],
    fileName: "cache-ttl",
    completed: false,
    theory: `📚 TEORÍA: Almacenamiento en caché y TTL

La caché vive en **cada edge location** y los datos **caducan** después
de un tiempo llamado **TTL (Time To Live)**.

  • El TTL puede variar de **0 segundos a 1 año**.
  • Se establece en el origen mediante las cabeceras
    **Cache-Control** o **Expires**.
  • Objetivo: **maximizar el ratio de golpe de caché (cache hit)** para
    minimizar las peticiones al origen.
  • Lo que incluyas en la clave de caché (cabeceras HTTP, cookies y
    query strings) se incluye **automáticamente** en las peticiones de
    origen.

Cuando solo cambias el origen, las edges no se enteran hasta que el
TTL expira; por eso existen las invalidaciones (se ven más adelante).`,
    explanationText:
      "🌍 Ejemplo cotidiano: el TTL es la fecha de caducidad de la copia que tiene el kiosco: hasta que no caduca, el kiosco sigue vendiendo el periódico de ayer aunque la redacción publique el de hoy.\n\nLa caché está en cada edge location y caduca según el TTL que define el origen (Cache-Control o Expires, de 0 segundos a 1 año). Cuanta más información añadas a la clave de caché (headers, cookies, query strings), más copias distintas existen y peor es el hit ratio; la meta es servir desde la caché y minimizar las idas al origen.",
    codeSnippet: "// Afirmaciones sobre el TTL y el almacenamiento en caché de CloudFront",
    inputs: {},
    completeCode:
      "TTL 0 s a 1 año | definido con Cache-Control o Expires en el origen | maximizar cache hit ratio",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión del TTL y la caché de CloudFront.",
      statements: [
        {
          id: "a",
          text: "La caché de CloudFront vive en cada edge location y los datos caducan después de un tiempo llamado TTL (Time To Live).",
          answer: true,
          explanation:
            "Correcto: cada edge location mantiene su propia caché y el TTL marca cuándo caduca cada dato.",
        },
        {
          id: "b",
          text: "El TTL se puede establecer en el origen mediante las cabeceras Cache-Control o Expires, con valores que van de 0 segundos a 1 año.",
          answer: true,
          explanation:
            "Correcto: el origen define el TTL con esas cabeceras y el rango llega hasta un año.",
        },
        {
          id: "c",
          text: "Maximizar el cache hit ratio es negativo: cuantas más peticiones lleguen al origen, mejor rendimiento.",
          answer: false,
          explanation:
            "Falso: al revés, maximizar el hit ratio significa servir desde la caché y minimizar las peticiones al origen.",
        },
        {
          id: "d",
          text: "Las cabeceras HTTP, cookies y query strings que incluyas en la clave de caché se incluyen automáticamente en las peticiones al origen.",
          answer: true,
          explanation:
            "Correcto: lo que forma la clave de caché también viaja hacia el origen.",
        },
      ],
    },
  },

  {
    id: 5,
    title: "Clave de Caché: qué Incluir según el Contenido",
    stars: 2,
    category: "CACHÉ",
    description:
      "La clave de caché identifica de forma única cada objeto: por defecto es hostname + recurso. Añadir cabeceras, cookies o query strings crea variantes en caché.",
    objective: "Elegir la política de caché según el tipo de contenido",
    tags: ["clave de caché", "whitelist", "cookies", "query strings"],
    fileName: "cache-key",
    completed: false,
    theory: `📚 TEORÍA: La clave de caché y las políticas

La **clave de caché** es el ID único con el que CloudFront identifica
cada objeto en la caché. Por defecto: **hostname + recurso de la URL**.

Mediante **políticas de caché** se pueden añadir a la clave:

  • **Cabeceras HTTP**: ninguna o una lista blanca (whitelist), p. ej.
    Accept-Language para servir el idioma correcto.
  • **Cookies**: ninguna, whitelist, todas menos algunas, o todas.
  • **Query strings**: ninguna, whitelist, todas menos algunas, o todas.

Incluir más elementos crea más copias en caché y **reduce el
rendimiento** (más misses). Si no incluyes nada, todo el mundo comparte
la misma copia: máximo cache hit.

Además existe la **política de petición de origen**: reenvía cabeceras,
cookies o query strings al origen **sin incluirlas en la clave de
caché**, evitando contenido duplicado (p. ej. una cookie de sesión que
el backend necesita pero que no debe fragmentar la caché).`,
    explanationText:
      "🌍 Ejemplo cotidiano: la clave de caché es la etiqueta del archivador: si solo pones 'página', todo el mundo comparte la misma copia; si añades 'idioma', tendrás una copia por idioma; si añades 'usuario', tendrás miles y el archivador se llena.\n\nLo estático (index.html, imágenes, CSS) no necesita nada en la clave: máximo hit ratio. Lo que varía por idioma usa la cabecera en whitelist; lo que varía por sesión se reenvía al origen con la política de petición de origen sin fragmentar la caché; lo que varía por filtros usa query strings. Cada cosa en su sitio para no romper el rendimiento.",
    codeSnippet: "// Empareja cada tipo de contenido con la política de caché adecuada",
    inputs: {},
    completeCode:
      "Clave = hostname + recurso | headers/cookies/query strings en whitelist crean variantes | política de petición de origen sin duplicar caché",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada tipo de contenido con la política de caché que le corresponde.",
      definitions: [
        "Incluir las query strings en la clave de caché: cada combinación de filtros genera una copia en caché.",
        "No incluir cabeceras, cookies ni query strings en la clave de caché: todos comparten la misma copia y el cache hit se maximiza.",
        "Reenviar la cookie al origen con la política de petición de origen, sin incluirla en la clave de caché, para no duplicar contenido.",
        "Añadir esa cabecera HTTP a la clave de caché mediante una lista blanca (whitelist): una copia en caché por idioma.",
      ],
      pairs: [
        {
          id: "static",
          term: "Página web estática (index.html, imágenes, CSS)",
          definition:
            "No incluir cabeceras, cookies ni query strings en la clave de caché: todos comparten la misma copia y el cache hit se maximiza.",
        },
        {
          id: "language",
          term: "Contenido según el idioma (Accept-Language)",
          definition:
            "Añadir esa cabecera HTTP a la clave de caché mediante una lista blanca (whitelist): una copia en caché por idioma.",
        },
        {
          id: "session",
          term: "Contenido por sesión de usuario (cookies)",
          definition:
            "Reenviar la cookie al origen con la política de petición de origen, sin incluirla en la clave de caché, para no duplicar contenido.",
        },
        {
          id: "query",
          term: "Contenido por filtros de búsqueda (query strings)",
          definition:
            "Incluir las query strings en la clave de caché: cada combinación de filtros genera una copia en caché.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // COMPORTAMIENTOS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "Comportamientos de Caché por Ruta",
    stars: 3,
    category: "COMPORTAMIENTOS",
    description:
      "Los cache behaviors enrutan cada patrón de ruta a un origen y una política distintos: /api/* al ALB, /images/* al bucket de imágenes y /* al sitio estático.",
    objective: "Enrutar tráfico con cache behaviors",
    tags: ["cache behaviors", "rutas", "origen múltiple", "ALB"],
    fileName: "cache-behaviors",
    completed: false,
    theory: `📚 TEORÍA: Comportamientos de la caché

Los **comportamientos de caché (cache behaviors)** permiten tener
diferentes orígenes y políticas de caché según el **patrón de ruta**
de la URL.

  • Ejemplo: /images/* → origen de imágenes; /api/* → Application
    Load Balancer; comportamiento por defecto → bucket S3.
  • El comportamiento por defecto siempre es el **último** en
    procesarse y su ruta siempre es **/* (barra-asterisco)**.
  • También sirven para **separar estático y dinámico**: el contenido
    estático (blog, imágenes) no usa cabeceras ni cookies de sesión;
    el dinámico (ALB + EC2) sí necesita cabeceras, cookies o query
    strings.

Con esto una sola distribución reparte el tráfico entre muchos
orígenes según lo que pida el usuario.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la centralita de un edificio con varias empresas: si llamas al 101 (una ruta) te pasan con la oficina A, si llamas al 202 te pasan con la oficina B, y si marcas el número general (/*) te pasan con el servicio por defecto.\n\nCada comportamiento define un origen y una política de caché por patrón de ruta. /api/* va al ALB (dinámico, con cookies/cabeceras), /images/* al bucket de imágenes, y /* es el default que siempre se procesa el último. Es la forma canónica de separar contenido estático y dinámico en una misma distribución.",
    codeSnippet: `# Distribución de CloudFront con comportamientos de caché:
#   /api/*        -> Application Load Balancer (backend dinámico)
#   /images/*     -> bucket S3 de imágenes
#   /* (default)  -> bucket S3 del sitio estático
GET https://d123.cloudfront.net/api/products`,
    inputs: {},
    completeCode:
      "Behaviors por ruta: /api/* → ALB, /images/* → bucket imágenes, /* → default (último)",
    format: "prediction",
    prediction: {
      prompt:
        "Un usuario pide https://d123.cloudfront.net/api/products en esta distribución. ¿A qué origen se enruta?",
      snippet: `# Distribución de CloudFront con comportamientos de caché:
#   /api/*        -> Application Load Balancer (backend dinámico)
#   /images/*     -> bucket S3 de imágenes
#   /* (default)  -> bucket S3 del sitio estático
GET https://d123.cloudfront.net/api/products`,
      options: [
        "Se enruta al comportamiento /api/* y la petición llega al Application Load Balancer.",
        "Se enruta al comportamiento por defecto y se sirve desde el bucket del sitio estático.",
        "Se enruta a /images/* porque ese comportamiento también usa un bucket S3.",
        "CloudFront devuelve un error 403 porque /api/* no es un archivo estático.",
      ],
      answer:
        "Se enruta al comportamiento /api/* y la petición llega al Application Load Balancer.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // INVALIDACIONES
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Invalidar la Caché para Forzar el Refresco",
    stars: 2,
    category: "INVALIDACIONES",
    description:
      "Si solo cambias el origen, la caché de las edges no se actualiza hasta que expira el TTL. La invalidación fuerza el refresco total o parcial en segundos.",
    objective: "Construir el flujo de una invalidación",
    tags: ["invalidación", "CreateInvalidation", "TTL", "refresco"],
    fileName: "invalidation",
    completed: false,
    theory: `📚 TEORÍA: Invalidaciones de caché

Cuando actualizas el **origen**, CloudFront no lo sabe: las edge
locations siguen sirviendo el contenido antiguo hasta que **expira el
TTL** (puede ser de 12 o 24 horas).

Para forzar una actualización **total o parcial** de la caché obviando
el TTL se crea una **invalidación**:

  • Puedes invalidar **todos los archivos** (/*) o una ruta concreta
    (p. ej. /images/* o /index.html).
  • CloudFront envía la invalidación a las edges, estas descartan el
    contenido antiguo y la siguiente petición vuelve al origen.
  • La invalidación tarda unos **segundos** en propagarse.
  • Coste: las primeras **1.000 invalidaciones al mes son gratuitas**;
    a partir de ahí se paga por ruta invalidada.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la invalidación es llamar a las tiendas para que tiren el cartel antiguo del escaparate en cuanto cambias el producto, en vez de esperar a que caduque la oferta.\n\nSin invalidación, un cambio en el origen no llega a los usuarios hasta que el TTL expira. La invalidación (CreateInvalidation) descarta el contenido de las edges en segundos y la siguiente petición busca el contenido nuevo en el origen. Se puede invalidar una ruta concreta o todo (/*), y conviene recordar que hay una franquicia gratuita mensual.",
    codeSnippet: "// Ordena el flujo completo de una invalidación de caché",
    inputs: {},
    completeCode:
      "Actualizar origen → crear invalidación (ruta o /*) → edges descartan contenido → siguiente petición va al origen",
    format: "ordering",
    ordering: {
      prompt:
        "Has actualizado index.html en el origen. Ordena los pasos para que los usuarios vean el cambio.",
      steps: [
        {
          id: "update-origin",
          label: "Subes el nuevo index.html al bucket S3 (el origen).",
        },
        {
          id: "stale-cache",
          label: "Un usuario sigue viendo el contenido antiguo: la edge lo tiene en caché hasta que expire el TTL.",
        },
        {
          id: "create-invalidation",
          label: "Crear una invalidación en CloudFront indicando la ruta (/index.html o /*).",
        },
        {
          id: "sent-to-edge",
          label: "CloudFront envía la invalidación a las edge locations.",
        },
        {
          id: "discard",
          label: "Las edge locations descartan el contenido antiguo de la caché.",
        },
        {
          id: "fetch-new",
          label: "La siguiente petición va al origen, recupera el contenido nuevo y lo vuelve a cachear.",
        },
      ],
      correctOrder: [
        "update-origin",
        "stale-cache",
        "create-invalidation",
        "sent-to-edge",
        "discard",
        "fetch-new",
      ],
    },
  },

  {
    id: 8,
    title: "ALB y EC2 como Orígenes: IPs de las Edge Locations",
    stars: 2,
    category: "ORÍGENES",
    description:
      "CloudFront no entra en tu VPC: las instancias EC2 y el ALB deben ser públicos y sus grupos de seguridad deben permitir las IP públicas de las edge locations.",
    objective: "Configurar un origen personalizado HTTP de forma segura",
    tags: ["ALB", "EC2", "security groups", "IP edge locations", "HTTPS"],
    fileName: "alb-origin",
    completed: false,
    theory: `📚 TEORÍA: CloudFront con ALB y EC2

CloudFront puede usar un **Application Load Balancer** o una instancia
**EC2** como **origen personalizado HTTP**.

  • **EC2 como origen**: la instancia debe ser **pública**, porque no
    hay conectividad privada directa entre CloudFront y la instancia.
  • El **grupo de seguridad** de la instancia debe permitir el acceso
    desde las **IP públicas de las edge locations** de CloudFront
    (AWS publica la lista para configurarla).
  • **ALB como origen**: el ALB también debe ser **público** para que
    las edges puedan llegar; el ALB se conecta de forma **privada**
    con las instancias EC2 (solo entra el tráfico del ALB).
  • Los usuarios se conectan a CloudFront por **HTTPS** con el
    certificado por defecto de cloudfront.net o con un certificado
    SSL propio (por ejemplo, desde ACM).`,
    explanationText:
      "🌍 Ejemplo cotidiano: CloudFront es un repartidor que trabaja en la calle: para entregarte el paquete, tu tienda tiene que estar abierta a la calle (pública); no puede entrar por una puerta secreta de tu almacén privado.\n\nCloudFront no tiene conectividad privada con tus recursos de la VPC: la EC2 debe ser pública y su security group debe abrirse a las IP públicas de las edge locations. Con un ALB pasa lo mismo hacia fuera, pero entre el ALB y las instancias la conexión es privada: así proteges las EC2 permitiendo solo el tráfico del balanceador. Y el usuario final siempre llega por HTTPS a CloudFront.",
    codeSnippet: "// Afirmaciones sobre CloudFront con ALB y EC2 como orígenes",
    inputs: {},
    completeCode:
      "EC2/ALB públicos | security group abierto a IPs de edge locations | ALB ↔ EC2 privado | HTTPS con ACM o certificado por defecto",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida cómo se conecta CloudFront a orígenes personalizados (ALB y EC2).",
      statements: [
        {
          id: "a",
          text: "Una instancia EC2 usada como origen de CloudFront debe ser pública: no hay conectividad privada directa entre CloudFront y la instancia.",
          answer: true,
          explanation:
            "Correcto: CloudFront llega desde Internet, así que la instancia debe ser accesible públicamente.",
        },
        {
          id: "b",
          text: "El grupo de seguridad de la instancia EC2 debe permitir el acceso desde las IP públicas de las edge locations de CloudFront.",
          answer: true,
          explanation:
            "Correcto: sin esas reglas, las edges no pueden llegar al origen.",
        },
        {
          id: "c",
          text: "Cuando usas un ALB como origen, la comunicación entre el ALB y las instancias EC2 es pública a través de Internet.",
          answer: false,
          explanation:
            "Falso: el ALB se conecta de forma privada con las instancias; lo público es la entrada del ALB hacia CloudFront.",
        },
        {
          id: "d",
          text: "Los usuarios pueden conectarse a CloudFront por HTTPS usando el certificado por defecto de cloudfront.net o un certificado SSL propio (por ejemplo, desde ACM).",
          answer: true,
          explanation:
            "Correcto: CloudFront sirve HTTPS con su certificado por defecto o con certificados personalizados.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // SEGURIDAD
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Restricción Geográfica por Países",
    stars: 2,
    category: "SEGURIDAD",
    description:
      "Con la lista de permitidos o la de bloqueo, CloudFront decide qué países pueden acceder al contenido usando una base de datos GeoIP.",
    objective: "Aplicar geo restriction con allow y block list",
    tags: ["geo restriction", "allow list", "block list", "GeoIP"],
    fileName: "geo-restriction",
    completed: false,
    theory: `📚 TEORÍA: Restricción geográfica

CloudFront permite **restringir el tráfico por países**:

  • **Lista de permitidos (allow list)**: solo los usuarios situados
    en los países de la lista pueden acceder al contenido.
  • **Lista de bloqueo (block list)**: se impide el acceso a los
    usuarios de los países de la lista; el resto sí accede.

El país se determina mediante una **base de datos GeoIP de terceros**
que asocia las direcciones IP con una zona geográfica.

Caso de uso clásico: cumplir **leyes de derechos de autor**
controlando desde qué países se puede ver un contenido.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la lista de países del estadio: con la lista de permitidos solo entran los de esa lista; con la lista de bloqueo entran todos excepto los prohibidos.\n\nCloudFront resuelve el país de cada usuario con una base de datos GeoIP y aplica la allow list o la block list a nivel de distribución. La trampa del examen: en la lista de permitidos, los países que NO están en la lista quedan fuera; en la de bloqueo, los que están en la lista quedan fuera y el resto entra.",
    codeSnippet: "// Afirmaciones sobre la restricción geográfica de CloudFront",
    inputs: {},
    completeCode:
      "Allow list: solo esos países | Block list: esos países fuera | determinación con GeoIP | caso: derechos de autor",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de la restricción geográfica de CloudFront.",
      statements: [
        {
          id: "a",
          text: "CloudFront permite restringir el acceso por países mediante una lista de permitidos (allow list) o una lista de bloqueo (block list).",
          answer: true,
          explanation:
            "Correcto: son las dos listas que ofrece la restricción geográfica.",
        },
        {
          id: "b",
          text: "Con la lista de bloqueo, solo los países incluidos en esa lista pueden acceder al contenido.",
          answer: false,
          explanation:
            "Falso: la lista de bloqueo prohíbe el acceso a esos países; todos los demás sí acceden.",
        },
        {
          id: "c",
          text: "El país del usuario se determina con una base de datos GeoIP de terceros que asocia las direcciones IP con zonas geográficas.",
          answer: true,
          explanation:
            "Correcto: el filtrado se basa en la geolocalización de la IP.",
        },
        {
          id: "d",
          text: "Un caso de uso típico de la restricción geográfica es cumplir leyes de derechos de autor controlando desde qué países se accede al contenido.",
          answer: true,
          explanation:
            "Correcto: es el ejemplo que usa el instructor para este servicio.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ACCESO RESTRINGIDO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: "URL Firmada vs Cookie Firmada",
    stars: 3,
    category: "ACCESO RESTRINGIDO",
    description:
      "Para distribuir contenido privado de pago, la URL firmada da acceso a archivos individuales y la cookie firmada a muchos archivos reutilizables.",
    objective: "Distinguir URL firmada, cookie firmada y pre-firmada de S3",
    tags: ["signed URL", "signed cookies", "caducidad", "key group"],
    fileName: "signed-url",
    completed: false,
    theory: `📚 TEORÍA: URLs firmadas y cookies firmadas

Para hacer una distribución **privada** y controlar quién accede a qué,
CloudFront ofrece URLs firmadas y cookies firmadas:

  • **URL firmada**: da acceso a **archivos individuales**. Si tienes
    100 archivos, necesitas 100 URLs firmadas.
  • **Cookie firmada**: da acceso a **múltiples archivos** y puede
    **reutilizarse** en varias peticiones.
  • Se puede configurar la **caducidad** (minutos para una película o
    canción, años para contenido privado a largo plazo), **rangos de
    IP** y **firmantes de confianza**.
  • Firmantes: **key groups** (recomendados, aprovechan la API para
    crear/rotar claves) o el par de claves de CloudFront gestionado
    con la cuenta **root** (no recomendado). La clave privada firma
    las URLs desde tu aplicación; la pública, cargada en CloudFront,
    las verifica.

Cuidado con la **pre-firmada de S3**: emite la petición como la
persona que firmó (usa su clave IAM), tiene TTL limitado y solo sirve
objetos del bucket. La firmada de CloudFront vale para **cualquier
origen** (S3, EC2, ALB), filtra por IP/ruta/fecha y aprovecha la caché
de CloudFront.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la URL firmada es la entrada nominal de un solo concierto (un archivo, una URL); la cookie firmada es el abono de temporada que te deja entrar a todas las funciones mientras sea válido.\n\nRegla rápida: archivos individuales → URL firmada; muchos archivos reutilizables → cookie firmada. Y no confundas servicios: la pre-firmada de S3 actúa como el usuario que la generó y solo vale para el bucket; la firmada de CloudFront vale para cualquier origen, filtra por IP/ruta/fecha y se aprovecha de la caché de la CDN.",
    codeSnippet: "// Afirmaciones sobre URLs firmadas y cookies firmadas de CloudFront",
    inputs: {},
    completeCode:
      "URL firmada: 1 archivo = 1 URL | cookie firmada: múltiples archivos reutilizable | caducidad configurable | key groups recomendados",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tus conocimientos sobre URLs firmadas y cookies firmadas.",
      statements: [
        {
          id: "a",
          text: "Una URL firmada de CloudFront da acceso a un archivo individual: si tienes 100 archivos privados, necesitas 100 URLs firmadas.",
          answer: true,
          explanation:
            "Correcto: la URL firmada se genera por archivo concreto.",
        },
        {
          id: "b",
          text: "Una cookie firmada da acceso a múltiples archivos y puede reutilizarse en varias peticiones.",
          answer: true,
          explanation:
            "Correcto: la cookie viaja en las peticiones y abre todos los archivos permitidos.",
        },
        {
          id: "c",
          text: "La validez de una URL firmada es fija e ilimitada: una vez emitida, nunca caduca.",
          answer: false,
          explanation:
            "Falso: se configura la caducidad: minutos para contenido de pago (películas, música) o años para contenido privado a largo plazo; además se puede filtrar por IP y ruta.",
        },
        {
          id: "d",
          text: "Una URL pre-firmada de S3 permite acceder a contenido de cualquier origen (S3, EC2, ALB) aprovechando la caché de CloudFront.",
          answer: false,
          explanation:
            "Falso: la pre-firmada de S3 solo sirve objetos del bucket, emite la petición como el firmante y tiene TTL limitado; la URL firmada de CloudFront vale para cualquier origen y usa la caché de la CDN.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PROCESO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "Crear una Distribución de CloudFront",
    stars: 3,
    category: "PROCESO",
    description:
      "El flujo real en la consola: bucket con contenido → distribución → Origin Access Control → política de bucket → Default Root Object → desplegar.",
    objective: "Ordenar los pasos para crear y servir una distribución",
    tags: ["distribución", "Default Root Object", "OAC", "despliegue"],
    fileName: "distribution-setup",
    completed: false,
    theory: `📚 TEORÍA: Creación de una distribución (práctica)

Pasos que hace el instructor en la consola:

  1. Crear un **bucket S3** con el contenido (index.html e imágenes)
     manteniendo **bloqueado el acceso público**.
  2. Crear la **distribución de CloudFront** seleccionando el bucket
     como origen.
  3. En Origin access, seleccionar **Origin Access Control (OAC)**:
     restringe el acceso para que solo CloudFront acceda al bucket.
  4. **Copiar y pegar** la política de bucket que genera CloudFront
     en los permisos de S3 (ya no se aplica automáticamente).
  5. Configurar el **Default Root Object** (index.html).
  6. Esperar el despliegue: **~5 minutos**.
  7. Probar con el **nombre de dominio de la distribución**
     (p. ej. d123.cloudfront.net): se accede desde la edge, no
     desde el bucket.`,
    explanationText:
      "🌍 Ejemplo cotidiano: abrir una franquicia: primero acondicionas el almacén (bucket), montas las tiendas (distribución), pones al empleado de seguridad en la puerta (OAC), cuelgas el permiso del ayuntamiento (política de bucket), fijas la puerta principal (Default Root Object) y abres al público tras unos días de obra.\n\nEl orden del flujo es lo que pregunta el examen: bucket privado con contenido → distribución con el bucket como origen → Origin Access Control → pegar la política de bucket que genera CloudFront → Default Root Object (index.html) → ~5 minutos de despliegue → probar con el dominio de la distribución (acceso desde la edge, no desde S3).",
    codeSnippet: "// Ordena los pasos para crear una distribución de CloudFront",
    inputs: {},
    completeCode:
      "Bucket privado → distribución → OAC → política de bucket → Default Root Object → despliegue ~5 min → d123.cloudfront.net",
    format: "ordering",
    ordering: {
      prompt:
        "Ordena los pasos para crear una distribución de CloudFront que sirva un sitio estático desde un bucket S3 privado.",
      steps: [
        {
          id: "create-bucket",
          label: "Crear el bucket S3 con el contenido (index.html e imágenes) y mantener bloqueado el acceso público.",
        },
        {
          id: "create-distribution",
          label: "Crear la distribución de CloudFront seleccionando el bucket S3 como origen.",
        },
        {
          id: "configure-oac",
          label: "Configurar Origin Access Control (OAC/OAI) para que solo CloudFront acceda al bucket.",
        },
        {
          id: "copy-policy",
          label: "Copiar la política de bucket que genera CloudFront y pegarla en los permisos de S3.",
        },
        {
          id: "root-object",
          label: "Configurar el Default Root Object (index.html).",
        },
        {
          id: "deploy",
          label: "Esperar el despliegue (~5 minutos) y probar con el nombre de dominio de la distribución.",
        },
      ],
      correctOrder: [
        "create-bucket",
        "create-distribution",
        "configure-oac",
        "copy-policy",
        "root-object",
        "deploy",
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // MONITORIZACIÓN
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 12,
    title: "Logs en Tiempo Real con Kinesis",
    stars: 3,
    category: "MONITORIZACIÓN",
    description:
      "CloudFront puede enviar cada solicitud en tiempo real a Kinesis Data Streams: una Lambda procesa al momento o Firehose lo entrega casi en tiempo real.",
    objective: "Diseñar la arquitectura de real-time logs de CloudFront",
    tags: ["real-time logs", "Kinesis Data Streams", "Lambda", "Firehose"],
    fileName: "real-time-logs",
    completed: false,
    theory: `📚 TEORÍA: Logs en tiempo real

CloudFront puede enviar **todas las solicitudes que recibe, en tiempo
real**, a una secuencia de datos (**Kinesis Data Streams**).

Objetivo: supervisar, analizar y tomar medidas según el rendimiento de
la entrega de contenidos.

  • **Procesamiento en tiempo real**: una función **Lambda** consume
    los registros desde Kinesis Data Streams.
  • **Procesamiento casi en tiempo real**: **Kinesis Data Firehose**
    procesa los registros por lotes y los envía a Amazon S3, Amazon
    OpenSearch u otros destinos.
  • Configuración: **tasa de muestreo** (porcentaje de peticiones que
    quieres recibir), campos específicos y **comportamientos de caché**
    concretos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: los logs en tiempo real son las cámaras del centro comercial conectadas a una centralita: cada entrada se registra al instante en una cinta (Kinesis Data Streams) y un vigilante (Lambda) la analiza en el momento; si solo necesitas el informe del día, lo mandas a la oficina (Firehose → S3/OpenSearch).\n\nCloudFront solo puede emitir logs en tiempo real a Kinesis Data Streams: para procesar al momento usas Lambda; para casi-tiempo real por lotes usas Kinesis Data Firehose hacia S3, OpenSearch u otros destinos. Puedes limitar el coste con la tasa de muestreo y eligiendo qué campos y behaviors registrar.",
    codeSnippet: `# Distribución de CloudFront con logs en tiempo real habilitados.
# Quieres analizar cada solicitud casi en el instante en que ocurre.`,
    inputs: {},
    completeCode:
      "CloudFront → Kinesis Data Streams → Lambda (tiempo real) o Firehose → S3/OpenSearch (casi en tiempo real)",
    format: "prediction",
    prediction: {
      prompt:
        "Habilitas los logs en tiempo real en tu distribución. ¿Qué arquitectura montas para procesar cada solicitud al momento?",
      snippet: `# Distribución de CloudFront con logs en tiempo real habilitados.
# Quieres analizar cada solicitud casi en el instante en que ocurre.`,
      options: [
        "CloudFront envía las solicitudes a Kinesis Data Streams y una función Lambda consume la secuencia para procesarlas en tiempo real.",
        "CloudFront copia los logs a un bucket S3 en cada región mediante S3 Cross Region Replication.",
        "CloudFront escribe los logs en CloudWatch Logs y una alarma los procesa automáticamente.",
        "CloudFront guarda los logs internamente durante 90 días y los consultas desde la consola.",
      ],
      answer:
        "CloudFront envía las solicitudes a Kinesis Data Streams y una función Lambda consume la secuencia para procesarlas en tiempo real.",
    },
  },
];
