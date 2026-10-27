# TÍTULOS E BLOCOS v3f (27/10/2026): SUBSTITUI os títulos e blocos do LAYOUT_FIXO_v3b e do REF_REPLIT_v3e

Feedback do usuário: "blocos e títulos devem ficar claros nos slides; títulos não podem ter fórmulas nem ser incompreensíveis; devem dar a clareza exata e imediata do que se verá no slide."

## Regras do título (todo slide e todo painel)
1. Título = a MENSAGEM do slide numa frase simples em português (título de ação), que o espectador entende em 3 segundos sem conhecer o artigo.
2. PROIBIDO no título: fórmulas, símbolos (∧ + = → ≈), siglas e abreviaturas (E N T H, HNV, CBMSC, RAG, PROV, TLX), nomes técnicos sem explicação, "X e Y" genérico ("Neural e simbólico"). Nomes próprios só se forem o assunto (Citāre) e vierem com o que fazem.
3. Uma linha só, ≤ 45 caracteres, caixa-alta (padrão Replit); se passar, REESCREVA mais curto (não quebre nem encolha abaixo de 48 px).
4. Abaixo do título, a "pergunta-guia" em itálico entre parênteses (≤ 10 palavras, 22–28 px) responde "o que eu vou ver aqui?" (padrão do usuário no Replit).
5. Painéis (camada 2): título ≤ 6 palavras dizendo o que o diagrama mostra ("As quatro condições", "Como o sistema decide", "Por que o modelo alucina"); nunca fórmula nem sigla no título.

## Blocos (faixa lateral e cabeçalho): palavra inteira e óbvia
INTRODUÇÃO (slide 1) · PROBLEMA (2, 3) · SOLUÇÃO (4, 5, 6) · PROVAS (7, 8, 9) · FUTURO (10, 11) · CONCLUSÃO (12) · RESERVA. (Substituem Abertura/Fronteira/Fecho.)

## Títulos e perguntas-guia (slides principais; ordem v3)
1 IA AUDITÁVEL DESDE O PROJETO — (como confiar numa decisão apoiada por IA?) — subtítulo: Auditabilidade por construção · IA neurossimbólica
2 A IA ALUCINA: CITA FONTES QUE NÃO EXISTEM — (o que acontece quando ninguém confere?)
3 EXPLICAR DEPOIS NÃO EVITA O ERRO — (por que explicar o modelo não basta?)
4 QUATRO CONDIÇÕES PARA SER AUDITÁVEL — (o que a IA precisa ter antes de decidir?)
5 A IA PROPÕE E AS REGRAS CONFEREM — (como o sistema funciona, passo a passo?)
6 HARNESS: AS REGRAS EM VOLTA DO MODELO — (como esse arranjo é chamado hoje?)
7 PROVA 1: O CITĀRE CONFERE CITAÇÕES — (funciona na escrita acadêmica?)
8 PROVA 2: AUTOMAÇÃO REAL NOS BOMBEIROS — (e numa operação pública de verdade?)
9 PROVA 3: O SISTEMA BARRA A CITAÇÃO FALSA — (o que acontece quando a IA erra?)
10 HIPÓTESE: HARNESS COM REGRAS DE ESPECIALISTAS — (isso vale para qualquer área?)
11 PRÓXIMO PASSO: COMPARAR QUATRO MÉTODOS — (como vamos medir o ganho?)
12 CONCLUSÃO: AUDITAR ANTES DE ASSINAR — (o que levar daqui?)
(Se um título passar de 45 caracteres no teste, encurte o texto mantendo o sentido; registre a versão final em fontes de verdade no próprio index.html.)

## Verificação (auditor e teste cego)
O auditor falha se: título com símbolo/sigla/fórmula; título > 45 caracteres; bloco fora da lista; título quebrando em 2 linhas na captura. No teste cego, o modelo de visão deve conseguir dizer, só pelo título e pelo bloco, o que o slide mostra.
