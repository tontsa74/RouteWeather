import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './AppNavigator';
import { store, persistor } from './store';
import Constants from 'expo-constants';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function App() {
  console.log(Constants.manifest.name);


  return (
    <Provider store={store}>
      <PersistGate loading={renderLoading()} persistor={persistor}>
        <AppNavigator/>
      </PersistGate>
    </Provider>
  )
}


const renderLoading = () => {
  return (
      <View style={styles.container}>
          <Text style={styles.title}>Route Weather</Text>
          <ActivityIndicator size={"large"} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 30,
    color: 'blue',
    padding: 20,
  }
});