// Medições de layout por slide (rodado por qa_medir.py com ?static=1&medir=1). Escreve JSON em <pre id="medir">.
(async function () {
  const D = window.HNV_DECK, out = [], sleep = ms => new Promise(r => setTimeout(r, ms));
  const stage = document.getElementById('stage'); const sc = stage.getBoundingClientRect().width / 1920, o = stage.getBoundingClientRect();
  const slides = [...document.querySelectorAll('.slide')];
  for (let i = 0; i < slides.length; i++) {
    D.goto(i); await sleep(60);
    const s = slides[i], t = s.querySelector('.ttl .w'), r = t.getBoundingClientRect(), g = s.querySelector('.guia');
    const cs = getComputedStyle(t.parentElement), hero = s.querySelector('.hero');
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);
    const heroTexts = hero ? [...hero.querySelectorAll('text')].map(e => e.textContent.trim()).filter(Boolean) : [];
    const sizes = hero ? [...hero.querySelectorAll('text')].map(e => parseFloat(getComputedStyle(e).fontSize) * (hero.querySelector('svg').getBoundingClientRect().width / 1600) / sc) : [];
    const gr = hero ? hero.querySelector('svg') && hero.querySelector('svg').children.length : 0;
    out.push({
      slide: i < 12 ? i + 1 : 'R' + (i - 11), titulo: t.textContent, chars: t.textContent.length,
      x: Math.round((r.left - o.left) / sc), y: Math.round((r.top - o.top) / sc), w: Math.round(r.width / sc), h: Math.round(r.height / sc), cx: Math.round(((r.left + r.right) / 2 - o.left) / sc),
      fontPx: parseFloat(cs.fontSize), linhas: Math.round(r.height / sc / lh), cabe: r.width / sc <= 1420,
      bloco: s.dataset.block, rodape: (s.querySelector('.rodape') || {}).textContent || '', fontesN: s.querySelectorAll('.rodape [data-src]').length, guia: g ? g.textContent : '', palavrasHero: heroTexts.join(' ').split(/\s+/).filter(Boolean).length, rotulos: heroTexts.length,
      menorTextoHero: sizes.length ? Math.round(Math.min(...sizes)) : null, clicaveis: [...new Set([...s.querySelectorAll('[data-open]')].map(e => e.dataset.open))].length
    });
  }
  const pre = document.createElement('pre'); pre.id = 'medir'; pre.textContent = JSON.stringify(out); pre.style.display = 'none'; document.body.appendChild(pre);
})();
