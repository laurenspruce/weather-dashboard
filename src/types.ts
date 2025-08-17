// Using Open-Meteo for Geocoding API types
export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone?: string;
  }>;
}

export interface CurrentWeather {
  temperature: number;       // °C
  windspeed: number;         // km/h
  winddirection: number;     // degrees
  weathercode: number;       // WMO code
  time: string;              // ISO timestamp
}

export interface DailyUnits {
  time: string;
  weathercode: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface Daily {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: Daily;
  daily_units: DailyUnits;
}