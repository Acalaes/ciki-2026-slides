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
// Roda do mouse: pula um slide inteiro e mostra o slide já pronto (todos os passos), sem parar nos passos.
Core.navSlide = function (st, dir, meta) {
  const i = st.i, n = i + dir;
  if (n < 0 || n >= meta.steps.length || meta.group[n] !== meta.group[i]) return { i, step: st.step };
  return { i: n, step: meta.steps[n] || 0 };
};
Core.parseHash = function (h, nMain, nTotal) {
  h = (h || '').replace('#', '');
  if (/^r\d$/i.test(h)) { const k = nMain + (+h.slice(1)) - 1; return k < nTotal ? k : 0; }
  const n = parseInt(h, 10);
  if (!isNaN(n) && n > nMain) return Math.min(nTotal - 1, n - 1);
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
// a apresentação é conduzida por quem apresenta: só vira estática com ?static (ou ?reduzir, que respeita a configuração do sistema)
if ((P.has('static') || (reduced && P.has('reduzir'))) && !P.has('anim')) body.classList.add('static');
if (P.has('lite')) body.classList.add('lite');
if (P.has('presenter')) body.classList.add('presenter');
if (P.has('thumb')) body.classList.add('thumb');
if (P.has('only3d')) body.classList.add('only3d');
const STATIC = body.classList.contains('static'), LITE = body.classList.contains('lite');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eo = t => 1 - Math.pow(1 - t, 3);
function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const C = { noite: '#0b0c10', gelo: '#f4f4f5', teal: '#2b9bdc', claro: '#4db3ea', slate: '#a1a1aa', err: '#f87171', amb: '#f87171', nevoa: '#a1a1aa', aco: '#2b9bdc', azul: '#15181f' };
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
function plain(ctx, s, x, y, size, col, al, align, wt) {
  ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = al == null ? 1 : al; ctx.textAlign = align || 'left';
  ctx.font = (wt || 600) + ' ' + size + 'px Poppins,Arial,sans-serif'; ctx.fillText(s, x, y); ctx.restore();
}
/* ======================= CENA 2D (só a chuva da demo) ======================= */
const SCENES = {};
const HOOK = { kick: 0, mx: 0, my: 0 };

SCENES.s8 = function () { return root.HNV_SCENE8 ? root.HNV_SCENE8({ rng, HOOK, LITE, STATIC }) : { T: 1, frame() {} }; };

/* ======================= CAPA E FECHO: ARNÊS (HARNESS) EM 3D ======================= */
const v3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
function catmull(pts, closed, n) {
  const out = [], m = pts.length, g = i => closed ? pts[(i + m) % m] : pts[Math.max(0, Math.min(m - 1, i))], segs = closed ? m : m - 1;
  for (let s = 0; s < segs; s++) for (let k = 0; k < n / segs; k++) {
    const t = k / (n / segs), p0 = g(s - 1), p1 = g(s), p2 = g(s + 1), p3 = g(s + 2), t2 = t * t, t3 = t2 * t;
    out.push([0, 1, 2].map(i => .5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3)));
  }
  if (!closed) out.push(pts[m - 1]);
  return out;
}
function ellipse(cx, cy, cz, rx, rz, n, tilt) { const a = []; for (let i = 0; i < n; i++) { const t = i / n * 6.2832; a.push([cx + rx * Math.cos(t), cy + (tilt || 0) * Math.cos(t), cz + rz * Math.sin(t)]); } return a; }
const HG = (function () {
  const A = [[-.95, 1.7, 0], [-.85, 1.1, .6], [-.3, .4, .8], [.3, -.25, .82], [.85, -.85, .6], [.95, -1.2, 0], [.85, -.85, -.6], [.3, -.25, -.82], [-.3, .4, -.8], [-.85, 1.1, -.6]];
  const B = A.map(p => [-p[0], p[1], p[2]]);
  const straps = [
    { pts: catmull(A, true, 160), closed: true, hw: .15, out: p => [p[0], 0, p[2]] },
    { pts: catmull(B, true, 160), closed: true, hw: .15, out: p => [p[0], 0, p[2]] },
    { pts: catmull(ellipse(0, -.55, 0, 1.2, .88, 12), true, 160), closed: true, hw: .22, out: p => [p[0], 0, p[2]] },
    { pts: catmull(ellipse(-.6, -1.5, 0, .46, .46, 8, .08), true, 90), closed: true, hw: .16, out: p => [p[0] + .6, 0, p[2]] },
    { pts: catmull(ellipse(.6, -1.5, 0, .46, .46, 8, .08), true, 90), closed: true, hw: .16, out: p => [p[0] - .6, 0, p[2]] }
  ];
  [-.6, .6].forEach(cx => [1, -1].forEach(s => straps.push({ pts: catmull([[cx, -.55, .84 * s], [cx, -1.05, .62 * s], [cx, -1.5, .46 * s]], false, 40), closed: false, hw: .12, out: () => [0, 0, s] })));
  const core = [], edges = [];
  for (let l = 0; l < 4; l++) for (let b = 0; b < 3; b++) for (let a = 0; a < 3; a++) core.push([(a - 1) * .36, .42 + (b - 1) * .36, -.45 + l * .3, l]);
  for (let i = 0; i < core.length; i++) for (let j = 0; j < core.length; j++) if (core[j][3] === core[i][3] + 1) edges.push([i, j]);
  const anchors = [{ k: 'Evidência', p: [0, .12, .9], o: [0, .02, .5], w: .5, h: .36 }, { k: 'Normas', p: [-1.22, -.55, 0], o: [-.95, 0, 0], w: .36, h: .5 }, { k: 'Rastro', p: [1.22, -.55, 0], o: [.9, 0, 0], w: .36, h: .5 }];
  const dring = [0, -.55, .93];
  return { straps, core, edges, anchors, dring };
})();
function letterTexture(THREE, word) {
  const c = document.createElement('canvas'); c.width = 400; c.height = 110; const x = c.getContext('2d');
  x.fillStyle = 'rgba(11,12,16,.88)'; x.strokeStyle = C.claro; x.lineWidth = 4;
  x.beginPath(); if (x.roundRect) x.roundRect(4, 4, 392, 102, 14); else x.rect(4, 4, 392, 102); x.fill(); x.stroke();
  x.fillStyle = C.gelo; x.textAlign = 'center'; x.textBaseline = 'middle'; let fs = 54; x.font = '600 ' + fs + 'px Poppins,Arial,sans-serif'; while (x.measureText(word).width > 360 && fs > 26) { fs -= 2; x.font = '600 ' + fs + 'px Poppins,Arial,sans-serif'; } x.fillText(word, 200, 58);
  return new THREE.CanvasTexture(c);
}
function ribbonGeo(THREE, s) {
  const pts = s.pts, n = pts.length, pos = new Float32Array(n * 6), idx = [], m = s.closed ? n : n - 1;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[s.closed ? (i + 1) % n : Math.min(n - 1, i + 1)], r = pts[s.closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
    const T = v3.norm(v3.sub(q, r)), W = v3.norm(v3.cross(T, v3.norm(s.out(p))));
    for (let k = 0; k < 3; k++) { pos[i * 6 + k] = p[k] + W[k] * s.hw; pos[i * 6 + 3 + k] = p[k] - W[k] * s.hw; }
  }
  for (let i = 0; i < m; i++) { const a = 2 * i, b = a + 1, c = 2 * ((i + 1) % n), d = c + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); g.userData = { total: idx.length, segs: m };
  return g;
}
function makeCover3D(canvas) {
  const THREE = root.THREE; if (!THREE) return null;
  let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !LITE, alpha: true, preserveDrawingBuffer: true }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setSize(1920, 1080, false); renderer.setPixelRatio(1); renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1920 / 1080, .1, 100); cam.position.set(0, 0, 10);
  const G = new THREE.Group(); G.position.set(1.45, -1.1, 0); G.scale.setScalar(.98); scene.add(G);
  const L = new THREE.Group(); L.position.copy(G.position); L.scale.copy(G.scale); scene.add(L); // etiquetas e linhas não giram
  scene.add(new THREE.AmbientLight(0x8a9a98, .6));
  const dl = new THREE.DirectionalLight(0xf4f4f5, .95); dl.position.set(3, 4, 6); scene.add(dl);
  const pl = new THREE.PointLight(0x2b9bdc, 1.6, 30); pl.position.set(-5, -2, 4); scene.add(pl);
  const gc = document.createElement('canvas'); gc.width = gc.height = 256; const gx = gc.getContext('2d'), gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, 'rgba(43,155,220,.4)'); gg.addColorStop(1, 'rgba(43,155,220,0)'); gx.fillStyle = gg; gx.fillRect(0, 0, 256, 256);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); halo.scale.set(5, 5, 1); halo.position.set(0, .4, -.6); G.add(halo);
  const cn = HG.core, nodeGeo = new THREE.BufferGeometry(), pos = new Float32Array(cn.length * 3), col = new Float32Array(cn.length * 3);
  cn.forEach((p, i) => pos.set([p[0], p[1], p[2]], i * 3)); nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); nodeGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({ size: .17, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); G.add(nodes);
  const ep = new Float32Array(HG.edges.length * 6); HG.edges.forEach((e, i) => { ep.set([cn[e[0]][0], cn[e[0]][1], cn[e[0]][2]], i * 6); ep.set([cn[e[1]][0], cn[e[1]][1], cn[e[1]][2]], i * 6 + 3); });
  const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  const edges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x4db3ea, transparent: true, opacity: .35 })); G.add(edges);
  const web = new THREE.MeshStandardMaterial({ color: 0x0a6aa1, metalness: .2, roughness: .75, side: THREE.DoubleSide, emissive: 0x03211f });
  const straps = HG.straps.map(s => { const m = new THREE.Mesh(ribbonGeo(THREE, s), web); G.add(m); return m; });
  const steel = new THREE.MeshStandardMaterial({ color: 0xa7f3d0, metalness: .8, roughness: .3, emissive: 0x0b3b36 });
  function buckle(w, h) { const g = new THREE.Group(), t = .07; [[0, h / 2, w, t], [0, -h / 2, w, t], [-w / 2, 0, t, h], [w / 2, 0, t, h], [0, 0, w, t * .8]].forEach(a => { const b = new THREE.Mesh(new THREE.BoxGeometry(a[2], a[3], .09), steel); b.position.set(a[0], a[1], 0); g.add(b); }); return g; }
  const bk = []; let lineGeo = null, lineArr = null;
  const LY = [1.0, .35, -.3], LX = 2.55, lp = [];
  HG.anchors.forEach((a, k) => {
    const b = buckle(a.w, a.h); b.position.set(...a.p); b.lookAt(a.p[0] * 3, a.p[1], a.p[2] * 3 + (a.k === 'Evidência' ? 1 : 0)); G.add(b);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: letterTexture(THREE, a.k), transparent: true, depthTest: false })); sp.position.set(LX, LY[k], 0); sp.scale.set(1.25, .34, 1); sp.renderOrder = 10; L.add(sp); bk.push({ b, sp });
    lp.push(a.p[0], a.p[1], a.p[2], LX - .63, LY[k], 0);
  });
  const dgrp = new THREE.Group(); dgrp.position.set(...HG.dring);
  const dmat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, emissive: 0x4db3ea, metalness: .5, roughness: .3 });
  const arc = new THREE.Mesh(new THREE.TorusGeometry(.24, .04, 10, 28, Math.PI), dmat); arc.rotation.z = Math.PI; dgrp.add(arc);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .48, 10), dmat); bar.rotation.z = Math.PI / 2; dgrp.add(bar); G.add(dgrp);
  const hsp = new THREE.Sprite(new THREE.SpriteMaterial({ map: letterTexture(THREE, 'Humano'), transparent: true, depthTest: false })); hsp.position.set(LX, -.95, 0); hsp.scale.set(1.25, .34, 1); lp.push(HG.dring[0], HG.dring[1], HG.dring[2], LX - .63, -.95, 0); const cc = [0, 1, 2].map(i => cn.reduce((q, r) => q + r[i], 0) / cn.length);
  const XL = [{ k: 'IA neural', g: cc, y: .9 }, { k: 'Harness simbólico', g: [-1.15, -.62, .3], y: -.2 }], xsp = [];
  XL.forEach(x => { lp.push(x.g[0], x.g[1], x.g[2], -LX + .63, x.y, 0); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: letterTexture(THREE, x.k), transparent: true, depthTest: false })); sp.position.set(-LX, x.y, 0); sp.scale.set(1.25, .34, 1); sp.renderOrder = 10; sp.material.opacity = 0; sp.visible = false; L.add(sp); xsp.push(sp); });
  { const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3)); lineGeo = lg; lineArr = lg.attributes.position.array; L.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4db3ea, transparent: true, opacity: .45 }))); } hsp.renderOrder = 10; L.add(hsp);
  const cols = nodeGeo.attributes.color;
  const FP = HG.anchors.map(a => a.p).concat([HG.dring]), tv = new THREE.Vector3();
  function updLines() {
    if (!lineArr) return; G.updateMatrixWorld(true); L.updateMatrixWorld(true);
    FP.concat(XL.map(x => x.g)).forEach((q, i) => { tv.set(q[0], q[1], q[2]); G.localToWorld(tv); L.worldToLocal(tv); lineArr[i * 6] = tv.x; lineArr[i * 6 + 1] = tv.y; lineArr[i * 6 + 2] = tv.z; });
    lineGeo.attributes.position.needsUpdate = true;
  }
  const api = {
    canvas, renderer, ok: true, done: false, yaw: -.15, pitch: 0, focus: -1, pauseUntil: 0, lt: null,
    setFocus(k) { if (k < 0 && api.focus >= 0) api.yaw = G.rotation.y; api.focus = k; api.pauseUntil = performance.now() + 8000; },
    drag(dx, dy) { if (api.focus >= 0) api.setFocus(-1); api.yaw += dx * .008; api.pitch = Math.max(-.5, Math.min(.6, api.pitch + dy * .004)); api.pauseUntil = performance.now() + 6000; },
    labelBoxes() {
      G.updateMatrixWorld(true); L.updateMatrixWorld(true); const ppu = 1080 / (2 * 10 * Math.tan(17.5 * Math.PI / 180)), v = new THREE.Vector3();
      return [[LX, LY[0]], [LX, LY[1]], [LX, LY[2]], [LX, -.95]].map(q => { v.set(q[0], q[1], 0); L.localToWorld(v); v.project(cam); const w = 1.25 * .98 * ppu, h = .34 * .98 * ppu; return { x: (v.x + 1) / 2 * 1920 - w / 2, y: (1 - v.y) / 2 * 1080 - h / 2, w, h }; });
    },
    render(t, o) {
      o = o || {}; const tt = api.done ? t + 10 : t, dt = api.lt == null ? 0 : Math.max(0, Math.min(.1, t - api.lt)); api.lt = t;
      if (!api.done && !o.fixed && performance.now() > api.pauseUntil && api.focus < 0) api.yaw += dt * .22; // giro lento de vitrine
      let rotY = o.fixed ? -.42 : api.done ? Math.sin(t * .35) * .5 - .15 + HOOK.mx * .1745 : api.yaw;
      if (api.focus >= 0 && !o.fixed && !api.done) { const fy = -Math.atan2(FP[api.focus][0], FP[api.focus][2]); rotY = fy + Math.PI * 2 * Math.round((G.rotation.y - fy) / (Math.PI * 2)); }
      const rotX = o.fixed ? .12 : api.done ? .1 + HOOK.my * .1745 : .1 + api.pitch + HOOK.my * .03;
      G.rotation.y += (rotY - G.rotation.y) * (o.fixed ? 1 : .08); G.rotation.x += (rotX - G.rotation.x) * (o.fixed ? 1 : .08);
      straps.forEach((m, k) => { const g = m.geometry.userData, p = ease(clamp((tt - .12 * k) / 1.5, 0, 1)); m.geometry.setDrawRange(0, Math.floor(g.segs * p) * 6); m.visible = p > 0; });
      bk.forEach((b, k) => { const s = eo(clamp((tt - 1.5 - .2 * k) / .6, 0, 1)); b.b.scale.setScalar(Math.max(.001, s * (api.focus === k ? 1.6 : 1))); b.sp.scale.set(1.25 * (api.focus === k ? 1.15 : 1), .34 * (api.focus === k ? 1.15 : 1), 1); const l = clamp((tt - 2.8 - .25 * k) / .5, 0, 1); b.sp.material.opacity = l; b.sp.visible = l > 0; });
      const hs = eo(clamp((tt - 2.3) / .6, 0, 1)); dgrp.scale.setScalar(Math.max(.001, hs * (api.focus === 3 ? 1.6 : 1))); hsp.scale.set(1.25 * (api.focus === 3 ? 1.15 : 1), .34 * (api.focus === 3 ? 1.15 : 1), 1); const hl = clamp((tt - 3.5) / .5, 0, 1); hsp.material.opacity = hl; hsp.visible = hl > 0;
      const core = .3 + .7 * clamp((tt - 2.2) / 1.2, 0, 1);
      for (let i = 0; i < cn.length; i++) { const l = cn[i][3], v = core * (.55 + .45 * Math.sin(tt * 2.4 - l * 1.2 + i * .9)); cols.setXYZ(i, .25 * v, .9 * v, .8 * v); }
      cols.needsUpdate = true; edges.material.opacity = .2 + .4 * core; halo.material.opacity = .3 + .7 * core;
      xsp.forEach((sp, i) => { const l = clamp((tt - 3.4 - .3 * i) / .5, 0, 1); sp.material.opacity = l; sp.visible = l > 0; }); updLines();
      renderer.render(scene, cam);
    }
  };
  return api;
}
function makeCover2D(canvas) {
  const ctx = canvas.getContext('2d');
  const proj = (p, ry, rx) => { const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx); let x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1] * cx - z * sx; z = p[1] * sx + z * cx; const k = 10 / (10 - z); return [1400 + x * k * 140, 640 - y * k * 140, z, k]; };
  return {
    canvas, ok: true, done: false,
    render(t, o) {
      o = o || {}; const tt = this.done ? t + 10 : t, ry = o.fixed ? -.42 : Math.sin(t * .35) * .5 - .15 + HOOK.mx * .1745, rx = o.fixed ? .12 : .1 + HOOK.my * .1745;
      ctx.clearRect(0, 0, 1920, 1080);
      const core = .3 + .7 * clamp((tt - 2.2) / 1.2, 0, 1), P = HG.core.map(p => proj(p, ry, rx));
      ctx.strokeStyle = '#4db3ea'; ctx.globalAlpha = .15 + .35 * core; ctx.lineWidth = 1.2; ctx.beginPath(); HG.edges.forEach(e => { ctx.moveTo(P[e[0]][0], P[e[0]][1]); ctx.lineTo(P[e[1]][0], P[e[1]][1]); }); ctx.stroke();
      ctx.fillStyle = C.gelo; P.forEach((p, i) => { ctx.globalAlpha = core * (.55 + .4 * Math.sin(tt * 2.4 + i)); ctx.beginPath(); ctx.arc(p[0], p[1], 6 * p[3], 0, 6.283); ctx.fill(); });
      HG.straps.forEach((s, k) => { const n = Math.floor(s.pts.length * ease(clamp((tt - .12 * k) / 1.5, 0, 1))); if (n < 2) return; ctx.strokeStyle = '#0a6aa1'; ctx.lineWidth = s.hw * 140 * 1.6; ctx.lineJoin = 'round'; ctx.globalAlpha = .95; ctx.beginPath(); for (let i = 0; i < n; i++) { const q = proj(s.pts[i], ry, rx); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } if (s.closed && n >= s.pts.length) ctx.closePath(); ctx.stroke(); });
      HG.anchors.concat([{ k: 'Humano', p: [HG.dring[0], HG.dring[1] - .1, HG.dring[2]] }]).forEach((a, k) => { const q = proj(a.p, ry, rx), l = clamp((tt - 2.8 - .25 * k) / .5, 0, 1); ctx.globalAlpha = l; ctx.fillStyle = 'rgba(11,12,16,.88)'; ctx.strokeStyle = C.claro; ctx.lineWidth = 3; ctx.fillRect(q[0] - 100, q[1] - 26, 200, 52); ctx.strokeRect(q[0] - 100, q[1] - 26, 200, 52); plain(ctx, a.k, q[0], q[1] + 12, 32, C.gelo, l, 'center', 600); });
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
/* Prova 2: botões Pausar/Continuar e Reiniciar. Reiniciar volta ao começo e toca os 3 passos sozinhos (5 s cada); os passos manuais por teclado continuam valendo. */
const MX = { paused: false, timers: [] };
function mxClear() { MX.timers.forEach(clearTimeout); MX.timers = []; }
function mxPlay(from) { mxClear(); for (let k = from; k <= 3; k++) MX.timers.push(setTimeout(() => { if (!MX.paused && (+slides[state.i].dataset.step || 0) < k) show({ i: state.i, step: k }); }, (k - from) * 5000 + 300)); }
function mxLabel() { const b = document.querySelector('.s8 [data-mx="pause"]'); if (b) b.textContent = MX.paused ? 'Continuar' : 'Pausar'; }
function mxAct(a) {
  if (!isDemo(state.i)) return;
  if (a === 'restart') {
    MX.paused = false; mxLabel();
    if (active && !rafId) { tLast = performance.now(); loop(tLast); }
    show({ i: state.i, step: 0 }); mxPlay(1); return;
  }
  MX.paused = !MX.paused; mxLabel();
  if (MX.paused) { mxClear(); cancelAnimationFrame(rafId); rafId = 0; }
  else { if (active && !rafId) { tLast = performance.now(); loop(tLast); } const st = +slides[state.i].dataset.step || 0; if (st < 3) mxPlay(st + 1); }
}
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-mx]'); if (!b) return; e.stopPropagation(); e.preventDefault(); mxAct(b.dataset.mx); b.blur(); }, true);
function sceneFor(name) {
  if (name === 'cover' || name === 'cover12') return null;
  return SCENES[name] ? (SCENES[name].inst || (SCENES[name].inst = SCENES[name]())) : null;
}
function leaveFx() {
  MX.paused = false; mxClear(); mxLabel();
  cancelAnimationFrame(rafId); rafId = 0; active = null;
  if (cv2.parentNode) cv2.parentNode.removeChild(cv2);
  if (cvGL && cvGL.parentNode) cvGL.parentNode.removeChild(cvGL);
}
const HLNOME = ['Evidência', 'Normas', 'Rastro', 'Humano'];
const HLTXT = ['Cada afirmação aponta para um documento que a sustenta.', 'Regras explícitas definem o que pode ser liberado.', 'Cada passo fica registrado para a auditoria.', 'Uma pessoa revisa e assina a decisão final.'];
function buildCoverUI(slot, c) { // capa: clicar nas etiquetas destaca a peça; arrastar gira o arnês
  slot.querySelectorAll('.lbhit').forEach(n => n.remove());
  const cap = slot.parentNode.querySelector('.hlcap');
  const show = k => { c.setFocus(k); if (cap) { cap.classList.toggle('on', k >= 0); if (k >= 0) cap.innerHTML = '<b>' + HLNOME[k] + '</b>' + HLTXT[k]; } };
  c.labelBoxes().forEach((b, k) => {
    const el = document.createElement('button'); el.className = 'lbhit'; el.type = 'button'; el.setAttribute('aria-label', HLNOME[k] + ': destacar no arnês');
    el.style.cssText = 'left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px';
    el.addEventListener('click', e => { e.stopPropagation(); show(c.focus === k ? -1 : k); });
    slot.appendChild(el);
  });
  const hb = slot.parentNode.querySelector('.hitbox[data-open="s1-paleta"]');
  if (hb && !hb._drag) {
    hb._drag = 1; hb.style.touchAction = 'none'; let sx = 0, sy = 0, lx = 0, ly = 0, down = false, moved = false;
    hb.addEventListener('pointerdown', e => { if (e.button !== 0) return; down = true; moved = false; sx = lx = e.clientX; sy = ly = e.clientY; });
    addEventListener('pointermove', e => { if (!down) return; if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return; moved = true; const k = 1920 / stage.getBoundingClientRect().width; cover.c.drag((e.clientX - lx) * k, (e.clientY - ly) * k); lx = e.clientX; ly = e.clientY; });
    addEventListener('pointerup', () => { if (down && moved) { const blk = ev => { ev.stopPropagation(); ev.preventDefault(); }; stage.addEventListener('click', blk, { capture: true, once: true }); setTimeout(() => stage.removeEventListener('click', blk, true), 60); } down = false; });
  }
  if (P.has('focus')) show(+P.get('focus'));
}
function enterFx(slide) {
  leaveFx();
  if (slide.classList.contains('matrix') && !STATIC && !LITE) mxPlay(1);
  const slot = $('.fxslot', slide); if (!slot) return;
  const name = slot.dataset.fx;
  if (STATIC || LITE) { bakeSlide(slide); if (STATIC) return; }
  if (name === 'cover' || name === 'cover12') {
    if (LITE) return;
    const c = coverFor(name === 'cover12'); const cvs = c.is2d ? cv2 : cvGL; slot.appendChild(cvs);
    if (name === 'cover' && c.labelBoxes) buildCoverUI(slot, c);
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
      img.onerror = () => { try { const c = coverFor(name === 'cover12'); const cvs = c.is2d ? cv2 : cvGL; c.render(5, { fixed: true }); img.onerror = null; const du = cvs.toDataURL('image/png'); img.src = du; if (P.has('dump3d')) { const pre = document.createElement('pre'); pre.id = 'dump3d'; pre.textContent = du; pre.style.display = 'none'; document.body.appendChild(pre); } } catch (e) {} };
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

/* ======================= CONSTRUÇÕES DINÂMICAS ======================= */
/* ======================= HERÓIS DA CAMADA 1 (kit.js + pictogramas) ======================= */
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
const KT = () => root.HNV_KIT;
const OG = (open, inner) => open + inner + '</g>';
const SRC = (key, inner) => '<g data-src="' + key + '">' + inner + '</g>';
const HIT = (x, y, w, h) => '<rect class="hit" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
const PIC2 = (n, o) => KT().pic2 ? KT().pic2(n, o) : '';
const CNT = (x, y, to, size, o) => '<text class="cnt" data-count="' + to + '"' + (o && o.prefix ? ' data-prefix="' + o.prefix + '"' : '') + ' x="' + x + '" y="' + y + '" text-anchor="' + ((o && o.anchor) || 'middle') + '" style="font-size:' + size + 'px;font-weight:800;fill:#fff;stroke:none">' + fmtBR(to) + '</text>';
const TRACK = (d, n, dur, red) => '<path class="trk" d="' + d + '"/>' + (red ? '' : Array.from({ length: n }, (_, i) => '<circle class="prt" r="7"><animateMotion dur="' + dur + 's" begin="' + (i * dur / n).toFixed(2) + 's" repeatCount="indefinite" path="' + d + '"/></circle>').join(''));
const HEROES = {};
/* fontes com imagem de comprovação na camada 2: qualquer clique em data-src dessas chaves abre a página do PDF ou a captura */
const FONTE_PAGINA = { dahl: 'fonte-dahl', magesh: 'fonte-magesh', charlotin: 'fonte-charlotin' };

HEROES.s2 = K => {
  const M = window.MUNDO || { all: '', usa: '', bra: '' };
  const paises = [['EUA', -98, 39, 1514], ['Canadá', -106, 57, 238], ['Austrália', 134, -25, 112], ['Reino Unido', -2, 54, 76], ['Israel', 35, 31, 58], ['Brasil', -52, -10, 41], ['Índia', 79, 22, 16], ['Itália', 12, 42, 15], ['França', 2, 46, 14], ['Alemanha', 10, 51, 11]];
  const rotulo = { 'EUA': '1.514', 'Canadá': '238', 'Austrália': '112', 'Reino Unido': '76', 'Brasil': '41' };
  let b = '', r = '';
  paises.forEach(p => {
    const x = (p[1] + 180) / 360 * 1600, y = (90 - p[2]) / 180 * 800, rad = 2.3 * Math.sqrt(p[3]);
    b += '<circle class="bol" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rad.toFixed(1) + '"/>';
    if (rotulo[p[0]]) r += '<text class="rot" x="' + x.toFixed(1) + '" y="' + (p[0] === 'EUA' ? y + 10 : y - rad - 8).toFixed(1) + '" text-anchor="middle">' + rotulo[p[0]] + '</text>';
  });
  return '<svg class="mundo" viewBox="0 70 1600 700" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa-múndi com os casos de alucinação em tribunais por país">' +
    '<g data-src="charlotin" aria-label="Casos por país: ver a captura da base de Charlotin"><rect width="1600" height="800" fill="rgba(0,0,0,.01)"/>' +
    '<path class="terra" d="' + M.all + '"/><path class="p-usa" d="' + M.usa + '"/><path class="p-bra" d="' + M.bra + '"/>' + b + r + '</g></svg>';
};
/* slide 2: zoom do mapa por passo (0 mundo, 1 EUA, 2 Brasil) */
const MUNDO_CAIXAS = [[0, 70, 1600, 700], [0, 70, 1600, 700], [190, 153, 400, 160], [310, 366, 500, 200]];
let mundoRaf = 0;
function zoomMundo(s, step) {
  const svg = $('svg.mundo', s); if (!svg) return;
  const to = MUNDO_CAIXAS[Math.max(0, Math.min(3, step))];
  const from = (svg.getAttribute('viewBox') || '0 70 1600 700').split(/\s+/).map(Number);
  cancelAnimationFrame(mundoRaf);
  if (STATIC || LITE || JUMP) { svg.setAttribute('viewBox', to.join(' ')); return; }
  const t0 = performance.now(), d = 1300, ease = q => q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
  (function f(now) { const q = Math.min(1, (now - t0) / d), e = ease(q); svg.setAttribute('viewBox', from.map((v, i) => (v + (to[i] - v) * e).toFixed(2)).join(' ')); if (q < 1) mundoRaf = requestAnimationFrame(f); })(t0);
}

HEROES.s3 = K => {
  const l1 = K.lane({ x: 0, y: 10, w: 1600, h: 270, t: 'Depois', size: 36, step: 1 }) + K.node({ cx: 520, cy: 120, r: 44, step: 2 }) + K.text({ x: 520, y: 215, t: 'Decisão', size: 34, anchor: 'middle' }) +
    K.arrow({ pts: [[574, 120], [790, 120]], step: 3 }) + K.node({ cx: 880, cy: 120, r: 80, t: 'Dano', size: 36, tone: 'err', fill: true, step: 4 }) +
    K.arrow({ pts: [[970, 120], [1230, 120]], tone: 'late', dash: true, step: 5 }) + K.ring({ cx: 1320, cy: 120, r: 80, dash: true, tone: 'late', step: 6 }) + K.text({ x: 1320, y: 240, t: 'IA explicável (XAI)', size: 34, anchor: 'middle', tone: 'late' });
  const sh = [480, 620, 760].map((x, i) => K.pic('verificar', { x, y: 420, s: 100, pos: 'none', step: 8 + i })).join('');
  const l2 = K.lane({ x: 0, y: 340, w: 1600, h: 270, t: 'Antes', size: 36, step: 7 }) + sh + K.text({ x: 660, y: 575, t: 'Verificações', size: 34, anchor: 'middle', step: 11 }) +
    K.arrow({ pts: [[890, 470], [1230, 470]], step: 12 }) + K.node({ cx: 1320, cy: 470, r: 64, fill: 'solid', step: 13 }) + K.text({ x: 1320, y: 585, t: 'Decisão', size: 34, anchor: 'middle', step: 13 });
  return K.svg(1600, 720, OG('<g data-open=\"s3-tab1\" aria-label=\"Explicar depois: decisão, dano, explicação tardia. Ver a Tabela 1 do artigo\">', HIT(0, 0, 1600, 290) + l1) +
    OG('<g data-open=\"s3-rudin\" aria-label=\"Verificar antes: portões antes da decisão. Ver Rudin 2019\">', HIT(0, 330, 1600, 290) + l2), 'Duas linhas do tempo: explicar depois do dano ou verificar antes da decisão');
};

const PINOS = { E: '<g data-open="s4-pinoE" aria-label="Evidência: ver a explicação">', N: '<g data-open="s4-pinoN" aria-label="Normas: ver a explicação">', T: '<g data-open="s4-pinoT" aria-label="Rastro: ver a explicação">', H: '<g data-open="s4-pinoH" aria-label="Humano: ver a explicação">' };
HEROES.s4 = K => {
  const xs = [175, 515, 855, 1195], nomes = [['evidencia', 'Evidência', 'E'], ['normas', 'Normas', 'N'], ['rastro', 'Rastro', 'T'], ['humano', 'Humano', 'H']];
  let g = '';
  nomes.forEach((n, i) => {
    const falta = i === 2, cx = xs[i];
    g += OG(PINOS[n[2]], HIT(cx - 110, 20, 220, 340) + K.pic(n[0], { x: cx - 75, y: 40, s: 150, size: 38, tone: falta ? 'block' : 'gelo', step: 1 + i }) +
      (falta ? K.text({ x: cx, y: 270, t: 'não registrado', size: 30, anchor: 'middle', tone: 'block', step: 4 }) : '') +
      K.arrow({ pts: [[cx, falta ? 292 : 270], [cx, 360]], tone: falta ? 'block' : 'gelo', dash: falta, step: 5 }));
  });
  g += K.arrow({ pts: [[175, 360], [1195, 360]], noHead: true, step: 5 }) + K.arrow({ pts: [[685, 360], [685, 430]], step: 6 });
  const lock = OG('<g data-open="s4-formula" aria-label="Portão fechado quando falta uma condição: ver a regra que decide">', HIT(540, 420, 290, 230) + K.pic('fechadura', { x: 620, y: 440, s: 130, size: 38, t: 'Portão fechado', tone: 'block', step: 6 }));
  const msg = OG('<g data-open="s4-regras" aria-label="Regra de liberação: ver as regras em forma de código">', HIT(440, 635, 490, 60) + K.text({ x: 685, y: 668, t: 'quando falta uma condição', size: 32, anchor: 'middle', tone: 'nevoa', step: 7 }));
  return K.svg(1600, 720, g + lock + msg, 'Quatro condições levam a um portão; sem o rastro, o portão fica fechado');
};

HEROES.s5 = K => {
  const lanes = K.lane({ x: 0, y: 10, w: 1600, h: 220, t: 'Neural', size: 34, step: 1 }) + K.lane({ x: 0, y: 250, w: 1600, h: 220, t: 'Simbólico', size: 34, step: 1 }) + K.lane({ x: 0, y: 490, w: 1600, h: 220, t: 'Humano', size: 34, step: 1 });
  const pics = K.pic('recuperar', { x: 300, y: 30, s: 100, size: 32, step: 2 }) + K.pic('gerar', { x: 600, y: 30, s: 100, size: 32, step: 3 }) +
    K.pic('verificar', { x: 900, y: 270, s: 100, size: 32, step: 4, fill: true }) + K.pic('registrar', { x: 1200, y: 270, s: 100, size: 32, step: 6 }) + K.pic('aprovar', { x: 1400, y: 510, s: 100, size: 32, step: 7 });
  const arr = K.arrow({ pts: [[410, 80], [590, 80]], step: 3 }) + K.arrow({ pts: [[1010, 320], [1190, 320]], step: 6 }) + K.arrow({ pts: [[1310, 320], [1450, 320], [1450, 500]], step: 7 });
  const ponte = OG('<g data-open=\"s5-ponte\" aria-label=\"Ponte entre o modelo neural e as regras simbólicas: ver como se ligam\">', HIT(690, 40, 280, 250) + K.arrow({ pts: [[710, 80], [950, 80], [950, 262]], step: 4 }));
  const rico = OG('<g data-open=\"s5-dsr\" aria-label=\"Bloqueio devolve ao gerador: ver o método de pesquisa\">', HIT(640, 190, 300, 160) + K.arrow({ pts: [[890, 310], [650, 310], [650, 215]], tone: 'err', dash: true, step: 5 }));
  const part = TRACK('M410 80 L950 80 L950 320 L1450 320 L1450 500', 4, 7) +
    '<circle class="prt err" r="9"><animateMotion dur="5s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0" keyTimes="0;.5;1" path="M890 310 L650 310 L650 215"/></circle>';
  return K.svg(1600, 720, lanes + OG('<g data-open=\"s5-fig1\" aria-label=\"Etapas do sistema: ver a Figura 1 do artigo redesenhada\">', HIT(280, 20, 1260, 600) + pics) + arr + ponte + rico + part, 'Fluxo: recuperar, gerar, verificar, registrar e aprovar, com o bloqueio devolvendo ao gerador');
};

HEROES.s9 = K => {
  const eq = K.pic('gerar', { x: 140, y: 20, s: 200, t: 'Modelo', size: 44, step: 1 }) + K.text({ x: 490, y: 140, t: 'com', size: 40, anchor: 'middle', tone: 'nevoa', step: 2 }) +
    PIC2('arnes', { x: 640, y: 20, s: 200, t: 'Harness', size: 44, step: 3 }) + K.arrow({ pts: [[880, 120], [1100, 120]], step: 4, t: 'forma', tx: 990, ty: 92, size: 36 }) + PIC2('agente', { x: 1140, y: 20, s: 200, t: 'Agente', size: 44, step: 5 });
  return K.svg(1600, 720, eq +
    OG('<g data-open="s5-calais" aria-label="CALAIS, a arquitetura do artigo, é um harness: ver os três níveis">', K.box({ x: 200, y: 400, w: 1200, h: 110, t: 'CALAIS, a arquitetura do artigo, é um harness', size: 40, fill: true, step: 6 })) +
    OG('<g data-open="s9-metodo" aria-label="Quantos artigos usam o termo harness: ver o método da contagem">', K.box({ x: 20, y: 570, w: 760, h: 90, t: 'Quantos artigos usam o termo?', size: 34, step: 7 })) +
    OG('<g data-open="s9-cmu" aria-label="Quanto rende um modelo pequeno com bom harness: ver o estudo da Carnegie Mellon">', K.box({ x: 820, y: 570, w: 760, h: 90, t: 'Modelo pequeno rende quanto?', size: 34, step: 8 })),
    'Modelo com harness forma um agente; CALAIS, a arquitetura do artigo, é um harness');
};

HEROES.s6 = K => {
  const x0 = [80, 480, 880, 1280];
  const cadeia = OG('<g data-open="s6-ontologia" aria-label="Do trecho do artigo à fonte: ver a ontologia do Citāre">', HIT(0, 20, 1600, 320) +
    PIC2('documento', { x: x0[0], y: 40, s: 150, t: 'Afirmação', size: 38, step: 1 }) + K.pic('registrar', { x: x0[1], y: 40, s: 150, t: 'Citação', size: 38, step: 3 }) +
    PIC2('fonte', { x: x0[2], y: 40, s: 150, t: 'Fonte', size: 38, step: 5 }) + K.pic('verificar', { x: x0[3], y: 40, s: 150, t: 'Pronto', size: 38, step: 7, fill: true }) +
    K.arrow({ pts: [[250, 115], [460, 115]], step: 2 }) + K.arrow({ pts: [[650, 115], [860, 115]], step: 4 }) + K.arrow({ pts: [[1050, 115], [1260, 115]], step: 6 }));
  const chips = OG('<g data-open="s6-regras" aria-label="Regras de autoria, ano e identificador: ver o que o verificador exige">', HIT(380, 290, 440, 70) + K.text({ x: 600, y: 336, t: 'autoria, ano e identificador', size: 34, anchor: 'middle', tone: 'nevoa', step: 8 }));
  const onto = OG('<g data-open="s6-triplas" aria-label="Como as peças se ligam: ver exemplos">', K.box({ x: 20, y: 470, w: 760, h: 100, t: 'Como as peças se ligam', size: 38, step: 9 }));
  return K.svg(1600, 720, cadeia + chips + onto, 'Afirmação, citação, fonte e estado pronto como evidência');
};

HEROES.s7 = K => {
  const cal = OG('<g data-open="s7-tab4" aria-label="Período do estudo e comparação com o outro caso: ver a tabela">', HIT(0, 0, 900, 150) + K.pic('calendario', { x: 0, y: 10, s: 120, t: 'Cerca de 191 dias', size: 44, pos: 'right', step: 1 }));
  const envios = OG('<g data-open="s7-logs" aria-label="Mensagens enviadas pelo Corpo de Bombeiros: ver os números dos registros">', HIT(0, 180, 1600, 300) +
    SRC('art-logs', '<text class="cnt" data-count="9054" x="0" y="262" style="font-size:64px;font-weight:800;fill:#fff;stroke:none">9.054</text><text x="250" y="262" style="font-size:44px;font-weight:500;fill:#f4f4f5;stroke:none">mensagens enviadas</text>') +
    K.bar({ x: 0, y: 290, w: 1600, h: 70, v: 9054, max: 9054, step: 3 }) + K.bar({ x: 0, y: 290, w: 1600, h: 70, v: 9054, v0: 6241, max: 9054, tone: 'nevoa', step: 4 }) +
    SRC('art-logs', K.text({ x: 1600, y: 425, t: '2.813 sem sucesso', size: 38, anchor: 'end', step: 4 })));
  const vals = [0, 1.67, 3.33, 5, 15.83, 15.83], ro = [0, 0, 0, 0, 0, 1];
  const nasa = OG('<g data-open="s7-nasa" aria-label="Seis medições de esforço percebido: ver a tabela">', HIT(0, 470, 1600, 230) + '<g transform="translate(0 -45)">' +
    K.text({ x: 0, y: 500, t: 'Esforço percebido, 6 tarefas (de 0 a 100)', size: 36, step: 5 }) + K.arrow({ pts: [[0, 690], [1600, 690]], noHead: true, step: 5 }) +
    vals.map((v, i) => K.dot({ cx: 20 + v * 15.8, cy: 668 - ro[i] * 30, r: 11, step: 6 })).join('') +
    SRC('art-nasa', K.text({ x: 420, y: 650, t: 'Mediana 4,17', size: 36, step: 7 })) + '</g>');
  return K.svg(1600, 720, cal + envios + nasa, 'Período, mensagens enviadas e esforço percebido na operação do Corpo de Bombeiros');
};

HEROES.s10 = K => {
  const cx = 1060, cy = 380;
  const aneis = OG('<g data-open=\"s10-aneis\" aria-label=\"Anéis em volta do modelo: guias, regras duras e ontologia do especialista. Ver a tabela\">', HIT(cx - 320, cy - 320, 640, 640) +
    K.ring({ cx, cy, r: 150, dash: true, step: 2 }) + K.ring({ cx, cy, r: 215, step: 3 }) + K.ring({ cx, cy, r: 280, dash: true, tone: 'nevoa', step: 4 }) +
    Array.from({ length: 12 }, (_, i) => i === 9 ? '' : K.dot({ cx: cx + Math.cos(i / 12 * 6.2832) * 280, cy: cy + Math.sin(i / 12 * 6.2832) * 280, r: 9, tone: 'nevoa', step: 5 })).join('') +
    '<rect x="' + (cx - 60) + '" y="' + (cy - 196) + '" width="120" height="44" rx="8" fill="#0b0c10" fill-opacity=".92"/>' + K.text({ x: cx, y: cy - 164, t: 'Guias', size: 32, anchor: 'middle', step: 2 }) + '<rect x="' + (cx - 130) + '" y="' + (cy - 261) + '" width="260" height="44" rx="8" fill="#0b0c10" fill-opacity=".92"/>' + K.text({ x: cx, y: cy - 229, t: 'Regras duras', size: 32, anchor: 'middle', step: 3 }) +
    '<rect x="' + (cx - 255) + '" y="' + (cy - 326) + '" width="510" height="44" rx="8" fill="#0b0c10" fill-opacity=".92"/>' + K.text({ x: cx, y: cy - 294, t: 'Ontologia do especialista', size: 32, anchor: 'middle', step: 4 }) +
    K.arrow({ pts: [[cx, cy], [cx + 152, cy - 152]], tone: 'block', step: 8 }) + K.dot({ cx: cx + 152, cy: cy - 152, r: 14, tone: 'block', step: 8 }));
  const nucleo = OG('<g data-open=\"s10-nucleo\" aria-label=\"Modelo no centro: ver a camada de regras sobre ele\">', HIT(cx - 80, cy - 80, 160, 160) + K.node({ cx, cy, r: 70, t: 'Modelo', size: 32, fill: true, step: 1 }));
  const humano = OG('<g data-open=\"s10-portao\" aria-label=\"Aprovação humana: ver os domínios candidatos\">', HIT(cx + 250, cy - 120, 150, 240) + '<g transform=\"rotate(40 ' + cx + ' ' + cy + ')\">' + K.ring({ cx, cy, r: 320, v: 22, step: 6 }) + '</g>' + K.text({ x: cx + 345, y: cy + 60, t: 'Humano', size: 32, step: 6 }));
  return K.svg(1600, 720, aneis + nucleo + humano, 'Modelo no centro, guias, regras duras e ontologia em anéis, aprovação humana na saída');
};

HEROES.s11 = K => {
  const nomes = ['Manual', 'Modelo sozinho', 'Busca com modelo', 'Arquitetura completa'], n = [1, 1, 2, 5];
  let g = '';
  nomes.forEach((nm, i) => {
    const y = 20 + i * 165;
    g += K.lane({ x: 0, y, w: 1050, h: 145, t: nm, size: 32, step: 1 + i });
    for (let j = 0; j < n[i]; j++) {
      const x = 470 + j * 110;
      g += K.box({ x, y: y + 40, w: 70, h: 65, t: '', fill: j === n[i] - 1, step: 2 + i }) + (j < n[i] - 1 ? K.arrow({ pts: [[x + 72, y + 72], [x + 108, y + 72]], step: 2 + i }) : '');
    }
  });
  const lim = ['Só em Santa Catarina', 'Só citações', 'Ontologia a validar', 'Hipótese'];
  const locks = OG('<g data-open="s11-limites" aria-label="Quatro limites declarados do estudo: ver cada um">', HIT(1090, 0, 510, 700) +
    K.arrow({ pts: [[1085, 0], [1085, 700]], noHead: true, tone: 'nevoa', step: 6 }) + K.text({ x: 1130, y: 60, t: 'Limites declarados', size: 40, weight: 'b', step: 6 }) +
    lim.map((l, i) => K.pic('fechadura', { x: 1130, y: 120 + i * 140, s: 90, t: l, size: 32, pos: 'right', step: 7 + i })).join(''));
  return K.svg(1600, 720, OG('<g data-open="s11-desenho" aria-label="Quatro métodos comparados: ver o desenho do estudo">', HIT(0, 0, 1060, 700) + g) + locks, 'Quatro métodos em raias e quatro limites declarados do estudo');
};

function renderHero(i) {
  const s = slides[i], h = $('.hero', s); if (!h) return;
  const f = HEROES[[...s.classList].find(c => HEROES[c])], K = KT();
  if (!f || !K) { h.innerHTML = ''; return; }
  h.innerHTML = f(K);
  $$('[data-open],[data-src]', h).forEach(e => { if (!e.hasAttribute('tabindex')) e.tabIndex = 0; if (!e.hasAttribute('role')) e.setAttribute('role', 'button'); if (!e.getAttribute('aria-label') && e.dataset.src) e.setAttribute('aria-label', 'Ver a fonte'); });
}
function buildDynamic() {
  const ticks = $('#ticks'); if (ticks) for (let i = 0; i < 22; i++) { const x = 240 + i * 52; el('line', { x1: x, x2: x, y1: 850, y2: i === 0 || i === 21 ? 930 : 900, class: 'tick' }, ticks); }
  slides.forEach((s, i) => {
    const b = s.dataset.block || ''; const n = ['INTRODUÇÃO', 'PROBLEMA', 'SOLUÇÃO', 'PROVAS', 'FUTURO', 'CONCLUSÃO'].indexOf(b);
    s.dataset.cap = n >= 0 ? n : 6; s.style.setProperty('--cap', CAPCOR[n >= 0 ? n : 6]);
    const hd = document.createElement('div'); hd.className = 'hd'; hd.setAttribute('aria-hidden', 'true');
    hd.innerHTML = '<span class="num">' + (n >= 0 ? String(n + 1).padStart(2, '0') : 'R') + '</span><span class="lab">' + b + '</span>';
    s.insertBefore(hd, s.firstChild.nextSibling);
    const keys = (s.dataset.fontes || '').split(',').map(x => x.trim()).filter(Boolean);
    if (keys.length) {
      let r = $('.rodape', s); if (!r) { r = document.createElement('p'); r.className = 'rodape'; s.appendChild(r); }
      const seen = new Set(), parts = [];
      keys.forEach(k => { const f = FONTES[k]; const ref = f && (f.ref || String(f.fonte || '').split(/[,(]/)[0].slice(0, 48)); if (!ref || seen.has(ref)) return; seen.add(ref); const pg = FONTE_PAGINA[k]; parts.push(pg ? '<span data-open="' + pg + '" tabindex="0" role="button" aria-label="Ver a página do PDF: ' + esc(ref) + '">' + esc(ref) + '</span>' : '<span data-src="' + k + '" tabindex="0" role="button" aria-label="Ver a fonte: ' + esc(ref) + '">' + esc(ref) + '</span>'); });
      r.innerHTML = 'Fontes: ' + parts.join('; ');
    }
    const bgi = $('.bgimg', s); if (bgi && !$('.tint', s)) { const tn = document.createElement('div'); tn.className = 'tint'; bgi.after(tn); }
    renderHero(i);
  });
}
const CAPCOR = ['#f05a28', '#f05a28', '#f05a28', '#f05a28', '#f05a28', '#f05a28', '#f05a28'];

function countUp(root) {
  $$('[data-count]', root).forEach(e => {
    const to = +e.dataset.count, dec = +(e.dataset.dec || 0), pre = e.dataset.prefix || '';
    if (STATIC || JUMP) { e.textContent = pre + fmtBR(to, dec); return; }
    const a = performance.now(), d = 1700;
    (function f(t) { const p = clamp((t - a) / d, 0, 1); e.textContent = pre + fmtBR(to * eo(p), dec); if (p < 1 && e.isConnected && e.closest('.slide.active')) requestAnimationFrame(f); else if (p >= 1) e.textContent = pre + fmtBR(to, dec); })(a);
  });
}

/* ======================= PAINÉIS (camada 2) E GAVETA (camada 3) ======================= */
const PANELS = root.HNV_PANELS || {}, FONTES = root.HNV_FONTES || {}, DET = root.HNV_DETALHES || {};
let openPanelEl = null, lastOpener = null, drawerOpen = false, detailOpen = false, lbOpen = false;
function buildPanels() {
  const ids = new Set($$('[data-open]').map(e => e.dataset.open)); Object.keys(PANELS).forEach(k => { if (k !== 'r3-referencias' && k !== 'r5-creditos') ids.add(k); });
  ids.forEach(id => {
    const s = document.createElement('section'); s.className = 'panel'; s.id = 'panel-' + id; s.dataset.layer = '2'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); s.setAttribute('aria-label', 'Painel ' + id); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<button class="panel-close" type="button" aria-label="Fechar painel (Esc)">fechar · Esc</button>' + (DET[id] ? '<button class="btn-detalhes" type="button" data-id="' + id + '" aria-label="Ver explicação detalhada e prova documental">Ver explicação detalhada</button>' : '') + '<div class="panel-body"></div>';
    $('.panel-body', s).innerHTML = PANELS[id] || '<p class="em-construcao">painel em construção</p>';
    stage.appendChild(s);
  });
  if (!$('#detail')) { const d = document.createElement('section'); d.id = 'detail'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Explicação detalhada e prova documental'); stage.appendChild(d); const l = document.createElement('div'); l.id = 'lightbox'; l.innerHTML = '<button class="lb-close" type="button" aria-label="Fechar imagem (Esc)">fechar · Esc</button><img alt="">'; stage.appendChild(l); }
  $$('[data-fill]').forEach(e => { e.innerHTML = PANELS[e.dataset.fill] || '<p class="em-construcao">painel em construção</p>'; });
  $$('[data-open],[data-src]').forEach(e => { if (!e.hasAttribute('tabindex')) e.tabIndex = 0; if (!e.hasAttribute('role')) e.setAttribute('role', 'button'); if (!e.getAttribute('aria-label') && e.dataset.src) e.setAttribute('aria-label', 'Ver a fonte: ' + e.textContent.trim()); });
}
function openPanel(id, opener) {
  const p = document.getElementById('panel-' + id); if (!p) return; closeDrawer(); if (openPanelEl) closePanelNow();
  lastOpener = opener || document.activeElement; openPanelEl = p; p.classList.add('open'); p.setAttribute('aria-hidden', 'false'); p.scrollTop = 0;
  const cb = $('.panel-close', p); if (cb) cb.focus({ preventScroll: true });
  countUp($('.panel-body', p)); body.classList.add('panel-open');
}
function openDetail(id) { const d = $('#detail'); if (!d || !DET[id]) return; d.innerHTML = '<button class="detail-close" type="button" aria-label="Fechar explicação (Esc)">fechar · Esc</button>' + DET[id]; d.classList.add('open'); d.scrollTop = 0; detailOpen = true; countUp(d); const cb = $('.detail-close', d); if (cb) cb.focus({ preventScroll: true }); }
function closeDetail() { const d = $('#detail'); if (!detailOpen) return; d.classList.remove('open'); detailOpen = false; }
function openLightbox(src) { const l = $('#lightbox'); $('img', l).src = src; l.classList.remove('zoom'); l.classList.add('open'); lbOpen = true; }
function closeLightbox() { const l = $('#lightbox'); if (!lbOpen) return; l.classList.remove('open', 'zoom'); lbOpen = false; }
function closePanelNow() { closeLightbox(); closeDetail(); if (!openPanelEl) return; openPanelEl.classList.remove('open'); openPanelEl.setAttribute('aria-hidden', 'true'); openPanelEl = null; body.classList.remove('panel-open'); $$('.pin.drop').forEach(p => p.classList.remove('drop')); }
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
  if (pick === 'src') { const pg = FONTE_PAGINA[a.dataset.src]; if (pg) openPanel(pg, a); else openDrawer(a.dataset.src, a); return true; }
  if (pick === 'open') {
    if (b.classList.contains('pin')) { b.classList.add('drop'); setTimeout(() => openPanel(b.dataset.open, b), 420); } else openPanel(b.dataset.open, b);
    return true;
  }
  return false;
}

/* ======================= ESTADO, SLIDES E NAVEGAÇÃO ======================= */
let state = { i: -1, step: 0 }, started = false, lastCmd = 0;
function isDemo(i) { return i >= 0 && slides[i].classList.contains('matrix'); }
function enterSlide(i) {
  const s = slides[i]; clearTimers();
  body.dataset.s = i + 1; if (isDemo(i) && !LITE) body.classList.add('in-matrix'); else body.classList.remove('in-matrix');
  if (started && !STATIC) renderHero(i);
  countUp(s);
  enterFx(s);
}
function leaveSlide(i) { if (i < 0) return; clearTimers(); leaveFx(); }
function setStep(i, step) {
  const s = slides[i]; if (!meta.steps[i]) { delete s.dataset.step; return; }
  const prev = +s.dataset.step || 0; s.dataset.step = STATIC ? meta.steps[i] : step;
  if (s.classList.contains('s2')) zoomMundo(s, +s.dataset.step || 0);
  if (isDemo(i)) {
    const st = +s.dataset.step; const rt = $('.rt', s); if (rt) rt.classList.toggle('block', st >= 2);
    $$('.wd', s).forEach((w, k) => w.classList.toggle('on', k + 1 === st && step !== prev && !STATIC && !JUMP));
    HOOK.kick = 1;
  }
}
function updateChrome() {
  const s = slides[state.i], strip = $('#strip'), bl = $('b', strip), blk = s.dataset.block || '';
  stage.style.setProperty('--cap', s.style.getPropertyValue('--cap') || '#2b9bdc');
  if (bl.textContent !== blk) { bl.textContent = blk; strip.classList.remove('go'); void strip.offsetWidth; strip.classList.add('go'); }
  $('#pag').textContent = state.i >= NMAIN ? 'R' + (state.i - NMAIN + 1) + '/R' + (slides.length - NMAIN) : (state.i + 1) + '/' + NMAIN;
  $('#notesbar').textContent = ($('.notes', s) || {}).textContent || '';
  try { const h = state.i >= NMAIN ? 'R' + (state.i - NMAIN + 1) : String(state.i + 1); history.replaceState(null, '', location.pathname + (location.search || '') + '#' + h); } catch (e) {}
}
function show(st, opts) {
  opts = opts || {}; const prev = state.i, changed = st.i !== prev; const old = state; state = st;
  const apply = () => {
    if (opts.jump) { JUMP = true; slides[st.i].classList.add('nofx'); }
    if (changed) { leaveSlide(prev); if (prev >= 0) { slides[prev].classList.remove('active'); slides[prev].classList.remove('nofx'); } slides[st.i].classList.add('active'); enterSlide(st.i); }
    setStep(st.i, st.step); updateChrome();
    JUMP = false; // o nofx fica no slide até sair dele: tirar antes faria as animações de CSS recomeçarem
  };
  if (changed && started && !opts.instant && !opts.jump && !STATIC && !LITE && document.startViewTransition) {
    html.dataset.vt = isDemo(st.i) ? 'matrix-in' : isDemo(prev) ? 'matrix-out' : '';
    html.classList.add('vt');
    const vt = document.startViewTransition(apply);
    const endVt = () => { html.classList.remove('vt'); html.dataset.vt = ''; }; vt.ready.catch(() => {}); vt.finished.then(endVt, endVt);
  } else apply();
  started = true; broadcast(); onChange(old);
}
let JUMP = false; // pulo de slide pela roda: aplica o estado final sem animação
function move(dir, bySlide) { if (openPanelEl || drawerOpen || detailOpen || lbOpen) return; const n = bySlide ? Core.navSlide(state, dir, meta) : Core.nav(state, dir, meta); if (n.i !== state.i || n.step !== state.step) show(n, { jump: !!bySlide }); }
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
const wheel = Core.makeWheel({ thresh: 50, lock: 350 });
function inPres() { return body.classList.contains('presenter') || body.classList.contains('thumb'); }
document.addEventListener('wheel', e => {
  if (inPres()) return;
  const rl = e.target.closest && e.target.closest('.ref'); if (rl && ((e.deltaY > 0 && rl.scrollTop + rl.clientHeight < rl.scrollHeight - 2) || (e.deltaY < 0 && rl.scrollTop > 0))) return;
  if (openPanelEl || drawerOpen || detailOpen || lbOpen) return; // a roda rola o painel (overscroll contido); nunca troca de slide
  e.preventDefault();
  const d = wheel.feed(e.deltaY, e.deltaX, performance.now()); if (d) move(d, true);
}, { passive: false });
stage.addEventListener('click', e => {
  if (inPres()) return;
  if (lbOpen) { const l = $('#lightbox'); if (e.target.closest('.lb-close') || !e.target.closest('img')) closeLightbox(); else l.classList.toggle('zoom'); return; }
  if (e.target.closest('.detail-close')) { closeDetail(); return; }
  if (e.target.closest('.btn-detalhes')) { openDetail(e.target.closest('.btn-detalhes').dataset.id); return; }
  if (e.target.tagName === 'IMG' && e.target.closest('.panel,#detail')) { openLightbox(e.target.src); return; }
  if (e.target.closest('.panel-close')) { if (e.target.closest('#drawer')) closeDrawer(); else closePanel(); return; }
  if (e.target.closest('#scrim')) { closeDrawer(); return; }
  if (e.target.closest('.panel,#drawer,#detail')) { activate(e.target, e); return; }
  if (activate(e.target, e)) return;
  if (e.target.closest('a,button')) return;
  const now = performance.now(); if (now - lastCmd < 260) return; lastCmd = now; move(1);
});
stage.addEventListener('contextmenu', e => { if (inPres()) return; e.preventDefault(); if (openPanelEl || drawerOpen || detailOpen || lbOpen) return; const now = performance.now(); if (now - lastCmd < 260) return; lastCmd = now; move(-1); });
document.addEventListener('keydown', e => {
  const k = e.key, pres = body.classList.contains('presenter');
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const foc = document.activeElement;
  if ((k === 'Enter' || k === ' ') && foc && foc.matches && foc.matches('[data-open],[data-src]') && !pres) { e.preventDefault(); activate(foc, e); return; }
  if (k === 'Escape') { if (lbOpen) closeLightbox(); else if (drawerOpen) closeDrawer(); else if (detailOpen) closeDetail(); else if (openPanelEl) closePanel(); return; }
  if (pres) { if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); bc && bc.postMessage({ t: 'cmd', k: 'next' }); } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); bc && bc.postMessage({ t: 'cmd', k: 'prev' }); } return; }
  if (openPanelEl || drawerOpen || detailOpen || lbOpen) return;
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
const fontsReady = (document.fonts && document.fonts.load) ? Promise.race([Promise.all(['400 30px Poppins', '500 30px Poppins', '600 30px Poppins', '700 30px Poppins'].map(f => document.fonts.load(f).catch(() => {}))), new Promise(res => setTimeout(res, 1500))]) : Promise.resolve();
fontsReady.then(start);
function start() {
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
}
if (P.has('medir')) { const sc = document.createElement('script'); sc.src = 'qa/medir.js'; document.body.appendChild(sc); }
if (P.has('selftest')) { const sc = document.createElement('script'); sc.src = 'qa/selftest.js'; document.body.appendChild(sc); }
root.HNV_DECK = { Core, show, goto, move, state: () => state };
})(typeof window !== 'undefined' ? window : globalThis);
