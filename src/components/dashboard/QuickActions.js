import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calculator, Calendar, TrendingUp, Building2, ArrowRight } from 'lucide-react';
export const QuickActions = ({ displayRestaurants, onNavigateToValuation, onNavigateToAnnualBudget, onNavigateToProfitLoss }) => {
    const getSiteNumber = (restaurant) => {
        return restaurant.siteNumber || restaurant.site_number;
    };
    const actions = [
        {
            title: 'Valoración',
            description: 'Herramienta profesional',
            icon: Calculator,
            onClick: onNavigateToValuation,
            color: 'text-red-600'
        },
        {
            title: 'Presupuestos',
            description: 'Gestión anual',
            icon: Calendar,
            onClick: onNavigateToAnnualBudget,
            color: 'text-blue-600'
        },
        {
            title: 'Análisis P&L',
            description: 'Rendimiento financiero',
            icon: TrendingUp,
            onClick: () => {
                const firstRestaurant = displayRestaurants[0];
                const siteNumber = getSiteNumber(firstRestaurant);
                if (siteNumber) {
                    onNavigateToProfitLoss(siteNumber);
                }
            },
            color: 'text-green-600',
            disabled: displayRestaurants.length === 0
        },
        {
            title: 'Restaurantes',
            description: `${displayRestaurants.length} asignados`,
            icon: Building2,
            onClick: () => { },
            color: 'text-purple-600'
        }
    ];
    return (_jsxs("div", { className: "mb-12", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-6", children: "Acciones r\u00E1pidas" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: actions.map((action, index) => (_jsxs("button", { onClick: action.onClick, disabled: action.disabled, className: "bg-white border border-gray-100 rounded-lg p-6 text-left hover:border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(action.icon, { className: `w-5 h-5 ${action.color}` }), _jsx(ArrowRight, { className: "w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: action.title }), _jsx("p", { className: "text-sm text-gray-500", children: action.description })] })] }, index))) })] }));
};
