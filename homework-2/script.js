// ============ Get API Key ============
const key = '7SGo3nVkTl7JQ90xmJ0i';

// ============ Set Map ============
const map = L.map('map').setView([40.72897554459544, -73.95037727614574], 15); //starting position

// ============ Set Layers ============
const mtLayer = L.maptilerLayer({
    style: "https://api.maptiler.com/maps/dataviz-dark/style.json?key=Qx8CiAhWm4RayySUrlIv",
    // geolocate: true
}).addTo(map);
L.control.maptilerGeocoding({ apiKey: key }).addTo(map);


// ============ Markers ============
// TO DO: iterative function to add markers instead of hardcoding

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    riseOnHover: true
});

let options = {
    riseOnHover: true,
};

// Nowy Dziennik Headquarters
const marker = L.marker([40.73019124396132, -73.957322], { icon: redIcon }).addTo(map);

const message = "This Polish daily newspaper once was a ubiquitous presence in Greenpoint's Polish shops, but declining circulation forced it to become just a weekly paper. The headquarters moved to New Jersey in 20. The location is also home to the historic Mechanics and Traders Bank building originally built in 1895. It sold in 2018 to a private real estate entity for 6.5 million dollars. ";

marker.bindPopup(`<b>Nowy Dziennik Headquarters</b> ${message}`);

marker.on('click', function(e) {
    map.flyTo(e.latlng, 18);
});

//Łomzynianka
const marker2 = L.marker([40.724433525691474, -73.95073624232808], { icon: redIcon }).addTo(map);

const message2 = "Opened for nearly 90 years, it was one of the highest rated and most affordable Polish restaurants in Greenpoint. Closed in 2015, the location has been converted to luxury retail space and sits empty. ";

marker2.bindPopup(`<b>Łomzynianka</b> ${message2}`);

marker2.on('click', function(e) {
    map.flyTo(e.latlng, 18);
});

//541 Leonard St
const marker3 = L.marker([40.723452970525244, -73.94991558576228], { icon: redIcon }).addTo(map);

const message3 = "Historic church serving the community converted to luxury real estate in 2013. The building sold for $2.8 million in 2021.";

marker3.bindPopup(`<b>Leonard St Pentecostal Church</b> ${message3}`);

marker3.on('click', function(e) {
    map.flyTo(e.latlng, 18);
});

//New Warsaw Bakery
const marker4 = L.marker([40.72276442915792, -73.95105735767191], { icon: redIcon }).addTo(map);

const message4 = "20-year-old community bakery. Closed in 2014. Replaced with luxury real estate development. As of 2022, units within the new development has sold for more than $2.2 million dollars.";

marker4.bindPopup(`<b>New Warsaw Bakery</b> ${message4}`);

marker4.on('click', function(e) {
    map.flyTo(e.latlng, 18);
});

//The Polish Legion of American Veterans - George Washington Post No. 3
const marker5 = L.marker([40.7233331794813, -73.94979454232808], { icon: redIcon }).addTo(map);

const message5 = "Incorporated in 1945, the establishment served both Polish and American veterans. It was converted to luxury real estate in 2014. Apartment units within the building sold for  $2.9 million in 2021.";

marker5.bindPopup(`<b>The Polish Legion of American Veterans - George Washington Post No. 3</b> ${message5}`);

marker5.on('click', function(e) {
    map.flyTo(e.latlng, 18);
});

// ============ Luxury Housing Points============
// TO DO: accrue more, add address name and rent to data
// TO DO: color grade point according to rent
// TO DO: onClick (on hover?) display name and rent
axios('./data/luxury-housing.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 6,
        fillColor: "red",
        color: "black",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    };

    L.geoJSON(resp.data, {

        pointToLayer: function(feature, latlng) {


            return L.circleMarker(latlng, geojsonMarkerOptions);
        }

    }).addTo(map).bringToFront().bindPopup(`<b>lorem</b> ipsum`);
})

// ============ Greenpoint Polygon ============
const greenpointBounds = axios('./data/greenpoint-bounds.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: { opacity: 1, color: "red", weight: 5 }
    }).addTo(map).bringToBack();

});

// ============ Geocoding Control ============
L.control
    .maptilerGeocoding({
        apiKey: key,
        class: 'geocoder',
        placeholder: 'Search an address',
        showResultsWhileTyping: true,
        types: ['address'],
        country: ['us'],
        flyTo: true,
    })
    .addTo(map, 'bottom-left');