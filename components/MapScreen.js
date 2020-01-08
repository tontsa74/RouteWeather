import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text, Slider } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { setCurrentLocation } from '../store/actions/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Coord } from '../models/Coord';
import { getRouteWeather } from '../services/darkSkyApiService';

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

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function MapScreen() {

  const currentLocation = useSelector(state => state.currentLocation);
  const fetchRoute = useSelector(state => state.fetchRoute);
  const fetchWeather = useSelector(state => state.fetchWeather);
  const mapRegion = useSelector(state => state.mapRegion);
  
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('MapScreen: ')
  });
  
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
      if (weather.isVisible) {
        weathers.push(weatherMarker(index, weather))
      }
    })
    return weathers
  }

  const weatherMarker = (key, weather) => {
    let time = new Date(weather.time*1000);
    let icon = weather.icon;
    let coord = weather.coord;
    let anchor = { x: 0.5, y: 0.5 }
    
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
        description={`${Math.round(weather.temperature * 10) / 10 }, ${weather.summary}`}
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
        region={mapRegion.region}
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

      <Slider
          minimumValue={0}
          maximumValue={8}
          minimumTrackTintColor="#1EB1FC"
          maximumTractTintColor="#1EB1FC"
          step={1}
          value={0}
          onValueChange={value => {
            let startTime = (Date.now() / 1000) + (value * 3600)
            console.log(startTime)
          } }
          onSlidingComplete={value => {
            let startTime = (Date.now() / 1000) + (value * 3600)
            console.log(value)
            dispatch(getRouteWeather(fetchRoute.routes, fetchWeather, startTime))
          } }
          style={styles.slider}
          thumbTintColor="#1EB1FC"
        />
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
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    ...StyleSheet.absoluteFillObject,
  },
  gpsButton: {
    position:'absolute',
    top: 50,
    right: 25,
  },
  timeButton: {
    position:'absolute',
    top: 50,
    right: 75,
  },
  slider: {
    position: 'absolute',
    bottom: 25,
    // marginTop: height * 0.57,
    height: 50,
    width: width * 0.8,
    // transform: [{ rotateZ: '-90deg' }],
    // marginLeft: 125,
    // backgroundColor: 'yellow',
    backgroundColor: '#88888844',
  },
  routes: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: '#88888844',
    padding: 5,
  }
});
