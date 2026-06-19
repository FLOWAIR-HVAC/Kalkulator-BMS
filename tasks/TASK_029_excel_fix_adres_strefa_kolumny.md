# TASK_029 — Excel: naprawa kolumn Adres i Strefa/Grupa

## Problem

Kolumny Adres i Strefa są puste, bo regex nie pasuje do żadnego formatu badge'a.

Rzeczywiste formaty badge'y (z translations.js):

| Tryb            | PL badge                         | EN badge                          |
|-----------------|----------------------------------|-----------------------------------|
| T-box Single    | `Adres Modbus: 3`                | `Modbus address: 3`               |
| T-box Group     | `Adres Modbus: 3 \| Grupa: 2`   | `Modbus address: 3 \| Group: 2`   |
| T-box Zone dev  | `Adres: 3 \| Strefa: 2`          | `Address: 3 \| Zone: 2`           |
| M-box device    | `Adres: 3 \| Strefa: 2`          | `Address: 3 \| Zone: 2`           |
| M-box device    | `Adres: 3`                       | `Address: 3`                      |
| M-box sys/zone  | `M-box` / `Rejestry strefy`      | `M-box` / `Zone registers`        |
| T-box Group HR  | `Holding Registers — Grupa 2`    | `Holding Registers — Group 2`     |

## Rozwiązanie

Najprościej i najpewniej: wyciągnij **pierwszą** i **drugą** liczbę z badge'a.
- Pierwsza liczba → Adres
- Druga liczba → Strefa / Grupa (te przypadki są rozłączne)

Kolumna 3 nazwana `Strefa / Grupa` (PL) / `Zone / Group` (EN).

---

## Zmiany — `frontend/js/app.js`, funkcja `exportToExcel()`

### 1. Zaktualizuj nagłówki kolumn

Znajdź:
```js
  const HDR = currentLang === 'en'
    ? ['Section', 'Address', 'Zone', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
    : ['Sekcja',  'Adres',   'Strefa', 'Typ', 'Adres HEX',  'Adres DEC',   'Nazwa rejestru', 'Opis'];
```

Zamień na:
```js
  const HDR = currentLang === 'en'
    ? ['Section', 'Address', 'Zone / Group', 'Type', 'Address HEX', 'Address DEC', 'Register name', 'Description']
    : ['Sekcja',  'Adres',   'Strefa / Grupa', 'Typ', 'Adres HEX', 'Adres DEC',   'Nazwa rejestru', 'Opis'];
```

### 2. Zamień parser badge'a

Znajdź:
```js
    // Adres i strefa z badge'a (np. "Adres: 3, Strefa: 2" lub "addr=3")
    const badge = block.querySelector('.result-block-header .badge');
    const badgeText = badge ? badge.textContent.trim() : '';
    const addrMatch  = badgeText.match(/(?:Adres|addr)[=:\s]+(\d+)/i);
    const zoneMatch  = badgeText.match(/(?:Strefa|zone)[=:\s]+(\d+)/i);
    const deviceAddr = addrMatch ? addrMatch[1] : '';
    const deviceZone = zoneMatch ? zoneMatch[1] : '';
```

Zamień na:
```js
    // Adres i strefa/grupa z badge'a — wyciągamy kolejne liczby z tekstu.
    // Pierwsza liczba = adres Modbus urządzenia.
    // Druga liczba = strefa (M-box/T-box Zone) lub numer grupy (T-box Group).
    const badge = block.querySelector('.result-block-header .badge');
    const badgeText = badge ? badge.textContent.trim() : '';
    const badgeNumbers = badgeText.match(/\d+/g) || [];
    const deviceAddr = badgeNumbers[0] || '';
    const deviceZone = badgeNumbers[1] || '';
```

---

## Weryfikacja

Dla każdego trybu wygeneruj Excel i sprawdź kolumny B i C:

| Tryb               | Kol. B (Adres) | Kol. C (Strefa/Grupa) |
|--------------------|----------------|-----------------------|
| T-box Single       | `1`            | _(puste)_             |
| T-box Group        | `1`            | `2`                   |
| T-box Zone         | `1`            | `1`                   |
| M-box (z adresem i strefą) | `3`  | `2`                   |
| M-box (tylko adres) | `3`           | _(puste)_             |
| M-box sys/strefa   | _(puste)_      | _(puste)_             |

---

## Commit

```
fix(export): fix Address and Zone/Group columns in Excel export
```
