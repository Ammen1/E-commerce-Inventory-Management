import express from "express";


import { 
     CreateInventory,
     getAllInventoryItems,
     updateInventoryItem, 
     deleteInventoryItem, 
     getInventoryItem } from "../../controllers/inventory/inventoryItem.controller.js";
import { getStatistics } from "../../controllers/inventory/getStatistics.js";
import { authorizeRoles } from "../../utils/authorizeRoles.js";
import { filterItemsController } from "../../controllers/inventory/filterItems.js"; 
import { getCategoryItem } from "../../controllers/inventory/getCategoryItemOne.js";
import { getCategoryWiseItem } from "../../controllers/inventory/getCategoryWiseItem.js";
import { searchProduct } from "../../controllers/inventory/searchItem.js";
import { generateInventoryReportPDF } from "../../controllers/generateInventoryReportPDF.js";


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

router.post("/inventory", authorizeRoles("Admin", "Manager"), CreateInventory);

/**
 * @swagger
 * /api/v1/inventory/inventory:
 *   get:
 *     summary: Get all inventory items (with search & filter)
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by item name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minQuantity
 *         schema:
 *           type: integer
 *         description: Minimum quantity filter
 *       - in: query
 *         name: maxQuantity
 *         schema:
 *           type: integer
 *         description: Maximum quantity filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
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
 *                 totalItems:
 *                   type: integer
 *                   example: 50
 *                 currentPage:
 *                   type: integer
 *                   example: 2
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Invalid input parameters
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
 *                   example: "Invalid query parameters"
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

router.get("/inventory", authorizeRoles("Admin", "Manager", "Employee"), getAllInventoryItems);

/**
 * @swagger
 * /api/v1/inventory/inventory/{id}:
 *   get:
 *     summary: Get an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the inventory item
 *     responses:
 *       200:
 *         description: Inventory item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InventoryItem'
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

router.get('/inventory/:id', authorizeRoles("Admin", "Manager", "Employee"), getInventoryItem);


/**
 * @swagger
 * /api/v1/inventory/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
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
 *                   example: Inventory item updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/InventoryItem'
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

router.put("/inventory/:id", authorizeRoles("Admin"), updateInventoryItem);

/**
 * @swagger
 * /api/v1/inventory/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inventory item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
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
 *                   example: Inventory item deleted successfully
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

router.delete("/inventory/:id", authorizeRoles("Admin"), deleteInventoryItem);


/**
 * @swagger
 * /api/v1/inventory/filter:
 *   post:
 *     summary: Filter inventory items based on category, name, or quantity
 *     tags: 
 *       - Inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Electronics", "Furniture"]
 *               name:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Laptop", "Chair"]
 *               quantity:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [5, 10]
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       price:
 *                         type: number
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: boolean
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: boolean
 */

router.post('/filter',authorizeRoles("Admin", "Manager" , "Employee"), filterItemsController);

/**
 * @swagger
 * /api/v1/inventory/categories:
 *   get:
 *     summary: Get one item from each category
 *     tags: 
 *       - Inventory
 *     responses:
 *       200:
 *         description: Successfully retrieved category items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category items retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       price:
 *                         type: number
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: boolean
 */
router.get('/categories',authorizeRoles("Admin", "Manager" , "Employee"), getCategoryItem);

/**
 * @swagger
 * /api/v1/inventory/category-items:
 *   get:
 *     summary: Get items based on category
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category to filter items by
 *     responses:
 *       200:
 *         description: Successfully retrieved items for the specified category
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
 *                   example: Items retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Laptop
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       price:
 *                         type: number
 *                         example: 1200
 *                 error:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad Request - category parameter is required
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
 *                   example: Category parameter is required
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
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
 *                   example: Server Error
 *                 error:
 *                   type: boolean
 *                   example: true
 */

router.get('/category-items',authorizeRoles("Admin", "Manager", "Employee"), getCategoryWiseItem);

/**
 * @swagger
 * /api/v1/inventory/search:
 *   get:
 *     summary: Search products by name or category
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query for products
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
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
 *                   example: Search item list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Laptop
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       price:
 *                         type: number
 *                         example: 1200
 *       400:
 *         description: Bad Request - search query is missing or empty
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
 *                   example: Search query cannot be empty
 *                 error:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
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
 *                   example: Server Error
 */

router.get('/search',authorizeRoles("Admin", "Manager", "Employee"), searchProduct);

/**
 * @swagger
 * /api/v1/inventory/pdf:
 *   get:
 *     summary: Generate an inventory report in PDF format
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *       500:
 *         description: Error generating report
 */
router.get('/pdf',authorizeRoles("Admin"), generateInventoryReportPDF);

/**
 * @swagger
 * /api/v1/inventory/statistics:
 *   get:
 *     summary: Retrieve inventory statistics for the current month, week, and day.
 *     description: Fetch statistics such as item count for this month, last month, this week, last week, today, and yesterday.
 *     responses:
 *       200:
 *         description: Inventory statistics successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     thisMonth:
 *                       type: integer
 *                       description: Items added this month
 *                     lastMonth:
 *                       type: integer
 *                       description: Items added last month
 *                     thisWeek:
 *                       type: integer
 *                       description: Items added this week
 *                     lastWeek:
 *                       type: integer
 *                       description: Items added last week
 *                     today:
 *                       type: integer
 *                       description: Items added today
 *                     yesterday:
 *                       type: integer
 *                       description: Items added yesterday
 *       500:
 *         description: Internal server error
 */

router.get('/statistics',authorizeRoles("Admin"), getStatistics);

export default router;
