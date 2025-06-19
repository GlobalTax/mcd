// Helper functions for type conversion
export const convertToYearlyData = (data) => {
    if (!Array.isArray(data))
        return [];
    return data.map(item => ({
        sales: item.sales || 0,
        pac: item.pac || 0,
        pacPercentage: item.pacPercentage || 0,
        rent: item.rent || 0,
        rentPercentage: item.rentPercentage || 0,
        serviceFees: item.serviceFees || 0,
        depreciation: item.depreciation || 0,
        interest: item.interest || 0,
        rentIndex: item.rentIndex || 0,
        miscell: item.miscell || 0,
        loanPayment: item.loanPayment || 0,
        reinversion: item.reinversion || 0,
    }));
};
export const convertToRecord = (data) => {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        return data;
    }
    return {};
};
