/* ── NAVIGACE & DETEKCE AKTIVNÍ SEKCE ── */
const nav = document.getElementById("navigace");
const sekceIds = ["home", "about", "projects", "contact"];
const sekce = sekceIds.map(function(id) { return document.getElementById(id); }).filter(Boolean);
const navLinks = document.querySelectorAll(".nav-links a");

const updateNav = () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
  let current = "home";
  
  // U sticky vrstev zjišťujeme aktivní sekci pomocí getBoundingClientRect,
  // protože offsetTop se u překrývaných elementů chová nepředvídatelně.
  sekce.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= 150) {
      current = sekceIds[index];
    }
  });

  navLinks.forEach(function(a) {
    a.classList.toggle("on", a.dataset.sekce === current);
  });
};

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();


/* ── SMOOTH SCROLL PRO STICKY VRSTVY ──
   scrollIntoView nefunguje se position:sticky vrstvami — prohlížeč
   nedokáže určit správnou cílovou pozici překrytého elementu.
   Řešení: každá vrstva má výšku 100vh, takže cílová Y pozice je
   přesně (index vrstvy) × výška okna. Při resize se přepočítá. */
const layerIds = ["home", "about", "projects", "contact"];

function getTargetY(id) {
  const idx = layerIds.indexOf(id);
  if (idx === -1) return null;
  return idx * window.innerHeight;
}

document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener("click", function(e) {
    const id = a.getAttribute("href").slice(1);
    const targetY = getTargetY(id);
    if (targetY === null) return;
    e.preventDefault();
    window.scrollTo({ top: targetY, behavior: "smooth" });
  });
});


/* ── REVEAL ANIMACE ── */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting)
        setTimeout(() => e.target.classList.add("v"), i * 90);
    });
  },
  { threshold: 0.07 },
);
document.querySelectorAll(".r").forEach((el) => revObs.observe(el));


/* ── KONTAKTNÍ FORMULÁŘ (UPRAVENO PRO FORMSPREE) ── */
document
  .getElementById("kontaktni-formular")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const name = document.getElementById("fn").value.trim();
    const email = document.getElementById("fe").value.trim();
    const message = document.getElementById("fm").value.trim();
    const btn = document.getElementById("btn-odeslat");
    const info = document.getElementById("form-zprava");

    if (!name || !email || !message) {
      info.textContent = "Vyplň prosím všechna pole.";
      info.className = "form-zprava form-err";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Odesílám...";
    info.textContent = "";
    info.className = "form-zprava";

    // Vytvoříme FormData přímo z formuláře — to Formspree vyžaduje
    const formData = new FormData(this);

    try {
      const res = await fetch("https://formspree.io/f/xnjryend", {
        method: "POST",
        body: formData,
        headers: { 
          'Accept': 'application/json' 
        },
      });
      
      if (res.ok) {
        info.textContent = "✓ Zpráva odeslána! Ozvu se co nejdřív.";
        info.className = "form-zprava form-ok";
        this.reset();
      } else {
        throw new Error("Nepodařilo se odeslat.");
      }
    } catch (err) {
      info.textContent = "Nepodařilo se odeslat. Napiš přímo na filda.lochman12@gmail.com";
      info.className = "form-zprava form-err";
    }

    btn.disabled = false;
    btn.innerHTML =
      '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Odeslat zprávu';
  });


/* ══════════════════════════════════════════════
   BACKGROUND CANVAS (Plasma / Lava lamp)
══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("bgc");
  const ctx = canvas.getContext("2d");
  let W, H, t = 0;
  const mouse = { x: 0.5, y: 0.5 };

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / W;
    mouse.y = e.clientY / H;
  });

  const balls = [
    { ax: 0.38, ay: 0.42, fx: 0.00031, fy: 0.00028, px: 0, py: 1.2, r: 0.38, col: [212, 140, 38], a: 0.13 },
    { ax: 0.28, ay: 0.32, fx: 0.00023, fy: 0.00041, px: 2.1, py: 0.8, r: 0.28, col: [170, 95, 18], a: 0.1 },
    { ax: 0.22, ay: 0.25, fx: 0.00041, fy: 0.00019, px: 4.4, py: 3.3, r: 0.22, col: [255, 175, 55], a: 0.09 },
    { ax: 0.18, ay: 0.2, fx: 0.00052, fy: 0.00035, px: 1.7, py: 5.1, r: 0.18, col: [195, 110, 25], a: 0.07 },
    { ax: 0.15, ay: 0.18, fx: 0.00029, fy: 0.00057, px: 3.8, py: 2.6, r: 0.15, col: [240, 160, 48], a: 0.06 }
  ];

  const rays = [
    { phase: 0, speed: 0.00018, angle: -0.38, width: 0.1, a: 0.022 },
    { phase: 2.2, speed: 0.00012, angle: -0.28, width: 0.07, a: 0.015 },
    { phase: 4.8, speed: 0.00025, angle: -0.48, width: 0.05, a: 0.012 }
  ];

  let noiseCanvas, noiseCtx;
  function buildNoise() {
    noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    noiseCtx = noiseCanvas.getContext("2d");
    const id = noiseCtx.createImageData(256, 256);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = (Math.random() * 12) | 0;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 255;
    }
    noiseCtx.putImageData(id, 0, 0);
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNoise();
  }
  window.addEventListener("resize", resize);

  function ballPos(b) {
    const mx = (mouse.x - 0.5) * 0.06;
    const my = (mouse.y - 0.5) * 0.06;
    const x = (0.5 + b.ax * Math.sin(t * b.fx + b.px) + mx) * W;
    const y = (0.5 + b.ay * Math.cos(t * b.fy + b.py) + my) * H;
    return { x, y };
  }

  function drawBall(b) {
    const { x, y } = ballPos(b);
    const breathe = 1 + 0.12 * Math.sin(t * 0.0007 + b.px);
    const rx = b.r * breathe * Math.max(W, H);
    const ry = rx * (0.62 + 0.12 * Math.cos(t * 0.0005 + b.py));

    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, `rgba(${b.col.join(",")},${b.a})`);
    g.addColorStop(0.45, `rgba(${b.col.join(",")},${b.a * 0.55})`);
    g.addColorStop(1, `rgba(${b.col.join(",")},0)`);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x, y, rx, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  function drawRay(ray) {
    ray.phase += ray.speed;
    const xCenter = (0.5 + 0.7 * Math.sin(ray.phase)) * W;
    const halfW = ray.width * W;
    const angle = ray.angle;

    ctx.save();
    ctx.translate(xCenter, 0);
    ctx.rotate(angle);

    const g = ctx.createLinearGradient(-halfW, 0, halfW, 0);
    g.addColorStop(0, "rgba(212,146,42,0)");
    g.addColorStop(0.5, `rgba(230,158,45,${ray.a})`);
    g.addColorStop(1, "rgba(212,146,42,0)");

    ctx.fillStyle = g;
    ctx.fillRect(-halfW, -H * 1.5, halfW * 2, H * 3);
    ctx.restore();
  }

  function drawNoise() {
    ctx.globalAlpha = 0.018;
    ctx.globalCompositeOperation = "overlay";
    for (let x = 0; x < W; x += 256)
      for (let y = 0; y < H; y += 256) ctx.drawImage(noiseCanvas, x, y);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    balls.forEach((b) => { drawBall(b); });

    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const pi = ballPos(balls[i]);
        const pj = ballPos(balls[j]);
        const dx = pi.x - pj.x, dy = pi.y - pj.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const threshold = Math.max(W, H) * 0.45;
        if (d > threshold) continue;

        const strength = (1 - d / threshold) * 0.04;
        const g = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
        const ci = balls[i].col, cj = balls[j].col;
        g.addColorStop(0, `rgba(${ci.join(",")},${strength})`);
        g.addColorStop(0.5, `rgba(${Math.round((ci[0] + cj[0]) / 2)},${Math.round((ci[1] + cj[1]) / 2)},${Math.round((ci[2] + cj[2]) / 2)},${strength * 0.6})`);
        g.addColorStop(1, `rgba(${cj.join(",")},${strength})`);

        ctx.beginPath();
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(W, H) * 0.18 * (1 - d / threshold);
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = "screen";
    rays.forEach(drawRay);
    ctx.globalCompositeOperation = "source-over";

    drawNoise();
    drawVignette();

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();
