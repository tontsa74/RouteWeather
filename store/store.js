import { createStore } from 'redux';
import allReducers from './store/reducers';

const store = createStore(
  allReducers,
);

export default store;