// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
      infoService = require('./info'),
      mockService = require('./mock-service');

// Config ---------------------------------------------------------------------
const PERIPHERAL_NAME = 'plant-a-lot';
const SERVICES = [infoService, mockService];

process.env['BLENO_DEVICE_NAME'] = PERIPHERAL_NAME;

// Events ---------------------------------------------------------------------
bleno.on('stateChange', (state) => {
    console.log(`State changed: ${state}`);

    if (state === 'poweredOn') {
        console.log('Start advertising');
        let serviceIds = SERVICES.map(service => service.uuid);
        bleno.startAdvertising(PERIPHERAL_NAME, serviceIds);

    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (err) => {
    console.log('Advertising started');

    if (!err) {
        bleno.setServices(SERVICES);
    } else {
        console.error(err);
    }
});
