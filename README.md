# plant-a-lot-peripheral

This is a demo bluetooth le peripheral, compatible with the [plant-a-lot-server](https://github.com/danepod/plant-a-lot-server) specification.
This repository is part of the Plant-a-lot project assignment at [Hochschule Düsseldorf](http://www.hs-duesseldorf.de/).

## Setup and usage
Install all dependencies with npm by running ```npm install```. Make sure your bluetooth adapter is turned on and run the periheral with ```npm start```.
## Service and characteristic specification
* **InfoService (uuid: ec0e)** <br>
  Service that contains descriptive attributes for identifying the device (id, name, etc.).
  * **Id Characteristic (readable, uuid: ec0f)** <br>
  Contains a 16 byte (128 bit) uuid, that is used to identify the plant peripheral.

* **SensorService (uuid: ec1e)** <br>
  Service that contains characteristics for the plant's sensor values. All characteristics should be subscribable, to be detected by the plant-a-lot server.
  * **Mock Value Characteristic (readable, subscribable, uuid: ec1f)** <br>
  Starts emitting mock values between 0.00 and 1.00 after subscribing to this characteristic.
