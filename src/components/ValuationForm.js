import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateRestaurantValuation } from '@/utils/valuationCalculator';
import { Calculator, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
export function ValuationForm({ restaurant, onSaveValuation }) {
    // Default restaurant data if none provided
    const defaultRestaurant = {
        id: 'default',
        name: 'Restaurante McDonald\'s',
        location: 'Ubicación por determinar'
    };
    const currentRestaurant = restaurant || defaultRestaurant;
    const [formData, setFormData] = useState({
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
    });
    const [result, setResult] = useState(null);
    const handleInputChange = (field, value) => {
        const numValue = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, [field]: field === 'valuationDate' ? value : numValue }));
    };
    const handleCalculate = () => {
        const calculationResult = calculateRestaurantValuation(formData);
        setResult(calculationResult);
    };
    const handleSave = () => {
        if (result && onSaveValuation) {
            onSaveValuation({
                ...formData,
                ...result,
                restaurantId: currentRestaurant.id,
                id: Date.now().toString(),
                createdAt: new Date(),
                createdBy: 'Usuario'
            });
            toast.success('Valoración guardada correctamente');
        }
        else if (result && !onSaveValuation) {
            toast.success('Valoración calculada correctamente');
        }
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold", children: ["Valoraci\u00F3n de ", currentRestaurant.name] }), _jsx("p", { className: "text-gray-600", children: currentRestaurant.location })] }) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calculator, { className: "w-5 h-5" }), "Datos para Valoraci\u00F3n"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "valuationDate", children: "Fecha de Valoraci\u00F3n" }), _jsx(Input, { id: "valuationDate", type: "date", value: formData.valuationDate, onChange: (e) => handleInputChange('valuationDate', e.target.value) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-green-600", children: "\uD83D\uDCCA Datos de Ventas (Datos en Verde)" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "initialSales", children: "Ventas Iniciales (\u20AC)" }), _jsx(Input, { id: "initialSales", type: "number", value: formData.initialSales, onChange: (e) => handleInputChange('initialSales', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "salesGrowthRate", children: "Crecimiento Ventas (%)" }), _jsx(Input, { id: "salesGrowthRate", type: "number", step: "0.1", value: formData.salesGrowthRate, onChange: (e) => handleInputChange('salesGrowthRate', e.target.value), className: "bg-green-50 border-green-200" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-blue-600", children: "\u2699\uFE0F Par\u00E1metros Financieros" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "inflationRate", children: "Inflaci\u00F3n (%)" }), _jsx(Input, { id: "inflationRate", type: "number", step: "0.1", value: formData.inflationRate, onChange: (e) => handleInputChange('inflationRate', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "discountRate", children: "Tasa Descuento (%)" }), _jsx(Input, { id: "discountRate", type: "number", step: "0.1", value: formData.discountRate, onChange: (e) => handleInputChange('discountRate', e.target.value), className: "bg-green-50 border-green-200" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "yearsRemaining", children: "A\u00F1os Restantes Contrato" }), _jsx(Input, { id: "yearsRemaining", type: "number", value: formData.yearsRemaining, onChange: (e) => handleInputChange('yearsRemaining', e.target.value), className: "bg-green-50 border-green-200" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-purple-600", children: "\uD83D\uDCC8 Costos como % de Ventas" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "pacPercentage", children: "P.A.C. (%)" }), _jsx(Input, { id: "pacPercentage", type: "number", step: "0.1", value: formData.pacPercentage, onChange: (e) => handleInputChange('pacPercentage', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "rentPercentage", children: "Alquiler (%)" }), _jsx(Input, { id: "rentPercentage", type: "number", step: "0.01", value: formData.rentPercentage, onChange: (e) => handleInputChange('rentPercentage', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "serviceFeesPercentage", children: "Service Fees (%)" }), _jsx(Input, { id: "serviceFeesPercentage", type: "number", step: "0.1", value: formData.serviceFeesPercentage, onChange: (e) => handleInputChange('serviceFeesPercentage', e.target.value), className: "bg-green-50 border-green-200" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-orange-600", children: "\uD83D\uDCB0 Costos Fijos Anuales (\u20AC)" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "depreciation", children: "Depreciaci\u00F3n" }), _jsx(Input, { id: "depreciation", type: "number", value: formData.depreciation, onChange: (e) => handleInputChange('depreciation', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "interest", children: "Intereses" }), _jsx(Input, { id: "interest", type: "number", value: formData.interest, onChange: (e) => handleInputChange('interest', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "loanPayment", children: "Pago Pr\u00E9stamo" }), _jsx(Input, { id: "loanPayment", type: "number", value: formData.loanPayment, onChange: (e) => handleInputChange('loanPayment', e.target.value), className: "bg-green-50 border-green-200" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "rentIndex", children: "\u00CDndice Alquiler" }), _jsx(Input, { id: "rentIndex", type: "number", value: formData.rentIndex, onChange: (e) => handleInputChange('rentIndex', e.target.value), className: "bg-green-50 border-green-200" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "miscellaneous", children: "Gastos Diversos" }), _jsx(Input, { id: "miscellaneous", type: "number", value: formData.miscellaneous, onChange: (e) => handleInputChange('miscellaneous', e.target.value), className: "bg-green-50 border-green-200" })] })] }), _jsx("div", { className: "flex gap-2 pt-4", children: _jsxs(Button, { onClick: handleCalculate, className: "flex-1", children: [_jsx(Calculator, { className: "w-4 h-4 mr-2" }), "Calcular Valoraci\u00F3n"] }) })] })] }), result && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-5 h-5" }), "Resultado de Valoraci\u00F3n"] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "text-center p-6 bg-green-50 rounded-lg", children: [_jsx("h3", { className: "text-2xl font-bold text-green-600 mb-2", children: formatCurrency(result.finalValuation) }), _jsx("p", { className: "text-green-700", children: "Valoraci\u00F3n Final del Restaurante" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-semibold", children: "Flujos de Caja Proyectados (primeros 5 a\u00F1os):" }), result.projectedCashFlows.slice(0, 5).map((cf, index) => (_jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 rounded", children: [_jsxs("span", { children: ["A\u00F1o ", index + 1] }), _jsx("span", { className: "font-semibold", children: formatCurrency(cf) })] }, index)))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-semibold", children: "M\u00E9tricas Clave:" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "p-3 bg-blue-50 rounded", children: [_jsx("p", { className: "text-blue-600 font-medium", children: "Ventas A\u00F1o 1" }), _jsx("p", { className: "text-lg font-bold", children: formatCurrency(result.yearlyProjections[0]?.sales || 0) })] }), _jsxs("div", { className: "p-3 bg-purple-50 rounded", children: [_jsx("p", { className: "text-purple-600 font-medium", children: "S.O.I. A\u00F1o 1" }), _jsx("p", { className: "text-lg font-bold", children: formatCurrency(result.yearlyProjections[0]?.soi || 0) })] })] })] }), _jsx(Button, { onClick: handleSave, className: "w-full", variant: "default", children: "Guardar Valoraci\u00F3n" })] })] }))] })] }));
}
