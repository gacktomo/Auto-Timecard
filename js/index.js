window.jQuery = window.$ = require(__dirname + '/js/jquery-3.3.1.min.js');
const storage = require('electron-json-storage');
const { app,shell,ipcRenderer } = require('electron');
const os = require('os');

const XLSX = require("xlsx-style-custom");
const Utils = XLSX.utils; 
const book = XLSX.readFile(__dirname + "/etc/template.xlsx", {
  cellStyles:true, 
  cellFormula:true,
  cellDates:true
});
const sheet = book.Sheets["勤務表"];
sheet["!ref"] = "A1:O51";
console.log(sheet)

$(function(){
  var dt = new Date;
  var _userpath = "";
  ipcRenderer.send('userpath-req', '');

  var checkInfo = function(){
    storage.get('userdata', function (error, data) {
      if (error) {
        throw error;
      }else if (error) {
      }
    });
  }

  var exportXslx = function(){
    sheet["E3"] = { t: "n", v: dt.getFullYear() };
    sheet["E4"] = { t: "n", v: dt.getMonth()+1 };
    storage.get('timedata', function (error, data) {
      if (error) throw error;
      if (Object.keys(data).length === 0) data = {};
      if (!data[dt.getFullYear()]) data[dt.getFullYear()] = {};
      if (!data[dt.getFullYear()][dt.getMonth()+1]) data[dt.getFullYear()][dt.getMonth()+1] = {};
      for(let i=1; i<=31; i++){
        var daydata = data[dt.getFullYear()][dt.getMonth()+1][i] || {"start":"","end":""};
        if (daydata.start != "") {
          var start = new Date("2000/01/01 "+daydata.start);
          var s_min = start.getMinutes();
          if     (  0 <= s_min && s_min <= 14 ) start.setMinutes(0)
          else if( 15 <= s_min && s_min <= 29 ) start.setMinutes(15)
          else if( 30 <= s_min && s_min <= 44 ) start.setMinutes(30)
          else if( 45 <= s_min && s_min <= 59 ) start.setMinutes(45)
          sheet["D"+(5+i)].t = "d";
          sheet["D"+(5+i)].v = start.setHours(start.getHours()+9);

          var end = new Date("2000/01/01 "+daydata.end);
          var e_min = end.getMinutes();
          if     (  0 <= e_min && e_min <= 14 ) end.setMinutes(15)
          else if( 15 <= e_min && e_min <= 29 ) end.setMinutes(30)
          else if( 30 <= e_min && e_min <= 44 ) end.setMinutes(45)
          else if( 45 <= e_min && e_min <= 59 ) end.setMinutes(0); end.setHours(end.getHours()+1);
          sheet["E"+(5+i)].t = "d";
          sheet["E"+(5+i)].v = end.setHours(end.getHours()+9);

          var lunch = Math.abs(end-start)/3600000;
          if( lunch > 5 ){
            sheet["F"+(5+i)].v = 1;
          } else {
            sheet["F"+(5+i)].v = 0;
          }
        }
      }
      var o = XLSX.utils.sheet_to_formulae(sheet);
      console.log(o)
      book.Sheets["勤務表"] = sheet;
      XLSX.writeFile(book, _userpath + "/xlsx/test.xlsx", {cellDates:true});
    });
  }

  var reloadlist = function(){
    $("#title-month").html( dt.getFullYear()+"年"+(dt.getMonth()+1)+"月")
    $("#timecard-list").html("");
    storage.get('timedata', function (error, data) {
      if (error) throw error;
      if (Object.keys(data).length === 0) data = {};
      if (!data[dt.getFullYear()]) data[dt.getFullYear()] = {};
      if (!data[dt.getFullYear()][dt.getMonth()+1]) data[dt.getFullYear()][dt.getMonth()+1] = {};
      for(let i=1; i<=31; i++){
        var daydata = data[dt.getFullYear()][dt.getMonth()+1][i] || {"start":"","end":""};
        $("#timecard-list").append("<tr> <td class='text-center'>"+ i +"</td> <td class='text-center'>"
        + daydata.start +"</td> <td class='text-center'>"
        + daydata.end + "</td> </tr>");
      }
    });
  }

  //events
  $("#prev").click(function(){
    console.log("prev");
    dt.setMonth(dt.getMonth() -1);
    reloadlist();
  });
  $("#next").click(function(){
    console.log("next");
    dt.setMonth(dt.getMonth() +1);
    reloadlist();
  });
  $("#submit").click(function(){
    console.log("submit");
    var url = "https://mail.google.com/mail/?view=cm&fs=1"
    shell.openExternal(url);
    exportXslx();
    shell.showItemInFolder(_userpath + "/xlsx/test.xlsx");
  });
  ipcRenderer.on('userpath-res', function(event, arg) {
    _userpath = arg;
  });

  reloadlist();
});

