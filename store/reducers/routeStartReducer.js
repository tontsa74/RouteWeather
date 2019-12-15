const routeStartReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_ROUTE_START':
      return action.payload;
    default:
      return state;
  }
};

export default routeStartReducer;