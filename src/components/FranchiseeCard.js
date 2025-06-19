import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const FranchiseeCard = ({ franchisee, onEdit, onDelete, onAssignRestaurant }) => {
    const navigate = useNavigate();
    const handleViewDetails = () => {
        navigate(`/advisor/franchisee/${franchisee.id}`);
    };
    return (_jsxs(Card, { className: "hover:shadow-lg transition-shadow cursor-pointer", onClick: handleViewDetails, children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-lg", children: franchisee.franchisee_name }), _jsxs(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-200", children: [franchisee.total_restaurants || 0, " Restaurantes"] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [franchisee.company_name && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Building, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm", children: franchisee.company_name })] })), franchisee.tax_id && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-xs font-medium text-gray-500", children: "CIF/NIF:" }), _jsx("span", { className: "text-sm", children: franchisee.tax_id })] })), franchisee.city && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-500" }), _jsxs("span", { className: "text-sm", children: [franchisee.city, ", ", franchisee.state] })] })), _jsxs("div", { className: "flex justify-between items-center pt-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                    e.stopPropagation();
                                    onAssignRestaurant(franchisee);
                                }, className: "text-xs", children: [_jsx(Plus, { className: "w-3 h-3 mr-1" }), "Asignar"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                            e.stopPropagation();
                                            handleViewDetails();
                                        }, children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                            e.stopPropagation();
                                            onEdit(franchisee);
                                        }, children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: (e) => {
                                            e.stopPropagation();
                                            onDelete(franchisee);
                                        }, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] })] }));
};
