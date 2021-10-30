//LINEからのメッセージ（”グラフ”）をトリガーとしてプログラムを実行する場合
function doPost(e) {
  var contents = e.postData.contents;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "message") {
      CreateChart(events[i]);
    }
  }
}



//Googleスプレッドシートの読み込み
function CreateChart(e){ 
  // ①シートを取得
  var folder = DriveApp.getFolderById('フォルダID');//作業フォルダは固定にする:ここにフォルダIDを記入
  var fileName = "M5stack2021/10/25-2021/10/31"
  var sheetName = Getday();//次にシート名
  
  var files = folder.getFilesByName(fileName);//作業フォルダ内にfileNameと同じ名前のスプレッドシートが存在するか？
  
  if (files.hasNext()) {
    SS_ID = files.next().getId();//存在する場合はIDをそのファイルに書き換え
  }
  else{
    folder.addFile(SS);//存在しない場合はルートのファイルをコピー
  }
  var ss = SpreadsheetApp.openById(SS_ID);//SpreadSheetを開く
  
  //出勤時間の取得
  var start_row = get_row(1, "C", ss, 1);//C列で最初に"1"が出てくる行　＝出勤時間の行を探す
  var starttime = ss.getSheetByName(sheetName).getRange("B"+ start_row).getValue();
  starttime = Utilities.formatDate(starttime,"JST", "HH:mm");
  
  //勤務時間の取得
  var jobtime = 0;
  var last_row = ss.getLastRow();
  Logger.log(last_row);
  for(var r = 1; r < last_row; r++){ 
    if (ss.getSheetByName(sheetName).getRange("C"+ r).getValue()== 1){
        jobtime++
      }
    } 
  
  //グラフ範囲を取得
  const range1 = ss.getSheetByName(sheetName).getRange("B:B"); //時間軸
  const range2 = ss.getSheetByName(sheetName).getRange("C:C"); //落ち着き状況
  const range3 = ss.getSheetByName(sheetName).getRange("D:D"); //着席時間
  const sheat  = ss.getSheetByName(sheetName);

  
  //グラフの作成
  var chart = sheat.newChart()
    .addRange(range1)
    .addRange(range2)
    .addRange(range3)
    .asComboChart()
    .setPosition(2,2,0,0)
    .setTitle("Health Chair")
    .setOption('titleTextStyle' ,{color: '#545454', fontSize: 20})
    .setOption('legend', {position: 'top', textStyle: {color: '#545454', fontSize: 16}})
    .setOption("series", [{targetAxisIndex:1}, {targetAxisIndex:0}]) // Index 1 は右側
    .setColors(["lavender", "firebrick", ])//色を設定
    .build();
  
  //シートにグラフを表示
  if (e.message.type == "text") {
    var input_text = e.message.text;
    if (input_text == "グラフ") {
      SendLINEBot(chart,jobtime,starttime,1);
    }
  }
}

                
                
//グラフを画像に変換する処理
function SendLINEBot(chart,jobtime,starttime, finishtime,flag){
  const folderID = 'フォルダID';   //作業フォルダは固定にする:ここにフォルダIDを記入
  var to = 'LINEBotのユーザーID';  // LINEの送る先
  
  var today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'YYYY-MM-dd');
  
  var graphImg = chart.getBlob(); // グラフを画像に変換
  var folder = DriveApp.getFolderById(folderID);
  var file = folder.createFile(graphImg);
  file.setName(today);
  
  // 公開設定する
  file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT);
  if(flag== 0){//グラフ入力
   pushImage(to, file.getDownloadUrl(),file.getDownloadUrl(),jobtime,starttime, finishtime);
   DriveApp.getFolderById(folderID).removeFile(file);
  } else {////定時入力
   pushImage_daytime(to, file.getDownloadUrl(),file.getDownloadUrl(),jobtime,starttime, finishtime);
   DriveApp.getFolderById(folderID).removeFile(file);
  }
    
}



// line developersに書いてあるChannel Access Token
var access_token = 'Channel Access Token';                
                
//LINEに特定の時刻をトリガーとしてメッセージとグラフを送信する処理
function pushImage_daytime(to, src, srcPreview,jobtime,starttime, finishtime) {
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
        "text": "今日も折り返し！現在の作業時間は、"+ job_HHMM + "です！一旦リフレッシュして、午後も頑張ろう!",
        "align": "start",
        "gravity": "top",
        "wrap": true,
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



//LINEにdoPostをトリガーとしてメッセージとグラフを送信する処理
function pushImage(to, src, srcPreview,jobtime,starttime, finishtime) {
  var url = "https://api.line.me/v2/bot/message/push";
  var jobhour = Math.floor(jobtime/ 60);
  var jobmin = jobtime % 60;
  if (jobhour < 1) {
    var job_HHMM = jobmin + "分";
  }else{
    var job_HHMM = jobhour + "時間" +jobmin + "分";
  }
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
        "text": "お疲れ様でした！今日の作業時間は、"+ job_HHMM + "でした。",
        "align": "start",
        "gravity": "top",
        "wrap": true,
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
  var now = mon+"/"+d2;
  return now;
}

function get_row(key, col, sh, flag){
  if(flag){
    var array = get_array(sh, col);
    var row = array.indexOf(key) + 1;
    return row;
  }else {
    var array = get_finish_array(sh, col);
    var row = array.indexOf(key);
    return row;
  }
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

function get_finish_array(sh, col) {
  var last_row = sh.getLastRow();
  var range = sh.getRange(col + "1:" + col + last_row)
  var values = range.getValues();
  var array = [];
  for(var i = values.length - 1; i = 1; i--){
    array.push(values[i][0]);
  }
  return array;
}
