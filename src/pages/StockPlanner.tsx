import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Package, Calculator } from "lucide-react";
import { monthlyHeatmap } from "@/lib/mockData";

const crops = ["wheat", "rice", "onion", "tomato"] as const;
const cropLabels: Record<string, string> = { wheat: "Wheat", rice: "Rice", onion: "Onion", tomato: "Tomato" };

const StockPlanner = () => {
  const [crop, setCrop] = useState<string>("wheat");
  const [storageCost, setStorageCost] = useState("50");
  const [months, setMonths] = useState("3");

  const data = monthlyHeatmap.map((m) => ({
    month: m.month,
    price: m[crop as keyof typeof m] as number,
  }));

  const maxPrice = Math.max(...data.map((d) => d.price));
  const minPrice = Math.min(...data.map((d) => d.price));
  const bestBuy = data.find((d) => d.price === minPrice)?.month;
  const bestSell = data.find((d) => d.price === maxPrice)?.month;

  const roi = storageCost && months
    ? ((maxPrice - minPrice - parseFloat(storageCost) * parseFloat(months)) / minPrice * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-card rounded-xl border border-primary/20 p-5 shadow-glow">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-primary" />
          <p className="text-primary text-sm font-medium">Strategic Stock Planner</p>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          Which month should I increase my stock for maximum profit?
        </h3>
      </div>

      {/* Crop selector */}
      <div className="flex gap-2 flex-wrap">
        {crops.map((c) => (
          <button
            key={c}
            onClick={() => setCrop(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              crop === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cropLabels[c]}
          </button>
        ))}
      </div>

      {/* Best months */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-profit/5 border border-profit/20 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Best Month to Stock</p>
          <p className="text-2xl font-display font-bold text-profit">{bestBuy}</p>
          <p className="text-xs text-muted-foreground mt-1">Lowest avg price: ₹{minPrice.toLocaleString()}/qtl</p>
        </div>
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Best Month to Release</p>
          <p className="text-2xl font-display font-bold text-warning">{bestSell}</p>
          <p className="text-xs text-muted-foreground mt-1">Highest avg price: ₹{maxPrice.toLocaleString()}/qtl</p>
        </div>
      </div>

      {/* Monthly Heatmap Chart */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">
          Monthly Price Heatmap — {cropLabels[crop]}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: 8, color: "hsl(60 10% 95%)" }} />
            <Bar dataKey="price" radius={[4, 4, 0, 0]}>
              {data.map((entry) => {
                const ratio = (entry.price - minPrice) / (maxPrice - minPrice || 1);
                const hue = 152 - ratio * 112; // green to red
                return <Cell key={entry.month} fill={`hsl(${hue} 60% 45%)`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Storage Cost Calculator */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Storage Cost & ROI Calculator</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Storage Cost (₹/qtl/month)</label>
            <input type="number" value={storageCost} onChange={(e) => setStorageCost(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Storage Duration (months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Estimated ROI</label>
            <div className={`w-full rounded-lg px-3 py-2 text-sm font-display font-bold ${roi && parseFloat(roi) > 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>
              {roi ? `${roi}%` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPlanner;
