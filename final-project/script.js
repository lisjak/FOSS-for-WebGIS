const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');

// ============ Set Map ============
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=Qx8CiAhWm4RayySUrlIv',
    center: [20.9962, 52.24186],
    zoom: 14,
    pitch: 45,
    bearing: -50,
    hash: true
});


// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());


map.on('load', () => {
    // Add 3d buildings and remove label layers to enhance the map
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            // remove text labels
            map.removeLayer(layers[i].id);
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'paint': {
            // 'fill-extrusion-color': 'orange',
            // 'fill-extrusion-height': 200,
            'fill-extrusion-opacity': 1
        }
    })
})

// ============ Control Panel ============
map.on('load', function() {
    const targets = {
        warsawGhettoArea: "Warsaw Ghetto Area",
        ghettoMap: "Historical Map",
        warsawGhettoPointsGeojson: "Ghetto Locations",
        warsawHousingPointsGeojson: "Contemporary Luxury Housing"

        // water: "Water",
        // building: "Building",
        // airport: "Airport",
        // poi: "Pois",
    };
    const options = {
        title: "Controls",
        showDefault: true,
        showCheckbox: true,
        onlyRendered: false,
        reverseOrder: true
    };
    map.addControl(new MaplibreLegendControl.MaplibreLegendControl(targets, options), "bottom-right");
});


// ============ Warsaw Ghetto Line ============
console.log('hi1')


map.once('load', main);

async function main() {
    let warsawGhettoGeojson = await axios('./data/warsaw-ghetto-bounds.geojson');
    map.addSource('warsaw-ghetto-src', {
        'type': 'geojson',
        'data': warsawGhettoGeojson.data
    });


    map.addLayer({
        'id': 'warsawGhettoArea',
        'type': 'line',
        'source': 'warsaw-ghetto-src',
        'layout': {
            'line-join': 'miter',
            'line-cap': 'square'
        },
        'paint': {
            'line-color': 'red',
            'line-width': 8
        }
    });

    console.log('warsawGhettoArea hit');

    // }

    // ============ Warsaw Ghetto Points ============

    let warsawGhettoPointsGeojson = await axios('./data/warsaw-ghetto-points.geojson');
    map.addSource('wg-points-src', {
        'type': 'geojson',
        'data': warsawGhettoPointsGeojson.data
    });

    //console log to see the features names
    console.log('data', warsawGhettoPointsGeojson);

    map.addLayer({
        'id': 'warsawGhettoPointsGeojson',
        'type': 'circle',
        'source': 'wg-points-src',
        'layout': {},
        'paint': {
            'circle-color': 'red',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'black'
        }
    });

    addEvents();

    function addEvents() {

        const popup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: false
        });

        map.on('mouseenter', 'warsawGhettoPointsGeojson', (e) => {

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.NAME;
            const address = e.features[0].properties.ADDRESS;
            const description = e.features[0].properties.DESCRIPTION;
            const imageThen = e.features[0].properties.IMAGE_THEN;
            const sourceThen = e.features[0].properties.SOURCE_THEN;
            const imageNow = e.features[0].properties.IMAGE_NOW;
            const sourceNow = e.features[0].properties.SOURCE_NOW;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            //this is what will display in the popup
            //can wrap setHTML in div for further styling
            popup.setLngLat(coordinates).setHTML(
                `
            <div class="popup-style">
            <h3>${name}</h3><br>
            <img src=" ${imageThen}" width="330px"><br>
            <b>${address}</b><br>
            ${description}<br> <a href="${imageThen}" target="_blank" rel="noopener noreferrer">Full-size image</a> |
            <a href="${sourceThen}">Source</a><br>
            </div>
            `
            ).addTo(map).setMaxWidth("350px");
        });

        console.log('warsawGhettoPoints hit');
    }


    // ============ Housing Points ============

    let warsawHousingPointsGeojson = await axios('./data/warsaw-luxury-housing.geojson');
    map.addSource('housing-src', {
        'type': 'geojson',
        'data': warsawHousingPointsGeojson.data
    });

    //console log to see the features names
    console.log('data', warsawHousingPointsGeojson);

    map.addLayer({
        'id': 'warsawHousingPointsGeojson',
        'type': 'circle',
        'source': 'housing-src',
        'layout': {},
        'paint': {
            'circle-color': 'white',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'red'
        }
    });

    addEvents2();

    function addEvents2() {

        const popup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: false
        });

        map.on('mouseenter', 'warsawHousingPointsGeojson', (e) => {

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.NAME;
            const rent = e.features[0].properties.RENT;
            const formatRent = rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            function numberWithCommas(x) {}
            const link = e.features[0].properties.LINK;
            const aboveMinWage = (rent / 3490).toFixed(2);


            // const rentAbove = e.features[0].properties.RENT_ABOVE;
            // const address = e.features[0].properties.ADDRESS;
            // const description = e.features[0].properties.DESCRIPTION;
            // const imageThen = e.features[0].properties.IMAGE_THEN;
            // const sourceThen = e.features[0].properties.SOURCE_THEN;
            // const imageNow = e.features[0].properties.IMAGE_NOW;
            // const sourceNow = e.features[0].properties.SOURCE_NOW;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            //this is what will display in the popup
            //can wrap setHTML in div for further styling
            popup.setLngLat(coordinates).setHTML(
                `
            <div class="popup-style">
            <b><a href="${link}">${name}</b></a> <br>
            ${formatRent} zł./month <br>
            <b>${aboveMinWage} times above monthly minimum wage</b>
            </div>
            `
            ).addTo(map).setMaxWidth("250px");
        });

        console.log('warsawHousingPoints hit');
    }


    // ============ Historical Map ============

    let historicalMap = await axios('./data/map.jpg');

    map.addSource('historical-map', {
        'type': 'image',
        "url": "./data/map.jpg",
        'coordinates': [

            [20.96392931529593,
                52.252603548285435
            ],
            [21.011214368336283,
                52.260769322394026
            ],
            [21.02097532160684,
                52.240510113229305
            ],
            [20.971634180701642,
                52.229758258335835
            ]

        ]
    });


    map.addLayer({
        'id': 'ghettoMap',
        'source': 'historical-map',
        'type': 'raster',
        'paint': {
            'raster-opacity': 0.5,
        }
    });

    console.log('historical map hit')

    // ============ Layer Slider ============
    slider.addEventListener('input', (e) => {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty(
            'ghettoMap',
            'raster-opacity',
            parseInt(e.target.value, 10) / 100
        );
    });




}

// }