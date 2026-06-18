# TASK_020 — Poprawki po i18n: pozycja przycisku języka + data-i18n na przyciskach formularza

## Kontekst

TASK_018 (i18n) został wykonany. Pozostały dwa niedokończone elementy:

1. Przycisk języka (#btn-lang) jest wyrenderowany w bloku headera zamiast w prawym górnym rogu
2. Przyciski `+Dodaj urządzenie` i `Oblicz` w obu formularzach (T-box i M-box) nie mają
   atrybutu `data-i18n` — nie zmieniają tekstu po przełączeniu języka

Uwaga: `min-width: 240px` na `.btn-controller-toggle` zostało już usunięte.
Emoji w przycisku języka (`🇬🇧`) zostało już usunięte z `translations.js`.

---

## Zmiana 1 — CSS: przycisk języka w prawym górnym rogu

### `frontend/css/style.css`

#### a) Dodaj `position: relative` do istniejącej reguły `header`

```css
/* PRZED: */
header {
  background: #1a2d47;
  color: #fff;
  padding: 16px 24px;
}

/* PO: */
header {
  background: #1a2d47;
  color: #fff;
  padding: 16px 24px;
  position: relative;
}
```

#### b) Znajdź istniejącą regułę `.btn-lang` i zastąp ją

```css
/* PO: */
.btn-lang {
  position: absolute;
  top: 16px;
  right: 24px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.4);
  color: #fff;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
}
.btn-lang:hover {
  background: rgba(255,255,255,0.25);
}
```

---

## Zmiana 2 — HTML: data-i18n na przyciskach formularza

### `frontend/index.html` i `index.html` (root) — oba pliki

#### Przyciski M-box:

```html
<!-- PRZED: -->
<button id="btn-add-mbox-device" type="button">+ Dodaj urządzenie</button>
<button id="btn-mbox-calculate" type="button" class="btn-primary">Oblicz</button>

<!-- PO: -->
<button id="btn-add-mbox-device" type="button" data-i18n="btn.add_device">+ Dodaj urządzenie</button>
<button id="btn-mbox-calculate" type="button" class="btn-primary" data-i18n="btn.calculate">Oblicz</button>
```

#### Przyciski T-box:

```html
<!-- PRZED: -->
<button id="btn-add-device" type="button">+ Dodaj urządzenie</button>
<button id="btn-calculate" type="button" class="btn-primary">Oblicz</button>

<!-- PO: -->
<button id="btn-add-device" type="button" data-i18n="btn.add_device">+ Dodaj urządzenie</button>
<button id="btn-calculate" type="button" class="btn-primary" data-i18n="btn.calculate">Oblicz</button>
```

---

## Weryfikacja

1. Otwórz `frontend/index.html` — przycisk `EN` widoczny w prawym górnym rogu nagłówka (nie pod napisem strony) ✓
2. Kliknij `EN` — strona przeładowuje się po angielsku:
   - Przyciski "Calculate" i "+ Add device" po angielsku w obu formularzach (T-box i M-box) ✓
3. Kliknij `PL` — "Oblicz" i "+ Dodaj urządzenie" wracają ✓

---

## Commit

```
fix(i18n): position lang button top-right, add data-i18n to form action buttons
```
