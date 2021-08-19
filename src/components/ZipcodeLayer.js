import { useState, useEffect } from "react";
import { GeoJSON } from "react-leaflet";
import axios from 'axios';

const ZipcodeLayer = () => {
  const [data, setData] = useState(null);

  const setFeatureStyle = () => ({
    fillColor: 'lightblue',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const onEachFeature = (feature, layer) => {
    let popupContent = 'You clicked on:<br />';
    if (feature.properties) {
      popupContent += `${feature.properties['PO_NAME']}, ${feature.properties['STATE']} ${feature.properties['postalCode']}`;
    }
    layer.bindPopup(popupContent);
  
    /*
    layer.on('click', () => {
      const lat = parseFloat(feature.properties.latitude);
      const lng = parseFloat(feature.properties.longitude);
      map.setView([lat, lng], 13);
    });
    */
  }

  useEffect(() => {
    (async () => {
      const geojson = await axios.get('/data/nyc-zip-codes-rfc7946.geojson');
      setData(geojson.data);
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
