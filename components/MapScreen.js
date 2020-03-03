import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    Text,
    Slider,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { setCurrentLocation } from '../store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Coord } from '../models/Coord';
import { getRouteWeather } from '../services/darkSkyApiService';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const IconComponent = Ionicons;
const icon_default = require('../assets/icon.png');
const icon_cloudy = require('../assets/icons/cloudy.png');
const icon_day_clear = require('../assets/icons/day_clear.png');
const icon_day_partial_cloud = require('../assets/icons/day_partial_cloud.png');
const icon_fog = require('../assets/icons/fog.png');
const icon_night_half_moon_clear = require('../assets/icons/night_half_moon_clear.png');
const icon_night_half_moon_partial_cloud = require('../assets/icons/night_half_moon_partial_cloud.png');
const icon_rain = require('../assets/icons/rain.png');
const icon_sleet = require('../assets/icons/sleet.png');
const icon_snow = require('../assets/icons/snow.png');
const icon_snow_thunder = require('../assets/icons/snow_thunder.png');
const icon_thunder = require('../assets/icons/thunder.png');
const icon_tornado = require('../assets/icons/tornado.png');
const icon_wind = require('../assets/icons/wind.png');

export default function MapScreen(props) {
    // current GPS location
    const currentLocation = useSelector(state => state.currentLocation);

    // route points
    const fetchRoute = useSelector(state => state.fetchRoute);

    // weather datas
    const fetchWeather = useSelector(state => state.fetchWeather);

    // map region to display
    const mapRegion = useSelector(state => state.mapRegion);

    // start time slider value
    const [startTime, setStartTime] = useState(0);

    // dispatch to redux store
    const dispatch = useDispatch();

    // useEffect is called when component loads or updates
    useEffect(() => {
        // console.log('MapScreen: ', props.navigation)
    });

    // return summary info of all routes
    const getRouteTexts = () => {
        let texts = [];
        fetchRoute.routes.map((route, index) => {
            texts.push(getRouteText(index, route));
        });
        return texts;
    };

    // return route summary text info
    const getRouteText = (key, route) => {
        let color;
        switch (key) {
            case 0: {
                color = 'blue';
                break;
            }
            case 1: {
                color = 'red';
                break;
            }
            case 2: {
                color = 'green';
                break;
            }
            default: {
                color = 'yellow';
                break;
            }
        }
        return (
            <Text style={{ color: color }} key={key}>
                {`${route.legs[0].distance.text},\t${route.legs[0].duration.text}`}
            </Text>
        );
    };

    // return all routes polylines
    const getAllRoutes = () => {
        let routes = [];
        fetchRoute.routes.map((route, index) => {
            routes.push(getRoutePolylines(index, route.legs[0].steps));
        });
        return routes;
    };

    // return route polyline
    const getRoutePolylines = (key, steps) => {
        let coords = [];
        steps.map((step, index) => {
            if (index == 0) {
                let coord = new Coord(
                    step.start_location.lat,
                    step.start_location.lng
                );
                coords.push(coord);
            }
            let coord = new Coord(step.end_location.lat, step.end_location.lng);
            coords.push(coord);
        });
        return routePolyline(key, coords);
    };

    // return polyline of given coords
    const routePolyline = (key, coords) => {
        let color;
        switch (key) {
            case 0: {
                color = 'blue';
                break;
            }
            case 1: {
                color = 'red';
                break;
            }
            case 2: {
                color = 'green';
                break;
            }
            default: {
                color = 'yellow';
                break;
            }
        }
        return (
            <Polyline
                key={key}
                coordinates={coords}
                strokeColor={color}
                strokeWidth={3}
            />
        );
    };

    // return weather markers along all routes
    const getWeather = () => {
        let weathers = [];
        fetchWeather.weathers.map((weather, index) => {
            if (weather.isVisible) {
                weathers.push(weatherMarker(index, weather));
            }
        });
        return weathers;
    };

    // return marker with weather data
    const weatherMarker = (key, weather) => {
        let time = new Date(weather.time * 1000);
        let timestamp = new Date(weather.timestamp * 1000);
        let icon = weather.icon;
        let coord = weather.coord;
        let anchor = { x: 0.5, y: 0.5 };

        let iconImage;
        switch (icon) {
            case 'rain': {
                iconImage = icon_rain;
                break;
            }
            case 'cloudy': {
                iconImage = icon_cloudy;
                break;
            }
            case 'clear-day': {
                iconImage = icon_day_clear;
                break;
            }
            case 'clear-night': {
                iconImage = icon_night_half_moon_clear;
                break;
            }
            case 'snow': {
                iconImage = icon_snow;
                break;
            }
            case 'sleet': {
                iconImage = icon_sleet;
                break;
            }
            case 'wind': {
                iconImage = icon_wind;
                break;
            }
            case 'fog': {
                iconImage = icon_fog;
                break;
            }
            case 'partly-cloudy-day': {
                iconImage = icon_day_partial_cloud;
                break;
            }
            case 'partly-cloudy-night': {
                iconImage = icon_night_half_moon_partial_cloud;
                break;
            }
            case 'hail': {
                iconImage = icon_snow_thunder;
                break;
            }
            case 'thunderstorm': {
                iconImage = icon_thunder;
                break;
            }
            case 'tornado': {
                iconImage = icon_tornado;
                break;
            }
            default:
                iconImage = icon_default;
        }
        return (
            <Marker
                key={key}
                title={`${time.toLocaleTimeString()} / ${timestamp.toLocaleTimeString()}`}
                description={`${Math.round(weather.temperature * 10) / 10}, ${
                    weather.summary
                }`}
                coordinate={coord}
                anchor={anchor}
                image={iconImage}></Marker>
        );
    };

    return (
        <View style={styles.container}>
            <MapView
                // provider={MapView.PROVIDER_GOOGLE}   // to use google maps in ios
                style={styles.mapStyle}
                region={mapRegion.region}>
                <Marker
                    coordinate={{
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    }}>
                    <IconComponent
                        name={'md-radio-button-off'}
                        size={25}
                        color={'blue'}
                    />
                </Marker>
                {getWeather()}
                {getAllRoutes()}
            </MapView>

            <TouchableOpacity
                onPress={() => dispatch(setCurrentLocation())}
                style={styles.gpsButton}>
                <IconComponent name={'md-locate'} size={40} color={'blue'} />
            </TouchableOpacity>

            <View style={styles.routes}>{getRouteTexts()}</View>

            <View style={styles.sliderView}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={12}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTractTintColor="#1EB1FC"
                    step={1}
                    value={0}
                    onValueChange={value => {
                        let newTime = Math.floor(
                            Date.now() / 1000 + value * 3600
                        );
                        setStartTime(value);
                        dispatch(
                            getRouteWeather(
                                fetchRoute.routes,
                                fetchWeather,
                                newTime
                            )
                        );
                    }}
                    thumbTintColor="#1EB1FC"
                />
                <Text style={styles.sliderText}>
                    Start time: +{startTime} h
                </Text>
            </View>
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
        position: 'absolute',
        top: 50,
        right: 25,
    },
    timeButton: {
        position: 'absolute',
        top: 50,
        right: 75,
    },
    sliderView: {
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 5,
        height: 50,
        width: width * 0.95,
    },
    slider: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        height: 50,
        width: width * 0.9,
    },
    sliderText: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#88888844',
        padding: 5,
        fontSize: 20,
    },
    routes: {
        position: 'absolute',
        top: 30,
        left: 10,
        backgroundColor: '#88888844',
        padding: 5,
    },
});
