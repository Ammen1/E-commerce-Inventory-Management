// Helper function to get the start of a quarter
export const getStartOfQuarter = (date, quartersAgo = 0) => {
    const quarter = Math.floor(date.getMonth() / 3);
    const month = quarter * 3; // Start month of the quarter
    return new Date(date.getFullYear(), month - (quartersAgo * 3), 1);
};