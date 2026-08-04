# AWS — Playbook de la sección

> Autoría de contenido: agente `aws-content-author` (ver `.opencode/agent/aws-content-author.md`).
> Fuentes: `D:\Projects\scrapping\temario.md` (índice) y `D:\Projects\scrapping\subtitulos_es\`
> (transcripciones del instructor, UTF-8).

## Objetivo

Crear los módulos del curso DVA-C02, con el grupo **AWS** dentro de Cloud en el catálogo.

## Flujo de ramas (obligatorio)

Cada fase se trabaja y sube en **su propia rama**:

1. Crear la rama de la fase desde `Update2` (rama de integración):
   `git checkout -b feat/aws/fase-N`
2. Trabajar la fase en esa rama (módulos + integración + calidad).
3. Al terminar: commit + `git push -u origin feat/aws/fase-N`.
4. La rama queda lista para PR a `Update2` (o a `main` si se decide).
5. `Update2` siempre queda limpio y sincronizado.

Fases ya versionadas: `feat/aws/fase-1` (Fundamentos), `feat/aws/fase-2` (Datos y red), `feat/aws/fase-3` (Serverless, en curso).

## Fase 1 (completada ✅) — Fundamentos

| Módulo (slug) | Archivo | Secciones temario | Ejercicios |
|---|---|---|---|
| `aws-iam` | `src/data/modules/aws-iam.ts` | 4, 12 | 18 |
| `aws-ec2` | `src/data/modules/aws-ec2.ts` | 5 | 17 |
| `aws-storage` | `src/data/modules/aws-storage.ts` | 6 | 12 |
| `aws-elb-asg` | `src/data/modules/aws-elb-asg.ts` | 7 | 16 |
| `aws-s3` | `src/data/modules/aws-s3.ts` | 11, 13, 14 | 20 |

## Fase 2 (completada ✅) — Datos y red

| Módulo (slug) | Archivo | Secciones temario | Ejercicios |
|---|---|---|---|
| `aws-rds` | `src/data/modules/aws-rds.ts` | 8 (RDS + Aurora + ElastiCache) | 14 |
| `aws-route53` | `src/data/modules/aws-route53.ts` | 9 (Route 53) | 14 |
| `aws-vpc` | `src/data/modules/aws-vpc.ts` | 10 (Fundamentos de la VPC) | 12 |
| `aws-cloudfront` | `src/data/modules/aws-cloudfront.ts` | 15 (CloudFront) | 12 |

## Fase 3 (en curso) — Serverless

| Módulo (slug) | Archivo | Secciones temario | Subtítulos (carpeta) | Ejercicios |
|---|---|---|---|---|
| `aws-lambda` | `src/data/modules/aws-lambda.ts` | 21 (Lambda) | `21 - AWS Serverless_ Lambda` | ~20 |
| `aws-dynamodb` | `src/data/modules/aws-dynamodb.ts` | 22 (DynamoDB) | `22 - AWS Serverless_ Dynamo DB` | ~16 |
| `aws-api-gateway` | `src/data/modules/aws-api-gateway.ts` | 23 (API Gateway) | `23 - AWS Serverless_ API Gateway` | ~14 |
| `aws-messaging` | `src/data/modules/aws-messaging.ts` | 20 (SQS/SNS/Kinesis) + 19 (CloudWatch/EventBridge) | `20 - Integración y mensajería en AWS_ SQS, SNS, Kinesis` | ~16 |

### Formato recomendado por módulo

- **aws-lambda**: prediction (invocaciones síncronas/asíncronas, DLQ, eventos), ordering (crear función → trigger → test → logs), true-false (concurrencia, VPC, versiones/alias, límites), snippet-pick (buenas prácticas), context-dropdown (config de la función), legacy (CLI).
- **aws-dynamodb**: true-false (WCU/RCU, GSI/LSI, DAX, TTL, streams), prediction (operaciones/consistencia, PartiQL), ordering (crear tabla → índices → streams), matching (concepto ↔ caso de uso), bug-hunt (tabla sin clave primaria correcta).
- **aws-api-gateway**: prediction (etapas/deploy, integraciones, caché, auth), ordering (crear API → recursos → métodos → etapas), true-false (REST vs HTTP vs WebSocket, plan de uso, claves API), matching (tipo de integración ↔ caso de uso).
- **aws-messaging**: matching (SQS/SNS/Kinesis/EventBridge ↔ caso de uso), true-false (FIFO, visibilidad, fan-out, shards), prediction (SQS delays, DLQ, Kinesis consumer), ordering (fan-out SNS→SQS), snippet-pick (cola segura/config correcta).

## Registro en el catálogo (lo hace el orquestador)

1. `src/data/index.ts`: importar los módulos y añadirlos a `ALL_MODULES` con `group: "AWS"`.
   Colores sugeridos Fase 3: `aws-lambda` "amber", `aws-dynamodb` "purple", `aws-api-gateway` "rose", `aws-messaging` "sky".
2. `ModuleMenu.tsx`: el grupo AWS ya está en `GROUP_META` y `ROUTE_CATEGORIES` (Plataforma).
3. Verificación: build + security-check + catálogo completo.

## Criterio de calidad (estándar del proyecto)

- Teoría fiel a los subtítulos del instructor + analogía 🌍 + porqué.
- 2-4 formatos por módulo, elegidos por tema (no monocromo).
- IDs únicos por módulo (1..N), progreso estable.
- Build limpio y sin console.log.
