##google-geocoder

### General
Node.js module for geocoding and reverse geocoding.  
[**Uses service Google geocoding API.**](https://developers.google.com/maps/documentation/geocoding)

[Geocoding](https://developers.google.com/maps/documentation/geocoding/#Geocoding) is the process of matching address with geographic coordinates.  
[Reverse Geocoding](https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding) is the process of matching geographic coordinates with address.

[*Address geocoding.*](https://developers.google.com/maps/documentation/geocoding/#GeocodingRequests) Provide an address or location and receive potential Google geocodes.  
[*Reverse geocoding.*](https://developers.google.com/maps/documentation/geocoding/#reverse-example) Provide latitude and longitude coordinates and receive the known address information for that location.

[Output format like JSON](https://developers.google.com/maps/documentation/geocoding/#JSON)

[Usage Limits](https://developers.google.com/maps/documentation/geocoding/#Limits)

### Installation
>npm install search-google-geocode [-S]

### Usage example
```javascript
// initialize geocoder instance
var geocoder = require('search-google-geocode');

// request parameters
const ADDRESS = 'Kyiv, Khreshchatyk';
const LATITUDE = '50.45';
const LONGITUDE = '30.523';
const LANGUAGE = 'en';

// you can use Google options to manage result format
var options = {
  language: LANGUAGE
};

// use callback to return result from geocoding process
function callback (error, result) {
  if (error) console.log(error); // on error
  else console.log(result); // on success
}

// address geocoding
geocoder.geocode(ADDRESS, callback, options);
// reverse geocoding
geocoder.reverseGeocode(LATITUDE, LONGITUDE, callback, options);
```
