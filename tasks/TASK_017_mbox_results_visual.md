# TASK_017 — Spójność wizualna sekcji wyników M-box

## Zakres

Trzy zmiany wyłącznie w funkcji `calculateMbox()` w `frontend/js/app.js`:

1. **Badge urządzenia** — `DeviceID X | Strefa X` → `Adres: X | Strefa: X`
2. **Blok strefy** — odwrócony header + klasy `zone-block`/`zone-block-header` (zielona ramka)
3. **Rejestry systemowe** — domyślnie ukryte, toggle button, klasy `controller-block`/`controller-block-header` (jaśniejszy niebieski)

---

## Zmiana 1 — Badge urządzenia

Znajdź w `calculateMbox()` blok budowania `devWrapper`:

```js
// PRZED:
    const zoneInfo = zoneNum !== null ? ` &nbsp;|&nbsp; Strefa&nbsp;${zoneNum}` : '';
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">DeviceID&nbsp;${deviceId}${zoneInfo}</span>
      </div>`;

// PO:
    const zoneInfo = zoneNum !== null ? ` &nbsp;|&nbsp; Strefa:&nbsp;${zoneNum}` : '';
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">Adres:&nbsp;${deviceId}${zoneInfo}</span>
      </div>`;
```

---

## Zmiana 2 — Blok strefy (zielona ramka, jak buildZoneSection)

Znajdź w `calculateMbox()` blok budowania `zoneWrapper`:

```js
// PRZED:
      const zoneWrapper = document.createElement('div');
      zoneWrapper.className = 'result-block';
      zoneWrapper.innerHTML = `
        <div class="result-block-header">
          <h3>Rejestry strefowe</h3>
          <span class="badge">Strefa&nbsp;${zoneNum}</span>
        </div>`;

// PO:
      const zoneWrapper = document.createElement('div');
      zoneWrapper.className = 'result-block zone-block';
      zoneWrapper.innerHTML = `
        <div class="result-block-header zone-block-header">
          <h3>Strefa ${zoneNum}</h3>
          <span class="badge">Rejestry strefy</span>
        </div>`;
```

---

## Zmiana 3 — Rejestry systemowe (toggle, jak buildControllerSection)

Zastąp cały blok budowania `sysWrapper` nową strukturą z przyciskiem toggle.

### PRZED:

```js
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
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
  resultsEl.appendChild(sysWrapper);
```

### PO:

```js
  // ---- Sekcja: Rejestry systemowe — domyślnie ukryta, jak buildControllerSection ----
  const sysSection = document.createElement('div');
  sysSection.className = 'controller-section';

  const sysBtn = document.createElement('button');
  sysBtn.type = 'button';
  sysBtn.className = 'btn-controller-toggle';
  sysBtn.textContent = 'Pokaż rejestry systemowe';

  const sysWrapper = document.createElement('div');
  sysWrapper.className = 'result-block controller-block';
  sysWrapper.style.display = 'none';
  sysWrapper.innerHTML = `
    <div class="result-block-header controller-block-header">
      <h3>Rejestry systemowe</h3>
      <span class="badge">M-box</span>
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
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));

  sysBtn.addEventListener('click', () => {
    const isOpen = sysWrapper.style.display !== 'none';
    sysWrapper.style.display = isOpen ? 'none' : 'block';
    sysBtn.textContent = isOpen ? 'Pokaż rejestry systemowe' : 'Ukryj rejestry systemowe';
  });

  sysSection.append(sysBtn, sysWrapper);
  resultsEl.appendChild(sysSection);
```

---

## Weryfikacja

Otwórz `frontend/index.html`, wybierz M-box, wpisz urządzenie ze strefą, kliknij Oblicz:

1. Badge urządzenia: `Adres: 1 | Strefa: 1` (z dwukropkami) ✓
2. Blok strefy: zielona lewa ramka, zielone tło headera, h3 = "Strefa 1",
   badge = "Rejestry strefy" ✓
3. Na górze wyników: przycisk "Pokaż rejestry systemowe" — po kliknięciu
   rozwija blok z jaśniejszym niebieskim headerem (identycznym jak
   "Rejestry sterownika" w T-box Zone) ✓

---

## Commit

```
fix(app): unify M-box results visual — badge labels, zone-block styling, collapsible system registers
```
