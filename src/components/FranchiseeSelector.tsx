
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Franchisee } from '@/types/restaurant';
import { Plus, Building } from 'lucide-react';

interface FranchiseeSelectorProps {
  franchisees: Franchisee[];
  selectedFranchisee: Franchisee | null;
  onSelectFranchisee: (franchisee: Franchisee) => void;
  onAddFranchisee: (franchisee: Omit<Franchisee, 'id' | 'createdAt' | 'restaurants'>) => void;
}

export function FranchiseeSelector({ 
  franchisees, 
  selectedFranchisee, 
  onSelectFranchisee, 
  onAddFranchisee 
}: FranchiseeSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFranchisee, setNewFranchisee] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFranchisee.name && newFranchisee.email) {
      onAddFranchisee(newFranchisee);
      setNewFranchisee({ name: '', email: '', phone: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Franquiciados</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Franquiciado
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Franquiciado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={newFranchisee.name}
                  onChange={(e) => setNewFranchisee(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newFranchisee.email}
                  onChange={(e) => setNewFranchisee(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newFranchisee.phone}
                  onChange={(e) => setNewFranchisee(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {franchisees.map((franchisee) => (
          <Card 
            key={franchisee.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedFranchisee?.id === franchisee.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectFranchisee(franchisee)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{franchisee.name}</h3>
                  <p className="text-sm text-gray-600">{franchisee.email}</p>
                  <p className="text-sm text-gray-500">
                    {franchisee.restaurants.length} restaurantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {franchisees.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay franquiciados</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer franquiciado</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Franquiciado
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
