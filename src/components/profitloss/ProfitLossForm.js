import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfitLossData } from '@/hooks/useProfitLossData';
import { Save, Calculator } from 'lucide-react';
export const ProfitLossForm = ({ restaurantId, onClose, editData }) => {
    const { createProfitLossData, updateProfitLossData } = useProfitLossData();
    const [formData, setFormData] = useState({
        restaurant_id: restaurantId,
        year: editData?.year || new Date().getFullYear(),
        month: editData?.month || new Date().getMonth() + 1,
        net_sales: editData?.net_sales || 0,
        other_revenue: editData?.other_revenue || 0,
        food_cost: editData?.food_cost || 0,
        paper_cost: editData?.paper_cost || 0,
        management_labor: editData?.management_labor || 0,
        crew_labor: editData?.crew_labor || 0,
        benefits: editData?.benefits || 0,
        rent: editData?.rent || 0,
        utilities: editData?.utilities || 0,
        maintenance: editData?.maintenance || 0,
        advertising: editData?.advertising || 0,
        insurance: editData?.insurance || 0,
        supplies: editData?.supplies || 0,
        other_expenses: editData?.other_expenses || 0,
        franchise_fee: editData?.franchise_fee || 0,
        advertising_fee: editData?.advertising_fee || 0,
        rent_percentage: editData?.rent_percentage || 0,
        notes: editData?.notes || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'string' && field !== 'notes' ? parseFloat(value) || 0 : value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editData) {
                await updateProfitLossData.mutateAsync({ ...formData, id: editData.id });
            }
            else {
                await createProfitLossData.mutateAsync(formData);
            }
            onClose();
        }
        catch (error) {
            console.error('Error saving P&L data:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Calcular totales en tiempo real
    const totalRevenue = formData.net_sales + formData.other_revenue;
    const totalCostOfSales = formData.food_cost + formData.paper_cost;
    const totalLabor = formData.management_labor + formData.crew_labor + formData.benefits;
    const totalOperatingExpenses = formData.rent + formData.utilities + formData.maintenance +
        formData.advertising + formData.insurance + formData.supplies + formData.other_expenses;
    const totalMcDonaldsFees = formData.franchise_fee + formData.advertising_fee + formData.rent_percentage;
    const grossProfit = totalRevenue - totalCostOfSales;
    const operatingIncome = totalRevenue - totalCostOfSales - totalLabor - totalOperatingExpenses - totalMcDonaldsFees;
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "year", children: "A\u00F1o" }), _jsxs(Select, { value: formData.year.toString(), onValueChange: (value) => handleInputChange('year', parseInt(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: availableYears.map(year => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "month", children: "Mes" }), _jsxs(Select, { value: formData.month.toString(), onValueChange: (value) => handleInputChange('month', parseInt(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: monthNames.map((month, index) => (_jsx(SelectItem, { value: (index + 1).toString(), children: month }, index + 1))) })] })] }), _jsx("div", { className: "flex items-end", children: _jsx(Card, { className: "w-full", children: _jsxs(CardContent, { className: "p-3", children: [_jsx("div", { className: "text-sm text-gray-600", children: "Beneficio Operativo" }), _jsxs("div", { className: `text-lg font-bold ${operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", operatingIncome.toLocaleString()] })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg text-green-700", children: "Ingresos" }) }), _jsxs(CardContent, { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "net_sales", children: "Ventas Netas" }), _jsx(Input, { id: "net_sales", type: "number", step: "0.01", value: formData.net_sales, onChange: (e) => handleInputChange('net_sales', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "other_revenue", children: "Otros Ingresos" }), _jsx(Input, { id: "other_revenue", type: "number", step: "0.01", value: formData.other_revenue, onChange: (e) => handleInputChange('other_revenue', e.target.value) })] }), _jsx("div", { className: "col-span-2 bg-green-50 p-3 rounded", children: _jsxs("strong", { children: ["Total Ingresos: \u20AC", totalRevenue.toLocaleString()] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg text-red-700", children: "Costo de Ventas" }) }), _jsxs(CardContent, { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "food_cost", children: "Costo Comida" }), _jsx(Input, { id: "food_cost", type: "number", step: "0.01", value: formData.food_cost, onChange: (e) => handleInputChange('food_cost', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "paper_cost", children: "Costo Papel/Envases" }), _jsx(Input, { id: "paper_cost", type: "number", step: "0.01", value: formData.paper_cost, onChange: (e) => handleInputChange('paper_cost', e.target.value) })] }), _jsx("div", { className: "col-span-2 bg-red-50 p-3 rounded", children: _jsxs("strong", { children: ["Total Costo Ventas: \u20AC", totalCostOfSales.toLocaleString()] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg text-orange-700", children: "Costos de Mano de Obra" }) }), _jsxs(CardContent, { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "management_labor", children: "Mano de Obra Gerencial" }), _jsx(Input, { id: "management_labor", type: "number", step: "0.01", value: formData.management_labor, onChange: (e) => handleInputChange('management_labor', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "crew_labor", children: "Mano de Obra Equipo" }), _jsx(Input, { id: "crew_labor", type: "number", step: "0.01", value: formData.crew_labor, onChange: (e) => handleInputChange('crew_labor', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "benefits", children: "Beneficios/Seguros" }), _jsx(Input, { id: "benefits", type: "number", step: "0.01", value: formData.benefits, onChange: (e) => handleInputChange('benefits', e.target.value) })] }), _jsx("div", { className: "col-span-3 bg-orange-50 p-3 rounded", children: _jsxs("strong", { children: ["Total Mano de Obra: \u20AC", totalLabor.toLocaleString()] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg text-blue-700", children: "Gastos Operativos" }) }), _jsxs(CardContent, { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "rent", children: "Alquiler" }), _jsx(Input, { id: "rent", type: "number", step: "0.01", value: formData.rent, onChange: (e) => handleInputChange('rent', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "utilities", children: "Servicios P\u00FAblicos" }), _jsx(Input, { id: "utilities", type: "number", step: "0.01", value: formData.utilities, onChange: (e) => handleInputChange('utilities', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "maintenance", children: "Mantenimiento" }), _jsx(Input, { id: "maintenance", type: "number", step: "0.01", value: formData.maintenance, onChange: (e) => handleInputChange('maintenance', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "advertising", children: "Publicidad Local" }), _jsx(Input, { id: "advertising", type: "number", step: "0.01", value: formData.advertising, onChange: (e) => handleInputChange('advertising', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "insurance", children: "Seguros" }), _jsx(Input, { id: "insurance", type: "number", step: "0.01", value: formData.insurance, onChange: (e) => handleInputChange('insurance', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "supplies", children: "Suministros" }), _jsx(Input, { id: "supplies", type: "number", step: "0.01", value: formData.supplies, onChange: (e) => handleInputChange('supplies', e.target.value) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx(Label, { htmlFor: "other_expenses", children: "Otros Gastos" }), _jsx(Input, { id: "other_expenses", type: "number", step: "0.01", value: formData.other_expenses, onChange: (e) => handleInputChange('other_expenses', e.target.value) })] }), _jsx("div", { className: "col-span-3 bg-blue-50 p-3 rounded", children: _jsxs("strong", { children: ["Total Gastos Operativos: \u20AC", totalOperatingExpenses.toLocaleString()] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg text-yellow-700", children: "Fees McDonald's" }) }), _jsxs(CardContent, { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "franchise_fee", children: "Fee Franquicia" }), _jsx(Input, { id: "franchise_fee", type: "number", step: "0.01", value: formData.franchise_fee, onChange: (e) => handleInputChange('franchise_fee', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "advertising_fee", children: "Fee Publicidad" }), _jsx(Input, { id: "advertising_fee", type: "number", step: "0.01", value: formData.advertising_fee, onChange: (e) => handleInputChange('advertising_fee', e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "rent_percentage", children: "% Alquiler Ventas" }), _jsx(Input, { id: "rent_percentage", type: "number", step: "0.01", value: formData.rent_percentage, onChange: (e) => handleInputChange('rent_percentage', e.target.value) })] }), _jsx("div", { className: "col-span-3 bg-yellow-50 p-3 rounded", children: _jsxs("strong", { children: ["Total Fees McDonald's: \u20AC", totalMcDonaldsFees.toLocaleString()] }) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "notes", children: "Notas" }), _jsx(Textarea, { id: "notes", value: formData.notes, onChange: (e) => handleInputChange('notes', e.target.value), placeholder: "Comentarios adicionales sobre este mes...", rows: 3 })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calculator, { className: "w-5 h-5" }), "Resumen Calculado"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Ingresos Totales:" }), _jsxs("span", { className: "font-semibold", children: ["\u20AC", totalRevenue.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Beneficio Bruto:" }), _jsxs("span", { className: "font-semibold", children: ["\u20AC", grossProfit.toLocaleString()] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Margen Bruto:" }), _jsxs("span", { className: "font-semibold", children: [totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: operatingIncome >= 0 ? 'text-green-600' : 'text-red-600', children: "Beneficio Operativo:" }), _jsxs("span", { className: `font-bold ${operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", operatingIncome.toLocaleString()] })] })] })] }) })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancelar" }), _jsxs(Button, { type: "submit", disabled: isSubmitting, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isSubmitting ? 'Guardando...' : editData ? 'Actualizar' : 'Guardar'] })] })] }));
};
