import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import Order from '../../models/order.Model.js';
import { getStartOfQuarter } from './getStartOfQuarter.js';


// Get revenue trends for the past 4 quarters
export const getQuarterlyRevenueBreakdown = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();

        // Define the past 4 quarters
        const quarters = [...Array(4)].map((_, i) => ({
            start: getStartOfQuarter(now, i),
            end: getStartOfQuarter(now, i - 1),
        }));

        // Query revenue for each quarter
        const quarterlyRevenue = await Promise.all(quarters.map(async ({ start, end }) => {
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
                quarter: `Q${Math.ceil((start.getMonth() + 1) / 3)} ${start.getFullYear()}`,
                totalRevenue: result.length ? result[0].totalRevenue : 0,
            };
        }));

        res.status(200).json({
            success: true,
            data: quarterlyRevenue.reverse(), // Reverse to show the most recent quarter first
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Failed to retrieve quarterly revenue trends", 500));
    }
});
