'use strict';

(function () {
  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var mainTag = document.querySelector('main');
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__pins');
  var pins = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var ajaxErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var pinElements = [];
  var noticeForm = mainTag.querySelector('.ad-form');

  var setPinInfo = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = pin.location.x + pinParams.WIDTH / 2 + 'px';
    pinElement.style.top = pin.location.y + pinParams.HEIGHT + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    return pinElement;
  };
  var errorOverlayEscHandler = function (evt) {
    window.util.isEscEvent(evt, closeErrorOverlay);
  };
  var errorOverlayClickHandler = function () {
    var overlay = document.querySelector('.error');
    if (overlay) {
      closeErrorOverlay();
    }
  };
  var openErrorOverlay = function (text) {
    var errorContainer = ajaxErrorTemplate.cloneNode(true);
    errorContainer.querySelector('.error__message').textContent = text;
    mainTag.insertBefore(errorContainer, null);
    document.addEventListener('keydown', errorOverlayEscHandler);
    document.addEventListener('click', errorOverlayClickHandler);

  };
  var closeErrorOverlay = function () {
    var overlay = document.querySelector('.error');
    document.removeEventListener('keydown', errorOverlayEscHandler);
    document.removeEventListener('click', errorOverlayClickHandler);
    mainTag.removeChild(overlay);
    activateMap();
  };
  var errorHandler = function (errorMessage) {
    openErrorOverlay(errorMessage);
  };
  var successHandler = function (arrayOfPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayOfPins.length; i++) {
      mapContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
    }
  };
  var activateMap = function () {
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    window.data.load(successHandler, errorHandler);
    window.util.formsActivitySwitcher(true);
  };

  var deactivateMap = function () {
    map.classList.add('map--faded');
    noticeForm.classList.add('ad-form--disabled');
    window.util.formsActivitySwitcher(false);
    pinElements.forEach(function (element) {
      pins.removeChild(element);
    });

    pinElements = [];
  };

  window.map = {
    deactivateMap: deactivateMap,
    activateMap: activateMap
  };
})();
