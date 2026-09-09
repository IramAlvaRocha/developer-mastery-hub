import type { Exercise } from "@/lib/types";

const legacy = (id: number, title: string, category: string, description: string, objective: string, codeSnippet: string, inputs: Record<string, string>, completeCode: string, tags: string[], stars = 1): Exercise => ({
  id, title, stars, category, description, objective, tags, fileName: `python-${id}`, codeSnippet, inputs, completeCode,
  explanationText: `Practica ${objective.toLowerCase()} usando Python legible y directo.`,
});

const tf = (id: number, title: string, prompt: string, statements: { id: string; text: string; answer: boolean; explanation: string }[], tags: string[], stars = 2): Exercise => ({
  id, title, stars, category: "CONCEPTO", description: prompt, objective: "Distinguir decisiones correctas de Python", tags, fileName: `python-${id}`,
  codeSnippet: "# Decide si cada afirmación es verdadera o falsa", inputs: {}, completeCode: "Revisa la explicación de cada afirmación.", explanationText: "La explicación aparece después de validar.", format: "true-false", trueFalse: { prompt, statements },
});

const pick = (id: number, title: string, prompt: string, snippets: { id: string; label: string; code: string; description: string }[], correct: string, tags: string[], stars = 2): Exercise => ({
  id, title, stars, category: "CÓDIGO", description: prompt, objective: "Elegir una implementación idiomática", tags, fileName: `python-${id}`,
  codeSnippet: "# Elige el snippet correcto", inputs: {}, completeCode: snippets.find((s) => s.id === correct)?.code ?? "", explanationText: "Compara legibilidad, comportamiento y efectos secundarios.", format: "snippet-pick", snippetPick: { prompt, snippets, correct },
});

export const PYTHON_BASIC_EXERCISES: Exercise[] = [
  legacy(1, "Presentación y variables", "SINTAXIS", "Guarda datos y construye un mensaje con f-strings.", "Usar variables y f-strings", 'name = [INPUT_1]\nage = [INPUT_2]\nprint(f"{name} tiene {age} años")', { INPUT_1: '"Ada"', INPUT_2: "28" }, 'name = "Ada"\nage = 28\nprint(f"{name} tiene {age} años")', ["variables", "f-string"]),
  legacy(2, "Conversor de temperatura", "OPERADORES", "Convierte grados Celsius a Fahrenheit.", "Aplicar una fórmula y devolver un resultado", "celsius = 20\nfahrenheit = [INPUT_1]\nprint(fahrenheit)", { INPUT_1: "celsius * 9 / 5 + 32" }, "celsius = 20\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)", ["aritmética"]),
  legacy(3, "Clasifica una edad", "CONDICIONALES", "Usa if/elif/else para clasificar una edad.", "Controlar varios caminos", "age = 17\nif age < 13:\n    label = [INPUT_1]\nelif age < 18:\n    label = [INPUT_2]\nelse:\n    label = [INPUT_3]", { INPUT_1: '"niñez"', INPUT_2: '"adolescencia"', INPUT_3: '"adultez"' }, 'age = 17\nif age < 13:\n    label = "niñez"\nelif age < 18:\n    label = "adolescencia"\nelse:\n    label = "adultez"', ["if", "elif"]),
  legacy(4, "Suma de compras", "BUCLES", "Acumula los precios de una lista sin perder el total.", "Recorrer una colección", "prices = [10, 5, 8]\ntotal = [INPUT_1]\nfor price in prices:\n    total [INPUT_2] price", { INPUT_1: "0", INPUT_2: "+=" }, "prices = [10, 5, 8]\ntotal = 0\nfor price in prices:\n    total += price", ["for", "acumuladores"]),
  legacy(5, "Filtra nombres", "COLECCIONES", "Obtén solo los nombres que empiezan con A.", "Construir una lista derivada", "names = [\"Ana\", \"Luis\", \"Alma\"]\na_names = [name [INPUT_1] names if name.startswith(\"A\") ]", { INPUT_1: "for" }, 'names = ["Ana", "Luis", "Alma"]\na_names = [name for name in names if name.startswith("A")]', ["listas", "comprensión"]),
  legacy(6, "Inventario con diccionario", "DICCIONARIOS", "Actualiza el stock de un producto.", "Leer y modificar un diccionario", 'stock = {"libro": 3}\nstock["libro"] [INPUT_1] 2', { INPUT_1: "=" }, 'stock = {"libro": 3}\nstock["libro"] = 2', ["dict"]),
  legacy(7, "Función de descuento", "FUNCIONES", "Encapsula una regla de negocio en una función.", "Definir parámetros y retorno", "def final_price(price, discount):\n    return [INPUT_1]\n\nprint(final_price(100, 0.2))", { INPUT_1: "price * (1 - discount)" }, "def final_price(price, discount):\n    return price * (1 - discount)", ["def", "return"], 2),
  tf(8, "Mutabilidad básica", "Identifica qué operaciones modifican una colección y cuáles crean otra.", [
    { id: "a", text: "Una lista puede modificarse después de crearla.", answer: true, explanation: "list es mutable." },
    { id: "b", text: "Una tupla permite cambiar uno de sus elementos.", answer: false, explanation: "tuple es inmutable." },
    { id: "c", text: "Un string se modifica usando texto[0] = 'X'.", answer: false, explanation: "Los strings son inmutables." },
  ], ["listas", "tuplas", "strings"]),
];

export const PYTHON_INTERMEDIATE_EXERCISES: Exercise[] = [
  legacy(1, "Divide en módulos", "MÓDULOS", "Reconoce la forma de importar una función desde otro archivo.", "Separar responsabilidades en archivos reutilizables", "# math_utils.py contiene add\nfrom math_utils import [INPUT_1]", { INPUT_1: "add" }, "from math_utils import add", ["import", "paquetes"]),
  legacy(2, "Maneja errores de entrada", "EXCEPCIONES", "Evita que una entrada no numérica derribe el programa.", "Capturar una excepción específica", "try:\n    age = int(input())\nexcept [INPUT_1]:\n    print(\"Edad inválida\")", { INPUT_1: "ValueError" }, "try:\n    age = int(input())\nexcept ValueError:\n    print(\"Edad inválida\")", ["try", "except"], 2),
  legacy(3, "Lee y escribe JSON", "ARCHIVOS", "Serializa un diccionario para intercambiar datos con una API.", "Usar JSON como formato estructurado", "import json\ndata = {\"active\": True}\ntext = json.[INPUT_1](data)
", { INPUT_1: "dumps" }, "import json\ndata = {\"active\": True}\ntext = json.dumps(data)", ["json", "APIs"]),
  pick(4, "Valida sin efectos ocultos", "¿Qué función valida una contraseña sin modificar el valor recibido?", [
    { id: "pure", label: "Función pura", code: "def valid(password):\n    return len(password) >= 8", description: "Solo calcula y devuelve." },
    { id: "mutate", label: "Mutación", code: "def valid(password):\n    password += \"123\"\n    return True", description: "Cambia la referencia local y oculta la regla." },
  ], "pure", ["funciones", "diseño"]),
  legacy(5, "Modelo de usuario", "CLASES", "Representa estado y comportamiento con una clase.", "Crear una clase con constructor y método", "class User:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hola, { [INPUT_1] }\"", { INPUT_1: "self.name" }, "class User:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hola, {self.name}\"", ["class", "self"], 2),
  legacy(6, "Generador de páginas", "ITERADORES", "Genera valores bajo demanda para no cargar una colección completa.", "Entender yield y lazy evaluation", "def ids():\n    yield [INPUT_1]\n    yield 2", { INPUT_1: "1" }, "def ids():\n    yield 1\n    yield 2", ["yield", "generadores"], 2),
  legacy(7, "Prueba una función", "TESTING", "Escribe la aserción mínima para verificar un resultado.", "Validar comportamiento automáticamente", "def test_total():\n    assert calculate_total([10, 5]) [INPUT_1] 15", { INPUT_1: "==" }, "def test_total():\n    assert calculate_total([10, 5]) == 15", ["assert", "pytest"], 2),
  tf(8, "Diseño orientado a objetos", "Prepara clases pequeñas que luego puedan representar modelos y servicios.", [
    { id: "a", text: "Una clase debe tener una única razón principal para cambiar.", answer: true, explanation: "Es una aplicación útil de responsabilidad única." },
    { id: "b", text: "Herencia siempre es mejor que composición.", answer: false, explanation: "La composición suele reducir acoplamiento." },
    { id: "c", text: "Una excepción específica comunica mejor el error que Exception.", answer: true, explanation: "Permite manejar solo lo esperado." },
  ], ["POO", "SOLID", "excepciones"]),
];

export const PYTHON_ADVANCED_EXERCISES: Exercise[] = [
  legacy(1, "Entorno virtual reproducible", "ENTORNOS", "Selecciona el comando para crear un entorno aislado.", "Aislar dependencias por proyecto", "python -m [INPUT_1] .venv", { INPUT_1: "venv" }, "python -m venv .venv", ["venv", "pip"]),
  legacy(2, "Tipa un servicio", "TIPADO", "Añade tipos para hacer explícito el contrato.", "Documentar entradas y salidas con type hints", "def find_user(user_id: [INPUT_1]) -> [INPUT_2]:", { INPUT_1: "int", INPUT_2: "dict | None" }, "def find_user(user_id: int) -> dict | None:", ["type hints", "contratos"], 2),
  legacy(3, "Consulta parametrizada", "SQL", "Evita concatenar valores del usuario en SQL.", "Reconocer una consulta segura", 'cursor.execute("SELECT * FROM users WHERE id = [INPUT_1]", (user_id,))', { INPUT_1: "%s" }, 'cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))', ["SQL", "inyección"] , 3),
  pick(4, "Respuesta HTTP predecible", "¿Qué respuesta representa mejor un recurso creado por una API?", [
    { id: "created", label: "201 Created", code: "return JsonResponse(data, status=201)", description: "Indica creación exitosa." },
    { id: "ok", label: "200 OK", code: "return JsonResponse(data, status=200)", description: "Es válido, pero menos preciso para creación." },
    { id: "error", label: "500 Error", code: "return JsonResponse(data, status=500)", description: "Indica un fallo del servidor." },
  ], "created", ["HTTP", "APIs"], 2),
  legacy(5, "Protege secretos", "SEGURIDAD", "Elige el lugar correcto para una clave privada.", "Separar configuración sensible del código", "API_KEY = [INPUT_1]", { INPUT_1: "os.environ[\"API_KEY\"]" }, "import os\nAPI_KEY = os.environ[\"API_KEY\"]", ["secretos", "configuración"], 2),
  legacy(6, "Servicio desacoplado", "ARQUITECTURA", "Inyecta una dependencia para facilitar pruebas.", "Separar dominio, infraestructura y entrada", "class OrderService:\n    def __init__(self, repository):\n        self.repository = [INPUT_1]", { INPUT_1: "repository" }, "class OrderService:\n    def __init__(self, repository):\n        self.repository = repository", ["arquitectura", "DI"], 3),
  legacy(7, "Asincronía con intención", "ASYNC", "Completa una operación I/O de forma asíncrona.", "Diferenciar concurrencia de paralelismo", "async def fetch_data():\n    result = [INPUT_1] client.get(\"/users\")\n    return result", { INPUT_1: "await" }, "async def fetch_data():\n    result = await client.get(\"/users\")\n    return result", ["async", "await"], 3),
  tf(8, "Puente hacia Django", "Comprueba si ya tienes las bases para comenzar el tutorial oficial de Django.", [
    { id: "models", text: "Antes de Django conviene entender clases, relaciones y SQL básico.", answer: true, explanation: "Los modelos y el ORM se apoyan en esos conceptos." },
    { id: "http", text: "Una vista web no necesita comprender request, response ni códigos HTTP.", answer: false, explanation: "Django abstrae detalles, pero no elimina el modelo mental web." },
    { id: "tests", text: "Las pruebas son parte del flujo recomendado de aprendizaje de Django.", answer: true, explanation: "El tutorial oficial incluye una parte dedicada a testing." },
  ], ["Django", "ORM", "HTTP", "testing"], 3),
];
