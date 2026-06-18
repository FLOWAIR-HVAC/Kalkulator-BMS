# TASK_018 — Internacjonalizacja (i18n): podpięcie systemu tłumaczeń

## Kontekst

Plik `frontend/js/translations.js` jest już gotowy — zawiera:
- obiekt `TRANSLATIONS` z kluczami PL i EN
- zmienną `currentLang` (z localStorage lub domyślnie 'pl')
- funkcję `t(key, ...params)` — zwraca tłumaczenie z podstawionymi parametrami
- funkcję `setLang(lang)` — zmienia język i przeładowuje stronę
- przycisk języka: `'misc.lang_btn': 'EN'` (w PL) i `'PL'` (w EN) — bez emoji

**Nie modyfikuj `translations.js`** — tylko podepnij go i użyj w pozostałych plikach.

---

## Zakres zmian

### 1. HTML — oba pliki (`frontend/index.html` i `index.html`)

#### a) Dodaj `<script>` dla translations.js

W obu plikach, **przed** `<script src="...devices-data.js">`, dodaj:

W `frontend/index.html`:
```html
<script src="js/translations.js"></script>
```

W `index.html` (root):
```html
<script src="frontend/js/translations.js"></script>
```

#### b) Dodaj przycisk zmiany języka w `<header>`

Za `<p>...</p>` w headerze dodaj:
```html
<button id="btn-lang" class="btn-lang">EN</button>
```

#### c) Dodaj atrybuty `data-i18n` do elementów statycznych

Zamień (oba pliki, analogicznie):

```html
<!-- PRZED: -->
<h1>Kalkulator BMS</h1>
<p>Obliczanie adresów...</p>
<label>Sterownik</label>
<label>Tryb pracy</label>
<label class="mode-tip" data-tip="W tym trybie sterujemy każdym..."><input type="radio" name="mode" value="single" checked> Single</label>
<label class="mode-tip" data-tip="W tym trybie sterujemy grupami..."><input type="radio" name="mode" value="group"> Group</label>
<span>Urządzenia</span>
<h2>Wyniki</h2>
<button id="btn-reset" type="button" class="btn-secondary">Nowe obliczenie</button>
<button id="btn-add-device" type="button">+ Dodaj urządzenie</button>
<button id="btn-calculate" type="button" class="btn-primary">Oblicz</button>
<button id="btn-add-mbox-device" type="button">+ Dodaj urządzenie</button>
<button id="btn-mbox-calculate" type="button" class="btn-primary">Oblicz</button>

<!-- PO: -->
<h1 data-i18n="page.h1">Kalkulator BMS</h1>
<p data-i18n="page.subtitle">Obliczanie adresów rejestrów Modbus dla urządzeń podłączonych do sterowników SYSTEMU FLOWAIR</p>
<label data-i18n="form.controller">Sterownik</label>
<label data-i18n="form.mode">Tryb pracy</label>
<label class="mode-tip" data-i18n-tip="form.mode.single_tip" data-tip="W tym trybie sterujemy każdym urządzeniem indywidualnie, ekran sterownika T-box jest zablokowany"><input type="radio" name="mode" value="single" checked> Single</label>
<label class="mode-tip" data-i18n-tip="form.mode.group_tip" data-tip="W tym trybie sterujemy grupami tych samych urządzeń, ekran sterownika T-box jest odblokowany"><input type="radio" name="mode" value="group"> Group</label>
<span data-i18n="form.devices">Urządzenia</span>
<h2 data-i18n="result.h2">Wyniki</h2>
<button id="btn-reset" type="button" class="btn-secondary" data-i18n="btn.reset">Nowe obliczenie</button>
<button id="btn-add-device" type="button" data-i18n="btn.add_device">+ Dodaj urządzenie</button>
<button id="btn-calculate" type="button" class="btn-primary" data-i18n="btn.calculate">Oblicz</button>
<button id="btn-add-mbox-device" type="button" data-i18n="btn.add_device">+ Dodaj urządzenie</button>
<button id="btn-mbox-calculate" type="button" class="btn-primary" data-i18n="btn.calculate">Oblicz</button>
```

---

### 2. CSS — `frontend/css/style.css`

#### a) Przycisk języka — styl i pozycja w prawym górnym rogu

Dodaj `position: relative` do istniejącej reguły `header`:

```css
header {
  /* ... istniejące właściwości ... */
  position: relative;
}
```

Dodaj nowe reguły (np. na końcu pliku):

```css
/* ---- Przełącznik języka ---- */
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

> Uwaga: `white-space: nowrap` jest już w regule `button {}` — nie dodawaj ponownie.

#### b) `min-width` na `.btn-controller-toggle` — nie dodawaj

Reguła `.btn-controller-toggle` **nie powinna mieć** `min-width` — przycisk ma
mieć naturalną szerokość. Upewnij się, że po tej zmianie reguła NIE zawiera
`min-width` ani `text-align: left`.

---

### 3. `frontend/js/app.js` — pełna lista zmian

#### a) Dodaj funkcję `applyStaticTranslations()` na początku pliku, po deklaracjach zmiennych

```js
// ============================================================
// Tłumaczenia — aktualizacja statycznych elementów DOM
// ============================================================
function applyStaticTranslations() {
  // Elementy z data-i18n — aktualizuj textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // Elementy z data-i18n-tip — aktualizuj atrybut data-tip (CSS tooltip)
  document.querySelectorAll('[data-i18n-tip]').forEach(el => {
    el.setAttribute('data-tip', t(el.getAttribute('data-i18n-tip')));
  });
  // Tytuł strony
  document.title = t('page.title');
  // Przycisk języka — pokazuje kod języka do przełączenia
  const btnLang = document.getElementById('btn-lang');
  if (btnLang) btnLang.textContent = t('misc.lang_btn');
  // Atrybut lang na <html>
  document.documentElement.lang = currentLang;
}
```

#### b) Dodaj event listener dla `btn-lang` w sekcji Zdarzenia (na końcu pliku)

```js
document.getElementById('btn-lang').addEventListener('click', () => {
  setLang(currentLang === 'pl' ? 'en' : 'pl');
});
```

#### c) W `loadDevices()` — wywołaj `applyStaticTranslations()` po inicjalizacji

```js
// PRZED:
  addDeviceRow();
  addDeviceRow();
  addMboxDeviceRow();
  updateFormForControllerType();

// PO:
  addDeviceRow();
  addDeviceRow();
  addMboxDeviceRow();
  updateFormForControllerType();
  applyStaticTranslations();
```

#### d) W `loadDevices()` — błąd brak danych

```js
// PRZED:
    showError('Brak danych urządzeń.');
// PO:
    showError(t('error.no_data'));
```

#### e) W `addDeviceRow()` — etykiety

```js
// PRZED:
  addrLabel.textContent = 'Adres:';
  zoneLabel.textContent = 'Strefa:';
  removeBtn.title = 'Usuń urządzenie';
// PO:
  addrLabel.textContent = t('form.address');
  zoneLabel.textContent = t('form.zone');
  removeBtn.title = t('form.remove_title');
```

#### f) W `addMboxDeviceRow()` — etykiety i domyślna strefa

```js
// PRZED:
  devIdLabel.textContent = 'Adres:';
  zoneLabel.textContent = 'Strefa:';
  removeBtn.title = 'Usuń urządzenie';
  ...
  zoneInput.placeholder = '—';

// PO:
  devIdLabel.textContent = t('form.address');
  zoneLabel.textContent = t('form.zone');
  removeBtn.title = t('form.remove_title');
  ...
  zoneInput.value = 1;
```

#### g) W `validateForm()` — komunikaty błędów

```js
// PRZED:
  if (rows.length === 0) return 'Dodaj co najmniej jedno urządzenie.';
  ...
  if (isNaN(addr) || addr < 1 || addr > 31) {
    return 'Nieprawidłowy adres Modbus (musi być 1–31).';
  }
  if (addrs.includes(addr)) {
    return `Adres Modbus ${addr} jest użyty więcej niż raz. Każde urządzenie musi mieć unikalny adres.`;
  }
  ...
  if (isNaN(zone) || zone < 1 || zone > 31) {
    return 'Nieprawidłowy numer strefy (musi być 1–31).';
  }

// PO:
  if (rows.length === 0) return t('error.no_devices');
  ...
  if (isNaN(addr) || addr < 1 || addr > 31) {
    return t('error.bad_addr');
  }
  if (addrs.includes(addr)) {
    return t('error.dup_addr', addr);
  }
  ...
  if (isNaN(zone) || zone < 1 || zone > 31) {
    return t('error.bad_zone');
  }
```

#### h) W `calculate()` — tekst trybu

```js
// PRZED:
    modeInfo.textContent = 'Tryb: T-box Zone';
  ...
    modeInfo.textContent = `Tryb: ${mode === 'single' ? 'Single (jedno urządzenie)' : 'Group (grupowy)'} — Sterownik: T-box`;

// PO:
    modeInfo.textContent = t('result.mode_tzone');
  ...
    const modeLabel = mode === 'single' ? t('result.mode_single') : t('result.mode_group');
    modeInfo.textContent = t('result.mode_tbox', modeLabel);
```

#### i) W `renderTbox()` — sekcje rejestrów i badge'y

```js
// PRZED:
      block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', tables.ir));
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', tables.hrSingle, 'single'));
      // badge single:
      header.innerHTML = `<h3>${name}</h3><span class="badge">Adres Modbus: ${addr}</span>`;
      // badge group:
      header.innerHTML = `<h3>${name}</h3><span class="badge">Holding Registers — Grupa ${groupNum}</span>`;
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrGroup, 'group'));

// PO:
      block.appendChild(buildRegSection(t('section.ir'), tables.ir));
      block.appendChild(buildRegSection(t('section.hr'), tables.hrSingle, 'single'));
      // badge single:
      header.innerHTML = `<h3>${name}</h3><span class="badge">${mode === 'group'
        ? t('block.addr_modbus_grp', addr, groupNum)
        : t('block.addr_modbus', addr)}</span>`;
      // badge group:
      header.innerHTML = `<h3>${name}</h3><span class="badge">${t('block.group_badge', groupNum)}</span>`;
      block.appendChild(buildRegSection(t('section.hr'), hrGroup, 'group'));
```

#### j) W `renderTboxZone()` — sekcje, badge, opisy rejestrów nagłówkowych

Badge urządzenia:
```js
// PRZED:
      <span class="badge">Adres: ${addr} &nbsp;|&nbsp; Strefa: ${zone}</span>
// PO:
      <span class="badge">${t('block.addr_zone', addr, zone)}</span>
```

Opisy rejestrów nagłówkowych:
```js
// PRZED:
      reg: { description: 'Typ oprogramowania urządzenia (identyfikator modelu)' },
      reg: { description: 'Identyfikator strefy przypisanej do tego urządzenia (1–31)' },
      reg: { description: 'Identyfikator typu urządzenia (software type, lista w rozdz. 2.1 dokumentacji)' },
// PO:
      reg: { description: t('reg.softwaretype') },
      reg: { description: t('reg.zoneid') },
      reg: { description: t('reg.deviceid') },
```

Sekcje rejestrów:
```js
// PRZED:
      block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', [...irHeader, ...ir]));
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', [...hrHeader, ...hrSingle]));
      empty.textContent = 'Brak rejestrów dla tego urządzenia.';
// PO:
      block.appendChild(buildRegSection(t('section.ir'), [...irHeader, ...ir]));
      block.appendChild(buildRegSection(t('section.hr'), [...hrHeader, ...hrSingle]));
      empty.textContent = t('misc.no_regs');
```

#### k) W `buildControllerSection()` — przycisk toggle i nagłówki

```js
// PRZED:
  btn.textContent = 'Pokaż rejestry sterownika';
  blockHeader.innerHTML = `<h3>Rejestry sterownika</h3><span class="badge">...</span>`;
  body.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', irRows));
  body.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));
  btn.textContent = isOpen ? 'Pokaż rejestry sterownika' : 'Ukryj rejestry sterownika';

// PO:
  btn.textContent = t('btn.show_ctrl');
  blockHeader.innerHTML = `<h3>${t('block.ctrl')}</h3><span class="badge">...</span>`;
  body.appendChild(buildRegSection(t('section.ir'), irRows));
  body.appendChild(buildRegSection(t('section.hr'), hrRows));
  btn.textContent = isOpen ? t('btn.show_ctrl') : t('btn.hide_ctrl');
```

#### l) W `buildZoneSection()` — nagłówki i sekcje

```js
// PRZED:
  header.innerHTML = `<h3>Strefa ${zoneNum}</h3><span class="badge">Rejestry strefy</span>`;
  block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', irRows));
  block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));

// PO:
  header.innerHTML = `<h3>${t('block.zone', zoneNum)}</h3><span class="badge">${t('block.zone_badge')}</span>`;
  block.appendChild(buildRegSection(t('section.ir'), irRows));
  block.appendChild(buildRegSection(t('section.hr'), hrRows));
```

#### m) W `buildRegSection()` — nagłówki tabeli

```js
// PRZED:
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Adres HEX</th>
        <th>Adres DEC</th>
        <th>Nazwa rejestru</th>
      </tr>
    </thead>
  `;

// PO:
  table.innerHTML = `
    <thead>
      <tr>
        <th>${t('table.num')}</th>
        <th>${t('table.hex')}</th>
        <th>${t('table.dec')}</th>
        <th>${t('table.name')}</th>
      </tr>
    </thead>
  `;
```

#### n) W `calculateMbox()` — błędy, przyciski, nagłówki, sekcje

Błędy:
```js
// PRZED:
    showError('Dodaj co najmniej jedno urządzenie.');
    showError('DeviceID musi być liczbą od 1 do 32.');
    showError('Numer strefy musi być od 1 do 6.');
// PO:
    showError(t('error.no_devices'));
    showError(t('error.bad_device_id'));
    showError(t('error.bad_zone_mbox'));
```

Rejestry systemowe (toggle):
```js
// PRZED:
  sysBtn.textContent = 'Pokaż rejestry systemowe';
  sysWrapper.innerHTML = `
    <div class="result-block-header controller-block-header">
      <h3>Rejestry systemowe</h3>
      <span class="badge">M-box</span>
    </div>`;
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
  sysBtn.textContent = isOpen ? 'Pokaż rejestry systemowe' : 'Ukryj rejestry systemowe';

// PO:
  sysBtn.textContent = t('btn.show_sys');
  sysWrapper.innerHTML = `
    <div class="result-block-header controller-block-header">
      <h3>${t('block.sys')}</h3>
      <span class="badge">${t('block.sys_badge')}</span>
    </div>`;
  sysWrapper.appendChild(buildRegSection(t('section.ir'), sysIrRows));
  sysWrapper.appendChild(buildRegSection(t('section.hr_rw'), sysHrRows));
  sysBtn.textContent = isOpen ? t('btn.show_sys') : t('btn.hide_sys');
```

Badge urządzenia:
```js
// PRZED:
    const zoneInfo = zoneNum !== null ? ` &nbsp;|&nbsp; Strefa:&nbsp;${zoneNum}` : '';
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">Adres:&nbsp;${deviceId}${zoneInfo}</span>
      </div>`;
    devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));
    devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));

// PO:
    const addrBadge = zoneNum !== null
      ? t('block.addr_zone', deviceId, zoneNum)
      : t('block.addr_only', deviceId);
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">${addrBadge}</span>
      </div>`;
    devWrapper.appendChild(buildRegSection(t('section.ir'), devIrRows));
    devWrapper.appendChild(buildRegSection(t('section.hr_rw'), devHrRows));
```

Blok strefowy:
```js
// PRZED:
      zoneWrapper.innerHTML = `
        <div class="result-block-header zone-block-header">
          <h3>Strefa ${zoneNum}</h3>
          <span class="badge">Rejestry strefy</span>
        </div>`;
      zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));
      zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));

// PO:
      zoneWrapper.innerHTML = `
        <div class="result-block-header zone-block-header">
          <h3>${t('block.zone', zoneNum)}</h3>
          <span class="badge">${t('block.zone_badge')}</span>
        </div>`;
      zoneWrapper.appendChild(buildRegSection(t('section.ir'), zoneIrRows));
      zoneWrapper.appendChild(buildRegSection(t('section.hr_rw'), zoneHrRows));
```

---

### 4. `frontend/js/calculator.js` — obsługa description_en

W funkcji `renderValueInfo(reg)` zmień fragment wyświetlający opis rejestru:

```js
// PRZED (ok. linia 82):
    if (reg.description) {
      parts.push(`<div class="val-desc">${reg.description}</div>`);
    }

// PO:
    const regDesc = (currentLang === 'en' && reg.description_en)
      ? reg.description_en
      : reg.description;
    if (regDesc) {
      parts.push(`<div class="val-desc">${regDesc}</div>`);
    }
```

> Zmienna `currentLang` pochodzi z `translations.js`, który jest ładowany przed `calculator.js` — jest dostępna globalnie.

---

## Kolejność wykonania

1. HTML `frontend/index.html` — script tag, btn-lang, data-i18n atrybuty (w tym 4 przyciski formularza)
2. HTML `index.html` (root) — identyczne zmiany (inna ścieżka script src)
3. CSS `frontend/css/style.css` — `position:relative` na `header`, styl `.btn-lang` z absolute positioning; upewnienie się że `.btn-controller-toggle` nie ma `min-width`
4. JS `frontend/js/app.js` — wszystkie zmiany wg pkt a–n
5. JS `frontend/js/calculator.js` — mechanizm `description_en` w `renderValueInfo`

---

## Weryfikacja

1. Otwórz `frontend/index.html` — strona ładuje się po polsku, przycisk **PL/EN** w prawym górnym rogu nagłówka ✓
2. Kliknij **EN** — strona przeładowuje się po angielsku:
   - tytuł: "BMS Calculator — Modbus Registers"
   - "Controller", "Operating mode", "Devices"
   - "Calculate", "+ Add device" (oba formularze: T-box i M-box) ✓
3. Oblicz dla T-box Single — wyniki po angielsku: "Input Registers (IR) — read only",
   "Holding Registers (HR) — Settings", "Modbus address: 1" ✓
4. Kliknij **PL** — wraca do polskiego ✓
5. Odśwież stronę — zapamiętany język pozostaje ✓
6. Przycisk "Show controller registers" ma naturalną szerokość (nie rozciąga się) ✓

---

## Commit

```
feat(i18n): add PL/EN language switcher — translations.js + full t() refactor in app.js + calculator.js description_en support
```
