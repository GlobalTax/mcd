
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, MapPin, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Franchisee } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface FranchiseeCardProps {
  franchisee: Franchisee;
  onEdit: (franchisee: Franchisee) => void;
  onDelete: (franchisee: Franchisee) => void;
  onAssignRestaurant: (franchisee: Franchisee) => void;
}

export const FranchiseeCard: React.FC<FranchiseeCardProps> = ({
  franchisee,
  onEdit,
  onDelete,
  onAssignRestaurant
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/advisor/franchisee/${franchisee.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{franchisee.franchisee_name}</span>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {franchisee.total_restaurants || 0} Restaurantes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {franchisee.company_name && (
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{franchisee.company_name}</span>
          </div>
        )}
        
        {franchisee.tax_id && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">CIF/NIF:</span>
            <span className="text-sm">{franchisee.tax_id}</span>
          </div>
        )}
        
        {franchisee.city && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{franchisee.city}, {franchisee.state}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onAssignRestaurant(franchisee);
            }}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Asignar
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(franchisee);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(franchisee);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
