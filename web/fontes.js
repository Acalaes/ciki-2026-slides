/* gerado por auditar_deck.py --gerar a partir de fontes.json; não editar à mão */
window.HNV_FONTES = {
 "charlotin": {
  "afirmacao": "2.217 casos de alucinação em tribunais; Brasil 41; EUA 1.514 (25/10/2026)",
  "fonte": "Charlotin, AI Hallucination Cases Database",
  "url": "https://www.damiencharlotin.com/hallucinations/",
  "status": "confirmado",
  "ref": "Charlotin (2026)"
 },
 "dahl": {
  "afirmacao": "LLM geral erra 58–88% em perguntas jurídicas verificáveis",
  "fonte": "Dahl et al. (2024), Large Legal Fictions, versão preprint arXiv (a página do periódico cita 69–88%)",
  "url": "https://arxiv.org/abs/2401.01301",
  "status": "parcial: faixa do preprint",
  "ref": "Dahl et al. (2024, preprint)"
 },
 "magesh": {
  "afirmacao": "Ferramentas jurídicas com RAG erram 17–33%",
  "fonte": "Magesh et al. (2025), Hallucination-Free?, versão preprint arXiv (o periódico cita 'mais de 17%')",
  "url": "https://law.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools",
  "status": "parcial: faixa do preprint",
  "ref": "Magesh et al. (2025, preprint)"
 },
 "rudin": {
  "afirmacao": "Rudin (2019) defende usar modelos interpretáveis desde o início em decisões de alto risco, em vez de explicar caixas-pretas depois; o artigo cita o trabalho para sustentar que a explicação posterior não basta",
  "fonte": "Rudin (2019), Nature Machine Intelligence 1, 206–215, citado no artigo #160 (Discussão)",
  "url": "https://doi.org/10.1038/s42256-019-0048-x",
  "status": "confirmado no artigo",
  "ref": "Rudin (2019)"
 },
 "art-citare": {
  "afirmacao": "Artigo redigido com apoio do Citāre sob supervisão humana; regras de autoria, ano e DOI",
  "fonte": "Artigo #160, declaração de uso de IA",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, declaração de uso de IA"
 },
 "art-logs": {
  "afirmacao": "9.054 registros de envio em cerca de 191 dias; 2.813 sem sucesso; nenhum bloqueio explícito localizado",
  "fonte": "Artigo #160, Seção de resultados (CBMSC)",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, logs do CBMSC"
 },
 "art-nasa": {
  "afirmacao": "Raw NASA-TLX: 6 registros, 2 identificadores, média 6,94, mediana 4,17, faixa 0–15,83",
  "fonte": "Artigo #160, Seção de resultados e Tabela 5",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Tabela 5"
 },
 "arxiv-count": {
  "afirmacao": "≈446 trabalhos em 2026 (até 25/10) com harness ou harnesses no título e agent no resumo (consulta ti:harness AND abs:agent); 3 em 2025, conferidos título a título. O descarte de 2026 foi estimado por amostra de 25 títulos, não título a título; só a forma singular dá 362",
  "fonte": "Contagem do autor na API do arXiv; 2025 conferido título a título, 2026 amostra de 25 títulos",
  "url": "http://export.arxiv.org/api/query?search_query=ti:harness",
  "status": "contagem própria (2026 estimado por amostra)",
  "ref": "Contagem do autor no arXiv (2026)"
 },
 "cmu": {
  "afirmacao": "Modelo pequeno com harness recupera 89,7% do desempenho do modelo grande a 4% do custo",
  "fonte": "Yang, Kästner et al. (2026), Better Harnesses, Smaller Models",
  "url": "https://arxiv.org/abs/2607.08938",
  "status": "preprint (frase do resumo conferida)",
  "ref": "Yang et al. (2026, preprint)"
 },
 "capex": {
  "afirmacao": "Capex de Microsoft, Alphabet, Amazon e Meta: cerca de US$ 410 bi (2025) e cerca de US$ 725 bi (2026, previsão)",
  "fonte": "CNBC (2026) e estimativas de analistas; sem fonte primária por empresa",
  "url": "https://www.cnbc.com/2026/02/06/google-microsoft-meta-amazon-ai-cash.html",
  "status": "parcial: imprensa, valores aproximados",
  "ref": "CNBC (2026)"
 },
 "mit": {
  "afirmacao": "95% das organizações sem retorno mensurável",
  "fonte": "MIT NANDA (2025), The GenAI Divide, relatório preliminar",
  "url": "https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide.aspx",
  "status": "confirmado (relatório preliminar)",
  "ref": "MIT NANDA (2025, preliminar)"
 },
 "art-tab1": {
  "afirmacao": "Tabela 1: seis abordagens (LLM puro, XAI post-hoc, sistema simbólico, RAG, neurossimbólica, arquitetura proposta) comparadas em fundamentação, regras, proveniência, controle humano e limitação",
  "fonte": "Artigo #160, Seção 2.1, Tabela 1 (síntese dos autores, não validada pelos autores citados nem resultado experimental)",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Tabela 1"
 },
 "art-eq": {
  "afirmacao": "Equações 1 a 3: recuperação Rk(q)=TopK s(q,d); admissibilidade At(y)=E(y,R)∧N(y,Ω)∧T(y); liberação L(y)=At(y)∧H(y). Especificação da arquitetura, não garantia experimental",
  "fonte": "Artigo #160, Seção 3.1, Equações 1 a 3",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Equações 1 a 3"
 },
 "art-limpe": {
  "afirmacao": "Tabela 2: princípios LIMPE (legalidade, impessoalidade, moralidade, publicidade, eficiência) ligados a mecanismos e evidências exigidas",
  "fonte": "Artigo #160, Seção 2.2, Tabela 2 (síntese dos autores)",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Tabela 2"
 },
 "prov-dm": {
  "afirmacao": "Registro de proveniência liga entidades, atividades e agentes para reconstruir a trajetória de uma informação",
  "fonte": "Moreau & Missier (Eds.) (2013), PROV-DM: The PROV data model, W3C, citado no artigo #160",
  "url": "https://www.w3.org/TR/prov-dm/",
  "status": "confirmado no artigo",
  "ref": "Moreau & Missier (2013)"
 },
 "art-arq": {
  "afirmacao": "Figura 1: consulta q e coleção D guiam a recuperação; o modelo neural gera y; regras explícitas verificam evidência, norma e rastro; problemas bloqueiam e devolvem para correção; a liberação depende de decisão humana",
  "fonte": "Artigo #160, Seção 3.1, Figura 1 (redesenhada neste painel a partir do texto)",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Figura 1"
 },
 "art-dsr": {
  "afirmacao": "Tabela 3: seis ciclos de Design Science Research (problema, requisitos, design, demonstração, avaliação, refinamento), adaptados de Peffers et al. (2007)",
  "fonte": "Artigo #160, Seção 3, Tabela 3; Peffers et al. (2007), J. Management Information Systems 24(3), 45–77",
  "url": "https://doi.org/10.2753/MIS0742-1222240302",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Tabela 3"
 },
 "ont-citare": {
  "afirmacao": "Ontologia operacional do Citāre: classes (Artigo, Seção, Parágrafo, Afirmação, Citação, Fonte, Arquivo PDF, Trecho, Auditoria, Estado), instâncias de exemplo e relações; quatro estados da fonte",
  "fonte": "Atividade 1 de Desenvolvimento de Ontologias (EGC510010), Ontologia operacional do Citāre, v05, 30/09/2026",
  "url": "C:\\Users\\acala\\Downloads\\UFSC\\Atividade-Ontologia\\UFSC_Atividade-Ontologia_Ontologia-Citare_2026-09-30_v05.pdf",
  "status": "parcial: material didático do autor; instâncias de exemplo são fictícias; as classes intermediárias são didáticas",
  "ref": "Atividade de Ontologia do Citāre (2026)"
 },
 "studer1998": {
  "afirmacao": "Ontologia: especificação explícita e formal de uma conceitualização compartilhada",
  "fonte": "Studer, Benjamins & Fensel (1998), Knowledge engineering: Principles and methods, Data & Knowledge Engineering 25(1–2), 161–197, a partir de Gruber (1993)",
  "url": "https://doi.org/10.1016/S0169-023X(97)00056-6",
  "status": "parcial: referência bibliográfica; trecho literal a reconferir na fonte antes de citar entre aspas",
  "ref": "Studer et al. (1998)"
 },
 "art-escopo": {
  "afirmacao": "Dados quantitativos do CBMSC e da ESAG/UDESC não avaliam o Citāre; avaliação exploratória, descritiva, sem inferência populacional, situada em Santa Catarina; trabalhos futuros: estudo pareado com condições manual, LLM puro, RAG e arquitetura completa, medindo fidelidade de citação, conformidade, qualidade da decisão, tempo, custo, retrabalho e intervenções humanas",
  "fonte": "Artigo #160, Seções 3.2, 4.2 e 5 (escopo, limites e trabalhos futuros)",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160 (Calaes, 2026)"
 },
 "hart1988": {
  "afirmacao": "Raw NASA-TLX: média simples de seis dimensões de carga percebida",
  "fonte": "Hart & Staveland (1988), Development of NASA-TLX, em Hancock & Meshkati (Eds.), Human mental workload, 139–183",
  "url": "https://doi.org/10.1016/S0166-4115(08)62386-9",
  "status": "confirmado no artigo",
  "ref": "Hart & Staveland (1988)"
 },
 "art-tab4": {
  "afirmacao": "Tabela 4: evidência delimitada nos casos CBMSC e ESAG/UDESC",
  "fonte": "Artigo #160, Seção 4.1, Tabela 4",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, Tabela 4"
 },
 "hnv-cena1": {
  "afirmacao": "Cena 1, sem harness: nas 3 rodadas, o modelo local (3B) fez citação inexistente ou com conteúdo falso; art. 37, XXXIII (inexistente) nas rodadas 1 e 2; inciso XXI com conteúdo trocado na rodada 3",
  "fonte": "hnv-demo, logs/cena1/checagem_manual.json (checagem manual em fontes oficiais, 25/10/2026)",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\logs\\cena1\\checagem_manual.json",
  "status": "confirmado nos logs",
  "ref": "Registros da demonstração (2026)"
 },
 "hnv-cena2b": {
  "afirmacao": "Cena 2b, com harness: o hook deu exit 2 (BLOQUEIO) no rascunho do modelo local 3B (qwen2.5:3b) com citação fabricada; um modelo de fronteira (Sonnet, via Claude Code) corrigiu no mesmo harness e o hook deu OK; parecer aguardando aprovação humana. Cena INDUZIDA: o rascunho do 3B foi entregue ao Claude Code. O 3B sozinho, no laço local, não convergiu (3, 3 e 1 bloqueadas)",
  "fonte": "hnv-demo, logs/cena2b/execucao.json (modelo_pedido: sonnet), stream.jsonl e prov-20261025T192704-230.json; README, linha da cena 2b",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\logs\\cena2b\\stream.jsonl",
  "status": "confirmado nos logs",
  "ref": "Registros da demonstração (2026)"
 },
 "hnv-laco": {
  "afirmacao": "Laço local (modelo 3B): citações bloqueadas 3, 3 e 1 nas três rodadas; encerrou como 'bloqueado após o limite de rodadas'; a última bloqueada (Resolução 7/2005) existe, mas está fora da ontologia (bloqueado não é falso)",
  "fonte": "hnv-demo, logs/laco_stdout.txt e logs/laco/",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\logs\\laco_stdout.txt",
  "status": "confirmado nos logs",
  "ref": "Registros da demonstração (2026)"
 },
 "hnv-ontologia": {
  "afirmacao": "Ontologia de fontes da demo: 18 instâncias (3 normas, 12 dispositivos, 1 súmula, 2 precedentes), todas com status 'pendente de validação' pelo especialista",
  "fonte": "hnv-demo, ontologia/fontes.json (textos conferidos nas páginas oficiais em 25/10/2026)",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\ontologia\\fontes.json",
  "status": "pendente de validação",
  "ref": "Ontologia da demonstração (2026)"
 },
 "hnv-readme": {
  "afirmacao": "Mapa peça do harness, camada e papel; fluxo skill, hook, ontologia, PROV e aprovação humana; limitações da demo",
  "fonte": "hnv-demo, README.md",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\README.md",
  "status": "confirmado nos logs",
  "ref": "README da demonstração (2026)"
 },
 "cf-art37": {
  "afirmacao": "O art. 37 da Constituição vai só até o inciso XXII; o inciso XXI trata de licitação",
  "fonte": "Constituição Federal de 1988, art. 37 (Planalto, conferido em 25/10/2026)",
  "url": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art37",
  "status": "confirmado",
  "ref": "Constituição Federal, art. 37"
 },
 "huang2025": {
  "afirmacao": "Revisão sobre alucinação em modelos de linguagem: princípios, taxonomia, desafios e questões em aberto",
  "fonte": "Huang et al. (2025), A survey on hallucination in large language models, ACM Transactions on Information Systems 43(2), 1–55, citado no artigo #160",
  "url": "https://doi.org/10.1145/3703155",
  "status": "confirmado no artigo",
  "ref": "Huang et al. (2025)"
 },
 "softmax": {
  "afirmacao": "softmax(z)_i = e^{z_i} / Σ_j e^{z_j}; P(y_t | y_<t, x) = softmax(W h_t)_{y_t}: o modelo atribui probabilidade a cada próxima palavra",
  "fonte": "Definição matemática padrão da função softmax em modelos de linguagem autorregressivos; exemplo numérico do painel é ilustrativo",
  "url": "https://en.wikipedia.org/wiki/Softmax_function",
  "status": "definição padrão",
  "ref": "Definição padrão da softmax"
 },
 "pseudocodigo": {
  "afirmacao": "Regras admissivel(Y) :- evidencia(Y), norma(Y), rastro(Y). liberada(Y) :- admissivel(Y), humano(Y). e triplas da ontologia, em notação ilustrativa",
  "fonte": "Pseudocódigo do autor, traduzindo as Equações 2 e 3 do artigo #160 e a Atividade de Ontologia v05; não é código executado na demonstração",
  "url": "",
  "status": "ilustrativo, do autor",
  "ref": "Pseudocódigo ilustrativo do autor"
 },
 "bockeler2026": {
  "afirmacao": "Controles do harness se dividem em computacionais (testes, linters; rápidos) e inferenciais (revisão por modelo; mais lentos e custosos); cada tipo pode ser guia (antes da ação) ou sensor (depois da ação)",
  "fonte": "Böckeler, B. (2026), Harness engineering for coding agent users, martinfowler.com, 02/04/2026",
  "url": "https://martinfowler.com/articles/harness-engineering.html",
  "status": "confirmado",
  "ref": "Böckeler (2026)"
 },
 "openai2026": {
  "afirmacao": "Engenharia de harness: construir e operar agentes de código em um mundo centrado em agentes",
  "fonte": "OpenAI (2026), Harness engineering: leveraging Codex in an agent-first world, fev/2026",
  "url": "https://openai.com/index/harness-engineering",
  "status": "parcial: título e data informados pelo autor do deck; a página respondeu 403 na conferência de 27/10/2026",
  "ref": "OpenAI (2026)"
 },
 "galster2026": {
  "afirmacao": "Estudo exploratório de 2.853 repositórios do GitHub sobre mecanismos de configuração de harness em ferramentas de código com agentes",
  "fonte": "Galster et al. (2026), Harness Engineering for Agentic AI Coding Tools: An Exploratory Study, arXiv 2602.14690, 16/02/2026",
  "url": "https://arxiv.org/abs/2602.14690",
  "status": "confirmado",
  "ref": "Galster et al. (2026)"
 },
 "anthropic-context2025": {
  "afirmacao": "Engenharia de contexto: estratégias para curar e manter o melhor conjunto de tokens durante a inferência, além do prompt; processo iterativo",
  "fonte": "Equipe de IA Aplicada da Anthropic (2025), Effective context engineering for AI agents, 29/09/2025",
  "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  "status": "confirmado",
  "ref": "Anthropic (2025)"
 },
 "edge2024": {
  "afirmacao": "GraphRAG: um modelo de linguagem extrai um grafo de entidades dos documentos e pré-calcula resumos de agrupamentos para responder perguntas globais",
  "fonte": "Edge et al. (2024), From Local to Global: A Graph RAG Approach to Query-Focused Summarization, arXiv 2404.16130 (v1 24/04/2024)",
  "url": "https://arxiv.org/abs/2404.16130",
  "status": "confirmado",
  "ref": "Edge et al. (2024)"
 },
 "art-cena1": {
  "afirmacao": "Checagem manual da cena 1: nas 3 rodadas, o modelo local 3B fez citação inexistente ou com conteúdo falso; art. 37, XXXIII (inexistente) nas rodadas 1 e 2; inciso XXI com conteúdo trocado na rodada 3",
  "fonte": "hnv-demo, logs/cena1/checagem_manual.json (conferência manual em fontes oficiais, 25/10/2026)",
  "url": "C:\\Users\\acala\\projetos\\hnv-demo\\logs\\cena1\\checagem_manual.json",
  "status": "confirmado nos logs",
  "ref": "Checagem manual da cena 1 (2026)"
 },
 "kroll2017": {
  "afirmacao": "Pesquisa sobre algoritmos prestáveis de contas examina mecanismos institucionais e técnicos para escrutinar decisões automatizadas",
  "fonte": "Kroll et al. (2017), Accountable algorithms, University of Pennsylvania Law Review 165(3), 633–705, citado no artigo #160 (Introdução)",
  "url": "https://pennlawreview.com/2017/02/23/accountable-algorithms/",
  "status": "confirmado no artigo",
  "ref": "Kroll et al. (2017)"
 },
 "busuioc2021": {
  "afirmacao": "A explicabilidade ajuda a compreender, mas não substitui evidência nem responsabilização; em decisões estatais, sustenta justificação e contestação",
  "fonte": "Busuioc (2021), Accountable artificial intelligence: Holding algorithms to account, Public Administration Review 81(5), 825–836, citado no artigo #160 (Seções 1 e 2)",
  "url": "https://doi.org/10.1111/puar.13293",
  "status": "confirmado no artigo",
  "ref": "Busuioc (2021)"
 },
 "garcez2023": {
  "afirmacao": "A IA neurossimbólica busca combinar aprendizado estatístico e conhecimento explícito, mas o rótulo não dispensa demonstrar os mecanismos efetivamente implementados",
  "fonte": "Garcez & Lamb (2023), Neurosymbolic AI: The 3rd wave, Artificial Intelligence Review 56(11), 12387–12406, citado no artigo #160 (Introdução e Seção 2.1)",
  "url": "https://doi.org/10.1007/s10462-023-10448-w",
  "status": "confirmado no artigo",
  "ref": "Garcez & Lamb (2023)"
 },
 "art-futuro": {
  "afirmacao": "Trabalhos futuros: estudos pareados prospectivos, com participantes caracterizados, comparando manual, LLM puro, RAG e arquitetura completa em fidelidade de citação, conformidade, qualidade da decisão, tempo, custo, retrabalho e intervenções humanas; a transferência a setores regulados exige adaptação e validação",
  "fonte": "Artigo #160, Seção 5 (Considerações finais) e Seção 4.2",
  "url": "C:\\Users\\acala\\projetos\\ciki-2026-artigo-160\\artigo-final.md",
  "status": "confirmado no artigo",
  "ref": "Artigo #160, trabalhos futuros"
 }
};
