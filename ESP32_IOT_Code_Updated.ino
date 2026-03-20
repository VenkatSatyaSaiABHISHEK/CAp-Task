#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define SERVER "api.thingspeak.com"
#define PORT 80
#define API_KEY "LJJT7TDP5G1OHH9S"

#define BACKEND_SERVER "192.168.29.128"  // Your backend IP (change if needed)
#define BACKEND_PORT 8001

// WiFi
const char* ssid = "KIET1";
const char* password = "123456789";

// Ultrasonic pins
#define TRIGPIN 5
#define ECHOPIN 18

// Temperature sensor
#define ONE_WIRE_BUS 4

// Built-in LED
#define LED_PIN 2

// Tank configuration (UPDATED SPECS - 192cm × 2000L)
int tankHeight = 192;       // cm - total height
int tankCapacity = 2000;    // liters - total capacity

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);
WiFiClient client;

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(LED_PIN, HIGH);
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  tempSensor.begin();
  connectWiFi();
  
  Serial.println("========================================");
  Serial.println("Water Tank IoT System - UPDATED");
  Serial.println("Tank Height: 192 cm");
  Serial.println("Tank Capacity: 2000 liters");
  Serial.println("========================================");
}

int getDistance() {
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);

  long duration = pulseIn(ECHOPIN, HIGH, 30000);
  if (duration == 0) return -1;
  
  return duration / 58;
}

void sendToBackendAPI(int distance, float temperature) {
  if (client.connect(BACKEND_SERVER, BACKEND_PORT)) {
    Serial.println("Sending to backend API...");
    
    String jsonPayload = "{\"distance\":" + String(distance) + ",\"node_id\":\"node-1\"}";
    String url = "/api/v1/predict-activity";
    
    client.print(String("POST ") + url + " HTTP/1.1\r\n" +
                 "Host: " + String(BACKEND_SERVER) + "\r\n" +
                 "Content-Type: application/json\r\n" +
                 "Content-Length: " + String(jsonPayload.length()) + "\r\n" +
                 "Connection: close\r\n\r\n" +
                 jsonPayload);
    
    delay(1000);
    while (client.available()) {
      String line = client.readStringUntil('\n');
      Serial.println(line);
    }
    Serial.println("Backend API call complete");
  } else {
    Serial.println("Backend connection failed");
  }
  client.stop();
}

void loop() {
  int distance = getDistance();
  
  if (distance == -1) {
    Serial.println("Sensor error");
    delay(2000);
    return;
  }

  tempSensor.requestTemperatures();
  float temperature = tempSensor.getTempCByIndex(0);

  // Calculate water level
  int waterLevel = tankHeight - distance;
  if (waterLevel < 0) waterLevel = 0;
  if (waterLevel > tankHeight) waterLevel = tankHeight;

  float waterPercent = (waterLevel * 100.0) / tankHeight;
  float waterLiters = (waterLevel * tankCapacity) / tankHeight;

  String levelStatus;
  if (waterPercent > 80) levelStatus = "FULL";
  else if (waterPercent > 40) levelStatus = "MEDIUM";
  else if (waterPercent > 10) levelStatus = "LOW";
  else levelStatus = "EMPTY";

  // Print to serial
  Serial.print("Distance: "); Serial.print(distance);
  Serial.print(" cm | Temp: "); Serial.print(temperature);
  Serial.print(" C | Level: "); Serial.print(waterPercent);
  Serial.print("% | Water: "); Serial.print(waterLiters);
  Serial.print(" L | Status: "); Serial.println(levelStatus);

  // Send to ThingSpeak
  if (client.connect(SERVER, PORT)) {
    String url = "/update?api_key=" + String(API_KEY) +
                 "&field1=" + String(distance) +
                 "&field2=" + String(temperature) +
                 "&field3=" + String(waterPercent) +
                 "&field4=" + String(waterLiters);
    
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: api.thingspeak.com\r\n" +
                 "Connection: close\r\n\r\n");
    delay(1000);
    while (client.available()) client.readStringUntil('\n');
    Serial.println("ThingSpeak upload complete");
  }
  client.stop();

  // Send to backend API for activity prediction
  delay(500);
  sendToBackendAPI(distance, temperature);

  delay(20000);  // Wait 20 seconds before next reading
}
