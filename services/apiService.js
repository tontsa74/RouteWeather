import { fetchData, fetchDataFulfilled, fetchDataRejected, setRouteStart, setRouteDestination } from "../store/actions/actions";
import { apiKey } from '../apiKey';
import { RoutePoint } from "../models/RoutePoint";

export const getRouteLocations = (start, destination) => {
  return async dispatch => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${apiKey}&alternatives=true`;
      const routeLocationsPromise = await fetch(url);
      dispatch(fetchData());
      const locationsJson = await routeLocationsPromise.json();
      const route = setRoute(locationsJson)
      dispatch(fetchDataFulfilled(route))
    } catch(error) {
      console.log('Getting Locations Error---------', error);
      dispatch(fetchDataRejected(error))
    }
  }
}

const setRoute = (locations) => {
  console.log('setRoute')
  let routes = []
  let key = 0
  locations.routes.forEach(route => {
    let routePoints = []
    // push route start point
    let latitude = route.legs[0].steps[0].start_location.lat
    let longitude = route.legs[0].steps[0].start_location.lng
    let routePoint = new RoutePoint(`${key}`, latitude, longitude)
    routePoints.push(routePoint)
    // push rest of route points
    route.legs[0].steps.forEach(step => {
      key += 1
      let latitude = step.end_location.lat
      let longitude = step.end_location.lng
      let routePoint = new RoutePoint(`${key}`, latitude, longitude)
      routePoints.push(routePoint)
    });
    routes.push(routePoints)
  })

  return routes
}

export const geoCode = (sender, latitude, longitude) => {
  return async dispatch => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      const geocodePromise = await fetch(url);
      const geocodeJson = await geocodePromise.json();
      const address = geocodeJson.results[0].formatted_address;
      console.log('geoCode', address)
      switch(sender) {
        case 'start': {
          dispatch(setRouteStart(address));
          break;
        }
        case 'destination': {
          dispatch(setRouteDestination(address))
          break;
        }
      }
    } catch(error) {
      console.log(error)
    }
  }
} 