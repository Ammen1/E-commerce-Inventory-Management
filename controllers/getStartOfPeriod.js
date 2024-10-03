// Utility function for date calculations
export const getStartOfPeriod = (date, periodType) => {
    switch (periodType) {
        case 'month':
            return new Date(date.getFullYear(), date.getMonth(), 1);
        case 'lastMonth':
            return new Date(date.getFullYear(), date.getMonth() - 1, 1);
        case 'week':
            return new Date(date.setDate(date.getDate() - date.getDay()));
        case 'lastWeek':
            return new Date(date.setDate(date.getDate() - date.getDay() - 7));
        case 'day':
            return new Date(date.setHours(0, 0, 0, 0));
        case 'lastDay':
            return new Date(date.setHours(-24, 0, 0, 0));
        default:
            return date;
    }
};