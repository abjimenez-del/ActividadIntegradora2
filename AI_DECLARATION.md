# Declaración de uso de Inteligencia Artificial

**Estudiante:** Alessandro Jimenez Borja
**Asignatura:** Programación de Sistemas Web — Universidad Tecnológica ECOTEC
**Proyecto:** TaskManager — Actividad Integradora 2 (JavaScript, API REST y localStorage)

Declaro que **sí utilicé inteligencia artificial generativa** como herramienta de apoyo durante el desarrollo del proyecto. El código fue revisado, probado y ajustado por mí.

## 1. ¿Qué herramientas de IA utilicé y en qué momentos?

| Herramienta | Momento de uso |
|---|---|
| **ChatGPT** (OpenAI) | Durante el desarrollo: orientación para el diseño principal del CSS, dudas sobre la lógica en JavaScript, el uso de `fetch()` con la API, el almacenamiento en `localStorage` y el manejo de errores. |
| **Claude** (Anthropic) | En la etapa final: revisión del código, detección de errores, reorganización de la paleta de colores del CSS y apoyo para estructurar el informe PDF. |

## 2. Prompts clave utilizados

1. **ChatGPT:** `seria mejor cambiarle el diseno principal al css`
2. **Claude:** `organicemos un color mas serio y correcto`

## 3. Partes que contenían errores o requirieron ajustes manuales

- **Manejo de errores de la API:** la función `cargarInicial()` usaba `try/finally` sin `catch`, por lo que un fallo de red no mostraba la notificación al usuario. Se agregó el `catch` con un mensaje visual amigable y probé el comportamiento.
- **Duplicación de datos:** la carga inicial comprobaba que la lista guardada tuviera elementos, por lo que al borrar todas las tareas se volvían a importar los datos de la API. Se cambió la condición para importar solo cuando `localStorage` no tiene datos guardados.
- **Colores de prioridad:** la prioridad "Alta" se mostraba en verde, igual que "Baja". Se corrigió a rojo, naranja y verde respectivamente.
- **Paleta de colores:** el CSS mezclaba violeta y azul, y el botón Eliminar tenía un color poco coherente. Se unificó con variables CSS en un azul marino sobrio.
- **Validación:** tras cada cambio probé en el navegador el CRUD, los filtros, la búsqueda, el ordenamiento y que las tareas se guardaran en `localStorage`.

Las sugerencias de la IA se usaron como referencia y no se incorporaron sin revisión.
