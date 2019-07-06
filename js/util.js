'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var formsActivitySwitcher = function (isActive) {
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      Array.from(form.elements).forEach(function (elem) {
        elem.disabled = isActive ? false : true;
      });
    });
  };
  formsActivitySwitcher(false);
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
    formsActivitySwitcher: formsActivitySwitcher
  };
})();

