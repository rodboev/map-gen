import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const geosearch = async (query) => {
  return await provider.search({ query });
}

const formatPhoneNumber = str => {
  const cleaned = String(str).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : null;
}

export { geosearch, formatPhoneNumber };