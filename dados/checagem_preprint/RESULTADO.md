# Checagem de precisão e de revisão por pares: "harness" em preprints do arXiv (28/10/2026)

**Base:** OpenAlex (aberta), preprints do arXiv, 01/01 a 25/10/2026; título com "harness/harnesses" e "agent" no título ou resumo.
**Por que OpenAlex:** a API do arXiv devolveu erro 429 (limite de uso) em todas as tentativas; o mesmo recorte foi refeito na OpenAlex (script `coletar_openalex.py`, semente 42). O arXiv (`coletar.py`) fica para repetir depois.

| Etapa (PRISMA simplificado) | n |
|---|---|
| Identificados (consulta, arXiv, 2026 até 25/10) | 523 |
| Título com a palavra "harness/harnesses" (exclui "harnessing") | 467 |
| Amostra aleatória (semente 42) | 50 |
| Relevantes (harness = arcabouço de agente de IA) | 47 (94%) |

- Precisão 94%; intervalo de Wilson 95%: 83,8% a 97,9%. Estimativa do universo: ≈ 439 (391 a 457) trabalhos sobre harness de agente.
- Falsos positivos (3): nº 15 (verbo "to harness"), nº 9 (framework de aceleração de robótica) e nº 32 ("evaluation harness", sentido de teste). Tabela em `classificacao_amostra50.csv`.
- Classificação feita por um único avaliador (Claude, por título e início do resumo), sem segunda leitura: limite declarado. Recomenda-se o autor reler os 50 itens.
- Contagem OpenAlex (467) difere da contagem direta no arXiv (446): bases e indexação diferentes; a ordem de grandeza se mantém.

## Revisão por pares
- Dos 467, só 4 (0,9%) já aparecem com versão publicada: 2 em conferências com revisão por pares (EuroMLSys; IEEE/ACM ASE) e 2 marcadas "publishedVersion" sem nome de veículo.
- Citações: máximo 2 (OpenAlex), 13 trabalhos com ≥ 1 citação. Os artigos são recentes (a maioria de jul/out 2026); citação e publicação em revista ainda não aparecem. "Mais citados" não discrimina nada nesta base.
- Crescimento mensal (por data de postagem): jan 2, fev 3, mar 8, abr 17, mai 41, jun 47, jul 54, ago 68, set 114, out (até 25) 113.

## Como dizer
"Em 2026 há centenas de preprints sobre harness de agentes (amostra: 94% relevantes). Quase nenhum já passou por revisão por pares, porque o campo é novo; trato como sinal de adoção, não de qualidade."
