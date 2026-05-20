// card hover spotlight
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// nav shadow on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  else nav.style.boxShadow = 'none';
});

// reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .section-header, .about-grid, .contact-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.2,.7,.3,1)';
  io.observe(el);
});

// filter: 체험 가능한 것들만 보기
const filterBtn = document.querySelector('.filter-toggle');
const worksGrid = document.querySelector('.grid');
if (filterBtn && worksGrid) {
  filterBtn.addEventListener('click', () => {
    const pressed = filterBtn.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    filterBtn.setAttribute('aria-pressed', String(next));
    worksGrid.classList.toggle('filter-playable', next);
  });
}
