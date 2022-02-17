/* global data */
/* exported data */
const $form = document.querySelector('#entry-form');
$form.addEventListener('submit', handleSubmit);
const $photoInput = document.querySelector('#photo');
$photoInput.addEventListener('input', handlePhotoChange);
const $imagePreview = document.querySelector('.img-preview');
const $newButton = document.querySelector('.new');
$newButton.addEventListener('click', handleNewClick);
const $entryList = document.querySelector('[data-view="entries"] > ul');
$entryList.addEventListener('click', editView);
const $emptyCase = document.querySelector('[data-view="entries"] > h4');
document.addEventListener('DOMContentLoaded', populateEntries);
let editIndex = null;
let targetUpdated = null;

function handleSubmit(e) {
  e.preventDefault();
  const input = e.target.elements;
  const newEntry = {
    entryId: data.nextEntryId,
    title: input.title.value,
    photo: input.photo.value,
    notes: input.notes.value
  };
  const $topEntry = $entryList.firstChild;
  if (data.editing === null) {
    data.entries.unshift(newEntry);
    data.nextEntryId++;
    $entryList.insertBefore(renderEntry(data.entries[0]), $topEntry);
  } else {
    data.entries[editIndex] = newEntry;
    $entryList.replaceChild(renderEntry(newEntry), targetUpdated);
    data.editing = null;
    editIndex = null;
  }
  e.target.reset();
  $emptyCase.className = 'hidden';
  switchView('entries');
}

function handlePhotoChange(e) { // Changes the image
  const input = e.target.value;
  $imagePreview.src = input;
}

function handleNewClick() {
  switchView('entry-form');
  imgDefault();
}

function imgDefault() { // Catches errors with the image
  $imagePreview.src = 'images/placeholder-image-square.jpg';
}

function switchView(view) {
  const $topLoc = document.querySelector('header h4');
  const $viewName = document.querySelector('header h1');
  const $view = document.querySelectorAll('[data-view]');
  for (let i = 0; i < $view.length; i++) {
    const dataView = $view[i].getAttribute('data-view');
    if (dataView.includes(view)) {
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
    case 'edit-entry':
      $topLoc.textContent = 'Entries';
      $viewName.textContent = 'Edit Entry';
      $newButton.className = 'new hidden';
      break;
  }
}

function editView(e) {
  const clickee = e.target;
  if (clickee.tagName === 'I') {
    const id = clickee.closest('li').getAttribute('data-entry-id');
    for (const x in data.entries) {
      const entry = data.entries[x];
      if (id === entry.entryId.toString()) {
        populateEdit(entry);
        data.editing = entry;
        editIndex = x;
        targetUpdated = clickee.closest('li');
      }
    }
    switchView('edit-entry');
  }
}

function populateEdit(entryObject) {
  const $titleInput = document.querySelector('#title');
  const $notesInput = document.querySelector('#notes');
  $titleInput.setAttribute('value', entryObject.title);
  $photoInput.setAttribute('value', entryObject.photo);
  $notesInput.textContent = entryObject.notes;
  $imagePreview.src = entryObject.photo;
}

function renderEntry(entry) {
  const $row = document.createElement('li');
  $row.setAttribute('class', 'row entry-item');
  $row.setAttribute('data-entry-id', entry.entryId);
  const $colPhoto = document.createElement('div');
  $colPhoto.setAttribute('class', 'column-half');
  const $colInfo = document.createElement('div');
  $colInfo.setAttribute('class', 'column-half');
  const $titleRow = document.createElement('div');
  $titleRow.setAttribute('class', 'row justify-space margin-bottom');
  const $photo = document.createElement('img');
  $photo.setAttribute('class', 'img-preview radius');
  $photo.setAttribute('onerror', 'this.onerror=null;this.src="images/placeholder-image-square.jpg"');
  $photo.setAttribute('src', entry.photo);
  $photo.setAttribute('alt', 'photo');
  const $title = document.createElement('h2');
  $title.setAttribute('class', 'no-margin max-width-80');
  $title.textContent = entry.title;
  const $edit = document.createElement('i');
  $edit.setAttribute('class', 'fas fa-pen icon');
  const $notes = document.createElement('p');
  $notes.setAttribute('class', 'no-margin');
  $notes.textContent = entry.notes;
  $row.appendChild($colPhoto);
  $colPhoto.appendChild($photo);
  $row.appendChild($colInfo);
  $colInfo.appendChild($titleRow);
  $titleRow.appendChild($title);
  $titleRow.appendChild($edit);
  $colInfo.appendChild($notes);
  return $row;
}

function populateEntries() {
  for (let i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(renderEntry(data.entries[i]));
  }
  if (data.nextEntryId === 1) {
    $emptyCase.className = 'font-weight-normal text-justify-center';
  }
}

imgDefault(); // to escape the lint
