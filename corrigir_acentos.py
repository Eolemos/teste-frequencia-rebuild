from pathlib import Path

PASTA = Path(r"C:\Users\lemos\OneDrive\Documentos\Money\soucer\Sites\teste-frequencia-rebuild")

exts = {".html", ".js", ".css", ".json", ".txt"}

marcadores = ["Ã", "Â", "â€™", "â€œ", "â€", "ðŸ"]

def score(s):
    return sum(s.count(m) for m in marcadores)

corrigidos = []

for p in PASTA.rglob("*"):
    if not p.is_file():
        continue
    if p.suffix.lower() not in exts:
        continue

    try:
        original = p.read_text(encoding="utf-8")
    except:
        continue

    melhor = original

    try:
        tentativa = original.encode("latin1").decode("utf-8")
        if score(tentativa) < score(original):
            melhor = tentativa
    except:
        pass

    if melhor != original:
        p.write_text(melhor, encoding="utf-8")
        corrigidos.append(str(p))

print("Arquivos corrigidos:")
for c in corrigidos:
    print(c)

print("Total:", len(corrigidos))
