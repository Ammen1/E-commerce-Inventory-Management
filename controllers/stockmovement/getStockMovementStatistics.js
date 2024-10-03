import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import { StockMovement } from '../../models/stockMovement.Model.js';
import Order from '../../models/order.Model.js';
import { getStartOfPeriod } from '../getStartOfPeriod.js';

export const getStockMovementStatistics = catchAsyncErrors(async (req, res, next) => {
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

        // Query database for each period count
        const result = {
            thisMonth: await StockMovement.countDocuments({ timestamp: { $gte: periods.thisMonth } }),
            lastMonth: await StockMovement.countDocuments({ timestamp: { $gte: periods.lastMonth, $lt: periods.thisMonth } }),
            thisWeek: await StockMovement.countDocuments({ timestamp: { $gte: periods.thisWeek } }),
            lastWeek: await StockMovement.countDocuments({ timestamp: { $gte: periods.lastWeek, $lt: periods.thisWeek } }),
            today: await StockMovement.countDocuments({ timestamp: { $gte: periods.today } }),
            yesterday: await StockMovement.countDocuments({ timestamp: { $gte: periods.yesterday, $lt: periods.today } })
        };

        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.error("Error fetching stock movement statistics:", error);
        return next(new ErrorHandler(error.message || "Server Error", 500));
    }
});


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
