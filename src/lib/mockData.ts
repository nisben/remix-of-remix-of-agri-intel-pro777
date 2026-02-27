// Mock data for AgriIntel Pro

export const mandiPrices = [
  { mandi: "Azadpur, Delhi", crop: "Wheat", price: 2450, change: +3.2, arrival: 1250 },
  { mandi: "Vashi, Mumbai", crop: "Onion", price: 1800, change: -2.1, arrival: 890 },
  { mandi: "Yeshwanthpur, Bangalore", crop: "Tomato", price: 2100, change: +5.7, arrival: 670 },
  { mandi: "Lasalgaon, Nashik", crop: "Onion", price: 1650, change: -1.8, arrival: 2100 },
  { mandi: "Koyambedu, Chennai", crop: "Rice", price: 3200, change: +1.4, arrival: 540 },
];

export const topProfitableMandis = [
  { mandi: "Azadpur, Delhi", margin: "₹320/qtl", profit: 15.2 },
  { mandi: "Yeshwanthpur, Bangalore", margin: "₹280/qtl", profit: 13.8 },
  { mandi: "Koyambedu, Chennai", margin: "₹245/qtl", profit: 11.5 },
  { mandi: "Devi Ahilya Bai, Indore", margin: "₹210/qtl", profit: 9.8 },
  { mandi: "Gultekdi, Pune", margin: "₹195/qtl", profit: 8.9 },
];

export const priceHistory7d = [
  { day: "Mon", wheat: 2380, onion: 1850, tomato: 1950 },
  { day: "Tue", wheat: 2400, onion: 1820, tomato: 2000 },
  { day: "Wed", wheat: 2390, onion: 1790, tomato: 2050 },
  { day: "Thu", wheat: 2420, onion: 1810, tomato: 2020 },
  { day: "Fri", wheat: 2435, onion: 1780, tomato: 2080 },
  { day: "Sat", wheat: 2440, onion: 1800, tomato: 2090 },
  { day: "Sun", wheat: 2450, onion: 1800, tomato: 2100 },
];

export const priceForecast = [
  { day: "Day 1", actual: 2450, predicted: 2460, low: 2420, high: 2500 },
  { day: "Day 2", actual: 2465, predicted: 2470, low: 2430, high: 2510 },
  { day: "Day 3", actual: 2480, predicted: 2485, low: 2445, high: 2525 },
  { day: "Day 4", actual: null, predicted: 2500, low: 2455, high: 2545 },
  { day: "Day 5", actual: null, predicted: 2520, low: 2470, high: 2570 },
  { day: "Day 6", actual: null, predicted: 2535, low: 2480, high: 2590 },
  { day: "Day 7", actual: null, predicted: 2550, low: 2490, high: 2610 },
  { day: "Day 8", actual: null, predicted: 2565, low: 2500, high: 2630 },
  { day: "Day 9", actual: null, predicted: 2575, low: 2510, high: 2640 },
  { day: "Day 10", actual: null, predicted: 2580, low: 2515, high: 2645 },
];

export const riskAlerts = [
  { id: 1, type: "policy", severity: "high" as const, title: "Export Ban Risk: Onion", message: "Government considering export restrictions on onion due to domestic price surge. Expected announcement within 48 hours.", date: "2026-02-22" },
  { id: 2, type: "weather", severity: "medium" as const, title: "Heavy Rainfall Alert: Maharashtra", message: "IMD predicts above-normal rainfall in Nashik region. Onion storage risk elevated.", date: "2026-02-21" },
  { id: 3, type: "msp", severity: "low" as const, title: "MSP Revision: Rabi Crops", message: "Government announces 5% MSP increase for wheat effective next month.", date: "2026-02-20" },
  { id: 4, type: "trade", severity: "medium" as const, title: "Import Duty Change: Edible Oil", message: "Reduction in import duty on palm oil from 15% to 7.5%. Domestic soybean prices may face pressure.", date: "2026-02-19" },
];

export const monthlyHeatmap = [
  { month: "Jan", wheat: 2200, rice: 3000, onion: 1400, tomato: 1800 },
  { month: "Feb", wheat: 2300, rice: 3100, onion: 1500, tomato: 1900 },
  { month: "Mar", wheat: 2250, rice: 3050, onion: 1650, tomato: 2100 },
  { month: "Apr", wheat: 2150, rice: 2950, onion: 1800, tomato: 2400 },
  { month: "May", wheat: 2100, rice: 2900, onion: 2100, tomato: 2800 },
  { month: "Jun", wheat: 2050, rice: 2850, onion: 2400, tomato: 3200 },
  { month: "Jul", wheat: 2000, rice: 2800, onion: 2600, tomato: 2900 },
  { month: "Aug", wheat: 2050, rice: 2900, onion: 2300, tomato: 2500 },
  { month: "Sep", wheat: 2150, rice: 3000, onion: 2000, tomato: 2200 },
  { month: "Oct", wheat: 2250, rice: 3100, onion: 1700, tomato: 2000 },
  { month: "Nov", wheat: 2350, rice: 3200, onion: 1500, tomato: 1850 },
  { month: "Dec", wheat: 2400, rice: 3250, onion: 1450, tomato: 1750 },
];

export const weatherRoutes = [
  { route: "Nashik → Mumbai", distance: "167 km", humidity: 82, temp: 34, risk: "high" as const, spoilage: "12%" },
  { route: "Indore → Delhi", distance: "810 km", humidity: 45, temp: 28, risk: "low" as const, spoilage: "3%" },
  { route: "Bangalore → Chennai", distance: "346 km", humidity: 68, temp: 31, risk: "medium" as const, spoilage: "7%" },
  { route: "Lucknow → Kolkata", distance: "985 km", humidity: 75, temp: 33, risk: "medium" as const, spoilage: "9%" },
  { route: "Pune → Hyderabad", distance: "560 km", humidity: 55, temp: 30, risk: "low" as const, spoilage: "4%" },
];

export const harvestZones = [
  { region: "Punjab", vigor: 92, quality: "A+", shelfLife: "High", area: "2.4M ha", color: "#22c55e" },
  { region: "Madhya Pradesh", vigor: 85, quality: "A", shelfLife: "High", area: "3.1M ha", color: "#4ade80" },
  { region: "Uttar Pradesh", vigor: 78, quality: "B+", shelfLife: "Medium", area: "4.2M ha", color: "#86efac" },
  { region: "Maharashtra", vigor: 71, quality: "B", shelfLife: "Medium", area: "2.8M ha", color: "#fbbf24" },
  { region: "Rajasthan", vigor: 62, quality: "B-", shelfLife: "Low", area: "1.9M ha", color: "#f97316" },
  { region: "Karnataka", vigor: 88, quality: "A", shelfLife: "High", area: "1.6M ha", color: "#34d399" },
];

export const arrivalData = [
  { time: "6:00", arrivals: 120 },
  { time: "8:00", arrivals: 350 },
  { time: "10:00", arrivals: 580 },
  { time: "12:00", arrivals: 420 },
  { time: "14:00", arrivals: 280 },
  { time: "16:00", arrivals: 150 },
  { time: "18:00", arrivals: 80 },
];

export const dashboardStats = [
  { label: "Active Mandis", value: "2,847", change: "+12", icon: "store" },
  { label: "Avg Price Today", value: "₹2,450", change: "+3.2%", icon: "trending" },
  { label: "Risk Alerts", value: "4", change: "2 new", icon: "alert" },
  { label: "AI Accuracy", value: "94.2%", change: "+1.8%", icon: "brain" },
];
