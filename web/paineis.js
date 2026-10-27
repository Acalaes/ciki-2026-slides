/* Camada 2 do deck (v3, design clean): cada painel = 1 diagrama do kit (kit.js) + título curto + legenda de até 2 linhas + chip da fonte.
   Parágrafos, tabelas e listas ficam na camada 3: window.HNV_DETALHES[id].
   Contrato: window.HNV_PANELS = { id: "<html>" }. Fontes clicáveis: <button class="fonte" data-src="chave"> (fontes.json / fontes.js). */
(function () {
  'use strict';
  var K = window.HNV_KIT;
  var P = {}, D = {};
  /* ---------- títulos (TITULOS_v3f): mensagem do diagrama, até 6 palavras, sem sigla, fórmula ou símbolo ---------- */
  var TITULOS = {
    's1-ficha': 'Sobre o artigo', 's1-paleta': 'As quatro condições', 's1-harness3d': 'Como ler o arnês da capa',
    's2-casos': 'A IA alucina em tribunais', 's2-softmax': 'Por que o modelo alucina', 's2-citacoes': 'O que o modelo citou errado',
    's3-tab1': 'Cada método tem um limite', 's3-rudin': 'Explicar depois não basta',
    's4-pinoE': 'Como se recupera a evidência', 's4-pinoN': 'Como as normas viram regras', 's4-pinoT': 'Como o rastro é registrado',
    's4-pinoH': 'Quem libera é a pessoa', 's4-formula': 'Como o sistema decide', 's4-regras': 'As regras em forma de código',
    's5-fig1': 'A IA propõe, as regras conferem', 's5-calais': 'Três níveis da contribuição', 's5-dsr': 'Os seis ciclos da pesquisa',
    's5-ponte': 'Como o texto vira regra', 's6-ontologia': 'Como o Citāre organiza conceitos', 's6-regras': 'Quando a fonte está pronta',
    's6-triplas': 'Como a ontologia liga os fatos', 's7-logs': 'Quantos envios a automação fez', 's7-nasa': 'Esforço percebido nas tarefas',
    's7-tab4': 'O que cada caso mostra', 's8-replay': 'A execução real, passo a passo', 's8-regua': 'Onde o modelo errou na lei',
    's8-portao': 'Como o hook barra a citação', 's8-prov': 'O que o parecer registrou', 's9-metodo': 'Como contamos os artigos',
    's9-cmu': 'Modelo pequeno com bom harness', 's9-contexto': 'Como o termo harness surgiu', 's10-aneis': 'Três ideias combinadas',
    's10-nucleo': 'Regras do especialista sobre o modelo', 's10-portao': 'Onde isso poderia valer', 's11-desenho': 'Como vamos medir o ganho',
    's11-limites': 'O que ainda não sabemos', 'r1-respostas': 'Perguntas difíceis e respostas', 'r3-referencias': 'Referências'
  };

  /* ---------- auxiliares ---------- */
  function F(k, l) { return '<button class="fonte" data-src="' + k + '">' + l + '</button>'; }
  function sel(t, c) { return '<span class="selo ' + (c || '') + '">' + t + '</span>'; }
  function foot(fs, cred) {
    return '<footer class="pf"><div class="fontes">' + fs.join('') + '</div>' + (cred ? '<p class="cred">' + cred + '</p>' : '') + '</footer>';
  }
  function panel(id, title, diagram, legenda, fs, o) {
    o = o || {};
    title = TITULOS[id] || title;
    P[id] = '<div class="panel-body">' +
      '<h2 class="pt">' + title + '</h2>' +
      diagram + (legenda ? '<p class="leg">' + legenda + '</p>' : '') + (o.extra || '') + foot((o.selos || []).concat(fs), o.cred) + '</div>';
  }
  function det(id, title, html, fs) {
    title = 'Detalhes: ' + (TITULOS[id] || title);
    D[id] = '<div class="panel-body det"><h2 class="pt">' + title + '</h2>' + html + (fs ? foot(fs) : '') + '</div>';
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
  function pct(x, d) { return (x * 100).toFixed(d == null ? 1 : d).replace('.', ','); }
  function fmt(x, d) { return Number(x).toFixed(d).replace('.', ','); }
  var W = 1660;

  /* =========================================================
     SLIDE 1
     ========================================================= */
  panel('s1-ficha', 'Ficha do artigo #160',
    K.svg(W, 470,
      K.box({ x: 0, y: 0, w: 640, h: 120, t: 'CALAIS', s: 'modelo de governança', step: 1, fill: true }) +
      K.arrow({ pts: [[320, 120], [320, 175]], step: 2 }) +
      K.box({ x: 0, y: 175, w: 640, h: 120, t: 'Arquitetura', s: 'neurossimbólica', step: 3 }) +
      K.arrow({ pts: [[320, 295], [320, 350]], step: 4 }) +
      K.box({ x: 0, y: 350, w: 640, h: 120, t: 'Citāre', s: 'sistema de referência', step: 5, tone: 'nevoa' }) +
      K.icon('doc', { x: 800, y: 20, s: 80, step: 6 }) +
      K.text({ x: 910, y: 62, t: '#160 · CIKI 2026', size: 44, weight: 'b' }) +
      K.text({ x: 910, y: 106, t: 'apresentação em 28/10/2026', size: 28, tone: 'nevoa' }) +
      K.icon('person', { x: 800, y: 175, s: 80, step: 7 }) +
      K.text({ x: 910, y: 217, t: 'Alexandre Pinto Calaes', size: 44, weight: 'b' }) +
      K.text({ x: 910, y: 261, t: 'PPGEGC / UFSC', size: 28, tone: 'nevoa' }) +
      K.icon('db', { x: 800, y: 340, s: 80, step: 8 }) +
      K.text({ x: 910, y: 382, t: 'CBMSC · ESAG/UDESC', size: 44, weight: 'b' }) +
      K.text({ x: 910, y: 424, t: 'Corpo de Bombeiros Militar de Santa Catarina', size: 26, tone: 'nevoa' }) +
      K.text({ x: 910, y: 456, t: 'Escola Superior de Administração e Gerência (UDESC)', size: 26, tone: 'nevoa' }),
      'Ficha do artigo: três níveis de contribuição, autor e casos'),
    'Modelo, arquitetura e sistema de referência; evidência exploratória de dois casos.',
    [F('art-dsr', 'Artigo: método DSR'), F('art-escopo', 'Artigo: escopo')], { cred: 'Título e dados do artigo #160 (versão final).' });
  det('s1-ficha', 'Ficha do artigo: detalhes',
    '<dl class="ficha"><dt>Título (EN)</dt><dd><em>Neurosymbolic Artificial Intelligence and Knowledge Engineering: Beyond Hallucinations and Auditable Decisions in the Intelligent State</em></dd>' +
    '<dt>Artigo</dt><dd>#160 · CIKI 2026 · apresentação em 28/10/2026</dd><dt>Autor</dt><dd>Alexandre Pinto Calaes · PPGEGC/UFSC</dd>' +
    '<dt>Método</dt><dd>Design Science Research (DSR), em seis ciclos rastreáveis</dd>' +
    '<dt>Evidência</dt><dd>Aplicações prévias no Corpo de Bombeiros Militar de Santa Catarina (CBMSC) e na Escola Superior de Administração e Gerência (ESAG/UDESC): exploratória, em Santa Catarina</dd><dt>Apoio</dt><dd>CAPES, Finance Code 001</dd></dl>',
    [F('art-dsr', 'Artigo: método DSR'), F('art-escopo', 'Artigo: escopo')]);

  /* s1-paleta: quatro pinos + legenda de cores */
  (function () {
    var it = [['evidencia', 'Evidência', 'E = evidência'], ['normas', 'Normas', 'N = norma'], ['rastro', 'Rastro', 'T = rastro'], ['humano', 'Humano', 'H = humano']];
    var g = '';
    it.forEach(function (x, i) {
      var h = i === 3;
      g += K.box({ x: i * 420, y: 0, w: 380, h: 330, t: '', step: i + 1, fill: true, tone: h ? 'gelo' : 'gelo' });
      g += K.pic(x[0], { x: i * 420 + 142, y: 50, s: 96, pos: 'none', step: i + 1, tone: h ? null : null });
      g += K.text({ x: i * 420 + 190, y: 220, t: x[1], size: 36, anchor: 'middle', weight: 'b' });
      g += K.text({ x: i * 420 + 190, y: 276, t: x[2], size: 28, anchor: 'middle', tone: 'nevoa' });
    });
    g += K.dot({ cx: 20, cy: 400, r: 14, hollow: true, tone: 'nevoa', t: 'verificado e registrado', step: 5 }) +
      K.dot({ cx: 660, cy: 400, r: 14, tone: 'block', t: 'o sistema para', step: 6 }) +
      K.dot({ cx: 1040, cy: 400, r: 14, t: 'decisão humana', step: 7 });
    panel('s1-paleta', 'Quatro condições', K.svg(W, 440, g, 'Quatro condições: evidência, normas, rastro e humano, e a legenda de cores'),
      'Falta uma condição e a fechadura não abre; só a pessoa libera.', [F('art-eq', 'Artigo: Equações 2 e 3')]);
  })();
  det('s1-paleta', 'As quatro condições: detalhes',
    tbl(['120px', '1fr', '240px'], ['Pino', 'O que garante', 'Símbolo'], [
      ['E', 'Documentos recuperados e ligados à resposta', 'E(y, R)'], ['N', 'Regras aplicáveis conferem; o sistema pode bloquear', 'N(y, Ω)'],
      ['T', 'Fontes, verificações e decisões registradas', 'T(y)'], ['H', 'Quem decide manter, modificar ou rejeitar', 'H(y)']]),
    [F('art-eq', 'Artigo: Equações 2 e 3')]);

  /* s1-harness3d */
  panel('s1-harness3d', 'Legenda do harness 3D',
    K.svg(W, 560,
      K.ring({ cx: 330, cy: 280, r: 250, dash: true, tone: 'nevoa', step: 1 }) +
      K.ring({ cx: 330, cy: 280, r: 190, step: 2 }) +
      K.node({ cx: 330, cy: 280, r: 76, t: ['modelo', 'neural'], size: 26, step: 3, fill: true }) +
      K.pic('evidencia', { x: 282, y: -10, s: 96, pos: 'none', step: 4 }) + K.pic('normas', { x: 532, y: 232, s: 96, pos: 'none', step: 5 }) +
      K.pic('rastro', { x: 282, y: 474, s: 96, pos: 'none', step: 6 }) + K.pic('humano', { x: 32, y: 232, s: 96, pos: 'none', step: 7 }) +
      K.text({ x: 392, y: 54, t: 'Evidência', size: 28 }) + K.text({ x: 580, y: 360, t: 'Normas', size: 28, anchor: 'middle' }) + K.text({ x: 392, y: 530, t: 'Rastro', size: 28 }) + K.text({ x: 80, y: 360, t: 'Humano', size: 28, anchor: 'middle' }) +
      K.dot({ cx: 900, cy: 90, r: 12, hollow: true, tone: 'nevoa', t: 'núcleo: modelo neural', step: 8 }) +
      K.dot({ cx: 900, cy: 170, r: 12, hollow: true, tone: 'nevoa', t: 'anel tracejado: skills (guia macio)', step: 9 }) +
      K.dot({ cx: 900, cy: 250, r: 12, hollow: true, t: 'anel contínuo: hooks (regra dura)', step: 10 }) +
      K.dot({ cx: 900, cy: 330, r: 12, hollow: true, t: 'âncoras: evidência, normas, rastro, humano', step: 11 }) +
      K.dot({ cx: 900, cy: 410, r: 12, t: 'fivela: aprovação humana', step: 12 }),
      'Esquema do harness: núcleo, anéis e âncoras'),
    'Metáfora visual da capa: o modelo propõe, o anel rígido confere, a pessoa fecha.',
    [F('hnv-readme', 'Mapa guia macio × regra dura'), F('art-eq', 'Artigo: Equações 2 e 3')], { selos: [sel('metáfora visual', 'sol')] });

  det('s1-harness3d', 'Harness 3D: detalhes',
    '<ul class="pt-list"><li>Núcleo luminoso: modelo neural; lê e escreve linguagem natural, propõe e não decide.</li><li>Faixas e anel tracejado: skills e instruções, o guia macio.</li><li>Anel contínuo: hooks, a regra dura executada pelo harness.</li><li>Quatro âncoras: evidência, normas, rastro e humano (E, N, T e H nas equações do artigo).</li><li>Fivela: aprovação humana; só a pessoa fecha e libera.</li></ul>',
    [F('hnv-readme', 'Mapa guia macio × regra dura'), F('art-eq', 'Artigo: Equações 2 e 3')]);

  /* =========================================================
     SLIDE 2
     ========================================================= */
  (function () {
    var tot = 2217, us = 1514, br = 41, rest = tot - us - br;
    var g = K.text({ x: 0, y: 110, t: '2.217', size: 120, weight: 'b' }) + K.text({ x: 400, y: 70, t: 'casos em tribunais', size: 32 }) + K.text({ x: 400, y: 108, t: '25/10/2026', size: 28, tone: 'nevoa' });
    g += K.bar({ x: 240, y: 150, w: 520, h: 44, v: us, max: tot, t: 'EUA', val: '1.514', step: 1 }) +
      K.bar({ x: 240, y: 224, w: 520, h: 44, v: br, max: tot, t: 'Brasil', val: '41', step: 2 }) +
      K.bar({ x: 240, y: 298, w: 520, h: 44, v: rest, max: tot, t: 'Demais', val: '662', step: 3, tone: 'nevoa' });
    g += K.text({ x: 1000, y: 100, t: 'erro em perguntas jurídicas', size: 32 }) +
      K.bar({ x: 1180, y: 150, w: 400, h: 44, v: 88, v0: 58, max: 100, t: 'LLM geral', val: '58–88%', step: 4 }) +
      K.bar({ x: 1180, y: 224, w: 400, h: 44, v: 33, v0: 17, max: 100, t: 'RAG jurídico', val: '17–33%', step: 5 }) +
      K.text({ x: 1180, y: 318, t: '0', size: 26, tone: 'nevoa' }) + K.text({ x: 1380, y: 318, t: '50%', size: 26, tone: 'nevoa', anchor: 'middle' }) + K.text({ x: 1580, y: 318, t: '100%', size: 26, tone: 'nevoa', anchor: 'end' });
    panel('s2-casos', '2.217 casos; erro em testes', K.svg(W, 380, g, 'Casos de alucinação em tribunais e taxas de erro em testes'),
      'Casos em tribunais (Brasil: 41) e taxas de erro de dois testes publicados como preprint.',
      [F('charlotin', 'Charlotin (2026)'), F('dahl', 'Dahl et al. (2024)'), F('magesh', 'Magesh et al. (2025)')], { selos: [sel('preprint')], cred: 'Demais = total − EUA − Brasil (cálculo do autor).' });
  })();
  det('s2-casos', 'Casos e taxas: detalhes',
    tbl(['1fr', '200px', '200px'], ['País', 'Casos', 'Parcela'], [['EUA', '1.514', '68,3%'], ['Brasil', '41', '1,8%'], ['Demais países (total − EUA − Brasil)', '662', '29,9%']]) +
    '<p class="nota">Cada faixa vai da menor à maior taxa entre os sistemas testados. Nas versões publicadas em periódicos, os limites divergem (69–88% e “mais de 17%”).</p>',
    [F('charlotin', 'Charlotin (2026)'), F('dahl', 'Dahl et al. (2024)'), F('magesh', 'Magesh et al. (2025)')]);

  (function () {
    var z = [['XXXIII', 3.0], ['XXI', 2.2], ['II', 1.6], ['V', 1.1], ['caput', 0.6]];
    var s = 0; z.forEach(function (a) { s += Math.exp(a[1]); });
    var pr = z.map(function (a) { return Math.exp(a[1]) / s; });
    var g = K.formula({ x: 0, y: 0, w: 900, h: 150, size: 70, t: 'softmax(z)_i = {e^{z_i}|Σ_{j=1}^{K} e^{z_j}}' });
    g += K.text({ x: 1000, y: 36, t: 'próxima palavra: qual inciso?', size: 30, tone: 'nevoa' });
    z.forEach(function (a, i) {
      g += K.bar({ x: 1180, y: 70 + i * 66, w: 330, h: 42, v: pr[i], max: 0.6, t: a[0], val: pct(pr[i]) + '%', step: 1 + i, tone: i === 0 ? 'err' : 'gelo' });
    });
    g += K.text({ x: 0, y: 300, t: 'plausível, mas sem fonte', size: 30, tone: 'err' });
    panel('s2-softmax', 'Por que o modelo alucina', K.svg(W, 420, g, 'Fórmula softmax e barras de probabilidade com uma barra vermelha'),
      'O modelo escolhe o provável, não o verdadeiro. Valores ilustrativos.',
      [F('huang2025', 'Huang et al. (2025)'), F('softmax', 'Definição da softmax')], { selos: [sel('ilustrativo', 'sol')] });
    det('s2-softmax', 'Softmax: detalhes',
      '<div class="eqrow">' + K.svg(1200, 110, K.formula({ x: 0, y: 0, w: 1200, h: 110, size: 54, t: 'P(y_t | y_{<t}, x) = softmax(W h_t)_{y_t}' }), 'Equação') + '</div>' +
      '<ul class="pt-list"><li>A rede dá uma nota z a cada palavra possível; a softmax transforma as notas em probabilidades que somam 100%.</li><li>O modelo escreve a mais provável ou sorteia entre as mais prováveis.</li><li>Nada na fórmula consulta se a fonte existe. Valores z hipotéticos; as probabilidades saem da fórmula.</li></ul>',
      [F('huang2025', 'Huang et al. (2025)'), F('softmax', 'Definição da softmax')]);
  })();

  panel('s2-citacoes', 'Checagem manual: três rodadas',
    K.svg(W, 470,
      [['Rodada 1', 0, [['art. 37, XXXIII', 'err']]],
       ['Rodada 2', 150, [['art. 37, XXXIII', 'err'], ['Decreto 4.653/2002', 'err'], ['STJ sem número', 'nevoa']]],
       ['Rodada 3', 300, [['art. 37, XXI', 'err'], ['Lei 8.112/1990', 'nevoa'], ['ADI 2.958', 'nevoa']]]].map(function (r, i) {
        var o = K.lane({ x: 0, y: r[1], w: W, h: 130, t: r[0], step: i * 4 + 1 });
        r[2].forEach(function (c, j) {
          o += K.box({ x: 260 + j * 460, y: r[1] + 22, w: 420, h: 86, t: c[0], step: i * 4 + 2 + j, tone: c[1], size: 30 });
        });
        return o;
      }).join('') + K.dot({ cx: 20, cy: 450, r: 12, tone: 'err', t: 'inexistente ou com conteúdo falso', step: 14 }) + K.dot({ cx: 700, cy: 450, r: 12, hollow: true, tone: 'nevoa', t: 'real, mas sem base ou não conferível', step: 15 }),
      'Três rodadas do modelo local 3B, sem harness'),
    'O modelo local de 3B, sem harness, errou em todas as rodadas.',
    [F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')]);
  det('s2-citacoes', 'Checagem manual: detalhes',
    tbl(['110px', '480px', '1fr'], ['Rodada', 'Citação do modelo', 'O que a fonte oficial mostra'], [
      ['1 e 2', 'art. 37, inciso XXXIII', 'O art. 37 vai só até o inciso XXII.'],
      ['2', 'Decreto nº 4.653/2002', 'É de 27/03/2003, estrutura do Ministério do Turismo; não trata de nepotismo.'],
      ['3', 'art. 37, inciso XXI, “proíbe o nepotismo”', 'O inciso XXI trata de licitação.'],
      ['3', 'Lei nº 8.112/1990', 'Regime dos servidores civis da União; não se aplica a todos os entes.'],
      ['3', 'ADI 2.958 do STF', 'O número existe; o assunto cadastrado é outro.'],
      ['2', 'Decisão do STJ, sem número', 'Sem número não há como conferir.']]),
    [F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')]);

  /* =========================================================
     SLIDE 3
     ========================================================= */
  (function () {
    var it = [['LLM puro', 'alucinação e opacidade'], ['XAI post-hoc', 'fidelidade da explicação'], ['Simbólico', 'rigidez e manutenção'], ['RAG', 'erro de citação'], ['Neurossimbólica', 'integração e validação'], ['Arquitetura proposta', 'sem base comum']];
    var g = '';
    it.forEach(function (x, i) {
      var last = i === 5;
      g += K.box({ x: i * 280, y: 0, w: 260, h: 130, t: x[0].split(' ').length > 1 && x[0].length > 12 ? x[0].split(' ') : x[0], size: 26, step: i + 1, fill: last ? 'solid' : true });
      g += K.arrow({ pts: [[i * 280 + 130, 130], [i * 280 + 130, 200]], step: i + 1, tone: 'nevoa' });
      g += K.box({ x: i * 280, y: 200, w: 260, h: 130, t: x[1].split(' '), size: 28, step: i + 1, tone: last ? 'gelo' : 'nevoa' });
    });
    g += K.text({ x: 0, y: 390, t: 'abordagem', size: 26, tone: 'nevoa' }) + K.text({ x: 0, y: 420, t: 'limitação principal', size: 26, tone: 'nevoa' });
    panel('s3-tab1', 'Cada abordagem tem um limite', K.svg(W, 440, g, 'Seis abordagens e a limitação principal de cada uma'),
      'A arquitetura proposta ainda tem evidência situada e sem linha de base comum.',
      [F('art-tab1', 'Artigo: Tabela 1'), F('rudin', 'Rudin (2019)')], { selos: [sel('síntese dos autores')] });
  })();
  det('s3-tab1', 'Tabela 1: detalhes',
    tbl(['170px', '1.2fr', '1.1fr', '1.1fr', '1fr', '1.2fr'], ['Abordagem', 'Fundamentação externa', 'Regras executáveis', 'Proveniência', 'Controle humano', 'Limitação principal'], [
      ['LLM puro', 'Não inerente', 'Não inerente', 'Baixa ou não garantida', 'Depende da implementação', 'Alucinação e opacidade'],
      ['XAI post-hoc', 'Não altera a fundamentação', 'Não assegura conformidade', 'Parcial', 'Apoia a interpretação', 'Fidelidade da explicação'],
      ['Sistema simbólico', 'Depende da base de conhecimento', 'Forte', 'Alta, se registrada', 'Configurável', 'Rigidez e manutenção'],
      ['RAG', 'Nativa na recuperação, não na fidelidade final', 'Não inerente', 'Possível, se as fontes forem preservadas', 'Depende da implementação', 'Erros de recuperação ou de citação'],
      ['IA neurossimbólica', 'Integrável', 'Potencialmente forte', 'Depende da arquitetura', 'Configurável', 'Complexidade de integração e validação'],
      { cls: 'dest', c: ['Arquitetura proposta', 'Documentos recuperados e vinculados', 'Regras explícitas verificam e podem bloquear', 'Fontes, verificações e decisões registradas', 'Aprovação nos fluxos relevantes', 'Evidência ainda situada e sem linha de base comum'] }]) +
    '<p>' + sel('síntese dos autores') + ' ' + sel('não é resultado experimental', 'sol') + '</p>',
    [F('art-tab1', 'Artigo: Tabela 1')]);

  panel('s3-rudin', 'Explicar depois não basta',
    K.svg(W, 400,
      K.lane({ x: 0, y: 0, w: W, h: 170, t: '', step: 1 }) + K.lane({ x: 0, y: 220, w: W, h: 170, t: '', step: 5 }) +
      K.box({ x: 60, y: 45, w: 380, h: 80, t: 'caixa-preta decide', step: 2, tone: 'nevoa', size: 28 }) + K.arrow({ pts: [[440, 85], [600, 85]], step: 3, tone: 'nevoa' }) +
      K.box({ x: 600, y: 45, w: 420, h: 80, t: 'explica depois', step: 4, tone: 'nevoa', size: 28 }) +
      K.box({ x: 60, y: 265, w: 560, h: 80, t: 'modelo interpretável desde o início', step: 6, fill: true, size: 28 }) + K.arrow({ pts: [[620, 305], [780, 305]], step: 7 }) +
      K.box({ x: 780, y: 265, w: 330, h: 80, t: 'decisão', step: 8, fill: 'solid', size: 28 }),
      'Duas linhas do tempo: caixa-preta explicada depois e modelo interpretável desde o início'),
    'Rudin (2019): em decisões de alto risco, usar modelos interpretáveis desde o início, em vez de explicar caixas-pretas depois.',
    [F('rudin', 'Rudin (2019)'), F('art-tab1', 'Artigo: Tabela 1')], { cred: 'O artigo cita Rudin para sustentar que a explicação posterior não basta; o remédio proposto aqui é verificar antes da liberação.' });
  det('s3-rudin', 'Rudin (2019): detalhes',
    '<p class="quote">“Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead.”</p><p class="nota">Rudin, C. (2019). Nature Machine Intelligence, 1, 206–215.</p>' +
    '<ul class="pt-list"><li>Rudin defende usar modelos interpretáveis desde o início em decisões de alto risco, em vez de explicar caixas-pretas depois.</li><li>O artigo #160 cita o trabalho para sustentar que explicações a posteriori podem não representar a lógica real da caixa-preta e não substituem evidência nem responsabilização.</li><li>Diferença: Rudin propõe modelos interpretáveis; o artigo propõe verificar antes da liberação, com regras, rastro e decisão humana.</li></ul>',
    [F('rudin', 'Rudin (2019)')]);

  /* =========================================================
     SLIDE 4
     ========================================================= */
  (function () {
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var pts = [];
    for (var i = 0; i < 40; i++) pts.push({ x: 40 + rnd() * 520, y: 60 + rnd() * 300, s: rnd() });
    var order = pts.map(function (p, i) { return i; }).sort(function (a, b) { return pts[b].s - pts[a].s; });
    var top = order.slice(0, 5);
    var g = K.formula({ x: 0, y: 0, w: 1000, h: 110, size: 76, t: 'R_k(q) = TopK_{d∈D} s(q,d)' });
    g += K.box({ x: 0, y: 150, w: 600, h: 400, t: '', step: 1, tone: 'nevoa' }) + K.text({ x: 20, y: 530, t: 'coleção D', size: 28, tone: 'nevoa' }) + K.text({ x: 1000, y: 70, t: 'q = consulta · D = coleção · s = relevância', size: 26, tone: 'nevoa' });
    var dots = '';
    pts.forEach(function (p, i) {
      var t = top.indexOf(i) >= 0;
      dots += K.dot({ cx: p.x, cy: 150 + p.y - 40, r: 5 + p.s * 8, tone: t ? 'gelo' : 'nevoa', step: 2 + (t ? 3 : 0) });
    });
    g += dots;
    g += K.arrow({ pts: [[600, 350], [700, 350]], step: 3 }) + K.box({ x: 700, y: 300, w: 220, h: 100, t: 's(q, d)', s: 'relevância', step: 3, fill: true });
    g += K.arrow({ pts: [[920, 350], [1040, 350]], step: 4 });
    for (var k = 0; k < 5; k++) g += K.box({ x: 1040, y: 160 + k * 74, w: 360, h: 56, t: 'documento d' + (k + 1), step: 5 + k * 0.2, fill: true, size: 26 });
    g += K.text({ x: 1040, y: 560, t: 'R_k(q): os k mais relevantes', size: 28, tone: 'nevoa' });
    panel('s4-pinoE', 'Evidência recuperada', K.svg(W, 600, g, 'Coleção, função de relevância e k documentos recuperados'),
      'Recuperar não prova que cada documento seja suficiente ou correto.', [F('art-eq', 'Artigo: Equação 1')], { selos: [sel('pontuações ilustrativas', 'sol')] });
    det('s4-pinoE', 'Equação 1: detalhes',
      '<ul class="pt-list"><li>E = evidência. <i>q</i> = consulta; <i>D</i> = coleção; <i>s</i>(<i>q</i>, <i>d</i>) = relevância; <i>R<sub>k</sub></i>(<i>q</i>) = os <i>k</i> documentos recuperados.</li><li>O sistema escolhe, na coleção, os k documentos mais relevantes; não prova que cada um seja suficiente ou correto.</li><li>Pontuações do desenho: ilustrativas, não medidas.</li></ul>',
      [F('art-eq', 'Artigo: Equação 1')]);
  })();

  (function () {
    var it = [['L', 'Legalidade'], ['I', 'Impessoalidade'], ['M', 'Moralidade'], ['P', 'Publicidade'], ['E', 'Eficiência']];
    var g = '';
    it.forEach(function (x, i) {
      g += K.box({ x: i * 340, y: 0, w: 316, h: 250, t: x[1], size: 27, step: i + 1, fill: true });
      g += K.text({ x: i * 340 + 158, y: 80, t: x[0], size: 80, weight: 'b', anchor: 'middle' });
    });
    g = g.replace(/<text class="k-t k-b7" x="(\d+)" y="70"/g, '<text class="k-t k-b7" x="$1" y="70"');
    g += K.arrow({ pts: [[830, 250], [830, 330]], step: 6 }) + K.box({ x: 500, y: 330, w: 660, h: 100, t: 'regras que o sistema confere', step: 7, fill: 'solid', size: 32 });
    panel('s4-pinoN', 'Norma: princípios do art. 37', K.svg(W, 450, g, 'Cinco princípios LIMPE levando às regras verificáveis'),
      'LIMPE = legalidade, impessoalidade, moralidade, publicidade, eficiência. Viram regras conferidas.', [F('art-limpe', 'Artigo: Tabela 2')]);
    det('s4-pinoN', 'Tabela 2 (LIMPE): detalhes',
      tbl(['280px', '1fr', '1fr'], ['Princípio', 'Mecanismo relacionado', 'Evidência exigida'], [
        ['Legalidade', 'Regras normativas e validação de conformidade', 'Norma aplicável, resultado da verificação e exceções'],
        ['Impessoalidade', 'Critérios uniformes e testes de consistência', 'Resultados para casos equivalentes e auditoria de viés'],
        ['Moralidade', 'Responsabilização e registro de intervenções', 'Autor, justificativa, alterações e decisões humanas'],
        ['Publicidade', 'Explicação, proveniência e contestabilidade', 'Fontes, regras e trajetória acessíveis, conforme sigilo'],
        ['Eficiência', 'Automação assistida e recuperação documental', 'Tempo, custo, qualidade e retrabalho medidos']]) +
      '<p class="nota">LIMPE é uma camada de avaliação jurídico-administrativa; não substitui as capacidades técnicas.</p>', [F('art-limpe', 'Artigo: Tabela 2')]);
  })();

  panel('s4-pinoT', 'Rastro: proveniência registrada',
    K.svg(W, 580,
      [['modelo', 200], ['harness', 700], ['especialista', 1300]].map(function (a, i) { return K.box({ x: a[1] - 130, y: 0, w: 260, h: 80, t: a[0], step: i + 1, tone: 'nevoa' }); }).join('') +
      K.box({ x: 70, y: 220, w: 260, h: 80, t: 'geração', step: 4, fill: true }) + K.box({ x: 570, y: 220, w: 260, h: 80, t: 'verificação', step: 5, fill: true }) +
      K.box({ x: 70, y: 480, w: 260, h: 80, t: 'parecer', step: 6, fill: 'solid' }) + K.box({ x: 1170, y: 480, w: 260, h: 80, t: 'ontologia', step: 7 }) + K.box({ x: 620, y: 480, w: 320, h: 80, t: '7 fontes', step: 8, fill: true }) +
      K.arrow({ pts: [[200, 220], [200, 80]], step: 4, tone: 'nevoa' }) + K.arrow({ pts: [[700, 220], [700, 80]], step: 5, tone: 'nevoa' }) + K.arrow({ pts: [[1300, 480], [1300, 80]], step: 7, tone: 'nevoa', t: 'atribuída a', tx: 1400, ty: 280, anchor: 'start' }) +
      K.arrow({ pts: [[200, 480], [200, 300]], step: 6, t: 'gerado por', tx: 220, ty: 400, anchor: 'start' }) +
      K.arrow({ pts: [[600, 300], [250, 480]], step: 6, t: 'usou', tx: 360, ty: 370 }) + K.arrow({ pts: [[800, 300], [1230, 480]], step: 7, t: 'usou', tx: 1060, ty: 370 }) +
      K.arrow({ pts: [[330, 540], [620, 540]], step: 8, t: 'derivado de', tx: 475, ty: 520 }),
      'Grafo PROV: agentes, atividades e entidades do parecer'),
    'PROV (padrão W3C de proveniência): quem gerou, o que foi usado e de quais fontes deriva.',
    [F('prov-dm', 'W3C PROV-DM'), F('hnv-cena2b', 'Log real (cena 2b)')], { cred: 'Registro real de 25/10/2026 (prov-20261025T192704-230).' });
  det('s4-pinoT', 'Registro PROV: detalhes',
    '<pre class="js"><span class="k">"hnv:parecer-59eacca6ff47"</span>: {\n  "prov:type": <span class="v">"hnv:Parecer"</span>,\n  "hnv:sha256": <span class="v">"59eacca6ff47…"</span>,\n  "hnv:status": <span class="t">"aguardando aprovação humana"</span> }\n\n<span class="k">"hnv:fonte/STF_SV13"</span>: {\n  "prov:type": <span class="v">"hnv:Sumula"</span>,\n  "prov:label": <span class="v">"STF, Súmula Vinculante 13"</span>,\n  "hnv:statusValidacao": <span class="v">"pendente de validação"</span> }\n\n<span class="k">"wasDerivedFrom"</span>: { "_:d7": {\n  "prov:generatedEntity": <span class="v">"hnv:parecer-59eacca6ff47"</span>,\n  "prov:usedEntity": <span class="v">"hnv:fonte/STF_SV13"</span> } }</pre>' +
    '<p class="nota">Trecho abreviado; o parecer tem 7 fontes derivadas.</p>', [F('prov-dm', 'W3C PROV-DM'), F('hnv-cena2b', 'Log real (cena 2b)')]);

  panel('s4-pinoH', 'O humano libera',
    K.svg(W, 480,
      K.formula({ x: 0, y: 0, w: 1100, h: 120, size: 84, t: 'L(y) = At(y) ∧ H(y)' }) + K.text({ x: 0, y: 150, t: 'L = liberação · At = admissível · H = decisão humana', size: 28, tone: 'nevoa' }) +
      K.gate({ x: 640, y: 200, w: 170, h: 200, t: '∧', ins: ['admissível', 'humano: ainda não'], inTone: [null, 'block'], out: 'liberação: não', outTone: 'block', step: 1, stub: 90 }) +
      K.pic('bloqueio', { x: 1180, y: 214, s: 96, tone: 'block', step: 3 }),
      'Porta AND: admissível, sem aprovação humana'),
    'Na demonstração, o parecer ficou “aguardando aprovação humana”.',
    [F('art-eq', 'Artigo: Equação 3'), F('hnv-cena2b', 'Log real (cena 2b)')]);
  det('s4-pinoH', 'Equação 3: detalhes',
    tbl(['1fr', '1fr', '1fr'], ['At(y)', 'H(y)', 'L(y)'], [['F', 'F', 'F'], ['F', 'V', 'F'], ['V', 'F', '<span class="block">F: não liberado</span>'], { cls: 'dest', c: ['V', 'V', 'V: liberado'] }]) +
    '<p class="nota">F = falso, V = verdadeiro. A pessoa pode manter, modificar ou rejeitar a recomendação (artigo, Seção 3.1).</p>', [F('art-eq', 'Artigo: Equação 3')]);

  panel('s4-formula', 'Como o sistema decide',
    K.svg(W, 520,
      K.formula({ x: 0, y: 0, w: 1100, h: 100, size: 64, t: 'At = E ∧ N ∧ T', step: 1 }) + K.formula({ x: 760, y: 0, w: 900, h: 100, size: 64, t: 'L = At ∧ H', step: 5 }) +
      K.text({ x: 0, y: 130, t: 'At = admissível · E = evidência · N = norma · T = rastro · L = liberação · H = humano', size: 26, tone: 'nevoa' }) +
      K.gate({ x: 360, y: 190, w: 150, h: 240, t: '∧', ins: ['evidência', 'norma', 'rastro'], step: 2, stub: 80 }) +
      K.arrow({ pts: [[590, 310], [680, 310], [680, 283], [830, 283]], noHead: true, step: 3 }) + K.text({ x: 640, y: 262, t: 'admissível', size: 28, anchor: 'middle' }) +
      K.gate({ x: 830, y: 230, w: 130, h: 170, t: '∧', ins: ['', 'humano'], step: 4, stub: 60, out: 'liberação' }) +
      K.pic('bloqueio', { x: 1330, y: 220, s: 96, tone: 'block', step: 6, t: 'Portão fechado' }),
      'Duas portas em série: três condições tornam admissível; com a quarta, o humano, libera'),
    'Três condições tornam o parecer admissível; só com a quarta, o humano, ele é liberado.',
    [F('art-eq', 'Artigo: Equações 2 e 3'), F('hnv-cena2b', 'Cena 2b'), F('hnv-laco', 'Laço local')], { selos: [sel('especificação, não garantia', 'sol')] });
  det('s4-formula', 'Equação 2 e execuções: detalhes',
    tbl(['520px', '230px', '1fr', '300px'], ['Execução', 'E ∧ N ∧ T', 'O que o hook apontou', 'Resultado'], [
      ['Cena 2b: rascunho do modelo local 3B', '<b>F ∧ F ∧ F</b>', '2 citações bloqueadas', '<span class="block">bloqueado (exit 2)</span>'],
      ['Laço local, rodada 1', '<b>F ∧ F ∧ F</b>', '3 citações bloqueadas', '<span class="block">bloqueado (exit 2)</span>'],
      ['Laço local, rodadas 2 e 3', '<b>F ∧ V ∧ V</b>', '3 e depois 1 bloqueada', '<span class="block">bloqueado (exit 2)</span>'],
      { cls: 'dest', c: ['Cena 2b: após a correção (modelo de fronteira)', '<b>V ∧ V ∧ V</b>', 'todas as citações na ontologia', 'admissível; aguarda o humano'] }]) +
    '<p class="nota">N e T caem junto quando nenhuma citação passa. E = suporte evidencial; N = conformidade com Ω; T = rastreabilidade. F = falso, V = verdadeiro.</p>',
    [F('art-eq', 'Artigo: Equação 2'), F('hnv-cena2b', 'Cena 2b'), F('hnv-laco', 'Laço local')]);

  (function () {
    var rows = [];
    for (var i = 0; i < 16; i++) {
      var e = !!(i & 8), n = !!(i & 4), t = !!(i & 2), h = !!(i & 1), at = e && n && t, l = at && h;
      var f = function (b) { return b ? 'V' : 'F'; };
      var r = [f(e), f(n), f(t), f(h), f(at), at && !h ? '<span class="block">F</span>' : f(l)];
      rows.push(l ? { cls: 'dest', c: r.map(function (x) { return x === 'V' ? '<b>V</b>' : x; }) } : r);
    }
    panel('s4-regras', 'Regras e tabela-verdade',
      K.svg(W, 420,
        K.box({ x: 0, y: 40, w: 760, h: 150, t: ['admissivel(Y) :-', 'evidencia(Y), norma(Y), rastro(Y).'], size: 32, step: 1, fill: true, mono: true }) +
        K.arrow({ pts: [[380, 190], [380, 250]], step: 2 }) +
        K.box({ x: 0, y: 250, w: 760, h: 150, t: ['liberada(Y) :-', 'admissivel(Y), humano(Y).'], size: 32, step: 3, fill: 'solid', mono: true }) +
        K.text({ x: 0, y: 20, t: 'pseudocódigo ilustrativo', size: 26, tone: 'nevoa' }) +
        K.formula({ x: 900, y: 50, w: 760, h: 100, size: 58, t: 'At = E ∧ N ∧ T', step: 4 }) + K.text({ x: 900, y: 170, t: 'admissível = evidência, norma, rastro', size: 26, tone: 'nevoa' }) +
        K.formula({ x: 900, y: 250, w: 760, h: 100, size: 58, t: 'L = At ∧ H', step: 5 }) + K.text({ x: 900, y: 370, t: 'liberação = admissível e humano', size: 26, tone: 'nevoa' }),
        'Duas regras em pseudocódigo e as equações correspondentes'),
      'O código é ilustrativo e espelha as Equações 2 e 3; a vírgula é ∧.',
      [F('pseudocodigo', 'Pseudocódigo (ilustrativo)'), F('art-eq', 'Artigo: Equações 2 e 3')], { selos: [sel('ilustrativo, do autor', 'sol')] });
    det('s4-regras', 'Tabela-verdade (16 linhas): detalhes',
      '<div class="dois">' + tbl(['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['E', 'N', 'T', 'H', 'At', 'L'], rows.slice(0, 8), 'tv') + tbl(['1fr', '1fr', '1fr', '1fr', '1fr', '1fr'], ['E', 'N', 'T', 'H', 'At', 'L'], rows.slice(8), 'tv') + '</div>' +
      '<p class="nota">Só a linha destacada libera; em vermelho, a admissível mas não liberada. “:-” lê-se “se”.</p>', [F('pseudocodigo', 'Pseudocódigo (ilustrativo)'), F('art-eq', 'Artigo: Equações 2 e 3')]);
  })();

  /* =========================================================
     SLIDE 5
     ========================================================= */
  (function () {
    var ln = [['Documentos', 8], ['Neural', 138], ['Simbólico', 268], ['Humano', 398]];
    var g = ln.map(function (l, i) { return K.lane({ x: 0, y: l[1], w: W, h: 108, t: l[0], step: 0.1 * i, size: 26 }); }).join('');
    function nd(i, lane, t, s, o) { o = o || {}; o.x = 220 + i * 240; o.y = ln[lane][1] + 12; o.w = 222; o.h = 84; o.t = t; o.s = s; o.size = 28; return K.box(o); }
    g += nd(0, 0, 'Consulta', 'q e coleção D', { step: 1, tone: 'nevoa' }) + nd(1, 0, 'Recuperar', 'R_k(q)', { step: 3 }) +
      nd(2, 1, 'Gerar', 'modelo neural', { step: 5 }) + nd(3, 2, 'Verificar', 'E e N (regras Ω)', { step: 7, fill: true }) +
      nd(4, 2, 'Registrar', 'T, em PROV', { step: 9, fill: true }) + nd(5, 3, 'Aprovar', 'H(y), então L(y)', { step: 11, fill: 'solid' });
    g += K.arrow({ pts: [[442, 62], [460, 62]], step: 2 }) + K.arrow({ pts: [[682, 62], [700, 62], [700, 192], [700, 192]], step: 4 }) +
      K.arrow({ pts: [[922, 192], [940, 192], [940, 322]], step: 6 }) + K.arrow({ pts: [[1162, 322], [1180, 322]], step: 8 }) +
      K.arrow({ pts: [[1402, 322], [1420, 322], [1420, 452]], step: 10 }) +
      K.arrow({ pts: [[1050, 280], [1050, 262], [811, 262], [811, 238]], tone: 'block', step: 12, t: 'bloqueia e devolve para correção', tx: 1090, ty: 252, anchor: 'start' });
    panel('s5-fig1', 'Neural propõe, simbólico verifica', K.svg(W, 520, g, 'Figura 1 redesenhada: fluxo em quatro raias'),
      'Se a verificação acha problema, bloqueia e devolve; a liberação é humana.', [F('art-arq', 'Artigo: Figura 1 e Seção 3.1')],
      { cred: 'Redesenho do autor a partir da Figura 1 e da Seção 3.1 do artigo.' });
    det('s5-fig1', 'Figura 1: detalhes',
      '<ul class="pt-list"><li>A consulta q e a coleção D guiam a recuperação; o modelo neural gera y.</li><li>Regras explícitas dão evidência, norma e o registro do caminho; problemas bloqueiam a resposta e a devolvem para correção.</li><li>O nó “Verificar” reúne evidência (E) e norma (N); “Registrar” cobre o rastro (T).</li><li>A liberação depende da decisão humana.</li></ul>',
      [F('art-arq', 'Artigo: Figura 1 e Seção 3.1')]);
  })();

  panel('s5-calais', 'Três níveis de contribuição',
    K.svg(W, 540,
      K.box({ x: 0, y: 0, w: 1060, h: 540, t: '', step: 1, tone: 'nevoa' }) + K.text({ x: 30, y: 54, t: 'CALAIS', size: 44, weight: 'b' }) + K.text({ x: 30, y: 94, t: 'modelo de governança', size: 28, tone: 'nevoa' }) +
      K.box({ x: 40, y: 130, w: 980, h: 380, t: '', step: 2 }) + K.text({ x: 70, y: 184, t: 'Arquitetura neurossimbólica', size: 40, weight: 'b' }) + K.text({ x: 70, y: 224, t: 'componentes que operam o modelo', size: 28, tone: 'nevoa' }) +
      K.box({ x: 80, y: 270, w: 900, h: 210, t: ['Citāre', 'sistema de referência'], size: 40, step: 3, fill: 'solid' }) +
      K.arrow({ pts: [[1060, 270], [1180, 270]], step: 4, tone: 'nevoa', dash: true }) +
      K.box({ x: 1180, y: 190, w: 480, h: 160, t: ['= harness', 'vertical'], size: 40, step: 5, fill: true }) +
      K.box({ x: 1180, y: 380, w: 480, h: 150, t: ['Corpo de Bombeiros (CBMSC)', 'Escola de Gerência (ESAG)'], s: 'aplicações prévias', size: 26, step: 6, tone: 'nevoa' }),
      'Três níveis aninhados e a ponte com o harness'),
    'CALAIS = harness vertical: o artigo não usa a palavra “harness”.',
    [F('art-arq', 'Artigo: Seções 1 e 3.1'), F('bockeler2026', 'Böckeler (2026)'), F('galster2026', 'Galster et al. (2026)')]);
  det('s5-calais', 'Três níveis: detalhes',
    '<ul class="pt-list"><li><b>CALAIS:</b> modelo de governança e auditabilidade para IA verticalizada, configurada ao domínio, às suas evidências, regras e responsabilidades.</li><li><b>Arquitetura neurossimbólica:</b> recuperação documental, geração neural, checagem por regras, correção, registro da origem e decisão humana.</li><li><b>Citāre:</b> artefato de referência que hoje operacionaliza o CALAIS por essa arquitetura.</li><li><b>Ponte:</b> em 2026, a engenharia de agentes passou a chamar de harness o conjunto de regras e ferramentas em torno do modelo.</li></ul><p class="nota">A demonstração mostra que as partes funcionam juntas; efeito e comparação exigem estudo próprio.</p>',
    [F('art-arq', 'Artigo: Seções 1 e 3.1'), F('bockeler2026', 'Böckeler (2026)'), F('galster2026', 'Galster et al. (2026)')]);

  panel('s5-dsr', 'Seis ciclos de DSR',
    K.svg(W, 300,
      ['Problema', 'Requisitos', 'Design', 'Demonstração', 'Avaliação', 'Refinamento'].map(function (c, i) {
        return K.box({ x: i * 280, y: 40, w: 250, h: 120, t: c, size: 30, step: i + 1, fill: i === 5 ? 'solid' : true }) +
          (i < 5 ? K.arrow({ pts: [[i * 280 + 250, 100], [i * 280 + 280, 100]], step: i + 1 }) : '');
      }).join('') + K.arrow({ pts: [[1405, 160], [1405, 240], [125, 240], [125, 162]], step: 7, tone: 'nevoa', dash: true, t: 'ajustes voltam ao problema', tx: 760, ty: 280 }),
      'Seis ciclos do Design Science Research com retorno'),
    'O refinamento volta ao problema: o artefato evolui com a aplicação.',
    [F('art-dsr', 'Artigo: Tabela 3')]);
  det('s5-dsr', 'Tabela 3: detalhes',
    tbl(['210px', '1fr', '1fr'], ['Ciclo', 'Atividade realizada', 'Evidência ou produto'], [
      ['Problema', 'Análise de processos decisórios com uso intensivo de documentos', 'Necessidade de evidência, regra, rastro e decisão humana'],
      ['Requisitos', 'Levantamento com documentos e especialistas do domínio', 'Requisitos funcionais e salvaguardas'],
      ['Design', 'Integração de RAG, regras, logs e revisão humana', 'Arquitetura e fluxo de decisão'],
      ['Demonstração', 'Aplicação no CBMSC e versão derivada na ESAG/UDESC', 'Registros dos dois contextos'],
      ['Avaliação', 'Análise descritiva de uso, carga percebida e ocorrências', 'Tabelas, logs e respostas ao Raw NASA-TLX'],
      ['Refinamento', 'Ajustes da aplicação e da revisão por especialistas', 'Evolução do artefato e de suas regras']]),
    [F('art-dsr', 'Artigo: Tabela 3')]);

  panel('s5-ponte', 'A ponte: texto vira símbolo',
    K.svg(W, 400,
      K.lane({ x: 230, y: 0, w: 520, h: 330, t: '', tone: 'nevoa', step: 0.1 }) + K.lane({ x: 770, y: 0, w: 890, h: 330, t: '', step: 0.2 }) +
      K.text({ x: 250, y: 40, t: 'neural', size: 28, tone: 'nevoa' }) + K.text({ x: 790, y: 40, t: 'simbólico', size: 28 }) +
      K.box({ x: 0, y: 110, w: 200, h: 110, t: 'Pedido', s: 'x', step: 1, tone: 'nevoa' }) + K.arrow({ pts: [[200, 165], [270, 165]], step: 2 }) +
      K.box({ x: 270, y: 110, w: 200, h: 110, t: 'Modelo', s: 'f', step: 3, tone: 'nevoa' }) + K.arrow({ pts: [[470, 165], [520, 165]], step: 4, tone: 'nevoa' }) +
      K.box({ x: 520, y: 110, w: 200, h: 110, t: 'Texto', s: 'y', step: 5, tone: 'nevoa' }) + K.arrow({ pts: [[720, 165], [820, 165]], step: 6, t: 'a ponte', tx: 770, ty: 135 }) +
      K.box({ x: 820, y: 110, w: 220, h: 110, t: 'Extrair', s: 'φ(y): citações', step: 7, fill: true }) + K.arrow({ pts: [[1040, 165], [1090, 165]], step: 8 }) +
      K.box({ x: 1090, y: 110, w: 220, h: 110, t: 'Conferir', s: 'C ∈ Ω', step: 9, fill: true }) + K.arrow({ pts: [[1310, 165], [1360, 165]], step: 10 }) +
      K.box({ x: 1360, y: 110, w: 260, h: 110, t: 'Resultado', s: 'V ou F', step: 11, fill: 'solid' }) +
      K.arrow({ pts: [[1490, 220], [1490, 300], [370, 300], [370, 222]], tone: 'block', step: 12, t: 'F: bloqueia e devolve ao modelo', tx: 930, ty: 290 }),
      'Do texto neural às regras simbólicas'),
    'A saída neural vira citações discretas que as regras conseguem conferir.',
    [F('pseudocodigo', 'Esquema (ilustrativo)'), F('hnv-readme', 'README da demonstração'), F('art-eq', 'Artigo: Equação 2')], { selos: [sel('esquema ilustrativo', 'sol')] });
  det('s5-ponte', 'A ponte: detalhes',
    '<div class="eqrow">' + K.svg(1500, 130, K.formula({ x: 0, y: 0, w: 500, h: 110, size: 60, t: 'y = f(x)' }) + K.formula({ x: 520, y: 0, w: 520, h: 110, size: 60, t: 'g(y) = N(y,Ω) ∧ T(y)' }) + K.formula({ x: 1060, y: 0, w: 440, h: 110, size: 60, t: '(g ∘ f)(x) = g(f(x))' }), 'Equações') + '</div>' +
    '<ul class="pt-list"><li><b>Neural:</b> escreve em linguagem natural; a saída é uma sequência provável de palavras.</li><li><b>Simbólico:</b> extrai as citações por padrões de texto, consulta uma lista fechada (a ontologia) e devolve V ou F; F bloqueia.</li><li>Notação g ∘ f ilustrativa, do autor deste painel.</li></ul>',
    [F('pseudocodigo', 'Esquema (ilustrativo)'), F('hnv-readme', 'README da demonstração')]);

  /* =========================================================
     SLIDE 6
     ========================================================= */
  (function () {
    var X = function (i) { return i * 276; };
    function nd(i, y, a, b, o) { o = o || {}; o.x = X(i); o.y = y; o.w = 230; o.h = 84; o.t = a; o.s = b; o.size = 26; return K.box(o); }
    function lab(x, y, t, anchor) { return K.text({ x: x, y: y, t: t, size: 26, tone: 'nevoa', anchor: anchor || 'middle' }); }
    var g = '';
    var rel = ['tem seção', 'contém', 'expressa', 'é citada por', 'identifica'];
    for (var i = 0; i < 5; i++) g += K.arrow({ pts: [[X(i) + 230, 92], [X(i + 1) - 2, 92]], step: 2 + i }) + lab(X(i) + 253, 40, rel[i]);
    g += nd(0, 50, 'Artigo 42', ': Artigo', { step: 1 }) + nd(1, 50, 'Introdução', ': Seção', { step: 2 }) + nd(2, 50, 'Parágrafo 4', ': Parágrafo', { step: 3 }) +
      nd(3, 50, 'Afirmação A1', ': Afirmação', { step: 4, fill: true }) + nd(4, 50, '(Silva, 2022)', ': Citação', { step: 5 }) + nd(5, 50, 'Obra de Silva', ': Fonte', { step: 6 });
    g += K.arrow({ pts: [[1495, 134], [1495, 228]], dash: true, step: 7 }) + lab(1480, 176, 'tem cópia em PDF', 'end') +
      nd(5, 230, 'PDF da obra', ': Arquivo PDF', { step: 7 }) + K.arrow({ pts: [[1380, 272], [1336, 272]], step: 8 }) + lab(1357, 216, 'contém') +
      nd(4, 230, 'Trecho p. 4', ': Trecho', { step: 8 }) + K.arrow({ pts: [[1104, 272], [1060, 272]], step: 9 }) + lab(1082, 216, 'apoia, após validação') +
      nd(3, 230, 'Afirmação A1', ': Afirmação', { step: 9, fill: true }) + K.arrow({ pts: [[943, 228], [943, 134]], step: 10 }) + lab(925, 176, 'vínculo de evidência', 'end');
    g += nd(5, 410, 'Auditoria 7', ': Auditoria', { step: 11 }) + K.arrow({ pts: [[1380, 452], [1336, 452]], step: 12 }) + lab(1357, 402, 'confere') +
      nd(4, 410, 'Fonte / PDF', ': Fonte', { step: 12 }) + K.arrow({ pts: [[1104, 452], [1060, 452]], step: 13 }) + lab(1082, 402, 'produz resultado') +
      nd(3, 410, 'evidence_ready', ': Estado', { step: 13, fill: 'solid' });
    g += K.dot({ cx: 20, cy: 270, r: 12, hollow: true, tone: 'nevoa', t: 'caixa = instância', step: 14 }) + K.text({ x: 54, y: 322, t: ': Classe', size: 26, tone: 'nevoa' }) +
      K.text({ x: 54, y: 380, t: 'exemplo fictício', size: 26, tone: 'nevoa' });
    panel('s6-ontologia', 'Ontologia do Citāre', K.svg(W, 520, g, 'Cadeia do artigo ao trecho e à auditoria da fonte'),
      'O artigo foi conferido com o Citāre, com revisão humana. Dados do CBMSC e da ESAG não avaliam o Citāre.',
      [F('ont-citare', 'Ontologia do Citāre (v05)'), F('studer1998', 'Studer et al. (1998)'), F('art-citare', 'Artigo: declaração de uso')], { selos: [sel('material didático', 'sol')], cred: 'CBMSC: Corpo de Bombeiros Militar de Santa Catarina. ESAG: Escola Superior de Administração e Gerência (UDESC).' });
  })();
  det('s6-ontologia', 'Ontologia: detalhes',
    '<ul class="pt-list"><li><b>Ontologia:</b> “especificação explícita e formal de uma conceitualização compartilhada” (Studer, Benjamins e Fensel, 1998, a partir de Gruber, 1993).</li><li><b>T-box</b> (terminologia): classes e relações. Três grupos: Conteúdo acadêmico (Artigo, Seção, Parágrafo, Afirmação, Citação); Evidência e fonte (Fonte, Arquivo PDF, Trecho); Controle (Auditoria, Estado).</li><li><b>A-box</b> (asserções): instâncias e suas ligações, como Artigo 42 e Auditoria 7.</li><li>Instâncias do desenho são fictícias, para ensinar a leitura; as classes intermediárias são didáticas.</li></ul><p class="nota"><b>Dados do CBMSC/ESAG não avaliam o Citāre.</b></p>',
    [F('ont-citare', 'Ontologia do Citāre (v05)'), F('studer1998', 'Studer et al. (1998)')]);

  panel('s6-regras', 'Estados da fonte e bloqueios',
    K.svg(W, 520,
      [['quarantined', 'em quarentena', 'nevoa'], ['identity_verified', 'identidade', 'gelo'], ['text_verified', 'texto conferido', 'gelo'], ['evidence_ready', 'evidência pronta', 'gelo']].map(function (s, i) {
        return K.box({ x: i * 415, y: 210 - i * 70, w: 385, h: 100, t: s[0], s: s[1], size: 28, step: i + 1, tone: s[2], fill: i === 3 ? 'solid' : (i ? true : false) });
      }).join('') +
      K.arrow({ pts: [[192, 310], [192, 400]], tone: 'block', step: 5 }) +
      K.box({ x: 0, y: 400, w: 800, h: 110, t: 'exportação bloqueia', s: 'na etapa que falta', size: 30, tone: 'block', step: 6 }) +
      K.arrow({ pts: [[1437, 310], [1437, 400]], step: 7 }) + K.box({ x: 1040, y: 400, w: 620, h: 110, t: 'exportação passa', s: 'cada citação tem evidência exata', size: 30, step: 8, fill: true }),
      'Quatro estados da fonte e onde a exportação bloqueia'),
    'Conferido com o Citāre, com revisão humana. Dados do CBMSC e da ESAG não avaliam o Citāre.',
    [F('art-citare', 'Artigo: declaração de uso de IA'), F('ont-citare', 'Ontologia do Citāre (v05)')], { selos: [sel('material didático', 'sol')], cred: 'CBMSC: Corpo de Bombeiros Militar de Santa Catarina. ESAG: Escola Superior de Administração e Gerência (UDESC).' });
  det('s6-regras', 'Regras e declaração: detalhes',
    '<p><span class="chip">autoria</span> <span class="chip">ano</span> <span class="chip">DOI</span> O marcador (Silva, 2022) precisa corresponder a uma obra registrada; o DOI identifica cada obra.</p>' +
    '<ul class="pt-list"><li><b>quarantined:</b> dado ausente, não confirmado ou divergente.</li><li><b>identity_verified:</b> obra identificada; origem do texto ainda não.</li><li><b>text_verified:</b> pode ser anexada ao artigo.</li><li><b>evidence_ready:</b> trecho validado ligado a uma afirmação.</li><li><b>Bloqueios:</b> bibliographic_match (obra não achada entre as fontes), recovery (PDF não recuperado), source_audit (fonte em quarentena), exact_evidence (falta o vínculo da afirmação exata).</li></ul>' +
    '<p class="nota"><b>Declaração de uso de IA do artigo:</b> o autor usou o Citāre, plataforma de assessoria acadêmica com supervisão humana, para apoiar a redação e a verificação de citações; o texto foi guiado pelas fontes da coleção do autor (RAG), com regras de autoria, ano e DOI. Todo conteúdo e toda citação sugeridos foram revisados e aprovados pelo autor, que assume plena responsabilidade, sem atribuir autoria à IA.</p>' +
    '<p class="nota"><b>Dados do Corpo de Bombeiros Militar de Santa Catarina (CBMSC) e da Escola Superior de Administração e Gerência (ESAG/UDESC) não avaliam o Citāre.</b></p>',
    [F('art-citare', 'Artigo: declaração de uso de IA'), F('ont-citare', 'Ontologia do Citāre (v05)')]);

  panel('s6-triplas', 'Triplas e recuperação (Eq. 1)',
    K.svg(W, 470,
      K.formula({ x: 0, y: 0, w: 1100, h: 110, size: 66, t: 'R_k(q) = TopK_{d∈D} s(q,d)', step: 1 }) + K.text({ x: 1000, y: 70, t: 'R = documentos recuperados', size: 26, tone: 'nevoa' }) +
      [[':A1', 'afirmação'], [':CitSilva2022', 'citação'], [':ObraSilva2022', 'obra'], [':PDFSilva2022', 'cópia em PDF'], [':Trecho_p4', 'trecho']].map(function (n, i) {
        return K.box({ x: i * 340, y: 300, w: 300, h: 100, t: n[0], s: n[1], size: 26, step: 2 + i, fill: i === 0 });
      }).join('') +
      ['temCitacao', 'identifica', 'temCopiaEm', 'contem'].map(function (p, i) { return K.arrow({ pts: [[i * 340 + 300, 350], [i * 340 + 340, 350]], step: 3 + i, t: p, tx: i * 340 + 320, ty: 440, size: 26 }); }).join('') +
      K.arrow({ pts: [[1530, 300], [1530, 220], [150, 220], [150, 298]], step: 8, t: 'podeApoiar (após validação)', tx: 840, ty: 205 }),
      'Triplas sujeito, predicado e objeto e a volta ao trecho'),
    'A recuperação traz candidatos; a tripla “podeApoiar” só vale após validação.',
    [F('ont-citare', 'Ontologia do Citāre (v05)'), F('art-eq', 'Artigo: Equação 1'), F('pseudocodigo', 'Triplas (ilustrativas)')], { selos: [sel('triplas ilustrativas, do autor', 'sol')] });
  det('s6-triplas', 'Triplas: detalhes',
    tbl(['1fr', '1fr', '1fr'], ['Sujeito', 'Predicado', 'Objeto'], [
      [':Artigo42', 'a', ':Artigo'], [':Artigo42', ':temSecao', ':Introducao'], [':Introducao', ':contem', ':Paragrafo4'], [':Paragrafo4', ':expressa', ':A1'], [':A1', ':temCitacao', ':CitSilva2022'],
      [':CitSilva2022', ':identifica', ':ObraSilva2022'], [':ObraSilva2022', ':temCopiaEm', ':PDFSilva2022'], [':PDFSilva2022', ':contem', ':Trecho_p4'],
      { cls: 'dest', c: [':Trecho_p4', ':podeApoiar', ':A1'] }, [':Auditoria7', ':confere', ':PDFSilva2022'], [':Auditoria7', ':produzResultado', ':EvidenceReady']], 'trip') +
    '<p class="nota">Modelagem do autor a partir da Atividade v05; “a” significa “é instância de”; predicados adaptados; instância (Silva, 2022) fictícia. Dados do CBMSC e da ESAG (Escola Superior de Administração e Gerência) não avaliam o Citāre.</p>',
    [F('ont-citare', 'Ontologia do Citāre (v05)'), F('pseudocodigo', 'Triplas (ilustrativas)')]);

  /* =========================================================
     SLIDE 7
     ========================================================= */
  (function () {
    var meses = [['', 4], ['fev', 28], ['mar', 31], ['abr', 30], ['mai', 31], ['jun', 30], ['jul', 31], ['', 7]];
    var u = W / 192, g = K.arrow({ pts: [[0, 60], [W, 60]], noHead: true, step: 1 }), acc = 0;
    meses.forEach(function (m, i) {
      g += K.arrow({ pts: [[acc * u, 44], [acc * u, 76]], noHead: true, step: 1 + i * 0.1 });
      if (m[0]) g += K.text({ x: (acc + m[1] / 2) * u, y: 110, t: m[0], size: 28, anchor: 'middle', tone: 'nevoa' });
      acc += m[1];
    });
    g += K.arrow({ pts: [[W, 44], [W, 76]], noHead: true, step: 2 }) + K.text({ x: 0, y: 28, t: '28/01/2026', size: 28 }) + K.text({ x: W, y: 28, t: '07/08/2026', size: 28, anchor: 'end' }) +
      K.text({ x: W / 2, y: 28, t: '~191 dias (ilustrativo)', size: 28, anchor: 'middle', tone: 'nevoa' });
    g += K.bar({ x: 300, y: 170, w: 1000, h: 56, v: 9054, max: 9054, t: 'registros de envio', val: '9.054', step: 3 }) +
      K.bar({ x: 300, y: 260, w: 1000, h: 56, v: 2813, max: 9054, t: 'sem sucesso', val: '2.813', step: 4, tone: 'nevoa' });
    g += K.box({ x: 0, y: 370, w: 520, h: 90, t: '137 falhas de conexão', size: 28, step: 5, tone: 'nevoa' }) + K.box({ x: 570, y: 370, w: 520, h: 90, t: '143 estados close', size: 28, step: 6, tone: 'nevoa' }) +
      K.box({ x: 1140, y: 370, w: 520, h: 90, t: '1.018 erros de aquecimento', size: 28, step: 7, tone: 'nevoa' });
    panel('s7-logs', 'CBMSC: logs de envio', K.svg(W, 480, g, 'Régua do período, barra de 9.054 registros com 2.813 sem sucesso e três contagens'),
      'Calendário ilustrativo: só o total do período (9.054 em ~191 dias). Nenhum bloqueio explícito localizado.',
      [F('art-logs', 'Artigo: logs do CBMSC'), F('art-escopo', 'Artigo: escopo')], { selos: [sel('exploratório, SC')], cred: 'Contagens em processos diferentes não são somadas. Sem sucesso não é bloqueio.' });
    det('s7-logs', 'Logs do CBMSC: detalhes',
      '<ul class="pt-list"><li>Período de 28/01 a 07/08/2026: 192 dias contando as duas pontas; o artigo diz “aproximadamente 191”.</li><li>9.054 registros de envio; 2.813 sem sucesso (31,1%); os demais 6.241 são a diferença (cálculo do autor).</li><li>137 falhas de conexão, 143 estados close e 1.018 erros de aquecimento: processos diferentes, não somados.</li><li>Nenhum evento classificado como banimento ou restrição de linha pela Meta foi localizado. Isso não é risco zero: não há campo exclusivo para detectar todo banimento.</li><li>O artigo informa só o total do período; não há dado por dia.</li></ul>',
      [F('art-logs', 'Artigo: logs do CBMSC')]);
  })();

  (function () {
    var sc = [15.83, 15.83, 5.00, 3.33, 1.67, 0.00], X = function (v) { return 40 + v * 15.8; };
    var g = K.arrow({ pts: [[40, 200], [1620, 200]], noHead: true, step: 1 });
    for (var v = 0; v <= 100; v += 10) g += K.arrow({ pts: [[X(v), 190], [X(v), 210]], noHead: true, step: 1 }) + K.text({ x: X(v), y: 250, t: String(v), size: 26, anchor: 'middle', tone: 'nevoa' });
    var seen = {};
    sc.forEach(function (s, i) { var k = s.toFixed(2); seen[k] = (seen[k] || 0) + 1; g += K.dot({ cx: X(s), cy: 200 - (seen[k] - 1) * 34, r: 12, step: 2 + i * 0.4 }); });
    g += K.arrow({ pts: [[X(6.94), 120], [X(6.94), 200]], noHead: true, step: 6, tone: 'nevoa', dash: true }) + K.text({ x: X(6.94) + 14, y: 112, t: 'média 6,94', size: 30, weight: 'b' }) +
      K.text({ x: X(4.17) - 10, y: 300, t: 'mediana 4,17', size: 30, tone: 'nevoa', anchor: 'start' });
    g += K.text({ x: 40, y: 60, t: 'escala 0–100: menor valor, menor carga percebida', size: 28, tone: 'nevoa' });
    panel('s7-nasa', 'Esforço percebido: seis tarefas', K.svg(W, 340, g, 'Seis pontos entre 0 e 15,83 numa escala de 0 a 100'),
      'NASA-TLX bruto: são tarefas, não pessoas; cinco registros vêm da mesma conta.',
      [F('art-nasa', 'Artigo: Tabela 5'), F('hart1988', 'Hart e Staveland (1988)')], { selos: [sel('exploratório'), sel('sem inferência', 'sol')] });
    det('s7-nasa', 'Tabela 5: detalhes',
      tbl(['110px', '1fr', '170px'], ['Registro', 'Tarefa', 'Pontuação'], [['R1', 'Salvar análise de entrevista', '15,83'], ['R2', 'Salvar regras de decisão', '15,83'], ['R3', 'Salvar diagrama BPMN', '5,00'], ['R4', 'Salvar diagrama BPMN', '3,33'], ['R5', 'Salvar diagrama BPMN', '1,67'], ['R6', 'Salvar diagrama BPMN', '0,00']]) +
      '<p class="nota">TLX bruto = (1/6) Σ s<sub>i</sub> sobre seis dimensões (0 a 100). Média 6,94; mediana 4,17. Dois identificadores; sem comparação manual; o zero foi mantido porque a tabela e a auditoria confirmaram o envio.</p>',
      [F('art-nasa', 'Artigo: Tabela 5'), F('hart1988', 'Hart e Staveland (1988)')]);
  })();

  (function () {
    var rows = [['Contexto', 'operacional', 'seleção acadêmica', null, null], ['Etapa', 'operação observada', 'versão beta', null, null],
      ['NASA-TLX', 'seis registros', 'não identificado', true, false], ['Logs', 'disponíveis', 'sem medida comparável', true, false]];
    var g = K.box({ x: 360, y: 0, w: 640, h: 80, t: 'Bombeiros (CBMSC)', size: 32, step: 1, fill: true }) + K.box({ x: 1020, y: 0, w: 640, h: 80, t: 'Escola de Gerência (ESAG/UDESC)', size: 32, step: 1, fill: true });
    rows.forEach(function (r, i) {
      var y = 110 + i * 100;
      g += K.text({ x: 0, y: y + 40, t: r[0], size: 30, tone: 'nevoa' });
      g += K.box({ x: 360, y: y, w: 640, h: 80, t: r[1], size: 28, step: 2 + i, tone: r[3] === true ? 'gelo' : 'nevoa' }) +
        K.box({ x: 1020, y: y, w: 640, h: 80, t: r[2], size: 28, step: 2 + i, tone: r[4] === false ? 'nevoa' : 'nevoa' });
      if (r[3] === true) g += K.dot({ cx: 392, cy: y + 40, r: 11, step: 2 + i }) + K.dot({ cx: 1052, cy: y + 40, r: 11, hollow: true, tone: 'nevoa', step: 2 + i });
    });
    panel('s7-tab4', 'O que cada caso mostra', K.svg(W, 520, g, 'Dois casos lado a lado com medidas disponíveis e não identificadas'),
      'Os casos não são comparados quantitativamente e não avaliam o Citāre.', [F('art-tab4', 'Artigo: Tabela 4'), F('art-escopo', 'Artigo: escopo')],
      { cred: '● disponível · ○ não identificado no material analisado.' });
    det('s7-tab4', 'Tabela 4: detalhes',
      '<p class="nota">CBMSC: Corpo de Bombeiros Militar de Santa Catarina. ESAG/UDESC: Escola Superior de Administração e Gerência da Universidade do Estado de Santa Catarina.</p>' +
        tbl(['300px', '1fr', '1fr'], ['Dimensão', 'Corpo de Bombeiros (CBMSC)', 'Escola de Gerência (ESAG/UDESC)'], [
        ['Contexto', 'Processo público-operacional', 'Processo público-acadêmico de seleção'], ['Etapa', 'Operação assistida observada', 'Versão derivada em fase beta'],
        ['Raw NASA-TLX', 'Seis registros associados a dois identificadores', 'Não identificado no material analisado'],
        ['Logs de operação', 'Disponíveis para envio de mensagens, infraestrutura e aquecimento', 'Nenhuma medida diretamente comparável identificada'],
        { cls: 'dest', c: ['Salvaguardas comuns', 'Documentos, regras e decisão humana', 'Documentos, regras e decisão humana'] }]),
      [F('art-tab4', 'Artigo: Tabela 4')]);
  })();

  /* =========================================================
     SLIDE 8
     ========================================================= */
  P['s8-replay'] = '<div class="panel-body"><h2 class="pt">' + TITULOS['s8-replay'] + '</h2>' +
    '<iframe class="replay" src="demo/replay.html" title="Replay da demonstração" loading="eager" scrolling="no"></iframe>' +
    '<p class="leg">Erro: modelo local 3B. Correção: modelo de fronteira (Sonnet, via Claude Code), cena induzida.</p>' +
    foot([sel('ilustrativa, execução real, 25/10/2026'), F('hnv-cena2b', 'Log real (cena 2b)'), F('hnv-laco', 'Laço local'), F('hnv-cena1', 'Cena 1')], 'Espaço pausa; R reinicia. Logs sanitizados (sem a lista de ferramentas pessoais).') + '</div>';
  det('s8-replay', 'Replay: detalhes',
    '<ul class="pt-list"><li>Cena 1, sem harness: o 3B citou o inciso XXXIII, que não existe.</li><li>Cena 2a: o parecer cita 13 fontes, todas da ontologia; o hook respondeu OK.</li><li>Cena 2b (induzida): o rascunho do 3B foi entregue ao Claude Code (Sonnet); o hook bloqueou (exit 2) e, após a correção, deu OK.</li><li>Laço local do 3B sozinho: 3, 3 e 1 bloqueadas; não liberado.</li></ul>',
    [F('hnv-cena2b', 'Log real (cena 2b)'), F('hnv-laco', 'Laço local'), F('hnv-cena1', 'Cena 1')]);

  (function () {
    var x0 = 40, u = 45, g = K.arrow({ pts: [[x0, 160], [x0 + 22 * u, 160]], noHead: true, step: 1 }) +
      K.arrow({ pts: [[x0 + 22 * u, 160], [x0 + 33 * u, 160]], noHead: true, dash: true, tone: 'nevoa', step: 2 });
    var lab = { 1: 'I', 5: 'V', 10: 'X', 15: 'XV', 20: 'XX', 22: 'XXII' };
    for (var k = 1; k <= 22; k++) {
      g += K.arrow({ pts: [[x0 + k * u, k === 21 ? 100 : 128], [x0 + k * u, 160]], noHead: true, step: 1 + k * 0.08, tone: k === 21 ? 'gelo' : 'gelo' });
      if (lab[k]) g += K.text({ x: x0 + k * u, y: 200, t: lab[k], size: 28, anchor: 'middle' });
    }
    g += K.text({ x: x0 + 21 * u, y: 80, t: 'XXI: licitação', size: 28, anchor: 'middle' });
    g += K.arrow({ pts: [[x0 + 33 * u, 88], [x0 + 33 * u, 160]], noHead: true, tone: 'err', step: 5 }) + K.dot({ cx: x0 + 33 * u, cy: 70, r: 14, tone: 'err', step: 5 }) +
      K.text({ x: x0 + 33 * u, y: 36, t: 'XXXIII', size: 34, weight: 'b', tone: 'err', anchor: 'middle' }) + K.text({ x: x0 + 27 * u, y: 200, t: 'sem incisos', size: 28, tone: 'nevoa', anchor: 'middle' });
    g += K.box({ x: 0, y: 270, w: 500, h: 120, t: 'Rodada 1', s: 'XXXIII', size: 30, step: 6, tone: 'err' }) + K.box({ x: 540, y: 270, w: 500, h: 120, t: 'Rodada 2', s: 'XXXIII · Decreto 4.653', size: 30, step: 7, tone: 'err' }) +
      K.box({ x: 1080, y: 270, w: 500, h: 120, t: 'Rodada 3', s: 'XXI como nepotismo', size: 30, step: 8, tone: 'err' });
    panel('s8-regua', 'Régua do art. 37', K.svg(W, 420, g, 'Régua com 22 incisos do art. 37 e o inciso XXXIII fora da ponta'),
      'O art. 37 tem 22 incisos; o modelo 3B citou o XXXIII nas rodadas 1 e 2.',
      [F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')]);
    det('s8-regua', 'Régua: detalhes',
      '<ul class="pt-list"><li>Rodada 1: art. 37, XXXIII (inexistente).</li><li>Rodada 2: art. 37, XXXIII (inexistente), Decreto 4.653/2002 (atribuição falsa) e decisão do STJ sem número (não verificável).</li><li>Rodada 3: art. 37, XXI como “proíbe o nepotismo” (atribuição falsa; o XXI trata de licitação), Lei 8.112/1990 (real, sem base) e ADI 2.958 (pertinência não comprovada).</li><li>Na ontologia da demonstração estão apenas o caput, o II, o V e o § 4º.</li></ul>',
      [F('hnv-cena1', 'Checagem manual (cena 1)'), F('cf-art37', 'Constituição, art. 37')]);
  })();

  (function () {
    var g = '';
    g += K.box({ x: 0, y: 0, w: 380, h: 70, t: 'Pedido do servidor', step: 1, tone: 'nevoa' }) + K.arrow({ pts: [[190, 70], [190, 110]], step: 2, tone: 'nevoa' }) +
      K.box({ x: 0, y: 110, w: 380, h: 80, t: 'Modelo neural', s: 'guia macio: skill', step: 3, tone: 'nevoa' }) + K.arrow({ pts: [[190, 190], [190, 230]], step: 4 }) +
      K.box({ x: 0, y: 230, w: 380, h: 70, t: 'Grava o parecer', step: 5 }) + K.arrow({ pts: [[190, 300], [190, 340]], step: 6 }) +
      K.box({ x: 0, y: 340, w: 380, h: 80, t: 'Hook de verificação', s: 'regra dura', step: 7, fill: true }) +
      K.arrow({ pts: [[380, 380], [480, 380]], step: 8 }) + K.box({ x: 480, y: 340, w: 380, h: 80, t: 'Ontologia', s: '18 fontes', step: 8 }) +
      K.arrow({ pts: [[190, 420], [190, 470]], step: 9 }) + K.box({ x: 0, y: 470, w: 380, h: 70, t: 'exit 0: registro PROV', size: 26, step: 9, fill: true }) +
      K.arrow({ pts: [[190, 540], [190, 580]], step: 10 }) + K.box({ x: 0, y: 580, w: 380, h: 70, t: 'Aguardando humano', step: 10, fill: 'solid' }) +
      K.arrow({ pts: [[380, 405], [440, 405], [440, 510], [480, 510]], step: 11, tone: 'block' }) +
      K.box({ x: 480, y: 470, w: 380, h: 80, t: 'exit 2: BLOQUEIO', s: 'volta ao modelo', step: 11, tone: 'block' }) +
      K.arrow({ pts: [[860, 510], [920, 510], [920, 150], [382, 150]], step: 12, tone: 'block' });
    var n = 0;
    [['Norma', 3], ['Dispositivo', 12], ['Súmula', 1], ['Precedente', 2]].forEach(function (c, ci) {
      for (var i = 0; i < c[1]; i++, n++) g += K.box({ x: 1060 + (n % 9) * 68, y: 120 + Math.floor(n / 9) * 68, w: 56, h: 56, t: '', step: 13 + n * 0.1, tone: ci === 1 ? 'gelo' : 'nevoa', fill: ci === 1 });
    });
    g += K.text({ x: 1060, y: 80, t: '18 fontes da ontologia', size: 32, weight: 'b' }) + K.text({ x: 1060, y: 290, t: 'todas pendentes de validação', size: 28, tone: 'nevoa' });
    g += K.box({ x: 1060, y: 360, w: 600, h: 120, t: 'confere citações,', s: 'não raciocínio', size: 32, step: 15, tone: 'nevoa' });
    panel('s8-portao', 'O portão: do pedido ao humano', K.svg(W, 660, g, 'Fluxo do pedido ao hook, ontologia, bloqueio, registro e aprovação humana'),
      'Erro: modelo local 3B. Correção (cena 2b, induzida): modelo de fronteira (Sonnet, via Claude Code).',
      [F('hnv-readme', 'README da demonstração'), F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-laco', 'Laço local')], { selos: [sel('pendente de validação')] });
    det('s8-portao', 'Portão: detalhes',
      '<ul class="pt-list"><li><b>Quem corrigiu:</b> o 3B (qwen2.5:3b) errou; na cena 2b, induzida, um modelo de fronteira (Sonnet, via Claude Code) corrigiu no mesmo harness. O 3B sozinho, no laço: 3, 3 e 1 bloqueadas; não liberado.</li><li>Ontologia: 3 normas, 12 dispositivos, 1 súmula e 2 precedentes, todos “pendente de validação”.</li><li>Confere citações, não raciocínio.</li><li>Bloqueado não é falso: a Resolução 7/2005 existe, mas está fora da ontologia.</li><li>Referência vaga (“uma decisão do STJ”) escapa; o verificador usa padrões de texto, não um analisador jurídico.</li><li>aprovar.py recusa se o parecer não for admissível ou se o arquivo mudou.</li></ul>',
      [F('hnv-readme', 'README da demonstração'), F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-laco', 'Laço local'), F('hnv-cena2b', 'Cena 2b')]);
  })();

  (function () {
    var it = [['evidência', 'V'], ['norma', 'V'], ['rastro', 'V'], ['admissível', 'V'], ['humano', 'F'], ['liberação', 'F']];
    var g = '';
    it.forEach(function (x, i) {
      var bad = x[1] === 'F';
      g += K.box({ x: i * 280, y: 40, w: 240, h: 150, t: x[0], s: x[1] === 'V' ? 'verdadeiro' : 'falso', size: 30, step: i + 1, tone: bad ? 'block' : 'gelo', fill: !bad && i === 3 });
      if (i < 5) g += K.arrow({ pts: [[i * 280 + 240, 115], [i * 280 + 280, 115]], step: i + 1, tone: i >= 3 ? 'block' : 'gelo' });
    });
    g += K.box({ x: 480, y: 280, w: 700, h: 110, t: 'aguardando aprovação humana', size: 38, step: 8, fill: 'solid' });
    panel('s8-prov', 'O rastro do parecer', K.svg(W, 430, g, 'Seis campos do registro: quatro verdadeiros e dois falsos; carimbo de aprovação humana pendente'),
      'Admissível, mas não liberado: falta a aprovação humana. Verificação em 17 ms.',
      [F('hnv-cena2b', 'Log real (cena 2b)'), F('prov-dm', 'W3C PROV-DM'), F('hnv-ontologia', 'Ontologia (18 fontes)')], { selos: [sel('pendente de validação')] });
    det('s8-prov', 'Registro: detalhes',
      tbl(['1fr', '1fr', '100px'], ['Citação no parecer', 'Fonte da ontologia', 'Status'], [
        ['CF/88, art. 37, caput', 'CF88_art37_caput', 'ok'], ['CF/88, art. 37, V', 'CF88_art37_V', 'ok'], ['STF, Súmula Vinculante 13 (2 vezes)', 'STF_SV13', 'ok'], ['STF, RE 579.951', 'STF_RE579951', 'ok'],
        ['Lei 8.429/1992, art. 11, XI (2 vezes)', 'LEI8429_art11_XI', 'ok'], ['CF/88, art. 37, § 4º', 'CF88_art37_par4', 'ok'], ['Decreto 7.203/2010, art. 2º, III', 'DEC7203_art2_III', 'ok']]) +
      '<p class="nota">9 citações resolvidas sobre 7 fontes. Parecer sha256 59eacca6ff47…; ontologia 0.1.0, sha256 5b1f9baf096c…, pendente de validação. Rascunho do 3B corrigido por modelo de fronteira (Sonnet, via Claude Code), cena induzida.</p>',
      [F('hnv-cena2b', 'Log real (cena 2b)'), F('prov-dm', 'W3C PROV-DM')]);
  })();

  /* =========================================================
     SLIDE 9
     ========================================================= */
  (function () {
    var g = K.text({ x: 0, y: 40, t: '2025', size: 40, weight: 'b' }) +
      K.bar({ x: 380, y: 70, w: 900, h: 44, v: 23, max: 500, t: 'busca', val: '23', step: 1, tone: 'nevoa' }) +
      K.bar({ x: 380, y: 140, w: 900, h: 44, v: 4, max: 500, t: 'harness(es)', val: '4', step: 2, tone: 'nevoa' }) +
      K.bar({ x: 380, y: 210, w: 900, h: 44, v: 3, max: 500, t: 'com agent', val: '3', step: 3 }) +
      K.text({ x: 0, y: 320, t: '2026', size: 40, weight: 'b' }) + K.text({ x: 140, y: 320, t: 'até 25/10', size: 28, tone: 'nevoa' }) +
      K.bar({ x: 380, y: 350, w: 900, h: 44, v: 498, max: 500, t: 'busca', val: '498', step: 4, tone: 'nevoa' }) +
      K.bar({ x: 380, y: 420, w: 900, h: 44, v: 446, max: 500, t: 'harness(es)', val: '446', step: 5, tone: 'nevoa' }) +
      K.bar({ x: 380, y: 490, w: 900, h: 44, v: 446, max: 500, t: 'com agent', val: '≈446', step: 6 });
    panel('s9-metodo', 'Como contamos “harness” no arXiv', K.svg(W, 560, g, 'Barras da contagem de 2025 e 2026 em três etapas'),
      'Busca ti:harness AND abs:agent; em 2026, o descarte foi estimado por amostra de 25 títulos.',
      [F('arxiv-count', 'Contagem do autor (arXiv)')], { selos: [sel('contagem do autor'), sel('≈ estimativa', 'sol')] });
    det('s9-metodo', 'Método da contagem: detalhes',
      '<ul class="pt-list"><li><b>1. Busca:</b> título com “harness” e agent no resumo (ti:harness AND abs:agent), na API pública do arXiv, em 25/10/2026.</li><li><b>2. Filtro:</b> “harness” ou “harnesses” no título; “harnessing” fica de fora.</li><li><b>3. Sentido:</b> 2025 conferido título a título (3 de 4). 2026: descarte estimado por amostra de 25 títulos, todos de agentes; não foi título a título.</li><li>Só a forma singular “harness” dá 362 em 2026 (reprodução do avaliador). Em 2023 e 2024 não há ocorrência. 2026 é parcial.</li><li>Não é revisão sistemática; o ≈446 supõe que a amostra represente o conjunto.</li></ul>',
      [F('arxiv-count', 'Contagem do autor (arXiv)')]);
  })();

  panel('s9-cmu', 'Modelo pequeno, bom harness',
    K.svg(W, 470,
      K.text({ x: 0, y: 40, t: 'Desempenho', size: 36, weight: 'b' }) +
      K.bar({ x: 360, y: 70, w: 900, h: 56, v: 100, max: 100, t: 'modelo grande', val: '100%', step: 1, tone: 'nevoa' }) +
      K.bar({ x: 360, y: 150, w: 900, h: 56, v: 89.7, max: 100, t: 'pequeno + harness', val: '89,7%', step: 2 }) +
      K.text({ x: 0, y: 270, t: 'Custo', size: 36, weight: 'b' }) +
      K.bar({ x: 360, y: 300, w: 900, h: 56, v: 100, max: 100, t: 'modelo grande', val: '100%', step: 3, tone: 'nevoa' }) +
      K.bar({ x: 360, y: 380, w: 900, h: 56, v: 4, max: 100, t: 'pequeno + harness', val: '4%', step: 4 }),
      'Barras: 89,7% do desempenho a 4% do custo'),
    'Num conjunto de tarefas do estudo, o modelo pequeno com harness adaptado chega a 89,7%.',
    [F('cmu', 'Yang et al. (2026)')], { selos: [sel('preprint, arXiv')], cred: 'arXiv 2607.08938. Resultado do trabalho citado, não replicado aqui.' });
  det('s9-cmu', 'Estudo da CMU: detalhes',
    '<p class="quote">“Better Harnesses, Smaller Models: Building 90% Cheaper Agents via Automated Harness Adaptation” (Yang, Zhao, Wu, Kästner; arXiv 2607.08938, 09/07/2026).</p><p class="nota">Frase do resumo: “recovering 89.7% of LLM performance at 4% of the cost”.</p>', [F('cmu', 'Yang et al. (2026)')]);

  panel('s9-contexto', 'Contexto de reserva',
    K.svg(W, 330,
      K.arrow({ pts: [[0, 160], [W, 160]], noHead: true, step: 1 }) +
      [[60, 'a', 'Engenharia de contexto', 'Anthropic, 29/09/2025'], [615, 'a', 'Engenharia de harness', 'OpenAI, fev/2026'], [618, 'b', 'Galster et al.', '2.853 repositórios'], [798, 'b', 'Böckeler', 'abr/2026'], [1600, 'a', '446 artigos', 'com “harness” no título']].map(function (m, i) {
        var up = m[1] === 'a', end = m[0] > 1500 || m[0] === 618;
        return K.dot({ cx: m[0], cy: 160, r: 12, step: 2 + i }) + K.arrow({ pts: [[m[0], up ? 120 : 200], [m[0], up ? 160 : 160]], noHead: true, step: 2 + i, tone: 'nevoa' }) +
          K.text({ x: m[0] + (end ? -4 : 4), y: up ? 56 : 250, t: m[2], size: 28, weight: 'b', anchor: end ? 'end' : 'start' }) +
          K.text({ x: m[0] + (end ? -4 : 4), y: up ? 92 : 288, t: m[3], size: 26, tone: 'nevoa', anchor: end ? 'end' : 'start' });
      }).join(''),
      'Linha do tempo de setembro de 2025 a outubro de 2026'),
    'De engenharia de contexto (2025) a engenharia de harness (2026). Capex e MIT: ver detalhes.',
    [F('anthropic-context2025', 'Contexto (2025)'), F('openai2026', 'OpenAI (2026)'), F('galster2026', 'Galster et al.'), F('bockeler2026', 'Böckeler (2026)'), F('arxiv-count', 'Contagem arXiv')],
    { selos: [sel('contexto, reserva', 'sol')] });
  det('s9-contexto', 'Contexto de mercado: detalhes',
    '<div class="dois">' +
    K.svg(780, 260, K.text({ x: 0, y: 36, t: 'Capex das quatro big techs', size: 32, weight: 'b' }) + K.bar({ x: 130, y: 70, w: 560, h: 50, v: 410, max: 800, t: '2025', val: '~410', step: 1 }) + K.bar({ x: 130, y: 150, w: 560, h: 50, v: 725, max: 800, t: '2026', val: '~725', step: 2, tone: 'nevoa' }) + K.text({ x: 0, y: 240, t: 'US$ bi; 2026 é previsão (faixa 695–750)', size: 26, tone: 'nevoa' }), 'Capex') +
    K.svg(700, 260, K.ring({ cx: 130, cy: 130, r: 100, v: 95, step: 1 }) + K.text({ x: 130, y: 146, t: '95%', size: 50, weight: 'b', anchor: 'middle' }) + K.text({ x: 270, y: 110, t: 'sem retorno mensurável', size: 30 }) + K.text({ x: 270, y: 150, t: 'MIT NANDA, 2025', size: 26, tone: 'nevoa' }) + K.text({ x: 270, y: 186, t: 'relatório preliminar', size: 26, tone: 'nevoa' }), 'MIT') +
    '</div><p>' + sel('previsão, imprensa') + ' ' + sel('preliminar') + '</p><p class="nota">Capex: Microsoft, Alphabet, Amazon e Meta, cerca de US$ 410 bi (2025) e US$ 725 bi (2026, previsão); é orientação das empresas, não valor realizado. MIT: mais de 300 iniciativas, 52 entrevistas e 153 líderes. A página da OpenAI respondeu 403 na conferência.</p>',
    [F('capex', 'Capex (CNBC)'), F('mit', 'MIT NANDA'), F('openai2026', 'OpenAI (2026)')]);

  /* =========================================================
     SLIDE 10
     ========================================================= */
  panel('s10-aneis', 'Harness, grafo e laço',
    K.svg(W, 620,
      K.ring({ cx: 640, cy: 230, r: 210, dash: true, tone: 'nevoa', step: 1 }) + K.ring({ cx: 860, cy: 230, r: 210, step: 2 }) + K.ring({ cx: 750, cy: 410, r: 210, step: 3, tone: 'nevoa' }) +
      K.text({ x: 40, y: 150, t: 'Harness', size: 38, weight: 'b' }) + K.text({ x: 40, y: 192, t: 'hooks, skills,', size: 28, tone: 'nevoa' }) + K.text({ x: 40, y: 226, t: 'permissões, memória', size: 28, tone: 'nevoa' }) +
      K.text({ x: 1230, y: 150, t: 'Grafo de conhecimento', size: 38, weight: 'b' }) + K.text({ x: 1230, y: 192, t: 'ontologia, triplas,', size: 28, tone: 'nevoa' }) + K.text({ x: 1230, y: 226, t: 'GraphRAG', size: 28, tone: 'nevoa' }) +
      K.text({ x: 1070, y: 560, t: 'Laço', size: 38, weight: 'b' }) + K.text({ x: 1070, y: 600, t: 'gerar → verificar → corrigir', size: 28, tone: 'nevoa' }) +
      K.box({ x: 640, y: 290, w: 220, h: 90, t: 'HNV', size: 38, step: 4, fill: 'solid' }),
      'Diagrama de Venn: harness, grafo de conhecimento e laço, com o HNV na interseção'),
    'HNV = harness neurossimbólico vertical. Laço = ciclo agêntico, o mecanismo da demonstração.',
    [F('hnv-readme', 'README da demonstração'), F('bockeler2026', 'Böckeler (2026)'), F('edge2024', 'Edge et al. (2024)'), F('hnv-laco', 'Laço local')], { selos: [sel('hipótese: não testada', 'sol')] });
  det('s10-aneis', 'Peças do harness: detalhes',
    tbl(['1fr', '1fr', '1.2fr'], ['Peça do harness', 'Camada', 'Papel'], [
      ['Skill e instruções do projeto', 'guia <b>macio</b> (inferencial)', 'orienta o modelo: formato do parecer, citar só a ontologia'],
      ['Hook e verificador de citações', 'regra <b>dura</b> (computacional)', 'bloqueia citação fora da ontologia (exit 2)'],
      ['Ontologia de fontes', 'conhecimento <b>simbólico</b>', 'fontes reais conferidas nas páginas oficiais'],
      ['Registros PROV', '<b>rastreabilidade</b>', 'quem gerou, o que foi usado, de que fontes deriva'],
      ['Aprovação (aprovar.py)', '<b>liberação</b>', 'só o especialista libera; a máquina declara “admissível”']]) +
    '<p class="nota">Böckeler (2026): controles computacionais (rápidos, como testes) e inferenciais (revisão por modelo), cada um como guia (antes) ou sensor (depois). Aqui, a skill é guia inferencial e o hook, sensor computacional. GraphRAG: um modelo extrai um grafo de entidades dos documentos (Edge et al., 2024).</p>',
    [F('hnv-readme', 'README da demonstração'), F('bockeler2026', 'Böckeler (2026)'), F('edge2024', 'Edge et al. (2024)')]);

  panel('s10-nucleo', 'Camada simbólica sobre o modelo',
    K.svg(W, 400,
      K.box({ x: 0, y: 90, w: 380, h: 220, t: ['Modelo', 'neural'], s: 'linguagem natural', size: 36, step: 1, tone: 'nevoa' }) + K.arrow({ pts: [[380, 200], [480, 200]], step: 2 }) +
      K.box({ x: 480, y: 0, w: 1180, h: 400, t: '', step: 3 }) + K.text({ x: 510, y: 56, t: 'Camada simbólica vertical', size: 38, weight: 'b' }) +
      ['ontologia do domínio', 'regras (hooks)', 'rastro PROV', 'portão humano'].map(function (c, i) { return K.box({ x: 510 + i * 285, y: 150, w: 265, h: 150, t: c.split(' '), size: 28, step: 4 + i, fill: i === 3 ? 'solid' : true }); }).join('') +
      K.text({ x: 510, y: 360, t: 'o especialista escreve as regras e a ontologia', size: 28, tone: 'nevoa' }),
      'Modelo neural e camada simbólica do domínio'),
    '“Vertical” = específica de um domínio, como o Direito Administrativo na demonstração.',
    [F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-readme', 'README: limitações')], { selos: [sel('hipótese')] });
  det('s10-nucleo', 'Núcleo: detalhes',
    tbl(['300px', '1fr', '1fr'], ['Componente', 'Na demonstração', 'O que ainda falta'], [
      ['Guia macio', 'skill e instruções do projeto', '—'], ['Regra dura', 'hook e verificador por padrões de texto', 'referências vagas escapam; não é um analisador jurídico completo'],
      ['Ontologia do domínio', '18 fontes conferidas nas páginas oficiais', 'validação pelo especialista (hoje, “pendente”)'], ['Rastro e portão', 'registro PROV e aprovar.py', '—']]),
    [F('hnv-ontologia', 'Ontologia (18 fontes)'), F('hnv-readme', 'README: limitações')]);

  panel('s10-portao', 'Domínios candidatos (propostas)',
    K.svg(W, 470,
      [['Pareceres', 'administrativos', 'executado', 'especialista'], ['Escrita', 'científica', 'sistema existente', 'autor'], ['Boletins de', 'bombeiros', 'proposta', 'a definir'], ['Finanças', 'reguladas', 'hipótese do artigo', 'revisão humana']].map(function (d, i) {
        return K.box({ x: i * 420, y: 0, w: 380, h: 190, t: [d[0], d[1]], s: d[2], size: 32, step: i + 1, fill: i < 2, tone: i < 2 ? 'gelo' : 'nevoa' }) +
          K.arrow({ pts: [[i * 420 + 190, 190], [i * 420 + 190, 270]], step: i + 1, tone: 'nevoa' }) +
          K.box({ x: i * 420, y: 270, w: 380, h: 100, t: 'humano', s: d[3], size: 30, step: i + 1, fill: 'solid' });
      }).join('') + K.text({ x: 0, y: 440, t: 'cada domínio precisa de ontologia escrita pelo especialista e de um humano no portão', size: 28, tone: 'nevoa' }),
      'Quatro domínios candidatos e quem libera em cada um'),
    'Todos os domínios são propostas; só o primeiro tem demonstração executada.',
    [F('hnv-ontologia', 'Ontologia (18 fontes)'), F('art-citare', 'Artigo: uso do Citāre'), F('art-escopo', 'Artigo: transferência')], { selos: [sel('propostas', 'sol')] });
  det('s10-portao', 'Domínios: detalhes',
    '<ul class="pt-list"><li><b>Pareceres administrativos:</b> demonstração de 25/10/2026; ontologia de 18 fontes, pendente de validação.</li><li><b>Escrita científica:</b> Citāre; ontologia operacional descrita na Atividade v05; o artigo teve as citações conferidas nele, com revisão humana.</li><li><b>Boletins de ocorrência de bombeiros:</b> ideia surgida na aula de ontologias; não implementada.</li><li><b>Finanças reguladas (antifraude):</b> hipótese do artigo; exige adaptação regulatória e validação empírica.</li></ul>',
    [F('hnv-ontologia', 'Ontologia (18 fontes)'), F('art-citare', 'Artigo: uso do Citāre'), F('art-escopo', 'Artigo: transferência')]);

  /* =========================================================
     SLIDE 11
     ========================================================= */
  (function () {
    var cond = ['Manual', 'LLM puro', 'RAG', 'Arquitetura completa'];
    var met = ['Fidelidade', 'Conformidade', 'Qualidade', 'Tempo', 'Custo', 'Retrabalho', 'Intervenções'];
    var g = '';
    met.forEach(function (m, i) { g += K.text({ x: 420 + i * 175 + 70, y: 30, t: m, size: 26, tone: 'nevoa', anchor: 'middle' }); });
    cond.forEach(function (c, i) {
      g += K.lane({ x: 0, y: 60 + i * 110, w: W, h: 96, t: '', step: 1 + i }) + K.text({ x: 20, y: 60 + i * 110 + 56, t: c, size: 30, weight: 'b', tone: i === 3 ? null : null });
      met.forEach(function (m, j) { g += K.dot({ cx: 420 + j * 175 + 70, cy: 60 + i * 110 + 48, r: 14, hollow: true, tone: i === 3 ? 'gelo' : 'nevoa', step: 2 + i + j * 0.1 }); });
    });
    panel('s11-desenho', 'Estudo pareado: 4 condições', K.svg(W, 520, g, 'Quatro condições e sete medidas planejadas'),
      'Nada foi medido ainda: ○ marca a medida planejada em cada condição.', [F('art-escopo', 'Artigo: Seções 3.2, 4.2 e 5')], { selos: [sel('planejado, não medido')] });
    det('s11-desenho', 'Estudo pareado: detalhes',
      '<ul class="pt-list"><li>Condições: manual, LLM puro, RAG e arquitetura completa, em tarefas equivalentes.</li><li>Medidas: fidelidade de citação, conformidade, qualidade da decisão, tempo, custo, retrabalho e intervenções humanas.</li><li>Critérios definidos antes da coleta; participantes com códigos distintos; comparação entre condição manual e assistida.</li></ul>',
      [F('art-escopo', 'Artigo: Seções 3.2, 4.2 e 5')]);
  })();

  panel('s11-limites', 'Cinco limites',
    K.svg(W, 500,
      [['Situado em Santa Catarina', 'art-escopo'], ['Tarefas, não pessoas', 'art-nasa'], ['Confere citações, não raciocínio', 'hnv-laco'], ['Ontologia pendente de validação', 'hnv-ontologia'], ['O HNV é uma hipótese', 'art-escopo']].map(function (l, i) {
        return K.box({ x: 120, y: i * 100, w: 1100, h: 84, t: l[0], size: 32, step: i + 1, tone: 'nevoa' }) + K.icon('lock', { x: 30, y: i * 100 + 18, s: 48, step: i + 1, tone: 'nevoa' });
      }).join(''),
      'Cinco limites, cada um com cadeado'),
    'O próximo passo é o estudo pareado em quatro condições.', [F('art-escopo', 'Artigo: escopo'), F('art-nasa', 'Artigo: Tabela 5'), F('hnv-laco', 'Laço local'), F('hnv-ontologia', 'Ontologia (18 fontes)')], { selos: [sel('exploratório')] });
  det('s11-limites', 'Limites: detalhes',
    '<ul class="pt-list"><li>Situado em Santa Catarina: validade externa limitada; evidência exploratória e descritiva.</li><li>Seis registros são tarefas, não pessoas; cinco vêm da mesma conta; sem comparação manual. Os dados do CBMSC e da ESAG (Escola Superior de Administração e Gerência) não avaliam o Citāre.</li><li>Confere citações, não raciocínio; bloqueado não é falso (Resolução 7/2005).</li><li>As 18 fontes da ontologia aguardam a validação do especialista.</li><li>O harness neurossimbólico vertical ainda não foi testado.</li></ul>',
    [F('art-escopo', 'Artigo: escopo'), F('art-nasa', 'Artigo: Tabela 5'), F('hnv-laco', 'Laço local'), F('hnv-ontologia', 'Ontologia (18 fontes)')]);

  /* =========================================================
     RESERVAS
     ========================================================= */
  P['r1-respostas'] = '<div class="panel-body"><h2 class="pt">' + TITULOS['r1-respostas'] + '</h2><div class="qa">' +
    [
      ['Quem corrigiu o parecer foi o modelo pequeno?', 'Não. O 3B errou; um modelo de fronteira (Sonnet, via Claude Code), no mesmo harness, corrigiu (cena induzida). O 3B sozinho: 3, 3 e 1 bloqueadas; não liberado.', [['hnv-cena2b', 'Cena 2b'], ['hnv-laco', 'Laço local']]],
      ['Seu artigo não fala em harness.', 'O artigo propõe o CALAIS; em 2026, a engenharia de agentes chama esse conjunto de harness. O HNV é hipótese, não testada.', [['art-arq', 'Artigo: arquitetura'], ['bockeler2026', 'Böckeler (2026)']]],
      ['Isso não é só RAG?', 'RAG recupera, mas não confere; aqui um hook confere cada citação na ontologia. Em preprints, RAG jurídico erra 17–33%.', [['magesh', 'Magesh et al.']]],
      ['Bloquear não engessa?', 'Gera falso positivo, declarado: bloqueado não é falso (Resolução 7/2005). O custo é manter a ontologia.', [['hnv-laco', 'Laço local'], ['hnv-ontologia', 'Ontologia']]],
      ['Seis registros provam algo?', 'Não provam ganho: são tarefas, não pessoas. Para medir ganho, o estudo pareado.', [['art-nasa', 'Tabela 5'], ['art-escopo', 'Escopo']]]
    ].map(function (q, i) {
      return '<div class="qa-c"><h3>' + (i + 1) + '. ' + q[0] + '</h3><p>' + q[1] + '</p><div class="fontes">' + q[2].map(function (f) { return F(f[0], f[1]); }).join('') + '</div></div>';
    }).join('') + '</div>' + foot([sel('preprint'), sel('pendente de validação')], 'Respostas preparadas a partir da avaliação independente do deck (27/10/2026). Reserva: não abrir na fala principal.') + '</div>';

  function linkar(r) {
    return r.replace(/(https?:\/\/\S+)/g, function (u) { var c = u.replace(/[.,;]$/, ''); return '<a href="' + c + '" target="_blank" rel="noopener noreferrer">[link]</a>'; });
  }
  function refsHtml() {
    return '<div class="panel-body"><h2 class="pt">' + TITULOS['r3-referencias'] + '</h2><div class="refs refs3 refscroll">' +
      ART_REFS.slice(0, 9).map(function (r) { return '<p>' + linkar(r) + '</p>'; }).join('') + '</div>' +
      foot([], 'Referências do artigo #160, 1 a 9 de 15 (cada [link] abre o DOI ou a página). As 6 restantes e as fontes de cada afirmação do deck estão em “detalhes”.') + '</div>';
  }
  function refsDet() {
    var fs = window.HNV_FONTES || {};
    var deck = Object.keys(fs).map(function (k) {
      var f = fs[k], st = String(f.status || '');
      var plain = /^confirmado( no artigo| nos logs)?$/.test(st);
      return '<p><button class="fonte" data-src="' + k + '">' + k + '</button> ' + f.fonte + '.' + (plain ? '' : ' ' + sel(st.split(':')[0].split('(')[0], 'sol')) + '</p>';
    }).join('');
    return '<div class="panel-body det"><h2 class="pt">Detalhes: ' + TITULOS['r3-referencias'] + '</h2><h3>Referências do artigo, 10 a 15 de 15</h3><div class="refs refs3 refscroll" style="max-height:none;overflow:visible">' + ART_REFS.slice(9).map(function (r) { return '<p>' + linkar(r) + '</p>'; }).join('') + '</div><h3>Fontes das afirmações do deck</h3><div class="refs refs3 refscroll" style="max-height:none;overflow:visible">' + (deck || '<p>Carregue fontes.js antes de paineis.js.</p>') + '</div></div>';
  }
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
  Object.defineProperty(P, 'r3-referencias', { enumerable: true, configurable: true, get: refsHtml });
  Object.defineProperty(D, 'r3-referencias', { enumerable: true, configurable: true, get: refsDet });


  /* =========================================================
     CAMADA 3: PROVA DOCUMENTAL (imagens reais do artigo #160)
     ========================================================= */
  function ShowcaseFigure(id, src, fig, legenda) {
    var cid = 'lb-' + id;
    return '<figure class="showcase"><input type="checkbox" id="' + cid + '" class="lb-t" aria-label="ampliar a imagem">' +
      '<label for="' + cid + '" class="lb-th"><img src="' + src + '" alt="' + fig + ' do artigo #160 (original em inglês)"></label>' +
      '<label for="' + cid + '" class="lb-ov"><img src="' + src + '" alt="' + fig + ' ampliada"></label>' +
      '<figcaption>' + fig + ' do artigo #160 (original em inglês). ' + legenda + ' Clique na imagem para ampliar.</figcaption></figure>';
  }
  function ProofExplanation(texto) {
    return '<div class="proof"><h3>Por que esta figura comprova o slide</h3><p>' + texto + '</p></div>';
  }
  function addProof(id, src, fig, legenda, texto) {
    var d = D[id];
    var i = d.indexOf('</h2>') + 5;
    D[id] = d.slice(0, i) + ShowcaseFigure(id, src, fig, legenda) + ProofExplanation(texto) + d.slice(i);
  }
  addProof('s5-fig1', 'img/artigo/figura1.png', 'Figura 1', 'Arquitetura neurossimbólica com verificação e supervisão humana.',
    'É o fluxo real do artigo: o sistema neural propõe uma resposta, a verificação simbólica confere regras, evidência e citações, e a pessoa revisa antes da saída aprovada. O slide simplifica esse desenho.');
  addProof('s3-tab1', 'img/artigo/tabela1.png', 'Tabela 1', 'Capacidades e limitações típicas das abordagens.',
    'A tabela do artigo compara seis abordagens e mostra que cada uma tem um limite; é uma síntese dos autores, não um resultado experimental.');
  addProof('s4-pinoN', 'img/artigo/tabela2.png', 'Tabela 2', 'Princípios do art. 37, mecanismos e evidência exigida.',
    'A tabela liga cada princípio constitucional a um mecanismo e à evidência exigida: é o que transforma a norma em regra que o sistema consegue conferir.');
  addProof('s5-dsr', 'img/artigo/tabela3.png', 'Tabela 3', 'Rastreabilidade dos ciclos de Design Science Research.',
    'Mostra os seis ciclos da pesquisa, cada um com a atividade realizada e o produto gerado.');
  addProof('s7-tab4', 'img/artigo/tabela4.png', 'Tabela 4', 'Evidência delimitada nos casos CBMSC e ESAG/UDESC.',
    'Delimita o que cada caso permite afirmar: há registros e esforço percebido no CBMSC, e nenhuma medida comparável na ESAG/UDESC.');
  addProof('s7-nasa', 'img/artigo/tabela5.png', 'Tabela 5', 'Distribuição dos registros exploratórios de esforço percebido.',
    'Lista as seis tarefas e suas pontuações; confirma que são tarefas, não pessoas, e que o resultado é exploratório.');

  window.HNV_PANELS = P;
  window.HNV_DETALHES = D;
})();
