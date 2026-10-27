# LAYOUT FIXO v3b (27/10/2026): vale para TODOS os slides principais e reservas; complementa o DESIGN_CLEAN_v3.md

Pedido do usuário: (1) trocar a fonte para POPPINS (as atuais deixavam o slide infantilizado); (2) título sempre no mesmo lugar, canto superior esquerdo, numa única linha, por extenso (sem quebrar); (3) descrição lateral esquerda com o BLOCO a que o slide pertence, em letras verticais lidas de baixo para cima, centralizada verticalmente no slide, com linhas retas acima e abaixo da palavra até as bordas superior e inferior; (4) logo do CIKI pequeno no canto superior direito de todos os slides; (5) paginação n/n no canto inferior direito; (6) subtítulos e palavras do conteúdo da camada 1 em tamanho MENOR que o título.

## Grade (palco 1920×1080)
- Margem esquerda útil: a faixa do bloco ocupa x = 0–120 px. Conteúdo começa em x = 200.
- TÍTULO: left 200 px, top 64 px, uma linha (white-space: nowrap), Poppins 600, 72 px, cor gelo #E6EEFB, largura máxima 1300 px (título longo: reduzir o texto, não quebrar; ≤3 palavras por regra do v3). Mesmo lugar em todos os slides (inclusive reservas).
- SUBTÍTULO (opcional, 1 linha): left 200 px, top 150 px, Poppins 400, 40 px (menor que o título), cor névoa #6F8FC7.
- Palavras/rótulos da camada 1: sempre menores que o título (≤ 56 px; rótulos de diagrama ≥ 28 px).
- Herói: área x 200–1800, y 230–980.
- LOGO CIKI: canto superior direito, right 64 px, top 56 px, altura 40 px, opacidade .85, sem animação. Obter o logotipo oficial do CIKI no site do congresso (https://www.knowledgeconference.cl/) ou extraí-lo da página 1 do programa oficial (os PDFs do programa estão em C:\Users\acala\.claude\projects\C--Users-acala\947ae5e2-eaf5-481b-9b9c-8930cb00afd7\tool-results\webfetch-*.pdf; use PyMuPDF para extrair a imagem), recortar com fundo transparente e salvar em web\img\ciki-logo.png (e registrar em creditos.json: "logotipo do CIKI usado apenas para identificar o evento"). Só o CIKI (não GFIC nem ICKM).
- PAGINAÇÃO: canto inferior direito, right 64 px, bottom 40 px, Poppins 500, 28 px, névoa, formato "n/N" (ex.: 4/12), contando só os slides principais; nas reservas use "R1/R4" etc.
- FAIXA DO BLOCO (lateral esquerda): palavra do bloco em Poppins 500, 30 px, caixa-alta com espaçamento de letras .25em, girada para ler de baixo para cima (writing-mode: vertical-rl + transform: rotate(180deg), ou rotate(-90deg)), posicionada no CENTRO vertical do slide (y = 540) e centralizada horizontalmente numa coluna de 120 px de largura; acima e abaixo da palavra, linhas verticais retas de 2 px (cor névoa, 60% de opacidade) que vão da borda superior até ~36 px acima da palavra e da ~36 px abaixo dela até a borda inferior do slide, formando a "extensão" que mantém a palavra centralizada. Entrada animada: as duas linhas crescem a partir da palavra até as bordas.

## Blocos (jornada) e slides (ordem v3)
ABERTURA: 1 (capa). PROBLEMA: 2, 3. SOLUÇÃO: 4, 5, 6 (arquitetura e "agente = modelo + harness"). PROVAS: 7 (Citāre), 8 (CBMSC), 9 (demo). FRONTEIRA: 10 (HNV), 11 (estudo pareado). FECHO: 12. Reservas: bloco "RESERVA".
Títulos sugeridos (≤3 palavras, uma linha): 1 "Auditável por construção" (na capa o título pode ser maior e centralizado à esquerda, mas mantém logo, bloco e paginação); 2 "A IA alucina"; 3 "Explicar depois não basta" (4 palavras: reduzir para "Explicar depois"); 4 "E ∧ N ∧ T ∧ H"; 5 "Neural e simbólico"; 6 "Agente = modelo + harness" (reduzir para "Modelo + harness"); 7 "Citāre"; 8 "CBMSC"; 9 "Alucina. Bloqueia. Corrige." (3 palavras); 10 "HNV"; 11 "Estudo pareado"; 12 "Auditável por construção".

## Tipografia
Poppins local (offline): baixar via Google Fonts CSS API (curl com User-Agent de navegador moderno) os woff2 latin e latin-ext dos pesos 400, 500, 600, 700 para web\fonts\ (poppins-400-latin.woff2 etc.), gerar web\fonts\poppins.css com @font-face (font-display: swap) e LICENSE (OFL). Substituir Archivo e Source Serif 4 em TODO o deck (slides, painéis, demo). Exceção: o slide 8 e o replay mantêm fonte monoespaçada para código. Fórmulas em Poppins 500 (ou monoespaçada só em código/pseudocódigo).
Painéis (camada 2): mesmo grid: título no canto superior esquerdo, uma linha, Poppins 600 56 px; logo e paginação do slide continuam visíveis atrás do painel (ou repetidos); sem faixa de bloco (a faixa do slide aparece por trás).

## Critérios de aceitação
Título na mesma posição (±2 px) em todos os slides; sem quebra de linha no título; faixa do bloco no centro vertical, lida de baixo para cima, com linhas até as bordas; logo CIKI visível e ≤44 px de altura; paginação n/N correta; nenhum subtítulo ou texto de conteúdo maior que o título; nenhuma ocorrência de Archivo ou Source Serif no CSS (exceto comentários); fontes carregam offline.
