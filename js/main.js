/* ============================================================
   TURBO DETAILS v3 — main.js
   ============================================================ */

const WA = '5573999737318';
const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_DEFAULT = 'Olá! Gostaria de saber mais sobre os serviços da Turbo Details.';

/* ─── WA links ─── */
document.querySelectorAll('[data-wa]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const svc = el.dataset.wa;
    const msg = svc === 'generic'
      ? WA_DEFAULT
      : `Olá! Tenho interesse no serviço: *${svc}*. Poderia me informar mais?`;
    window.open(waUrl(msg), '_blank');
  });
});

/* ─── STATUS ABERTO / FECHADO ─── */
function checkStatus() {
  const now   = new Date();
  const day   = now.getDay();   // 0=dom,1=seg...6=sáb
  const hour  = now.getHours();
  const min   = now.getMinutes();
  const time  = hour + min / 60;

  // Aberto: Seg(1)–Sáb(6), 8h–18h
  const isOpen = day >= 1 && day <= 6 && time >= 8 && time < 18;

  const badge = document.getElementById('status-badge');
  const bannerBadge = document.getElementById('status-banner-badge');
  const bannerText  = document.getElementById('status-banner-text');

  const openHTML  = '<span class="status-dot"></span>Aberto agora';
  const closeHTML = '<span class="status-dot"></span>Fechado no momento';

  const openNote  = 'Atendemos seg–sáb, das 8h às 18h.';
  const closeNote = day === 0
    ? 'Hoje é domingo — retornamos na segunda às 8h.'
    : time < 8
      ? 'Ainda não abrimos hoje — voltamos às 8h.'
      : 'Fechamos às 18h — retornamos amanhã às 8h.';

  if (badge) {
    badge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    badge.innerHTML = isOpen ? openHTML : closeHTML;
  }
  if (bannerBadge) {
    bannerBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    bannerBadge.innerHTML = isOpen ? openHTML : closeHTML;
  }
  if (bannerText) bannerText.textContent = isOpen ? openNote : closeNote;

  // Highlight dia de hoje na tabela
  document.querySelectorAll(`.hours-row[data-day="${day}"]`).forEach(tr => tr.classList.add('today'));
}

checkStatus();
setInterval(checkStatus, 60000); // atualiza a cada minuto

/* ─── Nav mobile ─── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger?.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navMobile?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ─── Price tabs ─── */
document.querySelectorAll('.price-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.price-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel)?.classList.add('active');
  });
});

/* ─── Modal ─── */
const modal = document.getElementById('modal');
document.querySelectorAll('[data-open-modal]').forEach(b => {
  b.addEventListener('click', () => { modal?.classList.add('open'); document.body.style.overflow='hidden'; });
});
document.querySelectorAll('[data-close-modal]').forEach(b => {
  b.addEventListener('click', () => { modal?.classList.remove('open'); document.body.style.overflow=''; });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { modal?.classList.remove('open'); document.body.style.overflow=''; }
});

/* ─── FAQ ─── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── Reviews carousel ─── */
const track = document.querySelector('.reviews-scroll');
if (track) {
  const cardW = () => (track.querySelector('.review-card')?.offsetWidth || 280) + 16;
  document.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -cardW(), behavior: 'smooth' }));
  document.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left:  cardW(), behavior: 'smooth' }));
}

/* ─── Quote form ─── */
document.getElementById('quote-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('q-name')?.value?.trim()    || '';
  const vehicle = document.getElementById('q-vehicle')?.value?.trim() || '';
  const service = document.getElementById('q-service')?.value         || 'Não especificado';
  const note    = document.getElementById('q-note')?.value?.trim()    || '';
  let msg = `Olá! Gostaria de um orçamento:\n\n*Nome:* ${name}\n*Veículo:* ${vehicle}\n*Serviço:* ${service}`;
  if (note) msg += `\n*Obs:* ${note}`;
  window.open(waUrl(msg), '_blank');
});

/* ─── Scroll reveal ─── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .stagger').forEach(el => obs.observe(el));

/* ─── Footer year ─── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
