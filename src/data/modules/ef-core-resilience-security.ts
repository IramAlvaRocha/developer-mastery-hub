import type { Exercise } from "@/lib/types";

export const EF_CORE_RESILIENCE_SECURITY: Exercise[] = [
  {
    id: 1,
    title: "Configuración de RowVersion (SQL Server)",
    stars: 3,
    category: "Concurrencia",
    description: "Dos administradores abren el mismo 'Product' al mismo tiempo. El Admin A cambia el precio y guarda. Segundos después, el Admin B guarda su propia versión desactualizada, sobrescribiendo el cambio del Admin A sin darse cuenta ('Lost Update').",
    objective: "Configurar la propiedad 'RowVersion' (byte[]) en la entidad Product para que EF Core la use como token de concurrencia nativo de SQL Server.",
    tags: ["EF Core", "Concurrencia", "RowVersion"],
    fileName: "ProductConfiguration.cs",
    completed: false,
    explanationText: "IsRowVersion() le dice a SQL Server que gestione automáticamente una 'marca de tiempo' binaria que cambia en cada UPDATE. Es como el número de ticket en la panadería: cuando pides un pastel, te dan un ticket con un número. Si alguien más intenta reclamar el mismo pedido con un ticket viejo, el empleado se da cuenta de que el número no coincide con el actual y rechaza la operación, evitando que dos personas se lleven el mismo pastel.",
    codeSnippet: `public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.RowVersion)
               .[INPUT_1]();
    }
}`,
    inputs: { "INPUT_1": "IsRowVersion" },
    completeCode: `public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.RowVersion)
               .IsRowVersion();
    }
}`
  },
  {
    id: 2,
    title: "Capturando DbUpdateConcurrencyException",
    stars: 4,
    category: "Concurrencia",
    description: "Aunque el modelo ya tiene configurado el RowVersion, la aplicación sigue lanzando errores 500 sin control cuando ocurre un conflicto de edición simultánea. El equipo de soporte necesita que el sistema responda con un mensaje claro en lugar de un crash.",
    objective: "Envolver la llamada a SaveChangesAsync en un bloque try/catch que capture DbUpdateConcurrencyException y lance una excepción de dominio personalizada.",
    tags: ["EF Core", "Concurrencia", "Exception Handling"],
    fileName: "ProductService.cs",
    completed: false,
    explanationText: "DbUpdateConcurrencyException es la alarma que EF Core dispara cuando detecta que el 'ticket' (RowVersion) que enviaste ya no coincide con el de la base de datos. Es como cuando intentas pagar un cheque en el banco pero el cajero ve que el saldo ya cambió desde que revisaste tu cuenta esta mañana: el banco no procesa el pago a ciegas, te avisa para que verifiques la información actualizada antes de continuar.",
    codeSnippet: `public async Task UpdateProductAsync(Product product)
{
    _context.Entry(product).State = EntityState.Modified;

    try
    {
        await _context.[INPUT_1]();
    }
    catch (DbUpdateConcurrencyException ex)
    {
        throw new ConcurrencyConflictException(
            "El producto fue modificado por otro usuario.", [INPUT_2]);
    }
}`,
    inputs: { "INPUT_1": "SaveChangesAsync", "INPUT_2": "ex" },
    completeCode: `public async Task UpdateProductAsync(Product product)
{
    _context.Entry(product).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException ex)
    {
        throw new ConcurrencyConflictException(
            "El producto fue modificado por otro usuario.", ex);
    }
}`
  },
  {
    id: 3,
    title: "Token de Concurrencia Manual (Multi-Proveedor)",
    stars: 4,
    category: "Concurrencia",
    description: "La aplicación debe migrar de SQL Server a PostgreSQL, que no soporta el tipo 'rowversion' nativo. Se necesita una estrategia de concurrencia optimista basada en una columna 'LastModified' de tipo timestamp que funcione en cualquier proveedor.",
    objective: "Configurar la propiedad 'LastModified' como token de concurrencia genérico usando IsConcurrencyToken(), compatible con cualquier base de datos relacional.",
    tags: ["EF Core", "Concurrencia", "Multi-DB"],
    fileName: "OrderConfiguration.cs",
    completed: false,
    explanationText: "IsConcurrencyToken() funciona en cualquier base de datos porque no depende de un tipo de dato especial del motor, solo le pide a EF Core que compare el valor antes y después de guardar. Es como firmar un contrato con la fecha y hora exacta escritas a mano: no importa si estás en una oficina con reloj digital o uno de pared, cualquiera puede verificar si la fecha del contrato coincide con la última versión firmada.",
    codeSnippet: `public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.LastModified)
               .[INPUT_1]();
    }
}`,
    inputs: { "INPUT_1": "IsConcurrencyToken" },
    completeCode: `public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.LastModified)
               .IsConcurrencyToken();
    }
}`
  },
  {
    id: 4,
    title: "Corrección de SQL Injection en Búsqueda por Categoría",
    stars: 4,
    category: "Ciberseguridad",
    description: "Un pentest interno descubrió que el endpoint de búsqueda de productos es vulnerable. Un atacante envió category = \"Electronics'; DROP TABLE Products; --\" y logró comprometer datos, ya que el string se concatena directamente en el SQL.",
    objective: "Reemplazar el uso inseguro de FromSqlRaw con concatenación de strings por FromSqlInterpolated, que parametriza automáticamente los valores.",
    tags: ["Ciberseguridad", "SQL Injection", "OWASP"],
    fileName: "ProductRepository.cs",
    completed: false,
    explanationText: "FromSqlInterpolated convierte automáticamente cada valor interpolado en un parámetro seguro (@p0, @p1...) en lugar de pegarlo directamente en el texto del comando SQL. Es como pedirle a un cajero de banco que deposite '100 dólares' en lugar de entregarle un papel donde tú mismo escribiste a mano el monto: el cajero (la base de datos) solo confía en el sistema oficial de conteo (los parámetros), nunca en texto libre que alguien pudo alterar.",
    codeSnippet: `public async Task<List<Product>> SearchByCategoryAsync(string category)
{
    // Vulnerable: return await _context.Products
    //     .FromSqlRaw($"SELECT * FROM Products WHERE Category = '{category}'")
    //     .ToListAsync();

    return await _context.Products
        .[INPUT_1]($"SELECT * FROM Products WHERE Category = {[INPUT_2]}")
        .ToListAsync();
}`,
    inputs: { "INPUT_1": "FromSqlInterpolated", "INPUT_2": "category" },
    completeCode: `public async Task<List<Product>> SearchByCategoryAsync(string category)
{
    return await _context.Products
        .FromSqlInterpolated($"SELECT * FROM Products WHERE Category = {category}")
        .ToListAsync();
}`
  },
  {
    id: 5,
    title: "SQL Injection con Múltiples Parámetros",
    stars: 4,
    category: "Ciberseguridad",
    description: "El endpoint de administración permite filtrar usuarios por dominio de correo y estado de cuenta. El código actual concatena ambos valores directamente en el string SQL, permitiendo a un atacante inyectar una cláusula UNION SELECT para extraer contraseñas de otra tabla.",
    objective: "Migrar la consulta a FromSqlInterpolated interpolando ambos parámetros (domain y isActive) de forma segura.",
    tags: ["Ciberseguridad", "SQL Injection", "OWASP"],
    fileName: "UserRepository.cs",
    completed: false,
    explanationText: "Cuantos más valores concatenes directamente en un string SQL, más 'puertas sin cerradura' dejas abiertas para un atacante. FromSqlInterpolated cierra todas esas puertas a la vez, tratando cada variable como un paquete sellado que se entrega por separado, nunca mezclado con las instrucciones. Es como enviar cartas certificadas en sobres individuales en lugar de escribir todos los mensajes en una sola hoja que cualquiera podría alterar antes de que llegue a destino.",
    codeSnippet: `public async Task<List<User>> FilterUsersAsync(string domain, bool isActive)
{
    return await _context.Users
        .[INPUT_1]($@"SELECT * FROM Users 
                       WHERE Email LIKE {[INPUT_2] + "%"} 
                       AND IsActive = {[INPUT_3]}")
        .ToListAsync();
}`,
    inputs: { "INPUT_1": "FromSqlInterpolated", "INPUT_2": "domain", "INPUT_3": "isActive" },
    completeCode: `public async Task<List<User>> FilterUsersAsync(string domain, bool isActive)
{
    return await _context.Users
        .FromSqlInterpolated($@"SELECT * FROM Users 
                       WHERE Email LIKE {domain + "%"} 
                       AND IsActive = {isActive}")
        .ToListAsync();
}`
  },
  {
    id: 6,
    title: "Composición Segura con FromSqlInterpolated + LINQ",
    stars: 5,
    category: "Ciberseguridad",
    description: "El equipo necesita agregar paginación a una consulta SQL cruda que ya fue corregida contra inyección, pero al intentar encadenar .Skip() y .Take() directamente sobre FromSqlRaw, la aplicación lanza una excepción de EF Core porque el proveedor no puede componer sobre SQL crudo con ORDER BY dinámico mal formado.",
    objective: "Usar FromSqlInterpolated (que sí es 'composable') seguido de un .Where() adicional y AsNoTracking() para completar la consulta de forma segura y eficiente.",
    tags: ["Ciberseguridad", "SQL Injection", "Composability"],
    fileName: "ReportRepository.cs",
    completed: false,
    explanationText: "FromSqlInterpolated no solo es seguro, también es 'componible': EF Core puede seguir agregando cláusulas LINQ encima como si fuera una consulta normal. Es como pedir una pizza base y luego seguir agregando ingredientes en el mostrador antes de que entre al horno; en cambio, el SQL crudo no componible es como una pizza que ya salió del horno: no puedes seguir modificándola, solo comerla tal cual llegó.",
    codeSnippet: `public async Task<List<SalesReport>> GetReportsAsync(int minAmount)
{
    return await _context.SalesReports
        .[INPUT_1]($"SELECT * FROM SalesReports WHERE Amount > {minAmount}")
        .[INPUT_2]()
        .Where(r => r.Year == DateTime.Now.Year)
        .ToListAsync();
}`,
    inputs: { "INPUT_1": "FromSqlInterpolated", "INPUT_2": "AsNoTracking" },
    completeCode: `public async Task<List<SalesReport>> GetReportsAsync(int minAmount)
{
    return await _context.SalesReports
        .FromSqlInterpolated($"SELECT * FROM SalesReports WHERE Amount > {minAmount}")
        .AsNoTracking()
        .Where(r => r.Year == DateTime.Now.Year)
        .ToListAsync();
}`
  },
  {
    id: 7,
    title: "Transacción Atómica: Descuento de Saldo y Creación de Orden",
    stars: 5,
    category: "Transacciones",
    description: "Al procesar una compra, el sistema descuenta el saldo de la cuenta, crea la orden y registra un movimiento en el historial. Un fallo de red entre el segundo y tercer paso dejó cuentas con saldo descontado pero sin orden creada, generando reclamos de clientes.",
    objective: "Envolver las tres operaciones de escritura en una transacción explícita usando BeginTransactionAsync, con commit al finalizar y rollback en caso de excepción.",
    tags: ["Transacciones", "ACID", "BeginTransactionAsync"],
    fileName: "PaymentService.cs",
    completed: false,
    explanationText: "Una transacción agrupa varias operaciones para que se comporten como una sola unidad indivisible: o pasan todas, o no pasa ninguna. Es como transferir dinero entre dos cuentas en el mismo banco: el banco nunca le resta el dinero a una cuenta y lo deja 'flotando' sin abonarlo a la otra, aunque haya un corte de luz a la mitad. O se completa la operación entera, o se revierte todo como si nunca hubiera ocurrido.",
    codeSnippet: `public async Task ProcessPurchaseAsync(int accountId, decimal amount)
{
    using var transaction = await _context.Database.[INPUT_1]();

    try
    {
        var account = await _context.Accounts.FindAsync(accountId);
        account.Balance -= amount;

        var order = new Order { AccountId = accountId, Amount = amount };
        _context.Orders.Add(order);

        _context.History.Add(new HistoryEntry { AccountId = accountId, Action = "Purchase" });

        await _context.SaveChangesAsync();
        await transaction.[INPUT_2]();
    }
    catch
    {
        await transaction.[INPUT_3]();
        throw;
    }
}`,
    inputs: { "INPUT_1": "BeginTransactionAsync", "INPUT_2": "CommitAsync", "INPUT_3": "RollbackAsync" },
    completeCode: `public async Task ProcessPurchaseAsync(int accountId, decimal amount)
{
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        var account = await _context.Accounts.FindAsync(accountId);
        account.Balance -= amount;

        var order = new Order { AccountId = accountId, Amount = amount };
        _context.Orders.Add(order);

        _context.History.Add(new HistoryEntry { AccountId = accountId, Action = "Purchase" });

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}`
  },
  {
    id: 8,
    title: "Transacción Compartida entre Múltiples Repositorios",
    stars: 5,
    category: "Transacciones",
    description: "En una arquitectura con patrón Repository, 'InventoryRepository' y 'OrderRepository' usan el mismo DbContext pero llaman a SaveChangesAsync de forma independiente. Al fallar el segundo repositorio, el primero ya había confirmado su cambio, dejando el inventario descontado sin una orden asociada.",
    objective: "Usar una única transacción a nivel de Unit of Work que envuelva las llamadas a ambos repositorios, asegurando que ambos SaveChangesAsync formen parte de la misma unidad atómica.",
    tags: ["Transacciones", "Unit of Work", "Repository Pattern"],
    fileName: "UnitOfWork.cs",
    completed: false,
    explanationText: "Cuando varios repositorios comparten el mismo DbContext pero cada uno guarda por su cuenta, es como si dos cocineros del mismo restaurante cobraran la cuenta al cliente por separado sin comunicarse: uno podría cobrar y el otro fallar, dejando al cliente con un cargo incompleto. Una transacción a nivel de Unit of Work es como poner a un solo cajero a cargo de cobrar toda la mesa junta: o se cobra el pedido completo, o no se cobra nada.",
    codeSnippet: `public async Task PlaceOrderWithInventoryAsync(Order order, int productId, int qty)
{
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        await _inventoryRepository.DecrementStockAsync(productId, qty);
        await _orderRepository.AddAsync(order);

        await _context.[INPUT_1]();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.[INPUT_2]();
        throw;
    }
}`,
    inputs: { "INPUT_1": "SaveChangesAsync", "INPUT_2": "RollbackAsync" },
    completeCode: `public async Task PlaceOrderWithInventoryAsync(Order order, int productId, int qty)
{
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        await _inventoryRepository.DecrementStockAsync(productId, qty);
        await _orderRepository.AddAsync(order);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}`
  },
  {
    id: 9,
    title: "Transacción con Nivel de Aislamiento Serializable",
    stars: 5,
    category: "Transacciones",
    description: "En un sistema bancario de alta concurrencia, dos transferencias simultáneas sobre la misma cuenta bajo el nivel de aislamiento por defecto (ReadCommitted) provocaron una condición de carrera: ambas leyeron el mismo saldo antes de que la primera terminara de escribir, permitiendo un sobregiro no autorizado.",
    objective: "Especificar explícitamente el nivel de aislamiento Serializable al iniciar la transacción para prevenir lecturas concurrentes inconsistentes en operaciones financieras críticas.",
    tags: ["Transacciones", "Isolation Level", "Concurrencia"],
    fileName: "BankTransferService.cs",
    completed: false,
    explanationText: "El nivel de aislamiento Serializable obliga a que las transacciones se ejecuten como si ocurrieran una detrás de otra, nunca al mismo tiempo sobre los mismos datos. Es como un baño público con una sola llave: aunque haya diez personas en la fila, solo una puede entrar y cerrar la puerta a la vez; las demás deben esperar su turno completo antes de poder ver el estado real del baño (el saldo de la cuenta).",
    codeSnippet: `public async Task TransferAsync(int fromId, int toId, decimal amount)
{
    using var transaction = await _context.Database.BeginTransactionAsync(
        [INPUT_1].Serializable);

    try
    {
        var from = await _context.Accounts.FindAsync(fromId);
        var to = await _context.Accounts.FindAsync(toId);

        from.Balance -= amount;
        to.Balance += amount;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}`,
    inputs: { "INPUT_1": "IsolationLevel" },
    completeCode: `public async Task TransferAsync(int fromId, int toId, decimal amount)
{
    using var transaction = await _context.Database.BeginTransactionAsync(
        IsolationLevel.Serializable);

    try
    {
        var from = await _context.Accounts.FindAsync(fromId);
        var to = await _context.Accounts.FindAsync(toId);

        from.Balance -= amount;
        to.Balance += amount;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}`
  },
  {
    id: 10,
    title: "Resiliencia de Red con EnableRetryOnFailure",
    stars: 3,
    category: "Resiliencia",
    description: "La aplicación está desplegada en Azure SQL Database. Durante picos de tráfico, el servicio administrado realiza pequeños cortes de conexión ('transient faults') de milisegundos, causando que las peticiones fallen con SqlException aunque la base de datos esté sana segundos después.",
    objective: "Configurar el DbContext para reintentar automáticamente hasta 5 veces con un retraso máximo de 10 segundos ante fallos transitorios de conexión.",
    tags: ["Resiliencia", "Cloud", "Retry Policy"],
    fileName: "Startup.cs",
    completed: false,
    explanationText: "EnableRetryOnFailure hace que EF Core vuelva a intentar la operación automáticamente cuando detecta un error transitorio de red, en lugar de rendirse al primer fallo. Es como cuando llamas a un amigo y la llamada se corta por mala señal: en vez de darte por vencido, vuelves a marcar un par de veces antes de asumir que algo está realmente mal, porque sabes que probablemente fue solo una interferencia momentánea.",
    codeSnippet: `services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.[INPUT_1](
            maxRetryCount: [INPUT_2],
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null);
    }));`,
    inputs: { "INPUT_1": "EnableRetryOnFailure", "INPUT_2": "5" },
    completeCode: `services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null);
    }));`
  },
  {
    id: 11,
    title: "Execution Strategy con Transacciones Manuales",
    stars: 5,
    category: "Resiliencia",
    description: "Tras activar EnableRetryOnFailure, la aplicación empezó a lanzar InvalidOperationException: 'The configured execution strategy does not support user-initiated transactions'. El equipo usa una transacción manual con BeginTransactionAsync que ahora es incompatible con la estrategia de reintentos automáticos.",
    objective: "Envolver la transacción manual dentro de un bloque ExecuteAsync de la estrategia de ejecución del DbContext, para que los reintentos abarquen toda la operación de forma segura.",
    tags: ["Resiliencia", "Execution Strategy", "Retry Policy"],
    fileName: "PaymentService.cs",
    completed: false,
    explanationText: "Cuando activas reintentos automáticos, EF Core necesita reintentar TODA la operación desde el inicio si algo falla a mitad de camino, incluyendo la transacción. Por eso exige que uses ExecuteAsync como un 'contenedor' que sabe repetir el proceso completo. Es como grabar un video en una sola toma: si te equivocas a la mitad, no puedes simplemente 'pegar' la parte buena; el director (la estrategia de ejecución) te pide repetir la escena entera desde el 'action' para asegurar que quede coherente.",
    codeSnippet: `public async Task ProcessPaymentAsync(int accountId, decimal amount)
{
    var strategy = _context.Database.CreateExecutionStrategy();

    await strategy.[INPUT_1](async () =>
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var account = await _context.Accounts.FindAsync(accountId);
        account.Balance -= amount;

        await _context.SaveChangesAsync();
        await transaction.[INPUT_2]();
    });
}`,
    inputs: { "INPUT_1": "ExecuteAsync", "INPUT_2": "CommitAsync" },
    completeCode: `public async Task ProcessPaymentAsync(int accountId, decimal amount)
{
    var strategy = _context.Database.CreateExecutionStrategy();

    await strategy.ExecuteAsync(async () =>
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        var account = await _context.Accounts.FindAsync(accountId);
        account.Balance -= amount;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    });
}`
  },
  {
    id: 12,
    title: "Reintentos Personalizados por Código de Error SQL",
    stars: 4,
    category: "Resiliencia",
    description: "El equipo de DBA reportó que el sistema está reintentando innecesariamente ante errores de sintaxis SQL (que nunca se resolverán solos), desperdiciando tiempo de respuesta. Solo se debería reintentar ante errores específicos de infraestructura, como el código 4060 (base de datos no disponible) o 40197 (error del servicio de Azure).",
    objective: "Configurar EnableRetryOnFailure agregando explícitamente los códigos de error transitorios 4060 y 40197 mediante errorNumbersToAdd, evitando reintentos sobre errores permanentes.",
    tags: ["Resiliencia", "Cloud", "Retry Policy"],
    fileName: "DbContextConfig.cs",
    completed: false,
    explanationText: "No todos los errores merecen un reintento: reintentar un error de sintaxis SQL es tan inútil como volver a tocar un timbre que sabes que está roto, nunca va a sonar sin importar cuántas veces lo intentes. En cambio, errorNumbersToAdd le dice a EF Core exactamente qué 'timbres' sí vale la pena volver a tocar porque son fallas temporales del edificio (la nube), no defectos permanentes del timbre mismo.",
    codeSnippet: `services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            [INPUT_1]: new int[] { [INPUT_2], 40197 });
    }));`,
    inputs: { "INPUT_1": "errorNumbersToAdd", "INPUT_2": "4060" },
    completeCode: `services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: new int[] { 4060, 40197 });
    }));`
  }
]; 
