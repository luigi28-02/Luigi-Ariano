/*
Methods to
 access the user's location, the location
 of the restaurant and the distance
 between a user and a restaurant
 */

//Function that takes as a parameter a string
// that represents the place as an address and returns
// a point made up of longitude and latitude

function getCoordinatesFromAddress(address, callback) {
    var api_key = '9bb4052e04084f13a97c3335b7160395';
    var query = encodeURIComponent(address);
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';
    var request_url = api_url + '?' + 'key=' + api_key + '&q=' + query + '&pretty=1' + '&no_annotations=1';

    fetch(request_url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var coordinates = {
                latitude: data.results[0].geometry.lat,
                longitude: data.results[0].geometry.lng
            };
            callback(null, coordinates);
        })
        .catch(error => {
            callback('Error during fetch: ' + error.message);
        });
}
module.exports={getCoordinatesFromAddress};