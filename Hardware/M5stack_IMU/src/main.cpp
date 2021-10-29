#define M5STACK_MPU6886 

#include <M5Stack.h>
#include <WiFiClientSecure.h>
#include <utility/MahonyAHRS.h>
#include "time.h"

//IMU関連の変数
float accX = 0.0F;
float accY = 0.0F;
float accZ = 0.0F;

float gyroX = 0.0F;
float gyroY = 0.0F;
float gyroZ = 0.0F;

float pitch = 0.0F;
float roll  = 0.0F;
float yaw   = 0.0F;

float circle_degree = 0.0F;

//ボタン関係の変数
unsigned int BtnA_Cnt;

char flag = 1.0;
char no_flag = 0.0;

bool Count_sit = false;
int Count_circle = 0;


//[追加]GyroZのデータを蓄積するための変数
float stockedGyroZs[10];
int stockCnt=0;
float adjustGyroZ=0;
int stockedGyroZLength=0;

//時刻取得関連
const char* ntpServer = "ntp.nict.jp";
const long  gmtOffset_sec = 3600 * 9;
const int   daylightOffset_sec = 0;

//****** ネットワーク関連 ******
const char* ssid     = "******";   // your network SSID (name of wifi network)
const char* password = "******";    // your network password

const char* host = "script.google.com";
String exec_url = "https://script.google.com/macros/s/AKfycbz4jOQbSnlKubco-qDjqb4UZw3MzxO1fchQvS5Djm4nONQ4iwWK/exec";
//ウェブアプリケーションのURL
 
WiFiClientSecure client;
String values;  //送信するデータ
 
String postValues(String values_to_post) {
  if (client.connect(host, 443)){
    
    M5.Lcd.println("Posting data...");
     
    client.println("POST " + exec_url + " HTTP/1.1");
    client.println("HOST: " + (String)host);
    client.println("Connection: close");
    client.println("Content-Type: text/plain");
    client.print("Content-Length: ");
    client.println(values_to_post.length());
    client.println();
    client.println(values_to_post);
    M5.Lcd.print(values_to_post);
    delay(100);
 
    while (client.available()) {
      char c = client.read();
      M5.Lcd.println(c);
    }
    client.stop();
    delay(1000);
    return "post end";
  } 
  else {
    return "ERROR";
  }
}
 
void connectingWiFi(){
 
  boolean WiFiOn;  // WiFi接続したらtrue
  int n_trial, max_trial = 10;  //WiFi接続試行回数とその上限
 
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  WiFi.begin(ssid, password);
  
  M5.Lcd.print("Connecting to WiFi");
  // attempt to connect to Wifi network:
  n_trial = 0;
  while (WiFi.status() != WL_CONNECTED && n_trial < max_trial) {
    M5.Lcd.print(".");
    // wait 1 second for re-trying
    n_trial++;
    delay(1000);
  }
  
  if (WiFi.status() == WL_CONNECTED)
    {WiFiOn = true;
    M5.Lcd.print("Connected to ");
    M5.Lcd.println(ssid);
    M5.Lcd.print("IP: ");
    M5.Lcd.println(WiFi.localIP());  }
  else
    {WiFiOn = false;
    M5.Lcd.print("WiFi connection failed");  }
  delay(1000);
}
 
void LcdInit(){
  M5.Lcd.clear(BLACK);
  M5.Lcd.setTextSize(2);
  M5.Lcd.setTextColor(WHITE, BLACK);
  M5.Lcd.setCursor(0, 0);
}

int volume = 7;

void playTone() {
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setCursor(0, 0);
  M5.Lcd.print("Volume : ");
  M5.Lcd.println(volume);
  M5.Speaker.setVolume(volume);
  M5.Speaker;
}
 
void setup() {
  // 初期化
  pinMode(2,INPUT);
  M5.begin();
  LcdInit();
  M5.Power.begin();
  M5.IMU.Init();
  M5.Lcd.print("Send data to Google Spreadsheet\n");
  delay(1000);
  client.setInsecure();

  connectingWiFi();
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

 
void loop() {
  // Buttonクラスを利用するときには必ずUpdateを呼んで状態を更新する

  M5.update();
  struct tm timeinfo;

  M5.Lcd.println("MainLoop\n");
  //LcdInit();
  M5.IMU.getGyroData(&gyroX,&gyroY,&gyroZ);
  M5.IMU.getAccelData(&accX,&accY,&accZ);

    //貯めたデータの平均値を使ってgyroZを補正する
    gyroZ-=adjustGyroZ; 
    //ここでaccelデータと補正したgyroデータを使ってpitch・roll・yawを計算する
    MahonyAHRSupdateIMU(gyroX * DEG_TO_RAD, gyroY * DEG_TO_RAD, gyroZ * DEG_TO_RAD, accX, accY, accZ, &pitch, &roll, &yaw);
  }
  circle_degree = sqrt((accX * accX) + (accY * accY));

  if(!getLocalTime(&timeinfo)){
    M5.Lcd.println("Failed to obtain time");
  }

  String dateStr = (String)(timeinfo.tm_year + 1900)
          + "/" + (String)(timeinfo.tm_mon + 1)
          + "/" + (String)timeinfo.tm_mday;
  String monthStr = (String)(timeinfo.tm_mon + 1)
          + "/" + (String)timeinfo.tm_mday;
  String timeStr = (String)timeinfo.tm_hour
          + ":" + (String)timeinfo.tm_min
          + ":" + (String)timeinfo.tm_sec;
  
  values = "******," + monthStr +","+ "4," + dateStr + "," + timeStr + "," 
            + Count_sit + "," + Count_circle + ",";
  if(digitalRead(2) == HIGH){
    Count_sit = true;//trueは着席
  }
  if(circle_degree >  0.23){
    Count_circle +=  1;
    /*M5.Speaker.tone(440, 100);
    delay(100);
    M5.Speaker.mute();
    delay(100);
    M5.Speaker.tone(440, 100);
    delay(100);
    M5.Speaker.mute();
    delay(100);
    M5.Speaker.tone(440, 100);*/
    LcdInit();
    //playTone();
  }
  if(timeinfo.tm_sec  % 59 == 0){
    String response = postValues(values);
    M5.Lcd.println(response);
    Count_sit = 0;
    Count_circle = 0;
  }
}
