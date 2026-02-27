import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import MarketNow from "./pages/MarketNow";
import PredictiveAI from "./pages/PredictiveAI";
import RiskPolicy from "./pages/RiskPolicy";
import StockPlanner from "./pages/StockPlanner";
import RouteWeather from "./pages/RouteWeather";
import HarvestHeatmap from "./pages/HarvestHeatmap";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="market" element={<MarketNow />} />
            <Route path="predict" element={<PredictiveAI />} />
            <Route path="risk" element={<RiskPolicy />} />
            <Route path="stock" element={<StockPlanner />} />
            <Route path="weather" element={<RouteWeather />} />
            <Route path="heatmap" element={<HarvestHeatmap />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
