/**
 * app.js — Główna logika UI kalkulatora BMS
 */

let devices = {};
let deviceRowCount = 0;
let mboxRowCount = 0;

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
  // Elementy z data-i18n-title — aktualizuj atrybut title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  // Tytuł strony
  document.title = t('page.title');
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  // Atrybut lang na <html>
  document.documentElement.lang = currentLang;
}

// ============================================================
// Inicjalizacja
// ============================================================
function loadDevices() {
  devices = DEVICES_DATA;
  const names = Object.keys(devices).sort();
  if (names.length === 0) {
    showError(t('error.no_data'));
    return;
  }
  addDeviceRow();
  addDeviceRow();
  addMboxDeviceRow();
  updateFormForControllerType();
  applyStaticTranslations();
}

// ============================================================
// Zmiana sterownika — aktualizacja formularza
// ============================================================
function updateFormForControllerType() {
  const val = document.getElementById('controllerType').value;
  const isTboxZone = val === 'tbox_zone';
  const isMbox     = val === 'mbox';
  const isHmiWifi  = val === 'hmi_wifi_ac';

  // Tryb pracy — widoczny tylko dla T-box klasycznego
  document.getElementById('mode-field').style.display = (isTboxZone || isMbox || isHmiWifi) ? 'none' : '';

  // Nagłówki ZoneID/DeviceID — tylko T-box Zone
  document.querySelectorAll('.zone-header-row').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Pola stref w wierszach T-box — tylko T-box Zone (nie dotykaj M-box zone-field)
  document.querySelectorAll('#devices-container .zone-field').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Etykieta "Urządzenia" — ukryta gdy brak listy urządzeń w formularzu
  const devHeader = document.querySelector('.devices-header');
  if (devHeader) devHeader.style.display = isHmiWifi ? 'none' : '';

  // Sekcja urządzeń T-box
  document.getElementById('devices-container').style.display = (isMbox || isHmiWifi) ? 'none' : '';

  // Kontener urządzeń M-box (dynamiczne wiersze)
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) mboxContainer.style.display = isMbox ? 'block' : 'none';

  // Przyciski formularza T-box
  document.getElementById('tbox-actions').style.display = (isMbox || isHmiWifi) ? 'none' : '';

  // Przyciski formularza M-box
  const mboxActions = document.getElementById('mbox-actions');
  if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';

  // Przyciski formularza HMI Wi-Fi AC
  const hmiActions = document.getElementById('hmi-actions');
  if (hmiActions) hmiActions.style.display = isHmiWifi ? 'flex' : 'none';

  // Przebuduj opcje w selektach urządzeń T-box (tylko gdy nie M-box i nie HMI)
  if (!isMbox && !isHmiWifi) {
    const names = Object.keys(devices)
      .filter(name => isTboxZone || !devices[name].tbox_zone_only)
      .sort();

    document.querySelectorAll('#devices-container .device-row select[id^="device-"]').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = names.map(n =>
        `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`
      ).join('');
      if (!names.includes(current) && names.length > 0) sel.value = names[0];
    });
  }
}

// ============================================================
// Dodawanie wierszy urządzeń
// ============================================================
function addDeviceRow() {
  const id = ++deviceRowCount;
  const isTboxZone = document.getElementById('controllerType').value === 'tbox_zone';
  const names = Object.keys(devices)
    .filter(name => isTboxZone || !devices[name].tbox_zone_only)
    .sort();

  const row = document.createElement('div');
  row.className = 'device-row';
  row.dataset.rowId = id;

  const select = document.createElement('select');
  select.id = `device-${id}`;
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const addrLabel = document.createElement('label');
  addrLabel.textContent = t('form.address');
  addrLabel.setAttribute('data-i18n', 'form.address');
  addrLabel.htmlFor = `addr-${id}`;

  const addrInput = document.createElement('input');
  addrInput.type = 'number';
  addrInput.id = `addr-${id}`;
  addrInput.min = 1;
  addrInput.max = 31;
  addrInput.value = id;

  // Pole Strefa (widoczne tylko w T-box Zone)
  const zoneField = document.createElement('span');
  zoneField.className = 'zone-field';
  zoneField.style.cssText = `display:${isTboxZone ? 'flex' : 'none'}; align-items:center; gap:4px;`;

  const zoneLabel = document.createElement('label');
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  zoneLabel.htmlFor = `zone-${id}`;

  const zoneInput = document.createElement('input');
  zoneInput.type = 'number';
  zoneInput.id = `zone-${id}`;
  zoneInput.min = 1;
  zoneInput.max = 31;
  zoneInput.value = 1;

  zoneField.append(zoneLabel, zoneInput);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.title = t('form.remove_title');
  removeBtn.setAttribute('data-i18n-title', 'form.remove_title');
  removeBtn.onclick = () => row.remove();

  row.append(select, addrLabel, addrInput, zoneField, removeBtn);
  document.getElementById('devices-container').appendChild(row);
}

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
  devIdLabel.textContent = t('form.address');
  devIdLabel.setAttribute('data-i18n', 'form.address');
  devIdLabel.htmlFor = `mbox-dev-id-${id}`;

  const devIdInput = document.createElement('input');
  devIdInput.type = 'number';
  devIdInput.id = `mbox-dev-id-${id}`;
  devIdInput.min = 1;
  devIdInput.max = 32;
  devIdInput.value = id;

  // Strefa (opcjonalna)
  // Pole Strefa — opakowane w span.zone-field jak w addDeviceRow()
  const zoneField = document.createElement('span');
  zoneField.className = 'zone-field';
  zoneField.style.cssText = 'display:flex; align-items:center; gap:4px;';

  const zoneLabel = document.createElement('label');
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  zoneLabel.htmlFor = `mbox-zone-${id}`;

  const zoneInput = document.createElement('input');
  zoneInput.type = 'number';
  zoneInput.id = `mbox-zone-${id}`;
  zoneInput.min = 1;
  zoneInput.max = 6;
  zoneInput.value = 1;

  zoneField.append(zoneLabel, zoneInput);

  // Przycisk usunięcia
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.title = t('form.remove_title');
  removeBtn.onclick = () => row.remove();

  row.append(select, devIdLabel, devIdInput, zoneField, removeBtn);
  document.getElementById('mbox-devices-container').appendChild(row);
}

// ============================================================
// Walidacja formularza
// ============================================================
function validateForm() {
  const rows = document.querySelectorAll('#devices-container .device-row');
  if (rows.length === 0) return t('error.no_devices');

  const isTboxZone = document.getElementById('controllerType').value === 'tbox_zone';
  const addrs = [];

  for (const row of rows) {
    const id = row.dataset.rowId;
    const addr = parseInt(document.getElementById(`addr-${id}`).value);
    if (isNaN(addr) || addr < 1 || addr > 31) {
      return t('error.bad_addr');
    }
    if (addrs.includes(addr)) {
      return t('error.dup_addr', addr);
    }
    addrs.push(addr);

    if (isTboxZone) {
      const zone = parseInt(document.getElementById(`zone-${id}`).value);
      if (isNaN(zone) || zone < 1 || zone > 31) {
        return t('error.bad_zone');
      }
    }
  }
  return null;
}

// ============================================================
// Główna funkcja obliczeniowa
// ============================================================
function calculate() {
  hideError();
  const controllerType = document.getElementById('controllerType').value;

  // HMI Wi-Fi AC — nie potrzebuje urządzeń ani trybu
  if (controllerType === 'hmi_wifi_ac') {
    showHmiWifiAcResults();
    return;
  }

  const err = validateForm();
  if (err) { showError(err); return; }
  const isTboxZone = controllerType === 'tbox_zone';

  const selectedDevices = [];
  document.querySelectorAll('#devices-container .device-row').forEach(row => {
    const id   = row.dataset.rowId;
    const name = document.getElementById(`device-${id}`).value;
    const addr = parseInt(document.getElementById(`addr-${id}`).value);
    const zone = isTboxZone ? parseInt(document.getElementById(`zone-${id}`).value) : null;
    selectedDevices.push({ name, addr, zone });
  });

  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const modeInfo = document.createElement('div');
  modeInfo.style.cssText = 'margin-bottom:12px; font-size:12px; color:#667;';

  if (isTboxZone) {
    modeInfo.textContent = t('result.mode_tzone');
    resultsEl.appendChild(modeInfo);
    renderTboxZone(resultsEl, selectedDevices);
  } else {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const modeLabel = mode === 'single' ? t('result.mode_single') : t('result.mode_group');
    modeInfo.textContent = t('result.mode_tbox', modeLabel);
    resultsEl.appendChild(modeInfo);
    renderTbox(resultsEl, selectedDevices, mode);
  }

  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Render: HMI Wi-Fi AC
// ============================================================
function showHmiWifiAcResults() {
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'result-block controller-block';

  const header = document.createElement('div');
  header.className = 'result-block-header controller-block-header';
  header.innerHTML = '<h3>HMI Wi-Fi AC</h3><span class="badge">Modbus RTU — FC03 / FC06</span>';
  block.appendChild(header);

  const roRows = Calculator.HMI_WIFI_AC.regs
    .filter(r => r.rw === 'RO')
    .map(r => ({ addrDec: r.addr, addrHex: Calculator.toHex(r.addr), name: r.name, reg: r }));

  const rwRows = Calculator.HMI_WIFI_AC.regs
    .filter(r => r.rw === 'R/W')
    .map(r => ({ addrDec: r.addr, addrHex: Calculator.toHex(r.addr), name: r.name, reg: r }));

  if (roRows.length > 0) block.appendChild(buildRegSection(t('section.ir'), roRows));
  if (rwRows.length > 0) block.appendChild(buildRegSection(t('section.hr_rw'), rwRows));

  resultsEl.appendChild(block);

  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Render: T-box (tryb klasyczny)
// ============================================================
function renderTbox(resultsEl, selectedDevices, mode) {
  resultsEl.appendChild(buildControllerSection('tbox', mode));

  const selectedNames = selectedDevices.map(d => d.name);
  const groupMap = Calculator.assignGroupNumbers(selectedNames, devices);

  // Blok urządzenia: IR dla każdego adresu + HR Single tylko w trybie single
  selectedDevices.forEach(({ name, addr }) => {
    const device = devices[name];
    if (!device) return;

    const groupNum = groupMap[name] ?? 1;
    const tables = Calculator.buildRegisterTable(device, addr, mode, groupNum);

    const block = document.createElement('div');
    block.className = 'result-block';

    const header = document.createElement('div');
    header.className = 'result-block-header';
    header.innerHTML = `
      <h3>${name}</h3>
      <span class="badge">${mode === 'group'
        ? t('block.addr_modbus_grp', addr, groupNum)
        : t('block.addr_modbus', addr)}</span>
    `;
    block.appendChild(header);

    if (tables.ir.length > 0) {
      block.appendChild(buildRegSection(t('section.ir'), tables.ir));
    }

    if (mode === 'single' && tables.hrSingle.length > 0) {
      block.appendChild(buildRegSection(t('section.hr'), tables.hrSingle, 'single'));
    }

    resultsEl.appendChild(block);
  });

  // W trybie group: HR raz na każdy unikalny typ urządzenia, posortowane po numerze grupy
  if (mode === 'group') {
    const uniqueDeviceNames = [...new Set(selectedDevices.map(d => d.name))];
    uniqueDeviceNames.sort((a, b) => (groupMap[a] ?? 999) - (groupMap[b] ?? 999));

    uniqueDeviceNames.forEach(name => {
      const device = devices[name];
      if (!device) return;

      const groupNum = groupMap[name] ?? 1;
      const hrGroup = (device.holding_registers_group || []).map(reg => ({
        addrDec: Calculator.calcGroupAddress(reg.offset, groupNum),
        addrHex: Calculator.toHex(Calculator.calcGroupAddress(reg.offset, groupNum)),
        name:    reg.name,
        reg:     reg,
      }));

      if (hrGroup.length === 0) return;

      const block = document.createElement('div');
      block.className = 'result-block group-hr-block';

      const header = document.createElement('div');
      header.className = 'result-block-header group-hr-header';
      header.innerHTML = `<h3>${name}</h3><span class="badge">${t('block.group_badge', groupNum)}</span>`;
      block.appendChild(header);
      block.appendChild(buildRegSection(t('section.hr'), hrGroup, 'group'));
      resultsEl.appendChild(block);
    });
  }
}

// ============================================================
// Render: T-box Zone
// ============================================================
function renderTboxZone(resultsEl, selectedDevices) {
  // Sekcja rejestrów sterownika (rozwijana na żądanie)
  resultsEl.appendChild(buildControllerSection('tbox_zone', null));

  // Urządzenia — posortowane po adresie, IR obliczane przez pozycję w liście
  const sortedDevices = [...selectedDevices].sort((a, b) => a.addr - b.addr);

  // Przydziel ID grup na podstawie kombinacji (typ + strefa), w kolejności napotkania
  const groupKeyMap = {};
  let nextGroupId = 1;
  const zoneGroupIds = sortedDevices.map(({ name, zone }) => {
    const key = `${name}|${zone}`;
    if (groupKeyMap[key] === undefined) {
      groupKeyMap[key] = nextGroupId++;
    }
    return groupKeyMap[key];
  });

  sortedDevices.forEach(({ name, addr, zone }, sortedIndex) => {
    const device = devices[name];
    if (!device) return;

    const groupId = zoneGroupIds[sortedIndex];

    const mapIR = (reg) => ({
      offset:  reg.offset,
      addrDec: Calculator.calcZoneDeviceAddress(reg.offset, sortedIndex),
      addrHex: Calculator.toHex(Calculator.calcZoneDeviceAddress(reg.offset, sortedIndex)),
      name:    reg.name,
      reg:     reg,
    });
    const mapHR = (reg) => ({
      offset:  reg.offset,
      addrDec: Calculator.calcZoneDeviceHRGroupAddress(reg.offset, groupId),
      addrHex: Calculator.toHex(Calculator.calcZoneDeviceHRGroupAddress(reg.offset, groupId)),
      name:    reg.name,
      reg:     reg,
    });

    // Rejestr nagłówkowy IR: SoftwareType (offset 0x01 w przestrzeni IR urządzenia)
    const irHeader = [{
      offset:  1,
      addrDec: Calculator.calcZoneDeviceAddress(1, sortedIndex),
      addrHex: Calculator.toHex(Calculator.calcZoneDeviceAddress(1, sortedIndex)),
      name:    'SoftwareType',
      reg:     { description: t('reg.softwaretype') },
    }];

    // Rejestry nagłówkowe HR: ZoneID i DeviceID (poprzedzają właściwe rejestry w bloku statycznym)
    const hrHeader = [
      {
        offset:  null,
        addrDec: 8992 + (groupId - 1) * 32,
        addrHex: Calculator.toHex(8992 + (groupId - 1) * 32),
        name:    'ZoneID',
        reg:     { description: t('reg.zoneid') },
      },
      {
        offset:  null,
        addrDec: 8993 + (groupId - 1) * 32,
        addrHex: Calculator.toHex(8993 + (groupId - 1) * 32),
        name:    'DeviceID',
        reg:     { description: t('reg.deviceid') },
      },
    ];

    const ir       = (device.input_registers          || []).map(mapIR);
    const hrSingle = (device.holding_registers_single || []).map(mapHR);

    const block = document.createElement('div');
    block.className = 'result-block';

    const header = document.createElement('div');
    header.className = 'result-block-header';
    header.innerHTML = `
      <h3>${name}</h3>
      <span class="badge">${t('block.addr_zone', addr, zone)}</span>
    `;
    block.appendChild(header);

    if (ir.length > 0) {
      block.appendChild(buildRegSection(t('section.ir'), [...irHeader, ...ir]));
    }
    if (hrSingle.length > 0) {
      block.appendChild(buildRegSection(t('section.hr'), [...hrHeader, ...hrSingle]));
    }
    if (ir.length === 0 && hrSingle.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-note';
      empty.textContent = t('misc.no_regs');
      block.appendChild(empty);
    }

    resultsEl.appendChild(block);
  });

  // Sekcje stref — jedna per unikalna strefa, posortowane
  const uniqueZones = [...new Set(selectedDevices.map(d => d.zone))].sort((a, b) => a - b);
  uniqueZones.forEach((zoneNum, zoneIndex) => {
    resultsEl.appendChild(buildZoneSection(zoneNum, zoneIndex));
  });
}

// ============================================================
// Sekcja rejestrów sterownika — zwijana przyciskiem
// ============================================================
function buildControllerSection(controllerType, mode) {
  const ctrl = Calculator.CONTROLLER[controllerType];

  const body = document.createElement('div');
  body.className = 'result-block controller-block';

  const blockHeader = document.createElement('div');
  blockHeader.className = 'result-block-header controller-block-header';
  blockHeader.innerHTML = `<h3>${t('block.ctrl')}</h3><span class="badge">${controllerType === 'tbox_zone' ? 'T-box Zone' : 'T-box'}</span>`;
  body.appendChild(blockHeader);

  const irRows = ctrl.ir.map(r => ({
    addrDec: r.addr,
    addrHex: Calculator.toHex(r.addr),
    name:    r.name,
    reg:     r,
  }));
  body.appendChild(buildRegSection(t('section.ir'), irRows));

  let hrList;
  if (controllerType === 'tbox_zone') {
    hrList = ctrl.hr;
  } else if (mode === 'group') {
    hrList = ctrl.hr_group;
  } else {
    hrList = ctrl.hr_single;
  }

  const hrRows = hrList.map(r => ({
    addrDec: r.addr,
    addrHex: Calculator.toHex(r.addr),
    name:    r.name,
    reg:     r,
  }));
  body.appendChild(buildRegSection(t('section.hr'), hrRows));

  return body;
}

// ============================================================
// Sekcja rejestrów strefy (T-box Zone)
// ============================================================
function buildZoneSection(zoneNum, zoneIndex) {
  const block = document.createElement('div');
  block.className = 'result-block zone-block';

  const header = document.createElement('div');
  header.className = 'result-block-header zone-block-header';
  header.innerHTML = `<h3>${t('block.zone', zoneNum)}</h3><span class="badge">${t('block.zone_badge')}</span>`;
  block.appendChild(header);

  const irRows = Calculator.ZONE_REGS.ir.map(r => {
    const addrDec = Calculator.calcZoneRegAddress(r.baseAddr, zoneIndex);
    return { addrDec, addrHex: Calculator.toHex(addrDec), name: r.name, reg: r };
  });
  block.appendChild(buildRegSection(t('section.ir'), irRows));

  const hrRows = Calculator.ZONE_REGS.hr.map(r => {
    const addrDec = Calculator.calcZoneRegAddress(r.baseAddr, zoneIndex);
    return { addrDec, addrHex: Calculator.toHex(addrDec), name: r.name, reg: r };
  });
  block.appendChild(buildRegSection(t('section.hr'), hrRows));

  return block;
}

// ============================================================
// Budowanie sekcji tabeli rejestrów
// Kliknięcie na wiersz z wartościami rozwija szczegóły
// ============================================================
function buildRegSection(title, rows, modeTag) {
  const section = document.createElement('div');
  section.className = 'reg-section';

  const sectionTitle = document.createElement('div');
  sectionTitle.className = 'reg-section-title';
  sectionTitle.textContent = title;
  if (modeTag) {
    const badge = document.createElement('span');
    badge.className = `mode-tag mode-${modeTag}`;
    badge.textContent = modeTag.toUpperCase();
    sectionTitle.appendChild(badge);
  }

  const table = document.createElement('table');
  table.className = 'reg-table';
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

  const tbody = document.createElement('tbody');
  rows.forEach((row, idx) => {
    const hasValues = row.reg && (
      (row.reg.values && Object.keys(row.reg.values).length > 0) ||
      row.reg.min !== undefined ||
      row.reg.max !== undefined ||
      row.reg.description
    );

    const tr = document.createElement('tr');
    tr.className = hasValues ? 'reg-row reg-row-expandable' : 'reg-row';
    tr.innerHTML = `
      <td style="color:#aaa">${idx + 1}</td>
      <td><span class="addr-hex">${row.addrHex}</span></td>
      <td><span class="addr-dec">${row.addrDec}</span></td>
      <td>
        ${hasValues
          ? '<span class="expand-icon">&#9654;</span>'
          : '<span class="expand-spacer"></span>'}
        <span class="reg-name">${row.name}</span>
      </td>
    `;
    tbody.appendChild(tr);

    if (hasValues) {
      const detailTr = document.createElement('tr');
      detailTr.className = 'reg-detail-row';
      detailTr.innerHTML = `<td colspan="4" class="reg-detail-cell">${Calculator.renderValueInfo(row.reg)}</td>`;
      tbody.appendChild(detailTr);

      tr.addEventListener('click', () => {
        const isOpen = detailTr.classList.contains('reg-detail-open');
        detailTr.classList.toggle('reg-detail-open', !isOpen);
        tr.classList.toggle('reg-row-open', !isOpen);
        tr.querySelector('.expand-icon').innerHTML = isOpen ? '&#9654;' : '&#9660;';
      });
    }
  });

  table.appendChild(tbody);
  section.append(sectionTitle, table);
  return section;
}

// ============================================================
// Pomocnicze
// ============================================================
function showError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('form-error').style.display = 'none';
}

function resetForm() {
  document.getElementById('results').style.display = 'none';
  document.querySelector('.form-section').style.display = 'block';

  // Reset wierszy M-box — wyczyść i dodaj jeden pusty wiersz
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) {
    mboxContainer.innerHTML = '';
    mboxRowCount = 0;
    addMboxDeviceRow();
  }
}

// ============================================================
// Render: M-box (Modbus TCP)
// ============================================================
function calculateMbox() {
  hideError();

  const rows = document.querySelectorAll('.mbox-device-row');
  if (rows.length === 0) {
    showError(t('error.no_devices'));
    return;
  }

  // Walidacja i zebranie danych
  const selectedDevices = [];
  for (const row of rows) {
    const rowId      = row.dataset.mboxRowId;
    const deviceType = document.getElementById(`mbox-dev-type-${rowId}`).value;
    const deviceId   = parseInt(document.getElementById(`mbox-dev-id-${rowId}`).value, 10);
    const zoneRaw    = document.getElementById(`mbox-zone-${rowId}`).value;
    const zoneNum    = zoneRaw ? parseInt(zoneRaw, 10) : null;

    if (!deviceId || deviceId < 1 || deviceId > 32) {
      showError(t('error.bad_device_id'));
      return;
    }
    if (zoneNum !== null && (zoneNum < 1 || zoneNum > 6)) {
      showError(t('error.bad_zone_mbox'));
      return;
    }
    selectedDevices.push({ deviceType, deviceId, zoneNum });
  }

  const mbox      = Calculator.MBOX;
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  // ---- Sekcja: Rejestry systemowe — zawsze widoczna ----
  const sysWrapper = document.createElement('div');
  sysWrapper.className = 'result-block controller-block';
  sysWrapper.innerHTML = `
    <div class="result-block-header controller-block-header">
      <h3>${t('block.sys')}</h3>
      <span class="badge">${t('block.sys_badge')}</span>
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
  sysWrapper.appendChild(buildRegSection(t('section.ir'), sysIrRows));
  sysWrapper.appendChild(buildRegSection(t('section.hr_rw'), sysHrRows));
  resultsEl.appendChild(sysWrapper);

  // ---- Sekcje urządzeń — po jednej na każdy wiersz ----
  const processedZones = new Set();

  selectedDevices.forEach(({ deviceType, deviceId, zoneNum }) => {
    const devDef = mbox.devices[deviceType];
    if (!devDef) return;

    // Blok urządzenia
    const devWrapper = document.createElement('div');
    devWrapper.className = 'result-block';
    const addrBadge = zoneNum !== null
      ? t('block.addr_zone', deviceId, zoneNum)
      : t('block.addr_only', deviceId);
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">${addrBadge}</span>
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
    devWrapper.appendChild(buildRegSection(t('section.ir'), devIrRows));
    devWrapper.appendChild(buildRegSection(t('section.hr_rw'), devHrRows));
    resultsEl.appendChild(devWrapper);

    // Blok strefowy — raz na unikalną strefę
    if (zoneNum !== null && !processedZones.has(zoneNum)) {
      processedZones.add(zoneNum);

      const zoneWrapper = document.createElement('div');
      zoneWrapper.className = 'result-block zone-block';
      zoneWrapper.innerHTML = `
        <div class="result-block-header zone-block-header">
          <h3>${t('block.zone', zoneNum)}</h3>
          <span class="badge">${t('block.zone_badge')}</span>
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
      zoneWrapper.appendChild(buildRegSection(t('section.ir'), zoneIrRows));
      zoneWrapper.appendChild(buildRegSection(t('section.hr_rw'), zoneHrRows));
      resultsEl.appendChild(zoneWrapper);
    }
  });

  document.getElementById('results').style.display = 'block';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Zdarzenia
// ============================================================
document.getElementById('controllerType').addEventListener('change', updateFormForControllerType);
document.getElementById('btn-add-device').addEventListener('click', addDeviceRow);
document.getElementById('btn-calculate').addEventListener('click', calculate);
document.getElementById('btn-reset').addEventListener('click', resetForm);
document.getElementById('btn-mbox-calculate').addEventListener('click', calculateMbox);
document.getElementById('btn-add-mbox-device').addEventListener('click', addMboxDeviceRow);
document.getElementById('btn-hmi-calculate').addEventListener('click', calculate);
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Zapamiętaj pozycję przewijania przed re-renderem
    const scrollY = window.scrollY;

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setLang(btn.dataset.lang);
    applyStaticTranslations();
    // Jeśli wyniki są widoczne — przelicz ponownie (re-render z nowym językiem)
    const resultsSection = document.getElementById('results');
    if (resultsSection && resultsSection.style.display !== 'none') {
      const ctrl = document.getElementById('controllerType').value;
      if (ctrl === 'mbox') calculateMbox();
      else calculate();
    }

    // Przywróć pozycję przewijania po re-renderze
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  });
});

document.getElementById('btn-print').addEventListener('click', () => {
  window.print();
});

document.getElementById('btn-export-xlsx').addEventListener('click', exportToExcel);

loadDevices();

// ============================================================
// Eksport do Excel
// ============================================================

/**
 * Zbiera aktualnie wyrenderowane wyniki i generuje plik .xlsx.
 * Kolumny: Sekcja | Typ | Adres HEX | Adres DEC | Nazwa rejestru | Opis
 * Język opisu zgodny z aktywnym językiem UI (currentLang).
 */
function exportToExcel() {
  const content = document.getElementById('results-content');
  if (!content) return;

  // Czy tryb ma kolumnę Strefa (T-box Zone i M-box)
  const ctrl = document.getElementById('controllerType').value;
  const hasZone = (ctrl === 'tbox_zone' || ctrl === 'mbox');

  // Nagłówki kolumn (tłumaczone)
  const HDR = hasZone
    ? (currentLang === 'en'
        ? ['Section', 'Address', 'Zone', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
        : ['Sekcja',  'Adres',   'Strefa', 'Typ', 'Adres HEX',  'Adres DEC',   'Nazwa rejestru', 'Opis'])
    : (currentLang === 'en'
        ? ['Section', 'Address', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
        : ['Sekcja',  'Adres',   'Typ',  'Adres HEX',   'Adres DEC',   'Nazwa rejestru', 'Opis']);

  const rows = [HDR];

  // Iteracja po wszystkich blokach wynikowych
  const blocks = content.querySelectorAll('.result-block');

  blocks.forEach(block => {
    // Nazwa sekcji z nagłówka bloku
    const h3 = block.querySelector('.result-block-header h3');
    const sectionName = h3 ? h3.textContent.trim() : '';

    // Adres i strefa/grupa z badge'a — wyciągamy kolejne liczby z tekstu.
    // Pierwsza liczba = adres Modbus urządzenia.
    // Druga liczba = strefa (M-box/T-box Zone) lub numer grupy (T-box Group).
    const badge = block.querySelector('.result-block-header .badge');
    const badgeText = badge ? badge.textContent.trim() : '';
    const badgeNumbers = badgeText.match(/\d+/g) || [];
    const deviceAddr = badgeNumbers[0] || '';
    const deviceZone = badgeNumbers[1] || '';

    // Każda podsekcja IR / HR
    const regSections = block.querySelectorAll('.reg-section');
    regSections.forEach(sec => {
      const titleEl = sec.querySelector('.reg-section-title');
      const typeLabel = titleEl ? titleEl.textContent.trim() : '';
      // Skrót: "IR" lub "HR"
      const typeShort = typeLabel.match(/\bHR\b/) ? 'HR' : 'IR';

      const tbody = sec.querySelector('.reg-table tbody');
      if (!tbody) return;

      const trs = Array.from(tbody.querySelectorAll('tr'));

      trs.forEach((tr, idx) => {
        // Pomiń wiersze szczegółów (rozwijane)
        if (tr.classList.contains('reg-detail-row')) return;

        const tds = tr.querySelectorAll('td');
        if (tds.length < 4) return;

        const addrHex = tds[1].textContent.trim();
        const addrDec = tds[2].textContent.trim();
        const regNameEl = tds[3].querySelector('.reg-name');
        const name = regNameEl ? regNameEl.textContent.trim() : tds[3].textContent.trim();

        // Opis: szukamy w następnym wierszu .reg-detail-row
        let description = '';
        const nextTr = trs[idx + 1];
        if (nextTr && nextTr.classList.contains('reg-detail-row')) {
          const cell = nextTr.querySelector('td');
          if (cell) {
            // Preferuj .val-desc, potem .values-list, potem cały tekst
            const descEl  = cell.querySelector('.val-desc');
            const valList = cell.querySelector('.values-list');
            if (descEl) {
              description = descEl.textContent.trim();
            } else if (valList) {
              description = Array.from(valList.querySelectorAll('.val-item'))
                .map(el => el.textContent.trim())
                .join('; ');
            } else {
              description = cell.textContent.trim().replace(/\s+/g, ' ');
            }
          }
        }

        if (hasZone) {
          rows.push([sectionName, deviceAddr, deviceZone, typeShort, addrHex, addrDec, name, description]);
        } else {
          rows.push([sectionName, deviceAddr, typeShort, addrHex, addrDec, name, description]);
        }
      });
    });
  });

  if (rows.length <= 1) {
    alert(currentLang === 'en' ? 'No results to export.' : 'Brak wyników do eksportu.');
    return;
  }

  // Utwórz arkusz i skoroszyt (SheetJS)
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Szerokości kolumn
  ws['!cols'] = hasZone
    ? [
        { wch: 22 }, // Sekcja
        { wch: 8  }, // Adres
        { wch: 8  }, // Strefa
        { wch: 5  }, // Typ
        { wch: 13 }, // Adres HEX
        { wch: 11 }, // Adres DEC
        { wch: 28 }, // Nazwa rejestru
        { wch: 55 }, // Opis
      ]
    : [
        { wch: 22 }, // Sekcja
        { wch: 8  }, // Adres
        { wch: 5  }, // Typ
        { wch: 13 }, // Adres HEX
        { wch: 11 }, // Adres DEC
        { wch: 28 }, // Nazwa rejestru
        { wch: 55 }, // Opis
      ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, currentLang === 'en' ? 'Registers' : 'Rejestry');

  // Nazwa pliku: modbus_registers_YYYYMMDD.xlsx
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  XLSX.writeFile(wb, `modbus_registers_${dateStr}.xlsx`);
}
