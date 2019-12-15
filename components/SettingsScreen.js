import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { setCurrentLocation, setRouteStart, setRouteDestination } from '../store/actions/actions'
import { useDispatch } from 'react-redux';


export default function SettingsScreen() {
  const [start, setStart] = useState('Tampere');
  const [destination, setDestination] = useState('Kuusamo');
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('SettingsScreen')
  });

  const getLocation = () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMessage('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
    } else {
      console.log('location')
      _getLocationAsync();
    }
  }

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied')
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location)
    dispatch(setCurrentLocation(location))
  };

  const navigate = (start, destination) => {
    console.log(`start: ${start}, destination: ${destination}`)
    dispatch(setRouteStart(start))
    dispatch(setRouteDestination(destination))

    getLocation();
  }


  let text = 'Waiting..';
  if (errorMessage) {
    text = errorMessage;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Start location"
        onChangeText={(start) => setStart({start})}
        value={start}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Destination location"
        onChangeText={(destination) => setDestination({destination})}
        value={destination}
      />
      <TouchableOpacity
        onPress={() => navigate(start, destination)}
        >
          <Text style={styles.navigateButton}>
            Navigate
          </Text>
      </TouchableOpacity>
      <Text>
        key: {Constants.manifest.android.config.googleMaps.apiKey}
      </Text>
      <Text>
        {text}
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
    marginTop: Constants.statusBarHeight,
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
