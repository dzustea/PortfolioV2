/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
if (window.matchMedia('(hover:hover)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .skill-row, .proj-tr').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
}

/* ── NAV SCROLL SHADOW ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('up', window.scrollY > 20);
}, { passive: true });

/* ── NAV ACTIVE ── */
const SEC_IDS = ['home','about','projects','contact'];
const secs    = SEC_IDS.map(id => document.getElementById(id)).filter(Boolean);
const nlinks  = document.querySelectorAll('.nav-center a');

const updateNav = () => {
  const mid = window.scrollY + window.innerHeight * 0.38;
  let active = 'home';
  for (let i = secs.length - 1; i >= 0; i--) {
    if (secs[i].getBoundingClientRect().top + window.scrollY <= mid) {
      active = SEC_IDS[i]; break;
    }
  }
  nlinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + active));
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── REVEAL ON SCROLL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

/* ── FORM ── */
const form = document.getElementById('cform');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name    = document.getElementById('fn').value.trim();
    const email   = document.getElementById('fe').value.trim();
    const message = document.getElementById('fm').value.trim();
    const btn     = document.getElementById('btn-send');
    const btntxt  = document.getElementById('btn-txt');
    const msg     = document.getElementById('fmsg');

    if (!name || !email || !message) {
      msg.textContent = 'Vyplň prosím všechna pole.';
      msg.className = 'form-msg form-err'; return;
    }
    btn.disabled = true; btntxt.textContent = 'Odesílám...';
    msg.textContent = ''; msg.className = 'form-msg';

    try {
      const res = await fetch('https://formspree.io/f/xnjryend', {
        method: 'POST', body: new FormData(this),
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
    btn.disabled = false; btntxt.textContent = 'Odeslat zprávu';
  });
}
