const map = L.map('mapid')
	.setView({
		lat: 40.705,
		lng: -73.978
	})
	.setZoom(10);

/*
map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);
*/

const accessToken = 'pk.eyJ1Ijoicm9kYm9ldiIsImEiOiJja3NncXVnMzgxbXVwMnNvbTdwMTNsdzI0In0.6n8Lu9s1o4JwyPJmMcHsNg';

// Use Mapbox Streets for tile layer
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11',
	tileSize: 512, // default 256
	zoomOffset: -1
	// Snap back on pan out:
	// bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
}).addTo(map);

/*
// Add a marker, e.g. for an address
L.marker([51.5, -0.09]).addTo(map)
	.bindPopup("<b>Inspection address</b><br />Inspection description").openPopup();
*/

function onEachFeature(feature, layer) {
/* Sample:
"properties": {
	"OBJECTID": 1,
	"postalCode": "11372",
	"PO_NAME": "Jackson Heights",
	"STATE": "NY",
	"borough": "Queens",
	"ST_FIPS": "36",
	"CTY_FIPS": "081",
	"BLDGpostal": 0,
	"@id": "http://nyc.pediacities.com/Resource/PostalCode/11372",
	"longitude": -73.883573184,
	"latitude": 40.751662187
}
*/
	let popupContent = 'You clicked on:<br />';
	if (feature.properties) {
		popupContent += `${feature.properties.PO_NAME}, ${feature.properties.STATE} ${feature.properties.postalCode}`;
	}
	layer.bindPopup(popupContent);

	layer.on('click', () => {
		const lat = parseFloat(feature.properties.latitude);
		const lng = parseFloat(feature.properties.longitude)
		console.log(`Panning to ${typeof lat} ${lat}, ${typeof lng} ${lng}`)
		map.setView([lat, lng], 13);
	});
}

function setFeatureColor(d) {
  return d > 100 ? '#FC4E2A' :
    d > 50 ? '#FD8D3C' :
    d > 20 ? '#FEB24C' :
    d > 10 ? '#FED976' :
    '#FFEDA0';
}

function setFeatureStyle(feature) {
	return {
		// fillColor: setFeatureColor(feature.properties.POPULATION),
		fillColor: 'lightblue',
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	}
}

fetch("data/beta_nyc-zip-code-tabulation-areas-polygons.geojson")
	.then(response => response.json())
	.then(geojsonFeature => L.geoJSON(geojsonFeature, {
		style: setFeatureStyle,
		onEachFeature: onEachFeature
	}).addTo(map));

/*
var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
	map.panTo(e.latlng)
}

map.on('click', onMapClick);
*/