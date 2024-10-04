import express from 'express';
import {
  initiateTransaction,
  verifyTransaction,
  getAllTransactions
} from '../../controllers/transactionController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management
 */

/**
 * @swagger
 * /api/v1/payment/initiate:
 *   post:
 *     tags: [Transactions]
 *     summary: Initiate a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - amount
 *               - currency
 *               - callbackUrl
 *               - returnUrl
 *               - items
 *               - customization
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 default: "amenguda@gmail.com"
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 default: "John"
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 default: "Doe"
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Transaction amount (must be positive)
 *                 default: 1000
 *               currency:
 *                 type: string
 *                 enum: ['USD', 'ETB', 'NGN', 'KES', 'GBP']
 *                 description: Currency for the transaction
 *                 default: "USD"
 *               callbackUrl:
 *                 type: string
 *                 format: uri
 *                 description: Callback URL for transaction results
 *                 default: "http://localhost:5000/api/transactions/verify/tx-1234567890"
 *               returnUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to redirect after payment
 *                 default: "http://localhost:5000/thank-you"
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID of the item being purchased
 *                 description: Array of item IDs
 *                 default: ["66ffabdbc536c55726c31c6c"]
 *               customization:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title for the transaction
 *                     default: "Product Payment"
 *                   description:
 *                     type: string
 *                     description: Description of the transaction
 *                     default: "Payment for service"
 *     responses:
 *       200:
 *         description: Transaction initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Hosted Link"
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     data:
 *                       type: object
 *                       properties:
 *                         checkout_url:
 *                           type: string
 *                           format: uri
 *                           example: "https://checkout.chapa.co/checkout/payment/ND1zY0kfuS5W3ZDVsibND4A0tqr6rNcV1q7eqWka2176i"
 *                     tx_ref:
 *                       type: string
 *                       example: "tx-1728037011039"
 *                 txRef:
 *                   type: string
 *                   example: "tx-1728037011039"
 *       400:
 *         description: Bad request (validation errors)
 *       500:
 *         description: Internal server error
 */

router.post('/initiate', initiateTransaction);

/**
 * @swagger
 * /api/v1/payment/verify/{txId}:
 *   get:
 *     tags: [Transactions]
 *     summary: Verify a transaction by ID
 *     parameters:
 *       - name: txId
 *         in: path
 *         required: true
 *         description: The transaction ID to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction verified successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get('/verify/:txId', verifyTransaction);

/**
 * @swagger
 * /api/v1/payment:
 *   get:
 *     tags: [Transactions]
 *     summary: Retrieve all transactions
 *     responses:
 *       200:
 *         description: A list of transactions
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllTransactions);

export default router;
