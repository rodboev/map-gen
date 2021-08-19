import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const geosearch = async (query) => {
  return await provider.search({ query });
}

export default geosearch;