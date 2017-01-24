// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      Generator = require('./generator'),
      winston = require('winston');

// Constants ------------------------------------------------------------------
const ENV_SENSING_MEASUREMENT = '290c',
    SENSOR_SERVICE = 'ec10';

// Characteristic -------------------------------------------------------------
class MockCharacteristic extends bleno.Characteristic {
    constructor(uuid, secInterval) {
        super({
            uuid: uuid,
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
        this._uuid = uuid;
        this._updateValueCallback = null;
        this._intervalInMillis = secInterval * 1000;
        this._intervalId = null;
    }

    onReadRequest(offset, callback) {
        winston.info(`MockCharacteristic ${super.uuid}: onRead`, {
            value: this._value.readInt8()
        });

        callback(this.RESULT_SUCCESS, this._value);
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;

        winston.info(`MockCharacteristic ${this._uuid}: onWrite`, {
            value: this._value.readInt8()
        });

        if (this._updateValueCallback) {
            this._updateValueCallback(this._value);
        }

        callback(this.RESULT_SUCCESS);
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        winston.info(`MockCharacteristic ${this._uuid}: onSubscribe`);

        this._updateValueCallback = updateValueCallback;
        this._intervalId = setInterval(() => {
            let number = this._generator.getValue();
            this._value.writeInt8(number);
            this._updateValueCallback(this._value);

            winston.debug(`MockCharacteristic ${this._uuid}: notify`, {
                value: this._value.readInt8()
            });

        }, this._intervalInMillis);
    }

    onUnsubscribe() {
        winston.info(`MockCharacteristic ${this._uuid}: onUnsubscribe`);

        this._updateValueCallback = null;
        clearInterval(this._intervalId);
    }
}

// Service --------------------------------------------------------------------
let mockService = new bleno.PrimaryService({
    uuid: SENSOR_SERVICE,
    characteristics: [
        new MockCharacteristic('ec11', 3),
        new MockCharacteristic('ec12', 10),
        new MockCharacteristic('ec13', 15),
        new MockCharacteristic('ec14', 10),
        new MockCharacteristic('ec15', 30)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = mockService;
