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
// Samouczek sterowników — dane i renderowanie
// ============================================================

/**
 * Dane treści karty samouczka dla każdego sterownika (PL i EN).
 * Parametry transmisji na podstawie dokumentacji Flowair.
 */
const TUTORIAL_DATA = {

  tbox: {
    pl: {
      name: 'T-box',
      desc: 'Sterownik Flowair do nagrzewnic i kurtyn powietrznych. Łączy się z systemem BMS przez Modbus RTU (RS485) i zarządza urządzeniami połączonymi szeregowo na tej samej magistrali.',
      params: [
        ['Standard',            'RS485'],
        ['Prędkość transmisji', '9600, 19200, 38400, 57600, 76800, 115200, 230400'],
        ['Bity danych',         '8'],
        ['Parzystość',          'Even'],
        ['Bity stopu',          '1'],
        ['Typ danych',          'Unsigned Int16 (o ile nie zaznaczono inaczej)'],
      ],
      modes: [
        ['Single mode', 'Indywidualne sterowanie każdym urządzeniem. Ustawienia T-boxa są zablokowane (brak możliwości sterowania lokalnego).'],
        ['Group mode',  'Sterowanie grupami urządzeń. Ustawienia T-boxa są odblokowane (możliwe sterowanie lokalne).'],
      ],
    },
    en: {
      name: 'T-box',
      desc: 'Flowair controller for heaters and air curtains. Connects to the BMS via Modbus RTU (RS485) and manages devices wired in series on the same bus.',
      params: [
        ['Standard',   'RS485'],
        ['Baudrate',   '9600, 19200, 38400, 57600, 76800, 115200, 230400'],
        ['Data bits',  '8'],
        ['Parity',     'Even'],
        ['Stop bits',  '1'],
        ['Data type',  'Unsigned Int16 (if not stated otherwise)'],
      ],
      modes: [
        ['Single mode', 'Individual control of each device. T-box settings are locked (no local control possible).'],
        ['Group mode',  'Group control of devices. T-box settings are unlocked (local control possible).'],
      ],
    },
  },

  tbox_zone: {
    pl: {
      name: 'T-box Zone',
      desc: 'Sterownik T-box Zone z możliwością strefowego sterowania grupami urządzeń. Komunikacja z systemem BMS za pomocą protokołu Modbus RTU.',
      params: [
        ['Standard',            'RS485'],
        ['Prędkość transmisji', '9600, 19200, 38400, 57600, 76800, 115200, 230400'],
        ['Bity danych',         '8'],
        ['Parzystość',          'Even; None; Odd'],
        ['Bity stopu',          '1; 2'],
        ['Typ danych',          'Unsigned Int16 (o ile nie zaznaczono inaczej)'],
      ],
      modes: [],
    },
    en: {
      name: 'T-box Zone',
      desc: 'T-box Zone controller with zone-based group control of devices. Communicates with the BMS via Modbus RTU.',
      params: [
        ['Standard',  'RS485'],
        ['Baudrate',  '9600, 19200, 38400, 57600, 76800, 115200, 230400'],
        ['Data bits', '8'],
        ['Parity',    'Even; None; Odd'],
        ['Stop bits', '1; 2'],
        ['Data type', 'Unsigned Int16 (if not stated otherwise)'],
      ],
      modes: [],
    },
  },

  mbox: {
    pl: {
      name: 'M-box',
      desc: 'Sterownik M-box umożliwiający sterowanie strefowe urządzeniami. Komunikacja z systemem BMS realizowana jest za pomocą protokołu Modbus TCP.',
      params: [
        ['Protokół do BMS',      'Modbus TCP (Ethernet)'],
        ['Protokół do urządzeń', 'Modbus RTU (RS485)'],
      ],
      modes: [],
    },
    en: {
      name: 'M-box',
      desc: 'M-box controller enabling zone-based control of devices. Communication with the BMS is carried out via Modbus TCP.',
      params: [
        ['Protocol to BMS',     'Modbus TCP (Ethernet)'],
        ['Protocol to devices', 'Modbus RTU (RS485)'],
      ],
      modes: [],
    },
  },

  hmi_wifi_ac: {
    pl: {
      name: 'HMI Wi-Fi AC',
      desc: 'Ścienny termostat pokojowy. Podłączany bezpośrednio do BMS przez Modbus RTU (RS485). Brak urządzeń podrzędnych — węzeł końcowy magistrali.',
      params: [
        ['Standard',            'RS485'],
        ['Protokół',            'Modbus RTU'],
        ['Prędkość transmisji', '2400, 9600, 19200, 38400'],
        ['Parzystość',          'None'],
        ['Bity danych',         '8'],
        ['Bity stopu',          '1'],
      ],
      modes: [],
    },
    en: {
      name: 'HMI Wi-Fi AC',
      desc: 'Wall-mounted room thermostat. Connected directly to the BMS via Modbus RTU (RS485). No downstream devices — terminal node on the bus.',
      params: [
        ['Standard',        'RS485'],
        ['Protocol',        'Modbus RTU'],
        ['Baudrate',        '2400, 9600, 19200, 38400'],
        ['Parity',          'None'],
        ['Data bits',       '8'],
        ['Stop bits',       '1'],
      ],
      modes: [],
    },
  },

  cube_direct: {
    pl: {
      name: 'Cube (bezpośrednio)',
      desc: 'Sterownik Cube podłączony bezpośrednio do systemu BMS. Obsługuje trzy protokoły komunikacyjne — wybierz odpowiedni przycisk poniżej, aby wyświetlić mapę rejestrów.',
      params: [
        ['Modbus RTU',          'RS485'],
        ['Adres ID',            '1–247 (domyślnie: 5)'],
        ['Prędkość transmisji', '600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200 (domyślnie: 38400)'],
        ['Parzystość',          'None, Odd, Even (domyślnie: Even)'],
        ['Bity stopu',          '1, 2 (domyślnie: 2)'],
        ['Modbus TCP',          'Ethernet'],
        ['BACnet IP',           'Ethernet'],
      ],
      modes: [],
    },
    en: {
      name: 'Cube (direct)',
      desc: 'Cube controller connected directly to the BMS. Supports three communication protocols — select the appropriate button below to view the register map.',
      params: [
        ['Modbus RTU',   'RS485'],
        ['ID (address)', '1–247 (default: 5)'],
        ['Speed data',   '600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200 (default: 38400)'],
        ['Parity',       'None, Odd, Even (default: Even)'],
        ['Stop bits',    '1, 2 (default: 2)'],
        ['Modbus TCP',   'Ethernet'],
        ['BACnet IP',    'Ethernet'],
      ],
      modes: [],
    },
  },

  drv: {
    pl: {
      name: 'DRV (bezpośrednio)',
      desc: 'Bezpośrednie połączenie systemu BMS z napędem DRV przez Modbus RTU (RS485). Pomija sterownik pośredni (T-box, M-box). Każde urządzenie DRV posiada własną mapę rejestrów Modbus.',
      params: [
        ['Standard',            'RS485'],
        ['Protokół',            'Modbus RTU'],
        ['Prędkość transmisji', '38400'],
        ['Parzystość',          'Even'],
        ['Bity danych',         '8'],
        ['Bity stopu',          '1'],
      ],
      modes: [],
    },
    en: {
      name: 'DRV (direct)',
      desc: 'Direct BMS-to-DRV connection via Modbus RTU (RS485). Bypasses the intermediate controller (T-box, M-box). Each DRV unit has its own Modbus register map.',
      params: [
        ['Standard',   'RS485'],
        ['Protocol',   'Modbus RTU'],
        ['Baudrate',   '38400'],
        ['Parity',     'Even'],
        ['Data bits',  '8'],
        ['Stop bits',  '1'],
      ],
      modes: [],
    },
  },

  hmi_wifi_ec: {
    pl: {
      name: 'HMI Wi-Fi EC',
      desc: 'Ścienny termostat pokojowy dla urządzeń EC. Podłączany bezpośrednio do BMS przez Modbus RTU (RS485). Brak urządzeń podrzędnych — węzeł końcowy magistrali.',
      params: [
        ['Standard',            'RS485'],
        ['Protokół',            'Modbus RTU'],
        ['Prędkość transmisji', '2400, 9600, 19200, 38400'],
        ['Parzystość',          'None'],
        ['Bity danych',         '8'],
        ['Bity stopu',          '1'],
      ],
      modes: [],
    },
    en: {
      name: 'HMI Wi-Fi EC',
      desc: 'Wall-mounted room thermostat for EC devices. Connected directly to the BMS via Modbus RTU (RS485). No downstream devices — terminal node on the bus.',
      params: [
        ['Standard',        'RS485'],
        ['Protocol',        'Modbus RTU'],
        ['Baudrate',        '2400, 9600, 19200, 38400'],
        ['Parity',          'None'],
        ['Data bits',       '8'],
        ['Stop bits',       '1'],
      ],
      modes: [],
    },
  },
};

/**
 * Generuje SVG diagram topologii dla danego sterownika.
 * @param {string} type - wartość select#controllerType
 * @returns {string} łańcuch SVG
 */
function buildTutorialDiagram(type) {
  if (type === 'tbox' || type === 'tbox_zone') {
    const zone     = type === 'tbox_zone';
    const label    = zone ? 'T-box Zone' : 'T-box';
    const mainY    = zone ? 58 : 52;
    const mainSize = zone ? 7.5 : 9;
    const modeSpan = zone
      ? ''
      : `<tspan x="92" dy="11" font-size="6.5" fill="#1a5a6a">Single/Group</tspan>`;
    return `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="41" width="44" height="34" fill="#f7fbfc" stroke="#afd2db" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#000" font-weight="600"><tspan x="23" y="49" font-size="8">BMS</tspan><tspan x="23" dy="11" font-size="8">MASTER</tspan></text>
      <text x="23" y="71" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">RS485</text>
      <line x1="45" y1="58" x2="65" y2="58" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
      <rect x="65" y="40" width="54" height="36" fill="#afd2db" stroke="#7abfcc" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#0d3d4a">
        <tspan x="92" y="${mainY}" font-size="${mainSize}" font-weight="600">${label}</tspan>${modeSpan}
      </text>
      <line x1="119" y1="58" x2="139" y2="58" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
      <text x="145" y="47" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">RS485</text>
      <rect x="139" y="49" width="55" height="18" fill="#f2f2f2" stroke="#bbb" stroke-width="1"/>
      <text x="166" y="58" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="Poppins,sans-serif" fill="#333">Urządz. 1</text>
      <line x1="166" y1="67" x2="166" y2="75" stroke="#ccc" stroke-width="1" stroke-dasharray="3,2"/>
      <rect x="139" y="75" width="55" height="18" fill="#f2f2f2" stroke="#bbb" stroke-width="1"/>
      <text x="166" y="84" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="Poppins,sans-serif" fill="#333">Urządz. 2</text>
      <line x1="166" y1="93" x2="166" y2="100" stroke="#ccc" stroke-width="1.2" stroke-dasharray="2,2"/>
      <text x="166" y="111" text-anchor="middle" font-size="10" font-family="Poppins,sans-serif" fill="#aaa">···</text>
    </svg>`;
  }

  if (type === 'mbox') {
    return `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="38" width="44" height="42" fill="#f7fbfc" stroke="#afd2db" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#000" font-weight="600"><tspan x="23" y="51" font-size="8">BMS</tspan><tspan x="23" dy="11" font-size="8">MASTER</tspan></text>
      <text x="23" y="72" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">Modbus TCP</text>
      <line x1="45" y1="59" x2="65" y2="59" stroke="#a3c1a3" stroke-width="1.2" stroke-dasharray="4,2"/>
      <rect x="65" y="40" width="50" height="36" fill="#afd2db" stroke="#7abfcc" stroke-width="1"/>
      <text x="90" y="58" text-anchor="middle" dominant-baseline="middle" font-size="9" font-family="Poppins,sans-serif" fill="#0d3d4a" font-weight="600">M-box</text>
      <line x1="115" y1="58" x2="135" y2="58" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
      <text x="141" y="47" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">RS485</text>
      <rect x="135" y="49" width="55" height="18" fill="#f2f2f2" stroke="#bbb" stroke-width="1"/>
      <text x="162" y="58" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="Poppins,sans-serif" fill="#333">Urządz. 1</text>
      <line x1="162" y1="67" x2="162" y2="75" stroke="#ccc" stroke-width="1" stroke-dasharray="3,2"/>
      <rect x="135" y="75" width="55" height="18" fill="#f2f2f2" stroke="#bbb" stroke-width="1"/>
      <text x="162" y="84" text-anchor="middle" dominant-baseline="middle" font-size="7.5" font-family="Poppins,sans-serif" fill="#333">Urządz. 2</text>
      <line x1="162" y1="93" x2="162" y2="100" stroke="#ccc" stroke-width="1.2" stroke-dasharray="2,2"/>
      <text x="162" y="111" text-anchor="middle" font-size="10" font-family="Poppins,sans-serif" fill="#aaa">···</text>
    </svg>`;
  }

  if (type === 'cube_direct') {
    return `<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="38" width="44" height="44" fill="#f7fbfc" stroke="#afd2db" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#000" font-weight="600"><tspan x="23" y="47" font-size="8">BMS</tspan><tspan x="23" dy="10" font-size="8">MASTER</tspan></text>
      <text x="23" y="69" text-anchor="middle" font-size="6" font-family="Poppins,sans-serif" fill="#878787">RTU/TCP/</text>
      <text x="23" y="77" text-anchor="middle" font-size="6" font-family="Poppins,sans-serif" fill="#878787">BACnet</text>
      <line x1="45" y1="60" x2="80" y2="60" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
      <rect x="80" y="38" width="110" height="44" fill="#afd2db" stroke="#7abfcc" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#0d3d4a">
        <tspan x="135" y="57" font-size="9" font-weight="600">Cube</tspan>
        <tspan x="135" dy="12" font-size="7">połączenie bezpośrednie</tspan>
      </text>
    </svg>`;
  }

  if (type === 'drv') {
    return `<svg viewBox="0 0 200 100" width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="33" width="50" height="34" fill="#f7fbfc" stroke="#afd2db" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#000" font-weight="600"><tspan x="30" y="42" font-size="8">BMS</tspan><tspan x="30" dy="11" font-size="8">MASTER</tspan></text>
      <text x="30" y="63" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">RS485</text>
      <line x1="55" y1="50" x2="80" y2="50" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
      <rect x="80" y="28" width="110" height="44" fill="#afd2db" stroke="#7abfcc" stroke-width="1"/>
      <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#0d3d4a">
        <tspan x="135" y="46" font-size="9" font-weight="600">DRV</tspan>
        <tspan x="135" dy="12" font-size="7">połączenie bezpośrednie</tspan>
      </text>
    </svg>`;
  }

  /* HMI Wi-Fi AC / EC */
  const tp = type === 'hmi_wifi_ac' ? 'AC' : 'EC';
  return `<svg viewBox="0 0 200 100" width="200" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="33" width="50" height="34" fill="#f7fbfc" stroke="#afd2db" stroke-width="1"/>
    <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#000" font-weight="600"><tspan x="30" y="42" font-size="8">BMS</tspan><tspan x="30" dy="11" font-size="8">MASTER</tspan></text>
    <text x="30" y="63" text-anchor="middle" font-size="6.5" font-family="Poppins,sans-serif" fill="#878787">RS485</text>
    <line x1="55" y1="50" x2="80" y2="50" stroke="#afd2db" stroke-width="1.2" stroke-dasharray="4,2"/>
    <rect x="80" y="28" width="110" height="44" fill="#afd2db" stroke="#7abfcc" stroke-width="1"/>
    <text text-anchor="middle" font-family="Poppins,sans-serif" fill="#0d3d4a">
      <tspan x="135" y="46" font-size="9" font-weight="600">HMI Wi-Fi ${tp}</tspan>
      <tspan x="135" dy="12" font-size="7">termostat pokojowy</tspan>
    </text>
  </svg>`;
}

/* Stan zwijania karty samouczka — domyślnie zwinięta */
let tutCardOpen = false;

/**
 * Renderuje kartę samouczka dla wybranego sterownika.
 * Woływana przy zmianie sterownika oraz przy zmianie języka.
 */
function renderTutorialCard(controllerType) {
  const card = document.getElementById('tutorial-card');
  const data  = TUTORIAL_DATA[controllerType];
  if (!data) { card.style.display = 'none'; return; }

  const d = data[currentLang] || data['pl'];

  /* Nagłówek */
  document.getElementById('tut-ctrl-name').textContent = d.name;
  document.getElementById('tut-label').textContent     = t('tutorial.label');
  document.getElementById('tut-toggle-txt').textContent =
    t(tutCardOpen ? 'tutorial.collapse' : 'tutorial.expand');

  /* Parametry transmisji */
  const paramsHtml = d.params
    .map(([k, v]) =>
      `<span class="tut-param-label">${k}</span><span class="tut-param-val">${v}</span>`)
    .join('');

  /* Tryby pracy (opcjonalne) */
  const modesHtml = (d.modes && d.modes.length) ? `
    <div class="tut-section-title">${t('tutorial.modes')}</div>
    <div class="tut-modes-list">
      ${d.modes.map(([n, desc]) =>
        `<div class="tut-mode-item"><span class="tut-mode-name">${n}</span> — ${desc}</div>`
      ).join('')}
    </div>` : '';

  /* Treść body */
  document.getElementById('tutorial-body').innerHTML = `
    <div class="tut-body-top">
      <p class="tut-desc">${d.desc}</p>
      <div class="tut-diagram-wrap">${buildTutorialDiagram(controllerType)}</div>
    </div>
    <div class="tut-section-title">${t('tutorial.params')}</div>
    <div class="tut-params-grid">${paramsHtml}</div>
    ${modesHtml}
  `;

  /* Zachowaj stan zwinięcia */
  document.getElementById('tutorial-body').style.display = tutCardOpen ? '' : 'none';

  card.style.display = '';
}

/**
 * Zwija / rozwija ciało karty samouczka.
 */
function toggleTutorialCard() {
  tutCardOpen = !tutCardOpen;
  document.getElementById('tutorial-body').style.display = tutCardOpen ? '' : 'none';
  document.getElementById('tut-toggle-txt').textContent =
    t(tutCardOpen ? 'tutorial.collapse' : 'tutorial.expand');
  const ch = document.getElementById('tut-chevron');
  ch.className = 'tut-chevron' + (tutCardOpen ? ' open' : '');
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
  const isHmiWifi  = val === 'hmi_wifi_ac' || val === 'hmi_wifi_ec';
  const isDrv        = val === 'drv';
  const isCubeDirect = val === 'cube_direct';

  // Tryb pracy — widoczny tylko dla T-box klasycznego
  document.getElementById('mode-field').style.display = (isTboxZone || isMbox || isHmiWifi || isDrv || isCubeDirect) ? 'none' : '';

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
  if (devHeader) devHeader.style.display = (isHmiWifi || isDrv || isCubeDirect) ? 'none' : '';

  // Sekcja urządzeń T-box
  document.getElementById('devices-container').style.display = (isMbox || isHmiWifi || isDrv || isCubeDirect) ? 'none' : '';

  // Kontener urządzeń M-box (dynamiczne wiersze)
  const mboxContainer = document.getElementById('mbox-devices-container');
  if (mboxContainer) mboxContainer.style.display = isMbox ? 'block' : 'none';

  // Kontener urządzenia DRV (pojedynczy select)
  const drvContainer = document.getElementById('drv-container');
  if (drvContainer) drvContainer.style.display = isDrv ? 'block' : 'none';

  // Cube (bezpośrednio) — brak selektu urządzenia; zarządza tylko przyciskami
  const cubeActions = document.getElementById('cube-actions');
  if (cubeActions) cubeActions.style.display = isCubeDirect ? 'flex' : 'none';

  // Przyciski formularza T-box
  document.getElementById('tbox-actions').style.display = (isMbox || isHmiWifi || isDrv || isCubeDirect) ? 'none' : '';

  // Przyciski formularza M-box
  const mboxActions = document.getElementById('mbox-actions');
  if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';

  // Przyciski formularza HMI Wi-Fi AC
  const hmiActions = document.getElementById('hmi-actions');
  if (hmiActions) hmiActions.style.display = isHmiWifi ? 'flex' : 'none';

  // Przyciski formularza DRV
  const drvActions = document.getElementById('drv-actions');
  if (drvActions) drvActions.style.display = isDrv ? 'flex' : 'none';

  // Przebuduj listę urządzeń DRV (wszystkie urządzenia bez tbox_zone_only)
  if (isDrv) {
    const drvSel = document.getElementById('drv-device-select');
    if (drvSel) {
      const current = drvSel.value;
      const names = Object.keys(devices)
        .filter(name => !devices[name].tbox_zone_only && !name.includes('CUBE'))
        .sort();
      drvSel.innerHTML = names.map(n =>
        `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`
      ).join('');
      if (!names.includes(current) && names.length > 0) drvSel.value = names[0];
    }
  }

  // Przebuduj opcje w selektach urządzeń T-box (tylko gdy nie M-box, nie HMI, nie DRV, nie Cube)
  if (!isMbox && !isHmiWifi && !isDrv && !isCubeDirect) {
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

  /* Karta samouczka — aktualizuj przy zmianie sterownika */
  renderTutorialCard(val);
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
  if (controllerType === 'hmi_wifi_ec') { showHmiWifiEcResults(); return; }
  if (controllerType === 'drv')         { showDrvResults(); return; }

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

/**
 * Wyświetla wyniki dla sterownika HMI Wi-Fi EC.
 * Analogicznie do showHmiWifiAcResults() — podział na RO i R/W.
 */
function showHmiWifiEcResults() {
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const roRows = HMI_WIFI_EC.regs
    .filter(r => r.rw === 'RO')
    .map(r => ({ addrDec: r.addr, addrHex: Calculator.toHex(r.addr), name: r.name, reg: r }));

  const rwRows = HMI_WIFI_EC.regs
    .filter(r => r.rw === 'R/W')
    .map(r => ({ addrDec: r.addr, addrHex: Calculator.toHex(r.addr), name: r.name, reg: r }));

  const wrapper = document.createElement('div');
  wrapper.className = 'result-block';
  wrapper.innerHTML = `
    <div class="result-block-header">
      <h3>HMI Wi-Fi EC</h3>
      <span class="badge">Rejestry sterownika</span>
    </div>`;
  wrapper.appendChild(buildRegSection(t('section.ir'), roRows));
  wrapper.appendChild(buildRegSection(t('section.hr_rw'), rwRows));
  resultsEl.appendChild(wrapper);

  document.getElementById('results').style.display = '';
  document.getElementById('form-section').style.display = 'none';
}

// ============================================================
// Render: DRV (bezpośrednio)
// ============================================================

/**
 * Wyświetla rejestry wybranego urządzenia DRV przy bezpośrednim
 * połączeniu BMS–DRV. Adresy = wartości offset z JSON (bez kalkulacji).
 */
function showDrvResults() {
  const sel    = document.getElementById('drv-device-select');
  const name   = sel ? sel.value : '';
  const device = devices[name];

  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'result-block';

  const header = document.createElement('div');
  header.className = 'result-block-header';
  const headerLabel = currentLang === 'en' ? 'Direct connection' : 'Połączenie bezpośrednie';
  header.innerHTML = `<h3>${name}</h3><span class="badge">${headerLabel} — Modbus RTU</span>`;
  block.appendChild(header);

  if (!device) {
    const empty = document.createElement('div');
    empty.className = 'empty-note';
    empty.textContent = t('misc.no_regs');
    block.appendChild(empty);
    resultsEl.appendChild(block);
  } else {
    // Input Registers — adresy bezpośrednie z offset
    const irRows = (device.input_registers || []).map(reg => ({
      addrDec: reg.offset,
      addrHex: Calculator.toHex(reg.offset),
      name:    reg.name,
      reg:     reg,
    }));

    // Holding Registers — adresy bezpośrednie z offset
    const hrRows = (device.holding_registers_single || []).map(reg => ({
      addrDec: reg.offset,
      addrHex: Calculator.toHex(reg.offset),
      name:    reg.name,
      reg:     reg,
    }));

    if (irRows.length > 0) block.appendChild(buildRegSection(t('section.ir'), irRows));
    if (hrRows.length > 0) block.appendChild(buildRegSection(t('section.hr'), hrRows));

    if (irRows.length === 0 && hrRows.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-note';
      empty.textContent = t('misc.no_regs');
      block.appendChild(empty);
    }
  }

  resultsEl.appendChild(block);

  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Dane rejestrów Cube (bezpośrednio)
// Źródło: Rooftop Cube v02022024_2EN (Modbus) + FLOWAIR_CUBE_BACnet (BACnet)
// ============================================================
const CUBE_DIRECT = {

  // --- Modbus: Input Registers ---
  ir: [
    {
      offset: 9, name: 'ambient temp.value',
      description:    'Temperatura otoczenia (zewnętrzna).',
      description_en: 'Outside temperature.',
      min: -500, max: 1000, unit: 'x0.1 °C',
    },
    {
      offset: 10, name: 'supply temp.value',
      description:    'Temperatura powietrza nawiewanego.',
      description_en: 'Supply air temperature.',
      min: -500, max: 1000, unit: 'x0.1 °C',
    },
    {
      offset: 11, name: 'return temp.value',
      description:    'Temperatura powietrza wywiewanego.',
      description_en: 'Exhaust air temperature.',
      min: -500, max: 1000, unit: 'x0.1 °C',
    },
    {
      offset: 12, name: 'water temp.value',
      description:    'Temperatura wymiennika wodnego.',
      description_en: 'Water exchanger temperature.',
      min: -500, max: 1000, unit: 'x0.1 °C',
    },
    {
      offset: 13, name: 'temperature room',
      description:    'Temperatura pomieszczenia.',
      description_en: 'Room temperature.',
      min: -500, max: 1000, unit: 'x0.1 °C',
    },
    {
      offset: 14, name: 'recirculation damper level',
      description:    'Aktualny poziom otwarcia przepustnicy recyrkulacyjnej.',
      description_en: 'Current recirculation damper position.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 15, name: 'swirl diffuser position',
      description:    'Aktualna pozycja nawiewnika wirowego.',
      description_en: 'Current swirl diffuser position.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 16, name: 'rotary level',
      description:    'Aktualny poziom obrotowego wymiennika ciepła.',
      description_en: 'Rotary heat exchanger level.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 17, name: 'fan supply flow',
      description:    'Aktualny przepływ wentylatora nawiewu.',
      description_en: 'Fan supply flow.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 18, name: 'gas heating value',
      description:    'Aktualna wartość grzania gazowego.',
      description_en: 'Gas heating value.',
      min: 0, unit: '%',
    },
    {
      offset: 19, name: 'CO2_status',
      description:    'Status czujnika CO₂.',
      description_en: 'CO₂ sensor status.',
    },
    {
      offset: 20, name: 'rooftop work mode',
      description:    'Nastawa trybu pracy urządzenia.',
      description_en: 'Rooftop work mode setpoint.',
      values:    { '0': 'Off — wyłączony', '1': 'StandBy — tryb czuwania', '2': 'Eco — tryb ekonomiczny', '3': 'Comfort — tryb komfortowy' },
      values_en: { '0': 'Off', '1': 'StandBy', '2': 'Eco', '3': 'Comfort' },
    },
    {
      offset: 21, name: 'rooftop current work mode',
      description:    'Aktualny tryb pracy urządzenia.',
      description_en: 'Current rooftop operating mode.',
      values:    { '0': 'Off — wyłączony', '1': 'StandBy — tryb czuwania', '2': 'Eco — tryb ekonomiczny', '3': 'Comfort — tryb komfortowy' },
      values_en: { '0': 'Off', '1': 'StandBy', '2': 'Eco', '3': 'Comfort' },
    },
    {
      offset: 22, name: 'alarm',
      description:    'Status alarmu urządzenia.',
      description_en: 'Device alarm status.',
      values:    { '0': 'OK', '1': 'Maintenance — wymagana konserwacja', '2': 'Warning — ostrzeżenie', '3': 'Fault — błąd', '4': 'Danger — zagrożenie' },
      values_en: { '0': 'OK', '1': 'Maintenance', '2': 'Warning', '3': 'Fault', '4': 'Danger' },
    },
    {
      offset: 23, name: 'room temp.sensor status',
      description:    'Status czujnika temperatury pomieszczenia.',
      description_en: 'Room temperature sensor status.',
    },
    {
      offset: 24, name: 'dehum absolute humidity setpoint',
      description:    'Nastawa wilgotności bezwzględnej (osuszanie). Wartość x0,01 g/kg.',
      description_en: 'Dehumidification absolute humidity setpoint. Value x0.01 g/kg.',
      min: 200, max: 1000, unit: 'x0.01 g/kg',
    },
    {
      offset: 25, name: 'humidity control',
      description:    'Status sterowania wilgotnością.',
      description_en: 'Humidity control status.',
    },
    {
      offset: 26, name: 'CntrlSource',
      description:    'Aktywne źródło sterowania urządzeniem.',
      description_en: 'Active device control source.',
    },
    {
      offset: 100, name: 'WtrCoilPosition',
      description:    'Aktualna pozycja zaworu wymiennika wodnego (chłodzenie).',
      description_en: 'Water cooler recirculation valve position.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 101, name: 'ClgWtr',
      description:    'Status układu chłodzenia wodnego.',
      description_en: 'Cold water cooling status.',
    },
    {
      offset: 102, name: 'HotWtr',
      description:    'Status układu grzania wodnego.',
      description_en: 'Hot water heating status.',
    },
    {
      offset: 103, name: 'HtgSwitch_1Swi',
      description:    'Aktualny poziom sterowania grzałką elektryczną.',
      description_en: 'Electric heater control level.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 104, name: 'HumAmbntVal',
      description:    'Wilgotność względna zewnętrzna.',
      description_en: 'Outside relative humidity.',
      min: 0, max: 100, unit: '%rH',
    },
    {
      offset: 105, name: 'HumRtnVal',
      description:    'Wilgotność względna powietrza wywiewanego.',
      description_en: 'Return air relative humidity.',
      min: 0, max: 100, unit: '%rH',
    },
  ],

  // --- Modbus: Holding Registers (RTP Cube, offset 100–127) ---
  hr: [
    {
      offset: 100, name: 'work mode',
      description:    'Nastawa trybu pracy urządzenia z poziomu BMS.',
      description_en: 'Work mode setting from BMS.',
      values:    { '0': 'Off — wyłączony', '1': 'StandBy — tryb czuwania', '2': 'Eco — tryb ekonomiczny', '3': 'Comfort — tryb komfortowy' },
      values_en: { '0': 'Off', '1': 'StandBy', '2': 'Eco', '3': 'Comfort' },
    },
    {
      offset: 101, name: 'Comfort flow',
      description:    'Nastawa przepływu powietrza w trybie Komfort.',
      description_en: 'Comfort mode airflow setpoint.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 102, name: 'Eco flow',
      description:    'Nastawa przepływu powietrza w trybie Eko.',
      description_en: 'Eco mode airflow setpoint.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 103, name: 'Standby flow',
      description:    'Nastawa przepływu powietrza w trybie Czuwania.',
      description_en: 'Standby mode airflow setpoint.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 104, name: 'flow rem1',
      description:    'Nastawa przepływu dla wejścia zewnętrznego Rem 1.',
      description_en: 'Airflow setpoint for remote input Rem 1.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 105, name: 'flow rem 2',
      description:    'Nastawa przepływu dla wejścia zewnętrznego Rem 2.',
      description_en: 'Airflow setpoint for remote input Rem 2.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 106, name: 'flow rem 3',
      description:    'Nastawa przepływu dla wejścia zewnętrznego Rem 3.',
      description_en: 'Airflow setpoint for remote input Rem 3.',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 107, name: 'Over Run flow',
      description:    'Nastawa przepływu Over Run (dogrzewanie po wyłączeniu).',
      description_en: 'Over run airflow setpoint (post-off ventilation).',
      min: 0, unit: 'm³/h',
    },
    {
      offset: 108, name: 'temperature ref Eco',
      description:    'Temperatura zadana w trybie Eko.',
      description_en: 'Target temperature in Eco mode.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 109, name: 'temperature ref Cmfrt',
      description:    'Temperatura zadana w trybie Komfort.',
      description_en: 'Target temperature in Comfort mode.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 110, name: 'temperature ref Thrmst',
      description:    'Temperatura zadana w trybie Termostatycznym.',
      description_en: 'Target temperature in Thermostatic mode.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 111, name: 'temperature ref NClg',
      description:    'Temperatura zadana dla chłodzenia nocnego.',
      description_en: 'Target temperature for night cooling.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 112, name: 'recirculation damper mode',
      description:    'Tryb pracy przepustnicy recyrkulacyjnej.',
      description_en: 'Recirculation damper operating mode.',
      values:    { '0': 'Auto — automatyczny', '1': 'Manual — ręczny' },
      values_en: { '0': 'Auto', '1': 'Manual' },
    },
    {
      offset: 113, name: 'recirculation damper level',
      description:    'Nastawa poziomu otwarcia przepustnicy recyrkulacyjnej.',
      description_en: 'Recirculation damper position setpoint.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 114, name: 'recirculation damper level NClg',
      description:    'Nastawa poziomu przepustnicy recyrkulacyjnej — chłodzenie nocne.',
      description_en: 'Recirculation damper level for night cooling.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 115, name: 'recirculation damper level Rem1',
      description:    'Nastawa poziomu przepustnicy recyrkulacyjnej — Rem 1.',
      description_en: 'Recirculation damper level for remote input Rem 1.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 116, name: 'recirculation damper level Rem2',
      description:    'Nastawa poziomu przepustnicy recyrkulacyjnej — Rem 2.',
      description_en: 'Recirculation damper level for remote input Rem 2.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 117, name: 'recirculation damper level Rem3',
      description:    'Nastawa poziomu przepustnicy recyrkulacyjnej — Rem 3.',
      description_en: 'Recirculation damper level for remote input Rem 3.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 118, name: 'swirl diffuser mode',
      description:    'Tryb pracy nawiewnika wirowego.',
      description_en: 'Swirl diffuser operating mode.',
      values:    { '0': 'Auto — automatyczny', '1': 'Manual — ręczny' },
      values_en: { '0': 'Auto', '1': 'Manual' },
    },
    {
      offset: 119, name: 'Htg_swirl_diffuser_level',
      description:    'Nastawa poziomu nawiewnika wirowego w trybie grzania.',
      description_en: 'Swirl diffuser level setpoint in heating mode.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 120, name: 'Clg_swirl_diffuser_level',
      description:    'Nastawa poziomu nawiewnika wirowego w trybie chłodzenia.',
      description_en: 'Swirl diffuser level setpoint in cooling mode.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 121, name: 'swirl_diffuser_level manual',
      description:    'Nastawa poziomu nawiewnika wirowego w trybie ręcznym.',
      description_en: 'Swirl diffuser level setpoint in manual mode.',
      min: 0, max: 100, unit: '%',
    },
    {
      offset: 122, name: 'com Status',
      description:    'Status komunikacji z systemem BMS.',
      description_en: 'BMS communication status.',
    },
    {
      offset: 123, name: 'DehumTmpCmfrt',
      description:    'Temperatura zadana osuszania w trybie Komfort.',
      description_en: 'Drying temperature setpoint in Comfort mode.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 124, name: 'DehumHumCmfrt',
      description:    'Nastawa wilgotności względnej osuszania w trybie Komfort.',
      description_en: 'Drying relative humidity setpoint in Comfort mode.',
      min: 0, max: 100, unit: '%rH',
    },
    {
      offset: 125, name: 'DehumTmpEco',
      description:    'Temperatura zadana osuszania w trybie Eko.',
      description_en: 'Drying temperature setpoint in Eco mode.',
      min: 100, max: 400, unit: 'x0.1 °C',
    },
    {
      offset: 126, name: 'DehumHumEco',
      description:    'Nastawa wilgotności względnej osuszania w trybie Eko.',
      description_en: 'Drying relative humidity setpoint in Eco mode.',
      min: 0, max: 100, unit: '%rH',
    },
    {
      offset: 127, name: 'Dehum DB',
      description:    'Strefa nieczułości algorytmu osuszania.',
      description_en: 'Dehumidification control deadband.',
      min: 0, max: 50, unit: 'x0.1 °C',
    },
  ],

  // --- BACnet IP ---
  // Źródło: 20220606_FLOWAIR_CUBE_BACnet.pdf, urządzenie POL908_FF489E
  bacnet: [
    { no:  1, name: 'ActiveAlarm',     instance:  16512, en: 'Alarm',                      pl: 'Alarm urządzenia',                                     states: 'OK; Maintenance; Warning; Fault; Danger' },
    { no:  2, name: 'AlmAckPls',       instance:  35011, en: 'Alarm acknowledge',           pl: 'Reset alarmu',                                         states: 'Ack' },
    { no:  3, name: 'Htg1AlmVal',      instance:  15248, en: 'Heating 1 alarm Status',      pl: 'Stan alarmu grzania 1',                                states: 'Passive; Active' },
    { no:  4, name: 'Htg2AlmVal',      instance:  62437, en: 'Heating 2 alarm Status',      pl: 'Stan alarmu grzania 2',                                states: 'Passive; Active' },
    { no:  5, name: 'FanSply1Filter',  instance:  32120, en: 'Supply air filter',           pl: 'Stan filtra powietrza nawiewanego',                    states: 'OK; Alarm' },
    { no:  6, name: 'FanRtn1Filter',   instance:  53365, en: 'Return air filter',           pl: 'Stan filtra powietrza wywiewanego',                    states: 'OK; Alarm' },
    { no:  7, name: 'FanSply1Flow',    instance:  21243, en: 'Supply fan 1 flow',           pl: 'Nastawa przepływu wentylatora nawiewanego 1',          unit: 'm³/h' },
    { no:  8, name: 'TmpAmbntVal',     instance:  41863, en: 'Ambient temperature value',   pl: 'Temp. otoczenia',                                      unit: '°C' },
    { no:  9, name: 'TmpRtnVal',       instance:  26527, en: 'Return temperature',          pl: 'Temp. powietrza wyciągowego',                          unit: '°C' },
    { no: 10, name: 'TmpSplyVal',      instance:  40967, en: 'Supply temperature',          pl: 'Temp. powietrza nawiewanego',                          unit: '°C' },
    { no: 11, name: 'TmpWtrVal',       instance:  37193, en: 'Water temperature',           pl: 'Temp. wody na króćcu powrotnym',                       unit: '°C' },
    { no: 12, name: 'DXCmpr1Val',      instance:   4664, en: 'Compressor 1 Status',         pl: 'Stan pracy kompresora 1',                              states: 'Passive; Active' },
    { no: 13, name: 'DXCmpr2Val',      instance:  64746, en: 'Compressor 2 Status',         pl: 'Stan pracy kompresora 2',                              states: 'Passive; Active' },
    { no: 14, name: 'DXCmpr3Val',      instance:  22203, en: 'Compressor 3 Status',         pl: 'Stan pracy kompresora 3',                              states: 'Passive; Active' },
    { no: 15, name: 'DXCmpr4Val',      instance:  12655, en: 'Compressor 4 Status',         pl: 'Stan pracy kompresora 4',                              states: 'Passive; Active' },
    { no: 16, name: 'DXCpctyCmd',      instance:  25667, en: 'DX capacity signal',          pl: 'Wydajność układu chłodzenia DX',                       unit: '%' },
    { no: 17, name: 'BMSOpModStp',     instance: 254195, en: 'BMS oper. mode stpt',         pl: 'Nastawa trybu pracy urządzenia (BMS)',                  states: 'Off; StndBy; Eco; Comf' },
    { no: 18, name: 'ActOpModStpMod',  instance:  47792, en: 'Operation mode set point',    pl: 'Zadany tryb pracy urządzenia',                         states: 'Off; StnBy; Eco; Comf' },
    { no: 19, name: 'StpTmpCmfrt',     instance:    842, en: 'Comfort temp. setpoint',      pl: 'Nastawa temp. dla trybu Komfort',                      unit: '°C' },
    { no: 20, name: 'StpTmpClg',       instance:  48466, en: 'Cooling stpt',                pl: 'Nastawa temp. dla chłodzenia',                         unit: '°C' },
    { no: 21, name: 'StpTmpEco',       instance:  40644, en: 'Eco temp. setpoint',          pl: 'Nastawa temp. dla trybu Eko',                          unit: '°C' },
    { no: 22, name: 'StpTmpHtg',       instance:  51065, en: 'Heating stpt',                pl: 'Nastawa temp. dla grzania',                            unit: '°C' },
    { no: 23, name: 'StpFlowCmfrt',    instance:  15679, en: 'Comfort flow setpoint',       pl: 'Nastawa wydajności wentylatora — tryb Komfort',        unit: 'm³/h' },
    { no: 24, name: 'StpFlowEco',      instance:  25922, en: 'Eco flow setpoint',           pl: 'Nastawa wydajności wentylatora — tryb Eko',            unit: 'm³/h' },
    { no: 25, name: 'DmprPosCmd',      instance:  17359, en: 'Damper signal',               pl: 'Aktualna nastawa przepustnicy recyrkulacyjnej',        unit: '%' },
    { no: 26, name: 'StpRecMan',       instance:   1993, en: 'Recirculation man stpt',      pl: 'Nastawa przepustnicy recyrkulacyjnej (ręczna)',         unit: '%' },
    { no: 27, name: 'DfsrPosCmd',      instance:  38159, en: 'Diffuser signal',             pl: 'Aktualna nastawa nawiewnika wirowego',                  unit: '%' },
    { no: 28, name: 'StpDfsrStpt',     instance:  55450, en: 'Diffuser stpt',               pl: 'Nastawa nawiewnika wirowego',                          unit: '%' },
    { no: 29, name: 'DehumAbsHumStp',  instance:  16797, en: 'Drying Act.humidity setp.',   pl: 'Osuszanie — akt. nastawa wilgotności',                 unit: 'g/kg' },
    { no: 30, name: 'DehumHumCmfrt',   instance:   5178, en: 'Drying Comf. humidity',       pl: 'Osuszanie — nastawa wilgotności wzgl. tryb Komfort',   unit: '%rH' },
  ],
};

// ============================================================
// Render: Cube (bezpośrednio) — Modbus RTU / TCP
// ============================================================

function showCubeModbusResults() {
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'result-block';

  const header = document.createElement('div');
  header.className = 'result-block-header';
  header.innerHTML = '<h3>Cube</h3><span class="badge">Modbus RTU / TCP</span>';
  block.appendChild(header);

  /* Mapper: offset → {addrDec, addrHex, name, reg} — przekazuje wszystkie pola */
  const mapReg = reg => ({
    addrDec: reg.offset,
    addrHex: Calculator.toHex(reg.offset),
    name:    reg.name,
    reg: {
      description:    reg.description,
      description_en: reg.description_en,
      unit:           reg.unit,
      min:            reg.min,
      max:            reg.max,
      values:         reg.values,
      values_en:      reg.values_en,
    },
  });

  const irRows = CUBE_DIRECT.ir.map(mapReg);
  const hrRows = CUBE_DIRECT.hr.map(mapReg);

  if (irRows.length > 0) block.appendChild(buildRegSection(t('section.ir'), irRows));
  if (hrRows.length > 0) block.appendChild(buildRegSection(t('section.hr'), hrRows));

  resultsEl.appendChild(block);
  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// Render: Cube (bezpośrednio) — BACnet IP
// ============================================================

function showCubeBacnetResults() {
  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'result-block';

  const header = document.createElement('div');
  header.className = 'result-block-header';
  header.innerHTML = '<h3>Cube</h3><span class="badge">BACnet IP</span>';
  block.appendChild(header);

  block.appendChild(buildBacnetSection(CUBE_DIRECT.bacnet));

  resultsEl.appendChild(block);
  document.getElementById('results').style.display = 'block';
  document.querySelector('.form-section').style.display = 'none';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Buduje sekcję tabeli dla obiektów BACnet IP.
 * Kolumny: Nr | Instance | Object Name | Opis | Stany / Jednostka
 */
function buildBacnetSection(objects) {
  const section = document.createElement('div');
  section.className = 'reg-section';

  const titleEl = document.createElement('div');
  titleEl.className = 'reg-section-title';
  titleEl.textContent = currentLang === 'en' ? 'BACnet Objects' : 'Obiekty BACnet';
  section.appendChild(titleEl);

  const table = document.createElement('table');
  table.className = 'reg-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>${currentLang === 'en' ? 'No.' : 'Nr'}</th>
        <th>Instance</th>
        <th>Object Name</th>
        <th>${currentLang === 'en' ? 'Description' : 'Opis'}</th>
        <th>${currentLang === 'en' ? 'States / Unit' : 'Stany / Jednostka'}</th>
      </tr>
    </thead>`;

  const tbody = document.createElement('tbody');
  objects.forEach(obj => {
    const desc = currentLang === 'en' ? obj.en : obj.pl;
    const extra = obj.states
      ? `<span style="font-size:11px;color:#878787">${obj.states}</span>`
      : (obj.unit ? `<i style="font-size:11px;color:#878787">${obj.unit}</i>` : '');

    const tr = document.createElement('tr');
    tr.className = 'reg-row';
    tr.innerHTML = `
      <td style="color:#aaa">${obj.no}</td>
      <td><span class="addr-dec">${obj.instance}</span></td>
      <td><span class="reg-name">${obj.name}</span></td>
      <td>${desc}</td>
      <td>${extra}</td>`;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  section.appendChild(table);
  return section;
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

/**
 * Wraca do widoku formularza ze strony wyników.
 * Nie resetuje ustawień — zachowuje wybrany sterownik, tryb, urządzenia, adresy.
 */
function backToForm() {
  const results = document.getElementById('results');
  if (results.style.display === 'none') return;
  results.style.display = 'none';
  document.querySelector('.form-section').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
document.getElementById('btn-back').addEventListener('click', backToForm);
document.getElementById('btn-reset').addEventListener('click', resetForm);

// Kliknięcie w logo — powrót do formularza bez resetowania ustawień
document.querySelector('.header-logo-area').addEventListener('click', backToForm);
document.getElementById('btn-mbox-calculate').addEventListener('click', calculateMbox);
document.getElementById('btn-add-mbox-device').addEventListener('click', addMboxDeviceRow);
document.getElementById('btn-hmi-calculate').addEventListener('click', calculate);
document.getElementById('btn-drv-calculate').addEventListener('click', calculate);
document.getElementById('btn-cube-modbus').addEventListener('click', showCubeModbusResults);
document.getElementById('btn-cube-bacnet').addEventListener('click', showCubeBacnetResults);
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Zapamiętaj pozycję przewijania przed re-renderem
    const scrollY = window.scrollY;

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setLang(btn.dataset.lang);
    applyStaticTranslations();
    // Karta samouczka — przerenderuj z nowym językiem
    const tutCard = document.getElementById('tutorial-card');
    if (tutCard && tutCard.style.display !== 'none') {
      renderTutorialCard(document.getElementById('controllerType').value);
    }
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
