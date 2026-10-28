"""Coleta a consulta do arXiv (ti:harness AND abs:agent, 2026 até 25/10) e sorteia 50 (semente 42)."""
import urllib.request, urllib.parse, re, json, time, random, xml.etree.ElementTree as ET, sys
sys.stdout.reconfigure(encoding="utf-8")
NS = {"a": "http://www.w3.org/2005/Atom"}
q = "ti:harness AND abs:agent AND submittedDate:[202601010000 TO 202610252359]"
itens, start = [], 0
while True:
    url = "https://export.arxiv.org/api/query?" + urllib.parse.urlencode({"search_query": q, "start": start, "max_results": 100, "sortBy": "submittedDate"})
    for tent in range(8):
        try:
            xml = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "pesquisa-academica-calaes/1.0 (acalaes@gmail.com)"}), timeout=150).read(); break
        except Exception as ex:
            if tent == 7: raise
            print('retry', tent, repr(ex)[:80], flush=True); time.sleep(20 * (tent + 1))
    raiz = ET.fromstring(xml)
    es = raiz.findall("a:entry", NS)
    if not es: break
    for e in es:
        t = " ".join(e.find("a:title", NS).text.split())
        itens.append({"id": e.find("a:id", NS).text.split("/abs/")[-1], "titulo": t,
                      "resumo": " ".join(e.find("a:summary", NS).text.split()),
                      "data": e.find("a:published", NS).text[:10]})
    start += 100; time.sleep(3)
    if len(es) < 100: break
tot = len(itens)
filtrado = [i for i in itens if re.search(r"\bharness(es)?\b", i["titulo"], re.I)]
print("bruto", tot, "palavra harness/harnesses no titulo", len(filtrado))
random.seed(42)
amostra = random.sample(filtrado, 50)
json.dump({"bruto": tot, "filtrado": len(filtrado), "consulta": q, "ids": [i["id"] for i in filtrado]}, open("universo.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(amostra, open("amostra50.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for n, i in enumerate(amostra, 1):
    print(n, i["id"], "|", i["titulo"][:110], "|", i["resumo"][:230])
