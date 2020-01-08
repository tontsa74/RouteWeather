import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"
import { Coord } from "../models/Coord";

const weatherTimeStep = 3600;
const weatherLatAccuracy = 0.25;
const weatherLngAccuracy = 0.5;
const weatherTimeAccuracy = 1800;

let tempWeathers;

let now;
let totalFetch;
let maxFetch = 50;

export const getRouteWeather = (routes, weathers) => {
  return async dispatch => {
    console.log('weathers', weathers.weathers.length)
    totalFetch = 0
    now = Math.floor(Date.now() / 1000)
    let firstTime = now // new Date((now + 1800) * 1000).setMinutes(0,0,0) / 1000
    tempWeathers = []
    weathers.weathers.forEach(weather => {
      if(weather.time + weatherTimeAccuracy > now) {
        weather.isVisible = false
        tempWeathers.push(weather)
      }
    })
    // tempWeathers = weathers.weathers
    dispatch(weatherDataClear())
    // tempWeathers.forEach((weather) => {
    //   weather.isVisible = false
    //   if (weather.time + weatherTimeAccuracy < now) {
    //     console.log('remove', weather)
    //     tempWeathers.splice(weather)
    //   }
    // })
    dispatch(fetchWeatherData())
    dispatch(fetchWeatherFulfilled(tempWeathers))
    routes.forEach((route, index) => {
      let routeIndex = index;
      let totalDuration = 0
      let durationCounter = 0
      if (routeIndex == 0) {
        let latitude = route.legs[0].start_location.lat
        let longitude = route.legs[0].start_location.lng
        dispatch(getWeather(routeIndex, latitude, longitude, firstTime))
      }
      
      let lastIndex = route.legs[0].steps.length-1
      route.legs[0].steps.forEach((step, index) => {
        let stepDuration = step.duration.value
        let stepStartLat = step.start_location.lat
        let stepStartLng = step.start_location.lng
        while (
          (durationCounter + stepDuration) >= weatherTimeStep
          && (route.legs[0].duration.value - (totalDuration)) > (weatherTimeStep)
        ) {
          let durationToAdd = weatherTimeStep - durationCounter
          let ratio = durationToAdd / stepDuration
          totalDuration += durationToAdd
          stepDuration -= durationToAdd

          let latitude = (step.end_location.lat - stepStartLat) * ratio + stepStartLat
          let longitude = (step.end_location.lng - stepStartLng) * ratio + stepStartLng
          let time = Math.floor(firstTime + totalDuration)
          dispatch(getWeather(routeIndex, latitude, longitude, time))
          stepStartLat = latitude
          stepStartLng = longitude
          durationCounter = 0
        }
        totalDuration += stepDuration
        durationCounter += stepDuration
        if(index == lastIndex) {
          let latitude = step.end_location.lat
          let longitude = step.end_location.lng
          let time = Math.floor(firstTime + totalDuration)
          dispatch(getWeather(routeIndex, latitude, longitude, time))
        }
      })
    });
  }
}

export const getWeather = (index, latitude, longitude, time) => {
  return async dispatch => {
    try {
      let isFound = findWeather(latitude, longitude, time)
      console.log('totalFetch', totalFetch)
      if(totalFetch < maxFetch && !isFound) {
        totalFetch += 1
        console.log('totalFetch', totalFetch)
        const url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude},${time}?units=auto`
        console.log(`fetch url`, url)
        const weatherPromise = await fetch(url)
        dispatch(fetchWeatherData())
        const weatherJson = await weatherPromise.json()
        const weathers = setWeather(index, weatherJson)
        dispatch(fetchWeatherFulfilled(weathers))
        console.log('tempWeathers', tempWeathers.length)
      } 
    } catch(error) {
      console.log('Getting Weathers Error-------------------', error)
      dispatch(fetchWeatherRejected(error))
    }
  }
}

const setWeather = (index, weatherJson) => {
  let weathers = []
  let coord = new Coord( weatherJson.latitude, weatherJson.longitude, )
  let weather = new Weather(
    index, 
    coord,
    weatherJson.currently.time, 
    weatherJson.currently.icon,
    weatherJson.currently.summary,
    weatherJson.currently.temperature,
    true,
  )
  weathers.push(weather)
  weatherJson.hourly.data.forEach((hour) => {
    if (hour.time + weatherTimeAccuracy > now) {
      let weather = new Weather(
        index, 
        coord,
        hour.time, 
        hour.icon,
        hour.summary,
        hour.temperature,
        false,
      )
      weathers.push(weather)
    }
  })
  // tempWeathers.concat(weathers)
  return weathers
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
      console.log(`found`)
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