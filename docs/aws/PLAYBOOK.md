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

Fases ya versionadas: `feat/aws/fase-1` (Fundamentos), `feat/aws/fase-2` (Datos y red).

## Fase 1 (completada ✅) — Fundamentos

| Módulo (slug) | Archivo | Secciones temario | Ejercicios |
|---|---|---|---|
| `aws-iam` | `src/data/modules/aws-iam.ts` | 4, 12 | 18 |
| `aws-ec2` | `src/data/modules/aws-ec2.ts` | 5 | 17 |
| `aws-storage` | `src/data/modules/aws-storage.ts` | 6 | 12 |
| `aws-elb-asg` | `src/data/modules/aws-elb-asg.ts` | 7 | 16 |
| `aws-s3` | `src/data/modules/aws-s3.ts` | 11, 13, 14 | 20 |

## Fase 2 (en curso) — Datos y red

| Módulo (slug) | Archivo | Secciones temario | Subtítulos (carpeta) | Ejercicios |
|---|---|---|---|---|
| `aws-rds` | `src/data/modules/aws-rds.ts` | 8 (RDS + Aurora + ElastiCache) | `08 - Fundamentos de AWS_ RDS + Aurora + ElastiCache` | ~12 |
| `aws-route53` | `src/data/modules/aws-route53.ts` | 9 (Route 53) | `09 - Route 53` | ~12 |
| `aws-vpc` | `src/data/modules/aws-vpc.ts` | 10 (Fundamentos de la VPC) | `10 - Fundamentos de la VPC` | ~10 |
| `aws-cloudfront` | `src/data/modules/aws-cloudfront.ts` | 15 (CloudFront) | `15 - CloudFront` | ~10 |

### Formato recomendado por módulo

- **aws-rds**: true-false (réplicas vs Multi-AZ, backups), matching (RDS/Aurora/ElastiCache/MemoryDB ↔ caso de uso), prediction (read replica), ordering (promover réplica → failover), legacy (CLI).
- **aws-route53**: prediction (TTL/CNAME vs Alias), matching (política de enrutamiento ↔ caso de uso), ordering (registrar dominio → zona → registros), true-false (health checks, geoproximidad), context-dropdown (tipo de registro).
- **aws-vpc**: matching (subred/IGW/NAT/NACL/SG ↔ función), true-false (NACL stateless vs SG stateful, flujo de tráfico), ordering (crear VPC → subredes → IGW → ruteo), bug-hunt (NACL/SG mal configurado), prediction (gateways).
- **aws-cloudfront**: prediction (caché/edge), ordering (crear distribución → origin → behaviors → invalidación), true-false (geo restriction, signed URLs vs cookies), matching (tipo de contenido ↔ política de caché), snippet-pick (URL firmada).

## Registro en el catálogo (lo hace el orquestador)

1. `src/data/index.ts`: importar los módulos y añadirlos a `ALL_MODULES` con `group: "AWS"`.
   Colores sugeridos Fase 2: `aws-rds` "sky", `aws-route53` "green", `aws-vpc` "cyan", `aws-cloudfront` "blue".
2. `ModuleMenu.tsx`: el grupo AWS ya está en `GROUP_META` y `ROUTE_CATEGORIES` (Plataforma).
3. Verificación: build + security-check + catálogo completo.

## Criterio de calidad (estándar del proyecto)

- Teoría fiel a los subtítulos del instructor + analogía 🌍 + porqué.
- 2-4 formatos por módulo, elegidos por tema (no monocromo).
- IDs únicos por módulo (1..N), progreso estable.
- Build limpio y sin console.log.
