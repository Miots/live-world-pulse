import { useState, useEffect, useRef, useCallback } from "react";

interface PulsePoint {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const WorldMap = () => {
  const [pulses, setPulses] = useState<PulsePoint[]>([]);
  const nextId = useRef(0);

  const addPulse = useCallback(() => {
    // Coordonnées réalistes pour les grandes villes mondiales
    const cities = [
      { x: 220, y: 150 }, // New York
      { x: 175, y: 175 }, // Miami
      { x: 135, y: 125 }, // Los Angeles
      { x: 300, y: 110 }, // Londres
      { x: 340, y: 135 }, // Paris
      { x: 390, y: 130 }, // Moscou
      { x: 490, y: 180 }, // Tokyo
      { x: 450, y: 210 }, // Shanghai
      { x: 400, y: 190 }, // Delhi
      { x: 320, y: 215 }, // Dubaï
      { x: 275, y: 220 }, // Nairobi
      { x: 195, y: 240 }, // São Paulo
      { x: 160, y: 200 }, // Mexico City
      { x: 530, y: 230 }, // Sydney
      { x: 380, y: 160 }, // Istanbul
    ];
    
    const city = cities[Math.floor(Math.random() * cities.length)];
    const id = nextId.current++;
    setPulses((prev) => [...prev.slice(-30), { 
      id, 
      x: city.x + (Math.random() * 10 - 5), // Légère variation
      y: city.y + (Math.random() * 10 - 5),
      createdAt: Date.now() 
    }]);
  }, []);

  useEffect(() => {
    // Initial pulses
    for (let i = 0; i < 8; i++) setTimeout(addPulse, i * 200);
    const interval = setInterval(addPulse, 800);
    return () => clearInterval(interval);
  }, [addPulse]);

  // Clean up old pulses
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPulses((prev) => prev.filter((p) => Date.now() - p.createdAt < 4000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        🌍 World Activity Map
      </h2>
      <div className="glass-card-glow p-2 md:p-4 overflow-hidden relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-auto"
          style={{ minHeight: 220 }}
        >
          <defs>
            <radialGradient id="oceanGrad">
              <stop offset="0%" stopColor="hsl(215, 70%, 8%)" />
              <stop offset="100%" stopColor="hsl(215, 80%, 4%)" />
            </radialGradient>
            
            <radialGradient id="pulseGrad">
              <stop offset="0%" stopColor="hsl(190, 95%, 60%)" stopOpacity="0.9" />
              <stop offset="70%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(190, 95%, 40%)" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="dotGrad">
              <stop offset="0%" stopColor="hsl(190, 95%, 75%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0.8" />
            </radialGradient>
            
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(190, 95%, 55%)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(190, 95%, 45%)" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(160, 30%, 15%)" />
              <stop offset="100%" stopColor="hsl(160, 40%, 10%)" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(220, 30%, 10%)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>

          {/* Ocean background with gradient */}
          <rect width="1000" height="500" fill="url(#oceanGrad)" rx="8" />
          <rect width="1000" height="500" fill="url(#gridPattern)" opacity="0.2" />

          {/* Subtle latitude/longitude grid */}
          <g stroke="hsl(220, 30%, 12%)" strokeWidth="0.4" opacity="0.6">
            {[50, 150, 250, 350, 450].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} strokeDasharray="4,8" />
            ))}
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" strokeDasharray="4,8" />
            ))}
            {/* Equator */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="hsl(190, 60%, 30%)" strokeWidth="0.8" strokeDasharray="8,8" opacity="0.5" />
          </g>

          {/* Continents avec formes réalistes */}
          <g fill="url(#landGradient)" stroke="hsl(160, 30%, 22%)" strokeWidth="0.8" strokeLinejoin="round">

            {/* Amérique du Nord */}
            <path d="M120,70 L150,60 L200,50 L250,45 L300,50 L320,60 L330,75 L325,95 L310,110 L295,120 L280,130 L260,140 L240,145 L220,150 L200,155 L180,160 L160,165 L145,155 L135,140 L130,125 L125,110 L120,95 L115,85 Z" />
            {/* Alaska */}
            <path d="M50,50 L80,40 L110,35 L135,45 L120,70 L90,75 L70,70 L55,65 Z" />
            {/* Groenland */}
            <path d="M350,40 L380,35 L410,40 L430,55 L420,75 L400,85 L370,90 L340,85 L330,70 L335,55 Z" />
            {/* Californie/Baja */}
            <path d="M90,160 L110,150 L125,155 L135,165 L130,180 L120,190 L105,185 L95,175 Z" />
            {/* Floride */}
            <path d="M190,175 L210,170 L220,180 L215,190 L200,195 L185,190 L180,180 Z" />

            {/* Amérique Centrale */}
            <path d="M170,190 L185,185 L200,190 L210,200 L205,210 L195,220 L180,215 L170,205 Z" />

            {/* Amérique du Sud */}
            <path d="M180,220 L200,215 L225,210 L250,215 L270,225 L285,240 L295,260 L300,280 L295,300 L285,320 L270,340 L250,360 L225,375 L200,380 L180,375 L170,360 L160,340 L155,320 L150,300 L148,280 L150,260 L155,240 L165,230 Z" />
            {/* Brésil saillant */}
            <path d="M240,250 L260,240 L280,250 L290,270 L285,290 L270,310 L250,320 L230,310 L220,290 L225,270 Z" />

            {/* Europe */}
            <path d="M420,100 L440,95 L460,90 L480,85 L500,90 L520,95 L540,105 L530,120 L510,130 L490,135 L470,130 L450,125 L430,120 L420,110 Z" />
            {/* Péninsule ibérique */}
            <path d="M380,140 L400,135 L415,145 L410,160 L395,165 L380,155 Z" />
            {/* Italie */}
            <path d="M460,135 L475,130 L485,140 L480,155 L470,160 L460,150 Z" />
            {/* Scandinavie */}
            <path d="M480,60 L500,55 L520,65 L510,80 L490,85 L475,80 L470,70 Z" />

            {/* Afrique */}
            <path d="M430,150 L450,145 L470,150 L490,160 L500,175 L505,190 L500,205 L490,220 L475,230 L455,235 L435,230 L420,220 L410,205 L405,190 L410,175 L420,160 Z" />
            {/* Corne de l'Afrique */}
            <path d="M520,180 L540,175 L555,185 L550,200 L535,205 L520,195 Z" />
            {/* Madagascar */}
            <path d="M560,240 L580,235 L590,245 L585,260 L570,265 L560,255 Z" />

            {/* Moyen-Orient */}
            <path d="M520,140 L540,135 L560,145 L555,160 L540,165 L525,155 Z" />

            {/* Asie */}
            <path d="M550,100 L570,90 L590,85 L610,90 L630,100 L640,115 L635,130 L620,140 L600,145 L580,140 L560,130 L550,115 Z" />
            {/* Inde */}
            <path d="M590,170 L610,165 L625,175 L620,190 L605,200 L585,195 L575,185 L580,175 Z" />
            {/* Chine */}
            <path d="M650,110 L670,105 L690,110 L710,120 L720,135 L715,150 L700,160 L680,155 L665,145 L655,130 Z" />
            {/* Sibérie */}
            <path d="M620,50 L650,40 L680,35 L710,40 L730,55 L720,70 L690,75 L660,70 L640,65 L625,60 Z" />

            {/* Asie du Sud-Est */}
            <path d="M680,180 L700,175 L715,185 L710,200 L695,210 L675,205 L665,195 L670,185 Z" />
            {/* Indonésie/Philippines */}
            <path d="M720,190 L735,185 L745,195 L740,210 L725,215 L715,205 Z" />
            <path d="M750,200 L765,195 L775,205 L770,220 L755,225 L745,215 Z" />
            <path d="M700,210 L715,205 L725,215 L720,230 L705,235 L695,225 Z" />

            {/* Japon */}
            <path d="M750,120 L765,115 L775,125 L770,140 L755,145 L745,135 Z" />
            <path d="M760,100 L775,95 L785,105 L780,120 L765,125 L755,115 Z" />

            {/* Australie */}
            <path d="M750,280 L770,270 L790,265 L810,270 L825,280 L830,300 L825,320 L810,330 L790,335 L770,330 L755,320 L750,300 Z" />
            {/* Tasmanie */}
            <path d="M760,350 L775,345 L785,355 L780,370 L765,375 L755,365 Z" />
            {/* Nouvelle-Zélande */}
            <path d="M850,320 L865,315 L875,325 L870,340 L855,345 L845,335 Z" />
          </g>

          {/* Frontières nationales subtiles */}
          <g fill="none" stroke="hsl(160, 30%, 25%)" strokeWidth="0.4" opacity="0.3" strokeDasharray="3,3">
            <path d="M200,100 L250,95 L300,100" /> {/* USA-Canada */}
            <path d="M380,160 L420,155 L460,165" /> {/* Méditerranée */}
            <path d="M580,150 L620,145 L650,155" /> {/* Asie Centrale */}
          </g>

          {/* Grandes villes avec marqueurs */}
          {[
            { x: 220, y: 150, label: "New York" },
            { x: 300, y: 110, label: "London" },
            { x: 340, y: 135, label: "Paris" },
            { x: 490, y: 180, label: "Tokyo" },
            { x: 450, y: 210, label: "Shanghai" },
            { x: 400, y: 190, label: "Delhi" },
            { x: 275, y: 220, label: "Nairobi" },
            { x: 195, y: 240, label: "São Paulo" },
            { x: 530, y: 230, label: "Sydney" },
          ].map((city) => (
            <g key={city.label} className="transition-opacity duration-300 hover:opacity-100" opacity="0.9">
              <circle cx={city.x} cy={city.y} r="12" fill="url(#cityGlow)" filter="url(#glow)" />
              <circle cx={city.x} cy={city.y} r="3.5" fill="hsl(190, 95%, 65%)" />
              <circle cx={city.x} cy={city.y} r="1.5" fill="hsl(190, 95%, 90%)" />
              <text
                x={city.x + 14}
                y={city.y + 4}
                fill="hsl(190, 50%, 75%)"
                fontSize="10"
                fontFamily="'Inter', 'Segoe UI', sans-serif"
                fontWeight="500"
                className="drop-shadow-sm"
              >
                {city.label}
              </text>
            </g>
          ))}

          {/* Pulsations d'activité */}
          {pulses.map((pulse) => (
            <g key={pulse.id}>
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r="16"
                fill="url(#pulseGrad)"
                className="animate-map-pulse"
                style={{
                  animation: 'pulse 2s ease-out infinite',
                }}
              />
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r="2.5"
                fill="url(#dotGrad)"
                opacity="0.95"
              />
            </g>
          ))}
        </svg>
        
        {/* Légende */}
        <div className="absolute bottom-2 left-2 bg-black/30 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="flex items-center space-x-2 text-white/80">
            <div className="w-3 h-3 rounded-full bg-[hsl(190,95%,65%)]"></div>
            <span>Major Cities</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80 mt-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(190,95%,75%)] animate-pulse"></div>
            <span>Live Activity</span>
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
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-map-pulse {
          animation: pulse 2s ease-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WorldMap;