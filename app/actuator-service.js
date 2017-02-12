// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
    winston = require('winston');

// Constants ------------------------------------------------------------------
const ACTUATOR_SERVICE = 'ed00',
    STATUS_CHARACTERISTIC = 'ed01';

// Characteristic -------------------------------------------------------------
class StatusCharacteristic extends bleno.Characteristic {
    constructor(uuid) {
        super({
            uuid: uuid,
            properties: ['read', 'write'],
            value: null
        });

        this._uuid = uuid;
        this._value = Buffer.alloc(4);
        this._status = "''";
        this._statusRaw = -1;
    }

    onReadRequest(offset, callback) {
        winston.info(`ActuatorCharacteristic ${this._uuid}: onRead`, {
            value: this._value.readInt8()
        });

        callback(this.RESULT_SUCCESS, this._value);
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this._value = data;
        this._statusRaw = data.readInt8();

        switch (this._statusRaw) {
            case 0:
                this._status = "'=('";
                break;
            case 1:
                this._status = "'=|'";
                break;
            case 2:
                this._status = "'=)'";
                break;
            default:
                winston.info(`StatusCharacteristic invalid status value ${this._statusRaw}`);
                break;
        }

        winston.info(`StatusCharacteristic ${this._uuid}: onWrite`, {
            value: this._statusRaw,
            status: this._status
        });

        callback(this.RESULT_SUCCESS);
    }
}

// Service --------------------------------------------------------------------
let actuatorService = new bleno.PrimaryService({
    uuid: ACTUATOR_SERVICE,
    characteristics: [
        new StatusCharacteristic(STATUS_CHARACTERISTIC)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = actuatorService;
