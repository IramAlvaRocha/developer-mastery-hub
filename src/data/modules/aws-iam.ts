import type { Exercise } from "@/lib/types";

/** Ruta progresiva: IAM, usuarios/grupos/políticas, seguridad, CLI y credenciales (DVA-C02). */
export const AWS_IAM_EXERCISES: Exercise[] = [

  {
    id: 1,
    title: "IAM: La Identidad de AWS",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "IAM (Identity and Access Management) es el servicio de identidad de AWS. Es global y es la llave de todo lo demás.",
    objective: "Entender qué es IAM y el principio de mínimo privilegio",
    tags: ["IAM", "global", "mínimo privilegio", "root"],
    fileName: "iam",
    completed: false,
    theory: `📚 TEORÍA: Introducción a IAM

IAM es **Identity and Access Management**:
  • Es un servicio **global**: no entiende de regiones, no eliges una región.
  • Al crear tu cuenta de AWS nace la **cuenta root**, que no se recomienda
    usar ni compartir para el día a día: para eso están los usuarios IAM.

Cómo se organiza la identidad:
  • **Usuarios**: una cuenta IAM por cada persona física de tu organización.
  • **Grupos**: solo contienen usuarios (nada de subgrupos). Puedes agrupar
    por rol (desarrolladores, operaciones, auditoría).
  • **Políticas**: documentos JSON que definen los permisos y se asignan
    a usuarios o a grupos.

Principio de **mínimo privilegio**: no dar más permisos de los que el
usuario necesita, solo los que necesita. Es la regla de oro de IAM.`,
    explanationText:
      "🌍 Ejemplo cotidiano: IAM es la tarjeta de acceso de una oficina. La cuenta root es la llave maestra del edificio: no se la prestas a nadie. A cada empleado le das su tarjeta con los permisos justos de su puesto (mínimo privilegio).\n\nIAM es el servicio global de identidad y permisos de AWS. Nunca uses la cuenta root a diario: crea usuarios IAM y agrúpalos por rol. Si compartes la root o das permisos de más, cualquier error se convierte en un riesgo para toda la cuenta.",
    codeSnippet: "// Afirmaciones sobre IAM, la cuenta root y el mínimo privilegio",
    inputs: {},
    completeCode: "IAM = identidad global | root solo para config inicial | mínimo privilegio",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los fundamentos de IAM.",
      statements: [
        {
          id: "a",
          text: "IAM es un servicio global: no requiere elegir una región.",
          answer: true,
          explanation: "IAM no entiende de regiones. Lo configuras una vez y aplica a toda la cuenta, a diferencia de servicios regionales como EC2 o S3."
        },
        {
          id: "b",
          text: "La cuenta root debe usarse como cuenta diaria para acceder a los servicios.",
          answer: false,
          explanation: "El instructor lo deja claro: la cuenta root no debe usarse ni compartirse. Crea usuarios IAM para el trabajo diario."
        },
        {
          id: "c",
          text: "El principio de mínimo privilegio consiste en dar solo los permisos que un usuario necesita.",
          answer: true,
          explanation: "AWS aplica el principio de mínimo privilegio: nada de permisos innecesarios, solo los que el rol requiere."
        },
        {
          id: "d",
          text: "Las políticas IAM son documentos JSON que definen los permisos de usuarios o grupos.",
          answer: true,
          explanation: "Una política es exactamente eso: un documento JSON estructurado que describe qué acciones se permiten o deniegan."
        }
      ]
    }
  },

  {
    id: 2,
    title: "Usuarios y Grupos: La Estructura del Equipo",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "Los grupos de IAM organizan a los usuarios por rol. Recuerda: un grupo solo contiene usuarios, nunca otros grupos.",
    objective: "Entender la relación usuarios-grupos",
    tags: ["usuarios", "grupos", "políticas", "organización"],
    fileName: "iam-grupos",
    completed: false,
    theory: `📚 TEORÍA: Usuarios y Grupos

El instructor organiza su ejemplo con personas de una empresa:
  • Grupo **Desarrolladores**: Alice, Bob y Charles.
  • Grupo **Operaciones**: David y Edward.
  • Grupo **Auditoría**: donde también está Charles.

Reglas clave:
  • Un **grupo solo contiene usuarios**: no puede contener a otro grupo
    (no existen los subgrupos).
  • Estar en un grupo es **opcional**: un usuario puede no pertenecer
    a ninguno.
  • Un usuario puede estar en **varios grupos a la vez** (Charles está en
    Desarrolladores y Auditoría).

Las **políticas** se asignan al grupo y afectan a todos sus usuarios.
Un usuario sin grupo (como Fred) recibe una **política directa**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: los grupos son los equipos de un gimnasio (yoga, crossfit, spinning). Un socio puede estar en dos clases a la vez, y cada clase tiene su propio reglamento. Pero una clase nunca contiene a otra clase.\n\nEn IAM, agrupar por rol simplifica los permisos: creas la política una vez en el grupo y todos sus usuarios la heredan. Un usuario puede pertenecer a varios grupos (sus permisos se suman) y también puede existir sin grupo, con políticas directas.",
    codeSnippet: "// Afirmaciones sobre cómo se relacionan usuarios y grupos en IAM",
    inputs: {},
    completeCode: "Grupos solo con usuarios | sin subgrupos | usuario en varios grupos | política directa",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre la relación entre usuarios y grupos de IAM.",
      statements: [
        {
          id: "a",
          text: "Un grupo de IAM puede contener a otros grupos (subgrupos).",
          answer: false,
          explanation: "Los grupos solo contienen usuarios. No existen subgrupos en IAM, como explica el instructor."
        },
        {
          id: "b",
          text: "Un usuario de IAM puede pertenecer a varios grupos a la vez.",
          answer: true,
          explanation: "Sí: Charles está en el grupo de Desarrolladores y también en el de Auditoría. Sus permisos se combinan."
        },
        {
          id: "c",
          text: "Todo usuario de IAM debe pertenecer obligatoriamente a un grupo.",
          answer: false,
          explanation: "No es obligatorio. Fred no está en ningún grupo y aun así puede tener una política directa asignada."
        },
        {
          id: "d",
          text: "Asignar una política a un grupo aplica sus permisos a todos los usuarios del grupo.",
          answer: true,
          explanation: "Esa es la ventaja de los grupos: una sola política administra los permisos de todo el equipo."
        }
      ]
    }
  },

  {
    id: 3,
    title: "Política IAM: La Estructura JSON",
    stars: 2,
    category: "POLÍTICAS",
    description:
      "Toda política IAM es un documento JSON con campos fijos: Version, Id y Statement. Dentro del Statement, el corazón: Effect, Action y Resource.",
    objective: "Reconocer la estructura de una política JSON",
    tags: ["política", "JSON", "Statement", "Effect"],
    fileName: "iam-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Anatomía de una Política IAM

El instructor repasa cada campo de la política:

  • **Version**: la versión del lenguaje de la política. Siempre es
    "2012-10-17".
  • **Id** (opcional): identificador de la política (ej. S3AccountPermissions).
  • **Statement**: la definición real. Es **obligatoria**: una o más
    declaraciones. Sin ella la política no tiene sentido.

Dentro de cada declaración (Statement):
  • **Sid** (opcional): identificador de la declaración.
  • **Effect**: Allow (permite) o Deny (deniega).
  • **Principal**: la cuenta, usuario o rol al que se aplica.
  • **Action**: la lista de acciones permitidas o denegadas.
  • **Resource**: la lista de recursos a los que se aplican las acciones.
  • **Condition** (opcional): las condiciones para que la política se aplique.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la política es un contrato con cláusulas. Version es la plantilla oficial, Statement son las cláusulas y cada cláusula dice quién (Principal), qué (Action), dónde (Resource) y si se permite o se prohíbe (Effect).\n\nMemoriza los campos del Statement: Effect, Principal, Action, Resource y Condition. En el examen, identificar un campo mal escrito o fuera de lugar es una pregunta recurrente.",
    codeSnippet: `{
  "Version": "[INPUT_1]",
  "Id": "S3AccountPermissions",
  "Statement": [
    {
      "Sid": "1",
      "Effect": "[INPUT_2]",
      "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
      "Action": "s3:ListBucket",
      "Resource": "[INPUT_3]"
    }
  ]
}`,
    inputs: {
      INPUT_1: "2012-10-17",
      INPUT_2: "Allow",
      INPUT_3: "arn:aws:s3:::mi-bucket",
    },
    completeCode: '"Version": "2012-10-17" | Effect: Allow | Resource: arn:aws:s3:::mi-bucket',
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa la política con los valores correctos para cada campo.",
      options: {
        INPUT_1: ["2012-10-17", "2017-12-10", "2020-01-01"],
        INPUT_2: ["Allow", "Deny", "Permit"],
        INPUT_3: ["arn:aws:s3:::mi-bucket", "s3:ListBucket", "us-east-1", "Allow"],
      }
    }
  },

  {
    id: 4,
    title: "Effect y Action: Permitir y Denegar",
    stars: 2,
    category: "POLÍTICAS",
    description:
      "El campo Effect marca si la acción se permite o se deniega. Con Action eliges el servicio y la operación exacta.",
    objective: "Escribir una declaración que deniega una acción",
    tags: ["Effect", "Action", "Deny", "S3"],
    fileName: "deny-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Effect y Action

En cada declaración del Statement:
  • **Effect**: dos únicos valores posibles.
      - "Allow" → permite el acceso al recurso.
      - "Deny"  → lo deniega de forma explícita.
  • **Action**: la operación concreta del servicio en formato
    servicio:Acción (ej. "s3:DeleteBucket", "ec2:RunInstances",
    "cloudwatch:ListMetrics").
  • **Resource**: el ARN del recurso sobre el que actúa la acción
    (ej. "arn:aws:s3:::mi-bucket").

Ejemplo del instructor: una política que da permisos de lectura sobre
S3 y CloudWatch usando distintas Actions.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Effect es el cartel de la puerta — 'permitido pasar' (Allow) o 'prohibido' (Deny) — y Action es la llave concreta que abre esa puerta. Deny siempre gana sobre Allow si hay conflicto.\n\nCada Action usa el patrón servicio:Operación. No escribas 'DeleteBucket' a secas: IAM necesita el prefijo del servicio (s3:DeleteBucket) para saber a qué API se refiere.",
    codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "[INPUT_1]",
      "Action": "s3:[INPUT_2]",
      "Resource": "arn:aws:s3:::mi-bucket"
    }
  ]
}`,
    inputs: { INPUT_1: "Deny", INPUT_2: "DeleteBucket" },
    completeCode: '"Effect": "Deny" | "Action": "s3:DeleteBucket" | Resource: el ARN del bucket',
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa la política que deniega el borrado del bucket mi-bucket.",
      options: {
        INPUT_1: ["Deny", "Allow", "Block"],
        INPUT_2: ["DeleteBucket", "s3", "mi-bucket", "GetObject"],
      }
    }
  },

  {
    id: 5,
    title: "Mínimo Privilegio vs Permisos de Superusuario",
    stars: 2,
    category: "POLÍTICAS",
    description:
      "Una política con Action: '*' y Resource: '*' es el anti-patrón de AWS. La correcta concede solo lo necesario.",
    objective: "Elegir la política con mínimo privilegio",
    tags: ["mínimo privilegio", "snippet-pick", "Action", "Resource"],
    fileName: "iam-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Mínimo Privilegio en la Práctica

Una política demasiado abierta:
  { "Effect": "Allow", "Action": "*", "Resource": "*" }

Este comodín doble da control total sobre todos los servicios y recursos.
Es el anti-patrón que debes evitar (salvo casos muy puntuales).

Mínimo privilegio:
  { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::mi-bucket" }

  • Action específica: solo "s3:ListBucket".
  • Resource concreto: solo ese bucket, no todos los buckets.

La idea del instructor: no dar más permisos de los que el usuario necesita.`,
    explanationText:
      "🌍 Ejemplo cotidiano: mínimo privilegio es darle al repartidor solo la llave del portal, no la llave maestra del edificio completo. Si la reparte, el riesgo es proporcional a lo que esa llave abre.\n\nCon Action: \"*\" y Resource: \"*\" cualquier brecha compromete toda la cuenta. Una política específica limita el daño: aunque se filtre la credencial, solo expone ese bucket y esa operación.",
    codeSnippet: `// Política 1
{ "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::mi-bucket" }

// Política 2
{ "Effect": "Allow", "Action": "*", "Resource": "*" }

// Política 3
{ "Effect": "Deny", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::mi-bucket" }`,
    inputs: {},
    completeCode: "Mínimo privilegio = Action específica + Resource concreto, nunca '*' con '*'",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál es la política correcta para que una app solo liste el bucket mi-bucket?",
      snippets: [
        {
          id: "a",
          label: "Política 1",
          code: '{ "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::mi-bucket" }',
          description: "Concede exactamente la acción y el recurso necesarios."
        },
        {
          id: "b",
          label: "Política 2",
          code: '{ "Effect": "Allow", "Action": "*", "Resource": "*" }',
          description: "Acceso total a todos los servicios y recursos (anti-patrón)."
        },
        {
          id: "c",
          label: "Política 3",
          code: '{ "Effect": "Deny", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::mi-bucket" }',
          description: "Niega la operación que necesitas: haría fallar la app."
        }
      ],
      correct: 0
    }
  },

  {
    id: 6,
    title: "MFA: La Doble Llave de tu Cuenta",
    stars: 2,
    category: "SEGURIDAD",
    description:
      "Si solo proteges tu cuenta con contraseña, un robo de credenciales lo tumba todo. MFA añade un segundo factor: el dispositivo.",
    objective: "Entender MFA y la política de contraseñas",
    tags: ["MFA", "seguridad", "dispositivo", "contraseñas"],
    fileName: "mfa",
    completed: false,
    theory: `📚 TEORÍA: MFA y Política de Contraseñas

**Política de contraseñas** (para root y usuarios IAM):
  • Longitud mínima (ej. 10 caracteres).
  • Requerir mayúsculas, minúsculas, números y símbolos.
  • Permitir que los usuarios cambien su propia contraseña.
  • Rotación periódica obligatoria.
  • Evitar la reutilización de contraseñas anteriores.

**MFA (Multi Factor Authentication)**:
  • Dos factores: tu contraseña + un código de un dispositivo seguro
    (tu móvil, por ejemplo).
  • Si la contraseña es robada, la cuenta NO queda comprometida: el
    atacante necesita también el dispositivo.

Dispositivos MFA:
  • Virtual MFA: Google Authenticator, Authy (multidispositivo).
  • U2F Security Key: YubiKey (una clave para varios usuarios, root incluida).
  • Hardware key fob: Gemalto, o SurePassID para GovCloud.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la contraseña es la cerradura de tu puerta; MFA es el perro guardián del jardín. Que alguien copie la llave ya no basta: el perro (dispositivo) también tiene que reconocerte.\n\nEl instructor lo resalta: con MFA, aunque un hacker robe la contraseña, no puede entrar sin el código del dispositivo. Actívalo en la root y en todos los usuarios IAM; es lo que más reduce el riesgo de una cuenta comprometida.",
    codeSnippet: "// Afirmaciones sobre MFA y la política de contraseñas",
    inputs: {},
    completeCode: "MFA = contraseña + código de dispositivo | proteger root y usuarios | política de contraseñas fuerte",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre MFA y las políticas de contraseñas.",
      statements: [
        {
          id: "a",
          text: "Si la contraseña de un usuario es robada pero tiene MFA activado, la cuenta sigue protegida.",
          answer: true,
          explanation: "Es el principal beneficio de MFA: el atacante tendría la contraseña, pero no el dispositivo que genera el código."
        },
        {
          id: "b",
          text: "MFA solo puede configurarse en la cuenta root, nunca en los usuarios IAM.",
          answer: false,
          explanation: "MFA se configura tanto en la cuenta root como en cada usuario IAM. Es una buena práctica reforzarlo en todas las cuentas."
        },
        {
          id: "c",
          text: "Con MFA, el acceso requiere contraseña + un código de un dispositivo de seguridad.",
          answer: true,
          explanation: "Son dos factores: algo que sabes (contraseña) y algo que tienes (el dispositivo que genera el token)."
        },
        {
          id: "d",
          text: "Una política de contraseñas solo fija la longitud mínima; no puede evitar reutilizar contraseñas.",
          answer: false,
          explanation: "La política de contraseñas puede exigir longitud, tipos de caracteres, rotación e impedir la reutilización."
        }
      ]
    }
  },

  {
    id: 7,
    title: "Claves de Acceso: Usuario y Contraseña Programáticos",
    stars: 2,
    category: "SEGURIDAD",
    description:
      "La consola se protege con contraseña + MFA. Para CLI y SDK se usan las claves de acceso: un ID (usuario) y un secreto (contraseña).",
    objective: "Distinguir Access Key ID de Secret Access Key",
    tags: ["access key", "SecretAccessKey", "CLI", "SDK"],
    fileName: "access-keys",
    completed: false,
    theory: `📚 TEORÍA: Las 3 Formas de Acceder a AWS

El instructor presenta los tres pilares de acceso:
  1. **Consola de AWS**: por contraseña + MFA.
  2. **CLI (Command Line Interface)**: por claves de acceso. Interactúas
     con los servicios mediante comandos en tu terminal, con acceso
     directo a las APIs públicas y a scripts.
  3. **SDK (Software Developer Kit)**: por claves de acceso. Accedes a
     AWS desde código, con SDKs oficiales para Python (boto3/botocore),
     Java, Go, Node.js, Ruby, .NET, C++, etc.

Las **claves de acceso**:
  • Access Key ID → es como el "nombre de usuario".
  • Secret Access Key → es la "contraseña".
  • Son totalmente secretas: compartirlas equivale a entregar tu acceso.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la consola es entrar a tu banco por ventanilla; la CLI es el cajero automático; el SDK es una app que opera por ti. Las tres usan tu tarjeta: el Access Key ID es el número de la tarjeta y el Secret Access Key es el PIN.\n\nNunca compartas claves de acceso ni las subas a repositorios: son credenciales permanentes de nivel usuario. Si se filtran, alguien puede operar tu cuenta con tu identidad.",
    codeSnippet: `// Acceso programático (CLI y SDK)
Las [INPUT_1] de acceso se generan en la consola.

• Access Key [INPUT_2]: el "nombre de usuario" (identificador).
• Secret Access [INPUT_3]: la "contraseña", totalmente secreta.

Nunca las compartas ni las subas a código o repositorios.`,
    inputs: { INPUT_1: "claves", INPUT_2: "ID", INPUT_3: "Key" },
    completeCode: "Access Key ID (usuario) + Secret Access Key (contraseña) | acceso a CLI y SDK",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa las definiciones de las claves de acceso.",
      options: {
        INPUT_1: ["claves", "políticas", "contraseñas"],
        INPUT_2: ["ID", "secreto", "usuario"],
        INPUT_3: ["Key", "ID", "token"],
      }
    }
  },

  {
    id: 8,
    title: "CLI: Interactuar con AWS desde la Terminal",
    stars: 1,
    category: "CLI",
    description:
      "La CLI de AWS es de código abierto y da acceso directo a las APIs públicas. Un comando, un resultado: ¿qué devuelve aws iam list-users?",
    objective: "Predecir el resultado de un comando de la CLI",
    tags: ["CLI", "iam list-users", "terminal", "API"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: La AWS CLI

La **CLI de AWS** es una herramienta de línea de comandos, de código
abierto (está en GitHub), que permite interactuar con los servicios
de AWS mediante comandos en tu shell.

Características:
  • Acceso directo a las **APIs públicas** de los servicios.
  • Ideal para automatizar: puedes escribir scripts que gestionen
    recursos.
  • Es la alternativa profesional a la consola visual.

Sintaxis básica:  aws <servicio> <operación> [opciones]
  • aws iam list-users        → lista los usuarios IAM
  • aws iam list-groups       → lista los grupos
  • aws s3 ls                 → lista los buckets

En este curso la usarás constantemente para verificar permisos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la consola es Google Maps con todo en pantalla; la CLI es dar direcciones por voz: 'aws iam list-users' te responde la lista de usuarios sin abrir el navegador.\n\nCada comando de la CLI llama a la API del servicio con tus credenciales. Si el usuario tiene permiso, devuelve el resultado; si no, obtienes un error de permisos (lo que aprenderás a decodificar más adelante).",
    codeSnippet: `# En tu terminal (o CloudShell)
aws iam list-users`,
    inputs: {},
    completeCode: "aws iam list-users → lista los usuarios IAM de tu cuenta",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hace este comando de la CLI de AWS?",
      snippet: "aws iam list-users",
      options: [
        "Lista los usuarios de IAM de tu cuenta",
        "Crea un usuario nuevo en IAM",
        "Lista las políticas de un bucket S3",
        "Borra todos los usuarios IAM"
      ],
      answer: "Lista los usuarios de IAM de tu cuenta"
    }
  },

  {
    id: 9,
    title: "CloudShell: La Terminal en el Navegador",
    stars: 1,
    category: "CLI",
    description:
      "CloudShell te da una shell con AWS CLI sin instalar nada. Ojo: es un servicio regional, no global.",
    objective: "Entender qué es CloudShell y su alcance regional",
    tags: ["CloudShell", "terminal", "región", "navegador"],
    fileName: "cloudshell",
    completed: false,
    theory: `📚 TEORÍA: AWS CloudShell

CloudShell es un **entorno de terminal en el navegador** que AWS crea
para ti. Aspectos clave que destaca el instructor:

  • Tarda unos 30 segundos a 1 minuto en preparar el entorno.
  • Ya trae la AWS CLI instalada: puedes ejecutar aws --version sin
    instalar nada en tu máquina.
  • Puedes ejecutar comandos normales (clear, ls, cat...) y comandos
    aws (aws iam list-users).
  • Permite **subir y descargar archivos**, y abrir varias terminales.

⚠️ Importante para el examen: CloudShell funciona **a nivel de región**.
No está disponible en todas las regiones (el instructor cita el Norte
de California como una donde no opera). No es un servicio global.`,
    explanationText:
      "🌍 Ejemplo cotidiano: CloudShell es un ordenador prestado en la biblioteca: no cargas con tu portátil, solo te sientas y usas su terminal. Pero ese ordenador solo existe en la sucursal (región) donde la biblioteca tiene uno.\n\nComo CloudShell es regional, si estás en una región donde no opera, no podrás abrirlo. Es un detalle típico de examen: servicio global (IAM) vs servicio regional (CloudShell).",
    codeSnippet: "// Afirmaciones sobre AWS CloudShell",
    inputs: {},
    completeCode: "CloudShell = terminal en el navegador con AWS CLI incluida | funciona a nivel de región",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre AWS CloudShell.",
      statements: [
        {
          id: "a",
          text: "CloudShell es un servicio global disponible en todas las regiones.",
          answer: false,
          explanation: "CloudShell funciona a nivel de región y no opera en todas (el Norte de California es el ejemplo del instructor)."
        },
        {
          id: "b",
          text: "CloudShell permite ejecutar comandos aws como aws --version sin instalar la CLI en tu máquina.",
          answer: true,
          explanation: "El entorno ya trae la AWS CLI instalada. Por eso es cómodo para pruebas rápidas desde el navegador."
        },
        {
          id: "c",
          text: "CloudShell tarda entre 30 segundos y 1 minuto en preparar el entorno.",
          answer: true,
          explanation: "No es instantáneo: AWS crea el entorno al abrirlo, y eso lleva ese tiempo."
        },
        {
          id: "d",
          text: "Desde CloudShell puedes subir y descargar archivos desde o hacia el entorno.",
          answer: true,
          explanation: "Tiene opciones de upload y download de ficheros, además de poder abrir varias terminales."
        }
      ]
    }
  },

  {
    id: 10,
    title: "Roles para Servicios: Acciones en tu Nombre",
    stars: 2,
    category: "ROLES",
    description:
      "No solo las personas tienen roles. Una instancia EC2, una función Lambda o CloudFormation pueden actuar con un rol IAM en tu nombre.",
    objective: "Entender los roles de servicio y los Instance Profiles",
    tags: ["roles", "EC2", "Instance Profile", "servicios"],
    fileName: "iam-roles",
    completed: false,
    theory: `📚 TEORÍA: Roles de IAM para Servicios

Hasta ahora asignábamos permisos a personas. Pero los **servicios de AWS
también necesitan permisos** para actuar en tu nombre.

El instructor lo explica con una instancia EC2 (un servidor virtual):
tiene que realizar acciones y, para eso, necesita permisos que tú le das
mediante un **rol IAM**. El servicio interactúa con AWS usando las
políticas del rol.

Roles más comunes:
  • **EC2 Instance Role**: para instancias EC2.
  • **Lambda Function Role**: para funciones Lambda.
  • **CloudFormation Role**: para los stacks de CloudFormation.

En EC2, el rol se entrega a la instancia mediante un **Instance Profile**:
un contenedor que asocia el rol a la instancia.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es darle a tu fontanero una tarjeta de visitante que solo abre la puerta del edificio (y no las viviendas). El servicio usa esa tarjeta para trabajar por ti, con permisos limitados.\n\nLos roles de servicio son la forma segura de que una instancia o función acceda a otros servicios SIN claves de acceso permanentes dentro de la máquina. Las credenciales temporales del rol se entregan automáticamente a través del Instance Profile.",
    codeSnippet: "// Afirmaciones sobre roles de IAM para servicios",
    inputs: {},
    completeCode: "Roles = permisos para servicios | EC2 (Instance Profile), Lambda, CloudFormation",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los roles de servicio.",
      statements: [
        {
          id: "a",
          text: "Un rol de IAM solo puede asignarse a personas, nunca a servicios.",
          answer: false,
          explanation: "Los roles se asignan tanto a usuarios como a servicios. El instructor lo muestra con instancias EC2 que actúan en tu nombre."
        },
        {
          id: "b",
          text: "Una instancia EC2 puede usar un rol para interactuar con otros servicios de AWS en tu nombre.",
          answer: true,
          explanation: "Es el ejemplo central del instructor: la instancia EC2 recibe permisos vía rol y realiza acciones por ti."
        },
        {
          id: "c",
          text: "Lambda y CloudFormation son servicios que pueden usar roles de IAM.",
          answer: true,
          explanation: "Son los roles de servicio más comunes: roles de instancia EC2, de funciones Lambda y de CloudFormation."
        },
        {
          id: "d",
          text: "El Instance Profile es el contenedor que entrega el rol a la instancia EC2.",
          answer: true,
          explanation: "Asocias el rol a un Instance Profile y ese profile se lo asignas a la instancia. Así EC2 obtiene las credenciales del rol."
        }
      ]
    }
  },

  {
    id: 11,
    title: "Herramientas de Seguridad: Reporte vs Advisor",
    stars: 2,
    category: "ROLES",
    description:
      "IAM trae dos herramientas para auditar permisos: el Credentials Report (nivel cuenta) y el Access Advisor (nivel usuario).",
    objective: "Distinguir Credentials Report de Access Advisor",
    tags: ["Credentials Report", "Access Advisor", "auditoría", "seguridad"],
    fileName: "iam-seguridad",
    completed: false,
    theory: `📚 TEORÍA: Herramientas de Seguridad de IAM

Dos herramientas clave (las usa el instructor para auditar permisos):

  1. **Credentials Report** (informe de credenciales de IAM):
     • Funciona a **nivel de cuenta**.
     • Enumera todos los usuarios de tu cuenta y el **estado de sus
       credenciales** (contraseñas, claves de acceso, MFA...).
     • Se descarga como CSV para revisar brechas de seguridad.

  2. **Access Advisor** (asesor de acceso de IAM):
     • Funciona a **nivel de usuario**.
     • Muestra los permisos de servicios concedidos a un usuario y la
       **última vez** que accedió a cada servicio.
     • Sirve para detectar permisos que ya no se usan y recortarlos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el Credentials Report es la auditoría del edificio completo (estado de todas las tarjetas); el Access Advisor es la ficha de un empleado concreto (qué puertas usa y cuándo fue la última vez).\n\nÚsalos juntos para aplicar mínimo privilegio de forma continua: el reporte te da la foto general y el advisor te dice qué permisos sobran en cada usuario para retirarlos.",
    codeSnippet: `Herramientas de seguridad de IAM:

• Informe de credenciales ([INPUT_1] Report):
  a nivel de [INPUT_2], enumera usuarios y el estado de sus credenciales.

• [INPUT_3] Advisor:
  a nivel de [INPUT_4], muestra permisos por usuario y la última vez que
  accedió a cada servicio.`,
    inputs: { INPUT_1: "Credentials", INPUT_2: "cuenta", INPUT_3: "Access", INPUT_4: "usuario" },
    completeCode: "Credentials Report = nivel cuenta (CSV) | Access Advisor = nivel usuario (último acceso)",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa con la herramienta y el alcance correctos para cada descripción.",
      options: {
        INPUT_1: ["Credentials", "Access", "Security"],
        INPUT_2: ["cuenta", "usuario", "grupo"],
        INPUT_3: ["Access", "Credentials", "Permission"],
        INPUT_4: ["usuario", "cuenta", "región"],
      }
    }
  },

  {
    id: 12,
    title: "Buenas Prácticas: ¿Dónde Guardas las Credenciales?",
    stars: 2,
    category: "ROLES",
    description:
      "Nunca almacenes credenciales en el código. Para una app en EC2, el rol de instancia es la opción correcta.",
    objective: "Elegir el enfoque seguro para credenciales en EC2",
    tags: ["buenas prácticas", "credenciales", "roles", "EC2"],
    fileName: "app-config.ts",
    completed: false,
    theory: `📚 TEORÍA: Buenas Prácticas de IAM

El instructor recopila las directrices elementales:

  • **No usar la cuenta root** salvo para la configuración inicial.
  • **Un usuario físico = un usuario IAM**: nunca compartir cuentas.
  • Asignar usuarios a **grupos** y permisos a los grupos.
  • **Política de contraseñas fuerte** + **MFA** reforzado.
  • Usar **roles** para dar permisos a los servicios de AWS.
  • Usar **claves de acceso** para el acceso programático (CLI/SDK).
  • Revisar permisos con el **informe de credenciales** (CSV).
  • **Nunca compartir usuarios ni claves de acceso.**

Y una regla de oro repetida en el curso: no almacenes credenciales en
el código. Las apps en EC2 deben usar un rol de instancia.`,
    explanationText:
      "🌍 Ejemplo cotidiano: poner la contraseña de tu banco en una nota pegada en el monitor es tan peligroso como subir credenciales a GitHub. La forma segura es delegar: el rol de instancia le entrega credenciales temporales a EC2 sin que aparezcan en tu código.\n\nLas credenciales hardcodeadas se filtran por git, logs o artefactos. Con un rol de instancia no hay secretos que robar: el propio servicio de AWS gestiona las credenciales temporales por ti.",
    codeSnippet: `// App en una instancia EC2 que accede a S3:

// Opción A — dentro del código
const accessKey = 'AKIA...';
const secretKey = 'wJalrXUtnFEMI/K7MDENG...';

// Opción B — variables de entorno de la instancia
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG...

// Opción C — rol de instancia EC2 con solo s3:GetObject sobre el bucket`,
    inputs: {},
    completeCode: "Rol de instancia EC2 = credenciales temporales automáticas, sin secretos en código",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál es el enfoque correcto para que una app en EC2 acceda de forma segura a S3?",
      snippets: [
        {
          id: "a",
          label: "Opción A",
          code: "const accessKey = 'AKIA...';\nconst secretKey = 'wJalrXUtnFEMI/K7MDENG...';",
          description: "Credenciales hardcodeadas en el código: se filtran con facilidad."
        },
        {
          id: "b",
          label: "Opción B",
          code: "AWS_ACCESS_KEY_ID=AKIA...\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG...",
          description: "Mejor que en código, pero sigue siendo un secreto permanente en la instancia."
        },
        {
          id: "c",
          label: "Opción C",
          code: "Rol de instancia EC2 (Instance Profile) con permisos mínimos de S3",
          description: "Credenciales temporales automáticas: sin secretos en la máquina."
        }
      ],
      correct: 2
    }
  },

  {
    id: 13,
    title: "STS: Decodificar Mensajes de Error de Permisos",
    stars: 2,
    category: "CLI",
    description:
      "Los errores de permisos de la API llegan largos y codificados. El servicio STS los decodifica a JSON legible.",
    objective: "Predecir qué hace aws sts decode-authorization-message",
    tags: ["STS", "decode", "errores", "permisos"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: Descifrar el STS desde la CLI

Cuando una llamada a la API de AWS falla por permisos, el mensaje de
error es muy largo y está **codificado**: a simple vista no entendemos
nada (el instructor lo prueba en clase).

Para descifrarlo se usa el servicio **STS** (Security Token Service)
con el comando:

  aws sts decode-authorization-message --encoded-message <mensaje>

  • Le pasas el mensaje codificado.
  • Devuelve el error decodificado en **formato JSON** legible.
  • Ese JSON revela la acción denegada, el recurso y por qué falló.

Nota: el usuario necesita permiso sobre sts:DecodeAuthorizationMessage
para poder ejecutar el comando (el instructor lo añade a la política).`,
    explanationText:
      "🌍 Ejemplo cotidiano: es recibir una factura cifrada y pasarla por el lector de códigos QR: el STS convierte el galimatías en un recibo claro que dice exactamente qué permiso falta.\n\nCuando veas 'AccessDenied' y no entiendas el motivo, usa aws sts decode-authorization-message. El JSON resultante te dice la acción y el recurso problemáticos, algo típico de debugging en el examen y en producción.",
    codeSnippet: `# Un error de permisos aparece codificado y gigante
# Para entenderlo:

aws sts decode-authorization-message --encoded-message <mensaje>`,
    inputs: {},
    completeCode: "aws sts decode-authorization-message --encoded-message <msg> → JSON legible",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hace este comando de la CLI de AWS?",
      snippet: "aws sts decode-authorization-message --encoded-message <mensaje_codificado>",
      options: [
        "Decodifica el mensaje de error de permisos a JSON legible",
        "Crea una sesión temporal con credenciales",
        "Rota la clave de acceso del usuario",
        "Lista los roles de la cuenta"
      ],
      answer: "Decodifica el mensaje de error de permisos a JSON legible"
    }
  },

  {
    id: 14,
    title: "Perfiles de la CLI: Varias Cuentas desde la Terminal",
    stars: 2,
    category: "CLI",
    description:
      "¿Cómo controlas varias cuentas de AWS desde la CLI? Con aws configure --profile y el flag --profile en cada comando.",
    objective: "Crear y usar perfiles con nombre en la CLI",
    tags: ["perfiles", "--profile", "aws configure", "cuentas"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: Perfiles de la AWS CLI

La CLI guarda tu configuración en el directorio oculto **~/.aws**:
  • **credentials**: las claves de acceso.
  • **config**: la región y el formato de salida por defecto.

Con un solo perfil tienes la cuenta "default". Para añadir más cuentas:

  aws configure --profile <nombre>
  • Te pide Access Key ID, Secret Access Key, región y formato.
  • Crea un bloque nuevo en ~/.aws/credentials y config.

Para usar una cuenta concreta en cada comando:

  aws s3 ls --profile <nombre>
  • Con --profile eliges la cuenta con la que operas.
  • Sin él, se usa el perfil "default".

Así puedes operar varias cuentas sin mezclar credenciales.`,
    explanationText:
      "🌍 Ejemplo cotidiano: los perfiles son cuentas bancarias distintas en la misma app. Con --profile eliges de qué cuenta pagas en cada movimiento; sin el flag, siempre se usa la 'default'.\n\nNunca compartas esas credenciales ni las subas a código: viven en ~/.aws/credentials y solo tú debes tener acceso. Es la forma limpia de alternar entre cuentas personales y de empresa.",
    codeSnippet: `# Crear un perfil para una segunda cuenta (ej. producción)
aws [INPUT_1] --[INPUT_2] prod

# Usar ese perfil para listar buckets de esa cuenta
aws s3 ls --[INPUT_3] prod

# Sin --profile se usa la cuenta "default"`,
    inputs: { INPUT_1: "configure", INPUT_2: "profile", INPUT_3: "profile" },
    completeCode: "aws configure --profile prod | aws s3 ls --profile prod",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa los comandos para crear y usar un perfil llamado prod.",
      options: {
        INPUT_1: ["configure", "config", "iam"],
        INPUT_2: ["profile", "account", "credentials"],
        INPUT_3: ["profile", "region", "output"],
      }
    }
  },

  {
    id: 15,
    title: "MFA con la CLI: get-session-token",
    stars: 3,
    category: "CLI",
    description:
      "¿Cómo usas MFA desde la CLI? Creas una sesión temporal con STS GetSessionToken pasando tu dispositivo MFA y el código.",
    objective: "Llamar a sts get-session-token con MFA",
    tags: ["MFA", "STS", "get-session-token", "sesión temporal"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: CLI de AWS con MFA

Hasta ahora usabas MFA solo en la consola. Para integrarlo con la CLI
hay una forma muy concreta (pregunta típica de examen):

  aws sts get-session-token \\
    --serial-number <ARN_del_dispositivo_MFA> \\
    --token-code <código_de_la_app> \\
    --duration-seconds <segundos>

  • **--serial-number**: el ARN del dispositivo MFA del usuario, que
    encuentras en la consola en sus credenciales de seguridad.
  • **--token-code**: el código actual de la app MFA (esos ~30 segundos).
  • **--duration-seconds**: duración de la sesión temporal.

La respuesta devuelve **AccessKeyId, SecretAccessKey y SessionToken**:
con esas tres credenciales temporales ya puedes operar con la CLI usando
MFA. Siempre que preguntes por MFA con la CLI, piensa en
**get-session-token**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el token de MFA es el torniquete del metro: aunque tengas billete (contraseña), el torniquete (STS) te exige el código vigente del móvil para darte la salida (sesión temporal).\n\nGetSessionToken convierte tu credencial permanente + el código MFA en credenciales temporales con SessionToken. Es la única forma estándar de exigir MFA en llamadas programáticas: la sesión nace solo si presentas el código correcto del dispositivo.",
    codeSnippet: `# Crear una sesión temporal con MFA
aws sts [INPUT_1] \\
  --serial-number arn:aws:iam::123456789012:mfa/dev-user \\
  --token-code [INPUT_2] \\
  --duration-seconds [INPUT_3]`,
    inputs: { INPUT_1: "get-session-token", INPUT_2: "123456", INPUT_3: "3600" },
    completeCode: "aws sts get-session-token --serial-number <ARN MFA> --token-code <código> --duration-seconds <seg>",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa el comando que crea una sesión temporal con MFA. (El token-code y duration son valores de ejemplo.)",
      options: {
        INPUT_1: ["get-session-token", "assume-role", "get-caller-identity"],
        INPUT_2: ["123456", "AKIA...", "3600"],
        INPUT_3: ["3600", "123456", "us-east-1"],
      }
    }
  },

  {
    id: 16,
    title: "Backoff Exponencial: ¿Qué Hacer ante Throttling?",
    stars: 3,
    category: "CLI",
    description:
      "Superar los límites de llamadas a la API devuelve errores de estrangulamiento (5xx / ThrottlingException). La solución: backoff exponencial.",
    objective: "Reaccionar a errores de throttling con backoff exponencial",
    tags: ["backoff exponencial", "throttling", "cuotas", "5xx"],
    fileName: "api",
    completed: false,
    theory: `📚 TEORÍA: Backoff Exponencial y Cuotas de Servicio

AWS tiene dos tipos de límites:
  1. **Límites de tasa de la API** (cuántas llamadas por segundo).
     Ejemplos del instructor:
       • ec2:RunInstances → 100 llamadas/s.
       • s3:GetObject → 5500 llamadas/s por prefijo.
  2. **Cuotas de servicio**: límites de recursos de un servicio
     (ej. número de vCPU de EC2 en tu cuenta).

Cuando te pasas del límite obtienes un error intermitente de
**estrangulamiento (ThrottlingException)**.

¿Cómo se reacciona? Con **backoff exponencial**:
  • Esperas crecientes entre reintentos: 1s → 2s → 4s → 8s → 16s.
  • Cuanto más reintentas, más esperas → menos carga para el servidor.

Regla de oro del examen:
  • Usa backoff exponencial con errores de **servidor (5xx)** y con
    throttling.
  • NO lo uses con errores de cliente (**4xx**, ej. 400, 404).

Si los reintentos no bastan, solicita un **aumento del límite**
(Service Quotas). El SDK de AWS ya incluye backoff integrado; si usas
la API directamente, eres responsable de implementarlo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la fila del concierto: si el aforo está lleno, no tiene sentido empujar la puerta cada segundo; espera un poco más cada vez (1s, 2s, 4s...) y la gente irá saliendo. Empujar sin pausa solo empeora la congestión.\n\nAnte ThrottlingException o 5xx, reintenta con esperas que se duplican. Con errores 4xx el fallo es de tu petición (no tiene sentido reintentar igual). Recuerda: si usas el SDK, el backoff ya viene integrado.",
    codeSnippet: `HTTP 503 Service Unavailable
ThrottlingException: Rate exceeded`,
    inputs: {},
    completeCode: "5xx/Throttling → backoff exponencial (1s,2s,4s,8s...) | 4xx → no reintentar | SDK ya lo integra",
    format: "prediction",
    prediction: {
      prompt: "Tu aplicación recibe este error al llamar a la API de forma intensiva. ¿Cuál es la respuesta correcta?",
      snippet: "HTTP 503 Service Unavailable\nThrottlingException: Rate exceeded",
      options: [
        "Reintentar con backoff exponencial (esperas crecientes)",
        "Reintentar de inmediato en un bucle sin pausa",
        "Ignorar el error y seguir con la siguiente operación",
        "Cambiar la región de la cuenta"
      ],
      answer: "Reintentar con backoff exponencial (esperas crecientes)"
    }
  },

  {
    id: 17,
    title: "Cadena de Credenciales: La Prioridad que Manda",
    stars: 3,
    category: "CLI",
    description:
      "La CLI y el SDK buscan credenciales en un orden fijo. Las variables de entorno ganan al perfil de instancia EC2.",
    objective: "Resolver el escenario de prioridad de credenciales",
    tags: ["cadena de credenciales", "variables de entorno", "instance profile", "prioridad"],
    fileName: "credenciales",
    completed: false,
    theory: `📚 TEORÍA: Proveedor y Cadena de Credenciales

La AWS CLI busca credenciales en un **orden de prioridad** estricto:
  1. **Opciones de la línea de comandos** (--profile, --output...).
  2. **Variables de entorno** (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
     AWS_SESSION_TOKEN).
  3. **Archivo de credenciales** (~/.aws/credentials).
  4. **Archivo de configuración** de la CLI (~/.aws/config).
  5. **Credenciales de contenedor** (ECS).
  6. **Perfil de instancia** (EC2).

El **SDK** usa una cadena similar (propiedades del sistema → variables
de entorno → archivo de perfiles → contenedor → perfil de instancia).

Escenario del instructor: una app en EC2 usa variables de entorno con
un usuario IAM con S3:FullAccess, y además la instancia tiene un rol con
permiso solo para un bucket. ¿A qué buckets accede la app? A **todos**,
porque las variables de entorno tienen prioridad sobre el instance
profile.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la cadena de credenciales es como la lista de herederos de una herencia: se consultan en orden hasta encontrar la primera que vale. Si el testamento (variables de entorno) dice 'tiene acceso a todo', no importa lo que diga el heredero siguiente (perfil de instancia).\n\nAunque crees un rol con mínimo privilegio, si en la instancia siguen presentes variables de entorno con un usuario permisivo, se usan esas. Para que el rol mande, hay que quitar las variables de entorno: la prioridad es la clave de todo este tema.",
    codeSnippet: `// App en una instancia EC2 llamando a S3:
// 1) Variables de entorno con un usuario IAM con S3:FullAccess
// 2) Rol (Instance Profile) con permiso solo para UN bucket
//
// ¿A qué buckets accederá la app?`,
    inputs: {},
    completeCode: "Variables de entorno > archivo credentials > config > contenedor > instance profile",
    format: "prediction",
    prediction: {
      prompt: "La instancia tiene rol con permiso solo a un bucket, pero la app usa variables de entorno de un usuario con S3:FullAccess. ¿A qué buckets accede la app?",
      snippet: "AWS_ACCESS_KEY_ID=AKIA...\nAWS_SECRET_ACCESS_KEY=...\n# + rol de instancia EC2 con mínimo privilegio (1 bucket)",
      options: [
        "A todos los buckets, porque las variables de entorno tienen prioridad",
        "Solo al bucket del rol, porque el rol manda sobre el entorno",
        "A ninguno: hay conflicto y la llamada falla",
        "Depende de la región configurada"
      ],
      answer: "A todos los buckets, porque las variables de entorno tienen prioridad"
    }
  },

  {
    id: 18,
    title: "Dry Run: Probar Permisos sin Ejecutar",
    stars: 2,
    category: "CLI",
    description:
      "Algunos comandos son caros o destructivos. Con --dry-run simulas la llamada: si tienes permisos, recibes la confirmación, pero no se ejecuta nada.",
    objective: "Usar --dry-run para verificar permisos",
    tags: ["--dry-run", "run-instances", "simulación", "permisos"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: Ejecución en Seco con la CLI

A veces solo quieres verificar que **tienes permisos** para una acción,
sin ejecutarla de verdad (hay comandos caros, como lanzar instancias EC2).

  aws ec2 run-instances --dry-run \\
    --image-id ami-12345678 \\
    --instance-type t2.micro

  • **--dry-run** simula la llamada a la API, no la ejecuta.
  • Si tienes permisos: devuelve un flag/bandera indicando que la
    petición habría tenido éxito.
  • Si NO tienes permisos: devuelve un error.

El instructor lo usa para validar los permisos de un rol antes de
lanzar instancias: añade el permiso ec2:RunInstances a la política,
repite el --dry-run y recibe la confirmación sin gastar ni una
instancia.

Bonus: las instancias EC2 pueden aprender sobre sí mismas mediante
los metadatos de instancia en http://169.254.169.254/latest/meta-data
(sin necesidad de un rol IAM para esa consulta).`,
    explanationText:
      "🌍 Ejemplo cotidiano: es pedir el presupuesto antes de reformar la casa: el albañil te confirma que puede hacer la obra (y cuánto costaría) sin tirar todavía ninguna pared. El dry run te da el OK de permisos sin lanzar recursos que facturan.\n\nEs ideal en CI/CD y scripting: verifica de antemano que el rol puede ejecutar una operación cara. Si recibes la bandera 'Request would have succeeded', tus permisos están bien; si recibes un error, te falta la acción correspondiente en la política.",
    codeSnippet: `# Verificar permisos sin lanzar una instancia
aws ec2 run-instances --dry-run --image-id ami-12345678 --instance-type t2.micro`,
    inputs: {},
    completeCode: "aws ec2 run-instances --dry-run --image-id ami-... --instance-type t2.micro",
    format: "prediction",
    prediction: {
      prompt: "Tienes permisos para lanzar instancias. ¿Qué devuelve este comando?",
      snippet: "aws ec2 run-instances --dry-run --image-id ami-12345678 --instance-type t2.micro",
      options: [
        "Simula la llamada: devuelve la confirmación de permisos sin crear la instancia",
        "Crea una instancia EC2 real con el AMI indicado",
        "Devuelve error siempre, porque --dry-run no existe",
        "Borra la instancia que use ese AMI"
      ],
      answer: "Simula la llamada: devuelve la confirmación de permisos sin crear la instancia"
    }
  },
];
