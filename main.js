// Starfields (seeded so the sky looks the same on every visit) and the work filter.
(function () {
  let a = 20261020;
  const rnd = () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) * 1.732;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const twinkle = (count) => {
    const out = [];
    for (let i = 0; i < count; i += 1) {
      const r = rnd();
      const big = r > 0.94;
      const size = big ? 3 : (r > 0.74 ? 2 : 1);
      const warm = rnd() > 0.86;
      out.push({
        cls: 'st',
        l: (rnd() * 100).toFixed(2) + '%',
        t: (rnd() * 100).toFixed(2) + '%',
        z: size + 'px',
        c: warm ? '#FFD98A' : '#FFFFFF',
        g: big ? '0 0 8px 2px rgba(255,255,255,0.45)' : 'none',
        d: (2.4 + rnd() * 4.6).toFixed(2) + 's',
        dl: '-' + (rnd() * 6).toFixed(2) + 's'
      });
    }
    return out;
  };

  const stars = twinkle(170);
  const bgStars = twinkle(100);
  const nebStars = twinkle(130);

  const mwStars = [];
  for (let i = 0; i < 420; i += 1) {
    const k = rnd();
    mwStars.push({
      cls: 'sd',
      l: (rnd() * 100).toFixed(2) + '%',
      t: clamp(50 + gauss() * 9, 1, 99).toFixed(2) + '%',
      z: (rnd() > 0.9 ? 2 : 1) + 'px',
      c: k > 0.85 ? '#FFE2B8' : (k > 0.55 ? '#CFC6FF' : '#FFFFFF'),
      o: (0.3 + rnd() * 0.65).toFixed(2)
    });
  }

  const galStars = [];
  for (let i = 0; i < 400; i += 1) {
    let x;
    let y;
    let warm;
    if (i < 320) {
      const arm = i % 2;
      const t = rnd() * 6.6;
      let r = 30 * Math.exp(0.38 * t);
      r += gauss() * (0.07 * r + 5);
      const th = t + arm * Math.PI + gauss() * 0.12;
      x = 50 + (r * Math.cos(th)) / 9;
      y = 50 + (r * Math.sin(th)) / 9;
      warm = t < 2.2;
    } else {
      const r2 = Math.abs(gauss()) * 38;
      const th2 = rnd() * Math.PI * 2;
      x = 50 + (r2 * Math.cos(th2)) / 9;
      y = 50 + (r2 * Math.sin(th2)) / 9;
      warm = true;
    }
    const k = rnd();
    galStars.push({
      cls: 'sd',
      l: clamp(x, 0, 99).toFixed(2) + '%',
      t: clamp(y, 0, 99).toFixed(2) + '%',
      z: (rnd() > 0.92 ? 2 : 1) + 'px',
      c: warm ? '#FFE2B8' : (k > 0.5 ? '#BFD0FF' : '#FFFFFF'),
      o: (0.3 + rnd() * 0.65).toFixed(2)
    });
  }

  const sets = { stars, bgStars, nebStars, mwStars, galStars };
  document.querySelectorAll('[data-stars]').forEach((host) => {
    const frag = document.createDocumentFragment();
    sets[host.dataset.stars].forEach((s) => {
      const el = document.createElement('div');
      el.className = s.cls;
      const st = el.style;
      st.left = s.l;
      st.top = s.t;
      st.width = s.z;
      st.height = s.z;
      st.background = s.c;
      if (s.cls === 'st') {
        st.boxShadow = s.g;
        st.animationDuration = s.d;
        st.animationDelay = s.dl;
      } else {
        st.opacity = s.o;
      }
      frag.appendChild(el);
    });
    host.insertBefore(frag, host.firstChild);
  });

  // Work filter
  const buttons = document.querySelectorAll('.filters button');
  const pieces = document.querySelectorAll('.piece');
  const count = document.getElementById('work-count');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cur = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let n = 0;
      pieces.forEach((p) => {
        const v = cur === 'all' || p.dataset.kind === cur;
        p.hidden = !v;
        if (v) n += 1;
      });
      count.textContent = n + ' of ' + pieces.length;
    });
  });
})();
