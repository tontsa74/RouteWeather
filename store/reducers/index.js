import locationReducer from './locationReducer';
import routeStartReducer from './routeStartReducer';
import routeDestinationReducer from './routeDestinationReducer';
import fetchRouteReducer from './fetchRouteReducer';
import { combineReducers } from 'redux';
import fetchWeatherReducer from './fetchWeatherReducer';

const allReducers = combineReducers({
  currentLocation: locationReducer,
  routeStart: routeStartReducer,
  routeDestination: routeDestinationReducer,
  fetchRoute: fetchRouteReducer,
  fetchWeather: fetchWeatherReducer,
});

export default allReducers;
