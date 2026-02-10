import { useState, useEffect, useRef } from "react";

interface FeedItem {
  id: number;
  text: string;
  time: string;
  type: "sync" | "weather" | "connection" | "pulse";
}

const eventTemplates = [
  { text: "Data pulse synced", type: "pulse" as const },
  { text: "Weather update received", type: "weather" as const },
  { text: "New connection detected", type: "connection" as const },
  { text: "Global counter recalibrated", type: "sync" as const },
  { text: "Map activity spike recorded", type: "pulse" as const },
  { text: "Time zone data refreshed", type: "sync" as const },
  { text: "Live stream heartbeat", type: "connection" as const },
  { text: "Atmospheric data ingested", type: "weather" as const },
  { text: "Network latency check passed", type: "connection" as const },
  { text: "Energy grid snapshot taken", type: "sync" as const },
];

const typeColors: Record<string, string> = {
  sync: "text-glow-cyan",
  weather: "text-yellow-400",
  connection: "text-glow-green",
  pulse: "text-glow-blue",
};

const typeDots: Record<string, string> = {
  sync: "bg-glow-cyan",
  weather: "bg-yellow-400",
  connection: "bg-glow-green",
  pulse: "bg-glow-blue",
};

const ActivityFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const addItem = () => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: false });
      const item: FeedItem = {
        id: nextId.current++,
        text: template.text,
        time,
        type: template.type,
      };
      setItems((prev) => [item, ...prev].slice(0, 15));
    };

    // Seed a few
    for (let i = 0; i < 4; i++) setTimeout(addItem, i * 200);
    const interval = setInterval(addItem, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        ⚡ Activity Feed
      </h2>
      <div className="glass-card p-4 max-h-80 overflow-hidden">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-1.5 animate-slide-in-feed"
              style={{ opacity: 1 - index * 0.05 }}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeDots[item.type]}`} />
              <span className="text-sm text-foreground/80 flex-1">{item.text}</span>
              <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;
