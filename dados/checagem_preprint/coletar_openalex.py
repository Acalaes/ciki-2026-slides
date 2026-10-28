"""Plano B (arXiv API devolveu 429): mesmo recorte no OpenAlex (base aberta). Título 'harness/harnesses', resumo com 'agent', preprints do arXiv, 2026 até 25/10. Amostra de 50 (semente 42)."""
import urllib.request, urllib.parse, json, re, random, time, sys
sys.stdout.reconfigure(encoding="utf-8")
UA = {"User-Agent": "pesquisa-academica-calaes/1.0"}
def get(url):
    for t in range(6):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90))
        except Exception as e:
            print("retry", t, repr(e)[:70], flush=True); time.sleep(15 * (t + 1))
    raise SystemExit("falhou")
filtro = "title.search:harness,title_and_abstract.search:agent,from_publication_date:2026-01-01,to_publication_date:2026-10-25,locations.source.id:S4306400194"
sel = "id,doi,title,publication_date,cited_by_count,locations,abstract_inverted_index,primary_location"
pg, obras = 1, []
while True:
    d = get("https://api.openalex.org/works?" + urllib.parse.urlencode({"filter": filtro, "per-page": 200, "page": pg, "select": sel}, safe=":,*"))
    obras += d["results"]; pg += 1; time.sleep(1)
    if len(d["results"]) < 200: break
def resumo(o):
    ii = o.get("abstract_inverted_index") or {}
    pos = sorted((p, w) for w, ps in ii.items() for p in ps)
    return " ".join(w for _, w in pos)
for o in obras: o["resumo"] = resumo(o); o.pop("abstract_inverted_index", None)
pal = [o for o in obras if re.search(r"\bharness(es)?\b", o["title"] or "", re.I)]
print("bruto OpenAlex:", len(obras), "| palavra harness/harnesses no título:", len(pal))
json.dump(pal, open("universo_openalex.json", "w", encoding="utf-8"), ensure_ascii=False)
random.seed(42); am = random.sample(pal, min(50, len(pal)))
json.dump(am, open("amostra50.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for n, o in enumerate(am, 1): print(n, "|", o["title"][:105], "|", o["resumo"][:210])
