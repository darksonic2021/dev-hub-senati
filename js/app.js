'use strict';

/* ==========================================================================
   Dev HUB SENATI - Lógica del catálogo
   Autor: Integrante 2 (JavaScript, catálogo, buscador y filtros)

   Este archivo NO modifica el HTML ni el CSS del Integrante 1: sólo se
   conecta a los elementos ya existentes por su id y usa las clases CSS
   definidas en css/styles.css:
     #buscador   -> input de búsqueda
     #categoria  -> select de categorías
     #mensaje    -> párrafo de estado / resultados
     #recursos   -> contenedor de las tarjetas
     #limpiar    -> botón para resetear filtros
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. DATOS DEL CATÁLOGO
   Claves de categoría alineadas con los <option> de index.html
   -------------------------------------------------------------------------- */

/** Nombre visible de cada categoría. */
var CATEGORIAS = {
  'programacion': 'Programación',
  'diseno': 'Diseño',
  'control-de-versiones': 'Control de versiones',
  'inteligencia-artificial': 'Inteligencia artificial',
  'productividad': 'Productividad'
};

/** Catálogo de recursos tecnológicos (10 recursos reales). */
var RECURSOS = [
  {
    titulo: 'Git',
    categoria: 'control-de-versiones',
    descripcion: 'Sistema de control de versiones distribuido para registrar el historial de tu código y trabajar con ramas.',
    url: 'https://git-scm.com',
    icono: '🌿',
    etiquetas: ['ramas', 'commits', 'versionado', 'repositorio', 'terminal']
  },
  {
    titulo: 'GitHub',
    categoria: 'control-de-versiones',
    descripcion: 'Plataforma en la nube para alojar repositorios, colaborar en equipo y gestionar Pull Requests.',
    url: 'https://github.com',
    icono: '🐙',
    etiquetas: ['repositorio', 'pull request', 'remoto', 'colaboracion']
  },
  {
    titulo: 'Visual Studio Code',
    categoria: 'programacion',
    descripcion: 'Editor de código ligero y multiplataforma con resaltado, depuración y miles de extensiones.',
    url: 'https://code.visualstudio.com',
    icono: '🧩',
    etiquetas: ['editor', 'ide', 'extensiones', 'depuracion']
  },
  {
    titulo: 'Python',
    categoria: 'programacion',
    descripcion: 'Lenguaje de programación versátil y fácil de leer, ideal para empezar y para automatizar tareas.',
    url: 'https://www.python.org',
    icono: '🐍',
    etiquetas: ['lenguaje', 'backend', 'automatizacion', 'scripts']
  },
  {
    titulo: 'MDN Web Docs',
    categoria: 'programacion',
    descripcion: 'Documentación oficial y actualizada de HTML, CSS y JavaScript, con ejemplos listos para probar.',
    url: 'https://developer.mozilla.org/es/',
    icono: '📚',
    etiquetas: ['html', 'css', 'javascript', 'documentacion', 'web']
  },
  {
    titulo: 'Figma',
    categoria: 'diseno',
    descripcion: 'Herramienta colaborativa para diseñar interfaces, prototipos y sistemas de diseño en el navegador.',
    url: 'https://www.figma.com',
    icono: '🎨',
    etiquetas: ['ui', 'ux', 'prototipo', 'interfaz', 'maqueta']
  },
  {
    titulo: 'Canva',
    categoria: 'diseno',
    descripcion: 'Editor gráfico en línea con plantillas para presentaciones, afiches y contenido para redes sociales.',
    url: 'https://www.canva.com',
    icono: '🖼️',
    etiquetas: ['plantillas', 'graficos', 'presentaciones', 'redes']
  },
  {
    titulo: 'Google AI Studio',
    categoria: 'inteligencia-artificial',
    descripcion: 'Entorno de Google para experimentar con modelos de IA generativa y obtener claves de API.',
    url: 'https://aistudio.google.com',
    icono: '🤖',
    etiquetas: ['ia', 'modelos', 'api', 'prompt', 'generativa']
  },
  {
    titulo: 'Notion',
    categoria: 'productividad',
    descripcion: 'Espacio de trabajo para organizar apuntes, tareas y documentación de tus proyectos.',
    url: 'https://www.notion.so',
    icono: '🗒️',
    etiquetas: ['apuntes', 'tareas', 'organizacion', 'documentacion']
  },
  {
    titulo: 'Trello',
    categoria: 'productividad',
    descripcion: 'Tableros kanban para planificar tareas en equipo y visualizar el avance del proyecto.',
    url: 'https://trello.com',
    icono: '📋',
    etiquetas: ['kanban', 'tareas', 'equipo', 'planificacion']
  }
];

/* --------------------------------------------------------------------------
   2. REFERENCIAS AL DOM
   -------------------------------------------------------------------------- */
var buscador = document.getElementById('buscador');
var selectorCategoria = document.getElementById('categoria');
var contenedorRecursos = document.getElementById('recursos');
var mensaje = document.getElementById('mensaje');
var botonLimpiar = document.getElementById('limpiar');
var anioActual = document.getElementById('anio');

/* --------------------------------------------------------------------------
   3. UTILIDADES
   -------------------------------------------------------------------------- */

/**
 * Quita acentos y pasa a minúsculas para que "diseno" encuentre "Diseño".
 * @param {string} texto
 * @returns {string}
 */
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Filtra el catálogo según el texto buscado y la categoría elegida.
 * @returns {Array<object>}
 */
function obtenerRecursosFiltrados() {
  var termino = normalizar(buscador ? buscador.value : '');
  var categoria = selectorCategoria ? selectorCategoria.value : 'todas';

  return RECURSOS.filter(function (recurso) {
    var coincideCategoria =
      categoria === 'todas' || recurso.categoria === categoria;

    if (!coincideCategoria) {
      return false;
    }

    if (termino === '') {
      return true;
    }

    // Busca en título, descripción, nombre de categoría y etiquetas.
    var textoBuscable = normalizar(
      [
        recurso.titulo,
        recurso.descripcion,
        CATEGORIAS[recurso.categoria] || '',
        recurso.etiquetas.join(' ')
      ].join(' ')
    );

    return textoBuscable.indexOf(termino) !== -1;
  });
}

/**
 * Crea la tarjeta (<article>) de un recurso siguiendo el contrato de estilos
 * definido por el Integrante 1 en css/styles.css.
 * @param {object} recurso
 * @returns {HTMLElement}
 */
function crearTarjetaRecurso(recurso) {
  var tarjeta = document.createElement('article');
  tarjeta.className = 'recurso';

  var icono = document.createElement('span');
  icono.className = 'recurso__icono';
  icono.setAttribute('aria-hidden', 'true');
  icono.textContent = recurso.icono;

  var categoria = document.createElement('span');
  categoria.className = 'recurso__categoria';
  categoria.textContent = CATEGORIAS[recurso.categoria] || recurso.categoria;

  var titulo = document.createElement('h3');
  titulo.className = 'recurso__titulo';
  titulo.textContent = recurso.titulo;

  var descripcion = document.createElement('p');
  descripcion.className = 'recurso__descripcion';
  descripcion.textContent = recurso.descripcion;

  var enlace = document.createElement('a');
  enlace.className = 'recurso__enlace';
  enlace.href = recurso.url;
  enlace.target = '_blank';
  enlace.rel = 'noopener';
  enlace.textContent = 'Ver recurso →';
  enlace.setAttribute('aria-label', 'Ver recurso ' + recurso.titulo + ' en una pestaña nueva');

  // Botón interactivo extra (reutiliza los estilos .btn del Integrante 1).
  var botonCopiar = document.createElement('button');
  botonCopiar.type = 'button';
  botonCopiar.className = 'btn btn--secundario recurso__copiar';
  botonCopiar.dataset.url = recurso.url;
  botonCopiar.textContent = 'Copiar enlace';
  botonCopiar.setAttribute('aria-label', 'Copiar el enlace de ' + recurso.titulo);

  tarjeta.appendChild(icono);
  tarjeta.appendChild(categoria);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(descripcion);
  tarjeta.appendChild(enlace);
  tarjeta.appendChild(botonCopiar);

  return tarjeta;
}

/**
 * Escribe el mensaje de estado según los resultados obtenidos.
 * @param {number} visibles
 */
function actualizarMensaje(visibles) {
  if (!mensaje) {
    return;
  }

  var termino = buscador ? buscador.value.trim() : '';
  var categoria = selectorCategoria ? selectorCategoria.value : 'todas';

  if (visibles === 0) {
    var detalle = '';

    if (termino !== '') {
      detalle = ' para "' + termino + '"';
    }

    if (categoria !== 'todas') {
      detalle += (detalle ? ' y' : ' en') + ' la categoría "' +
        (CATEGORIAS[categoria] || categoria) + '"';
    }

    mensaje.textContent = 'No se encontraron recursos' + detalle +
      '. Prueba con otra palabra o quita los filtros.';
    return;
  }

  var texto = 'Mostrando ' + visibles + ' de ' + RECURSOS.length + ' recursos';

  if (termino !== '' || categoria !== 'todas') {
    texto += ' (filtrados)';
  }

  mensaje.textContent = texto + '.';
}

/* --------------------------------------------------------------------------
   4. RENDERIZADO
   -------------------------------------------------------------------------- */
function renderizarCatalogo() {
  if (!contenedorRecursos) {
    return;
  }

  var resultados = obtenerRecursosFiltrados();

  contenedorRecursos.innerHTML = '';

  if (resultados.length === 0) {
    // Evita el estado :empty del CSS y muestra un aviso amigable.
    var aviso = document.createElement('p');
    aviso.className = 'mensaje';
    aviso.textContent = 'Sin resultados. Ajusta la búsqueda para ver más recursos.';
    contenedorRecursos.appendChild(aviso);
  } else {
    var fragmento = document.createDocumentFragment();

    resultados.forEach(function (recurso) {
      fragmento.appendChild(crearTarjetaRecurso(recurso));
    });

    contenedorRecursos.appendChild(fragmento);
  }

  actualizarMensaje(resultados.length);
}

/* --------------------------------------------------------------------------
   5. ACCIONES
   -------------------------------------------------------------------------- */
function limpiarFiltros() {
  if (buscador) {
    buscador.value = '';
  }

  if (selectorCategoria) {
    selectorCategoria.value = 'todas';
  }

  renderizarCatalogo();

  if (buscador) {
    buscador.focus();
  }
}

/**
 * Copia el enlace del recurso al portapapeles con respaldo para navegadores
 * que no exponen la API Clipboard (por ejemplo al abrir el archivo local).
 * @param {HTMLButtonElement} boton
 */
function copiarEnlace(boton) {
  var url = boton.dataset.url;
  var textoOriginal = boton.textContent;

  function confirmar() {
    boton.textContent = '¡Copiado!';
    window.setTimeout(function () {
      boton.textContent = textoOriginal;
    }, 1500);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(confirmar, function () {
      respaldoCopiar(url, confirmar);
    });
    return;
  }

  respaldoCopiar(url, confirmar);
}

/**
 * Respaldo de copiado usando un textarea temporal.
 * @param {string} url
 * @param {Function} alCopiar
 */
function respaldoCopiar(url, alCopiar) {
  var area = document.createElement('textarea');
  area.value = url;
  area.setAttribute('readonly', 'readonly');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();

  try {
    document.execCommand('copy');
    alCopiar();
  } catch (error) {
    window.prompt('Copia el enlace manualmente:', url);
  }

  document.body.removeChild(area);
}

/* --------------------------------------------------------------------------
   6. EVENTOS
   -------------------------------------------------------------------------- */
// Búsqueda en tiempo real (se dispara con cada tecla).
if (buscador) {
  buscador.addEventListener('input', renderizarCatalogo);
}

// Cambio de categoría.
if (selectorCategoria) {
  selectorCategoria.addEventListener('change', renderizarCatalogo);
}

// Botón interactivo: limpiar buscador y filtros.
if (botonLimpiar) {
  botonLimpiar.addEventListener('click', limpiarFiltros);
}

// Delegación de eventos: un solo listener atiende los botones "Copiar enlace"
// de todas las tarjetas (presentes y futuras).
if (contenedorRecursos) {
  contenedorRecursos.addEventListener('click', function (evento) {
    var boton = evento.target.closest('.recurso__copiar');

    if (boton) {
      copiarEnlace(boton);
    }
  });
}

// Atajo de teclado: Escape limpia el buscador.
if (buscador) {
  buscador.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      limpiarFiltros();
    }
  });
}

/* --------------------------------------------------------------------------
   7. INICIALIZACIÓN
   -------------------------------------------------------------------------- */
function iniciar() {
  if (anioActual) {
    anioActual.textContent = String(new Date().getFullYear());
  }

  renderizarCatalogo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}
