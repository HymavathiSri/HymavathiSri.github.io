// NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(7,7,16,0.97)'
    : 'rgba(7,7,16,0.85)';
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));
}
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', () => mobMenu.classList.remove('open'));
});

// Fade-in on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + 'ms';
  obs.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

// Contact form
function sendMsg(e) {
  e.preventDefault();
  const note = document.getElementById('fnote');
  note.textContent = '✓ Thanks! I\'ll get back to you soon.';
  e.target.reset();
  setTimeout(() => { note.textContent = ''; }, 4000);
}
