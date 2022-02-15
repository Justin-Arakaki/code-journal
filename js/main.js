/* global data */
/* exported data */
const $form = document.querySelector('#entry-form');
$form.addEventListener('submit', handleSubmitCreate);
const $photoInput = document.querySelector('#photo');
$photoInput.addEventListener('input', handlePhotoChange);
const $image = document.querySelector('.img-preview');
imgError(); // to escape the lint

function handleSubmitCreate(e) {
  event.preventDefault();
  const input = event.target.elements;
  const newEntry = {
    id: data.nextEntryId,
    title: input.title.value,
    photo: input.photo.value,
    notes: input.notes.value
  };
  data.entries.push(newEntry);
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

function handlePhotoChange(e) {
  const input = e.target.value;
  $image.src = input;
}

function imgError() {
  $image.src = 'images/placeholder-image-square.jpg';
}
