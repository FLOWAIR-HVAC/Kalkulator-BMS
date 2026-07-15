# Kalkulator BMS v.2

**Modbus RTU/TCP and BACnet IP register address calculator for Flowair HVAC devices.**

Built for BMS integrators configuring SCADA software, Modbus masters, and BACnet gateways with Flowair heating and ventilation equipment. Instead of manually computing addresses from formulas scattered across device documentation, an integrator selects a controller type and device, and gets a ready-to-use register map.

🔗 **[Live demo → flowair-hvac.github.io/Kalkulator-BMS](https://flowair-hvac.github.io/Kalkulator-BMS)**

---

## What it solves

Flowair controllers (T-box, M-box, etc.) use different Modbus address calculation formulas depending on the controller type, operating mode (Single / Group / Zone), and device position on the bus. For a project with 20 devices across two controller types, working this out manually from the documentation takes hours and is error-prone.

This tool encodes all formulas and device register maps, produces the full address table instantly, and lets you export it to `.xlsx` for inclusion in commissioning documentation.

---

## Supported controllers

| Controller | Modes | Protocol |
|---|---|---|
| **T-box** | Single, Group | Modbus RTU |
| **T-box Zone** | Zone (+ zone registers) | Modbus RTU |
| **M-box** | Single, Group | Modbus TCP |
| **HMI Wi-Fi AC** | Single | Modbus TCP |
| **HMI Wi-Fi EC** | Single | Modbus TCP |
| **DRV (direct)** | — | Modbus RTU |
| **Cube (direct)** | — | Modbus RTU / Modbus TCP / BACnet IP |

## Supported devices

| Device | Type |
|---|---|
| OXEN | Ventilation unit with recuperation |
| ELIS | Air curtain |
| ELIS AX | Air curtain (AX series) |
| LEO EC | Unit heater (EC fan) |
| LEO AC | Unit heater (AC fan) |
| LEO D | Unit heater (D series) |
| LEO EL | Electric unit heater |
| LEO KM | Unit heater with heat meter |
| LEO COOL | Cooling unit |
| ROBUR R NEXT | Radiant heater |
| ROBUR R KM NEXT | Radiant heater with heat meter |
| SLIM | Slim unit heater |
| LUNA | Ceiling cassette |
| CUBE | Air handling unit |

---

## Features

- **Full register map** — Input Registers (status) and Holding Registers (control) for every device × controller combination
- **All addressing modes** — Single (per-device), Group (broadcast by device type), Zone (T-box Zone spatial grouping)
- **BACnet IP support** — Object ID addresses for Cube direct controller
- **Connection diagrams** — SVG block diagrams generated per controller type showing physical wiring
- **XLSX export** — ready for commissioning documentation
- **Print view** — formatted for A4
- **PL / EN interface** — language toggle

---

## Address calculation

The tool implements the formulas from [`MODBUS_ADDRESS_CALC.md`](MODBUS_ADDRESS_CALC.md). Key formulas:

```
T-box Single / Group:
  IR address = offset + 256 + (device_address − 1) × 64
  HR Single  = offset + 256 + (device_address − 1) × 64
  HR Group   = offset + 4096 + (group_index − 1) × 256

T-box Zone:
  IR address = offset + 320 + sorted_index × 32
  HR address = offset + 8994 + sorted_index × 32
  (sorted_index = 0-based position in dipswitch-sorted device list)
```

---

## Project structure

```
├── index.html                  # Root entry point (synced from frontend/)
├── frontend/
│   ├── index.html              # Main HTML
│   ├── css/style.css           # All styles
│   └── js/
│       ├── app.js              # UI logic, form handling, results rendering
│       ├── calculator.js       # Address calculation formulas
│       ├── devices-data.js     # Compiled device register data (generated)
│       └── translations.js     # PL/EN string table
├── devices/
│   ├── _schema.json            # Device JSON schema reference
│   └── drv_*.json              # One file per device type
├── MODBUS_ADDRESS_CALC.md      # Formula documentation
└── tasks/                      # Implementation task files (dev history)
```

> **Two `index.html` files:** `frontend/index.html` uses relative paths; the root `index.html` is a copy with `frontend/` prefixed paths for GitHub Pages hosting. Always edit `frontend/index.html` and sync using the script in [`CLAUDE.md`](CLAUDE.md).

---

## Running locally

No build step, no dependencies.

```bash
git clone https://github.com/orfiel004/kalkulator-bms.git
cd kalkulator-bms
# Open in browser:
open frontend/index.html        # macOS
start frontend/index.html       # Windows
xdg-open frontend/index.html    # Linux
```

Or serve with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/frontend/
```

---

## Adding a new device

1. Create `devices/drv_<name>.json` following the schema in `devices/_schema.json`.  
   Set `group_priority` to control the dropdown order.

2. Validate all JSON files:
   ```bash
   python3 -c "
   import json, os
   [json.load(open(f'devices/{f}')) for f in os.listdir('devices')
    if f.endswith('.json') and f != '_schema.json']
   print('JSON OK')
   "
   ```

3. Rebuild `frontend/js/devices-data.js`:
   ```bash
   python3 -c "
   import json, os
   devices = {}
   for fname in sorted(os.listdir('devices')):
       if not fname.endswith('.json') or fname == '_schema.json': continue
       with open(f'devices/{fname}', encoding='utf-8') as f:
           d = json.load(f)
       devices[d['name']] = d
   devices_sorted = dict(sorted(devices.items(), key=lambda x: x[1].get('group_priority', 99)))
   output = 'const DEVICES_DATA = ' + json.dumps(devices_sorted, ensure_ascii=False, indent=2) + ';\n'
   open('frontend/js/devices-data.js', 'w', encoding='utf-8').write(output)
   print('devices-data.js rebuilt OK')
   "
   ```

4. Sync the root `index.html` (see [`CLAUDE.md`](CLAUDE.md) for the one-liner).

---

## Tech stack

| | |
|---|---|
| Language | HTML + CSS + Vanilla JS (no frameworks) |
| Data | JSON files per device, compiled to a single JS constant |
| Export | [SheetJS](https://sheetjs.com/) (XLSX) |
| Hosting | GitHub Pages |
| Protocols | Modbus RTU, Modbus TCP, BACnet IP |

---

## Authors

Dawid Krużycki — Control Systems Engineer, Flowair  
[dawid.kruzycki@flowair.pl](mailto:dawid.kruzycki@flowair.pl)

Paweł Ślęczek — Control Systems Programmer, Flowair  
[pawel.sleczek@flowair.pl](mailto:pawel.sleczek@flowair.pl)
