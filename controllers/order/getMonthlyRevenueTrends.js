import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import Order from '../../models/order.Model.js';

// Helper function to get the start of a month
const getStartOfMonth = (date, monthsAgo = 0) => {
    const adjustedDate = new Date(date.getFullYear(), date.getMonth() - monthsAgo, 1);
    return adjustedDate;
};

// Get revenue trends for the past 6 months
export const getMonthlyRevenueTrends = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();

        // Define the past 6 months
        const months = [...Array(6)].map((_, i) => ({
            start: getStartOfMonth(now, i),
            end: getStartOfMonth(now, i - 1),
        }));

        // Query revenue for each month
        const monthlyRevenue = await Promise.all(months.map(async ({ start, end }) => {
            const result = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lt: end },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                    },
                },
            ]);

            return {
                month: start.toLocaleString('default', { month: 'long', year: 'numeric' }),
                totalRevenue: result.length ? result[0].totalRevenue : 0,
            };
        }));

        res.status(200).json({
            success: true,
            data: monthlyRevenue.reverse(), // Reversed to show the most recent month first
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Failed to retrieve revenue trends", 500));
    }
});
