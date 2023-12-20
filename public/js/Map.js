//import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
//import {marker} from "leaflet/src/layer";

var blueIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-blue.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var redIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var greenIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-green.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var orangeIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-orange.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var yellowIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-yellow.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var greyIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-grey.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var blackIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-black.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var violetIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-violet.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
/*
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
 */
document.addEventListener('DOMContentLoaded', function () {
// Inizializza la mappa con Leaflet
    const map = L.map('map').setView([40.847, 14.270], 15);

// Aggiungi il layer di MapTiler
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Mw2vR8V1hmWbscyVcDBs', {
        attribution: 'MapTiler © All rights reserved'
    }).addTo(map);
    // Crea un cerchio come marcatore per la posizione dell'utente
    var circleMarker = L.circleMarker([0, 0], {
        color: 'blue',  // Colore del cerchio
        fillColor: 'blue',  // Colore di riempimento del cerchio
        fillOpacity: 0.5,  // Opacità del riempimento
        radius: 10  // Raggio del cerchio
    }).addTo(map);

// Ottieni la posizione dell'utente
    map.locate({setView: true, maxZoom: 16});

// Gestisci l'evento di localizzazione quando la posizione dell'utente è stata trovata
    map.on('locationfound', function(e) {
        // Aggiorna le coordinate e il raggio del cerchio
        circleMarker.setLatLng(e.latlng);
        circleMarker.setRadius(10);  // Puoi aggiornare il raggio secondo le tue preferenze

        // Stampa le coordinate nella console
        console.log('Latitudine:', e.latlng.lat);
        console.log('Longitudine:', e.latlng.lng);
    });

    fetch('http://localhost:3000/api/getDatabaseData')
        .then(response => response.json())
        .then(databaseData => {
            // Accesso ai campi di ciascun oggetto nell'array
            databaseData.forEach(item => {
                console.log(item.address); // Accesso al campo 'name' di ciascun oggetto
                getCoordinatesFromAddress(item.address, function (error, coordinates) {
                    if (error) {
                        console.log(error);
                    } else {
                            if(item.category==='Pub'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: greenIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }else if(item.category==='Bakery'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: yellowIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }else if(item.category==='Resturant'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: redIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }else if(item.category==='Bar'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: orangeIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }else if(item.category==='Ice Cream'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: blueIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }else if(item.category==='Rotissery'){
                                let marker = L.marker([coordinates.latitude, coordinates.longitude], { icon: violetIcon });
                                marker.addTo(map).bindPopup(item.name);
                            }

                    }
                });
            });
        })
        .catch(error => {
            console.error('Errore durante la richiesta dati dal server:', error);
        });
    let legend = L.control({position: 'bottomright'});

// Aggiungi contenuto HTML alla legenda
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'legend');
        // Aggiungi il contenuto HTML per la legenda (es. testo, simboli, colori)
        div.innerHTML = '<h4>Legend</h4>' +
            '<div class="a bar"><p>Resturant</p></div>' +
            '<div class="a icecream"><p>Bar</p></div>' +
            '<div class="a icecream"><p>Pub</p></div>' +
            '<div class="a icecream"><p>Bakery</p></div>' +
            '<div class="a icecream"><p>Rotissery</p></div>' +
            '<div class="a bakery"><p>Ice Cream</p></div>';
        return div;
    };

// Aggiungi la legenda alla mappa
    legend.addTo(map);

    const apiKey = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=xeq9UuTjj3UbFzHtGvmO';
});
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