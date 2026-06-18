/**
 * translations.js — Słownik tłumaczeń interfejsu (PL / EN)
 *
 * Użycie:  t('klucz')            → tekst w aktualnym języku
 *          t('klucz', val1, val2) → tekst z podstawionymi {0}, {1}
 *
 * Zmiana języka: setLang('en') lub setLang('pl')
 * Język jest zapamiętywany w localStorage pod kluczem 'bms_lang'.
 */

const TRANSLATIONS = {

  // ===========================================================
  // POLSKI
  // ===========================================================
  pl: {

    /* Strona */
    'page.title':    'Kalkulator BMS — Rejestry Modbus',
    'page.h1':       'Kalkulator BMS',
    'page.subtitle': 'Obliczanie adresów rejestrów Modbus dla urządzeń podłączonych do sterowników SYSTEMU FLOWAIR',

    /* Formularz */
    'form.controller':      'Sterownik',
    'form.mode':            'Tryb pracy',
    'form.devices':         'Urządzenia',
    'form.address':         'Adres:',
    'form.zone':            'Strefa:',
    'form.remove_title':    'Usuń urządzenie',
    'form.mode.single_tip': 'W tym trybie sterujemy każdym urządzeniem indywidualnie, ekran sterownika T-box jest zablokowany',
    'form.mode.group_tip':  'W tym trybie sterujemy grupami tych samych urządzeń, ekran sterownika T-box jest odblokowany',

    /* Przyciski */
    'btn.add_device':  '+ Dodaj urządzenie',
    'btn.calculate':   'Oblicz',
    'btn.reset':       'Nowe obliczenie',
    'btn.print':       'Drukuj',
    'btn.show_ctrl':   'Pokaż rejestry sterownika',
    'btn.hide_ctrl':   'Ukryj rejestry sterownika',
    'btn.show_sys':    'Pokaż rejestry systemowe',
    'btn.hide_sys':    'Ukryj rejestry systemowe',

    /* Wyniki — pasek górny */
    'result.h2':          'Wyniki',
    'result.mode_tzone':  'Tryb: T-box Zone',
    'result.mode_single': 'Single (jedno urządzenie)',
    'result.mode_group':  'Group (grupowy)',
    'result.mode_tbox':   'Tryb: {0} — Sterownik: T-box',

    /* Sekcje rejestrów (tytuły tabel) */
    'section.ir':     'Input Registers (IR) — tylko odczyt',
    'section.hr':     'Holding Registers (HR) — Nastawy',
    'section.hr_rw':  'Holding Registers (HR) — odczyt/zapis',

    /* Nagłówki bloków wynikowych */
    'block.ctrl':             'Rejestry sterownika',
    'block.zone':             'Strefa {0}',
    'block.zone_badge':       'Rejestry strefy',
    'block.sys':              'Rejestry systemowe',
    'block.sys_badge':        'M-box',
    'block.group_badge':      'Holding Registers — Grupa {0}',
    'block.addr_modbus':      'Adres Modbus: {0}',
    'block.addr_modbus_grp':  'Adres Modbus: {0} | Grupa: {1}',
    'block.addr_zone':        'Adres: {0} | Strefa: {1}',
    'block.addr_only':        'Adres: {0}',

    /* Tabela rejestrów — nagłówki kolumn */
    'table.num':      '#',
    'table.hex':      'Adres HEX',
    'table.dec':      'Adres DEC',
    'table.name':     'Nazwa rejestru',

    /* Opisy rejestrów nagłówkowych (T-box Zone) */
    'reg.softwaretype': 'Typ oprogramowania urządzenia (identyfikator modelu)',
    'reg.zoneid':       'Identyfikator strefy przypisanej do tego urządzenia (1–31)',
    'reg.deviceid':     'Identyfikator typu urządzenia (software type, lista w rozdz. 2.1 dokumentacji)',

    /* Komunikaty błędów */
    'error.no_data':        'Brak danych urządzeń.',
    'error.no_devices':     'Dodaj co najmniej jedno urządzenie.',
    'error.bad_addr':       'Nieprawidłowy adres Modbus (musi być 1–31).',
    'error.dup_addr':       'Adres Modbus {0} jest użyty więcej niż raz. Każde urządzenie musi mieć unikalny adres.',
    'error.bad_zone':       'Nieprawidłowy numer strefy (musi być 1–31).',
    'error.bad_device_id':  'DeviceID musi być liczbą od 1 do 32.',
    'error.bad_zone_mbox':  'Numer strefy musi być od 1 do 6.',

    /* Różne */
    'misc.no_regs':    'Brak rejestrów dla tego urządzenia.',
    'misc.lang_btn':   'EN',
  },

  // ===========================================================
  // ENGLISH
  // ===========================================================
  en: {

    /* Page */
    'page.title':    'BMS Calculator — Modbus Registers',
    'page.h1':       'BMS Calculator',
    'page.subtitle': 'Modbus register address calculator for devices connected to FLOWAIR SYSTEM controllers',

    /* Form */
    'form.controller':      'Controller',
    'form.mode':            'Operating mode',
    'form.devices':         'Devices',
    'form.address':         'Address:',
    'form.zone':            'Zone:',
    'form.remove_title':    'Remove device',
    'form.mode.single_tip': 'In this mode each device is controlled individually; the T-box controller screen is locked',
    'form.mode.group_tip':  'In this mode devices of the same type are controlled as groups; the T-box controller screen is unlocked',

    /* Buttons */
    'btn.add_device':  '+ Add device',
    'btn.calculate':   'Calculate',
    'btn.reset':       'New calculation',
    'btn.print':       'Print',
    'btn.show_ctrl':   'Show controller registers',
    'btn.hide_ctrl':   'Hide controller registers',
    'btn.show_sys':    'Show system registers',
    'btn.hide_sys':    'Hide system registers',

    /* Results — top bar */
    'result.h2':          'Results',
    'result.mode_tzone':  'Mode: T-box Zone',
    'result.mode_single': 'Single (individual device)',
    'result.mode_group':  'Group (group mode)',
    'result.mode_tbox':   'Mode: {0} — Controller: T-box',

    /* Register section titles */
    'section.ir':    'Input Registers (IR) — read only',
    'section.hr':    'Holding Registers (HR) — Settings',
    'section.hr_rw': 'Holding Registers (HR) — read/write',

    /* Result block headers */
    'block.ctrl':             'Controller registers',
    'block.zone':             'Zone {0}',
    'block.zone_badge':       'Zone registers',
    'block.sys':              'System registers',
    'block.sys_badge':        'M-box',
    'block.group_badge':      'Holding Registers — Group {0}',
    'block.addr_modbus':      'Modbus address: {0}',
    'block.addr_modbus_grp':  'Modbus address: {0} | Group: {1}',
    'block.addr_zone':        'Address: {0} | Zone: {1}',
    'block.addr_only':        'Address: {0}',

    /* Register table column headers */
    'table.num':   '#',
    'table.hex':   'HEX Address',
    'table.dec':   'DEC Address',
    'table.name':  'Register name',

    /* Header register descriptions (T-box Zone) */
    'reg.softwaretype': 'Device firmware type (model identifier)',
    'reg.zoneid':       'Zone identifier assigned to this device (1–31)',
    'reg.deviceid':     'Device type identifier (software type, see chapter 2.1 of documentation)',

    /* Error messages */
    'error.no_data':        'No device data available.',
    'error.no_devices':     'Add at least one device.',
    'error.bad_addr':       'Invalid Modbus address (must be 1–31).',
    'error.dup_addr':       'Modbus address {0} is used more than once. Each device must have a unique address.',
    'error.bad_zone':       'Invalid zone number (must be 1–31).',
    'error.bad_device_id':  'Device ID must be a number from 1 to 32.',
    'error.bad_zone_mbox':  'Zone number must be between 1 and 6.',

    /* Misc */
    'misc.no_regs':   'No registers for this device.',
    'misc.lang_btn':  'PL',
  },
};

// ===========================================================
// Aktualny język — z localStorage lub domyślnie PL
// ===========================================================
let currentLang = localStorage.getItem('bms_lang') || 'pl';

/**
 * Zwraca przetłumaczony tekst dla podanego klucza.
 * Parametry {0}, {1}, ... są zastępowane kolejnymi argumentami.
 * Jeśli klucz nie istnieje — zwraca sam klucz (failsafe).
 */
function t(key, ...params) {
  let str = (TRANSLATIONS[currentLang] || TRANSLATIONS.pl)[key];
  if (str === undefined) return key;
  params.forEach((val, i) => { str = str.replace(`{${i}}`, val); });
  return str;
}

/**
 * Zmienia język, zapisuje w localStorage i przeładowuje stronę.
 * Przeładowanie gwarantuje spójność wszystkich elementów UI.
 */
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('bms_lang', lang);
  // UI aktualizuje wywołujący kod (app.js)
}
