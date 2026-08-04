import type { Exercise } from "@/lib/types";

/** Ruta progresiva: mensajería e integración — SQS, SNS, Kinesis y EventBridge (DVA-C02, secciones 19 y 20). */
export const AWS_MESSAGING_EXERCISES: Exercise[] = [

  // ────────────────────────────────────────────────────────────────────────────
  // ─── INTRODUCCIÓN A LA MENSAJERÍA ───────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "Mensajería: Síncrona vs Asíncrona",
    stars: 1,
    category: "CONCEPTOS",
    description:
      "Cuando varias aplicaciones se comunican, el patrón síncrono (app ↔ app) se rompe con picos de tráfico. La alternativa: una cola por el medio.",
    objective: "Distinguir comunicación síncrona de asíncrona y su porqué",
    tags: ["mensajería", "síncrono", "asíncrono", "desacoplar"],
    fileName: "mensajeria",
    completed: false,
    theory: `📚 TEORÍA: Los dos patrones de comunicación entre aplicaciones

El instructor introduce la sección con un problema inevitable: cuando
desplegamos varias aplicaciones o microservicios, estos deben comunicarse
entre sí. Hay dos patrones:

  • **Síncrono**: una aplicación se conecta directamente con otra.
  • **Asíncrono (basado en eventos)**: la aplicación envía a una cola
    y la cola entrega a la siguiente aplicación.

¿Qué implicación tiene poner una cola por el medio? Que la sincronización
directa es problemática si hay **picos repentinos de tráfico**: ¿qué pasa
si de repente necesitas codificar 1000 vídeos cuando normalmente eran 10?

La solución es **desacoplar** las aplicaciones con:
  • **SQS**: modelo de cola.
  • **SNS**: modelo de publicación-subscripción.
  • **Kinesis**: modelo de flujo de datos en tiempo real.

Cada uno de estos servicios escala de forma independiente a nuestra
aplicación. Si en el examen ves la palabra "desacoplar aplicaciones",
piensa en este trío.`,
    explanationText:
      "🌍 Ejemplo cotidiano: síncrono es llamar por teléfono al camarero para pedir una pizza: si hay mil llamadas a la vez, nadie puede pedir. Asíncrono es enviar el pedido por la app: miles de pedidos entran en la cola de la cocina y cada cocinero (consumidor) los va sacando a su ritmo.\n\nCon una cola intermedia, los picos de tráfico no tumban al sistema: la cola absorbe la avalancha y los consumidores escalan de forma independiente. Por eso SQS, SNS y Kinesis son la respuesta típica a problemas de acoplamiento entre aplicaciones.",
    codeSnippet: "// Afirmaciones sobre los patrones de comunicación entre aplicaciones",
    inputs: {},
    completeCode: "Síncrono = app↔app | Asíncrono = app→cola→app | desacoplar = SQS/SNS/Kinesis",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los patrones de comunicación entre aplicaciones.",
      statements: [
        {
          id: "a",
          text: "En la comunicación síncrona, una aplicación se conecta directamente con otra aplicación.",
          answer: true,
          explanation: "Es el patrón app↔app del instructor: una aplicación llama directamente a la otra, sin intermediarios."
        },
        {
          id: "b",
          text: "En la comunicación asíncrona, hay una cola intermedia entre la aplicación productora y la consumidora.",
          answer: true,
          explanation: "La app envía a una cola y la cola entrega a la siguiente app. Es el patrón basado en eventos."
        },
        {
          id: "c",
          text: "Una cola intermedia ayuda a absorber picos repentinos de tráfico desacoplando las aplicaciones.",
          answer: true,
          explanation: "Es el ejemplo del instructor: si normalmente codificas 10 vídeos y de golpe llegan 1000, la cola absorbe el pico."
        },
        {
          id: "d",
          text: "SQS es el modelo de publicación-subscripción y SNS el modelo de cola.",
          answer: false,
          explanation: "Está invertido: SQS es el modelo de cola y SNS el de publicación-subscripción."
        },
        {
          id: "e",
          text: "SQS, SNS y Kinesis pueden escalar de forma independiente a la aplicación.",
          answer: true,
          explanation: "Esa es su gran ventaja: cada servicio de mensajería escala por su cuenta, sin frenar a la aplicación."
        }
      ]
    }
  },

  {
    id: 2,
    title: "Cola Estándar SQS: Productores y Consumidores",
    stars: 1,
    category: "SQS",
    description:
      "SQS es de los servicios más antiguos de AWS, totalmente gestionado, para desacoplar aplicaciones. Sus protagonistas: productores (SendMessage) y consumidores (polling + DeleteMessage).",
    objective: "Conocer los elementos, atributos y garantías de una cola estándar",
    tags: ["SQS", "SendMessage", "ReceiveMessage", "DeleteMessage"],
    fileName: "cola-estandar",
    completed: false,
    theory: `📚 TEORÍA: Amazon SQS — Colas Estándar

SQS es uno de los primeros servicios de AWS (más de 10 años) y es un
servicio **totalmente gestionado** para desacoplar aplicaciones.

Elementos que intervienen:
  • **Productores**: envían mensajes a la cola con la API **SendMessage**.
    Puede haber muchos productores hacia una misma cola.
  • **Consumidores**: hacen **sondeo (polling)** a la cola preguntando si
    hay mensajes. Pueden recibir hasta **10 mensajes a la vez**, procesan
    (ej. insertar en RDS) y los eliminan con **DeleteMessage**.

Atributos de la cola estándar:
  • Rendimiento **ilimitado**: número ilimitado de mensajes en cola.
  • Retención: **4 días por defecto**, máximo **14 días**.
  • Latencia inferior a **10 ms** en publicación y recepción.
  • Límite de **256 KB** por mensaje.

Garantías (importantes para el examen):
  • **At-least-once delivery**: puede haber mensajes duplicados.
  • **Best-effort ordering**: los mensajes pueden salir desordenados.

Caso de uso del instructor: un frontend envía pedidos de procesamiento de
vídeo a la cola (productor) y un Auto Scaling Group de EC2 los consume
(consumidor). La métrica CloudWatch **ApproximateNumberOfMessages** regula
el escalado: si la cola crece, la alarma dispara más instancias.`,
    explanationText:
      "🌍 Ejemplo cotidiano: SQS es la bandeja de pedidos de un restaurante. El camarero (productor) deja las comandas en la bandeja y los cocineros (consumidores) las van sacando con polling: cogen hasta 10, las cocinan y las tiran al terminar. Si llegan mil comandas de golpe, la bandeja aguanta todo.\n\nLa cola estándar prioriza rendimiento y simplicidad: es ilimitada, rápida y desacopla frontend de backend. Pero recuerda sus dos garantías débiles: puede haber duplicados (at-least-once) y el orden es al mejor esfuerzo. Cuando el examen exige exactamente una vez y orden estricto, toca pasar a una cola FIFO.",
    codeSnippet: "// Afirmaciones sobre la cola estándar de Amazon SQS",
    inputs: {},
    completeCode: "Productores SendMessage → cola (retención 4-14 días, 256 KB) → consumidores polling + DeleteMessage",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre la cola estándar de SQS.",
      statements: [
        {
          id: "a",
          text: "SQS es un servicio totalmente gestionado y uno de los más antiguos de AWS (más de 10 años).",
          answer: true,
          explanation: "SQS es de las primeras ofertas de AWS y el instructor lo usa como sinónimo de 'desacoplar aplicaciones'."
        },
        {
          id: "b",
          text: "La retención de mensajes por defecto es de 4 días y puede llegar hasta 14 días.",
          answer: true,
          explanation: "Los mensajes se conservan 4 días por defecto, con un máximo configurable de 14."
        },
        {
          id: "c",
          text: "Los productores envían mensajes con SendMessage y los consumidores los reciben haciendo polling.",
          answer: true,
          explanation: "SendMessage para producir; los consumidores sondean la cola en busca de mensajes y procesan."
        },
        {
          id: "d",
          text: "Un consumidor puede recibir hasta 10 mensajes de una vez y los elimina con DeleteMessage tras procesarlos.",
          answer: true,
          explanation: "El polling devuelve hasta 10 mensajes y el consumidor los borra de la cola cuando termina."
        },
        {
          id: "e",
          text: "Una cola estándar garantiza que cada mensaje se entrega exactamente una vez y en orden.",
          answer: false,
          explanation: "Al revés: la cola estándar ofrece at-least-once (posibles duplicados) y orden al mejor esfuerzo."
        },
        {
          id: "f",
          text: "El tamaño máximo de un mensaje SQS es de 256 KB.",
          answer: true,
          explanation: "256 KB por mensaje. Para mensajes más grandes se usa el cliente extendido de SQS con S3."
        }
      ]
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── VISIBILIDAD DE MENSAJES ────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 3,
    title: "Tiempo de Espera de Visibilidad",
    stars: 2,
    category: "SQS",
    description:
      "Después de sondear un mensaje, este se vuelve invisible para los demás consumidores durante 30 segundos por defecto. Si no lo procesas a tiempo, otro consumidor podrá hacerlo.",
    objective: "Entender el visibility timeout y su efecto en los duplicados",
    tags: ["visibility timeout", "30 segundos", "ChangeMessageVisibility", "duplicados"],
    fileName: "visibility-timeout",
    completed: false,
    theory: `📚 TEORÍA: El Tiempo de Espera de Visibilidad

Cuando un consumidor sondea un mensaje, SQS lo **reserva**: el mensaje se
vuelve **invisible** para el resto de consumidores durante el tiempo de
espera de visibilidad (visibility timeout).

  • Por defecto: **30 segundos** (configurable desde 0 segundos hasta horas).
  • El mensaje tiene ese tiempo para ser procesado por el consumidor.
  • Si otro consumidor pregunta durante ese periodo, **no recibe el mensaje**.
  • Cuando el tiempo acaba sin que se procese, el mensaje vuelve a estar
    visible y **otro consumidor puede recibirlo** (y se procesará de nuevo).

Implicaciones:
  • Si un mensaje no se procesa a tiempo, se procesa **dos veces** (el
    recuento de recepción aumenta).
  • El consumidor puede pedir más tiempo con **ChangeMessageVisibility**.
  • Timeout **alto** (horas) → el consumidor se bloquea y el procesamiento
    se vuelve lento.
  • Timeout **bajo** (ej. 5 segundos) → riesgo de **duplicados**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el visibility timeout es la reserva de una mesa: cuando el camarero te la asigna, nadie más puede sentarse durante un rato. Si no llegas a tiempo, la mesa se libera y otro grupo puede ocuparla y consumir tu mesa.\n\nEse tiempo es el margen que SQS te da para procesar: mientras dura, tu mensaje está 'apartado' para ti. Si no lo eliminas a tiempo, el mensaje reaparece y otro consumidor lo procesa → se procesa dos veces. La regla del examen: timeout muy bajo = duplicados; timeout muy alto = bloqueos.",
    codeSnippet: "// Afirmaciones sobre el tiempo de espera de visibilidad de SQS",
    inputs: {},
    completeCode: "Visibility timeout: 30 s por defecto | mensaje invisible para los demás | ChangeMessageVisibility para ampliarlo",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre el tiempo de espera de visibilidad.",
      statements: [
        {
          id: "a",
          text: "Por defecto, el tiempo de espera de visibilidad de un mensaje SQS es de 30 segundos.",
          answer: true,
          explanation: "El valor por defecto es 30 segundos, aunque se puede cambiar entre 0 segundos y horas."
        },
        {
          id: "b",
          text: "Mientras dura el visibility timeout, el mensaje es invisible para el resto de consumidores.",
          answer: true,
          explanation: "Es la reserva del instructor: el mensaje queda dedicado al consumidor que lo sondó."
        },
        {
          id: "c",
          text: "Si el consumidor no procesa el mensaje a tiempo, vuelve a estar visible y puede procesarse de nuevo.",
          answer: true,
          explanation: "Al acabar el timeout, el mensaje reaparece para todos y puede generar un procesamiento duplicado."
        },
        {
          id: "d",
          text: "El consumidor puede ampliar el tiempo de procesamiento con la llamada ChangeMessageVisibility.",
          answer: true,
          explanation: "ChangeMessageVisibility permite ajustar el tiempo de visibilidad del mensaje en curso."
        },
        {
          id: "e",
          text: "Un visibility timeout muy corto (por ejemplo 5 segundos) elimina el riesgo de mensajes duplicados.",
          answer: false,
          explanation: "Es al revés: un timeout corto hace que el mensaje reaparezca pronto y aumente el riesgo de duplicados."
        },
        {
          id: "f",
          text: "Si el visibility timeout es demasiado alto (horas), el procesamiento de mensajes se vuelve más lento.",
          answer: true,
          explanation: "Un consumidor fallido retiene los mensajes horas: los demás no los ven y el procesamiento se bloquea."
        }
      ]
    }
  },

  {
    id: 4,
    title: "Visibilidad en Acción: Dos Consumidores",
    stars: 2,
    category: "SQS",
    description:
      "El instructor simula dos consumidores en dos pestañas: uno recibe el mensaje 'Hola mundo' y el segundo sondea inmediatamente. ¿Qué recibe?",
    objective: "Predecir el comportamiento de la cola con dos consumidores",
    tags: ["polling", "visibilidad", "consumidores", "escenario"],
    fileName: "cola-estandar",
    completed: false,
    theory: `📚 TEORÍA: El escenario de los dos consumidores

En la demostración del instructor se abre la misma cola SQS en dos
pestañas del navegador para simular **dos consumidores**.

  1. Se envía el mensaje "Hola mundo" a la cola.
  2. El consumidor 1 sondea y recibe el mensaje: arranca el visibility
     timeout (30 segundos por defecto).
  3. El consumidor 2 sondea justo después: **no recibe nada**, porque el
     mensaje está reservado para el consumidor 1 durante esos 30 segundos.
  4. Si el mensaje no se procesa (no se elimina) cuando el tiempo acaba,
     el consumidor 2 ya sí recibe el mensaje: el recuento de recepción
     aumenta (de 2 a 3 en la demo).
  5. Al eliminar el mensaje, desaparece de la cola para todos.

La clave: el tiempo de espera de visibilidad **reserva** el mensaje para
el consumidor que lo sondeó.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la fila del pan con un solo cartón de leche en la estantería: el primero que lo coge lo tiene 'reservado' mientras lo lleva a la caja; el segundo cliente que llega se encuentra la estantería vacía hasta que el primero lo devuelve (no lo compra).\n\nSQS aparta el mensaje para el consumidor que lo recibió durante el visibility timeout. El segundo consumidor no recibe nada en ese periodo. Solo cuando el timeout expira sin haberse eliminado, el mensaje reaparece y otro consumidor puede procesarlo: por eso el recuento de recepción sube.",
    codeSnippet: `// Dos consumidores sobre la misma cola SQS

// Consumidor 1 (t=0s)
ReceiveMessage → "Hola mundo"  (arranca visibility timeout de 30 s)

// Consumidor 2 (t=1s)
ReceiveMessage → ???`,
    inputs: {},
    completeCode: "Consumidor 2 no recibe el mensaje: está invisible hasta que acabe el visibility timeout",
    format: "prediction",
    prediction: {
      prompt: "¿Qué recibe el consumidor 2 si sondea la cola justo después de que el consumidor 1 haya recibido el mensaje?",
      snippet: "ReceiveMessage del consumidor 1 → \"Hola mundo\" (visibility timeout activo)\nReceiveMessage del consumidor 2 → ???",
      options: [
        "No recibe nada: el mensaje está invisible durante el visibility timeout",
        "Recibe el mismo mensaje al instante, porque los mensajes se comparten",
        "Recibe el mensaje y lo procesa en paralelo (duplicado inmediato)",
        "La cola devuelve un error porque solo admite un consumidor"
      ],
      answer: "No recibe nada: el mensaje está invisible durante el visibility timeout"
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── COLAS DE MENSAJES FALLIDOS (DLQ) ──────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 5,
    title: "Colas de Mensajes Fallidos (DLQ)",
    stars: 2,
    category: "DLQ",
    description:
      "Si un consumidor no procesa un mensaje a tiempo, este vuelve a la cola. Tras superar un umbral de recepciones, el mensaje pasa a la cola de mensajes fallidos para depurarlo.",
    objective: "Entender la DLQ y el umbral maxReceiveCount",
    tags: ["DLQ", "maxReceiveCount", "depuración", "redrive"],
    fileName: "dlq",
    completed: false,
    theory: `📚 TEORÍA: Colas de Mensajes Fallidos (Dead Letter Queue)

Si un consumidor no procesa un mensaje dentro del tiempo de espera de
visibilidad, el mensaje **vuelve a la cola** y esto puede pasar varias
veces. Para controlarlo se define un **umbral** (maxReceiveCount): cuántas
veces como máximo puede volver un mensaje a la cola.

  • Cuando se supera el umbral, el mensaje pasa a una cola separada
    llamada **cola de mensajes fallidos (DLQ)**.
  • La DLQ puede ser **estándar o FIFO**.
  • Conviene fijar una **retención de 14 días** en la DLQ y procesar sus
    mensajes antes de que caduquen.

La **redrive policy / redirección hacia el origen**: una característica que
permite consumir mensajes de la DLQ para entender qué les pasa. Cuando tu
código esté arreglado, puedes **redirigir los mensajes de la DLQ a la cola
de origen (o a cualquier otra) por lotes**, sin escribir código personalizado.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la DLQ es la caja de 'devoluciones' de un centro logístico. Un paquete que no se puede entregar vuelve al almacén varias veces; al tercer intento fallido se aparta en la caja de incidencias para que un humano decida qué hacer, en lugar de dar vueltas eternas.\n\nSin DLQ, un mensaje problemático reintenta para siempre y bloquea la cola. Con maxReceiveCount + DLQ, SQS aparta el mensaje tras N fallos y tu equipo puede depurarlo con calma y reenviarlo (redrive) cuando el código esté corregido. Es la red de seguridad de cualquier cola en producción.",
    codeSnippet: `// Escenario
// maxReceiveCount = 5
// El mensaje se ha recibido 5 veces sin procesarse con éxito

// ¿Qué ocurre con el mensaje?`,
    inputs: {},
    completeCode: "maxReceiveCount superado → el mensaje pasa a la DLQ (estándar o FIFO) para depurar y redrive",
    format: "prediction",
    prediction: {
      prompt: "Has configurado una DLQ con maxReceiveCount = 5. Un mensaje ha sido recibido 5 veces sin procesarse. ¿Qué ocurre?",
      snippet: "ReceiveCount del mensaje: 5 / maxReceiveCount: 5",
      options: [
        "El mensaje pasa a la cola de mensajes fallidos (DLQ) para depurarlo",
        "El mensaje se elimina definitivamente de SQS",
        "El mensaje se reintenta indefinidamente sin ningún límite",
        "El mensaje se envía automáticamente a otra región"
      ],
      answer: "El mensaje pasa a la cola de mensajes fallidos (DLQ) para depurarlo"
    }
  },

  {
    id: 6,
    title: "Configurar una DLQ",
    stars: 2,
    category: "DLQ",
    description:
      "Proteger una cola de mensajes problemáticos sigue un orden claro: crear la cola principal y la DLQ, fijar el umbral con la redrive policy, depurar y redirigir.",
    objective: "Ordenar los pasos para montar una cola de mensajes fallidos",
    tags: ["DLQ", "redrive policy", "maxReceiveCount", "depuración"],
    fileName: "dlq",
    completed: false,
    theory: `📚 TEORÍA: Pasos para proteger tu cola con una DLQ

El instructor insiste en dos ideas clave de las colas de mensajes fallidos:

  1. **Redrive policy**: es la configuración de la cola principal que
     apunta a la DLQ y define el umbral (maxReceiveCount) de reintentos.
  2. **Redirección hacia el origen (redrive)**: cuando el código esté
     arreglado, puedes consumir los mensajes de la DLQ y volver a
     inyectarlos en la cola de origen (o en otra) **por lotes**, sin
     escribir código personalizado.

La DLQ conviene crearla con una **retención de 14 días** para que los
mensajes no caduquen antes de que puedas depurarlos.`,
    explanationText:
      "🌍 Ejemplo cotidiano: montar una DLQ es como poner una caja de incidencias en la oficina: primero instalas la caja, después defines la regla ('todo lo que falle 5 veces, a la caja'), luego revisas lo que cae dentro y, cuando arreglas el problema, vuelves a meter esos expedientes en el circuito normal.\n\nEl orden importa porque cada paso depende del anterior: sin redrive policy no hay umbral, y sin depuración no hay forma de recuperar los mensajes. La DLQ te da visibilidad sobre los fallos sin bloquear la cola principal.",
    codeSnippet: "// Ordena los pasos para configurar una DLQ",
    inputs: {},
    completeCode: "Cola principal → crear DLQ → redrive policy (maxReceiveCount) → depurar → redrive a origen",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para proteger tu cola principal con una cola de mensajes fallidos (DLQ).",
      steps: [
        { id: "create-main", label: "Crear la cola principal donde llegan los mensajes" },
        { id: "create-dlq", label: "Crear la cola de mensajes fallidos (DLQ), con retención de 14 días recomendada" },
        { id: "redrive-policy", label: "Configurar la redrive policy de la cola principal apuntando a la DLQ y fijando maxReceiveCount" },
        { id: "threshold", label: "Cuando un mensaje supera el umbral de recepciones, SQS lo mueve a la DLQ" },
        { id: "debug", label: "Inspeccionar y depurar los mensajes fallidos de la DLQ" },
        { id: "redrive-back", label: "Redirigir (redrive) los mensajes corregidos de vuelta a la cola de origen" },
      ],
      correctOrder: ["create-main", "create-dlq", "redrive-policy", "threshold", "debug", "redrive-back"],
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── COLAS DE RETRASO ──────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 7,
    title: "Colas de Retraso (Delay Queues)",
    stars: 2,
    category: "SQS",
    description:
      "Con las colas de espera puedes retrasar un mensaje hasta 15 minutos: los consumidores no lo verán hasta que el retraso termine.",
    objective: "Usar DelaySeconds a nivel de cola y por mensaje",
    tags: ["delay queue", "DelaySeconds", "15 minutos", "retraso"],
    fileName: "delay-queue",
    completed: false,
    theory: `📚 TEORÍA: Colas de Espera / Retraso

Las colas de espera (delay queues) permiten **retrasar un mensaje**: los
consumidores no lo van a ver inmediatamente.

  • Valor por defecto: **0 segundos** (disponibilidad inmediata).
  • Máximo: **15 minutos**.
  • Se puede configurar **a nivel de cola** (retraso de entrega por
    defecto) o **anularlo por mensaje** en el envío con el parámetro
    **DelaySeconds** de SendMessage.

En la demostración, el instructor crea una cola con un retraso de entrega
de 10 segundos, envía "Hola mundo" y comprueba que al sondear **no recibe
el mensaje**: está contando el retraso. Pasados los 10 segundos, el mensaje
aparece y ya puede ser procesado.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es pedir una pizza con 'entregar en 15 minutos': la comanda entra en la cocina ya, pero nadie la cocina ni la sirve hasta que llega el momento programado.\n\nEl retraso oculta el mensaje a los consumidores durante DelaySeconds (0-900 segundos). Configúralo a nivel de cola para dar margen a todos los envíos o usa DelaySeconds por mensaje cuando solo algunos pedidos deban esperar (por ejemplo, un recordatorio programado).",
    codeSnippet: `# Enviar un mensaje que no esté disponible hasta dentro de 10 segundos

aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/mi-cola \\
  --message-body "Hola mundo" \\
  --delay-seconds 10

# ¿Cuándo podrá procesarlo el consumidor?`,
    inputs: {},
    completeCode: "DelaySeconds (0-900 s) a nivel de cola o por mensaje → el mensaje se oculta hasta que el retraso acaba",
    format: "prediction",
    prediction: {
      prompt: "Envías un mensaje con --delay-seconds 10 y el consumidor sondea inmediatamente. ¿Qué ocurre?",
      snippet: "aws sqs send-message --queue-url ... --message-body \"Hola mundo\" --delay-seconds 10",
      options: [
        "El mensaje queda oculto 10 segundos y luego estará disponible para los consumidores",
        "El mensaje se entrega al instante: el parámetro solo afecta al número de reintentos",
        "El mensaje se elimina automáticamente a los 10 segundos",
        "El mensaje espera 10 minutos antes de entrar en la cola"
      ],
      answer: "El mensaje queda oculto 10 segundos y luego estará disponible para los consumidores"
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── CONCEPTOS CERTIFIED DEVELOPER ─────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 8,
    title: "Sondeo Largo y Conceptos Certified Developer",
    stars: 2,
    category: "SQS",
    description:
      "Para el examen: sondeo largo (long polling) de 1 a 20 segundos, el cliente extendido para mensajes gigantes y las llamadas de API imprescindibles.",
    objective: "Dominar los conceptos avanzados de SQS que pide el examen",
    tags: ["long polling", "WaitTimeSeconds", "cliente extendido", "API"],
    fileName: "sqs-concepts",
    completed: false,
    theory: `📚 TEORÍA: Conceptos de Certified Developer

**Sondeo largo (long polling)**:
  • El consumidor, en vez de preguntar constantemente, **espera** a que
    lleguen mensajes a la cola.
  • Reduce el número de llamadas a la API, aumenta la eficiencia y reduce
    la latencia de la aplicación.
  • Se configura con **WaitTimeSeconds**, entre **1 y 20 segundos**
    (a nivel de cola o de API). No es infinito: si no hay mensajes, la
    conexión se cierra al llegar al máximo.
  • En el examen, "aumentar eficiencia y reducir latencia con SQS" →
    pensar en long polling.

**Cliente extendido de SQS (Extended Client)**:
  • El límite de un mensaje SQS es **256 KB**. Para mensajes grandes
    (ej. 1 GB) se usa una biblioteca Java que guarda el mensaje grande en
    **S3** y envía por la cola un mensaje de **metadatos** que indica
    dónde recuperarlo.

**Llamadas de API imprescindibles**:
  • CreateQueue (definir retención), DeleteQueue, **PurgeQueue** (borrar
    todos los mensajes de golpe).
  • SendMessage (con DelaySeconds), ReceiveMessage, DeleteMessage.
  • MaxNumberOfMessages: por defecto 1, máximo 10.
  • ReceiveMessageWaitTimeSeconds: para sondeo largo.
  • **ChangeMessageVisibility**: cambiar el tiempo de visibilidad.
  • Las APIs **por lote** (SendMessageBatch, DeleteMessageBatch,
    ChangeMessageVisibilityBatch) ayudan a reducir costes.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el sondeo corto es preguntar en la recepción '¿hay un paquete para mí?' cada 5 segundos; el sondeo largo es quedarte esperando en recepción hasta 20 segundos hasta que llegue el paquete. Haces muchísimas menos preguntas y el paquete llega igual.\n\nLong polling = menos llamadas, más eficiencia: es la respuesta típica a preguntas de rendimiento con SQS. Y si el mensaje supera 256 KB, no lo fuerces por la cola: usa el cliente extendido (S3 + metadatos). Memoriza las llamadas básicas y los lotes para reducir costes.",
    codeSnippet: "// Afirmaciones sobre los conceptos avanzados de SQS",
    inputs: {},
    completeCode: "Long polling 1-20 s (WaitTimeSeconds) | >256 KB → cliente extendido + S3 | PurgeQueue, batch APIs, ChangeMessageVisibility",
    format: "true-false",
    trueFalse: {
      prompt: "Valida los conceptos de SQS que pide el examen de Certified Developer.",
      statements: [
        {
          id: "a",
          text: "El sondeo largo (long polling) reduce el número de llamadas a la API porque el consumidor espera a que lleguen mensajes.",
          answer: true,
          explanation: "En lugar de preguntar constantemente, el consumidor espera: menos llamadas, más eficiencia y menor latencia."
        },
        {
          id: "b",
          text: "El sondeo largo se configura con WaitTimeSeconds, entre 1 y 20 segundos, y es preferible al sondeo corto.",
          answer: true,
          explanation: "WaitTimeSeconds admite 1-20 s y el instructor recomienda siempre el sondeo largo."
        },
        {
          id: "c",
          text: "El sondeo largo puede esperar de forma indefinida si no llegan mensajes a la cola.",
          answer: false,
          explanation: "No es infinito: si no hay mensajes, la conexión se cierra automáticamente al llegar al máximo (20 s)."
        },
        {
          id: "d",
          text: "El cliente extendido de SQS permite enviar mensajes de más de 256 KB guardando el mensaje grande en S3.",
          answer: true,
          explanation: "Guarda el mensaje grande en S3 y envía por la cola un pequeño mensaje de metadatos con la referencia."
        },
        {
          id: "e",
          text: "PurgeQueue borra todos los mensajes de la cola de una sola vez.",
          answer: true,
          explanation: "PurgeQueue elimina todo lo que hay en la cola, a diferencia de DeleteQueue que borra la cola entera."
        },
        {
          id: "f",
          text: "Usar las APIs por lote (SendMessageBatch, DeleteMessageBatch) reduce los costes.",
          answer: true,
          explanation: "El instructor lo destaca: los lotes reducen el número de llamadas y por tanto el coste."
        }
      ]
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── COLAS FIFO ────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 9,
    title: "Colas FIFO: Orden y Exactly-Once",
    stars: 3,
    category: "FIFO",
    description:
      "FIFO significa First In First Out: el primer mensaje que entra es el primero que sale. Orden estricto, sin duplicados, pero con rendimiento limitado.",
    objective: "Conocer las garantías y límites de las colas FIFO",
    tags: ["FIFO", "orden", "exactly-once", "300 msg/s"],
    fileName: "sqs-fifo",
    completed: false,
    theory: `📚 TEORÍA: Colas FIFO

**FIFO = First In First Out**: el primer mensaje que entra es el primer
mensaje que sale. La cola da **orden** a los mensajes: el consumidor los
recibe en el mismo orden en que fueron enviados (1, 2, 3, 4...).

Garantías y límites (clave para el examen):
  • **Orden estricto**: los mensajes se procesan en orden por el consumidor.
  • **Exactly once**: la cola FIFO elimina duplicados dentro de su ventana.
  • **Rendimiento limitado**: ~**300 mensajes por segundo**, o **3000**
    usando procesamiento por lotes (batch).
  • El nombre de la cola **debe terminar en ".fifo"**.

Configuración al crearla:
  • **Deduplicación basada en contenido** (SHA-256 del cuerpo del mensaje).
  • **FIFO de alto rendimiento** para maximizar el throughput.
  • **Ámbito de duplicación**: por cola completa o por grupo de mensajes.

Al enviar un mensaje se indican:
  • **Message Group ID**: la etiqueta del grupo de mensajes.
  • **Message Deduplication ID**: el token usado para detectar duplicados
    dentro del intervalo de deduplicación.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la cola estándar es el servicio exprés de paquetes (cada paquete viaja como puede y puede llegar desordenado); la cola FIFO es la cinta transportadora de la fábrica: las cajas salen exactamente en el orden en que se pusieron y el control de calidad elimina copias repetidas.\n\nSi tu sistema exige orden estricto y procesar cada mensaje una sola vez (facturas, comandos financieros), la FIFO es la respuesta. Eso sí, el orden y la deduplicación cuestan rendimiento: 300 msg/s (3000 con batch) y el sufijo .fifo en el nombre, que el examen pregunta literalmente.",
    codeSnippet: "// Afirmaciones sobre las colas FIFO de SQS",
    inputs: {},
    completeCode: "FIFO = orden estricto + exactly-once | ~300 msg/s (3000 batch) | nombre termina en .fifo",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre las colas FIFO de SQS.",
      statements: [
        {
          id: "a",
          text: "FIFO significa First In First Out: los mensajes se consumen en el orden en que se envían.",
          answer: true,
          explanation: "El consumidor recibe el 1, el 2, el 3 y el 4 en ese orden, tal como se enviaron."
        },
        {
          id: "b",
          text: "Las colas FIFO eliminan duplicados dentro de una ventana y procesan los mensajes exactamente una vez.",
          answer: true,
          explanation: "Es su gran diferencia con la estándar: exactly-once gracias a la deduplicación."
        },
        {
          id: "c",
          text: "El rendimiento de una cola FIFO es limitado: unos 300 mensajes por segundo (3000 con batch).",
          answer: true,
          explanation: "El orden y la deduplicación cuestan: 300 msg/s sin batch y 3000 con procesamiento por lotes."
        },
        {
          id: "d",
          text: "El nombre de una cola FIFO debe terminar en .fifo.",
          answer: true,
          explanation: "SQS lo exige: sin el sufijo .fifo no se puede crear la cola FIFO."
        },
        {
          id: "e",
          text: "Las colas FIFO tienen el mismo rendimiento ilimitado que las colas estándar.",
          answer: false,
          explanation: "Al revés: la estándar es ilimitada y la FIFO tiene rendimiento limitado por su orden estricto."
        },
        {
          id: "f",
          text: "En una cola FIFO se usa un Message Group ID para agrupar mensajes relacionados.",
          answer: true,
          explanation: "El Message Group ID clasifica los mensajes; los del mismo grupo se procesan en orden."
        }
      ]
    }
  },

  {
    id: 10,
    title: "FIFO Avanzado: Deduplicación y Group IDs",
    stars: 3,
    category: "FIFO",
    description:
      "La deduplicación FIFO compara el cuerpo del mensaje (SHA-256) o usa tu Message Deduplication ID durante 5 minutos. El Message Group ID, por su parte, ordena y paraleliza.",
    objective: "Predecir el comportamiento de la deduplicación FIFO",
    tags: ["FIFO", "deduplicación", "SHA-256", "Message Group ID"],
    fileName: "sqs-fifo",
    completed: false,
    theory: `📚 TEORÍA: Colas FIFO Avanzado

**Deduplicación**: el intervalo de deduplicación es de **5 minutos** y hay
dos métodos:
  • **Basada en contenido**: SQS calcula el **SHA-256** del cuerpo del
    mensaje. Si llega un mensaje idéntico dentro del intervalo, se rechaza.
  • **ID de duplicación explícito**: el productor proporciona un
    **Message Deduplication ID**; enviar el mismo ID otra vez = duplicado.

**Agrupación de mensajes (Message Group ID)**:
  • Los mensajes con el **mismo Message Group ID** están **ordenados
    dentro del grupo** y los procesa **un solo consumidor**.
  • Con valores de group ID **diferentes**, cada grupo puede tener su
    consumidor: es **procesamiento paralelo**, pero **no se garantiza el
    orden entre grupos**.
  • Es el equivalente FIFO a la partition key de Kinesis.

En la demo, el instructor envía "Hello World" dos veces con deduplicación
basada en contenido: el segundo envío se rechaza porque el SHA-256 coincide.
Al cambiar el cuerpo a "Hello World v2", el mensaje entra.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la deduplicación es el lector de matrículas del parking: si tu coche (mensaje) entra dos veces por la misma puerta en 5 minutos, el sistema detecta que es el mismo y no lo deja pasar dos veces. El group ID, en cambio, son los carriles: cada grupo de mensajes tiene su carril (consumidor) y dentro de cada carril se respeta el orden, pero entre carriles no hay orden.\n\nComprende la diferencia: SHA-256 del cuerpo o ID explícito para evitar duplicados, y group ID para escalar con orden parcial. El examen mezcla estos dos conceptos en escenarios de pedidos o transacciones.",
    codeSnippet: `// Productor → cola SQS FIFO (deduplicación basada en contenido)

SendMessage: body = "Hello World", group = "demo", dedup = automático
SendMessage: body = "Hello World", group = "demo", dedup = automático
//         ^ ¿qué ocurre con este segundo envío?`,
    inputs: {},
    completeCode: "SHA-256 del cuerpo o MessageDeduplicationId → duplicado rechazado (ventana 5 min) | group ID → orden y paralelismo",
    format: "prediction",
    prediction: {
      prompt: "Envías dos veces exactamente el mismo mensaje 'Hello World' a una cola FIFO con deduplicación basada en contenido. ¿Qué ocurre con el segundo envío?",
      snippet: "SendMessage body='Hello World' (1º)\nSendMessage body='Hello World' (2º) → ???",
      options: [
        "Se rechaza: es un duplicado dentro de la ventana de 5 minutos (mismo SHA-256)",
        "Ambos mensajes se aceptan y se procesan en orden",
        "El segundo mensaje reemplaza al primero en la cola",
        "El segundo se acepta pero se envía al final de la cola"
      ],
      answer: "Se rechaza: es un duplicado dentro de la ventana de 5 minutos (mismo SHA-256)"
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── POLÍTICAS DE ACCESO ───────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 11,
    title: "Política de Acceso a Colas SQS",
    stars: 3,
    category: "POLÍTICAS",
    description:
      "Las políticas de acceso a una cola son políticas de recursos, muy similares a las de bucket S3. Sirven para acceso entre cuentas y para que otros servicios (S3, SNS) escriban en la cola.",
    objective: "Elegir la política correcta para que S3 escriba en una cola",
    tags: ["política", "S3", "SendMessage", "SourceArn"],
    fileName: "sqs-policy.json",
    completed: false,
    theory: `📚 TEORÍA: Políticas de Acceso a Colas SQS

Las políticas de acceso a una cola SQS se parecen mucho a las **políticas
de bucket S3**: son políticas de **recursos** que definen quién puede
actuar sobre la cola.

Dos casos de uso clásicos (los repasa el instructor):

  1. **Acceso cruzado entre cuentas**: una instancia EC2 de otra cuenta
     necesita sondear (ReceiveMessage) la cola. El **Principal** de la
     política es el identificador de la cuenta de la instancia y la acción
     permitida es recibir mensajes.

  2. **Notificaciones de eventos de S3 a la cola**: cada vez que se sube
     un objeto al bucket, S3 envía un mensaje a la cola. La política
     permite **sqs:SendMessage** sobre el recurso (la cola) y añade una
     **condición** con el **SourceArn** del bucket y el **SourceAccount**
     para limitar quién puede escribir.

En la demostración, el instructor crea una cola llamada "Event from S3",
copia la política de ejemplo de la documentación de AWS (SendMessage +
condition SourceArn/SourceAccount), crea el bucket, configura la
notificación de evento y comprueba que el mensaje de test llega a la cola.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la política de acceso es el portero del edificio con una lista de invitados. La lista correcta dice 'solo puede entrar el cartero del bloque 3 (SourceArn)'; la lista peligrosa dice 'puede entrar cualquiera' (Principal: *) y la lista equivocada solo deja salir a los vecinos (ReceiveMessage) pero no deja entrar al cartero.\n\nLa condición SourceArn/SourceAccount es el candado que falta en el anti-patrón: restringe qué bucket concreto puede escribir, evitando que cualquier cuenta llene tu cola. En el examen, si ves una política SQS sin condiciones apuntando a un recurso S3, es la respuesta sospechosa.",
    codeSnippet: `// Política A
{
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "s3.amazonaws.com" },
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3",
    "Condition": {
      "ArnLike": { "aws:SourceArn": "arn:aws:s3:::bucket-eventos" },
      "StringEquals": { "aws:SourceAccount": "123456789012" }
    }
  }]
}

// Política B
{
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3"
  }]
}

// Política C
{
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
    "Action": "sqs:ReceiveMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3"
  }]
}`,
    inputs: {},
    completeCode: "Principal s3.amazonaws.com + SendMessage + Condition SourceArn/SourceAccount = política correcta",
    format: "snippet-pick",
    snippetPick: {
      prompt: "¿Cuál es la política correcta para que tu bucket S3 'bucket-eventos' envíe notificaciones a la cola 'eventos-s3'?",
      snippets: [
        {
          id: "a",
          label: "Política A",
          code: `{
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "s3.amazonaws.com" },
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3",
    "Condition": {
      "ArnLike": { "aws:SourceArn": "arn:aws:s3:::bucket-eventos" },
      "StringEquals": { "aws:SourceAccount": "123456789012" }
    }
  }]
}`,
          description: "Permite al servicio S3 escribir y restringe al bucket exacto mediante la condición."
        },
        {
          id: "b",
          label: "Política B",
          code: `{
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3"
  }]
}`,
          description: "Anti-patrón: cualquier cuenta puede enviar mensajes a tu cola sin condiciones."
        },
        {
          id: "c",
          label: "Política C",
          code: `{
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
    "Action": "sqs:ReceiveMessage",
    "Resource": "arn:aws:sqs:us-east-1:123456789012:eventos-s3"
  }]
}`,
          description: "Solo permite recibir mensajes al propietario: S3 no podría escribir en la cola."
        }
      ],
      correct: 0
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── SNS ────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 12,
    title: "Amazon SNS: Publicar y Suscribir",
    stars: 1,
    category: "SNS",
    description:
      "¿Enviar un mensaje a muchos destinatarios? SNS es el servicio de publicación-subscripción: el productor publica en un topic y este distribuye a los suscriptores.",
    objective: "Entender topics, suscriptores y garantías de SNS",
    tags: ["SNS", "pub/sub", "topics", "suscriptores"],
    fileName: "sns-topic",
    completed: false,
    theory: `📚 TEORÍA: Amazon SNS (Simple Notification Service)

Si queremos enviar un mensaje a **muchos destinatarios**, la integración
directa con cada uno es un caos. La solución del instructor: un sistema de
**publicación-subscripción** con un **topic**.

  • **Productor de eventos**: publica mensajes en el topic (solo al topic,
    no a los destinatarios).
  • **Suscriptores**: todos los que escuchan las notificaciones del topic.
    Pueden ser **emails, SMS, endpoints HTTP/HTTPS, colas SQS, funciones
    Lambda**, etc.
  • **Cada suscriptor recibe todos los mensajes**, salvo que se aplique una
    **política de filtrado** (políticas JSON por suscriptor).

Límites que hay que saber:
  • Hasta **12,5 millones de suscriptores** por tema.
  • Hasta **100.000 topics**.

Datos importantes:
  • **SNS no conserva los mensajes**: si un suscriptor no puede recibirlos,
    se pierden. Por eso se integra con SQS (fan-out) para persistir.
  • Muchos servicios AWS publican en SNS (CloudWatch alarms, ASG,
    CloudFormation, budgets, S3, RDS, DynamoDB...).

Publicar:
  • Por **SDK**: CreateTopic → CreateSubscription → Publish.
  • **Publicación directa** para apps móviles: platform endpoints (GCM,
    APNS, Amazon ADM).

Seguridad: cifrado en vuelo, en reposo con KMS y políticas de acceso
similares a las de S3 y SQS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: SNS es la emisora de radio: el locutor (productor) solo habla al micrófono (topic) y todos los que tienen la radio sintonizada (suscriptores) reciben el mismo mensaje a la vez. Si un oyente no tiene la radio encendida, se pierde la noticia: SNS no la guarda para él.\n\nEsa última parte es clave para el examen: SNS entrega pero no persiste. Si necesitas que nadie pierda el mensaje, suscribes una cola SQS al topic (fan-out) y ahí los datos quedan guardados. Además, cada suscriptor puede filtrar qué mensajes le interesan.",
    codeSnippet: "// Afirmaciones sobre Amazon SNS",
    inputs: {},
    completeCode: "SNS = pub/sub con topics | suscriptores: email, SMS, HTTP, SQS, Lambda | 12,5M suscriptores, 100k topics | sin persistencia",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de Amazon SNS.",
      statements: [
        {
          id: "a",
          text: "SNS es un servicio de publicación-subscripción: el productor publica en un topic y este distribuye a los suscriptores.",
          answer: true,
          explanation: "El productor solo envía al topic; el topic se encarga de distribuir a todos los suscriptores."
        },
        {
          id: "b",
          text: "Los suscriptores de un topic pueden ser emails, SMS, endpoints HTTP/HTTPS, colas SQS o funciones Lambda.",
          answer: true,
          explanation: "SNS soporta muchos tipos de suscriptores: esa versatilidad es su gran ventaja."
        },
        {
          id: "c",
          text: "Cada suscriptor recibe todos los mensajes del topic, salvo que exista una política de filtrado.",
          answer: true,
          explanation: "Por defecto todos reciben todo; con políticas JSON de filtrado un suscriptor puede recibir solo lo relevante."
        },
        {
          id: "d",
          text: "Un topic SNS admite hasta 12,5 millones de suscriptores y 100.000 topics.",
          answer: true,
          explanation: "Son los límites que menciona el instructor: una barbaridad de suscriptores por tema."
        },
        {
          id: "e",
          text: "SNS conserva los mensajes en el topic si un suscriptor no puede recibirlos.",
          answer: false,
          explanation: "SNS no conserva datos: si no se entregan, se pierden. Por eso se integra con SQS para persistir."
        },
        {
          id: "f",
          text: "Los topics SNS FIFO solo pueden tener colas SQS FIFO como suscriptores.",
          answer: true,
          explanation: "Si necesitas fan-out con orden y deduplicación, SNS FIFO solo admite colas SQS FIFO."
        }
      ]
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── PATRÓN FAN OUT ────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 13,
    title: "Patrón Fan Out: SNS → SQS",
    stars: 2,
    category: "SNS",
    description:
      "Quieres enviar un evento a varias colas SQS. En lugar de publicar a cada una (frágil), publicas una vez en el topic SNS y todas las colas suscritas reciben el mensaje.",
    objective: "Montar el patrón fan-out SNS → SQS paso a paso",
    tags: ["SNS", "SQS", "fan out", "desacoplar"],
    fileName: "fan-out",
    completed: false,
    theory: `📚 TEORÍA: El Patrón Fan Out SNS → SQS

Queremos enviar el mismo mensaje a **múltiples colas SQS**. Si lo
enviásemos individualmente a cada cola, podrían surgir problemas: la app
se bloquea en medio, la entrega falla, o añadimos más colas al camino.

La solución es el **patrón Fan Out** con SNS + SQS:
  • Se hace **push una sola vez** de un mensaje al **topic SNS**.
  • Todos los subscriptores que sean colas SQS reciben ese mensaje.
  • Ejemplo del instructor: un servicio de compras publica en un topic y
    las colas del servicio antifraude y del servicio de envío reciben copia.

Ventajas:
  • Modelo totalmente **desacoplado** y **sin pérdida de datos**: SQS da
    persistencia, procesamiento diferido y reintentos.
  • Puedes **añadir más colas SQS como suscriptores** con el tiempo sin
    tocar el productor.
  • Requiere que la **política de acceso de la cola SQS** permita que el
    topic SNS escriba en ella (sqs:SendMessage).

Extra: las reglas de eventos S3 solo permiten **una combinación** de tipo
de evento + prefijo. Para enviar el mismo evento S3 a varias colas, se
reenvía al topic SNS y de ahí a todas las colas (fan-out). Si necesitas
fan-out + orden + deduplicación, usa **SNS FIFO + colas SQS FIFO**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: fan-out es la rueda de prensa: el portavoz (SNS) anuncia una vez y todos los periodistas (colas SQS) reciben la misma noticia. Si en vez de eso tuvieras que llamar a cada periódico por separado, con la mitad de la agenda (la app se cae) te quedas sin repartir la noticia.\n\nPublicar una vez en el topic evita entregas frágiles y permite añadir suscriptores sin tocar el productor. SQS añade la red de seguridad que SNS no tiene: persistencia y reintentos. El único requisito es que la política de acceso de cada cola permita al topic escribir.",
    codeSnippet: "// Ordena los pasos para implementar el patrón Fan Out SNS → SQS",
    inputs: {},
    completeCode: "Topic SNS → suscribir colas SQS → política de acceso (SendMessage) → publicar una vez → cada cola recibe copia",
    format: "ordering",
    ordering: {
      prompt: "Ordena los pasos para implementar el patrón Fan Out SNS → SQS.",
      steps: [
        { id: "create-topic", label: "Crear el topic SNS que recibirá el evento" },
        { id: "create-queues", label: "Crear las colas SQS que consumirán el evento" },
        { id: "subscribe-queues", label: "Suscribir cada cola SQS al topic SNS" },
        { id: "queue-policy", label: "Configurar la política de acceso de cada cola para que el topic pueda escribir" },
        { id: "publish", label: "Publicar un único mensaje en el topic" },
        { id: "receive-copies", label: "Cada cola SQS recibe su propia copia del mensaje (push de SNS)" },
      ],
      correctOrder: ["create-topic", "create-queues", "subscribe-queues", "queue-policy", "publish", "receive-copies"],
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── KINESIS ───────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 14,
    title: "Kinesis Data Streams: Shards y Retención",
    stars: 2,
    category: "KINESIS",
    description:
      "Kinesis facilita la recopilación, el procesamiento y el análisis de datos en tiempo real. Los streams se componen de shards: cada uno aporta capacidad y orden.",
    objective: "Conocer shards, retención, inmutabilidad y KCL",
    tags: ["Kinesis", "shards", "retención", "KCL"],
    fileName: "kinesis-stream",
    completed: false,
    theory: `📚 TEORÍA: Kinesis y los Streams de Datos

Kinesis facilita la **recopilación, el procesamiento y el análisis de
datos en tiempo real** (logs, métricas, flujos de clics, telemetría IoT).

Tiene 4 componentes:
  • **Kinesis Data Streams**: captura, procesamiento y almacenamiento de
    flujos de datos.
  • **Kinesis Data Firehose**: carga de flujos en almacenes de datos.
  • **Kinesis Data Analytics**: análisis de flujos con SQL o Apache Flink.
  • **Kinesis Video Streams**: captura de flujos de vídeo (no entra en el
    examen).

**Data Streams**:
  • Se compone de **múltiples shards (fragmentos) numerados**; el número
    se **prevé con antelación** (ej. quiero un flujo con 6 shards).
  • Los shards definen la **capacidad**: cada shard recibe **1 MB/s o
    1000 registros/s** de entrada.
  • **Retención**: por defecto **24 horas**, ampliable hasta **365 días**.
  • **Inmutabilidad**: una vez escritos, los datos no se pueden borrar;
    solo caducan (se puede hacer replay).
  • **Registro**: partition key + data blob (hasta **1 MB**).
  • Mensajes con la misma **partition key** van al mismo shard (orden por
    clave).

**KCL (Kinesis Client Library)**: biblioteca Java para leer registros con
aplicaciones distribuidas. **Cada shard debe ser leído por una instancia
de KCL**: con 4 shards, máximo 4 instancias de KCL. El **progreso de
lectura se marca en DynamoDB** y, si una instancia cae, otra retoma desde
donde se quedó.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Kinesis es la cinta transportadora de equipajes del aeropuerto, dividida en carriles (shards). Cada maleta (registro) elige carril según su etiqueta (partition key) y siempre usa el mismo. Las maletas se pueden ver en el carril durante 24 horas (retención), pero nadie puede romper una maleta una vez puesta: es inmutable.\n\nLos shards son el corazón del diseño: más shards = más capacidad y más coste. La retención de 24h a 365 días permite reprocesar datos, algo que SQS no ofrece. Y con KCL, cada shard lo gestiona una instancia y DynamoDB guarda el progreso para no perder el punto de lectura.",
    codeSnippet: "// Afirmaciones sobre Kinesis Data Streams",
    inputs: {},
    completeCode: "Stream = N shards | 1 MB/s y 1000 registros/s por shard | retención 24h→365d | inmutable | KCL: 1 instancia por shard",
    format: "true-false",
    trueFalse: {
      prompt: "Valida qué sabes sobre Kinesis Data Streams.",
      statements: [
        {
          id: "a",
          text: "Un data stream de Kinesis se compone de múltiples shards, cuyo número se debe prever con antelación.",
          answer: true,
          explanation: "El instructor lo destaca: cuando creas el stream, decides cuántos shards quieres y la capacidad depende de ellos."
        },
        {
          id: "b",
          text: "La retención por defecto de un stream es de 24 horas y puede ampliarse hasta 365 días.",
          answer: true,
          explanation: "La retención va de 1 a 365 días; el valor por defecto es 24 horas."
        },
        {
          id: "c",
          text: "Los datos escritos en Kinesis Data Streams son inmutables: no se pueden borrar, solo caducan.",
          answer: true,
          explanation: "Es la propiedad de inmutabilidad: una vez en el stream, los datos no se eliminan, expiran."
        },
        {
          id: "d",
          text: "Los registros con la misma partition key siempre van al mismo shard.",
          answer: true,
          explanation: "La clave de partición decide el shard mediante un hash: misma clave, mismo shard, orden garantizado ahí."
        },
        {
          id: "e",
          text: "Con KCL, cada shard lo lee una instancia: si hay 4 shards, hasta 4 instancias de KCL.",
          answer: true,
          explanation: "KCL asigna un shard por instancia y registra el progreso en DynamoDB."
        },
        {
          id: "f",
          text: "Kinesis Data Firehose permite reproducir (replay) los datos que ya han pasado por él.",
          answer: false,
          explanation: "Firehose no tiene fuente de almacenamiento: no soporta replay. Eso es exclusivo de Data Streams."
        }
      ]
    }
  },

  {
    id: 15,
    title: "Kinesis: Productores y Consumidores",
    stars: 3,
    category: "KINESIS",
    description:
      "Los productores envían registros con PutRecord y una partition key decide el shard. Los consumidores leen con GetRecords: clásico (2 MB/s compartidos) o Enhanced Fan-Out (2 MB/s por consumidor).",
    objective: "Entender PutRecord, partition key y los modos de consumo",
    tags: ["PutRecord", "partition key", "Enhanced Fan-Out", "GetRecords"],
    fileName: "kinesis-producers",
    completed: false,
    theory: `📚 TEORÍA: Productores y Consumidores de Kinesis

**Productores** (envían datos al stream):
  • **SDK** (productor simple), **Kinesis Producer Library (KPL)** con
    batching, compresión y reintentos, o **Kinesis Agent** para monitorear
    archivos de log y transmitirlos.
  • La API de envío es **PutRecord** (PutRecords en lote reduce costes).
  • Cada registro: número de secuencia (único por clave en el shard),
    **partition key** y data blob (hasta **1 MB**).
  • La **partition key** pasa por una función hash que decide el **shard**:
    todos los datos con la misma clave van al mismo shard.
  • Cuidado con el **shard activo (hot shard)**: si una clave envía mucho
    más que las demás, desequilibra el stream. La clave debe estar **bien
    distribuida** (ej. user ID, no 'Chrome'/'Firefox').
  • Ante errores de rendimiento (ProvisionedThroughputExceeded): distribuir
    mejor la clave, usar **backoff exponencial** o **aumentar shards**.

**Consumidores** (lean del stream):
  • Pueden ser Lambda, Data Analytics, Firehose o un consumidor personalizado
    con el SDK (dos modos):
    - **Clásico (fan-out compartido)**: **2 MB/s por shard compartido**
      entre todos los consumidores, máx 5 llamadas GetRecords/s, latencia
      ~200 ms, es el más barato.
    - **Enhanced Fan-Out**: **2 MB/s por shard y por consumidor**, latencia
      ~70 ms, entrega por HTTP/2, más caro, hasta 5 apps consumidoras
      (límite ampliable).
  • **GetRecords** devuelve hasta 10 MB o 10.000 registros.
  • Lambda como consumidor: usa GetRecords de los shards, puede enviar a
    DynamoDB y **reintenta hasta que tenga éxito o los datos caduquen**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la partition key es la puerta de embarque del aeropuerto que te asigna el hash del pasaporte: siempre entras por la misma puerta (shard). Si una puerta se llena (hot shard), la fila avanza lento; por eso conviene repartir bien los pasajeros.\n\nElegir bien la clave de partición es la diferencia entre un stream equilibrado y un shard saturado. Y al consumir, decide: clásico si quieres ahorrar coste y te vale 200 ms de latencia; Enhanced Fan-Out si varias aplicaciones necesitan leer el mismo shard a toda velocidad (70 ms, pero cada una paga sus 2 MB/s).",
    codeSnippet: `# Productor: enviar la posición de un camión a Kinesis
aws kinesis put-record \\
  --stream-name posiciones-gps \\
  --partition-key truck-1 \\
  --data "lat:40.41,lon:-3.70"

# ¿A qué shard irá este registro?`,
    inputs: {},
    completeCode: "PutRecord + partition key (hash) → mismo shard | GetRecords: clásico 2 MB/s compartidos vs Enhanced Fan-Out 2 MB/s por consumidor",
    format: "prediction",
    prediction: {
      prompt: "Envías a Kinesis la posición GPS de truck-1 con --partition-key truck-1 en un stream de 6 shards. ¿A qué shard irá el registro?",
      snippet: "aws kinesis put-record --stream-name posiciones-gps --partition-key truck-1 --data \"lat:40.41,lon:-3.70\"",
      options: [
        "Al mismo shard de siempre: la partition key pasa por un hash y decide el shard",
        "A un shard aleatorio en cada envío para balancear la carga",
        "A todos los shards a la vez (broadcast)",
        "La partition key no influye: el SDK elige el shard con menos carga"
      ],
      answer: "Al mismo shard de siempre: la partition key pasa por un hash y decide el shard"
    }
  },

  {
    id: 16,
    title: "Kinesis Firehose y Data Analytics",
    stars: 2,
    category: "KINESIS",
    description:
      "Los 4 componentes de Kinesis hacen cosas distintas: almacenar flujos, cargarlos en destinos, analizarlos en tiempo real o capturar vídeo.",
    objective: "Distinguir los componentes de Kinesis y sus casos de uso",
    tags: ["Firehose", "Data Analytics", "casi tiempo real", "S3"],
    fileName: "kinesis-firehose",
    completed: false,
    theory: `📚 TEORÍA: Kinesis Data Firehose y Data Analytics

**Kinesis Data Firehose**:
  • Toma datos de los productores (SDK, KPL, Kinesis Agent e incluso
    **Kinesis Data Streams**) y los escribe en destinos **sin escribir
    código**.
  • Destinos de AWS: **S3, Redshift, OpenSearch (ElasticSearch)**.
  • Destinos de terceros: Datadog, Splunk, New Relic, MongoDB.
  • Destinos personalizados: endpoints HTTP.
  • Opcionalmente transforma los datos con una **función Lambda**.
  • **Casi en tiempo real** (palabra clave del examen): escribe por lotes,
    mínimo **60 segundos de latencia** o 1 MB de datos.
  • Totalmente gestionado, escalado automático, serverless; pagas solo por
    los datos que pasan.
  • Puede enviar a un bucket S3 de backup **todos los datos** o solo los
    **fallidos**.
  • **No soporta replay**: a diferencia de Data Streams, no puedes volver
    a leer los datos que ya pasaron.

**Kinesis Data Analytics**:
  • Analiza flujos en tiempo real con **SQL** o con **Apache Flink**.
  • Fuentes: **Kinesis Data Streams** o **Kinesis Data Firehose**.
  • Puede **enriquecer** los datos con datos de referencia de **S3**.
  • Salidas: a Data Streams (procesamiento en tiempo real con Lambda/EC2)
    o a Firehose (destinos como S3, Redshift, OpenSearch).
  • Casos de uso: análisis de series temporales, dashboards y métricas en
    tiempo real.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Firehose es la empresa de mudanzas que recoge tus cajas (datos) y las lleva a un almacén (S3, Redshift...) sin que tú alquiles furgonetas ni contrates personal. Pero no es instantáneo: la furgoneta sale como mínimo cada 60 segundos o cuando está llena (1 MB). Data Analytics, en cambio, es el contable que mira las cajas mientras se descargan y calcula totales al vuelo con SQL.\n\nLa diferencia estrella del examen: Data Streams es en tiempo real, se gestiona y tiene replay; Firehose es 'casi' en tiempo real, automático, sin servidores y sin replay. Data Analytics lee de los dos y analiza al vuelo.",
    codeSnippet: "# Empareja cada componente de Kinesis con su función",
    inputs: {},
    completeCode: "Data Streams (ingesta/replay) | Firehose (carga casi real, sin replay) | Data Analytics (SQL/Flink) | Video Streams (vídeo)",
    format: "matching",
    matching: {
      prompt: "Conecta cada componente de Kinesis con la descripción que le corresponde.",
      definitions: [
        "Captura, procesamiento y almacenamiento de flujos de vídeo (no aparece en el examen).",
        "Carga de flujos a S3, Redshift u OpenSearch casi en tiempo real (latencia mínima ~60 s), totalmente gestionado y sin replay.",
        "Análisis de flujos de datos en tiempo real con SQL o Apache Flink; puede enriquecer los datos con referencias de S3.",
        "Ingesta y almacenamiento de flujos de datos en tiempo real con shards; retención de 1 a 365 días y posibilidad de replay.",
      ],
      pairs: [
        { id: "data-streams", term: "Kinesis Data Streams", definition: "Ingesta y almacenamiento de flujos de datos en tiempo real con shards; retención de 1 a 365 días y posibilidad de replay." },
        { id: "firehose", term: "Kinesis Data Firehose", definition: "Carga de flujos a S3, Redshift u OpenSearch casi en tiempo real (latencia mínima ~60 s), totalmente gestionado y sin replay." },
        { id: "analytics", term: "Kinesis Data Analytics", definition: "Análisis de flujos de datos en tiempo real con SQL o Apache Flink; puede enriquecer los datos con referencias de S3." },
        { id: "video-streams", term: "Kinesis Video Streams", definition: "Captura, procesamiento y almacenamiento de flujos de vídeo (no aparece en el examen)." },
      ]
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── ORDENACIÓN ─────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 17,
    title: "Ordenación: Kinesis por Shard vs SQS FIFO por Grupo",
    stars: 3,
    category: "ORDENACIÓN",
    description:
      "Tienes 100 camiones enviando su posición GPS y quieres consumirlos en orden por camión. La clave de partición (TruckId) manda en Kinesis; el group ID, en SQS FIFO.",
    objective: "Aplicar la clave de ordenación correcta en Kinesis y SQS FIFO",
    tags: ["ordenación", "partition key", "group ID", "shard"],
    fileName: "ordenacion",
    completed: false,
    theory: `📚 TEORÍA: Ordenación de Datos — Kinesis vs SQS FIFO

El escenario del instructor: **100 camiones** envían su posición GPS de
forma regular y queremos seguir el movimiento de cada camión **en orden**.

**En Kinesis**:
  • Usa como **partition key el TruckId (ID del camión)**.
  • La misma clave siempre cae en el **mismo shard**, y dentro de cada
    shard los datos están **ordenados**.
  • Con 5 shards: 100 camiones / 5 = 20 camiones por shard, ordenados.
  • El **número máximo de consumidores en paralelo** es el número de
    shards (5). Kinesis **ordena a nivel de shard**, no de forma global.

**En SQS**:
  • La cola **estándar no tiene ordenación**.
  • Con **SQS FIFO sin group ID**: los mensajes se consumen en orden con
    **un solo consumidor**.
  • Con **group IDs** (el equivalente a la partition key): cada grupo se
    ordena internamente y pueden consumirlo **consumidores paralelos**,
    aunque **no se garantiza el orden entre grupos**.
  • Con 100 camiones = 100 group IDs: hasta **100 consumidores** en
    paralelo, con **300 mensajes/s** (3000 con batch).`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la fábrica de botellas con etiquetas de color: cada color (clave) tiene su cinta y dentro de cada cinta las botellas llegan en el mismo orden en que se llenaron. Mezclarlas todas en una sola cinta las desordenaría.\n\nKinesis y SQS FIFO comparten la misma idea con nombres distintos: la partition key (Kinesis) y el group ID (SQS FIFO) agrupan datos relacionados para mantener el orden dentro del grupo y permitir paralelismo entre grupos. En el examen, 'orden por entidad' (por camión, por usuario, por pedido) → esa clave.",
    codeSnippet: `// 100 camiones envían su GPS a AWS

// Opción 1: Kinesis Data Streams con 5 shards
partition-key = TruckId  → cada camión siempre al mismo shard

// Opción 2: cola SQS FIFO
MessageGroupId = TruckId → cada camión es un grupo ordenado`,
    inputs: {},
    completeCode: "Kinesis: partition key → mismo shard (orden por shard) | SQS FIFO: group ID → orden dentro del grupo, paralelo entre grupos",
    format: "prediction",
    prediction: {
      prompt: "Quieres consumir la posición GPS de cada camión en orden. ¿Cómo debes enviar los datos a Kinesis?",
      snippet: "100 camiones envían su GPS a un stream de Kinesis con 5 shards",
      options: [
        "Usar partition-key = TruckId: cada camión siempre cae en el mismo shard y allí se ordena",
        "Usar una única clave para todos: un solo shard ordena los 100 camiones",
        "No importa: Kinesis ordena todos los registros del stream de forma global",
        "Usar una cola SQS estándar, que ordena los mensajes por defecto"
      ],
      answer: "Usar partition-key = TruckId: cada camión siempre cae en el mismo shard y allí se ordena"
    }
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ─── COMPARATIVA Y EVENTBRIDGE ──────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 18,
    title: "SQS vs SNS vs Kinesis vs EventBridge",
    stars: 3,
    category: "COMPARATIVA",
    description:
      "Cuatro servicios de integración con personalidades muy distintas. Saber cuál usar en cada escenario es una pregunta recurrente del DVA-C02.",
    objective: "Elegir el servicio de integración correcto según el caso de uso",
    tags: ["SQS", "SNS", "Kinesis", "EventBridge"],
    fileName: "comparativa",
    completed: false,
    theory: `📚 TEORÍA: SQS vs SNS vs Kinesis (+ EventBridge)

El instructor resume las diferencias esenciales:

**SQS (cola)**:
  • Los consumidores **tiran de los datos** (polling) y los **borran**
    tras procesarlos.
  • Tantos workers como quieras, sin aprovisionar rendimiento.
  • Ordenación solo con colas **FIFO**.
  • Retardo de mensajes individual.

**SNS (pub/sub)**:
  • Envía datos a **muchos suscriptores** (12,5M por tema, 100k temas).
  • **No conserva los datos**: si no se entregan, se pierden (por eso se
    integra con SQS en fan-out).
  • Sin aprovisionar throughput; se integra con SQS para persistir.
  • Topics **FIFO** solo integrables con colas SQS FIFO.

**Kinesis (flujo en tiempo real)**:
  • Pensado para **big data en tiempo real** y ETL.
  • Ordenación a nivel de **shard** y **replay** de datos.
  • Modos de capacidad: **aprovisionado** o **bajo demanda**.
  • Los datos caducan a los X días (retención).

**EventBridge (bus de eventos)**:
  • Antes llamado **CloudWatch Events**; ahora siempre EventBridge.
  • **Programa trabajos** (cron: cada hora, cada lunes a las 08:00...)
    o **reacciona a patrones de eventos** de servicios AWS (instancia EC2
    que se para, login del usuario root, fallo de CodeBuild, objeto S3,
    llamadas de CloudTrail...).
  • Flujo: **fuente de eventos → regla (con filtro opcional) → destino**.
  • Destinos: Lambda, SNS, SQS, Kinesis Data Streams, Step Functions,
    CodePipeline, Batch, tareas ECS...
  • **Buses**: por defecto, de socios (SaaS como Datadog o Salesforce) y
    personalizados. Admite **políticas basadas en recursos** (multicuenta),
    **archivo y replay** de eventos y **Schema Registry** para generar
    código con el esquema esperado.`,
    explanationText:
      "🌍 Ejemplo cotidiano: SQS es el buzón personal (tú vas a por las cartas), SNS es la megafonía del centro comercial (anuncia a todos a la vez, pero si no estás escuchando te lo pierdes), Kinesis es la cinta de vídeo del CCTV (graba todo en orden y puedes rebobinar) y EventBridge es el asistente que reacciona a lo que pasa: 'cuando se apague la luz del pasillo (evento), envíame un aviso'.\n\nRegla rápida del examen: desacoplar con polling → SQS; enviar el mismo evento a muchos destinos → SNS (fan-out); flujo continuo de big data con replay → Kinesis; reaccionar a eventos de servicios o programar tareas → EventBridge.",
    codeSnippet: "# Empareja cada servicio de integración con su caso de uso",
    inputs: {},
    completeCode: "SQS = cola (polling, borra al procesar) | SNS = fan-out (sin persistencia) | Kinesis = flujo real con replay | EventBridge = eventos de servicios + cron",
    format: "matching",
    matching: {
      prompt: "Conecta cada servicio con el caso de uso que le corresponde.",
      definitions: [
        "Bus de eventos: reacciona a patrones de eventos de servicios AWS (instancia EC2 parada, login root, objeto S3) y a schedules con cron; envía a Lambda, SNS, SQS o Step Functions.",
        "Cola de mensajes: los consumidores hacen polling, procesan el mensaje y lo borran de la cola; ideal para desacoplar aplicaciones.",
        "Flujo de big data en tiempo real: ingesta con shards, ordenación por clave de partición, replay y retención de días; pensado para analítica y ETL.",
        "Publicación-subscripción: un mensaje se publica en un topic y se distribuye a muchos suscriptores (email, SMS, HTTP, colas SQS o Lambda) con el patrón fan-out.",
      ],
      pairs: [
        { id: "sqs", term: "SQS", definition: "Cola de mensajes: los consumidores hacen polling, procesan el mensaje y lo borran de la cola; ideal para desacoplar aplicaciones." },
        { id: "sns", term: "SNS", definition: "Publicación-subscripción: un mensaje se publica en un topic y se distribuye a muchos suscriptores (email, SMS, HTTP, colas SQS o Lambda) con el patrón fan-out." },
        { id: "kinesis", term: "Kinesis", definition: "Flujo de big data en tiempo real: ingesta con shards, ordenación por clave de partición, replay y retención de días; pensado para analítica y ETL." },
        { id: "eventbridge", term: "EventBridge", definition: "Bus de eventos: reacciona a patrones de eventos de servicios AWS (instancia EC2 parada, login root, objeto S3) y a schedules con cron; envía a Lambda, SNS, SQS o Step Functions." },
      ]
    }
  },
];
