'use strict';

(function () {
  var mainPin = window.renderPins.map.querySelector('.map__pin--main');
  var noticeForm = window.util.notice.querySelector('.ad-form');
  var addressField = noticeForm.querySelector('#address');
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
    if (window.renderPins.map.classList.contains('map--faded')) {
      window.renderPins.map.classList.remove('map--faded');
      noticeForm.classList.remove('ad-form--disabled');
      window.util.formElementsDisabledSwitcher(window.pinsFilters.filterForm, true);
      window.util.formElementsDisabledSwitcher(noticeForm, true);
      window.renderPins.renderAllPins(window.renderPins.getArrayOfPinObjects(window.renderPins.PINS_QUANTITY));
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
      if (mainPinCoords.y - shift.y >= window.util.Y_MIN && mainPinCoords.y - shift.y <= window.util.Y_MAX) {
        mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
      }
      if (mainPinCoords.x - shift.x >= 0 && mainPinCoords.x - shift.x <= window.renderPins.pinsContainer.clientWidth) {
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
  window.mainPin = {
    getMainPinLocation: function (isActive) {
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
    },
  };
})();
