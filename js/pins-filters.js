'use strict';

(function () {
  var pinsDataArray = JSON.parse(localStorage.getItem('pinsData'));
  var filter = document.querySelector('.map__filters');
  var typeSelect = filter.querySelector('#housing-type');
  var priceSelect = filter.querySelector('#housing-price');
  var roomsSelect = filter.querySelector('#housing-rooms');
  var guestsSelect = filter.querySelector('#housing-guests');
  var featuresFieldset = filter.querySelector('#housing-features');
  var filterElements = filter.querySelectorAll('input, select');
  var data = JSON.parse(localStorage.getItem('pinsData'));
  var filteredData = [];

  var priceRange = {
    low: {
      MIN: 0,
      MAX: 9999
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50001,
      MAX: Infinity
    }
  };

  var PINS_NUM = 5;

  var filterElement = function (element, key, item) {
    return element.value === 'any' ? true : element.value === item[key].toString();
  };

  var filterType = function (item) {
    return filterElement(typeSelect, 'type', item.offer);
  };

  var filterPrice = function (item) {
    var priceValue = priceRange[priceSelect.value];
    return priceValue ? item.offer.price >= priceValue.MIN && item.offer.price <= priceValue.MAX : true;
  };

  var filterRooms = function (item) {
    return filterElement(roomsSelect, 'rooms', item.offer);
  };

  var filterGuests = function (item) {
    return filterElement(guestsSelect, 'guests', item.offer);
  };

  var filterFeatures = function (item) {
    var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');

    return Array.from(checkedFeatures).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var filtersChangeHandler = window.util.debounce(function () {
    filteredData = data.slice();
    filteredData = filteredData.filter(filterType);
    filteredData = filteredData.filter(filterPrice);
    filteredData = filteredData.filter(filterRooms);
    filteredData = filteredData.filter(filterGuests);
    filteredData = filteredData.filter(filterFeatures);
    // window.card.disable();
    window.pins.remove();
    window.pins.create(filteredData.slice(0, PINS_NUM));
  });

  var enableFilters = function () {
    filterElements.forEach(function (element) {
      element.disabled = false;
    });
    filter.addEventListener('change', filtersChangeHandler);
  };

  var disableFilters = function () {
    filterElements.forEach(function (element) {
      element.disabled = true;
    });
    filter.removeEventListener('change', filtersChangeHandler);
  };

  // Функция приведения фильтров в активное состояние
  var activateFilters = function (adData) {
    data = adData.slice();
    enableFilters();
    return adData.slice(0, PINS_NUM);
  };

  /**
   * Функция приведения фильтров в неактивное состояние
   */
  var deactivateFilters = function () {
    disableFilters();
    filter.reset();
  };

  window.filters = {
    activate: activateFilters,
    deactivate: deactivateFilters
  };
})();
