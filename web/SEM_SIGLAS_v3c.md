# REGRA SEM SIGLAS v3c (27/10/2026): complementa DESIGN_CLEAN_v3.md e LAYOUT_FIXO_v3b.md

Feedback do usuário: (1) símbolos/ícones soltos (faixas de glifos sem legenda, "estes símbolos não se entende nada e poluem a camada 1"); (2) "E N T H" não é entendido: na primeira camada devem ir FIGURAS REPRESENTATIVAS, não letras nem abreviaturas. Vale para todos os slides com esse tipo de problema.

## Regras (camada 1)
1. PROIBIDO na camada 1 (slides): siglas e letras soltas (E N T H, HNV, PROV, RAG, TLX, F∧F∧F, T-box…), sinais lógicos ou matemáticos (∧ ∨ ¬ ∀ ∃ → Σ ∘ ≈ Δ), fórmulas, tiras de ícones, glifos de fonte de símbolos, emojis. Siglas e fórmulas SÓ na camada 2/3 (onde são explicadas por extenso na primeira ocorrência) e no código real do slide 8.
2. Toda figura é um PICTOGRAMA desenhado em SVG (traço 2 px, estilo do kit.js) reconhecível sozinho + a PALAVRA POR EXTENSO ao lado ou abaixo (Poppins ≥ 32 px). Nunca um ícone sem rótulo.
3. Conjunto de pictogramas (desenhar no kit.js e reutilizar): Evidência = documento com lupa; Normas = balança ou livro com régua; Rastro = trilha de pontos ligados (linha do tempo de pegadas); Humano = pessoa com carimbo/mão aprovando; Recuperar = lupa sobre pilha de documentos; Gerar = rede neural (nós); Verificar = escudo/portão com marca; Registrar = livro-razão/fita; Aprovar = carimbo; Bloqueio = portão fechado (âmbar); Ontologia = grafo de nós rotulados; Fechadura/Chave; Calendário; Barras.
4. Rótulos curtos, palavras completas e acentuadas (Evidência, Normas, Rastro, Humano, Recuperar, Gerar, Verificar, Registrar, Aprovar). Nada de "E", "N", "T", "H" na camada 1.
5. TESTE DOS 5 SEGUNDOS: uma pessoa sem contexto, vendo a captura, deve conseguir dizer o que o slide afirma. O orquestrador fará um teste cego com um modelo de visão (descrever cada captura sem contexto); falha se a descrição citar "símbolos" ou "letras" sem sentido.
6. Caracteres lógicos/matemáticos nas camadas 2/3 e no código: renderizar com fonte que TENHA o glifo (incluir localmente Noto Sans Math ou STIX Two Math, OFL, como fallback ao Poppins: font-family: 'Poppins','Noto Sans Math',...) ou desenhar o sinal como SVG; nunca depender de fonte do sistema; checar na captura que não aparecem caixinhas ou ícones estranhos.

## Aplicação nos slides (títulos e heróis)
- Slide 4: título "Quatro condições"; herói = quatro pictogramas lado a lado (Evidência, Normas, Rastro, Humano) ligados a uma fechadura/portão; ao liberar, o portão abre; quando falta uma, o portão fecha em âmbar com o pictograma que faltou. Os pinos viram os 4 pictogramas.
- Slide 10: título "Harness vertical" (a sigla HNV só no painel); herói = anéis com rótulos por extenso (Guias, Regras duras, Ontologia do especialista, Rastro, Humano).
- Slide 8 (demo): o bloqueio mostra três caixas "Evidência / Norma / Rastro" com marca X desenhada em âmbar (SVG), em vez de "F∧F∧F"; "exit 2" pode ficar só no código real.
- Slide 5: manter só as palavras do pipeline; sem E/N/T/H nem fórmulas.
- Slides 2, 3, 6, 7, 9, 11, 12: remover qualquer sigla/símbolo da camada 1; rótulos por extenso; NASA-TLX → "Esforço percebido".
- Capa: âncoras do arnês rotuladas por extenso (Evidência, Normas, Rastro, Humano), sem letras.
- Painéis: siglas e fórmulas permitidas, sempre com a explicação por extenso na primeira vez ("E = evidência"), e fórmulas com glifos renderizados corretamente.
