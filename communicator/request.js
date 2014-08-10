/**
 * [Doc Google API](https://developers.google.com/maps/documentation/geocoding/)
 */

var request = require("request");
var util = require("util");
var _ = require('underscore');

var CommunicationError = require('./error');
var config = require('./config.json');

const GEO_COORDS_FORMAT = '%s,%s';

/**
 * Constructor
 */
function Searcher() {
  this._initDefaultOptions();
}

/**
 * @access public
 */
Searcher.prototype.geocode = function (address, callback, options) {
  address = this._parseAddress(address);

  if (!address.length) {
    return callback(
      new CommunicationError(util.format(
        'Address parameter is mandatory. Input value is \'%s\'',
        address
      ))
    );
  }

  options = _.extend({}, (options || {}));
  options = _.extend(options, { address: address});
  this._useOptions(options);

  this._send(callback);
};

/**
 * @access public
 */
Searcher.prototype.reverseGeocode = function (lat, lng, callback, options) {
  lat = this._parseCoordinate(lat);
  lng = this._parseCoordinate(lng);

  if (!lat || !lng) {
    return callback(
      new CommunicationError(util.format(
        'Geographical coordinates are mandatory. Input values: latitude is \'%s\', longitude is \'%s\'',
        lat,
        lng
      ))
    );
  }

  options = _.extend({}, (options || {}));
  options = _.extend(options, {
    latlng: util.format(GEO_COORDS_FORMAT, lat, lng)
  });
  this._useOptions(options);

  this._send(callback);
};

/**
 * @access protected
 */
Searcher.prototype._send = function (callback) {
  try {
    request({
      uri: this._getUri(),
      qs: this._getOptions()
    }, function (error, response, body) {
      if (error) {
        return callback(error);
      } else if(response.statusCode != 200) {
        error = new CommunicationError(util.format(
          'Response status code is \'%s\'',
          response.statusCode
        ));
        callback(error);
      } else {
        callback(null, JSON.parse(body));
      }
    }).end();
  } catch (error) {
    return callback(error);
  }
};

/**
 * @access protected
 */
Searcher.prototype._getUri = function () {
  if (!this._checkUri()) {
    this._initUri();
  }

  this._checkUriWithError();

  return this.uri;
};

/**
 * @access protected
 */
Searcher.prototype._initUri = function () {
  this.uri = config['uri'];
};

/**
 * @access protected
 */
Searcher.prototype._checkUri = function () {
  return (this.uri && this.uri.length);
};

/**
 * @access protected
 */
Searcher.prototype._checkUriWithError = function () {
  if (!this._checkUri()) {
    throw new CommunicationError("Uri is not valid.")
  }
  return true;
};

/**
 * @access protected
 */
Searcher.prototype._useOptions = function (options) {
  this.options = _.extend({}, this._defaultOptions);
  _.extend(this.options, (options || {}));
};

/**
 * @access protected
 */
Searcher.prototype._initDefaultOptions = function () {
  /**
   * The 'sensor' Parameter
   * The Google Maps API previously required that you include the sensor parameter to indicate
   * whether your application used a sensor to determine the user's location.
   * This parameter is no longer required.
   */
  this._defaultOptions = _.extend(
    {}, //{ sensor: false},
    config['options'] || {}
  );
};

/**
 * @access protected
 */
Searcher.prototype._getOptions = function () {
  return this.options;
};

/**
 * @access protected
 */
Searcher.prototype._parseAddress = function (str) {
  str = _.isEmpty(str)
    ? EMPTY_ADDRESS_VALUE
    : (str).toString();

  return str;
};

/**
 * @access protected
 */
Searcher.prototype._parseCoordinate = function (crd) {
  if (crd) {
    crd = parseFloat((crd).toString().replace(',','.'));
  }
  if (!_.isNumber(crd)) {
    crd = EMPTY_COORDINATE_VALUE;
  }

  return crd;
};

module.exports = Searcher;
