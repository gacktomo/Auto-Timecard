const storage = require('electron-json-storage');
window.jQuery = window.$ = require(__dirname + '/js/jquery-3.3.1.min.js');

$(function(){
  var dt = new Date;

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

  reloadlist();
});

