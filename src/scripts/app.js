((global) => {
  'use strict';

  if ('indexedDB' in global) {

    const dbVersion = 1;
    let db;

    //DOM Cache
    const friendList = document.getElementById('friends');
    const friendSelect = document.getElementById('friend-select');
    const editForm = document.getElementById('edit-form');
    const friendIdInput = document.getElementById('friend-id');
    const friendName = document.getElementById('friend-name');
    const friendPhone = document.getElementById('friend-phone');
    const friendEmail = document.getElementById('friend-email');

    const catalogDBOpenRequest = global.indexedDB.open('catalogDB', dbVersion);

    catalogDBOpenRequest.onupgradeneeded = (event) => {
      const db = event.target.result,
        artistStore = db.createObjectStore('artists', {keyPath: 'artist_id'});

      artistStore.createIndex('artistName', 'artist_name');

      artistStore.transaction.oncomplete = () => {
        // start a new transaction


        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {

            const transaction = db.transaction('artists', 'readwrite'),
              artistStore = transaction.objectStore('artists'),
              artists = JSON.parse(this.response).dataset;

            artists.forEach((artist) => artistStore.add(artist));
          }
        };
        xmlhttp.open('GET', 'https://freemusicarchive.org/api/get/artists.json?api_key=TBHJ7JH66M2F468E', true);
        xmlhttp.send();
      };
    };
  }

})(window);

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
