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
            address1,
            address2,
            phone,
            latlng: '',
            id: id()
          }
        });
      });
    })();
  }, []);

  useEffect(() => {
    // Update latlng when lead shows up
    (async () => {
      const leadToUpdate = leads.find(lead => lead.latlng === '')

      if (leadToUpdate) {
        const queryAddress = [leadToUpdate.address1, leadToUpdate.address2].join(' ');
        dispatch({
          type: 'UPDATE_LEAD',
          id: leadToUpdate.id,
          latlng: await geosearch(queryAddress),
        });
      }
    })();
  }, [leads]);

  const listAddresses = () => {
    return leads.map(lead =>
      <p>{lead.address1}<br />{lead.address2}<br />{lead.phone}<br />[{lead.latlng && lead.latlng.join(', ')}]</p>);
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