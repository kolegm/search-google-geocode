/**
 * [Doc Google API](https://developers.google.com/maps/documentation/geocoding)
 * 
 * 1. Status Codes
 * 
 * The "status" field within the Geocoding response object contains the status of the request, and may contain debugging information to help you track down why geocoding is not working. The "status" field may contain the following values:
 *    "OK" indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
 *    "ZERO_RESULTS" indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
 *    "OVER_QUERY_LIMIT" indicates that you are over your quota.
 *    "REQUEST_DENIED" indicates that your request was denied.
 *    "INVALID_REQUEST" generally indicates that the query (address, components or latlng) is missing.
 *    "UNKNOWN_ERROR" indicates that the request could not be processed due to a server error. The request may succeed if you try again.
 * 
 * 2. Reverse Geocoding Status Codes
 *
 * The "status" field within the Geocoding response object contains the status of the request, and may contain debugging information to help you track down why reverse geocoding is not working. The "status" field may contain the following values:
 *    "OK" indicates that no errors occurred and at least one address was returned.
 *    "ZERO_RESULTS" indicates that the reverse geocoding was successful but returned no results. This may occur if the geocoder was passed a latlng in a remote location.
 *    "OVER_QUERY_LIMIT" indicates that you are over your quota.
 *    "REQUEST_DENIED" indicates that the request was denied. Possibly because the request includes a result_type or location_type parameter but does not include an API key or client ID.
 *    "INVALID_REQUEST" generally indicates one of the following:
 *      - The query (address, components or latlng) is missing.
 *      - An invalid result_type or location_type was given.
 *    "UNKNOWN_ERROR" indicates that the request could not be processed due to a server error. The request may succeed if you try again.
 */

var util = require('util');
var EventEmmitter = require('events').EventEmitter;

var parser;

function Parser() {}

util.inherits(Parser, EventEmmitter);

parser = new Parser();

parser.on('parse_error', function (error) {
  switch (error.code) {
    case 'ENOTFOUND':
      error.message = 'Connection refused';
      break;
  }
  return error;
});

parser.on('parse_data', function (data) {
  // @todo: check status, transform result to your format
  return data;
});

module.exports = parser;
