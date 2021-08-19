import { useState, useEffect } from "react";
import api from '../lib/api';
import { geosearch } from '../lib/utils';

const Leads = () => {
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await api.get('https://lead-gen-lite.herokuapp.com/api/all-with-contacts.json');
      setLeads(response.data.slice(0, 50));
    })();
  }, []);

  return (
    <div className="addresses">
      {!leads && <div>Fetching addresses...</div>}

      {leads &&
        leads.map((lead) =>
          <div>{lead.address}, {lead.city}, {lead.state} {lead.zip}</div>
        )
      }
    </div>
  );
}

(async () => {
  const address = '40-08 50th Ave 11104';
  const result = await geosearch(address);
  const {x: lat, y: lng} = result[0];
  console.log(`'${address}': [${lat}, ${lng}]`);
})();

export default Leads;