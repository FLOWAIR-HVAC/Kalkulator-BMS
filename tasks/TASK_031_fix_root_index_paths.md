# TASK_031 — Naprawa ścieżek w root index.html + commit + push

## Problem

Root `index.html` ma błędne ścieżki do assetów (brak prefiksu `frontend/`),
przez co strona na GitHub Pages traci cały styl i przestaje działać.

Błędne ścieżki (jak wygląda teraz):
- `href="css/style.css"` → powinno być `href="frontend/css/style.css"`
- `src="js/translations.js"` → powinno być `src="frontend/js/translations.js"`
- itd.

---

## Kroki

### Krok 1 — Zsynchronizuj root `index.html` z `frontend/index.html`

Uruchom ten skrypt Python:

```python
with open('frontend/index.html', encoding='utf-8') as f:
    content = f.read()
content = content.replace('href="css/style.css"',     'href="frontend/css/style.css"')
content = content.replace('src="js/translations.js"', 'src="frontend/js/translations.js"')
content = content.replace('src="js/devices-data.js"', 'src="frontend/js/devices-data.js"')
content = content.replace('src="js/calculator.js"',   'src="frontend/js/calculator.js"')
content = content.replace('src="js/app.js"',          'src="frontend/js/app.js"')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('OK')
```

### Krok 2 — Weryfikacja

Sprawdź że w `index.html` (root) wszystkie lokalne ścieżki zaczynają się od `frontend/`:

```bash
grep -E "href=|src=" index.html
```

Oczekiwany wynik:
```
  <link rel="stylesheet" href="frontend/css/style.css">
<script src="https://cdnjs.cloudflare.com/..."></script>
<script src="frontend/js/translations.js"></script>
<script src="frontend/js/devices-data.js"></script>
<script src="frontend/js/calculator.js"></script>
<script src="frontend/js/app.js"></script>
```

### Krok 3 — Commit i push

```bash
git add index.html frontend/index.html CLAUDE.md
git commit -m "fix: restore correct asset paths in root index.html"
git push
```

---

## Commit message

```
fix: restore correct asset paths in root index.html
```
