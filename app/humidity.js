// Dependencies ---------------------------------------------------------------
const bleno = require('bleno');

// Characteristic -------------------------------------------------------------
class HumidityCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: '5ce4c37b-1229-48e1-a984-179945720002',
            properties: ['read', 'write', 'notify'],
            value: null
        });

        this._value = Buffer.alloc(0);
        this._updateValueCallback = null;
    }
}

HumidityCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log(`onReadRequest: value = ${this._value.toString('ascii')}`);
    callback(this.RESULT_SUCCESS, this._value);
};

HumidityCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this._value = data;
    console.log(`onWriteRequest: value = ${this._value.toString('ascii')}`);

    if (this._updateValueCallback) {
        console.log('onWriteRequest: notifying');
        this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
};

HumidityCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
    console.log('onSubscribe');
    this._updateValueCallback = updateValueCallback;
};

HumidityCharacteristic.prototype.onUnsubscribe = function () {
    console.log('onUnsubscribe');
    this._updateValueCallback = null;
};

// Service -------------------------------------------------------------------
let humidityService = new bleno.PrimaryService({
    uuid: '5ce4c37b-1229-48e1-a984-179945720001',
    characteristics: [
        new HumidityCharacteristic()
    ]
});

humidityService.name = 'HumidityService';

// Exports --------------------------------------------------------------------
module.exports = humidityService;
