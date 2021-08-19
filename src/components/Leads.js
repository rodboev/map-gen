import { useState, useEffect, useReducer } from "react";
import api from 'axios';
import { v4 as id } from 'uuid';
import { geosearch, formatPhoneNumber } from '../lib/utils';
import { Marker, Popup, Tooltip } from "react-leaflet";

const leadReducer = (state, action) => {
  if (action.type === 'ADD_LEAD') {
    return [ ...state, action.payload ]
  }
  if (action.type === 'UPDATE_LEAD') {
    const idx = state.findIndex(item => item.id === action.id);
    const lead = {...state[idx]};
    lead.position = action.position;
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
      
      response.data.slice(0, 10).forEach(lead => {
        const phone = formatPhoneNumber(lead.phone);

        dispatch({
          type: 'ADD_LEAD',
          payload: {
            id: id(),
            company: lead.company,
            name: [lead.first_name, lead.last_name].join(' '),
            address1: lead.address,
            address2:
              [
                [lead.city, lead.state].filter(Boolean).join(', '),
                lead.zip
              ].filter(Boolean).join(' '),
            phone,
            position: [],
            loading: false,
          }
        });
      });
    })();
  }, []);

  useEffect(() => {
    // Update position when lead shows up
    (async () => {
      const leadsToUpdate = leads.filter(lead => lead.position && lead.position.length === 0 && !lead.loading)

      leadsToUpdate.forEach(async (lead) => {
        const queueGeosearch = async () => {
          const query = [lead.address1, lead.address2].join(' ');
          lead.loading = true;
          const result = await geosearch(query)
          lead.loading = false;
          return result;
        }

        dispatch({
          type: 'UPDATE_LEAD',
          id: lead.id,
          position: await queueGeosearch(),
        });
      });
    })();
  }, [leads]);

  const listAddresses = () => {
    return leads.map(lead =>
      lead.position && lead.position.length > 0 &&
        <Marker position={lead.position}>
          <Popup>
            <div>{lead.company}</div>
            <div>{lead.name}</div>
            <div>{lead.address1}</div>
            <div>{lead.address2}</div>
            <div>{lead.phone}</div>
          </Popup>
          <Tooltip>
            <div>{lead.company}</div>
            <div>{lead.name}</div>
            <div>{lead.address1}</div>
            <div>{lead.address2}</div>
            <div>{lead.phone}</div>
          </Tooltip>
        </Marker>
    )
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