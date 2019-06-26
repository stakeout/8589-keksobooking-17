'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var Y_MIN = 130;
  var Y_MAX = 630;
  var notice = document.querySelector('.notice');
  var map = document.querySelector('.map');
  window.util = {
    map: map,
    notice: notice,
    Y_MIN: Y_MIN,
    Y_MAX: Y_MAX,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    formElementsDisabledSwitcher: function (form, isActive) {
      var elems = form.elements;
      for (var i = 0; i < elems.length; i++) {
        if (isActive) {
          elems[i].disabled = false;
        } else {
          elems[i].disabled = true;
        }
      }
    }
  };
})();

