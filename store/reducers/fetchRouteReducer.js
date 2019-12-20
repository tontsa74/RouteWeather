import { GET_LOCATIONS, GET_LOCATIONS_FULFILLED, GET_LOCATIONS_REJECTED } from '../types';

const initialState = {
  locations: [],
  loading: false,
  errorMessage: '',
}



const fetchRouteReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_LOCATIONS:
      return {
        ...state,
        loading: action.payload,
      };
    case GET_LOCATIONS_FULFILLED:
      return {
        ...state,
        locations: action.payload,
        loading: action.loading,
      };
    case GET_LOCATIONS_REJECTED:
      return {
        ...state, 
        errorMessage: action.payload, 
        loading: action.loading,
      };
    default: 
      return state;
  }
}

export default fetchRouteReducer;