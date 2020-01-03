import { GET_WEATHER, GET_WEATHER_CLEAR, GET_WEATHER_FULFILLED, GET_WEATHER_REJECTED } from "../types"


const initialState = {
  weathers: [],
  loading: false,
  errorMessage: '',
}

const fetchWeatherReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_WEATHER:
      return {
        ...state,
        loading: action.loading,
      };
    case GET_WEATHER_CLEAR:
      return {
        ...state,
        loading: action.loading,
        weathers: action.payload,
      };
    case GET_WEATHER_FULFILLED:
      return {
        ...state,
        weathers: state.weathers.concat(action.payload),
        loading: action.loading,
      };
    case GET_WEATHER_REJECTED:
      return {
        ...state,
        errorMessage: action.payload,
        loading: action.loading,
      };
    default:
      return state;
  }
}

export default fetchWeatherReducer;