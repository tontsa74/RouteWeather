import { GET_WEATHER, GET_WEATHER_FULFILLED, GET_WEATHER_REJECTED, GET_WEATHER_CLEAR } from "../types"


export const fetchWeatherData = () => {
  return {
    type: GET_WEATHER,
    loading: true,
  }
}

export const weatherDataClear = () => {
  return {
    type: GET_WEATHER_CLEAR,
    payload: [],
    loading: false,
  }
}

export const fetchWeatherFulfilled = (data) => {
  return {
    type: GET_WEATHER_FULFILLED,
    payload: data,
    loading: false,
  }
}

export const fetchWeatherRejected = (error) => {
  return {
    type: GET_WEATHER_REJECTED,
    payload: error,
    loading: false,
  }
}