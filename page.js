const units = {
  Length: {
    Meter: 1,
    Kilometer: 0.001,
    Centimeter: 100,
    Millimeter: 1000,
    Micrometer: 1e6,
    Nanometer: 1e9,
    Mile: 0.000621371,
    Yard: 1.09361,
    Foot: 3.28084,
    Inch: 39.3701
  },
  Weight: {
    Kilogram: 1,
    Gram: 1000,
    Milligram: 1e6,
    Microgram: 1e9,
    MetricTon: 0.001,
    LongTon: 0.000984207,
    ShortTon: 0.00110231,
    Pound: 2.20462,
    Ounce: 35.274
  }
};

const categoryEl = document.getElementById('category');
const fromUnitEl = document.getElementById('fromUnit');
const toUnitEl = document.getElementById('toUnit');
const inputValueEl = document.getElementById('inputValue');
const resultEl = document.getElementById('result');

let allUnits = [];

function populateUnits(type) {
  fromUnitEl.innerHTML = '<option selected disabled>Select</option>';
  toUnitEl.innerHTML = '<option selected disabled>Select</option>';

  if (units[type]) {
    allUnits = Object.keys(units[type]);
    allUnits.forEach(unit => {
      fromUnitEl.add(new Option(unit, unit));
      toUnitEl.add(new Option(unit, unit));
    });
  }
}

function filterToUnits() {
  const selectedFrom = fromUnitEl.value;
  toUnitEl.innerHTML = '<option selected disabled>Select</option>';
  allUnits.forEach(unit => {
    if (unit !== selectedFrom) {
      toUnitEl.add(new Option(unit, unit));
    }
  });
}

function filterFromUnits() {
  const selectedTo = toUnitEl.value;
  fromUnitEl.innerHTML = '<option selected disabled>Select</option>';
  allUnits.forEach(unit => {
    if (unit !== selectedTo) {
      fromUnitEl.add(new Option(unit, unit));
    }
  });
}

function showModal(message) {
  const modal = document.getElementById('popupModal');
  const msg = document.getElementById('popupMessage');
  msg.textContent = message;
  modal.style.display = 'flex';

  // Reset modal position to center
  const content = modal.querySelector('.modal-content');
  content.style.top = '';
  content.style.left = '';
}

document.getElementById('popupClose').onclick = function () {
  document.getElementById('popupModal').style.display = 'none';
};

window.onclick = function (event) {
  const modal = document.getElementById('popupModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

fromUnitEl.addEventListener('change', filterToUnits);
toUnitEl.addEventListener('change', filterFromUnits);
categoryEl.addEventListener('change', () => populateUnits(categoryEl.value));

function convertUnit() {
  const category = categoryEl.value;
  const from = fromUnitEl.value;
  const to = toUnitEl.value;
  const value = parseFloat(inputValueEl.value);

  [categoryEl, fromUnitEl, toUnitEl, inputValueEl].forEach(el => el.classList.remove("error"));

  if (!category) {
    categoryEl.classList.add("error");
    showModal("Oops! Choose a category before converting.");
    return;
  }

  if (!from || from === "Select") {
    fromUnitEl.classList.add("error");
    showModal("Hold on! Select a unit to convert from.");
    return;
  }

  if (!to || to === "Select") {
    toUnitEl.classList.add("error");
    showModal("Hey! You still need to pick a 'To' unit.");
    return;
  }

  if (from === to) {
    fromUnitEl.classList.add("error");
    toUnitEl.classList.add("error");
    showModal("Hmm... Can't convert between identical units.");
    return;
  }

  if (isNaN(value)) {
    inputValueEl.classList.add("error");
    showModal("Please enter a number to convert.");
    return;
  }

  const baseValue = value / units[category][from];
  const convertedValue = baseValue * units[category][to];
  resultEl.textContent = `${value} ${from} = ${convertedValue.toFixed(6)} ${to}`;
}

// Make modal draggable
const modalContent = document.querySelector(".modal-content");
let isDragging = false;
let offset = { x: 0, y: 0 };

modalContent.addEventListener("mousedown", function (e) {
  isDragging = true;
  offset.x = e.clientX - modalContent.getBoundingClientRect().left;
  offset.y = e.clientY - modalContent.getBoundingClientRect().top;
  modalContent.style.position = "absolute";
  modalContent.style.margin = "0"; // clear center margin if re-dragged
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    modalContent.style.left = `${e.clientX - offset.x}px`;
    modalContent.style.top = `${e.clientY - offset.y}px`;
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
});
