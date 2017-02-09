export default (event) => {
  const db = event.target.result;
  console.log('start render');

  const transaction = db.transaction('artists', 'readonly'),
    objectStore = transaction.objectStore('artists'),
    getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = function (event) {
    console.log('get all artists', event.target.result);
  };
}
