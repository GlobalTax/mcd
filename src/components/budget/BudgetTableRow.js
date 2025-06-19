import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TableCell, TableRow } from '@/components/ui/table';
import { BudgetTableCell } from './BudgetTableCell';
import { months, formatCurrency, getCellValue, getActualValue, calculateCategoryTotals, calculateCategoryActualTotals, getVarianceColor, getVariancePercentage } from './BudgetTableUtils';
export const BudgetTableRowComponent = ({ row, data, actualData, viewMode, editingCell, onCellClick, onInputChange, onInputBlur, onKeyPress, onActualChange }) => {
    // Para categorías, calculamos los totales sumando las subcategorías
    const categoryTotalByMonth = row.isCategory ?
        months.reduce((acc, month) => {
            acc[month.key] = calculateCategoryTotals(data, row.category, month.key);
            return acc;
        }, {}) : {};
    const categoryActualTotalByMonth = row.isCategory ?
        months.reduce((acc, month) => {
            acc[month.key] = calculateCategoryActualTotals(data, actualData, row.category, month.key);
            return acc;
        }, {}) : {};
    const actualTotal = row.isCategory ?
        months.reduce((sum, month) => sum + (categoryActualTotalByMonth[month.key] || 0), 0) :
        months.reduce((sum, month) => sum + getActualValue(row, month.key, actualData), 0);
    const budgetTotal = row.isCategory ?
        months.reduce((sum, month) => sum + (categoryTotalByMonth[month.key] || 0), 0) :
        row.total;
    return (_jsxs(TableRow, { className: `${row.isCategory ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'} border-b`, children: [_jsx(TableCell, { className: "sticky left-0 bg-white z-10 font-medium border-r p-4", children: _jsx("div", { className: row.isCategory ? 'font-bold text-gray-900 text-base' : 'pl-6 text-gray-700 font-medium', children: row.subcategory || row.category }) }), months.map(month => {
                const budgetValue = row.isCategory ?
                    categoryTotalByMonth[month.key] :
                    getCellValue(row, month.key);
                const actualValue = row.isCategory ?
                    categoryActualTotalByMonth[month.key] :
                    getActualValue(row, month.key, actualData);
                return (_jsx(TableCell, { className: "text-center p-2 border-r", children: _jsx(BudgetTableCell, { budgetValue: budgetValue, actualValue: actualValue, viewMode: viewMode, isCategory: row.isCategory, rowId: row.id, field: month.key, editingCell: editingCell, onCellClick: onCellClick, onInputChange: onInputChange, onInputBlur: onInputBlur, onKeyPress: onKeyPress, onActualChange: onActualChange }) }, month.key));
            }), _jsx(TableCell, { className: "text-center bg-blue-50 font-bold border-l p-2", children: _jsxs("div", { className: viewMode === 'comparison' ? "grid grid-cols-3 gap-1" : "flex justify-center", children: [viewMode !== 'actuals' && (_jsx("div", { className: "text-blue-700 font-bold text-base py-2", children: formatCurrency(budgetTotal) })), viewMode === 'actuals' && (_jsx("div", { className: "text-green-700 font-bold text-base py-2", children: formatCurrency(actualTotal) })), viewMode === 'comparison' && (_jsxs(_Fragment, { children: [_jsx("div", { className: `font-bold text-base py-2 ${getVarianceColor(budgetTotal, actualTotal)}`, children: formatCurrency(actualTotal) }), _jsx("div", { className: `font-bold text-sm py-2 ${getVarianceColor(budgetTotal, actualTotal)}`, children: getVariancePercentage(budgetTotal, actualTotal) })] }))] }) })] }));
};
