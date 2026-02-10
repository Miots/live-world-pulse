import { useState, useEffect } from "react";

interface City {
  name: string;
  timezone: string;
  flag: string;
  country: string;
}

const cities: City[] = [
  { name: "Tokyo", timezone: "Asia/Tokyo", flag: "🇯🇵", country: "Japan" },
  { name: "Paris", timezone: "Europe/Paris", flag: "🇫🇷", country: "France" },
  { name: "New York", timezone: "America/New_York", flag: "🇺🇸", country: "USA" },
  { name: "Antananarivo", timezone: "Indian/Antananarivo", flag: "🇲🇬", country: "Madagascar" },
];

const TimePanel = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getLocalTime = (timezone: string) => {
    return now.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getLocalDate = (timezone: string) => {
    return now.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        🕐 World Clocks
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <div key={city.name} className="glass-card p-5 space-y-3 group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xl">{city.flag}</span>
              <div>
                <p className="font-semibold text-foreground">{city.name}</p>
                <p className="text-xs text-muted-foreground">{city.country}</p>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-mono font-bold text-primary number-glow tracking-wider">
              {getLocalTime(city.timezone)}
            </p>
            <p className="text-xs text-muted-foreground">{getLocalDate(city.timezone)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimePanel;
