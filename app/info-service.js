// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      winston = require('winston');

// Constants ------------------------------------------------------------------
const INFO_SERVICE = 'ec00',
      INFO_CHARACTERISTIC = 'ec01';

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
        winston.info('InfoCharacteristic: onRead', {
            value: this._value.toString('ascii')
        });

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
