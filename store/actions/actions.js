export const setCurrentLocation = (location) => {
  return {
    type: 'SET_CURRENT_LOCATION',
    payload: location,
  };
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