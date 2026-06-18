# TASK_019 — Angielskie opisy rejestrów (description_en)

## Kontekst

Po TASK_018 `renderValueInfo()` w `calculator.js` obsługuje pole `description_en`:
jeśli rejestr ma to pole i język = EN, wyświetla je zamiast `description`.

Ten task dodaje `description_en` do:
1. Tablic rejestrów sterownika w `frontend/js/calculator.js` (hardkodowane)
2. Plików urządzeń `devices/*.json` (14 plików)

**Zasady pracy z JSON:**
- Edytuj sekcje małymi diff-ami, nie przepisuj całych plików
- Po każdym pliku uruchom walidację:
  ```
  python3 -c "import json,os; [json.load(open(f'devices/{f}')) for f in os.listdir('devices') if f.endswith('.json') and f != '_schema.json']; print('JSON OK')"
  ```
- Po wszystkich plikach przebuduj `devices-data.js`:
  ```python
  import json, os
  devices = {}
  for fname in sorted(os.listdir('devices')):
      if not fname.endswith('.json') or fname == '_schema.json': continue
      with open(f'devices/{fname}', encoding='utf-8') as f:
          d = json.load(f)
      devices[d['name']] = d
  devices_sorted = dict(sorted(devices.items(), key=lambda x: x[1].get('group_priority', 99)))
  output = 'const DEVICES_DATA = ' + json.dumps(devices_sorted, ensure_ascii=False, indent=2) + ';\n'
  with open('frontend/js/devices-data.js', 'w', encoding='utf-8') as f:
      f.write(output)
  print('devices-data.js rebuilt OK')
  ```

---

## Zmiana 1 — `frontend/js/calculator.js` — rejestry sterownika T-box

W obu tablicach (ok. linie 143–171) dodaj pole `description_en` przy każdym rejestrze.

### Input Registers (IR) sterownika

```js
{ addr: 0,  name: 'HardwareType',         description: 'Informacja o typie sprzętu i wersji PCB.',                                                          description_en: 'Hardware type and PCB version information.' },
{ addr: 1,  name: 'SoftType',             description: 'Typ i wersja oprogramowania sterownika.',                                                            description_en: 'Controller firmware type and version.' },
{ addr: 2,  name: 'ConnectionCnt',        description: 'Licznik połączeń — rośnie przy każdym odczycie. Pierwsze zapytanie zawsze zwraca 0x01. Monitoring tego rejestru umożliwia diagnostykę połączenia.', description_en: 'Connection counter — increments on each read. First query always returns 0x01. Monitoring this register enables connection diagnostics.' },
{ addr: 3,  name: 'SoftVer',             description: 'Wersja oprogramowania sterownika.',                                                                  description_en: 'Controller firmware version.' },
{ addr: 4,  name: 'MainSensorReading',   description: 'Temperatura zmierzona przez czujnik główny.',                                                        description_en: 'Temperature measured by the main sensor.' },
{ addr: 5,  name: 'SecSensorReading',    description: 'Temperatura zmierzona przez czujnik pomocniczy.',                                                    description_en: 'Temperature measured by the secondary sensor.' },
{ addr: 8,  name: 'DeviceCount',         description: 'Liczba wykrytych urządzeń podłączonych do sterownika.',                                              description_en: 'Number of devices detected on the controller.' },
{ addr: 9,  name: 'ZoneCount',           description: 'Liczba skonfigurowanych stref.',                                                                     description_en: 'Number of configured zones.' },
{ addr: 10, name: 'GroupCount',          description: 'Liczba grup urządzeń.',                                                                              description_en: 'Number of device groups.' },
{ addr: 11, name: 'DeviceStatus1-16',    description: 'Status wykrytych urządzeń 1–16. Każdy bit odpowiada jednemu urządzeniu.',                            description_en: 'Status of detected devices 1–16. Each bit corresponds to one device.' },
{ addr: 12, name: 'DeviceStatus17-32',   description: 'Status wykrytych urządzeń 17–32. Każdy bit odpowiada jednemu urządzeniu.',                           description_en: 'Status of detected devices 17–32. Each bit corresponds to one device.' },
{ addr: 13, name: 'ControlerStatus1-16', description: 'Status sterownika — wartość 32-bitowa, bity 1–16.',                                                  description_en: 'Controller status — 32-bit value, bits 1–16.' },
{ addr: 14, name: 'ControlerStatus17-32',description: 'Status sterownika — wartość 23-bitowa, bity 17–31.',                                                 description_en: 'Controller status — bits 17–31.' },
{ addr: 15, name: 'InfoStartPoint',      description: 'Punkt startowy dynamicznej informacji o urządzeniach (patrz rejestr IR 0x10 — mapowanie urządzeń).', description_en: 'Start point of dynamic device information (see IR register 0x10 — device mapping).' },
```

### Holding Registers (HR) sterownika

```js
{ addr: 0,  name: 'SetScreenLock',            description: 'Włącza blokadę ekranu sterownika.',                                    description_en: 'Enables controller screen lock.' },
{ addr: 1,  name: 'EnableDisableController',  description: 'Włącza lub wyłącza sterownik i wszystkie podłączone urządzenia.',      description_en: 'Enables or disables the controller and all connected devices.' },
{ addr: 2,  name: 'UnlockScreen',             description: 'Odblokowuje ekran — aktywne gdy blokada ekranu jest włączona.',        description_en: 'Unlocks the screen — active when screen lock is enabled.' },
{ addr: 4,  name: 'SetYear',                  description: 'Ustawienie daty i czasu — rok.',                                       description_en: 'Date and time setting — year.' },
{ addr: 5,  name: 'SetMonth',                 description: 'Ustawienie daty i czasu — miesiąc.',                                   description_en: 'Date and time setting — month.' },
{ addr: 6,  name: 'SetDay',                   description: 'Ustawienie daty i czasu — dzień.',                                     description_en: 'Date and time setting — day.' },
{ addr: 7,  name: 'SetHours',                 description: 'Ustawienie daty i czasu — godzina.',                                   description_en: 'Date and time setting — hour.' },
{ addr: 8,  name: 'SetMinutes',               description: 'Ustawienie daty i czasu — minuty.',                                    description_en: 'Date and time setting — minutes.' },
{ addr: 9,  name: 'SetSeconds',               description: 'Ustawienie daty i czasu — sekundy.',                                   description_en: 'Date and time setting — seconds.' },
{ addr: 10, name: 'SetExternalSignalEnable',  description: 'Obsługa sygnału zewnętrznego — włącz/wyłącz.',                        description_en: 'External signal handling — enable/disable.' },
{ addr: 11, name: 'SetExternalSignalMode',    description: 'Tryb i funkcjonalność sygnału zewnętrznego.',                         description_en: 'External signal mode and functionality.' },
{ addr: 12, name: 'SetExternalSignalContact', description: 'Konfiguracja polaryzacji styku sygnału zewnętrznego.',                description_en: 'External signal contact polarity configuration.' },
{ addr: 13, name: 'SetExternalSignalLevel',   description: 'Poziom sygnału zewnętrznego.',                                        description_en: 'External signal level.' },
```

---

## Zmiana 2 — `devices/*.json` — wszystkie 14 plików

Dla każdego rejestru z polem `description` dodaj pole `description_en` z angielskim tłumaczeniem.
Poniżej lista wszystkich tłumaczeń pogrupowana per plik.

### Uwagi ogólne do tłumaczeń

- Jednostki (°C, RPM, %, s, min) zostawiaj bez zmian
- Wzorce "Domyślnie X" → "Default: X"
- Wzorce "Wartość = 5 × wartość [min]" → "Actual value = 5 × register value [min]"
- Wzorce "Warunek: A < B" → "Constraint: A < B"
- Nazwy trybów (MANUAL, AUTO, HEAT, VENT, STANDBY, SMART) zostawiaj bez zmian
- Nazwy czujników (T1, T3, T4, T5) zostawiaj bez zmian

### drv_ax.json

Opis urządzenia: `"Kurtyna powietrzna ELIS AX (wielobiegowe wentylatory EC)"` →
`"description_en": "ELIS AX air curtain (multi-speed EC fans)"`

IR:
```
T1              → "Outdoor air temperature (T1 sensor)."
T3              → "Supply air temperature after water heat exchanger (T3 sensor)."
T4              → "Room temperature (T4 sensor)."
T5              → "Water heat exchanger return pipe temperature (T5 sensor)."
CurtainState1   → "Controller status register — bits represent active functions and operating modes."
CurtainState2   → "Controller status register extension."
CurtainState3   → "Controller status register extension."
Fan1Speed       → "Actual supply fan 1 speed [RPM]."
Fan2Speed       → "Actual supply fan 2 speed [RPM]."
Fan3Speed       → "Actual supply fan 3 speed [RPM]."
Fan4Speed       → "Actual supply fan 4 speed [RPM]."
Fan5Speed       → "Actual supply fan 5 speed [RPM]."
Fan6Speed       → "Actual supply fan 6 speed [RPM]."
Fan7Speed       → "Actual supply fan 7 speed [RPM]."
FilterWorkTime  → "Filter operating time. Actual value = 5 × register value [min]."
ValveRelaysState → "Current valve status on VALVE_RELAYS contacts (L1, L2). 0=open, 1=closed."
Valve0-10State  → "Current 0–10V valve status."
```

HR:
```
FanWorkMode               → "Fan operating mode. Default: MANUAL."
Program                   → "Curtain operating program (K1, K2...). Default: K1."
FWM_ManualHeatVentRef     → "Fan capacity in MANUAL mode (HEAT or VENT). Default: 50%."
FWM_StandbyRef            → "Fan capacity in STANDBY mode. Default: 20%."
FWM_AutoHeatVentMin       → "Minimum fan capacity in AUTO mode (HEAT/VENT). Constraint: Min < Max. Default: 0%."
FWM_AutoHeatVentMax       → "Maximum fan capacity in AUTO mode (HEAT/VENT). Constraint: Max > Min. Default: 100%."
EWM_HeatT3Ref             → "Supply air setpoint temperature for HEAT mode. Default: 320 = 32.0°C."
EWM_HeatT5Max             → "Return water temperature limit for HEAT mode. Default: 320 = 32.0°C."
EWM_HeatT5LimitMode       → "Enable/disable return water temperature limit. Default: OFF."
PreheatT5Ref              → "Return water temperature (T5) threshold to start fan (PREHEAT). Default: 300 = 30.0°C."
StandbyFanIdleDelay       → "Fan idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≥ StandbyValveIdleDelay."
StandbyValveIdleDelay     → "Valve idle delay in STANDBY mode [s]. Default: 300s. Constraint: ≤ StandbyFanIdleDelay."
AntifreezeWareHouseOn     → "Warehouse antifreeze protection. Default: OFF."
AntifreezeWareTempOn      → "Warehouse antifreeze activation temperature threshold. Default: 70 = 7.0°C."
AntifreezeWaterExchangeOn → "Water heat exchanger antifreeze protection. Default: ON."
AntifreezeWaterExchangeT3 → "Supply air temperature (T3) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C."
AntifreezeWaterExchangeT5 → "Water temperature (T5) threshold for exchanger antifreeze activation. Default: 70 = 7.0°C."
PreheatOnOff              → "Enable/disable preheat function (PREHEAT). Default: OFF."
FilterMaxWorkTime         → "Reset filter operating time counter. Default: OFF."
DoorOpenFreqAlphaThreshold → "Door opening frequency detection threshold in SMART mode. Default: 60."
DoorOpenFreqTimePeriod    → "Door opening frequency detection time period in SMART mode. Default: 300s."
FWMAutoAddHeatMin         → "Minimum fan capacity in ADD HEAT mode, Auto. Default: 5%. Constraint: Min < Max."
```

### drv_cool.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
Rejestr DRV-COOL to nagrzewnica/chłodnica elektryczna lub wodna z EC wentylatorami.
Tłumacz w kontekście termicznej regulacji HVAC.

### drv_cube.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-CUBE to jednostka dachowa (rooftop) z EC wentylatorami.

### drv_d.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-D to nagrzewnica wodna.

### drv_el.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-EL to nagrzewnica elektryczna.

### drv_elis.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-ELIS to kurtyna powietrzna ELIS z EC wentylatorami.

### drv_km.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-KM to komora mieszania (mixing chamber).

### drv_luna.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-LUNA to klimakonwektor (fan coil unit).

### drv_m.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-M to nagrzewnica wodna serii M.

### drv_oxen.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-OXEN to rekuperator (heat recovery unit).

### drv_robur_next.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-ROBUR NEXT to nagrzewnica wodna z EC wentylatorami.

### drv_robur_next_km.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
Wariant z komorą mieszania.

### drv_slim.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-SLIM to nagrzewnica slim (kompaktowa).

### drv_v.json

Przeczytaj plik i przetłumacz wszystkie pola `description` analogicznie.
DRV-V to nagrzewnica wodna serii V.

---

## Format dodawania description_en do JSON

Dodaj pole `description_en` **bezpośrednio za** `description` w tym samym obiekcie rejestru:

```json
{
  "offset": 4,
  "name": "T1",
  "description": "Temperatura powietrza zewnętrznego (czujnik T1).",
  "description_en": "Outdoor air temperature (T1 sensor)."
}
```

Nie zmieniaj żadnych innych pól (offset, name, min, max, unit, values).

---

## Weryfikacja

1. Po wszystkich zmianach: JSON OK (python3 walidacja)
2. Przebuduj devices-data.js
3. Otwórz `frontend/index.html` po angielsku (EN)
4. Oblicz dla dowolnego urządzenia T-box Zone lub M-box
5. Kliknij dowolny rejestr w wynikach — opis powinien być po angielsku ✓
6. Wróć do PL — opis po polsku ✓

---

## Commit

```
feat(i18n): add description_en to all device registers and T-box controller registers
```
