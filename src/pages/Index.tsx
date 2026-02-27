import { Link } from "react-router-dom";
import {
  TrendingUp,
  Brain,
  ShieldAlert,
  CloudRain,
  Map,
  Package,
  ArrowRight,
  Leaf,
  Check,
  BarChart3,
  Zap,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: TrendingUp,
    title: "Market Now",
    desc: "Real-time mandi prices across 2,800+ markets with instant buy/sell signals.",
  },
  {
    icon: Brain,
    title: "Predictive AI",
    desc: "5-30 day price forecasts with 94%+ accuracy using ML models.",
  },
  {
    icon: ShieldAlert,
    title: "Risk & Policy",
    desc: "Track export bans, MSP updates, and trade policies before they impact you.",
  },
  {
    icon: Package,
    title: "Stock Planner",
    desc: "Know the best month to stock and release for maximum ROI.",
  },
  {
    icon: CloudRain,
    title: "Route Weather",
    desc: "Real-time humidity and temperature alerts to reduce post-harvest losses.",
  },
  {
    icon: Map,
    title: "Harvest Heatmap",
    desc: "Satellite-powered field vigor index and quality scoring.",
  },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["Live mandi prices", "Basic trend charts", "3 crops tracked", "Daily email digest"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹1,999",
    period: "/month",
    features: [
      "Everything in Free",
      "AI price predictions",
      "Risk & policy alerts",
      "Stock planner",
      "Route weather intelligence",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Export intelligence",
      "Satellite heatmaps",
      "Custom API access",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              AgriIntel Pro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            AI-Powered Agricultural Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Know When to{" "}
            <span className="text-gradient-primary">Buy, Sell</span>
            <br />& <span className="text-gradient-accent">Maximize Profit</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Real-time mandi intelligence, AI price forecasts, risk alerts, and satellite insights — built for India's farmers, traders, and exporters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-gradient-hero text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all flex items-center gap-2"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Explore Features
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "2,847+", label: "Mandis Tracked" },
              { value: "94.2%", label: "AI Accuracy" },
              { value: "150+", label: "Crops Covered" },
              { value: "<5%", label: "Post-Harvest Loss" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4">
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to <span className="text-gradient-primary">Win</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From live market data to satellite intelligence — one platform to rule them all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group bg-card rounded-xl border border-border p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Simple, Transparent <span className="text-gradient-accent">Pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  p.highlight
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border bg-card"
                }`}
              >
                {p.highlight && (
                  <span className="text-xs font-semibold text-primary bg-primary/15 rounded-full px-3 py-1 w-fit mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-foreground">{p.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-3xl font-display font-bold text-foreground">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard"
                  className={`w-full py-2.5 rounded-lg text-center font-semibold text-sm transition-all ${
                    p.highlight
                      ? "bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">AgriIntel Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 AgriIntel Pro. Built for India's agricultural future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
