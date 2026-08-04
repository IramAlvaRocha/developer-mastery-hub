# AWS — Playbook de la sección (Fase 1: Fundamentos)

> Autoría de contenido: agente `aws-content-author` (ver `.opencode/agent/aws-content-author.md`).
> Fuentes: `D:\Projects\scrapping\temario.md` (índice) y `D:\Projects\scrapping\subtitulos_es\`
> (transcripciones del instructor, UTF-8).

## Objetivo de la Fase 1

Crear los 5 módulos de **fundamentos** del curso DVA-C02, con el grupo **AWS** dentro de Cloud
en el catálogo.

## Módulos y mapeo al temario

| Módulo (slug) | Archivo | Secciones temario | Subtítulos (carpeta) | Ejercicios |
|---|---|---|---|---|
| `aws-iam` | `src/data/modules/aws-iam.ts` | 4 (IAM y CLI), 12 (CLI/SDK/IAM roles) | `04 - IAM y CLI de AWS`, `12 - CLI de AWS, SDK, roles y políticas de IAM` | ~16 |
| `aws-ec2` | `src/data/modules/aws-ec2.ts` | 5 (Fundamentos de EC2) | `05 - Fundamentos de EC2` | ~14 |
| `aws-storage` | `src/data/modules/aws-storage.ts` | 6 (Almacenamiento de Instancias EC2) | `06 - Almacenamiento de Instancias EC2` | ~10 |
| `aws-elb-asg` | `src/data/modules/aws-elb-asg.ts` | 7 (ELB + ASG) | `07 - Fundamentos de AWS_ ELB + ASG` | ~14 |
| `aws-s3` | `src/data/modules/aws-s3.ts` | 11 (S3), 13 (S3 Avanzado), 14 (Seguridad S3) | `11 - Introducción a Amazon S3`, `13 - Amazon S3 Avanzado`, `14 - Seguridad de Amazon S3` | ~18 |

## Formato recomendado por módulo

- **aws-iam**: context-dropdown (políticas JSON), prediction (CLI), true-false (MFA/roles),
  snippet-pick (política mínima privilegio vs permisiva), legacy [INPUT_N] (comandos CLI).
- **aws-ec2**: prediction (user-data/SSH), ordering (crear instancia → SG → conectar),
  true-false (opciones de compra), legacy (CLI/SSH), bug-hunt (SG abierto).
- **aws-storage**: matching (EBS/EFS/Instance Store ↔ caso de uso), true-false
  (tipos de volumen), ordering (snapshot → AMI), prediction (CLI), snippet-pick (EFS vs EBS).
- **aws-elb-asg**: matching (ALB/NLB/GWLB ↔ caso de uso), prediction (sticky/SSL),
  ordering (ASG scaling), true-false (health checks), snippet-pick (config ASG).
- **aws-s3**: context-dropdown (política de bucket), prediction (CLI/clases de almacenamiento),
  matching (clase ↔ caso de uso), ordering (ciclo de vida), true-false (versionado/replicación),
  bug-hunt (bucket público), snippet-pick (cifrado correcto).

## Registro en el catálogo (lo hace el orquestador)

1. `src/data/index.ts`: importar los 5 módulos y añadirlos a `ALL_MODULES` con:
   `group: "AWS"`, `color` sugerido: `aws-iam` "orange", `aws-ec2` "amber",
   `aws-storage` "sky", `aws-elb-asg` "orange", `aws-s3` "orange".
2. `ModuleMenu.tsx`: añadir `GROUP_META["AWS"]` (`icon: "☁️"`, `color: "orange"`, desc)
   y `ROUTE_CATEGORIES` (p. ej. nueva categoría "Cloud" o dentro de "Plataforma").
3. Verificación: build + security-check + catálogo completo.

## Criterio de calidad (estándar del proyecto)

- Teoría fiel a los subtítulos del instructor + analogía 🌍 + porqué.
- 2-4 formatos por módulo, elegidos por tema (no monocromo).
- IDs únicos por módulo (1..N), progreso estable.
- Build limpio y sin console.log.
