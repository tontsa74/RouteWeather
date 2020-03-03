import {
    fetchData,
    fetchDataFulfilled,
    fetchDataRejected,
    setRouteStart,
    setRouteDestination,
    setMapRegion,
} from '../store/actions/actions';
import { apiKey } from '../apiKey';
import { getRouteWeather } from './darkSkyApiService';

// fetch route points to store and start weather fetching
export const getRouteLocations = (start, destination, weather, startTime) => {
    return async dispatch => {
        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${apiKey}&alternatives=true`;
            const directionsPromise = await fetch(url);
            dispatch(fetchData());
            const directionsJson = await directionsPromise.json();
            console.log(directionsJson);
            if (directionsJson.status === 'OK') {
                dispatch(fetchDataFulfilled(directionsJson.routes));
                // get weathers along routes with darkSkyApiService
                dispatch(
                    getRouteWeather(directionsJson.routes, weather, startTime)
                );
                const mapRegion = setRegion(directionsJson.routes);
                dispatch(setMapRegion(mapRegion));
            } else {
                console.log(directionsJson.status);
                throw directionsJson.status;
            }
        } catch (error) {
            console.log('Getting Locations Error---------', error);
            dispatch(fetchDataRejected(error));
        }
    };
};

// return region of all routes bounds
const setRegion = routes => {
    let maxLat, minLat, maxLng, minLng;
    routes.forEach((route, index) => {
        if (maxLat < route.bounds.northeast.lat || index == 0) {
            maxLat = route.bounds.northeast.lat;
        }
        if (maxLng < route.bounds.northeast.lng || index == 0) {
            maxLng = route.bounds.northeast.lng;
        }
        if (minLat > route.bounds.southwest.lat || index == 0) {
            minLat = route.bounds.southwest.lat;
        }
        if (minLng > route.bounds.southwest.lng || index == 0) {
            minLng = route.bounds.southwest.lng;
        }
    });
    let latitude = (maxLat + minLat) * 0.5;
    let longitude = (maxLng + minLng) * 0.5;
    let latitudeDelta = +(maxLat - minLat) * 1.5;
    let longitudeDelta = +(maxLng - minLng) * 1.5;
    let region = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
    };
    return region;
};

// fetch address to store address of coords
export const geoCode = (sender, latitude, longitude) => {
    return async dispatch => {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
            const geocodePromise = await fetch(url);
            const geocodeJson = await geocodePromise.json();
            const address = geocodeJson.results[0].formatted_address;
            console.log('geoCode', address);
            switch (sender) {
                case 'start': {
                    dispatch(setRouteStart(address));
                    break;
                }
                case 'destination': {
                    dispatch(setRouteDestination(address));
                    break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
};
