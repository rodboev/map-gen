import { useEffect, useReducer } from "react";
import api from 'axios';
import { v4 as id } from 'uuid';
import { geosearch, formatPhoneNumber } from '../lib/utils';
import { Marker, Popup } from "react-leaflet";

const dispatchTable = {
  'ADD_LEAD': (state, action) => {
    return [ ...state, action.payload ]
  },
  'UPDATE_LEAD': (state, action) => {
    const idx = state.findIndex(item => item.id === action.payload.id);
    const lead = {
      ...state[idx], position: action.payload.position
    };
    const leads = [...state];
    leads.splice(idx, 1, lead);
    return leads;
  },
  'DELETE_LEAD': (state, action) => {
    return state.filter(lead => lead.id !== action.payload.id)
  }
};

const leadReducer = (state, action) => {
  return dispatchTable[action.type]
    ? dispatchTable[action.type](state, action)
    : state;
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
            notes: [lead.date, lead.notes].filter(Boolean).join(': '),
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
          payload: {
            id: lead.id,
            position: await queueGeosearch(),
          }
        });
      });
    })();
  }, [leads]);

  return leads.map(lead =>
    lead.position && lead.position.length > 0 &&
      <Marker position={lead.position} key={lead.id}>
        <Popup>
          <div>{lead.name}</div>
          <div>{lead.company}</div>
          <div>{lead.address1}</div>
          <div>{lead.address2}</div>
          <div>{lead.phone}</div>
          <p>{lead.notes}</p>
        </Popup>
      </Marker>
  );
}

export default Leads;