export class Weather {
  constructor(key, coord, time, icon, summary, temperature, isVisible) {
    this.key = key;
    this.coord = coord;
    this.time = time;
    this.icon = icon;
    this.summary = summary;
    this.temperature = temperature;
    this.isVisible = isVisible;
  }
}