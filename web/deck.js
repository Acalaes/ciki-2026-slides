/* Auditável por construção — motor do deck (HTML/CSS/JS puros; Three.js r149 só na capa e no fecho). */
(function (root) {
'use strict';

/* ======================= NÚCLEO PURO (testável em Node) ======================= */
const Core = {};
// Roda do mouse: acumula deltaY, dispara acima de 50, trava 900 ms, ignora deltaX,
// descarta a inércia (eventos em sequência rápida) até haver uma pausa.
Core.makeWheel = function (o) {
  o = o || {};
  const thresh = o.thresh || 50, lock = o.lock || 900, gap = o.gap || 220;
  let acc = 0, last = -1e9, lockUntil = -1e9, inertia = false;
  return {
    feed(dy, dx, now) {
      if (Math.abs(dx) > Math.abs(dy)) return 0;
      const quiet = now - last > gap;
      last = now;
      if (now < lockUntil) { inertia = true; acc = 0; return 0; }
      if (quiet) { inertia = false; acc = 0; }
      if (inertia) return 0;
      if (acc !== 0 && Math.sign(dy) !== Math.sign(acc)) acc = 0;
      acc += dy;
      if (Math.abs(acc) > thresh) { const d = acc > 0 ? 1 : -1; acc = 0; lockUntil = now + lock; return d; }
      return 0;
    },
    reset() { acc = 0; lockUntil = -1e9; inertia = false; last = -1e9; }
  };
};
// Navegação: estado {i, step}; meta.steps[i] = nº de passos (0 = sem passos); meta.group[i] = 'm' (principal) ou 'r' (reserva).
Core.nav = function (st, dir, meta) {
  const i = st.i, step = st.step, S = meta.steps[i] || 0;
  if (dir > 0) {
    if (S && step < S) return { i, step: step + 1 };
    const n = i + 1;
    if (n < meta.steps.length && meta.group[n] === meta.group[i]) return { i: n, step: meta.steps[n] ? 1 : 0 };
    return { i, step };
  }
  if (S && step > 1) return { i, step: step - 1 };
  const n = i - 1;
  if (n >= 0 && meta.group[n] === meta.group[i]) return { i: n, step: meta.steps[n] || 0 };
  return { i, step };
};
Core.parseHash = function (h, nMain, nTotal) {
  h = (h || '').replace('#', '');
  if (/^r\d$/i.test(h)) { const k = nMain + (+h.slice(1)) - 1; return k < nTotal ? k : 0; }
  const n = parseInt(h, 10);
  return isNaN(n) ? 0 : Math.max(0, Math.min(nMain - 1, n - 1));
};
Core.planned = function (ts, i) { let s = 0; for (let k = 0; k <= i; k++) s += ts[k] || 0; return s; };
Core.fmtTime = function (s) { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
if (typeof document === 'undefined') { root.HNV_CORE = Core; if (typeof module !== 'undefined') module.exports = Core; return; }
root.HNV_CORE = Core;

/* ======================= UTILIDADES ======================= */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const P = new URLSearchParams(location.search);
const body = document.body, html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ((P.has('static') || reduced) && !P.has('anim')) body.classList.add('static');
if (P.has('lite')) body.classList.add('lite');
if (P.has('presenter')) body.classList.add('presenter');
if (P.has('thumb')) body.classList.add('thumb');
if (P.has('only3d')) body.classList.add('only3d');
const STATIC = body.classList.contains('static'), LITE = body.classList.contains('lite');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eo = t => 1 - Math.pow(1 - t, 3);
function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const C = { noite: '#070D1A', azul: '#0E1A33', aco: '#1E3A66', nevoa: '#6F8FC7', gelo: '#E6EEFB', amb: '#F2A541', cinza: '#8A94A6' };
const fmtBR = (v, dec) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
const stage = $('#stage');
const slides = $$('.slide');
const NMAIN = slides.filter(s => !s.classList.contains('res')).length;
const meta = {
  steps: slides.map(s => +(s.dataset.steps || 0)),
  group: slides.map(s => s.classList.contains('res') ? 'r' : 'm')
};
const tsec = slides.map(s => +(s.dataset.t || 0));
const probe = $('#probe');
C.amb = (function () { const c = getComputedStyle(probe).color; return c && c !== 'rgba(0, 0, 0, 0)' ? c : C.amb; })();

/* ======================= TEMPORIZADOR DE SLIDE ======================= */
let timers = [];
function at(ms, fn) { if (STATIC) { fn(); return; } timers.push(setTimeout(fn, ms)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }

/* ======================= DESENHO 2D ======================= */
function mtext(ctx, s, x, y, size, col, al, align) {
  ctx.save(); ctx.fillStyle = col || C.gelo; ctx.globalAlpha = al == null ? 1 : al; ctx.textBaseline = 'alphabetic';
  const set = sz => ctx.font = 'italic 400 ' + sz + 'px "Source Serif 4","Cambria Math",Georgia,serif';
  const parts = []; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '_' || ch === '^') { let g; if (s[i + 1] === '{') { const k = s.indexOf('}', i); g = s.slice(i + 2, k); i = k + 1; } else { g = s[i + 1]; i += 2; } parts.push({ g, sub: ch === '_' ? 1 : -1 }); }
    else { parts.push({ g: ch, sub: 0 }); i++; }
  }
  let w = 0; parts.forEach(p => { set(p.sub ? size * .62 : size); p.w = ctx.measureText(p.g).width; w += p.w; });
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  parts.forEach(p => { set(p.sub ? size * .62 : size); ctx.fillText(p.g, cx, y + (p.sub === 1 ? size * .22 : p.sub === -1 ? -size * .38 : 0)); cx += p.w; });
  ctx.restore();
}
function plain(ctx, s, x, y, size, col, al, align, wt) {
  ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = al == null ? 1 : al; ctx.textAlign = align || 'left';
  ctx.font = (wt || 600) + ' ' + size + 'px Archivo,Arial,sans-serif'; ctx.fillText(s, x, y); ctx.restore();
}
function bg(ctx, gx, gy, gr, col) {
  ctx.fillStyle = C.noite; ctx.fillRect(0, 0, 1920, 1080);
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr || 900);
  g.addColorStop(0, col || 'rgba(30,58,102,.55)'); g.addColorStop(1, 'rgba(30,58,102,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}
function makeNet(r, layers, x0, x1, y0, y1, jit) {
  const nodes = [], edges = [], idx = [], L = layers.length;
  layers.forEach((n, l) => {
    idx[l] = [];
    for (let k = 0; k < n; k++) {
      nodes.push({ x: x0 + (x1 - x0) * l / (L - 1) + (jit ? (r() - .5) * jit : 0), y: y0 + (y1 - y0) * (n === 1 ? .5 : k / (n - 1)) + (jit ? (r() - .5) * jit * .6 : 0), l, ph: r() * 6.28 });
      idx[l].push(nodes.length - 1);
    }
  });
  for (let l = 0; l < L - 1; l++) idx[l].forEach(a => idx[l + 1].forEach(b => edges.push([a, b, r()])));
  return { nodes, edges, idx };
}
function drawNet(ctx, net, t, o) {
  o = o || {}; const a = o.alpha == null ? .35 : o.alpha, sp = o.speed || .45;
  ctx.save(); ctx.strokeStyle = o.col || C.nevoa; ctx.globalAlpha = a; ctx.lineWidth = o.lw || 1.6; ctx.beginPath();
  for (const e of net.edges) { const p = net.nodes[e[0]], q = net.nodes[e[1]]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
  ctx.stroke();
  ctx.fillStyle = o.pcol || C.gelo; ctx.globalAlpha = Math.min(1, a * 2.6);
  for (const e of net.edges) if (e[2] > .5) { const f = (t * sp + e[2] * 3) % 1, p = net.nodes[e[0]], q = net.nodes[e[1]]; ctx.beginPath(); ctx.arc(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f, 4.5, 0, 6.283); ctx.fill(); }
  ctx.fillStyle = C.gelo;
  for (const n of net.nodes) { ctx.globalAlpha = Math.min(1, a * 2 + .2) * (.55 + .45 * Math.sin(t * 2 + n.ph)); ctx.beginPath(); ctx.arc(n.x, n.y, o.nr || 7, 0, 6.283); ctx.fill(); }
  ctx.restore();
}

/* ======================= CENAS 2D (fundos explicativos) ======================= */
const SCENES = {};
const HOOK = { arc() {}, count() {}, kick: 0, mx: 0, my: 0 };

SCENES.s2 = function () {
  const r = rng(2), net = makeNet(r, [3, 5, 5, 6], 980, 1450, 140, 500, 26);
  net.nodes.slice(-6).forEach((n, k) => { n.y = 140 + k * 72; n.x = 1450; });
  const gs = () => (r() + r() + r() + r() - 2) / .58, pts = [];
  for (let i = 0; i < 1514; i++) pts.push([1240 + gs() * 58, 880 + gs() * 58, 0, r() * 6.28]);
  for (let i = 0; i < 41; i++) pts.push([1670 + gs() * 22, 900 + gs() * 22, 1, r() * 6.28]);
  for (let i = 0; i < 662; i++) pts.push([960 + r() * 900, 720 + r() * 300, 2, r() * 6.28]);
  const z0 = [1.2, .8, .6, .2, .9, .4], n = LITE ? 700 : pts.length;
  return {
    T: 8, frame(ctx, t) {
      bg(ctx, 1300, 380, 800); drawNet(ctx, net, t, { alpha: .34 });
      const g = ease(clamp((t - 1.2) / 3.2, 0, 1)), z = z0.map((v, i) => i === 3 ? v + 2.9 * g : v + .2 * Math.sin(t * 1.3 + i));
      const ex = z.map(Math.exp), sum = ex.reduce((a, b) => a + b), p = ex.map(v => v / sum);
      for (let k = 0; k < 6; k++) {
        const w = p[k] * 360, bad = k === 3 && g > .75;
        ctx.fillStyle = bad ? C.amb : C.nevoa; ctx.globalAlpha = bad ? 1 : .85; ctx.fillRect(1500, 140 + k * 72 - 18, w, 36);
      }
      ctx.globalAlpha = 1; ctx.fillStyle = C.gelo; ctx.fillRect(1498, 100, 3, 440);
      mtext(ctx, 'softmax(z)_i = e^{zᵢ} / Σ_j e^{zⱼ}', 930, 606, 46, C.gelo, .85);
      mtext(ctx, 'P(y_t | y_{<t}, x)', 930, 668, 46, C.nevoa, .95);
      for (let i = 0; i < n; i++) { const q = pts[i]; ctx.globalAlpha = (q[2] === 2 ? .3 : .75) * (.6 + .4 * Math.sin(t * 1.5 + q[3])); ctx.fillStyle = q[2] === 1 ? C.gelo : C.nevoa; ctx.fillRect(q[0], q[1], 3, 3); }
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s3 = function () {
  const r = rng(3), net = makeNet(r, [3, 5, 4, 2], 1560, 1860, 90, 300, 16), hm = [];
  for (let i = 0; i < 36; i++) hm.push(Math.max(0, Math.exp(-(Math.pow((i % 6) - 2.4, 2) + Math.pow(Math.floor(i / 6) - 2.1, 2)) / 3.2) + (r() - .5) * .2));
  return {
    T: 6, frame(ctx, t) {
      bg(ctx, 1500, 200, 800); drawNet(ctx, net, t, { alpha: .3 });
      const k = ease(clamp((t - 1.8) / 1.6, 0, 1));
      for (let i = 0; i < 36; i++) { ctx.globalAlpha = .12 + .42 * hm[i] * k; ctx.fillStyle = hm[i] > .5 ? C.gelo : C.nevoa; ctx.fillRect(1260 + (i % 6) * 40, 90 + Math.floor(i / 6) * 40, 36, 36); }
      ctx.globalAlpha = 1;
      mtext(ctx, 'f(x) ≈ g(x)', 96, 1012, 48, C.nevoa, .95);
      mtext(ctx, 'f(x) ∧ regra(x)', 1010, 1012, 48, C.gelo, .95);
    }
  };
};

SCENES.s4 = function () {
  const r = rng(4), tr = [];
  for (let i = 0; i < 26; i++) { const x = r() * 1920, y = r() * 1080; tr.push([x, y, x + (r() < .5 ? 1 : -1) * (80 + r() * 220), y, x + (r() < .5 ? 1 : -1) * (80 + r() * 220), y + (r() - .5) * 300]); }
  return {
    T: 8, frame(ctx, t) {
      bg(ctx, 960, 560, 900);
      ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .13; ctx.lineWidth = 2; ctx.beginPath();
      tr.forEach(a => { ctx.moveTo(a[0], a[1]); ctx.lineTo(a[2], a[3]); ctx.lineTo(a[4], a[5]); }); ctx.stroke();
      const lk = document.getElementById('lock'), open = lk && lk.classList.contains('open') && !lk.classList.contains('block'), bl = lk && lk.classList.contains('block') || STATIC;
      ctx.globalAlpha = .9; ctx.strokeStyle = C.gelo; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(1650, 120); ctx.lineTo(1730, 120); ctx.arc(1730, 220, 100, -Math.PI / 2, Math.PI / 2); ctx.lineTo(1650, 320); ctx.closePath(); ctx.stroke();
      [150, 193, 247, 290].forEach(y => { ctx.beginPath(); ctx.moveTo(1600, y); ctx.lineTo(1650, y); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(1830, 220); ctx.lineTo(1850, 220); ctx.stroke();
      ctx.beginPath(); ctx.arc(1872, 220, 18, 0, 6.283); ctx.fillStyle = bl ? C.amb : open ? C.gelo : C.aco; ctx.globalAlpha = 1; ctx.fill();
      plain(ctx, '∧', 1740, 240, 64, C.nevoa, .9, 'center', 700);
      mtext(ctx, 'admissivel(Y) :- evidencia(Y), norma(Y), rastro(Y).', 920, 908, 40, C.nevoa, .95);
      mtext(ctx, 'liberada(Y) :- admissivel(Y), humano(Y).', 920, 968, 40, C.gelo, .95);
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s5 = function () {
  const r = rng(5), net = makeNet(r, [3, 5, 5, 4], 120, 680, 380, 590, 18), ys = 700;
  const treeN = [[1500, 392], [1330, 480], [1670, 480], [1220, 578], [1440, 578], [1560, 578], [1780, 578]], treeE = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], glyphs = ['∧', '∀', '¬', '∃', '∨', '∧', '¬'];
  const lastN = net.idx[3].map(i => net.nodes[i]);
  const bz = (p0, p1, p2, p3, u) => { const m = 1 - u; return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]]; };
  const arcPts = []; for (let k = 0; k <= 24; k++) arcPts.push(bz([950, 635], [950, 510], [590, 510], [590, 635], k / 24));
  const routeOk = [[40, ys], [1670, ys]];
  const routeBad = [[40, ys], [805, ys], [950, 635]].concat(arcPts.slice(1), [[590, ys]], [[1670, ys]]);
  const cum = rt => { const c = [0]; for (let i = 1; i < rt.length; i++) c.push(c[i - 1] + Math.hypot(rt[i][0] - rt[i - 1][0], rt[i][1] - rt[i - 1][1])); return c; };
  const cOk = cum(routeOk), cBad = cum(routeBad), SP = 430, iHit = 1, iRet = routeBad.length - 2;
  const posAt = (rt, c, d) => { d = clamp(d, 0, c[c.length - 1]); let i = 1; while (i < c.length - 1 && c[i] < d) i++; const u = (d - c[i - 1]) / (c[i] - c[i - 1] || 1); return [rt[i - 1][0] + (rt[i][0] - rt[i - 1][0]) * u, rt[i - 1][1] + (rt[i][1] - rt[i - 1][1]) * u, i]; };
  const okSp = [], badSp = []; for (let k = 0; k < 40; k++) { okSp.push(.4 + k * 2.3); } for (let k = 0; k < 10; k++) badSp.push(1.6 + k * 6.9);
  let arcOn = null;
  function glow(ctx, x, y, col, a) { ctx.globalAlpha = a * .25; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 20, 0, 6.283); ctx.fill(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill(); }
  return {
    T: 9, frame(ctx, t, dt, fin) {
      bg(ctx, 960, 600, 1000); drawNet(ctx, net, t, { alpha: .3 });
      ctx.strokeStyle = C.nevoa; ctx.lineWidth = 2; ctx.globalAlpha = .45;
      ctx.beginPath(); treeE.forEach(e => { ctx.moveTo(treeN[e[0]][0], treeN[e[0]][1]); ctx.lineTo(treeN[e[1]][0], treeN[e[1]][1]); }); ctx.stroke();
      treeN.forEach((q, i) => { ctx.globalAlpha = .9; ctx.fillStyle = C.azul; ctx.strokeStyle = C.gelo; ctx.lineWidth = 3; ctx.fillRect(q[0] - 30, q[1] - 30, 60, 60); ctx.strokeRect(q[0] - 30, q[1] - 30, 60, 60); plain(ctx, glyphs[i], q[0], q[1] + 14, 40, C.gelo, 1, 'center', 700); });
      ctx.lineWidth = 2; ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .4;
      lastN.forEach((n, i) => { const q = treeN[[3, 4, 5, 6][i]]; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.bezierCurveTo(900, n.y - 40, 1000, q[1] + 60, q[0] - 30, q[1]); ctx.stroke(); const f = (t * .35 + i * .27) % 1, b = bz([n.x, n.y], [900, n.y - 40], [1000, q[1] + 60], [q[0] - 30, q[1]], f); ctx.globalAlpha = .9; ctx.fillStyle = C.gelo; ctx.beginPath(); ctx.arc(b[0], b[1], 5, 0, 6.283); ctx.fill(); ctx.globalAlpha = .4; });
      mtext(ctx, 'g ∘ f', 880, 470, 60, C.gelo, .95, 'center');
      mtext(ctx, 'V(y) = N(y, Ω) ∧ T(y)', 1060, 1012, 46, C.nevoa, .95);
      // partículas do pipeline
      let regCount = 0, bounce = false;
      const drawP = (rt, c, d, bad) => {
        const pos = posAt(rt, c, d); const colBad = bad && pos[2] <= iRet;
        const col = colBad ? C.amb : C.gelo;
        for (let k = 1; k <= 8; k++) { const q = posAt(rt, c, d - k * 12); ctx.globalAlpha = .5 * (1 - k / 9); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], 8 - k * .7, 0, 6.283); ctx.fill(); }
        glow(ctx, pos[0], pos[1], col, 1);
        if (pos[0] > 1310 - 5 && pos[1] === ys) regCount++;
        if (bad && d > c[iHit] && d < c[iHit + 3] + SP * .6) bounce = true;
      };
      if (!fin) {
        okSp.forEach(s => { if (t > s) { const d = (t - s) * SP; if (d < cOk[1] + 60) drawP(routeOk, cOk, d, false); } });
        badSp.forEach(s => { if (t > s) { const d = (t - s) * SP; if (d < cBad[cBad.length - 1] + 60) drawP(routeBad, cBad, d, true); } });
        regCount = Math.floor(clamp((t - 1.5) / .9, 0, 9));
      } else { regCount = 8; bounce = true; }
      for (let k = 0; k < Math.min(8, regCount); k++) { ctx.globalAlpha = .85; ctx.fillStyle = C.nevoa; ctx.fillRect(1310 - 40, 786 + k * 16, 80, 9); }
      if (bounce !== arcOn) { arcOn = bounce; HOOK.arc(bounce); }
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s6 = function () {
  const r = rng(6), pts = [], ed = [];
  for (let i = 0; i < 18; i++) { const th = Math.acos(1 - 2 * (i + .5) / 18), ph = Math.PI * (1 + Math.sqrt(5)) * i; pts.push([Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)]); }
  for (let i = 0; i < 18; i++) { let b = [], d = []; pts.forEach((q, j) => { if (j !== i) d.push([Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2]), j]); }); d.sort((a, b) => a[0] - b[0]); ed.push([i, d[0][1]], [i, d[1][1]]); }
  return {
    T: 6, frame(ctx, t) {
      bg(ctx, 1560, 190, 700);
      const a = t * .35 + .6, ca = Math.cos(a), sa = Math.sin(a), pr = pts.map(q => { const x = q[0] * ca + q[2] * sa, z = -q[0] * sa + q[2] * ca, k = 4 / (4 + z * .9); return [1560 + x * 150 * k, 190 + q[1] * 138 * k, z, k]; });
      ctx.strokeStyle = C.nevoa; ctx.lineWidth = 2; ctx.globalAlpha = .5; ctx.beginPath(); ed.forEach(e => { ctx.moveTo(pr[e[0]][0], pr[e[0]][1]); ctx.lineTo(pr[e[1]][0], pr[e[1]][1]); }); ctx.stroke();
      pr.forEach((q, i) => { ctx.globalAlpha = .45 + .5 * q[3] / 1.3; ctx.fillStyle = i % 5 === 0 ? C.gelo : C.nevoa; ctx.beginPath(); ctx.arc(q[0], q[1], 7 * q[3], 0, 6.283); ctx.fill(); });
      const dx = Math.sin(t * .6) * 14;
      mtext(ctx, ':Citacao :temDOI "…" .', 96 + dx, 512, 40, C.nevoa, .95);
      mtext(ctx, ':Afirmacao :apoiadaPor :Fonte .', 96 - dx, 562, 40, C.nevoa, .95);
      mtext(ctx, 'R_k(q) = TopK_{d∈D} s(q, d)', 1180, 530, 44, C.gelo, .9);
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s7 = function () {
  const r = rng(7), nodes = [], ed = [], cols = 14, rows = 8;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) nodes.push({ x: 70 + i * 135 + (r() - .5) * 40, y: 60 + j * 138 + (r() - .5) * 40, ph: r() * 6.28 });
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const k = j * cols + i; if (i < cols - 1) ed.push([k, k + 1, r()]); if (j < rows - 1) ed.push([k, k + cols, r()]); }
  return {
    T: 6, frame(ctx, t) {
      bg(ctx, 1000, 500, 1100);
      ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .14; ctx.lineWidth = 1.6; ctx.beginPath(); ed.forEach(e => { ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y); ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y); }); ctx.stroke();
      ctx.fillStyle = C.gelo; ed.forEach(e => { if (e[2] > .72) { const f = (t * .3 + e[2] * 5) % 1, p = nodes[e[0]], q = nodes[e[1]]; ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f, 4, 0, 6.283); ctx.fill(); } });
      nodes.forEach(n => { ctx.globalAlpha = .2 + .15 * Math.sin(t * 1.6 + n.ph); ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, 6.283); ctx.fill(); });
      mtext(ctx, 'TLX = (1/6) Σ_{i=1}^{6} s_i', 1000, 478, 46, C.gelo, .9);
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s8 = function () {
  const COLS = 48, ROWS = 28, r = rng(8), cols = [];
  const SET = '01∧∨∀∃λ¬→§01', PH = ['art. 37', 'exit 2', 'PROV', 'E∧N∧T∧H', 'ontologia', 'bloqueio', 'citação', 'λx.¬x'];
  for (let i = 0; i < COLS; i++) cols.push({ sp: 5 + r() * 9, off: r() * 60, len: 8 + Math.floor(r() * 14), ph: r() < .26 ? PH[Math.floor(r() * PH.length)] : null });
  const hash = (a, b, c) => { let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791); h >>>= 0; return h; };
  let accT = 0;
  return {
    T: 9, frame(ctx, t, dt) {
      accT += dt * (1 + 3 * HOOK.kick); HOOK.kick = Math.max(0, HOOK.kick - dt * 1.1);
      const tt = STATIC ? t : accT + 0; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1920, 1080);
      ctx.font = '700 40px Consolas,"Cambria Math","Segoe UI Symbol",monospace'; ctx.textAlign = 'center';
      const slot = Math.floor(tt * 2.2);
      for (let c = 0; c < COLS; c++) {
        const col = cols[c], head = (tt * col.sp * .5 + col.off) % (ROWS + col.len), hr = Math.floor(head);
        for (let k = 0; k < col.len; k++) {
          const row = hr - k; if (row < 0 || row >= ROWS) continue;
          const ch = col.ph ? col.ph[(row + c) % col.ph.length] : SET[hash(c, row, k === 0 ? slot : Math.floor(slot / 6)) % SET.length];
          const f = 1 - k / col.len;
          ctx.globalAlpha = k === 0 ? .8 : .3 * f * f; ctx.fillStyle = k === 0 ? '#CFFFD8' : '#00FF41';
          if (k < 3) { ctx.shadowColor = '#00FF41'; ctx.shadowBlur = LITE ? 0 : 12; } else ctx.shadowBlur = 0;
          ctx.fillText(ch, c * 40 + 20, row * 40 + 38);
        }
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
  };
};

SCENES.s9 = function () {
  const r = rng(9), src = [[1180, 250], [1520, 170], [1700, 480]], fin = [], N = LITE ? 220 : 446;
  const gs = () => (r() + r() + r() + r() - 2) / .58;
  for (let i = 0; i < N; i++) fin.push([clamp(1380 + gs() * 250, 920, 1870), clamp(400 + gs() * 190, 70, 760), r() * 6.28, .6 + r() * 1.6]);
  const mods = ['ferramentas', 'laços', 'hooks', 'skills', 'memória', 'permissões'], core = [1380, 400];
  const cn = []; for (let i = 0; i < 9; i++) cn.push([core[0] + Math.cos(i * .7) * 46 * (.6 + (i % 3) * .25), core[1] + Math.sin(i * .7) * 46 * (.6 + (i % 3) * .25)]);
  let last = '';
  return {
    T: 9, frame(ctx, t) {
      bg(ctx, 1380, 400, 760);
      const ex = clamp((t - 1.4) / 1.8, 0, 1), e = eo(ex);
      for (let i = 0; i < fin.length; i++) {
        const s = src[i % 3], f = fin[i], x = s[0] + (f[0] - s[0]) * e, y = s[1] + (f[1] - s[1]) * e;
        if (ex === 0) break;
        ctx.globalAlpha = (.45 + .55 * (.5 + .5 * Math.sin(t * 1.4 + f[2]))) * clamp(ex * 3, 0, 1); ctx.fillStyle = f[3] > 1.4 ? C.gelo : C.nevoa; ctx.beginPath(); ctx.arc(x, y, f[3] * 1.5, 0, 6.283); ctx.fill();
      }
      const bl = (.7 + .3 * Math.sin(t * 3)) * (1 - ex * .4);
      src.forEach(s => { const g = ctx.createRadialGradient(s[0], s[1], 0, s[0], s[1], 46); g.addColorStop(0, 'rgba(230,238,251,' + bl + ')'); g.addColorStop(1, 'rgba(230,238,251,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(s[0] - 50, s[1] - 50, 100, 100); });
      const m = clamp((t - 3.4) / 1.2, 0, 1);
      if (m > 0) {
        ctx.globalAlpha = m * .55; ctx.strokeStyle = C.nevoa; ctx.lineWidth = 2; ctx.beginPath(); cn.forEach((p, i) => { cn.forEach((q, j) => { if (j > i && (i + j) % 3 === 0) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } }); }); ctx.stroke();
        ctx.fillStyle = C.gelo; cn.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 6.283); ctx.fill(); });
        mods.forEach((nm, i) => { const a = t * .22 + i * 1.047, x = core[0] + Math.cos(a) * 300, y = core[1] + Math.sin(a) * 175; ctx.globalAlpha = m * .35; ctx.beginPath(); ctx.moveTo(core[0], core[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.globalAlpha = m; ctx.fillStyle = C.nevoa; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill(); plain(ctx, nm, x, y - 20, 40, C.gelo, m * .95, 'center', 600); });
      }
      ctx.globalAlpha = 1;
      const v = ex === 0 ? 3 : Math.round(3 + 443 * eo(clamp((t - 1.4) / 2.4, 0, 1))), key = v + (ex === 0 ? 'a' : 'b');
      if (key !== last) { last = key; HOOK.count(String(v), ex === 0 ? '2025' : '2026'); }
    }
  };
};

SCENES.s10 = function () {
  const r = rng(10), nodes = [], ed = [];
  for (let i = 0; i < 46; i++) nodes.push({ x: r() * 1920, y: r() * 1080, ph: r() * 6.28 });
  nodes.forEach((a, i) => { nodes.forEach((b, j) => { if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 260) ed.push([i, j, r()]); }); });
  return {
    T: 6, frame(ctx, t) {
      bg(ctx, 1450, 560, 760, 'rgba(30,58,102,.7)');
      ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .13; ctx.lineWidth = 1.6; ctx.beginPath(); ed.forEach(e => { ctx.moveTo(nodes[e[0]].x, nodes[e[0]].y); ctx.lineTo(nodes[e[1]].x, nodes[e[1]].y); }); ctx.stroke();
      ctx.fillStyle = C.gelo; ed.forEach(e => { if (e[2] > .6) { const f = (t * .25 + e[2] * 4) % 1, p = nodes[e[0]], q = nodes[e[1]]; ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f, 4, 0, 6.283); ctx.fill(); } });
      nodes.forEach(n => { ctx.globalAlpha = .22 + .15 * Math.sin(t * 1.7 + n.ph); ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, 6.283); ctx.fill(); });
      ctx.globalAlpha = 1;
    }
  };
};

SCENES.s11 = function () {
  const r = rng(11), lanes = [575, 687, 799, 911], chains = lanes.map((y, k) => { const n = [], cnt = [5, 5, 7, 9][k]; for (let i = 0; i < cnt; i++) n.push([520 + i * (960 / (cnt - 1)), y + (r() - .5) * 14]); return n; });
  return {
    T: 6, frame(ctx, t) {
      bg(ctx, 1000, 760, 900);
      chains.forEach((ch, k) => {
        ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .3; ctx.lineWidth = 2; ctx.beginPath(); ch.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
        ch.forEach(p => { ctx.globalAlpha = .55; ctx.fillStyle = C.gelo; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 6.283); ctx.fill(); });
        const f = ((t * (.14 + k * .03)) % 1) * 960 + 520; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(f, lanes[k], 7, 0, 6.283); ctx.fill();
      });
      mtext(ctx, 'Δ = métrica(arquitetura) − métrica(base)', 96, 486, 46, C.gelo, .9);
      ctx.globalAlpha = 1;
    }
  };
};

/* ======================= CAPA E FECHO: HARNESS EM 3D ======================= */
function harnessGeom() {
  const loops = [], s2 = Math.SQRT1_2, R = 1.55;
  const ang = d => d * Math.PI / 180, u = a => [Math.cos(ang(a)), 0, Math.sin(ang(a))];
  loops.push({ a: [1, 0, 0], b: [0, 0, 1], r: R, kind: 'strap' }, { a: u(45), b: [0, 1, 0], r: R, kind: 'strap' }, { a: u(135), b: [0, 1, 0], r: R, kind: 'strap' },
    { a: [1, 0, 0], b: [0, .766, .643], r: 1.74, kind: 'strap' }, { a: [0, 0, 1], b: [.643, .766, 0], r: 1.74, kind: 'strap' });
  const rings = [{ a: [1, 0, 0], b: [0, .94, -.34], r: 2.0 }, { a: [0, 0, 1], b: [.6, .8, 0], r: 2.12 }, { a: [1, 0, 0], b: [0, .17, .985], r: 2.24 }];
  const anchors = [45, 135, 225, 315].map(d => u(d).map(v => v * R));
  const pt = (L, th) => [0, 1, 2].map(i => L.r * (Math.cos(th) * L.a[i] + Math.sin(th) * L.b[i]));
  return { loops, rings, anchors, pt, R };
}
const HG = harnessGeom();
function fib(n, rad, r) { const p = []; for (let i = 0; i < n; i++) { const th = Math.acos(1 - 2 * (i + .5) / n), ph = Math.PI * (1 + Math.sqrt(5)) * i; p.push([rad * Math.sin(th) * Math.cos(ph), rad * Math.cos(th), rad * Math.sin(th) * Math.sin(ph)]); } return p; }
function nearEdges(p, k) { const e = [], seen = new Set(); p.forEach((a, i) => { const d = p.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), j]).filter(x => x[1] !== i).sort((x, y) => x[0] - y[0]).slice(0, k); d.forEach(x => { const key = Math.min(i, x[1]) + '_' + Math.max(i, x[1]); if (!seen.has(key)) { seen.add(key); e.push([i, x[1]]); } }); }); return e; }

function letterTexture(THREE, ch) {
  const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d');
  x.strokeStyle = C.gelo; x.lineWidth = 6; x.beginPath(); x.arc(80, 80, 66, 0, 6.283); x.stroke();
  x.fillStyle = 'rgba(7,13,26,.7)'; x.fill(); x.fillStyle = C.gelo; x.font = '900 92px Archivo,Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 80, 88);
  const t = new THREE.CanvasTexture(c); return t;
}

function makeCover3D(canvas) {
  const THREE = root.THREE; if (!THREE) return null;
  let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !LITE, alpha: false, preserveDrawingBuffer: true }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setSize(1920, 1080, false); renderer.setPixelRatio(1); renderer.setClearColor(0x070D1A, 1);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1920 / 1080, .1, 100); cam.position.set(0, 0, 10);
  const G = new THREE.Group(); G.position.set(2.3, -1.06, 0); G.scale.setScalar(.93); scene.add(G);
  scene.add(new THREE.AmbientLight(0x5a78b0, .9));
  const dl = new THREE.DirectionalLight(0xE6EEFB, 1.25); dl.position.set(3, 4, 6); scene.add(dl);
  const pl = new THREE.PointLight(0x6F8FC7, 2.2, 30); pl.position.set(-5, -2, 4); scene.add(pl);
  // brilho atrás do núcleo
  const gc = document.createElement('canvas'); gc.width = gc.height = 256; const gx = gc.getContext('2d'), gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, 'rgba(111,143,199,.65)'); gg.addColorStop(1, 'rgba(111,143,199,0)'); gx.fillStyle = gg; gx.fillRect(0, 0, 256, 256);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); halo.scale.set(6, 6, 1); G.add(halo);
  // núcleo neural
  const np = fib(LITE ? 90 : 170, 1.05), ne = nearEdges(np, 3), nodeGeo = new THREE.BufferGeometry(), pos = new Float32Array(np.length * 3), col = new Float32Array(np.length * 3);
  np.forEach((p, i) => { pos.set(p, i * 3); }); nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); nodeGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({ size: .15, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); G.add(nodes);
  const ep = new Float32Array(ne.length * 6); ne.forEach((e, i) => { ep.set(np[e[0]], i * 6); ep.set(np[e[1]], i * 6 + 3); });
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  const edges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x6F8FC7, transparent: true, opacity: .4 })); G.add(edges);
  // faixas (skills): tubos que se desenham
  const steel = new THREE.MeshStandardMaterial({ color: 0x2c4f86, metalness: .75, roughness: .38, emissive: 0x0a1630 });
  const straps = HG.loops.map((L, k) => { const pts = []; for (let i = 0; i < 64; i++) pts.push(new THREE.Vector3(...HG.pt(L, i / 64 * 6.2832))); const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 220, .065, 6, true); const m = new THREE.Mesh(g, steel); m.userData.n = g.index.count; G.add(m); return m; });
  // anéis rígidos (hooks)
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x5f86c7, metalness: .9, roughness: .28, emissive: 0x10223f });
  const rings = HG.rings.map((L, k) => { const grp = new THREE.Group(), pts = []; for (let i = 0; i < 80; i++) pts.push(new THREE.Vector3(...HG.pt(L, i / 80 * 6.2832))); const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, .02, 8, true); grp.add(new THREE.Mesh(g, ringMat)); G.add(grp); return grp; });
  // fivelas e ancoragens
  const bk = [], lab = ['E', 'N', 'T', 'H'];
  HG.anchors.forEach((a, k) => {
    const bx = new THREE.Mesh(new THREE.BoxGeometry(.36, .46, .2), new THREE.MeshStandardMaterial({ color: 0x86a9e6, metalness: .85, roughness: .25, emissive: 0x16305a })); bx.position.set(...a); bx.lookAt(0, 0, 0); G.add(bx);
    const ed = new THREE.LineSegments(new THREE.EdgesGeometry(bx.geometry), new THREE.LineBasicMaterial({ color: 0xE6EEFB })); bx.add(ed);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: letterTexture(THREE, lab[k]), transparent: true, depthTest: false })); sp.position.set(a[0] * 1.3, a[1] * 1.3, a[2] * 1.3); sp.scale.set(.66, .66, 1); sp.renderOrder = 10; G.add(sp);
    bk.push({ bx, sp });
  });
  const human = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .22), new THREE.MeshStandardMaterial({ color: 0xE6EEFB, emissive: 0x9fb8e8, metalness: .3, roughness: .4 })); human.position.set(0, 1.55, 0); G.add(human);
  const hr = new THREE.Mesh(new THREE.TorusGeometry(.32, .03, 8, 40), new THREE.MeshBasicMaterial({ color: 0xE6EEFB })); hr.position.set(0, 1.55, 0); hr.rotation.x = Math.PI / 2; G.add(hr);
  const cols = nodeGeo.attributes.color;
  const api = {
    canvas, renderer, ok: true, done: false,
    render(t, o) {
      o = o || {}; const tt = api.done ? t + 10 : t, rotY = o.fixed ? -.62 : -.5 + t * .12 + HOOK.mx * .1745, rotX = o.fixed ? .22 : .2 + HOOK.my * .1745;
      G.rotation.y += (rotY - G.rotation.y) * (o.fixed ? 1 : .08); G.rotation.x += (rotX - G.rotation.x) * (o.fixed ? 1 : .08);
      straps.forEach((m, k) => { const p = ease(clamp((tt - .15 * k) / 1.7, 0, 1)); m.geometry.setDrawRange(0, Math.floor(m.userData.n * p / 3) * 3); m.visible = p > 0; });
      rings.forEach((g, k) => { const s = eo(clamp((tt - .35 - .2 * k) / 1.3, 0, 1)); g.scale.setScalar(Math.max(.001, s)); g.rotation.y = o.fixed ? .3 * k : t * (.18 + .07 * k) * (k % 2 ? -1 : 1); });
      bk.forEach((b, k) => { const s = eo(clamp((tt - 1.6 - .18 * k) / .6, 0, 1)); b.bx.scale.setScalar(Math.max(.001, s)); const l = clamp((tt - 2.8 - .25 * k) / .5, 0, 1); b.sp.material.opacity = l; b.sp.visible = l > 0; });
      const hs = eo(clamp((tt - 2.4) / .6, 0, 1)); human.scale.setScalar(Math.max(.001, hs)); hr.scale.setScalar(Math.max(.001, hs));
      const core = .25 + .75 * clamp((tt - 2.2) / 1.2, 0, 1);
      for (let i = 0; i < np.length; i++) { const p = np[i], w = (tt * .32) % 1, u = (p[1] + 1.05) / 2.1, bump = Math.max(0, 1 - Math.abs(u - w) * 7), v = core * (.5 + .3 * Math.sin(tt * 2.2 + i * .7) + .9 * bump); cols.setXYZ(i, .44 * v, .62 * v, .9 * v + .1 * bump); }
      cols.needsUpdate = true; edges.material.opacity = .25 + .45 * core; halo.material.opacity = .3 + .7 * core;
      renderer.render(scene, cam);
    }
  };
  return api;
}
function makeCover2D(canvas) {
  const ctx = canvas.getContext('2d'), np = fib(120, .85), ne = nearEdges(np, 3);
  const proj = (p, ry, rx) => { const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx); let x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1] * cx - z * sx; z = p[1] * sx + z * cx; const k = 10 / (10 - z); return [1380 + (x * k) * 171, 745 - y * k * 171, z, k]; };
  return {
    canvas, ok: true, done: false,
    render(t, o) {
      o = o || {}; const tt = this.done ? t + 10 : t, ry = o.fixed ? -.62 : -.5 + t * .12 + HOOK.mx * .1745, rx = o.fixed ? .22 : .2 + HOOK.my * .1745;
      bg(ctx, 1380, 745, 700);
      const core = .25 + .75 * clamp((tt - 2.2) / 1.2, 0, 1), P = np.map(p => proj(p, ry, rx));
      ctx.strokeStyle = C.nevoa; ctx.globalAlpha = .18 + .3 * core; ctx.lineWidth = 1.5; ctx.beginPath(); ne.forEach(e => { ctx.moveTo(P[e[0]][0], P[e[0]][1]); ctx.lineTo(P[e[1]][0], P[e[1]][1]); }); ctx.stroke();
      ctx.fillStyle = C.gelo; P.forEach((p, i) => { ctx.globalAlpha = core * (.5 + .4 * Math.sin(tt * 2.2 + i * .7)); ctx.beginPath(); ctx.arc(p[0], p[1], 3.5 * p[3], 0, 6.283); ctx.fill(); });
      const draw = (L, w, c, prog) => { const n = Math.floor(80 * prog); if (n < 2) return; ctx.strokeStyle = c; ctx.lineWidth = w; ctx.globalAlpha = .95; ctx.beginPath(); for (let i = 0; i <= n; i++) { const q = proj(HG.pt(L, i / 80 * 6.2832), ry, rx); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); };
      HG.loops.forEach((L, k) => draw(L, 8, '#2c4f86', ease(clamp((tt - .15 * k) / 1.7, 0, 1))));
      HG.rings.forEach((L, k) => draw(L, 5, '#6F8FC7', eo(clamp((tt - .35 - .2 * k) / 1.3, 0, 1))));
      HG.anchors.forEach((a, k) => { const q = proj(a, ry, rx), l = clamp((tt - 2.8 - .25 * k) / .5, 0, 1); ctx.globalAlpha = l; ctx.fillStyle = 'rgba(7,13,26,.8)'; ctx.strokeStyle = C.gelo; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q[0], q[1], 34, 0, 6.283); ctx.fill(); ctx.stroke(); plain(ctx, 'ETHN'[0] && ['E', 'N', 'T', 'H'][k], q[0], q[1] + 16, 46, C.gelo, l, 'center', 900); });
      ctx.globalAlpha = 1;
    }
  };
}

/* ======================= GERENTE DE CANVAS ======================= */
const cv2 = document.createElement('canvas'); cv2.width = 1920; cv2.height = 1080;
const ctx2 = cv2.getContext('2d');
let cvGL = null, cover = { c: null }, rafId = 0, active = null, t0 = 0, tLast = 0;
function coverFor(done) {
  if (!cover.c) {
    if (!cvGL) { cvGL = document.createElement('canvas'); cvGL.width = 1920; cvGL.height = 1080; cvGL.className = 'gl'; }
    let c = null; try { c = makeCover3D(cvGL); } catch (e) { c = null; }
    if (!c) { c = makeCover2D(cv2); c.is2d = true; }
    cover.c = c;
  }
  cover.c.done = !!done; return cover.c;
}
function sceneFor(name) {
  if (name === 'cover' || name === 'cover12') return null;
  return SCENES[name] ? (SCENES[name].inst || (SCENES[name].inst = SCENES[name]())) : null;
}
function leaveFx() {
  cancelAnimationFrame(rafId); rafId = 0; active = null;
  if (cv2.parentNode) cv2.parentNode.removeChild(cv2);
  if (cvGL && cvGL.parentNode) cvGL.parentNode.removeChild(cvGL);
}
function enterFx(slide) {
  leaveFx();
  const slot = $('.fxslot', slide); if (!slot) return;
  const name = slot.dataset.fx;
  if (STATIC || LITE) { bakeSlide(slide); if (STATIC) return; }
  if (name === 'cover' || name === 'cover12') {
    if (LITE) return;
    const c = coverFor(name === 'cover12'); const cvs = c.is2d ? cv2 : cvGL; slot.appendChild(cvs);
    active = { c, cover: true }; t0 = performance.now(); loop(t0); return;
  }
  const sc = sceneFor(name); if (!sc) return;
  if (LITE) return;
  slot.appendChild(cv2); active = { sc, ctx: ctx2 }; t0 = tLast = performance.now(); loop(t0);
}
function loop(ts) {
  if (!active) return;
  rafId = requestAnimationFrame(loop);
  if (document.hidden) return;
  const t = (ts - t0) / 1000, dt = Math.min(.05, (ts - tLast) / 1000); tLast = ts;
  if (active.cover) active.c.render(t); else active.sc.frame(active.ctx, t, dt);
}
const baked = new WeakSet();
function bakeSlide(slide) {
  if (baked.has(slide)) return; const slot = $('.fxslot', slide); if (!slot) return; const name = slot.dataset.fx;
  let url = null;
  try {
    if (name === 'cover' || name === 'cover12') {
      const img = new Image(); img.className = 'fxstatic'; img.alt = ''; img.setAttribute('aria-hidden', 'true'); img.src = P.has('fresh') ? 'img/_inexistente.png' : 'img/capa_harness3d.png';
      img.onerror = () => { try { const c = coverFor(name === 'cover12'); const cvs = c.is2d ? cv2 : cvGL; c.render(5, { fixed: true }); img.onerror = null; img.src = cvs.toDataURL('image/png'); } catch (e) {} };
      slot.appendChild(img); baked.add(slide); return;
    }
    const sc = sceneFor(name); if (!sc) return;
    const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    if (name === 's5') sc.frame(x, sc.T, 0, true); else sc.frame(x, sc.T, 0);
    url = c.toDataURL('image/png');
  } catch (e) { return; }
  if (url) { const img = new Image(); img.className = 'fxstatic'; img.alt = ''; img.setAttribute('aria-hidden', 'true'); img.src = url; slot.appendChild(img); baked.add(slide); }
}
function bakeAll() { slides.forEach(bakeSlide); }
HOOK.arc = on => { const a = $('#arc'), v = $('#ndV'); if (!a) return; a.classList.toggle('err', !!on); if (v) v.classList.toggle('block', !!on); if (on && v && !STATIC) { v.classList.remove('shake'); void v.getBoundingClientRect(); v.classList.add('shake'); } };
HOOK.count = (n, yr) => { const c = $('#cnt'), y = $('#yr'); if (c) c.textContent = n; if (y) y.textContent = yr; };

/* ======================= CONSTRUÇÕES DINÂMICAS ======================= */
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function buildDynamic() {
  const ticks = $('#ticks'); if (ticks) for (let i = 0; i < 22; i++) { const x = 520 + i * 52; el('line', { x1: x, x2: x, y1: 850, y2: i === 0 || i === 21 ? 930 : 900, class: 'tick' }, ticks); }
  const heat = $('#heat'); if (heat) { for (let i = 0; i < 196; i++) { const d = document.createElement('i'); d.style.setProperty('--i', i); if (i >= 191) d.className = 'v'; heat.appendChild(d); } }
  const nn = $('#nn'); if (nn) { const rr = rng(21), pts = []; for (let i = 0; i < 9; i++) { const a = i * 0.7, rad = 18 + (i % 3) * 14; pts.push([1450 + Math.cos(a) * rad * 1.1, 560 + Math.sin(a) * rad * 1.1]); }
    pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && (i + j) % 3 === 0) el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: 'ln2 thin' }, nn); }));
    pts.forEach((p, i) => { const c = el('circle', { cx: p[0], cy: p[1], r: 6, class: 'fl nn' }, nn); c.style.setProperty('--dl', (i * .2) + 's'); }); }
  const on = $('#ontNodes'); if (on) { for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832; el('circle', { cx: 1450 + Math.cos(a) * 310, cy: 560 + Math.sin(a) * 310, r: 11 }, on); } }
  const sp = $('#spiral'); if (sp) { let d = ''; for (let i = 0; i <= 120; i++) { const a = i / 120 * 6.2832 * 3.2 + .6, rad = 70 + i / 120 * 240; d += (i ? 'L' : 'M') + (1450 + Math.cos(a) * rad).toFixed(1) + ' ' + (560 + Math.sin(a) * rad).toFixed(1); } sp.setAttribute('d', d); }
  const lanes = $('#lanes'); if (lanes) {
    const names = ['manual', 'LLM puro', 'RAG', 'completa'], ys = [575, 687, 799, 911];
    const ic = ['M-12 8L-4 -8H4L12 8M-8 -8V-14M8 -8V-14', 'M-14 0L-5 9L14 -10', 'M0 -14L4 -4L15 -3L7 4L9 15L0 9L-9 15L-7 4L-15 -3L-4 -4Z', 'M0 -14V0L10 6M0 -14A14 14 0 1 1 -12 7', 'M-14 -4H14M-14 4H14M-8 -12V12M8 -12V12', 'M12 -8A14 14 0 1 0 14 6M12 -14V-6H4', 'M-8 -12A5 5 0 1 0 -8 -2M8 -12A5 5 0 1 0 8 -2M-14 14C-14 4 14 4 14 14'];
    names.forEach((nm, k) => {
      const y = ys[k], g = el('g', {}, lanes);
      el('rect', { class: 'trk', x: 100, y: y - 46, width: 1400, height: 92, rx: 16 }, g);
      const tx = el('text', { class: 't44', x: 130, y: y + 15 }, g); tx.textContent = nm;
      const mk = el('circle', { class: 'fl mk', cx: 470, cy: y, r: 14 }, g); mk.style.setProperty('--dl', (k * .35) + 's');
      ic.forEach((d, i) => { const gi = el('g', { transform: 'translate(' + (640 + i * 120) + ' ' + y + ') scale(1.15)' }, g); el('path', { d, class: 'ln thin', style: 'stroke-width:3.4;stroke-linecap:round' }, gi); });
    });
  }
  const pads = $('#pads'); if (pads) { [[1660, 600], [1790, 600], [1660, 790], [1790, 790]].forEach((p, k) => { const g = el('g', { transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, pads); el('rect', { class: 'hit', x: -50, y: -60, width: 100, height: 120 }, g); const sh = el('path', { class: 'padl shk', d: 'M-20 -6V-26A20 20 0 0 1 20 -26V-6' }, g); sh.style.setProperty('--dl', (k * .5 + 1) + 's'); el('rect', { class: 'pad', x: -32, y: -8, width: 64, height: 50, rx: 8 }, g); }); }
  const trail = $('#trail'); if (trail) { trail.innerHTML = '<i></i><i></i><i></i><i></i><i></i><em></em>'; }
}
const MARCO = [[], [0, 'Chamado'], [0, 'Chamado'], [1, 'Travessia'], [1, 'Travessia'], [2, 'Provas'], [2, 'Provas'], [2, 'Provas'], [3, 'Fronteira'], [3, 'Fronteira'], [4, 'Retorno'], [4, 'Retorno']];
function updateTrail(i) {
  const tr = $('#trail'); if (!tr) return; const m = MARCO[i] && MARCO[i].length ? MARCO[i] : null;
  $$('i', tr).forEach((d, k) => { d.className = !m ? '' : k === m[0] ? 'on' : k < m[0] ? 'past' : ''; });
  $('em', tr).textContent = m ? m[1] : '';
  tr.style.visibility = i >= NMAIN ? 'hidden' : 'visible';
}
function countUp(root) {
  $$('[data-count]', root).forEach(e => {
    const to = +e.dataset.count, dec = +(e.dataset.dec || 0);
    if (STATIC) { e.textContent = fmtBR(to, dec); return; }
    const a = performance.now(), d = 1700;
    (function f(t) { const p = clamp((t - a) / d, 0, 1); e.textContent = fmtBR(to * eo(p), dec); if (p < 1 && e.isConnected && e.closest('.slide.active')) requestAnimationFrame(f); else if (p >= 1) e.textContent = fmtBR(to, dec); })(a);
  });
}

/* ======================= PAINÉIS (camada 2) E GAVETA (camada 3) ======================= */
const PANELS = root.HNV_PANELS || {}, FONTES = root.HNV_FONTES || {};
let openPanelEl = null, lastOpener = null, drawerOpen = false;
function buildPanels() {
  const ids = new Set($$('[data-open]').map(e => e.dataset.open)); Object.keys(PANELS).forEach(k => { if (k !== 'r3-referencias') ids.add(k); });
  ids.forEach(id => {
    const s = document.createElement('section'); s.className = 'panel'; s.id = 'panel-' + id; s.dataset.layer = '2'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); s.setAttribute('aria-label', 'Painel ' + id); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<button class="panel-close" type="button" aria-label="Fechar painel (Esc)">fechar · Esc</button><div class="panel-body"></div>';
    $('.panel-body', s).innerHTML = PANELS[id] || '<p class="em-construcao">painel em construção</p>';
    stage.appendChild(s);
  });
  $$('[data-fill]').forEach(e => { e.innerHTML = PANELS[e.dataset.fill] || '<p class="em-construcao">painel em construção</p>'; });
  $$('[data-open],[data-src]').forEach(e => { if (!e.hasAttribute('tabindex')) e.tabIndex = 0; if (!e.hasAttribute('role')) e.setAttribute('role', 'button'); if (!e.getAttribute('aria-label') && e.dataset.src) e.setAttribute('aria-label', 'Ver a fonte: ' + e.textContent.trim()); });
}
function openPanel(id, opener) {
  const p = document.getElementById('panel-' + id); if (!p) return; closeDrawer(); if (openPanelEl) closePanelNow();
  lastOpener = opener || document.activeElement; openPanelEl = p; p.classList.add('open'); p.setAttribute('aria-hidden', 'false'); p.scrollTop = 0;
  const cb = $('.panel-close', p); if (cb) cb.focus({ preventScroll: true });
  countUp($('.panel-body', p)); body.classList.add('panel-open');
}
function closePanelNow() { if (!openPanelEl) return; openPanelEl.classList.remove('open'); openPanelEl.setAttribute('aria-hidden', 'true'); openPanelEl = null; body.classList.remove('panel-open'); $$('.pin.drop').forEach(p => p.classList.remove('drop')); }
function closePanel() { closePanelNow(); if (lastOpener && lastOpener.focus && lastOpener.isConnected) { try { lastOpener.focus({ preventScroll: true }); } catch (e) {} } }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function openDrawer(key, opener) {
  const f = FONTES[key], d = $('#drawer');
  if (!f) d.innerHTML = '<button class="panel-close" type="button" aria-label="Fechar fonte (Esc)">fechar · Esc</button><h2>Fonte</h2><p class="afirm">Fonte não cadastrada: ' + esc(key) + '</p>';
  else { const ok = /^confirmado/.test(f.status || ''); d.innerHTML = '<button class="panel-close" type="button" aria-label="Fechar fonte (Esc)">fechar · Esc</button><h2>Afirmação</h2><p class="afirm">' + esc(f.afirmacao) + '</p><h2>Fonte</h2><p>' + esc(f.fonte) + '</p><span class="status ' + (ok ? 'ok' : 'parcial') + '">' + esc(f.status || 'sem status') + '</span><h2>Endereço</h2><p class="url">' + esc(f.url || 'sem endereço') + '</p>'; }
  d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('on'); drawerOpen = true; d.scrollTop = 0; d._opener = opener || document.activeElement;
  const cb = $('.panel-close', d); if (cb) cb.focus({ preventScroll: true });
}
function closeDrawer() { if (!drawerOpen) return; const d = $('#drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('on'); drawerOpen = false; if (d._opener && d._opener.focus && d._opener.isConnected) try { d._opener.focus({ preventScroll: true }); } catch (e) {} }

function activate(target, ev) {
  const a = target.closest('[data-src]'), b = target.closest('[data-open]');
  let pick = null;
  if (a && b) pick = b.contains(a) ? 'src' : (a.contains(b) ? 'open' : 'src'); else if (a) pick = 'src'; else if (b) pick = 'open';
  if (pick === 'src') { openDrawer(a.dataset.src, a); return true; }
  if (pick === 'open') {
    if (b.classList.contains('pin')) { b.classList.add('drop'); setTimeout(() => openPanel(b.dataset.open, b), 420); } else openPanel(b.dataset.open, b);
    return true;
  }
  return false;
}

/* ======================= ESTADO, SLIDES E NAVEGAÇÃO ======================= */
let state = { i: -1, step: 0 }, started = false, lastCmd = 0;
function enterSlide(i) {
  const s = slides[i]; clearTimers();
  body.dataset.s = i + 1; if (i === 7 && !LITE) body.classList.add('in-matrix'); else body.classList.remove('in-matrix');
  const c3 = $('#cit3'); if (c3) c3.classList.remove('err');
  const lk = $('#lock'); if (lk) { lk.classList.remove('open', 'block'); $('#pinT') && $('#pinT').classList.remove('fail', 'block'); slides[3].classList.remove('blocked'); }
  if (i === 1) at(4300, () => c3 && c3.classList.add('err'));
  if (i === 3) { at(2900, () => lk.classList.add('open')); at(4800, () => { lk.classList.remove('open'); lk.classList.add('block'); $('#pinT').classList.add('fail', 'block'); slides[3].classList.add('blocked'); }); }
  if (STATIC && i === 3) { lk.classList.remove('open'); }
  if (i === 4) HOOK.arc(STATIC);
  countUp(s);
  enterFx(s);
  if (STATIC && i === 8) HOOK.count('446', '2026');
}
function leaveSlide(i) { if (i < 0) return; clearTimers(); leaveFx(); }
function setStep(i, step) {
  const s = slides[i]; if (!meta.steps[i]) { delete s.dataset.step; return; }
  const prev = +s.dataset.step || 0; s.dataset.step = STATIC ? meta.steps[i] : step;
  if (i === 7) {
    const st = +s.dataset.step; const rt = $('.rt', s); if (rt) rt.classList.toggle('block', st >= 2);
    $$('.wd', s).forEach((w, k) => w.classList.toggle('on', k + 1 === st && step !== prev && !STATIC));
    HOOK.kick = 1;
  }
}
function updateChrome() {
  const s = slides[state.i]; updateTrail(state.i);
  $('#notesbar').textContent = ($('.notes', s) || {}).textContent || '';
  try { const h = state.i >= NMAIN ? 'R' + (state.i - NMAIN + 1) : String(state.i + 1); history.replaceState(null, '', location.pathname + (location.search || '') + '#' + h); } catch (e) {}
}
function show(st, opts) {
  opts = opts || {}; const prev = state.i, changed = st.i !== prev; const old = state; state = st;
  const apply = () => {
    if (changed) { leaveSlide(prev); if (prev >= 0) slides[prev].classList.remove('active'); slides[st.i].classList.add('active'); enterSlide(st.i); }
    setStep(st.i, st.step); updateChrome();
  };
  if (changed && started && !opts.instant && !STATIC && !LITE && document.startViewTransition) {
    html.dataset.vt = st.i === 7 ? 'matrix-in' : prev === 7 ? 'matrix-out' : '';
    html.classList.add('vt');
    const vt = document.startViewTransition(apply);
    const endVt = () => { html.classList.remove('vt'); html.dataset.vt = ''; }; vt.ready.catch(() => {}); vt.finished.then(endVt, endVt);
  } else apply();
  started = true; broadcast(); onChange(old);
}
function move(dir) { if (openPanelEl || drawerOpen) return; const n = Core.nav(state, dir, meta); if (n.i !== state.i || n.step !== state.step) show(n); }
function goto(i) { if (i < 0 || i >= slides.length) return; show({ i, step: meta.steps[i] ? 1 : 0 }); }
let returnTo = 0;
function toggleReserve() {
  if (state.i < NMAIN) { returnTo = state.i; goto(NMAIN); }
  else if (state.i < slides.length - 1) goto(state.i + 1); else goto(returnTo);
}

/* ======================= APRESENTADOR E CANAL ======================= */
let bc = null; try { bc = new BroadcastChannel('hnv-deck-v2'); } catch (e) {}
function broadcast() { if (bc && !body.classList.contains('presenter') && !body.classList.contains('thumb')) bc.postMessage({ t: 'state', i: state.i, step: state.step }); }
let startTs = 0, presTimer = 0;
function onChange(old) { if (body.classList.contains('presenter')) renderPres(); }
function renderPres() {
  const el = $('#pres'); if (!el) return; const s = slides[state.i], nx = slides[state.i + 1], inRes = state.i >= NMAIN;
  const nextIdx = nx && (!inRes ? state.i + 1 < NMAIN : true) ? state.i + 1 : -1;
  if (!el.dataset.built) {
    el.dataset.built = 1;
    el.innerHTML = '<h1 id="ph"></h1><div class="fala" id="pf"></div><div><div class="nx"><iframe id="pi" title="próximo slide"></iframe></div><p id="pn" style="margin-top:10px"></p><div class="tm" id="ptm" title="clique para zerar e iniciar">00:00</div><p id="pp"></p></div><div class="bt"><button type="button" id="pb">Anterior</button><button type="button" id="pnx">Próximo</button><span id="pst"></span></div>';
    $('#pb').onclick = () => bc && bc.postMessage({ t: 'cmd', k: 'prev' }); $('#pnx').onclick = () => bc && bc.postMessage({ t: 'cmd', k: 'next' });
    $('#ptm').onclick = () => { startTs = Date.now(); };
    const fit = () => { const w = $('.nx', el).clientWidth; $('#pi').style.transform = 'scale(' + (w / 1920) + ')'; }; addEventListener('resize', fit); setTimeout(fit, 50);
    presTimer = setInterval(tickPres, 300);
  }
  $('#ph').textContent = 'Slide ' + (inRes ? 'R' + (state.i - NMAIN + 1) : state.i + 1) + ' de ' + NMAIN + ' · ' + (s.dataset.title || '') + (meta.steps[state.i] ? ' · passo ' + state.step + '/' + meta.steps[state.i] : '');
  $('#pf').textContent = ($('.notes', s) || {}).textContent || '';
  $('#pn').textContent = nextIdx >= 0 ? 'Próximo: ' + (slides[nextIdx].dataset.title || '') : 'Fim';
  const url = location.href.split('?')[0].split('#')[0] + '?static=1&thumb=1#' + (nextIdx >= 0 ? (nextIdx >= NMAIN ? 'R' + (nextIdx - NMAIN + 1) : nextIdx + 1) : state.i + 1);
  if ($('#pi').dataset.u !== url) { $('#pi').dataset.u = url; $('#pi').src = url; }
  if (!startTs && state.i > 0 && state.i < NMAIN) startTs = Date.now();
  $('#pst').textContent = 'previsto até aqui: ' + Core.fmtTime(Core.planned(tsec.slice(0, NMAIN), Math.min(state.i, NMAIN - 1)));
}
function tickPres() {
  const t = $('#ptm'); if (!t) return; const el = startTs ? (Date.now() - startTs) / 1000 : 0, plan = Core.planned(tsec.slice(0, NMAIN), Math.min(Math.max(state.i, 0), NMAIN - 1));
  t.textContent = Core.fmtTime(el); const late = startTs && el - plan > 15; t.classList.toggle('late', !!late);
  $('#pp').textContent = startTs ? (late ? 'atrasado ' + Core.fmtTime(el - plan) : 'dentro do previsto (limite ' + Core.fmtTime(plan + 15) + ')') : 'cronômetro começa no slide 2';
}
if (bc) bc.onmessage = m => {
  const d = m.data, pres = body.classList.contains('presenter');
  if (d.t === 'state' && pres) { state = { i: d.i, step: d.step }; renderPres(); }
  if (d.t === 'cmd' && !pres && !body.classList.contains('thumb')) { if (d.k === 'next') move(1); else if (d.k === 'prev') move(-1); else if (d.k === 'hello') broadcast(); }
};

/* ======================= ENTRADAS: RODA, CLIQUE, TECLADO, MOUSE ======================= */
const wheel = Core.makeWheel({ thresh: 50, lock: 900 });
function inPres() { return body.classList.contains('presenter') || body.classList.contains('thumb'); }
document.addEventListener('wheel', e => {
  if (inPres()) return;
  if (openPanelEl || drawerOpen) return; // a roda rola o painel (overscroll contido); nunca troca de slide
  e.preventDefault();
  const d = wheel.feed(e.deltaY, e.deltaX, performance.now()); if (d) move(d);
}, { passive: false });
stage.addEventListener('click', e => {
  if (inPres()) return;
  if (e.target.closest('.panel-close')) { if (e.target.closest('#drawer')) closeDrawer(); else closePanel(); return; }
  if (e.target.closest('#scrim')) { closeDrawer(); return; }
  if (e.target.closest('.panel,#drawer')) { activate(e.target, e); return; }
  if (activate(e.target, e)) return;
  if (e.target.closest('a,button')) return;
  const now = performance.now(); if (now - lastCmd < 260) return; lastCmd = now; move(1);
});
stage.addEventListener('contextmenu', e => { if (inPres()) return; e.preventDefault(); if (openPanelEl || drawerOpen) return; const now = performance.now(); if (now - lastCmd < 260) return; lastCmd = now; move(-1); });
document.addEventListener('keydown', e => {
  const k = e.key, pres = body.classList.contains('presenter');
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const foc = document.activeElement;
  if ((k === 'Enter' || k === ' ') && foc && foc.matches && foc.matches('[data-open],[data-src]') && !pres) { e.preventDefault(); activate(foc, e); return; }
  if (k === 'Escape') { if (drawerOpen) closeDrawer(); else if (openPanelEl) closePanel(); return; }
  if (pres) { if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); bc && bc.postMessage({ t: 'cmd', k: 'next' }); } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); bc && bc.postMessage({ t: 'cmd', k: 'prev' }); } return; }
  if (openPanelEl || drawerOpen) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); move(1); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); move(-1); }
  else if (k === 'Home') goto(0); else if (k === 'End') goto(NMAIN - 1);
  else if (k === 'n' || k === 'N') $('#notesbar').classList.toggle('on');
  else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen && html.requestFullscreen(); }
  else if (k === 'p' || k === 'P') window.open(location.href.split('?')[0].split('#')[0] + '?presenter=1', 'hnvpres', 'width=1200,height=800');
  else if (k === 'r' || k === 'R') toggleReserve();
  else if (/^[1-6]$/.test(k)) { const ids = [...new Set($$('[data-open]', slides[state.i]).map(x => x.dataset.open))]; const id = ids[+k - 1]; if (id) openPanel(id, document.activeElement); }
});
addEventListener('mousemove', e => { HOOK.mx = (e.clientX / innerWidth - .5) * 2; HOOK.my = (e.clientY / innerHeight - .5) * 2; if (!STATIC) { stage.style.setProperty('--px', (-HOOK.mx * 12).toFixed(1) + 'px'); stage.style.setProperty('--py', (-HOOK.my * 12).toFixed(1) + 'px'); } });
function fit() { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')'; }
addEventListener('resize', fit); fit();
addEventListener('beforeprint', () => { body.classList.add('static'); bakeAll(); });

/* ======================= INÍCIO ======================= */
buildDynamic(); buildPanels();
if (document.fonts && document.fonts.load) { ['italic 400 40px "Source Serif 4"', '700 40px Archivo', '900 90px Archivo'].forEach(f => document.fonts.load(f).catch(() => {})); }
if (body.classList.contains('presenter')) {
  state = { i: 0, step: 0 }; renderPres(); if (bc) bc.postMessage({ t: 'cmd', k: 'hello' });
} else {
  const i0 = Core.parseHash(location.hash, NMAIN, slides.length);
  show({ i: i0, step: meta.steps[i0] ? 1 : 0 }, { instant: true });
  if (body.classList.contains('thumb')) addEventListener('hashchange', () => { const i = Core.parseHash(location.hash, NMAIN, slides.length); show({ i, step: meta.steps[i] ? meta.steps[i] : 0 }, { instant: true }); });
  if (STATIC && !body.classList.contains('thumb')) { let k = 0; const nxt = () => { if (k < slides.length) { bakeSlide(slides[k++]); setTimeout(nxt, 40); } }; setTimeout(nxt, 300); }
  if (P.has('open')) { const ids = [...new Set($$('[data-open]', slides[state.i]).map(x => x.dataset.open))]; const id = ids[+P.get('open') - 1]; if (id) openPanel(id); }
  if (P.has('src')) openDrawer(P.get('src'));
}
if (P.has('selftest')) { const sc = document.createElement('script'); sc.src = 'qa/selftest.js'; document.body.appendChild(sc); }
root.HNV_DECK = { Core, show, goto, move, state: () => state };
})(typeof window !== 'undefined' ? window : globalThis);
