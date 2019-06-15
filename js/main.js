'use strict';

var arrayCount = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

var getArrayOfPinObjects = function (countOfArrays) {
  var pins = [];
  for (var i = 0; i < countOfArrays; i++) {
    var pin = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png',
      },
      'offer': {
        'type': getRandomInteger(0, TYPES.length)
      },
      'location': {
        'x': getRandomInteger(1, 1200),
        'y': getRandomInteger(130, 630)
      }
    };
    pins.push(pin);
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

renderAllPins(getArrayOfPinObjects(arrayCount));

document.querySelector('.map').classList.remove('map--faded');

