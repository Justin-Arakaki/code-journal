/* global data */
/* exported data */
const $form = document.querySelector('#entry-form');
$form.addEventListener('submit', handleClickSubmit);
const $photoInput = document.querySelector('#photo');
$photoInput.addEventListener('input', handlePhotoChange);
const $imagePreview = document.querySelector('.img-preview');
const $newButton = document.querySelector('.new');
$newButton.addEventListener('click', handleClickNew);
const $entryList = document.querySelector('[data-view="entries"] > ul');
$entryList.addEventListener('click', handleClickEdit);
const $emptyCase = document.querySelector('[data-view="entries"] > h4');
document.addEventListener('DOMContentLoaded', handleLoad);
const $overlay = document.querySelector('.overlay');
const $deleteButton = document.querySelector('.delete');
$deleteButton.addEventListener('click', handleClickDelete);
const $cancelDeleteButton = document.querySelector('.cancel');
$cancelDeleteButton.addEventListener('click', handleClickCancelDelete);
const $confirmDeleteButton = document.querySelector('.confirm');
$confirmDeleteButton.addEventListener('click', handleClickConfirmDelete);
let editIndex = null;
let $targetUpdated = null;

function handleLoad() { // Loads all information to html
  for (let i = 0; i < data.entries.length; i++) {
    $entryList.appendChild(renderEntry(data.entries[i]));
  }
  if (data.nextEntryId === 1) {
    $emptyCase.className = 'font-weight-normal text-justify-center';
  }
  switchView(data.view);
  autofillEdit(data.editing);
}

function handleClickSubmit(e) { // When submitting form on edit entry
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
  }
  updateEditVars();
  data.entries[editIndex] = newEntry;
  $entryList.replaceChild(renderEntry(newEntry), $targetUpdated);
  data.editing = null;
  e.target.reset();
  clearEditVars();
  clearInputs();
  $emptyCase.className = 'hidden';
  switchView('entries');
}

function handleClickEdit(e) { // When clicking the pen icon
  const clickee = e.target;
  if (clickee.tagName === 'I') {
    const id = clickee.closest('li').getAttribute('data-entry-id');
    for (const x in data.entries) {
      const entry = data.entries[x];
      if (id === entry.entryId.toString()) {
        data.editing = entry;
        editIndex = x;
        $targetUpdated = clickee.closest('li');
        autofillEdit(entry);
      }
    }
    switchView('edit-entry');
  }
}

function handlePhotoChange(e) { // Changes the image preview
  const input = e.target.value;
  $imagePreview.src = input;
}

function handleClickNew() { // When clicking new button
  switchView('entry-form');
  imgDefault();
}

function handleClickDelete() {
  $overlay.className = 'overlay';
}

function handleClickCancelDelete() {
  $overlay.className = 'overlay hidden';
}

function handleClickConfirmDelete() {
  const index = searchEntries(data.editing);
  data.entries.splice(index, 1);
  data.editing = null;
  $overlay.className = 'overlay hidden';
  updateEditVars();
  $targetUpdated.remove();
  clearEditVars();
  switchView('entries');
}

function updateEditVars() {
  if (editIndex === null || $targetUpdated === null) {
    editIndex = searchEntries(data.editing);
    $targetUpdated = $entryList.firstChild;
    for (let i = 0; i < editIndex; i++) {
      $targetUpdated = $targetUpdated.nextSibling;
    }
  }
}

function clearEditVars() {
  editIndex = null;
  $targetUpdated = null;
}

function clearInputs() { // Fixes input values changed via JS
  const $title = document.querySelector('#title');
  const $photo = document.querySelector('#photo');
  const $notes = document.querySelector('#notes');
  $title.setAttribute('value', '');
  $photo.setAttribute('value', '');
  $notes.textContent = '';
}

function imgDefault() { // Catches errors with the image
  $imagePreview.src = 'images/placeholder-image-square.jpg';
}

function switchView(view) { // Changes html to the view (string)
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
      $deleteButton.className = 'delete visibility-hidden';
      data.view = 'entry-form';
      break;
    case 'entries':
      $topLoc.textContent = 'Entries';
      $viewName.textContent = 'Entries';
      $newButton.className = 'new radius';
      data.view = 'entries';
      break;
    case 'edit-entry':
      $topLoc.textContent = 'Entries';
      $viewName.textContent = 'Edit Entry';
      $newButton.className = 'new hidden';
      $deleteButton.className = 'delete';
      data.view = 'edit-entry';
      break;
  }
}

function autofillEdit(entryObject) { // Populates inputs with selected entry
  const $titleInput = document.querySelector('#title');
  const $notesInput = document.querySelector('#notes');
  $titleInput.setAttribute('value', entryObject.title);
  $photoInput.setAttribute('value', entryObject.photo);
  $notesInput.textContent = entryObject.notes;
  $imagePreview.src = entryObject.photo;
}

function searchEntries(entryObject) { // Returns index of entry in data.entries
  for (const x in data.entries) {
    if (data.entries[x] === entryObject) {
      return x;
    }
  }
  return -1;
}

function renderEntry(entry) { // Returns entry element
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

imgDefault(); // to escape the lint
