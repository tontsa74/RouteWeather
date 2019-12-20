import React from 'react';
import SettingsScreen from './components/SettingsScreen';
import MapScreen from './components/MapScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';


const TabBarComponent = props => <BottomTabBar {...props} />;

const TabNavigator = createBottomTabNavigator({
  Settings: SettingsScreen,
  Map: MapScreen,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Ionicons;
      let iconName;
      if (routeName === 'Settings') {
        iconName = `md-settings`;
        // Sometimes we want to add badges to some icons.
        // You can check the implementation below.
        // IconComponent = HomeIconWithBadge;
      } else if (routeName === 'Map') {
        iconName = `md-map`;
      }

      // You can return any component that you like here!
      return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'blue',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      // backgroundColor: '#eeeeee',
    },
  },
  tabBarComponent: props => (
    <TabBarComponent {...props} style={{ 
      borderTopColor: '#605F60', 
      backgroundColor: '#eeeeee',
    }} />
  ),
});

export default createAppContainer(TabNavigator);
