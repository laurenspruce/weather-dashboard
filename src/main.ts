import "./style.css";
import { describeWeatherCode, geocodeCity, fetchForecast } from "./weather";

const form = document.querySelector<HTMLFormElement>("#search-form")!;
const input = document.querySelector<HTMLInputElement>("#city-input")!;
const statusEl = document.querySelector<HTMLElement>("#status")!;
const currentCard = document.querySelector<HTMLDivElement>("#current-card")!;
const forecastGrid = document.querySelector<HTMLDivElement>("#forecast-grid")!;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;

  clearUI();
  setStatus(`Searching "${city}"...`);

  try {
    const { name, latitude, longitude } = await geocodeCity(city);
    setStatus(`Found: ${name}. Fetching weather...`);

    const forecast = await fetchForecast(latitude, longitude);
    renderCurrent(forecast);
    renderForecast(forecast);
    setStatus(`Showing weather for ${name}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setStatus(msg);
  }
});

function clearUI() {
  currentCard.innerHTML = "";
  forecastGrid.innerHTML = "";
}

function setStatus(message: string) {
  statusEl.textContent = message;
}

function renderCurrent(data: Awaited<ReturnType<typeof fetchForecast>>) {
  const c = data.current_weather;
  const label = describeWeatherCode(c.weathercode);
  const html = `
    <div class="row"><div class="temp">${Math.round(c.temperature)}°C</div><div>${label}</div></div>
    <div class="row small"><div>Wind</div><div>${Math.round(c.windspeed)} km/h</div></div>
    <div class="row small"><div>Direction</div><div>${Math.round(c.winddirection)}°</div></div>
    <div class="row small"><div>As of</div><div>${new Date(c.time).toLocaleString()}</div></div>
  `;
  currentCard.innerHTML = html;
}

function renderForecast(data: Awaited<ReturnType<typeof fetchForecast>>) {
  const { time, weathercode, temperature_2m_max, temperature_2m_min } = data.daily;

  const days = time.map((iso, i) => ({
    date: new Date(iso),
    label: describeWeatherCode(weathercode[i]),
    tMax: Math.round(temperature_2m_max[i]),
    tMin: Math.round(temperature_2m_min[i]),
  }));

  forecastGrid.innerHTML = days
    .map(
      (d) => `
      <div class="day">
        <div class="small">${d.date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</div>
        <div style="margin:.4rem 0;">${d.label}</div>
        <div class="row"><div>High</div><div class="temp">${d.tMax}°C</div></div>
        <div class="row"><div>Low</div><div>${d.tMin}°C</div></div>
      </div>`
    )
    .join("");
}

// Optional: run an initial query for UX
(async () => {
  input.value = "London";
  form.dispatchEvent(new Event("submit"));
})();