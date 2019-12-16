import locationReducer from './locationReducer';
import routeStartReducer from './routeStartReducer';
import routeDestinationReducer from './routeDestinationReducer';
import fetchRouteReducer from './fetchRouteReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  currentLocation: locationReducer,
  routeStart: routeStartReducer,
  routeDestination: routeDestinationReducer,
  fetchRoute: fetchRouteReducer,
});

export default allReducers;
