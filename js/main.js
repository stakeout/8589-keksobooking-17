'use strict';

var PINS_QUANTITY = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var Y_MIN = 130;
var Y_MAX = 630;
var map = document.querySelector('.map');
var pinsContainer = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomInteger = function (min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
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
        'x': getRandomInteger(0, pinsContainer.clientWidth),
        'y': getRandomInteger(Y_MIN, Y_MAX)
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
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayOfPins.length; i++) {
    pinsContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
  }
};

// module4-task1
var filterForm = map.querySelector('.map__filters');
var mainPin = map.querySelector('.map__pin--main');
var notice = document.querySelector('.notice');
var noticeForm = notice.querySelector('.ad-form');
var houseType = notice.querySelector('#type');
var price = notice.querySelector('#price');
var addressField = notice.querySelector('#address');
var timeIn = notice.querySelector('#timein');
var timeOut = notice.querySelector('#timeout');

var formElementsDisabledSwitcher = function (form, isActive) {
  var elems = form.elements;
  for (var i = 0; i < elems.length; i++) {
    if (isActive) {
      elems[i].disabled = false;
    } else {
      elems[i].disabled = true;
    }
  }
};
var getMainPinLocation = function (isActive) {
  var mainPinWidth = mainPin.getBoundingClientRect().width;
  var mainPinHeight = mainPin.getBoundingClientRect().height;
  var mainPinCoords = {
    x: Math.floor(mainPin.offsetLeft + mainPinWidth / 2),
    y: Math.floor(mainPin.offsetTop + mainPinHeight / 2)
  };
  if (isActive) { // когда активируем карту сдвигом, появляется острый конец и идет пересчет дефолтного Y
    mainPinCoords.y = Math.floor(mainPin.offsetTop + mainPinHeight);
  }
  return mainPinCoords;
};

var setAddressValue = function (mainPinCoords) {
  addressField.value = mainPinCoords.x + ', ' + mainPinCoords.y;
};

formElementsDisabledSwitcher(filterForm, false);
formElementsDisabledSwitcher(noticeForm, false);
setAddressValue(getMainPinLocation(false));

// module4-task2
var minPricesOfTypes = [
  {
    type: 'palace',
    minprice: 10000
  },
  {
    type: 'house',
    minprice: 5000
  },
  {
    type: 'flat',
    minprice: 1000
  },
  {
    type: 'bungalo',
    minprice: 0
  }
];

var setDefaultPriceValue = function () {
  minPricesOfTypes.forEach(function (item) {
    if (houseType.value === item.type) {
      price.min = item.minprice;
      price.placeholder = item.minprice;
    }
  });
};
setDefaultPriceValue();

var houseTypeChangeHandler = function (evt) {
  minPricesOfTypes.forEach(function (item) {
    if (evt.target.value === item.type) {
      price.min = item.minprice;
      price.placeholder = item.minprice;
    }
  });
};

houseType.addEventListener('change', houseTypeChangeHandler);
var timeInOnChangeHandler = function () {
  timeOut.value = timeIn.value;
};
var timeOutOnChangeHandler = function () {
  timeIn.value = timeOut.value;
};
timeIn.addEventListener('change', timeInOnChangeHandler);
timeOut.addEventListener('change', timeOutOnChangeHandler);
// module 5
mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  switchPageToActiveState();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    var mainPinCoords = getMainPinLocation(true);
    if (mainPinCoords.y - shift.y >= Y_MIN && mainPinCoords.y - shift.y <= Y_MAX) {
      mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
    }
    if (mainPinCoords.x - shift.x >= 0 && mainPinCoords.x - shift.x <= pinsContainer.clientWidth) {
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    }
    setAddressValue(getMainPinLocation(true));
  };
  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    switchPageToActiveState();
    setAddressValue(getMainPinLocation(true));
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
});

var switchPageToActiveState = function () {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    formElementsDisabledSwitcher(filterForm, true);
    formElementsDisabledSwitcher(noticeForm, true);
    renderAllPins(getArrayOfPinObjects(PINS_QUANTITY));
  }
};

