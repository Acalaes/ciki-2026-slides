# FUNDO NEUTRO v3g (27/10/2026): SUBSTITUI as regras de cor de fundo do REF_REPLIT_v3e, DESIGN_CLEAN_v3 e FUNDOS_v3d

Pedido do usuário: "tirar o fundo azul e deixá-lo apenas nos casos em que tiver imagem, com sombreado, para que a imagem não atrapalhe a leitura do que tiver na camada 1."

## Regras
1. Slide SEM foto: fundo NEUTRO escuro, sem azul: gradiente #0b0c10 → #14161c (grafite quase preto). Cartões #15181f, bordas rgba(255,255,255,.08), cinzas neutros (zinc: #a1a1aa texto secundário, #71717a rótulos), texto principal #f4f4f5. O fundo azul-marinho (#0a1628, #0d1f3c, #0f1f38) e o gradiente azul saem de TODOS os slides, painéis, lightbox, modais, faixa lateral e rodapé.
2. Slide COM foto: o tom azul/teal existe só na camada da imagem (tint #0a1b4a em mix-blend-mode: color, ou duotone), nunca no fundo do slide. Sobre a foto, SOMBREADO obrigatório para a leitura: (a) véu em gradiente da esquerda (onde ficam título, frase-âncora e rótulos) para a direita: rgba(8,10,14,.92) → .75 → .45; (b) vinheta nas bordas (radial); (c) faixa escura no topo (título) e na base (rodapé) de 140 px (gradiente .85 → 0); (d) text-shadow nos textos da camada 1 (0 2px 12px rgba(0,0,0,.8)). A foto continua RECONHECÍVEL (blur 0–3 px, brilho 40–50%).
3. Teste de leitura (auditor/QA): para cada slide com foto, medir na captura a luminância média por trás do título, da frase-âncora e dos rótulos do herói: contraste do texto (gelo/branco) contra o fundo medido ≥ 7:1 no título e ≥ 4.5:1 nos demais; falhar e corrigir o véu se não atingir.
4. Cores de destaque mantidas (REF_REPLIT_v3e): teal #14b8a6/#5eead4 como acento; branco com glow teal na mensagem principal; vermelho #f87171 só para erro/bloqueio; verde só no slide 8. O teal é acento (linhas, ícones, números), não fundo.
5. Faixa lateral, barras de 8 px, logo e paginação ficam sobre o fundo neutro (ou sobre o véu, nos slides com foto).
