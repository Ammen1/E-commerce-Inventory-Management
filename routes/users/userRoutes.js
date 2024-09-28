import express from "express";
import { register, login } from "../../controllers/userControllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password (must be strong)
 *           minLength: 8
 *           example: Amen#197
 *         phone:
 *           type: string
 *           description: The user's phone number (must be 10 digits)
 *           minLength: 10
 *           maxLength: 10
 *         role:
 *           type: string
 *           description: User role (Admin, Manager, Employee)
 *       example:
 *         name: Amen Guda
 *         email: a@a.com
 *         password: Amen#197
 *         phone: 1944365493
 *         role: Admin
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User Registered!
 *       400:
 *         description: Bad request - Phone number must be exactly 10 digits! or email already registered
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               role:
 *                 type: string
 *                 description: User's role (Admin, Manager, Employee.)
 *             required:
 *               - email
 *               - password
 *               - role
 *             example:
 *               email: amenguda@gmail.com
 *               password: Amen#19712
 *               role: Admin
 *     responses:
 *       200:
 *         description: User Logged In!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: User Logged In!
 *                 token:
 *                   type: string
 *                   description: JWT token for the user session
 *       400:
 *         description: Invalid Email Or Password
 */

router.post("/register", register);
router.post("/login", login);

export default router;
