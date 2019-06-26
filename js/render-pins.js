'use strict';

(function () {
  var PINS_QUANTITY = 8;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var map = window.util.map;
  var pinsContainer = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var getRandomInteger = function (min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };
  var setPinInfo = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = pin.location.y + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = '';
    return pinElement;
  };
  window.renderPins = {
    PINS_QUANTITY: PINS_QUANTITY,
    map: map,
    pinsContainer: pinsContainer,
    getArrayOfPinObjects: function (countOfArrays) {
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
            'y': getRandomInteger(window.util.Y_MIN, window.util.Y_MAX)
          }
        });
      }
      return pins;
    },
    renderAllPins: function (arrayOfPins) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arrayOfPins.length; i++) {
        pinsContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
      }
    }
  };
})();
