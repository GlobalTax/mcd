export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    }).format(value) + ' €';
};
export const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    }).format(value);
};
export const formatPercentage = (value, decimals = 2) => {
    return `${value.toFixed(decimals).replace('.', ',')}%`;
};
export const calculateRemainingYears = (changeDate, franchiseEndDate) => {
    if (!changeDate || !franchiseEndDate)
        return 0;
    const changeDateTime = new Date(changeDate);
    const endDateTime = new Date(franchiseEndDate);
    if (endDateTime <= changeDateTime)
        return 0;
    const diffTime = endDateTime.getTime() - changeDateTime.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const diffYears = diffDays / 365.25;
    return Math.round(diffYears * 10000) / 10000;
};
