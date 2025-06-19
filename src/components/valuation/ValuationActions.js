import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Save, FolderOpen } from 'lucide-react';
const ValuationActions = ({ selectedRestaurantId, onSaveClick, onLoadClick, currentValuationId }) => {
    if (!selectedRestaurantId)
        return null;
    return (_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: onSaveClick, className: "flex-1", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), currentValuationId ? 'Actualizar Valoración' : 'Guardar Valoración'] }), _jsxs(Button, { variant: "outline", onClick: onLoadClick, className: "flex-1", children: [_jsx(FolderOpen, { className: "w-4 h-4 mr-2" }), "Cargar Valoraci\u00F3n"] })] }));
};
export default ValuationActions;
