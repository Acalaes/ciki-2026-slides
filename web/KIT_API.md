# KIT SVG (kit.js + kit.css): API combinada com o B1

Autor: B3. Arquivos: `web\kit.js` (funções puras que devolvem STRINGS SVG) e `web\kit.css` (estilos; escopo `.k`).
Carregar nesta ordem: `fonts\fonts.css`, `kit.css`, `kit.js`, depois `paineis.css`, `fontes.js`, `paineis.js`.
Global: `window.HNV_KIT` (alias `K`). Nenhuma função toca o DOM, exceto `K.step` e `K.play`.

## Regras visuais (DESIGN_CLEAN_v3)
Traço 2 px, cantos 8 px, uma tipografia (Archivo), 4 cores: fundo #070D1A (transparente no kit), gelo #E6EEFB, névoa #6F8FC7, âmbar #F2A541 só em erro/bloqueio (classes `err`, `block`, `late`). Preenchimentos são o mesmo gelo/névoa com alfa. Sem ciano, sem gradiente.

## Opções comuns (objeto `o`)
- `step` (número): ordem de construção. Vira `data-step="n"` e `style="--step:n"`.
- `tone`: `'gelo'` (padrão) | `'nevoa'` | `'err'` | `'block'` | `'late'` (os três últimos são âmbar).
- `fill`: `true` (alfa do gelo) | `'solid'` (gelo cheio, texto escuro: decisão humana).
- Coordenadas em unidades do viewBox; as funções não escalam nada.

## Funções
| Função | Opções principais | Resultado |
|---|---|---|
| `K.svg(w, h, inner, label)` | largura e altura do viewBox, conteúdo, `aria-label` | `<svg class="k">` com marcadores de seta |
| `K.box(o)` | `x y w h t s size` (`t` texto ou array de linhas; `s` linha secundária em névoa) | caixa de cantos 8 px com rótulo |
| `K.lane(o)` | `x y w h t` | raia: faixa translúcida com rótulo à esquerda |
| `K.arrow(o)` | `pts:[[x,y],...] dash t tx ty` | seta de linha poligonal (`t` = rótulo opcional em `tx,ty`) |
| `K.node(o)` | `cx cy r t size` | círculo com rótulo central |
| `K.gate(o)` | `x y w h ins:[rótulos] out` | porta AND com entradas e saída |
| `K.formula(o)` | `x y w h t size` | fórmula (foreignObject); `t` usa `K.m` |
| `K.bar(o)` | `x y w h v max v0 t val lw` | barra horizontal (faixa se `v0`), rótulo à esquerda, valor à direita |
| `K.dot(o)` | `cx cy r t hollow` | ponto; `t` à direita |
| `K.ring(o)` | `cx cy r v t dash` | círculo (v=100) ou arco de v% (0 a 100) |
| `K.text(o)` | `x y t size anchor weight` | texto solto |
| `K.icon(name, o)` | `name`: `lock check doc person db link clock`; `x y s` | ícone de traço fino |
| `K.m(str)` | `x_{i}`, `x^2`, `{num\|den}` | HTML de fórmula (usado por `K.formula`) |
| `K.group(inner, o)` | `step`, `tone` | agrupa elementos sob um `step` |

## Animação de construção
1. **Automática** (painéis, camada 2): o SVG tem `class="k"`; cada elemento com `data-step` surge em sequência (atraso = `--step` × 0,45 s) e as setas se desenham. `prefers-reduced-motion` e `.static` mostram tudo pronto.
2. **Manual** (slides do B1): `K.step(svgEl, n)` liga o modo controlado: elementos com `data-step ≤ n` ficam visíveis; o de `data-step == n` fica em gelo, os anteriores em névoa; os posteriores ficam ocultos. `K.step(svgEl, Infinity)` mostra tudo; `K.play(svgEl)` volta ao automático. `K.steps(svgEl)` devolve o maior `data-step`.

## Exemplo
```js
const s = HNV_KIT;
const svg = s.svg(900, 200,
  s.box({x:0,y:60,w:240,h:80,t:'Gerar',s:'modelo',step:1}) +
  s.arrow({pts:[[240,100],[330,100]],step:2}) +
  s.box({x:330,y:60,w:240,h:80,t:'Verificar',tone:'gelo',fill:true,step:3}) +
  s.arrow({pts:[[570,100],[660,100]],tone:'block',step:4,t:'bloqueia',tx:615,ty:80}) +
  s.box({x:660,y:60,w:240,h:80,t:'Corrigir',tone:'block',step:5}), 'exemplo');
```
Painéis do B3 usam o mesmo kit; `HNV_PANELS[id]` é HTML (título, `K.svg(...)`, legenda, chip) e `HNV_DETALHES[id]` é o HTML da camada 3 (botão "detalhes").
