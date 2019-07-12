'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500
  var formsActivitySwitcher = function (isActive) {
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      Array.from(form.elements).forEach(function (elem) {
        elem.disabled = isActive ? false : true;
      });
    });
  };
  var debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
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
    formsActivitySwitcher: formsActivitySwitcher,
    debounce: debounce
  };
})();

