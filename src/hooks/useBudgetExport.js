import { useCallback } from 'react';
export const useBudgetExport = () => {
    const exportToCSV = useCallback((data, year, restaurantName) => {
        const headers = ['Categoría', 'Subcategoría', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Total'];
        const csvContent = [
            headers.join(','),
            ...data
                .filter(row => !row.isCategory)
                .map(row => [
                `"${row.category}"`,
                `"${row.subcategory || ''}"`,
                row.jan,
                row.feb,
                row.mar,
                row.apr,
                row.may,
                row.jun,
                row.jul,
                row.aug,
                row.sep,
                row.oct,
                row.nov,
                row.dec,
                row.total
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `presupuesto_${restaurantName || 'restaurante'}_${year}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);
    const exportToExcel = useCallback((data, year, restaurantName) => {
        const headers = ['Categoría', 'Subcategoría', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Total'];
        let content = '<table border="1">';
        content += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        data.filter(row => !row.isCategory).forEach(row => {
            content += '<tr>';
            content += `<td>${row.category}</td>`;
            content += `<td>${row.subcategory || ''}</td>`;
            content += `<td>${row.jan}</td>`;
            content += `<td>${row.feb}</td>`;
            content += `<td>${row.mar}</td>`;
            content += `<td>${row.apr}</td>`;
            content += `<td>${row.may}</td>`;
            content += `<td>${row.jun}</td>`;
            content += `<td>${row.jul}</td>`;
            content += `<td>${row.aug}</td>`;
            content += `<td>${row.sep}</td>`;
            content += `<td>${row.oct}</td>`;
            content += `<td>${row.nov}</td>`;
            content += `<td>${row.dec}</td>`;
            content += `<td>${row.total}</td>`;
            content += '</tr>';
        });
        content += '</table>';
        const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `presupuesto_${restaurantName || 'restaurante'}_${year}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);
    return {
        exportToCSV,
        exportToExcel
    };
};
