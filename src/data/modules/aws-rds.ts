import type { Exercise } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// AWS RDS + Aurora + ElastiCache — Fase 2: Datos y red (DVA-C02, sección 08)
// Fiel a los subtítulos de: 080 a 091 (RDS, réplicas, Multi-AZ, Aurora,
// seguridad, RDS Proxy, ElastiCache y MemoryDB)
// ──────────────────────────────────────────────────────────────────────────

export const AWS_RDS_EXERCISES: Exercise[] = [
  // ────────────────────────────────────────────────────────────────────────
  // ─── RDS (080: visión general, 082: práctica) ───────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "RDS: una base de datos que AWS cuida por ti",
    stars: 1,
    category: "RDS",
    description:
      "RDS es el servicio de base de datos relacional gestionado: tú usas SQL, AWS hace el resto.",
    objective: "Entender qué es RDS y qué motores gestiona",
    tags: ["RDS", "base de datos gestionada", "SQL"],
    fileName: "rds-basics",
    completed: false,
    theory: `📚 TEORÍA: Amazon RDS (080)

RDS significa **Relational Database Service** (servicio de base de datos
relacional) y es un servicio **gestionado**: AWS se encarga de mantener
la base de datos para que utilices SQL como lenguaje de consulta.

Motores soportados por RDS:
  • PostgreSQL, MySQL y MariaDB (de código abierto)
  • Oracle y Microsoft SQL Server
  • Aurora (base de datos propia de AWS)

La palabra clave es **gestionado**: AWS hace por ti el aprovisionamiento,
los parches del sistema operativo, las copias de seguridad y la
monitorización. A cambio, **no puedes acceder por SSH** a la instancia:
no la controlas, la cuida AWS.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un restaurante con chef incluido: tú pides (SQL), y el chef se encarga de los fogones, la limpieza y los proveedores. No puedes entrar a la cocina a cocinar tú: eso es lo que significa 'gestionado'.\n\nRDS te quita el trabajo operativo de una base de datos (parches, backups, monitorización), pero por eso mismo no hay SSH: no hay acceso a la máquina subyacente. Elegir RDS es elegir menos control y menos mantenimiento.",
    codeSnippet: `RDS = Relational Database [INPUT_1].

Es un servicio de base de datos [INPUT_2] (gestionado):
AWS hace el aprovisionamiento, los parches y las copias de seguridad.

Motores soportados: PostgreSQL, [INPUT_3], MariaDB, Oracle,
SQL Server y Aurora.

Contra del servicio gestionado: NO puedes acceder por [INPUT_4]
a la instancia de la base de datos.`,
    inputs: {
      INPUT_1: "Service",
      INPUT_2: "gestionado",
      INPUT_3: ["MySQL", "mysql"],
      INPUT_4: "SSH",
    },
    completeCode: "RDS = Relational Database Service | gestionado | motores SQL | sin acceso SSH",
  },

  {
    id: 2,
    title: "Ventajas de un servicio gestionado (y su límite)",
    stars: 1,
    category: "RDS",
    description:
      "Parches automáticos, backups continuos y point-in-time restore: eso ganas al delegar en RDS.",
    objective: "Distinguir qué hace AWS y qué no hace por ti con RDS",
    tags: ["parcheo", "backups", "point-in-time", "gestionado"],
    fileName: "rds-basics",
    completed: false,
    theory: `📚 TEORÍA: Lo que RDS hace por ti (080)

Ventajas de usar RDS frente a montar la BD en una instancia EC2:
  • **Aprovisionamiento automatizado** y **parcheo del sistema operativo**
  • **Copias de seguridad continuas** con restauración en un punto
    concreto del tiempo (**point-in-time restore**)
  • Dashboard de **monitorización**
  • Réplicas de lectura optimizadas para rendimiento de lectura
  • Configuración Multi-AZ para **recuperación de desastres (DR)**
  • Ventanas de mantenimiento para las actualizaciones
  • Escalado **vertical** (más recursos en la misma BD) y **horizontal**
    (añadir más bases de datos)

El precio de todas estas ventajas: **no hay acceso SSH**. Es un servicio
gestionado por AWS, así que no puedes tocar la máquina.`,
    explanationText:
      "🌍 Ejemplo cotidiano: contratar un servicio de alquiler de coches con mantenimiento incluido: te cambian el aceite (parches), revisan el motor (monitorización) y te dan un coche de repuesto si se avería (failover). A cambio, no puedes abrir el capó tú mismo.\n\nRDS automatiza las tareas que un DBA hace a mano (parches, backups, escalado) y elimina errores humanos. Pero si necesitas controlar el SO o instalar software dentro de la máquina, RDS no es la opción: eso sería EC2 o RDS Custom.",
    codeSnippet: "// Valida qué hace y qué NO hace Amazon RDS por ti",
    inputs: {},
    completeCode: "Parches + backups + point-in-time restore | escalado vertical/horizontal | sin SSH",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre Amazon RDS.",
      statements: [
        {
          id: "a",
          text: "RDS aplica los parches del sistema operativo de forma automatizada.",
          answer: true,
          explanation: "Es un servicio gestionado: el parcheo del SO lo hace AWS.",
        },
        {
          id: "b",
          text: "Con RDS puedes conectarte por SSH a la instancia para instalar lo que quieras.",
          answer: false,
          explanation: "No hay SSH en RDS: es un servicio gestionado por AWS (solo RDS Custom lo permite).",
        },
        {
          id: "c",
          text: "RDS realiza copias de seguridad continuas y permite restaurar la base de datos a un momento concreto (point-in-time restore).",
          answer: true,
          explanation: "Los backups automatizados permiten restaurar a cualquier punto dentro de la retención.",
        },
        {
          id: "d",
          text: "RDS escala de forma vertical (más CPU/RAM en la misma BD) y horizontal (más bases de datos).",
          answer: true,
          explanation: "Vertical mejora la propia BD; horizontal añade más instancias de BD.",
        },
      ],
    },
  },

  {
    id: 3,
    title: "Auto-escalado de almacenamiento: la BD crece sola",
    stars: 2,
    category: "RDS",
    description:
      "Si la BD se queda sin espacio, RDS escala el almacenamiento solo: sin que nadie toque la consola.",
    objective: "Conocer las condiciones del auto-escalado de almacenamiento",
    tags: ["auto-scaling", "almacenamiento", "free storage"],
    fileName: "rds-storage",
    completed: false,
    theory: `📚 TEORÍA: Auto-escalado de almacenamiento (080)

Una base de datos puede crecer mucho, y no puede haber una persona
mirando cada mes si el almacenamiento va a bastar. Por eso RDS
**auto-escala el almacenamiento** de forma totalmente dinámica.

Condiciones para que escale (¡punto importante de examen!):
  • El almacenamiento gratuito es inferior al **10%** del almacenamiento
    asignado
  • Ese almacenamiento bajo dura al menos **5 minutos**
  • Y han pasado **6 horas desde la última modificación**

Tú defines el **umbral máximo** de almacenamiento: el límite al que la
BD puede llegar por mucho que escale. Es ideal para aplicaciones con
**cargas de trabajo imprevisibles**, donde la situación puede cambiar
en segundos.

Todos los motores de RDS (MySQL, MariaDB, PostgreSQL, SQL Server,
Oracle) soportan el auto-escalado de almacenamiento.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un depósito de agua con sensor: cuando el nivel cae del 10%, la cisterna se rellena sola, pero siempre hasta el tope máximo que marcaste (el umbral). Tú solo pones el límite y el sensor hace el resto.\n\nSin auto-escalado, una BD llena se queda bloqueada en el peor momento: picos imprevisibles de usuarios. Con él, RDS amplía el almacenamiento automáticamente si el espacio libre baja del 10% durante 5 minutos y han pasado 6 h desde la última modificación: memoria rápida para el examen.",
    codeSnippet: `// Tu base de datos RDS se está quedando sin espacio:
// el almacenamiento gratuito ha bajado del 10% durante
// más de 5 minutos. Además, no has modificado nada en 6 horas.`,
    inputs: {},
    completeCode: "Escala si free storage < 10% durante 5 min y han pasado 6 h desde la última modificación",
    format: "prediction",
    prediction: {
      prompt: "¿Qué hará Amazon RDS en esta situación?",
      snippet: `// Free storage < 10% del asignado durante más de 5 minutos.
// Han pasado más de 6 horas desde la última modificación.`,
      options: [
        "Escalará el almacenamiento de forma automática hasta el umbral máximo configurado",
        "Bloqueará las escrituras hasta que liberes espacio manualmente",
        "Terminará la instancia para evitar que se corrompa",
        "Esperará a que tú modifiques el almacenamiento desde la consola",
      ],
      answer:
        "Escalará el almacenamiento de forma automática hasta el umbral máximo configurado",
    },
  },

  {
    id: 4,
    title: "Backups automatizados: tu máquina del tiempo",
    stars: 2,
    category: "RDS",
    description:
      "Los backups automatizados con retención permiten restaurar a cualquier punto del tiempo.",
    objective: "Entender la retención de backups y la protección contra eliminación",
    tags: ["backups", "retención", "point-in-time", "deletion protection"],
    fileName: "rds-backups",
    completed: false,
    theory: `📚 TEORÍA: Backups de RDS (080 y 082)

En la práctica del curso, al crear la BD se configura:
  • **Copias de seguridad automatizadas** con un **periodo de retención**
    configurable (el instructor deja 7 días; el rango llega hasta 35
    y se puede deshabilitar dejándolo en 0)
  • Un **periodo de copia de seguridad** dentro de una ventana temporal
  • Exportación de logs: de auditoría, de errores, de consultas lentas...
    (se pueden enviar a CloudWatch Logs)

Los backups automatizados permiten el **point-in-time restore**:
restaurar la BD a cualquier momento dentro del periodo de retención.

Además, RDS tiene la **protección contra la eliminación** (deletion
protection): mientras esté activada, no puedes borrar la base de datos
por accidente. Para eliminarla hay que modificar la BD y quitar el check.

En el curso, la BD demo cuesta ~14-15 $/mes fuera de la capa gratuita.`,
    explanationText:
      "🌍 Ejemplo cotidiano: el historial de versiones de un documento: cada día se guarda una copia y puedes volver al estado de cualquier día dentro del periodo contratado. La protección contra eliminación es el candado que evita borrar el documento por un clic accidental.\n\nLos backups automatizados son la red de seguridad del dato: con retención de hasta 35 días puedes restaurar a cualquier segundo dentro de la ventana. Y la deletion protection evita el accidente clásico de borrar la BD de producción: primero se modifica la instancia para quitarla.",
    codeSnippet: "// Valida cómo funcionan los backups de RDS",
    inputs: {},
    completeCode: "Backups automatizados (retención 7-35 días) | point-in-time restore | protección contra eliminación",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre los backups de RDS.",
      statements: [
        {
          id: "a",
          text: "El periodo de retención de los backups automatizados se configura al crear la BD (en la práctica, de 7 a 35 días).",
          answer: true,
          explanation: "El instructor usa 7 días; el rango es 7-35, y 0 deshabilita los backups.",
        },
        {
          id: "b",
          text: "Con backups automatizados puedes restaurar la base de datos a un momento concreto dentro del periodo de retención.",
          answer: true,
          explanation: "Es el point-in-time restore que menciona el instructor en la visión general.",
        },
        {
          id: "c",
          text: "La protección contra eliminación permite borrar la base de datos sin pasos extra.",
          answer: false,
          explanation: "Mientras está activa impide la eliminación: hay que modificarla y quitarla primero.",
        },
        {
          id: "d",
          text: "RDS puede exportar logs (auditoría, errores, consultas lentas) para aumentar la visibilidad de la base de datos.",
          answer: true,
          explanation: "Se configuran en la creación y pueden enviarse a CloudWatch Logs.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── RÉPLICAS DE LECTURA Y MULTI-AZ (081) ────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 5,
    title: "Réplicas de lectura: escalar el SELECT",
    stars: 2,
    category: "RÉPLICAS",
    description:
      "Cuando la BD no da abasto con las lecturas, las réplicas de lectura reparten el trabajo.",
    objective: "Saber cuándo y cómo usar las réplicas de lectura",
    tags: ["read replicas", "lecturas", "eventual consistency"],
    fileName: "rds-read-replica",
    completed: false,
    theory: `📚 TEORÍA: Réplicas de lectura (081)

Si tu base de datos ya no puede escalar en cuanto a **lecturas**,
aparecen las **réplicas de lectura** (read replicas).

Características clave:
  • Replican de forma **asíncrona** desde la BD principal: las lecturas
    son **finalmente consistentes** (la réplica va un poco por detrás)
  • Se usan **solo para lecturas** (SELECT): nada de INSERT/UPDATE/DELETE
  • Pueden estar en la misma AZ, en otra AZ o incluso en otra región
  • **Promovibles**: una réplica puede convertirse en su propia base de
    datos maestra
  • La aplicación debe **actualizar la cadena de conexión** para enviar
    las lecturas hacia las réplicas

Caso de uso clásico: una BD de producción con carga normal y una
aplicación de **informes/reportes** que necesita hacer análisis. Creas
una réplica de lectura y ejecutas los reportes allí: la aplicación de
producción no se ve afectada.

Coste: replicar **dentro de la misma región es gratuito**; replicar
entre regiones tiene coste de transferencia.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un quiosco con una sola ventanilla que se llena de gente que solo pregunta (lecturas). Pones una segunda ventanilla que reparte el catálogo (réplica) y la principal sigue atendiendo a quien compra (escrituras).\n\nLas réplicas escalan la parte de lectura sin tocar la escritura, pero al ser asíncronas pueden devolver datos ligeramente antiguos (eventual consistency): perfectas para reportes, no para operaciones que requieran el dato exacto al segundo.",
    codeSnippet: `// Tu BD de producción (lecturas + escrituras) recibe carga normal.
// El equipo de datos quiere ejecutar reportes de análisis
// sin afectar a la aplicación de producción.`,
    inputs: {},
    completeCode: "Crear réplica de lectura → ejecutar reportes ahí | producción intacta | solo SELECT",
    format: "prediction",
    prediction: {
      prompt: "¿Cuál es la solución que propone el instructor para este caso de uso?",
      snippet: `// BD de producción: operaciones de lectura y escritura.
// Nueva carga de trabajo: informes y reportes de análisis.`,
      options: [
        "Crear una réplica de lectura y ejecutar los reportes en ella",
        "Convertir la BD en Multi-AZ para repartir las escrituras",
        "Añadir un bucket S3 y mover toda la BD allí",
        "Aumentar la CPU de la BD principal (escalado vertical)",
      ],
      answer: "Crear una réplica de lectura y ejecutar los reportes en ella",
    },
  },

  {
    id: 6,
    title: "Réplicas de lectura vs Multi-AZ: la pregunta de examen",
    stars: 3,
    category: "RÉPLICAS",
    description:
      "Una escala lecturas; la otra da alta disponibilidad. No son lo mismo, aunque el examen intente confundirte.",
    objective: "Diferenciar réplicas de lectura y Multi-AZ al detalle",
    tags: ["read replicas", "Multi-AZ", "failover", "DR"],
    fileName: "rds-multi-az",
    completed: false,
    theory: `📚 TEORÍA: Réplicas de lectura vs Multi-AZ (081)

**Réplicas de lectura:**
  • Replicación **asíncrona** → eventual consistency
  • Escalan **lecturas** (solo SELECT)
  • Hasta 5 réplicas en RDS (en Aurora, 15)
  • Pueden promoverse a base de datos maestra
  • Replicación en la misma región: gratis

**Multi-AZ (alta disponibilidad):**
  • Replicación **síncrona** a una instancia en espera (standby)
    en otra zona de disponibilidad
  • **No escala lecturas**: nadie lee ni escribe en la standby, solo
    está ahí para la **conmutación por error** (failover)
  • Failover **automático**: la app se conecta a un **nombre DNS** que
    apunta a la BD maestra; si cae, el DNS redirige a la standby sin
    que la app cambie nada
  • Sirve para **recuperación de desastres (DR)**
  • Pasar de single-AZ a Multi-AZ es una operación **sin tiempo de
    inactividad**: clic en Modificar, se toma un snapshot, se restaura
    en la otra AZ y se establece la sincronización

⚠️ Pregunta común de examen: **las réplicas de lectura SÍ pueden
configurarse como Multi-AZ** para recuperación de desastres.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Multi-AZ es un copiloto con los mandos conectados en paralelo (si el piloto se desmaya, el copiloto toma el mando al instante); una réplica de lectura es un segundo mapa que los pasajeros pueden consultar (escala las consultas, pero no conduce).\n\nEl matiz que debes llevar al examen: la réplica de lectura está para repartir SELECTs (asíncrona); la standby Multi-AZ está para que no se caiga el servicio (síncrona y en espera). Y ojo: una réplica de lectura también puede configurarse como Multi-AZ para hacer de DR.",
    codeSnippet: "// Valida la diferencia entre réplicas de lectura y Multi-AZ",
    inputs: {},
    completeCode: "Réplicas = asíncronas, escalan lecturas | Multi-AZ = síncronas, solo failover | réplicas configurables como Multi-AZ",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre réplicas de lectura y Multi-AZ.",
      statements: [
        {
          id: "a",
          text: "Multi-AZ replica de forma síncrona a una instancia en espera en otra AZ; las réplicas de lectura replican de forma asíncrona.",
          answer: true,
          explanation: "Síncrona (Multi-AZ) garantiza cero pérdida; asíncrona (réplicas) da eventual consistency.",
        },
        {
          id: "b",
          text: "Las réplicas de lectura escalan las lecturas, mientras que Multi-AZ no escala lecturas.",
          answer: true,
          explanation: "La standby Multi-AZ solo está para el failover: nadie puede leer ni escribir en ella.",
        },
        {
          id: "c",
          text: "En una configuración Multi-AZ, la base de datos en espera se usa para repartir lecturas entre los usuarios.",
          answer: false,
          explanation: "La standby no sirve lecturas: está en espera únicamente para la conmutación por error.",
        },
        {
          id: "d",
          text: "Las réplicas de lectura pueden configurarse como Multi-AZ para recuperación de desastres.",
          answer: true,
          explanation: "Es una pregunta de examen muy común según el instructor: sí se puede.",
        },
        {
          id: "e",
          text: "Pasar una BD RDS de una AZ a Multi-AZ requiere detenerla y crear una nueva base de datos.",
          answer: false,
          explanation: "Es una operación sin downtime: se modifica la BD y AWS gestiona el snapshot y la sincronización.",
        },
      ],
    },
  },

  {
    id: 7,
    title: "De réplica a maestra: promoción y cadena de conexión",
    stars: 3,
    category: "RÉPLICAS",
    description:
      "Cuando la maestra falla, una réplica puede promoverse a maestra... pero la app debe apuntar al nuevo destino.",
    objective: "Reconstruir el flujo de promoción de una réplica de lectura",
    tags: ["promoción", "connection string", "failover"],
    fileName: "rds-promote",
    completed: false,
    theory: `📚 TEORÍA: Promover una réplica (081)

Las réplicas de lectura pueden ser **promovidas a su propia base de
datos**. El flujo típico de recuperación:

  1. Crear la réplica de lectura (replicación asíncrona desde la BD
     principal)
  2. Dejar que la replicación alcance a la réplica (eventual
     consistency: la réplica va un poco por detrás)
  3. Cuando la BD principal falla, **promover la réplica** para que
     se convierta en la nueva base de datos maestra
  4. **Actualizar la cadena de conexión** en las aplicaciones para que
     apunten a la nueva BD
  5. Las aplicaciones vuelven a funcionar con la nueva maestra

El instructor lo dice claro: la aplicación debe ser capaz de
direccionar las lecturas hacia las réplicas y actualizar la cadena de
conexión para aprovecharlas.

En cambio, en **Multi-AZ** no hay que tocar nada: la app usa un nombre
DNS y el failover es automático en el backend.`,
    explanationText:
      "🌍 Ejemplo cotidiano: un suplente en un equipo de fútbol: cuando el titular se lesiona, el suplente sale al campo (promoción), pero el entrenador (la app) tiene que darle la nueva táctica y comunicarla al resto (actualizar la cadena de conexión). En Multi-AZ, en cambio, el árbitro ya sabe quién es el capitán por el brazalete (DNS) y no hay que avisar a nadie.\n\nLa promoción te da control: conviertes la réplica en maestra cuando la original falla o para pruebas. El paso que todo el mundo olvida es el 4: sin actualizar la cadena de conexión, la app seguirá llamando a la puerta de la maestra caída.",
    codeSnippet: "// Ordena el flujo de promoción de una réplica de lectura",
    inputs: {},
    completeCode: "Crear réplica → esperar replicación → promover a maestra → actualizar cadena de conexión → tráfico a la nueva BD",
    format: "ordering",
    ordering: {
      prompt:
        "Ordena los pasos para que una réplica de lectura se convierta en la nueva base de datos maestra.",
      steps: [
        { id: "create", label: "Crear una réplica de lectura desde la BD principal" },
        { id: "sync", label: "Esperar a que la réplicación asíncrona alcance a la réplica" },
        { id: "promote", label: "Promover la réplica de lectura a base de datos maestra" },
        { id: "connstring", label: "Actualizar la cadena de conexión en las aplicaciones" },
        { id: "traffic", label: "Redirigir las lecturas y escrituras a la nueva maestra" },
      ],
      correctOrder: ["create", "sync", "promote", "connstring", "traffic"],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── AURORA (084) ────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 8,
    title: "Aurora: el motor propietario de AWS",
    stars: 2,
    category: "AURORA",
    description:
      "Compatible con MySQL y PostgreSQL, pero optimizado para la nube: 5x más rápido en MySQL.",
    objective: "Conocer las ventajas de Aurora frente a RDS",
    tags: ["Aurora", "MySQL", "PostgreSQL", "rendimiento"],
    fileName: "aurora-basics",
    completed: false,
    theory: `📚 TEORÍA: Amazon Aurora (084)

Aurora es la **tecnología propietaria de AWS**: no es de código abierto,
lo ha desarrollado AWS. Soporta **PostgreSQL y MySQL** como motores, así
que tus controladores funcionan como si Aurora fuese una BD PostgreSQL
o MySQL.

Ventajas frente a RDS:
  • Rendimiento **5 veces superior a MySQL** con RDS y **más de 3 veces
    superior a PostgreSQL** con RDS
  • Almacenamiento que crece **automáticamente en incrementos de 10 GB
    hasta 128 TB**
  • **15 réplicas** de lectura (RDS tiene 5)
  • Replicación con un retraso **inferior a 10 milisegundos**
  • **Failover instantáneo**: es alta disponibilidad nativa
  • Backtrack: restaurar datos a cualquier momento **sin usar copias
    de seguridad**

La pega: es **más cara**, aproximadamente un **20% más que RDS**. Pero
AWS compensa con eficiencia y funcionalidades que RDS no tiene.`,
    explanationText:
      "🌍 Ejemplo cotidiano: Aurora es el coche de carreras de la propia marca del circuito: fabricado a medida para ese asfalto (la nube de AWS), mientras que RDS es un coche de alquiler genérico. Cuesta más el billete, pero vuelta a vuelta rinde mucho más.\n\nSi el examen te pregunta por rendimiento en la nube, réplicas rápidas o failover instantáneo, piensa en Aurora. Y recuerda la pareja de números: 15 réplicas (Aurora) vs 5 (RDS), y retraso de réplica < 10 ms.",
    codeSnippet: "// Valida las afirmaciones sobre Amazon Aurora",
    inputs: {},
    completeCode: "Propietario de AWS | MySQL/PostgreSQL compatibles | 5x MySQL, >3x PostgreSQL | 15 réplicas | +20% coste",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre Amazon Aurora.",
      statements: [
        {
          id: "a",
          text: "Aurora es una tecnología propietaria de AWS, compatible con los drivers de MySQL y PostgreSQL.",
          answer: true,
          explanation: "Soporta ambos motores: tus controladores funcionan como si fuese MySQL o PostgreSQL.",
        },
        {
          id: "b",
          text: "AWS afirma que Aurora es unas 5 veces más rápida que MySQL con RDS y más de 3 veces que PostgreSQL con RDS.",
          answer: true,
          explanation: "Es el argumento de rendimiento que destaca el instructor.",
        },
        {
          id: "c",
          text: "Aurora puede tener hasta 15 réplicas de lectura, mientras que RDS llega a 5.",
          answer: true,
          explanation: "15 réplicas en Aurora, 5 en RDS: otro par de números para el examen.",
        },
        {
          id: "d",
          text: "Aurora cuesta aproximadamente un 20% menos que RDS.",
          answer: false,
          explanation: "Al revés: cuesta un 20% más, pero es más eficiente.",
        },
        {
          id: "e",
          text: "El almacenamiento de Aurora crece automáticamente en incrementos de 10 GB hasta 128 TB.",
          answer: true,
          explanation: "Es el auto-scaling del volumen compartido de Aurora.",
        },
      ],
    },
  },

  {
    id: 9,
    title: "Aurora: 6 copias, 3 AZ y dos endpoints que lo cambian todo",
    stars: 3,
    category: "AURORA",
    description:
      "Cada escritura se replica 6 veces en 3 AZ, y el writer endpoint te ahorra el failover.",
    objective: "Comprender la alta disponibilidad y los endpoints de Aurora",
    tags: ["6 copias", "writer endpoint", "reader endpoint", "cluster"],
    fileName: "aurora-cluster",
    completed: false,
    theory: `📚 TEORÍA: Alta disponibilidad de Aurora (084)

Aurora es especial por cómo guarda los datos:
  • Cada vez que escribes, se crean **6 copias** de tus datos a través
    de **3 zonas de disponibilidad**
  • **4 copias de las 6** son necesarias para las **escrituras**
  • **3 copias de las 6** son necesarias para las **lecturas**
  • Si una AZ cae, la información sigue replicada en las otras
  • **Auto-reparación con replicación entre pares (peer-to-peer)**: si
    un dato se corrompe, se repara en el backend sin depender de un
    único volumen (son cientos de volúmenes)

El cluster de Aurora tiene:
  • Una instancia **maestra** que es la única que escribe
  • Recuperación del maestro en unos **30 segundos**
  • **Writer endpoint**: un nombre DNS que siempre apunta al maestro.
    Si el maestro cae, el endpoint redirige a otra instancia sin que
    la app cambie nada
  • **Reader endpoint**: equilibra la carga entre las réplicas de
    lectura y se conecta automáticamente a todas ellas
  • **Auto-escalado de réplicas**: aparecen y desaparecen según la carga,
    por eso el reader endpoint es imprescindible

Recuerda también el **backtrack**: restaurar la BD a cualquier momento
sin depender de copias de seguridad.`,
    explanationText:
      "🌍 Ejemplo cotidiano: en lugar de un solo cuaderno con toda la información (riesgo de perderlo todo), escribes cada página en 6 cuadernos repartidos en 3 aulas. Si un aula se quema, quedan copias. Y el writer endpoint es el megáfono oficial: aunque cambie el profesor que tiene la tiza, el megáfono sigue señalando al profesor actual.\n\nEsos números (6 copias, 3 AZ, 4 para escribir, 3 para leer) y los dos endpoints (escritor y lector) son la firma de Aurora en el examen: gestionan el failover y el balanceo de réplicas en el backend.",
    codeSnippet: `# Cada escritura en Aurora se replica en [INPUT_1] copias
# repartidas en [INPUT_2] zonas de disponibilidad.
# [INPUT_3] de las 6 copias son necesarias para las escrituras.
# [INPUT_4] de las 6 copias son necesarias para las lecturas.

# El [INPUT_5] endpoint apunta siempre al maestro.
# El [INPUT_6] endpoint reparte la carga entre las réplicas.`,
    inputs: {
      INPUT_1: "6",
      INPUT_2: "3",
      INPUT_3: "4",
      INPUT_4: "3",
      INPUT_5: "escritor",
      INPUT_6: "lector",
    },
    completeCode: "6 copias en 3 AZ | 4 copias para escribir, 3 para leer | writer endpoint = maestro, reader endpoint = réplicas",
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── SEGURIDAD (086) Y RDS PROXY (087) ───────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 10,
    title: "Seguridad RDS y Aurora: cifrado, TLS y nada de SSH",
    stars: 3,
    category: "SEGURIDAD",
    description:
      "El cifrado se decide en el lanzamiento, el tráfico viaja con TLS y la autenticación puede ser con IAM.",
    objective: "Aplicar las reglas de seguridad de RDS y Aurora",
    tags: ["KMS", "TLS", "IAM auth", "security group"],
    fileName: "rds-security",
    completed: false,
    theory: `📚 TEORÍA: Seguridad de RDS y Aurora (086)

**Cifrado en reposo (en los volúmenes):**
  • Tanto RDS como Aurora cifran los datos en reposo usando **KMS**
  • La BD maestra y cualquier réplica se cifran con KMS
  • Se define **en el momento del lanzamiento**: si la maestra no está
    cifrada, **las réplicas tampoco pueden estarlo**
  • Para cifrar una BD existente sin cifrar: crear un **snapshot** y
    restaurarlo como base de datos **cifrada**

**Cifrado en vuelo (en tránsito):**
  • RDS y Aurora vienen preparadas para el cifrado por defecto
  • Los clientes deben usar los **certificados raíz TLS de AWS**
    (se descargan del sitio web de AWS)

**Autenticación y red:**
  • Puedes autenticar con **roles IAM** en vez de usuario/contraseña:
    una instancia EC2 con rol IAM se conecta sin credenciales estáticas
  • El acceso a red se controla con **security groups**: puertos,
    IPs o grupos de seguridad concretos
  • **No hay acceso SSH** (son servicios gestionados), excepto en RDS
    Custom para Oracle y SQL Server
  • Los logs de auditoría pueden activarse y enviarse a **CloudWatch
    Logs** para mayor retención`,
    explanationText:
      "🌍 Ejemplo cotidiano: una caja fuerte que se decide en la fábrica (cifrado KMS al lanzar la BD), documentos sellados que viajan en sobre certificado (TLS en vuelo) y una tarjeta de empleado para entrar (rol IAM en vez de contraseña). Si la caja nació sin cerradura, no puedes añadirla después: hay que pedir una nueva (snapshot + restaurar).\n\nLa regla de oro: el cifrado en reposo se decide al lanzar; una BD sin cifrar no puede tener réplicas cifradas; y para cifrarla, snapshot → restaurar cifrada. La autenticación con IAM elimina contraseñas estáticas en tus servidores: un win de seguridad.",
    codeSnippet: "// Valida las reglas de seguridad de RDS y Aurora",
    inputs: {},
    completeCode: "Cifrado KMS al lanzar | TLS en vuelo | IAM auth | security groups | sin SSH (salvo RDS Custom)",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre la seguridad de RDS y Aurora.",
      statements: [
        {
          id: "a",
          text: "El cifrado en reposo con KMS se define en el momento del lanzamiento de la base de datos.",
          answer: true,
          explanation: "Se decide al crear la BD: después no se puede activar sin snapshot + restauración.",
        },
        {
          id: "b",
          text: "Si la base de datos maestra no está cifrada, las réplicas de lectura pueden cifrarse por separado.",
          answer: false,
          explanation: "No: si la maestra no está cifrada, las réplicas tampoco pueden estarlo.",
        },
        {
          id: "c",
          text: "Para cifrar una BD RDS existente sin cifrar, se crea un snapshot y se restaura como base de datos cifrada.",
          answer: true,
          explanation: "Es el proceso que describe el instructor para cifrar a posteriori.",
        },
        {
          id: "d",
          text: "RDS y Aurora permiten acceso SSH a la instancia para administrar el sistema operativo.",
          answer: false,
          explanation: "Son gestionados: no hay SSH, excepto en RDS Custom (Oracle y SQL Server).",
        },
        {
          id: "e",
          text: "Una instancia EC2 puede autenticarse contra la base de datos usando un rol IAM en lugar de usuario y contraseña.",
          answer: true,
          explanation: "La autenticación IAM para RDS evita credenciales estáticas en el código.",
        },
      ],
    },
  },

  {
    id: 11,
    title: "RDS Proxy: el guardia de las conexiones",
    stars: 3,
    category: "RDS PROXY",
    description:
      "Si cada función abre su propia conexión, la BD se ahoga. RDS Proxy agrupa y comparte las conexiones.",
    objective: "Identificar cuándo y por qué usar RDS Proxy",
    tags: ["RDS Proxy", "pooling", "Lambda", "serverless"],
    fileName: "rds-proxy",
    completed: false,
    theory: `📚 TEORÍA: Amazon RDS Proxy (087)

¿Por qué necesitas un proxy entre la app y la BD? Porque cada
aplicación que se conecta a RDS establece una conexión individual, y
las bases de datos tienen un límite de conexiones. Con muchas apps (o
muchas funciones Lambda), la BD se estresa.

RDS Proxy agrupa y comparte las conexiones: la app se conecta al proxy
y el proxy **juntará esas conexiones en menos conexiones** hacia la
instancia de RDS.

Beneficios clave:
  • Reduce el **estrés** de la BD: menos CPU y RAM gastadas en gestionar
    conexiones abiertas y tiempos de espera
  • Es **serverless**: con auto-escalado y alta disponibilidad en varias
    AZ
  • Reduce el tiempo de **failover** de RDS hasta un **66%**
  • Soporta MySQL, MariaDB, PostgreSQL y Aurora (MySQL/PostgreSQL)
  • **Sin cambios de código** en la mayoría de aplicaciones
  • Usa **autenticación IAM** para las BD y guarda las credenciales de
    forma segura en **Secrets Manager**
  • **Nunca es accesible al público**: se accede desde dentro de la VPC

Cada vez que un examen te pida **ser eficiente con las conexiones** a
RDS, piensa en RDS Proxy.`,
    explanationText:
      "🌍 Ejemplo cotidiano: una centralita telefónica de una empresa: cientos de personas llaman, pero solo hay 10 líneas. La centralita (el proxy) agrupa las llamadas y evita que la operadora (la BD) colapse. Además, si la operadora se cambia, la centralita redirige sin que nadie marque un número nuevo.\n\nSin proxy, cada Lambda de tu app abre su propia conexión a la BD y pronto agotas el límite de conexiones. RDS Proxy reutiliza conexiones, baja el estrés de CPU/RAM, acelera el failover y refuerza la seguridad (IAM + Secrets Manager) dentro de la VPC.",
    codeSnippet: `// Tu aplicación serverless lanza cientos de funciones Lambda.
// Cada invocación abre su propia conexión a RDS... y la base de
// datos empieza a agotar sus conexiones (CPU y RAM al límite).`,
    inputs: {},
    completeCode: "RDS Proxy = pool de conexiones | serverless | failover -66% | IAM + Secrets Manager | dentro de la VPC",
    format: "prediction",
    prediction: {
      prompt: "¿Qué servicio debes añadir para aliviar la base de datos?",
      snippet: `// Cientos de funciones Lambda se conectan a RDS a la vez.
// Cada una abre su propia conexión: la BD agota conexiones.`,
      options: [
        "Un RDS Proxy que agrupe y comparta las conexiones hacia la BD",
        "Una réplica de lectura para escalar las escrituras",
        "Convertir la BD en Multi-AZ para repartir las conexiones",
        "Un bucket S3 para guardar las conexiones en caché",
      ],
      answer: "Un RDS Proxy que agrupe y comparta las conexiones hacia la BD",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ─── ELASTICACHE (088, 090) Y MEMORYDB (091) ─────────────────────────────
  // ────────────────────────────────────────────────────────────────────────

  {
    id: 12,
    title: "Redis vs Memcached: el duelo de la caché",
    stars: 3,
    category: "ELASTICACHE",
    description:
      "Redis es como RDS (HA, réplicas, backups); Memcached es pura distribución sin red de seguridad.",
    objective: "Diferenciar Redis y Memcached a alto nivel",
    tags: ["Redis", "Memcached", "sharding", "alta disponibilidad"],
    fileName: "elasticache",
    completed: false,
    theory: `📚 TEORÍA: ElastiCache, Redis y Memcached (088)

ElastiCache te da **Redis o Memcached gestionados**: bases de datos en
memoria con rendimiento muy alto y baja latencia, que reducen la carga
de la BD en workloads de lectura intensiva.

**Redis:**
  • Multi-AZ con **auto-failover**
  • **Réplicas de lectura** disponibles para escalar lecturas
  • Alta disponibilidad (se parece mucho a RDS)
  • **Persistencia** de datos y funciones de **backup y restauración**

**Memcached:**
  • Usa múltiples nodos para **fragmentar** (sharding) los datos
  • **Sin alta disponibilidad**: no hay replicación de datos
  • **No es persistente**: no hay backup ni restauración
  • Arquitectura **multihilo** (multi-threaded)

La idea que debes recordar: Redis está para **alta disponibilidad,
respaldo y réplicas de lectura**; Memcached es un **caso puro de
distribución** en memoria.

Importante: usar ElastiCache **sí requiere grandes cambios en el código**
de la aplicación (a diferencia de RDS/Aurora).`,
    explanationText:
      "🌍 Ejemplo cotidiano: Redis es el almacén con cámara acorazada, guardias (réplicas) y copias de seguridad (backups); Memcached es el bazar en memoria: rapidísimo, pero si se apaga la luz, todo lo que había en las mesas desaparece y no hay catálogo de lo perdido.\n\nEl examen busca ese matiz: Redis = durabilidad + HA + réplicas; Memcached = sharding y velocidad, sin persistencia ni recuperación. Y recuerda: a diferencia de RDS, añadir ElastiCache obliga a tocar el código de la aplicación.",
    codeSnippet: "// Valida las diferencias entre Redis y Memcached en ElastiCache",
    inputs: {},
    completeCode: "Redis = HA + réplicas + persistencia + backups | Memcached = sharding, sin HA, sin persistencia",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre Redis y Memcached.",
      statements: [
        {
          id: "a",
          text: "Redis soporta Multi-AZ con failover automático y réplicas de lectura; Memcached no tiene alta disponibilidad.",
          answer: true,
          explanation: "Redis se parece a RDS; Memcached es pura distribución sin HA.",
        },
        {
          id: "b",
          text: "Memcached utiliza múltiples nodos con fragmentación (sharding) y es multihilo.",
          answer: true,
          explanation: "Varios nodos trabajan en conjunto repartiéndose los datos.",
        },
        {
          id: "c",
          text: "Memcached es persistente: los datos sobreviven a reinicios y hay backups automáticos.",
          answer: false,
          explanation: "Memcached no es persistente: no hay copia de seguridad ni restauración.",
        },
        {
          id: "d",
          text: "Implementar ElastiCache en una aplicación existente requiere grandes cambios en el código.",
          answer: true,
          explanation: "El instructor lo destaca: usar la caché obliga a modificar la aplicación, a diferencia de RDS.",
        },
      ],
    },
  },

  {
    id: 13,
    title: "Lazy loading, write-through y TTL: las estrategias de caché",
    stars: 3,
    category: "ELASTICACHE",
    description:
      "La caché no se llena sola: eliges cuándo escribir (perezoso o directo) y cuándo caduca (TTL).",
    objective: "Reconstruir los patrones de caché y la invalidación",
    tags: ["lazy loading", "write-through", "TTL", "cache miss"],
    fileName: "cache-strategies",
    completed: false,
    theory: `📚 TEORÍA: Estrategias de ElastiCache (090)

**Lazy Loading (cache aside / lazy population):**
  1. La app consulta la caché → si está el dato: **cache hit** ✅
  2. Si no está: **cache miss** ❌
  3. La app lee la BD (ej. RDS)
  4. La app escribe el dato en la caché
  • Ventajas: solo se cachean los datos **solicitados**, y un fallo de
    nodo no es fatal (solo aumenta la latencia para calentar la caché)
  • Contras: penalización en el cache miss (tres viajes) y **datos
    obsoletos** si la BD se actualiza y la caché no

**Write-through (escritura directa):**
  • Al escribir en la BD, se escribe **también en la caché**
  • Ventajas: los datos **nunca caducan** (siempre sincronizados) y las
    lecturas son muy rápidas
  • Contras: penalización de **escritura** (dos llamadas) y hay mucha
    información en caché que quizá nunca se lea

**Invalidación de la caché:**
  • Eliminar un elemento de forma **explícita**
  • **Expulsión** cuando la memoria está llena y no se ha usado
    recientemente
  • **TTL** (time to live): tiempo de vida del elemento. Útil para
    tablas de clasificación, comentarios o flujos de actividad. Va de
    segundos a horas o días

Cita famosa: «Solo hay dos cosas difíciles en informática: invalidar la
caché y nombrar las cosas».`,
    explanationText:
      "🌍 Ejemplo cotidiano: la nevera como caché de la despensa. Lazy loading: solo compras lo que necesitas cuando te falta (el hueco se rellena al hacer cache miss); write-through: cada vez que llega el pedido a la despensa, una copia va directa a la nevera (siempre fresca, pero llenas la nevera de cosas que igual nunca abres); y el TTL es la fecha de caducidad que tira lo que no se usó.\n\nEn el examen distingue los dos patrones por la dirección de la escritura: el lazy loading escribe en caché después de un miss; el write-through escribe en caché en el momento de escribir en la BD. Y el TTL es tu arma contra los datos obsoletos... hasta que el propio TTL se convierte en el otro problema difícil de la informática.",
    codeSnippet: "// Ordena el flujo de Lazy Loading ante un cache miss",
    inputs: {},
    completeCode: "GET caché → miss → leer BD → SET caché → hit en la siguiente petición | write-through: escribir BD + caché juntos | TTL",
    format: "ordering",
    ordering: {
      prompt:
        "Ordena el flujo del patrón Lazy Loading cuando el dato NO está en la caché (cache miss).",
      steps: [
        { id: "get", label: "La aplicación consulta la caché (GET user:17)" },
        { id: "miss", label: "Cache miss: la caché devuelve none porque el dato no está" },
        { id: "db", label: "La aplicación lee el dato directamente de la base de datos RDS" },
        { id: "set", label: "La aplicación escribe el dato en la caché (SET user:17)" },
        { id: "hit", label: "Las siguientes peticiones obtienen el dato con un cache hit" },
      ],
      correctOrder: ["get", "miss", "db", "set", "hit"],
    },
  },

  {
    id: 14,
    title: "¿Qué servicio para cada caso de uso?",
    stars: 3,
    category: "MEMORYDB",
    description:
      "RDS, Aurora, ElastiCache y MemoryDB: elige el servicio correcto según lo que necesites.",
    objective: "Emparejar cada servicio con su caso de uso",
    tags: ["RDS", "Aurora", "ElastiCache", "MemoryDB"],
    fileName: "data-services",
    completed: false,
    theory: `📚 TEORÍA: MemoryDB y el mapa de servicios (091)

**Amazon MemoryDB para Redis:**
  • Es una **base de datos en memoria duradera** y **compatible con Redis**
  • Diferencia clave con ElastiCache (Redis): Redis se usa como **caché**
    con cierta durabilidad; MemoryDB es **realmente una base de datos**
    con una API compatible con Redis
  • Rendimiento ultra rápido: más de **160 millones de peticiones por
    segundo**
  • Datos en memoria con **almacenamiento duradero** gracias a registros
    de transacciones (logs) en **múltiples AZ**
  • Escala de decenas de GB a **cientos de TB**
  • Casos de uso: apps web y móviles, juegos online, streaming
    multimedia, microservicios, banca y finanzas

**Mapa rápido de la sección:**
  • **RDS** → BD relacional gestionada (SQL, parches, backups, Multi-AZ)
  • **Aurora** → motor propietario compatible con MySQL/PostgreSQL,
    alto rendimiento y HA nativa
  • **ElastiCache** → caché en memoria (Redis o Memcached) para lecturas
    intensivas y sesiones de usuario
  • **MemoryDB** → BD en memoria duradera compatible con Redis`,
    explanationText:
      "🌍 Ejemplo cotidiano: cada servicio es una herramienta distinta de la misma caja: RDS es la base de datos clásica con chef incluido; Aurora es el mismo plato pero con un chef de élite que cocina el doble de rápido; ElastiCache es la mesa de aperitivos (todos cogen de ahí y la cocina no se colapsa); MemoryDB es el aperitivo que además se conserva si se va la luz.\n\nPara el examen, la línea que separa ElastiCache de MemoryDB es la **durabilidad**: si necesitas una caché rápida, ElastiCache; si necesitas un dato en memoria que no se pierda (persistente), MemoryDB.",
    codeSnippet: "# Empareja cada servicio con su caso de uso",
    inputs: {},
    completeCode: "RDS (gestionada SQL) | Aurora (5x rendimiento, HA nativa) | ElastiCache (caché en memoria) | MemoryDB (memoria duradera)",
    format: "matching",
    matching: {
      prompt: "Conecta cada servicio de datos de AWS con su descripción correcta.",
      definitions: [
        "Motor propietario de AWS compatible con MySQL y PostgreSQL: 6 copias de datos en 3 AZ y failover instantáneo.",
        "Base de datos en memoria duradera y compatible con Redis: velocidad de memoria con durabilidad multi-AZ (más de 160M peticiones/seg).",
        "Caché en memoria (Redis o Memcached) para aliviar lecturas intensivas y guardar sesiones de usuario.",
        "Servicio de base de datos relacional gestionado: aprovisiona, parchea y hace backups por ti, pero sin acceso SSH.",
      ],
      pairs: [
        {
          id: "rds",
          term: "Amazon RDS",
          definition:
            "Servicio de base de datos relacional gestionado: aprovisiona, parchea y hace backups por ti, pero sin acceso SSH.",
        },
        {
          id: "aurora",
          term: "Amazon Aurora",
          definition:
            "Motor propietario de AWS compatible con MySQL y PostgreSQL: 6 copias de datos en 3 AZ y failover instantáneo.",
        },
        {
          id: "elasticache",
          term: "Amazon ElastiCache",
          definition:
            "Caché en memoria (Redis o Memcached) para aliviar lecturas intensivas y guardar sesiones de usuario.",
        },
        {
          id: "memorydb",
          term: "Amazon MemoryDB para Redis",
          definition:
            "Base de datos en memoria duradera y compatible con Redis: velocidad de memoria con durabilidad multi-AZ (más de 160M peticiones/seg).",
        },
      ],
    },
  },
];
