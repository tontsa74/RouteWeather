
const INITIAL_POSITION = {
  coords: {
    latitude: 60,
    longitude: 25,
    latitudeDelta: 1,
    longitudeDelta: 1,
  }
}

const locationReducer = (state = INITIAL_POSITION, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      return action.payload;
    default:
      return state;
  }
};

export default locationReducer;