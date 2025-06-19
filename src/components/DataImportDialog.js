import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useDataImport } from '@/hooks/useDataImport';
import { toast } from 'sonner';
export const DataImportDialog = ({ onImportComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [csvData, setCsvData] = useState('');
    const { importing, progress, importRestaurantsData } = useDataImport();
    const handleImport = async () => {
        if (!csvData.trim()) {
            toast.error('Por favor, ingresa los datos para importar');
            return;
        }
        try {
            // Parsear datos CSV (asumiendo que están separados por tabulaciones)
            const lines = csvData.trim().split('\n');
            const data = lines.map(line => {
                const columns = line.split('\t');
                return {
                    site: columns[0] || '',
                    nombre: columns[1] || '',
                    estado: columns[2] || '',
                    tipoInmueble: columns[3] || '',
                    direccion: columns[4] || '',
                    telRestaurante: columns[5] || '',
                    municipio: columns[6] || '',
                    provincia: columns[7] || '',
                    comAutonoma: columns[8] || '',
                    franquiciado: columns[9] || '',
                    telfFranquiciado: columns[10] || '',
                    fechaApertura: columns[11] || '',
                    mailFranquiciado: columns[12] || '',
                    nifSociedad: columns[13] || ''
                };
            });
            await importRestaurantsData(data);
            setIsOpen(false);
            setCsvData('');
            onImportComplete();
        }
        catch (error) {
            console.error('Error parsing data:', error);
            toast.error('Error al procesar los datos');
        }
    };
    return (_jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: "flex items-center gap-2", children: [_jsx(Upload, { className: "w-4 h-4" }), "Importar Datos"] }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(FileSpreadsheet, { className: "w-5 h-5" }), "Importar Datos de Restaurantes"] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Pega los datos de Excel/CSV aqu\u00ED (separados por tabulaciones):" }), _jsx(Textarea, { value: csvData, onChange: (e) => setCsvData(e.target.value), placeholder: "SITE\tNOMBRE\tESTADO\tTIPO INMUEBLE\tDIRECCI\u00D3N\tTEL RESTAURANTE\tMUNICIPIO\tPROVINCIA\tCOM. AUTONOMA\tFRANQUICIADO\tTELF. FRANQUICIADO\tFECHA APERTURA\tMAIL FRANQUICIADO\tNIF SOCIEDAD", className: "min-h-[200px] font-mono text-xs", disabled: importing })] }), importing && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Importando datos..." }), _jsxs("span", { children: [Math.round(progress), "%"] })] }), _jsx(Progress, { value: progress, className: "w-full" })] })), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpen(false), disabled: importing, children: "Cancelar" }), _jsx(Button, { onClick: handleImport, disabled: importing || !csvData.trim(), children: importing ? 'Importando...' : 'Importar Datos' })] })] })] })] }));
};
