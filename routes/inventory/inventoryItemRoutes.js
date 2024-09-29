import express from "express";
import { CreateInventory, getAll } from "../../controllers/inventory/inventoryItem.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The inventory ID
 *           example: "66f891ab8b389dbe3095bef9"
 *         name:
 *           type: string
 *           description: The name of the item
 *           example: "Laptop"
 *         description:
 *           type: string
 *           description: The description of the item
 *           example: "High-performance laptop"
 *         category:
 *           type: string
 *           description: Category of the item
 *           example: "Electronics"
 *         price:
 *           type: number
 *           description: Price of the item
 *           example: 1200.50
 *         quantity:
 *           type: number
 *           description: Available quantity
 *           example: 15
 *         lowStockThreshold:
 *           type: number
 *           description: Minimum stock before notification
 *           example: 5
 *         author:
 *           type: string
 *           description: User ID of the author
 *           example: "66f83b37e854d1ad25e5026f"
 */

/**
 * @swagger
 * /api/v1/inventory/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created successfully
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
 *                   example: Inventory item created successfully
 *                 data:
 *                   $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Invalid input data
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

router.post("/inventory", CreateInventory);

/**
 * @swagger
 * /api/v1/inventory/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
 *       500:
 *         description: Server error
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
 *                   example: "Server error"
 */

router.get("/inventory", getAll);

export default router;
