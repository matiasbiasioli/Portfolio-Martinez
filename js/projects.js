/* ============================================================
   PROJECTS PAGE
   js/projects.js
   ============================================================ */


/* ============================================================
   1. FILTROS
   ============================================================ */

const filterBtns = document.querySelectorAll('.filters__btn');
const cards      = document.querySelectorAll('.pcard');

function filterProjects(category) {
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const match = category === 'all' || cardCategory === category;

    if (match) {
      // Muestra la card
      card.classList.remove('hidden');
      // Pequeño delay para que el CSS tenga tiempo de hacer display:block
      requestAnimationFrame(() => {
        card.classList.remove('fade-out');
      });
    } else {
      // Anima la salida y luego oculta
      card.classList.add('fade-out');
      setTimeout(() => {
        card.classList.add('hidden');
      }, 400); // coincide con la duración de la transición en el CSS
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Quita activo de todos los botones
    filterBtns.forEach(b => b.classList.remove('active'));

    // Activa el botón clickeado
    btn.classList.add('active');

    // Filtra
    const category = btn.getAttribute('data-filter');
    filterProjects(category);
  });
});


/* ============================================================
   2. TRADUCCIONES PARA ESTA PÁGINA
   ============================================================ */

// Extiende las traducciones del main.js con las claves de esta página
const projectsTranslations = {
  es: {
    'projects.label': 'Trabajos',
    'projects.title': 'Proyectos',
    'filter.all':     'All',
    'filter.films':   'Films',
    'filter.series':  'TV Series',
    'filter.other':   'Other Projects',
  },
  en: {
    'projects.label': 'Work',
    'projects.title': 'Projects',
    'filter.all':     'All',
    'filter.films':   'Films',
    'filter.series':  'TV Series',
    'filter.other':   'Other Projects',
  }
};

// Fusiona con las traducciones globales del main.js y las aplica
function mergeAndApply() {
  const lang = localStorage.getItem('mm_lang') || 'es';

  // Agrega las claves de esta página al objeto global si existe
  if (typeof translations !== 'undefined') {
    Object.assign(translations.es, projectsTranslations.es);
    Object.assign(translations.en, projectsTranslations.en);
    applyLanguage(lang);
  }
}

// Espera a que main.js esté listo
window.addEventListener('load', mergeAndApply);


/* ============================================================
   4. SCROLL REVEAL PARA LAS CARDS
   ============================================================ */

function initRevealProjects() {
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

  cards.forEach((card, i) => {
    card.classList.add('reveal');
    // Delay escalonado por columna (cicla de 1 a 4)
    const delay = (i % 4) + 1;
    if (delay <= 6) card.classList.add(`reveal-delay-${delay}`);
    observer.observe(card);
  });
}

initRevealProjects();