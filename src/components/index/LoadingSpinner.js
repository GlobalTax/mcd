import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingSpinner = () => {
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4", children: _jsx("span", { className: "text-white font-bold text-xl", children: "M" }) }), _jsx("p", { className: "text-gray-600", children: "Cargando..." })] }) }));
};
