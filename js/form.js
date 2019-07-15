'use strict';
(function () {
  var TitleLength = {
    LENGTH_MIN: 30,
    LENGTH_MAX: 100
  };
  var Coordinate = {
    LEFT: 570,
    TOP: 375
  };

  var main = document.querySelector('main');
  var mainPin = main.querySelector('.map__pin--main');
  var form = main.querySelector('.ad-form');
  var adFormElements = Array.from(form.elements);
  var timeIn = form.querySelector('#timein');
  var timeOut = form.querySelector('#timeout');

  var roomNumber = form.querySelector('#room_number');
  var guestNumber = form.querySelector('#capacity');

  var typeHousing = form.querySelector('#type');

  var typeHousingMap = {
    'bungalo': {
      min: 0,
      max: 1000000
    },
    'flat': {
      min: 1000,
      max: 1000000
    },
    'house': {
      min: 5000,
      max: 1000000
    },
    'palace': {
      min: 10000,
      max: 1000000
    }
  };

  var roomForGuestsMap = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0'],
  };

  function changeConditionAdForm() {
    adFormElements.forEach(function (adFormElement) {
      adFormElement.disabled = form.classList.contains('ad-form--disabled') ? true : false;
    });
  }

  changeConditionAdForm();

  function getMainPinStartCoordinates() {
    var mainPinStartCoords = {
      x: parseInt(mainPin.style.left, 10) + mainPin.getBoundingClientRect().width / 2,
      y: parseInt(mainPin.style.top, 10) + mainPin.getBoundingClientRect().height / 2
    };

    form.address.value = mainPinStartCoords.x + ', ' + mainPinStartCoords.y;
  }

  getMainPinStartCoordinates();

  function addEventAdForm() {
    form.classList.remove('ad-form--disabled');
    changeConditionAdForm();
    roomNumber.addEventListener('change', onChangeRooms);
    typeHousing.addEventListener('change', onChangeType);
    timeIn.addEventListener('change', onChangeTimeIn);
    timeOut.addEventListener('change', onChangeTimeOut);
    form.addEventListener('reset', onResetForm);
    form.addEventListener('submit', onSubmitForm);
    document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);
  }

  function removeEventAdForm() {
    form.classList.add('ad-form--disabled');
    changeConditionAdForm();
    roomNumber.removeEventListener('change', onChangeRooms);
    typeHousing.removeEventListener('change', onChangeType);
    timeIn.removeEventListener('change', onChangeTimeIn);
    timeOut.removeEventListener('change', onChangeTimeOut);
    form.removeEventListener('reset', onResetForm);
    form.removeEventListener('submit', onSubmitForm);
    document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);
  }

  function changeRoomNumberValue(value) {
    Array.from(guestNumber.options).forEach(function (option) {
      option.disabled = !roomForGuestsMap[value].includes(option.value);
    });
    guestNumber.value = value > 3 ? '0' : value;
  }

  changeRoomNumberValue(roomNumber.value);

  function onChangeRooms(evt) {
    changeRoomNumberValue(evt.currentTarget.value);
  }

  var housingTypes = Object.keys(typeHousingMap);

  var valid = true;
  var errorBox = null;
  function renderError(element, errorText) {
    errorBox = document.createElement('div');
    errorBox.className = 'errorbox';
    var errorParagraph = document.createElement('p');
    errorParagraph.className = 'errorbox__paragraph';
    errorParagraph.textContent = errorText;

    errorBox.appendChild(errorParagraph);
    element.insertAdjacentElement('afterEnd', errorBox);

    element.addEventListener('focus', onErrorRemove);

    element.addEventListener('blur', onFocusRemove);
  }

  function onErrorRemove(evt) {
    evt.preventDefault();
    if (errorBox) {
      errorBox.remove();
    }
  }

  function onFocusRemove(evt) {
    onErrorRemove(evt);
    evt.target.style.border = 'none';
    evt.target.removeEventListener('focus', onErrorRemove);
    evt.target.removeEventListener('blur', onFocusRemove);
  }

  function onChangeType(evt) {
    form.price.placeholder = typeHousingMap[evt.currentTarget.value].min;
  }

  function onChangeTimeIn(evt) {
    var timeInCurrentValue = evt.currentTarget.value;
    timeOut.value = timeInCurrentValue;
  }

  function onChangeTimeOut(evt) {
    var timeOutCurrentValue = evt.currentTarget.value;
    timeIn.value = timeOutCurrentValue;
  }

  function onPinMoveEventAddressField(evt) {
    form.address.value = evt.coords.x + ', ' + evt.coords.y;
  }

  document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);

  function changeInputStyle(inputName) {
    inputName.value = '';
    inputName.focus();
    inputName.style.outline = 'none';
    inputName.style.border = '2px solid red';
  }

  function changePage() {
    form.reset();
    window.map.clearMap();
    removeEventAdForm();
    window.filter.disableFilterForm();
    mainPin.style.left = Coordinate.LEFT + 'px';
    mainPin.style.top = Coordinate.TOP + 'px';
    getMainPinStartCoordinates();
    window.pin.init(function () {
      var pinBox = document.querySelector('.map__pins');
      addEventAdForm();
      window.filter.enableFilterForm();
      var pins = window.data.get().slice(0, 5);
      window.map.renderElements(pins, pinBox, window.ad.createAdPin);
    });
  }

  function onResetForm() {
    changePage();
  }

  function onSubmitForm(evt) {
    evt.preventDefault();

    if (form.title) {
      var strLength = form.title.value.length;
      if (strLength < TitleLength.LENGTH_MIN || strLength > TitleLength.LENGTH_MAX) {
        valid = false;
        changeInputStyle(form.title);
        renderError(form.title, 'Количество символов в заголовке объявления не должно быть меньше 30 и больше 100');
        return;
      } else {
        valid = true;
      }
    }

    if (form.price) {
      for (var i = 0; i < housingTypes.length; i++) {
        if (typeHousing.value === housingTypes[i]) {
          if (form.price.value < typeHousingMap[housingTypes[i]].min || form.price.value > typeHousingMap[housingTypes[i]].max) {
            valid = false;
            changeInputStyle(form.price);
            renderError(form.price, 'Цена не может быть ниже указанного значения или выше 1000000');
            return;
          } else {
            valid = true;
          }
        }
      }
    }

    if (valid) {
      var formNew = new FormData(form);
      window.ajax({
        method: 'POST',
        url: 'https://js.dump.academy/keksobooking',
        data: formNew,
        success: function () {
          changePage();
          window.load.renderSuccessMessage();

        },
        sendError: function () {
          changePage();
          window.load.renderErrorMessage();
        },
        type: 'json'
      });
    }
  }

  window.form = {
    enableAdForm: addEventAdForm
  };

})();
