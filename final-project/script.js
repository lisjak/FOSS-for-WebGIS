// ============ Set Map ============
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=Qx8CiAhWm4RayySUrlIv',
    center: [20.977900, 52.241018],
    zoom: 14,
    pitch: 15,
    bearing: -50,
    hash: true
});



// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());

map.once('load', main);


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





// ============ Luxury Housing Points============
// TO DO: accrue more
// TO DO: color or size grade point according to rent?
async function main() {

    // ============ Cultural Institutions Points============
    const culturalInstitutions = await axios('https://corsproxy.org/?https://raw.githubusercontent.com/lisjak/FOSS-for-WebGIS/main/homework-3/data/cultural-institutions.geojson');

    await axios('./data');

    map.addSource('cultural-institutions', {
        'type': 'geojson',
        'data': culturalInstitutions.data
    });


    map.addLayer({
        'id': 'cultural-points',
        'source': 'cultural-institutions',
        'type': 'circle',
        'paint': {
            'circle-color': 'black',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    })
    addEvents();
    console.log('culture')


    function addEvents() {
        const popup = new maplibregl.Popup({
            closeOnClick: false,
        });


        map.on('mouseenter', 'cultural-points', (e) => {
            console.log('mouse')

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            const coordinates = e.features[0].geometry.coordinates.slice();
            const props = e.features[0].properties;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            console.log(props)
            popup.setLngLat(coordinates).setHTML(
                `
                <div class='popup-style'>
                <b>${props.NAME}</b> |
                ${props.ADDRESS}<br><br>
                ${props.DESCRIPTION}
                `
            ).addTo(map).setMaxWidth("350px");
        });
    }


    const luxuryHousing = await axios('https://corsproxy.org/?https://raw.githubusercontent.com/lisjak/FOSS-for-WebGIS/main/homework-3/data/luxury-housing.geojson');

    map.addSource('luxury-housing', {
        'type': 'geojson',
        'data': luxuryHousing.data
    });

    map.addLayer({
        'id': 'housing-points',
        'source': 'luxury-housing',
        'type': 'circle',
        'paint': {
            'circle-color': 'red',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    })
    addEvents2();
    console.log('housing')


    function addEvents2() {
        const popup2 = new maplibregl.Popup({
            closeOnClick: false,

        });


        map.on('mouseenter', 'housing-points', (e) => {
            console.log('mouse2')

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            const coordinates = e.features[0].geometry.coordinates.slice();
            const props = e.features[0].properties;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            console.log(props)
            popup2.setLngLat(coordinates).setHTML(
                `
            <div class='popup-style'>
            <b><a href="${props.LINK}">${props.NAME}</a></b> |
            ${props.ADDRESS}<br>
            <b>Highest rent:</b> ${props.RENT} / month

            <br><sub>Data collection date: ${props.DATE}</sub>

            `
            ).addTo(map);
            console.log('popup house')
        });
    }



    // ============ Greenpoint Polygon ============
    const greenpointBounds = await axios('./data/greenpoint-bounds.geojson');

    map.addSource('greenpoint-bounds', {
        'type': 'geojson',
        'data': greenpointBounds.data
    });

    map.addLayer({
        'id': 'greenpoint-polygon',
        'type': 'line',
        'source': 'greenpoint-bounds',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'red',
            'line-width': 8
        }
    })
    addEvents();
    console.log('polygon')
}