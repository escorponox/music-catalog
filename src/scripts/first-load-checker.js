const extractCookies = () => {
  return document.cookie.split('; ').reduce((acc, curr) => {
    const equalIndex = curr.indexOf('=');
    acc[curr.slice(0, equalIndex)] = curr.slice(equalIndex + 1);
    return acc;
  }, {})
};

const checkIndexedDBLoaded = 90;

