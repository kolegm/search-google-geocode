/**
 * [The Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/)
 * [Geocoding Service with javascript](https://developers.google.com/maps/documentation/javascript/geocoding)
 */

/**
 * JSON response contains two root elements:
 *   "status" contains metadata on the request. See Status Codes below.
 *   "results" contains an array of geocoded address information and geometry information.
 *
 * Status Codes
 * The "status" field within the Geocoding response object contains the status of the request, and may contain debugging information to help you track down why geocoding is not working. The "status" field may contain the following values:
 *    "OK" indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
 *    "ZERO_RESULTS" indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
 *    "OVER_QUERY_LIMIT" indicates that you are over your quota.
 *    "REQUEST_DENIED" indicates that your request was denied.
 *    "INVALID_REQUEST" generally indicates that the query (address, components or latlng) is missing.
 *    "UNKNOWN_ERROR" indicates that the request could not be processed due to a server error. The request may succeed if you try again.
 *
 * Reverse Geocoding Status Codes
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
const STATUS_OK = 'OK';
const STATUS_ZERO_RESULTS = 'ZERO_RESULTS';
const STATUS_OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT';
const STATUS_REQUEST_DENIED = 'REQUEST_DENIED';
const STATUS_INVALID_REQUEST = 'INVALID_REQUEST';
const STATUS_UNKNOWN_ERROR = 'UNKNOWN_ERROR';


/**
 * The types[] array in the result indicates the address type.
 * Examples of address types include a street address, a country, or a political entity.
 * There is also a types[] array in the address_components[], indicating the type of each part of the address.
 * Examples include street number or country.
 * Addresses may have multiple types. The types may be considered 'tags'.
 * For example, many cities are tagged with the political and the locality type.
 */
const TAG_COUNTRY = 'country'; // Indicates the national political entity, and is typically the highest order type returned by the Geocoder.
const TAG_POSTAL = 'postal_code'; // Indicates a postal code as used to address postal mail within the country.
const TAG_ROUTE = 'route'; // // Indicates a named route (such as "US 101").
const TAG_INTERSECTION = 'intersection'; // Indicates a major intersection, usually of two major roads.
const TAG_STREET_ADDRESS = 'street_address'; //  Indicates a precise street address.
const TAG_COLLOQUIAL_AREA = 'colloquial_area'; // Indicates a commonly-used alternative name for the entity.

const TAG_NEIGHBORHOOD = 'neighborhood';

const TAG_PREMISE = 'premise'; // Indicates a named location, usually a building or collection of buildings with a common name
// Indicates a first-order entity below a named location, usually a singular building within a collection of buildings with a common name
const TAG_SUBPREMISE = 'subpremise';

const TAG_HOUSE_NUMBER = 'street_number'; // Indicates a precise street number. Like a house number

const TAG_ESTABLISHMENT = 'establishment'; // Indicates a place that has not yet been categorized.

/**
 * Indicates a civil entity below the country level.
 * Not all nations exhibit these administrative levels.
 */
const TAG_ADMIN_A1 = 'administrative_area_level_1'; // Within the United States, these administrative levels are states.
const TAG_ADMIN_A2 = 'administrative_area_level_2'; // Indicates a second-order civil entity below the country level.


const TAG_CITY = 'locality'; // Indicates an incorporated city or town political entity.
const TAG_SUBCITY = 'sublocality'; // Indicates a first-order civil entity below a locality.
// Each sublocality level is a civil entity. Larger numbers indicate a smaller geographic area.
const TAG_SUBCITY_L1 = 'sublocality_level_1';
const TAG_SUBCITY_L2 = 'sublocality_level_2';
const TAG_SUBCITY_L3 = 'sublocality_level_3';
const TAG_SUBCITY_L4 = 'sublocality_level_4';
const TAG_SUBCITY_L5 = 'sublocality_level_5';

// ------------------------------------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

var model = require('./model.json');

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

/**
 * Results
 * When the geocoder returns results, it places them within a (JSON) results array.
 * Even if the geocoder returns no results (such as if the address doesn't exist) it still returns an empty results array.
 */
module.exports.parseData = function (data) {
  var result = [];

  if (_.isObject(data)) {
    // check status field
    switch (data.status) {
      // if ok - parse data
      case STATUS_OK:
        result = parse(data.results);
        break;
      // else - do nothing
      case STATUS_ZERO_RESULTS:
      case STATUS_OVER_QUERY_LIMIT:
      case STATUS_REQUEST_DENIED:
      case STATUS_INVALID_REQUEST:
      case STATUS_UNKNOWN_ERROR:
      default:
    }
  }

  return result;
};

/**
 * Convert external data format to internal format
 */
function parse (externalHolder) {
  var internalHolder = [];
  var internal;

  if (_.isArray(externalHolder)) {
    _.each(externalHolder, function (external) {
      internal = convert(external);
      internalHolder.push(internal);
    });
  }
  return internalHolder;
}

function convert (external) {
  var internal = create();

  if (!_.isEmpty(external)) {
    _.each(external.address_components, function (component) {
      _.each(component.types, function (type) {
        switch (type.toLowerCase()) {
          case TAG_COUNTRY:
            internal.country = component.long_name;
            internal.countryIso = component.short_name;
            break;
          case TAG_ADMIN_A1:
            internal.state = component.long_name;
            internal.stateCode = component.short_name;
            break;
          case TAG_ADMIN_A2:
            internal.area = component.long_name;
            break;
          case TAG_CITY:
            internal.city = component.long_name;
            break;
          case TAG_SUBCITY:
            internal.subcity = component.long_name;
            break;
          case TAG_SUBCITY_L1:
            internal.subcity1 = component.long_name;
            break;
          case TAG_SUBCITY_L2:
            internal.subcity2 = component.long_name;
            break;
          case TAG_SUBCITY_L3:
            internal.subcity3 = component.long_name;
            break;
          case TAG_SUBCITY_L4:
            internal.subcity4 = component.long_name;
            break;
          case TAG_SUBCITY_L5:
            internal.subcity5 = component.long_name;
            break;
          case TAG_NEIGHBORHOOD:
            internal.neighborhood = component.long_name;
            break;
          case TAG_COLLOQUIAL_AREA:
            internal.alternative = component.long_name;
            break;
          case TAG_POSTAL:
            internal.zipcode = component.long_name;
            break;
          case TAG_ROUTE:
            internal.streetName = component.long_name;
            break;
          case TAG_INTERSECTION:
            internal.streetIntersection = component.long_name;
            break;
          case TAG_STREET_ADDRESS:
            internal.streetAddress = component.long_name;
            break;
          case TAG_HOUSE_NUMBER:
            internal.streetNumber = component.long_name;
            break;
          case TAG_PREMISE:
            internal.premise = component.long_name;
            internal.premiseCode = component.short_name;
            break;
          case TAG_SUBPREMISE:
            internal.subpremise = component.long_name;
            break;
          case TAG_ESTABLISHMENT:
            internal.establishment = component.long_name;
            internal.establishmentCode = component.short_name;
            break;
        }
      });
    });

    if (external.formatted_address) {
      internal.formatted = external.formatted_address;
    }

    if (external.geometry) {
      var geometry = external.geometry;

      if (geometry.location) {
        internal.latitude = external.geometry.location.lat;
        internal.longitude = external.geometry.location.lng;
      }

      if (geometry.viewport) {
        if (geometry.viewport.northeast) {
          var northeast = geometry.viewport.northeast;
          if (northeast.lat) {
            internal.viewport.leftTop.latitude = northeast.lat;
          }
          if (northeast.lng) {
            internal.viewport.leftTop.longitude = northeast.lng;
          }

          var southwest = geometry.viewport.southwest;
          if (southwest.lat) {
            internal.viewport.rigthBottom.latitude = southwest.lat;
          }
          if (southwest.lng) {
            internal.viewport.rigthBottom.longitude = southwest.lng;
          }
        }
      }
    }
  }
  
  return internal;
}

function create() {
  return _.extend({}, model);
}
