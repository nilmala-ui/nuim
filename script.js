/* ════════════════════════════════════════════════════
   NuiM Studio — script.js  (Light Theme Redesign)
   Designer: Nil Mala
   ════════════════════════════════════════════════════ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// ── Project Modal Data ──────────────────────────
// Add new projects here by duplicating an entry
const PROJECTS = {
  'nuim-brand': {
    title:  'NuiM — Personal Brand',
    desc:   'Geometric identity, full design system, UI kit and digital applications — built from scratch for the studio.',
    tags:   ['Brand Identity', 'UI Design', 'Design System', '2024'],
    images: [
      { src: 'assets/nuim_stationery.png',      caption: 'Brand Stationery Set' },
      { src: 'assets/nuim_brand_guidelines.png', caption: 'Style Guide & Guidelines' },
      { src: 'assets/nuim_brand_digital.png',    caption: 'Digital & Motion Applications' },
      { src: 'assets/nuim_hero_mockup.png',      caption: 'Device Ecosystem Mockup' },
      { src: 'assets/nuim_workspace.png',        caption: 'Workspace & Process' },
      { src: 'assets/nuim_project_brand.png',    caption: 'Project Brand Visual' },
      { src: 'assets/about_artwork.png',         caption: 'Brand Applied' },
      { src: 'assets/hero_artwork.png',          caption: 'Hero Artwork' },
    ],
  },
};

// ── Project Modal UI ───────────────────────────
(function () {
  const pm       = $('#pm');
  const backdrop = $('#pm-backdrop');
  const closeBtn = $('#pm-close');
  const stageImg = $('#pm-stage-img');
  const prevBtn  = $('#pm-stage-prev');
  const nextBtn  = $('#pm-stage-next');
  const counter  = $('#pm-stage-counter');
  const strip    = $('#pm-strip');
  const titleEl  = $('#pm-title');
  const descEl   = $('#pm-desc');
  const tagsEl   = $('#pm-tags');
  if (!pm) return;

  let images = [], cur = 0;

  function buildStrip(imgs) {
    strip.innerHTML = '';
    imgs.forEach((img, i) => {
      const th = document.createElement('div');
      th.className = 'pm-thumb' + (i === 0 ? ' active' : '');
      th.innerHTML = `<img src="${img.src}" alt="${img.caption || ''}" loading="lazy">`;
      th.addEventListener('click', () => goTo(i));
      strip.appendChild(th);
    });
  }

  function goTo(idx) {
    cur = ((idx % images.length) + images.length) % images.length;
    // Swap stage image
    stageImg.style.animation = 'none';
    stageImg.offsetHeight; // reflow
    stageImg.style.animation = '';
    stageImg.src = images[cur].src;
    stageImg.alt = images[cur].caption || '';
    counter.textContent = `${cur + 1} / ${images.length}`;
    // Update filmstrip
    $$('.pm-thumb').forEach((t, i) => t.classList.toggle('active', i === cur));
    // Scroll active thumb into view
    const active = strip.querySelectorAll('.pm-thumb')[cur];
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function openProject(key) {
    const data = PROJECTS[key];
    if (!data) return;
    images = data.images;
    cur = 0;
    titleEl.textContent = data.title;
    descEl.textContent  = data.desc;
    tagsEl.innerHTML    = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
    buildStrip(images);
    stageImg.src = images[0].src;
    stageImg.alt = images[0].caption || '';
    counter.textContent = `1 / ${images.length}`;
    pm.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    pm.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { stageImg.src = ''; }, 520);
  }

  // Open on work card click
  $$('[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openProject(card.dataset.project));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.project); } });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => goTo(cur - 1));
  nextBtn.addEventListener('click', () => goTo(cur + 1));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!pm.classList.contains('open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goTo(cur - 1);
    if (e.key === 'ArrowRight')  goTo(cur + 1);
  });

  // Touch swipe on stage
  let sx = 0;
  stageImg.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  stageImg.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 44) goTo(dx < 0 ? cur + 1 : cur - 1);
  });
})();

// ── Dark Mode Toggle ──────────────────────────────
(function () {
  const btn = $('#theme-toggle');
  if (!btn) return;
  // Restore saved preference
  if (localStorage.getItem('nuim-theme') === 'dark') {
    document.body.classList.add('dark');
  }
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('nuim-theme', isDark ? 'dark' : 'light');
  });
})();

// ── Nav ────────────────────────────────────────────
(function () {
  const nav    = $('#nav');
  const burger = $('#nav-burger');
  const menu   = $('#mobile-menu');

  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
  nav.classList.toggle('scrolled', scrollY > 40);

  burger.addEventListener('click', () => {
    const o = burger.classList.toggle('open');
    menu.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  $$('.mob-link').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

// ── Hero load animations ───────────────────────────
window.addEventListener('load', () => {
  $$('[data-anim]').forEach(el => el.classList.add('loaded'));
});

// ── Scroll reveal ──────────────────────────────────
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.querySelectorAll('[data-reveal]')];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('vis'), Math.min(idx * 90, 360));
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
})();

// ── Stat counters ──────────────────────────────────
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.textContent.replace(/[\d]/g, '');
      let start = null;
      const tick = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1500, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.stat-n[data-count]').forEach(el => io.observe(el));
})();

// ── Testimonials slider ────────────────────────────
(function () {
  const cards = [document.getElementById('tc-0'), document.getElementById('tc-1'), document.getElementById('tc-2')].filter(Boolean);
  const dots  = $$('.tdot');
  const prev  = $('#test-prev');
  const next  = $('#test-next');
  if (!cards.length) return;

  let cur = 0;
  const go = idx => {
    cards[cur].classList.remove('active');
    dots[cur] && dots[cur].classList.remove('active');
    cur = (idx + cards.length) % cards.length;
    cards[cur].classList.add('active');
    dots[cur] && dots[cur].classList.add('active');
  };

  prev && prev.addEventListener('click', () => go(cur - 1));
  next && next.addEventListener('click', () => go(cur + 1));
  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));

  let t = setInterval(() => go(cur + 1), 6000);
  const sl = $('#test-slider');
  sl && sl.addEventListener('mouseenter', () => clearInterval(t));
  sl && sl.addEventListener('mouseleave', () => { t = setInterval(() => go(cur + 1), 6000); });

  let sx = 0;
  sl && sl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  sl && sl.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? cur + 1 : cur - 1); });
})();

// ── Contact form ───────────────────────────────────
(function () {
  const form = $('#contact-form');
  const sub  = $('#contact-sub');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    sub.textContent = 'Sending…'; sub.disabled = true;
    setTimeout(() => {
      sub.textContent = '✓ Message sent!';
      sub.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      form.reset();
      setTimeout(() => {
        sub.textContent = 'Send message';
        sub.style.background = '';
        sub.disabled = false;
      }, 3500);
    }, 1200);
  });
})();


// ── Smooth anchors ─────────────────────────────────
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href').slice(1);
  const t  = document.getElementById(id);
  if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
}));

// ── Blob parallax ─────────────────────────────────
(function () {
  if (window.matchMedia('(max-width:768px)').matches) return;
  const blobs = $$('.hero .blob');
  window.addEventListener('scroll', () => {
    const y = scrollY;
    blobs.forEach((b, i) => { b.style.transform = `translateY(${y * (0.12 + i * 0.04)}px)`; });
  }, { passive: true });
})();
