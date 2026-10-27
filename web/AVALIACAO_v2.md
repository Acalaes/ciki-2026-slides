# Avaliação independente do deck v2 (CIKI 2026, artigo #160): 27/10/2026

Avaliador: não participou da construção. Arquivos lidos: PLANO_v2.md, DIRECAO_VISUAL_v2b.md, index.html, trechos de deck.js/deck.css/paineis.js/fontes.json, artigo-final.md, hnv-demo (README, logs/cena1, logs/prov-*.json, harness/verificar_citacoes.py), Atividade de Ontologia v05 (PDF). Testes que rodei: `auditar_deck.py` (saída "OK: auditoria sem falhas"), autoteste de interação `?selftest=1` no Chrome headless (16/16 OK), capturas novas 1920×1080 dos slides 1, 4, 7, 8, 10 e 12 (no scratchpad), recontagem do arXiv a partir do `arx.json` salvo pelo executor.

## A) Checklist do plano (1–15)

| # | Veredito | Evidência (1 linha) |
|---|---|---|
| 1 | PASSA (no limite) | 12 slides principais; a soma dos data-t dá exatamente 570 s (index.html:16–326). Não sobra folga. |
| 2 | PASSA com ressalva | `.l1` tem ≤5 palavras. Ressalva: s1 e s12 somam E, N, T, H (4 letras em `.enth.l1`) e s4 soma "bloqueado"; isso só passa se letra/símbolo não contar como palavra. |
| 3 | NÃO TESTADO | getComputedStyle não foi medido. Visualmente, o selo itálico do s8 (≈30 px) fica sobre a chuva Matrix e lê mal (captura s8). |
| 4 | PASSA | selftest: "todos os data-open têm conteúdo"; cada principal tem ≥2 clicáveis (s3 e s11 têm exatamente 2). |
| 5 | PASSA com ressalva | O auditor sai 0. "exit 2" e "E∧N∧T = F∧F∧F" (index.html:234–235) não têm data-src: falta `data-src="hnv-cena2b"`. |
| 6 | PASSA | O auditor checou os selos de dahl, magesh, arxiv-count, capex, mit, ont-citare etc. |
| 7 | PASSA com ressalva | Âmbar só via .err/.block/.late (deck.css:4; matrix8.css:6,12). Ressalva: no s10 estático, o anel "hooks" fica âmbar o tempo todo (`.err.flash`), e no s4 "bloqueado" sai BRANCO apesar de ter `.block` (captura s4). |
| 8 | PASSA | XXXIII "só rodadas 1 e 2" está no painel s8-regua (paineis.js:735); 2.813 em cinza e "não são bloqueios" (index.html:207); "não avaliam o Citāre" (index.html:178); SV13 não é afirmada nos slides. Ver fato NOVO em C1. |
| 9 | PASSA | Zero "determinístic"; XAI só no painel s3-tab1; nenhum título de tese; "governança" só como descrição do CALAIS (vem do artigo). |
| 10 | PASSA | selftest 16/16: 1 entalhe = 1 avanço; 10 entalhes em 1 s = 1 avanço; passos do s8; painel prende a roda; Esc 3→2; clique direito volta. |
| 11 | PASSA | Nenhum http(s) em src/href/@import; three.min.js e fontes são locais. |
| 12 | PASSA com ressalva | qa/v2_print.pdf tem 73 páginas, mas foi gerado às 02:59, antes da última edição do index.html (03:14). Regerar. |
| 13 | PASSA com ressalva | Capturas nas 2 resoluções existem, mas estão DESATUALIZADAS (v2_s12 mostra outro e-mail que o do HTML). Fotos só nos s6/s7, com crédito visível. |
| 14 | NÃO TESTÁVEL | O código BroadcastChannel existe (deck.js:674–703), mas não exercitei duas janelas. |
| 15 | NÃO TESTÁVEL | O headless usa swiftshader; não dá para medir fps real. Fazer no notebook da apresentação. |

## B) Storyline e jornada do herói

- Frase única: "Quem assina uma decisão apoiada por IA precisa provar cada afirmação; a auditabilidade tem de estar na arquitetura (E∧N∧T∧H), não numa explicação posterior; já funciona em casos reais, e o harness vertical é a hipótese para levá-la a outros domínios". CONFERE com a sequência 1→12. O fecho em espelho (s12) funciona.
- Jornada clara e simples: chamado (s2) → falsa saída (s3) → ferramenta (s4) → travessia (s5) → provas (s6, s7) → provação (s8) → elixir (s10) → retorno honesto (s11) → fecho (s12).
- Onde o eixo se dispersa:
  1. **s9 "Agente = modelo + harness"** chega como "recompensa", mas é contexto de literatura e mercado. Além disso, **o artigo #160 não usa a palavra "harness" nenhuma vez** (grep = 0). Sem uma ponte explícita do tipo "a arquitetura CALAIS do artigo é o que a engenharia de agentes passou a chamar de harness", a banca pode achar que a palestra apresenta outro trabalho. Recomendo mover o s9 para logo depois do s5 (como "o nome do que acabamos de ver") ou pôr a ponte na fala.
  2. O **diagrama de Venn do s10** (Harness / Grafo de conhecimento / Laço) cria uma segunda mensagem; o próprio painel admite que "Laço" não é disciplina. Cortar do slide e manter no painel.
  3. O **chip de contexto do s9** (capex de US$ 725 bi; "MIT: 95% sem retorno") puxa para o hype e sai do eixo. Deixar só na reserva.
- Tempo: data-t = 570 s, mas as falas somam **368 palavras ≈ 2 min 38 s** a 140 palavras/min. As notas são deixas, não roteiro: s3, s4 e s5 têm cerca de 10 s de fala para 45–50 s de slide, e o resto será improviso, o que costuma estourar o tempo. Ação: escrever o roteiro completo com ≈1.250 palavras (≈9 min) e baixar a meta para ≈540 s, deixando 30 s de folga. Cortes, se atrasar: s7 para 30 s; s9 para 30 s (sem o chip de contexto); s11 fundido no s12 (o selo "exploratório; HNV é hipótese" já está no s11 e pode ir para o rodapé do s12).

## C) Sustentação e fatos

1. **[NOVO, P0] Slide 8: quem corrigiu não foi o modelo 3B.** No README (linha 63) e em logs/cena2b/execucao.json, a cena 2b foi rodada com `"modelo_pedido": "sonnet"`: um modelo de fronteira na nuvem, via Claude Code, recebeu o rascunho alucinado do 3B. O selo do s8 diz "modelo local 3B" ao lado de "Corrige." (index.html:245), e a fala diz "o modelo corrigiu" (index.html:246). Quem lê entende que o 3B se corrigiu. O 3B NÃO convergiu: laço 3→3→1, não liberado. O painel s8-portao fala que a cena foi "induzida", mas não diz qual modelo corrigiu. Esse é o ponto mais contestável do deck.
2. **E∧N∧T = F∧F∧F está CORRETO; o plano é que estava errado.** O bloqueio do rascunho com XXXIII (prov-20261025T192654-721.json, cena 2b) e os das cenas 1 (192528-*) têm evidencia, norma e rastreabilidade = false. F∧V∧V só aparece no laço, rodadas 2 e 3 (193045-587, 193437-699). Motivo: norma e rastro só contam citações que passaram (verificar_citacoes.py:416–418). Não "corrigir" para F∧V∧V. Vale dizer na fala que N e T caem junto porque nenhuma citação passou.
3. XXXIII: só aparece nas rodadas 1 e 2 (checagem_manual.json); o deck respeita. O s2 junta "Lei 8.112/1990" e "ADI 2.958" (rodada 3, reais mas sem base ou não comprovadas) com XXXIII (rodadas 1 e 2). Só o XXXIII ganha risco; os dois primeiros parecem corretos. Marcar em cinza tracejado ou trocar por "Decreto 4.653/2002" (atribuição falsa).
4. SV13: o "nunca citou a SV13" está conferido (checagem_manual.json:48) e não aparece nos slides; tudo certo.
5. Slide 6 (Citāre): as classes do slide (Artigo, Seção, Parágrafo, Afirmação, Citação, Fonte, Trecho, Auditoria, evidence_ready) conferem com a Atividade de Ontologia v05 (o PDF também tem Arquivo PDF e Estado). Ressalvas: (a) evidence_ready é um valor da classe Estado, não uma classe; rotular "Estado: evidence_ready"; (b) as setas do slide formam um fluxo sem rótulo, não relações da ontologia; (c) o artigo diz que o Citāre foi usado "to support drafting and citation verification" e que tudo foi "reviewed and approved by the author" (artigo-final.md:235). "Citāre conferiu este artigo" exagera um pouco; preferir "conferido com o Citāre" (a fala já diz "com revisão humana").
6. **Slide 7 (calendário, P0):** são 191 células iguais (deck.js:541), sem nenhum dado diário. O painel admite ("Calendário sem dado por dia", paineis.js:648), mas o SLIDE não diz isso, e o desenho de "calendário de calor" sugere dado diário que não existe. Além disso, de 28/01 a 07/08 são 192 dias contando as duas pontas; o artigo diz "approximately 191". Usar "~191 dias". A fórmula aparece como "TLX. = …", com um ponto sobrando; o certo é "TLX_bruto = (1/6) Σ s_i". A tabelinha CBMSC/ESAG está vazia.
7. NASA-TLX: "tarefas, não pessoas; 5 da mesma conta" está correto no painel (paineis.js:678–679); os pontos no slide estão nas posições certas (0; 1,67; 3,33; 5; 15,83 ×2; mediana 4,17).
8. **Slide 9 (446 vs 3): REPRODUZI.** Com o `arx.json` (consulta `ti:harness AND abs:agent`): em 2025, "harness(es)" no título = 4, e 3 depois do filtro de sentido; em 2026 (até 22/10), "harness(es)" = 446. A palavra singular exata dá 362 em 2026. Ressalvas de método: (a) o painel diz "só a palavra exata", mas 446 inclui o plural "harnesses"; (b) em 2025 o filtro de sentido tirou 1 de 4, e em 2026 se supôs 0% de descarte com base numa amostra de 25; (c) o resumo tem que conter "agent", o que só aparece no rodapé do painel. Dizer "≈446" e "título com harness, resumo com agent".
9. Slide 10: "hipótese" está no carimbo, no selo do s11 e na fala; não há título de tese. OK.
10. "alucina": aparece no s2 e no s8 (rótulo "Alucina."), sustentado por Huang et al. 2025 (artigo-final.md:251). Zero "determinístico"; "inventa" não aparece fora do demo\ (o auditor confere).
11. CMU 89,7% / 4%: confere com a frase do resumo citada no painel, mas o status em fontes.json:54 está "confirmado" e devia ser "preprint". A fala devia dizer "num conjunto de tarefas do estudo".

## D) Risco de hype e de prestígio: perguntas prováveis e respostas prontas

1. **"Quem corrigiu o parecer foi o modelo pequeno?"** Não. O modelo local de 3B errou; um modelo de fronteira, dentro do mesmo harness, corrigiu. Quando o próprio 3B tentou corrigir, em três rodadas, não convergiu, e o harness não liberou. O ponto é esse: a garantia vem da arquitetura, não do modelo.
2. **"Seu artigo não fala em harness. O que você está apresentando?"** O artigo propõe a arquitetura CALAIS: evidência, norma, rastro e humano, verificados antes da liberação. Em 2026 a engenharia de agentes deu a esse lugar o nome de harness. A demo mostra a mesma arquitetura com peças de harness, e o HNV é a hipótese de agenda, ainda não testada.
3. **"Isso não é só RAG?"** RAG recupera, mas não confere. Aqui um hook confere cada citação contra a ontologia e devolve o parecer quando não passa. Em preprints, RAG jurídico ainda erra 17–33%.
4. **"Bloquear o que está fora da ontologia não engessa e gera falso positivo?"** Gera, e isso é declarado: bloqueado não quer dizer falso (a Resolução 7/2005 existe, mas está fora da ontologia). O custo é manter a ontologia com o especialista, e as 18 fontes ainda aguardam validação.
5. **"Seis registros NASA-TLX provam alguma coisa?"** Não provam ganho. São tarefas, não pessoas, e cinco vêm da mesma conta. Mostram os componentes funcionando juntos; para medir ganho, o próximo passo é o estudo pareado em quatro condições.

Pontos que ainda soam como hype: o contador de "446" sem o método falado; "90% a 4% do custo" sem dizer o contexto; o chip capex/MIT; a frase "engenharia do conhecimento volta ao centro da IA" (aceitável por vir depois de "hipótese").

## E) Forma

- **Capa (s1/s12): não lê como "harness".** Todos os laços são círculos máximos centrados na origem (deck.js:379–380: `loops` com raio R e eixos a/b), mais a esfera externa fina. O resultado é uma esfera armilar ou um átomo. Correção concreta:
  1. trocar os círculos máximos por percursos de arnês, não planares: duas alças de ombro em "X" passando por cima do núcleo (curvas de Bézier 3D de (−0,9; 1,4; 0,5) a (0,9; −0,2; −0,5) e espelhada), um cinto horizontal achatado (elipse em y = −0,35, escala z 0,8) e duas alças de perna abaixo (elipses inclinadas 25°, centradas em x = ±0,6, y = −1,2);
  2. usar seção de FITA, não tubo: `ExtrudeGeometry` de um retângulo de 0,26 × 0,035 ao longo da `CatmullRomCurve3` (ou `TubeGeometry` com radialSegments = 2 e escala lateral), material fosco azul-aço com costura tracejada (LineDashedMaterial) acompanhando a borda;
  3. fivelas como `BoxGeometry` com furo (duas caixas e uma barra) nos cruzamentos ombro × cinto, que viram os pontos E e N; argola em D na frente do cinto (`TorusGeometry` de arco π + `CylinderGeometry` reto), que vira H (aprovação humana), com um mosquetão ligado a um cabo que sobe para fora do quadro, ou seja, ancoragem;
  4. remover a esfera e os anéis finos externos (`HG.rings`, deck.js:423), que são o que mais lembra uma armilar;
  5. núcleo: rede em camadas (3 a 4 planos de nós), não esfera, para ler como "modelo neural".
  Alternativa mais barata: um "chicote elétrico" (wiring harness): feixe de cabos com conectores rotulados E/N/T/H. Para engenheiros, é imediato.
- **s8:** a chuva Matrix passa por trás do código, de "exit 2 · BLOQUEIO" (aparece um glifo em cima do "Q") e do selo. Pôr um fundo `rgba(0,0,0,.82)` em `.code`, no grupo `.st2` e no `.selo` do s8 (matrix8.css). O raio (index.html:232) atravessa a folha corrigida e parece que o parecer corrigido foi bloqueado: redesenhar o raio para cair só no portão (x ≤ 1080) ou esconder no passo 3. "XXXIII" encosta no último traço; deixar um vão para mostrar que de XXIII a XXXIII nada existe.
- **s4:** "bloqueado" sai branco (a especificidade de `.l1` vence `.block`). Usar `.s4 .blk.block{color:var(--a)}` em deck.css.
- **s7:** o calendário uniforme é pseudo-dado (ver C6); trocar por uma régua do tempo 28/01→07/08 com a barra 9.054/2.813, ou rotular "ilustrativo: o artigo informa só o total". A régua NASA-TLX não diz o que é no slide; pôr "NASA-TLX (6 tarefas)" sobre ela.
- **s10:** o anel âmbar fixo no estático/PDF fica parecendo "hooks = erro"; no modo static, deixar o anel gelo e só um pequeno ponto âmbar no contato. Tirar o Venn.
- **s2:** EUA/Brasil e as citações de 44 px estão bons; a fórmula softmax pequena é decorativa, aceitável.
- **s15 (reserva R3):** sobreposição de texto na linha "arxiv-count" da lista de referências (folha_slides_2).

## F) Correções priorizadas

| # | P | Arquivo | Ação |
|---|---|---|---|
| 1 | P0 | index.html:245–246; fontes.json (hnv-cena2b) | Dizer quem corrigiu. Selo: "erro: modelo local 3B · correção: modelo de fronteira no mesmo harness (cena induzida) · o 3B sozinho: 3, 3, 1 bloqueadas, não liberado". Fala: "um modelo maior, dentro do mesmo harness, corrigiu". Pôr "Sonnet via Claude Code" no painel s8-portao e em fontes.json. |
| 2 | P0 | index.html:189, 207; deck.js:541 | Calendário: substituir por régua do período ou rotular "ilustrativo: só total do período"; "~191 dias". |
| 3 | P1 | index.html:269 (notas s9) ou ordem dos slides | Ponte explícita "CALAIS = harness vertical" (o artigo não usa "harness"); de preferência, mover o s9 para depois do s5. |
| 4 | P1 | index.html (todas as `<aside class="notes">`) | Roteiro completo de ≈1.250 palavras; ensaio cronometrado; meta de 540 s. |
| 5 | P1 | deck.js:379–433 | Capa: geometria de arnês (fitas, fivelas, argola em D, sem anéis/esfera externos), conforme a seção E. Regerar img/capa_harness3d.png. |
| 6 | P1 | matrix8.css; index.html:232 | s8: fundo escuro atrás do código, do portão e do selo; raio sem cruzar a folha corrigida; `data-src="hnv-cena2b"` em "exit 2" e "F∧F∧F". |
| 7 | P1 | deck.css | s4: "bloqueado" em âmbar (`.s4 .blk.block{color:var(--a)}`). |
| 8 | P1 | index.html:299–305; deck.css (s10 static) | s10: tirar o Venn do slide (fica no painel); anel "hooks" em gelo no estático. |
| 9 | P1 | paineis.js:819–826; index.html:267, 269 | Método do arXiv: "harness/harnesses no título e agent no resumo"; "≈446"; dizer que a taxa de descarte de 2026 foi estimada por amostra de 25. |
| 10 | P1 | qa_v2.py (slides, paineis, print) | Regerar capturas, folhas e PDF depois das correções; as atuais estão desatualizadas. |
| 11 | P2 | index.html:263–265 | Tirar o chip capex/MIT do s9 (passar para a reserva). |
| 12 | P2 | index.html:42–43 | s2: marcar "Lei 8.112/1990" e "ADI 2.958" como "sem base" (cinza tracejado) ou trocar por "Decreto 4.653/2002". |
| 13 | P2 | index.html:148, 168 | s6: "conferido com o Citāre"; rótulo "Estado: evidence_ready". |
| 14 | P2 | deck.js (fórmula s7); index.html:200–205 | "TLX_bruto = (1/6) Σ s_i"; preencher ●/○ na mini-tabela CBMSC/ESAG ou removê-la. |
| 15 | P2 | fontes.json:54 | Status do cmu: "preprint (frase do resumo conferida)". |

## Veredito

**APROVADO COM RESSALVAS.** A história está clara, honesta e bem sustentada nos logs, no artigo e na ontologia v05; a interação passou em todos os testes, e o F∧F∧F do slide 8 confere com o log real. Mas os dois P0 (quem corrigiu na demo e o calendário que sugere dados diários) precisam sair antes da apresentação, porque atingem justamente a credibilidade que é a tese da fala.
