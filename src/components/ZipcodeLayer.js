import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import axios from 'axios';

// <GeoJSON /> doesn't work well with our geojson file
const ZipcodeLayer = () => {
  const map = useMap();

  const setFeatureStyle = () => ({
      fillColor: 'lightblue',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    });

    function onEachFeature(feature, layer) {
      let popupContent = 'You clicked on:<br />';
      if (feature.properties) {
        popupContent += `${feature.properties['PO_NAME']}, ${feature.properties['STATE']} ${feature.properties['postalCode']}`;
      }
      layer.bindPopup(popupContent);
    
      /*
      layer.on('click', () => {
        const lat = parseFloat(feature.properties.latitude);
        const lng = parseFloat(feature.properties.longitude)
      
        console.log(`Panning to ${typeof lat} ${lat}, ${typeof lng} ${lng}`)
        map.setView([lat, lng], 13);
      });
      */
    }
  
    const fetchZipcodes = async () => {
      const source = axios.CancelToken.source(); 
      try {
        const {data} = await axios.get('/data/nyc-zip-code-tabulation-areas-polygons.geojson', {
            cancelToken: source.token
        });
        return data;
      } catch (err) {
        if (axios.isCancel(err)) {
            console.log(err.message);
        }
        console.log(err.message)
      }
    }

    async function addOverlay(map) {
      const geojson = await axios.get('/data/nyc-zip-code-tabulation-areas-polygons.geojson');
      L.geoJSON(geojson.data, {
        style: setFeatureStyle,
        onEachFeature: onEachFeature
      }).addTo(map);
    }

    useEffect(() => {
      addOverlay(map);
    }, [map]);

    return null;
  }
  
  export default ZipcodeLayer;