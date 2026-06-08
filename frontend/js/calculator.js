/**
 * calculator.js — Silnik obliczania adresów rejestrów Modbus
 *
 * Wzory (T-box):
 *   IR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Single:  offset + 256 + (deviceAddr - 1) × 64
 *   HR  Group:   offset + 4096 + (groupNum - 1) × 256
 *
 * Wzory (T-box Zone):
 *   IR urządzenia:  offset + 320  + (pozycja_posortowana × 32)   // baza 0x0140
 *   HR urządzenia:  offset + 8990 + (groupId − 1) × 32           // baza 0x2320, group = (typ+strefa)
 *   IR/HR strefy:   base_addr + (indeks_strefy × 16)
 *
 * Rejestry sterownika mają stałe adresy (nie zależą od urządzenia).
 * Źródło: T-BOX Zone Modbus RTU V4.8 (Flowair, wewnętrzna)
 */

const Calculator = {

  // ---- T-box ----

  calcSingleAddress(offset, deviceAddr) {
    return offset + 256 + (deviceAddr - 1) * 64;
  },

  calcGroupAddress(offset, groupNum) {
    return offset + 4096 + (groupNum - 1) * 256;
  },

  // ---- T-box Zone ----

  // Adres IR urządzenia: baza 0x0140 = 320
  calcZoneDeviceAddress(offset, sortedIndex) {
    return offset + 320 + sortedIndex * 32;
  },

  // Adres HR urządzenia (statyczna przestrzeń T-box Zone): baza 0x2320 = 8990 + 2
  // groupId: numer grupy (typ+strefa), nadawany w kolejności napotkania po sort wg adresu
  calcZoneDeviceHRGroupAddress(offset, groupId) {
    return offset + 8990 + (groupId - 1) * 32;
  },

  // Adres rejestrów strefy
  calcZoneRegAddress(baseAddr, zoneIndex) {
    return baseAddr + zoneIndex * 16;
  },

  // ---- Helpers ----

  toHex(dec) {
    return '0x' + dec.toString(16).toUpperCase().padStart(4, '0');
  },

  assignGroupNumbers(selectedNames, allDevices) {
    const uniqueNames = [...new Set(selectedNames)].filter(n => allDevices[n]);
    uniqueNames.sort((a, b) => {
      const pa = allDevices[a]?.group_priority ?? 999;
      const pb = allDevices[b]?.group_priority ?? 999;
      return pa - pb;
    });
    const groupMap = {};
    uniqueNames.forEach((name, index) => {
      groupMap[name] = index + 1;
    });
    return groupMap;
  },

  renderValueInfo(reg) {
    const parts = [];
    if (reg.values && Object.keys(reg.values).length > 0) {
      const items = Object.entries(reg.values)
        .map(([k, v]) => `<span class="val-item"><b>${k}</b> ${v}</span>`)
        .join('');
      parts.push(`<div class="values-list">${items}</div>`);
    } else if (reg.min !== undefined || reg.max !== undefined) {
      const r = [];
      if (reg.min !== undefined) r.push(`min: <b>${reg.min}</b>`);
      if (reg.max !== undefined) r.push(`max: <b>${reg.max}</b>`);
      if (reg.unit)              r.push(`<i>${reg.unit}</i>`);
      parts.push(`<span class="range-info">${r.join(' &nbsp;|&nbsp; ')}</span>`);
    }
    if (reg.description) {
      parts.push(`<div class="val-desc">${reg.description}</div>`);
    }
    return parts.join('') || '<span style="color:#ccc">—</span>';
  },

  buildRegisterTable(device, deviceAddr, mode, groupNum) {
    const mapReg = (reg, addrFn) => ({
      offset:  reg.offset,
      addrDec: addrFn(reg.offset),
      addrHex: this.toHex(addrFn(reg.offset)),
      name:    reg.name,
      reg:     reg,
    });
    const singleFn = (offset) => this.calcSingleAddress(offset, deviceAddr);
    const groupFn  = (offset) => this.calcGroupAddress(offset, groupNum);
    return {
      ir:       (device.input_registers          || []).map(r => mapReg(r, singleFn)),
      hrSingle: (device.holding_registers_single || []).map(r => mapReg(r, singleFn)),
      hrGroup:  (device.holding_registers_group  || []).map(r => mapReg(r, groupFn)),
    };
  },

  // ---- Statyczne rejestry sterownika ----

  CONTROLLER: {
    tbox: {
      ir: [
        { addr: 0,  name: 'HardwareType' },
        { addr: 1,  name: 'SoftType' },
        { addr: 2,  name: 'ConnectionCnt' },
        { addr: 3,  name: 'SoftVer' },
        { addr: 5,  name: 'TempTBox' },
        { addr: 6,  name: 'TempT4Ave' },
        { addr: 16, name: 'DrvCount' },
      ],
      hr_single: [
        { addr: 4, name: 'BmsMode' },
      ],
      hr_group: [
        { addr: 1,  name: 'SoftType' },
        { addr: 4,  name: 'BmsMode' },
        { addr: 5,  name: 'Enable' },
        { addr: 6,  name: 'Tref' },
        { addr: 7,  name: 'AntifreezeWareHouseEnable' },
        { addr: 8,  name: 'AntifreezeWareHouseTempRef' },
        { addr: 9,  name: 'TleadSensorSelect' },
        { addr: 10, name: 'Tsl_Tlead_Offset' },
        { addr: 11, name: 'Tsl_T4_Offset' },
        { addr: 12, name: 'GasSensorEnable' },
        { addr: 13, name: 'GasSensorConnectId' },
        { addr: 14, name: 'DateYear' },
        { addr: 15, name: 'DateMonth' },
        { addr: 16, name: 'DateDay' },
        { addr: 17, name: 'DateHours' },
        { addr: 18, name: 'DateMinutes' },
        { addr: 19, name: 'DateSeconds' },
      ],
    },
    tbox_zone: {
      ir: [
        { addr: 0,  name: 'HardwareType',          description: 'Informacja o typie sprzętu i wersji PCB.' },
        { addr: 1,  name: 'SoftType',              description: 'Typ i wersja oprogramowania sterownika.' },
        { addr: 2,  name: 'ConnectionCnt',         description: 'Licznik połączeń — rośnie przy każdym odczycie. Pierwsze zapytanie zawsze zwraca 0x01. Monitoring tego rejestru umożliwia diagnostykę połączenia.' },
        { addr: 3,  name: 'SoftVer',               description: 'Wersja oprogramowania sterownika.' },
        { addr: 4,  name: 'MainSensorReading',     description: 'Temperatura zmierzona przez czujnik główny.' },
        { addr: 5,  name: 'SecSensorReading',      description: 'Temperatura zmierzona przez czujnik pomocniczy.' },
        { addr: 8,  name: 'DeviceCount',           description: 'Liczba wykrytych urządzeń podłączonych do sterownika.' },
        { addr: 9,  name: 'ZoneCount',             description: 'Liczba skonfigurowanych stref.' },
        { addr: 10, name: 'GroupCount',            description: 'Liczba grup urządzeń.' },
        { addr: 11, name: 'DeviceStatus1-16',      description: 'Status wykrytych urządzeń 1–16. Każdy bit odpowiada jednemu urządzeniu.' },
        { addr: 12, name: 'DeviceStatus17-32',     description: 'Status wykrytych urządzeń 17–32. Każdy bit odpowiada jednemu urządzeniu.' },
        { addr: 13, name: 'ControlerStatus1-16',   description: 'Status sterownika — wartość 32-bitowa, bity 1–16.' },
        { addr: 14, name: 'ControlerStatus17-32',  description: 'Status sterownika — wartość 23-bitowa, bity 17–31.' },
        { addr: 15, name: 'InfoStartPoint',        description: 'Punkt startowy dynamicznej informacji o urządzeniach (patrz rejestr IR 0x10 — mapowanie urządzeń).' },
      ],
      hr: [
        { addr: 0,  name: 'SetScreenLock',            description: 'Włącza blokadę ekranu sterownika.' },
        { addr: 1,  name: 'EnableDisableController',  description: 'Włącza lub wyłącza sterownik i wszystkie podłączone urządzenia.' },
        { addr: 2,  name: 'UnlockScreen',             description: 'Odblokowuje ekran — aktywne gdy blokada ekranu jest włączona.' },
        { addr: 4,  name: 'SetYear',                  description: 'Ustawienie daty i czasu — rok.' },
        { addr: 5,  name: 'SetMonth',                 description: 'Ustawienie daty i czasu — miesiąc.' },
        { addr: 6,  name: 'SetDay',                   description: 'Ustawienie daty i czasu — dzień.' },
        { addr: 7,  name: 'SetHours',                 description: 'Ustawienie daty i czasu — godzina.' },
        { addr: 8,  name: 'SetMinutes',               description: 'Ustawienie daty i czasu — minuty.' },
        { addr: 9,  name: 'SetSeconds',               description: 'Ustawienie daty i czasu — sekundy.' },
        { addr: 10, name: 'SetExternalSignalEnable',  description: 'Obsługa sygnału zewnętrznego — włącz/wyłącz.' },
        { addr: 11, name: 'SetExternalSignalMode',    description: 'Tryb i funkcjonalność sygnału zewnętrznego.' },
        { addr: 12, name: 'SetExternalSignalContact', description: 'Konfiguracja polaryzacji styku sygnału zewnętrznego.' },
        { addr: 13, name: 'SetExternalSignalLevel',   description: 'Poziom sygnału zewnętrznego.' },
      ],
    },
  },

  // ---- Rejestry stref (T-box Zone) ----

  ZONE_REGS: {
    ir: [
      { baseAddr: 2304, name: 'ZoneID',          description: 'Identyfikator strefy (1–31).' },
      { baseAddr: 2305, name: 'AverageZoneTemp', description: 'Średnia temperatura w strefie mierzona przez czujniki lokalne urządzeń.' },
      { baseAddr: 2306, name: 'ZoneDeviceCount', description: 'Liczba urządzeń przypisanych do tej strefy.' },
    ],
    hr: [
      { baseAddr: 2320, name: 'SetZoneID',               description: 'Identyfikator strefy do zmiany (1–31). Należy ustawić przed zmianą pozostałych rejestrów strefy.' },
      { baseAddr: 2321, name: 'EnableDisableZone',       description: 'Włącza lub wyłącza wszystkie urządzenia w strefie.' },
      { baseAddr: 2322, name: 'ZoneTRef',                description: 'Temperatura docelowa strefy.' },
      { baseAddr: 2323, name: 'ZoneAntifreeze',          description: 'Włącza ochronę przeciwzamrożeniową strefy.' },
      { baseAddr: 2324, name: 'ZoneTAntifreeze',         description: 'Temperatura progowa aktywacji ochrony przeciwzamrożeniowej strefy.' },
      { baseAddr: 2325, name: 'ZoneTLeadSensorSelect',   description: 'Wybór czujnika wiodącego dla strefy (Lead Sensor Selection).' },
      { baseAddr: 2326, name: 'ZoneSensorOffset',        description: 'Korekcja (offset) czujnika temperatury strefy.' },
      { baseAddr: 2327, name: 'T4SensorOffset',          description: 'Korekcja (offset) czujnika T4 — średnia temperatura powietrza.' },
      { baseAddr: 2328, name: 'ZoneExternalSignalEnable',description: 'Obsługa sygnału zewnętrznego dla strefy.' },
      { baseAddr: 2329, name: 'ZoneExternalSignalDrvUid',description: 'UID urządzenia powiązanego z sygnałem zewnętrznym strefy.' },
      { baseAddr: 2330, name: 'TLeadVal',                description: 'Wartość temperatury z wybranego czujnika wiodącego strefy.' },
    ],
  },
};
