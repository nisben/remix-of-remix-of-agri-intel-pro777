import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, TrendingUp, Zap, Target, ShieldCheck, AlertCircle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { priceHistory7d, riskAlerts } from "@/lib/mockData";

// Dynamic Filter Data
const locationData: Record<string, Record<string, string[]>> = {
  "Maharashtra": {
    "Nashik": ["Lasalgaon", "Pimpalgaon", "Yeola"],
    "Mumbai": ["Vashi", "Kalyan"],
    "Pune": ["Gultekdi", "Manchar"]
  },
  "Karnataka": {
    "Bangalore": ["Yeshwanthpur", "Binny Mill", "K.R. Puram"],
    "Hubli": ["Hubli Mandi", "Amargol"]
  },
  "Delhi": {
    "Delhi": ["Azadpur", "Okhla", "Gazipur"]
  },
  "Punjab": {
    "Ludhiana": ["Ludhiana Mandi", "Khanna"],
    "Amritsar": ["Amritsar Mandi"]
  }
};

const commodities = ["Wheat", "Onion", "Tomato", "Rice", "Soybean", "Maize"];

const severityColor = { 
  high: "text-loss bg-loss/10 border-loss/20", 
  medium: "text-warning bg-warning/10 border-warning/20", 
  low: "text-profit bg-profit/10 border-profit/20" 
};

const DashboardHome = () => {
  // State Management
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Nashik");
  const [selectedMarket, setSelectedMarket] = useState("Lasalgaon");
  const [selectedCommodity, setSelectedCommodity] = useState("Onion");

  // Dynamic Options
  const districtOptions = useMemo(() => Object.keys(locationData[selectedState] || {}), [selectedState]);
  const marketOptions = useMemo(() => locationData[selectedState]?.[selectedDistrict] || [], [selectedState, selectedDistrict]);

  // Handle Parent Filter Changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const firstDistrict = Object.keys(locationData[state])[0];
    setSelectedDistrict(firstDistrict);
    setSelectedMarket(locationData[state][firstDistrict][0]);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedMarket(locationData[selectedState][district][0]);
  };

  // Generate deterministic "dynamic" data based on selection
  const kpiData = useMemo(() => {
    const seed = selectedMarket.length + selectedCommodity.length;
    return {
      avgPrice: 1500 + (seed * 45),
      change: (seed % 5) + 1.2,
      volatility: seed % 3 === 0 ? "High" : seed % 3 === 1 ? "Medium" : "Low",
      alerts: seed % 4
    };
  }, [selectedMarket, selectedCommodity]);

  const chartData = useMemo(() => {
    const basePrice = kpiData.avgPrice;
    return priceHistory7d.map((d, i) => ({
      day: d.day,
      price: basePrice - 100 + (Math.sin(i) * 50) + (i * 20)
    }));
  }, [kpiData.avgPrice]);

  const filteredAlerts = useMemo(() => {
    return riskAlerts.filter(a => 
      a.title.toLowerCase().includes(selectedCommodity.toLowerCase()) || 
      a.message.toLowerCase().includes(selectedState.toLowerCase()) ||
      a.severity === "high"
    ).slice(0, 3);
  }, [selectedCommodity, selectedState]);

  const aiInsight = useMemo(() => {
    const trend = kpiData.change > 0 ? "Increasing" : "Decreasing";
    const pressure = kpiData.volatility === "High" ? "High" : "Low";
    const risk = kpiData.alerts > 1 ? "Medium" : "Low";
    const action = kpiData.change > 3 ? "SELL" : "HOLD";

    return { trend, pressure, risk, action };
  }, [kpiData]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Market Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground">7-Day outlook and actionable trade insights</p>
        </div>
        <Link 
          to="/dashboard/market" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-semibold transition-all self-start md:self-center"
        >
          Compare Markets <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Smart Filter Bar */}
      <div className="bg-card/50 border border-border p-3 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 items-center shadow-sm">
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1 z-10">State</label>
          <select 
            value={selectedState} 
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1 z-10">District</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1 z-10">Market</label>
          <select 
            value={selectedMarket} 
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {marketOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1 z-10">Commodity</label>
          <select 
            value={selectedCommodity} 
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Market Live
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Average Price Today</p>
            <h3 className="text-xl font-display font-bold text-foreground mt-0.5">₹{kpiData.avgPrice.toLocaleString()}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Based on {selectedMarket}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-profit/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-profit" />
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-profit/10 text-profit">
              +{kpiData.change}%
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">7-Day Price Change</p>
            <h3 className="text-xl font-display font-bold text-foreground mt-0.5">{kpiData.change > 0 ? "+" : ""}{kpiData.change}%</h3>
            <p className="text-[10px] text-profit mt-1 font-medium">vs Yesterday +{(kpiData.change/2).toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Target className="w-4 h-4 text-warning" />
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpiData.volatility === "High" ? "bg-loss/10 text-loss" : "bg-warning/10 text-warning"}`}>
              {kpiData.volatility}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Market Volatility</p>
            <h3 className="text-xl font-display font-bold text-foreground mt-0.5">{kpiData.volatility}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-2 h-2 rounded-full ${kpiData.volatility === "Low" ? "bg-profit" : kpiData.volatility === "Medium" ? "bg-warning" : "bg-loss"}`} />
              <p className="text-[10px] text-muted-foreground">Price stability index</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-loss/10 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-loss" />
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-loss/10 text-loss">
              {kpiData.alerts} Active
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Active Risk Alerts</p>
            <h3 className="text-xl font-display font-bold text-foreground mt-0.5">{kpiData.alerts} Alerts</h3>
            <p className="text-[10px] text-muted-foreground mt-1">{selectedState} / {selectedCommodity}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-foreground">Price Trends (7-Day)</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 italic">Based on selected filters: {selectedMarket} • {selectedCommodity}</p>
              </div>
              <div className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                Live 7D Feed
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                  contentStyle={{
                    background: "hsl(220 18% 10%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: 8,
                    color: "hsl(60 10% 95%)",
                    fontSize: "12px"
                  }}
                  formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Price']}
                />
                <Line 
                  name={selectedCommodity} 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  animationDuration={1000} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Market Summary */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-16 h-16 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              AI Insight – 7 Day Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Price Trend</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`w-3.5 h-3.5 ${aiInsight.trend === "Increasing" ? "text-profit" : "text-loss rotate-180"}`} />
                  <p className={`text-sm font-bold ${aiInsight.trend === "Increasing" ? "text-profit" : "text-loss"}`}>{aiInsight.trend}</p>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Arrival Pressure</p>
                <p className={`text-sm font-bold ${aiInsight.pressure === "Low" ? "text-profit" : "text-warning"}`}>{aiInsight.pressure}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Risk Level</p>
                <p className={`text-sm font-bold ${aiInsight.risk === "Low" ? "text-profit" : "text-warning"}`}>{aiInsight.risk}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <p className="text-[10px] text-primary uppercase font-bold mb-1">Suggested Action</p>
                <p className="text-sm font-black text-primary tracking-wider">{aiInsight.action}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-primary/30 p-5 shadow-glow relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">Best Market Opportunity</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Recommended Market</p>
                  <p className="text-lg font-bold text-foreground">{selectedMarket === "Lasalgaon" ? "Pimpalgaon" : "Lasalgaon"}, {selectedState}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Commodity</p>
                    <p className="text-sm font-medium text-foreground">{selectedCommodity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Current Price</p>
                    <p className="text-xl font-display font-bold text-profit">₹{(kpiData.avgPrice + 120).toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">/qtl</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/50 p-2.5 rounded-lg border border-border/50">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Price Advantage</p>
                    <p className="text-sm font-bold text-profit">+₹120</p>
                  </div>
                  <div className="bg-muted/50 p-2.5 rounded-lg border border-border/50">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Confidence</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-primary">88%</p>
                      <ShieldCheck className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2">
                  View Detailed Forecast <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">Risk Alerts</h3>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((a) => (
                  <div key={a.id} className={`p-3 rounded-lg border ${severityColor[a.severity]} group transition-colors`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase">
                        {a.severity} RISK
                      </span>
                      <span className="text-[9px] opacity-70">{a.date}</span>
                    </div>
                    <p className="text-xs font-bold mb-1">{a.title}</p>
                    <p className="text-[10px] leading-relaxed opacity-80">{a.message}</p>
                    <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase">Action:</p>
                      <p className="text-[9px] font-medium italic">Monitor closely</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <ShieldCheck className="w-8 h-8 text-profit/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No active risks found for {selectedCommodity} in this region.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
