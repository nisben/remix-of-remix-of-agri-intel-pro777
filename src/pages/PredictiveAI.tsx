import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Brain, TrendingUp, ShieldCheck, AlertTriangle, ChevronDown, ArrowUpRight, ArrowDownRight, Info, Calculator } from "lucide-react";
import { priceForecast, mandiPrices } from "@/lib/mockData";

const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Punjab"];
const districts = ["New Delhi", "Mumbai City", "Bangalore Urban", "Chennai City", "Ludhiana"];
const commodities = ["Wheat", "Onion", "Tomato", "Rice", "Soybean"];

type ArrivalLevel = "Low" | "Medium" | "High";
type RiskLevel = "Low" | "Medium" | "High";

type MarketForecast = {
  predicted: number[];
  arrivalLevel: ArrivalLevel;
  riskLevel: RiskLevel;
};

const marketForecasts: Record<string, MarketForecast> = {
  "Azadpur, Delhi": {
    predicted: [2460, 2485, 2500, 2520, 2535, 2555, 2580],
    arrivalLevel: "Medium",
    riskLevel: "Low",
  },
  "Vashi, Mumbai": {
    predicted: [1810, 1820, 1835, 1840, 1855, 1870, 1885],
    arrivalLevel: "Low",
    riskLevel: "Medium",
  },
  "Yeshwanthpur, Bangalore": {
    predicted: [2115, 2130, 2150, 2175, 2190, 2220, 2245],
    arrivalLevel: "Low",
    riskLevel: "Low",
  },
  "Lasalgaon, Nashik": {
    predicted: [1645, 1660, 1685, 1700, 1715, 1730, 1745],
    arrivalLevel: "High",
    riskLevel: "High",
  },
  "Koyambedu, Chennai": {
    predicted: [3210, 3230, 3255, 3270, 3295, 3320, 3350],
    arrivalLevel: "Medium",
    riskLevel: "Medium",
  },
};

const average = (values: number[]) =>
  values.reduce((total, value) => total + value, 0) / values.length;

const actions = [
  { range: "5 Days", action: "BUY", confidence: 87, price: "₹2,520", change: "+₹70", trend: "up", color: "text-profit bg-profit/10" },
  { range: "15 Days", action: "HOLD", confidence: 74, price: "₹2,610", change: "+₹160", trend: "up", color: "text-warning bg-warning/10" },
  { range: "30 Days", action: "SELL", confidence: 68, price: "₹2,740", change: "+₹290", trend: "up", color: "text-info bg-info/10" },
];

const PredictiveAI = () => {
  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedDistrict, setSelectedDistrict] = useState("New Delhi");
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedMarketA, setSelectedMarketA] = useState("Azadpur, Delhi");
  const [selectedMarketB, setSelectedMarketB] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [showPredictionTable, setShowPredictionTable] = useState(false);
  const [quantity, setQuantity] = useState(100);

  const marketA = mandiPrices.find((m) => m.mandi === selectedMarketA);
  const marketB = mandiPrices.find((m) => m.mandi === selectedMarketB);

  const forecastA = marketA ? marketForecasts[marketA.mandi] : null;
  const forecastB = marketB ? marketForecasts[marketB.mandi] : null;

  const avgPredA = forecastA ? average(forecastA.predicted) : 0;
  const avgPredB = forecastB ? average(forecastB.predicted) : 0;

  const suggestion = useMemo(() => {
    if (!marketA || !marketB || !forecastA || !forecastB) return null;

    let suggestedMarket = marketA;
    let reason = "";

    const valA = avgPredA;
    const valB = avgPredB;

    const arrivalOrder: Record<ArrivalLevel, number> = { Low: 0, Medium: 1, High: 2 };
    const riskOrder: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2 };

    if (Math.abs(valA - valB) > 10) { // Significant difference
      suggestedMarket = valA > valB ? marketA : marketB;
      reason = `${suggestedMarket.mandi} has a higher predicted 7-day average price (₹${Math.round(Math.max(valA, valB)).toLocaleString()}).`;
    } else if (arrivalOrder[forecastA.arrivalLevel] !== arrivalOrder[forecastB.arrivalLevel]) {
      suggestedMarket = arrivalOrder[forecastA.arrivalLevel] < arrivalOrder[forecastB.arrivalLevel] ? marketA : marketB;
      reason = "Predicted prices are similar, but selected market has lower arrival level for better price stability.";
    } else if (riskOrder[forecastA.riskLevel] !== riskOrder[forecastB.riskLevel]) {
      suggestedMarket = riskOrder[forecastA.riskLevel] < riskOrder[forecastB.riskLevel] ? marketA : marketB;
      reason = "Prices and arrivals are similar, but selected market has lower risk level based on AI analysis.";
    } else {
      suggestedMarket = marketA;
      reason = "Both markets show identical performance metrics; either is a good choice for selling.";
    }

    return { market: suggestedMarket, reason };
  }, [marketA, marketB, forecastA, forecastB, avgPredA, avgPredB]);

  const calculateProfit = (profitPerQtl: number) => {
    return (profitPerQtl * quantity).toLocaleString();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Bar */}
      <div className="space-y-4">
        <div className="bg-gradient-card rounded-xl border border-primary/20 p-5 shadow-glow">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <p className="text-primary text-sm font-medium">AI Forecast Engine</p>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Market Price Prediction & Strategy
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            ML-powered predictions using historical data, weather, arrivals, and policy signals.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-card border border-border p-3 rounded-xl">
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={selectedCommodity} 
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {commodities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[140px]">
            <select 
              value={selectedMarketA} 
              onChange={(e) => {
                setSelectedMarketA(e.target.value);
                setShowComparison(false);
                setSelectedMarketB("");
              }}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {mandiPrices.map(m => <option key={m.mandi} value={m.mandi}>{m.mandi}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Market Intelligence Section */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-6">
        {marketA && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            <div className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price at <span className="text-foreground font-semibold">{marketA.mandi}</span></p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-display font-bold text-foreground">₹{marketA.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ quintal</span>
                  <span className={`flex items-center text-sm font-medium ${marketA.change > 0 ? "text-profit" : "text-loss"}`}>
                    {marketA.change > 0 ? "↑" : "↓"} {Math.abs(marketA.change)}%
                  </span>
                </div>
              </div>
              {!showComparison && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Compare Market
                </button>
              )}
            </div>

            {showComparison && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pt-4 border-t border-border/50">
                <div className="max-w-xs">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Select Market B</label>
                  <div className="relative">
                    <select
                      value={selectedMarketB}
                      onChange={(e) => setSelectedMarketB(e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select Market B</option>
                      {mandiPrices.filter(m => m.mandi !== selectedMarketA).map((m) => (
                        <option key={m.mandi} value={m.mandi}>{m.mandi}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {marketB && (
                  <div className="space-y-8">
                    <div className="overflow-hidden rounded-xl border border-border shadow-sm bg-background">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted text-muted-foreground border-b border-border">
                            <th className="text-left py-4 px-6 font-semibold">Metric</th>
                            <th className="text-center py-4 px-6 font-semibold">{marketA.mandi}</th>
                            <th className="text-center py-4 px-6 font-semibold">{marketB.mandi}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="py-5 px-6 text-foreground font-medium">Current Price</td>
                            <td className={`text-center py-5 px-6 text-2xl font-display font-bold ${marketA.price >= marketB.price ? "text-profit" : "text-foreground"}`}>
                              ₹{marketA.price.toLocaleString()} {marketA.price >= marketB.price && "↑"}
                            </td>
                            <td className={`text-center py-5 px-6 text-2xl font-display font-bold ${marketB.price > marketA.price ? "text-profit" : "text-foreground"}`}>
                              ₹{marketB.price.toLocaleString()} {marketB.price > marketA.price && "↑"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-5 px-6 text-foreground font-medium">7-Day Avg Prediction</td>
                            <td className={`text-center py-5 px-6 text-2xl font-display font-bold ${avgPredA >= avgPredB ? "text-profit" : "text-foreground"}`}>
                              ₹{Math.round(avgPredA).toLocaleString()} {avgPredA >= avgPredB && "↑"}
                            </td>
                            <td className={`text-center py-5 px-6 text-2xl font-display font-bold ${avgPredB > avgPredA ? "text-profit" : "text-foreground"}`}>
                              ₹{Math.round(avgPredB).toLocaleString()} {avgPredB > avgPredA && "↑"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-5 px-6 text-foreground font-medium">Arrival Level</td>
                            <td className={`text-center py-5 px-6 font-semibold ${forecastA?.arrivalLevel === 'Low' ? 'text-profit' : 'text-foreground'}`}>{forecastA?.arrivalLevel}</td>
                            <td className={`text-center py-5 px-6 font-semibold ${forecastB?.arrivalLevel === 'Low' ? 'text-profit' : 'text-foreground'}`}>{forecastB?.arrivalLevel}</td>
                          </tr>
                          <tr>
                            <td className="py-5 px-6 text-foreground font-medium">Risk Level</td>
                            <td className={`text-center py-5 px-6 font-semibold ${forecastA?.riskLevel === 'Low' ? 'text-profit' : 'text-foreground'}`}>{forecastA?.riskLevel}</td>
                            <td className={`text-center py-5 px-6 font-semibold ${forecastB?.riskLevel === 'Low' ? 'text-profit' : 'text-foreground'}`}>{forecastB?.riskLevel}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {suggestion && (
                      <div className="bg-profit/10 border border-profit/30 rounded-xl p-6 shadow-glow-small">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                          <p className="text-xs font-bold text-profit uppercase tracking-widest">Smart AI Recommendation</p>
                        </div>
                        <h4 className="text-2xl font-display font-bold text-foreground">
                          Suggested Market to Sell: <span className="text-profit">{suggestion.market.mandi}</span>
                        </h4>
                        <div className="mt-4 p-5 bg-background/50 rounded-lg border border-border/50">
                          <p className="text-base text-foreground leading-relaxed">
                            <span className="font-bold text-primary">Decision Logic:</span> {suggestion.reason}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            The suggested market offers a better balance of price potential, operational stability, and risk mitigation.
                          </p>
                        </div>
                        <div className="mt-5">
                          <button
                            onClick={() => setShowPredictionTable(!showPredictionTable)}
                            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                          >
                            <Calculator className="w-4 h-4" />
                            {showPredictionTable ? "Hide" : "Show"} detailed 7-day prediction table
                          </button>
                        </div>
                      </div>
                    )}

                    {showPredictionTable && forecastA && forecastB && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-500 rounded-xl border border-border overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                              <th className="text-left py-4 px-6 font-bold">Day</th>
                              <th className="text-right py-4 px-6 font-bold">{marketA.mandi}</th>
                              <th className="text-right py-4 px-6 font-bold">{marketB.mandi}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border bg-background/30">
                            {forecastA.predicted.map((priceA, idx) => {
                              const priceB = forecastB.predicted[idx];
                              return (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                  <td className="py-4 px-6 text-muted-foreground font-medium">Day {idx + 1}</td>
                                  <td className={`text-right py-4 px-6 font-display font-bold text-xl ${priceA >= priceB ? "text-profit" : "text-foreground"}`}>
                                    ₹{priceA.toLocaleString()} {priceA >= priceB && "↑"}
                                  </td>
                                  <td className={`text-right py-4 px-6 font-display font-bold text-xl ${priceB > priceA ? "text-profit" : "text-foreground"}`}>
                                    ₹{priceB.toLocaleString()} {priceB > priceA && "↑"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {actions.map((a) => (
          <div key={a.range} className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-muted-foreground">{a.range} Forecast</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.color}`}>{a.action}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-bold text-foreground">{a.price}</p>
              <p className={`text-xs flex items-center ${a.trend === "up" ? "text-profit" : "text-loss"}`}>
                {a.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {a.change}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 mb-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Confidence</span>
              <span className="text-[10px] text-primary font-bold">{a.confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${a.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation Section */}
      <div className="bg-card rounded-xl border border-primary/30 p-6 shadow-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-profit/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-profit" />
            </div>
            <h3 className="text-lg font-bold text-foreground">AI Final Recommendation: <span className="text-profit underline decoration-2 underline-offset-4">STRONG HOLD</span></h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <ul className="space-y-2">
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Price expected to rise in next 5 days due to low arrivals in {selectedMarketA}.
                </li>
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Stable weather conditions in {selectedDistrict} district favor quality retention.
                </li>
                <li className="flex gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Export policy signals suggest upcoming demand surge in {selectedCommodity}.
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Exp. Price Change</p>
                <p className="text-xl font-display font-bold text-profit">+₹290 <span className="text-xs font-normal">/qtl</span></p>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Exp. Total Gain</p>
                <p className="text-xl font-display font-bold text-profit">₹{calculateProfit(290)}</p>
              </div>
            </div>
          </div>
          <p className="text-xs italic text-muted-foreground mt-4 flex items-center gap-1">
            <Info className="w-3 h-3" /> HOLD – Price expected to rise in next 5-10 days due to low arrivals and stable weather.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">
              30-Day Price Forecast — {selectedCommodity}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] text-muted-foreground uppercase">Predicted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span className="text-[10px] text-muted-foreground uppercase">Confidence Area</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={priceForecast}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152 60% 42%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(152 60% 42%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152 60% 42%)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(152 60% 42%)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: 8, color: "hsl(60 10% 95%)" }}
                itemStyle={{ fontSize: 12 }}
              />
              <Area type="monotone" dataKey="high" stackId="1" stroke="none" fill="transparent" />
              <Area type="monotone" dataKey="low" stackId="2" stroke="none" fill="url(#colorRange)" />
              <Area type="monotone" dataKey="predicted" stroke="hsl(152 60% 42%)" strokeWidth={3} fill="url(#colorPredicted)" dot={{ r: 4, fill: "hsl(152 60% 42%)", strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            Shaded regions represent AI confidence intervals (94.2% accuracy).
          </p>
        </div>

        {/* Profitability Sim & Risk */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4">Profitability Simulation</h3>
            
            <div className="mb-4">
              <label className="text-xs text-muted-foreground uppercase font-bold mb-1.5 block">Quantity (Quintals)</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <div className="bg-profit/5 border border-profit/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Best Case</p>
                  <TrendingUp className="w-3 h-3 text-profit" />
                </div>
                <p className="text-xl font-display font-bold text-profit">₹{calculateProfit(440)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sell in 30 days @ ₹2,890</p>
              </div>
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Expected</p>
                  <ShieldCheck className="w-3 h-3 text-warning" />
                </div>
                <p className="text-xl font-display font-bold text-warning">₹{calculateProfit(290)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sell in 30 days @ ₹2,740</p>
              </div>
              <div className="bg-loss/5 border border-loss/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Worst Case</p>
                  <AlertTriangle className="w-3 h-3 text-loss" />
                </div>
                <p className="text-xl font-display font-bold text-loss">₹{calculateProfit(140)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sell in 30 days @ ₹2,590</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h3 className="font-display font-semibold text-foreground mb-4">Risk Integration</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Risk Level</span>
                <span className="px-2 py-0.5 bg-profit/10 text-profit text-xs font-bold rounded">LOW</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                    <span className="text-muted-foreground">Weather Impact</span>
                    <span className="text-profit">Low</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[20%] bg-profit rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                    <span className="text-muted-foreground">Policy Risk</span>
                    <span className="text-warning">Medium</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[45%] bg-warning rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                    <span className="text-muted-foreground">Arrival Pressure</span>
                    <span className="text-profit">Low</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[15%] bg-profit rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAI;
