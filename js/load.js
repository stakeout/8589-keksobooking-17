'use strict';
(function () {
  var mainElement = document.querySelector('main');
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  var successMessage = null;
  var errorMessage = null;

  function renderSuccessMessage() {
    successMessage = successMessageTemplate.cloneNode(true);
    addMessage(successMessage);
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', onSuccessDocumentClick);
  }

  var onSuccessEscPress = window.util.isEscPress(deleteSuccessMessage);

  function onSuccessDocumentClick(evt) {
    evt.preventDefault();
    deleteSuccessMessage();
  }

  function deleteSuccessMessage() {
    deleteMessage(successMessage);
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessDocumentClick);
  }

  function renderErrorMessage() {
    errorMessage = errorMessageTemplate.cloneNode(true);
    var closeButton = errorMessage.querySelector('.error__button');
    addMessage(errorMessage);
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      deleteErrorMessage();
    });
    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onErrorDocumentClick);
  }
  var onErrorEscPress = window.util.isEscPress(deleteErrorMessage);

  function deleteErrorMessage() {
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorDocumentClick);
    deleteMessage(errorMessage);
  }

  function onErrorDocumentClick(evt) {
    evt.preventDefault();
    deleteErrorMessage();
  }

  function deleteMessage(blockMessage) {
    mainElement.removeChild(blockMessage);
  }

  function addMessage(blockMessage) {
    mainElement.appendChild(blockMessage);
  }

  window.load = {
    renderSuccessMessage: renderSuccessMessage,
    renderErrorMessage: renderErrorMessage
  };
})();
