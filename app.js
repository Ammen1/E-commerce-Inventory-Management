import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { isAuthenticated } from "./utils/auth.js";

import InventoryItemRouter from "./routes/inventory/inventoryItemRoutes.js"
import UserRouter from "./routes/users/userRoutes.js";


import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import setupSwagger from './swagger.js';

const app = express();

dotenv.config();
// Swagger setup
setupSwagger(app);

app.use(
  cors({
    origin: '',
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Register user routes
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/inventory", isAuthenticated, InventoryItemRouter)

// Connect to DB
dbConnection();

// Error handling middleware
app.use(errorMiddleware);

export default app;
