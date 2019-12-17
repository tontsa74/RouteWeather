import { fetchData, fetchDataFulfilled, fetchDataRejected } from "../store/actions/actions";
import Constants from 'expo-constants';


//Define your action creators that will be responsible for asynchronouse operations 
export const getRouteLocations = (start, destination) => {
  //IN order to use await your callback must be asynchronous using async keyword.
  return async dispatch => {
    //Then perform your asynchronous operations.
    try {
      //const key = 'foo' 
      const key = Constants.manifest.android.config.googleMaps.apiKey; 
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${key}`;
      console.log(url)
      //Have it first fetch data from our starwars url.
      const routeLocationsPromise = await fetch(url);
      dispatch(fetchData(true));
      //Then use the json method to get json data from api/
      const locations = await routeLocationsPromise.json();
      //console.log('locations-----------', locations);
      //Now when the data is retrieved dispatch an action altering redux state.
      dispatch(fetchDataFulfilled(locations))
    } catch(error) {
      console.log('Getting People Error---------', error);
      dispatch(fetchDataRejected(error))
    }
  }
}