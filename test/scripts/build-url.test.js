import test from 'tape';
import {buildURL} from '../../src/scripts/load-from-fma';

test('no parameters', (t) => {
  t.equal(buildURL('artists'), 'https://freemusicarchive.org/api/get/artists.json?api_key=TBHJ7JH66M2F468E');
  t.equal(buildURL('albums'), 'https://freemusicarchive.org/api/get/albums.json?api_key=TBHJ7JH66M2F468E');
  t.equal(buildURL('tracks'), 'https://freemusicarchive.org/api/get/tracks.json?api_key=TBHJ7JH66M2F468E');
  t.end();
});

test('tracks by artist', (t) => {
  t.equal(buildURL('tracks', 'artist_id', 128), 'https://freemusicarchive.org/api/get/tracks.json?api_key=TBHJ7JH66M2F468E&artist_id=128');
  t.end();
});
