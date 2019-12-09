import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SettingsScreen from './components/SettingsScreen';
import MapScreen from './components/MapScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Constants from 'expo-constants';

const TabNavigator = createBottomTabNavigator({
  Settings: SettingsScreen,
  Map: MapScreen,
},
{
  tabBarOptions: {
    activeTintColor: 'blue',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#eeeeee',
    },
  },
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
