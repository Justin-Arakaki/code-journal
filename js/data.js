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
  data.editing = null; // keep edit from sticking
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
});
