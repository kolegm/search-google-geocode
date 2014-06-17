var util = require('util');
var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./communicator/parser');

/**
 * Wrapper - call Google geocoder and parse result
 */
function CommunicationWrapper() {}

CommunicationWrapper.prototype.extendCallback = function (callback) {
  return function (error, data) { 
    if (_.isFunction(callback)) {
      callback(error, Parser.process(data));
    }
  }
}

/**
 * @access public
 */
CommunicationWrapper.prototype.geocode = function (address, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.geocode(address, callback, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.reverseGeocode = function (lat, lng, callback, options) {
  callback = this.extendCallback(callback);
  Searcher.reverseGeocode(lat, lng, callback, options);
}

module.exports = new CommunicationWrapper();
