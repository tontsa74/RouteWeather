import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"
import { Coord } from "../models/Coord";

const weatherTimeStep = 3600;
const weatherLatAccuracy = 0.25;
const weatherLngAccuracy = 0.5;
const weatherTimeAccuracy = 1800;

let tempWeathers;

let totalFetch;
let maxFetch = 50;

export const getRouteWeather = (routes, weather) => {
  totalFetch = 0
  let now = Math.floor(Date.now() / 1000)
  console.log('now', now)
  console.log('total weathers', weather.weathers.length)
  let totalDuration = 0
  let duration = 0
  return async dispatch => {
    tempWeathers = weather.weathers
    dispatch(weatherDataClear())
    tempWeathers.forEach((weather) => {
      weather.isVisible = false
      if (weather.time + weatherTimeAccuracy < now) {
        console.log('remove', weather.time)
        tempWeathers.splice(weather)
      }
    })
    dispatch(fetchWeatherData())
    dispatch(fetchWeatherFulfilled(tempWeathers))
    routes.forEach((route, index) => {
      let routeIndex = index;
      totalDuration = 0
      duration = 0
      if (routeIndex == 0) {
        let latitude = route.legs[0].start_location.lat
        let longitude = route.legs[0].start_location.lng
        dispatch(getWeather(routeIndex, latitude, longitude, now))
      }
      let firstTime = new Date((now + 1800) * 1000).setMinutes(0,0,0) / 1000
      
      let lastIndex = route.legs[0].steps.length-1
      route.legs[0].steps.forEach((step, index) => {
        let stepDuration = step.duration.value
        let stepStartLat = step.start_location.lat
        let stepStartLng = step.start_location.lng
        while (
          (duration + stepDuration) >= weatherTimeStep 
          && (route.legs[0].duration.value - (totalDuration)) >= (weatherTimeStep * 1)
        ) {
          let durationToAdd = weatherTimeStep - duration
          let ratio = durationToAdd / stepDuration
          totalDuration += durationToAdd
          stepDuration -= durationToAdd

          let latitude = (step.end_location.lat - stepStartLat) * ratio + stepStartLat
          let longitude = (step.end_location.lng - stepStartLng) * ratio + stepStartLng
          let time = Math.floor(firstTime + totalDuration)
          dispatch(getWeather(routeIndex, latitude, longitude, time))
          stepStartLat = latitude
          stepStartLng = longitude
          duration = 0
        }
        totalDuration += stepDuration
        duration += stepDuration
        if(index == lastIndex) {
          let latitude = step.end_location.lat
          let longitude = step.end_location.lng
          dispatch(getWeather(routeIndex, latitude, longitude, now + totalDuration))
        }
      })
    });
  }
}

export const getWeather = (index, latitude, longitude, time) => {
  return async dispatch => {
    try {
      if(totalFetch < maxFetch && !findWeather(latitude, longitude, time)) {
        totalFetch += 1
        const url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude},${time}?units=auto`
        const weatherPromise = await fetch(url)
        dispatch(fetchWeatherData())
        const weatherJson = await weatherPromise.json()
        const weather = setWeather(index, weatherJson)
        dispatch(fetchWeatherFulfilled(weather))
      } 
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
    weatherJson.currently.summary,
    weatherJson.currently.temperature,
    true,
  )
  return weather
}

const findWeather = (latitude, longitude, time) => {
  let result = false
  tempWeathers.forEach(weather => {
  if (
    (Math.abs(latitude - weather.coord.latitude) <  weatherLatAccuracy) &&
    (Math.abs(longitude - weather.coord.longitude) <  weatherLngAccuracy) &&
    (Math.abs(time - weather.time) < weatherTimeAccuracy)) {
      result = true
      weather.isVisible = true
    }
  })

  if (!result) {
    let weather = new Weather(
      0, 
      new Coord(
        latitude, 
        longitude, 
      ),
      time,
    )
    tempWeathers.push(weather)
  }

  return result
}