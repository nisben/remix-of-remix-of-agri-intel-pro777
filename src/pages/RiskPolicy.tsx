import { ShieldAlert, AlertTriangle, Bell, FileText, Droplets } from "lucide-react";
import { riskAlerts } from "@/lib/mockData";

const severityConfig = {
  high: { label: "HIGH", classes: "text-loss bg-loss/10 border-loss/30" },
  medium: { label: "MEDIUM", classes: "text-warning bg-warning/10 border-warning/30" },
  low: { label: "LOW", classes: "text-profit bg-profit/10 border-profit/30" },
};

const typeIcon: Record<string, React.ElementType> = {
  policy: FileText,
  weather: Droplets,
  msp: Bell,
  trade: ShieldAlert,
};

const RiskPolicy = () => {
  const overallRisk = "MEDIUM";

  return (
    <div className="space-y-6">
      {/* Question Banner */}
      <div className="bg-gradient-card rounded-xl border border-warning/20 p-5 shadow-accent">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <p className="text-warning text-sm font-medium">Policy Intelligence</p>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          Is the government about to ban exports?
        </h3>
      </div>

      {/* Risk Meter */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Overall Risk Meter</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden flex">
            <div className="h-full bg-profit" style={{ width: "33%" }} />
            <div className="h-full bg-warning" style={{ width: "34%" }} />
            <div className="h-full bg-loss" style={{ width: "33%" }} />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-warning bg-warning/10 border border-warning/30">
            {overallRisk}
          </span>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {riskAlerts.map((alert) => {
          const sev = severityConfig[alert.severity];
          const Icon = typeIcon[alert.type] || ShieldAlert;
          return (
            <div key={alert.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-warning/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${sev.classes}`}>
                      {sev.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{alert.date}</span>
                  </div>
                  <h4 className="font-display font-semibold text-foreground">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskPolicy;
