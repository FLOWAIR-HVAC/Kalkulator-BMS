# Kalkulator BMS v.2 — Wzory obliczania adresów Modbus

Dokument opisuje wzory stosowane w `calculator.js` do przeliczania offsetów rejestrów
urządzeń na fizyczne adresy Modbus RTU. Plik przeznaczony dla deweloperów i serwisantów.

---

## Tryb T-box (klasyczny)

Sterownik T-box zarządza urządzeniami przez adresy dipswitch (1–32).

### Input Register (IR) — odczyt statusu urządzenia
adres = offset + 256 + (adres_urządzenia - 1) × 64
Przykład: urządzenie pod adresem 3, rejestr o offsecie 4:
  adres = 4 + 256 + (3-1) × 64 = 388 = 0x0184

### Holding Register Single (HR Single) — sterowanie pojedynczym urządzeniem
adres = offset + 256 + (adres_urządzenia - 1) × 64
Wzór identyczny jak IR. Różnica: FC03 (odczyt HR) zamiast FC04 (odczyt IR).

### Holding Register Group (HR Group) — sterowanie grupą urządzeń tego samego typu
adres = offset + 4096 + (numer_grupy - 1) × 256
Numer grupy wynika z kolejności wykrycia typu urządzenia przez T-box (nie z adresu dipswitch).
Przykład: drugi wykryty typ urządzeń (grupa 2), rejestr o offsecie 0:
  adres = 0 + 4096 + (2-1) × 256 = 4352 = 0x1100

---

## Tryb T-box Zone

Sterownik T-box Zone organizuje urządzenia w strefy (1–31). Adresy Modbus zależą
od kolejności urządzeń posortowanej po adresie dipswitch, nie od samego adresu.

### Input Register (IR) — odczyt statusu urządzenia
adres = offset + 320 + (indeks_posortowany × 32)
Baza: 0x0140 = 320
Indeks posortowany: pozycja 0-based urządzenia w liście wszystkich urządzeń
posortowanej rosnąco po adresie dipswitch.

Przykład: urządzenie z adresem dipswitch 5, trzecie w kolejności (indeks 2), rejestr offset 4:
  adres = 4 + 320 + 2 × 32 = 388 = 0x0184

### Holding Register (HR) — sterowanie urządzeniem (statyczna przestrzeń)
adres = offset + 8994 + (indeks_posortowany × 32)
Baza: 0x2322 = 8994
Indeks posortowany: ta sama logika co dla IR.

Przestrzeń statyczna HR dla każdego urządzenia zaczyna się od 0x2322 (pierwsze urządzenie),
0x2342 (drugie), itd. Dwa pierwsze rejestry każdego bloku (0x2320, 0x2321) to metadane
(Zone ID i Device ID) — stąd offset urządzeń zaczyna się od 0x2322.

Przykład: to samo urządzenie, rejestr offset 0 (WorkMode):
  adres = 0 + 8994 + 2 × 32 = 9058 = 0x2362

### Rejestry strefy IR — odczyt statusu strefy
adres = 0x0900 + (indeks_strefy × 16) + offset_rejestru
Indeks strefy: pozycja 0-based strefy w posortowanej liście unikalnych wybranych stref.
Rejestry strefy (offset 0–2): ZoneID, AverageZoneTemp, ZoneDeviceCount.

Przykład: strefa 5, druga w liście [3, 5] (indeks 1), AverageZoneTemp (offset 1):
  adres = 0x0900 + 1 × 16 + 1 = 2305 + 16 = 2321 = 0x0911  // TODO: verify offset direction

### Rejestry strefy HR — sterowanie strefą (statyczna przestrzeń)
adres = 0x0910 + (indeks_strefy × 16) + offset_rejestru
Rejestry strefy (offset 0–10): SetZoneID, EnableDisableZone, ZoneTRef, ZoneAntifreeze,
ZoneTAntifreeze, ZoneTLeadSensorSelect, ZoneSensorOffset, T4SensorOffset,
ZoneExternalSignalEnable, ZoneExternalSignalDrvUid, TLeadVal.

Przykład: strefa 3, pierwsza w liście [3, 7] (indeks 0), ZoneTRef (offset 2):
  adres = 0x0910 + 0 × 16 + 2 = 2322 = 0x0912

---

## Rejestry sterownika (stałe adresy)

Rejestry sterownika T-box Zone mają stałe adresy niezależne od urządzeń.
Pełna lista w `calculator.js` w sekcji `CONTROLLER.tbox_zone`.

---

## Źródło

Dokumentacja: T-BOX Zone Modbus RTU V4.8 (Flowair, wewnętrzna)
Implementacja: `frontend/js/calculator.js`
