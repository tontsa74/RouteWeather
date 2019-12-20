import { fetchData, fetchDataFulfilled, fetchDataRejected } from "../store/actions/actions";
import { apiKey } from '../apiKey';
import { RoutePoint } from "../models/RoutePoint";

export const getRouteLocations = (start, destination) => {
  return async dispatch => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${apiKey}&alternatives=true`;
      console.log(url)
      const routeLocationsPromise = await fetch(url);
      dispatch(fetchData(true));
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