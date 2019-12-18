import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSelector } from 'react-redux';


export default function MapScreen() {

  const currentLocation = useSelector(state => state.currentLocation);
  const fetchRoute = useSelector(state => state.fetchRoute);

  useEffect(() => {
    console.log('MapScreen: ')
  });
  
  const region = {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    latitudeDelta: 1,
    longitudeDelta: 1
  }

  const getCoords = () => {
    let coords = [];
    fetchRoute.locations.map((location) => {
      coords.push(location.coord)
    })
    return coords
  }


  return (
    <View style={styles.container}>
      <MapView 
        provider={MapView.PROVIDER_GOOGLE}
        style ={styles.mapStyle}
        region={region}
      >
        <Marker
        coordinate={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }}/>
      {fetchRoute.locations.map((m, index) =>
        <Marker 
        key={index}
          coordinate={m.coord} 
          image={require('../assets/test2x.png')}
        />
      )}
      <Polyline
        coordinates={getCoords()}
        strokeColor='blue'
        strokeWidth={5}
      />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
