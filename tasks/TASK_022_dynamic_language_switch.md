# TASK_022 — Dynamiczny przełącznik języka (bez przeładowania strony)

## Kontekst

Aktualnie `setLang()` wywołuje `location.reload()` — strona jest ładowana od nowa,
a użytkownik traci aktualny widok (wpisane wartości, widoczne wyniki).

Cel: zmiana języka ma aktualizować tylko teksty w DOM, zachowując stan formularza
i ewentualnie widoczne wyniki obliczeń.

---

## Zmiana 1 — `frontend/js/translations.js`

Usuń `location.reload()` z `setLang()`:

```js
// PRZED:
function setLang(lang) {
  localStorage.setItem('bms_lang', lang);
  location.reload();
}

// PO:
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('bms_lang', lang);
  // UI aktualizuje wywołujący kod (app.js)
}
```

---

## Zmiana 2 — `frontend/js/app.js`

### a) Dodaj `data-i18n` do dynamicznie tworzonych elementów

W `addDeviceRow()` zmień tworzenie etykiet tak, aby miały atrybut `data-i18n`:

```js
// PRZED:
  addrLabel.textContent = t('form.address');
  zoneLabel.textContent = t('form.zone');
  removeBtn.title = t('form.remove_title');

// PO:
  addrLabel.textContent = t('form.address');
  addrLabel.setAttribute('data-i18n', 'form.address');
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  removeBtn.title = t('form.remove_title');
  removeBtn.setAttribute('data-i18n-title', 'form.remove_title');
```

W `addMboxDeviceRow()` — analogicznie:

```js
// PRZED:
  devIdLabel.textContent = t('form.address');
  zoneLabel.textContent = t('form.zone');
  removeBtn.title = t('form.remove_title');

// PO:
  devIdLabel.textContent = t('form.address');
  devIdLabel.setAttribute('data-i18n', 'form.address');
  zoneLabel.textContent = t('form.zone');
  zoneLabel.setAttribute('data-i18n', 'form.zone');
  removeBtn.title = t('form.remove_title');
  removeBtn.setAttribute('data-i18n-title', 'form.remove_title');
```

### b) Rozszerz `applyStaticTranslations()` o obsługę `data-i18n-title`

Dodaj na końcu funkcji `applyStaticTranslations()`:

```js
  // Elementy z data-i18n-title — aktualizuj atrybut title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
```

### c) Zastąp event listener `btn-lang`

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

1. Otwórz `frontend/index.html`, wpisz urządzenie, kliknij **Oblicz** — widoczne wyniki
2. Kliknij **EN** — język zmienia się **natychmiast bez przeładowania**:
   - Wyniki przeliczone na nowo po angielsku ✓
   - Etykiety "Address:", "Zone:" w wierszach urządzeń ✓
   - Przycisk "Calculate", "+ Add device" ✓
   - Wpisane wartości (adresy, strefy) pozostają ✓
3. Dodaj kolejne urządzenie — nowy wiersz ma angielskie etykiety ✓
4. Kliknij **PL** — wraca do polskiego ✓
5. Odśwież stronę — zapamiętany język z localStorage ✓

---

## Commit

```
feat(i18n): dynamic language switch without page reload
```
