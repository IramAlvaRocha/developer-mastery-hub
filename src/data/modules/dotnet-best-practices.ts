import type { Exercise } from "@/lib/types";

// .NET Backend Best Practices — orden de construccion (Clean Architecture + DDD + CQRS)
// Basado en el proyecto real ProductosCrud y el AGENTS.md.
export const DOTNET_BEST_PRACTICES: Exercise[] = [
  {
    id: 1, step: 1, stars: 2, category: "ARQUITECTURA",
    title: "Screaming Architecture: las 4 capas",
    description: "Los proyectos .NET se organizan por capas con dependencias hacia adentro: Domain no depende de nadie; Infrastructure y Api dependen de Application/Domain.",
    objective: "Identificar el rol de cada proyecto",
    tags: ["Clean Architecture", "capas", "DDD"],
    fileName: "ProductosCrud.sln",
    explanationText: "La regla de oro: las dependencias apuntan hacia el dominio. El Domain es el corazon puro (sin EF, sin HTTP). La Infrastructure implementa los detalles tecnicos.",
    theory: "Capas (de adentro hacia afuera):\n\n1. Domain: Entidades, Value Objects, Result, Errores, interfaces de repositorio. CERO dependencias externas.\n2. Application: Casos de uso (Commands/Queries + Handlers), Behaviors, DTOs, Validators. Depende solo de Domain.\n3. Infrastructure: EF Core, DbContext, Repositorios concretos. Depende de Application/Domain.\n4. Api: Controllers, Middleware, Program.cs. Orquesta todo.",
    codeSnippet: `src/
  ProductosCrud.[INPUT_1]/            // Controllers, Middleware, Program.cs
  ProductosCrud.[INPUT_2]/    // Commands, Queries, Handlers, Behaviors
  ProductosCrud.[INPUT_3]/         // Entidades, Result, Errores (sin dependencias)
  ProductosCrud.[INPUT_4]/ // EF Core, DbContext, Repositorios`,
    inputs: { INPUT_1: "Api", INPUT_2: "Application", INPUT_3: "Domain", INPUT_4: "Infrastructure" },
    completeCode: "Api -> Application -> Domain <- Infrastructure (Domain no depende de nadie)",
  },
  {
    id: 2, step: 2, stars: 3, category: "ABSTRACCIONES",
    title: "Clase base Entity con Domain Events",
    description: "Toda entidad hereda de una clase base abstracta que gestiona el Id y la coleccion de eventos de dominio.",
    objective: "Construir la abstraccion Entity",
    tags: ["abstract", "Entity", "domain events"],
    fileName: "Domain/Abstractions/Entity.cs",
    explanationText: "El Id usa 'init' para ser inmutable tras la creacion. RaiseDomainEvent es 'protected' porque solo las entidades derivadas pueden levantar eventos, nunca el exterior.",
    codeSnippet: `public abstract class Entity
{
    private readonly List<IDomainEvent> _domainEvents = new();
    public Guid Id { get; [INPUT_1]; }

    protected Entity(Guid id) => Id = id;

    public IReadOnlyList<IDomainEvent> GetDomainEvents() => _domainEvents.ToList();
    public void ClearDomainEvents() => _domainEvents.Clear();
    [INPUT_2] void [INPUT_3](IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);
}`,
    inputs: { INPUT_1: "init", INPUT_2: "protected", INPUT_3: "RaiseDomainEvent" },
    completeCode: "public Guid Id { get; init; } | protected void RaiseDomainEvent(IDomainEvent e)",
  },
  {
    id: 3, step: 3, stars: 3, category: "MODIFICADORES",
    title: "Modificadores de acceso en una entidad",
    description: "La entidad Producto es 'sealed', su constructor sin parametros es 'private' (para EF), y sus propiedades usan 'private set' para proteger los invariantes.",
    objective: "Aplicar el modificador mas restrictivo",
    tags: ["sealed", "private set", "encapsulamiento"],
    fileName: "Domain/Productos/Producto.cs",
    explanationText: "Regla de oro: empieza con el modificador mas restrictivo y abre solo lo necesario. 'private set' permite leer la propiedad desde fuera pero solo la entidad puede mutarla (a traves de metodos de negocio como Crear/Actualizar).",
    theory: "| Modificador | Cuando |\n| private | campos internos (_domainEvents) |\n| private set | propiedad publica de lectura, mutacion solo interna |\n| protected | miembro para clases derivadas (constructor de Entity) |\n| internal | clase usada solo dentro del ensamblado (Configuration de EF) |\n| sealed | clase que no debe heredarse (entidades, DTOs, eventos) |",
    codeSnippet: `public [INPUT_1] class Producto : Entity, ISoftDeletable
{
    [INPUT_2] Producto() { } // constructor para EF Core

    public string Nombre { get; [INPUT_3] set; }
    public decimal Precio { get; private set; }
    public bool EstaActivo { get; private set; }

    public static Producto Crear(string nombre, decimal precio, int stock)
    {
        var producto = new Producto(Guid.NewGuid(), nombre, precio, stock);
        producto.RaiseDomainEvent(new ProductoCreadoDomainEvent(producto.Id));
        return producto;
    }
}`,
    inputs: { INPUT_1: "sealed", INPUT_2: "private", INPUT_3: "private" },
    completeCode: "public sealed class Producto : Entity | private Producto() {} | get; private set;",
  },
  {
    id: 4, step: 4, stars: 4, category: "VALUE OBJECTS",
    title: "Value Objects: record, factory y enum rica",
    description: "Los Value Objects son inmutables y se comparan por valor. Con validacion usan constructor privado + factory estatico.",
    objective: "Crear Value Objects inmutables",
    tags: ["record", "factory", "value object"],
    fileName: "Domain/Productos/ValueObjects.cs",
    explanationText: "El factory 'Create' centraliza la validacion: es imposible construir un RangoFechas invalido. La enum rica (EstadoEntidad) expone instancias estaticas y un metodo 'Desde' para parsear de forma segura.",
    codeSnippet: `// VO simple (comparacion por valor)
public record Nombre(string Valor);

// VO con validacion: constructor privado + factory
public sealed record RangoFechas
{
    private RangoFechas() { }
    public DateOnly FechaInicio { get; init; }
    public DateOnly FechaFin { get; init; }

    public static RangoFechas [INPUT_1](DateOnly inicio, DateOnly fin)
    {
        if (inicio > fin) throw new ApplicationException("Rango invalido.");
        return new RangoFechas { FechaInicio = inicio, FechaFin = fin };
    }
}

// VO tipo enumeracion rica
public record EstadoEntidad
{
    public static readonly EstadoEntidad Activo = new("activo");
    private EstadoEntidad(string valor) => Valor = valor;
    public string Valor { get; [INPUT_2]; }
}`,
    inputs: { INPUT_1: "Create", INPUT_2: "init" },
    completeCode: "factory: public static RangoFechas Create(...) | public string Valor { get; init; }",
  },
  {
    id: 5, step: 5, stars: 4, category: "RESULT PATTERN",
    title: "Result Pattern: errores sin excepciones",
    description: "El patron Result modela exito/fallo de forma explicita, evitando excepciones para errores esperados (de negocio).",
    objective: "Implementar Result y Result<T>",
    tags: ["Result", "Error", "railway"],
    fileName: "Domain/Abstractions/Result.cs",
    explanationText: "Result hace explicito el flujo de error en la firma del metodo. Acceder a .Value en un resultado fallido lanza una excepcion: te obliga a comprobar IsSuccess primero.",
    theory: "El Result Pattern (o Railway Oriented Programming) trata los errores esperados como datos, no como excepciones. Ventajas: 1) la firma del metodo declara que puede fallar; 2) no hay costo de stack trace; 3) el flujo es predecible. Las excepciones se reservan para fallos verdaderamente inesperados.",
    codeSnippet: `public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => [INPUT_1] IsSuccess;
    public Error Error { get; }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
    public static Result<T> Success<T>(T value) => new(value, true, Error.None);
    public static Result<T> Failure<T>(Error error) => new(default, false, error);
}

public class Result<T> : Result
{
    private readonly T? _value;
    public T Value => IsSuccess ? _value! : throw new [INPUT_2]("No hay valor en un resultado fallido.");
}`,
    inputs: { INPUT_1: "!", INPUT_2: "InvalidOperationException" },
    completeCode: "IsFailure => !IsSuccess | throw new InvalidOperationException(...)",
  },
  {
    id: 6, step: 6, stars: 3, category: "RESULT PATTERN",
    title: "Error y errores por dominio",
    description: "Error es un record (comparacion por codigo). Cada feature define sus errores especificos en una clase estatica.",
    objective: "Definir errores tipados del dominio",
    tags: ["Error", "record", "dominio"],
    fileName: "Domain/Productos/ProductoErrores.cs",
    explanationText: "Centralizar los errores en clases estaticas evita strings magicos repartidos por el codigo. El codigo (ej. 'Producto.NotFound') sirve luego para mapear al status HTTP correcto.",
    codeSnippet: `public record Error(string Codigo, string Descripcion)
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error [INPUT_1] = new("Error.NotFound", "El recurso no fue encontrado.");
}

public static class ProductoErrores
{
    public static readonly Error NoEncontrado =
        new("Producto.[INPUT_2]", "El producto no existe.");
    public static readonly Error YaInactivo =
        new("Producto.YaInactivo", "El producto ya esta inactivo.");
}`,
    inputs: { INPUT_1: "NotFound", INPUT_2: "NotFound" },
    completeCode: "Error.NotFound = new(\"Error.NotFound\", ...) | ProductoErrores.NoEncontrado",
  },
  {
    id: 7, step: 7, stars: 4, category: "CONTRATO HTTP",
    title: "ApiResponse y mapeo Result -> IActionResult",
    description: "El Result es interno al dominio. Hacia el cliente se devuelve siempre un envelope ApiResponse { success, data, message, errors }.",
    objective: "Estandarizar la respuesta HTTP",
    tags: ["ApiResponse", "envelope", "IActionResult"],
    fileName: "Application/Abstractions/ApiResponse.cs",
    explanationText: "Este contrato fijo es el puente con el frontend: el front tipa exactamente la misma forma. El switch sobre el codigo de error mapea al status HTTP adecuado (404, 409, 500...).",
    codeSnippet: `public record ApiResponse<T>(bool Success, T? Data, string? Message, IEnumerable<string>? Errors)
{
    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new([INPUT_1], data, message, null);

    public static ApiResponse<T> Fail(Error error) =>
        new(false, default, error.Descripcion, [error.Codigo]);
}

// ResultExtensions.cs
public static IActionResult ToActionResult<T>(this Result<T> result)
{
    if (result.IsSuccess)
        return new OkObjectResult(ApiResponse<T>.[INPUT_2](result.Value));

    return result.Error.Codigo switch
    {
        "Error.NotFound" => new NotFoundObjectResult(ApiResponse<T>.Fail(result.Error)),
        _ => new ObjectResult(ApiResponse<T>.Fail(result.Error)) { StatusCode = [INPUT_3] }
    };
}`,
    inputs: { INPUT_1: "true", INPUT_2: "Ok", INPUT_3: "500" },
    completeCode: "Ok => new(true, ...) | OkObjectResult(ApiResponse<T>.Ok(value)) | default StatusCode 500",
  },
  {
    id: 8, step: 8, stars: 3, category: "DOMAIN EVENTS",
    title: "Domain Events con MediatR",
    description: "Los eventos de dominio son 'sealed record' que implementan IDomainEvent (que extiende INotification de MediatR).",
    objective: "Declarar y levantar eventos de dominio",
    tags: ["domain event", "sealed record", "MediatR"],
    fileName: "Domain/Productos/Events/ProductoCreadoDomainEvent.cs",
    explanationText: "Los eventos son 'sealed' porque nunca se extienden. Se levantan dentro de la entidad con RaiseDomainEvent y se despachan automaticamente en SaveChangesAsync usando IPublisher.",
    codeSnippet: `public interface IDomainEvent : [INPUT_1] { }

public [INPUT_2] record ProductoCreadoDomainEvent(Guid ProductoId) : IDomainEvent;

// Dentro de la entidad Producto:
public static Producto Crear(string nombre, decimal precio, int stock)
{
    var producto = new Producto(Guid.NewGuid(), nombre, precio, stock);
    producto.[INPUT_3](new ProductoCreadoDomainEvent(producto.Id));
    return producto;
}`,
    inputs: { INPUT_1: "INotification", INPUT_2: "sealed", INPUT_3: "RaiseDomainEvent" },
    completeCode: "IDomainEvent : INotification | public sealed record ...Event | RaiseDomainEvent(...)",
  },
  {
    id: 9, step: 9, stars: 3, category: "PERSISTENCIA",
    title: "Unit of Work + Repository",
    description: "El repositorio abstrae el acceso a datos; IUnitOfWork confirma los cambios en bloque. El DbContext implementa IUnitOfWork.",
    objective: "Definir las abstracciones de persistencia",
    tags: ["repository", "unit of work", "EF Core"],
    fileName: "Domain/Productos/IProductoRepository.cs",
    explanationText: "El repositorio vive en Domain (interface) y se implementa en Infrastructure. Add/Remove solo marcan el cambio en memoria; SaveChangesAsync del UnitOfWork lo persiste de forma transaccional.",
    codeSnippet: `public interface IUnitOfWork
{
    Task<int> [INPUT_1](CancellationToken cancellationToken = default);
}

public interface IProductoRepository
{
    Task<Producto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Producto>> GetAllAsync(CancellationToken ct = default);
    void [INPUT_2](Producto producto);
    void Remove(Producto producto);
}`,
    inputs: { INPUT_1: "SaveChangesAsync", INPUT_2: "Add" },
    completeCode: "Task<int> SaveChangesAsync(CancellationToken) | void Add(Producto)",
  },
  {
    id: 10, step: 10, stars: 4, category: "CQRS",
    title: "Command + Handler (escritura)",
    description: "Un Command representa una intencion de cambio. Su Handler ejecuta el caso de uso: crea la entidad, la agrega al repositorio y persiste.",
    objective: "Implementar el flujo de escritura CQRS",
    tags: ["CQRS", "command", "MediatR", "handler"],
    fileName: "Application/Productos/Crear/CrearProductoCommandHandler.cs",
    explanationText: "El Command es un record que implementa ICommand<Result<Guid>> e IBaseCommand (marcador para los behaviors). El handler es 'internal sealed' porque solo MediatR lo instancia.",
    codeSnippet: `public record CrearProductoCommand(string Nombre, string Descripcion, decimal Precio, int Stock)
    : ICommand<Result<Guid>>, IBaseCommand;

internal sealed class CrearProductoCommandHandler
    : IRequestHandler<CrearProductoCommand, Result<[INPUT_1]>>
{
    private readonly IProductoRepository _repo;
    private readonly IUnitOfWork _uow;

    public async Task<Result<Guid>> Handle(CrearProductoCommand request, CancellationToken ct)
    {
        var producto = Producto.[INPUT_2](request.Nombre, request.Descripcion, request.Precio, request.Stock);
        _repo.Add(producto);
        await _uow.[INPUT_3](ct);
        return Result.Success(producto.Id);
    }
}`,
    inputs: { INPUT_1: "Guid", INPUT_2: "Crear", INPUT_3: "SaveChangesAsync" },
    completeCode: "Result<Guid> | Producto.Crear(...) | await _uow.SaveChangesAsync(ct)",
  },
  {
    id: 11, step: 11, stars: 3, category: "CQRS",
    title: "Query + Handler (lectura)",
    description: "Una Query representa una lectura. Devuelve un DTO (no la entidad) envuelto en Result, y reporta NotFound de forma explicita.",
    objective: "Implementar el flujo de lectura CQRS",
    tags: ["CQRS", "query", "DTO"],
    fileName: "Application/Productos/ObtenerPorId/ObtenerProductoPorIdQueryHandler.cs",
    explanationText: "Las queries devuelven DTOs para no exponer la entidad de dominio al exterior. Si no se encuentra, se retorna Result.Failure con el error del dominio (NoEncontrado), no una excepcion.",
    codeSnippet: `public record ObtenerProductoPorIdQuery(Guid Id) : [INPUT_1]<Result<ProductoDto>>;

internal sealed class ObtenerProductoPorIdQueryHandler
    : IRequestHandler<ObtenerProductoPorIdQuery, Result<ProductoDto>>
{
    private readonly IProductoRepository _repo;

    public async Task<Result<ProductoDto>> Handle(ObtenerProductoPorIdQuery request, CancellationToken ct)
    {
        var producto = await _repo.GetByIdAsync(request.Id, ct);
        if (producto is null)
            return Result.[INPUT_2]<ProductoDto>(ProductoErrores.NoEncontrado);

        return Result.Success(new ProductoDto(producto.Id, producto.Nombre, producto.Precio));
    }
}`,
    inputs: { INPUT_1: "IQuery", INPUT_2: "Failure" },
    completeCode: "IQuery<Result<ProductoDto>> | Result.Failure<ProductoDto>(ProductoErrores.NoEncontrado)",
  },
  {
    id: 12, step: 12, stars: 4, category: "CQRS",
    title: "Interfaces de mensajeria (marker interface)",
    description: "ICommand/IQuery tipan los requests de MediatR. IBaseCommand es un marcador que restringe los Behaviors para que solo apliquen a comandos.",
    objective: "Restringir behaviors solo a commands",
    tags: ["IRequest", "marker interface", "IBaseCommand"],
    fileName: "Domain/Abstractions/Messaging/ICommand.cs",
    explanationText: "Sin IBaseCommand, los behaviors (logging, validacion) correrian tambien en cada query, lo cual es indeseable. El marcador permite que el constraint 'where TRequest : IBaseCommand' los limite a comandos.",
    codeSnippet: `public interface ICommand : IRequest<Result> { }
public interface ICommand<out TResponse> : IRequest<TResponse>
    where TResponse : [INPUT_1] { }
public interface IQuery<out TResponse> : IRequest<TResponse> { }

// Marcador para que los Behaviors apliquen SOLO a comandos
public interface [INPUT_2] { }`,
    inputs: { INPUT_1: "Result", INPUT_2: "IBaseCommand" },
    completeCode: "where TResponse : Result | public interface IBaseCommand { }",
  },
  {
    id: 13, step: 13, stars: 5, category: "PIPELINE",
    title: "ValidationBehavior (pipeline de MediatR)",
    description: "Un Behavior intercepta cada request en el pipeline. ValidationBehavior corre los validators de FluentValidation antes de llegar al handler.",
    objective: "Validar comandos automaticamente",
    tags: ["IPipelineBehavior", "FluentValidation", "pipeline"],
    fileName: "Application/Abstractions/Behaviors/ValidationBehavior.cs",
    explanationText: "El constraint 'where TRequest : IBaseCommand' limita el behavior a comandos. Si hay errores, lanza ValidationException (capturada por el middleware). Si no, llama a next() para continuar el pipeline.",
    codeSnippet: `public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : [INPUT_1]
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public async Task<TResponse> Handle(
        TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var errores = _validators
            .Select(v => v.Validate(new ValidationContext<TRequest>(request)))
            .SelectMany(r => r.Errors)
            .ToList();

        if (errores.Count != 0)
            throw new [INPUT_2](errores);

        return await [INPUT_3]();
    }
}`,
    inputs: { INPUT_1: "IBaseCommand", INPUT_2: "ValidationException", INPUT_3: "next" },
    completeCode: "where TRequest : IBaseCommand | throw new ValidationException(errores) | await next()",
  },
  {
    id: 14, step: 14, stars: 3, category: "VALIDACIONES",
    title: "FluentValidation: validar el comando",
    description: "Cada comando tiene un validator que hereda de AbstractValidator. El pipeline lo ejecuta automaticamente.",
    objective: "Escribir reglas con FluentValidation",
    tags: ["FluentValidation", "AbstractValidator", "RuleFor"],
    fileName: "Application/Productos/Crear/CrearProductoCommandValidator.cs",
    explanationText: "No hay que llamar al validator manualmente: el ValidationBehavior lo descubre por DI (AddValidatorsFromAssembly) y lo ejecuta antes del handler. La validacion del back es la fuente de verdad.",
    codeSnippet: `public class CrearProductoCommandValidator : [INPUT_1]<CrearProductoCommand>
{
    public CrearProductoCommandValidator()
    {
        RuleFor(x => x.Nombre)
            .[INPUT_2]().WithMessage("El nombre es requerido.")
            .MaximumLength(200);

        RuleFor(x => x.Precio).GreaterThan([INPUT_3]);
    }
}`,
    inputs: { INPUT_1: "AbstractValidator", INPUT_2: "NotEmpty", INPUT_3: "0" },
    completeCode: "AbstractValidator<CrearProductoCommand> | RuleFor(...).NotEmpty() | GreaterThan(0)",
  },
  {
    id: 15, step: 15, stars: 3, category: "VALIDACIONES",
    title: "Atributo de validacion personalizado",
    description: "Para validaciones simples en DTOs se puede crear un atributo que herede de ValidationAttribute.",
    objective: "Crear un ValidationAttribute custom",
    tags: ["DataAnnotations", "ValidationAttribute", "custom"],
    fileName: "Application/Abstractions/PrimeraLetraMayusculaAttribute.cs",
    explanationText: "Util cuando no se usa FluentValidation. Se sobreescribe IsValid y se devuelve ValidationResult.Success (o un mensaje de error). Se aplica como atributo: [PrimeraLetraMayuscula].",
    codeSnippet: `public class PrimeraLetraMayusculaAttribute : [INPUT_1]
{
    protected override ValidationResult? IsValid(object? value, ValidationContext ctx)
    {
        if (value is string str && !string.IsNullOrEmpty(str) && char.[INPUT_2](str[0]))
            return new ValidationResult("La primera letra debe ser mayuscula.");

        return ValidationResult.[INPUT_3];
    }
}`,
    inputs: { INPUT_1: "ValidationAttribute", INPUT_2: "IsLower", INPUT_3: "Success" },
    completeCode: ": ValidationAttribute | char.IsLower(str[0]) | return ValidationResult.Success",
  },
  {
    id: 16, step: 16, stars: 4, category: "MIDDLEWARE",
    title: "Exception Handling Middleware",
    description: "Un middleware global captura toda excepcion no manejada y la convierte a ProblemDetails (RFC 7807) con el status adecuado.",
    objective: "Centralizar el manejo de errores",
    tags: ["middleware", "ProblemDetails", "RFC 7807"],
    fileName: "Api/Middleware/ExceptionHandlingMiddleware.cs",
    explanationText: "Envuelve la pipeline en try/catch. Las ValidationException dan 400 con la lista de errores; el resto da 500 generico. Asi ningun stack trace se filtra al cliente.",
    codeSnippet: `public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context);
    }
    catch (Exception exception)
    {
        _logger.LogError(exception, "Excepcion no manejada");
        var details = GetExceptionDetails(exception);

        var problem = new [INPUT_1] { Status = details.Status, Title = details.Title };
        context.Response.StatusCode = details.Status;
        await context.Response.[INPUT_2](problem);
    }
}

private static ExceptionDetails GetExceptionDetails(Exception ex) => ex switch
{
    [INPUT_3] ve => new(400, "ValidationFailure", "Error de validacion", ve.ValidationErrors),
    _ => new(500, "ServerError", "Error interno", null)
};`,
    inputs: { INPUT_1: "ProblemDetails", INPUT_2: "WriteAsJsonAsync", INPUT_3: "ValidationException" },
    completeCode: "new ProblemDetails {...} | WriteAsJsonAsync(problem) | ValidationException ve => ...",
  },
  {
    id: 17, step: 17, stars: 4, category: "EF CORE",
    title: "EF Core: configuracion de la entidad",
    description: "Cada entidad tiene una Configuration (IEntityTypeConfiguration) que define tabla, clave, conversiones de Value Objects y concurrencia.",
    objective: "Configurar el mapeo de EF Core",
    tags: ["EF Core", "IEntityTypeConfiguration", "RowVersion"],
    fileName: "Infrastructure/Persistence/Configurations/ProductoConfiguration.cs",
    explanationText: "La clase es 'internal sealed' porque solo Infrastructure la usa. IsRowVersion habilita concurrencia optimista: EF detecta si otro proceso modifico la fila antes de guardar.",
    codeSnippet: `internal sealed class ProductoConfiguration : [INPUT_1]<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> builder)
    {
        builder.ToTable("productos");
        builder.[INPUT_2](p => p.Id);

        builder.Property(p => p.Nombre).HasMaxLength(200);

        // Concurrencia optimista
        builder.Property<uint>("Version").[INPUT_3]();
    }
}`,
    inputs: { INPUT_1: "IEntityTypeConfiguration", INPUT_2: "HasKey", INPUT_3: "IsRowVersion" },
    completeCode: ": IEntityTypeConfiguration<Producto> | builder.HasKey(p => p.Id) | .IsRowVersion()",
  },
  {
    id: 18, step: 18, stars: 5, category: "EF CORE",
    title: "Global Query Filters (Soft Delete)",
    description: "EF Core aplica filtros automaticos a TODAS las queries de una entidad. Es el mecanismo para soft delete y multi-tenancy.",
    objective: "Filtrar registros inactivos automaticamente",
    tags: ["query filter", "soft delete", "multi-tenant"],
    fileName: "Infrastructure/Persistence/ApplicationDbContext.cs",
    explanationText: "Con HasQueryFilter, cada SELECT incluye 'WHERE EstaActivo' sin escribirlo. Para reportes administrativos se usa IgnoreQueryFilters() y se saltan. Es como ponerle lentes permanentes al ORM.",
    codeSnippet: `public interface ISoftDeletable
{
    bool [INPUT_1] { get; }
}

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Producto>()
        .[INPUT_2](p => p.EstaActivo);
}

// Para reportes administrativos, saltarse el filtro:
var todos = await _context.Productos.[INPUT_3]().ToListAsync(ct);`,
    inputs: { INPUT_1: "EstaActivo", INPUT_2: "HasQueryFilter", INPUT_3: "IgnoreQueryFilters" },
    completeCode: "bool EstaActivo { get; } | .HasQueryFilter(p => p.EstaActivo) | .IgnoreQueryFilters()",
  },
  {
    id: 19, step: 19, stars: 4, category: "DEPENDENCY INJECTION",
    title: "Registro de DI por capa",
    description: "Cada capa expone un metodo de extension (AddApplication, AddInfrastructure) para mantener Program.cs limpio y declarativo.",
    objective: "Registrar servicios por capa",
    tags: ["DI", "AddScoped", "IServiceCollection"],
    fileName: "Infrastructure/DependencyInjection.cs",
    explanationText: "El DbContext se registra y ademas se expone como IUnitOfWork (misma instancia scoped). Los repositorios concretos se inyectan contra su interface. Program.cs solo encadena los Add*.",
    codeSnippet: `public static IServiceCollection AddInfrastructure(
    this IServiceCollection services, IConfiguration config)
{
    services.AddDbContext<ApplicationDbContext>(o =>
        o.UseNpgsql(config.GetConnectionString("Default")));

    services.[INPUT_1]<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
    services.AddScoped<IProductoRepository, [INPUT_2]>();
    return services;
}

// Program.cs
builder.Services
    .AddApplication()
    .[INPUT_3](builder.Configuration);`,
    inputs: { INPUT_1: "AddScoped", INPUT_2: "ProductoRepository", INPUT_3: "AddInfrastructure" },
    completeCode: "AddScoped<IUnitOfWork>(...) | AddScoped<IProductoRepository, ProductoRepository>() | .AddInfrastructure(config)",
  },
  {
    id: 20, step: 20, stars: 4, category: "SEGURIDAD",
    title: "Autenticacion JWT estricta",
    description: "Configuracion de JWT Bearer con validacion completa de issuer, audience, vida util, firma y algoritmo permitido.",
    objective: "Configurar JWT de forma segura",
    tags: ["JWT", "TokenValidationParameters", "auth"],
    fileName: "Api/Extensions/JwtAuthenticationExtensions.cs",
    explanationText: "ValidateLifetime rechaza tokens expirados. Fijar ValidAlgorithms evita ataques de algoritmo (ej. 'none'). ClockSkew minimo reduce la ventana de tolerancia de expiracion.",
    codeSnippet: `services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            [INPUT_1] = true, // valida exp
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidAlgorithms = [SecurityAlgorithms.[INPUT_2]],
            ClockSkew = TimeSpan.[INPUT_3](1)
        };
    });`,
    inputs: { INPUT_1: "ValidateLifetime", INPUT_2: "HmacSha256", INPUT_3: "FromMinutes" },
    completeCode: "ValidateLifetime = true | ValidAlgorithms = [SecurityAlgorithms.HmacSha256] | ClockSkew = TimeSpan.FromMinutes(1)",
  },
  {
    id: 21, step: 21, stars: 4, category: "SEGURIDAD",
    title: "Permisos granulares por Claims",
    description: "Los permisos se definen como constantes estaticas y se registra una policy por cada uno, exigiendo el claim correspondiente.",
    objective: "Autorizar por permiso (claim)",
    tags: ["Authorization", "policy", "claims", "RBAC"],
    fileName: "Domain/Auth/Permisos.cs",
    explanationText: "Una policy por permiso permite proteger endpoints con [Authorize(Policy = ...)]. Los valores deben ser identicos a los del frontend para evitar discrepancias silenciosas.",
    codeSnippet: `public static class Permisos
{
    public static class Productos
    {
        public const string Vista = "Productos.Vista";
        public const string Edicion = "Productos.Edicion";
    }
}

services.AddAuthorization(options =>
{
    foreach (var permiso in Permisos.Todos)
    {
        options.[INPUT_1](permiso, policy =>
            policy.RequireAuthenticatedUser()
                  .[INPUT_2]("permiso", permiso));
    }
});

// En el controller:
[[INPUT_3](Policy = Permisos.Productos.Vista)]
[HttpGet]
public async Task<IActionResult> Obtener() { /* ... */ }`,
    inputs: { INPUT_1: "AddPolicy", INPUT_2: "RequireClaim", INPUT_3: "Authorize" },
    completeCode: "options.AddPolicy(permiso, ...) | .RequireClaim(\"permiso\", permiso) | [Authorize(Policy = ...)]",
  },
  {
    id: 22, step: 22, stars: 4, category: "SEGURIDAD",
    title: "Rate Limiting por IP",
    description: "El rate limiter de .NET 8 limita peticiones por ventana de tiempo. Se definen policies (general y mas estricta para auth).",
    objective: "Limitar peticiones por IP",
    tags: ["rate limiting", "FixedWindow", "429"],
    fileName: "Program.cs",
    explanationText: "GetFixedWindowLimiter particiona por IP. La policy de auth es mas estricta (10/min) para frenar fuerza bruta. UseRateLimiter activa el middleware en la pipeline.",
    codeSnippet: `builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("AuthPolicy", context =>
        RateLimitPartition.[INPUT_1](
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1)
            }));
});

app.[INPUT_2]();`,
    inputs: { INPUT_1: "GetFixedWindowLimiter", INPUT_2: "UseRateLimiter" },
    completeCode: "RateLimitPartition.GetFixedWindowLimiter(...) | app.UseRateLimiter()",
  },
];
