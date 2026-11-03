#include "Adafruit_seesaw.h"

Adafruit_seesaw ss;

void setup() {
  Serial.begin(115200);

  Serial.println("seesaw Soil Sensor example!");
  
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    while(1) delay(1);
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }
}

void loop() {
  float tempC = ss.getTemp();
  uint16_t capread = ss.touchRead(0);

  //Serial.print("Temperature: "); 
  Serial.println(tempC);
  //Serial.println("*C");
  //Serial.print("Capacitive: "); Serial.println(capread);
  delay(100);

  if(tempC>30.0){
    tone(8,440);
  }
  else{
    noTone(8);
  }
}
