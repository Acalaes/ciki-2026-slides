/* KIT SVG do deck: funções puras que devolvem strings SVG. API em KIT_API.md.
   Traço 2 px, cantos 8 px, Archivo; cores só pela folha kit.css (gelo, névoa, âmbar em erro/bloqueio). */
(function () {
  'use strict';
  var K = {};

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function n(v) { return Math.round(v * 100) / 100; }
  function toneCls(o) {
    var t = o.tone || 'gelo';
    var c = 't-' + t;
    if (t === 'err' || t === 'block' || t === 'late') c += ' ' + t;
    if (o.fill === 'solid') c += ' k-solid'; else if (o.fill) c += ' k-fill';
    return c;
  }
  function stepAttr(o) { return o.step != null ? ' data-step="' + o.step + '" style="--step:' + o.step + '"' : ''; }
  function lines(t) { return Array.isArray(t) ? t : String(t == null ? '' : t).split('\n'); }

  /* ---------- moldura ---------- */
  K.svg = function (w, h, inner, label) {
    return '<svg class="k" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label || '') + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<marker id="k-ah" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path class="k-mk t-gelo" d="M1 1 L11 6 L1 11"/></marker>' +
      '<marker id="k-an" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path class="k-mk t-nevoa" d="M1 1 L11 6 L1 11"/></marker>' +
      '<marker id="k-ae" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path class="k-mk err" d="M1 1 L11 6 L1 11"/></marker>' +
      '</defs>' + inner + '</svg>';
  };

  K.group = function (inner, o) {
    o = o || {};
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '>' + inner + '</g>';
  };

  /* ---------- texto ---------- */
  K.text = function (o) {
    var size = o.size || 28;
    var cls = 'k-t ' + (o.tone ? toneCls(o) : '') + (o.weight === 'b' ? ' k-b7' : '');
    return '<text class="' + cls + '" x="' + o.x + '" y="' + o.y + '" text-anchor="' + (o.anchor || 'start') + '" style="font-size:' + size + 'px">' + esc(o.t) + '</text>';
  };

  function labelLines(o, cx, cy, size, sub) {
    var ls = lines(o.t), out = '';
    var lh = size * 1.18;
    var total = ls.length + (sub ? 1 : 0);
    var y0 = cy - (total - 1) * lh / 2;
    ls.forEach(function (l, i) {
      out += '<text class="k-t k-b7" x="' + n(cx) + '" y="' + n(y0 + i * lh) + '" text-anchor="middle" dominant-baseline="central" style="font-size:' + size + 'px">' + esc(l) + '</text>';
    });
    if (sub) out += '<text class="k-t k-s" x="' + n(cx) + '" y="' + n(y0 + ls.length * lh) + '" text-anchor="middle" dominant-baseline="central" style="font-size:' + Math.max(26, size - 2) + 'px">' + esc(o.s) + '</text>';
    return out;
  }

  /* ---------- caixa, raia, nó ---------- */
  K.box = function (o) {
    var size = o.size || 28;
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '><rect class="k-b" x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="8"/>' +
      labelLines(o, o.x + o.w / 2, o.y + o.h / 2, size, !!o.s) + '</g>';
  };

  K.lane = function (o) {
    return '<g class="k-el k-lane ' + toneCls(o) + '"' + stepAttr(o) + '><rect class="k-ln" x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="8"/>' +
      '<text class="k-t k-s" x="' + (o.x + 18) + '" y="' + (o.y + o.h / 2) + '" dominant-baseline="central" style="font-size:' + (o.size || 28) + 'px">' + esc(o.t || '') + '</text></g>';
  };

  K.node = function (o) {
    var size = o.size || 28;
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '><circle class="k-b" cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.r + '"/>' +
      (o.t != null ? labelLines(o, o.cx, o.cy, size, !!o.s) : '') + '</g>';
  };

  /* ---------- seta ---------- */
  K.arrow = function (o) {
    var d = o.pts.map(function (p, i) { return (i ? 'L' : 'M') + n(p[0]) + ' ' + n(p[1]); }).join(' ');
    var mk = (o.tone === 'err' || o.tone === 'block' || o.tone === 'late') ? 'k-ae' : (o.tone === 'nevoa' ? 'k-an' : 'k-ah');
    var lab = o.t ? '<text class="k-t k-s" x="' + o.tx + '" y="' + o.ty + '" text-anchor="' + (o.anchor || 'middle') + '" style="font-size:' + (o.size || 26) + 'px">' + esc(o.t) + '</text>' : '';
    return '<g class="k-el k-arrow ' + toneCls(o) + '"' + stepAttr(o) + '><path class="k-p' + (o.dash ? ' k-dash' : '') + '" pathLength="1" d="' + d + '"' + (o.noHead ? '' : ' marker-end="url(#' + mk + ')"') + '/>' + lab + '</g>';
  };

  /* ---------- porta lógica ---------- */
  K.gate = function (o) {
    var w = o.w || 130, h = o.h || 130, x = o.x, y = o.y;
    var ins = o.ins || ['', ''];
    var d = 'M' + x + ' ' + y + ' H' + n(x + w * 0.45) + ' A' + n(w * 0.55) + ' ' + n(h / 2) + ' 0 0 1 ' + n(x + w * 0.45) + ' ' + (y + h) + ' H' + x + ' Z';
    var stub = o.stub || 60, g = '';
    ins.forEach(function (lab, i) {
      var yy = y + h * (i + 1) / (ins.length + 1);
      g += '<path class="k-p k-st" d="M' + (x - stub) + ' ' + n(yy) + ' H' + x + '"/>';
      var ti = o.inTone && o.inTone[i] ? o.inTone[i] : null;
      g += '<text class="k-t' + (ti ? ' ' + ti : '') + '" x="' + (x - stub - 14) + '" y="' + n(yy) + '" text-anchor="end" dominant-baseline="central" style="font-size:28px">' + esc(lab) + '</text>';
    });
    g += '<path class="k-p k-st" d="M' + (x + w) + ' ' + (y + h / 2) + ' H' + (x + w + stub) + '"/>';
    if (o.out) g += '<text class="k-t' + (o.outTone ? ' ' + o.outTone : '') + '" x="' + (x + w + stub + 14) + '" y="' + (y + h / 2) + '" dominant-baseline="central" style="font-size:28px">' + esc(o.out) + '</text>';
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '><path class="k-b" d="' + d + '"/><text class="k-t k-b7" x="' + n(x + w * 0.4) + '" y="' + (y + h / 2) + '" text-anchor="middle" dominant-baseline="central" style="font-size:28px">' + esc(o.t || 'E') + '</text>' + g + '</g>';
  };

  /* ---------- fórmula ---------- */
  K.m = function m(s) {
    s = String(s);
    var out = '', i = 0;
    function arg() {
      if (s[i] === '{') {
        var depth = 0, j = i;
        for (; j < s.length; j++) { if (s[j] === '{') depth++; else if (s[j] === '}') { depth--; if (!depth) break; } }
        var r = s.slice(i + 1, j); i = j + 1; return r;
      }
      var c = s[i]; i++; return c || '';
    }
    while (i < s.length) {
      var c = s[i];
      if (c === '_') { i++; out += '<sub>' + m(arg()) + '</sub>'; }
      else if (c === '^') { i++; out += '<sup>' + m(arg()) + '</sup>'; }
      else if (c === '{') {
        var inner = arg(), depth = 0, cut = -1;
        for (var k = 0; k < inner.length; k++) { if (inner[k] === '{') depth++; else if (inner[k] === '}') depth--; else if (inner[k] === '|' && !depth) { cut = k; break; } }
        out += cut < 0 ? m(inner) : '<span class="k-fr"><span>' + m(inner.slice(0, cut)) + '</span><span>' + m(inner.slice(cut + 1)) + '</span></span>';
      }
      else if ('∧∨=∈Σ→∘≈'.indexOf(c) >= 0) { out += '<span class="k-op">' + c + '</span>'; i++; }
      else { out += (c === '<' ? '&lt;' : c === '&' ? '&amp;' : c); i++; }
    }
    return out;
  };

  K.formula = function (o) {
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '><foreignObject x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" class="k-eq" style="font-size:' + (o.size || 72) + 'px;text-align:' + (o.align || 'left') + '">' + K.m(o.t) + '</div></foreignObject></g>';
  };

  /* ---------- barra, ponto, anel ---------- */
  K.bar = function (o) {
    var max = o.max || 100, x = o.x, y = o.y, w = o.w, h = o.h || 40;
    var a = (o.v0 || 0) / max * w, b = o.v / max * w;
    var g = '<rect class="k-trk" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>' +
      '<rect class="k-fl k-grow" x="' + n(x + a) + '" y="' + y + '" width="' + n(Math.max(2, b - a)) + '" height="' + h + '" rx="8"/>';
    if (o.t) g += '<text class="k-t" x="' + (x - 16) + '" y="' + (y + h / 2) + '" text-anchor="end" dominant-baseline="central" style="font-size:' + (o.size || 28) + 'px">' + esc(o.t) + '</text>';
    if (o.val != null) g += '<text class="k-t k-b7" x="' + (x + w + 16) + '" y="' + (y + h / 2) + '" dominant-baseline="central" style="font-size:' + (o.size || 28) + 'px">' + esc(o.val) + '</text>';
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '>' + g + '</g>';
  };

  K.dot = function (o) {
    var r = o.r || 12;
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '><circle class="k-d' + (o.hollow ? ' k-hol' : '') + '" cx="' + o.cx + '" cy="' + o.cy + '" r="' + r + '"/>' +
      (o.t != null ? '<text class="k-t" x="' + (o.cx + r + 14) + '" y="' + o.cy + '" dominant-baseline="central" style="font-size:' + (o.size || 28) + 'px">' + esc(o.t) + '</text>' : '') + '</g>';
  };

  K.ring = function (o) {
    var v = o.v == null ? 100 : o.v;
    var cir = '<circle class="k-b k-rg' + (o.dash ? ' k-dash' : '') + '" cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.r + '"/>';
    if (v < 100) {
      cir = '<circle class="k-trk" cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.r + '" fill="none"/>' +
        '<circle class="k-arc" cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.r + '" pathLength="100" stroke-dasharray="' + v + ' ' + (100 - v) + '" transform="rotate(-90 ' + o.cx + ' ' + o.cy + ')"/>';
    }
    return '<g class="k-el ' + toneCls(o) + '"' + stepAttr(o) + '>' + cir +
      (o.t != null ? labelLines(o, o.cx, o.cy, o.size || 28, !!o.s) : '') + '</g>';
  };

  /* ---------- ícones de traço fino ---------- */
  var ICONS = {
    lock: '<rect x="6" y="20" width="36" height="24" rx="4"/><path d="M13 20 V14 a11 11 0 0 1 22 0 V20"/>',
    check: '<path d="M6 26 L19 38 L42 10"/>',
    doc: '<path d="M10 4 H30 L40 14 V44 H10 Z"/><path d="M30 4 V14 H40"/><path d="M16 26 H34 M16 34 H34"/>',
    person: '<circle cx="24" cy="14" r="9"/><path d="M6 44 a18 16 0 0 1 36 0"/>',
    db: '<ellipse cx="24" cy="10" rx="16" ry="6"/><path d="M8 10 V36 a16 6 0 0 0 32 0 V10"/><path d="M8 23 a16 6 0 0 0 32 0"/>',
    link: '<path d="M20 28 a8 8 0 0 0 11 0 l8 -8 a8 8 0 0 0 -11 -11 l-3 3"/><path d="M28 20 a8 8 0 0 0 -11 0 l-8 8 a8 8 0 0 0 11 11 l3 -3"/>',
    clock: '<circle cx="24" cy="24" r="18"/><path d="M24 12 V24 L33 29"/>'
  };
  K.icon = function (name, o) {
    o = o || {};
    var s = (o.s || 48) / 48;
    return '<g class="k-el k-ic ' + toneCls(o) + '"' + stepAttr(o) + ' transform="translate(' + (o.x || 0) + ' ' + (o.y || 0) + ') scale(' + n(s) + ')">' + (ICONS[name] || '') + '</g>';
  };

  /* ---------- controle de passos (slides) ---------- */
  K.steps = function (svg) {
    var m = 0;
    svg.querySelectorAll('[data-step]').forEach(function (e) { m = Math.max(m, +e.getAttribute('data-step')); });
    return m;
  };
  K.step = function (svg, nstep) {
    svg.classList.add('k-ctl');
    svg.querySelectorAll('[data-step]').forEach(function (e) {
      var s = +e.getAttribute('data-step');
      e.classList.toggle('k-on', s <= nstep);
      e.classList.toggle('k-now', s === nstep);
    });
  };
  K.play = function (svg) {
    svg.classList.remove('k-ctl');
    svg.querySelectorAll('[data-step]').forEach(function (e) { e.classList.remove('k-on', 'k-now'); });
  };

  window.HNV_KIT = K;
})();
