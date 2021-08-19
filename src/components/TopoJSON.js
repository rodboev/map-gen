import React, { useRef, useEffect } from "react";
import { GeoJSON, withLeaflet } from "react-leaflet";
import * as topojson from "topojson-client";

function TopoJSON(props) {
    const layerRef = useRef(null);
    const { data, ...otherProps } = props;
  
    function addData(layer, jsonData) {
      if (jsonData.type === "Topology") {
        for (let key in jsonData.objects) {
          let geojson = topojson.feature(jsonData, jsonData.objects[key]);
          layer.addData(geojson);
        }
      } else {
        layer.addData(jsonData);
      }
    }
  
    function onEachFeature(feature, layer) {
      if (feature.properties) {
        const { VARNAME_3, NAME_0 } = feature.properties;
        layer.bindPopup(`${VARNAME_3}, ${NAME_0}`);
      }
    }
  
    useEffect(() => {
      const layer = layerRef.current;
      addData(layer, props.data);
    }, [props.data]);
  
    return (
      <GeoJSON ref={layerRef} {...otherProps} onEachFeature={onEachFeature} />
    );
  }
  
  export default TopoJSON;