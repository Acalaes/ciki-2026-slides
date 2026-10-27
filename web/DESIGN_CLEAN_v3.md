# DESIGN CLEAN v3 (27/10/2026): SUBSTITUI as regras visuais do PLANO_v2 e da DIRECAO_VISUAL_v2b onde houver conflito

Feedback do usuário sobre a v2: "muitas palavras na camada 1 e até na 2; não vi imagens de fundo, parecem todas na frente; paleta e imagens confusas e pouco clean; poucos elementos não textuais foram bons e claros como a Figura 1 redesenhada (print anexo: caixas de borda fina, raias, setas simples, rótulos curtos, 1 cor de linha, 1 destaque). Precisamos de algo mais clean e de outra forma de dar qualidade e clareza aos elementos não textuais."
Modelo-padrão do herói visual: o painel s5-fig1 (diagrama em raias).

## 1. Três planos, nada mais
1. FUNDO (atmosfera, sempre visível): imagem real ou cena tecnológica, DESFOCADA (blur 6–10 px), tom azul, brilho 35–45%, nada nítido, sem texto. Véu em gradiente só do lado do texto. O fundo tem que ser perceptível (luminância média da captura entre 8% e 25% e textura visível), nunca coberto por canvas, partículas ou caixas opacas.
2. HERÓI (1 por slide): UM elemento não textual grande (≥55% da altura útil), em linha fina (traço 2 px, cantos 8 px), no estilo da Figura 1 redesenhada: caixas, raias, setas simples, nós; rótulos ≤3 palavras por caixa.
3. TEXTO: título de ≤3 palavras (≥140 px) + no máximo 1 selo de honestidade (≤4 palavras) + crédito (18 px).
Máximo 7 elementos visíveis por slide (sem contar o fundo). REMOVER da camada 1: constelações/partículas sobrepostas, fórmulas decorativas flutuando, chips, tabelas, listas, selos múltiplos, ícones soltos. Exceções: capa (arnês 3D simples: 1 arnês, 1 núcleo, 4 âncoras E N T H, sem partículas extras) e slide 8 (chuva Matrix só ATRÁS, sem competir com o código).

## 2. Paleta fixa de 4 cores
fundo #070D1A · estrutura/texto principal gelo #E6EEFB · secundário névoa #6F8FC7 · destaque ÚNICO âmbar #F2A541 (só erro/bloqueio: .err .block .late). Sem ciano, sem gradientes coloridos nos objetos, sem verde (exceto o slide 8 e demo\). Mensagem: azul-noite e gelo = verificado/registrado; âmbar = onde o sistema para; só isso.

## 3. Camada 2 (clique): um diagrama, quase sem texto
Cada painel = 1 diagrama limpo no mesmo estilo + título ≤6 palavras + legenda de ≤2 linhas (≥32 px) + chip da fonte. No máximo 30 palavras além dos rótulos do diagrama. Parágrafos, tabelas longas, listas e notas vão para a CAMADA 3 (gaveta "detalhes", aberta por botão "detalhes" ou clique no chip de fonte). Tabela só se ≤5 linhas × 4 colunas em ≥40 px. Pode haver 2 painéis por elemento clicável (diagrama; detalhes).

## 4. Kit de componentes SVG (consistência e qualidade)
Criar web\kit.js (função pura que gera SVG): box, lane (raia), arrow, node, gate (porta lógica), formula, bar, dot, ring. Traço 2 px, uma tipografia (Archivo), cantos 8 px, cores só da paleta. Animação de CONSTRUÇÃO passo a passo (cada elemento surge em sequência; o que está sendo explicado fica em gelo e o resto em névoa; âmbar só no erro). Reescrever TODOS os heróis e diagramas com o kit. Ícones: conjunto único de traço fino (SVG inline, sem biblioteca).

## 5. Fundos por slide (continuam os da DIRECAO_VISUAL_v2b, mas só como atmosfera desfocada)
1 capa: arnês 3D simples sobre fundo escuro desfocado (blueprint capa.jpg a 25%). 2: rede neural desfocada ao fundo; herói = barras softmax (uma barra âmbar). 3: caixa-preta (gravador.jpg) desfocada; herói = duas linhas do tempo. 4: fechadura (fechadura.jpg) desfocada; herói = 4 pinos/portas E N T H. 5: cabine (sinalizacao.jpg) desfocada; herói = pipeline em raias (Figura 1). 6: catalogo.jpg desfocado; herói = grafo da ontologia. 7: bombeiros.jpg desfocado; herói = régua do período + 6 pontos. 8: preto com chuva Matrix atrás; herói = código/portão em 3 passos. 9: noite.jpg; herói = barra 3→≈446. 10: via_ferrata.jpg desfocada; herói = anéis. 11: pista.jpg desfocada; herói = 4 raias. 12: capa.

## 6. Critérios mensuráveis (o avaliador vai medir)
camada 1: título ≤3 palavras, ≤3 rótulos no herói, ≤7 elementos, ≤4 cores (cores dominantes da captura), fundo visível (luminância 8–25% e textura), nenhum texto <40 px; camada 2: ≤30 palavras além dos rótulos, 1 diagrama; nada de tabelas/listas fora da camada 3; todo número com data-src; âmbar só em erro/bloqueio; P0/P1 do AVALIACAO_v2.md preservados (selo "quem corrigiu" no slide 8, calendário rotulado, ponte CALAIS = harness, roteiro completo ≈1.250 palavras, s9 depois do s5, "alucina", ≈446).
