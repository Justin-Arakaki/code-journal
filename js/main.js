/* global data */
/* exported data */
const $form = document.querySelector('#entry-form');
$form.addEventListener('submit', handleSubmitCreate);
const $photoInput = document.querySelector('#photo');
$photoInput.addEventListener('input', handlePhotoChange);
const $image = document.querySelector('.img-preview');
const $topLoc = document.querySelector('header h4');
const $viewName = document.querySelector('header h1');
const $view = document.querySelectorAll('[data-view]');
const $newButton = document.querySelector('.new');
const $entryList = document.querySelector('[data-view="entries"] > ul');
const $empty = document.querySelector('[data-view="entries"] > h4');
$newButton.addEventListener('click', handleNewClick);
document.addEventListener('DOMContentLoaded', populateEntries);

function handleSubmitCreate(e) {
  event.preventDefault();
  const input = event.target.elements;
  const newEntry = {
    entryId: data.nextEntryId,
    title: input.title.value,
    photo: input.photo.value,
    notes: input.notes.value
  };
  const $topEntry = $entryList.firstChild;
  data.entries.unshift(newEntry);
  data.nextEntryId++;
  event.target.reset();
  $entryList.insertBefore(renderEntry(data.entries[0]), $topEntry);
  $empty.className = 'hidden';
  switchView('entries');
}

function handlePhotoChange(e) { // Changes the image
  const input = e.target.value;
  $image.src = input;
}

function handleNewClick() {
  switchView('entry-form');
  $image.src = 'images/placeholder-image-square.jpg';
}

function imgDefault() { // Catches errors with the image
  $image.src = 'images/placeholder-image-square.jpg';
}

function switchView(view) {
  for (let i = 0; i < $view.length; i++) {
    const dataView = $view[i].getAttribute('data-view');
    if (dataView === view) {
      $view[i].className = 'container';
      continue;
    }
    $view[i].className = 'container hidden';
  }
  switch (view) {
    case 'entry-form':
      $topLoc.textContent = '';
      $viewName.textContent = 'New Entry';
      $newButton.className = 'new hidden';
      break;
    case 'entries':
      $topLoc.textContent = 'Entries';
      $viewName.textContent = 'Entries';
      $newButton.className = 'new radius';
      break;
  }
}

function renderEntry(entry) {
  const $row = document.createElement('li');
  $row.setAttribute('class', 'row');
  const $colPhoto = document.createElement('div');
  $colPhoto.setAttribute('class', 'column-half');
  const $colInfo = document.createElement('div');
  $colInfo.setAttribute('class', 'column-half');
  const $photo = document.createElement('img');
  $photo.setAttribute('class', 'img-preview radius');
  $photo.setAttribute('onerror', 'this.onerror=null;this.src="images/placeholder-image-square.jpg"');
  $photo.setAttribute('src', entry.photo);
  $photo.setAttribute('alt', 'photo');
  const $title = document.createElement('h2');
  $title.setAttribute('class', 'no-margin');
  $title.textContent = entry.title;
  const $notes = document.createElement('p');
  $notes.textContent = entry.notes;
  $row.appendChild($colPhoto);
  $colPhoto.appendChild($photo);
  $row.appendChild($colInfo);
  $colInfo.appendChild($title);
  $colInfo.appendChild($notes);
  return $row;
}

function populateEntries() {
  for (let i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(renderEntry(data.entries[i]));
  }
  if (data.nextEntryId === 1) {
    $empty.className = 'font-weight-normal text-justify-center';
  }
}

imgDefault(); // to escape the lint
