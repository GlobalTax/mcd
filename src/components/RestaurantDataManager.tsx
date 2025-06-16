import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Restaurant, Franchisee } from '@/types/restaurant';
import { Plus, Edit, MapPin, Euro, Building2, Hash, Calendar, Shield, TrendingUp } from 'lucide-react';

interface RestaurantDataManagerProps {
  franchisees: Franchisee[];
  onUpdateFranchisees: (franchisees: Franchisee[]) => void;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export function RestaurantDataManager({ franchisees, onUpdateFranchisees, onSelectRestaurant }: RestaurantDataManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contractEndDate: '',
    siteNumber: '',
    lastYearRevenue: 0,
    baseRent: 0,
    rentIndex: 0,
    franchiseeId: '',
    franchiseEndDate: '',
    leaseEndDate: '',
    isOwnedByMcD: false
  });

  // Get all restaurants from all franchisees
  const allRestaurants = franchisees.flatMap(f => 
    f.restaurants.map(r => ({ ...r, franchiseeName: f.name }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.franchiseeId || !formData.franchiseEndDate) return;

    const restaurantData = {
      ...formData,
      id: editingRestaurant?.id || Date.now().toString(),
      valuationHistory: editingRestaurant?.valuationHistory || [],
      currentValuation: editingRestaurant?.currentValuation,
      createdAt: editingRestaurant?.createdAt || new Date(),
      // Don't include leaseEndDate if it's owned by McD
      leaseEndDate: formData.isOwnedByMcD ? undefined : formData.leaseEndDate
    };

    const updatedFranchisees = franchisees.map(f => {
      if (f.id === formData.franchiseeId) {
        if (editingRestaurant) {
          // Update existing restaurant
          return {
            ...f,
            restaurants: f.restaurants.map(r => 
              r.id === editingRestaurant.id ? restaurantData : r
            )
          };
        } else {
          // Add new restaurant
          return {
            ...f,
            restaurants: [...f.restaurants, restaurantData]
          };
        }
      }
      return f;
    });

    onUpdateFranchisees(updatedFranchisees);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      contractEndDate: '',
      siteNumber: '',
      lastYearRevenue: 0,
      baseRent: 0,
      rentIndex: 0,
      franchiseeId: '',
      franchiseEndDate: '',
      leaseEndDate: '',
      isOwnedByMcD: false
    });
    setShowAddForm(false);
    setEditingRestaurant(null);
  };

  const handleEdit = (restaurant: Restaurant & { franchiseeName: string }) => {
    setFormData({
      name: restaurant.name,
      location: restaurant.location,
      contractEndDate: restaurant.contractEndDate,
      siteNumber: restaurant.siteNumber,
      lastYearRevenue: restaurant.lastYearRevenue || 0,
      baseRent: restaurant.baseRent || 0,
      rentIndex: restaurant.rentIndex || 0,
      franchiseeId: restaurant.franchiseeId,
      franchiseEndDate: restaurant.franchiseEndDate || '',
      leaseEndDate: restaurant.leaseEndDate || '',
      isOwnedByMcD: restaurant.isOwnedByMcD || false
    });
    setEditingRestaurant(restaurant);
    setShowAddForm(true);
  };

  const handleValuationClick = (restaurant: Restaurant & { franchiseeName: string }) => {
    if (onSelectRestaurant) {
      onSelectRestaurant(restaurant);
    }
  };

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('es-ES');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel Central de Restaurantes</h2>
          <p className="text-gray-600">{allRestaurants.length} restaurantes registrados en total</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Restaurante
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingRestaurant ? 'Editar Restaurante' : 'Agregar Nuevo Restaurante'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="franchisee">Franquiciado *</Label>
                  <select
                    id="franchisee"
                    value={formData.franchiseeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, franchiseeId: e.target.value }))}
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Seleccionar franquiciado</option>
                    {franchisees.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="siteNumber">Número de Site *</Label>
                  <Input
                    id="siteNumber"
                    value={formData.siteNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteNumber: e.target.value }))}
                    placeholder="ej. MCB001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="restaurantName">Nombre del Restaurante *</Label>
                  <Input
                    id="restaurantName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej. McDonald's Parc Central"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="ej. Barcelona, España"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contractEnd">Fecha Fin de Contrato *</Label>
                  <Input
                    id="contractEnd"
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractEndDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="franchiseEnd">Fecha Fin de Franquicia *</Label>
                  <Input
                    id="franchiseEnd"
                    type="date"
                    value={formData.franchiseEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, franchiseEndDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="isOwnedByMcD" className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOwnedByMcD"
                      checked={formData.isOwnedByMcD}
                      onChange={(e) => setFormData(prev => ({ ...prev, isOwnedByMcD: e.target.checked }))}
                      className="rounded"
                    />
                    Propiedad de McDonald's
                  </Label>
                </div>

                {!formData.isOwnedByMcD && (
                  <div>
                    <Label htmlFor="leaseEnd">Fecha Fin de Alquiler</Label>
                    <Input
                      id="leaseEnd"
                      type="date"
                      value={formData.leaseEndDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, leaseEndDate: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="lastYearRevenue">Facturación Último Año (€)</Label>
                  <Input
                    id="lastYearRevenue"
                    type="number"
                    value={formData.lastYearRevenue}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastYearRevenue: Number(e.target.value) }))}
                    placeholder="2454919"
                  />
                </div>

                <div>
                  <Label htmlFor="baseRent">Renta Base (€)</Label>
                  <Input
                    id="baseRent"
                    type="number"
                    value={formData.baseRent}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseRent: Number(e.target.value) }))}
                    placeholder="281579"
                  />
                </div>

                <div>
                  <Label htmlFor="rentIndex">Rent Index (€)</Label>
                  <Input
                    id="rentIndex"
                    type="number"
                    value={formData.rentIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, rentIndex: Number(e.target.value) }))}
                    placeholder="75925"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  {editingRestaurant ? 'Actualizar' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site #</TableHead>
                <TableHead>Restaurante</TableHead>
                <TableHead>Franquiciado</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fin Franquicia</TableHead>
                <TableHead>Fin Alquiler</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Facturación</TableHead>
                <TableHead>Renta Base</TableHead>
                <TableHead>Rent Index</TableHead>
                <TableHead>Valoración</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRestaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {restaurant.siteNumber}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{restaurant.name}</TableCell>
                  <TableCell>{restaurant.franchiseeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {restaurant.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {restaurant.franchiseEndDate ? new Date(restaurant.franchiseEndDate).toLocaleDateString('es-ES') : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      {restaurant.isOwnedByMcD ? 
                        <span className="text-green-600 font-medium">Propiedad McD</span> : 
                        (restaurant.leaseEndDate ? new Date(restaurant.leaseEndDate).toLocaleDateString('es-ES') : 'N/A')
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {restaurant.isOwnedByMcD ? (
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">McD</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Alquiler</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro className="w-4 h-4 text-green-600" />
                      {formatNumber(restaurant.lastYearRevenue)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      {formatNumber(restaurant.baseRent)}
                    </div>
                  </TableCell>
                  <TableCell>€{formatNumber(restaurant.rentIndex)}</TableCell>
                  <TableCell>
                    {restaurant.currentValuation ? (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-green-800">
                          €{formatNumber(restaurant.currentValuation.finalValuation)}
                        </p>
                        <p className="text-xs text-green-600">
                          {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Sin valorar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(restaurant)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleValuationClick(restaurant)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {allRestaurants.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay restaurantes registrados</h3>
              <p className="text-gray-600 mb-6">Comienza agregando el primer restaurante al sistema</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Restaurante
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
