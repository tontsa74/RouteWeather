import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import MapView from 'react-native-maps';

export default class MapScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style ={styles.mapStyle}
        />
      </View>
    );
  }

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
