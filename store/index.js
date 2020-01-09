import { createStore, applyMiddleware } from 'redux';
import allReducers from './reducers';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';

// logger to display all dispatch actions to redux store
const logger = (store) => (next) => (action) => {
  console.log('action fired: ', action)
  next(action);
}

// display all dispatch errors to console
const error = (store) => (next) => (action) => {
  try {
    next(action);
  } catch(e) {
    console.log("Error: ", e);
  }
}

// add middleware to redux store here
const middleware = applyMiddleware(error, thunk);

// persist add ability to save redux store data to file
const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, allReducers)

// redux store works bit like global state
const store = createStore(
  persistedReducer,
  middleware,
);

const persistor = persistStore(store)

// store.subscribe(() => {
//   console.log('store changed: ', store.getState());
// });

export {
  store,
  persistor
}
  