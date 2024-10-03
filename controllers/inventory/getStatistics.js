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

        // Query database for each period count
        const result = {
            thisMonth: await InventoryItem.countDocuments({ createdAt: { $gte: periods.thisMonth } }),
            lastMonth: await InventoryItem.countDocuments({ createdAt: { $gte: periods.lastMonth, $lt: periods.thisMonth } }),
            thisWeek: await InventoryItem.countDocuments({ createdAt: { $gte: periods.thisWeek } }),
            lastWeek: await InventoryItem.countDocuments({ createdAt: { $gte: periods.lastWeek, $lt: periods.thisWeek } }),
            today: await InventoryItem.countDocuments({ createdAt: { $gte: periods.today } }),
            yesterday: await InventoryItem.countDocuments({ createdAt: { $gte: periods.yesterday, $lt: periods.today } })
        };

        res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return next(new ErrorHandler(error.message || "Server Error", 500));
    }
});
