"""Audita o deck (camadas 1, 2 e 3).

Uso:  py -I -X utf8 auditar_deck.py [--gerar]
  --gerar  escreve fontes.js (window.HNV_FONTES) a partir de fontes.json antes de auditar.

Verificações (saída diferente de 0 se alguma falhar):
 1. todo data-src de index.html e de paineis.js existe em fontes.json;
 2. todo ID de data-open do index.html existe em HNV_PANELS, e todo painel tem um data-open;
 3. os IDs obrigatórios existem em HNV_PANELS;
 4. vermelho de erro (#f87171) só em seletores/classes .err, .block, .late; âmbar, amarelo, laranja, roxo, rosa, ciano e azul-marinho de fundo são proibidos;
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
        "for(const f of ['kit.js','fontes.js','paineis.js']){try{vm.runInContext(fs.readFileSync(f,'utf8'),w,{filename:f});}catch(e){console.error('ERRO '+f+': '+e.message);process.exit(2);}}"
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
          "huang2025", "softmax", "pseudocodigo", "bockeler2026", "openai2026", "galster2026", "anthropic-context2025", "edge2024",
          "art-cena1", "kroll2017", "busuioc2021", "garcez2023", "art-futuro"]
for k in CHAVES:
    if k not in fontes:
        erro(f"chave obrigatória ausente em fontes.json: {k}")
    else:
        for campo in ("afirmacao", "fonte", "url", "status", "ref"):
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
# Os heróis da camada 1 também são montados por deck.js/matrix8.js/pict.js: ids literais ou prefixos (ex.: "s4-pino" + letra).
import pathlib as _pl
_js = "".join((_pl.Path(__file__).parent / n).read_text(encoding="utf-8") for n in ("deck.js", "matrix8.js", "pict.js") if (_pl.Path(__file__).parent / n).exists())
_prefixos = set(re.findall(r'data-open=\?"([a-z0-9-]+)', _js))
for pid in PAINEIS:
    aberto = pid in abertos or pid in _js or any(pid.startswith(pf) for pf in _prefixos)
    if not aberto and not pid.startswith("r"):  # r3-* abre pela tecla R (reservas)
        erro(f"painel sem data-open no index.html nem no deck.js: {pid}")
for pid in OBRIGATORIOS:
    if pid not in PAINEIS:
        erro(f"painel obrigatório ausente: {pid}")

# ---------------------------------------------------------------- 4. âmbar
AMBAR = re.compile(r"f87171|248\s*,\s*113\s*,\s*113", re.I)  # vermelho de erro/bloqueio
OK_SEL = re.compile(r"\.(err|block|late)\b")


def checar_css(nome, texto):
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", texto):
        sel_, corpo = m.group(1).strip(), m.group(2)
        if AMBAR.search(corpo):
            partes = [s.strip() for s in sel_.split(",")]
            if not all(OK_SEL.search(s) for s in partes):
                erro(f"vermelho (#f87171) fora de .err/.block/.late em {nome}: {sel_[:80]}")


checar_css("paineis.css", css_paineis)
checar_css("deck.css", css_deck)
# hex em atributos/inline (index.html, paineis.js): a tag precisa ter a classe
for nome, texto in (("index.html", html), ("paineis.js", js_paineis)):
    for m in re.finditer(r"<[^<>]*(?:f87171)[^<>]*>", texto, re.I):
        if not OK_SEL.search(m.group(0).replace('class="', ".").replace(" ", " .")):
            erro(f"vermelho inline sem classe .err/.block/.late em {nome}: {m.group(0)[:90]}")
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
    # "determinístico" só é proibido para o modelo neural; é permitido ao falar de funções, regras ou da parte simbólica
    if nome != "auditar_deck.py":
        for ln in texto.splitlines():
            if re.search("determin" + "ístic", ln, re.I) and not re.search(r"função|funções|regra|regras|simbólic|código", ln, re.I):
                erro(f"termo proibido (determinístico) em {nome}")
                break
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

# ---------------------------------------------------------------- 9. design clean v3 (camada 2) e kit
HTML_TAG = re.compile(r"<[^>]+>")
RESERVAS = ("r1-respostas", "r3-referencias", "r5-creditos")
DETALHES = {}
if (pasta / "paineis.js").exists():
    prog2 = (
        "const vm=require('vm'),fs=require('fs');const w={};w.window=w;vm.createContext(w);"
        "for(const f of ['kit.js','fontes.js','paineis.js']){try{vm.runInContext(fs.readFileSync(f,'utf8'),w,{filename:f});}catch(e){console.error('ERRO '+f+': '+e.message);process.exit(2);}}"
        "const o={};for(const k of Object.keys(w.HNV_PANELS||{}))o[k]=w.HNV_PANELS[k];"
        "process.stdout.write(JSON.stringify({p:o,d:w.HNV_DETALHES||{},pics:Object.keys((w.HNV_KIT||{}).PICS||{})}));"
    )
    r2 = subprocess.run(["node", "-e", prog2], cwd=pasta, capture_output=True, encoding="utf-8")
    if r2.returncode != 0:
        erro("kit.js/paineis.js não carregam juntos no node: " + (r2.stderr or "").strip()[:300])
    else:
        dados = json.loads(r2.stdout)
        PAINEIS = dados["p"]
        DETALHES = dados["d"]
        for nome_pic in ["evidencia", "normas", "rastro", "humano", "recuperar", "gerar", "verificar", "registrar", "aprovar", "bloqueio", "ontologia", "fechadura", "chave", "calendario", "barras"]:
            if nome_pic not in dados["pics"]:
                erro(f"kit.js sem o pictograma {nome_pic}")
for arq in ("kit.js", "kit.css", "KIT_API.md"):
    if not (pasta / arq).exists():
        erro(f"{arq} não existe")
if not (pasta / "fonts" / "notosansmath-400.woff2").exists() or "Noto Sans Math" not in ler("kit.css"):
    erro("Noto Sans Math (glifos lógicos) não está declarada em kit.css ou o woff2 não existe")

for pid, conteudo in PAINEIS.items():
    if pid in RESERVAS:
        continue
    m = re.search(r'<h2 class="pt">(.*?)</h2>', conteudo, re.S)
    titulo = HTML_TAG.sub("", m.group(1)).strip() if m else ""
    if not titulo:
        erro(f"painel {pid} sem título h2.pt")
    elif len(titulo.split()) > 6 or len(titulo) > 44:
        erro(f"painel {pid}: título longo demais ({len(titulo.split())} palavras, {len(titulo)} caracteres): {titulo}")
    visivel = re.sub(r"<svg.*?</svg>", " ", conteudo, flags=re.S)
    visivel = re.sub(r"<iframe.*?</iframe>", " ", visivel, flags=re.S)
    visivel = re.sub(r"<(footer|h2|button)\b.*?</\1>", " ", visivel, flags=re.S)
    visivel = re.sub(r'<span class="selo[^"]*">.*?</span>', " ", visivel, flags=re.S)
    palavras = len(HTML_TAG.sub(" ", visivel).split())
    if palavras > 30:
        erro(f"painel {pid}: {palavras} palavras fora do diagrama (limite 30)")
    if re.search(r"<(table|ul|ol|dl|pre)\b", conteudo):
        erro(f"painel {pid}: tabela/lista/código na camada 2 (vai para HNV_DETALHES)")
    # painel de página de PDF (fonte): a própria página é a prova; não exige HNV_DETALHES nem SVG
    if '<img class="pdfp"' not in conteudo:
        if pid not in DETALHES:
            erro(f"painel {pid} sem HNV_DETALHES (camada 3)")
        if "<svg" not in conteudo and pid != "s8-replay":
            erro(f"painel {pid} sem diagrama SVG do kit")

# paleta fixa (FUNDO_NEUTRO_v3g): fundo grafite #0b0c10 a #14161c, cartões #15181f, texto #f4f4f5, zinc #a1a1aa / #71717a,
# teal #14b8a6 / #5eead4 só como acento, vermelho #f87171 só em erro; verde só no slide 8 (matrix8.css) e em demo\.
# paleta da instituição (logo do CIKI, v1.4.0): azul #2b9bdc/#4db3ea/#0a6aa1 e laranja #f05a28; o verde-azulado antigo deixou de valer.
PERMITIDAS = {"0b0c10", "14161c", "15181f", "f4f4f5", "a1a1aa", "71717a", "2b9bdc", "4db3ea", "0a6aa1", "38bdf8", "f87171", "f05a28",
              "000", "000000", "fff", "ffffff", "0a1b4a"}  # 0a1b4a: tint da camada da foto (mix-blend-mode), nunca fundo
PERMITIDAS |= {"d4eeff", "9bdcff", "7fd0f5", "cfeeff", "ffb08a", "9c3009", "ffd7c2", "0a3a5a", "1b0f08", "1b232b", "05080c", "0b1017",
               "34475a", "6f8aa3", "8fa3b5", "44566a", "56667a", "445261", "d3dee9", "e9f1f8", "8ea3b6", "b9c8d6", "9fb2c4", "7d90a3",
               "1c6f9f", "16587f"}  # metálicos e brilhos das figuras realistas (regras 10b): tons de aço, azul e laranja da paleta
VERDES = {"00ff41", "008f11"}
RGBA_OK = {(255, 255, 255), (161, 161, 170), (113, 113, 122), (43, 155, 220), (77, 179, 234), (10, 106, 161), (56, 189, 248),
           (21, 24, 31), (11, 12, 16), (20, 22, 28), (8, 10, 14), (244, 244, 245), (248, 113, 113), (0, 0, 0), (10, 27, 74), (240, 90, 40)}


def azul_marinho(h):
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r_, g_, b_ = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return b_ >= r_ + 14 and b_ >= g_ and max(r_, g_, b_) <= 0x70 and not (g_ > b_ - 6 and g_ >= 0x80)


for nome in ("paineis.css", "kit.css", "paineis.js", "kit.js", "deck.css", "deck.js", "index.html", "matrix8.css"):
    texto = re.sub(r"/\*.*?\*/", "", ler(nome), flags=re.S)
    if nome.endswith(".html") or nome.endswith(".js"):
        texto = re.sub(r"(?m)^\s*//.*$", "", texto)
    if nome == "index.html":
        # exceção declarada (REGRAS v1.11.0): mockup realista de equipamento (laptop) usa cinzas metálicos fora da paleta
        texto = re.sub(r'<svg class="laptop".*?</svg>', "", texto, flags=re.S)
    for h in re.findall(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b", texto):
        hl = h.lower()
        if h == "160" or hl in PERMITIDAS:
            continue
        if hl in VERDES and nome == "matrix8.css":
            continue
        if hl in VERDES:
            erro(f"verde fora do slide 8 e de demo\\ em {nome}: #{h}")
        elif azul_marinho(hl):
            erro(f"azul-marinho de fundo proibido em {nome}: #{h}")
        else:
            erro(f"cor fora da paleta em {nome}: #{h}")
    for r_, g_, b_ in re.findall(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)", texto):
        trio = (int(r_), int(g_), int(b_))
        if trio in RGBA_OK or (nome == "matrix8.css" and trio[1] > 100 and trio[0] < 60):
            continue
        h6 = "%02x%02x%02x" % trio
        if azul_marinho(h6):
            erro(f"azul-marinho de fundo (rgba) proibido em {nome}: rgba({r_},{g_},{b_})")
        else:
            erro(f"rgba fora da paleta em {nome}: rgba({r_},{g_},{b_})")

# títulos (TITULOS_v3f): sem símbolos, sem siglas isoladas; painel ≤ 6 palavras; slide ≤ 45 caracteres; blocos da lista
SIMBOLOS_TITULO = re.compile(r"[∧∨¬∀∃→∘≈+=#<>|]|\bvs\b|\be/ou\b")
SIGLAS_TITULO = re.compile(r"\b(HNV|CBMSC|ESAG|UDESC|RAG|PROV|TLX|DSR|XAI|LIMPE|CALAIS|NASA|W3C|PPGEGC|UFSC|LLM)\b|(?<![\wÀ-ÿ])[NTH](?![\wÀ-ÿ])|\bE\s+N\b")
BLOCOS = {"INTRODUÇÃO", "PROBLEMA", "SOLUÇÃO", "PROVAS", "FUTURO", "CONCLUSÃO", "RESERVA"}


def titulo_ruim(tit):
    if SIMBOLOS_TITULO.search(tit):
        return "símbolo"
    if SIGLAS_TITULO.search(tit):
        return "sigla isolada"
    return None


for pid, conteudo in PAINEIS.items():
    m = re.search(r'<h2 class="pt">(.*?)</h2>', conteudo, re.S)
    tit = HTML_TAG.sub("", m.group(1)).strip() if m else ""
    why = titulo_ruim(tit)
    if why:
        erro(f"painel {pid}: título com {why}: {tit}")
    if len(tit) > 40:
        erro(f"painel {pid}: título de {len(tit)} caracteres não cabe numa linha em caixa-alta: {tit}")
for sm in re.finditer(r'<section class="slide[^"]*"([^>]*)>', html):
    attrs = sm.group(1)
    dt = re.search(r'data-title="([^"]*)"', attrs)
    bl = re.search(r'data-block="([^"]*)"', attrs)
    if dt:
        tit = dt.group(1)
        why = titulo_ruim(tit)
        if why:
            erro(f"slide com título com {why}: {tit}")
        if len(tit) > 45:
            erro(f"slide com título de {len(tit)} caracteres (limite 45): {tit}")
    if bl and bl.group(1).strip().upper() not in BLOCOS:
        erro(f"bloco fora da lista (INTRODUÇÃO, PROBLEMA, SOLUÇÃO, PROVAS, FUTURO, CONCLUSÃO, RESERVA): {bl.group(1)}")
for hm in re.finditer(r'<h1 class="ttl[^"]*">(.*?)</h1>', html, re.S):
    tit = HTML_TAG.sub("", hm.group(1)).strip()
    why = titulo_ruim(tit)
    if why:
        erro(f"slide: título h1 com {why}: {tit}")
    if len(tit) > 45:
        erro(f"slide: título h1 de {len(tit)} caracteres (limite 45): {tit}")

# texto para o público: o erro/bloqueio é VERMELHO; "âmbar" (e amarelo/laranja) não podem aparecer em painel
for pid, conteudo in list(PAINEIS.items()) + [("detalhes:" + k, v) for k, v in DETALHES.items()]:
    if re.search(r"[âa]mbar|amarel[oa]|laranja", HTML_TAG.sub(" ", conteudo) + " " + " ".join(re.findall(r'aria-label="([^"]*)"', conteudo)), re.I):
        erro(f"{pid}: menciona âmbar/amarelo/laranja ao público (o erro e o bloqueio são vermelhos)")

# prova documental (camada 3): imagens reais do artigo
for img in ("figura1", "tabela1", "tabela2", "tabela3", "tabela4", "tabela5"):
    if not (pasta / "img" / "artigo" / f"{img}.png").exists():
        erro(f"imagem da prova documental ausente: img/artigo/{img}.png")
for pid in ("s5-fig1", "s3-tab1", "s4-pinoN", "s5-dsr", "s7-tab4", "s7-nasa"):
    dd = DETALHES.get(pid, "")
    if 'class="showcase"' not in dd or 'class="proof"' not in dd:
        erro(f"detalhes de {pid} sem ShowcaseFigure e ProofExplanation")
    for srcimg in re.findall(r'<img src="([^"]+)"', dd):
        if not (pasta / srcimg).exists():
            erro(f"imagem referenciada em {pid} não existe: {srcimg}")

SEM_FONTE_ANTIGA = ("index.html", "deck.css", "deck.js", "paineis.js", "paineis.css", "kit.js", "kit.css", "matrix8.css")
for nome in SEM_FONTE_ANTIGA:
    texto = re.sub(r"/\*.*?\*/", "", ler(nome), flags=re.S)
    texto = re.sub(r"<!--.*?-->", "", texto, flags=re.S)
    texto = re.sub(r"(?m)^\s*//.*$", "", texto)
    if re.search(r"Archivo|Source Serif", texto):
        erro(f"fonte antiga (Archivo ou Source Serif) em {nome}")
for f in (pasta / "demo").glob("*.html"):
    if re.search(r"Archivo|Source Serif", f.read_text(encoding="utf-8", errors="replace")):
        erro(f"fonte antiga em demo/{f.name}")


# ---------------------------------------------------------------- 10. rodapé de fontes (data-fontes) e créditos
for k, v in fontes.items():
    if not str(v.get("ref", "")).strip():
        erro(f"fontes.json: {k} sem o campo ref (citação curta do rodapé)")
if "Foto:" in html:
    erro('index.html: o rodapé dos slides mostra as fontes do conteúdo; "Foto:" é proibido (créditos das imagens ficam no painel r5-creditos)')
for n_, sm in enumerate(re.finditer(r'<section class="slide[^"]*"([^>]*)>', html), 1):
    attrs = sm.group(1)
    bl = re.search(r'data-block="([^"]*)"', attrs)
    if bl and bl.group(1).strip().upper() == "RESERVA":
        continue
    df = re.search(r'data-fontes="([^"]*)"', attrs)
    chaves_f = [x.strip() for x in df.group(1).split(",") if x.strip()] if df else []
    if not chaves_f:
        erro(f"slide {n_}: sem data-fontes (cada slide principal precisa de ao menos uma fonte no rodapé)")
    for ch in chaves_f:
        if ch not in fontes:
            erro(f"slide {n_}: data-fontes cita chave inexistente em fontes.json: {ch}")

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
