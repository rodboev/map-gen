const map = L.map('mapid').setView({
	lat: 40.73,
	lng: -73.86
}, 11);

const accessToken = 'pk.eyJ1Ijoicm9kYm9ldiIsImEiOiJja3NncXVnMzgxbXVwMnNvbTdwMTNsdzI0In0.6n8Lu9s1o4JwyPJmMcHsNg';

// Use Mapbox Streets for tile layer
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11',
	tileSize: 512, // default 256
	zoomOffset: -1
}).addTo(map);

/*
// Add a marker, e.g. for an address
L.marker([51.5, -0.09]).addTo(map)
	.bindPopup("<b>Inspection address</b><br />Inspection description").openPopup();

// And a polygon, e.g. for zip codes
L.polygon([
	[51.509, -0.08],
	[51.503, -0.06],
	[51.51, -0.047]
]).addTo(map).bindPopup("Popup contents for polygon.");
*/

var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
	map.panTo(e.latlng)
}

map.on('click', onMapClick);
