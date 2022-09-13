var util = require('util');
var buffer = require('Buffer');

var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;
const buf = new Buffer("This is a tested value!", 'utf-8');
var VerifierCharacteristic = function() {
  VerifierCharacteristic.super_.call(this, {
    uuid: 'ECAC',
    properties: ['read'],
    value: buf
  });

  this._value = Buffer.alloc(0);
  this._updateValueCallback = buf1;
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

module.exports = VerifierCharacteristic;
