# Health Chair（ヘルスチェアー）

![IMAGE ALT TEXT HERE](https://cdn.discordapp.com/attachments/889072819584008228/903646494647787550/aac43b34386cfe67.jpg)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
COVID-19後のリモートワークの推奨に伴い、近年、人々のデスクワークによる作業時間増加しています。しかしながら、長時間の着席は健康に害を与えると言われているため、デスクワークでの作業時間を可視化することで長時間の着席を避け、適度な休憩を促すシステムを開発しました。

### 製品説明（具体的な製品の説明）
椅子に取り付けられたセンサから利用者の状態を通知するLINEBotを作成します。 
椅子に取り付けられた9軸センサや圧力センサから得られるデータを元に、利用者が一日にどれぐらい椅子に座っているか、デスクワークに集中しているかをLINEBotを用いて利用者に通知し、適度な休憩を促すようにしました。

### 特長
#### 特長1　
9軸センサで利用者の落着き具合を検知し、その日の集中力をLINEBotに送信されたグラフから知ることができます。　　　
#### 
特長2　圧力センサで利用者の着席時間を計測し、その日の着席時間をLINEBotに送信されたグラフから知ることができます。  
#### 
特長3　長時間着席していた場合、LINEBotにて適度な休憩を促します。　　

### 解決出来ること
* 着席時間や利用者の集中力をLINEBotで通知することにより、利用者のデスクワーク環境の改善のきっかけを作ることができる。

### 今後の展望
*
*

### 注力したこと（こだわり等）
* 
* デバイス間の配線や椅子への設置を簡潔化するために，3Dプリンタでコンテナを作成した点．

## 開発技術
![IMAGE ALT TEXT HERE](https://media.discordapp.net/attachments/889072819584008226/903827375995879444/644522b603de71b6.JPG)
### 活用した技術
#### API・データ
* M5Stackから取得されるx・y軸加速度値，
* 

#### フレームワーク・ライブラリ・モジュール
* GoogleAppsScrip(GAS)
* LINEbot
* fusion360

#### デバイス
* M5stack(9軸センサ) 
* 圧力センサ(FSR)

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
