'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var formElementsDisabledSwitcher = function (form, isActive) {
    var elems = form.elements;
    for (var i = 0; i < elems.length; i++) {
      if (isActive) {
        elems[i].disabled = false;
      } else {
        elems[i].disabled = true;
      }
    }
  };
  window.util = {
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
    formElementsDisabledSwitcher: formElementsDisabledSwitcher
  };
})();

