import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchDataRejected, setCurrentLocationRejected } from '../store/actions/actions';
import { fetchWeatherRejected } from '../store/actions/weatherActions';

export default function ErrorMessage() {
    const fetchRoute = useSelector(state => state.fetchRoute);
    const fetchWeather = useSelector(state => state.fetchWeather);
    const currentLocation = useSelector(state => state.currentLocation);

    const dispatch = useDispatch();

    const fetchRouteErrorClicked = () => {
        dispatch(fetchDataRejected(''));
    };

    const fetchWeatherErrorClicked = () => {
        dispatch(fetchWeatherRejected(''));
    };

    const currentLocationErrorClicked = () => {
        dispatch(setCurrentLocationRejected(''));
    };

    return (
        <View>
            {fetchRoute.errorMessage != '' && (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => fetchRouteErrorClicked()}>
                    <Text>Route Error:</Text>
                    <Text>{JSON.stringify(fetchRoute.errorMessage)}</Text>
                </TouchableOpacity>
            )}
            {fetchWeather.errorMessage != '' && (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => fetchWeatherErrorClicked()}>
                    <Text>Weather Error:</Text>
                    <Text>{JSON.stringify(fetchWeather.errorMessage)}</Text>
                </TouchableOpacity>
            )}
            {currentLocation.errorMessage != '' && (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => currentLocationErrorClicked()}>
                    <Text>Location Error:</Text>
                    <Text>{JSON.stringify(currentLocation.errorMessage)}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f55',
        borderWidth: 1,
        padding: 5,
    },
});
