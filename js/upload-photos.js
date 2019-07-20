'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var formElement = document.querySelector('.ad-form');
  var fileChooserElement = formElement.querySelector('.ad-form__field input[type=file]');
  var previewElement = formElement.querySelector('.ad-form-header__preview img');

  var photoContainerElement = formElement.querySelector('.ad-form__photo-container');
  var fileChooserHouseElement = photoContainerElement.querySelector('.ad-form__upload input[type=file]');
  var previewHouseElement = photoContainerElement.querySelector('.ad-form__photo');

  function createNewPreviewHouse(result) {
    var imgContainer = previewHouseElement.cloneNode(true);
    var newElement = document.createElement('img');
    newElement.style.width = '70px';
    newElement.style.height = '70px';
    newElement.classList.add('ad-form__photo-img');
    newElement.src = result;
    newElement.alt = 'Фотография моего жилья';
    imgContainer.appendChild(newElement);
    return imgContainer;
  }

  fileChooserElement.addEventListener('change', function () {
    var file = fileChooserElement.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewElement.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  fileChooserHouseElement.addEventListener('change', function () {
    var file = fileChooserHouseElement.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var readerHouse = new FileReader();
      readerHouse.addEventListener('load', function () {
        photoContainerElement.insertBefore(createNewPreviewHouse(readerHouse.result), previewHouseElement);
      });
      readerHouse.readAsDataURL(file);
    }
  });

})();
