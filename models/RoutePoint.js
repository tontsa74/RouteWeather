import { Coord } from "./Coord";

export class RoutePoint {
  constructor(key, latitude, longitude, duration) {
    this.key = key;
    this.coord = new Coord(latitude, longitude)
    this.duration = duration;
  }
}
