
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, RotateCcw } from 'lucide-react';

interface TableStyles {
  headerBg: string;
  headerTextColor: string;
  cellBg: string;
  cellTextColor: string;
  editableCellBg: string;
  borderColor: string;
  fontSize: string;
  fontFamily: string;
}

interface TableStyleEditorProps {
  styles: TableStyles;
  onStylesChange: (styles: TableStyles) => void;
}

const defaultStyles: TableStyles = {
  headerBg: '#1f2937',
  headerTextColor: '#ffffff',
  cellBg: '#ffffff',
  cellTextColor: '#374151',
  editableCellBg: '#dbeafe',
  borderColor: '#d1d5db',
  fontSize: '14px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const TableStyleEditor = ({ styles, onStylesChange }: TableStyleEditorProps) => {
  const [showEditor, setShowEditor] = useState(false);

  const handleStyleChange = (key: keyof TableStyles, value: string) => {
    onStylesChange({
      ...styles,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onStylesChange(defaultStyles);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Editor de Estilos de Tabla
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? 'Ocultar' : 'Mostrar'} Editor
          </Button>
        </div>
      </CardHeader>
      
      {showEditor && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="headerBg">Color de Fondo del Encabezado</Label>
              <div className="flex gap-2">
                <Input
                  id="headerBg"
                  type="color"
                  value={styles.headerBg}
                  onChange={(e) => handleStyleChange('headerBg', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.headerBg}
                  onChange={(e) => handleStyleChange('headerBg', e.target.value)}
                  placeholder="#1f2937"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="headerTextColor">Color de Texto del Encabezado</Label>
              <div className="flex gap-2">
                <Input
                  id="headerTextColor"
                  type="color"
                  value={styles.headerTextColor}
                  onChange={(e) => handleStyleChange('headerTextColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.headerTextColor}
                  onChange={(e) => handleStyleChange('headerTextColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cellBg">Color de Fondo de Celdas</Label>
              <div className="flex gap-2">
                <Input
                  id="cellBg"
                  type="color"
                  value={styles.cellBg}
                  onChange={(e) => handleStyleChange('cellBg', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.cellBg}
                  onChange={(e) => handleStyleChange('cellBg', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cellTextColor">Color de Texto de Celdas</Label>
              <div className="flex gap-2">
                <Input
                  id="cellTextColor"
                  type="color"
                  value={styles.cellTextColor}
                  onChange={(e) => handleStyleChange('cellTextColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.cellTextColor}
                  onChange={(e) => handleStyleChange('cellTextColor', e.target.value)}
                  placeholder="#374151"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editableCellBg">Color de Celdas Editables</Label>
              <div className="flex gap-2">
                <Input
                  id="editableCellBg"
                  type="color"
                  value={styles.editableCellBg}
                  onChange={(e) => handleStyleChange('editableCellBg', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.editableCellBg}
                  onChange={(e) => handleStyleChange('editableCellBg', e.target.value)}
                  placeholder="#dbeafe"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="borderColor">Color de Bordes</Label>
              <div className="flex gap-2">
                <Input
                  id="borderColor"
                  type="color"
                  value={styles.borderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={styles.borderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  placeholder="#d1d5db"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fontSize">Tamaño de Fuente</Label>
              <select
                id="fontSize"
                value={styles.fontSize}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="12px">12px</option>
                <option value="13px">13px</option>
                <option value="14px">14px</option>
                <option value="15px">15px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
              </select>
            </div>

            <div>
              <Label htmlFor="fontFamily">Fuente</Label>
              <select
                id="fontFamily"
                value={styles.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="Inter, system-ui, sans-serif">Inter</option>
                <option value="system-ui, sans-serif">System UI</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer por Defecto
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export { TableStyleEditor, defaultStyles };
export type { TableStyles };
