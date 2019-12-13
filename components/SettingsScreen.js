import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class SettingsScreen extends React.Component {
  state= {
    start: '', 
    destination: '',
    location: null,
    errorMessage: null,
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  navigate(start, destination) {
    console.log(`start: ${start}, destination: ${destination}`)
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Start location"
          onChangeText={(start) => this.setState({start})}
          value={this.state.start}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Destination location"
          onChangeText={(destination) => this.setState({destination})}
          value={this.state.destination}
        />
        <TouchableOpacity
          onPress={() => this.navigate(this.state.start, this.state.destination)}
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
