"""Builds the checklist notes in note/ from their sources in note/.src/.
Source format, one file per checklist (note/.src/<group>/<name>.txt):
    title: Pricing page
    about: one line on what the page is for
    ## Section name
    - Item text | S wcag-contrast owasp-auth
Backing letters: L = Rule (a store or a law requires it), S = Standard, R = Research, P = Practice.
Keys after the letter are looked up in note/.src/sources.txt ("key  url" per line).
Run: python .claude/scripts/notes.py   (writes note/<group>/<name>.txt and note/INDEX.txt)"""
import pathlib, re, sys
root = pathlib.Path(__file__).resolve().parents[2] / "note"
src = root / ".src"
SOURCES = {}
for line in (src / "sources.txt").read_text(encoding="utf-8").splitlines():
    if line.strip() and not line.startswith("#"):
        k, u = line.split(None, 1)
        SOURCES[k] = u.strip()
NAMES = {"L": "Rule", "S": "Standard", "R": "Research", "P": "Practice"}
index, missing = [], set()
for f in sorted(src.glob("*/*.txt")):
    group = f.parent.name
    title, about, out, used, n, counts = f.stem, "", [], [], 0, {k: 0 for k in NAMES}
    for line in f.read_text(encoding="utf-8").splitlines():
        if line.startswith("title:"): title = line[6:].strip()
        elif line.startswith("about:"): about = line[6:].strip()
        elif line.startswith("## "): out += ["", line[3:].strip().upper()]
        elif line.startswith("- "):
            text, _, back = line[2:].partition("|")
            parts = back.split()
            letter = parts[0] if parts and parts[0] in NAMES else "P"
            keys = parts[1:] if parts and parts[0] in NAMES else parts
            for k in keys:
                if k not in SOURCES: missing.add(f"{f.name}: {k}")
                elif k not in used: used.append(k)
            n += 1; counts[letter] += 1
            tail = NAMES[letter] + (f": {', '.join(keys)}" if keys else "")
            out.append(f"{n:>2}. {text.strip()}   ({tail})")
    head = [f"{title.upper()} CHECKLIST: {n} items", about,
            "Backing: " + ", ".join(f"{counts[k]} {NAMES[k]}" for k in NAMES),
            "Rule = a store or a law requires it · Standard = a published standard · Research = usability studies · Practice = good practice, no study found"]
    tailsrc = ["", "SOURCES"] + [f"- {k}: {SOURCES[k]}" for k in used] if used else []
    dest = root / group / f.name
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(head + out + tailsrc) + "\n", encoding="utf-8-sig")
    index.append(f"{group}/{f.name}  ({n} items)")
(root / "INDEX.txt").write_text(f"{len(index)} checklist notes\n\n" + "\n".join(index) + "\n", encoding="utf-8-sig")
print(f"{len(index)} notes built")
if missing: print("MISSING SOURCE KEYS:", *sorted(missing), sep="\n  "); sys.exit(1)
