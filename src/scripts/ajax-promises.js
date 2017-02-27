export default url => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    resolve(xhr.response);
  };

  xhr.onerror = function (error) {
    reject(error);
  };

  xhr.open('GET', url);
  xhr.send();
});

