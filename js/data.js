'use strict';
(function () {
  var data = null;
  function getData() {
    return data;
  }
  function setData(newData) {
    data = newData;
  }

  window.data = {
    get: getData,
    set: setData
  };

})();
