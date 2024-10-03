import express from 'express';
import { createOrder, updateOrderStatus, getAllOrders, getOrderById, deleteOrder} from '../../controllers/order/orderController.js';
import { compareOrderTrends } from '../../controllers/order/getOrderStatistics.js';
import { authorizeRoles } from '../../utils/authorizeRoles.js';
import { getMonthlyRevenueTrends } from '../../controllers/order/getMonthlyRevenueTrends .js';
import { getQuarterlyProfitTrends } from '../../controllers/order/getQuarterlyProfitTrends.js';
import { getQuarterlyRevenueBreakdown } from '../../controllers/order/getQuarterlyRevenueBreakdown.js';


const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: The product ID (ObjectId)
 *         quantity:
 *           type: integer
 *           description: The number of items ordered
 *         price:
 *           type: number
 *           description: The price of a single item
 *         subtotal:
 *           type: number
 *           description: The subtotal for the ordered item
 * 
 *     Order:
 *       type: object
 *       properties:
 *         customer:
 *           type: string
 *           description: The ID of the customer (ObjectId)
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           description: The total amount of the order
 *         status:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Completed, Cancelled]
 *           default: "Pending"
 *         importantTransaction:
 *           type: boolean
 *           default: false
 */


/**
 * @swagger
 * /api/v1/order/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *             properties:
 *               customer:
 *                 type: string
 *                 description: The customer ID (ObjectId)
 *                 example: "66f83b37e854d1ad25e5026f"
 *               items:
 *                 type: array
 *                 description: List of items to be ordered
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: The product ID (ObjectId)
 *                       example: "66fc46a9dbb6dfbdf694403f"
 *                     quantity:
 *                       type: integer
 *                       description: The number of items ordered
 *                       example: 5
 *                     price:
 *                       type: number
 *                       description: The price of a single item
 *                       example: 40          
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *                   description: The created order object
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 */
router.post('/order', authorizeRoles("Admin", "Manager", "Employee"), createOrder);

/**
 * @swagger
 * /api/v1/order/order/status:
 *   put:
 *     summary: Update the order status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The order ID (ObjectId)
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Shipped, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */
router.put('/order/status', authorizeRoles("Admin", "Manager", "Employee"), updateOrderStatus);


/**
 * @swagger
 * /api/v1/order/statistics:
 *   get:
 *     summary: Retrieve order statistics for comparison
 *     responses:
 *       200:
 *         description: Order statistics for current and previous periods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orderStatistics:
 *                   type: object
 *                   properties:
 *                     thisMonth:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                           example: 10
 *                         totalRevenue:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               totalRevenue:
 *                                 type: number
 *                                 example: 1000
 *                     lastMonth:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                           example: 8
 *                         totalRevenue:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               totalRevenue:
 *                                 type: number
 *                                 example: 800
 *                     thisWeek:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                           example: 5
 *                         totalRevenue:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               totalRevenue:
 *                                 type: number
 *                                 example: 500
 *                     lastWeek:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                           example: 7
 *                         totalRevenue:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               totalRevenue:
 *                                 type: number
 *                                 example: 700
 *       500:
 *         description: Internal server error
 */
router.get('/statistics',authorizeRoles("Admin"), compareOrderTrends);

/**
 * @swagger
 * /api/v1/order/revenue/monthly:
 *   get:
 *     summary: Get monthly revenue trends for the past 6 months
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Successfully retrieved monthly revenue trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "January 2024"
 *                       totalRevenue:
 *                         type: number
 *                         example: 15000
 *       500:
 *         description: Failed to retrieve revenue trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve revenue trends"
 */

router.get('/revenue/monthly', getMonthlyRevenueTrends);

/**
 * @swagger
 * /api/v1/order/profit/quarterly:
 *   get:
 *     summary: Get quarterly profit trends for the past 4 quarters
 *     tags: [Profit]
 *     responses:
 *       200:
 *         description: Successfully retrieved quarterly profit trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quarter:
 *                         type: string
 *                         example: "Q1 2024"
 *                       profit:
 *                         type: number
 *                         example: 5000
 *       500:
 *         description: Failed to retrieve quarterly profit trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve quarterly profit trends"
 */

router.get('/profit/quarterly', getQuarterlyProfitTrends);

/**
 * @swagger
 * /api/v1/order/revenue/quarterly:
 *   get:
 *     summary: Get quarterly revenue breakdown for the past 4 quarters
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Successfully retrieved quarterly revenue breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quarter:
 *                         type: string
 *                         example: "Q1 2024"
 *                       totalRevenue:
 *                         type: number
 *                         example: 10000
 *       500:
 *         description: Failed to retrieve quarterly revenue breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve quarterly revenue trends"
 */

router.get('/revenue/quarterly', getQuarterlyRevenueBreakdown);
/**
 * @swagger
 * /api/v1/order/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "No orders found"
 */

/**
 * @swagger
 * /api/v1/order/orders/{orderId}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 */

/**
 * @swagger
 * /api/v1/order/orders/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Order deleted successfully"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 */

router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);
router.delete('/orders/:orderId', deleteOrder);
export default router;
