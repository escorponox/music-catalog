import loadFromFMA from './load-from-fma';
import renderCatalog from './render-catalog';

if ('indexedDB' in window) {
  const dbVersion = 1;
  const catalogDBOpenRequest = global.indexedDB.open('catalogDB', dbVersion);

  catalogDBOpenRequest.onupgradeneeded = loadFromFMA;
  catalogDBOpenRequest.onsuccess = renderCatalog;
}

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
