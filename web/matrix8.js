/* Chuva de caracteres da demo (slide 9): único lugar do deck com verde. Fica atrás do conteúdo e para em ?lite=1 e em prefers-reduced-motion. */
(function (root) {
  root.HNV_SCENE8 = function (env) {
    const rng = env.rng, HOOK = env.HOOK, LITE = env.LITE, STATIC = env.STATIC;
  const COLS = 48, ROWS = 28, r = rng(8), cols = [];
  const SET = '01', PH = ['artigo', 'inciso', 'fonte', 'bloqueia', 'citação', 'corrige'];
  for (let i = 0; i < COLS; i++) cols.push({ sp: 5 + r() * 9, off: r() * 60, len: 8 + Math.floor(r() * 14), ph: r() < .26 ? PH[Math.floor(r() * PH.length)] : null });
  const hash = (a, b, c) => { let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791); h >>>= 0; return h; };
  let accT = 0;
  return {
    T: 9, frame(ctx, t, dt) {
      accT += dt * (1 + 3 * HOOK.kick); HOOK.kick = Math.max(0, HOOK.kick - dt * 1.1);
      const tt = STATIC ? t : accT + 0; ctx.clearRect(0, 0, 1920, 1080);
      ctx.font = '700 40px Consolas,"Cambria Math","Segoe UI Symbol",monospace'; ctx.textAlign = 'center';
      const slot = Math.floor(tt * 2.2);
      for (let c = 0; c < COLS; c++) {
        const col = cols[c], head = (tt * col.sp * .5 + col.off) % (ROWS + col.len), hr = Math.floor(head);
        for (let k = 0; k < col.len; k++) {
          const row = hr - k; if (row < 0 || row >= ROWS) continue;
          const ch = col.ph ? col.ph[(row + c) % col.ph.length] : SET[hash(c, row, k === 0 ? slot : Math.floor(slot / 6)) % SET.length];
          const f = 1 - k / col.len;
          ctx.globalAlpha = k === 0 ? .5 : .3 * f * f; ctx.fillStyle = k === 0 ? '#f4f4f5' : (col.ph === 'bloqueia' ? '#f05a28' : '#00FF41');
          if (k < 3) { ctx.shadowColor = '#00FF41'; ctx.shadowBlur = LITE ? 0 : 12; } else ctx.shadowBlur = 0;
          ctx.fillText(ch, c * 40 + 20, row * 40 + 38);
        }
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
  };
};
})(window);
