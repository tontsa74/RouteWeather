export class RoutePoint {
  constructor(key, latitude, longitude) {
    this.key = key;
    // this.latitude = latitude;
    // this.longitude = longitude;
    this.coord = new Coord(latitude, longitude)
  }
}

class Coord {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}