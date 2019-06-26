'use strict';

(function () {
  var filterForm = window.util.map.querySelector('.map__filters');
  window.util.formElementsDisabledSwitcher(filterForm, false);
  window.pinsFilters = {
    filterForm: filterForm
  };
})();
