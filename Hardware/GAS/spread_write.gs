function doPost(e){
  var param = e.postData.getDataAsString();//データ取得
  //var param = "forest,No.6,11,date,time,gyroX,gyroY,gyroZ,accX,accY,accZ,pitch,roll,raw,"
  var ary = param.split(',');//取得データをカンマで区切ってaryに格納
  var fileName = ary[0];//aryの最初はファイル名(SpreadSheet)
  var sheetName = ary[1];//次にシート名
  var n_of_colms = ary[2];//次に項目数(列数)
  //var folder = DriveApp.getFolderById('1jd-FvvbvCZi3BF4uC-lkVG8DhHKwlP9I');//作業フォルダは固定にする:ここにフォルダIDを記入
  var folder = DriveApp.getFolderById('*****');//作業フォルダは固定にする:ここにフォルダIDを記入
 
 
  var files = folder.getFilesByName(fileName);//作業フォルダ内にfileNameと同じ名前のスプレッドシートが存在するか？
  if (files.hasNext()) {
    SS_ID = files.next().getId();//存在する場合はIDをそのファイルに書き換え
  }
  else{
    folder.addFile(SS);//存在しない場合はルートのファイルをコピー
  }
  //DriveApp.getRootFolder().removeFile(SS);//ルートに作成したスプレッドシートは不要なので削除
 
  var ary_length = ary.length;
  var n_of_data = Math.round((ary_length - 3) / n_of_colms); //データの行数(組数)
 
  var spreadsheet = SpreadsheetApp.openById(SS_ID);//あらためてSpreadSheetを開く
  var newSheet = spreadsheet.getSheetByName(sheetName);//同じシート名があるかチェック
　if(!newSheet){
   newSheet= spreadsheet.insertSheet(sheetName,0);//シートがなければ新規作成
  }
 
  newSheet.activate();
  var columnA_Vals = newSheet.getRange('A:A').getValues();
  var LastRow = columnA_Vals.filter(String).length;  //空白を除き、入力済の行数を取得
 
  var ary2 = [];//シートに書き込むための配列
  for(var i=0;i<n_of_data;i++){
    ary2[i] = [];      //まず1次元の配列にして
    for(var j=0;j<n_of_colms;j++){  //その中にさらにデータを格納して2次元にする
      ary2[i][j]=ary[i*n_of_colms + j + 3];//ary[0]はファイル名、1はシート名、2は列数なので3を足している
    }
  }
  var newRange = newSheet.getRange(LastRow+1,1,n_of_data,n_of_colms);//入力済の次の行から、入力範囲を設定
  newRange.setValues(ary2);  //ary2の内容を一気に書き込み
 
}