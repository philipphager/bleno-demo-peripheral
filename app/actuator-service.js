// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
    winston = require('winston');

// Constants ------------------------------------------------------------------
const ACTUATOR_SERVICE = 'ec20',
    STATUS_CHARACTERISTIC = 'ec21',
    WATERING_CHARACTERISTIC = 'ec22';

// Characteristics -------------------------------------------------------------
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
                winston.info(`StatusCharacteristic ${this._uuid}: invalid status value ${this._statusRaw}`);
                break;
        }

        winston.info(`StatusCharacteristic ${this._uuid}: onWrite`, {
            value: this._statusRaw,
            status: this._status
        });

        callback(this.RESULT_SUCCESS);
    }
}

class WateringCharacteristic extends bleno.Characteristic {
    constructor(uuid, wateringDuration) {
        super({
            uuid: uuid,
            properties: ['read', 'write'],
            value: null
        });

        this._uuid = uuid;
        this._value = Buffer.alloc(4);
        this._statusRaw = 0;
        this._timeoutId = null;
        this._wateringDurationInMilli = wateringDuration * 1000;
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

        winston.info(`WateringCharacteristic ${this._uuid}: onWrite`, {
            value: this._statusRaw
        });

        if (this._statusRaw === 1) {
            this.startWatering();
        } else {
            winston.info(`WateringCharacteristic ${this._uuid}: invalid status value ${this._statusRaw}`);
            this.resetStatus();
        }

        callback(this.RESULT_SUCCESS);
    }

    startWatering() {
        winston.info(`WateringCharacteristic ${this._uuid}: Started pump for watering. ` +
            `This will take ${this._wateringDurationInMilli} ms.`);

        this._timeoutId = setTimeout(() => {
            this.stopWatering();
        }, this._wateringDurationInMilli);
    }

    stopWatering() {
        this.resetStatus();
        clearInterval(this._timeoutId);
        winston.info(`WateringCharacteristic ${this._uuid}: Stopped pump. Watering finished.`);
    }

    resetStatus() {
        this._statusRaw = 0;
        this._value = Buffer.alloc(4);
    }
}

// Service --------------------------------------------------------------------
let actuatorService = new bleno.PrimaryService({
    uuid: ACTUATOR_SERVICE,
    characteristics: [
        new StatusCharacteristic(STATUS_CHARACTERISTIC),
        new WateringCharacteristic(WATERING_CHARACTERISTIC, 10)
    ]
});

// Exports --------------------------------------------------------------------
module.exports = actuatorService;
