import { useState, useEffect, useReducer } from "react";
import api from 'axios';
import { v4 as id } from 'uuid';
import { geosearch, formatPhoneNumber } from '../lib/utils';

const leadReducer = (state, action) => {
  if (action.type === 'ADD_LEAD') {
    return [ ...state, action.payload ]
  }
  if (action.type === 'UPDATE_LEAD') {
    const idx = state.findIndex(item => item.id === action.id);
    const lead = {...state[idx]};
    lead.latlng = action.latlng;
    const leads = [...state];
    leads.splice(idx, 1, lead);
    return leads;
  }
  if (action.type === 'DELETE_LEAD') {
    return state.filter(lead => lead.id !== action.payload.id)
  }
  return state;
}

const Leads = () => {
  const [leads, dispatch] = useReducer(leadReducer, [])

  useEffect(() => {
    // On load, get leads from lead-gen API
    (async () => {
      const response = await api.get('https://lead-gen-lite.herokuapp.com/api/all-with-contacts.json');
      
      response.data.slice(0, 5).forEach(lead => {
        const address1 = lead.address;
        const address2 = [
          [lead.city, lead.state].filter(Boolean).join(', '),
          lead.zip
        ].join(' ');
        const phone = formatPhoneNumber(lead.phone);

        dispatch({
          type: 'ADD_LEAD',
          payload: {
            id: id(),
            address1,
            address2,
            phone,
            latlng: [],
            loading: false,
          }
        });
      });
    })();
  }, []);

  useEffect(() => {
    // Update latlng when lead shows up
    (async () => {
      const leadsToUpdate = leads.filter(lead => lead.latlng && lead.latlng.length === 0 && !lead.loading)

      leadsToUpdate.forEach(async (lead) => {
        console.log('fetching latlng');
        const loadLatLng = async () => {
          const query = [lead.address1, lead.address2].join(' ');
          lead.loading = true;
          const result = await geosearch(query)
          lead.loading = false;
          return result;
        }

        dispatch({
          type: 'UPDATE_LEAD',
          id: lead.id,
          latlng: await loadLatLng(),
        });
      });
    })();
  }, [leads]);

  const listAddresses = () => {
    return leads.map(lead =>
      <p>{lead.address1}<br />{lead.address2}<br />{lead.phone}<br />[{lead.latlng}]</p>);
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