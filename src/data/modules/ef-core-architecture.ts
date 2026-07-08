import type { Module } from '../index';

export const exercises: Exercise[] = [
  {
    id: 1,
    title: "Configuración de Value Object con OwnsOne",
    stars: 3,
    category: "Arquitectura",
    description: "Un aggregate root 'Company' tiene un 'Address'. No queremos que 'Address' sea una tabla separada ni que tenga su propia identidad, debe ser parte de 'Company' para mantener la consistencia transaccional.",
    objective: "Configurar la propiedad 'Address' usando Fluent API para que se mapee como un Value Object dentro de la tabla Company.",
    fileName: "CompanyConfiguration.cs",
    explanationText: "Usar OwnsOne le dice a EF Core que el objeto no tiene vida propia y depende enteramente de su padre. Es como el bolsillo de un abrigo. El bolsillo no existe por sí solo en la tintorería; se lava y existe junto con el abrigo. Si el abrigo se tira a la basura, el bolsillo también. Esto mantiene tu dominio limpio y tu base de datos sin tablas innecesarias.",
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
    fileName: "ProductConfiguration.cs",
    explanationText: "Definir límites estrictos evita reservar bloques de memoria gigantes inútiles. Es como reservar un camión de mudanza entero para una sola mochila. Si usas HasMaxLength, pides una motocicleta. Y al usar IsUnicode(false), le dices al motor 'y no traigas remolque pesado, porque no llevaremos carga especial (caracteres Unicode)', reduciendo el peso en disco a la mitad y evitando la fragmentación.",
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
    fileName: "DocumentConfiguration.cs",
    explanationText: "Las Shadow Properties existen en el modelo de EF Core y en la base de datos, pero no en tu clase C#. Es como el sello de seguridad invisible que le ponen a los billetes en el banco. El billete (tu clase C#) no cambia su diseño y la gente lo usa sin ver el sello, pero el banco (EF Core) sabe que está ahí para rastrearlo y protegerlo. Así mantenemos el dominio limpio.",
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
    fileName: "UserConfiguration.cs",
    explanationText: "HasQueryFilter aplica un 'where' automáticamente a todas tus consultas. Es como tener un colador en el fregadero de la cocina. No tienes que ir cazando tú los restos de comida uno por uno para atraparlos; el colador automáticamente los retiene y solo deja pasar el agua limpia. Así evitas que datos 'basura' lleguen a la aplicación accidentalmente.",
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
    fileName: "AccountConfiguration.cs",
    explanationText: "Un índice compuesto único asegura la unicidad basándose en la combinación de dos columnas. Es como un torneo: no puedes tener dos equipos con el mismo nombre en la misma liga, pero sí un 'Tigres' en México y otro en España. La unicidad depende de liga (Tenant) + nombre (Email). Al usar Shadow Properties, el compilador nos exige pasar los nombres como strings, no mediante lambdas.",
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
