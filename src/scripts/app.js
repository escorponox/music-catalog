import loadFromFMA from './load-from-fma';
import renderCatalog from './render-catalog';


const appStatus = {
  upgrading: false,
};

if ('indexedDB' in window) {
  appStatus.indexedDBExists = true;

  const dbVersion = 1;
  const catalogDBOpenRequest = global.indexedDB.open('catalogDB', dbVersion);

  catalogDBOpenRequest.onupgradeneeded = loadFromFMA.bind(null, appStatus);
  catalogDBOpenRequest.onsuccess = renderCatalog.bind(null, appStatus);
}

// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  module.hot.accept();
}
