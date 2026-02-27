import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calculator, ChevronDown, Store, Zap, ArrowRight, ArrowLeftRight } from "lucide-react";
import { priceHistory7d } from "@/lib/mockData";

type ArrivalLevel = "Low" | "Medium" | "High";
type RiskLevel = "Low" | "Medium" | "High";
type VolatilityLevel = "Low" | "Medium" | "High";

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
  "Tamil Nadu": {
    "Chennai": ["Koyambedu", "Thiruvanmiyur"]
  }
};

const commodities = ["Wheat", "Onion", "Tomato", "Rice", "Soybean", "Maize"];

const MarketNow = () => {
  // Cascading Filters State (Market A)
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Nashik");
  const [selectedMarket, setSelectedMarket] = useState(""); // Default to empty for District Average
  const [selectedCommodity, setSelectedCommodity] = useState("Onion");
  const [isLoading, setIsLoading] = useState(false);

  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [showComparisonResult, setShowComparisonResult] = useState(false);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  
  // Market B Filters
  const [selectedStateB, setSelectedStateB] = useState("Maharashtra");
  const [selectedDistrictB, setSelectedDistrictB] = useState("Nashik");
  const [selectedMarketB, setSelectedMarketB] = useState("");
  const [selectedCommodityB, setSelectedCommodityB] = useState("Onion");

  // Profit Calculator State
  const [buyPrice, setBuyPrice] = useState("1450");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("100");

  // Dynamic Options for Market A
  const districtOptions = useMemo(() => Object.keys(locationData[selectedState] || {}), [selectedState]);
  const marketOptions = useMemo(() => locationData[selectedState]?.[selectedDistrict] || [], [selectedState, selectedDistrict]);
  
  // Dynamic Options for Market B
  const districtOptionsB = useMemo(() => Object.keys(locationData[selectedStateB] || {}), [selectedStateB]);
  const marketOptionsB = useMemo(() => locationData[selectedStateB]?.[selectedDistrictB] || [], [selectedStateB, selectedDistrictB]);

  // Handle Cascading Logic for Market A
  const handleStateChange = (state: string) => {
    setIsLoading(true);
    setSelectedState(state);
    const districts = Object.keys(locationData[state]);
    setSelectedDistrict(districts[0]);
    setSelectedMarket(""); 
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleDistrictChange = (district: string) => {
    setIsLoading(true);
    setSelectedDistrict(district);
    setSelectedMarket(""); 
    setTimeout(() => setIsLoading(false), 500);
  };

  // Handle Cascading Logic for Market B
  const handleStateChangeB = (state: string) => {
    setSelectedStateB(state);
    const districts = Object.keys(locationData[state]);
    setSelectedDistrictB(districts[0]);
    setSelectedMarketB(""); 
    setShowComparisonResult(false);
  };

  const handleDistrictChangeB = (district: string) => {
    setSelectedDistrictB(district);
    setSelectedMarketB(""); 
    setShowComparisonResult(false);
  };

  // Generate dynamic data helper
  const generateMarketData = (market: string, commodity: string, state: string, district: string, offset = 0) => {
    const label = market || `${district} Average`;
    const seed = label.length + commodity.length + state.length + offset;
    const basePrice = 1200 + (seed * 40);
    
    return {
      label,
      price: basePrice,
      change: (seed % 5) - 2.5,
      arrival: seed % 3 === 0 ? "High" : seed % 3 === 1 ? "Medium" : "Low" as ArrivalLevel,
      risk: seed % 4 === 0 ? "High" : seed % 4 === 1 ? "Medium" : "Low" as RiskLevel,
      volatility: seed % 5 === 0 ? "Low" : seed % 5 < 3 ? "Medium" : "High" as VolatilityLevel,
      forecast: {
        predicted: Array.from({ length: 7 }, (_, i) => basePrice + (Math.sin(i) * 100) + (i * 15)),
      }
    };
  };

  const marketData = useMemo(() => 
    generateMarketData(selectedMarket, selectedCommodity, selectedState, selectedDistrict), 
    [selectedMarket, selectedDistrict, selectedCommodity, selectedState]
  );

  const marketBData = useMemo(() => 
    generateMarketData(selectedMarketB, selectedCommodityB, selectedStateB, selectedDistrictB, 7), 
    [selectedMarketB, selectedDistrictB, selectedCommodityB, selectedStateB]
  );

  // Sync Profit Calculator
  useEffect(() => {
    setSellPrice(marketData.price.toString());
  }, [marketData.price]);

  const handleCompareTrigger = () => {
    setIsLoadingCompare(true);
    setTimeout(() => {
      setShowComparisonResult(true);
      setIsLoadingCompare(false);
    }, 800);
  };

  const chartData = useMemo(() => {
    return priceHistory7d.map((d, i) => ({
      day: d.day,
      price: marketData.forecast.predicted[i]
    }));
  }, [marketData]);

  const mandiList = useMemo(() => {
    return marketOptions.map(m => {
      const seed = m.length + selectedCommodity.length;
      return {
        mandi: m,
        crop: selectedCommodity,
        price: 1300 + (seed * 35),
        change: (seed % 6) - 3,
        arrival: 400 + (seed * 15)
      };
    }).sort((a, b) => b.price - a.price);
  }, [selectedCommodity, marketOptions]);

  const stateMarkets = useMemo(() => {
    const districts = locationData[selectedState] || {};
    return Object.values(districts).flat();
  }, [selectedState]);

  const stateMandiList = useMemo(() => {
    return stateMarkets.map(m => {
      const seed = m.length + selectedCommodity.length;
      return {
        mandi: m,
        crop: selectedCommodity,
        price: 1300 + (seed * 35),
        change: (seed % 6) - 3,
        arrival: 400 + (seed * 15)
      };
    }).sort((a, b) => b.price - a.price);
  }, [selectedCommodity, stateMarkets]);

  const profitableMandis = useMemo(() => {
    return stateMandiList.slice(0, 5).map((m, i) => ({
      ...m,
      profit: 12.5 - (i * 1.2),
      margin: `₹${(m.price * 0.12).toFixed(0)}/qtl`
    }));
  }, [stateMandiList]);

  const margin =
    buyPrice && sellPrice && quantity
      ? ((parseFloat(sellPrice) - parseFloat(buyPrice)) * parseFloat(quantity)).toFixed(0)
      : null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Market Now</h1>
          <p className="text-sm text-muted-foreground">Live localized mandi intelligence and profitability tools</p>
        </div>
      </div>

      {/* Cascading Filter Bar (Market A) */}
      <div className="space-y-4">
        <div className="bg-card/50 border border-border p-3 rounded-xl grid grid-cols-2 lg:grid-cols-4 gap-3 items-center shadow-sm relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
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
          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1 z-10">Market</label>
            <select 
              value={selectedMarket} 
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select Market (District Average)</option>
              {marketOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {!isComparing && (
          <button 
            onClick={() => setIsComparing(true)}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors px-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Compare With Another Market
          </button>
        )}
      </div>

      {/* Market B Comparison Section */}
      {isComparing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-6 shadow-glow animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Compare Markets
            </h3>
            <button 
              onClick={() => {
                setIsComparing(false);
                setShowComparisonResult(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50" />
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Market A (Current Selection)</p>
              <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-1">
                <p className="text-xs font-bold text-foreground">{marketData.label}</p>
                <p className="text-[10px] text-muted-foreground">{selectedState}, {selectedDistrict} • {selectedCommodity}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">FILTER – Market B</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select 
                    value={selectedStateB} 
                    onChange={(e) => handleStateChangeB(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[11px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
                <div className="relative">
                  <select 
                    value={selectedDistrictB} 
                    onChange={(e) => handleDistrictChangeB(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[11px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {districtOptionsB.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
                <div className="relative">
                  <select 
                    value={selectedCommodityB} 
                    onChange={(e) => {
                      setSelectedCommodityB(e.target.value);
                      setShowComparisonResult(false);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[11px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {commodities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
                <div className="relative">
                  <select 
                    value={selectedMarketB} 
                    onChange={(e) => {
                      setSelectedMarketB(e.target.value);
                      setShowComparisonResult(false);
                    }}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-[11px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Select Market B</option>
                    {marketOptionsB.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleCompareTrigger}
              disabled={isLoadingCompare}
              className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {isLoadingCompare ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Compare Markets</>
              )}
            </button>
          </div>

          {showComparisonResult && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 pt-4 border-t border-border">
              <div className="overflow-hidden rounded-xl border border-border bg-background/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                      <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Metric</th>
                      <th className="text-center py-3 px-6 font-semibold uppercase tracking-wider">{marketData.label}</th>
                      <th className="text-center py-3 px-6 font-semibold uppercase tracking-wider">{marketBData.label}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-4 px-6 text-foreground font-medium">Current Price (₹/qtl)</td>
                      <td className={`text-center py-4 px-6 font-bold ${marketData.price >= marketBData.price ? 'text-profit bg-profit/5' : 'text-foreground'}`}>
                        ₹{marketData.price.toLocaleString()} {marketData.price >= marketBData.price && "↑"}
                      </td>
                      <td className={`text-center py-4 px-6 font-bold ${marketBData.price > marketData.price ? 'text-profit bg-profit/5' : 'text-foreground'}`}>
                        ₹{marketBData.price.toLocaleString()} {marketBData.price > marketData.price && "↑"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-foreground font-medium">Price Change (%)</td>
                      <td className={`text-center py-4 px-6 font-bold ${marketData.change > 0 ? "text-profit" : "text-loss"}`}>
                        {marketData.change > 0 ? "+" : ""}{marketData.change}%
                      </td>
                      <td className={`text-center py-4 px-6 font-bold ${marketBData.change > 0 ? "text-profit" : "text-loss"}`}>
                        {marketBData.change > 0 ? "+" : ""}{marketBData.change}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-foreground font-medium">Arrival Level</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketData.arrival}</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketBData.arrival}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-foreground font-medium">Risk Level</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketData.risk}</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketBData.risk}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-foreground font-medium">Volatility Level</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketData.volatility}</td>
                      <td className="text-center py-4 px-6 font-medium text-foreground">{marketBData.volatility}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Price Difference</p>
                  <p className="text-lg font-display font-bold text-foreground">₹{Math.abs(marketData.price - marketBData.price).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">per quintal</span></p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                  <span>{marketData.label}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{marketBData.label}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Banner KPIs */}
      <div className="bg-gradient-card rounded-xl border border-primary/20 p-5 shadow-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Zap className="w-24 h-24 text-primary" />
        </div>
        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Market Intelligence</p>
        <h3 className="font-display text-xl font-bold text-foreground">
          What is the best price I can buy/sell at right now?
        </h3>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div className="bg-profit/10 border border-profit/20 rounded-lg p-4 group hover:bg-profit/15 transition-all">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Best Buy Price Now</p>
            <p className="text-3xl font-display font-bold text-profit">₹{(marketData.price * 0.95).toFixed(0).toLocaleString()}<span className="text-xs font-normal">/qtl</span></p>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Store className="w-3 h-3" /> {marketData.label}, {selectedDistrict} — {selectedCommodity}
            </p>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 group hover:bg-warning/15 transition-all">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Best Sell Price Now</p>
            <p className="text-3xl font-display font-bold text-warning">₹{marketData.price.toLocaleString()}<span className="text-xs font-normal">/qtl</span></p>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Store className="w-3 h-3" /> {marketData.label}, {selectedDistrict} — {selectedCommodity}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Prices Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Live Mandi Prices</h3>
            <span className="text-[10px] text-muted-foreground italic">District: {selectedDistrict}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <th className="text-left py-3 font-medium">Mandi</th>
                  <th className="text-left py-3 font-medium">Crop</th>
                  <th className="text-right py-3 font-medium">Price (₹/qtl)</th>
                  <th className="text-right py-3 font-medium">Change</th>
                  <th className="text-right py-3 font-medium">Arrivals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mandiList.map((market) => (
                  <tr key={market.mandi} className={`hover:bg-muted/30 transition-colors ${market.mandi === selectedMarket ? "bg-primary/5" : ""}`}>
                    <td className="py-4 text-foreground font-bold flex items-center gap-2">
                      {market.mandi === selectedMarket && <div className="w-1 h-4 bg-primary rounded-full" />}
                      {market.mandi}
                    </td>
                    <td className="py-4 text-muted-foreground font-medium">{market.crop}</td>
                    <td className="py-4 text-right font-display font-bold text-foreground">₹{market.price.toLocaleString()}</td>
                    <td className={`py-4 text-right font-bold ${market.change > 0 ? "text-profit" : "text-loss"}`}>
                      <span className="inline-flex items-center gap-1">
                        {market.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {market.change > 0 ? "+" : ""}{market.change}%
                      </span>
                    </td>
                    <td className="py-4 text-right text-muted-foreground font-medium">{market.arrival.toLocaleString()} qtl</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Profitable */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Top 5 Profitable Mandis</h3>
            <span className="text-[10px] text-muted-foreground italic">State: {selectedState}</span>
          </div>
          <div className="space-y-3">
            {profitableMandis.map((market, index) => (
              <div key={market.mandi} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${market.mandi === selectedMarket ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-transparent hover:border-border"}`}>
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${market.mandi === selectedMarket ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{market.mandi}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{market.margin} Advantage</p>
                </div>
                <span className="text-sm font-display font-black text-profit">{market.profit.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Trend Chart */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-foreground">7-Day Price Trend</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 italic">Based on selected filters: {marketData.label} • {selectedCommodity}</p>
          </div>
          <div className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            Current Trend
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
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
              formatter={(value: number) => [`₹${value.toLocaleString()}`, selectedCommodity]}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              name={selectedCommodity} 
              stroke="hsl(var(--primary))" 
              strokeWidth={4} 
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }} 
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[9px] text-muted-foreground mt-4 text-center italic opacity-60">
          * Data synthesized from historical averages and real-time mandi feeds. Last updated 1 hour ago.
        </p>
      </div>

      {/* Profit Calculator */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
          <Calculator className="w-20 h-20 text-primary" />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Profit Calculator</h3>
            <p className="text-[10px] text-muted-foreground">Estimate your margins based on {marketData.label} rate</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-4 gap-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Buy Price (₹/qtl)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(event) => setBuyPrice(event.target.value)}
              placeholder="1400"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Sell Price (₹/qtl)</label>
            <div className="relative">
              <input
                type="number"
                value={sellPrice}
                onChange={(event) => setSellPrice(event.target.value)}
                placeholder="1650"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
              <span className="absolute right-3 top-2.5 text-[8px] font-black text-primary px-1 bg-primary/10 rounded border border-primary/20">AUTO</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Quantity (qtl)</label>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="100"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Net Profit</label>
            <div
              className={`w-full rounded-lg px-4 py-2.5 text-lg font-display font-bold flex items-center justify-between border ${
                margin && parseFloat(margin) > 0
                  ? "bg-profit/10 text-profit border-profit/20"
                  : margin && parseFloat(margin) < 0
                    ? "bg-loss/10 text-loss border-loss/20"
                    : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {margin ? `₹${parseFloat(margin).toLocaleString()}` : "—"}
              {margin && parseFloat(margin) > 0 && <TrendingUp className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketNow;
