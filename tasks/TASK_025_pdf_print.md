# TASK_025 — Druk wyników do PDF (CSS @media print)

## Cel

Dodać przycisk „Drukuj" w sekcji wyników. Po kliknięciu otwiera się
systemowy dialog drukowania przeglądarki — użytkownik wybiera „Zapisz jako PDF"
lub drukuje fizycznie. Ukryć zbędne elementy UI, sformatować tabele pod druk.

---

## Zmiana 1 — `translations.js`: dodaj klucze dla przycisku

W sekcji `pl` (przy innych kluczach `btn.*`):
```js
'btn.print': 'Drukuj',
```

W sekcji `en`:
```js
'btn.print': 'Print',
```

---

## Zmiana 2 — `frontend/index.html`: dodaj przycisk w pasku wyników

Znajdź element z `id="btn-reset"` (przycisk „Nowe obliczenie") i **za nim** dodaj:

```html
<button id="btn-print" data-i18n="btn.print">Drukuj</button>
```

---

## Zmiana 3 — `frontend/js/app.js`: podpięcie przycisku + i18n

### a) Event listener dla btn-print

Na końcu pliku, przed `loadDevices();`, dodaj:

```js
document.getElementById('btn-print').addEventListener('click', () => {
  window.print();
});
```

### b) Upewnij się, że `applyStaticTranslations()` obsługuje `btn-print`

`btn-print` ma atrybut `data-i18n="btn.print"`, więc zostanie obsłużony przez
istniejącą pętlę `querySelectorAll('[data-i18n]')` — **żadnych dodatkowych zmian
w `applyStaticTranslations()` nie trzeba**.

---

## Zmiana 4 — `frontend/css/style.css`: style druku

Dodaj na **końcu pliku**:

```css
/* ============================================================
   PRINT / PDF
   ============================================================ */
@media print {

  /* Ukryj wszystko poza wynikami */
  header .btn-lang,
  #form-section,
  #btn-reset,
  #btn-print,
  .btn-toggle-ctrl,
  .btn-toggle-sys {
    display: none !important;
  }

  /* Upewnij się, że sekcja wyników jest widoczna */
  #results {
    display: block !important;
  }

  /* Rozwiń wszystkie ukryte wiersze szczegółów rejestrów */
  .reg-detail-row {
    display: table-row !important;
  }

  /* Ukryj ikonę rozwijania */
  .reg-expand-icon {
    display: none !important;
  }

  /* Marginesy strony */
  @page {
    margin: 1.5cm 1.5cm 2cm 1.5cm;
  }

  /* Unikaj łamania wewnątrz bloków wynikowych */
  .result-block {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Unikaj łamania wewnątrz wierszy tabeli */
  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Drukuj kolory tła (np. nagłówki tabel) */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Usuń cienie i zaokrąglenia które źle wyglądają na druku */
  .result-block,
  table {
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  /* Tytuł strony — pogrubiony, widoczny */
  h1 {
    font-size: 16pt;
  }

  /* Tabele — pełna szerokość */
  table {
    width: 100%;
  }
}
```

---

## Zmiana 5 — synchronizacja `index.html` (root)

Po zakończeniu zmian w `frontend/index.html`:

```bash
cp frontend/index.html index.html
```

---

## Weryfikacja

1. Oblicz rejestry dla dowolnego urządzenia — widoczny wynik
2. Kliknij **Drukuj** — otwiera się dialog drukowania
3. Podgląd wydruku zawiera:
   - Nagłówek strony (h1, subtitle) ✓
   - Sekcję wyników z tabelami ✓
   - Rozwinięte opisy rejestrów ✓
   - Ukryty formularz, ukryte przyciski akcji ✓
4. Przełącz na EN, kliknij **Print** — dialog się otwiera ✓
5. Sprawdź czy `index.html` (root) jest zsynchronizowany z `frontend/index.html` ✓

---

## Commit

```
feat(print): add PDF print button with @media print styles
```
