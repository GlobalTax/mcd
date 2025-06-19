import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronDown } from 'lucide-react';
import { calculateRestaurantValuation } from '@/utils/valuationCalculator';
// Datos base para la proyección
const baseData = {
    valuationDate: new Date().toISOString().split('T')[0],
    initialSales: 2454919,
    salesGrowthRate: 3,
    inflationRate: 1.5,
    discountRate: 21,
    yearsRemaining: 20,
    pacPercentage: 32,
    rentPercentage: 11.47,
    serviceFeesPercentage: 5,
    depreciation: 72092,
    interest: 19997,
    loanPayment: 31478,
    rentIndex: 75925,
    miscellaneous: 85521
};
// Calcular proyecciones iniciales
const calculateInitialProjections = () => {
    const result = calculateRestaurantValuation(baseData);
    return result.yearlyProjections.slice(0, 10).map((projection, index) => ({
        id: (index + 1).toString(),
        year: projection.year,
        sales: projection.sales,
        pac: projection.pac,
        rent: projection.rent,
        serviceFees: projection.serviceFees,
        soi: projection.soi,
        cashflow: projection.cashflow,
        freeCashFlow: projection.freeCashFlow
    }));
};
const definitions = [
    {
        term: 'Sales',
        definition: 'Ventas totales proyectadas con crecimiento anual del 3%'
    },
    {
        term: 'P.A.C.',
        definition: 'Costo de comida y papel como porcentaje de ventas (32%)'
    },
    {
        term: 'Rent',
        definition: 'Alquiler como porcentaje de ventas (11.47%)'
    },
    {
        term: 'Service Fees',
        definition: 'Tarifas de servicio como porcentaje de ventas (5%)'
    },
    {
        term: 'S.O.I.',
        definition: 'Store Operating Income - Ingresos operativos después de todos los gastos'
    },
    {
        term: 'Cashflow',
        definition: 'Flujo de caja operativo incluyendo pagos de préstamo'
    },
    {
        term: 'Free Cash Flow',
        definition: 'Flujo de caja libre después de reinversiones y depreciación'
    }
];
export function NotionTable() {
    const [data, setData] = useState(calculateInitialProjections());
    const [showDefinitions, setShowDefinitions] = useState(false);
    const [newRow, setNewRow] = useState({
        year: '',
        sales: '',
        pac: '',
        rent: '',
        serviceFees: '',
        soi: '',
        cashflow: '',
        freeCashFlow: ''
    });
    const [isAddingRow, setIsAddingRow] = useState(false);
    const handleAddRow = () => {
        if (newRow.year && newRow.sales) {
            const newData = {
                id: Date.now().toString(),
                year: parseInt(newRow.year),
                sales: parseFloat(newRow.sales),
                pac: parseFloat(newRow.pac) || 0,
                rent: parseFloat(newRow.rent) || 0,
                serviceFees: parseFloat(newRow.serviceFees) || 0,
                soi: parseFloat(newRow.soi) || 0,
                cashflow: parseFloat(newRow.cashflow) || 0,
                freeCashFlow: parseFloat(newRow.freeCashFlow) || 0
            };
            setData([...data, newData]);
            setNewRow({
                year: '',
                sales: '',
                pac: '',
                rent: '',
                serviceFees: '',
                soi: '',
                cashflow: '',
                freeCashFlow: ''
            });
            setIsAddingRow(false);
        }
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        }).format(value) + ' €';
    };
    const formatYear = (year) => {
        return year.toString();
    };
    return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-6 h-6 bg-orange-100 rounded flex items-center justify-center", children: _jsx("span", { className: "text-orange-600 text-sm", children: "\uD83D\uDCCA" }) }), _jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Valoraci\u00F3n Restaurante / Proyecciones Financieras" })] }) }), _jsxs("div", { className: "space-y-8", children: [_jsxs(Card, { className: "border-0 shadow-none bg-transparent", children: [_jsx(CardHeader, { className: "px-0 pb-4", children: _jsx(CardTitle, { className: "text-3xl font-bold text-gray-900", children: "Proyecciones Financieras 2025-2034" }) }), _jsx(CardContent, { className: "px-0", children: _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-gray-50 border-b border-gray-200", children: [_jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "A\u00F1o" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "Ventas" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "P.A.C." }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "Alquiler" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "Service Fees" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "S.O.I." }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "Cashflow" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-4 px-6", children: "Free Cash Flow" })] }) }), _jsxs(TableBody, { children: [data.map((row) => (_jsxs(TableRow, { className: "border-b border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx(TableCell, { className: "py-4 px-6", children: _jsx("span", { className: "font-medium text-gray-900", children: formatYear(row.year) }) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.sales) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.pac) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.rent) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.serviceFees) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.soi) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700", children: formatCurrency(row.cashflow) }), _jsx(TableCell, { className: "py-4 px-6 text-gray-700 font-semibold", children: formatCurrency(row.freeCashFlow) })] }, row.id))), isAddingRow && (_jsxs(TableRow, { className: "border-b border-gray-100", children: [_jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.year, onChange: (e) => setNewRow({ ...newRow, year: e.target.value }), placeholder: "2035", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.sales, onChange: (e) => setNewRow({ ...newRow, sales: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.pac, onChange: (e) => setNewRow({ ...newRow, pac: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.rent, onChange: (e) => setNewRow({ ...newRow, rent: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.serviceFees, onChange: (e) => setNewRow({ ...newRow, serviceFees: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.soi, onChange: (e) => setNewRow({ ...newRow, soi: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.cashflow, onChange: (e) => setNewRow({ ...newRow, cashflow: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) }), _jsx(TableCell, { className: "py-4 px-6", children: _jsx(Input, { type: "number", value: newRow.freeCashFlow, onChange: (e) => setNewRow({ ...newRow, freeCashFlow: e.target.value }), placeholder: "0", className: "border-0 p-0 h-auto focus-visible:ring-0" }) })] }))] })] }), _jsx("div", { className: "p-4 border-t border-gray-100", children: !isAddingRow ? (_jsxs(Button, { variant: "ghost", onClick: () => setIsAddingRow(true), className: "text-gray-500 hover:text-gray-700 hover:bg-gray-50", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar a\u00F1o"] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleAddRow, size: "sm", children: "Guardar" }), _jsx(Button, { variant: "ghost", onClick: () => setIsAddingRow(false), size: "sm", children: "Cancelar" })] })) })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded", onClick: () => setShowDefinitions(!showDefinitions), children: [_jsx(ChevronDown, { className: `w-4 h-4 text-gray-500 transition-transform ${showDefinitions ? 'rotate-0' : '-rotate-90'}` }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Definiciones de m\u00E9tricas financieras" })] }), showDefinitions && (_jsx("div", { className: "mt-6", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "border-b border-gray-200", children: [_jsx(TableHead, { className: "font-semibold text-gray-700 py-3 w-48", children: "T\u00E9rmino" }), _jsx(TableHead, { className: "font-semibold text-gray-700 py-3", children: "Definici\u00F3n" })] }) }), _jsx(TableBody, { children: definitions.map((def, index) => (_jsxs(TableRow, { className: "border-b border-gray-100", children: [_jsx(TableCell, { className: "py-4 font-medium text-gray-900", children: def.term }), _jsx(TableCell, { className: "py-4 text-gray-700", children: def.definition })] }, index))) })] }) }))] })] })] }));
}
