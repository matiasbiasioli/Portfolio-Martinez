/* ============================================================
   BIO PAGE
   js/bio.js
   ============================================================ */


/* ============================================================
   1. TRADUCCIONES
   ============================================================ */

window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('mm_lang') || 'es';
  applyLanguage(savedLang);
});


/* ============================================================
   2. AÑO EN EL FOOTER
   ============================================================ */

const footerYearEl = document.getElementById('footerYear');
if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();