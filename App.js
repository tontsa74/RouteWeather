import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './reducers';
import AppNavigator from './AppNavigator';

const store = createStore(allReducers);

export default function App() {

  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  )
}
