var util = require('util');

var communicator = require('./');

const ADDRESS = process.argv[2] || 'Kyiv, Khreschatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

var options = {
  language: LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  else console.log(util.inspect(result, {depth: 5}));
}

communicator.geocode(ADDRESS, callback, options);

communicator.reverseGeocode(LATITUDE, LONGITUDE, callback, options);
