'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  function debounce(cb) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  }

  window.debounce = debounce;
})();
