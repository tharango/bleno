var util = require('util');

//var bleno = require('@bandonware/');
//var bleno = require('./');
var bleno = require('./..');
const crypto = require('crypto');


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var BlenoCharacteristic = bleno.Characteristic;

var serviceUuids = ['c11e71f7-80cd-4a72-aa2d-a0421918113a'];
var serviceUuid = 'c11e71f7-80cd-4a72-aa2d-a0421918113a';
var claimRequestUuid = '6cbbf84b-fc1c-4f2c-ace8-cb89e33e76f2';
var receiptUuid = 'aad12fdf-7503-4d47-825c-92300afc30e0';
var consentMessageUuid ='c4fd3eb0-302c-11eb-adc1-0242ac120002';


bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ec00',
        characteristics: [
          new VerifierCharacteristic()
        ]
      })
    ]);
  }
});

var VerifierCharacteristic = function() {
  VerifierCharacteristic.super_.call(this, {
    uuid: receiptUuid,
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(VerifierCharacteristic, BlenoCharacteristic);

VerifierCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('VerifierCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

VerifierCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('VerifierCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('VerifierCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

VerifierCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('VerifierCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

VerifierCharacteristic.prototype.onUnsubscribe = function() {
  console.log('VerifierCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
