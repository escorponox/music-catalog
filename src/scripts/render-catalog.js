const renderAlbums = (albums) => {
  const catalogContainer = document.getElementById('album-container');
  const catalogFragment = document.createDocumentFragment();

  albums.forEach(album => {
    const container = document.createElement('DIV');
    container.classList.add('c-album');

    container.innerHTML = `<img src=${album.album_image_file} class="c-album__image">
      <div class="c-album__info">
        <h3>${album.artist_name}</h3>
        <p>${album.album_title}</p>
        <p>Release Date: ${album.album_date_released ? album.album_date_released : 'Unknown'}</p>
        <a target="_blank" href="${album.album_url}">Listen in FMA</a>
      </div>`;

    const trackContainer = document.createElement('DIV');
    trackContainer.classList.add('c-album_tracks');
    trackContainer.innerHTML = '<h3 class="c-album__tracks__header">Track List</h3>';
    const trackList = document.createElement('UL');
    trackList.classList.add('c-album__tracks__list');
    // console.log(album.album_id, album.trackList);
    album.trackList.forEach((track) => {
      const li = document.createElement('LI');
      li.classList.add('c-album__tracks__list__track');
      li.innerHTML = `<a target="_blank" href="${track.track_url}">${track.track_title} - ${track.track_duration}</a>`;
      trackList.appendChild(li);
    });


    trackContainer.appendChild(trackList);

    container.appendChild(trackContainer);

    catalogFragment.appendChild(container);
  });

  catalogContainer.appendChild(catalogFragment);
};


export default (status, event) => {
  const db = event.target.db || event.target.result;

  if (!status.upgrading) {
    const transaction = db.transaction('albums', 'readonly'),
      objectStore = transaction.objectStore('albums'),
      getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function (event) {
      renderAlbums(event.target.result);
    };
  }
};

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
