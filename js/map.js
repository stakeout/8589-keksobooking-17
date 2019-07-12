'use strict';

(function () {
  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var mainTag = document.querySelector('main');
  var map = mainTag.querySelector('.map');
  var mapContainer = map.querySelector('.map__pins');
  var noticeForm = mainTag.querySelector('.ad-form');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var ajaxErrorTemplate = document.querySelector('#error').content.querySelector('.error');

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
  var render = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (elem) {
      fragment.appendChild(setPinInfo(elem));
    });
    mapContainer.appendChild(fragment);
  };
  var successHandler = function (ajaxData) {
    render(window.filters.activate(ajaxData));
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
  };

  window.map = {
    deactivateMap: deactivateMap,
    activateMap: activateMap,
    render: render
  };
})();
