# TASK_015 — Kolejność IR/HR w M-box + spójność wizualna formularza

## Zakres

1. **Issue A** — W wynikach M-box: zamień kolejność sekcji — najpierw IR, potem HR
   (tak jak w T-box i T-box Zone)
2. **Issue B** — Formularz M-box: owinąć "Strefa" w `span.zone-field`, tak jak
   jest to zrobione w `addDeviceRow()` — zapewni identyczny wygląd z T-box Zone

Oba problemy dotyczą wyłącznie `frontend/js/app.js`.

---

## Issue A — Kolejność IR/HR w calculateMbox()

### Kontekst

Funkcja `calculateMbox()` buduje 3 typy bloków: systemowy, urządzenia, strefowy.
W każdym HR jest appendowany przed IR. Zamień kolejność we wszystkich trzech miejscach.

### Zmiana 1 — blok systemowy (linie ~689–690)

```js
// PRZED:
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));

// PO:
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
```

### Zmiana 2 — blok urządzenia (linie ~722–723)

```js
// PRZED:
    devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));
    devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));

// PO:
    devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));
    devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));
```

### Zmiana 3 — blok strefowy (linie ~750–751)

```js
// PRZED:
      zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));
      zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));

// PO:
      zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));
      zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));
```

---

## Issue B — Spójność wizualna formularza M-box

### Problem

W `addDeviceRow()` (T-box Zone) etykieta i pole "Strefa" są opakowane w
`<span class="zone-field">` z `display:flex; align-items:center; gap:4px`.
To zapewnia poprawne odstępy i wyrównanie.

W `addMboxDeviceRow()` etykieta i pole "Strefa" są dodane bezpośrednio do
wiersza jako luźne elementy — stąd inne odstępy, brak wyrównania.

### Zmiana — funkcja `addMboxDeviceRow()`

Zastąp cały blok tworzenia zoneLabel + zoneInput + row.append:

```js
// PRZED:
  const zoneLabel = document.createElement('label');
  zoneLabel.textContent = 'Strefa:';
  zoneLabel.htmlFor = `mbox-zone-${id}`;

  const zoneInput = document.createElement('input');
  zoneInput.type = 'number';
  zoneInput.id = `mbox-zone-${id}`;
  zoneInput.min = 1;
  zoneInput.max = 6;
  zoneInput.placeholder = '—';

  // Przycisk usunięcia
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.title = 'Usuń urządzenie';
  removeBtn.onclick = () => row.remove();

  row.append(select, devIdLabel, devIdInput, zoneLabel, zoneInput, removeBtn);

// PO:
  // Pole Strefa — opakowane w span.zone-field jak w addDeviceRow()
  const zoneField = document.createElement('span');
  zoneField.className = 'zone-field';
  zoneField.style.cssText = 'display:flex; align-items:center; gap:4px;';

  const zoneLabel = document.createElement('label');
  zoneLabel.textContent = 'Strefa:';
  zoneLabel.htmlFor = `mbox-zone-${id}`;

  const zoneInput = document.createElement('input');
  zoneInput.type = 'number';
  zoneInput.id = `mbox-zone-${id}`;
  zoneInput.min = 1;
  zoneInput.max = 6;
  zoneInput.placeholder = '—';

  zoneField.append(zoneLabel, zoneInput);

  // Przycisk usunięcia
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.title = 'Usuń urządzenie';
  removeBtn.onclick = () => row.remove();

  row.append(select, devIdLabel, devIdInput, zoneField, removeBtn);
```

> Uwaga: id `mbox-zone-${id}` na zoneInput pozostaje bez zmian — calculateMbox()
> nadal odczytuje wartość przez `document.getElementById('mbox-zone-' + rowId)`,
> co działa niezależnie od tego, w jakim kontenerze element się znajduje.

---

## Weryfikacja

Otwórz `frontend/index.html` w przeglądarce:

1. **M-box → Oblicz** — w każdej sekcji wynikowej najpierw Input Registers (IR),
   potem Holding Registers (HR) ✓
2. **M-box formularz** — wiersz urządzenia wygląda identycznie jak wiersz
   w T-box Zone: etykiety mają tę samą czcionkę i odstępy, "Strefa" z polem
   jest odsunięta tak samo jak w T-box Zone, przycisk "×" jest przy prawej
   krawędzi ✓

---

## Commit

```
fix(app): swap IR/HR order in M-box results, fix zone-field wrapper for visual consistency
```
