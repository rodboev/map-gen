import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

const geosearch = async (query) => {
  try {
    const result = await provider.search({query: String(query) });
    if (result.length > 0) {
      return [result[0].y, result[0].x];
    }
  }
  catch (err) {
    return err;
  }
}

const formatPhoneNumber = str => {
  const cleaned = String(str).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : null;
}

export { geosearch, formatPhoneNumber };