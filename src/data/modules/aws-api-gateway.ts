import type { Exercise } from "@/lib/types";

/** Ruta progresiva: AWS API Gateway (DVA-C02, sección 23), de la puerta de entrada a la arquitectura serverless completa. */
export const AWS_API_GATEWAY_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // FUNDAMENTOS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "La Puerta de Entrada de tu API",
    stars: 1,
    category: "FUNDAMENTOS",
    description:
      "API Gateway es el servicio que conecta a los clientes con tu backend sin servidor. Valida qué es, qué protocolos soporta y qué endpoints existen.",
    objective: "Distinguir el rol de API Gateway y sus tipos de endpoint",
    tags: ["API Gateway", "proxy", "endpoints", "serverless"],
    fileName: "api-gateway",
    completed: false,
    theory: `📚 TEORÍA: ¿Qué es API Gateway?

Imagina una función Lambda conectada a DynamoDB haciendo operaciones CRUD
(Create, Read, Update, Delete). Que los clientes se conecten DIRECTAMENTE a
Lambda no es buena idea: necesitas un REST API que haga de intermediario.

  • API Gateway crea una API sin servidor (sin infraestructura que administrar).
  • Las peticiones del cliente van al API y este las reenvía al backend
    mediante solicitudes **proxy** (Lambda, HTTP o servicios de AWS).
  • Soporta el protocolo **WebSocket** (comunicación bidireccional).
  • Gestiona versiones (v1, v2...), entornos (dev, testing, prod), seguridad
    (autenticación/autorización), **API keys**, limitación de solicitudes,
    caché de respuestas y generación de SDK.
  • Se integra con Swagger/OpenAPI para importar y documentar la API.

Tipos de endpoint:
  • **Edge-optimized** (por defecto): enfocado a clientes globales, enruta
    por las ubicaciones de CloudFront Edge (mejor latencia). El certificado
    debe estar en us-east-1.
  • **Regional**: para clientes de la misma región; se combina manualmente
    con CloudFront. Certificado en la misma región que API Gateway.
  • **Privado**: solo accesible desde tu VPC mediante un VPC endpoint (ENI).`,
    explanationText:
      "🌍 Ejemplo cotidiano: API Gateway es la recepción de un edificio de oficinas. El cliente no entra a buscar al empleado (Lambda) por su cuenta: llega a recepción, se anuncia, y recepción lo acompaña. Si la recepción no existiera, cada visitante tendría que llamar directamente al escritorio de cada empleado, algo imposible de organizar.\n\nEl proxy es la clave: API Gateway recibe la petición y la reenvía al backend final. Por eso puedes exponer Lambda, HTTP o cualquier servicio AWS (por ejemplo iniciar Step Functions o enviar a SQS) sin cambiar la experiencia del cliente. En el examen, 'clientes conectados directamente a Lambda' es siempre una opción incorrecta.",
    codeSnippet: "// Afirmaciones sobre el rol de API Gateway en una arquitectura serverless",
    inputs: {},
    completeCode:
      "API Gateway = front door gestionada | proxy hacia Lambda/HTTP/AWS | REST + HTTP + WebSocket | edge-optimized / regional / privado",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión del rol de API Gateway.",
      statements: [
        {
          id: "a",
          text: "API Gateway es un servicio gestionado que actúa como puerta de entrada (front door) entre los clientes y un backend, como Lambda, endpoints HTTP o servicios de AWS.",
          answer: true,
          explanation:
            "Correcto: su función principal es exponer y proteger el acceso al backend sin que el cliente se integre directamente con él.",
        },
        {
          id: "b",
          text: "Para exponer una función Lambda a clientes externos, lo ideal es que cada cliente se conecte directamente a Lambda, ya que API Gateway solo añade latencia.",
          answer: false,
          explanation:
            "Falso: conectar clientes directamente a Lambda es justo lo que hay que evitar; API Gateway aporta el REST API, la seguridad, la limitación y el proxy.",
        },
        {
          id: "c",
          text: "API Gateway solo soporta APIs REST: no funciona con el protocolo WebSocket.",
          answer: false,
          explanation:
            "Falso: API Gateway también soporta APIs de tipo HTTP y WebSocket (comunicación bidireccional).",
        },
        {
          id: "d",
          text: "Un endpoint edge-optimized (el que viene por defecto) enruta las solicitudes a través de las ubicaciones de CloudFront Edge, lo que mejora la latencia para clientes globales.",
          answer: true,
          explanation:
            "Correcto: es el endpoint por defecto y usa la red de edge de CloudFront; API Gateway sigue viviendo en una sola región.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // DESPLIEGUE
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Desplegar para que los Cambios Tengan Efecto",
    stars: 1,
    category: "DESPLIEGUE",
    description:
      "Uno de los errores más habituales con API Gateway: modificar la API en la consola y creer que ya está publicado. No es así: hay que desplegar.",
    objective: "Comprender etapas, despliegue y variables de etapa",
    tags: ["stages", "deploy", "variables de etapa", "historial"],
    fileName: "stages",
    completed: false,
    theory: `📚 TEORÍA: Etapas y despliegue

Cuando haces cambios en API Gateway, esos cambios NO se aplican por sí solos:
debes realizar un **despliegue** para que tengan efecto. Es una confusión muy
común que el instructor subraya.

  • Los cambios se despliegan en **etapas**: puedes crear tantas como quieras
    (dev, testing, prod...) y cada etapa tiene sus propios parámetros
    independientes de las demás.
  • API Gateway guarda un **historial de despliegues**: puedes volver hacia
    atrás a versiones anteriores.
  • Las **variables de etapa** son como variables de entorno de API Gateway:
    sirven para cambiar valores de configuración que varían, por ejemplo el
    ARN de una función Lambda, un endpoint HTTP o una plantilla de mapeo.
  • Se conectan con los **alias de Lambda**: una variable de etapa indica el
    alias (dev, test, prod) y API Gateway invoca la versión correcta de la
    función de forma automática. Así una etapa de producción puede dirigir
    el 95 % del tráfico a la versión 1 y el 5 % a la versión 2.`,
    explanationText:
      "🌍 Ejemplo cotidiano: editar la API sin desplegar es como escribir un nuevo horario en un papel y guardarlo en el cajón: hasta que lo cuelgas en la puerta (depliegas en una etapa), los clientes siguen viendo el horario antiguo.\n\nEl despliegue 'congela' el estado actual de la API en una etapa concreta y le da una URL. Cada etapa es un entorno independiente: puedes tener prod estable mientras pruebas cambios en dev. Las variables de etapa evitan reescribir código: con cambiar el valor de una variable, la misma API apunta a otra Lambda u otro backend.",
    codeSnippet: `// Acabas de modificar el método GET de tu API en la consola:
// cambiaste la integración y añadiste cabeceras. Guardas y esperas...
// ¿Qué ocurre con los clientes?`,
    inputs: {},
    completeCode:
      "Los cambios no son efectivos hasta desplegar en una etapa | historial para volver atrás | variables de etapa + alias de Lambda",
    format: "prediction",
    prediction: {
      prompt: "¿Qué ocurre con las peticiones de los clientes después de guardar los cambios?",
      snippet: `# En la consola de API Gateway
1. Modificas el método GET (cambias la integración).
2. Añades cabeceras a la respuesta.
3. Pulsas "Guardar".

¿Qué ven ahora los clientes que llaman a la URL de la etapa prod?`,
      options: [
        "Nada ha cambiado: los cambios quedan guardados pero no tienen efecto hasta que despliegas la API en una etapa.",
        "Los cambios se aplican al instante, porque API Gateway publica automáticamente al guardar.",
        "Los cambios solo se aplican si reinicias la API desde la consola.",
        "Los cambios se aplican a todas las etapas (dev, testing y prod) por igual sin necesidad de desplegar.",
      ],
      answer:
        "Nada ha cambiado: los cambios quedan guardados pero no tienen efecto hasta que despliegas la API en una etapa.",
    },
  },

  {
    id: 3,
    title: "Crear una API de Cero: El Flujo Completo",
    stars: 2,
    category: "DESPLIEGUE",
    description:
      "El orden importa: recursos → métodos → integración → despliegue. Si despliegas antes de configurar la integración, publicas una API vacía.",
    objective: "Reproducir el flujo de creación y publicación de una API",
    tags: ["recursos", "métodos", "integración", "deploy"],
    fileName: "deploy",
    completed: false,
    theory: `📚 TEORÍA: El orden de construcción de una API

En API Gateway primero construyes la API y solo al final la publicas:

  1. **Crear la API** (p. ej. REST API) en el servicio.
  2. **Crear los recursos**: la parte de la ruta, por ejemplo \`/casas\`.
  3. **Crear los métodos** HTTP sobre el recurso (\`GET\`, \`POST\`...).
  4. **Configurar la integración** con el backend: Lambda (proxy o no),
     HTTP, mock o servicio AWS.
  5. **Desplegar la API** en una etapa (dev, testing, prod): esto genera
     la URL pública de esa etapa.
  6. **Probar la URL** de la etapa desde un cliente externo.

Desplegar es el paso final que convierte la configuración en un endpoint
consumible. Si haces cambios después, recuerda: hay que volver a desplegar.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es como abrir un restaurante: primero construyes el local (creas la API), pones las mesas y la carta (recursos y métodos), conectas la cocina (integración) y solo al final cuelgas el letrero de 'abierto' (despliegas). Sin letrero, nadie puede entrar aunque la cocina funcione.\n\nLa URL de la etapa es la 'dirección' que reciben los clientes. El deploy asocia un snapshot de la API a una etapa y lo expone; por eso cada etapa puede tener un estado distinto y evolucionar de forma independiente.",
    codeSnippet: "// Ordena los pasos para construir y publicar una API Gateway de cero",
    inputs: {},
    completeCode:
      "Crear API → crear recursos → crear métodos → configurar integración → desplegar en una etapa → probar la URL",
    format: "ordering",
    ordering: {
      prompt: "Ordena el flujo correcto para crear y publicar una API Gateway desde cero.",
      steps: [
        { id: "create-api", label: "Crear la API (REST API) en API Gateway." },
        { id: "resource", label: "Crear los recursos de la ruta, por ejemplo /casas." },
        { id: "method", label: "Crear el método HTTP (GET, POST...) sobre el recurso." },
        { id: "integration", label: "Configurar la integración con el backend (Lambda proxy, HTTP, mock o servicio AWS)." },
        { id: "deploy", label: "Desplegar la API en una etapa (dev, testing o prod) para generar su URL." },
        { id: "test", label: "Probar la URL de la etapa con un cliente externo." },
      ],
      correctOrder: ["create-api", "resource", "method", "integration", "deploy", "test"],
    },
  },

  {
    id: 4,
    title: "Despliegue Canary: Tráfico Bajo Control",
    stars: 2,
    category: "DESPLIEGUE",
    description:
      "¿Publicar una versión nueva sin arriesgar el 100 % del tráfico? El despliegue canary reparte el tráfico entre producción y una etapa canary.",
    objective: "Comprender el despliegue canary y su equivalencia Blue/Green",
    tags: ["canary", "Blue/Green", "producción", "métricas"],
    fileName: "canary",
    completed: false,
    theory: `📚 TEORÍA: Despliegue Canary en API Gateway

El despliegue **canary** normalmente se hace sobre la etapa de producción,
aunque puede activarse en cualquier etapa. La idea:

  • En lugar de poner la nueva versión directamente en producción (donde no
    se ha testeado ni depurado), se crea una **etapa canary** con la versión
    nueva (por ejemplo la v2).
  • Se dirige un **porcentaje pequeño del tráfico** a la etapa canary
    (por ejemplo 95 % a producción y 5 % al canary).
  • Las métricas y logs del canary están **separados**, para poder
    monitorizar cómo se comporta la versión nueva con tráfico real.
  • Puedes **anular variables de etapa** para el canary cuando lo desees.
  • En esencia, es un despliegue **Blue/Green** con API Gateway: producción
    (blue) sigue mayoritaria mientras el canary (green) se valida.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es como estrenar una receta en un restaurante: no cambias toda la carta, solo sirves la receta nueva a un 5 % de las mesas. Si a nadie le sienta mal, la extiendes a todo el comedor; si falla, la retiras sin haber arruinado la velada del resto.\n\nEl canary reduce el riesgo de los despliegues: el grueso del tráfico sigue en la versión estable mientras observas errores, latencia y métricas de la nueva. Es la misma filosofía de CodeDeploy canary que ya viste con Lambda.",
    codeSnippet: "// Afirmaciones sobre el despliegue canary de API Gateway",
    inputs: {},
    completeCode:
      "Canary = % de tráfico a una etapa nueva | métricas/logs separados | anular variables de etapa | equivale a Blue/Green",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión del despliegue canary.",
      statements: [
        {
          id: "a",
          text: "El despliegue canary normalmente se habilita en la etapa de producción, aunque puede configurarse en cualquier etapa.",
          answer: true,
          explanation:
            "Correcto: es lo habitual usarlo en producción, pero el canary está disponible para cualquier etapa.",
        },
        {
          id: "b",
          text: "En un despliegue canary, todo el tráfico (100 %) se dirige a la nueva etapa para validarla lo antes posible.",
          answer: false,
          explanation:
            "Falso: se dirige solo un porcentaje pequeño (por ejemplo el 5 %) a la etapa canary mientras el resto sigue en producción.",
        },
        {
          id: "c",
          text: "El canary permite monitorizar métricas y logs por separado y anular variables de etapa específicas para la etapa canary.",
          answer: true,
          explanation:
            "Correcto: las métricas/logs se separan para analizar la versión nueva y puedes cambiar sus variables de etapa sin tocar producción.",
        },
        {
          id: "d",
          text: "El despliegue canary de API Gateway equivale en esencia a un despliegue Blue/Green.",
          answer: true,
          explanation:
            "Correcto: producción actúa como blue y la etapa canary como green, repartiéndose el tráfico.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // TIPOS DE API
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "HTTP API vs REST API",
    stars: 2,
    category: "TIPOS DE API",
    description:
      "HTTP API es la prima barata y rápida de REST API. El examen pregunta una y otra vez qué ofrece cada una.",
    objective: "Comparar HTTP API y REST API",
    tags: ["HTTP API", "REST API", "OAuth 2.0", "coste"],
    fileName: "http-api",
    completed: false,
    theory: `📚 TEORÍA: HTTP API vs REST API

**HTTP API** es una API de tipo proxy Lambda de **baja latencia y muy
rentable** (más barata):

  • No hay mapeo de datos: todo se basa en proxy.
  • Autorización nativa para **OIDC** (OpenID Connect) y **OAuth 2.0**.
  • Soporte **integrado de CORS**.
  • ❌ NO tiene **planes de uso, ni claves de API ni API keys**.

**REST API** es la API completa que hemos visto en el módulo:

  • Sí tiene planes de uso, API keys, mapeos de datos, WAF, caché...
  • ❌ No tiene integración nativa con OpenID Connect ni OAuth 2.0
    (para eso necesitas un autorizador personalizado).`,
    explanationText:
      "🌍 Ejemplo cotidiano: REST API es el restaurante completo con reservas, menú fijo y tarjetas de fidelidad; HTTP API es el food truck: más barato, rapidísimo, con lo esencial, pero sin fidelizar clientes (no hay planes de uso ni claves).\n\nLa regla para el examen: si el escenario pide bajar costes y solo necesitas Lambda proxy con auth OAuth 2.0, elige HTTP API. Si necesitas API keys, planes de uso, mapeos o WAF, necesitas REST API. HTTP API no tiene plan de uso porque no está pensada para monetizar el acceso.",
    codeSnippet: "// Afirmaciones sobre las diferencias entre HTTP API y REST API",
    inputs: {},
    completeCode:
      "HTTP API: barata, proxy Lambda, OIDC/OAuth2 nativos, CORS integrado, SIN API keys | REST API: API keys, planes de uso, mapeos, WAF",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de HTTP API vs REST API.",
      statements: [
        {
          id: "a",
          text: "HTTP API es una API de tipo proxy Lambda de baja latencia y más rentable (más barata) que REST API.",
          answer: true,
          explanation:
            "Correcto: es su principal ventaja: simplicidad, latencia menor y coste reducido.",
        },
        {
          id: "b",
          text: "HTTP API no tiene mapeo de datos: todo se basa en proxy.",
          answer: true,
          explanation:
            "Correcto: al ser proxy, la petición se reenvía tal cual; no hay plantillas de mapeo.",
        },
        {
          id: "c",
          text: "HTTP API ofrece planes de uso y claves de API (API keys), igual que REST API.",
          answer: false,
          explanation:
            "Falso: HTTP API no tiene planes de uso, ni claves de API ni API keys; eso es exclusivo de REST API.",
        },
        {
          id: "d",
          text: "HTTP API tiene soporte nativo de autorización para OpenID Connect (OIDC) y OAuth 2.0, mientras que REST API no lo tiene de forma nativa.",
          answer: true,
          explanation:
            "Correcto: esa es una de las ventajas de HTTP API; en REST API necesitarías un autorizador personalizado.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // INTEGRACIONES Y MAPEOS
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "Tipos de Integración: Cada Backend, su Método",
    stars: 3,
    category: "INTEGRACIONES Y MAPEOS",
    description:
      "Mock, Lambda, HTTP y servicios AWS: los conceptos de integración son de los más preguntados del examen. Empareja cada tipo con su caso de uso.",
    objective: "Distinguir los tipos de integración de API Gateway",
    tags: ["mock", "Lambda proxy", "HTTP", "servicios AWS"],
    fileName: "integration",
    completed: false,
    theory: `📚 TEORÍA: Los tipos de integración

  • **Mock**: devuelve una respuesta SIN enviar la solicitud al backend.
    Útil en desarrollo/testing, cuando aún no hay backend o no quieres
    montarlo todavía. No es para producción.
  • **Lambda**: invoca una función Lambda. Si usas **Lambda proxy**, la
    petición entrante se pasa completa a Lambda, que gestiona toda la
    lógica y la respuesta (sin plantillas de mapeo).
  • **HTTP**: expone puntos de enlace HTTP de un backend existente
    (por ejemplo un ALB). Sirve para añadir limitación de velocidad,
    caché, autenticación de usuarios, claves API, etc.
  • **Servicio AWS**: expone cualquier API de AWS a través de API Gateway
    (por ejemplo iniciar un trabajo de Step Functions o enviar un mensaje
    a SQS). Te permite añadir autenticación, desplegar públicamente y
    controlar el rate.`,
    explanationText:
      "🌍 Ejemplo cotidiano: la integración es el tipo de 'tubería' entre la recepción y el destino. Mock es el cartel de 'cerrado por reformas' con una respuesta prefabricada; Lambda es la mesa de trabajo que resuelve todo el pedido; HTTP es la cinta que lleva el pedido a una cocina que ya existía (tu backend); y servicio AWS es conectar directamente el pedido a la central de la empresa (SQS, Step Functions).\n\nElegir bien la integración determina qué puedes hacer: con Lambda proxy no hay mapeos, con HTTP/Lambda (no proxy) sí puedes transformar peticiones y respuestas. La integración mock aparece mucho en exámenes para desarrollo cuando el backend aún no está listo.",
    codeSnippet: "// Empareja cada tipo de integración con su caso de uso",
    inputs: {},
    completeCode:
      "Mock: respuesta sin backend (dev) | Lambda: invocar función | HTTP: exponer backend existente | Servicio AWS: SQS/Step Functions",
    format: "matching",
    matching: {
      prompt: "Conecta cada tipo de integración con su caso de uso más representativo.",
      definitions: [
        "Devuelve una respuesta sin enviar la solicitud al backend. Ideal para desarrollo/testing cuando aún no hay backend.",
        "Expone puntos de enlace HTTP de un backend existente (por ejemplo un ALB), añadiendo throttling, caché, autenticación y claves API.",
        "Invoca una función Lambda: en modo proxy, la petición entrante es la entrada a la función y esta gestiona la lógica y la respuesta.",
        "Expone cualquier API de AWS (por ejemplo iniciar Step Functions o enviar un mensaje a SQS), añadiendo autenticación, despliegue público y control de tasas.",
      ],
      pairs: [
        {
          id: "mock",
          term: "Integración Mock",
          definition:
            "Devuelve una respuesta sin enviar la solicitud al backend. Ideal para desarrollo/testing cuando aún no hay backend.",
        },
        {
          id: "http",
          term: "Integración HTTP",
          definition:
            "Expone puntos de enlace HTTP de un backend existente (por ejemplo un ALB), añadiendo throttling, caché, autenticación y claves API.",
        },
        {
          id: "lambda",
          term: "Integración Lambda",
          definition:
            "Invoca una función Lambda: en modo proxy, la petición entrante es la entrada a la función y esta gestiona la lógica y la respuesta.",
        },
        {
          id: "aws",
          term: "Integración con servicios AWS",
          definition:
            "Expone cualquier API de AWS (por ejemplo iniciar Step Functions o enviar un mensaje a SQS), añadiendo autenticación, despliegue público y control de tasas.",
        },
      ],
    },
  },

  {
    id: 7,
    title: "Lambda Proxy: Petición Completa, Sin Mapeos",
    stars: 3,
    category: "INTEGRACIONES Y MAPEOS",
    description:
      "Con Lambda proxy la petición entra entera en la función y Lambda responde entera. No puedes usar plantillas de mapeo: ¿qué consecuencias tiene?",
    objective: "Predecir el comportamiento de la integración Lambda proxy",
    tags: ["Lambda proxy", "plantillas de mapeo", "payload", "headers"],
    fileName: "lambda-proxy",
    completed: false,
    theory: `📚 TEORÍA: Lambda Proxy vs integración Lambda con mapeos

Con **Lambda proxy**:

  • La petición entrante del cliente es básicamente la entrada a Lambda:
    la función recibe el payload completo (recurso, ruta, método HTTP,
    cabeceras, query string...).
  • Lambda es responsable de TODA la lógica de la petición y de la
    respuesta que se va a dar.
  • ❌ NO puedes usar plantillas de mapeo: no puedes cambiar cabeceras,
    parámetros de cadena de consulta ni el cuerpo.
  • La respuesta esperada debe tener un formato concreto: statusCode,
    body, headers...

Con la integración **Lambda normal (sin proxy)** o **HTTP**, sí puedes
configurar la solicitud y la respuesta de integración usando **plantillas
de mapeo** para transformar lo que envías al backend y lo que devuelves
al cliente.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el modo proxy es enviar la carta completa que escribió el cliente directamente a la cocina: el chef (Lambda) la lee, cocina y sirve el plato final sin que nadie la reescriba. Sin proxy, hay un maître (API Gateway) que puede reescribir la carta antes de entregarla a la cocina y decorar el plato antes de servirlo.\n\nSi necesitas transformar datos (renombrar parámetros, cambiar el cuerpo), NO puedes usar Lambda proxy. Esa restricción es una trampa recurrente del examen: con proxy, la integración queda 'en blanco' a propósito porque todo lo maneja la función.",
    codeSnippet: `// Configuración del método en API Gateway
Tipo de integración: Lambda proxy = TRUE

Nota: la petición entrante se pasa completa a la función Lambda.

¿Qué puedes hacer con la plantilla de mapeo?`,
    inputs: {},
    completeCode:
      "Proxy = petición completa a Lambda, sin plantillas de mapeo | sin proxy = mapeos para transformar request/response",
    format: "prediction",
    prediction: {
      prompt: "¿Qué puedes hacer con las plantillas de mapeo en una integración Lambda proxy?",
      snippet: `Tipo de integración: AWS Lambda
Use Lambda Proxy integration: marcado

# En "Solicitud de integración" buscas la plantilla de mapeo...
# ¿Qué ocurre si intentas usarla?`,
      options: [
        "No puedes usar plantillas de mapeo: toda la petición (ruta, método, cabeceras, query string y cuerpo) se pasa a Lambda tal cual, y Lambda construye la respuesta.",
        "Puedes añadir una plantilla de mapeo para renombrar los parámetros de la cadena de consulta antes de que lleguen a Lambda.",
        "Puedes modificar solo la respuesta de Lambda, pero nunca la petición de entrada.",
        "Con proxy solo puedes usar plantillas para añadir cabeceras HTTP, no para cambiar el cuerpo.",
      ],
      answer:
        "No puedes usar plantillas de mapeo: toda la petición (ruta, método, cabeceras, query string y cuerpo) se pasa a Lambda tal cual, y Lambda construye la respuesta.",
    },
  },

  {
    id: 8,
    title: "Plantillas de Mapeo: Transformar el Payload",
    stars: 3,
    category: "INTEGRACIONES Y MAPEOS",
    description:
      "Las plantillas de mapeo usan VTL para renombrar y transformar peticiones y respuestas. Predice qué recibe el cliente con esta plantilla.",
    objective: "Predecir el efecto de una plantilla de mapeo VTL",
    tags: ["VTL", "plantilla de mapeo", "transformación", "response"],
    fileName: "mapping-template",
    completed: false,
    theory: `📚 TEORÍA: Plantillas de mapeo con VTL

Las **plantillas de mapeo** permiten modificar peticiones y respuestas en
integraciones Lambda (sin proxy) y HTTP:

  • Permiten renombrar parámetros de la cadena de consulta, cabeceras y el
    propio cuerpo del mensaje.
  • Usan **VTL** (Velocity Template Language), un lenguaje de scripting
    para transformar los datos.
  • Al recibir la respuesta, también puedes eliminar o renombrar campos
    con otra plantilla.
  • El tipo de contenido se establece mediante \`application/json\` o
    \`application/xml\`.
  • Caso clásico de examen: transformar una API REST (JSON) para conectarla
    con una **API SOAP** (XML): la plantilla convierte el JSON del cliente
    en un mensaje SOAP y la respuesta XML de vuelta en JSON.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es el traductor de la recepción: el cliente pide 'dos cafés con leche' y el traductor le dice a la cocina 'dos latte macchiato'; si la cocina responde 'latte listo', el traductor le dice al cliente 'aquí tiene sus cafés'.\n\n$inputRoot referencia la raíz del JSON de entrada y $input.path('$') accede al payload completo. En este caso la plantilla renombra la clave 'example' por 'clave' en la respuesta al cliente, sin tocar la Lambda. Si la Lambda devolviera un campo distinto del que espera la plantilla, el valor quedaría vacío.",
    codeSnippet: `// Plantilla de mapeo configurada en la RESPUESTA de integración
#set($inputRoot = $input.path('$'))
{
  "clave": "$inputRoot.example"
}

// La función Lambda devuelve:
// { "example": "test" }`,
    inputs: {},
    completeCode:
      'VTL: $inputRoot.example | renombra example → clave en la respuesta | {"example":"test"} → {"clave":"test"}',
    format: "prediction",
    prediction: {
      prompt: "La Lambda devuelve { \"example\": \"test\" }. ¿Qué respuesta recibe el cliente?",
      snippet: `# Plantilla de mapeo en la respuesta de integración (integration response)
#set($inputRoot = $input.path('$'))
{
  "clave": "$inputRoot.example"
}

# Respuesta real de la función Lambda:
# { "example": "test" }`,
      options: [
        'El cliente recibe { "clave": "test" }: la plantilla renombra la clave example por "clave" tomando el valor de la entrada.',
        'El cliente recibe { "example": "test" } sin cambios: la plantilla de respuesta no modifica nada.',
        'La petición de entrada del cliente se modifica en lugar de la respuesta.',
        'La plantilla da error porque no se permite usar $inputRoot sin integración proxy.',
      ],
      answer:
        'El cliente recibe { "clave": "test" }: la plantilla renombra la clave example por "clave" tomando el valor de la entrada.',
    },
  },

  {
    id: 9,
    title: "OpenAPI: La API como Código",
    stars: 3,
    category: "INTEGRACIONES Y MAPEOS",
    description:
      "Definir la API como código con OpenAPI/Swagger, importarla, exportarla, generar SDK y validar peticiones antes del backend.",
    objective: "Comprender OpenAPI 3.0, validación y generación de SDK",
    tags: ["OpenAPI", "Swagger", "request validators", "SDK"],
    fileName: "openapi.yaml",
    completed: false,
    theory: `📚 TEORÍA: OpenAPI y API Gateway

  • **OpenAPI** (antes Swagger) es una forma común de definir una API REST
    usando la definición de la API como código.
  • API Gateway puede **importar** una especificación OpenAPI 3.0 con la
    estructura de métodos, integraciones y respuestas, y añadir
    **extensiones de AWS** (\`x-amazon-apigateway\`) para cada opción.
  • Puedes **exportar** las APIs actuales en formato OpenAPI o Swagger,
    en **YAML o JSON**, y **generar un SDK** para la plataforma que
    necesites (por ejemplo Java o JavaScript).

**Validación básica de peticiones (request validators)**: antes de ejecutar
acciones, API Gateway valida:

  1. Los **parámetros de petición requeridos** en la URI, la cadena de
     consulta y las cabeceras (que existan y no estén en blanco).
  2. El **payload** de la petición contra el modelo **JSON Schema**
     configurado en el método.

Si la validación falla, API Gateway devuelve un **400** de forma inmediata
sin llamar al backend, reduciendo llamadas innecesarias.`,
    explanationText:
      "🌍 Ejemplo cotidiano: OpenAPI es el 'contrato' escrito de la API: como los planos de un edificio, definen dónde está cada puerta (endpoint) y qué llave abre cada puerta (métodos y parámetros). Con los planos en la mano, cualquier equipo construye la misma fachada sin reuniones.\n\nLa validación antes del backend es el portero que revisa el DNI en la puerta: si falta, devuelve 400 y nadie entra, ahorrando el viaje a la cocina. Esta idea (validar antes de costear una invocación) es recurrente en el examen junto con las extensiones x-amazon-apigateway.",
    codeSnippet: "// Afirmaciones sobre OpenAPI, validación y generación de SDK",
    inputs: {},
    completeCode:
      "OpenAPI 3.0 import/export (YAML/JSON) | extensiones x-amazon-apigateway | request validators → 400 | generación de SDK",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de OpenAPI en API Gateway.",
      statements: [
        {
          id: "a",
          text: "OpenAPI (Swagger) permite definir la API como código y API Gateway puede importar una especificación OpenAPI 3.0 con sus métodos, integraciones y respuestas.",
          answer: true,
          explanation:
            "Correcto: la API como código se importa en API Gateway y se puede completar con extensiones de AWS.",
        },
        {
          id: "b",
          text: "Las especificaciones OpenAPI solo pueden escribirse en YAML: el formato JSON no está soportado.",
          answer: false,
          explanation:
            "Falso: OpenAPI se puede exportar e importar tanto en YAML como en JSON.",
        },
        {
          id: "c",
          text: "API Gateway puede exportar la API en formato OpenAPI/Swagger y generar un SDK para la plataforma que elijas (por ejemplo Java o JavaScript).",
          answer: true,
          explanation:
            "Correcto: la exportación y la generación de SDK son funciones integradas en el servicio.",
        },
        {
          id: "d",
          text: "Con los request validators, si una petición no pasa la validación (parámetros requeridos o payload contra JSON Schema), API Gateway devuelve un 400 al instante sin llamar al backend.",
          answer: true,
          explanation:
            "Correcto: la validación temprana ahorra llamadas innecesarias al backend.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // RENDIMIENTO Y USO
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: "Caché en API Gateway: Menos Llamadas al Backend",
    stars: 3,
    category: "RENDIMIENTO Y USO",
    description:
      "La caché de API Gateway responde peticiones repetidas sin tocar el backend. ¿Cuándo merece la pena pagarla y cómo se invalida?",
    objective: "Predecir el efecto y los límites de la caché",
    tags: ["caché", "TTL", "invalidate", "coste"],
    fileName: "cache",
    completed: false,
    theory: `📚 TEORÍA: Caché en API Gateway

  • Reduce el número de llamadas al backend: si la respuesta ya está en
    caché, API Gateway la devuelve sin reenviar la petición.
  • **TTL por defecto de 300 segundos**, configurable entre 0 y 3600.
  • La caché se define **por etapa** y se puede **anular por método**.
  • Capacidad entre **0.5 GB y 237 GB**, con opción de cifrado.
  • Es una función **cara**: tiene sentido en producción, pero en
    desarrollo o testing casi nunca.
  • Se aplica a respuestas de métodos **GET**.
  • Para **invalidar** (vaciar) la caché al instante se usa la cabecera
    \`Cache-Control: max-age=0\`, pero requiere **autorización**: debes
    imponer la política \`InvalidateCache\` o marcar la casilla
    "require authorization" desde la consola. Si no, cualquier cliente
    podría vaciar tu caché.`,
    explanationText:
      "🌍 Ejemplo cotidiano: es la taquilla de un concierto donde ya compraste la entrada: cuando vuelves a preguntar, la taquilla te enseña la misma entrada sin tener que llamar a la central (el backend). El TTL es cuánto tiempo vale la entrada antes de tener que pedirla otra vez.\n\nLa caché reduce coste y latencia cuando el dato cambia poco (un catálogo, una configuración). Pero es cara, por eso solo producción. Y el permiso InvalidateCache es la llave que evita que un cliente malicioso vacíe la taquilla entera cada pocos segundos.",
    codeSnippet: `// Configuración de la etapa de producción
Habilitar caché de API: ON
TTL por defecto: 300 segundos
Capacidad: 0.5 GB a 237 GB

Escenario: un cliente repite la MISMA petición GET 5 veces en 1 minuto.`,
    inputs: {},
    completeCode:
      "Caché = menos llamadas al backend | TTL 300s (0-3600) | por etapa, override por método | solo GET | invalidar con Cache-Control: max-age=0 + InvalidateCache",
    format: "prediction",
    prediction: {
      prompt: "¿Qué efecto tiene la caché en esas 5 peticiones GET repetidas?",
      snippet: `# Tu API REST devuelve un catálogo que apenas cambia.
# Habilitas la caché de API Gateway en la etapa de producción (TTL 300 s).
# Un cliente repite el MISMO GET 5 veces en 1 minuto.

¿Qué ocurre con las llamadas al backend?`,
      options: [
        "Solo la primera petición llega al backend; las 4 siguientes se responden desde la caché de API Gateway hasta que expire el TTL.",
        "Las 5 peticiones llegan al backend porque la caché solo sirve para HTTP API, no para REST API.",
        "Las 5 peticiones llegan al backend porque la caché se rellena en frío desde S3 y tarda en activarse.",
        "La caché guarda la petición en DynamoDB para poder responder sin backend en el futuro.",
      ],
      answer:
        "Solo la primera petición llega al backend; las 4 siguientes se responden desde la caché de API Gateway hasta que expire el TTL.",
    },
  },

  {
    id: 11,
    title: "Planes de Uso y Claves de API",
    stars: 3,
    category: "RENDIMIENTO Y USO",
    description:
      "Monetizar una API: el plan de uso limita velocidad y cuota por cliente, y la API key identifica a cada cliente. ¿Cómo se configura el conjunto?",
    objective: "Comprender planes de uso, API keys y su orden de configuración",
    tags: ["usage plan", "API keys", "throttling", "X-API-Key"],
    fileName: "usage-plan",
    completed: false,
    theory: `📚 TEORÍA: Planes de uso y claves de API

Cuando quieres ofrecer tu API como producto (incluso cobrar por su uso),
necesitas dos piezas:

  • **Plan de uso**: determina quién puede acceder a una o más etapas y
    métodos de la API, cuánto y a qué velocidad. Configura límites de
    **estrangulamiento** (velocidad y ráfaga) y de **cuota** (peticiones
    mensuales), aplicados de forma individual a cada cliente.
  • **API key**: un valor alfanumérico que se distribuye a cada cliente
    para identificarlo y medir su acceso. Los límites de estrangulamiento
    también se aplican a las claves.

Orden de configuración:
  1. Crear la API y configurar los métodos para que **requieran API key**
     (API Key Required = true) y desplegarla en etapas.
  2. Generar o importar las claves de API para los clientes.
  3. Crear el plan de uso con sus límites de velocidad y cuota.
  4. Asociar las etapas y las claves de API al plan de uso.

El cliente debe enviar su clave en la cabecera **\`X-API-Key\`** en cada
petición; si falta, recibe un 403 de acceso denegado.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el plan de uso es el abono de gimnasio (puedes entrar X veces al mes y reservar como máximo cada Y minutos) y la API key es la tarjeta personal con tu número de socio: sin ella, la recepción no te deja pasar (403).\n\nLa key no es un método de autenticación, solo identifica al suscriptor para aplicar su límite. El orden importa: primero marcas el método como 'requiere API key', luego creas claves y plan, y por último lo asocias todo. En el examen, 'enviar la clave como query string' es una opción falsa: va en la cabecera X-API-Key.",
    codeSnippet: "// Afirmaciones sobre planes de uso y claves de API",
    inputs: {},
    completeCode:
      "Plan de uso: throttling + cuota por cliente | API key: cabecera X-API-Key | método con API Key Required = true | asociar etapas y claves al plan",
    format: "true-false",
    trueFalse: {
      prompt: "Valida tu comprensión de los planes de uso y las claves de API.",
      statements: [
        {
          id: "a",
          text: "Un plan de uso determina quién puede acceder a una o más etapas y métodos de la API y con qué límites de velocidad (throttling) y cuota, aplicados por cliente.",
          answer: true,
          explanation:
            "Correcto: el plan de uso define el acceso y los límites individuales por cliente.",
        },
        {
          id: "b",
          text: "Las API keys son valores alfanuméricos que se distribuyen a los clientes para identificarlos y medir su acceso a la API.",
          answer: true,
          explanation:
            "Correcto: la clave identifica al suscriptor y permite aplicar su plan de uso.",
        },
        {
          id: "c",
          text: "Para que la clave funcione, el método debe estar configurado con API Key Required = true y el cliente debe enviarla en la cabecera X-API-Key de cada petición.",
          answer: true,
          explanation:
            "Correcto: la clave viaja como cabecera; si falta o es inválida, el acceso se deniega (403).",
        },
        {
          id: "d",
          text: "La API key se envía como parámetro de la URL (query string), no como cabecera HTTP.",
          answer: false,
          explanation:
            "Falso: la clave de API debe enviarse en la cabecera X-API-Key de la petición.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // MONITORIZACIÓN Y SEGURIDAD
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 12,
    title: "Monitorización, Logs y Errores",
    stars: 3,
    category: "MONITORIZACIÓN Y SEGURIDAD",
    description:
      "CloudWatch para logs y métricas, X-Ray para rastrear, y los códigos de error 4xx/5xx que debes saber leer en producción.",
    objective: "Predecir errores y entender métricas de API Gateway",
    tags: ["CloudWatch", "X-Ray", "504", "métricas"],
    fileName: "cloudwatch",
    completed: false,
    theory: `📚 TEORÍA: Supervisión, logs y rastreo

  • **CloudWatch Logs**: los registros contienen información sobre el
    cuerpo de las peticiones y respuestas. Se habilitan **por etapa**
    (producción, testing, desarrollo) y se pueden filtrar por nivel
    (info, debug, error).
  • **X-Ray**: rastrea las peticiones a través de API Gateway. Sumado a
    Lambda, obtienes una imagen completa del recorrido cliente → API →
    backend.
  • **Métricas destacadas**: CacheHitCount / CacheMissCount (eficacia de
    la caché), Count (número total de peticiones), **IntegrationLatency**
    (tiempo entre que API Gateway envía al backend y recibe la respuesta)
    y **Latency** (tiempo total entre que API Gateway recibe la petición
    del cliente y le devuelve la respuesta).

Errores del cliente (4xx): 400 petición errónea, 403 acceso denegado
(posible filtrado de WAF), **429** se ha superado la cuota máxima
(throttling). Errores del servidor (5xx): **502** excepción de gateway
(normalmente por una salida incompatible del backend en integración proxy),
503 servicio no disponible, **504** fallo de integración (por ejemplo el
Endpoint Request Timeout). Las peticiones de API Gateway expiran tras un
máximo de **29 segundos**.

Además, hay un límite de cuenta de **10.000 peticiones por segundo** en
todas las APIs; si una API acapara casi todas, el resto puede estrangularte.
El límite se puede aumentar con un ticket a AWS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: los logs de CloudWatch son la grabación de la recepción (qué pidió cada visitante y qué se le respondió), y X-Ray es el detector de movimiento que te sigue por todo el edificio para saber dónde se perdió tiempo. Las métricas de latencia distinguen 'cuánto tardó la cocina' (IntegrationLatency) de 'cuánto tardó todo el servicio' (Latency).\n\nEn el examen, un 504 con una Lambda que tarda más de 29 segundos apunta directamente al límite de timeout de API Gateway; un 502 suele ser una respuesta de Lambda mal formada en modo proxy (falta statusCode o body). Y ojo al 429: no es un fallo del backend, es un límite de tasa superado.",
    codeSnippet: `// Un cliente llama a tu API y su petición tarda más de 30 segundos
// porque tu función Lambda hace un cálculo pesado.
// La integración es Lambda proxy.

¿Qué código de error recibe el cliente?`,
    inputs: {},
    completeCode:
      "CloudWatch logs por etapa + niveles | X-Ray para rastreo | Latency vs IntegrationLatency | 4xx/5xx | timeout 29s | límite cuenta 10k rps",
    format: "prediction",
    prediction: {
      prompt: "¿Qué error recibe el cliente y por qué?",
      snippet: `# Tu función Lambda tarda 45 segundos en responder
# (integración Lambda proxy, sin timeout custom en la API).

¿Qué recibe el cliente?`,
      options: [
        "504 Gateway Timeout: API Gateway expira las peticiones que exceden un máximo de unos 29 segundos.",
        "429 Too Many Requests: has superado el límite de peticiones por segundo de la cuenta.",
        "400 Bad Request: la petición del cliente tiene parámetros erróneos.",
        "200 OK: API Gateway espera sin límite de tiempo hasta que Lambda responda.",
      ],
      answer:
        "504 Gateway Timeout: API Gateway expira las peticiones que exceden un máximo de unos 29 segundos.",
    },
  },

  {
    id: 13,
    title: "CORS: El Navegador Pone las Reglas",
    stars: 3,
    category: "MONITORIZACIÓN Y SEGURIDAD",
    description:
      "Tu web estática en S3 hace fetch a API Gateway desde otro dominio. Sin CORS, el navegador bloquea la respuesta aunque el backend responda.",
    objective: "Predecir el fallo de CORS y cómo solucionarlo",
    tags: ["CORS", "preflight", "Access-Control-Allow-Origin", "S3"],
    fileName: "cors",
    completed: false,
    theory: `📚 TEORÍA: CORS en API Gateway

CORS debe estar activado cuando la API recibe llamadas desde **otro
dominio**. Antes de la petición real, el navegador hace una petición de
**prevuelo (preflight)** con el método \`OPTIONS\`, y API Gateway debe
responder con cabeceras:

  • \`Access-Control-Allow-Methods\` (p. ej. GET, PUT, DELETE)
  • \`Access-Control-Allow-Headers\`
  • \`Access-Control-Allow-Origin\`

En la práctica (página web estática en un bucket S3 que consulta tu API):

  1. El navegador lanza el \`OPTIONS\` previo hacia la API indicando el
     origen (el bucket S3).
  2. API Gateway responde: "permito estos métodos desde este origen".
  3. El navegador ejecuta el \`GET\` real y puede leer la respuesta.

CORS se puede **habilitar desde la consola** (botón "Habilitar CORS").
Importante: con **integraciones Lambda proxy**, la cabecera
\`Access-Control-Allow-Origin\` debe añadirse **en el código de la función
Lambda**, porque API Gateway no la inyecta por ti. Y recuerda: tras cambiar
la configuración hay que **desplegar de nuevo**.`,
    explanationText:
      "🌍 Ejemplo cotidiano: CORS es la política de visado del navegador: tu web en S3 pide datos a otro país (API Gateway) y el navegador exige un 'visado' (preflight OPTIONS) antes de dejar leer la respuesta. Sin visado, el paquete llega pero el navegador no te deja abrirlo: no es que el servidor haya fallado, es que el navegador lo bloquea.\n\nPor eso el error CORS aparece en la consola del navegador aunque la API devuelva 200. Y el detalle del examen: con Lambda proxy, arreglar CORS en la consola no basta; hay que devolver Access-Control-Allow-Origin desde el propio código de Lambda.",
    codeSnippet: `// Página web estática en un bucket S3 (dominio A)
// hace fetch a tu API Gateway (dominio B) SIN CORS habilitado.

const resp = await fetch("https://tu-api.execute-api.region.amazonaws.com/prod/casas");
const data = await resp.json();`,
    inputs: {},
    completeCode:
      "Preflight OPTIONS | Access-Control-Allow-Methods/Headers/Origin | habilitar CORS en consola | con Lambda proxy añadir la cabecera en el código | desplegar",
    format: "prediction",
    prediction: {
      prompt: "¿Qué ocurre cuando la web carga ese fetch?",
      snippet: `# La API responde 200 con los datos, pero la consola del navegador muestra:
# "Access to fetch ... has been blocked by CORS policy"

¿Cuál es la causa?`,
      options: [
        "El navegador bloquea la lectura de la respuesta porque la API no devuelve las cabeceras CORS correctas (p. ej. Access-Control-Allow-Origin): el servidor responde, pero el navegador no permite usarla.",
        "La API devuelve 403 porque el bucket S3 no tiene permisos de lectura.",
        "API Gateway rechaza la petición con 429 porque la web hace demasiadas llamadas.",
        "El fetch falla porque las peticiones CORS solo funcionan con HTTP API, no con REST API.",
      ],
      answer:
        "El navegador bloquea la lectura de la respuesta porque la API no devuelve las cabeceras CORS correctas (p. ej. Access-Control-Allow-Origin): el servidor responde, pero el navegador no permite usarla.",
    },
  },

  {
    id: 14,
    title: "Autenticación y Autorización: Tres Vías",
    stars: 4,
    category: "MONITORIZACIÓN Y SEGURIDAD",
    description:
      "IAM para acceso interno, Cognito para usuarios externos y autorizador Lambda para tokens de terceros. Empareja cada mecanismo con su caso.",
    objective: "Distinguir IAM, Cognito User Pools y Lambda authorizer",
    tags: ["IAM", "Cognito", "Lambda authorizer", "JWT"],
    fileName: "auth",
    completed: false,
    theory: `📚 TEORÍA: Autenticación y autorización

  • **Permisos IAM**: ideal para usuarios y roles que ya están DENTRO de tu
    cuenta de AWS (EC2, Lambda, usuarios IAM). La autenticación se realiza
    con IAM y la autorización con una política IAM. Se aprovecha la firma
    **SigV4** (las credenciales se pasan en las cabeceras). Se puede
    combinar con **políticas de recursos** para cuentas cruzadas, filtrar
    direcciones IP o permitir un endpoint VPC.

  • **Cognito User Pools**: es una base de datos de usuarios que gestiona
    todo el ciclo de vida (registro, login con Facebook/Google...). Los
    usuarios obtienen un **token de acceso que caduca automáticamente** y
    API Gateway verifica la identidad con ese token. NO necesitas código
    personalizado: es la vía más sencilla para usuarios externos.

  • **Autorizador Lambda** (antes autorizador personalizado): autorizador
    basado en **token** (por ejemplo JWT de terceros). Una función Lambda
    evalúa el token (viene en cabeceras, query string o variables de etapa)
    y devuelve una **política IAM** para el usuario, que se **almacena en
    caché**. La autenticación es externa, pero la autorización la decide
    tu Lambda. Pagas por invocación de Lambda.`,
    explanationText:
      "🌍 Ejemplo cotidiano: IAM es la tarjeta de empleado del propio edificio (ya tienes la credencial de la empresa); Cognito es el carné de socio de un club externo que emite AWS (el portero solo comprueba que el carné no esté caducado); y el autorizador Lambda es el guardia de seguridad contratado que revisa el pasaporte de cualquier país (token JWT) contra su lista propia y decide si deja pasar.\n\nLa regla del examen: acceso interno de la cuenta → IAM (con SigV4). Usuarios de aplicación web que se registran → Cognito. Tokens de terceros o lógica de autorización propia → Lambda authorizer. El detalle trampa: con Cognito no escribes código; con Lambda authorizer sí, y además la política resultante se cachea para no pagar Lambda en cada petición.",
    codeSnippet: "// Empareja cada mecanismo de seguridad con su caso de uso",
    inputs: {},
    completeCode:
      "IAM: acceso interno (SigV4) | Cognito: usuarios externos sin código | Lambda authorizer: tokens JWT de terceros con política cacheada",
    format: "matching",
    matching: {
      prompt: "Conecta cada mecanismo de autenticación/autorización con su caso de uso.",
      definitions: [
        "Base de datos de usuarios que gestiona el ciclo de vida completo (login con Facebook/Google). Los usuarios obtienen un token que caduca y API Gateway lo verifica sin código personalizado.",
        "Autorizador basado en token (por ejemplo JWT de terceros): una función Lambda evalúa el token y devuelve una política IAM que se almacena en caché.",
        "Ideal para usuarios y roles dentro de la cuenta de AWS: la autenticación se hace con IAM y la autorización con una política IAM, aprovechando la firma SigV4 en las cabeceras.",
        "Documento adyacente a la API que define quién y qué puede acceder: permite cuentas cruzadas, filtrar direcciones IP o permitir un endpoint de VPC.",
      ],
      pairs: [
        {
          id: "cognito",
          term: "Cognito User Pools",
          definition:
            "Base de datos de usuarios que gestiona el ciclo de vida completo (login con Facebook/Google). Los usuarios obtienen un token que caduca y API Gateway lo verifica sin código personalizado.",
        },
        {
          id: "lambda-auth",
          term: "Autorizador Lambda",
          definition:
            "Autorizador basado en token (por ejemplo JWT de terceros): una función Lambda evalúa el token y devuelve una política IAM que se almacena en caché.",
        },
        {
          id: "iam",
          term: "Permisos IAM",
          definition:
            "Ideal para usuarios y roles dentro de la cuenta de AWS: la autenticación se hace con IAM y la autorización con una política IAM, aprovechando la firma SigV4 en las cabeceras.",
        },
        {
          id: "resource-policy",
          term: "Políticas de recursos",
          definition:
            "Documento adyacente a la API que define quién y qué puede acceder: permite cuentas cruzadas, filtrar direcciones IP o permitir un endpoint de VPC.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // WEBSOCKET
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 15,
    title: "WebSocket API: Conversación en las Dos Direcciones",
    stars: 4,
    category: "WEBSOCKET",
    description:
      "Con WebSocket el servidor puede enviar datos sin que el cliente los pida: chats, juegos, trading. Todo gira alrededor del connectionId.",
    objective: "Comprender las rutas, el connectionId y el callback de WebSocket",
    tags: ["WebSocket", "connectionId", "$connect", "$default", "bidireccional"],
    fileName: "websocket",
    completed: false,
    theory: `📚 TEORÍA: WebSocket API

**WebSocket** indica comunicación interactiva **bidireccional** entre el
navegador y el servidor: el servidor puede enviar información al cliente
sin que este haga una solicitud. Permite aplicaciones con estado y en
tiempo real: chats, plataformas de colaboración, juegos multijugador y
plataformas de negociación financiera.

  • El cliente se conecta con una URL cifrada \`wss://...\` y establece una
    **conexión persistente**. API Gateway guarda un identificador único:
    el **connectionId**.
  • Cada evento de la conexión se enruta a una integración (Lambda,
    DynamoDB, HTTP...):
      - **$connect**: el cliente abre la conexión (en el ejemplo del chat
        del curso, la función onconnect guarda la conexión en DynamoDB).
      - **$disconnect**: el cliente se desconecta.
      - **$default**: cualquier mensaje que no matchee una ruta concreta.
  • Para enviar mensajes, los clientes mandan frames; el **enrutamiento**
    usa una **expresión de selección de ruta**: un campo del JSON entrante
    (por ejemplo \`action\`) decide qué integración se invoca. Si la ruta
    no existe, va a **$default**.
  • El servidor envía datos al cliente con una **llamada de retorno
    (callback)** a la URL que contiene el connectionId, usando una petición
    HTTP POST firmada con IAM. Operaciones disponibles: **POST** (enviar
    mensaje al cliente conectado), **GET** (estado de la conexión) y
    **DELETE** (desconectar).`,
    explanationText:
      "🌍 Ejemplo cotidiano: REST es enviar una carta y esperar respuesta; WebSocket es una llamada telefónica que queda abierta: los dos pueden hablar cuando quieran. El connectionId es el número de línea del cliente: sin él, el servidor no sabe a qué teléfono llamar para devolver el mensaje.\n\nEl connectionId es la pieza central: se genera en $connect, se usa para enrutar mensajes y permite al servidor hacer el callback con una firma IAM. En el examen, distingue: la ruta $default recibe los mensajes sin acción reconocida, y la comunicación servidor→cliente SIEMPRE usa el connectionId.",
    codeSnippet: `// Aplicación de chat: un cliente se conecta a la WebSocket API
// (wss://.../prod) y empieza a enviar mensajes.

Escenario: el servidor quiere responder a ESE cliente concreto.`,
    inputs: {},
    completeCode:
      "Bidireccional | wss:// | rutas $connect/$disconnect/$default | connectionId | callback POST firmado con IAM | enrutamiento por action",
    format: "prediction",
    prediction: {
      prompt: "¿Qué necesita el servidor para enviar un mensaje al cliente conectado?",
      snippet: `# Un cliente establece la conexión (se invoca $connect)
# y envía mensajes por la ruta $default.
# Ahora el SERVIDOR quiere enviarle un mensaje sin esperar a que pida.

¿Qué identificador usa la llamada de retorno?`,
      options: [
        "El connectionId: identificador único de la conexión que se usa en la URL de callback para enviar el mensaje al cliente conectado.",
        "La dirección IP del cliente, guardada en una cabecera HTTP.",
        "El ARN de la función Lambda que procesa los mensajes del cliente.",
        "Una cookie de sesión generada por CloudFront al conectar.",
      ],
      answer:
        "El connectionId: identificador único de la conexión que se usa en la URL de callback para enviar el mensaje al cliente conectado.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ARQUITECTURA
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 16,
    title: "Arquitectura: Interfaz Única para tus Microservicios",
    stars: 4,
    category: "ARQUITECTURA",
    description:
      "API Gateway como fachada única: clientes, Route 53, Lambda y DynamoDB. Ordena el recorrido completo de una petición serverless.",
    objective: "Ensamblar la arquitectura client → API Gateway → Lambda → DynamoDB",
    tags: ["arquitectura", "Route 53", "DynamoDB", "CRUD"],
    fileName: "architecture",
    completed: false,
    theory: `📚 TEORÍA: Arquitectura con API Gateway

La gran ventaja de API Gateway es crear una **interfaz totalmente única**
para todos los microservicios de tu empresa:

  • Puedes exponer con API endpoints varios recursos: un Elastic Load
    Balancer con un clúster ECS, documentos almacenados en S3, un segundo
    servicio con ALB + Auto Scaling Group...
  • Se integra con **Route 53** (tu propio DNS), dominios personalizados
    y certificados SSL.
  • Puedes aplicar reglas de **reenvío y transformación** a nivel de API
    Gateway y gestionar accesos personalizados para cada cliente.

La arquitectura serverless más clásica:

  cliente (web/app) → Route 53 → **API Gateway** → **Lambda** → **DynamoDB**

API Gateway recibe la petición, aplica autenticación/limitación, invoca la
función Lambda (CRUD contra DynamoDB) y devuelve la respuesta formateada.`,
    explanationText:
      "🌍 Ejemplo cotidiano: API Gateway es el mostrador único de un centro comercial: un solo punto donde pides 'restaurante', 'tienda' o 'cine' y el mostrador te redirige al local adecuado. Tú no necesitas saber dónde está cada local: solo pasas por recepción.\n\nEl recorrido completo de una petición serverless encadena capas con responsabilidades distintas: DNS (Route 53), puerta de entrada y control (API Gateway), lógica de negocio (Lambda) y almacenamiento (DynamoDB). Saber ordenarlas y explicar qué hace cada una es la pregunta integradora típica del examen al final de un escenario serverless.",
    codeSnippet: "// Ordena el recorrido completo de una petición en una arquitectura serverless",
    inputs: {},
    completeCode:
      "Cliente → Route 53 → API Gateway (auth/throttle) → Lambda (CRUD) → DynamoDB → respuesta al cliente",
    format: "ordering",
    ordering: {
      prompt: "Ordena el recorrido de una petición en la arquitectura serverless completa.",
      steps: [
        { id: "dns", label: "El cliente (web o app) resuelve el dominio mediante Route 53 y envía la petición HTTPS a API Gateway." },
        { id: "gateway", label: "API Gateway recibe la petición y aplica autenticación, limitación y reglas de transformación." },
        { id: "invoke", label: "API Gateway invoca la función Lambda mediante una integración proxy, pasándole la petición completa." },
        { id: "crud", label: "Lambda ejecuta la operación CRUD correspondiente contra la tabla de DynamoDB." },
        { id: "return", label: "Lambda devuelve la respuesta a API Gateway en el formato esperado." },
        { id: "client", label: "API Gateway reenvía la respuesta al cliente con el código HTTP y las cabeceras adecuados." },
      ],
      correctOrder: ["dns", "gateway", "invoke", "crud", "return", "client"],
    },
  },
];
