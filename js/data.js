'use strict';

(function () {
  var load = function (successHandler, errorHandler) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения. Пожалуйста, обновите страницу.');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Сервер долго не отвечает. Пожалуйста, обновите страницу.');
    });
    xhr.responseType = 'json';
    xhr.open('GET', URL);
    xhr.send();
  };

  window.data = {
    load: load,
  };
})();
