/* exported data */
var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};
const $previousData = localStorage.getItem('data-local-storage');
if ($previousData !== null) {
  data = JSON.parse($previousData);
}
window.addEventListener('beforeunload', function () {
  if (data.editing !== null) {
    updateEditing();
  }
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
});

function updateEditing() { // Stores changes in inputs but page is reloaded
  const $notes = document.querySelector('#notes');
  const $photo = document.querySelector('#photo');
  const $title = document.querySelector('#title');
  data.editing.notes = $notes.textContent;
  data.editing.photo = $photo.value;
  data.editing.title = $title.value;
}
