import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, } from '@/components/ui/sidebar';
import { Calculator, Calendar, BarChart3, Home, Settings, LogOut, User, Activity, Bell, GitCompare, FileText, UserPlus, Shield, BarChart, Lightbulb, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Valoración",
        url: "/valuation",
        icon: Calculator,
    },
    {
        title: "Comparar Valoraciones",
        url: "/valuation-comparison",
        icon: GitCompare,
    },
    {
        title: "Presupuestos",
        items: [
            {
                title: "Presupuesto Anual",
                href: "/annual-budget",
                icon: Calendar,
                badge: "Nuevo"
            },
            {
                title: "Reportes",
                href: "/budget-reports",
                icon: FileText,
                badge: "Nuevo"
            }
        ]
    },
    {
        title: "Análisis",
        url: "/analysis",
        icon: BarChart3,
    },
    {
        title: "Actividad",
        url: "/activity-history",
        icon: Activity,
    },
    {
        title: "Notificaciones",
        url: "/notifications",
        icon: Bell,
    },
    {
        title: "Administración",
        items: [
            {
                title: "Gestión de Usuarios",
                href: "/user-management",
                icon: User
            },
            {
                title: "Gestión Avanzada",
                href: "/advanced-user-management",
                icon: Shield,
                badge: "Nuevo"
            },
            {
                title: "Invitaciones",
                href: "/user-invitation",
                icon: UserPlus,
                badge: "Nuevo"
            },
            {
                title: "Reportes Avanzados",
                href: "/advanced-reporting",
                icon: BarChart,
                badge: "Nuevo"
            },
            {
                title: "Gestión de Mejoras",
                href: "/improvements",
                icon: Lightbulb,
                badge: "Nuevo"
            },
            {
                title: "Auditoría y Compliance",
                href: "/audit-compliance",
                icon: Eye,
                badge: "Nuevo"
            }
        ]
    },
];
export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };
    return (_jsxs(Sidebar, { className: "w-64", children: [_jsx(SidebarHeader, { className: "p-6 border-b", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "M" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900", children: "McDonald's" }), _jsx("p", { className: "text-xs text-gray-500", children: "Portal de Gesti\u00F3n" })] })] }) }), _jsx(SidebarContent, { className: "p-4", children: _jsxs(SidebarGroup, { children: [_jsx(SidebarGroupLabel, { className: "text-xs font-medium text-gray-500 uppercase tracking-wider mb-3", children: "Servicios" }), _jsx(SidebarGroupContent, { children: _jsx(SidebarMenu, { className: "space-y-1", children: menuItems.map((item) => (_jsx(SidebarMenuItem, { children: _jsx(SidebarMenuButton, { asChild: true, isActive: location.pathname === item.url, className: "w-full justify-start px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors", children: _jsxs("button", { onClick: () => navigate(item.url), children: [_jsx(item.icon, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: item.title })] }) }) }, item.title))) }) })] }) }), _jsx(SidebarFooter, { className: "p-4 border-t", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "px-3 py-2 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: user?.full_name || user?.email }), _jsx("p", { className: "text-xs text-gray-500", children: "Franquiciado" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/profile'), className: "flex-1 justify-start px-3", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), "Mi Perfil"] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/settings'), className: "flex-1 justify-start px-3", children: [_jsx(Settings, { className: "w-4 h-4 mr-2" }), "Configuraci\u00F3n"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleSignOut, className: "px-3 text-red-600 hover:text-red-700 hover:bg-red-50", children: _jsx(LogOut, { className: "w-4 h-4" }) })] })] }) })] }));
}
