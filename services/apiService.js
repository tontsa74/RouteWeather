import { fetchData, fetchDataFulfilled, fetchDataRejected, setRouteStart, setRouteDestination } from "../store/actions/actions";
import { apiKey } from '../apiKey';
import { getRouteWeather } from "./darkSkyApiService";

export const getRouteLocations = (start, destination) => {
  return async dispatch => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${apiKey}&alternatives=true`;
      const directionsPromise = await fetch(url);
      dispatch(fetchData());
      const directionsJson = await directionsPromise.json();
      dispatch(fetchDataFulfilled(directionsJson.routes))
      dispatch(getRouteWeather(directionsJson.routes))
    } catch(error) {
      console.log('Getting Locations Error---------', error);
      dispatch(fetchDataRejected(error))
    }
  }
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