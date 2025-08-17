import type { GeocodingResponse, ForecastResponse } from "./types";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Map WMO weather codes to a label
export function describeWeatherCode(code: number): string {
  // Source: Open-Meteo docs (simplified mapping)
  const map: Record<number, string> = {
    0: "Clear ☀️",
    1: "Mostly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌧️",
    53: "Drizzle 🌧️",
    55: "Dense drizzle 🌧️",
    56: "Freezing drizzle ❄️",
    57: "Freezing drizzle ❄️",
    61: "Light rain 🌧️",
    63: "Rain 🌧️",
    65: "Heavy rain 🌧️",
    66: "Freezing rain ❄️",
    67: "Freezing rain ❄️",
    71: "Light snow 🌨️",
    73: "Snow 🌨️",
    75: "Heavy snow 🌨️",
    77: "Snow grains 🌨️",
    80: "Rain showers 🌦️",
    81: "Rain showers 🌦️",
    82: "Violent rain showers ⛈️",
    85: "Snow showers 🌨️",
    86: "Snow showers 🌨️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm + hail ⛈️",
    99: "Thunderstorm + hail ⛈️",
  };
  return map[code] ?? `Code ${code}`;
}

export async function geocodeCity(name: string) {
  const url = new URL(GEOCODE_URL);
  url.searchParams.set("name", name);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = (await res.json()) as GeocodingResponse;

  const place = data.results?.[0];
  if (!place) throw new Error(`No results for "${name}".`);
  return {
    name: `${place.name}${place.admin1 ? ", " + place.admin1 : ""}, ${place.country}`,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

export async function fetchForecast(lat: number, lon: number) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("daily", "weathercode,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "5");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`);
  const data = (await res.json()) as ForecastResponse;
  return data;
}