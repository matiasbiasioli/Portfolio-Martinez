/* ============================================================
   1. NAVEGACIÓN – scroll + hamburger
   ============================================================ */

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Agrega clase .scrolled al nav cuando hay scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Cierra el menú mobile al hacer click en un link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ============================================================
   2. HERO – KEN BURNS SLIDER
   ============================================================ */

const slides      = document.querySelectorAll('.hero__slide');
const slideBgs    = document.querySelectorAll('.hero__slide-bg');
const dots        = document.querySelectorAll('.hero__dot');

let currentSlide  = 0;
let slideInterval = null;
const SLIDE_DURATION = 6000;

if (slides.length > 0) {

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    slideBgs[currentSlide].classList.remove('zoom-in', 'zoom-out');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    const zoomClass = currentSlide % 2 === 0 ? 'zoom-in' : 'zoom-out';
    void slideBgs[currentSlide].offsetWidth;
    slideBgs[currentSlide].classList.add(zoomClass);
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlider() {
    slideBgs[0].classList.add('zoom-in');
    dots[0].classList.add('active');
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideInterval);
    } else {
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }
  });

  startSlider();

} // fin slider


/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */

// Agrega la clase .reveal a los elementos que queremos animar
// y les asigna delays escalonados dentro de cada sección

function initReveal() {
  // Targets: cards de proyectos, items del mosaico, section-headers
  const projectCards = document.querySelectorAll('.project-card');
  const mosaicItems  = document.querySelectorAll('.mosaic__item');
  const sectionHeaders = document.querySelectorAll('.section-header');

  // Section headers
  sectionHeaders.forEach(el => {
    el.classList.add('reveal');
  });

  // Cards de proyectos con delay escalonado
  projectCards.forEach((card, i) => {
    card.classList.add('reveal');
    const delay = (i % 3) + 1; // cicla 1-2-3 por fila
    card.classList.add(`reveal-delay-${delay}`);
  });

  // Items del mosaico con delay escalonado
  mosaicItems.forEach((item, i) => {
    item.classList.add('reveal');
    const delay = (i % 4) + 1; // cicla 1-2-3-4 por fila
    if (delay <= 6) item.classList.add(`reveal-delay-${delay}`);
  });
}

// Observer que activa .visible cuando el elemento entra en viewport
function createObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // solo una vez
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

initReveal();
createObserver();


/* ============================================================
   4. TOGGLE DE IDIOMA – ES / EN
   ============================================================ */

const translations = {
  es: {
    'nav.name':      'Matías Martinez',
    'nav.projects':  'Proyectos',
    'nav.bio':       'Biografía',
    'nav.contact':   'Contacto',

    'hero.label':    'Director de Arte',
    'hero.tagline':  'Cine · Series · Publicidad',
    'hero.scroll':   'Scroll',

    'projects.title': 'Proyectos',
    'projects.view':  'Ver proyecto',
    'projects.all':   'Ver todos los proyectos',

    'mosaic.title':  'Fotografía de Escenas',

    'movie.director': 'Director',
'movie.año':      'Año',
'movie.rol':      'Rol',
'movie.scenes':   'Fotografía de Escenas',
'movie.wip':      'Work in Progress',
'movie.back':     'Volver a proyectos',
'movie.expand':   'Ver en pantalla completa',
    // dentro de es:
'filter.all':     'Todo',
'filter.films':   'Películas',
'filter.series':  'Series',
'filter.other':   'Otros proyectos',

  },
  en: {
    'nav.name':      'Matías Martinez',
    'nav.projects':  'Projects',
    'nav.bio':       'Biography',
    'nav.contact':   'Contact',

    'hero.label':    'Art Director',
    'hero.tagline':  'Film · Series · Commercials',
    'hero.scroll':   'Scroll',

    'projects.title': 'Projects',
    'projects.view':  'View project',
    'projects.all':   'View all projects',

    'mosaic.title':  'Scene Photography',

    'movie.director': 'Director',
    
'movie.año':      'Year',
'movie.rol':      'Role',
'movie.scenes':   'Scene Photography',
'movie.wip':      'Work in Progress',
'movie.back':     'Back to projects',
'movie.expand':   'Full screen',
    // dentro de en:
'filter.all':     'All',
'filter.films':   'Films',
'filter.series':  'TV Series',
'filter.other':   'Other Projects',
  }
};

let currentLang = 'es';

const langOptions = document.querySelectorAll('.lang-toggle__option');

function applyLanguage(lang) {
  const t = translations[lang];

  // Actualiza todos los elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Actualiza atributo lang del HTML
  document.documentElement.lang = lang;

  // Actualiza botones activos
  langOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  currentLang = lang;

  // Guarda preferencia en localStorage
  localStorage.setItem('mm_lang', lang);
}

// Click en cada opción del toggle
langOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const lang = opt.dataset.lang;
    if (lang !== currentLang) applyLanguage(lang);
  });
});

// Al cargar, aplica el idioma guardado (o español por defecto)
const savedLang = localStorage.getItem('mm_lang') || 'es';
applyLanguage(savedLang);


/* ============================================================
   5. SMOOTH SCROLL para links del nav
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


// Año automático en el footer
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ============================================================
  7. HOME – PELÍCULAS DESTACADAS
   ============================================================ */

async function loadHomeProjects() {
  const grid = document.getElementById('homeProjectsGrid');
  if (!grid) return;

  try {
    const response = await fetch('data/movies.json');
    const movies = await response.json();

    // Filtra solo las destacadas
    const destacadas = movies.filter(m => m.destacada === true).slice(0, 4);

    destacadas.forEach(movie => {
      const article = document.createElement('article');
      article.className = 'project-card reveal';

      article.innerHTML = `
        <a href="moviesDetails.html?id=${movie.id}" class="project-card__link">
          <div class="project-card__img-wrap">
            <img
              src="${movie.poster}"
              alt="${movie.titulo}"
              loading="lazy"
              class="project-card__img"
              onerror="this.style.background='#1e1e1e'"
            />
          </div>
          <div class="project-card__info">
            <h3 class="project-card__title">${movie.titulo}</h3>
            <p class="project-card__meta">${movie.categoria} · ${movie.año}</p>
          </div>
        </a>
      `;

      grid.appendChild(article);
    });

    // Activa scroll reveal en las cards nuevas
    createObserver();

  } catch (error) {
    console.error('Error cargando proyectos destacados:', error);
  }
}

loadHomeProjects();
