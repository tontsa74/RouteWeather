import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import { useSelector } from 'react-redux';

export default function MapScreen() {

  const currentLocation = useSelector(state => state.currentLocation);
  const routeStart = useSelector(state => state.routeStart);
  const routeDestination = useSelector(state => state.routeDestination);
  console.log(currentLocation)
  console.log(routeStart)
  console.log(routeDestination)
  

  return (
    <View style={styles.container}>
      <MapView 
        style ={styles.mapStyle}
      />
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
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
