'use strict';

(function () {

  var pinElements = [];
  var pins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  var createPins = function (adData) {
    adData.forEach(function (element) {
      var pin = window.map.render(element);
      fragment.appendChild(pin);
      pinElements.push(pin);
    });

    pins.appendChild(fragment);
  };

  var removePins = function () {
    pinElements.forEach(function (element) {
      pins.removeChild(element);
    });

    pinElements = [];
  };

  window.pins = {
    create: createPins,
    remove: removePins
  };
})();
