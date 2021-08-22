import React, { useState } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import './App.css';

import TileLayer from './components/TileLayer';
import ZipcodeLayer from './components/ZipcodeLayer';
import PinLayer from './components/PinLayer';
import Filter from './components/Filter';
import boros from './data/boros.json';

function App() {
  const [filter, setFilter] = useState({
  });

  return (
    <>
      <div id="mapid">
        <MapContainer center={[40.705, -73.978]} zoom={10} zoomControl={true}>
          <TileLayer />
          <ZipcodeLayer />
          <PinLayer
            filter={filter}
          />
        </MapContainer>
      </div>
      <Filter
        boros={boros}
        filter={filter}
        setFilter={setFilter}
      />
      { /* JSON.stringify(filter, null, 1) */}
    </>
  );
}

export default App;