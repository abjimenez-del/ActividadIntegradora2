# TaskManager — Actividad Integradora 2

Aplicación web de gestión de tareas hecha con **JavaScript vanilla (ES6+)**, sin librerías ni frameworks. Consume una API REST pública y guarda los datos en el navegador, por lo que sigue funcionando sin conexión.

Materia: Programación de Sistemas Web — ECOTEC.

## Funcionalidades

- **CRUD:** crear, editar, eliminar y marcar tareas como completadas, con validación de campos desde JavaScript (no vacío, mínimo 3 caracteres).
- **Filtros y búsqueda:** por estado (Todas, Pendientes, Completadas) y búsqueda en tiempo real por título.
- **Ordenamiento:** por fecha de creación o por prioridad (Alta, Media, Baja).
- **Dashboard:** total, pendientes y completadas, actualizado automáticamente.
- **API REST:** carga inicial desde [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) con `fetch()` y `async/await`.
- **Persistencia:** `localStorage` con `JSON.stringify()` / `JSON.parse()`. Si ya hay datos guardados, no se vuelve a importar de la API (no se duplican registros).
- **Manejo de errores:** `try/catch` con una notificación visual si falla la red o el servidor.

## Investigación técnica: Opción B (Custom Events / Patrón Observador)

Cada vez que cambian los datos, `notificarCambio()` guarda en `localStorage` y emite un `CustomEvent` llamado `tareas:cambio` con `dispatchEvent`. El dashboard y la lista de tareas están suscritos a ese evento con `addEventListener`, así que se vuelven a renderizar solos. De esta forma, el código que modifica las tareas no necesita saber qué partes de la interfaz dependen de ellas.

## Cómo ejecutarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador (o usa Live Server en VS Code).

No requiere instalación ni servidor.

## Estructura

```
├── index.html   # estructura de la página
├── style.css    # estilos
├── app.js       # lógica, API, localStorage y eventos
└── README.md
```

## Autor

Alessandro Jimenez Borja
