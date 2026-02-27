import { User, Bell, Shield, CreditCard } from "lucide-react";

const SettingsPage = () => (
  <div className="space-y-6 max-w-2xl">
    <h2 className="font-display text-2xl font-bold text-foreground">Settings</h2>

    {/* Profile */}
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Profile</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Name</label>
          <input type="text" defaultValue="Jai Deshmukh" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Email</label>
          <input type="email" defaultValue="jai@agriintel.in" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Notifications</h3>
      </div>
      <div className="space-y-3">
        {["Price alerts", "Risk & policy updates", "Weather warnings", "Weekly digest"].map((item) => (
          <label key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-sm text-foreground">{item}</span>
            <div className="w-10 h-6 rounded-full bg-primary/30 relative">
              <div className="w-4 h-4 rounded-full bg-primary absolute right-1 top-1" />
            </div>
          </label>
        ))}
      </div>
    </div>

    {/* Subscription */}
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Subscription</h3>
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div>
          <p className="text-sm font-medium text-foreground">Pro Plan</p>
          <p className="text-xs text-muted-foreground">₹1,999/month • Renews Mar 22, 2026</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
          Manage
        </button>
      </div>
    </div>
  </div>
);

export default SettingsPage;
