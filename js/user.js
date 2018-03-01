window.jQuery = window.$ = require(__dirname + '/js/jquery-3.3.1.min.js');
const storage = require('electron-json-storage');
const { app,shell,ipcRenderer } = require('electron');

$(function(){
  var _userpath = "";
  ipcRenderer.send('userpath-req', '');

  storage.get('userdata', function (error, data) {
    if (Object.keys(data).length === 0) {
    }else{
      $("#first-name").val(data.first_name);
      $("#last-name").val(data.last_name);
      $("#first-kana").val(data.first_kana);
      $("#last-kana").val(data.last_kana);
      $("#bank-name").val(data.bank_name);
      $("#part-name").val(data.part_name);
      $("#bank-type").val(data.bank_type);
      $("#bank-number").val(data.bank_number);
      $("#bank-user").val(data.bank_user);
      $("#work-text").val(data.work_text);
    }
  });

  //events
  $("#submit").click(function(){
    console.log("user-submit");
    var udata = {};
    udata["first_name"] = $("#first-name").val();
    udata["last_name"] = $("#last-name").val();
    udata["first_kana"] = $("#first-kana").val();
    udata["last_kana"] = $("#last-kana").val();
    udata["bank_name"] = $("#bank-name").val();
    udata["part_name"] = $("#part-name").val();
    udata["bank_type"] = $("#bank-type").val();
    udata["bank_number"] = $("#bank-number").val();
    udata["bank_user"] = $("#bank-user").val();
    udata["work_text"] = $("#work-text").val();
    storage.set('userdata', udata, function (error) { 
      if (error) throw error; 
      else $("#message").html("保存しました。");
    });
  });
  ipcRenderer.on('userpath-res', function(event, arg) {
    _userpath = arg;
  });
});

