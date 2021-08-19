import { useEffect } from 'react';
import { GeoSearchControl, MapBoxProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';

const SearchField = ({ apiKey }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new MapBoxProvider({
            params: {
                access_token: apiKey,
            },
        });

        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            autoComplete: true, // optional: true|false  - default true
            autoCompleteDelay: 250, // optional: number      - default 250
            showPopup: true, // optional: true|false  - default false
            animateZoom: true, // optional: true|false  - default true
            popupFormat: ({ query, result }) => result.label.split(',').join('<br />'),
        });

        map.addControl(searchControl);

        // Overrides default behavior:
        // map.on('geosearch/showlocation', (evt) => { console.log(evt); });

        return () => map.removeControl(searchControl);
    }, [map, apiKey]);

    return null;
};

export default SearchField;