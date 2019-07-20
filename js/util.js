'use strict';
(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  function isEscPress(cb) {
    return function (evt) {
      evt.preventDefault();
      if (evt.keyCode === ESC_KEYCODE) {
        cb();
      }
    };
  }

  function isEnterPress(cb) {
    return function (evt) {
      evt.preventDefault();
      if (evt.keyCode === ENTER_KEYCODE) {
        cb();
      }
    };
  }

  window.util = {
    isEscPress: isEscPress,
    isEnterPress: isEnterPress
  };

})();
