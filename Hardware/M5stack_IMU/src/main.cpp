#define M5STACK_MPU6886

#include <M5Stack.h>
#include <WiFiClientSecure.h>
#include <utility/MahonyAHRS.h>

/*送信関係の変数*/
const char* ssid     = "*******";   // your network SSID (name of wifi network)
const char* password = "*******"; 

const char* host = "script.google.com";
String exec_url = "https://script.google.com/macros/s/********";

WiFiClientSecure client;
String values;  //送信するデータ
 
String postValues(String values_to_post);
void connectingWiFi();
void LcdInit();

/*IMU関連*/
//IMU関連の変数
float accX = 0.0F;
float accY = 0.0F;
float accZ = 0.0F;

float XY_acc = 0.0F;//XY方向の加速度



void setup() {
  // put your setup code here, to run once:
  M5.begin();
  LcdInit();
  M5.Lcd.print("Send data to Google Spreadsheet\n");
  delay(1000);
  client.setInsecure();
  connectingWiFi();
  values = "20211025,data,2"; //ファイル名、シート名、データ列数、
  values += "accZ,XY_acc";     //以後データ本体
  String response = postValues(values);
}

void loop() {
  // put your main code here, to run repeatedly:
  M5.update();
  M5.Lcd.print("MainLoop\n");
  //LcdInit();
  M5.IMU.getAccelData(&accX,&accY,&accZ); //加速度の取得
  XY_acc = sqrt((accX * accX) + (accY * accY));
  values = "20211025,data,2," + accZ + "," + XY_acc + ",";    //以後データ本体
  String response = postValues(values);
  //LcdInit();
  M5.Lcd.print("Response : ");
  M5.Lcd.println(response);
  
}

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