import { GET_LOCATIONS, GET_LOCATIONS_FULFILLED, GET_LOCATIONS_REJECTED } from '../types';
import { fetchLocation } from '../../services/locationService'

export const setCurrentLocationAsync = (location) => {
  return {
    type: 'SET_CURRENT_LOCATION',
    payload: location,
  };
}

export const setCurrentLocation = () => {
  return function(dispatch) {
    //dispatch(setCurrentLocationAsync('waiting'))
    console.log('waiting')
    return fetchLocation()
    .then(loc => dispatch(setCurrentLocationAsync(loc)))
    .catch(error => console.log(error))
  }
}

export const setRouteStart = (location) => {
  return {
    type: 'SET_ROUTE_START',
    payload: location,
  };
}

export const setRouteDestination = (location) => {
  return {
    type: 'SET_ROUTE_DESTINATION',
    payload: location,
  };
}

//Define your action create that set your loading state.
export const fetchData = (bool) => {
  //return a action type and a loading state indicating it is getting data. 
  return {
    type: GET_LOCATIONS,
    payload: bool,
  }
}

//Define a action creator to set your loading state to false, and return the data when the promise is resolved
export const fetchDataFulfilled = (data) => {
  //Return a action type and a loading to false, and the data.
  return {
      type: GET_LOCATIONS_FULFILLED,
      payload: data,
      loading: false,
  };
}

//Define a action creator that catches a error and sets an errorMessage
export const fetchDataRejected = (error) => {
  //Return a action type and a payload with a error
  return {
      type: GET_LOCATIONS_REJECTED,
      payload: error,
      loading: false,
  };
}
