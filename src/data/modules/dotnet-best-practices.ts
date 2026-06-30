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
    explanationText: "La regla de oro de Clean Architecture: las dependencias SIEMPRE apuntan hacia adentro (hacia el Domain). El Domain es puro (sin EF ni HTTP); si manana cambias de base de datos o de framework web, el nucleo no se entera.",
    theory: "## Que es?\nClean Architecture (o Screaming Architecture) organiza el sistema en **capas concentricas**. Al abrir la solucion, la estructura revela el dominio del negocio, no el framework usado.\n\n## Las 4 capas (de adentro hacia afuera)\n| Capa | Responsabilidad | Depende de |\n| **Domain** | Entidades, Value Objects, Result, interfaces | Nadie |\n| **Application** | Casos de uso (Commands/Queries), Behaviors, DTOs | Domain |\n| **Infrastructure** | EF Core, DbContext, repositorios concretos | Application/Domain |\n| **Api** | Controllers, Middleware, Program.cs | Todas |\n\n## Por que se hace asi?\nLa **Regla de Dependencia**: el codigo de afuera puede conocer al de adentro, nunca al reves. Asi los detalles volatiles (base de datos, framework) dependen de las reglas de negocio estables, y no al contrario.\n\n## Beneficios\n- **Testeable**: pruebas el dominio sin levantar base de datos ni HTTP.\n- **Reemplazable**: cambiar SQL Server por Postgres no toca el Domain.\n- **Independiente del framework**: la logica no esta acoplada a ASP.NET.\n\n## Cuando usarlo?\nEn aplicaciones de negocio con reglas que evolucionan y vida larga. Para un CRUD trivial o un script desechable es sobre-ingenieria.\n\n## En la vida real\nEn un e-commerce, si marketing pide migrar de SQL Server a PostgreSQL por costos, solo reescribes Infrastructure: los Commands, validaciones y reglas de negocio quedan intactos. Sin capas, esa migracion tocaria medio sistema.",
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
    explanationText: "El Id usa 'init': se asigna al crear y queda inmutable. RaiseDomainEvent es 'protected' para que SOLO la propia entidad (o sus derivadas) pueda emitir eventos, nunca un controller o servicio externo.",
    theory: "## Que es?\nUna **clase base abstracta** `Entity` de la que heredan todas las entidades. Centraliza dos cosas comunes: la identidad (`Id`) y la coleccion de **eventos de dominio**.\n\n## Por que se hace asi?\n- `abstract`: no tiene sentido instanciar una entidad generica; solo existen Producto, Pedido, etc.\n- `init` en el `Id`: garantiza inmutabilidad. La identidad de una entidad **no debe cambiar** durante su vida.\n- `_domainEvents` es `private` y se expone solo como `IReadOnlyList`: nadie de afuera manipula la lista directamente.\n\n## Beneficios\n- **DRY**: la logica de Id y eventos se escribe una sola vez.\n- **Encapsulamiento**: los eventos se emiten de forma controlada.\n- Habilita despachar eventos automaticamente al guardar cambios.\n\n## Cuando usarlo?\nSiempre que sigas DDD y tus entidades necesiten emitir eventos (ProductoCreado, PedidoPagado) para reaccionar sin acoplar modulos entre si.\n\n## En la vida real\nEn una app bancaria, abrir una cuenta debe auditar, notificar y actualizar reportes. Con Entity + domain events, AbrirCuenta() solo emite el evento CuentaAbierta y varios handlers reaccionan; sin esto, ese metodo terminaria con cientos de lineas mezclando todo.",
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
    explanationText: "Principio de minimo privilegio: empieza por el modificador mas restrictivo y abre solo lo necesario. 'private set' deja leer la propiedad desde fuera, pero solo la entidad puede mutarla (via metodos de negocio como Crear o Actualizar), protegiendo sus invariantes.",
    theory: "## Que es?\nLos **modificadores de acceso** controlan quien puede ver o modificar cada miembro. En una entidad de dominio se usan para **blindar los invariantes** (las reglas que siempre deben cumplirse).\n\n## Tabla de decision\n| Modificador | Usalo para |\n| `private` | campos internos (`_domainEvents`) |\n| `private set` | propiedad publica de lectura, mutacion solo interna |\n| `protected` | miembros para clases derivadas (constructor de `Entity`) |\n| `internal` | clases usadas solo dentro del ensamblado (Configurations de EF) |\n| `sealed` | clases que no deben heredarse (entidades, DTOs, eventos) |\n\n## Por que se hace asi?\nSi `Precio` tuviera `set` publico, cualquiera podria asignar un precio negativo saltandose las validaciones. Con `private set`, el unico camino es un metodo de negocio que valida. El constructor vacio es `private` porque solo EF Core lo necesita para materializar filas.\n\n## Beneficios\n- **Invariantes garantizados**: el objeto nunca entra en un estado invalido.\n- **API clara**: desde fuera se ve que se puede leer y que no se puede tocar.\n- `sealed` ademas permite micro-optimizaciones del compilador.\n\n## Cuando usarlo?\nSiempre. Es gratis y es la primera linea de defensa del modelo de dominio.",
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
    explanationText: "Un Value Object no tiene identidad: dos Nombre('Cafe') son iguales. El factory 'Create' centraliza la validacion, de modo que es imposible construir un objeto invalido. La enum rica reemplaza enums planos con comportamiento y parseo seguro.",
    theory: "## Que es?\nUn **Value Object (VO)** modela un concepto por su **valor**, no por una identidad. Un `record` te da igualdad por valor e inmutabilidad gratis.\n\n## Por que se hace asi?\n- **Comparacion por valor**: dos rangos de fechas iguales son iguales; no importa cual instancia.\n- **Constructor privado + factory `Create`**: la validacion vive en un solo lugar y no hay forma de saltarla.\n- **Inmutable (`init`)**: un VO no cambia; si necesitas otro valor, creas uno nuevo.\n\n## Beneficios\n- **Validez garantizada**: si tienes un `RangoFechas`, esta bien formado, punto.\n- **Expresividad**: `Precio` o `Email` dicen mas que un `decimal` o `string` suelto.\n- **Menos bugs**: evita la primitive obsession (que todo sea string/int).\n\n## Cuando usarlo?\nPara conceptos como Dinero, Email, Rango o Coordenada, definidos por sus atributos. Si la cosa tiene ciclo de vida e identidad propia, es una **Entidad**, no un VO.",
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
    explanationText: "Result hace explicito en la firma que un metodo puede fallar. Acceder a .Value en un resultado fallido lanza excepcion: el tipo te OBLIGA a comprobar IsSuccess primero, como un compilador que no te deja olvidarte del error.",
    theory: "## Que es?\nEl **Result Pattern** (Railway Oriented Programming) representa exito o fallo como **un dato de retorno**, no como una excepcion. El metodo devuelve `Result<T>` en vez de lanzar.\n\n## Por que se hace asi?\nLas excepciones son caras (capturan stack trace) y son **invisibles en la firma**: nada te avisa que `Obtener()` puede fallar. Un `Result<Producto>` lo declara en el tipo.\n\n## Excepcion vs Result\n| | Excepcion | Result |\n| Costo | Alto (stack trace) | Cero |\n| Visible en la firma | No | Si |\n| Para que | Fallos inesperados (bug, red caida) | Errores esperados de negocio |\n\n## Beneficios\n- Flujo **predecible** y sin `try/catch` por todos lados.\n- Quien llama **no puede ignorar** el error.\n- Rendimiento: sin coste de excepciones en el camino feliz.\n\n## Cuando usarlo?\nPara errores de negocio esperables: no encontrado, saldo insuficiente, ya existe. Reserva las **excepciones** para lo verdaderamente inesperado.",
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
    explanationText: "Centralizar los errores en clases estaticas elimina los strings magicos repartidos por el codigo. El codigo del error (Producto.NoEncontrado) es ademas la clave para mapear luego al status HTTP correcto.",
    theory: "## Que es?\n`Error` es un `record` (igualdad por codigo) y cada feature agrupa sus errores en una **clase estatica** (`ProductoErrores`).\n\n## Por que se hace asi?\nUn error de negocio tiene dos partes: un **codigo estable** para la maquina (`Producto.NoEncontrado`) y una **descripcion** para el humano. El codigo no debe cambiar aunque cambie el texto.\n\n## Beneficios\n- **Sin strings magicos**: un solo lugar define cada error.\n- **Traducible**: el front mapea el codigo a su propio idioma.\n- **Mapeo HTTP**: el codigo guia el switch que decide 404 vs 409 vs 500.\n\n## Cuando usarlo?\nEn cualquier dominio con reglas de negocio. Cuanto mas crece la app, mas pagan los errores tipados frente a lanzar una excepcion generica con un texto suelto.",
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
    explanationText: "El Result es interno al dominio; hacia el cliente SIEMPRE sale un envelope ApiResponse { success, data, message, errors }. El front tipa exactamente esa forma, y el switch sobre el codigo de error la traduce a 404, 409 o 500.",
    theory: "## Que es?\nUn **envelope de respuesta** uniforme. Toda respuesta de la API, exitosa o fallida, tiene la misma estructura: `{ success, data, message, errors }`.\n\n## Por que se hace asi?\nSi cada endpoint responde distinto, el frontend necesita logica especial por cada uno. Un contrato fijo permite un **unico interceptor** que desempaqueta todo igual.\n\n## Por que separar Result de ApiResponse?\n`Result` es un detalle del dominio (.NET). `ApiResponse` es el **contrato publico** sobre HTTP. Mantenerlos separados evita filtrar tipos internos al cliente.\n\n## Beneficios\n- **Frontend predecible**: un solo `unwrap()` para todo.\n- **Errores consistentes**: misma forma de reportar fallos.\n- Desacopla el formato HTTP de la logica interna.\n\n## Cuando usarlo?\nEn APIs consumidas por un front propio (SPA o movil) donde controlas ambos lados y quieres un contrato espejo.",
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
    explanationText: "Los eventos son 'sealed record' (nunca se extienden, igualdad por valor). Se emiten DENTRO de la entidad con RaiseDomainEvent y se despachan en SaveChangesAsync via IPublisher de MediatR, asi el efecto secundario ocurre solo si la transaccion se confirma.",
    theory: "## Que es?\nUn **Domain Event** anuncia que algo relevante ocurrio en el dominio (`ProductoCreado`). Implementa `IDomainEvent : INotification` para que MediatR lo despache a sus handlers.\n\n## Por que se hace asi?\nEn vez de que `Crear()` llame directamente a enviar email + actualizar inventario + notificar, solo **emite un evento**. Otros handlers reaccionan. Asi la entidad no conoce a sus consumidores.\n\n## Por que despacharlos en SaveChangesAsync?\nPara que las reacciones ocurran **solo si los cambios se guardaron**. Si la transaccion falla, no se manda el email de producto creado.\n\n## Beneficios\n- **Bajo acoplamiento**: agregar un consumidor no toca la entidad.\n- **Consistencia**: efectos atados al commit de la transaccion.\n- Codigo de negocio limpio y enfocado.\n\n## Cuando usarlo?\nCuando un cambio en una entidad debe disparar efectos en otros modulos sin acoplarlos entre si.",
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
    explanationText: "La interfaz IProductoRepository vive en Domain; su implementacion en Infrastructure. Add y Remove solo marcan el cambio en memoria; el SaveChangesAsync del IUnitOfWork lo persiste todo de forma transaccional (todo o nada).",
    theory: "## Que es?\nDos patrones que trabajan juntos: **Repository** (abstrae el acceso a datos como si fuera una coleccion) y **Unit of Work** (confirma todos los cambios en una sola transaccion).\n\n## Por que se hace asi?\n- La **interfaz en Domain** invierte la dependencia: el dominio define que necesita, Infrastructure decide como (EF, Dapper...).\n- `Add` no va a la base de datos; solo registra la intencion. `SaveChangesAsync` aplica todo junto.\n\n## Beneficios\n- **Testeable**: puedes mockear `IProductoRepository` sin tocar la base.\n- **Transaccional**: varios cambios se confirman o revierten juntos.\n- **Intercambiable**: cambiar de ORM no afecta al dominio.\n\n## Cuando usarlo?\nEn Clean Architecture / DDD. Nota: EF Core ya es un Repository + UoW; este patron suma sobre todo por **testeabilidad** y por mantener el dominio puro.",
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
    explanationText: "El Command es un record que implementa ICommand<Result<Guid>> e IBaseCommand (marcador para los behaviors). El handler es 'internal sealed' porque SOLO MediatR lo instancia: nadie mas deberia llamarlo directo.",
    theory: "## Que es?\n**CQRS** (Command Query Responsibility Segregation) separa las operaciones que **escriben** (Commands) de las que **leen** (Queries). Este es el lado de escritura.\n\n## Flujo de un Command\n1. El controller crea el `CrearProductoCommand` y lo envia con `ISender`.\n2. MediatR lo enruta a su unico Handler.\n3. El handler crea la entidad, la agrega al repo y hace `SaveChangesAsync`.\n\n## Por que separar comando del handler?\nEl comando es **datos puros** (la intencion); el handler es el **comportamiento**. MediatR los une, lo que permite envolver el flujo con behaviors (validacion, logging) sin tocar el handler.\n\n## Beneficios\n- Cada caso de uso es una clase pequena y enfocada (**SRP**).\n- Facil de testear: das un comando, verificas el efecto.\n- Lectura y escritura se optimizan por separado.\n\n## Cuando usarlo?\nEn dominios con logica de negocio real. Para un CRUD plano sin reglas, CQRS + MediatR puede ser demasiada ceremonia.",
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
    explanationText: "Las queries devuelven DTOs, no la entidad, para no exponer el dominio al exterior. Si no se encuentra el dato, se retorna Result.Failure(NoEncontrado): un error de negocio explicito, no una excepcion.",
    theory: "## Que es?\nEl lado de **lectura** de CQRS. Una `Query` pide datos y devuelve un **DTO** (objeto plano de transferencia) envuelto en `Result`.\n\n## Por que devolver DTO y no la entidad?\n- La entidad tiene logica e invariantes que el cliente no debe ver ni tocar.\n- El DTO expone **solo los campos necesarios** para esa pantalla.\n- Desacopla la API del modelo interno: refactorizas la entidad sin romper el contrato.\n\n## Por que Result y no null?\nUn `null` es ambiguo (no existe o hubo un error?). `Result.Failure(NoEncontrado)` lo dice claramente y luego se mapea a 404.\n\n## Beneficios\n- **Seguridad**: no se filtra el modelo de dominio.\n- **Rendimiento**: las queries pueden proyectar directo a DTO (sin tracking).\n- Contrato de lectura estable.\n\n## Cuando usarlo?\nSiempre que leas datos para mostrarlos. Las lecturas pueden incluso saltarse el repositorio y consultar EF directo para optimizar.",
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
    explanationText: "Sin IBaseCommand, los behaviors (validacion, logging) correrian tambien en CADA query, lo que es innecesario y costoso. El marcador permite que el constraint 'where TRequest : IBaseCommand' los limite solo a comandos.",
    theory: "## Que es?\nUna **marker interface** (interfaz marcadora) es una interfaz **vacia** que sirve para etiquetar tipos. `IBaseCommand` no tiene metodos: solo marca que el tipo es un comando.\n\n## Por que se hace asi?\nLos Pipeline Behaviors de MediatR aplican a `TRequest`. Si no los restringes, corren para todo (queries incluidas). El constraint generico `where TRequest : IBaseCommand` actua como **filtro en tiempo de compilacion**.\n\n## Beneficios\n- **Validacion y logging solo en escrituras**, donde importa.\n- Cero coste en runtime (es chequeo de tipos).\n- Intencion explicita en el sistema de tipos.\n\n## Cuando usarlo?\nCuando necesitas que cierto comportamiento transversal aplique a un subconjunto de tipos. El mismo patron lo usan `ISoftDeletable`, `IAuditable`, etc.",
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
    explanationText: "Un IPipelineBehavior es un middleware para MediatR: envuelve cada request. Aqui corre los validators ANTES del handler; si hay errores lanza ValidationException (la captura el middleware), y si no, llama a next() para seguir el pipeline.",
    theory: "## Que es?\nUn **Pipeline Behavior** intercepta cada request de MediatR, como capas de cebolla alrededor del handler. `ValidationBehavior` valida el comando antes de ejecutarlo.\n\n## El patron cebolla\nrequest -> **Logging** -> **Validation** -> `Handler` -> response. Cada behavior decide si llama a `next()` (continuar) o corta el flujo.\n\n## Por que centralizar la validacion aqui?\nSi cada handler validara por su cuenta, repetirias codigo y podrias olvidarlo. El behavior **garantiza** que ningun comando invalido llegue al handler.\n\n## Beneficios\n- **DRY**: una sola pieza valida todos los comandos.\n- **Imposible de olvidar**: aplica automaticamente.\n- Handlers limpios, enfocados solo en el caso de uso.\n\n## Cuando usarlo?\nPara preocupaciones transversales: validacion, logging, transacciones, caching, metricas. Es el equivalente a un middleware, pero a nivel de aplicacion.",
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
    explanationText: "No llamas al validator a mano: el ValidationBehavior lo descubre por DI (AddValidatorsFromAssembly) y lo corre solo, antes del handler. La validacion del BACKEND es la fuente de verdad; la del front es solo UX.",
    theory: "## Que es?\n**FluentValidation** define reglas de validacion con una API encadenable (`RuleFor(x => x.Nombre).NotEmpty()`), en una clase separada del modelo.\n\n## Por que separar validacion del modelo?\nLas Data Annotations (`[Required]`) ensucian la clase y son limitadas. Un validator dedicado permite reglas complejas, condicionales y mensajes claros, todo testeable de forma aislada.\n\n## Por que el back es la fuente de verdad?\nEl cliente puede ser manipulado (DevTools, peticiones directas). La validez de los datos **debe** garantizarse en el servidor; la del front solo mejora la experiencia.\n\n## Beneficios\n- Reglas **expresivas y testeables**.\n- Mensajes de error consistentes.\n- Se integra al pipeline: validacion automatica.\n\n## Cuando usarlo?\nPara validar comandos y DTOs de entrada con reglas de negocio. Para validar un solo atributo de forma trivial, un `ValidationAttribute` puede bastar.",
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
    explanationText: "Util cuando NO usas FluentValidation. Sobreescribes IsValid y devuelves ValidationResult.Success o un mensaje de error. Se aplica de forma declarativa como [PrimeraLetraMayuscula] sobre la propiedad.",
    theory: "## Que es?\nUn **ValidationAttribute** personalizado: heredas de `ValidationAttribute`, sobreescribes `IsValid` y lo aplicas como atributo `[MiRegla]` sobre una propiedad.\n\n## Por que se hace asi?\nReutiliza el sistema de Data Annotations que ASP.NET ya conoce. La regla queda **declarativa y reutilizable** en varios DTOs con solo poner el atributo.\n\n## Atributo vs FluentValidation\n| | Atributo | FluentValidation |\n| Estilo | Declarativo, sobre la propiedad | Fluido, clase aparte |\n| Reglas complejas | Limitado | Potente (condicionales, async) |\n| Ideal para | reglas simples reutilizables | validacion de comandos |\n\n## Beneficios\n- Reutilizable con una sola linea.\n- Cero dependencias externas.\n- Se integra al `ModelState` de MVC.\n\n## Cuando usarlo?\nPara reglas simples y muy reutilizables (formato, mayusculas, rango). Para logica de negocio rica, prefiere FluentValidation.",
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
    explanationText: "Envuelve toda la pipeline en try/catch. Las ValidationException se convierten en 400 con la lista de errores; el resto en 500 generico. Asi ningun stack trace ni detalle interno se filtra al cliente.",
    theory: "## Que es?\nUn **middleware global** que captura cualquier excepcion no manejada y la transforma en una respuesta `ProblemDetails` (estandar **RFC 7807**) con el status HTTP adecuado.\n\n## Por que centralizarlo?\nSin el, cada controller necesitaria su propio `try/catch` y un error olvidado expondria el stack trace al cliente (fuga de informacion y mala UX).\n\n## Por que ProblemDetails?\nEs un formato estandar de error HTTP (`type`, `title`, `status`, `detail`). Cualquier cliente sabe interpretarlo.\n\n## Beneficios\n- **Seguridad**: nunca se filtran detalles internos.\n- **Consistencia**: todos los errores tienen la misma forma.\n- Controllers limpios, sin `try/catch` repetidos.\n\n## Cuando usarlo?\nEn toda API. Es la red de seguridad que atrapa lo que el Result Pattern no cubre: los fallos verdaderamente inesperados.",
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
    explanationText: "La Configuration es 'internal sealed' porque solo Infrastructure la usa. IsRowVersion habilita concurrencia optimista: EF detecta si otro proceso modifico la fila entre tu lectura y tu guardado, y falla en vez de pisar el cambio.",
    theory: "## Que es?\nUna clase `IEntityTypeConfiguration<T>` que concentra el **mapeo** de una entidad: tabla, clave, longitudes, conversiones de Value Objects y concurrencia. Es la Fluent API de EF Core.\n\n## Por que una clase por entidad y no Data Annotations?\n- Mantiene el **Domain puro**: la entidad no se ensucia con atributos de EF.\n- Escala mejor: cada entidad tiene su archivo de configuracion.\n- Permite mapeos avanzados que los atributos no soportan.\n\n## Que es la concurrencia optimista?\n`IsRowVersion` agrega una columna de version. Al guardar, EF compara: si alguien mas cambio la fila, falla en lugar de sobreescribir en silencio (lost update).\n\n## Beneficios\n- Dominio libre de detalles de persistencia.\n- Configuracion localizada y descubrible.\n- Proteccion contra escrituras concurrentes.\n\n## Cuando usarlo?\nSiempre que uses EF Core en una arquitectura limpia. El RowVersion, cuando varios usuarios pueden editar el mismo registro.",
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
    explanationText: "Con HasQueryFilter, cada SELECT incluye 'WHERE EstaActivo' sin que lo escribas. Para reportes administrativos usas IgnoreQueryFilters(). Es como ponerle al ORM unos lentes permanentes que ocultan lo borrado.",
    theory: "## Que es?\nUn **Global Query Filter** es una condicion `WHERE` que EF Core anade **automaticamente** a todas las consultas de una entidad.\n\n## Casos de uso tipicos\n- **Soft delete**: ocultar registros marcados como inactivos sin borrarlos fisicamente.\n- **Multi-tenancy**: que cada cliente vea solo sus propias filas.\n\n## Por que se hace asi?\nSi filtraras `WHERE EstaActivo` a mano en cada query, tarde o temprano lo olvidarias y mostrarias datos borrados. El filtro global lo hace **imposible de olvidar**.\n\n## El escape: IgnoreQueryFilters()\nPara reportes de administracion donde si necesitas ver todo (incluido lo inactivo), lo desactivas explicitamente en esa consulta.\n\n## Beneficios\n- **Seguridad por defecto**: nunca filtras datos borrados o ajenos por error.\n- Menos codigo repetido.\n- Centraliza una regla transversal.\n\n## Cuando usarlo?\nSoft delete y multi-tenancy. Ojo: aplica a TODAS las queries, asi que documenta bien donde usar el escape.",
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
    explanationText: "El DbContext se registra y ademas se expone como IUnitOfWork reusando la MISMA instancia scoped (no dos objetos distintos). Cada capa ofrece su Add* y Program.cs solo los encadena, quedando declarativo.",
    theory: "## Que es?\n**Inyeccion de Dependencias (DI)**: en vez de que una clase cree sus dependencias (`new Repositorio()`), las **recibe** ya construidas. Cada capa expone un `AddXxx()` que registra las suyas.\n\n## Los tres ciclos de vida\n| Lifetime | Vive | Usalo para |\n| `Singleton` | toda la app | servicios sin estado, config |\n| `Scoped` | por request HTTP | `DbContext`, repositorios |\n| `Transient` | cada vez que se pide | servicios ligeros sin estado |\n\n## Por que un AddXxx por capa?\nMantiene `Program.cs` **limpio y declarativo** (`AddApplication().AddInfrastructure()`) y respeta la frontera de cada capa: cada una sabe registrar lo suyo.\n\n## Beneficios\n- **Testeable**: inyectas mocks en pruebas.\n- **Desacoplado**: dependes de interfaces, no de implementaciones.\n- Composicion clara del arranque.\n\n## Cuando usarlo?\nSiempre en .NET moderno: es el mecanismo nativo. El `DbContext` va `Scoped` para compartir la misma unidad de trabajo en todo el request.",
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
    explanationText: "ValidateLifetime rechaza tokens expirados. Fijar ValidAlgorithms evita el ataque de algoritmo 'none' (un token sin firma). Un ClockSkew minimo reduce la ventana de tolerancia tras la expiracion (por defecto son 5 minutos).",
    theory: "## Que es?\n**JWT (JSON Web Token)** es un token firmado que prueba la identidad del usuario en cada request, sin que el servidor guarde sesion. `TokenValidationParameters` define como se valida.\n\n## Que valida cada parametro?\n- `ValidateIssuer` / `ValidateAudience`: que el token sea para esta API y de este emisor.\n- `ValidateLifetime`: que no este expirado.\n- `ValidateIssuerSigningKey`: que la **firma** sea autentica (no falsificado).\n- `ValidAlgorithms`: limita los algoritmos aceptados.\n\n## El ataque alg none\nSi no fijas el algoritmo, un atacante podria enviar un token con `alg: none` (sin firma) y colarse. Fijar `ValidAlgorithms` lo bloquea.\n\n## Beneficios\n- **Stateless**: escala horizontalmente sin sesion compartida.\n- Validacion estricta = superficie de ataque minima.\n\n## Cuando usarlo?\nEn APIs sin estado consumidas por SPAs o moviles. Para sesiones tradicionales del lado servidor, una cookie de sesion puede ser mas simple y segura.",
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
    explanationText: "Una policy por permiso permite proteger endpoints con [Authorize(Policy = ...)]. Los valores de los permisos deben ser IDENTICOS a los del frontend; si difieren, aparecen bugs silenciosos de autorizacion.",
    theory: "## Que es?\nAutorizacion **basada en permisos (claims)** en vez de roles. Cada accion concreta (`Productos.Edicion`) es un permiso, y se crea una **policy** que exige ese claim.\n\n## Permisos o roles?\nLos roles (un Admin generico) son gruesos y rigidos. Los **permisos** son finos: un usuario puede tener `Productos.Vista` sin `Productos.Edicion`. Los roles pasan a ser conjuntos de permisos.\n\n## Por que constantes y no strings sueltos?\nUn typo en `Productos.Edition` no falla en compilacion pero rompe la seguridad en silencio. La constante lo previene y se comparte como contrato con el front.\n\n## Beneficios\n- **Granularidad**: control fino por accion.\n- **Flexible**: cambiar permisos sin recompilar roles.\n- Contrato unico front/back.\n\n## Cuando usarlo?\nEn apps con matices de acceso (ver vs editar vs borrar). Para 2 o 3 roles fijos y simples, RBAC por roles puede bastar.",
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
    explanationText: "GetFixedWindowLimiter particiona por IP (cada IP tiene su propio cupo). La policy de auth es mas estricta (10/min) para frenar fuerza bruta en el login. UseRateLimiter activa el middleware en la pipeline.",
    theory: "## Que es?\n**Rate limiting**: limitar cuantas peticiones acepta la API por ventana de tiempo. .NET 8 lo trae nativo con varias estrategias.\n\n## Estrategias comunes\n| Algoritmo | Idea |\n| **Fixed Window** | N peticiones por ventana fija (ej. 100/min) |\n| **Sliding Window** | ventana deslizante, mas justa en los bordes |\n| **Token Bucket** | permite rafagas controladas |\n\n## Por que particionar por IP?\nPara que el cupo sea **por cliente**, no global. Y por eso el login lleva un limite mas estricto: frena ataques de fuerza bruta sin afectar al resto de la API.\n\n## Beneficios\n- **Protege** contra abuso, DoS y fuerza bruta.\n- Cuida recursos y costos del servidor.\n- Responde con el 429 estandar (Too Many Requests).\n\n## Cuando usarlo?\nEn endpoints publicos o sensibles (login, registro, busqueda). Para trafico interno confiable suele no hacer falta.",
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
