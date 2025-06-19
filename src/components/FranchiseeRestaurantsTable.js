import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Building, MapPin, Calendar, Euro, Hash, ExternalLink } from 'lucide-react';
const ITEMS_PER_PAGE = 40;
export const FranchiseeRestaurantsTable = ({ restaurants }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const formatDate = (dateString) => {
        if (!dateString)
            return '-';
        try {
            return new Date(dateString).toLocaleDateString('es-ES');
        }
        catch (error) {
            return '-';
        }
    };
    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount))
            return '-';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };
    const createGoogleMapsLink = (address, city) => {
        if (!address && !city)
            return null;
        const fullAddress = [address, city].filter(Boolean).join(', ');
        const encodedAddress = encodeURIComponent(fullAddress);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };
    // Calcular paginación
    const totalPages = Math.ceil(restaurants.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRestaurants = restaurants.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll suave hacia arriba de la tabla
        document.querySelector('[data-table-container]')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    console.log('FranchiseeRestaurantsTable - Rendering with restaurants:', restaurants);
    if (restaurants.length === 0) {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-5 h-5" }), "Restaurantes"] }) }), _jsx(CardContent, { className: "p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(Building, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No hay restaurantes asignados" }), _jsx("p", { className: "text-gray-600", children: "Este franquiciado a\u00FAn no tiene restaurantes asignados." })] }) })] }));
    }
    return (_jsxs(Card, { "data-table-container": true, children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-5 h-5" }), "Restaurantes (", restaurants.length, ")"] }), totalPages > 1 && (_jsxs("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, "-", Math.min(endIndex, restaurants.length), " de ", restaurants.length] }))] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Restaurante" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Fechas Franquicia" }), _jsx(TableHead, { children: "Renta Mensual" }), _jsx(TableHead, { children: "Facturaci\u00F3n" }), _jsx(TableHead, { children: "Estado" })] }) }), _jsx(TableBody, { children: currentRestaurants.map((restaurant) => {
                                        const baseRestaurant = restaurant.base_restaurant;
                                        const googleMapsLink = createGoogleMapsLink(baseRestaurant?.address, baseRestaurant?.city);
                                        console.log('FranchiseeRestaurantsTable - Processing restaurant:', restaurant);
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: baseRestaurant?.restaurant_name || 'Sin nombre' }), _jsxs("div", { className: "text-sm text-gray-500 flex items-center gap-1", children: [_jsx(Hash, { className: "w-3 h-3" }), baseRestaurant?.site_number || 'Sin número'] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-start gap-1", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 mt-0.5" }), _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: baseRestaurant?.city || 'Sin ciudad' }), googleMapsLink && (_jsx("a", { href: googleMapsLink, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-800 transition-colors", title: "Ver en Google Maps", children: _jsx(ExternalLink, { className: "w-3 h-3" }) }))] }), _jsx("div", { className: "text-gray-500", children: baseRestaurant?.address || 'Sin dirección' }), _jsx("div", { className: "text-gray-500", children: baseRestaurant?.state || baseRestaurant?.autonomous_community || '' })] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { children: baseRestaurant?.restaurant_type || '-' }), _jsx("div", { className: "text-gray-500", children: baseRestaurant?.property_type || '-' })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3 text-green-600" }), _jsxs("span", { children: ["Inicio: ", formatDate(restaurant.franchise_start_date)] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3 text-red-600" }), _jsxs("span", { children: ["Fin: ", formatDate(restaurant.franchise_end_date)] })] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Euro, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { children: formatCurrency(restaurant.monthly_rent) })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { children: ["A\u00F1o: ", formatCurrency(restaurant.last_year_revenue)] }), _jsxs("div", { className: "text-gray-500", children: ["Mensual: ", formatCurrency(restaurant.average_monthly_sales)] })] }) }), _jsx(TableCell, { children: _jsx(Badge, { className: `${restaurant.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}`, children: restaurant.status === 'active' ? 'Activo' : 'Inactivo' }) })] }, restaurant.id));
                                    }) })] }) }), totalPages > 1 && (_jsx("div", { className: "mt-6 flex justify-center", children: _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), className: currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(page), isActive: currentPage === page, className: "cursor-pointer", children: page }) }, page))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), className: currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) })] }) }) }))] })] }));
};
