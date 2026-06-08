(function () {
  'use strict';

  const hero = document.getElementById('home');
  const glow = document.getElementById('cursorGlow');
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');

  if (!hero || !canvas) return;

  /* ─── Measurements ─── */
  let W, H;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mx = W / 2, my = H / 2;
  let tmx = mx, tmy = my;

  function resize() {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ─── Mouse ─── */
  document.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tmx = e.clientX - r.left;
    tmy = e.clientY - r.top;
    if (glow) {
      glow.style.setProperty('--mx', tmx + 'px');
      glow.style.setProperty('--my', tmy + 'px');
    }
  });

  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    const r = hero.getBoundingClientRect();
    tmx = t.clientX - r.left;
    tmy = t.clientY - r.top;
  }, { passive: true });

  /* ─── Particles ─── */
  const pts = [];
  const PCOUNT = 70;

  function initPts() {
    pts.length = 0;
    for (let i = 0; i < PCOUNT; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        s: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        o: 0.08 + Math.random() * 0.18,
      });
    }
  }
  initPts();
  window.addEventListener('resize', initPts);

  /* ─── Draw ─── */
  let time = 0;

  function draw() {
    time++;
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;

    ctx.clearRect(0, 0, W, H);

    /* Grid dots */
    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    const gs = 36;
    const gox = (time * 0.02) % gs;
    const goy = (time * 0.015) % gs;
    for (let x = -gs + gox; x < W + gs; x += gs)
      for (let y = -gs + goy; y < H + gs; y += gs) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

    /* Particles */
    pts.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.o})`;
      ctx.fill();
    });

    /* Connections */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.012 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resize();
  });

})();
