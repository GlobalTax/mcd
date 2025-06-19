import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { KPICards } from './KPICards';
import { RevenueChart } from './RevenueChart';
import { MarginChart } from './MarginChart';
import { CostChart } from './CostChart';
export const FinancialMetrics = ({ selectedYear, selectedRestaurant, restaurants }) => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(KPICards, {}), _jsx(RevenueChart, {}), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(MarginChart, {}), _jsx(CostChart, {})] })] }));
};
