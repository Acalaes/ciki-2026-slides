/* KIT SVG do deck: funções puras que devolvem strings SVG. API em KIT_API.md.
   Traço 2 px, cantos 8 px, Poppins; cores só pela folha kit.css (gelo, névoa, âmbar em erro/bloqueio). */
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
    return '<g class="k-el k-card ' + toneCls(o) + (o.mono ? ' k-mono' : '') + '"' + stepAttr(o) + '><rect class="k-b" x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="8"/>' +
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
      if (c === '_') {
        i++; var sb = m(arg());
        if (s[i] === '^') { i++; out += '<span class="k-ss"><span>' + m(arg()) + '</span><span>' + sb + '</span></span>'; } else out += '<sub>' + sb + '</sub>';
      }
      else if (c === '^') {
        i++; var sp = m(arg());
        if (s[i] === '_') { i++; out += '<span class="k-ss"><span>' + sp + '</span><span>' + m(arg()) + '</span></span>'; } else out += '<sup>' + sp + '</sup>';
      }
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


  /* ---------- pictogramas da camada 1 (48×48, traço 2 px, sem letras) ---------- */
  var PIC = {
    evidencia: ['Evidência', '<path d="M8 4H26L34 12V30"/><path d="M8 4V40H22"/><path d="M26 4V12H34"/><path d="M14 18H26 M14 25H22"/><circle cx="32" cy="32" r="8"/><path d="M38 38L45 45"/>'],
    normas: ['Normas', '<path d="M24 6V40"/><path d="M13 42H35"/><path d="M6 13H42"/><path d="M10 13L3 28H17Z"/><path d="M38 13L31 28H45Z"/><circle cx="24" cy="6" r="2.5"/>'],
    rastro: ['Rastro', '<path d="M8 38L18 25L30 31L40 11"/><circle cx="8" cy="38" r="4"/><circle cx="18" cy="25" r="4"/><circle cx="30" cy="31" r="4"/><circle cx="40" cy="11" r="4"/>'],
    humano: ['Humano', '<circle cx="18" cy="13" r="7"/><path d="M4 42a14 14 0 0 1 28 0"/><path d="M34 32H44V38H34Z"/><path d="M39 32V24"/><circle cx="39" cy="21" r="3.5"/>'],
    recuperar: ['Recuperar', '<rect x="5" y="9" width="24" height="8"/><rect x="5" y="19" width="24" height="8"/><rect x="5" y="29" width="24" height="8"/><circle cx="32" cy="28" r="9"/><path d="M38.5 34.5L45 43"/>'],
    gerar: ['Gerar', '<path d="M8 10L24 10M8 10L24 24M8 24L24 10M8 24L24 24M8 24L24 38M8 38L24 24M8 38L24 38M24 10L40 17M24 24L40 17M24 24L40 31M24 38L40 31"/><circle cx="8" cy="10" r="3.5"/><circle cx="8" cy="24" r="3.5"/><circle cx="8" cy="38" r="3.5"/><circle cx="24" cy="10" r="3.5"/><circle cx="24" cy="24" r="3.5"/><circle cx="24" cy="38" r="3.5"/><circle cx="40" cy="17" r="3.5"/><circle cx="40" cy="31" r="3.5"/>'],
    verificar: ['Verificar', '<path d="M24 4L40 10V24C40 34 32 41 24 44C16 41 8 34 8 24V10Z"/><path d="M16 24L22 30L33 17"/>'],
    registrar: ['Registrar', '<rect x="8" y="5" width="32" height="37" rx="3"/><path d="M15 5V42"/><path d="M21 15H34M21 23H34M21 31H29"/>'],
    aprovar: ['Aprovar', '<path d="M24 4a5 5 0 0 1 5 5v10H19V9a5 5 0 0 1 5-5Z"/><path d="M10 28H38a2 2 0 0 1 2 2V35H8V30a2 2 0 0 1 2-2Z"/><path d="M19 19L14 28M29 19L34 28"/><path d="M6 43H42"/>'],
    bloqueio: ['Bloqueio', '<path d="M6 6V42M24 6V42M42 6V42"/><path d="M6 14H42M6 34H42"/><path d="M6 24H42"/>'],
    ontologia: ['Ontologia', '<path d="M24 9L10 26M24 9L38 26M10 26H38M10 26L24 41M38 26L24 41M24 9V41"/><circle cx="24" cy="9" r="5"/><circle cx="10" cy="26" r="5"/><circle cx="38" cy="26" r="5"/><circle cx="24" cy="41" r="4"/>'],
    fechadura: ['Fechadura', '<rect x="9" y="20" width="30" height="24" rx="4"/><path d="M16 20V14a8 8 0 0 1 16 0V20"/><circle cx="24" cy="30" r="3.5"/><path d="M24 33V39"/>'],
    chave: ['Chave', '<circle cx="14" cy="24" r="8"/><path d="M22 24H45M36 24V32M42 24V30"/>'],
    calendario: ['Calendário', '<rect x="5" y="9" width="38" height="33" rx="4"/><path d="M5 19H43M15 4V13M33 4V13"/><path d="M12 27H17M21 27H27M31 27H36M12 34H17M21 34H27"/>'],
    barras: ['Barras', '<path d="M5 5V42H44"/><rect x="11" y="26" width="7" height="16"/><rect x="22" y="14" width="7" height="28"/><rect x="33" y="21" width="7" height="21"/>']
  };
  K.PICS = {};
  Object.keys(PIC).forEach(function (k) { K.PICS[k] = PIC[k][0]; });
  K.pic = function (name, o) {
    o = o || {};
    var d = PIC[name]; if (!d) return '';
    var s = o.s || 96, k = s / 48, size = o.size || 32, pos = o.pos || 'below';
    var x = o.x || 0, y = o.y || 0, t = o.t != null ? o.t : d[0], lab = '';
    if (pos !== 'none' && t) {
      lab = pos === 'right'
        ? '<text class="k-t" x="' + (x + s + 20) + '" y="' + (y + s / 2) + '" dominant-baseline="central" style="font-size:' + size + 'px">' + esc(t) + '</text>'
        : '<text class="k-t" x="' + (x + s / 2) + '" y="' + (y + s + size * 1.1) + '" text-anchor="middle" style="font-size:' + size + 'px">' + esc(t) + '</text>';
    }
    return '<g class="k-el k-pic ' + toneCls(o) + '"' + stepAttr(o) + '><g class="k-ic" transform="translate(' + x + ' ' + y + ') scale(' + n(k) + ')">' + d[1] + '</g>' + lab + '</g>';
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
