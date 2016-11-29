// Dependencies ---------------------------------------------------------------
const bleno = require('bleno');

// Characteristics ------------------------------------------------------------
class InfoCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: '5ce4c37b-1229-48e1-a984-179945710002',
            properties: ['read'],
            value: null
        });

        this._value = Buffer.from('debug-device-id', 'ascii');
    }
}

InfoCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log(`onReadRequest: value = ${this._value.toString('ascii')}`);
    callback(this.RESULT_SUCCESS, this._value);
};

// Service -------------------------------------------------------------------
let infoService = new bleno.PrimaryService({
    uuid: '5ce4c37b-1229-48e1-a984-179945710001',
    characteristics: [
        new InfoCharacteristic()
    ]
});

// Exports --------------------------------------------------------------------
module.exports = infoService;
