
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdvisorAuthPage from "./pages/AdvisorAuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";
import RestaurantPage from "./pages/RestaurantPage";
import ProfitLossPage from "./pages/ProfitLossPage";
import ValuationApp from "./pages/ValuationApp";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/advisor-auth" element={<AdvisorAuthPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/advisor" element={<ProtectedRoute requiredRole="advisor"><AdvisorPage /></ProtectedRoute>} />
              <Route path="/restaurant" element={<ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
              <Route path="/profit-loss" element={<ProtectedRoute><ProfitLossPage /></ProtectedRoute>} />
              <Route path="/valuation" element={<ProtectedRoute><ValuationApp /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
