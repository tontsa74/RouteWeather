import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './AppNavigator';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading';

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading/>} persistor={persistor}>
        <AppNavigator/>
      </PersistGate>
    </Provider>
  )
}
