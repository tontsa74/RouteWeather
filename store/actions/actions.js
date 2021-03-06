import { GET_LOCATIONS, GET_LOCATIONS_FULFILLED, GET_LOCATIONS_REJECTED, SET_CURRENT_LOCATION, SET_ROUTE_START, SET_ROUTE_DESTINATION, SET_CURRENT_REJECTED, SET_CURRENT_LOCATION_FULFILLED, SET_MAP_REGION } from '../types';
import { fetchLocation } from '../../services/locationService'

export const setCurrentLocation = () => {
  return function(dispatch) {
    dispatch(currentLocation())
    return fetchLocation()
    .then(loc => {
      dispatch(setCurrentLocationFulfilled(loc))
      let region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: loc.coords.accuracy * 0.01,
        longitudeDelta: loc.coords.accuracy * 0.01,
      }
      dispatch(setMapRegion(region))
    })
    .catch(error => dispatch(setCurrentLocationRejected(error)))
  }
}

export const currentLocation = () => {
  //return a action type and a loading state indicating it is getting data. 
  return {
    type: SET_CURRENT_LOCATION,
    loading: true,
  }
}

// Async
export const setCurrentLocationFulfilled = (location) => {
  return {
    type: SET_CURRENT_LOCATION_FULFILLED,
    payload: location,
    loading: false,
  };
}

export const setCurrentLocationRejected = (error) => {
  return {
    type: SET_CURRENT_REJECTED,
    payload: error,
    loading: false,
  };
} 

export const setRouteStart = (location) => {
  return {
    type: SET_ROUTE_START,
    payload: location,
  };
}

export const setRouteDestination = (location) => {
  return {
    type: SET_ROUTE_DESTINATION,
    payload: location,
  };
}

//Define your action create that set your loading state.
export const fetchData = () => {
  //return a action type and a loading state indicating it is getting data. 
  return {
    type: GET_LOCATIONS,
    payload: true,
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

export const setMapRegion = (region) => {
  return {
    type: SET_MAP_REGION,
    payload: region,
  };
}