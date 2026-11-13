document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── smooth scroll (apenas âncoras da mesma página) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ── header no scroll ──
  const header = document.querySelector('.site-header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.pageYOffset > 80);
    }, { passive: true });
  }

  // ── reveal ao entrar na viewport ──
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ── menu mobile ──
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    const setMenu = open => {
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('locked', open);
    };

    menuToggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  // ── parallax e luz do hero ──
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    let raf = null;
    let mx = 0;
    let my = 0;
    let px = 50;
    let py = 42;

    const render = () => {
      hero.style.setProperty('--mx', mx.toFixed(2) + 'px');
      hero.style.setProperty('--my', my.toFixed(2) + 'px');
      hero.style.setProperty('--px', px.toFixed(2) + '%');
      hero.style.setProperty('--py', py.toFixed(2) + '%');
      raf = null;
    };

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      px = (x / rect.width) * 100;
      py = (y / rect.height) * 100;
      mx = (x / rect.width - 0.5) * 30;
      my = (y / rect.height - 0.5) * 30;
      if (!raf) raf = requestAnimationFrame(render);
    });

    hero.addEventListener('mouseleave', () => {
      mx = 0;
      my = 0;
      px = 50;
      py = 42;
      if (!raf) raf = requestAnimationFrame(render);
    });
  }

  // ── cursor global ──
  const cursor = document.querySelector('.page-cursor');
  if (cursor && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    let raf = null;
    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;

    const renderCursor = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform =
        `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(var(--cs,1))`;
      raf = Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5
        ? requestAnimationFrame(renderCursor)
        : null;
    };

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add('is-on');
      cursor.classList.toggle('on-link', Boolean(e.target.closest('a, button')));
      if (!raf) raf = requestAnimationFrame(renderCursor);
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-on');
      tx = -100;
      ty = -100;
      if (!raf) raf = requestAnimationFrame(renderCursor);
    });
  }

  // ── nav ativa conforme a seção ──
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spy.observe(section));
  }
});