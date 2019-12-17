import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './AppNavigator';
import store from './store';
import Constants from 'expo-constants';

export default function App() {
  console.log(Constants.manifest.name);
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  )
}
