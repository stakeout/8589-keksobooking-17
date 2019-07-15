'use strict';
(function () {

  var mapElems = [];

  // Функция отрисовки DOM-элементов

  function renderElements(arr, container, createElement) {
    var fragment = document.createDocumentFragment();
    if (Array.isArray(arr)) {
      arr.forEach(function (item) {
        var elemItem = createElement(item);
        fragment.appendChild(elemItem);
        mapElems.push(elemItem);
      });
      container.appendChild(fragment);
    } else {
      container.parentNode.insertBefore(fragment, container.nextElementSibling);
    }
  }

  function clearMap() {
    window.ad.closeAdCurrent();
    mapElems.forEach(function (item) {
      item.remove();
    });
    mapElems = [];
  }

  window.map = {
    renderElements: renderElements,
    clearMap: clearMap
  };

})();
