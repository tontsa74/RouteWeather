import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { setCurrentLocation } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';

const IconComponent = Ionicons;
const icon_default = require('../assets/icon.png')
const icon_cloudy = require('../assets/icons/cloudy.png')
const icon_day_clear = require('../assets/icons/day_clear.png')
const icon_day_partial_cloud = require('../assets/icons/day_partial_cloud.png')
const icon_fog = require('../assets/icons/fog.png')
const icon_night_half_moon_clear = require('../assets/icons/night_half_moon_clear.png')
const icon_night_half_moon_partial_cloud = require('../assets/icons/night_half_moon_partial_cloud.png')
const icon_rain = require('../assets/icons/rain.png')
const icon_sleet = require('../assets/icons/sleet.png')
const icon_snow = require('../assets/icons/snow.png')
const icon_snow_thunder = require('../assets/icons/snow_thunder.png')
const icon_thunder = require('../assets/icons/thunder.png')
const icon_tornado = require('../assets/icons/tornado.png')
const icon_wind = require('../assets/icons/wind.png')

export default function MapScreen() {

  const currentLocation = useSelector(state => state.currentLocation);
  const fetchRoute = useSelector(state => state.fetchRoute);
  const fetchWeather = useSelector(state => state.fetchWeather);
  
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('MapScreen: ')
  });
  
  const region = {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    latitudeDelta: 10,
    longitudeDelta: 10,
  }

  const getRouteTexts = () => {
    let texts = []
    fetchRoute.locations.map((route, index) => {
      console.log('leg', route.distance)
      texts.push(getRouteText(index, route))
    })
    return texts
  }

  const getRouteText = (key, route) => {
    let color
    switch(key) {
      case 0: { color = 'blue'; break; }
      case 1: { color = 'red'; break; }
      case 2: { color = 'green'; break; }
      default: { color = 'yellow'; break; }
    }
    return (
      <Text 
        style={{color: color,}} 
        key={key}
        >
        {`${route.distance}, ${route.duration}`}
      </Text>
    )
  }

  const getAllRoutes = () => {
    let routes = []
    fetchRoute.locations.map((route, index) => {
      routes.push(getRoutePolylines(index, route.routePoints))
    })
    return routes
  }
  
  const getRoutePolylines = (key, route) => {
    let coords = [];
    route.map((location) => {
      coords.push(location.coord)
    })
    return getPolyline(key, coords)
  }

  const getPolyline = (key, coords) => {
    let color
    switch(key) {
      case 0: { color = 'blue'; break; }
      case 1: { color = 'red'; break; }
      case 2: { color = 'green'; break; }
      default: { color = 'yellow'; break; }
    }
    return (
      <Polyline
        key={key}
        coordinates={coords}
        strokeColor={color}
        strokeWidth={3}
      />
    )
  }

  const getWeather = () => {
    let weathers = []
    fetchWeather.weathers.map((weather, index) => {
      weathers.push(getMarker(index, {latitude: weather.latitude, longitude: weather.longitude}, weather.time, weather.icon))
    })
    return weathers
  }

  const getMarker = (key, coord, time, icon) => {
    let t = new Date(time*1000);
    
    let iconImage
    switch(icon) {
      case 'rain': { iconImage = icon_rain; break; }
      case 'cloudy': { iconImage = icon_cloudy; break; }
      case 'clear-day': { iconImage = icon_day_clear; break; }
      case 'clear-night': { iconImage = icon_night_half_moon_clear; break; }
      case 'snow': { iconImage = icon_snow; break; }
      case 'sleet': { iconImage = icon_sleet; break; }
      case 'wind': { iconImage = icon_wind; break; }
      case 'fog': { iconImage = icon_fog; break; }
      case 'partly-cloudy-day': { iconImage = icon_day_partial_cloud; break; }
      case 'partly-cloudy-night': { iconImage = icon_night_half_moon_partial_cloud; break; }
      case 'hail': { iconImage = icon_snow_thunder; break; }
      case 'thunderstorm': { iconImage = icon_thunder; break; }
      case 'tornado': { iconImage = icon_tornado; break; }
      default: iconImage = icon_default;
    }
    return (
      <Marker 
        key={key} 
        title={t.toLocaleTimeString()}
        description={icon}
        coordinate={coord}
        anchor={{x: 0.5, y: 0.5}}
        image={iconImage}
      >
      </Marker>
    )
  }

  return (
    <View style={styles.container}>
      <MapView 
        // provider={MapView.PROVIDER_GOOGLE}
        style ={styles.mapStyle}
        region={region}
      >
      <Marker
      coordinate={{
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }}>
        <IconComponent name={'md-radio-button-off'} size={25} color={'blue'} />
      </Marker>
      {getWeather()}
      {getAllRoutes()}
      </MapView>
      
      <TouchableOpacity
        onPress={() => dispatch(setCurrentLocation())}
        style={styles.gpsButton}
        >
        <IconComponent 
          name={'md-locate'} 
          size={40} 
          color={'blue'} 
        />
      </TouchableOpacity>

      <View style={styles.routes}>{getRouteTexts()}</View>
    </View>
  );
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
  gpsButton: {
    position:'absolute',
    top: 50,
    right: 25,
  },
  routes: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: '#55555522'
  }
});
