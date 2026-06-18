# TASK_011 — Implementacja kalkulatora M-box

## Cel

Dodanie w pełni działającego kalkulatora rejestrów Modbus dla sterownika M-box.
T-box i T-box Zone pozostają bez zmian.

Źródło danych: `M-box mapping v3 Ofi.docx` (przekazany przez Dawida)

---

## Kontekst techniczny

M-box używa **Modbus TCP** (nie RTU). Przestrzeń adresowa jest **statyczna i deterministyczna** — adresy nie zależą od liczby podłączonych urządzeń.

### Formuły adresowe (adresy logiczne 1-based):

```
Rejestr systemowy N:          adres = N                           (HR: N=1..3 | IR: N=1..2)
Rejestr strefowy N, strefa Z: adres = 50 + (Z-1)*30 + N          (Z=1..6, blok 30 rejestrów)
Rejestr urządzenia N, DID D:  adres = 270 + (DID-1)*40 + N       (DID=1..32, blok 40 rejestrów)
```

Offset Modbus w zapytaniu = adres logiczny − 1.

HR i IR mają **oddzielne, niezależne przestrzenie adresowe** (te same numery adresów = różne dane).

---

## Zakres zmian

### 1. `frontend/js/calculator.js` — dodanie stałej MBOX

Na końcu obiektu `Calculator`, przed ostatnim `}` (przed zamknięciem), dodaj:

```js
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
```

---

### 2. `frontend/index.html` i `index.html` (root) — formularz M-box

W obu plikach zastąp:
```html
<div id="mbox-placeholder" style="display:none">
  <p class="mbox-info">Kalkulator dla sterownika M-box jest w przygotowaniu.</p>
</div>
```

następującą sekcją (jeśli `mbox-placeholder` nie istnieje jeszcze, dodaj nową sekcję w tym samym miejscu — za `<div id="devices-container">`, przed `<div class="form-actions">`):

```html
<div id="mbox-form" style="display:none">
  <div class="form-row mbox-row">
    <div class="field-group">
      <label>Typ urządzenia</label>
      <select id="mbox-device-type">
        <option value="">— wybierz —</option>
        <option value="LEO D (AC/EC)">LEO D (AC/EC)</option>
        <option value="ELIS (AC) — kurtyna powietrzna">ELIS (AC) — kurtyna</option>
        <option value="SLIM (AC) — kurtyna powietrzna">SLIM (AC) — kurtyna</option>
        <option value="KM — Komora Mieszania">KM — Komora Mieszania</option>
        <option value="LEO M (EC)">LEO M (EC)</option>
        <option value="ROOFTOP">ROOFTOP</option>
        <option value="LEO V (AC)">LEO V (AC)</option>
        <option value="LEO EL (AC)">LEO EL (AC)</option>
        <option value="LEO COOL (AC)">LEO COOL (AC)</option>
        <option value="ROBUR R KM NEXT">ROBUR R KM NEXT</option>
        <option value="ROBUR R NEXT">ROBUR R NEXT</option>
        <option value="LUNA">LUNA</option>
        <option value="OXEN">OXEN</option>
      </select>
    </div>
    <div class="field-group">
      <label>DeviceID <span class="field-hint">(1–32)</span></label>
      <input type="number" id="mbox-device-id" min="1" max="32" value="1">
    </div>
    <div class="field-group">
      <label>Numer strefy <span class="field-hint">(1–6, opcja)</span></label>
      <input type="number" id="mbox-zone-num" min="1" max="6" placeholder="—">
    </div>
  </div>
</div>
```

Również w obu plikach, sekcję `<div class="form-actions">` otocz warunkiem widoczności — musi być schowana gdy M-box jest wybrany. Ponieważ obsługuje to już `updateFormForControllerType()`, wystarczy że przycisk Oblicz pozostaje w `.form-actions` — logika w JS zrobi resztę.

---

### 3. `frontend/js/app.js` — obsługa M-box

#### a) Zaktualizuj `updateFormForControllerType()`

Zastąp całą tę funkcję:

```js
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

  // Sekcja urządzeń T-box
  document.getElementById('devices-container').style.display = isMbox ? 'none' : '';

  // Formularz M-box
  const mboxForm = document.getElementById('mbox-form');
  if (mboxForm) mboxForm.style.display = isMbox ? 'block' : 'none';

  // Przyciski formularza
  document.querySelector('.form-actions').style.display = isMbox ? 'none' : '';

  // Przycisk Oblicz M-box (dodajemy go poniżej)
  const mboxCalcBtn = document.getElementById('btn-mbox-calculate');
  if (mboxCalcBtn) mboxCalcBtn.style.display = isMbox ? 'block' : 'none';

  // Przebuduj opcje w selektach urządzeń T-box (tylko gdy nie M-box)
  if (!isMbox) {
    const names = Object.keys(devices)
      .filter(name => isTboxZone || !devices[name].tbox_zone_only)
      .sort();

    document.querySelectorAll('.device-row select[id^="device-"]').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = names.map(n =>
        `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`
      ).join('');
      if (!names.includes(current) && names.length > 0) sel.value = names[0];
    });
  }
}
```

#### b) Dodaj przycisk "Oblicz" dla M-box w HTML

W obu plikach HTML, zaraz po `<div id="mbox-form">...</div>` dodaj:

```html
<div class="form-actions" id="mbox-actions" style="display:none">
  <button id="btn-mbox-calculate" type="button" class="btn-primary">Oblicz</button>
</div>
```

I zaktualizuj warunek w `updateFormForControllerType()`: zamiast ukrywać `mbox-actions`, pokaż go gdy `isMbox`:
```js
const mboxActions = document.getElementById('mbox-actions');
if (mboxActions) mboxActions.style.display = isMbox ? 'flex' : 'none';
```

#### c) Dodaj funkcję `calculateMbox()`

Dodaj przed linią `document.getElementById('controllerType').addEventListener(...)`:

```js
// ============================================================
// Render: M-box (Modbus TCP)
// ============================================================
function calculateMbox() {
  const deviceType = document.getElementById('mbox-device-type').value;
  const deviceId   = parseInt(document.getElementById('mbox-device-id').value, 10);
  const zoneNumRaw = document.getElementById('mbox-zone-num').value;
  const zoneNum    = zoneNumRaw ? parseInt(zoneNumRaw, 10) : null;

  // Walidacja
  if (!deviceType) {
    showError('Wybierz typ urządzenia.');
    return;
  }
  if (!deviceId || deviceId < 1 || deviceId > 32) {
    showError('DeviceID musi być liczbą od 1 do 32.');
    return;
  }
  if (zoneNum !== null && (zoneNum < 1 || zoneNum > 6)) {
    showError('Numer strefy musi być od 1 do 6.');
    return;
  }
  clearError();

  const mbox   = Calculator.MBOX;
  const devDef = mbox.devices[deviceType];
  if (!devDef) {
    showError('Nieznany typ urządzenia.');
    return;
  }

  const resultsEl = document.getElementById('results-content');
  resultsEl.innerHTML = '';

  // ---- Sekcja: Rejestry systemowe ----
  const sysWrapper = document.createElement('div');
  sysWrapper.className = 'result-block';
  sysWrapper.innerHTML = `
    <div class="result-block-header">
      <h3>Rejestry systemowe</h3>
      <span class="badge">M-box System</span>
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
  sysWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', sysHrRows));
  sysWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', sysIrRows));
  resultsEl.appendChild(sysWrapper);

  // ---- Sekcja: Rejestry urządzenia ----
  const devWrapper = document.createElement('div');
  devWrapper.className = 'result-block';
  devWrapper.innerHTML = `
    <div class="result-block-header">
      <h3>${deviceType}</h3>
      <span class="badge">DeviceID&nbsp;${deviceId}</span>
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
  devWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', devHrRows));
  devWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', devIrRows));
  resultsEl.appendChild(devWrapper);

  // ---- Sekcja: Rejestry strefowe (opcjonalnie) ----
  if (zoneNum !== null) {
    const zoneWrapper = document.createElement('div');
    zoneWrapper.className = 'result-block';
    zoneWrapper.innerHTML = `
      <div class="result-block-header">
        <h3>Rejestry strefowe</h3>
        <span class="badge">Strefa&nbsp;${zoneNum}</span>
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
    zoneWrapper.appendChild(buildRegSection('Holding Registers (HR) — odczyt/zapis', zoneHrRows));
    zoneWrapper.appendChild(buildRegSection('Input Registers (IR) — tylko odczyt', zoneIrRows));
    resultsEl.appendChild(zoneWrapper);
  }

  // Pokaż wyniki
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
```

#### d) Zaktualizuj sekcję zdarzeń

W sekcji zdarzeń (na końcu app.js), dodaj:
```js
document.getElementById('btn-mbox-calculate').addEventListener('click', calculateMbox);
```

#### e) Upewnij się, że `resetForm()` obsługuje M-box

W funkcji `resetForm()` dodaj reset pól M-box:
```js
// Reset pól M-box
const mboxDevType = document.getElementById('mbox-device-type');
const mboxDevId   = document.getElementById('mbox-device-id');
const mboxZoneNum = document.getElementById('mbox-zone-num');
if (mboxDevType) mboxDevType.value = '';
if (mboxDevId)   mboxDevId.value = '1';
if (mboxZoneNum) mboxZoneNum.value = '';
```

---

## Weryfikacja

Po implementacji sprawdź w przeglądarce (`frontend/index.html`):

1. Dropdown sterownika ma trzy opcje: T-box, T-box Zone, M-box
2. Po wybraniu M-box wyświetla się formularz z polami: Typ urządzenia, DeviceID, Numer strefy
3. Przycisk "Oblicz" jest właściwy dla M-box
4. Po wybraniu urządzenia np. **LEO D (AC/EC)** i DeviceID=1:
   - HR DeviceID=1: adresy 271–277 (N=1..7, wzór: 270+(1-1)*40+N)
   - IR DeviceID=1: adresy 271–279 (N=1..9)
5. Po wybraniu DeviceID=2:
   - HR: adresy 311–317 (270+40+N)
6. Po wpisaniu strefy 1:
   - HR Zone: adresy 51–58 (50+(1-1)*30+N, N=1..8)
   - IR Zone: adresy 51–57 (N=1..7)
7. Po wybraniu M-box i kliknięciu "Nowe obliczenie" — formularz wraca do stanu wyjściowego
8. T-box i T-box Zone działają identycznie jak przed zmianami

---

## Commit

```
feat(app,calc,html): implement M-box Modbus TCP register calculator
```
