import type { Module } from '../index';

export const EF_CORE_ARCHITECTURE: Exercise[] = [
  {
    id: 1,
    title: "Configuración de Value Object con OwnsOne",
    stars: 3,
    category: "Arquitectura",
    description: "Un aggregate root 'Company' tiene un 'Address'. No queremos que 'Address' sea una tabla separada ni que tenga su propia identidad, debe ser parte de 'Company' para mantener la consistencia transaccional.",
    objective: "Configurar la propiedad 'Address' usando Fluent API para que se mapee como un Value Object dentro de la tabla Company.",
    tags: ["EF Core", "Arquitectura", "Value Object", "OwnsOne"],
    completed: false,
    fileName: "CompanyConfiguration.cs",
    theory: `## Value Objects con OwnsOne
Un Value Object (Address) se define por su valor, no por una identidad. No merece tabla propia.

### Qué hace OwnsOne
- Mapea las propiedades de Address como columnas de la tabla Company.
- EF Core las carga y guarda siempre junto al aggregate root.

### Por qué importa
- Sin identidad propia no hay tablas huérfanas ni JOINs extra.
- La consistencia transaccional es natural: todo se guarda con el padre.

### Regla
¿El objeto tiene identidad y ciclo de vida propio? → Entidad con tabla. ¿Es solo un conjunto de valores del padre? → OwnsOne.`,
    explanationText: "🌍 Ejemplo cotidiano: el bolsillo de un abrigo no existe por sí solo en la tintorería: se lava y existe junto con el abrigo.\n\nOwnsOne mapea el Value Object Address como columnas dentro de la tabla Company, sin tabla ni identidad propias. Al no tener entidad propia, mantienes la consistencia transaccional y evitas tablas innecesarias.",
    codeSnippet: `public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);
        
        // Configurar el Value Object Address
        builder.[INPUT_1](c => c.Address, a =>
        {
            a.Property(p => p.Street).HasMaxLength(100);
            a.Property(p => p.City).HasMaxLength(50);
        });
    }
}`,
    inputs: { "INPUT_1": "OwnsOne" },
    completeCode: `public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);
        
        // Configurar el Value Object Address
        builder.OwnsOne(c => c.Address, a =>
        {
            a.Property(p => p.Street).HasMaxLength(100);
            a.Property(p => p.City).HasMaxLength(50);
        });
    }
}`
  },
  {
    id: 2,
    title: "Prevención de fragmentación con HasMaxLength",
    stars: 2,
    category: "Rendimiento",
    description: "La tabla 'Product' tiene una propiedad 'Sku' que actualmente se crea como nvarchar(max) por defecto en SQL Server. Esto causa fragmentación de índices y desperdicia memoria, ya que los SKU nunca superan los 50 caracteres alfanuméricos.",
    objective: "Forzar la columna 'Sku' a tener una longitud máxima de 50 y ser de tipo varchar (no Unicode) para optimizar el almacenamiento.",
    tags: ["EF Core", "Rendimiento", "HasMaxLength", "IsUnicode"],
    completed: false,
    fileName: "ProductConfiguration.cs",
    explanationText: "🌍 Ejemplo cotidiano: reservar un camión de mudanza para una mochila es un desperdicio: HasMaxLength pide la moto justa.\n\nPor defecto un string se crea como nvarchar(max); limitarlo con HasMaxLength(50) y IsUnicode(false) reduce el peso en disco a la mitad y evita la fragmentación de índices. Dimensionar columnas es higiene básica que se nota a escala.",
    codeSnippet: `public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Sku)
               .[INPUT_1](50)
               .[INPUT_2](false);
    }
}`,
    inputs: { "INPUT_1": "HasMaxLength", "INPUT_2": "IsUnicode" },
    completeCode: `public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Sku)
               .HasMaxLength(50)
               .IsUnicode(false);
    }
}`
  },
  {
    id: 3,
    title: "Implementación de Shadow Property para TenantId",
    stars: 4,
    category: "Arquitectura",
    description: "En un sistema multi-tenant, cada registro debe estar asociado a un inquilino (Tenant). Sin embargo, el modelo de dominio puro no debe saber nada sobre la infraestructura de base de datos ni tener la propiedad TenantId explícitamente en sus clases, para evitar acoplamiento.",
    objective: "Crear una propiedad oculta (Shadow Property) llamada 'TenantId' de tipo string en la entidad 'Document' usando Fluent API, sin modificar la clase C#.",
    tags: ["EF Core", "Arquitectura", "Shadow Properties", "Multi-Tenant"],
    completed: false,
    fileName: "DocumentConfiguration.cs",
    theory: `## Shadow Properties
Una Shadow Property existe en el modelo de EF Core y en la base de datos, pero NO en tu clase C#.

### Para qué sirven
- Multi-tenancy: TenantId sin ensuciar el dominio.
- Auditoría: CreatedAt / UpdatedBy invisibles para el modelo.

### Cómo se usan
\`builder.Property<string>("TenantId")\` la declara; se filtra con \`EF.Property<string>(e, "TenantId")\`.

### Por qué importa
Mantiene el dominio limpio: la infraestructura no contamina las entidades. El precio es renunciar al acceso fuertemente tipado por lambda.`,
    explanationText: "🌍 Ejemplo cotidiano: el sello de seguridad de un billete existe sin cambiar el diseño del billete: nadie lo ve, pero el banco lo rastrea.\n\nCon builder.Property<string>(\"TenantId\") creas una Shadow Property: vive en el modelo y en la BD, pero no en la clase C#. Así el dominio puro no conoce la infraestructura multi-tenant y no se acopla a la persistencia.",
    codeSnippet: `public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.HasKey(d => d.Id);
        
        // Crear la propiedad oculta sin modificar la clase Document
        builder.[INPUT_1]<string>("TenantId");
    }
}`,
    inputs: { "INPUT_1": "Property" },
    completeCode: `public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.HasKey(d => d.Id);
        
        // Crear la propiedad oculta sin modificar la clase Document
        builder.Property<string>("TenantId");
    }
}`
  },
  {
    id: 4,
    title: "Filtro Global de Consulta para Soft Delete",
    stars: 4,
    category: "Arquitectura",
    description: "El sistema no borra físicamente los registros por motivos de auditoría legal. En su lugar, se marca la propiedad 'IsDeleted' como true. El problema es que los desarrolladores olvidan filtrar esto en sus consultas LINQ, causando que se devuelvan registros 'borrados' a los usuarios.",
    objective: "Configurar un filtro de consulta automático a nivel de modelo para que EF Core ignore siempre los registros donde 'IsDeleted' es verdadero.",
    tags: ["EF Core", "Arquitectura", "Soft Delete", "HasQueryFilter"],
    completed: false,
    fileName: "UserConfiguration.cs",
    theory: `## Soft delete con HasQueryFilter
Un filtro global añade una condición WHERE a todas las consultas de una entidad, sin escribirlo a mano en cada LINQ.

### Cómo funciona
\`builder.HasQueryFilter(u => !u.IsDeleted)\` hace que EF Core excluya los borrados automáticamente.

### El escape
Para reportes de auditoría necesitas verlos: usa \`.IgnoreQueryFilters()\` explícitamente en esa consulta.

### Por qué importa
Si el filtro depende de que cada dev lo recuerde, tarde o temprano alguien lo olvida. Centralizarlo lo hace imposible de olvidar.`,
    explanationText: "🌍 Ejemplo cotidiano: el colador del fregadero retiene los restos solo: no vas cazándolos uno a uno.\n\nHasQueryFilter agrega un WHERE automático a TODAS las consultas de la entidad, así los registros con IsDeleted=true nunca se devuelven. Sin él, basta una consulta olvidada para exponer datos 'borrados' al usuario.",
    codeSnippet: `public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.IsDeleted).IsRequired();
        
        // Aplicar el filtro global para Soft Delete
        builder.[INPUT_1](u => !u.IsDeleted);
    }
}`,
    inputs: { "INPUT_1": "HasQueryFilter" },
    completeCode: `public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.IsDeleted).IsRequired();
        
        // Aplicar el filtro global para Soft Delete
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}`
  },
  {
    id: 5,
    title: "Índice Compuesto Único por Tenant",
    stars: 5,
    category: "Ciberseguridad",
    description: "En nuestra arquitectura multi-tenant, no se puede permitir que dos usuarios del mismo Tenant se registren con el mismo correo, pero sí es válido que el mismo correo exista en Tenants distintos. Un índice simple en Email está bloqueando registros válidos.",
    objective: "Crear un índice compuesto único sobre la propiedad Shadow 'TenantId' y la propiedad 'Email' usando arreglos de strings en la Fluent API.",
    tags: ["EF Core", "Arquitectura", "Índices", "HasIndex", "IsUnique"],
    completed: false,
    fileName: "AccountConfiguration.cs",
    theory: `## Índice único compuesto multi-tenant
La unicidad no siempre es por una sola columna: aquí es por la combinación TenantId + Email.

### Qué cambia
- Índice simple en Email → bloquea emails válidos de otros tenants.
- Índice compuesto → permite el mismo email en tenants distintos, pero no dos veces en el mismo tenant.

### Detalle de Shadow Properties
Al no existir TenantId en la clase, se referencia por nombre de string: \`builder.HasIndex("TenantId", "Email")\`.

### Por qué importa
Un índice único es la red de seguridad de la BD: aunque tu código olvide validar, la base rechaza el duplicado.`,
    explanationText: "🌍 Ejemplo cotidiano: puede haber un 'Tigres' en México y otro en España: la unicidad depende de liga + nombre.\n\nHasIndex(\"TenantId\", \"Email\").IsUnique() crea un índice único sobre la combinación de dos columnas, no sobre Email a secas. Al ser Shadow Property, los nombres se pasan como strings (no lambdas), y el mismo email puede existir en tenants distintos.",
    codeSnippet: `public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property<string>("TenantId");
        builder.Property(a => a.Email).HasMaxLength(150);
        
        // Crear el índice único compuesto usando strings
        builder.[INPUT_1]([INPUT_2], "Email")
               .[INPUT_3]();
    }
}`,
    inputs: { "INPUT_1": "HasIndex", "INPUT_2": "\"TenantId\"", "INPUT_3": "IsUnique" },
    completeCode: `public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property<string>("TenantId");
        builder.Property(a => a.Email).HasMaxLength(150);
        
        // Crear el índice único compuesto usando strings
        builder.HasIndex("TenantId", "Email")
               .IsUnique();
    }
}`
  }
];
