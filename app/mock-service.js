// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
    Generator = require('./generator');

// Characteristic -------------------------------------------------------------
class MockCharacteristic extends bleno.Characteristic {
    constructor(intervalInSec) {
        super({
            uuid: 'ec1f',
            properties: ['read', 'write', 'notify'],
            value: null
        });

        this._generator = new Generator();
        this._value = Buffer.alloc(4);
        this._updateValueCallback = null;
        this._intervalInMillis = intervalInSec * 1000;
        this._intervalId = null;
    }
}

MockCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log(`onReadRequest: value = ${this._value.toString('ascii')}`);
    callback(this.RESULT_SUCCESS, this._value);
};

MockCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this._value = data;
    console.log(`onWriteRequest: value = ${this._value.toString('ascii')}`);

    if (this._updateValueCallback) {
        console.log('onWriteRequest: notifying');
        this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
};

MockCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
    console.log('onSubscribe');
    this._updateValueCallback = updateValueCallback;
    this._intervalId = setInterval(() => {
        let number = this._generator.getValue();
        this._value.writeFloatLE(number, 0);
        this._updateValueCallback(this._value);

        console.log(`Generate value ${number}`);
    }, this._intervalInMillis);
};

MockCharacteristic.prototype.onUnsubscribe = function () {
    console.log('onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._intervalId);
};

// Service -------------------------------------------------------------------
let mockService = new bleno.PrimaryService({
    uuid: 'ec1e',
    characteristics: [
        new MockCharacteristic(3)
    ]
});

mockService.name = 'MockService';

// Exports --------------------------------------------------------------------
module.exports = mockService;
