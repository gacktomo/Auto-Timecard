'use strict';
const {BrowserWindow, app, Menu, Tray, ipcMain} = require("electron");
const storage = require('electron-json-storage');
const AutoLaunch = require('auto-launch');
const os = require('os');
const fs = require('fs');
let _userpath = app.getPath('userData');

fs.mkdir(_userpath + "/xlsx", function(err) {
  if (err) { return 1; }
});

if(os.platform()=="darwin"){
  var launcher = new AutoLaunch({
    name: 'AutoTimecard',
    path: app.getPath('exe').match(/(.*\.app)/)[0]
  });

  launcher.enable();
  launcher.isEnabled()
  .then(function(isEnabled){
    if(isEnabled){ return; }
    launcher.enable();
  })
  .catch(function(err){});
}

var refreshTime = function() {
  storage.get('timedata', function (error, data) {
    if (error) throw error;
    var dt = new Date;
    if (Object.keys(data).length === 0) data = {};
    if (!data[dt.getFullYear()]) data[dt.getFullYear()] = {};
    if (!data[dt.getFullYear()][dt.getMonth()+1]) data[dt.getFullYear()][dt.getMonth()+1] = {};
    if (!data[dt.getFullYear()][dt.getMonth()+1][dt.getDate()]) {
      data[dt.getFullYear()][dt.getMonth()+1][dt.getDate()] = {
        "start": ('00'+dt.getHours()).slice(-2)+":"+('00'+dt.getMinutes()).slice(-2),
        "end":   ('00'+dt.getHours()).slice(-2)+":"+('00'+dt.getMinutes()).slice(-2)
      };
    }
    var datestr = dt.getFullYear()+"/"+(dt.getMonth()+1)+"/"+dt.getDate() +" "+ data[dt.getFullYear()][dt.getMonth()+1][dt.getDate()].end + ":00";
    var end = new Date(datestr);
    if( end < dt ){
      data[dt.getFullYear()][dt.getMonth()+1][dt.getDate()].end = ('00'+dt.getHours()).slice(-2)+":"+('00'+dt.getMinutes()).slice(-2);
    }

    storage.set('timedata', data, function (error) { if (error) throw error; });
  });
}

var showCard = function () { 
  const win = new BrowserWindow({
    "show": false,
    "width": 335, 
    "height": 680,
    "minWidth":335
  });
  win.loadURL('file://' + __dirname + '/index.html')
  win.once('ready-to-show', () => { win.show() })
} 

var showUserInfo = function () { 
  const win = new BrowserWindow({
    "show": false,
    "width": 335, 
    "height": 680,
    "minWidth":335
  });
  win.loadURL('file://' + __dirname + '/user.html')
  win.once('ready-to-show', () => { win.show() })
} 

let tray = null
app.on('ready', function() {
  tray = new Tray(__dirname + "/images/IconTemplate.png");
  refreshTime()
  setInterval(refreshTime, 5000);
  // showCard();
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: "タイムカードを表示", 
      click: showCard
    },
    { 
      label: "社員情報を編集", 
      click: showUserInfo
    },
    { 
      label: "アプリケーションを終了", 
      click: function () { app.quit(); }
    }
  ]);

  tray.setContextMenu(contextMenu);
  app.dock.hide();
})

ipcMain.on('userpath-req', function(event, arg) {
  event.sender.send('userpath-res', app.getPath('userData'));
});
ipcMain.on('userinfo-open', function(event, arg) {
  showUserInfo();
});
