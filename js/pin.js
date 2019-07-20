'use strict';
(function () {
  var Ordinate = {
    MIN: 130,
    MAX: 630
  };

  var mapBlockElement = document.querySelector('.map');
  var pinBoxElement = mapBlockElement.querySelector('.map__pins');
  var mainPinElement = pinBoxElement.querySelector('.map__pin--main');

  var mainPinWidth = mainPinElement.getBoundingClientRect().width;
  var mainPinHeight = mainPinElement.getBoundingClientRect().height;

  function getCoordinates() {
    var pinMoveEvent = new Event('pinMoveEvent', {bubbles: true, cancelable: true});
    pinMoveEvent.coords = {
      x: mainPinElement.offsetLeft + mainPinWidth / 2,
      y: mainPinElement.offsetTop + mainPinHeight
    };
    if (mapBlockElement.classList.contains('map--faded')) {
      pinMoveEvent.coords.y = mainPinElement.offsetTop + mainPinHeight / 2;
    }
    document.dispatchEvent(pinMoveEvent);
  }

  function onMouseDown(evt) {
    evt.preventDefault();
    // запоминаем координаты точки, с которой начинаем перемещать пин

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // обновляем смещение относительно первоначальной точки
    function onMouseMove(moveEvt) {
      evt.preventDefault();
      getCoordinates();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinLeft = mainPinElement.offsetLeft - shift.x;

      var pinTop = mainPinElement.offsetTop - shift.y;

      if (pinLeft < pinBoxElement.offsetLeft - mainPinWidth / 2 || pinLeft > pinBoxElement.offsetWidth - mainPinWidth / 2) {
        return;
      }
      if (pinTop < Ordinate.MIN || pinTop > Ordinate.MAX) {
        return;
      }

      mainPinElement.style.left = pinLeft + 'px';
      mainPinElement.style.top = pinTop + 'px';
    }

    // при отпускании мыши перестаем слушать событие движения мыши
    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      getCoordinates();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.pin = {
    init: function (cb) {
      mainPinElement.addEventListener('mousedown', onMouseDown);
      function onStartApp() {
        mainPinElement.removeEventListener('mouseup', onStartApp);
        mainPinElement.removeEventListener('keydown', onPinInitEnterPress);
        cb();
      }
      mainPinElement.addEventListener('mouseup', onStartApp);
      var onPinInitEnterPress = window.util.isEnterPress(onStartApp);
      mainPinElement.addEventListener('keydown', onPinInitEnterPress);
    }
  };
})();

