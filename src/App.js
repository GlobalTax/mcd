import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const AuthDebugPage = lazy(() => import("./pages/AuthDebugPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Componente de carga mejorado
const LoadingSpinner = () => (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4" }), _jsx("div", { className: "absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-red-400 animate-ping" })] }), _jsx("p", { className: "text-gray-600 font-medium", children: "Cargando aplicaci\u00F3n..." }), _jsx("p", { className: "text-gray-400 text-sm mt-2", children: "McDonald's Franchise Management" })] }) }));
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
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(TooltipProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(Toaster, { position: "top-right", richColors: true, closeButton: true, duration: 4000 }), _jsx(Suspense, { fallback: _jsx(LoadingSpinner, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Index, {}) }), _jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/advisor-auth", element: _jsx(AdvisorAuthPage, {}) }), _jsx(Route, { path: "/auth-debug", element: _jsx(AuthDebugPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/restaurant", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(RestaurantPage, {}) }) }), _jsx(Route, { path: "/profit-loss", element: _jsx(Navigate, { to: "/profit-loss/001", replace: true }) }), _jsx(Route, { path: "/profit-loss/:siteNumber", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(ProfitLossPage, {}) }) }), _jsx(Route, { path: "/analysis", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(AnalysisPage, {}) }) }), _jsx(Route, { path: "/annual-budget", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(AnnualBudgetPage, {}) }) }), _jsx(Route, { path: "/advisor", element: _jsx(ProtectedRoute, { allowedRoles: ['asesor', 'admin', 'superadmin'], children: _jsx(AdvisorPage, {}) }) }), _jsx(Route, { path: "/advisor/franchisee/:franchiseeId", element: _jsx(ProtectedRoute, { allowedRoles: ['asesor', 'admin', 'superadmin'], children: _jsx(FranchiseeDetailPage, {}) }) }), _jsx(Route, { path: "/valuation", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(ValuationApp, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/activity-history", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(ActivityHistoryPage, {}) }) }), _jsx(Route, { path: "/notifications", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(NotificationsPage, {}) }) }), _jsx(Route, { path: "/valuation-comparison", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(ValuationComparisonPage, {}) }) }), _jsx(Route, { path: "/budget-reports", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(BudgetReportsPage, {}) }) }), _jsx(Route, { path: "/budget-analysis", element: _jsx(ProtectedRoute, { allowedRoles: ['franchisee'], children: _jsx(BudgetAnalysisPage, {}) }) }), _jsx(Route, { path: "/user-invitation", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(UserInvitationPage, {}) }) }), _jsx(Route, { path: "/advanced-user-management", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(AdvancedUserManagementPage, {}) }) }), _jsx(Route, { path: "/advanced-reporting", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(AdvancedReportingPage, {}) }) }), _jsx(Route, { path: "/improvements", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(ImprovementsPage, {}) }) }), _jsx(Route, { path: "/audit-compliance", element: _jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(AuditCompliancePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) })] }) }) }) }));
}
export default App;
