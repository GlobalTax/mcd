import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatNumber, formatPercentage } from '@/utils/valuationUtils';
const ProjectionTable = ({ inputs, yearlyData, onYearlyDataChange, tableStyles }) => {
    const yearsCount = Math.ceil(inputs.remainingYears);
    if (yearsCount === 0)
        return null;
    // Función para generar las fechas de cada período
    const generatePeriodDates = (yearIndex) => {
        const baseYear = 2025;
        const startYear = baseYear + yearIndex;
        const endYear = startYear + 1;
        const startDate = `16-jun-${startYear.toString().slice(-2)}`;
        const endDate = `15-jun-${endYear.toString().slice(-2)}`;
        return `${startDate} / ${endDate}`;
    };
    // Función para calcular MISCELL con crecimiento por inflación
    const calculateMiscellForYear = (yearIndex) => {
        if (yearIndex === 0) {
            return yearlyData[0]?.miscell || 0;
        }
        const firstYearMiscell = yearlyData[0]?.miscell || 0;
        if (firstYearMiscell === 0)
            return 0;
        const inflationRate = inputs.inflationRate / 100;
        return firstYearMiscell * Math.pow(1 + inflationRate, yearIndex);
    };
    // Función para manejar cambios en inputs con formato
    const handleInputChange = (yearIndex, field, value) => {
        // Remover puntos y convertir a número
        const numericValue = parseFloat(value.replace(/\./g, '')) || 0;
        onYearlyDataChange(yearIndex, field, numericValue);
    };
    // Función para manejar cambios en porcentajes con soporte para comas
    const handlePercentageChange = (yearIndex, field, value) => {
        // Reemplazar coma por punto para parseFloat
        const normalizedValue = value.replace(',', '.');
        const numericValue = parseFloat(normalizedValue) || 0;
        onYearlyDataChange(yearIndex, field, numericValue);
    };
    // Función para formatear el valor del porcentaje para mostrar
    const formatPercentageValue = (value) => {
        if (value === 0)
            return '';
        return value.toString().replace('.', ',');
    };
    // Apply custom styles to table elements
    const getTableStyle = () => ({
        fontFamily: tableStyles?.fontFamily || 'Inter, system-ui, sans-serif',
        fontSize: tableStyles?.fontSize || '14px',
        color: tableStyles?.cellTextColor || '#374151'
    });
    const getHeaderStyle = () => ({
        backgroundColor: tableStyles?.headerBg || '#1f2937',
        color: tableStyles?.headerTextColor || '#ffffff',
        borderColor: tableStyles?.borderColor || '#d1d5db'
    });
    const getCellStyle = () => ({
        backgroundColor: tableStyles?.cellBg || '#ffffff',
        color: tableStyles?.cellTextColor || '#374151',
        borderColor: tableStyles?.borderColor || '#d1d5db'
    });
    const getEditableCellStyle = () => ({
        backgroundColor: tableStyles?.editableCellBg || '#dbeafe',
        borderColor: tableStyles?.borderColor || '#d1d5db'
    });
    return (_jsxs(Card, { className: "bg-white border border-gray-200", style: getTableStyle(), children: [_jsxs(CardHeader, { className: "bg-white", children: [_jsxs(CardTitle, { className: "text-gray-900", style: { fontFamily: tableStyles?.fontFamily }, children: ["Proyecci\u00F3n Manual por A\u00F1os (", inputs.remainingYears.toFixed(4), " a\u00F1os exactos)"] }), _jsxs("p", { className: "text-sm text-gray-600 mt-2", style: { fontFamily: tableStyles?.fontFamily }, children: ["Introduce manualmente las ventas y MISCELL para cada a\u00F1o. MISCELL del primer a\u00F1o crecer\u00E1 autom\u00E1ticamente con inflaci\u00F3n del ", inputs.inflationRate, "% para los a\u00F1os siguientes."] })] }), _jsx(CardContent, { className: "bg-white", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", style: getTableStyle(), children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border p-2 text-left font-bold", style: getHeaderStyle(), children: "Concepto" }), Array.from({ length: yearsCount }, (_, i) => (_jsxs(React.Fragment, { children: [_jsxs("th", { className: "border p-2 text-center font-bold", style: getHeaderStyle(), children: [_jsx("div", { children: 2025 + i }), _jsx("div", { className: "text-xs font-normal mt-1", children: generatePeriodDates(i) }), i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (_jsxs("div", { className: "text-xs opacity-75 mt-1", children: ["(", ((inputs.remainingYears % 1) * 12).toFixed(1), " meses)"] }))] }), _jsx("th", { className: "border p-2 text-center font-bold w-20", style: getCellStyle(), children: "%" })] }, i)))] }) }), _jsxs("tbody", { style: getTableStyle(), children: [_jsxs("tr", { children: [_jsx("td", { className: "border p-2 font-semibold", style: getHeaderStyle(), children: "SALES (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: salesValue > 0 ? formatNumber(salesValue) : '', onChange: (e) => handleInputChange(i, 'sales', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: salesValue > 0 ? formatPercentage(100) : _jsx("span", { className: "text-gray-300", children: "100%" }) })] }, `sales-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 font-semibold", style: getHeaderStyle(), children: "P.A.C. (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                                                const pacAmount = salesValue * pacPercentage / 100;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-2 text-right", style: getCellStyle(), children: pacAmount > 0 ? formatNumber(pacAmount) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: formatPercentageValue(pacPercentage), onChange: (e) => handlePercentageChange(i, 'pacPercentage', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) })] }, `pac-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "RENT (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                                                const rentAmount = salesValue * rentPercentage / 100;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-2 text-right", style: getCellStyle(), children: rentAmount > 0 ? formatNumber(rentAmount) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: formatPercentageValue(rentPercentage), onChange: (e) => handlePercentageChange(i, 'rentPercentage', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) })] }, `rent-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "SERVICE FEES (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const serviceFees = salesValue * 0.05; // Fixed 5%
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-2 text-right", style: getCellStyle(), children: serviceFees > 0 ? formatNumber(serviceFees) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: salesValue > 0 ? formatPercentage(5) : _jsx("span", { className: "text-gray-300", children: "5%" }) })] }, `serviceFees-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "DEPRECIATION (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const depreciation = yearlyData[i]?.depreciation || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: depreciation > 0 ? formatNumber(depreciation) : '', onChange: (e) => handleInputChange(i, 'depreciation', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: depreciation > 0 && salesValue > 0 ?
                                                                formatPercentage((depreciation / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `depreciation-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "INTEREST (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const interest = yearlyData[i]?.interest || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: interest > 0 ? formatNumber(interest) : '', onChange: (e) => handleInputChange(i, 'interest', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: interest > 0 && salesValue > 0 ?
                                                                formatPercentage((interest / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `interest-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "RENT INDEX (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const rentIndex = yearlyData[i]?.rentIndex || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: rentIndex > 0 ? formatNumber(rentIndex) : '', onChange: (e) => handleInputChange(i, 'rentIndex', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: rentIndex > 0 && salesValue > 0 ?
                                                                formatPercentage((rentIndex / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `rentIndex-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "MISCELL (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const miscell = calculateMiscellForYear(i);
                                                const isFirstYear = i === 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: `border p-1 ${isFirstYear ? 'bg-blue-50' : 'bg-gray-50'}`, children: isFirstYear ? (_jsx(Input, { type: "text", value: yearlyData[0]?.miscell > 0 ? formatNumber(yearlyData[0].miscell) : '', onChange: (e) => handleInputChange(i, 'miscell', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } })) : (_jsx("div", { className: "w-full text-right text-sm p-1 font-manrope text-gray-700", children: miscell > 0 ? formatNumber(miscell) + ' €' : _jsx("span", { className: "text-gray-400", children: "0 \u20AC" }) })) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: miscell > 0 && salesValue > 0 ?
                                                                formatPercentage((miscell / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `miscell-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "TOTAL NON-CONTROLLABLES" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                                                const rentAmount = salesValue * rentPercentage / 100;
                                                const serviceFees = salesValue * 0.05; // Fixed 5%
                                                const depreciation = yearlyData[i]?.depreciation || 0;
                                                const interest = yearlyData[i]?.interest || 0;
                                                const rentIndex = yearlyData[i]?.rentIndex || 0;
                                                const miscell = calculateMiscellForYear(i);
                                                const totalNonControllables = rentAmount + serviceFees + depreciation + interest + rentIndex + miscell;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-2 text-right font-bold", style: getCellStyle(), children: totalNonControllables > 0 ? formatNumber(totalNonControllables) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: totalNonControllables > 0 && salesValue > 0 ?
                                                                formatPercentage((totalNonControllables / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `totalNonControllables-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 font-semibold bg-gray-800 text-white font-manrope", style: getHeaderStyle(), children: "S.O.I." }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                                                const pacAmount = salesValue * pacPercentage / 100;
                                                const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                                                const rentAmount = salesValue * rentPercentage / 100;
                                                const serviceFees = salesValue * 0.05; // Fixed 5%
                                                const depreciation = yearlyData[i]?.depreciation || 0;
                                                const interest = yearlyData[i]?.interest || 0;
                                                const rentIndex = yearlyData[i]?.rentIndex || 0;
                                                const miscell = calculateMiscellForYear(i);
                                                const totalNonControllables = rentAmount + serviceFees + depreciation + interest + rentIndex + miscell;
                                                const soi = pacAmount - totalNonControllables;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-2 text-right font-bold", style: getCellStyle(), children: salesValue > 0 ? formatNumber(soi) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: salesValue > 0 ?
                                                                formatPercentage((soi / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `soi-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "LOAN PAYMENT (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const loanPayment = yearlyData[i]?.loanPayment || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: loanPayment > 0 ? formatNumber(loanPayment) : '', onChange: (e) => handleInputChange(i, 'loanPayment', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: loanPayment > 0 && salesValue > 0 ?
                                                                formatPercentage((loanPayment / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `loanPayment-${i}`));
                                            })] }), _jsxs("tr", { children: [_jsx("td", { className: "border p-2 bg-gray-800 text-white font-semibold font-manrope", style: getHeaderStyle(), children: "REMODELACION / REINVERSION (\u20AC)" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const reinversion = yearlyData[i]?.reinversion || 0;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border p-1", style: getEditableCellStyle(), children: _jsx(Input, { type: "text", value: reinversion > 0 ? formatNumber(reinversion) : '', onChange: (e) => handleInputChange(i, 'reinversion', e.target.value), placeholder: "0", className: "w-full text-right text-sm border-0 p-1 placeholder:text-gray-400", style: {
                                                                    backgroundColor: 'transparent',
                                                                    fontFamily: tableStyles?.fontFamily,
                                                                    fontSize: tableStyles?.fontSize
                                                                } }) }), _jsx("td", { className: "border p-2 text-right text-xs", style: getCellStyle(), children: reinversion > 0 && salesValue > 0 ?
                                                                formatPercentage((reinversion / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `reinversion-${i}`));
                                            })] }), _jsxs("tr", { className: "bg-white font-bold", children: [_jsx("td", { className: "border border-gray-300 p-2 bg-gray-800 text-white font-bold font-manrope", style: getHeaderStyle(), children: "CASHFLOW" }), Array.from({ length: yearsCount }, (_, i) => {
                                                const salesValue = yearlyData[i]?.sales || 0;
                                                const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                                                const pacAmount = salesValue * pacPercentage / 100;
                                                const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                                                const rentAmount = salesValue * rentPercentage / 100;
                                                const serviceFees = salesValue * 0.05; // Fixed 5%
                                                const rentIndex = yearlyData[i]?.rentIndex || 0;
                                                const miscell = calculateMiscellForYear(i);
                                                const loanPayment = yearlyData[i]?.loanPayment || 0;
                                                const cashflow = pacAmount - rentAmount - serviceFees - rentIndex - miscell - loanPayment;
                                                return (_jsxs(React.Fragment, { children: [_jsx("td", { className: "border border-gray-300 p-2 text-right font-bold", style: getCellStyle(), children: salesValue > 0 ? formatNumber(cashflow) + ' €' : _jsx("span", { className: "text-gray-300", children: "0 \u20AC" }) }), _jsx("td", { className: "border border-gray-300 p-2 text-right text-xs", style: getCellStyle(), children: salesValue > 0 ?
                                                                formatPercentage((cashflow / salesValue) * 100) :
                                                                _jsx("span", { className: "text-gray-300", children: "0%" }) })] }, `cashflow-${i}`));
                                            })] })] })] }) }) })] }));
};
export default ProjectionTable;
