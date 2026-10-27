# AVALIAÇÃO v3 (avaliador independente, 27/10/2026)

Base: capturas `qa/v2_s01–s16_1920x1080.png` (teste cego feito ANTES de ler o projeto), `auditar_deck.py` (saída 0), `qa_medir.py` (rodado agora), `index.html`, `deck.js` (heróis), `fontes.json`, artigo-final.md, `hnv-demo/logs` e `harness/verificar_citacoes.py`.

## (A) Teste cego

| Slide | O que um leigo entende | Problemas (a título · b símbolo/sigla · c foto · d leitura) |
|---|---|---|
| 1 Capa | IA auditável desde o projeto; arnês com 4 âncoras (Evidência, Normas, Rastro, Humano) | a ok · b ok · c planta da capa quase invisível, parece "prédios apagados" · d ok |
| 2 | IA alucina; 2.217 casos em tribunais (41 BR, 1.514 EUA) | a ok · b "Exemplo real: artigo 37, inciso 33" não diz de quê nem que não existe; "Charlotin" solto · c plenário reconhecível · d ok |
| 3 | Explicar depois = dano antes; verificar antes = decisão segura | a ok · b ok · c caixa-preta legível ("FLIGHT RECORDER") · d ok. Melhor slide do deck |
| 4 | Quatro condições; faltando uma, o portão não abre | a ok · b título diz QUATRO e a fila mostra CINCO itens ("Bloqueado" parece a 5ª condição); por que "Rastro" está vermelho só se entende falado · c cadeados ok · d ok |
| 5 | IA gera, regras verificam/bloqueiam, humano aprova | a ok · b ok · c cabine de sinalização só reconhecível para quem conhece · d ok |
| 6 | Modelo + harness = agente | a "harness" explicado no título, ok · b "CALAIS" e "harness vertical" incompreensíveis; "+" e "=" são fórmula na camada 1 · c racks ok · d ok |
| 7 | Citāre liga afirmação → citação → fonte → pronto | a ok · b ok · c fichário ok · d pesos de fonte inconsistentes (Afirmação/Fonte negrito, Citação/Pronto regular); metade direita vazia |
| 8 | 9.054 envios em ~191 dias, 2.813 sem sucesso; esforço baixo (mediana 4,17) | a ok · b "envios" de quê?; "ilustrativo: só o total do período" obscuro; pontos em diagonal parecem erro · c quartel dos bombeiros legível · d ok |
| 9 Demo | IA alucina, é bloqueada, é corrigida | a ok · b **FALHA**: letras soltas da chuva ("N T", "T H", ∃, λ, →), "I", "XXII", "XXXIII" sem legenda, código; dígito "3" da chuva sobre o carimbo · c fundo preto (exceção declarada) · d selo de 2 linhas denso, "ilustrativa, execução real" soa contraditório |
| 10 | Hipótese: modelo cercado por guias, regras duras, ontologia; humano na saída | a ok · b "Ontologia" sem explicação; ponto vermelho sem sentido para leigo · c pessoa em cabo na montanha reconhecível · d rótulos sobre linhas dos anéis |
| 11 | Comparar 4 métodos | a ok · b coluna de cadeados parece ligada linha a linha aos métodos (Manual ↔ "Só em Santa Catarina"); "Busca + modelo" tem símbolo; selo "evidência exploratória" num slide de estudo futuro · c pista ok · d ok |
| 12 | Conclusão: auditar antes de assinar | a ok · b ok · c igual à capa (fraca) · d ok |
| R1 | Perguntas e respostas | ok; "ferramentas" minúsculo após ponto |
| R2 | Método | "hook" sem explicação |
| R3 | Referências | **FALHA**: texto cortado na base das duas colunas (capex, Constituição) |
| R4 | Próximos estudos | ok |

## (B) Conformidade (REGRAS v1.0.0 + specs v3)

| Regra | Resultado | Evidência |
|---|---|---|
| Auditor automático | PASSA | `auditar_deck.py` → "OK: auditoria sem falhas", exit 0; 38 painéis, 36 fontes |
| Título 1 linha, ≤45 car., mesma posição | PASSA | medir: 0 títulos com 2 linhas, 0 >45; y=24 em todos menos capa (exceção prevista) |
| Título 64–72 px (REGRAS §9) | FALHA (conflito) | 48 px medido; v3f aceita ≥48. Harmonizar REGRAS |
| Título sem sigla/fórmula, de ação | PASSA | todos em português; "HARNESS:" explicado no próprio título |
| Pergunta-guia ≤10 palavras | PASSA | todas presentes |
| Blocos válidos e faixa vertical | PASSA | INTRODUÇÃO/PROBLEMA/SOLUÇÃO/PROVAS/FUTURO/CONCLUSÃO/RESERVA, baixo→cima, barras até as bordas |
| Logo ≈44 px, paginação n/N e R1/R4 | PASSA | capturas |
| Sem siglas/letras/símbolos na camada 1 | FALHA | s9 (chuva com letras e ∃ λ →; numerais romanos sem rótulo); s6 "+"/"="; s11 "Busca + modelo"; "CALAIS" sem explicação |
| Pictograma + palavra ≥32 px | PASSA parcial | pictogramas com rótulo; texto mínimo medido 28 px (s2, s11) |
| Nada <40 px na camada 1 (REGRAS §6) | FALHA (conflito) | mínimo 28–34 px; v3b permite ≥28. Harmonizar |
| ≤7 elementos por slide | FALHA | rótulos no herói: s8 (bombeiros) 10, s5 9, s2 8, s11 8 |
| Contraste título ≥7:1, demais ≥4,5:1 | PASSA | título 13,8–17,7; guia 5,1–8,0; herói 12,2–17,2 |
| Paleta (teal, branco, zinc, vermelho só erro; verde só demo) | PASSA | cores dominantes: neutro ≥77%; azul só na camada da foto (s2 11%) |
| Fundo neutro sem foto; foto com sombreado | PASSA | reservas lisas; véu presente |
| Foto reconhecível e explicativa | PASSA parcial | 9/11 boas; capa/fecho quase invisíveis; s5 só para iniciados |
| Crédito de foto visível | FALHA leve | s1 e s12 sem crédito (capa.jpg, domínio público) |
| Sem fundo abstrato | PASSA com exceção | só s9 (Matrix, exceção declarada) |
| Poppins local, offline | NÃO TESTÁVEL aqui por inteiro | `fonts/poppins.css` carregado; sem http no auditor |
| 3 camadas em todo slide | PASSA (estrutural) | data-open em todos os heróis; auditor confere painéis ↔ data-open |
| Roteiro completo e tempo | PASSA | ver (C) |
| Interação (roda, Esc, P, trackpad), fps | NÃO TESTÁVEL | ver (F) |

## (C) Conteúdo, storyline e fatos

- Tempo: soma `data-t` = **540 s** (= 90% de 10 min, sem folga além dos 60 s). Falas principais = **1.129 palavras ≈ 484 s** a 140/min; cobre o tempo com pausas e os 3 passos da demo. s12 tem 38 palavras para 25 s (curto, mas ok para fecho).
- Jornada do herói: clara (mundo comum s1 → chamado s2 → falsa saída s3 → ferramenta s4 → travessia s5–6 → provas s7–9 → elixir s10 → retorno honesto s11 → espelho s12). Eixo "auditabilidade por construção" aparece em s1, s3, s12. PASSA.
- Honestidade: quem corrigiu (s9 selo + fala + R1) PASSA; calendário ilustrativo PASSA; "CBMSC/ESAG não avaliam o Citāre" PASSA (só na fala); ≈446 com "contagem do autor" PASSA; preprint CMU no rodapé PASSA; "alucina" PASSA; "inventa" e "determinístico" ausentes PASSA; ponte "CALAIS = harness" PASSA (s5 fim + s6).
- Fatos conferidos: 9.054 / ~191 dias / 2.813 / mediana 4,17 e os 6 valores (artigo l.143, l.205); laço 3, 3, 1 e "bloqueado após o limite" (`logs/laco_stdout.txt`); código do s9 é trecho literal de `harness/verificar_citacoes.py` (l.412–450). Charlotin, CMU (89,7% → "cerca de 90%") batem com fontes.json.
- Erros encontrados:
  1. Fala s2: "Esta barra que cresce é a resposta plausível" — não há barra no slide (herói são 3 cartões).
  2. Fala s5: "a bolinha âmbar que ricocheteia" — hoje é vermelha. Painel `s4-formula`/pseudocódigo (paineis.js:355) mostra ao público "em âmbar"; alt de s2-softmax também.
  3. Fala s12: "evidência, norma, rastro e da própria decisão" — a 4ª condição é "humano".
  4. Fala s7: "ESAG" sem extenso (Escola Superior de Administração e Gerência/UDESC).
  5. Rudin (2019) defende modelos interpretáveis por desenho; "mecanismos verificáveis" é paráfrase forçada. Dizer "em vez de explicar caixas-pretas depois, usar modelos interpretáveis desde o início".
  6. s11: selo "evidência exploratória, Santa Catarina" num slide de estudo futuro; repete o 1º cadeado.

## (D) Correções priorizadas (máx. 12)

| P | Arquivo | Ação |
|---|---|---|
| P0 | `index.html` (s9) / `matrix8.js` | Remover letras latinas e sinais (∃ λ → ∧) da chuva da demo (usar só dígitos 0/1 ou opacidade ≤0,15) e garantir que nada da chuva passe sobre o carimbo/caixas |
| P0 | `index.html` (s9, régua) | Rotular a régua: "Incisos do artigo 37 da Constituição: vão até o 22" e sob XXXIII "33: não existe" |
| P1 | `deck.js` HEROES.s4 | Separar o cadeado da fila das 4 condições (abaixo/à direita da caixa vermelha) e trocar rótulo "Bloqueado" por "Portão fechado" |
| P1 | `deck.js` HEROES.s9 (slide 6) | Caixa: "CALAIS, a arquitetura do artigo, é um harness"; trocar "+"/"=" por setas ou "com"/"forma" |
| P1 | `deck.js` HEROES.s2 | "Exemplo real: cita o inciso 33 do artigo 37, que não existe" |
| P1 | `deck.js` HEROES.s11 + `index.html` | Cabeçalho "Limites declarados" sobre os cadeados; "Busca + modelo" → "Busca com modelo"; selo → "estudo planejado" |
| P1 | `index.html` notas s2, s5, s12 | Tirar "barra que cresce"; "âmbar" → "vermelha"; "da própria decisão" → "humano" |
| P1 | `paineis.js:355` (e alt de s2-softmax) | "em âmbar" → "em vermelho" |
| P1 | `deck.css`/`paineis.js` (R3) | Referências cortadas: rolagem interna ou fonte menor/2 páginas (R3a/R3b) |
| P2 | `deck.js` HEROES.s7 (slide 8) | "9.054 mensagens enviadas"; "o artigo informa só o total"; reduzir rótulos a ≤7; pontos lado a lado em vez de diagonal; padronizar peso dos rótulos do s7 (Citāre) |
| P2 | `index.html` s1/s12 | Crédito da capa (domínio público) e foto um pouco mais clara (brilho 40%) |
| P2 | `slides-padrao\REGRAS.md` | Harmonizar com v3: título 48 px (não 64–72) e rótulo ≥28–32 px (não 40) — ou subir o deck; hoje a regra-mãe reprova o que as specs aprovam. Notas s3 (Rudin) e s7 (ESAG) |

## (E) Veredito

APROVADO COM RESSALVAS. Storyline, honestidade, fatos, contraste e gabarito estão corretos e o auditor passa; mas o slide da demo ainda mostra letras/símbolos soltos e numerais sem legenda (exatamente o que o usuário vetou), e há 3 falas que descrevem elementos que não existem mais (barra, bolinha âmbar, "própria decisão") — corrigir os P0/P1 antes do ensaio.

## (F) Só o usuário pode testar / ensaiar

- Testar: fps do arnês 3D (capa e fecho) e da chuva no notebook da apresentação; janela do apresentador (tecla P: cronômetro, notas, previsto × real) num 2º monitor ou no compartilhamento de janela; roda do mouse e trackpad (1 slide por gesto, sem pular 2); clique em cada herói abre a camada 2 e Esc fecha; tecla R chega às reservas; tela cheia (F) no navegador que vai usar; compartilhar a JANELA na sala virtual e ver se a chuva/3D não travam o vídeo.
- Ensaiar: 3 passagens cronometradas (alvo 8–9 min); a demo em 90 s com a frase "quem corrigiu foi o modelo maior, não o pequeno"; s4 explicando por que só "Rastro" está vermelho; a ponte s5→s6 ("esse arranjo tem um nome"); respostas R1 de cor (quem corrigiu, falso positivo, seis medições).
