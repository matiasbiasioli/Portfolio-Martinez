/* ============================================================
   PROJECTS PAGE
   js/projects.js
   ============================================================ */


/* ============================================================
   1. CARGAR PELÍCULAS DESDE EL JSON
   ============================================================ */

async function loadProjects() {
  try {
    const response = await fetch('data/movies.json');
    const movies = await response.json();
    renderProjects(movies);
    initFilters();
    initRevealProjects();
  } catch (error) {
    console.error('Error cargando movies.json:', error);
  }
}


/* ============================================================
   2. RENDERIZAR CARDS DINÁMICAMENTE
   ============================================================ */

function renderProjects(movies) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  movies.forEach(movie => {
    const article = document.createElement('article');
    article.className = 'pcard';
    article.setAttribute('data-category', getCategorySlug(movie.categoria));

    article.innerHTML = `
      <a href="moviesDetails.html?id=${movie.id}" class="pcard__link">
        <div class="pcard__img-wrap">
          <img
            src="${movie.poster}"
            alt="${movie.titulo}"
            loading="lazy"
            onerror="this.style.background='#1e1e1e'; this.style.display='block';"
          />
          <div class="pcard__info">
            <h3 class="pcard__title">${movie.titulo}</h3>
            <p class="pcard__meta">${movie.categoria} · ${movie.año}</p>
          </div>
        </div>
      </a>
    `;

    grid.appendChild(article);
  });
}

function getCategorySlug(categoria) {
  const map = {
    'Film': 'film',
    'TV Series': 'tv-series',
    'Other': 'other'
  };
  return map[categoria] || 'other';
}


/* ============================================================
   3. FILTROS
   ============================================================ */

function initFilters() {
  const filterBtns = document.querySelectorAll('.filters__btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      filterProjects(category);
    });
  });
}

function filterProjects(category) {
  const cards = document.querySelectorAll('.pcard');

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const match = category === 'all' || cardCategory === category;

    if (match) {
      card.classList.remove('hidden');
      requestAnimationFrame(() => {
        card.classList.remove('fade-out');
      });
    } else {
      card.classList.add('fade-out');
      setTimeout(() => {
        card.classList.add('hidden');
      }, 400);
    }
  });
}


/* ============================================================
   4. SCROLL REVEAL
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

  document.querySelectorAll('.pcard').forEach((card, i) => {
    card.classList.add('reveal');
    const delay = (i % 4) + 1;
    if (delay <= 6) card.classList.add(`reveal-delay-${delay}`);
    observer.observe(card);
  });
}


/* ============================================================
   5. TRADUCCIONES
   ============================================================ */

window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('mm_lang') || 'es';
  applyLanguage(savedLang);
});


/* ============================================================
   6. INICIO
   ============================================================ */

loadProjects();