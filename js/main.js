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

  // ── parallax do hero (imagem + geometria) ──
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    let raf = null;
    let mx = 0;
    let my = 0;

    const apply = () => {
      hero.style.setProperty('--mx', mx.toFixed(2) + 'px');
      hero.style.setProperty('--my', my.toFixed(2) + 'px');
      raf = null;
    };

    hero.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 26;
      my = (e.clientY / window.innerHeight - 0.5) * 26;
      if (!raf) raf = requestAnimationFrame(apply);
    });

    hero.addEventListener('mouseleave', () => {
      mx = 0;
      my = 0;
      if (!raf) raf = requestAnimationFrame(apply);
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