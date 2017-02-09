export const buildURL = (type, parameterName, parameterValue) => {
  const query = parameterName ? `&${parameterName}=${parameterValue}` : '';
  return `https://freemusicarchive.org/api/get/${type}.json?api_key=TBHJ7JH66M2F468E${query}`
};

const fetch = function (db, type, onCompleteCb = () => {}, parameterName, parameterValue) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const loadArtistsTransaction = db.transaction(type, 'readwrite'),
        transactionStore = loadArtistsTransaction.objectStore(type),
        artists = JSON.parse(this.response).dataset;

      loadArtistsTransaction.oncomplete = onCompleteCb;

      artists.forEach(artist => transactionStore.put(artist));
    }
  };
  xmlhttp.open('GET', buildURL(type, parameterName, parameterValue), true);
  xmlhttp.send();
};

const fetchAlbums = function (event) {
  const db = event.target.db;
  const transaction = db.transaction('artists', 'readonly'),
    transactionStore = transaction.objectStore('artists'),
    getAllArtists = transactionStore.getAll();

  getAllArtists.onsuccess = (event) => {
    event.target.result.forEach((artist) => {
      fetch(db, 'albums', fetchTracks, 'artist_id', artist.artist_id);
    });
  };
};

const fetchTracks = (event) => {
  const db = event.target.db;
  const transaction = db.transaction('albums', 'readonly'),
    transactionStore = transaction.objectStore('albums'),
    getAllAlbums = transactionStore.getAll();

  getAllAlbums.onsuccess = (event) => {
    event.target.result.forEach((album) => {
      fetch(db, 'tracks', undefined, 'album_id', album.album_id);
    });
  };

  const transactionOnArtists = db.transaction('artists', 'readonly'),
    transactionOnArtistsStore = transactionOnArtists.objectStore('artists'),
    getAllArtists = transactionOnArtistsStore.getAll();

  getAllArtists.onsuccess = (event) => {
    event.target.result.forEach((artist) => {
      fetch(db, 'tracks', undefined, 'artist_id', artist.artist_id);
    });
  };

  transactionOnArtists.oncomplete = () => console.log('completed tracks');
};

export default (event) => {
  console.log('starting load');
  const db = event.target.result;

  const artistStore = db.createObjectStore('artists', {keyPath: 'artist_id'});
  artistStore.createIndex('artistName', 'artist_name');

  const albumStore = db.createObjectStore('albums', {keyPath: 'album_id'});
  albumStore.createIndex('album_name', 'album_name');
  albumStore.createIndex('artist_id', 'artist_id');

  const trackStore = db.createObjectStore('tracks', {keyPath: 'track_id'});
  trackStore.createIndex('track_name', 'track_name');
  trackStore.createIndex('album_id', 'album_id');
  trackStore.createIndex('artist_id', 'artist_id');

  fetch(db, 'artists', fetchAlbums);
};

