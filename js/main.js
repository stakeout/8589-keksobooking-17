'use strict';

var arrayCount = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

var getArrayOfPinObjects = function (countOfArrays) {
  var pins = [];
  for (var i = 0; i < countOfArrays; i++) {
    pins.push({
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png',
      },
      'offer': {
        'type': TYPES[getRandomInteger(0, TYPES.length - 1)]
      },
      'location': {
        'x': getRandomInteger(1, 1200),
        'y': getRandomInteger(130, 630)
      }
    });
  }
  return pins;
};

var setPinInfo = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = '';
  return pinElement;
};

var renderAllPins = function (arrayOfPins) {
  var pinsContainer = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayOfPins.length; i++) {
    pinsContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
  }
};

// module4-task1
var map = document.querySelector('.map');
var filterForm = map.querySelector('.map__filters');
var mainPin = map.querySelector('.map__pin--main');
var notice = document.querySelector('.notice');
var noticeForm = notice.querySelector('.ad-form');
var houseType = notice.querySelector('#type');
var price = notice.querySelector('#price');
var addressField = notice.querySelector('#address');
var timeIn = notice.querySelector('#timein');
var timeOut = notice.querySelector('#timeout');

var formElementsDisabledSwitcher = function (form, boolean) {
  var elems = form.elements;
  for (var i = 0; i < elems.length; i++) {
    if (!boolean) {
      elems[i].disabled = true;
    } else {
      elems[i].disabled = false;
    }
  }
};
var setDefaultCoordsAddress = function () {
  var width = mainPin.getBoundingClientRect().width;
  var height = mainPin.getBoundingClientRect().height;
  return {
    x: Math.floor(mainPin.offsetLeft + width / 2),
    y: Math.floor(mainPin.offsetTop + height / 2),
  };
};
addressField.value = parseInt(setDefaultCoordsAddress().x) + ', ' + parseInt(setDefaultCoordsAddress().y);

formElementsDisabledSwitcher(filterForm, false);
formElementsDisabledSwitcher(noticeForm, false);

mainPin.addEventListener('click', function () {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    formElementsDisabledSwitcher(filterForm, true);
    formElementsDisabledSwitcher(noticeForm, true);
    renderAllPins(getArrayOfPinObjects(arrayCount));
  }
});
// module4-task2
var getActiveSelectOptionText = function (selectElement) {
  return selectElement.options[selectElement.selectedIndex].text;
};
var getActiveSelectOptionValue = function (selectElement) {
  return selectElement.options[selectElement.selectedIndex].value;
};

var setMinAttrAtPriceField = function (selectedHouseType) {
  switch (selectedHouseType) {
    case 'Бунгало':
      price.min = 0;
      price.placeholder = 0;
      break;
    case 'Квартира':
      price.min = 1000;
      price.placeholder = 1000;
      break;
    case 'Дом':
      price.min = 5000;
      price.placeholder = 5000;
      break;
    case 'Дворец':
      price.min = 10000;
      price.placeholder = 10000;
      break;
  }
};
setMinAttrAtPriceField(getActiveSelectOptionText(houseType));
houseType.addEventListener('change', function () {
  setMinAttrAtPriceField(getActiveSelectOptionText(houseType));
});
timeIn.addEventListener('change', function () {
  timeOut.value = timeIn.value;
});
timeOut.addEventListener('change', function () {
  timeIn.value = timeOut.value;
});
