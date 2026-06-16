/* ═══════════════════════════════════════
   FILIP LOCHMAN · script.js
   Nav · Smooth scroll · Reveal · Accordion · Form
═══════════════════════════════════════ */

/* ── NAV ── */
const hdr     = document.getElementById('hdr');
const secIds  = ['hero','expertise','projects','contact'];
const secs    = secIds.map(id => document.getElementById(id)).filter(Boolean);
const navLinks= document.querySelectorAll('nav a');

const updateNav = () => {
  hdr.classList.toggle('solid', window.scrollY > 30);
  const mid = window.scrollY + window.innerHeight * 0.38;
  let active = 'hero';
  for (let i = secs.length - 1; i >= 0; i--) {
    if (secs[i].getBoundingClientRect().top + window.scrollY <= mid) {
      active = secIds[i]; break;
    }
  }
  navLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + active)
  );
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

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      ro.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

/* ── PROJECT ACCORDION ── */
document.querySelectorAll('.prow:not(.prow-wip)').forEach(row => {
  const trigger = row.querySelector('.pt');
  if (!trigger) return;

  trigger.addEventListener('click', () => {
    const isOpen = row.classList.contains('open');

    // close all others
    document.querySelectorAll('.prow.open').forEach(r => {
      if (r !== row) {
        r.classList.remove('open');
        r.querySelector('.pt')?.setAttribute('aria-expanded', 'false');
      }
    });

    // toggle this one
    row.classList.toggle('open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ── FORM ── */
const form = document.getElementById('cform');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name    = document.getElementById('fn').value.trim();
    const email   = document.getElementById('fe').value.trim();
    const message = document.getElementById('fm').value.trim();
    const btn     = document.getElementById('btn-send');
    const bTxt    = document.getElementById('btn-txt');
    const msg     = document.getElementById('fmsg');

    if (!name || !email || !message) {
      msg.textContent = 'Vyplň prosím všechna pole.';
      msg.className   = 'form-feedback form-err';
      return;
    }

    btn.disabled = true;
    bTxt.textContent = 'Odesílám...';
    msg.textContent  = '';
    msg.className    = 'form-feedback';

    try {
      const res = await fetch('https://formspree.io/f/xnjryend', {
        method: 'POST',
        body:    new FormData(this),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        msg.textContent = '✓ Zpráva odeslána. Ozvu se co nejdřív.';
        msg.className   = 'form-feedback form-ok';
        this.reset();
      } else {
        throw new Error();
      }
    } catch {
      msg.textContent = 'Odesílání selhalo. Napiš přímo na filda.lochman12@gmail.com';
      msg.className   = 'form-feedback form-err';
    }

    btn.disabled     = false;
    bTxt.textContent = 'Odeslat zprávu';
  });
}
