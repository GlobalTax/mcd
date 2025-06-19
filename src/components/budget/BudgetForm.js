import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BasicInfoSection } from './BasicInfoSection';
import { ValuationParametersSection } from './ValuationParametersSection';
import { CostPercentagesSection } from './CostPercentagesSection';
import { FixedCostsSection } from './FixedCostsSection';
import { NotesSection } from './NotesSection';
export const BudgetForm = ({ restaurants, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        budget_name: '',
        budget_year: new Date().getFullYear(),
        franchisee_restaurant_id: '',
        initial_sales: 0,
        sales_growth_rate: 5,
        inflation_rate: 3,
        discount_rate: 10,
        years_projection: 5,
        pac_percentage: 30,
        rent_percentage: 10,
        service_fees_percentage: 4,
        depreciation: 50000,
        interest: 10000,
        loan_payment: 20000,
        rent_index: 5000,
        miscellaneous: 8000,
        notes: ''
    });
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Nuevo Presupuesto de Valoraci\u00F3n" }), _jsx("p", { className: "text-gray-600", children: "Complete los datos para crear una nueva proyecci\u00F3n financiera" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(BasicInfoSection, { formData: formData, restaurants: restaurants, onInputChange: handleInputChange }), _jsx(ValuationParametersSection, { formData: formData, onInputChange: handleInputChange }), _jsx(CostPercentagesSection, { formData: formData, onInputChange: handleInputChange }), _jsx(FixedCostsSection, { formData: formData, onInputChange: handleInputChange }), _jsx(NotesSection, { formData: formData, onInputChange: handleInputChange }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }), _jsx(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", children: "Crear Presupuesto" })] })] })] }));
};
