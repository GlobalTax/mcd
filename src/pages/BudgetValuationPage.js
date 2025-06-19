import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useValuationBudgets } from '@/hooks/useValuationBudgets';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { BudgetList } from '@/components/budget/BudgetList';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { BudgetDetail } from '@/components/budget/BudgetDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, TrendingUp, Calculator, DollarSign } from 'lucide-react';
export default function BudgetValuationPage() {
    const { budgets, loading, createBudget, updateBudget, deleteBudget } = useValuationBudgets();
    const { restaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();
    const [currentView, setCurrentView] = useState('list');
    const [selectedBudget, setSelectedBudget] = useState(null);
    const handleCreateBudget = () => {
        setCurrentView('create');
        setSelectedBudget(null);
    };
    const handleSelectBudget = (budget) => {
        setSelectedBudget(budget);
        setCurrentView('detail');
    };
    const handleBack = () => {
        setCurrentView('list');
        setSelectedBudget(null);
    };
    const handleFormSubmit = async (data) => {
        const success = await createBudget(data);
        if (success) {
            setCurrentView('list');
        }
    };
    const totalValuation = budgets.reduce((sum, budget) => sum + (budget.final_valuation || 0), 0);
    const activeBudgets = budgets.filter(budget => budget.status === 'draft' || budget.status === 'approved').length;
    const avgProjectionYears = budgets.length > 0
        ? budgets.reduce((sum, budget) => sum + budget.years_projection, 0) / budgets.length
        : 0;
    if (loading || restaurantsLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando presupuestos de valoraci\u00F3n..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4 py-6 max-w-7xl", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [currentView !== 'list' && (_jsxs(Button, { variant: "ghost", onClick: handleBack, className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver"] })), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("div", { className: "w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center", children: _jsx(Calculator, { className: "text-white text-xl" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Presupuestos de Valoraci\u00F3n" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Gesti\u00F3n y proyecci\u00F3n financiera de restaurantes" })] })] }) }), currentView === 'list' && (_jsxs(Button, { onClick: handleCreateBudget, className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Nuevo Presupuesto"] }))] }) }), currentView === 'list' && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Valoraci\u00F3n Total" }), _jsx(DollarSign, { className: "h-4 w-4 text-green-600" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", totalValuation.toLocaleString('es-ES', { maximumFractionDigits: 0 })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Suma de todas las valoraciones" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Presupuestos Activos" }), _jsx(TrendingUp, { className: "h-4 w-4 text-blue-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: activeBudgets }), _jsx("p", { className: "text-xs text-muted-foreground", children: "En borrador o aprobados" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Proyecci\u00F3n Promedio" }), _jsx(Calculator, { className: "h-4 w-4 text-purple-600" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [avgProjectionYears.toFixed(1), " a\u00F1os"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Per\u00EDodo de proyecci\u00F3n" })] })] })] })), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm", children: [currentView === 'list' && (_jsx(BudgetList, { budgets: budgets, onSelectBudget: handleSelectBudget, onDeleteBudget: deleteBudget })), currentView === 'create' && (_jsx(BudgetForm, { restaurants: restaurants, onSubmit: handleFormSubmit, onCancel: handleBack })), currentView === 'detail' && selectedBudget && (_jsx(BudgetDetail, { budget: selectedBudget, onUpdate: updateBudget, onDelete: deleteBudget, onBack: handleBack }))] })] }) }));
}
