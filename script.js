(function () {
  'use strict';

  const BASE_PRICE = 600;
  const brl = (n) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  /* ---------- Topbar: sombra ao rolar ---------- */
  const topbar = document.getElementById('topbar');
  const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Link ativo conforme a seção ---------- */
  const links = [...nav.querySelectorAll('a')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Animação de entrada ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Calculadora de investimento ---------- */
  const optDominio = document.getElementById('optDominio');
  const totalEl = document.getElementById('total');
  const noteEl = document.getElementById('totalNote');
  const avistaEl = document.getElementById('payAvista');
  const parceladoEl = document.getElementById('payParcelado');

  function animateValue(el, from, to) {
    const duration = 400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = brl(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  let current = BASE_PRICE;
  function update() {
    const extra = optDominio.checked ? Number(optDominio.dataset.price) : 0;
    const total = BASE_PRICE + extra;

    animateValue(totalEl, current, total);
    current = total;

    noteEl.textContent = extra
      ? 'Incluindo o domínio (.com.br) no 1º ano.'
      : 'Sem incluir os itens opcionais.';

    avistaEl.textContent = brl(total * 0.95);
    parceladoEl.textContent = '2 × ' + brl(total / 2);
  }
  optDominio.addEventListener('change', update);

  /* ---------- Rodapé ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
