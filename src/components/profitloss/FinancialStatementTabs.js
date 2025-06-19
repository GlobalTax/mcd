import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import ProfitLossDashboard from './ProfitLossDashboard';
import { BalanceSheetStatement } from './BalanceSheetStatement';
import { CashFlowStatement } from './CashFlowStatement';
export const FinancialStatementTabs = ({ restaurantId }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState('profit-loss');
    // Generar años disponibles (último 5 años + próximo año)
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Estados Financieros" }), _jsxs("p", { className: "text-gray-600", children: ["An\u00E1lisis completo del restaurante ", restaurantId] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => setSelectedYear(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: availableYears.map(year => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] }), _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(FileText, { className: "w-4 h-4" }), "Summary Report"] }), _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export"] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-6", children: [_jsx(TabsTrigger, { value: "profit-loss", className: "text-sm font-medium", children: "Profit & Loss" }), _jsx(TabsTrigger, { value: "balance-sheet", className: "text-sm font-medium", children: "Balance Sheet" }), _jsx(TabsTrigger, { value: "cash-flow", className: "text-sm font-medium", children: "Cash Flow Statement" })] }), _jsx(TabsContent, { value: "profit-loss", className: "space-y-6", children: _jsx(ProfitLossDashboard, { restaurantId: restaurantId }) }), _jsx(TabsContent, { value: "balance-sheet", className: "space-y-6", children: _jsx(BalanceSheetStatement, { restaurantId: restaurantId, year: selectedYear }) }), _jsx(TabsContent, { value: "cash-flow", className: "space-y-6", children: _jsx(CashFlowStatement, { restaurantId: restaurantId, year: selectedYear }) })] })] }));
};
