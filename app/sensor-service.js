// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      Generator = require('./generator'),
      winston = require('winston');

// Constants ------------------------------------------------------------------
const SENSOR_SERVICE = 'ec10',
      SOIL_MOISTURE_CHARACTERISTIC = 'ec11',
      BRIGHTNESS_CHARACTERISTIC = 'ec12',
      WATER_LEVEL_CHARACTERISTIC = 'ec13',
      TEMPERATURE_CHARACTERISTIC = 'ec14',
      HUMIDITY_CHARACTERISTIC = 'ec15';

// Characteristic -------------------------------------------------------------
class SensorCharacteristic extends bleno.Characteristic {
    constructor(uuid, secInterval) {
        super({
            uuid: uuid,
            properties: ['read', 'write', 'notify'],
            value: null
        });

        this._generator = new Generator();
        this._value = Buffer.alloc(4);
        this._uuid = uuid;
        this._updateValueCallback = null;
        this._intervalInMillis = secInterval * 1000;
        this._intervalId = null;
    }

    onReadRequest(offset, callback) {
        winston.info(`SensorCharacteristic ${super.uuid}: onRead`, {
            value: this._value.readUInt16LE()
        });

        callback(this.RESULT_SUCCESS, this._value);
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;

        winston.info(`SensorCharacteristic ${this._uuid}: onWrite`, {
            value: this._value.readUInt16LE()
        });

        if (this._updateValueCallback) {
            this._updateValueCallback(this._value);
        }

        callback(this.RESULT_SUCCESS);
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        winston.info(`SensorCharacteristic ${this._uuid}: onSubscribe`);

        this._updateValueCallback = updateValueCallback;
        this._intervalId = setInterval(() => {
            let number = this._generator.getValue();
            this._value.writeUInt16LE(number);
            this._updateValueCallback(this._value);

            winston.debug(`SensorCharacteristic ${this._uuid}: notify`, {
                value: this._value.readUInt16LE()
            });

        }, this._intervalInMillis);
    }

    onUnsubscribe() {
        winston.info(`SensorCharacteristic ${this._uuid}: onUnsubscribe`);

        this._updateValueCallback = null;
        clearInterval(this._intervalId);
    }
}

// Service --------------------------------------------------------------------
let sensorService = new bleno.PrimaryService({
    uuid: SENSOR_SERVICE,
    characteristics: [
        new SensorCharacteristic(SOIL_MOISTURE_CHARACTERISTIC, 10),
        new SensorCharacteristic(BRIGHTNESS_CHARACTERISTIC, 20),
        new SensorCharacteristic(WATER_LEVEL_CHARACTERISTIC, 25),
        new SensorCharacteristic(TEMPERATURE_CHARACTERISTIC, 15),
        new SensorCharacteristic(HUMIDITY_CHARACTERISTIC, 30)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = sensorService;
