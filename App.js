import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Settings from './components/Settings';
import Map from './components/Map';

export default function App() {
  return (
    <View style={styles.container}>
      <Settings></Settings>
      {/* <Map></Map> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
