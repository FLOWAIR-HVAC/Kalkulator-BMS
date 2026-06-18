# TASK_013 — Uzupełnienie holding_registers_group dla DRV-CUBE

## Źródło danych

Dokumentacja: *BMS T-box DRV V1.1*, rozdział 1.3.13 Group DRV-CUBE, strony 126–128.
Rejestry zweryfikowane na podstawie oficjalnego PDF Flowair.

## Zakres

Uzupełnić pole `holding_registers_group` w `devices/drv_cube.json`.
Aktualnie: `"holding_registers_group": []` (puste).

Zgodnie z dokumentacją tryb grupowy CUBE obsługuje 12 rejestrów (offsety 0x04–0x0F),
co odpowiada podziorowi `holding_registers_single` (bez ostatnich 5 rejestrów
temperaturowych/CO2, które działają tylko w trybie Single).

---

## Zmiana w `devices/drv_cube.json`

Użyj narzędzia **Edit** z minimalnym diff-em. Zastąp tylko linię:

```json
"holding_registers_group": [],
```

Nową wartością:

```json
"holding_registers_group": [
    {
      "offset": 4,
      "name": "WorkMode",
      "values": {
        "1": "WM_OFF — urządzenie wyłączone",
        "2": "WM_ON — urządzenie włączone",
        "3": "WM_THERM — tryb termostatyczny"
      },
      "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb pracy"
    },
    {
      "offset": 5,
      "name": "fan_eff",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Nastawa wydajności wentylatora EC, płynna regulacja 0–100%"
    },
    {
      "offset": 6,
      "name": "fan_eff_CO2_I",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Nastawa wydajności wentylatora EC dla 1. progu czujnika CO2"
    },
    {
      "offset": 7,
      "name": "fan_eff_CO2_II",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Nastawa wydajności wentylatora EC dla 2. progu czujnika CO2"
    },
    {
      "offset": 8,
      "name": "recirculation_mode",
      "values": {
        "0": "RM_AUTO — tryb automatyczny",
        "1": "RM_MANUAL — tryb ręczny"
      },
      "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb recyrkulacji"
    },
    {
      "offset": 9,
      "name": "recirculation_value",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Wartość recyrkulacji, płynna regulacja 0–100%"
    },
    {
      "offset": 10,
      "name": "recirculation_value_CO2_I",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Wartość recyrkulacji dla 1. progu czujnika CO2"
    },
    {
      "offset": 11,
      "name": "recirculation_value_CO2_II",
      "min": 0,
      "max": 100,
      "unit": "%",
      "description": "Wartość recyrkulacji dla 2. progu czujnika CO2"
    },
    {
      "offset": 12,
      "name": "work_mode_NW",
      "values": {
        "0": "WM_NW_AUTO — tryb automatyczny dyfuzora",
        "1": "WM_NW_MANUAL — tryb ręczny dyfuzora"
      },
      "description": "Tryb pracy dyfuzora wirowego (NW). Rejestr 16-bit: MSB ignorowany, LSB = tryb"
    },
    {
      "offset": 13,
      "name": "swirl_diffuser_level",
      "min": 30,
      "max": 100,
      "unit": "%",
      "description": "Poziom otwarcia dyfuzora wirowego"
    },
    {
      "offset": 14,
      "name": "Htg_swirl_diffuser_level",
      "min": 30,
      "max": 100,
      "unit": "%",
      "description": "Poziom otwarcia dyfuzora wirowego w trybie grzania"
    },
    {
      "offset": 15,
      "name": "Clg_swirl_diffuser_level",
      "min": 30,
      "max": 100,
      "unit": "%",
      "description": "Poziom otwarcia dyfuzora wirowego w trybie chłodzenia"
    }
  ],
```

---

## Walidacja JSON

Po wprowadzeniu zmiany uruchom:

```bash
python3 -c "import json,os; [json.load(open(f'devices/{f}')) for f in os.listdir('devices') if f.endswith('.json') and f != '_schema.json']; print('JSON OK')"
```

Jeśli błąd — nie rób commita, popraw plik.

---

## Przebudowa devices-data.js

Po pomyślnej walidacji uruchom skrypt z CLAUDE.md:

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

## Weryfikacja

Otwórz `frontend/index.html` w przeglądarce:
1. Wybierz sterownik **T-box**, tryb **Group**
2. Dodaj urządzenie **DRV CUBE** (lub jak się nazywa w kalkulatorze)
3. Kliknij **Oblicz**
4. Sprawdź, że pojawia się sekcja "Holding Registers (HR) — Nastawy" z 12 rejestrami
   dla grupy CUBE

---

## Commit

```
feat(devices): add holding_registers_group for DRV-CUBE (12 registers, source: BMS T-box DRV V1.1 p.126-128)
```
