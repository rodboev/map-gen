import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-geosearch/dist/geosearch.css';

import './App.css';

import SearchField from './components/SearchField';
import TileLayer from './components/TileLayer';
import ZipcodeLayer from './components/ZipcodeLayer';

const apiKey = 'pk.eyJ1Ijoicm9kYm9ldiIsImEiOiJja3NncXVnMzgxbXVwMnNvbTdwMTNsdzI0In0.6n8Lu9s1o4JwyPJmMcHsNg';

function App() {
  return (
    <div id="mapid">
      <MapContainer center={[40.705, -73.978]} zoom={10}>
        <TileLayer apiKey={apiKey} />
        <ZipcodeLayer />
        <SearchField apiKey={apiKey} />
      </MapContainer>
    </div>
  );
}

export default App
