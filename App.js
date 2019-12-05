import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SettingsScreen from './components/SettingsScreen';
import MapScreen from './components/MapScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const TabNavigator = createBottomTabNavigator({
  Settings: SettingsScreen,
  Map: MapScreen,
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
