import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { setCurrentLocation } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Coord } from '../models/Coord';

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
    fetchRoute.routes.map((route, index) => {
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
        {`${route.legs[0].distance.text},\t${route.legs[0].duration.text}`}
      </Text>
    )
  }

  const getAllRoutes = () => {
    let routes = []
    fetchRoute.routes.map((route, index) => {
      routes.push(getRoutePolylines(index, route.legs[0].steps))
    })
    return routes
  }
  
  const getRoutePolylines = (key, steps) => {
    let coords = [];
    steps.map((step, index) => {
      if (index == 0) {
        let coord = new Coord(
          step.start_location.lat,
          step.start_location.lng,
        )
        coords.push(coord)
      }
      let coord = new Coord(
        step.end_location.lat,
        step.end_location.lng,
      )
      coords.push(coord)
    })
    return routePolyline(key, coords)
  }

  const routePolyline = (key, coords) => {
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
      weathers.push(weatherMarker(index, weather))
    })
    return weathers
  }

  const weatherMarker = (key, weather) => {
    let time = new Date(weather.time*1000);
    let icon = weather.icon;
    let coord = weather.coord;
    let anchor = { x: 0.5, y: 0.5 }

/*     switch(weather.key) {
      case 0: { anchor = {x: 0.5, y: 1}; break; }
      case 1: { anchor = {x: 0, y: 0.5}; break; }
      case 2: { anchor = {x: 0.5, y: 0}; break; }
      default: { anchor = {x: 0.5, y: 0.5}; break; }
    } */
    
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
        title={time.toLocaleTimeString()}
        description={icon}
        coordinate={coord}
        anchor={anchor}
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
    backgroundColor: '#88888844',
    padding: 5,
  }
});
