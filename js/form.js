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

  var mainElement = document.querySelector('main');
  var mainPinElement = mainElement.querySelector('.map__pin--main');
  var formElement = mainElement.querySelector('.ad-form');
  var adFormElements = Array.from(formElement.elements);
  var timeInElement = formElement.querySelector('#timein');
  var timeOutElement = formElement.querySelector('#timeout');

  var roomNumberElement = formElement.querySelector('#room_number');
  var guestNumberElement = formElement.querySelector('#capacity');

  var typeHousingElement = formElement.querySelector('#type');

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
      adFormElement.disabled = formElement.classList.contains('ad-form--disabled') ? true : false;
    });
  }

  changeConditionAdForm();

  function getMainPinStartCoordinates() {
    var mainPinStartCoords = {
      x: parseInt(mainPinElement.style.left, 10) + mainPinElement.getBoundingClientRect().width / 2,
      y: parseInt(mainPinElement.style.top, 10) + mainPinElement.getBoundingClientRect().height / 2
    };

    formElement.address.value = mainPinStartCoords.x + ', ' + mainPinStartCoords.y;
  }

  getMainPinStartCoordinates();

  function addEventAdForm() {
    formElement.classList.remove('ad-form--disabled');
    changeConditionAdForm();
    roomNumberElement.addEventListener('change', onChangeRooms);
    typeHousingElement.addEventListener('change', onChangeType);
    timeInElement.addEventListener('change', onChangeTimeIn);
    timeOutElement.addEventListener('change', onChangeTimeOut);
    formElement.addEventListener('reset', onResetForm);
    formElement.addEventListener('submit', onSubmitForm);
    document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);
  }

  function removeEventAdForm() {
    formElement.classList.add('ad-form--disabled');
    changeConditionAdForm();
    roomNumberElement.removeEventListener('change', onChangeRooms);
    typeHousingElement.removeEventListener('change', onChangeType);
    timeInElement.removeEventListener('change', onChangeTimeIn);
    timeOutElement.removeEventListener('change', onChangeTimeOut);
    formElement.removeEventListener('reset', onResetForm);
    formElement.removeEventListener('submit', onSubmitForm);
    document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);
  }

  function changeRoomNumberValue(value) {
    Array.from(guestNumberElement.options).forEach(function (option) {
      option.disabled = !roomForGuestsMap[value].includes(option.value);
    });
    guestNumberElement.value = value > 3 ? '0' : value;
  }

  changeRoomNumberValue(roomNumberElement.value);

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
    formElement.price.placeholder = typeHousingMap[evt.currentTarget.value].min;
  }

  function onChangeTimeIn(evt) {
    var timeInCurrentValue = evt.currentTarget.value;
    timeOutElement.value = timeInCurrentValue;
  }

  function onChangeTimeOut(evt) {
    var timeOutCurrentValue = evt.currentTarget.value;
    timeInElement.value = timeOutCurrentValue;
  }

  function onPinMoveEventAddressField(evt) {
    formElement.address.value = evt.coords.x + ', ' + evt.coords.y;
  }

  document.addEventListener('pinMoveEvent', onPinMoveEventAddressField);

  function changeInputStyle(inputName) {
    inputName.value = '';
    inputName.focus();
    inputName.style.outline = 'none';
    inputName.style.border = '2px solid red';
  }

  function changePage() {
    formElement.reset();
    window.map.clearMap();
    removeEventAdForm();
    window.filter.disableFilterForm();
    mainPinElement.style.left = Coordinate.LEFT + 'px';
    mainPinElement.style.top = Coordinate.TOP + 'px';
    getMainPinStartCoordinates();
    window.pin.init(function () {
      var pinBoxElement = document.querySelector('.map__pins');
      addEventAdForm();
      window.filter.enableFilterForm();
      var pins = window.data.get().slice(0, 5);
      window.map.renderElements(pins, pinBoxElement, window.ad.createAdPin);
    });
  }

  function onResetForm() {
    changePage();
  }

  function onSubmitForm(evt) {
    evt.preventDefault();

    if (formElement.title) {
      var strLength = formElement.title.value.length;
      if (strLength < TitleLength.LENGTH_MIN || strLength > TitleLength.LENGTH_MAX) {
        valid = false;
        changeInputStyle(formElement.title);
        renderError(formElement.title, 'Количество символов в заголовке объявления не должно быть меньше 30 и больше 100');
        return;
      } else {
        valid = true;
      }
    }

    if (formElement.price) {
      for (var i = 0; i < housingTypes.length; i++) {
        if (typeHousingElement.value === housingTypes[i]) {
          if (formElement.price.value < typeHousingMap[housingTypes[i]].min || formElement.price.value > typeHousingMap[housingTypes[i]].max) {
            valid = false;
            changeInputStyle(formElement.price);
            renderError(formElement.price, 'Цена не может быть ниже указанного значения или выше 1000000');
            return;
          } else {
            valid = true;
          }
        }
      }
    }

    if (valid) {
      var formNew = new FormData(formElement);
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
