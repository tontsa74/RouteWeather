import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"

const weatherTimeStep = 3600;

export const getRouteWeather = (locations) => {
  console.log('getRouteWeather')
  let routeWeathers = []
  let now = Math.floor(Date.now() / 1000)
  totalDuration = 0
  duration = 0
  return async dispatch => {
    console.log('getRouteWeather')
    dispatch(weatherDataClear())
    dispatch(fetchWeatherData())
    locations.routes.forEach(route => {
      totalDuration = 0
      route.legs[0].steps.forEach(step => {
        if (step.duration.value > 0) {
          totalDuration += step.duration.value
          duration += step.duration.value
          if (duration >= weatherTimeStep) {
            let latitude = step.end_location.lat
            let longitude = step.end_location.lng
            dispatch(getWeather(latitude, longitude, now + totalDuration))
            duration = 0
          }
        }
      })
    });
  }
}

export const getWeather = (latitude, longitude, time) => {
  return async dispatch => {
    try {
      console.log('getWeather')
      const url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude},${time}`
      const weatherPromise = await fetch(url)
      dispatch(fetchWeatherData())
      const weatherJson = await weatherPromise.json()
      const weather = setWeather(weatherJson)
      dispatch(fetchWeatherFulfilled(weather))
    } catch(error) {
      console.log('Getting Weathers Error-------------------', error)
      dispatch(fetchWeatherRejected(error))
    }
  }
}

const setWeather = (weatherJson) => {
  console.log('setWeather')
  let key = 0
  let weather = new Weather(
    key, 
    weatherJson.latitude, 
    weatherJson.longitude, 
    weatherJson.currently.time, 
    weatherJson.currently.icon,
  )
  return weather
}