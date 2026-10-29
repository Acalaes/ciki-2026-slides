# Auditável por construção — slides do CIKI 2026

Apresentação interativa do artigo **#160** *"Neurosymbolic AI and Knowledge Engineering: Beyond Hallucinations and Auditable Decisions in the Intelligent State"*, apresentado em 28/10/2026 no CIKI–ICKM–GFIC 2026.

**Ver no ar:** https://ciki160-hnv-7k3q.acalaes.workers.dev (abre no navegador; melhor no computador)

## O que é
Um site estático (HTML, CSS e JavaScript, sem servidor) com os slides, animações, um cenário em 3D e painéis que abrem em camadas (do resumo ao detalhe). Tecla **P** abre a janela do apresentador.

## Como rodar no seu computador
```
cd web
python -m http.server 8765 --bind 127.0.0.1
```
Depois abra http://127.0.0.1:8765. (No Windows há também `web/ABRIR_APRESENTACAO.cmd`.)

## Como é publicado
Cada `push` na branch `master` publica sozinho na Cloudflare (Worker com arquivos estáticos). A configuração está em `wrangler.jsonc`; o que não vai ao ar (notas, scripts, testes) está em `web/.assetsignore`.

## Estrutura
- `web/` — o site: `index.html`, `deck.js`, `paineis.js`, `kit.js`, estilos, `fonts/`, `lib/` (three.js), `img/`, `demo/`.
- `deck/` — fonte dos slides.
- `dados/` — números conferidos e dados dos gráficos.

## Créditos e licenças
- As fotos vêm do Wikimedia Commons, com licenças abertas (CC0, CC BY, CC BY-SA). Autor, título, licença e link de cada uma estão em `web/img/creditos.json`.
- Ilustrações e gráficos: autoria própria.
- O código e o texto da apresentação são de Alexandre Pinto Calaes.

## Autor
Alexandre Pinto Calaes — doutorando no PPGEGC/UFSC (Programa de Pós-Graduação em Engenharia e Gestão do Conhecimento).
