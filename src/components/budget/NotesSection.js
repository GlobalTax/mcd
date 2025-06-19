import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
export const NotesSection = ({ formData, onInputChange }) => {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Notas" }) }), _jsx(CardContent, { children: _jsx(Textarea, { value: formData.notes || '', onChange: (e) => onInputChange('notes', e.target.value), placeholder: "A\u00F1ade cualquier nota o comentario adicional...", rows: 3 }) })] }));
};
