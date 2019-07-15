'use strict';
(function () {
  var Request = {
    STATUS: 200,
    STATE: 4
  };
  function ajax(settings) {
    var defSettings = {
      method: 'GET',
      url: '',
      data: null,
      async: true,
      success: null,
      sendError: null,
      type: '',
      readyStateChange: null,
      headers: {}
    };

    var options = Object.assign(defSettings, settings);
    var xhr = new XMLHttpRequest();
    xhr.responseType = options.type;
    xhr.open(options.method, options.url, options.async);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    for (var key in options.headers) {
      if (options.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, options.headers[key]);
      }

    }
    xhr.onreadystatechange = options.readyStateChange || function () {
      if (xhr.readyState === Request.STATE && xhr.status === Request.STATUS) {
        options.success(xhr.response);
      }
      if (xhr.readyState === Request.STATE && xhr.status !== Request.STATUS) {
        if (typeof options.sendError === 'function') {
          options.sendError(xhr.response);
        }
      }
    };
    xhr.onerror = function () {
      if (typeof options.sendError === 'function') {
        options.sendError('Произошла ошибка соединения!');
      }
    };

    xhr.send(options.data);

  }

  window.ajax = ajax;
})();
