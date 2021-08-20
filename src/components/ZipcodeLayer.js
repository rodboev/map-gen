import { useState, useEffect } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import api, { cache } from '../lib/api';

const zoomTo = 12;

const ZipcodeLayer = ({ setLocation, setZoom }) => {
  const [data, setData] = useState(null);
  const map = useMap();

  const setFeatureStyle = () => ({
    fillColor: 'lightblue',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.6
  });

  const onEachFeature = (feature, layer) => {
    let popupContent = '';
    if (feature.properties) {
      popupContent += `${feature.properties['PO_NAME']}, ${feature.properties['STATE']} ${feature.properties['postalCode']}`.toUpperCase();
    }
    layer.bindPopup(popupContent);

    layer.on('click', () => {
      const lat = parseFloat(feature.properties.latitude);
      const lng = parseFloat(feature.properties.longitude);
      map.setView([lat, lng], zoomTo);
    });
  }

  useEffect(() => {
    (async () => {
      const geojson = await api.get('/data/beta_nyc-zip-code-tabulation-areas-polygons.min.geojson');
      setData(geojson.data);
      const length = await cache.store.length();
      console.log('Cache store length:', length);
    })();
  }, []);

  return (
    data &&
      <GeoJSON
        data={data}
        onEachFeature={onEachFeature}
        style={setFeatureStyle}
      />
  );
}
  
export default ZipcodeLayer;
