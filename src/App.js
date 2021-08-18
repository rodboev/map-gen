import React, { useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

import axios from 'axios';
import { MapContainer, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-geosearch/dist/geosearch.css';

import './App.css';

import SearchField from './components/SearchField'

const apiKey = 'pk.eyJ1Ijoicm9kYm9ldiIsImEiOiJja3NncXVnMzgxbXVwMnNvbTdwMTNsdzI0In0.6n8Lu9s1o4JwyPJmMcHsNg';

function addTilesLayer(map) {
  new L.TileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${apiKey}`,
    {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map);
}

async function addOverlay(map) {
  const geojson = await axios.get('/data/nyc-zip-code-tabulation-areas-polygons.geojson');
  console.log(typeof geojson)
  L.geoJSON(geojson.data, {
    style: setFeatureStyle,
    onEachFeature: onEachFeature
  }).addTo(map);
}

const TileLayer = () => {
  const map = useMap();

  useEffect(() => {
    addTilesLayer(map);
    addOverlay(map);
  }, [map]);

  return null
}

function App() {
  return (
    <div id="mapid">
      <MapContainer center={[40.705, -73.978]} zoom={10}>
        <TileLayer />
          <SearchField apiKey={apiKey} />
      </MapContainer>
    </div>
  );
}

function onEachFeature(feature, layer) {
  let popupContent = 'You clicked on:<br />';
  if (feature.properties) {
    popupContent += `${feature.properties['PO_NAME']}, ${feature.properties['STATE']} ${feature.properties['postalCode']}`;
  }
  layer.bindPopup(popupContent);

  /*
  layer.on('click', () => {
    const map = useMap();
    const lat = parseFloat(feature.properties.latitude);
    const lng = parseFloat(feature.properties.longitude)

    console.log(`Panning to ${typeof lat} ${lat}, ${typeof lng} ${lng}`)
    map.setView([lat, lng], 13);
  });
  */
}

function setFeatureStyle(feature) {
	return {
		fillColor: 'lightblue',
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	}
}

export default App
