'use strict';

(function () {
  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var map = document.querySelector('.map');
  var pinsContainer = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var setPinInfo = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = pin.location.x + pinParams.WIDTH / 2 + 'px';
    pinElement.style.top = pin.location.y + pinParams.HEIGHT + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    return pinElement;
  };
  var renderAllPins = function () {
    window.data.load(function (arrayOfPins) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arrayOfPins.length; i++) {
        pinsContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
      }
    });
  };
  window.renderPins = renderAllPins;
})();
