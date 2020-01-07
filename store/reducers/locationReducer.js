import { SET_CURRENT_LOCATION, SET_CURRENT_REJECTED, SET_CURRENT_LOCATION_FULFILLED } from "../types";

const initialState = {
  coords: {
    latitude: 60,
    longitude: 25,
    latitudeDelta: 1,
    longitudeDelta: 1,
  },
  loading: false,
  errorMessage: '',
  onStart: true,
}

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        loading: action.loading,
        onStart: false,
      };
    case SET_CURRENT_LOCATION_FULFILLED:
      return {
        ...state,
        coords: action.payload.coords,
        loading: action.loading,
      };
    case SET_CURRENT_REJECTED:
      return {
        ...state,
        loading: action.loading,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default locationReducer;