/**
 * app.js — Główna logika UI kalkulatora BMS
 */

let devices = {};
let deviceRowCount = 0;
let mboxRowCount = 0;

// ============================================================
// Inicjalizacja
// ============================================================
function loadDevices() {
  devices = DEVICES_DATA;
  const names = Object.keys(devices).sort();
  if (names.length === 0) {
    showError('Brak danych urządzeń.');
    return;
  }
  addDeviceRow();
  addDeviceRow();
  addMboxDeviceRow();
  updateFormForControllerType();
}

// ============================================================
// Zmiana sterownika — aktualizacja formularza
// ============================================================
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

  // Pola stref w wierszach T-box — tylko T-box Zone (nie dotykaj M-box zone-field)
  document.querySelectorAll('#devices-container .zone-field').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Sekcja urządzeń T-box
  document.getElementById('devices-container').style.display = isMbox ? 'none' : '';

  // Kontener urządzeń M-box (dynamiczne wiersze)
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) mboxContainer.style.display = isMbox ? 'block' : 'none';

  // Przyciski formularza T-box
  document.getElementById('tbox-actions').style.display = isMbox ? 'none' : '';

  // Przyciski formularza M-box
  const mboxActions = document.getElementById('mbox-actions');
  if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';

  // Przebuduj opcje w selektach urządzeń T-box (tylko gdy nie M-box)
  if (!isMbox) {
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
  addrLabel.textContent = 'Adres:';
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
  zoneLabel.textContent = 'Strefa:';
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
  removeBtn.title = 'Usuń urządzenie';
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
  devIdLabel.textContent = 'Adres:';
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
  document.getElementById('mbox-devices-container').appendChild(row);
}

// ============================================================
// Walidacja formularza
// ============================================================
function validateForm() {
  const rows = document.querySelectorAll('#devices-container .device-row');
  if (rows.length === 0) return 'Dodaj co najmniej jedno urządzenie.';

  const isTboxZone = document.getElementById('controllerType').value === 'tbox_zone';
  const addrs = [];

  for (const row of rows) {
    const id = row.dataset.rowId;
    const addr = parseInt(document.getElementById(`addr-${id}`).value);
    if (isNaN(addr) || addr < 1 || addr > 31) {
      return 'Nieprawidłowy adres Modbus (musi być 1–31).';
    }
    if (addrs.includes(addr)) {
      return `Adres Modbus ${addr} jest użyty więcej niż raz. Każde urządzenie musi mieć unikalny adres.`;
    }
    addrs.push(addr);

    if (isTboxZone) {
      const zone = parseInt(document.getElementById(`zone-${id}`).value);
      if (isNaN(zone) || zone < 1 || zone > 31) {
        return 'Nieprawidłowy numer strefy (musi być 1–31).';
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
  const err = validateForm();
  if (err) { showError(err); return; }

  const controllerType = document.getElementById('controllerType').value;
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
    modeInfo.textContent = 'Tryb: T-box Zone';
    resultsEl.appendChild(modeInfo);
    renderTboxZone(resultsEl, selectedDevices);
  } else {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    modeInfo.textContent = `Tryb: ${mode === 'single' ? 'Single (jedno urządzenie)' : 'Group (grupowy)'} — Sterownik: T-box`;
    resultsEl.appendChild(modeInfo);
    renderTbox(resultsEl, selectedDevices, mode);
  }

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
      <span class="badge">Adres Modbus: ${addr}${mode === 'group' ? ' &nbsp;|&nbsp; Grupa: ' + groupNum : ''}</span>
    `;
    block.appendChild(header);

    if (tables.ir.length > 0) {
      block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', tables.ir));
    }

    if (mode === 'single' && tables.hrSingle.length > 0) {
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', tables.hrSingle, 'single'));
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
      header.innerHTML = `<h3>${name}</h3><span class="badge">Holding Registers — Grupa ${groupNum}</span>`;
      block.appendChild(header);
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrGroup, 'group'));
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
      reg:     { description: 'Typ oprogramowania urządzenia (identyfikator modelu)' },
    }];

    // Rejestry nagłówkowe HR: ZoneID i DeviceID (poprzedzają właściwe rejestry w bloku statycznym)
    const hrHeader = [
      {
        offset:  null,
        addrDec: 8992 + (groupId - 1) * 32,
        addrHex: Calculator.toHex(8992 + (groupId - 1) * 32),
        name:    'ZoneID',
        reg:     { description: 'Identyfikator strefy przypisanej do tego urządzenia (1–31)' },
      },
      {
        offset:  null,
        addrDec: 8993 + (groupId - 1) * 32,
        addrHex: Calculator.toHex(8993 + (groupId - 1) * 32),
        name:    'DeviceID',
        reg:     { description: 'Identyfikator typu urządzenia (software type, lista w rozdz. 2.1 dokumentacji)' },
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
      <span class="badge">Adres: ${addr} &nbsp;|&nbsp; Strefa: ${zone}</span>
    `;
    block.appendChild(header);

    if (ir.length > 0) {
      block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', [...irHeader, ...ir]));
    }
    if (hrSingle.length > 0) {
      block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', [...hrHeader, ...hrSingle]));
    }
    if (ir.length === 0 && hrSingle.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-note';
      empty.textContent = 'Brak rejestrów dla tego urządzenia.';
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

  const wrapper = document.createElement('div');
  wrapper.className = 'controller-section';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-controller-toggle';
  btn.textContent = 'Pokaż rejestry sterownika';

  const body = document.createElement('div');
  body.className = 'result-block controller-block';
  body.style.display = 'none';

  const blockHeader = document.createElement('div');
  blockHeader.className = 'result-block-header controller-block-header';
  blockHeader.innerHTML = `<h3>Rejestry sterownika</h3><span class="badge">${controllerType === 'tbox_zone' ? 'T-box Zone' : 'T-box'}</span>`;
  body.appendChild(blockHeader);

  const irRows = ctrl.ir.map(r => ({
    addrDec: r.addr,
    addrHex: Calculator.toHex(r.addr),
    name:    r.name,
    reg:     r,
  }));
  body.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', irRows));

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
  body.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));

  btn.addEventListener('click', () => {
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? 'Pokaż rejestry sterownika' : 'Ukryj rejestry sterownika';
  });

  wrapper.append(btn, body);
  return wrapper;
}

// ============================================================
// Sekcja rejestrów strefy (T-box Zone)
// ============================================================
function buildZoneSection(zoneNum, zoneIndex) {
  const block = document.createElement('div');
  block.className = 'result-block zone-block';

  const header = document.createElement('div');
  header.className = 'result-block-header zone-block-header';
  header.innerHTML = `<h3>Strefa ${zoneNum}</h3><span class="badge">Rejestry strefy</span>`;
  block.appendChild(header);

  const irRows = Calculator.ZONE_REGS.ir.map(r => {
    const addrDec = Calculator.calcZoneRegAddress(r.baseAddr, zoneIndex);
    return { addrDec, addrHex: Calculator.toHex(addrDec), name: r.name, reg: r };
  });
  block.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', irRows));

  const hrRows = Calculator.ZONE_REGS.hr.map(r => {
    const addrDec = Calculator.calcZoneRegAddress(r.baseAddr, zoneIndex);
    return { addrDec, addrHex: Calculator.toHex(addrDec), name: r.name, reg: r };
  });
  block.appendChild(buildRegSection('Holding Registers (HR) — Nastawy', hrRows));

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
        <th>#</th>
        <th>Adres HEX</th>
        <th>Adres DEC</th>
        <th>Nazwa rejestru</th>
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
    showError('Dodaj co najmniej jedno urządzenie.');
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
      showError('DeviceID musi być liczbą od 1 do 32.');
      return;
    }
    if (zoneNum !== null && (zoneNum < 1 || zoneNum > 6)) {
      showError('Numer strefy musi być od 1 do 6.');
      return;
    }
    selectedDevices.push({ deviceType, deviceId, zoneNum });
  }

  const mbox      = Calculator.MBOX;
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

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

  // ---- Sekcje urządzeń — po jednej na każdy wiersz ----
  const processedZones = new Set();

  selectedDevices.forEach(({ deviceType, deviceId, zoneNum }) => {
    const devDef = mbox.devices[deviceType];
    if (!devDef) return;

    // Blok urządzenia
    const devWrapper = document.createElement('div');
    devWrapper.className = 'result-block';
    const zoneInfo = zoneNum !== null ? ` &nbsp;|&nbsp; Strefa:&nbsp;${zoneNum}` : '';
    devWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>${deviceType}</h3>
        <span class="badge">Adres:&nbsp;${deviceId}${zoneInfo}</span>
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
    devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));
    devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));
    resultsEl.appendChild(devWrapper);

    // Blok strefowy — raz na unikalną strefę
    if (zoneNum !== null && !processedZones.has(zoneNum)) {
      processedZones.add(zoneNum);

      const zoneWrapper = document.createElement('div');
      zoneWrapper.className = 'result-block zone-block';
      zoneWrapper.innerHTML = `
        <div class="result-block-header zone-block-header">
          <h3>Strefa ${zoneNum}</h3>
          <span class="badge">Rejestry strefy</span>
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
      zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));
      zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));
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

loadDevices();
