import type { Module } from '../index';

export const efCorePerformanceModule: Module = {
  key: 'ef-core-performance',
  name: 'EF Core: Alto Rendimiento',
  description: 'Domina las técnicas avanzadas de Entity Framework Core para evitar cuellos de botella, problemas de memoria y optimizar consultas en aplicaciones a gran escala.',
  icon: 'database',
  badge: 'Senior',
  group: 'Backend',
  exercises: [
    {
      id: 1,
      title: 'El Vigilante Agotado (Tracking)',
      stars: 3,
      category: 'Memoria',
      description: 'Por defecto, EF Core vigila cada entidad que recuperas para ver si la modificas y hacer un UPDATE. Si solo quieres mostrar una lista de productos en una web, este "vigilante" consume muchísima RAM innecesariamente.',
      objective: 'Desactiva el rastreo de entidades para una consulta de solo lectura.',
      fileName: 'ProductRepository.cs',
      explanationText: 'Imagina que contratas a un guardaespaldas para vigilar una foto impresa; no tiene sentido, la foto no va a cambiar. Al usar [INPUT_1], le decimos a EF Core que nos entregue los datos "desconectados", reduciendo el consumo de memoria y aumentando la velocidad drásticamente en consultas de solo lectura.',
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
        'INPUT_1': 'AsNoTracking'
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
      title: 'El Problema N+1 (Eager Loading)',
      stars: 4,
      category: 'Red de Datos',
      description: 'Consultar una lista de Autores y luego iterar sobre ellos para obtener sus Libros provoca que EF Core haga una consulta inicial (1) y luego una consulta extra por cada autor (N). Si hay 100 autores, harás 101 viajes a la base de datos.',
      objective: 'Carga los libros relacionados en la misma consulta inicial usando Eager Loading.',
      fileName: 'AuthorRepository.cs',
      explanationText: 'El problema N+1 es como ir al supermercado a comprar los ingredientes de una receta, pero viajando de tu casa al súper por cada ingrediente individual. Al usar [INPUT_1], llevas una lista y traes todo en un solo viaje usando un JOIN de SQL.',
      codeSnippet: `
public async Task<List<Author>> GetAuthorsWithBooksAsync()
{
    // Corrige esta consulta para traer a los autores y sus libros de un solo golpe
    return await _context.Authors
        .[INPUT_1](a => a.Books)
        .ToListAsync();
}`,
      inputs: {
        'INPUT_1': 'Include'
      },
      completeCode: `
public async Task<List<Author>> GetAuthorsWithBooksAsync()
{
    // Corrige esta consulta para traer a los autores y sus libros de un solo golpe
    return await _context.Authors
        .Include(a => a.Books)
        .ToListAsync();
}`
    },
    {
      id: 3,
      title: 'Explosión Cartesiana (Split Queries)',
      stars: 5,
      category: 'Optimización SQL',
      description: 'Cuando usas múltiples `.Include()` en relaciones uno-a-muchos, SQL Server devuelve el producto cartesiano. Si un Blog tiene 50 posts y 20 comentarios, la consulta devolverá muchísimas filas duplicadas del Blog, colapsando la red.',
      objective: 'Indica a EF Core que divida la consulta en múltiples llamadas SQL más pequeñas y eficientes.',
      fileName: 'BlogService.cs',
      explanationText: 'Imagina pedir una pizza y que te manden un repartidor distinto por cada rebanada de pepperoni. La red se satura enviando la información base (la masa) una y otra vez. Usando [INPUT_1](), EF Core lanza una consulta para el Blog y otra para los Posts, ensamblándolos en memoria de forma limpia.',
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
        'INPUT_1': 'AsSplitQuery'
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
      title: 'Eficiencia: ¿Existe al menos uno?',
      stars: 2,
      category: 'Performance',
      description: 'A menudo necesitamos saber si un registro existe antes de hacer una lógica. Muchos usan `.CountAsync() > 0`, lo cual obliga a la base de datos a contar todos los registros de la tabla.',
      objective: 'Optimiza la validación de existencia para que se detenga al encontrar el primer registro coincidente.',
      fileName: 'UserService.cs',
      explanationText: 'Usar Count es como contar a todas las personas en un estadio para saber si hay al menos una con camiseta roja. Usar [INPUT_1] es como mirar al público y detenerte en cuanto ves la primera camiseta roja. Es muchísimo más rápido.',
      codeSnippet: `
public async Task<bool> IsEmailTakenAsync(string email)
{
    // Mal: await _context.Users.Where(u => u.Email == email).CountAsync() > 0;
    
    // Mejor práctica:
    return await _context.Users
        .[INPUT_1](u => u.Email == email);
}`,
      inputs: {
        'INPUT_1': 'AnyAsync'
      },
      completeCode: `
public async Task<bool> IsEmailTakenAsync(string email)
{
    // Mal: await _context.Users.Where(u => u.Email == email).CountAsync() > 0;
    
    // Mejor práctica:
    return await _context.Users
        .AnyAsync(u => u.Email == email);
}`
    },
    {
      id: 5,
      title: 'Actualizaciones Masivas (Bulk Updates)',
      stars: 5,
      category: 'Eficiencia Extrema',
      description: 'En EF Core anterior a la versión 7, para actualizar 1000 registros, tenías que cargarlos en memoria, cambiar su propiedad y llamar a SaveChanges. Esto era lentísimo.',
      objective: 'Utiliza la nueva característica de EF Core para actualizar múltiples registros directamente en la base de datos sin cargarlos a la memoria.',
      fileName: 'SubscriptionJob.cs',
      explanationText: 'Cargar registros para modificarlos es como pedir a 1,000 empleados que vengan a tu oficina uno por uno para decirles que cambien su uniforme. Usar [INPUT_1] es usar el altavoz para que todos lo cambien al mismo tiempo. ¡Cuidado! No dispara los interceptores del SaveChanges.',
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
        'INPUT_1': 'ExecuteUpdateAsync'
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
      title: 'Eliminaciones Masivas (Bulk Deletes)',
      stars: 4,
      category: 'Eficiencia Extrema',
      description: 'Similar a las actualizaciones, borrar miles de registros trayéndolos primero con un \`.ToList()\` y luego pasando la lista a \`.RemoveRange()\` satura el Change Tracker.',
      objective: 'Elimina registros antiguos ejecutando la instrucción DELETE directamente en el motor de base de datos.',
      fileName: 'LogCleanupWorker.cs',
      explanationText: 'Usando [INPUT_1], EF Core traduce tu consulta LINQ en una sentencia "DELETE FROM Logs WHERE..." y la ejecuta de inmediato. Es vital en trabajos de fondo o limpieza de datos grandes.',
      codeSnippet: `
public async Task CleanupOldLogsAsync(DateTime threshold)
{
    await _context.SystemLogs
        .Where(log => log.CreatedAt < threshold)
        .[INPUT_1]();
}`,
      inputs: {
        'INPUT_1': 'ExecuteDeleteAsync'
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
      title: 'Proyección (Evitando SELECT *)',
      stars: 4,
      category: 'Red de Datos',
      description: 'Si una tabla "Usuario" tiene 30 columnas, incluyendo fotos en Base64, e iteramos la tabla solo para mostrar los nombres, estamos moviendo megabytes de datos inútiles.',
      objective: 'Usa una proyección para seleccionar únicamente los campos necesarios y mapearlos a un DTO.',
      fileName: 'UserQueryService.cs',
      explanationText: 'Seleccionar solo lo necesario usando [INPUT_1] genera un comando SQL que pide campos específicos (SELECT Name, Email FROM...). Esto ahorra ancho de banda entre tu API y PostgreSQL/SQL Server.',
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
        'INPUT_1': 'Select'
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
      title: 'Paginación en Base de Datos',
      stars: 3,
      category: 'Performance',
      description: 'Al cargar listas para interfaces de usuario, nunca debes traer todos los registros con ToList() y luego cortarlos en memoria.',
      objective: 'Implementa paginación en el motor de SQL utilizando los métodos LINQ para saltar y tomar registros.',
      fileName: 'ArticleRepository.cs',
      explanationText: 'Los métodos [INPUT_1] (para saltar los registros de las páginas anteriores) y [INPUT_2] (para limitar los que se envían) se traducen eficientemente a comandos OFFSET y FETCH NEXT en SQL Server.',
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
        'INPUT_1': 'Skip',
        'INPUT_2': 'Take'
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
  ]
};
