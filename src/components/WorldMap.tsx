import { useState, useEffect, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

// URL de la topoJSON du monde
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PulsePoint {
  id: number;
  coordinates: [number, number];
  createdAt: number;
  intensity: number;
}

// Coordonnées des principales villes mondiales (longitude, latitude)
const MAJOR_CITIES = [
  { name: "London", coordinates: [-0.1276, 51.5072] },
  { name: "Paris", coordinates: [2.3522, 48.8566] },
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { name: "Delhi", coordinates: [77.1025, 28.7041] },
  { name: "Shanghai", coordinates: [121.4737, 31.2304] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522] },
  { name: "Chicago", coordinates: [-87.6298, 41.8781] },
  { name: "Moscow", coordinates: [37.6173, 55.7558] },
  { name: "Dubai", coordinates: [55.2708, 25.2048] },
  { name: "Mumbai", coordinates: [72.8777, 19.0760] },
  { name: "Beijing", coordinates: [116.4074, 39.9042] },
  { name: "Seoul", coordinates: [126.9780, 37.5665] },
  { name: "Hong Kong", coordinates: [114.1694, 22.3193] },
  { name: "Bangkok", coordinates: [100.5018, 13.7563] },
  { name: "Jakarta", coordinates: [106.8456, -6.2088] },
  { name: "Cairo", coordinates: [31.2357, 30.0444] },
  { name: "Nairobi", coordinates: [36.8219, -1.2921] },
  { name: "Lagos", coordinates: [3.3792, 6.5244] },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505] },
  { name: "Mexico City", coordinates: [-99.1332, 19.4326] },
  { name: "Toronto", coordinates: [-79.3832, 43.6532] },
  { name: "Berlin", coordinates: [13.4050, 52.5200] },
  { name: "Madrid", coordinates: [-3.7038, 40.4168] },
  { name: "Rome", coordinates: [12.4964, 41.9028] },
  { name: "Istanbul", coordinates: [28.9784, 41.0082] },
];

const WorldMap = () => {
  const [pulses, setPulses] = useState<PulsePoint[]>([]);
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const nextId = useRef(0);

  const addPulse = useCallback(() => {
    // Sélectionner une ville aléatoire
    const city = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
    
    const id = nextId.current++;
    const intensity = 0.5 + Math.random() * 0.5;
    
    setPulses((prev) => [
      ...prev.slice(-30), 
      { 
        id, 
        coordinates: city.coordinates,
        createdAt: Date.now(),
        intensity
      }
    ]);
    
    // Marquer la ville comme active
    setActiveCities(prev => {
      const newSet = new Set(prev);
      newSet.add(city.name);
      return newSet;
    });
    
    // Retirer après un délai
    setTimeout(() => {
      setActiveCities(prev => {
        const newSet = new Set(prev);
        newSet.delete(city.name);
        return newSet;
      });
    }, 1500);
  }, []);

  useEffect(() => {
    // Pulsations initiales
    for (let i = 0; i < 10; i++) {
      setTimeout(addPulse, i * 300);
    }
    
    const interval = setInterval(addPulse, 700 + Math.random() * 300);
    return () => clearInterval(interval);
  }, [addPulse]);

  // Nettoyer les anciennes pulsations
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPulses((prev) => prev.filter((p) => Date.now() - p.createdAt < 4000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        🌍 World Activity Map
      </h2>
      <div className="glass-card-glow p-2 md:p-4 overflow-hidden relative rounded-lg">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20]
          }}
          style={{
            width: "100%",
            height: "auto",
            minHeight: "220px",
            borderRadius: "6px",
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={8}
          >
            {/* Océan */}
            <rect x={-2000} y={-1000} width={4000} height={2000} fill="#0a192f" />
            
            {/* Grille de latitude/longitude */}
            <g stroke="#1e3a8a" strokeWidth="0.3" opacity="0.3">
              {[-180, -120, -60, 0, 60, 120, 180].map((lon) => (
                <line
                  key={`lon${lon}`}
                  x1={lon}
                  y1={-90}
                  x2={lon}
                  y2={90}
                  strokeDasharray="2,2"
                />
              ))}
              {[-60, -30, 0, 30, 60].map((lat) => (
                <line
                  key={`lat${lat}`}
                  x1={-180}
                  y1={lat}
                  x2={180}
                  y2={lat}
                  strokeDasharray="2,2"
                />
              ))}
            </g>

            {/* Pays */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const isSmall = geo.properties.name === "Antarctica" || 
                                Math.abs(centroid[1]) > 70;
                  
                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        fill="#1e3a5f"
                        stroke="#2d4a7f"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#2d5a9f", outline: "none" },
                          pressed: { fill: "#2d5a9f", outline: "none" },
                        }}
                      />
                      {!isSmall && geo.properties.name && (
                        <Marker coordinates={centroid as [number, number]}>
                          <text
                            fontSize={7}
                            fill="#94a3b8"
                            textAnchor="middle"
                            opacity={0.6}
                            style={{
                              pointerEvents: "none",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {geo.properties.name.length > 10
                              ? `${geo.properties.name.substring(0, 8)}...`
                              : geo.properties.name}
                          </text>
                        </Marker>
                      )}
                    </g>
                  );
                })
              }
            </Geographies>

            {/* Pulsations d'activité */}
            {pulses.map((pulse) => (
              <g key={pulse.id}>
                <Marker coordinates={pulse.coordinates}>
                  <circle
                    r={8 * pulse.intensity}
                    fill="url(#pulseGrad)"
                    opacity={0.6 * pulse.intensity}
                    style={{
                      animation: `pulse ${1.5 / pulse.intensity}s ease-out infinite`,
                    }}
                  />
                  <circle
                    r={3 * pulse.intensity}
                    fill="#22d3ee"
                    opacity={0.9 * pulse.intensity}
                  />
                </Marker>
              </g>
            ))}

            {/* Villes majeures */}
            {MAJOR_CITIES.slice(0, 15).map((city) => {
              const isActive = activeCities.has(city.name);
              return (
                <Marker key={city.name} coordinates={city.coordinates}>
                  <g>
                    {isActive && (
                      <circle
                        r={14}
                        fill="url(#activeCityGlow)"
                        opacity={0.5}
                        style={{
                          animation: "glow 1.5s ease-in-out infinite",
                        }}
                      />
                    )}
                    <circle
                      r={isActive ? 6 : 4}
                      fill={isActive ? "#22d3ee" : "#0ea5e9"}
                      stroke="#1e40af"
                      strokeWidth={0.5}
                      style={{
                        transition: "all 0.3s ease",
                        filter: "drop-shadow(0 0 2px rgba(34, 211, 238, 0.5))",
                      }}
                    />
                    <circle
                      r={1.5}
                      fill="#ffffff"
                    />
                    <text
                      x={12}
                      y={4}
                      fontSize={9}
                      fill={isActive ? "#22d3ee" : "#94a3b8"}
                      fontWeight="500"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        pointerEvents: "none",
                        transition: "all 0.3s ease",
                        textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                      }}
                    >
                      {city.name}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Définitions SVG pour les gradients */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <radialGradient id="pulseGrad">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="activeCityGlow">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cityGlow">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Légende */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <span className="text-white/90 font-medium">Major Cities</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></div>
              <span className="text-white/90 font-medium">Live Activity</span>
            </div>
          </div>
        </div>

        {/* Compteur d'activité */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs border border-white/10">
          <div className="flex items-center space-x-2 text-white/90">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-medium">{pulses.length} active signals</span>
          </div>
        </div>

        {/* Contrôles de zoom */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          <button
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.2, 8) }))}
            className="w-7 h-7 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded text-white/90 hover:bg-black/60 transition-colors border border-white/10"
          >
            +
          </button>
          <button
            onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.2, 1) }))}
            className="w-7 h-7 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded text-white/90 hover:bg-black/60 transition-colors border border-white/10"
          >
            -
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        :global(.rsm-geography) {
          transition: fill 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default WorldMap;