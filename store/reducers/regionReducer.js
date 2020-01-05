import { SET_MAP_REGION } from "../types";

const initialState = {
  region: {
    latitude: 60,
    longitude: 25,
    latitudeDelta: 10,
    longitudeDelta: 10,
  }
}

const regionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAP_REGION:
      return {
        ...state,
        region: action.payload,
      };
    default:
      return state;
  }
};

export default regionReducer;