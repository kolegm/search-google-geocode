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

const OK = 'OK';
const ZERO_RESULTS = 'ZERO_RESULTS';
const OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT';
const REQUEST_DENIED = 'REQUEST_DENIED';
const INVALID_REQUEST = 'INVALID_REQUEST';
const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

var util = require('util');
var _ = require('underscore');

module.exports.parseError = function (error) {
  if (error && _.isObject(error)) {
    switch (error.code) {
      case 'ENOTFOUND':
        error.message = 'Connection refused.';
        break;
    }
  }
  return error;
};

module.exports.parseData = function (data) {
  var result = {};
  if (_.isObject(data)) {
    switch (data.status) {
      case OK:
        result = parseResults(data.results);
        break;
      case ZERO_RESULTS:
      case OVER_QUERY_LIMIT:
      case REQUEST_DENIED:
      case INVALID_REQUEST:
      case UNKNOWN_ERROR:
      default:
    }
  }
  return result;
};

function parseResults (result) {
  var data = [];
  if (_.isArray(result)) {
    _.each(result, function (info) {
      //console.log(info.formatted_address);
      //console.log(info.types);
      //console.log(util.inspect(info));
      data.push(format(info));
    });
  }
  return data;
}

function format (result) {
  var country = null;
  var countryCode = null;
  var city = null;
  var state = null;
  var stateCode = null;
  var zipcode = null;
  var streetName = null;
  var streetNumber = null;
  for (var i = 0; i < result.address_components.length; i++) {
  // Country
  if (result.address_components[i].types.indexOf('country') >= 0) {
  country = result.address_components[i].long_name;
  }
  if (result.address_components[i].types.indexOf('country') >= 0) {
  countryCode = result.address_components[i].short_name;
  }
  // State
  if (result.address_components[i].types.indexOf('administrative_area_level_1') >= 0) {
  state = result.address_components[i].long_name;
  }
  if (result.address_components[i].types.indexOf('administrative_area_level_1') >= 0) {
  stateCode = result.address_components[i].short_name;
  }
  // City
  if (result.address_components[i].types.indexOf('locality') >= 0) {
  city = result.address_components[i].long_name;
  }
  // Adress
  if (result.address_components[i].types.indexOf('postal_code') >= 0) {
  zipcode = result.address_components[i].long_name;
  }
  if (result.address_components[i].types.indexOf('route') >= 0) {
  streetName = result.address_components[i].long_name;
  }
  if (result.address_components[i].types.indexOf('street_number') >= 0) {
  streetNumber = result.address_components[i].long_name;
  }
  }
  return {
  'latitude' : result.geometry.location.lat,
  'longitude' : result.geometry.location.lng,
  'country' : country,
  'city' : city,
  'state' : state,
  'stateCode' : stateCode,
  'zipcode' : zipcode,
  'streetName': streetName,
  'streetNumber' : streetNumber,
  'countryCode' : countryCode
  };
}
