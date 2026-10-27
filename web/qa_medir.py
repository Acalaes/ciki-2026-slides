"""Medições do deck: posição/tamanho do título, linhas, palavras e rótulos do herói (DOM) + luminância, contraste e cores (capturas).
Uso: py -I -X utf8 qa_medir.py   (usa qa/v2_sNN_1920x1080.png já gerados por qa_v2.py slides)"""
import subprocess, pathlib, re, json, colorsys
from PIL import Image
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WEB = pathlib.Path(__file__).resolve().parent
base = (WEB / "index.html").as_uri()
r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                    "--allow-file-access-from-files", "--virtual-time-budget=20000", "--dump-dom", base + "?static=1&medir=1"],
                   capture_output=True, timeout=240, text=True, encoding="utf-8")
m = re.search(r'<pre id="medir"[^>]*>(.*?)</pre>', r.stdout, re.S)
dom = json.loads(m.group(1).replace("&quot;", '"').replace("&amp;", "&")) if m else []

def lin(c):
    c /= 255
    return c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
def L(p):
    return .2126 * lin(p[0]) + .7152 * lin(p[1]) + .0722 * lin(p[2])
def regiao(im, box):
    px = list(im.crop(box).convert("RGB").getdata())
    ls = sorted(L(p) for p in px)
    bg = [l for l in ls if l < .35]
    pc = lambda a, q: a[min(len(a) - 1, int(len(a) * q))] if a else 0
    return pc(bg, .9)  # fundo estrito: percentil 90 dos pixels que não são texto
def contraste(lt, lb):
    return (lt + .05) / (lb + .05)
LT_TITULO, LT_SLATE = L((244, 244, 245)), L((161, 161, 170))
def familia(h, s, v):
    if s < .25 or v < .12: return "neutro"
    d = h * 360
    if d < 20 or d > 340: return "vermelho"
    if 20 <= d < 70: return "amarelo/laranja"
    if 70 <= d < 150: return "verde"
    if 150 <= d < 190: return "teal"
    if 190 <= d < 270: return "azul"
    return "roxo/rosa"
print(f"{'slide':>5} {'x':>4} {'y':>3} {'cx':>5} {'w':>5} {'px':>3} {'lin':>3} {'rot':>3} {'pal':>3} {'minpx':>5} | {'luma%':>5} {'ctr.tit':>7} {'ctr.guia':>8} {'ctr.hero':>8} | cores dominantes")
for d in dom:
    n = d["slide"]; tag = f"{int(n):02d}" if str(n).isdigit() else None
    if not str(n).isdigit(): n_arq = 12 + int(str(n)[1:])
    else: n_arq = int(n)
    f = WEB / "qa" / f"v2_s{n_arq:02d}_1920x1080.png"
    if not f.exists(): continue
    im = Image.open(f).convert("RGB")
    small = im.resize((192, 108))
    px = list(small.getdata())
    lum = sum(.2126 * p[0] + .7152 * p[1] + .0722 * p[2] for p in px) / len(px) / 255
    cnt = {}
    for p in px:
        h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in p))
        k = familia(h, s, v); cnt[k] = cnt.get(k, 0) + 1
    tot = sum(cnt.values())
    cores = ", ".join(f"{k} {100*v/tot:.0f}%" for k, v in sorted(cnt.items(), key=lambda x: -x[1]) if v / tot > .02)
    ct = contraste(LT_TITULO, regiao(im, (300, 12, 1720, 84)))
    cg = contraste(LT_SLATE, regiao(im, (300, 84, 1720, 116)))
    ch = contraste(LT_TITULO, regiao(im, (160, 240, 1760, 960)))
    print(f"{str(n):>5} {d['x']:>4} {d['y']:>3} {d['cx']:>5} {d['w']:>5} {d['fontPx']:>3.0f} {d['linhas']:>3} {d['rotulos']:>3} {d['palavrasHero']:>3} {str(d['menorTextoHero']):>5} | {100*lum:>5.1f} {ct:>7.1f} {cg:>8.1f} {ch:>8.1f} | {cores}")
ys = {d["y"] for d in dom}; cxs = {d["cx"] for d in dom}; ps = {d["fontPx"] for d in dom}
print("\nposicao do titulo: y distintos =", sorted(ys), "| centros x =", sorted(cxs), "| tamanhos =", sorted(ps))
print("titulos com mais de 1 linha:", [d["slide"] for d in dom if d["linhas"] > 1], "| acima de 45 caracteres:", [d["slide"] for d in dom if d["chars"] > 45], "| nao cabem:", [d["slide"] for d in dom if not d["cabe"]])
