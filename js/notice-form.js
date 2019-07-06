'use strict';

(function () {
  var notice = document.querySelector('.notice');
  // var noticeForm = notice.querySelector('.ad-form');
  var houseType = notice.querySelector('#type');
  var price = notice.querySelector('#price');
  var timeIn = notice.querySelector('#timein');
  var timeOut = notice.querySelector('#timeout');

  var minPricesOfTypes = [
    {
      type: 'palace',
      minprice: 10000
    },
    {
      type: 'house',
      minprice: 5000
    },
    {
      type: 'flat',
      minprice: 1000
    },
    {
      type: 'bungalo',
      minprice: 0
    }
  ];
  var setDefaultPriceValue = function () {
    minPricesOfTypes.forEach(function (item) {
      if (houseType.value === item.type) {
        price.min = item.minprice;
        price.placeholder = item.minprice;
      }
    });
  };
  setDefaultPriceValue();
  var houseTypeChangeHandler = function (evt) {
    minPricesOfTypes.forEach(function (item) {
      if (evt.target.value === item.type) {
        price.min = item.minprice;
        price.placeholder = item.minprice;
      }
    });
  };
  houseType.addEventListener('change', houseTypeChangeHandler);
  var timeInOnChangeHandler = function () {
    timeOut.value = timeIn.value;
  };
  var timeOutOnChangeHandler = function () {
    timeIn.value = timeOut.value;
  };
  timeIn.addEventListener('change', timeInOnChangeHandler);
  timeOut.addEventListener('change', timeOutOnChangeHandler);
})();
