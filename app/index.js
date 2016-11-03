// Dependencies ---------------------------------------------------------------
const bleno = require('bleno'),
    humidityService = require('./humidity.js');

// Events ---------------------------------------------------------------------
bleno.on('stateChange', (state) => {
    console.log(`State changed: ${state}`);

    if (state === 'poweredOn') {
        console.log("Start advertising");
        bleno.startAdvertising(humidityService.name, [humidityService.uuid]);
    } else {
        bleno.stopAdvertising();
    }

});

bleno.on('advertisingStart', (err) => {
    console.log(`Advertising started`);

    if(!err) {
        bleno.setServices([humidityService]);
    } else {
        console.log(`Error: ${err}`);
    }
});
