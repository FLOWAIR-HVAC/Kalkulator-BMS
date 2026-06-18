# TASK_023 — Naprawa urwanego app.js + dynamiczny przełącznik języka

## Problem

TASK_022 urwał `frontend/js/app.js` — plik ma 811 linii zamiast 824.
Funkcja `calculateMbox()` jest obcięta w połowie.

## Krok 1 — Przywróć pełny app.js z git

```bash
git show aad40f9:frontend/js/app.js > frontend/js/app.js
```

Sprawdź:
```bash
wc -l frontend/js/app.js
tail -5 frontend/js/app.js
```
Oczekiwany wynik: 824 linie, ostatnia linia: `loadDevices();`

---

## Krok 2 — Nałóż zmiany z TASK_022 precyzyjnymi edytami

**Nie przepisuj całego pliku.** Wykonaj cztery poniższe operacje Edit.

### Zmiana A — `applyStaticTranslations()`: dodaj obsługę `data-i18n-title`

```js
// PRZED (ok. linia 27):
  // Atrybut lang na <html>
  document.documentElement.lang = currentLang;

// PO:
  // Elementy z data-i18n-title — aktualizuj atrybut title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  // Atrybut lang na <html>
  document.documentElement.lang = currentLang;
```

### Zmiana B — `addDeviceRow()`: dodaj data-i18n do etykiet

```js
// PRZED:
  addrLabel.textContent = t('form.address');
  addrLabel.htmlFor = `addr-${id}`;

// PO:
  addrLabel.textContent = t('form.address');
  addrLabel.setAttribute('data-i18n', 'form.address');
  addrLabel.htmlFor = `addr-${id}`;
```

```js
// PRZED:
  zoneLabel.textContent = t('form.zone');
  zoneLabel.htmlFor = `zone-${id}`;

// PO:
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  zoneLabel.htmlFor = `zone-${id}`;
```

```js
// PRZED (w addDeviceRow):
  removeBtn.title = t('form.remove_title');
  removeBtn.onclick = () => row.remove();

// PO:
  removeBtn.title = t('form.remove_title');
  removeBtn.setAttribute('data-i18n-title', 'form.remove_title');
  removeBtn.onclick = () => row.remove();
```

### Zmiana C — `addMboxDeviceRow()`: dodaj data-i18n do etykiet

```js
// PRZED:
  devIdLabel.textContent = t('form.address');
  devIdLabel.htmlFor = `mbox-dev-id-${id}`;

// PO:
  devIdLabel.textContent = t('form.address');
  devIdLabel.setAttribute('data-i18n', 'form.address');
  devIdLabel.htmlFor = `mbox-dev-id-${id}`;
```

```js
// PRZED (w addMboxDeviceRow):
  zoneLabel.textContent = t('form.zone');
  zoneLabel.htmlFor = `mbox-zone-${id}`;

// PO:
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  zoneLabel.htmlFor = `mbox-zone-${id}`;
```

```js
// PRZED (w addMboxDeviceRow):
  removeBtn.title = t('form.remove_title');
  removeBtn.onclick = () => row.remove();

// PO:
  removeBtn.title = t('form.remove_title');
  removeBtn.setAttribute('data-i18n-title', 'form.remove_title');
  removeBtn.onclick = () => row.remove();
```

> Uwaga: w obu funkcjach jest `removeBtn.title` + `removeBtn.onclick`. Upewnij się,
> że edytujesz właściwą (addDeviceRow vs addMboxDeviceRow). Jeśli kontekst jest
> niejednoznaczny, użyj szerszego fragmentu jako wzorca.

### Zmiana D — event listener `btn-lang`: dodaj re-render wyników

```js
// PRZED:
document.getElementById('btn-lang').addEventListener('click', () => {
  setLang(currentLang === 'pl' ? 'en' : 'pl');
});

// PO:
document.getElementById('btn-lang').addEventListener('click', () => {
  setLang(currentLang === 'pl' ? 'en' : 'pl');
  applyStaticTranslations();

  // Jeśli wyniki są widoczne — przelicz ponownie (re-render z nowym językiem)
  const resultsSection = document.getElementById('results');
  if (resultsSection && resultsSection.style.display !== 'none') {
    const ctrl = document.getElementById('controllerType').value;
    if (ctrl === 'mbox') {
      calculateMbox();
    } else {
      calculate();
    }
  }
});
```

---

## Weryfikacja

```bash
wc -l frontend/js/app.js
```
Musi być **co najmniej 830 linii** (824 oryginał + ~10 dodanych linii).

```bash
tail -5 frontend/js/app.js
```
Ostatnia linia: `loadDevices();`

Otwórz `frontend/index.html`:
1. Oblicz dla dowolnego urządzenia — widoczne wyniki
2. Kliknij **EN** — wyniki przeliczone po angielsku, bez przeładowania strony ✓
3. Kliknij rejestr (expandowalny) — opis w nowym języku ✓
4. Kliknij **PL** — wraca do polskiego ✓

---

## Commit

```
fix(app): restore truncated app.js, apply dynamic language switch (TASK_022 redo)
```
