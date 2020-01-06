import { createStore, applyMiddleware } from 'redux';
import allReducers from './reducers';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';

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

const middleware = applyMiddleware(error, thunk);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, allReducers)

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
  