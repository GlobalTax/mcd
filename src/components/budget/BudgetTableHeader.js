import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { months, getHeaderLabels } from './BudgetTableUtils';
export const BudgetTableHeaderComponent = ({ viewMode }) => {
    const headerLabels = getHeaderLabels(viewMode);
    return (_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-gray-50", children: [_jsx(TableHead, { className: "sticky left-0 bg-gray-50 z-20 min-w-[300px] border-r font-bold text-gray-900 text-base", children: "Concepto" }), months.map(month => (_jsx(TableHead, { className: "text-center border-r min-w-[200px] p-3", children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "font-bold text-gray-900 text-base", children: month.label }), headerLabels.monthSubheaders] }) }, month.key))), _jsx(TableHead, { className: "text-center min-w-[250px] bg-blue-100 font-bold border-l text-base p-3", children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-gray-900", children: "Total Anual" }), headerLabels.totalSubheaders] }) })] }) }));
};
