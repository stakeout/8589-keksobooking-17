'use strict';
(function () {
  var Ordinate = {
    MIN: 130,
    MAX: 630
  };

  var mapBlock = document.querySelector('.map');
  var pinBox = mapBlock.querySelector('.map__pins');
  var mainPin = pinBox.querySelector('.map__pin--main');

  var mainPinWidth = mainPin.getBoundingClientRect().width;
  var mainPinHeight = mainPin.getBoundingClientRect().height;

  function getCoordinates() {
    var pinMoveEvent = new Event('pinMoveEvent', {bubbles: true, cancelable: true});
    pinMoveEvent.coords = {
      x: mainPin.offsetLeft + mainPinWidth / 2,
      y: mainPin.offsetTop + mainPinHeight
    };
    if (mapBlock.classList.contains('map--faded')) {
      pinMoveEvent.coords.y = mainPin.offsetTop + mainPinHeight / 2;
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

      var pinLeft = mainPin.offsetLeft - shift.x;

      var pinTop = mainPin.offsetTop - shift.y;

      if (pinLeft < pinBox.offsetLeft - mainPinWidth / 2 || pinLeft > pinBox.offsetWidth - mainPinWidth / 2) {
        return;
      }
      if (pinTop < Ordinate.MIN || pinTop > Ordinate.MAX) {
        return;
      }

      mainPin.style.left = pinLeft + 'px';
      mainPin.style.top = pinTop + 'px';
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
      mainPin.addEventListener('mousedown', onMouseDown);
      function onStartApp() {
        mainPin.removeEventListener('mouseup', onStartApp);
        mainPin.removeEventListener('keydown', onPinInitEnterPress)
        cb();
      }
      mainPin.addEventListener('mouseup', onStartApp);
      var onPinInitEnterPress = window.util.isEnterPress(onStartApp);
      mainPin.addEventListener('keydown', onPinInitEnterPress)
    }
  };
})();

