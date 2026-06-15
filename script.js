/* ── CURSOR ── */
const cur = document.getElementById('cur');
if (window.matchMedia('(hover:hover)').matches) {
  let cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
  });
  document.querySelectorAll('a, button, .skill-item, .proj-row').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}

/* ── HEADER ── */
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── NAV ACTIVE ── */
const sections   = ['home','about','projects','contact'].map(id => document.getElementById(id)).filter(Boolean);
const sectionIds = ['home','about','projects','contact'];
const navLinks   = document.querySelectorAll('nav a');

const updateNav = () => {
  const y = window.scrollY + window.innerHeight * 0.4;
  let current = 'home';
  for (let i = sections.length - 1; i >= 0; i--) {
    if (sections[i] && sections[i].getBoundingClientRect().top + window.scrollY <= y) {
      current = sectionIds[i]; break;
    }
  }
  navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.classList.contains('reveal-up')) {
      el.classList.add('in');
    } else if (el.classList.contains('reveal-line')) {
      el.classList.add('in');
    }
    ro.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-line').forEach(el => ro.observe(el));

/* ── FORM ── */
const formEl = document.getElementById('contact-form');
if (formEl) {
  formEl.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name    = document.getElementById('fn').value.trim();
    const email   = document.getElementById('fe').value.trim();
    const message = document.getElementById('fm').value.trim();
    const btn     = document.getElementById('btn-send');
    const msg     = document.getElementById('form-msg');

    if (!name || !email || !message) {
      msg.textContent = 'Vyplň prosím všechna pole.';
      msg.className = 'form-msg form-err'; return;
    }

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Odesílám...';
    msg.textContent = ''; msg.className = 'form-msg';

    const formData = new FormData(this);
    try {
      const res  = await fetch('https://formspree.io/f/xnjryend', {
        method: 'POST', body: formData,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        msg.textContent = '✓ Zpráva odeslána! Ozvu se co nejdřív.';
        msg.className = 'form-msg form-ok';
        this.reset();
      } else throw new Error();
    } catch {
      msg.textContent = 'Nepodařilo se odeslat. Napiš přímo na filda.lochman12@gmail.com';
      msg.className = 'form-msg form-err';
    }

    btn.disabled = false;
    btn.querySelector('span').textContent = 'Odeslat zprávu';
  });
}
