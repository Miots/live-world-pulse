import { useState, useEffect, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// URL de la carte du monde
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Coordonnées des villes
const MAJOR_CITIES = [
  { name: "London", coordinates: [-0.1276, 51.5072] },
  { name: "Paris", coordinates: [2.3522, 48.8566] },
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { name: "Delhi", coordinates: [77.1025, 28.7041] },
  { name: "Shanghai", coordinates: [121.4737, 31.2304] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505] },
  { name: "Nairobi", coordinates: [36.8219, -1.2921] },
];

interface Pulse {
  id: number;
  coordinates: [number, number];
  createdAt: number;
}

const WorldMap = () => {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const nextId = useRef(0);

  const addPulse = useCallback(() => {
    const city = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
    setPulses((prev) => [
      ...prev.slice(-20),
      { id: nextId.current++, coordinates: city.coordinates, createdAt: Date.now() }
    ]);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 5; i++) setTimeout(addPulse, i * 200);
    const interval = setInterval(addPulse, 1000);
    return () => clearInterval(interval);
  }, [addPulse]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setPulses((prev) => prev.filter((p) => Date.now() - p.createdAt < 3000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="w-full h-full bg-[#0a1929] rounded-lg overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [0, 20] }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Fond océan */}
        <rect width={1000} height={600} fill="#0a1929" />
        
        {/* Carte */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e3a5f"
                stroke="#2d4a7f"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#2d5a9f", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Pulsations */}
        {pulses.map((pulse) => (
          <Marker key={pulse.id} coordinates={pulse.coordinates}>
            <circle r={12} fill="#22d3ee" opacity={0.4}>
              <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r={4} fill="#22d3ee" />
          </Marker>
        ))}

        {/* Villes */}
        {MAJOR_CITIES.map((city) => (
          <Marker key={city.name} coordinates={city.coordinates}>
            <circle r={3} fill="#0ea5e9" stroke="#ffffff" strokeWidth={0.5} />
            <text x={8} y={4} fontSize={8} fill="#94a3b8">
              {city.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Légende */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded text-xs">
        <div className="flex items-center gap-3 text-white/90">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
            Cities
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;