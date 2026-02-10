import { useState, useEffect, useRef } from "react";

interface Counter {
  label: string;
  unit: string;
  description: string;
  baseValue: number;
  perSecond: number;
  baseTime: number;
}

const countersConfig: Counter[] = [
  {
    label: "World Population",
    unit: "people",
    description: "Estimated live count",
    baseValue: 8_190_000_000,
    perSecond: 2.5, // ~2.5 net births per second
    baseTime: Date.now(),
  },
  {
    label: "Energy Consumed Today",
    unit: "MWh",
    description: "Global energy since midnight UTC",
    baseValue: 0,
    perSecond: 21_350, // ~1.84 billion MWh/day ÷ 86400
    baseTime: 0, // calculated from midnight
  },
  {
    label: "CO₂ Emitted Today",
    unit: "tonnes",
    description: "Carbon dioxide since midnight UTC",
    baseValue: 0,
    perSecond: 1_337, // ~115.5 million tonnes/day ÷ 86400
    baseTime: 0,
  },
];

const formatNumber = (n: number): string => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(6) + "B";
  if (n >= 1_000_000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

const getSecondsSinceMidnightUTC = () => {
  const now = new Date();
  return now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds() + now.getUTCMilliseconds() / 1000;
};

const Counters = () => {
  const [values, setValues] = useState<number[]>([0, 0, 0]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const secSinceMidnight = getSecondsSinceMidnightUTC();
      const elapsed = (Date.now() - countersConfig[0].baseTime) / 1000;

      setValues([
        countersConfig[0].baseValue + elapsed * countersConfig[0].perSecond,
        secSinceMidnight * countersConfig[1].perSecond,
        secSinceMidnight * countersConfig[2].perSecond,
      ]);
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        📊 Live Global Counters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countersConfig.map((counter, i) => (
          <div key={counter.label} className="glass-card-glow p-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {counter.label}
            </p>
            <p className="text-2xl md:text-3xl font-mono font-bold text-primary number-glow tabular-nums">
              {formatNumber(values[i])}
            </p>
            <p className="text-xs text-muted-foreground">
              {counter.unit} · {counter.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Counters;
