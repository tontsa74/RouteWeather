export class RouteLeg {
  constructor(key, distance, duration, endCoord, startCoord, routePoints) {
    this.key = key;
    this.distance = distance;
    this.duration = duration;
    this.endCoord = endCoord;
    this.startCoord = startCoord;
    this.routePoints = routePoints;
  }
}
