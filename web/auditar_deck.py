"""Audita o deck: toda afirmação marcada com data-src precisa existir em fontes.json.

Saída: grafo afirmação -> fonte -> status. Código de saída 1 se houver id sem fonte.
"""
import json
import pathlib
import re
import sys

pasta = pathlib.Path(__file__).parent
html = (pasta / "index.html").read_text(encoding="utf-8")
fontes = json.loads((pasta / "fontes.json").read_text(encoding="utf-8"))

usados = {}
for n, bloco in enumerate(re.split(r'<section class="slide', html)[1:], 1):
    for i in re.findall(r'data-src="([a-z0-9-]+)"', bloco):
        usados.setdefault(i, []).append(n)

sem_fonte = [i for i in usados if i not in fontes]
sem_uso = [i for i in fontes if i not in usados]
for i, slides in usados.items():
    f = fontes.get(i)
    print(f"slide {slides} · {i} -> {f['fonte'] if f else 'SEM FONTE'} [{f['status'] if f else '-'}]")
print(f"\n{len(usados)} afirmações marcadas · {len(sem_fonte)} sem fonte · {len(sem_uso)} fontes sem uso")
fracas = [i for i in usados if i in fontes and not fontes[i]['status'].startswith('confirmado')]
if fracas:
    print("Atenção (fonte parcial ou própria; dizer 'preprint', 'previsão' ou 'contagem do autor' no slide):", ", ".join(fracas))
sys.exit(1 if sem_fonte else 0)
