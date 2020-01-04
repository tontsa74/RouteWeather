import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"

const weatherTimeStep = 3600;

export const getRouteWeather = (routes) => {
  let routeWeathers = []
  let now = Math.floor(Date.now() / 1000)
  let totalDuration = 0
  let duration = 0
  return async dispatch => {
    dispatch(weatherDataClear())
    dispatch(fetchWeatherData())
    routes.forEach(route => {
      totalDuration = 0
      route.routePoints.forEach(point => {
        if (point.duration > 0) {
          totalDuration += point.duration
          duration += point.duration
          if (duration >= weatherTimeStep) {
            let latitude = point.coord.latitude
            let longitude = point.coord.longitude
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