import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import ErrorHandler from '../../middlewares/error.js';
import InventoryItem from '../../models/inventoryItem.Model.js';
import { getStartOfPeriod } from '../getStartOfPeriod.js';

export const getStatistics = catchAsyncErrors(async (req, res, next) => {
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

        // Count documents for each period
        const result = {
            thisMonth: await InventoryItem.countDocuments({ createdAt: { $gte: periods.thisMonth } }).lean(),
            lastMonth: await InventoryItem.countDocuments({ createdAt: { $gte: periods.lastMonth, $lt: periods.thisMonth } }).lean(),
            thisWeek: await InventoryItem.countDocuments({ createdAt: { $gte: periods.thisWeek } }).lean(),
            lastWeek: await InventoryItem.countDocuments({ createdAt: { $gte: periods.lastWeek, $lt: periods.thisWeek } }).lean(),
            today: await InventoryItem.countDocuments({ createdAt: { $gte: periods.today } }).lean(),
            yesterday: await InventoryItem.countDocuments({ createdAt: { $gte: periods.yesterday, $lt: periods.today } }).lean()
        };

        res.status(200).json({
            success: true,
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return next(new ErrorHandler("Server Error", 500));
    }
});
