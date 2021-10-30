# Health Chair（ヘルスチェアー）

![IMAGE ALT TEXT HERE](https://cdn.discordapp.com/attachments/889072819584008228/903646494647787550/aac43b34386cfe67.jpg)

<h3 style="color:#ff0000">ヘルス×TECH</h3>

## 製品概要
### 背景(製品開発のきっかけ、課題等）
COVID-19後のリモートワークの推奨に伴い、近年、人々のデスクワークによる作業時間増加しています。しかしながら、長時間の着席は健康に害を与えると言われているため、デスクワークでの作業時間を可視化することで長時間の着席を避け、適度な休憩を促すシステムを開発しました。

### 製品説明（具体的な製品の説明）
<img src="https://user-images.githubusercontent.com/38782966/139522775-97a3f5ba-39bc-44f8-979b-14b68d69d9bc.JPG" width="320px">  

https://user-images.githubusercontent.com/54675248/139527549-67bbaed0-d1a5-46e6-adcf-5a5dbde73ffa.mov

椅子に取り付けられたセンサから利用者のデスクワーク状況を通知するLINEBotを作成しました。 椅子に取り付けられた9軸センサや圧力センサから得られるデータを元に、利用者が一日にどれぐらい椅子に座っているか、デスクワークに集中しているかを可視化し、LINEBotで利用者に通知することで、適度な休憩を促すようにしました。

### 特長
#### 特長1　9軸センサで利用者の集中力を検知し、その日の集中力をLINEBotに送信されたグラフから知ることができます。

#### 特長2　圧力センサで利用者の着席時間を計測し、その日の着席時間をLINEBotに送信されたグラフから知ることができます。
<img src="https://user-images.githubusercontent.com/38782966/139522488-fcbb11b6-5612-4111-a9c1-b8aa62745c6f.jpg" width="320px">  
青色：着席時間  

赤色：椅子の動き（椅子の移動、回転）から判定した集中力

#### 特長3　長時間着席していた場合、LINEBotにて適度な休憩を促します。　　

### 解決出来ること
* 着席時間や利用者の集中力をLINEBotで通知することにより、利用者のデスクワーク環境の改善のきっかけを作ることができる。

### 今後の展望
* 重心を検出することで、姿勢の推定を行えるようにしたい．
* 座っている時間を記録し，M5Stackに表示させる

### 注力したこと（こだわり等）
* 椅子の加速度から集中力を測定するための閾値の調整

## 開発技術
![IMAGE ALT TEXT HERE](https://media.discordapp.net/attachments/889072819584008226/903834763591307394/3bbf631aca985629.JPG)
### 活用した技術
#### API・データ
* M5Stackから取得されるx・y軸加速度値
* 圧力センサによる着席状況値(0，1)

#### フレームワーク・ライブラリ・モジュール
* GoogleAppsScrip(GAS)
* LINEbot

#### デバイス
* M5stack(9軸センサ) 
* 圧力センサ(FSR)

### 独自技術
#### ハッカソンで開発した独自機能・技術
* M5stackで得られたセンサーの値を、スプレッドへ書き込むGAS、Arduinoのプログラム
* スプレッドに保存されたセンサーの値から、グラフ画像を作成するGASプログラム
* LINE上での呼び出しを元に、作成したグラフ画像及びテキストを出力するプログラム
* 長時間着席が認められる場合、音声を出力するプログラム
