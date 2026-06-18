# TASK_010 — M-box: placeholder w dropdownie + zmiana opisu strony

## Cel

Przygotowanie kalkulatora pod przyszły sterownik M-box:
1. Dodanie opcji "M-box" do dropdownu sterownika
2. Po wybraniu M-box — ukrycie sekcji urządzeń i trybu pracy, wyświetlenie komunikatu zastępczego
3. Zmiana opisu pod tytułem strony

---

## Zmiany do wykonania

### 1. `frontend/index.html` — dropdown + opis

W elemencie `<select id="controllerType">` dodaj opcję po `tbox_zone`:
```html
<option value="mbox">M-box</option>
```

Zmień tekst w `<header> <p>`:
```
Obliczanie adresów rejestrów Modbus dla urządzeń podłączonych do sterownika T-box
```
na:
```
Obliczanie adresów rejestrów Modbus dla urządzeń podłączonych do sterowników SYSTEMU FLOWAIR
```

### 2. `index.html` (root) — identyczne zmiany

Wprowadź dokładnie te same zmiany co w punkcie 1 (pliki muszą być zsynchronizowane).

### 3. `frontend/js/app.js` — obsługa M-box w UI

#### a) Dodaj sekcję placeholder w HTML strony

W `frontend/index.html`, za `<div id="devices-container">...</div>` (ale przed `<div class="form-actions">`), dodaj:
```html
<div id="mbox-placeholder" style="display:none">
  <p class="mbox-info">Kalkulator dla sterownika M-box jest w przygotowaniu.</p>
</div>
```

To samo w `index.html` (root).

#### b) Zaktualizuj funkcję `updateFormForControllerType()`

Obecny kod sprawdza tylko `isTboxZone`. Zastąp całą funkcję poniższą wersją:

```js
function updateFormForControllerType() {
  const val = document.getElementById('controllerType').value;
  const isTboxZone = val === 'tbox_zone';
  const isMbox = val === 'mbox';

  // Tryb pracy — widoczny tylko dla T-box klasycznego
  document.getElementById('mode-field').style.display = (isTboxZone || isMbox) ? 'none' : '';

  // Nagłówki ZoneID/DeviceID — tylko T-box Zone
  document.querySelectorAll('.zone-header-row').forEach(el => {
    el.style.display = isTboxZone ? 'flex' : 'none';
  });

  // Sekcja urządzeń + przyciski — ukryta dla M-box
  document.getElementById('devices-container').style.display = isMbox ? 'none' : '';
  document.querySelector('.form-actions').style.display = isMbox ? 'none' : '';
  document.getElementById('mbox-placeholder').style.display = isMbox ? 'block' : 'none';

  // Przebuduj opcje we wszystkich selektach urządzeń — filtruj tbox_zone_only
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

---

## Weryfikacja

Po wprowadzeniu zmian sprawdź w przeglądarce (`frontend/index.html`):

1. Dropdown sterownika zawiera trzy opcje: T-box, T-box Zone, M-box
2. Po wybraniu M-box znikają sekcja urządzeń, tryb pracy i przyciski — pojawia się komunikat
3. Po powrocie do T-box lub T-box Zone — formularz wraca do normalnego stanu
4. Opis pod "Kalkulator BMS" brzmi: *Obliczanie adresów rejestrów Modbus dla urządzeń podłączonych do sterowników SYSTEMU FLOWAIR*

---

## Commit

```
feat(app,html): add M-box placeholder option to controller dropdown
```
