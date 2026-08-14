# Estándar de Pistas Pedagógicas (hints)

Las `hints` son pistas progresivas que se revelan una a una bajo demanda. Van de lo
conceptual a lo casi-respuesta, para que el usuario **razone la solución** en vez de
copiarla. Este documento define el criterio para escribirlas en los módulos de
`src/data/modules/*.ts`.

## Anatomía de las pistas

| Índice | Rol | Qué hace |
|--------|-----|----------|
| `hints[0]` | Nudge conceptual | Orienta a pensar en la dirección correcta. A ser posible usa la analogía 🌍 del tema, **sin revelar la respuesta**. |
| `hints[1]` | Técnica concreta | Apunta al mecanismo, servicio o sintaxis que hay que aplicar. Ya no hay dudas de "por dónde". |
| `hints[2]` | Casi-respuesta (opcional) | Solo en ejercicios complejos (≥3 estrellas o multi-paso). Guía al detalle final sin escribir la respuesta exacta literal. |

- **Longitud:** 1-2 frases por hint, máximo ~200 caracteres.
- **Tono:** cercano, directo, sin tecnicismos innecesarios.
- **Coherencia:** cada hint debe ser consistente con `explanationText`, `theory` e
  `instruction` del ejercicio: no introducir conceptos que la solución no usa.

## Reglas duras

1. **Solo se añade el campo `hints: [...]`** al objeto del ejercicio.
2. **NO modificar**: `id`, `title`, `stars`, `category`, `step`, `description`,
   `objective`, `tags`, `fileName`, `completed`, `instruction`, `theory`,
   `explanationText`, `codeSnippet`, `inputs`, `completeCode`, `simulation`, `format`
   ni las respuestas de `prediction/ordering/snippetPick/bugHunt/matching/
   contextDropdown/trueFalse`.
3. No `console.log`, no tocar componentes ni archivos fuera de `src/data/modules/`.
4. Mantener el estilo de formato y encoding UTF-8 del archivo.
5. Si el ejercicio ya tiene hints, revisarlas y ajustarlas con el estándar (no duplicar).

## Cómo decidir cuántas pistas

- **1-2 estrellas:** 2 pistas (`[0]` conceptual, `[1]` técnica concreta).
- **3-5 estrellas o formato complejo** (multi-input, `snippet-pick`, `ordering`,
  `matching`, `bug-hunt` con opciones): 3 pistas (`[0]`, `[1]`, `[2]` casi-respuesta).
- Excepción: un ejercicio de 1 estrella trivial puede llevar 1 sola pista si una segunda
  sería relleno.

## Ejemplo bueno (ejercicio de SQLi, 3 estrellas)

```ts
hints: [
  "🌍 Piensa en el formulario del cajero: ¿qué pasa si el dato del email se interpreta como parte de la orden?",
  "La entrada del usuario se concatena directo en la sentencia SQL. Busca la forma de enviar comando y datos por separado.",
  "Reemplaza la concatenación por placeholders: la consulta lleva $1 y el valor viaja en un arreglo aparte."
],
```

## Ejemplo malo

```ts
hints: [
  "¿Sabes qué es SQL?",                          // ❌ vago, no orienta al ejercicio
  "Usa db.query(query, values)",                 // ❌ literal: escribe la respuesta exacta
  "La respuesta es la primera opción",           // ❌ revela la respuesta, no enseña
],
```

## Checklist por hint

- [ ] ¿Orienta al razonamiento y no da la respuesta literal?
- [ ] ¿Es coherente con la analogía 🌍 / explicación técnica del ejercicio?
- [ ] ¿Cabe en 1-2 frases (~200 caracteres)?
- [ ] ¿Cada hint es más concreta que la anterior (progresión vaga → casi-respuesta)?
- [ ] ¿No menciona `[INPUT_N]` ni la respuesta exacta de `inputs`?
