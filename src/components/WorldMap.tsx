import { useState, useEffect, useRef, useCallback } from "react";

interface PulsePoint {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  intensity: number;
}

// Coordonnées des principales villes mondiales (approximatives pour la projection de la carte)
const MAJOR_CITIES = [
  { name: "London", x: 485, y: 122 },
  { name: "Paris", x: 490, y: 130 },
  { name: "New York", x: 280, y: 142 },
  { name: "Tokyo", x: 840, y: 160 },
  { name: "Delhi", x: 650, y: 168 },
  { name: "Shanghai", x: 790, y: 175 },
  { name: "Singapore", x: 740, y: 235 },
  { name: "Sydney", x: 880, y: 320 },
  { name: "Los Angeles", x: 195, y: 165 },
  { name: "Chicago", x: 250, y: 135 },
  { name: "Moscow", x: 550, y: 115 },
  { name: "Dubai", x: 590, y: 185 },
  { name: "Mumbai", x: 635, y: 200 },
  { name: "Beijing", x: 770, y: 150 },
  { name: "Seoul", x: 815, y: 155 },
  { name: "Hong Kong", x: 785, y: 190 },
  { name: "Bangkok", x: 720, y: 205 },
  { name: "Jakarta", x: 750, y: 265 },
  { name: "Cairo", x: 530, y: 180 },
  { name: "Nairobi", x: 565, y: 245 },
  { name: "Lagos", x: 500, y: 230 },
  { name: "São Paulo", x: 355, y: 320 },
  { name: "Mexico City", x: 235, y: 195 },
  { name: "Toronto", x: 285, y: 125 },
  { name: "Berlin", x: 500, y: 125 },
  { name: "Madrid", x: 470, y: 150 },
  { name: "Rome", x: 510, y: 145 },
  { name: "Istanbul", x: 560, y: 150 },
  { name: "Tehran", x: 620, y: 165 },
  { name: "Karachi", x: 640, y: 185 },
  { name: "Dhaka", x: 700, y: 180 },
  { name: "Manila", x: 820, y: 215 },
  { name: "Ho Chi Minh", x: 760, y: 215 },
  { name: "Perth", x: 780, y: 320 },
  { name: "Auckland", x: 960, y: 335 },
  { name: "Honolulu", x: 450, y: 215 },
  { name: "Anchorage", x: 180, y: 95 },
  { name: "Reykjavik", x: 430, y: 100 },
  { name: "Oslo", x: 505, y: 110 },
  { name: "Stockholm", x: 520, y: 110 },
  { name: "Helsinki", x: 540, y: 110 },
  { name: "Warsaw", x: 525, y: 125 },
  { name: "Prague", x: 510, y: 130 },
  { name: "Vienna", x: 520, y: 135 },
  { name: "Budapest", x: 530, y: 135 },
  { name: "Athens", x: 540, y: 155 },
];

const WorldMap = () => {
  const [pulses, setPulses] = useState<PulsePoint[]>([]);
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set());
  const nextId = useRef(0);

  const addPulse = useCallback(() => {
    // Sélectionner une ville aléatoire parmi les grandes villes
    const city = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
    
    const id = nextId.current++;
    const intensity = 0.5 + Math.random() * 0.5; // Intensité aléatoire entre 0.5 et 1
    
    setPulses((prev) => [
      ...prev.slice(-40), 
      { 
        id, 
        x: city.x + (Math.random() * 6 - 3), // Légère variation
        y: city.y + (Math.random() * 6 - 3),
        createdAt: Date.now(),
        intensity
      }
    ]);
    
    // Marquer la ville comme active temporairement
    setActiveCities(prev => {
      const newSet = new Set(prev);
      newSet.add(city.name);
      return newSet;
    });
    
    // Retirer la ville de l'ensemble actif après 1.5 secondes
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
    for (let i = 0; i < 12; i++) {
      setTimeout(addPulse, i * 250);
    }
    
    const interval = setInterval(addPulse, 600 + Math.random() * 400);
    return () => clearInterval(interval);
  }, [addPulse]);

  // Nettoyer les anciennes pulsations
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPulses((prev) => prev.filter((p) => Date.now() - p.createdAt < 3500));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        🌍 World Activity Map
      </h2>
      <div className="glass-card-glow p-2 md:p-4 overflow-hidden relative rounded-lg">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-auto"
          style={{ minHeight: 220 }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient pour l'océan */}
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(215, 70%, 12%)" />
              <stop offset="50%" stopColor="hsl(215, 70%, 8%)" />
              <stop offset="100%" stopColor="hsl(215, 80%, 5%)" />
            </linearGradient>

            {/* Gradient pour la terre */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(160, 25%, 18%)" />
              <stop offset="50%" stopColor="hsl(160, 30%, 14%)" />
              <stop offset="100%" stopColor="hsl(160, 35%, 12%)" />
            </linearGradient>

            {/* Gradient pour les pulsations */}
            <radialGradient id="pulseGrad">
              <stop offset="0%" stopColor="hsl(190, 95%, 70%)" stopOpacity="0.9" />
              <stop offset="70%" stopColor="hsl(190, 95%, 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(190, 95%, 45%)" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="cityGlow">
              <stop offset="0%" stopColor="hsl(190, 95%, 60%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(190, 95%, 45%)" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="activeCityGlow">
              <stop offset="0%" stopColor="hsl(190, 95%, 75%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(190, 95%, 55%)" stopOpacity="0" />
            </radialGradient>

            {/* Filtres pour les effets */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feFlood floodColor="hsl(190, 95%, 60%)" floodOpacity="0.3" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Fond océanique */}
          <rect width="1000" height="500" fill="url(#oceanGradient)" rx="6" />

          {/* Grille de latitude/longitude subtile */}
          <g stroke="hsl(220, 30%, 15%)" strokeWidth="0.3" opacity="0.4">
            {[100, 200, 300, 400].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} />
            ))}
            {[200, 400, 600, 800].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" />
            ))}
          </g>

          {/* Carte du monde SVG (formes simplifiées mais réalistes) */}
          <g fill="url(#landGradient)" stroke="hsl(160, 30%, 25%)" strokeWidth="0.5">
            {/* Amérique du Nord */}
            <path d="M150,70 L180,60 L220,50 L270,45 L320,50 L350,60 L360,75 L355,95 L340,110 L325,120 L310,130 L290,140 L270,145 L250,150 L230,155 L210,160 L190,165 L175,155 L165,140 L160,125 L155,110 L150,95 L145,85 L130,80 L120,85 L110,90 L100,85 L90,80 L85,75 L80,70 L85,65 L95,60 L105,55 L115,60 L125,65 L135,70 Z" />
            
            {/* Amérique du Sud */}
            <path d="M240,220 L260,215 L285,210 L310,215 L330,225 L345,240 L355,260 L360,280 L355,300 L345,320 L330,340 L310,360 L285,375 L260,380 L240,375 L230,360 L220,340 L215,320 L210,300 L208,280 L210,260 L215,240 L225,230 Z" />
            
            {/* Europe */}
            <path d="M450,100 L470,95 L490,90 L510,85 L530,90 L550,95 L570,105 L560,120 L540,130 L520,135 L500,130 L480,125 L460,120 L450,110 Z" />
            <path d="M420,120 L440,115 L455,125 L450,140 L435,145 L420,135 Z" />
            <path d="M480,135 L495,130 L505,140 L500,155 L490,160 L480,150 Z" />
            
            {/* Afrique */}
            <path d="M460,150 L480,145 L500,150 L520,160 L530,175 L535,190 L530,205 L520,220 L505,230 L485,235 L465,230 L450,220 L440,205 L435,190 L440,175 L450,160 Z" />
            
            {/* Asie */}
            <path d="M580,100 L600,95 L620,90 L640,95 L660,105 L670,120 L665,135 L650,145 L630,150 L610,145 L590,135 L580,120 Z" />
            
            {/* Chine/Asie de l'Est */}
            <path d="M680,110 L700,105 L720,110 L740,120 L750,135 L745,150 L730,160 L710,155 L695,145 L685,130 Z" />
            
            {/* Inde */}
            <path d="M620,170 L640,165 L655,175 L650,190 L635,200 L615,195 L605,185 L610,175 Z" />
            
            {/* Australie */}
            <path d="M780,280 L800,270 L820,265 L840,270 L855,280 L860,300 L855,320 L840,330 L820,335 L800,330 L785,320 L780,300 Z" />
            
            {/* Groenland */}
            <path d="M380,40 L410,35 L440,40 L460,55 L450,75 L430,85 L400,90 L370,85 L360,70 L365,55 Z" />
            
            {/* Japon */}
            <path d="M780,120 L795,115 L805,125 L800,140 L785,145 L775,135 Z" />
            
            {/* Asie du Sud-Est */}
            <path d="M710,180 L730,175 L745,185 L740,200 L725,210 L705,205 L695,195 L700,185 Z" />
          </g>

          {/* Lignes de frontières subtiles */}
          <g stroke="hsl(160, 30%, 30%)" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.2">
            <path d="M220,100 L270,95 L320,100" />
            <path d="M410,160 L450,155 L490,165" />
            <path d="M610,150 L650,145 L680,155" />
          </g>

          {/* Marqueurs des villes - version simplifiée */}
          {MAJOR_CITIES.slice(0, 12).map((city) => {
            const isActive = activeCities.has(city.name);
            return (
              <g key={city.name} className="transition-all duration-300">
                {isActive && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="16"
                    fill="url(#activeCityGlow)"
                    opacity="0.6"
                  />
                )}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? "10" : "8"}
                  fill="url(#cityGlow)"
                  filter="url(#softGlow)"
                  className="transition-all duration-300"
                />
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? "4" : "3"}
                  fill="hsl(190, 95%, 75%)"
                />
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="1.2"
                  fill="hsl(190, 95%, 95%)"
                />
                <text
                  x={city.x + (city.name.length > 6 ? 12 : 10)}
                  y={city.y + 3}
                  fill={isActive ? "hsl(190, 95%, 85%)" : "hsl(200, 30%, 70%)"}
                  fontSize={city.name.length > 8 ? "8" : "9"}
                  fontFamily="'Inter', -apple-system, sans-serif"
                  fontWeight="500"
                  className="transition-all duration-300"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}

          {/* Pulsations d'activité */}
          {pulses.map((pulse) => (
            <g key={pulse.id}>
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r={12 * pulse.intensity}
                fill="url(#pulseGrad)"
                opacity={0.7 * pulse.intensity}
                style={{
                  animation: `pulse ${1.5 / pulse.intensity}s ease-out infinite`,
                }}
              />
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r={3 * pulse.intensity}
                fill="hsl(190, 95%, 75%)"
                opacity={0.9 * pulse.intensity}
              />
            </g>
          ))}
        </svg>

        {/* Légende */}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg p-2 text-xs border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <span className="text-white/90">Major Cities</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></div>
              <span className="text-white/90">Live Activity</span>
            </div>
          </div>
        </div>

        {/* Compteur d'activité */}
        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
          <div className="flex items-center space-x-2 text-white/90">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>{pulses.length} active signals</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.8);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default WorldMap;