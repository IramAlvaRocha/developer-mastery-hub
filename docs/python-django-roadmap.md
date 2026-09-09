# Ruta de Python hacia Django

## Criterio de diseño

La ruta sigue el orden pedagógico del [tutorial oficial de Python](https://docs.python.org/3/tutorial/): expresiones y control de flujo, estructuras de datos, funciones, módulos, entrada/salida, excepciones, clases, biblioteca estándar y entornos virtuales.

Después añade las competencias que Django presupone: separación en módulos, tipado opcional, pruebas, JSON, SQL parametrizado, HTTP, configuración por entorno y diseño de servicios.

La meta no es enseñar Django dentro de Python, sino dejar al estudiante listo para su tutorial oficial: requests/responses, modelos y admin, vistas/templates, formularios, testing, archivos estáticos y paquetes de terceros. Esa es la secuencia publicada en la [documentación de Django 6.0](https://docs.djangoproject.com/en/6.0/).

## Módulos incluidos

| Nivel | Módulo | Resultado esperado |
| --- | --- | --- |
| Básico | Python: Fundamentos | Resolver problemas pequeños con variables, condicionales, bucles, colecciones y funciones. |
| Intermedio | Python: Intermedio | Construir código mantenible con módulos, excepciones, clases, JSON, generadores y pruebas. |
| Avanzado | Python: Backend listo para Django | Entender entornos, contratos tipados, SQL seguro, HTTP, secretos, inyección de dependencias y async. |

## Compatibilidad investigada

La documentación de instalación de Django indica que Django 6.0 soporta Python 3.12, 3.13 y 3.14; Python 3.14 es la versión documentada actualmente por Python. El contenido evita depender de APIs demasiado nuevas para que los ejercicios sigan siendo útiles con Python 3.12+.

## Decisiones pedagógicas

- Los ejercicios básicos priorizan la lectura y transformación de datos antes de introducir abstracciones.
- El nivel intermedio convierte scripts en piezas reutilizables y comprobables.
- El nivel avanzado conecta cada concepto con backend real: SQL, APIs, configuración y seguridad.
- El ejercicio final de cada nivel funciona como control conceptual; no requiere instalar Django.
- Los ejercicios reutilizan los formatos interactivos ya soportados por el catálogo para no introducir un contrato nuevo.
