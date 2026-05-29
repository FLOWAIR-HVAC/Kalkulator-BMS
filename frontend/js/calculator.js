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
 *   HR urządzenia:  offset + 8994 + (pozycja_posortowana × 32)   // baza 0x2322
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

  // Adres HR urządzenia (statyczna przestrzeń): baza 0x2322 = 8994
  calcZoneDeviceHRAddress(offset, sortedIndex) {
    return offset + 8994 + sortedIndex * 32;
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
        { addr: 0,  name: 'HardwareType' },
        { addr: 1,  name: 'SoftType' },
        { addr: 2,  name: 'ConnectionCnt' },
        { addr: 3,  name: 'SoftVer' },
        { addr: 4,  name: 'MainSensorReading' },
        { addr: 5,  name: 'SecSensorReading' },
        { addr: 8,  name: 'DeviceCount' },
        { addr: 9,  name: 'ZoneCount' },
        { addr: 10, name: 'GroupCount' },
        { addr: 11, name: 'DeviceStatus1-16' },
        { addr: 12, name: 'DeviceStatus17-32' },
        { addr: 13, name: 'ControlerStatus1-16' },
        { addr: 14, name: 'ControlerStatus17-32' },
        { addr: 15, name: 'InfoStartPoint' },
      ],
      hr: [
        { addr: 0,  name: 'SetScreenLock' },
        { addr: 1,  name: 'EnableDisableController' },
        { addr: 2,  name: 'UnlockScreen' },
        { addr: 4,  name: 'SetYear' },
        { addr: 5,  name: 'SetMonth' },
        { addr: 6,  name: 'SetDay' },
        { addr: 7,  name: 'SetHours' },
        { addr: 8,  name: 'SetMinutes' },
        { addr: 9,  name: 'SetSeconds' },
        { addr: 10, name: 'SetExternalSignalEnable' },
        { addr: 11, name: 'SetExternalSignalMode' },
        { addr: 12, name: 'SetExternalSignalContact' },
        { addr: 13, name: 'SetExternalSignalLevel' },
      ],
    },
  },

  // ---- Rejestry stref (T-box Zone) ----

  ZONE_REGS: {
    ir: [
      { baseAddr: 2304, name: 'ZoneID' },
      { baseAddr: 2305, name: 'AverageZoneTemp' },
      { baseAddr: 2306, name: 'ZoneDeviceCount' },
    ],
    hr: [
      { baseAddr: 2320, name: 'SetZoneID' },
      { baseAddr: 2321, name: 'EnableDisableZone' },
      { baseAddr: 2322, name: 'ZoneTRef' },
      { baseAddr: 2323, name: 'ZoneAntifreeze' },
      { baseAddr: 2324, name: 'ZoneTAntifreeze' },
      { baseAddr: 2325, name: 'ZoneTLeadSensorSelect' },
      { baseAddr: 2326, name: 'ZoneSensorOffset' },
      { baseAddr: 2327, name: 'T4SensorOffset' },
      { baseAddr: 2328, name: 'ZoneExternalSignalEnable' },
      { baseAddr: 2329, name: 'ZoneExternalSignalDrvUid' },
      { baseAddr: 2330, name: 'TLeadVal' },
    ],
  },
};
