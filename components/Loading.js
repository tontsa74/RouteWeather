import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

export default function Loading(props) {
  return (
      <View style={styles.container}>
          <Text style={styles.title}>Route Weather</Text>
          {props.loading && <ActivityIndicator style={{padding: 20,}} size={"large"} />}
          <Image
            style={{ width: 250, height: 250, }}
            source={require('../assets/RWicon.png')}
          />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: 'blue',
    padding: 20,
  }
});