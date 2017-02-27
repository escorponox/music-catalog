import {renderAlbums} from './render-catalog';
import ajaxPromise from './ajax-promises';

const updateAlbums = (db, response) => new Promise((resolve, reject) => {
  const fetchTransaction = db.transaction('albums', 'readwrite'),
    transactionStore = fetchTransaction.objectStore('albums'),
    albums = JSON.parse(response).dataset;

  fetchTransaction.oncomplete = resolve(albums);
  albums.forEach(album => transactionStore.put(album));
});

const fetchAlbums = () => ajaxPromise('https://freemusicarchive.org/api/get/albums.json?api_key=TBHJ7JH66M2F468E');

const updateTracks = (db, album, trackData) => new Promise ((resolve, reject) => {
  const tracksTransaction = db.transaction('albums', 'readwrite'),
    transactionStore = tracksTransaction.objectStore('albums');

  transactionStore.transaction.oncomplete = resolve(album);

  const tracks = JSON.parse(trackData).dataset;
  album['trackList'] = tracks.reduce((acc, curr) => {
    acc.push(curr);
    return acc;
  }, []);
  transactionStore.put(album);
});

const fetchTracks = (db, albums) => albums
  .map((album) => ajaxPromise(`https://freemusicarchive.org/api/get/tracks.json?api_key=TBHJ7JH66M2F468E&album_id=${album.album_id}`)
    .then(updateTracks.bind(null, db, album)));

export default (status, event) => {
  status.upgrading = true;
  const db = event.target.result;

  if (db.objectStoreNames.contains('albums')) {
    db.deleteObjectStore('albums');
  }
  const albumStore = db.createObjectStore('albums', {keyPath: 'album_id'});
  albumStore.createIndex('album_title', 'album_title');

  fetchAlbums()
    .then(updateAlbums.bind(null, db))
    .then(fetchTracks.bind(null, db))
    .then((albumTracks) => Promise.all(albumTracks))
    .then((albums) => renderAlbums(albums))
    .catch((error) => console.error(error));
};

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
