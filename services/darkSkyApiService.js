import { darkSkyApiKey } from "../apiKey"
import { fetchWeatherFulfilled, fetchWeatherRejected, fetchWeatherData, weatherDataClear } from "../store/actions/weatherActions"
import { Weather } from "../models/Weather"
import { Coord } from "../models/Coord";

// weather step in seconds along route
const weatherTimeStep = 3600;

// values to measure if needed weather allready exists
const weatherLatAccuracy = 0.25;
const weatherLngAccuracy = 0.5;
const weatherTimeAccuracy = 1800;

// stores weathers allready fetched and currently in fetching
let tempWeathers;

// current UTC time
let now;
// total fetch needed for routes
let totalFetch;
// maximum fetch limit at once
let maxFetch = 50;

// fetch and store all weather along all routes
export const getRouteWeather = (routes, weathers, startTime) => {
  return async dispatch => {
    totalFetch = 0
    now = Math.floor(Date.now() / 1000)
    let firstTime = Math.floor(startTime) // new Date((now + 1800) * 1000).setMinutes(0,0,0) / 1000
    tempWeathers = []
    // hide all weathers from map and filter old ones
    weathers.weathers.forEach(weather => {
      if(weather.time + weatherTimeAccuracy > now) {
        weather.isVisible = false
        tempWeathers.push(weather)
      }
    })

    // clear weathers from store
    dispatch(weatherDataClear())
    dispatch(fetchWeatherData())
    // dispatch usefull weathers to store
    dispatch(fetchWeatherFulfilled(tempWeathers))

    routes.forEach((route, index) => {
      // index of route
      let routeIndex = index;
      // total duration of route
      let totalDuration = 0
      // duration counter between weather steps
      let durationCounter = 0

      // dispatch route start point weather to store
      if (routeIndex == 0) {
        let latitude = route.legs[0].start_location.lat
        let longitude = route.legs[0].start_location.lng
        dispatch(getWeather(routeIndex, latitude, longitude, firstTime))
      }
      
      // last step index of route
      let lastIndex = route.legs[0].steps.length-1

      // iterate route steps
      route.legs[0].steps.forEach((step, index) => {
        // duration of step
        let stepDuration = step.duration.value
        let stepStartLat = step.start_location.lat
        let stepStartLng = step.start_location.lng
        // dispatch weather to store calculated from route steps durations
        while (
          (durationCounter + stepDuration) >= weatherTimeStep
          // leave space to last route destination weather
          && (route.legs[0].duration.value - (totalDuration)) > (weatherTimeStep)
        ) {
          // duration needed to reach weather time step
          let durationToAdd = weatherTimeStep - durationCounter
          // calculate ratio of needed duration
          let ratio = durationToAdd / stepDuration
          // add needed to total duration
          totalDuration += durationToAdd
          // reduce needed from step duration
          stepDuration -= durationToAdd

          // use ratio to get weather coords
          let latitude = (step.end_location.lat - stepStartLat) * ratio + stepStartLat
          let longitude = (step.end_location.lng - stepStartLng) * ratio + stepStartLng
          // UTC time of weather
          let time = Math.floor(firstTime + totalDuration)
          // dispatch weather to store
          dispatch(getWeather(routeIndex, latitude, longitude, time))
          // update current step start coords
          stepStartLat = latitude
          stepStartLng = longitude
          durationCounter = 0
        }
        // add duration left from step to total duration
        totalDuration += stepDuration
        // add duration left from step to duration counter
        durationCounter += stepDuration

        // dispatch routes destination point weather to store
        if(index == lastIndex) {
          let latitude = step.end_location.lat
          let longitude = step.end_location.lng
          let time = Math.floor(firstTime + totalDuration)
          // dispatch weather to store
          dispatch(getWeather(routeIndex, latitude, longitude, time))
        }
      })
    });
  }
}

// fetch weather data with dark sky API
export const getWeather = (index, latitude, longitude, time) => {
  return async dispatch => {
    try {
      // check if data allredy exists
      let isFound = findWeather(latitude, longitude, time)
      if(totalFetch < maxFetch && !isFound) {
        totalFetch += 1
        // dispatch fetch loading status
        dispatch(fetchWeatherData())
        const url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${latitude},${longitude},${time}?units=auto`
        const weatherPromise = await fetch(url)
        const weatherJson = await weatherPromise.json()
        const weathers = setWeather(index, weatherJson)
        // dispatch weathers to store
        dispatch(fetchWeatherFulfilled(weathers))
      } 
    } catch(error) {
      console.log('Getting Weathers Error-------------------', error)
      dispatch(fetchWeatherRejected(error))
    }
  }
}

// return weathers from given json
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

// search if usefull weather data exists
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

  // save temp weather becose fetch is not instant
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