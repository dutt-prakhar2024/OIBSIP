// ============================================================
// Temperature Converter — Vanilla JS
// ============================================================

console.log('script.js loaded successfully');

const form = document.getElementById('converterForm');
const tempInput = document.getElementById('tempInput');
const unitSelect = document.getElementById('unitSelect');
const inputError = document.getElementById('inputError');

const resultCelsius = document.getElementById('resultCelsius');
const resultFahrenheit = document.getElementById('resultFahrenheit');
const resultKelvin = document.getElementById('resultKelvin');

console.log('Elements found:', {
  form: !!form,
  tempInput: !!tempInput,
  unitSelect: !!unitSelect,
  resultCelsius: !!resultCelsius,
  resultFahrenheit: !!resultFahrenheit,
  resultKelvin: !!resultKelvin
});

// Absolute zero reference points (source of truth is Celsius)
const ABSOLUTE_ZERO_C = -273.15;

form.addEventListener('submit', function (e) {
  console.log('Form submit event fired. Input value was:', tempInput.value);
  e.preventDefault();
  handleConvert();
});

// Also allow live conversion as the user types/selects, once a valid number exists
tempInput.addEventListener('input', clearErrorState);
unitSelect.addEventListener('change', function () {
  // Re-run conversion automatically if there's already a valid number typed
  if (tempInput.value.trim() !== '' && isValidNumber(tempInput.value)) {
    handleConvert();
  }
});

function clearErrorState() {
  inputError.textContent = '';
  tempInput.classList.remove('field__input--invalid');
}

function isValidNumber(value) {
  // Accepts integers, decimals, and negative numbers. Rejects letters/symbols/empty.
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

function handleConvert() {
  console.log('handleConvert() is running');
  clearErrorState();
  resetResults();

  const rawValue = tempInput.value.trim();
  console.log('rawValue:', JSON.stringify(rawValue));

  // ---- Validation: reject empty or non-numeric input ----
  if (rawValue === '') {
    showInputError('Please enter a temperature value.');
    return;
  }

  if (!isValidNumber(rawValue)) {
    showInputError('That doesn\'t look like a valid number. Use digits only, e.g. 36.6 or -12.');
    return;
  }

  const value = parseFloat(rawValue);
  const inputUnit = unitSelect.value; // 'C' | 'F' | 'K'

  // ---- Convert input to Celsius as the common base ----
  let celsius;
  if (inputUnit === 'C') {
    celsius = value;
  } else if (inputUnit === 'F') {
    celsius = (value - 32) * (5 / 9);
  } else if (inputUnit === 'K') {
    celsius = value - 273.15;
  }

  // ---- Edge case: below absolute zero ----
  if (celsius < ABSOLUTE_ZERO_C - 1e-9) {
    showAbsoluteZeroError();
    return;
  }

  // ---- Derive the other two units from Celsius ----
  const fahrenheit = celsius * (9 / 5) + 32;
  const kelvin = celsius + 273.15;

  renderResults(celsius, fahrenheit, kelvin);
}

function showInputError(message) {
  inputError.textContent = message;
  tempInput.classList.add('field__input--invalid');
  tempInput.focus();
}

function showAbsoluteZeroError() {
  [resultCelsius, resultFahrenheit, resultKelvin].forEach(card => {
    card.classList.add('result-card--error');
  });
  resultCelsius.querySelector('.result-card__value').textContent =
    'Below absolute zero (−273.15°C) isn\'t physically possible.';
  resultFahrenheit.querySelector('.result-card__value').textContent = '—';
  resultKelvin.querySelector('.result-card__value').textContent = '—';
}

function resetResults() {
  [resultCelsius, resultFahrenheit, resultKelvin].forEach(card => {
    card.classList.remove('result-card--error');
  });
}

function renderResults(c, f, k) {
  resultCelsius.querySelector('.result-card__value').textContent = `${roundClean(c)} °C`;
  resultFahrenheit.querySelector('.result-card__value').textContent = `${roundClean(f)} °F`;
  resultKelvin.querySelector('.result-card__value').textContent = `${roundClean(k)} K`;
}

// Rounds to 2 decimal places but trims trailing zeros (e.g. 37.00 -> 37)
function roundClean(num) {
  return parseFloat(num.toFixed(2)).toString();
}
