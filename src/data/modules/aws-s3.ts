import type { Exercise } from "@/lib/types";

/** Ruta progresiva: fundamentos de Amazon S3 (DVA-C02), de objetos a seguridad. */
export const AWS_S3_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // FUNDAMENTOS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Objetos, Buckets y Claves",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "S3 se anuncia como almacenamiento de escala infinita: guarda objetos (archivos) dentro de buckets, y cada objeto se localiza por su clave.",
    objective: "Distinguir bucket, objeto y clave",
    tags: ["objetos", "buckets", "claves", "prefijos"],
    fileName: "s3-conceptos",
    completed: false,
    theory: `📚 TEORÍA: La tríada de S3

Amazon S3 permite almacenar **objetos** (archivos) dentro de **buckets** (algo así como directorios).

  • Objeto  → el archivo en sí (máximo 5 TB; más de 5 GB exige carga multipart).
  • Bucket  → contenedor con nombre **único a nivel global** (todas las regiones y cuentas).
  • Clave   → la ruta completa al objeto: \`s3://mi-bucket/fotos/gato.jpg\`.

La clave se compone de un **prefijo** (\`fotos/\`) más el **nombre del objeto** (\`gato.jpg\`).
Aunque la consola muestra carpetas, no existen directorios reales: solo claves largas
que contienen barras inclinadas.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el bucket es el edificio de almacenamiento, el objeto es el archivador y la clave es la etiqueta con la ruta exacta para encontrarlo (pasillo/estantería/caja).\n\nS3 guarda objetos planos: la 'carpeta' es solo un prefijo dentro de la clave. Entender que no hay jerarquía real es clave en el examen, porque las reglas y políticas se aplican por prefijo (string), no por directorio.",
    codeSnippet: `S3 guarda [INPUT_1] (archivos) dentro de [INPUT_2]. La [INPUT_3] es la ruta completa hacia un objeto: en \`s3://mi-bucket/fotos/gato.jpg\` tenemos un [INPUT_4] (\`fotos/\`) más el nombre del objeto (\`gato.jpg\`).`,
    inputs: {
      INPUT_1: "objetos",
      INPUT_2: "buckets",
      INPUT_3: "clave",
      INPUT_4: "prefijo",
    },
    completeCode:
      "objetos → buckets → clave (prefijo + nombre del objeto) | máx. 5 TB por objeto",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Elige el concepto correcto para completar cada hueco.",
      options: {
        INPUT_1: ["objetos", "buckets", "claves", "versiones"],
        INPUT_2: ["buckets", "objetos", "regiones", "claves"],
        INPUT_3: ["clave", "versión", "etiqueta", "prefijo"],
        INPUT_4: ["prefijo", "sufijo", "bucket", "directorio"],
      },
    },
  },

  {
    id: 2,
    title: "Nombres de Bucket Únicos a Nivel Global",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "Los buckets deben tener un nombre único en TODAS las regiones y cuentas, con reglas de nomenclatura estrictas. Es de las primeras cosas que se preguntan en el examen.",
    objective: "Aplicar la convención de nombres de bucket",
    tags: ["naming", "regiones", "bucket"],
    fileName: "s3-bucket",
    completed: false,
    theory: `📚 TEORÍA: La convención de nombres

El nombre del bucket es **único a nivel global**: no puede existir el mismo nombre
en otra región ni en otra cuenta. Es la razón por la que ves sufijos como
\`mi-bucket-2024-us-east-1\`.

  • El bucket se define a **nivel de región** (no de AZ ni global).
  • Sin mayúsculas, sin guiones bajos.
  • De 3 a **63** caracteres.
  • No puede ser una dirección IP.
  • Debe empezar con una letra minúscula o un número.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es como el número de matrícula de un coche: único en todo el país, aunque el coche circule por tu ciudad. El bucket vive en una región concreta, pero su nombre no se puede repetir en ningún sitio.\n\nEl nombre forma parte del ARN y de la URL del objeto, por eso debe ser globalmente único. En el examen, un nombre con mayúsculas, guiones bajos o formato IP es señal inmediata de bucket inválido.",
    codeSnippet: `El nombre de un bucket es único a nivel [INPUT_1] (en todas las cuentas y regiones). Se define a nivel de [INPUT_2], no de zona de disponibilidad. Reglas: sin mayúsculas, sin guiones bajos, de 3 a [INPUT_3] caracteres, no puede ser una dirección [INPUT_4] y debe empezar con una letra minúscula o un número.`,
    inputs: {
      INPUT_1: "global",
      INPUT_2: "región",
      INPUT_3: "63",
      INPUT_4: "IP",
    },
    completeCode:
      "único global | definido a nivel de región | 3-63 caracteres | sin mayúsculas/guiones bajos | no IP",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa la convención de nombres de bucket.",
      options: {
        INPUT_1: ["global", "regional", "de cuenta", "de zona"],
        INPUT_2: ["región", "zona de disponibilidad", "cuenta", "Internet"],
        INPUT_3: ["63", "255", "30", "10"],
        INPUT_4: ["IP", "URL", "HTTP", "DNS"],
      },
    },
  },

  {
    id: 3,
    title: "Durabilidad: Los 11 Nueves",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "La durabilidad del 99.999999999 % es la garantía estrella de S3: si guardas 10 millones de objetos, la media de pérdida es un objeto cada 10.000 años.",
    objective: "Separar durabilidad de disponibilidad",
    tags: ["durabilidad", "disponibilidad", "11 nueves"],
    fileName: "s3-durabilidad",
    completed: false,
    theory: `📚 TEORÍA: Durabilidad vs Disponibilidad

  • **Durabilidad** (99.999999999 %, 11 nueves): los objetos se reparten en
    **múltiples zonas de disponibilidad**. Almacenar 10 millones de objetos
    implica esperar perder una media de 1 objeto cada 10.000 años.
    Es la MISMA durabilidad en todas las clases de almacenamiento.
  • **Disponibilidad** (varía según la clase): mide si el servicio responde.
    S3 Standard tiene 99.99 %, que equivale a unos **53 minutos** de
    indisponibilidad al año por probabilidad.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la durabilidad es '¿se me rompe el documento guardado?' (casi nunca, se guarda en varias copias) y la disponibilidad es '¿está abierta la oficina cuando la necesito?' (casi siempre, pero unos minutos al año puede estar cerrada).\n\nLos 11 nueves aplican por igual a Standard y a Glacier: la diferencia está en la disponibilidad y el coste. En el examen, mezclar 'durabilidad idéntica en todas las clases' con 'disponibilidad distinta' es una trampa recurrente.",
    codeSnippet: "// Afirmaciones sobre durabilidad y disponibilidad de S3",
    inputs: {},
    completeCode:
      "Durabilidad 99.999999999 % (11 nueves) en TODAS las clases | disponibilidad varía (Standard 99.99 % ≈ 53 min/año)",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de durabilidad y disponibilidad de S3.",
      statements: [
        {
          id: "a",
          text: "S3 ofrece una durabilidad del 99.999999999 %: si almacenas 10 millones de objetos, puedes esperar perder una media de un objeto cada 10.000 años.",
          answer: true,
          explanation:
            "Es la definición de los 11 nueves: los objetos se replican en múltiples AZs.",
        },
        {
          id: "b",
          text: "La alta durabilidad de los 11 nueves solo aplica a S3 Standard; el resto de clases tienen menos garantías de durabilidad.",
          answer: false,
          explanation:
            "Falso: la durabilidad del 99.999999999 % es idéntica en todas las clases de almacenamiento.",
        },
        {
          id: "c",
          text: "La disponibilidad del servicio es la misma en todas las clases de almacenamiento.",
          answer: false,
          explanation:
            "Falso: la disponibilidad varía según la clase (Standard 99.99 %, Standard-IA 99.9 %, One Zone-IA 99.5 %).",
        },
        {
          id: "d",
          text: "Una disponibilidad del 99.99 % en S3 Standard equivale a unos 53 minutos de indisponibilidad estimada al año.",
          answer: true,
          explanation:
            "Correcto: ese 0.01 % restante, anualizado, son aproximadamente 53 minutos.",
        },
      ],
    },
  },

  {
    id: 4,
    title: "Crear un Bucket y Subir un Objeto con la CLI",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "El día a día de S3 desde terminal: crear el bucket con mb, subir archivos con cp y listar con ls.",
    objective: "Dominar aws s3 mb, cp y ls",
    tags: ["aws s3", "mb", "cp", "ls"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: Comandos básicos de la CLI de S3

  aws s3 mb s3://mi-bucket          → make bucket (crear el bucket)
  aws s3 cp foto.jpg s3://mi-bucket → copiar/Subir un archivo
  aws s3 ls s3://mi-bucket          → listar objetos del bucket
  aws s3 sync ./public/ s3://b/public/ → sincronizar (solo cambios)

Con \`aws s3api\` (API JSON) tienes control fino: \`create-bucket\`, \`put-object\`,
\`get-bucket-policy\`... La sintaxis \`aws s3\` es la de alto nivel y la más usada.`,
    explanationText:
      "🌍 Ejemplo cotidiano: mb es 'alquilar el almacén', cp es 'meter la caja en él' y ls es 'mirar qué hay dentro'.\n\nLa familia \`aws s3\` traduce automáticamente a llamadas HTTP/API y gestiona multipart, reintentos y cifrado por ti. Saber distinguirla de \`aws s3api\` (que expone la API cruda en JSON) es pregunta habitual de certificación.",
    codeSnippet: `# Crear el bucket
aws s3 [INPUT_1] s3://mi-bucket

# Subir un archivo
aws s3 [INPUT_2] foto.jpg s3://mi-bucket/fotos/

# Listar los objetos del bucket
aws s3 [INPUT_3] s3://mi-bucket/`,
    inputs: { INPUT_1: "mb", INPUT_2: "cp", INPUT_3: "ls" },
    completeCode: "aws s3 mb s3://mi-bucket | aws s3 cp foto.jpg s3://mi-bucket/fotos/ | aws s3 ls s3://mi-bucket/",
  },

  {
    id: 5,
    title: "Predicción: ¿Qué Hace Este Comando aws s3?",
    stars: 2,
    category: "FUNDAMENTOS",
    description:
      "Antes de ejecutar un comando, un dev senior predice su efecto. Aquí toca leer la salida de aws s3 sync y aws s3 ls.",
    objective: "Interpretar comandos de sincronización",
    tags: ["aws s3 sync", "aws s3 ls", "predicción"],
    fileName: "terminal",
    completed: false,
    theory: `📚 TEORÍA: sync vs cp

  aws s3 cp es una copia a ciegas: vuelve a subir el archivo siempre.
  aws s3 sync compara el origen con el destino y sube SOLO lo que cambió
  (archivos nuevos o modificados). Para sitios web estáticos o despliegues,
  sync ahorra tiempo, datos y coste de peticiones.

  aws s3 ls s3://mi-bucket/ lista los objetos (claves) del bucket.`,
    explanationText:
      "🌍 Ejemplo cotidiano: cp es volver a meter todas las cajas al almacén aunque ya estén; sync es mirar la lista y meter únicamente las que faltan o han cambiado.\n\nsync reduce el número de peticiones PUT (y por tanto coste) al subir solo deltas. Es la herramienta típica para publicar una web estática alojada en S3 desde CI/CD.",
    codeSnippet: `aws s3 sync ./public/ s3://mi-bucket/public/
aws s3 ls s3://mi-bucket/`,
    inputs: {},
    completeCode:
      "sync sube solo archivos nuevos/modificados de ./public/ a s3://mi-bucket/public/ y ls lista los objetos",
    format: "prediction",
    prediction: {
      prompt:
        "Se ejecuta esta secuencia de comandos. ¿Qué hace exactamente?",
      snippet: `aws s3 sync ./public/ s3://mi-bucket/public/
aws s3 ls s3://mi-bucket/`,
      options: [
        "Sube SOLO los archivos nuevos o modificados de ./public/ a s3://mi-bucket/public/ y luego lista los objetos del bucket.",
        "Cifra los archivos de public/ y muestra los logs de acceso del bucket.",
        "Crea un bucket llamado public/ y descarga su contenido al directorio local.",
        "Elimina los archivos de s3://mi-bucket/public/ y sincroniza en sentido inverso.",
      ],
      answer:
        "Sube SOLO los archivos nuevos o modificados de ./public/ a s3://mi-bucket/public/ y luego lista los objetos del bucket.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // SEGURIDAD Y POLÍTICAS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "Política de Bucket JSON: Lectura Pública",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "Las políticas de bucket son documentos JSON con Version, Effect, Principal, Action y Resource. Aquí construyes una que concede lectura pública para un sitio web.",
    objective: "Redactar una política de bucket JSON",
    tags: ["bucket policy", "JSON", "Principal", "GetObject"],
    fileName: "bucket-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Anatomía de una política de bucket

  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::mi-bucket/*"
      }
    ]
  }

  • Effect    → Allow o Deny.
  • Principal → a quién se aplica: "*" significa CUALQUIER usuario (anónimo).
  • Action    → las operaciones de la API que se permiten o deniegan.
  • Resource  → el ARN del bucket u objetos afectados.

Las políticas de bucket permiten acceso público, forzar cifrado y dar acceso a
otras cuentas (cuentas cruzadas).`,
    explanationText:
      "🌍 Ejemplo cotidiano: la política es el permiso escrito pegado a la puerta del almacén: dice quién puede entrar (Principal), qué puede hacer dentro (Action) y a qué estanterías (Resource).\n\nCon \`\"Principal\": \"*\"\` abres la puerta a cualquier anónimo. Con \`s3:GetObject\` y Resource \`arn:aws:s3:::mi-bucket/*\` permites LEER cualquier objeto del bucket. Es exactamente lo que necesita un sitio web estático público. Un error común del examen es poner \`s3:PutObject\` (escritura) cuando solo se pide lectura.",
    codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "[INPUT_1]",
      "Principal": "[INPUT_2]",
      "Action": "[INPUT_3]",
      "Resource": "arn:aws:s3:::mi-bucket/[INPUT_4]"
    }
  ]
}`,
    inputs: {
      INPUT_1: "Allow",
      INPUT_2: "*",
      INPUT_3: "s3:GetObject",
      INPUT_4: "*",
    },
    completeCode:
      '"Effect": "Allow" | "Principal": "*" | "Action": "s3:GetObject" | "Resource": "arn:aws:s3:::mi-bucket/*"',
    format: "context-dropdown",
    contextDropdown: {
      prompt:
        "Completa la política de bucket que concede LECTURA pública a cualquier visitante del sitio web.",
      options: {
        INPUT_1: ["Allow", "Deny", "Public", "Read"],
        INPUT_2: ["*", "aws:root", "iam:user", "S3"],
        INPUT_3: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
        INPUT_4: ["*", "s3://mi-bucket", "mi-bucket/*", "objetos"],
      },
    },
  },

  {
    id: 7,
    title: "Política Segura vs Política Insegura",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "Conceder escritura pública a un bucket es una de las peores decisiones de seguridad. Distingue la política que solo permite leer de la que cualquiera puede modificar.",
    objective: "Detectar permisos excesivos en políticas",
    tags: ["mínimo privilegio", "PutObject", "seguridad"],
    fileName: "bucket-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Mínimo privilegio en buckets

Una política con \`"Principal": "*"\` y \`s3:PutObject\`/s3:DeleteObject\`
permite que CUALQUIER persona en Internet escriba o borre tus objetos.

  ❌ Insegura: permite GetObject + PutObject + DeleteObject a "*".
  ✅ Segura:   solo lo imprescindible (p. ej. GetObject público para una web).

Por eso AWS ofrece Block Public Access a nivel de bucket y de cuenta: evita
que una política accidental deje el bucket abierto (la famosa filtración de datos).`,
    explanationText:
      "🌍 Ejemplo cotidiano: la política segura es un expositor con cristal: el público ve (GetObject) pero no toca. La insegura es dejar la caja registradora abierta con un cartel 'sirvanse' (PutObject/DeleteObject a cualquiera).\n\nUna API o bucket con escritura anónima permite a un atacante sustituir contenido (defacement), inyectar malware o borrar backups. La regla es mínimo privilegio: concede únicamente la acción necesaria y al prefijo correcto.",
    codeSnippet: "// Dos políticas para el bucket de un sitio web estático",
    inputs: {},
    completeCode:
      "Solo lectura pública (GetObject) | nunca PutObject/DeleteObject a Principal '*'",
    format: "snippet-pick",
    snippetPick: {
      prompt:
        "El bucket aloja un sitio web estático que DEBE ser público de lectura. ¿Cuál es la política correcta?",
      snippets: [
        {
          id: "insegura",
          label: "Opción A",
          description:
            "Permite a cualquiera leer, subir y borrar objetos (anti-patrón).",
          code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::mi-bucket/*"
    }
  ]
}`,
        },
        {
          id: "segura",
          label: "Opción B",
          description:
            "Solo lectura pública: el público ve la web pero no puede modificar nada.",
          code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket/*"
    }
  ]
}`,
        },
      ],
      correct: 1,
    },
  },

  {
    id: 8,
    title: "Bug Hunt: Bucket Público que Filtra Datos",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "El peor error de S3: una política que abre un bucket de datos de clientes a cualquier persona de Internet. Encuentra la vulnerabilidad.",
    objective: "Detectar una política de bucket abierta",
    tags: ["bug-hunt", "acceso público", "filtración"],
    fileName: "bucket-policy.json",
    completed: false,
    theory: `📚 TEORÍA: El bug del bucket abierto

Este snippet parece inofensivo, pero \`"Principal": "*"\` con acciones de
lectura Y escritura abre el bucket a todo Internet:

  aws s3api put-bucket-policy --bucket datos-clientes --policy file://policy.json

Con esto, cualquier anónimo puede descargar los datos y además BORRARLOS.
AWS recomienda activar **Block Public Access** (bloqueo de acceso público)
a nivel de bucket y de cuenta para evitar estas filtraciones por accidente.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es dejar el almacén de expedientes de clientes abierto de par en par, con un cartel que dice 'entren, lean, y si quieren, tiren la papelera'.\n\nEl bug no es la sintaxis (es válida), sino el efecto: Principal \"*\" + PutObject + DeleteObject permite que un atacante robe información personal y la borre, destruyendo el bucket entero. Por eso las opciones que 'no ven bug' o culpan a la sintaxis son distracciones.",
    codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "OpenBucket",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::datos-clientes/*"
    }
  ]
}`,
    inputs: {},
    completeCode:
      "Eliminar PutObject/DeleteObject y activar Block Public Access; dejar solo lectura a recursos concretos",
    format: "bug-hunt",
    bugHunt: {
      prompt:
        "Esta política se aplicó a un bucket con datos de clientes. ¿Qué vulnerabilidad contiene?",
      snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::datos-clientes/*"
    }
  ]
}`,
      options: [
        "Permite a CUALQUIER persona de Internet leer, escribir y borrar objetos: un atacante puede robar y destruir los datos de clientes.",
        "No hay bug: una política con Principal '*' y GetObject es la configuración recomendada por AWS.",
        "El bug es que falta el campo Version: las políticas JSON no pueden funcionar sin él.",
        "El bug es que Resource apunta a un bucket que no existe en la misma región.",
      ],
      correct: 0,
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // WEB, VERSIONADO Y REPLICACIÓN
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "S3 como Hosting de Sitios Web Estáticos",
    stars: 2,
    category: "WEB Y VERSIONADO",
    description:
      "S3 es perfecto para sitios web estáticos: obtienes URLs públicas tipo mi-bucket.s3-website-us-east-1.amazonaws.com y un 403 si la política no permite lecturas.",
    objective: "Configurar Static Website Hosting",
    tags: ["static website", "index.html", "403"],
    fileName: "s3-website",
    completed: false,
    theory: `📚 TEORÍA: Static Website Hosting

  • Se activa en las propiedades del bucket → Static website hosting,
    indicando el documento de índice (p. ej. index.html).
  • URLs generadas:
      <bucket>.s3-website-<region>.amazonaws.com
      <bucket>.s3-website.<region>.amazonaws.com
  • Si ves un error **403 (Forbidden)**, la política de bucket no permite
    las lecturas públicas: hay que conceder s3:GetObject a Principal "*".
  • S3 sirve HTML/CSS/JS estáticos: NO ejecuta código de servidor.`,
    explanationText:
      "🌍 Ejemplo cotidiano: habilitar el hosting es colgar el letrero 'Abierto al público' en la vitrina: sin él, aunque el contenido esté, nadie entra.\n\nEl 403 es el síntoma clásico: activaste el hosting pero olvidaste la política de lectura pública. Recuerda que S3 no ejecuta backends (PHP, Node, etc.): si necesitas lógica de servidor, vas a CloudFront + Lambda o a otro servicio.",
    codeSnippet: "// Afirmaciones sobre el alojamiento de sitios web estáticos en S3",
    inputs: {},
    completeCode:
      "Static website hosting + index.html | URL s3-website-<region> | 403 si falta la política de lectura pública",
    format: "true-false",
    trueFalse: {
      prompt: "Valida cómo funciona Static Website Hosting en S3.",
      statements: [
        {
          id: "a",
          text: "S3 puede alojar sitios web estáticos y expone URLs del tipo mi-bucket.s3-website-us-east-1.amazonaws.com.",
          answer: true,
          explanation:
            "Correcto: esa es la URL de endpoint de website hosting para la región us-east-1.",
        },
        {
          id: "b",
          text: "Un sitio web estático público en S3 funciona aunque la política de bucket no permita la lectura pública.",
          answer: false,
          explanation:
            "Falso: sin s3:GetObject público recibirás un error 403 (Forbidden) al acceder.",
        },
        {
          id: "c",
          text: "S3 sirve HTML, CSS y JavaScript estáticos, pero no ejecuta código de servidor como PHP o Node.",
          answer: true,
          explanation:
            "Correcto: el hosting estático solo devuelve archivos; no hay runtime de servidor.",
        },
        {
          id: "d",
          text: "Para publicar el sitio hay que activar 'Static website hosting' en las propiedades del bucket y especificar un documento de índice como index.html.",
          answer: true,
          explanation:
            "Correcto: el documento de índice es obligatorio para que el hosting sepa qué página servir.",
        },
      ],
    },
  },

  {
    id: 10,
    title: "Versionado y MFA Delete",
    stars: 2,
    category: "WEB Y VERSIONADO",
    description:
      "El versionado protege contra borrados involuntarios y permite volver a versiones anteriores. MFA Delete añade un código extra para operaciones destructivas.",
    objective: "Entender versionado y MFA Delete",
    tags: ["versionado", "MFA Delete", "versión nula"],
    fileName: "s3-versioning",
    completed: false,
    theory: `📚 TEORÍA: Versionado y MFA Delete

  • Al sobrescribir un objeto con el versionado activo se crea una NUEVA
    versión de la misma clave (v1, v2, v3...). Protege contra borrados
    involuntarios y permite volver a una versión anterior.
  • Objetos anteriores al versionado reciben una **versión nula**.
  • SUSPENDER el versionado no elimina las versiones existentes.
  • **MFA Delete**: exige un código MFA para (1) eliminar permanentemente
    una versión y (2) suspender el versionado. Requiere versionado activado,
    y solo el propietario del bucket (cuenta root) puede activarlo o
    desactivarlo. NO se necesita MFA para habilitar el versionado ni para
    listar versiones eliminadas.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el versionado es como un borrador automático en cada documento: si borras algo por error, sacas la versión anterior del historial. MFA Delete es la caja fuerte con dos llaves: para destruir una versión de forma permanente hace falta además el código del móvil.\n\nEl versionado no evita el coste: cada versión consume espacio. Suspenderlo congela el historial pero no lo borra. MFA Delete va un paso más allá: solo la cuenta root puede activarlo, lo que lo convierte en protección contra ataques internos o credenciales robadas.",
    codeSnippet: "// Afirmaciones sobre versionado y MFA Delete en S3",
    inputs: {},
    completeCode:
      "Sobrescribir crea una nueva versión | versión nula para objetos previos | suspender no borra | MFA Delete: root + versionado",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tus conocimientos sobre versionado y MFA Delete.",
      statements: [
        {
          id: "a",
          text: "Con el versionado activado, sobrescribir un objeto crea una nueva versión de la misma clave en lugar de destruir la anterior.",
          answer: true,
          explanation:
            "Correcto: cada sobrescritura incrementa la versión, y las anteriores siguen recuperables.",
        },
        {
          id: "b",
          text: "Los objetos subidos antes de activar el versionado reciben una 'versión nula' y quedan igual de protegidos que el resto.",
          answer: true,
          explanation:
            "Correcto: al activar el versionado, los objetos preexistentes se etiquetan con versión nula.",
        },
        {
          id: "c",
          text: "Suspender el versionado elimina automáticamente todas las versiones anteriores del bucket.",
          answer: false,
          explanation:
            "Falso: suspender solo deja de versionar lo nuevo; las versiones existentes permanecen en S3.",
        },
        {
          id: "d",
          text: "Con MFA Delete, se necesita un código MFA para eliminar permanentemente una versión y para suspender el versionado, pero NO para habilitar el versionado.",
          answer: true,
          explanation:
            "Correcto: las operaciones destructivas (borrado permanente de versiones y suspender) exigen MFA.",
        },
        {
          id: "e",
          text: "Cualquier usuario IAM con permisos de administrador puede activar o desactivar MFA Delete.",
          answer: false,
          explanation:
            "Falso: solo el propietario del bucket (cuenta root) puede activar o desactivar MFA Delete.",
        },
      ],
    },
  },

  {
    id: 11,
    title: "Replicación CRR y SRR: ¿Qué Objetos Se Copian?",
    stars: 2,
    category: "WEB Y VERSIONADO",
    description:
      "La replicación copia objetos entre regiones (CRR) o en la misma región (SRR), de forma asíncrona. Pero hay una trampa clásica: ¿qué pasa con los objetos existentes?",
    objective: "Saber qué replica S3 al activar la regla",
    tags: ["CRR", "SRR", "replicación", "asíncrona"],
    fileName: "s3-replication",
    completed: false,
    theory: `📚 TEORÍA: Replicación de S3

  • **CRR** (Cross-Region Replication): entre regiones. Útil por normativa,
    menor latencia de acceso o replicación entre cuentas.
  • **SRR** (Same-Region Replication): misma región. Útil para agregar logs
    o replicar entre cuentas de producción y pruebas.
  • La copia es **asíncrona** y requiere el versionado activado en origen
    y destino.
  • Al activar la regla SOLO se replican los **objetos nuevos**. Para los
    existentes (o fallidos) hay S3 Batch Replication.
  • Los marcadores de borrado se replican de forma opcional; los borrados
    de versiones NO se replican. No hay encadenamiento entre buckets.`,
    explanationText:
      "🌍 Ejemplo cotidiano: activar la replicación es contratar un servicio de fotocopiado que copia cada documento nuevo que entra a la oficina: lo que ya estaba en el cajón no se copia por arte de magia.\n\nLa trampa del examen: 'activar la replicación' NO replica los objetos ya existentes; para eso existe S3 Batch Replication. Y el versionado en ambos buckets es un requisito imprescindible antes de poder replicar.",
    codeSnippet: `# Configuras una regla de replicación del bucket A (origen) al bucket B (destino)
# y habilitas el versionado en ambos. El bucket A ya contiene 5.000 objetos.

aws s3api put-bucket-replication --bucket A --replication-configuration file://repl.json`,
    inputs: {},
    completeCode:
      "CRR entre regiones / SRR misma región | asíncrona | requiere versionado | solo objetos nuevos (o S3 Batch Replication)",
    format: "prediction",
    prediction: {
      prompt:
        "Activas la replicación en un bucket que ya tiene 5.000 objetos. ¿Qué se copiará a la región de destino?",
      snippet: `# Regla de replicación configurada del bucket A al bucket B,
# con versionado activado en ambos. El bucket A ya contiene 5.000 objetos.`,
      options: [
        "Solo los objetos NUEVOS que se suban a partir de ese momento; los 5.000 existentes no se replican (a menos que uses S3 Batch Replication).",
        "Los 5.000 objetos existentes y todos los futuros, copiados al instante.",
        "Solo los objetos que superen los 5 GB de tamaño.",
        "Ninguno: la replicación copia únicamente metadatos y etiquetas, no objetos.",
      ],
      answer:
        "Solo los objetos NUEVOS que se suban a partir de ese momento; los 5.000 existentes no se replican (a menos que uses S3 Batch Replication).",
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CLASES DE ALMACENAMIENTO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 12,
    title: "Clases de Almacenamiento: Standard, IA y One Zone-IA",
    stars: 2,
    category: "CLASES DE ALMACENAMIENTO",
    description:
      "Cada clase equilibra coste, disponibilidad y recuperación. Empareja la clase con su caso de uso ideal.",
    objective: "Elegir la clase según el acceso a los datos",
    tags: ["Standard", "Standard-IA", "One Zone-IA", "Glacier"],
    fileName: "s3-storage-classes",
    completed: false,
    theory: `📚 TEORÍA: Las clases base de S3

  • **S3 Standard**: propósito general, datos de acceso frecuente. Baja
    latencia y alto rendimiento. Disponibilidad 99.99 %. Casos: big data,
    apps móviles, videojuegos, distribución de contenidos.
  • **S3 Standard-IA**: acceso poco frecuente a menor coste. Disponibilidad
    99.9 %. Casos: copias de seguridad y recuperación ante desastres.
  • **S3 One Zone-IA**: solo UNA zona de disponibilidad, aún más barato.
    Se pierden los datos si se destruye la AZ. Casos: datos recreables o
    copias secundarias.
  • **Glacier**: familia de archivo de bajo coste: pagas almacenamiento
    más la recuperación. Ideal para datos consultados pocas veces al año.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Standard es la oficina con todo al alcance de la mano; Standard-IA es el trastero que visitas de vez en cuando; One Zone-IA es la caja en el sótano (barato, pero si se inunda el edificio, adiós); Glacier es el archivo municipal.\n\nEl criterio en el examen es '¿con qué frecuencia accedes y cuánto puedes tardar en recuperarlo?'. Frecuente → Standard. Poco frecuente pero inmediato → Standard-IA. Recreable y de bajo coste → One Zone-IA. Archivo casi inaccesible → Glacier.",
    codeSnippet: "// Empareja cada clase de almacenamiento con su caso de uso",
    inputs: {},
    completeCode:
      "Standard: acceso frecuente | Standard-IA: backups/DR | One Zone-IA: datos recreables | Glacier: archivo",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada clase de almacenamiento con su caso de uso más representativo.",
      definitions: [
        "Acceso poco frecuente a menor coste: copias de seguridad y recuperación ante desastres. Disponibilidad 99.9 %.",
        "Archivo de bajo coste: pagas almacenamiento más recuperación. Ideal para datos consultados pocas veces al año.",
        "Propósito general: datos de acceso frecuente (big data, apps móviles, distribución de contenidos). Disponibilidad 99.99 %.",
        "Solo una zona de disponibilidad, barato, para datos que puedes recrear o copias secundarias. Si se destruye la AZ, se pierden los datos.",
      ],
      pairs: [
        {
          id: "standard",
          term: "S3 Standard",
          definition:
            "Propósito general: datos de acceso frecuente (big data, apps móviles, distribución de contenidos). Disponibilidad 99.99 %.",
        },
        {
          id: "s3-ia",
          term: "S3 Standard-IA",
          definition:
            "Acceso poco frecuente a menor coste: copias de seguridad y recuperación ante desastres. Disponibilidad 99.9 %.",
        },
        {
          id: "one-zone-ia",
          term: "S3 One Zone-IA",
          definition:
            "Solo una zona de disponibilidad, barato, para datos que puedes recrear o copias secundarias. Si se destruye la AZ, se pierden los datos.",
        },
        {
          id: "glacier",
          term: "S3 Glacier (familia)",
          definition:
            "Archivo de bajo coste: pagas almacenamiento más recuperación. Ideal para datos consultados pocas veces al año.",
        },
      ],
    },
  },

  {
    id: 13,
    title: "Glacier y Intelligent-Tiering a Fondo",
    stars: 3,
    category: "CLASES DE ALMACENAMIENTO",
    description:
      "Glacier Instant, Glacier Flexible y Glacier Deep Archive se diferencian en el tiempo de recuperación y los mínimos de almacenamiento. Intelligent-Tiering se mueve solo.",
    objective: "Distinguir las clases Glacier y el tiering automático",
    tags: ["Glacier", "Deep Archive", "Intelligent-Tiering", "mínimos"],
    fileName: "s3-glacier",
    completed: false,
    theory: `📚 TEORÍA: La familia Glacier y Intelligent-Tiering

  • **Glacier Instant Retrieval**: recuperación en milisegundos. Mínimo de
    **90 días**. Ideal para datos accedidos una vez al trimestre.
  • **Glacier Flexible Retrieval**: recuperación en 1-5 min (expedita),
    3-5 horas (estándar) o 5-12 horas (masiva). Mínimo de 90 días.
  • **Glacier Deep Archive**: 12 horas (estándar) o 48 horas (masiva).
    Mínimo de **180 días**. Es el almacenamiento más barato de S3.
  • **S3 Intelligent-Tiering**: cuota mensual por monitorización y
    jerarquización automática entre niveles según el uso. No cobra cargos
    por recuperación, pero es más caro de base.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Glacier Instant es el archivo que puedes pedir al momento (como el trastero con ascensor); Flexible es pedirlo y esperar unas horas; Deep Archive es el sótano en una nave industrial lejana: lo más barato, pero tarda hasta dos días en llegar.\n\nLos mínimos importan: 90 días para Instant/Flexible y 180 para Deep Archive (no puedes sacar los datos antes sin pagar). Intelligent-Tiering mueve objetos entre niveles automáticamente por uso: es la opción 'no me lo pienso, que AWS decida', a cambio de una cuota mensual.",
    codeSnippet: "// Empareja cada clase de la familia Glacier e Intelligent-Tiering",
    inputs: {},
    completeCode:
      "Instant: ms, 90 días | Flexible: 1-5 min a 5-12 h, 90 días | Deep Archive: 12-48 h, 180 días | Intelligent-Tiering: automático",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada clase de almacenamiento con su tiempo de recuperación y mínimo.",
      definitions: [
        "Monitorización y jerarquización automática entre niveles según el uso. Cobra cuota mensual y no tiene cargos de recuperación.",
        "Recuperación en milisegundos, mínimo 90 días. Ideal para datos accedidos una vez al trimestre.",
        "12 horas (estándar) o 48 horas (masiva). Mínimo 180 días. Es el almacenamiento más barato de S3.",
        "Recuperación en 1-5 min (expedita), 3-5 h (estándar) o 5-12 h (masiva). Mínimo 90 días.",
      ],
      pairs: [
        {
          id: "instant",
          term: "Glacier Instant Retrieval",
          definition:
            "Recuperación en milisegundos, mínimo 90 días. Ideal para datos accedidos una vez al trimestre.",
        },
        {
          id: "flexible",
          term: "Glacier Flexible Retrieval",
          definition:
            "Recuperación en 1-5 min (expedita), 3-5 h (estándar) o 5-12 h (masiva). Mínimo 90 días.",
        },
        {
          id: "deep",
          term: "Glacier Deep Archive",
          definition:
            "12 horas (estándar) o 48 horas (masiva). Mínimo 180 días. Es el almacenamiento más barato de S3.",
        },
        {
          id: "intelligent",
          term: "S3 Intelligent-Tiering",
          definition:
            "Monitorización y jerarquización automática entre niveles según el uso. Cobra cuota mensual y no tiene cargos de recuperación.",
        },
      ],
    },
  },

  {
    id: 14,
    title: "Elegir la Clase Correcta para el Escenario",
    stars: 3,
    category: "CLASES DE ALMACENAMIENTO",
    description:
      "Pregunta típica de examen: un requisito de recuperación y coste mínimo. Tú decides la clase.",
    objective: "Aplicar criterios de coste y recuperación",
    tags: ["escenario", "Deep Archive", "coste"],
    fileName: "s3-storage-classes",
    completed: false,
    theory: `📚 TEORÍA: Decidir la clase en un escenario

La regla del instructor:

  1. ¿Acceso frecuente e inmediato?        → S3 Standard
  2. ¿Poco frecuente pero recuperación
     en milisegundos?                      → S3 Standard-IA / Instant
  3. ¿Datos que se pueden recrear y
     presupuesto ajustado?                 → S3 One Zone-IA
  4. ¿Archivo a largo plazo, sin urgencia
     y mínimo coste posible?               → S3 Glacier Deep Archive

Deep Archive: recuperación de 12 a 48 horas y mínimo de 180 días.
Es la clase más barata y por eso la favorita para datos que "nunca, nunca"
se observan pero deben conservarse por normativa.`,
    explanationText:
      "🌍 Ejemplo cotidiano: si tienes cajas de facturas que la ley exige guardar 10 años y solo revisarías si una auditoría lo pide (y te avisan con antelación), no las guardas en tu oficina: las mandas a la bodega más barata posible, aunque tardar dos días en traerlas sea aceptable.\n\nDeep Archive cumple exactamente ese perfil: máximo ahorro a cambio de 12-48 horas de recuperación. Si el requisito fuera recuperación rápida, la respuesta sería otra clase; la trampa está en 'coste mínimo + paciencia para recuperar'.",
    codeSnippet: `# Requisitos de tu empresa:
#  - Datos de facturación que hay que conservar 7 años por normativa.
#  - Se acceden rarísima vez (alguna auditoría al año).
#  - Si se recuperan, tardar 12-48 horas es aceptable.
#  - Coste de almacenamiento debe ser el MÍNIMO posible.`,
    inputs: {},
    completeCode: "S3 Glacier Deep Archive (12-48 h, mínimo 180 días, menor coste)",
    format: "prediction",
    prediction: {
      prompt:
        "Elige la clase de almacenamiento adecuada para los requisitos de facturación.",
      snippet: `#  - Datos de facturación que hay que conservar 7 años por normativa.
#  - Se acceden muy pocas veces al año.
#  - Una recuperación de 12-48 horas es aceptable.
#  - El coste de almacenamiento debe ser el MÍNIMO posible.`,
      options: [
        "S3 Glacier Deep Archive",
        "S3 Standard",
        "S3 One Zone-IA",
        "S3 Intelligent-Tiering",
      ],
      answer: "S3 Glacier Deep Archive",
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CICLO DE VIDA
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 15,
    title: "Reglas de Ciclo de Vida: Transición y Expiración",
    stars: 3,
    category: "CICLO DE VIDA",
    description:
      "El ciclo de vida automatiza el movimiento del objeto: Standard → Standard-IA → Glacier → expiración. Ordena la transición correcta.",
    objective: "Construir una regla de ciclo de vida",
    tags: ["ciclo de vida", "transición", "expiración"],
    fileName: "s3-lifecycle",
    completed: false,
    theory: `📚 TEORÍA: Reglas del ciclo de vida

  • Acciones de **transición**: mueven objetos a otra clase automáticamente
    (p. ej. a Standard-IA a los 30 días, a Glacier a los 90 días).
  • Acciones de **expiración**: eliminan objetos tras un tiempo (p. ej.
    logs que caducan al año por normativa).
  • Las reglas pueden apuntar a un **prefijo** (\`s3/fotos/\`) o a objetos
    con una **etiqueta** (p. ej. departamento Finanzas).
  • También eliminan versiones antiguas y subidas multipart incompletas.

Escenario típico: fotos originales en Standard, miniaturas recreables que
expiran a los 60 días y originales que pasan a Glacier después de 60 días.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la dieta automática de tus datos: lo que no se come en 30 días pasa a la despensa (IA), a los 90 días al congelador (Glacier) y a los 365 días se tira.\n\nLa regla ahorra coste sin intervención humana: reduce el gasto en clases caras cuando el acceso se vuelve raro. La secuencia lógica es Standard → acceso infrecuente → archivo → expiración, nunca al revés.",
    codeSnippet: "// Ordena el ciclo de vida de un objeto desde que se sube",
    inputs: {},
    completeCode:
      "Standard (acceso frecuente) → Standard-IA (30 días) → Glacier (90 días) → expiración (365 días)",
    format: "ordering",
    ordering: {
      prompt:
        "Ordena las fases del ciclo de vida de un objeto, de la más temprana a la más tardía.",
      steps: [
        {
          id: "standard",
          label: "El objeto se sube y queda en S3 Standard (acceso frecuente).",
        },
        {
          id: "ia",
          label: "A los 30 días, una regla de transición lo mueve a S3 Standard-IA.",
        },
        {
          id: "glacier",
          label: "A los 90 días, otra regla lo transita a S3 Glacier para archivar.",
        },
        {
          id: "expire",
          label: "A los 365 días, una acción de expiración elimina el objeto.",
        },
      ],
      correctOrder: ["standard", "ia", "glacier", "expire"],
    },
  },

  {
    id: 16,
    title: "Ciclo de Vida y S3 Analytics",
    stars: 3,
    category: "CICLO DE VIDA",
    description:
      "Las reglas se pueden limitar por prefijo o etiquetas, y S3 Analytics recomienda cuándo pasar los objetos a Standard-IA.",
    objective: "Dominar reglas por prefijo/etiqueta y Analytics",
    tags: ["S3 Analytics", "prefijos", "etiquetas", "expiración"],
    fileName: "s3-lifecycle",
    completed: false,
    theory: `📚 TEORÍA: Ciclo de vida avanzado

  • Reglas por **prefijo**: \`s3/fotos/\` → todo lo que contenga esa ruta.
  • Reglas por **etiquetas**: p. ej. solo objetos con
    \`Department=Finanzas\`.
  • Expiración de **versiones antiguas** (con versionado activo) y de
    **subidas multipart incompletas**.
  • **S3 Analytics**: analiza los datos y da un informe diario (tarda
    24-48 h en empezar) con recomendaciones para decidir cuándo pasar
    objetos a Standard-IA. NO sirve para One Zone-IA ni Glacier.`,
    explanationText:
      "🌍 Ejemplo cotidiano: S3 Analytics es el consultor que revisa tus hábitos de uso y te dice 'esta estantería apenas se abre: muévela al trastero'; el ciclo de vida es la persona que ejecuta el cambio puntual a una fecha fija.\n\nAnalytics informa (recomienda) pero no mueve nada: el movimiento lo hace la regla de ciclo de vida. Y ojo: su recomendación alcanza a Standard-IA, no a One Zone-IA ni a Glacier, una distinción muy preguntada.",
    codeSnippet: "// Afirmaciones sobre reglas de ciclo de vida y S3 Analytics",
    inputs: {},
    completeCode:
      "Reglas por prefijo o etiquetas | expiran versiones antiguas y multipart incompletas | Analytics recomienda Standard-IA",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de las reglas de ciclo de vida y S3 Analytics.",
      statements: [
        {
          id: "a",
          text: "Una regla de ciclo de vida puede hacer transiciones de clase (p. ej. a Standard-IA o Glacier) y acciones de expiración (eliminar objetos tras un tiempo).",
          answer: true,
          explanation:
            "Correcto: transición y expiración son las dos acciones principales de una regla.",
        },
        {
          id: "b",
          text: "Las reglas de ciclo de vida solo pueden aplicarse a todo el bucket: no se limitan por prefijo ni por etiquetas.",
          answer: false,
          explanation:
            "Falso: se pueden crear reglas para un prefijo concreto (s3/fotos/) o para objetos con una etiqueta específica.",
        },
        {
          id: "c",
          text: "S3 Analytics da recomendaciones para decidir cuándo mover objetos a Standard-IA, pero no sirve para One Zone-IA ni para Glacier.",
          answer: true,
          explanation:
            "Correcto: el informe de Analytics recomienda solo transiciones a Standard-IA.",
        },
        {
          id: "d",
          text: "Las reglas de expiración no pueden eliminar versiones antiguas ni subidas incompletas de cargas multipart.",
          answer: false,
          explanation:
            "Falso: la expiración sí puede borrar versiones antiguas (con versionado) y subidas multipart incompletas.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // EVENTOS Y RENDIMIENTO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 17,
    title: "Notificaciones de Eventos de S3",
    stars: 2,
    category: "EVENTOS Y RENDIMIENTO",
    description:
      "Cuando pasa algo en un bucket (se crea, borra o restaura un objeto), S3 puede avisar a SNS, SQS, Lambda o EventBridge.",
    objective: "Saber a qué destinos llegan los eventos",
    tags: ["eventos", "SNS", "SQS", "Lambda", "EventBridge"],
    fileName: "s3-events",
    completed: false,
    theory: `📚 TEORÍA: Notificaciones de eventos

  • Eventos: creación de un objeto, borrado, restauración o replicación.
  • Se pueden **filtrar** por extensión (p. ej. solo *.jpg) o por nombre.
  • Destinos clásicos: **SNS** (email/SMS), **SQS** (cola) y **Lambda**
    (ejecutar una función, p. ej. generar miniaturas).
  • Destino moderno: **EventBridge**, que recibe TODOS los eventos y permite
    reglas avanzadas hacia más de 18 servicios (Step Functions, Kinesis...),
    con filtrado por metadatos, tamaño o nombre del objeto.
  • La entrega suele producirse en segundos, a veces tarda un minuto o más.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es el timbre de la puerta: cada vez que llega un paquete (objeto nuevo), S3 avisa al repartidor que prefieras: mensaje al móvil (SNS), buzón de encargos (SQS), robot que lo procesa al momento (Lambda) o centralita inteligente con muchos destinos (EventBridge).\n\nLos tres destinos clásicos (SNS, SQS, Lambda) son los que pregunta el examen; EventBridge añade filtrado avanzado y multiplica los destinos. La integración 'crear miniaturas al subir una imagen' es el caso de uso estrella de Lambda + S3.",
    codeSnippet: "// Empareja cada destino de las notificaciones de eventos de S3",
    inputs: {},
    completeCode:
      "SNS (email/SMS) | SQS (cola) | Lambda (miniaturas) | EventBridge (filtros + 18 servicios)",
    format: "matching",
    matching: {
      prompt:
        "Conecta cada servicio destino de las notificaciones de S3 con su papel.",
      definitions: [
        "Encola el evento para que una aplicación lo consuma de forma asíncrona y tolerante a fallos.",
        "Ejecuta una función automáticamente, p. ej. generar miniaturas de imágenes recién subidas.",
        "Recibe todos los eventos del bucket y permite reglas avanzadas hacia más de 18 servicios destino.",
        "Publica la notificación por email, SMS o push cuando ocurre el evento en el bucket.",
      ],
      pairs: [
        {
          id: "sns",
          term: "Amazon SNS",
          definition:
            "Publica la notificación por email, SMS o push cuando ocurre el evento en el bucket.",
        },
        {
          id: "sqs",
          term: "Amazon SQS",
          definition:
            "Encola el evento para que una aplicación lo consuma de forma asíncrona y tolerante a fallos.",
        },
        {
          id: "lambda",
          term: "AWS Lambda",
          definition:
            "Ejecuta una función automáticamente, p. ej. generar miniaturas de imágenes recién subidas.",
        },
        {
          id: "eventbridge",
          term: "Amazon EventBridge",
          definition:
            "Recibe todos los eventos del bucket y permite reglas avanzadas hacia más de 18 servicios destino.",
        },
      ],
    },
  },

  {
    id: 18,
    title: "Rendimiento de S3 y S3 Select",
    stars: 3,
    category: "EVENTOS Y RENDIMIENTO",
    description:
      "S3 escala a miles de peticiones por prefijo, usa multipart para archivos grandes, rangos de bytes para descargas paralelas y S3 Select para filtrar con SQL en el servidor.",
    objective: "Optimizar rendimiento y transferencia",
    tags: ["rendimiento", "multipart", "S3 Select", "byte range"],
    fileName: "s3-performance",
    completed: false,
    theory: `📚 TEORÍA: Rendimiento de S3

  • Latencia baja: primer byte en **100-200 ms**. Escala automáticamente.
  • Por PREFIJO: 3.500 escrituras (PUT/COPY/POST/DELETE) y 5.500 lecturas
    (GET/HEAD) por segundo. Sin límite de prefijos → más prefijos = más
    rendimiento total.
  • **Multipart upload**: recomendada >100 MB y OBLIGATORIA >5 GB. Sube las
    partes en paralelo. Compatible con Transfer Acceleration (edge locations).
  • **Byte ranges**: descargas en paralelo y mejor resiliencia ante fallos.
  • **S3 Select**: usa SQL para filtrar en el servidor y devolver solo las
    filas/columnas que necesitas: menos transferencia de red y menos CPU
    del cliente. También hay Glacier Select.`,
    explanationText:
      "🌍 Ejemplo cotidiano: multipart es dividir el camión de mudanzas en furgonetas que llegan a la vez; byte ranges es pedir solo el capítulo que quieres en vez de la serie entera; S3 Select es que el archivista filtre por ti antes de mandarte el informe, en lugar de enviarte los 10.000 papeles.\n\nEl examen adora estas cifras: 3.500/5.500 por prefijo, 100 MB recomendado / 5 GB obligatorio. Y S3 Select aparece en escenarios donde 'recuperar menos datos' reduce coste y CPU del cliente.",
    codeSnippet: "// Afirmaciones sobre el rendimiento de S3 y S3 Select",
    inputs: {},
    completeCode:
      "3.500 PUT / 5.500 GET por prefijo | multipart >5 GB obligatorio | byte ranges en paralelo | S3 Select filtra en servidor",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión del rendimiento de S3 y S3 Select.",
      statements: [
        {
          id: "a",
          text: "S3 alcanza 3.500 peticiones de escritura y 5.500 de lectura por segundo POR PREFIJO, sin límite en el número de prefijos.",
          answer: true,
          explanation:
            "Correcto: dividir los objetos en más prefijos multiplica el rendimiento total del bucket.",
        },
        {
          id: "b",
          text: "La carga multipart es recomendada para archivos mayores de 100 MB y obligatoria para superar los 5 GB.",
          answer: true,
          explanation:
            "Correcto: paraleliza la subida y es el único camino válido por encima de 5 GB.",
        },
        {
          id: "c",
          text: "Los rangos de bytes (byte ranges) permiten paralelizar descargas y reanudar trozos concretos si falla la transferencia.",
          answer: true,
          explanation:
            "Correcto: pides porciones del objeto en paralelo y mejoras la resiliencia ante fallos.",
        },
        {
          id: "d",
          text: "S3 Select transfiere el archivo completo al cliente, que es quien filtra los datos con SQL en su propia máquina.",
          answer: false,
          explanation:
            "Falso: S3 Select filtra con SQL en el lado del SERVIDOR y solo envía los datos que necesitas.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CIFRADO Y ACCESO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 19,
    title: "Cifrado: SSE-S3, SSE-KMS y SSE-C",
    stars: 3,
    category: "CIFRADO Y ACCESO",
    description:
      "Hay tres cifrados del lado del servidor: claves gestionadas por S3 (AES-256), claves de KMS (auditoría con CloudTrail) o claves que tú envías en cada petición.",
    objective: "Distinguir SSE-S3, SSE-KMS y SSE-C",
    tags: ["cifrado", "SSE-KMS", "AES-256", "encabezados"],
    fileName: "s3-encryption",
    completed: false,
    theory: `📚 TEORÍA: Los tres cifrados del lado del servidor

  • **SSE-S3** (\`x-amz-server-side-encryption: AES256\`): claves manejadas
    y propiedad de AWS. Cifrado AES-256 en el servidor.
  • **SSE-KMS** (\`x-amz-server-side-encryption: aws:kms\` + id de clave):
    claves en AWS KMS. Ventajas: control del usuario y auditoría de uso con
    CloudTrail. Cada subida/descarga llama a KMS (GenerateDataKey/Decrypt)
    y cuenta para la cuota de KMS por segundo.
  • **SSE-C**: tú proporcionas la clave de cifrado en las cabeceras HTTP en
    cada petición; S3 no la almacena. OBLIGA a usar HTTPS.
  • Existe además el cifrado del lado del CLIENTE: el cliente cifra antes
    de subir y descifra al descargar, fuera de AWS.

En tránsito, se recomienda usar HTTPS (SSL/TLS).`,
    explanationText:
      "🌍 Ejemplo cotidiano: SSE-S3 es la caja fuerte que te pone el banco y cuya llave guarda el propio banco; SSE-KMS es la caja fuerte cuyo uso queda registrado en un libro de firmas (CloudTrail); SSE-C eres tú quien lleva la llave en el bolsillo y la enseña cada vez que abres la caja.\n\nEn el examen: KMS brilla por la auditoría y el control; SSE-C por la obligación de HTTPS y por que AWS no guarda tu clave. La cabecera correcta (\`AES256\` vs \`aws:kms\`) es un clásico de respuesta múltiple.",
    codeSnippet: "// Cuatro comandos para subir un objeto cifrado",
    inputs: {},
    completeCode:
      "SSE-S3: AES256 | SSE-KMS: aws:kms + key-id (auditoría CloudTrail) | SSE-C: clave en cabeceras + HTTPS",
    format: "snippet-pick",
    snippetPick: {
      prompt:
        "Necesitas cifrar un objeto con SSE-KMS (claves gestionadas en AWS KMS) y además poder auditar el uso de la clave. ¿Cuál es el comando correcto?",
      snippets: [
        {
          id: "sse-s3",
          label: "Opción A",
          description:
            "Cifra con SSE-S3 (AES-256): claves propiedad de AWS, sin auditoría de KMS.",
          code: `aws s3api put-object \\
  --bucket mi-bucket --key datos.txt \\
  --body datos.txt --server-side-encryption AES256`,
        },
        {
          id: "sse-kms",
          label: "Opción B",
          description:
            "Cifra con SSE-KMS indicando la clave de KMS: control y auditoría con CloudTrail.",
          code: `aws s3api put-object \\
  --bucket mi-bucket --key datos.txt \\
  --body datos.txt --server-side-encryption aws:kms \\
  --ssekms-key-id arn:aws:kms:us-east-1:123456789012:key/abcd`,
        },
        {
          id: "sse-c",
          label: "Opción C",
          description:
            "Valor de cifrado inexistente: no corresponde a ninguna opción de S3.",
          code: `aws s3api put-object \\
  --bucket mi-bucket --key datos.txt \\
  --body datos.txt --server-side-encryption sse-c`,
        },
        {
          id: "sin-cifrado",
          label: "Opción D",
          description:
            "Sube el objeto sin cabecera de cifrado: dependerá del cifrado por defecto del bucket.",
          code: `aws s3api put-object \\
  --bucket mi-bucket --key datos.txt \\
  --body datos.txt`,
        },
      ],
      correct: 1,
    },
  },

  {
    id: 20,
    title: "CORS, URLs Pre-firmadas y Access Logs",
    stars: 3,
    category: "CIFRADO Y ACCESO",
    description:
      "CORS permite peticiones entre orígenes, las URLs pre-firmadas dan acceso temporal a un objeto privado y los Access Logs registran cada petición... en otro bucket.",
    objective: "Repasar CORS, pre-firmadas y logs de acceso",
    tags: ["CORS", "pre-signed", "access logs", "origen"],
    fileName: "s3-security",
    completed: false,
    theory: `📚 TEORÍA: Seguridad de acceso

  • **CORS**: el navegador bloquea peticiones entre orígenes salvo que el
    destino envíe cabeceras CORS. Un origen = esquema + host + puerto.
    En S3 se configura con un JSON; se puede permitir un origen concreto
    o todos con "*".
  • **URLs pre-firmadas**: acceso temporal a un objeto privado. Caducan
    (consola: 1 min a 12 h; CLI/SDK: por defecto 3.600 s, máximo 168 h).
    El usuario hereda los permisos del que generó la URL (GET o PUT).
  • **Access Logs**: cada petición (autorizada o denegada) se registra en
    un bucket de logs en la MISMA región. NUNCA uses el mismo bucket como
    destino: se crea un bucle exponencial y la factura se dispara.`,
    explanationText:
      "🌍 Ejemplo cotidiano: CORS es el portero del edificio que deja entrar a quien viene con una invitación (cabecera con origen válido); la URL pre-firmada es el pase VIP con hora de caducidad que tú entregas; los access logs son la hoja de control de entradas que se archiva en OTRA oficina para que no se grabe a sí misma.\n\nPunto de examen: el usuario de una URL pre-firmada hereda los permisos del generador. Y el warning del instructor es tajante: logs en un bucket separado, jamás en el monitorizado, o pagarás un bucle de logs infinito.",
    codeSnippet: "// Afirmaciones sobre CORS, URLs pre-firmadas y access logs",
    inputs: {},
    completeCode:
      "CORS: origen = esquema+host+puerto | pre-firmada: temporal, hereda permisos | logs: bucket separado en la misma región",
    format: "true-false",
    trueFalse: {
      prompt:
        "Valida tus conocimientos sobre CORS, URLs pre-firmadas y access logs de S3.",
      statements: [
        {
          id: "a",
          text: "Un 'origen' en CORS se compone de esquema (protocolo) + host (dominio) + puerto: https://www.example.com y http://www.example.com son orígenes distintos.",
          answer: true,
          explanation:
            "Correcto: cambiar el protocolo o el puerto crea un origen diferente para el navegador.",
        },
        {
          id: "b",
          text: "Sin las cabeceras CORS configuradas, el navegador bloquea las peticiones entre orígenes aunque el bucket permita el acceso por políticas.",
          answer: true,
          explanation:
            "Correcto: CORS es un mecanismo del navegador: sin las cabeceras, la petición cruzada se deniega.",
        },
        {
          id: "c",
          text: "Una URL pre-firmada hereda los permisos del usuario que la generó y caduca: por defecto 3.600 segundos en CLI/SDK, con máximo de 168 horas.",
          answer: true,
          explanation:
            "Correcto: el tiempo de expiración se configura en segundos y el máximo en CLI/SDK es 168 horas (7 días).",
        },
        {
          id: "d",
          text: "Los access logs de S3 deben escribirse en el MISMO bucket monitorizado para centralizar la información y ahorrar costes.",
          answer: false,
          explanation:
            "Falso: usar el mismo bucket crea un bucle exponencial de logs y dispara la factura; usa un bucket separado en la misma región.",
        },
      ],
    },
  },
];
