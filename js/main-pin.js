'use strict';

(function () {
  var Y_MIN = 130;
  var Y_MAX = 630;
  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var addressField = document.querySelector('#address');
  var activePage;

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
  var initPage = function () {
    setAddressValue(getMainPinLocation(false));
    window.map.deactivateMap();
    activePage = false;
    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
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
        if (!activePage) {
          setAddressValue(getMainPinLocation(true));
          window.map.activateMap();
          activePage = true;
        }
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  };

  initPage();

  window.mainPin = {
    getMainPinLocation: getMainPinLocation
  };
})();
