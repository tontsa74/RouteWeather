import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { setCurrentLocation, setRouteStart, setRouteDestination } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';

const IconComponent = Ionicons;

export default function MapScreen() {

  const currentLocation = useSelector(state => state.currentLocation);
  const fetchRoute = useSelector(state => state.fetchRoute);
  
  const dispatch = useDispatch();

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
        }}>
          <IconComponent name={'md-radio-button-off'} size={25} color={'blue'} />
        </Marker>
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
      
      <TouchableOpacity
          onPress={() => dispatch(setCurrentLocation())}
          style={styles.gpsButton}
          >
          <IconComponent 
            name={'md-locate'} 
            size={40} 
            color={'blue'} 
          />
        </TouchableOpacity>
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
  gpsButton: {
    position:'absolute',
    top: 50,
    right: 25,
  }
});
