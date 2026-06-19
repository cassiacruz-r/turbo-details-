/* ============================================
   TURBO DETAILS — main.js
   ============================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5573999737318';

  function waLink(message) {
    const text = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 12) header.style.background = 'rgba(10, 5, 24, 0.85)';
    else header.style.background = 'rgba(10, 5, 24, 0.55)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--mobile-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--mobile-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-item__q');
    const a = item.querySelector('.faq-item__a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Pricing tabs ---------- */
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(tab.dataset.target).classList.add('is-active');
    });
  });

  /* ---------- Before / After slider ---------- */
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const beforeWrap = slider.querySelector('.ba-slider__before-wrap');
    const handle = slider.querySelector('.ba-slider__handle');
    let dragging = false;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let x = ((clientX - rect.left) / rect.width) * 100;
      x = Math.max(0, Math.min(100, x));
      beforeWrap.style.width = x + '%';
      handle.style.left = x + '%';
    }

    slider.addEventListener('mousedown', (e) => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    slider.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchend', () => { dragging = false; });
  });

  /* ---------- Reviews carousel nav ---------- */
  const track = document.querySelector('.reviews-track');
  const prevBtn = document.querySelector('[data-review-prev]');
  const nextBtn = document.querySelector('[data-review-next]');
  if (track && prevBtn && nextBtn) {
    const scrollAmount = () => track.querySelector('.review-card').offsetWidth + 21;
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }

  /* ---------- Full price table modal ---------- */
  const modal = document.getElementById('full-table-modal');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  openModalBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  if (modal) {
    modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- WhatsApp dynamic links ---------- */
  document.querySelectorAll('[data-wa-service]').forEach((el) => {
    const service = el.getAttribute('data-wa-service');
    const message = `Olá! Vim pelo site e gostaria de saber mais sobre o serviço: ${service}.`;
    el.setAttribute('href', waLink(message));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-wa-generic]').forEach((el) => {
    el.setAttribute('href', waLink('Olá! Vim pelo site da Turbo Details e gostaria de fazer um orçamento.'));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ---------- Quick quote form ---------- */
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector('#q-name').value.trim();
      const vehicle = quoteForm.querySelector('#q-vehicle').value.trim();
      const service = quoteForm.querySelector('#q-service').value;
      const note = quoteForm.querySelector('#q-note').value.trim();

      let message = `Olá! Meu nome é ${name || '___'}.\n`;
      message += `Veículo: ${vehicle || '___'}\n`;
      message += `Serviço de interesse: ${service || 'a combinar'}\n`;
      if (note) message += `Observações: ${note}\n`;
      message += `\nGostaria de solicitar um orçamento.`;

      window.open(waLink(message), '_blank', 'noopener');
    });
  }

  /* ---------- Current year in footer ---------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Image fallback (graceful degrade if external photos fail) ---------- */
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const parent = img.parentElement;
      if (parent && !parent.querySelector('.img-fallback-icon')) {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback-icon';
        fallback.innerHTML = `<svg viewBox="0 0 100 100" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 62 C 30 35, 55 25, 75 32 L 60 38 C 48 36, 35 44, 28 58 Z" fill="#E1FF2D" opacity="0.85"/>
          <path d="M58 40 L 72 40 L 58 58 L 68 58 L 50 80 L 56 60 L 46 60 Z" fill="#fff" opacity="0.9"/>
        </svg>`;
        fallback.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg, rgba(131,55,252,0.5), rgba(10,5,24,0.85));';
        if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
        parent.appendChild(fallback);
      }
    }, { once: true });
  });

  /* ---------- Highlight "today" in hours table ---------- */
  const dayRows = document.querySelectorAll('[data-day]');
  if (dayRows.length) {
    const todayIndex = new Date().getDay(); // 0 = Sunday
    dayRows.forEach((row) => {
      if (parseInt(row.getAttribute('data-day'), 10) === todayIndex) {
        row.classList.add('is-today');
      }
    });
  }
})();
