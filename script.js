/* ── NAV ── */
const nav  = document.getElementById('nav');
const sIds = ['home','about','projects','contact'];
const sEls = sIds.map(id => document.getElementById(id)).filter(Boolean);
const nls  = document.querySelectorAll('.nav-links a');

const tick = () => {
  nav.classList.toggle('solid', scrollY > 30);
  const mid = scrollY + innerHeight * .38;
  let cur = 'home';
  for (let i = sEls.length - 1; i >= 0; i--)
    if (sEls[i].getBoundingClientRect().top + scrollY <= mid) { cur = sIds[i]; break; }
  nls.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
};
addEventListener('scroll', tick, { passive: true });
tick();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  })
);

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

/* ── FORM ── */
const form = document.getElementById('cform');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const n  = document.getElementById('fn').value.trim();
    const em = document.getElementById('fe').value.trim();
    const m  = document.getElementById('fm').value.trim();
    const btn = document.getElementById('btn-send');
    const txt = document.getElementById('btn-txt');
    const msg = document.getElementById('fmsg');
    if (!n || !em || !m) {
      msg.textContent = 'Vyplň prosím všechna pole.';
      msg.className = 'form-msg form-err'; return;
    }
    btn.disabled = true; txt.textContent = 'Odesílám...';
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
    btn.disabled = false; txt.textContent = 'Odeslat zprávu';
  });
}
