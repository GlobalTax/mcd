import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { FinancialStatementTabs } from '@/components/profitloss/FinancialStatementTabs';
const ProfitLossPage = () => {
    const { siteNumber } = useParams();
    if (!siteNumber) {
        return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen flex w-full bg-gray-50", children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "flex-1", children: [_jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Estados Financieros" }), _jsx("p", { className: "text-sm text-gray-500", children: "An\u00E1lisis completo de rentabilidad" })] })] }), _jsx("main", { className: "flex-1 p-6", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("p", { className: "text-red-600", children: "No se especific\u00F3 el n\u00FAmero de restaurante" }) }) })] })] }) }));
    }
    return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen flex w-full bg-gray-50", children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "flex-1", children: [_jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Estados Financieros" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["An\u00E1lisis completo - Restaurante #", siteNumber] })] })] }), _jsx("main", { className: "flex-1 p-6", children: _jsx(FinancialStatementTabs, { restaurantId: siteNumber }) })] })] }) }));
};
export default ProfitLossPage;
