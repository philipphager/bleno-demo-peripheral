// app/characteristic.js
var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var HelloWorldCharacteristic = function() {
  HelloWorldCharacteristic.super_.call(this, {
    uuid: 'ec0e',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(HelloWorldCharacteristic, BlenoCharacteristic);

HelloWorldCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

HelloWorldCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

HelloWorldCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

HelloWorldCharacteristic.prototype.onUnsubscribe = function() {
  console.log('onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = HelloWorldCharacteristic;