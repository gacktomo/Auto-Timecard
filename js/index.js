const storage = require('electron-json-storage');
window.jQuery = window.$ = require(__dirname + '/js/jquery-3.3.1.min.js');
storage.get('config', function (error, data) {
  if (error) throw error;
  if (Object.keys(data).length === 0) {
    // データがないときの処理
  } else {
    console.log(data)
    var div = document.createElement('div');
    div.textContent = data.data
    document.body.appendChild(div);
    // データがあるときの処理
  }
});
