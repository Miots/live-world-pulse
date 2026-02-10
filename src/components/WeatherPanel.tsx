import { useState, useEffect, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle, CloudFog, CloudLightning, Wind } from "lucide-react";

interface CityWeather {
  name: string;
  flag: string;
  lat: number;
  lon: number;
  temp: number | null;
  condition: string;
  conditionCode: number;
  humidity: number | null;
  windSpeed: number | null;
  loading: boolean;
}

const cityConfigs = [
  { name: "Tokyo", flag: "🇯🇵", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", flag: "🇫🇷", lat: 48.8566, lon: 2.3522 },
  { name: "New York", flag: "🇺🇸", lat: 40.7128, lon: -74.006 },
  { name: "Antananarivo", flag: "🇲🇬", lat: -18.8792, lon: 47.5079 },
];

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-6 h-6 text-yellow-400" />;
  if (code <= 3) return <Cloud className="w-6 h-6 text-muted-foreground" />;
  if (code <= 48) return <CloudFog className="w-6 h-6 text-muted-foreground" />;
  if (code <= 57) return <CloudDrizzle className="w-6 h-6 text-blue-300" />;
  if (code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
  if (code <= 77) return <CloudSnow className="w-6 h-6 text-blue-100" />;
  if (code <= 82) return <CloudRain className="w-6 h-6 text-blue-500" />;
  if (code <= 99) return <CloudLightning className="w-6 h-6 text-yellow-300" />;
  return <Cloud className="w-6 h-6 text-muted-foreground" />;
};

const getConditionLabel = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
};

const WeatherPanel = () => {
  const [weatherData, setWeatherData] = useState<CityWeather[]>(
    cityConfigs.map((c) => ({
      ...c,
      temp: null,
      condition: "Loading...",
      conditionCode: 0,
      humidity: null,
      windSpeed: null,
      loading: true,
    }))
  );

  const fetchWeather = useCallback(async () => {
    const results = await Promise.all(
      cityConfigs.map(async (city) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
          );
          const data = await res.json();
          return {
            ...city,
            temp: Math.round(data.current.temperature_2m),
            condition: getConditionLabel(data.current.weather_code),
            conditionCode: data.current.weather_code,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            loading: false,
          };
        } catch {
          return {
            ...city,
            temp: null,
            condition: "Unavailable",
            conditionCode: -1,
            humidity: null,
            windSpeed: null,
            loading: false,
          };
        }
      })
    );
    setWeatherData(results);
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        🌤 Live Weather
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {weatherData.map((city) => (
          <div key={city.name} className="glass-card p-5 space-y-3 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{city.flag}</span>
                <span className="font-semibold text-foreground">{city.name}</span>
              </div>
              {!city.loading && getWeatherIcon(city.conditionCode)}
            </div>

            {city.loading ? (
              <div className="h-12 flex items-center">
                <div className="w-16 h-6 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary number-glow">
                    {city.temp !== null ? `${city.temp}°` : "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">C</span>
                </div>
                <p className="text-sm text-muted-foreground">{city.condition}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {city.humidity !== null && (
                    <span>💧 {city.humidity}%</span>
                  )}
                  {city.windSpeed !== null && (
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" /> {city.windSpeed} km/h
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherPanel;
