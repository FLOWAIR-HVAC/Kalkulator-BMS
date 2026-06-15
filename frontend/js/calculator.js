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

  // ========================================================
  // ---- M-box (Modbus TCP) ----
  // ========================================================

  // Adres rejestru systemowego (identyczny wzór dla HR i IR)
  calcMboxSystemAddress(n) {
    return n; // adres logiczny = N (1-based)
  },

  // Adres rejestru strefowego
  calcMboxZoneAddress(zoneNum, n) {
    return 50 + (zoneNum - 1) * 30 + n;
  },

  // Adres rejestru urządzenia
  calcMboxDeviceAddress(deviceId, n) {
    return 270 + (deviceId - 1) * 40 + n;
  },

  // Dane statyczne M-box
  MBOX: {

    systemHR: [
      { n: 1, name: 'BMS_enable',  description: 'Tryb pracy BMS (włączenie komunikacji)' },
      { n: 2, name: 'DeviceZone',  description: 'Wybór rodzaju sterowania: Individual Device lub Zone Control' },
      { n: 3, name: 'Heartbeat',   description: 'Heartbeat — jeśli wartość nie zmieni się w ciągu 5 min, aktywuje się alarm komunikacji' },
    ],

    systemIR: [
      { n: 1, name: 'Status_BMS',    description: 'Status komunikacji BMS' },
      { n: 2, name: 'GeneralAlarm',  description: 'Informacja o ostatnim aktywnym alarmie' },
    ],

    zoneHR: [
      { n: 1, name: 'Program',        description: 'Wybór programu pracy strefy (0=Manual, 1=Eco)' },
      { n: 2, name: 'Tref',           description: 'Temperatura zadana strefy (x0.1 °C, zakres 50–450)' },
      { n: 3, name: 'State',          description: 'Aktywacja strefy (0=wyłączona, 1=włączona)' },
      { n: 4, name: 'Antifreeze',     description: 'Tryb ochrony przed zamrożeniem (0=lokalne, 1=wł, 2=wył)' },
      { n: 5, name: 'AntifreezeRef',  description: 'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)' },
      { n: 6, name: 'Hysteresis',     description: 'Histereza między trybem grzania i chłodzenia (x0.1 °C)' },
      { n: 7, name: 'DestMode',       description: 'Tryb destratyfikacji (0=lokalne, 1=wył, 2=wł)' },
      { n: 8, name: 'DestTempRef',    description: 'Różnica temperatur aktywująca destratyfikację (x0.1 °C)' },
    ],

    zoneIR: [
      { n: 1, name: 'ZoneStatus',     description: 'Status strefy (0=nie istnieje, 1=utworzona)' },
      { n: 2, name: 'AvrTemp',        description: 'Średnia temperatura strefy (x0.1 °C, zakres −200…400)' },
      { n: 3, name: 'WorkMode',       description: 'Aktualny tryb pracy strefy (0=OFF, 1=Lokalne, 2=Chłodz, 3=Grzan, 4=Wentyl)' },
      { n: 4, name: 'AvrTempOffset',  description: 'Korekta (offset) średniej temperatury strefy (x0.1 °C)' },
      { n: 5, name: 'CO2',            description: 'Tryb pracy CO2 w strefie (0=Lokalne, 1=OFF, 2=ON)' },
      { n: 6, name: 'CO2_ID',         description: 'DeviceID urządzenia nadrzędnego CO2 w strefie (1–32)' },
      { n: 7, name: 'TrefDelta',      description: 'Zakres korekty temperatury zadanej przez użytkownika (0–5 °C)' },
    ],

    devices: {

      'LEO D (AC/EC)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 3)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T3_UnderCeiling',   description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T3AlarmD',          description:'Alarm czujnika T3 (0=brak, 1=alarm)' },
          { n:6,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:7,  name:'FanEff',            description:'Prędkość wentylatora (0=wył, 1–33=bieg1, 34–66=bieg2, 67–99=bieg3)' },
          { n:8,  name:'FuseState3V',       description:'Stan zabezpieczenia wentylatora (1=sprawny, 2=uszkodzony)' },
          { n:9,  name:'DestStatus',        description:'Stan destratyfikacji (1=nieaktywna, 2=aktywna)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',          description:'Tryb pracy (1=OFF, 3=auto, 4=manual)' },
          { n:2,  name:'FanEffRef',         description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',              description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',          description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSensorSelect', description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'DestTempRef',       description:'Prog. temp. destratyfikacji (x0.1 °C)' },
          { n:7,  name:'WorkModeTempRef',   description:'Temperatura progu aktywacji T3 dla trybu ręcznego (x0.1 °C)' },
        ],
      },

      'ELIS (AC) — kurtyna powietrzna': {
        ir: [
          { n:1,  name:'Type',                    description:'Typ urządzenia (wartość: 1)' },
          { n:2,  name:'Ver',                     description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                    description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T3',                      description:'Temperatura — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                      description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'FanSpeed',                description:'Prędkość wentylatora' },
          { n:7,  name:'ValveStatus',             description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
          { n:8,  name:'ContactDoor',             description:'Stan czujnika drzwi (1=otwarty, 2=zamknięty)' },
          { n:9,  name:'AFStateWerehouse',        description:'Ochrona przed zamrożeniem — pomieszczenie (1=nieaktywna, 2=aktywna)' },
          { n:10, name:'AFStateWaterExch',        description:'Ochrona przed zamrożeniem — wymiennik (1=nieaktywna, 2=aktywna)' },
          { n:11, name:'FuseState3V',             description:'Stan zabezpieczenia wentylatora (1=sprawny, 2=uszkodzony)' },
          { n:12, name:'CurtainElectricPower',    description:'Stan nagrzewnicy elektrycznej (0=nieaktywna, 1=aktywna)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=grzanie, 3=wentylacja)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'CurtainProgram',              description:'Program kurtyny (1=K1 drzwi/temp, 2=K2 drzwi)' },
          { n:7,  name:'CurtainFanIdleRef',           description:'Prędkość biegu jałowego wentylatora' },
          { n:8,  name:'FanIdleDelay',                description:'Czas biegu jałowego wentylatora (0–600, 65535=ciągła praca)' },
          { n:9,  name:'ValveIdleDelay',              description:'Czas biegu jałowego grzania (0–600, 65535=ciągła praca)' },
          { n:10, name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:11, name:'AntifreezeWareHouseTempRef',  description:'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)' },
        ],
      },

      'SLIM (AC) — kurtyna powietrzna': {
        ir: [
          { n:1,  name:'Type',                    description:'Typ urządzenia' },
          { n:2,  name:'Ver',                     description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                    description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T3',                      description:'Temperatura — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                      description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'FanSpeed',                description:'Prędkość wentylatora' },
          { n:7,  name:'ValveStatus',             description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
          { n:8,  name:'ContactDoor',             description:'Stan czujnika drzwi (1=otwarty, 2=zamknięty)' },
          { n:9,  name:'AFStateWerehouse',        description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:10, name:'AFStateWaterExch',        description:'Ochrona przed zamrożeniem — wymiennik' },
          { n:11, name:'FuseState3V',             description:'Stan zabezpieczenia wentylatora' },
          { n:12, name:'CurtainElectricPower',    description:'Stan nagrzewnicy elektrycznej (0=nieaktywna, 1=aktywna)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=grzanie, 3=wentylacja)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'CurtainProgram',              description:'Program kurtyny (1=K1 drzwi/temp, 2=K2 drzwi)' },
          { n:7,  name:'CurtainFanIdleRef',           description:'Prędkość biegu jałowego wentylatora' },
          { n:8,  name:'FanIdleDelay',                description:'Czas biegu jałowego wentylatora' },
          { n:9,  name:'ValveIdleDelay',              description:'Czas biegu jałowego grzania' },
          { n:10, name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia' },
          { n:11, name:'AntifreezeWareHouseTempRef',  description:'Temperatura aktywacji ochrony przed zamrożeniem (x0.1 °C)' },
        ],
      },

      'KM — Komora Mieszania': {
        ir: [
          { n:1,  name:'Type',                      description:'Typ urządzenia (wartość: 11)' },
          { n:2,  name:'Ver',                       description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                      description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T1',                        description:'Temperatura świeżego powietrza — czujnik T1 (x0.1 °C)' },
          { n:5,  name:'T3',                        description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)' },
          { n:6,  name:'T4',                        description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:7,  name:'T5',                        description:'Temperatura powrotu wody — czujnik T5 (x0.1 °C)' },
          { n:8,  name:'ExternalGasDetectTH1',      description:'Detektor gazu — próg 1 (0=poniżej, 1=powyżej)' },
          { n:9,  name:'ExternalGasDetectTH2',      description:'Detektor gazu — próg 2 (0=poniżej, 1=powyżej)' },
          { n:10, name:'FanRoodTK',                 description:'Zabezpieczenie termiczne wentylatora dachowego' },
          { n:11, name:'FanSpeed',                  description:'Prędkość wentylatora' },
          { n:12, name:'FanRooFEff',                description:'Prędkość wentylatora dachowego (0–100)' },
          { n:13, name:'DamperLevel',               description:'Położenie przepustnicy (0–100)' },
          { n:14, name:'DamperForceState',          description:'Status wymuszonej pracy przepustnicy (1=nieaktywny, 2=aktywny)' },
          { n:15, name:'AFStateWerehouse',          description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:16, name:'AFStateWaterEchx',          description:'Ochrona przed zamrożeniem — wymiennik' },
          { n:17, name:'FilterWorkTime',            description:'Czas pracy filtrów (x5 min)' },
          { n:18, name:'FilterPreasureSwitchState', description:'Status presostatu filtra (0=brak, 1=czysty, 2=zabrudzony)' },
          { n:19, name:'FanECConnectStat',          description:'Podłączenie wentylatora EC (0=nie, 1=tak)' },
          { n:20, name:'FuseStateRoof',             description:'Zabezpieczenie wentylatora dachowego (1=sprawny, 2=uszkodzony)' },
          { n:21, name:'FuseStateEC',               description:'Zabezpieczenie wentylatora EC (1=sprawny, 2=uszkodzony)' },
          { n:22, name:'FuseState3V',               description:'Zabezpieczenie wentylatora AC (1=sprawny, 2=uszkodzony)' },
          { n:23, name:'ValveStatus',               description:'Status zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)' },
          { n:2,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:3,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:4,  name:'DamperForceMode',             description:'Wymuszony tryb przepustnicy (1=wył, 2=wł)' },
          { n:5,  name:'DamperForceTempRef',          description:'Temperatura progowa wymuszonego trybu przepustnicy (x0.1 °C)' },
          { n:6,  name:'DamperForcelevelRef',         description:'Położenie przepustnicy w trybie wymuszonym (0–100)' },
          { n:7,  name:'DamperLevelRef',              description:'Zadane położenie przepustnicy (0–100)' },
          { n:8,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:9,  name:'FanroofForceEffRef',          description:'Offset wydajności wentylatora dachowego w trybie wymuszonym' },
          { n:10, name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:11, name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:12, name:'TLeadSensorSelect',           description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:13, name:'FanroofMode',                 description:'Tryb wentylatora dachowego (1=wentylator+przepustnica, 2=przepustnica)' },
          { n:14, name:'FilterTimeCntRst',            description:'Reset licznika czasu pracy filtra (0=brak, 1=reset)' },
          { n:15, name:'ThermostatmodeState',         description:'Tryb termostatyczny (1=wył, 2=wł)' },
          { n:16, name:'ModeManual_FanEffRef',        description:'Zadana prędkość wentylatora w trybie termostatycznym' },
        ],
      },

      'LEO M (EC)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T3',                description:'Temperatura — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'FanSpeed',          description:'Prędkość wentylatora' },
          { n:7,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:8,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik' },
          { n:9,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
          { n:10, name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego' },
          { n:11, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC' },
          { n:12, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC' },
          { n:13, name:'DestStatus',        description:'Status destratyfikacji (0=aktywna, 1=nieaktywna)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (0=OFF, 1=auto, 2=manual)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora (0–100)' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (0=strefa, 1=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury uruchomienia destratyfikacji (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)' },
          { n:11, name:'ModeAuto_FanEffRefMin',       description:'Min. wydajność wentylatora w trybie Auto (0–100)' },
          { n:12, name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)' },
          { n:13, name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual (0–100)' },
        ],
      },

      'ROOFTOP': {
        ir: [
          { n:1,  name:'Type',                        description:'Typ urządzenia (wartość: 13)' },
          { n:2,  name:'T1',                          description:'Temperatura — czujnik T1 (x0.1 °C)' },
          { n:3,  name:'Zone',                        description:'Przypisana strefa' },
          { n:4,  name:'T3',                          description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'Return_temp_value',           description:'Temperatura wyciągu (x0.1 °C)' },
          { n:6,  name:'T5',                          description:'Temperatura — czujnik T5 (x0.1 °C)' },
          { n:7,  name:'T4',                          description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:8,  name:'T4Rel',                       description:'Status czujnika T4' },
          { n:9,  name:'Recirculation_damper_level',  description:'Położenie przepustnicy recyrkulacji (0–100)' },
          { n:10, name:'Swirl_diffuser_position',     description:'Położenie nawiewnika (0–100)' },
          { n:11, name:'Fan_supply_flow',             description:'Wydajność wentylatora nawiewu (0–65535)' },
          { n:12, name:'CO2_stage',                   description:'Sygnalizacja CO2 (0=poniżej, 1=próg1, 2=próg2)' },
          { n:13, name:'Rooftop_work_mode',           description:'Tryb pracy (0=null, 1=wentylacja, 2=grzanie, 3=odzysk, 4=chłodz, 5=odzysk chłodu)' },
          { n:14, name:'Rooftop_current_work_mode',   description:'Aktualny tryb pracy (szczegółowy)' },
          { n:15, name:'ValvAct_Cooling',             description:'Sygnał sterujący chłodzeniem (0–100)' },
          { n:16, name:'ValvAct_Heating',             description:'Sygnał sterujący grzaniem (0–100)' },
          { n:17, name:'RTCscdHtg',                   description:'Zapotrzebowanie na grzanie — wyjście regulatora (0–100)' },
          { n:18, name:'RTCscdClg',                   description:'Zapotrzebowanie na chłodzenie — wyjście regulatora (0–100)' },
          { n:19, name:'RTAlm',                       description:'Alarm CUBE (0=brak, 1=filtr, 2=wyłączone podzespoły, 3=wyłączenie, 4=natychmiastowe wyłączenie)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',       description:'Tryb pracy (0=OFF, 1=auto, 2=manual/standby)' },
          { n:2,  name:'StpFlow_Cmfrt',  description:'Zadana wydajność wentylatora — tryb Komfort (0–100)' },
          { n:3,  name:'StpFlow_Rem1',   description:'Zadana wydajność — wejście Rem1 (x0.1)' },
          { n:4,  name:'StpFlow_Rem2',   description:'Zadana wydajność — wejście Rem2 (x0.1)' },
          { n:5,  name:'StpRec_Mode',    description:'Tryb przepustnicy (0=auto, 1=manual)' },
          { n:6,  name:'StpRec_Man',     description:'Zadany poziom recyrkulacji w trybie Manual (0–100)' },
          { n:7,  name:'StpRecStptRem1', description:'Zadany poziom recyrkulacji — Rem1 (0–100)' },
          { n:8,  name:'StpRecStptRem2', description:'Zadany poziom recyrkulacji — Rem2 (0–100)' },
          { n:9,  name:'StpDfsrMode',    description:'Tryb nawiewnika (0=auto, 1=manual)' },
          { n:10, name:'StpDfsrMan',     description:'Położenie nawiewnika w trybie Manual (0–100)' },
          { n:11, name:'StpDfsrHtg',     description:'Zadane położenie nawiewnika — sekwencja grzania (0–100)' },
          { n:12, name:'StpDfsrClg',     description:'Zadane położenie nawiewnika — sekwencja chłodzenia (0–100)' },
          { n:13, name:'Tref',           description:'Temperatura zadana (x0.1 °C, zakres 50–450)' },
          { n:14, name:'Reserved',       description:'Zarezerwowane' },
          { n:15, name:'Reserved',       description:'Zarezerwowane' },
          { n:16, name:'AlmAck',         description:'Potwierdzenie alarmów (0=brak, 1=potwierdź)' },
          { n:17, name:'StdByDB',        description:'Histereza dla trybu StandBy (x0.1 °C)' },
          { n:18, name:'Reserved',       description:'Zarezerwowane' },
          { n:19, name:'Reserved',       description:'Zarezerwowane' },
          { n:20, name:'Reserved',       description:'Zarezerwowane' },
          { n:21, name:'Reserved',       description:'Zarezerwowane' },
          { n:22, name:'Reserved',       description:'Zarezerwowane' },
          { n:23, name:'StdByMode',      description:'Rodzaj trybu StandBy (1=termostatyczny, 2=Night Cool)' },
          { n:24, name:'SlaveAdrs',      description:'Adres Modbus urządzenia CUBE (1–31)' },
          { n:25, name:'Reset',          description:'Reset urządzenia CUBE (0=brak, 1=reset)' },
        ],
      },

      'LEO V (AC)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 5)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)' },
          { n:4,  name:'UnderCeilling',     description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'FanSpeed',          description:'Prędkość wentylatora' },
          { n:7,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
          { n:8,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:9,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik' },
          { n:10, name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego' },
          { n:11, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC' },
          { n:12, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC' },
          { n:13, name:'DestStatus',        description:'Status destratyfikacji (1=nieaktywna, 2=aktywna)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto grz, 3=manual grz, 4=auto chł, 5=manual chł, 6=wentylacja)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury destratyfikacji (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)' },
          { n:11, name:'ModeAuto_FanEffRefMin',       description:'Min. wydajność wentylatora w trybie Auto (0–100)' },
          { n:12, name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)' },
          { n:13, name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual (0–100)' },
        ],
      },

      'LEO EL (AC)': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 6)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)' },
          { n:4,  name:'UnderLeilling',         description:'Temperatura przy suficie — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'FanSpeed',              description:'Prędkość wentylatora' },
          { n:7,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:8,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego' },
          { n:9,  name:'FuseStateEC',           description:'Zabezpieczenie wentylatora EC' },
          { n:10, name:'FuseState3V',           description:'Zabezpieczenie wentylatora AC' },
          { n:11, name:'DestStatus',            description:'Status destratyfikacji' },
          { n:12, name:'ElectricHeaterType',    description:'Typ nagrzewnicy (1=LEO EL S — 2 stopnie, 2=LEO EL L — 3 stopnie)' },
          { n:13, name:'ThermalContactState',   description:'Status TK (1=alarm, 2=brak alarmu)' },
          { n:14, name:'PTCHeaterPowerState',   description:'Aktualna moc nagrzewnicy (1=wył, 2=stopień1, 3=stopień2, 4=stopień3)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:8,  name:'DestTempRef',                 description:'Próg temperatury destratyfikacji (x0.1 °C)' },
          { n:9,  name:'DestModeForce',               description:'Wymuszenie destratyfikacji (1=brak, 2=wymuszona)' },
          { n:10, name:'DestMode',                    description:'Tryb destratyfikacji (1=wył, 2=zależny, 3=niezależny)' },
          { n:11, name:'ModeManual_FanEffRef',        description:'Zadana wydajność wentylatora w trybie Manual' },
          { n:12, name:'ElectricHeaterPTCPower',      description:'Moc nagrzewnicy (1=wył, 2=stopień1, 3=stopień2, 4=stopień3)' },
          { n:13, name:'ModeAuto_FanEffRef',          description:'Min. wydajność wentylatora w trybie Auto' },
        ],
      },

      'LEO COOL (AC)': {
        ir: [
          { n:1,  name:'Type',              description:'Typ urządzenia (wartość: 7)' },
          { n:2,  name:'Ver',               description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',              description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T4',                description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:5,  name:'FanSpeed',          description:'Prędkość wentylatora (x1)' },
          { n:6,  name:'ValveStatus',       description:'Stan zaworu (0=czuwanie, 1=otwarty, 2=zamknięty)' },
          { n:7,  name:'AFStateWaterExch',  description:'Ochrona przed zamrożeniem — wymiennik' },
          { n:8,  name:'AFStateWarehouse',  description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:9,  name:'FuseStateRoof',     description:'Zabezpieczenie wentylatora dachowego' },
          { n:10, name:'FuseStateEC',       description:'Zabezpieczenie wentylatora EC' },
          { n:11, name:'FuseState3V',       description:'Zabezpieczenie wentylatora AC' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto grz, 3=manual grz, 4=auto chł, 5=manual chł, 6=wentylacja)' },
          { n:2,  name:'FanEffRef',                   description:'Zadana prędkość wentylatora' },
          { n:3,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:4,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:5,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (1=strefa, 3=T4)' },
          { n:6,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:7,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:8,  name:'Reserved',                    description:'Zarezerwowane' },
          { n:9,  name:'ModeAuto_FanEffRefMax',       description:'Max. wydajność wentylatora w trybie Auto (0–100)' },
          { n:10, name:'ModeManual_FanEffRef',        description:'Zadana wydajność wentylatora w trybie Manual (0–100)' },
        ],
      },

      'ROBUR R KM NEXT': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 8)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T1',                    description:'Temperatura świeżego powietrza — czujnik T1 (x0.1 °C)' },
          { n:5,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:7,  name:'T5',                    description:'Temperatura powrotu wody — czujnik T5 (x0.1 °C)' },
          { n:8,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:9,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego' },
          { n:10, name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1' },
          { n:11, name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2' },
          { n:12, name:'GasAlarmState',         description:'Status zasilania gazem (2=brak alarmu, 1=alarm)' },
          { n:13, name:'STBAlarmState',         description:'Status czujnika STB (2=brak alarmu, 1=alarm)' },
          { n:14, name:'FilterWorkTime',        description:'Czas pracy filtra (x5 min)' },
          { n:15, name:'FanRoofTK',             description:'Zabezpieczenie termiczne wentylatora dachowego' },
          { n:16, name:'FanRoofEff',            description:'Prędkość wentylatora dachowego (0–100)' },
          { n:17, name:'DamperLevel',           description:'Położenie przepustnicy (0–100)' },
          { n:18, name:'DamperFroceState',      description:'Status wymuszonego trybu przepustnicy' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)' },
          { n:2,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:3,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (x0.1)' },
          { n:5,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:6,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:7,  name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual' },
          { n:8,  name:'GasAlarmReset',               description:'Reset alarmu palnika (0=brak, 1=reset)' },
          { n:9,  name:'STBTemperatuureAlarmOn',      description:'Temperatura progowa alarmu STB — aktywacja (x0.1 °C)' },
          { n:10, name:'STBTemperatuureAlarmOff',     description:'Temperatura progowa alarmu STB — dezaktywacja (x0.1 °C)' },
          { n:11, name:'FilterTimeCntRst',            description:'Reset licznika filtra (0=brak, 1=reset)' },
          { n:12, name:'STBAlarmReset',               description:'Reset alarmu STB (0=brak, 1=reset)' },
          { n:13, name:'GasBurnerLvlRef',             description:'Zadana moc palnika (1=stopień1, 2=stopień2)' },
          { n:14, name:'DamperForceMode',             description:'Wymuszony tryb przepustnicy (0=wył, 1=wł)' },
          { n:15, name:'DamperForceTempRef',          description:'Temperatura progowa wymuszonego trybu przepustnicy (x0.1 °C)' },
          { n:16, name:'DamperForcelevelRef',         description:'Położenie przepustnicy w trybie wymuszonym (0–100)' },
          { n:17, name:'DamperLevelRef',              description:'Zadane położenie przepustnicy (0–100)' },
          { n:18, name:'DamperContLevelRef',          description:'Zadane położenie przepustnicy po osiągnięciu parametrów (0–100)' },
          { n:19, name:'FanroofForceEffRef',          description:'Offset wydajności wentylatora dachowego w trybie wymuszonym' },
          { n:20, name:'FanroofMode',                 description:'Tryb wentylatora dachowego (0=wentylator+przepustnica, 1=przepustnica)' },
        ],
      },

      'ROBUR R NEXT': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 9)' },
          { n:2,  name:'Ver',                   description:'Wersja oprogramowania' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)' },
          { n:4,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)' },
          { n:5,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:6,  name:'AFStateWarehouse',      description:'Ochrona przed zamrożeniem — pomieszczenie' },
          { n:7,  name:'FuseStateRoof',         description:'Zabezpieczenie wentylatora dachowego' },
          { n:8,  name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1' },
          { n:9,  name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2' },
          { n:10, name:'GasAlarmState',         description:'Status zasilania gazem (2=brak alarmu, 1=alarm)' },
          { n:11, name:'STBAlarmState',         description:'Status czujnika STB (2=brak alarmu, 1=alarm)' },
          { n:12, name:'FilterWorkTime',        description:'Czas pracy filtra (x5 min)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',                    description:'Tryb pracy (1=OFF, 2=auto, 3=manual, 4=wentylacja)' },
          { n:2,  name:'Tref',                        description:'Temperatura zadana (x0.1 °C)' },
          { n:3,  name:'TLeadVal',                    description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',            description:'Wybór czujnika wiodącego (x0.1)' },
          { n:5,  name:'AntifreezeWareHouseOn',       description:'Ochrona przed zamrożeniem pomieszczenia (1=aktywna, 2=nieaktywna)' },
          { n:6,  name:'AntifreezeWareHouseTempRef',  description:'Temperatura progowa ochrony przed zamrożeniem (x0.1 °C)' },
          { n:7,  name:'ModeManual_FanEffRef',        description:'Wydajność wentylatora w trybie Manual' },
          { n:8,  name:'GasAlarmReset',               description:'Reset alarmu palnika (2=brak, 1=reset)' },
          { n:9,  name:'STBTemperatuureAlarmOn',      description:'Temperatura progowa alarmu STB — aktywacja (x0.1 °C)' },
          { n:10, name:'STBTemperatuureAlarmOff',     description:'Temperatura progowa alarmu STB — dezaktywacja (x0.1 °C)' },
          { n:11, name:'FilterTimeCntRst',            description:'Reset licznika filtra (0=brak, 1=reset)' },
          { n:12, name:'STBAlarmReset',               description:'Reset alarmu STB (1=reset, 2=brak)' },
          { n:13, name:'GasBurnerLvlRef',             description:'Zadana moc palnika (1=stopień1, 2=stopień2)' },
        ],
      },

      'LUNA': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 14)' },
          { n:2,  name:'Hardware',              description:'Wersja hardware' },
          { n:3,  name:'Zone',                  description:'Przypisana strefa (1–6)' },
          { n:4,  name:'Software',              description:'Wersja software' },
          { n:5,  name:'Ver',                   description:'Wersja oprogramowania DRV' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:7,  name:'LeadingTemp',           description:'Temperatura z czujnika wiodącego (x0.1 °C)' },
          { n:8,  name:'T2',                    description:'Temperatura — czujnik T2 (x0.1 °C)' },
          { n:9,  name:'T3',                    description:'Temperatura za nawiewem — czujnik T3 (x0.1 °C)' },
          { n:10, name:'T5',                    description:'Temperatura — czujnik T5 (x0.1 °C)' },
          { n:11, name:'FanSpeed',              description:'Prędkość wentylatora (0–100)' },
          { n:12, name:'CondensatePompAlarm',   description:'Alarm pompki kondensatu (0=brak, 1=alarm)' },
          { n:13, name:'FilterOperationTime',   description:'Czas pracy filtrów (x5 min)' },
          { n:14, name:'ValvAct_Heating',       description:'Sygnał sterujący grzania (0–1000 → 0–100%)' },
          { n:15, name:'ValvAct_Cooling',       description:'Sygnał sterujący chłodzenia (0–1000 → 0–100%)' },
        ],
        hr: [
          { n:1,  name:'ON_OFF',                description:'Włączenie/wyłączenie urządzenia (0=OFF, 1=ON)' },
          { n:2,  name:'Tref',                  description:'Temperatura zadana (x0.1 °C, zakres 50–450)' },
          { n:3,  name:'WorkMode',              description:'Tryb pracy (x0.1 — 0=auto, 1=manual)' },
          { n:4,  name:'DestMode',              description:'Destratyfikacja (1=wył, 2=wł)' },
          { n:5,  name:'TLeadSensorSelect',     description:'Wybór czujnika wiodącego (0=czerpnia, 1=strefa, 2=nawiew, 3=pomieszczenie)' },
          { n:6,  name:'LowCeiling',            description:'Tryb niskiego sufitu (0=wył, 1=wł)' },
          { n:7,  name:'NozzleManual',          description:'Położenie dyszy — tryb manual (0–100%)' },
          { n:8,  name:'Preheat',               description:'Funkcja PREHEAT (0=wył, 1=wł)' },
          { n:9,  name:'FanEffRef',             description:'Prędkość wentylatora (200–1000 → 20–100%)' },
          { n:10, name:'ModeManual_FanEffRef',  description:'Prędkość wentylatora w trybie manual (200–1000)' },
          { n:11, name:'DestTempRef',           description:'Min. różnica temperatur dla destratyfikacji (20–60 → 2.0–6.0 K)' },
          { n:12, name:'PreheatTemp',           description:'Temperatura uruchomienia nawiewu w trybie PREHEAT (280–370 → 28–37 °C)' },
          { n:13, name:'DI_Active',             description:'Zezwolenie na pracę — CONTACT DI (0=nieaktywne, 1=NC, 2=NO)' },
          { n:14, name:'DestFanSpeed',          description:'Prędkość wentylatora w trybie destratyfikacji (400–1000)' },
          { n:15, name:'LowCeilingFanSpeed',    description:'Prędkość wentylatora w trybie niskiego sufitu (0–1000)' },
          { n:16, name:'LowCeilingFanLimitLOW', description:'Min. prędkość wentylatora — tryb niskiego sufitu (0–1000)' },
          { n:17, name:'LowCeilingFanLimitHIGH',description:'Max. prędkość wentylatora — tryb niskiego sufitu (0–1000)' },
        ],
      },

      'OXEN': {
        ir: [
          { n:1,  name:'Type',                  description:'Typ urządzenia (wartość: 666)' },
          { n:2,  name:'Zone',                  description:'Przypisana strefa (1–6)' },
          { n:3,  name:'T1',                    description:'Temperatura — czujnik T1 (x0.1 °C)' },
          { n:4,  name:'T2',                    description:'Temperatura — czujnik T2 (x0.1 °C)' },
          { n:5,  name:'T3',                    description:'Temperatura — czujnik T3 (x0.1 °C)' },
          { n:6,  name:'T4',                    description:'Temperatura pomieszczenia — czujnik T4 (x0.1 °C)' },
          { n:7,  name:'T5',                    description:'Temperatura — czujnik T5 (x0.1 °C)' },
          { n:8,  name:'FansEff1',              description:'Prędkość wentylatorów nawiewu (x0.1, 0–100)' },
          { n:9,  name:'FansEff2',              description:'Prędkość wentylatorów wyciągu (0–100)' },
          { n:10, name:'ValveStatus',           description:'Stan zaworu (0=stand-by, 1=otwarty, 2=zamknięty)' },
          { n:11, name:'AFStateWaterExch',      description:'Ochrona przed zamrożeniem wymiennika (0=normalna, 1=aktywna)' },
          { n:12, name:'ExternalGasDetectTH1',  description:'Detektor gazu — próg 1' },
          { n:13, name:'ExternalGasDetectTH2',  description:'Detektor gazu — próg 2' },
          { n:14, name:'FilterWorkTime',        description:'Czas pracy filtrów (x5 min)' },
          { n:15, name:'OxenWorkMode',          description:'Tryb pracy (0=OFF, 1=auto, 2=zima, 3=lato)' },
          { n:16, name:'OxenType',              description:'Typ OXEN (1=zimny, 2=elektryczny, 3=wodny)' },
          { n:17, name:'AFCrossEx',             description:'Ochrona przed zamrożeniem — wymiennik krzyżowy (0=normalna, 1=aktywna)' },
          { n:18, name:'OxenDamper',            description:'Status przepustnicy (0=zamknięta, 1=otwarta)' },
          { n:19, name:'Bypass',                description:'Status przepustnicy By-pass (0=zamknięta, 1=otwarta)' },
          { n:20, name:'PTCHeaterPowerState',   description:'Status nagrzewnicy PTC (0=wył, 1=stopień1, 2=stopień2, 3=stopień3)' },
          { n:21, name:'ThermalContactState',   description:'Status TK (0=normalna praca, 1=aktywne zabezpieczenie)' },
        ],
        hr: [
          { n:1,  name:'WorkMode',          description:'Tryb pracy (0=OFF, 1=auto, 2=zima, 3=lato)' },
          { n:2,  name:'Tref FanEffRef',    description:'Zadana prędkość wentylatora (0–100)' },
          { n:3,  name:'TLeadVal',          description:'Wartość temperatury wiodącej (x0.1 °C)' },
          { n:4,  name:'TLeadSenorSelect',  description:'Wybór czujnika wiodącego (1=strefa, 2=nawiew, 3=pomieszczenie)' },
          { n:5,  name:'FilterTimeCntRst',  description:'Reset licznika filtra (0=brak, 1=reset)' },
          { n:6,  name:'FanEffRef_1',       description:'Zadana prędkość wentylatorów nawiewu (0–100)' },
          { n:7,  name:'FanEffRef_2',       description:'Zadana prędkość wentylatorów wyciągu (x0.1, 0–100)' },
          { n:8,  name:'WorkState',         description:'Status pracy (0=OFF, 1/2/3=ON)' },
          { n:9,  name:'ElectricWorkMode',  description:'Zadany tryb pracy nagrzewnicy' },
        ],
      },

    }, // koniec devices

  }, // koniec MBOX
};
