'use strict';

(function () {
  var Y_MIN = 130;
  var Y_MAX = 630;
  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filterForm = map.querySelector('.map__filters');
  var notice = document.querySelector('.notice');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.util.formElementsDisabledSwitcher(filterForm, false);
  var noticeForm = notice.querySelector('.ad-form');
  var addressField = noticeForm.querySelector('#address');

  var setPinInfo = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = pin.location.x + pinParams.WIDTH / 2 + 'px';
    pinElement.style.top = pin.location.y + pinParams.HEIGHT + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    return pinElement;
  };
  var errorHandler = function (errorMessage) {
    console.log('some error');
  };
  var successHandler = function (arrayOfPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayOfPins.length; i++) {
      mapContainer.appendChild(fragment.appendChild(setPinInfo(arrayOfPins[i])));
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
  var switchPageToActiveState = function () {
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      noticeForm.classList.remove('ad-form--disabled');
      window.util.formElementsDisabledSwitcher(filterForm, true);
      window.util.formElementsDisabledSwitcher(noticeForm, true);
      window.data.load(successHandler, errorHandler);
    }
  };
  var setAddressValue = function (mainPinCoords) {
    addressField.value = mainPinCoords.x + ', ' + mainPinCoords.y;
  };
  setAddressValue(getMainPinLocation(false));
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
      if (mainPinCoords.x - shift.x >= 0 && mainPinCoords.x - shift.x <= mapContainer.clientWidth) {
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
})();
