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
    // Random coords within the map viewBox (roughly land areas)
    const x = 50 + Math.random() * 900;
    const y = 80 + Math.random() * 350;
    const id = nextId.current++;
    setPulses((prev) => [...prev.slice(-25), { id, x, y, createdAt: Date.now() }]);
  }, []);

  useEffect(() => {
    // Initial pulses
    for (let i = 0; i < 5; i++) setTimeout(addPulse, i * 300);
    const interval = setInterval(addPulse, 1200);
    return () => clearInterval(interval);
  }, [addPulse]);

  // Clean up old pulses
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
      <div className="glass-card-glow p-2 md:p-4 overflow-hidden relative">
        <svg
          viewBox="0 0 1010 505"
          className="w-full h-auto"
          style={{ minHeight: 220 }}
        >
          <defs>
            <radialGradient id="pulseGrad">
              <stop offset="0%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dotGrad">
              <stop offset="0%" stopColor="hsl(190, 95%, 65%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(190, 95%, 40%)" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(190, 95%, 50%)" stopOpacity="0" />
            </radialGradient>
            <filter id="landGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="1010" height="505" fill="hsl(222, 84%, 4%)" rx="8" />

          {/* Subtle latitude/longitude grid */}
          <g stroke="hsl(220, 30%, 10%)" strokeWidth="0.4" opacity="0.5">
            {[63, 126, 189, 252, 315, 378, 441].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="1010" y2={y} strokeDasharray="4,8" />
            ))}
            {[126, 252, 378, 505, 631, 757, 883].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="505" strokeDasharray="4,8" />
            ))}
            {/* Equator */}
            <line x1="0" y1="252" x2="1010" y2="252" stroke="hsl(220, 30%, 14%)" strokeWidth="0.6" strokeDasharray="6,6" />
          </g>

          {/* Detailed continent fills + outlines */}
          <g fill="hsl(220, 40%, 10%)" stroke="hsl(190, 40%, 22%)" strokeWidth="0.7" strokeLinejoin="round" filter="url(#landGlow)">

            {/* Greenland */}
            <path d="M310,52 L325,45 L345,42 L358,48 L365,60 L362,78 L350,90 L335,95 L320,90 L310,78 L305,65 Z" />

            {/* North America - detailed */}
            <path d="M115,65 L130,58 L148,55 L165,50 L180,52 L195,48 L210,50 L225,55 L240,52 L258,56 L268,62 L275,70 L280,80 L278,90 L272,98 L265,105 L260,95 L252,88 L242,85 L232,88 L225,92 L218,98 L212,95 L205,90 L198,92 L195,100 L188,105 L182,100 L178,108 L172,115 L168,108 L162,112 L155,118 L150,125 L148,135 L152,142 L158,148 L165,150 L172,155 L178,162 L175,170 L168,175 L160,178 L155,172 L148,168 L140,170 L135,178 L128,182 L120,178 L115,172 L112,162 L108,155 L105,145 L102,135 L100,125 L98,115 L100,105 L105,95 L108,85 L112,75 Z" />

            {/* Central America */}
            <path d="M175,178 L182,182 L188,190 L192,198 L195,205 L198,212 L200,218 L202,225 L198,228 L192,225 L188,218 L185,210 L180,205 L175,200 L172,192 L170,185 Z" />

            {/* Caribbean islands */}
            <path d="M210,195 L218,192 L225,195 L222,200 L215,202 Z" />
            <path d="M230,192 L238,190 L242,195 L238,200 L230,198 Z" />
            <path d="M248,195 L255,192 L260,198 L255,202 L248,200 Z" />

            {/* South America - detailed */}
            <path d="M205,230 L215,225 L225,222 L238,218 L250,220 L262,225 L272,232 L280,240 L288,250 L295,260 L300,272 L302,285 L300,298 L295,310 L290,322 L285,332 L282,342 L278,352 L272,362 L265,372 L258,380 L252,388 L248,395 L245,402 L248,408 L252,415 L250,420 L245,425 L238,422 L232,415 L228,408 L225,398 L222,388 L218,378 L215,368 L212,355 L210,342 L208,328 L205,315 L202,302 L200,288 L198,275 L198,262 L200,250 L202,240 Z" />

            {/* Iceland */}
            <path d="M378,58 L388,54 L398,56 L402,62 L398,68 L388,70 L380,66 Z" />

            {/* British Isles */}
            <path d="M418,92 L422,85 L428,82 L432,88 L430,96 L425,102 L420,98 Z" />
            <path d="M415,102 L420,100 L425,104 L422,110 L418,108 Z" />

            {/* Europe - detailed */}
            <path d="M430,72 L438,68 L448,65 L458,62 L468,60 L478,58 L488,60 L498,62 L508,66 L518,70 L528,72 L535,78 L538,85 L535,92 L530,98 L525,105 L528,112 L532,118 L528,125 L522,130 L515,135 L508,132 L502,128 L495,125 L488,128 L482,132 L475,135 L468,130 L462,125 L458,118 L455,112 L450,108 L445,112 L440,118 L435,115 L432,108 L428,102 L425,95 L428,85 L430,78 Z" />

            {/* Scandinavia */}
            <path d="M458,38 L462,32 L468,28 L475,25 L482,28 L488,32 L492,38 L495,45 L498,52 L495,58 L490,62 L485,58 L480,52 L475,48 L470,45 L465,42 Z" />
            <path d="M478,22 L485,18 L492,20 L498,25 L502,32 L505,40 L508,48 L510,55 L508,60 L502,58 L498,52 L495,45 L490,38 L485,32 L480,28 Z" />

            {/* Italy */}
            <path d="M472,128 L478,125 L482,130 L485,138 L488,145 L490,152 L488,158 L482,155 L478,148 L475,140 L472,135 Z" />

            {/* Africa - detailed */}
            <path d="M435,162 L445,158 L458,155 L468,152 L478,150 L488,152 L498,155 L508,158 L518,162 L528,168 L535,175 L540,185 L545,195 L548,208 L550,220 L548,235 L545,248 L542,260 L538,272 L532,285 L525,298 L518,310 L510,322 L502,332 L495,340 L488,348 L480,355 L475,360 L468,362 L462,358 L458,350 L455,340 L452,328 L448,318 L445,305 L442,292 L440,278 L438,265 L436,252 L435,238 L434,225 L433,212 L432,198 L433,185 L434,175 Z" />

            {/* Madagascar */}
            <path d="M555,310 L560,305 L565,308 L568,318 L568,330 L565,340 L560,348 L555,345 L552,335 L552,322 Z" />

            {/* Middle East */}
            <path d="M540,138 L552,132 L562,128 L572,132 L578,140 L575,148 L568,155 L560,158 L552,162 L545,158 L538,152 L535,145 Z" />

            {/* Arabian Peninsula */}
            <path d="M548,160 L558,158 L568,162 L575,170 L578,180 L575,188 L568,195 L558,198 L548,195 L542,188 L540,178 L542,168 Z" />

            {/* Russia / Northern Asia */}
            <path d="M538,55 L555,48 L575,42 L598,38 L622,35 L648,32 L675,30 L702,32 L728,35 L752,38 L775,42 L795,48 L810,55 L818,62 L822,72 L818,80 L810,85 L800,82 L788,78 L775,75 L760,72 L745,70 L728,68 L710,65 L692,62 L675,60 L658,58 L640,56 L622,55 L605,56 L588,58 L572,60 L558,62 L545,65 L538,62 Z" />

            {/* Central Asia / China */}
            <path d="M620,72 L640,68 L660,65 L680,68 L700,72 L718,78 L732,85 L742,92 L748,102 L752,112 L750,122 L745,130 L738,138 L728,142 L718,145 L708,148 L695,150 L682,148 L670,145 L658,140 L648,135 L640,128 L635,120 L632,110 L628,100 L625,90 L622,80 Z" />

            {/* India */}
            <path d="M638,148 L648,142 L660,145 L672,150 L680,158 L685,168 L688,180 L690,192 L688,205 L682,215 L675,222 L665,225 L655,222 L648,215 L642,205 L638,195 L635,182 L633,170 L635,158 Z" />

            {/* Sri Lanka */}
            <path d="M672,228 L678,225 L682,230 L680,238 L675,240 L670,236 Z" />

            {/* Southeast Asia */}
            <path d="M700,155 L712,150 L722,152 L730,158 L735,168 L732,178 L725,185 L718,188 L710,185 L705,178 L702,168 L700,160 Z" />

            {/* Korean Peninsula */}
            <path d="M768,95 L772,88 L778,85 L782,90 L782,98 L778,105 L772,108 L768,102 Z" />

            {/* Japan - detailed */}
            <path d="M798,82 L802,78 L808,80 L812,88 L815,98 L812,108 L808,115 L802,118 L798,112 L795,102 L795,92 Z" />
            <path d="M790,105 L795,100 L800,102 L802,110 L800,118 L795,122 L790,118 L788,112 Z" />
            <path d="M785,118 L790,115 L795,118 L795,125 L790,130 L785,128 L783,122 Z" />

            {/* Indonesia / Philippines */}
            <path d="M735,195 L745,192 L755,195 L758,202 L755,208 L748,210 L740,208 L735,202 Z" />
            <path d="M762,200 L770,198 L778,202 L780,210 L775,215 L768,218 L762,212 L760,205 Z" />
            <path d="M782,210 L790,208 L798,212 L800,220 L795,225 L788,228 L782,222 L780,215 Z" />
            <path d="M742,215 L752,212 L760,218 L758,228 L750,232 L742,228 L740,222 Z" />
            <path d="M720,210 L728,208 L735,212 L735,220 L728,225 L720,222 L718,215 Z" />

            {/* Philippines */}
            <path d="M770,168 L775,162 L780,165 L782,175 L778,182 L772,185 L768,178 Z" />

            {/* Taiwan */}
            <path d="M772,142 L776,138 L780,142 L778,150 L774,152 L770,148 Z" />

            {/* Australia - detailed */}
            <path d="M755,305 L768,295 L782,288 L798,282 L815,280 L832,282 L848,288 L860,295 L870,305 L875,318 L878,330 L875,342 L870,355 L862,365 L852,372 L840,378 L828,380 L815,378 L802,375 L790,370 L780,362 L772,352 L765,340 L760,328 L758,315 Z" />

            {/* Tasmania */}
            <path d="M842,385 L850,382 L856,388 L854,395 L848,398 L842,394 Z" />

            {/* New Zealand */}
            <path d="M898,362 L902,355 L908,352 L912,358 L912,368 L908,375 L902,378 L898,372 Z" />
            <path d="M900,380 L905,378 L910,382 L908,390 L902,392 L898,388 Z" />

            {/* Papua New Guinea */}
            <path d="M848,248 L858,242 L870,245 L878,252 L875,260 L868,265 L858,262 L850,258 Z" />
          </g>

          {/* Country border highlights for depth */}
          <g fill="none" stroke="hsl(190, 50%, 18%)" strokeWidth="0.3" opacity="0.4" strokeLinejoin="round">
            {/* US-Canada approximate */}
            <path d="M100,105 L150,100 L200,95 L250,92 L275,90" strokeDasharray="3,4" />
            {/* Sahara region */}
            <path d="M435,200 L470,195 L510,192 L540,195" strokeDasharray="3,4" />
          </g>

          {/* City markers with glow */}
          {[
            { x: 805, y: 100, label: "Tokyo" },
            { x: 470, y: 115, label: "Paris" },
            { x: 240, y: 145, label: "New York" },
            { x: 555, y: 325, label: "Antananarivo" },
          ].map((city) => (
            <g key={city.label}>
              <circle cx={city.x} cy={city.y} r="10" fill="url(#cityGlow)" />
              <circle cx={city.x} cy={city.y} r="3" fill="hsl(190, 95%, 55%)" />
              <circle cx={city.x} cy={city.y} r="1.2" fill="hsl(190, 95%, 85%)" />
              <text
                x={city.x + 10}
                y={city.y + 4}
                fill="hsl(200, 20%, 65%)"
                fontSize="9"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {city.label}
              </text>
            </g>
          ))}

          {/* Animated pulses */}
          {pulses.map((pulse) => (
            <g key={pulse.id}>
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r="14"
                fill="url(#pulseGrad)"
                className="animate-map-pulse"
              />
              <circle
                cx={pulse.x}
                cy={pulse.y}
                r="2"
                fill="url(#dotGrad)"
                opacity="0.9"
              />
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default WorldMap;
