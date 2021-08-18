import { useEffect } from 'react';
import { GeoSearchControl, MapBoxProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';

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
        });

        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, [map, apiKey]);

    return null;
};

export default SearchField;