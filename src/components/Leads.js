import { useState, useEffect } from "react";
import api from 'axios';
import { geosearch, formatPhoneNumber } from '../lib/utils';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [usableLeads, setUsableLeads] = useState([]);

  // On load, get leads from lead-gen API
  useEffect(() => {
    (async () => {
      const response = await api.get('https://lead-gen-lite.herokuapp.com/api/all-with-contacts.json');
      setLeads(response.data.slice(0, 5));
    })();
  }, []);

  // When leads changes, format and geosearch the addresses
  useEffect(() => {
    (async () => {
      let tmp = [];
      leads.forEach(async lead => {
        if (lead.address && lead.city && lead.state) {
          const address1 = lead.address;
          const address2 = [
            [lead.city, lead.state].filter(Boolean).join(', '),
            lead.zip
          ].join(' ');
          const phone = formatPhoneNumber(lead.phone);
          const queryAddress = [address1, address2].join(' ');
          
          tmp.push({
            address1,
            address2,
            phone,
            // latlng: getLatLng([lead.address, lead.city, lead.state, lead.zip].join(' ')),
          });

          const result = await geosearch(queryAddress);
          if (result) {
            console.log(queryAddress + ': ' + result);
          }
        }
      });
      setUsableLeads(tmp);
    })();
  }, [leads]);

  const listAddresses = () => {
    return usableLeads.map(lead =>
      <p>{lead.address1}<br />{lead.address2}<br />{lead.phone}<br />{lead.latlng}</p>);
  };

  return (
    <div className='addresses'>
      {!leads && <div>Fetching addresses...</div>}
      {leads && <div>Addresses found:</div>}
      {leads && listAddresses()}
    </div>
  );
}

export default Leads;