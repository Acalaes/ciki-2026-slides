/* Pictogramas do deck (extensão do kit.js): figuras de traço fino, reconhecíveis sozinhas, SEMPRE com a palavra por extenso.
   Uso: HNV_KIT.pic2('agente', {x, y, s, t:'Agente', tone, step, size}) devolve uma string SVG (função pura).
   Extras além de K.pic (kit.js): documento, pessoa, agente, arnes, fonte, mais, igual, xis.
   Desenhados em 100x100; o traço fica em 2,5 px (vector-effect). Cores: só as do kit (gelo, névoa, âmbar em erro/bloqueio). */
(function () {
  'use strict';
  var K = window.HNV_KIT; if (!K) return;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var P = {
    fonte: '<ellipse cx="50" cy="20" rx="34" ry="11"/><path d="M16 20V78C16 88 84 88 84 78V20"/><path d="M16 49C16 59 84 59 84 49"/>',
    documento: '<path d="M18 8H58L80 30V92H18Z"/><path d="M58 8V30H80"/><path d="M30 46H68M30 60H68M30 74H56"/>',
    pessoa: '<circle cx="50" cy="28" r="17"/><path d="M14 92C14 56 86 56 86 92"/>',
    agente: '<path d="M24 34H76V74H24Z"/><path d="M50 34V18M42 18H58"/><circle cx="40" cy="52" r="5"/><circle cx="60" cy="52" r="5"/><path d="M38 64H62M12 48V60M88 48V60M36 74V90M64 74V90"/>',
    arnes: '<path d="M28 8Q50 22 72 8L86 40V92H14V40Z"/><path d="M28 8L72 62M72 8L28 62"/><path d="M14 66H86"/><rect x="42" y="58" width="16" height="16" rx="2"/>',
    mais: '<path d="M50 18V82M18 50H82"/>',
    igual: '<path d="M18 38H82M18 62H82"/>',
    xis: '<path d="M20 20L80 80M80 20L20 80"/>'
  };
  K.pic2 = function (name, o) {
    o = o || {}; var s = o.s || 120, tone = o.tone || 'gelo', size = o.size || 34;
    var cls = 'k-el t-' + tone + ((tone === 'err' || tone === 'block' || tone === 'late') ? ' ' + tone : '') + ' k-pict';
    var st = o.step != null ? ' data-step="' + o.step + '" style="--step:' + o.step + '"' : '';
    var g = '<g class="' + cls + '"' + st + '><g class="k-ic" transform="translate(' + (o.x || 0) + ' ' + (o.y || 0) + ') scale(' + (s / 100) + ')">' + (P[name] || '') + '</g>';
    if (o.t) {
      var ls = Array.isArray(o.t) ? o.t : String(o.t).split('\n');
      ls.forEach(function (l, i) { g += '<text class="k-t k-b7" x="' + ((o.x || 0) + s / 2) + '" y="' + ((o.y || 0) + s + size * 1.25 + i * size * 1.2) + '" text-anchor="middle" style="font-size:' + size + 'px">' + esc(l) + '</text>'; });
    }
    return g + '</g>';
  };
})();
