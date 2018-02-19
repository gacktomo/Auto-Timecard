'use strict';
const {BrowserWindow, app, Menu, Tray} = require("electron");
const storage = require('electron-json-storage');

var json = { data: new Date };
storage.set('config', json, function (error) {
  if (error) throw error;
});

// ToDo
// 自動起動設定
// http://rhysd.hatenablog.com/entry/2016/12/11/191911

var showList = function () { 
  const win = new BrowserWindow({
    "show": false,
    "width": 300, 
    "height": 500
  });
  win.loadURL('file://' + __dirname + '/index.html')
  win.once('ready-to-show', () => { win.show() })
} 

let tray = null
app.on('ready', function() {
  tray = new Tray(__dirname + "/images/IconTemplate.png");
  showList();
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: "表示", 
      click: showList()    
    },
    { 
      label: "終了", 
      click: function () { app.quit(); }
    }
  ]);

  tray.setContextMenu(contextMenu);
  app.dock.hide();
})
