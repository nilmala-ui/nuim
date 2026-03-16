/* ════════════════════════════════════════════════════
   NuiM Studio — script.js  (Light Theme Redesign)
   Designer: Nil Mala
   ════════════════════════════════════════════════════ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// ── Custom Cursor ──────────────────────────────────
(function () {
  const dot  = $('#cursor');
  const ring = $('#cursor-ring');
  if (!dot || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function follow() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();

  $$('a,button,[tabindex],.wcard').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-over'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-over'));
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

// ── Work card tilt ─────────────────────────────────
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  $$('.wcard').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      c.style.transform = `translateY(-6px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
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
