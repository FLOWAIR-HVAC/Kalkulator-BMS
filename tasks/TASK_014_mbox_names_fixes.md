# TASK_014 — Standaryzacja nazw M-box, etykieta HR strefy, naprawa przycisków

## Zakres

1. **Issue A** — Etykieta HR w sekcji strefowej T-box Zone: dodaj "— Nastawy"
2. **Issue B** — Standaryzacja 13 nazw urządzeń w `MBOX.devices` (calculator.js)
3. **Issue C** — Naprawa zduplikowanych przycisków formularza (querySelector bug)
4. **Issue D** — Zmiana etykiety "DeviceID:" → "Adres:" w wierszach M-box

---

## Issue A — Etykieta HR w buildZoneSection()

### `frontend/js/app.js`

W funkcji `buildZoneSection()` zmień tytuł sekcji HR:

```js
// PRZED:
block.appendChild(buildRegSection('Holding Registers (HR)', hrRows));

// PO:
block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));
```

---

## Issue B — Standaryzacja nazw urządzeń w MBOX.devices

### `frontend/js/calculator.js`

Zmień 13 kluczy w obiekcie `MBOX.devices`. Każda zmiana to rename klucza
— nie dotykaj zawartości obiektów (hr, ir), tylko nazwy kluczy.

Użyj narzędzia Edit z replace_all: false dla każdej nazwy (są unikalne w pliku).

| Stara nazwa klucza | Nowa nazwa klucza |
|---|---|
| `'LEO D (AC/EC)'` | `'LEO D (DRV D)'` |
| `'ELIS (AC) — kurtyna powietrzna'` | `'ELIS (DRV ELIS)'` |
| `'SLIM (AC) — kurtyna powietrzna'` | `'SLIM (DRV SLIM)'` |
| `'KM — Komora Mieszania'` | `'LEO KM (DRV KM)'` |
| `'LEO M (EC)'` | `'LEO EC (DRV M)'` |
| `'ROOFTOP'` | `'CUBE (DRV CUBE)'` |
| `'LEO V (AC)'` | `'LEO AC (DRV V)'` |
| `'LEO EL (AC)'` | `'LEO EL (DRV EL)'` |
| `'LEO COOL (AC)'` | `'LEO COOL (DRV COOL)'` |
| `'ROBUR R KM NEXT'` | `'ROBUR R KM NEXT (DRV R KM NEXT)'` |
| `'ROBUR R NEXT'` | `'ROBUR R NEXT (DRV R NEXT)'` |
| `'LUNA'` | `'LUNA (DRV LUNA)'` |
| `'OXEN'` | `'OXEN (DRV OXEN)'` |

Przykład edycji dla pierwszego klucza:
```js
// PRZED:
      'LEO D (AC/EC)': {

// PO:
      'LEO D (DRV D)': {
```

Wykonaj analogicznie dla pozostałych 12 kluczy.

---

## Issue C — Naprawa zduplikowanych przycisków

### Problem

W `updateFormForControllerType()` kod:
```js
document.querySelector('.form-actions').style.display = isMbox ? 'none' : '';
```
trafia na PIERWSZY element `.form-actions` w DOM, którym jest `#mbox-actions`
(ukrywa go), a potem ten sam element jest pokazywany przez:
```js
const mboxActions = document.getElementById('mbox-actions');
if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';
```
W efekcie przyciski T-box (drugi `.form-actions`) są zawsze widoczne.

### Poprawka w HTML — oba pliki (`frontend/index.html` i `index.html`)

Dodaj `id="tbox-actions"` do przycisku T-box (ten bez id):

```html
<!-- PRZED: -->
    <div class="form-actions">
      <button id="btn-add-device" type="button">+ Dodaj urządzenie</button>
      <button id="btn-calculate" type="button" class="btn-primary">Oblicz</button>
    </div>

<!-- PO: -->
    <div class="form-actions" id="tbox-actions">
      <button id="btn-add-device" type="button">+ Dodaj urządzenie</button>
      <button id="btn-calculate" type="button" class="btn-primary">Oblicz</button>
    </div>
```

### Poprawka w JS — `frontend/js/app.js`

W funkcji `updateFormForControllerType()` zmień selektor:

```js
// PRZED:
  document.querySelector('.form-actions').style.display = isMbox ? 'none' : '';

// PO:
  document.getElementById('tbox-actions').style.display = isMbox ? 'none' : '';
```

---

## Issue D — Etykieta "DeviceID:" → "Adres:" w wierszach M-box

### `frontend/js/app.js`

W funkcji `addMboxDeviceRow()` zmień tekst etykiety:

```js
// PRZED:
  devIdLabel.textContent = 'DeviceID:';

// PO:
  devIdLabel.textContent = 'Adres:';
```

---

## Kolejność wykonania

1. `frontend/js/calculator.js` — 13 zmian nazw kluczy MBOX.devices
2. `frontend/index.html` — dodaj `id="tbox-actions"` + etykieta HR strefy jest w JS
3. `index.html` (root) — ta sama zmiana `id="tbox-actions"`
4. `frontend/js/app.js` — 3 zmiany:
   - `buildZoneSection()` HR label
   - `updateFormForControllerType()` querySelector → getElementById
   - `addMboxDeviceRow()` DeviceID → Adres

---

## Weryfikacja

Otwórz `frontend/index.html` w przeglądarce:

1. **T-box Zone** → Oblicz → sekcja strefowa → "Holding Registers (HR) — Nastawy" ✓
2. **M-box** → formularz pokazuje jeden zestaw przycisków ("+ Dodaj urządzenie" + "Oblicz") ✓
3. **M-box** → select urządzeń zawiera np. "LEO D (DRV D)", "CUBE (DRV CUBE)" ✓
4. **M-box** → etykieta pola liczbowego to "Adres:" (nie "DeviceID:") ✓
5. **T-box** → po powrocie z M-box przyciski T-box wracają ✓

---

## Commit

```
fix(app,calculator,html): standardize M-box device names, fix duplicate buttons, Adres label, zone HR title
```
