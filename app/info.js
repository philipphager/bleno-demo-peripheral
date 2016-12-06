// Dependencies ---------------------------------------------------------------
const bleno = require('bleno');

// Characteristics ------------------------------------------------------------
class InfoCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: 'ec0f',
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
    uuid: 'ec0e',
    characteristics: [
        new InfoCharacteristic()
    ]
});

// Exports --------------------------------------------------------------------
module.exports = infoService;