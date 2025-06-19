import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import DCFTable from '@/components/DCFTable';
export default function ValuationApp() {
    return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen flex w-full bg-gray-50", children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "flex-1", children: [_jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Valoraci\u00F3n DCF" }), _jsx("p", { className: "text-sm text-gray-500", children: "Modelo de valoraci\u00F3n por flujo de caja descontado" })] })] }), _jsx("main", { className: "flex-1", children: _jsx(DCFTable, {}) })] })] }) }));
}
