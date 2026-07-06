import type { EnrichmentMap } from "./enrich";

export const TS_UTILITY_TYPES_EVERYDAY: EnrichmentMap = {
  1: {
    descriptionPrefix:
      "De un expediente completo sacas solo las hojas que necesitas mostrar en público, sin la contraseña.",
    everydayInExplanation:
      "Tu perfil en redes tiene nombre, foto y correo visibles, pero no tu contraseña ni datos internos. \`Pick<User, 'id' | 'name' | 'email'>\` selecciona solo las propiedades que quieres conservar.",
    theory: `### En palabras simples
\`Pick<T, K>\` crea un nuevo tipo con solo las propiedades K de T. \`type UserPublic = Pick<User, 'id' | 'name' | 'email'>\` excluye \`password\` automáticamente.

### Ejemplo de la vida real
Una tarjeta de presentación con solo nombre, teléfono y correo — no llevas tu historial médico ni datos bancarios completos.

### En código
\`const profile: UserPublic = { id: 1, name: 'Iram', email: '...' }\` — password no permitido.

### Tip para la entrevista
Pick es ideal para DTOs y vistas públicas: la API retorna un objeto completo pero el frontend solo necesita algunos campos.`,
  },

  2: {
    descriptionPrefix:
      "Preparas un formulario de registro quitando los campos que el sistema llena solo, como el número de folio.",
    everydayInExplanation:
      "Al crear un producto nuevo, tú pones nombre y precio; el servidor genera el id y la fecha. \`Omit<Product, 'id' | 'createdAt'>\` excluye lo que no debe venir del usuario.",
    theory: `### En palabras simples
\`Omit<T, K>\` es lo opuesto a Pick: crea un tipo con TODAS las propiedades de T EXCEPTO las listadas en K.

### Ejemplo de la vida real
Llenar una solicitud de empleo sin escribir tu número de expediente: eso lo asigna recursos humanos al recibirla.

### En código
\`type CreateProduct = Omit<Product, 'id' | 'createdAt'>\`. \`const nuevo: CreateProduct = { name: 'Laptop', price: 1500 }\`.

### Tip para la entrevista
Omit es ideal para tipos de 'input' donde el ID o timestamps los genera el servidor. Complemento natural de Pick.`,
  },

  3: {
    descriptionPrefix:
      "Actualizas solo lo que cambió en tu perfil: el tema oscuro, sin tener que rellenar todo de nuevo.",
    everydayInExplanation:
      "Cambias solo el idioma de la app sin tocar notificaciones ni tema. \`Partial<Settings>\` hace todas las propiedades opcionales, perfecto para updates parciales o patches.",
    theory: `### En palabras simples
\`Partial<T>\` convierte cada propiedad de T en opcional: \`{ [K in keyof T]?: T[K] }\`. Puedes pasar un objeto con solo los campos que cambian.

### Ejemplo de la vida real
Avisar al administrador del edificio que cambiaste de número de teléfono, sin reenviar todos tus datos personales completos.

### En código
\`updateSettings({ theme: 'dark' })\` OK. \`updateSettings({})\` OK (sin cambios).

### Tip para la entrevista
El utility type más usado en apps CRUD. Combínalo con Omit para UpdateDTO: \`Partial<Omit<T, 'id'>>\`.`,
  },

  4: {
    descriptionPrefix:
      "Antes de enviar un trámite, verificas que todos los campos obligatorios estén llenos — ninguno puede faltar.",
    everydayInExplanation:
      "Un borrador de formulario tiene campos vacíos opcionales; al enviar, nombre, email y teléfono son obligatorios. \`Required<FormDraft>\` fuerza que todas las propiedades existan.",
    theory: `### En palabras simples
\`Required<T>\` hace obligatorias todas las propiedades de T. Opuesto de Partial. Útil para validar completitud antes de submit.

### Ejemplo de la vida real
Un paquete de documentos para un visado: el borrador permite faltar algunos papeles, pero la carpeta final debe traer todos completos y firmados.

### En código
\`type CompleteForm = Required<FormDraft>\`. \`submit({ name, email, phone })\` — todas garantizadas.

### Tip para la entrevista
Required es útil para transformar drafts opcionales en tipos de envío. Patrón: Partial para editar, Required para validar.`,
  },

  5: {
    descriptionPrefix:
      "Las reglas del reglamento están enmarcadas: puedes leerlas, pero no tachar ni reescribir artículos.",
    everydayInExplanation:
      "Un menú impreso en la pared del restaurante no lo modificas con plumón. \`Readonly<Config>\` marca todas las propiedades como solo lectura para evitar mutaciones accidentales.",
    theory: `### En palabras simples
\`Readonly<T>\` hace que todas las propiedades de T sean de solo lectura. \`config.port = 8080\` da error de compilación.

### Ejemplo de la vida real
Un contrato firmado: puedes leerlo, pero no borrar cláusulas con corrector. La función que recibe config en Readonly comunica que no la modificará.

### En código
\`function startServer(config: Readonly<Config>)\` — lectura OK, mutación prohibida.

### Tip para la entrevista
Usa Readonly en parámetros para comunicar intención. Recuerda: es shallow — objetos anidados pueden seguir siendo mutables.`,
  },

  6: {
    descriptionPrefix:
      "Un directorio donde cada nombre de contacto tiene su número asignado — y no puede faltar ninguno.",
    everydayInExplanation:
      "En una agenda, cada rol (admin, usuario, invitado) debe tener sus permisos definidos. \`Record<Role, Permissions>\` garantiza una entrada por cada clave del union type.",
    theory: `### En palabras simples
\`Record<K, V>\` crea \`{ [key in K]: V }\`. \`Record<Role, Permissions>\` exige permisos para admin, user y guest — si falta uno, error.

### Ejemplo de la vida real
Un menú de precios donde cada tamaño (chico, mediano, grande) DEBE tener su precio. No puedes vender 'grande' sin tarifa definida.

### En código
\`const rolePermissions: Record<Role, Permissions> = { admin: {...}, user: {...}, guest: {...} }\`.

### Tip para la entrevista
Record es el utility type para diccionarios/mapas type-safe. Combínalo con enums o union types como claves.`,
  },

  7: {
    descriptionPrefix:
      "De una caja mixta sacas solo las piezas rojas, dejando el resto adentro.",
    everydayInExplanation:
      "Tienes eventos de click, hover, teclado y scroll, pero solo quieres los de teclado. \`Extract<AllEvents, 'keydown' | 'keyup'>\` filtra un union manteniendo solo los miembros que coinciden.",
    theory: `### En palabras simples
\`Extract<T, U>\` filtra un union type: mantiene solo los miembros de T asignables a U. Es el 'filter' del sistema de tipos.

### Ejemplo de la vida real
De una canasta de frutas y verduras, separar solo las frutas. Extract hace esa separación a nivel de tipos.

### En código
\`type KeyEvents = Extract<AllEvents, 'keydown' | 'keyup'>\` → \`'keydown' | 'keyup'\`. \`Extract<Mixed, string>\` → solo strings del union.

### Tip para la entrevista
Extract es fundamental para filtrar unions. Conócelo junto con Exclude — son complementarios.`,
  },

  8: {
    descriptionPrefix:
      "De una lista de invitados quitas a quienes no confirmaron, dejando solo los que sí van.",
    everydayInExplanation:
      "Tienes tipos string, number, boolean, null y undefined, pero quieres eliminar null y undefined. \`Exclude<AllTypes, null | undefined>\` remueve miembros del union que coinciden con U.",
    theory: `### En palabras simples
\`Exclude<T, U>\` remueve de T los miembros asignables a U. Opuesto de Extract. \`NonNullable<T>\` es \`Exclude<T, null | undefined>\`.

### Ejemplo de la vida real
Limpiar una lista de compras quitando los ítems tachados (null) y los espacios en blanco (undefined). Lo que queda son valores reales.

### En código
\`type NonNullable2 = Exclude<AllTypes, null | undefined>\` → \`string | number | boolean\`.

### Tip para la entrevista
Exclude es el 'reject' del sistema de tipos. NonNullable<T> es su aplicación más común con strictNullChecks.`,
  },

  9: {
    descriptionPrefix:
      "Después de revisar la lista, te quedas solo con los ítems que sí existen — descartando los espacios vacíos.",
    everydayInExplanation:
      "Filtras null de un arreglo y te quedas solo con strings válidos. \`NonNullable<T>\` elimina null y undefined de un union, garantizando un valor 'real'.",
    theory: `### En palabras simples
\`NonNullable<T>\` = \`Exclude<T, null | undefined>\`. \`NonNullable<string | null | undefined>\` → \`string\`.

### Ejemplo de la vida real
Revisar una bandeja de entrada y quitar los sobre vacíos antes de procesar el contenido. Solo trabajas con lo que tiene algo adentro.

### En código
\`function process(val: DefiniteString): string\` con \`DefiniteString = NonNullable<MaybeString>\`. Seguro llamar \`.toUpperCase()\`.

### Tip para la entrevista
Esencial con strictNullChecks. Úsalo después de type guards o filtros para estrechar tipos sin casts manuales.`,
  },

  10: {
    descriptionPrefix:
      "Miras lo que una máquina produce y anotas la forma del producto sin tener que diseñarlo tú manualmente.",
    everydayInExplanation:
      "Una fábrica de galletas produce paquetes con cierta forma; tú describes esa forma observando la salida. \`ReturnType<typeof createUser>\` extrae el tipo de retorno de una función existente.",
    theory: `### En palabras simples
\`ReturnType<T>\` extrae el tipo de retorno de una función. \`type User = ReturnType<typeof createUser>\` infiere la forma del objeto que retorna createUser.

### Ejemplo de la vida real
Copiar la receta de un plato probando el resultado final, en lugar de inventar la lista de ingredientes desde cero.

### En código
\`type User = ReturnType<typeof createUser>\` → \`{ id: string; name: string; age: number; createdAt: Date }\`.

### Tip para la entrevista
Evita duplicar tipos ya definidos implícitamente en funciones. Combínalo con Awaited para funciones async.`,
  },

  11: {
    descriptionPrefix:
      "Anotas qué ingredientes pide una receta sin reescribir la receta completa.",
    everydayInExplanation:
      "La receta 'updateUser' pide id (número), name (texto) y active (sí/no). \`Parameters<typeof updateUser>\` extrae los tipos de parámetros como tupla.",
    theory: `### En palabras simples
\`Parameters<T>\` retorna una tupla con los tipos de cada parámetro. \`Parameters<typeof updateUser>\` → \`[number, string, boolean]\`.

### Ejemplo de la vida real
Antes de cocinar, listar los ingredientes que pide la receta en orden: primero harina, luego huevo, luego leche.

### En código
\`type IdType = UpdateParams[0]\` → number. \`function logAndUpdate(...args: Parameters<typeof updateUser>)\` para wrappers.

### Tip para la entrevista
\`Parameters<T>[0]\` es el primer parámetro. Útil para reutilizar firmas en HOFs, mocks y decoradores.`,
  },

  12: {
    descriptionPrefix:
      "Abres una caja de regalo dentro de otra caja hasta llegar al regalo real.",
    everydayInExplanation:
      "Un paquete puede venir envuelto en varias capas de papel de regalo (Promises anidadas). \`Awaited<T>\` desenvuelve recursivamente hasta obtener el contenido final.",
    theory: `### En palabras simples
\`Awaited<Promise<string>>\` → \`string\`. \`Awaited<Promise<Promise<number>>>\` → \`number\`. Si T no es Promise, retorna T tal cual.

### Ejemplo de la vida real
Un sobre dentro de otro sobre de correos: abres capa por capa hasta leer la carta. Awaited hace lo mismo con tipos async anidados.

### En código
\`type Data = Awaited<ReturnType<typeof fetchData>>\` para inferir el tipo resuelto de una función async.

### Tip para la entrevista
Awaited es recursivo. Combínalo con ReturnType para tipar resultados de fetch/API sin duplicar interfaces.`,
  },

  13: {
    descriptionPrefix:
      "Combinas herramientas de cocina: primero cortas, luego sazonas, luego sirves — cada paso transforma el plato.",
    everydayInExplanation:
      "Para crear un usuario quitas id y fecha (Omit), para actualizar haces todo opcional (Partial), para la respuesta congelas todo (Readonly), para listados eliges campos (Pick). Combinar utilities crea DTOs precisos.",
    theory: `### En palabras simples
\`CreateUser = Omit<User, 'id' | 'createdAt'>\`. \`UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>>\`. \`UserResponse = Readonly<User>\`. \`UserListItem = Pick<User, 'id' | 'name' | 'role'>\`.

### Ejemplo de la vida real
Preparar un menú: versión completa para cocina, versión resumida para clientes, versión congelada para archivo. Mismo plato, distintas presentaciones.

### En código
Cada combinación produce un tipo de dominio distinto sin redefinir User manualmente.

### Tip para la entrevista
Tip senior: combina utilities para CreateDTO, UpdateDTO, ResponseDTO. Demuestra composición sobre memorización de tipos built-in.`,
  },

  14: {
    descriptionPrefix:
      "Actualizas solo una habitación de la casa, no toda la estructura — y dentro de esa habitación, solo lo que cambió.",
    everydayInExplanation:
      "Partial solo hace opcional el primer nivel; si config tiene server.host anidado, Partial no vuelve opcional host dentro de server. \`DeepPartial\` recurre en todos los niveles.",
    theory: `### En palabras simples
\`type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }\`. Recursivo: propiedades anidadas también son opcionales.

### Ejemplo de la vida real
Renovar un departamento: puedes cambiar solo la pintura del baño sin tocar la cocina ni el resto del baño. DeepPartial permite overrides parciales en cualquier profundidad.

### En código
\`const overrides: PartialConfig = { server: { port: 8080 } }\` — host es opcional dentro de server.

### Tip para la entrevista
Partial es shallow. DeepPartial necesita recursión. Cuidado con tipos primitivos vs object — \`Date\` y arreglos pueden necesitar tratamiento especial.`,
  },

  15: {
    descriptionPrefix:
      "Quitale el candado a un documento que estaba protegido para poder editarlo de nuevo.",
    everydayInExplanation:
      "Un contrato en modo solo lectura no lo puedes modificar; Mutable le quita el candado a todas las propiedades. El prefijo \`-\` en mapped types remueve modificadores como \`-readonly\`.",
    theory: `### En palabras simples
\`type Mutable<T> = { -readonly [K in keyof T]: T[K] }\`. Convierte propiedades readonly en mutables. \`-?\` quitaría opcional (opuesto de \`?\`).

### Ejemplo de la vida real
Fotocopiar un documento oficial para llenar la copia a mano: la copia ya no está bajo vidrio, puedes escribir en ella.

### En código
\`type EditableUser = Mutable<FrozenUser>\`. \`user.name = 'Iram Rocha'\` OK después de Mutable.

### Tip para la entrevista
El prefijo \`-\` en mapped types REMUEVE modificadores. \`-readonly\` quita readonly, \`-?\` quita opcional. Patrón para transformar tipos congelados.`,
  },
};
