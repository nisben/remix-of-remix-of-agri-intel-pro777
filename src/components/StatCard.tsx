import { TrendingUp, Store, AlertTriangle, Brain } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  store: Store,
  trending: TrendingUp,
  alert: AlertTriangle,
  brain: Brain,
};

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: string;
}

const StatCard = ({ label, value, change, icon }: StatCardProps) => {
  const Icon = iconMap[icon] || Store;
  const isPositive = change.includes("+");

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold text-foreground mt-1">{value}</p>
          <p className={`text-xs mt-2 font-medium ${isPositive ? "text-profit" : "text-warning"}`}>
            {change}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
