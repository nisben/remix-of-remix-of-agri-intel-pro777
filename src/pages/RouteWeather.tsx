import { CloudRain, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { weatherRoutes } from "@/lib/mockData";

const riskConfig = {
  high: { label: "HIGH", classes: "text-loss bg-loss/10 border-loss/30", icon: AlertTriangle },
  medium: { label: "MEDIUM", classes: "text-warning bg-warning/10 border-warning/30", icon: Droplets },
  low: { label: "LOW", classes: "text-profit bg-profit/10 border-profit/30", icon: CloudRain },
};

const RouteWeather = () => (
  <div className="space-y-6">
    <div className="bg-gradient-card rounded-xl border border-info/20 p-5">
      <div className="flex items-center gap-2 mb-2">
        <CloudRain className="w-5 h-5 text-info" />
        <p className="text-info text-sm font-medium">Route Weather Intelligence</p>
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">
        Reduce post-harvest losses from 30% to &lt;5%
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Real-time humidity & temperature monitoring for transport routes.
      </p>
    </div>

    {/* Spoilage goal */}
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-loss/5 border border-loss/20 rounded-xl p-5 text-center">
        <p className="text-xs text-muted-foreground mb-1">Industry Avg Loss</p>
        <p className="text-3xl font-display font-bold text-loss">30%</p>
      </div>
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-5 text-center">
        <p className="text-xs text-muted-foreground mb-1">With AgriIntel</p>
        <p className="text-3xl font-display font-bold text-warning">8%</p>
      </div>
      <div className="bg-profit/5 border border-profit/20 rounded-xl p-5 text-center">
        <p className="text-xs text-muted-foreground mb-1">Target</p>
        <p className="text-3xl font-display font-bold text-profit">&lt;5%</p>
      </div>
    </div>

    {/* Route Cards */}
    <div className="space-y-4">
      {weatherRoutes.map((route) => {
        const risk = riskConfig[route.risk];
        return (
          <div key={route.route} className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-border/80 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display font-semibold text-foreground">{route.route}</h4>
                  <span className="text-xs text-muted-foreground">({route.distance})</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="w-4 h-4" /> {route.humidity}% humidity
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Thermometer className="w-4 h-4" /> {route.temp}°C
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Spoilage</p>
                  <p className={`text-lg font-display font-bold ${route.risk === "high" ? "text-loss" : route.risk === "medium" ? "text-warning" : "text-profit"}`}>
                    {route.spoilage}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.classes}`}>
                  {risk.label}
                </span>
              </div>
            </div>
            {route.humidity > 70 && (
              <div className="mt-3 p-2 rounded-lg bg-loss/5 border border-loss/20 text-xs text-loss flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Humidity exceeds safe threshold. Consider refrigerated transport.
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default RouteWeather;
