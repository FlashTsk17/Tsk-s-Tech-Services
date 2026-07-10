/* ═══════════════════════════════════════
   TSK'S TECH SERVICES — GLOBAL JS
   Tout ce qui suit est un ENHANCEMENT.
   Le site fonctionne sans JS (thème clair par défaut,
   menu mobile en CSS pur, textes FR déjà dans le HTML).
═══════════════════════════════════════ */

// Signale que JS est actif : active les animations .reveal (voir global.css)
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {

  /* ── THÈME CLAIR / SOMBRE ── */
  const themeKey = 'tsk_theme';
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem(themeKey, 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem(themeKey, 'dark');
      }
    });
  });

  /* ── NAV SCROLL STATE ── */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MENU MOBILE : fermeture au clic d'un lien (le CSS gère l'ouverture) ── */
  const navToggleInput = document.getElementById('nav-toggle');
  document.querySelectorAll('.nav-drawer a, .nav-drawer-scrim').forEach(el => {
    el.addEventListener('click', () => { if (navToggleInput) navToggleInput.checked = false; });
  });

  /* ── LANGUE FR / EN ── */
  const langKey = 'tsk_lang';
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem(langKey) || 'fr';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(langKey, lang);
    document.documentElement.lang = lang;
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.querySelectorAll('[data-fr], [data-en]').forEach(el => {
      const text = el.dataset[lang];
      if (text !== undefined) el.textContent = text;
    });
    document.querySelectorAll('[data-fr-placeholder], [data-en-placeholder]').forEach(el => {
      const ph = el.dataset[lang + 'Placeholder'];
      if (ph !== undefined) el.placeholder = ph;
    });
  }
  langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(currentLang);

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── BOUTON RETOUR EN HAUT ── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? window.scrollY / scrollable : 0;
      backToTop.classList.toggle('visible', percent > 0.66);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── COMPTEURS ANIMÉS ── */
  function animCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); counterObserver.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

});
