// Dependencies ---------------------------------------------------------------
const bleno = require('bleno');

// Constants ------------------------------------------------------------------
const INFO_SERVICE = 'ec0e',
      INFO_CHARACTERISTIC = 'ec0f';

// Characteristic -------------------------------------------------------------
class InfoCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: INFO_CHARACTERISTIC,
            properties: ['read'],
            value: null
        });

        this._value = Buffer.from('debug-device-id', 'ascii');
    }

    onReadRequest(offset, callback) {
        console.log(`onReadRequest: value = ${this._value.toString('ascii')}`);
        callback(this.RESULT_SUCCESS, this._value);
    }
}

// Service --------------------------------------------------------------------
let infoService = new bleno.PrimaryService({
    uuid: INFO_SERVICE,
    characteristics: [
        new InfoCharacteristic()
    ]
});

// Exports --------------------------------------------------------------------
module.exports = infoService;
