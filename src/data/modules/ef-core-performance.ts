import type { Exercise } from "@/lib/types";

export const EF_CORE_PERFORMANCE: Exercise[] = [
  {
    id: 1,
    title: "El Vigilante Agotado (Tracking)",
    stars: 3,
    category: "Memoria",
    description: "Por defecto, EF Core vigila cada entidad que recuperas para ver si la modificas y hacer un UPDATE. Si solo quieres mostrar una lista de productos en una web, este \"vigilante\" consume muchísima RAM innecesariamente.",
    objective: "Desactiva el rastreo de entidades para una consulta de solo lectura.",
    tags: ["AsNoTracking", "rendimiento", "solo lectura"],
    fileName: "ProductRepository.cs",
    theory: `## El coste del tracking
EF Core rastrea cada entidad para detectar si la modificas y generar el UPDATE en SaveChanges. En una consulta de solo lectura, ese rastreo es puro desperdicio.

### Qué hace AsNoTracking
- Devuelve entidades 'desconectadas' del Change Tracker.
- No hay comparación de cambios → menos CPU y menos RAM.

### Cuándo usarlo
Siempre que solo vayas a mostrar datos (listados, catálogos). Si vas a editar y guardar, déjalo con tracking.

### Regla
Combínalo con Select hacia DTO: al proyectar a un DTO, el tracking tampoco aporta nada.`,
    explanationText: "🌍 Ejemplo cotidiano: contratar un guardaespaldas para vigilar una foto impresa no tiene sentido: la foto no va a cambiar.\n\nPor defecto EF Core 'vigila' cada entidad que recuperas para detectar cambios y hacer UPDATE. AsNoTracking entrega los datos desconectados: menos RAM y más velocidad en consultas de solo lectura, que son la mayoría de los listados.",
    codeSnippet: `
public async Task<List<ProductDto>> GetCatalogAsync()
{
    return await _context.Products
        .[INPUT_1]()
        .Where(p => p.IsActive)
        .Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name
        })
        .ToListAsync();
}`,
    inputs: {
      "INPUT_1": "AsNoTracking"
    },
    completeCode: `
public async Task<List<ProductDto>> GetCatalogAsync()
{
    return await _context.Products
        .AsNoTracking()
        .Where(p => p.IsActive)
        .Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name
        })
        .ToListAsync();
}`
  },
  {
    id: 2,
    title: "El Problema N+1 (Eager Loading)",
    stars: 4,
    category: "Red de Datos",
    description: "Consultar una lista de Autores y luego iterar sobre ellos para obtener sus Libros provoca que EF Core haga una consulta inicial (1) y luego una consulta extra por cada autor (N). Si hay 100 autores, harás 101 viajes a la base de datos.",
    objective: "Carga los libros relacionados en la misma consulta inicial usando Eager Loading.",
    tags: ["Include", "N+1", "eager loading"],
    fileName: "AuthorRepository.cs",
    theory: `## El problema N+1
Al iterar una colección y consultar la relación de cada elemento, generas 1 consulta inicial + N consultas extra.

### Ejemplo
100 autores → 1 consulta de autores + 100 de libros = 101 round-trips.

### La solución
\`Include(a => a.Books)\` genera un JOIN y trae autor + libros en una sola consulta.

### Ojo con lo contrario
Múltiples Include de colecciones (uno-a-muchos) pueden causar explosión cartesiana: ahí la solución es AsSplitQuery.`,
    explanationText: "🌍 Ejemplo cotidiano: el N+1 es ir al súper una vez por cada ingrediente en vez de llevar la lista completa.\n\nSin Include, EF Core hace 1 consulta por autores y N más por sus libros: con 100 autores son 101 viajes a la BD. Include hace un JOIN y trae todo en una sola consulta; es la corrección que más rendimiento da en APIs.",
    codeSnippet: `
public async Task<List<Author>> GetAuthorsWithBooksAsync()
{
    return await _context.Authors
        .[INPUT_1](a => a.Books)
        .ToListAsync();
}`,
    inputs: {
      "INPUT_1": "Include"
    },
    completeCode: `
public async Task<List<Author>> GetAuthorsWithBooksAsync()
{
    return await _context.Authors
        .Include(a => a.Books)
        .ToListAsync();
}`
  },
  {
    id: 3,
    title: "Explosión Cartesiana (Split Queries)",
    stars: 5,
    category: "Optimización SQL",
    description: "Cuando usas múltiples `.Include()` en relaciones uno-a-muchos, SQL Server devuelve el producto cartesiano. Si un Blog tiene 50 posts y 20 comentarios, la consulta devolverá muchísimas filas duplicadas del Blog, colapsando la red.",
    objective: "Indica a EF Core que divida la consulta en múltiples llamadas SQL más pequeñas y eficientes.",
    tags: ["AsSplitQuery", "explosión cartesiana", "optimización"],
    fileName: "BlogService.cs",
    theory: `## Explosión cartesiana y split queries
Un solo JOIN con dos colecciones uno-a-muchos multiplica las filas: 50 posts × 20 comentarios = 1000 filas repetidas del Blog.

### La solución
\`AsSplitQuery()\` separa la consulta: una para el Blog, otra para Posts, otra para Contributors.

### Cuándo usarlo
- Varios Include de colecciones a la vez.
- Resultados grandes donde el JOIN duplica datos.

### Ojo
Puedes activarlo globalmente con \`UseSplitQueries()\`, pero cambia el comportamiento por defecto: decide por consulta.`,
    explanationText: "🌍 Ejemplo cotidiano: pedir una pizza y que manden un repartidor por cada rebanada satura la calle: AsSplitQuery reparte mejor.\n\nCon varios Include de colecciones, el JOIN produce el producto cartesiano y duplica las filas del padre. AsSplitQuery lanza una consulta por colección y las ensambla en memoria, evitando la explosión de datos por la red.",
    codeSnippet: `
public async Task<Blog> GetFullBlogDetailsAsync(int blogId)
{
    return await _context.Blogs
        .Include(b => b.Posts)
        .Include(b => b.Contributors)
        .[INPUT_1]()
        .FirstOrDefaultAsync(b => b.Id == blogId);
}`,
    inputs: {
      "INPUT_1": "AsSplitQuery"
    },
    completeCode: `
public async Task<Blog> GetFullBlogDetailsAsync(int blogId)
{
    return await _context.Blogs
        .Include(b => b.Posts)
        .Include(b => b.Contributors)
        .AsSplitQuery()
        .FirstOrDefaultAsync(b => b.Id == blogId);
}`
  },
  {
    id: 4,
    title: "Eficiencia: ¿Existe al menos uno?",
    stars: 2,
    category: "Performance",
    description: "A menudo necesitamos saber si un registro existe antes de hacer una lógica. Muchos usan `.CountAsync() > 0`, lo cual obliga a la base de datos a contar todos los registros de la tabla.",
    objective: "Optimiza la validación de existencia para que se detenga al encontrar el primer registro coincidente.",
    tags: ["AnyAsync", "CountAsync", "eficiencia"],
    fileName: "UserService.cs",
    explanationText: "🌍 Ejemplo cotidiano: para saber si hay alguien con camiseta roja, no cuentas a todo el estadio: te detienes en la primera.\n\nAnyAsync genera un EXISTS que se detiene al primer match; CountAsync() > 0 obliga a la BD a contar todos los registros. Validar existencia con Any es más rápido y expresa mejor la intención.",
    codeSnippet: `
public async Task<bool> IsEmailTakenAsync(string email)
{
    return await _context.Users
        .[INPUT_1](u => u.Email == email);
}`,
    inputs: {
      "INPUT_1": "AnyAsync"
    },
    completeCode: `
public async Task<bool> IsEmailTakenAsync(string email)
{
    return await _context.Users
        .AnyAsync(u => u.Email == email);
}`
  },
  {
    id: 5,
    title: "Actualizaciones Masivas (Bulk Updates)",
    stars: 5,
    category: "Eficiencia Extrema",
    description: "En EF Core anterior a la versión 7, para actualizar 1000 registros, tenías que cargarlos en memoria, cambiar su propiedad y llamar a SaveChanges. Esto era lentísimo.",
    objective: "Utiliza la nueva característica de EF Core para actualizar múltiples registros directamente en la base de datos sin cargarlos a la memoria.",
    tags: ["ExecuteUpdateAsync", "bulk", "SetProperty"],
    fileName: "SubscriptionJob.cs",
    theory: `## Actualizaciones masivas (bulk)
Antes de EF Core 7, actualizar 1000 registros implicaba cargarlos en memoria, cambiar la propiedad y SaveChanges.

### La solución moderna
\`ExecuteUpdateAsync(s => s.SetProperty(x => x.IsActive, false))\` genera un solo UPDATE en SQL.

### Qué pierdes
- No pasa por el Change Tracker: interceptores y eventos de SaveChanges no se disparan.
- No devuelve las entidades afectadas.

### Cuándo usarlo
Trabajos en lote, limpiezas, cambios masivos de estado. Para editar un registro individual, el flujo normal sigue siendo mejor.`,
    explanationText: "🌍 Ejemplo cotidiano: no citas a 1000 empleados uno a uno: usas el altavoz para que todos cambien a la vez.\n\nExecuteUpdateAsync (EF Core 7+) traduce el LINQ a un UPDATE directo en SQL, sin cargar las filas en memoria. Ojo: al saltarse el Change Tracker no dispara interceptores ni eventos de SaveChanges; tenlo en cuenta con auditoría y soft delete.",
    codeSnippet: `
public async Task DeactivateExpiredSubscriptionsAsync(DateTime today)
{
    await _context.Subscriptions
        .Where(s => s.ExpirationDate < today && s.IsActive)
        .[INPUT_1](
            s => s.SetProperty(x => x.IsActive, false)
        );
}`,
    inputs: {
      "INPUT_1": "ExecuteUpdateAsync"
    },
    completeCode: `
public async Task DeactivateExpiredSubscriptionsAsync(DateTime today)
{
    await _context.Subscriptions
        .Where(s => s.ExpirationDate < today && s.IsActive)
        .ExecuteUpdateAsync(
            s => s.SetProperty(x => x.IsActive, false)
        );
}`
  },
  {
    id: 6,
    title: "Eliminaciones Masivas (Bulk Deletes)",
    stars: 4,
    category: "Eficiencia Extrema",
    description: "Similar a las actualizaciones, borrar miles de registros trayéndolos primero con un `.ToList()` y luego pasando la lista a `.RemoveRange()` satura el Change Tracker.",
    objective: "Elimina registros antiguos ejecutando la instrucción DELETE directamente en el motor de base de datos.",
    tags: ["ExecuteDeleteAsync", "bulk delete", "limpieza"],
    fileName: "LogCleanupWorker.cs",
    explanationText: "🌍 Ejemplo cotidiano: vaciar un cajón entero de papeles viejos es más rápido que sacar hoja por hoja.\n\nExecuteDeleteAsync traduce el LINQ a un DELETE directo en la BD, sin traer las filas a memoria ni saturar el Change Tracker. Es la herramienta para limpiar logs y datos antiguos en jobs de fondo.",
    codeSnippet: `
public async Task CleanupOldLogsAsync(DateTime threshold)
{
    await _context.SystemLogs
        .Where(log => log.CreatedAt < threshold)
        .[INPUT_1]();
}`,
    inputs: {
      "INPUT_1": "ExecuteDeleteAsync"
    },
    completeCode: `
public async Task CleanupOldLogsAsync(DateTime threshold)
{
    await _context.SystemLogs
        .Where(log => log.CreatedAt < threshold)
        .ExecuteDeleteAsync();
}`
  },
  {
    id: 7,
    title: "Proyección (Evitando SELECT *)",
    stars: 4,
    category: "Red de Datos",
    description: "Si una tabla \"Usuario\" tiene 30 columnas, incluyendo fotos en Base64, e iteramos la tabla solo para mostrar los nombres, estamos moviendo megabytes de datos inútiles.",
    objective: "Usa una proyección para seleccionar únicamente los campos necesarios y mapearlos a un DTO.",
    tags: ["Select", "proyección", "DTO"],
    fileName: "UserQueryService.cs",
    explanationText: "🌍 Ejemplo cotidiano: no envías el camión entero para entregar un sobre: proyectar con Select envía solo los campos que pediste.\n\nSelect hacia un DTO genera un SQL con columnas específicas, evitando el SELECT * que arrastra fotos en Base64 o columnas que nadie usa. Menos datos entre BD y API = menos latencia y menos memoria.",
    codeSnippet: `
public async Task<List<UserSummaryDto>> GetUsersSummaryAsync()
{
    return await _context.Users
        .AsNoTracking()
        .[INPUT_1](u => new UserSummaryDto
        {
            Id = u.Id,
            FullName = u.FirstName + " " + u.LastName
        })
        .ToListAsync();
}`,
    inputs: {
      "INPUT_1": "Select"
    },
    completeCode: `
public async Task<List<UserSummaryDto>> GetUsersSummaryAsync()
{
    return await _context.Users
        .AsNoTracking()
        .Select(u => new UserSummaryDto
        {
            Id = u.Id,
            FullName = u.FirstName + " " + u.LastName
        })
        .ToListAsync();
}`
  },
  {
    id: 8,
    title: "Paginación en Base de Datos",
    stars: 3,
    category: "Performance",
    description: "Al cargar listas para interfaces de usuario, nunca debes traer todos los registros con ToList() y luego cortarlos en memoria.",
    objective: "Implementa paginación en el motor de SQL utilizando los métodos LINQ para saltar y tomar registros.",
    tags: ["Skip", "Take", "paginación"],
    fileName: "ArticleRepository.cs",
    explanationText: "🌍 Ejemplo cotidiano: sirves el menú por páginas, no lanzas el libro entero sobre la mesa.\n\nSkip y Take se traducen a OFFSET/FETCH NEXT en SQL, así la BD solo devuelve la página pedida. Traer todo con ToList() y cortar en memoria funciona hasta que la tabla crece: entonces se vuelve un cuello de botella.",
    codeSnippet: `
public async Task<List<Article>> GetArticlesPageAsync(int pageNumber, int pageSize)
{
    int recordsToSkip = (pageNumber - 1) * pageSize;

    return await _context.Articles
        .OrderByDescending(a => a.PublishDate)
        .[INPUT_1](recordsToSkip)
        .[INPUT_2](pageSize)
        .ToListAsync();
}`,
    inputs: {
      "INPUT_1": "Skip",
      "INPUT_2": "Take"
    },
    completeCode: `
public async Task<List<Article>> GetArticlesPageAsync(int pageNumber, int pageSize)
{
    int recordsToSkip = (pageNumber - 1) * pageSize;

    return await _context.Articles
        .OrderByDescending(a => a.PublishDate)
        .Skip(recordsToSkip)
        .Take(pageSize)
        .ToListAsync();
}`
  }
];
