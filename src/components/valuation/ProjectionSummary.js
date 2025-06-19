import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/valuationUtils';
import { TableStyleEditor, defaultStyles } from './TableStyleEditor';
const ProjectionSummary = ({ projections, totalPrice }) => {
    const [tableStyles, setTableStyles] = useState({
        ...defaultStyles,
        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
    });
    if (projections.length === 0)
        return null;
    const totalCfLibre = projections.reduce((sum, p) => sum + p.cfValue, 0);
    const totalPresentValue = projections.reduce((sum, p) => sum + p.presentValue, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(TableStyleEditor, { styles: tableStyles, onStylesChange: setTableStyles }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "font-manrope", children: "Resumen de Proyecciones" }) }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[600px] border-collapse font-manrope", style: {
                                    fontSize: tableStyles.fontSize,
                                    fontFamily: 'Manrope, Inter, system-ui, sans-serif',
                                    borderColor: tableStyles.borderColor
                                }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border p-3 text-left min-w-[120px] font-semibold", style: {
                                                        backgroundColor: tableStyles.headerBg,
                                                        color: tableStyles.headerTextColor,
                                                        borderColor: tableStyles.borderColor,
                                                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                    }, children: "Per\u00EDodo" }), _jsx("th", { className: "border p-3 text-right min-w-[140px] font-semibold", style: {
                                                        backgroundColor: tableStyles.headerBg,
                                                        color: tableStyles.headerTextColor,
                                                        borderColor: tableStyles.borderColor,
                                                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                    }, children: "CF Libre" }), _jsx("th", { className: "border p-3 text-right min-w-[140px] font-semibold", style: {
                                                        backgroundColor: tableStyles.headerBg,
                                                        color: tableStyles.headerTextColor,
                                                        borderColor: tableStyles.borderColor,
                                                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                    }, children: "Valor Presente" })] }) }), _jsxs("tbody", { children: [projections.map((p, index) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "border p-3 min-w-[120px]", style: {
                                                            backgroundColor: tableStyles.cellBg,
                                                            color: tableStyles.cellTextColor,
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: [_jsxs("span", { className: "font-medium", children: ["A\u00F1o ", index + 1] }), p.timeToNextYear < 1 && (_jsxs("span", { className: "text-xs opacity-60 ml-1", children: ["(", (p.timeToNextYear * 12).toFixed(1), " meses)"] }))] }), _jsx("td", { className: "border p-3 text-right min-w-[140px] font-medium", style: {
                                                            backgroundColor: tableStyles.cellBg,
                                                            color: tableStyles.cellTextColor,
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: formatCurrency(p.cfValue) }), _jsx("td", { className: "border p-3 text-right min-w-[140px] font-medium", style: {
                                                            backgroundColor: tableStyles.cellBg,
                                                            color: tableStyles.cellTextColor,
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: formatCurrency(p.presentValue) })] }, index))), _jsxs("tr", { className: "font-bold bg-green-50 border-t-2 border-green-200", children: [_jsx("td", { className: "border p-4 min-w-[120px] text-green-800 font-bold", style: {
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: "TOTAL" }), _jsx("td", { className: "border p-4 text-right min-w-[140px] text-green-800 font-bold", style: {
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: formatCurrency(totalCfLibre) }), _jsx("td", { className: "border p-4 text-right min-w-[140px] text-green-600 font-bold", style: {
                                                            borderColor: tableStyles.borderColor,
                                                            fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                                                        }, children: formatCurrency(totalPresentValue) })] })] })] }) }) })] })] }));
};
export default ProjectionSummary;
