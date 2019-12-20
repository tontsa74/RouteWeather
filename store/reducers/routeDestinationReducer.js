import { SET_ROUTE_DESTINATION } from "../types";

const routeDestinationReducer = (state = '', action) => {
  switch (action.type) {
    case SET_ROUTE_DESTINATION:
      return action.payload;
    default:
      return state;
  }
};

export default routeDestinationReducer;