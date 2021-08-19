import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';
import axios from 'axios';
import { MapContainer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-geosearch/dist/geosearch.css';

import './App.css';

import SearchField from './components/SearchField'
import TileLayer from './components/TileLayer'
import TopoJSON from './components/TopoJSON'
import ZipcodeLayer from './components/ZipcodeLayer'

const apiKey = 'pk.eyJ1Ijoicm9kYm9ldiIsImEiOiJja3NncXVnMzgxbXVwMnNvbTdwMTNsdzI0In0.6n8Lu9s1o4JwyPJmMcHsNg';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/data/nyc-zip-code-tabulation-areas-polygons.geojson');
      setData(data);
    })();
  }, [])

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
