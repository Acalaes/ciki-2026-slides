"""Audita o deck (camadas 1, 2 e 3).

Uso:  py -I -X utf8 auditar_deck.py [--gerar]
  --gerar  escreve fontes.js (window.HNV_FONTES) a partir de fontes.json antes de auditar.

Verificações (saída diferente de 0 se alguma falhar):
 1. todo data-src de index.html e de paineis.js existe em fontes.json;
 2. todo ID de data-open do index.html existe em HNV_PANELS, e todo painel tem um data-open;
 3. os IDs obrigatórios existem em HNV_PANELS;
 4. âmbar (#F2A541) só em seletores/classes .err, .block, .late;
 5. verde-matrix só dentro de demo\\ (e no painel s8-replay, que apenas embute demo\\replay.html);
 6. nenhuma ocorrência de "determinístic"; termo coloquial só em demo/ ou em bloco logreal; "Claude Code" tolerado como nome da ferramenta; sem coautoria nos commits;
 7. toda fonte com status diferente de "confirmado" aparece com selo (class="selo") no painel;
 8. não há http(s):// em src/href/@import, exceto <a href> de referências.
"""
import json
import pathlib
import re
import subprocess
import sys

pasta = pathlib.Path(__file__).parent
ERROS = []
AVISOS = []

TERMO_PROIBIDO = "inv" + "ent"  # radical do verbo coloquial; montado aqui para o próprio script não conter o termo
OBRIGATORIOS = [
    "s1-ficha", "s1-paleta", "s1-harness3d", "s2-casos", "s2-citacoes", "s2-softmax", "s3-tab1", "s3-rudin",
    "s4-pinoE", "s4-pinoN", "s4-pinoT", "s4-pinoH", "s4-formula", "s4-regras",
    "s5-fig1", "s5-calais", "s5-dsr", "s5-ponte", "s6-ontologia", "s6-regras", "s6-triplas",
    "s7-logs", "s7-nasa", "s7-tab4", "s8-replay", "s8-regua", "s8-portao", "s8-prov",
    "s9-metodo", "s9-cmu", "s9-contexto", "s10-aneis", "s10-nucleo", "s10-portao", "s11-desenho", "s11-limites",
    "r3-referencias", "r1-respostas",
]
STATUS_SIMPLES = re.compile(r"^confirmado( no artigo| nos logs)?$")


def ler(nome):
    p = pasta / nome
    return p.read_text(encoding="utf-8") if p.exists() else ""


def erro(msg):
    ERROS.append(msg)


# ---------------------------------------------------------------- fontes
fontes = json.loads(ler("fontes.json"))
if "--gerar" in sys.argv:
    (pasta / "fontes.js").write_text(
        "/* gerado por auditar_deck.py --gerar a partir de fontes.json; não editar à mão */\n"
        "window.HNV_FONTES = " + json.dumps(fontes, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print("fontes.js gerado com", len(fontes), "chaves")

html = ler("index.html")
js_paineis = ler("paineis.js")
css_paineis = ler("paineis.css")
css_deck = ler("deck.css")

# ---------------------------------------------------------------- painéis (via node)
PAINEIS = {}
if (pasta / "paineis.js").exists():
    prog = (
        "const vm=require('vm'),fs=require('fs');const w={};w.window=w;vm.createContext(w);"
        "for(const f of ['fontes.js','paineis.js']){try{vm.runInContext(fs.readFileSync(f,'utf8'),w,{filename:f});}catch(e){console.error('ERRO '+f+': '+e.message);process.exit(2);}}"
        "const o={};for(const k of Object.keys(w.HNV_PANELS||{}))o[k]=w.HNV_PANELS[k];"
        "process.stdout.write(JSON.stringify(o));"
    )
    r = subprocess.run(["node", "-e", prog], cwd=pasta, capture_output=True, encoding="utf-8")
    if r.returncode != 0:
        erro("paineis.js não carrega no node: " + (r.stderr or "").strip()[:300])
    else:
        PAINEIS = json.loads(r.stdout)
else:
    erro("paineis.js não existe")

# ---------------------------------------------------------------- 0. chaves obrigatórias de fontes.json
CHAVES = ["charlotin", "dahl", "magesh", "rudin", "art-tab1", "art-eq", "art-limpe", "prov-dm", "art-arq", "art-dsr",
          "art-citare", "ont-citare", "studer1998", "art-escopo", "art-logs", "art-nasa", "hart1988", "hnv-cena1",
          "hnv-cena2b", "hnv-laco", "hnv-ontologia", "cf-art37", "arxiv-count", "cmu", "capex", "mit",
          "huang2025", "softmax", "pseudocodigo", "bockeler2026", "openai2026", "galster2026", "anthropic-context2025", "edge2024"]
for k in CHAVES:
    if k not in fontes:
        erro(f"chave obrigatória ausente em fontes.json: {k}")
    else:
        for campo in ("afirmacao", "fonte", "url", "status"):
            if campo not in fontes[k]:
                erro(f"fontes.json: {k} sem o campo {campo}")

# ---------------------------------------------------------------- 1. data-src
usados = {}
for n, bloco in enumerate(re.split(r'<section class="slide', html)[1:], 1):
    for i in re.findall(r'data-src="([^"]+)"', bloco):
        usados.setdefault(i, set()).add(f"slide {n}")
for i in re.findall(r'data-src="([^"]+)"', html):
    usados.setdefault(i, set()).add("index.html")
for pid, conteudo in PAINEIS.items():
    for i in re.findall(r'data-src="([^"]+)"', conteudo):
        usados.setdefault(i, set()).add(pid)
for i, onde in sorted(usados.items()):
    if i not in fontes:
        erro(f"data-src sem fonte em fontes.json: {i} ({', '.join(sorted(onde))})")
sem_uso = [i for i in fontes if i not in usados]
if sem_uso:
    AVISOS.append("fontes sem uso: " + ", ".join(sem_uso))

# ---------------------------------------------------------------- 2 e 3. IDs de painéis
abertos = set(re.findall(r'data-open="([^"]+)"', html))
for i in sorted(abertos):
    if i not in PAINEIS:
        erro(f"data-open sem painel em HNV_PANELS: {i}")
for pid in PAINEIS:
    if pid not in abertos and not pid.startswith("r"):  # r3-* abre pela tecla R (reservas)
        erro(f"painel sem data-open no index.html: {pid}")
for pid in OBRIGATORIOS:
    if pid not in PAINEIS:
        erro(f"painel obrigatório ausente: {pid}")

# ---------------------------------------------------------------- 4. âmbar
AMBAR = re.compile(r"f2a541|242\s*,\s*165\s*,\s*65", re.I)
OK_SEL = re.compile(r"\.(err|block|late)\b")


def checar_css(nome, texto):
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", texto):
        sel_, corpo = m.group(1).strip(), m.group(2)
        if AMBAR.search(corpo):
            partes = [s.strip() for s in sel_.split(",")]
            if not all(OK_SEL.search(s) for s in partes):
                erro(f"âmbar fora de .err/.block/.late em {nome}: {sel_[:80]}")


checar_css("paineis.css", css_paineis)
checar_css("deck.css", css_deck)
# hex em atributos/inline (index.html, paineis.js): a tag precisa ter a classe
for nome, texto in (("index.html", html), ("paineis.js", js_paineis)):
    for m in re.finditer(r"<[^<>]*(?:f2a541)[^<>]*>", texto, re.I):
        if not OK_SEL.search(m.group(0).replace('class="', ".").replace(" ", " .")):
            erro(f"âmbar inline sem classe .err/.block/.late em {nome}: {m.group(0)[:90]}")
    for m in re.finditer(r"<style[^>]*>(.*?)</style>", texto, re.S | re.I):
        checar_css(nome + " <style>", m.group(1))

# ---------------------------------------------------------------- 5. verde-matrix
VERDE = re.compile(r"00ff41|008f11", re.I)
for nome, texto in (("index.html", html), ("deck.css", css_deck), ("paineis.css", css_paineis), ("paineis.js", js_paineis)):
    if VERDE.search(texto):
        erro(f"verde-matrix fora de demo\\ em {nome}")
for pid, conteudo in PAINEIS.items():
    if pid != "s8-replay" and VERDE.search(conteudo):
        erro(f"verde-matrix no painel {pid}")

# ---------------------------------------------------------------- 6. termos proibidos
# - termo coloquial (TERMO_PROIBIDO): proibido em index.html, no texto autoral de paineis.js, paineis.css, fontes.json e neste script;
#   tolerado dentro de demo\ e dentro de blocos de log literal (class="logreal" ou data-log="real").
# - "Claude Code" é tolerado como NOME DA FERRAMENTA em qualquer arquivo do deck;
#   continuam proibidos "Co-Authored", "Generated with" e Claude/Anthropic como autor.
# - "Anthropic" só é aceito como editora de trabalho citado, em fontes.json e paineis.js.
LOG_REAL = re.compile(r"<(\w+)[^>]*(?:class=\"[^\"]*logreal[^\"]*\"|data-log=\"real\")[^>]*>.*?</>", re.S | re.I)
alvos = {
    "index.html": html, "paineis.js": js_paineis, "paineis.css": css_paineis,
    "fontes.json": ler("fontes.json"), "auditar_deck.py": ler("auditar_deck.py"),
}
for f in (pasta / "demo").glob("*"):
    if f.is_file() and f.suffix.lower() in (".html", ".json", ".js", ".css", ".txt", ".md"):
        alvos["demo/" + f.name] = f.read_text(encoding="utf-8", errors="replace")
for nome, texto in alvos.items():
    em_demo = nome.startswith("demo/")
    sem_log = LOG_REAL.sub("", texto)
    if re.search("determin" + "ístic", texto, re.I) and nome != "auditar_deck.py":
        erro(f"termo proibido (determinístico) em {nome}")
    if not em_demo and re.search(TERMO_PROIBIDO, sem_log, re.I):
        erro(f"termo coloquial proibido ('{TERMO_PROIBIDO}...') em {nome}, fora de bloco de log literal")
    if nome == "auditar_deck.py":
        continue
    limpo = re.sub(r"Claude Code", "", texto)  # nome da ferramenta
    proibido = r"Claude|Co-Authored|Generated with" if nome in ("fontes.json", "paineis.js") else r"Anthropic|Claude|Co-Authored|Generated with"
    if re.search(proibido, limpo):
        erro(f"menção proibida (Claude fora do nome da ferramenta, Anthropic como autor, coautoria) em {nome}")
# mensagens de commit: sem coautoria nem "Generated with"
try:
    log = subprocess.run(["git", "log", "--format=%H%x1f%B%x1e", "-n", "300"], cwd=pasta, capture_output=True, encoding="utf-8").stdout
    for reg in log.split(""):
        if "" not in reg:
            continue
        h, msg = reg.split("", 1)
        if re.search(r"Co-Authored|Generated with|Anthropic", msg, re.I):
            erro(f"commit {h.strip()[:8]} com coautoria ou 'Generated with'")
except Exception as e:  # git ausente: apenas avisa
    AVISOS.append("não foi possível ler o git log: " + str(e))

# ---------------------------------------------------------------- 7. selos
for pid, conteudo in PAINEIS.items():
    fracas = [i for i in set(re.findall(r'data-src="([^"]+)"', conteudo))
              if i in fontes and not STATUS_SIMPLES.match(fontes[i]["status"])]
    if fracas and 'class="selo' not in conteudo:
        erro(f"painel {pid} usa fonte parcial/própria ({', '.join(fracas)}) sem selo visível")

# ---------------------------------------------------------------- 8. offline
for nome, texto in (("index.html", html), ("deck.css", css_deck), ("paineis.css", css_paineis)):
    for m in re.finditer(r'(?:src|href)\s*=\s*"(https?://[^"]+)"|@import[^;]*https?://|url\(\s*[\'"]?https?://', texto):
        ctx = texto[max(0, m.start() - 4):m.end()]
        if "<a " in texto[max(0, m.start() - 80):m.start()]:
            continue
        erro(f"recurso externo em {nome}: {m.group(0)[:80]}")
for pid, conteudo in PAINEIS.items():
    for m in re.finditer(r'(src|href)\s*=\s*"(https?://[^"]+)"', conteudo):
        trecho = conteudo[max(0, m.start() - 12):m.start()]
        if m.group(1) == "src" or "<a" not in trecho:
            erro(f"recurso externo em painel {pid}: {m.group(2)[:80]}")

# ---------------------------------------------------------------- relatório
print(f"{len(PAINEIS)} painéis · {len(fontes)} fontes · {len(usados)} chaves usadas")
fracas_todas = [i for i in fontes if not STATUS_SIMPLES.match(fontes[i]["status"])]
print("fontes com selo obrigatório (status ≠ confirmado):", ", ".join(fracas_todas))
for a in AVISOS:
    print("aviso:", a)
if ERROS:
    print("\nFALHOU:")
    for e in ERROS:
        print(" -", e)
    sys.exit(1)
print("\nOK: auditoria sem falhas")
