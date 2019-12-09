import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

export default class SettingsScreen extends React.Component {
  state= {start: '', destination: ''}

  navigate(start, destination) {
    console.log(`start: ${start}, destination: ${destination}`)
  }

  render() {
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
          {Constants.manifest.android.config.googleMaps.apiKey}
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
