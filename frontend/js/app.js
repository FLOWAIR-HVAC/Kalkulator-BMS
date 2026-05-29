/**
 * app.js — Główna logika UI kalkulatora BMS
 */

let devices = {};
let deviceRowCount = 0;

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
  updateFormForControllerType();
}

// ============================================================
// Zmiana sterownika — aktualizacja formularza
// ============================================================
function updateFormForControllerType() {
  const isTboxZone = document.getElementById('controllerType').value === 'tbox_zone';

  document.getElementById('mode-field').style.display = isTboxZone ? 'none' : '';

  document.querySelectorAll('.device-row .zone-field').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });
}

// ============================================================
// Dodawanie wierszy urządzeń
// ============================================================
function addDeviceRow() {
  const id = ++deviceRowCount;
  const names = Object.keys(devices).sort();
  const isTboxZone = document.getElementById('controllerType').value === 'tbox_zone';

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
// Walidacja formularza
// ============================================================
function validateForm() {
  const rows = document.querySelectorAll('.device-row');
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
  document.querySelectorAll('.device-row').forEach(row => {
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

    if (mode === 'single') {
      if (tables.hrSingle.length > 0) {
        block.appendChild(buildRegSection('Holding Registers (HR) — Single mode', tables.hrSingle));
      }
    } else {
      if (tables.hrSingle.length > 0) {
        block.appendChild(buildRegSection('Holding Registers — Single (adresowanie indywidualne)', tables.hrSingle, 'single'));
      }
      if (tables.hrGroup.length > 0) {
        block.appendChild(buildRegSection('Holding Registers — Group (adresowanie grupowe)', tables.hrGroup, 'group'));
      }
    }

    resultsEl.appendChild(block);
  });
}

// ============================================================
// Render: T-box Zone
// ============================================================
function renderTboxZone(resultsEl, selectedDevices) {
  // Sekcja rejestrów sterownika (rozwijana na żądanie)
  resultsEl.appendChild(buildControllerSection('tbox_zone', null));

  // Urządzenia — posortowane po adresie, IR obliczane przez pozycję w liście
  const sortedDevices = [...selectedDevices].sort((a, b) => a.addr - b.addr);

  sortedDevices.forEach(({ name, addr, zone }, sortedIndex) => {
    const device = devices[name];
    if (!device) return;

    const mapIR = (reg) => ({
      offset:  reg.offset,
      addrDec: Calculator.calcZoneDeviceAddress(reg.offset, sortedIndex),
      addrHex: Calculator.toHex(Calculator.calcZoneDeviceAddress(reg.offset, sortedIndex)),
      name:    reg.name,
      reg:     reg,
    });
    const mapHR = (reg) => ({
      offset:  reg.offset,
      addrDec: Calculator.calcZoneDeviceHRAddress(reg.offset, sortedIndex),
      addrHex: Calculator.toHex(Calculator.calcZoneDeviceHRAddress(reg.offset, sortedIndex)),
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
        addrDec: 8992 + sortedIndex * 32,
        addrHex: Calculator.toHex(8992 + sortedIndex * 32),
        name:    'ZoneID',
        reg:     { description: 'Identyfikator strefy przypisanej do tego urządzenia (1–31)' },
      },
      {
        offset:  null,
        addrDec: 8993 + sortedIndex * 32,
        addrHex: Calculator.toHex(8993 + sortedIndex * 32),
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
      block.appendChild(buildRegSection('Holding Registers (HR) — Single mode', [...hrHeader, ...hrSingle]));
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
  body.appendChild(buildRegSection('Holding Registers (HR)', hrRows));

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
  block.appendChild(buildRegSection('Holding Registers (HR)', hrRows));

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
}

// ============================================================
// Zdarzenia
// ============================================================
document.getElementById('controllerType').addEventListener('change', updateFormForControllerType);
document.getElementById('btn-add-device').addEventListener('click', addDeviceRow);
document.getElementById('btn-calculate').addEventListener('click', calculate);
document.getElementById('btn-reset').addEventListener('click', resetForm);

loadDevices();
