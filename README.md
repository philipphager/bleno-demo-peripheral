# plant-a-lot-peripheral

This is a demo bluetooth le peripheral, compatible with the [plant-a-lot-server](https://github.com/danepod/plant-a-lot-server) specification.
This repository is part of the Plant-a-lot project assignment at [Hochschule Düsseldorf](http://www.hs-duesseldorf.de/).

## Setup and usage
Install Node.js on your system by following [this](https://nodejs.org/en/download/package-manager/).
Afterwards use npm to install all dependencies of this project by running ```npm install```. Make sure your bluetooth adapter is turned on and run the periheral with ```npm start```.
By starting the peripheral it will start advertising itself via BLE, to be discovered by the server.
## Service and characteristic specification
* **InfoService (uuid: ec00)** <br>
  Service that contains descriptive attributes for identifying the device (id, name, etc.).
  * **Id Characteristic (readable, uuid: ec01)** <br>
  Contains a 16 byte (128 bit) uuid, that is used to identify the plant peripheral.

* **SensorService (uuid: ec10)** <br>
  Service that contains characteristics for the plant's sensor values. All characteristics should be subscribable, to be detected by the plant-a-lot server.
  * **Mock Sensor Characteristics (readable, subscribable, uuid: ec10 - ec15)** <br>
  The Sensor service contains a series of characteristrics that simulate the behavior of a sensor, that is connected to a plant. 
  All mock sensors start to emmit values between 0-100 after someone describes to them. Mock-sensors can be configured with an individual uuid 
  and a time interval in which they will emmit the generated values.

* **ActuatorService (uuid: ec20)** <br>
  Service that contains mock characteristics for a peristaltic pump and an LED status screen.
  * **Mock Status Characteristic (writeable, readable, uuid: ec21)** <br>
  Simulates the current status of a plant, that can be set by the server. The value can be one of the following [0 => "bad", 1 => "neutral", 2 => "good", 3 => "none"].
  * **Mock Watering Characteristic (writeable, readable, uuid: ec22)** <br>
  Starts to simulate a pump process to water a plant after the characteristic's value is set to 1. The characteristic will automatically reset the value after pumping has been finished.
