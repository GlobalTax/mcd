import { jsx as _jsx } from "react/jsx-runtime";
export const BudgetChangesBanner = ({ hasChanges }) => {
    if (!hasChanges)
        return null;
    return (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3", children: _jsx("p", { className: "text-sm text-yellow-800", children: "\u26A0\uFE0F Tienes cambios sin guardar. No olvides hacer clic en \"Guardar\" para preservar tus modificaciones." }) }));
};
