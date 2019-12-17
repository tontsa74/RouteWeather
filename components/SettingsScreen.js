import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
// import Constants from 'expo-constants';
import { setCurrentLocation, setRouteStart, setRouteDestination } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';
import { getRouteLocations } from '../services/apiService';


export default function SettingsScreen() {
  const routeStart = useSelector(state => state.routeStart);
  const routeDestination = useSelector(state => state.routeDestination);
  const location = useSelector(state => state.currentLocation);
  const route = useSelector(state => state.fetchRoute)
  
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('SettingsScreen: ')
  });

  const navigate = (start, destination) => {
    console.log(`start: ${start}, destination: ${destination}`)

    dispatch(setCurrentLocation())
  }

  const clicked = () => {
    console.log('clicked')
    dispatch(getRouteLocations(routeStart, routeDestination))
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Start location"
        onChangeText={(start) => {
          dispatch(setRouteStart(start))
        }}
        value={routeStart}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Destination location"
        onChangeText={(destination) => {
          dispatch(setRouteDestination(destination))
        }}
        value={routeDestination}
      />
      <TouchableOpacity
        onPress={() => navigate(routeStart, routeDestination)}
        >
          <Text style={styles.navigateButton}>
            Navigate
          </Text>
      </TouchableOpacity>
      <Text>
        {/* key: {Constants.manifest.android.config.googleMaps.apiKey} */}
      </Text>
      <Text>
        {JSON.stringify(location)}
      </Text>
      
      <TouchableOpacity
        onPress={() => clicked()}
        >
        <Text style={styles.navigateButton}>
          button
        </Text>
      </TouchableOpacity>
      <Text>
        {`
        ${route.locations.status}
        ${route.locations.errorMessage}
        ${route.loading}
        `}
        {JSON.stringify(route)}
      </Text>
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
    // marginTop: Constants.statusBarHeight,
  },
  textInput: {
    borderWidth: 1,
    fontSize: 30,
    padding: 10,
    marginTop: 20,
    width: 300,
    alignSelf: 'center',
  },
  navigateButton: {
    color: 'blue',
    fontSize: 30,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
  }
});
