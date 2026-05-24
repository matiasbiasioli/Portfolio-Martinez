/* ============================================================
   MOVIE DETAILS PAGE
   js/movieDetails.js
   ============================================================ */


/* ============================================================
   1. LEER EL ID DE LA URL Y CARGAR LA PELÍCULA
   ============================================================ */

async function loadMovie() {
    console.log('loadMovie ejecutado');
  // Lee el ?id= de la URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  console.log('id encontrado:', id);

  if (!id) {
    showError();
    return;
  }

  try {
    // Carga el JSON con todas las películas
    const response = await fetch('/data/movies.json?v=' + Date.now());
    const movies = await response.json();
    console.log('películas cargadas:', movies);
console.log('buscando id:', id);

    // Busca la película por id
    const movie = movies.find(m => m.id === id);

    if (!movie) {
      showError();
      return;
    }

    // Rellena la página con los datos
    renderMovie(movie);

  } catch (error) {
    console.error('Error cargando movies.json:', error);
    showError();
  }
}


/* ============================================================
   2. RENDERIZAR LA PELÍCULA EN LA PÁGINA
   ============================================================ */

function renderMovie(movie) {

  // Título de la pestaña del navegador
  document.title = `${movie.titulo} – Matías Martinez`;

  // Hero – imagen de fondo
  const heroBg = document.getElementById('movieHeroBg');
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${movie.imagen_hero}')`;
  }

  // Categoría
  const catEl = document.getElementById('movieCategoria');
  if (catEl) catEl.textContent = movie.categoria;

  // Título
  const titEl = document.getElementById('movieTitulo');
  if (titEl) titEl.textContent = movie.titulo;

  // Ficha técnica
  const dirEl = document.getElementById('movieDirector');
  if (dirEl) dirEl.textContent = movie.director;

  const añoEl = document.getElementById('movieAño');
  if (añoEl) añoEl.textContent = movie.año;

  const rolEl = document.getElementById('movieRol');
  if (rolEl) rolEl.textContent = movie.rol;

  // Trailer
  const trailerEl = document.getElementById('movieTrailer');
  if (trailerEl && movie.trailer) {
    trailerEl.src = movie.trailer + '?rel=0&modestbranding=1';
  }

  // Guarda la URL del trailer para el modal
  window._trailerUrl = movie.trailer;

  // Galería de escenas
  renderGallery(movie.escenas);

  // Work in Progress
  renderWip(movie.wip);
}


/* ============================================================
   3. GALERÍA DE ESCENAS
   ============================================================ */

let galleryImages = [];
let currentLightboxIndex = 0;

function renderGallery(escenas) {
  const grid = document.getElementById('movieGalleryGrid');
  const section = document.getElementById('movieGallery');

  if (!grid) return;

  // Si no hay escenas oculta la sección
  if (!escenas || escenas.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  galleryImages = escenas;

  escenas.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'movie-gallery__item reveal';

    item.innerHTML = `
      <img src="${src}" alt="Escena ${index + 1}" loading="lazy" />
      <div class="movie-gallery__item__overlay">
        <i class="fas fa-expand-alt"></i>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(index));
    grid.appendChild(item);
  });

  // Activa scroll reveal en los nuevos elementos
  initRevealObserver();
}


/* ============================================================
   4. WORK IN PROGRESS
   ============================================================ */

function renderWip(wip) {
  const grid = document.getElementById('movieWipGrid');

  if (!grid) return;

  // Si no hay imágenes muestra placeholder
  if (!wip || wip.length === 0) {
    grid.innerHTML = `
      <div class="movie-wip__placeholder">
        Próximamente
      </div>
    `;
    return;
  }

  wip.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'movie-wip__item reveal';

    item.innerHTML = `
      <img src="${src}" alt="Work in Progress ${index + 1}" loading="lazy" />
    `;

    grid.appendChild(item);
  });

  initRevealObserver();
}


/* ============================================================
   5. LIGHTBOX
   ============================================================ */

const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  lightboxImg.src = galleryImages[currentLightboxIndex];
  lightboxImg.alt = `Escena ${currentLightboxIndex + 1}`;
  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

function prevImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightbox();
}

function nextImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
  updateLightbox();
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

// Navegación con teclado
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'Escape')     closeLightbox();
});


/* ============================================================
   6. MODAL TRAILER
   ============================================================ */

const modalTrailer  = document.getElementById('modalTrailer');
const modalIframe   = document.getElementById('modalIframe');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const trailerExpand = document.getElementById('trailerExpand');

function openModal() {
  if (!window._trailerUrl) return;
  // Autoplay al abrir el modal
  modalIframe.src = window._trailerUrl + '?autoplay=1&rel=0&modestbranding=1';
  modalTrailer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalTrailer.classList.remove('open');
  // Detiene el video vaciando el src
  modalIframe.src = '';
  document.body.style.overflow = '';
}

if (trailerExpand) trailerExpand.addEventListener('click', openModal);
if (modalClose)    modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

// Cierra modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalTrailer.classList.contains('open')) {
    closeModal();
  }
});


/* ============================================================
   7. SCROLL REVEAL
   ============================================================ */

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}


/* ============================================================
   8. ERROR – PELÍCULA NO ENCONTRADA
   ============================================================ */

function showError() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #0a0a0a;
      color: #e8e5e0;
      font-family: 'Montserrat', sans-serif;
      gap: 1.5rem;
      text-align: center;
      padding: 2rem;
    ">
      <p style="font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4);">Error 404</p>
      <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 300;">Proyecto no encontrado</h1>
      <a href="projects.html" style="
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #c8a96e;
        border-bottom: 1px solid #c8a96e;
        padding-bottom: 3px;
        text-decoration: none;
      ">← Volver a proyectos</a>
    </div>
  `;
}

/* ============================================================
   10. INICIO
   ============================================================ */

loadMovie();
