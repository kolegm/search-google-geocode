/**
 * @todo use mocha test
 */
var communicator = require('./index');

const ADDRESS = 'Kyiv, Khreshchatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

var options = {
  language: LANGUAGE
};

function callback (error, result) {
  if (error) console.log(error);
  console.log(result);
}

console.log('search process');
console.log('result in language: ' + LANGUAGE);
console.log('by address: ' + ADDRESS);
console.log('by geo coords: ' + LATITUDE + ', ' + LONGITUDE);

communicator.geocode(
  ADDRESS, 
  callback,
  options
);

communicator.reverseGeocode(
  LATITUDE, 
  LONGITUDE,
  callback,
  options
);
