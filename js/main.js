document.addEventListener('DOMContentLoaded', () => {

  // ── Smooth scroll para nav links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Header aparece no scroll ──
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (current > lastScroll && current > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScroll = current;
  });

  // ── Intersection Observer para fade-in ──
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // ── Menu mobile ──
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ── Mouse parallax no hero ──
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  // ── Formulário ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Mensagem enviada ✓';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.opacity = '1';
        form.reset();
      }, 3000);
    });
  }
});
