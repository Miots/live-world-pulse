import Hero from "@/components/Hero";
import TimePanel from "@/components/TimePanel";
import WeatherPanel from "@/components/WeatherPanel";
import WorldMap from "@/components/WorldMap";
import Counters from "@/components/Counters";
import ActivityFeed from "@/components/ActivityFeed";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Hero />

        <main className="space-y-12 pb-12">
          <TimePanel />
          <WeatherPanel />
          <WorldMap /> 

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Counters />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
