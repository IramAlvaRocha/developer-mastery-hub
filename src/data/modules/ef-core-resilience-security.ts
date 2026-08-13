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
    theory: `## Concurrencia optimista con RowVersion
Dos personas editan el mismo registro; la última que guarda puede pisar el cambio de la otra sin darse cuenta.

### Cómo lo evita RowVersion
- SQL Server incrementa un token binario en cada UPDATE.
- EF Core incluye el token en el WHERE al guardar: si no coincide, la fila cambió y lanza DbUpdateConcurrencyException.

### Por qué optimista
No bloqueas la fila mientras alguien edita (eso sería pesimista); asumes que el conflicto es raro y lo detectas al guardar. Es el estándar para apps web donde nadie 'retiene' un registro.`,
    explanationText: "🌍 Ejemplo cotidiano: el ticket de la panadería: si otro reclama tu pedido con un ticket viejo, el número no coincide y se rechaza.\n\nIsRowVersion() configura una columna byte[] que SQL Server incrementa en cada UPDATE. EF Core la compara al guardar: si cambió desde que leíste, lanza DbUpdateConcurrencyException y evita el 'lost update' (sobrescribir el cambio de otro).",
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
    explanationText: "🌍 Ejemplo cotidiano: pagar un cheque y que el cajero avise que el saldo cambió desde que lo revisaste: no procesa a ciegas.\n\nCuando el RowVersion no coincide, SaveChangesAsync lanza DbUpdateConcurrencyException. Capturarla y convertirla en una excepción de dominio con mensaje claro evita el 500 genérico y le dice al usuario 'recarga, alguien más lo editó'.",
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
    explanationText: "🌍 Ejemplo cotidiano: firmar un contrato con fecha y hora: cualquiera verifica si coincide con la última versión, sin importar el reloj usado.\n\nIsConcurrencyToken() marca una columna (LastModified) como token de concurrencia portable: EF Core la compara en el WHERE al guardar, sin depender del tipo rowversion de SQL Server. Es la alternativa multi-proveedor que funciona en PostgreSQL, MySQL, etc.",
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
    theory: `## SQL injection en EF Core
Concatenar input en una query SQL convierte al atacante en autor de la sentencia.

### Lo vulnerable
\`FromSqlRaw($"...WHERE Category = '{category}'")\` → si category es \`'; DROP TABLE Products; --\`, ejecuta el drop.

### Lo seguro
\`FromSqlInterpolated($"...WHERE Category = {category}")\` → convierte category en un parámetro @p0, tratado como valor, nunca como código.

### Regla
Nunca concatenes input en SQL. Prefiere LINQ; si necesitas raw, usa la versión interpolada.`,
    explanationText: "🌍 Ejemplo cotidiano: depositas '100 dólares' y el cajero usa el sistema oficial; nunca un papel escrito a mano que cualquiera pudo alterar.\n\nFromSqlInterpolated convierte cada valor interpolado en un parámetro seguro (@p0) en vez de concatenarlo al SQL. Concatenar strings de usuario en FromSqlRaw es la puerta al SQL injection; parametrizar es la puerta blindada.",
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
    explanationText: "🌍 Ejemplo cotidiano: cartas certificadas en sobres individuales, no todos los mensajes en una hoja que cualquiera altera en el camino.\n\nCada valor interpolado en FromSqlInterpolated se entrega como un paquete sellado (parámetro), nunca mezclado con las instrucciones. Cuantos más valores concatenes, más puertas sin cerradura abres; la interpolación las cierra todas a la vez.",
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
    explanationText: "🌍 Ejemplo cotidiano: a la pizza base le agregas ingredientes antes del horno; a la ya horneada solo la comes tal cual.\n\nFromSqlInterpolated es componible: puedes encadenar Where, AsNoTracking y demás encima, como una consulta LINQ normal. El SQL crudo no componible con ORDER BY mal formado lanza excepción al intentar componer; la interpolación lo permite.",
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
    theory: `## Transacciones atómicas
Varias escrituras que deben ir juntas se envuelven en una transacción: o todas se confirman, o todas se revierten.

### El patrón
\`BeginTransactionAsync()\` → operaciones → \`CommitAsync()\` en éxito, \`RollbackAsync()\` en catch.

### Por qué importa
Un fallo de red a mitad de un proceso de compra (descuento → orden → historial) dejaba cuentas con saldo descontado pero sin orden. La transacción garantiza que nunca quede a medias.

### Regla
Cualquier secuencia de escrituras relacionadas va dentro de una transacción. El coste es mínimo; el bug que evitas, no.`,
    explanationText: "🌍 Ejemplo cotidiano: transferir dinero entre dos cuentas: o se completa entera, o no pasa nada, aunque haya un corte de luz.\n\nBeginTransactionAsync envuelve las escrituras en una unidad ACID: CommitAsync al final, RollbackAsync si algo falla. Sin ella, un fallo entre el descuento y la creación de la orden deja el saldo descontado sin orden, un bug de producción real.",
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
    explanationText: "🌍 Ejemplo cotidiano: dos cocineros cobrando la mesa por separado; un solo cajero cobra el pedido completo o no cobra nada.\n\nSi cada repositorio llama a SaveChangesAsync por su cuenta, el primero ya confirmó su cambio cuando el segundo falla. Envolver ambos en una transacción a nivel de Unit of Work hace que los dos SaveChanges formen una sola unidad atómica.",
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
    theory: `## Niveles de aislamiento
El nivel por defecto (ReadCommitted) permite que dos transacciones lean el mismo dato antes de que la otra escriba: condición de carrera.

### Qué aporta Serializable
- Ejecuta las transacciones como si fueran secuenciales sobre los mismos datos.
- Impide lecturas inconsistentes: cada una ve el estado estable.

### El coste
Más bloqueos y menos concurrencia. Úsalo solo en operaciones críticas (transferencias, saldos), no en todo.

### Regla
Paga el aislamiento donde el error cuesta dinero; en el resto, concurrencia optimista + RowVersion.`,
    explanationText: "🌍 Ejemplo cotidiano: un baño con una sola llave: uno entra, cierra y los demás esperan su turno completo.\n\nSerializable ejecuta las transacciones como si fueran una tras otra, impidiendo que dos lean el mismo saldo antes de que la otra escriba. En operaciones financieras críticas evita el sobregiro por condición de carrera, a costa de más bloqueos y menos concurrencia.",
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
    theory: `## Resiliencia con retry
Los servicios administrados (Azure SQL) sufren fallos transitorios de milisegundos que parecen errores reales.

### Qué hace EnableRetryOnFailure
- Reintenta automáticamente ante errores de red conocidos.
- Configuras cuántos reintentos (maxRetryCount) y el retraso máximo (maxRetryDelay).

### Por qué importa
Sin retry, cada microcorte devuelve un 500 al usuario. Con retry, la operación se repite de forma transparente.

### Ojo
No reintentes errores permanentes (sintaxis SQL): solo los transitorios. Por eso se puede limitar por código de error.`,
    explanationText: "🌍 Ejemplo cotidiano: la llamada se corta por mala señal y vuelves a marcar antes de rendirte.\n\nEnableRetryOnFailure reintenta automáticamente ante fallos transitorios de red (comunes en Azure SQL), con maxRetryCount y maxRetryDelay. Sin él, un microcorte de milisegundos tumba la petición aunque la BD esté sana un segundo después.",
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
    explanationText: "🌍 Ejemplo cotidiano: grabar en una sola toma: si te equivocas a la mitad, repites la escena entera desde el 'action'.\n\nCon retry activado, una transacción manual lanza InvalidOperationException porque EF Core no puede reintentar solo la mitad. Envolverla en strategy.ExecuteAsync() hace que la estrategia repita TODA la operación, transacción incluida, de forma coherente.",
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
    explanationText: "🌍 Ejemplo cotidiano: no tocas un timbre roto cien veces: nunca sonará. Solo reintentas la falla temporal del edificio.\n\nerrorNumbersToAdd limita el retry a códigos transitorios (4060 BD no disponible, 40197 error de Azure), excluyendo los permanentes como sintaxis SQL. Así no malgastas reintentos en errores que nunca se resuelven solos.",
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
