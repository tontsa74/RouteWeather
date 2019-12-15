import locationReducer from './locationReducer';
import routeStartReducer from './routeStartReducer';
import routeDestinationReducer from './routeDestinationReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  currentLocation: locationReducer,
  routeStart: routeStartReducer,
  routeDestination: routeDestinationReducer,
});

export default allReducers;
