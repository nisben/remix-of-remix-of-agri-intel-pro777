import { Map, Leaf, Star, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { harvestZones, arrivalData } from "@/lib/mockData";

const HarvestHeatmap = () => (
  <div className="space-y-6">
    <div className="bg-gradient-card rounded-xl border border-primary/20 p-5 shadow-glow">
      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-primary" />
        <p className="text-primary text-sm font-medium">Satellite Intelligence</p>
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">
        Identify Best Procurement Regions
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Field-level NDVI vigor index, quality scoring, and shelf-life indicators.
      </p>
    </div>

    {/* Region Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {harvestZones.map((zone) => (
        <div key={zone.region} className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-semibold text-foreground">{zone.region}</h4>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: zone.color }}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Vigor Index
              </span>
              <span className="text-sm font-display font-bold text-foreground">{zone.vigor}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${zone.vigor}%`,
                  backgroundColor: zone.color,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3" /> Quality
              </span>
              <span className="text-sm font-display font-semibold text-foreground">{zone.quality}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Shelf Life
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                zone.shelfLife === "High" ? "bg-profit/10 text-profit" :
                zone.shelfLife === "Medium" ? "bg-warning/10 text-warning" : "bg-loss/10 text-loss"
              }`}>
                {zone.shelfLife}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">Area: {zone.area}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Arrivals Monitor */}
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <h3 className="font-display font-semibold text-foreground mb-4">
        Mandi Arrival Monitor (Today)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={arrivalData}>
          <XAxis dataKey="time" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: 8, color: "hsl(60 10% 95%)" }} />
          <Bar dataKey="arrivals" radius={[4, 4, 0, 0]}>
            {arrivalData.map((entry) => (
              <Cell
                key={entry.time}
                fill={entry.arrivals > 500 ? "hsl(0 72% 51%)" : entry.arrivals > 300 ? "hsl(38 90% 55%)" : "hsl(152 60% 42%)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 p-2 rounded-lg bg-loss/5 border border-loss/20 text-xs text-loss flex items-center gap-2">
        <span>⚠️ Market Glut Risk Detected at 10:00 AM — 580 qtl arrivals. Consider alternate mandi.</span>
      </div>
    </div>
  </div>
);

export default HarvestHeatmap;
