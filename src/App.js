import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import './App.css';

import TileLayer from './components/TileLayer';
import ZipcodeLayer from './components/ZipcodeLayer';
import Leads from './components/Leads';

function App() {
  return (
    <>
      <div id="mapid">
        <MapContainer center={[40.705, -73.978]} zoom={10} zoomControl={true}>
          <TileLayer />
          <ZipcodeLayer />
          <Leads />
        </MapContainer>
      </div>
    </>
  );
}

export default App;