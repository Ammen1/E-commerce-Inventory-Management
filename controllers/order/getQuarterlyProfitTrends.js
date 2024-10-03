import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import Order from '../../models/order.Model.js';
import { getStartOfQuarter } from './getStartOfQuarter.js';

// Get profit trends for the past 4 quarters
export const getQuarterlyProfitTrends = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();

        // Define the past 4 quarters
        const quarters = [...Array(4)].map((_, i) => ({
            start: getStartOfQuarter(now, i),
            end: getStartOfQuarter(now, i - 1),
        }));

        // Query profit for each quarter
        const quarterlyProfit = await Promise.all(quarters.map(async ({ start, end }) => {
            const revenue = await Order.aggregate([
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

            const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0;

            // I am not have cost field in my model but i use for const number by default
            const costs = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lt: end },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCosts: { $sum: "$cost" },
                    },
                },
            ]);

            const totalCosts = costs.length ? costs[0].totalCosts : 0;

            const profit = totalRevenue - 5000; //default value for test case

            return {
                quarter: `Q${Math.ceil((start.getMonth() + 1) / 3)} ${start.getFullYear()}`,
                profit,
            };
        }));

        res.status(200).json({
            success: true,
            data: quarterlyProfit.reverse(), // Reverse to show the most recent quarter first
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Failed to retrieve quarterly profit trends", 500));
    }
});
