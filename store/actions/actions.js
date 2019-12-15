import { fetchLocation } from '../../services/locationService'

export const setCurrentLocationAsync = (location) => {
  return {
    type: 'SET_CURRENT_LOCATION',
    payload: location,
  };
}

export const setCurrentLocation = () => {
  return function(dispatch) {
    dispatch(setCurrentLocationAsync('waiting'))
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