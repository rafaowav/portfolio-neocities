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

  // ── parallax, luz e cursor do hero ──
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    let raf = null;
    let mx = 0;
    let my = 0;
    let px = 50;
    let py = 42;
    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;

    const render = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;

      hero.style.setProperty('--mx', mx.toFixed(2) + 'px');
      hero.style.setProperty('--my', my.toFixed(2) + 'px');
      hero.style.setProperty('--px', px.toFixed(2) + '%');
      hero.style.setProperty('--py', py.toFixed(2) + '%');
      hero.style.setProperty('--cx', cx.toFixed(1) + 'px');
      hero.style.setProperty('--cy', cy.toFixed(1) + 'px');

      raf = Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4
        ? requestAnimationFrame(render)
        : null;
    };

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      px = (tx / rect.width) * 100;
      py = (ty / rect.height) * 100;
      mx = (tx / rect.width - 0.5) * 30;
      my = (ty / rect.height - 0.5) * 30;
      if (!raf) raf = requestAnimationFrame(render);
    });

    hero.addEventListener('mouseleave', () => {
      mx = 0;
      my = 0;
      px = 50;
      py = 42;
      tx = -100;
      ty = -100;
      if (!raf) raf = requestAnimationFrame(render);
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