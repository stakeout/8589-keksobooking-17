'use strict';
(function () {
  var Price = {
    PRICE_MIN: 10000,
    PRICE_MAX: 50000
  };

  var mapBlockElement = document.querySelector('.map');
  var filtersFormElement = mapBlockElement.querySelector('.map__filters');
  var filterFormElements = Array.from(filtersFormElement.elements);

  var filterCriteria = {
    housingType: 'any',
    housingPrice: 'any',
    housingRoom: 'any',
    housingGuest: 'any'
  };

  function changeConditionFilterForm() {
    filterFormElements.forEach(function (filterFormElement) {
      filterFormElement.disabled = mapBlockElement.classList.contains('map--faded') ? true : false;
    });
  }

  changeConditionFilterForm();

  function addEventFilterForm() {
    mapBlockElement.classList.remove('map--faded');
    changeConditionFilterForm();
    filtersFormElement.addEventListener('change', onChangeFilter);
  }

  function removeEventFilterForm() {
    filtersFormElement.reset();
    mapBlockElement.classList.add('map--faded');
    changeConditionFilterForm();
    filtersFormElement.removeEventListener('change', onChangeFilter);
  }

  function updateHousingTypeFilter(value) {
    filterCriteria.housingType = value;
    return filterCriteria.housingType;
  }

  function updateHousingPriceFilter(value) {
    filterCriteria.housingPrice = value;
    return filterCriteria.housingPrice;
  }

  function updateHousingRoomsFilter(value) {
    filterCriteria.housingRoom = value;
    return filterCriteria.housingRoom;
  }

  function updateHousingGuestsFilter(value) {
    filterCriteria.housingGuest = value;
    return filterCriteria.housingGuest;
  }

  function updateHousingFeatureFilter(value) {
    // если массив существует и включает в себя значение value
    if (filterCriteria.housingFeature && filterCriteria.housingFeature.includes(value)) {
      // удаляем это значение из массива
      filterCriteria.housingFeature.splice(filterCriteria.housingFeature.indexOf(value), 1);

      // если массив не имеет длины
      if (!filterCriteria.housingFeature.length) {
        // удаляем свойство из объекта
        delete filterCriteria.housingFeature;
      }
    } else {
      // иначе свойство равно самому себе или пустому массиву
      filterCriteria.housingFeature = filterCriteria.housingFeature || [];
      // пушим в него значение value
      filterCriteria.housingFeature.push(value);
    }
    return filterCriteria.housingFeature;

  }

  function housingTypeFilter(adObject) {
    var result = true;
    if (filterCriteria.housingType !== 'any') {
      result = filterCriteria.housingType === adObject.offer.type;
    }
    return result;
  }

  function housingPriceFilter(adObject) {
    var result = true;
    if (filterCriteria.housingPrice !== 'any') {
      switch (filterCriteria.housingPrice) {
        case 'middle':
          result = adObject.offer.price >= Price.PRICE_MIN && adObject.offer.price <= Price.PRICE_MAX;
          break;
        case 'low':
          result = adObject.offer.price < Price.PRICE_MIN;
          break;
        case 'high':
          result = adObject.offer.price > Price.PRICE_MAX;
          break;
        default:
          break;
      }
    }
    return result;
  }

  function housingRoomFilter(adObject) {
    var result = true;
    if (filterCriteria.housingRoom !== 'any') {
      result = filterCriteria.housingRoom === adObject.offer.rooms;
    }
    return result;
  }

  function housingGuestFilter(adObject) {
    var result = true;
    if (filterCriteria.housingGuest !== 'any') {
      result = filterCriteria.housingGuest === adObject.offer.guests;
    }
    return result;
  }

  function housingFeatureFilter(adObject) {
    // перебираем каждое добавленное значение массива преимуществ
    return (filterCriteria.housingFeature || []).every(function (value) {
      // если хотя бы одно из значений не входит в массив преимуществ фильтруемых пинов, пин не включается в отфильтрованный массив
      var result = true;
      var indexFeature = adObject.offer.features.indexOf(value);
      var valueFeature = adObject.offer.features[indexFeature];
      result = filterCriteria.housingFeature.includes(valueFeature);
      return result;
    });
  }

  function onChangeFilter(evt) {
    evt.preventDefault();
    var pins = window.data.get();
    var pinBoxElement = document.querySelector('.map__pins');
    var value = isNaN(evt.target.value) ? evt.target.value : parseInt(evt.target.value, 10);

    if (evt.target.name === 'housing-type') {
      updateHousingTypeFilter(value);
    }

    if (evt.target.name === 'housing-price') {
      updateHousingPriceFilter(value);
    }

    if (evt.target.name === 'housing-rooms') {
      updateHousingRoomsFilter(value);
    }

    if (evt.target.name === 'housing-guests') {
      updateHousingGuestsFilter(value);
    }

    if (evt.target.name === 'features') {
      updateHousingFeatureFilter(value);
    }

    var filteredPins = pins.filter(function (pin) {
      return housingTypeFilter(pin) && housingPriceFilter(pin) && housingRoomFilter(pin) && housingGuestFilter(pin) && housingFeatureFilter(pin);
    }).slice(0, 5);

    window.map.clearMap();
    window.debounce(window.map.renderElements)(filteredPins, pinBoxElement, window.ad.createAdPin);

  }

  window.filter = {
    enableFilterForm: addEventFilterForm,
    disableFilterForm: removeEventFilterForm
  };
})();
