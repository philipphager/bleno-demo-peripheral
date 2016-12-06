// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      Generator = require('./generator');

// Constants ------------------------------------------------------------------
const ENV_SENSING_MEASUREMENT = '290c',
      SENSOR_SERVICE = 'ec1e', 
      SENSOR_CHARACTERISTIC = 'ec1f';

// Characteristic -------------------------------------------------------------
class MockCharacteristic extends bleno.Characteristic {
    constructor(secInterval) {
        super({
            uuid: SENSOR_CHARACTERISTIC,
            properties: ['read', 'write', 'notify'],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: ENV_SENSING_MEASUREMENT
                }),
                new bleno.Descriptor({
                    uuid: '2901',
                    value: 'MockSensor'
                })
            ]
        });

        this._generator = new Generator();
        this._value = Buffer.alloc(4);
        this._updateValueCallback = null;
        this._intervalInMillis = secInterval * 1000;
        this._intervalId = null;
    }

    onReadRequest(offset, callback) {
        console.log(`onReadRequest: value = ${this._value.toString('ascii')}`);
        callback(this.RESULT_SUCCESS, this._value);
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;
        console.log(`onWriteRequest: value = ${this._value.toString('ascii')}`);

        if (this._updateValueCallback) {
            console.log('onWriteRequest: notifying');
            this._updateValueCallback(this._value);
        }

        callback(this.RESULT_SUCCESS);
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log('onSubscribe');
        this._updateValueCallback = updateValueCallback;
        this._intervalId = setInterval(() => {
            let number = this._generator.getValue();
            this._value.write(number);
            this._updateValueCallback(this._value);

            console.log(`Generate value ${number}`);
        }, this._intervalInMillis);
    }

    onUnsubscribe() {
        console.log('onUnsubscribe');
        this._updateValueCallback = null;
        clearInterval(this._intervalId);
    }
}

// Service --------------------------------------------------------------------
let mockService = new bleno.PrimaryService({
    uuid: SENSOR_SERVICE,
    characteristics: [
        new MockCharacteristic(3)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = mockService;
