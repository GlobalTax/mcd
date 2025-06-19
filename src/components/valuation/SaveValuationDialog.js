import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
const SaveValuationDialog = ({ isOpen, onOpenChange, valuationName, onValuationNameChange, onSave, currentValuationId }) => {
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Guardar Valoraci\u00F3n" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nombre de la Valoraci\u00F3n" }), _jsx(Input, { value: valuationName, onChange: (e) => onValuationNameChange(e.target.value), placeholder: "Ej: Valoraci\u00F3n Base 2024" })] }), _jsxs(Button, { onClick: onSave, className: "w-full", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), currentValuationId ? 'Actualizar' : 'Guardar'] })] })] }) }));
};
export default SaveValuationDialog;
