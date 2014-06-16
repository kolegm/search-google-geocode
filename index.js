var util = require('util');
var _ = require('underscore');

var Searcher = require('./communicator/request');
var Parser = require('./communicator/parser');

/**
 * Wrapper - call Google geocoder and parse result
 */
function CommunicationWrapper() {}

/**
 * @access public
 */
CommunicationWrapper.prototype.geocode = function (address, callback, options) {
  callbackExtended = function (error, data) { 
    if (_.isFunction(callback)) {
      callback(error, Parser.process(data));
    }
  }
  Searcher.geocode(address, callbackExtended, options);
}

/**
 * @access public
 */
CommunicationWrapper.prototype.reverseGeocode = function (lat, lng, callback, options) {
  callbackExtended = function (error, data) { 
    if (_.isFunction(callback)) {
      callback(error, Parser.process(data));
    }
  }
  Searcher.reverseGeocode(lat, lng, callbackExtended, options);
}

module.exports = new CommunicationWrapper();
