# TASK_016 — Naprawa stylowania wiersza M-box

## Problem

Wiersz urządzenia M-box ma klasę `mbox-device-row`, podczas gdy T-box Zone używa
`device-row`. CSS w `style.css` definiuje flex, gap, wyrównanie i rozmiary
wyłącznie dla `.device-row`. Brak tej klasy powoduje:
- brak `display:flex` → elementy nie są w jednej linii
- brak `gap:10px; align-items:center` → inne odstępy i wyrównanie
- brak `.device-row label { font-size:12px; color:#667 }` → inna czcionka etykiet
- brak `.device-row input[type="number"] { width:80px }` → inne rozmiary pól

## Zmiana — `frontend/js/app.js`

W funkcji `addMboxDeviceRow()` zmień jedną linię:

```js
// PRZED:
  row.className = 'mbox-device-row';

// PO:
  row.className = 'device-row mbox-device-row';
```

Klasa `mbox-device-row` pozostaje — służy do selektowania wierszy M-box w JS
(`querySelectorAll('.mbox-device-row')`). Klasa `device-row` dodaje brakujące style.

## Weryfikacja

Otwórz `frontend/index.html`, wybierz M-box — wiersz urządzenia wygląda identycznie
jak wiersz w T-box Zone: etykiety "Adres:" i "Strefa:" mają szarą małą czcionkę,
wszystkie elementy są w jednym poziomym wierszu, odstępy identyczne.

## Commit

```
fix(app): add device-row class to mbox rows for correct CSS styling
```
