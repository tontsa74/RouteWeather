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
    // console.log('MapScreen: ')
  });
  
  const region = {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    latitudeDelta: 1,
    longitudeDelta: 1
  }

  const getCoords = () => {
    let coords = [];
    fetchRoute.locations.map((route) => {
      route.map((location) => {
        coords.push(location.coord)
      })
    })
    return coords
  }

  const getAllRoutes = () => {
    let routes = []
    fetchRoute.locations.map((route, index) => {
      routes.push(getRoutePolylines(index, route))
    })
    return routes
  }
  
  const getRoutePolylines = (key, route) => {
    let coords = [];
    route.map((location) => {
      coords.push(location.coord)
    })
    return getPolyline(key, coords)
  }

  const getPolyline = (key, coords) => {
    let color
    switch(key) {
      case 0: { color = 'blue'; break; }
      case 1: { color = 'red'; break; }
      case 2: { color = 'green'; break; }
      default: { color = 'yellow'; break; }
    }
    return (
      <Polyline
        key={key}
        coordinates={coords}
        strokeColor={color}
        strokeWidth={3}
      />
    )
  }

  const getWeatherMarkers = () => {
    let allMarkers = [];
    fetchRoute.locations.map((route) => {
      allMarkers.push(getRouteMarkers(route))
    })

    return allMarkers
  }

  const getRouteMarkers = (route) => {
    let routeMarkers = []
    route.map((location) => {
      routeMarkers.push(getMarker(location.key, location.coord))
    })

    return routeMarkers
  }

  const getMarker = (key, coord) => {
    return (
      <Marker 
        key={key} 
        coordinate={coord}
        image={require('../assets/test2x.png')}
      />
    )
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
      {getWeatherMarkers()}
      {getAllRoutes()}
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
