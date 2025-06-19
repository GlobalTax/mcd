import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
export const WelcomeSection = ({ onNavigateToValuation }) => {
    return (_jsx("div", { className: "text-center py-20", children: _jsxs("div", { className: "max-w-lg mx-auto", children: [_jsx("div", { className: "w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8", children: _jsx(Calculator, { className: "w-8 h-8 text-white" }) }), _jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Bienvenido al Portal McDonald's" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Tu asesor a\u00FAn no te ha asignado restaurantes. Puedes comenzar usando la herramienta de valoraci\u00F3n." }), _jsxs(Button, { onClick: onNavigateToValuation, className: "bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2", children: ["Herramienta de Valoraci\u00F3n", _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) }));
};
