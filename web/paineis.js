/* Camada 2 do deck: painéis de infográfico (conteúdo HTML em strings).
   Contrato: window.HNV_PANELS = { id: "<html>" }. Estilo em paineis.css (escopo .panel-body).
   Fontes clicáveis: <button class="fonte" data-src="chave"> (dados em fontes.json / fontes.js). */
(function () {
  'use strict';
  var P = {};

  /* ---------- auxiliares ---------- */
  function F(k, l) { return '<button class="fonte" data-src="' + k + '">' + l + '</button>'; }
  function foot(fs, cred) {
    return '<footer class="pf"><div class="fontes">' + fs.join('') + '</div>' + (cred ? '<p class="cred">' + cred + '</p>' : '') + '</footer>';
  }
  function sel(t, c) { return '<span class="selo ' + (c || '') + '">' + t + '</span>'; }
  function T(t, sub) { return '<h2 class="pt">' + t + (sub ? '<small>' + sub + '</small>' : '') + '</h2>'; }
  function body(inner) { return '<div class="panel-body">' + inner + '</div>'; }
  function svg(w, h, inner, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (label || '') + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }
  function tbl(cols, head, rows, cls) {
    var cg = '<colgroup>' + cols.map(function (w) { return '<col style="width:' + w + '">'; }).join('') + '</colgroup>';
    var h = '<thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead>';
    var b = '<tbody>' + rows.map(function (r) {
      var rc = '';
      if (r && !Array.isArray(r)) { rc = r.cls ? ' class="' + r.cls + '"' : ''; r = r.c; }
      return '<tr' + rc + '>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';
    return '<table class="' + (cls || '') + '">' + cg + h + b + '</table>';
  }
  function cnt(n, fmt) {
    var txt = fmt === 'k' ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n);
    return '<span class="cnt ' + (fmt === 'k' ? 'k' : 'u') + '" style="--n:' + n + '"><span>' + txt + '</span></span>';
  }
  function pct(x, d) { return (x * 100).toFixed(d == null ? 1 : d).replace('.', ','); }
  function fmt(x, d) { return Number(x).toFixed(d).replace('.', ','); }

  /* =========================================================
     SLIDE 1
     ========================================================= */
  P['s1-ficha'] = body(
    T('Ficha do artigo') +
    '<div class="cols c21" style="align-items:start">' +
    '<dl class="ficha">' +
    '<dt>Título (EN)</dt><dd><em>Neurosymbolic Artificial Intelligence and Knowledge Engineering: Beyond Hallucinations and Auditable Decisions in the Intelligent State</em></dd>' +
    '<dt>Artigo</dt><dd>#160 · CIKI 2026 · apresentação em 28/10/2026</dd>' +
    '<dt>Autor</dt><dd>Alexandre Pinto Calaes · PPGEGC/UFSC</dd>' +
    '<dt>Método</dt><dd>Design Science Research (DSR), em seis ciclos rastreáveis</dd>' +
    '<dt>Evidência</dt><dd>Aplicações prévias no CBMSC e na ESAG/UDESC: exploratória, em Santa Catarina</dd>' +
    '<dt>Apoio</dt><dd>CAPES, Finance Code 001</dd>' +
    '</dl>' +
    svg(560, 560,
      '<g class="fd" style="--d:.4s">' +
      '<rect class="nd az" x="10" y="10" width="540" height="140"/><text class="b" x="30" y="62" style="font-size:38px">CALAIS</text><text class="m" x="30" y="104">modelo de governança e</text><text class="m" x="30" y="134">auditabilidade para IA verticalizada</text></g>' +
      '<path class="ln az dr" pathLength="1" style="--d:1s" d="M280 150 V210"/><path class="fl" d="M266 206 h28 l-14 18z"/>' +
      '<g class="fd" style="--d:1.3s">' +
      '<rect class="nd" x="10" y="230" width="540" height="140"/><text class="b" x="30" y="282" style="font-size:38px">Arquitetura</text><text class="m" x="30" y="324">recuperação, geração neural,</text><text class="m" x="30" y="354">verificação, registro, decisão humana</text></g>' +
      '<path class="ln az dr" pathLength="1" style="--d:1.9s" d="M280 370 V430"/><path class="fl" d="M266 426 h28 l-14 18z"/>' +
      '<g class="fd" style="--d:2.2s">' +
      '<rect class="nd" x="10" y="450" width="540" height="100"/><text class="b" x="30" y="496" style="font-size:38px">Citāre</text><text class="m" x="30" y="534">artefato de referência (sistema)</text></g>',
      'Três níveis: CALAIS, arquitetura e Citāre') +
    '</div>' +
    foot([F('art-dsr', 'Artigo: método DSR'), F('art-escopo', 'Artigo: escopo da evidência')],
      'Título e dados do artigo #160 (versão final). Autoria e vínculo conforme o artigo e a capa.')
  );

  P['s1-paleta'] = body(
    T('As quatro condições e as cores', 'Cada coluna é um pino da fechadura: falta um e o resultado não abre.') +
    '<div class="cols c4">' +
    [
      ['E', 'Evidência', 'O que sustenta a afirmação: documentos recuperados e ligados à resposta.', 'E(y, R)', ''],
      ['N', 'Norma', 'As regras aplicáveis conferem a resposta; o sistema pode bloquear.', 'N(y, Ω)', ''],
      ['T', 'Rastro', 'O caminho fica registrado: fontes, verificações e decisões.', 'T(y)', ''],
      ['H', 'Humano', 'Quem decide manter, modificar ou rejeitar a recomendação.', 'H(y)', 'luz']
    ].map(function (c, i) {
      return '<div class="card ri" style="--d:' + (0.2 + i * 0.2) + 's;' + (c[4] ? 'background:var(--ink);border-color:var(--ink);color:#0A1428' : '') + '">' +
        '<div class="big" style="font-size:150px;' + (c[4] ? '' : 'color:var(--az)') + '">' + c[0] + '</div>' +
        '<h3 style="' + (c[4] ? 'color:#0A1428' : '') + '">' + c[1] + '</h3>' +
        '<p style="font-size:28px;margin:8px 0 14px">' + c[2] + '</p>' +
        '<p class="sans" style="font-size:30px;font-weight:600;font-style:italic">' + c[3] + '</p></div>';
    }).join('') +
    '</div>' +
    '<div class="cols c3" style="margin-top:6px">' +
    '<p><span class="sw az"></span>Azul: verificado e registrado</p>' +
    '<p class="block"><span class="sw block"></span>Âmbar: onde o sistema para</p>' +
    '<p><span class="sw luz"></span>Luz clara: decisão humana</p>' +
    '</div>' +
    foot([F('art-eq', 'Artigo: Equações 2 e 3')],
      'Símbolos conforme as Equações 2 e 3 do artigo (Seção 3.1). Âmbar aparece apenas para erro ou bloqueio.')
  );

  P['s1-harness3d'] = body(
    T('O que cada parte do harness representa', 'Legenda da cena 3D da capa; é uma metáfora visual, não um diagrama de código.') +
    '<div class="cols" style="grid-template-columns:640px 1fr;align-items:center">' +
    svg(640, 620,
      /* faixas (skills) */
      '<g fill="none" stroke-width="10" stroke-linecap="round" stroke="#1E3A66">' +
      '<path class="dr" pathLength="1" style="--d:.3s" d="M200 90 C60 230 60 400 200 540"/>' +
      '<path class="dr" pathLength="1" style="--d:.5s" d="M440 90 C580 230 580 400 440 540"/>' +
      '<path class="dr" pathLength="1" style="--d:.7s" d="M320 70 C250 230 250 400 320 560"/>' +
      '<path class="dr" pathLength="1" style="--d:.9s" d="M320 70 C390 230 390 400 320 560"/></g>' +
      '<g fill="none" stroke="#6F8FC7" stroke-width="2.5">' +
      '<path class="dr" pathLength="1" style="--d:.3s" d="M200 90 C60 230 60 400 200 540"/>' +
      '<path class="dr" pathLength="1" style="--d:.5s" d="M440 90 C580 230 580 400 440 540"/></g>' +
      /* anéis (hooks) */
      '<g fill="none" stroke="#E6EEFB" stroke-width="5">' +
      '<ellipse class="dr" pathLength="1" style="--d:1.2s" cx="320" cy="260" rx="160" ry="44"/>' +
      '<ellipse class="dr" pathLength="1" style="--d:1.4s" cx="320" cy="370" rx="160" ry="44"/></g>' +
      /* núcleo neural */
      '<g class="fd" style="--d:1.9s"><circle cx="320" cy="315" r="86" fill="#0E1A33" stroke="#7BA3EE" stroke-width="3"/>' +
      '<g stroke="#6F8FC7" stroke-width="2"><path d="M280 285 L330 270 L360 320 L300 350 L280 285 M330 270 L300 350 M360 320 L280 285"/></g>' +
      '<g fill="#7BA3EE"><circle class="pl" cx="280" cy="285" r="9"/><circle class="pl" style="animation-delay:.5s" cx="330" cy="270" r="9"/><circle class="pl" style="animation-delay:1s" cx="360" cy="320" r="9"/><circle class="pl" style="animation-delay:1.5s" cx="300" cy="350" r="9"/></g></g>' +
      /* ancoragens E N T H */
      [['E', 150, 60], ['N', 490, 60], ['T', 150, 540], ['H', 490, 540]].map(function (a, i) {
        return '<g class="pp" style="--d:' + (1.0 + i * .12) + 's"><rect x="' + (a[1] - 24) + '" y="' + (a[2] - 24) + '" width="48" height="48" fill="' + (a[0] === 'H' ? '#E6EEFB' : '#1E3A66') + '" stroke="' + (a[0] === 'H' ? '#E6EEFB' : '#7BA3EE') + '" stroke-width="3"/>' +
          '<text class="b' + (a[0] === 'H' ? ' luz' : '') + '" x="' + a[1] + '" y="' + (a[2] + 10) + '" text-anchor="middle" style="font-size:30px">' + a[0] + '</text></g>';
      }).join('') +
      /* fivela */
      '<g class="pp" style="--d:2.3s"><rect x="272" y="572" width="96" height="44" rx="6" fill="#E6EEFB"/><rect x="298" y="582" width="44" height="24" fill="#0A1428"/></g>',
      'Esquema do harness: núcleo, faixas, anéis, ancoragens e fivela') +
    '<div style="display:grid;gap:16px">' +
    [
      ['sw az', 'Núcleo luminoso', 'modelo neural: lê e escreve linguagem natural; propõe, não decide'],
      ['sw', 'Faixas curvas', 'skills e instruções: guia macio, orienta o modelo mas não obriga'],
      ['sw luz', 'Anéis rígidos', 'hooks: regra dura, executada pelo harness (bloqueia, não negocia)'],
      ['sw az', 'Quatro ancoragens E N T H', 'evidência, norma, rastro e humano: as quatro condições do artigo'],
      ['sw luz', 'Fivela', 'aprovação humana: só a pessoa fecha e libera']
    ].map(function (r) {
      return '<p><span class="' + r[0] + '"></span><b>' + r[1] + '.</b> ' + r[2] + '</p>';
    }).join('') +
    '</div></div>' +
    foot([F('hnv-readme', 'Mapa guia macio × regra dura'), F('art-eq', 'Artigo: Equações 2 e 3')],
      'Metáfora visual da capa; o mapa guia macio × regra dura vem do README da demonstração.')
  );

  /* =========================================================
     SLIDE 2
     ========================================================= */
  (function () {
    var tot = 2217, us = 1514, br = 41, rest = tot - us - br;
    var w = function (x) { return (x / tot * 100).toFixed(2) + '%'; };
    var l = function (x) { return ((x) / tot * 100).toFixed(2) + '%'; };
    P['s2-casos'] = body(
      T('Casos de alucinação em tribunais e taxas em testes') +
      '<div class="cols c2" style="gap:56px;align-items:start">' +
      '<div style="display:grid;gap:18px">' +
      '<div class="kv"><span class="big">' + cnt(tot, 'k') + '</span><span class="mut" style="font-size:30px">casos<br>(25/10/2026)</span></div>' +
      '<div class="bar-trk" style="height:60px"><i class="bar" style="left:0;width:' + w(us) + ';--d:.3s"></i>' +
      '<i class="bar luz" style="left:' + w(us) + ';width:' + w(br) + ';--d:.9s"></i>' +
      '<i class="bar cz" style="left:' + l(us + br) + ';width:' + w(rest) + ';--d:1.1s"></i></div>' +
      tbl(['1fr', '150px', '140px'], ['País', 'Casos', 'Parcela'], [
        ['<span class="sw az" style="width:26px;height:26px"></span>EUA', cnt(us, 'k'), pct(us / tot) + '%'],
        ['<span class="sw luz" style="width:26px;height:26px"></span>Brasil', cnt(br), pct(br / tot) + '%'],
        ['<span class="sw" style="width:26px;height:26px;background:#6A7690;border-color:#6A7690"></span>Demais países', cnt(rest), pct(rest / tot) + '%']
      ]) +
      '<p class="nota" style="font-size:26px">Demais países = total − EUA − Brasil (cálculo do autor). Base mantida por Damien Charlotin.</p>' +
      '</div>' +
      '<div style="display:grid;gap:26px">' +
      '<h3>Taxa de erro em perguntas jurídicas verificáveis</h3>' +
      '<div style="display:grid;gap:10px"><p>Modelos de linguagem gerais (Dahl et al.) ' + sel('preprint') + '</p>' +
      '<div class="rng-row"><div class="bar-trk gridbg"><i class="bar" style="left:58%;width:30%;--d:.5s"></i></div><span class="val">58–88%</span></div></div>' +
      '<div style="display:grid;gap:10px"><p>Ferramentas jurídicas com RAG (Magesh et al.) ' + sel('preprint') + '</p>' +
      '<div class="rng-row"><div class="bar-trk gridbg"><i class="bar" style="left:17%;width:16%;--d:.9s"></i></div><span class="val">17–33%</span></div></div>' +
      '<div class="rng-row" style="margin-top:-12px"><div class="axis"><span>0</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div><span></span></div>' +
      '<p class="nota" style="font-size:26px">Cada faixa vai da menor à maior taxa entre os sistemas testados. Nas versões publicadas em periódicos, os limites divergem (69–88% e “mais de 17%”).</p>' +
      '</div></div>' +
      foot([F('charlotin', 'Charlotin (2026)'), F('dahl', 'Dahl et al. (2024)'), F('magesh', 'Magesh et al. (2025)')],
        'Charlotin, AI Hallucination Cases Database, consultada em 25/10/2026. Dahl e Magesh: faixas das versões preprint (arXiv).')
    );
  })();

  (function () {
    var z = [['XXXIII', 3.0], ['XXI', 2.2], ['II', 1.6], ['V', 1.1], ['caput', 0.6]];
    var s = 0; z.forEach(function (a) { s += Math.exp(a[1]); });
    var pr = z.map(function (a) { return Math.exp(a[1]) / s; });
    var rows = z.map(function (a, i) {
      var bad = i === 0;
      return '<div class="bar-row" style="grid-template-columns:150px 1fr 330px">' +
        '<span class="sans" style="font-weight:600;font-size:30px">' + a[0] + '</span>' +
        '<div class="bar-trk" style="height:42px"><i class="bar' + (bad ? ' err' : '') + '" style="left:0;width:' + (pr[i] * 100).toFixed(1) + '%;--d:' + (0.4 + i * 0.25) + 's"></i></div>' +
        '<span class="sans' + (bad ? ' err' : '') + '" style="font-size:28px">z = ' + fmt(a[1], 1) + ' → ' + pct(pr[i]) + '%</span></div>';
    }).join('');
    P['s2-softmax'] = body(
      T('Por que um modelo de linguagem alucina: ele escolhe o plausível, não o verdadeiro') +
      '<div class="cols" style="grid-template-columns:1fr 1fr;gap:30px;align-items:center">' +
      '<div><span class="eq" style="font-size:74px;padding:12px 24px">softmax(<i>z</i>)<sub><i>i</i></sub> <span class="op">=</span> <span class="frac"><span>e<sup><i>z<sub>i</sub></i></sup></span><span>Σ<sub><i>j</i>=1</sub><sup><i>K</i></sup> e<sup><i>z<sub>j</sub></i></sup></span></span></span></div>' +
      '<div><span class="eq" style="font-size:50px;padding:12px 24px">P(<i>y<sub>t</sub></i> | <i>y</i><sub>&lt;<i>t</i></sub>, <i>x</i>) <span class="op">=</span> softmax(<i>W h<sub>t</sub></i>)<sub><i>y<sub>t</sub></i></sub></span></div></div>' +
      '<div class="cols c2" style="gap:50px;align-items:center">' +
      '<div style="display:grid;gap:14px">' +
      '<p class="mut" style="font-size:26px">Qual inciso do art. 37 trata de nepotismo? Valores z hipotéticos; probabilidades calculadas pela fórmula. ' + sel('ilustrativo', 'sol') + '</p>' + rows + '</div>' +
      '<ul class="pt-list">' +
      '<li>A rede dá uma nota <i>z</i> a cada palavra possível; a softmax transforma as notas em probabilidades que somam 100%.</li>' +
      '<li>O modelo escreve o que tem maior probabilidade ou sorteia entre as mais prováveis.</li>' +
      '<li class="err">Nada na fórmula consulta se a fonte existe: um inciso inexistente pode ser a opção mais provável.</li></ul></div>' +
      foot([F('huang2025', 'Huang et al. (2025)'), F('softmax', 'Definição da softmax')],
        'Explicação didática. Huang et al. (2025) é a revisão sobre alucinação em modelos de linguagem citada no artigo.')
    );
  })();

  P['s2-citacoes'] = body(
    T('Checagem manual: o que o modelo local escreveu sem harness', 'Modelo local de 3 bilhões de parâmetros, três rodadas; conferência em fonte oficial, 25/10/2026.') +
    tbl(['100px', '480px', '330px', '1fr'], ['Rodada', 'Citação do modelo', 'Veredito', 'O que a fonte oficial mostra'], [
      ['1 e 2', 'art. 37, inciso XXXIII, da Constituição', '<span class="chip err">inexistente</span>', 'O art. 37 vai só até o inciso XXII.'],
      ['2', 'Decreto nº 4.653/2002, sobre nomeação de parentes', '<span class="chip err">atribuição falsa</span>', 'É de 27/03/2003, estrutura do Ministério do Turismo; não trata de nepotismo.'],
      ['3', 'art. 37, inciso XXI, “proíbe o nepotismo”', '<span class="chip err">atribuição falsa</span>', 'O inciso XXI trata de licitação.'],
      ['3', 'Lei nº 8.112/1990, “principal instrumento” contra nepotismo', '<span class="chip">lei real, sem base</span>', 'Regime dos servidores civis da União; não se aplica a todos os entes.'],
      ['3', 'ADI 2.958 do STF, como decisão sobre nepotismo', '<span class="chip">pertinência não comprovada</span>', 'O número existe; o assunto cadastrado é outro (Agentes Políticos, Ministério Público).'],
      ['2', 'Decisão do STJ, sem número', '<span class="chip">não verificável</span>', 'Sem número não há como conferir; o verificador não pega referência vaga.']
    ]) +
    foot([F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')],
      'Fonte: logs/cena1/checagem_manual.json. Nas três rodadas houve ao menos uma citação inexistente ou com conteúdo falso.')
  );

  /* =========================================================
     SLIDE 3
     ========================================================= */
  P['s3-tab1'] = body(
    T('Tabela 1: o que cada abordagem entrega') +
    tbl(['170px', '1.2fr', '1.1fr', '1.1fr', '1fr', '1.2fr'],
      ['Abordagem', 'Fundamentação externa', 'Regras executáveis', 'Proveniência', 'Controle humano', 'Limitação principal'], [
        ['LLM puro', 'Não inerente', 'Não inerente', 'Baixa ou não garantida', 'Depende da implementação', 'Alucinação e opacidade'],
        ['XAI post-hoc', 'Não altera a fundamentação', 'Não assegura conformidade', 'Parcial', 'Apoia a interpretação', 'Fidelidade da explicação'],
        ['Sistema simbólico', 'Depende da base de conhecimento', 'Forte', 'Alta, se registrada', 'Configurável', 'Rigidez e manutenção'],
        ['RAG', 'Nativa na recuperação, não na fidelidade final', 'Não inerente', 'Possível, se as fontes forem preservadas', 'Depende da implementação', 'Erros de recuperação ou de citação'],
        ['IA neurossimbólica', 'Integrável', 'Potencialmente forte', 'Depende da arquitetura', 'Configurável', 'Complexidade de integração e validação'],
        { cls: 'dest', c: ['Arquitetura proposta', 'Documentos recuperados e vinculados', 'Regras explícitas verificam e podem bloquear', 'Fontes, verificações e decisões registradas', 'Aprovação nos fluxos relevantes', 'Evidência ainda situada e sem linha de base comum'] }
      ]) +
    foot([F('art-tab1', 'Artigo: Tabela 1'), F('rudin', 'Rudin (2019)'), sel('síntese dos autores'), sel('não é resultado experimental', 'sol')],
      'Fonte do artigo: síntese dos autores a partir de Rudin (2019), Lewis et al. (2020), Moreau e Missier (2013) e Garcez e Lamb (2023). Não validada pelos autores citados.')
  );

  P['s3-rudin'] = body(
    T('Rudin (2019): o argumento sobre explicações a posteriori') +
    '<div class="cols c12" style="gap:56px;align-items:stretch">' +
    '<div class="card" style="display:grid;gap:14px;align-content:start">' +
    '<p class="sans" style="font-size:30px;font-weight:600;color:var(--mut)">Cynthia Rudin · 2019</p>' +
    '<p style="font-size:42px;line-height:1.2;font-style:italic">“Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead.”</p>' +
    '<p class="mut">Nature Machine Intelligence, volume 1, páginas 206–215.</p>' +
    '<p class="nota" style="font-size:26px">A autora recomenda modelos interpretáveis. O artigo usa o argumento sobre a fidelidade das explicações para defender mecanismos verificáveis.</p></div>' +
    '<div style="display:grid;gap:20px;align-content:start">' +
    '<h3>O que o artigo aproveita</h3>' +
    '<ul class="pt-list">' +
    '<li>Explicações a posteriori podem não representar a lógica real da caixa-preta em contextos críticos.</li>' +
    '<li>Em decisões de alto impacto, elas não substituem mecanismos verificáveis.</li>' +
    '<li>Explicar ajuda a compreender, mas não substitui evidência nem responsabilização.</li></ul>' +
    svg(760, 190,
      '<line class="ln" x1="10" y1="40" x2="750" y2="40"/>' +
      '<g class="fd" style="--d:.3s"><circle class="fl m" cx="60" cy="40" r="14"/><text x="30" y="92" style="font-size:26px">decide</text></g>' +
      '<g class="fd" style="--d:.8s"><circle class="fl" cx="360" cy="40" r="14"/><text x="260" y="92" style="font-size:26px">explica depois</text></g>' +
      '<line class="ln az" x1="10" y1="150" x2="750" y2="150"/>' +
      '<g class="fd" style="--d:1.2s"><circle class="fl luz" cx="60" cy="150" r="14"/><text x="30" y="124" class="m" style="font-size:26px">verifica antes</text></g>' +
      '<g class="fd" style="--d:1.6s"><circle class="fl luz" cx="360" cy="150" r="14"/><text x="300" y="184" style="font-size:26px">assina</text></g>',
      'Duas linhas do tempo: explicar depois e verificar antes') +
    '</div></div>' +
    foot([F('rudin', 'Rudin (2019)'), F('art-tab1', 'Artigo: Tabela 1')],
      'Referência: Rudin, C. (2019). Nature Machine Intelligence, 1, 206–215. As três linhas resumem o uso do argumento no artigo (Seções 1, 2.1 e 4.2).')
  );

  /* =========================================================
     SLIDE 4
     ========================================================= */
  (function () {
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var pts = [];
    for (var i = 0; i < 52; i++) pts.push({ x: 30 + rnd() * 620, y: 30 + rnd() * 290, s: rnd() });
    var order = pts.map(function (p, i) { return i; }).sort(function (a, b) { return pts[b].s - pts[a].s; });
    var top = order.slice(0, 5);
    var dots = pts.map(function (p, i) {
      var t = top.indexOf(i) >= 0;
      return '<circle class="' + (t ? 'fl pl' : 'fl m') + ' pp" style="--d:' + (0.2 + i * 0.015).toFixed(2) + 's" cx="' + p.x.toFixed(0) + '" cy="' + p.y.toFixed(0) + '" r="' + (5 + p.s * 9).toFixed(1) + '" ' + (t ? '' : 'opacity=".55"') + '/>';
    }).join('');
    var rk = top.map(function (id, k) {
      return '<g class="fd" style="--d:' + (1.4 + k * .18) + 's"><rect class="nd az" x="990" y="' + (30 + k * 58) + '" width="300" height="46"/><text x="1010" y="' + (62 + k * 58) + '" style="font-size:26px">documento d' + (k + 1) + ' · s = ' + fmt(pts[id].s, 2) + '</text></g>';
    }).join('');
    P['s4-pinoE'] = body(
      T('Pino E: evidência recuperada', 'Equação 1: o sistema escolhe, na coleção, os k documentos mais relevantes para a consulta.') +
      '<div><span class="eq">R<sub><i>k</i></sub>(<i>q</i>) <span class="op">=</span> TopK<sub><i>d</i> <span class="op">∈</span> <i>D</i></sub> <i>s</i>(<i>q</i>, <i>d</i>)</span></div>' +
      svg(1660, 360,
        '<rect class="nd" x="0" y="0" width="680" height="350"/><g transform="translate(0,0)">' + dots + '</g>' +
        '<text class="m" x="20" y="340" style="font-size:26px;display:none"></text>' +
        '<g class="fd" style="--d:1s"><path class="ln az dr" pathLength="1" style="--d:1.1s" d="M690 175 H960"/><path class="fl" d="M956 161 l24 14 l-24 14z"/>' +
        '<rect class="nd az" x="740" y="120" width="170" height="110"/><text class="b" x="825" y="168" text-anchor="middle" style="font-size:32px">s(q, d)</text><text class="m" x="825" y="204" text-anchor="middle" style="font-size:26px">relevância</text></g>' +
        '<rect class="nd" x="970" y="0" width="340" height="350"/>' + rk +
        '<text x="1010" y="334" class="m" style="font-size:26px">k = 5 · R<tspan baseline-shift="sub" font-size="18">k</tspan>(q)</text>' +
        '<g class="fd" style="--d:.2s"><text x="0" y="-12" style="font-size:0"></text></g>' +
        '<g transform="translate(1340,60)"><text x="0" y="0" class="m" style="font-size:26px">pontos = documentos</text><text x="0" y="40" class="m" style="font-size:26px">tamanho = relevância</text><text x="0" y="80" class="m" style="font-size:26px">azul pulsante = top-k</text></g>',
        'Funil: coleção D, função de relevância e k documentos recuperados') +
      '<div class="cols c2" style="gap:36px">' +
      '<p><i>q</i> = consulta · <i>D</i> = coleção · <i>s</i>(<i>q</i>, <i>d</i>) = relevância · <i>R<sub>k</sub></i>(<i>q</i>) = os <i>k</i> documentos recuperados</p>' +
      '<p class="mut">Recuperar não prova que cada documento seja suficiente ou correto. Pontuações do desenho são ilustrativas.</p></div>' +
      foot([F('art-eq', 'Artigo: Equação 1')], 'Equação 1 do artigo (Seção 3.1), baseada em Lewis et al. (2020). Dados do desenho: ilustrativos, não medidos.')
    );
  })();

  P['s4-pinoN'] = body(
    T('Pino N: a norma e os princípios LIMPE', 'Constituição, art. 37: legalidade, impessoalidade, moralidade, publicidade e eficiência.') +
    tbl(['330px', '1fr', '1fr'], ['Princípio', 'Mecanismo relacionado', 'Evidência exigida'], [
      ['<span class="big" style="font-size:54px;color:var(--az);margin-right:14px">L</span>Legalidade', 'Regras normativas e validação de conformidade', 'Norma aplicável, resultado da verificação e exceções'],
      ['<span class="big" style="font-size:54px;color:var(--az);margin-right:14px">I</span>Impessoalidade', 'Critérios uniformes e testes de consistência', 'Resultados para casos equivalentes e auditoria de viés'],
      ['<span class="big" style="font-size:54px;color:var(--az);margin-right:14px">M</span>Moralidade', 'Responsabilização e registro de intervenções', 'Autor, justificativa, alterações e decisões humanas'],
      ['<span class="big" style="font-size:54px;color:var(--az);margin-right:14px">P</span>Publicidade', 'Explicação, proveniência e contestabilidade', 'Fontes, regras e trajetória acessíveis, conforme sigilo e proteção de dados'],
      ['<span class="big" style="font-size:54px;color:var(--az);margin-right:14px">E</span>Eficiência', 'Automação assistida e recuperação documental', 'Tempo, custo, qualidade e retrabalho medidos comparativamente']
    ]) +
    '<p class="nota"><b>LIMPE é uma camada de avaliação jurídico-administrativa</b>, não substitui as capacidades técnicas. Eficiência se mede, não se presume.</p>' +
    foot([F('art-limpe', 'Artigo: Tabela 2')], 'Tabela 2 do artigo (Seção 2.2): síntese dos autores com base em Brasil (1988), Busuioc (2021), De Fine Licht e De Fine Licht (2020), Pádua e Lorenzetto (2024), Bollotti e Wachowicz (2024) e Tabassi (2023).')
  );

  P['s4-pinoT'] = body(
    T('Pino T: o rastro em padrão W3C PROV', 'Grafo PROV-DM do parecer da demonstração (execução real de 25/10/2026).') +
    '<div class="cols" style="grid-template-columns:900px 1fr;gap:34px;align-items:start">' +
    svg(900, 640,
      '<defs><marker id="ar-t" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl" d="M0 0 L12 6 L0 12z"/></marker></defs>' +
      /* arestas */
      '<g class="ln az" style="fill:none;stroke-width:3">' +
      '<path class="dr" pathLength="1" style="--d:.4s" marker-end="url(#ar-t)" d="M130 270 V112"/>' +
      '<path class="dr" pathLength="1" style="--d:.6s" marker-end="url(#ar-t)" d="M450 270 V112"/>' +
      '<path class="dr" pathLength="1" style="--d:.8s" marker-end="url(#ar-t)" d="M770 470 V112"/>' +
      '<path class="dr" pathLength="1" style="--d:1s" marker-end="url(#ar-t)" d="M130 430 V308"/>' +
      '<path class="dr" pathLength="1" style="--d:1.2s" marker-end="url(#ar-t)" d="M380 308 L190 440"/>' +
      '<path class="dr" pathLength="1" style="--d:1.4s" marker-end="url(#ar-t)" d="M520 308 L700 450"/>' +
      '<path class="dr" pathLength="1" style="--d:1.6s" marker-end="url(#ar-t)" d="M170 500 C230 580 300 588 378 584"/></g>' +
      /* rótulos */
      '<g class="m" style="font-size:24px"><text class="m" x="144" y="200" style="font-size:22px">wasAssociatedWith</text><text class="m" x="464" y="200" style="font-size:22px">wasAssociatedWith</text>' +
      '<text class="m" x="756" y="300" text-anchor="end" style="font-size:22px">wasAttributedTo</text><text class="m" x="144" y="352" style="font-size:22px">wasGeneratedBy</text>' +
      '<text class="m" x="268" y="412" style="font-size:22px">used</text><text class="m" x="640" y="400" style="font-size:22px">used</text><text class="m" x="200" y="626" style="font-size:22px">wasDerivedFrom</text></g>' +
      /* agentes */
      [['modelo', 130], ['harness', 450], ['especialista', 770]].map(function (a, i) {
        return '<g class="fd" style="--d:' + (0.1 + i * .1) + 's"><polygon class="nd luz" points="' + (a[1] - 100) + ',100 ' + (a[1] - 100) + ',30 ' + a[1] + ',8 ' + (a[1] + 100) + ',30 ' + (a[1] + 100) + ',100"/>' +
          '<text class="luz b" x="' + a[1] + '" y="68" text-anchor="middle" style="font-size:28px">' + a[0] + '</text></g>';
      }).join('') +
      /* atividades */
      '<g class="fd" style="--d:.3s"><rect class="nd az" x="30" y="270" width="200" height="38"/><text x="130" y="298" text-anchor="middle" style="font-size:26px">geração</text></g>' +
      '<g class="fd" style="--d:.5s"><rect class="nd az" x="340" y="270" width="220" height="38"/><text x="450" y="298" text-anchor="middle" style="font-size:26px">verificação</text></g>' +
      /* entidades */
      '<g class="fd" style="--d:.7s"><ellipse class="nd" cx="130" cy="465" rx="100" ry="38"/><text x="130" y="474" text-anchor="middle" style="font-size:26px">parecer</text></g>' +
      '<g class="fd" style="--d:.9s"><ellipse class="nd" cx="770" cy="490" rx="110" ry="38"/><text x="770" y="499" text-anchor="middle" style="font-size:26px">ontologia</text></g>' +
      '<g class="fd" style="--d:1.7s"><ellipse class="nd az" cx="520" cy="580" rx="140" ry="40"/><text x="520" y="589" text-anchor="middle" style="font-size:26px">7 fontes</text></g>',
      'Grafo PROV-DM com entidades, atividades e agentes') +
    '<pre class="js" aria-label="Trecho do prov-*.json real">' +
    '<span class="k">"hnv:parecer-59eacca6ff47"</span>: {\n' +
    '  <span class="k">"prov:type"</span>: <span class="v">"hnv:Parecer"</span>,\n' +
    '  <span class="k">"hnv:sha256"</span>: <span class="v">"59eacca6ff47…"</span>,\n' +
    '  <span class="k">"hnv:status"</span>: <span class="t">"aguardando aprovação humana"</span> },\n\n' +
    '<span class="k">"hnv:fonte/STF_SV13"</span>: {\n' +
    '  <span class="k">"prov:type"</span>: <span class="v">"hnv:Sumula"</span>,\n' +
    '  <span class="k">"prov:label"</span>: <span class="v">"STF, Súmula Vinculante 13"</span>,\n' +
    '  <span class="k">"hnv:statusValidacao"</span>:\n    <span class="v">"pendente de validação"</span> },\n\n' +
    '<span class="k">"wasDerivedFrom"</span>: { <span class="k">"_:d7"</span>: {\n' +
    '  <span class="k">"prov:generatedEntity"</span>:\n    <span class="v">"hnv:parecer-59eacca6ff47"</span>,\n' +
    '  <span class="k">"prov:usedEntity"</span>:\n    <span class="v">"hnv:fonte/STF_SV13"</span> } }' +
    '</pre></div>' +
    foot([F('prov-dm', 'W3C PROV-DM'), F('hnv-cena2b', 'Log real (cena 2b)')],
      'Trecho abreviado de logs/prov-20261025T192704-230.json; o parecer tem 7 fontes derivadas.')
  );

  P['s4-pinoH'] = body(
    T('Pino H: a liberação é uma decisão humana', 'Equação 3: a recomendação admissível só entra no resultado se a pessoa responsável decidir mantê-la.') +
    '<div><span class="eq xl">L(<i>y</i>) <span class="op">=</span> At(<i>y</i>) <span class="op">∧</span> H(<i>y</i>)</span></div>' +
    '<div class="cols" style="grid-template-columns:560px 1fr;gap:56px;align-items:center">' +
    svg(560, 300,
      '<path class="ln dr" pathLength="1" d="M10 90 H170" style="--d:.2s"/><path class="ln dr" pathLength="1" d="M10 210 H170" style="--d:.4s"/>' +
      '<path class="nd az dr" pathLength="1" d="M170 40 H290 A110 110 0 0 1 290 260 H170 Z" style="--d:.6s"/>' +
      '<path class="ln az dr" pathLength="1" d="M400 150 H540" style="--d:1.2s"/>' +
      '<text class="b" x="230" y="162" style="font-size:36px">AND</text>' +
      '<g class="fd" style="--d:.3s"><text x="10" y="70" style="font-size:28px">At(y) = V</text></g>' +
      '<g class="fd" style="--d:.5s"><text x="10" y="248" style="font-size:28px">H(y) = F</text></g>' +
      '<g class="pp" style="--d:1.4s"><circle class="fl block" cx="540" cy="150" r="14"/></g>' +
      '<text class="block" x="420" y="124" style="font-size:28px">L(y) = F</text>',
      'Porta AND com At verdadeiro, H falso e saída falsa') +
    '<div>' + tbl(['1fr', '1fr', '1fr'], ['At(y)', 'H(y)', 'L(y)'], [
      ['F', 'F', 'F'], ['F', 'V', 'F'],
      { cls: '', c: ['V', 'F', '<span class="block">F: não liberado</span>'] },
      { cls: 'dest', c: ['V', 'V', 'V: liberado'] }
    ]) + '<p class="nota" style="margin-top:14px">Na demonstração real (cena 2b), o parecer ficou em <b>“aguardando aprovação humana”</b>: At verdadeiro, H ainda falso.</p></div></div>' +
    foot([F('art-eq', 'Artigo: Equação 3'), F('hnv-cena2b', 'Log real (cena 2b)')],
      'F = falso, V = verdadeiro. A pessoa pode manter, modificar ou rejeitar a recomendação (artigo, Seção 3.1).')
  );

  P['s4-formula'] = body(
    T('A fórmula da admissibilidade', 'Equação 2: uma especificação da arquitetura, não uma garantia experimental de legalidade ou correção.') +
    '<div><span class="eq xl" style="font-size:96px">At(<i>y</i>) <span class="op">=</span> E(<i>y</i>, <i>R</i>) <span class="op">∧</span> N(<i>y</i>, Ω) <span class="op">∧</span> T(<i>y</i>)</span></div>' +
    '<p class="mut" style="font-size:28px"><i>E</i> = suporte evidencial · <i>N</i> = conformidade com as regras Ω · <i>T</i> = rastreabilidade ' + sel('especificação, não garantia', 'sol') + '</p>' +
    '<h3>O que a demonstração registrou (F = falso, V = verdadeiro)</h3>' +
    tbl(['520px', '230px', '1fr', '320px'], ['Execução', 'E ∧ N ∧ T', 'O que o hook apontou', 'Resultado'], [
      ['Cena 2b: rascunho do modelo local', '<b>F ∧ F ∧ F</b>', '2 citações bloqueadas', '<span class="block">bloqueado (exit 2)</span>'],
      ['Laço local, rodada 1', '<b>F ∧ F ∧ F</b>', '3 citações bloqueadas', '<span class="block">bloqueado (exit 2)</span>'],
      ['Laço local, rodadas 2 e 3', '<b>F ∧ V ∧ V</b>', '3 e depois 1 citação bloqueada', '<span class="block">bloqueado (exit 2)</span>'],
      { cls: 'dest', c: ['Cena 2b: após a correção (modelo de fronteira)', '<b>V ∧ V ∧ V</b>', 'todas as citações na ontologia', 'admissível; aguarda o humano'] }
    ]) +
    foot([F('art-eq', 'Artigo: Equação 2'), F('hnv-cena2b', 'Cena 2b'), F('hnv-laco', 'Laço local')],
      'Valores E, N e T lidos dos logs reais de 25/10/2026 (hnv-demo). Bloqueio exige falha em ao menos um dos três.')
  );

  (function () {
    var rows = [];
    for (var i = 0; i < 16; i++) {
      var e = !!(i & 8), n = !!(i & 4), t = !!(i & 2), h = !!(i & 1);
      var at = e && n && t, l = at && h;
      var f = function (b) { return b ? 'V' : 'F'; };
      var last = f(l);
      if (at && !h) last = '<span class="block">F</span>';
      var r = [f(e), f(n), f(t), f(h), f(at), last];
      rows.push(l ? { cls: 'dest', c: r.map(function (x) { return x === 'V' ? '<b>V</b>' : x; }) } : r);
    }
    P['s4-regras'] = body(
      T('As regras como código e como tabela-verdade', 'Pseudocódigo ilustrativo das Equações 2 e 3 em lógica de regras (estilo Prolog).') +
      '<div class="cols" style="grid-template-columns:660px 1fr;gap:40px;align-items:start">' +
      '<div style="display:grid;gap:18px">' +
      '<pre class="js" style="font-size:30px;font-stretch:84%;line-height:1.45">' +
      '<span class="k">% Y é admissível se E, N e T valem.</span>\n' +
      '<span class="t">admissivel</span>(Y) <span class="v">:-</span> evidencia(Y),\n' +
      '                  norma(Y),\n' +
      '                  rastro(Y).\n\n' +
      '<span class="k">% Y é liberada se admissível e o humano aprova.</span>\n' +
      '<span class="t">liberada</span>(Y) <span class="v">:-</span> admissivel(Y),\n' +
      '                humano(Y).</pre>' +
      '<p>' + sel('pseudocódigo ilustrativo, do autor') + '</p>' +
      '<p class="mut" style="font-size:26px"><b>:-</b> lê-se “se”; a vírgula é ∧ (e).</p></div>' +
      '<div style="display:grid;gap:20px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' + tbl(['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['E', 'N', 'T', 'H', 'At', 'L'], rows.slice(0, 8), 'tv') + tbl(['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['E', 'N', 'T', 'H', 'At', 'L'], rows.slice(8), 'tv') + '</div>' +
      tbl(['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['admissivel', 'evidencia', 'norma', 'rastro', 'humano', 'liberada'], [['At(y)', 'E(y, R)', 'N(y, Ω)', 'T(y)', 'H(y)', 'L(y)']], 'tv') + '</div></div>' +
      foot([F('pseudocodigo', 'Pseudocódigo (ilustrativo)'), F('art-eq', 'Artigo: Equações 2 e 3')],
        'Tabela-verdade completa (16 linhas) calculada a partir das Equações 2 e 3. Só a linha destacada libera; em âmbar, a que é admissível mas não liberada.')
    );
  })();

  /* =========================================================
     SLIDE 5
     ========================================================= */
  (function () {
    var lanes = [['Documentos', 20], ['Neural', 150], ['Simbólico', 280], ['Humano', 410]];
    var bg = lanes.map(function (l, i) {
      return '<rect x="0" y="' + (l[1] - 12) + '" width="1660" height="108" fill="' + (i % 2 ? '#0A1226' : '#0E1A33') + '" opacity=".8"/>' +
        '<text class="m" x="14" y="' + (l[1] + 52) + '" style="font-size:28px">' + l[0] + '</text>';
    }).join('');
    function node(i, lane, t, s, cls, d) {
      var x = 190 + i * 245, y = lanes[lane][1];
      return '<g class="fd" style="--d:' + d + 's"><rect class="nd ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="230" height="84"/>' +
        '<text class="b ' + (cls === 'luz' ? 'luz' : '') + '" x="' + (x + 115) + '" y="' + (y + 36) + '" text-anchor="middle" style="font-size:28px">' + t + '</text>' +
        '<text class="' + (cls === 'luz' ? 'luz' : 'm') + '" x="' + (x + 115) + '" y="' + (y + 68) + '" text-anchor="middle" style="font-size:26px">' + s + '</text></g>';
    }
    P['s5-fig1'] = body(
      T('Figura 1 redesenhada: neural propõe, simbólico verifica') +
      svg(1660, 520,
        '<defs><marker id="ar-f" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl" d="M0 0 L12 6 L0 12z"/></marker>' +
        '<marker id="ar-fb" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl block" d="M0 0 L12 6 L0 12z"/></marker></defs>' + bg +
        '<g class="ln az" style="stroke-width:3">' +
        '<path class="dr" pathLength="1" style="--d:.3s" marker-end="url(#ar-f)" d="M420 62 H433"/>' +
        '<path class="dr" pathLength="1" style="--d:.7s" marker-end="url(#ar-f)" d="M663 62 H678 V192 H678"/>' +
        '<path class="dr" pathLength="1" style="--d:1.1s" marker-end="url(#ar-f)" d="M908 192 H923 V322 H923"/>' +
        '<path class="dr" pathLength="1" style="--d:1.5s" marker-end="url(#ar-f)" d="M1153 322 H1168"/>' +
        '<path class="dr" pathLength="1" style="--d:1.9s" marker-end="url(#ar-f)" d="M1398 322 H1413 V452 H1413"/></g>' +
        '<path class="ln block dr" pathLength="1" style="--d:2.4s" marker-end="url(#ar-fb)" d="M1038 280 V266 H793 V238"/>' +
        '<text class="block" x="830" y="254" style="font-size:26px">bloqueia e devolve para correção</text>' +
        node(0, 0, 'Consulta', 'q e coleção D', '', .1) +
        node(1, 0, 'Recuperar', 'R_k(q)', '', .5) +
        node(2, 1, 'Gerar', 'modelo neural, y', '', .9) +
        node(3, 2, 'Verificar', 'E e N (regras Ω)', 'az', 1.3) +
        node(4, 2, 'Registrar', 'T, em PROV', 'az', 1.7) +
        node(5, 3, 'Aprovar', 'H(y), então L(y)', 'luz', 2.1),
        'Raias documentos, neural, simbólico e humano com o fluxo da arquitetura') +
      '<p class="nota">Redesenho a partir da Figura 1 e da Seção 3.1 do artigo. Se a verificação encontra problema, bloqueia a resposta e a devolve para correção; a liberação depende da decisão humana.</p>' +
      foot([F('art-arq', 'Artigo: Figura 1 e Seção 3.1')], 'Redesenho do autor do painel; a figura original está no artigo. O nó “Verificar” reúne evidência (E) e norma (N); “Registrar” cobre o rastro (T).')
    );
  })();

  P['s5-calais'] = body(
    T('Três níveis de contribuição', 'Do modelo de governança ao sistema que o opera.') +
    '<div class="cols" style="grid-template-columns:1fr 480px;gap:40px;align-items:stretch">' +
    '<div class="card" style="background:var(--nt);border-color:var(--neb);padding:26px 30px;display:grid;gap:18px">' +
    '<div><h3 style="font-size:40px">CALAIS</h3><p class="mut">Modelo de governança e auditabilidade para IA verticalizada, isto é, configurada ao domínio, às suas evidências, regras e responsabilidades.</p></div>' +
    '<div class="card" style="background:var(--nt2);border-color:var(--az);display:grid;gap:14px">' +
    '<div><h3 style="font-size:36px">Arquitetura neurossimbólica</h3><p class="mut">Traduz as condições em componentes: recuperação documental, geração neural, checagem por regras, correção, registro da origem e decisão humana.</p></div>' +
    '<div class="card" style="background:var(--aco);border-color:var(--ink)"><h3 style="font-size:34px">Citāre</h3><p>Artefato de referência: o sistema que hoje operacionaliza o CALAIS por meio dessa arquitetura.</p></div></div></div>' +
    '<div style="display:grid;gap:18px;align-content:center">' +
    '<p class="mut">Aplicações prévias informaram o design:</p>' +
    '<div class="card"><h3>CBMSC</h3><p class="mut">processo público-operacional</p></div>' +
    '<div class="card"><h3>ESAG/UDESC</h3><p class="mut">processo público-acadêmico de seleção</p></div>' +
    '<p>' + sel('exploratório') + '</p></div></div>' +
    '<div class="card" style="border-color:var(--az)"><p style="font-size:28px"><b>CALAIS = harness vertical.</b> O artigo #160 não usa a palavra “harness”; em 2026, a engenharia de agentes passou a chamar assim o conjunto de regras e ferramentas em torno do modelo. ' + F('bockeler2026', 'Böckeler (2026)') + ' ' + F('galster2026', 'Galster et al. (2026)') + '</p></div>' +
    foot([F('art-arq', 'Artigo: Seções 1 e 3.1'), F('art-escopo', 'Artigo: escopo da evidência')], 'Definição dos três níveis conforme a Introdução do artigo.')
  );

  P['s5-dsr'] = body(
    T('Tabela 3: seis ciclos de Design Science Research') +
    '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:0;margin-bottom:4px">' +
    ['Problema', 'Requisitos', 'Design', 'Demonstração', 'Avaliação', 'Refinamento'].map(function (c, i) {
      return '<div class="fd" style="--d:' + (0.2 + i * .2) + 's;background:' + (i === 5 ? 'var(--ink)' : 'var(--aco)') + ';color:' + (i === 5 ? '#0A1428' : 'var(--ink)') + ';font:600 28px/1 var(--fd);padding:20px 10px 20px 36px;clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%,26px 50%);margin-right:-8px">' + c + '</div>';
    }).join('') + '</div>' +
    tbl(['210px', '1fr', '1fr'], ['Ciclo', 'Atividade realizada', 'Evidência ou produto'], [
      ['Problema', 'Análise de processos decisórios com uso intensivo de documentos', 'Necessidade de evidência, regra, rastro e decisão humana'],
      ['Requisitos', 'Levantamento com documentos e especialistas do domínio', 'Requisitos funcionais e salvaguardas'],
      ['Design', 'Integração de RAG, regras, logs e revisão humana', 'Arquitetura e fluxo de decisão'],
      ['Demonstração', 'Aplicação no CBMSC e versão derivada na ESAG/UDESC', 'Registros dos dois contextos'],
      ['Avaliação', 'Análise descritiva de uso, carga percebida e ocorrências', 'Tabelas, logs e respostas ao Raw NASA-TLX'],
      ['Refinamento', 'Ajustes derivados da aplicação e da revisão por especialistas', 'Evolução do artefato e de suas regras']
    ]) +
    foot([F('art-dsr', 'Artigo: Tabela 3')], 'Fonte do artigo: elaborada pelo autor com base em Peffers et al. (2007), adaptando a sequência às atividades efetivamente realizadas.')
  );

  P['s5-ponte'] = body(
    T('A ponte: como a saída neural vira entrada de regras', 'O texto é convertido em símbolos discretos (citações) que as regras conseguem conferir.') +
    '<div class="cols c3" style="gap:20px">' +
    '<div><span class="eq" style="font-size:54px"><i>y</i> <span class="op">=</span> <i>f</i>(<i>x</i>)</span><p class="mut" style="font-size:26px;margin-top:8px">neural: texto, probabilístico</p></div>' +
    '<div><span class="eq" style="font-size:54px"><i>g</i>(<i>y</i>) <span class="op">=</span> N(<i>y</i>, Ω) <span class="op">∧</span> T(<i>y</i>)</span><p class="mut" style="font-size:26px;margin-top:8px">simbólico: V ou F</p></div>' +
    '<div><span class="eq" style="font-size:54px">(<i>g</i> <span class="op">∘</span> <i>f</i>)(<i>x</i>) <span class="op">=</span> <i>g</i>(<i>f</i>(<i>x</i>))</span><p class="mut" style="font-size:26px;margin-top:8px">composição das duas etapas</p></div></div>' +
    svg(1660, 330,
      '<defs><marker id="ar-p" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl" d="M0 0 L12 6 L0 12z"/></marker>' +
      '<marker id="ar-pb" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl block" d="M0 0 L12 6 L0 12z"/></marker></defs>' +
      '<rect x="285" y="0" width="520" height="330" fill="none" stroke="#6F8FC7" stroke-width="2" stroke-dasharray="10 8" opacity=".7"/>' +
      '<text class="m" x="305" y="38" style="font-size:26px">neural (guia macio)</text>' +
      '<rect x="835" y="0" width="825" height="330" fill="#0E1A33" stroke="#7BA3EE" stroke-width="2.5"/>' +
      '<text class="m" x="855" y="38" style="font-size:26px">simbólico (regra dura)</text>' +
      [['Pedido', 'x', 20, ''], ['Modelo', 'f', 310, ''], ['Texto', 'y', 560, ''], ['Extrair', 'φ(y)', 860, 'az'], ['Conferir', 'C ∈ Ω', 1130, 'az'], ['Resultado', 'V ou F', 1400, 'az']].map(function (n, i) {
        var w = i === 0 || i === 2 ? 220 : 230;
        return '<g class="fd" style="--d:' + (0.2 + i * .35) + 's"><rect class="nd ' + n[3] + '" x="' + n[2] + '" y="120" width="' + (n[2] === 20 ? 235 : w) + '" height="100"/>' +
          '<text class="b" x="' + (n[2] + (n[2] === 20 ? 117 : w / 2)) + '" y="160" text-anchor="middle" style="font-size:30px">' + n[0] + '</text>' +
          '<text class="m" x="' + (n[2] + (n[2] === 20 ? 117 : w / 2)) + '" y="200" text-anchor="middle" style="font-size:28px;font-style:italic">' + n[1] + '</text></g>';
      }).join('') +
      '<g class="ln az" style="stroke-width:3"><path class="dr" pathLength="1" style="--d:.5s" marker-end="url(#ar-p)" d="M255 170 H305"/>' +
      '<path class="dr" pathLength="1" style="--d:.9s" marker-end="url(#ar-p)" d="M540 170 H555"/>' +
      '<path class="dr" pathLength="1" style="--d:1.3s" marker-end="url(#ar-p)" d="M780 170 H855"/>' +
      '<path class="dr" pathLength="1" style="--d:1.7s" marker-end="url(#ar-p)" d="M1090 170 H1125"/>' +
      '<path class="dr" pathLength="1" style="--d:2.1s" marker-end="url(#ar-p)" d="M1360 170 H1395"/></g>' +
      '<text class="b" x="822" y="96" text-anchor="middle" style="font-size:26px">a ponte</text>' +
      '<path class="ln block dr" pathLength="1" style="--d:2.6s" marker-end="url(#ar-pb)" d="M1515 220 V290 H425 V224"/>' +
      '<text class="block" x="640" y="278" style="font-size:26px">F: bloqueio, devolve ao modelo (exit 2)</text>',
      'Fluxo do pedido ao resultado, com a ponte entre o modelo e as regras') +
    '<p>' + sel('esquema ilustrativo, do autor') + '</p>' +
    '<div class="cols c2" style="gap:44px">' +
    '<p><b>Neural:</b> escreve em linguagem natural; a saída é uma sequência provável de palavras.</p>' +
    '<p><b>Simbólico:</b> extrai as citações por padrões de texto, consulta uma lista fechada (a ontologia) e devolve V ou F; F bloqueia.</p></div>' +
    foot([F('pseudocodigo', 'Esquema (ilustrativo)'), F('hnv-readme', 'README da demonstração'), F('art-eq', 'Artigo: Equação 2')],
      'Notação g ∘ f ilustrativa, do autor deste painel: f é o modelo, g reúne a verificação e o registro. A extração φ usa padrões de texto na demonstração.')
  );

  /* =========================================================
     SLIDE 6
     ========================================================= */
  (function () {
    var X = function (i) { return i * 276; };
    function nd(i, y, a, b, cls, d) {
      var lz = cls === 'luz' ? ' luz' : '';
      return '<g class="fd" style="--d:' + d + 's"><rect class="nd ' + (cls || '') + '" x="' + X(i) + '" y="' + y + '" width="230" height="84"/>' +
        '<text class="b' + lz + '" x="' + (X(i) + 115) + '" y="' + (y + 36) + '" text-anchor="middle" style="font-size:26px">' + a + '</text>' +
        '<text class="' + (lz ? 'luz' : 'm') + '" x="' + (X(i) + 115) + '" y="' + (y + 68) + '" text-anchor="middle" style="font-size:26px">' + b + '</text></g>';
    }
    function lab(x, y, t, anchor) { return '<text class="m" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" style="font-size:26px">' + t + '</text>'; }
    P['s6-ontologia'] = body(
      T('A ontologia do Citāre: classes e instâncias') +
      '<div style="position:relative">' +
      svg(1660, 520,
        '<defs><marker id="ar-o" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl" d="M0 0 L12 6 L0 12z"/></marker></defs>' +
        '<g class="ln az" style="stroke-width:3">' +
        [0, 1, 2, 3, 4].map(function (i) { return '<path class="dr" pathLength="1" style="--d:' + (0.3 + i * .3) + 's" marker-end="url(#ar-o)" d="M' + (X(i) + 230) + ' 92 H' + (X(i + 1) - 2) + '"/>'; }).join('') +
        '<path class="dr ln t" pathLength="1" style="--d:1.9s" marker-end="url(#ar-o)" d="M1495 134 V228"/>' +
        '<path class="dr" pathLength="1" style="--d:2.2s" marker-end="url(#ar-o)" d="M1380 272 H1336"/>' +
        '<path class="dr" pathLength="1" style="--d:2.5s" marker-end="url(#ar-o)" d="M1104 272 H1060"/>' +
        '<path class="dr" pathLength="1" style="--d:2.8s" marker-end="url(#ar-o)" d="M943 228 V134"/>' +
        '<path class="dr" pathLength="1" style="--d:3.1s" marker-end="url(#ar-o)" d="M1380 452 H1336"/>' +
        '<path class="dr" pathLength="1" style="--d:3.4s" marker-end="url(#ar-o)" d="M1104 452 H1060"/></g>' +
        lab(X(0) + 253, 36, 'tem seção') + lab(X(1) + 253, 36, 'contém') + lab(X(2) + 253, 36, 'expressa') + lab(X(3) + 253, 36, 'é citada por') + lab(X(4) + 253, 36, 'identifica') +
        lab(1480, 190, 'tem uma cópia em PDF', 'end') + lab(1357, 222, 'contém') + lab(1082, 222, 'apoia, após validação') + lab(925, 190, 'vínculo de evidência', 'end') +
        lab(1357, 402, 'confere') + lab(1082, 402, 'produz resultado') +
        nd(0, 50, 'Artigo 42', ': Artigo', '', .1) + nd(1, 50, 'Introdução', ': Seção', '', .4) + nd(2, 50, 'Parágrafo 4', ': Parágrafo', '', .7) +
        nd(3, 50, 'Afirmação A1', ': Afirmação', 'az', 1.0) + nd(4, 50, '(Silva, 2022)', ': Citação', '', 1.3) + nd(5, 50, 'Obra de Silva', ': Fonte', '', 1.6) +
        nd(5, 230, 'PDF da obra', ': Arquivo PDF', '', 2.1) + nd(4, 230, 'Trecho p. 4', ': Trecho', '', 2.4) + nd(3, 230, 'Afirmação A1', ': Afirmação', 'az', 2.7) +
        nd(5, 410, 'Auditoria 7', ': Auditoria', '', 3.0) + nd(4, 410, 'Fonte / PDF', ': Fonte', '', 3.3) + nd(3, 410, 'evidence_ready', ': Estado', 'luz', 3.6),
        'Cadeia do artigo até o trecho e a auditoria da fonte') +
      '<div class="card" style="position:absolute;left:0;top:226px;width:800px;height:290px;padding:16px 22px;display:grid;gap:10px;align-content:start;font-size:26px;line-height:1.25">' +
      '<p><b>Ontologia:</b> “especificação explícita e formal de uma conceitualização compartilhada” (Studer, Benjamins e Fensel, 1998, a partir de Gruber, 1993).</p>' +
      '<p><b>T-box</b> (terminologia): as classes e as relações. Três grupos: Conteúdo acadêmico, Evidência e fonte, Controle.</p>' +
      '<p><b>A-box</b> (asserções): as instâncias e suas ligações, como Artigo 42 e Auditoria 7.</p></div></div>' +
      '<p class="nota"><b>O artigo foi redigido e conferido com o Citāre, com revisão humana.</b> Dados do CBMSC/ESAG não avaliam o Citāre. Instâncias do desenho são fictícias. ' + sel('material didático') + '</p>' +
      foot([F('ont-citare', 'Ontologia do Citāre (v05)'), F('studer1998', 'Studer et al. (1998)'), F('art-citare', 'Artigo: declaração de uso')],
        'Atividade 1 de Desenvolvimento de Ontologias, v05 (30/09/2026). O desenho reproduz a cadeia e a árvore da atividade; as classes intermediárias são didáticas.')
    );
  })();

  P['s6-regras'] = body(
    T('Autoria, ano e DOI; os quatro estados da fonte') +
    '<div class="cols" style="grid-template-columns:1fr 700px;gap:40px;align-items:start">' +
    '<div style="display:grid;gap:12px"><h3>Estado da fonte no Citāre</h3>' +
    svg(940, 200,
      [['quarantined', 'em quarentena: dado ausente ou divergente', 0], ['identity_verified', 'identidade confirmada', 1], ['text_verified', 'texto conferido: pode anexar', 2], ['evidence_ready', 'trecho validado para a afirmação', 3]].map(function (s, i) {
        var h = 50 + i * 38, y = 200 - h, x = i * 235;
        return '<g class="fd" style="--d:' + (0.3 + i * .5) + 's"><rect class="nd ' + (i === 3 ? 'luz' : i === 0 ? 'cz' : 'az') + '" x="' + x + '" y="' + y + '" width="225" height="' + h + '"/>' +
          '<text class="b ' + (i === 3 ? 'luz' : '') + '" x="' + (x + 12) + '" y="' + (y + 32) + '" style="font-size:26px">' + s[0].replace('_', '_') + '</text></g>';
      }).join('') +
      [['em quarentena', 0], ['identidade', 1], ['texto', 2], ['evidência', 3]].map(function () { return ''; }).join(''),
      'Quatro degraus: quarentena, identidade, texto, evidência') +
    '<ul class="pt-list" style="gap:4px"><li style="font-size:26px">quarantined: dado ausente, não confirmado ou divergente</li><li style="font-size:26px">identity_verified: obra identificada; origem do texto ainda não</li><li style="font-size:26px">text_verified: pode ser anexada ao artigo</li><li style="font-size:26px">evidence_ready: trecho validado ligado a uma afirmação</li></ul></div>' +
    '<div style="display:grid;gap:12px"><h3>A exportação formal bloqueia na etapa</h3>' +
    [['bibliographic_match', 'o marcador não achou a obra certa entre as fontes do artigo'], ['recovery', 'a recuperação do PDF falhou'], ['source_audit', 'fonte em quarentena ou sem auditoria atual'], ['exact_evidence', 'falta o vínculo desta afirmação exata ao trecho']].map(function (b) {
      return '<div class="card block" style="padding:12px 18px"><p class="block sans" style="font-weight:600;font-size:28px">' + b[0] + '</p><p style="font-size:26px">' + b[1] + '</p></div>';
    }).join('') + '</div></div>' +
    '<div class="card" style="display:grid;gap:12px"><div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><span class="chip ok">autoria</span><span class="chip ok">ano</span><span class="chip ok">DOI</span><span class="mut" style="font-size:26px">o marcador (Silva, 2022) precisa corresponder a uma obra registrada; o DOI identifica cada obra</span></div>' +
    '<p style="font-size:26px"><b>Conferido com o Citāre. Declaração de uso de IA do artigo:</b> o autor usou o Citāre, plataforma de assessoria acadêmica com supervisão humana, para apoiar a redação e a verificação de citações; o texto foi guiado pelas fontes da coleção do autor (RAG), com regras de autoria, ano e DOI. Todo conteúdo e toda citação sugeridos foram revisados e aprovados pelo autor, que assume plena responsabilidade, sem atribuir autoria à IA.</p></div>' +
    '<p class="nota"><b>Dados do CBMSC/ESAG não avaliam o Citāre.</b> ' + sel('material didático') + '</p>' +
    foot([F('art-citare', 'Artigo: declaração de uso de IA'), F('ont-citare', 'Ontologia do Citāre (v05)')],
      'Declaração traduzida do artigo (seção “AI use disclosure”). Estados e etapas: Atividade de Ontologia v05.')
  );

  P['s6-triplas'] = body(
    T('Triplas da ontologia e a recuperação (Equação 1)', 'Sujeito, predicado e objeto: o formato de dados em RDF/OWL.') +
    '<div class="cols" style="grid-template-columns:1fr 640px;gap:40px;align-items:start">' +
    tbl(['1fr', '1fr', '1fr'], ['Sujeito', 'Predicado', 'Objeto'], [
      [':Artigo42', 'a', ':Artigo'], [':Artigo42', ':temSecao', ':Introducao'], [':Introducao', ':contem', ':Paragrafo4'], [':Paragrafo4', ':expressa', ':A1'],
      [':A1', ':temCitacao', ':CitSilva2022'], [':CitSilva2022', ':identifica', ':ObraSilva2022'], [':ObraSilva2022', ':temCopiaEm', ':PDFSilva2022'], [':PDFSilva2022', ':contem', ':Trecho_p4'],
      { cls: 'dest', c: [':Trecho_p4', ':podeApoiar', ':A1'] }, [':Auditoria7', ':confere', ':PDFSilva2022'], [':Auditoria7', ':produzResultado', ':EvidenceReady']
    ], 'trip') +
    '<div style="display:grid;gap:18px">' +
    '<div class="card"><span class="eq" style="font-size:60px;border:none;padding:0;background:none">R<sub><i>k</i></sub>(<i>q</i>) <span class="op">=</span> TopK<sub><i>d</i> <span class="op">∈</span> <i>D</i></sub> <i>s</i>(<i>q</i>, <i>d</i>)</span>' +
    '<p style="font-size:27px;margin-top:10px">A recuperação (Eq. 1) traz trechos candidatos. A tripla destacada só passa a valer depois da validação: estar no mesmo PDF não basta.</p></div>' +
    '<p>' + sel('triplas ilustrativas, do autor') + '</p>' +
    '<p class="nota" style="font-size:26px">Modelagem do autor do painel a partir da Atividade v05; os nomes dos predicados são adaptados e a instância (Silva, 2022) é fictícia.</p></div></div>' +
    foot([F('ont-citare', 'Ontologia do Citāre (v05)'), F('art-eq', 'Artigo: Equação 1'), F('pseudocodigo', 'Triplas (ilustrativas)')],
      'Notação Turtle simplificada: “a” significa “é instância de”. Dados do CBMSC/ESAG não avaliam o Citāre.')
  );

  /* =========================================================
     SLIDE 7
     ========================================================= */
  (function () {
    var meses = [['jan', 4], ['fev', 28], ['mar', 31], ['abr', 30], ['mai', 31], ['jun', 30], ['jul', 31], ['ago', 7]];
    var tot = 192, cw = 1660 / tot, cells = '', labs = '', i = 0, acc = 0;
    meses.forEach(function (m) {
      for (var d = 0; d < m[1]; d++, i++) {
        cells += '<rect class="fd" style="--d:' + (0.2 + i * 0.012).toFixed(2) + 's" x="' + (i * cw + 1).toFixed(1) + '" y="0" width="' + (cw - 2).toFixed(1) + '" height="54" fill="' + (m[1] < 8 ? '#2C4F86' : '#1E3A66') + '" stroke="#6F8FC7" stroke-width=".8"/>';
      }
      if (m[1] > 20) labs += '<text class="m" x="' + ((acc + m[1] / 2) * cw).toFixed(0) + '" y="92" text-anchor="middle" style="font-size:26px">' + m[0] + '</text>';
      acc += m[1];
    });
    var seg = 2813 / 9054;
    P['s7-logs'] = body(
      T('CBMSC: o que os logs de envio mostram', 'Janeiro a agosto de 2026, artefato de envio de mensagens.') +
      '<div class="cols c3" style="align-items:end">' +
      '<div><span class="big" style="font-size:96px">' + cnt(9054, 'k') + '</span><p class="mut">registros de envio</p></div>' +
      '<div><span class="big" style="font-size:96px">~' + cnt(191) + '</span><p class="mut">dias, de 28/01 a 07/08/2026</p></div>' +
      '<div><span class="big" style="font-size:96px;color:#C2CBDD">' + cnt(2813, 'k') + '</span><p class="mut">envios sem sucesso</p></div></div>' +
      svg(1660, 104, cells + labs, 'Calendário ilustrativo de cerca de 191 dias, de 28 de janeiro a 7 de agosto de 2026') +
      '<p class="mut" style="font-size:26px;margin-top:-10px">Calendário ilustrativo: só o total do período (9.054 em ~191 dias); não há dado por dia. ' + sel('ilustrativo', 'sol') + '</p>' +
      '<div style="display:grid;gap:10px"><div class="bar-trk" style="height:50px"><i class="bar aco" style="left:0;width:' + (100 - seg * 100).toFixed(2) + '%;--d:.5s"></i>' +
      '<i class="bar cz" style="left:' + (100 - seg * 100).toFixed(2) + '%;width:' + (seg * 100).toFixed(2) + '%;--d:1.2s"></i></div>' +
      '<p class="mut" style="font-size:26px">Cinza: 2.813 sem sucesso (' + pct(seg) + '% dos 9.054). Azul: os demais 6.241 (diferença, cálculo do autor). Sem sucesso não é bloqueio.</p></div>' +
      '<div class="cols" style="grid-template-columns:repeat(3,1fr) 1.35fr;gap:18px;align-items:stretch">' +
      '<div class="card"><span class="val">' + cnt(137) + '</span><p style="font-size:26px">falhas de conexão</p></div>' +
      '<div class="card"><span class="val">' + cnt(143) + '</span><p style="font-size:26px">estados close</p></div>' +
      '<div class="card"><span class="val">' + cnt(1018, 'k') + '</span><p style="font-size:26px">erros de aquecimento</p></div>' +
      '<p class="nota" style="font-size:27px"><b>Processos diferentes, não somados.</b> Nenhum evento classificado como banimento ou restrição de linha pela Meta foi localizado. Isso não é risco zero: não há campo exclusivo para detectar todo banimento.</p></div>' +
      '<p>' + sel('exploratório, SC') + '</p>' +
      foot([F('art-logs', 'Artigo: logs do CBMSC'), F('art-escopo', 'Artigo: escopo')], 'Seção 4.1 do artigo: de 28/01 a 07/08 são 192 dias contando as duas pontas; o artigo diz “aproximadamente 191”.')
    );
  })();

  (function () {
    var sc = [15.83, 15.83, 5.00, 3.33, 1.67, 0.00];
    var X = function (v) { return 40 + v * 15.8; };
    var ticks = '', dots = '';
    for (var v = 0; v <= 100; v += 10) ticks += '<line class="grid" x1="' + X(v) + '" y1="70" x2="' + X(v) + '" y2="150"/><text class="m" x="' + X(v) + '" y="182" text-anchor="middle" style="font-size:26px">' + v + '</text>';
    var seen = {};
    sc.forEach(function (s, i) {
      var k = s.toFixed(2); seen[k] = (seen[k] || 0) + 1;
      dots += '<circle class="fl pp" style="--d:' + (0.4 + i * .25) + 's" cx="' + X(s) + '" cy="' + (110 - (seen[k] - 1) * 30) + '" r="13"/>';
    });
    P['s7-nasa'] = body(
      T('NASA-TLX bruto: seis registros de tarefas', 'TLX bruto = (1/6) Σ s<sub>i</sub>, sobre as seis dimensões (0 a 100); quanto menor, menor a carga percebida.') +
      svg(1660, 200,
        ticks + '<line class="ln" x1="40" y1="150" x2="1620" y2="150"/>' + dots +
        '<line class="ln az dr" pathLength="1" style="--d:1.9s" x1="' + X(6.94) + '" y1="40" x2="' + X(6.94) + '" y2="150"/>' +
        '<text class="b" x="' + (X(6.94) + 10) + '" y="34" style="font-size:28px">média 6,94</text>' +
        '<line class="ln t dr" pathLength="1" style="--d:2.2s" x1="' + X(4.17) + '" y1="58" x2="' + X(4.17) + '" y2="150"/>' +
        '<text class="m" x="' + (X(4.17) + 340) + '" y="34" text-anchor="end" style="font-size:0"></text>' +
        '<text x="' + (X(15.83) + 40) + '" y="124" style="font-size:28px">mediana 4,17 (linha tracejada)</text>',
        'Pontos de 0 a 15,83 numa escala de 0 a 100, com média e mediana') +
      '<div class="cols" style="grid-template-columns:760px 1fr;gap:44px;align-items:start">' +
      tbl(['110px', '1fr', '150px'], ['Registro', 'Tarefa', 'Pontuação'], [
        ['R1', 'Salvar análise de entrevista', '15,83'], ['R2', 'Salvar regras de decisão', '15,83'], ['R3', 'Salvar diagrama BPMN', '5,00'],
        ['R4', 'Salvar diagrama BPMN', '3,33'], ['R5', 'Salvar diagrama BPMN', '1,67'], ['R6', 'Salvar diagrama BPMN', '0,00']
      ]) +
      '<div style="display:grid;gap:14px"><h3>Como ler</h3><ul class="pt-list">' +
      '<li>São <b>tarefas, não pessoas</b>: seis registros, dois identificadores.</li>' +
      '<li>Cinco registros vêm da mesma conta, logo não são independentes.</li>' +
      '<li>Sem comparação manual e sem inferência populacional.</li>' +
      '<li>O zero foi mantido: a tabela e a auditoria confirmaram o envio.</li></ul></div></div>' +
      '<p>' + sel('exploratório') + ' ' + sel('sem inferência', 'sol') + '</p>' +
      foot([F('art-nasa', 'Artigo: Tabela 5'), F('hart1988', 'Hart e Staveland (1988)')], 'Média 6,94; mediana 4,17; faixa 0,00 a 15,83 (Raw NASA-TLX = média simples de seis dimensões).')
    );
  })();

  P['s7-tab4'] = body(
    T('Tabela 4: o que cada caso permite afirmar', 'Evidência delimitada: contextos, etapas e medidas diferentes.') +
    tbl(['300px', '1fr', '1fr'], ['Dimensão', 'CBMSC', 'ESAG/UDESC'], [
      ['Contexto', 'Processo público-operacional', 'Processo público-acadêmico de seleção'],
      ['Etapa', 'Operação assistida observada', 'Versão derivada em fase beta'],
      ['Raw NASA-TLX', '<span class="az">●</span> Seis registros associados a dois identificadores', '<span class="mut">○</span> Não identificado no material analisado'],
      ['Logs de operação', '<span class="az">●</span> Disponíveis para envio de mensagens, infraestrutura e aquecimento', '<span class="mut">○</span> Nenhuma medida diretamente comparável identificada'],
      { cls: 'dest', c: ['Salvaguardas comuns', 'Documentos, regras e decisão humana', 'Documentos, regras e decisão humana'] }
    ]) +
    '<p class="nota"><b>● disponível · ○ não identificado.</b> Os dois casos não são comparados quantitativamente e não avaliam o Citāre.</p>' +
    foot([F('art-tab4', 'Artigo: Tabela 4'), F('art-escopo', 'Artigo: escopo')], 'Tabela 4 do artigo (Seção 4.1), traduzida. ESAG/UDESC: versão beta; não foram identificadas medidas comparáveis.')
  );

  /* =========================================================
     SLIDE 8
     ========================================================= */
  P['s8-replay'] = body(
    T('Replay da execução real', 'Gerado só a partir dos logs de 25/10/2026; cerca de 87 segundos.') +
    '<iframe class="replay" src="demo/replay.html" title="Replay da demonstração" loading="eager" scrolling="no"></iframe>' +
    '<p>' + sel('ilustrativa, execução real, 25/10/2026') + '</p>' +
    foot([F('hnv-cena2b', 'Log real (cena 2b)'), F('hnv-laco', 'Laço local'), F('hnv-cena1', 'Cena 1')],
      'Espaço pausa; R reinicia. Os logs foram sanitizados (a lista de ferramentas pessoais saiu).')
  );

  (function () {
    var u = 45, x0 = 40, ticks = '', lab = {};
    ['I', 'V', 'X', 'XV', 'XX', 'XXII'].forEach(function (r, i) { lab[[1, 5, 10, 15, 20, 22][i]] = r; });
    for (var k = 1; k <= 22; k++) {
      var x = x0 + k * u;
      ticks += '<line class="ln' + (k === 21 ? ' az' : '') + ' dr" pathLength="1" style="--d:' + (0.15 + k * .06).toFixed(2) + 's" x1="' + x + '" y1="' + (k === 21 ? 60 : 78) + '" x2="' + x + '" y2="120"/>';
      if (lab[k]) ticks += '<text x="' + x + '" y="156" text-anchor="middle" style="font-size:26px">' + lab[k] + '</text>';
    }
    P['s8-regua'] = body(
      T('Régua do art. 37: onde o modelo errou', 'O artigo 37 da Constituição tem 22 incisos; o modelo citou o XXXIII.') +
      svg(1660, 250,
        '<line class="ln" x1="' + x0 + '" y1="120" x2="' + (x0 + 22 * u) + '" y2="120"/>' +
        '<line class="ln t" x1="' + (x0 + 22 * u) + '" y1="120" x2="' + (x0 + 33 * u) + '" y2="120" opacity=".6"/>' + ticks +
        '<text class="m" x="' + (x0 + 27 * u) + '" y="156" text-anchor="middle" style="font-size:26px">sem incisos</text>' +
        '<g class="fy" style="--d:1.9s"><line class="ln err" x1="' + (x0 + 33 * u) + '" y1="70" x2="' + (x0 + 33 * u) + '" y2="130"/><circle class="fl err" cx="' + (x0 + 33 * u) + '" cy="52" r="14"/>' +
        '<text class="err b" x="' + (x0 + 33 * u) + '" y="30" text-anchor="middle" style="font-size:28px">XXXIII</text></g>' +
        '<text class="b" x="' + (x0 + 21 * u) + '" y="44" text-anchor="middle" style="font-size:26px">XXI: licitação</text>' +
        [2, 5].map(function (k) { return '<circle class="fl" cx="' + (x0 + k * u) + '" cy="196" r="9"/>'; }).join('') +
        '<text class="m" x="' + (x0 + 6 * u) + '" y="204" style="font-size:26px">pontos azuis: incisos II e V, que estão na ontologia da demonstração</text>',
        'Régua com 22 incisos do art. 37 e o inciso XXXIII fora da ponta') +
      '<div class="cols c3" style="gap:20px">' +
      '<div class="card"><h3>Rodada 1</h3><p><span class="chip err">art. 37, XXXIII</span></p><p class="mut" style="font-size:27px;margin-top:10px">inciso inexistente</p></div>' +
      '<div class="card"><h3>Rodada 2</h3><p style="display:grid;gap:8px;justify-items:start"><span class="chip err">art. 37, XXXIII</span><span class="chip err">Decreto 4.653/2002</span><span class="chip">decisão do STJ sem número</span></p></div>' +
      '<div class="card"><h3>Rodada 3</h3><p style="display:grid;gap:8px;justify-items:start"><span class="chip err">art. 37, XXI, “proíbe o nepotismo”</span><span class="chip">Lei 8.112/1990</span><span class="chip">ADI 2.958</span></p></div></div>' +
      '<p class="nota"><b>Em âmbar:</b> inexistente ou com conteúdo falso. <b>Em cinza-azulado:</b> real, mas sem base ou não conferível. XXXIII só aparece nas rodadas 1 e 2.</p>' +
      foot([F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')], 'Fontes: checagem manual de 25/10/2026 e texto do art. 37 no Planalto. Modelo local 3B (qwen2.5:3b), sem harness; ele errou nas três rodadas.')
    );
  })();

  (function () {
    function nd(x, y, w, h, t, s, cls, d) {
      return '<g class="fd" style="--d:' + d + 's"><rect class="nd ' + (cls || '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>' +
        '<text class="b ' + (cls === 'luz' ? 'luz' : cls === 'block' ? 'block' : '') + '" x="' + (x + w / 2) + '" y="' + (y + (s ? 32 : h / 2 + 9)) + '" text-anchor="middle" style="font-size:26px">' + t + '</text>' +
        (s ? '<text class="' + (cls === 'luz' ? 'luz' : 'm') + '" x="' + (x + w / 2) + '" y="' + (y + 62) + '" text-anchor="middle" style="font-size:26px">' + s + '</text>' : '') + '</g>';
    }
    var sq = '';
    var grupos = [['Norma', 3, 'fl'], ['Dispositivo', 12, 'fl luz'], ['Súmula', 1, 'fl m'], ['Precedente', 2, 'fl cz']];
    var n = 0;
    grupos.forEach(function (g) { for (var i = 0; i < g[1]; i++, n++) sq += '<rect class="' + g[2] + ' pp" style="--d:' + (0.2 + n * .06).toFixed(2) + 's" x="' + ((n % 9) * 52) + '" y="' + (Math.floor(n / 9) * 52) + '" width="42" height="42"/>'; });
    P['s8-portao'] = body(
      T('O portão: do pedido à aprovação humana', 'Fluxo da demonstração (README) e o que ela não faz.') +
      '<div class="cols" style="grid-template-columns:1000px 1fr;gap:34px;align-items:start">' +
      svg(1000, 630,
        '<defs><marker id="ar-g" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl" d="M0 0 L12 6 L0 12z"/></marker>' +
        '<marker id="ar-gb" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path class="fl block" d="M0 0 L12 6 L0 12z"/></marker></defs>' +
        '<g class="ln az" style="stroke-width:3">' +
        '<path class="dr" pathLength="1" style="--d:.3s" marker-end="url(#ar-g)" d="M170 70 V88"/><path class="dr" pathLength="1" style="--d:.6s" marker-end="url(#ar-g)" d="M170 160 V178"/>' +
        '<path class="dr" pathLength="1" style="--d:.9s" marker-end="url(#ar-g)" d="M170 250 V268"/><path class="dr" pathLength="1" style="--d:1.2s" marker-end="url(#ar-g)" d="M320 305 H418"/>' +
        '<path class="dr" pathLength="1" style="--d:1.8s" marker-end="url(#ar-g)" d="M170 340 V378"/><path class="dr" pathLength="1" style="--d:2.1s" marker-end="url(#ar-g)" d="M170 450 V468"/>' +
        '<path class="dr" pathLength="1" style="--d:2.4s" marker-end="url(#ar-g)" d="M170 540 V558"/></g>' +
        '<path class="ln block dr" pathLength="1" style="--d:1.5s" marker-end="url(#ar-gb)" d="M320 330 H370 V425 H418"/>' +
        '<path class="ln block dr" pathLength="1" style="--d:1.9s" marker-end="url(#ar-gb)" d="M748 425 H870 V125 H322"/>' +
        nd(20, 0, 300, 70, 'Pedido do servidor', '', '', .1) + nd(20, 90, 300, 70, 'Modelo neural', 'guia macio: skill', '', .3) +
        nd(20, 180, 300, 70, 'Grava o parecer', 'Write ou Edit', '', .5) + nd(20, 270, 300, 70, 'Hook de verificação', 'regra dura', 'az', .7) +
        nd(420, 260, 340, 90, 'Ontologia', '18 fontes, pendentes', '', 1.0) +
        nd(420, 380, 330, 90, 'exit 2: BLOQUEIO', 'volta ao modelo', 'block', 1.6) +
        nd(20, 380, 300, 70, 'exit 0: OK', 'registro PROV', 'az', 1.9) + nd(20, 470, 300, 70, 'Aguardando humano', 'não liberado', 'luz', 2.2) +
        nd(20, 560, 300, 70, 'aprovar.py', 'só o especialista libera', '', 2.5) +
        '<text class="m" x="420" y="540" style="font-size:26px">aprovar.py recusa se o parecer</text><text class="m" x="420" y="574" style="font-size:26px">não for admissível ou se o</text><text class="m" x="420" y="608" style="font-size:26px">arquivo tiver mudado.</text>',
        'Fluxo: pedido, modelo, hook, ontologia, bloqueio ou registro, aprovação humana') +
      '<div style="display:grid;gap:18px;align-content:start">' +
      '<h3>Ontologia da demonstração: 18 fontes</h3>' +
      svg(468, 150, sq, 'Dezoito quadrados: 3 normas, 12 dispositivos, 1 súmula e 2 precedentes') +
      '<p style="font-size:27px">3 normas · 12 dispositivos · 1 súmula · 2 precedentes ' + sel('pendente de validação') + '</p>' +
      '<h3>Limites</h3><ul class="pt-list" style="gap:8px">' +
      '<li style="font-size:26px"><b>Confere citações, não raciocínio.</b></li>' +
      '<li style="font-size:26px"><b>Bloqueado não é falso:</b> a Resolução 7/2005 existe, mas está fora da ontologia.</li>' +
      '<li style="font-size:26px">Referência vaga (“uma decisão do STJ”) escapa.</li>' +
      '<li style="font-size:26px"><b>Quem corrigiu:</b> o 3B errou; na cena 2b (induzida), um modelo de fronteira (Sonnet, via Claude Code) corrigiu no mesmo harness. O 3B sozinho: 3, 3 e 1 bloqueadas; não liberado.</li></ul></div></div>' +
      foot([F('hnv-readme', 'README da demonstração'), F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-laco', 'Laço local')],
        'Laço local: citações bloqueadas 3, 3 e 1; encerrou como “bloqueado após o limite de rodadas”. Fluxo conforme o README (25/10/2026).')
    );
  })();

  P['s8-prov'] = body(
    T('O rastro do parecer: registro em W3C PROV', 'Relatório de verificação do parecer da cena 2b (execução real).') +
    '<div class="cols" style="grid-template-columns:600px 1fr;gap:40px;align-items:start">' +
    '<div style="display:grid;gap:22px;justify-items:start">' +
    '<span class="stamp">aguardando<br>aprovação humana</span>' +
    tbl(['1fr', '150px'], ['Campo do registro', 'Valor'], [
      ['evidência', '<b>V</b>'], ['norma', '<b>V</b>'], ['rastreabilidade', '<b>V</b>'], ['admissibilidade', '<b>V</b>'],
      ['aprovação humana', '<span class="block">F</span>'], ['liberação', '<span class="block">F</span>']
    ]) +
    '<p class="mut" style="font-size:26px">Verificação em 17 ms. Parecer sha256 59eacca6ff47…; ontologia 0.1.0, sha256 5b1f9baf096c… ' + sel('pendente de validação') + '</p></div>' +
    '<div style="display:grid;gap:12px"><h3>Citações resolvidas na ontologia: 9, sobre 7 fontes</h3>' +
    tbl(['1fr', '1fr', '100px'], ['Citação no parecer', 'Fonte da ontologia', 'Status'], [
      ['CF/88, art. 37, caput', 'CF88_art37_caput', 'ok'], ['CF/88, art. 37, V', 'CF88_art37_V', 'ok'],
      ['STF, Súmula Vinculante 13 (2 vezes)', 'STF_SV13', 'ok'], ['STF, RE 579.951', 'STF_RE579951', 'ok'],
      ['Lei 8.429/1992, art. 11, XI (2 vezes)', 'LEI8429_art11_XI', 'ok'], ['CF/88, art. 37, § 4º', 'CF88_art37_par4', 'ok'],
      ['Decreto 7.203/2010, art. 2º, III', 'DEC7203_art2_III', 'ok']
    ]) + '</div></div>' +
    foot([F('hnv-cena2b', 'Log real (cena 2b)'), F('prov-dm', 'W3C PROV-DM'), F('hnv-ontologia', 'Ontologia (18 fontes)')],
      'Dados de logs/prov-20261025T192704-230.json: rascunho do modelo local 3B, corrigido por um modelo de fronteira (Sonnet, via Claude Code) em cena induzida. A máquina declara “admissível”; só a pessoa libera.')
  );

  /* =========================================================
     SLIDE 9
     ========================================================= */
  (function () {
    function row(label, v, max, cls, d, pre) {
      return '<div class="bar-row" style="grid-template-columns:420px 1fr 130px"><span style="font-size:26px">' + label + '</span>' +
        '<div class="bar-trk" style="height:42px"><i class="bar ' + cls + '" style="left:0;width:' + (v / max * 100).toFixed(1) + '%;--d:' + d + 's"></i></div>' +
        '<span class="val" style="font-size:34px">' + (pre || '') + cnt(v) + '</span></div>';
    }
    P['s9-metodo'] = body(
      T('Como foi feita a contagem de “harness” no arXiv', 'Contagem do autor em 25/10/2026, pela API pública; não é revisão sistemática.') +
      '<div class="cols" style="grid-template-columns:560px 1fr;gap:40px;align-items:start">' +
      '<ol class="pt-list" style="gap:14px;list-style:none">' +
      '<li><b>1. Busca:</b> título com “harness” e <b>agent</b> no resumo (<i>ti:harness AND abs:agent</i>).</li>' +
      '<li><b>2. Filtro:</b> “harness” ou “harnesses” no título; “harnessing” fica de fora.</li>' +
      '<li><b>3. Sentido:</b> 2025 conferido título a título (3 de 4). 2026: o descarte foi <b>estimado</b> por amostra de 25 títulos, todos de agentes; não foi título a título.</li></ol>' +
      '<div style="display:grid;gap:20px">' +
      '<div style="display:grid;gap:8px"><h3>2025</h3>' + row('título com harness (inclui harnessing)', 23, 500, 'cz', .3) + row('harness ou harnesses', 4, 500, 'aco', .6) + row('sentido de agente, conferido', 3, 500, '', .9) + '</div>' +
      '<div style="display:grid;gap:8px"><h3>2026, até 25/10 ' + sel('contagem do autor') + ' ' + sel('≈ estimativa', 'sol') + '</h3>' + row('título com harness (inclui harnessing)', 498, 500, 'cz', 1.2) + row('harness ou harnesses', 446, 500, 'aco', 1.5) + row('sentido de agente, estimado', 446, 500, '', 1.8, '≈') + '</div>' +
      '<p class="nota" style="font-size:26px">Só a forma singular “harness” dá 362 em 2026 (reprodução do avaliador). Em 2023 e 2024 não há ocorrência. 2026 é parcial.</p></div></div>' +
      foot([F('arxiv-count', 'Contagem do autor (arXiv)')], 'Consulta ti:harness AND abs:agent em 25/10/2026. O número de 2026 (≈446) supõe que a amostra de 25 títulos represente o conjunto.')
    );
  })();

  P['s9-cmu'] = body(
    T('Modelo pequeno com bom harness', 'Yang, Zhao, Wu e Kästner (2026), arXiv 2607.08938 ' ) +
    '<div class="cols" style="grid-template-columns:900px 1fr;gap:44px;align-items:center">' +
    svg(900, 480,
      '<line class="ln" x1="0" y1="400" x2="900" y2="400"/>' +
      '<line class="grid" x1="0" y1="40" x2="900" y2="40"/><text class="m" x="900" y="28" text-anchor="end" style="font-size:26px">linha: 100% do modelo grande</text>' +
      [['Desempenho', 0, 100, 89.7], ['Custo', 450, 100, 4]].map(function (g, gi) {
        var h1 = 360, h2 = 360 * g[3] / 100;
        return '<g><rect class="gy fl cz" style="--d:' + (0.3 + gi * .9) + 's" x="' + (g[1] + 40) + '" y="40" width="150" height="' + h1 + '"/>' +
          '<rect class="gy fl ' + (gi === 0 ? '' : 'luz') + '" style="--d:' + (0.8 + gi * .9) + 's" x="' + (g[1] + 230) + '" y="' + (400 - h2) + '" width="150" height="' + h2 + '"/>' +
          '<text class="b" x="' + (g[1] + 305) + '" y="' + (400 - h2 - 14) + '" text-anchor="middle" style="font-size:40px">' + String(g[3]).replace('.', ',') + '%</text>' +
          '<text x="' + (g[1] + 215) + '" y="448" text-anchor="middle" style="font-size:28px">' + g[0] + '</text>' +
          '<text class="m" x="' + (g[1] + 115) + '" y="80" text-anchor="middle" style="font-size:26px;display:none"></text></g>';
      }).join(''),
      'Barras: desempenho de 89,7% e custo de 4% do modelo grande') +
    '<div style="display:grid;gap:16px">' +
    '<p><span class="sw" style="background:#6A7690;border-color:#6A7690"></span>modelo grande = 100%</p>' +
    '<p><span class="sw az"></span>modelo pequeno com harness adaptado: <b>89,7%</b> do desempenho a <b>4%</b> do custo</p>' +
    '<p class="nota" style="font-size:27px">Título: “Better Harnesses, Smaller Models: Building 90% Cheaper Agents via Automated Harness Adaptation”.</p>' +
    '<p>' + sel('preprint, arXiv') + '</p></div></div>' +
    foot([F('cmu', 'Yang et al. (2026)')], 'Frase do resumo: “recovering 89.7% of LLM performance at 4% of the cost”. Resultado do trabalho citado, não replicado aqui.')
  );

  P['s9-contexto'] = body(
    T('Contexto de reserva: do investimento ao harness ' + sel('contexto, reserva', 'sol')) +
    '<div class="cols" style="grid-template-columns:1fr 1fr;gap:56px;align-items:center">' +
    '<div style="display:grid;gap:14px"><h3>Capex de Microsoft, Alphabet, Amazon e Meta ' + sel('previsão, imprensa') + '</h3>' +
    '<div style="display:grid;gap:6px"><p>2025 · cerca de US$ 410 bi</p><div class="bar-trk" style="height:48px"><i class="bar" style="left:0;width:' + (410 / 800 * 100).toFixed(1) + '%;--d:.3s"></i></div></div>' +
    '<div style="display:grid;gap:6px"><p>2026 · cerca de US$ 725 bi (previsão)</p><div class="bar-trk" style="height:48px"><i class="bar aco" style="left:0;width:' + (725 / 800 * 100).toFixed(1) + '%;--d:.9s;background:repeating-linear-gradient(135deg,#6F8FC7 0 14px,#1E3A66 14px 28px)"></i></div></div>' +
    '<p class="nota" style="font-size:26px">Faixa citada para 2026: US$ 695 a 750 bi; é orientação das empresas, não valor realizado.</p></div>' +
    '<div style="display:grid;grid-template-columns:230px 1fr;gap:26px;align-items:center"><div style="width:230px">' + svg(420, 420,
      '<circle cx="210" cy="210" r="170" fill="none" stroke="#132548" stroke-width="44"/>' +
      '<circle class="ring" pathLength="100" cx="210" cy="210" r="170" fill="none" stroke="#7BA3EE" stroke-width="44" stroke-dasharray="95 100" transform="rotate(-90 210 210)"/>' +
      '<text class="b" x="210" y="236" text-anchor="middle" style="font-size:100px">95%</text>', 'Anel com 95% preenchido') + '</div>' +
    '<div style="display:grid;gap:8px"><h3>Sem retorno mensurável ' + sel('preliminar') + '</h3><p style="font-size:28px">das organizações (MIT NANDA, 2025)</p><p class="nota" style="font-size:26px">Mais de 300 iniciativas, 52 entrevistas e 153 líderes.</p></div></div></div>' +
    '<h3>Da engenharia de contexto (2025) à engenharia de harness (2026)</h3>' +
    svg(1660, 200,
      '<line class="ln az dr" pathLength="1" style="--d:.2s" x1="60" y1="96" x2="1620" y2="96"/>' +
      [['60', 'a', 'Engenharia de contexto', 'Anthropic, 29/09/2025', 'anthropic-context2025'],
       ['615', 'a', 'Engenharia de harness', 'OpenAI, fev/2026', 'openai2026'],
       ['618', 'b', 'Galster et al.', '2.853 repositórios, 16/02/2026', 'galster2026'],
       ['798', 'b', 'Böckeler', 'controles computacionais e inferenciais, 02/04/2026', 'bockeler2026'],
       ['1620', 'a', '446 artigos com “harness”', 'no título (arXiv, até 25/10/2026)', 'arxiv-count']].map(function (m, i) {
        var x = +m[0], up = m[1] === 'a', end = x > 1500, endB = x === 618;
        var anc = end || endB ? 'end' : 'start', tx = end || endB ? x : x - 4 + (x === 60 ? 0 : 0);
        var ty = up ? 34 : 146;
        return '<g class="fd" style="--d:' + (0.5 + i * .45) + 's"><line class="ln" x1="' + x + '" y1="' + (up ? 46 : 100) + '" x2="' + x + '" y2="' + (up ? 96 : 128) + '"/>' +
          '<circle class="fl' + (i === 0 ? '' : ' luz') + '" cx="' + x + '" cy="96" r="11"/>' +
          '<text class="b" x="' + tx + '" y="' + ty + '" text-anchor="' + anc + '" style="font-size:26px">' + m[2] + '</text>' +
          '<text class="m" x="' + tx + '" y="' + (ty + 30) + '" text-anchor="' + anc + '" style="font-size:26px">' + m[3] + '</text></g>';
      }).join(''),
      'Linha do tempo de setembro de 2025 a outubro de 2026') +
    foot([F('anthropic-context2025', 'Engenharia de contexto (2025)'), F('openai2026', 'OpenAI (2026)'), F('galster2026', 'Galster et al. (2026)'), F('bockeler2026', 'Böckeler (2026)'), F('arxiv-count', 'Contagem arXiv'), F('capex', 'Capex (CNBC)'), F('mit', 'MIT NANDA')],
      'Capex é previsão de imprensa; o MIT é preliminar; a contagem é do autor. A página da OpenAI respondeu 403 na conferência, por isso o selo.')
  );


  /* =========================================================
     SLIDE 10
     ========================================================= */
  P['s10-aneis'] = body(
    T('Harness, grafo de conhecimento e laço: o HNV na interseção') +
    '<div class="cols" style="grid-template-columns:640px 1fr;gap:36px;align-items:start">' +
    '<div>' + svg(640, 620,
      '<g class="fd" style="--d:.2s"><circle cx="210" cy="210" r="200" fill="#1E3A66" fill-opacity=".42" stroke="#6F8FC7" stroke-width="3" stroke-dasharray="10 8"/></g>' +
      '<g class="fd" style="--d:.6s"><circle cx="430" cy="210" r="200" fill="#7BA3EE" fill-opacity=".2" stroke="#7BA3EE" stroke-width="3"/></g>' +
      '<g class="fd" style="--d:1s"><circle cx="320" cy="400" r="200" fill="#E6EEFB" fill-opacity=".1" stroke="#E6EEFB" stroke-width="3"/></g>' +
      '<g class="fd" style="--d:1.2s"><text class="b" x="115" y="130" text-anchor="middle" style="font-size:28px">Harness</text>' +
      '<text x="115" y="165" text-anchor="middle">hooks</text><text x="115" y="195" text-anchor="middle">skills</text><text x="115" y="225" text-anchor="middle">permissões</text><text x="115" y="255" text-anchor="middle">memória</text></g>' +
      '<g class="fd" style="--d:1.5s"><text class="b" x="525" y="130" text-anchor="middle" style="font-size:28px">Grafo de</text><text class="b" x="525" y="160" text-anchor="middle" style="font-size:28px">conhecimento</text>' +
      '<text x="525" y="195" text-anchor="middle">ontologia</text><text x="525" y="225" text-anchor="middle">triplas</text><text x="525" y="255" text-anchor="middle">GraphRAG</text></g>' +
      '<g class="fd" style="--d:1.8s"><text class="b" x="320" y="462" text-anchor="middle" style="font-size:28px">Laço</text>' +
      '<text x="320" y="494" text-anchor="middle">gerar → verificar</text><text x="320" y="524" text-anchor="middle">→ corrigir</text><text class="m" x="320" y="556" text-anchor="middle">3 → 3 → 1 na demo</text></g>' +
      '<g class="pp" style="--d:2.4s"><circle class="fl luz" cx="320" cy="285" r="52"/><text class="b luz" x="320" y="297" text-anchor="middle" style="font-size:34px;fill:#0A1428">HNV</text></g>',
      'Diagrama de Venn: harness, grafo de conhecimento e laço, com o HNV na interseção') +
    '<p class="nota" style="font-size:26px"><b>Laço = ciclo agêntico.</b> Não é uma disciplina consagrada: é o mecanismo da demonstração. ' + sel('hipótese: o HNV não foi testado') + '</p></div>' +
    '<div>' + tbl(['1fr', '1fr', '1.2fr'], ['Peça do harness', 'Camada', 'Papel'], [
      ['Skill e instruções do projeto', 'guia <b>macio</b> (inferencial)', 'orienta o modelo: formato do parecer, citar só a ontologia'],
      ['Hook e verificador de citações', 'regra <b>dura</b> (computacional)', 'bloqueia citação fora da ontologia (exit 2)'],
      ['Ontologia de fontes', 'conhecimento <b>simbólico</b> do especialista', 'fontes reais conferidas nas páginas oficiais'],
      ['Registros PROV', '<b>rastreabilidade</b>', 'quem gerou, o que foi usado, de que fontes deriva'],
      ['Aprovação (aprovar.py)', '<b>liberação</b>', 'só o especialista libera; a máquina declara, no máximo, “admissível”']
    ]) + '<p class="nota" style="margin-top:14px;font-size:26px">Böckeler (2026) separa controles <b>computacionais</b> (rápidos, como testes e linters) e <b>inferenciais</b> (revisão por modelo), e cada um pode ser guia (antes) ou sensor (depois). Aqui, a skill é guia inferencial e o hook é sensor computacional.</p></div></div>' +
    foot([F('hnv-readme', 'README da demonstração'), F('bockeler2026', 'Böckeler (2026)'), F('galster2026', 'Galster et al. (2026)'), F('edge2024', 'Edge et al. (2024)'), F('hnv-laco', 'Laço local')],
      'Mapa do README (25/10/2026). GraphRAG: um modelo extrai um grafo de entidades dos documentos (Edge et al., 2024). Laço local: citações bloqueadas 3, 3 e 1.')
  );


  P['s10-nucleo'] = body(
    T('O núcleo: uma camada simbólica sobre o modelo', 'O especialista escreve as regras e a ontologia do domínio.') +
    '<div class="cols" style="grid-template-columns:420px 90px 1fr;gap:22px;align-items:center">' +
    '<div class="card" style="text-align:center;border-style:dashed;padding:34px 20px"><h3 style="font-size:38px">Modelo neural</h3><p class="mut">interpreta linguagem natural e escreve o rascunho</p></div>' +
    svg(90, 40, '<path class="ln az dr" pathLength="1" d="M0 20 H70"/><path class="fl" d="M64 8 l22 12 l-22 12z"/>', '') +
    '<div class="card" style="border-color:var(--az);display:grid;gap:12px"><h3 style="font-size:38px">Camada simbólica vertical</h3>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap"><span class="chip ok">ontologia do domínio</span><span class="chip ok">regras (hooks)</span><span class="chip ok">rastro PROV</span><span class="chip luz">portão humano</span></div>' +
    '<p class="mut" style="font-size:27px">“Vertical” significa específica de um domínio, como o Direito Administrativo na demonstração.</p></div></div>' +
    tbl(['300px', '1fr', '1fr'], ['Componente', 'Na demonstração', 'O que ainda falta'], [
      ['Guia macio', 'skill e instruções do projeto', '—'],
      ['Regra dura', 'hook e verificador por padrões de texto', 'referências vagas escapam; não é um analisador jurídico completo'],
      ['Ontologia do domínio', '18 fontes conferidas nas páginas oficiais', 'validação pelo especialista (hoje, “pendente”)'],
      ['Rastro e portão', 'registro PROV e aprovar.py', '—']
    ]) +
    '<p>' + sel('hipótese') + '</p>' +
    foot([F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-readme', 'README: limitações')], 'Limitações conforme o README da demonstração. O HNV é uma hipótese ainda não testada.')
  );

  P['s10-portao'] = body(
    T('Domínios candidatos', 'Propostas: onde um especialista poderia escrever a ontologia e a regra, com a pessoa certa no portão final.') +
    '<div class="cols c2" style="gap:24px">' +
    [
      ['Pareceres administrativos', 'executado', 'Demonstração de 25/10/2026; ontologia de 18 fontes, pendente de validação.', 'quem libera: o especialista que aprova'],
      ['Escrita científica', 'sistema existente', 'Citāre: ontologia operacional descrita na Atividade v05; o artigo teve as citações conferidas nele, com revisão humana.', 'quem libera: o autor, que assume a responsabilidade'],
      ['Boletins de ocorrência de bombeiros', 'proposta', 'Ideia surgida na aula de ontologias; não implementada.', 'quem libera: a definir'],
      ['Finanças reguladas (antifraude)', 'hipótese do artigo', 'Registrar sinais, fontes, regras, exceções e revisão humana antes das decisões; exige adaptação regulatória e validação empírica.', 'quem libera: revisão humana']
    ].map(function (d, i) {
      return '<div class="card ri" style="--d:' + (0.2 + i * .2) + 's;display:grid;gap:8px;align-content:start"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><h3>' + d[0] + '</h3>' + sel(d[1], d[1] === 'executado' || d[1] === 'sistema existente' ? '' : 'sol') + '</div>' +
        '<p style="font-size:27px">' + d[2] + '</p><p class="mut" style="font-size:26px">' + d[3] + '</p></div>';
    }).join('') + '</div>' +
    '<p>' + sel('todos os domínios são propostas', 'sol') + '</p>' +
    foot([F('hnv-ontologia', 'Ontologia (18 fontes)'), F('art-citare', 'Artigo: uso do Citāre'), F('art-escopo', 'Artigo: transferência (Seção 4.2)')], 'Boletins de ocorrência: proposta da aula de ontologias, sem fonte publicada. Finanças: hipótese citada no artigo.')
  );

  /* =========================================================
     SLIDE 11
     ========================================================= */
  (function () {
    var cond = ['Manual', 'LLM puro', 'RAG', 'Arquitetura completa'];
    var met = ['Fidelidade de citação', 'Conformidade', 'Qualidade da decisão', 'Tempo', 'Custo', 'Retrabalho', 'Intervenções humanas'];
    var rows = cond.map(function (c, ci) {
      var r = ['<b>' + c + '</b>'];
      met.forEach(function (m, mi) { r.push('<span class="pl az" style="display:inline-block;animation-delay:' + ((ci * 7 + mi) * .08).toFixed(2) + 's">○</span>'); });
      return ci === 3 ? { cls: 'dest', c: r } : r;
    });
    P['s11-desenho'] = body(
      T('O estudo pareado: quatro condições, sete medidas', 'Desenho previsto nos trabalhos futuros do artigo. Nada disso foi medido ainda.') +
      tbl(['260px', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['Condição'].concat(met), rows, 'mt') +
      '<div class="cols c2" style="gap:36px"><ul class="pt-list" style="gap:8px"><li style="font-size:28px">tarefas equivalentes nas quatro condições</li><li style="font-size:28px">critérios definidos antes da coleta</li></ul>' +
      '<ul class="pt-list" style="gap:8px"><li style="font-size:28px">participantes com códigos distintos</li><li style="font-size:28px">comparação entre condição manual e assistida</li></ul></div>' +
      '<p>' + sel('planejado, não medido') + '</p>' +
      foot([F('art-escopo', 'Artigo: Seções 3.2, 4.2 e 5')], 'Condições e medidas conforme os trabalhos futuros do artigo (Seção 5). ○ = medida planejada.')
    );
  })();

  P['s11-limites'] = body(
    T('Cinco limites, ditos antes de a pergunta chegar') +
    '<div style="display:grid;gap:14px">' +
    [
      ['Situado em Santa Catarina', 'A validade externa se limita aos processos observados; a evidência é exploratória e descritiva.', 'art-escopo'],
      ['Seis registros são tarefas, não pessoas', 'Cinco vêm da mesma conta; não há comparação manual. Os dados do CBMSC e da ESAG não avaliam o Citāre.', 'art-nasa'],
      ['Confere citações, não raciocínio', 'Bloqueado não é falso: a Resolução 7/2005 existe, mas está fora da ontologia.', 'hnv-laco'],
      ['Ontologia da demonstração pendente', 'As 18 fontes ainda aguardam a validação do especialista (selo: pendente de validação).', 'hnv-ontologia'],
      ['O HNV é uma hipótese', 'O harness neurossimbólico vertical ainda não foi testado; o próximo passo é o estudo pareado.', 'art-escopo']
    ].map(function (l, i) {
      return '<div class="card ri" style="--d:' + (0.2 + i * .35) + 's;display:grid;grid-template-columns:70px 1fr auto;gap:22px;align-items:center;padding:14px 24px">' +
        svg(70, 70, '<rect x="10" y="32" width="50" height="34" fill="#1A2236" stroke="#6A7690" stroke-width="3"/><path class="gy" style="--d:' + (0.4 + i * .35) + 's;animation-name:pb-shackle" d="M20 32 V22 a15 15 0 0 1 30 0 V32" fill="none" stroke="#C2CBDD" stroke-width="5"/>', 'cadeado fechado') +
        '<div><h3>' + l[0] + '</h3><p class="mut" style="font-size:27px">' + l[1] + '</p></div>' + F(l[2], 'fonte') + '</div>';
    }).join('') + '</div>' +
    '<p>' + sel('pendente de validação') + ' ' + sel('hipótese', 'sol') + '</p>' +
    foot([F('art-escopo', 'Artigo: escopo'), F('hnv-ontologia', 'Ontologia (18 fontes)')], 'Limites conforme o artigo (Seções 3.2, 4.2 e 5) e o README da demonstração.')
  );


  /* =========================================================
     RESERVA R1: perguntas prováveis e respostas prontas
     ========================================================= */
  P['r1-respostas'] = body(
    T('Perguntas prováveis e respostas prontas ' + sel('reserva', 'sol')) +
    '<div style="column-count:2;column-gap:22px">' +
    [
      ['Quem corrigiu o parecer foi o modelo pequeno?', 'Não. O 3B errou; um modelo de fronteira (Sonnet, via Claude Code), no mesmo harness, corrigiu (cena induzida). O 3B sozinho: 3, 3 e 1 bloqueadas; não liberado. A garantia vem da arquitetura.', [['hnv-cena2b', 'Cena 2b'], ['hnv-laco', 'Laço local']]],
      ['Seu artigo não fala em harness. O que você apresenta?', 'O artigo propõe o CALAIS: evidência, norma, rastro e humano antes da liberação. Em 2026, a engenharia de agentes chama esse conjunto de harness. O HNV é hipótese, não testada.', [['art-arq', 'Artigo: arquitetura'], ['bockeler2026', 'Böckeler (2026)']]],
      ['Isso não é só RAG?', 'RAG recupera, mas não confere. Aqui um hook confere cada citação na ontologia e devolve o parecer. Em preprints, RAG jurídico erra 17–33%. ' + sel('preprint'), [['magesh', 'Magesh et al. (2025)'], ['hnv-cena2b', 'Cena 2b']]],
      ['Bloquear o que está fora da ontologia não engessa?', 'Gera falso positivo, e isso é declarado: bloqueado não é falso (a Resolução 7/2005 existe, fora da ontologia). O custo é manter a ontologia com o especialista. ' + sel('pendente de validação'), [['hnv-laco', 'Laço local'], ['hnv-ontologia', 'Ontologia (18 fontes)']]],
      ['Seis registros NASA-TLX provam alguma coisa?', 'Não provam ganho: são tarefas, não pessoas, e cinco vêm da mesma conta. Mostram os componentes juntos; para medir ganho, o estudo pareado.', [['art-nasa', 'Artigo: Tabela 5'], ['art-escopo', 'Artigo: escopo']]]
    ].map(function (q, i) {
      return '<div class="card ri" style="--d:' + (0.15 + i * .15) + 's;display:grid;gap:8px;break-inside:avoid;margin-bottom:22px"><h3 style="font-size:28px">' + (i + 1) + '. ' + q[0] + '</h3>' +
        '<p style="font-size:26px;line-height:1.28">' + q[1] + '</p><div class="fontes">' + q[2].map(function (f) { return F(f[0], f[1]); }).join('') + '</div></div>';
    }).join('') +
    '</div>' +
    '<p class="cred" style="font-size:18px;color:var(--mut)">Respostas preparadas a partir da avaliação independente do deck (27/10/2026). Reserva: não abrir na fala principal.</p>'
  );

  /* =========================================================
     Referências (geradas)
     ========================================================= */
  var ART_REFS = [
 "Bollotti, J. J., & Wachowicz, M. (2024). A aplicação da inteligência artificial pela administração pública diante do princípio da eficiência. Revista da AGU, 23(4), 101–126. https://doi.org/10.25109/2525-328X.v.23.n.4.2024.3429",
 "Brasil. (1988). Constituição da República Federativa do Brasil de 1988. https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
 "Busuioc, M. (2021). Accountable artificial intelligence: Holding algorithms to account. Public Administration Review, 81(5), 825–836. https://doi.org/10.1111/puar.13293",
 "De Fine Licht, K., & De Fine Licht, J. (2020). Artificial intelligence, transparency, and public decision-making: Why explanations are key when trying to produce perceived legitimacy. AI & Society, 35(4), 917–926. https://doi.org/10.1007/s00146-020-00960-w",
 "Garcez, A. D., & Lamb, L. C. (2023). Neurosymbolic AI: The 3rd wave. Artificial Intelligence Review, 56(11), 12387–12406. https://doi.org/10.1007/s10462-023-10448-w",
 "Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. In P. A. Hancock & N. Meshkati (Eds.), Human mental workload (pp. 139–183). North-Holland. https://doi.org/10.1016/S0166-4115(08)62386-9",
 "Huang, L., Yu, W., Ma, W., Zhong, W., Feng, Z., Wang, H., Chen, Q., Peng, W., Feng, X., Qin, B., & Liu, T. (2025). A survey on hallucination in large language models: Principles, taxonomy, challenges, and open questions. ACM Transactions on Information Systems, 43(2), 1–55. https://doi.org/10.1145/3703155",
 "Kroll, J. A., Huey, J., Barocas, S., Felten, E. W., Reidenberg, J. R., Robinson, D. G., & Yu, H. (2017). Accountable algorithms. University of Pennsylvania Law Review, 165(3), 633–705. https://pennlawreview.com/2017/02/23/accountable-algorithms/",
 "Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems, 33, 9459–9474. https://proceedings.neurips.cc/paper/2020/hash/6b493230-Abstract.html",
 "Moreau, L., & Missier, P. (Eds.). (2013). PROV-DM: The PROV data model. World Wide Web Consortium. https://www.w3.org/TR/prov-dm/",
 "Pádua, S. R., & Lorenzetto, B. M. (2024). O direito fundamental à explicabilidade da inteligência artificial utilizada em decisões estatais. Revista da AGU, 23(2). https://doi.org/10.25109/2525-328X.v.23.n.02.2024.3480",
 "Peffers, K., Tuunanen, T., Rothenberger, M. A., & Chatterjee, S. (2007). A design science research methodology for information systems research. Journal of Management Information Systems, 24(3), 45–77. https://doi.org/10.2753/MIS0742-1222240302",
 "Rudin, C. (2019). Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead. Nature Machine Intelligence, 1, 206–215. https://doi.org/10.1038/s42256-019-0048-x",
 "Tabassi, E. (2023). Artificial intelligence risk management framework (AI RMF 1.0) (NIST AI 100-1). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.AI.100-1",
 "Zen, H., Wagh, R., Wanderley, M., Bicalho, G., Park, R., Sun, M., Palacios, R., Carvalho, L., Rinaldo, G., & Gupta, A. (2025). Ensemble-based biometric verification: Defending against multi-strategy deepfake image generation. Computers, 14(6), Article 225. https://doi.org/10.3390/computers14060225"
];
  function refsHtml() {
    var fs = window.HNV_FONTES || {};
    var ks = Object.keys(fs);
    var deck = ks.map(function (k) {
      var f = fs[k], st = String(f.status || '');
      var plain = /^confirmado( no artigo| nos logs)?$/.test(st);
      return '<p><button class="fonte" data-src="' + k + '" style="font-size:22px;padding:6px 14px 7px">' + k + '</button> <span class="mut">' + f.fonte + '.</span>' + (plain ? '' : ' ' + sel(st.split(':')[0], 'sol')) + '</p>';
    }).join('');
    var art = ART_REFS.map(function (r) {
      return '<p>' + r.replace(/(https?:\/\/\S+)/g, function (u) { var c = u.replace(/[.,;]$/, ''); return '<a href="' + c + '" target="_blank" rel="noopener noreferrer">' + c + '</a>'; }) + '</p>';
    }).join('');
    return body(T('Referências', 'Fontes das afirmações do deck e referências do artigo #160.') +
      '<div class="refs"><h3>Fontes das afirmações do deck (clique para abrir a gaveta)</h3>' + (deck || '<p>Carregue fontes.js antes de paineis.js.</p>') +
      '<h3 style="margin-top:22px">Referências do artigo</h3>' + art + '</div>');
  }
  Object.defineProperty(P, 'r3-referencias', { enumerable: true, configurable: true, get: refsHtml });

  window.HNV_PANELS = P;
})();
