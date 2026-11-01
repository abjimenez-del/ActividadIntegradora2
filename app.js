'use strict';

/* ============ Estado y persistencia (localStorage) ============ */
const CLAVE = 'taskmanager.tareas';
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
let tareas = [];

const guardar = () => localStorage.setItem(CLAVE, JSON.stringify(tareas));
const leer = () => JSON.parse(localStorage.getItem(CLAVE));

/* ============ Opción B: Custom Events / Patrón Observador ============
   El "sujeto" (document) emite 'tareas:cambio' cada vez que cambian
   los datos; los "observadores" (dashboard y lista) se re-renderizan. */
const bus = document;
function notificarCambio() {
  guardar();
  bus.dispatchEvent(new CustomEvent('tareas:cambio', { detail: { tareas } }));
}
bus.addEventListener('tareas:cambio', renderDashboard);
bus.addEventListener('tareas:cambio', renderLista);

/* ============ Referencias al DOM ============ */
const $ = id => document.getElementById(id);
const form = $('form-tarea'), inputId = $('tarea-id'), inputTitulo = $('titulo');
const selPrioridad = $('prioridad'), btnGuardar = $('btn-guardar'), btnCancelar = $('btn-cancelar');
const errorForm = $('error-form'), lista = $('lista');
const buscar = $('buscar'), filtro = $('filtro'), orden = $('orden');

/* ============ Notificación visual ============ */
function mostrarNotificacion(msg) {
  const n = $('notificacion');
  n.textContent = msg;
  n.classList.remove('oculto');
  setTimeout(() => n.classList.add('oculto'), 6000);
}

/* ============ Carga inicial: API con fetch + async/await ============ */
async function cargarInicial() {
  const guardadas = leer();
  if (guardadas && guardadas.length) {         // localStorage tiene datos: no se duplica
    tareas = guardadas;
    return notificarCambio();
  }
  try {
    $('cargando').classList.remove('oculto');
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Error del servidor: ' + resp.status);
    const datos = await resp.json();
    const base = Date.now();
    tareas = datos.map((t, i) => ({
      id: t.id,
      titulo: t.title,
      completada: t.completed,
      prioridad: (i % 3) + 1,
      creada: base - i * 60000
    }));
  }  finally {
    $('cargando').classList.add('oculto');
  }
  notificarCambio();
}

/* ============ CRUD con validación ============ */
function validar(titulo) {
  if (!titulo.trim()) return 'El título no puede estar vacío.';
  if (titulo.trim().length < 3) return 'El título debe tener al menos 3 caracteres.';
  return '';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const titulo = inputTitulo.value;
  const msg = validar(titulo);
  errorForm.textContent = msg;
  if (msg) return;

  if (inputId.value) {                         // editar
    const t = tareas.find(x => x.id === Number(inputId.value));
    t.titulo = titulo.trim();
    t.prioridad = Number(selPrioridad.value);
  } else {                                     // crear
    tareas.push({
      id: Date.now(),
      titulo: titulo.trim(),
      completada: false,
      prioridad: Number(selPrioridad.value),
      creada: Date.now()
    });
  }
  resetForm();
  notificarCambio();
});

btnCancelar.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  inputId.value = '';
  btnGuardar.textContent = 'Agregar';
  btnCancelar.classList.add('oculto');
  errorForm.textContent = '';
}

// Delegación de eventos sobre la lista
lista.addEventListener('click', e => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = Number(li.dataset.id);
  const t = tareas.find(x => x.id === id);
  if (e.target.matches('.chk')) {
    t.completada = e.target.checked;
    notificarCambio();
  } else if (e.target.matches('.edit')) {
    inputId.value = t.id;
    inputTitulo.value = t.titulo;
    selPrioridad.value = t.prioridad;
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelar.classList.remove('oculto');
    inputTitulo.focus();
  } else if (e.target.matches('.del')) {
    tareas = tareas.filter(x => x.id !== id);
    notificarCambio();
  }
});

/* ============ Filtros, búsqueda y ordenamiento ============ */
[buscar, filtro, orden].forEach(el => el.addEventListener('input', renderLista));

function tareasVisibles() {
  const texto = buscar.value.trim().toLowerCase();
  let r = tareas.filter(t => t.titulo.toLowerCase().includes(texto));
  if (filtro.value === 'pendientes') r = r.filter(t => !t.completada);
  if (filtro.value === 'completadas') r = r.filter(t => t.completada);

  const comparadores = {
    'fecha-desc': (a, b) => b.creada - a.creada,
    'fecha-asc': (a, b) => a.creada - b.creada,
    'prioridad-desc': (a, b) => b.prioridad - a.prioridad,
    'prioridad-asc': (a, b) => a.prioridad - b.prioridad
  };
  return r.sort(comparadores[orden.value]);
}

/* ============ Renderizado ============ */
const NOMBRE_PRIORIDAD = { 1: 'Baja', 2: 'Media', 3: 'Alta' };
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function renderLista() {
  const visibles = tareasVisibles();
  lista.innerHTML = visibles.length
    ? visibles.map(t => `
      <li class="tarea ${t.completada ? 'completada' : ''}" data-id="${t.id}">
        <input type="checkbox" class="chk" ${t.completada ? 'checked' : ''} aria-label="Completada">
        <span class="titulo">${esc(t.titulo)}<small class="fecha">${new Date(t.creada).toLocaleDateString('es-EC')}</small></span>
        <span class="badge p-${t.prioridad}">${NOMBRE_PRIORIDAD[t.prioridad]}</span>
        <button class="edit">Editar</button>
        <button class="del">Eliminar</button>
      </li>`).join('')
    : '<li class="vacio">No hay tareas para mostrar.</li>';
}

function renderDashboard() {
  const comp = tareas.filter(t => t.completada).length;
  $('m-total').textContent = tareas.length;
  $('m-comp').textContent = comp;
  $('m-pend').textContent = tareas.length - comp;
}

cargarInicial();
