import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const TileLayer = ({apiKey}) => {
    // Built-in <TileLayer /> doesn't properly handle zoomOffset
    const map = useMap();
    
    useEffect(() => {
      new L.TileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${apiKey}`,
        {
          maxZoom: 14,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
        }
      ).addTo(map);
    }, [map, apiKey]);
  
    return null
  }

  export default TileLayer;