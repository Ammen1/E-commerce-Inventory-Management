import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: '',
    method: ["GET", "POST", "DELETE", "PUT"],
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

dbConnection();
app.use(errorMiddleware)

export default app;
