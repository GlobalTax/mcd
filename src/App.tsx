import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdvisorAuthPage from "./pages/AdvisorAuthPage";
import { lazy, Suspense } from "react";

// Lazy loading optimizado con preloading
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));
const ProfitLossPage = lazy(() => import("./pages/ProfitLossPage"));
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));
const AdvisorPage = lazy(() => import("./pages/AdvisorPage"));
const FranchiseeDetailPage = lazy(() => import("./pages/FranchiseeDetailPage"));
const ValuationApp = lazy(() => import("./pages/ValuationApp"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AnnualBudgetPage = lazy(() => import("./pages/AnnualBudgetPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ActivityHistoryPage = lazy(() => import("./pages/ActivityHistoryPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ValuationComparisonPage = lazy(() => import("./pages/ValuationComparisonPage"));
const BudgetReportsPage = lazy(() => import("./pages/BudgetReportsPage"));
const BudgetAnalysisPage = lazy(() => import("./pages/BudgetAnalysisPage"));
const UserInvitationPage = lazy(() => import("./pages/UserInvitationPage"));
const AdvancedUserManagementPage = lazy(() => import("./pages/AdvancedUserManagementPage"));
const AdvancedReportingPage = lazy(() => import("./pages/AdvancedReportingPage"));
const ImprovementsPage = lazy(() => import("./pages/ImprovementsPage"));
const AuditCompliancePage = lazy(() => import("./pages/AuditCompliancePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente de carga mejorado
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-red-400 animate-ping"></div>
      </div>
      <p className="text-gray-600 font-medium">Cargando aplicación...</p>
      <p className="text-gray-400 text-sm mt-2">McDonald's Franchise Management</p>
    </div>
  </div>
);

// QueryClient optimizado con configuración de caché
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/advisor-auth" element={<AdvisorAuthPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurant"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <RestaurantPage />
                    </ProtectedRoute>
                  }
                />
                {/* Redirección de /profit-loss a /profit-loss/001 (primer restaurante) */}
                <Route
                  path="/profit-loss"
                  element={<Navigate to="/profit-loss/001" replace />}
                />
                <Route
                  path="/profit-loss/:siteNumber"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <ProfitLossPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <AnalysisPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/annual-budget"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <AnnualBudgetPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor"
                  element={
                    <ProtectedRoute allowedRoles={['asesor', 'admin', 'superadmin']}>
                      <AdvisorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor/franchisee/:franchiseeId"
                  element={
                    <ProtectedRoute allowedRoles={['asesor', 'admin', 'superadmin']}>
                      <FranchiseeDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/valuation"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <ValuationApp />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity-history"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <ActivityHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/valuation-comparison"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <ValuationComparisonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budget-reports"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <BudgetReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budget-analysis"
                  element={
                    <ProtectedRoute allowedRoles={['franchisee']}>
                      <BudgetAnalysisPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-invitation"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <UserInvitationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advanced-user-management"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AdvancedUserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advanced-reporting"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AdvancedReportingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/improvements"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <ImprovementsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audit-compliance"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AuditCompliancePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
