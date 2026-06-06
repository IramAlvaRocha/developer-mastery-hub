// GCP (Google Cloud Platform) — 12 ejercicios: Cloud Functions, Cloud Run, IAM, Logging
const GCP_EXERCISES = [
  {
    id: 1, title: "Cloud Functions Gen 2: HTTP Trigger", stars: 2, category: "FUNCTIONS",
    description: "Cloud Functions Gen 2 corre sobre Cloud Run internamente. Los HTTP triggers responden a requests directamente.",
    objective: "Función HTTP en Node.js",
    tags: ["@google-cloud/functions-framework", "http", "gen2"],
    fileName: "index.ts",
    completed: false,
    explanationText: "Cloud Functions es como contratar a un chef freelance: solo pagas cuando cocina (cuando hay requests). No necesitas tener un cocinero de planta (servidor 24/7).",
    codeSnippet:
`import { [INPUT_1] } from '@google-cloud/functions-framework';
import type { Request, Response } from 'express';

[INPUT_2]('processOrder', async (req: Request, res: Response) => {
  // Validar método
  if (req.[INPUT_3] !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.[INPUT_4];

  try {
    await processOrder(orderId);
    res.status(200).json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});`,
    inputs: { INPUT_1: "http", INPUT_2: "http", INPUT_3: "method", INPUT_4: "body" },
    completeCode: "import { http } from '@google-cloud/functions-framework'; http('name', handler)"
  },
  {
    id: 2, title: "Cloud Functions: Pub/Sub Trigger", stars: 3, category: "FUNCTIONS",
    description: "Los triggers de Pub/Sub disparan funciones cuando llega un mensaje a un topic. Ideal para procesamiento asíncrono.",
    objective: "Funciones asíncronas event-driven",
    tags: ["cloudEvent", "Pub/Sub", "async"],
    fileName: "pubsub-handler.ts",
    completed: false,
    explanationText: "Pub/Sub es como un buzón de correo empresarial: alguien deposita un mensaje (publica) y otro lo recoge cuando puede (suscriptor). Desacopla servicios.",
    codeSnippet:
`import { [INPUT_1] } from '@google-cloud/functions-framework';
import type { CloudEvent } from '@google-cloud/functions-framework';

[INPUT_2]('onNewUser', (event: CloudEvent<MessagePublishedData>) => {
  const message = event.data?.message;
  if (!message) return;

  // Los datos vienen en Base64
  const payload = JSON.parse(
    Buffer.from(message.[INPUT_3], 'base64').toString()
  );

  console.log('New user event:', [INPUT_4]);
});`,
    inputs: { INPUT_1: "cloudEvent", INPUT_2: "cloudEvent", INPUT_3: "data", INPUT_4: "payload" },
    completeCode: "cloudEvent('name', handler) | Buffer.from(msg.data, 'base64').toString()"
  },
  {
    id: 3, title: "Cloud Run: Containerizar una App Node.js", stars: 3, category: "CLOUD RUN",
    description: "Cloud Run ejecuta contenedores Docker sin gestionar servidores. Escala a cero automáticamente.",
    objective: "Dockerfile optimizado para Node.js",
    tags: ["Dockerfile", "Cloud Run", "multi-stage"],
    fileName: "Dockerfile",
    completed: false,
    explanationText: "Cloud Run es como un restaurante que solo abre cuando hay clientes (scale to zero) y puede abrir 1000 sucursales en segundos si hay cola (autoscaling).",
    codeSnippet:
`# Multi-stage build: imagen final más pequeña y segura
FROM node:20-[INPUT_1] AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Imagen de producción sin devDependencies
FROM node:20-alpine AS [INPUT_2]
WORKDIR /app
# Usuario no-root: MEJOR PRÁCTICA DE SEGURIDAD
[INPUT_3] node
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
# Cloud Run inyecta PORT automáticamente
[INPUT_4] 8080
CMD ["node", "dist/server.js"]`,
    inputs: { INPUT_1: "alpine", INPUT_2: "production", INPUT_3: "USER", INPUT_4: "EXPOSE" },
    completeCode: "Multi-stage Dockerfile | USER node (no root) | EXPOSE 8080 | Cloud Run inyecta PORT"
  },
  {
    id: 4, title: "IAM: Principio de Mínimo Privilegio", stars: 4, category: "IAM",
    description: "En GCP, cada servicio debe tener solo los permisos necesarios. Nunca usar la cuenta de servicio por defecto.",
    objective: "Service accounts y roles IAM",
    tags: ["IAM", "service account", "least privilege"],
    fileName: "deploy.sh",
    completed: false,
    explanationText: "Mínimo privilegio es como una tarjeta de empleado: el empleado de limpieza puede entrar al baño, no a la sala de servidores. Cada servicio solo accede a lo que necesita.",
    codeSnippet:
`# 1. Crear service account dedicada (NO usar default)
gcloud iam service-accounts create [INPUT_1]-sa \\
  --display-name="API Service Account"

# 2. Asignar SOLO el rol necesario (no roles/editor ni roles/owner)
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:[INPUT_2]-sa@$PROJECT_ID.iam.gserviceaccount.com" \\
  --role="[INPUT_3]/datastore.user"

# 3. Asignar la SA al Cloud Run service
gcloud run deploy my-api \\
  --service-account=[INPUT_4]-sa@$PROJECT_ID.iam.gserviceaccount.com \\
  --region=us-central1`,
    inputs: { INPUT_1: "api", INPUT_2: "api", INPUT_3: "roles", INPUT_4: "api" },
    completeCode: "SA dedicada | rol mínimo (roles/datastore.user no roles/editor) | --service-account"
  },
  {
    id: 5, title: "Cloud Logging: Structured Logging", stars: 3, category: "LOGGING",
    description: "Cloud Logging indexa y busca logs estructurados (JSON) mucho mejor que texto plano. Usa @google-cloud/logging.",
    objective: "Logs estructurados para producción",
    tags: ["Cloud Logging", "structured", "severity"],
    fileName: "utils/logger.ts",
    completed: false,
    explanationText: "Logs en texto plano son como buscar una palabra en un libro sin índice. Logs JSON estructurados son ese libro CON índice, filtros y búsqueda.",
    codeSnippet:
`// En Cloud Run/Functions: escribir a stdout con formato JSON
// Cloud Logging lo captura automáticamente
export const logger = {
  info: (message: string, data?: object) => {
    console.log(JSON.stringify({
      [INPUT_1]: 'INFO',
      message,
      ...data,
      timestamp: new Date().[INPUT_2]()
    }));
  },
  error: (message: string, error: Error) => {
    console.error(JSON.stringify({
      severity: '[INPUT_3]',
      message,
      [INPUT_4]: error.stack,
      errorMessage: error.message
    }));
  }
};`,
    inputs: { INPUT_1: "severity", INPUT_2: "toISOString", INPUT_3: "ERROR", INPUT_4: "stack_trace" },
    completeCode: "console.log(JSON.stringify({ severity, message, ...data })) — Cloud Logging captura"
  },
  {
    id: 6, title: "Secret Manager: Gestión de Secretos", stars: 4, category: "SECURITY",
    description: "Nunca hardcodees secretos ni los pongas en variables de entorno del código fuente. Usa Secret Manager.",
    objective: "Acceder a secretos desde Cloud Functions",
    tags: ["Secret Manager", "secretVersion", "security"],
    fileName: "utils/secrets.ts",
    completed: false,
    explanationText: "Secret Manager es como una caja fuerte bancaria para tus contraseñas y API keys. Solo el servicio autorizado puede abrirla, y queda un registro de quién accedió.",
    codeSnippet:
`import { SecretManagerServiceClient } from '@google-cloud/[INPUT_1]';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  const [version] = await client.[INPUT_2]({
    name: \`projects/\${process.env.PROJECT_ID}/secrets/\${secretName}/versions/[INPUT_3]\`
  });

  const payload = version.payload?.[INPUT_4];
  if (!payload) throw new Error(\`Secret \${secretName} not found\`);

  return Buffer.from(payload).toString('utf-8');
}

// Uso: const dbPassword = await getSecret('db-password');`,
    inputs: { INPUT_1: "secret-manager", INPUT_2: "accessSecretVersion", INPUT_3: "latest", INPUT_4: "data" },
    completeCode: "SecretManagerServiceClient | accessSecretVersion({ name: '.../latest' })"
  },
  {
    id: 7, title: "Cloud Monitoring: Alertas Personalizadas", stars: 4, category: "MONITORING",
    description: "Cloud Monitoring permite crear alertas cuando métricas superan umbrales: latencia alta, errores 5xx, etc.",
    objective: "Métricas custom con OpenTelemetry",
    tags: ["@opentelemetry", "Counter", "Histogram"],
    fileName: "utils/metrics.ts",
    completed: false,
    explanationText: "Las métricas son como el cuadro de instrumentos de un auto: velocímetro (latencia), nivel de combustible (memoria), temperatura (CPU). Sin ellos, manejas a ciegas.",
    codeSnippet:
`import { MeterProvider } from '@opentelemetry/[INPUT_1]';
import { CloudMonitoringMetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';

const meterProvider = new MeterProvider({
  exporter: new [INPUT_2]()
});

const meter = meterProvider.getMeter('my-service');

// Contador de requests
export const requestCounter = meter.[INPUT_3]('http_requests_total', {
  description: 'Total HTTP requests'
});

// Histograma de latencia
export const latencyHistogram = meter.createHistogram('[INPUT_4]_seconds', {
  description: 'Request latency'
});`,
    inputs: { INPUT_1: "sdk-metrics", INPUT_2: "CloudMonitoringMetricExporter", INPUT_3: "createCounter", INPUT_4: "request_duration" },
    completeCode: "OpenTelemetry + CloudMonitoringMetricExporter | createCounter | createHistogram"
  },
  {
    id: 8, title: "Cloud Run: Variables de Entorno Seguras", stars: 3, category: "CLOUD RUN",
    description: "Cloud Run puede montar secretos de Secret Manager como variables de entorno o volúmenes en el contenedor.",
    objective: "Montar secretos en Cloud Run",
    tags: ["--set-secrets", "Secret Manager", "env"],
    fileName: "deploy-cloudrun.sh",
    completed: false,
    explanationText: "Mala práctica muy común: poner secrets como variables de entorno hardcodeadas en el código o en el Dockerfile. La correcta: montarlos desde Secret Manager en deploy.",
    codeSnippet:
`# Montar secretos desde Secret Manager como env vars
gcloud run deploy my-api \\
  --image gcr.io/$PROJECT_ID/my-api:latest \\
  --region us-central1 \\
  --[INPUT_1]=DB_PASSWORD=db-password:[INPUT_2] \\
  --set-secrets=API_KEY=stripe-key:latest \\
  # Variables normales (no secretas) van aquí
  --[INPUT_3]-env-vars NODE_ENV=production,PORT=8080 \\
  --service-account=api-sa@$PROJECT_ID.iam.gserviceaccount.com \\
  # Limitar concurrencia y recursos
  --[INPUT_4]=80 \\
  --memory=512Mi`,
    inputs: { INPUT_1: "set-secrets", INPUT_2: "latest", INPUT_3: "set", INPUT_4: "concurrency" },
    completeCode: "--set-secrets=ENV_VAR=secret-name:latest | --set-env-vars | --concurrency"
  },
  {
    id: 9, title: "Firebase + GCP IAM: App Check + SA", stars: 4, category: "IAM",
    description: "Combinar Firebase App Check con GCP IAM crea una capa de seguridad doble: App Check verifica el cliente, IAM el servidor.",
    objective: "Arquitectura de seguridad multicapa",
    tags: ["App Check", "IAM", "token verification"],
    fileName: "middleware/verifyAppCheck.ts",
    completed: false,
    explanationText: "Arquitectura de seguridad en capas es como un edificio seguro: portero (App Check), tarjeta de acceso por piso (IAM), cámara en cada sala (Logging).",
    codeSnippet:
`import { getAppCheck } from 'firebase-admin/[INPUT_1]';

export async function verifyAppCheckToken(req: Request, res: Response, next: NextFunction) {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    return res.status(401).json({ error: 'App Check token required' });
  }

  try {
    await getAppCheck().[INPUT_2](appCheckToken);
    [INPUT_3](); // token válido, continuar
  } catch (err) {
    return res.status([INPUT_4]).json({ error: 'Invalid App Check token' });
  }
}`,
    inputs: { INPUT_1: "app-check", INPUT_2: "verifyToken", INPUT_3: "next", INPUT_4: "401" },
    completeCode: "getAppCheck().verifyToken(token) | header 'X-Firebase-AppCheck'"
  },
  {
    id: 10, title: "Cloud Tasks: Tareas Diferidas", stars: 4, category: "FUNCTIONS",
    description: "Cloud Tasks encola tareas para ejecución diferida o programada. Útil para emails, reportes y procesamiento heavy.",
    objective: "Tareas asíncronas con reintentos",
    tags: ["Cloud Tasks", "queue", "retry"],
    fileName: "services/taskService.ts",
    completed: false,
    explanationText: "Cloud Tasks es como dejar una nota de trabajo para después: 'procesa este PDF en 5 minutos'. Si falla, GCP lo reintenta automáticamente hasta N veces.",
    codeSnippet:
`import { CloudTasksClient } from '@google-cloud/[INPUT_1]';

const client = new CloudTasksClient();

export async function enqueueEmailTask(userId: string, template: string) {
  const parent = client.queuePath(PROJECT_ID, REGION, 'email-queue');

  const task = {
    httpRequest: {
      httpMethod: '[INPUT_2]' as const,
      url: \`\${WORKER_URL}/tasks/send-email\`,
      body: Buffer.from(JSON.stringify({ userId, template })).[INPUT_3]('base64'),
      headers: { 'Content-Type': 'application/json' }
    },
    // Retraso de 30 segundos
    scheduleTime: {
      seconds: Date.now() / 1000 + [INPUT_4]
    }
  };

  await client.createTask({ parent, task });
}`,
    inputs: { INPUT_1: "tasks", INPUT_2: "POST", INPUT_3: "toString", INPUT_4: "30" },
    completeCode: "CloudTasksClient | queuePath | httpRequest con body en base64 | scheduleTime"
  },
  {
    id: 11, title: "VPC Connector: Cloud Run + Firestore Privado", stars: 5, category: "NETWORKING",
    description: "Para máxima seguridad, Firestore puede configurarse en modo privado, accesible solo via VPC desde Cloud Run.",
    objective: "Red privada entre servicios GCP",
    tags: ["VPC", "private networking", "Firestore"],
    fileName: "networking.sh",
    completed: false,
    explanationText: "VPC Connector es como un túnel privado entre tus servicios. El tráfico nunca sale a internet público, igual que la intranet de una empresa.",
    codeSnippet:
`# Crear VPC Connector
gcloud compute networks vpc-access connectors create [INPUT_1]-connector \\
  --region=us-central1 \\
  --subnet=my-subnet

# Deploy Cloud Run con VPC Connector
gcloud run deploy my-api \\
  --[INPUT_2]-vpc-connector=my-connector \\
  --vpc-egress=[INPUT_3] \\
  --image gcr.io/$PROJECT_ID/my-api

# Regla de firewall: solo Cloud Run puede acceder
gcloud compute firewall-rules create allow-cloudrun-firestore \\
  --[INPUT_4]=INGRESS \\
  --source-service-accounts=api-sa@$PROJECT_ID.iam.gserviceaccount.com \\
  --allow=tcp:443`,
    inputs: { INPUT_1: "cloudrun", INPUT_2: "vpc", INPUT_3: "private-ranges-only", INPUT_4: "direction" },
    completeCode: "vpc-access connector | --vpc-egress=private-ranges-only | firewall-rules ingress"
  },
  {
    id: 12, title: "CI/CD con Cloud Build", stars: 4, category: "DEVOPS",
    description: "Cloud Build es el CI/CD nativo de GCP. Se integra con GitHub/GitLab y despliega automáticamente en Cloud Run.",
    objective: "Pipeline CI/CD en GCP",
    tags: ["cloudbuild.yaml", "Cloud Build", "CD"],
    fileName: "cloudbuild.yaml",
    completed: false,
    explanationText: "Cloud Build es como una línea de ensamblaje automatizada: cada push a main construye, prueba y despliega tu app sin intervención manual.",
    codeSnippet:
`# cloudbuild.yaml
steps:
  # 1. Instalar dependencias y correr tests
  - name: 'node:20'
    entrypoint: npm
    args: ['[INPUT_1]']
  - name: 'node:20'
    entrypoint: npm
    args: ['[INPUT_2]']

  # 2. Build Docker image
  - name: 'gcr.io/cloud-builders/[INPUT_3]'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-api:$COMMIT_SHA', '.']

  # 3. Push y Deploy a Cloud Run
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-api:$COMMIT_SHA']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args: ['run', 'deploy', 'my-api', '--image', 'gcr.io/$PROJECT_ID/my-api:$COMMIT_SHA',
           '--region', 'us-central1', '--[INPUT_4]']

images: ['gcr.io/$PROJECT_ID/my-api:$COMMIT_SHA']`,
    inputs: { INPUT_1: "ci", INPUT_2: "test", INPUT_3: "docker", INPUT_4: "quiet" },
    completeCode: "cloudbuild.yaml: npm ci → npm test → docker build → docker push → gcloud run deploy"
  }
];
