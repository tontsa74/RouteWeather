import { createStore, applyMiddleware } from 'redux';
import allReducers from './reducers';
import thunk from 'redux-thunk';

const logger = (store) => (next) => (action) => {
  console.log('action fired: ', action)
  next(action);
}

const error = (store) => (next) => (action) => {
  try {
    next(action);
  } catch(e) {
    console.log("Error: ", e);
  }
}

const middleware = applyMiddleware(logger, error, thunk);

const store = createStore(
  allReducers,
  middleware,
);
  
// store.subscribe(() => {
//   console.log('store changed: ', store.getState());
// });

export default store;