function CreateChart(){ 
  // ①シートを取得
  var folder = DriveApp.getFolderById('******');//作業フォルダは固定にする:ここにフォルダIDを記入
  var fileName = "******"
  var sheetName = Getday();//次にシート名
  
  var files = folder.getFilesByName(fileName);//作業フォルダ内にfileNameと同じ名前のスプレッドシートが存在するか？
  
  if (files.hasNext()) {
    SS_ID = files.next().getId();//存在する場合はIDをそのファイルに書き換え
  }
  else{
    folder.addFile(SS);//存在しない場合はルートのファイルをコピー
  }
  //const ss = SpreadsheetApp.getActiveSpreadsheet();
  var ss = SpreadsheetApp.openById(SS_ID);//あらためてSpreadSheetを開く
  
  // ②グラフ範囲を取得
  const range1 = ss.getSheetByName(sheetName).getRange("B7:B500"); //時間軸
  const range2 = ss.getSheetByName(sheetName).getRange("C7:C500"); //落ち着き状況
  const range3 = ss.getSheetByName(sheetName).getRange("D7:D500"); //着席時間
  const sheat  = ss.getSheetByName(sheetName);
  
  //出勤時間の取得
  var row = get_row(1, "C", ss);//C列で最初に"1"が出てくる行　＝出勤時間の行を探す
  var startline = ss.getSheetByName(sheetName).getRange("A"+ row).getValue();//その日の最初のシート=出勤時間をみる
  var starttime = startline + ss.getSheetByName(sheetName).getRange("B"+ row).getValue();
  //starttime = starttime.replace(/GMT+0900(日本標準時)時間|Sat Dec 30 1899/g, "$&");
  starttime = starttime.replace(/G.*?時/g, "");
  
  //勤務時間の取得
  var jobtime = 0;
  var last_row = ss.getLastRow();
  Logger.log(last_row);
  for(var r = 1; r < last_row; r++){
    
   
    if (ss.getSheetByName(sheetName).getRange("C"+ r).getValue()== 1){
        jobtime++
      }
    }
  
 
  var chart = sheat.newChart()
    .addRange(range1)
    .addRange(range2)
    .addRange(range3)
    .asComboChart()
    .setPosition(2,2,0,0)
    .setTitle("Chair BOT")
    .setOption("series", [{targetAxisIndex:1}, {targetAxisIndex:0}]) // Index 1 は右側
    .setOption("vAxes", [{title:'落ち着き状況'}, {title:'着席時間'}])   // vAxesオプションは左、右の順番
    .build();
  
  // ⑦シートにグラフを表示
  SendLINEBot(chart,jobtime);
}


function SendLINEBot(chart,jobtime){
  const folderID = '*****';   //作業フォルダは固定にする:ここにフォルダIDを記入
  var to = '*****';  // LINEの送る先
  
  var today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'YYYY-MM-dd');
  
  var graphImg = chart.getBlob(); // グラフを画像に変換
  var folder = DriveApp.getFolderById(folderID);
  var file = folder.createFile(graphImg)
  file.setName(today);
  
  // 公開設定する
  file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT)
  pushImage(to, file.getDownloadUrl(),file.getDownloadUrl(),jobtime)
  DriveApp.getFolderById(folderID).removeFile(file)
}




// line developersに書いてあるChannel Access Token
var access_token = '*****';

/**
 * 指定のuser_idにpushをする
 */
function pushImage(to, src, srcPreview,jobtime) {
  var url = "https://api.line.me/v2/bot/message/push";
  var jobhour = Math.floor(jobtime/ 60);
  var jobmin = jobtime % 60;
  if (jobhour < 1) {
    var job_HHMM = jobmin + "分";
  }else{
    var job_HHMM = jobhour + "時間" +jobmin + "分";
  }
  //var time = 1
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  var postData = {
    "to" : to,
    "messages" : [
      {
      
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
  "type": "bubble",
  "direction": "ltr",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "今日のデスクワーク",
        "weight": "bold",
        "align": "center",
        "contents": []
      }
    ]
  },
  "hero": {
    "type": "image",
    "url": src,
    "size": "full",
    "aspectRatio": "1.51:1",
    "aspectMode": "fit"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "お疲れ様でした!今日の作業時間は、"+ job_HHMM + "でした",
        "align": "start",
        "gravity": "top",
        "wrap": true,
        "contents": []
      },
      {
        "type": "text",
        "text": "------------------------------------",
        "contents": []
      },
      {
        "type": "text",
        "text": "開始時刻：",
        "contents": []
      },
      {
        "type": "text",
        "text": "終了時刻：",
        "contents": []
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "spacer"
      }
    ]
  }
      }}
    ]
  };

  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}

function Getday() {
  var d = new Date();
  var y = d.getFullYear();
  var mon = d.getMonth() + 1;
  var d2 = d.getDate();
  var h = d.getHours();
  var min = d.getMinutes();
  var s = d.getSeconds();
  //var now = y+"/"+mon+"/"+d2+" "+h+":"+min+":"+s;
  var now = mon+"/"+d2;
  return now;
}

function get_row(key, col, sh){
 var array = get_array(sh, col);
 var row = array.indexOf(key) + 1;
 return row;
}

function get_array(sh, col) {
  var last_row = sh.getLastRow();
  var range = sh.getRange(col + "1:" + col + last_row)
  var values = range.getValues();
  var array = [];
  for(var i = 0; i < values.length; i++){
    array.push(values[i][0]);
  }
  return array;
}