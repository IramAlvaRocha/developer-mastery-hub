import type { Exercise } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// AWS DynamoDB — Fase 3: Serverless (DVA-C02, sección 22)
// Fiel a los subtítulos de: 317 a 341 (visión general, conceptos, WCU/RCU,
// operaciones, escrituras condicionales, GSI+LSI, PartiQL, bloqueo optimista,
// DAX, Streams, TTL, CLI, transacciones, sesión, fragmentación, S3, seguridad)
// ──────────────────────────────────────────────────────────────────────────

export const AWS_DYNAMODB_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ─── FUNDAMENTOS (318: visión general, 319: conceptos) ───────────────────
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "DynamoDB: la base de datos NoSQL gestionada",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "DynamoDB es una base de datos NoSQL distribuida que escala de forma horizontal y AWS cuida por ti. Las consultas JOIN no existen: todo lo que necesitas está en una misma fila.",
    objective: "Distinguir NoSQL de SQL y la seguridad de DynamoDB",
    tags: ["NoSQL", "gestionado", "multi-AZ", "KMS"],
    fileName: "dynamodb-basics",
    completed: false,
    theory: `📚 TEORÍA: La visión general de DynamoDB (318 y 341)

DynamoDB es una base de datos **NoSQL** (no relacional) y **distribuida**:

  • Totalmente gestionada, de alta disponibilidad y con replicación
    en varias zonas de disponibilidad.
  • Escala de forma **horizontal** de serie y soporta millones de
    peticiones por segundo, billones de filas y cientos de terabytes.
  • Rendimiento constante y muy rápido: baja latencia al recuperar datos.
  • NO soporta consultas JOIN ni agregaciones (sumas, medias): todos los
    datos de una consulta están presentes en una misma fila.
  • Se integra con IAM para seguridad, autorización y administración.
  • Es de bajo coste y puede autoescalar.

Seguridad: cifrado **en reposo con KMS**, **en tránsito con SSL/TLS**,
acceso controlado por **IAM** y **endpoints de VPC** para acceder sin
pasar por Internet.`,
    explanationText:
      "🌍 Ejemplo cotidiano: DynamoDB es la oficina de registros municipal: no hay secretaria que cruce datos entre dos archivadores (JOIN); cada ficha ya trae toda la información escrita en su carátula, y por muy grande que sea la ciudad, hay muchas ventanillas repartidas (particiones) que atienden en paralelo.\n\nLa diferencia clave con RDS/SQL es el modelo de datos: en NoSQL modelas pensando en las consultas y no en normalizar. Por eso las opciones que ofrecen JOINs o agregaciones describen una base relacional, no DynamoDB. La seguridad (KMS, SSL/TLS, IAM, VPC endpoint) es lo que AWS pregunta en el examen cuando habla de 'acceso sin Internet'.",
    codeSnippet: "// Afirmaciones sobre la visión general de DynamoDB",
    inputs: {},
    completeCode:
      "NoSQL distribuido y gestionado | sin JOINs ni agregaciones | escala horizontal | KMS + SSL/TLS + IAM + VPC endpoint",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de DynamoDB como base de datos NoSQL y sus características de seguridad.",
      statements: [
        {
          id: "a",
          text: "DynamoDB es una base de datos NoSQL (no relacional), distribuida, totalmente gestionada y con replicación en varias zonas de disponibilidad.",
          answer: true,
          explanation:
            "Correcto: gestionada, alta disponibilidad y multi-AZ desde el diseño.",
        },
        {
          id: "b",
          text: "DynamoDB soporta consultas JOIN y agregaciones complejas (sumatorios, medias) igual que una base de datos relacional.",
          answer: false,
          explanation:
            "Falso: en DynamoDB no hay JOINs y todos los datos de una consulta están en una misma fila.",
        },
        {
          id: "c",
          text: "DynamoDB escala de forma horizontal y puede manejar millones de peticiones por segundo con baja latencia constante.",
          answer: true,
          explanation:
            "Correcto: es distribuida y su rendimiento es muy rápido y constante.",
        },
        {
          id: "d",
          text: "DynamoDB cifra los datos en reposo con KMS, en tránsito con SSL/TLS, controla el acceso con IAM y ofrece endpoints de VPC para no pasar por Internet.",
          answer: true,
          explanation:
            "Correcto: esa es la tríada de seguridad que AWS destaca para DynamoDB.",
        },
      ],
    },
  },

  {
    id: 2,
    title: "Tablas, elementos y atributos: los 400 KB",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "DynamoDB se organiza en tablas con clave primaria fija, infinitos elementos y atributos flexibles que pueden ser nulos. El límite por elemento es de 400 KB.",
    objective: "Entender tabla, elemento, atributo y tipos de datos",
    tags: ["tablas", "elementos", "atributos", "400KB"],
    fileName: "dynamodb-basics",
    completed: false,
    theory: `📚 TEORÍA: Conceptos básicos (318 y 319)

DynamoDB está formado por **tablas**; cada tabla tiene una **clave
primaria** que se decide en el momento de la creación y puede contener
un número infinito de **elementos** (filas).

  • Cada elemento tiene **atributos**, y se pueden añadir atributos nuevos
    con el tiempo (o dejarlos en **null** sin problemas, a diferencia de
    SQL).
  • Tamaño máximo de un elemento: **400 kilobytes**.
  • Tipos de datos soportados:
      - **Escalares**: string, número, binario, booleano, null.
      - **Documentos**: listas y mapas.
      - **Conjuntos**: de strings, de números y de binarios.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la tabla es el edificio, cada elemento es una ficha de usuario y los atributos son los campos de la ficha. En una hoja de cálculo puedes dejar 'edad' en blanco para un usuario; en SQL eso rompería el esquema, en DynamoDB es un campo null perfectamente válido.\n\nEl límite de 400 KB por elemento es clave en el examen: imágenes o vídeos grandes NO caben en DynamoDB y se guardan en S3 (con la URL en la tabla). La flexibilidad de atributos es la gran ventaja frente a RDS.",
    codeSnippet: `DynamoDB se organiza en [INPUT_1]. Cada tabla tiene una [INPUT_2] fija y puede contener un número infinito de [INPUT_3], cada uno con sus [INPUT_4] (que pueden ser nulos). El tamaño máximo de un elemento es de [INPUT_5] kilobytes.`,
    inputs: {
      INPUT_1: "tablas",
      INPUT_2: "clave primaria",
      INPUT_3: ["elementos", "elementos / ítems"],
      INPUT_4: "atributos",
      INPUT_5: "400",
    },
    completeCode:
      "tablas → clave primaria → elementos (∞) → atributos (null ok) | máx. 400 KB por elemento",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa los conceptos básicos de una tabla de DynamoDB.",
      options: {
        INPUT_1: ["tablas", "buckets", "clústeres", "colecciones"],
        INPUT_2: ["clave primaria", "clave secundaria", "índice global", "partición"],
        INPUT_3: ["elementos", "objetos", "contenedores", "documentos"],
        INPUT_4: ["atributos", "columnas", "metadatos", "particiones"],
        INPUT_5: ["400", "64", "1024", "250"],
      },
    },
  },

  {
    id: 3,
    title: "Clave primaria: partición y ordenación",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "La clave primaria se decide al crear la tabla y tiene dos formas: solo clave de partición (hash único) o clave de partición + clave de ordenación (composite).",
    objective: "Distinguir partition key y composite key",
    tags: ["clave primaria", "partition key", "sort key", "hash"],
    fileName: "dynamodb-keys",
    completed: false,
    theory: `📚 TEORÍA: Las claves primarias (318)

La clave primaria debe elegirse cuando se **crea** la tabla. Dos opciones:

  • **Opción 1 — Solo clave de partición**: actúa como un **hash**.
    Debe ser única para cada elemento y lo más **diversa** posible para
    que los datos queden bien distribuidos (p. ej. \`userId\`).
  • **Opción 2 — Clave de partición + clave de ordenación**: la
    **combinación** de ambas debe ser única para cada elemento. Los datos
    se agrupan por clave de partición y la clave de ordenación clasifica
    y ordena dentro del grupo (p. ej. \`userId\` + \`postTimestamp\`).

Con una clave compuesta puedes tener muchos elementos con la MISMA clave
de partición siempre que la de ordenación cambie: es el patrón típico de
'los posts de un usuario'.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la clave de partición es el número del edificio (te lleva a una manzana concreta) y la clave de ordenación es el número de piso dentro de ese edificio. Puede haber muchos pisos en el mismo edificio, pero no dos apartamentos con el mismo edificio y el mismo piso.\n\nEn el examen, 'clave primaria decidida al crear la tabla' y 'combinación única' son las trampas habituales. Elegir una partición poco diversa (por ejemplo por idioma) concentra los datos y degrada el rendimiento.",
    codeSnippet: `La clave primaria se elige al [INPUT_1] la tabla.
Opción 1: solo clave de [INPUT_2], que actúa como un hash y debe ser única
y lo más [INPUT_3] posible para distribuir los datos.
Opción 2: clave de partición + clave de [INPUT_4]: la combinación de ambas
debe ser única y permite agrupar y ordenar los elementos.`,
    inputs: {
      INPUT_1: "crear",
      INPUT_2: "partición",
      INPUT_3: ["diversa", "diversa/distribuida"],
      INPUT_4: "ordenación",
    },
    completeCode:
      "partition key única (hash) | partition + sort key: combinación única, agrupa por partición",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa cómo se definen las claves primarias de DynamoDB.",
      options: {
        INPUT_1: ["crear", "consultar", "insertar", "borrar"],
        INPUT_2: ["partición", "ordenación", "secundaria", "índice"],
        INPUT_3: ["diversa", "corta", "idéntica", "global"],
        INPUT_4: ["ordenación", "partición", "cifrado", "caché"],
      },
    },
  },

  {
    id: 4,
    title: "Cardinalidad: la mejor clave de partición",
    stars: 2,
    category: "FUNDAMENTOS",
    description:
      "Pregunta clásica de examen: construyes una base de datos de películas. ¿Qué clave de partición maximiza la distribución de los datos?",
    objective: "Elegir la clave con mayor cardinalidad",
    tags: ["cardinalidad", "distribución", "clave de partición"],
    fileName: "dynamodb-keys",
    completed: false,
    theory: `📚 TEORÍA: La cardinalidad (318)

Cuando eliges una clave de partición debes buscar la **máxima
cardinalidad**: el número de valores distintos que puede tomar.

  • \`movieID\` → cada película tiene un identificador distinto: altísima
    cardinalidad, distribución perfecta.
  • \`movieLanguage\` → pocos valores y sesgados (la mayoría de películas
    son en inglés): muchos elementos compartirán clave y eso concentra
    los datos en pocas particiones.

La regla del instructor: *"siempre asegúrate de elegir una clave con la
máxima cardinalidad posible"*. Es una pregunta típica de certificación.`,
    explanationText:
      "🌍 Ejemplo cotidiano: si repartes a mil personas en 10 pisos, algunos pisos se llenan y otros quedan vacíos; si repartes por número de documento de identidad (ID), cada uno va a un sitio distinto y todos los pisos se usan por igual.\n\nmovieID tiene un valor único por película (máxima cardinalidad); movieLanguage se sesga hacia el inglés y deja la mayoría de elementos en la misma partición. En el examen busca siempre el campo con más valores distintos posibles.",
    codeSnippet: `# Base de datos de películas. ¿Cuál es la mejor clave de partición
# para maximizar la distribución de los datos?
# Opciones: movieID, movieLanguage, releaseYear, movieRating`,
    inputs: {},
    completeCode: "movieID: máxima cardinalidad → mejor distribución",
    format: "prediction",
    prediction: {
      prompt:
        "Construyes una base de datos de películas. ¿Cuál es la mejor clave de partición para maximizar la distribución de los datos?",
      snippet: `# Tabla de películas con atributos:
# movieID, movieLanguage, releaseYear, movieRating...`,
      options: [
        "movieID: tiene la máxima cardinalidad (un valor único por película) y distribuye los datos perfectamente.",
        "movieLanguage: agrupar por idioma acelera las consultas más frecuentes de la aplicación.",
        "releaseYear: el año de estreno es el dato más estable y nunca cambia.",
        "movieRating: las valoraciones populares atraen más usuarios a una misma partición.",
      ],
      answer:
        "movieID: tiene la máxima cardinalidad (un valor único por película) y distribuye los datos perfectamente.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── RENDIMIENTO (320: WCU y RCU) ────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Calcular WCU: escrituras por segundo",
    stars: 2,
    category: "RENDIMIENTO",
    description:
      "1 WCU = 1 escritura por segundo para un elemento de hasta 1 KB. Si el elemento es más grande o hay más escrituras, las unidades se multiplican.",
    objective: "Calcular unidades de capacidad de escritura",
    tags: ["WCU", "capacidad", "cálculo", "1KB"],
    fileName: "dynamodb-capacity",
    completed: false,
    theory: `📚 TEORÍA: Unidades de capacidad de escritura (320)

Una **WCU** (Write Capacity Unit) representa **una escritura por segundo**
para un elemento de **hasta 1 kilobyte** de tamaño.

Fórmula: elementos por segundo × (tamaño del elemento ÷ 1 KB).

Ejemplos del instructor (memorízalos, son preguntas de examen):

  • 10 elementos/s de 2 KB → 10 × (2 ÷ 1) = **20 WCU**.
  • 6 elementos/s de 4.5 KB → 6 × (5 ÷ 1) = **30 WCU**
    (4.5 KB se redondea AL ARRIBA a 5).
  • 120 elementos/minuto de 2 KB → (120 ÷ 60) × 2 = **4 WCU**
    (convierte el minuto a segundos primero).

Si superas las unidades provisionadas, DynamoDB devuelve excepciones de
estrangulamiento (throttling); la práctica recomendada es el **backoff
exponencial**, disponible en el SDK.`,
    explanationText:
      "🌍 Ejemplo cotidiano: cada WCU es un operario que solo puede empaquetar cajas de hasta 1 kg por segundo. Si tus cajas pesan 2 kg, necesitas dos operarios por caja; y si llegan 10 cajas por segundo, multiplicas por 10.\n\nEl truco del examen está en el redondeo: 4.5 KB cuenta como 5 KB (siempre hacia arriba). Y cuidado con las unidades: si te dan escrituras por MINUTO, primero pasas a segundos dividiendo entre 60.",
    codeSnippet: `# Escribes 10 elementos por segundo con un tamaño de 2 KB cada uno.
# 1 WCU = 1 escritura/segundo para un elemento de hasta 1 KB.
# WCU necesarias = 10 × (2 ÷ 1) = ?`,
    inputs: {},
    completeCode: "10 × (2 ÷ 1) = 20 WCU",
    format: "prediction",
    prediction: {
      prompt:
        "Escribes 10 elementos por segundo, cada uno de 2 KB. ¿Cuántas unidades de capacidad de escritura (WCU) necesitas?",
      snippet: `# 10 elementos/segundo
# 2 KB por elemento
# 1 WCU = 1 escritura/segundo de hasta 1 KB`,
      options: [
        "20 WCU: 10 × (2 ÷ 1) = 20.",
        "10 WCU: el tamaño del elemento no afecta a la capacidad.",
        "5 WCU: 10 × (1 ÷ 2) = 5.",
        "2 WCU: una WCU por kilobyte total escrito al segundo.",
      ],
      answer: "20 WCU: 10 × (2 ÷ 1) = 20.",
    },
  },

  {
    id: 6,
    title: "RCU y consistencia: eventual vs fuerte",
    stars: 2,
    category: "RENDIMIENTO",
    description:
      "Leer justo después de escribir puede devolver datos obsoletos (consistencia eventual). La lectura fuertemente consistente siempre devuelve lo actual... a costa del doble de RCU.",
    objective: "Distinguir consistencia eventual y fuerte en las lecturas",
    tags: ["RCU", "consistencia", "eventual", "4KB"],
    fileName: "dynamodb-capacity",
    completed: false,
    theory: `📚 TEORÍA: RCU y consistencia de lectura (320)

Una **RCU** (Read Capacity Unit) representa una lectura fuertemente
consistente por segundo, o **dos lecturas eventualmente consistentes**
por segundo, para un elemento de hasta **4 kilobytes**.

  • **Eventualmente consistente** (por defecto): si lees justo después
    de una escritura, es posible que obtengas datos obsoletos porque la
    replicación aún no ha llegado al servidor del que lees.
  • **Fuertemente consistente** (\`ConsistentRead: true\`): siempre
    devuelve los datos actuales, pero consume **el doble de RCU**.

Cálculo: lecturas/segundo × (tamaño ÷ 4 KB). Si el tamaño no divide
exacto a 4 KB, se redondea al múltiplo de 4 KB superior (p. ej. 6 KB
cuenta como 8 KB).`,
    explanationText:
      "🌍 Ejemplo cotidiano: la consistencia eventual es la pizarra compartida en la oficina: la actualiza tu compañero en su pantalla y tardas unos segundos en verla. La consistencia fuerte es ir a su escritorio a mirar el documento original: siempre es lo actual, pero cuesta más esfuerzo.\n\nEn el examen, 'lectura por defecto eventualmente consistente' y 'la fuerte cuesta el doble de RCU' son las dos ideas que no debes mezclar. El redondeo a múltiplos de 4 KB también aparece en los cálculos.",
    codeSnippet: "// Afirmaciones sobre unidades de capacidad de lectura y consistencia",
    inputs: {},
    completeCode:
      "1 RCU = 1 lectura fuerte/s o 2 eventuales/s de hasta 4 KB | fuerte = 2x RCU",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de las RCU y la consistencia de lectura en DynamoDB.",
      statements: [
        {
          id: "a",
          text: "La lectura eventualmente consistente es la que viene por defecto: si lees justo después de una escritura, puedes obtener datos obsoletos por la replicación.",
          answer: true,
          explanation:
            "Correcto: la réplica puede no haber llegado aún al servidor del que lees.",
        },
        {
          id: "b",
          text: "Una lectura fuertemente consistente (ConsistentRead: true) siempre devuelve los datos actuales y consume el doble de unidades de capacidad de lectura.",
          answer: true,
          explanation:
            "Correcto: garantiza el dato actual a cambio de 2x RCU.",
        },
        {
          id: "c",
          text: "1 RCU equivale a 2 lecturas fuertemente consistentes por segundo de hasta 4 KB, o 1 lectura eventualmente consistente.",
          answer: false,
          explanation:
            "Falso: es al revés — 1 lectura fuerte o 2 eventualmente consistentes por segundo.",
        },
        {
          id: "d",
          text: "Si el elemento supera los 4 KB, una lectura consume más de una RCU (redondeando el tamaño al múltiplo de 4 KB superior).",
          answer: true,
          explanation:
            "Correcto: p. ej. 6 KB cuenta como 8 KB y consume 2 RCU por lectura.",
        },
      ],
    },
  },

  {
    id: 7,
    title: "Provisionado, on-demand y claves calientes",
    stars: 3,
    category: "RENDIMIENTO",
    description:
      "El modo provisionado planifica la capacidad de antemano; el on-demand escala solo, pero cuesta ~2.5 veces más. Y si una clave se lee demasiado, llega el estrangulamiento.",
    objective: "Dominar los modos de capacidad y la fragmentación de escrituras",
    tags: ["provisionado", "on-demand", "hot key", "fragmentación"],
    fileName: "dynamodb-capacity",
    completed: false,
    theory: `📚 TEORÍA: Modos de capacidad y estrangulamiento (320 y 337)

**Modo provisionado** (por defecto): defines las unidades de lectura y
escritura de antemano y pagas por ellas. Puedes activar **autoescalado**
con un rango (mínimo, máximo y porcentaje). El rendimiento puede superar
el límite temporalmente con la **capacidad de ráfaga**; al agotarla,
llegan excepciones de **estrangulamiento**.

**Modo bajo demanda**: las lecturas y escrituras suben y bajan solas sin
planificar. Ideal para cargas impredecibles o picos (Black Friday), pero
es **~2.5 veces más caro** que el provisionado. Puedes cambiar de modo
**una vez cada 24 horas**.

Estrangulamiento: suele deberse a **claves calientes** (una partición muy
leída). Soluciones: backoff exponencial, distribuir las claves de
partición y usar DAX para las lecturas. En escrituras (p. ej. una app de
votación), se **fragmenta la clave** añadiendo un **sufijo aleatorio o
calculado** (candidatoA-11, candidatoA-17...) para repartir las
escrituras entre más particiones.`,
    explanationText:
      "🌍 Ejemplo cotidiano: provisionado es contratar un número fijo de cajeros por adelantado; on-demand es abrir ventanillas automáticas que aparecen solo cuando hay cola (cómodo, pero cada operación cuesta más). La clave caliente es la fila eterna del único cajero popular de un supermercado; añadir sufijos es abrir más cajas de pago para el mismo pasillo.\n\nEl examen pregunta los números: on-demand ~2.5x más caro, cambio de modo 1 vez cada 24 h. Y la estrategia de fragmentación con sufijos es la solución que AWS propone para las particiones calientes en escrituras.",
    codeSnippet: "// Afirmaciones sobre modos de capacidad, estrangulamiento y fragmentación",
    inputs: {},
    completeCode:
      "Provisionado: planificar + autoscaling | on-demand: ~2.5x más caro, cambio 1 vez/24h | hot key → sufijos en la clave",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida modos de capacidad, estrangulamiento y estrategias de fragmentación.",
      statements: [
        {
          id: "a",
          text: "El modo provisionado es el que viene por defecto: defines de antemano las unidades de lectura y escritura y pagas por ellas, con opción de autoescalado.",
          answer: true,
          explanation:
            "Correcto: requiere planificar la capacidad antes de crear la tabla.",
        },
        {
          id: "b",
          text: "El modo bajo demanda escala solo y no requiere planificar, pero es aproximadamente 2.5 veces más caro que el provisionado.",
          answer: true,
          explanation:
            "Correcto: pagas por lo que usas, con un recargo importante.",
        },
        {
          id: "c",
          text: "Puedes cambiar entre modo provisionado y bajo demanda tantas veces como quieras a lo largo del día.",
          answer: false,
          explanation:
            "Falso: el cambio entre modos solo se permite una vez cada 24 horas.",
        },
        {
          id: "d",
          text: "Una clave caliente (hot key) es una clave de partición que recibe demasiadas lecturas; una solución es distribuir las escrituras añadiendo un sufijo (aleatorio o calculado) a la clave de partición.",
          answer: true,
          explanation:
            "Correcto: la fragmentación con sufijos reparte los datos entre más particiones.",
        },
        {
          id: "e",
          text: "Al superar la capacidad provisionada, DynamoDB devuelve excepciones por estrangulamiento (throttling); la práctica recomendada es usar backoff exponencial.",
          answer: true,
          explanation:
            "Correcto: el backoff exponencial está disponible en el SDK de AWS.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── OPERACIONES (322: operaciones básicas, 338: tipos de escritura) ─────
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Las operaciones básicas de la API",
    stars: 2,
    category: "OPERACIONES",
    description:
      "PutItem, UpdateItem, GetItem, Query, Scan y DeleteItem son el día a día de DynamoDB. Empareja cada llamada con lo que hace.",
    objective: "Emparejar cada operación de la API con su efecto",
    tags: ["PutItem", "Query", "Scan", "DeleteItem"],
    fileName: "dynamodb-api",
    completed: false,
    theory: `📚 TEORÍA: Operaciones básicas de la API (322)

  • **PutItem** → crea un elemento nuevo o sustituye por completo un
    elemento existente con la misma clave primaria. Consume WCU.
  • **UpdateItem** → edita atributos de un elemento existente o añade
    atributos nuevos. También sirve para **contadores atómicos**
    (incrementar un atributo numérico de forma incondicional).
  • **GetItem** → lectura por clave primaria. Por defecto eventualmente
    consistente; se pueden devolver solo algunos atributos con una
    *projection expression*.
  • **Query** → devuelve elementos por **clave de partición** (obligatoria)
    y opcionalmente con condiciones sobre la clave de ordenación (=, <,
    >, entre fechas, empieza por...). Puede paginarse y filtra después.
  • **Scan** → escanea TODA la tabla y después filtra: funciona, pero es
    **ineficiente** y consume muchas RCU. Devuelve hasta 1 MB.
  • **DeleteItem** → borra un elemento individual, y puede hacerlo de
    forma condicional. Para vaciar una tabla entera, mejor borrar la
    tabla y recrearla (más rápido y barato).

Operaciones por lotes: **BatchWriteItem** (hasta 25 PutItem/DeleteItem,
16 MB, NO permite UpdateItem) y **BatchGetItem** (hasta 100 elementos).`,
    explanationText:
      "🌍 Ejemplo cotidiano: PutItem es reescribir la ficha completa del archivador; UpdateItem es corregir solo un campo con un bolígrafo (o sumar 1 a un contador); GetItem es sacar UNA ficha; Query es pedir todas las fichas de un mismo cliente ordenadas por fecha; Scan es vaciar todos los cajones y revisar cada papel para encontrar lo que buscas.\n\nEn el examen, la pareja Query vs Scan es la más preguntada: Query es eficiente porque sabe por qué partición buscar; Scan lo lee todo. Y recuerda que BatchWriteItem no admite actualizaciones: para editar, siempre UpdateItem.",
    codeSnippet: "// Empareja cada operación de la API con lo que hace",
    inputs: {},
    completeCode:
      "PutItem crea/sustituye | UpdateItem edita y cuenta atómicamente | GetItem lee 1 por clave | Query por partición | Scan todo | DeleteItem borra 1",
    format: "matching",
    matching: {
      prompt: "Conecta cada operación de la API de DynamoDB con su función.",
      definitions: [
        "Lee un único elemento por su clave primaria. Por defecto la lectura es eventualmente consistente y se pueden proyectar solo algunos atributos.",
        "Escanea TODA la tabla y después filtra: funciona pero consume muchas unidades de lectura; devuelve hasta 1 MB y se puede paginar.",
        "Crea un elemento nuevo o sustituye por completo un elemento existente con la misma clave primaria. Consume unidades de capacidad de escritura.",
        "Actualiza atributos de un elemento existente o añade atributos nuevos; también permite incrementar contadores de forma atómica.",
        "Elimina un elemento individual, y puede hacerlo de forma condicional (solo si se cumple una condición).",
        "Devuelve elementos por clave de partición (obligatoria) y, opcionalmente, con condiciones sobre la clave de ordenación. Es la lectura eficiente.",
      ],
      pairs: [
        {
          id: "get",
          term: "GetItem",
          definition:
            "Lee un único elemento por su clave primaria. Por defecto la lectura es eventualmente consistente y se pueden proyectar solo algunos atributos.",
        },
        {
          id: "scan",
          term: "Scan",
          definition:
            "Escanea TODA la tabla y después filtra: funciona pero consume muchas unidades de lectura; devuelve hasta 1 MB y se puede paginar.",
        },
        {
          id: "put",
          term: "PutItem",
          definition:
            "Crea un elemento nuevo o sustituye por completo un elemento existente con la misma clave primaria. Consume unidades de capacidad de escritura.",
        },
        {
          id: "update",
          term: "UpdateItem",
          definition:
            "Actualiza atributos de un elemento existente o añade atributos nuevos; también permite incrementar contadores de forma atómica.",
        },
        {
          id: "delete",
          term: "DeleteItem",
          definition:
            "Elimina un elemento individual, y puede hacerlo de forma condicional (solo si se cumple una condición).",
        },
        {
          id: "query",
          term: "Query",
          definition:
            "Devuelve elementos por clave de partición (obligatoria) y, opcionalmente, con condiciones sobre la clave de ordenación. Es la lectura eficiente.",
        },
      ],
    },
  },

  {
    id: 9,
    title: "Bug Hunt: Scan cuando deberías usar Query",
    stars: 3,
    category: "OPERACIONES",
    description:
      "El anti-patrón clásico: escanear toda la tabla y filtrar después para buscar algo que ya conoces por su clave de partición.",
    objective: "Detectar un Scan innecesario en el código",
    tags: ["bug-hunt", "Scan", "Query", "RCU"],
    fileName: "get-user-posts.js",
    completed: false,
    theory: `📚 TEORÍA: Scan vs Query (322)

La llamada **Scan** recorre TODA la tabla y luego filtra los datos: es
**ineficiente**, consume muchas unidades de capacidad de lectura y solo
debería usarse cuando no hay más remedio.

La llamada **Query** se basa en la **clave de partición** (obligatoria):
si conoces el valor de la clave (p. ej. \`userId\`), Query salta
directamente a la partición correcta y devuelve solo lo que te interesa.

Regla: si ya conoces la clave de partición, **siempre Query antes que
Scan**. El escaneo en paralelo o el límite de tamaño ayudan, pero no
arreglan el problema de fondo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: buscar las facturas de un cliente concreto recorriendo TODOS los cajones del archivo (Scan) en vez de ir directo al cajón que tiene su etiqueta (Query).\n\nEl código es correcto sintácticamente: el bug es de diseño. Al saber que buscas por \`userId\` (clave de partición), un Query resuelve el mismo problema consumiendo una fracción de las RCU. Por eso la opción que dice 'no hay bug' o que culpa a la sintaxis son distracciones.",
    codeSnippet: `// Buscar TODOS los posts publicados por el usuario 'john123'
const params = {
  TableName: 'user-posts',
  FilterExpression: 'userId = :uid',
  ExpressionAttributeValues: { ':uid': { S: 'john123' } }
};
await dynamodb.scan(params).promise();`,
    inputs: {},
    completeCode:
      "Usar Query con KeyConditionExpression por userId en lugar de Scan + FilterExpression",
    format: "bug-hunt",
    bugHunt: {
      prompt:
        "Este código busca los posts de un usuario concreto de la tabla user-posts (clave de partición: userId). ¿Qué problema tiene?",
      snippet: `// Buscar TODOS los posts publicados por el usuario 'john123'
const params = {
  TableName: 'user-posts',
  FilterExpression: 'userId = :uid',
  ExpressionAttributeValues: { ':uid': { S: 'john123' } }
};
await dynamodb.scan(params).promise();`,
      options: [
        "El código escanea TODA la tabla y luego filtra por userId: como ya conocemos la clave de partición, una Query por userId sería mucho más eficiente y consumiría menos RCU.",
        "No hay bug: el Scan es la operación más rápida cuando ya se sabe qué usuario se busca.",
        "El bug es que FilterExpression no existe en la API de DynamoDB: esa expresión solo se usa en consultas SQL.",
        "El bug es que falta el atributo de ordenación en la petición para que el Scan funcione.",
      ],
      correct: 0,
    },
  },

  {
    id: 10,
    title: "Escrituras concurrentes, condicionales y atómicas",
    stars: 3,
    category: "OPERACIONES",
    description:
      "Dos usuarios incrementan el mismo contador a la vez. Si la escritura es atómica, los dos incrementos se suman; si es concurrente, el último sobrescribe.",
    objective: "Distinguir los tipos de escritura de DynamoDB",
    tags: ["escritura atómica", "concurrencia", "UpdateItem", "ADD"],
    fileName: "counter-update.js",
    completed: false,
    theory: `📚 TEORÍA: Tipos de escritura (338)

  • **Escrituras concurrentes**: dos usuarios piden actualizar el mismo
    valor al mismo tiempo. La **segunda sobrescribe a la primera**. No es
    una práctica recomendada.
  • **Escrituras condicionales**: la actualización solo se aplica si se
    cumple una condición (p. ej. 'solo si el valor actual es 0'). La
    primera escritura gana; la segunda falla porque el valor ya cambió.
  • **Escrituras atómicas** (\`UpdateItem\` con incremento): cada usuario
    pide 'añadir 1' y 'añadir 2'. Los dos incrementos se **suman** al
    valor final (0 + 1 + 2 = 3) sin perderse ninguno.
  • **Escrituras por lotes**: escriben o actualizan muchos elementos a la
    vez, pero son un caso distinto.

Las escrituras condicionales también se usan para escribir, actualizar o
borrar 'solo si' un atributo existe, no existe, pertenece a un rango o
cumple una comparación de strings.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la escritura concurrente es la última persona en apuntarse en la lista de la pizarra (tacha lo anterior); la condicional es 'solo me apunto si el puesto sigue libre'; la atómica es la máquina de turnos: cada persona pulsa el botón y el número se suma automáticamente sin que nadie pise el turno del otro.\n\nCon incrementos atómicos de 1 y 2 sobre un valor 0, el resultado es 3: DynamoDB ejecuta la suma sobre el valor actual sin condiciones de carrera. La trampa del examen es confundirlo con la escritura concurrente, donde el último sobrescribe.",
    codeSnippet: `// Dos usuarios incrementan el MISMO contador a la vez:
// Usuario 1: UpdateItem ADD 1  (contador = 0 + 1)
// Usuario 2: UpdateItem ADD 2  (contador = ? )`,
    inputs: {},
    completeCode:
      "Atómicas: suman (0+1+2=3) | concurrentes: sobrescribe el último | condicionales: fallan si no se cumple",
    format: "prediction",
    prediction: {
      prompt:
        "Un contador vale 0. Dos usuarios lanzan a la vez un UpdateItem con incremento atómico (ADD): el primero suma 1 y el segundo suma 2. ¿Cuál es el valor final?",
      snippet: `// Contador inicial: 0
// Usuario 1: UpdateItem ... ADD 1
// Usuario 2: UpdateItem ... ADD 2
// ¿Valor final del contador?`,
      options: [
        "3: las escrituras atómicas suman ambos incrementos (0 + 1 + 2) sin que uno pise al otro.",
        "2: gana la última escritura que llegue y sobrescribe la anterior.",
        "1: solo se aplica la primera escritura; la segunda falla por conflicto.",
        "0: DynamoDB bloquea las escrituras concurrentes sobre el mismo elemento.",
      ],
      answer:
        "3: las escrituras atómicas suman ambos incrementos (0 + 1 + 2) sin que uno pise al otro.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── ÍNDICES Y PARTIQL (325: GSI+LSI, 327: PartiQL) ──────────────────────
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "GSI vs LSI: dos formas de acelerar consultas",
    stars: 3,
    category: "ÍNDICES Y PARTIQL",
    description:
      "El LSI añade una clave de ordenación alternativa (solo al crear la tabla). El GSI crea una clave primaria alternativa que puedes añadir en cualquier momento.",
    objective: "Distinguir índices secundarios globales y locales",
    tags: ["GSI", "LSI", "índices", "capacidad"],
    fileName: "dynamodb-indexes",
    completed: false,
    theory: `📚 TEORÍA: Índices secundarios (325)

**LSI (Local Secondary Index)**:
  • Aporta una **clave de ordenación alternativa** conservando la clave
    de partición de la tabla base.
  • Máximo **5 por tabla** y **solo se pueden crear al definir la tabla**.
  • Usa las unidades de capacidad de **la tabla principal** (sin
    consideración especial de estrangulamiento).

**GSI (Global Secondary Index)**:
  • Aporta una **clave primaria totalmente alternativa** (partición o
    partición + ordenación) para acelerar consultas sobre atributos que
    no son clave.
  • Se puede **crear después** de crear la tabla.
  • Tiene **unidades de capacidad propias** de lectura y escritura.
  • OJO: si las escrituras del GSI se estrangulan, **también se
    estrangula la tabla principal**, aunque las unidades de la tabla
    estén bien: elige con cuidado su clave de partición.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el LSI es añadir una segunda fecha en la etiqueta del mismo archivador (misma estantería, otro orden); el GSI es crear un índice de tarjetas en otra habitación que te lleva directo a la estantería (clave primaria nueva). El LSI se decide cuando montas el archivo; el GSI lo puedes añadir después.\n\nLa regla de oro del examen: LSI solo al crear la tabla y máximo 5; GSI en cualquier momento con capacidad propia. Y la trampa del estrangulamiento: un GSI estrangulado 'contagia' a la tabla principal.",
    codeSnippet: "// Empareja cada tipo de índice secundario con su característica",
    inputs: {},
    completeCode:
      "LSI: nueva sort key, solo al crear, usa WCU/RCU de la tabla | GSI: nueva primary key, cualquier momento, capacidad propia",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada concepto de los índices secundarios con su característica.",
      definitions: [
        "Aporta una clave primaria completamente alternativa (partición y/o ordenación) para acelerar consultas por atributos que no son clave. Se puede crear después.",
        "Si las escrituras de este índice se estrangulan, también se estrangulan en la tabla principal, aunque las unidades de esta estén bien.",
        "Aporta una clave de ordenación alternativa conservando la clave de partición de la tabla base. Solo se define al crear la tabla (máximo 5).",
        "No tiene unidades de capacidad propias: usa las unidades de lectura y escritura de la tabla principal.",
      ],
      pairs: [
        {
          id: "gsi",
          term: "GSI (Global Secondary Index)",
          definition:
            "Aporta una clave primaria completamente alternativa (partición y/o ordenación) para acelerar consultas por atributos que no son clave. Se puede crear después.",
        },
        {
          id: "gsi-throttle",
          term: "Estrangulamiento de un GSI",
          definition:
            "Si las escrituras de este índice se estrangulan, también se estrangulan en la tabla principal, aunque las unidades de esta estén bien.",
        },
        {
          id: "lsi",
          term: "LSI (Local Secondary Index)",
          definition:
            "Aporta una clave de ordenación alternativa conservando la clave de partición de la tabla base. Solo se define al crear la tabla (máximo 5).",
        },
        {
          id: "lsi-capacity",
          term: "Capacidad de un LSI",
          definition:
            "No tiene unidades de capacidad propias: usa las unidades de lectura y escritura de la tabla principal.",
        },
      ],
    },
  },

  {
    id: 12,
    title: "PartiQL: SQL para DynamoDB",
    stars: 2,
    category: "ÍNDICES Y PARTIQL",
    description:
      "PartiQL es una sintaxis muy similar a SQL para manipular tablas de DynamoDB: SELECT, INSERT, UPDATE y DELETE. Lo que NO tienes son los JOINs.",
    objective: "Saber qué operaciones soporta PartiQL",
    tags: ["PartiQL", "SQL", "SELECT", "JOIN"],
    fileName: "partiql",
    completed: false,
    theory: `📚 TEORÍA: PartiQL (322 y 327)

**PartiQL** es un lenguaje de consulta compatible con SQL para DynamoDB:
te permite hacer las llamadas de siempre, pero escribiendo SQL.

  • Soporta **SELECT**, **INSERT**, **UPDATE**, **DELETE** y también
    operaciones por lotes.
  • NO soporta **JOINs** (uniones), como cualquier lenguaje NoSQL.
  • Se puede ejecutar desde la **consola** de AWS (editor PartiQL), desde
    **NoSQL Workbench**, desde la **API** de DynamoDB y desde la **CLI**.

Si vienes de SQL (MySQL, PostgreSQL), PartiQL es la puerta de entrada
natural: por ejemplo, \`SELECT * FROM usuarios WHERE userId = '123'\`.`,
    explanationText:
      "🌍 Ejemplo cotidiano: PartiQL es el intérprete que traduce tu castellano de SQL (SELECT, INSERT...) al idioma de DynamoDB. Cómodo si vienes de bases relacionales, pero con una excepción clara: no hay JOIN porque aquí no se cruzan tablas.\n\nLa trampa del examen es la palabra JOIN: PartiQL parece SQL completo, pero al ser NoSQL no une tablas. Todo lo demás (insert, update, select, delete, lotes) sí está disponible.",
    codeSnippet: `# PartiQL es un lenguaje compatible con SQL para DynamoDB.
# Soporta: SELECT, INSERT, UPDATE, DELETE y operaciones por lotes.
# NO soporta: [INPUT_1]  (uniones entre tablas)`,
    inputs: {
      INPUT_1: ["JOIN", "join", "JOINs"],
    },
    completeCode:
      "PartiQL: SELECT/INSERT/UPDATE/DELETE + lotes | sin JOINs | consola, NoSQL Workbench, API y CLI",
    format: "prediction",
    prediction: {
      prompt:
        "Un desarrollador viene de MySQL y quiere usar SQL con DynamoDB. ¿Qué afirmación describe correctamente PartiQL?",
      snippet: `# PartiQL: SELECT * FROM usuarios WHERE userId = '123'
# ¿Qué se puede hacer con PartiQL en DynamoDB?`,
      options: [
        "Es un lenguaje compatible con SQL para DynamoDB: soporta SELECT, INSERT, UPDATE, DELETE y operaciones por lotes, pero NO soporta JOINs.",
        "Es un reemplazo completo de SQL que permite JOINs y agregaciones complejas entre varias tablas.",
        "Solo permite operaciones de lectura (SELECT); las escrituras se hacen siempre con PutItem.",
        "Es una herramienta de terceros para migrar bases de datos MySQL a DynamoDB.",
      ],
      answer:
        "Es un lenguaje compatible con SQL para DynamoDB: soporta SELECT, INSERT, UPDATE, DELETE y operaciones por lotes, pero NO soporta JOINs.",
    },
  },

  {
    id: 13,
    title: "Bloqueo optimista: la versión que te protege",
    stars: 3,
    category: "ESCRITURAS Y CONCURRENCIA",
    description:
      "El bloqueo optimista asegura que un elemento no ha cambiado antes de actualizarlo o eliminarlo: cada elemento lleva un atributo 'version' y las escrituras se hacen con condición.",
    objective: "Entender el optimistic locking con version",
    tags: ["bloqueo optimista", "version", "escritura condicional"],
    fileName: "optimistic-locking.js",
    completed: false,
    theory: `📚 TEORÍA: Bloqueo optimista (328)

El **bloqueo optimista** (optimistic locking) es una estrategia para
asegurarse de que un elemento **no ha cambiado** antes de actualizarlo o
eliminarlo. Se apoya en las **escrituras condicionales** de DynamoDB.

Cada elemento tiene un atributo que actúa como **número de versión**:

  1. Cliente 1 pide: 'cambia el nombre de Stefan a Joan **solo si la
     versión es 1**'.
  2. A la vez, Cliente 2 pide: 'cambia el nombre a Lisa **solo si la
     versión es 1**'.
  3. Gana el primero que llega: actualiza el nombre y la versión pasa a 2.
  4. El otro cliente **falla**: su condición 'versión = 1' ya no se
     cumple.

Así se evita que dos usuarios pisoteen la misma actualización.`,
    explanationText:
      "🌍 Ejemplo cotidiano: dos personas editan el mismo documento compartido. Antes de guardar, tu editor comprueba el 'número de revisión': si ya hay una revisión más nueva que la que tú abriste, te avisa 'el documento cambió, recarga'. No se bloquea a nadie: simplemente el que llega tarde reintenta.\n\nPor eso se llama optimista: no bloqueas nada de antemano, solo validas en el último instante con una condición sobre \`version\`. Es la diferencia con las escrituras concurrentes puras, donde el último sobrescribe sin comprobar nada.",
    codeSnippet: `// Elemento: { userId: 'stefan', name: 'Stefan', version: 1 }
// Cliente 1: update name a 'Joan' SOLO SI version = 1
// Cliente 2: update name a 'Lisa' SOLO SI version = 1
// Cliente 2 llega primero: name = 'Lisa', version = 2
// ¿Qué pasa con el Cliente 1?`,
    inputs: {},
    completeCode:
      "Escritura condicional version = 1 | el primero actualiza y sube la versión | el segundo falla → bloqueo optimista",
    format: "prediction",
    prediction: {
      prompt:
        "Un elemento tiene version=1. Dos clientes intentan actualizarlo con la condición 'version = 1'. El Cliente 2 llega primero, cambia el nombre y la versión pasa a 2. ¿Qué ocurre con el Cliente 1?",
      snippet: `// Elemento: { userId: 'stefan', name: 'Stefan', version: 1 }
// Cliente 1: update name = 'Joan' SOLO SI version = 1
// Cliente 2: update name = 'Lisa' SOLO SI version = 1
// Cliente 2 llega primero → name = 'Lisa', version = 2`,
      options: [
        "Falla: su escritura condicional 'version = 1' ya no se cumple porque la versión es 2. Eso es exactamente el bloqueo optimista.",
        "Sobrescribe al Cliente 2 y la versión vuelve a 1.",
        "Se aplica igualmente: DynamoDB no valida las condiciones cuando hay concurrencia.",
        "Ambos actualizan el elemento a la vez y el resultado es una mezcla de los dos nombres.",
      ],
      answer:
        "Falla: su escritura condicional 'version = 1' ya no se cumple porque la versión es 2. Eso es exactamente el bloqueo optimista.",
    },
  },

  {
    id: 14,
    title: "DAX y el estado de sesión",
    stars: 3,
    category: "ACELERACIÓN Y EVENTOS",
    description:
      "DAX es una caché en memoria totalmente gestionada para DynamoDB que baja las lecturas a microsegundos sin cambiar la aplicación. Y DynamoDB también sirve como almacén de sesión.",
    objective: "Dominar DAX y elegir dónde guardar la sesión",
    tags: ["DAX", "caché", "microsegundos", "sesión"],
    fileName: "dax",
    completed: false,
    theory: `📚 TEORÍA: DAX y almacén de sesión (329 y 336)

**DAX (DynamoDB Accelerator)** es una **caché en memoria totalmente
gestionada** y de alta disponibilidad para DynamoDB:

  • Lecturas y consultas en caché con latencia de **microsegundos**.
  • **No requiere modificar la lógica de la aplicación**: es compatible
    con las APIs de DynamoDB existentes.
  • Resuelve el problema de las **claves calientes** (un producto que se
    lee muchísimo).
  • TTL de **5 minutos** por defecto en la caché; hasta **11 nodos** por
    clúster (3 mínimo recomendados en producción) y Multi-AZ.
  • Seguridad: cifrado en tránsito y en reposo con KMS, integración con
    VPC mediante punto de enlace, IAM y CloudTrail.

**DAX vs ElastiCache**: DAX es **específico para DynamoDB**; ElastiCache
es una caché genérica (Redis/Memcached) para cualquier base de datos.

**Estado de sesión**: DynamoDB puede actuar como caché de estado de
sesión (serverless, key-value). ElastiCache es en memoria; EFS se conecta
a EC2 como unidad de red; EBS e Instance Store solo sirven para caché
local; y S3 tiene mayor latencia y no está pensado para objetos
pequeños.`,
    explanationText:
      "🌍 Ejemplo cotidiano: DAX es la taquilla de venta rápida del estadio: los datos más pedidos ya están impresos y se entregan al instante (microsegundos), y no hace falta que el equipo de ventas aprenda un sistema nuevo (misma API). Guardar la sesión en DynamoDB es dejar el abrigo en una consigna sin servidor: lo dejas y lo recoges cuando vuelves.\n\nEl examen mezcla DAX con ElastiCache a propósito: DAX solo vale para DynamoDB, ElastiCache para cualquier cosa. Y para sesiones, las dos buenas respuestas son DynamoDB (serverless) y ElastiCache (en memoria); S3 nunca por su latencia.",
    codeSnippet: "// Afirmaciones sobre DAX y el almacenamiento de estado de sesión",
    inputs: {},
    completeCode:
      "DAX: caché de DynamoDB, microsegundos, sin cambiar la app, TTL 5 min | sesión: DynamoDB o ElastiCache, nunca S3",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de DAX y de las opciones para guardar el estado de sesión.",
      statements: [
        {
          id: "a",
          text: "DAX es una caché en memoria totalmente gestionada para DynamoDB que reduce la latencia de lecturas y consultas hasta microsegundos.",
          answer: true,
          explanation:
            "Correcto: esa es la promesa de DynamoDB Accelerator.",
        },
        {
          id: "b",
          text: "Integrar DAX obliga a reescribir la lógica de la aplicación para adaptarse a una API nueva.",
          answer: false,
          explanation:
            "Falso: DAX es compatible con las APIs de DynamoDB existentes: no se modifica la aplicación.",
        },
        {
          id: "c",
          text: "Para guardar el estado de sesión de los usuarios, DynamoDB (serverless) y ElastiCache (en memoria) son buenas opciones; S3 tiene mayor latencia y no está pensado para objetos pequeños.",
          answer: true,
          explanation:
            "Correcto: DynamoDB y ElastiCache son los almacenes clave-valor para sesiones.",
        },
        {
          id: "d",
          text: "DAX puede usarse como caché para cualquier base de datos, igual que ElastiCache.",
          answer: false,
          explanation:
            "Falso: DAX es específico para DynamoDB; ElastiCache (Redis/Memcached) sirve con cualquier base de datos.",
        },
      ],
    },
  },

  {
    id: 15,
    title: "DynamoDB Streams: cambios en tiempo real",
    stars: 3,
    category: "ACELERACIÓN Y EVENTOS",
    description:
      "Cada inserción, actualización o borrado en una tabla se convierte en un evento del stream durante 24 horas. Lambda lo lee con polling y reacciona al momento.",
    objective: "Entender DynamoDB Streams y su integración con Lambda",
    tags: ["Streams", "Lambda", "24h", "polling"],
    fileName: "dynamodb-streams",
    completed: false,
    theory: `📚 TEORÍA: DynamoDB Streams (331)

**DynamoDB Streams** captura y procesa los **cambios** de una tabla en
tiempo real: inserciones, actualizaciones y eliminaciones, como un flujo
continuo de eventos.

  • Retención de los registros: **hasta 24 horas**.
  • Destinos: una función **Lambda** (con mapeo de fuente de eventos que
    hace **polling** de los registros), **Kinesis Data Streams** o la
    librería de cliente de Kinesis (**KCL**).
  • Lambda se invoca de forma **síncrona** con un lote de registros y
    necesita **permisos** (rol IAM) para leer el stream.
  • Puedes elegir qué información va al stream: **KEYS_ONLY** (solo las
    claves), **NEW_IMAGE** (elemento después del cambio), **OLD_IMAGE**
    (elemento antes del cambio) o **NEW_AND_OLD_IMAGES** (ambos).
  • Los registros NO se rellenan retroactivamente: activar el stream no
    trae los cambios anteriores.
  • Se compone de **fragmentos** (shards) que AWS gestiona por ti.
  • Casos de uso: email de bienvenida al insertar un usuario, analíticas,
    indexación en Elasticsearch o replicación entre regiones.`,
    explanationText:
      "🌍 Ejemplo cotidiano: DynamoDB Streams es la cinta transportadora de la fábrica: cada vez que un producto cambia de estado (se crea, se edita, se retira), cae un formulario a la cinta y un robot (Lambda) lo recoge y reacciona: envía el email de bienvenida, actualiza el panel, archiva la copia. La cinta guarda los formularios durante 24 horas y se vacía.\n\nEl examen pregunta los destinos (Lambda por polling, Kinesis, KCL), las 24 horas de retención y que NO hay datos retroactivos. La opción que dice que Lambda no puede leer el stream es falsa: es el caso de uso más típico.",
    codeSnippet: "// Afirmaciones sobre DynamoDB Streams y su integración con Lambda",
    inputs: {},
    completeCode:
      "Cambios → stream 24h | Lambda polling + permisos | KEYS_ONLY / NEW_IMAGE / OLD_IMAGE | no retroactivo",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión de DynamoDB Streams.",
      statements: [
        {
          id: "a",
          text: "DynamoDB Streams captura los cambios (inserciones, actualizaciones y borrados) de una tabla como un flujo de eventos en tiempo real.",
          answer: true,
          explanation:
            "Correcto: ese es el propósito del stream de eventos.",
        },
        {
          id: "b",
          text: "Los registros de DynamoDB Streams se conservan hasta 24 horas, y los cambios anteriores a la activación del stream no aparecen retroactivamente.",
          answer: true,
          explanation:
            "Correcto: retención de 24 h y sin datos retroactivos.",
        },
        {
          id: "c",
          text: "Lambda se conecta a DynamoDB Streams mediante un mapeo de fuente de eventos y hace polling de los registros para procesarlos.",
          answer: true,
          explanation:
            "Correcto: Lambda encuesta el stream y recibe lotes de registros.",
        },
        {
          id: "d",
          text: "DynamoDB Streams solo permite procesar los cambios con Kinesis Data Streams; Lambda no puede leer el stream.",
          answer: false,
          explanation:
            "Falso: Lambda es uno de los destinos principales, con mapeo de fuente de eventos y polling.",
        },
      ],
    },
  },

  {
    id: 16,
    title: "TTL: expiración automática de elementos",
    stars: 3,
    category: "ACELERACIÓN Y EVENTOS",
    description:
      "Time To Live borra los elementos solos al caducar: sin coste extra de escritura, con un atributo de tipo number en formato Unix time, y en las 48 horas siguientes a la caducidad.",
    objective: "Configurar y entender el TTL de DynamoDB",
    tags: ["TTL", "Unix time", "expiración", "coste"],
    fileName: "dynamodb-ttl",
    completed: false,
    theory: `📚 TEORÍA: Time To Live (333)

El **TTL** permite **eliminar automáticamente** los elementos después de
una fecha de caducidad, **sin coste adicional** (no consume unidades de
capacidad de escritura).

  • El atributo del TTL debe ser de tipo **number** con un valor en
    formato **Unix time** (epoch).
  • Los elementos caducados se eliminan en las **48 horas siguientes** a
    su caducidad (no es instantáneo).
  • Hasta que se borran, los caducados siguen apareciendo en lecturas,
    consultas y escaneos: puedes filtrarlos si no los quieres.
  • Al eliminarse, el elemento se borra **también de los índices**
    secundarios locales y globales.
  • Cada eliminación por TTL se **registra en DynamoDB Streams**, lo que
    permite recuperar los datos caducados o llevar su registro a
    CloudWatch Logs.
  • Casos de uso: reducir almacenamiento conservando solo lo actual y
    cumplir obligaciones normativas de retención de datos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: TTL es el vigilante del almacén que cada noche revisa las etiquetas de caducidad y tira lo vencido gratis, sin que tengas que pagarle horas extra (no consume WCU). Las etiquetas deben estar en un formato estándar (Unix time, número) y el vigilante pasa en las 48 horas siguientes a la fecha marcada.\n\nEl examen adora el detalle del tipo de dato: si el atributo TTL es un string en vez de un number, no funciona (es el error que el instructor muestra en la práctica). Y 'sin coste adicional' + 'se registra en Streams' son las dos ideas que más se preguntan.",
    codeSnippet: "// Afirmaciones sobre el Time To Live de DynamoDB",
    inputs: {},
    completeCode:
      "TTL: elimina solos | type number + Unix time | sin WCU | ~48h | también borra de LSI/GSI | se registra en Streams",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tu comprensión del TTL de DynamoDB.",
      statements: [
        {
          id: "a",
          text: "El TTL elimina automáticamente los elementos después de su fecha de caducidad sin coste adicional: no consume unidades de capacidad de escritura.",
          answer: true,
          explanation:
            "Correcto: la expiración por TTL es gratuita en capacidad.",
        },
        {
          id: "b",
          text: "El atributo del TTL debe ser de tipo number y contener un valor en formato Unix time (epoch).",
          answer: true,
          explanation:
            "Correcto: un string no funciona como TTL, es el error clásico.",
        },
        {
          id: "c",
          text: "La eliminación por TTL es instantánea en el momento exacto de la caducidad.",
          answer: false,
          explanation:
            "Falso: los elementos se eliminan dentro de las 48 horas siguientes a la caducidad.",
        },
        {
          id: "d",
          text: "Cuando un elemento caducado se elimina, también desaparece de los índices secundarios locales y globales.",
          answer: true,
          explanation:
            "Correcto: el borrado por TTL se propaga a LSI y GSI.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── TRANSACCIONES Y PATRONES (335: transacciones, 339: S3) ──────────────
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 17,
    title: "Transacciones: todo o nada, al doble de coste",
    stars: 4,
    category: "TRANSACCIONES Y PATRONES",
    description:
      "Las transacciones ejecutan múltiples operaciones como un único bloque atómico: todas se guardan o ninguna. Eso sí, cada escritura transaccional consume el doble de unidades.",
    objective: "Entender transacciones y calcular su coste",
    tags: ["TransactWriteItems", "TransactGetItems", "atómico", "doble coste"],
    fileName: "dynamodb-transactions",
    completed: false,
    theory: `📚 TEORÍA: Transacciones (335)

Una **transacción** ejecuta de forma **atómica y coordinada** múltiples
operaciones de lectura y escritura: se cumplen **todas juntas o ninguna**.

Cuatro características (ACID):
  • **Atomicidad**: o se completan todas las operaciones o ninguna.
  • **Consistencia**: los datos quedan coherentes antes y después; si una
    escritura falla, se revierten las anteriores.
  • **Aislamiento**: las transacciones no se ven afectadas por otras que
    corren a la vez.
  • **Durabilidad**: al completarse, los cambios se guardan de forma
    permanente.

Operaciones principales:
  • **TransactWriteItems** → una o más escrituras (PutItem, UpdateItem,
    DeleteItem) como parte de la transacción.
  • **TransactGetItems** → una o más lecturas como parte de la
    transacción.

Caso típico: transferencia bancaria — se actualiza el balance de una
cuenta Y se inserta el registro de la transacción; si una de las dos
operaciones falla, se revierte la otra.

Coste: cada operación transaccional consume **el doble** de unidades de
capacidad de lectura y escritura.

Cálculo de ejemplo del instructor: 3 escrituras transaccionales/s de
5 KB → 3 × (5 ÷ 1) × 2 = **30 WCU**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una transferencia bancaria entre dos cuentas: o salen los dos apuntes a la vez o no sale ninguno. Si tu banco retirara el dinero de tu cuenta y 'fallara' al abonar en la otra, sería un desastre: las transacciones evitan exactamente eso.\n\nEl truco del examen es el **doble coste**: DynamoDB hace dos operaciones por cada elemento transaccional. En el cálculo, por eso se multiplica por 2 al final: 3 × (5 ÷ 1) × 2 = 30 WCU. Las opciones que olvidan el ×2 (15) o inventan otros multiplicadores son las trampas.",
    codeSnippet: `# 3 escrituras transaccionales por segundo
# Tamaño de elemento: 5 KB
# 1 WCU = 1 escritura/segundo de hasta 1 KB
# Las transacciones consumen el DOBLE de unidades.
# WCU = 3 × (5 ÷ 1) × 2 = ?`,
    inputs: {},
    completeCode:
      "TransactWriteItems/TransactGetItems | todo o nada (ACID) | doble de WCU/RCU | 3 × 5 × 2 = 30 WCU",
    format: "prediction",
    prediction: {
      prompt:
        "Realizas 3 escrituras transaccionales por segundo con elementos de 5 KB. ¿Cuántas unidades de capacidad de escritura (WCU) consumen?",
      snippet: `# 3 escrituras transaccionales/segundo
# 5 KB por elemento
# 1 WCU = 1 escritura/segundo de hasta 1 KB
# Las transacciones consumen el doble.`,
      options: [
        "30 WCU: 3 × (5 ÷ 1) × 2 — cada escritura transaccional cuenta dos veces.",
        "15 WCU: 3 × 5, sin recargo por ser transacción.",
        "60 WCU: 3 × 5 × 4 por el coste transaccional.",
        "3 WCU: una WCU por transacción, sin importar el tamaño.",
      ],
      answer:
        "30 WCU: 3 × (5 ÷ 1) × 2 — cada escritura transaccional cuenta dos veces.",
    },
  },

  {
    id: 18,
    title: "Patrón S3 + DynamoDB: objetos grandes y metadatos",
    stars: 4,
    category: "TRANSACCIONES Y PATRONES",
    description:
      "Las imágenes y vídeos no caben en DynamoDB (400 KB por elemento): se guardan en S3 y los metadatos (ID, nombre, URL) en DynamoDB. Ordena el flujo de indexación.",
    objective: "Construir el patrón S3 + Lambda + DynamoDB",
    tags: ["S3", "Lambda", "metadatos", "indexación"],
    fileName: "s3-indexing",
    completed: false,
    theory: `📚 TEORÍA: DynamoDB + S3 (339)

DynamoDB es perfecto para **objetos pequeños**; su límite por elemento es
de **400 KB**. Las imágenes y vídeos no caben, y ahí entra **S3**.

Patrón 1 — Metadatos de productos:
  • El archivo grande (imagen/vídeo) se sube a un **bucket S3**.
  • En la tabla de DynamoDB se guardan los **metadatos**: ID, nombre y la
    **URL** del objeto en S3.
  • La aplicación consulta los metadatos en DynamoDB y descarga el objeto
    por su URL desde S3.

Patrón 2 — Indexación de objetos S3:
  • Al subir un objeto a S3, la **notificación de evento** dispara una
    función **Lambda**.
  • Lambda almacena los **metadatos** del objeto en una tabla DynamoDB.
  • Así se pueden hacer **queries ricas** (por fechas, por cliente, por
    atributos) que S3 no ofrece: las búsquedas sobre los objetos se
    resuelven consultando DynamoDB.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el guardarropa de un actor guarda la ropa de gran tamaño en el almacén central (S3) y en su agenda solo anota 'traje rojo, almacén A, estantería 3' (metadatos en DynamoDB). Para encontrar todos los trajes de un rodaje, consulta la agenda (query rica), no va a mirar prenda por prenda en el almacén.\n\nEn el examen, '400 KB' es la palabra que dispara la combinación S3 + DynamoDB: archivo grande → S3, metadatos y búsquedas → DynamoDB. Y el flujo de indexación con notificación de eventos + Lambda es el patrón serverless por excelencia.",
    codeSnippet: "// Ordena el flujo de indexación de objetos S3 en DynamoDB",
    inputs: {},
    completeCode:
      "Subir a S3 → evento S3 → Lambda extrae metadatos → guardar en DynamoDB → consultar por Query",
    format: "ordering",
    ordering: {
      prompt:
        "Una aplicación indexa los objetos subidos a S3 en una tabla de DynamoDB para poder buscarlos con queries ricas. Ordena el flujo.",
      steps: [
        {
          id: "upload",
          label: "El usuario sube un objeto (imagen/vídeo) al bucket S3: los objetos grandes no caben en DynamoDB (máximo 400 KB).",
        },
        {
          id: "event",
          label: "La notificación de evento de S3 se dispara al crear el objeto.",
        },
        {
          id: "extract",
          label: "La función Lambda recoge los metadatos del objeto (ID, nombre, tamaño, URL...).",
        },
        {
          id: "store",
          label: "Lambda guarda los metadatos en una tabla de DynamoDB.",
        },
        {
          id: "query",
          label: "La aplicación consulta los metadatos con Query en DynamoDB y descarga el objeto desde S3 por su URL.",
        },
      ],
      correctOrder: ["upload", "event", "extract", "store", "query"],
    },
  },
];
