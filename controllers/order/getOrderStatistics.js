import { catchAsyncErrors } from '../../middlewares/catchAsyncError.js';
import Order from '../../models/order.Model.js';
import mongoose from 'mongoose';

export const compareOrderTrends = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7));

        const orderStatistics = {
            thisMonth: {
                totalOrders: await Order.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
                totalRevenue: await Order.aggregate([
                    { $match: { createdAt: { $gte: startOfThisMonth } } },
                    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
                ])
            },
            lastMonth: {
                totalOrders: await Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
                totalRevenue: await Order.aggregate([
                    { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
                    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
                ])
            },
            thisWeek: {
                totalOrders: await Order.countDocuments({ createdAt: { $gte: startOfThisWeek } }),
                totalRevenue: await Order.aggregate([
                    { $match: { createdAt: { $gte: startOfThisWeek } } },
                    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
                ])
            },
            lastWeek: {
                totalOrders: await Order.countDocuments({ createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek } }),
                totalRevenue: await Order.aggregate([
                    { $match: { createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek } } },
                    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
                ])
            },
        };

        res.status(200).json({
            success: true,
            orderStatistics
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Server Error", 500));
    }
});
