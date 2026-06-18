# TASK_012 — Poprawki UI: etykiety HR, formularz M-box, widoczność strefy

## Zakres

Cztery niezależne poprawki w `frontend/js/app.js` + oba pliki HTML:

1. **Issue 2** — Zmiana etykiet HR w T-box (Single/Group mode → Nastawy z badge)
2. **Issue 3** — Zmiana etykiety HR w T-box Zone (Single mode → Nastawy)
3. **Issue 4** — Przeprojektowanie formularza M-box na wiersze dynamiczne (wzór T-box Zone)
4. **Issue 5** — Naprawa widoczności pola Strefa po zmianie sterownika

> ⚠️ **Issue 1 (CUBE group HR) jest pominięty** — `holding_registers_group` w
> `devices/drv_cube.json` jest puste, brak dokumentacji Flowair. Nie zmieniaj tego
> pliku.

---

## 1. Issue 5 — Naprawa widoczności pola Strefa w wierszach urządzeń

### `frontend/js/app.js` — funkcja `updateFormForControllerType()`

Obecna funkcja NIE aktualizuje `.zone-field` w dynamicznie dodanych wierszach.
Wiersze są tworzone w `addDeviceRow()` ze stylem `display:flex` lub `display:none`
w zależności od stanu w momencie dodania, ale po zmianie sterownika nie są
aktualizowane.

**Zmiana:** Za blokiem obsługującym `.zone-header-row` dodaj analogiczny blok dla
`.zone-field`. Oraz zastąp obsługę `mbox-form` obsługą `mbox-devices-container`
(patrz Issue 4 poniżej).

Zastąp całą funkcję `updateFormForControllerType()` nową wersją:

```js
function updateFormForControllerType() {
  const val = document.getElementById('controllerType').value;
  const isTboxZone = val === 'tbox_zone';
  const isMbox     = val === 'mbox';

  // Tryb pracy — widoczny tylko dla T-box klasycznego
  document.getElementById('mode-field').style.display = (isTboxZone || isMbox) ? 'none' : '';

  // Nagłówki ZoneID/DeviceID — tylko T-box Zone
  document.querySelectorAll('.zone-header-row').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Pola stref w istniejących wierszach urządzeń — tylko T-box Zone
  document.querySelectorAll('.zone-field').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Sekcja urządzeń T-box
  document.getElementById('devices-container').style.display = isMbox ? 'none' : '';

  // Kontener urządzeń M-box (dynamiczne wiersze)
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) mboxContainer.style.display = isMbox ? 'block' : 'none';

  // Przyciski formularza T-box
  document.querySelector('.form-actions').style.display = isMbox ? 'none' : '';

  // Przyciski formularza M-box
  const mboxActions = document.getElementById('mbox-actions');
  if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';

  // Przebuduj opcje w selektach urządzeń T-box (tylko gdy nie M-box)
  if (!isMbox) {
    const names = Object.keys(devices)
      .filter(name => isTboxZone || !devices[name].tbox_zone_only)
      .sort();

    document.querySelectorAll('.device-row select[id^="device-"]').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = names.map(n =>
        `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`
      ).join('');
      if (!names.includes(current) && names.length > 0) sel.value = names[0];
    });
  }
}
```

---

## 2. Issue 2 — Etykiety HR w renderTbox() i buildControllerSection()

### `frontend/js/app.js` — funkcja `renderTbox()`

Zmień dwa wywołania `buildRegSection`:

**a)** Single mode — linia z tekstem `'Holding Registers (HR) — Single mode'`:

```js
// PRZED:
block.appendChild(buildRegSection('Holding Registers (HR) — Single mode', tables.hrSingle));

// PO:
block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', tables.hrSingle, 'single'));
```

**b)** Group mode — linia z tekstem `'Holding Registers (HR) — Group mode'`:

```js
// PRZED:
block.appendChild(buildRegSection('Holding Registers (HR) — Group mode', hrGroup, 'group'));

// PO:
block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrGroup, 'group'));
```

### `frontend/js/app.js` — funkcja `buildControllerSection()`

Linia z `'Holding Registers (HR)'` (rejestr sterownika):

```js
// PRZED:
body.appendChild(buildRegSection('Holding Registers (HR)', hrRows));

// PO:
body.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));
```

---

## 3. Issue 3 — Etykieta HR w renderTboxZone()

### `frontend/js/app.js` — funkcja `renderTboxZone()`

Linia z `'Holding Registers (HR) — Single mode'`:

```js
// PRZED:
block.appendChild(buildRegSection('Holding Registers (HR) — Single mode', [...hrHeader, ...hrSingle]));

// PO:
block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', [...hrHeader, ...hrSingle]));
```

---

## 4. Issue 4 — Nowy formularz M-box (dynamiczne wiersze)

Cel: formularz M-box ma działać jak T-box Zone — wiele wierszy urządzeń, każdy z:
- selectem typu urządzenia (klucze z `Calculator.MBOX.devices`)
- polem DeviceID (liczba 1–32)
- polem Strefa (liczba 1–6, opcjonalne)
- przyciskiem "×" (usuń wiersz)

### 4a. Zmiany HTML — oba pliki (`frontend/index.html` i `index.html`)

Zastąp całą sekcję `<div id="mbox-form">` + `<div class="form-actions" id="mbox-actions">`:

```html
    <div id="mbox-devices-container" style="display:none">
      <!-- Wiersze urządzeń M-box dodawane dynamicznie -->
    </div>

    <div class="form-actions" id="mbox-actions" style="display:none">
      <button id="btn-add-mbox-device" type="button">+ Dodaj urządzenie</button>
      <button id="btn-mbox-calculate" type="button" class="btn-primary">Oblicz</button>
    </div>
```

Uwaga: `index.html` (root) i `frontend/index.html` muszą być identyczne w tej sekcji
(różnią się tylko ścieżkami `src` skryptów — tych nie ruszaj).

### 4b. Nowa zmienna `mboxRowCount` — `frontend/js/app.js`

Na początku pliku, za linią `let deviceRowCount = 0;`, dodaj:

```js
let mboxRowCount = 0;
```

### 4c. Nowa funkcja `addMboxDeviceRow()` — `frontend/js/app.js`

Wstaw po funkcji `addDeviceRow()` (przed `validateForm()`):

```js
// ============================================================
// Dodawanie wierszy urządzeń M-box
// ============================================================
function addMboxDeviceRow() {
  const id = ++mboxRowCount;
  const mboxNames = Object.keys(Calculator.MBOX.devices);

  const row = document.createElement('div');
  row.className = 'device-row mbox-device-row';
  row.dataset.mboxRowId = id;

  // Select typu urządzenia M-box
  const select = document.createElement('select');
  select.id = `mbox-dev-type-${id}`;
  mboxNames.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  // DeviceID
  const devIdLabel = document.createElement('label');
  devIdLabel.textContent = 'DeviceID:';
  devIdLabel.htmlFor = `mbox-dev-id-${id}`;

  const devIdInput = document.createElement('input');
  devIdInput.type = 'number';
  devIdInput.id = `mbox-dev-id-${id}`;
  devIdInput.min = 1;
  devIdInput.max = 32;
  devIdInput.value = id;

  // Strefa (opcjonalna)
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
  document.getElementById('mbox-devices-container').appendChild(row);
}
```

### 4d. Nowa wersja funkcji `calculateMbox()` — `frontend/js/app.js`

Zastąp całą obecną funkcję `calculateMbox()`:

```js
// ============================================================
// Render: M-box (Modbus TCP)
// ============================================================
function calculateMbox() {
  hideError();

  const rows = document.querySelectorAll('.mbox-device-row');
  if (rows.length === 0) {
    showError('Dodaj co najmniej jedno urządzenie.');
    return;
  }

  // Walidacja i zebranie danych
  const selectedDevices = [];
  for (const row of rows) {
    const rowId     = row.dataset.mboxRowId;
    const deviceType = document.getElementById(`mbox-dev-type-${rowId}`).value;
    const deviceId   = parseInt(document.getElementById(`mbox-dev-id-${rowId}`).value, 10);
    const zoneRaw    = document.getElementById(`mbox-zone-${rowId}`).value;
    const zoneNum    = zoneRaw ? parseInt(zoneRaw, 10) : null;

    if (!deviceId || deviceId < 1 || deviceId > 32) {
      showError('DeviceID musi być liczbą od 1 do 32.');
      return;
    }
    if (zoneNum !== null && (zoneNum < 1 || zoneNum > 6)) {
      showError('Numer strefy musi być od 1 do 6.');
      return;
    }
    selectedDevices.push({ deviceType, deviceId, zoneNum });
  }

  const mbox     = Calculator.MBOX;
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  // ---- Sekcja: Rejestry systemowe (raz dla całego M-box) ----
  const sysWrapper = document.createElement('div');
  sysWrapper.className = 'result-block';
  sysWrapper.innerHTML = `
    <div class="result-block-header">
      <h3>Rejestry systemowe</h3>
      <span class="badge">M-box System</span>
    </div>`;

  const sysHrRows = mbox.systemHR.map(r => ({
    addrDec: Calculator.calcMboxSystemAddress(r.n),
    addrHex: Calculator.toHex(Calculator.calcMboxSystemAddress(r.n)),
    name: r.name,
    reg: r,
  }));
  const sysIrRows = mbox.systemIR.map(r => ({
    addrDec: Calculator.calcMboxSystemAddress(r.n),
    addrHex: Calculator.toHex(Calculator.calcMboxSystemAddress(r.n)),
    name: r.name,
    reg: r,
  }));
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  resultsEl.appendChild(sysWrapper);

  // ---- Sekcje urządzeń — po jednej na każdy wiersz ----
  const processedZones = new Set();

  selectedDevices.forEach(({ deviceType, deviceId, zoneNum }) => {
    const devDef = mbox.devices[deviceType];
    if (!devDef) return;

    // Blok urządzenia
    const devWrapper = document.createElement('div');
    devWrapper.className = 'result-block';
    const zoneInfo = zoneNum !== null ? ` &nbsp;|&nbsp; Strefa&nbsp;${zoneNum}` : '';
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">DeviceID&nbsp;${deviceId}${zoneInfo}</span>
      </div>`;

    const devHrRows = devDef.hr.map(r => ({
      addrDec: Calculator.calcMboxDeviceAddress(deviceId, r.n),
      addrHex: Calculator.toHex(Calculator.calcMboxDeviceAddress(deviceId, r.n)),
      name: r.name,
      reg: r,
    }));
    const devIrRows = devDef.ir.map(r => ({
      addrDec: Calculator.calcMboxDeviceAddress(deviceId, r.n),
      addrHex: Calculator.toHex(Calculator.calcMboxDeviceAddress(deviceId, r.n)),
      name: r.name,
      reg: r,
    }));
    devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));
    devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));
    resultsEl.appendChild(devWrapper);

    // Blok strefowy — raz na unikalną strefę
    if (zoneNum !== null && !processedZones.has(zoneNum)) {
      processedZones.add(zoneNum);

      const zoneWrapper = document.createElement('div');
      zoneWrapper.className = 'result-block';
      zoneWrapper.innerHTML = `
        <div class="result-block-header">
          <h3>Rejestry strefowe</h3>
          <span class="badge">Strefa&nbsp;${zoneNum}</span>
        </div>`;

      const zoneHrRows = mbox.zoneHR.map(r => ({
        addrDec: Calculator.calcMboxZoneAddress(zoneNum, r.n),
        addrHex: Calculator.toHex(Calculator.calcMboxZoneAddress(zoneNum, r.n)),
        name: r.name,
        reg: r,
      }));
      const zoneIrRows = mbox.zoneIR.map(r => ({
        addrDec: Calculator.calcMboxZoneAddress(zoneNum, r.n),
        addrHex: Calculator.toHex(Calculator.calcMboxZoneAddress(zoneNum, r.n)),
        name: r.name,
        reg: r,
      }));
      zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));
      zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));
      resultsEl.appendChild(zoneWrapper);
    }
  });

  document.getElementById('results').style.display = 'block';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
```

### 4e. Aktualizacja `resetForm()` — `frontend/js/app.js`

Zastąp cały blok "Reset pól M-box" w funkcji `resetForm()`:

```js
// PRZED:
  // Reset pól M-box
  const mboxDevType = document.getElementById('mbox-device-type');
  const mboxDevId   = document.getElementById('mbox-device-id');
  const mboxZoneNum = document.getElementById('mbox-zone-num');
  if (mboxDevType) mboxDevType.value = '';
  if (mboxDevId)   mboxDevId.value = '1';
  if (mboxZoneNum) mboxZoneNum.value = '';

// PO:
  // Reset wierszy M-box — wyczyść i dodaj jeden pusty wiersz
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) {
    mboxContainer.innerHTML = '';
    mboxRowCount = 0;
    addMboxDeviceRow();
  }
```

### 4f. Aktualizacja `loadDevices()` — `frontend/js/app.js`

Dopisz wywołanie `addMboxDeviceRow()` po istniejących wywołaniach `addDeviceRow()`:

```js
// PRZED:
  addDeviceRow();
  addDeviceRow();
  updateFormForControllerType();

// PO:
  addDeviceRow();
  addDeviceRow();
  addMboxDeviceRow();
  updateFormForControllerType();
```

### 4g. Aktualizacja event listenerów — `frontend/js/app.js`

Na końcu pliku, w sekcji `// Zdarzenia`, dopisz listener dla nowego przycisku:

```js
// Dodaj po linii: document.getElementById('btn-mbox-calculate').addEventListener(...)
document.getElementById('btn-add-mbox-device').addEventListener('click', addMboxDeviceRow);
```

---

## Kolejność wykonania

1. Zmiany HTML w `frontend/index.html` (sekcja mbox-form → mbox-devices-container)
2. Te same zmiany HTML w `index.html` (root)
3. Zmiany w `frontend/js/app.js`:
   a. Dodaj `let mboxRowCount = 0;`
   b. Zastąp `updateFormForControllerType()`
   c. Zmień 3 etykiety w `renderTbox()` i `buildControllerSection()`
   d. Zmień etykietę w `renderTboxZone()`
   e. Dodaj `addMboxDeviceRow()`
   f. Zastąp `calculateMbox()`
   g. Zaktualizuj `resetForm()`
   h. Zaktualizuj `loadDevices()`
   i. Dodaj event listener `btn-add-mbox-device`

---

## Weryfikacja

Po zmianach otwórz `frontend/index.html` w przeglądarce i sprawdź:

1. **T-box Single** — sekcja wyników zawiera "Holding Registers (HR) — Nastawy" z badge SINGLE
2. **T-box Group** — sekcja wyników zawiera "Holding Registers (HR) — Nastawy" z badge GROUP;
   sekcja sterownika zawiera "Holding Registers (HR) — Nastawy"
3. **T-box Zone** — sekcja wyników urządzenia zawiera "Holding Registers (HR) — Nastawy"
4. **T-box → T-box Zone** — po zmianie sterownika w istniejących wierszach pojawia się pole
   "Strefa:"
5. **M-box** — formularz wyświetla dynamiczne wiersze z selectem urządzenia, DeviceID, Strefą;
   przycisk "+ Dodaj urządzenie" działa; obliczanie iteruje po wszystkich wierszach
6. **M-box → T-box** → formularz M-box chowa się, T-box wraca

---

## Commit

```
fix(app,html): rename HR sections to Nastawy, redesign M-box form, fix zone field visibility
```
