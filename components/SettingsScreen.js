import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Linking } from 'react-native';
import { setCurrentLocation, setRouteStart, setRouteDestination } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getRouteLocations, geoCode } from '../services/apiService';
import { Ionicons } from '@expo/vector-icons';

const IconComponent = Ionicons;

export default function SettingsScreen(props) {
  const routeStart = useSelector(state => state.routeStart);
  const routeDestination = useSelector(state => state.routeDestination);
  const location = useSelector(state => state.currentLocation);
  const weather = useSelector(state => state.fetchWeather);
  
  const dispatch = useDispatch();

  // useEffect is called when component loads or updates
  useEffect(() => {
    if(location.onStart) {
      dispatch(setCurrentLocation())
    }
  });

  // set address from current gps location
  const useGPS = (sender) => {
    dispatch(setCurrentLocation())
    dispatch(geoCode(sender, location.coords.latitude, location.coords.longitude))
  }

  // navigate sets route and opens map screen
  const navigate = () => {
    let startTime = Date.now() / 1000
    dispatch(getRouteLocations(routeStart, routeDestination, weather, startTime))
    props.navigation.navigate('Map')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => Linking.openURL('https://darksky.net/poweredby/')}>
        <Text style={styles.darkSky}>
          Powered by Dark Sky
        </Text>
      </TouchableOpacity>

      <View style={styles.locationContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Start location"
          onChangeText={(start) => { dispatch(setRouteStart(start)) }}
          value={routeStart}
        />
        <TouchableOpacity onPress={() => useGPS('start')}>
          <IconComponent 
            style={styles.gpsButton}
            name={'md-locate'} 
            size={40} 
            color={'blue'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Destination location"
          onChangeText={(destination) => { dispatch(setRouteDestination(destination)) }}
          value={routeDestination}
        />
        <TouchableOpacity onPress={() => useGPS('destination')}>
          <IconComponent 
            style={styles.gpsButton}
            name={'md-locate'} 
            size={40} 
            color={'blue'} 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigate()}>
          <Text style={styles.navigateButton}>
            Navigate
          </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  textInput: {
    fontSize: 30,
    padding: 10,
    width: 300,
    alignSelf: 'center',
  },
  gpsButton: {
    marginRight: 15,
  },
  navigateButton: {
    color: 'blue',
    fontSize: 30,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  darkSky: {
    alignSelf: 'flex-end',
    color: 'blue',
    padding: 10,
  },
});
