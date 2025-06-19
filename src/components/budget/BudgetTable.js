import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { BudgetTableHeaderComponent } from './BudgetTableHeader';
import { BudgetTableRowComponent } from './BudgetTableRow';
export const BudgetTable = ({ data, actualData = [], onCellChange, onActualChange, viewMode = 'budget', showOnlySummary = false }) => {
    const [editingCell, setEditingCell] = useState(null);
    // Filtrar datos según el modo de resumen
    const filteredData = showOnlySummary
        ? data.filter(row => row.isCategory)
        : data;
    const handleCellClick = (rowId, field, isCategory, isActual = false) => {
        if (isCategory)
            return;
        setEditingCell({ rowId, field, isActual });
    };
    const handleInputChange = (value) => {
        const numValue = parseFloat(value) || 0;
        if (editingCell && !editingCell.isActual) {
            onCellChange(editingCell.rowId, editingCell.field, numValue);
        }
    };
    const handleActualChange = (rowId, field, value) => {
        if (onActualChange) {
            onActualChange(rowId, field, value);
        }
    };
    const handleInputBlur = () => {
        setEditingCell(null);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };
    return (_jsx("div", { className: "w-full", children: _jsx("div", { className: "overflow-x-auto border rounded-lg", children: _jsxs(Table, { className: "min-w-full", children: [_jsx(BudgetTableHeaderComponent, { viewMode: viewMode }), _jsx(TableBody, { children: filteredData.map((row) => (_jsx(BudgetTableRowComponent, { row: row, data: data, actualData: actualData, viewMode: viewMode, editingCell: editingCell, onCellClick: handleCellClick, onInputChange: handleInputChange, onInputBlur: handleInputBlur, onKeyPress: handleKeyPress, onActualChange: handleActualChange }, row.id))) })] }) }) }));
};
