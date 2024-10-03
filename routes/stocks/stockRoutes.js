import express from 'express';
import {  
    getAllStockMovements, 
    getStockMovementsByItem, 
    getStockMovement, 
    updateStockMovement, 
    deleteStockMovement, 
    recordStockMovement  } from '../../controllers/stockmovement/stockMovement.controller.js';
import { getStockMovementStatistics, analyzeRevenueTrends } from '../../controllers/stockmovement/getStockMovementStatistics.js';
import { authorizeRoles } from '../../utils/authorizeRoles.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The stock movement ID
 *           example: "60d5ec49b29c8e001c0f7c3f"
 *         item:
 *           type: string
 *           description: The ID of the associated inventory item
 *           example: "66f891ab8b389dbe3095bef9"
 *         itemName:
 *           type: string
 *           description: The name of the associated inventory item
 *           example: "Laptop"
 *         type:
 *           type: string
 *           description: Type of stock movement
 *           enum: [Purchase, Sale, Return, Adjustment]
 *           example: "Sale"
 *         quantityChange:
 *           type: number
 *           description: The change in quantity (positive for purchases, negative for sales)
 *           example: -10
 *         user:
 *           type: string
 *           description: ID of the user performing the action
 *           example: "66f83b37e854d1ad25e5026f"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The date and time when the stock movement was recorded
 *           example: "2024-01-01T10:00:00Z"
 *         notes:
 *           type: string
 *           description: Optional notes for the stock movement
 *           example: "Returned due to damage"
 */


/**
 * @swagger
 * /api/v1/stocks/stock-movements:
 *   post:
 *     summary: Record Stock Movement
 *     tags: [Stock Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: ID of the inventory item
 *                 example: 66f891ab8b389dbe3095bef9
 *               type:
 *                 type: string
 *                 enum: [Purchase, Sale, Return, Adjustment]
 *                 description: Type of the stock movement
 *                 example: Sale
 *               quantityChange:
 *                 type: number
 *                 description: Change in stock quantity (positive for Purchase/Return, negative for Sale/Adjustment)
 *                 example: 10
 *               user:
 *                 type: string
 *                 description: ID of the user performing the action
 *                 example: 66f83b37e854d1ad25e5026f
 *               notes:
 *                 type: string
 *                 description: Optional notes for the stock movement
 *                 example: "Returned due to damage"
 *     responses:
 *       201:
 *         description: Stock movement recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stock movement recorded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5ec49b29c8e001c0f7c3f"
 *                     item:
 *                       type: string
 *                       example: "66f891ab8b389dbe3095bef9"
 *                     type:
 *                       type: string
 *                       example: "Sale"
 *                     quantityChange:
 *                       type: number
 *                       example: -10
 *                     user:
 *                       type: string
 *                       example: "66f83b37e854d1ad25e5026f"
 *                     notes:
 *                       type: string
 *                       example: "Returned due to damage"
 *       400:
 *         description: Bad Request
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
 *                   example: "All fields are required"
 *       404:
 *         description: Inventory item not found
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
 *                   example: "Inventory item not found"
 */

router.post('/stock-movements',authorizeRoles("Admin"), recordStockMovement);


/**
 * @swagger
 * /api/v1/stocks/stock-movements:
 *   get:
 *     summary: Get all stock movements
 *     tags: [Stock Movements]
 *     responses:
 *       200:
 *         description: List of all stock movements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5ec49b29c8e001c0f7c3f"
 *                       item:
 *                         type: string
 *                         example: "66f891ab8b389dbe3095bef9"
 *                       type:
 *                         type: string
 *                         example: "Sale"
 *                       quantityChange:
 *                         type: number
 *                         example: -10
 *                       user:
 *                         type: string
 *                         example: "66f83b37e854d1ad25e5026f"
 *                       notes:
 *                         type: string
 *                         example: "Returned due to damage"
 *       500:
 *         description: Failed to retrieve stock movements
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
 *                   example: "Failed to retrieve stock movements"
 */
router.get('/stock-movements',authorizeRoles("Admin", "Manager"), getAllStockMovements);

/**
 * @swagger
 * /api/v1/stocks/stock-movements/item/{itemId}:
 *   get:
 *     summary: Get stock movements for a specific item
 *     tags: [Stock Movements]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the inventory item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stock movements for the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5ec49b29c8e001c0f7c3f"
 *                       type:
 *                         type: string
 *                         example: "Sale"
 *                       quantityChange:
 *                         type: number
 *                         example: -10
 *                       user:
 *                         type: string
 *                         example: "66f83b37e854d1ad25e5026f"
 *                       notes:
 *                         type: string
 *                         example: "Returned due to damage"
 *       404:
 *         description: No stock movements found for the item
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
 *                   example: "No stock movements found for this item"
 */
router.get('/stock-movements/item/:itemId', authorizeRoles("Admin", "Manager"), getStockMovementsByItem);

/**
 * @swagger
 * /api/v1/stocks/stock-movements/{id}:
 *   get:
 *     summary: Get a single stock movement by ID
 *     tags: [Stock Movements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the stock movement
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock movement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5ec49b29c8e001c0f7c3f"
 *                     item:
 *                       type: string
 *                       example: "66f891ab8b389dbe3095bef9"
 *                     type:
 *                       type: string
 *                       example: "Sale"
 *                     quantityChange:
 *                       type: number
 *                       example: -10
 *                     user:
 *                       type: string
 *                       example: "66f83b37e854d1ad25e5026f"
 *                     notes:
 *                       type: string
 *                       example: "Returned due to damage"
 *       404:
 *         description: Stock movement not found
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
 *                   example: "Stock movement not found"
 */
router.get('/stock-movements/:id', authorizeRoles("Admin", "Manager"), getStockMovement);

/**
 * @swagger
 * /api/v1/stocks/stock-movements/{id}:
 *   patch:
 *     summary: Update a stock movement
 *     tags: [Stock Movements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the stock movement
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Notes to update
 *                 example: "Updated notes"
 *     responses:
 *       200:
 *         description: Stock movement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stock movement updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5ec49b29c8e001c0f7c3f"
 *                     notes:
 *                       type: string
 *                       example: "Updated notes"
 *       404:
 *         description: Stock movement not found
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
 *                   example: "Stock movement not found"
 */
router.patch('/stock-movements/:id', authorizeRoles("Admin", "Manager"), updateStockMovement);

/**
 * @swagger
 * /api/v1/stocks/stock-movements/{id}:
 *   delete:
 *     summary: Delete a stock movement
 *     tags: [Stock Movements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the stock movement
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock movement deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stock movement deleted successfully"
 *       404:
 *         description: Stock movement not found
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
 *                   example: "Stock movement not found"
 */
router.delete('/stock-movements/:id', authorizeRoles("Admin", "Manager"), deleteStockMovement);

/**
 * @swagger
 * /api/v1/stocks/statistics:
 *   get:
 *     summary: Get stock movement statistics
 *     description: Retrieve statistics on stock movements grouped by type and date.
 *     responses:
 *       200:
 *         description: Successful response with stock movement statistics.
 *       500:
 *         description: Internal server error.
 */
router.get('/statistics', authorizeRoles("Admin", "Manager"), getStockMovementStatistics);

/**
 * @swagger
 * /api/v1/stocks/trends:
 *   get:
 *     summary: Analyze revenue trends
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: A summary of revenue trends for different time periods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 revenueData:
 *                   type: object
 *                   properties:
 *                     thisMonth:
 *                       type: object
 *                     lastMonth:
 *                       type: object
 *                     thisWeek:
 *                       type: object
 *                     lastWeek:
 *                       type: object
 *                     today:
 *                       type: object
 *                     yesterday:
 *                       type: object
 *       500:
 *         description: Internal server error
 */
router.get('/trends', authorizeRoles("Admin", "Manager"), analyzeRevenueTrends);



export default router;
