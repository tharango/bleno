var bleno = require('../..');

var BlenoPrimaryService = bleno.PrimaryService;

var VerifierCharacteristic = require('./characteristic');

console.log('********** Varifier Test! **************');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Verifier', ['aaaaaaaa-BBDD-EEAA-CCDD-a0421918113a']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'AB1E',
        characteristics: [
          new VerifierCharacteristic()
        ]
      })
    ]);
  }
});
