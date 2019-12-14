import SettingsScreen from './components/SettingsScreen';
import MapScreen from './components/MapScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

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
