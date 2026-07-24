export type TempUnit = "metric" | "imperial";
export type WindUnit = "kmh" | "mph" | "ms";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  coords: Coordinates;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  dt: number;
  timezoneOffset: number;
}

export interface HourlyForecastItem {
  dt: number;
  temp: number;
  icon: string;
  condition: string;
  pop: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecastItem {
  dt: number;
  tempMin: number;
  tempMax: number;
  icon: string;
  condition: string;
  pop: number;
  windSpeed: number;
  humidity: number;
}

export interface AirQuality {
  aqi: number;
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export type WeatherScene =
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "mist";

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}
