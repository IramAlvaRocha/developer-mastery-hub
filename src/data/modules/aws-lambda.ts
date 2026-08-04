import type { Exercise } from "@/lib/types";

/**
 * Ruta progresiva: AWS Lambda (DVA-C02, sección 21).
 * Fundamentos serverless, invocaciones (síncronas/asíncronas), ALB, event source mapping,
 * permisos, config (env/monitoring/X-Ray), VPC, rendimiento, capas, concurrencia,
 * empaquetado, versiones/alias, límites, URL de función y buenas prácticas.
 */
export const AWS_LAMBDA_EXERCISES: Exercise[] = [

  {
    id: 1,
    title: "Serverless: Sin Servidores que Gestionar",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "Serverless no significa que no haya servidores: significa que no los gestionas ni aprovisionas. AWS Lambda fue el pionero.",
    objective: "Entender el paradigma serverless y qué servicios son serverless",
    tags: ["serverless", "Lambda", "S3", "DynamoDB"],
    fileName: "lambda",
    completed: false,
    theory: `📚 TEORÍA: Introducción a Serverless

Serverless (en español, "sin servidor") es un nuevo paradigma: los
desarrolladores ya no gestionan servidores, solo despliegan **código**
(funciones).

Puntos clave que destaca el instructor:
  • Serverless NO significa que no haya servidores: significa que no
    los aprovisionas, no los gestionas y no los ves, pero existen.
  • AWS fue pionero con **Lambda** (función como servicio), y hoy el
    término incluye bases de datos, mensajería y almacenamiento.

Servicios serverless que debes reconocer:
  • **S3** (contenido estático), **Cognito** (autenticación),
    **API Gateway** (API REST), **Lambda** y **DynamoDB**.
  • Mensajería: **SNS** y **SQS**, **Kinesis Data Firehose**.
  • **Aurora Serverless**, **Step Functions** y **Fargate**
    (contenedores sin servidor).`,
    explanationText:
      "🌍 Ejemplo cotidiano: serverless es pedir una pizza a domicilio: tú no cocinas ni friegas la cocina, pero la pizza existe y la cocina existe. Solo pagas por la pizza que pides.\n\nServerless no significa 'sin servidores': significa que no los aprovisionas ni gestionas. AWS ejecuta tu código (funciones) bajo demanda. Por eso S3, DynamoDB, API Gateway, SNS/SQS y Lambda son serverless, y por eso Lambda se paga por lo que usas, no por un servidor encendido todo el día.",
    codeSnippet: "// Afirmaciones sobre el paradigma serverless y AWS Lambda",
    inputs: {},
    completeCode: "Serverless = no gestionas servidores (existen) | AWS pionero: Lambda | S3, API GW, DynamoDB, SNS/SQS",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión del paradigma serverless.",
      statements: [
        {
          id: "a",
          text: "Serverless significa que no existen servidores físicos en ningún lugar.",
          answer: false,
          explanation: "Los servidores existen y se ejecutan, pero tú no los ves ni los gestionas ni los aprovisionas, como recalca el instructor."
        },
        {
          id: "b",
          text: "En serverless, los desarrolladores despliegan código (funciones) en lugar de gestionar servidores.",
          answer: true,
          explanation: "Es el nuevo paradigma: solo desplegamos funciones; AWS se encarga de la infraestructura."
        },
        {
          id: "c",
          text: "AWS Lambda fue el servicio pionero que popularizó el concepto serverless en AWS.",
          answer: true,
          explanation: "Lambda fue la función como servicio pionera, y luego el término se amplió a bases de datos, mensajería y almacenamiento."
        },
        {
          id: "d",
          text: "Servicios como S3, DynamoDB y API Gateway también se consideran serverless.",
          answer: true,
          explanation: "El instructor los clasifica como sin servidor: tú no gestionas su infraestructura."
        }
      ]
    }
  },

  {
    id: 2,
    title: "EC2 vs Lambda: Servidores Virtuales vs Funciones",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "EC2 es un servidor virtual que funciona de forma continua; Lambda es una función virtual limitada por tiempo, bajo demanda y con escala automática.",
    objective: "Distinguir EC2 de Lambda y su modelo de precio",
    tags: ["EC2", "Lambda", "escalado", "precio"],
    fileName: "lambda-vs-ec2",
    completed: false,
    theory: `📚 TEORÍA: Comparativa EC2 vs Lambda

El instructor compara ambas caras de la computación en AWS:

**Amazon EC2** (servidores virtuales en el cloud):
  • Limitado por la **RAM y la CPU**.
  • Funcionamiento **continuo**: la instancia no para de trabajar.
  • Escalar significa **intervenir** para añadir o quitar servidores.

**AWS Lambda** (funciones virtuales):
  • Totalmente **serverless**: no gestionas nada.
  • Limitado por el **tiempo**: enfocado a ejecuciones cortas y directas.
  • Ejecución **bajo demanda** y escalado **totalmente automatizado**.

Precios (modelo de Lambda):
  • Se paga por **solicitud** y por **tiempo de computación**.
  • Capa gratuita: 1 millón de solicitudes y 400.000 GB-segundos al mes.
  • Después: ~0,20 $ por cada millón de solicitudes y ~1 $ por cada
    600.000 GB-segundos.

Además: la RAM se puede aumentar hasta **10 GB** y subirla mejora la
**CPU y la red** de la función.`,
    explanationText:
      "🌍 Ejemplo cotidiano: EC2 es alquilar una furgoneta: la tienes encendida (y facturando) aunque no la uses, y ampliarla requiere gestión. Lambda es un taxi bajo demanda: pides un viaje, lo pagas y la flota escala sola.\n\nLambda es una 'función virtual' limitada por tiempo, con escala automática y pago por solicitud + tiempo de computación. EC2 es un servidor virtual limitado por RAM/CPU, de funcionamiento continuo y con escalado manual. En el examen, esta diferencia (y el modelo de precio) es preguntada constantemente.",
    codeSnippet: "// Afirmaciones sobre la comparativa EC2 vs Lambda",
    inputs: {},
    completeCode: "EC2: continuo, RAM/CPU, escalar=intervenir | Lambda: bajo demanda, por tiempo, escala automática, pago por uso",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de la comparativa entre EC2 y Lambda.",
      statements: [
        {
          id: "a",
          text: "EC2 es un servidor virtual limitado por RAM y CPU que funciona de forma continua; escalarlo requiere intervención.",
          answer: true,
          explanation: "Así lo describe el instructor: la instancia no para de trabajar y escalar significa añadir o quitar servidores."
        },
        {
          id: "b",
          text: "Lambda está limitado por el tiempo: se enfoca en ejecuciones cortas y directas, bajo demanda.",
          answer: true,
          explanation: "Lambda no es para procesos eternos: ejecución bajo demanda, con escalado automático."
        },
        {
          id: "c",
          text: "Lambda se paga por solicitud y por tiempo de computación (con una capa gratuita mensual).",
          answer: true,
          explanation: "Es el modelo de precio de Lambda: solicitudes + duración, con 1M de solicitudes gratis al mes."
        },
        {
          id: "d",
          text: "En Lambda, escalar significa intervenir manualmente para añadir o quitar servidores.",
          answer: false,
          explanation: "Al revés: el escalado de Lambda es totalmente automatizado. Intervenir manualmente es cosa de EC2."
        }
      ]
    }
  },

  {
    id: 3,
    title: "Invocaciones Síncronas: Respuesta Inmediata",
    stars: 2,
    category: "INVOCACIONES",
    description:
      "Con la CLI, el SDK o API Gateway invocas Lambda y esperas la respuesta al instante. Si falla, el cliente gestiona el error.",
    objective: "Predecir el comportamiento de una invocación síncrona",
    tags: ["invocación síncrona", "CLI", "API Gateway", "SDK"],
    fileName: "cli",
    completed: false,
    theory: `📚 TEORÍA: Invocaciones Síncronas de Lambda

En una invocación **síncrona** (o sincrónica):
  • La respuesta (o el error) se devuelve de forma **inmediata**.
  • La gestión de errores es **responsabilidad del cliente**: si la
    función falla, el cliente decide si reintenta, aplica backoff
    exponencial o hace lo que necesite.

¿Con qué servicios se puede hacer?
  • Invocadas por el usuario: **CLI/SDK**, **Application Load
    Balancer**, **API Gateway**, **CloudFront con Lambda@Edge** y
    **Amazon S3 Batch**.
  • Otros servicios: **Cognito**, **Step Functions**, **Lex**,
    **Alexa** y **Kinesis Data Firehose**.

Con la CLI es tan sencillo como:

  aws lambda invoke --function-name mi-funcion \\
    --payload '{"clave":"valor"}' respuesta.json

La respuesta de Lambda se guarda en respuesta.json.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una invocación síncrona es preguntar en taquilla y esperar el ticket en el momento: la respuesta llega antes de que sigas. Si algo falla, tú decides qué hacer (reintentar, salir...).\n\nCon la CLI o el SDK llamas a la función y esperas su respuesta (o error) en la misma llamada: por eso la CLI escribe el resultado en un archivo. El cliente gestiona los errores, con reintentos o backoff exponencial. Es la diferencia clave frente a las invocaciones asíncronas.",
    codeSnippet: `# Llamada desde tu terminal (CLI de AWS)
aws lambda invoke --function-name mi-funcion \\
  --payload '{"clave":"valor"}' respuesta.json`,
    inputs: {},
    completeCode: "aws lambda invoke → invocación síncrona: espera la respuesta y la guarda en respuesta.json",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hace este comando de la CLI de AWS?",
      snippet: "aws lambda invoke --function-name mi-funcion --payload '{\"clave\":\"valor\"}' respuesta.json",
      options: [
        "Invoca la función de forma síncrona: espera la respuesta y la guarda en respuesta.json",
        "Envía el evento a una cola interna y no espera el resultado",
        "Borra la función tras ejecutarla",
        "Solo puede usarse desde API Gateway"
      ],
      answer: "Invoca la función de forma síncrona: espera la respuesta y la guarda en respuesta.json"
    }
  },

  {
    id: 4,
    title: "Invocaciones Asíncronas: Disparar y Olvidar",
    stars: 2,
    category: "INVOCACIONES",
    description:
      "S3, SNS y EventBridge pueden disparar Lambda sin que el invocador espere la respuesta: el evento entra en una cola interna.",
    objective: "Reconocer qué servicios usan invocaciones asíncronas",
    tags: ["invocación asíncrona", "S3", "EventBridge", "SNS"],
    fileName: "async-events",
    completed: false,
    theory: `📚 TEORÍA: Invocaciones Asíncronas

Las invocaciones asíncronas se usan con muchos servicios:
  • **S3** (nuevo objeto), **SNS** (mensaje publicado),
    **CloudWatch Events / EventBridge** (regla cron o cambio de
    estado de CodePipeline).
  • También: **CodeCommit**, **CodePipeline**, **CloudWatch Logs**,
    **SES**, **CloudFormation**, **Config**, **IoT** e **IoT Events**.

Cómo funciona:
  • El evento no llega directo a la función: entra en una **cola de
    eventos** (SQS interna) y Lambda la lee y procesa.
  • El invocador **no espera la respuesta**: no se queda bloqueado.
  • Es ideal para procesar muchos elementos a la vez (por ejemplo,
    miles de archivos) mientras sigues con otras tareas.

Ejemplo del instructor: una regla de **EventBridge** con un cron
("cada hora") dispara una función que realiza una tarea programada.`,
    explanationText:
      "🌍 Ejemplo cotidiano: pedir algo online: pagas, recibes el email de confirmación y no te quedas mirando el almacén. Mientras tu paquete se prepara, sigues con tu vida.\n\nEn las invocaciones asíncronas (S3, SNS, EventBridge...), Lambda encola el evento y lo procesa sin que el invocador espere la respuesta. Por eso sirven para procesar miles de archivos u operaciones largas sin bloquear al productor.",
    codeSnippet: `S3 (nuevo objeto .jpg)      → dispara la función Lambda
EventBridge (cron cada hora) → dispara la función Lambda
SNS (mensaje publicado)      → dispara la función Lambda`,
    inputs: {},
    completeCode: "Asíncrona = evento a cola interna, sin esperar respuesta | S3, SNS, EventBridge, CodePipeline...",
    format: "prediction",
    prediction: {
      prompt: "¿Qué tienen en común estos disparadores de Lambda?",
      snippet: "S3 (nuevo objeto .jpg)\nEventBridge (regla cron: cada hora)\nSNS (mensaje publicado)",
      options: [
        "Son invocaciones asíncronas: Lambda procesa sin que el invocador espere la respuesta",
        "Son invocaciones síncronas: cada invocador espera bloqueado la respuesta",
        "Solo funcionan con la CLI y el SDK",
        "Requieren que Lambda esté dentro de la misma VPC que el invocador"
      ],
      answer: "Son invocaciones asíncronas: Lambda procesa sin que el invocador espere la respuesta"
    }
  },

  {
    id: 5,
    title: "Lambda y ALB: Tu Función como Endpoint HTTP",
    stars: 3,
    category: "INTEGRACIONES",
    description:
      "Registras la función en un target group y el ALB convierte HTTP en JSON para Lambda, y JSON de vuelta a HTTP.",
    objective: "Predecir el intercambio de datos entre ALB y Lambda",
    tags: ["ALB", "target group", "multi-value headers", "JSON"],
    fileName: "lambda-alb",
    completed: false,
    theory: `📚 TEORÍA: Lambda y Application Load Balancer

Para exponer una función Lambda como endpoint **HTTP/HTTPS** sin API
Gateway, puedes integrarla con un **Application Load Balancer**:

  • La función se registra en un **target group**, igual que se hace
    con instancias EC2.
  • El cliente hace HTTP/HTTPS → el ALB envía la invocación
    **síncrona** a la función.

Datos que el ALB envía a Lambda (conversión HTTP → JSON):
  • Información del ELB (p. ej. el ARN del target group).
  • **httpMethod** (GET, POST...), **path** (la ruta) y
    **queryStringParameters** (pares clave-valor).
  • **headers** (pares clave-valor) y **body** (el cuerpo).
  • Un booleano **isBase64Encoded**.

Respuesta de Lambda (conversión JSON → HTTP):
  • **statusCode** (p. ej. 200), **statusDescription** (p. ej. "OK").
  • **headers** (pares clave-valor) y **body** (el contenido).
  • El booleano **isBase64Encoded**.

Encabezados **multivalor**: si los habilitas, los encabezados HTTP y
los parámetros de consulta con varios valores llegan a Lambda como
**arrays** dentro del objeto de evento y respuesta.

Nota: el payload máximo de una invocación vía ALB es de **1 MB**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el ALB es el recepcionista que traduce tu pregunta (HTTP) a un formulario (JSON) para la oficina (Lambda) y vuelve a traducir la respuesta (JSON) a lenguaje normal (HTTP).\n\nLa función vive en un target group, el ALB la invoca de forma síncrona y espera un JSON con statusCode, headers, body e isBase64Encoded. Con multi-value headers habilitado, las cabeceras repetidas llegan como arrays. Recuerda el límite de 1 MB del payload ALB → Lambda.",
    codeSnippet: `// Payload que el ALB envía a la función Lambda
{
  "httpMethod": "GET",
  "path": "/hola",
  "queryStringParameters": { "name": "Joan" },
  "headers": { "Content-Type": "text/plain" },
  "body": null,
  "isBase64Encoded": false
}`,
    inputs: {},
    completeCode: "ALB → JSON (método, ruta, query, headers, body) | Lambda → JSON (statusCode, headers, body) | multi-value → arrays | 1 MB",
    format: "prediction",
    prediction: {
      prompt: "El ALB envía este payload JSON a tu función Lambda. ¿Qué está ocurriendo?",
      snippet: `{
  "httpMethod": "GET",
  "path": "/hola",
  "queryStringParameters": { "name": "Joan" },
  "headers": { "Content-Type": "text/plain" },
  "body": null,
  "isBase64Encoded": false
}`,
      options: [
        "El ALB convierte la petición HTTP en JSON y llama a Lambda de forma síncrona (y con multi-value headers, las cabeceras repetidas llegarían como arrays)",
        "El ALB guarda la petición en S3 y Lambda la procesa más tarde de forma asíncrona",
        "Lambda debe devolver siempre una imagen en base64",
        "El ALB invoca Lambda de forma asíncrona y descarta la respuesta"
      ],
      answer: "El ALB convierte la petición HTTP en JSON y llama a Lambda de forma síncrona (y con multi-value headers, las cabeceras repetidas llegarían como arrays)"
    }
  },

  {
    id: 6,
    title: "Crear y Testear tu Primera Función",
    stars: 1,
    category: "PRÁCTICA",
    description:
      "El flujo real en la consola: crear la función con su rol, desplegar el código, crear un evento de prueba, testear y ver los logs en CloudWatch.",
    objective: "Ordenar el flujo de creación y prueba de una función Lambda",
    tags: ["consola", "deploy", "test", "CloudWatch Logs"],
    fileName: "lambda-function",
    completed: false,
    theory: `📚 TEORÍA: Crear una Función en la Consola

El instructor crea su primera función ("demo-lambda") así:

  1. **Crear la función**: nombre, runtime (por ejemplo, Python) y un
     **rol de ejecución** nuevo con permisos básicos de Lambda.
  2. **Desplegar el código**: escribir el handler (hello world) y
     pulsar **Deploy** para subir la nueva versión.
  3. **Crear un evento de prueba**: darle un nombre, plantilla
     "Hello World" y unos valores en JSON.
  4. **Ejecutar Test**: se genera una ejecución y en los resultados
     ves la **duración en ms**, la **memoria** usada y los datos
     devueltos.
  5. **Monitorizar**: en la pestaña "Monitorizar" encuentras métricas
     (invocaciones, duración, errores) y los **registros**; abres
     **CloudWatch Logs** para ver el log de la invocación.

Si el código lanza una excepción, aparece como error en los logs de
CloudWatch: los registros recogen todo lo que la función emite.`,
    explanationText:
      "🌍 Ejemplo cotidiano: montar una cafetera nueva: la sacas de la caja (crear), la enchufas y programas (desplegar), preparas un café de prueba (evento), lo pruebas (test) y compruebas el resultado (logs).\n\nEl flujo real de la consola es: crear la función con su rol → escribir y desplegar el código → crear un evento de prueba → ejecutar Test → abrir CloudWatch Logs para ver los registros. Ese mismo flujo aparece una y otra vez en el examen.",
    codeSnippet: "// Ordena el flujo: crear la función → desplegar → evento de prueba → test → logs",
    inputs: {},
    completeCode: "Crear (rol básico) → Deploy del código → crear evento de prueba → Test (duración, memoria) → CloudWatch Logs",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para crear y testear una función Lambda desde la consola.",
      steps: [
        { id: "create", label: "Crear la función con un nombre, runtime (Python) y un rol de ejecución con permisos básicos de Lambda" },
        { id: "deploy", label: "Escribir el código del handler y pulsar Deploy para desplegarlo" },
        { id: "event", label: "Crear un evento de prueba con un nombre y la plantilla Hello World (JSON)" },
        { id: "test", label: "Ejecutar Test y revisar el resultado: duración en ms, memoria y datos devueltos" },
        { id: "logs", label: "Abrir Monitorizar → registros y ver el log de la invocación en CloudWatch Logs" },
      ],
      correctOrder: ["create", "deploy", "event", "test", "logs"],
    },
  },

  {
    id: 7,
    title: "Reintentos y DLQ de las Invocaciones Asíncronas",
    stars: 3,
    category: "INVOCACIONES",
    description:
      "Si una invocación asíncrona falla, Lambda reintenta hasta 2 veces y, si sigue fallando, el evento viaja a la DLQ (SQS o SNS).",
    objective: "Entender los reintentos, la idempotencia y la DLQ asíncrona",
    tags: ["reintentos", "DLQ", "idempotencia", "asíncrona"],
    fileName: "dlq",
    completed: false,
    theory: `📚 TEORÍA: Reintentos y Cola de Mensajes Fallidos

Cuando el procesamiento asíncrono falla, Lambda **reintenta**:
  • En total hace **3 intentos** (el original + 2 reintentos), con
    esperas entre ellos (por ejemplo, 1 minuto y luego 2 minutos).
  • Por eso el procesamiento debe ser **idempotente**: el resultado
    debe ser el mismo aunque la función se ejecute varias veces. Si
    no lo es, verás logs duplicados en CloudWatch.

Si aun así falla, se usa una **cola de mensajes fallidos** (DLQ):
  • Puede ser una **cola SQS** o un **tema SNS**.
  • Es para el **procesamiento fallido**: el evento se guarda para
    procesarlo más adelante.
  • Se necesitan los **permisos IAM correctos** en el rol para poder
    enviar a esa cola/tema.

¿Para qué sirve? En las invocaciones asíncronas no esperas el
resultado: procesas miles de archivos y, si algo falla, la DLQ lo
conserva para recuperarlo sin perder datos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un mensajero que intenta entregar un paquete hasta 3 veces (con esperas de 1 y 2 minutos) y, si nadie lo recibe, lo deja en la oficina de objetos perdidos (DLQ) para recuperarlo después.\n\nEn asíncrono, Lambda reintenta hasta 2 veces más (3 intentos en total) y la función debe ser idempotente: repetir no debe cambiar el resultado. Si sigue fallando, el evento va a una cola SQS o un tema SNS (DLQ), y el rol necesita permisos IAM para poder escribirlo allí.",
    codeSnippet: "// Afirmaciones sobre reintentos y DLQ de las invocaciones asíncronas",
    inputs: {},
    completeCode: "3 intentos (1+2 reintentos) | idempotencia obligatoria | DLQ = SQS o SNS | permisos IAM necesarios",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de los reintentos y la DLQ de las invocaciones asíncronas.",
      statements: [
        {
          id: "a",
          text: "En las invocaciones asíncronas, si la función falla, Lambda la reintenta hasta 2 veces más (3 intentos en total).",
          answer: true,
          explanation: "El instructor lo explica con esperas entre intentos (por ejemplo, 1 minuto y luego 2 minutos)."
        },
        {
          id: "b",
          text: "El procesamiento asíncrono debe ser idempotente: con los reintentos, el resultado debe ser el mismo.",
          answer: true,
          explanation: "Si no es idempotente, verás logs duplicados y efectos repetidos en cada reintento."
        },
        {
          id: "c",
          text: "La DLQ de las invocaciones asíncronas puede ser una cola SQS o un tema SNS.",
          answer: true,
          explanation: "La cola de mensajes fallidos se define con SQS o SNS para conservar los eventos que no se pudieron procesar."
        },
        {
          id: "d",
          text: "En una invocación asíncrona, el invocador se queda esperando la respuesta de la función.",
          answer: false,
          explanation: "Al contrario: la asíncrona existe para NO esperar la respuesta. El invocador sigue con sus tareas."
        }
      ]
    }
  },

  {
    id: 8,
    title: "Mapeo de Fuentes de Eventos: Streams y Colas",
    stars: 3,
    category: "FUENTES DE EVENTOS",
    description:
      "Kinesis, DynamoDB Streams y SQS se integran con Lambda mediante un event source mapping: Lambda sondea y procesa los registros.",
    objective: "Entender el event source mapping y su comportamiento en streams y colas",
    tags: ["event source mapping", "Kinesis", "DynamoDB Streams", "SQS"],
    fileName: "event-source-mapping",
    completed: false,
    theory: `📚 TEORÍA: Mapeo de Fuentes de Eventos

Además de síncrona y asíncrona, existe otra forma de procesar
eventos: el **mapeo de fuentes de eventos** (event source mapping).
Se aplica a **Kinesis Data Streams**, **SQS**, **SQS FIFO** y
**DynamoDB Streams**.

En este modelo, **Lambda sondea** la fuente de eventos, obtiene
registros y los procesa.

**Streams (Kinesis y DynamoDB Streams):**
  • Se crea un **iterador por fragmento (shard)** y se procesan los
    elementos en **orden** (desde el principio o desde un timestamp).
  • Los elementos **no se eliminan** del stream tras procesarse:
    otros consumidores pueden leerlos.
  • Con poco tráfico se usa una **ventana de lotes** para acumular
    registros, y se pueden procesar **hasta 10 lotes por fragmento**
    en paralelo manteniendo el orden por clave de partición.
  • Si la función falla, el **lote se reintenta** hasta que tenga
    éxito o caduque, y el fragmento afectado se pausa. Puedes
    configurar descartar eventos antiguos, limitar reintentos o
    dividir el lote.

**Colas (SQS y SQS FIFO):**
  • Lambda sondea la cola y recibe lotes de **1 a 10 mensajes**.
  • Se recomienda un **visibility timeout** de la cola de **6 veces**
    el timeout de la función.
  • La **DLQ se configura en la cola SQS** (no en Lambda): la DLQ de
    Lambda es solo para invocaciones asíncronas.
  • SQS estándar: sin orden garantizado, escala rápido. SQS FIFO:
    procesa en orden por **group ID**, escalando el número de grupos
    de mensajes activos.
  • Tras procesar bien, Lambda elimina los mensajes de la cola.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el event source mapping es el encargado de revisar el buzón: en los streams (Kinesis/DynamoDB) lee los mensajes en orden sin borrarlos, y en SQS recoge paquetes de mensajes y, si una entrega falla, la devuelve a la cola.\n\nLambda sondea la fuente y procesa los registros; ante errores reintenta el lote. En SQS, la DLQ se configura en la propia cola (la DLQ de Lambda es solo para invocaciones asíncronas) y el visibility timeout recomendado es 6 veces el timeout de la función.",
    codeSnippet: "// Afirmaciones sobre el mapeo de fuentes de eventos (streams y colas)",
    inputs: {},
    completeCode: "Lambda sondea la fuente | streams: orden por shard, sin eliminar | SQS: batch 1-10, DLQ en la cola, visibility 6x",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes del mapeo de fuentes de eventos.",
      statements: [
        {
          id: "a",
          text: "Con el mapeo de fuentes de eventos, Lambda sondea la fuente (Kinesis, DynamoDB Streams o SQS) para obtener y procesar registros.",
          answer: true,
          explanation: "Es la esencia del event source mapping: Lambda hace polling a la fuente y procesa los lotes."
        },
        {
          id: "b",
          text: "En los streams, los registros se procesan en orden por clave de partición y no se eliminan tras procesarlos.",
          answer: true,
          explanation: "Los streams conservan los datos: otros consumidores pueden leer los mismos elementos después."
        },
        {
          id: "c",
          text: "Para SQS, la DLQ se configura en la propia cola, no en Lambda (la DLQ de Lambda es solo para invocaciones asíncronas).",
          answer: true,
          explanation: "Lo recalca el instructor: con el event source mapping, la cola de mensajes fallidos se define en la cola SQS."
        },
        {
          id: "d",
          text: "En las colas estándar de SQS, Lambda garantiza procesar los mensajes en un orden exacto.",
          answer: false,
          explanation: "Las colas estándar no garantizan orden; el procesamiento en orden es cosa de SQS FIFO con group IDs."
        },
        {
          id: "e",
          text: "Se recomienda configurar el visibility timeout de la cola SQS a 6 veces el timeout de la función Lambda.",
          answer: true,
          explanation: "Así la cola no vuelve a exponer el mensaje mientras la función todavía puede estar procesándolo."
        }
      ]
    }
  },

  {
    id: 9,
    title: "Objeto de Evento y Contexto: Los Dos Parámetros",
    stars: 2,
    category: "CONCEPTOS",
    description:
      "Toda función recibe un evento (los datos del invocador en JSON) y un contexto (la información de la invocación).",
    objective: "Distinguir qué contiene el objeto de evento y qué el de contexto",
    tags: ["event", "context", "handler", "Python"],
    fileName: "event-context",
    completed: false,
    theory: `📚 TEORÍA: Objetos de Evento y Contexto

Cuando Lambda ejecuta tu función le pasa **dos objetos**:

**Objeto de evento (event):**
  • Es un documento **JSON** con los datos para que la función los
    procese: la fuente que produce el evento (source), el número de
    cuenta, el timestamp, la región y los recursos implicados.
  • Contiene información del servicio invocador (por ejemplo, RDS o
    EventBridge) o de un servicio personalizado.
  • El runtime de Lambda lo convierte en un objeto del lenguaje (en
    Python, un dict).

**Objeto de contexto (context):**
  • Proporciona métodos y propiedades sobre la **invocación actual**:
    el nombre de la función, el **ARN**, la **versión**, el límite de
    **memoria** en MB, el **log group** y **log stream** de
    CloudWatch, y el **AWS Request ID**.
  • Lambda lo pasa a la función en tiempo de ejecución.

En Python:

  def handler(event, context):
      print(event['source'])        # de dónde viene el evento
      print(context.function_name)  # qué función se ejecuta
      print(context.aws_request_id) # id de esta invocación`,
    explanationText:
      "🌍 Ejemplo cotidiano: el evento es el paquete que te traen (su contenido, quién lo envía, cuándo) y el contexto es la ficha de tu turno de trabajo (qué empleado eres, qué turno, cuánto puedes levantar).\n\nEl evento es un JSON con los datos del servicio invocador (source, región, recursos...). El contexto ofrece propiedades de la invocación: function name, ARN, memoria, request ID y log group/stream. Ambos llegan como parámetros del handler: event y context.",
    codeSnippet: `def handler(event, context):
    # event   → JSON con los datos del servicio invocador
    # context → métodos y propiedades de la invocación
    print(event['source'])         # ¿de dónde viene el evento?
    print(context.function_name)   # ¿qué función se está ejecutando?
    print(context.aws_request_id)  # identificador de esta invocación`,
    inputs: {},
    completeCode: "event = datos del invocador (JSON) | context = información de la invocación (function name, ARN, memoria, request ID)",
    format: "prediction",
    prediction: {
      prompt: "¿Qué contienen los objetos event y context de esta función Lambda?",
      snippet: `def handler(event, context):
    print(event['source'])
    print(context.function_name)
    print(context.aws_request_id)`,
      options: [
        "event contiene los datos del servicio invocador; context contiene información de la invocación (nombre de la función, request ID, memoria...)",
        "context contiene los datos de negocio y event la configuración de la función",
        "Ambos objetos son exactamente iguales",
        "event solo existe en las invocaciones síncronas"
      ],
      answer: "event contiene los datos del servicio invocador; context contiene información de la invocación (nombre de la función, request ID, memoria...)"
    }
  },

  {
    id: 10,
    title: "Destinos Lambda: onSuccess y onFailure",
    stars: 3,
    category: "DESTINOS",
    description:
      "Desde 2019, las invocaciones asíncronas pueden enviar sus resultados a SQS, SNS, otra Lambda o EventBridge según el éxito o el fallo.",
    objective: "Configurar destinos de éxito y fallo de una invocación asíncrona",
    tags: ["destinos", "onSuccess", "onFailure", "EventBridge"],
    fileName: "destinations",
    completed: false,
    theory: `📚 TEORÍA: Destinos de Lambda

En noviembre de 2019 AWS añadió los **destinos**: el resultado de una
función Lambda puede enviarse a otro destino en función de cómo haya
terminado el procesamiento.

  • En las invocaciones **asíncronas** se definen destinos para
    eventos **exitosos** (onSuccess) y **fallidos** (onFailure).
  • Destinos posibles: **SQS**, **SNS**, otra función **Lambda** o un
    bus de **Amazon EventBridge**.

Nota importante del instructor:
  • AWS **recomienda utilizar destinos** en lugar de la clásica cola
    de mensajes fallidos (DLQ), aunque **ambos pueden utilizarse al
    mismo tiempo**.
  • Para el mapeo de fuentes de eventos también puedes definir
    destinos para los **lotes descartados**, con SQS y SNS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: al pedir comida a domicilio eliges dónde se avisa si todo llega bien (mensaje a tu móvil) o si el pedido se pierde (mensaje al restaurante).\n\nLos destinos de las invocaciones asíncronas envían el resultado (éxito o fallo) a SQS, SNS, otra función Lambda o un bus de EventBridge. AWS recomienda destinos frente a la DLQ, aunque pueden coexistir. Para el event source mapping también hay destinos para los lotes descartados (SQS/SNS).",
    codeSnippet: `# Destinos de las invocaciones asíncronas
#   • on[INPUT_1]  → invocación exitosa
#   • on[INPUT_2]  → invocación fallida

# Destinos posibles:
#   • Cola [INPUT_3]
#   • Tema [INPUT_4]
#   • Otra función [INPUT_5]
#   • Bus de [INPUT_6]

# AWS recomienda destinos en lugar de la [INPUT_7],
# aunque pueden usarse al mismo tiempo.`,
    inputs: {
      INPUT_1: "Success",
      INPUT_2: "Failure",
      INPUT_3: "SQS",
      INPUT_4: "SNS",
      INPUT_5: "Lambda",
      INPUT_6: "EventBridge",
      INPUT_7: "cola de mensajes fallidos",
    },
    completeCode: "onSuccess / onFailure → SQS, SNS, Lambda, EventBridge | destinos > DLQ (pero coexisten)",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa los destinos que puedes configurar para una invocación asíncrona.",
      options: {
        INPUT_1: ["Success", "Failure", "Complete"],
        INPUT_2: ["Failure", "Success", "Error"],
        INPUT_3: ["SQS", "SNS", "Kinesis"],
        INPUT_4: ["SNS", "SQS", "EFS"],
        INPUT_5: ["Lambda", "EC2", "Fargate"],
        INPUT_6: ["EventBridge", "CloudWatch Logs", "API Gateway"],
        INPUT_7: ["cola de mensajes fallidos", "cola de reintentos", "cola de eventos"],
      }
    }
  },

  {
    id: 11,
    title: "Permisos: Rol de Ejecución y Políticas de Recursos",
    stars: 3,
    category: "PERMISOS",
    description:
      "El rol IAM de ejecución da permisos a la función; las políticas basadas en recursos permiten que otros servicios y cuentas la invoquen.",
    objective: "Distinguir el rol de ejecución de las políticas basadas en recursos",
    tags: ["rol de ejecución", "política de recursos", "IAM", "S3"],
    fileName: "lambda-policy",
    completed: false,
    theory: `📚 TEORÍA: Permisos de Lambda

Cada función Lambda tiene **dos capas de permisos**:

**1. Rol de ejecución (IAM):**
  • Concede a la función permisos sobre los servicios y recursos que
    necesita: subir logs a **CloudWatch Logs**, leer de **Kinesis**,
    leer de **DynamoDB Streams**, leer de **SQS**, funciones en
    **VPC** y cargar rastreo a **X-Ray**.
  • Con el event source mapping, Lambda usa el rol de ejecución para
    leer datos de la fuente de eventos.
  • Práctica recomendada del instructor: **un rol de ejecución por
    función**, nunca reutilizar los mismos roles.

**2. Políticas basadas en recursos:**
  • Dan permiso a **otras cuentas y servicios de AWS** para utilizar
    tus recursos de Lambda (muy similar a una política de bucket S3).
  • Ejemplo: un ALB con un target group que apunta a tu función
    necesita autorización en la política basada en recursos.
  • Cuando un servicio como **S3** llama a una función Lambda, la
    política basada en recursos le da acceso directo a la ejecución.`,
    explanationText:
      "🌍 Ejemplo cotidiano: tu tarjeta de empleado (rol de ejecución) te da acceso a las salas de tu empresa; el guardia de la puerta (política basada en recursos) decide qué visitantes externos pueden entrar a tu oficina.\n\nEl rol de ejecución otorga permisos a la función para actuar sobre otros servicios (CloudWatch Logs, DynamoDB, SQS...). La política basada en recursos permite que otras cuentas o servicios (como S3 o un ELB) invoquen tu función. Buenas práctica del instructor: un rol de ejecución distinto por función.",
    codeSnippet: "// Afirmaciones sobre los permisos de las funciones Lambda",
    inputs: {},
    completeCode: "Rol de ejecución = permisos de la función (logs, SQS, DynamoDB...) | Política de recursos = quién puede invocarla (S3, ELB, otras cuentas)",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los permisos de Lambda.",
      statements: [
        {
          id: "a",
          text: "El rol de ejecución de Lambda concede a la función permisos para acceder a otros servicios (CloudWatch Logs, DynamoDB, SQS...).",
          answer: true,
          explanation: "Es la capa de identidad: la función actúa sobre otros servicios usando su rol de ejecución."
        },
        {
          id: "b",
          text: "Se recomienda crear un rol de ejecución distinto por función, en lugar de compartir el mismo rol.",
          answer: true,
          explanation: "Es la práctica que recomienda el instructor: mínimo privilegio y aislamiento por función."
        },
        {
          id: "c",
          text: "Las políticas basadas en recursos sirven para que otras cuentas y servicios de AWS puedan invocar tu función Lambda.",
          answer: true,
          explanation: "Son el equivalente a la política de bucket de S3 pero para Lambda: controlan quién puede invocar el recurso."
        },
        {
          id: "d",
          text: "Para que un servicio como S3 invoque tu función, basta con el rol de ejecución; la política basada en recursos no hace falta.",
          answer: false,
          explanation: "Cuando S3 llama a Lambda, es la política basada en recursos la que da acceso directo a la ejecución."
        }
      ]
    }
  },

  {
    id: 12,
    title: "Variables de Entorno, Monitorización y X-Ray",
    stars: 2,
    category: "CONFIGURACIÓN",
    description:
      "Las variables de entorno ajustan el comportamiento sin tocar código, los logs viven en CloudWatch y X-Ray rastrea la función con un clic.",
    objective: "Configurar variables de entorno, monitorización y rastreo X-Ray",
    tags: ["variables de entorno", "CloudWatch", "X-Ray", "KMS"],
    fileName: "lambda-config",
    completed: false,
    theory: `📚 TEORÍA: Variables de Entorno y Monitorización

**Variables de entorno:**
  • Son un par **clave-valor** en formato string.
  • Sirven para **ajustar el comportamiento de la función sin
    actualizar el código**: cambias el valor en la configuración y ya.
  • Son ideales para guardar **secretos** (por ejemplo, una
    contraseña) y se pueden **cifrar con claves KMS** (la clave de
    Lambda o tu propia CMK).

**Logs y métricas:**
  • La función genera **logs** que se visualizan en **CloudWatch
    Logs** (accedes a la pestaña de registros).
  • El rol de ejecución necesita una política IAM que **autorice las
    escrituras** en CloudWatch Logs.
  • En **CloudWatch Metrics** ves las métricas de Lambda:
    invocaciones, duración, ejecuciones concurrentes, recuento de
    errores, tasas de éxito y fallos de entrega asíncrona.

**Rastreo con X-Ray:**
  • Activas el **rastreo activo** en la configuración de Lambda y el
    servicio ejecuta el **demonio de X-Ray** por ti.
  • Para escribir en X-Ray, el rol necesita la política administrada
    **AWSXRayDaemonWriteAccess**.
  • X-Ray usa **variables de entorno** para comunicarse con el
    demonio (por ejemplo, AWS_XRAY_TRACING_NAME o
    AWS_XRAY_DAEMON_ADDRESS); el instructor avisa de que pueden salir
    en el examen.`,
    explanationText:
      "🌍 Ejemplo cotidiano: las variables de entorno son los ajustes de tu GPS: cambias el idioma o la ruta sin reinstalar la app. Los secretos (contraseña del wifi) van guardados cifrados en la caja fuerte (KMS).\n\nLas variables de entorno son pares clave-valor que ajustan el comportamiento sin tocar código; los secretos se cifran con KMS. Para monitorizar: los logs se ven en CloudWatch Logs (el rol debe poder escribirlos) y las métricas (invocaciones, duración, errores, concurrencia) en CloudWatch Metrics. Con el rastreo activo, X-Ray ejecuta su demonio y el rol necesita AWSXRayDaemonWriteAccess.",
    codeSnippet: `# Configuración de la función Lambda

# 1) Variables de entorno: pares [INPUT_1] en formato string.
#    Ajustan el comportamiento sin [INPUT_2] el código.
#    Los secretos se pueden cifrar con claves [INPUT_3].

# 2) Monitorización:
#    Los logs de la función se ven en [INPUT_4] Logs.
#    El rol necesita permisos para escribir en ellos.

# 3) Rastreo:
#    Activando el rastreo activo, Lambda ejecuta el demonio de [INPUT_5].
#    El rol necesita la política AWS[INPUT_6]WriteAccess.`,
    inputs: {
      INPUT_1: "clave-valor",
      INPUT_2: "actualizar",
      INPUT_3: "KMS",
      INPUT_4: "CloudWatch",
      INPUT_5: "X-Ray",
      INPUT_6: "XRayDaemon",
    },
    completeCode: "Variables de entorno (clave-valor, secretos con KMS) | logs en CloudWatch Logs | X-Ray: rastreo activo + AWSXRayDaemonWriteAccess",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa la configuración de variables de entorno, monitorización y X-Ray.",
      options: {
        INPUT_1: ["clave-valor", "usuario-password", "config"],
        INPUT_2: ["actualizar", "eliminar", "reiniciar"],
        INPUT_3: ["KMS", "IAM", "STS"],
        INPUT_4: ["CloudWatch", "CloudTrail", "S3"],
        INPUT_5: ["X-Ray", "CodeGuru", "EventBridge"],
        INPUT_6: ["XRayDaemon", "XRay", "Lambda"],
      }
    }
  },

  {
    id: 13,
    title: "Lambda@Edge: Código en el Borde de CloudFront",
    stars: 3,
    category: "EDGE",
    description:
      "Lambda@Edge ejecuta tu código en las edge locations de CloudFront, con 4 triggers: viewer request/response y origin request/response.",
    objective: "Distinguir Lambda@Edge de las funciones de CloudFront",
    tags: ["Lambda@Edge", "CloudFront", "edge", "triggers"],
    fileName: "lambda-edge",
    completed: false,
    theory: `📚 TEORÍA: Lambda@Edge y CloudFront Functions

A veces las aplicaciones modernas necesitan ejecutar **lógica en la
propia edge location**, cerca del usuario, antes de llegar a la app.
CloudFront tiene **dos tipos de funciones de borde**:

**Funciones de CloudFront (CloudFront Functions):**
  • Escritas en **JavaScript**, muy ligeras y sensibles a la
    latencia: tiempos de inicio **menores a 1 ms** y millones de
    solicitudes por segundo.
  • Solo modifican la **solicitud y la respuesta del espectador**
    (viewer request y viewer response). Es nativo de CloudFront.
  • Máximo 2 MB de memoria, paquete de 10 KB, **sin acceso a la red**,
    sin sistema de archivos y sin acceso al **cuerpo** de la solicitud.

**Lambda@Edge:**
  • Escritas en **Node.js o Python**, escalan a miles de solicitudes
    por segundo y pueden durar entre **5 y 10 segundos**.
  • Modifican la solicitud y respuesta del espectador **y también las
    del origen**: son **4 triggers** (viewer request, origin request,
    origin response, viewer response).
  • Memoria de 128 MB a 10 GB, acceso a la red, al sistema de
    archivos y al cuerpo de la solicitud.
  • Creas la función en **una región de AWS** y CloudFront la
    **replica en todas sus edge locations**.

Casos de uso: autenticación y autorización, SEO, mitigación de bots,
transformación de imágenes, pruebas A/B y enrutamiento inteligente.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Lambda@Edge es poner a un traductor en cada aeropuerto (edge location) en vez de traer a todos los turistas a tu oficina central: respondes y personalizas cerca del cliente.\n\nCreaste tu función en una región y CloudFront la replica en todas las edge locations. Lambda@Edge se escribe en Node.js o Python y tiene 4 triggers (viewer/origin request y response). Las CloudFront Functions son más ligeras (JavaScript, <1 ms, solo viewer y sin red, filesystem ni body).",
    codeSnippet: "// Afirmaciones sobre Lambda@Edge y las funciones de CloudFront",
    inputs: {},
    completeCode: "Lambda@Edge: Node.js/Python, 4 triggers (viewer+origin), réplica global | CloudFront Functions: JS, <1ms, solo viewer",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de las funciones de borde de CloudFront.",
      statements: [
        {
          id: "a",
          text: "Lambda@Edge permite ejecutar código en las edge locations de CloudFront, y CloudFront replica la función desde la región donde la creaste.",
          answer: true,
          explanation: "Creas la función en una región de AWS y CloudFront la replica en todas sus ubicaciones de borde."
        },
        {
          id: "b",
          text: "Lambda@Edge se escribe en Node.js o Python y tiene 4 puntos de activación: viewer request, origin request, origin response y viewer response.",
          answer: true,
          explanation: "A diferencia de las CloudFront Functions (solo viewer), Lambda@Edge también actúa sobre las peticiones y respuestas del origen."
        },
        {
          id: "c",
          text: "Las funciones de CloudFront pueden ejecutar código en cualquier lenguaje y con más de 100 MB de memoria.",
          answer: false,
          explanation: "Son muy ligeras: JavaScript, menos de 1 ms, 2 MB de memoria y solo tocan las solicitudes/respuestas del espectador."
        },
        {
          id: "d",
          text: "Lambda@Edge puede acceder a la red, al sistema de archivos y al cuerpo de la solicitud HTTP.",
          answer: true,
          explanation: "Son ventajas frente a CloudFront Functions, que no tienen acceso a red, filesystem ni body."
        }
      ]
    }
  },

  {
    id: 14,
    title: "Lambda en VPC: ENI, Subredes y NAT",
    stars: 3,
    category: "RED",
    description:
      "Por defecto Lambda vive fuera de tu VPC con internet. Para tocar RDS o un ALB interno, la metes en tu VPC con ENIs... y pierde internet.",
    objective: "Entender el despliegue de Lambda dentro de una VPC",
    tags: ["VPC", "ENI", "subredes", "NAT"],
    fileName: "vpc",
    completed: false,
    theory: `📚 TEORÍA: Lambda y VPC

Por defecto, la función Lambda se lanza **fuera de tu VPC** (en una
VPC propiedad de AWS): tiene acceso a internet y puede llamar a
servicios como DynamoDB.

¿Y si quieres acceder a tus recursos privados (**RDS**, ElastiCache,
un Load Balancer interno)? Puedes, siguiendo estos pasos:
  • Definir el **ID de la VPC**, las **subredes** y los
    **security groups** que quieres usar.
  • Lambda crea una **ENI** (Elastic Network Interface) en cada
    subred indicada, envuelta por el security group de Lambda.
  • El rol debe tener la política **AWSLambdaVPCAccessExecutionRole**.

⚠️ Internet dentro de la VPC:
  • Desplegar la función en una **subred pública NO da internet** ni
    concede una **IP pública**.
  • Para salir a internet desde una Lambda en VPC necesitas una
    **NAT** (gateway NAT o instancia NAT) en una subred pública y un
    Internet Gateway.
  • Para acceder de forma privada a servicios de AWS sin pasar por
    NAT, usa **VPC endpoints** (por ejemplo, para DynamoDB).
  • Nota: **CloudWatch Logs funciona incluso sin endpoint ni NAT**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: por defecto tu oficina (Lambda) está en un centro de coworking con salida a internet; si quieres entrar en el edificio de tu empresa (tu VPC, con la base de datos), te dan una acreditación (ENI) y solo puedes salir a internet por la puerta del NAT.\n\nPor defecto Lambda vive fuera de tu VPC (con internet y acceso a DynamoDB). Para acceder a RDS/ElastiCache/ALB interno defines VPC + subredes + security groups, y Lambda crea una ENI por subred (rol AWSLambdaVPCAccessExecutionRole). Dentro de la VPC no hay internet (ni en subred pública): necesitas NAT o VPC endpoints. CloudWatch Logs siempre funciona.",
    codeSnippet: "// Afirmaciones sobre Lambda dentro de una VPC",
    inputs: {},
    completeCode: "Por defecto fuera de la VPC (con internet) | dentro: VPC+subredes+SG → ENI | sin internet: NAT o VPC endpoint | CloudWatch Logs siempre OK",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de Lambda en VPC.",
      statements: [
        {
          id: "a",
          text: "Por defecto, una función Lambda se lanza en una VPC propiedad de AWS, con acceso a internet y a servicios como DynamoDB.",
          answer: true,
          explanation: "Ese es el despliegue por defecto: fuera de tu VPC, con acceso público a internet y a los servicios de AWS."
        },
        {
          id: "b",
          text: "Para que Lambda acceda a recursos de tu VPC, defines la VPC, las subredes y los security groups; Lambda crea una ENI en esas subredes.",
          answer: true,
          explanation: "La ENI (Elastic Network Interface) es lo que conecta la función con tus subredes, protegida por el security group."
        },
        {
          id: "c",
          text: "Si despliegas Lambda en una subred pública de tu VPC, la función obtiene automáticamente acceso a internet e IP pública.",
          answer: false,
          explanation: "Desplegarla en subred pública no da internet ni IP pública: necesitas un NAT (gateway o instancia) para salir."
        },
        {
          id: "d",
          text: "Para salir a internet desde una Lambda en VPC necesitas un NAT o, para servicios concretos de AWS, un VPC endpoint.",
          answer: true,
          explanation: "El NAT da salida genérica a internet y los VPC endpoints permiten acceder de forma privada a servicios como DynamoDB sin NAT."
        }
      ]
    }
  },

  {
    id: 15,
    title: "Rendimiento: RAM, Cold Starts y /tmp",
    stars: 3,
    category: "RENDIMIENTO",
    description:
      "Más RAM = más vCPU. Inicializar clientes fuera del handler reutiliza el execution context y reduce la latencia de los cold starts.",
    objective: "Optimizar el rendimiento de la función y entender el execution context",
    tags: ["RAM", "cold start", "execution context", "/tmp"],
    fileName: "handler.py",
    completed: false,
    theory: `📚 TEORÍA: Rendimiento de la Función Lambda

**RAM y CPU:**
  • La RAM va de **128 MB hasta 10 GB**, en incrementos de 1 MB.
  • Cuanta más RAM, más **créditos de vCPU**: cada **1792 MB** equivale
    a **una vCPU completa**, y se puede llegar hasta **6 vCPUs**.
  • Si tu código está ligado a la CPU, sube la RAM: a partir de
    1792 MB tendrás más de una CPU y podrás aprovecharla con
    multithreading.

**Timeout:**
  • El valor por defecto es **3 segundos** y el máximo es **900
    segundos** (15 minutos). Si tu trabajo tarda más de 15 minutos,
    Lambda no es el servicio adecuado (piensa en Fargate, ECS o EC2).

**Execution context y cold starts:**
  • El execution context es un **entorno temporal** que inicializa las
    dependencias externas (conexiones a BD, clientes HTTP, clientes
    SDK). Se mantiene vivo tras una invocación y la **siguiente puede
    reutilizarlo**, ahorrando tiempo.
  • Por eso se recomienda **inicializar fuera del handler**: la
    primera invocación ejecuta el init (más latencia: cold start) y
    las siguientes ya tienen la conexión preparada.

**Directorio /tmp:**
  • Espacio temporal para descargar archivos grandes o trabajar en
    disco: de **512 MB a 10 GB**.
  • Su contenido permanece cuando el contexto se congela: sirve de
    **caché transitoria** entre invocaciones.
  • Si necesitas persistencia real, usa un **bucket S3**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el execution context es el café preparado de antemano: la primera vez enciendes la cafetera (cold start, tarda más), pero las siguientes tazas salen al instante porque la cafetera sigue caliente.\n\nInicializar clientes y conexiones fuera del handler permite reutilizar el execution context entre invocaciones y reducir la latencia. La RAM va de 128 MB a 10 GB (cada 1792 MB = 1 vCPU) y el timeout máximo es de 900 s. /tmp (512 MB-10 GB) sirve como caché temporal; para persistencia real usa S3.",
    codeSnippet: `# Función Lambda en Python que accede a DynamoDB

import boto3
dynamodb = boto3.resource('dynamodb')   # inicializado FUERA del handler

def handler(event, context):
    table = dynamodb.Table('pedidos')
    return table.get_item(Key={'id': event['id']})['Item']`,
    inputs: {},
    completeCode: "RAM 128MB-10GB (1792MB = 1 vCPU) | timeout máx 900s | init fuera del handler = reutilizar execution context | /tmp caché (S3 para persistir)",
    format: "prediction",
    prediction: {
      prompt: "¿Por qué se inicializa el cliente boto3 fuera del handler en esta función Lambda?",
      snippet: `import boto3
dynamodb = boto3.resource('dynamodb')   # FUERA del handler

def handler(event, context):
    table = dynamodb.Table('pedidos')
    return table.get_item(Key={'id': event['id']})['Item']`,
      options: [
        "Para reutilizar el execution context entre invocaciones: la conexión se prepara una vez y reduce la latencia (y el impacto del cold start)",
        "El código falla porque boto3 no puede usarse fuera del handler",
        "Cada invocación debe crear su propia conexión para ser correcta",
        "Inicializar fuera del handler no tiene ninguna diferencia de rendimiento"
      ],
      answer: "Para reutilizar el execution context entre invocaciones: la conexión se prepara una vez y reduce la latencia (y el impacto del cold start)"
    }
  },

  {
    id: 16,
    title: "Capas Lambda: Dependencias Compartidas",
    stars: 2,
    category: "EMPAQUETADO",
    description:
      "Las capas externalizan y reutilizan dependencias entre funciones (y permiten runtimes personalizados). Ojo a los límites: 5 capas y 250 MB.",
    objective: "Entender los casos de uso y límites de las capas Lambda",
    tags: ["layers", "dependencias", "runtimes", "250MB"],
    fileName: "layer",
    completed: false,
    theory: `📚 TEORÍA: Capas de Lambda

Las **capas (layers)** tienen dos casos de uso principales:

  1. **Crear tiempos de ejecución personalizados**: si quieres
     programar tu función en C++ o Rust, puedes adaptarlos mediante
     una capa.
  2. **Externalizar y reutilizar dependencias**: en lugar de subir
     todo el código con sus librerías en cada función, extraes las
     dependencias a una capa común.

Ejemplo del instructor: una aplicación comprimida de 30 MB se
optimiza usando una capa: la función queda ligera y las dependencias
viajan en la capa compartida, evitando cargar los paquetes en cada
despliegue.

Límites a recordar (importantes para el examen):
  • Máximo **5 capas** por función.
  • **250 MB descomprimidos** en total (código + capas).`,
    explanationText:
      "🌍 Ejemplo cotidiano: las capas son las maletas compartidas del equipo: en vez de que cada viajero facture su propio equipaje (30 MB cada uno), todos usan la misma maleta común y solo suben al avión lo que es único de cada uno.\n\nLas capas externalizan dependencias para reutilizarlas entre funciones (y permiten runtimes personalizados como C++ o Rust). Límites: máximo 5 capas por función y 250 MB descomprimidos en total.",
    codeSnippet: `# Capas (layers) de Lambda

# Caso de uso 1: crear [INPUT_1] de ejecución personalizados
#                (por ejemplo, programar en C++ o Rust).

# Caso de uso 2: [INPUT_2] las dependencias de tu código y
#                [INPUT_3] esas dependencias entre funciones.
#                Ejemplo: un paquete de 30 MB ya no viaja en cada función.

# Límites a recordar:
#   • Máximo de [INPUT_4] capas por función.
#   • 250 MB descomprimidos en total.`,
    inputs: {
      INPUT_1: "tiempos",
      INPUT_2: "Externalizar",
      INPUT_3: "reutilizar",
      INPUT_4: "5",
    },
    completeCode: "Layers = runtimes personalizados (C++/Rust) + externalizar/reutilizar dependencias | máx 5 capas | 250 MB descomprimidos",
    format: "context-dropdown",
    contextDropdown: {
      prompt: "Completa los casos de uso y límites de las capas Lambda.",
      options: {
        INPUT_1: ["tiempos", "tipos", "idiomas"],
        INPUT_2: ["Externalizar", "Eliminar", "Compilar"],
        INPUT_3: ["reutilizar", "borrar", "duplicar"],
        INPUT_4: ["5", "10", "50"],
      }
    }
  },

  {
    id: 17,
    title: "Concurrencia: Reservada y Aprovisionada",
    stars: 4,
    category: "CONCURRENCIA",
    description:
      "Límite de 1000 ejecuciones concurrentes por región. La concurrencia reservada pone un tope por función; la aprovisionada elimina los cold starts.",
    objective: "Dominar la concurrencia reservada, aprovisionada y el estrangulamiento",
    tags: ["concurrencia", "reserved", "provisioned", "throttling"],
    fileName: "concurrency",
    completed: false,
    theory: `📚 TEORÍA: Concurrencia y Estrangulamiento

**Límite de concurrencia:**
  • AWS establece hasta **1000 ejecuciones concurrentes** de Lambda
    por región (ampliable con un ticket de soporte).
  • Puedes reservar concurrencia **a nivel de función** (concurrency
    reservada): cada invocación que supere el límite provoca un
    **estrangulamiento** (throttling).

**Comportamiento del estrangulamiento:**
  • Invocación **síncrona** → error con código **429**.
  • Invocación **asíncrona** → **reintento automático** y después el
    evento pasa a la cola de mensajes fallidos (DLQ).
  • Si no reservas concurrencia, una aplicación con mucho tráfico
    (ej. un ALB con muchos usuarios) puede **comerse todo el límite**
    de 1000 ejecuciones y estrangular a tus otras funciones. Por eso
    reservar es importante.
  • En las invocaciones asíncronas, si no hay concurrencia disponible
    las peticiones se estrangulan: Lambda devuelve el evento a la
    cola y reintenta durante un máximo de **6 horas**, con un
    intervalo que crece de forma exponencial desde **1 segundo** hasta
    un máximo de **5 minutos**.

**Cold starts y concurrencia aprovisionada:**
  • **Cold start**: al levantar una instancia nueva se carga el código
    y se ejecuta el init (fuera del handler); si es grande, la
    primera petición servida tiene **mayor latencia**.
  • **Concurrencia aprovisionada**: la capacidad de respuesta se
    asigna **por adelantado**, antes de invocar la función: nunca hay
    cold start y todas las invocaciones tienen **baja latencia**. El
    auto scaling puede gestionarla por programación o con un target.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una piscina con 1000 plazas. Si un grupo ocupa todas las plazas, los demás se quedan fuera (429). Reservar plazas para tu grupo te asegura sitio, y con la concurrencia aprovisionada las plazas ya están calientes (sin cold start).\n\nLímite por región: 1000 ejecuciones concurrentes (ampliable con ticket). Con concurrencia reservada, cada función tiene su tope: las síncronas reciben 429 y las asíncronas reintentan y acaban en DLQ. La concurrencia aprovisionada asigna capacidad de antemano: sin cold starts y con baja latencia. El backoff de los reintentos asíncronos crece de 1 s hasta 5 min (máximo 6 horas).",
    codeSnippet: "// Afirmaciones sobre concurrencia reservada, aprovisionada y estrangulamiento",
    inputs: {},
    completeCode: "1000 concurrentes por región | reservada = tope por función (sync 429, async→DLQ) | aprovisionada = sin cold starts | backoff 1s→5min (6h)",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de la concurrencia de Lambda.",
      statements: [
        {
          id: "a",
          text: "Lambda tiene un límite de hasta 1000 ejecuciones concurrentes por región, ampliable con un ticket de soporte.",
          answer: true,
          explanation: "Es el límite por defecto por región que cita el instructor; si necesitas más, abres un ticket en AWS."
        },
        {
          id: "b",
          text: "Si una invocación síncrona supera la concurrencia reservada, recibe un error de estrangulamiento con código 429.",
          answer: true,
          explanation: "El estrangulamiento síncrono devuelve 429; en asíncrono, Lambda reintenta y luego envía a la DLQ."
        },
        {
          id: "c",
          text: "La concurrencia aprovisionada asigna capacidad por adelantado: nunca hay cold start y todas las invocaciones tienen baja latencia.",
          answer: true,
          explanation: "Es la gran ventaja de provisioned concurrency: la capacidad ya está caliente antes de invocar."
        },
        {
          id: "d",
          text: "La concurrencia reservada no tiene efectos sobre otras funciones: cada función va por libre.",
          answer: false,
          explanation: "Al contrario: si no reservas, una función muy usada puede agotar las 1000 ejecuciones y estrangular al resto."
        }
      ]
    }
  },

  {
    id: 18,
    title: "Empaquetar Dependencias: Zip Directo o Vía S3",
    stars: 4,
    category: "EMPAQUETADO",
    description:
      "Las dependencias externas se instalan junto al código y se comprimen en un zip: menos de 50 MB se sube directo; más de 50 MB, primero a S3.",
    objective: "Elegir cómo empaquetar y subir una función con dependencias",
    tags: ["dependencias", "zip", "npm", "S3"],
    fileName: "package.zip",
    completed: false,
    theory: `📚 TEORÍA: Dependencias Externas de Lambda

Si tu función depende de bibliotecas externas (el X-Ray SDK, clientes
de bases de datos, etc.), necesitas **instalar los paquetes junto a
tu código y comprimirlos juntos**:

  • **Node.js**: usa npm y el directorio node_modules.
  • **Python**: usa las opciones de pip.
  • **Java**: incluye los archivos JAR correspondientes.

Cómo subir el paquete:
  • Si el zip pesa **menos de 50 MB**, se sube **directamente** a
    Lambda.
  • Si pesa **más de 50 MB**, primero se sube a **S3** y desde allí se
    despliega.

Otras notas del instructor:
  • Las **bibliotecas nativas** funcionan, pero deben **compilarse en
    Amazon Linux** (el sistema operativo del entorno de Lambda).
  • El **AWS SDK viene por defecto** con cada función Lambda: no hace
    falta empaquetarlo.`,
    explanationText:
      "🌍 Ejemplo cotidiano: para hacer la maleta no llevas el taller entero: instalas las librerías junto a tu código y comprimes todo en una única maleta (zip). Si la maleta pasa de 50 kg, la facturas primero a S3 y luego al avión.\n\nInstala las dependencias junto al código (npm/pip/JARs) y súbelas en el zip: <50 MB directo a Lambda, >50 MB vía S3. Las librerías nativas deben compilarse en Amazon Linux. Recuerda: el AWS SDK ya viene con cada función.",
    codeSnippet: `// Opción A
Subir un zip con el código + las dependencias instaladas (node_modules, pip...)
si pesa menos de 50 MB.

// Opción B
Si el zip pesa más de 50 MB, subirlo primero a S3 y desplegar desde allí.

// Opción C
Subir solo el handler sin dependencias: Lambda las descarga de npm al vuelo.`,
    inputs: {},
    completeCode: "Instalar paquetes junto al código y comprimir | <50MB directo, >50MB vía S3 | nativas compiladas en Amazon Linux | AWS SDK incluido",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál es la forma correcta de empaquetar una función Lambda con dependencias externas?",
      snippets: [
        {
          id: "a",
          label: "Opción A",
          code: "Zip con el código + dependencias instaladas (node_modules / pip / JARs). Si pesa < 50 MB se sube directo a Lambda; si pesa más, primero a S3.",
          description: "Es el flujo correcto: dependencias empaquetadas junto al código."
        },
        {
          id: "b",
          label: "Opción B",
          code: "Subir solo el archivo handler sin dependencias: Lambda las descarga automáticamente de npm o pip.",
          description: "No existe: las dependencias no se descargan solas; hay que empaquetarlas."
        },
        {
          id: "c",
          label: "Opción C",
          code: "Compilar las bibliotecas nativas en Windows y empaquetar el binario tal cual.",
          description: "Las librerías nativas deben compilarse en Amazon Linux."
        }
      ],
      correct: 0
    }
  },

  {
    id: 19,
    title: "Imágenes de Contenedor: Lambda desde ECR",
    stars: 4,
    category: "EMPAQUETADO",
    description:
      "Puedes desplegar Lambda como imagen de contenedor de hasta 10 GB desde ECR, siempre que la imagen base implemente la Lambda Runtime API.",
    objective: "Entender el despliegue de Lambda con imágenes de contenedor",
    tags: ["contenedores", "ECR", "Dockerfile", "Runtime API"],
    fileName: "Dockerfile",
    completed: false,
    theory: `📚 TEORÍA: Imágenes de Contenedores Lambda

Lambda también puede ejecutarse como una **imagen de contenedor de
Docker** de hasta **10 GB**, almacenada en **Amazon ECR**.

¿Para qué sirve?
  • Empaqueta **dependencias complejas y grandes** en un contenedor:
    código de aplicación, dependencias, conjuntos de datos, etc.
  • La **imagen base** debe implementar la **Lambda Runtime API**.
  • Existen imágenes base oficiales para **Python, Node.js, Java,
    .NET, Go y Ruby**; también puedes crear tu propia imagen siempre
    que implemente la API del runtime.

Flujo de trabajo:
  • **Build** de la imagen → **publish** a Amazon ECR → desplegarla
    como función Lambda.
  • Prueba local con el **emulador de la interfaz de tiempo de
    ejecución** de Lambda.

Dockerfile típico (del instructor):
  FROM public.ecr.aws/lambda:nodejs12
  COPY app.js package*.json ./
  RUN npm install
  CMD ["app.handler"]

Buenas prácticas:
  • Usar las **imágenes base de AWS** (basadas en Amazon Linux 2,
    ya cacheadas por Lambda): se descarga menos de tu contenedor.
  • Usar **construcciones multietapa** para tener una imagen final
    reducida.
  • Construir de lo **estable a lo cambiante**.
  • Un **único repositorio ECR** para funciones con capas grandes
    (evita subir duplicados).`,
    explanationText:
      "🌍 Ejemplo cotidiano: es enviar una maleta completa ya preparada (código + dependencias + datos) en vez de piezas sueltas: la maleta se empaqueta en Docker y Lambda la abre, siempre que la imagen hable el idioma correcto (Lambda Runtime API).\n\nPuedes desplegar funciones como imágenes de contenedor de hasta 10 GB desde ECR. La imagen base debe implementar la Lambda Runtime API (hay imágenes oficiales para Python, Node.js, Java, .NET, Go y Ruby). Prueba local con el emulador de la interfaz de runtime y optimiza: imágenes base de AWS (cacheadas), multi-stage y un solo repositorio ECR.",
    codeSnippet: `# Dockerfile para una función Lambda en Node.js
FROM public.ecr.aws/lambda:nodejs12
COPY app.js package*.json ./
RUN npm install
CMD ["app.handler"]`,
    inputs: {},
    completeCode: "Imagen hasta 10GB en ECR | imagen base = Lambda Runtime API | build → publish ECR → deploy | test local con emulador",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hace este Dockerfile en el contexto de AWS Lambda?",
      snippet: `FROM public.ecr.aws/lambda:nodejs12
COPY app.js package*.json ./
RUN npm install
CMD ["app.handler"]`,
      options: [
        "Construye una imagen válida para Lambda: parte de una imagen base de AWS que implementa la Lambda Runtime API",
        "Lambda no admite contenedores de Docker: solo acepta archivos zip",
        "Falta crear un archivo zip dentro de la imagen para que funcione",
        "Las imágenes de Lambda no pueden superar los 50 MB"
      ],
      answer: "Construye una imagen válida para Lambda: parte de una imagen base de AWS que implementa la Lambda Runtime API"
    }
  },

  {
    id: 20,
    title: "Versiones, Alias y CodeDeploy",
    stars: 3,
    category: "DESPLIEGUE",
    description:
      "$LATEST es mutable; las versiones publicadas son inmutables y los alias son punteros mutables que permiten canary. CodeDeploy automatiza el cambio de tráfico.",
    objective: "Entender versiones inmutables, alias y estrategias de despliegue",
    tags: ["$LATEST", "versiones", "alias", "CodeDeploy"],
    fileName: "versions-alias",
    completed: false,
    theory: `📚 TEORÍA: Versiones y Alias de Lambda

**$LATEST:**
  • Es la versión con la que trabajas mientras desarrollas: es
    **mutable**, puede cambiar cada vez que modificas el código.

**Versiones publicadas (1, 2, 3...):**
  • Cuando tienes un código estable, creas una **versión**: es
    **inmutable** (no se puede cambiar nada: código + configuración).
  • Los números de versión crecen (1, 2, 3...) y **cada versión tiene
    su propio ARN**.

**Alias:**
  • Son **punteros mutables** a versiones: defines alias como dev,
    test o prod y los mueves entre versiones según convenga.
  • Permiten el despliegue **canary** asignando **pesos**: por
    ejemplo, 95% del tráfico a la versión 1 y 5% a la versión 2.
  • Dan una **configuración estable** de triggers y destinos de
    eventos, y tienen su propio ARN.
  • ⚠️ Los alias **no pueden hacer referencia a otros alias**.

**Lambda y CodeDeploy:**
  • CodeDeploy automatiza el **cambio de tráfico para los alias** de
    Lambda (integrado con el framework SAM).
  • Estrategias: **lineal** (crece el tráfico cada n minutos hasta el
    100%), **canary** (prueba un X% y luego el 100%) y
    **all-at-once** (todo de inmediato).
  • Permite **hooks pre y post tráfico** para comprobar el estado de
    salud de la función antes y después de enviar tráfico.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una versión publicada es una fotografía inmutable de tu código: una vez revelada, no cambia. El alias es la etiqueta de la fotografía: puedes mover la etiqueta 'producción' de una foto a otra sin cambiar el marco.\n\n$LATEST es mutable; las versiones (1, 2, 3...) son inmutables con su propio ARN. Los alias (dev, test, prod) son punteros mutables a versiones, permiten canary con pesos (95% v1, 5% v2) y config estable de triggers. Los alias no pueden apuntar a otros alias. CodeDeploy automatiza el cambio de tráfico del alias (linear, canary, all-at-once) con hooks pre/post traffic.",
    codeSnippet: "// Afirmaciones sobre versiones, alias y CodeDeploy",
    inputs: {},
    completeCode: "$LATEST mutable | versiones inmutables con ARN | alias = punteros mutables (canary con pesos) | CodeDeploy: linear/canary/all-at-once + hooks",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de versiones, alias y CodeDeploy.",
      statements: [
        {
          id: "a",
          text: "La versión $LATEST es mutable, pero las versiones publicadas (1, 2, 3...) son inmutables y cada una tiene su ARN.",
          answer: true,
          explanation: "Esa es la diferencia clave: desarrollas en $LATEST y publicas versiones congeladas e inmutables."
        },
        {
          id: "b",
          text: "Un alias es un puntero mutable a una versión y se usa para desplegar en canary, repartiendo el tráfico con pesos entre versiones.",
          answer: true,
          explanation: "Por ejemplo, 95% a la versión 1 y 5% a la versión 2, moviendo el alias cuando quieras."
        },
        {
          id: "c",
          text: "Un alias puede apuntar a otro alias para encadenar despliegues.",
          answer: false,
          explanation: "Los alias solo apuntan a versiones: no pueden hacer referencia a otros alias, como recalca el instructor."
        },
        {
          id: "d",
          text: "CodeDeploy puede automatizar el cambio de tráfico de un alias con estrategias lineal, canary o 'todo a la vez'.",
          answer: true,
          explanation: "Son las estrategias de despliegue de CodeDeploy para los alias de Lambda, con hooks pre y post tráfico."
        }
      ]
    }
  },

  {
    id: 21,
    title: "Límites de Lambda: Lo que No Puede Superar",
    stars: 4,
    category: "LÍMITES",
    description:
      "El examen pregunta mucho por los límites: timeout 900s, memoria 128MB-10GB, /tmp hasta 10GB, variables de entorno 4KB, zip 50MB y más.",
    objective: "Memorizar los límites de ejecución y despliegue de Lambda",
    tags: ["límites", "timeout", "memoria", "6MB"],
    fileName: "limits",
    completed: false,
    theory: `📚 TEORÍA: Límites de Lambda

El instructor avisa: al examen le gusta mucho preguntar los límites.
Están enfocados **por región**.

**Límites de ejecución:**
  • Memoria: de **128 MB a 10 GB** (subir la memoria también sube la
    CPU).
  • Tiempo máximo de ejecución: **900 segundos** (15 minutos). Todo
    lo que supere eso no es un buen caso de uso para Lambda.
  • Variables de entorno: **4 KB** (una cantidad pequeña).
  • Espacio temporal (/tmp): de **512 MB a 10 GB**.
  • Concurrencia: hasta **1000 ejecuciones concurrentes** por región
    (ampliable con una petición; mejor usar concurrencia reservada).
  • Payload de invocaciones **síncronas** (petición y respuesta):
    **6 MB**.
  • Payload de invocaciones **asíncronas**: **256 KB** (el invocador
    no espera respuesta, así que el tope es menor).

**Límites de despliegue:**
  • Zip (comprimido): **50 MB**.
  • Sin comprimir (código + dependencias): **250 MB**.
  • Si necesitas archivos grandes, usa el directorio **/tmp** o S3.

Si en el examen te piden 30 GB de RAM, 30 minutos de ejecución o un
archivo de 3 GB, ya sabes: **Lambda no es la solución** (piensa en
EC2, ECS o Fargate).`,
    explanationText:
      "🌍 Ejemplo cotidiano: los límites de Lambda son las medidas del equipaje en el aeropuerto: 15 minutos de vuelo, maleta comprimida de 50 MB, 250 MB abierta, y solo 4 KB de etiquetas. Si necesitas más, este vuelo no es para ti (usa EC2, ECS o Fargate).\n\nMemoriza: timeout máx 900 s; RAM 128 MB–10 GB; variables de entorno 4 KB; /tmp 512 MB–10 GB; 1000 ejecuciones concurrentes por región; zip 50 MB / descomprimido 250 MB; payload síncrono 6 MB y asíncrono 256 KB.",
    codeSnippet: "// Afirmaciones sobre los límites de Lambda",
    inputs: {},
    completeCode: "Timeout 900s | RAM 128MB-10GB | env 4KB | /tmp 512MB-10GB | 1000 concurrencia | zip 50MB / 250MB sin comprimir | sync payload 6MB",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes de los límites de Lambda.",
      statements: [
        {
          id: "a",
          text: "El tiempo máximo de ejecución de una función Lambda es de 900 segundos (15 minutos).",
          answer: true,
          explanation: "Más de 15 minutos no es buen caso de uso para Lambda: ahí entran ECS, EC2 o Fargate."
        },
        {
          id: "b",
          text: "La memoria de Lambda va de 128 MB a 10 GB, y subirla también mejora la CPU y la red.",
          answer: true,
          explanation: "Cada 1792 MB de RAM equivale a una vCPU completa, por lo que más RAM = más CPU."
        },
        {
          id: "c",
          text: "Las variables de entorno de una función Lambda pueden ocupar hasta 1 GB.",
          answer: false,
          explanation: "Son solo 4 KB: una cantidad pequeña, como insiste el instructor."
        },
        {
          id: "d",
          text: "El archivo comprimido de despliegue (zip) puede pesar hasta 250 MB.",
          answer: false,
          explanation: "El zip se limita a 50 MB; el límite de 250 MB es para el código sin comprimir (código + dependencias)."
        },
        {
          id: "e",
          text: "El payload máximo de una invocación síncrona (petición y respuesta) es de 6 MB.",
          answer: true,
          explanation: "Las invocaciones síncronas tienen ese límite de payload request/response de 6 MB."
        }
      ]
    }
  },

  {
    id: 22,
    title: "URL de Función y Buenas Prácticas",
    stars: 4,
    category: "MEJORES PRÁCTICAS",
    description:
      "La URL de función expone tu Lambda por HTTPS sin API Gateway ni ALB. Y el handler correcto se construye con buenas prácticas: init fuera y secretos cifrados.",
    objective: "Exponer una función por URL y aplicar las buenas prácticas del handler",
    tags: ["URL de función", "AuthType", "buenas prácticas", "KMS"],
    fileName: "lambda-url",
    completed: false,
    theory: `📚 TEORÍA: URL de la Función y Buenas Prácticas

**URL de la función Lambda:**
  • Si quieres exponer tu función como endpoint HTTP **sin crear API
    Gateway ni ALB**, usa la **URL de la función**: un endpoint único
    que **nunca cambiará**, compatible con **IPv4 e IPv6**.
  • Accedes por HTTPS desde el navegador, la CLI o Postman.
  • ⚠️ Solo es accesible a través del **internet público**: no
    soporta PrivateLink ni URLs privadas.
  • Si llamas desde un dominio distinto, configura **CORS**.
  • Seguridad: las **políticas basadas en recursos** controlan el
    acceso (qué cuentas, rangos de IP o principals). Se aplican al
    alias o a $LATEST, **no a versiones específicas**.
  • **AuthType NONE**: acceso público sin autenticación.
  • **AuthType AWS_IAM**: autenticación con IAM; en la misma cuenta
    basta con permisos en identidad **o** recurso, pero en
    **cuenta cruzada** hace falta permiso en identidad **y** recurso.

**Buenas prácticas del instructor:**
  • Hacer los **trabajos pesados fuera del handler**: conectar a
    bases de datos, inicializar el SDK e introducir dependencias o
    datos fuera del controlador.
  • Usar **variables de entorno** para strings de conexión, buckets
    S3, etc. Nunca valores en el código; los secretos se **cifran con
    KMS**.
  • **Minimizar el paquete** de despliegue (descompón la función si
    hace falta) y usar **capas** cuando sea necesario.
  • **Evitar código recursivo**: nunca hagas que una función Lambda
    se llame a sí misma.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la URL de la función es la puerta directa de tu casa sin recepción (sin API Gateway ni ALB): un acceso único y público, con su propia cerradura (AuthType) y reglas de entrada (CORS y políticas de recursos). Y el handler correcto es preparar el café de la oficina una sola vez (init fuera), no en cada visita.\n\nLa URL de función es un endpoint único e inmutable (IPv4/IPv6) accesible solo por internet público (sin PrivateLink). AuthType NONE = acceso público; AWS_IAM = autenticación IAM (en cuenta cruzada hacen falta permisos en identidad Y recurso). Configura CORS si llamas desde otro dominio. Buenas prácticas del instructor: trabajos pesados fuera del handler, variables de entorno cifradas con KMS, minimizar el paquete, usar capas y nunca hacer que una función se llame a sí misma.",
    codeSnippet: `// Opción A
Inicializar SDK y conexiones fuera del handler, usar variables de entorno
cifradas con KMS y exponer con URL (AuthType AWS_IAM) para controlar el acceso.

// Opción B
Conectar a la base de datos dentro del handler en cada invocación y guardar
la contraseña en el código.

// Opción C
Exponer la URL de la función con AuthType NONE para datos sensibles en producción.`,
    inputs: {},
    completeCode: "URL única e inmutable (solo internet público) | AuthType NONE = público, AWS_IAM = auth | CORS si otro dominio | BP: init fuera, env cifradas, sin recursión",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál es el enfoque correcto para preparar una función Lambda en producción?",
      snippets: [
        {
          id: "a",
          label: "Opción A",
          code: "Inicializar SDK y conexiones fuera del handler, usar variables de entorno cifradas con KMS y exponer con URL (AuthType AWS_IAM) para controlar el acceso.",
          description: "Combina las buenas prácticas del handler con una URL protegida."
        },
        {
          id: "b",
          label: "Opción B",
          code: "Conectar a la base de datos dentro del handler en cada invocación y guardar la contraseña en el código.",
          description: "Anti-patrón: conexión en cada llamada y secretos hardcodeados."
        },
        {
          id: "c",
          label: "Opción C",
          code: "Exponer la URL de la función con AuthType NONE para datos sensibles en producción.",
          description: "Anti-patrón: acceso público sin autenticación para datos sensibles."
        }
      ],
      correct: 0
    }
  },
];
