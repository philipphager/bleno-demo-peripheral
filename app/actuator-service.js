// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      winston = require('winston');

// Constants ------------------------------------------------------------------
const ACTUATOR_SERVICE = 'ed00',
      STATUS_CHARACTERISTIC = 'ed01';

// Characteristic -------------------------------------------------------------
class ActuatorCharacteristic extends bleno.Characteristic {
    constructor(uuid) {
        super({
            uuid: uuid,
            properties: ['read', 'write'],
            value: null
        });

        this._uuid = uuid;
        this._value = Buffer.alloc(2);
    }

    onReadRequest(offset, callback) {
        winston.info(`ActuatorCharacteristic ${this._uuid}: onRead`, {
            value: this._value.readUInt16LE()
        });

        callback(this.RESULT_SUCCESS, this._value);
    }

     onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;

        winston.info(`ActuatorCharacteristic ${this._uuid}: onWrite`, {
            value: this._value.readUInt16LE()
        });

        callback(this.RESULT_SUCCESS);
    }
}

// Service --------------------------------------------------------------------
let actuatorService = new bleno.PrimaryService({
    uuid: ACTUATOR_SERVICE,
    characteristics: [
        new ActuatorCharacteristic(STATUS_CHARACTERISTIC)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = actuatorService;
