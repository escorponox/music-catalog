import renderCatalog from './render-catalog';

const fetchAlbums = function (db) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const fetchTransaction = db.transaction('albums', 'readwrite'),
        transactionStore = fetchTransaction.objectStore('albums'),
        albums = JSON.parse(this.response).dataset;

      fetchTransaction.oncomplete = fetchTracks;

      albums.forEach(album => transactionStore.put(album));
    }
  };
  xmlhttp.open('GET', 'https://freemusicarchive.org/api/get/albums.json?api_key=TBHJ7JH66M2F468E', true);
  xmlhttp.send();
};

const fetchTracks = (event) => {
  const db = event.target.db;
  const tracksTransaction = db.transaction('albums', 'readonly'),
    transactionStore = tracksTransaction.objectStore('albums'),
    getAllAlbums = transactionStore.getAll();

  getAllAlbums.onsuccess = (event) => {
    event.target.result.forEach((album) => {
      const xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

          const tracksTransaction = db.transaction('albums', 'readwrite'),
            transactionStore = tracksTransaction.objectStore('albums');

          const tracks = JSON.parse(this.response).dataset;
          album['trackList'] = tracks.reduce((acc, curr) => {
            acc.push(curr);
            return acc;
          }, []);
          transactionStore.put(album);
        }
      };

      xmlhttp.open('GET', `https://freemusicarchive.org/api/get/tracks.json?api_key=TBHJ7JH66M2F468E&album_id=${album.album_id}`, true);
      xmlhttp.send();
    });
  };

  transactionStore.transaction.oncomplete = (event) => {
    renderCatalog({updating: false}, event)
  };
};

export default (status, event) => {
  status.upgrading = true;
  const db = event.target.result;

  const albumStore = db.createObjectStore('albums', {keyPath: 'album_id'});
  albumStore.createIndex('album_title', 'album_title');

  fetchAlbums(db);
};

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
