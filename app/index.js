// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      infoService = require('./info'),
      mockService = require('./mock-service'),
      winston = require('winston');

// Config ---------------------------------------------------------------------
const PERIPHERAL_NAME = 'plant-a-lot';
const SERVICES = [infoService, mockService];

process.env['BLENO_DEVICE_NAME'] = PERIPHERAL_NAME;

// Move to env
winston.level = 'debug';

// Events ---------------------------------------------------------------------
bleno.on('stateChange', (state) => {
    winston.info(`BluetoothAdapter: ${state}`);

    if (state === 'poweredOn') {
        let serviceIds = SERVICES.map(service => service.uuid);
        bleno.startAdvertising(PERIPHERAL_NAME, serviceIds);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (err) => {
    winston.info('BluetoothAdapter: advertising started');

    if (!err) {
        bleno.setServices(SERVICES);
    } else {
        winston.error(err);
    }
});
