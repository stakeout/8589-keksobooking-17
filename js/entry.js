'use strict';
(function () {
  function onPageStart() {
    window.pin.init(function () {
      var pinBox = document.querySelector('.map__pins');
      window.form.enableAdForm();
      window.filter.enableFilterForm();
      window.ajax({
        url: 'https://js.dump.academy/keksobooking/data',
        type: 'json',
        success: function (data) {
          window.data.set(data);

          var pins = window.data.get().slice(0, 5);
          window.map.renderElements(pins, pinBox, window.ad.createAdPin);
        },
        sendError: function (errorMessage) {
          var main = document.querySelector('main');
          var errorBlock = document.createElement('div');
          errorBlock.classList.add('error-block');
          errorBlock.style.border = '2px solid red';
          errorBlock.style.textAlign = 'center';
          errorBlock.textContent = errorMessage;
          main.insertAdjacentElement('afterbegin', errorBlock);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', onPageStart);
})();
