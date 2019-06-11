'use strict';

var arrayCount = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var getArrayRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var randomFloatNumber = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = rand.toFixed(2);
  return rand;
};

var getArrayOfPinObjects = function (countOfArrays) {
  var pins = [];
  for (var i = 0; i < countOfArrays; i++) {
    var pin = {
      'author': {
        'avatar': 'img/avatars/user/0' + (i + 1) + '.png',
      },
      'offer': {
        'type': getArrayRandomValue(TYPES)
      },
      'location': {
        'x': randomFloatNumber(1, 100),
        'y': randomFloatNumber(130, 630)
      }
    };
    pins.push(pin);
  }
  return pins;
};
getArrayOfPinObjects(arrayCount);

