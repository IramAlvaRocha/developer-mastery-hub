import type { Exercise } from "@/lib/types";

export const AWS_STORAGE_EXERCISES: Exercise[] = [

  // ────────────────────────────────────────────────────────────────────────────
  // ─── ALMACENAMIENTO DE INSTANCIAS EC2: EBS, SNAPSHOTS, AMI, INSTANCE STORE, ─
  // ─── TIPOS DE VOLUMEN, MULTI-ATTACH y EFS ───────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "Elegir el almacenamiento correcto",
    stars: 1,
    category: "CONCEPTOS",
    description: "Distingue de un vistazo EBS, EFS, Instance Store y AMI: cada uno cubre una necesidad distinta de almacenamiento.",
    objective: "Diferenciar los servicios de almacenamiento de instancias EC2",
    tags: ["ebs", "efs", "instance store", "ami"],
    fileName: "almacenamiento",
    completed: false,
    theory: `📚 TEORÍA: El almacenamiento de instancias EC2

• EBS (Elastic Block Store): unidad de red que se adjunta a las instancias mientras se ejecutan y les permite persistir los datos incluso después de su finalización. Es una "memoria USB de red".
• Instance Store (Almacén de instancias): almacenamiento físico local de alto rendimiento, pero efímero: los datos se pierden si la instancia termina o el hardware falla.
• EFS (Elastic File System): sistema de archivos de red (NFS) gestionado que se monta en muchas instancias a la vez, en varias zonas de disponibilidad, y escala solo.
• AMI (Amazon Machine Image): personalización de una instancia (sistema operativo + software + configuración) para lanzar instancias idénticas de forma mucho más rápida.`,
    explanationText: "🌍 Ejemplo cotidiano: EBS es una memoria USB de red que conectas a tu instancia y no se borra al apagar el ordenador; Instance Store es el disco interno del propio equipo (rapidísimo, pero se pierde si lo tiras); EFS es una carpeta compartida de red a la que acceden muchos ordenadores; y una AMI es una plantilla ya maquetada para montar el mismo PC muchas veces.\n\nCada servicio cubre una necesidad distinta: EBS aporta persistencia de bloques dentro de una AZ, Instance Store máxima velocidad efímera, EFS compartición de archivos multi-AZ gestionada, y AMI reutilización de configuraciones. Saber cuál elegir en cada escenario es el corazón de las preguntas de almacenamiento del DVA-C02.",
    codeSnippet: "# Empareja cada servicio de almacenamiento con su caso de uso",
    inputs: {},
    completeCode: "EBS (bloques de red persistente) | EFS (NFS multi-AZ) | Instance Store (efímero local) | AMI (plantilla reutilizable)",
    format: "matching",
    matching: {
      prompt: "Conecta cada servicio de almacenamiento con la descripción que le corresponde.",
      definitions: [
        "Imagen personalizada (SO + software + configuración) para lanzar instancias idénticas sin reconfigurar.",
        "Almacenamiento físico local de la instancia con el máximo rendimiento, pero efímero: se pierde al detenerse la instancia o si el hardware falla.",
        "Unidad de almacenamiento de red por bloques que se adjunta a instancias EC2 en ejecución y persiste los datos tras terminarlas.",
        "Sistema de archivos de red (NFS) gestionado que se monta en muchas instancias Linux de varias zonas de disponibilidad a la vez.",
      ],
      pairs: [
        { id: "ebs", term: "EBS", definition: "Unidad de almacenamiento de red por bloques que se adjunta a instancias EC2 en ejecución y persiste los datos tras terminarlas." },
        { id: "efs", term: "EFS", definition: "Sistema de archivos de red (NFS) gestionado que se monta en muchas instancias Linux de varias zonas de disponibilidad a la vez." },
        { id: "instance-store", term: "Instance Store", definition: "Almacenamiento físico local de la instancia con el máximo rendimiento, pero efímero: se pierde al detenerse la instancia o si el hardware falla." },
        { id: "ami", term: "AMI", definition: "Imagen personalizada (SO + software + configuración) para lanzar instancias idénticas sin reconfigurar." },
      ]
    }
  },

  {
    id: 2,
    title: "EBS: el disco de red y las AZ",
    stars: 1,
    category: "EBS",
    description: "EBS no es un disco físico: es una unidad de red ligada a su zona de disponibilidad.",
    objective: "Comprender que EBS es un volumen de red bloqueado a una AZ",
    tags: ["ebs", "availability zone", "latencia"],
    fileName: "ebs-volume",
    completed: false,
    theory: `📚 TEORÍA: El volumen EBS

• EBS es una unidad de red, no un dispositivo físico: usa la red para comunicarse con la instancia, por lo que puede haber cierta latencia.
• Se puede desvincular de una instancia y vincularla a otra rápidamente, pero un volumen EBS queda bloqueado en su zona de disponibilidad: uno de us-east-1a no se puede adjuntar a una instancia de us-east-1b.
• Una instancia puede estar conectada a varios volúmenes EBS a la vez.
• Se factura toda la capacidad provisionada (tamaño e IOPS), aunque solo se use una parte.`,
    explanationText: "🌍 Ejemplo cotidiano: EBS es un disco externo por red: puedes desenchufarlo de un ordenador y enchufarlo a otro en segundos, pero está atado al circuito eléctrico de su sala (AZ). Para usarlo en otra sala tienes que copiar su contenido (snapshot) y restaurarlo allí.\n\nPor ser de red, EBS no vive dentro de la instancia: hay algo de latencia, pero se desvincula de una y se adjunta a otra al instante. Eso sí, queda bloqueado a su AZ (us-east-1a ≠ us-east-1b): para moverlo, snapshot y restaurar en la AZ destino. Además factura toda la capacidad provisionada (tamaño + IOPS), aunque solo uses una parte.",
    codeSnippet: "# Valida las afirmaciones sobre el volumen EBS",
    inputs: {},
    completeCode: "EBS = unidad de red, bloqueada a su AZ, se factura toda la capacidad provisionada",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre el volumen EBS.",
      statements: [
        { id: "a", text: "EBS es una unidad de red, no un dispositivo físico: usa la red para comunicarse con la instancia, por lo que puede haber cierta latencia.", answer: true, explanation: "Correcto: por eso se puede separar de una instancia y conectar a otra rápidamente, a costa de algo de latencia." },
        { id: "b", text: "Un volumen EBS creado en us-east-1a se puede adjuntar directamente a una instancia de us-east-1b.", answer: false, explanation: "Está bloqueado a su zona de disponibilidad: para moverlo hay que hacer un snapshot y restaurarlo en la AZ destino." },
        { id: "c", text: "Una instancia EC2 solo puede tener un único volumen EBS conectado.", answer: false, explanation: "Al revés: una instancia puede tener varios volúmenes EBS a la vez, aunque cada volumen (nivel Practitioner) se adjunta a una sola instancia." },
        { id: "d", text: "Se factura toda la capacidad provisionada del volumen EBS aunque solo uses una parte.", answer: true, explanation: "Sí: reservas tamaño e IOPS y pagas por el total provisionado, no por lo consumido." },
      ]
    }
  },

  {
    id: 3,
    title: "DeleteOnTermination: ¿sobrevive el volumen?",
    stars: 2,
    category: "EBS",
    description: "El atributo 'borrar al terminar' decide qué pasa con cada volumen cuando termina la instancia.",
    objective: "Entender el comportamiento por defecto de DeleteOnTermination",
    tags: ["ebs", "delete on termination", "persistencia"],
    fileName: "delete-on-termination",
    completed: false,
    theory: `📚 TEORÍA: El atributo DeleteOnTermination

• Controla el comportamiento del volumen EBS cuando la instancia EC2 termina.
• El volumen root (el que trae la instancia) viene por defecto con "borrar al terminar" ACTIVADO: se elimina con la instancia.
• Los volúmenes EBS adicionales que creas y adjuntas vienen por defecto con "borrar al terminar" DESACTIVADO: sobreviven a la instancia.
• Ambos se pueden modificar desde la consola o la CLI. Un caso de uso típico es preservar el volumen root marcando la casilla vacía.`,
    explanationText: "🌍 Ejemplo cotidiano: es como el 'aviso de incendio' de un alquiler: para el volumen root el casero ha marcado por defecto 'demoler al mudarte', mientras que el volumen extra que tú añades viene con 'dejar en pie'. Puedes desmarcar la casilla cuando quieras conservar algo.\n\nSi terminas la instancia, el volumen root se elimina salvo que hayas desactivado DeleteOnTermination; los volúmenes adicionales persisten y siguen facturando. Conocer el valor por defecto de cada uno evita perder datos (root borrado sin querer) o pagar de más (volúmenes huérfanos que ya no necesitas).",
    codeSnippet: "# Valida qué ocurre con los volúmenes al terminar la instancia",
    inputs: {},
    completeCode: "Root: se borra por defecto | Adicionales: persisten por defecto | Todo modificable",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre DeleteOnTermination.",
      statements: [
        { id: "a", text: "El volumen root de una instancia EC2 se elimina por defecto cuando la instancia termina.", answer: true, explanation: "Correcto: el root viene con 'borrar al terminar' activado; puedes desactivarlo si quieres conservarlo." },
        { id: "b", text: "Los volúmenes EBS adicionales que creas y adjuntas se eliminan por defecto al terminar la instancia.", answer: false, explanation: "No: por defecto los volúmenes adicionales NO se eliminan y persisten aunque la instancia termine." },
        { id: "c", text: "Puedes modificar DeleteOnTermination para preservar el volumen root cuando termines la instancia.", answer: true, explanation: "Correcto: desmarcar 'borrar al terminar' conserva el volumen root y su información." },
        { id: "d", text: "Si una instancia se termina, todos sus volúmenes EBS se borran siempre, sin excepción.", answer: false, explanation: "Falso: solo el root se borra por defecto; los volúmenes adicionales sobreviven y siguen facturándose." },
      ]
    }
  },

  {
    id: 4,
    title: "Mover un volumen EBS a otra AZ",
    stars: 2,
    category: "EBS",
    description: "Ordena el flujo para trasladar un volumen EBS de una zona de disponibilidad a otra usando snapshots.",
    objective: "Reconstruir el proceso de migración de un volumen EBS entre AZ",
    tags: ["ebs", "snapshot", "availability zone"],
    fileName: "snapshot",
    completed: false,
    theory: `📚 TEORÍA: Mover un volumen EBS con snapshots

• Un volumen EBS está bloqueado a su zona de disponibilidad, pero se puede trasladar: no se pierde, solo hay que crear un snapshot y restaurarlo en la AZ de destino.
• No es necesario desvincular el volumen para hacer una instantánea, aunque se recomienda para la integridad de los datos.
• El snapshot se puede copiar incluso entre regiones, y el restore crea un volumen nuevo en la zona o región elegida.`,
    explanationText: "🌍 Ejemplo cotidiano: es como escanear un documento y abrirlo en otra oficina: el original se queda donde está y la copia (el snapshot) te permite reconstruirlo en la AZ que elijas.\n\nEl snapshot captura el estado del volumen en un momento dado; al restaurarlo creas un volumen nuevo en la AZ destino y lo adjuntas a la instancia que vive allí. Desvincular primero (detach) es recomendable, no obligatorio, para garantizar que la instantánea capture un estado consistente.",
    codeSnippet: "# Ordena los pasos para mover un volumen EBS de us-east-1a a us-east-1b",
    inputs: {},
    completeCode: "Detach → Snapshot → Restaurar en la AZ destino → Adjuntar",
    format: "ordering",
    ordering: {
      prompt: "Reconstruye el flujo para trasladar un volumen EBS a otra zona de disponibilidad.",
      steps: [
        { id: "snapshot", label: "Crear un snapshot (instantánea) del volumen EBS." },
        { id: "detach", label: "Desvincular el volumen EBS de la instancia original (recomendado para la integridad)." },
        { id: "restore", label: "Restaurar el snapshot creando un volumen nuevo en la zona de disponibilidad destino." },
        { id: "attach", label: "Adjuntar el volumen restaurado a la instancia que corre en esa AZ." },
      ],
      correctOrder: ["detach", "snapshot", "restore", "attach"],
    }
  },

  {
    id: 5,
    title: "Snapshots: backup, copias y papelera",
    stars: 2,
    category: "SNAPSHOTS",
    description: "Las instantáneas de EBS protegen tus datos, se copian entre regiones y se archivan por menos dinero.",
    objective: "Conocer las características clave de los snapshots de EBS",
    tags: ["snapshot", "backup", "recycle bin"],
    fileName: "snapshot-backup",
    completed: false,
    theory: `📚 TEORÍA: Snapshots de EBS

• Un snapshot es una copia de seguridad del volumen EBS en un momento dado; también sirve para mover el volumen entre zonas de disponibilidad o regiones.
• Los snapshots de EBS se almacenan de forma incremental en Amazon S3: el primero copia todo el volumen y los siguientes solo guardan los bloques que cambiaron.
• Nivel de archivo: un snapshot archivado cuesta un 75% menos, pero restaurar desde el archivo tarda entre 24 y 72 horas.
• Papelera de reciclaje: protege snapshots y AMIs borradas por accidente con reglas de retención configurables de 1 día a 1 año.`,
    explanationText: "🌍 Ejemplo cotidiano: el snapshot es una fotografía de tu volumen en un instante; guardarla en el archivo es meter esa foto en una caja fuerte barata del trastero (tardas en recuperarla), y la papelera de reciclaje es la bolsa donde caen las fotos borradas por error hasta que pasa el plazo.\n\nLos snapshots son incrementales: solo se guarda lo que cambia, lo que abarata mucho los backups. Se usan tanto para proteger datos como para migrar volúmenes entre AZ/regiones. El archivo sacrifica rapidez de restauración (24-72 h) a cambio de un 75% de ahorro, y la papelera retiene de 1 día a 1 año los borrados accidentales para poder recuperarlos.",
    codeSnippet: "# Valida estas afirmaciones sobre los snapshots de EBS",
    inputs: {},
    completeCode: "Snapshot = backup incremental en S3 | Archivo 75% más barato | Papelera de 1 día a 1 año",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre los snapshots de EBS.",
      statements: [
        { id: "a", text: "Un snapshot es una copia de seguridad del volumen EBS en un momento dado y también sirve para mover el volumen a otra AZ o región.", answer: true, explanation: "Correcto: captura el estado del volumen y, al restaurarlo en otra AZ/región, permites migrarlo." },
        { id: "b", text: "Puedes copiar un snapshot entre regiones y restaurarlo como un volumen EBS en la zona de disponibilidad que elijas.", answer: true, explanation: "Sí: la copia y el restore son operaciones estándar del snapshot, pensadas para migración." },
        { id: "c", text: "El nivel de archivo de un snapshot cuesta un 75% menos, pero restaurar desde el archivo tarda entre 24 y 72 horas.", answer: true, explanation: "Correcto: es el precio del ahorro: acceso lento pero mucho más barato para backups de larga retención." },
        { id: "d", text: "La papelera de reciclaje de snapshots retiene los borrados por accidente hasta 5 años.", answer: false, explanation: "No: la retención configurable va de 1 día a 1 año." },
      ]
    }
  },

  {
    id: 6,
    title: "Tipos de volumen EBS: cuál para cada caso",
    stars: 3,
    category: "TIPOS DE VOLUMEN",
    description: "gp3, io2, st1 y sc1: cada familia de volumen EBS está diseñada para una carga de trabajo concreta.",
    objective: "Elegir el tipo de volumen EBS según el caso de uso",
    tags: ["ebs", "gp3", "io2", "hdd"],
    fileName: "tipos-volumen",
    completed: false,
    theory: `📚 TEORÍA: Tipos de volumen EBS

• SSD de uso general: gp2 y gp3. Equilibran precio y rendimiento para una amplia variedad de cargas de trabajo (arranque del sistema, entornos de desarrollo, escritorios virtuales). gp3 ofrece 3.000 IOPS de base y hasta 16.000 IOPS / 1.000 MB/s de forma independiente.
• SSD de IOPS provisionadas: io1 e io2. Para aplicaciones críticas, de baja latencia y alto rendimiento, como bases de datos sensibles al rendimiento. io2 añade más durabilidad y más IOPS por gigabyte al mismo precio.
• HDD optimizado para rendimiento: st1. Bajo coste para acceso frecuente y alto rendimiento: Big Data, almacenes de datos y procesamiento de logs.
• HDD frío: sc1. El disco duro más barato, para datos de acceso poco frecuente donde importa el menor coste.
• Solo gp2/gp3 e io1/io2 pueden ser volúmenes de arranque; los HDD (st1/sc1) no pueden ser volúmenes root.`,
    explanationText: "🌍 Ejemplo cotidiano: elegir tipo de volumen es elegir el vehículo: gp3 es el coche polivalente de diario, io2 es el deportivo que acelera siempre igual (IOPS garantizadas), st1 es la furgoneta que mueve volumen de carga (throughput) y sc1 es el coche que guardas en el garaje porque casi no lo usas.\n\nLa regla del examen: bases de datos críticas → io1/io2 (IOPS provisionadas, hasta 64.000), cargas generales → gp2/gp3, datos masivos con acceso frecuente → st1, y datos fríos baratos → sc1. Y un detalle trampa: los HDD no sirven como volumen de arranque.",
    codeSnippet: "# Empareja cada tipo de volumen EBS con su caso de uso",
    inputs: {},
    completeCode: "gp3 (general) | io2 (bases de datos críticas) | st1 (Big Data/logs) | sc1 (acceso infrecuente)",
    format: "matching",
    matching: {
      prompt: "Conecta cada tipo de volumen EBS con el caso de uso para el que está diseñado.",
      definitions: [
        "HDD frío y de menor coste: para datos de acceso poco frecuente donde importa pagar lo mínimo.",
        "HDD optimizado para rendimiento (throughput): para Big Data, almacenes de datos y procesamiento de logs.",
        "SSD de IOPS provisionadas: para bases de datos críticas y sensibles al rendimiento, con alta durabilidad.",
        "SSD de uso general: equilibra precio y rendimiento para arranque del sistema, desarrollo y escritorios virtuales.",
      ],
      pairs: [
        { id: "gp3", term: "gp3", definition: "SSD de uso general: equilibra precio y rendimiento para arranque del sistema, desarrollo y escritorios virtuales." },
        { id: "io2", term: "io2", definition: "SSD de IOPS provisionadas: para bases de datos críticas y sensibles al rendimiento, con alta durabilidad." },
        { id: "st1", term: "st1", definition: "HDD optimizado para rendimiento (throughput): para Big Data, almacenes de datos y procesamiento de logs." },
        { id: "sc1", term: "sc1", definition: "HDD frío y de menor coste: para datos de acceso poco frecuente donde importa pagar lo mínimo." },
      ]
    }
  },

  {
    id: 7,
    title: "Instance Store: efímero y ultrarrápido",
    stars: 2,
    category: "INSTANCE STORE",
    description: "El almacén de instancias da el máximo rendimiento, pero los datos no sobreviven: la copia de seguridad es tuya.",
    objective: "Identificar las características y riesgos del almacén de instancias",
    tags: ["instance store", "efimero", "alto rendimiento"],
    fileName: "instance-store",
    completed: false,
    theory: `📚 TEORÍA: Almacén de instancias EC2 (Instance Store)

• Es el almacenamiento físico conectado directamente a la instancia, con un rendimiento de lectura y escritura (IOPS) mucho más alto que un volumen EBS.
• Es efímero: si la instancia se pierde o termina, y si el hardware físico falla, el almacenamiento se pierde.
• Ideal para buffers, cachés, datos de memoria virtual y contenido temporal.
• Las copias de seguridad, la replicación y la red son responsabilidad tuya, no de AWS: si los datos no se pueden perder, no los pongas aquí.`,
    explanationText: "🌍 Ejemplo cotidiano: Instance Store es la mesa de trabajo donde dejas los papeles mientras trabajas: todo a mano y rapidísimo, pero si te cierran la oficina (instancia termina) o se cae el edificio (hardware falla), los papeles desaparecen.\n\nCuando el examen pregunta por 'alto rendimiento', piensa en Instance Store: supera con creces las IOPS de EBS (familias como i3 llegan a millones de IOPS). Pero ese rendimiento es efímero: no hay persistencia garantizada, así que solo aloja ahí datos recreables o temporales, y planifica tú la replicación.",
    codeSnippet: "# Valida estas afirmaciones sobre el almacén de instancias",
    inputs: {},
    completeCode: "Instance Store = local, efímero, máximo rendimiento, backup por tu cuenta",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre el almacén de instancias EC2.",
      statements: [
        { id: "a", text: "Instance Store es un almacenamiento físico conectado a la instancia con un rendimiento de IOPS mucho mayor que un volumen EBS.", answer: true, explanation: "Correcto: por eso ante 'alto rendimiento' en el examen se piensa en Instance Store." },
        { id: "b", text: "Los datos del Instance Store persisten aunque detengas o termines la instancia.", answer: false, explanation: "No: es efímero; los datos se pierden si la instancia termina o el hardware falla." },
        { id: "c", text: "Es ideal para buffers, cachés, datos de memoria virtual y contenido temporal.", answer: true, explanation: "Correcto: cargas que toleran pérdida y necesitan máxima velocidad encajan perfectamente." },
        { id: "d", text: "Si el hardware físico falla, AWS garantiza la recuperación de los datos del Instance Store.", answer: false, explanation: "No: la copia de seguridad y la replicación son responsabilidad tuya." },
      ]
    }
  },

  {
    id: 8,
    title: "Crear una AMI y lanzar en otra AZ",
    stars: 3,
    category: "AMI",
    description: "Ordena el flujo para empaquetar una instancia personalizada en una AMI y reutilizarla en otra AZ.",
    objective: "Reconstruir el proceso de creación y lanzamiento desde una AMI",
    tags: ["ami", "imagen", "lanzamiento"],
    fileName: "ami",
    completed: false,
    theory: `📚 TEORÍA: Crear y usar una AMI

• Una AMI es una personalización de una instancia EC2: sistema operativo, software, configuración y monitorización preinstaladas, para lanzar instancias de forma mucho más rápida.
• Al crear la imagen, AWS genera automáticamente snapshots de los volúmenes EBS detrás de las escenas.
• Las AMIs se construyen para una región específica, pero se pueden copiar entre regiones.
• Las instancias se pueden lanzar desde: AMIs públicas de AWS, tu propia AMI, o AMIs del AWS Marketplace.`,
    explanationText: "🌍 Ejemplo cotidiano: una AMI es una 'plantilla de cocina montada': una vez instalas y configuras todo en una instancia, la fotografías para replicar la misma cocina en cualquier otra sede sin volver a instalar nada.\n\nCrear la imagen desde una instancia personalizada genera sus snapshots de volumen automáticamente; luego lanzas instancias nuevas desde esa AMI con el software ya listo, en la AZ o región que quieras (las AMIs se copian entre regiones). Es la forma de convertir una configuración manual y tediosa en un proceso repetible de minutos.",
    codeSnippet: "# Ordena el flujo para crear una AMI desde una instancia y lanzarla en otra AZ",
    inputs: {},
    completeCode: "Personalizar → Crear imagen (AMI) → Copiar a la región/AZ destino → Lanzar instancia",
    format: "ordering",
    ordering: {
      prompt: "Reconstruye el proceso: personaliza una instancia, empaquétala como AMI y lánzala en otra zona de disponibilidad.",
      steps: [
        { id: "custom", label: "Personalizar la instancia EC2: instalar el software y la configuración necesarios." },
        { id: "image", label: "Crear una imagen (AMI) desde la instancia; AWS genera snapshots de los volúmenes detrás de escena." },
        { id: "copy", label: "Copiar o distribuir la AMI a la región o zona de disponibilidad de destino." },
        { id: "launch", label: "Lanzar una nueva instancia desde la AMI, que arranca con todo ya preinstalado." },
      ],
      correctOrder: ["custom", "image", "copy", "launch"],
    }
  },

  {
    id: 9,
    title: "EBS Multi-Attach: un volumen, varias instancias",
    stars: 3,
    category: "EBS",
    description: "El mismo volumen EBS compartido por varias instancias dentro de una AZ para clusters y escritura concurrente.",
    objective: "Entender el alcance y las limitaciones del EBS Multi-Attach",
    tags: ["ebs", "multi-attach", "cluster"],
    fileName: "multi-attach",
    completed: false,
    theory: `📚 TEORÍA: EBS Multi-Attach

• A nivel de Cloud Practitioner, un volumen EBS se adjunta a una sola instancia; a nivel avanzado, Multi-Attach permite adjuntar el mismo volumen a varias instancias EC2 dentro de la MISMA zona de disponibilidad.
• Cada instancia tiene permisos completos de lectura y escritura sobre el volumen.
• Casos de uso: mayor disponibilidad en clusters de Linux y aplicaciones con operaciones de escritura concurrentes.
• Permite hasta 16 instancias a la vez y requiere un sistema de archivos compatible con cluster.`,
    explanationText: "🌍 Ejemplo cotidiano: es un disco de red compartido entre varios equipos de la misma oficina: todos escriben y leen sobre el mismo disco, pero los equipos deben estar en la misma sala (AZ) y coordinarse para no pisarse.\n\nMulti-Attach vence la regla básica de 'un volumen = una instancia' pero solo dentro de la misma AZ, con hasta 16 instancias y usando un filesystem compatible con cluster. Es la pieza clave para clústeres tipo Linux que necesitan escritura concurrente sobre un mismo volumen de alto rendimiento.",
    codeSnippet: "# Valida estas afirmaciones sobre EBS Multi-Attach",
    inputs: {},
    completeCode: "Multi-Attach = mismo EBS en varias instancias de la misma AZ, hasta 16, con filesystem de cluster",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre EBS Multi-Attach.",
      statements: [
        { id: "a", text: "EBS Multi-Attach permite adjuntar el mismo volumen EBS a varias instancias EC2 dentro de la misma zona de disponibilidad.", answer: true, explanation: "Correcto: rompe la regla de Practitioner 'un volumen, una instancia', pero limitado a una sola AZ." },
        { id: "b", text: "Cada instancia conectada por Multi-Attach tiene permisos completos de lectura y escritura sobre el volumen.", answer: true, explanation: "Correcto: todas comparten acceso de lectura y escritura al volumen de alto rendimiento." },
        { id: "c", text: "Un volumen con Multi-Attach se puede conectar a instancias en zonas de disponibilidad distintas.", answer: false, explanation: "No: Multi-Attach solo funciona entre instancias de la misma zona de disponibilidad." },
        { id: "d", text: "Se usa típicamente para clusters de Linux y aplicaciones con operaciones de escritura concurrentes.", answer: true, explanation: "Correcto: esos son los casos de uso destacados, junto con mayor disponibilidad de la aplicación." },
      ]
    }
  },

  {
    id: 10,
    title: "Amazon EFS: un NFS que crece solo",
    stars: 3,
    category: "EFS",
    description: "EFS comparte un sistema de archivos entre muchas instancias en varias AZ y escala hasta petabytes sin provisionar.",
    objective: "Conocer las características y usos de Amazon EFS",
    tags: ["efs", "nfs", "multi-az"],
    fileName: "efs",
    completed: false,
    theory: `📚 TEORÍA: Amazon EFS

• Es un sistema de archivos de red (NFS) gestionado que se puede montar en muchas instancias EC2 en múltiples zonas de disponibilidad a la vez, con alta disponibilidad.
• Escala de forma automática: no hay que provisionar capacidad, puede crecer hasta petabytes y soportar miles de clientes NFS concurrentes.
• Usa el protocolo NFS versión 4.1 y los grupos de seguridad controlan el acceso al sistema de archivos.
• Solo compatible con AMIs basadas en Linux (no Windows); admite cifrado en reposo con KMS.
• Es más caro que EBS y se paga por uso. Para ahorrar, la clase 'acceso infrecuente' (IA) con políticas de ciclo de vida puede mover archivos poco usados y ahorrar hasta un 90% en EFS One Zone IA.`,
    explanationText: "🌍 Ejemplo cotidiano: EFS es una carpeta compartida de empresa en la nube: todos los empleados (instancias), estén en la oficina que estén, ven los mismos archivos, y el tamaño de la carpeta crece solo sin que nadie pida más espacio.\n\nAl ser NFS gestionado, EFS elimina el trabajo de provisionar y escalar: crece automáticamente hasta petabytes. Comparte archivos entre instancias de AZ distintas (lo que EBS no puede), pero exige Linux y cuesta más que EBS; el truco para abaratarlo es mover los archivos poco accesibles a la clase IA con políticas de ciclo de vida.",
    codeSnippet: "# Valida estas afirmaciones sobre Amazon EFS",
    inputs: {},
    completeCode: "EFS = NFS multi-AZ, escala solo, Linux only, pago por uso",
    format: "true-false",
    trueFalse: {
      prompt: "Evalúa estas afirmaciones sobre Amazon EFS.",
      statements: [
        { id: "a", text: "EFS es un sistema de archivos de red (NFS) gestionado que se monta en muchas instancias EC2 de varias AZ a la vez.", answer: true, explanation: "Correcto: a diferencia de EBS, comparte el mismo filesystem entre instancias de distintas zonas." },
        { id: "b", text: "EFS escala de forma automática hasta petabytes sin que tengas que provisionar capacidad manualmente.", answer: true, explanation: "Correcto: se escala solo y soporta miles de clientes NFS concurrentes." },
        { id: "c", text: "EFS es compatible tanto con AMIs de Linux como de Windows.", answer: false, explanation: "No: EFS solo funciona con AMIs basadas en Linux, no con Windows." },
        { id: "d", text: "EFS es más caro que EBS y se paga por uso.", answer: true, explanation: "Correcto: se paga por uso real, y para ahorrar se usan clases de acceso infrecuente con ciclo de vida." },
      ]
    }
  },

  {
    id: 11,
    title: "EFS vs EBS: comparte o no comparte",
    stars: 4,
    category: "COMPARATIVA",
    description: "Decide qué enfoque usas cuando varias instancias en AZ distintas deben ver los mismos archivos.",
    objective: "Elegir entre EFS y EBS para compartir almacenamiento multi-AZ",
    tags: ["efs", "ebs", "comparativa"],
    fileName: "efs-vs-ebs",
    completed: false,
    theory: `📚 TEORÍA: EFS vs EBS

• EBS: volumen de bloques bloqueado a una AZ, se adjunta a una sola instancia (o varias con Multi-Attach, siempre en la misma AZ). Para moverlo entre AZ hay que hacer snapshot y restaurar.
• EFS: sistema de archivos NFS que se monta en muchas instancias Linux a través de diferentes zonas de disponibilidad, sin snapshots para compartir.
• EFS es la elección para compartir archivos entre instancias en varias AZ (por ejemplo WordPress), aunque es más caro que EBS; se puede abaratar moviendo archivos poco accedidos a la clase de acceso infrecuente.`,
    explanationText: "🌍 Ejemplo cotidiano: EBS es el disco duro de tu propio PC (solo tú lo ves y está en tu mesa), mientras que EFS es la carpeta de Google Drive de tu equipo (todos la ven desde cualquier sitio).\n\nSi varias instancias de AZ distintas deben leer/escribir el MISMO archivo (un sitio web compartido, WordPress, una app distribuida), EFS es la pieza correcta: un NFS multi-AZ que todos montan. EBS, aunque con Multi-Attach, sigue confinado a una AZ y a un filesystem de cluster; usarlo para compartir entre AZ obligaría a snapshots constantes.",
    codeSnippet: "// Eliges el enfoque correcto para compartir almacenamiento multi-AZ",
    inputs: {},
    completeCode: "Compartir archivos multi-AZ → EFS | Volumen por instancia en una AZ → EBS",
    format: "snippet-pick",
    snippetPick: {
      prompt: "Tienes dos instancias en zonas de disponibilidad distintas que deben compartir el mismo contenido web. ¿Cuál es el enfoque correcto?",
      snippets: [
        {
          id: "ebs-attach",
          label: "Opción A",
          description: "Adjuntar el mismo volumen EBS a las dos instancias.",
          code: `# Adjuntar un único volumen EBS a las dos instancias
aws ec2 attach-volume --volume-id vol-0abc123 --instance-id i-0def456
aws ec2 attach-volume --volume-id vol-0abc123 --instance-id i-789abc`,
        },
        {
          id: "efs-mount",
          label: "Opción B",
          description: "Montar un sistema de archivos EFS (NFS) en cada instancia.",
          code: `# Montar el mismo sistema de archivos EFS en cada instancia
mount -t nfs4 -o nfsvers=4.1 \\
  fs-0abc123.efs.us-east-1.amazonaws.com:/ /mnt/efs`,
        },
      ],
      correct: 1,
    }
  },

  {
    id: 12,
    title: "Persistir la base de datos: ¿efímero o EBS?",
    stars: 4,
    category: "EBS",
    description: "Protege los datos que no puedes permitirte perder: elige el almacenamiento persistente adecuado.",
    objective: "Elegir entre Instance Store y EBS según la criticidad de los datos",
    tags: ["ebs", "instance store", "persistencia"],
    fileName: "persistencia",
    completed: false,
    theory: `📚 TEORÍA: ¿Dónde guardo datos que no puedo perder?

• Instance Store es efímero: si la instancia termina o el hardware falla, los datos desaparecen. Solo apto para buffers, cachés y contenido temporal recreable.
• EBS es un volumen de red persistente: los datos sobreviven a la terminación de la instancia (salvo DeleteOnTermination en el root) y se pueden proteger con snapshots.
• Regla del examen: si los datos son críticos y no se pueden perder, usa EBS (con snapshots); si necesitas máxima velocidad y toleras pérdida, Instance Store.`,
    explanationText: "🌍 Ejemplo cotidiano: Instance Store es una pizarra blanca de la sala de reuniones (se borra al acabar), mientras que EBS es la libreta que guardas en la caja fuerte: para una base de datos que no puedes reconstruir, la elección no es discutible.\n\nEl Instance Store brilla por rendimiento pero no garantiza nada: ni la detención de la instancia ni un fallo de hardware respetan tus datos. EBS persiste de forma independiente a la vida de la instancia y se respalda con snapshots. En el examen, 'alto rendimiento' sugiere Instance Store y 'no puedo perder datos' exige EBS.",
    codeSnippet: "// Eliges la configuración correcta para una base de datos que no puede perder datos",
    inputs: {},
    completeCode: "Datos críticos → volumen EBS persistente | Datos temporales de alta velocidad → Instance Store",
    format: "snippet-pick",
    snippetPick: {
      prompt: "Vas a desplegar una base de datos cuyo contenido NO puede perderse si la instancia se termina. ¿Qué configuración eliges?",
      snippets: [
        {
          id: "instance-store",
          label: "Opción A",
          description: "Usar el almacenamiento físico local de la instancia.",
          code: `# Lanzar una instancia de la familia i3 (Instance Store efímero)
aws ec2 run-instances \\
  --image-id ami-0abc123 --instance-type i3.large`,
        },
        {
          id: "ebs-persistente",
          label: "Opción B",
          description: "Crear un volumen EBS persistente y adjuntarlo a la instancia.",
          code: `# Crear un volumen EBS y adjuntarlo a la instancia
aws ec2 create-volume \\
  --availability-zone us-east-1a --size 100
aws ec2 attach-volume \\
  --volume-id vol-0abc123 --instance-id i-0def456`,
        },
      ],
      correct: 1,
    }
  },
];
