import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import Order from '../../models/order.Model.js';
import { getStartOfPeriod } from '../getStartOfPeriod.js';



export const analyzeRevenueTrends = catchAsyncErrors(async (req, res, next) => {
    try {
        const currentDate = new Date();
        const periods = {
            thisMonth: getStartOfPeriod(currentDate, 'month'),
            lastMonth: getStartOfPeriod(currentDate, 'lastMonth'),
            thisWeek: getStartOfPeriod(currentDate, 'week'),
            lastWeek: getStartOfPeriod(currentDate, 'lastWeek'),
            today: getStartOfPeriod(currentDate, 'day'),
            yesterday: getStartOfPeriod(currentDate, 'lastDay')
        };

        // Aggregate revenue data for each period
        const revenueData = {
            thisMonth: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.thisMonth } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            lastMonth: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.lastMonth, $lt: periods.thisMonth } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            thisWeek: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.thisWeek } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            lastWeek: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.lastWeek, $lt: periods.thisWeek } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            today: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.today } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            yesterday: await Order.aggregate([
                { $match: { createdAt: { $gte: periods.yesterday, $lt: periods.today } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ])
        };

        res.status(200).json({
            success: true,
            revenueData
        });
    } catch (error) {
        console.error("Error fetching revenue trends:", error);
        return next(new ErrorHandler(error.message || "Server Error", 500));
    }
});
