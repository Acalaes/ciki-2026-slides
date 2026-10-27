# DIREÇÃO VISUAL v2b (27/10/2026) — SUBSTITUI a parte de "FOTO" do PLANO_v2.md

Pedido do usuário: "a imagem de capa poderia ser algo como uma harness, mas em 3D. Os demais deveriam poder ter algo com rede neural e as fórmulas ou funções (programação simbólica). O cunho tem que ser explicativo, mas as imagens podem ser mais tecnológicas."

## Regra geral
- O fundo de cada slide deixa de ser foto e passa a ser uma CENA TECNOLÓGICA ANIMADA que explica a ideia do slide: rede neural (nós e arestas pulsando) + fórmulas/funções/regras simbólicas flutuando ou se resolvendo. Fotos (web\img\) viram textura opcional em baixa opacidade só onde um lugar real ajuda (slides 6 e 7); os créditos continuam obrigatórios onde usadas.
- Paleta e âmbar inalterados (âmbar só em .err/.block/.late). Fundo escuro, linhas finas ciano-gelo (#6F8FC7 / #E6EEFB). Tipografia do plano.
- Todo texto de fórmula/código no fundo é ilustrativo e rotulado (aria-hidden se decorativo). Fórmulas devem ser CORRETAS. Código/regras são "pseudocódigo ilustrativo".
- Um único canvas/WebGL ativo só no slide corrente; ?lite=1 e prefers-reduced-motion usam imagens estáticas pré-renderizadas (PNG) dessas cenas (gere-as por captura headless) — também para o PDF/?static=1.

## Capa (slide 1): HARNESS EM 3D
Cena 3D em Three.js (r149, build UMD: baixar https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js para web\lib\three.min.js + LICENSE MIT; NÃO usar módulos ES, pois file:// bloqueia). Um núcleo neural (esfera de nós ciano ligados por arestas, pulsando) envolvido por um HARNESS 3D: faixas/straps curvas, anéis metálicos e fivelas (cilindros/toros em wireframe + material fosco azul-aço, rim light gelo) que o abraçam como um arnês de segurança; 4 pontos de ancoragem marcados E N T H. Rotação lenta + paralaxe com o mouse (±10°). Entrada: o harness se monta em 2,5 s (straps se desenham, fivelas encaixam), depois o núcleo acende. Com WebGL indisponível: fallback em canvas 2D com projeção em perspectiva (nós + anéis girando). Gere também web\img\capa_harness3d.png (captura) para lite/PDF/print. Texto da capa continua "Auditável por construção".
Camada 2 da capa: s1-harness3d (NOVO): legenda do que cada parte do 3D representa (núcleo = modelo neural; faixas = skills/guia macio; anéis rígidos = hooks/regra dura; ancoragens = E N T H; fivela = aprovação humana).

## Fundos por slide (explicativos)
2 "A IA alucina.": rede neural cuja camada de saída mostra as barras da distribuição softmax; uma barra "plausível mas sem fonte" cresce e vira âmbar (.err); fórmula softmax(z)_i = e^{z_i} / Σ_j e^{z_j} e "P(y_t | y_<t, x)". Mensagem: o modelo maximiza plausibilidade, não verdade (explicação didática, fonte: Huang et al. 2025, survey de alucinação em LLMs citado no artigo). Camada 2 NOVA: s2-softmax.
3 "Explicar depois não basta": rede neural com um mapa de saliência (heatmap) sobreposto "depois", ao lado de portões lógicos "antes"; fórmula f(x) ≈ g(x) (substituto explicativo) vs f(x) ∧ regra(x).
4 "E ∧ N ∧ T ∧ H": circuito de portas lógicas AND com 4 entradas + tabela-verdade que se preenche; trecho de pseudocódigo ilustrativo admissivel(Y) :- evidencia(Y), norma(Y), rastro(Y). e liberada(Y) :- admissivel(Y), humano(Y). Camada 2 NOVA: s4-regras (código, tabela-verdade, correspondência com Eq. 2–3).
5 "Neural propõe. Simbólico verifica.": à esquerda camadas de rede neural (nós), ao centro uma ponte, à direita uma árvore/grafo de regras (símbolos); composição de funções g ∘ f e V(y)=N(y,Ω) ∧ T(y); partícula âmbar ricocheteia. Camada 2 NOVA: s5-ponte (neural → símbolo: função de composição, o que é neural e o que é simbólico).
6 Citāre: grafo de conhecimento (ontologia) em 3D leve (nós e relações flutuantes) com triplas RDF/OWL ilustrativas (:Citacao :temDOI "…" . :Afirmacao :apoiadaPor :Fonte .); Eq. 1 R_k(q)=TopK_{d∈D} s(q,d). Textura de foto opcional (catalogo.jpg a ≤15%). Camada 2 NOVA: s6-triplas.
7 CBMSC: malha de rede (infraestrutura de envio) + série temporal do calendário; fórmula NASA-TLX = (1/6) Σ s_i. Textura de foto opcional (bombeiros.jpg a ≤15%).
8 Demo: terminal com o código real do hook (trecho do harness/verificar_citacoes.py) e árvore sintática; sem foto.
9 "Agente = modelo + harness": constelação de 446 pontos + grafo de módulos (ferramentas, laços, hooks, skills, memória, permissões) em órbita do núcleo neural.
10 HNV: o harness 3D da capa em versão de ANÉIS concêntricos (reutiliza o módulo 3D/2D da capa) com a ontologia em volta.
11 Estudo pareado: quatro "pistas" como quatro redes/pipelines paralelos com métricas; fórmula Δ = métrica(arquitetura) − métrica(base) para cada condição.
12 Fecho: volta o harness 3D da capa, agora completo, todas as ancoragens acesas.

## Contrato com B3 (camada 2)
IDs NOVOS de painéis: s1-harness3d, s2-softmax, s4-regras, s5-ponte, s6-triplas (além dos já existentes). Cada um: infográfico explicativo, ≥30 px, fórmulas grandes, fonte clicável. Fontes novas em fontes.json: huang2025 (Huang et al. 2025, ACM TOIS, conforme referência do artigo; confira em C:\Users\acala\projetos\ciki-2026-artigo-160\artigo-final.md), softmax (definição matemática padrão; status "definição padrão"), pseudocodigo (rótulo "ilustrativo, do autor").
