const rp = require('request-promise-native')
const Promise = require('promise')
var config = require('config/config.json');
 
const DEFAULT_PARAMS = {
 key: config.Gkey,
 type: 'restaurant'
}
 
const API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
 
//Class used to make all connections to Google Places API.

class GooglePlacesAdapter {

    getRestaurants(location, radius, foodwords) {
        let options = {
            uri: `${API_URL}query=${foodwords}&location=${location.lat},${location.lng}&radius=${radius}&type=${DEFAULT_PARAMS.type}&key=${DEFAULT_PARAMS.key}`,
            //&location=43.6426,-79.3871&radius=1000&type=restaurant&key=AIzaSyCqd6GD5CClmBDrV9ANpDeIHBJ5qK0fHjU
            json: true
        }

        return rp(options)
    }


 constructor (config = {}) {
   this.config = config
 }
}
 
module.exports = GooglePlacesAdapter
 
