import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"
import { Coord } from "../models/Coord";

const weatherTimeStep = 3600;

export const getRouteWeather = (routes) => {
  let now = Math.floor(Date.now() / 1000)
  let totalDuration = 0
  let duration = 0
  return async dispatch => {
    dispatch(weatherDataClear())
    dispatch(fetchWeatherData())
    routes.forEach((route, index) => {
      let routeIndex = index;
      totalDuration = 0
      if (index == 0) {
        let latitude = route.legs[0].start_location.lat
        let longitude = route.legs[0].start_location.lng
        dispatch(getWeather(routeIndex, latitude, longitude, now))
      }
      let lastIndex = route.legs[0].steps.length-1
      route.legs[0].steps.forEach((step, index) => {
        let value = step.duration.value
        if (value > 0) {
          totalDuration += value
          duration += value
          if (duration >= weatherTimeStep * 2) {
            let latitude = (step.start_location.lat + step.end_location.lat) / 2
            let longitude = (step.start_location.lng + step.end_location.lng) / 2
            let time = Math.floor(now + totalDuration - (duration / 2))
            dispatch(getWeather(routeIndex, latitude, longitude, time))
          }
          if (duration >= weatherTimeStep || index == lastIndex) {
            let latitude = step.end_location.lat
            let longitude = step.end_location.lng
            dispatch(getWeather(routeIndex, latitude, longitude, now + totalDuration))
            duration = 0
          }
        }
      })
    });
  }
}

export const getWeather = (index, latitude, longitude, time) => {
  console.log('time', time)
  return async dispatch => {
    try {
      const url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude},${time}`
      const weatherPromise = await fetch(url)
      dispatch(fetchWeatherData())
      const weatherJson = await weatherPromise.json()
      const weather = setWeather(index, weatherJson)
      dispatch(fetchWeatherFulfilled(weather))
    } catch(error) {
      console.log('Getting Weathers Error-------------------', error)
      dispatch(fetchWeatherRejected(error))
    }
  }
}

const setWeather = (index, weatherJson) => {
  let weather = new Weather(
    index, 
    new Coord(
      weatherJson.latitude, 
      weatherJson.longitude, 
    ),
    weatherJson.currently.time, 
    weatherJson.currently.icon,
  )
  return weather
}