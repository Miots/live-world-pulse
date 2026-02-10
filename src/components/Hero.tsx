import { useState, useEffect } from "react";

const Hero = () => {
  const [utcTime, setUtcTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUTC = (date: Date) => {
    return date.toUTCString().split(" ").slice(4, 5).join(" ");
  };

  return (
    <header className="relative py-16 md:py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-glow text-primary">
          Live World Pulse
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-light italic">
          The world, in motion — live.
        </p>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-glow-green opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-glow-green animate-pulse-dot" />
            </span>
            <span className="text-sm font-semibold text-glow-green tracking-widest uppercase text-glow-green">
              Live
            </span>
          </div>

          <span className="text-sm font-mono text-muted-foreground">
            UTC {formatUTC(utcTime)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Hero;
