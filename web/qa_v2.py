"""QA visual do deck v2: prints headless do Chrome (?static=1#N) em 1920x1080 e 1280x720, folhas de contato.

Uso: py -I -X utf8 qa_v2.py [slides|cover|paineis|um N]
  slides  -> um print por slide em 1920x1080 e 1280x720 (qa/v2_sNN_WxH.png) + folhas de contato
  cover   -> gera img/capa_harness3d.png (cena 3D sem textos)
  paineis -> um print por painel aberto (?open=K)
  um N    -> só o slide N (ou R1..R4) em 1920x1080
"""
import subprocess, sys, pathlib, re
from PIL import Image, ImageDraw

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WEB = pathlib.Path(__file__).resolve().parent
OUT = WEB / "qa"
OUT.mkdir(exist_ok=True)
html = (WEB / "index.html").read_text(encoding="utf-8")
blocos = re.split(r'<section class="slide', html)[1:]
total = len(blocos)
FLAGS = ["--headless=new", "--disable-gpu-vsync", "--hide-scrollbars", "--use-gl=angle", "--use-angle=swiftshader",
         "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--allow-file-access-from-files", "--force-device-scale-factor=1"]


def shot(url, destino, w=1920, h=1080, budget=9000):
    r = subprocess.run([CHROME, *FLAGS, f"--window-size={w},{h}", f"--virtual-time-budget={budget}",
                        f"--screenshot={destino}", url], capture_output=True, timeout=180, text=True)
    return r.stderr


def rotulo(n):
    return f"R{n - 12}" if n > 12 else str(n)


base = (WEB / "index.html").as_uri()
modo = sys.argv[1] if len(sys.argv) > 1 else "slides"
if modo == "cover":
    shot(f"{base}?static=1&only3d=1&fresh=1#1", WEB / "img" / "capa_harness3d.png", budget=15000)
    print(WEB / "img" / "capa_harness3d.png")
    sys.exit()
if modo == "um":
    n = sys.argv[2]
    d = OUT / f"v2_um_{n}.png"
    shot(f"{base}?static=1#{n}", d, budget=15000)
    print(d)
    sys.exit()
arquivos = []
if modo == "paineis":
    for n in range(1, 13):
        k = len(set(re.findall(r'data-open="([^"]+)"', blocos[n - 1])))
        for j in range(1, k + 1):
            d = OUT / f"v2_s{n:02d}_p{j}.png"
            shot(f"{base}?static=1&open={j}#{n}", d)
            arquivos.append(d)
else:
    for (w, h) in ((1920, 1080), (1280, 720)):
        for n in range(1, total + 1):
            d = OUT / f"v2_s{n:02d}_{w}x{h}.png"
            shot(f"{base}?static=1#{rotulo(n)}", d, w, h, 15000)
            if w == 1920:
                arquivos.append(d)
w, h = 640, 360
for f in range(0, len(arquivos), 9):
    folha = Image.new("RGB", (w * 3, h * 3), (0, 0, 0))
    for j, a in enumerate(arquivos[f:f + 9]):
        try:
            im = Image.open(a).convert("RGB").resize((w, h))
        except Exception:
            continue
        ImageDraw.Draw(im).text((10, 8), a.stem, fill=(245, 158, 11))
        folha.paste(im, ((j % 3) * w, (j // 3) * h))
    destino = OUT / f"v2_folha_{modo}_{f // 9 + 1}.png"
    folha.save(destino)
    print(destino)
