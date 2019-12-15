const routeDestinationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_ROUTE_DESTINATION':
      if(action.payload === 'Test') {
        throw new Error('errori')
      }
      return action.payload;
    default:
      return state;
  }
};

export default routeDestinationReducer;