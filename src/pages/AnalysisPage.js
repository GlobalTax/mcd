import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AnalysisDashboard } from '@/components/analysis/AnalysisDashboard';
const AnalysisPage = () => {
    return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen flex w-full bg-gray-50", children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "flex-1", children: [_jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "An\u00E1lisis" }), _jsx("p", { className: "text-sm text-gray-500", children: "An\u00E1lisis financiero y de rendimiento" })] })] }), _jsx("main", { className: "flex-1 p-6", children: _jsx(AnalysisDashboard, {}) })] })] }) }));
};
export default AnalysisPage;
