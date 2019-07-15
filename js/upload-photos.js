'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var form = document.querySelector('.ad-form');
  var fileChooser = form.querySelector('.ad-form__field input[type=file]');
  var preview = form.querySelector('.ad-form-header__preview img');

  var photoContainer = form.querySelector('.ad-form__photo-container');
  var fileChooserHouse = photoContainer.querySelector('.ad-form__upload input[type=file]');
  var previewHouse = photoContainer.querySelector('.ad-form__photo');

  function createNewPreviewHouse(result) {
    previewHouse.innerHTML = '';
    var newElement = document.createElement('img');
    newElement.style.width = '70px';
    newElement.style.height = '70px';
    newElement.classList.add('ad-form__photo-img');
    newElement.src = result;
    newElement.alt = 'Фотография моего жилья';
    previewHouse.appendChild(newElement);
    return previewHouse;
  }

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  fileChooserHouse.addEventListener('change', function () {
    var file = fileChooserHouse.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var readerHouse = new FileReader();
      readerHouse.addEventListener('load', function () {
        photoContainer.insertBefore(createNewPreviewHouse(readerHouse.result), previewHouse);
      });
      readerHouse.readAsDataURL(file);
    }
  });
})();
